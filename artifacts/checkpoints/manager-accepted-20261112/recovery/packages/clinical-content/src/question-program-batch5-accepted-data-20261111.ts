import type {QuestionShipAcceptance,QuestionShipCaseReplacement,QuestionShipTopicConsolidation} from "./question-ship-manifest";
import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";
export const PROGRAM_BATCH5_ROWS: QuestionShipAcceptance[] = [
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "conceptId": "concept.n2.vte-prophylaxis-to-treatment",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "conceptId": "concept.postoperative-dvt.three-month-anticoagulation",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "conceptId": "concept.postoperative-dvt.three-month-anticoagulation",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "conceptId": "concept.n1.lymphedema-new-tempo-venous-assessment",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "conceptId": "concept.dialysis-access.maturation-physical-assessment",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "conceptId": "concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "conceptId": "concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "caseId": "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2",
    "nodeId": "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "conceptId": "concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1",
    "sourceView": "topic-batch5-esophagus-motility-achalasia",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "caseId": "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "conceptId": "concept.pbh.spontaneous-evidence-before-treatment.v2",
    "sourceView": "topic-batch5-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "caseId": "case.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "conceptId": "concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2",
    "sourceView": "topic-batch5-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "caseId": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "conceptId": "concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2",
    "sourceView": "topic-batch5-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "caseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "conceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "caseId": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "conceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  }
];
export const PROGRAM_BATCH5_REPLACEMENTS: QuestionShipCaseReplacement[] = [
  {
    "replaces": "case.gs028.varicose-veins.a-asymmetric-branches",
    "with": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1"
  }
];
export const PROGRAM_BATCH5_CONSOLIDATIONS: QuestionShipTopicConsolidation[] = [
  {
    "id": "topic-program.batch5.case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2",
    "program": "topic-program",
    "replaces": [
      "case.postoperative-dvt.bowel-surgery",
      "case.postoperative-dvt.hernia-repair",
      "case.postoperative-dvt.postop-visit"
    ],
    "with": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "id": "topic-program.batch5.case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "program": "topic-program",
    "replaces": [
      "case.venous-leg-ulcer.healed-edge",
      "case.venous-leg-ulcer.recurrent-ulcer",
      "case.venous-leg-ulcer.varicose-changes"
    ],
    "with": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "id": "topic-program.batch5.case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
    "program": "topic-program",
    "replaces": [
      "case.post-bariatric-hypoglycemia.postmeal-confusion",
      "case.post-bariatric-hypoglycemia.postmeal-dizziness",
      "case.post-bariatric-hypoglycemia.postmeal-shaking",
      "case.post-bariatric-hypoglycemia.postmeal-weakness"
    ],
    "with": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "id": "topic-program.batch5.case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
    "program": "topic-program",
    "replaces": [
      "case.pediatric-clinic.groin-bulge-after-play",
      "case.pediatric-clinic.intermittent-groin-swelling"
    ],
    "with": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  }
];
export const PROGRAM_BATCH5_VIEWS: Record<string,SyntheticClinicalRelease> = {
  "topic-batch5-vascular-venous-lymphatic-access": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.n2.vte-prophylaxis-to-treatment",
        "displayName": "A new DVT changes anticoagulation purpose",
        "learningObjective": "Distinguish prophylactic anticoagulation from treatment of a newly confirmed postoperative proximal DVT.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.postoperative-dvt.three-month-anticoagulation",
        "displayName": "Finite anticoagulation after surgery-provoked DVT",
        "learningObjective": "Select finite anticoagulation planning for a first uncomplicated major-surgery-provoked proximal DVT when safe.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.n1.lymphedema-new-tempo-venous-assessment",
        "displayName": "New swelling despite established lymphedema",
        "learningObjective": "Investigate an acute postoperative change in a chronically swollen limb before attributing it to established lymphedema.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1",
        "displayName": "varicose proximal territory",
        "learningObjective": "Recognize proximal outflow clues before treating visible varices as an isolated reflux problem.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.dialysis-access.maturation-physical-assessment",
        "displayName": "Assess dialysis-access maturation",
        "learningObjective": "Use look, feel, and listen examination and external specialist ultrasound when maturation remains uncertain.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
        "displayName": "Arterial assessment before venous-ulcer compression",
        "learningObjective": "Obtain arterial assessment before selecting compression for a suspected venous leg ulcer.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1",
        "displayName": "ulcer severe perfusion",
        "learningObjective": "Do not apply sustained venous-ulcer compression when a new independent perfusion result shows a severe safety boundary.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1",
        "displayName": "ulcer mixed compression",
        "learningObjective": "Use source-supported residual-perfusion criteria to distinguish selected modified compression from full-pressure or withheld compression.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1",
        "displayName": "dvt serial negative proximal",
        "learningObjective": "Keep acquisition scope and continuing clinical suspicion separate when a first proximal study is negative.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1",
        "displayName": "access hand physiology",
        "learningObjective": "Investigate an access contribution to hand ischemic symptoms rather than infer dysfunction from access flow alone.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1",
        "displayName": "access multinerve neuropathy",
        "learningObjective": "Recognize severe post-access multinerve dysfunction despite preserved skin warmth and pulse.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1",
        "displayName": "catheter intraluminal dysfunction",
        "learningObjective": "Distinguish an initial catheter-dysfunction treatment from catheter exchange after that treatment fails.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Daniel Price",
        "prototypeDemographics": {
          "ageYears": 62,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Leg swelling",
        "presentation": "{patientName}, a 62-year-old man, attends clinic after colectomy for diverticulitis. His left calf and thigh have become swollen and tender. An outside report says no thrombosis. The acquisition log lists compressible posterior tibial and peroneal veins; its femoral and popliteal fields are marked not acquired. His foot is warm and moving normally.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 62,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Leg swelling",
            "presentation": "{patientName}, a 62-year-old man, attends clinic after colectomy for diverticulitis. His left calf and thigh have become swollen and tender. An outside report says no thrombosis. The acquisition log lists compressible posterior tibial and peroneal veins; its femoral and popliteal fields are marked not acquired. His foot is warm and moving normally."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASH 2018 VTE diagnosis guideline",
          "ASH 2020 DVT and PE treatment guideline",
          "Venous Thromboembolism: Duration of Treatment"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
            "questionVariantId": "question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
            "primaryConceptId": "concept.n2.vte-prophylaxis-to-treatment",
            "currentUpdate": "The hospital's complete duplex now records a noncompressible left femoral vein. The medication administration record lists enoxaparin under postoperative prevention. A small blood spot appeared during one dressing change; the incision remains closed, drain output is serous and repeated hemoglobin values are stable. Renal function is stable.",
            "stem": "Which initial treatment plan best fits {patientName}'s returned study and medication record?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-prevention-not-failure.therapeutic-enoxaparin.v1",
                "label": "Start therapeutic enoxaparin treatment",
                "isCorrect": true,
                "rationale": "The new proximal finding needs treatment; the prior prevention prescription does not establish therapeutic failure. The represented wound/laboratory trajectory does not establish a major bleeding contraindication that requires a routine filter.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-prevention-not-failure.withhold-filter.v1",
                "label": "Withhold enoxaparin and insert a retrievable IVC filter",
                "isCorrect": false,
                "rationale": "Minor stable wound spotting is not the active major-bleeding contraindication that would support this temporary-protection pathway. Misreading it can withhold needed proximal-DVT treatment.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-prevention-not-failure.continue-prevention.v1",
                "label": "Continue the postoperative prevention prescription",
                "isCorrect": false,
                "rationale": "The prescription's prevention purpose does not become adequate treatment when a new proximal thrombus is documented; simply continuing it can undertreat the event.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The new proximal finding needs treatment; the prior prevention prescription does not establish therapeutic failure. The represented wound/laboratory trajectory does not establish a major bleeding contraindication that requires a routine filter. Minor stable wound spotting is not the active major-bleeding contraindication that would support this temporary-protection pathway. Misreading it can withhold needed proximal-DVT treatment.",
            "sourceLabels": [
              "ASH 2020 DVT and PE treatment guideline",
              "Venous Thromboembolism: Duration of Treatment"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.postop-prevention-not-failure.withhold-filter.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Minor stable wound spotting is not the active major-bleeding contraindication that would support this temporary-protection pathway. Misreading it can withhold needed proximal-DVT treatment.",
                "sourceLabels": [
                  "ASH 2020 DVT and PE treatment guideline",
                  "Venous Thromboembolism: Duration of Treatment"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.postop-prevention-not-failure.continue-prevention.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "The prescription's prevention purpose does not become adequate treatment when a new proximal thrombus is documented; simply continuing it can undertreat the event.",
                "sourceLabels": [
                  "ASH 2020 DVT and PE treatment guideline",
                  "Venous Thromboembolism: Duration of Treatment"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The new proximal finding needs treatment; the prior prevention prescription does not establish therapeutic failure. The represented wound/laboratory trajectory does not establish a major bleeding contraindication that requires a routine filter. Minor stable wound spotting is not the active major-bleeding contraindication that would support this temporary-protection pathway. Misreading it can withhold needed proximal-DVT treatment."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Daniel Price",
        "prototypeDemographics": {
          "ageYears": 62,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Leg swelling",
        "presentation": "{patientName}, a 62-year-old man, attends clinic after colectomy for diverticulitis with new left calf and thigh swelling. The outside ultrasound log lists compression images of posterior tibial and peroneal veins, which flatten under the probe. Its separate common-femoral Doppler recordings vary with respiration on both sides. No other compression images are listed.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2",
            "prototypeDemographics": {
              "ageYears": 62,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Leg swelling",
            "presentation": "{patientName}, a 62-year-old man, attends clinic after colectomy for diverticulitis with new left calf and thigh swelling. The outside ultrasound log lists compression images of posterior tibial and peroneal veins, which flatten under the probe. Its separate common-femoral Doppler recordings vary with respiration on both sides. No other compression images are listed."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Venous Thromboembolism: Duration of Treatment",
          "ASH 2020 DVT and PE treatment guideline"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
            "questionVariantId": "question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
            "primaryConceptId": "concept.postoperative-dvt.three-month-anticoagulation",
            "currentUpdate": "Hospital duplex documented a femoral DVT five days after the colectomy, and {patientName} has received therapeutic anticoagulation for three months. The operation was for diverticulitis. His wound has healed and he walks and works at his usual level. This was his first VTE. An outside genetic result, obtained earlier, reports heterozygous factor V Leiden.",
            "stem": "Which anticoagulation-duration plan best fits {patientName} at this three-month review?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-finite-course.stop-after-three-months.v2",
                "label": "Stop anticoagulation at this review",
                "isCorrect": true,
                "rationale": "The event followed major benign surgery and the observed recovery removes that transient exposure. Isolated heterozygous factor V Leiden does not by itself convert this first provoked event into an indication for indefinite therapy.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-finite-course.continue-indefinitely.v2",
                "label": "Continue anticoagulation for indefinite secondary prevention",
                "isCorrect": false,
                "rationale": "A positive inherited test is not automatically a high-risk persistent thrombophilia. The cited guide separates isolated heterozygous factor V Leiden from higher-risk thrombophilic states; the represented episode and recovery support a finite course.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-finite-course.extend-six-months.v2",
                "label": "Continue anticoagulation for six additional months",
                "isCorrect": false,
                "rationale": "A longer finite course does not resolve an assumed persistent inherited risk and is not required merely by this isolated heterozygous result after the represented surgical event.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The event followed major benign surgery and the observed recovery removes that transient exposure. Isolated heterozygous factor V Leiden does not by itself convert this first provoked event into an indication for indefinite therapy. A positive inherited test is not automatically a high-risk persistent thrombophilia. The cited guide separates isolated heterozygous factor V Leiden from higher-risk thrombophilic states; the represented episode and recovery support a finite course.",
            "sourceLabels": [
              "Venous Thromboembolism: Duration of Treatment",
              "ASH 2020 DVT and PE treatment guideline"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.postop-finite-course.continue-indefinitely.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "A positive inherited test is not automatically a high-risk persistent thrombophilia. The cited guide separates isolated heterozygous factor V Leiden from higher-risk thrombophilic states; the represented episode and recovery support a finite course.",
                "sourceLabels": [
                  "Venous Thromboembolism: Duration of Treatment",
                  "ASH 2020 DVT and PE treatment guideline"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.postop-finite-course.extend-six-months.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "A longer finite course does not resolve an assumed persistent inherited risk and is not required merely by this isolated heterozygous result after the represented surgical event.",
                "sourceLabels": [
                  "Venous Thromboembolism: Duration of Treatment",
                  "ASH 2020 DVT and PE treatment guideline"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The event followed major benign surgery and the observed recovery removes that transient exposure. Isolated heterozygous factor V Leiden does not by itself convert this first provoked event into an indication for indefinite therapy. A positive inherited test is not automatically a high-risk persistent thrombophilia. The cited guide separates isolated heterozygous factor V Leiden from higher-risk thrombophilic states; the represented episode and recovery support a finite course."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Rachel Ellis",
        "prototypeDemographics": {
          "ageYears": 47,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Thigh swelling",
        "presentation": "{patientName}, a 47-year-old woman, attends clinic after bowel surgery with new right-thigh and calf swelling. Her discharge note cites a negative scan. The scan label and saved images identify the left leg. The right foot is warm, with preserved movement and sensation.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 47,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Thigh swelling",
            "presentation": "{patientName}, a 47-year-old woman, attends clinic after bowel surgery with new right-thigh and calf swelling. Her discharge note cites a negative scan. The scan label and saved images identify the left leg. The right foot is warm, with preserved movement and sensation."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASH 2018 VTE diagnosis guideline",
          "Venous Thromboembolism: Duration of Treatment",
          "ASH 2020 DVT and PE treatment guideline"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
            "questionVariantId": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
            "primaryConceptId": "concept.postoperative-dvt.three-month-anticoagulation",
            "currentUpdate": "The right-leg study subsequently showed a femoral DVT. {patientName} completed three months of therapeutic anticoagulation after surgery for benign disease. She is back to usual mobility, without a continuing provoking condition. A repeat study shows the same femoral segment as the index examination, with no newly involved segment; swelling has decreased. This remains her first VTE.",
            "stem": "Which treatment-duration plan best fits {patientName}'s current record?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-residual-duration.finish-three-months.v1",
                "label": "End anticoagulation after the completed three-month course",
                "isCorrect": true,
                "rationale": "The event was tied to resolved surgery and the course is complete. Unchanged residual material without a newly involved segment does not create a new event that automatically restarts treatment.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-residual-duration.continue-until-clear.v1",
                "label": "Continue anticoagulation until ultrasound is normal",
                "isCorrect": false,
                "rationale": "Residual material is a common reason to overextend treatment. Treating a stable image as ongoing new thrombosis can prolong bleeding exposure without an established new indication.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.postop-residual-duration.restart-course.v1",
                "label": "Restart a new three-month therapeutic course",
                "isCorrect": false,
                "rationale": "The comparison records the same segment and less swelling, not a new clot. Restarting the clock treats persistence as recurrence.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The event was tied to resolved surgery and the course is complete. Unchanged residual material without a newly involved segment does not create a new event that automatically restarts treatment. Residual material is a common reason to overextend treatment. Treating a stable image as ongoing new thrombosis can prolong bleeding exposure without an established new indication.",
            "sourceLabels": [
              "ASH 2018 VTE diagnosis guideline",
              "Venous Thromboembolism: Duration of Treatment",
              "ASH 2020 DVT and PE treatment guideline"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.postop-residual-duration.continue-until-clear.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Residual material is a common reason to overextend treatment. Treating a stable image as ongoing new thrombosis can prolong bleeding exposure without an established new indication.",
                "sourceLabels": [
                  "ASH 2018 VTE diagnosis guideline",
                  "Venous Thromboembolism: Duration of Treatment",
                  "ASH 2020 DVT and PE treatment guideline"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.postop-residual-duration.restart-course.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "The comparison records the same segment and less swelling, not a new clot. Restarting the clock treats persistence as recurrence.",
                "sourceLabels": [
                  "ASH 2018 VTE diagnosis guideline",
                  "Venous Thromboembolism: Duration of Treatment",
                  "ASH 2020 DVT and PE treatment guideline"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The event was tied to resolved surgery and the course is complete. Unchanged residual material without a newly involved segment does not create a new event that automatically restarts treatment. Residual material is a common reason to overextend treatment. Treating a stable image as ongoing new thrombosis can prolong bleeding exposure without an established new indication."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Nora Bennett",
        "prototypeDemographics": {
          "ageYears": 61,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Arm swelling changed",
        "presentation": "{patientName}, a 61-year-old woman, attends clinic after abdominal surgery. Her left arm has been mildly enlarged since earlier axillary-node treatment, but it became painful and substantially more swollen during this recovery. A peripheral line was used in that arm. The change extends from hand to upper arm.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
            "prototypeDemographics": {
              "ageYears": 61,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Arm swelling changed",
            "presentation": "{patientName}, a 61-year-old woman, attends clinic after abdominal surgery. Her left arm has been mildly enlarged since earlier axillary-node treatment, but it became painful and substantially more swollen during this recovery. A peripheral line was used in that arm. The change extends from hand to upper arm."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASH 2018 VTE diagnosis guideline",
          "Lymphedema (PDQ) Health Professional Version",
          "ISL 2023 peripheral lymphedema consensus"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
            "questionVariantId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
            "primaryConceptId": "concept.n1.lymphedema-new-tempo-venous-assessment",
            "stem": "Which investigation should guide {patientName}'s changed left-arm swelling now?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.arm-venous-duplex.v2",
                "label": "Left-arm deep-venous duplex ultrasound",
                "isCorrect": true,
                "rationale": "A chronic nodal-treatment history does not account for the new painful postoperative change; the symptomatic venous territory needs evaluation before chronic treatment is escalated.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.lymphoscintigraphy.v2",
                "label": "Left-arm radionuclide lymphoscintigraphy",
                "isCorrect": false,
                "rationale": "Lymphoscintigraphy may characterize a chronic lymphatic disorder, but does not first address the new postoperative venous concern. Anchoring on the old cause could delay treatment of a new clot.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.central-venography.v2",
                "label": "Chest CT venography",
                "isCorrect": false,
                "rationale": "Central disease can cause arm swelling, but an initial deep-arm duplex is the appropriate first venous acquisition for this acute symptomatic limb without a completed peripheral study.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "A chronic nodal-treatment history does not account for the new painful postoperative change; the symptomatic venous territory needs evaluation before chronic treatment is escalated. Lymphoscintigraphy may characterize a chronic lymphatic disorder, but does not first address the new postoperative venous concern. Anchoring on the old cause could delay treatment of a new clot.",
            "sourceLabels": [
              "ASH 2018 VTE diagnosis guideline",
              "Lymphedema (PDQ) Health Professional Version",
              "ISL 2023 peripheral lymphedema consensus"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.lymphoscintigraphy.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Lymphoscintigraphy may characterize a chronic lymphatic disorder, but does not first address the new postoperative venous concern. Anchoring on the old cause could delay treatment of a new clot.",
                "sourceLabels": [
                  "ASH 2018 VTE diagnosis guideline",
                  "Lymphedema (PDQ) Health Professional Version",
                  "ISL 2023 peripheral lymphedema consensus"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.central-venography.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Central disease can cause arm swelling, but an initial deep-arm duplex is the appropriate first venous acquisition for this acute symptomatic limb without a completed peripheral study.",
                "sourceLabels": [
                  "ASH 2018 VTE diagnosis guideline",
                  "Lymphedema (PDQ) Health Professional Version",
                  "ISL 2023 peripheral lymphedema consensus"
                ]
              }
            ]
          }
        ],
        "learningSummary": "A chronic nodal-treatment history does not account for the new painful postoperative change; the symptomatic venous territory needs evaluation before chronic treatment is escalated. Lymphoscintigraphy may characterize a chronic lymphatic disorder, but does not first address the new postoperative venous concern. Anchoring on the old cause could delay treatment of a new clot."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "George Nolan",
        "prototypeDemographics": {
          "ageYears": 59,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Leg heaviness",
        "presentation": "{patientName}, a 59-year-old man, attends clinic for varices and swelling extending above the knee. Walking produces thigh fullness that settles after he elevates the leg. New veins cross the lower abdomen. Duplex shows compressible femoral and popliteal veins; left common-femoral flow is continuous while the right varies with respiration.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 59,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Leg heaviness",
            "presentation": "{patientName}, a 59-year-old man, attends clinic for varices and swelling extending above the knee. Walking produces thigh fullness that settles after he elevates the leg. New veins cross the lower abdomen. Duplex shows compressible femoral and popliteal veins; left common-femoral flow is continuous while the right varies with respiration."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "SVS/AVF/AVLS varicose veins guideline Part II"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
            "questionVariantId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
            "primaryConceptId": "concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1",
            "stem": "Which study should {patientName}'s team arrange next?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.iliac-venography.v1",
                "label": "Iliac and pelvic CT venography",
                "isCorrect": true,
                "rationale": "The whole-limb distribution, abdominal collaterals and unilateral loss of respiratory variation warrant evaluation above the compressible leg segments.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.repeat-proximal.v1",
                "label": "Repeat femoral and popliteal compression duplex",
                "isCorrect": false,
                "rationale": "A repeated examination of the same compressible segments would not settle the pelvic territory suggested by the waveform and collateral pattern.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.lymphatic-scan.v1",
                "label": "Lower-limb radionuclide lymphoscintigraphy",
                "isCorrect": false,
                "rationale": "Chronic swelling can be lymphatic, but collateral veins and the asymmetric venous waveform point to an unresolved outflow question first.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The whole-limb distribution, abdominal collaterals and unilateral loss of respiratory variation warrant evaluation above the compressible leg segments. A repeated examination of the same compressible segments would not settle the pelvic territory suggested by the waveform and collateral pattern.",
            "sourceLabels": [
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.repeat-proximal.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "A repeated examination of the same compressible segments would not settle the pelvic territory suggested by the waveform and collateral pattern.",
                "sourceLabels": [
                  "SVS/AVF/AVLS varicose veins guideline Part II"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.lymphatic-scan.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Chronic swelling can be lymphatic, but collateral veins and the asymmetric venous waveform point to an unresolved outflow question first.",
                "sourceLabels": [
                  "SVS/AVF/AVLS varicose veins guideline Part II"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The whole-limb distribution, abdominal collaterals and unilateral loss of respiratory variation warrant evaluation above the compressible leg segments. A repeated examination of the same compressible segments would not settle the pelvic territory suggested by the waveform and collateral pattern."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Paula Reed",
        "prototypeDemographics": {
          "ageYears": 45,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Fistula follow-up",
        "presentation": "{patientName}, a 45-year-old woman, attends clinic eight weeks after left radiocephalic fistula creation. The wrist segment is visibly enlarged, but it is firm and pulsatile with only a short systolic thrill. The enlarged forearm vein remains distended when the arm is raised. No forearm segment has developed a sustained continuous thrill on serial examinations. The dialysis team has not cannulated it.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2",
            "prototypeDemographics": {
              "ageYears": 45,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Fistula follow-up",
            "presentation": "{patientName}, a 45-year-old woman, attends clinic eight weeks after left radiocephalic fistula creation. The wrist segment is visibly enlarged, but it is firm and pulsatile with only a short systolic thrill. The enlarged forearm vein remains distended when the arm is raised. No forearm segment has developed a sustained continuous thrill on serial examinations. The dialysis team has not cannulated it."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "UK Kidney Association vascular access guideline",
          "KDOQI vascular access 2019 update"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
            "questionVariantId": "question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
            "primaryConceptId": "concept.dialysis-access.maturation-physical-assessment",
            "stem": "Which next access plan best fits {patientName}'s serial examination?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.access-unresolved-maturation.flow-anatomy-duplex.v2",
                "label": "Arrange duplex mapping of access inflow, flow and outflow",
                "isCorrect": true,
                "rationale": "Visible wrist enlargement does not establish a matured cannulation circuit. The persistently abnormal thrill and arm-elevation pattern beyond the usual assessment period justify investigating flow/anatomy rather than another observation cycle or attempted first use.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.access-unresolved-maturation.guided-cannulation.v2",
                "label": "Arrange an ultrasound-guided first-cannulation attempt",
                "isCorrect": false,
                "rationale": "Guidance can help locate an established usable segment, but it does not settle the represented persistent flow/maturation concern. The abnormal serial examination needs anatomical and flow characterization before trial use.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.access-unresolved-maturation.further-observation.v2",
                "label": "Arrange another clinical maturation review before imaging",
                "isCorrect": false,
                "rationale": "Observation can be appropriate early after creation when maturation is progressing. The eight-week record instead describes a persistently abnormal circuit on serial examinations, so another examination without investigation leaves the important question unresolved.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Visible wrist enlargement does not establish a matured cannulation circuit. The persistently abnormal thrill and arm-elevation pattern beyond the usual assessment period justify investigating flow/anatomy rather than another observation cycle or attempted first use. Guidance can help locate an established usable segment, but it does not settle the represented persistent flow/maturation concern. The abnormal serial examination needs anatomical and flow characterization before trial use.",
            "sourceLabels": [
              "UK Kidney Association vascular access guideline",
              "KDOQI vascular access 2019 update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.access-unresolved-maturation.guided-cannulation.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Guidance can help locate an established usable segment, but it does not settle the represented persistent flow/maturation concern. The abnormal serial examination needs anatomical and flow characterization before trial use.",
                "sourceLabels": [
                  "UK Kidney Association vascular access guideline",
                  "KDOQI vascular access 2019 update"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.access-unresolved-maturation.further-observation.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Observation can be appropriate early after creation when maturation is progressing. The eight-week record instead describes a persistently abnormal circuit on serial examinations, so another examination without investigation leaves the important question unresolved.",
                "sourceLabels": [
                  "UK Kidney Association vascular access guideline",
                  "KDOQI vascular access 2019 update"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Visible wrist enlargement does not establish a matured cannulation circuit. The persistently abnormal thrill and arm-elevation pattern beyond the usual assessment period justify investigating flow/anatomy rather than another observation cycle or attempted first use. Guidance can help locate an established usable segment, but it does not settle the represented persistent flow/maturation concern. The abnormal serial examination needs anatomical and flow characterization before trial use."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Joan Fletcher",
        "prototypeDemographics": {
          "ageYears": 70,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Recurrent ankle wound",
        "presentation": "{patientName}, a 70-year-old woman with diabetes and kidney disease, attends clinic for a recurrent left medial-ankle ulcer and swelling. Duplex shows superficial reflux. During ankle testing, pedal Doppler signals persist at the cuff's maximum inflation; the sheet prints a high ankle-to-brachial ratio from that attempt.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 70,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Recurrent ankle wound",
            "presentation": "{patientName}, a 70-year-old woman with diabetes and kidney disease, attends clinic for a recurrent left medial-ankle ulcer and swelling. Duplex shows superficial reflux. During ankle testing, pedal Doppler signals persist at the cuff's maximum inflation; the sheet prints a high ankle-to-brachial ratio from that attempt."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "2024 multisociety PAD guideline: diagnostic physiology",
          "EVRA early versus deferred ablation trial report",
          "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
            "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
            "primaryConceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
            "stem": "Which investigation should guide {patientName}'s compression selection next?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.toe-waveforms.v1",
                "label": "Left toe pressure and digital waveform testing",
                "isCorrect": true,
                "rationale": "The ankle acquisition did not occlude arterial flow, so its high printed ratio cannot establish adequate perfusion. Toe/digital physiology addresses that limitation.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.exercise-ankle.v1",
                "label": "Left exercise ankle-pressure testing",
                "isCorrect": false,
                "rationale": "Exercise testing can uncover exertional PAD when resting ankle measures are interpretable; it does not correct failure to occlude the artery at rest.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.arterial-cta.v1",
                "label": "Left-leg CT angiography",
                "isCorrect": false,
                "rationale": "Angiography may be needed for a later revascularization decision, but it does not first provide the missing quantitative tissue-level physiologic assessment.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The ankle acquisition did not occlude arterial flow, so its high printed ratio cannot establish adequate perfusion. Toe/digital physiology addresses that limitation. Exercise testing can uncover exertional PAD when resting ankle measures are interpretable; it does not correct failure to occlude the artery at rest.",
            "sourceLabels": [
              "2024 multisociety PAD guideline: diagnostic physiology",
              "EVRA early versus deferred ablation trial report",
              "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
            "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
            "primaryConceptId": "concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1",
            "currentUpdate": "Toe testing now records a left pressure of 22 mm Hg with a markedly damped digital waveform. {patientName} describes new forefoot pain at night that improves when she sits with the foot dependent. The old printed ankle ratio remains on the front of the chart.",
            "stem": "Which ulcer-care plan should {patientName}'s team use now?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-severe-perfusion.withhold-and-assess.v1",
                "label": "Withhold sustained compression and obtain arterial assessment",
                "isCorrect": true,
                "rationale": "The new toe pressure is below the ESVS severe-perfusion boundary, and rest symptoms strengthen the concern. Venous reflux does not override this compression contraindication.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-severe-perfusion.modified-pressure.v1",
                "label": "Start modified compression below 40 mm Hg with supervision",
                "isCorrect": false,
                "rationale": "Modification is tempting when venous disease is real, but it requires adequate residual perfusion; the represented toe pressure does not meet the ESVS discussion boundary.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-severe-perfusion.standard-pressure.v1",
                "label": "Start multilayer compression targeting at least 40 mm Hg",
                "isCorrect": false,
                "rationale": "This treats the venous component but disregards the new arterial safety evidence and could worsen ischemic injury.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The new toe pressure is below the ESVS severe-perfusion boundary, and rest symptoms strengthen the concern. Venous reflux does not override this compression contraindication. Modification is tempting when venous disease is real, but it requires adequate residual perfusion; the represented toe pressure does not meet the ESVS discussion boundary.",
            "sourceLabels": [
              "2024 multisociety PAD guideline: diagnostic physiology",
              "EVRA early versus deferred ablation trial report",
              "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.ulcer-severe-perfusion.modified-pressure.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Modification is tempting when venous disease is real, but it requires adequate residual perfusion; the represented toe pressure does not meet the ESVS discussion boundary.",
                "sourceLabels": [
                  "2024 multisociety PAD guideline: diagnostic physiology",
                  "EVRA early versus deferred ablation trial report",
                  "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.ulcer-severe-perfusion.standard-pressure.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "This treats the venous component but disregards the new arterial safety evidence and could worsen ischemic injury.",
                "sourceLabels": [
                  "2024 multisociety PAD guideline: diagnostic physiology",
                  "EVRA early versus deferred ablation trial report",
                  "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The ankle acquisition did not occlude arterial flow, so its high printed ratio cannot establish adequate perfusion. Toe/digital physiology addresses that limitation. Exercise testing can uncover exertional PAD when resting ankle measures are interpretable; it does not correct failure to occlude the artery at rest. The new toe pressure is below the ESVS severe-perfusion boundary, and rest symptoms strengthen the concern. Venous reflux does not override this compression contraindication. Modification is tempting when venous disease is real, but it requires adequate residual perfusion; the represented toe pressure does not meet the ESVS discussion boundary."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Sara Mills",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Ankle discoloration",
        "presentation": "{patientName}, a 49-year-old woman, attends clinic with a medial-ankle ulcer, dependent edema and duplex-confirmed superficial reflux. The left ankle pressure is 90 mm Hg, brachial pressure 125 mm Hg and toe pressure 55 mm Hg. She has no rest pain or tissue loss beyond the shallow ulcer. The wound team will supervise treatment.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Ankle discoloration",
            "presentation": "{patientName}, a 49-year-old woman, attends clinic with a medial-ankle ulcer, dependent edema and duplex-confirmed superficial reflux. The left ankle pressure is 90 mm Hg, brachial pressure 125 mm Hg and toe pressure 55 mm Hg. She has no rest pain or tissue loss beyond the shallow ulcer. The wound team will supervise treatment."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "2024 multisociety PAD guideline: diagnostic physiology",
          "EVRA early versus deferred ablation trial report",
          "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
            "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
            "primaryConceptId": "concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1",
            "stem": "Which compression strategy should {patientName}'s wound team consider?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-mixed-compression.modified.v1",
                "label": "Modified compression below 40 mm Hg at the ankle",
                "isCorrect": true,
                "rationale": "The ankle pressure, toe pressure and ankle-to-brachial relationship fit the ESVS discussion for considering monitored modification in selected mixed disease. This is a conditional pathway, not a universal pressure prescription.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-mixed-compression.standard.v1",
                "label": "Multilayer compression of at least 40 mm Hg at the ankle",
                "isCorrect": false,
                "rationale": "The arterial measurements are not those of an uncomplicated venous-ulcer cohort. Ignoring that component risks selecting an unnecessarily intense initial compression strategy.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.ulcer-mixed-compression.defer.v1",
                "label": "Defer sustained compression for arterial intervention assessment",
                "isCorrect": false,
                "rationale": "Not every represented arterial deficit requires withholding all sustained compression; the current absolute pressures are above the severe ESVS boundaries and support a monitored modified-care option.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The ankle pressure, toe pressure and ankle-to-brachial relationship fit the ESVS discussion for considering monitored modification in selected mixed disease. This is a conditional pathway, not a universal pressure prescription. The arterial measurements are not those of an uncomplicated venous-ulcer cohort. Ignoring that component risks selecting an unnecessarily intense initial compression strategy.",
            "sourceLabels": [
              "2024 multisociety PAD guideline: diagnostic physiology",
              "EVRA early versus deferred ablation trial report",
              "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.ulcer-mixed-compression.standard.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "The arterial measurements are not those of an uncomplicated venous-ulcer cohort. Ignoring that component risks selecting an unnecessarily intense initial compression strategy.",
                "sourceLabels": [
                  "2024 multisociety PAD guideline: diagnostic physiology",
                  "EVRA early versus deferred ablation trial report",
                  "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.ulcer-mixed-compression.defer.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Not every represented arterial deficit requires withholding all sustained compression; the current absolute pressures are above the severe ESVS boundaries and support a monitored modified-care option.",
                "sourceLabels": [
                  "2024 multisociety PAD guideline: diagnostic physiology",
                  "EVRA early versus deferred ablation trial report",
                  "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The ankle pressure, toe pressure and ankle-to-brachial relationship fit the ESVS discussion for considering monitored modification in selected mixed disease. This is a conditional pathway, not a universal pressure prescription. The arterial measurements are not those of an uncomplicated venous-ulcer cohort. Ignoring that component risks selecting an unnecessarily intense initial compression strategy."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Victor Hale",
        "prototypeDemographics": {
          "ageYears": 66,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Leg scan review",
        "presentation": "{patientName}, a 66-year-old man, attends clinic after hip surgery with persistent new left calf swelling and tenderness. Initial ultrasound compression images show the common-femoral, femoral and popliteal veins flattening. Calf-vein acquisition was not part of that examination. The left and right common-femoral flow recordings both vary with respiration. No alternative cause has been identified at reassessment.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Leg scan review",
            "presentation": "{patientName}, a 66-year-old man, attends clinic after hip surgery with persistent new left calf swelling and tenderness. Initial ultrasound compression images show the common-femoral, femoral and popliteal veins flattening. Calf-vein acquisition was not part of that examination. The left and right common-femoral flow recordings both vary with respiration. No alternative cause has been identified at reassessment."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASH 2018 VTE diagnosis guideline",
          "SVS/AVF/AVLS varicose veins guideline Part II"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
            "questionVariantId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
            "primaryConceptId": "concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1",
            "stem": "Which diagnostic plan best fits {patientName}'s persistent postoperative calf findings?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.serial-proximal.v2",
                "label": "Arrange serial proximal compression ultrasound",
                "isCorrect": true,
                "rationale": "A negative proximal-only acquisition does not settle every distal event or remove the need for follow-up when clinically important postoperative concern persists. Serial proximal ultrasound is a supported strategy to detect interval proximal disease; it is not the only valid strategy if adequate whole-leg ultrasound is chosen instead.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.iliocaval-imaging.v2",
                "label": "Arrange iliocaval CT venography",
                "isCorrect": false,
                "rationale": "Iliocaval imaging is useful when symptoms and common-femoral waveforms point to proximal outflow disease. Here calf-limited findings and preserved bilateral respiratory variation do not redirect the unresolved question to that territory.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.end-venous-testing.v2",
                "label": "End venous testing and reassess the edema clinically",
                "isCorrect": false,
                "rationale": "That plan can follow an adequate negative evaluation in an appropriate diagnostic pathway. This record represents a proximal-only examination with persistent postoperative concern and no alternative explanation, so it does not establish that venous testing is finished.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "A negative proximal-only acquisition does not settle every distal event or remove the need for follow-up when clinically important postoperative concern persists. Serial proximal ultrasound is a supported strategy to detect interval proximal disease; it is not the only valid strategy if adequate whole-leg ultrasound is chosen instead. Iliocaval imaging is useful when symptoms and common-femoral waveforms point to proximal outflow disease. Here calf-limited findings and preserved bilateral respiratory variation do not redirect the unresolved question to that territory.",
            "sourceLabels": [
              "ASH 2018 VTE diagnosis guideline",
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.iliocaval-imaging.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Iliocaval imaging is useful when symptoms and common-femoral waveforms point to proximal outflow disease. Here calf-limited findings and preserved bilateral respiratory variation do not redirect the unresolved question to that territory.",
                "sourceLabels": [
                  "ASH 2018 VTE diagnosis guideline",
                  "SVS/AVF/AVLS varicose veins guideline Part II"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.end-venous-testing.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "That plan can follow an adequate negative evaluation in an appropriate diagnostic pathway. This record represents a proximal-only examination with persistent postoperative concern and no alternative explanation, so it does not establish that venous testing is finished.",
                "sourceLabels": [
                  "ASH 2018 VTE diagnosis guideline",
                  "SVS/AVF/AVLS varicose veins guideline Part II"
                ]
              }
            ]
          }
        ],
        "learningSummary": "A negative proximal-only acquisition does not settle every distal event or remove the need for follow-up when clinically important postoperative concern persists. Serial proximal ultrasound is a supported strategy to detect interval proximal disease; it is not the only valid strategy if adequate whole-leg ultrasound is chosen instead. Iliocaval imaging is useful when symptoms and common-femoral waveforms point to proximal outflow disease. Here calf-limited findings and preserved bilateral respiratory variation do not redirect the unresolved question to that territory."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Marian Scott",
        "prototypeDemographics": {
          "ageYears": 60,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Hand pain during dialysis",
        "presentation": "{patientName}, a 60-year-old woman, attends clinic with new aching and coolness of her fistula-side fingers during dialysis and while carrying groceries. Numbness involves the thumb, index finger and little finger; it settles between episodes. A prior nerve-conduction report, obtained before fistula creation for nocturnal thumb/index tingling, showed slowed median conduction at the wrist. The access still delivers the prescribed dialysis.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
            "prototypeDemographics": {
              "ageYears": 60,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Hand pain during dialysis",
            "presentation": "{patientName}, a 60-year-old woman, attends clinic with new aching and coolness of her fistula-side fingers during dialysis and while carrying groceries. Numbness involves the thumb, index finger and little finger; it settles between episodes. A prior nerve-conduction report, obtained before fistula creation for nocturnal thumb/index tingling, showed slowed median conduction at the wrist. The access still delivers the prescribed dialysis."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "UK Kidney Association vascular access guideline",
          "KDOQI vascular access 2019 update"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
            "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
            "primaryConceptId": "concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1",
            "stem": "Which investigation should {patientName}'s access team prioritize for the new hand episodes?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.access-hand-physiology.compression-perfusion.v2",
                "label": "Digital pressures and waveforms during access-compression testing",
                "isCorrect": true,
                "rationale": "The old wrist study can explain the earlier nocturnal thumb/index symptoms but does not settle new coolness and activity/dialysis-associated symptoms extending to the little finger. Dynamic perfusion assessment evaluates a possible access contribution despite satisfactory delivered dialysis.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.access-hand-physiology.repeat-median-study.v2",
                "label": "Repeat nerve-conduction testing across the wrist",
                "isCorrect": false,
                "rationale": "The prior median finding is genuine, but repeating it first risks anchoring on the old problem while the new coolness, little-finger involvement and dialysis relationship call for perfusion assessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.access-hand-physiology.cervical-mri.v2",
                "label": "Cervical-spine magnetic resonance imaging",
                "isCorrect": false,
                "rationale": "Cervical disease can produce hand symptoms across peripheral nerve distributions, but the represented new coolness and reproducible dialysis/activity relationship do not prioritize a structural cervical investigation ahead of hand perfusion.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The old wrist study can explain the earlier nocturnal thumb/index symptoms but does not settle new coolness and activity/dialysis-associated symptoms extending to the little finger. Dynamic perfusion assessment evaluates a possible access contribution despite satisfactory delivered dialysis. The prior median finding is genuine, but repeating it first risks anchoring on the old problem while the new coolness, little-finger involvement and dialysis relationship call for perfusion assessment.",
            "sourceLabels": [
              "UK Kidney Association vascular access guideline",
              "KDOQI vascular access 2019 update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.access-hand-physiology.repeat-median-study.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "The prior median finding is genuine, but repeating it first risks anchoring on the old problem while the new coolness, little-finger involvement and dialysis relationship call for perfusion assessment.",
                "sourceLabels": [
                  "UK Kidney Association vascular access guideline",
                  "KDOQI vascular access 2019 update"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.access-hand-physiology.cervical-mri.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Cervical disease can produce hand symptoms across peripheral nerve distributions, but the represented new coolness and reproducible dialysis/activity relationship do not prioritize a structural cervical investigation ahead of hand perfusion.",
                "sourceLabels": [
                  "UK Kidney Association vascular access guideline",
                  "KDOQI vascular access 2019 update"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The old wrist study can explain the earlier nocturnal thumb/index symptoms but does not settle new coolness and activity/dialysis-associated symptoms extending to the little finger. Dynamic perfusion assessment evaluates a possible access contribution despite satisfactory delivered dialysis. The prior median finding is genuine, but repeating it first risks anchoring on the old problem while the new coolness, little-finger involvement and dialysis relationship call for perfusion assessment."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Lydia Park",
        "prototypeDemographics": {
          "ageYears": 58,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Hand weakness review",
        "presentation": "{patientName}, a 58-year-old woman, attends clinic to review an outside admission after brachial-based fistula creation. Once the regional anesthetic had resolved, she had severe hand pain and new weakness of finger abduction, thumb opposition and wrist extension, with sensory loss across several nerve territories. The hand remained warm with a palpable radial pulse; the forearm was soft.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 58,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Hand weakness review",
            "presentation": "{patientName}, a 58-year-old woman, attends clinic to review an outside admission after brachial-based fistula creation. Once the regional anesthetic had resolved, she had severe hand pain and new weakness of finger abduction, thumb opposition and wrist extension, with sensory loss across several nerve territories. The hand remained warm with a palpable radial pulse; the forearm was soft."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "UK Kidney Association vascular access guideline",
          "KDOQI vascular access 2019 update"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
            "questionVariantId": "question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
            "primaryConceptId": "concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1",
            "stem": "Which plan best fits that point in {patientName}'s outside postoperative record?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.access-multinerve-neuropathy.urgent-ligation-review.v1",
                "label": "Immediate vascular assessment for access ligation",
                "isCorrect": true,
                "rationale": "The acute multinerve motor/sensory deficit after access creation can represent ischemic monomelic neuropathy despite a warm hand and pulse. Urgent assessment for closure is required rather than waiting for a confirmatory study.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.access-multinerve-neuropathy.delayed-electrophysiology.v1",
                "label": "Observation pending formal nerve-conduction testing",
                "isCorrect": false,
                "rationale": "A warm hand and pulse can falsely reassure. Waiting for an elective confirmatory test risks losing time in a potentially irreversible access-related neurologic injury.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.access-multinerve-neuropathy.carpal-release.v1",
                "label": "Hand-surgery assessment for carpal-tunnel release",
                "isCorrect": false,
                "rationale": "Carpal tunnel disease does not explain simultaneous deficits across the represented median, ulnar and radial motor territories immediately after access creation.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The acute multinerve motor/sensory deficit after access creation can represent ischemic monomelic neuropathy despite a warm hand and pulse. Urgent assessment for closure is required rather than waiting for a confirmatory study. A warm hand and pulse can falsely reassure. Waiting for an elective confirmatory test risks losing time in a potentially irreversible access-related neurologic injury.",
            "sourceLabels": [
              "UK Kidney Association vascular access guideline",
              "KDOQI vascular access 2019 update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.access-multinerve-neuropathy.delayed-electrophysiology.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "A warm hand and pulse can falsely reassure. Waiting for an elective confirmatory test risks losing time in a potentially irreversible access-related neurologic injury.",
                "sourceLabels": [
                  "UK Kidney Association vascular access guideline",
                  "KDOQI vascular access 2019 update"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.access-multinerve-neuropathy.carpal-release.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Carpal tunnel disease does not explain simultaneous deficits across the represented median, ulnar and radial motor territories immediately after access creation.",
                "sourceLabels": [
                  "UK Kidney Association vascular access guideline",
                  "KDOQI vascular access 2019 update"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The acute multinerve motor/sensory deficit after access creation can represent ischemic monomelic neuropathy despite a warm hand and pulse. Urgent assessment for closure is required rather than waiting for a confirmatory study. A warm hand and pulse can falsely reassure. Waiting for an elective confirmatory test risks losing time in a potentially irreversible access-related neurologic injury."
      },
      {
        "id": "case.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v2",
        "displayName": "{patientName}: venous/access review",
        "patientPresentationVariantId": "presentation.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Patrick Doyle",
        "prototypeDemographics": {
          "ageYears": 61,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Dialysis access review",
        "presentation": "{patientName}, a 61-year-old man, attends clinic to review his outside dialysis-access course. At the first decision point, a tunneled catheter was being selected while his new left-arm fistula remained too deep for use. Ultrasound showed patent right and left internal jugular veins; central outflow was patent. The left-arm fistula remained the intended permanent access.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v1",
            "prototypeDemographics": {
              "ageYears": 61,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Dialysis access review",
            "presentation": "{patientName}, a 61-year-old man, attends clinic to review his outside dialysis-access course. At the first decision point, a tunneled catheter was being selected while his new left-arm fistula remained too deep for use. Ultrasound showed patent right and left internal jugular veins; central outflow was patent. The left-arm fistula remained the intended permanent access."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "UK Kidney Association vascular access guideline",
          "KDOQI vascular access 2019 update"
        ],
        "decisionNodes": [
          {
            "id": "node.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
            "questionVariantId": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
            "primaryConceptId": "concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1",
            "currentUpdate": "Later, the established right-jugular catheter repeatedly fails to deliver the prescribed dialysis flow. Repositioning does not correct it. Chest imaging shows an unchanged tip position and no catheter kink; the treatment log records saline flushing and the usual heparin lock. There are no fever or bloodstream-infection findings during this episode.",
            "stem": "Which treatment should the outside dialysis team try next for {patientName}'s later catheter dysfunction?",
            "answerChoices": [
              {
                "id": "choice.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.alteplase-lock.v1",
                "label": "An alteplase lock in each catheter lumen",
                "isCorrect": true,
                "rationale": "After positional/mechanical checks, a thrombolytic lumen lock is an appropriate initial treatment for this established low-flow catheter. It is delivered by trained dialysis staff under a local protocol.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.catheter-exchange.v1",
                "label": "Catheter exchange over a guidewire",
                "isCorrect": false,
                "rationale": "Exchange is an appropriate next pathway when thrombolytics fail or a mechanical indication is established, but the current log has not demonstrated failure of a thrombolytic treatment.",
                "serviceRequest": null
              },
              {
                "id": "choice.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.systemic-heparin.v1",
                "label": "A systemic intravenous heparin infusion",
                "isCorrect": false,
                "rationale": "Systemic anticoagulation is not the represented initial lumen-directed treatment for dialysis-catheter dysfunction and adds an unnecessary systemic exposure for this question.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "After positional/mechanical checks, a thrombolytic lumen lock is an appropriate initial treatment for this established low-flow catheter. It is delivered by trained dialysis staff under a local protocol. Exchange is an appropriate next pathway when thrombolytics fail or a mechanical indication is established, but the current log has not demonstrated failure of a thrombolytic treatment.",
            "sourceLabels": [
              "UK Kidney Association vascular access guideline",
              "KDOQI vascular access 2019 update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.catheter-exchange.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Exchange is an appropriate next pathway when thrombolytics fail or a mechanical indication is established, but the current log has not demonstrated failure of a thrombolytic treatment.",
                "sourceLabels": [
                  "UK Kidney Association vascular access guideline",
                  "KDOQI vascular access 2019 update"
                ]
              },
              {
                "answerChoiceId": "choice.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.systemic-heparin.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no outside procedure or patient outcome is simulated.",
                "clinicalRationale": "Systemic anticoagulation is not the represented initial lumen-directed treatment for dialysis-catheter dysfunction and adds an unnecessary systemic exposure for this question.",
                "sourceLabels": [
                  "UK Kidney Association vascular access guideline",
                  "KDOQI vascular access 2019 update"
                ]
              }
            ]
          }
        ],
        "learningSummary": "After positional/mechanical checks, a thrombolytic lumen lock is an appropriate initial treatment for this established low-flow catheter. It is delivered by trained dialysis staff under a local protocol. Exchange is an appropriate next pathway when thrombolytics fail or a mechanical indication is established, but the current log has not demonstrated failure of a thrombolytic treatment."
      }
    ]
  },
  "topic-batch5-esophagus-motility-achalasia": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1",
        "displayName": "recurrent clearance test",
        "learningObjective": "Choose objective clearance assessment when recurrent symptoms and post-myotomy pressure findings disagree.",
        "earliestFacilityStage": 2,
        "conceptType": "workup"
      }
    ],
    "cases": [
      {
        "id": "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2",
        "displayName": "Painful swallowing",
        "patientPresentationVariantId": "presentation.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Maya Bennett",
        "prototypeDemographics": {
          "ageYears": 45,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Painful swallowing",
        "presentation": "{patientName}, a 45-year-old woman, attends clinic for review of her swallowing evaluation and subsequent outside foregut records.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v1",
            "prototypeDemographics": {
              "ageYears": 45,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Painful swallowing",
            "presentation": "{patientName}, a 45-year-old woman, attends clinic for review of her swallowing evaluation and subsequent outside foregut records."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Original constructed clinical teaching record",
          "Clinical review pending Melissa Rowland"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
            "questionVariantId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
            "primaryConceptId": "concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1",
            "currentUpdate": "Her original foregut records document achalasia treated with POEM, followed by a period of comfortable eating. At this postoperative reassessment, food again pauses and fluid returns at night. The completed repeat manometry has adequate junction-crossing positional acquisition, relaxation within the laboratory interval and no residual premature contractions. Her weight and oral hydration are maintained.",
            "stem": "Which investigation should next assess {patientName}'s recurrent symptoms after POEM?",
            "answerChoices": [
              {
                "id": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.endoscopy",
                "label": "Upper endoscopy with esophageal and junction inspection",
                "isCorrect": false,
                "rationale": "Endoscopy can identify reflux injury or a post-treatment narrowing and may be complementary in the full reassessment. For this stable recurrent food-and-fluid hold-up, timed barium is the guideline-supported first objective test of emptying; the reassuring pressure study has not answered that question.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.barium",
                "label": "Upright timed barium esophagography with tablet passage",
                "isCorrect": true,
                "rationale": "Normal measured relaxation and absence of residual spasm do not establish bolus emptying. Upright timed barium testing directly assesses clearance and is the ACG first-line objective investigation for recurrent symptoms after definitive achalasia treatment.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.ph",
                "label": "Ambulatory esophageal pH-impedance reflux monitoring",
                "isCorrect": false,
                "rationale": "Nocturnal fluid return after POEM makes reflux a credible mechanism. Her recurrent food hold-up still requires objective clearance assessment first; reflux monitoring answers a different question once clearance and structural findings have been considered.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "After treatment of established achalasia, normal pressure relaxation does not establish adequate emptying when food hold-up recurs. Timed barium esophagography is the first-line objective reassessment in this setting. Endoscopy complements the clearance assessment by examining reflux injury or luminal narrowing; maintained weight and hydration do not exclude those causes.",
            "sourceLabels": [
              "Original constructed clinical teaching record",
              "Clinical review pending Melissa Rowland"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.endoscopy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical rationale. Patient outcomes are outside this record-review exercise.",
                "clinicalRationale": "Endoscopy can identify reflux injury or a post-treatment narrowing and may be complementary in the full reassessment. For this stable recurrent food-and-fluid hold-up, timed barium is the guideline-supported first objective test of emptying; the reassuring pressure study has not answered that question.",
                "sourceLabels": [
                  "Original constructed clinical teaching record",
                  "Clinical review pending Melissa Rowland"
                ]
              },
              {
                "answerChoiceId": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.ph",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical rationale. Patient outcomes are outside this record-review exercise.",
                "clinicalRationale": "Nocturnal fluid return after POEM makes reflux a credible mechanism. Her recurrent food hold-up still requires objective clearance assessment first; reflux monitoring answers a different question once clearance and structural findings have been considered.",
                "sourceLabels": [
                  "Original constructed clinical teaching record",
                  "Clinical review pending Melissa Rowland"
                ]
              }
            ]
          }
        ],
        "learningSummary": "After treatment of established achalasia, normal pressure relaxation does not establish adequate emptying when food hold-up recurs. Timed barium esophagography is the first-line objective reassessment in this setting. Endoscopy complements the clearance assessment by examining reflux injury or luminal narrowing; maintained weight and hydration do not exclude those causes."
      }
    ]
  },
  "topic-batch5-bariatric-metabolic": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.pbh.spontaneous-evidence-before-treatment.v2",
        "displayName": "Distinguish sensor observations from confirmed symptomatic hypoglycemia before assigning PBH-directed treatment.",
        "learningObjective": "Distinguish sensor observations from confirmed symptomatic hypoglycemia before assigning PBH-directed treatment.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2",
        "displayName": "Interpret withdrawal and rechallenge observations before choosing the next medication stage for persistent PBH.",
        "learningObjective": "Interpret withdrawal and rechallenge observations before choosing the next medication stage for persistent PBH.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2",
        "displayName": "Use prior objective GERD evidence and current PPI exposure to select the reflux-monitoring protocol before further post-sleeve treatment.",
        "learningObjective": "Use prior objective GERD evidence and current PPI exposure to select the reflux-monitoring protocol before further post-sleeve treatment.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      }
    ],
    "cases": [
      {
        "id": "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
        "displayName": "Clinic review: Confusion after meals",
        "patientPresentationVariantId": "presentation.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Maya Benton",
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
        "chiefComplaint": "Confusion after meals",
        "presentation": "{patientName}, a 45-year-old woman, attends clinic three years after Roux-en-Y gastric bypass because she sometimes becomes shaky and confused after eating. You review her prior bariatric clinic records.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
            "prototypeDemographics": {
              "ageYears": 45,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Confusion after meals",
            "presentation": "{patientName}, a 45-year-old woman, attends clinic three years after Roux-en-Y gastric bypass because she sometimes becomes shaky and confused after eating. You review her prior bariatric clinic records."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Society for Endocrinology / Endocrine Connections (2024)",
          "Association for Laboratory Medicine (2019)"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
            "questionVariantId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
            "primaryConceptId": "concept.pbh.spontaneous-evidence-before-treatment.v2",
            "currentUpdate": "She takes no insulin or insulin secretagogue. Her meal/symptom diary and the separately timed glucose records are compared below.",
            "stem": "Which next investigation best evaluates {patientName}'s recurrent episodes after bypass?",
            "answerChoices": [
              {
                "id": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.fast",
                "label": "Supervised fasting evaluation with venous biochemical sampling",
                "isCorrect": false,
                "rationale": "The low overnight sensor values do not coincide with symptoms and disagree with simultaneous finger-stick results. They do not establish a fasting syndrome that should determine the first investigation of the separate postmeal spells.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.spontaneous",
                "label": "Venous biochemical sampling during a typical spontaneous spell",
                "isCorrect": true,
                "rationale": "The symptom diary and glucose log represent different events. Characterizing a typical symptomatic postmeal spell establishes the missing symptom-biochemistry relationship before assigning its cause.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.ogtt",
                "label": "Oral glucose tolerance testing with venous biochemical sampling",
                "isCorrect": false,
                "rationale": "A standardized glucose load may provoke lows that do not establish what occurs during this patient's ordinary episodes. The current PBH guideline does not recommend OGTT diagnosis of PBH.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Align symptoms and samples by episode. The asymptomatic overnight sensor values are not biochemical evidence for the daytime spells, and the normal clinic sample was obtained while she felt well. Obtain appropriate venous sampling during a typical spontaneous event. A low value by itself would still not complete the full etiologic evaluation or prove PBH.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed episode and measurement records; fictional patient observations",
              "columnHeaders": [
                "Time/context",
                "Observation"
              ],
              "rowHeaders": [
                "Symptom diary, day 1",
                "Symptom diary, day 2",
                "Glucose log, night 1",
                "Glucose log, night 2",
                "Clinic chemistry"
              ],
              "cells": [
                [
                  "Lunch at 12:00; shaking and confusion at 14:15",
                  "Symptoms abated later that afternoon"
                ],
                [
                  "Lunch at 12:30; shaking and confusion at 15:00",
                  "No comparable symptoms recorded before breakfast"
                ],
                [
                  "03:10, asleep without symptoms",
                  "CGM 47 mg/dL; simultaneous finger-stick 91 mg/dL"
                ],
                [
                  "02:50, asleep without symptoms",
                  "CGM 49 mg/dL; simultaneous finger-stick 88 mg/dL"
                ],
                [
                  "08:00, feeling well before breakfast",
                  "Venous glucose 86 mg/dL"
                ]
              ]
            },
            "sourceLabels": [
              "Society for Endocrinology / Endocrine Connections (2024)",
              "Association for Laboratory Medicine (2019)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.fast",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic teaching review ends with feedback on the selected plan; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "The low overnight sensor values do not coincide with symptoms and disagree with simultaneous finger-stick results. They do not establish a fasting syndrome that should determine the first investigation of the separate postmeal spells.",
                "sourceLabels": [
                  "Society for Endocrinology / Endocrine Connections (2024)",
                  "Association for Laboratory Medicine (2019)"
                ]
              },
              {
                "answerChoiceId": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.ogtt",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic teaching review ends with feedback on the selected plan; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "A standardized glucose load may provoke lows that do not establish what occurs during this patient's ordinary episodes. The current PBH guideline does not recommend OGTT diagnosis of PBH.",
                "sourceLabels": [
                  "Society for Endocrinology / Endocrine Connections (2024)",
                  "Association for Laboratory Medicine (2019)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Align symptoms and samples by episode. The asymptomatic overnight sensor values are not biochemical evidence for the daytime spells, and the normal clinic sample was obtained while she felt well. Obtain appropriate venous sampling during a typical spontaneous event. A low value by itself would still not complete the full etiologic evaluation or prove PBH."
      },
      {
        "id": "case.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1",
        "displayName": "Clinic review: Confusion after meals",
        "patientPresentationVariantId": "presentation.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Maya Benton",
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
        "chiefComplaint": "Confusion after meals",
        "presentation": "{patientName}, a 45-year-old woman, attends clinic three years after Roux-en-Y gastric bypass because she sometimes becomes shaky and confused after eating. You review her prior bariatric clinic records.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1",
            "prototypeDemographics": {
              "ageYears": 45,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Confusion after meals",
            "presentation": "{patientName}, a 45-year-old woman, attends clinic three years after Roux-en-Y gastric bypass because she sometimes becomes shaky and confused after eating. You review her prior bariatric clinic records."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Society for Endocrinology / Endocrine Connections (2024)",
          "Association for Laboratory Medicine (2019)"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.bariatric-metabolic.diet-response-drug-stage.v2",
            "questionVariantId": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
            "primaryConceptId": "concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2",
            "currentUpdate": "At a later follow-up for established post-bariatric hypoglycemia, the dietitian documents the agreed meal plan. Symptomatic measured postmeal lows still occur. The medication record shows the following course.",
            "stem": "Which next medication plan best fits {patientName}'s symptom and treatment course?",
            "answerChoices": [
              {
                "id": "choice.topic.bariatric-metabolic.diet-response-drug-stage.v2.acarbose",
                "label": "Continue the acarbose-based medication plan",
                "isCorrect": false,
                "rationale": "The record shows benefit but also reproducible activity-limiting gastrointestinal effects that resolve on withdrawal and return on reintroduction. Persistence is not merely an untried first-drug stage.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.bariatric-metabolic.diet-response-drug-stage.v2.diazoxide",
                "label": "Change to an oral diazoxide-based plan",
                "isCorrect": false,
                "rationale": "Diazoxide is a later option. Intolerance of acarbose does not itself establish that the somatostatin-analogue stage is unsuitable or has failed.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.bariatric-metabolic.diet-response-drug-stage.v2.octreotide",
                "label": "Change to short-acting subcutaneous octreotide",
                "isCorrect": true,
                "rationale": "The withdrawal/rechallenge course supports clinically important acarbose intolerance. Short-acting octreotide is a guideline-supported option when acarbose is ineffective or not tolerated.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Fewer lows do not by themselves establish an acceptable medication response. The repeated gastrointestinal pattern on withdrawal and reintroduction supports acarbose intolerance. Consider a specialist-directed short-acting somatostatin analogue such as octreotide rather than insisting on the same drug or skipping directly to diazoxide. No dose, maximum trial count or universal adverse-effect cutoff is supplied.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed medication and symptom course; fictional patient observations",
              "columnHeaders": [
                "Recorded response"
              ],
              "rowHeaders": [
                "Dietary care before medication",
                "Acarbose taken with meals",
                "Acarbose withheld",
                "Acarbose reintroduced with meals"
              ],
              "cells": [
                [
                  "Postmeal lows interrupt work despite the implemented eating plan"
                ],
                [
                  "Hypoglycemic events are fewer; marked bloating, cramping and diarrhea prevent usual activities"
                ],
                [
                  "Bloating and diarrhea settle; measured postmeal lows recur"
                ],
                [
                  "The same activity-limiting gastrointestinal symptoms return"
                ]
              ]
            },
            "sourceLabels": [
              "Society for Endocrinology / Endocrine Connections (2024)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.bariatric-metabolic.diet-response-drug-stage.v2.acarbose",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic teaching review ends with feedback on the selected plan; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "The record shows benefit but also reproducible activity-limiting gastrointestinal effects that resolve on withdrawal and return on reintroduction. Persistence is not merely an untried first-drug stage.",
                "sourceLabels": [
                  "Society for Endocrinology / Endocrine Connections (2024)"
                ]
              },
              {
                "answerChoiceId": "choice.topic.bariatric-metabolic.diet-response-drug-stage.v2.diazoxide",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic teaching review ends with feedback on the selected plan; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Diazoxide is a later option. Intolerance of acarbose does not itself establish that the somatostatin-analogue stage is unsuitable or has failed.",
                "sourceLabels": [
                  "Society for Endocrinology / Endocrine Connections (2024)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Fewer lows do not by themselves establish an acceptable medication response. The repeated gastrointestinal pattern on withdrawal and reintroduction supports acarbose intolerance. Consider a specialist-directed short-acting somatostatin analogue such as octreotide rather than insisting on the same drug or skipping directly to diazoxide. No dose, maximum trial count or universal adverse-effect cutoff is supplied."
      },
      {
        "id": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
        "displayName": "Clinic review: Regurgitation after sleeve",
        "patientPresentationVariantId": "presentation.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Nora Ellis",
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
        "chiefComplaint": "Regurgitation after sleeve",
        "presentation": "{patientName}, a 43-year-old woman, attends clinic with heartburn and sour regurgitation after sleeve gastrectomy. Her BMI is 38 kg/m². You review her prior bariatric clinic records.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Regurgitation after sleeve",
            "presentation": "{patientName}, a 43-year-old woman, attends clinic with heartburn and sour regurgitation after sleeve gastrectomy. Her BMI is 38 kg/m². You review her prior bariatric clinic records."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "SAGES / Surgical Endoscopy (2025)",
          "American College of Gastroenterology / American Journal of Gastroenterology (2022)"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
            "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
            "primaryConceptId": "concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2",
            "currentUpdate": "At a later visit, regurgitation continues. The earlier endoscopy documented Los Angeles grade C esophagitis. The dispensing and dosing records now show prescribed twice-daily delayed-release omeprazole, taken 30-60 minutes before breakfast and the evening meal, with refill and pill-count records matching use. A current endoscopy shows a traversable sleeve without a focal obstructing lesion. The team is evaluating whether the present symptoms remain reflux-related before further bariatric treatment.",
            "stem": "Which investigation best clarifies {patientName}'s continuing regurgitation before further post-sleeve treatment?",
            "answerChoices": [
              {
                "id": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-off",
                "label": "Ambulatory pH-only monitoring after PPI withdrawal",
                "isCorrect": false,
                "rationale": "Off-therapy monitoring can establish an unproven diagnosis. Prior grade C esophagitis already provides objective GERD evidence, and this protocol does not answer the present on-treatment symptom question.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-off",
                "label": "Ambulatory impedance-pH monitoring after PPI withdrawal",
                "isCorrect": false,
                "rationale": "Adding impedance does not correct the mismatch in medication state. Off-therapy testing asks about untreated reflux rather than the relationship between symptoms and reflux during the recorded regimen.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-on",
                "label": "Ambulatory pH-only monitoring during PPI treatment",
                "isCorrect": false,
                "rationale": "The medication state fits a persistent on-treatment question, but pH-only monitoring does not capture the full association with nonacid reflux that impedance-pH can evaluate.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-on",
                "label": "Ambulatory impedance-pH monitoring during PPI treatment",
                "isCorrect": true,
                "rationale": "GERD is already objectively established, but the mechanism of the current symptoms during therapy remains unresolved. On-treatment impedance-pH evaluates their relationship with acid and nonacid reflux before another treatment decision.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The prior grade C esophagitis establishes GERD, but it does not prove that the current regurgitation during treatment has the same mechanism. ACG recommends on-therapy impedance-pH assessment for persistent symptoms in established GERD on twice-daily PPI. The on/off state and impedance/pH scope answer different questions. The result may inform later bariatric treatment; this item does not force an operation from an adequacy label.",
            "sourceLabels": [
              "SAGES / Surgical Endoscopy (2025)",
              "American College of Gastroenterology / American Journal of Gastroenterology (2022)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-off",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic teaching review ends with feedback on the selected plan; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Off-therapy monitoring can establish an unproven diagnosis. Prior grade C esophagitis already provides objective GERD evidence, and this protocol does not answer the present on-treatment symptom question.",
                "sourceLabels": [
                  "American College of Gastroenterology / American Journal of Gastroenterology (2022)"
                ]
              },
              {
                "answerChoiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-off",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic teaching review ends with feedback on the selected plan; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Adding impedance does not correct the mismatch in medication state. Off-therapy testing asks about untreated reflux rather than the relationship between symptoms and reflux during the recorded regimen.",
                "sourceLabels": [
                  "American College of Gastroenterology / American Journal of Gastroenterology (2022)"
                ]
              },
              {
                "answerChoiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-on",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic teaching review ends with feedback on the selected plan; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "The medication state fits a persistent on-treatment question, but pH-only monitoring does not capture the full association with nonacid reflux that impedance-pH can evaluate.",
                "sourceLabels": [
                  "American College of Gastroenterology / American Journal of Gastroenterology (2022)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The prior grade C esophagitis establishes GERD, but it does not prove that the current regurgitation during treatment has the same mechanism. ACG recommends on-therapy impedance-pH assessment for persistent symptoms in established GERD on twice-daily PPI. The on/off state and impedance/pH scope answer different questions. The result may inform later bariatric treatment; this item does not force an operation from an adequacy label."
      }
    ]
  },
  "topic-batch5-pediatric-gi-abdominal-wall": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
        "displayName": "Select management after partial ileocolic reduction with persistent stability.",
        "learningObjective": "Select management after partial ileocolic reduction with persistent stability.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
        "displayName": "Interpret a fixed bowel loop against improving NEC physiology.",
        "learningObjective": "Interpret a fixed bowel loop against improving NEC physiology.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
        "displayName": "Distinguish productive partial therapeutic decompression from completed resolution or failed nonoperative treatment of uncomplicated meconium ileus.",
        "learningObjective": "Distinguish productive partial therapeutic decompression from completed resolution or failed nonoperative treatment of uncomplicated meconium ileus.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
        "displayName": "Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
        "learningObjective": "Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
        "displayName": "Balance prematurity-related respiratory risk against reducible hernia risk.",
        "learningObjective": "Balance prematurity-related respiratory risk against reducible hernia risk.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Hospital course review",
        "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
        "patientDisplayName": "Sofia Reed",
        "prototypeDemographics": {
          "ageYears": 8,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Hospital course review",
        "presentation": "In clinic, {patientName}, an 8-year-old girl, attends with a parent. The founder reviews outside hospital records from her earlier admission at age 8; all questions concern that recorded admission.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 8,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Hospital course review",
            "presentation": "In clinic, {patientName}, an 8-year-old girl, attends with a parent. The founder reviews outside hospital records from her earlier admission at age 8; all questions concern that recorded admission."
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
          "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
          "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
            "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
            "primaryConceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
            "currentUpdate": "Recorded hospital note from {patientName}'s admission at age 8: she had received IV fluids and remained under pediatric surgical observation for ileocolic intussusception.",
            "stem": "Which next plan was most appropriate for {patientName} after the first reduction attempt in the recorded admission?",
            "answerChoices": [
              {
                "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
                "label": "Attempt a delayed repeat image-guided enema",
                "isCorrect": true,
                "rationale": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
                "label": "Proceed to operative reduction now",
                "isCorrect": false,
                "rationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
                "label": "Observe for spontaneous completion of reduction",
                "isCorrect": false,
                "rationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-record observations; fictional patient",
              "items": [
                {
                  "label": "Initial study",
                  "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
                },
                {
                  "label": "Reduction record",
                  "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
                },
                {
                  "label": "Reassessment",
                  "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
              "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
                  "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
                  "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction."
      },
      {
        "id": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Neonatal course review",
        "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
        "patientDisplayName": "Ethan Brooks",
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Neonatal course review",
        "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 3-week-old infant; all questions concern that recorded neonatal care.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 5,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Neonatal course review",
            "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 3-week-old infant; all questions concern that recorded neonatal care."
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
          "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
            "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
            "primaryConceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
            "currentUpdate": "{patientName} was born preterm and is receiving neonatal medical treatment for NEC in an outside hospital.",
            "stem": "Which next plan is best supported by {patientName}'s current course?",
            "answerChoices": [
              {
                "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.medical",
                "label": "Continue nonoperative NEC treatment",
                "isCorrect": true,
                "rationale": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
                "label": "Perform exploratory laparotomy",
                "isCorrect": false,
                "rationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
                "label": "Insert a peritoneal drain",
                "isCorrect": false,
                "rationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-record observations; fictional patient",
              "items": [
                {
                  "label": "Serial radiology reports",
                  "value": "Pneumatosis has decreased, but one dilated loop remains in the same position on consecutive films. No free intraperitoneal gas is reported."
                },
                {
                  "label": "Concurrent clinical trend",
                  "value": "Abdominal tenderness and distension have lessened. Ventilator and circulatory support have decreased, and lactate is falling."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
                ]
              }
            ]
          }
        ],
        "learningSummary": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment."
      },
      {
        "id": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Obstruction record review",
        "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
        "patientDisplayName": "Isla Reed",
        "prototypeDemographics": {
          "ageYears": 6,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Obstruction record review",
        "presentation": "In clinic, {patientName}, a 6-year-old girl, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 2-day-old infant; all questions concern that recorded neonatal care.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 6,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Obstruction record review",
            "presentation": "In clinic, {patientName}, a 6-year-old girl, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 2-day-old infant; all questions concern that recorded neonatal care."
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
          "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
            "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
            "primaryConceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
            "currentUpdate": "{patientName}'s outside neonatal team has treated bilious drainage and distension with gastric decompression and IV fluids. She has completed a first image-guided therapeutic water-soluble contrast enema.",
            "stem": "Which next decompression plan best fits {patientName}'s treatment response?",
            "answerChoices": [
              {
                "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
                "label": "Repeat image-guided therapeutic contrast decompression",
                "isCorrect": true,
                "rationale": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
                "label": "Proceed to operative bowel decompression",
                "isCorrect": false,
                "rationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
                "label": "Continue gastric drainage with observation",
                "isCorrect": false,
                "rationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-record observations; fictional patient",
              "items": [
                {
                  "label": "Therapeutic procedure record",
                  "value": "Contrast traversed a small-caliber colon and entered the distal ileum around intraluminal pellets. During the procedure the contrast advanced farther proximally, pellet burden decreased and meconium passed; further ileal pellets remained."
                },
                {
                  "label": "After the procedure",
                  "value": "Distension decreased but persists with bilious gastric drainage. Perfusion and urine output are maintained. The abdomen is soft without erythema or guarding; imaging shows no free gas, volvulus or obstructing pseudocyst."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
                ]
              }
            ]
          }
        ],
        "learningSummary": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied."
      },
      {
        "id": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Renal mass review",
        "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
        "patientDisplayName": "Noah Bennett",
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Renal mass review",
        "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with a parent.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 5,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Renal mass review",
            "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with a parent."
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
          "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
            "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
            "primaryConceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
            "currentUpdate": "{patientName}'s outside pediatric oncology center uses the COG/North American Wilms pathway. The team is selecting his initial treatment sequence for a renal mass.",
            "stem": "Which initial tumor-directed sequence should the outside team select for {patientName}?",
            "answerChoices": [
              {
                "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.biopsy",
                "label": "Biopsy, preoperative chemotherapy, then resection",
                "isCorrect": true,
                "rationale": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
                "label": "Nephrectomy with thrombectomy, then chemotherapy",
                "isCorrect": false,
                "rationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
                "label": "Preoperative chemotherapy, then resection histology",
                "isCorrect": false,
                "rationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-record observations; fictional patient",
              "items": [
                {
                  "label": "Anatomic imaging",
                  "value": "A mass expands the right renal parenchyma. The left kidney is normal. Enhancing tissue extends continuously from the right renal vein into the vena cava; its upper edge reaches the hepatic-vein confluence."
                },
                {
                  "label": "Specialist review",
                  "value": "The imaging appearance is typical of Wilms tumor. The staging review shows no distant lesions."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception."
      },
      {
        "id": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Groin timing review",
        "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
        "patientDisplayName": "Henry Parker",
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Groin timing review",
        "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 12-week-old infant; all questions concern that recorded neonatal care.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 5,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Groin timing review",
            "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 12-week-old infant; all questions concern that recorded neonatal care."
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
          "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
        ],
        "decisionNodes": [
          {
            "id": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
            "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
            "primaryConceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
            "currentUpdate": "{patientName} was born at 26 weeks and remains in an outside neonatal unit. Discharge is being planned with ongoing respiratory follow-up.",
            "stem": "Which repair-timing plan is most appropriate for {patientName}'s current groin finding?",
            "answerChoices": [
              {
                "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.after",
                "label": "Plan repair after the neonatal hospitalization",
                "isCorrect": true,
                "rationale": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before",
                "label": "Plan repair before neonatal discharge",
                "isCorrect": false,
                "rationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.",
                "serviceRequest": null
              },
              {
                "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.observe",
                "label": "Use serial surveillance for spontaneous resolution",
                "isCorrect": false,
                "rationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-record observations; fictional patient",
              "items": [
                {
                  "label": "Groin course",
                  "value": "Pediatric surgical examinations repeatedly show an inguinal bulge that reduces completely. There have been no painful irreducible episodes, vomiting or skin changes."
                },
                {
                  "label": "Respiratory and follow-up context",
                  "value": "He still needs oxygen for bronchopulmonary dysplasia. His family can attend surgical follow-up and has been taught the warning signs requiring urgent reassessment."
                }
              ]
            },
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
                ]
              },
              {
                "answerChoiceId": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.observe",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
                "clinicalRationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.",
                "sourceLabels": [
                  "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
                ]
              }
            ]
          }
        ],
        "learningSummary": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule."
      }
    ]
  }
};
export const PROGRAM_BATCH5_QUESTIONS: (QuestionVariant & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "conceptId": "concept.n2.vte-prophylaxis-to-treatment",
    "stem": "Which initial treatment plan best fits {patientName}'s returned study and medication record?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-prevention-not-failure.therapeutic-enoxaparin.v1",
        "label": "Start therapeutic enoxaparin treatment",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The new proximal finding needs treatment; the prior prevention prescription does not establish therapeutic failure. The represented wound/laboratory trajectory does not establish a major bleeding contraindication that requires a routine filter."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-prevention-not-failure.withhold-filter.v1",
        "label": "Withhold enoxaparin and insert a retrievable IVC filter",
        "isCorrect": false,
        "distractorRationale": "Minor stable wound spotting is not the active major-bleeding contraindication that would support this temporary-protection pathway. Misreading it can withhold needed proximal-DVT treatment.",
        "rationale": "Minor stable wound spotting is not the active major-bleeding contraindication that would support this temporary-protection pathway. Misreading it can withhold needed proximal-DVT treatment."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-prevention-not-failure.continue-prevention.v1",
        "label": "Continue the postoperative prevention prescription",
        "isCorrect": false,
        "distractorRationale": "The prescription's prevention purpose does not become adequate treatment when a new proximal thrombus is documented; simply continuing it can undertreat the event.",
        "rationale": "The prescription's prevention purpose does not become adequate treatment when a new proximal thrombus is documented; simply continuing it can undertreat the event."
      }
    ],
    "explanation": "The new proximal finding needs treatment; the prior prevention prescription does not establish therapeutic failure. The represented wound/laboratory trajectory does not establish a major bleeding contraindication that requires a routine filter. Minor stable wound spotting is not the active major-bleeding contraindication that would support this temporary-protection pathway. Misreading it can withhold needed proximal-DVT treatment.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-proximal-treatment",
      "claim.vascular-venous-lymphatic-access.dvt-prophylaxis-not-treatment",
      "claim.vascular-venous-lymphatic-access.filter-not-routine"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "conceptId": "concept.postoperative-dvt.three-month-anticoagulation",
    "stem": "Which anticoagulation-duration plan best fits {patientName} at this three-month review?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-finite-course.stop-after-three-months.v2",
        "label": "Stop anticoagulation at this review",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The event followed major benign surgery and the observed recovery removes that transient exposure. Isolated heterozygous factor V Leiden does not by itself convert this first provoked event into an indication for indefinite therapy."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-finite-course.continue-indefinitely.v2",
        "label": "Continue anticoagulation for indefinite secondary prevention",
        "isCorrect": false,
        "distractorRationale": "A positive inherited test is not automatically a high-risk persistent thrombophilia. The cited guide separates isolated heterozygous factor V Leiden from higher-risk thrombophilic states; the represented episode and recovery support a finite course.",
        "rationale": "A positive inherited test is not automatically a high-risk persistent thrombophilia. The cited guide separates isolated heterozygous factor V Leiden from higher-risk thrombophilic states; the represented episode and recovery support a finite course."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-finite-course.extend-six-months.v2",
        "label": "Continue anticoagulation for six additional months",
        "isCorrect": false,
        "distractorRationale": "A longer finite course does not resolve an assumed persistent inherited risk and is not required merely by this isolated heterozygous result after the represented surgical event.",
        "rationale": "A longer finite course does not resolve an assumed persistent inherited risk and is not required merely by this isolated heterozygous result after the represented surgical event."
      }
    ],
    "explanation": "The event followed major benign surgery and the observed recovery removes that transient exposure. Isolated heterozygous factor V Leiden does not by itself convert this first provoked event into an indication for indefinite therapy. A positive inherited test is not automatically a high-risk persistent thrombophilia. The cited guide separates isolated heterozygous factor V Leiden from higher-risk thrombophilic states; the represented episode and recovery support a finite course.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-three-month-resolved",
      "claim.vascular-venous-lymphatic-access.dvt-extended-context",
      "claim.vascular-venous-lymphatic-access.dvt-heterozygous-fvl-duration"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "conceptId": "concept.postoperative-dvt.three-month-anticoagulation",
    "stem": "Which treatment-duration plan best fits {patientName}'s current record?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-residual-duration.finish-three-months.v1",
        "label": "End anticoagulation after the completed three-month course",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The event was tied to resolved surgery and the course is complete. Unchanged residual material without a newly involved segment does not create a new event that automatically restarts treatment."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-residual-duration.continue-until-clear.v1",
        "label": "Continue anticoagulation until ultrasound is normal",
        "isCorrect": false,
        "distractorRationale": "Residual material is a common reason to overextend treatment. Treating a stable image as ongoing new thrombosis can prolong bleeding exposure without an established new indication.",
        "rationale": "Residual material is a common reason to overextend treatment. Treating a stable image as ongoing new thrombosis can prolong bleeding exposure without an established new indication."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.postop-residual-duration.restart-course.v1",
        "label": "Restart a new three-month therapeutic course",
        "isCorrect": false,
        "distractorRationale": "The comparison records the same segment and less swelling, not a new clot. Restarting the clock treats persistence as recurrence.",
        "rationale": "The comparison records the same segment and less swelling, not a new clot. Restarting the clock treats persistence as recurrence."
      }
    ],
    "explanation": "The event was tied to resolved surgery and the course is complete. Unchanged residual material without a newly involved segment does not create a new event that automatically restarts treatment. Residual material is a common reason to overextend treatment. Treating a stable image as ongoing new thrombosis can prolong bleeding exposure without an established new indication.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-three-month-resolved",
      "claim.vascular-venous-lymphatic-access.dvt-residual-not-filter",
      "claim.vascular-venous-lymphatic-access.dvt-recurrent-comparison",
      "claim.vascular-venous-lymphatic-access.dvt-extended-context"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "conceptId": "concept.n1.lymphedema-new-tempo-venous-assessment",
    "stem": "Which investigation should guide {patientName}'s changed left-arm swelling now?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.arm-venous-duplex.v2",
        "label": "Left-arm deep-venous duplex ultrasound",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "A chronic nodal-treatment history does not account for the new painful postoperative change; the symptomatic venous territory needs evaluation before chronic treatment is escalated."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.lymphoscintigraphy.v2",
        "label": "Left-arm radionuclide lymphoscintigraphy",
        "isCorrect": false,
        "distractorRationale": "Lymphoscintigraphy may characterize a chronic lymphatic disorder, but does not first address the new postoperative venous concern. Anchoring on the old cause could delay treatment of a new clot.",
        "rationale": "Lymphoscintigraphy may characterize a chronic lymphatic disorder, but does not first address the new postoperative venous concern. Anchoring on the old cause could delay treatment of a new clot."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.central-venography.v2",
        "label": "Chest CT venography",
        "isCorrect": false,
        "distractorRationale": "Central disease can cause arm swelling, but an initial deep-arm duplex is the appropriate first venous acquisition for this acute symptomatic limb without a completed peripheral study.",
        "rationale": "Central disease can cause arm swelling, but an initial deep-arm duplex is the appropriate first venous acquisition for this acute symptomatic limb without a completed peripheral study."
      }
    ],
    "explanation": "A chronic nodal-treatment history does not account for the new painful postoperative change; the symptomatic venous territory needs evaluation before chronic treatment is escalated. Lymphoscintigraphy may characterize a chronic lymphatic disorder, but does not first address the new postoperative venous concern. Anchoring on the old cause could delay treatment of a new clot.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.lymphatic-pattern",
      "claim.vascular-venous-lymphatic-access.lymphatic-new-change",
      "claim.vascular-venous-lymphatic-access.dvt-postoperative-imaging"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1",
    "stem": "Which study should {patientName}'s team arrange next?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.iliac-venography.v1",
        "label": "Iliac and pelvic CT venography",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The whole-limb distribution, abdominal collaterals and unilateral loss of respiratory variation warrant evaluation above the compressible leg segments."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.repeat-proximal.v1",
        "label": "Repeat femoral and popliteal compression duplex",
        "isCorrect": false,
        "distractorRationale": "A repeated examination of the same compressible segments would not settle the pelvic territory suggested by the waveform and collateral pattern.",
        "rationale": "A repeated examination of the same compressible segments would not settle the pelvic territory suggested by the waveform and collateral pattern."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.lymphatic-scan.v1",
        "label": "Lower-limb radionuclide lymphoscintigraphy",
        "isCorrect": false,
        "distractorRationale": "Chronic swelling can be lymphatic, but collateral veins and the asymmetric venous waveform point to an unresolved outflow question first.",
        "rationale": "Chronic swelling can be lymphatic, but collateral veins and the asymmetric venous waveform point to an unresolved outflow question first."
      }
    ],
    "explanation": "The whole-limb distribution, abdominal collaterals and unilateral loss of respiratory variation warrant evaluation above the compressible leg segments. A repeated examination of the same compressible segments would not settle the pelvic territory suggested by the waveform and collateral pattern.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.venous-proximal-obstruction",
      "claim.vascular-venous-lymphatic-access.venous-reflux-protocol"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "conceptId": "concept.dialysis-access.maturation-physical-assessment",
    "stem": "Which next access plan best fits {patientName}'s serial examination?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.access-unresolved-maturation.flow-anatomy-duplex.v2",
        "label": "Arrange duplex mapping of access inflow, flow and outflow",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "Visible wrist enlargement does not establish a matured cannulation circuit. The persistently abnormal thrill and arm-elevation pattern beyond the usual assessment period justify investigating flow/anatomy rather than another observation cycle or attempted first use."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.access-unresolved-maturation.guided-cannulation.v2",
        "label": "Arrange an ultrasound-guided first-cannulation attempt",
        "isCorrect": false,
        "distractorRationale": "Guidance can help locate an established usable segment, but it does not settle the represented persistent flow/maturation concern. The abnormal serial examination needs anatomical and flow characterization before trial use.",
        "rationale": "Guidance can help locate an established usable segment, but it does not settle the represented persistent flow/maturation concern. The abnormal serial examination needs anatomical and flow characterization before trial use."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.access-unresolved-maturation.further-observation.v2",
        "label": "Arrange another clinical maturation review before imaging",
        "isCorrect": false,
        "distractorRationale": "Observation can be appropriate early after creation when maturation is progressing. The eight-week record instead describes a persistently abnormal circuit on serial examinations, so another examination without investigation leaves the important question unresolved.",
        "rationale": "Observation can be appropriate early after creation when maturation is progressing. The eight-week record instead describes a persistently abnormal circuit on serial examinations, so another examination without investigation leaves the important question unresolved."
      }
    ],
    "explanation": "Visible wrist enlargement does not establish a matured cannulation circuit. The persistently abnormal thrill and arm-elevation pattern beyond the usual assessment period justify investigating flow/anatomy rather than another observation cycle or attempted first use. Guidance can help locate an established usable segment, but it does not settle the represented persistent flow/maturation concern. The abnormal serial examination needs anatomical and flow characterization before trial use.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.access-maturation",
      "claim.vascular-venous-lymphatic-access.access-maturation-timing",
      "claim.vascular-venous-lymphatic-access.access-exam-interpretation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "stem": "Which investigation should guide {patientName}'s compression selection next?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.toe-waveforms.v1",
        "label": "Left toe pressure and digital waveform testing",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The ankle acquisition did not occlude arterial flow, so its high printed ratio cannot establish adequate perfusion. Toe/digital physiology addresses that limitation."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.exercise-ankle.v1",
        "label": "Left exercise ankle-pressure testing",
        "isCorrect": false,
        "distractorRationale": "Exercise testing can uncover exertional PAD when resting ankle measures are interpretable; it does not correct failure to occlude the artery at rest.",
        "rationale": "Exercise testing can uncover exertional PAD when resting ankle measures are interpretable; it does not correct failure to occlude the artery at rest."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.arterial-cta.v1",
        "label": "Left-leg CT angiography",
        "isCorrect": false,
        "distractorRationale": "Angiography may be needed for a later revascularization decision, but it does not first provide the missing quantitative tissue-level physiologic assessment.",
        "rationale": "Angiography may be needed for a later revascularization decision, but it does not first provide the missing quantitative tissue-level physiologic assessment."
      }
    ],
    "explanation": "The ankle acquisition did not occlude arterial flow, so its high printed ratio cannot establish adequate perfusion. Toe/digital physiology addresses that limitation. Exercise testing can uncover exertional PAD when resting ankle measures are interpretable; it does not correct failure to occlude the artery at rest.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-noncompressible",
      "claim.vascular-venous-lymphatic-access.ulcer-perfusion-first",
      "claim.vascular-venous-lymphatic-access.arterial-exercise-testing"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1",
    "stem": "Which ulcer-care plan should {patientName}'s team use now?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-severe-perfusion.withhold-and-assess.v1",
        "label": "Withhold sustained compression and obtain arterial assessment",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The new toe pressure is below the ESVS severe-perfusion boundary, and rest symptoms strengthen the concern. Venous reflux does not override this compression contraindication."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-severe-perfusion.modified-pressure.v1",
        "label": "Start modified compression below 40 mm Hg with supervision",
        "isCorrect": false,
        "distractorRationale": "Modification is tempting when venous disease is real, but it requires adequate residual perfusion; the represented toe pressure does not meet the ESVS discussion boundary.",
        "rationale": "Modification is tempting when venous disease is real, but it requires adequate residual perfusion; the represented toe pressure does not meet the ESVS discussion boundary."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-severe-perfusion.standard-pressure.v1",
        "label": "Start multilayer compression targeting at least 40 mm Hg",
        "isCorrect": false,
        "distractorRationale": "This treats the venous component but disregards the new arterial safety evidence and could worsen ischemic injury.",
        "rationale": "This treats the venous component but disregards the new arterial safety evidence and could worsen ischemic injury."
      }
    ],
    "explanation": "The new toe pressure is below the ESVS severe-perfusion boundary, and rest symptoms strengthen the concern. Venous reflux does not override this compression contraindication. Modification is tempting when venous disease is real, but it requires adequate residual perfusion; the represented toe pressure does not meet the ESVS discussion boundary.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-severe-ischemia",
      "claim.vascular-venous-lymphatic-access.ulcer-noncompressible",
      "claim.vascular-venous-lymphatic-access.ulcer-compression"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1",
    "stem": "Which compression strategy should {patientName}'s wound team consider?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-mixed-compression.modified.v1",
        "label": "Modified compression below 40 mm Hg at the ankle",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The ankle pressure, toe pressure and ankle-to-brachial relationship fit the ESVS discussion for considering monitored modification in selected mixed disease. This is a conditional pathway, not a universal pressure prescription."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-mixed-compression.standard.v1",
        "label": "Multilayer compression of at least 40 mm Hg at the ankle",
        "isCorrect": false,
        "distractorRationale": "The arterial measurements are not those of an uncomplicated venous-ulcer cohort. Ignoring that component risks selecting an unnecessarily intense initial compression strategy.",
        "rationale": "The arterial measurements are not those of an uncomplicated venous-ulcer cohort. Ignoring that component risks selecting an unnecessarily intense initial compression strategy."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.ulcer-mixed-compression.defer.v1",
        "label": "Defer sustained compression for arterial intervention assessment",
        "isCorrect": false,
        "distractorRationale": "Not every represented arterial deficit requires withholding all sustained compression; the current absolute pressures are above the severe ESVS boundaries and support a monitored modified-care option.",
        "rationale": "Not every represented arterial deficit requires withholding all sustained compression; the current absolute pressures are above the severe ESVS boundaries and support a monitored modified-care option."
      }
    ],
    "explanation": "The ankle pressure, toe pressure and ankle-to-brachial relationship fit the ESVS discussion for considering monitored modification in selected mixed disease. This is a conditional pathway, not a universal pressure prescription. The arterial measurements are not those of an uncomplicated venous-ulcer cohort. Ignoring that component risks selecting an unnecessarily intense initial compression strategy.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-modified-compression",
      "claim.vascular-venous-lymphatic-access.ulcer-standard-pressure",
      "claim.vascular-venous-lymphatic-access.ulcer-severe-ischemia",
      "claim.vascular-venous-lymphatic-access.ulcer-current-record"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "conceptId": "concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1",
    "stem": "Which diagnostic plan best fits {patientName}'s persistent postoperative calf findings?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.serial-proximal.v2",
        "label": "Arrange serial proximal compression ultrasound",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "A negative proximal-only acquisition does not settle every distal event or remove the need for follow-up when clinically important postoperative concern persists. Serial proximal ultrasound is a supported strategy to detect interval proximal disease; it is not the only valid strategy if adequate whole-leg ultrasound is chosen instead."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.iliocaval-imaging.v2",
        "label": "Arrange iliocaval CT venography",
        "isCorrect": false,
        "distractorRationale": "Iliocaval imaging is useful when symptoms and common-femoral waveforms point to proximal outflow disease. Here calf-limited findings and preserved bilateral respiratory variation do not redirect the unresolved question to that territory.",
        "rationale": "Iliocaval imaging is useful when symptoms and common-femoral waveforms point to proximal outflow disease. Here calf-limited findings and preserved bilateral respiratory variation do not redirect the unresolved question to that territory."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.end-venous-testing.v2",
        "label": "End venous testing and reassess the edema clinically",
        "isCorrect": false,
        "distractorRationale": "That plan can follow an adequate negative evaluation in an appropriate diagnostic pathway. This record represents a proximal-only examination with persistent postoperative concern and no alternative explanation, so it does not establish that venous testing is finished.",
        "rationale": "That plan can follow an adequate negative evaluation in an appropriate diagnostic pathway. This record represents a proximal-only examination with persistent postoperative concern and no alternative explanation, so it does not establish that venous testing is finished."
      }
    ],
    "explanation": "A negative proximal-only acquisition does not settle every distal event or remove the need for follow-up when clinically important postoperative concern persists. Serial proximal ultrasound is a supported strategy to detect interval proximal disease; it is not the only valid strategy if adequate whole-leg ultrasound is chosen instead. Iliocaval imaging is useful when symptoms and common-femoral waveforms point to proximal outflow disease. Here calf-limited findings and preserved bilateral respiratory variation do not redirect the unresolved question to that territory.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-negative-proximal",
      "claim.vascular-venous-lymphatic-access.dvt-acquisition-adequacy",
      "claim.vascular-venous-lymphatic-access.dvt-postoperative-imaging",
      "claim.vascular-venous-lymphatic-access.venous-proximal-obstruction"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "conceptId": "concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1",
    "stem": "Which investigation should {patientName}'s access team prioritize for the new hand episodes?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.access-hand-physiology.compression-perfusion.v2",
        "label": "Digital pressures and waveforms during access-compression testing",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The old wrist study can explain the earlier nocturnal thumb/index symptoms but does not settle new coolness and activity/dialysis-associated symptoms extending to the little finger. Dynamic perfusion assessment evaluates a possible access contribution despite satisfactory delivered dialysis."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.access-hand-physiology.repeat-median-study.v2",
        "label": "Repeat nerve-conduction testing across the wrist",
        "isCorrect": false,
        "distractorRationale": "The prior median finding is genuine, but repeating it first risks anchoring on the old problem while the new coolness, little-finger involvement and dialysis relationship call for perfusion assessment.",
        "rationale": "The prior median finding is genuine, but repeating it first risks anchoring on the old problem while the new coolness, little-finger involvement and dialysis relationship call for perfusion assessment."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.access-hand-physiology.cervical-mri.v2",
        "label": "Cervical-spine magnetic resonance imaging",
        "isCorrect": false,
        "distractorRationale": "Cervical disease can produce hand symptoms across peripheral nerve distributions, but the represented new coolness and reproducible dialysis/activity relationship do not prioritize a structural cervical investigation ahead of hand perfusion.",
        "rationale": "Cervical disease can produce hand symptoms across peripheral nerve distributions, but the represented new coolness and reproducible dialysis/activity relationship do not prioritize a structural cervical investigation ahead of hand perfusion."
      }
    ],
    "explanation": "The old wrist study can explain the earlier nocturnal thumb/index symptoms but does not settle new coolness and activity/dialysis-associated symptoms extending to the little finger. Dynamic perfusion assessment evaluates a possible access contribution despite satisfactory delivered dialysis. The prior median finding is genuine, but repeating it first risks anchoring on the old problem while the new coolness, little-finger involvement and dialysis relationship call for perfusion assessment.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.access-ischemia-assessment",
      "claim.vascular-venous-lymphatic-access.access-compression-response",
      "claim.vascular-venous-lymphatic-access.access-clinical-indicators",
      "claim.vascular-venous-lymphatic-access.access-neuropathic-differential"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1",
    "stem": "Which plan best fits that point in {patientName}'s outside postoperative record?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.access-multinerve-neuropathy.urgent-ligation-review.v1",
        "label": "Immediate vascular assessment for access ligation",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "The acute multinerve motor/sensory deficit after access creation can represent ischemic monomelic neuropathy despite a warm hand and pulse. Urgent assessment for closure is required rather than waiting for a confirmatory study."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.access-multinerve-neuropathy.delayed-electrophysiology.v1",
        "label": "Observation pending formal nerve-conduction testing",
        "isCorrect": false,
        "distractorRationale": "A warm hand and pulse can falsely reassure. Waiting for an elective confirmatory test risks losing time in a potentially irreversible access-related neurologic injury.",
        "rationale": "A warm hand and pulse can falsely reassure. Waiting for an elective confirmatory test risks losing time in a potentially irreversible access-related neurologic injury."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.access-multinerve-neuropathy.carpal-release.v1",
        "label": "Hand-surgery assessment for carpal-tunnel release",
        "isCorrect": false,
        "distractorRationale": "Carpal tunnel disease does not explain simultaneous deficits across the represented median, ulnar and radial motor territories immediately after access creation.",
        "rationale": "Carpal tunnel disease does not explain simultaneous deficits across the represented median, ulnar and radial motor territories immediately after access creation."
      }
    ],
    "explanation": "The acute multinerve motor/sensory deficit after access creation can represent ischemic monomelic neuropathy despite a warm hand and pulse. Urgent assessment for closure is required rather than waiting for a confirmatory study. A warm hand and pulse can falsely reassure. Waiting for an elective confirmatory test risks losing time in a potentially irreversible access-related neurologic injury.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.access-neuropathy",
      "claim.vascular-venous-lymphatic-access.access-neuropathy-urgent",
      "claim.vascular-venous-lymphatic-access.access-ischemia-assessment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1",
    "stem": "Which treatment should the outside dialysis team try next for {patientName}'s later catheter dysfunction?",
    "answerChoices": [
      {
        "id": "choice.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.alteplase-lock.v1",
        "label": "An alteplase lock in each catheter lumen",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "After positional/mechanical checks, a thrombolytic lumen lock is an appropriate initial treatment for this established low-flow catheter. It is delivered by trained dialysis staff under a local protocol."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.catheter-exchange.v1",
        "label": "Catheter exchange over a guidewire",
        "isCorrect": false,
        "distractorRationale": "Exchange is an appropriate next pathway when thrombolytics fail or a mechanical indication is established, but the current log has not demonstrated failure of a thrombolytic treatment.",
        "rationale": "Exchange is an appropriate next pathway when thrombolytics fail or a mechanical indication is established, but the current log has not demonstrated failure of a thrombolytic treatment."
      },
      {
        "id": "choice.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.systemic-heparin.v1",
        "label": "A systemic intravenous heparin infusion",
        "isCorrect": false,
        "distractorRationale": "Systemic anticoagulation is not the represented initial lumen-directed treatment for dialysis-catheter dysfunction and adds an unnecessary systemic exposure for this question.",
        "rationale": "Systemic anticoagulation is not the represented initial lumen-directed treatment for dialysis-catheter dysfunction and adds an unnecessary systemic exposure for this question."
      }
    ],
    "explanation": "After positional/mechanical checks, a thrombolytic lumen lock is an appropriate initial treatment for this established low-flow catheter. It is delivered by trained dialysis staff under a local protocol. Exchange is an appropriate next pathway when thrombolytics fail or a mechanical indication is established, but the current log has not demonstrated failure of a thrombolytic treatment.",
    "supportingEvidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.catheter-thrombolytic-lock",
      "claim.vascular-venous-lymphatic-access.catheter-site"
    ]
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.salvage.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "conceptId": "concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1",
    "stem": "Which investigation should next assess {patientName}'s recurrent symptoms after POEM?",
    "answerChoices": [
      {
        "id": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.endoscopy",
        "label": "Upper endoscopy with esophageal and junction inspection",
        "isCorrect": false,
        "rationale": "Endoscopy can identify reflux injury or a post-treatment narrowing and may be complementary in the full reassessment. For this stable recurrent food-and-fluid hold-up, timed barium is the guideline-supported first objective test of emptying; the reassuring pressure study has not answered that question.",
        "distractorRationale": "Endoscopy can identify reflux injury or a post-treatment narrowing and may be complementary in the full reassessment. For this stable recurrent food-and-fluid hold-up, timed barium is the guideline-supported first objective test of emptying; the reassuring pressure study has not answered that question."
      },
      {
        "id": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.barium",
        "label": "Upright timed barium esophagography with tablet passage",
        "isCorrect": true,
        "rationale": "Normal measured relaxation and absence of residual spasm do not establish bolus emptying. Upright timed barium testing directly assesses clearance and is the ACG first-line objective investigation for recurrent symptoms after definitive achalasia treatment.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.ph",
        "label": "Ambulatory esophageal pH-impedance reflux monitoring",
        "isCorrect": false,
        "rationale": "Nocturnal fluid return after POEM makes reflux a credible mechanism. Her recurrent food hold-up still requires objective clearance assessment first; reflux monitoring answers a different question once clearance and structural findings have been considered.",
        "distractorRationale": "Nocturnal fluid return after POEM makes reflux a credible mechanism. Her recurrent food hold-up still requires objective clearance assessment first; reflux monitoring answers a different question once clearance and structural findings have been considered."
      }
    ],
    "explanation": "After treatment of established achalasia, normal pressure relaxation does not establish adequate emptying when food hold-up recurs. Timed barium esophagography is the first-line objective reassessment in this setting. Endoscopy complements the clearance assessment by examining reflux injury or luminal narrowing; maintained weight and hydration do not exclude those causes.",
    "supportingEvidenceClaimIds": [
      "claim.esophagus-motility-achalasia.post-treatment-tbe",
      "claim.esophagus-motility-achalasia.barium-clearance",
      "claim.esophagus-motility-achalasia.tablet-obstruction",
      "claim.esophagus-motility-achalasia.hrm-acquisition",
      "claim.esophagus-motility-achalasia.myotomy-limit",
      "claim.esophagus-motility-achalasia.recurrence-mechanisms",
      "claim.esophagus-motility-achalasia.objective-postpoem-reflux",
      "claim.esophagus-motility-achalasia.posttherapy-endoscopic-targets"
    ]
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "conceptId": "concept.pbh.spontaneous-evidence-before-treatment.v2",
    "stem": "Which next investigation best evaluates {patientName}'s recurrent episodes after bypass?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed episode and measurement records; fictional patient observations",
      "columnHeaders": [
        "Time/context",
        "Observation"
      ],
      "rowHeaders": [
        "Symptom diary, day 1",
        "Symptom diary, day 2",
        "Glucose log, night 1",
        "Glucose log, night 2",
        "Clinic chemistry"
      ],
      "cells": [
        [
          "Lunch at 12:00; shaking and confusion at 14:15",
          "Symptoms abated later that afternoon"
        ],
        [
          "Lunch at 12:30; shaking and confusion at 15:00",
          "No comparable symptoms recorded before breakfast"
        ],
        [
          "03:10, asleep without symptoms",
          "CGM 47 mg/dL; simultaneous finger-stick 91 mg/dL"
        ],
        [
          "02:50, asleep without symptoms",
          "CGM 49 mg/dL; simultaneous finger-stick 88 mg/dL"
        ],
        [
          "08:00, feeling well before breakfast",
          "Venous glucose 86 mg/dL"
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.fast",
        "label": "Supervised fasting evaluation with venous biochemical sampling",
        "isCorrect": false,
        "rationale": "The low overnight sensor values do not coincide with symptoms and disagree with simultaneous finger-stick results. They do not establish a fasting syndrome that should determine the first investigation of the separate postmeal spells.",
        "distractorRationale": "The low overnight sensor values do not coincide with symptoms and disagree with simultaneous finger-stick results. They do not establish a fasting syndrome that should determine the first investigation of the separate postmeal spells."
      },
      {
        "id": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.spontaneous",
        "label": "Venous biochemical sampling during a typical spontaneous spell",
        "isCorrect": true,
        "rationale": "The symptom diary and glucose log represent different events. Characterizing a typical symptomatic postmeal spell establishes the missing symptom-biochemistry relationship before assigning its cause.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.ogtt",
        "label": "Oral glucose tolerance testing with venous biochemical sampling",
        "isCorrect": false,
        "rationale": "A standardized glucose load may provoke lows that do not establish what occurs during this patient's ordinary episodes. The current PBH guideline does not recommend OGTT diagnosis of PBH.",
        "distractorRationale": "A standardized glucose load may provoke lows that do not establish what occurs during this patient's ordinary episodes. The current PBH guideline does not recommend OGTT diagnosis of PBH."
      }
    ],
    "explanation": "Align symptoms and samples by episode. The asymptomatic overnight sensor values are not biochemical evidence for the daytime spells, and the normal clinic sample was obtained while she felt well. Obtain appropriate venous sampling during a typical spontaneous event. A low value by itself would still not complete the full etiologic evaluation or prove PBH.",
    "supportingEvidenceClaimIds": [
      "claim.bariatric-metabolic.pbh-confirm",
      "claim.bariatric-metabolic.pbh-cgm",
      "claim.bariatric-metabolic.pbh-no-provocation",
      "claim.bariatric-metabolic.hypoglycemia-sampling-context"
    ]
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "conceptId": "concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2",
    "stem": "Which next medication plan best fits {patientName}'s symptom and treatment course?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed medication and symptom course; fictional patient observations",
      "columnHeaders": [
        "Recorded response"
      ],
      "rowHeaders": [
        "Dietary care before medication",
        "Acarbose taken with meals",
        "Acarbose withheld",
        "Acarbose reintroduced with meals"
      ],
      "cells": [
        [
          "Postmeal lows interrupt work despite the implemented eating plan"
        ],
        [
          "Hypoglycemic events are fewer; marked bloating, cramping and diarrhea prevent usual activities"
        ],
        [
          "Bloating and diarrhea settle; measured postmeal lows recur"
        ],
        [
          "The same activity-limiting gastrointestinal symptoms return"
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.bariatric-metabolic.diet-response-drug-stage.v2.acarbose",
        "label": "Continue the acarbose-based medication plan",
        "isCorrect": false,
        "rationale": "The record shows benefit but also reproducible activity-limiting gastrointestinal effects that resolve on withdrawal and return on reintroduction. Persistence is not merely an untried first-drug stage.",
        "distractorRationale": "The record shows benefit but also reproducible activity-limiting gastrointestinal effects that resolve on withdrawal and return on reintroduction. Persistence is not merely an untried first-drug stage."
      },
      {
        "id": "choice.topic.bariatric-metabolic.diet-response-drug-stage.v2.diazoxide",
        "label": "Change to an oral diazoxide-based plan",
        "isCorrect": false,
        "rationale": "Diazoxide is a later option. Intolerance of acarbose does not itself establish that the somatostatin-analogue stage is unsuitable or has failed.",
        "distractorRationale": "Diazoxide is a later option. Intolerance of acarbose does not itself establish that the somatostatin-analogue stage is unsuitable or has failed."
      },
      {
        "id": "choice.topic.bariatric-metabolic.diet-response-drug-stage.v2.octreotide",
        "label": "Change to short-acting subcutaneous octreotide",
        "isCorrect": true,
        "rationale": "The withdrawal/rechallenge course supports clinically important acarbose intolerance. Short-acting octreotide is a guideline-supported option when acarbose is ineffective or not tolerated.",
        "distractorRationale": null
      }
    ],
    "explanation": "Fewer lows do not by themselves establish an acceptable medication response. The repeated gastrointestinal pattern on withdrawal and reintroduction supports acarbose intolerance. Consider a specialist-directed short-acting somatostatin analogue such as octreotide rather than insisting on the same drug or skipping directly to diazoxide. No dose, maximum trial count or universal adverse-effect cutoff is supplied.",
    "supportingEvidenceClaimIds": [
      "claim.bariatric-metabolic.pbh-acarbose",
      "claim.bariatric-metabolic.pbh-acarbose-gi-effects",
      "claim.bariatric-metabolic.pbh-second-line",
      "claim.bariatric-metabolic.pbh-diazoxide"
    ]
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "conceptId": "concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2",
    "stem": "Which investigation best clarifies {patientName}'s continuing regurgitation before further post-sleeve treatment?",
    "answerChoices": [
      {
        "id": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-off",
        "label": "Ambulatory pH-only monitoring after PPI withdrawal",
        "isCorrect": false,
        "rationale": "Off-therapy monitoring can establish an unproven diagnosis. Prior grade C esophagitis already provides objective GERD evidence, and this protocol does not answer the present on-treatment symptom question.",
        "distractorRationale": "Off-therapy monitoring can establish an unproven diagnosis. Prior grade C esophagitis already provides objective GERD evidence, and this protocol does not answer the present on-treatment symptom question."
      },
      {
        "id": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-off",
        "label": "Ambulatory impedance-pH monitoring after PPI withdrawal",
        "isCorrect": false,
        "rationale": "Adding impedance does not correct the mismatch in medication state. Off-therapy testing asks about untreated reflux rather than the relationship between symptoms and reflux during the recorded regimen.",
        "distractorRationale": "Adding impedance does not correct the mismatch in medication state. Off-therapy testing asks about untreated reflux rather than the relationship between symptoms and reflux during the recorded regimen."
      },
      {
        "id": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-on",
        "label": "Ambulatory pH-only monitoring during PPI treatment",
        "isCorrect": false,
        "rationale": "The medication state fits a persistent on-treatment question, but pH-only monitoring does not capture the full association with nonacid reflux that impedance-pH can evaluate.",
        "distractorRationale": "The medication state fits a persistent on-treatment question, but pH-only monitoring does not capture the full association with nonacid reflux that impedance-pH can evaluate."
      },
      {
        "id": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-on",
        "label": "Ambulatory impedance-pH monitoring during PPI treatment",
        "isCorrect": true,
        "rationale": "GERD is already objectively established, but the mechanism of the current symptoms during therapy remains unresolved. On-treatment impedance-pH evaluates their relationship with acid and nonacid reflux before another treatment decision.",
        "distractorRationale": null
      }
    ],
    "explanation": "The prior grade C esophagitis establishes GERD, but it does not prove that the current regurgitation during treatment has the same mechanism. ACG recommends on-therapy impedance-pH assessment for persistent symptoms in established GERD on twice-daily PPI. The on/off state and impedance/pH scope answer different questions. The result may inform later bariatric treatment; this item does not force an operation from an adequacy label.",
    "supportingEvidenceClaimIds": [
      "claim.bariatric-metabolic.ppi-meal-timing",
      "claim.bariatric-metabolic.ppi-before-escalation",
      "claim.bariatric-metabolic.gerd-established-on-therapy-testing",
      "claim.bariatric-metabolic.gerd-unproven-off-therapy-testing",
      "claim.bariatric-metabolic.gerd-impedance-scope"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "stem": "Which next plan was most appropriate for {patientName} after the first reduction attempt in the recorded admission?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-record observations; fictional patient",
      "items": [
        {
          "label": "Initial study",
          "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
        },
        {
          "label": "Reduction record",
          "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
        },
        {
          "label": "Reassessment",
          "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
        "label": "Attempt a delayed repeat image-guided enema",
        "isCorrect": true,
        "rationale": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
        "label": "Proceed to operative reduction now",
        "isCorrect": false,
        "rationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
        "distractorRationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable."
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
        "label": "Observe for spontaneous completion of reduction",
        "isCorrect": false,
        "rationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
        "distractorRationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern."
      }
    ],
    "explanation": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.intussusception-risk",
      "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
      "claim.pediatric-gi-abdominal-wall.intussusception-operation",
      "claim.pediatric-gi-abdominal-wall.intussusception-transient"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "conceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "stem": "Which next plan is best supported by {patientName}'s current course?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-record observations; fictional patient",
      "items": [
        {
          "label": "Serial radiology reports",
          "value": "Pneumatosis has decreased, but one dilated loop remains in the same position on consecutive films. No free intraperitoneal gas is reported."
        },
        {
          "label": "Concurrent clinical trend",
          "value": "Abdominal tenderness and distension have lessened. Ventilator and circulatory support have decreased, and lactate is falling."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.medical",
        "label": "Continue nonoperative NEC treatment",
        "isCorrect": true,
        "rationale": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
        "label": "Perform exploratory laparotomy",
        "isCorrect": false,
        "rationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
        "distractorRationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving."
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
        "label": "Insert a peritoneal drain",
        "isCorrect": false,
        "rationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
        "distractorRationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination."
      }
    ],
    "explanation": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
      "claim.pediatric-gi-abdominal-wall.nec-drain",
      "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
    "stem": "Which next decompression plan best fits {patientName}'s treatment response?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-record observations; fictional patient",
      "items": [
        {
          "label": "Therapeutic procedure record",
          "value": "Contrast traversed a small-caliber colon and entered the distal ileum around intraluminal pellets. During the procedure the contrast advanced farther proximally, pellet burden decreased and meconium passed; further ileal pellets remained."
        },
        {
          "label": "After the procedure",
          "value": "Distension decreased but persists with bilious gastric drainage. Perfusion and urine output are maintained. The abdomen is soft without erythema or guarding; imaging shows no free gas, volvulus or obstructing pseudocyst."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
        "label": "Repeat image-guided therapeutic contrast decompression",
        "isCorrect": true,
        "rationale": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
        "label": "Proceed to operative bowel decompression",
        "isCorrect": false,
        "rationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
        "distractorRationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt."
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
        "label": "Continue gastric drainage with observation",
        "isCorrect": false,
        "rationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
        "distractorRationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment."
      }
    ],
    "explanation": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
      "claim.pediatric-gi-abdominal-wall.meconium-enema",
      "claim.pediatric-gi-abdominal-wall.meconium-repeat",
      "claim.pediatric-gi-abdominal-wall.meconium-complicated"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
    "stem": "Which initial tumor-directed sequence should the outside team select for {patientName}?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-record observations; fictional patient",
      "items": [
        {
          "label": "Anatomic imaging",
          "value": "A mass expands the right renal parenchyma. The left kidney is normal. Enhancing tissue extends continuously from the right renal vein into the vena cava; its upper edge reaches the hepatic-vein confluence."
        },
        {
          "label": "Specialist review",
          "value": "The imaging appearance is typical of Wilms tumor. The staging review shows no distant lesions."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.biopsy",
        "label": "Biopsy, preoperative chemotherapy, then resection",
        "isCorrect": true,
        "rationale": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
        "label": "Nephrectomy with thrombectomy, then chemotherapy",
        "isCorrect": false,
        "rationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step.",
        "distractorRationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step."
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
        "label": "Preoperative chemotherapy, then resection histology",
        "isCorrect": false,
        "rationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted.",
        "distractorRationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted."
      }
    ],
    "explanation": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
      "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
      "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
      "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "conceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "stem": "Which repair-timing plan is most appropriate for {patientName}'s current groin finding?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-record observations; fictional patient",
      "items": [
        {
          "label": "Groin course",
          "value": "Pediatric surgical examinations repeatedly show an inguinal bulge that reduces completely. There have been no painful irreducible episodes, vomiting or skin changes."
        },
        {
          "label": "Respiratory and follow-up context",
          "value": "He still needs oxygen for bronchopulmonary dysplasia. His family can attend surgical follow-up and has been taught the warning signs requiring urgent reassessment."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.after",
        "label": "Plan repair after the neonatal hospitalization",
        "isCorrect": true,
        "rationale": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
        "distractorRationale": null
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before",
        "label": "Plan repair before neonatal discharge",
        "isCorrect": false,
        "rationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.",
        "distractorRationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison."
      },
      {
        "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.observe",
        "label": "Use serial surveillance for spontaneous resolution",
        "isCorrect": false,
        "rationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.",
        "distractorRationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan."
      }
    ],
    "explanation": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
    ]
  }
];
export const PROGRAM_BATCH5_TIMINGS: AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.arm-venous-duplex.v2",
          "choiceLabel": "Left-arm deep-venous duplex ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.venous_duplex"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.lymphoscintigraphy.v2",
          "choiceLabel": "Left-arm radionuclide lymphoscintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.central-venography.v2",
          "choiceLabel": "Chest CT venography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.iliac-venography.v1",
          "choiceLabel": "Iliac and pelvic CT venography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.repeat-proximal.v1",
          "choiceLabel": "Repeat femoral and popliteal compression duplex",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.venous_duplex"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.lymphatic-scan.v1",
          "choiceLabel": "Lower-limb radionuclide lymphoscintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.toe-waveforms.v1",
          "choiceLabel": "Left toe pressure and digital waveform testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.vascular_physiology"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.exercise-ankle.v1",
          "choiceLabel": "Left exercise ankle-pressure testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.vascular_physiology"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.arterial-cta.v1",
          "choiceLabel": "Left-leg CT angiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.serial-proximal.v2",
          "choiceLabel": "Arrange serial proximal compression ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.venous_duplex"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.iliocaval-imaging.v2",
          "choiceLabel": "Arrange iliocaval CT venography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.end-venous-testing.v2",
          "choiceLabel": "End venous testing and reassess the edema clinically",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.access-hand-physiology.compression-perfusion.v2",
          "choiceLabel": "Digital pressures and waveforms during access-compression testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.vascular_physiology"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.access-hand-physiology.repeat-median-study.v2",
          "choiceLabel": "Repeat nerve-conduction testing across the wrist",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.general_diagnostic"
          }
        },
        {
          "choiceId": "choice.vascular-venous-lymphatic-access.access-hand-physiology.cervical-mri.v2",
          "choiceLabel": "Cervical-spine magnetic resonance imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2",
    "nodeId": "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.endoscopy",
          "choiceLabel": "Upper endoscopy with esophageal and junction inspection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.barium",
          "choiceLabel": "Upright timed barium esophagography with tablet passage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.contrast_swallow"
          }
        },
        {
          "choiceId": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.ph",
          "choiceLabel": "Ambulatory esophageal pH-impedance reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.fast",
          "choiceLabel": "Supervised fasting evaluation with venous biochemical sampling",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.metabolic_workup"
          }
        },
        {
          "choiceId": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.spontaneous",
          "choiceLabel": "Venous biochemical sampling during a typical spontaneous spell",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.ogtt",
          "choiceLabel": "Oral glucose tolerance testing with venous biochemical sampling",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.metabolic_workup"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-off",
          "choiceLabel": "Ambulatory pH-only monitoring after PPI withdrawal",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
          }
        },
        {
          "choiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-off",
          "choiceLabel": "Ambulatory impedance-pH monitoring after PPI withdrawal",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
          }
        },
        {
          "choiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-on",
          "choiceLabel": "Ambulatory pH-only monitoring during PPI treatment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
          }
        },
        {
          "choiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-on",
          "choiceLabel": "Ambulatory impedance-pH monitoring during PPI treatment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "classification": {
      "kind": "no_test"
    }
  }
];
export const PROGRAM_BATCH5_RETIRED_CASES: SyntheticClinicalCase[] = [
  {
    "id": "case.postoperative-dvt.hernia-repair",
    "displayName": "Postoperative unilateral leg swelling",
    "patientPresentationVariantId": "presentation.postoperative-dvt.hernia-repair",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 47,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Leg swelling after surgery",
    "patientPresentationRevision": {
      "id": "pprv3.case.postoperative-dvt.hernia-repair",
      "patientPresentationVariantId": "presentation.postoperative-dvt.hernia-repair",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Leg swelling after surgery",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.postoperative-dvt.hernia-repair.female.47",
        "prototypeDemographics": {
          "ageYears": 47,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.hernia-repair.male.47",
        "prototypeDemographics": {
          "ageYears": 47,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.hernia-repair.female.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.hernia-repair.male.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "CDC VTE diagnosis guidance (2024)",
      "ASH Choosing Wisely (2014)"
    ],
    "decisionNodes": [
      {
        "id": "node.postoperative-dvt.hernia-repair.1",
        "questionVariantId": "question.postoperative-dvt.venous-duplex.v2",
        "primaryConceptId": "concept.postoperative-dvt.venous-duplex",
        "stem": "Which diagnostic study should be arranged promptly for {patientName}'s new postoperative leg symptoms?",
        "answerChoices": [
          {
            "id": "duplex_2",
            "label": "Venous duplex ultrasound",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.venous_duplex"
            }
          },
          {
            "id": "d_dimer_2",
            "label": "D-dimer assay",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "arterial_2",
            "label": "Arterial duplex ultrasound",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "ct_2",
            "label": "CT of the lower leg",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Prompt venous duplex/compression ultrasound evaluates new unilateral postoperative swelling suspicious for DVT.",
        "sourceLabels": [
          "CDC VTE diagnosis guidance (2024)",
          "ASH Choosing Wisely (2014)"
        ],
        "resultGateAfter": {
          "id": "gate.postop-dvt.duplex.2",
          "resultTypeId": "service.venous_duplex",
          "pendingLabel": "External venous duplex pending",
          "resultNarrative": "Venous duplex shows a noncompressible proximal deep vein, supporting a proximal DVT.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.venous_duplex.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.postoperative-dvt.hernia-repair.2",
        "questionVariantId": "question.postoperative-dvt.three-month-anticoagulation.v2",
        "primaryConceptId": "concept.postoperative-dvt.three-month-anticoagulation",
        "currentUpdate": "Venous duplex shows a noncompressible proximal deep vein, supporting a proximal DVT.",
        "stem": "With {patientName}'s first surgery-provoked proximal DVT and low bleeding risk, which plan is appropriate?",
        "answerChoices": [
          {
            "id": "anticoagulation_2",
            "label": "Therapeutic anticoagulation for three months",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "ivc_filter_2",
            "label": "IVC filter placement without anticoagulation",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "observe_2",
            "label": "Therapeutic anticoagulation indefinitely",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "repeat_duplex_2",
            "label": "Serial duplex surveillance without anticoagulation",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
        "sourceLabels": [
          "CDC VTE diagnosis guidance (2024)",
          "ASH Choosing Wisely (2014)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "ivc_filter_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “IVC filter placement without anticoagulation.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          },
          {
            "answerChoiceId": "observe_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Therapeutic anticoagulation indefinitely.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          },
          {
            "answerChoiceId": "repeat_duplex_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Serial duplex surveillance without anticoagulation.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Prompt venous duplex/compression ultrasound evaluates new unilateral postoperative swelling suspicious for DVT. For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter."
  },
  {
    "id": "case.postoperative-dvt.bowel-surgery",
    "displayName": "Postoperative unilateral leg swelling",
    "patientPresentationVariantId": "presentation.postoperative-dvt.bowel-surgery",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Leg swelling after surgery",
    "patientPresentationRevision": {
      "id": "pprv3.case.postoperative-dvt.bowel-surgery",
      "patientPresentationVariantId": "presentation.postoperative-dvt.bowel-surgery",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Leg swelling after surgery",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.postoperative-dvt.bowel-surgery.female.71",
        "prototypeDemographics": {
          "ageYears": 71,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.bowel-surgery.male.71",
        "prototypeDemographics": {
          "ageYears": 71,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.bowel-surgery.female.69",
        "prototypeDemographics": {
          "ageYears": 69,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.bowel-surgery.male.69",
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
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "CDC VTE diagnosis guidance (2024)",
      "ASH Choosing Wisely (2014)"
    ],
    "decisionNodes": [
      {
        "id": "node.postoperative-dvt.bowel-surgery.1",
        "questionVariantId": "question.postoperative-dvt.venous-duplex.v3",
        "primaryConceptId": "concept.postoperative-dvt.venous-duplex",
        "stem": "Which diagnostic study should be arranged promptly for {patientName}'s new postoperative leg symptoms?",
        "answerChoices": [
          {
            "id": "duplex_3",
            "label": "Venous duplex ultrasound",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.venous_duplex"
            }
          },
          {
            "id": "d_dimer_3",
            "label": "D-dimer assay",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "arterial_3",
            "label": "Arterial duplex ultrasound",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "ct_3",
            "label": "CT of the lower leg",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Prompt venous duplex/compression ultrasound evaluates new unilateral postoperative swelling suspicious for DVT.",
        "sourceLabels": [
          "CDC VTE diagnosis guidance (2024)",
          "ASH Choosing Wisely (2014)"
        ],
        "resultGateAfter": {
          "id": "gate.postop-dvt.duplex.3",
          "resultTypeId": "service.venous_duplex",
          "pendingLabel": "External venous duplex pending",
          "resultNarrative": "Venous duplex shows a noncompressible proximal deep vein, supporting a proximal DVT.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.venous_duplex.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.postoperative-dvt.bowel-surgery.2",
        "questionVariantId": "question.postoperative-dvt.three-month-anticoagulation.v3",
        "primaryConceptId": "concept.postoperative-dvt.three-month-anticoagulation",
        "currentUpdate": "Venous duplex shows a noncompressible proximal deep vein, supporting a proximal DVT.",
        "stem": "With {patientName}'s first surgery-provoked proximal DVT and low bleeding risk, which plan is appropriate?",
        "answerChoices": [
          {
            "id": "anticoagulation_3",
            "label": "Therapeutic anticoagulation for three months",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "ivc_filter_3",
            "label": "IVC filter placement without anticoagulation",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "observe_3",
            "label": "Therapeutic anticoagulation indefinitely",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "repeat_duplex_3",
            "label": "Serial duplex surveillance without anticoagulation",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
        "sourceLabels": [
          "CDC VTE diagnosis guidance (2024)",
          "ASH Choosing Wisely (2014)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "ivc_filter_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “IVC filter placement without anticoagulation.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          },
          {
            "answerChoiceId": "observe_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Therapeutic anticoagulation indefinitely.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          },
          {
            "answerChoiceId": "repeat_duplex_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Serial duplex surveillance without anticoagulation.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Prompt venous duplex/compression ultrasound evaluates new unilateral postoperative swelling suspicious for DVT. For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter."
  },
  {
    "id": "case.postoperative-dvt.postop-visit",
    "displayName": "Postoperative unilateral leg swelling",
    "patientPresentationVariantId": "presentation.postoperative-dvt.postop-visit",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 55,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Leg swelling after surgery",
    "patientPresentationRevision": {
      "id": "pprv3.case.postoperative-dvt.postop-visit",
      "patientPresentationVariantId": "presentation.postoperative-dvt.postop-visit",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Leg swelling after surgery",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.postoperative-dvt.postop-visit.female.55",
        "prototypeDemographics": {
          "ageYears": 55,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.postop-visit.male.55",
        "prototypeDemographics": {
          "ageYears": 55,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.postop-visit.female.57",
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
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      },
      {
        "id": "profile.postoperative-dvt.postop-visit.male.57",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} returns for postoperative review after recent major surgery with new unilateral leg swelling and tenderness, low bleeding risk, and no chest symptoms, limb threat, active cancer, prior VTE, persistent provoking risk, or anticoagulation contraindication. Recovery from surgery is otherwise complete."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "CDC VTE diagnosis guidance (2024)",
      "ASH Choosing Wisely (2014)"
    ],
    "decisionNodes": [
      {
        "id": "node.postoperative-dvt.postop-visit.1",
        "questionVariantId": "question.postoperative-dvt.venous-duplex.v4",
        "primaryConceptId": "concept.postoperative-dvt.venous-duplex",
        "stem": "Which diagnostic study should be arranged promptly for {patientName}'s new postoperative leg symptoms?",
        "answerChoices": [
          {
            "id": "duplex_4",
            "label": "Venous duplex ultrasound",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.venous_duplex"
            }
          },
          {
            "id": "d_dimer_4",
            "label": "D-dimer assay",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "arterial_4",
            "label": "Arterial duplex ultrasound",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "ct_4",
            "label": "CT of the lower leg",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Prompt venous duplex/compression ultrasound evaluates new unilateral postoperative swelling suspicious for DVT.",
        "sourceLabels": [
          "CDC VTE diagnosis guidance (2024)",
          "ASH Choosing Wisely (2014)"
        ],
        "resultGateAfter": {
          "id": "gate.postop-dvt.duplex.4",
          "resultTypeId": "service.venous_duplex",
          "pendingLabel": "External venous duplex pending",
          "resultNarrative": "Venous duplex shows a noncompressible proximal deep vein, supporting a proximal DVT.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.venous_duplex.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.postoperative-dvt.postop-visit.2",
        "questionVariantId": "question.postoperative-dvt.three-month-anticoagulation.v4",
        "primaryConceptId": "concept.postoperative-dvt.three-month-anticoagulation",
        "currentUpdate": "Venous duplex shows a noncompressible proximal deep vein, supporting a proximal DVT.",
        "stem": "With {patientName}'s first surgery-provoked proximal DVT and low bleeding risk, which plan is appropriate?",
        "answerChoices": [
          {
            "id": "anticoagulation_4",
            "label": "Therapeutic anticoagulation for three months",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "ivc_filter_4",
            "label": "IVC filter placement without anticoagulation",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "observe_4",
            "label": "Therapeutic anticoagulation indefinitely",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "repeat_duplex_4",
            "label": "Serial duplex surveillance without anticoagulation",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
        "sourceLabels": [
          "CDC VTE diagnosis guidance (2024)",
          "ASH Choosing Wisely (2014)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "ivc_filter_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “IVC filter placement without anticoagulation.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          },
          {
            "answerChoiceId": "observe_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Therapeutic anticoagulation indefinitely.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          },
          {
            "answerChoiceId": "repeat_duplex_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Serial duplex surveillance without anticoagulation.”",
            "clinicalRationale": "For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter.",
            "sourceLabels": [
              "CDC VTE diagnosis guidance (2024)",
              "ASH Choosing Wisely (2014)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Prompt venous duplex/compression ultrasound evaluates new unilateral postoperative swelling suspicious for DVT. For a first uncomplicated proximal DVT provoked by resolved major surgery and low bleeding risk, discuss therapeutic anticoagulation for three months rather than a routine filter."
  },
  {
    "id": "case.post-bariatric-hypoglycemia.postmeal-shaking",
    "displayName": "Postmeal symptom review",
    "patientPresentationVariantId": "presentation.post-bariatric-hypoglycemia.postmeal-shaking",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
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
    "chiefComplaint": "Shaking after meals",
    "presentation": "{patientName} is a 44-year-old woman who reports recurrent postmeal shaking and sweating remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-shaking.female.44",
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
        "presentation": "{patientName} is a 44-year-old woman who reports recurrent postmeal shaking and sweating remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-shaking.male.44",
        "prototypeDemographics": {
          "ageYears": 44,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 44-year-old man who reports recurrent postmeal shaking and sweating remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-shaking.female.46",
        "prototypeDemographics": {
          "ageYears": 46,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 46-year-old woman who reports recurrent postmeal shaking and sweating remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-shaking.male.46",
        "prototypeDemographics": {
          "ageYears": 46,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 46-year-old man who reports recurrent postmeal shaking and sweating remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Society for Endocrinology PBH guideline (2024)",
      "ESPEN/UEG obesity-care guideline (2022)"
    ],
    "decisionNodes": [
      {
        "id": "node.post-bariatric-hypoglycemia.postmeal-shaking.1",
        "questionVariantId": "question.pbh.completed-whipple-triad.v1",
        "primaryConceptId": "concept.pbh.completed-whipple-triad",
        "stem": "Which diagnosis best explains {patientName}'s completed spontaneous-episode findings?",
        "answerChoices": [
          {
            "id": "pbh_0",
            "label": "Post-bariatric hypoglycemia",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "dumping_0",
            "label": "Early dumping syndrome",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "insulinoma_0",
            "label": "Hypoglycemia from insulinoma",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "panic_0",
            "label": "Panic disorder",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
        "sourceLabels": [
          "Society for Endocrinology PBH guideline (2024)",
          "ESPEN/UEG obesity-care guideline (2022)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "dumping_0",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Early dumping syndrome.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "insulinoma_0",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Hypoglycemia from insulinoma.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "panic_0",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Panic disorder.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered."
  },
  {
    "id": "case.post-bariatric-hypoglycemia.postmeal-confusion",
    "displayName": "Postmeal symptom review",
    "patientPresentationVariantId": "presentation.post-bariatric-hypoglycemia.postmeal-confusion",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 51,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Confusion after meals",
    "presentation": "{patientName} is a 51-year-old woman who reports recurrent brief postmeal confusion remotely after sleeve gastrectomy, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-confusion.female.51",
        "prototypeDemographics": {
          "ageYears": 51,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 51-year-old woman who reports recurrent brief postmeal confusion remotely after sleeve gastrectomy, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-confusion.male.51",
        "prototypeDemographics": {
          "ageYears": 51,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 51-year-old man who reports recurrent brief postmeal confusion remotely after sleeve gastrectomy, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-confusion.female.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 49-year-old woman who reports recurrent brief postmeal confusion remotely after sleeve gastrectomy, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-confusion.male.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 49-year-old man who reports recurrent brief postmeal confusion remotely after sleeve gastrectomy, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Society for Endocrinology PBH guideline (2024)",
      "ESPEN/UEG obesity-care guideline (2022)"
    ],
    "decisionNodes": [
      {
        "id": "node.post-bariatric-hypoglycemia.postmeal-confusion.1",
        "questionVariantId": "question.pbh.completed-whipple-triad.v2",
        "primaryConceptId": "concept.pbh.completed-whipple-triad",
        "stem": "Which diagnosis best explains {patientName}'s completed spontaneous-episode findings?",
        "answerChoices": [
          {
            "id": "pbh_1",
            "label": "Post-bariatric hypoglycemia",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "dumping_1",
            "label": "Early dumping syndrome",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "insulinoma_1",
            "label": "Hypoglycemia from insulinoma",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "panic_1",
            "label": "Panic disorder",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
        "sourceLabels": [
          "Society for Endocrinology PBH guideline (2024)",
          "ESPEN/UEG obesity-care guideline (2022)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "dumping_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Early dumping syndrome.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "insulinoma_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Hypoglycemia from insulinoma.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "panic_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Panic disorder.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered."
  },
  {
    "id": "case.post-bariatric-hypoglycemia.postmeal-weakness",
    "displayName": "Postmeal symptom review",
    "patientPresentationVariantId": "presentation.post-bariatric-hypoglycemia.postmeal-weakness",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 38,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Weakness after meals",
    "presentation": "{patientName} is a 38-year-old woman who reports recurrent postmeal weakness and palpitations remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-weakness.female.38",
        "prototypeDemographics": {
          "ageYears": 38,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 38-year-old woman who reports recurrent postmeal weakness and palpitations remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-weakness.male.38",
        "prototypeDemographics": {
          "ageYears": 38,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 38-year-old man who reports recurrent postmeal weakness and palpitations remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-weakness.female.40",
        "prototypeDemographics": {
          "ageYears": 40,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 40-year-old woman who reports recurrent postmeal weakness and palpitations remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-weakness.male.40",
        "prototypeDemographics": {
          "ageYears": 40,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 40-year-old man who reports recurrent postmeal weakness and palpitations remotely after gastric bypass, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Society for Endocrinology PBH guideline (2024)",
      "ESPEN/UEG obesity-care guideline (2022)"
    ],
    "decisionNodes": [
      {
        "id": "node.post-bariatric-hypoglycemia.postmeal-weakness.1",
        "questionVariantId": "question.pbh.completed-whipple-triad.v3",
        "primaryConceptId": "concept.pbh.completed-whipple-triad",
        "stem": "Which diagnosis best explains {patientName}'s completed spontaneous-episode findings?",
        "answerChoices": [
          {
            "id": "pbh_2",
            "label": "Post-bariatric hypoglycemia",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "dumping_2",
            "label": "Early dumping syndrome",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "insulinoma_2",
            "label": "Hypoglycemia from insulinoma",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "panic_2",
            "label": "Panic disorder",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
        "sourceLabels": [
          "Society for Endocrinology PBH guideline (2024)",
          "ESPEN/UEG obesity-care guideline (2022)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "dumping_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Early dumping syndrome.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "insulinoma_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Hypoglycemia from insulinoma.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "panic_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Panic disorder.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered."
  },
  {
    "id": "case.post-bariatric-hypoglycemia.postmeal-dizziness",
    "displayName": "Postmeal symptom review",
    "patientPresentationVariantId": "presentation.post-bariatric-hypoglycemia.postmeal-dizziness",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
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
    "chiefComplaint": "Dizziness after meals",
    "presentation": "{patientName} is a 57-year-old woman who reports recurrent postmeal dizziness and tremor remotely after bariatric surgery, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-dizziness.female.57",
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
        "presentation": "{patientName} is a 57-year-old woman who reports recurrent postmeal dizziness and tremor remotely after bariatric surgery, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-dizziness.male.57",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 57-year-old man who reports recurrent postmeal dizziness and tremor remotely after bariatric surgery, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-dizziness.female.55",
        "prototypeDemographics": {
          "ageYears": 55,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 55-year-old woman who reports recurrent postmeal dizziness and tremor remotely after bariatric surgery, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      },
      {
        "id": "profile.post-bariatric-hypoglycemia.postmeal-dizziness.male.55",
        "prototypeDemographics": {
          "ageYears": 55,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 55-year-old man who reports recurrent postmeal dizziness and tremor remotely after bariatric surgery, typically two to four hours after eating. During a spontaneous mild monitored episode, venous plasma glucose measured 48 mg/dL, symptoms resolved promptly after glucose correction, and the patient is now stable and cooperative. Episodes do not occur while fasting, and medication and systemic-illness review identifies no alternative cause."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Society for Endocrinology PBH guideline (2024)",
      "ESPEN/UEG obesity-care guideline (2022)"
    ],
    "decisionNodes": [
      {
        "id": "node.post-bariatric-hypoglycemia.postmeal-dizziness.1",
        "questionVariantId": "question.pbh.completed-whipple-triad.v4",
        "primaryConceptId": "concept.pbh.completed-whipple-triad",
        "stem": "Which diagnosis best explains {patientName}'s completed spontaneous-episode findings?",
        "answerChoices": [
          {
            "id": "pbh_3",
            "label": "Post-bariatric hypoglycemia",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "dumping_3",
            "label": "Early dumping syndrome",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "insulinoma_3",
            "label": "Hypoglycemia from insulinoma",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "panic_3",
            "label": "Panic disorder",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
        "sourceLabels": [
          "Society for Endocrinology PBH guideline (2024)",
          "ESPEN/UEG obesity-care guideline (2022)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "dumping_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Early dumping syndrome.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "insulinoma_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Hypoglycemia from insulinoma.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "panic_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Panic disorder.”",
            "clinicalRationale": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered.",
            "sourceLabels": [
              "Society for Endocrinology PBH guideline (2024)",
              "ESPEN/UEG obesity-care guideline (2022)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The spontaneous postmeal episode completes Whipple's triad and supports post-bariatric hypoglycemia after alternative causes are considered."
  },
  {
    "id": "case.venous-leg-ulcer.recurrent-ulcer",
    "displayName": "Lower-leg ulcer review",
    "patientPresentationVariantId": "presentation.venous-leg-ulcer.recurrent-ulcer",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 70,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Recurrent ankle ulcer",
    "presentation": "{patientName} is a 70-year-old woman who comes to clinic with a recurrent medial-ankle ulcer, lipodermatosclerotic skin changes, and no spreading infection or acute limb threat.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.venous-leg-ulcer.recurrent-ulcer.female.70",
        "prototypeDemographics": {
          "ageYears": 70,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 70-year-old woman who comes to clinic with a recurrent medial-ankle ulcer, lipodermatosclerotic skin changes, and no spreading infection or acute limb threat."
      },
      {
        "id": "profile.venous-leg-ulcer.recurrent-ulcer.male.70",
        "prototypeDemographics": {
          "ageYears": 70,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 70-year-old man who comes to clinic with a recurrent medial-ankle ulcer, lipodermatosclerotic skin changes, and no spreading infection or acute limb threat."
      },
      {
        "id": "profile.venous-leg-ulcer.recurrent-ulcer.female.68",
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
        "presentation": "{patientName} is a 68-year-old woman who comes to clinic with a recurrent medial-ankle ulcer, lipodermatosclerotic skin changes, and no spreading infection or acute limb threat."
      },
      {
        "id": "profile.venous-leg-ulcer.recurrent-ulcer.male.68",
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
        "presentation": "{patientName} is a 68-year-old man who comes to clinic with a recurrent medial-ankle ulcer, lipodermatosclerotic skin changes, and no spreading infection or acute limb threat."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ESVS chronic venous disease guideline (2022)"
    ],
    "decisionNodes": [
      {
        "id": "node.venous-leg-ulcer.recurrent-ulcer.1",
        "questionVariantId": "question.venous-leg-ulcer.arterial-assessment-before-compression.v2",
        "primaryConceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
        "stem": "Which evaluation should be obtained before selecting compression for {patientName}'s leg ulcer?",
        "answerChoices": [
          {
            "id": "abi_1",
            "label": "Ankle-brachial index",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.resting_abi"
            }
          },
          {
            "id": "venogram_1",
            "label": "Contrast venography",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "skin_biopsy_1",
            "label": "Ulcer-edge biopsy",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "culture_1",
            "label": "Superficial wound culture",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Assess arterial status, including ABI when appropriate, before selecting compression.",
        "sourceLabels": [
          "ESVS chronic venous disease guideline (2022)"
        ],
        "resultGateAfter": {
          "id": "gate.venous-leg-ulcer.abi.1",
          "resultTypeId": "service.resting_abi",
          "pendingLabel": "External arterial assessment pending",
          "resultNarrative": "Arterial assessment returns an ABI of 1.05 with normal arterial waveforms.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.resting_abi.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.venous-leg-ulcer.recurrent-ulcer.2",
        "questionVariantId": "question.venous-leg-ulcer.compression-with-adequate-arterial-perfusion.v2",
        "primaryConceptId": "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion",
        "currentUpdate": "Arterial assessment returns an ABI of 1.05 with normal arterial waveforms.",
        "stem": "With {patientName}'s returned arterial assessment, which treatment supports healing of the active venous leg ulcer?",
        "answerChoices": [
          {
            "id": "compression_1",
            "label": "Compression therapy",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "arterial_1",
            "label": "Arterial bypass referral",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "antibiotic_1",
            "label": "Empiric intravenous antibiotics",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "observe_1",
            "label": "Observation without compression",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
        "sourceLabels": [
          "ESVS chronic venous disease guideline (2022)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "arterial_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Arterial bypass referral.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "antibiotic_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Empiric intravenous antibiotics.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "observe_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Observation without compression.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Assess arterial status, including ABI when appropriate, before selecting compression. Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation."
  },
  {
    "id": "case.venous-leg-ulcer.varicose-changes",
    "displayName": "Lower-leg ulcer review",
    "patientPresentationVariantId": "presentation.venous-leg-ulcer.varicose-changes",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 49,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Ankle discoloration",
    "presentation": "{patientName} is a 49-year-old woman who comes to clinic with a shallow ulcer on the inner lower leg above the ankle near varicosities, brown discoloration, and no ischemic pain.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.venous-leg-ulcer.varicose-changes.female.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 49-year-old woman who comes to clinic with a shallow ulcer on the inner lower leg above the ankle near varicosities, brown discoloration, and no ischemic pain."
      },
      {
        "id": "profile.venous-leg-ulcer.varicose-changes.male.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 49-year-old man who comes to clinic with a shallow ulcer on the inner lower leg above the ankle near varicosities, brown discoloration, and no ischemic pain."
      },
      {
        "id": "profile.venous-leg-ulcer.varicose-changes.female.51",
        "prototypeDemographics": {
          "ageYears": 51,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 51-year-old woman who comes to clinic with a shallow ulcer on the inner lower leg above the ankle near varicosities, brown discoloration, and no ischemic pain."
      },
      {
        "id": "profile.venous-leg-ulcer.varicose-changes.male.51",
        "prototypeDemographics": {
          "ageYears": 51,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 51-year-old man who comes to clinic with a shallow ulcer on the inner lower leg above the ankle near varicosities, brown discoloration, and no ischemic pain."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ESVS chronic venous disease guideline (2022)"
    ],
    "decisionNodes": [
      {
        "id": "node.venous-leg-ulcer.varicose-changes.1",
        "questionVariantId": "question.venous-leg-ulcer.arterial-assessment-before-compression.v3",
        "primaryConceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
        "stem": "Which evaluation should be obtained before selecting compression for {patientName}'s leg ulcer?",
        "answerChoices": [
          {
            "id": "abi_2",
            "label": "Ankle-brachial index",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.resting_abi"
            }
          },
          {
            "id": "venogram_2",
            "label": "Contrast venography",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "skin_biopsy_2",
            "label": "Ulcer-edge biopsy",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "culture_2",
            "label": "Superficial wound culture",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Assess arterial status, including ABI when appropriate, before selecting compression.",
        "sourceLabels": [
          "ESVS chronic venous disease guideline (2022)"
        ],
        "resultGateAfter": {
          "id": "gate.venous-leg-ulcer.abi.2",
          "resultTypeId": "service.resting_abi",
          "pendingLabel": "External arterial assessment pending",
          "resultNarrative": "Arterial assessment returns an ABI of 1.05 with normal arterial waveforms.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.resting_abi.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.venous-leg-ulcer.varicose-changes.2",
        "questionVariantId": "question.venous-leg-ulcer.compression-with-adequate-arterial-perfusion.v3",
        "primaryConceptId": "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion",
        "currentUpdate": "Arterial assessment returns an ABI of 1.05 with normal arterial waveforms.",
        "stem": "With {patientName}'s returned arterial assessment, which treatment supports healing of the active venous leg ulcer?",
        "answerChoices": [
          {
            "id": "compression_2",
            "label": "Compression therapy",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "arterial_2",
            "label": "Arterial bypass referral",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "antibiotic_2",
            "label": "Empiric intravenous antibiotics",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "observe_2",
            "label": "Observation without compression",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
        "sourceLabels": [
          "ESVS chronic venous disease guideline (2022)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "arterial_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Arterial bypass referral.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "antibiotic_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Empiric intravenous antibiotics.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "observe_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Observation without compression.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Assess arterial status, including ABI when appropriate, before selecting compression. Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation."
  },
  {
    "id": "case.venous-leg-ulcer.healed-edge",
    "displayName": "Lower-leg ulcer review",
    "patientPresentationVariantId": "presentation.venous-leg-ulcer.healed-edge",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Slow-healing ulcer",
    "presentation": "{patientName} is a 64-year-old woman who comes to clinic with a chronic medial lower-leg ulcer, edema, hyperpigmentation, and no acute inflammatory or ischemic features.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.venous-leg-ulcer.healed-edge.female.64",
        "prototypeDemographics": {
          "ageYears": 64,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 64-year-old woman who comes to clinic with a chronic medial lower-leg ulcer, edema, hyperpigmentation, and no acute inflammatory or ischemic features."
      },
      {
        "id": "profile.venous-leg-ulcer.healed-edge.male.64",
        "prototypeDemographics": {
          "ageYears": 64,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 64-year-old man who comes to clinic with a chronic medial lower-leg ulcer, edema, hyperpigmentation, and no acute inflammatory or ischemic features."
      },
      {
        "id": "profile.venous-leg-ulcer.healed-edge.female.62",
        "prototypeDemographics": {
          "ageYears": 62,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 62-year-old woman who comes to clinic with a chronic medial lower-leg ulcer, edema, hyperpigmentation, and no acute inflammatory or ischemic features."
      },
      {
        "id": "profile.venous-leg-ulcer.healed-edge.male.62",
        "prototypeDemographics": {
          "ageYears": 62,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} is a 62-year-old man who comes to clinic with a chronic medial lower-leg ulcer, edema, hyperpigmentation, and no acute inflammatory or ischemic features."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ESVS chronic venous disease guideline (2022)"
    ],
    "decisionNodes": [
      {
        "id": "node.venous-leg-ulcer.healed-edge.1",
        "questionVariantId": "question.venous-leg-ulcer.arterial-assessment-before-compression.v4",
        "primaryConceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
        "stem": "Which evaluation should be obtained before selecting compression for {patientName}'s leg ulcer?",
        "answerChoices": [
          {
            "id": "abi_3",
            "label": "Ankle-brachial index",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.resting_abi"
            }
          },
          {
            "id": "venogram_3",
            "label": "Contrast venography",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "skin_biopsy_3",
            "label": "Ulcer-edge biopsy",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "culture_3",
            "label": "Superficial wound culture",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Assess arterial status, including ABI when appropriate, before selecting compression.",
        "sourceLabels": [
          "ESVS chronic venous disease guideline (2022)"
        ],
        "resultGateAfter": {
          "id": "gate.venous-leg-ulcer.abi.3",
          "resultTypeId": "service.resting_abi",
          "pendingLabel": "External arterial assessment pending",
          "resultNarrative": "Arterial assessment returns an ABI of 1.05 with normal arterial waveforms.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.resting_abi.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.venous-leg-ulcer.healed-edge.2",
        "questionVariantId": "question.venous-leg-ulcer.compression-with-adequate-arterial-perfusion.v4",
        "primaryConceptId": "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion",
        "currentUpdate": "Arterial assessment returns an ABI of 1.05 with normal arterial waveforms.",
        "stem": "With {patientName}'s returned arterial assessment, which treatment supports healing of the active venous leg ulcer?",
        "answerChoices": [
          {
            "id": "compression_3",
            "label": "Compression therapy",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "arterial_3",
            "label": "Arterial bypass referral",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "antibiotic_3",
            "label": "Empiric intravenous antibiotics",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "observe_3",
            "label": "Observation without compression",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
        "sourceLabels": [
          "ESVS chronic venous disease guideline (2022)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "arterial_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Arterial bypass referral.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "antibiotic_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Empiric intravenous antibiotics.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          },
          {
            "answerChoiceId": "observe_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Observation without compression.”",
            "clinicalRationale": "Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation.",
            "sourceLabels": [
              "ESVS chronic venous disease guideline (2022)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Assess arterial status, including ABI when appropriate, before selecting compression. Select compression therapy after adequate arterial assessment in this stable venous-ulcer presentation."
  },
  {
    "id": "case.gs028.varicose-veins.a-asymmetric-branches",
    "displayName": "Symptomatic varicose veins",
    "patientPresentationVariantId": "presentation.gs028.varicose-veins.a-asymmetric-branches",
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
    "chiefComplaint": "Bulging calf veins",
    "presentation": "{patientName} is a 43-year-old woman who presents with unilateral bulging calf tributaries and chronic heaviness that improves with elevation. Examination shows no acute tenderness or whole-leg swelling.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028.varicose-veins.a-asymmetric-branches.female.43",
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
        "presentation": "{patientName} is a 43-year-old woman who presents with unilateral bulging calf tributaries and chronic heaviness that improves with elevation. Examination shows no acute tenderness or whole-leg swelling."
      },
      {
        "id": "profile.gs028.varicose-veins.a-asymmetric-branches.male.43",
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
        "presentation": "{patientName} is a 43-year-old man who presents with unilateral bulging calf tributaries and chronic heaviness that improves with elevation. Examination shows no acute tenderness or whole-leg swelling."
      },
      {
        "id": "profile.gs028.varicose-veins.a-asymmetric-branches.female.68",
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
        "presentation": "{patientName} is a 68-year-old woman who presents with unilateral bulging calf tributaries and chronic heaviness that improves with elevation. Examination shows no acute tenderness or whole-leg swelling."
      },
      {
        "id": "profile.gs028.varicose-veins.a-asymmetric-branches.male.68",
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
        "presentation": "{patientName} is a 68-year-old man who presents with unilateral bulging calf tributaries and chronic heaviness that improves with elevation. Examination shows no acute tenderness or whole-leg swelling."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "SVS/AVF/AVLS varicose veins guideline Part I",
      "SVS/AVF/AVLS varicose veins guideline Part II"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028.varicose-veins.a-asymmetric-branches.1",
        "questionVariantId": "question.varicose-veins.reflux-duplex-evaluation.v4",
        "primaryConceptId": "concept.varicose-veins.reflux-duplex-evaluation",
        "stem": "Which test best characterizes the underlying venous physiology?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "Venous duplex with reflux assessment",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.venous_duplex"
            }
          },
          {
            "id": "d1_4",
            "label": "Lower-extremity lymphatic nuclear imaging",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_4",
            "label": "Musculoskeletal MRI",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_4",
            "label": "Serum coagulation panel",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The required test is reflux duplex, distinct from an acute DVT-only compression examination.",
        "sourceLabels": [
          "SVS/AVF/AVLS varicose veins guideline Part I",
          "SVS/AVF/AVLS varicose veins guideline Part II"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Lower-extremity lymphatic nuclear imaging.”",
            "clinicalRationale": "The required test is reflux duplex, distinct from an acute DVT-only compression examination.",
            "sourceLabels": [
              "SVS/AVF/AVLS varicose veins guideline Part I",
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ]
          },
          {
            "answerChoiceId": "d2_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Musculoskeletal MRI.”",
            "clinicalRationale": "The required test is reflux duplex, distinct from an acute DVT-only compression examination.",
            "sourceLabels": [
              "SVS/AVF/AVLS varicose veins guideline Part I",
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ]
          },
          {
            "answerChoiceId": "d3_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Serum coagulation panel.”",
            "clinicalRationale": "The required test is reflux duplex, distinct from an acute DVT-only compression examination.",
            "sourceLabels": [
              "SVS/AVF/AVLS varicose veins guideline Part I",
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The required test is reflux duplex, distinct from an acute DVT-only compression examination."
  },
  {
    "id": "case.pediatric-clinic.groin-bulge-after-play",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "displayName": "Refer a childhood inguinal hernia",
    "patientPresentationVariantId": "presentation.pediatric-clinic.groin-bulge-after-play",
    "releasePointId": "release.l4.pediatrics",
    "patientDisplayName": "Noah Bennett",
    "prototypeDemographics": {
      "ageYears": 5,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Groin bulge",
    "presentation": "Noah Bennett, a 5-year-old boy, visits the clinic with his father, Daniel Bennett, who remains in the same room throughout the visit. His father has noticed a painless bulge in Noah's right groin during active play. A soft groin bulge appears when Noah coughs and disappears when he lies down. Noah is comfortable, with no vomiting or abdominal pain.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-clinic.groin-bulge-after-play.boy5",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Groin bulge",
        "presentation": "Noah Bennett, a 5-year-old boy, visits the clinic with his father, Daniel Bennett, who remains in the same room throughout the visit. His father has noticed a painless bulge in Noah's right groin during active play. A soft groin bulge appears when Noah coughs and disappears when he lies down. Noah is comfortable, with no vomiting or abdominal pain."
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
      "source.pediatric-clinic.nhs-hernia-2026"
    ],
    "decisionNodes": [
      {
        "id": "node.pediatric-clinic.groin-bulge-after-play.1",
        "questionVariantId": "question.pediatric-clinic.groin-bulge-after-play.v1",
        "primaryConceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
        "stem": "Which outpatient plan is most appropriate for Noah Bennett's clinically suspected inguinal hernia?",
        "answerChoices": [
          {
            "id": "choice.groin-bulge-after-play.surgery",
            "label": "Refer for pediatric surgical assessment",
            "isCorrect": true,
            "rationale": "The clinical groin-hernia finding warrants pediatric surgical referral even though Noah is comfortable today.",
            "serviceRequest": null
          },
          {
            "id": "choice.groin-bulge-after-play.observe",
            "label": "Continue observation in primary care",
            "isCorrect": false,
            "rationale": "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.",
            "serviceRequest": null
          },
          {
            "id": "choice.groin-bulge-after-play.parent-monitoring",
            "label": "Continue parent-led monitoring of the bulge",
            "isCorrect": false,
            "rationale": "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.",
            "serviceRequest": null
          },
          {
            "id": "choice.groin-bulge-after-play.pain-dependent",
            "label": "Defer surgical referral until pain develops",
            "isCorrect": false,
            "rationale": "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Noah's history and examination support a childhood inguinal hernia. Arrange pediatric surgical assessment, including when the child is comfortable and the bulge settles with position.",
        "teachingPoint": "A clinically suspected childhood inguinal hernia belongs in a pediatric surgical referral pathway.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025",
          "source.pediatric-clinic.nhs-hernia-2026"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.groin-bulge-after-play.observe",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          },
          {
            "answerChoiceId": "choice.groin-bulge-after-play.parent-monitoring",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          },
          {
            "answerChoiceId": "choice.groin-bulge-after-play.pain-dependent",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Review the teaching point and choice rationales for this clinic visit."
  },
  {
    "id": "case.pediatric-clinic.intermittent-groin-swelling",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "displayName": "Refer a childhood inguinal hernia",
    "patientPresentationVariantId": "presentation.pediatric-clinic.intermittent-groin-swelling",
    "releasePointId": "release.l4.pediatrics",
    "patientDisplayName": "Sofia Reed",
    "prototypeDemographics": {
      "ageYears": 9,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Intermittent groin swelling",
    "presentation": "Sofia Reed, a 9-year-old girl, visits the clinic with her mother, Helen Reed, who remains in the same room throughout the visit. Her mother describes a recurrent left groin bulge that appears when Sofia strains and disappears while she rests. The same soft bulge is visible during today's examination and settles when Sofia lies down. Sofia has no pain, vomiting or skin change.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-clinic.intermittent-groin-swelling.girl9",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 9,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Intermittent groin swelling",
        "presentation": "Sofia Reed, a 9-year-old girl, visits the clinic with her mother, Helen Reed, who remains in the same room throughout the visit. Her mother describes a recurrent left groin bulge that appears when Sofia strains and disappears while she rests. The same soft bulge is visible during today's examination and settles when Sofia lies down. Sofia has no pain, vomiting or skin change."
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
      "source.pediatric-clinic.nhs-hernia-2026"
    ],
    "decisionNodes": [
      {
        "id": "node.pediatric-clinic.intermittent-groin-swelling.1",
        "questionVariantId": "question.pediatric-clinic.intermittent-groin-swelling.v2",
        "primaryConceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
        "stem": "What is the best outpatient disposition for Sofia Reed's clinically apparent inguinal hernia?",
        "answerChoices": [
          {
            "id": "choice.intermittent-groin-swelling.surgery",
            "label": "Arrange a pediatric surgery referral",
            "isCorrect": true,
            "rationale": "The clinically apparent childhood inguinal hernia should be assessed by pediatric surgery.",
            "serviceRequest": null
          },
          {
            "id": "choice.intermittent-groin-swelling.observe",
            "label": "Arrange routine primary-care observation",
            "isCorrect": false,
            "rationale": "Routine observation alone omits the recommended referral for a childhood inguinal hernia.",
            "serviceRequest": null
          },
          {
            "id": "choice.intermittent-groin-swelling.parent-monitoring",
            "label": "Arrange parent-led monitoring of the bulge",
            "isCorrect": false,
            "rationale": "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment.",
            "serviceRequest": null
          },
          {
            "id": "choice.intermittent-groin-swelling.pain-dependent",
            "label": "Arrange surgical referral if pain develops",
            "isCorrect": false,
            "rationale": "A clinically apparent childhood inguinal hernia warrants referral even while it is painless.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Sofia's parent history and examination support a clinically apparent childhood groin hernia. Arrange pediatric surgical assessment based on these clinical findings.",
        "teachingPoint": "Child-specific groin-hernia referral is based on clinical history and examination.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025",
          "source.pediatric-clinic.nhs-hernia-2026"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.intermittent-groin-swelling.observe",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "Routine observation alone omits the recommended referral for a childhood inguinal hernia.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          },
          {
            "answerChoiceId": "choice.intermittent-groin-swelling.parent-monitoring",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          },
          {
            "answerChoiceId": "choice.intermittent-groin-swelling.pain-dependent",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "A clinically apparent childhood inguinal hernia warrants referral even while it is painless.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Review the teaching point and choice rationales for this clinic visit."
  }
];
export const PROGRAM_BATCH5_CLAIMS: (Omit<EvidenceClaim,"evidenceCategory" | "certainty"> & {evidenceCategory:EvidenceClaim["evidenceCategory"] | "applied_science" | "treatment" | "medication_safety" | "microbiology"; certainty:EvidenceClaim["certainty"] | "limited"} & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-proximal-treatment",
    "statement": "An established symptomatic proximal DVT generally requires therapeutic anticoagulation when bleeding risk permits.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-treatment-2020",
      "source.vascular-venous-lymphatic-access.thrombosis-canada-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-prophylaxis-not-treatment",
    "statement": "A postoperative prevention prescription does not establish that a proximal DVT has received therapeutic anticoagulation.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-treatment-2020"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Application of treatment versus prevention purpose; no dose inferred.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.filter-not-routine",
    "statement": "An IVC filter is not routinely added to therapeutic anticoagulation in a patient who can receive anticoagulation.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-treatment-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Conditional guideline recommendation; no independent second management publication retrieved.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-three-month-resolved",
    "statement": "VTE associated with a resolved major transient provoking factor can receive a three-month anticoagulation course.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.thrombosis-canada-2026",
      "source.vascular-venous-lymphatic-access.ash-treatment-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Canadian 2026 guide directly supports three months; ASH supports a broader three-to-six-month phase. No identical exact-duration rule across both is asserted.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-extended-context",
    "statement": "Recurrent unprovoked VTE or a persistent provoking context requires a different secondary-prevention assessment from a first event provoked by resolved major surgery.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-treatment-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No universal extension is asserted for a first weakly provoked/unprovoked event; cancer-specific management is outside this rule.",
    "applicablePopulation": "Eligible adults in the represented scenario; no pregnancy/pediatric extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-heterozygous-fvl-duration",
    "statement": "Isolated heterozygous factor V Leiden does not ordinarily change treatment duration for a first VTE after a resolved major transient trigger.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.thrombosis-canada-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "limited",
    "limitation": "One adequate targeted source for this exact genetic-duration distinction. No recommendation to order a thrombophilia panel, no universal rule for combined/homozygous defects, recurrent unprovoked VTE or persistent risks.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11",
    "targetedVerification": "Thrombosis Canada Duration of Treatment, April 2026, page 8: low-risk hereditary thrombophilia paragraph, cross-checked with resolved-major-transient section on page 5.",
    "reviewRound": "round2"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-residual-not-filter",
    "statement": "Residual noncompressibility without a new involved segment or a worsening course does not by itself establish recurrent thrombosis requiring an IVC filter.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-diagnosis-2018",
      "source.vascular-venous-lymphatic-access.ash-treatment-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Inference from recurrence criteria and filter guidance; no universal clot-resolution time.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-recurrent-comparison",
    "statement": "Prior and current compression studies should be compared when recurrence is suspected; a newly involved venous segment supports a new event.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-diagnosis-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Limited recurrence evidence; no diameter-change threshold is authored.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.lymphatic-pattern",
    "statement": "Lymphatic injury after nodal treatment can cause gradually evolving limb swelling, with pitting early and tissue thickening later.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.nci-lymphedema-2024",
      "source.vascular-venous-lymphatic-access.isl-lymphedema-2023"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.lymphatic-new-change",
    "statement": "A rapid change in a previously swollen limb requires assessment for another cause, including thrombosis, infection or proximal malignant obstruction.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.nci-lymphedema-2024",
      "source.vascular-venous-lymphatic-access.isl-lymphedema-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-postoperative-imaging",
    "statement": "New unilateral postoperative limb symptoms warrant an ultrasound-based DVT evaluation rather than a positive D-dimer being treated as diagnostic.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-diagnosis-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.venous-proximal-obstruction",
    "statement": "A continuous common-femoral waveform with reduced respiratory variation and whole-limb findings warrants proximal venous outflow investigation.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.svs-varicose-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "An indirect signal prompts investigation; it does not establish an iliac clot or one universal protocol.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.venous-reflux-protocol",
    "statement": "Compression testing for thrombus does not replace duplex mapping of reflux and connected superficial and deep venous anatomy before treatment.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.svs-varicose-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One multisociety publication; multiple copies are not independent corroboration.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-maturation",
    "statement": "Inspection, palpation and auscultation guide fistula maturation assessment, with ultrasound when the clinical question remains unresolved.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ukka-access-2025",
      "source.vascular-venous-lymphatic-access.kdoqi-access-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-maturation-timing",
    "statement": "UK Kidney Association guidance recommends investigating persisting adult fistula non-maturity beyond six weeks after formation.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ukka-access-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "A graded guideline assessment interval, not an irreversible-failure deadline or a universal cannulation cutoff. Clinical evolution and pediatric pathways differ.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11",
    "targetedVerification": "UKKA 2025 statement 3.9, targeted publisher check 2026-11-11.",
    "reviewRound": "round2"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-exam-interpretation",
    "statement": "An abnormal systolic-only thrill, resistant pulsatility or failure to collapse with arm elevation can prompt investigation of an access circuit rather than establish cannulation readiness from patency alone.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.kdoqi-access-2019",
      "source.vascular-venous-lymphatic-access.ukka-access-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "limited",
    "limitation": "Physical findings suggest a lesion but do not prove its exact site or that an operation is indicated. KDOQI is the exact examination-finding source; UKKA corroborates examination/ultrasound assessment.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11",
    "targetedVerification": "KDOQI Guideline 10 discussion page S66 and clinical-indicator section page S82; UKKA section 3.",
    "reviewRound": "round2"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.ulcer-noncompressible",
    "statement": "Failure to occlude ankle arterial signals prevents a high cuff-derived ABI from proving adequate perfusion; toe pressure and digital waveforms can address the limitation.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.aha-pad-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No new ABI cutoff or compression strength is authored.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.ulcer-perfusion-first",
    "statement": "Venous-appearing ulcer findings do not remove the need to assess ipsilateral arterial perfusion before compression selection.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.aha-pad-2024",
      "source.vascular-venous-lymphatic-access.evra-nihr-2019",
      "source.vlu.esvs-cvd.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "EVRA eligibility is not a universal compression threshold.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.arterial-exercise-testing",
    "statement": "Exercise ABI is used for exertional symptoms when resting ankle measurements are interpretable rather than to correct a nonocclusive cuff acquisition.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.aha-pad-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Targeted diagnostic physiology fact; no exercise protocol or cutoff authored.",
    "applicablePopulation": "Adults in the exact stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.ulcer-severe-ischemia",
    "statement": "ESVS advises against sustained ulcer compression when ankle pressure is below 60 mm Hg, toe pressure below 30 mm Hg, or ABI below 0.6.",
    "sourceIds": [
      "source.vlu.esvs-cvd.2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Consensus-level recommendation 72; thresholds are source-specific rather than claimed universal. Draft values are clearly beyond these boundaries.",
    "applicablePopulation": "Adults with the explicitly stated ulcer and ipsilateral arterial findings.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.ulcer-compression",
    "statement": "Compression supports healing in an assessed venous ulcer with adequate arterial perfusion.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.evra-nihr-2019",
      "source.vlu.esvs-cvd.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "ESVS guideline plus the EVRA government trial report; no pressure/device ranking beyond separately mapped exact ESVS pressure claims.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.ulcer-modified-compression",
    "statement": "ESVS allows consideration of closely supervised modified compression below 40 mm Hg in selected mixed ulcers when ankle pressure exceeds 60 mm Hg; its discussion also uses toe pressure above 30 mm Hg and ABI above 0.6.",
    "sourceIds": [
      "source.vlu.esvs-cvd.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Lower-strength recommendation 74 and section 6.3.3; one directly retrieved guideline for this exact boundary. Borderline/disputed ranges withheld.",
    "applicablePopulation": "Adults with the explicitly stated ulcer and ipsilateral arterial findings.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.ulcer-standard-pressure",
    "statement": "For an appropriately assessed active venous ulcer, ESVS recommends multilayer/inelastic compression or adjustable garments targeting at least 40 mm Hg at the ankle.",
    "sourceIds": [
      "source.vlu.esvs-cvd.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Exact value directly supported by recommendation 70; no brand or device superiority implied. Not extended to severe ischemia.",
    "applicablePopulation": "Adults with the explicitly stated ulcer and ipsilateral arterial findings.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.ulcer-current-record",
    "statement": "Compression eligibility must use current affected-limb perfusion rather than another limb or an unreconciled old measurement.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.aha-pad-2024",
      "source.vascular-venous-lymphatic-access.evra-nihr-2019",
      "source.vlu.esvs-cvd.2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Application of physiology and eligible compression populations, not a performance estimate.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-negative-proximal",
    "statement": "A negative initial proximal ultrasound with continuing intermediate or high suspicion and no alternative diagnosis can require serial proximal ultrasound.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-diagnosis-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No exact repeat interval is taught in these drafts.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.dvt-acquisition-adequacy",
    "statement": "A technically limited or wrong-territory venous examination cannot establish absence of thrombosis in unexamined proximal segments.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ash-diagnosis-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-ischemia-assessment",
    "statement": "Hand symptoms related to dialysis access require arterial perfusion assessment and evaluation of the access contribution rather than assuming outflow obstruction.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ukka-access-2025",
      "source.vascular-venous-lymphatic-access.kdoqi-access-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-compression-response",
    "statement": "Access-related distal ischemic features may change during transient access compression; perfusion testing can corroborate the clinical assessment.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ukka-access-2025",
      "source.vascular-venous-lymphatic-access.kdoqi-access-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "No numeric digital-pressure ratio or diagnostic certainty is claimed; clinical context and reversible arterial causes require specialist assessment.",
    "applicablePopulation": "Adults in the exact stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-clinical-indicators",
    "statement": "New cannulation difficulty, reduced dialysis delivery, prolonged post-needle bleeding or arm swelling warrant access evaluation.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ukka-access-2025",
      "source.vascular-venous-lymphatic-access.kdoqi-access-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-neuropathic-differential",
    "statement": "A prior neuropathic hand diagnosis does not remove the need to assess a new dialysis-access-related perfusion presentation; carpal tunnel and other nonvascular causes remain competing explanations.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ukka-access-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "limited",
    "limitation": "Guideline supports vascular and nonvascular differentials, not a validated digit-pattern decision rule. The case uses constructed temporal observations and an actual-described prior study; no exact nerve-conduction threshold is invented.",
    "applicablePopulation": "Adults in the stated scenario; no pediatric, pregnancy or universal prescribing extrapolation.",
    "lastCheckedOn": "2026-11-11",
    "targetedVerification": "UKKA 2025 steal-syndrome rationale: characteristic clinical features, compression response and nonvascular differential including carpal tunnel.",
    "reviewRound": "round2"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-neuropathy",
    "statement": "Acute severe multinerve sensorimotor dysfunction after access creation can reflect ischemic monomelic neuropathy despite a warm hand and preserved pulse.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.kdoqi-access-2019"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "One adequate guideline; rare complication and overlapping causes require urgent vascular examination.",
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.access-neuropathy-urgent",
    "statement": "Suspected ischemic monomelic neuropathy after access formation requires urgent surgical assessment for access closure rather than delayed electrodiagnostic confirmation.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.kdoqi-access-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Guideline describes immediate ligation; not every postoperative neuropathy requires ligation.",
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.catheter-thrombolytic-lock",
    "statement": "A thrombolytic lock is an initial treatment for established dialysis-catheter intraluminal dysfunction after mechanical causes have been assessed.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ukka-access-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No dose or dwell duration; trained dialysis staff, not clinic manipulation. One current guideline.",
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.vascular-venous-lymphatic-access.catheter-site",
    "statement": "The right internal jugular route is generally favored for a tunneled dialysis catheter, avoiding subclavian access when suitable alternatives exist.",
    "sourceIds": [
      "source.vascular-venous-lymphatic-access.ukka-access-2025",
      "source.vascular-venous-lymphatic-access.kdoqi-access-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Vessel patency, future access and individual anatomy can modify the default.",
    "applicablePopulation": "Adults in the stated scenario; no universal dose or procedure ranking.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.esophagus-motility-achalasia.post-treatment-tbe",
    "statement": "Timed barium esophagography is the ACG first-line objective assessment for persistent or recurrent symptoms after definitive achalasia treatment.",
    "sourceIds": [
      "source.esophagus-motility-achalasia.acg-achalasia-2020",
      "source.esophagus-motility-achalasia.seoul-achalasia-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "ACG names the first-line role. Seoul independently supports outcome assessment. Other findings remain complementary.",
    "applicablePopulation": "Adults in outpatient foregut assessment or clinic review of outside treatment records.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "ACG recommendation 17 and Seoul statement 7"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.esophagus-motility-achalasia.barium-clearance",
    "statement": "A standardized upright timed barium examination assesses esophageal clearance.",
    "sourceIds": [
      "source.esophagus-motility-achalasia.acg-physiology-2020",
      "source.esophagus-motility-achalasia.seoul-achalasia-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Individual series are constructed and interpreted with symptoms and anatomy.",
    "applicablePopulation": "Adults in outpatient foregut assessment or clinic review of outside treatment records.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "ACG physiology key concepts and Seoul statement 7"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.esophagus-motility-achalasia.tablet-obstruction",
    "statement": "A barium tablet can add evidence about junction-level obstruction during esophagography.",
    "sourceIds": [
      "source.esophagus-motility-achalasia.acg-physiology-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "One directly checked guideline. No tablet-size or treatment cutoff authored.",
    "applicablePopulation": "Adults in outpatient foregut assessment or clinic review of outside treatment records.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "ACG physiology barium recommendation 4"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.esophagus-motility-achalasia.hrm-acquisition",
    "statement": "Reliable manometric interpretation depends on junction-crossing acquisition and an adequate separated-swallow protocol.",
    "sourceIds": [
      "source.esophagus-motility-achalasia.chicago-v4-2021",
      "source.esophagus-motility-achalasia.acg-physiology-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Failed studies have several completion or complementary options.",
    "applicablePopulation": "Adults in outpatient foregut assessment or clinic review of outside treatment records.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "CCv4 standard protocol and ACG obstructive-symptom evaluation"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.esophagus-motility-achalasia.myotomy-limit",
    "statement": "Achalasia treatment reduces junction resistance while loss of normal motor function can persist.",
    "sourceIds": [
      "source.esophagus-motility-achalasia.acg-achalasia-2020",
      "source.esophagus-motility-achalasia.seoul-achalasia-2020"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Improved relaxation does not establish normal bolus emptying.",
    "applicablePopulation": "Adults in outpatient foregut assessment or clinic review of outside treatment records.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "ACG treatment goals and Seoul disease definition"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.esophagus-motility-achalasia.recurrence-mechanisms",
    "statement": "Recurrent symptoms after myotomy can arise from residual obstruction, altered anatomy, reflux injury or persistent motor dysfunction.",
    "sourceIds": [
      "source.esophagus-motility-achalasia.acg-achalasia-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly checked guideline. Symptoms do not establish which mechanism is active.",
    "applicablePopulation": "Adults in outpatient foregut assessment or clinic review of outside treatment records.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "ACG post-therapy/failed-therapy sections"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.esophagus-motility-achalasia.objective-postpoem-reflux",
    "statement": "Post-POEM symptoms require objective assessment because reflux and impaired-clearance symptoms can overlap.",
    "sourceIds": [
      "source.esophagus-motility-achalasia.sages-poem-update-2025",
      "source.esophagus-motility-achalasia.acg-achalasia-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Endoscopy and clearance findings answer complementary questions.",
    "applicablePopulation": "Adults in outpatient foregut assessment or clinic review of outside treatment records.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "SAGES KQ1 and ACG post-therapy assessment"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.esophagus-motility-achalasia.posttherapy-endoscopic-targets",
    "statement": "Endoscopy can evaluate reflux injury and luminal narrowing when symptoms recur after achalasia treatment.",
    "sourceIds": [
      "source.esophagus-motility-achalasia.acg-achalasia-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly checked guideline supports this complementary role. The current comparison uses its first-line timed-barium recommendation for recurrent retention-like symptoms.",
    "applicablePopulation": "Adults undergoing assessment of post-myotomy symptoms or appropriate esophageal testing.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "ACG diagnostic testing and post-therapy assessment"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.pbh-confirm",
    "statement": "Symptomatic spontaneous venous glucose below 54 mg/dL with symptom relief after correction supports PBH after alternative causes are evaluated.",
    "sourceIds": [
      "source.bariatric-metabolic.sfe-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The threshold is the guideline's pragmatic criterion; postmeal timing and surgical history do not exclude all other causes.",
    "applicablePopulation": "Adults in the explicitly constructed bariatric clinic or outside-record-review context; each question supplies procedure and care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "Relevant named clinical section; independently synthesized atomic fact"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.pbh-cgm",
    "statement": "CGM readings do not by themselves establish the diagnosis of PBH.",
    "sourceIds": [
      "source.bariatric-metabolic.sfe-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Does not deny a role for CGM in education or ongoing management.",
    "applicablePopulation": "Adults in the explicitly constructed bariatric clinic or outside-record-review context; each question supplies procedure and care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "Relevant named clinical section; independently synthesized atomic fact"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.pbh-no-provocation",
    "statement": "The 2024 Society for Endocrinology guideline advises against OGTT or mixed-meal provocation for PBH diagnosis.",
    "sourceIds": [
      "source.bariatric-metabolic.sfe-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Older ESPEN/UEG and dumping guidance differ on provocation. This packet does not make a general claim for all dumping syndromes.",
    "applicablePopulation": "Adults in the explicitly constructed bariatric clinic or outside-record-review context; each question supplies procedure and care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "SfE recommendations 1.4–1.5"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.hypoglycemia-sampling-context",
    "statement": "Supervised fasting evaluation can be used to recreate a suspected fasting hypoglycemic syndrome when a spontaneous episode cannot be characterized.",
    "sourceIds": [
      "source.bariatric-metabolic.labmed-hypoglycemia-summary-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Older professional summary is a limited cross-check of a real competing test. It does not establish that unconfirmed overnight CGM readings warrant a fast or that mixed-meal testing is recommended for PBH. No duration/protocol cutoff is authored.",
    "applicablePopulation": "Adults in the explicitly constructed post-bariatric clinic or outside-record review; the individual vignette supplies procedure and current care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "Professional summary, investigation and assay timing sections"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.pbh-acarbose",
    "statement": "Acarbose is a first pharmacological option when PBH needs drug treatment.",
    "sourceIds": [
      "source.bariatric-metabolic.sfe-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One directly read guideline; no universal dose, efficacy probability or mandatory time-to-failure is asserted.",
    "applicablePopulation": "Adults in the explicitly constructed bariatric clinic or outside-record-review context; each question supplies procedure and care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "SfE recommendation 3.1"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.pbh-acarbose-gi-effects",
    "statement": "Acarbose can cause abdominal pain, bloating, flatulence and diarrhea that limit continued use.",
    "sourceIds": [
      "source.bariatric-metabolic.sfe-2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "No adverse-event frequency, mandatory trial duration or maximum-tolerated dose is invented; the case supplies its own withdrawal/rechallenge observations.",
    "applicablePopulation": "Adults in the explicitly constructed post-bariatric clinic or outside-record review; the individual vignette supplies procedure and current care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "SfE acarbose discussion, page 13"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.pbh-second-line",
    "statement": "Short-acting subcutaneous octreotide or pasireotide are options when acarbose is ineffective or not tolerated.",
    "sourceIds": [
      "source.bariatric-metabolic.sfe-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Named alternatives are not ranked against each other. No off-label prescribing approval or regimen is conferred.",
    "applicablePopulation": "Adults in the explicitly constructed bariatric clinic or outside-record-review context; each question supplies procedure and care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "SfE recommendation 3.2"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.pbh-diazoxide",
    "statement": "The 2024 PBH guideline places diazoxide as a possible third-line option when somatostatin analogues are not tolerated.",
    "sourceIds": [
      "source.bariatric-metabolic.sfe-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single guideline, recommendation 3.3; no dose or eligibility protocol authored.",
    "applicablePopulation": "Adults in the explicitly constructed bariatric clinic or outside-record-review context; each question supplies procedure and care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "SfE recommendation 3.3"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.ppi-meal-timing",
    "statement": "Conventional delayed-release PPI administration should be checked relative to meals; ACG recommends dosing 30-60 minutes before a meal rather than at bedtime.",
    "sourceIds": [
      "source.bariatric-metabolic.acg-gerd-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Applies to conventional delayed-release preparations such as the named omeprazole, not every formulation. This medication interval is directly sourced and is not a gameplay wait.",
    "applicablePopulation": "Adults in the explicitly constructed post-bariatric clinic or outside-record review; the individual vignette supplies procedure and current care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "ACG PPI administration and optimization sections"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.ppi-before-escalation",
    "statement": "PPI adherence and administration should be assessed and optimized before labeling persistent symptoms treatment-refractory.",
    "sourceIds": [
      "source.bariatric-metabolic.acg-gerd-2022",
      "source.bariatric-metabolic.sages-comorbidities-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "SAGES supplies the post-sleeve medical-first setting; ACG provides the administration check. No universal dose, maximum regimen or mandatory treatment duration is invented.",
    "applicablePopulation": "Adults in the explicitly constructed post-bariatric clinic or outside-record review; the individual vignette supplies procedure and current care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "ACG refractory GERD recommendations and optimization; SAGES KQ2"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.gerd-established-on-therapy-testing",
    "statement": "For established GERD with persistent symptoms on twice-daily PPI, ACG recommends impedance-pH monitoring on therapy to evaluate the ongoing symptoms.",
    "sourceIds": [
      "source.bariatric-metabolic.acg-gerd-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "The question supplies prior LA grade C esophagitis and a recorded twice-daily regimen. This does not diagnose recurrent reflux from symptoms or claim every symptom is reflux-mediated.",
    "applicablePopulation": "Adults in the explicitly constructed post-bariatric clinic or outside-record review; the individual vignette supplies procedure and current care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "ACG refractory GERD recommendations and reflux monitoring section"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.gerd-unproven-off-therapy-testing",
    "statement": "Off-therapy reflux monitoring is used to establish GERD when prior objective evidence has not established the diagnosis.",
    "sourceIds": [
      "source.bariatric-metabolic.acg-gerd-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Contrasts diagnostic confirmation with investigation of symptoms in already established disease. Severe LA C/D esophagitis is prior objective evidence; no new acid-exposure cutoff is authored.",
    "applicablePopulation": "Adults in the explicitly constructed post-bariatric clinic or outside-record review; the individual vignette supplies procedure and current care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "ACG refractory GERD recommendations"
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bariatric-metabolic.gerd-impedance-scope",
    "statement": "Impedance-pH monitoring can relate symptoms to nonacid as well as acid reflux, whereas pH-only monitoring does not capture the full nonacid question during PPI therapy.",
    "sourceIds": [
      "source.bariatric-metabolic.acg-gerd-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One society guideline; no diagnostic yield, sensitivity, prevalence or symptom-association cutoff is authored.",
    "applicablePopulation": "Adults in the explicitly constructed post-bariatric clinic or outside-record review; the individual vignette supplies procedure and current care phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "supportLocator": "ACG on-therapy reflux monitoring discussion"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "statement": "Unfavorable ultrasound findings such as trapped fluid can predict more difficult reduction without independently prohibiting enema reduction in a stable child without peritonitis or perforation.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
      "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No pressure, success probability or fixed number of attempts authored.",
    "applicablePopulation": "Stable children with ileocolic intussusception.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "statement": "A delayed repeat image-guided enema is a reasonable option after partial reduction when the child remains stable and lacks peritoneal signs.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
      "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Conditional and locally determined; no mandatory waiting interval.",
    "applicablePopulation": "Children with partial progress during initial reduction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.intussusception-operation",
    "statement": "Persistently symptomatic intussusception that remains unreduced after reasonable enema attempts requires operative assessment; a documented lead point strengthens that need.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
      "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Recurrence alone is not a contraindication to another enema. Operation is keyed for persistent failed reduction plus a structural lesion, not age alone.",
    "applicablePopulation": "Persistent or recurrent ileocolic intussusception.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.intussusception-transient",
    "statement": "Transient small-bowel intussusception that resolves clinically and on reassessment differs from persistent symptomatic ileocolic intussusception.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The authored case has residual ileocolic disease; no length cutoff or automatic observation rule.",
    "applicablePopulation": "Children with transient small-bowel invagination.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
    "statement": "A fixed bowel loop should be interpreted with the infant's overall course rather than treated as an independent absolute indication for NEC surgery.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Conditional recommendation, very-low certainty. No reassuring inference from absence of free air alone.",
    "applicablePopulation": "Premature infants with NEC.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.nec-drain",
    "statement": "Peritoneal drainage can serve as a bridge when early NEC operation is not possible, and deterioration after drainage may still require laparotomy.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Many require later laparotomy; exact rescue thresholds are not defined.",
    "applicablePopulation": "Premature infants with suspected or confirmed perforated NEC.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty",
    "statement": "Initial laparotomy and initial drainage are both reasonable approaches to perforated NEC depending on patient and center factors.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "No universal superiority claim; the authored later deterioration is distinct from initial procedural choice.",
    "applicablePopulation": "Premature neonates with perforated NEC.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
    "statement": "Inspissated meconium in the distal ileum can cause neonatal bowel obstruction and warrants cystic-fibrosis evaluation.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Meconium ileus is not itself proof of cystic fibrosis.",
    "applicablePopulation": "Neonates with meconium ileus.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.meconium-enema",
    "statement": "Selected stable infants with uncomplicated meconium ileus can undergo image-guided water-soluble contrast enema after resuscitation.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate systematic review; nonstandard practice. No contrast product, concentration, dose or attempt count keyed.",
    "applicablePopulation": "Resuscitated stable infants without perforation or other operative complications.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.meconium-repeat",
    "statement": "Repeat image-guided contrast enemas can decompress selected uncomplicated meconium ileus; persistent obstruction after a first attempt does not by itself define failure of the whole nonoperative course.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single adequate licensed systematic review with heterogeneous protocols; it does not establish a universal attempt count, interval, contrast preparation or obligatory repeat instead of surgery.",
    "applicablePopulation": "Neonates or children in the exact constructed vignette; no universal protocol.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.meconium-complicated",
    "statement": "Perforation, volvulus or failed nonoperative decompression changes the operative boundary in meconium ileus.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Specific operative reconstruction depends on anatomy and clinical condition.",
    "applicablePopulation": "Infants with complicated or non-resolving meconium ileus.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
    "statement": "For presumed Wilms tumor with caval tumor extension at or above the hepatic veins, a biopsy and preoperative chemotherapy pathway is suggested before resection.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "NCI professional evidence summary, not a formal COG protocol document. Exact multidisciplinary plan and biopsy technique require clinician review; no regimen or response threshold is specified.",
    "applicablePopulation": "Children with presumed Wilms tumor in the stated COG/North American treatment context.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
    "statement": "Bilateral disease or tumor thrombus reaching the hepatic-vein level can alter the up-front nephrectomy pathway.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Counterfactual only; no drug regimen or automatic transplant/nephron-sparing technique.",
    "applicablePopulation": "Wilms tumor operative planning.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
    "statement": "Preoperative biopsy of an otherwise resectable Wilms tumor can assign local stage III under COG staging.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Does not imply biopsy is forbidden for inoperable or atypical masses.",
    "applicablePopulation": "COG-treated Wilms tumor.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy",
    "statement": "Under the COG/North American pathway, a typical resectable unilateral Wilms tumor is generally managed with up-front nephrectomy rather than preoperative biopsy.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Do not generalize to SIOP, bilateral tumors, atypical appearance, high caval extension or unsafe resection. One government evidence summary checked.",
    "applicablePopulation": "Typical unilateral resectable renal tumors in a COG-aligned center.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
    "statement": "Preterm inguinal-hernia timing balances incarceration during delay against respiratory and recurrence complications associated with earlier repair.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Predominantly retrospective synthesis; not an absolute repair-age rule. Other 2025 syntheses differ on the incarceration estimate.",
    "applicablePopulation": "Preterm infants with inguinal hernia during initial hospitalization.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory",
    "statement": "For a reducible hernia in a very preterm infant with ongoing respiratory disease, planning repair after the initial neonatal hospitalization can be reasonable with surgical follow-up and incarceration precautions.",
    "sourceIds": [
      "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One adequately licensed directly read synthesis. Clinical timing needs named review; no fixed postmenstrual age, weight or deadline is taught.",
    "applicablePopulation": "Reducible inguinal hernia with neonatal respiratory comorbidity.",
    "lastCheckedOn": "2026-11-11"
  }
];
export const PROGRAM_BATCH5_SOURCES: (Omit<ClinicalSource,"sourceClass" | "reuseStatus" | "publicationDateNote"> & {sourceClass:ClinicalSource["sourceClass"] | "regulatory_label"; reuseStatus:ClinicalSource["reuseStatus"] | "targeted_factual_verification_only"; publicationDateNote?:string | null} & Record<string,unknown>)[] = [
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.ash-treatment-2020",
    "title": "ASH 2020 DVT and PE treatment guideline",
    "completeCitation": "Ortel TL, Neumann I, Ageno W, Beyth R, Clark NP, Cuker A, Hutten BA, Jaff MR, Manja V, Schulman S, Thurston C, Vedantham S, Verhamme P, Witt DM, Florez ID, Izcovich A, Nieuwlaat R, Ross S, Schunemann HJ, Wiercioch W, Zhang Y, Zhang Y. American Society of Hematology 2020 guidelines for management of venous thromboembolism: treatment of deep vein thrombosis and pulmonary embolism. Blood Adv. 2020;4(19):4693-4738. doi:10.1182/bloodadvances.2020001830.",
    "organizationOrJournal": "American Society of Hematology / Blood Advances",
    "authors": [
      "Thomas L Ortel",
      "Ignacio Neumann",
      "Walter Ageno",
      "Rebecca Beyth",
      "Nathan P Clark",
      "Adam Cuker",
      "Barbara A Hutten",
      "Michael R Jaff",
      "Veena Manja",
      "Sam Schulman",
      "Caitlin Thurston",
      "Suresh Vedantham",
      "Peter Verhamme",
      "Daniel M Witt",
      "Ivan D Florez",
      "Ariel Izcovich",
      "Robby Nieuwlaat",
      "Stephanie Ross",
      "Holger J Schunemann",
      "Wojtek Wiercioch",
      "Yuan Zhang",
      "Yuqing Zhang"
    ],
    "publicationYear": 2020,
    "doi": "10.1182/bloodadvances.2020001830",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7556153/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted society factual verification and citation only. No source prose, tables, figures, algorithms or full text stored. No general AI/reproduction licence inferred from public access. No article-level CC licence located; standard copyright retained. PMC policy inspected. Recommendations 1, 3, 5, 7, 10-14 and 17-25 targeted; new 2026 PE summary separately cross-checked.",
    "authorityAssessment": "GRADE treatment guideline; many conditional recommendations. Three-to-six-month primary treatment is broader than the direct three-month statement in the 2026 Canadian guide.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-proximal-treatment",
      "claim.vascular-venous-lymphatic-access.dvt-prophylaxis-not-treatment",
      "claim.vascular-venous-lymphatic-access.dvt-three-month-resolved",
      "claim.vascular-venous-lymphatic-access.dvt-residual-not-filter",
      "claim.vascular-venous-lymphatic-access.filter-not-routine",
      "claim.vascular-venous-lymphatic-access.filter-contraindication",
      "claim.vascular-venous-lymphatic-access.filter-retrieval",
      "claim.vascular-venous-lymphatic-access.pe-admit-rv-biomarker",
      "claim.vascular-venous-lymphatic-access.pe-no-routine-thrombolysis",
      "claim.vascular-venous-lymphatic-access.dvt-lysis-selective",
      "claim.vascular-venous-lymphatic-access.dvt-extended-context",
      "claim.vascular-venous-lymphatic-access.therapeutic-rivaroxaban-example"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.thrombosis-canada-2026",
    "title": "Venous Thromboembolism: Duration of Treatment",
    "completeCitation": "Thrombosis Canada. Venous Thromboembolism: Duration of Treatment. Clinical Guide. Version April 9, 2026. 12 pp. Accessed November 11, 2026.",
    "organizationOrJournal": "Thrombosis Canada",
    "authors": [
      "Thrombosis Canada clinical guides committee"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://thrombosiscanada.ca/clinical_guides/pdfs/DURATIONOFANTICOAGULANTTHERAPY_101.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted society factual verification and citation only. No source prose, tables, figures, algorithms or full text stored. No general AI/reproduction licence inferred from public access. Version date read in official PDF. HTML is JavaScript-only. Terms/disclaimer URL attempts unavailable; no affirmative reuse licence or AI permission asserted. No key relies on snippets.",
    "authorityAssessment": "Current specialty clinical guide directly supports three months for major transient-risk VTE after the risk resolves. First weakly provoked/unprovoked extension is preference sensitive; no universal extension key authored.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-proximal-treatment",
      "claim.vascular-venous-lymphatic-access.dvt-three-month-resolved",
      "claim.vascular-venous-lymphatic-access.dvt-heterozygous-fvl-duration"
    ],
    "round2TargetedCheck": {
      "checkedOn": "2026-11-11",
      "newEvidenceClaimIds": [
        "claim.vascular-venous-lymphatic-access.dvt-heterozygous-fvl-duration"
      ],
      "scope": "Targeted factual verification only; original access date retained, no source prose/tables/figures stored."
    }
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.ash-diagnosis-2018",
    "title": "ASH 2018 VTE diagnosis guideline",
    "completeCitation": "Lim W, Le Gal G, Bates SM, Righini M, Haramati LB, Lang E, Kline JA, Chasteen S, Snyder M, Patel P, Bhatt M, Patel P, Braun C, Begum H, Wiercioch W, Schunemann HJ, Mustafa RA. American Society of Hematology 2018 guidelines for management of venous thromboembolism: diagnosis of venous thromboembolism. Blood Adv. 2018;2(22):3226-3256. doi:10.1182/bloodadvances.2018024828.",
    "organizationOrJournal": "American Society of Hematology / Blood Advances",
    "authors": [
      "Wendy Lim",
      "Gregoire Le Gal",
      "Shannon M Bates",
      "Marc Righini",
      "Linda B Haramati",
      "Eddy Lang",
      "Jeffrey A Kline",
      "Sonja Chasteen",
      "Marcia Snyder",
      "Payal Patel",
      "Meha Bhatt",
      "Parth Patel",
      "Cody Braun",
      "Housne Begum",
      "Wojtek Wiercioch",
      "Holger J Schunemann",
      "Reem A Mustafa"
    ],
    "publicationYear": 2018,
    "doi": "10.1182/bloodadvances.2018024828",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6258916/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted society factual verification and citation only. No source prose, tables, figures, algorithms or full text stored. No general AI/reproduction licence inferred from public access. Copyright ASH 2018; no CC grant assumed. PMC Copyright Notice inspected: individual targeted reading, no systematic downloading. Directory routes unavailable; article was read without login or access bypass.",
    "authorityAssessment": "GRADE diagnostic guideline. Pretest probability and acquisition assumptions matter. Search through October 2017; no claim to supersede detailed 2026 PE guidance.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-postoperative-imaging",
      "claim.vascular-venous-lymphatic-access.dvt-acquisition-adequacy",
      "claim.vascular-venous-lymphatic-access.dvt-negative-proximal",
      "claim.vascular-venous-lymphatic-access.dvt-recurrent-comparison",
      "claim.vascular-venous-lymphatic-access.dvt-residual-not-filter",
      "claim.vascular-venous-lymphatic-access.pe-vq-contrast",
      "claim.vascular-venous-lymphatic-access.pe-inadequate-imaging"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.nci-lymphedema-2024",
    "title": "Lymphedema (PDQ) Health Professional Version",
    "completeCitation": "PDQ Supportive and Palliative Care Editorial Board. Lymphedema (PDQ): Health Professional Version. Bethesda, MD: National Cancer Institute. Last summary update December 18, 2024. Accessed November 11, 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "PDQ Supportive and Palliative Care Editorial Board"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/about-cancer/treatment/side-effects/lymphedema/lymphedema-hp-pdq",
    "accessedOn": "2026-11-11",
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI public-domain text conditions; third-party material excluded",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "NCI policy inspected: https://www.cancer.gov/policies/copyright-reuse. Text generally copyright-free with NCI credit; images and branding have separate restrictions. NCI credited; original synthesis only. No source text, images, logos or branded summary reproduced.",
    "authorityAssessment": "Peer-reviewed government synthesis, not a formal management guideline; cancer-related lymphedema scope.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.lymphatic-pattern",
      "claim.vascular-venous-lymphatic-access.lymphatic-new-change",
      "claim.vascular-venous-lymphatic-access.lymphatic-cdt",
      "claim.vascular-venous-lymphatic-access.lymphatic-maintenance",
      "claim.vascular-venous-lymphatic-access.lymphatic-garment",
      "claim.vascular-venous-lymphatic-access.lymphatic-exercise"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.isl-lymphedema-2023",
    "title": "ISL 2023 peripheral lymphedema consensus",
    "completeCitation": "Executive Committee of the International Society of Lymphology. The Diagnosis and Treatment of Peripheral Lymphedema: 2023 Consensus Document of the International Society of Lymphology. Lymphology. 2023;56(4):133-151. PMID:39207406.",
    "organizationOrJournal": "International Society of Lymphology / Lymphology",
    "authors": [
      "Executive Committee of the International Society of Lymphology"
    ],
    "publicationYear": 2023,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://isl.arizona.edu/sites/default/files/2024-11/THE-DIAGNOSIS-AND-TREATMENT-OF-PERIPHERAL-LYMPHEDEMA-2023-CONSENSUS-DOCUMENT-OF-THE-INTERNATIONAL-SOCIETY-OF-LYMPHOLOGY.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted professional-society factual verification only; no source prose, tables, figures, algorithms or full text stored. No general AI/reproduction licence inferred. Official society PDF. No CC licence found; copyright retained. Privacy/policy routes unavailable. Targeted differential, CDT phases, exercise, fit, diuretic and antimicrobial facts, without reproduced algorithms.",
    "authorityAssessment": "International expert consensus, explicitly limited trial evidence. Does not establish a universal garment pressure, antibiotic regimen or lymphatic operation.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.lymphatic-pattern",
      "claim.vascular-venous-lymphatic-access.lymphatic-new-change",
      "claim.vascular-venous-lymphatic-access.lymphatic-cdt",
      "claim.vascular-venous-lymphatic-access.lymphatic-maintenance",
      "claim.vascular-venous-lymphatic-access.lymphatic-garment",
      "claim.vascular-venous-lymphatic-access.lymphatic-exercise",
      "claim.vascular-venous-lymphatic-access.lymphatic-diuretic"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.svs-varicose-2023",
    "title": "SVS/AVF/AVLS varicose veins guideline Part II",
    "completeCitation": "Gloviczki P, Lawrence PF, Wasan SM, Meissner MH, Almeida J, Brown KR, Bush RL, Di Iorio M, Fish J, Fukaya E, Gloviczki ML, Hingorani A, Jayaraj A, Kolluri R, Murad MH, Obi AT, Ozsvath KJ, Singh MJ, Vayuvegula S, Welch HJ. The 2023 Society for Vascular Surgery, American Venous Forum, and American Vein and Lymphatic Society clinical practice guidelines for the management of varicose veins of the lower extremities. Part II. J Vasc Surg Venous Lymphat Disord. 2024;12(1):101670. Published online August 29, 2023. doi:10.1016/j.jvsv.2023.08.011.",
    "organizationOrJournal": "SVS / AVF / AVLS / Journal of Vascular Surgery: Venous and Lymphatic Disorders",
    "authors": [
      "Peter Gloviczki",
      "Peter F Lawrence",
      "Suman M Wasan",
      "Mark H Meissner",
      "Jose Almeida",
      "Kellie R Brown",
      "Ruth L Bush",
      "Michael Di Iorio",
      "John Fish",
      "Eri Fukaya",
      "Monika L Gloviczki",
      "Anil Hingorani",
      "Arjun Jayaraj",
      "Raghu Kolluri",
      "M Hassan Murad",
      "Andrea T Obi",
      "Kathleen J Ozsvath",
      "Michael J Singh",
      "Satish Vayuvegula",
      "Harold J Welch"
    ],
    "publicationYear": 2024,
    "doi": "10.1016/j.jvsv.2023.08.011",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11523430/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted professional-society factual verification only; no source prose, tables, figures, algorithms or full text stored. No general AI/reproduction licence inferred. Article CC BY-NC-ND 4.0 identified; not used as permission to adapt protected expression in a product. SFMV pre-proof supplied targeted sections 1.2, 1.5, 2.1, 9, 11, 12 and 13 after PMC challenges. Final/pre-proof distinction retained. Legal-page attempts unavailable. Public society-copy cross-check: https://ex.sfmv.fr/sites/default/files/docs/2023_svs_avf_avls_varices_membres_inferieurs_part2_jvsvld.pdf",
    "authorityAssessment": "Graded multisociety guidance with separately identified consensus statements. Junction-adjacent SVT has different evidence strength from distant long-segment SVT.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.venous-reflux-protocol",
      "claim.vascular-venous-lymphatic-access.venous-recurrence-mapping",
      "claim.vascular-venous-lymphatic-access.venous-proximal-obstruction",
      "claim.vascular-venous-lymphatic-access.venous-intervention-choice",
      "claim.vascular-venous-lymphatic-access.venous-conservative-choice",
      "claim.vascular-venous-lymphatic-access.venous-tributary-care",
      "claim.vascular-venous-lymphatic-access.svt-distant-long",
      "claim.vascular-venous-lymphatic-access.svt-near-junction",
      "claim.vascular-venous-lymphatic-access.varix-bleeding-care",
      "claim.vascular-venous-lymphatic-access.postablation-symptoms",
      "claim.vascular-venous-lymphatic-access.varix-sclerotherapy-before-ligation",
      "claim.vascular-venous-lymphatic-access.venous-reflux-durations",
      "claim.vascular-venous-lymphatic-access.venous-isolated-junction",
      "claim.vascular-venous-lymphatic-access.venous-recurrent-groin-procedure",
      "claim.vascular-venous-lymphatic-access.venous-recurrent-ssv-procedure",
      "claim.vascular-venous-lymphatic-access.svt-distal-symptom-boundary"
    ],
    "round2TargetedCheck": {
      "checkedOn": "2026-11-11",
      "newEvidenceClaimIds": [
        "claim.vascular-venous-lymphatic-access.venous-reflux-durations",
        "claim.vascular-venous-lymphatic-access.venous-isolated-junction",
        "claim.vascular-venous-lymphatic-access.venous-recurrent-groin-procedure",
        "claim.vascular-venous-lymphatic-access.venous-recurrent-ssv-procedure",
        "claim.vascular-venous-lymphatic-access.svt-distal-symptom-boundary"
      ],
      "scope": "Targeted factual verification only; original access date retained, no source prose/tables/figures stored."
    }
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.ukka-access-2025",
    "title": "UK Kidney Association vascular access guideline",
    "completeCitation": "Aitken E, Anijeet H, Ashby D, Barrow W, Calder F, Dowds B, Fielding C, Gilbert J, Jones R, Karunanithy N, Khawaja Z, Roberts E, Robson M, Shroff R, Stacey H, Thomson P, Waters D. UK Kidney Association Clinical Practice Guideline on vascular access for haemodialysis. BMC Nephrol. 2025;26:461. doi:10.1186/s12882-025-04374-y.",
    "organizationOrJournal": "UK Kidney Association / BMC Nephrology",
    "authors": [
      "Emma Aitken",
      "Hameed Anijeet",
      "Damien Ashby",
      "Wayne Barrow",
      "Francis Calder",
      "Brett Dowds",
      "Catherine Fielding",
      "James Gilbert",
      "Rob Jones",
      "Narayan Karunanithy",
      "Zaib Khawaja",
      "Emma Roberts",
      "Mike Robson",
      "Rukshana Shroff",
      "Hannah Stacey",
      "Peter Thomson",
      "Dan Waters"
    ],
    "publicationYear": 2025,
    "doi": "10.1186/s12882-025-04374-y",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s12882-025-04374-y",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified in publisher Rights and permissions and PMC panel: https://creativecommons.org/licenses/by/4.0/. Crown 2025 and authors credited. Original short factual synthesis and constructed applications change presentation and application; no source text, art or third-party material reproduced.",
    "authorityAssessment": "Current graded access guidance, many low-certainty recommendations. UK pathway context. Separate committee from KDOQI, but underlying evidence overlaps.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.access-maturation",
      "claim.vascular-venous-lymphatic-access.access-deep-basilic",
      "claim.vascular-venous-lymphatic-access.access-clinical-indicators",
      "claim.vascular-venous-lymphatic-access.access-stenosis-action",
      "claim.vascular-venous-lymphatic-access.access-no-prophylactic-angioplasty",
      "claim.vascular-venous-lymphatic-access.access-central-outflow",
      "claim.vascular-venous-lymphatic-access.access-central-conservative",
      "claim.vascular-venous-lymphatic-access.access-ischemia-assessment",
      "claim.vascular-venous-lymphatic-access.access-severe-ischemia",
      "claim.vascular-venous-lymphatic-access.access-aneurysm-skin",
      "claim.vascular-venous-lymphatic-access.access-thrombosis",
      "claim.vascular-venous-lymphatic-access.access-vein-preservation",
      "claim.vascular-venous-lymphatic-access.catheter-site",
      "claim.vascular-venous-lymphatic-access.catheter-thrombolytic-lock",
      "claim.vascular-venous-lymphatic-access.catheter-s-aureus",
      "claim.vascular-venous-lymphatic-access.access-compression-response",
      "claim.vascular-venous-lymphatic-access.access-maturation-timing",
      "claim.vascular-venous-lymphatic-access.access-exam-interpretation",
      "claim.vascular-venous-lymphatic-access.access-primary-angioplasty",
      "claim.vascular-venous-lymphatic-access.access-neuropathic-differential",
      "claim.vascular-venous-lymphatic-access.catheter-persistent-bacteremia-removal"
    ],
    "round2TargetedCheck": {
      "checkedOn": "2026-11-11",
      "newEvidenceClaimIds": [
        "claim.vascular-venous-lymphatic-access.access-maturation-timing",
        "claim.vascular-venous-lymphatic-access.access-exam-interpretation",
        "claim.vascular-venous-lymphatic-access.access-primary-angioplasty",
        "claim.vascular-venous-lymphatic-access.access-neuropathic-differential",
        "claim.vascular-venous-lymphatic-access.catheter-persistent-bacteremia-removal"
      ],
      "scope": "Targeted factual verification only; original access date retained, no source prose/tables/figures stored."
    }
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.kdoqi-access-2019",
    "title": "KDOQI vascular access 2019 update",
    "completeCitation": "Lok CE, Huber TS, Lee T, Shenoy S, Yevzlin AS, Abreo K, Allon M, Asif A, Astor BC, Glickman MH, Graham J, Moist LM, Rajan DK, Roberts C, Vachharajani TJ, Valentini RP; KDOQI Vascular Access Guideline Work Group. KDOQI Clinical Practice Guideline for Vascular Access: 2019 Update. Am J Kidney Dis. 2020;75(4 Suppl 2):S1-S164. doi:10.1053/j.ajkd.2019.12.001.",
    "organizationOrJournal": "National Kidney Foundation / American Journal of Kidney Diseases",
    "authors": [
      "Charmaine E Lok",
      "Thomas S Huber",
      "Timmy Lee",
      "Surendra Shenoy",
      "Alexander S Yevzlin",
      "Kenneth Abreo",
      "Michael Allon",
      "Arif Asif",
      "Brad C Astor",
      "Marc H Glickman",
      "Janet Graham",
      "Louise M Moist",
      "Dheeraj K Rajan",
      "Cynthia Roberts",
      "Tushar J Vachharajani",
      "Rudolph P Valentini"
    ],
    "publicationYear": 2020,
    "doi": "10.1053/j.ajkd.2019.12.001",
    "pmid": null,
    "officialUrl": "https://www.kidney.org/sites/default/files/2026-07/2019-kdoqi-guideline-vascular-access.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted professional-society factual verification only; no source prose, tables, figures, algorithms or full text stored. No general AI/reproduction licence inferred. Official NKF PDF with appended erratum. Statements 13.6-13.9, 15, 17, 18 and 26 targeted. Terms routes unavailable. Copyrighted non-guideline commentary PMC8856770 excluded from evidence because an open licence was not verified.",
    "authorityAssessment": "US specialty guideline: clinical indicators, life-plan, ischemic complications. Some repair recommendations rely on expert opinion and older evidence.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.access-maturation",
      "claim.vascular-venous-lymphatic-access.access-clinical-indicators",
      "claim.vascular-venous-lymphatic-access.access-stenosis-action",
      "claim.vascular-venous-lymphatic-access.access-no-prophylactic-angioplasty",
      "claim.vascular-venous-lymphatic-access.access-central-outflow",
      "claim.vascular-venous-lymphatic-access.access-central-conservative",
      "claim.vascular-venous-lymphatic-access.access-ischemia-assessment",
      "claim.vascular-venous-lymphatic-access.access-severe-ischemia",
      "claim.vascular-venous-lymphatic-access.access-neuropathy",
      "claim.vascular-venous-lymphatic-access.access-neuropathy-urgent",
      "claim.vascular-venous-lymphatic-access.access-aneurysm-skin",
      "claim.vascular-venous-lymphatic-access.access-thrombosis",
      "claim.vascular-venous-lymphatic-access.access-vein-preservation",
      "claim.vascular-venous-lymphatic-access.catheter-site",
      "claim.vascular-venous-lymphatic-access.access-flow-reduction",
      "claim.vascular-venous-lymphatic-access.access-compression-response",
      "claim.vascular-venous-lymphatic-access.access-exam-interpretation",
      "claim.vascular-venous-lymphatic-access.access-primary-angioplasty",
      "claim.vascular-venous-lymphatic-access.access-stent-boundaries",
      "claim.vascular-venous-lymphatic-access.access-emergency-dialysis-before-salvage",
      "claim.vascular-venous-lymphatic-access.catheter-persistent-bacteremia-removal"
    ],
    "round2TargetedCheck": {
      "checkedOn": "2026-11-11",
      "newEvidenceClaimIds": [
        "claim.vascular-venous-lymphatic-access.access-exam-interpretation",
        "claim.vascular-venous-lymphatic-access.access-primary-angioplasty",
        "claim.vascular-venous-lymphatic-access.access-stent-boundaries",
        "claim.vascular-venous-lymphatic-access.access-emergency-dialysis-before-salvage",
        "claim.vascular-venous-lymphatic-access.catheter-persistent-bacteremia-removal"
      ],
      "scope": "Targeted factual verification only; original access date retained, no source prose/tables/figures stored."
    }
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.aha-pad-2024",
    "title": "2024 multisociety PAD guideline: diagnostic physiology",
    "completeCitation": "Gornik HL, Aronow HD, Goodney PP, et al. 2024 ACC/AHA/AACVPR/APMA/ABC/SCAI/SVM/SVN/SVS/SIR/VESS Guideline for the Management of Lower Extremity Peripheral Artery Disease. Circulation. 2024;149:e1313-e1410. doi:10.1161/CIR.0000000000001251.",
    "organizationOrJournal": "AHA / ACC / multisociety PAD writing committee",
    "authors": [
      "Heather L Gornik",
      "Herbert D Aronow",
      "Philip P Goodney",
      "Multisociety PAD writing committee"
    ],
    "publicationYear": 2024,
    "doi": "10.1161/CIR.0000000000001251",
    "pmid": null,
    "officialUrl": "https://professional.heart.org/-/media/PHD-Files-2/Science-News/2/2024/2024-PAD-guideline-slide-set.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted professional-society factual verification only. No source prose, slides, tables, figures, algorithms or full text reproduced. Official slide set read for the underlying diagnostic fact; AHA copyright applies. No numerical compression threshold or pressure strength is inferred.",
    "authorityAssessment": "Current physiology guidance for noncompressible ankle measurements and toe/digital assessment. Arterial revascularization decisions remain in their owning topic.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-perfusion-first",
      "claim.vascular-venous-lymphatic-access.ulcer-noncompressible",
      "claim.vascular-venous-lymphatic-access.ulcer-current-record",
      "claim.vascular-venous-lymphatic-access.arterial-exercise-testing"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vascular-venous-lymphatic-access.evra-nihr-2019",
    "title": "EVRA early versus deferred ablation trial report",
    "completeCitation": "Gohel MS, Heatley F, Liu X, Bradbury A, Bulbulia R, Cullum N, Epstein DM, Nyamekye I, Poskitt KR, Renton S, Warwick J, Davies AH. Early versus deferred endovenous ablation of superficial venous reflux in patients with venous ulceration: the EVRA RCT. Health Technol Assess. 2019;23(24):1-96. doi:10.3310/hta23240.",
    "organizationOrJournal": "NIHR Journals Library / Health Technology Assessment",
    "authors": [
      "Manjit S Gohel",
      "Francine Heatley",
      "Xinxue Liu",
      "Andrew Bradbury",
      "Richard Bulbulia",
      "Nicky Cullum",
      "David M Epstein",
      "Isaac Nyamekye",
      "Keith R Poskitt",
      "Sophie Renton",
      "Jane Warwick",
      "Alun H Davies"
    ],
    "publicationYear": 2019,
    "doi": "10.3310/hta23240",
    "pmid": null,
    "officialUrl": "https://www.journalslibrary.nihr.ac.uk/hta/HTA23240",
    "accessedOn": "2026-11-11",
    "sourceClass": "randomized_trial",
    "licenseLabel": "Copyright retained; targeted factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article Permissions checked: Crown 2019 commissioning terms allow private research/study and specified journal reproduction; commercial reproduction requires permission. Targeted factual verification and original synthesis only, without source expression or third-party NEJM figures. No general open/AI licence asserted.",
    "authorityAssessment": "Primary randomized evidence for early superficial reflux ablation plus compression in eligible active ulcers. Other EVRA publications describe the same trial, not independent corroboration.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-perfusion-first",
      "claim.vascular-venous-lymphatic-access.ulcer-compression",
      "claim.vascular-venous-lymphatic-access.ulcer-current-record",
      "claim.vascular-venous-lymphatic-access.ulcer-early-ablation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vlu.esvs-cvd.2022",
    "title": "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs",
    "completeCitation": "De Maeseneer MG, Kakkos SK, Aherne T, Baekgaard N, Black S, Blomgren L, Giannoukas A, Gohel M, de Graaf R, Hamel-Desnos C, Jawien A, Jaworucka-Kaczorowska A, Lattimer CR, Mosti G, Noppeney T, van Rijn MJ, Stansby G; ESVS Guidelines Committee and Document Reviewers. Editor's Choice: European Society for Vascular Surgery (ESVS) 2022 Clinical Practice Guidelines on the Management of Chronic Venous Disease of the Lower Limbs. Eur J Vasc Endovasc Surg. 2022;63(2):184-267. doi:10.1016/j.ejvs.2021.12.024.",
    "organizationOrJournal": "European Society for Vascular Surgery / European Journal of Vascular and Endovascular Surgery",
    "authors": [
      "Marianne G De Maeseneer",
      "Stavros K Kakkos",
      "Thomas Aherne",
      "Niels Baekgaard",
      "Stephen Black",
      "Lena Blomgren",
      "Athanasios Giannoukas",
      "Manjit Gohel",
      "Rick de Graaf",
      "Claudine Hamel-Desnos",
      "Arkadiusz Jawien",
      "Aleksandra Jaworucka-Kaczorowska",
      "Christopher R Lattimer",
      "Giovanni Mosti",
      "Thomas Noppeney",
      "Marie Josee van Rijn",
      "Gerry Stansby",
      "ESVS Guidelines Committee and Document Reviewers"
    ],
    "publicationYear": 2022,
    "doi": "10.1016/j.ejvs.2021.12.024",
    "pmid": "35027279",
    "officialUrl": "https://esvs.org/guideline/chronic-venous-disease-of-lower-limbs/",
    "accessedOn": "2026-09-13",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guideline; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Stable existing source ID and original access date retained from development-batch/2026-09-13/venous-leg-ulcer.ts. Fresh targeted check on 2026-11-11 through the French Society of Phlebology PDF https://www.sf-phlebologie.org/wp-content/uploads/2022/04/ESVS-2022-CVD-guidelines.pdf, recommendations 69-77 and section 6.3.3. Copyright retained; no source prose, tables, figures or algorithms reproduced. No reusable AI licence inferred from public society access.",
    "authorityAssessment": "Graded vascular guideline. High-level support for venous-ulcer compression, lower-level consensus for severe ischemia/mixed compression. EVRA is the underlying trial also separately cited; guideline and trial are not independent trials.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-perfusion-first",
      "claim.vascular-venous-lymphatic-access.ulcer-compression",
      "claim.vascular-venous-lymphatic-access.ulcer-current-record",
      "claim.vascular-venous-lymphatic-access.ulcer-early-ablation",
      "claim.vascular-venous-lymphatic-access.ulcer-standard-pressure",
      "claim.vascular-venous-lymphatic-access.ulcer-severe-ischemia",
      "claim.vascular-venous-lymphatic-access.ulcer-modified-compression"
    ],
    "originalLedger": "packages/clinical-content/src/development-batch/2026-09-13/venous-leg-ulcer.ts",
    "targetedCheckDate": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esophagus-motility-achalasia.acg-achalasia-2020",
    "title": "ACG Clinical Guidelines: Diagnosis and Management of Achalasia",
    "completeCitation": "Vaezi MF, Pandolfino JE, Yadlapati RH, Greer KB, Kavitt RT. ACG Clinical Guidelines: Diagnosis and Management of Achalasia. Am J Gastroenterol. 2020;115(9):1393-1411. doi:10.14309/ajg.0000000000000731.",
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "authors": [
      "Vaezi MF",
      "Pandolfino JE",
      "Yadlapati RH",
      "Greer KB",
      "Kavitt RT"
    ],
    "publicationYear": 2020,
    "doi": "10.14309/ajg.0000000000000731",
    "pmid": "32773454",
    "officialUrl": "https://gi.org/guideline/diagnosis-and-management-of-achalasia/",
    "verifiedUrl": "https://www.spg.pt/wp-content/uploads/2023/03/ACG-Clinical-Guidelines-Diagnosis-and-Management-of-Achalasia.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained by the society or publisher. Reproduction license unestablished.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of underlying facts. Repository outputs contain original synthesis, bibliographic metadata and external links.",
    "authorityAssessment": "Primary adult guideline. Treatment, diagnostic and failure sections directly checked. Newer SAGES guidance cross-checks procedure comparisons.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.esophagus-motility-achalasia.failed-manometry-flip",
      "claim.esophagus-motility-achalasia.secondary-junction-assessment",
      "claim.esophagus-motility-achalasia.type-three-poem",
      "claim.esophagus-motility-achalasia.type-three-length",
      "claim.esophagus-motility-achalasia.type-one-two-options",
      "claim.esophagus-motility-achalasia.myotomy-partial-wrap",
      "claim.esophagus-motility-achalasia.botulinum-unfit",
      "claim.esophagus-motility-achalasia.dilation-rescue-risk",
      "claim.esophagus-motility-achalasia.post-treatment-tbe",
      "claim.esophagus-motility-achalasia.recurrence-mechanisms",
      "claim.esophagus-motility-achalasia.objective-postpoem-reflux",
      "claim.esophagus-motility-achalasia.confirmed-reflux-treatment",
      "claim.esophagus-motility-achalasia.salvage-heller",
      "claim.esophagus-motility-achalasia.end-stage-referral",
      "claim.esophagus-motility-achalasia.myotomy-limit",
      "claim.esophagus-motility-achalasia.posttherapy-endoscopic-targets",
      "claim.esophagus-motility-achalasia.eus-wall-target"
    ],
    "accessAndTermsAssessment": {
      "checkedOn": "2026-11-11",
      "retrieval": "Public journal or society-hosted guideline.",
      "observedTerms": "Society/publisher copyright retained.",
      "aiAccessFinding": "No express automated/AI-use prohibition identified on the accessed society-hosted page or document. Assessment is limited to this retrieval route.",
      "storedMaterial": "Bibliographic metadata, links and original atomic claims."
    }
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esophagus-motility-achalasia.seoul-achalasia-2020",
    "title": "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
    "completeCitation": "Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. J Neurogastroenterol Motil. 2020;26(2):180-203. doi:10.5056/jnm20014.",
    "organizationOrJournal": "Korean Society of Neurogastroenterology and Motility / Journal of Neurogastroenterology and Motility",
    "authors": [
      "Jung HK",
      "Hong SJ",
      "Lee OY",
      "Pandolfino J",
      "Park H",
      "Miwa H",
      "Ghoshal UC",
      "Mahadeva S",
      "et al."
    ],
    "publicationYear": 2020,
    "doi": "10.5056/jnm20014",
    "pmid": "32235027",
    "officialUrl": "https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014",
    "verifiedUrl": "https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Underlying facts synthesized with attribution under https://creativecommons.org/licenses/by-nc/4.0/. Source article remains external.",
    "authorityAssessment": "Independent guideline cross-check for botulinum toxin, partial fundoplication, salvage and end-stage referral. Predates SAGES update. Linked corrigendum retrieval failed.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.esophagus-motility-achalasia.barium-clearance",
      "claim.esophagus-motility-achalasia.secondary-junction-assessment",
      "claim.esophagus-motility-achalasia.type-three-length",
      "claim.esophagus-motility-achalasia.myotomy-partial-wrap",
      "claim.esophagus-motility-achalasia.complete-wrap-dysphagia",
      "claim.esophagus-motility-achalasia.botulinum-unfit",
      "claim.esophagus-motility-achalasia.post-treatment-tbe",
      "claim.esophagus-motility-achalasia.salvage-heller",
      "claim.esophagus-motility-achalasia.end-stage-referral",
      "claim.esophagus-motility-achalasia.myotomy-limit"
    ],
    "accessAndTermsAssessment": {
      "checkedOn": "2026-11-11",
      "retrieval": "Public journal or society-hosted guideline.",
      "observedTerms": "Article displays CC BY-NC 4.0.",
      "aiAccessFinding": "No express automated/AI-use prohibition identified on the accessed society-hosted page or document. Assessment is limited to this retrieval route.",
      "storedMaterial": "Bibliographic metadata, links and original atomic claims."
    }
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esophagus-motility-achalasia.acg-physiology-2020",
    "title": "ACG Clinical Guidelines: Clinical Use of Esophageal Physiologic Testing",
    "completeCitation": "Gyawali CP, Carlson DA, Chen JW, Patel A, Wong RJ, Yadlapati RH. ACG Clinical Guidelines: Clinical Use of Esophageal Physiologic Testing. Am J Gastroenterol. 2020;115(9):1412-1428. doi:10.14309/ajg.0000000000000734.",
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "authors": [
      "Gyawali CP",
      "Carlson DA",
      "Chen JW",
      "Patel A",
      "Wong RJ",
      "Yadlapati RH"
    ],
    "publicationYear": 2020,
    "doi": "10.14309/ajg.0000000000000734",
    "pmid": "32769426",
    "officialUrl": "https://doi.org/10.14309/ajg.0000000000000734",
    "verifiedUrl": "https://www.spg.pt/wp-content/uploads/2023/03/ACG-Clinical-Guidelines-Clinical-Use-of-Esophageal-Physiologic-Testing-1.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained by the society or publisher. Reproduction license unestablished.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of underlying facts. Repository outputs contain original synthesis, bibliographic metadata and external links.",
    "authorityAssessment": "Primary physiology guidance. Targeted checks cover failed assisted placement, FLIP, clearance and test purposes.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.esophagus-motility-achalasia.egjoo-corroboration",
      "claim.esophagus-motility-achalasia.borderline-aperistalsis",
      "claim.esophagus-motility-achalasia.failed-manometry-flip",
      "claim.esophagus-motility-achalasia.barium-clearance",
      "claim.esophagus-motility-achalasia.tablet-obstruction",
      "claim.esophagus-motility-achalasia.hrm-acquisition",
      "claim.esophagus-motility-achalasia.provocation-purpose",
      "claim.esophagus-motility-achalasia.reflux-testing-purpose"
    ],
    "accessAndTermsAssessment": {
      "checkedOn": "2026-11-11",
      "retrieval": "Public journal or society-hosted guideline.",
      "observedTerms": "Society/publisher copyright retained.",
      "aiAccessFinding": "No express automated/AI-use prohibition identified on the accessed society-hosted page or document. Assessment is limited to this retrieval route.",
      "storedMaterial": "Bibliographic metadata, links and original atomic claims."
    }
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esophagus-motility-achalasia.chicago-v4-2021",
    "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
    "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058.",
    "organizationOrJournal": "International High-Resolution Manometry Working Group / Neurogastroenterology and Motility",
    "authors": [
      "Yadlapati R",
      "Kahrilas PJ",
      "Fox MR",
      "Bredenoord AJ",
      "Gyawali CP",
      "Roman S",
      "et al."
    ],
    "publicationYear": 2021,
    "doi": "10.1111/nmo.14058",
    "pmid": "33373111",
    "officialUrl": "https://doi.org/10.1111/nmo.14058",
    "verifiedUrl": "https://www.spg.pt/wp-content/uploads/2023/03/Esophageal-motility-disorders-on-high-resolution-manometry-Chicago-classification-version-4.0.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained by the society or publisher. Reproduction license unestablished.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of underlying facts. Repository outputs contain original synthesis, bibliographic metadata and external links.",
    "authorityAssessment": "Primary international consensus from a working group selected by six motility societies. Classification, inconclusive findings and opioids directly checked. Online copyright 2020, journal issue 2021.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.esophagus-motility-achalasia.spastic-achalasia-pattern",
      "claim.esophagus-motility-achalasia.opioid-reassessment",
      "claim.esophagus-motility-achalasia.egjoo-corroboration",
      "claim.esophagus-motility-achalasia.borderline-aperistalsis",
      "claim.esophagus-motility-achalasia.hrm-acquisition",
      "claim.esophagus-motility-achalasia.provocation-purpose"
    ],
    "accessAndTermsAssessment": {
      "checkedOn": "2026-11-11",
      "retrieval": "Public journal or society-hosted guideline.",
      "observedTerms": "Society/publisher copyright retained.",
      "aiAccessFinding": "No express automated/AI-use prohibition identified on the accessed society-hosted page or document. Assessment is limited to this retrieval route.",
      "storedMaterial": "Bibliographic metadata, links and original atomic claims."
    }
  },
  {
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esophagus-motility-achalasia.sages-poem-update-2025",
    "title": "2024 Update to SAGES Guidelines for the Use of Peroral Endoscopic Myotomy (POEM) in the Treatment of Achalasia",
    "completeCitation": "Calabrese EC, Kindel T, Slater BJ, Marks J, Swanstrom L, Saxena P, Docimo S, Athanasiadis DI, Hanna NM, Stefanidis D, Rooker C, Maddern G, Kohn GP. 2024 Update to SAGES Guidelines for the Use of Peroral Endoscopic Myotomy (POEM) in the Treatment of Achalasia. SAGES guideline publication, May 2025.",
    "organizationOrJournal": "Society of American Gastrointestinal and Endoscopic Surgeons",
    "authors": [
      "Calabrese EC",
      "Kindel T",
      "Slater BJ",
      "Marks J",
      "Swanstrom L",
      "Saxena P",
      "Docimo S",
      "Athanasiadis DI",
      "Hanna NM",
      "Stefanidis D",
      "Rooker C",
      "Maddern G",
      "Kohn GP"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.sages.org/publications/guidelines/update-to-guidelines-for-the-use-of-poem-for-achalasia/",
    "verifiedUrl": "https://www.sages.org/publications/guidelines/update-to-guidelines-for-the-use-of-poem-for-achalasia/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained by the society or publisher. Reproduction license unestablished.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of underlying facts. Repository outputs contain original synthesis, bibliographic metadata and external links.",
    "authorityAssessment": "Current retrieved SAGES update. Type III preference is expert opinion. Type I/II comparisons are conditional. Title carries 2024 and archive lists May 2025.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.esophagus-motility-achalasia.type-three-poem",
      "claim.esophagus-motility-achalasia.type-one-two-options",
      "claim.esophagus-motility-achalasia.objective-postpoem-reflux",
      "claim.esophagus-motility-achalasia.confirmed-reflux-treatment"
    ],
    "accessAndTermsAssessment": {
      "checkedOn": "2026-11-11",
      "retrieval": "Public journal or society-hosted guideline.",
      "observedTerms": "Copyright retained and reposting the document prohibited.",
      "aiAccessFinding": "No express automated/AI-use prohibition identified on the accessed society-hosted page or document. Assessment is limited to this retrieval route.",
      "storedMaterial": "Bibliographic metadata, links and original atomic claims."
    }
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bariatric-metabolic.sfe-2024",
    "title": "Society for Endocrinology guidelines for the diagnosis and management of post-bariatric hypoglycaemia",
    "completeCitation": "Hazlehurst J, Khoo B, Brito Lobato C, Ilesanmi I, Abbott S, Chan T, Pillai S, Maslin K, Purkayastha S, McGowan B, Andrews R, Tan TMM. Society for Endocrinology guidelines for the diagnosis and management of post-bariatric hypoglycaemia. Endocrine Connections. 2024;13(5):e230285. doi:10.1530/EC-23-0285.",
    "organizationOrJournal": "Society for Endocrinology / Endocrine Connections",
    "authors": [
      "Hazlehurst J",
      "Khoo B",
      "Brito Lobato C",
      "Ilesanmi I",
      "Abbott S",
      "Chan T",
      "Pillai S",
      "Maslin K",
      "Purkayastha S",
      "McGowan B",
      "Andrews R",
      "Tan TMM"
    ],
    "publicationYear": 2024,
    "doi": "10.1530/EC-23-0285",
    "pmid": null,
    "officialUrl": "https://discovery.ucl.ac.uk/id/eprint/10190207/1/ECC230285.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0 (UCL published version and landing-page rights)",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "PMC returned a browser challenge; used the published CC BY 4.0 version in the authors' institutional repository. Attribution and https://creativecommons.org/licenses/by/4.0/ retained. No article text stored.",
    "authorityAssessment": "Specialist guideline; diagnostic and drug recommendations generally moderate certainty. Single directly read current guideline for drug sequencing.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.bariatric-metabolic.pbh-confirm",
      "claim.bariatric-metabolic.pbh-cgm",
      "claim.bariatric-metabolic.pbh-no-provocation",
      "claim.bariatric-metabolic.pbh-diet",
      "claim.bariatric-metabolic.pbh-acarbose",
      "claim.bariatric-metabolic.pbh-second-line",
      "claim.bariatric-metabolic.pbh-rescue",
      "claim.bariatric-metabolic.pbh-diazoxide",
      "claim.bariatric-metabolic.pbh-cgm-management",
      "claim.bariatric-metabolic.acarbose-substrate",
      "claim.bariatric-metabolic.pbh-protein-target",
      "claim.bariatric-metabolic.pbh-acarbose-gi-effects",
      "claim.bariatric-metabolic.pbh-severe-glucagon"
    ]
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bariatric-metabolic.labmed-hypoglycemia-summary-2019",
    "title": "Summary of Endocrinology Society Guidelines: Evaluation and management of adult hypoglycaemic disorders",
    "completeCitation": "Burns A; reviewed by McNeilly J. Summary of Endocrinology Society Guidelines: Evaluation and management of adult hypoglycaemic disorders. Association for Clinical Biochemistry and Laboratory Medicine (now Association for Laboratory Medicine). Reviewed February 2019. Summarizes Cryer PE et al., J Clin Endocrinol Metab. 2009;94(3):709-728.",
    "organizationOrJournal": "Association for Laboratory Medicine",
    "authors": [
      "Burns A",
      "McNeilly J"
    ],
    "publicationYear": 2019,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://labmed.org.uk/static/a8c7f434-10d3-44c9-ab28555dc6f8acfb/evaluation-and-management-of-adult-hypoglycaemic-disorders.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Professional-association guideline summary; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Professional-association guidance read for a targeted factual cross-check; no table, assay cutoff or protocol copied. Original 2009 publisher full text was inaccessible and is not represented as read. Older mixed-meal recommendations do not supersede 2024 PBH guidance.",
    "authorityAssessment": "Older professional guideline summary supports the existence and clinical role of supervised fasting evaluation as a competing investigation; current PBH key remains governed by the directly read 2024 SfE guideline.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.bariatric-metabolic.hypoglycemia-sampling-context"
    ]
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bariatric-metabolic.acg-gerd-2022",
    "title": "ACG Clinical Guideline: Guidelines for the Diagnosis and Management of Gastroesophageal Reflux Disease",
    "completeCitation": "Katz PO, Dunbar KB, Schnoll-Sussman FH, Greer KB, Yadlapati R, Spechler SJ. ACG Clinical Guideline: Guidelines for the Diagnosis and Management of Gastroesophageal Reflux Disease. American Journal of Gastroenterology. 2022;117(1):27-56. doi:10.14309/ajg.0000000000001538.",
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "authors": [
      "Katz PO",
      "Dunbar KB",
      "Schnoll-Sussman FH",
      "Greer KB",
      "Yadlapati R",
      "Spechler SJ"
    ],
    "publicationYear": 2022,
    "doi": "10.14309/ajg.0000000000001538",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8754510/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guideline; no reusable-expression license asserted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying-fact verification of the society guideline. PMC availability is not treated as a reuse grant. No guideline prose, tables, figures, algorithms or excerpts retained; no publisher-site corpus ingested.",
    "authorityAssessment": "Society guideline directly supports verifying PPI administration and choosing reflux-monitoring protocol according to established diagnosis and current therapy.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.bariatric-metabolic.ppi-meal-timing",
      "claim.bariatric-metabolic.ppi-before-escalation",
      "claim.bariatric-metabolic.gerd-established-on-therapy-testing",
      "claim.bariatric-metabolic.gerd-unproven-off-therapy-testing",
      "claim.bariatric-metabolic.gerd-impedance-scope"
    ]
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bariatric-metabolic.sages-comorbidities-2024",
    "title": "SAGES guidelines for the management of comorbidities relevant to metabolic and bariatric surgery",
    "completeCitation": "Kumar SS, Wunker C, Collings A, Bansal V, Zoumpou T, et al. SAGES guidelines for the management of comorbidities relevant to metabolic and bariatric surgery. Surgical Endoscopy. 2025;39:1-10. Published online December 12, 2024. doi:10.1007/s00464-024-11433-2.",
    "organizationOrJournal": "SAGES / Surgical Endoscopy",
    "authors": [
      "Kumar SS",
      "Wunker C",
      "Collings A",
      "Bansal V",
      "Zoumpou T",
      "et al."
    ],
    "publicationYear": 2025,
    "doi": "10.1007/s00464-024-11433-2",
    "pmid": null,
    "officialUrl": "https://www.sages.org/publications/guidelines/guidelines-for-the-management-of-comorbidities-relevant-to-bariatric-surgery/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Society web guidance; reuse license not asserted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Society-hosted guidance used for targeted factual verification, not expression reuse. No automated-use prohibition found on retrieved guidance. Correction 10.1007/s00464-025-11537-3 checked: author-name presentation only.",
    "authorityAssessment": "Post-sleeve GERD recommendations based on expert opinion; IBD procedure preference conditional with very low certainty.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.bariatric-metabolic.reflux-initial",
      "claim.bariatric-metabolic.reflux-conversion",
      "claim.bariatric-metabolic.ibd-procedure",
      "claim.bariatric-metabolic.reflux-msa-boundary",
      "claim.bariatric-metabolic.ppi-before-escalation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
    "title": "A UK evidence based guideline for the acute management of paediatric intussusception",
    "completeCitation": "BSPR Intussusception Working Group. A UK evidence based guideline for the acute management of paediatric intussusception. Final-draft document dated 18 August 2017; public BSPR copy posted under 2024/01.",
    "organizationOrJournal": "British Society of Paediatric Radiology",
    "authors": [
      "BSPR Intussusception Working Group"
    ],
    "publicationYear": 2017,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.bspr.co.uk/wp-content/uploads/2024/01/2017.08.18-Intussusception-Guideline-Final-Draft.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
    "authorityAssessment": "Professional radiology/surgery working-group guidance. The filename says final draft and the document is older; grade C/D repeat-enema advice is not presented as a high-certainty universal requirement.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.intussusception-risk",
      "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
      "claim.pediatric-gi-abdominal-wall.intussusception-operation"
    ],
    "accessMethod": "public_primary_document_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsUrl": null,
    "accessAndRightsFinding": "Public official society PDF checked. Privacy-policy route unavailable; no express AI prohibition in document. No algorithm copied; current society review provides a separate cross-check."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-gi-abdominal-wall.kps-intussusception-2023",
    "title": "Current diagnosis and image-guided reduction for intussusception in children",
    "completeCitation": "Hwang J, Yoon HM, Kim PH, Jung AY, Lee JS, Cho YA. Current diagnosis and image-guided reduction for intussusception in children. Clin Exp Pediatr. 2023;66(1):12-21. Published online 4 July 2022. doi:10.3345/cep.2021.01816.",
    "organizationOrJournal": "Clinical and Experimental Pediatrics / Korean Pediatric Society",
    "authors": [
      "Jisun Hwang",
      "Hee Mang Yoon",
      "Pyeong Hwa Kim",
      "Ah Young Jung",
      "Jin Seong Lee",
      "Young Ah Cho"
    ],
    "publicationYear": 2023,
    "doi": "10.3345/cep.2021.01816",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9815940/",
    "accessedOn": "2026-11-11",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC 4.0; limited factual verification",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
    "authorityAssessment": "Specialty-society narrative review, not a new formal guideline. Used for narrow clinical cross-checks of partial reduction, recurrence, lead points and operative boundary.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.intussusception-risk",
      "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
      "claim.pediatric-gi-abdominal-wall.intussusception-operation",
      "claim.pediatric-gi-abdominal-wall.intussusception-transient"
    ],
    "accessMethod": "public_primary_document_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsUrl": null,
    "accessAndRightsFinding": "Article-level CC BY-NC 4.0 explicitly checked. No source expression adapted or licensed content incorporated into a commercial asset; only underlying clinical facts independently synthesized. Do not infer commercial rights to the article or figures."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-gi-abdominal-wall.ernica-nec-2025",
    "title": "ERNICA Evidence-Based Guideline on Surgical Aspects of Necrotizing Enterocolitis in Premature Neonates",
    "completeCitation": "Hulscher J, Irvine W, Conforti A, et al. European Reference Network for Inherited and Congenital Anomalies Evidence-Based Guideline on Surgical Aspects of Necrotizing Enterocolitis in Premature Neonates. Neonatology. 2025;122(3):376-384. doi:10.1159/000542540. Online 19 November 2024.",
    "organizationOrJournal": "Neonatology / ERNICA",
    "authors": [
      "Jan Hulscher",
      "Willemijn Irvine",
      "Andrea Conforti",
      "et al."
    ],
    "publicationYear": 2025,
    "doi": "10.1159/000542540",
    "pmid": null,
    "officialUrl": "https://pure.eur.nl/ws/files/226057027/European_Reference_Network_for_Inherited_and_Congenital_Anomalies_Evidence-Based_Guideline_on_Surgical_Aspects_of_Necrotizing_Enterocolitis_in_Premature_Neonates.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
    "authorityAssessment": "Current GRADE guidance with mostly very-low certainty. Does not establish universal laparotomy superiority over drainage or a single laboratory threshold for surgery.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
      "claim.pediatric-gi-abdominal-wall.nec-drain",
      "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
    ],
    "accessMethod": "public_primary_document_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsUrl": null,
    "accessAndRightsFinding": "Article and institutional cover explicitly identify CC BY; used the university-hosted publisher version after PMC returned a browser check. No bypass of authentication or challenge attempted."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-gi-abdominal-wall.donos-meconium-2024",
    "title": "Diagnosis and Management of Simple and Complicated Meconium Ileus in Cystic Fibrosis, a Systematic Review",
    "completeCitation": "Donos MA, Ghiga G, Trandafir LM, et al. Diagnosis and Management of Simple and Complicated Meconium Ileus in Cystic Fibrosis, a Systematic Review. Diagnostics (Basel). 2024;14(11):1179. doi:10.3390/diagnostics14111179.",
    "organizationOrJournal": "Diagnostics (Basel)",
    "authors": [
      "Madalina Andreea Donos",
      "Gabriela Ghiga",
      "Laura Mihaela Trandafir",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.3390/diagnostics14111179",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11171516/",
    "accessedOn": "2026-11-11",
    "sourceClass": "systematic_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
    "authorityAssessment": "Recent systematic review; heterogeneous small observational studies and nonstandard treatment. One adequate directly read publication for the authored treatment boundary. Do not adopt its exact fluid volumes, enema concentrations or attempt counts.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
      "claim.pediatric-gi-abdominal-wall.meconium-enema",
      "claim.pediatric-gi-abdominal-wall.meconium-complicated",
      "claim.pediatric-gi-abdominal-wall.meconium-repeat"
    ],
    "accessMethod": "public_primary_document_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsUrl": null,
    "accessAndRightsFinding": "Article-level license and public document checked; no protected expression retained."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-gi-abdominal-wall.nci-wilms-2025",
    "title": "Wilms Tumor and Other Childhood Kidney Tumors Treatment (PDQ) - Health Professional Version",
    "completeCitation": "PDQ Pediatric Treatment Editorial Board. Wilms Tumor and Other Childhood Kidney Tumors Treatment (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Updated 15 April 2025. Accessed 11 November 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "PDQ Pediatric Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/kidney/hp/wilms-treatment-pdq",
    "accessedOn": "2026-11-11",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government publication; conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
    "authorityAssessment": "Peer-reviewed government evidence summary, expressly not a policy statement/formal guideline. COG/North American pathway must be stated; SIOP preoperative chemotherapy is a valid different framework. One primary summary checked for surgical facts.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy",
      "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
      "claim.pediatric-gi-abdominal-wall.wilms-nodes",
      "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
      "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
      "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
      "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
    ],
    "accessMethod": "public_primary_document_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsUrl": "https://www.cancer.gov/policies/copyright-reuse",
    "accessAndRightsFinding": "NCI reuse policy and PDQ permission section checked. Credit NCI; no endorsement implied. Third-party images/tables excluded; this packet is original content, not an NCI PDQ summary."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025",
    "title": "Meta-Analysis to Determine Optimal Timing for Repair of Inguinal Hernia in Pre-Term Infants",
    "completeCitation": "Hashmi TM, Ashraf H, Fatima T, et al. Meta-Analysis to Determine Optimal Timing for Repair of Inguinal Hernia in Pre-Term Infants. World J Surg. 2025;49(9):2540-2548. doi:10.1002/wjs.70014. Published online 25 July 2025.",
    "organizationOrJournal": "World Journal of Surgery",
    "authors": [
      "Tallal Mushtaq Hashmi",
      "Hadiah Ashraf",
      "Tehreem Fatima",
      "Amna Javed",
      "Abdullah",
      "Muhammad Abdullah Kashif",
      "Soban Raza",
      "Khawaja Haris Ismail",
      "Arooj Fatima",
      "Javed Iqbal",
      "Raheel Ahmed",
      "Areeba Ahsan",
      "Mushood Ahmed"
    ],
    "publicationYear": 2025,
    "doi": "10.1002/wjs.70014",
    "pmid": null,
    "officialUrl": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/wjs.70014",
    "accessedOn": "2026-11-11",
    "sourceClass": "systematic_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
    "authorityAssessment": "Recent synthesis includes one RCT and predominantly retrospective cohorts. Respiratory versus incarceration tradeoff is real; this does not justify one compulsory repair age. Different syntheses disagree on the incarceration estimate.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
    ],
    "accessMethod": "public_primary_document_targeted_read",
    "rightsCheckedOn": "2026-11-11",
    "termsUrl": null,
    "accessAndRightsFinding": "Official full PDF and explicit Creative Commons Attribution license statement verified, not inferred from PMC or a search snippet. No exact effect size or trial-specific age threshold is taught."
  }
];
export const PROGRAM_BATCH5_ORDERS = [
  {
    "caseId": "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "choiceId": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.arm-venous-duplex.v2",
    "choiceLabel": "Left-arm deep-venous duplex ultrasound",
    "timingProfileId": "timing.test.venous_duplex",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "choiceId": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.lymphoscintigraphy.v2",
    "choiceLabel": "Left-arm radionuclide lymphoscintigraphy",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "choiceId": "choice.vascular-venous-lymphatic-access.lymphatic-acute-change.central-venography.v2",
    "choiceLabel": "Chest CT venography",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "choiceId": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.iliac-venography.v1",
    "choiceLabel": "Iliac and pelvic CT venography",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "choiceId": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.repeat-proximal.v1",
    "choiceLabel": "Repeat femoral and popliteal compression duplex",
    "timingProfileId": "timing.test.venous_duplex",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "choiceId": "choice.vascular-venous-lymphatic-access.varicose-proximal-territory.lymphatic-scan.v1",
    "choiceLabel": "Lower-limb radionuclide lymphoscintigraphy",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "choiceId": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.toe-waveforms.v1",
    "choiceLabel": "Left toe pressure and digital waveform testing",
    "timingProfileId": "timing.test.vascular_physiology",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "choiceId": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.exercise-ankle.v1",
    "choiceLabel": "Left exercise ankle-pressure testing",
    "timingProfileId": "timing.test.vascular_physiology",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "choiceId": "choice.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.arterial-cta.v1",
    "choiceLabel": "Left-leg CT angiography",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "choiceId": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.serial-proximal.v2",
    "choiceLabel": "Arrange serial proximal compression ultrasound",
    "timingProfileId": "timing.test.venous_duplex",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "choiceId": "choice.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.iliocaval-imaging.v2",
    "choiceLabel": "Arrange iliocaval CT venography",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "choiceId": "choice.vascular-venous-lymphatic-access.access-hand-physiology.compression-perfusion.v2",
    "choiceLabel": "Digital pressures and waveforms during access-compression testing",
    "timingProfileId": "timing.test.vascular_physiology",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "choiceId": "choice.vascular-venous-lymphatic-access.access-hand-physiology.repeat-median-study.v2",
    "choiceLabel": "Repeat nerve-conduction testing across the wrist",
    "timingProfileId": "timing.test.general_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "choiceId": "choice.vascular-venous-lymphatic-access.access-hand-physiology.cervical-mri.v2",
    "choiceLabel": "Cervical-spine magnetic resonance imaging",
    "timingProfileId": "timing.test.mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2",
    "nodeId": "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "choiceId": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.endoscopy",
    "choiceLabel": "Upper endoscopy with esophageal and junction inspection",
    "timingProfileId": "timing.test.upper_endoscopy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2",
    "nodeId": "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "choiceId": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.barium",
    "choiceLabel": "Upright timed barium esophagography with tablet passage",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2",
    "nodeId": "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "choiceId": "choice.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.ph",
    "choiceLabel": "Ambulatory esophageal pH-impedance reflux monitoring",
    "timingProfileId": "timing.test.ambulatory_reflux_monitoring",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "choiceId": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.fast",
    "choiceLabel": "Supervised fasting evaluation with venous biochemical sampling",
    "timingProfileId": "timing.test.metabolic_workup",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "choiceId": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.spontaneous",
    "choiceLabel": "Venous biochemical sampling during a typical spontaneous spell",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "choiceId": "choice.topic.bariatric-metabolic.spontaneous-sample-before-label.v2.ogtt",
    "choiceLabel": "Oral glucose tolerance testing with venous biochemical sampling",
    "timingProfileId": "timing.test.metabolic_workup",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "choiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-off",
    "choiceLabel": "Ambulatory pH-only monitoring after PPI withdrawal",
    "timingProfileId": "timing.test.ambulatory_reflux_monitoring",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "choiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-off",
    "choiceLabel": "Ambulatory impedance-pH monitoring after PPI withdrawal",
    "timingProfileId": "timing.test.ambulatory_reflux_monitoring",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "choiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.ph-on",
    "choiceLabel": "Ambulatory pH-only monitoring during PPI treatment",
    "timingProfileId": "timing.test.ambulatory_reflux_monitoring",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "choiceId": "choice.topic.bariatric-metabolic.refractory-reflux-revision.v2.impedance-on",
    "choiceLabel": "Ambulatory impedance-pH monitoring during PPI treatment",
    "timingProfileId": "timing.test.ambulatory_reflux_monitoring",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const PROGRAM_BATCH5_FROZEN = [
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v2",
    "rawCaseSha256": "854d6951df25008675af5987d4a86e8fe57d855c4f2a53b76b8d71e4dbb5450b",
    "retainedCaseSha256": "cc890c009da774858ad2dafbd36bd91235a265db7b386c1564ac235f2d6e0c3b",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
        "questionVariantId": "question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
        "conceptId": "concept.n2.vte-prophylaxis-to-treatment",
        "nodeSha256": "d6ce2e4f28d882057f1cbdb29fcb1ea18210078e26f37c9757105051f577d9fb",
        "questionSha256": "aed332ee074e9db439fa212962c4362fc708a6e4e65f2dd754b3bbcecd57e2ba",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2",
    "rawCaseSha256": "3f029b0b24eee1854d08092d941bf554a2e983734ba4f0e12c0fc78b692886b3",
    "retainedCaseSha256": "f990ab830cf86f3a387f4acd3a5f4a05627a0f3bb42fabf46041b87475703ab8",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
        "questionVariantId": "question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
        "conceptId": "concept.postoperative-dvt.three-month-anticoagulation",
        "nodeSha256": "1f6d05cc05c98f0192c8d7f4ad0dd8b3a6fa87a463f36d540578f1e4537d711b",
        "questionSha256": "f07641daec07cdc3ce36aafa9e6e87825d8866586fb7ffdf1d559dc1d2115bea",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2",
    "rawCaseSha256": "d1693c7d41622bd3bd21fc07d372f618da37006877360a4e3e2e4584fdbed605",
    "retainedCaseSha256": "4b7c5d9db13359812730d7ed058442c7bb4d9c05fc2f2d1ba710ddddf582ef0c",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
        "questionVariantId": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
        "conceptId": "concept.postoperative-dvt.three-month-anticoagulation",
        "nodeSha256": "e4627807eb1161ad7e6bf8ecdb0ae76e7ac9f7a8fac8307cf934ea5f377491c3",
        "questionSha256": "dc62cbf2839a9e22ca2b2bc17845a38822ce41d8bb8a88896dbe960c7358dce2",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
    "rawCaseSha256": "087024998160e38b574f4a7668066a433f4b4f56a84c98f4800ffeb606af3718",
    "retainedCaseSha256": "8cd09b7890156a9de527ef037a67d3660e0b1ba0f9562e4d26a2a9b60b7e3a85",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
        "questionVariantId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
        "conceptId": "concept.n1.lymphedema-new-tempo-venous-assessment",
        "nodeSha256": "0158c5c126a2a6b7d48f698a7ccfe088149fb6c90e0ac0fc3d92bfac0f07eab2",
        "questionSha256": "e7c653638256c5b3714931d241f4aa15e1915060dcb230f1b8e081470b60a9e9",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2",
    "rawCaseSha256": "7624db576d5714612d00d91de288b232a45ab86584472b84469da9cbee96e072",
    "retainedCaseSha256": "1ec2e0ddda5794e5c34786b2e6334515585c2dff20c5976a87294d180ee5515a",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
        "questionVariantId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
        "conceptId": "concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1",
        "nodeSha256": "aa392af4da70a24e0cb5a7aefbf9402432656c752cf845ec244c323c53773798",
        "questionSha256": "b7ffc2e9c81319a88599495389345000636ad5efac27103a7341d295b9cf41e9",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2",
    "rawCaseSha256": "b8c1bdc08dc3b66bcafe3cfc61792be7cc5f51f7984521398cbe49889a776a2c",
    "retainedCaseSha256": "dfb49e3db6066d42728153cd1187c9393f035bd3c521b21ae16438006fcf9ca2",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
        "questionVariantId": "question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
        "conceptId": "concept.dialysis-access.maturation-physical-assessment",
        "nodeSha256": "14faa8f2bdb970b1c4bfad527fbce218bd3c0833b671f9163e9cbfc752469e02",
        "questionSha256": "56c781a79466ec32d639cce4c3eb47cac17917a880bb6601fefd899b971fff1f",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "rawCaseSha256": "e9fff28946a7107c1e2b9fb27983c2714943cefe64f65954e7821d386c06b5e2",
    "retainedCaseSha256": "ae1fceec2c3c4bef160a74b7fce9c6ff18277d5827618b2fc374d3d694f44631",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
        "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
        "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
        "nodeSha256": "23b2408d9bfc738fc8cb33e0eb4e599420b03b6be33b5b932f0e7eab0eca7311",
        "questionSha256": "706487c97cf275cd6c3009bd5449528e88f5e484c7d8d4ac6c5f0afb670a30f6",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      },
      {
        "nodeId": "node.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
        "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
        "conceptId": "concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1",
        "nodeSha256": "eefb477cf57d33fc89df2b921fe9d5f9ce8091ff5675473455396fbb6ca04ed2",
        "questionSha256": "ae507fc09f5fd9a1af3984f1e9f4355b474bd3f44a6a866eaa06e1384593dc49",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1",
    "rawCaseSha256": "17efb5547367e701fb2796dffee8a1e1072feb0aec84efc0ef4c032bc3123d71",
    "retainedCaseSha256": "9c94c8f826bb94ea2a83fcffbde20cb458dc4e3f68f2b979cf289b3856e8b07c",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
        "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
        "conceptId": "concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1",
        "nodeSha256": "448b33247eca04fe0d21f7b64d8c728f4301e6fa081e280d539d3304356a7dee",
        "questionSha256": "121d7a483dc02ed8544c21815589a4f155a1e268cb63dfc08eb4e850eea5d67b",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
    "rawCaseSha256": "e965dfc7a9024f181dd3e049e2f77239c77e8d95ff32eea792a7ef772d5f8988",
    "retainedCaseSha256": "641fd53cc0515f186a4cace95e7a44bceeb5996bbb67b3446330a49a1e350938",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
        "questionVariantId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
        "conceptId": "concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1",
        "nodeSha256": "d196917e0d19af9a7b0888ed64d157ba42fbb47d94ff53f75ce99f3bb4d07b66",
        "questionSha256": "f97bdd3387689ee290b61720d2bb10ec88d434241c1487b6923195d231ba234d",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
    "rawCaseSha256": "7dcd936d412271aa99269252a99f924810129cfe75e9b95840f6b5c1955031f8",
    "retainedCaseSha256": "a1a135ccf1341cfc68596571be76405b62d316cfd76371f2738c1000e57bc73a",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
        "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
        "conceptId": "concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1",
        "nodeSha256": "44c8ecd9f2a311c6174300ec3c36a3dfae1a86cfc47fe41c6b34fa0290dfadff",
        "questionSha256": "1b0e5e27fb8f57d93ab933620f756c987eb7bb8b11327ef76cce7484cc8ea688",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1",
    "rawCaseSha256": "134cac805fd2bb9190a2b5fd8c8aebf08736aafe5a26fc9c0f3e098cfc6696fc",
    "retainedCaseSha256": "b6909d215ecd3451eb5ffeb4bb04ebea7c1da8cc3b9c9672ec3a9746e385d3e1",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
        "questionVariantId": "question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
        "conceptId": "concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1",
        "nodeSha256": "b18b3bd6151a306d5cbd20ec4005f284be0ff06b47e1ddf3000f327c55f8c730",
        "questionSha256": "f7f8bf933201d18a7e85a1db3dd0615f30aedee763f68f828f0cfa227fd42330",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "vascular-venous-lymphatic-access",
    "caseId": "case.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v2",
    "rawCaseSha256": "df7ff00b88d4ae58d6f678418e2eb94c594703c195e7c562017a347373b8c777",
    "retainedCaseSha256": "f0463f8bf32247e42ab67194ff8f8c242f56b831f613f0ce4a724a0359fee7ba",
    "nodes": [
      {
        "nodeId": "node.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
        "questionVariantId": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
        "conceptId": "concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1",
        "nodeSha256": "97a71be72c0bc39c0382a3871a82d43ddede8d8ba1e0b769e49e9e2531ce3325",
        "questionSha256": "ba163840211a008c65c94701c587f136ac19cf1a0dc11bde66125895fcb09b7c",
        "reviewPath": "docs/research/question-topic-vascular-venous-lymphatic-access-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "esophagus-motility-achalasia",
    "caseId": "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2",
    "rawCaseSha256": "4290fc22faeacb5c675b2626213802ef033a166b06d034ba2f069736b3069af2",
    "retainedCaseSha256": "4290fc22faeacb5c675b2626213802ef033a166b06d034ba2f069736b3069af2",
    "nodes": [
      {
        "nodeId": "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
        "questionVariantId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
        "conceptId": "concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1",
        "nodeSha256": "e3e02ec84626a8f7c696875f20a19f37a6dda533ddfd1195085886c95ecce69d",
        "questionSha256": "08bee77d8963aaccf1364ce28a771441aa7f0ac7046a4d37ae4bab34adb29c88",
        "reviewPath": "docs/research/question-topic-esophagus-motility-achalasia-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "bariatric-metabolic",
    "caseId": "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
    "rawCaseSha256": "941b9a064163ba04a10feb364a1e4eec408006b3ae152b0c4ae04f143a33f9eb",
    "retainedCaseSha256": "941b9a064163ba04a10feb364a1e4eec408006b3ae152b0c4ae04f143a33f9eb",
    "nodes": [
      {
        "nodeId": "node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
        "questionVariantId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
        "conceptId": "concept.pbh.spontaneous-evidence-before-treatment.v2",
        "nodeSha256": "3f3f28c8d17190933ba517cd5f7358663e7893b82fb8d886691c85f5c23a520b",
        "questionSha256": "1aa1304e91239ba6aa164e4c2d5c91a02921eb2d91d10bf3d929b8b0450226ce",
        "reviewPath": "docs/research/question-topic-bariatric-metabolic-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "bariatric-metabolic",
    "caseId": "case.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1",
    "rawCaseSha256": "3a3e175b12560a5ad69e0839f807fc7ef05348b84f9f9fd441fccfe56e692c71",
    "retainedCaseSha256": "3a3e175b12560a5ad69e0839f807fc7ef05348b84f9f9fd441fccfe56e692c71",
    "nodes": [
      {
        "nodeId": "node.topic.bariatric-metabolic.diet-response-drug-stage.v2",
        "questionVariantId": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
        "conceptId": "concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2",
        "nodeSha256": "cfc3501af8fb9ce9f51202e99f7017e3e898077dc7feb4af9fbd49e9ecb108d6",
        "questionSha256": "520db675a6726721cb5c1061c7f641740ebfb4f35bd257e1e3bc79027c8fdfec",
        "reviewPath": "docs/research/question-topic-bariatric-metabolic-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "bariatric-metabolic",
    "caseId": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
    "rawCaseSha256": "4761117de66bfe1221a8dfb26e4f6ecd68c8e85dcb270b43a931a8fa3d19db5f",
    "retainedCaseSha256": "4761117de66bfe1221a8dfb26e4f6ecd68c8e85dcb270b43a931a8fa3d19db5f",
    "nodes": [
      {
        "nodeId": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
        "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
        "conceptId": "concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2",
        "nodeSha256": "084cbd2bcd3eb1d1923a5776fea287985ebcf4845f5e7341a717d2416f889321",
        "questionSha256": "a8f2c6f93c8f2404d3a3af070abd6748a93c756e6b7b5d38d4e110e4fcb3b69e",
        "reviewPath": "docs/research/question-topic-bariatric-metabolic-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "pediatric-gi-abdominal-wall",
    "caseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
    "rawCaseSha256": "757bb86454ef203d560d43a729cad4551cae87853bc5ad0de3a38caa6368902e",
    "retainedCaseSha256": "757bb86454ef203d560d43a729cad4551cae87853bc5ad0de3a38caa6368902e",
    "nodes": [
      {
        "nodeId": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
        "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
        "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
        "nodeSha256": "4ef3c990b8100f093465fa7007f7c95690746f998a39777bd879cc3bd1f6ddb6",
        "questionSha256": "bee952ebf5deb89f538a995750406a4d13556dd6af74e2db75dd079c0a568d12",
        "reviewPath": "docs/research/question-topic-pediatric-gi-abdominal-wall-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "pediatric-gi-abdominal-wall",
    "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "rawCaseSha256": "33a8b304173a07ac40d9de34431a369ce69849319b5ac97d7659618e2970b88c",
    "retainedCaseSha256": "33a8b304173a07ac40d9de34431a369ce69849319b5ac97d7659618e2970b88c",
    "nodes": [
      {
        "nodeId": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
        "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
        "conceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
        "nodeSha256": "b213ae8af6bcf5ff5e18361e51f8166981a0a1727dc6e5aa9c03c8250d259085",
        "questionSha256": "591060294b042395e1b3d1e4ba58c173fcad4fd31a0164bb00ec9cec7895860a",
        "reviewPath": "docs/research/question-topic-pediatric-gi-abdominal-wall-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "pediatric-gi-abdominal-wall",
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "rawCaseSha256": "6ed04de62c0f5154efec5f64d0e6c8d5fb653a4aa04618b1cf08dd21f428f35f",
    "retainedCaseSha256": "6ed04de62c0f5154efec5f64d0e6c8d5fb653a4aa04618b1cf08dd21f428f35f",
    "nodes": [
      {
        "nodeId": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
        "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
        "conceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
        "nodeSha256": "58bab61235bd6da190dec3e27925e86c787cf7a2e71bd8c3f14a7f1f18a5de18",
        "questionSha256": "f0a196c1be8166afcb583741decca5950ea206981d345ae744e6dea1e190e492",
        "reviewPath": "docs/research/question-topic-pediatric-gi-abdominal-wall-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "pediatric-gi-abdominal-wall",
    "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
    "rawCaseSha256": "d1c0148f6a06a3245b72ca6ee7835bc132f0c31be0e4de7f59396d49ebc02e6f",
    "retainedCaseSha256": "d1c0148f6a06a3245b72ca6ee7835bc132f0c31be0e4de7f59396d49ebc02e6f",
    "nodes": [
      {
        "nodeId": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
        "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
        "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
        "nodeSha256": "e1cd051092d60bdb3ad143b047ff0bfed398e0e6c091c3b86595dd30641bc796",
        "questionSha256": "80bee6ef43cb7be685280ddc9199a76eca8d3c3284f3c85a5c07b6daf75f768e",
        "reviewPath": "docs/research/question-topic-pediatric-gi-abdominal-wall-review-salvage-20261111.json"
      }
    ]
  },
  {
    "topic": "pediatric-gi-abdominal-wall",
    "caseId": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
    "rawCaseSha256": "472b44951a7be43233384f5fd1cfa061d9b695cd769f827ae22a36b0819b800e",
    "retainedCaseSha256": "472b44951a7be43233384f5fd1cfa061d9b695cd769f827ae22a36b0819b800e",
    "nodes": [
      {
        "nodeId": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
        "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
        "conceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
        "nodeSha256": "259b87413e186edd3468fa1c490cde8296b1b887e52644aeae8bd62c40a90527",
        "questionSha256": "0f70110765b732d0def1de259d034e4640f55116ab0988e8abc2898e2afa7fe0",
        "reviewPath": "docs/research/question-topic-pediatric-gi-abdominal-wall-review-salvage-20261111.json"
      }
    ]
  }
] as const;
export const PROGRAM_BATCH5_LENGTH_RESIDUALS = [
  {
    "caseId": "case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "correctLength": 58,
    "longestDistractor": 51
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "correctLength": 46,
    "longestDistractor": 36
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "correctLength": 61,
    "longestDistractor": 58
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "correctLength": 65,
    "longestDistractor": 48
  },
  {
    "caseId": "case.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "correctLength": 40,
    "longestDistractor": 39
  },
  {
    "caseId": "case.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1",
    "questionVariantId": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "correctLength": 46,
    "longestDistractor": 43
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "correctLength": 35,
    "longestDistractor": 30
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "correctLength": 54,
    "longestDistractor": 42
  }
] as const;
export const PROGRAM_BATCH5_AUTHORED_CONCEPTS = [
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.n2.vte-prophylaxis-to-treatment",
    "displayName": "A new DVT changes anticoagulation purpose",
    "learningObjective": "Distinguish prophylactic anticoagulation from treatment of a newly confirmed postoperative proximal DVT.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-proximal-treatment",
      "claim.vascular-venous-lymphatic-access.dvt-prophylaxis-not-treatment",
      "claim.vascular-venous-lymphatic-access.filter-not-routine"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.postoperative-dvt.three-month-anticoagulation",
    "displayName": "Finite anticoagulation after surgery-provoked DVT",
    "learningObjective": "Select finite anticoagulation planning for a first uncomplicated major-surgery-provoked proximal DVT when safe.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-three-month-resolved",
      "claim.vascular-venous-lymphatic-access.dvt-extended-context",
      "claim.vascular-venous-lymphatic-access.dvt-heterozygous-fvl-duration",
      "claim.vascular-venous-lymphatic-access.dvt-residual-not-filter",
      "claim.vascular-venous-lymphatic-access.dvt-recurrent-comparison"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.postoperative-dvt.three-month-anticoagulation",
    "displayName": "Finite anticoagulation after surgery-provoked DVT",
    "learningObjective": "Select finite anticoagulation planning for a first uncomplicated major-surgery-provoked proximal DVT when safe.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-three-month-resolved",
      "claim.vascular-venous-lymphatic-access.dvt-extended-context",
      "claim.vascular-venous-lymphatic-access.dvt-heterozygous-fvl-duration",
      "claim.vascular-venous-lymphatic-access.dvt-residual-not-filter",
      "claim.vascular-venous-lymphatic-access.dvt-recurrent-comparison"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.n1.lymphedema-new-tempo-venous-assessment",
    "displayName": "New swelling despite established lymphedema",
    "learningObjective": "Investigate an acute postoperative change in a chronically swollen limb before attributing it to established lymphedema.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.lymphatic-pattern",
      "claim.vascular-venous-lymphatic-access.lymphatic-new-change",
      "claim.vascular-venous-lymphatic-access.dvt-postoperative-imaging"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1",
    "displayName": "varicose proximal territory",
    "learningObjective": "Recognize proximal outflow clues before treating visible varices as an isolated reflux problem.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.venous-proximal-obstruction",
      "claim.vascular-venous-lymphatic-access.venous-reflux-protocol"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.dialysis-access.maturation-physical-assessment",
    "displayName": "Assess dialysis-access maturation",
    "learningObjective": "Use look, feel, and listen examination and external specialist ultrasound when maturation remains uncertain.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.access-maturation",
      "claim.vascular-venous-lymphatic-access.access-maturation-timing",
      "claim.vascular-venous-lymphatic-access.access-exam-interpretation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "displayName": "Arterial assessment before venous-ulcer compression",
    "learningObjective": "Obtain arterial assessment before selecting compression for a suspected venous leg ulcer.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-noncompressible",
      "claim.vascular-venous-lymphatic-access.ulcer-perfusion-first",
      "claim.vascular-venous-lymphatic-access.arterial-exercise-testing"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1",
    "displayName": "ulcer severe perfusion",
    "learningObjective": "Do not apply sustained venous-ulcer compression when a new independent perfusion result shows a severe safety boundary.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-severe-ischemia",
      "claim.vascular-venous-lymphatic-access.ulcer-noncompressible",
      "claim.vascular-venous-lymphatic-access.ulcer-compression"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1",
    "displayName": "ulcer mixed compression",
    "learningObjective": "Use source-supported residual-perfusion criteria to distinguish selected modified compression from full-pressure or withheld compression.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.ulcer-modified-compression",
      "claim.vascular-venous-lymphatic-access.ulcer-standard-pressure",
      "claim.vascular-venous-lymphatic-access.ulcer-severe-ischemia",
      "claim.vascular-venous-lymphatic-access.ulcer-current-record"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1",
    "displayName": "dvt serial negative proximal",
    "learningObjective": "Keep acquisition scope and continuing clinical suspicion separate when a first proximal study is negative.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.dvt-negative-proximal",
      "claim.vascular-venous-lymphatic-access.dvt-acquisition-adequacy",
      "claim.vascular-venous-lymphatic-access.dvt-postoperative-imaging",
      "claim.vascular-venous-lymphatic-access.venous-proximal-obstruction"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1",
    "displayName": "access hand physiology",
    "learningObjective": "Investigate an access contribution to hand ischemic symptoms rather than infer dysfunction from access flow alone.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.access-ischemia-assessment",
      "claim.vascular-venous-lymphatic-access.access-compression-response",
      "claim.vascular-venous-lymphatic-access.access-clinical-indicators",
      "claim.vascular-venous-lymphatic-access.access-neuropathic-differential"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1",
    "displayName": "access multinerve neuropathy",
    "learningObjective": "Recognize severe post-access multinerve dysfunction despite preserved skin warmth and pulse.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.access-neuropathy",
      "claim.vascular-venous-lymphatic-access.access-neuropathy-urgent",
      "claim.vascular-venous-lymphatic-access.access-ischemia-assessment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-vascular-venous-lymphatic-access.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1",
    "displayName": "catheter intraluminal dysfunction",
    "learningObjective": "Distinguish an initial catheter-dysfunction treatment from catheter exchange after that treatment fails.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.vascular-venous-lymphatic-access.catheter-thrombolytic-lock",
      "claim.vascular-venous-lymphatic-access.catheter-site"
    ]
  },
  {
    "id": "concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1",
    "displayName": "recurrent clearance test",
    "learningObjective": "Choose objective clearance assessment when recurrent symptoms and post-myotomy pressure findings disagree.",
    "earliestFacilityStage": 2,
    "conceptType": "workup",
    "contentVersion": "question-topic-esophagus-motility-achalasia.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "identityDecision": "new_meaning",
    "identityReason": "The assigned bank lacks a scored assessment of recurrent symptoms after myotomy using objective bolus clearance.",
    "educationalTier": 1,
    "acuity": "stable",
    "requiredCapabilityIds": [],
    "evidenceClaimIds": [
      "claim.esophagus-motility-achalasia.post-treatment-tbe",
      "claim.esophagus-motility-achalasia.barium-clearance",
      "claim.esophagus-motility-achalasia.tablet-obstruction",
      "claim.esophagus-motility-achalasia.hrm-acquisition",
      "claim.esophagus-motility-achalasia.myotomy-limit",
      "claim.esophagus-motility-achalasia.recurrence-mechanisms",
      "claim.esophagus-motility-achalasia.objective-postpoem-reflux",
      "claim.esophagus-motility-achalasia.posttherapy-endoscopic-targets"
    ],
    "historyMigration": "Retain prior definitions and histories on their existing identities."
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pbh.spontaneous-evidence-before-treatment.v2",
    "previousConceptId": "concept.pbh.completed-whipple-triad",
    "conceptRelation": "new_version",
    "displayName": "Distinguish sensor observations from confirmed symptomatic hypoglycemia before assigning PBH-directed treatment.",
    "learningObjective": "Distinguish sensor observations from confirmed symptomatic hypoglycemia before assigning PBH-directed treatment.",
    "conceptType": "workup",
    "educationalTier": 1,
    "patientAcuity": "stable_outpatient",
    "recordedHospitalAcuity": null,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "evidenceClaimIds": [
      "claim.bariatric-metabolic.pbh-confirm",
      "claim.bariatric-metabolic.pbh-cgm",
      "claim.bariatric-metabolic.pbh-no-provocation",
      "claim.bariatric-metabolic.hypoglycemia-sampling-context"
    ],
    "historyPolicy": "Preserve all old definitions, exact frozen encounters and FSRS cards. No transfer to a changed construct."
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2",
    "previousConceptId": "concept.bariatric-metabolic.pbh-first-pharmacotherapy.v1",
    "conceptRelation": "new_version",
    "displayName": "Interpret withdrawal and rechallenge observations before choosing the next medication stage for persistent PBH.",
    "learningObjective": "Interpret withdrawal and rechallenge observations before choosing the next medication stage for persistent PBH.",
    "conceptType": "management",
    "educationalTier": 1,
    "patientAcuity": "stable_outpatient",
    "recordedHospitalAcuity": null,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "evidenceClaimIds": [
      "claim.bariatric-metabolic.pbh-acarbose",
      "claim.bariatric-metabolic.pbh-acarbose-gi-effects",
      "claim.bariatric-metabolic.pbh-second-line",
      "claim.bariatric-metabolic.pbh-diazoxide"
    ],
    "historyPolicy": "Preserve all old definitions, exact frozen encounters and FSRS cards. No transfer to a changed construct."
  },
  {
    "contentVersion": "question-topic-bariatric-metabolic.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2",
    "previousConceptId": "concept.bariatric-metabolic.refractory-post-sleeve-reflux-conversion.v1",
    "conceptRelation": "new_version",
    "displayName": "Use prior objective GERD evidence and current PPI exposure to select the reflux-monitoring protocol before further post-sleeve treatment.",
    "learningObjective": "Use prior objective GERD evidence and current PPI exposure to select the reflux-monitoring protocol before further post-sleeve treatment.",
    "conceptType": "workup",
    "educationalTier": 1,
    "patientAcuity": "stable_outpatient",
    "recordedHospitalAcuity": null,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "evidenceClaimIds": [
      "claim.bariatric-metabolic.ppi-meal-timing",
      "claim.bariatric-metabolic.ppi-before-escalation",
      "claim.bariatric-metabolic.gerd-established-on-therapy-testing",
      "claim.bariatric-metabolic.gerd-unproven-off-therapy-testing",
      "claim.bariatric-metabolic.gerd-impedance-scope"
    ],
    "historyPolicy": "Preserve all old definitions, exact frozen encounters and FSRS cards. No transfer to a changed construct."
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "displayName": "Select management after partial ileocolic reduction with persistent stability.",
    "learningObjective": "Select management after partial ileocolic reduction with persistent stability.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [],
    "clinicalReason": "A consequential pediatric decision not scored by the two existing groin-referral identities.",
    "historyPolicy": "Create a separate concept; do not migrate old FSRS history or alter frozen encounters.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.intussusception-risk",
      "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
      "claim.pediatric-gi-abdominal-wall.intussusception-operation",
      "claim.pediatric-gi-abdominal-wall.intussusception-transient"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "displayName": "Interpret a fixed bowel loop against improving NEC physiology.",
    "learningObjective": "Interpret a fixed bowel loop against improving NEC physiology.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [],
    "clinicalReason": "Consequential pediatric objective absent from the assigned bank.",
    "historyPolicy": "New identity; do not transfer old histories or alter frozen encounters.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
      "claim.pediatric-gi-abdominal-wall.nec-drain",
      "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
    "displayName": "Distinguish productive partial therapeutic decompression from completed resolution or failed nonoperative treatment of uncomplicated meconium ileus.",
    "learningObjective": "Distinguish productive partial therapeutic decompression from completed resolution or failed nonoperative treatment of uncomplicated meconium ileus.",
    "conceptType": "management",
    "conceptRelation": "same_meaning_new_question_version",
    "previousConceptIds": [],
    "clinicalReason": "Same scored clinical decision, revised wording/findings/options after independent review; preserve this concept identity.",
    "historyPolicy": "Preserve stable concept ID and attached history; exact v1 definition and question retained in reviewInput.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
      "claim.pediatric-gi-abdominal-wall.meconium-enema",
      "claim.pediatric-gi-abdominal-wall.meconium-repeat",
      "claim.pediatric-gi-abdominal-wall.meconium-complicated"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
    "displayName": "Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
    "learningObjective": "Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [
      "concept.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v1"
    ],
    "clinicalReason": "Materially changed scored objective after independent review: Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
      "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
      "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
      "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "displayName": "Balance prematurity-related respiratory risk against reducible hernia risk.",
    "learningObjective": "Balance prematurity-related respiratory risk against reducible hernia risk.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [
      "concept.n4r2.pediatric-groin-contents-and-reducibility",
      "concept.pediatric-clinic.inguinal-hernia-referral"
    ],
    "clinicalReason": "Materially new timing tradeoff replaces repetitive generic referral/contents-triage objectives. Both old concept IDs and all histories are retained; no FSRS migration.",
    "historyPolicy": "New identity; do not transfer old histories or alter frozen encounters.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
    ],
    "earliestFacilityStage": 4
  }
] as const;
