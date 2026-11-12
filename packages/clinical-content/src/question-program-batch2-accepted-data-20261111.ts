import type {QuestionShipAcceptance,QuestionShipCaseReplacement,QuestionShipTopicConsolidation} from "./question-ship-manifest";
import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";
export const PROGRAM_BATCH2_ROWS: QuestionShipAcceptance[] = [
  {
    "acceptanceId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "conceptId": "concept.trauma-thoracic.bci-selective-imaging.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "conceptId": "concept.trauma-thoracic.bci-arrhythmia-echo.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "caseId": "case.trauma-thoracic.cardiac-disposition.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "conceptId": "concept.blunt-cardiac-injury.monitored-disposition",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "caseId": "case.trauma-thoracic.drain-complication.20261111.v1",
    "nodeId": "node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "conceptId": "concept.trauma-thoracic.chest-drain-organ-trajectory.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "caseId": "case.trauma-thoracic.bleeding-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "conceptId": "concept.trauma-thoracic.hemothorax-physiology-escalation.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.retained-hemothorax.20261111.v2",
    "caseId": "case.trauma-thoracic.bleeding-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.retained-hemothorax.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.retained-hemothorax.20261111.v2",
    "conceptId": "concept.trauma-thoracic.retained-hemothorax-vats.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "caseId": "case.trauma-thoracic.chestwall-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "conceptId": "concept.trauma-thoracic.rib-fixation-failed-weaning.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.screening.v2",
    "caseId": "case.vascular-aorta.screening-review.v2",
    "nodeId": "node.vascular-aorta.screening.v2",
    "questionVariantId": "question.vascular-aorta.screening.v2",
    "conceptId": "concept.aaa.one-time-ultrasound-screening",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.proximal-seal-repair.v1",
    "caseId": "case.vascular-aorta.proximal-attachment-leak.v1",
    "nodeId": "node.vascular-aorta.proximal-seal-repair.v1",
    "questionVariantId": "question.vascular-aorta.proximal-seal-repair.v1",
    "conceptId": "concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.ascending-emergency.v1",
    "caseId": "case.vascular-aorta.retrograde-ascending-extension.v1",
    "nodeId": "node.vascular-aorta.ascending-emergency.v1",
    "questionVariantId": "question.vascular-aorta.ascending-emergency.v1",
    "conceptId": "concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.initial-type-b.v2",
    "caseId": "case.vascular-aorta.impulse-response-review.v2",
    "nodeId": "node.vascular-aorta.initial-type-b.v2",
    "questionVariantId": "question.vascular-aorta.initial-type-b.v2",
    "conceptId": "concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.lsa-coronary-inflow.v1",
    "caseId": "case.vascular-aorta.tevar-inflow-and-neurology.v1",
    "nodeId": "node.vascular-aorta.lsa-coronary-inflow.v1",
    "questionVariantId": "question.vascular-aorta.lsa-coronary-inflow.v1",
    "conceptId": "concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.post-tevar-cord-rescue.v1",
    "caseId": "case.vascular-aorta.tevar-inflow-and-neurology.v1",
    "nodeId": "node.vascular-aorta.post-tevar-cord-rescue.v1",
    "questionVariantId": "question.vascular-aorta.post-tevar-cord-rescue.v1",
    "conceptId": "concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.small-embolizing-paa.v2",
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.small-embolizing-paa.v2",
    "questionVariantId": "question.vascular-aorta.small-embolizing-paa.v2",
    "conceptId": "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.associated-aneurysm-survey.v2",
    "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "conceptId": "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.graft-bleed-imaging.v2",
    "caseId": "case.vascular-aorta.graft-diagnostic-review.v2",
    "nodeId": "node.vascular-aorta.graft-bleed-imaging.v2",
    "questionVariantId": "question.vascular-aorta.graft-bleed-imaging.v2",
    "conceptId": "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.marfan-repair-approach.v1",
    "caseId": "case.vascular-aorta.heritable-native-taaa.v1",
    "nodeId": "node.vascular-aorta.marfan-repair-approach.v1",
    "questionVariantId": "question.vascular-aorta.marfan-repair-approach.v1",
    "conceptId": "concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-acquisition.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "conceptId": "concept.topic.liver-malignancy.dynamic-acquisition.v1",
    "sourceView": "topic-batch2-liver-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "conceptId": "concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1",
    "sourceView": "topic-batch2-liver-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-malignancy.hcc-raw-reserve.v2",
    "caseId": "case.topic.liver-malignancy.hcc-favorable-resection.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-raw-reserve.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-raw-reserve.v2",
    "conceptId": "concept.hcc.compensated-cirrhosis-resection-selection",
    "sourceView": "topic-batch2-liver-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-malignancy.hcc-portal-flow.v1",
    "caseId": "case.topic.liver-malignancy.hcc-portal-flow.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-portal-flow.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-portal-flow.v1",
    "conceptId": "concept.topic.liver-malignancy.hcc-vascular-pathway.v1",
    "sourceView": "topic-batch2-liver-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  }
];
export const PROGRAM_BATCH2_REPLACEMENTS: QuestionShipCaseReplacement[] = [
  {
    "replaces": "case.gs028d.blunt-cardiac-injury.b-both-results-normal",
    "with": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1"
  },
  {
    "replaces": "case.aaa.retired-carpenter",
    "with": "question.vascular-aorta.screening.v2"
  },
  {
    "replaces": "case.aaa.current-smoker",
    "with": "question.vascular-aorta.small-embolizing-paa.v2"
  },
  {
    "replaces": "case.hcc.resection.candidate-profile",
    "with": "question.topic.liver-malignancy.hcc-raw-reserve.v2"
  },
  {
    "replaces": "case.pancreatic-cyst.tail-lesion-review",
    "with": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1"
  },
  {
    "replaces": "case.pancreatic-cyst.surveillance-question",
    "with": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1"
  }
];
export const PROGRAM_BATCH2_CONSOLIDATIONS: QuestionShipTopicConsolidation[] = [
  {
    "id": "topic-program.trauma-thoracic.20261111",
    "program": "topic-program",
    "replaces": [
      "case.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact",
      "case.gs028d.blunt-cardiac-injury.a-fall-anterior-chest",
      "case.gs028d.blunt-cardiac-injury.a-sports-chest-impact",
      "case.gs028d.blunt-cardiac-injury.a-steering-wheel-impact",
      "case.gs028d.blunt-cardiac-injury.b-both-results-abnormal",
      "case.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation",
      "case.gs028d.blunt-cardiac-injury.b-new-ecg-change"
    ],
    "with": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  }
];
export const PROGRAM_BATCH2_VIEWS: Record<string,SyntheticClinicalRelease> = {
  "topic-batch2-trauma-thoracic": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.trauma-thoracic.bci-selective-imaging.v1",
        "displayName": "Select cardiac assessment after an abnormal screen",
        "learningObjective": "Interpret the abnormal troponin as a monitoring indication and choose a screening/reassessment pathway rather than automatic structural or coronary imaging.",
        "earliestFacilityStage": 1,
        "conceptType": "workup"
      },
      {
        "id": "concept.trauma-thoracic.bci-arrhythmia-echo.v1",
        "displayName": "Resolve an inadequate echocardiographic assessment",
        "learningObjective": "Interpret the actual failed transthoracic acquisition and choose transesophageal assessment.",
        "earliestFacilityStage": 1,
        "conceptType": "workup"
      },
      {
        "id": "concept.blunt-cardiac-injury.monitored-disposition",
        "displayName": "Separate cardiac rule-out from other admission needs",
        "learningObjective": "Apply the observed treatment response and respiratory limitations to the remaining hospital disposition.",
        "earliestFacilityStage": 1,
        "conceptType": "disposition"
      },
      {
        "id": "concept.trauma-thoracic.chest-drain-organ-trajectory.v1",
        "displayName": "Handle a drain with an unintended organ trajectory",
        "learningObjective": "Avoid blind tube movement and map the injury before controlled multidisciplinary management.",
        "earliestFacilityStage": 1,
        "conceptType": "complication"
      },
      {
        "id": "concept.trauma-thoracic.hemothorax-physiology-escalation.v1",
        "displayName": "Escalate thoracic bleeding care from physiology",
        "learningObjective": "Use repeated loss of perfusion after transient transfusion response to select an access strategy for unstable thoracic bleeding.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      },
      {
        "id": "concept.trauma-thoracic.retained-hemothorax-vats.v1",
        "displayName": "Treat retained blood after hemorrhage control",
        "learningObjective": "Select clot evacuation rather than repeat initial tube drainage in a stable operative candidate.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      },
      {
        "id": "concept.trauma-thoracic.rib-fixation-failed-weaning.v1",
        "displayName": "Reassess rib stabilization after failed liberation",
        "learningObjective": "Recognize a supported fixation-assessment indication while avoiding a blanket contusion exclusion.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.trauma-thoracic.cardiac-course.20261111.v1",
        "displayName": "Collision follow-up",
        "patientPresentationVariantId": "presentation.trauma-thoracic.cardiac-course.20261111.v1",
        "patientDisplayName": "Elena Morales",
        "prototypeDemographics": {
          "ageYears": 46,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Collision follow-up",
        "presentation": "{patientName}, a 46-year-old woman, attends clinic after discharge following a collision. The founder reviews the hospital decisions using each portion of the record as it is opened.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.trauma-thoracic.cardiac-course.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 46,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Collision follow-up",
            "presentation": "{patientName}, a 46-year-old woman, attends clinic after discharge following a collision. The founder reviews the hospital decisions using each portion of the record as it is opened."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for"
        ],
        "decisionNodes": [
          {
            "id": "node.trauma-thoracic.bci-selective-imaging.20261111.v2",
            "questionVariantId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
            "primaryConceptId": "concept.trauma-thoracic.bci-selective-imaging.v1",
            "currentUpdate": "{patientName} is receiving telemetry and serial troponin reassessment after an anterior chest impact.",
            "stem": "Which additional cardiac-imaging plan should {patientName}'s hospital team choose at this reassessment?",
            "answerChoices": [
              {
                "id": "choice.trauma-thoracic.bci-selective-imaging.v2.surveillance",
                "label": "Continue reassessment without immediate cardiac imaging",
                "isCorrect": true,
                "rationale": "The conduction finding predates injury. The biomarker warrants the shared monitored reassessment, while the current course supplies no further immediate structural-imaging indication.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.bci-selective-imaging.v2.tte",
                "label": "Add transthoracic echocardiography to reassessment",
                "isCorrect": false,
                "rationale": "This adds routine structural screening to a stable abnormal-biomarker assessment. The supplied findings do not establish a separate current structural question.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.bci-selective-imaging.v2.ct",
                "label": "Add cardiac CT to reassessment",
                "isCorrect": false,
                "rationale": "Selected unresolved infarction-versus-traumatic-injury questions may justify cardiac CT. The current record does not establish that additional indication.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The conduction pattern predates trauma, while the elevated biomarker supports the shared monitored reassessment. Immediate imaging requires a clinical question beyond that screening result.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-hospital record",
              "items": [
                {
                  "label": "Before injury ECG",
                  "value": "Sinus rhythm with right bundle-branch block."
                },
                {
                  "label": "Admission ECG",
                  "value": "Sinus rhythm with right bundle-branch block and the same recorded conduction pattern."
                },
                {
                  "label": "Troponin I",
                  "value": "Above the laboratory upper reference limit."
                },
                {
                  "label": "Current course",
                  "value": "Sustained blood pressure, pain reproduced over the injured chest wall, and no persistent arrhythmia."
                }
              ]
            },
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
            "questionVariantId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
            "primaryConceptId": "concept.trauma-thoracic.bci-arrhythmia-echo.v1",
            "currentUpdate": "Later in the admission, {patientName} develops persistent ventricular arrhythmia with pressure drops during episodes. The hospital obtains transthoracic echocardiography, but chest-wall air prevents visualization of ventricular motion and valves; repeated views remain nondiagnostic.",
            "stem": "Which next cardiac-imaging plan best fits {patientName}'s unresolved hospital assessment?",
            "answerChoices": [
              {
                "id": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.tee",
                "label": "Transesophageal echocardiography",
                "isCorrect": true,
                "rationale": "Persistent arrhythmia with hemodynamic effects requires a structural/function assessment. The acquired transthoracic study has not answered that question, supporting the transesophageal route.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.ct",
                "label": "Cardiac CT",
                "isCorrect": false,
                "rationale": "Cardiac CT may help resolve selected infarction-versus-traumatic-injury questions. It is a less direct next answer to the unresolved bedside structural/function assessment in this course.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.mri",
                "label": "Cardiac magnetic resonance imaging",
                "isCorrect": false,
                "rationale": "MRI may characterize selected myocardial injury after initial evaluation. Here, the active structural/function question and inadequate transthoracic examination support TEE first.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.surveillance",
                "label": "Continue monitoring without further cardiac imaging",
                "isCorrect": false,
                "rationale": "Monitoring addresses the arrhythmia risk, but it leaves the indicated structural/function question unanswered because the acquired TTE is nondiagnostic.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The rhythm and pressure changes establish a structural/function question that monitoring has not answered. The acquired transthoracic examination is nondiagnostic, supporting TEE next. CT and MRI serve selected myocardial or ischemic questions. Continuing monitoring without another study would fit an adequate TTE that had already resolved the current question.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.ct",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "Cardiac CT may help resolve selected infarction-versus-traumatic-injury questions. It is a less direct next answer to the unresolved bedside structural/function assessment in this course.",
                "sourceLabels": [
                  "Blunt Cardiac Injury, Screening for"
                ]
              },
              {
                "answerChoiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.mri",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "MRI may characterize selected myocardial injury after initial evaluation. Here, the active structural/function question and inadequate transthoracic examination support TEE first.",
                "sourceLabels": [
                  "Blunt Cardiac Injury, Screening for"
                ]
              },
              {
                "answerChoiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.surveillance",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "Monitoring addresses the arrhythmia risk, but it leaves the indicated structural/function question unanswered because the acquired TTE is nondiagnostic.",
                "sourceLabels": [
                  "Blunt Cardiac Injury, Screening for"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The conduction pattern predates trauma, while the elevated biomarker supports the shared monitored reassessment. Immediate imaging requires a clinical question beyond that screening result. The rhythm and pressure changes establish a structural/function question that monitoring has not answered. The acquired transthoracic examination is nondiagnostic, supporting TEE next. CT and MRI serve selected myocardial or ischemic questions. Continuing monitoring without another study would fit an adequate TTE that had already resolved the current question."
      },
      {
        "id": "case.trauma-thoracic.cardiac-disposition.20261111.v1",
        "displayName": "Chest injury follow-up",
        "patientPresentationVariantId": "presentation.trauma-thoracic.cardiac-disposition.20261111.v1",
        "patientDisplayName": "Marcus Lee",
        "prototypeDemographics": {
          "ageYears": 52,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Chest injury follow-up",
        "presentation": "{patientName}, a 52-year-old man, attends clinic after a chest injury. The founder reviews the outside hospital’s admission decision.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.trauma-thoracic.cardiac-disposition.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 52,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Chest injury follow-up",
            "presentation": "{patientName}, a 52-year-old man, attends clinic after a chest injury. The founder reviews the outside hospital’s admission decision."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Thoracic trauma WSES-AAST guidelines"
        ],
        "decisionNodes": [
          {
            "id": "node.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
            "questionVariantId": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
            "primaryConceptId": "concept.blunt-cardiac-injury.monitored-disposition",
            "currentUpdate": "The founder opens the disposition note from {patientName}’s outside-hospital evaluation.",
            "stem": "Which disposition was justified at {patientName}'s completed hospital assessment?",
            "answerChoices": [
              {
                "id": "choice.trauma-thoracic.bci-normalpair-other-admission.ward",
                "label": "Trauma-ward admission for respiratory care",
                "isCorrect": true,
                "rationale": "The normal cardiac pair removes a BCI-specific monitoring indication, while the actual breathing and secretion-clearance limitations still justify hospital respiratory and analgesic care.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.bci-normalpair-other-admission.telemetry",
                "label": "Telemetry admission for cardiac observation",
                "isCorrect": false,
                "rationale": "The fracture does not create a cardiac-monitoring requirement when the ECG and troponin assessment are normal.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.bci-normalpair-other-admission.home",
                "label": "Home discharge with respiratory exercises",
                "isCorrect": false,
                "rationale": "The disposition rule for the normal cardiac screen does not establish that the patient can manage the remaining chest-injury care at home.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The normal cardiac pair removes a BCI-specific monitoring indication, while the actual breathing and secretion-clearance limitations still justify hospital respiratory and analgesic care. Persistent oxygen and secretion-clearance needs remain after treatment despite normal cardiac tests.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-hospital record; fictional observations",
              "items": [
                {
                  "label": "Cardiac assessment",
                  "value": "Admission ECG and completed troponin I assessment were normal."
                },
                {
                  "label": "Chest injury",
                  "value": "Nondisplaced sternal fracture and several rib fractures."
                },
                {
                  "label": "Response to treatment",
                  "value": "After the documented oral and regional analgesia, {patientName} still stopped inspiration because of pain, could not clear secretions and needed supplemental oxygen."
                }
              ]
            },
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Thoracic trauma WSES-AAST guidelines"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.trauma-thoracic.bci-normalpair-other-admission.telemetry",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "The fracture does not create a cardiac-monitoring requirement when the ECG and troponin assessment are normal.",
                "sourceLabels": [
                  "Blunt Cardiac Injury, Screening for",
                  "Thoracic trauma WSES-AAST guidelines"
                ]
              },
              {
                "answerChoiceId": "choice.trauma-thoracic.bci-normalpair-other-admission.home",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "The disposition rule for the normal cardiac screen does not establish that the patient can manage the remaining chest-injury care at home.",
                "sourceLabels": [
                  "Blunt Cardiac Injury, Screening for",
                  "Thoracic trauma WSES-AAST guidelines"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The normal cardiac pair removes a BCI-specific monitoring indication, while the actual breathing and secretion-clearance limitations still justify hospital respiratory and analgesic care. Persistent oxygen and secretion-clearance needs remain after treatment despite normal cardiac tests."
      },
      {
        "id": "case.trauma-thoracic.drain-complication.20261111.v1",
        "displayName": "Drain placement review",
        "patientPresentationVariantId": "presentation.trauma-thoracic.drain-complication.20261111.v1",
        "patientDisplayName": "Priya Shah",
        "prototypeDemographics": {
          "ageYears": 35,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Drain placement review",
        "presentation": "{patientName}, a 35-year-old woman, attends clinic after a chest-injury admission. The founder reviews the outside hospital’s response to a drain-placement complication.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.trauma-thoracic.drain-complication.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 35,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Drain placement review",
            "presentation": "{patientName}, a 35-year-old woman, attends clinic after a chest-injury admission. The founder reviews the outside hospital’s response to a drain-placement complication."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Thoracic trauma WSES-AAST guidelines"
        ],
        "decisionNodes": [
          {
            "id": "node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
            "questionVariantId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
            "primaryConceptId": "concept.trauma-thoracic.chest-drain-organ-trajectory.v1",
            "currentUpdate": "The founder opens the reassessment immediately after right chest-tube insertion. {patientName} remains hemodynamically stable. The tube has little respiratory movement. Bedside ultrasound follows the catheter across the right diaphragm into hepatic tissue; the adjacent hepatic vessels are not adequately assessed.",
            "stem": "Which tube-management plan should {patientName}'s outside-hospital team choose next?",
            "answerChoices": [
              {
                "id": "choice.trauma-thoracic.chest-drain-organ-trajectory.retain",
                "label": "Retain the tube; obtain contrast CT mapping",
                "isCorrect": true,
                "rationale": "An unintended organ trajectory requires defining the injury and vascular relationships before controlled tube management. Keep the tube in place while urgent cross-sectional assessment and the relevant surgical teams establish that plan.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.chest-drain-organ-trajectory.remove",
                "label": "Remove the tube; obtain ultrasound reassessment",
                "isCorrect": false,
                "rationale": "Removing a catheter that traverses an organ before defining the injury can worsen bleeding; a stable examination is not proof that blind removal is safe.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.chest-drain-organ-trajectory.retract",
                "label": "Retract the tube; obtain repeat chest radiographs",
                "isCorrect": false,
                "rationale": "Blind partial withdrawal still moves the tube through the unintended organ tract, and radiography does not define the unresolved hepatic vascular relationship.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The ultrasound describes an organ-traversing catheter, not a simple inadequate pleural drain. Keep it in place while urgent cross-sectional imaging and the relevant surgical teams define a controlled management plan.",
            "sourceLabels": [
              "Thoracic trauma WSES-AAST guidelines"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.trauma-thoracic.chest-drain-organ-trajectory.remove",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "Removing a catheter that traverses an organ before defining the injury can worsen bleeding; a stable examination is not proof that blind removal is safe.",
                "sourceLabels": [
                  "Thoracic trauma WSES-AAST guidelines"
                ]
              },
              {
                "answerChoiceId": "choice.trauma-thoracic.chest-drain-organ-trajectory.retract",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "Blind partial withdrawal still moves the tube through the unintended organ tract, and radiography does not define the unresolved hepatic vascular relationship.",
                "sourceLabels": [
                  "Thoracic trauma WSES-AAST guidelines"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The ultrasound describes an organ-traversing catheter, not a simple inadequate pleural drain. Keep it in place while urgent cross-sectional imaging and the relevant surgical teams define a controlled management plan."
      },
      {
        "id": "case.trauma-thoracic.bleeding-course.20261111.v1",
        "displayName": "Chest injury review",
        "patientPresentationVariantId": "presentation.trauma-thoracic.bleeding-course.20261111.v1",
        "patientDisplayName": "Diego Rivera",
        "prototypeDemographics": {
          "ageYears": 39,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Chest injury review",
        "presentation": "{patientName}, a 39-year-old man, attends postoperative clinic. The founder reviews the outside hospital’s thoracic bleeding and pleural-recovery decisions.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.trauma-thoracic.bleeding-course.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 39,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Chest injury review",
            "presentation": "{patientName}, a 39-year-old man, attends postoperative clinic. The founder reviews the outside hospital’s thoracic bleeding and pleural-recovery decisions."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Thoracic trauma WSES-AAST guidelines",
          "Hemothorax and Occult Pneumothorax, Management of",
          "Management of simple and retained hemothorax"
        ],
        "decisionNodes": [
          {
            "id": "node.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
            "questionVariantId": "question.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
            "primaryConceptId": "concept.trauma-thoracic.hemothorax-physiology-escalation.v1",
            "currentUpdate": "The founder opens the reassessment after initial thoracic drainage and blood replacement.",
            "stem": "Which hemorrhage-control approach best fits {patientName}'s current hospital record?",
            "answerChoices": [
              {
                "id": "choice.trauma-thoracic.thoracic-bleeding-control.open",
                "label": "Thoracotomy for operative hemostasis",
                "isCorrect": true,
                "rationale": "The recurrent circulatory failure with substantial residual pleural blood warrants operative control; low tube return does not establish that thoracic bleeding has stopped.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.thoracic-bleeding-control.vats",
                "label": "Thoracoscopy for operative hemostasis",
                "isCorrect": false,
                "rationale": "Thoracoscopy is useful in stable patients, but the resuscitation-dependent circulation favors immediate open access for hemorrhage control here.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.thoracic-bleeding-control.embolize",
                "label": "Arterial embolization for hemostasis",
                "isCorrect": false,
                "rationale": "Selected stable thoracic arterial bleeding can be treated endovascularly; the ongoing circulatory instability and need for rapid open assessment make this a weaker first approach.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The large remaining pleural collection and repeated loss of perfusion show that low tube return is not reassuring. Ongoing unstable thoracic bleeding requires operative control.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-hospital record; fictional observations",
              "items": [
                {
                  "label": "Pleural drainage",
                  "value": "The right chest tube initially returned blood but now drains little; bedside imaging still shows a large right pleural collection."
                },
                {
                  "label": "Resuscitation course",
                  "value": "Blood pressure rises during transfusion and falls again when the transfusion rate decreases; peripheral perfusion remains poor."
                },
                {
                  "label": "Other observations",
                  "value": "Abdominal and pelvic reassessment has not identified an alternative source accounting for this course."
                }
              ]
            },
            "sourceLabels": [
              "Thoracic trauma WSES-AAST guidelines",
              "Hemothorax and Occult Pneumothorax, Management of"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.trauma-thoracic.retained-hemothorax.20261111.v2",
            "questionVariantId": "question.trauma-thoracic.retained-hemothorax.20261111.v2",
            "primaryConceptId": "concept.trauma-thoracic.retained-hemothorax-vats.v1",
            "currentUpdate": "Right thoracotomy achieved hemostasis. On hospital day three {patientName} is awake, breathing spontaneously, and maintaining perfusion without vasopressors. CT shows substantial loculated clot in the dependent right pleural space with incomplete lung expansion. The patent pleural tube drains free fluid. Renal function has returned to his preinjury baseline.",
            "stem": "Which pleural treatment should {patientName}'s team choose at this later hospital stage?",
            "answerChoices": [
              {
                "id": "choice.trauma-thoracic.retained-hemothorax.vats",
                "label": "VATS evacuation of pleural clot",
                "isCorrect": true,
                "rationale": "An operative candidate with substantial retained traumatic blood after tube drainage fits the conditional early-VATS strategy.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.retained-hemothorax.tube",
                "label": "Additional tube thoracostomy",
                "isCorrect": false,
                "rationale": "Another tube may address an undrained free-flowing pocket, but it is less likely to resolve the substantial retained clot represented here.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.retained-hemothorax.lytic",
                "label": "Intrapleural fibrinolytic treatment",
                "isCorrect": false,
                "rationale": "Fibrinolysis is a potential selected strategy, particularly when surgery is unsuitable, but EAST conditionally favors early VATS for an operative candidate with retained hemothorax.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "For substantial retained traumatic pleural clot in this recovered patient, EAST conditionally favors early VATS over intrapleural fibrinolysis. Direct evacuation addresses the clot and incomplete expansion. Fibrinolysis remains a selected alternative when the balance of operative risk favors it.",
            "sourceLabels": [
              "Management of simple and retained hemothorax",
              "Thoracic trauma WSES-AAST guidelines",
              "Hemothorax and Occult Pneumothorax, Management of"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.trauma-thoracic.retained-hemothorax.tube",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "Another tube may address an undrained free-flowing pocket, but it is less likely to resolve the substantial retained clot represented here.",
                "sourceLabels": [
                  "Management of simple and retained hemothorax",
                  "Thoracic trauma WSES-AAST guidelines",
                  "Hemothorax and Occult Pneumothorax, Management of"
                ]
              },
              {
                "answerChoiceId": "choice.trauma-thoracic.retained-hemothorax.lytic",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "Fibrinolysis is a potential selected strategy, particularly when surgery is unsuitable, but EAST conditionally favors early VATS for an operative candidate with retained hemothorax.",
                "sourceLabels": [
                  "Management of simple and retained hemothorax",
                  "Thoracic trauma WSES-AAST guidelines",
                  "Hemothorax and Occult Pneumothorax, Management of"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The large remaining pleural collection and repeated loss of perfusion show that low tube return is not reassuring. Ongoing unstable thoracic bleeding requires operative control. For substantial retained traumatic pleural clot in this recovered patient, EAST conditionally favors early VATS over intrapleural fibrinolysis. Direct evacuation addresses the clot and incomplete expansion. Fibrinolysis remains a selected alternative when the balance of operative risk favors it."
      },
      {
        "id": "case.trauma-thoracic.chestwall-course.20261111.v1",
        "displayName": "Chest-wall recovery review",
        "patientPresentationVariantId": "presentation.trauma-thoracic.chestwall-course.20261111.v1",
        "patientDisplayName": "Amina Hassan",
        "prototypeDemographics": {
          "ageYears": 44,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Chest-wall recovery review",
        "presentation": "{patientName}, a 44-year-old woman, attends clinic after a major chest-injury admission. The founder reviews how her outside-hospital chest-wall plan changed during recovery.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.trauma-thoracic.chestwall-course.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 44,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Chest-wall recovery review",
            "presentation": "{patientName}, a 44-year-old woman, attends clinic after a major chest-injury admission. The founder reviews how her outside-hospital chest-wall plan changed during recovery."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Surgical stabilization of rib fractures (SSRF): the WSES and CWIS position paper",
          "Thoracic trauma WSES-AAST guidelines"
        ],
        "decisionNodes": [
          {
            "id": "node.trauma-thoracic.rib-fixation-weaning.20261111.v2",
            "questionVariantId": "question.trauma-thoracic.rib-fixation-weaning.20261111.v2",
            "primaryConceptId": "concept.trauma-thoracic.rib-fixation-failed-weaning.v1",
            "currentUpdate": "{patientName} has recovered from the hemorrhagic phase and maintains perfusion without vasopressors. Multimodal analgesia, regional anesthesia and respiratory rehabilitation continue. CT documents several ipsilateral segmental rib fractures with severe displacement. Lung opacities and oxygen requirements have improved. During two supervised liberation trials, a chest-wall segment moves inward with inspiration as breathing becomes shallow and the cough weakens. Both trials are stopped for respiratory distress.",
            "stem": "Which next treatment plan best fits {patientName}'s hospital recovery findings?",
            "answerChoices": [
              {
                "id": "choice.trauma-thoracic.rib-fixation-weaning.v2.fix",
                "label": "Rib stabilization followed by ventilator-liberation trials",
                "isCorrect": true,
                "rationale": "Persistent mechanical chest-wall instability during failed liberation despite analgesic treatment supports stabilization assessment during this admission. Improving parenchymal disease strengthens the importance of the persistent chest-wall findings.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.rib-fixation-weaning.v2.continue",
                "label": "Current ventilatory support with further liberation trials",
                "isCorrect": false,
                "rationale": "Nonsurgical care is appropriate for many rib injuries. Here, repeated failure despite the ongoing treatment and persistent chest-wall instability support adding fixation assessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.trauma-thoracic.rib-fixation-weaning.v2.tracheostomy",
                "label": "Tracheostomy followed by prolonged ventilator weaning",
                "isCorrect": false,
                "rationale": "Tracheostomy may support prolonged ventilatory needs. It does not address the persistent displaced unstable chest-wall segment demonstrated during these trials.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The lung findings have improved while the displaced segment still moves paradoxically during failed liberation attempts despite analgesic care. That pattern supports rib-stabilization assessment as the next addition to care. Analgesia and rehabilitation continue, and tracheostomy remains a separate option for prolonged support requirements.",
            "sourceLabels": [
              "Surgical stabilization of rib fractures (SSRF): the WSES and CWIS position paper",
              "Thoracic trauma WSES-AAST guidelines"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.trauma-thoracic.rib-fixation-weaning.v2.continue",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "Nonsurgical care is appropriate for many rib injuries. Here, repeated failure despite the ongoing treatment and persistent chest-wall instability support adding fixation assessment.",
                "sourceLabels": [
                  "Surgical stabilization of rib fractures (SSRF): the WSES and CWIS position paper",
                  "Thoracic trauma WSES-AAST guidelines"
                ]
              },
              {
                "answerChoiceId": "choice.trauma-thoracic.rib-fixation-weaning.v2.tracheostomy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
                "clinicalRationale": "Tracheostomy may support prolonged ventilatory needs. It does not address the persistent displaced unstable chest-wall segment demonstrated during these trials.",
                "sourceLabels": [
                  "Surgical stabilization of rib fractures (SSRF): the WSES and CWIS position paper",
                  "Thoracic trauma WSES-AAST guidelines"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The lung findings have improved while the displaced segment still moves paradoxically during failed liberation attempts despite analgesic care. That pattern supports rib-stabilization assessment as the next addition to care. Analgesia and rehabilitation continue, and tracheostomy remains a separate option for prolonged support requirements."
      }
    ]
  },
  "topic-batch2-vascular-aorta": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.aaa.one-time-ultrasound-screening",
        "displayName": "Interpret actual inferior scan coverage before applying abdominal-aortic screening eligibility.",
        "learningObjective": "Interpret actual inferior scan coverage before applying abdominal-aortic screening eligibility.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1",
        "displayName": "Recognize a direct attachment leak and repair the seal despite stable current sac size.",
        "learningObjective": "Recognize a direct attachment leak and repair the seal despite stable current sac size.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1",
        "displayName": "Use total dissection extent rather than entry-tear location to identify the need for emergency ascending repair.",
        "learningObjective": "Use total dissection extent rather than entry-tear location to identify the need for emergency ascending repair.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1",
        "displayName": "Interpret the response of heart rate versus pressure to beta blockade and select the next infusion change.",
        "learningObjective": "Interpret the response of heart rate versus pressure to beta blockade and select the next infusion change.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1",
        "displayName": "Trace LSA-dependent coronary inflow and preserve it before an elective covering graft.",
        "learningObjective": "Trace LSA-dependent coronary inflow and preserve it before an elective covering graft.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1",
        "displayName": "Localize a new post-TEVAR neurologic deficit and reverse impaired spinal perfusion rather than extending pressure reduction.",
        "learningObjective": "Localize a new post-TEVAR neurologic deficit and reverse impaired spinal perfusion rather than extending pressure reduction.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1",
        "displayName": "Identify an embolizing small PAA and choose repair planning rather than size-only or medication-only follow-up.",
        "learningObjective": "Identify an embolizing small PAA and choose repair planning rather than size-only or medication-only follow-up.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1",
        "displayName": "Use the associated aneurysm pattern and actual prior imaging coverage to complete an aneurysm survey without repeating an adequate examination.",
        "learningObjective": "Use the associated aneurysm pattern and actual prior imaging coverage to complete an aneurysm survey without repeating an adequate examination.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1",
        "displayName": "Recognize an unaddressed graft-related source when bleeding and infection coexist after aortic reconstruction.",
        "learningObjective": "Recognize an unaddressed graft-related source when bleeding and infection coexist after aortic reconstruction.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1",
        "displayName": "Choose a durable repair approach for an operable heritable native-aorta TAAA rather than extending routine degenerative-aneurysm EVAR preferences.",
        "learningObjective": "Choose a durable repair approach for an operable heritable native-aorta TAAA rather than extending routine degenerative-aneurysm EVAR preferences.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.vascular-aorta.screening-review.v2",
        "displayName": "Clinic review: outside aortic records",
        "patientPresentationVariantId": "presentation.vascular-aorta.screening-review.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 69,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Aortic screening",
        "presentation": "{patientName}, a 69-year-old man, attends clinic to review an outside preventive-care visit. He stopped smoking after 20 pack-years and had no abdominal or back symptoms at that visit. The archived study is titled aortic CTA; its acquisition runs from the arch to the celiac origin.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-aorta.screening-review.v2",
            "prototypeDemographics": {
              "ageYears": 69,
              "sexLabel": "Male"
            },
            "presentation": "{patientName}, a 69-year-old man, attends clinic to review an outside preventive-care visit. He stopped smoking after 20 pack-years and had no abdominal or back symptoms at that visit. The archived study is titled aortic CTA; its acquisition runs from the arch to the celiac origin."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "US Preventive Services Task Force (2019). Abdominal Aortic Aneurysm: Screening.",
          "Society for Vascular Surgery (undated). Patients with Abdominal Aortic Aneurysm (AAA).",
          "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-aorta.screening.v2",
            "questionVariantId": "question.vascular-aorta.screening.v2",
            "primaryConceptId": "concept.aaa.one-time-ultrasound-screening",
            "stem": "Which aortic imaging plan should have been selected at {patientName}'s preventive visit?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.screening.ultrasound.v2",
                "label": "Obtain abdominal aortic ultrasound",
                "isCorrect": true,
                "rationale": "The prior acquisition stops above the infrarenal aorta. His age and former smoking history still support an abdominal screen.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.screening.cta.v2",
                "label": "Obtain abdominal aortic CT angiography",
                "isCorrect": false,
                "rationale": "His record requires a first preventive abdominal screen, not detailed repair or acute-symptom anatomy; ultrasound is the supported initial modality.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.screening.no_imaging.v2",
                "label": "Arrange no additional aortic imaging",
                "isCorrect": false,
                "rationale": "The study's caudal endpoint leaves the infrarenal aorta outside the acquisition. Smoking cessation does not negate the ever-smoker screening indication.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The celiac-level endpoint leaves the infrarenal aorta unexamined. Apply the screening recommendation to the actual coverage, not the examination's title: abdominal ultrasound is the initial preventive screen for this eligible former smoker.",
            "sourceLabels": [
              "US Preventive Services Task Force (2019). Abdominal Aortic Aneurysm: Screening.",
              "Society for Vascular Surgery (undated). Patients with Abdominal Aortic Aneurysm (AAA).",
              "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-aorta.screening.cta.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "His record requires a first preventive abdominal screen, not detailed repair or acute-symptom anatomy; ultrasound is the supported initial modality.",
                "sourceLabels": [
                  "US Preventive Services Task Force (2019). Abdominal Aortic Aneurysm: Screening.",
                  "Society for Vascular Surgery (undated). Patients with Abdominal Aortic Aneurysm (AAA).",
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
                ]
              },
              {
                "answerChoiceId": "choice.vascular-aorta.screening.no_imaging.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "The study's caudal endpoint leaves the infrarenal aorta outside the acquisition. Smoking cessation does not negate the ever-smoker screening indication.",
                "sourceLabels": [
                  "US Preventive Services Task Force (2019). Abdominal Aortic Aneurysm: Screening.",
                  "Society for Vascular Surgery (undated). Patients with Abdominal Aortic Aneurysm (AAA).",
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
                ]
              }
            ]
          }
        ],
        "learningSummary": "The celiac-level endpoint leaves the infrarenal aorta unexamined. Apply the screening recommendation to the actual coverage, not the examination's title: abdominal ultrasound is the initial preventive screen for this eligible former smoker."
      },
      {
        "id": "case.vascular-aorta.proximal-attachment-leak.v1",
        "displayName": "Clinic review: outside aortic records",
        "patientPresentationVariantId": "presentation.vascular-aorta.proximal-attachment-leak.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 74,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Aortic graft review",
        "presentation": "{patientName}, a 74-year-old woman, attends clinic to review a later outside CTA after EVAR. The sac diameter is unchanged, but contrast passes directly between the proximal graft edge and native aortic wall during the arterial phase. Modular junctions remain continuous. A healthy neck segment remains between the graft edge and the renal arteries.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-aorta.proximal-attachment-leak.v1",
            "prototypeDemographics": {
              "ageYears": 74,
              "sexLabel": "Female"
            },
            "presentation": "{patientName}, a 74-year-old woman, attends clinic to review a later outside CTA after EVAR. The sac diameter is unchanged, but contrast passes directly between the proximal graft edge and native aortic wall during the arterial phase. Modular junctions remain continuous. A healthy neck segment remains between the graft edge and the renal arteries."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Joo-Young Chun et al. (2024). CIRSE Standards of Practice on Management of Endoleaks Following Endovascular Aneurysm Repair."
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-aorta.proximal-seal-repair.v1",
            "questionVariantId": "question.vascular-aorta.proximal-seal-repair.v1",
            "primaryConceptId": "concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1",
            "stem": "Which plan should have followed {patientName}'s proximal attachment finding?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.proximal-seal-repair.cuff.v1",
                "label": "Extend the proximal seal with an aortic cuff",
                "isCorrect": true,
                "rationale": "Direct attachment inflow requires prompt seal correction; the remaining healthy segment supports a cuff.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.proximal-seal-repair.surveillance.v1",
                "label": "Continue aortic duplex imaging surveillance",
                "isCorrect": false,
                "rationale": "Stable sac size does not justify observation of an established late direct attachment leak.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.proximal-seal-repair.branch_coils.v1",
                "label": "Embolize the lumbar inflow and sac cavity",
                "isCorrect": false,
                "rationale": "The demonstrated source is the proximal attachment, not a side branch.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "This arterial-phase attachment route represents a type I sealing failure. Prompt seal repair is appropriate even before the sac enlarges; the available healthy neck makes proximal extension a supported option.",
            "sourceLabels": [
              "Joo-Young Chun et al. (2024). CIRSE Standards of Practice on Management of Endoleaks Following Endovascular Aneurysm Repair."
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-aorta.proximal-seal-repair.surveillance.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "Stable sac size does not justify observation of an established late direct attachment leak.",
                "sourceLabels": [
                  "Joo-Young Chun et al. (2024). CIRSE Standards of Practice on Management of Endoleaks Following Endovascular Aneurysm Repair."
                ]
              },
              {
                "answerChoiceId": "choice.vascular-aorta.proximal-seal-repair.branch_coils.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "The demonstrated source is the proximal attachment, not a side branch.",
                "sourceLabels": [
                  "Joo-Young Chun et al. (2024). CIRSE Standards of Practice on Management of Endoleaks Following Endovascular Aneurysm Repair."
                ]
              }
            ]
          }
        ],
        "learningSummary": "This arterial-phase attachment route represents a type I sealing failure. Prompt seal repair is appropriate even before the sac enlarges; the available healthy neck makes proximal extension a supported option."
      },
      {
        "id": "case.vascular-aorta.retrograde-ascending-extension.v1",
        "displayName": "Clinic review: outside aortic records",
        "patientPresentationVariantId": "presentation.vascular-aorta.retrograde-ascending-extension.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 66,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Dissection record review",
        "presentation": "{patientName}, a 66-year-old woman, visits clinic after hospitalization for abrupt chest and back pain. The founder reviews her initial CTA: the entry tear lies distal to the left subclavian artery, but the flap extends backward through the arch into the ascending aorta. At that assessment she was alert and normotensive, without abdominal pain or limb deficits.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-aorta.retrograde-ascending-extension.v1",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Female"
            },
            "presentation": "{patientName}, a 66-year-old woman, visits clinic after hospitalization for abrupt chest and back pain. The founder reviews her initial CTA: the entry tear lies distal to the left subclavian artery, but the flap extends backward through the arch into the ascending aorta. At that assessment she was alert and normotensive, without abdominal pain or limb deficits."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
          "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease.",
          "Thomas E. MacGillivray et al. (2022). STS/AATS Clinical Practice Guidelines on the Management of Type B Aortic Dissection."
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-aorta.ascending-emergency.v1",
            "questionVariantId": "question.vascular-aorta.ascending-emergency.v1",
            "primaryConceptId": "concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1",
            "stem": "Which definitive hospital plan should have been selected from {patientName}'s initial CTA?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.ascending-emergency.ascending_open.v1",
                "label": "Emergency open ascending aortic repair",
                "isCorrect": true,
                "rationale": "Ascending involvement places this in the type-A pathway despite a descending entry tear.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.ascending-emergency.descending_tevar.v1",
                "label": "Urgent descending thoracic endovascular repair",
                "isCorrect": false,
                "rationale": "Treating the distal tear as a type-B problem does not address the acute ascending involvement.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.ascending-emergency.medical.v1",
                "label": "Intravenous esmolol with CT angiographic follow-up",
                "isCorrect": false,
                "rationale": "Impulse control is background stabilization but not definitive treatment of acute ascending dissection.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Ascending involvement determines the type-A pathway even when the entry tear is distal. Stable current pressure does not remove the need for emergency surgical treatment of acute ascending dissection.",
            "sourceLabels": [
              "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
              "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease.",
              "Thomas E. MacGillivray et al. (2022). STS/AATS Clinical Practice Guidelines on the Management of Type B Aortic Dissection."
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-aorta.ascending-emergency.descending_tevar.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "Treating the distal tear as a type-B problem does not address the acute ascending involvement.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
                  "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease.",
                  "Thomas E. MacGillivray et al. (2022). STS/AATS Clinical Practice Guidelines on the Management of Type B Aortic Dissection."
                ]
              },
              {
                "answerChoiceId": "choice.vascular-aorta.ascending-emergency.medical.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "Impulse control is background stabilization but not definitive treatment of acute ascending dissection.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
                  "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease.",
                  "Thomas E. MacGillivray et al. (2022). STS/AATS Clinical Practice Guidelines on the Management of Type B Aortic Dissection."
                ]
              }
            ]
          }
        ],
        "learningSummary": "Ascending involvement determines the type-A pathway even when the entry tear is distal. Stable current pressure does not remove the need for emergency surgical treatment of acute ascending dissection."
      },
      {
        "id": "case.vascular-aorta.impulse-response-review.v2",
        "displayName": "Clinic review: outside aortic records",
        "patientPresentationVariantId": "presentation.vascular-aorta.impulse-response-review.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 64,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Hospital course review",
        "presentation": "{patientName}, a 64-year-old man, attends clinic to review an outside aortic admission. His initial CTA showed a dissection flap beginning distal to the left subclavian artery without ascending extension or extravasation. The record below documents the subsequent monitored infusion response.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-aorta.impulse-response-review.v2",
            "prototypeDemographics": {
              "ageYears": 64,
              "sexLabel": "Male"
            },
            "presentation": "{patientName}, a 64-year-old man, attends clinic to review an outside aortic admission. His initial CTA showed a dissection flap beginning distal to the left subclavian artery without ascending extension or extravasation. The record below documents the subsequent monitored infusion response."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
          "Caplin Steriles Limited (2026). Nicardipine hydrochloride in sodium chloride injection: prescribing information."
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-aorta.initial-type-b.v2",
            "questionVariantId": "question.vascular-aorta.initial-type-b.v2",
            "primaryConceptId": "concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1",
            "currentUpdate": "The outside monitored-treatment record shows sinus rate falling from 108 to 64/min during esmolol infusion, while arterial pressure remains 184/96 mm Hg. PR interval remains unchanged, the extremities are warm, urine output is maintained and echocardiography shows preserved systolic function without advanced aortic stenosis.",
            "stem": "Which infusion change should have followed {patientName}'s recorded treatment response?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.initial-type-b.add_nicardipine.v2",
                "label": "Add intravenous nicardipine infusion",
                "isCorrect": true,
                "rationale": "Rate has entered the guideline target range while pressure remains uncontrolled; added vasodilation addresses the remaining treatment target after beta blockade.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.initial-type-b.increase_esmolol.v2",
                "label": "Increase the intravenous esmolol infusion",
                "isCorrect": false,
                "rationale": "Escalating rate-slowing therapy does not best address the remaining pressure target once the recorded rate response is adequate and perfusion is preserved.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.initial-type-b.switch_diltiazem.v2",
                "label": "Replace esmolol with intravenous diltiazem",
                "isCorrect": false,
                "rationale": "The record does not demonstrate beta-blocker intolerance or a rate-control failure requiring substitution; it shows persisting pressure elevation after a rate response.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Rate and pressure are separate treatment targets. The observed rate response is within the guideline range, while pressure remains elevated. Add an intravenous vasodilator after initial beta blockade rather than simply intensifying rate reduction or substituting another rate-control agent. Nicardipine provides additional blood-pressure reduction while beta blockade continues.",
            "sourceLabels": [
              "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
              "Caplin Steriles Limited (2026). Nicardipine hydrochloride in sodium chloride injection: prescribing information."
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-aorta.initial-type-b.increase_esmolol.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "Escalating rate-slowing therapy does not best address the remaining pressure target once the recorded rate response is adequate and perfusion is preserved.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
                  "Caplin Steriles Limited (2026). Nicardipine hydrochloride in sodium chloride injection: prescribing information."
                ]
              },
              {
                "answerChoiceId": "choice.vascular-aorta.initial-type-b.switch_diltiazem.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "The record does not demonstrate beta-blocker intolerance or a rate-control failure requiring substitution; it shows persisting pressure elevation after a rate response.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
                  "Caplin Steriles Limited (2026). Nicardipine hydrochloride in sodium chloride injection: prescribing information."
                ]
              }
            ]
          }
        ],
        "learningSummary": "Rate and pressure are separate treatment targets. The observed rate response is within the guideline range, while pressure remains elevated. Add an intravenous vasodilator after initial beta blockade rather than simply intensifying rate reduction or substituting another rate-control agent. Nicardipine provides additional blood-pressure reduction while beta blockade continues."
      },
      {
        "id": "case.vascular-aorta.tevar-inflow-and-neurology.v1",
        "displayName": "Clinic review: outside aortic records",
        "patientPresentationVariantId": "presentation.vascular-aorta.tevar-inflow-and-neurology.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 70,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Thoracic repair review",
        "presentation": "{patientName}, a 70-year-old man, visits clinic to review an outside elective descending thoracic aneurysm repair. The planned proximal sealing segment spans the left subclavian origin. His CABG record shows a patent pedicled left internal mammary graft arising from the left subclavian artery to the LAD; the native LAD is chronically occluded. Both carotid arteries are patent.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-aorta.tevar-inflow-and-neurology.v1",
            "prototypeDemographics": {
              "ageYears": 70,
              "sexLabel": "Male"
            },
            "presentation": "{patientName}, a 70-year-old man, visits clinic to review an outside elective descending thoracic aneurysm repair. The planned proximal sealing segment spans the left subclavian origin. His CABG record shows a patent pedicled left internal mammary graft arising from the left subclavian artery to the LAD; the native LAD is chronically occluded. Both carotid arteries are patent."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
          "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease.",
          "Thomas E. MacGillivray et al. (2022). STS/AATS Clinical Practice Guidelines on the Management of Type B Aortic Dissection."
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-aorta.lsa-coronary-inflow.v1",
            "questionVariantId": "question.vascular-aorta.lsa-coronary-inflow.v1",
            "primaryConceptId": "concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1",
            "stem": "Which left-subclavian strategy should have accompanied {patientName}'s elective TEVAR plan?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.lsa-coronary-inflow.bypass.v1",
                "label": "Carotid-subclavian bypass before aortic coverage",
                "isCorrect": true,
                "rationale": "LSA interruption threatens inflow to the patent LIMA graft supplying an occluded native LAD territory.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.lsa-coronary-inflow.defer.v1",
                "label": "Aortic coverage, then bypass if arm ischemia develops",
                "isCorrect": false,
                "rationale": "An arm-symptom trigger does not protect the LIMA-dependent coronary circulation during elective coverage.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.lsa-coronary-inflow.transposition.v1",
                "label": "Carotid-subclavian transposition before aortic coverage",
                "isCorrect": false,
                "rationale": "Transposition requires proximal subclavian clamping, which can interrupt the patent pedicled LIMA coronary inflow; bypass avoids that required interruption.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Protect the pedicled LIMA coronary inflow before elective LSA coverage. Bypass avoids the proximal subclavian clamp required for transposition; waiting for arm ischemia also fails to protect this coronary-dependent territory.",
            "sourceLabels": [
              "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
              "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease.",
              "Thomas E. MacGillivray et al. (2022). STS/AATS Clinical Practice Guidelines on the Management of Type B Aortic Dissection."
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.vascular-aorta.post-tevar-cord-rescue.v1",
            "questionVariantId": "question.vascular-aorta.post-tevar-cord-rescue.v1",
            "primaryConceptId": "concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1",
            "currentUpdate": "The later outside ICU record describes new bilateral leg weakness after a hypotensive episode following long-segment TEVAR. Both feet remain warm with palpable pulses. Speech, face and arm movement are unchanged. Platelet count and coagulation studies are normal, and no neuraxial drain is present.",
            "stem": "Which immediate rescue plan should have been activated for {patientName}'s postoperative findings?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.post-tevar-cord-rescue.perfusion.v1",
                "label": "Vasopressor-supported perfusion with CSF-drainage rescue",
                "isCorrect": true,
                "rationale": "The pattern points to spinal-cord perfusion injury; pressure support and reduction of intrathecal pressure address that mechanism.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.post-tevar-cord-rescue.impulse.v1",
                "label": "Esmolol-based pressure reduction with intravenous analgesia",
                "isCorrect": false,
                "rationale": "Further pressure reduction would work against perfusion rescue in this new postoperative neurologic syndrome.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.post-tevar-cord-rescue.limb.v1",
                "label": "Heparin anticoagulation with urgent aortoiliac thrombectomy",
                "isCorrect": false,
                "rationale": "Warm feet and preserved pulses make aortoiliac occlusion a poorer explanation than spinal perfusion injury.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Bilateral leg weakness after hypotension with preserved limb pulses raises concern for spinal-cord ischemia. Activate perfusion rescue and specialist CSF-drainage assessment; the new phase calls for restoring cord perfusion rather than intensifying impulse reduction.",
            "sourceLabels": [
              "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
              "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease."
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-aorta.post-tevar-cord-rescue.impulse.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "Further pressure reduction would work against perfusion rescue in this new postoperative neurologic syndrome.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
                  "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease."
                ]
              },
              {
                "answerChoiceId": "choice.vascular-aorta.post-tevar-cord-rescue.limb.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "Warm feet and preserved pulses make aortoiliac occlusion a poorer explanation than spinal perfusion injury.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
                  "Yuri Gupta et al. (2026). CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease."
                ]
              }
            ]
          }
        ],
        "learningSummary": "Protect the pedicled LIMA coronary inflow before elective LSA coverage. Bypass avoids the proximal subclavian clamp required for transposition; waiting for arm ischemia also fails to protect this coronary-dependent territory. Bilateral leg weakness after hypotension with preserved limb pulses raises concern for spinal-cord ischemia. Activate perfusion rescue and specialist CSF-drainage assessment; the new phase calls for restoring cord perfusion rather than intensifying impulse reduction."
      },
      {
        "id": "case.vascular-aorta.small-popliteal-course.v2",
        "displayName": "Clinic review: outside aortic records",
        "patientPresentationVariantId": "presentation.vascular-aorta.small-popliteal-course.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 68,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Toe discoloration",
        "presentation": "{patientName}, a 68-year-old man, attends clinic to review an outside vascular course. He had repeated brief episodes of painful blue right toes. The foot remained warm with palpable pedal pulses and normal strength and sensation. Right-leg duplex showed an 18-mm focal popliteal dilation containing mural thrombus; distal imaging showed small digital arterial occlusions.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-aorta.small-popliteal-course.v2",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "presentation": "{patientName}, a 68-year-old man, attends clinic to review an outside vascular course. He had repeated brief episodes of painful blue right toes. The foot remained warm with palpable pedal pulses and normal strength and sensation. Right-leg duplex showed an 18-mm focal popliteal dilation containing mural thrombus; distal imaging showed small digital arterial occlusions."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Alik Farber et al. (2022). SVS clinical practice guidelines on popliteal artery aneurysms.",
          "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-aorta.small-embolizing-paa.v2",
            "questionVariantId": "question.vascular-aorta.small-embolizing-paa.v2",
            "primaryConceptId": "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1",
            "stem": "Which aneurysm plan should have been selected for {patientName}'s right popliteal lesion?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.small-embolizing-paa.repair_plan.v2",
                "label": "Plan popliteal aneurysm repair with vascular surgery",
                "isCorrect": true,
                "rationale": "Repeated digital embolic findings and mural thrombus support aneurysm source repair consideration despite a diameter below 20 mm.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.small-embolizing-paa.anticoagulate.v2",
                "label": "Start anticoagulation with popliteal duplex follow-up",
                "isCorrect": false,
                "rationale": "This addresses thrombotic risk without removing the demonstrated aneurysmal source. The supported strategy includes repair assessment rather than relying on medication as the definitive plan.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.small-embolizing-paa.surveillance.v2",
                "label": "Continue annual popliteal duplex surveillance",
                "isCorrect": false,
                "rationale": "The asymptomatic small-aneurysm policy does not address repeated embolic complications in this record.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Digital occlusions with a thrombus-containing PAA support distal embolization even when pedal pulses remain palpable. The complication warrants vascular repair planning below the usual asymptomatic size boundary. This selects repair versus medication/surveillance; conduit assessment and anatomy determine the eventual open or endovascular technique.",
            "sourceLabels": [
              "Alik Farber et al. (2022). SVS clinical practice guidelines on popliteal artery aneurysms."
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.vascular-aorta.associated-aneurysm-survey.v2",
            "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
            "primaryConceptId": "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1",
            "currentUpdate": "The outside file contains the following acquired studies and observations from that same workup.",
            "stem": "Which additional aneurysm study should have been selected after review of {patientName}'s original acquisitions?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.associated-aneurysm-survey.left_arterial.v2",
                "label": "Left popliteal arterial duplex ultrasound",
                "isCorrect": true,
                "rationale": "The left-leg examination evaluates veins, not a contralateral arterial aneurysm; the abdominal aorta is already adequately depicted.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.associated-aneurysm-survey.aortic.v2",
                "label": "Abdominal aortic duplex ultrasound",
                "isCorrect": false,
                "rationale": "This is an appropriate associated site but does not address the remaining arterial target after an adequate abdominal CTA.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.associated-aneurysm-survey.thoracic.v2",
                "label": "Thoracic aortic CT angiography",
                "isCorrect": false,
                "rationale": "A thoracic study does not complete the specifically supported opposite-popliteal and abdominal-aortic associated survey.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Screening associated with a PAA includes the opposite popliteal artery and abdominal aorta. The acquired left-leg study documents venous compression and flow; that reassuring result does not assess the contralateral arterial target. The abdominal CTA already supplies the aortic component of this survey.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed original acquisition and observation log",
              "columnHeaders": [
                "Acquisition",
                "Recorded observations"
              ],
              "rowHeaders": [
                "Abdomen/pelvis CTA",
                "Left-leg ultrasound",
                "Right-leg arterial duplex"
              ],
              "cells": [
                [
                  "Renal origins through aortic bifurcation",
                  "Outer aortic contours traced; maximum 2.5 cm"
                ],
                [
                  "Deep venous compression and Doppler sequences",
                  "Femoral and popliteal veins compressible with venous flow"
                ],
                [
                  "Femoral through pedal arterial sequences",
                  "18-mm popliteal dilation with mural thrombus"
                ]
              ]
            },
            "sourceLabels": [
              "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
              "Alik Farber et al. (2022). SVS clinical practice guidelines on popliteal artery aneurysms."
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-aorta.associated-aneurysm-survey.aortic.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "This is an appropriate associated site but does not address the remaining arterial target after an adequate abdominal CTA.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
                  "Alik Farber et al. (2022). SVS clinical practice guidelines on popliteal artery aneurysms."
                ]
              },
              {
                "answerChoiceId": "choice.vascular-aorta.associated-aneurysm-survey.thoracic.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "A thoracic study does not complete the specifically supported opposite-popliteal and abdominal-aortic associated survey.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease.",
                  "Alik Farber et al. (2022). SVS clinical practice guidelines on popliteal artery aneurysms."
                ]
              }
            ]
          }
        ],
        "learningSummary": "Digital occlusions with a thrombus-containing PAA support distal embolization even when pedal pulses remain palpable. The complication warrants vascular repair planning below the usual asymptomatic size boundary. This selects repair versus medication/surveillance; conduit assessment and anatomy determine the eventual open or endovascular technique. Screening associated with a PAA includes the opposite popliteal artery and abdominal aorta. The acquired left-leg study documents venous compression and flow; that reassuring result does not assess the contralateral arterial target. The abdominal CTA already supplies the aortic component of this survey."
      },
      {
        "id": "case.vascular-aorta.graft-diagnostic-review.v2",
        "displayName": "Clinic review: outside aortic records",
        "patientPresentationVariantId": "presentation.vascular-aorta.graft-diagnostic-review.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 75,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Graft follow-up",
        "presentation": "{patientName}, a 75-year-old man, comes to clinic after hospitalization several months after open infrarenal AAA grafting. His outside record describes fever, recurrent positive blood cultures and intermittent melena. Upper endoscopy examined the esophagus, stomach and first two duodenal portions without finding a bleeding source. He was alert with preserved pressure between bleeding episodes.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-aorta.graft-diagnostic-review.v2",
            "prototypeDemographics": {
              "ageYears": 75,
              "sexLabel": "Male"
            },
            "presentation": "{patientName}, a 75-year-old man, comes to clinic after hospitalization several months after open infrarenal AAA grafting. His outside record describes fever, recurrent positive blood cultures and intermittent melena. Upper endoscopy examined the esophagus, stomach and first two duodenal portions without finding a bleeding source. He was alert with preserved pressure between bleeding episodes."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-aorta.graft-bleed-imaging.v2",
            "questionVariantId": "question.vascular-aorta.graft-bleed-imaging.v2",
            "primaryConceptId": "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1",
            "stem": "Which investigation should have followed {patientName}'s unrevealing upper endoscopy during that admission?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.graft-bleed-imaging.cta.v2",
                "label": "Multiphase abdominal CT angiography",
                "isCorrect": true,
                "rationale": "The combination of prosthetic aortic history, unexplained bacteremia and bleeding calls for cross-sectional vascular and extraluminal assessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.graft-bleed-imaging.push_enteroscopy.v2",
                "label": "Push enteroscopy into the distal duodenum",
                "isCorrect": false,
                "rationale": "This is a genuine new mucosal target beyond the previous examination, but it does not replace cross-sectional evaluation of the prosthetic reconstruction and surrounding infection concern.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.graft-bleed-imaging.red_cell_scan.v2",
                "label": "Tagged-red-cell gastrointestinal bleeding scintigraphy",
                "isCorrect": false,
                "rationale": "Localization of intermittent bleeding does not characterize the prosthetic/infectious interface that links the other observations.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Prosthetic aortic history, unexplained bloodstream infection and bleeding raise a linked vascular concern. Cross-sectional assessment is appropriate even when a proximal mucosal examination is unrevealing. Distal enteroscopy offers a real new luminal target, but that target does not substitute for evaluating the reconstruction and extraluminal findings.",
            "sourceLabels": [
              "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-aorta.graft-bleed-imaging.push_enteroscopy.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "This is a genuine new mucosal target beyond the previous examination, but it does not replace cross-sectional evaluation of the prosthetic reconstruction and surrounding infection concern.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
                ]
              },
              {
                "answerChoiceId": "choice.vascular-aorta.graft-bleed-imaging.red_cell_scan.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "Localization of intermittent bleeding does not characterize the prosthetic/infectious interface that links the other observations.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
                ]
              }
            ]
          }
        ],
        "learningSummary": "Prosthetic aortic history, unexplained bloodstream infection and bleeding raise a linked vascular concern. Cross-sectional assessment is appropriate even when a proximal mucosal examination is unrevealing. Distal enteroscopy offers a real new luminal target, but that target does not substitute for evaluating the reconstruction and extraluminal findings."
      },
      {
        "id": "case.vascular-aorta.heritable-native-taaa.v1",
        "displayName": "Clinic review: outside aortic records",
        "patientPresentationVariantId": "presentation.vascular-aorta.heritable-native-taaa.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Aortic repair consultation",
        "presentation": "{patientName}, a 43-year-old man with genetically confirmed Marfan syndrome, attends clinic to review an outside aortic-team plan. An enlarging intact thoracoabdominal aneurysm includes the visceral origins; both potential endograft sealing regions are native aorta. He is active without major cardiac, pulmonary or renal dysfunction. Repair has been recommended, and both open and branched endovascular reconstruction are technically possible.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-aorta.heritable-native-taaa.v1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "presentation": "{patientName}, a 43-year-old man with genetically confirmed Marfan syndrome, attends clinic to review an outside aortic-team plan. An enlarging intact thoracoabdominal aneurysm includes the visceral origins; both potential endograft sealing regions are native aorta. He is active without major cardiac, pulmonary or renal dysfunction. Repair has been recommended, and both open and branched endovascular reconstruction are technically possible."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-aorta.marfan-repair-approach.v1",
            "questionVariantId": "question.vascular-aorta.marfan-repair-approach.v1",
            "primaryConceptId": "concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1",
            "stem": "Which repair approach should have been preferred for {patientName}'s intact thoracoabdominal aneurysm?",
            "answerChoices": [
              {
                "id": "choice.vascular-aorta.marfan-repair-approach.open.v1",
                "label": "Open thoracoabdominal graft replacement",
                "isCorrect": true,
                "rationale": "Heritable native-aorta disease in an operable patient favors open reconstruction when repair is required.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.marfan-repair-approach.branched.v1",
                "label": "Branched endovascular thoracoabdominal repair",
                "isCorrect": false,
                "rationale": "Technical feasibility does not erase the guideline preference for open repair in this heritable native-aorta setting.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-aorta.marfan-repair-approach.hybrid.v1",
                "label": "Visceral debranching with thoracic endografting",
                "isCorrect": false,
                "rationale": "A hybrid operation still relies on endograft sealing in the diseased native aorta rather than providing the preferred open reconstruction.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "For an intact TAAA requiring repair in Marfan syndrome, the checked multisociety guideline favors open repair. Native-aortic tissue disease and long-term durability matter even when branched or hybrid reconstruction is technically possible.",
            "sourceLabels": [
              "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-aorta.marfan-repair-approach.branched.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "Technical feasibility does not erase the guideline preference for open repair in this heritable native-aorta setting.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
                ]
              },
              {
                "answerChoiceId": "choice.vascular-aorta.marfan-repair-approach.hybrid.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic chart-review exercise records the selected outside-care plan.",
                "clinicalRationale": "A hybrid operation still relies on endograft sealing in the diseased native aorta rather than providing the preferred open reconstruction.",
                "sourceLabels": [
                  "Eric M. Isselbacher et al. (2022). 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease."
                ]
              }
            ]
          }
        ],
        "learningSummary": "For an intact TAAA requiring repair in Marfan syndrome, the checked multisociety guideline favors open repair. Native-aortic tissue disease and long-term durability matter even when branched or hybrid reconstruction is technically possible."
      }
    ]
  },
  "topic-batch2-liver-malignancy": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.topic.liver-malignancy.dynamic-acquisition.v1",
        "displayName": "Select the next diagnostic study from the acquired contrast phases rather than treating an incomplete examination as exclusion.",
        "learningObjective": "Select the next diagnostic study from the acquired contrast phases rather than treating an incomplete examination as exclusion.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1",
        "displayName": "Distinguish two raw enhancement patterns in cirrhosis to select the lesion requiring tissue classification.",
        "learningObjective": "Distinguish two raw enhancement patterns in cirrhosis to select the lesion requiring tissue classification.",
        "earliestFacilityStage": 0,
        "conceptType": "diagnosis"
      },
      {
        "id": "concept.hcc.compensated-cirrhosis-resection-selection",
        "displayName": "HCC resection selection in compensated cirrhosis",
        "learningObjective": "For the approved favorable compensated-cirrhosis profile, select hospital HPB-surgery referral for hepatic resection evaluation without treating Child-Pugh A status or Milan classification alone as sufficient.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.topic.liver-malignancy.hcc-vascular-pathway.v1",
        "displayName": "Integrate major portal obstruction with tumor stage before choosing a liver-directed or systemic HCC assessment.",
        "learningObjective": "Integrate major portal obstruction with tumor stage before choosing a liver-directed or systemic HCC assessment.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.topic.liver-malignancy.dynamic-hcc.v1",
        "displayName": "Nora Patel: Liver lesion review",
        "patientPresentationVariantId": "presentation.topic.liver-malignancy.dynamic-hcc.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Nora Patel",
        "prototypeDemographics": {
          "ageYears": 59,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Liver lesion review",
        "presentation": "{patientName}, a 59-year-old woman with cirrhosis, comes to clinic to review outside testing for a new liver lesion.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.liver-malignancy.dynamic-hcc.v1",
            "prototypeDemographics": {
              "ageYears": 59,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Liver lesion review",
            "presentation": "{patientName}, a 59-year-old woman with cirrhosis, comes to clinic to review outside testing for a new liver lesion."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.referral",
        "sourceLabels": [
          "Primary Liver Cancer Treatment (PDQ) - Health Professional Version"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.liver-malignancy.hcc-acquisition.v1",
            "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
            "primaryConceptId": "concept.topic.liver-malignancy.dynamic-acquisition.v1",
            "stem": "Which study should be obtained next to characterize {patientName}'s 2.6-cm liver lesion?",
            "answerChoices": [
              {
                "id": "dedicated_mri",
                "label": "Multiphasic contrast-enhanced liver MRI",
                "isCorrect": true,
                "rationale": "The outside CT did not acquire the vascular phases needed to characterize this lesion in cirrhosis.",
                "serviceRequest": null
              },
              {
                "id": "core_biopsy",
                "label": "Image-guided core biopsy of the lesion",
                "isCorrect": false,
                "rationale": "Biopsy may become appropriate after adequate characterization remains inconclusive; the current CT was not a dynamic liver examination.",
                "serviceRequest": null
              },
              {
                "id": "ultrasound",
                "label": "Interval conventional liver ultrasound",
                "isCorrect": false,
                "rationale": "A solid lesion of this size in cirrhosis needs diagnostic characterization rather than a surveillance-only repeat.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Interpret the acquisition record before the lesion description. The portal-phase CT cannot establish the needed vascular behavior; a dedicated liver MRI supplies diagnostic contrast phases. A biopsy decision follows adequate characterization when uncertainty persists.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside record",
              "items": [
                {
                  "label": "Ultrasound",
                  "value": "A 2.6-cm solid liver lesion."
                },
                {
                  "label": "Outside CT protocol",
                  "value": "Portal-venous acquisition only; arterial and delayed acquisitions were not performed."
                },
                {
                  "label": "CT observation",
                  "value": "The lesion is lower in attenuation than the surrounding liver."
                }
              ]
            },
            "sourceLabels": [
              "Primary Liver Cancer Treatment (PDQ) - Health Professional Version"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
            "questionVariantId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
            "primaryConceptId": "concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1",
            "currentUpdate": "At a later clinic visit, {patientName} brings a completed outside liver MRI that identifies two lesions. No tissue has been sampled. There is no separate trial or molecular-testing indication for biopsy.",
            "stem": "Under the imaging-based diagnostic pathway, which minimum lesion-sampling plan is required before selecting tumor-specific treatment for {patientName}'s two liver lesions?",
            "answerChoices": [
              {
                "id": "sample_six",
                "label": "Biopsy segment VI; classify segment II by imaging",
                "isCorrect": true,
                "rationale": "The segment VI pattern is malignant-appearing but not HCC-specific. Segment II has an imaging-characteristic HCC pattern in cirrhosis; no separate reason requiring its tissue is supplied.",
                "serviceRequest": null
              },
              {
                "id": "sample_two",
                "label": "Biopsy segment II; classify segment VI by imaging",
                "isCorrect": false,
                "rationale": "Sampling the larger classic-pattern lesion leaves the non-HCC-specific segment VI lesion without tissue classification. Size alone does not select the diagnostic target.",
                "serviceRequest": null
              },
              {
                "id": "sample_both",
                "label": "Biopsy both lesions; defer classification of each",
                "isCorrect": false,
                "rationale": "Biopsy of both can be considered for a separate indication, but it exceeds the minimum diagnostic tissue requirement in this represented imaging pathway. Segment II already meets imaging criteria.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Interpret each lesion independently. The segment II nonrim-enhancement/washout pattern in cirrhosis supports an imaging diagnosis; the segment VI rim-enhancing pattern indicates malignancy without establishing its histologic type. Obtain tissue from segment VI before choosing tumor-specific treatment. Optional sampling of an imaging-characteristic HCC for another clinical purpose is a separate decision.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside record",
              "items": [
                {
                  "label": "Background and acquisition",
                  "value": "Cirrhosis. Arterial, portal-venous and delayed contrast phases are technically adequate."
                },
                {
                  "label": "Segment II lesion",
                  "value": "2.6 cm. Nonrim arterial hyperenhancement followed by nonperipheral washout."
                },
                {
                  "label": "Segment VI lesion",
                  "value": "2.1 cm. Peripheral-rim arterial enhancement followed by progressive delayed central enhancement."
                },
                {
                  "label": "Sampling conditions",
                  "value": "Both lesions can be safely targeted for core biopsy. Tumor-specific treatment has not been selected."
                }
              ]
            },
            "sourceLabels": [
              "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "sample_two",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the outside record and the selected plan before continuing.",
                "clinicalRationale": "Sampling the larger classic-pattern lesion leaves the non-HCC-specific segment VI lesion without tissue classification. Size alone does not select the diagnostic target.",
                "sourceLabels": [
                  "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma"
                ]
              },
              {
                "answerChoiceId": "sample_both",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the outside record and the selected plan before continuing.",
                "clinicalRationale": "Biopsy of both can be considered for a separate indication, but it exceeds the minimum diagnostic tissue requirement in this represented imaging pathway. Segment II already meets imaging criteria.",
                "sourceLabels": [
                  "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Interpret the acquisition record before the lesion description. The portal-phase CT cannot establish the needed vascular behavior; a dedicated liver MRI supplies diagnostic contrast phases. A biopsy decision follows adequate characterization when uncertainty persists. Interpret each lesion independently. The segment II nonrim-enhancement/washout pattern in cirrhosis supports an imaging diagnosis; the segment VI rim-enhancing pattern indicates malignancy without establishing its histologic type. Obtain tissue from segment VI before choosing tumor-specific treatment. Optional sampling of an imaging-characteristic HCC for another clinical purpose is a separate decision."
      },
      {
        "id": "case.topic.liver-malignancy.hcc-favorable-resection.v1",
        "displayName": "Elaine Brooks: Treatment planning",
        "patientPresentationVariantId": "presentation.topic.liver-malignancy.hcc-favorable-resection.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Elaine Brooks",
        "prototypeDemographics": {
          "ageYears": 61,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Treatment planning",
        "presentation": "{patientName}, a 61-year-old woman with cirrhosis and confirmed HCC, comes to clinic to review outside treatment planning.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.liver-malignancy.hcc-favorable-resection.v1",
            "prototypeDemographics": {
              "ageYears": 61,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Treatment planning",
            "presentation": "{patientName}, a 61-year-old woman with cirrhosis and confirmed HCC, comes to clinic to review outside treatment planning."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.referral",
        "sourceLabels": [
          "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
          "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma",
          "Primary Liver Cancer Treatment (PDQ) - Health Professional Version",
          "Resectability and Ablatability Criteria for the Treatment of Liver Only Colorectal Metastases: Multidisciplinary Consensus Document from the COLLISION Trial Group"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.liver-malignancy.hcc-raw-reserve.v2",
            "questionVariantId": "question.topic.liver-malignancy.hcc-raw-reserve.v2",
            "primaryConceptId": "concept.hcc.compensated-cirrhosis-resection-selection",
            "stem": "Which specialist treatment assessment should be prioritized for {patientName}'s HCC?",
            "answerChoices": [
              {
                "id": "hpb",
                "label": "HPB-surgery assessment for hepatic resection",
                "isCorrect": true,
                "rationale": "The combined reserve and anatomic observations support the existing favorable resection profile.",
                "serviceRequest": null
              },
              {
                "id": "transplant",
                "label": "Transplant-center assessment for liver transplantation",
                "isCorrect": false,
                "rationale": "Tumor-burden eligibility is not a requirement to choose transplantation when the patient has a favorable resection profile.",
                "serviceRequest": null
              },
              {
                "id": "ablation",
                "label": "Interventional-radiology assessment for thermal ablation",
                "isCorrect": false,
                "rationale": "A larger peripheral lesion with favorable resection anatomy and reserve supports resection assessment here.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The laboratory, clinical and anatomic record must be interpreted together. They support specialist resection assessment rather than letting tumor-burden eligibility select transplantation. This is an assessment priority, not automatic clearance for an operation or an absolute prohibition of every alternative local treatment.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside record",
              "items": [
                {
                  "label": "Tumor/staging",
                  "value": "One peripheral 4.6-cm lesion; no major vessel involvement or extrahepatic tumor."
                },
                {
                  "label": "Observed reserve",
                  "value": "Albumin 4.0 g/dL, bilirubin 0.8 mg/dL, INR 1.0, platelets 198,000/microliter."
                },
                {
                  "label": "Clinical/endoscopic record",
                  "value": "No ascites or encephalopathy; endoscopy shows no varices."
                },
                {
                  "label": "Resection map",
                  "value": "A limited resection leaves most of the liver, with patent arterial/portal inflow, hepatic veins and bile ducts."
                }
              ]
            },
            "sourceLabels": [
              "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
              "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma",
              "Primary Liver Cancer Treatment (PDQ) - Health Professional Version",
              "Resectability and Ablatability Criteria for the Treatment of Liver Only Colorectal Metastases: Multidisciplinary Consensus Document from the COLLISION Trial Group"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "transplant",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the outside record and the selected plan before continuing.",
                "clinicalRationale": "Tumor-burden eligibility is not a requirement to choose transplantation when the patient has a favorable resection profile.",
                "sourceLabels": [
                  "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
                  "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma",
                  "Primary Liver Cancer Treatment (PDQ) - Health Professional Version",
                  "Resectability and Ablatability Criteria for the Treatment of Liver Only Colorectal Metastases: Multidisciplinary Consensus Document from the COLLISION Trial Group"
                ]
              },
              {
                "answerChoiceId": "ablation",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the outside record and the selected plan before continuing.",
                "clinicalRationale": "A larger peripheral lesion with favorable resection anatomy and reserve supports resection assessment here.",
                "sourceLabels": [
                  "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
                  "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma",
                  "Primary Liver Cancer Treatment (PDQ) - Health Professional Version",
                  "Resectability and Ablatability Criteria for the Treatment of Liver Only Colorectal Metastases: Multidisciplinary Consensus Document from the COLLISION Trial Group"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The laboratory, clinical and anatomic record must be interpreted together. They support specialist resection assessment rather than letting tumor-burden eligibility select transplantation. This is an assessment priority, not automatic clearance for an operation or an absolute prohibition of every alternative local treatment."
      },
      {
        "id": "case.topic.liver-malignancy.hcc-portal-flow.v1",
        "displayName": "Omar Bennett: Staging discussion",
        "patientPresentationVariantId": "presentation.topic.liver-malignancy.hcc-portal-flow.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Omar Bennett",
        "prototypeDemographics": {
          "ageYears": 64,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Staging discussion",
        "presentation": "{patientName}, a 64-year-old man with cirrhosis and confirmed HCC, comes to clinic with his outside staging records.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.liver-malignancy.hcc-portal-flow.v1",
            "prototypeDemographics": {
              "ageYears": 64,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Staging discussion",
            "presentation": "{patientName}, a 64-year-old man with cirrhosis and confirmed HCC, comes to clinic with his outside staging records."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.referral",
        "sourceLabels": [
          "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
          "Primary Liver Cancer Treatment (PDQ) - Health Professional Version"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.liver-malignancy.hcc-portal-flow.v1",
            "questionVariantId": "question.topic.liver-malignancy.hcc-portal-flow.v1",
            "primaryConceptId": "concept.topic.liver-malignancy.hcc-vascular-pathway.v1",
            "stem": "Which treatment-planning pathway should be prioritized for {patientName} after this staging?",
            "answerChoices": [
              {
                "id": "systemic",
                "label": "Medical-oncology assessment for systemic HCC therapy",
                "isCorrect": true,
                "rationale": "Major portal tumor involvement changes the pathway despite the limited measured liver mass; preserved condition supports systemic assessment.",
                "serviceRequest": null
              },
              {
                "id": "tace",
                "label": "Interventional-radiology assessment for hepatic chemoembolization",
                "isCorrect": false,
                "rationale": "Arterial embolization in a liver with major portal obstruction risks the remaining hepatic perfusion; this is not the routine favorable TACE profile.",
                "serviceRequest": null
              },
              {
                "id": "transplant",
                "label": "Transplant-center assessment for standard HCC transplantation",
                "isCorrect": false,
                "rationale": "A small measured mass does not overcome macrovascular tumor extension in a standard HCC transplant pathway.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Read vascular extension and hepatic perfusion before selecting a pathway from tumor size. Main portal occlusion makes routine arterial embolization hazardous, while macrovascular tumor extension defeats a standard small-burden transplant shortcut. Preserved hepatic function and activity support systemic-treatment assessment; this question does not rank named drugs or exclude every specialist-directed locoregional exception.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside record",
              "items": [
                {
                  "label": "Tumor",
                  "value": "A 3.6-cm hepatic HCC."
                },
                {
                  "label": "Vascular report",
                  "value": "Tumor extends into and occludes the main portal vein; the intrahepatic arteries remain patent."
                },
                {
                  "label": "Other staging",
                  "value": "No extrahepatic tumor identified."
                },
                {
                  "label": "Current condition",
                  "value": "Independent in daily activities; bilirubin and INR within laboratory intervals; no ascites."
                }
              ]
            },
            "sourceLabels": [
              "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
              "Primary Liver Cancer Treatment (PDQ) - Health Professional Version"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "tace",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the outside record and the selected plan before continuing.",
                "clinicalRationale": "Arterial embolization in a liver with major portal obstruction risks the remaining hepatic perfusion; this is not the routine favorable TACE profile.",
                "sourceLabels": [
                  "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
                  "Primary Liver Cancer Treatment (PDQ) - Health Professional Version"
                ]
              },
              {
                "answerChoiceId": "transplant",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the outside record and the selected plan before continuing.",
                "clinicalRationale": "A small measured mass does not overcome macrovascular tumor extension in a standard HCC transplant pathway.",
                "sourceLabels": [
                  "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
                  "Primary Liver Cancer Treatment (PDQ) - Health Professional Version"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Read vascular extension and hepatic perfusion before selecting a pathway from tumor size. Main portal occlusion makes routine arterial embolization hazardous, while macrovascular tumor extension defeats a standard small-burden transplant shortcut. Preserved hepatic function and activity support systemic-treatment assessment; this question does not rank named drugs or exclude every specialist-directed locoregional exception."
      }
    ]
  },
  "topic-batch2-pancreas-chronic-cysts-neoplasia": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1",
        "displayName": "Use potentially reconstructible venous involvement to select neoadjuvant planning without abandoning curative intent.",
        "learningObjective": "Use potentially reconstructible venous involvement to select neoadjuvant planning without abandoning curative intent.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      },
      {
        "id": "concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1",
        "displayName": "Select durable biliary decompression for a jaundiced patient proceeding to neoadjuvant therapy.",
        "learningObjective": "Select durable biliary decompression for a jaundiced patient proceeding to neoadjuvant therapy.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      },
      {
        "id": "concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1",
        "displayName": "Choose the least invasive effective source-control route for an accessible postoperative collection in a stable patient.",
        "learningObjective": "Choose the least invasive effective source-control route for an accessible postoperative collection in a stable patient.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      },
      {
        "id": "concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1",
        "displayName": "Recognize when a usually benign cyst phenotype has a mechanical indication for treatment.",
        "learningObjective": "Recognize when a usually benign cyst phenotype has a mechanical indication for treatment.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      },
      {
        "id": "concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1",
        "displayName": "Preserve appropriate remnant surveillance without treating low-grade IPMN margins as an automatic completion-resection indication.",
        "learningObjective": "Preserve appropriate remnant surveillance without treating low-grade IPMN margins as an automatic completion-resection indication.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
        "displayName": "Samuel Reed: pancreatic clinic review",
        "patientPresentationVariantId": "presentation.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Samuel Reed",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Treatment planning",
        "presentation": "{patientName}, a 63-year-old man, attends clinic with biopsy-confirmed pancreatic-head adenocarcinoma. CT shows marked narrowing and contour irregularity of a short portomesenteric venous segment at the tumor; the vein above and below remains patent. The major arteries are separated from the lesion, and chest and liver staging show no distant disease. He remains independent in daily activities.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Treatment planning",
            "presentation": "{patientName}, a 63-year-old man, attends clinic with biopsy-confirmed pancreatic-head adenocarcinoma. CT shows marked narrowing and contour irregularity of a short portomesenteric venous segment at the tumor; the vein above and below remains patent. The major arteries are separated from the lesion, and chest and liver staging show no distant disease. He remains independent in daily activities."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Multidisciplinary consensus on pancreatic cancer management",
          "NCI PDQ pancreatic cancer treatment, health professional version",
          "Metal versus plastic biliary stents during pancreatic-cancer neoadjuvant therapy"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
            "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
            "primaryConceptId": "concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1",
            "stem": "Which initial treatment plan best fits {patientName}'s pancreatic-head cancer findings?",
            "answerChoices": [
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.upfront.v2",
                "label": "Upfront resection with venous reconstruction",
                "isCorrect": false,
                "rationale": "This potentially reconstructable venous pattern is not a simple clearly resectable relationship. Neoadjuvant therapy and reassessment are generally favored over proceeding directly to a technically complex operation.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.neoadjuvant.v2",
                "label": "Neoadjuvant chemotherapy with surgical reassessment",
                "isCorrect": true,
                "rationale": "The venous abnormality with preserved adjacent segments and separated arteries supports a potentially reconstructable borderline pattern. Begin systemic treatment, then reassess staging and technical resectability.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.palliative.v2",
                "label": "Palliative chemotherapy with response assessment",
                "isCorrect": false,
                "rationale": "Venous involvement alone does not establish permanent unresectability. The supplied negative distant staging and potentially reconstructable local pattern retain a possible resection pathway.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The venous contour change and short narrowed segment suggest borderline local anatomy rather than either a clear surgery-first relationship or necessarily permanent unresectability. Neoadjuvant systemic treatment with restaging and surgical reassessment is the best offered sequence. Patency above and below supports consideration of reconstruction; it does not guarantee technical feasibility, which requires specialist review.",
            "sourceLabels": [
              "Multidisciplinary consensus on pancreatic cancer management",
              "NCI PDQ pancreatic cancer treatment, health professional version",
              "Metal versus plastic biliary stents during pancreatic-cancer neoadjuvant therapy"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
            "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
            "primaryConceptId": "concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1",
            "currentUpdate": "The multidisciplinary team plans several cycles of preoperative chemotherapy for the pancreatic-head adenocarcinoma. Before treatment begins, pruritus and jaundice increase. Imaging shows intrahepatic and extrahepatic bile-duct dilation above the distal stricture. There is no fever or circulatory instability, and he has an unaltered upper gastrointestinal anatomy.",
            "stem": "Which pre-treatment management plan is best for {patientName} at this visit?",
            "answerChoices": [
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.metal.v2",
                "label": "ERCP metal stenting before chemotherapy",
                "isCorrect": true,
                "rationale": "Obstructive jaundice should be relieved before the planned neoadjuvant course. A self-expanding metal stent offers more durable drainage through that treatment interval than a plastic stent.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.plastic.v2",
                "label": "ERCP plastic stenting before chemotherapy",
                "isCorrect": false,
                "rationale": "Plastic stenting can decompress the duct but is more prone to occlusion during a prolonged neoadjuvant interval. The planned course makes durable metal-stent drainage preferable here.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.defer.v2",
                "label": "Begin chemotherapy with bilirubin reassessment",
                "isCorrect": false,
                "rationale": "The patient has progressive obstructive jaundice before a multi-cycle course. Reassessment alone does not first relieve the obstruction or provide durable drainage.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Progressive jaundice with upstream dilation represents clinically important biliary obstruction even without cholangitis. Drain it before the planned neoadjuvant course. Endoscopic self-expanding metal stenting is preferred to plastic stenting for durable drainage through that interval. This comparison does not establish one metal-stent design as universally best and does not create a numerical bilirubin rule.",
            "sourceLabels": [
              "Multidisciplinary consensus on pancreatic cancer management",
              "NCI PDQ pancreatic cancer treatment, health professional version",
              "Metal versus plastic biliary stents during pancreatic-cancer neoadjuvant therapy"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.plastic.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The chart-review decision receives feedback; no patient outcome is simulated.",
                "clinicalRationale": "Plastic stenting can decompress the duct but is more prone to occlusion during a prolonged neoadjuvant interval. The planned course makes durable metal-stent drainage preferable here.",
                "sourceLabels": [
                  "Multidisciplinary consensus on pancreatic cancer management",
                  "NCI PDQ pancreatic cancer treatment, health professional version",
                  "Metal versus plastic biliary stents during pancreatic-cancer neoadjuvant therapy"
                ]
              },
              {
                "answerChoiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.defer.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The chart-review decision receives feedback; no patient outcome is simulated.",
                "clinicalRationale": "The patient has progressive obstructive jaundice before a multi-cycle course. Reassessment alone does not first relieve the obstruction or provide durable drainage.",
                "sourceLabels": [
                  "Multidisciplinary consensus on pancreatic cancer management",
                  "NCI PDQ pancreatic cancer treatment, health professional version",
                  "Metal versus plastic biliary stents during pancreatic-cancer neoadjuvant therapy"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The venous contour change and short narrowed segment suggest borderline local anatomy rather than either a clear surgery-first relationship or necessarily permanent unresectability. Neoadjuvant systemic treatment with restaging and surgical reassessment is the best offered sequence. Patency above and below supports consideration of reconstruction; it does not guarantee technical feasibility, which requires specialist review. Progressive jaundice with upstream dilation represents clinically important biliary obstruction even without cholangitis. Drain it before the planned neoadjuvant course. Endoscopic self-expanding metal stenting is preferred to plastic stenting for durable drainage through that interval. This comparison does not establish one metal-stent design as universally best and does not create a numerical bilirubin rule."
      },
      {
        "id": "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
        "displayName": "Owen Mitchell: pancreatic clinic review",
        "patientPresentationVariantId": "presentation.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Owen Mitchell",
        "prototypeDemographics": {
          "ageYears": 56,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Hospital course review",
        "presentation": "{patientName}, a 56-year-old man, attends clinic after pancreatic-neck lesion enucleation and an outside hospital readmission. The founder reviews the treatment decision in the dated hospital record below. He is now stable in clinic; the proposed interventions refer to that admission.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
            "prototypeDemographics": {
              "ageYears": 56,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Hospital course review",
            "presentation": "{patientName}, a 56-year-old man, attends clinic after pancreatic-neck lesion enucleation and an outside hospital readmission. The founder reviews the treatment decision in the dated hospital record below. He is now stable in clinic; the proposed interventions refer to that admission."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Management of complications occurring after pancreatic surgery"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
            "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
            "primaryConceptId": "concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1",
            "currentUpdate": "During the readmission, antibiotics were started for fever and an operative-bed infection. Fever continued. Circulation remained stable, and examination showed localized tenderness without generalized peritonitis.",
            "stem": "Which management plan should have been recommended for {patientName} at this point in the hospital course?",
            "answerChoices": [
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.catheter.v2",
                "label": "Antibiotics plus image-guided catheter drainage",
                "isCorrect": true,
                "rationale": "The existing catheter drains a different collapsed compartment. Persistent infection with a separate collection needs effective source control; image-guided access is the less invasive initial approach in this stable record.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.observe.v2",
                "label": "Antibiotics plus interval imaging reassessment",
                "isCorrect": false,
                "rationale": "The record contains ongoing infection with a separate undrained collection. The presence of an existing catheter does not establish source control when its side holes are confined to another compartment.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.operation.v2",
                "label": "Antibiotics plus operative washout and drainage",
                "isCorrect": false,
                "rationale": "Operative source control is a real option, but stable physiology without generalized peritonitis and an available image-guided approach favor a minimally invasive attempt first. This is not a requirement to delay surgery if the situation changes.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The catheter's side holes are in the collapsed anterior space, while the infected-appearing collection occupies a separate posterior compartment. Antibiotics and the existing catheter have therefore not established adequate source control. Image-guided catheter drainage is the preferred initial addition in this stable hospital record. IR must choose new placement or exchange from the actual anatomy; the question does not promise that repositioning through the old tract will work. Operative drainage remains appropriate if interventional control fails or surgical indications develop.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed teaching record; fictional patient observations",
              "columnHeaders": [
                "Readmission contrast CT"
              ],
              "rowHeaders": [
                "Anterior operative bed",
                "Posterior operative bed",
                "Other CT findings"
              ],
              "cells": [
                [
                  "Collapsed space containing all side holes of the existing catheter"
                ],
                [
                  "Rim-enhancing fluid with internal gas, separated from the anterior space by tissue; posterior skin-to-collection path crosses no bowel or major vessel"
                ],
                [
                  "No diffuse free air; no active hemorrhage"
                ]
              ]
            },
            "sourceLabels": [
              "Management of complications occurring after pancreatic surgery"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.observe.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The chart-review decision receives feedback; no patient outcome is simulated.",
                "clinicalRationale": "The record contains ongoing infection with a separate undrained collection. The presence of an existing catheter does not establish source control when its side holes are confined to another compartment.",
                "sourceLabels": [
                  "Management of complications occurring after pancreatic surgery"
                ]
              },
              {
                "answerChoiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.operation.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The chart-review decision receives feedback; no patient outcome is simulated.",
                "clinicalRationale": "Operative source control is a real option, but stable physiology without generalized peritonitis and an available image-guided approach favor a minimally invasive attempt first. This is not a requirement to delay surgery if the situation changes.",
                "sourceLabels": [
                  "Management of complications occurring after pancreatic surgery"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The catheter's side holes are in the collapsed anterior space, while the infected-appearing collection occupies a separate posterior compartment. Antibiotics and the existing catheter have therefore not established adequate source control. Image-guided catheter drainage is the preferred initial addition in this stable hospital record. IR must choose new placement or exchange from the actual anatomy; the question does not promise that repositioning through the old tract will work. Operative drainage remains appropriate if interventional control fails or surgical indications develop."
      },
      {
        "id": "case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1",
        "displayName": "Helen Ortiz: pancreatic clinic review",
        "patientPresentationVariantId": "presentation.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Helen Ortiz",
        "prototypeDemographics": {
          "ageYears": 67,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Early fullness",
        "presentation": "{patientName}, a 67-year-old woman, attends clinic with worsening early fullness and vomiting after meals. MRI and EUS show a lobulated body cyst made of many tiny locules surrounding a central scar. It narrows the adjacent stomach; endoscopy shows intact mucosa at the indentation. She has no pancreatitis history and is fit for pancreatic surgery.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1",
            "prototypeDemographics": {
              "ageYears": 67,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Early fullness",
            "presentation": "{patientName}, a 67-year-old woman, attends clinic with worsening early fullness and vomiting after meals. MRI and EUS show a lobulated body cyst made of many tiny locules surrounding a central scar. It narrows the adjacent stomach; endoscopy shows intact mucosa at the indentation. She has no pancreatitis history and is fit for pancreatic surgery."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
          "Pancreatic cystic lesions: SIRM-AISP position paper"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
            "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
            "primaryConceptId": "concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1",
            "stem": "Which management plan best addresses {patientName}'s pancreatic lesion and current symptoms?",
            "answerChoices": [
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.surveillance.v1",
                "label": "Continue pancreatic MRI surveillance",
                "isCorrect": false,
                "rationale": "The phenotype is reassuring for malignancy, but surveillance does not address demonstrated symptomatic compression.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.drainage.v1",
                "label": "Arrange endoscopic cystgastrostomy",
                "isCorrect": false,
                "rationale": "A microcystic epithelial lesion is not an inflammatory collection that can be treated by cystgastrostomy.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.resection.v1",
                "label": "Refer for pancreatic cyst resection",
                "isCorrect": true,
                "rationale": "A convincingly serous lesion can still require surgery when it causes adjacent-organ compression and symptoms.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The microcystic, central-scar pattern favors a serous lesion. Usually benign behavior does not eliminate the mechanical indication: the lesion narrows the stomach and symptoms match that site. Resection evaluation is appropriate; a benign epithelial cyst is not managed as a pseudocyst.",
            "sourceLabels": [
              "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
              "Pancreatic cystic lesions: SIRM-AISP position paper"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.surveillance.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The chart-review decision receives feedback; no patient outcome is simulated.",
                "clinicalRationale": "The phenotype is reassuring for malignancy, but surveillance does not address demonstrated symptomatic compression.",
                "sourceLabels": [
                  "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
                  "Pancreatic cystic lesions: SIRM-AISP position paper"
                ]
              },
              {
                "answerChoiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.drainage.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The chart-review decision receives feedback; no patient outcome is simulated.",
                "clinicalRationale": "A microcystic epithelial lesion is not an inflammatory collection that can be treated by cystgastrostomy.",
                "sourceLabels": [
                  "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
                  "Pancreatic cystic lesions: SIRM-AISP position paper"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The microcystic, central-scar pattern favors a serous lesion. Usually benign behavior does not eliminate the mechanical indication: the lesion narrows the stomach and symptoms match that site. Resection evaluation is appropriate; a benign epithelial cyst is not managed as a pseudocyst."
      },
      {
        "id": "case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
        "displayName": "Ruth Bell: pancreatic clinic review",
        "patientPresentationVariantId": "presentation.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Ruth Bell",
        "prototypeDemographics": {
          "ageYears": 64,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Pathology follow-up",
        "presentation": "{patientName}, a 64-year-old woman, attends clinic to review her outside distal-pancreatectomy records. Pathology shows IPMN with low-grade dysplasia and no invasive carcinoma. The pancreatic margin contains low-grade dysplasia. MRI of the remnant shows a small side-branch cyst with no mural nodule or main-duct dilation. She remains fit for further treatment if a future indication develops.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
            "prototypeDemographics": {
              "ageYears": 64,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Pathology follow-up",
            "presentation": "{patientName}, a 64-year-old woman, attends clinic to review her outside distal-pancreatectomy records. Pathology shows IPMN with low-grade dysplasia and no invasive carcinoma. The pancreatic margin contains low-grade dysplasia. MRI of the remnant shows a small side-branch cyst with no mural nodule or main-duct dilation. She remains fit for further treatment if a future indication develops."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
          "International evidence-based Kyoto guidelines for IPMN",
          "Pancreatic cystic lesions: SIRM-AISP position paper"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
            "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
            "primaryConceptId": "concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1",
            "stem": "Which pancreatic-remnant management plan should be recommended for {patientName} now?",
            "answerChoices": [
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.completion.v1",
                "label": "Completion pancreatectomy",
                "isCorrect": false,
                "rationale": "Low-grade margin dysplasia and an unconcerning remnant cyst do not establish a need to remove the remaining pancreas.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.surveillance.v1",
                "label": "MRI-based surveillance of the pancreatic remnant",
                "isCorrect": true,
                "rationale": "Resected IPMN still warrants remnant surveillance; the low-grade margin and low-risk remnant do not by themselves select completion surgery.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.discharge.v1",
                "label": "Discharge from pancreatic imaging follow-up",
                "isCorrect": false,
                "rationale": "The absence of invasive cancer does not remove the remnant risk associated with IPMN.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Low-grade IPMN at a margin is not equivalent to invasive cancer at a margin. With no concerning remnant finding, surveillance preserves the opportunity to detect later disease without automatic completion pancreatectomy. Postresection IPMN follow-up differs from a completely resected noninvasive MCN.",
            "sourceLabels": [
              "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
              "International evidence-based Kyoto guidelines for IPMN",
              "Pancreatic cystic lesions: SIRM-AISP position paper"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.completion.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The chart-review decision receives feedback; no patient outcome is simulated.",
                "clinicalRationale": "Low-grade margin dysplasia and an unconcerning remnant cyst do not establish a need to remove the remaining pancreas.",
                "sourceLabels": [
                  "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
                  "International evidence-based Kyoto guidelines for IPMN",
                  "Pancreatic cystic lesions: SIRM-AISP position paper"
                ]
              },
              {
                "answerChoiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.discharge.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The chart-review decision receives feedback; no patient outcome is simulated.",
                "clinicalRationale": "The absence of invasive cancer does not remove the remnant risk associated with IPMN.",
                "sourceLabels": [
                  "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
                  "International evidence-based Kyoto guidelines for IPMN",
                  "Pancreatic cystic lesions: SIRM-AISP position paper"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Low-grade IPMN at a margin is not equivalent to invasive cancer at a margin. With no concerning remnant finding, surveillance preserves the opportunity to detect later disease without automatic completion pancreatectomy. Postresection IPMN follow-up differs from a completely resected noninvasive MCN."
      }
    ]
  }
};
export const PROGRAM_BATCH2_QUESTIONS: (QuestionVariant & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "conceptId": "concept.trauma-thoracic.bci-selective-imaging.v1",
    "stem": "Which additional cardiac-imaging plan should {patientName}'s hospital team choose at this reassessment?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-hospital record",
      "items": [
        {
          "label": "Before injury ECG",
          "value": "Sinus rhythm with right bundle-branch block."
        },
        {
          "label": "Admission ECG",
          "value": "Sinus rhythm with right bundle-branch block and the same recorded conduction pattern."
        },
        {
          "label": "Troponin I",
          "value": "Above the laboratory upper reference limit."
        },
        {
          "label": "Current course",
          "value": "Sustained blood pressure, pain reproduced over the injured chest wall, and no persistent arrhythmia."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.trauma-thoracic.bci-selective-imaging.v2.surveillance",
        "label": "Continue reassessment without immediate cardiac imaging",
        "isCorrect": true,
        "rationale": "The conduction finding predates injury. The biomarker warrants the shared monitored reassessment, while the current course supplies no further immediate structural-imaging indication.",
        "distractorRationale": null
      },
      {
        "id": "choice.trauma-thoracic.bci-selective-imaging.v2.tte",
        "label": "Add transthoracic echocardiography to reassessment",
        "isCorrect": false,
        "rationale": "This adds routine structural screening to a stable abnormal-biomarker assessment. The supplied findings do not establish a separate current structural question.",
        "distractorRationale": "This adds routine structural screening to a stable abnormal-biomarker assessment. The supplied findings do not establish a separate current structural question."
      },
      {
        "id": "choice.trauma-thoracic.bci-selective-imaging.v2.ct",
        "label": "Add cardiac CT to reassessment",
        "isCorrect": false,
        "rationale": "Selected unresolved infarction-versus-traumatic-injury questions may justify cardiac CT. The current record does not establish that additional indication.",
        "distractorRationale": "Selected unresolved infarction-versus-traumatic-injury questions may justify cardiac CT. The current record does not establish that additional indication."
      }
    ],
    "explanation": "The conduction pattern predates trauma, while the elevated biomarker supports the shared monitored reassessment. Immediate imaging requires a clinical question beyond that screening result.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-thoracic.bci-screen",
      "claim.trauma-thoracic.bci-monitor",
      "claim.trauma-thoracic.bci-selective-imaging",
      "claim.trauma-thoracic.bci-selected-mri",
      "claim.trauma-thoracic.bci-echo"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "conceptId": "concept.trauma-thoracic.bci-arrhythmia-echo.v1",
    "stem": "Which next cardiac-imaging plan best fits {patientName}'s unresolved hospital assessment?",
    "answerChoices": [
      {
        "id": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.tee",
        "label": "Transesophageal echocardiography",
        "isCorrect": true,
        "rationale": "Persistent arrhythmia with hemodynamic effects requires a structural/function assessment. The acquired transthoracic study has not answered that question, supporting the transesophageal route.",
        "distractorRationale": null
      },
      {
        "id": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.ct",
        "label": "Cardiac CT",
        "isCorrect": false,
        "rationale": "Cardiac CT may help resolve selected infarction-versus-traumatic-injury questions. It is a less direct next answer to the unresolved bedside structural/function assessment in this course.",
        "distractorRationale": "Cardiac CT may help resolve selected infarction-versus-traumatic-injury questions. It is a less direct next answer to the unresolved bedside structural/function assessment in this course."
      },
      {
        "id": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.mri",
        "label": "Cardiac magnetic resonance imaging",
        "isCorrect": false,
        "rationale": "MRI may characterize selected myocardial injury after initial evaluation. Here, the active structural/function question and inadequate transthoracic examination support TEE first.",
        "distractorRationale": "MRI may characterize selected myocardial injury after initial evaluation. Here, the active structural/function question and inadequate transthoracic examination support TEE first."
      },
      {
        "id": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.surveillance",
        "label": "Continue monitoring without further cardiac imaging",
        "isCorrect": false,
        "rationale": "Monitoring addresses the arrhythmia risk, but it leaves the indicated structural/function question unanswered because the acquired TTE is nondiagnostic.",
        "distractorRationale": "Monitoring addresses the arrhythmia risk, but it leaves the indicated structural/function question unanswered because the acquired TTE is nondiagnostic."
      }
    ],
    "explanation": "The rhythm and pressure changes establish a structural/function question that monitoring has not answered. The acquired transthoracic examination is nondiagnostic, supporting TEE next. CT and MRI serve selected myocardial or ischemic questions. Continuing monitoring without another study would fit an adequate TTE that had already resolved the current question.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-thoracic.bci-echo",
      "claim.trauma-thoracic.bci-monitor",
      "claim.trauma-thoracic.bci-inadequate-tte",
      "claim.trauma-thoracic.bci-selected-mri",
      "claim.trauma-thoracic.bci-selective-imaging"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "conceptId": "concept.blunt-cardiac-injury.monitored-disposition",
    "stem": "Which disposition was justified at {patientName}'s completed hospital assessment?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-hospital record; fictional observations",
      "items": [
        {
          "label": "Cardiac assessment",
          "value": "Admission ECG and completed troponin I assessment were normal."
        },
        {
          "label": "Chest injury",
          "value": "Nondisplaced sternal fracture and several rib fractures."
        },
        {
          "label": "Response to treatment",
          "value": "After the documented oral and regional analgesia, {patientName} still stopped inspiration because of pain, could not clear secretions and needed supplemental oxygen."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.trauma-thoracic.bci-normalpair-other-admission.ward",
        "label": "Trauma-ward admission for respiratory care",
        "isCorrect": true,
        "rationale": "The normal cardiac pair removes a BCI-specific monitoring indication, while the actual breathing and secretion-clearance limitations still justify hospital respiratory and analgesic care.",
        "distractorRationale": null
      },
      {
        "id": "choice.trauma-thoracic.bci-normalpair-other-admission.telemetry",
        "label": "Telemetry admission for cardiac observation",
        "isCorrect": false,
        "rationale": "The fracture does not create a cardiac-monitoring requirement when the ECG and troponin assessment are normal.",
        "distractorRationale": "The fracture does not create a cardiac-monitoring requirement when the ECG and troponin assessment are normal."
      },
      {
        "id": "choice.trauma-thoracic.bci-normalpair-other-admission.home",
        "label": "Home discharge with respiratory exercises",
        "isCorrect": false,
        "rationale": "The disposition rule for the normal cardiac screen does not establish that the patient can manage the remaining chest-injury care at home.",
        "distractorRationale": "The disposition rule for the normal cardiac screen does not establish that the patient can manage the remaining chest-injury care at home."
      }
    ],
    "explanation": "The normal cardiac pair removes a BCI-specific monitoring indication, while the actual breathing and secretion-clearance limitations still justify hospital respiratory and analgesic care. Persistent oxygen and secretion-clearance needs remain after treatment despite normal cardiac tests.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-thoracic.bci-normal-pair",
      "claim.trauma-thoracic.sternum-boundary",
      "claim.trauma-thoracic.chest-wall-care",
      "claim.trauma-thoracic.bci-monitor"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "conceptId": "concept.trauma-thoracic.chest-drain-organ-trajectory.v1",
    "stem": "Which tube-management plan should {patientName}'s outside-hospital team choose next?",
    "answerChoices": [
      {
        "id": "choice.trauma-thoracic.chest-drain-organ-trajectory.retain",
        "label": "Retain the tube; obtain contrast CT mapping",
        "isCorrect": true,
        "rationale": "An unintended organ trajectory requires defining the injury and vascular relationships before controlled tube management. Keep the tube in place while urgent cross-sectional assessment and the relevant surgical teams establish that plan.",
        "distractorRationale": null
      },
      {
        "id": "choice.trauma-thoracic.chest-drain-organ-trajectory.remove",
        "label": "Remove the tube; obtain ultrasound reassessment",
        "isCorrect": false,
        "rationale": "Removing a catheter that traverses an organ before defining the injury can worsen bleeding; a stable examination is not proof that blind removal is safe.",
        "distractorRationale": "Removing a catheter that traverses an organ before defining the injury can worsen bleeding; a stable examination is not proof that blind removal is safe."
      },
      {
        "id": "choice.trauma-thoracic.chest-drain-organ-trajectory.retract",
        "label": "Retract the tube; obtain repeat chest radiographs",
        "isCorrect": false,
        "rationale": "Blind partial withdrawal still moves the tube through the unintended organ tract, and radiography does not define the unresolved hepatic vascular relationship.",
        "distractorRationale": "Blind partial withdrawal still moves the tube through the unintended organ tract, and radiography does not define the unresolved hepatic vascular relationship."
      }
    ],
    "explanation": "The ultrasound describes an organ-traversing catheter, not a simple inadequate pleural drain. Keep it in place while urgent cross-sectional imaging and the relevant surgical teams define a controlled management plan.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-thoracic.chest-drain-organ-injury"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "conceptId": "concept.trauma-thoracic.hemothorax-physiology-escalation.v1",
    "stem": "Which hemorrhage-control approach best fits {patientName}'s current hospital record?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-hospital record; fictional observations",
      "items": [
        {
          "label": "Pleural drainage",
          "value": "The right chest tube initially returned blood but now drains little; bedside imaging still shows a large right pleural collection."
        },
        {
          "label": "Resuscitation course",
          "value": "Blood pressure rises during transfusion and falls again when the transfusion rate decreases; peripheral perfusion remains poor."
        },
        {
          "label": "Other observations",
          "value": "Abdominal and pelvic reassessment has not identified an alternative source accounting for this course."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.trauma-thoracic.thoracic-bleeding-control.open",
        "label": "Thoracotomy for operative hemostasis",
        "isCorrect": true,
        "rationale": "The recurrent circulatory failure with substantial residual pleural blood warrants operative control; low tube return does not establish that thoracic bleeding has stopped.",
        "distractorRationale": null
      },
      {
        "id": "choice.trauma-thoracic.thoracic-bleeding-control.vats",
        "label": "Thoracoscopy for operative hemostasis",
        "isCorrect": false,
        "rationale": "Thoracoscopy is useful in stable patients, but the resuscitation-dependent circulation favors immediate open access for hemorrhage control here.",
        "distractorRationale": "Thoracoscopy is useful in stable patients, but the resuscitation-dependent circulation favors immediate open access for hemorrhage control here."
      },
      {
        "id": "choice.trauma-thoracic.thoracic-bleeding-control.embolize",
        "label": "Arterial embolization for hemostasis",
        "isCorrect": false,
        "rationale": "Selected stable thoracic arterial bleeding can be treated endovascularly; the ongoing circulatory instability and need for rapid open assessment make this a weaker first approach.",
        "distractorRationale": "Selected stable thoracic arterial bleeding can be treated endovascularly; the ongoing circulatory instability and need for rapid open assessment make this a weaker first approach."
      }
    ],
    "explanation": "The large remaining pleural collection and repeated loss of perfusion show that low tube return is not reassuring. Ongoing unstable thoracic bleeding requires operative control.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-thoracic.hemorrhage-physiology",
      "claim.trauma-thoracic.hemostasis-access",
      "claim.trauma-thoracic.stable-thoracic-surgery"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.trauma-thoracic.retained-hemothorax.20261111.v2",
    "conceptId": "concept.trauma-thoracic.retained-hemothorax-vats.v1",
    "stem": "Which pleural treatment should {patientName}'s team choose at this later hospital stage?",
    "answerChoices": [
      {
        "id": "choice.trauma-thoracic.retained-hemothorax.vats",
        "label": "VATS evacuation of pleural clot",
        "isCorrect": true,
        "rationale": "An operative candidate with substantial retained traumatic blood after tube drainage fits the conditional early-VATS strategy.",
        "distractorRationale": null
      },
      {
        "id": "choice.trauma-thoracic.retained-hemothorax.tube",
        "label": "Additional tube thoracostomy",
        "isCorrect": false,
        "rationale": "Another tube may address an undrained free-flowing pocket, but it is less likely to resolve the substantial retained clot represented here.",
        "distractorRationale": "Another tube may address an undrained free-flowing pocket, but it is less likely to resolve the substantial retained clot represented here."
      },
      {
        "id": "choice.trauma-thoracic.retained-hemothorax.lytic",
        "label": "Intrapleural fibrinolytic treatment",
        "isCorrect": false,
        "rationale": "Fibrinolysis is a potential selected strategy, particularly when surgery is unsuitable, but EAST conditionally favors early VATS for an operative candidate with retained hemothorax.",
        "distractorRationale": "Fibrinolysis is a potential selected strategy, particularly when surgery is unsuitable, but EAST conditionally favors early VATS for an operative candidate with retained hemothorax."
      }
    ],
    "explanation": "For substantial retained traumatic pleural clot in this recovered patient, EAST conditionally favors early VATS over intrapleural fibrinolysis. Direct evacuation addresses the clot and incomplete expansion. Fibrinolysis remains a selected alternative when the balance of operative risk favors it.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-thoracic.retained-blood",
      "claim.trauma-thoracic.retained-complications"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "conceptId": "concept.trauma-thoracic.rib-fixation-failed-weaning.v1",
    "stem": "Which next treatment plan best fits {patientName}'s hospital recovery findings?",
    "answerChoices": [
      {
        "id": "choice.trauma-thoracic.rib-fixation-weaning.v2.fix",
        "label": "Rib stabilization followed by ventilator-liberation trials",
        "isCorrect": true,
        "rationale": "Persistent mechanical chest-wall instability during failed liberation despite analgesic treatment supports stabilization assessment during this admission. Improving parenchymal disease strengthens the importance of the persistent chest-wall findings.",
        "distractorRationale": null
      },
      {
        "id": "choice.trauma-thoracic.rib-fixation-weaning.v2.continue",
        "label": "Current ventilatory support with further liberation trials",
        "isCorrect": false,
        "rationale": "Nonsurgical care is appropriate for many rib injuries. Here, repeated failure despite the ongoing treatment and persistent chest-wall instability support adding fixation assessment.",
        "distractorRationale": "Nonsurgical care is appropriate for many rib injuries. Here, repeated failure despite the ongoing treatment and persistent chest-wall instability support adding fixation assessment."
      },
      {
        "id": "choice.trauma-thoracic.rib-fixation-weaning.v2.tracheostomy",
        "label": "Tracheostomy followed by prolonged ventilator weaning",
        "isCorrect": false,
        "rationale": "Tracheostomy may support prolonged ventilatory needs. It does not address the persistent displaced unstable chest-wall segment demonstrated during these trials.",
        "distractorRationale": "Tracheostomy may support prolonged ventilatory needs. It does not address the persistent displaced unstable chest-wall segment demonstrated during these trials."
      }
    ],
    "explanation": "The lung findings have improved while the displaced segment still moves paradoxically during failed liberation attempts despite analgesic care. That pattern supports rib-stabilization assessment as the next addition to care. Analgesia and rehabilitation continue, and tracheostomy remains a separate option for prolonged support requirements.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-thoracic.rib-stabilization",
      "claim.trauma-thoracic.contusion-not-exclusion",
      "claim.trauma-thoracic.tracheostomy-scope"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.screening.v2",
    "conceptId": "concept.aaa.one-time-ultrasound-screening",
    "stem": "Which aortic imaging plan should have been selected at {patientName}'s preventive visit?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.screening.ultrasound.v2",
        "label": "Obtain abdominal aortic ultrasound",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.screening.cta.v2",
        "label": "Obtain abdominal aortic CT angiography",
        "isCorrect": false,
        "distractorRationale": "His record requires a first preventive abdominal screen, not detailed repair or acute-symptom anatomy; ultrasound is the supported initial modality."
      },
      {
        "id": "choice.vascular-aorta.screening.no_imaging.v2",
        "label": "Arrange no additional aortic imaging",
        "isCorrect": false,
        "distractorRationale": "The study's caudal endpoint leaves the infrarenal aorta outside the acquisition. Smoking cessation does not negate the ever-smoker screening indication."
      }
    ],
    "explanation": "The celiac-level endpoint leaves the infrarenal aorta unexamined. Apply the screening recommendation to the actual coverage, not the examination's title: abdominal ultrasound is the initial preventive screen for this eligible former smoker.",
    "supportingEvidenceClaimIds": [
      "claim.brief.aaa.one-time-ultrasound-screening",
      "claim.vascular-aorta.celiac-ending-scan-infrarenal-coverage",
      "claim.vascular-aorta.symptomatic-aaa-repair"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.proximal-seal-repair.v1",
    "conceptId": "concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1",
    "stem": "Which plan should have followed {patientName}'s proximal attachment finding?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.proximal-seal-repair.cuff.v1",
        "label": "Extend the proximal seal with an aortic cuff",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.proximal-seal-repair.surveillance.v1",
        "label": "Continue aortic duplex imaging surveillance",
        "isCorrect": false,
        "distractorRationale": "Stable sac size does not justify observation of an established late direct attachment leak."
      },
      {
        "id": "choice.vascular-aorta.proximal-seal-repair.branch_coils.v1",
        "label": "Embolize the lumbar inflow and sac cavity",
        "isCorrect": false,
        "distractorRationale": "The demonstrated source is the proximal attachment, not a side branch."
      }
    ],
    "explanation": "This arterial-phase attachment route represents a type I sealing failure. Prompt seal repair is appropriate even before the sac enlarges; the available healthy neck makes proximal extension a supported option.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.type-i-origin",
      "claim.vascular-aorta.type-i-prompt-seal-repair",
      "claim.vascular-aorta.stable-type-ii-follow-up",
      "claim.vascular-aorta.type-ii-branch-flow",
      "claim.vascular-aorta.expanding-sac-uncertain-leak"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.ascending-emergency.v1",
    "conceptId": "concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1",
    "stem": "Which definitive hospital plan should have been selected from {patientName}'s initial CTA?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.ascending-emergency.ascending_open.v1",
        "label": "Emergency open ascending aortic repair",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.ascending-emergency.descending_tevar.v1",
        "label": "Urgent descending thoracic endovascular repair",
        "isCorrect": false,
        "distractorRationale": "Treating the distal tear as a type-B problem does not address the acute ascending involvement."
      },
      {
        "id": "choice.vascular-aorta.ascending-emergency.medical.v1",
        "label": "Intravenous esmolol with CT angiographic follow-up",
        "isCorrect": false,
        "distractorRationale": "Impulse control is background stabilization but not definitive treatment of acute ascending dissection."
      }
    ],
    "explanation": "Ascending involvement determines the type-A pathway even when the entry tear is distal. Stable current pressure does not remove the need for emergency surgical treatment of acute ascending dissection.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.ascending-involvement",
      "claim.vascular-aorta.type-a-emergency-repair",
      "claim.vascular-aorta.complicated-type-b-intervention",
      "claim.vascular-aorta.uncomplicated-type-b-medical",
      "claim.vascular-aorta.beta-blockade-before-vasodilation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.initial-type-b.v2",
    "conceptId": "concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1",
    "stem": "Which infusion change should have followed {patientName}'s recorded treatment response?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.initial-type-b.add_nicardipine.v2",
        "label": "Add intravenous nicardipine infusion",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.initial-type-b.increase_esmolol.v2",
        "label": "Increase the intravenous esmolol infusion",
        "isCorrect": false,
        "distractorRationale": "Escalating rate-slowing therapy does not best address the remaining pressure target once the recorded rate response is adequate and perfusion is preserved."
      },
      {
        "id": "choice.vascular-aorta.initial-type-b.switch_diltiazem.v2",
        "label": "Replace esmolol with intravenous diltiazem",
        "isCorrect": false,
        "distractorRationale": "The record does not demonstrate beta-blocker intolerance or a rate-control failure requiring substitution; it shows persisting pressure elevation after a rate response."
      }
    ],
    "explanation": "Rate and pressure are separate treatment targets. The observed rate response is within the guideline range, while pressure remains elevated. Add an intravenous vasodilator after initial beta blockade rather than simply intensifying rate reduction or substituting another rate-control agent. Nicardipine provides additional blood-pressure reduction while beta blockade continues.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.beta-blockade-before-vasodilation",
      "claim.vascular-aorta.acute-aortic-syndrome-heart-rate-target",
      "claim.vascular-aorta.nicardipine-intravenous-antihypertensive",
      "claim.vascular-aorta.non-dihydropyridine-rate-control-alternative"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.lsa-coronary-inflow.v1",
    "conceptId": "concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1",
    "stem": "Which left-subclavian strategy should have accompanied {patientName}'s elective TEVAR plan?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.lsa-coronary-inflow.bypass.v1",
        "label": "Carotid-subclavian bypass before aortic coverage",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.lsa-coronary-inflow.defer.v1",
        "label": "Aortic coverage, then bypass if arm ischemia develops",
        "isCorrect": false,
        "distractorRationale": "An arm-symptom trigger does not protect the LIMA-dependent coronary circulation during elective coverage."
      },
      {
        "id": "choice.vascular-aorta.lsa-coronary-inflow.transposition.v1",
        "label": "Carotid-subclavian transposition before aortic coverage",
        "isCorrect": false,
        "distractorRationale": "Transposition requires proximal subclavian clamping, which can interrupt the patent pedicled LIMA coronary inflow; bypass avoids that required interruption."
      }
    ],
    "explanation": "Protect the pedicled LIMA coronary inflow before elective LSA coverage. Bypass avoids the proximal subclavian clamp required for transposition; waiting for arm ischemia also fails to protect this coronary-dependent territory.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.lsa-dependent-coronary-protection",
      "claim.vascular-aorta.lsa-transposition-proximal-clamp",
      "claim.vascular-aorta.pedicled-lima-avoid-transposition"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.post-tevar-cord-rescue.v1",
    "conceptId": "concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1",
    "stem": "Which immediate rescue plan should have been activated for {patientName}'s postoperative findings?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.post-tevar-cord-rescue.perfusion.v1",
        "label": "Vasopressor-supported perfusion with CSF-drainage rescue",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.post-tevar-cord-rescue.impulse.v1",
        "label": "Esmolol-based pressure reduction with intravenous analgesia",
        "isCorrect": false,
        "distractorRationale": "Further pressure reduction would work against perfusion rescue in this new postoperative neurologic syndrome."
      },
      {
        "id": "choice.vascular-aorta.post-tevar-cord-rescue.limb.v1",
        "label": "Heparin anticoagulation with urgent aortoiliac thrombectomy",
        "isCorrect": false,
        "distractorRationale": "Warm feet and preserved pulses make aortoiliac occlusion a poorer explanation than spinal perfusion injury."
      }
    ],
    "explanation": "Bilateral leg weakness after hypotension with preserved limb pulses raises concern for spinal-cord ischemia. Activate perfusion rescue and specialist CSF-drainage assessment; the new phase calls for restoring cord perfusion rather than intensifying impulse reduction.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.post-tevar-cord-rescue",
      "claim.vascular-aorta.beta-blockade-before-vasodilation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.small-embolizing-paa.v2",
    "conceptId": "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1",
    "stem": "Which aneurysm plan should have been selected for {patientName}'s right popliteal lesion?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.small-embolizing-paa.repair_plan.v2",
        "label": "Plan popliteal aneurysm repair with vascular surgery",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.small-embolizing-paa.anticoagulate.v2",
        "label": "Start anticoagulation with popliteal duplex follow-up",
        "isCorrect": false,
        "distractorRationale": "This addresses thrombotic risk without removing the demonstrated aneurysmal source. The supported strategy includes repair assessment rather than relying on medication as the definitive plan."
      },
      {
        "id": "choice.vascular-aorta.small-embolizing-paa.surveillance.v2",
        "label": "Continue annual popliteal duplex surveillance",
        "isCorrect": false,
        "distractorRationale": "The asymptomatic small-aneurysm policy does not address repeated embolic complications in this record."
      }
    ],
    "explanation": "Digital occlusions with a thrombus-containing PAA support distal embolization even when pedal pulses remain palpable. The complication warrants vascular repair planning below the usual asymptomatic size boundary. This selects repair versus medication/surveillance; conduit assessment and anatomy determine the eventual open or endovascular technique.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.small-paa-embolism-repair"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "conceptId": "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1",
    "stem": "Which additional aneurysm study should have been selected after review of {patientName}'s original acquisitions?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed original acquisition and observation log",
      "columnHeaders": [
        "Acquisition",
        "Recorded observations"
      ],
      "rowHeaders": [
        "Abdomen/pelvis CTA",
        "Left-leg ultrasound",
        "Right-leg arterial duplex"
      ],
      "cells": [
        [
          "Renal origins through aortic bifurcation",
          "Outer aortic contours traced; maximum 2.5 cm"
        ],
        [
          "Deep venous compression and Doppler sequences",
          "Femoral and popliteal veins compressible with venous flow"
        ],
        [
          "Femoral through pedal arterial sequences",
          "18-mm popliteal dilation with mural thrombus"
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.associated-aneurysm-survey.left_arterial.v2",
        "label": "Left popliteal arterial duplex ultrasound",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.associated-aneurysm-survey.aortic.v2",
        "label": "Abdominal aortic duplex ultrasound",
        "isCorrect": false,
        "distractorRationale": "This is an appropriate associated site but does not address the remaining arterial target after an adequate abdominal CTA."
      },
      {
        "id": "choice.vascular-aorta.associated-aneurysm-survey.thoracic.v2",
        "label": "Thoracic aortic CT angiography",
        "isCorrect": false,
        "distractorRationale": "A thoracic study does not complete the specifically supported opposite-popliteal and abdominal-aortic associated survey."
      }
    ],
    "explanation": "Screening associated with a PAA includes the opposite popliteal artery and abdominal aorta. The acquired left-leg study documents venous compression and flow; that reassuring result does not assess the contralateral arterial target. The abdominal CTA already supplies the aortic component of this survey.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.paa-associated-aneurysm-screen",
      "claim.vascular-aorta.celiac-ending-scan-infrarenal-coverage",
      "claim.vascular-aorta.marfan-taaa-open-repair"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.graft-bleed-imaging.v2",
    "conceptId": "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1",
    "stem": "Which investigation should have followed {patientName}'s unrevealing upper endoscopy during that admission?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.graft-bleed-imaging.cta.v2",
        "label": "Multiphase abdominal CT angiography",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.graft-bleed-imaging.push_enteroscopy.v2",
        "label": "Push enteroscopy into the distal duodenum",
        "isCorrect": false,
        "distractorRationale": "This is a genuine new mucosal target beyond the previous examination, but it does not replace cross-sectional evaluation of the prosthetic reconstruction and surrounding infection concern."
      },
      {
        "id": "choice.vascular-aorta.graft-bleed-imaging.red_cell_scan.v2",
        "label": "Tagged-red-cell gastrointestinal bleeding scintigraphy",
        "isCorrect": false,
        "distractorRationale": "Localization of intermittent bleeding does not characterize the prosthetic/infectious interface that links the other observations."
      }
    ],
    "explanation": "Prosthetic aortic history, unexplained bloodstream infection and bleeding raise a linked vascular concern. Cross-sectional assessment is appropriate even when a proximal mucosal examination is unrevealing. Distal enteroscopy offers a real new luminal target, but that target does not substitute for evaluating the reconstruction and extraluminal findings.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.graft-infection-evaluation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-aorta.marfan-repair-approach.v1",
    "conceptId": "concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1",
    "stem": "Which repair approach should have been preferred for {patientName}'s intact thoracoabdominal aneurysm?",
    "answerChoices": [
      {
        "id": "choice.vascular-aorta.marfan-repair-approach.open.v1",
        "label": "Open thoracoabdominal graft replacement",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "choice.vascular-aorta.marfan-repair-approach.branched.v1",
        "label": "Branched endovascular thoracoabdominal repair",
        "isCorrect": false,
        "distractorRationale": "Technical feasibility does not erase the guideline preference for open repair in this heritable native-aorta setting."
      },
      {
        "id": "choice.vascular-aorta.marfan-repair-approach.hybrid.v1",
        "label": "Visceral debranching with thoracic endografting",
        "isCorrect": false,
        "distractorRationale": "A hybrid operation still relies on endograft sealing in the diseased native aorta rather than providing the preferred open reconstruction."
      }
    ],
    "explanation": "For an intact TAAA requiring repair in Marfan syndrome, the checked multisociety guideline favors open repair. Native-aortic tissue disease and long-term durability matter even when branched or hybrid reconstruction is technically possible.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-aorta.marfan-taaa-open-repair"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "conceptId": "concept.topic.liver-malignancy.dynamic-acquisition.v1",
    "stem": "Which study should be obtained next to characterize {patientName}'s 2.6-cm liver lesion?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside record",
      "items": [
        {
          "label": "Ultrasound",
          "value": "A 2.6-cm solid liver lesion."
        },
        {
          "label": "Outside CT protocol",
          "value": "Portal-venous acquisition only; arterial and delayed acquisitions were not performed."
        },
        {
          "label": "CT observation",
          "value": "The lesion is lower in attenuation than the surrounding liver."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "dedicated_mri",
        "label": "Multiphasic contrast-enhanced liver MRI",
        "isCorrect": true,
        "rationale": "The outside CT did not acquire the vascular phases needed to characterize this lesion in cirrhosis.",
        "distractorRationale": null
      },
      {
        "id": "core_biopsy",
        "label": "Image-guided core biopsy of the lesion",
        "isCorrect": false,
        "rationale": "Biopsy may become appropriate after adequate characterization remains inconclusive; the current CT was not a dynamic liver examination.",
        "distractorRationale": "Biopsy may become appropriate after adequate characterization remains inconclusive; the current CT was not a dynamic liver examination."
      },
      {
        "id": "ultrasound",
        "label": "Interval conventional liver ultrasound",
        "isCorrect": false,
        "rationale": "A solid lesion of this size in cirrhosis needs diagnostic characterization rather than a surveillance-only repeat.",
        "distractorRationale": "A solid lesion of this size in cirrhosis needs diagnostic characterization rather than a surveillance-only repeat."
      }
    ],
    "explanation": "Interpret the acquisition record before the lesion description. The portal-phase CT cannot establish the needed vascular behavior; a dedicated liver MRI supplies diagnostic contrast phases. A biopsy decision follows adequate characterization when uncertainty persists.",
    "supportingEvidenceClaimIds": [
      "claim.question-topic.liver-malignancy.multiphasic-diagnosis",
      "claim.question-topic.liver-malignancy.persistently-indeterminate-tissue",
      "claim.question-topic.liver-malignancy.subcentimeter-surveillance"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "conceptId": "concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1",
    "stem": "Under the imaging-based diagnostic pathway, which minimum lesion-sampling plan is required before selecting tumor-specific treatment for {patientName}'s two liver lesions?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside record",
      "items": [
        {
          "label": "Background and acquisition",
          "value": "Cirrhosis. Arterial, portal-venous and delayed contrast phases are technically adequate."
        },
        {
          "label": "Segment II lesion",
          "value": "2.6 cm. Nonrim arterial hyperenhancement followed by nonperipheral washout."
        },
        {
          "label": "Segment VI lesion",
          "value": "2.1 cm. Peripheral-rim arterial enhancement followed by progressive delayed central enhancement."
        },
        {
          "label": "Sampling conditions",
          "value": "Both lesions can be safely targeted for core biopsy. Tumor-specific treatment has not been selected."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "sample_six",
        "label": "Biopsy segment VI; classify segment II by imaging",
        "isCorrect": true,
        "rationale": "The segment VI pattern is malignant-appearing but not HCC-specific. Segment II has an imaging-characteristic HCC pattern in cirrhosis; no separate reason requiring its tissue is supplied.",
        "distractorRationale": null
      },
      {
        "id": "sample_two",
        "label": "Biopsy segment II; classify segment VI by imaging",
        "isCorrect": false,
        "rationale": "Sampling the larger classic-pattern lesion leaves the non-HCC-specific segment VI lesion without tissue classification. Size alone does not select the diagnostic target.",
        "distractorRationale": "Sampling the larger classic-pattern lesion leaves the non-HCC-specific segment VI lesion without tissue classification. Size alone does not select the diagnostic target."
      },
      {
        "id": "sample_both",
        "label": "Biopsy both lesions; defer classification of each",
        "isCorrect": false,
        "rationale": "Biopsy of both can be considered for a separate indication, but it exceeds the minimum diagnostic tissue requirement in this represented imaging pathway. Segment II already meets imaging criteria.",
        "distractorRationale": "Biopsy of both can be considered for a separate indication, but it exceeds the minimum diagnostic tissue requirement in this represented imaging pathway. Segment II already meets imaging criteria."
      }
    ],
    "explanation": "Interpret each lesion independently. The segment II nonrim-enhancement/washout pattern in cirrhosis supports an imaging diagnosis; the segment VI rim-enhancing pattern indicates malignancy without establishing its histologic type. Obtain tissue from segment VI before choosing tumor-specific treatment. Optional sampling of an imaging-characteristic HCC for another clinical purpose is a separate decision.",
    "supportingEvidenceClaimIds": [
      "claim.question-topic.liver-malignancy.aasld-characteristic-imaging",
      "claim.question-topic.liver-malignancy.aasld-non-hcc-malignant-pattern",
      "claim.question-topic.liver-malignancy.aasld-biopsy-scope"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.liver-malignancy.hcc-raw-reserve.v2",
    "conceptId": "concept.hcc.compensated-cirrhosis-resection-selection",
    "stem": "Which specialist treatment assessment should be prioritized for {patientName}'s HCC?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside record",
      "items": [
        {
          "label": "Tumor/staging",
          "value": "One peripheral 4.6-cm lesion; no major vessel involvement or extrahepatic tumor."
        },
        {
          "label": "Observed reserve",
          "value": "Albumin 4.0 g/dL, bilirubin 0.8 mg/dL, INR 1.0, platelets 198,000/microliter."
        },
        {
          "label": "Clinical/endoscopic record",
          "value": "No ascites or encephalopathy; endoscopy shows no varices."
        },
        {
          "label": "Resection map",
          "value": "A limited resection leaves most of the liver, with patent arterial/portal inflow, hepatic veins and bile ducts."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "hpb",
        "label": "HPB-surgery assessment for hepatic resection",
        "isCorrect": true,
        "rationale": "The combined reserve and anatomic observations support the existing favorable resection profile.",
        "distractorRationale": null
      },
      {
        "id": "transplant",
        "label": "Transplant-center assessment for liver transplantation",
        "isCorrect": false,
        "rationale": "Tumor-burden eligibility is not a requirement to choose transplantation when the patient has a favorable resection profile.",
        "distractorRationale": "Tumor-burden eligibility is not a requirement to choose transplantation when the patient has a favorable resection profile."
      },
      {
        "id": "ablation",
        "label": "Interventional-radiology assessment for thermal ablation",
        "isCorrect": false,
        "rationale": "A larger peripheral lesion with favorable resection anatomy and reserve supports resection assessment here.",
        "distractorRationale": "A larger peripheral lesion with favorable resection anatomy and reserve supports resection assessment here."
      }
    ],
    "explanation": "The laboratory, clinical and anatomic record must be interpreted together. They support specialist resection assessment rather than letting tumor-burden eligibility select transplantation. This is an assessment priority, not automatic clearance for an operation or an absolute prohibition of every alternative local treatment.",
    "supportingEvidenceClaimIds": [
      "claim.question-topic.liver-malignancy.favorable-hcc-resection",
      "claim.question-topic.liver-malignancy.functional-remnant",
      "claim.question-topic.liver-malignancy.hcc-ablation-size",
      "claim.n1.addcd31f93bb",
      "claim.n1.bf9e72bc7198",
      "claim.question-topic.liver-malignancy.early-hcc-decompensation-transplant",
      "claim.n1.a2f96b40428e"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.liver-malignancy.hcc-portal-flow.v1",
    "conceptId": "concept.topic.liver-malignancy.hcc-vascular-pathway.v1",
    "stem": "Which treatment-planning pathway should be prioritized for {patientName} after this staging?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside record",
      "items": [
        {
          "label": "Tumor",
          "value": "A 3.6-cm hepatic HCC."
        },
        {
          "label": "Vascular report",
          "value": "Tumor extends into and occludes the main portal vein; the intrahepatic arteries remain patent."
        },
        {
          "label": "Other staging",
          "value": "No extrahepatic tumor identified."
        },
        {
          "label": "Current condition",
          "value": "Independent in daily activities; bilirubin and INR within laboratory intervals; no ascites."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "systemic",
        "label": "Medical-oncology assessment for systemic HCC therapy",
        "isCorrect": true,
        "rationale": "Major portal tumor involvement changes the pathway despite the limited measured liver mass; preserved condition supports systemic assessment.",
        "distractorRationale": null
      },
      {
        "id": "tace",
        "label": "Interventional-radiology assessment for hepatic chemoembolization",
        "isCorrect": false,
        "rationale": "Arterial embolization in a liver with major portal obstruction risks the remaining hepatic perfusion; this is not the routine favorable TACE profile.",
        "distractorRationale": "Arterial embolization in a liver with major portal obstruction risks the remaining hepatic perfusion; this is not the routine favorable TACE profile."
      },
      {
        "id": "transplant",
        "label": "Transplant-center assessment for standard HCC transplantation",
        "isCorrect": false,
        "rationale": "A small measured mass does not overcome macrovascular tumor extension in a standard HCC transplant pathway.",
        "distractorRationale": "A small measured mass does not overcome macrovascular tumor extension in a standard HCC transplant pathway."
      }
    ],
    "explanation": "Read vascular extension and hepatic perfusion before selecting a pathway from tumor size. Main portal occlusion makes routine arterial embolization hazardous, while macrovascular tumor extension defeats a standard small-burden transplant shortcut. Preserved hepatic function and activity support systemic-treatment assessment; this question does not rank named drugs or exclude every specialist-directed locoregional exception.",
    "supportingEvidenceClaimIds": [
      "claim.question-topic.liver-malignancy.hcc-arterial-portal-perfusion",
      "claim.question-topic.liver-malignancy.advanced-hcc-systemic-assessment",
      "claim.n1.e0b6bc7a19dc",
      "claim.question-topic.liver-malignancy.nonmetastatic-hcc-arterial-pathway",
      "claim.question-topic.liver-malignancy.early-hcc-decompensation-transplant"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1",
    "stem": "Which initial treatment plan best fits {patientName}'s pancreatic-head cancer findings?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.upfront.v2",
        "label": "Upfront resection with venous reconstruction",
        "isCorrect": false,
        "rationale": "This potentially reconstructable venous pattern is not a simple clearly resectable relationship. Neoadjuvant therapy and reassessment are generally favored over proceeding directly to a technically complex operation.",
        "distractorRationale": "This potentially reconstructable venous pattern is not a simple clearly resectable relationship. Neoadjuvant therapy and reassessment are generally favored over proceeding directly to a technically complex operation."
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.neoadjuvant.v2",
        "label": "Neoadjuvant chemotherapy with surgical reassessment",
        "isCorrect": true,
        "rationale": "The venous abnormality with preserved adjacent segments and separated arteries supports a potentially reconstructable borderline pattern. Begin systemic treatment, then reassess staging and technical resectability.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.palliative.v2",
        "label": "Palliative chemotherapy with response assessment",
        "isCorrect": false,
        "rationale": "Venous involvement alone does not establish permanent unresectability. The supplied negative distant staging and potentially reconstructable local pattern retain a possible resection pathway.",
        "distractorRationale": "Venous involvement alone does not establish permanent unresectability. The supplied negative distant staging and potentially reconstructable local pattern retain a possible resection pathway."
      }
    ],
    "explanation": "The venous contour change and short narrowed segment suggest borderline local anatomy rather than either a clear surgery-first relationship or necessarily permanent unresectability. Neoadjuvant systemic treatment with restaging and surgical reassessment is the best offered sequence. Patency above and below supports consideration of reconstruction; it does not guarantee technical feasibility, which requires specialist review.",
    "supportingEvidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.cancer-neoadjuvant",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-reconstructible-vein",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-metastatic-boundary"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1",
    "stem": "Which pre-treatment management plan is best for {patientName} at this visit?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.metal.v2",
        "label": "ERCP metal stenting before chemotherapy",
        "isCorrect": true,
        "rationale": "Obstructive jaundice should be relieved before the planned neoadjuvant course. A self-expanding metal stent offers more durable drainage through that treatment interval than a plastic stent.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.plastic.v2",
        "label": "ERCP plastic stenting before chemotherapy",
        "isCorrect": false,
        "rationale": "Plastic stenting can decompress the duct but is more prone to occlusion during a prolonged neoadjuvant interval. The planned course makes durable metal-stent drainage preferable here.",
        "distractorRationale": "Plastic stenting can decompress the duct but is more prone to occlusion during a prolonged neoadjuvant interval. The planned course makes durable metal-stent drainage preferable here."
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.defer.v2",
        "label": "Begin chemotherapy with bilirubin reassessment",
        "isCorrect": false,
        "rationale": "The patient has progressive obstructive jaundice before a multi-cycle course. Reassessment alone does not first relieve the obstruction or provide durable drainage.",
        "distractorRationale": "The patient has progressive obstructive jaundice before a multi-cycle course. Reassessment alone does not first relieve the obstruction or provide durable drainage."
      }
    ],
    "explanation": "Progressive jaundice with upstream dilation represents clinically important biliary obstruction even without cholangitis. Drain it before the planned neoadjuvant course. Endoscopic self-expanding metal stenting is preferred to plastic stenting for durable drainage through that interval. This comparison does not establish one metal-stent design as universally best and does not create a numerical bilirubin rule.",
    "supportingEvidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.cancer-biliary-drainage",
      "claim.pancreas-chronic-cysts-neoplasia.r2.biliary-metal-patency"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1",
    "stem": "Which management plan should have been recommended for {patientName} at this point in the hospital course?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.catheter.v2",
        "label": "Antibiotics plus image-guided catheter drainage",
        "isCorrect": true,
        "rationale": "The existing catheter drains a different collapsed compartment. Persistent infection with a separate collection needs effective source control; image-guided access is the less invasive initial approach in this stable record.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.observe.v2",
        "label": "Antibiotics plus interval imaging reassessment",
        "isCorrect": false,
        "rationale": "The record contains ongoing infection with a separate undrained collection. The presence of an existing catheter does not establish source control when its side holes are confined to another compartment.",
        "distractorRationale": "The record contains ongoing infection with a separate undrained collection. The presence of an existing catheter does not establish source control when its side holes are confined to another compartment."
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.operation.v2",
        "label": "Antibiotics plus operative washout and drainage",
        "isCorrect": false,
        "rationale": "Operative source control is a real option, but stable physiology without generalized peritonitis and an available image-guided approach favor a minimally invasive attempt first. This is not a requirement to delay surgery if the situation changes.",
        "distractorRationale": "Operative source control is a real option, but stable physiology without generalized peritonitis and an available image-guided approach favor a minimally invasive attempt first. This is not a requirement to delay surgery if the situation changes."
      }
    ],
    "explanation": "The catheter's side holes are in the collapsed anterior space, while the infected-appearing collection occupies a separate posterior compartment. Antibiotics and the existing catheter have therefore not established adequate source control. Image-guided catheter drainage is the preferred initial addition in this stable hospital record. IR must choose new placement or exchange from the actual anatomy; the question does not promise that repositioning through the old tract will work. Operative drainage remains appropriate if interventional control fails or surgical indications develop.",
    "supportingEvidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.postop-infected-collection",
      "claim.pancreas-chronic-cysts-neoplasia.postop-stepup"
    ],
    "exhibit": {
      "kind": "table",
      "caption": "Constructed teaching record; fictional patient observations",
      "rowHeaders": [
        "Anterior operative bed",
        "Posterior operative bed",
        "Other CT findings"
      ],
      "columnHeaders": [
        "Readmission contrast CT"
      ],
      "cells": [
        [
          "Collapsed space containing all side holes of the existing catheter"
        ],
        [
          "Rim-enhancing fluid with internal gas, separated from the anterior space by tissue; posterior skin-to-collection path crosses no bowel or major vessel"
        ],
        [
          "No diffuse free air; no active hemorrhage"
        ]
      ]
    }
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1",
    "stem": "Which management plan best addresses {patientName}'s pancreatic lesion and current symptoms?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.surveillance.v1",
        "label": "Continue pancreatic MRI surveillance",
        "isCorrect": false,
        "rationale": "The phenotype is reassuring for malignancy, but surveillance does not address demonstrated symptomatic compression.",
        "distractorRationale": "The phenotype is reassuring for malignancy, but surveillance does not address demonstrated symptomatic compression."
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.drainage.v1",
        "label": "Arrange endoscopic cystgastrostomy",
        "isCorrect": false,
        "rationale": "A microcystic epithelial lesion is not an inflammatory collection that can be treated by cystgastrostomy.",
        "distractorRationale": "A microcystic epithelial lesion is not an inflammatory collection that can be treated by cystgastrostomy."
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.resection.v1",
        "label": "Refer for pancreatic cyst resection",
        "isCorrect": true,
        "rationale": "A convincingly serous lesion can still require surgery when it causes adjacent-organ compression and symptoms.",
        "distractorRationale": null
      }
    ],
    "explanation": "The microcystic, central-scar pattern favors a serous lesion. Usually benign behavior does not eliminate the mechanical indication: the lesion narrows the stomach and symptoms match that site. Resection evaluation is appropriate; a benign epithelial cyst is not managed as a pseudocyst.",
    "supportingEvidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.serous-compression",
      "claim.pancreas-chronic-cysts-neoplasia.serous-phenotype",
      "claim.pancreas-chronic-cysts-neoplasia.cyst-imaging-limits"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1",
    "stem": "Which pancreatic-remnant management plan should be recommended for {patientName} now?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.completion.v1",
        "label": "Completion pancreatectomy",
        "isCorrect": false,
        "rationale": "Low-grade margin dysplasia and an unconcerning remnant cyst do not establish a need to remove the remaining pancreas.",
        "distractorRationale": "Low-grade margin dysplasia and an unconcerning remnant cyst do not establish a need to remove the remaining pancreas."
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.surveillance.v1",
        "label": "MRI-based surveillance of the pancreatic remnant",
        "isCorrect": true,
        "rationale": "Resected IPMN still warrants remnant surveillance; the low-grade margin and low-risk remnant do not by themselves select completion surgery.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.discharge.v1",
        "label": "Discharge from pancreatic imaging follow-up",
        "isCorrect": false,
        "rationale": "The absence of invasive cancer does not remove the remnant risk associated with IPMN.",
        "distractorRationale": "The absence of invasive cancer does not remove the remnant risk associated with IPMN."
      }
    ],
    "explanation": "Low-grade IPMN at a margin is not equivalent to invasive cancer at a margin. With no concerning remnant finding, surveillance preserves the opportunity to detect later disease without automatic completion pancreatectomy. Postresection IPMN follow-up differs from a completely resected noninvasive MCN.",
    "supportingEvidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.ipmn-remnant",
      "claim.pancreas-chronic-cysts-neoplasia.ipmn-low-grade-margin",
      "claim.pancreas-chronic-cysts-neoplasia.mcn-noninvasive-after-resection"
    ]
  }
];
export const PROGRAM_BATCH2_TIMINGS: AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.trauma-thoracic.bci-selective-imaging.v2.surveillance",
          "choiceLabel": "Continue reassessment without immediate cardiac imaging",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.trauma-thoracic.bci-selective-imaging.v2.tte",
          "choiceLabel": "Add transthoracic echocardiography to reassessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.trauma-thoracic.bci-selective-imaging.v2.ct",
          "choiceLabel": "Add cardiac CT to reassessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.tee",
          "choiceLabel": "Transesophageal echocardiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.ct",
          "choiceLabel": "Cardiac CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.mri",
          "choiceLabel": "Cardiac magnetic resonance imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.surveillance",
          "choiceLabel": "Continue monitoring without further cardiac imaging",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.trauma-thoracic.cardiac-disposition.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.trauma-thoracic.drain-complication.20261111.v1",
    "nodeId": "node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.trauma-thoracic.chest-drain-organ-trajectory.retain",
          "choiceLabel": "Retain the tube; obtain contrast CT mapping",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.trauma-thoracic.chest-drain-organ-trajectory.remove",
          "choiceLabel": "Remove the tube; obtain ultrasound reassessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.trauma-thoracic.chest-drain-organ-trajectory.retract",
          "choiceLabel": "Retract the tube; obtain repeat chest radiographs",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.trauma-thoracic.bleeding-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.trauma-thoracic.bleeding-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.retained-hemothorax.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.retained-hemothorax.20261111.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.trauma-thoracic.chestwall-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-aorta.screening-review.v2",
    "nodeId": "node.vascular-aorta.screening.v2",
    "questionVariantId": "question.vascular-aorta.screening.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-aorta.screening.ultrasound.v2",
          "choiceLabel": "Obtain abdominal aortic ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.screening.cta.v2",
          "choiceLabel": "Obtain abdominal aortic CT angiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.screening.no_imaging.v2",
          "choiceLabel": "Arrange no additional aortic imaging",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-aorta.proximal-attachment-leak.v1",
    "nodeId": "node.vascular-aorta.proximal-seal-repair.v1",
    "questionVariantId": "question.vascular-aorta.proximal-seal-repair.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-aorta.proximal-seal-repair.cuff.v1",
          "choiceLabel": "Extend the proximal seal with an aortic cuff",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.proximal-seal-repair.surveillance.v1",
          "choiceLabel": "Continue aortic duplex imaging surveillance",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.proximal-seal-repair.branch_coils.v1",
          "choiceLabel": "Embolize the lumbar inflow and sac cavity",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-aorta.retrograde-ascending-extension.v1",
    "nodeId": "node.vascular-aorta.ascending-emergency.v1",
    "questionVariantId": "question.vascular-aorta.ascending-emergency.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-aorta.ascending-emergency.ascending_open.v1",
          "choiceLabel": "Emergency open ascending aortic repair",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.ascending-emergency.descending_tevar.v1",
          "choiceLabel": "Urgent descending thoracic endovascular repair",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.ascending-emergency.medical.v1",
          "choiceLabel": "Intravenous esmolol with CT angiographic follow-up",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-aorta.impulse-response-review.v2",
    "nodeId": "node.vascular-aorta.initial-type-b.v2",
    "questionVariantId": "question.vascular-aorta.initial-type-b.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-aorta.tevar-inflow-and-neurology.v1",
    "nodeId": "node.vascular-aorta.lsa-coronary-inflow.v1",
    "questionVariantId": "question.vascular-aorta.lsa-coronary-inflow.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-aorta.tevar-inflow-and-neurology.v1",
    "nodeId": "node.vascular-aorta.post-tevar-cord-rescue.v1",
    "questionVariantId": "question.vascular-aorta.post-tevar-cord-rescue.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.small-embolizing-paa.v2",
    "questionVariantId": "question.vascular-aorta.small-embolizing-paa.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-aorta.small-embolizing-paa.repair_plan.v2",
          "choiceLabel": "Plan popliteal aneurysm repair with vascular surgery",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.small-embolizing-paa.anticoagulate.v2",
          "choiceLabel": "Start anticoagulation with popliteal duplex follow-up",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.small-embolizing-paa.surveillance.v2",
          "choiceLabel": "Continue annual popliteal duplex surveillance",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.associated-aneurysm-survey.v2",
    "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-aorta.associated-aneurysm-survey.left_arterial.v2",
          "choiceLabel": "Left popliteal arterial duplex ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.associated-aneurysm-survey.aortic.v2",
          "choiceLabel": "Abdominal aortic duplex ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.associated-aneurysm-survey.thoracic.v2",
          "choiceLabel": "Thoracic aortic CT angiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-aorta.graft-diagnostic-review.v2",
    "nodeId": "node.vascular-aorta.graft-bleed-imaging.v2",
    "questionVariantId": "question.vascular-aorta.graft-bleed-imaging.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-aorta.graft-bleed-imaging.cta.v2",
          "choiceLabel": "Multiphase abdominal CT angiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.graft-bleed-imaging.push_enteroscopy.v2",
          "choiceLabel": "Push enteroscopy into the distal duodenum",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "choice.vascular-aorta.graft-bleed-imaging.red_cell_scan.v2",
          "choiceLabel": "Tagged-red-cell gastrointestinal bleeding scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-aorta.heritable-native-taaa.v1",
    "nodeId": "node.vascular-aorta.marfan-repair-approach.v1",
    "questionVariantId": "question.vascular-aorta.marfan-repair-approach.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-acquisition.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "dedicated_mri",
          "choiceLabel": "Multiphasic contrast-enhanced liver MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "core_biopsy",
          "choiceLabel": "Image-guided core biopsy of the lesion",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "ultrasound",
          "choiceLabel": "Interval conventional liver ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sample_six",
          "choiceLabel": "Biopsy segment VI; classify segment II by imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "sample_two",
          "choiceLabel": "Biopsy segment II; classify segment VI by imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "sample_both",
          "choiceLabel": "Biopsy both lesions; defer classification of each",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.hcc-favorable-resection.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-raw-reserve.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-raw-reserve.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.hcc-portal-flow.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-portal-flow.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-portal-flow.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.metal.v2",
          "choiceLabel": "ERCP metal stenting before chemotherapy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.therapeutic_ercp"
          }
        },
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.plastic.v2",
          "choiceLabel": "ERCP plastic stenting before chemotherapy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.therapeutic_ercp"
          }
        },
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.defer.v2",
          "choiceLabel": "Begin chemotherapy with bilirubin reassessment",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.catheter.v2",
          "choiceLabel": "Antibiotics plus image-guided catheter drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.observe.v2",
          "choiceLabel": "Antibiotics plus interval imaging reassessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.operation.v2",
          "choiceLabel": "Antibiotics plus operative washout and drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.surveillance.v1",
          "choiceLabel": "Continue pancreatic MRI surveillance",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mrcp"
          }
        },
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.drainage.v1",
          "choiceLabel": "Arrange endoscopic cystgastrostomy",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.resection.v1",
          "choiceLabel": "Refer for pancreatic cyst resection",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.completion.v1",
          "choiceLabel": "Completion pancreatectomy",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.surveillance.v1",
          "choiceLabel": "MRI-based surveillance of the pancreatic remnant",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mrcp"
          }
        },
        {
          "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.discharge.v1",
          "choiceLabel": "Discharge from pancreatic imaging follow-up",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  }
];
export const PROGRAM_BATCH2_RETIRED_CASES: SyntheticClinicalCase[] = [
  {
    "id": "case.hcc.resection.candidate-profile",
    "displayName": "Clinic Patient: HCC Resection Candidate Profile",
    "patientPresentationVariantId": "presentation.hcc.resection.candidate-profile",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "Clinic Patient",
    "chiefComplaint": "HCC treatment consultation",
    "patientPresentationRevision": {
      "id": "pprv3.case.hcc.resection.candidate-profile",
      "patientPresentationVariantId": "presentation.hcc.resection.candidate-profile",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "HCC treatment consultation",
      "revisedPresentation": "{patientName}, who has a solitary HCC, returns to compare completed resection-candidate profiles after staging excludes macrovascular invasion and extrahepatic disease.",
      "revisedFields": [
        "chiefComplaint",
        "presentation"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName}, who has a solitary HCC, returns to compare completed resection-candidate profiles after staging excludes macrovascular invasion and extrahepatic disease.",
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.referral",
    "sourceLabels": [
      "AASLD Practice Guidance on hepatocellular carcinoma, 2023",
      "Clinically approved by Melissa Rowland, MD on 2026-08-21"
    ],
    "decisionNodes": [
      {
        "id": "node.hcc.resection.candidate-profile",
        "questionVariantId": "question.hcc.resection.candidate-profile.v1",
        "primaryConceptId": "concept.hcc.compensated-cirrhosis-resection-selection",
        "stem": "Which profile supports hepatic resection evaluation in this approved concept?",
        "answerChoices": [
          {
            "id": "favorable_profile",
            "label": "Preserved function, no clinically significant portal hypertension, and adequate future liver remnant",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "portal_hypertension_profile",
            "label": "Preserved function, significant portal hypertension, and inadequate future liver remnant after evaluation",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "decompensated_profile",
            "label": "Decompensated function, no distant disease, and inadequate future liver remnant after evaluation",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "This approved package teaches hospital HPB-surgery referral for hepatic resection evaluation only when the complete favorable profile is present. It does not make Child-Pugh A status, Milan classification, or any single finding sufficient by itself.",
        "sourceLabels": [
          "AASLD Practice Guidance on hepatocellular carcinoma, 2023",
          "Clinically approved by Melissa Rowland, MD on 2026-08-21"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "portal_hypertension_profile",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded Preserved function, significant portal hypertension, and inadequate future liver remnant after evaluation instead of the approved hospital HPB-surgery referral pathway.",
            "clinicalRationale": "This approved package teaches hospital HPB-surgery referral for hepatic resection evaluation only when the complete favorable profile is present. It does not make Child-Pugh A status, Milan classification, or any single finding sufficient by itself.",
            "sourceLabels": [
              "AASLD Practice Guidance on hepatocellular carcinoma, 2023",
              "Clinically approved by Melissa Rowland, MD on 2026-08-21"
            ]
          },
          {
            "answerChoiceId": "decompensated_profile",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded Decompensated function, no distant disease, and inadequate future liver remnant after evaluation instead of the approved hospital HPB-surgery referral pathway.",
            "clinicalRationale": "This approved package teaches hospital HPB-surgery referral for hepatic resection evaluation only when the complete favorable profile is present. It does not make Child-Pugh A status, Milan classification, or any single finding sufficient by itself.",
            "sourceLabels": [
              "AASLD Practice Guidance on hepatocellular carcinoma, 2023",
              "Clinically approved by Melissa Rowland, MD on 2026-08-21"
            ]
          }
        ]
      }
    ],
    "learningSummary": "This approved package teaches hospital HPB-surgery referral for hepatic resection evaluation only when the complete favorable profile is present. It does not make Child-Pugh A status, Milan classification, or any single finding sufficient by itself."
  },
  {
    "id": "case.pancreatic-cyst.surveillance-question",
    "displayName": "Pancreatic-cyst duct characterization",
    "patientPresentationVariantId": "presentation.pancreatic-cyst.surveillance-question",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Pancreatic cyst review",
    "patientPresentationRevision": {
      "id": "pprv3.case.pancreatic-cyst.surveillance-question",
      "patientPresentationVariantId": "presentation.pancreatic-cyst.surveillance-question",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Pancreatic cyst review",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} has an incidentally detected pancreatic body lesion that remains indeterminate on the available study. {patientName} is stable and is being evaluated for duct relationship before management planning.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pancreatic-cyst.surveillance-question.female.43",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} has an incidentally detected pancreatic body lesion that remains indeterminate on the available study. {patientName} is stable and is being evaluated for duct relationship before management planning."
      },
      {
        "id": "profile.pancreatic-cyst.surveillance-question.female.44",
        "prototypeDemographics": {
          "ageYears": 44,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} has an incidentally detected pancreatic body lesion that remains indeterminate on the available study. {patientName} is stable and is being evaluated for duct relationship before management planning."
      },
      {
        "id": "profile.pancreatic-cyst.surveillance-question.female.45",
        "prototypeDemographics": {
          "ageYears": 45,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} has an incidentally detected pancreatic body lesion that remains indeterminate on the available study. {patientName} is stable and is being evaluated for duct relationship before management planning."
      },
      {
        "id": "profile.pancreatic-cyst.surveillance-question.female.42",
        "prototypeDemographics": {
          "ageYears": 42,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} has an incidentally detected pancreatic body lesion that remains indeterminate on the available study. {patientName} is stable and is being evaluated for duct relationship before management planning."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "American College of Gastroenterology pancreatic-cyst guideline (2018)"
    ],
    "decisionNodes": [
      {
        "id": "node.pancreatic-cyst.surveillance-question.1",
        "questionVariantId": "question.pancreatic-cyst.mrcp-duct-assessment.v3",
        "primaryConceptId": "concept.pancreatic-cyst.mrcp-duct-assessment",
        "stem": "Which noninvasive study best assesses whether {patientName}'s pancreatic cyst communicates with the main duct?",
        "answerChoices": [
          {
            "id": "mrcp_3",
            "label": "Pancreatic MRI with MRCP",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.mrcp"
            }
          },
          {
            "id": "pancreatic_ct_3",
            "label": "Pancreatic-protocol CT",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "eus_3",
            "label": "Endoscopic ultrasound with possible sampling",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "abdominal_ultrasound_3",
            "label": "Transabdominal ultrasound",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "MRI/MRCP is a preferred noninvasive study for defining the relationship between a pancreatic cyst and the main duct.",
        "sourceLabels": [
          "American College of Gastroenterology pancreatic-cyst guideline (2018)"
        ],
        "resultGateAfter": {
          "id": "gate.pancreatic-cyst.mrcp.3",
          "resultTypeId": "service.mrcp",
          "pendingLabel": "External MRI/MRCP pending",
          "resultNarrative": "MRI/MRCP shows a unilocular cyst in the pancreatic body without main-duct communication, mural nodule, or main-duct dilation.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.mrcp.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.pancreatic-cyst.surveillance-question.2",
        "questionVariantId": "question.pancreatic-cyst.mcn-pattern-recognition.v3",
        "primaryConceptId": "concept.pancreatic-cyst.mcn-pattern-recognition",
        "currentUpdate": "MRI/MRCP shows a unilocular cyst in the pancreatic body without main-duct communication, mural nodule, or main-duct dilation.",
        "stem": "Based on {patientName}'s returned MRI/MRCP pattern, which cyst type is most compatible with these findings?",
        "answerChoices": [
          {
            "id": "mcn_pattern_3",
            "label": "Mucinous cystic neoplasm-compatible pattern",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "side_branch_ipmn_3",
            "label": "Side-branch intraductal papillary mucinous neoplasm pattern",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "main_duct_ipmn_3",
            "label": "Main-duct intraductal papillary mucinous neoplasm pattern",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "pseudocyst_3",
            "label": "Pancreatic pseudocyst pattern",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
        "sourceLabels": [
          "American College of Gastroenterology pancreatic-cyst guideline (2018)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "side_branch_ipmn_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Side-branch intraductal papillary mucinous neoplasm pattern.”",
            "clinicalRationale": "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
            "sourceLabels": [
              "American College of Gastroenterology pancreatic-cyst guideline (2018)"
            ]
          },
          {
            "answerChoiceId": "main_duct_ipmn_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Main-duct intraductal papillary mucinous neoplasm pattern.”",
            "clinicalRationale": "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
            "sourceLabels": [
              "American College of Gastroenterology pancreatic-cyst guideline (2018)"
            ]
          },
          {
            "answerChoiceId": "pseudocyst_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Pancreatic pseudocyst pattern.”",
            "clinicalRationale": "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
            "sourceLabels": [
              "American College of Gastroenterology pancreatic-cyst guideline (2018)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "MRI/MRCP is a preferred noninvasive study for defining the relationship between a pancreatic cyst and the main duct. A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection."
  },
  {
    "id": "case.pancreatic-cyst.tail-lesion-review",
    "displayName": "Pancreatic-cyst duct characterization",
    "patientPresentationVariantId": "presentation.pancreatic-cyst.tail-lesion-review",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 58,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Pancreatic cyst review",
    "patientPresentationRevision": {
      "id": "pprv3.case.pancreatic-cyst.tail-lesion-review",
      "patientPresentationVariantId": "presentation.pancreatic-cyst.tail-lesion-review",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Pancreatic cyst review",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} has an indeterminate tail cyst without alarm symptoms. {patientName} is fit for outpatient specialist evaluation and needs noninvasive duct characterization.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pancreatic-cyst.tail-lesion-review.female.58",
        "prototypeDemographics": {
          "ageYears": 58,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} has an indeterminate tail cyst without alarm symptoms. {patientName} is fit for outpatient specialist evaluation and needs noninvasive duct characterization."
      },
      {
        "id": "profile.pancreatic-cyst.tail-lesion-review.female.57",
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
        "presentation": "{patientName} has an indeterminate tail cyst without alarm symptoms. {patientName} is fit for outpatient specialist evaluation and needs noninvasive duct characterization."
      },
      {
        "id": "profile.pancreatic-cyst.tail-lesion-review.female.56",
        "prototypeDemographics": {
          "ageYears": 56,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} has an indeterminate tail cyst without alarm symptoms. {patientName} is fit for outpatient specialist evaluation and needs noninvasive duct characterization."
      },
      {
        "id": "profile.pancreatic-cyst.tail-lesion-review.female.59",
        "prototypeDemographics": {
          "ageYears": 59,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} has an indeterminate tail cyst without alarm symptoms. {patientName} is fit for outpatient specialist evaluation and needs noninvasive duct characterization."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "American College of Gastroenterology pancreatic-cyst guideline (2018)"
    ],
    "decisionNodes": [
      {
        "id": "node.pancreatic-cyst.tail-lesion-review.1",
        "questionVariantId": "question.pancreatic-cyst.mrcp-duct-assessment.v4",
        "primaryConceptId": "concept.pancreatic-cyst.mrcp-duct-assessment",
        "stem": "Which noninvasive study best assesses whether {patientName}'s pancreatic cyst communicates with the main duct?",
        "answerChoices": [
          {
            "id": "mrcp_4",
            "label": "Pancreatic MRI with MRCP",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.mrcp"
            }
          },
          {
            "id": "pancreatic_ct_4",
            "label": "Pancreatic-protocol CT",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "eus_4",
            "label": "Endoscopic ultrasound with possible sampling",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "abdominal_ultrasound_4",
            "label": "Transabdominal ultrasound",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "MRI/MRCP is a preferred noninvasive study for defining the relationship between a pancreatic cyst and the main duct.",
        "sourceLabels": [
          "American College of Gastroenterology pancreatic-cyst guideline (2018)"
        ],
        "resultGateAfter": {
          "id": "gate.pancreatic-cyst.mrcp.4",
          "resultTypeId": "service.mrcp",
          "pendingLabel": "External MRI/MRCP pending",
          "resultNarrative": "MRI/MRCP shows a unilocular cyst in the pancreatic tail without main-duct communication, mural nodule, or main-duct dilation.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.mrcp.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.pancreatic-cyst.tail-lesion-review.2",
        "questionVariantId": "question.pancreatic-cyst.mcn-pattern-recognition.v4",
        "primaryConceptId": "concept.pancreatic-cyst.mcn-pattern-recognition",
        "currentUpdate": "MRI/MRCP shows a unilocular cyst in the pancreatic tail without main-duct communication, mural nodule, or main-duct dilation.",
        "stem": "Based on {patientName}'s returned MRI/MRCP pattern, which cyst type is most compatible with these findings?",
        "answerChoices": [
          {
            "id": "mcn_pattern_4",
            "label": "Mucinous cystic neoplasm-compatible pattern",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "side_branch_ipmn_4",
            "label": "Side-branch intraductal papillary mucinous neoplasm pattern",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "main_duct_ipmn_4",
            "label": "Main-duct intraductal papillary mucinous neoplasm pattern",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "pseudocyst_4",
            "label": "Pancreatic pseudocyst pattern",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
        "sourceLabels": [
          "American College of Gastroenterology pancreatic-cyst guideline (2018)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "side_branch_ipmn_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Side-branch intraductal papillary mucinous neoplasm pattern.”",
            "clinicalRationale": "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
            "sourceLabels": [
              "American College of Gastroenterology pancreatic-cyst guideline (2018)"
            ]
          },
          {
            "answerChoiceId": "main_duct_ipmn_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Main-duct intraductal papillary mucinous neoplasm pattern.”",
            "clinicalRationale": "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
            "sourceLabels": [
              "American College of Gastroenterology pancreatic-cyst guideline (2018)"
            ]
          },
          {
            "answerChoiceId": "pseudocyst_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Pancreatic pseudocyst pattern.”",
            "clinicalRationale": "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
            "sourceLabels": [
              "American College of Gastroenterology pancreatic-cyst guideline (2018)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "MRI/MRCP is a preferred noninvasive study for defining the relationship between a pancreatic cyst and the main duct. A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection."
  },
  {
    "id": "case.aaa.retired-carpenter",
    "displayName": "AAA screening visit",
    "patientPresentationVariantId": "presentation.aaa.retired-carpenter",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
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
    "chiefComplaint": "Aneurysm screening",
    "presentation": "{patientName} is a 65-year-old man who smoked for 25 years before quitting and has never had aneurysm screening. He has no abdominal or back pain and is an acceptable operative-risk candidate.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.aaa.retired-carpenter.male.65",
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
        "presentation": "{patientName} is a 65-year-old man who smoked for 25 years before quitting and has never had aneurysm screening. He has no abdominal or back pain and is an acceptable operative-risk candidate."
      },
      {
        "id": "profile.aaa.retired-carpenter.male.66",
        "prototypeDemographics": {
          "ageYears": 66,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 66-year-old man who smoked for 25 years before quitting and has never had aneurysm screening. He has no abdominal or back pain and is an acceptable operative-risk candidate."
      },
      {
        "id": "profile.aaa.retired-carpenter.male.67",
        "prototypeDemographics": {
          "ageYears": 67,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 67-year-old man who smoked for 25 years before quitting and has never had aneurysm screening. He has no abdominal or back pain and is an acceptable operative-risk candidate."
      },
      {
        "id": "profile.aaa.retired-carpenter.male.68",
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
        "presentation": "{patientName} is a 68-year-old man who smoked for 25 years before quitting and has never had aneurysm screening. He has no abdominal or back pain and is an acceptable operative-risk candidate."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "USPSTF AAA screening recommendation (2019)",
      "Society for Vascular Surgery AAA guidance (accessed 2026)"
    ],
    "decisionNodes": [
      {
        "id": "node.aaa.retired-carpenter.1",
        "questionVariantId": "question.aaa.one-time-ultrasound-screening.v1",
        "primaryConceptId": "concept.aaa.one-time-ultrasound-screening",
        "stem": "Which one-time screening test should {patientName} receive?",
        "answerChoices": [
          {
            "id": "ultrasound_1",
            "label": "Abdominal ultrasound",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.ultrasound"
            }
          },
          {
            "id": "cta_1",
            "label": "CT angiography",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "xray_1",
            "label": "Abdominal radiography",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "echo_1",
            "label": "Transthoracic echocardiography",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Men age 65 through 75 who have ever smoked should receive one-time abdominal ultrasound screening for AAA.",
        "sourceLabels": [
          "USPSTF AAA screening recommendation (2019)",
          "Society for Vascular Surgery AAA guidance (accessed 2026)"
        ],
        "resultGateAfter": {
          "id": "gate.aaa.ultrasound.1",
          "resultTypeId": "service.ultrasound",
          "pendingLabel": "Aortic ultrasound pending",
          "resultNarrative": "Ultrasound shows a 6.0-cm fusiform infrarenal abdominal aortic aneurysm without rupture. The patient remains an acceptable operative-risk candidate.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.ultrasound.outsourced",
            "route.ultrasound.in_house"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.aaa.retired-carpenter.2",
        "questionVariantId": "question.aaa.six-cm-elective-repair-referral.v1",
        "primaryConceptId": "concept.aaa.six-cm-elective-repair-referral",
        "currentUpdate": "Ultrasound shows a 6.0-cm fusiform infrarenal abdominal aortic aneurysm without rupture. The patient remains an acceptable operative-risk candidate.",
        "stem": "What is the next plan for {patientName}?",
        "answerChoices": [
          {
            "id": "vascular_1",
            "label": "Elective vascular repair evaluation",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "annual_1",
            "label": "Annual ultrasound surveillance",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "emergency_1",
            "label": "Send for emergency rupture exploration",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "no_followup_1",
            "label": "End aneurysm follow-up",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
        "sourceLabels": [
          "USPSTF AAA screening recommendation (2019)",
          "Society for Vascular Surgery AAA guidance (accessed 2026)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "annual_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Annual ultrasound surveillance.”",
            "clinicalRationale": "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
            "sourceLabels": [
              "USPSTF AAA screening recommendation (2019)",
              "Society for Vascular Surgery AAA guidance (accessed 2026)"
            ]
          },
          {
            "answerChoiceId": "emergency_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Send for emergency rupture exploration.”",
            "clinicalRationale": "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
            "sourceLabels": [
              "USPSTF AAA screening recommendation (2019)",
              "Society for Vascular Surgery AAA guidance (accessed 2026)"
            ]
          },
          {
            "answerChoiceId": "no_followup_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “End aneurysm follow-up.”",
            "clinicalRationale": "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
            "sourceLabels": [
              "USPSTF AAA screening recommendation (2019)",
              "Society for Vascular Surgery AAA guidance (accessed 2026)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Men age 65 through 75 who have ever smoked should receive one-time abdominal ultrasound screening for AAA. Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach."
  },
  {
    "id": "case.aaa.current-smoker",
    "displayName": "AAA screening visit",
    "patientPresentationVariantId": "presentation.aaa.current-smoker",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 66,
      "sexLabel": "Male"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Aortic screening",
    "presentation": "{patientName} is a 66-year-old man who currently smokes and has never completed abdominal aortic screening. He is asymptomatic, independent, and has no major condition that would preclude elective repair evaluation.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.aaa.current-smoker.male.66",
        "prototypeDemographics": {
          "ageYears": 66,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 66-year-old man who currently smokes and has never completed abdominal aortic screening. He is asymptomatic, independent, and has no major condition that would preclude elective repair evaluation."
      },
      {
        "id": "profile.aaa.current-smoker.male.69",
        "prototypeDemographics": {
          "ageYears": 69,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 69-year-old man who currently smokes and has never completed abdominal aortic screening. He is asymptomatic, independent, and has no major condition that would preclude elective repair evaluation."
      },
      {
        "id": "profile.aaa.current-smoker.male.72",
        "prototypeDemographics": {
          "ageYears": 72,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 72-year-old man who currently smokes and has never completed abdominal aortic screening. He is asymptomatic, independent, and has no major condition that would preclude elective repair evaluation."
      },
      {
        "id": "profile.aaa.current-smoker.male.75",
        "prototypeDemographics": {
          "ageYears": 75,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 75-year-old man who currently smokes and has never completed abdominal aortic screening. He is asymptomatic, independent, and has no major condition that would preclude elective repair evaluation."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "USPSTF AAA screening recommendation (2019)",
      "Society for Vascular Surgery AAA guidance (accessed 2026)"
    ],
    "decisionNodes": [
      {
        "id": "node.aaa.current-smoker.1",
        "questionVariantId": "question.aaa.one-time-ultrasound-screening.v4",
        "primaryConceptId": "concept.aaa.one-time-ultrasound-screening",
        "stem": "Which one-time screening test should {patientName} receive?",
        "answerChoices": [
          {
            "id": "ultrasound_4",
            "label": "Abdominal ultrasound",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.ultrasound"
            }
          },
          {
            "id": "cta_4",
            "label": "CT angiography",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "xray_4",
            "label": "Abdominal radiography",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "echo_4",
            "label": "Transthoracic echocardiography",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Men age 65 through 75 who have ever smoked should receive one-time abdominal ultrasound screening for AAA.",
        "sourceLabels": [
          "USPSTF AAA screening recommendation (2019)",
          "Society for Vascular Surgery AAA guidance (accessed 2026)"
        ],
        "resultGateAfter": {
          "id": "gate.aaa.ultrasound.4",
          "resultTypeId": "service.ultrasound",
          "pendingLabel": "Aortic ultrasound pending",
          "resultNarrative": "Ultrasound shows a 6.0-cm fusiform infrarenal abdominal aortic aneurysm without rupture. The patient remains an acceptable operative-risk candidate.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.ultrasound.outsourced",
            "route.ultrasound.in_house"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.aaa.current-smoker.2",
        "questionVariantId": "question.aaa.six-cm-elective-repair-referral.v4",
        "primaryConceptId": "concept.aaa.six-cm-elective-repair-referral",
        "currentUpdate": "Ultrasound shows a 6.0-cm fusiform infrarenal abdominal aortic aneurysm without rupture. The patient remains an acceptable operative-risk candidate.",
        "stem": "What is the next plan for {patientName}?",
        "answerChoices": [
          {
            "id": "vascular_4",
            "label": "Elective vascular repair evaluation",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "annual_4",
            "label": "Annual ultrasound surveillance",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "emergency_4",
            "label": "Send for emergency rupture exploration",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "no_followup_4",
            "label": "End aneurysm follow-up",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
        "sourceLabels": [
          "USPSTF AAA screening recommendation (2019)",
          "Society for Vascular Surgery AAA guidance (accessed 2026)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "annual_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Annual ultrasound surveillance.”",
            "clinicalRationale": "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
            "sourceLabels": [
              "USPSTF AAA screening recommendation (2019)",
              "Society for Vascular Surgery AAA guidance (accessed 2026)"
            ]
          },
          {
            "answerChoiceId": "emergency_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Send for emergency rupture exploration.”",
            "clinicalRationale": "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
            "sourceLabels": [
              "USPSTF AAA screening recommendation (2019)",
              "Society for Vascular Surgery AAA guidance (accessed 2026)"
            ]
          },
          {
            "answerChoiceId": "no_followup_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “End aneurysm follow-up.”",
            "clinicalRationale": "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
            "sourceLabels": [
              "USPSTF AAA screening recommendation (2019)",
              "Society for Vascular Surgery AAA guidance (accessed 2026)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Men age 65 through 75 who have ever smoked should receive one-time abdominal ultrasound screening for AAA. Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach."
  },
  {
    "id": "case.gs028d.blunt-cardiac-injury.a-steering-wheel-impact",
    "displayName": "Blunt cardiac injury",
    "patientPresentationVariantId": "presentation.gs028d.blunt-cardiac-injury.a-steering-wheel-impact",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 34,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 108,
      "systolicBloodPressureMmHg": 108,
      "diastolicBloodPressureMmHg": 68,
      "temperatureF": 99.1,
      "oxygenSaturationPercent": 97
    },
    "chiefComplaint": "Chest hit steering wheel",
    "presentation": "{patientName}, a 34-year-old woman, arrives at the clinic after a motor-vehicle crash with direct steering-wheel impact to the chest. The patient has anterior chest pain and is stable enough for immediate EMS transfer.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-steering-wheel-impact.female.34",
        "prototypeDemographics": {
          "ageYears": 34,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 34-year-old woman, arrives at the clinic after a motor-vehicle crash with direct steering-wheel impact to the chest. The patient has anterior chest pain and is stable enough for immediate EMS transfer."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-steering-wheel-impact.male.34",
        "prototypeDemographics": {
          "ageYears": 34,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 34-year-old man, arrives at the clinic after a motor-vehicle crash with direct steering-wheel impact to the chest. The patient has anterior chest pain and is stable enough for immediate EMS transfer."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-steering-wheel-impact.female.52",
        "prototypeDemographics": {
          "ageYears": 52,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 52-year-old woman, arrives at the clinic after a motor-vehicle crash with direct steering-wheel impact to the chest. The patient has anterior chest pain and is stable enough for immediate EMS transfer."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-steering-wheel-impact.male.52",
        "prototypeDemographics": {
          "ageYears": 52,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 52-year-old man, arrives at the clinic after a motor-vehicle crash with direct steering-wheel impact to the chest. The patient has anterior chest pain and is stable enough for immediate EMS transfer."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Blunt Cardiac Injury, Screening for",
      "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.blunt-cardiac-injury.a-steering-wheel-impact.1",
        "questionVariantId": "question.blunt-cardiac-injury.ecg-troponin-evaluation.v1",
        "primaryConceptId": "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
        "stem": "Which emergency-department evaluation should the clinic request for possible blunt cardiac injury during transfer handoff?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "ECG plus cardiac troponin",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_1",
            "label": "ECG plus chest radiographs",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_1",
            "label": "Troponin plus chest radiographs",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_1",
            "label": "Echocardiography plus chest CT",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "For a concerning blunt-chest mechanism, the acute hospital evaluation should include both an admission ECG and cardiac troponin.",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “ECG plus chest radiographs.”",
            "clinicalRationale": "For a concerning blunt-chest mechanism, the acute hospital evaluation should include both an admission ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d2_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Troponin plus chest radiographs.”",
            "clinicalRationale": "For a concerning blunt-chest mechanism, the acute hospital evaluation should include both an admission ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d3_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Echocardiography plus chest CT.”",
            "clinicalRationale": "For a concerning blunt-chest mechanism, the acute hospital evaluation should include both an admission ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          }
        ]
      }
    ],
    "learningSummary": "For a concerning blunt-chest mechanism, the acute hospital evaluation should include both an admission ECG and cardiac troponin."
  },
  {
    "id": "case.gs028d.blunt-cardiac-injury.a-sports-chest-impact",
    "displayName": "Blunt cardiac injury",
    "patientPresentationVariantId": "presentation.gs028d.blunt-cardiac-injury.a-sports-chest-impact",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 25,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 108,
      "systolicBloodPressureMmHg": 108,
      "diastolicBloodPressureMmHg": 68,
      "temperatureF": 99.1,
      "oxygenSaturationPercent": 97
    },
    "chiefComplaint": "Hard chest impact",
    "presentation": "{patientName}, a 25-year-old woman, comes to the clinic after a high-force sports collision struck the sternum. Persistent chest discomfort and palpitations prompt urgent transfer to the emergency department.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-sports-chest-impact.female.25",
        "prototypeDemographics": {
          "ageYears": 25,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 25-year-old woman, comes to the clinic after a high-force sports collision struck the sternum. Persistent chest discomfort and palpitations prompt urgent transfer to the emergency department."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-sports-chest-impact.male.25",
        "prototypeDemographics": {
          "ageYears": 25,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 25-year-old man, comes to the clinic after a high-force sports collision struck the sternum. Persistent chest discomfort and palpitations prompt urgent transfer to the emergency department."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-sports-chest-impact.female.41",
        "prototypeDemographics": {
          "ageYears": 41,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 41-year-old woman, comes to the clinic after a high-force sports collision struck the sternum. Persistent chest discomfort and palpitations prompt urgent transfer to the emergency department."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-sports-chest-impact.male.41",
        "prototypeDemographics": {
          "ageYears": 41,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 41-year-old man, comes to the clinic after a high-force sports collision struck the sternum. Persistent chest discomfort and palpitations prompt urgent transfer to the emergency department."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Blunt Cardiac Injury, Screening for",
      "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.blunt-cardiac-injury.a-sports-chest-impact.1",
        "questionVariantId": "question.blunt-cardiac-injury.ecg-troponin-evaluation.v2",
        "primaryConceptId": "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
        "stem": "Which initial test pair should the receiving emergency team obtain to screen this patient for blunt cardiac injury?",
        "answerChoices": [
          {
            "id": "correct_2",
            "label": "ECG and cardiac troponin",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_2",
            "label": "ECG and chest radiographs",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_2",
            "label": "Troponin and chest radiographs",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_2",
            "label": "Echocardiogram and chest CT",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The initial hospital screen for suspected blunt cardiac injury combines ECG with cardiac troponin.",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “ECG and chest radiographs.”",
            "clinicalRationale": "The initial hospital screen for suspected blunt cardiac injury combines ECG with cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d2_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Troponin and chest radiographs.”",
            "clinicalRationale": "The initial hospital screen for suspected blunt cardiac injury combines ECG with cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d3_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Echocardiogram and chest CT.”",
            "clinicalRationale": "The initial hospital screen for suspected blunt cardiac injury combines ECG with cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The initial hospital screen for suspected blunt cardiac injury combines ECG with cardiac troponin."
  },
  {
    "id": "case.gs028d.blunt-cardiac-injury.a-fall-anterior-chest",
    "displayName": "Blunt cardiac injury",
    "patientPresentationVariantId": "presentation.gs028d.blunt-cardiac-injury.a-fall-anterior-chest",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 108,
      "systolicBloodPressureMmHg": 108,
      "diastolicBloodPressureMmHg": 68,
      "temperatureF": 99.1,
      "oxygenSaturationPercent": 97
    },
    "chiefComplaint": "Chest pain after fall",
    "presentation": "{patientName}, a 46-year-old woman, presents after falling onto a rigid object across the anterior chest. New chest discomfort follows the blunt impact, and the clinic calls EMS for hospital evaluation.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-fall-anterior-chest.female.46",
        "prototypeDemographics": {
          "ageYears": 46,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 46-year-old woman, presents after falling onto a rigid object across the anterior chest. New chest discomfort follows the blunt impact, and the clinic calls EMS for hospital evaluation."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-fall-anterior-chest.male.46",
        "prototypeDemographics": {
          "ageYears": 46,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 46-year-old man, presents after falling onto a rigid object across the anterior chest. New chest discomfort follows the blunt impact, and the clinic calls EMS for hospital evaluation."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-fall-anterior-chest.female.63",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 63-year-old woman, presents after falling onto a rigid object across the anterior chest. New chest discomfort follows the blunt impact, and the clinic calls EMS for hospital evaluation."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-fall-anterior-chest.male.63",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 63-year-old man, presents after falling onto a rigid object across the anterior chest. New chest discomfort follows the blunt impact, and the clinic calls EMS for hospital evaluation."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Blunt Cardiac Injury, Screening for",
      "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.blunt-cardiac-injury.a-fall-anterior-chest.1",
        "questionVariantId": "question.blunt-cardiac-injury.ecg-troponin-evaluation.v3",
        "primaryConceptId": "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
        "stem": "Which screening combination should be included in the emergency evaluation for possible blunt cardiac injury?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "ECG with cardiac troponin",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_3",
            "label": "ECG with chest radiographs",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_3",
            "label": "Troponin with chest radiographs",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_3",
            "label": "Echocardiogram with chest CT",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A concerning anterior-chest impact merits emergency evaluation with both ECG and cardiac troponin.",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “ECG with chest radiographs.”",
            "clinicalRationale": "A concerning anterior-chest impact merits emergency evaluation with both ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d2_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Troponin with chest radiographs.”",
            "clinicalRationale": "A concerning anterior-chest impact merits emergency evaluation with both ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d3_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Echocardiogram with chest CT.”",
            "clinicalRationale": "A concerning anterior-chest impact merits emergency evaluation with both ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          }
        ]
      }
    ],
    "learningSummary": "A concerning anterior-chest impact merits emergency evaluation with both ECG and cardiac troponin."
  },
  {
    "id": "case.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact",
    "displayName": "Blunt cardiac injury",
    "patientPresentationVariantId": "presentation.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 28,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 108,
      "systolicBloodPressureMmHg": 108,
      "diastolicBloodPressureMmHg": 68,
      "temperatureF": 99.1,
      "oxygenSaturationPercent": 97
    },
    "chiefComplaint": "Handlebar chest injury",
    "presentation": "{patientName}, a 28-year-old woman, arrives after a bicycle crash drove a handlebar into the central chest. The patient reports chest pain after the direct blow and accepts urgent EMS transport.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact.female.28",
        "prototypeDemographics": {
          "ageYears": 28,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 28-year-old woman, arrives after a bicycle crash drove a handlebar into the central chest. The patient reports chest pain after the direct blow and accepts urgent EMS transport."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact.male.28",
        "prototypeDemographics": {
          "ageYears": 28,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 28-year-old man, arrives after a bicycle crash drove a handlebar into the central chest. The patient reports chest pain after the direct blow and accepts urgent EMS transport."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact.female.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 49-year-old woman, arrives after a bicycle crash drove a handlebar into the central chest. The patient reports chest pain after the direct blow and accepts urgent EMS transport."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact.male.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 108,
          "systolicBloodPressureMmHg": 108,
          "diastolicBloodPressureMmHg": 68,
          "temperatureF": 99.1,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName}, a 49-year-old man, arrives after a bicycle crash drove a handlebar into the central chest. The patient reports chest pain after the direct blow and accepts urgent EMS transport."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Blunt Cardiac Injury, Screening for",
      "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact.1",
        "questionVariantId": "question.blunt-cardiac-injury.ecg-troponin-evaluation.v4",
        "primaryConceptId": "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
        "stem": "Which initial emergency-department testing plan best screens this patient for blunt cardiac injury?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "ECG with cardiac troponin",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_4",
            "label": "ECG with chest radiographs",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_4",
            "label": "Troponin with chest radiographs",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_4",
            "label": "Echocardiogram with chest CT",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Direct blunt chest trauma concerning for BCI should be evaluated in the emergency department with an admission ECG and cardiac troponin.",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “ECG with chest radiographs.”",
            "clinicalRationale": "Direct blunt chest trauma concerning for BCI should be evaluated in the emergency department with an admission ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d2_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Troponin with chest radiographs.”",
            "clinicalRationale": "Direct blunt chest trauma concerning for BCI should be evaluated in the emergency department with an admission ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d3_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Echocardiogram with chest CT.”",
            "clinicalRationale": "Direct blunt chest trauma concerning for BCI should be evaluated in the emergency department with an admission ECG and cardiac troponin.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Direct blunt chest trauma concerning for BCI should be evaluated in the emergency department with an admission ECG and cardiac troponin."
  },
  {
    "id": "case.gs028d.blunt-cardiac-injury.b-new-ecg-change",
    "displayName": "Blunt cardiac injury",
    "patientPresentationVariantId": "presentation.gs028d.blunt-cardiac-injury.b-new-ecg-change",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 37,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Crash record follow-up",
    "presentation": "{patientName}, a 37-year-old woman, returns after a hospital evaluation for blunt chest trauma. The admission ECG showed a new arrhythmia compared with prior records, while the troponin was reported normal.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-new-ecg-change.female.37",
        "prototypeDemographics": {
          "ageYears": 37,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 37-year-old woman, returns after a hospital evaluation for blunt chest trauma. The admission ECG showed a new arrhythmia compared with prior records, while the troponin was reported normal."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-new-ecg-change.male.37",
        "prototypeDemographics": {
          "ageYears": 37,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 37-year-old man, returns after a hospital evaluation for blunt chest trauma. The admission ECG showed a new arrhythmia compared with prior records, while the troponin was reported normal."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-new-ecg-change.female.61",
        "prototypeDemographics": {
          "ageYears": 61,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 61-year-old woman, returns after a hospital evaluation for blunt chest trauma. The admission ECG showed a new arrhythmia compared with prior records, while the troponin was reported normal."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-new-ecg-change.male.61",
        "prototypeDemographics": {
          "ageYears": 61,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 61-year-old man, returns after a hospital evaluation for blunt chest trauma. The admission ECG showed a new arrhythmia compared with prior records, while the troponin was reported normal."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Blunt Cardiac Injury, Screening for",
      "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.blunt-cardiac-injury.b-new-ecg-change.1",
        "questionVariantId": "question.blunt-cardiac-injury.monitored-disposition.v1",
        "primaryConceptId": "concept.blunt-cardiac-injury.monitored-disposition",
        "stem": "Which disposition was appropriate when the new ECG abnormality was identified during this patient's hospital evaluation?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Admission to monitored care",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_1",
            "label": "Admission to unmonitored care",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_1",
            "label": "Discharge with routine follow-up",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_1",
            "label": "Observation in the clinic",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A new ECG abnormality after suspected blunt cardiac injury warrants admission to a monitored hospital setting even when troponin is normal.",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Admission to unmonitored care.”",
            "clinicalRationale": "A new ECG abnormality after suspected blunt cardiac injury warrants admission to a monitored hospital setting even when troponin is normal.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d2_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Discharge with routine follow-up.”",
            "clinicalRationale": "A new ECG abnormality after suspected blunt cardiac injury warrants admission to a monitored hospital setting even when troponin is normal.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d3_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Observation in the clinic.”",
            "clinicalRationale": "A new ECG abnormality after suspected blunt cardiac injury warrants admission to a monitored hospital setting even when troponin is normal.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          }
        ]
      }
    ],
    "learningSummary": "A new ECG abnormality after suspected blunt cardiac injury warrants admission to a monitored hospital setting even when troponin is normal."
  },
  {
    "id": "case.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation",
    "displayName": "Blunt cardiac injury",
    "patientPresentationVariantId": "presentation.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 30,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Trauma results review",
    "presentation": "{patientName}, a 30-year-old woman, reviews records from an emergency evaluation after a direct chest impact. The admission ECG was normal, but cardiac troponin was above that hospital assay's reference range.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation.female.30",
        "prototypeDemographics": {
          "ageYears": 30,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 30-year-old woman, reviews records from an emergency evaluation after a direct chest impact. The admission ECG was normal, but cardiac troponin was above that hospital assay's reference range."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation.male.30",
        "prototypeDemographics": {
          "ageYears": 30,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 30-year-old man, reviews records from an emergency evaluation after a direct chest impact. The admission ECG was normal, but cardiac troponin was above that hospital assay's reference range."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation.female.56",
        "prototypeDemographics": {
          "ageYears": 56,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 56-year-old woman, reviews records from an emergency evaluation after a direct chest impact. The admission ECG was normal, but cardiac troponin was above that hospital assay's reference range."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation.male.56",
        "prototypeDemographics": {
          "ageYears": 56,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 56-year-old man, reviews records from an emergency evaluation after a direct chest impact. The admission ECG was normal, but cardiac troponin was above that hospital assay's reference range."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Blunt Cardiac Injury, Screening for",
      "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation.1",
        "questionVariantId": "question.blunt-cardiac-injury.monitored-disposition.v2",
        "primaryConceptId": "concept.blunt-cardiac-injury.monitored-disposition",
        "stem": "Which disposition was appropriate after this patient's normal ECG but elevated troponin result?",
        "answerChoices": [
          {
            "id": "correct_2",
            "label": "Admission to monitored care",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_2",
            "label": "Admission to unmonitored care",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_2",
            "label": "Discharge with routine follow-up",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_2",
            "label": "Observation in the clinic",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A normal ECG does not complete the rule-out when troponin is elevated; monitored hospital care is appropriate.",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Admission to unmonitored care.”",
            "clinicalRationale": "A normal ECG does not complete the rule-out when troponin is elevated; monitored hospital care is appropriate.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d2_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Discharge with routine follow-up.”",
            "clinicalRationale": "A normal ECG does not complete the rule-out when troponin is elevated; monitored hospital care is appropriate.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d3_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Observation in the clinic.”",
            "clinicalRationale": "A normal ECG does not complete the rule-out when troponin is elevated; monitored hospital care is appropriate.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          }
        ]
      }
    ],
    "learningSummary": "A normal ECG does not complete the rule-out when troponin is elevated; monitored hospital care is appropriate."
  },
  {
    "id": "case.gs028d.blunt-cardiac-injury.b-both-results-abnormal",
    "displayName": "Blunt cardiac injury",
    "patientPresentationVariantId": "presentation.gs028d.blunt-cardiac-injury.b-both-results-abnormal",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Chest trauma follow-up",
    "presentation": "{patientName}, a 43-year-old woman, follows up after blunt chest trauma. The hospital record documents a new conduction abnormality on ECG and an elevated cardiac troponin during the admission evaluation.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-both-results-abnormal.female.43",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 43-year-old woman, follows up after blunt chest trauma. The hospital record documents a new conduction abnormality on ECG and an elevated cardiac troponin during the admission evaluation."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-both-results-abnormal.male.43",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 43-year-old man, follows up after blunt chest trauma. The hospital record documents a new conduction abnormality on ECG and an elevated cardiac troponin during the admission evaluation."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-both-results-abnormal.female.68",
        "prototypeDemographics": {
          "ageYears": 68,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 68-year-old woman, follows up after blunt chest trauma. The hospital record documents a new conduction abnormality on ECG and an elevated cardiac troponin during the admission evaluation."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-both-results-abnormal.male.68",
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
        "presentation": "{patientName}, a 68-year-old man, follows up after blunt chest trauma. The hospital record documents a new conduction abnormality on ECG and an elevated cardiac troponin during the admission evaluation."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Blunt Cardiac Injury, Screening for",
      "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.blunt-cardiac-injury.b-both-results-abnormal.1",
        "questionVariantId": "question.blunt-cardiac-injury.monitored-disposition.v3",
        "primaryConceptId": "concept.blunt-cardiac-injury.monitored-disposition",
        "stem": "Which disposition best matched both abnormal screening results during this patient's hospital encounter?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Admission to monitored care",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_3",
            "label": "Admission to unmonitored care",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_3",
            "label": "Discharge with routine follow-up",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_3",
            "label": "Observation in the clinic",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "New ECG abnormality and elevated troponin after blunt chest trauma support admission to monitored hospital care.",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Admission to unmonitored care.”",
            "clinicalRationale": "New ECG abnormality and elevated troponin after blunt chest trauma support admission to monitored hospital care.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d2_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Discharge with routine follow-up.”",
            "clinicalRationale": "New ECG abnormality and elevated troponin after blunt chest trauma support admission to monitored hospital care.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d3_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Observation in the clinic.”",
            "clinicalRationale": "New ECG abnormality and elevated troponin after blunt chest trauma support admission to monitored hospital care.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          }
        ]
      }
    ],
    "learningSummary": "New ECG abnormality and elevated troponin after blunt chest trauma support admission to monitored hospital care."
  },
  {
    "id": "case.gs028d.blunt-cardiac-injury.b-both-results-normal",
    "displayName": "Blunt cardiac injury",
    "patientPresentationVariantId": "presentation.gs028d.blunt-cardiac-injury.b-both-results-normal",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 33,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Normal trauma results",
    "presentation": "{patientName}, a 33-year-old woman, returns after hospital assessment for a concerning blunt chest impact. The admission ECG and cardiac troponin were both normal, symptoms improved, and no other injury or clinical reason required admission.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-both-results-normal.female.33",
        "prototypeDemographics": {
          "ageYears": 33,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 33-year-old woman, returns after hospital assessment for a concerning blunt chest impact. The admission ECG and cardiac troponin were both normal, symptoms improved, and no other injury or clinical reason required admission."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-both-results-normal.male.33",
        "prototypeDemographics": {
          "ageYears": 33,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 33-year-old man, returns after hospital assessment for a concerning blunt chest impact. The admission ECG and cardiac troponin were both normal, symptoms improved, and no other injury or clinical reason required admission."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-both-results-normal.female.60",
        "prototypeDemographics": {
          "ageYears": 60,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 60-year-old woman, returns after hospital assessment for a concerning blunt chest impact. The admission ECG and cardiac troponin were both normal, symptoms improved, and no other injury or clinical reason required admission."
      },
      {
        "id": "profile.gs028d.blunt-cardiac-injury.b-both-results-normal.male.60",
        "prototypeDemographics": {
          "ageYears": 60,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 60-year-old man, returns after hospital assessment for a concerning blunt chest impact. The admission ECG and cardiac troponin were both normal, symptoms improved, and no other injury or clinical reason required admission."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Blunt Cardiac Injury, Screening for",
      "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.blunt-cardiac-injury.b-both-results-normal.1",
        "questionVariantId": "question.blunt-cardiac-injury.monitored-disposition.v4",
        "primaryConceptId": "concept.blunt-cardiac-injury.monitored-disposition",
        "stem": "Which disposition was supported by this patient's completed blunt-cardiac-injury evaluation?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "Discharge when otherwise safe",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_4",
            "label": "Admission to monitored care",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_4",
            "label": "Admission to unmonitored care",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_4",
            "label": "Observation in the clinic",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Normal ECG and troponin rule out BCI for this pathway, while another injury or clinical concern could still independently require admission.",
        "sourceLabels": [
          "Blunt Cardiac Injury, Screening for",
          "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Admission to monitored care.”",
            "clinicalRationale": "Normal ECG and troponin rule out BCI for this pathway, while another injury or clinical concern could still independently require admission.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d2_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Admission to unmonitored care.”",
            "clinicalRationale": "Normal ECG and troponin rule out BCI for this pathway, while another injury or clinical concern could still independently require admission.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          },
          {
            "answerChoiceId": "d3_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Observation in the clinic.”",
            "clinicalRationale": "Normal ECG and troponin rule out BCI for this pathway, while another injury or clinical concern could still independently require admission.",
            "sourceLabels": [
              "Blunt Cardiac Injury, Screening for",
              "Accuracy of diagnostic tests in cardiac injury after blunt chest trauma: a systematic review and meta-analysis"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Normal ECG and troponin rule out BCI for this pathway, while another injury or clinical concern could still independently require admission."
  }
];
export const PROGRAM_BATCH2_CLAIMS: (Omit<EvidenceClaim,"evidenceCategory"> & {evidenceCategory:EvidenceClaim["evidenceCategory"] | "applied_science"} & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.bci-screen",
    "statement": "Suspected adult blunt cardiac injury requires ECG and troponin I assessment; CK-MB does not replace either component.",
    "sourceIds": [
      "source.trauma-thoracic.east-bci-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single guideline for the exact management rule; no universal assay cutoff or serial schedule.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-bci-2012",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.bci-monitor",
    "statement": "A post-trauma ECG change or elevated troponin I supports cardiac monitoring; baseline ECG comparison matters.",
    "sourceIds": [
      "source.trauma-thoracic.east-bci-2012"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "Single 2012 guideline; an abnormal screen does not identify a particular structural lesion.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-bci-2012",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.bci-selective-imaging",
    "statement": "Routine echocardiography is not the initial screening strategy for every hemodynamically stable blunt-chest-injury patient.",
    "sourceIds": [
      "source.trauma-thoracic.east-bci-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single guideline; elevated biomarkers require monitoring and clinical reassessment, and new symptoms may change the imaging indication.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-bci-2012",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.bci-selected-mri",
    "statement": "Cardiac CT or MRI may help distinguish traumatic cardiac injury from infarction in selected patients after initial evaluation.",
    "sourceIds": [
      "source.trauma-thoracic.east-bci-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Level 3 recommendation; not a substitute for the acute indicated bedside echocardiogram.",
    "applicablePopulation": "Adults in the explicitly described outside-hospital trauma setting.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-bci-2012",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.bci-echo",
    "statement": "Persistent new arrhythmia or hemodynamic instability after blunt chest trauma warrants echocardiography.",
    "sourceIds": [
      "source.trauma-thoracic.east-bci-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single guideline; the related inadequate-TTE claim specifies when TEE follows. No routine TEE for every screened patient.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-bci-2012",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.bci-inadequate-tte",
    "statement": "When echocardiography is indicated after blunt chest trauma but an adequate transthoracic study cannot be obtained, TEE is the supported next modality.",
    "sourceIds": [
      "source.trauma-thoracic.east-bci-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single guideline. No esophageal contraindication or new imaging technology eligibility rule is invented.",
    "applicablePopulation": "Adults in the explicitly described outside-hospital trauma setting.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-bci-2012",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.bci-normal-pair",
    "statement": "Normal ECG and troponin I remove the BCI monitoring indication in the EAST pathway without resolving other admission needs.",
    "sourceIds": [
      "source.trauma-thoracic.east-bci-2012"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "Single guideline; timing remains unsettled and this does not claim perfect universal diagnostic sensitivity.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-bci-2012",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.sternum-boundary",
    "statement": "A sternal fracture does not independently mandate cardiac monitoring when ECG and troponin I are normal.",
    "sourceIds": [
      "source.trauma-thoracic.east-bci-2012"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single guideline; other chest-injury needs remain.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-bci-2012",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.chest-wall-care",
    "statement": "Analgesia, coughing support and respiratory rehabilitation address impaired breathing after traumatic chest-wall injury.",
    "sourceIds": [
      "source.trauma-thoracic.wses-aast-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current guideline; no invented spirometry admission threshold, analgesic regimen or automatic level of care.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.chest-drain-organ-injury",
    "statement": "An inadvertently organ-traversing chest tube should stay in place pending urgent cross-sectional assessment and controlled multidisciplinary management.",
    "sourceIds": [
      "source.trauma-thoracic.wses-aast-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single current guideline. No removal technique, exact vascular procedure, numeric stability threshold or new clinical probability is authored.",
    "applicablePopulation": "Adults in the explicitly described outside-hospital trauma setting.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted primary guidance; case observations constructed."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.hemorrhage-physiology",
    "statement": "Ongoing thoracic hemorrhage with hemodynamic instability warrants operative control even when drain output understates the blood loss.",
    "sourceIds": [
      "source.trauma-thoracic.wses-aast-2025",
      "source.trauma-thoracic.east-pleural-2011"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Current and older society guidance agree that physiology outweighs output alone. Constructed drain observations are not new volume thresholds.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      },
      {
        "sourceId": "source.trauma-thoracic.east-pleural-2011",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.hemostasis-access",
    "statement": "Unstable thoracic vascular bleeding favors open exploration, whereas suitable stable arterial injuries may permit endovascular treatment.",
    "sourceIds": [
      "source.trauma-thoracic.wses-aast-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current guideline; no universal competition between all open/hybrid approaches or unverified device eligibility.",
    "applicablePopulation": "Adults in the explicitly described outside-hospital trauma setting.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.stable-thoracic-surgery",
    "statement": "Thoracoscopy can manage selected residual hemothorax or bleeding in a hemodynamically stable trauma patient.",
    "sourceIds": [
      "source.trauma-thoracic.wses-aast-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single guideline. This does not make VATS the appropriate first access during resuscitation-dependent shock.",
    "applicablePopulation": "Adults in the explicitly described outside-hospital trauma setting.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted current-source verification."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.retained-blood",
    "statement": "Substantial retained traumatic hemothorax after tube drainage favors early VATS over thrombolysis in an operative candidate.",
    "sourceIds": [
      "source.trauma-thoracic.east-retained-hemothorax-2021",
      "source.trauma-thoracic.wses-aast-2025",
      "source.trauma-thoracic.east-pleural-2011"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "EAST conditional, very-low-quality evidence, update in process. Exact early boundary in EAST is at most four days; draft supplies hospital day three without claiming a universal deadline.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-retained-hemothorax-2021",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      },
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      },
      {
        "sourceId": "source.trauma-thoracic.east-pleural-2011",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.retained-complications",
    "statement": "Residual traumatic pleural blood can contribute to empyema and fibrothorax.",
    "sourceIds": [
      "source.trauma-thoracic.east-pleural-2011"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Older guideline used for the general complication relationship; no incidence, deadline or probability authored.",
    "applicablePopulation": "Adults in the explicitly described outside-hospital trauma setting.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.east-pleural-2011",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted current-source verification."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.rib-stabilization",
    "statement": "Persistent respiratory impairment with displaced rib injuries despite multimodal and regional analgesia supports considering rib stabilization.",
    "sourceIds": [
      "source.trauma-thoracic.wses-cwis-ribs-2024",
      "source.trauma-thoracic.wses-aast-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Thresholds in PS 1.2 directly verified; draft uses multiple severely displaced ipsilateral ribs and failed ventilator liberation. Stabilization is a specialist assessment, not a guaranteed outcome.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.wses-cwis-ribs-2024",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      },
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.contusion-not-exclusion",
    "statement": "Pulmonary contusion does not automatically exclude an otherwise appropriate patient from rib stabilization assessment.",
    "sourceIds": [
      "source.trauma-thoracic.wses-cwis-ribs-2024",
      "source.trauma-thoracic.wses-aast-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Individualized surgical assessment remains necessary; the draft does not treat contusion as evidence that fixation is automatically beneficial.",
    "applicablePopulation": "Adults with the specified thoracic injury in outside-hospital records reviewed in clinic.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.wses-cwis-ribs-2024",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      },
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-thoracic.tracheostomy-scope",
    "statement": "Tracheostomy may support prolonged ventilatory care but does not reconstruct displaced ribs.",
    "sourceIds": [
      "source.trauma-thoracic.wses-aast-2025",
      "source.trauma-thoracic.wses-cwis-ribs-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The counterfactual describes treatment purpose, not an exact tracheostomy timing or automatic indication.",
    "applicablePopulation": "Adults in the explicitly described outside-hospital trauma setting.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationBySource": [
      {
        "sourceId": "source.trauma-thoracic.wses-aast-2025",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      },
      {
        "sourceId": "source.trauma-thoracic.wses-cwis-ribs-2024",
        "accessedOn": "2026-11-11",
        "verificationRole": "Targeted verification on 2026-11-11."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.brief.aaa.one-time-ultrasound-screening",
    "statement": "Men age 65 through 75 who have ever smoked should receive one-time abdominal ultrasound screening for abdominal aortic aneurysm.",
    "sourceIds": [
      "source.vascular-aorta.uspstf-screening-2019",
      "source.vascular-aorta.svs-aaa-guidance"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Exact pre-existing atomic statement and stable claim ID retained; source mapping freshly verified. Limited to asymptomatic previously unscreened men; not a diagnostic strategy for symptoms.",
    "applicablePopulation": "Asymptomatic men 65-75 with previous tobacco use and no completed abdominal aortic screen.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.celiac-ending-scan-infrarenal-coverage",
    "statement": "A scan ending near the celiac origin does not assess the infrarenal abdominal aorta.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Underlying aortic segment relationships independently synthesized from the official anatomy/segment definitions; no figure copied.",
    "applicablePopulation": "Interpreting the inferior boundary of a thoracoabdominal acquisition.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.symptomatic-aaa-repair",
    "statement": "Symptoms attributable to an intact AAA warrant repair assessment regardless of usual asymptomatic diameter thresholds.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022",
      "source.vascular-aorta.svs-aaa-guidance"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Pain attribution requires clinical assessment; no universal numeric pain or observation interval is supplied.",
    "applicablePopulation": "Symptomatic intact AAA.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.type-i-origin",
    "statement": "Attachment-site flow into an excluded sac represents a sealing failure.",
    "sourceIds": [
      "source.vascular-aorta.cirse-endoleak-2024"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Type I origin; one directly checked specialty standard.",
    "applicablePopulation": "Post-EVAR sac opacification.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.type-i-prompt-seal-repair",
    "statement": "An established type I endoleak warrants prompt correction of the seal.",
    "sourceIds": [
      "source.vascular-aorta.cirse-endoleak-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Cuff extension requires an available healthy landing segment; complex cases may need other repair. One directly checked publication.",
    "applicablePopulation": "Persistent or late attachment leak.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.stable-type-ii-follow-up",
    "statement": "An isolated type II endoleak with stable sac size can undergo imaging follow-up.",
    "sourceIds": [
      "source.vascular-aorta.cirse-endoleak-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single publication; requires exclusion of higher-pressure leaks and continued surveillance.",
    "applicablePopulation": "Asymptomatic patients with stable post-EVAR sac.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.type-ii-branch-flow",
    "statement": "Retrograde flow from aortic side branches can fill the excluded sac.",
    "sourceIds": [
      "source.vascular-aorta.cirse-endoleak-2024"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Type II physiology; other inflow sources must be assessed.",
    "applicablePopulation": "Post-EVAR branch-associated flow.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.expanding-sac-uncertain-leak",
    "statement": "Sac enlargement with uncertain leak origin requires investigation for occult type I or III inflow.",
    "sourceIds": [
      "source.vascular-aorta.cirse-endoleak-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Catheter angiography with possible cone-beam CT can resolve inconclusive CTA; no disputed growth cutoff is taught.",
    "applicablePopulation": "Enlarging post-EVAR sac.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.ascending-involvement",
    "statement": "Ascending aortic involvement establishes type A dissection even with a distal entry tear.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Classification depends on extent, not simply the tear location.",
    "applicablePopulation": "Aortic dissection extending retrograde.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.type-a-emergency-repair",
    "statement": "Acute type A dissection requires emergency surgical evaluation and immediate repair.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single checked multisociety guideline. This draft does not rank contested mesenteric-first strategies.",
    "applicablePopulation": "Operable acute ascending dissection.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.complicated-type-b-intervention",
    "statement": "Acute type B dissection with organ malperfusion warrants intervention, commonly TEVAR when suitable.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022",
      "source.vascular-aorta.sts-aats-type-b-2022",
      "source.vascular-aorta.cirse-thoracic-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Static branch disease can require adjuncts; no automatic bowel resection or non-aneurysm ischemia objective is included.",
    "applicablePopulation": "Complicated acute type B dissection.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.uncomplicated-type-b-medical",
    "statement": "Uncomplicated acute type B dissection initially receives medical therapy and close monitoring.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022",
      "source.vascular-aorta.sts-aats-type-b-2022",
      "source.vascular-aorta.cirse-thoracic-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "High-risk morphology and later complications can change the plan; does not ban elective later TEVAR.",
    "applicablePopulation": "Acute descending dissection without rupture or malperfusion.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.beta-blockade-before-vasodilation",
    "statement": "Use intravenous beta blockade first, adding intravenous vasodilation if pressure remains high.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single directly checked recommendation; contraindications can favor a non-dihydropyridine calcium-channel blocker. No dose or numeric target is authored.",
    "applicablePopulation": "Hypertensive acute aortic syndrome without beta-blocker contraindication.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.acute-aortic-syndrome-heart-rate-target",
    "statement": "Acute aortic-syndrome therapy generally targets a heart rate of 60-80 beats per minute while maintaining organ perfusion.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single checked guideline; individual perfusion and contraindications govern treatment. No dose is taught.",
    "applicablePopulation": "Monitored hospital treatment of acute aortic syndrome.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.nicardipine-intravenous-antihypertensive",
    "statement": "Intravenous nicardipine is an antihypertensive vasodilator that can be combined with beta blockade under monitoring.",
    "sourceIds": [
      "source.vascular-aorta.dailymed-nicardipine-2026",
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The regulatory label verifies pharmacology; ACC/AHA establishes adding vasodilation after initial beta blockade when pressure remains uncontrolled. No dose or infusion-rate rule is authored.",
    "applicablePopulation": "Hospital blood-pressure treatment after initial impulse control.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.non-dihydropyridine-rate-control-alternative",
    "statement": "An intravenous non-dihydropyridine calcium-channel blocker is a reasonable acute aortic-syndrome rate-control alternative when beta blockers are contraindicated or not tolerated.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single checked guideline. This is a rate-control alternative, not evidence that switching from tolerated beta blockade is preferred for persistent pressure elevation after rate control.",
    "applicablePopulation": "Acute aortic syndrome with a beta-blocker contraindication or intolerance.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.lsa-dependent-coronary-protection",
    "statement": "Planned left-subclavian coverage should account for a patent LIMA coronary graft by preserving its inflow.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022",
      "source.vascular-aorta.sts-aats-type-b-2022",
      "source.vascular-aorta.cirse-thoracic-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Elective setting with native landing zones; bypass versus transposition depends on anatomy.",
    "applicablePopulation": "TEVAR involving LSA with LIMA-dependent myocardium.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.lsa-transposition-proximal-clamp",
    "statement": "Carotid-subclavian transposition requires temporary proximal subclavian clamping.",
    "sourceIds": [
      "source.vascular-aorta.sts-aats-type-b-2022"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Single directly checked guideline; the anatomy-specific interruption matters for a pedicled LIMA.",
    "applicablePopulation": "Open subclavian transposition.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.pedicled-lima-avoid-transposition",
    "statement": "A patent pedicled LIMA coronary graft favors bypass over subclavian transposition to avoid interrupting coronary inflow.",
    "sourceIds": [
      "source.vascular-aorta.sts-aats-type-b-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single directly checked guideline, section on LSA revascularization; other bypass/endovascular configurations remain specialist decisions.",
    "applicablePopulation": "LSA revascularization with a patent pedicled LIMA.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.post-tevar-cord-rescue",
    "statement": "New spinal-cord dysfunction after TEVAR calls for perfusion rescue, including pressure support and CSF drainage assessment.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022",
      "source.vascular-aorta.cirse-thoracic-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Rapid specialist response; drainage contraindications must be checked. No invented target, timing, guaranteed recovery or routine prophylactic drain rule.",
    "applicablePopulation": "Post-TEVAR neurologic deficit.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.small-paa-embolism-repair",
    "statement": "A small PAA with thrombus and distal embolic findings merits repair consideration despite being below 20 mm.",
    "sourceIds": [
      "source.vascular-aorta.svs-popliteal-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single guideline, weak recommendation/low-quality evidence; excludes acutely threatened limbs requiring an ischemia-specific pathway.",
    "applicablePopulation": "PAA under 20 mm with embolic findings.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.paa-associated-aneurysm-screen",
    "statement": "Finding a PAA warrants screening the opposite popliteal artery and abdominal aorta.",
    "sourceIds": [
      "source.vascular-aorta.svs-popliteal-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single guideline, strong recommendation/moderate evidence; this is aneurysm screening, not broad asymptomatic arterial-stenosis screening.",
    "applicablePopulation": "Patients with a diagnosed PAA.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.marfan-taaa-open-repair",
    "statement": "Open repair is preferred for an intact TAAA requiring repair in Marfan syndrome.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single directly checked guideline; does not preclude endovascular rescue or exceptional high-risk situations. Newer ESVS full text was inaccessible.",
    "applicablePopulation": "Fit patient with heritable native-aorta TAAA.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-aorta.graft-infection-evaluation",
    "statement": "Unexplained infection or gastrointestinal bleeding after aortic grafting warrants cross-sectional graft evaluation.",
    "sourceIds": [
      "source.vascular-aorta.acc-aha-aortic-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single guideline; imaging and cultures are interpreted together, and an unrevealing endoscopy does not assess the graft.",
    "applicablePopulation": "Prosthetic aortic graft with unexplained infection/bleeding.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.multiphasic-diagnosis",
    "statement": "In an at-risk cirrhotic liver, a new solid lesion larger than 1 cm is characterized using dedicated multiphasic contrast CT or MRI.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One adequate newly retrieved publication supports this fact; no independent direct corroboration is claimed.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.persistently-indeterminate-tissue",
    "statement": "A suspicious lesion remaining uncharacterized after adequate dynamic imaging may require biopsy to establish tumor type before treatment.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Supports persistent indeterminacy here, not routine biopsy of every lesion or of classic HCC imaging.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.subcentimeter-surveillance",
    "statement": "A subcentimeter nodule detected during HCC surveillance can follow close imaging surveillance rather than the immediate diagnostic pathway used for a larger solid lesion.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No exact surveillance interval is taught. Applies to the stated at-risk surveillance setting, without another supplied concerning finding.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.aasld-characteristic-imaging",
    "statement": "In cirrhosis, a lesion at least 2 cm with nonrim arterial hyperenhancement and nonperipheral washout can satisfy an imaging diagnosis of HCC.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Applies to adequate multiphasic examinations in the appropriate at-risk population; no imaging diagnosis for an arbitrary noncirrhotic mass.",
    "applicablePopulation": "Adults undergoing multidisciplinary liver-tumor evaluation and major-hepatectomy planning.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.aasld-non-hcc-malignant-pattern",
    "statement": "A malignant-appearing liver observation with rim arterial enhancement in an at-risk liver requires tissue classification because it is not specific for HCC.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "AASLD recommends biopsy for LR-M observations; this is not a universal preoperative-biopsy rule for every suspected resectable cholangiocarcinoma.",
    "applicablePopulation": "Adults undergoing multidisciplinary liver-tumor evaluation and major-hepatectomy planning.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.aasld-biopsy-scope",
    "statement": "Biopsy is not routinely required solely to establish the diagnosis of an imaging-characteristic HCC, although an independent tissue or molecular indication may justify sampling.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Multidisciplinary decisions can favor tissue even for LR-5 observations. The minimum-required-sampling task excludes a trial or separate molecular-tissue indication.",
    "applicablePopulation": "Adults undergoing multidisciplinary liver-tumor evaluation and major-hepatectomy planning.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.favorable-hcc-resection",
    "statement": "Solitary localized HCC with preserved hepatic reserve and no clinically significant portal hypertension supports specialist resection assessment when remnant and anatomy are favorable.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "Cross-check of the existing favorable-profile claim. Portal hypertension is not asserted to prohibit every limited resection.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.functional-remnant",
    "statement": "A hepatic resection plan must preserve sufficient functioning liver with arterial and portal inflow, hepatic venous outflow and biliary drainage.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025",
      "source.question-topic.liver-malignancy.collision-consensus.2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Apply to the stated anatomy and care phase; patient-specific ranking requires clinical review.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.hcc-ablation-size",
    "statement": "Thermal ablation provides more reliable local control for small HCC than for progressively larger lesions.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Qualitative size-related suitability only; no universal procedure ranking or exact probability is taught.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.addcd31f93bb",
    "statement": "For the approved profile of a solitary HCC with preserved liver function, no clinically significant portal hypertension, adequate future liver remnant, and no macrovascular invasion or extrahepatic disease, hospital HPB-surgery referral for hepatic resection evaluation is the selected disposition.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This is a deliberately favorable multiparametric profile, not a universal treatment rule for every solitary HCC or every person with Child-Pugh A cirrhosis. EASL 2025 metadata was not locally verifiable, so this package records the single-source limitation rather than inventing a second citation. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults represented by the owner-approved compensated-cirrhosis profiles in this package.",
    "lastCheckedOn": "2026-08-21",
    "localMappingCheckedOn": "2026-11-11",
    "historicalClaimContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "historicalLastCheckedOn": "2026-08-21"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.bf9e72bc7198",
    "statement": "Clinically significant portal hypertension is one selection consideration in the approved favorable resection profile.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "This package does not teach clinically significant portal hypertension as an absolute contraindication to every limited hepatic resection, nor does it make preserved liver function alone sufficient for selection. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Learners applying only the clear favorable-profile boundary in the approved cases.",
    "lastCheckedOn": "2026-08-21",
    "localMappingCheckedOn": "2026-11-11",
    "historicalClaimContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "historicalLastCheckedOn": "2026-08-21"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.early-hcc-decompensation-transplant",
    "statement": "Limited HCC burden with decompensated cirrhosis supports transplant-center assessment rather than assuming a routine favorable resection pathway.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "Assessment is not guaranteed listing; one retrieved government summary directly corroborates the historical local decision.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.a2f96b40428e",
    "statement": "Meeting standard Milan criteria supports transplant-center evaluation but does not by itself guarantee listing or transplantation; disease outside Milan criteria may still warrant specialist evaluation of other pathways.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023",
      "source.aasld-ast.liver-transplant-candidate-evaluation.2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "This concept intentionally excludes AFP policy, downstaging selection, organ allocation, liver function, comorbid contraindications, and individualized treatment choice. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Learners applying standard Milan criteria without equating a tumor-burden classification with automatic listing or permanent exclusion.",
    "lastCheckedOn": "2026-08-06",
    "localMappingCheckedOn": "2026-11-11",
    "historicalClaimContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "historicalLastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.hcc-arterial-portal-perfusion",
    "statement": "HCC commonly draws substantial arterial flow while surrounding liver depends importantly on portal flow; arterial embolization with major portal obstruction can endanger hepatic function.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "applied_science",
    "certainty": "moderate",
    "limitation": "NCI identifies portal-vein thrombosis as a relative TAE/TACE contraindication. This is not an absolute ban on every specialist-directed locoregional technique.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.advanced-hcc-systemic-assessment",
    "statement": "Advanced HCC outside a suitable locoregional pathway warrants medical-oncology assessment for systemic treatment when hepatic function and general condition permit.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "No named systemic regimen, dose or first-line ranking is keyed. Current primary updates need targeted verification before such details are added.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.e0b6bc7a19dc",
    "statement": "Standard Milan classification requires no macrovascular invasion and no extrahepatic disease.",
    "sourceIds": [
      "source.aasld-ast.liver-transplant-candidate-evaluation.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Microscopic pathology, transplant-center assessment, tumor biology, and other candidacy factors are outside this narrow recognition concept. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with confirmed hepatocellular carcinoma whose staging is being compared with standard Milan criteria.",
    "lastCheckedOn": "2026-08-06",
    "localMappingCheckedOn": "2026-11-11",
    "historicalClaimContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "historicalLastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.question-topic.liver-malignancy.nonmetastatic-hcc-arterial-pathway",
    "statement": "TACE can be considered for nonmetastatic HCC unsuitable for surgery or ablation when hepatic perfusion and reserve permit.",
    "sourceIds": [
      "source.question-topic.liver-malignancy.nci-hcc.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Not a universal treatment hierarchy, a fixed tumor cutoff or an assertion that all portal obstruction permits routine TACE.",
    "applicablePopulation": "Adults undergoing specialist assessment of hepatic malignancy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.cancer-neoadjuvant",
    "statement": "Borderline pancreatic cancer commonly requires neoadjuvant systemic treatment and restaging rather than immediate surgery.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.pancreatic-cancer-consensus-2020",
      "source.pancreas-chronic-cysts-neoplasia.nci-pancreas-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Venous reconstructibility and local criteria require expert review. No universal neoadjuvant rule for clearly resectable disease is scored.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.cancer-reconstructible-vein",
    "statement": "Reconstructible portal/mesenteric venous involvement need not make pancreatic cancer permanently unresectable.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.pancreatic-cancer-consensus-2020",
      "source.pancreas-chronic-cysts-neoplasia.nci-pancreas-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Independently synthesized guideline fact; exact application remains subject to named clinical review.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.cancer-metastatic-boundary",
    "statement": "Distant metastatic pancreatic adenocarcinoma ordinarily calls for systemic treatment rather than curative pancreatic resection.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.pancreatic-cancer-consensus-2020",
      "source.pancreas-chronic-cysts-neoplasia.nci-pancreas-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Exceptional oligometastatic research strategies are not a routine resection indication.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.cancer-biliary-drainage",
    "statement": "Obstructive jaundice before neoadjuvant therapy is an indication for biliary drainage; endoscopic covered metal stenting is preferred to plastic stenting in the verified consensus.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.pancreatic-cancer-consensus-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single directly verified ranking; no duration, bilirubin cutoff or metal-stent subtype superiority beyond that guidance is invented.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.r2.biliary-metal-patency",
    "statement": "During pancreatic-cancer neoadjuvant therapy, metal biliary stents have lower recurrent obstruction and reintervention rates than plastic stents in comparative pooled evidence.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.biliary-metal-plastic-2023",
      "source.pancreas-chronic-cysts-neoplasia.pancreatic-cancer-consensus-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Heterogeneous comparative studies; no numerical effect, bilirubin cutoff, fixed chemotherapy interval, universal metal-design preference or guaranteed freedom from obstruction is inferred.",
    "applicablePopulation": "Only the stated adult clinic consultation and proposed specialist investigations; no acute hypoglycemia rescue or MEN1 operative-extent algorithm is tested.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.postop-infected-collection",
    "statement": "A pancreatic postoperative infected collection often requires antibiotics and effective interventional drainage.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.postoperative-complications-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single verified review; source-control approach depends on anatomy and stability. No invented antibiotic regimen.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.postop-stepup",
    "statement": "Reoperation or completion pancreatectomy is generally reserved for failure of conservative/interventional treatment or a complication that requires surgery.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.postoperative-complications-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single verified review. Preserve instability, peritonitis and failed-access boundaries.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.serous-compression",
    "statement": "A convincingly serous cyst causing adjacent-organ compression can warrant resection despite its usually benign behavior.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.sirm-aisp-cysts-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single directly verified current position paper; asymptomatic size alone does not establish this indication.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.serous-phenotype",
    "statement": "A microcystic pancreatic lesion with a central scar supports a serous-cyst phenotype.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.sirm-aisp-cysts-2026",
      "source.pancreas-chronic-cysts-neoplasia.acg-cysts-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Imaging is suggestive rather than definitive histology; atypical lesions need further characterization.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.cyst-imaging-limits",
    "statement": "Imaging suggests cyst subtype but cannot establish histology or exclude malignancy.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.acg-cysts-2018",
      "source.pancreas-chronic-cysts-neoplasia.sirm-aisp-cysts-2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Independently synthesized guideline fact; exact application remains subject to named clinical review.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.ipmn-remnant",
    "statement": "Pancreatic-remnant surveillance remains indicated after IPMN resection, including noninvasive disease.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.acg-cysts-2018",
      "source.pancreas-chronic-cysts-neoplasia.sirm-aisp-cysts-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Independently synthesized guideline fact; exact application remains subject to named clinical review.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.ipmn-low-grade-margin",
    "statement": "Low-grade dysplasia at an IPMN resection margin does not by itself require completion pancreatectomy.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.kyoto-ipmn-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single targeted international guideline; surveillance and individual cancer risk still matter. Exact margin question checked against European 2018 historical guidance, which is not used as a new reusable corpus.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pancreas-chronic-cysts-neoplasia.mcn-noninvasive-after-resection",
    "statement": "A completely resected MCN without associated pancreatic cancer does not require postoperative cyst surveillance under ACG guidance.",
    "sourceIds": [
      "source.pancreas-chronic-cysts-neoplasia.acg-cysts-2018",
      "source.pancreas-chronic-cysts-neoplasia.sirm-aisp-cysts-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This applies to confirmed completely resected noninvasive MCN, not presumed imaging-only MCN or IPMN.",
    "applicablePopulation": "Adults in the stated pancreatic clinic or outside-hospital chart-review scenario; no extrapolation to all pancreatic lesions.",
    "lastCheckedOn": "2026-11-11"
  }
];
export const PROGRAM_BATCH2_SOURCES: (ClinicalSource & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-thoracic.east-bci-2012",
    "title": "Blunt Cardiac Injury, Screening for",
    "completeCitation": "Clancy K, Velopulos C, Bilaniuk JW, et al. Screening for blunt cardiac injury: an Eastern Association for the Surgery of Trauma practice management guideline. J Trauma Acute Care Surg. 2012;73(5 Suppl 4):S301-S306.",
    "organizationOrJournal": "EAST; Journal of Trauma and Acute Care Surgery",
    "authors": [
      "Keith Clancy",
      "Catherine Velopulos",
      "Jaroslaw W. Bilaniuk",
      "Bryan Collier",
      "William Crowley",
      "Stanley Kurek",
      "Felix Lui",
      "Donna Nayduch",
      "Ayodele Sangosanya",
      "Brian Tucker",
      "Elliott R. Haut"
    ],
    "publicationYear": 2012,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/blunt-cardiac-injury%2C-screening-for",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright reserved; society-hosted targeted verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and original short fact synthesis only. No source prose, figures, tables, algorithms, full text or protected examples are stored or adapted.",
    "authorityAssessment": "Adult BCI screening guideline still listed by EAST; old evidence and uncertain assay/serial timing require narrow scope.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.trauma-thoracic.bci-screen",
      "claim.trauma-thoracic.bci-monitor",
      "claim.trauma-thoracic.bci-echo",
      "claim.trauma-thoracic.bci-selective-imaging",
      "claim.trauma-thoracic.bci-normal-pair",
      "claim.trauma-thoracic.sternum-boundary",
      "claim.trauma-thoracic.bci-inadequate-tte",
      "claim.trauma-thoracic.bci-selected-mri"
    ],
    "accessMethod": "Targeted public HTML reading through web search/open; not a corpus download.",
    "verificationSections": [
      "Recommendations Levels 1?3",
      "Echocardiogram",
      "Future Investigation"
    ],
    "termsUrl": "https://www.east.org/terms-of-use",
    "rightsCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-thoracic.wses-aast-2025",
    "title": "Thoracic trauma WSES-AAST guidelines",
    "completeCitation": "Coccolini F, Cremonini C, Moore EE, et al. Thoracic trauma WSES-AAST guidelines. World J Emerg Surg. 2025;20:78. doi:10.1186/s13017-025-00651-1.",
    "organizationOrJournal": "WSES; AAST; World Journal of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Camilla Cremonini",
      "Ernest E. Moore",
      "et al."
    ],
    "publicationYear": 2025,
    "doi": "10.1186/s13017-025-00651-1",
    "pmid": "41094688",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12522690/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International; not treated as permission to adapt",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and original short fact synthesis only. No source prose, figures, tables, algorithms, full text or protected examples are stored or adapted.",
    "authorityAssessment": "Multidisciplinary 2025 thoracic guideline. Recommendation strength and evidence quality vary; not a mandate overriding newer topic-specific guidance.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.trauma-thoracic.chest-wall-care",
      "claim.trauma-thoracic.planned-exposure",
      "claim.trauma-thoracic.small-pneumothorax",
      "claim.trauma-thoracic.tension-pneumothorax",
      "claim.trauma-thoracic.airway-diagnosis",
      "claim.trauma-thoracic.airway-repair",
      "claim.trauma-thoracic.hemorrhage-physiology",
      "claim.trauma-thoracic.retained-blood",
      "claim.trauma-thoracic.vascular-cta",
      "claim.trauma-thoracic.aorta-grade3",
      "claim.trauma-thoracic.esophageal-endoscopy",
      "claim.trauma-thoracic.left-diaphragm",
      "claim.trauma-thoracic.rib-stabilization",
      "claim.trauma-thoracic.rib-instability",
      "claim.trauma-thoracic.contusion-not-exclusion",
      "claim.trauma-thoracic.airway-conservative-boundary",
      "claim.trauma-thoracic.hemostasis-access",
      "claim.trauma-thoracic.tracheostomy-scope",
      "claim.trauma-thoracic.disagreement-aorta-grade2",
      "claim.trauma-thoracic.disagreement-right-diaphragm",
      "claim.trauma-thoracic.disagreement-occult-ppv",
      "claim.trauma-thoracic.pleural-drainage",
      "claim.trauma-thoracic.stable-thoracic-surgery",
      "claim.trauma-thoracic.chest-drain-organ-injury"
    ],
    "accessMethod": "Targeted public HTML reading through web search/open; not a corpus download.",
    "verificationSections": [
      "Diagnosis",
      "Pleural injuries",
      "Airways",
      "Vascular",
      "Thoracic wall injuries"
    ],
    "termsUrl": "https://pmc.ncbi.nlm.nih.gov/about/copyright/",
    "rightsCheckedOn": "2026-11-11",
    "licenseUrl": "https://creativecommons.org/licenses/by-nc-nd/4.0/"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-thoracic.east-pleural-2011",
    "title": "Hemothorax and Occult Pneumothorax, Management of",
    "completeCitation": "Mowery NT, Gunter OL, Collier BR, Diaz JJ Jr, Haut E, Hildreth A, Holevar M, Mayberry J, Streib E. Practice management guidelines for management of hemothorax and occult pneumothorax. J Trauma. 2011;70(2):510-518.",
    "organizationOrJournal": "EAST; Journal of Trauma",
    "authors": [
      "Nathan T. Mowery",
      "Oliver L. Gunter",
      "Bryan R. Collier",
      "Jose J. Diaz Jr",
      "Elliott Haut",
      "Amy Hildreth",
      "Michelle Holevar",
      "John Mayberry",
      "Erik Streib"
    ],
    "publicationYear": 2011,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/hemothorax-and-occult-pneumothorax%2C-management-of",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright reserved; society-hosted targeted verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Only targeted underlying facts and bibliographic metadata; no source expression, tables or figures reproduced.",
    "authorityAssessment": "Older society guideline; used for retained-blood cross-check and to expose, not silently settle, the stable-PPV occult-pneumothorax disagreement.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.trauma-thoracic.hemorrhage-physiology",
      "claim.trauma-thoracic.retained-blood",
      "claim.trauma-thoracic.disagreement-occult-ppv",
      "claim.trauma-thoracic.retained-complications"
    ],
    "accessMethod": "Targeted public guideline HTML reading",
    "verificationSections": [
      "Recommendations: physiology and retained hemothorax",
      "Management of occult pneumothorax"
    ],
    "termsUrl": "https://www.east.org/terms-of-use",
    "rightsCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-thoracic.east-retained-hemothorax-2021",
    "title": "Management of simple and retained hemothorax",
    "completeCitation": "Patel NJ, Dultz L, Ladhani HA, et al. Management of simple and retained hemothorax: a practice management guideline from the Eastern Association for the Surgery of Trauma. Am J Surg. 2021;221(5):873-884. doi:10.1016/j.amjsurg.2020.11.032.",
    "organizationOrJournal": "EAST; American Journal of Surgery",
    "authors": [
      "Nimitt J. Patel",
      "Linda Dultz",
      "Husayn A. Ladhani",
      "Daniel C. Cullinane",
      "et al."
    ],
    "publicationYear": 2021,
    "doi": "10.1016/j.amjsurg.2020.11.032",
    "pmid": "33487403",
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/management-of-simple-and-retained-hemothorax-a-practice-management-guideline-from-the-eastern-associ",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright reserved; society-hosted guideline for targeted facts",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and original short fact synthesis only. No source prose, figures, tables, algorithms, full text or protected examples are stored or adapted.",
    "authorityAssessment": "GRADE conditional recommendation based on mostly retrospective very-low-quality evidence; EAST marks an update in process.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.trauma-thoracic.retained-blood"
    ],
    "accessMethod": "EAST citation/status page and AAST-hosted guideline PDF read through web tool for the conclusion only; PDF not saved.",
    "verificationSections": [
      "Conclusion: VATS versus thrombolytic therapy and early versus late VATS"
    ],
    "termsUrl": "https://www.east.org/terms-of-use",
    "rightsCheckedOn": "2026-11-11",
    "verificationUrl": "https://www.aast.org/static/effa81ff-76ac-46dc-8ad6019e6dac3791/T6-PatelManagement-of-Hemothorax-PMGAJS-2021.pdf"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-thoracic.wses-cwis-ribs-2024",
    "title": "Surgical stabilization of rib fractures (SSRF): the WSES and CWIS position paper",
    "completeCitation": "Sermonesi G, Bertelli R, Pieracci FM, et al. Surgical stabilization of rib fractures (SSRF): the WSES and CWIS position paper. World J Emerg Surg. 2024;19:33. doi:10.1186/s13017-024-00559-2. Correction: 2025;20:8, doi:10.1186/s13017-024-00568-1.",
    "organizationOrJournal": "WSES; CWIS; World Journal of Emergency Surgery",
    "authors": [
      "Giacomo Sermonesi",
      "Riccardo Bertelli",
      "Fredric M. Pieracci",
      "Zsolt J. Balogh",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1186/s13017-024-00559-2",
    "pmid": "39425134",
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-024-00559-2",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International; not treated as permission to adapt",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and original short fact synthesis only. No source prose, figures, tables, algorithms, full text or protected examples are stored or adapted.",
    "authorityAssessment": "Position statements synthesize heterogeneous evidence; an SSRF consideration is not an automatic operation. 2025 correction changes an author affiliation, not recommendations.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.trauma-thoracic.rib-stabilization",
      "claim.trauma-thoracic.rib-instability",
      "claim.trauma-thoracic.contusion-not-exclusion",
      "claim.trauma-thoracic.tracheostomy-scope"
    ],
    "accessMethod": "Targeted public HTML reading through web search/open; not a corpus download.",
    "verificationSections": [
      "PS 1.1?1.2 indications",
      "PS 2.1 instability",
      "PS 2.8 contusion",
      "2025 correction notice"
    ],
    "termsUrl": "https://link.springer.com/termsandconditions",
    "rightsCheckedOn": "2026-11-11",
    "licenseUrl": "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    "correctionUrl": "https://link.springer.com/article/10.1186/s13017-024-00568-1"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-aorta.uspstf-screening-2019",
    "title": "Abdominal Aortic Aneurysm: Screening",
    "completeCitation": "US Preventive Services Task Force. Abdominal Aortic Aneurysm: Screening. Final Recommendation Statement. December 10, 2019.",
    "organizationOrJournal": "US Preventive Services Task Force",
    "authors": [
      "US Preventive Services Task Force"
    ],
    "publicationYear": 2019,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/abdominal-aortic-aneurysm-screening",
    "accessedOn": "2026-11-11",
    "sourceClass": "government_guidance",
    "licenseLabel": "Federal recommendation; USPSTF copyright/reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Copyright notice checked: do not reproduce, sell or imply agency endorsement. Only underlying screening facts are independently synthesized. No copied/adapted USPSTF material or marks; AHRQ/HHS neither endorse this packet nor accept liability for its content. This is not a blanket public-domain assertion.",
    "authorityAssessment": "Federal evidence-based preventive recommendation for asymptomatic adults. The selected male ever-smoker population is directly supported; recommendations for women differ from SVS and are not generalized here.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.brief.aaa.one-time-ultrasound-screening"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-aorta.svs-aaa-guidance",
    "title": "Patients with Abdominal Aortic Aneurysm (AAA)",
    "completeCitation": "Society for Vascular Surgery. Patients with Abdominal Aortic Aneurysm (AAA). Referring-physician guideline summary. Undated; accessed November 11, 2026.",
    "organizationOrJournal": "Society for Vascular Surgery",
    "authors": [
      "Society for Vascular Surgery"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://vascular.org/node/87",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Society for Vascular Surgery",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyrighted society guidance; targeted factual verification and bibliographic attribution only. No source prose, table, figure, algorithm or excerpt retained. Copyright is separate from medical authority. No affirmative AI licence is asserted. SVS Website Policies, Rules and Regulations checked at https://vascular.org/about/policies/website; reproduction permission is limited to personal use. This packet reproduces no SVS expression. No automated/AI prohibition was found in that policy.",
    "authorityAssessment": "Professional guideline summary supporting ultrasound, outer-wall orthogonal CT measurements, surveillance, size/symptom repair boundaries and follow-up. It is not newly published full guidance. Differences from ACC/AHA surveillance in women are explicitly scoped out of the male surveillance item.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.brief.aaa.one-time-ultrasound-screening",
      "claim.brief.aaa.six-cm-elective-repair-referral",
      "claim.vascular-aorta.full-sac-diameter",
      "claim.vascular-aorta.comparable-measurements",
      "claim.vascular-aorta.male-small-aaa-surveillance",
      "claim.vascular-aorta.small-aaa-three-year-surveillance",
      "claim.vascular-aorta.female-aaa-repair-evaluation",
      "claim.vascular-aorta.symptomatic-aaa-repair",
      "claim.vascular-aorta.female-aaa-recommendation-strength"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-aorta.acc-aha-aortic-2022",
    "title": "2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease",
    "completeCitation": "Isselbacher EM, Preventza O, Black JH III, et al. 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease. Circulation. 2022;146:e334-e482. doi:10.1161/CIR.0000000000001106. Official AHA/ACC recommendation slide set used for targeted checks.",
    "organizationOrJournal": "American Heart Association / American College of Cardiology; Circulation",
    "authors": [
      "Eric M. Isselbacher",
      "Ourania Preventza",
      "James Hamilton Black III",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1161/CIR.0000000000001106",
    "pmid": null,
    "officialUrl": "https://professional.heart.org/en/-/media/PHD-Files-2/Science-News/2/2022/2022-Aortic-Disease-Guideline-Slide-Set.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright AHA/ACC; official slide set",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyrighted society guidance; targeted factual verification and bibliographic attribution only. No source prose, table, figure, algorithm or excerpt retained. Copyright is separate from medical authority. No affirmative AI licence is asserted. AHA Copyright Notice and Terms of Service (April 2024) checked. No automated/AI prohibition was found; reproduction requires permission and none is undertaken. Slides and parent article are one publication, not independent evidence.",
    "authorityAssessment": "Multisociety graded recommendations. Targeted sections: measurements; AAA surveillance/repair; hypogastric preservation; rupture; acute dissection; TAAA in heritable disease; spinal-cord rescue; prosthetic graft infection. This is not asserted to be the newest European guideline.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.brief.aaa.six-cm-elective-repair-referral",
      "claim.vascular-aorta.comparable-measurements",
      "claim.vascular-aorta.male-small-aaa-surveillance",
      "claim.vascular-aorta.small-aaa-three-year-surveillance",
      "claim.vascular-aorta.near-threshold-six-month-surveillance",
      "claim.vascular-aorta.female-small-aaa-annual-surveillance",
      "claim.vascular-aorta.female-aaa-repair-evaluation",
      "claim.vascular-aorta.symptomatic-aaa-repair",
      "claim.vascular-aorta.preserve-pelvic-inflow",
      "claim.vascular-aorta.stable-rupture-ct",
      "claim.vascular-aorta.rupture-anatomy-evar",
      "claim.vascular-aorta.ascending-involvement",
      "claim.vascular-aorta.type-a-emergency-repair",
      "claim.vascular-aorta.uncomplicated-type-b-medical",
      "claim.vascular-aorta.beta-blockade-before-vasodilation",
      "claim.vascular-aorta.complicated-type-b-intervention",
      "claim.vascular-aorta.lsa-dependent-coronary-protection",
      "claim.vascular-aorta.post-tevar-cord-rescue",
      "claim.vascular-aorta.graft-infection-evaluation",
      "claim.vascular-aorta.graft-infection-operative-source-control",
      "claim.vascular-aorta.marfan-taaa-open-repair",
      "claim.vascular-aorta.celiac-ending-scan-infrarenal-coverage",
      "claim.vascular-aorta.verified-aaa-growth-six-months",
      "claim.vascular-aorta.inadequate-ultrasound-cross-sectional-surveillance",
      "claim.vascular-aorta.acute-aortic-syndrome-heart-rate-target",
      "claim.vascular-aorta.nicardipine-intravenous-antihypertensive",
      "claim.vascular-aorta.female-aaa-recommendation-strength",
      "claim.vascular-aorta.non-dihydropyridine-rate-control-alternative"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-aorta.cirse-endoleak-2024",
    "title": "CIRSE Standards of Practice on Management of Endoleaks Following Endovascular Aneurysm Repair",
    "completeCitation": "Chun JY, de Haan M, Maleux G, Osman A, Cannavale A, Morgan R. CIRSE Standards of Practice on Management of Endoleaks Following Endovascular Aneurysm Repair. Cardiovasc Intervent Radiol. 2024;47:161-176. doi:10.1007/s00270-023-03629-1.",
    "organizationOrJournal": "Cardiovascular and Interventional Radiological Society of Europe / CardioVascular and Interventional Radiology",
    "authors": [
      "Joo-Young Chun",
      "Michiel de Haan",
      "Geert Maleux",
      "Asaad Osman",
      "Alessandro Cannavale",
      "Robert Morgan"
    ],
    "publicationYear": 2024,
    "doi": "10.1007/s00270-023-03629-1",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s00270-023-03629-1",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified in Rights and permissions; https://creativecommons.org/licenses/by/4.0/. Original factual synthesis and fictional applications with author attribution; no source prose or artwork reproduced. This packet changes presentation and application, not the cited source.",
    "authorityAssessment": "Specialty consensus standards, explicitly not a clinical practice guideline or systematic review. Directly verifies endoleak origin, sac trajectory, diagnostic ambiguity and endovascular repair. No universal type-II growth cutoff is taught.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-aorta.type-i-origin",
      "claim.vascular-aorta.type-i-prompt-seal-repair",
      "claim.vascular-aorta.type-ii-branch-flow",
      "claim.vascular-aorta.stable-type-ii-follow-up",
      "claim.vascular-aorta.expanding-sac-uncertain-leak",
      "claim.vascular-aorta.type-iii-component-defect",
      "claim.vascular-aorta.type-iii-bridge-repair"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-aorta.sts-aats-type-b-2022",
    "title": "STS/AATS Clinical Practice Guidelines on the Management of Type B Aortic Dissection",
    "completeCitation": "MacGillivray TE, Gleason TG, Patel HJ, et al. The Society of Thoracic Surgeons/American Association for Thoracic Surgery Clinical Practice Guidelines on the Management of Type B Aortic Dissection. Ann Thorac Surg. 2022;113:1073-1092. doi:10.1016/j.athoracsur.2021.11.002.",
    "organizationOrJournal": "Society of Thoracic Surgeons / American Association for Thoracic Surgery; Annals of Thoracic Surgery",
    "authors": [
      "Thomas E. MacGillivray",
      "Thomas G. Gleason",
      "Himanshu J. Patel",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1016/j.athoracsur.2021.11.002",
    "pmid": null,
    "officialUrl": "https://www.sts.org/sites/default/files/content/TBAD_Guideline_2022.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright STS/AATS 2021; society-hosted guideline",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyrighted society guidance; targeted factual verification and bibliographic attribution only. No source prose, table, figure, algorithm or excerpt retained. Copyright is separate from medical authority. No affirmative AI licence is asserted. Official society PDF accessed without login. No publisher full-text corpus used. Public access confers no reproduction right.",
    "authorityAssessment": "Independent society guideline cross-check of initial medical treatment, complicated type-B intervention and LSA revascularization. Recommendations share some underlying evidence with ACC/AHA and CIRSE.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-aorta.uncomplicated-type-b-medical",
      "claim.vascular-aorta.complicated-type-b-intervention",
      "claim.vascular-aorta.lsa-dependent-coronary-protection",
      "claim.vascular-aorta.lsa-transposition-proximal-clamp",
      "claim.vascular-aorta.pedicled-lima-avoid-transposition"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-aorta.cirse-thoracic-2026",
    "title": "CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease",
    "completeCitation": "Gupta Y, Vaughan S, Fanelli F, van Rijswijk C, Rousseau H, Schafer JP. CIRSE Standards of Practice on the Endovascular Management of Descending Thoracic Aortic Disease. Cardiovasc Intervent Radiol. 2026;49:1645-1656. doi:10.1007/s00270-026-04477-5. Published August 3, 2026.",
    "organizationOrJournal": "Cardiovascular and Interventional Radiological Society of Europe / CardioVascular and Interventional Radiology",
    "authors": [
      "Yuri Gupta",
      "Samuel Vaughan",
      "Fabrizio Fanelli",
      "Catharina van Rijswijk",
      "Herve Rousseau",
      "Jost Philipp Schafer"
    ],
    "publicationYear": 2026,
    "doi": "10.1007/s00270-026-04477-5",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s00270-026-04477-5",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified in Rights and permissions; https://creativecommons.org/licenses/by/4.0/. Original factual synthesis and fictional applications with author attribution; no source prose or artwork reproduced. This packet changes presentation and application, not the cited source.",
    "authorityAssessment": "Current 2026 specialty consensus standards; not a formal guideline or systematic review. Directly checks dynamic/static malperfusion, LSA-dependent coronary inflow, spinal-cord rescue and infection. Supports no invented drug doses or perfusion targets.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-aorta.uncomplicated-type-b-medical",
      "claim.vascular-aorta.complicated-type-b-intervention",
      "claim.vascular-aorta.dynamic-malperfusion",
      "claim.vascular-aorta.persistent-static-branch-obstruction",
      "claim.vascular-aorta.lsa-dependent-coronary-protection",
      "claim.vascular-aorta.post-tevar-cord-rescue",
      "claim.vascular-aorta.graft-infection-operative-source-control"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-aorta.dailymed-nicardipine-2026",
    "title": "Nicardipine hydrochloride in sodium chloride injection: prescribing information",
    "completeCitation": "Caplin Steriles Limited. Nicardipine hydrochloride in sodium chloride injection, prescribing information. Revised November 2025; DailyMed record updated June 25, 2026. US National Library of Medicine, structured product label set 9383f1dc-0310-4c87-a8f0-48c09a85d89b.",
    "organizationOrJournal": "US National Library of Medicine DailyMed / Caplin Steriles Limited",
    "authors": [
      "Caplin Steriles Limited"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9383f1dc-0310-4c87-a8f0-48c09a85d89b",
    "accessedOn": "2026-11-11",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government-hosted manufacturer prescribing information; underlying label rights retained",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of drug class, short-term intravenous hypertension use and concomitant beta-blocker use. No label prose, dosage table or product images reproduced. Public NLM distribution is not treated as a blanket public-domain licence for manufacturer expression. NLM Web Policies (https://www.nlm.nih.gov/web_policies.html#copyright) distinguish private contributed content from government works; no AI-access prohibition was found. Source: National Library of Medicine; National Institutes of Health; U.S. Department of Health and Human Services. No endorsement is implied.",
    "authorityAssessment": "Primary regulatory-label pharmacology cross-check only; this source does not establish the aortic-dissection treatment sequence, which is supported by ACC/AHA. Sections 1.1, 7.2 and 12.1 checked. DailyMed distributes manufacturer-submitted in-use labeling and does not independently review each submission; it may differ from the latest FDA-approved labeling. Only the specified pharmacology facts are used.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-aorta.nicardipine-intravenous-antihypertensive"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-aorta.svs-popliteal-2022",
    "title": "SVS clinical practice guidelines on popliteal artery aneurysms",
    "completeCitation": "Farber A, Angle N, Avgerinos E, Dubois L, Eslami M, Geraghty P, Haurani M, Jim J, Ketteler E, Pulli R, Siracuse JJ, Murad MH. The Society for Vascular Surgery clinical practice guidelines on popliteal artery aneurysms. J Vasc Surg. 2022;75(1 Suppl):109S-120S. doi:10.1016/j.jvs.2021.04.040. Online May 20, 2021.",
    "organizationOrJournal": "Society for Vascular Surgery / Journal of Vascular Surgery",
    "authors": [
      "Alik Farber",
      "Niren Angle",
      "Efthymios Avgerinos",
      "Luc Dubois",
      "Mohammad Eslami",
      "Patrick Geraghty",
      "Mounir Haurani",
      "Jeffrey Jim",
      "Erika Ketteler",
      "Raffaele Pulli",
      "Jeffrey J. Siracuse",
      "M. Hassan Murad"
    ],
    "publicationYear": 2022,
    "doi": "10.1016/j.jvs.2021.04.040",
    "pmid": null,
    "officialUrl": "https://www.vascularsociety.gr/wp-content/uploads/2021/11/%CE%91%CE%BD%CE%B5%CF%85%CF%81%CF%85%CF%83%CE%BC%CE%B1-%CE%99%CE%B3%CE%BD%CF%85%CE%B1%CE%BA%CE%AE%CF%82-%CE%91%CF%81%CF%84%CE%B7%CF%81%CE%AF%CE%B1%CF%82-SVS-2021.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright SVS 2021; public Hellenic Society for Vascular Surgery copy",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyrighted society guidance; targeted factual verification and bibliographic attribution only. No source prose, table, figure, algorithm or excerpt retained. Copyright is separate from medical authority. No affirmative AI licence is asserted. Public professional-society copy checked at its original URL, without authentication. Rights notice on the PDF retains SVS copyright. No general AI permission inferred. Bibliographic identity cross-checked at https://pubmed.ncbi.nlm.nih.gov/34023430/.",
    "authorityAssessment": "Graded specialty guideline. Recommendations 1, 3 and 6 directly support the three PAA decisions. These management claims have one directly checked publication; evidence for small symptomatic lesions and decompression is limited.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-aorta.small-paa-embolism-repair",
      "claim.vascular-aorta.paa-associated-aneurysm-screen",
      "claim.vascular-aorta.excluded-paa-sac-compression"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.question-topic.liver-malignancy.nci-hcc.2025",
    "title": "Primary Liver Cancer Treatment (PDQ) - Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Primary Liver Cancer Treatment (PDQ) - Health Professional Version. Bethesda, MD: National Cancer Institute; 2025. Accessed November 11, 2026.",
    "organizationOrJournal": "National Cancer Institute, National Institutes of Health",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/liver/hp/adult-liver-treatment-pdq",
    "accessedOn": "2026-11-11",
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI text generally free of copyright unless marked otherwise; third-party material excluded.",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "National Cancer Institute credited by source title and link. Independently synthesized atomic facts; no source text, AJCC tables, figures or algorithms reused. NCI reuse policy checked 2026-11-11: https://www.cancer.gov/policies/copyright-reuse.",
    "authorityAssessment": "Government-maintained peer-reviewed evidence summary with evidence grades. The product states it is not a formal clinical guideline or NCI policy recommendation; exact specialist decisions still need review.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.question-topic.liver-malignancy.multiphasic-diagnosis",
      "claim.question-topic.liver-malignancy.noninvasive-imaging-pattern",
      "claim.question-topic.liver-malignancy.afp-not-diagnostic",
      "claim.question-topic.liver-malignancy.persistently-indeterminate-tissue",
      "claim.question-topic.liver-malignancy.functional-remnant",
      "claim.question-topic.liver-malignancy.favorable-hcc-resection",
      "claim.question-topic.liver-malignancy.hcc-ablation-size",
      "claim.question-topic.liver-malignancy.hcc-arterial-portal-perfusion",
      "claim.question-topic.liver-malignancy.advanced-hcc-systemic-assessment",
      "claim.question-topic.liver-malignancy.central-duct-thermal-risk",
      "claim.question-topic.liver-malignancy.subcentimeter-surveillance",
      "claim.question-topic.liver-malignancy.early-hcc-decompensation-transplant",
      "claim.question-topic.liver-malignancy.nonmetastatic-hcc-arterial-pathway",
      "claim.question-topic.liver-malignancy.remnant-outflow-strategy",
      "claim.question-topic.liver-malignancy.hepatic-central-duct-heat"
    ],
    "publicationDateNote": "2025-04-17"
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.aasld.hcc-practice-guidance.2023",
    "title": "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma",
    "completeCitation": "Singal AG, Llovet JM, Yarchoan M, Mehta N, Heimbach JK, Dawson LA, Jou JH, Kulik LM, Agopian VG, Marrero JA, Mendiratta-Lala M, Brown DB, Rilling WS, Goyal L, Wei AC, Taddei TH. AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma. Hepatology. 2023;78(6):1922-1965. doi:10.1097/HEP.0000000000000466.",
    "organizationOrJournal": "Hepatology; American Association for the Study of Liver Diseases",
    "authors": [
      "Amit G. Singal",
      "Josep M. Llovet",
      "Mark Yarchoan",
      "Neil Mehta",
      "Julie K. Heimbach",
      "Laura A. Dawson",
      "Janice H. Jou",
      "Laura M. Kulik",
      "Vatche G. Agopian",
      "Jorge A. Marrero",
      "Mishal Mendiratta-Lala",
      "Daniel B. Brown",
      "William S. Rilling",
      "Lipika Goyal",
      "Alice C. Wei",
      "Tamar H. Taddei"
    ],
    "publicationYear": 2023,
    "doi": "10.1097/HEP.0000000000000466",
    "pmid": "37199193",
    "officialUrl": "https://doi.org/10.1097/HEP.0000000000000466",
    "accessedOn": "2026-08-21",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Store bibliographic metadata and independently written atomic facts only; do not reproduce guideline prose, figures, tables, or algorithms. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. Topic lane reuses local original factual synthesis. Original access date preserved; mapping checked 2026-11-11 is not renewed retrieval.",
    "authorityAssessment": "Current AASLD guidance supporting the narrowly approved favorable profile for specialist hepatic-resection evaluation.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.a2f96b40428e",
      "claim.n1.306f7180fb92",
      "claim.n1.addcd31f93bb",
      "claim.n1.bf9e72bc7198",
      "claim.question-topic.liver-malignancy.aasld-characteristic-imaging",
      "claim.question-topic.liver-malignancy.aasld-non-hcc-malignant-pattern",
      "claim.question-topic.liver-malignancy.aasld-biopsy-scope",
      "claim.question-topic.liver-malignancy.aasld-ceus-scope"
    ],
    "subsequentAccesses": [
      {
        "accessedOn": "2026-11-11",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10663390/",
        "sourceClass": "professional_society_guideline",
        "use": "Targeted factual verification of characteristic imaging, LR-M tissue recommendation and CEUS scope; no source prose stored.",
        "rights": "Copyrighted author manuscript; PMC availability is not treated as a reuse license. Repository permits targeted society-guidance verification.",
        "policyUrl": "https://www.aasld.org/terms-use-and-privacy-policy",
        "supportedEvidenceClaimIds": [
          "claim.question-topic.liver-malignancy.aasld-characteristic-imaging",
          "claim.question-topic.liver-malignancy.aasld-non-hcc-malignant-pattern",
          "claim.question-topic.liver-malignancy.aasld-biopsy-scope",
          "claim.question-topic.liver-malignancy.aasld-ceus-scope"
        ]
      }
    ]
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.question-topic.liver-malignancy.collision-consensus.2020",
    "title": "Resectability and Ablatability Criteria for the Treatment of Liver Only Colorectal Metastases: Multidisciplinary Consensus Document from the COLLISION Trial Group",
    "completeCitation": "Nieuwenhuizen S, Puijk RS, van den Bemd B, et al. Resectability and Ablatability Criteria for the Treatment of Liver Only Colorectal Metastases: Multidisciplinary Consensus Document from the COLLISION Trial Group. Cancers. 2020;12(7):1779. doi:10.3390/cancers12071779.",
    "organizationOrJournal": "Cancers; multidisciplinary COLLISION/COLDFIRE trial group",
    "authors": [
      "Sanne Nieuwenhuizen",
      "Robbert S. Puijk",
      "Bente van den Bemd",
      "et al."
    ],
    "publicationYear": 2020,
    "doi": "10.3390/cancers12071779",
    "pmid": null,
    "officialUrl": "https://www.mdpi.com/2072-6694/12/7/1779",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0; authors retain copyright.",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article CC BY notice and MDPI terms/open-access policy checked 2026-11-11. Original factual synthesis attributed to Nieuwenhuizen et al. No protected expression, table, figure or algorithm reused. https://www.mdpi.com/about/termsofuse and https://www.mdpi.com/openaccess permit attributed reuse/TDM, with third-party exceptions.",
    "authorityAssessment": "Primary multidisciplinary expert consensus. Used for anatomic and remnant principles, not universal current procedure rankings.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.question-topic.liver-malignancy.functional-remnant",
      "claim.question-topic.liver-malignancy.crlm-clearance-over-count",
      "claim.question-topic.liver-malignancy.embolize-resection-territory",
      "claim.question-topic.liver-malignancy.oncologic-and-technical-resectability",
      "claim.question-topic.liver-malignancy.central-duct-thermal-risk",
      "claim.question-topic.liver-malignancy.selected-crlm-ablation",
      "claim.question-topic.liver-malignancy.remnant-outflow-strategy",
      "claim.question-topic.liver-malignancy.hepatic-central-duct-heat"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.liver-malignancy.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.aasld-ast.liver-transplant-candidate-evaluation.2026",
    "title": "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
    "completeCitation": "Dove L, Chadha RM, Lai JC, DiMartini A, Liapakis A, Parikh ND, Firpi-Morell R, Conteh L, Fallon M, Trotter J, Ladner DP, Sapisochin G, Lucey MR. AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation. Hepatology. 2026;83(6):1609-1645. doi:10.1097/HEP.0000000000001644.",
    "organizationOrJournal": "Hepatology; American Association for the Study of Liver Diseases and American Society of Transplantation",
    "authors": [
      "Lorna Dove",
      "Ryan M. Chadha",
      "Jennifer C. Lai",
      "Andrea DiMartini",
      "AnnMarie Liapakis",
      "Neehar D. Parikh",
      "Roberto Firpi-Morell",
      "Lanla Conteh",
      "Michael Fallon",
      "James Trotter",
      "Daniela P. Ladner",
      "Gonzalo Sapisochin",
      "Michael R. Lucey"
    ],
    "publicationYear": 2026,
    "doi": "10.1097/HEP.0000000000001644",
    "pmid": "41405234",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/41405234/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guideline; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use independently written factual synthesis and citation; do not reproduce protected prose, recommendation tables, figures, or algorithms. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. Topic lane reuses local original factual synthesis. Original access date preserved; mapping checked 2026-11-11 is not renewed retrieval.",
    "authorityAssessment": "Current joint AASLD/AST guideline supporting use of Milan criteria as a guide for transplantation listing and downstaging, with macrovascular invasion and extrahepatic disease as key boundaries.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.a2f96b40428e",
      "claim.n1.e0b6bc7a19dc"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pancreas-chronic-cysts-neoplasia.pancreatic-cancer-consensus-2020",
    "accessedOn": "2026-11-11",
    "evidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.cancer-repeat-sampling",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-eus-tissue",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-neoadjuvant",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-reconstructible-vein",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-biliary-drainage",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-liver-mri",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-metastatic-boundary"
    ],
    "title": "Multidisciplinary consensus on pancreatic cancer management",
    "completeCitation": "Martin-Perez E, Dominguez-Munoz JE, Botella-Romero F, et al. Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer. Clin Transl Oncol. 2020;22:1963-1975. doi:10.1007/s12094-020-02350-6.",
    "authors": [
      "Elena Martin-Perez",
      "J. Enrique Dominguez-Munoz",
      "Francisca Botella-Romero",
      "et al."
    ],
    "organizationOrJournal": "Spanish multidisciplinary pancreatic cancer consensus / Clinical and Translational Oncology",
    "publicationYear": 2020,
    "doi": "10.1007/s12094-020-02350-6",
    "pmid": "32318964",
    "officialUrl": "https://link.springer.com/article/10.1007/s12094-020-02350-6",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified; https://creativecommons.org/licenses/by/4.0/. Only original atomic facts and fictional applications retained; no staging table, source excerpt or treatment algorithm reproduced. The eligibility prose contains an apparent ECOG-direction problem; that detail is not used.",
    "authorityAssessment": "Multidisciplinary guidance, older than current NCI summary. Targeted diagnosis, repeat biopsy, liver MRI, biliary drainage, reconstructible venous disease and surgery/systemic sequence checked. No exact drug regimen or universal neoadjuvant policy for clearly resectable tumors inferred.",
    "usageRole": "both"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pancreas-chronic-cysts-neoplasia.nci-pancreas-2025",
    "accessedOn": "2026-11-11",
    "evidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.cancer-neoadjuvant",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-reconstructible-vein",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-metastatic-boundary",
      "claim.pancreas-chronic-cysts-neoplasia.cancer-palliative-radiation"
    ],
    "title": "NCI PDQ pancreatic cancer treatment, health professional version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Pancreatic Cancer Treatment (PDQ): Health Professional Version. National Cancer Institute. Updated February 12, 2025. Accessed November 11, 2026.",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "organizationOrJournal": "National Cancer Institute, National Institutes of Health",
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/pancreatic/hp/pancreatic-treatment-pdq",
    "sourceClass": "government_guidance",
    "licenseLabel": "US government information; PDQ and third-party exceptions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "PDQ permission-to-use statement checked. Short independently synthesized facts with attribution; no AJCC tables or third-party figures used and this packet is not represented as an NCI PDQ summary. No source prose stored.",
    "authorityAssessment": "Regularly maintained federal evidence summary, not a formal guideline. Supports borderline-disease neoadjuvant planning, systemic therapy and metastatic boundary. Latest displayed update 2025-02-12.",
    "usageRole": "cross_check"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pancreas-chronic-cysts-neoplasia.biliary-metal-plastic-2023",
    "accessedOn": "2026-11-11",
    "evidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.r2.biliary-metal-patency"
    ],
    "title": "Metal versus plastic biliary stents during pancreatic-cancer neoadjuvant therapy",
    "completeCitation": "Lyu Y, Ye S, Wang B. Comparison of metal versus plastic stent for preoperative biliary drainage in patients with pancreatic cancer undergoing neoadjuvant therapy: a meta-analysis and systematic review. BMC Gastroenterol. 2023;23:235. doi:10.1186/s12876-023-02874-5.",
    "authors": [
      "Yunxiao Lyu",
      "Shenjian Ye",
      "Bin Wang"
    ],
    "organizationOrJournal": "BMC Gastroenterology",
    "publicationYear": 2023,
    "doi": "10.1186/s12876-023-02874-5",
    "pmid": "37438761",
    "officialUrl": "https://link.springer.com/article/10.1186/s12876-023-02874-5",
    "sourceClass": "systematic_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Full article and article-level CC BY 4.0 rights verified at publisher (https://creativecommons.org/licenses/by/4.0/). Abstract, background, recurrent-obstruction findings and limitations checked. Original qualitative synthesis with author and DOI attribution; no source tables, quantitative effects, figures or sentences retained.",
    "authorityAssessment": "Systematic review specifically of neoadjuvant pancreatic-cancer drainage. Supports lower recurrent obstruction and fewer reinterventions with metal versus plastic; heterogeneous stents and largely nonrandomized evidence do not establish a universal best metal design or an absolute benefit for every patient.",
    "usageRole": "both"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pancreas-chronic-cysts-neoplasia.postoperative-complications-2026",
    "accessedOn": "2026-11-11",
    "evidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.postop-secondary-emptying",
      "claim.pancreas-chronic-cysts-neoplasia.postop-infected-collection",
      "claim.pancreas-chronic-cysts-neoplasia.postop-stepup",
      "claim.pancreas-chronic-cysts-neoplasia.postop-sentinel-bleed"
    ],
    "title": "Management of complications occurring after pancreatic surgery",
    "completeCitation": "Klaiber U, Gustorff C, Sabaini D, Leonhardt CS, Strobel O. Management of complications occurring after pancreatic surgery. Eur Surg. Published February 18, 2026. doi:10.1007/s10353-026-00932-2.",
    "authors": [
      "Ulla Klaiber",
      "Charlotte Gustorff",
      "Dorian Sabaini",
      "Carl-Stephan Leonhardt",
      "Oliver Strobel"
    ],
    "organizationOrJournal": "European Surgery",
    "publicationYear": 2026,
    "doi": "10.1007/s10353-026-00932-2",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s10353-026-00932-2",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified; https://creativecommons.org/licenses/by/4.0/. Original synthesis with attribution; no published management algorithm, figure, score or source excerpt retained. Sources about drain prophylaxis were not turned into a universal rule.",
    "authorityAssessment": "Current expert narrative review. Single directly verified management publication for the postoperative decision chain, a declared limitation. Supports evaluating secondary causes of delayed emptying, drainage/antibiotic management and urgent vascular assessment of sentinel bleeding.",
    "usageRole": "evidence"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pancreas-chronic-cysts-neoplasia.sirm-aisp-cysts-2026",
    "accessedOn": "2026-11-11",
    "evidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.mrcp-cyst-duct",
      "claim.pancreas-chronic-cysts-neoplasia.cyst-imaging-limits",
      "claim.pancreas-chronic-cysts-neoplasia.ipmn-high-risk",
      "claim.pancreas-chronic-cysts-neoplasia.mcn-phenotype",
      "claim.pancreas-chronic-cysts-neoplasia.cyst-chronology",
      "claim.pancreas-chronic-cysts-neoplasia.cyst-eus-uncertainty",
      "claim.pancreas-chronic-cysts-neoplasia.mcn-resection",
      "claim.pancreas-chronic-cysts-neoplasia.serous-compression",
      "claim.pancreas-chronic-cysts-neoplasia.serous-phenotype",
      "claim.pancreas-chronic-cysts-neoplasia.ipmn-remnant",
      "claim.pancreas-chronic-cysts-neoplasia.mcn-noninvasive-after-resection"
    ],
    "title": "Pancreatic cystic lesions: SIRM-AISP position paper",
    "completeCitation": "D'Onofrio M, Mascarin B, De Robertis R, et al. Pancreatic cystic lesions: position paper of the SIRM-AISP multidisciplinary group. Radiol Med. 2026;131:1439-1451. doi:10.1007/s11547-026-02246-5.",
    "authors": [
      "Mirko D'Onofrio",
      "Beatrice Mascarin",
      "Riccardo De Robertis",
      "et al."
    ],
    "organizationOrJournal": "SIRM / AISP / La radiologia medica",
    "publicationYear": 2026,
    "doi": "10.1007/s11547-026-02246-5",
    "pmid": "42340659",
    "officialUrl": "https://link.springer.com/article/10.1007/s11547-026-02246-5",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified in Rights and permissions. Original factual synthesis and fictional cases, with citation and DOI attribution; no protected figures, tables, proposed algorithm or report template reproduced. License: https://creativecommons.org/licenses/by/4.0/. Springer Nature TDM guidance checked separately from medical authority.",
    "authorityAssessment": "Current intersociety position paper rather than a randomized comparison. Supports phenotype limits, symptomatic compression, MCN referral and post-IPMN surveillance; many recommendations synthesize older guidance.",
    "usageRole": "both"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pancreas-chronic-cysts-neoplasia.acg-cysts-2018",
    "accessedOn": "2026-11-11",
    "evidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.mrcp-cyst-duct",
      "claim.pancreas-chronic-cysts-neoplasia.cyst-imaging-limits",
      "claim.pancreas-chronic-cysts-neoplasia.mcn-phenotype",
      "claim.pancreas-chronic-cysts-neoplasia.cyst-chronology",
      "claim.pancreas-chronic-cysts-neoplasia.cyst-eus-uncertainty",
      "claim.pancreas-chronic-cysts-neoplasia.cyst-cea-limit",
      "claim.pancreas-chronic-cysts-neoplasia.mcn-resection",
      "claim.pancreas-chronic-cysts-neoplasia.serous-phenotype",
      "claim.pancreas-chronic-cysts-neoplasia.ipmn-remnant",
      "claim.pancreas-chronic-cysts-neoplasia.mcn-noninvasive-after-resection"
    ],
    "title": "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
    "completeCitation": "Elta GH, Enestvedt BK, Sauer BG, Lennon AM. ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts. Am J Gastroenterol. 2018;113:464-479. doi:10.1038/ajg.2018.14.",
    "authors": [
      "Grace H. Elta",
      "Brintha K. Enestvedt",
      "Bryan G. Sauer",
      "Anne Marie Lennon"
    ],
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "publicationYear": 2018,
    "doi": "10.1038/ajg.2018.14",
    "pmid": "29485131",
    "officialUrl": "https://acgcdn.gi.org/wp-content/uploads/2018/04/ACG-Pancreatic-Cysts-Guideline-Summary.pdf",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guidance; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Read the official society summary for recommendations 2-3, 6-7, 11 and 17-19. New targeted check, distinct from the legacy source.board.acg-pancreatic-cyst-2018 access of 2026-09-11. No source prose, tables, figures or algorithm retained. No known AI-access prohibition found on the society-hosted document; no broad reuse or corpus permission asserted.",
    "authorityAssessment": "GRADE society guideline; many cyst recommendations have low or very low certainty. Cross-checked against 2024 Kyoto and 2026 SIRM-AISP guidance. Imaging subtype is presumptive.",
    "usageRole": "both"
  },
  {
    "contentVersion": "clinical.question-topic-pancreas-chronic-cysts-neoplasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pancreas-chronic-cysts-neoplasia.kyoto-ipmn-2024",
    "accessedOn": "2026-11-11",
    "evidenceClaimIds": [
      "claim.pancreas-chronic-cysts-neoplasia.ipmn-high-risk",
      "claim.pancreas-chronic-cysts-neoplasia.ipmn-low-grade-margin"
    ],
    "title": "International evidence-based Kyoto guidelines for IPMN",
    "completeCitation": "Ohtsuka T, Fernandez-del Castillo C, Furukawa T, Hijioka S, Jang JY, Lennon AM, Miyasaka Y, Ohno E, Salvia R, Wolfgang CL, Wood LD. International evidence-based Kyoto guidelines for the management of intraductal papillary mucinous neoplasm of the pancreas. Pancreatology. 2024;24:255-270. doi:10.1016/j.pan.2023.12.009.",
    "authors": [
      "Takao Ohtsuka",
      "Carlos Fernandez-del Castillo",
      "Toru Furukawa",
      "Susumu Hijioka",
      "Jin-Young Jang",
      "Anne Marie Lennon",
      "Yoshihiro Miyasaka",
      "Eizaburo Ohno",
      "Roberto Salvia",
      "Christopher L. Wolfgang",
      "Laura D. Wood"
    ],
    "organizationOrJournal": "International Association of Pancreatology / European Pancreatic Club / Pancreatology",
    "publicationYear": 2024,
    "doi": "10.1016/j.pan.2023.12.009",
    "pmid": null,
    "officialUrl": "https://www.ahpba.org/wp-content/uploads/2025/02/Kyoto-IPMN-Guidelines-2024.pdf",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC-ND 4.0; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Society-hosted guideline checked for enhancing nodule/duct high-risk criteria, low-grade margin management (CQ4-6) and surveillance disagreement. CC BY-NC-ND is not treated as permission for commercial adaptation. Only independently expressed underlying facts and bibliographic links retained. Elsevier TDM policy checked; no ScienceDirect scraping, corpus ingestion, training, figure or algorithm reuse. No affirmative unrestricted AI license asserted.",
    "authorityAssessment": "2024 international evidence-based IPMN guideline. Enhancing mural nodule at least 5 mm and main duct at least 10 mm remain high-risk features; recommendations are not proof of cancer. Surveillance discontinuation is conditional and disputed across guidelines.",
    "usageRole": "both"
  }
];
export const PROGRAM_BATCH2_ORDERS = [
  {
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "choiceId": "choice.trauma-thoracic.bci-selective-imaging.v2.tte",
    "choiceLabel": "Add transthoracic echocardiography to reassessment",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "choiceId": "choice.trauma-thoracic.bci-selective-imaging.v2.ct",
    "choiceLabel": "Add cardiac CT to reassessment",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "choiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.tee",
    "choiceLabel": "Transesophageal echocardiography",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "choiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.ct",
    "choiceLabel": "Cardiac CT",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "choiceId": "choice.trauma-thoracic.bci-persistent-arrhythmia.v2.mri",
    "choiceLabel": "Cardiac magnetic resonance imaging",
    "timingProfileId": "timing.test.mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.trauma-thoracic.drain-complication.20261111.v1",
    "nodeId": "node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "choiceId": "choice.trauma-thoracic.chest-drain-organ-trajectory.retain",
    "choiceLabel": "Retain the tube; obtain contrast CT mapping",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.trauma-thoracic.drain-complication.20261111.v1",
    "nodeId": "node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "choiceId": "choice.trauma-thoracic.chest-drain-organ-trajectory.remove",
    "choiceLabel": "Remove the tube; obtain ultrasound reassessment",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.trauma-thoracic.drain-complication.20261111.v1",
    "nodeId": "node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "choiceId": "choice.trauma-thoracic.chest-drain-organ-trajectory.retract",
    "choiceLabel": "Retract the tube; obtain repeat chest radiographs",
    "timingProfileId": "timing.test.radiography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.screening-review.v2",
    "nodeId": "node.vascular-aorta.screening.v2",
    "questionVariantId": "question.vascular-aorta.screening.v2",
    "choiceId": "choice.vascular-aorta.screening.ultrasound.v2",
    "choiceLabel": "Obtain abdominal aortic ultrasound",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.screening-review.v2",
    "nodeId": "node.vascular-aorta.screening.v2",
    "questionVariantId": "question.vascular-aorta.screening.v2",
    "choiceId": "choice.vascular-aorta.screening.cta.v2",
    "choiceLabel": "Obtain abdominal aortic CT angiography",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.proximal-attachment-leak.v1",
    "nodeId": "node.vascular-aorta.proximal-seal-repair.v1",
    "questionVariantId": "question.vascular-aorta.proximal-seal-repair.v1",
    "choiceId": "choice.vascular-aorta.proximal-seal-repair.surveillance.v1",
    "choiceLabel": "Continue aortic duplex imaging surveillance",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.retrograde-ascending-extension.v1",
    "nodeId": "node.vascular-aorta.ascending-emergency.v1",
    "questionVariantId": "question.vascular-aorta.ascending-emergency.v1",
    "choiceId": "choice.vascular-aorta.ascending-emergency.medical.v1",
    "choiceLabel": "Intravenous esmolol with CT angiographic follow-up",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.small-embolizing-paa.v2",
    "questionVariantId": "question.vascular-aorta.small-embolizing-paa.v2",
    "choiceId": "choice.vascular-aorta.small-embolizing-paa.anticoagulate.v2",
    "choiceLabel": "Start anticoagulation with popliteal duplex follow-up",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.small-embolizing-paa.v2",
    "questionVariantId": "question.vascular-aorta.small-embolizing-paa.v2",
    "choiceId": "choice.vascular-aorta.small-embolizing-paa.surveillance.v2",
    "choiceLabel": "Continue annual popliteal duplex surveillance",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.associated-aneurysm-survey.v2",
    "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "choiceId": "choice.vascular-aorta.associated-aneurysm-survey.left_arterial.v2",
    "choiceLabel": "Left popliteal arterial duplex ultrasound",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.associated-aneurysm-survey.v2",
    "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "choiceId": "choice.vascular-aorta.associated-aneurysm-survey.aortic.v2",
    "choiceLabel": "Abdominal aortic duplex ultrasound",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.associated-aneurysm-survey.v2",
    "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "choiceId": "choice.vascular-aorta.associated-aneurysm-survey.thoracic.v2",
    "choiceLabel": "Thoracic aortic CT angiography",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.graft-diagnostic-review.v2",
    "nodeId": "node.vascular-aorta.graft-bleed-imaging.v2",
    "questionVariantId": "question.vascular-aorta.graft-bleed-imaging.v2",
    "choiceId": "choice.vascular-aorta.graft-bleed-imaging.cta.v2",
    "choiceLabel": "Multiphase abdominal CT angiography",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.graft-diagnostic-review.v2",
    "nodeId": "node.vascular-aorta.graft-bleed-imaging.v2",
    "questionVariantId": "question.vascular-aorta.graft-bleed-imaging.v2",
    "choiceId": "choice.vascular-aorta.graft-bleed-imaging.push_enteroscopy.v2",
    "choiceLabel": "Push enteroscopy into the distal duodenum",
    "timingProfileId": "timing.test.upper_endoscopy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-aorta.graft-diagnostic-review.v2",
    "nodeId": "node.vascular-aorta.graft-bleed-imaging.v2",
    "questionVariantId": "question.vascular-aorta.graft-bleed-imaging.v2",
    "choiceId": "choice.vascular-aorta.graft-bleed-imaging.red_cell_scan.v2",
    "choiceLabel": "Tagged-red-cell gastrointestinal bleeding scintigraphy",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-acquisition.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "choiceId": "dedicated_mri",
    "choiceLabel": "Multiphasic contrast-enhanced liver MRI",
    "timingProfileId": "timing.test.mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-acquisition.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "choiceId": "core_biopsy",
    "choiceLabel": "Image-guided core biopsy of the lesion",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-acquisition.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "choiceId": "ultrasound",
    "choiceLabel": "Interval conventional liver ultrasound",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "choiceId": "sample_six",
    "choiceLabel": "Biopsy segment VI; classify segment II by imaging",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "choiceId": "sample_two",
    "choiceLabel": "Biopsy segment II; classify segment VI by imaging",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "choiceId": "sample_both",
    "choiceLabel": "Biopsy both lesions; defer classification of each",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.metal.v2",
    "choiceLabel": "ERCP metal stenting before chemotherapy",
    "timingProfileId": "timing.test.therapeutic_ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.plastic.v2",
    "choiceLabel": "ERCP plastic stenting before chemotherapy",
    "timingProfileId": "timing.test.therapeutic_ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.catheter.v2",
    "choiceLabel": "Antibiotics plus image-guided catheter drainage",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.observe.v2",
    "choiceLabel": "Antibiotics plus interval imaging reassessment",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.operation.v2",
    "choiceLabel": "Antibiotics plus operative washout and drainage",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.surveillance.v1",
    "choiceLabel": "Continue pancreatic MRI surveillance",
    "timingProfileId": "timing.test.mrcp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "choiceId": "choice.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.surveillance.v1",
    "choiceLabel": "MRI-based surveillance of the pancreatic remnant",
    "timingProfileId": "timing.test.mrcp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const PROGRAM_BATCH2_FROZEN = [
  {
    "topic": "trauma-thoracic",
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "rawCaseSha256": "0b5ae6debc97a0e9a40d5fd8af0caf90feed935f8d8ef2f5e1fe0dd9c625ee57",
    "retainedCaseSha256": "0b5ae6debc97a0e9a40d5fd8af0caf90feed935f8d8ef2f5e1fe0dd9c625ee57",
    "nodes": [
      {
        "nodeId": "node.trauma-thoracic.bci-selective-imaging.20261111.v2",
        "questionVariantId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
        "conceptId": "concept.trauma-thoracic.bci-selective-imaging.v1",
        "nodeSha256": "e4dd35921e6e3178e29dfbcc4d2b17c6ac5421c6eeebbd8bf1a53364fcd36fd6",
        "questionSha256": "b3326b595c307d7cebb99469f49ffb9e1d867370daabf4766c3a8d0dfdc741a5",
        "reviewPath": "docs/research/question-topic-trauma-thoracic-review2-20261111.json"
      },
      {
        "nodeId": "node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
        "questionVariantId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
        "conceptId": "concept.trauma-thoracic.bci-arrhythmia-echo.v1",
        "nodeSha256": "2bda5b8273e243459a357e33548cb772c2669804f612ac16d9fd4eeb98aa134a",
        "questionSha256": "4764790e8ad7b2035cdd8d6f072c4647bb0d4de58f86e45c84aa01ae14ba3de5",
        "reviewPath": "docs/research/question-topic-trauma-thoracic-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-thoracic",
    "caseId": "case.trauma-thoracic.cardiac-disposition.20261111.v1",
    "rawCaseSha256": "176e36cb86275418000dbd43621075f49a8ab8e24378698f473ed6f413170398",
    "retainedCaseSha256": "176e36cb86275418000dbd43621075f49a8ab8e24378698f473ed6f413170398",
    "nodes": [
      {
        "nodeId": "node.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
        "questionVariantId": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
        "conceptId": "concept.blunt-cardiac-injury.monitored-disposition",
        "nodeSha256": "ddc7add889302a7e82915a37096d871d9394765457a34731bf687d58f3d20d7b",
        "questionSha256": "54f85800e6457e89940405430bccc1d10b404c97af8969ecfc307192767e9f35",
        "reviewPath": "docs/research/question-topic-trauma-thoracic-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-thoracic",
    "caseId": "case.trauma-thoracic.drain-complication.20261111.v1",
    "rawCaseSha256": "640a28bad61b18dfe00e81a907d196ef4f6a1cd305ae8732cb37380947c55f30",
    "retainedCaseSha256": "640a28bad61b18dfe00e81a907d196ef4f6a1cd305ae8732cb37380947c55f30",
    "nodes": [
      {
        "nodeId": "node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
        "questionVariantId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
        "conceptId": "concept.trauma-thoracic.chest-drain-organ-trajectory.v1",
        "nodeSha256": "e78e190b090e36000151c491797d7335ef92149b3d2645d6ccc97537eab10c9d",
        "questionSha256": "5d4383dafe34f42594f5b4468f00b05dd4fd42ccadec1cd63b0b05cdaae2439f",
        "reviewPath": "docs/research/question-topic-trauma-thoracic-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-thoracic",
    "caseId": "case.trauma-thoracic.bleeding-course.20261111.v1",
    "rawCaseSha256": "7d89038f9ae53ca8f4aace52c1cddd3c67bf2ca9892b23d900ca39b6d2ec0700",
    "retainedCaseSha256": "7d89038f9ae53ca8f4aace52c1cddd3c67bf2ca9892b23d900ca39b6d2ec0700",
    "nodes": [
      {
        "nodeId": "node.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
        "questionVariantId": "question.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
        "conceptId": "concept.trauma-thoracic.hemothorax-physiology-escalation.v1",
        "nodeSha256": "1e5961ca4d63c7c01f47acdd1f878d44108e868b49cbc436a1cdf9605d461ba1",
        "questionSha256": "ca90ecd8f55f3d2688643e57402c69292c7419610e6cc534e71db5f63feb36be",
        "reviewPath": "docs/research/question-topic-trauma-thoracic-review2-20261111.json"
      },
      {
        "nodeId": "node.trauma-thoracic.retained-hemothorax.20261111.v2",
        "questionVariantId": "question.trauma-thoracic.retained-hemothorax.20261111.v2",
        "conceptId": "concept.trauma-thoracic.retained-hemothorax-vats.v1",
        "nodeSha256": "78c5a8143c7d24cf4caa04a245411cc516c6806d2f36ffcc1a8e32a5f6c592c7",
        "questionSha256": "dd985a6e6320634a4388d175491a459d820e71a3cf800b89e379e917e62a022d",
        "reviewPath": "docs/research/question-topic-trauma-thoracic-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-thoracic",
    "caseId": "case.trauma-thoracic.chestwall-course.20261111.v1",
    "rawCaseSha256": "3e2ab0862fea326ed33609f4f6a5d0391d23a8834e3b78fde54de3b8bbaefb61",
    "retainedCaseSha256": "3e2ab0862fea326ed33609f4f6a5d0391d23a8834e3b78fde54de3b8bbaefb61",
    "nodes": [
      {
        "nodeId": "node.trauma-thoracic.rib-fixation-weaning.20261111.v2",
        "questionVariantId": "question.trauma-thoracic.rib-fixation-weaning.20261111.v2",
        "conceptId": "concept.trauma-thoracic.rib-fixation-failed-weaning.v1",
        "nodeSha256": "5a871cc8b2b2376f4e2e8a4d8a8a1d25439e2f521df533e064c9a6c2e65f94e2",
        "questionSha256": "cbdfbb202b841d9c6ead07c24555215b3a3ad14965357e277fa5cc366b866f43",
        "reviewPath": "docs/research/question-topic-trauma-thoracic-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-aorta",
    "caseId": "case.vascular-aorta.screening-review.v2",
    "rawCaseSha256": "0be65dc9359aff8304c12330b85efc336720630a99e365819e40babb27c2675a",
    "retainedCaseSha256": "7b921bb2b12c210c12a310368ba55bd312c9bdac6876768498612c0a24a8bb29",
    "nodes": [
      {
        "nodeId": "node.vascular-aorta.screening.v2",
        "questionVariantId": "question.vascular-aorta.screening.v2",
        "conceptId": "concept.aaa.one-time-ultrasound-screening",
        "nodeSha256": "9db176c4c1e8494e35af673c07b953ff4a64840d40aebd6a98275671b8035f34",
        "questionSha256": "4b9b901a269e6309999dea0a038a193d7ec53ace626c76470f223d31f818b49e",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-aorta",
    "caseId": "case.vascular-aorta.proximal-attachment-leak.v1",
    "rawCaseSha256": "d64d6a1027704ac4091c90640556df8e2d7f781ce33e09d8daa7274c5fd4c9e2",
    "retainedCaseSha256": "d64d6a1027704ac4091c90640556df8e2d7f781ce33e09d8daa7274c5fd4c9e2",
    "nodes": [
      {
        "nodeId": "node.vascular-aorta.proximal-seal-repair.v1",
        "questionVariantId": "question.vascular-aorta.proximal-seal-repair.v1",
        "conceptId": "concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1",
        "nodeSha256": "740bdfe58d1b870977b64878c6d1fcbc478b506b9ac7ee4b38c53be197281b32",
        "questionSha256": "77fe03ae51505139ccbf349eb4a342d758109e346fec289fff10b9534f8adcc4",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-aorta",
    "caseId": "case.vascular-aorta.retrograde-ascending-extension.v1",
    "rawCaseSha256": "beaee4863e144ef5130a8648e55df53bf676c6a54b2d46d1c98bdfa83e79aa83",
    "retainedCaseSha256": "beaee4863e144ef5130a8648e55df53bf676c6a54b2d46d1c98bdfa83e79aa83",
    "nodes": [
      {
        "nodeId": "node.vascular-aorta.ascending-emergency.v1",
        "questionVariantId": "question.vascular-aorta.ascending-emergency.v1",
        "conceptId": "concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1",
        "nodeSha256": "5168dc9b24a39e652f33d4735f0998dc7f618161959382343541e5108751dad7",
        "questionSha256": "92926b6946b7e72decd8d41cb6e055837b8877929cbc81a858c769db3a61c7a0",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-aorta",
    "caseId": "case.vascular-aorta.impulse-response-review.v2",
    "rawCaseSha256": "8b081e8dce8892ec0c588eda35a3d86c0c053d50ff358d46f0deee6c355c457c",
    "retainedCaseSha256": "8b081e8dce8892ec0c588eda35a3d86c0c053d50ff358d46f0deee6c355c457c",
    "nodes": [
      {
        "nodeId": "node.vascular-aorta.initial-type-b.v2",
        "questionVariantId": "question.vascular-aorta.initial-type-b.v2",
        "conceptId": "concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1",
        "nodeSha256": "eb6010593a7b7ff121f9e57f6588f985b7ef104e950c7b212864dadb38265b0a",
        "questionSha256": "52a7e8e71b61d0a3b3b6cca8ce165967e78c7f3e3ff1c0a1c402eada8379e56d",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-aorta",
    "caseId": "case.vascular-aorta.tevar-inflow-and-neurology.v1",
    "rawCaseSha256": "4a3efb9bd4e1693085801b4eeebe567cec7efe9af0d806904f0f6d2e309e2df5",
    "retainedCaseSha256": "4a3efb9bd4e1693085801b4eeebe567cec7efe9af0d806904f0f6d2e309e2df5",
    "nodes": [
      {
        "nodeId": "node.vascular-aorta.lsa-coronary-inflow.v1",
        "questionVariantId": "question.vascular-aorta.lsa-coronary-inflow.v1",
        "conceptId": "concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1",
        "nodeSha256": "569459db19471ae9e5c020921d586dbff346cccda5649f2c549173b3622ab652",
        "questionSha256": "3ca31b44a95df0f91f1fa4c16c7ddaf09a6769cb6ede051fd1a932de06b103c3",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review-20261111.json"
      },
      {
        "nodeId": "node.vascular-aorta.post-tevar-cord-rescue.v1",
        "questionVariantId": "question.vascular-aorta.post-tevar-cord-rescue.v1",
        "conceptId": "concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1",
        "nodeSha256": "070f23dab4ed47d897c6f71ca2b3fa898a23414ee481bd4f33b073e853d17828",
        "questionSha256": "006a561a2b0d03794032c599687226a3adc6a722a3180f79a5295644c7a8bbe9",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-aorta",
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "rawCaseSha256": "cbf8d1900110a88b0c1ad4ccb415957aeed017f315ba597a4faeab6b368fdb1b",
    "retainedCaseSha256": "cbf8d1900110a88b0c1ad4ccb415957aeed017f315ba597a4faeab6b368fdb1b",
    "nodes": [
      {
        "nodeId": "node.vascular-aorta.small-embolizing-paa.v2",
        "questionVariantId": "question.vascular-aorta.small-embolizing-paa.v2",
        "conceptId": "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1",
        "nodeSha256": "be271662f26a0a4616799ea8b0694ce55978473274055dc9d80d48e70f756e3d",
        "questionSha256": "cfa9ccb74ffbd2facb8ad4eea03532207f2123d54428dda34fa0919d54b28d59",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review2-20261111.json"
      },
      {
        "nodeId": "node.vascular-aorta.associated-aneurysm-survey.v2",
        "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
        "conceptId": "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1",
        "nodeSha256": "fc466acbc0f4c827690c4dc284e4bcdfe5495b10621d48f0b8e13197308c028d",
        "questionSha256": "e24e41d6f76db8005af049c571b533193092671c257c110e45986849d10306a5",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-aorta",
    "caseId": "case.vascular-aorta.graft-diagnostic-review.v2",
    "rawCaseSha256": "4a312172f894259b82f2dd45f2884ec4191f19aba5823211cfcc3d7722accbec",
    "retainedCaseSha256": "4a312172f894259b82f2dd45f2884ec4191f19aba5823211cfcc3d7722accbec",
    "nodes": [
      {
        "nodeId": "node.vascular-aorta.graft-bleed-imaging.v2",
        "questionVariantId": "question.vascular-aorta.graft-bleed-imaging.v2",
        "conceptId": "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1",
        "nodeSha256": "4b8f8101f0ca0716058fe2f7b11e897cf19f7cacdeb430cdb9b731d3e76ebc69",
        "questionSha256": "2d94506240109ceb88c947c57e89840c8f0b46bcc4cc946d3ea5cd8c29ef63c6",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-aorta",
    "caseId": "case.vascular-aorta.heritable-native-taaa.v1",
    "rawCaseSha256": "32f0cf0ec864b902637347897f2e0a2b606a450e23e2bb14d53406010870e75a",
    "retainedCaseSha256": "32f0cf0ec864b902637347897f2e0a2b606a450e23e2bb14d53406010870e75a",
    "nodes": [
      {
        "nodeId": "node.vascular-aorta.marfan-repair-approach.v1",
        "questionVariantId": "question.vascular-aorta.marfan-repair-approach.v1",
        "conceptId": "concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1",
        "nodeSha256": "6969a038d4803f5dfa0f763216c92f90f84d893c95fc84cb56503ac06a56f0a1",
        "questionSha256": "8032f2dbcc1f465767e0a689fe1631cb93c960f6e724f381b88bd72a8ff01e89",
        "reviewPath": "docs/research/question-topic-vascular-aorta-review-20261111.json"
      }
    ]
  },
  {
    "topic": "liver-malignancy",
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "rawCaseSha256": "8e39bbebd08adb4b9bf3c0bfc2c8bed52de83dd5b844f806c095a3570ba35605",
    "retainedCaseSha256": "8e39bbebd08adb4b9bf3c0bfc2c8bed52de83dd5b844f806c095a3570ba35605",
    "nodes": [
      {
        "nodeId": "node.topic.liver-malignancy.hcc-acquisition.v1",
        "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
        "conceptId": "concept.topic.liver-malignancy.dynamic-acquisition.v1",
        "nodeSha256": "05a0e68afde55da152bb6807d74e6d4da46dd6e1ffd558cb8cca5c1a73d33e46",
        "questionSha256": "f9a228bd2ccd46ccba411c9671aa5a3f4dbef9ba5e2fb9e39cfefa5d8b0d2dee",
        "reviewPath": "docs/research/question-topic-liver-malignancy-review2-20261111.json"
      },
      {
        "nodeId": "node.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
        "questionVariantId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
        "conceptId": "concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1",
        "nodeSha256": "effe3514994918953b037bb0070cd8c3abdb8262e939b8b3622c95ffe7f63681",
        "questionSha256": "b04071740e613ef9832f55140f28c022f835d19f9979ae1bc8c1998972ad026b",
        "reviewPath": "docs/research/question-topic-liver-malignancy-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "liver-malignancy",
    "caseId": "case.topic.liver-malignancy.hcc-favorable-resection.v1",
    "rawCaseSha256": "a12a856b02bd2bc86742dc67d1cf1daf08c15e6a34b4354f27d6653af2d41d55",
    "retainedCaseSha256": "a12a856b02bd2bc86742dc67d1cf1daf08c15e6a34b4354f27d6653af2d41d55",
    "nodes": [
      {
        "nodeId": "node.topic.liver-malignancy.hcc-raw-reserve.v2",
        "questionVariantId": "question.topic.liver-malignancy.hcc-raw-reserve.v2",
        "conceptId": "concept.hcc.compensated-cirrhosis-resection-selection",
        "nodeSha256": "e2093d487b3624eeb57dfca320d856ce8d05e2240661ea387a3524bd40e8d8bc",
        "questionSha256": "99fa9358ef5a6740ba540b7ce0fe047c82be3e2892f79df56aa350a558c29139",
        "reviewPath": "docs/research/question-topic-liver-malignancy-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "liver-malignancy",
    "caseId": "case.topic.liver-malignancy.hcc-portal-flow.v1",
    "rawCaseSha256": "f0f417d4e3f77a645c963280245b260ba70234d9e2e727e2e84653d11affea8c",
    "retainedCaseSha256": "f0f417d4e3f77a645c963280245b260ba70234d9e2e727e2e84653d11affea8c",
    "nodes": [
      {
        "nodeId": "node.topic.liver-malignancy.hcc-portal-flow.v1",
        "questionVariantId": "question.topic.liver-malignancy.hcc-portal-flow.v1",
        "conceptId": "concept.topic.liver-malignancy.hcc-vascular-pathway.v1",
        "nodeSha256": "820df346108462552fd717e191d1f2f7337b0aaf6d6d4f88f9b65e761040a28f",
        "questionSha256": "5547c26f0b880ec46814d1544f2b6b34c13d98fad86f2d444f27de0e066f4a71",
        "reviewPath": "docs/research/question-topic-liver-malignancy-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "pancreas-chronic-cysts-neoplasia",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "rawCaseSha256": "cc1a8f6c1df5d880f271602671d8953e1d1a302e3d646f646449dd045001e17e",
    "retainedCaseSha256": "cc1a8f6c1df5d880f271602671d8953e1d1a302e3d646f646449dd045001e17e",
    "nodes": [
      {
        "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
        "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
        "conceptId": "concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1",
        "nodeSha256": "08f18e982cd5ae505fcfae1640305fad6bf81d8d91653f2c9b5ef31fa14ebc88",
        "questionSha256": "2a7a4d0d81429d8c8ef0e776113807126f1d1d1bc0e6eaf60880b68126e3558d",
        "reviewPath": "docs/research/question-topic-pancreas-chronic-cysts-neoplasia-review2-20261111.json"
      },
      {
        "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
        "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
        "conceptId": "concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1",
        "nodeSha256": "9b432960460da8e7525eccf5c093c3eb72f2fcf53acb8382e75b817da66dcf97",
        "questionSha256": "21ecaade5dd2f18c0db3602e6aab9e7dc1d241a4809e1e673ae488f34c4dfefb",
        "reviewPath": "docs/research/question-topic-pancreas-chronic-cysts-neoplasia-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "pancreas-chronic-cysts-neoplasia",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
    "rawCaseSha256": "733459c121fb509e451563a2344ba9a92714cdf63f7d0c9a8c5a879f052f8a19",
    "retainedCaseSha256": "733459c121fb509e451563a2344ba9a92714cdf63f7d0c9a8c5a879f052f8a19",
    "nodes": [
      {
        "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
        "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
        "conceptId": "concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1",
        "nodeSha256": "fb2ea14fc23f5c388fd3705a908f0bab79605316b228584f168704f9b36c47d8",
        "questionSha256": "4bcc323edf4ba697720165d649703c28a5ad632b3c7dc747ea556d4857a8bde5",
        "reviewPath": "docs/research/question-topic-pancreas-chronic-cysts-neoplasia-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "pancreas-chronic-cysts-neoplasia",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1",
    "rawCaseSha256": "c483f04d010119522687b77007ed607a5d456dca8d14780c9031491c1b730c46",
    "retainedCaseSha256": "c483f04d010119522687b77007ed607a5d456dca8d14780c9031491c1b730c46",
    "nodes": [
      {
        "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
        "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
        "conceptId": "concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1",
        "nodeSha256": "4ced56220acea12b962d30d0248c1b577b6341e2bcedc3fbedebf17b4c85eee0",
        "questionSha256": "c7f33a9b55408652c69cbc3552d2ca41226be4b17663446718053f655656f595",
        "reviewPath": "docs/research/question-topic-pancreas-chronic-cysts-neoplasia-review-20261111.json"
      }
    ]
  },
  {
    "topic": "pancreas-chronic-cysts-neoplasia",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
    "rawCaseSha256": "c711782e44fd0f46cad9e564bbd51c4ad1381b43c22aae26cce85c56385ffc05",
    "retainedCaseSha256": "c711782e44fd0f46cad9e564bbd51c4ad1381b43c22aae26cce85c56385ffc05",
    "nodes": [
      {
        "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
        "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
        "conceptId": "concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1",
        "nodeSha256": "c543659a1c0c485ba28f1500b5cfea78f6cfe621b1f74aa2895084c809fb181f",
        "questionSha256": "404bbcd69eea27f6c01cfa4c27a1104a4d2d8a63a4f41958b34e5336da2faa3a",
        "reviewPath": "docs/research/question-topic-pancreas-chronic-cysts-neoplasia-review-20261111.json"
      }
    ]
  }
] as const;
export const PROGRAM_BATCH2_LENGTH_RESIDUALS = [
  {
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "correctLength": 55,
    "longestDistractor": 50
  },
  {
    "caseId": "case.vascular-aorta.proximal-attachment-leak.v1",
    "questionVariantId": "question.vascular-aorta.proximal-seal-repair.v1",
    "correctLength": 44,
    "longestDistractor": 43
  },
  {
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "correctLength": 41,
    "longestDistractor": 34
  },
  {
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "correctLength": 39,
    "longestDistractor": 38
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "correctLength": 51,
    "longestDistractor": 48
  },
  {
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "correctLength": 48,
    "longestDistractor": 43
  }
] as const;
export const PROGRAM_BATCH2_AUTHORED_CONCEPTS = [
  {
    "id": "concept.trauma-thoracic.bci-selective-imaging.v1",
    "displayName": "Select cardiac assessment after an abnormal screen",
    "learningObjective": "Interpret the abnormal troponin as a monitoring indication and choose a screening/reassessment pathway rather than automatic structural or coronary imaging.",
    "earliestFacilityStage": 1,
    "conceptType": "workup"
  },
  {
    "id": "concept.trauma-thoracic.bci-arrhythmia-echo.v1",
    "displayName": "Resolve an inadequate echocardiographic assessment",
    "learningObjective": "Interpret the actual failed transthoracic acquisition and choose transesophageal assessment.",
    "earliestFacilityStage": 1,
    "conceptType": "workup"
  },
  {
    "id": "concept.blunt-cardiac-injury.monitored-disposition",
    "displayName": "Separate cardiac rule-out from other admission needs",
    "learningObjective": "Apply the observed treatment response and respiratory limitations to the remaining hospital disposition.",
    "earliestFacilityStage": 1,
    "conceptType": "disposition"
  },
  {
    "id": "concept.trauma-thoracic.chest-drain-organ-trajectory.v1",
    "displayName": "Handle a drain with an unintended organ trajectory",
    "learningObjective": "Avoid blind tube movement and map the injury before controlled multidisciplinary management.",
    "earliestFacilityStage": 1,
    "conceptType": "complication"
  },
  {
    "id": "concept.trauma-thoracic.hemothorax-physiology-escalation.v1",
    "displayName": "Escalate thoracic bleeding care from physiology",
    "learningObjective": "Use repeated loss of perfusion after transient transfusion response to select an access strategy for unstable thoracic bleeding.",
    "earliestFacilityStage": 1,
    "conceptType": "management"
  },
  {
    "id": "concept.trauma-thoracic.retained-hemothorax-vats.v1",
    "displayName": "Treat retained blood after hemorrhage control",
    "learningObjective": "Select clot evacuation rather than repeat initial tube drainage in a stable operative candidate.",
    "earliestFacilityStage": 1,
    "conceptType": "management"
  },
  {
    "id": "concept.trauma-thoracic.rib-fixation-failed-weaning.v1",
    "displayName": "Reassess rib stabilization after failed liberation",
    "learningObjective": "Recognize a supported fixation-assessment indication while avoiding a blanket contusion exclusion.",
    "earliestFacilityStage": 1,
    "conceptType": "management"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.aaa.one-time-ultrasound-screening",
    "displayName": "Interpret actual inferior scan coverage before applying abdominal-aortic screening eligibility.",
    "learningObjective": "Interpret actual inferior scan coverage before applying abdominal-aortic screening eligibility.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.brief.aaa.one-time-ultrasound-screening",
      "claim.vascular-aorta.celiac-ending-scan-infrarenal-coverage",
      "claim.vascular-aorta.symptomatic-aaa-repair"
    ],
    "identityDecision": "stable_meaning_revision",
    "previousConceptIds": [
      "concept.aaa.one-time-ultrasound-screening"
    ],
    "previousQuestionVariantIds": [
      "question.vascular-aorta.screening.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1",
    "displayName": "Recognize a direct attachment leak and repair the seal despite stable current sac size.",
    "learningObjective": "Recognize a direct attachment leak and repair the seal despite stable current sac size.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.type-i-origin",
      "claim.vascular-aorta.type-i-prompt-seal-repair",
      "claim.vascular-aorta.stable-type-ii-follow-up",
      "claim.vascular-aorta.type-ii-branch-flow",
      "claim.vascular-aorta.expanding-sac-uncertain-leak"
    ],
    "identityDecision": "new_meaning",
    "previousConceptIds": [],
    "previousQuestionVariantIds": []
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1",
    "displayName": "Use total dissection extent rather than entry-tear location to identify the need for emergency ascending repair.",
    "learningObjective": "Use total dissection extent rather than entry-tear location to identify the need for emergency ascending repair.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.ascending-involvement",
      "claim.vascular-aorta.type-a-emergency-repair",
      "claim.vascular-aorta.complicated-type-b-intervention",
      "claim.vascular-aorta.uncomplicated-type-b-medical",
      "claim.vascular-aorta.beta-blockade-before-vasodilation"
    ],
    "identityDecision": "new_meaning",
    "previousConceptIds": [],
    "previousQuestionVariantIds": []
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1",
    "displayName": "Interpret the response of heart rate versus pressure to beta blockade and select the next infusion change.",
    "learningObjective": "Interpret the response of heart rate versus pressure to beta blockade and select the next infusion change.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.beta-blockade-before-vasodilation",
      "claim.vascular-aorta.acute-aortic-syndrome-heart-rate-target",
      "claim.vascular-aorta.nicardipine-intravenous-antihypertensive",
      "claim.vascular-aorta.non-dihydropyridine-rate-control-alternative"
    ],
    "identityDecision": "new_meaning",
    "previousConceptIds": [
      "concept.vascular-aorta.uncomplicated-type-b-initial-impulse-therapy.v1"
    ],
    "historyTransfer": false,
    "identityReason": "The revised objective changes the scored clinical meaning; retain the previous concept and FSRS history separately.",
    "previousQuestionVariantIds": [
      "question.vascular-aorta.initial-type-b.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1",
    "displayName": "Trace LSA-dependent coronary inflow and preserve it before an elective covering graft.",
    "learningObjective": "Trace LSA-dependent coronary inflow and preserve it before an elective covering graft.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.lsa-dependent-coronary-protection",
      "claim.vascular-aorta.lsa-transposition-proximal-clamp",
      "claim.vascular-aorta.pedicled-lima-avoid-transposition"
    ],
    "identityDecision": "new_meaning",
    "previousConceptIds": [],
    "previousQuestionVariantIds": []
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1",
    "displayName": "Localize a new post-TEVAR neurologic deficit and reverse impaired spinal perfusion rather than extending pressure reduction.",
    "learningObjective": "Localize a new post-TEVAR neurologic deficit and reverse impaired spinal perfusion rather than extending pressure reduction.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.post-tevar-cord-rescue",
      "claim.vascular-aorta.beta-blockade-before-vasodilation"
    ],
    "identityDecision": "new_meaning",
    "previousConceptIds": [],
    "previousQuestionVariantIds": []
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1",
    "displayName": "Identify an embolizing small PAA and choose repair planning rather than size-only or medication-only follow-up.",
    "learningObjective": "Identify an embolizing small PAA and choose repair planning rather than size-only or medication-only follow-up.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.small-paa-embolism-repair"
    ],
    "identityDecision": "stable_meaning_revision",
    "previousConceptIds": [
      "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1"
    ],
    "previousQuestionVariantIds": [
      "question.vascular-aorta.small-embolizing-paa.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1",
    "displayName": "Use the associated aneurysm pattern and actual prior imaging coverage to complete an aneurysm survey without repeating an adequate examination.",
    "learningObjective": "Use the associated aneurysm pattern and actual prior imaging coverage to complete an aneurysm survey without repeating an adequate examination.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.paa-associated-aneurysm-screen",
      "claim.vascular-aorta.celiac-ending-scan-infrarenal-coverage",
      "claim.vascular-aorta.marfan-taaa-open-repair"
    ],
    "identityDecision": "stable_meaning_revision",
    "previousConceptIds": [
      "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1"
    ],
    "previousQuestionVariantIds": [
      "question.vascular-aorta.associated-aneurysm-survey.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1",
    "displayName": "Recognize an unaddressed graft-related source when bleeding and infection coexist after aortic reconstruction.",
    "learningObjective": "Recognize an unaddressed graft-related source when bleeding and infection coexist after aortic reconstruction.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.graft-infection-evaluation"
    ],
    "identityDecision": "stable_meaning_revision",
    "previousConceptIds": [
      "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1"
    ],
    "previousQuestionVariantIds": [
      "question.vascular-aorta.graft-bleed-imaging.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-aorta.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1",
    "displayName": "Choose a durable repair approach for an operable heritable native-aorta TAAA rather than extending routine degenerative-aneurysm EVAR preferences.",
    "learningObjective": "Choose a durable repair approach for an operable heritable native-aorta TAAA rather than extending routine degenerative-aneurysm EVAR preferences.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-aorta.marfan-taaa-open-repair"
    ],
    "identityDecision": "new_meaning",
    "previousConceptIds": [],
    "previousQuestionVariantIds": []
  },
  {
    "id": "concept.topic.liver-malignancy.dynamic-acquisition.v1",
    "displayName": "Select the next diagnostic study from the acquired contrast phases rather than treating an incomplete examination as exclusion.",
    "learningObjective": "Select the next diagnostic study from the acquired contrast phases rather than treating an incomplete examination as exclusion.",
    "earliestFacilityStage": 0,
    "conceptType": "workup"
  },
  {
    "id": "concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1",
    "displayName": "Distinguish two raw enhancement patterns in cirrhosis to select the lesion requiring tissue classification.",
    "learningObjective": "Distinguish two raw enhancement patterns in cirrhosis to select the lesion requiring tissue classification.",
    "earliestFacilityStage": 0,
    "conceptType": "diagnosis"
  },
  {
    "id": "concept.hcc.compensated-cirrhosis-resection-selection",
    "displayName": "HCC resection selection in compensated cirrhosis",
    "learningObjective": "For the approved favorable compensated-cirrhosis profile, select hospital HPB-surgery referral for hepatic resection evaluation without treating Child-Pugh A status or Milan classification alone as sufficient.",
    "earliestFacilityStage": 0,
    "conceptType": "management"
  },
  {
    "id": "concept.topic.liver-malignancy.hcc-vascular-pathway.v1",
    "displayName": "Integrate major portal obstruction with tumor stage before choosing a liver-directed or systemic HCC assessment.",
    "learningObjective": "Integrate major portal obstruction with tumor stage before choosing a liver-directed or systemic HCC assessment.",
    "earliestFacilityStage": 0,
    "conceptType": "management"
  },
  {
    "id": "concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1",
    "displayName": "Use potentially reconstructible venous involvement to select neoadjuvant planning without abandoning curative intent.",
    "learningObjective": "Use potentially reconstructible venous involvement to select neoadjuvant planning without abandoning curative intent.",
    "conceptType": "management",
    "earliestFacilityStage": 1
  },
  {
    "id": "concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1",
    "displayName": "Select durable biliary decompression for a jaundiced patient proceeding to neoadjuvant therapy.",
    "learningObjective": "Select durable biliary decompression for a jaundiced patient proceeding to neoadjuvant therapy.",
    "conceptType": "management",
    "earliestFacilityStage": 1
  },
  {
    "id": "concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1",
    "displayName": "Choose the least invasive effective source-control route for an accessible postoperative collection in a stable patient.",
    "learningObjective": "Choose the least invasive effective source-control route for an accessible postoperative collection in a stable patient.",
    "conceptType": "management",
    "earliestFacilityStage": 1
  },
  {
    "id": "concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1",
    "displayName": "Recognize when a usually benign cyst phenotype has a mechanical indication for treatment.",
    "learningObjective": "Recognize when a usually benign cyst phenotype has a mechanical indication for treatment.",
    "conceptType": "management",
    "earliestFacilityStage": 1
  },
  {
    "id": "concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1",
    "displayName": "Preserve appropriate remnant surveillance without treating low-grade IPMN margins as an automatic completion-resection indication.",
    "learningObjective": "Preserve appropriate remnant surveillance without treating low-grade IPMN margins as an automatic completion-resection indication.",
    "conceptType": "management",
    "earliestFacilityStage": 1
  }
] as const;
