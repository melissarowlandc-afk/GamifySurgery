import type {QuestionShipAcceptance,QuestionShipCaseReplacement,QuestionShipTopicConsolidation} from "./question-ship-manifest";
import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";
export const PROGRAM_BATCH6_ROWS: QuestionShipAcceptance[] = [
  {
    "acceptanceId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.node-sample",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "conceptId": "concept.pediatric-neck-thoracic-gu.inadequate-node-sample-escalation.v1",
    "sourceView": "topic-batch6-pediatric-neck-thoracic-gu",
    "decision": "docs/research/question-topic-acceptance-batch6-20261112.md"
  },
  {
    "acceptanceId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "conceptId": "concept.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy-route.v1",
    "sourceView": "topic-batch6-pediatric-neck-thoracic-gu",
    "decision": "docs/research/question-topic-acceptance-batch6-20261112.md"
  },
  {
    "acceptanceId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "conceptId": "concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v2",
    "sourceView": "topic-batch6-pediatric-neck-thoracic-gu",
    "decision": "docs/research/question-topic-acceptance-batch6-20261112.md"
  },
  {
    "acceptanceId": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "conceptId": "concept.pediatric-neck-thoracic-gu.cdh-physiologic-readiness.v1",
    "sourceView": "topic-batch6-pediatric-neck-thoracic-gu",
    "decision": "docs/research/question-topic-acceptance-batch6-20261112.md"
  }
];
export const PROGRAM_BATCH6_REPLACEMENTS: QuestionShipCaseReplacement[] = [
  {
    "replaces": "case.pediatric-clinic.growing-firm-neck-node",
    "with": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1"
  },
  {
    "replaces": "case.pediatric-clinic.retractile-testis-remains-scrotal",
    "with": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2"
  }
];
export const PROGRAM_BATCH6_CONSOLIDATIONS: QuestionShipTopicConsolidation[] = [];
export const PROGRAM_BATCH6_VIEWS: Record<string,SyntheticClinicalRelease> = {
  "topic-batch6-pediatric-neck-thoracic-gu": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.pediatric-neck-thoracic-gu.inadequate-node-sample-escalation.v1",
        "displayName": "Act on nonrepresentative node sampling",
        "learningObjective": "Recognize a nonrepresentative needle specimen and select representative biopsy for a persistent concerning cervical node.",
        "earliestFacilityStage": 4,
        "conceptType": "workup"
      },
      {
        "id": "concept.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy-route.v1",
        "displayName": "Choose a safer tissue route with mediastinal compression",
        "learningObjective": "Use positional respiratory symptoms and airway compression to choose a peripheral biopsy strategy in specialist care.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v2",
        "displayName": "Recognize the need for chromosomal assessment",
        "learningObjective": "Interpret a completed 46,XX result with bilateral nonpalpable gonads and choose initial adrenal screening rather than a testicular-function or confirmatory-stage study.",
        "earliestFacilityStage": 4,
        "conceptType": "workup"
      },
      {
        "id": "concept.pediatric-neck-thoracic-gu.cdh-physiologic-readiness.v1",
        "displayName": "Sequence diaphragmatic repair with physiology",
        "learningObjective": "Interpret a worsening support trajectory in congenital diaphragmatic hernia and choose stabilization before repair.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Neck lump review",
        "patientPresentationVariantId": "presentation.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
        "releasePointId": "release.l4.pediatrics",
        "patientDisplayName": "Lucas Ellis",
        "prototypeDemographics": {
          "ageYears": 14,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Neck lump review",
        "presentation": "{patientName}, a 14-year-old boy, attends clinic with his mother, Sarah Ellis, who remains in the room. A firm cervical lump continues to enlarge after an outside needle sample was described to the family as reassuring. The founder reviews the outside record at the tissue-sampling decision; all questions concern that recorded care, and no biopsy or test is performed in this clinic.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 14,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Neck lump review",
            "presentation": "{patientName}, a 14-year-old boy, attends clinic with his mother, Sarah Ellis, who remains in the room. A firm cervical lump continues to enlarge after an outside needle sample was described to the family as reassuring. The founder reviews the outside record at the tissue-sampling decision; all questions concern that recorded care, and no biopsy or test is performed in this clinic."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.pediatric_examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "source.pediatric-neck-thoracic-gu.ipso-2022",
          "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-neck-thoracic-gu.20261111.node-sample",
            "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
            "primaryConceptId": "concept.pediatric-neck-thoracic-gu.inadequate-node-sample-escalation.v1",
            "currentUpdate": "The original pathology report is reviewed with the current neck examination.",
            "stem": "Which diagnostic plan fits {patientName}'s cervical lump at this review?",
            "showServicePreviews": true,
            "answerChoices": [
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.excision",
                "label": "Excisional biopsy of the cervical node",
                "isCorrect": true,
                "rationale": "A growing fixed node remains unexplained, and the earlier sample did not represent lymph-node tissue. Representative surgical tissue is appropriate.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.fna",
                "label": "Repeat fine-needle aspiration of the cervical node",
                "isCorrect": false,
                "rationale": "Another needle attempt may seem attractive, but indeterminate sampling with this persistent concerning course favors representative surgical tissue.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.observe",
                "label": "Clinical surveillance of the cervical node",
                "isCorrect": false,
                "rationale": "A nonrepresentative specimen is not a benign result for the target.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The report describes what entered the needle, not a benign diagnosis of the enlarging node. Persistent concerning examination findings after an indeterminate sample warrant representative biopsy. This does not establish a cancer diagnosis.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed teaching record; fictional observations",
              "items": [
                {
                  "label": "Needle specimen",
                  "value": "Blood and adipose fragments; no lymphoid tissue is represented."
                },
                {
                  "label": "Interval examination",
                  "value": "The same firm cervical lump has enlarged and remains fixed. There is no current inflammatory skin lesion."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-neck-thoracic-gu.ipso-2022",
              "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.fna",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic review ends with feedback; no outside hospital care or patient outcome is simulated.",
                "clinicalRationale": "Another needle attempt may seem attractive, but indeterminate sampling with this persistent concerning course favors representative surgical tissue.",
                "sourceLabels": [
                  "source.pediatric-neck-thoracic-gu.ipso-2022",
                  "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.observe",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic review ends with feedback; no outside hospital care or patient outcome is simulated.",
                "clinicalRationale": "A nonrepresentative specimen is not a benign result for the target.",
                "sourceLabels": [
                  "source.pediatric-neck-thoracic-gu.ipso-2022",
                  "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The report describes what entered the needle, not a benign diagnosis of the enlarging node. Persistent concerning examination findings after an indeterminate sample warrant representative biopsy. This does not establish a cancer diagnosis."
      },
      {
        "id": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Neck lump review",
        "patientPresentationVariantId": "presentation.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
        "releasePointId": "release.l4.pediatrics",
        "patientDisplayName": "Grace Turner",
        "prototypeDemographics": {
          "ageYears": 11,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Neck lump review",
        "presentation": "{patientName}, an 11-year-old girl, attends clinic with her father, James Turner, who remains in the room. A lump above her left collarbone has enlarged despite a recent ultrasound report describing a benign-looking neck node. The following decision concerns the subsequent outside hospital episode, reviewed in clinic with her father.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 11,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Neck lump review",
            "presentation": "{patientName}, an 11-year-old girl, attends clinic with her father, James Turner, who remains in the room. A lump above her left collarbone has enlarged despite a recent ultrasound report describing a benign-looking neck node. The following decision concerns the subsequent outside hospital episode, reviewed in clinic with her father."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.pediatric_examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "source.pediatric-neck-thoracic-gu.nci-child-nhl-pdq",
          "source.pediatric-neck-thoracic-gu.ipso-2022",
          "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy",
            "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
            "primaryConceptId": "concept.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy-route.v1",
            "currentUpdate": "At a subsequent clinic chart-review visit, the founder and {patientName}'s father review the outside children's hospital record. {patientName} is being managed there; no biopsy or anesthesia is performed in this clinic.",
            "stem": "Which biopsy plan should the founder recommend to {patientName}'s hospital team?",
            "showServicePreviews": true,
            "answerChoices": [
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.peripheral",
                "label": "Cervical-node excision with local anesthesia",
                "isCorrect": true,
                "rationale": "The peripheral target can supply representative tissue while avoiding the greater airway risk of deep sedation or general anesthesia in this presentation.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.thoracoscopy",
                "label": "Mediastinal thoracoscopy with general anesthesia",
                "isCorrect": false,
                "rationale": "An intrathoracic procedure under general anesthesia exposes this child to avoidable compression-related risk before a peripheral tissue route has been used.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.core",
                "label": "Mediastinal core biopsy with deep sedation",
                "isCorrect": false,
                "rationale": "A needle route does not remove the hazards of deep sedation and positioning in a compressive mediastinal process.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Choose the least hazardous route that can provide adequate tissue. Here a peripheral node and documented cooperation allow a local-anesthetic plan for the specialist team. Deep sedation or general anesthesia can worsen airway or cardiovascular compromise from a mediastinal mass.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed teaching record; fictional observations",
              "items": [
                {
                  "label": "Outside observations",
                  "value": "{patientName} speaks comfortably seated but becomes breathless when supine. She remained calm during an awake needle procedure."
                },
                {
                  "label": "Chest CT and tissue target",
                  "value": "An anterior mediastinal mass narrows the trachea. The left supraclavicular node is accessible and has not yet provided diagnostic tissue."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-neck-thoracic-gu.nci-child-nhl-pdq",
              "source.pediatric-neck-thoracic-gu.ipso-2022",
              "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.thoracoscopy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic review ends with feedback; no outside hospital care or patient outcome is simulated.",
                "clinicalRationale": "An intrathoracic procedure under general anesthesia exposes this child to avoidable compression-related risk before a peripheral tissue route has been used.",
                "sourceLabels": [
                  "source.pediatric-neck-thoracic-gu.nci-child-nhl-pdq",
                  "source.pediatric-neck-thoracic-gu.ipso-2022",
                  "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.core",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic review ends with feedback; no outside hospital care or patient outcome is simulated.",
                "clinicalRationale": "A needle route does not remove the hazards of deep sedation and positioning in a compressive mediastinal process.",
                "sourceLabels": [
                  "source.pediatric-neck-thoracic-gu.nci-child-nhl-pdq",
                  "source.pediatric-neck-thoracic-gu.ipso-2022",
                  "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Choose the least hazardous route that can provide adequate tissue. Here a peripheral node and documented cooperation allow a local-anesthetic plan for the specialist team. Deep sedation or general anesthesia can worsen airway or cardiovascular compromise from a mediastinal mass."
      },
      {
        "id": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Genital surgery review",
        "patientPresentationVariantId": "presentation.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
        "releasePointId": "release.l4.pediatrics",
        "patientDisplayName": "Noah Wells",
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Genital surgery review",
        "presentation": "{patientName}, a 5-year-old boy, attends clinic with his father, Daniel Wells, who remains in the room, before proposed genital surgery. The founder reviews the outside preoperative assessment record; all questions concern that recorded biochemical decision, and no test or procedure is performed in this clinic.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 5,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Genital surgery review",
            "presentation": "{patientName}, a 5-year-old boy, attends clinic with his father, Daniel Wells, who remains in the room, before proposed genital surgery. The founder reviews the outside preoperative assessment record; all questions concern that recorded biochemical decision, and no test or procedure is performed in this clinic."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.pediatric_examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "source.pediatric-neck-thoracic-gu.cua-puc-2017",
          "source.pediatric-neck-thoracic-gu.endocrine-cah-2018"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
            "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
            "primaryConceptId": "concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v2",
            "currentUpdate": "Examination documents a proximal urethral opening and no palpable gonad on either side. {patientName} is comfortable, eating normally and has no vomiting or dehydration. Multidisciplinary endocrine/urologic assessment is underway.",
            "stem": "Which biochemical study should be prioritized next in {patientName}'s preoperative assessment?",
            "showServicePreviews": true,
            "answerChoices": [
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.17ohp",
                "label": "Baseline serum 17-hydroxyprogesterone",
                "isCorrect": true,
                "rationale": "The 46,XX result with nonpalpable gonads changes the explanation of the external anatomy. Screen for an adrenal steroid disorder rather than assuming the unseen gonads are testes.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.amh",
                "label": "Baseline serum anti-Mullerian hormone",
                "isCorrect": false,
                "rationale": "AMH can assess testicular tissue in a different nonpalpable-gonad context; it does not take priority over the adrenal screen raised by this completed 46,XX result.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.stimulated",
                "label": "Cosyntropin-stimulated adrenal steroid profile",
                "isCorrect": false,
                "rationale": "A stimulated full profile helps when the initial screen is borderline or further characterization is needed; the supported initial screen has not been obtained in this stable child past infancy.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The chromosome result prevents assuming that bilateral nonpalpable gonads are simply undescended testes. An adrenal cause of virilization needs evaluation. For a stable symptomatic child past infancy, the Endocrine Society supports baseline early-morning 17-hydroxyprogesterone by LC-MS/MS as the initial screen; borderline results need further specialist testing. This is one prioritized step within full multidisciplinary assessment, not a complete DSD workup or a decision about gender identity or genital surgery.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed teaching record; fictional observations",
              "items": [
                {
                  "label": "Completed laboratory result",
                  "value": "The chromosome report is 46,XX."
                },
                {
                  "label": "Available biochemical record",
                  "value": "No steroid measurements have yet been obtained."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-neck-thoracic-gu.cua-puc-2017",
              "source.pediatric-neck-thoracic-gu.endocrine-cah-2018"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.amh",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic review ends with feedback; no outside hospital care or patient outcome is simulated.",
                "clinicalRationale": "AMH can assess testicular tissue in a different nonpalpable-gonad context; it does not take priority over the adrenal screen raised by this completed 46,XX result.",
                "sourceLabels": [
                  "source.pediatric-neck-thoracic-gu.cua-puc-2017",
                  "source.pediatric-neck-thoracic-gu.endocrine-cah-2018"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.stimulated",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic review ends with feedback; no outside hospital care or patient outcome is simulated.",
                "clinicalRationale": "A stimulated full profile helps when the initial screen is borderline or further characterization is needed; the supported initial screen has not been obtained in this stable child past infancy.",
                "sourceLabels": [
                  "source.pediatric-neck-thoracic-gu.cua-puc-2017",
                  "source.pediatric-neck-thoracic-gu.endocrine-cah-2018"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The chromosome result prevents assuming that bilateral nonpalpable gonads are simply undescended testes. An adrenal cause of virilization needs evaluation. For a stable symptomatic child past infancy, the Endocrine Society supports baseline early-morning 17-hydroxyprogesterone by LC-MS/MS as the initial screen; borderline results need further specialist testing. This is one prioritized step within full multidisciplinary assessment, not a complete DSD workup or a decision about gender identity or genital surgery."
      },
      {
        "id": "case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Hospital record review",
        "patientPresentationVariantId": "presentation.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
        "releasePointId": "release.l4.pediatrics",
        "patientDisplayName": "Isla Chen",
        "prototypeDemographics": {
          "ageYears": 6,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Hospital record review",
        "presentation": "{patientName}, a 6-year-old girl, attends clinic with her mother, Mei Chen, who remains in the room. The founder reviews outside neonatal ICU records from when {patientName} was a 4-day-old girl treated at the referring tertiary hospital for a left congenital diaphragmatic hernia. All questions concern that recorded ICU care.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 6,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Hospital record review",
            "presentation": "{patientName}, a 6-year-old girl, attends clinic with her mother, Mei Chen, who remains in the room. The founder reviews outside neonatal ICU records from when {patientName} was a 4-day-old girl treated at the referring tertiary hospital for a left congenital diaphragmatic hernia. All questions concern that recorded ICU care."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.pediatric_examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "source.pediatric-neck-thoracic-gu.chandrasekharan-cdh-2017",
          "source.pediatric-neck-thoracic-gu.cahs-cdh-2026"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
            "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
            "primaryConceptId": "concept.pediatric-neck-thoracic-gu.cdh-physiologic-readiness.v1",
            "currentUpdate": "The referring team asks about the repair sequence. She remains intubated on conventional ventilation; the chest radiograph still shows bowel in the left hemithorax.",
            "stem": "Which repair-sequencing plan is best supported by {patientName}'s current outside ICU record?",
            "showServicePreviews": true,
            "answerChoices": [
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2.repair",
                "label": "Plan repair while continuing the present ICU support",
                "isCorrect": true,
                "rationale": "Respiratory, perfusion and pressure trajectories support multidisciplinary repair assessment despite residual pulmonary hypertension and intubation.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2.stabilize",
                "label": "Continue stabilization before reconsidering the repair",
                "isCorrect": false,
                "rationale": "This fits ongoing instability, but intubation and residual sub-systemic pulmonary hypertension do not by themselves outweigh the current trajectory.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2.ecmo",
                "label": "Assess ECMO escalation before planning the repair",
                "isCorrect": false,
                "rationale": "ECMO assessment is relevant to instability despite maximal support, which this record does not show.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Persistent hernia and intubation do not themselves determine timing. Interpret the whole trend: perfusion and oxygenation have been sustained and estimated pulmonary pressure is now below systemic. The current CAHS guideline supports considering repair after physiological readiness is sustained, with the neonatal, surgical and anesthesia teams confirming the plan. This is not automatic operative clearance or a guarantee of safety; renewed instability would change the sequence.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed teaching record; fictional observations",
              "items": [
                {
                  "label": "Last 24 hours",
                  "value": "FiO2 0.30 with preductal saturation 93-95%; urine output 2 mL/kg/hour; lactate 1.5 mmol/L; blood pressure within the unit's normal range for gestational age without inotropes."
                },
                {
                  "label": "Echocardiography trend",
                  "value": "Estimated pulmonary artery systolic pressure fell from 75 to 45 mmHg. Simultaneous systemic systolic pressure is now 70 mmHg; ventricular function is preserved."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-neck-thoracic-gu.chandrasekharan-cdh-2017",
              "source.pediatric-neck-thoracic-gu.cahs-cdh-2026"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2.stabilize",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic review ends with feedback; no outside hospital care or patient outcome is simulated.",
                "clinicalRationale": "This fits ongoing instability, but intubation and residual sub-systemic pulmonary hypertension do not by themselves outweigh the current trajectory.",
                "sourceLabels": [
                  "source.pediatric-neck-thoracic-gu.chandrasekharan-cdh-2017",
                  "source.pediatric-neck-thoracic-gu.cahs-cdh-2026"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2.ecmo",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic review ends with feedback; no outside hospital care or patient outcome is simulated.",
                "clinicalRationale": "ECMO assessment is relevant to instability despite maximal support, which this record does not show.",
                "sourceLabels": [
                  "source.pediatric-neck-thoracic-gu.chandrasekharan-cdh-2017",
                  "source.pediatric-neck-thoracic-gu.cahs-cdh-2026"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Persistent hernia and intubation do not themselves determine timing. Interpret the whole trend: perfusion and oxygenation have been sustained and estimated pulmonary pressure is now below systemic. The current CAHS guideline supports considering repair after physiological readiness is sustained, with the neonatal, surgical and anesthesia teams confirming the plan. This is not automatic operative clearance or a guarantee of safety; renewed instability would change the sequence."
      }
    ]
  }
};
export const PROGRAM_BATCH6_QUESTIONS: (QuestionVariant & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "conceptId": "concept.pediatric-neck-thoracic-gu.inadequate-node-sample-escalation.v1",
    "stem": "Which diagnostic plan fits {patientName}'s cervical lump at this review?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed teaching record; fictional observations",
      "items": [
        {
          "label": "Needle specimen",
          "value": "Blood and adipose fragments; no lymphoid tissue is represented."
        },
        {
          "label": "Interval examination",
          "value": "The same firm cervical lump has enlarged and remains fixed. There is no current inflammatory skin lesion."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.excision",
        "label": "Excisional biopsy of the cervical node",
        "isCorrect": true,
        "rationale": "A growing fixed node remains unexplained, and the earlier sample did not represent lymph-node tissue. Representative surgical tissue is appropriate.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.fna",
        "label": "Repeat fine-needle aspiration of the cervical node",
        "isCorrect": false,
        "rationale": "Another needle attempt may seem attractive, but indeterminate sampling with this persistent concerning course favors representative surgical tissue.",
        "distractorRationale": "Another needle attempt may seem attractive, but indeterminate sampling with this persistent concerning course favors representative surgical tissue."
      },
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.observe",
        "label": "Clinical surveillance of the cervical node",
        "isCorrect": false,
        "rationale": "A nonrepresentative specimen is not a benign result for the target.",
        "distractorRationale": "A nonrepresentative specimen is not a benign result for the target."
      }
    ],
    "explanation": "The report describes what entered the needle, not a benign diagnosis of the enlarging node. Persistent concerning examination findings after an indeterminate sample warrant representative biopsy. This does not establish a cancer diagnosis.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.node-inadequate-fna",
      "claim.pediatric-neck-thoracic-gu.progressive-node-assessment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "conceptId": "concept.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy-route.v1",
    "stem": "Which biopsy plan should the founder recommend to {patientName}'s hospital team?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed teaching record; fictional observations",
      "items": [
        {
          "label": "Outside observations",
          "value": "{patientName} speaks comfortably seated but becomes breathless when supine. She remained calm during an awake needle procedure."
        },
        {
          "label": "Chest CT and tissue target",
          "value": "An anterior mediastinal mass narrows the trachea. The left supraclavicular node is accessible and has not yet provided diagnostic tissue."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.peripheral",
        "label": "Cervical-node excision with local anesthesia",
        "isCorrect": true,
        "rationale": "The peripheral target can supply representative tissue while avoiding the greater airway risk of deep sedation or general anesthesia in this presentation.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.thoracoscopy",
        "label": "Mediastinal thoracoscopy with general anesthesia",
        "isCorrect": false,
        "rationale": "An intrathoracic procedure under general anesthesia exposes this child to avoidable compression-related risk before a peripheral tissue route has been used.",
        "distractorRationale": "An intrathoracic procedure under general anesthesia exposes this child to avoidable compression-related risk before a peripheral tissue route has been used."
      },
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.core",
        "label": "Mediastinal core biopsy with deep sedation",
        "isCorrect": false,
        "rationale": "A needle route does not remove the hazards of deep sedation and positioning in a compressive mediastinal process.",
        "distractorRationale": "A needle route does not remove the hazards of deep sedation and positioning in a compressive mediastinal process."
      }
    ],
    "explanation": "Choose the least hazardous route that can provide adequate tissue. Here a peripheral node and documented cooperation allow a local-anesthetic plan for the specialist team. Deep sedation or general anesthesia can worsen airway or cardiovascular compromise from a mediastinal mass.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.mediastinal-anesthesia-risk",
      "claim.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy",
      "claim.pediatric-neck-thoracic-gu.node-inadequate-fna"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "conceptId": "concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v2",
    "stem": "Which biochemical study should be prioritized next in {patientName}'s preoperative assessment?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed teaching record; fictional observations",
      "items": [
        {
          "label": "Completed laboratory result",
          "value": "The chromosome report is 46,XX."
        },
        {
          "label": "Available biochemical record",
          "value": "No steroid measurements have yet been obtained."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.17ohp",
        "label": "Baseline serum 17-hydroxyprogesterone",
        "isCorrect": true,
        "rationale": "The 46,XX result with nonpalpable gonads changes the explanation of the external anatomy. Screen for an adrenal steroid disorder rather than assuming the unseen gonads are testes.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.amh",
        "label": "Baseline serum anti-Mullerian hormone",
        "isCorrect": false,
        "rationale": "AMH can assess testicular tissue in a different nonpalpable-gonad context; it does not take priority over the adrenal screen raised by this completed 46,XX result.",
        "distractorRationale": "AMH can assess testicular tissue in a different nonpalpable-gonad context; it does not take priority over the adrenal screen raised by this completed 46,XX result."
      },
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.stimulated",
        "label": "Cosyntropin-stimulated adrenal steroid profile",
        "isCorrect": false,
        "rationale": "A stimulated full profile helps when the initial screen is borderline or further characterization is needed; the supported initial screen has not been obtained in this stable child past infancy.",
        "distractorRationale": "A stimulated full profile helps when the initial screen is borderline or further characterization is needed; the supported initial screen has not been obtained in this stable child past infancy."
      }
    ],
    "explanation": "The chromosome result prevents assuming that bilateral nonpalpable gonads are simply undescended testes. An adrenal cause of virilization needs evaluation. For a stable symptomatic child past infancy, the Endocrine Society supports baseline early-morning 17-hydroxyprogesterone by LC-MS/MS as the initial screen; borderline results need further specialist testing. This is one prioritized step within full multidisciplinary assessment, not a complete DSD workup or a decision about gender identity or genital surgery.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.proximal-meatus-nonpalpable-gonads",
      "claim.pediatric-neck-thoracic-gu.xx-nonpalpable-adrenal-evaluation",
      "claim.pediatric-neck-thoracic-gu.cah-past-infancy-initial-screen",
      "claim.pediatric-neck-thoracic-gu.cah-borderline-confirmation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "conceptId": "concept.pediatric-neck-thoracic-gu.cdh-physiologic-readiness.v1",
    "stem": "Which repair-sequencing plan is best supported by {patientName}'s current outside ICU record?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed teaching record; fictional observations",
      "items": [
        {
          "label": "Last 24 hours",
          "value": "FiO2 0.30 with preductal saturation 93-95%; urine output 2 mL/kg/hour; lactate 1.5 mmol/L; blood pressure within the unit's normal range for gestational age without inotropes."
        },
        {
          "label": "Echocardiography trend",
          "value": "Estimated pulmonary artery systolic pressure fell from 75 to 45 mmHg. Simultaneous systemic systolic pressure is now 70 mmHg; ventricular function is preserved."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2.repair",
        "label": "Plan repair while continuing the present ICU support",
        "isCorrect": true,
        "rationale": "Respiratory, perfusion and pressure trajectories support multidisciplinary repair assessment despite residual pulmonary hypertension and intubation.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2.stabilize",
        "label": "Continue stabilization before reconsidering the repair",
        "isCorrect": false,
        "rationale": "This fits ongoing instability, but intubation and residual sub-systemic pulmonary hypertension do not by themselves outweigh the current trajectory.",
        "distractorRationale": "This fits ongoing instability, but intubation and residual sub-systemic pulmonary hypertension do not by themselves outweigh the current trajectory."
      },
      {
        "id": "choice.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2.ecmo",
        "label": "Assess ECMO escalation before planning the repair",
        "isCorrect": false,
        "rationale": "ECMO assessment is relevant to instability despite maximal support, which this record does not show.",
        "distractorRationale": "ECMO assessment is relevant to instability despite maximal support, which this record does not show."
      }
    ],
    "explanation": "Persistent hernia and intubation do not themselves determine timing. Interpret the whole trend: perfusion and oxygenation have been sustained and estimated pulmonary pressure is now below systemic. The current CAHS guideline supports considering repair after physiological readiness is sustained, with the neonatal, surgical and anesthesia teams confirming the plan. This is not automatic operative clearance or a guarantee of safety; renewed instability would change the sequence.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.cdh-physiology",
      "claim.pediatric-neck-thoracic-gu.cdh-stabilization-before-repair",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-perfusion-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-oxygen-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-pressure-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-repair-support-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-ecmo-consideration-2026"
    ]
  }
];
export const PROGRAM_BATCH6_TIMINGS: AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.node-sample",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "classification": {
      "kind": "no_test"
    }
  }
];
export const PROGRAM_BATCH6_RETIRED_CASES: SyntheticClinicalCase[] = [
  {
    "id": "case.pediatric-clinic.growing-firm-neck-node",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "displayName": "Refer concerning childhood neck nodes",
    "patientPresentationVariantId": "presentation.pediatric-clinic.growing-firm-neck-node",
    "releasePointId": "release.l4.pediatrics",
    "patientDisplayName": "Lucas Ellis",
    "prototypeDemographics": {
      "ageYears": 14,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Growing neck lump",
    "presentation": "Lucas Ellis, a 14-year-old boy, visits the clinic with his mother, Sarah Ellis, who remains in the same room throughout the visit. Lucas's mother reports that a neck lump is becoming more prominent rather than resolving. Examination finds a firm cervical node tethered to the overlying skin. There is no recent cold or inflammatory skin lesion. Lucas is comfortable at rest and has no airway or swallowing symptoms.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-clinic.growing-firm-neck-node.boy14",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 14,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Growing neck lump",
        "presentation": "Lucas Ellis, a 14-year-old boy, visits the clinic with his mother, Sarah Ellis, who remains in the same room throughout the visit. Lucas's mother reports that a neck lump is becoming more prominent rather than resolving. Examination finds a firm cervical node tethered to the overlying skin. There is no recent cold or inflammatory skin lesion. Lucas is comfortable at rest and has no airway or swallowing symptoms."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 4,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [
      "capability.pediatric_examination"
    ],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "source.pediatric-clinic.cornwall-nodes-2025"
    ],
    "decisionNodes": [
      {
        "id": "node.pediatric-clinic.growing-firm-neck-node.1",
        "questionVariantId": "question.pediatric-clinic.growing-firm-neck-node.v2",
        "primaryConceptId": "concept.pediatric-clinic.concerning-neck-node-referral",
        "stem": "What is the best outpatient disposition for Lucas Ellis's growing firm cervical node?",
        "answerChoices": [
          {
            "id": "choice.growing-firm-neck-node.assessment",
            "label": "Refer for prompt pediatric specialist assessment",
            "isCorrect": true,
            "rationale": "Growth and an abnormal firm-node examination merit early assessment rather than uncomplicated reactive-node observation.",
            "serviceRequest": null
          },
          {
            "id": "choice.growing-firm-neck-node.observe",
            "label": "Follow as uncomplicated viral lymphadenopathy",
            "isCorrect": false,
            "rationale": "The described progressive, firm finding does not match the reassuring small mobile-node profile.",
            "serviceRequest": null
          },
          {
            "id": "choice.growing-firm-neck-node.routine-ent",
            "label": "Arrange routine pediatric ENT follow-up",
            "isCorrect": false,
            "rationale": "The progressive abnormal-node pattern warrants early pediatric assessment rather than a routine follow-up pathway.",
            "serviceRequest": null
          },
          {
            "id": "choice.growing-firm-neck-node.discharge",
            "label": "Discharge from further cervical-node surveillance",
            "isCorrect": false,
            "rationale": "The concerning change still requires assessment even though Lucas has no acute airway symptoms.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Lucas's growing lump and abnormal firm-node examination warrant early pediatric assessment, even though he is comfortable at rest. The cause remains uncertain and requires further evaluation.",
        "teachingPoint": "Progressive abnormal nodes merit assessment; a stable clinic presentation does not remove that need.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-nodes-2025"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.growing-firm-neck-node.observe",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "The described progressive, firm finding does not match the reassuring small mobile-node profile.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-nodes-2025"
            ]
          },
          {
            "answerChoiceId": "choice.growing-firm-neck-node.routine-ent",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "The progressive abnormal-node pattern warrants early pediatric assessment rather than a routine follow-up pathway.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-nodes-2025"
            ]
          },
          {
            "answerChoiceId": "choice.growing-firm-neck-node.discharge",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "The concerning change still requires assessment even though Lucas has no acute airway symptoms.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-nodes-2025"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Review the teaching point and choice rationales for this clinic visit."
  },
  {
    "id": "case.pediatric-clinic.retractile-testis-remains-scrotal",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "displayName": "Follow a true retractile testis",
    "patientPresentationVariantId": "presentation.pediatric-clinic.retractile-testis-remains-scrotal",
    "releasePointId": "release.l4.pediatrics",
    "patientDisplayName": "Ben Foster",
    "prototypeDemographics": {
      "ageYears": 6,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Moving testicle",
    "presentation": "Ben Foster, a 6-year-old boy, visits the clinic with his mother, Laura Foster, who remains in the same room throughout the visit. Ben's mother sometimes notices that his right testis sits higher, especially when he is tense. The examination is explained to them. In a relaxed setting, the testis can be brought into the normal scrotal position without tension and remains there after release. Ben has no pain or swelling.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-clinic.retractile-testis-remains-scrotal.boy6",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 6,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Moving testicle",
        "presentation": "Ben Foster, a 6-year-old boy, visits the clinic with his mother, Laura Foster, who remains in the same room throughout the visit. Ben's mother sometimes notices that his right testis sits higher, especially when he is tense. The examination is explained to them. In a relaxed setting, the testis can be brought into the normal scrotal position without tension and remains there after release. Ben has no pain or swelling."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 4,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [
      "capability.pediatric_examination"
    ],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "source.pediatric-clinic.cornwall-surgery-2025",
      "source.pediatric-clinic.cua-puc-testis-2017",
      "source.pediatric-clinic.cuh-testis-2025",
      "source.pediatric-clinic.cps-decision-making-2018"
    ],
    "decisionNodes": [
      {
        "id": "node.pediatric-clinic.retractile-testis-remains-scrotal.1",
        "questionVariantId": "question.pediatric-clinic.retractile-testis-remains-scrotal.v1",
        "primaryConceptId": "concept.pediatric-clinic.true-retractile-testis-surveillance",
        "stem": "Which management plan is most appropriate for Ben Foster's true retractile testis?",
        "answerChoices": [
          {
            "id": "choice.retractile-testis-remains-scrotal.followup",
            "label": "Arrange documented testicular-position follow-up",
            "isCorrect": true,
            "rationale": "The examination meets the true-retractile definition; documented surveillance can identify a later change in position.",
            "serviceRequest": null
          },
          {
            "id": "choice.retractile-testis-remains-scrotal.operation",
            "label": "Arrange immediate orchidopexy planning",
            "isCorrect": false,
            "rationale": "Operative planning is not recommended for the explicitly defined true-retractile examination pattern.",
            "serviceRequest": null
          },
          {
            "id": "choice.retractile-testis-remains-scrotal.discharge",
            "label": "End routine testicular-position surveillance",
            "isCorrect": false,
            "rationale": "A true retractile testis still needs position follow-up to detect acquired ascent.",
            "serviceRequest": null
          },
          {
            "id": "choice.retractile-testis-remains-scrotal.parent-monitoring",
            "label": "Continue parent-led testicular-position monitoring",
            "isCorrect": false,
            "rationale": "Parent observations can help, but the cited follow-up plan includes documented clinical position examinations.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Ben's testis stays in the normal scrotal position after gentle placement without tension, meeting the true-retractile definition. Arrange documented follow-up examinations, with reassessment or referral if the testis later fails to remain scrotal. This narrow phenotype does not call for immediate operative planning.",
        "teachingPoint": "A true retractile testis needs surveillance, with referral if acquired ascent develops.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025",
          "source.pediatric-clinic.cua-puc-testis-2017",
          "source.pediatric-clinic.cuh-testis-2025",
          "source.pediatric-clinic.cps-decision-making-2018"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.retractile-testis-remains-scrotal.operation",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "Operative planning is not recommended for the explicitly defined true-retractile examination pattern.",
            "sourceLabels": [
              "source.pediatric-clinic.cua-puc-testis-2017",
              "source.pediatric-clinic.cuh-testis-2025"
            ]
          },
          {
            "answerChoiceId": "choice.retractile-testis-remains-scrotal.discharge",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "A true retractile testis still needs position follow-up to detect acquired ascent.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025",
              "source.pediatric-clinic.cua-puc-testis-2017",
              "source.pediatric-clinic.cuh-testis-2025"
            ]
          },
          {
            "answerChoiceId": "choice.retractile-testis-remains-scrotal.parent-monitoring",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "Parent observations can help, but the cited follow-up plan includes documented clinical position examinations.",
            "sourceLabels": [
              "source.pediatric-clinic.cua-puc-testis-2017",
              "source.pediatric-clinic.cuh-testis-2025"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Review the teaching point and choice rationales for this clinic visit."
  }
];
export const PROGRAM_BATCH6_CLAIMS: (Omit<EvidenceClaim,"evidenceCategory" | "certainty"> & {evidenceCategory:EvidenceClaim["evidenceCategory"] | "applied_science" | "treatment" | "medication_safety" | "microbiology"; certainty:EvidenceClaim["certainty"] | "limited"} & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.node-inadequate-fna",
    "statement": "An indeterminate needle sample does not settle persistent concerning pediatric lymphadenopathy; representative surgical biopsy may be needed.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.ipso-2022",
      "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Surgical biopsy is supported when the clinical course remains concerning, not for every reactive node.",
    "applicablePopulation": "Children or adolescents in the explicitly defined clinical scenario",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.progressive-node-assessment",
    "statement": "A growing firm or supraclavicular cervical node merits pediatric specialist assessment even if another node has reassuring findings.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021",
      "source.pediatric-neck-thoracic-gu.ipso-2022"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "A red flag is not a diagnosis of malignancy.",
    "applicablePopulation": "Children or adolescents in the explicitly defined clinical scenario",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.mediastinal-anesthesia-risk",
    "statement": "A mediastinal mass can cause airway or cardiovascular compromise during general anesthesia or heavy sedation, requiring risk-aware biopsy planning.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.nci-child-nhl-pdq",
      "source.pediatric-neck-thoracic-gu.ipso-2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Children or adolescents in the explicitly defined clinical scenario",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy",
    "statement": "A peripheral node can provide tissue under local anesthesia in an appropriately cooperative child with a mediastinal mass, avoiding a more hazardous intrathoracic approach.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.nci-child-nhl-pdq",
      "source.pediatric-neck-thoracic-gu.ipso-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Requires specialist planning, adequate tissue and patient cooperation; not a guarantee of safety or a rule against all general anesthesia.",
    "applicablePopulation": "Children or adolescents in the explicitly defined clinical scenario",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.proximal-meatus-nonpalpable-gonads",
    "statement": "Proximal hypospadias with nonpalpable gonads warrants chromosomal and endocrine assessment for a difference of sex development.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.cua-puc-2017"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One dated society guideline; does not determine chromosomes from appearance or prescribe hormone therapy.",
    "applicablePopulation": "Children or adolescents in the explicitly defined clinical scenario",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.xx-nonpalpable-adrenal-evaluation",
    "statement": "A 46,XX result with bilateral nonpalpable gonads requires evaluation for an adrenal cause of genital virilization rather than assuming unseen gonads are testes.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.cua-puc-2017"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "CUA-PUC directly supports 17-hydroxyprogesterone testing in this setting. The proximal-meatus presentation also requires full multidisciplinary DSD care; chromosomes do not determine gender identity.",
    "applicablePopulation": "Bilateral nonpalpable gonads with a 46,XX result",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cah-past-infancy-initial-screen",
    "statement": "For symptomatic patients past infancy, baseline early-morning serum 17-hydroxyprogesterone by liquid chromatography-tandem mass spectrometry is the initial biochemical screen for 21-hydroxylase-deficient CAH.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.endocrine-cah-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Direct recommendation 3.2. CUA-PUC independently supports testing in the gonadal context. No diagnostic cutoff or drug regimen authored.",
    "applicablePopulation": "Symptomatic individuals past infancy",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cah-borderline-confirmation",
    "statement": "A borderline 17-hydroxyprogesterone result requires specialist assessment with a stimulated adrenal steroid profile rather than treating the screen as a complete diagnosis.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.endocrine-cah-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Direct recommendation 3.3. No stimulation dose, diagnostic concentration or treatment instruction.",
    "applicablePopulation": "Individuals with borderline CAH screening results",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cdh-physiology",
    "statement": "Pulmonary hypoplasia, pulmonary hypertension and cardiac dysfunction can drive the early instability of congenital diaphragmatic hernia.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.chandrasekharan-cdh-2017"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Older licensed review; supports qualitative physiology, not modern thresholds.",
    "applicablePopulation": "Children or adolescents in the explicitly defined clinical scenario",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cdh-stabilization-before-repair",
    "statement": "Initial cardiorespiratory stabilization precedes congenital diaphragmatic hernia repair.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.chandrasekharan-cdh-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Only one directly verified source for the broad timing sequence. Current 2023 guideline access failed. Modern readiness criteria, ECLS policy and ventilation/drug targets remain unkeyed.",
    "applicablePopulation": "Children or adolescents in the explicitly defined clinical scenario",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cdh-cahs-perfusion-readiness-2026",
    "statement": "May 2026 CAHS CDH guidance considers repair after a day of adequate perfusion, including urine output above 1 mL/kg/hour, lactate below 3 mmol/L and age-appropriate blood pressure with no or minimal inotropic support.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.cahs-cdh-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Local protocol, not universal clearance or an automatic timer. Respiratory and echocardiographic criteria also matter.",
    "applicablePopulation": "Neonates with CDH in tertiary neonatal surgical care",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cdh-cahs-oxygen-readiness-2026",
    "statement": "May 2026 CAHS readiness guidance uses preductal saturation in its stated 85-95 percent range on reduced inspired oxygen, with FiO2 below its published 0.4-0.5 range.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.cahs-cdh-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Published FiO2 wording spans 0.4-0.5. Fictional FiO2 0.30 lies below both bounds; no ambiguous boundary is scored. Older search snippets excluded.",
    "applicablePopulation": "Neonates with CDH in tertiary neonatal surgical care",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cdh-cahs-pressure-readiness-2026",
    "statement": "Improvement of estimated pulmonary artery pressure to below systemic pressure is part of the May 2026 CAHS CDH readiness assessment.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.cahs-cdh-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Sub-systemic does not require normal pulmonary pressure. Perfusion, respiratory support and multidisciplinary judgment remain necessary.",
    "applicablePopulation": "Neonates with CDH in tertiary neonatal surgical care",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cdh-cahs-repair-support-2026",
    "statement": "CDH repair can proceed with continuing ventilatory support after an appropriate physiological assessment; tracheal extubation is not a universal prerequisite.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.cahs-cdh-2026",
      "source.pediatric-neck-thoracic-gu.chandrasekharan-cdh-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Current local guidance plus an older independent review; no preferred approach or fixed day of life inferred.",
    "applicablePopulation": "Neonates with CDH in tertiary neonatal surgical care",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-neck-thoracic-gu.cdh-cahs-ecmo-consideration-2026",
    "statement": "Instability despite maximal medical support in CDH can prompt multidisciplinary assessment for ECMO before determining the repair sequence.",
    "sourceIds": [
      "source.pediatric-neck-thoracic-gu.cahs-cdh-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Individual suitability assessment required. No ECMO eligibility cutoffs, outcomes or operate-on-ECMO rule authored.",
    "applicablePopulation": "Selected critically ill neonates with CDH",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  }
];
export const PROGRAM_BATCH6_SOURCES: (Omit<ClinicalSource,"sourceClass" | "reuseStatus" | "publicationDateNote"> & {sourceClass:ClinicalSource["sourceClass"] | "regulatory_label"; reuseStatus:ClinicalSource["reuseStatus"] | "targeted_factual_verification_only"; publicationDateNote?:string | null} & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-neck-thoracic-gu.ipso-2022",
    "title": "International Society of Paediatric Surgical Oncology Surgical Practice Guidelines",
    "completeCitation": "Abib SCV, Chui CH, Cox S, et al. International Society of Paediatric Surgical Oncology (IPSO) Surgical Practice Guidelines. Ecancermedicalscience. 2022;16:1356. doi:10.3332/ecancer.2022.1356. Relevant chapter: Elgendy A, Abdelhafeez H, Abib S. Management of lymph node enlargement in children.",
    "organizationOrJournal": "Ecancermedicalscience / IPSO",
    "authors": [
      "Simone de Campos Vieira Abib",
      "Chan Hon Chui",
      "Sharon Cox",
      "Abdelhafeez H. Abdelhafeez",
      "Ahmed Elgendy",
      "IPSO guideline contributors (et al.)"
    ],
    "publicationYear": 2022,
    "doi": "10.3332/ecancer.2022.1356",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9023308/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Underlying facts independently synthesized with attribution. No prose, excerpts, tables, figures, algorithms or patient images reproduced. No commercial or unrestricted reuse permission is inferred.",
    "authorityAssessment": "Specialist society consensus, not a universal mandate to biopsy every palpable childhood node. Relevant lymph-node and mediastinal-biopsy sections checked.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.improving-nodes-observation",
      "claim.pediatric-neck-thoracic-gu.progressive-node-assessment",
      "claim.pediatric-neck-thoracic-gu.node-inadequate-fna",
      "claim.pediatric-neck-thoracic-gu.mediastinal-anesthesia-risk",
      "claim.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy"
    ],
    "accessMethod": "permitted_public_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsFinding": "Primary page and available rights statement checked for this targeted factual use; no source corpus or model training. See exclusions for inaccessible or restricted routes.",
    "termsUrl": null,
    "medicalAuthority": "Specialist society consensus, not a universal mandate to biopsy every palpable childhood node. Relevant lymph-node and mediastinal-biopsy sections checked.",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-neck-thoracic-gu.rch-cervical-nodes-2021",
    "title": "Cervical lymphadenopathy",
    "completeCitation": "Royal Children's Hospital Melbourne, Paediatric Improvement Collaborative. Clinical Practice Guideline: Cervical lymphadenopathy. Updated April 2021. Accessed 11 November 2026.",
    "organizationOrJournal": "Royal Children's Hospital Melbourne / Paediatric Improvement Collaborative",
    "authors": [
      "RCH Clinical Practice Guidelines team"
    ],
    "publicationYear": 2021,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.rch.org.au/clinicalguide/guideline_index/cervical_lymphadenopathy/",
    "accessedOn": "2026-11-11",
    "sourceClass": "government_guidance",
    "licenseLabel": "Copyright; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Underlying facts independently synthesized with attribution. No prose, excerpts, tables, figures, algorithms or patient images reproduced. No commercial or unrestricted reuse permission is inferred.",
    "authorityAssessment": "Government pediatric clinical guidance. Supports phenotype-based observation, infection assessment and biopsy/drainage boundaries; antibiotic regimens are local and are not imported.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.improving-nodes-observation",
      "claim.pediatric-neck-thoracic-gu.progressive-node-assessment",
      "claim.pediatric-neck-thoracic-gu.node-inadequate-fna",
      "claim.pediatric-neck-thoracic-gu.bacterial-node-abscess-drainage",
      "claim.pediatric-neck-thoracic-gu.ntm-node-pattern",
      "claim.pediatric-neck-thoracic-gu.ntm-excision-drainage"
    ],
    "accessMethod": "permitted_public_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsFinding": "Primary page and available rights statement checked for this targeted factual use; no source corpus or model training. See exclusions for inaccessible or restricted routes.",
    "termsUrl": null,
    "medicalAuthority": "Government pediatric clinical guidance. Supports phenotype-based observation, infection assessment and biopsy/drainage boundaries; antibiotic regimens are local and are not imported.",
    "licenseUrl": null
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-neck-thoracic-gu.nci-child-nhl-pdq",
    "title": "Childhood Non-Hodgkin Lymphoma Treatment (PDQ), health professional version",
    "completeCitation": "PDQ Pediatric Treatment Editorial Board. Childhood Non-Hodgkin Lymphoma Treatment (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Continuously maintained summary; accessed 11 November 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "PDQ Pediatric Treatment Editorial Board"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/lymphoma/hp/child-nhl-treatment-pdq",
    "accessedOn": "2026-11-11",
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI information reuse policy; conditions and third-party exclusions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Underlying facts independently synthesized with attribution. No prose, excerpts, tables, figures, algorithms or patient images reproduced. No commercial or unrestricted reuse permission is inferred.",
    "authorityAssessment": "Federal peer-reviewed evidence summary. Targeted mediastinal-mass diagnostic safety only; no lymphoma chemotherapy or unsupported cancer diagnosis.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.mediastinal-anesthesia-risk",
      "claim.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy"
    ],
    "accessMethod": "permitted_public_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsFinding": "Primary page and available rights statement checked for this targeted factual use; no source corpus or model training. See exclusions for inaccessible or restricted routes.",
    "termsUrl": "https://www.cancer.gov/policies/copyright-reuse",
    "medicalAuthority": "Federal peer-reviewed evidence summary. Targeted mediastinal-mass diagnostic safety only; no lymphoma chemotherapy or unsupported cancer diagnosis.",
    "licenseUrl": null
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-neck-thoracic-gu.cua-puc-2017",
    "title": "CUA-PUC guideline for cryptorchidism",
    "completeCitation": "Braga LH, Lorenzo AJ, Romao RLP. Canadian Urological Association-Pediatric Urologists of Canada (CUA-PUC) guideline for the diagnosis, management, and followup of cryptorchidism. Can Urol Assoc J. 2017;11(7):E251-E260. doi:10.5489/cuaj.4585.",
    "organizationOrJournal": "Canadian Urological Association Journal",
    "authors": [
      "Luis H. Braga",
      "Armando J. Lorenzo",
      "Rodrigo L. P. Romao"
    ],
    "publicationYear": 2017,
    "doi": "10.5489/cuaj.4585",
    "pmid": null,
    "officialUrl": "https://cuaj.ca/index.php/journal/article/view/4585",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Underlying facts independently synthesized with attribution. No prose, excerpts, tables, figures, algorithms or patient images reproduced. No commercial or unrestricted reuse permission is inferred.",
    "authorityAssessment": "Evidence-graded society guideline, dated 2017. Specific examination, imaging, exploration and DSD recommendations verified in publisher PDF. Not described as a 2026 update.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.maintained-scrotal-position",
      "claim.pediatric-neck-thoracic-gu.retractile-surveillance",
      "claim.pediatric-neck-thoracic-gu.acquired-ascent",
      "claim.pediatric-neck-thoracic-gu.testis-exam-imaging",
      "claim.pediatric-neck-thoracic-gu.nonpalpable-exploration",
      "claim.pediatric-neck-thoracic-gu.vas-vessels-enter-ring",
      "claim.pediatric-neck-thoracic-gu.proximal-meatus-nonpalpable-gonads",
      "claim.pediatric-neck-thoracic-gu.xx-nonpalpable-adrenal-evaluation"
    ],
    "accessMethod": "permitted_public_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsFinding": "Primary page and available rights statement checked for this targeted factual use; no source corpus or model training. See exclusions for inaccessible or restricted routes.",
    "termsUrl": null,
    "medicalAuthority": "Evidence-graded society guideline, dated 2017. Specific examination, imaging, exploration and DSD recommendations verified in publisher PDF. Not described as a 2026 update.",
    "licenseUrl": null
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-neck-thoracic-gu.endocrine-cah-2018",
    "title": "Endocrine Society CAH guideline: diagnostic recommendations",
    "completeCitation": "Speiser PW, Arlt W, Auchus RJ, Baskin LS, Conway GS, Merke DP, Meyer-Bahlburg HFL, Miller WL, Murad MH, Oberfield SE, White PC. Congenital Adrenal Hyperplasia Due to Steroid 21-Hydroxylase Deficiency: An Endocrine Society Clinical Practice Guideline. 2018. doi:10.1210/jc.2018-01865. Official Endocrine Society guideline resource, 19 September 2018, recommendations 3.2-3.4.",
    "organizationOrJournal": "Endocrine Society; The Journal of Clinical Endocrinology & Metabolism",
    "authors": [
      "Phyllis W. Speiser",
      "Wiebke Arlt",
      "Richard J. Auchus",
      "Laurence S. Baskin",
      "Gerard S. Conway",
      "Deborah P. Merke",
      "Heino F. L. Meyer-Bahlburg",
      "Walter L. Miller",
      "M. Hassan Murad",
      "Sharon E. Oberfield",
      "Perrin C. White"
    ],
    "publicationYear": 2018,
    "doi": "10.1210/jc.2018-01865",
    "pmid": null,
    "officialUrl": "https://www.endocrine.org/clinical-practice-guidelines/congenital-adrenal-hyperplasia-guideline-resources",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Underlying facts independently synthesized with attribution. No source prose, excerpts, tables, algorithms, figures or illustrations stored or adapted. No open license inferred.",
    "authorityAssessment": "Evidence-graded society recommendations directly visible on the official resource page. Dated 2018, not described as a 2026 update. Initial diagnostic screening past infancy and follow-up of borderline results verified; paired with CUA-PUC for the gonadal context.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.cah-past-infancy-initial-screen",
      "claim.pediatric-neck-thoracic-gu.cah-borderline-confirmation"
    ],
    "accessMethod": "permitted_public_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsUrl": null,
    "licenseUrl": null,
    "medicalAuthority": "Evidence-graded society guideline, 2018; targeted verification of recommendations 3.2-3.3.",
    "termsFinding": "Official society resource and visible recommendations inspected for targeted factual verification. Copyright retained; no text reproduced or open-license inference. The guessed /terms-of-use route was inaccessible and linked OUP full-article route failed. No AI-specific prohibition appeared in the accessed resource; inaccessible content and snippets were not evidence."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-neck-thoracic-gu.chandrasekharan-cdh-2017",
    "title": "Congenital Diaphragmatic hernia ? a review",
    "completeCitation": "Chandrasekharan PK, Rawat M, Madappa R, Rothstein DH, Lakshminrusimha S. Congenital Diaphragmatic hernia ? a review. Matern Health Neonatol Perinatol. 2017;3:6. doi:10.1186/s40748-017-0045-1.",
    "organizationOrJournal": "Maternal Health, Neonatology and Perinatology",
    "authors": [
      "Praveen Kumar Chandrasekharan",
      "Munmun Rawat",
      "Rajeshwari Madappa",
      "David H. Rothstein",
      "Satyan Lakshminrusimha"
    ],
    "publicationYear": 2017,
    "doi": "10.1186/s40748-017-0045-1",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s40748-017-0045-1",
    "accessedOn": "2026-11-11",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0; separately credited images excluded",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Underlying facts independently synthesized with attribution. No prose, excerpts, tables, figures, algorithms or patient images reproduced. No commercial or unrestricted reuse permission is inferred.",
    "authorityAssessment": "Older review supporting broad stabilization-before-repair sequence. Not used for modern ECLS thresholds, ventilation targets, drug rules or exact readiness cutoffs.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.cdh-physiology",
      "claim.pediatric-neck-thoracic-gu.cdh-stabilization-before-repair",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-repair-support-2026"
    ],
    "accessMethod": "permitted_public_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsFinding": "Primary page and available rights statement checked for this targeted factual use; no source corpus or model training. See exclusions for inaccessible or restricted routes.",
    "termsUrl": null,
    "medicalAuthority": "Older review supporting broad stabilization-before-repair sequence. Not used for modern ECLS thresholds, ventilation targets, drug rules or exact readiness cutoffs.",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-neck-thoracic-gu.cahs-cdh-2026",
    "title": "CAHS neonatal CDH guideline, May 2026",
    "completeCitation": "Child and Adolescent Health Service, Neonatology. Congenital Diaphragmatic Hernia (CDH). Government of Western Australia. First issued June 2006; last reviewed May 2026; approved 26 May 2026; next review May 2029. Surgical Considerations, pp. 9-10. Official guideline URL.",
    "organizationOrJournal": "Child and Adolescent Health Service, Government of Western Australia",
    "authors": [
      "Child and Adolescent Health Service Neonatology; Neonatology Coordinating Group"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cahs.health.wa.gov.au/-/media/HSPs/CAHS/Documents/Health-Professionals/Neonatology-guidelines/Congenital-Diaphragmatic-Hernia-CDH.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "government_guidance",
    "licenseLabel": "Copyright; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Underlying facts independently synthesized with attribution. No source prose, excerpts, tables, algorithms, figures or illustrations stored or adapted. No open license inferred.",
    "authorityAssessment": "Current local government neonatal guideline, last reviewed May 2026. Its readiness criteria and multidisciplinary judgment were directly verified in the current 15-page PDF. Not a universal operative deadline; older 13-page search snippets differ.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-perfusion-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-oxygen-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-pressure-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-repair-support-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-ecmo-consideration-2026"
    ],
    "accessMethod": "permitted_public_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsUrl": null,
    "licenseUrl": null,
    "medicalAuthority": "Current local government neonatal guideline, May 2026. Local protocol applicability requires clinical review.",
    "termsFinding": "Public government PDF and visible notices inspected; no AI-specific prohibition encountered in the accessed document. No reuse license inferred. Guessed Global copyright/terms/disclaimer routes were inaccessible. Restricted to short original factual synthesis under repository permission for government guidance; no text reproduction or corpus ingestion."
  }
];
export const PROGRAM_BATCH6_ORDERS = [] as const;
export const PROGRAM_BATCH6_FROZEN = [
  {
    "topic": "pediatric-neck-thoracic-gu",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "rawCaseSha256": "85e8f9a7990c75623c8f0404945a4a89b27075cd13cad0e4c41a6a736eedcdf7",
    "retainedCaseSha256": "85e8f9a7990c75623c8f0404945a4a89b27075cd13cad0e4c41a6a736eedcdf7",
    "nodes": [
      {
        "nodeId": "node.pediatric-neck-thoracic-gu.20261111.node-sample",
        "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
        "conceptId": "concept.pediatric-neck-thoracic-gu.inadequate-node-sample-escalation.v1",
        "nodeSha256": "d97a9db1bd0cffff9be6c3996b0cf65ac7f8de5db8f67d516c4f00a5c9d7f8d5",
        "questionSha256": "94ee9b63c563de2afe4a059bab6e6d527b4f924edd21bea3dcf3185d5769df11",
        "reviewPath": "docs/research/question-topic-pediatric-neck-thoracic-gu-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "pediatric-neck-thoracic-gu",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "rawCaseSha256": "b316588fbed2436e00fe16c285d1d75e31df26f166fd828fce228486936ddae5",
    "retainedCaseSha256": "bd680e03ea042e564c127678b0467d51ee13149f63cbeffd32572eca9467d721",
    "nodes": [
      {
        "nodeId": "node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy",
        "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
        "conceptId": "concept.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy-route.v1",
        "nodeSha256": "5ca23439b805b1c0082d8486587c12ae6690482b786dc18bb03efd708b195a67",
        "questionSha256": "44d2c25a7211bd62c4ad873978614f6a175f9bb56414f864a94223356b2abb71",
        "reviewPath": "docs/research/question-topic-pediatric-neck-thoracic-gu-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "pediatric-neck-thoracic-gu",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "rawCaseSha256": "a49e762de3581c9ecb9fe5b94cf76e27747bfe3e50342d92620fee5746ec19db",
    "retainedCaseSha256": "163ebf7a0c95d0737f576a0c2f8d96b1479a7c3dd78e4509652cc974eb21b40b",
    "nodes": [
      {
        "nodeId": "node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
        "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
        "conceptId": "concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v2",
        "nodeSha256": "a3ce3363c547bd628616269a7bb87ec5c257e344c9cba9fbbf33e762a8d07118",
        "questionSha256": "3d26940603545eb9223b06fab256286f295fef4b58871930b47d3fcc904de64e",
        "reviewPath": "docs/research/question-topic-pediatric-neck-thoracic-gu-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "pediatric-neck-thoracic-gu",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
    "rawCaseSha256": "00390c84bbe70a132bff5facd7e612aec81836f5fbff9f91136db68ad32c18c1",
    "retainedCaseSha256": "ba65719f1552473b6919896dd6314410f12179008e246f22fc44c07d58b8f2a6",
    "nodes": [
      {
        "nodeId": "node.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
        "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
        "conceptId": "concept.pediatric-neck-thoracic-gu.cdh-physiologic-readiness.v1",
        "nodeSha256": "46e5aa89112a265d0cf2017dbf27068926dd994d66ab671f21aabc3a4f94a82e",
        "questionSha256": "154613bc903f12cc13f5f6c4ae0401731312f36e7731bfc20d4a86b52b2a3246",
        "reviewPath": "docs/research/question-topic-pediatric-neck-thoracic-gu-review-salvage-20261111.json"
      }
    ]
  }
] as const;
export const PROGRAM_BATCH6_LENGTH_RESIDUALS = [] as const;
export const PROGRAM_BATCH6_FAMILY_CONTEXTS = [
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "family.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "profileId": "profile.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "childName": "Lucas Ellis",
    "childStillId": "level3-roster-v2.030",
    "prototypeDemographics": {
      "ageYears": 14,
      "sexLabel": "Male"
    },
    "parentName": "Sarah Ellis",
    "parentRelationship": "mother",
    "parentCount": 1,
    "parentPlacement": "same_room_throughout",
    "metadataSource": "tools/character-mapping/level3-roster-complete-v2/roster.json",
    "profileValuesBasis": "editorial_art_contract_not_disease_probability",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.node-inadequate-fna",
      "claim.pediatric-neck-thoracic-gu.progressive-node-assessment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "family.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "profileId": "profile.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "childName": "Grace Turner",
    "childStillId": "level3-roster-v2.027",
    "prototypeDemographics": {
      "ageYears": 11,
      "sexLabel": "Female"
    },
    "parentName": "James Turner",
    "parentRelationship": "father",
    "parentCount": 1,
    "parentPlacement": "same_room_throughout",
    "metadataSource": "tools/character-mapping/level3-roster-complete-v2/roster.json",
    "profileValuesBasis": "editorial_art_contract_not_disease_probability",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.mediastinal-anesthesia-risk",
      "claim.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy",
      "claim.pediatric-neck-thoracic-gu.node-inadequate-fna"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "family.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "profileId": "profile.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "childName": "Noah Wells",
    "childStillId": "level3-roster-v2.022",
    "prototypeDemographics": {
      "ageYears": 5,
      "sexLabel": "Male"
    },
    "parentName": "Daniel Wells",
    "parentRelationship": "father",
    "parentCount": 1,
    "parentPlacement": "same_room_throughout",
    "metadataSource": "tools/character-mapping/level3-roster-complete-v2/roster.json",
    "profileValuesBasis": "editorial_art_contract_not_disease_probability",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.proximal-meatus-nonpalpable-gonads",
      "claim.pediatric-neck-thoracic-gu.xx-nonpalpable-adrenal-evaluation",
      "claim.pediatric-neck-thoracic-gu.cah-past-infancy-initial-screen",
      "claim.pediatric-neck-thoracic-gu.cah-borderline-confirmation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "family.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "profileId": "profile.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
    "childName": "Isla Chen",
    "childStillId": "level3-roster-v2.021",
    "prototypeDemographics": {
      "ageYears": 6,
      "sexLabel": "Female"
    },
    "parentName": "Mei Chen",
    "parentRelationship": "mother",
    "parentCount": 1,
    "parentPlacement": "same_room_throughout",
    "metadataSource": "tools/character-mapping/level3-roster-complete-v2/roster.json",
    "profileValuesBasis": "editorial_art_contract_not_disease_probability",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.cdh-physiology",
      "claim.pediatric-neck-thoracic-gu.cdh-stabilization-before-repair",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-perfusion-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-oxygen-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-pressure-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-repair-support-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-ecmo-consideration-2026"
    ]
  }
] as const;
export const PROGRAM_BATCH6_AUTHORED_CONCEPTS = [
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-neck-thoracic-gu.inadequate-node-sample-escalation.v1",
    "displayName": "Act on nonrepresentative node sampling",
    "learningObjective": "Recognize a nonrepresentative needle specimen and select representative biopsy for a persistent concerning cervical node.",
    "earliestFacilityStage": 4,
    "conceptType": "workup",
    "educationalTier": 1,
    "identityDisposition": "new_meaning_version",
    "previousConceptId": "concept.pediatric-clinic.concerning-neck-node-referral",
    "changedObjective": "Recognize a nonrepresentative needle specimen and select representative biopsy for a persistent concerning cervical node.",
    "clinicalReason": "Identify that the specimen lacks the tissue being investigated. Combine inadequate sampling with continued concerning growth to choose representative surgical biopsy. This changes the scored decision, so the old history must remain separate.",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.node-inadequate-fna",
      "claim.pediatric-neck-thoracic-gu.progressive-node-assessment"
    ],
    "historyDisposition": "New scored meaning; preserve previous identity/history separately, without transfer."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy-route.v1",
    "displayName": "Choose a safer tissue route with mediastinal compression",
    "learningObjective": "Use positional respiratory symptoms and airway compression to choose a peripheral biopsy strategy in specialist care.",
    "earliestFacilityStage": 4,
    "conceptType": "management",
    "educationalTier": 1,
    "identityDisposition": "new_objective",
    "previousConceptId": null,
    "changedObjective": null,
    "clinicalReason": null,
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.mediastinal-anesthesia-risk",
      "claim.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy",
      "claim.pediatric-neck-thoracic-gu.node-inadequate-fna"
    ],
    "historyDisposition": "New scored meaning; preserve previous identity/history separately, without transfer."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v2",
    "displayName": "Recognize the need for chromosomal assessment",
    "learningObjective": "Interpret a completed 46,XX result with bilateral nonpalpable gonads and choose initial adrenal screening rather than a testicular-function or confirmatory-stage study.",
    "earliestFacilityStage": 4,
    "conceptType": "workup",
    "educationalTier": 1,
    "identityDisposition": "new_meaning_version",
    "previousConceptId": "concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v1",
    "changedObjective": "Interpret a completed 46,XX result with bilateral nonpalpable gonads and choose initial adrenal screening rather than a testicular-function or confirmatory-stage study.",
    "clinicalReason": "Interpret the 46,XX result with bilateral nonpalpable gonads and external findings rather than assigning unseen gonads a testicular identity. Choose initial adrenal biochemical screening, distinguishing it from testicular-function testing and confirmation after a borderline result. This changes the scored decision, so the old history must remain separate.",
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.proximal-meatus-nonpalpable-gonads",
      "claim.pediatric-neck-thoracic-gu.xx-nonpalpable-adrenal-evaluation",
      "claim.pediatric-neck-thoracic-gu.cah-past-infancy-initial-screen",
      "claim.pediatric-neck-thoracic-gu.cah-borderline-confirmation"
    ],
    "historyDisposition": "Preserve previous definitions/history separately; no transfer is authorized for a changed meaning."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-neck-thoracic-gu.cdh-physiologic-readiness.v1",
    "displayName": "Sequence diaphragmatic repair with physiology",
    "learningObjective": "Interpret a worsening support trajectory in congenital diaphragmatic hernia and choose stabilization before repair.",
    "earliestFacilityStage": 4,
    "conceptType": "management",
    "educationalTier": 1,
    "identityDisposition": "new_objective",
    "previousConceptId": null,
    "changedObjective": null,
    "clinicalReason": null,
    "evidenceClaimIds": [
      "claim.pediatric-neck-thoracic-gu.cdh-physiology",
      "claim.pediatric-neck-thoracic-gu.cdh-stabilization-before-repair",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-perfusion-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-oxygen-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-pressure-readiness-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-repair-support-2026",
      "claim.pediatric-neck-thoracic-gu.cdh-cahs-ecmo-consideration-2026"
    ],
    "historyDisposition": "Preserve previous definitions/history separately; no transfer is authorized for a changed meaning."
  }
] as const;
