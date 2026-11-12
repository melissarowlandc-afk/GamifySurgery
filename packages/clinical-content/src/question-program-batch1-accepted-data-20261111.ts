import type {QuestionShipAcceptance,QuestionShipCaseReplacement} from "./question-ship-manifest";
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry,SyntheticClinicalCase} from "./schema";
import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";
/** Immutable accepted-only snapshots. No topic-worker source is imported or edited. */
export const PROGRAM_BATCH1_ROWS:QuestionShipAcceptance[]=[
  {
    "acceptanceId": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "caseId": "case.topic.small-bowel-obstruction-ileus.closed-loop.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "conceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
    "sourceView": "topic-batch1-small-bowel-obstruction-ileus",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "caseId": "case.topic.small-bowel-obstruction-ileus.transit-course.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "conceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
    "sourceView": "topic-batch1-small-bowel-obstruction-ileus",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "caseId": "case.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "conceptId": "concept.small-bowel-obstruction-ileus.nonoperative-eligibility.v1",
    "sourceView": "topic-batch1-small-bowel-obstruction-ileus",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "caseId": "case.topic.critical-renal-organ-support.circuit-anticoagulation.v1",
    "nodeId": "node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "questionVariantId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "conceptId": "concept.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "sourceView": "topic-batch1-critical-renal-organ-support",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "caseId": "case.topic.critical-renal-organ-support.kidney-recovery.v1",
    "nodeId": "node.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "questionVariantId": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "conceptId": "concept.critical-renal-organ-support.trial-off-crrt.v1",
    "sourceView": "topic-batch1-critical-renal-organ-support",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "questionVariantId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "conceptId": "concept.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "sourceView": "topic-batch1-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "questionVariantId": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "conceptId": "concept.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "sourceView": "topic-batch1-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "caseId": "case.critical-shock-resuscitation.reassess-shock-mechanism.v2",
    "nodeId": "node.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "questionVariantId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "conceptId": "concept.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "sourceView": "topic-batch1-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v2",
    "nodeId": "node.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "conceptId": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
    "sourceView": "topic-batch1-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "caseId": "case.topic.appendix-appendicitis.goblet-cell-pathology.v1",
    "nodeId": "node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "conceptId": "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
    "sourceView": "topic-batch1-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2",
    "nodeId": "node.topic.appendix-appendicitis.net-regional-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "conceptId": "concept.appendix-appendicitis.large-net-regional-resection.v1",
    "sourceView": "topic-batch1-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "caseId": "case.topic.critical-respiratory-ventilation.air-trapping.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "conceptId": "concept.critical-respiratory-ventilation.expiratory-time.v1",
    "sourceView": "topic-batch1-critical-respiratory-ventilation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "caseId": "case.topic.critical-respiratory-ventilation.extubation-rescue.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "conceptId": "concept.critical-respiratory-ventilation.postextubation-rescue.v1",
    "sourceView": "topic-batch1-critical-respiratory-ventilation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  }
];
export const PROGRAM_BATCH1_REPLACEMENTS:QuestionShipCaseReplacement[]=[
  {
    "replaces": "case.gs028.small-bowel-obstruction.b-stable-no-red-flags",
    "with": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1"
  },
  {
    "replaces": "case.gs028.small-bowel-obstruction.b-peritoneal-signs",
    "with": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1"
  }
];
export const PROGRAM_BATCH1_VIEWS:Record<string,SyntheticClinicalRelease>={
  "topic-batch1-small-bowel-obstruction-ileus": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic draft archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
        "displayName": "postoperative focal entrapment",
        "learningObjective": "Select timely operative exploration for SBO danger findings despite a reassuring laboratory value or partial symptomatic improvement.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      },
      {
        "id": "concept.small-bowel-obstruction-ileus.nonoperative-eligibility.v1",
        "displayName": "virgin abdomen observation",
        "learningObjective": "Integrate obstruction anatomy, perfusion and examination before choosing an initial supervised nonoperative trial.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.topic.small-bowel-obstruction-ileus.closed-loop.v1",
        "displayName": "Abdominal episode review",
        "patientPresentationVariantId": "presentation.topic.small-bowel-obstruction-ileus.closed-loop.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Eli Mercer",
        "prototypeDemographics": {
          "ageYears": 47,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Abdominal episode review",
        "presentation": "{patientName}, a 47-year-old man, attends clinic after an admission for sudden cramps and vomiting. He previously had an appendectomy.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.small-bowel-obstruction-ileus.closed-loop.v1",
            "prototypeDemographics": {
              "ageYears": 47,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Abdominal episode review",
            "presentation": "{patientName}, a 47-year-old man, attends clinic after an admission for sudden cramps and vomiting. He previously had an appendectomy."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Original constructed retrospective hospital record",
          "Clinical draft requiring Melissa Rowland's review"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
            "questionVariantId": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
            "primaryConceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
            "currentUpdate": "CT showed a C-shaped fluid-filled small-bowel segment with two nearby beak-like caliber changes. Its mesenteric vessels converged and twisted, adjacent fluid was present, and mural enhancement was reduced relative to nearby bowel. After fluids and nasogastric drainage his pain eased. Blood pressure was preserved, the abdomen had no rebound, and lactate was within the laboratory reference interval.",
            "stem": "Which hospital plan best fits {patientName}'s CT and reassessment findings?",
            "answerChoices": [
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.challenge",
                "label": "Begin an enteral contrast challenge with interval radiography",
                "isCorrect": false,
                "rationale": "The configuration and reduced enhancement require urgent operative assessment. A transit challenge must not postpone that response.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.explore",
                "label": "Proceed to urgent operative exploration of the involved bowel",
                "isCorrect": true,
                "rationale": "Two transition sites and twisted mesentery define a trapped segment, and reduced enhancement raises concern about its blood supply. Normal lactate and pain relief do not neutralize those findings.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.observe",
                "label": "Continue nasogastric decompression with inpatient serial reassessment",
                "isCorrect": false,
                "rationale": "This is appropriate for selected uncomplicated obstruction, but the supplied CT raises a different risk that requires timely exploration.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The geometry indicates a closed loop, while reduced wall enhancement raises concern for impaired perfusion. These findings support urgent exploration despite the laboratory lactate and partial response to decompression.",
            "sourceLabels": [
              "Original constructed retrospective hospital record",
              "Clinical draft requiring Melissa Rowland's review"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.challenge",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the historical clinical decision and feedback. No patient outcome is simulated.",
                "clinicalRationale": "The configuration and reduced enhancement require urgent operative assessment. A transit challenge must not postpone that response.",
                "sourceLabels": [
                  "Original constructed retrospective hospital record",
                  "Clinical draft requiring Melissa Rowland's review"
                ]
              },
              {
                "answerChoiceId": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.observe",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the historical clinical decision and feedback. No patient outcome is simulated.",
                "clinicalRationale": "This is appropriate for selected uncomplicated obstruction, but the supplied CT raises a different risk that requires timely exploration.",
                "sourceLabels": [
                  "Original constructed retrospective hospital record",
                  "Clinical draft requiring Melissa Rowland's review"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The geometry indicates a closed loop, while reduced wall enhancement raises concern for impaired perfusion. These findings support urgent exploration despite the laboratory lactate and partial response to decompression."
      },
      {
        "id": "case.topic.small-bowel-obstruction-ileus.transit-course.v1",
        "displayName": "Abdominal course review",
        "patientPresentationVariantId": "presentation.topic.small-bowel-obstruction-ileus.transit-course.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Sara Dunn",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Abdominal course review",
        "presentation": "{patientName}, a 63-year-old woman, attends clinic after admission for a small-bowel obstruction following prior pelvic surgery. During the admission, an enteral contrast study showed contrast in the colon and her cramps initially improved.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.small-bowel-obstruction-ileus.transit-course.v1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Abdominal course review",
            "presentation": "{patientName}, a 63-year-old woman, attends clinic after admission for a small-bowel obstruction following prior pelvic surgery. During the admission, an enteral contrast study showed contrast in the colon and her cramps initially improved."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Original constructed retrospective hospital record",
          "Clinical draft requiring Melissa Rowland's review"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
            "questionVariantId": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
            "primaryConceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
            "currentUpdate": "Later that day, pain became persistent and focal, heart rate increased, and the abdomen developed involuntary guarding with rebound. The earlier film still showed contrast throughout the colon. She was receiving intravenous fluids and nasogastric decompression.",
            "stem": "Which hospital plan best fits {patientName}'s later reassessment?",
            "answerChoices": [
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.explore",
                "label": "Proceed to urgent operative exploration of the abdomen",
                "isCorrect": true,
                "rationale": "The new peritoneal examination requires operative assessment. Earlier contrast passage predicts transit and does not establish current bowel viability.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.repeat-transit",
                "label": "Repeat enteral contrast administration and the transit films",
                "isCorrect": false,
                "rationale": "Repeating transit assessment does not answer the immediate concern raised by new peritoneal findings and may delay exploration.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.continue",
                "label": "Continue decompression and reassess after the observation period",
                "isCorrect": false,
                "rationale": "A previously favorable film does not justify waiting through a new peritoneal examination.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Colonic contrast passage is a favorable prognostic finding for nonoperative resolution. New guarding and rebound require a fresh surgical response. The transit result cannot establish that bowel remains viable during a changed clinical course.",
            "sourceLabels": [
              "Original constructed retrospective hospital record",
              "Clinical draft requiring Melissa Rowland's review"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.repeat-transit",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the historical clinical decision and feedback. No patient outcome is simulated.",
                "clinicalRationale": "Repeating transit assessment does not answer the immediate concern raised by new peritoneal findings and may delay exploration.",
                "sourceLabels": [
                  "Original constructed retrospective hospital record",
                  "Clinical draft requiring Melissa Rowland's review"
                ]
              },
              {
                "answerChoiceId": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.continue",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the historical clinical decision and feedback. No patient outcome is simulated.",
                "clinicalRationale": "A previously favorable film does not justify waiting through a new peritoneal examination.",
                "sourceLabels": [
                  "Original constructed retrospective hospital record",
                  "Clinical draft requiring Melissa Rowland's review"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Colonic contrast passage is a favorable prognostic finding for nonoperative resolution. New guarding and rebound require a fresh surgical response. The transit result cannot establish that bowel remains viable during a changed clinical course."
      },
      {
        "id": "case.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1",
        "displayName": "First episode review",
        "patientPresentationVariantId": "presentation.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Ben Carter",
        "prototypeDemographics": {
          "ageYears": 56,
          "sexLabel": "Male"
        },
        "chiefComplaint": "First episode review",
        "presentation": "{patientName}, a 56-year-old man, attends clinic after his first admission for cramps, vomiting and obstipation. He had never undergone abdominal surgery and had no known intra-abdominal inflammatory disease.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1",
            "prototypeDemographics": {
              "ageYears": 56,
              "sexLabel": "Male"
            },
            "chiefComplaint": "First episode review",
            "presentation": "{patientName}, a 56-year-old man, attends clinic after his first admission for cramps, vomiting and obstipation. He had never undergone abdominal surgery and had no known intra-abdominal inflammatory disease."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Original constructed retrospective hospital record",
          "Clinical draft requiring Melissa Rowland's review"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
            "questionVariantId": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
            "primaryConceptId": "concept.small-bowel-obstruction-ileus.nonoperative-eligibility.v1",
            "currentUpdate": "CT showed a single angulated small-bowel transition with proximal dilation and distal collapse. No mass, bowel-wall lesion, hernia, closed segment or perfusion abnormality was identified. Groin examination found no hernia. After fluids and nasogastric drainage his pain lessened and the abdomen was soft without guarding, although flatus had not resumed.",
            "stem": "Which initial hospital plan best fits {patientName}'s completed assessment?",
            "answerChoices": [
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.explore",
                "label": "Proceed directly to exploration during the initial assessment",
                "isCorrect": false,
                "rationale": "No prior operation does not itself mandate exploration when the current CT and examination support a supervised trial. The underlying cause still requires attention.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.feed",
                "label": "Remove decompression and begin an oral-intake trial",
                "isCorrect": false,
                "rationale": "A reassuring initial assessment and less pain do not establish resolution. Ongoing obstruction still needs hospital support and monitoring.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.observe",
                "label": "Continue decompression with inpatient serial surgical reassessment",
                "isCorrect": true,
                "rationale": "A selected first SBO in an unoperated abdomen can receive a nonoperative trial after CT and examination exclude an identified urgent cause. The absence of an operation history does not prove etiology.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "A previously unoperated abdomen changes the differential, but it does not automatically require exploration. This assessment supports a supervised trial. Resolution would still leave the cause and appropriate follow-up to be assessed.",
            "sourceLabels": [
              "Original constructed retrospective hospital record",
              "Clinical draft requiring Melissa Rowland's review"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.explore",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the historical clinical decision and feedback. No patient outcome is simulated.",
                "clinicalRationale": "No prior operation does not itself mandate exploration when the current CT and examination support a supervised trial. The underlying cause still requires attention.",
                "sourceLabels": [
                  "Original constructed retrospective hospital record",
                  "Clinical draft requiring Melissa Rowland's review"
                ]
              },
              {
                "answerChoiceId": "choice.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.feed",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the historical clinical decision and feedback. No patient outcome is simulated.",
                "clinicalRationale": "A reassuring initial assessment and less pain do not establish resolution. Ongoing obstruction still needs hospital support and monitoring.",
                "sourceLabels": [
                  "Original constructed retrospective hospital record",
                  "Clinical draft requiring Melissa Rowland's review"
                ]
              }
            ]
          }
        ],
        "learningSummary": "A previously unoperated abdomen changes the differential, but it does not automatically require exploration. This assessment supports a supervised trial. Resolution would still leave the cause and appropriate follow-up to be assessed."
      }
    ]
  },
  "topic-batch1-critical-renal-organ-support": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic draft archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.critical-renal-organ-support.citrate-bleeding-circuit.v1",
        "displayName": "Choose a circuit anticoagulation strategy when repeated clotting and recent hemorrhage compete.",
        "learningObjective": "Choose a circuit anticoagulation strategy when repeated clotting and recent hemorrhage compete.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.critical-renal-organ-support.trial-off-crrt.v1",
        "displayName": "Choose a monitored interruption when actual off-treatment control and spontaneous urine support recovery despite residual creatinine elevation.",
        "learningObjective": "Choose a monitored interruption when actual off-treatment control and spontaneous urine support recovery despite residual creatinine elevation.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.topic.critical-renal-organ-support.circuit-anticoagulation.v1",
        "displayName": "Dialysis circuit clotting",
        "patientPresentationVariantId": "presentation.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1",
        "patientDisplayName": "Owen Carter",
        "prototypeDemographics": {
          "ageYears": 71,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Dialysis circuit clotting",
        "patientPresentationRevision": {
          "id": "presentation-revision.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1",
          "patientPresentationVariantId": "presentation.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1",
          "contentVersion": "presentation-revision.critical-renal-organ-support.2026-11-11.clinic.v1",
          "revisedPresentation": "In clinic, the founder reviews {patientName}'s outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, \"{patientName}, a 71-year-old man, is in the surgical ICU receiving CRRT after postoperative hemorrhage.\" All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.",
          "revisedFields": [
            "presentation"
          ],
          "revisedProfilePresentations": [
            {
              "id": "revision.profile.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1",
              "approvedInstantiationProfileId": "profile.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1",
              "contentVersion": "presentation-revision.critical-renal-organ-support.2026-11-11.clinic.v1",
              "revisedPresentation": "In clinic, the founder reviews {patientName}'s outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, \"{patientName}, a 71-year-old man, is in the surgical ICU receiving CRRT after postoperative hemorrhage.\" All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.",
              "revisedFields": [
                "presentation"
              ],
              "aiAssistedDrafting": true,
              "reviewStatus": "needs_clinician_review",
              "lastClinicianReview": null
            }
          ],
          "revisedDecisionStems": [
            {
              "id": "revision.node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
              "decisionNodeId": "node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
              "questionVariantId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
              "contentVersion": "presentation-revision.critical-renal-organ-support.2026-11-11.clinic.v1",
              "revisedStem": "During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which CRRT anticoagulation strategy should Owen Carter receive now?",
              "aiAssistedDrafting": true,
              "reviewStatus": "needs_clinician_review",
              "lastClinicianReview": null
            }
          ],
          "aiAssistedDrafting": true,
          "reviewStatus": "needs_clinician_review",
          "lastClinicianReview": null
        },
        "presentation": "In clinic, the founder reviews {patientName}'s outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, \"{patientName}, a 71-year-old man, is in the surgical ICU receiving CRRT after postoperative hemorrhage.\" All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.critical-renal-organ-support.circuit-anticoagulation.clinic.v1",
            "prototypeDemographics": {
              "ageYears": 71,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Dialysis circuit clotting",
            "presentation": "In clinic, the founder reviews {patientName}'s outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, \"{patientName}, a 71-year-old man, is in the surgical ICU receiving CRRT after postoperative hemorrhage.\" All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
          "Management of regional citrate anticoagulation for CRRT — Chinese emergency medical doctor consensus"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
            "questionVariantId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
            "primaryConceptId": "concept.critical-renal-organ-support.citrate-bleeding-circuit.v1",
            "stem": "During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. Which CRRT anticoagulation strategy should Owen Carter receive now?",
            "answerChoices": [
              {
                "id": "choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.citrate.v1",
                "label": "Use regional citrate anticoagulation",
                "isCorrect": true,
                "rationale": "The repeated circuit loss makes an unanticoagulated strategy problematic, while the bleeding course makes systemic heparin less attractive.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.heparin.v1",
                "label": "Use systemic unfractionated heparin",
                "isCorrect": false,
                "rationale": "Systemic heparin adds systemic anticoagulation during the current bleeding-risk course.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.none.v1",
                "label": "Continue anticoagulant-free CRRT",
                "isCorrect": false,
                "rationale": "This avoids anticoagulant exposure but has repeatedly lost circuits despite checked access.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Regional citrate can preserve circuit patency while limiting systemic anticoagulant exposure in this bleeding-risk course. Metabolic monitoring is required. The current choice depends on both hemorrhage risk and the observed failure of anticoagulant-free circuits.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Original constructed patient observations",
              "items": [
                {
                  "label": "Bleeding course",
                  "value": "Reoperation controlled a postoperative bleed. Drain output remains blood-stained and red-cell support was needed recently."
                },
                {
                  "label": "Circuit course",
                  "value": "Two anticoagulant-free circuits clotted early and interrupted treatment. Access flow and catheter position have been checked."
                },
                {
                  "label": "Current metabolism",
                  "value": "He is off vasopressors. Lactate is 1.3 mmol/L, bilirubin is 0.8 mg/dL and systemic ionized calcium is within the local reference range."
                }
              ]
            },
            "sourceLabels": [
              "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
              "Management of regional citrate anticoagulation for CRRT — Chinese emergency medical doctor consensus"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.heparin.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the observed course and the proposed support decision before continuing.",
                "clinicalRationale": "Systemic heparin adds systemic anticoagulation during the current bleeding-risk course.",
                "sourceLabels": [
                  "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
                  "Management of regional citrate anticoagulation for CRRT — Chinese emergency medical doctor consensus"
                ]
              },
              {
                "answerChoiceId": "choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.none.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the observed course and the proposed support decision before continuing.",
                "clinicalRationale": "This avoids anticoagulant exposure but has repeatedly lost circuits despite checked access.",
                "sourceLabels": [
                  "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
                  "Management of regional citrate anticoagulation for CRRT — Chinese emergency medical doctor consensus"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Regional citrate can preserve circuit patency while limiting systemic anticoagulant exposure in this bleeding-risk course. Metabolic monitoring is required. The current choice depends on both hemorrhage risk and the observed failure of anticoagulant-free circuits."
      },
      {
        "id": "case.topic.critical-renal-organ-support.kidney-recovery.v1",
        "displayName": "Kidney recovery review",
        "patientPresentationVariantId": "presentation.topic.critical-renal-organ-support.kidney-recovery.clinic.v1",
        "patientDisplayName": "Maya Reed",
        "prototypeDemographics": {
          "ageYears": 62,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Kidney recovery review",
        "patientPresentationRevision": {
          "id": "presentation-revision.topic.critical-renal-organ-support.kidney-recovery.clinic.v1",
          "patientPresentationVariantId": "presentation.topic.critical-renal-organ-support.kidney-recovery.clinic.v1",
          "contentVersion": "presentation-revision.critical-renal-organ-support.2026-11-11.clinic.v1",
          "revisedPresentation": "In clinic, the founder reviews {patientName}'s outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, \"{patientName}, a 62-year-old woman, is in the surgical ICU after source control and temporary CRRT for postoperative AKI.\" All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.",
          "revisedFields": [
            "presentation"
          ],
          "revisedProfilePresentations": [
            {
              "id": "revision.profile.topic.critical-renal-organ-support.kidney-recovery.clinic.v1",
              "approvedInstantiationProfileId": "profile.topic.critical-renal-organ-support.kidney-recovery.clinic.v1",
              "contentVersion": "presentation-revision.critical-renal-organ-support.2026-11-11.clinic.v1",
              "revisedPresentation": "In clinic, the founder reviews {patientName}'s outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, \"{patientName}, a 62-year-old woman, is in the surgical ICU after source control and temporary CRRT for postoperative AKI.\" All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.",
              "revisedFields": [
                "presentation"
              ],
              "aiAssistedDrafting": true,
              "reviewStatus": "needs_clinician_review",
              "lastClinicianReview": null
            }
          ],
          "revisedDecisionStems": [
            {
              "id": "revision.node.topic.critical-renal-organ-support.trial-off-crrt.v2",
              "decisionNodeId": "node.topic.critical-renal-organ-support.trial-off-crrt.v2",
              "questionVariantId": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
              "contentVersion": "presentation-revision.critical-renal-organ-support.2026-11-11.clinic.v1",
              "revisedStem": "During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. At this reassessment after CRRT interruption, which kidney-support plan should Maya Reed receive?",
              "aiAssistedDrafting": true,
              "reviewStatus": "needs_clinician_review",
              "lastClinicianReview": null
            }
          ],
          "aiAssistedDrafting": true,
          "reviewStatus": "needs_clinician_review",
          "lastClinicianReview": null
        },
        "presentation": "In clinic, the founder reviews {patientName}'s outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, \"{patientName}, a 62-year-old woman, is in the surgical ICU after source control and temporary CRRT for postoperative AKI.\" All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.critical-renal-organ-support.kidney-recovery.clinic.v1",
            "prototypeDemographics": {
              "ageYears": 62,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Kidney recovery review",
            "presentation": "In clinic, the founder reviews {patientName}'s outside hospital and ICU records at the referring hospital's request. The hospital presentation reads, \"{patientName}, a 62-year-old woman, is in the surgical ICU after source control and temporary CRRT for postoperative AKI.\" All observations and decisions refer to the recorded hospital course. The founder selects advice for the hospital team."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
          "The Japanese Clinical Practice Guideline for acute kidney injury 2016",
          "Acute kidney injury 2016: diagnosis and diagnostic workup"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.critical-renal-organ-support.trial-off-crrt.v2",
            "questionVariantId": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
            "primaryConceptId": "concept.critical-renal-organ-support.trial-off-crrt.v1",
            "stem": "During clinic chart review, the founder advises the referring hospital using its outside ICU records at the recorded decision point. At this reassessment after CRRT interruption, which kidney-support plan should Maya Reed receive?",
            "answerChoices": [
              {
                "id": "choice.topic.critical-renal-organ-support.trial-off-crrt.trial.v2",
                "label": "Continue the current trial off CRRT",
                "isCorrect": true,
                "rationale": "Spontaneous urine and the actual metabolic and volume course support a monitored trial despite residual dysfunction.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.critical-renal-organ-support.trial-off-crrt.restart.v2",
                "label": "Restart the previous CRRT prescription",
                "isCorrect": false,
                "rationale": "The on-treatment creatinine included extracorporeal removal. The observed interruption does not establish a support need requiring automatic restart.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.critical-renal-organ-support.trial-off-crrt.ihd.v2",
                "label": "Switch to intermittent hemodialysis",
                "isCorrect": false,
                "rationale": "Conversion still provides replacement when the current observations support assessing whether replacement is needed.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The actual interruption shows spontaneous urine production with current metabolic and volume control. Continue a monitored trial off treatment. The on-circuit creatinine reflected extracorporeal removal, so its rise needs interpretation alongside the observed support needs.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Original constructed patient observations",
              "items": [
                {
                  "label": "Urine course",
                  "value": "Urine output rose spontaneously to 1.6 L during the past day without diuretics. Net machine fluid removal was zero during the last shift."
                },
                {
                  "label": "Treatment course",
                  "value": "The circuit has been stopped for eight hours. Potassium changed from 4.3 to 4.5 mmol/L and arterial pH from 7.39 to 7.37."
                },
                {
                  "label": "Current balance",
                  "value": "Intake and urine losses remain close to matched. Breathing and blood pressure remain stable without new support."
                },
                {
                  "label": "Creatinine",
                  "value": "Creatinine rose from 1.1 mg/dL during treatment to 2.0 mg/dL during the interruption. Her pre-illness value was 0.8 mg/dL."
                },
                {
                  "label": "Ongoing care",
                  "value": "Chemistry, urine output, fluid balance, breathing and circulation continue to be monitored with each proposed support plan."
                }
              ]
            },
            "sourceLabels": [
              "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
              "The Japanese Clinical Practice Guideline for acute kidney injury 2016",
              "Acute kidney injury 2016: diagnosis and diagnostic workup"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.critical-renal-organ-support.trial-off-crrt.restart.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the observed course and the proposed support decision before continuing.",
                "clinicalRationale": "The on-treatment creatinine included extracorporeal removal. The observed interruption does not establish a support need requiring automatic restart.",
                "sourceLabels": [
                  "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
                  "The Japanese Clinical Practice Guideline for acute kidney injury 2016",
                  "Acute kidney injury 2016: diagnosis and diagnostic workup"
                ]
              },
              {
                "answerChoiceId": "choice.topic.critical-renal-organ-support.trial-off-crrt.ihd.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the observed course and the proposed support decision before continuing.",
                "clinicalRationale": "Conversion still provides replacement when the current observations support assessing whether replacement is needed.",
                "sourceLabels": [
                  "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
                  "The Japanese Clinical Practice Guideline for acute kidney injury 2016",
                  "Acute kidney injury 2016: diagnosis and diagnostic workup"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The actual interruption shows spontaneous urine production with current metabolic and volume control. Continue a monitored trial off treatment. The on-circuit creatinine reflected extracorporeal removal, so its rise needs interpretation alongside the observed support needs."
      }
    ]
  },
  "topic-batch1-critical-shock-resuscitation": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic draft archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.critical-shock-resuscitation.choose-valid-fluid-test.v1",
        "displayName": "Fluid assessment with irregular rhythm and spontaneous breaths",
        "learningObjective": "Select a flow-based preload test when rhythm and ventilation invalidate respiratory pulse-pressure variation.",
        "earliestFacilityStage": 4,
        "conceptType": "workup"
      },
      {
        "id": "concept.critical-shock-resuscitation.response-versus-fluid-risk.v1",
        "displayName": "Preload response with worsening fluid tolerance",
        "learningObjective": "Choose pressure support when a positive preload test coexists with major pulmonary fluid risk and persistent hypotension.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.critical-shock-resuscitation.echo-for-persistent-shock.v2",
        "displayName": "Next imaging after incomplete transthoracic acquisition",
        "learningObjective": "Interpret the limits of an acquired transthoracic examination and select the next structural cardiac assessment during persistent shock.",
        "earliestFacilityStage": 4,
        "conceptType": "workup"
      }
    ],
    "cases": [
      {
        "id": "case.critical-shock-resuscitation.fluid-assessment.v1",
        "displayName": "Low blood pressure",
        "patientPresentationVariantId": "presentation.critical-shock-resuscitation.fluid-assessment.v1",
        "patientDisplayName": "Morgan Ellis",
        "prototypeDemographics": {
          "ageYears": 56,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Low blood pressure",
        "presentation": "{patientName}, a 56-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after drainage of an abdominal infection. Hypotension persists after initial crystalloid.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.critical-shock-resuscitation.fluid-assessment.v1",
            "prototypeDemographics": {
              "ageYears": 56,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Low blood pressure",
            "presentation": "{patientName}, a 56-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after drainage of an abdominal infection. Hypotension persists after initial crystalloid."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Surviving Sepsis Campaign adult guidelines 2026",
          "ESICM circulatory shock and hemodynamic monitoring 2025",
          "Prediction of fluid responsiveness",
          "Japanese sepsis and septic shock clinical practice guideline 2024",
          "Echocardiography in shock management"
        ],
        "decisionNodes": [
          {
            "id": "node.critical-shock-resuscitation.choose-valid-fluid-test.v1",
            "questionVariantId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
            "primaryConceptId": "concept.critical-shock-resuscitation.choose-valid-fluid-test.v1",
            "stem": "Which bedside assessment should guide the decision about another fluid bolus for {patientName} at this stage?",
            "answerChoices": [
              {
                "id": "choice.critical-shock-resuscitation.choose-valid-fluid-test.waveform-variation.v1",
                "label": "Track pulse-pressure variation from the arterial waveform",
                "isCorrect": false,
                "rationale": "Both the irregular rhythm and spontaneous breaths disturb the cyclic relationship needed to interpret this displayed value. A large number does not establish fluid responsiveness under these conditions.",
                "serviceRequest": null
              },
              {
                "id": "choice.critical-shock-resuscitation.choose-valid-fluid-test.plr-flow.v1",
                "label": "Track stroke-volume change during passive leg raising",
                "isCorrect": true,
                "rationale": "A reversible change in preload can be assessed through direct flow measurement despite the represented breathing pattern and rhythm. The later treatment decision still requires assessment of perfusion need and fluid risk.",
                "serviceRequest": null
              },
              {
                "id": "choice.critical-shock-resuscitation.choose-valid-fluid-test.ivc-variation.v1",
                "label": "Track respiratory variation of inferior vena-caval diameter",
                "isCorrect": false,
                "rationale": "Inspiratory effort and other cardiopulmonary factors affect vena-caval variation. It is less dependable for this decision than a direct reversible flow-response test.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The waveform value is affected by both irregular beats and spontaneous respiratory effort. Measure the change in stroke volume during passive leg raising. This answers whether flow responds to preload under the actual acquisition conditions.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed chart observations",
              "items": [
                {
                  "label": "Circulation",
                  "value": "MAP 57 mm Hg after initial crystalloid. Capillary refill 5 seconds."
                },
                {
                  "label": "Rhythm",
                  "value": "Atrial fibrillation with variable R-R intervals."
                },
                {
                  "label": "Ventilation",
                  "value": "Pressure support with variable patient-triggered breaths."
                },
                {
                  "label": "Arterial waveform",
                  "value": "Displayed pulse-pressure variation 22%."
                }
              ]
            },
            "sourceLabels": [
              "Surviving Sepsis Campaign adult guidelines 2026",
              "ESICM circulatory shock and hemodynamic monitoring 2025",
              "Prediction of fluid responsiveness"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.critical-shock-resuscitation.response-versus-fluid-risk.v1",
            "questionVariantId": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
            "primaryConceptId": "concept.critical-shock-resuscitation.response-versus-fluid-risk.v1",
            "currentUpdate": "Norepinephrine has been started since the preceding ICU assessment.",
            "stem": "Which next resuscitation adjustment best fits {patientName}'s current pressure, flow response and respiratory course?",
            "answerChoices": [
              {
                "id": "choice.critical-shock-resuscitation.response-versus-fluid-risk.fluid-bolus.v1",
                "label": "Give a balanced-crystalloid bolus",
                "isCorrect": false,
                "rationale": "The flow response is genuine, but it does not establish that another bolus offers the best risk-benefit balance. Worsening oxygen needs and new diffuse lung findings after fluids argue against further empiric volume loading here.",
                "serviceRequest": null
              },
              {
                "id": "choice.critical-shock-resuscitation.response-versus-fluid-risk.start-dobutamine.v1",
                "label": "Start a dobutamine infusion",
                "isCorrect": false,
                "rationale": "The represented low pressure occurs with vigorous contraction and substantial measured output. There is no demonstrated low-output cardiac dysfunction to make an inotrope the preferred adjustment.",
                "serviceRequest": null
              },
              {
                "id": "choice.critical-shock-resuscitation.response-versus-fluid-risk.increase-norepinephrine.v1",
                "label": "Increase the norepinephrine infusion",
                "isCorrect": true,
                "rationale": "The low MAP needs pressure support while the large flow response is weighed against the deteriorating respiratory course. Norepinephrine titration addresses the current hypotension without another empiric fluid load.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The reversible flow rise shows preload responsiveness. The worsening respiratory course after fluid changes whether that response should be pursued with another bolus. Titrate norepinephrine for the current low pressure while reassessing the evolving physiology.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed chart observations",
              "items": [
                {
                  "label": "Pressure and perfusion",
                  "value": "MAP 55 mm Hg on norepinephrine. Capillary refill 5 seconds."
                },
                {
                  "label": "Reversible flow test",
                  "value": "Stroke volume 48 mL at baseline, 64 mL during passive leg raising and 49 mL after return to baseline position."
                },
                {
                  "label": "Respiratory course",
                  "value": "Oxygen requirement rose after the preceding fluid administration. Bilateral crackles and diffuse new B-lines are present."
                },
                {
                  "label": "Cardiac assessment",
                  "value": "Left ventricular contraction is vigorous. Measured cardiac output is 7.0 L/min."
                }
              ]
            },
            "sourceLabels": [
              "Surviving Sepsis Campaign adult guidelines 2026",
              "ESICM circulatory shock and hemodynamic monitoring 2025",
              "Japanese sepsis and septic shock clinical practice guideline 2024",
              "Prediction of fluid responsiveness",
              "Echocardiography in shock management"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.critical-shock-resuscitation.response-versus-fluid-risk.fluid-bolus.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the represented chart and treatment decision before continuing the teaching consultation.",
                "clinicalRationale": "The flow response is genuine, but it does not establish that another bolus offers the best risk-benefit balance. Worsening oxygen needs and new diffuse lung findings after fluids argue against further empiric volume loading here.",
                "sourceLabels": [
                  "Surviving Sepsis Campaign adult guidelines 2026",
                  "ESICM circulatory shock and hemodynamic monitoring 2025",
                  "Japanese sepsis and septic shock clinical practice guideline 2024",
                  "Prediction of fluid responsiveness",
                  "Echocardiography in shock management"
                ]
              },
              {
                "answerChoiceId": "choice.critical-shock-resuscitation.response-versus-fluid-risk.start-dobutamine.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the represented chart and treatment decision before continuing the teaching consultation.",
                "clinicalRationale": "The represented low pressure occurs with vigorous contraction and substantial measured output. There is no demonstrated low-output cardiac dysfunction to make an inotrope the preferred adjustment.",
                "sourceLabels": [
                  "Surviving Sepsis Campaign adult guidelines 2026",
                  "ESICM circulatory shock and hemodynamic monitoring 2025",
                  "Japanese sepsis and septic shock clinical practice guideline 2024",
                  "Prediction of fluid responsiveness",
                  "Echocardiography in shock management"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The waveform value is affected by both irregular beats and spontaneous respiratory effort. Measure the change in stroke volume during passive leg raising. This answers whether flow responds to preload under the actual acquisition conditions. The reversible flow rise shows preload responsiveness. The worsening respiratory course after fluid changes whether that response should be pursued with another bolus. Titrate norepinephrine for the current low pressure while reassessing the evolving physiology."
      },
      {
        "id": "case.critical-shock-resuscitation.reassess-shock-mechanism.v2",
        "displayName": "Persistent hypotension",
        "patientPresentationVariantId": "presentation.critical-shock-resuscitation.reassess-shock-mechanism.v2",
        "patientDisplayName": "Elena Park",
        "prototypeDemographics": {
          "ageYears": 54,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Persistent hypotension",
        "presentation": "{patientName}, a 54-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after laparoscopic sigmoid colectomy. Fever prompted empirical antibiotics, but hypotension has persisted during initial circulatory support.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.critical-shock-resuscitation.reassess-shock-mechanism.v2",
            "prototypeDemographics": {
              "ageYears": 54,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Persistent hypotension",
            "presentation": "{patientName}, a 54-year-old woman, is reviewed with the surgical ICU team during a clinic teaching consultation after laparoscopic sigmoid colectomy. Fever prompted empirical antibiotics, but hypotension has persisted during initial circulatory support."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ESICM circulatory shock and hemodynamic monitoring 2025",
          "Japanese sepsis and septic shock clinical practice guideline 2024",
          "Echocardiography in shock management",
          "TEE after limited transthoracic imaging in the cardiovascular ICU"
        ],
        "decisionNodes": [
          {
            "id": "node.critical-shock-resuscitation.echo-for-persistent-shock.v2",
            "questionVariantId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
            "primaryConceptId": "concept.critical-shock-resuscitation.echo-for-persistent-shock.v2",
            "stem": "Which investigation should {patientName}'s team obtain next to guide circulatory support after this echocardiographic examination?",
            "answerChoices": [
              {
                "id": "choice.critical-shock-resuscitation.echo-for-persistent-shock.contrast-tte.v2",
                "label": "Contrast-enhanced transthoracic echocardiography",
                "isCorrect": false,
                "rationale": "Contrast can improve endocardial-border definition in an acquired view. The current limitation is failed acoustic access to the structures needed for this shock assessment, beyond the already outlined left ventricle.",
                "serviceRequest": null
              },
              {
                "id": "choice.critical-shock-resuscitation.echo-for-persistent-shock.pa-catheter.v2",
                "label": "Pulmonary artery catheterization",
                "isCorrect": false,
                "rationale": "Additional pressure and flow data can help mixed shock, but they do not show the currently unexamined chambers and surrounding structures that might explain the filling problem.",
                "serviceRequest": null
              },
              {
                "id": "choice.critical-shock-resuscitation.echo-for-persistent-shock.tee.v2",
                "label": "Transesophageal echocardiography",
                "isCorrect": true,
                "rationale": "The represented transthoracic views leave important right-sided and surrounding structures unexamined. An alternative acoustic approach can address that structural uncertainty while support continues.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The acquired left-ventricular view supplies useful local information. The record does not establish the status of the other structures needed to explain this filling and pressure pattern. TEE supplies an alternative structural approach when those transthoracic windows cannot be acquired.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed chart observations",
              "items": [
                {
                  "label": "Current circulation",
                  "value": "MAP 54 mm Hg despite norepinephrine and initial crystalloid. CVP is 18 mm Hg. Stroke volume did not increase with the last monitored bolus."
                },
                {
                  "label": "Transthoracic acquisition log",
                  "value": "One subcostal view outlines the anterior left ventricle with preserved contraction. Parasternal and apical views cannot be acquired through the current dressings and intervening subcutaneous air."
                },
                {
                  "label": "Structures documented",
                  "value": "The right ventricular free wall, posterior cardiac contour and most of the pericardial space are outside the acquired views."
                },
                {
                  "label": "Current airway",
                  "value": "Mechanically ventilated after the abdominal operation."
                }
              ]
            },
            "sourceLabels": [
              "ESICM circulatory shock and hemodynamic monitoring 2025",
              "Japanese sepsis and septic shock clinical practice guideline 2024",
              "Echocardiography in shock management",
              "TEE after limited transthoracic imaging in the cardiovascular ICU"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.critical-shock-resuscitation.echo-for-persistent-shock.contrast-tte.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the represented chart and treatment decision before continuing the teaching consultation.",
                "clinicalRationale": "Contrast can improve endocardial-border definition in an acquired view. The current limitation is failed acoustic access to the structures needed for this shock assessment, beyond the already outlined left ventricle.",
                "sourceLabels": [
                  "ESICM circulatory shock and hemodynamic monitoring 2025",
                  "Japanese sepsis and septic shock clinical practice guideline 2024",
                  "Echocardiography in shock management",
                  "TEE after limited transthoracic imaging in the cardiovascular ICU"
                ]
              },
              {
                "answerChoiceId": "choice.critical-shock-resuscitation.echo-for-persistent-shock.pa-catheter.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the represented chart and treatment decision before continuing the teaching consultation.",
                "clinicalRationale": "Additional pressure and flow data can help mixed shock, but they do not show the currently unexamined chambers and surrounding structures that might explain the filling problem.",
                "sourceLabels": [
                  "ESICM circulatory shock and hemodynamic monitoring 2025",
                  "Japanese sepsis and septic shock clinical practice guideline 2024",
                  "Echocardiography in shock management",
                  "TEE after limited transthoracic imaging in the cardiovascular ICU"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The acquired left-ventricular view supplies useful local information. The record does not establish the status of the other structures needed to explain this filling and pressure pattern. TEE supplies an alternative structural approach when those transthoracic windows cannot be acquired."
      }
    ]
  },
  "topic-batch1-appendix-appendicitis": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic draft archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
        "displayName": "Treatment field for appendiceal mucinous peritoneal disease",
        "learningObjective": "Integrate cellular peritoneal pathology and disease distribution to choose the appropriate oncologic treatment service.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      },
      {
        "id": "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
        "displayName": "Resection after goblet cell adenocarcinoma",
        "learningObjective": "Reconcile a historical carcinoid label with definitive goblet cell adenocarcinoma pathology when selecting completion surgery.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      },
      {
        "id": "concept.appendix-appendicitis.large-net-regional-resection.v1",
        "displayName": "Regional surgery after a large appendiceal NET",
        "learningObjective": "Distinguish clear local margins from regional oncologic adequacy after staging a large appendiceal NET.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.topic.appendix-appendicitis.peritoneal-mucin.v2",
        "displayName": "Treatment field after discordant site-specific specimens",
        "patientPresentationVariantId": "presentation.topic.appendix-appendicitis.peritoneal-mucin.v2",
        "patientDisplayName": "Marcus Reed",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Pathology review",
        "presentation": "{patientName}, a 57-year-old man, attends the clinic after appendectomy and separate removal of two small nodules seen during the operation. The complete appendix specimen has a clear base margin and low-grade mucinous lining without infiltrative glands. The pelvic nodule contains fibrous tissue without mucinous epithelium. The separately labelled nodule from beneath the right diaphragm contains mucin with strips of low-grade mucinous epithelium. Postoperative staging shows no solid-organ lesions or residual bulky mass. He remains active without bowel obstruction.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.appendix-appendicitis.peritoneal-mucin.v2",
            "prototypeDemographics": {
              "ageYears": 57,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Pathology review",
            "presentation": "{patientName}, a 57-year-old man, attends the clinic after appendectomy and separate removal of two small nodules seen during the operation. The complete appendix specimen has a clear base margin and low-grade mucinous lining without infiltrative glands. The pelvic nodule contains fibrous tissue without mucinous epithelium. The separately labelled nodule from beneath the right diaphragm contains mucin with strips of low-grade mucinous epithelium. Postoperative staging shows no solid-organ lesions or residual bulky mass. He remains active without bowel obstruction."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
            "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
            "primaryConceptId": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
            "stem": "Which management pathway should be recommended for {patientName} after review of the separately labelled surgical specimens?",
            "answerChoices": [
              {
                "id": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.follow-up.v2",
                "label": "Multidisciplinary review for follow-up without resection",
                "isCorrect": false,
                "rationale": "Margin-negative noninfiltrative disease confined to an intact appendix could support this pathway. The separate diaphragmatic nodule contains mucinous epithelium, so the appendix margin and negative pelvic nodule cannot establish confinement.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.regional-resection.v2",
                "label": "Multidisciplinary review for right hemicolectomy and nodes",
                "isCorrect": false,
                "rationale": "The whole appendix does not show destructive glandular invasion requiring the localized adenocarcinoma nodal pathway. The demonstrated tumor is in a separate surface deposit; a regional colectomy does not by itself address that distribution.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.cytoreduction.v2",
                "label": "Multidisciplinary review for cytoreduction and intraperitoneal therapy",
                "isCorrect": true,
                "rationale": "Low-grade mucinous epithelium in the separately labelled diaphragmatic nodule demonstrates cellular disease outside the appendix. This requires experienced-center assessment for cytoreduction with or without intraperitoneal treatment. Histology, extent and operative feasibility determine the final plan; the biopsy does not guarantee eligibility.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The specimens represent different sites. A negative pelvic nodule and a clear appendiceal margin do not negate low-grade mucinous epithelium in the diaphragmatic nodule. That finding changes the disease field beyond the appendix. Experienced-center assessment for cytoreduction and possible intraperitoneal therapy is appropriate; this is not a promise of HIPEC or evidence that every deposit has been sampled. Regional colectomy is not a substitute for evaluating the demonstrated surface disease.",
            "sourceLabels": [
              "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.follow-up.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
                "clinicalRationale": "Margin-negative noninfiltrative disease confined to an intact appendix could support this pathway. The separate diaphragmatic nodule contains mucinous epithelium, so the appendix margin and negative pelvic nodule cannot establish confinement.",
                "sourceLabels": [
                  "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025"
                ]
              },
              {
                "answerChoiceId": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.regional-resection.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
                "clinicalRationale": "The whole appendix does not show destructive glandular invasion requiring the localized adenocarcinoma nodal pathway. The demonstrated tumor is in a separate surface deposit; a regional colectomy does not by itself address that distribution.",
                "sourceLabels": [
                  "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The specimens represent different sites. A negative pelvic nodule and a clear appendiceal margin do not negate low-grade mucinous epithelium in the diaphragmatic nodule. That finding changes the disease field beyond the appendix. Experienced-center assessment for cytoreduction and possible intraperitoneal therapy is appropriate; this is not a promise of HIPEC or evidence that every deposit has been sampled. Regional colectomy is not a substitute for evaluating the demonstrated surface disease."
      },
      {
        "id": "case.topic.appendix-appendicitis.goblet-cell-pathology.v1",
        "displayName": "Goblet cell appendiceal pathology",
        "patientPresentationVariantId": "presentation.topic.appendix-appendicitis.goblet-cell-pathology.v1",
        "patientDisplayName": "Elena Brooks",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Appendectomy pathology review",
        "presentation": "{patientName}, a 49-year-old woman, attends the clinic after appendectomy. The outside report called a 1.4-cm lesion a goblet cell carcinoid. Expert permanent review of the complete specimen describes infiltrative clusters of mucin-filled goblet cells in the appendiceal wall, with focal synaptophysin staining. The base margin is clear. CT shows no peritoneal or distant lesions, colonoscopy shows no separate colonic lesion, and she is fit for surgery.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.appendix-appendicitis.goblet-cell-pathology.v1",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Appendectomy pathology review",
            "presentation": "{patientName}, a 49-year-old woman, attends the clinic after appendectomy. The outside report called a 1.4-cm lesion a goblet cell carcinoid. Expert permanent review of the complete specimen describes infiltrative clusters of mucin-filled goblet cells in the appendiceal wall, with focal synaptophysin staining. The base margin is clear. CT shows no peritoneal or distant lesions, colonoscopy shows no separate colonic lesion, and she is fit for surgery."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
            "questionVariantId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
            "primaryConceptId": "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
            "stem": "Which further surgical plan should be recommended for {patientName}'s appendiceal tumor after expert pathology review?",
            "answerChoices": [
              {
                "id": "choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.completed-resection.v1",
                "label": "Complete surgical treatment with the appendectomy",
                "isCorrect": false,
                "rationale": "A small favorable well-differentiated NET can have a limited surgical field. Expert review has established infiltrative goblet cell adenocarcinoma, which follows the adenocarcinoma pathway.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.cecal-cuff.v1",
                "label": "Re-excise the appendiceal base with a cecal cuff",
                "isCorrect": false,
                "rationale": "The clear base margin already addresses local clearance. A cecal cuff would leave the regional nodal question created by the adenocarcinoma diagnosis unresolved.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.right-colectomy.v1",
                "label": "Perform right hemicolectomy with regional nodes",
                "isCorrect": true,
                "rationale": "The definitive infiltrative goblet cell adenocarcinoma diagnosis governs the plan. Current ASCRS guidance includes this tumor in the localized appendiceal adenocarcinoma recommendation for oncologic right colectomy.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The expert permanent diagnosis supersedes the historical carcinoid terminology. Goblet cell adenocarcinoma follows an adenocarcinoma treatment pathway despite focal neuroendocrine staining. With localized staging and fitness for surgery, oncologic right hemicolectomy addresses the regional nodes.",
            "sourceLabels": [
              "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.completed-resection.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
                "clinicalRationale": "A small favorable well-differentiated NET can have a limited surgical field. Expert review has established infiltrative goblet cell adenocarcinoma, which follows the adenocarcinoma pathway.",
                "sourceLabels": [
                  "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025"
                ]
              },
              {
                "answerChoiceId": "choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.cecal-cuff.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
                "clinicalRationale": "The clear base margin already addresses local clearance. A cecal cuff would leave the regional nodal question created by the adenocarcinoma diagnosis unresolved.",
                "sourceLabels": [
                  "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The expert permanent diagnosis supersedes the historical carcinoid terminology. Goblet cell adenocarcinoma follows an adenocarcinoma treatment pathway despite focal neuroendocrine staining. With localized staging and fitness for surgery, oncologic right hemicolectomy addresses the regional nodes."
      },
      {
        "id": "case.topic.appendix-appendicitis.net-staging.v2",
        "displayName": "Regional planning after acquired liver lesion characterization",
        "patientPresentationVariantId": "presentation.topic.appendix-appendicitis.net-staging.v2",
        "patientDisplayName": "Isaac Palmer",
        "prototypeDemographics": {
          "ageYears": 41,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Appendiceal tumor review",
        "presentation": "{patientName}, a 41-year-old man, attends the clinic after appendectomy found a neuroendocrine tumor. The initial staging CT described two liver lesions as indeterminate on the acquired phases. He returns with the complete appendix pathology and the subsequent dedicated liver study for management planning.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.appendix-appendicitis.net-staging.v2",
            "prototypeDemographics": {
              "ageYears": 41,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Appendiceal tumor review",
            "presentation": "{patientName}, a 41-year-old man, attends the clinic after appendectomy found a neuroendocrine tumor. The initial staging CT described two liver lesions as indeterminate on the acquired phases. He returns with the complete appendix pathology and the subsequent dedicated liver study for management planning."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
          "MRI morphology of simple hepatic cysts (Chenin et al., 2022)"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.appendix-appendicitis.net-regional-resection.v2",
            "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
            "primaryConceptId": "concept.appendix-appendicitis.large-net-regional-resection.v1",
            "currentUpdate": "Dedicated liver MRI obtained after the staging CT resolves both previously indeterminate lesions. Each has uniform low T1 and high T2 signal, a smooth thin wall, and no mural nodule or enhancement on the acquired precontrast and postcontrast series. The remainder of liver MRI and chest, abdominal and pelvic staging shows no additional lesions. The whole appendix specimen contains a 2.6-cm well-differentiated grade-1 neuroendocrine tumor with a clear base margin; the mesoappendix was removed. {patientName} has recovered and remains fit for surgery.",
            "stem": "Which next management plan should be recommended for {patientName}'s appendiceal tumor after these acquired staging results?",
            "answerChoices": [
              {
                "id": "choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v2",
                "label": "Finish resection with appendectomy and follow-up",
                "isCorrect": false,
                "rationale": "The liver findings have benign cyst morphology, but the completely measured primary is larger than the guideline boundary for appendix-only treatment. A clear base does not address regional nodal risk.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.appendix-appendicitis.net-regional-resection.right-colectomy.v2",
                "label": "Proceed with right hemicolectomy and regional nodes",
                "isCorrect": true,
                "rationale": "The acquired MRI observations characterize the represented liver lesions as simple cysts rather than leaving them indeterminate for staging. In this fit patient, the whole-specimen tumor size supports regional resection despite a clear appendectomy margin.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2",
                "label": "Obtain liver core biopsy before further resection",
                "isCorrect": false,
                "rationale": "These are resolved fluid-signal, nonenhancing lesions without internal solid tissue on adequate MRI, not persistent indeterminate targets. Biopsy would add an unsupported staging step. This conclusion comes from morphology, not a negative receptor scan.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The earlier CT uncertainty must be updated using the actual MRI: simple fluid signal, a thin wall and no enhancing internal tissue characterize the represented lesions as cysts. This is different from inferring cysts from absent receptor uptake. The whole-specimen primary exceeds the directly sourced greater-than-2-cm NET boundary, so regional nodal resection remains indicated despite a clear base margin. A smaller favorable tumor or unresolved liver staging would change this decision.",
            "sourceLabels": [
              "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
              "MRI morphology of simple hepatic cysts (Chenin et al., 2022)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
                "clinicalRationale": "The liver findings have benign cyst morphology, but the completely measured primary is larger than the guideline boundary for appendix-only treatment. A clear base does not address regional nodal risk.",
                "sourceLabels": [
                  "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
                  "MRI morphology of simple hepatic cysts (Chenin et al., 2022)"
                ]
              },
              {
                "answerChoiceId": "choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
                "clinicalRationale": "These are resolved fluid-signal, nonenhancing lesions without internal solid tissue on adequate MRI, not persistent indeterminate targets. Biopsy would add an unsupported staging step. This conclusion comes from morphology, not a negative receptor scan.",
                "sourceLabels": [
                  "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
                  "MRI morphology of simple hepatic cysts (Chenin et al., 2022)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The earlier CT uncertainty must be updated using the actual MRI: simple fluid signal, a thin wall and no enhancing internal tissue characterize the represented lesions as cysts. This is different from inferring cysts from absent receptor uptake. The whole-specimen primary exceeds the directly sourced greater-than-2-cm NET boundary, so regional nodal resection remains indicated despite a clear base margin. A smaller favorable tumor or unresolved liver staging would change this decision."
      }
    ]
  },
  "topic-batch1-trauma-initial-abdomen": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic draft archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
        "displayName": "Choose monitored assessment after nonspecific bowel/mesenteric CT findings.",
        "learningObjective": "Choose monitored assessment after nonspecific bowel/mesenteric CT findings.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
        "displayName": "Choose bowel-directed reassessment when suspicion evolves after equivocal CT.",
        "learningObjective": "Choose bowel-directed reassessment when suspicion evolves after equivocal CT.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
        "displayName": "Recognize persistent nonarterial pelvic bleeding after completed arterial treatment.",
        "learningObjective": "Recognize persistent nonarterial pelvic bleeding after completed arterial treatment.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
        "displayName": "Use a newly demonstrated arterial target after packing to choose repeat targeted control.",
        "learningObjective": "Use a newly demonstrated arterial target after packing to choose repeat targeted control.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
        "displayName": "Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT.",
        "learningObjective": "Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
        "displayName": "Complicated extraperitoneal bladder repair",
        "learningObjective": "Choose repair rather than a routine catheter pathway for an extraperitoneal bladder injury with an intravesical bone fragment.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
        "displayName": "Use duct disruption and injury location to select an operative pancreatic strategy.",
        "learningObjective": "Use duct disruption and injury location to select an operative pancreatic strategy.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
        "displayName": "Avoid renal exploration based on systemic instability when a contained hematoma is not the active source.",
        "learningObjective": "Avoid renal exploration based on systemic instability when a contained hematoma is not the active source.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
        "displayName": "Mesenteric devascularization and bowel reconstruction",
        "learningObjective": "Choose the extent and reconstruction timing for a small wall defect with segmental mesenteric devascularization.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
        "displayName": "Clinic chart review: Caleb Mercer",
        "patientPresentationVariantId": "presentation.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
        "patientDisplayName": "Caleb Mercer",
        "prototypeDemographics": {
          "ageYears": 55,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Trauma follow-up",
        "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
            "prototypeDemographics": {
              "ageYears": 55,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Trauma follow-up",
            "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
          "Liver trauma: WSES 2020 guidelines",
          "Hepatic Injury, Blunt, Selective Nonoperative Management of",
          "Splenic Injury, Blunt, Selective Nonoperative Management of",
          "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
            "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
            "stem": "Which care setting and assessment plan should be used for {patientName} after this CT?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.belt-equivocal-observation.observe",
                "label": "Inpatient observation with serial abdominal examinations",
                "isCorrect": true,
                "rationale": "Restraint-pattern trauma with unexplained fluid and mesenteric change remains concerning despite no direct perforation sign. Serial assessment is needed.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.belt-equivocal-observation.discharge",
                "label": "Discharge with outpatient abdominal reassessment",
                "isCorrect": false,
                "rationale": "No free air does not resolve these abnormalities; outpatient follow-up can miss evolving bowel injury.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.belt-equivocal-observation.explore",
                "label": "Operative exploration with bowel assessment",
                "isCorrect": false,
                "rationale": "These changes are nonspecific and the examination has no peritoneal findings; they do not establish an immediate operative indication.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Restraint-pattern trauma with unexplained fluid and mesenteric change remains concerning despite no direct perforation sign. Serial assessment is needed.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed trauma record; fictional observations",
              "items": [
                {
                  "label": "CT",
                  "value": "IV-contrast scan: small interloop/pelvic fluid, focal mesenteric stranding; no solid-organ injury, wall defect or extraluminal air"
                },
                {
                  "label": "Examination",
                  "value": "Localized lower abdominal tenderness; no guarding or rebound"
                },
                {
                  "label": "Circulation",
                  "value": "BP 126/74 mmHg; pulse 92/min; no support requirement"
                }
              ]
            },
            "sourceLabels": [
              "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
              "Liver trauma: WSES 2020 guidelines",
              "Hepatic Injury, Blunt, Selective Nonoperative Management of",
              "Splenic Injury, Blunt, Selective Nonoperative Management of"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
            "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
            "currentUpdate": "The outside record documents IV-contrast CT six hours earlier: small interloop fluid and focal mesenteric stranding, with no solid-organ injury, wall defect or extraluminal air. During serial assessment, lower abdominal pain persists and tenderness increases. The abdomen remains soft without involuntary guarding or rebound. BP is 122/72 mmHg without support; pulse has increased from 92 to 110/min.",
            "stem": "At this hospital reassessment, which next management plan should be recommended for {patientName}?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct",
                "label": "Repeat contrast-enhanced abdominal and pelvic CT",
                "isCorrect": true,
                "rationale": "The interval course increases concern after an equivocal study while current physiology and examination still permit noninvasive characterization. Repeat CT is supported at this reassessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.observe",
                "label": "Continue inpatient serial abdominal examinations",
                "isCorrect": false,
                "rationale": "Serial examinations were appropriate initially, but the documented interval increase in tenderness after an equivocal scan supports adding repeat imaging rather than leaving the plan unchanged.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.explore",
                "label": "Proceed to operative abdominal exploration",
                "isCorrect": false,
                "rationale": "The patient remains stable without peritoneal findings or a direct wall-injury sign in the available record. The increasing suspicion warrants reassessment, but does not yet establish the direct injury evidence that would favor immediate operative control.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The interval course increases concern after an equivocal study while current physiology and examination still permit noninvasive characterization. Repeat CT is supported at this reassessment.",
            "sourceLabels": [
              "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
              "Liver trauma: WSES 2020 guidelines",
              "Hepatic Injury, Blunt, Selective Nonoperative Management of",
              "Splenic Injury, Blunt, Selective Nonoperative Management of",
              "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.observe",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "Serial examinations were appropriate initially, but the documented interval increase in tenderness after an equivocal scan supports adding repeat imaging rather than leaving the plan unchanged.",
                "sourceLabels": [
                  "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment"
                ]
              },
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.explore",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "The patient remains stable without peritoneal findings or a direct wall-injury sign in the available record. The increasing suspicion warrants reassessment, but does not yet establish the direct injury evidence that would favor immediate operative control.",
                "sourceLabels": [
                  "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
                  "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
                  "Hepatic Injury, Blunt, Selective Nonoperative Management of"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Restraint-pattern trauma with unexplained fluid and mesenteric change remains concerning despite no direct perforation sign. Serial assessment is needed. The interval course increases concern after an equivocal study while current physiology and examination still permit noninvasive characterization. Repeat CT is supported at this reassessment."
      },
      {
        "id": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
        "displayName": "Clinic chart review: Dylan Shaw",
        "patientPresentationVariantId": "presentation.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
        "patientDisplayName": "Dylan Shaw",
        "prototypeDemographics": {
          "ageYears": 48,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Trauma follow-up",
        "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 48-year-old man treated after pelvic crush injury.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
            "prototypeDemographics": {
              "ageYears": 48,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Trauma follow-up",
            "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 48-year-old man treated after pelvic crush injury."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Pelvic trauma: WSES classification and guidelines",
          "Liver trauma: WSES 2020 guidelines",
          "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
          "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
          "Hepatic Injury, Blunt, Selective Nonoperative Management of"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
            "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
            "stem": "Which procedure should next address {patientName}'s continuing pelvic hemorrhage?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.packing",
                "label": "Preperitoneal pelvic packing",
                "isCorrect": true,
                "rationale": "Persistent bleeding despite stabilization and completed arterial treatment can come from venous or bony sources. Packing addresses the residual compartment.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize",
                "label": "Repeat pelvic arterial embolization",
                "isCorrect": false,
                "rationale": "The completion survey shows no residual target while shock continues. Assuming another artery leaves nonarterial bleeding untreated.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy",
                "label": "Intraperitoneal abdominal exploration",
                "isCorrect": false,
                "rationale": "The known collection is retroperitoneal and the completed assessment shows no intraperitoneal operative source.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Persistent bleeding despite stabilization and completed arterial treatment can come from venous or bony sources. Packing addresses the residual compartment.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed trauma record; fictional observations",
              "items": [
                {
                  "label": "Earlier CT",
                  "value": "During initial stabilization: large pelvic retroperitoneal hematoma; no intraperitoneal injury"
                },
                {
                  "label": "Treatment",
                  "value": "Binder and temporary stabilization maintained; internal iliac arterial focus embolized"
                },
                {
                  "label": "Completion",
                  "value": "Selective pelvic arterial runs show no further extravasation"
                },
                {
                  "label": "Current state",
                  "value": "BP 82/48 mmHg during blood administration; repeat FAST without intraperitoneal fluid; no external or thoracic source identified"
                }
              ]
            },
            "sourceLabels": [
              "Pelvic trauma: WSES classification and guidelines",
              "Liver trauma: WSES 2020 guidelines",
              "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
              "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
              "Hepatic Injury, Blunt, Selective Nonoperative Management of"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
            "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
            "currentUpdate": "After packing, circulation initially improves. Hemoglobin later falls and blood requirements resume. BP remains 112/66 mmHg during support. New multiphase CT is obtained.",
            "stem": "Which procedure should address {patientName}'s current pelvic bleeding?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.embolize",
                "label": "Pelvic angiography with embolization",
                "isCorrect": true,
                "rationale": "An expanding arterial-connected focus identifies recurrent or residual arterial bleeding after packing. Sustained circulation permits targeted angiographic control.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.repack",
                "label": "Repeat preperitoneal pelvic packing",
                "isCorrect": false,
                "rationale": "Repacking can treat nonarterial bleeding, but the new study localizes an arterial target not controlled by packing.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy",
                "label": "Proceed to intraperitoneal abdominal exploration",
                "isCorrect": false,
                "rationale": "The current source is a pelvic artery with no new intraperitoneal injury. A different compartment is not the targeted response.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "An expanding arterial-connected focus identifies recurrent or residual arterial bleeding after packing. Sustained circulation permits targeted angiographic control.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed trauma record; fictional observations",
              "items": [
                {
                  "label": "CT",
                  "value": "A focal pool communicates with a pelvic arterial branch and expands on venous images; packing remains positioned; no new intraperitoneal abnormality"
                }
              ]
            },
            "sourceLabels": [
              "Pelvic trauma: WSES classification and guidelines",
              "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
              "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
              "Hepatic Injury, Blunt, Selective Nonoperative Management of",
              "Liver trauma: WSES 2020 guidelines"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.repack",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "Repacking can treat nonarterial bleeding, but the new study localizes an arterial target not controlled by packing.",
                "sourceLabels": [
                  "Pelvic trauma: WSES classification and guidelines"
                ]
              },
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "The current source is a pelvic artery with no new intraperitoneal injury. A different compartment is not the targeted response.",
                "sourceLabels": [
                  "Pelvic trauma: WSES classification and guidelines",
                  "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
                  "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
                  "Hepatic Injury, Blunt, Selective Nonoperative Management of"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Persistent bleeding despite stabilization and completed arterial treatment can come from venous or bony sources. Packing addresses the residual compartment. An expanding arterial-connected focus identifies recurrent or residual arterial bleeding after packing. Sustained circulation permits targeted angiographic control."
      },
      {
        "id": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
        "displayName": "Clinic chart review: Ethan Cole",
        "patientPresentationVariantId": "presentation.topic.trauma-initial-abdomen.bladder-protocol-and-repair.clinic-review.v2",
        "patientDisplayName": "Ethan Cole",
        "prototypeDemographics": {
          "ageYears": 37,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Trauma follow-up",
        "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.trauma-initial-abdomen.bladder-protocol-and-repair.clinic-review.v2",
            "prototypeDemographics": {
              "ageYears": 37,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Trauma follow-up",
            "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Kidney and uro-trauma: WSES-AAST guidelines",
          "Blunt Force Bladder Injuries Management of"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
            "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
            "stem": "At this hospital decision point, which imaging protocol should be recommended for {patientName}'s ongoing gross hematuria?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram",
                "label": "Retrograde CT cystography with bladder distension",
                "isCorrect": true,
                "rationale": "Gross hematuria after pelvic trauma raises a bladder-injury concern. The acquired images show a minimally filled bladder, so excreted contrast has not provided an adequate cystographic evaluation.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory",
                "label": "Delayed excretory-phase abdominal and pelvic CT",
                "isCorrect": false,
                "rationale": "More renal excretion does not substitute for a distended cystographic assessment of the bladder; the already opacified upper tracts address a different target.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.urethrogram",
                "label": "Retrograde urethrography with contrast radiography",
                "isCorrect": false,
                "rationale": "A urethrogram investigates suspected urethral injury. The current gross-hematuria/pelvic-injury question still needs bladder evaluation through established access. Easy catheter passage and absent initial meatal blood do not prove that every urethral injury is excluded.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Gross hematuria after pelvic trauma raises a bladder-injury concern. The acquired images show a minimally filled bladder, so excreted contrast has not provided an adequate cystographic evaluation.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-hospital record; fictional observations",
              "items": [
                {
                  "label": "Clinical record",
                  "value": "Pelvic fracture; circulation stable after hemorrhage control; gross hematuria continues through the existing catheter."
                },
                {
                  "label": "Acquired imaging and administration log",
                  "value": "All acquired series belong to an IV-contrast abdominal/pelvic CT protocol. Excreted contrast opacifies the upper tracts without a leak; bladder walls remain apposed around a thin layer of contrast next to the catheter."
                },
                {
                  "label": "Catheter record",
                  "value": "No meatal blood was seen before insertion; the catheter passed without resistance and drains urine."
                }
              ]
            },
            "sourceLabels": [
              "Kidney and uro-trauma: WSES-AAST guidelines",
              "Blunt Force Bladder Injuries Management of"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
            "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
            "currentUpdate": "At the outside hospital, hemorrhage control is complete and the catheter drains urine. BP remains 120/74 mmHg without new blood or vasopressor support; the abdomen has focal suprapubic tenderness without diffuse guarding. Retrograde CT cystography and cystoscopic inspection are obtained.",
            "stem": "At this documented treatment decision, which bladder plan should be recommended for {patientName}?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.repair",
                "label": "Primary bladder repair with urethral catheter drainage",
                "isCorrect": true,
                "rationale": "The distribution is extraperitoneal, but bone protruding through the bladder wall makes this more than an uncomplicated leak. Repair addresses the injury rather than relying on catheter drainage to heal around the persistent bony lesion.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.urethral",
                "label": "Bladder drainage by urethral catheter with cystographic reassessment",
                "isCorrect": false,
                "rationale": "This is a supported pathway for an uncomplicated extraperitoneal rupture. The projected bone fragment is the important exception; preserved catheter flow does not remove it.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.suprapubic",
                "label": "Bladder drainage by suprapubic catheter with cystographic reassessment",
                "isCorrect": false,
                "rationale": "Changing the drainage route does not address the bony lesion through the bladder wall. A suprapubic catheter can provide drainage in selected nonoperative injuries, but it is not a substitute for repair of this complexity.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The distribution is extraperitoneal, but bone protruding through the bladder wall makes this more than an uncomplicated leak. Repair addresses the injury rather than relying on catheter drainage to heal around the persistent bony lesion.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-hospital record; fictional observations",
              "items": [
                {
                  "label": "Cystogram",
                  "value": "Leaked contrast remains in tissue between the bladder and pubic symphysis and tracks beside the bladder. It does not outline bowel loops above the pelvis."
                },
                {
                  "label": "Inspection",
                  "value": "A pointed fragment continuous with the fractured pubic bone projects through the anterior bladder wall into the lumen. The bladder neck and ureteral orifices are intact."
                }
              ]
            },
            "sourceLabels": [
              "Blunt Force Bladder Injuries Management of",
              "Kidney and uro-trauma: WSES-AAST guidelines"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.urethral",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "This is a supported pathway for an uncomplicated extraperitoneal rupture. The projected bone fragment is the important exception; preserved catheter flow does not remove it.",
                "sourceLabels": [
                  "Blunt Force Bladder Injuries Management of",
                  "Kidney and uro-trauma: WSES-AAST guidelines"
                ]
              },
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.suprapubic",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "Changing the drainage route does not address the bony lesion through the bladder wall. A suprapubic catheter can provide drainage in selected nonoperative injuries, but it is not a substitute for repair of this complexity.",
                "sourceLabels": [
                  "Blunt Force Bladder Injuries Management of",
                  "Kidney and uro-trauma: WSES-AAST guidelines"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Gross hematuria after pelvic trauma raises a bladder-injury concern. The acquired images show a minimally filled bladder, so excreted contrast has not provided an adequate cystographic evaluation. The distribution is extraperitoneal, but bone protruding through the bladder wall makes this more than an uncomplicated leak. Repair addresses the injury rather than relying on catheter drainage to heal around the persistent bony lesion."
      },
      {
        "id": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
        "displayName": "Clinic chart review: Miles Warren",
        "patientPresentationVariantId": "presentation.topic.trauma-initial-abdomen.pancreatic-duct-location.clinic-review.v2",
        "patientDisplayName": "Miles Warren",
        "prototypeDemographics": {
          "ageYears": 40,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Trauma follow-up",
        "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 40-year-old man undergoing laparotomy after blunt abdominal compression. Associated bleeding has been controlled.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.trauma-initial-abdomen.pancreatic-duct-location.clinic-review.v2",
            "prototypeDemographics": {
              "ageYears": 40,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Trauma follow-up",
            "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 40-year-old man undergoing laparotomy after blunt abdominal compression. Associated bleeding has been controlled."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
          "Pancreatic Injuries"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
            "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
            "stem": "Which pancreatic procedure should be selected for {patientName} at this operation?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.distal",
                "label": "Distal pancreatectomy",
                "isCorrect": true,
                "rationale": "Transection left of the mesenteric vessels involving the main duct is a distal duct-disrupting injury. Guidelines support distal resection rather than treating it as a duct-intact contusion.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.drain",
                "label": "External peripancreatic drainage",
                "isCorrect": false,
                "rationale": "Drainage can treat selected minor duct-intact injuries but leaves the disrupted distal duct source untreated in this complete transection.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.reconstruct",
                "label": "Roux-en-Y pancreaticojejunostomy",
                "isCorrect": false,
                "rationale": "Reconstructive preservation may be considered in selected proximal injuries; it is not the routine preferred approach for this distal complete transection.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Transection left of the mesenteric vessels involving the main duct is a distal duct-disrupting injury. Guidelines support distal resection rather than treating it as a duct-intact contusion.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed trauma record; fictional observations",
              "items": [
                {
                  "label": "Operative findings",
                  "value": "Body completely transected left of superior mesenteric vessels; main duct visibly divided; tissue toward the splenic hilum remains perfused; head and ampulla intact"
                },
                {
                  "label": "Physiology",
                  "value": "After associated injury control: temperature 36.7 C; pH 7.36; no ongoing vasopressor requirement"
                }
              ]
            },
            "sourceLabels": [
              "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
              "Pancreatic Injuries"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.drain",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "Drainage can treat selected minor duct-intact injuries but leaves the disrupted distal duct source untreated in this complete transection.",
                "sourceLabels": [
                  "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
                  "Pancreatic Injuries"
                ]
              },
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.reconstruct",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "Reconstructive preservation may be considered in selected proximal injuries; it is not the routine preferred approach for this distal complete transection.",
                "sourceLabels": [
                  "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
                  "Pancreatic Injuries"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Transection left of the mesenteric vessels involving the main duct is a distal duct-disrupting injury. Guidelines support distal resection rather than treating it as a duct-intact contusion."
      },
      {
        "id": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
        "displayName": "Clinic chart review: Noah Reed",
        "patientPresentationVariantId": "presentation.topic.trauma-initial-abdomen.contained-renal-compartment.clinic-review.v2",
        "patientDisplayName": "Noah Reed",
        "prototypeDemographics": {
          "ageYears": 52,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Trauma follow-up",
        "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 52-year-old man undergoing laparotomy after blunt abdominal injury.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.trauma-initial-abdomen.contained-renal-compartment.clinic-review.v2",
            "prototypeDemographics": {
              "ageYears": 52,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Trauma follow-up",
            "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 52-year-old man undergoing laparotomy after blunt abdominal injury."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
            "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
            "stem": "What renal surgical action should be taken for {patientName} during this exploration?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.leave",
                "label": "Leave Gerota fascia and kidney undisturbed",
                "isCorrect": true,
                "rationale": "This renal hematoma remains contained and nonexpanding while a separate injury accounts for active bleeding. Instability alone does not require opening a stable zone-II hematoma.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.repair",
                "label": "Open Gerota fascia and repair the kidney",
                "isCorrect": false,
                "rationale": "An unchanged contained hematoma with a separate active source does not establish a need for renal exploration. Expansion or demonstrable renal hemorrhage would change that assessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.nephrectomy",
                "label": "Open Gerota fascia and remove the kidney",
                "isCorrect": false,
                "rationale": "Automatic nephrectomy is not supported by an unchanged hematoma with a separate active source; even required intervention may permit preservation.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "This renal hematoma remains contained and nonexpanding while a separate injury accounts for active bleeding. Instability alone does not require opening a stable zone-II hematoma.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed trauma record; fictional observations",
              "items": [
                {
                  "label": "Operative record",
                  "value": "Emergency laparotomy for abdominal bleeding; active mesenteric bleeding identified; BP remains low during blood resuscitation"
                },
                {
                  "label": "Renal compartment",
                  "value": "Lateral perirenal hematoma stays the same size during exposure; no pulsation, free rupture or progressive expansion"
                }
              ]
            },
            "sourceLabels": [
              "Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.repair",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "An unchanged contained hematoma with a separate active source does not establish a need for renal exploration. Expansion or demonstrable renal hemorrhage would change that assessment.",
                "sourceLabels": [
                  "Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma"
                ]
              },
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.nephrectomy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "Automatic nephrectomy is not supported by an unchanged hematoma with a separate active source; even required intervention may permit preservation.",
                "sourceLabels": [
                  "Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma"
                ]
              }
            ]
          }
        ],
        "learningSummary": "This renal hematoma remains contained and nonexpanding while a separate injury accounts for active bleeding. Instability alone does not require opening a stable zone-II hematoma."
      },
      {
        "id": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
        "displayName": "Clinic chart review: Elena Brooks",
        "patientPresentationVariantId": "presentation.topic.trauma-initial-abdomen.limited-jejunum-defect.clinic-review.v2",
        "patientDisplayName": "Elena Brooks",
        "prototypeDemographics": {
          "ageYears": 28,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Trauma follow-up",
        "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 28-year-old woman undergoing laparotomy after a penetrating abdominal wound. A complete bowel examination identifies one jejunal injury.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.trauma-initial-abdomen.limited-jejunum-defect.clinic-review.v2",
            "prototypeDemographics": {
              "ageYears": 28,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Trauma follow-up",
            "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 28-year-old woman undergoing laparotomy after a penetrating abdominal wound. A complete bowel examination identifies one jejunal injury."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
          "The open abdomen in trauma and non-trauma patients: WSES guidelines",
          "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
            "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
            "primaryConceptId": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
            "stem": "At the documented laparotomy, which bowel plan should be recommended for {patientName}'s jejunal injury?",
            "answerChoices": [
              {
                "id": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.resect",
                "label": "Jejunal resection with immediate anastomosis",
                "isCorrect": true,
                "rationale": "The small wall opening understates the injury: the separated mesentery and nonrecovering segment require resection. Healthy adjacent bowel and restored physiology support reconstruction rather than leaving a staged discontinuity in this record.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.repair",
                "label": "Jejunal repair with direct suture closure",
                "isCorrect": false,
                "rationale": "Suture closure would address the visible opening but leave the segment whose perfusion has not recovered after mesenteric separation.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.defer",
                "label": "Jejunal resection with deferred reconstruction",
                "isCorrect": false,
                "rationale": "Staged reconstruction can be appropriate when physiology, perfusion or ongoing control tasks remain unresolved. The current healthy margins and restored course support completing continuity rather than defaulting to discontinuity.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The small wall opening understates the injury: the separated mesentery and nonrecovering segment require resection. Healthy adjacent bowel and restored physiology support reconstruction rather than leaving a staged discontinuity in this record.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside-hospital record; fictional observations",
              "items": [
                {
                  "label": "Bowel examination",
                  "value": "The antimesenteric opening involves about one fifth of the circumference. Across the adjacent segment, mesentery is torn away from the bowel. That segment remains grey and noncontractile after nearby bowel becomes pink with warming; its cut margins do not bleed. Bowel beyond both ends is pink with visible mesenteric pulsation."
                },
                {
                  "label": "Current physiology",
                  "value": "Bleeding is controlled; BP 124/72 mmHg, temperature 36.8 C and pH 7.36. There is no further blood or vasopressor requirement, marked bowel edema or diffuse soilage."
                }
              ]
            },
            "sourceLabels": [
              "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
              "The open abdomen in trauma and non-trauma patients: WSES guidelines",
              "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.repair",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "Suture closure would address the visible opening but leave the segment whose perfusion has not recovered after mesenteric separation.",
                "sourceLabels": [
                  "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment"
                ]
              },
              {
                "answerChoiceId": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.defer",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
                "clinicalRationale": "Staged reconstruction can be appropriate when physiology, perfusion or ongoing control tasks remain unresolved. The current healthy margins and restored course support completing continuity rather than defaulting to discontinuity.",
                "sourceLabels": [
                  "The open abdomen in trauma and non-trauma patients: WSES guidelines",
                  "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
                  "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The small wall opening understates the injury: the separated mesentery and nonrecovering segment require resection. Healthy adjacent bowel and restored physiology support reconstruction rather than leaving a staged discontinuity in this record."
      }
    ]
  },
  "topic-batch1-critical-respiratory-ventilation": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic unapproved topic draft archive, not clinically approved. Melissa Rowland is clinical sign-off.",
    "concepts": [
      {
        "id": "concept.critical-respiratory-ventilation.expiratory-time.v1",
        "displayName": "Reduce breath frequency when incomplete exhalation causes intrinsic PEEP during severe obstructive ventilation.",
        "learningObjective": "Reduce breath frequency when incomplete exhalation causes intrinsic PEEP during severe obstructive ventilation.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.critical-respiratory-ventilation.postextubation-rescue.v1",
        "displayName": "Avoid delaying reintubation with rescue NIV for established post-extubation failure in a non-COPD medical patient.",
        "learningObjective": "Avoid delaying reintubation with rescue NIV for established post-extubation failure in a non-COPD medical patient.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.topic.critical-respiratory-ventilation.air-trapping.v1",
        "displayName": "Mark Price: outside-record review",
        "patientPresentationVariantId": "presentation.topic.critical-respiratory-ventilation.air-trapping.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Mark Price",
        "prototypeDemographics": {
          "ageYears": 44,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Breathing follow-up",
        "presentation": "{patientName}, a 44-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an admission for a severe asthma exacerbation.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.critical-respiratory-ventilation.air-trapping.v1",
            "prototypeDemographics": {
              "ageYears": 44,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Breathing follow-up",
            "presentation": "{patientName}, a 44-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an admission for a severe asthma exacerbation."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "AARC Clinical Practice Guideline: Patient-Ventilator Assessment",
          "Critical Care Management of Severe Asthma Exacerbations"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.critical-respiratory-ventilation.expiratory-time.v1",
            "questionVariantId": "question.topic.critical-respiratory-ventilation.expiratory-time.v1",
            "primaryConceptId": "concept.critical-respiratory-ventilation.expiratory-time.v1",
            "currentUpdate": "Hospital record: during passive volume control for asthma, PaCO2 rises to 68 mm Hg and pH is 7.28. Blood pressure is stable. Bronchodilator therapy continues.",
            "stem": "Which ventilator adjustment best fits {patientName}’s recorded pattern?",
            "answerChoices": [
              {
                "id": "choice.topic.critical-respiratory-ventilation.expiratory-time.rate-down",
                "label": "Reduce the set respiratory rate",
                "isCorrect": true,
                "rationale": "More expiratory time addresses incomplete exhalation and intrinsic PEEP even though PaCO2 remains elevated.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.critical-respiratory-ventilation.expiratory-time.rate-up",
                "label": "Increase the set respiratory rate",
                "isCorrect": false,
                "rationale": "Trying to normalize carbon dioxide by shortening expiration can worsen trapping.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.critical-respiratory-ventilation.expiratory-time.volume-up",
                "label": "Increase the delivered tidal volume",
                "isCorrect": false,
                "rationale": "A larger breath can add trapped volume rather than resolve incomplete exhalation.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The negative expiratory flow at the next inspiration and total PEEP above the set value indicate incomplete emptying. Reducing rate lengthens expiration. Follow gas exchange and pressures rather than trying to normalize PaCO2 by adding more frequent or larger breaths. No universal rate or acceptable-pH threshold is prescribed.",
            "exhibit": {
              "kind": "table",
              "caption": "Independently constructed outside-hospital record; fictional measurements",
              "columnHeaders": [
                "Rate",
                "Expiratory flow at next inspiration",
                "Set / measured total PEEP",
                "Plateau pressure"
              ],
              "rowHeaders": [
                "Current record"
              ],
              "cells": [
                [
                  "28/min",
                  "Still −10 L/min",
                  "5 / 16 cm H2O",
                  "31 cm H2O"
                ]
              ]
            },
            "sourceLabels": [
              "AARC Clinical Practice Guideline: Patient-Ventilator Assessment",
              "Critical Care Management of Severe Asthma Exacerbations"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.critical-respiratory-ventilation.expiratory-time.rate-up",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
                "clinicalRationale": "Trying to normalize carbon dioxide by shortening expiration can worsen trapping.",
                "sourceLabels": [
                  "AARC Clinical Practice Guideline: Patient-Ventilator Assessment",
                  "Critical Care Management of Severe Asthma Exacerbations"
                ]
              },
              {
                "answerChoiceId": "choice.topic.critical-respiratory-ventilation.expiratory-time.volume-up",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
                "clinicalRationale": "A larger breath can add trapped volume rather than resolve incomplete exhalation.",
                "sourceLabels": [
                  "AARC Clinical Practice Guideline: Patient-Ventilator Assessment",
                  "Critical Care Management of Severe Asthma Exacerbations"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The negative expiratory flow at the next inspiration and total PEEP above the set value indicate incomplete emptying. Reducing rate lengthens expiration. Follow gas exchange and pressures rather than trying to normalize PaCO2 by adding more frequent or larger breaths. No universal rate or acceptable-pH threshold is prescribed."
      },
      {
        "id": "case.topic.critical-respiratory-ventilation.extubation-rescue.v1",
        "displayName": "Elena Marsh: outside-record review",
        "patientPresentationVariantId": "presentation.topic.critical-respiratory-ventilation.extubation-rescue.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Elena Marsh",
        "prototypeDemographics": {
          "ageYears": 55,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Breathing recovery",
        "presentation": "{patientName}, a 55-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from a medical pneumonia admission requiring ventilation; she had no operation or chronic obstructive lung disease during that admission.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.topic.critical-respiratory-ventilation.extubation-rescue.v1",
            "prototypeDemographics": {
              "ageYears": 55,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Breathing recovery",
            "presentation": "{patientName}, a 55-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from a medical pneumonia admission requiring ventilation; she had no operation or chronic obstructive lung disease during that admission."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
            "questionVariantId": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
            "primaryConceptId": "concept.critical-respiratory-ventilation.postextubation-rescue.v1",
            "currentUpdate": "Hospital record: after planned extubation for pneumonia, {patientName} develops increasing accessory-muscle use and fatigue. On high-flow nasal oxygen at FiO2 0.60, PaO2 is 54 mm Hg. PaCO2 rises from 39 to 59 mm Hg and pH falls to 7.26. She remains tired despite repositioning and airway clearance.",
            "stem": "Which respiratory-support plan best fits {patientName}’s recorded post-extubation deterioration?",
            "answerChoices": [
              {
                "id": "choice.topic.critical-respiratory-ventilation.postextubation-rescue.tube",
                "label": "Reintubate and resume invasive ventilation",
                "isCorrect": true,
                "rationale": "The record now shows established worsening post-extubation respiratory failure in the population where rescue NIV may delay needed reintubation.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.critical-respiratory-ventilation.postextubation-rescue.mask",
                "label": "Begin rescue bilevel mask ventilation",
                "isCorrect": false,
                "rationale": "Preventive NIV evidence does not justify delaying reintubation for established failure in this non-COPD medical record.",
                "serviceRequest": null
              },
              {
                "id": "choice.topic.critical-respiratory-ventilation.postextubation-rescue.oxygen",
                "label": "Escalate high-flow nasal oxygen",
                "isCorrect": false,
                "rationale": "Further oxygen-focused support does not resolve the worsening ventilation and fatigue already present.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "This is rescue after deterioration, not prevention immediately after planned extubation. In general non-COPD medical patients with established post-extubation failure, ERS/ATS conditionally discourages NIV that may delay reintubation. The worsening ventilation and fatigue make continued oxygen escalation inadequate in this record. COPD and postoperative exceptions must not be erased.",
            "sourceLabels": [
              "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.topic.critical-respiratory-ventilation.postextubation-rescue.mask",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
                "clinicalRationale": "Preventive NIV evidence does not justify delaying reintubation for established failure in this non-COPD medical record.",
                "sourceLabels": [
                  "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
                ]
              },
              {
                "answerChoiceId": "choice.topic.critical-respiratory-ventilation.postextubation-rescue.oxygen",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
                "clinicalRationale": "Further oxygen-focused support does not resolve the worsening ventilation and fatigue already present.",
                "sourceLabels": [
                  "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
                ]
              }
            ]
          }
        ],
        "learningSummary": "This is rescue after deterioration, not prevention immediately after planned extubation. In general non-COPD medical patients with established post-extubation failure, ERS/ATS conditionally discourages NIV that may delay reintubation. The worsening ventilation and fatigue make continued oxygen escalation inadequate in this record. COPD and postoperative exceptions must not be erased."
      }
    ]
  }
};
export const PROGRAM_BATCH1_QUESTIONS:QuestionVariant[]=[
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "conceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
    "stem": "Which hospital plan best fits {patientName}'s CT and reassessment findings?",
    "answerChoices": [
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.challenge",
        "label": "Begin an enteral contrast challenge with interval radiography",
        "isCorrect": false,
        "rationale": "The configuration and reduced enhancement require urgent operative assessment. A transit challenge must not postpone that response.",
        "distractorRationale": "The configuration and reduced enhancement require urgent operative assessment. A transit challenge must not postpone that response."
      },
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.explore",
        "label": "Proceed to urgent operative exploration of the involved bowel",
        "isCorrect": true,
        "rationale": "Two transition sites and twisted mesentery define a trapped segment, and reduced enhancement raises concern about its blood supply. Normal lactate and pain relief do not neutralize those findings.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.observe",
        "label": "Continue nasogastric decompression with inpatient serial reassessment",
        "isCorrect": false,
        "rationale": "This is appropriate for selected uncomplicated obstruction, but the supplied CT raises a different risk that requires timely exploration.",
        "distractorRationale": "This is appropriate for selected uncomplicated obstruction, but the supplied CT raises a different risk that requires timely exploration."
      }
    ],
    "explanation": "The geometry indicates a closed loop, while reduced wall enhancement raises concern for impaired perfusion. These findings support urgent exploration despite the laboratory lactate and partial response to decompression.",
    "supportingEvidenceClaimIds": [
      "claim.small-bowel-obstruction-ileus.transition-pattern",
      "claim.small-bowel-obstruction-ileus.closed-loop-risk",
      "claim.small-bowel-obstruction-ileus.normal-lactate-limit",
      "claim.small-bowel-obstruction-ileus.nonoperative-eligibility",
      "claim.small-bowel-obstruction-ileus.contrast-prognosis"
    ]
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "conceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
    "stem": "Which hospital plan best fits {patientName}'s later reassessment?",
    "answerChoices": [
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.explore",
        "label": "Proceed to urgent operative exploration of the abdomen",
        "isCorrect": true,
        "rationale": "The new peritoneal examination requires operative assessment. Earlier contrast passage predicts transit and does not establish current bowel viability.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.repeat-transit",
        "label": "Repeat enteral contrast administration and the transit films",
        "isCorrect": false,
        "rationale": "Repeating transit assessment does not answer the immediate concern raised by new peritoneal findings and may delay exploration.",
        "distractorRationale": "Repeating transit assessment does not answer the immediate concern raised by new peritoneal findings and may delay exploration."
      },
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.continue",
        "label": "Continue decompression and reassess after the observation period",
        "isCorrect": false,
        "rationale": "A previously favorable film does not justify waiting through a new peritoneal examination.",
        "distractorRationale": "A previously favorable film does not justify waiting through a new peritoneal examination."
      }
    ],
    "explanation": "Colonic contrast passage is a favorable prognostic finding for nonoperative resolution. New guarding and rebound require a fresh surgical response. The transit result cannot establish that bowel remains viable during a changed clinical course.",
    "supportingEvidenceClaimIds": [
      "claim.small-bowel-obstruction-ileus.contrast-prognosis",
      "claim.small-bowel-obstruction-ileus.contrast-viability-limit",
      "claim.small-bowel-obstruction-ileus.deterioration-operation",
      "claim.small-bowel-obstruction-ileus.nonoperative-eligibility"
    ]
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "conceptId": "concept.small-bowel-obstruction-ileus.nonoperative-eligibility.v1",
    "stem": "Which initial hospital plan best fits {patientName}'s completed assessment?",
    "answerChoices": [
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.explore",
        "label": "Proceed directly to exploration during the initial assessment",
        "isCorrect": false,
        "rationale": "No prior operation does not itself mandate exploration when the current CT and examination support a supervised trial. The underlying cause still requires attention.",
        "distractorRationale": "No prior operation does not itself mandate exploration when the current CT and examination support a supervised trial. The underlying cause still requires attention."
      },
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.feed",
        "label": "Remove decompression and begin an oral-intake trial",
        "isCorrect": false,
        "rationale": "A reassuring initial assessment and less pain do not establish resolution. Ongoing obstruction still needs hospital support and monitoring.",
        "distractorRationale": "A reassuring initial assessment and less pain do not establish resolution. Ongoing obstruction still needs hospital support and monitoring."
      },
      {
        "id": "choice.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.observe",
        "label": "Continue decompression with inpatient serial surgical reassessment",
        "isCorrect": true,
        "rationale": "A selected first SBO in an unoperated abdomen can receive a nonoperative trial after CT and examination exclude an identified urgent cause. The absence of an operation history does not prove etiology.",
        "distractorRationale": null
      }
    ],
    "explanation": "A previously unoperated abdomen changes the differential, but it does not automatically require exploration. This assessment supports a supervised trial. Resolution would still leave the cause and appropriate follow-up to be assessed.",
    "supportingEvidenceClaimIds": [
      "claim.small-bowel-obstruction-ileus.transition-pattern",
      "claim.small-bowel-obstruction-ileus.virgin-abdomen-trial",
      "claim.small-bowel-obstruction-ileus.nonoperative-support",
      "claim.small-bowel-obstruction-ileus.closed-loop-risk",
      "claim.small-bowel-obstruction-ileus.virgin-followup"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "conceptId": "concept.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "stem": "Which CRRT anticoagulation strategy should Owen Carter receive now?",
    "answerChoices": [
      {
        "id": "choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.citrate.v1",
        "label": "Use regional citrate anticoagulation",
        "isCorrect": true,
        "rationale": "The repeated circuit loss makes an unanticoagulated strategy problematic, while the bleeding course makes systemic heparin less attractive.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.heparin.v1",
        "label": "Use systemic unfractionated heparin",
        "isCorrect": false,
        "rationale": "Systemic heparin adds systemic anticoagulation during the current bleeding-risk course.",
        "distractorRationale": "Systemic heparin adds systemic anticoagulation during the current bleeding-risk course."
      },
      {
        "id": "choice.topic.critical-renal-organ-support.citrate-bleeding-circuit.none.v1",
        "label": "Continue anticoagulant-free CRRT",
        "isCorrect": false,
        "rationale": "This avoids anticoagulant exposure but has repeatedly lost circuits despite checked access.",
        "distractorRationale": "This avoids anticoagulant exposure but has repeatedly lost circuits despite checked access."
      }
    ],
    "explanation": "Regional citrate can preserve circuit patency while limiting systemic anticoagulant exposure in this bleeding-risk course. Metabolic monitoring is required. The current choice depends on both hemorrhage risk and the observed failure of anticoagulant-free circuits.",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed patient observations",
      "items": [
        {
          "label": "Bleeding course",
          "value": "Reoperation controlled a postoperative bleed. Drain output remains blood-stained and red-cell support was needed recently."
        },
        {
          "label": "Circuit course",
          "value": "Two anticoagulant-free circuits clotted early and interrupted treatment. Access flow and catheter position have been checked."
        },
        {
          "label": "Current metabolism",
          "value": "He is off vasopressors. Lactate is 1.3 mmol/L, bilirubin is 0.8 mg/dL and systemic ionized calcium is within the local reference range."
        }
      ]
    },
    "supportingEvidenceClaimIds": [
      "claim.critical-renal-organ-support.citrate-bleeding",
      "claim.critical-renal-organ-support.citrate-monitoring"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.r2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "conceptId": "concept.critical-renal-organ-support.trial-off-crrt.v1",
    "stem": "At this reassessment after CRRT interruption, which kidney-support plan should Maya Reed receive?",
    "answerChoices": [
      {
        "id": "choice.topic.critical-renal-organ-support.trial-off-crrt.trial.v2",
        "label": "Continue the current trial off CRRT",
        "isCorrect": true,
        "rationale": "Spontaneous urine and the actual metabolic and volume course support a monitored trial despite residual dysfunction.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.critical-renal-organ-support.trial-off-crrt.restart.v2",
        "label": "Restart the previous CRRT prescription",
        "isCorrect": false,
        "rationale": "The on-treatment creatinine included extracorporeal removal. The observed interruption does not establish a support need requiring automatic restart.",
        "distractorRationale": "The on-treatment creatinine included extracorporeal removal. The observed interruption does not establish a support need requiring automatic restart."
      },
      {
        "id": "choice.topic.critical-renal-organ-support.trial-off-crrt.ihd.v2",
        "label": "Switch to intermittent hemodialysis",
        "isCorrect": false,
        "rationale": "Conversion still provides replacement when the current observations support assessing whether replacement is needed.",
        "distractorRationale": "Conversion still provides replacement when the current observations support assessing whether replacement is needed."
      }
    ],
    "explanation": "The actual interruption shows spontaneous urine production with current metabolic and volume control. Continue a monitored trial off treatment. The on-circuit creatinine reflected extracorporeal removal, so its rise needs interpretation alongside the observed support needs.",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed patient observations",
      "items": [
        {
          "label": "Urine course",
          "value": "Urine output rose spontaneously to 1.6 L during the past day without diuretics. Net machine fluid removal was zero during the last shift."
        },
        {
          "label": "Treatment course",
          "value": "The circuit has been stopped for eight hours. Potassium changed from 4.3 to 4.5 mmol/L and arterial pH from 7.39 to 7.37."
        },
        {
          "label": "Current balance",
          "value": "Intake and urine losses remain close to matched. Breathing and blood pressure remain stable without new support."
        },
        {
          "label": "Creatinine",
          "value": "Creatinine rose from 1.1 mg/dL during treatment to 2.0 mg/dL during the interruption. Her pre-illness value was 0.8 mg/dL."
        },
        {
          "label": "Ongoing care",
          "value": "Chemistry, urine output, fluid balance, breathing and circulation continue to be monitored with each proposed support plan."
        }
      ]
    },
    "supportingEvidenceClaimIds": [
      "claim.critical-renal-organ-support.rrt-weaning",
      "claim.critical-renal-organ-support.creatinine-on-circuit",
      "claim.critical-renal-organ-support.kidney-assessment",
      "claim.critical-renal-organ-support.stable-rrt-modality"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "conceptId": "concept.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "stem": "Which bedside assessment should guide the decision about another fluid bolus for {patientName} at this stage?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed chart observations",
      "items": [
        {
          "label": "Circulation",
          "value": "MAP 57 mm Hg after initial crystalloid. Capillary refill 5 seconds."
        },
        {
          "label": "Rhythm",
          "value": "Atrial fibrillation with variable R-R intervals."
        },
        {
          "label": "Ventilation",
          "value": "Pressure support with variable patient-triggered breaths."
        },
        {
          "label": "Arterial waveform",
          "value": "Displayed pulse-pressure variation 22%."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.critical-shock-resuscitation.choose-valid-fluid-test.waveform-variation.v1",
        "label": "Track pulse-pressure variation from the arterial waveform",
        "isCorrect": false,
        "rationale": "Both the irregular rhythm and spontaneous breaths disturb the cyclic relationship needed to interpret this displayed value. A large number does not establish fluid responsiveness under these conditions.",
        "distractorRationale": "Both the irregular rhythm and spontaneous breaths disturb the cyclic relationship needed to interpret this displayed value. A large number does not establish fluid responsiveness under these conditions."
      },
      {
        "id": "choice.critical-shock-resuscitation.choose-valid-fluid-test.plr-flow.v1",
        "label": "Track stroke-volume change during passive leg raising",
        "isCorrect": true,
        "rationale": "A reversible change in preload can be assessed through direct flow measurement despite the represented breathing pattern and rhythm. The later treatment decision still requires assessment of perfusion need and fluid risk.",
        "distractorRationale": null
      },
      {
        "id": "choice.critical-shock-resuscitation.choose-valid-fluid-test.ivc-variation.v1",
        "label": "Track respiratory variation of inferior vena-caval diameter",
        "isCorrect": false,
        "rationale": "Inspiratory effort and other cardiopulmonary factors affect vena-caval variation. It is less dependable for this decision than a direct reversible flow-response test.",
        "distractorRationale": "Inspiratory effort and other cardiopulmonary factors affect vena-caval variation. It is less dependable for this decision than a direct reversible flow-response test."
      }
    ],
    "explanation": "The waveform value is affected by both irregular beats and spontaneous respiratory effort. Measure the change in stroke volume during passive leg raising. This answers whether flow responds to preload under the actual acquisition conditions.",
    "supportingEvidenceClaimIds": [
      "claim.critical-shock-resuscitation.ppv-validity",
      "claim.critical-shock-resuscitation.plr-flow",
      "claim.critical-shock-resuscitation.dynamic-over-static",
      "claim.critical-shock-resuscitation.ivc-variation-limitations"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "conceptId": "concept.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "stem": "Which next resuscitation adjustment best fits {patientName}'s current pressure, flow response and respiratory course?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed chart observations",
      "items": [
        {
          "label": "Pressure and perfusion",
          "value": "MAP 55 mm Hg on norepinephrine. Capillary refill 5 seconds."
        },
        {
          "label": "Reversible flow test",
          "value": "Stroke volume 48 mL at baseline, 64 mL during passive leg raising and 49 mL after return to baseline position."
        },
        {
          "label": "Respiratory course",
          "value": "Oxygen requirement rose after the preceding fluid administration. Bilateral crackles and diffuse new B-lines are present."
        },
        {
          "label": "Cardiac assessment",
          "value": "Left ventricular contraction is vigorous. Measured cardiac output is 7.0 L/min."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.critical-shock-resuscitation.response-versus-fluid-risk.fluid-bolus.v1",
        "label": "Give a balanced-crystalloid bolus",
        "isCorrect": false,
        "rationale": "The flow response is genuine, but it does not establish that another bolus offers the best risk-benefit balance. Worsening oxygen needs and new diffuse lung findings after fluids argue against further empiric volume loading here.",
        "distractorRationale": "The flow response is genuine, but it does not establish that another bolus offers the best risk-benefit balance. Worsening oxygen needs and new diffuse lung findings after fluids argue against further empiric volume loading here."
      },
      {
        "id": "choice.critical-shock-resuscitation.response-versus-fluid-risk.start-dobutamine.v1",
        "label": "Start a dobutamine infusion",
        "isCorrect": false,
        "rationale": "The represented low pressure occurs with vigorous contraction and substantial measured output. There is no demonstrated low-output cardiac dysfunction to make an inotrope the preferred adjustment.",
        "distractorRationale": "The represented low pressure occurs with vigorous contraction and substantial measured output. There is no demonstrated low-output cardiac dysfunction to make an inotrope the preferred adjustment."
      },
      {
        "id": "choice.critical-shock-resuscitation.response-versus-fluid-risk.increase-norepinephrine.v1",
        "label": "Increase the norepinephrine infusion",
        "isCorrect": true,
        "rationale": "The low MAP needs pressure support while the large flow response is weighed against the deteriorating respiratory course. Norepinephrine titration addresses the current hypotension without another empiric fluid load.",
        "distractorRationale": null
      }
    ],
    "explanation": "The reversible flow rise shows preload responsiveness. The worsening respiratory course after fluid changes whether that response should be pursued with another bolus. Titrate norepinephrine for the current low pressure while reassessing the evolving physiology.",
    "supportingEvidenceClaimIds": [
      "claim.critical-shock-resuscitation.fluid-need-risk",
      "claim.critical-shock-resuscitation.plr-flow",
      "claim.critical-shock-resuscitation.norepinephrine-first",
      "claim.critical-shock-resuscitation.inotrope-low-flow",
      "claim.critical-shock-resuscitation.pressure-flow-distinction"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "conceptId": "concept.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "stem": "Which investigation should {patientName}'s team obtain next to guide circulatory support after this echocardiographic examination?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed chart observations",
      "items": [
        {
          "label": "Current circulation",
          "value": "MAP 54 mm Hg despite norepinephrine and initial crystalloid. CVP is 18 mm Hg. Stroke volume did not increase with the last monitored bolus."
        },
        {
          "label": "Transthoracic acquisition log",
          "value": "One subcostal view outlines the anterior left ventricle with preserved contraction. Parasternal and apical views cannot be acquired through the current dressings and intervening subcutaneous air."
        },
        {
          "label": "Structures documented",
          "value": "The right ventricular free wall, posterior cardiac contour and most of the pericardial space are outside the acquired views."
        },
        {
          "label": "Current airway",
          "value": "Mechanically ventilated after the abdominal operation."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.critical-shock-resuscitation.echo-for-persistent-shock.contrast-tte.v2",
        "label": "Contrast-enhanced transthoracic echocardiography",
        "isCorrect": false,
        "rationale": "Contrast can improve endocardial-border definition in an acquired view. The current limitation is failed acoustic access to the structures needed for this shock assessment, beyond the already outlined left ventricle.",
        "distractorRationale": "Contrast can improve endocardial-border definition in an acquired view. The current limitation is failed acoustic access to the structures needed for this shock assessment, beyond the already outlined left ventricle."
      },
      {
        "id": "choice.critical-shock-resuscitation.echo-for-persistent-shock.pa-catheter.v2",
        "label": "Pulmonary artery catheterization",
        "isCorrect": false,
        "rationale": "Additional pressure and flow data can help mixed shock, but they do not show the currently unexamined chambers and surrounding structures that might explain the filling problem.",
        "distractorRationale": "Additional pressure and flow data can help mixed shock, but they do not show the currently unexamined chambers and surrounding structures that might explain the filling problem."
      },
      {
        "id": "choice.critical-shock-resuscitation.echo-for-persistent-shock.tee.v2",
        "label": "Transesophageal echocardiography",
        "isCorrect": true,
        "rationale": "The represented transthoracic views leave important right-sided and surrounding structures unexamined. An alternative acoustic approach can address that structural uncertainty while support continues.",
        "distractorRationale": null
      }
    ],
    "explanation": "The acquired left-ventricular view supplies useful local information. The record does not establish the status of the other structures needed to explain this filling and pressure pattern. TEE supplies an alternative structural approach when those transthoracic windows cannot be acquired.",
    "supportingEvidenceClaimIds": [
      "claim.critical-shock-resuscitation.r2-limited-tte",
      "claim.critical-shock-resuscitation.r2-tee-after-limited-tte",
      "claim.critical-shock-resuscitation.r2-contrast-border",
      "claim.critical-shock-resuscitation.echo-first",
      "claim.critical-shock-resuscitation.pressure-flow-distinction"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "conceptId": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
    "stem": "Which management pathway should be recommended for {patientName} after review of the separately labelled surgical specimens?",
    "answerChoices": [
      {
        "id": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.follow-up.v2",
        "label": "Multidisciplinary review for follow-up without resection",
        "isCorrect": false,
        "rationale": "Margin-negative noninfiltrative disease confined to an intact appendix could support this pathway. The separate diaphragmatic nodule contains mucinous epithelium, so the appendix margin and negative pelvic nodule cannot establish confinement.",
        "distractorRationale": "Margin-negative noninfiltrative disease confined to an intact appendix could support this pathway. The separate diaphragmatic nodule contains mucinous epithelium, so the appendix margin and negative pelvic nodule cannot establish confinement."
      },
      {
        "id": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.regional-resection.v2",
        "label": "Multidisciplinary review for right hemicolectomy and nodes",
        "isCorrect": false,
        "rationale": "The whole appendix does not show destructive glandular invasion requiring the localized adenocarcinoma nodal pathway. The demonstrated tumor is in a separate surface deposit; a regional colectomy does not by itself address that distribution.",
        "distractorRationale": "The whole appendix does not show destructive glandular invasion requiring the localized adenocarcinoma nodal pathway. The demonstrated tumor is in a separate surface deposit; a regional colectomy does not by itself address that distribution."
      },
      {
        "id": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.cytoreduction.v2",
        "label": "Multidisciplinary review for cytoreduction and intraperitoneal therapy",
        "isCorrect": true,
        "rationale": "Low-grade mucinous epithelium in the separately labelled diaphragmatic nodule demonstrates cellular disease outside the appendix. This requires experienced-center assessment for cytoreduction with or without intraperitoneal treatment. Histology, extent and operative feasibility determine the final plan; the biopsy does not guarantee eligibility.",
        "distractorRationale": null
      }
    ],
    "explanation": "The specimens represent different sites. A negative pelvic nodule and a clear appendiceal margin do not negate low-grade mucinous epithelium in the diaphragmatic nodule. That finding changes the disease field beyond the appendix. Experienced-center assessment for cytoreduction and possible intraperitoneal therapy is appropriate; this is not a promise of HIPEC or evidence that every deposit has been sampled. Regional colectomy is not a substitute for evaluating the demonstrated surface disease.",
    "supportingEvidenceClaimIds": [
      "claim.appendix-appendicitis.lamn-complete-resection",
      "claim.appendix-appendicitis.lamn-versus-invasive",
      "claim.appendix-appendicitis.adenocarcinoma-colectomy",
      "claim.appendix-appendicitis.cellular-deposit-assessment",
      "claim.appendix-appendicitis.peritoneal-mucin-treatment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "conceptId": "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
    "stem": "Which further surgical plan should be recommended for {patientName}'s appendiceal tumor after expert pathology review?",
    "answerChoices": [
      {
        "id": "choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.completed-resection.v1",
        "label": "Complete surgical treatment with the appendectomy",
        "isCorrect": false,
        "rationale": "A small favorable well-differentiated NET can have a limited surgical field. Expert review has established infiltrative goblet cell adenocarcinoma, which follows the adenocarcinoma pathway.",
        "distractorRationale": "A small favorable well-differentiated NET can have a limited surgical field. Expert review has established infiltrative goblet cell adenocarcinoma, which follows the adenocarcinoma pathway."
      },
      {
        "id": "choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.cecal-cuff.v1",
        "label": "Re-excise the appendiceal base with a cecal cuff",
        "isCorrect": false,
        "rationale": "The clear base margin already addresses local clearance. A cecal cuff would leave the regional nodal question created by the adenocarcinoma diagnosis unresolved.",
        "distractorRationale": "The clear base margin already addresses local clearance. A cecal cuff would leave the regional nodal question created by the adenocarcinoma diagnosis unresolved."
      },
      {
        "id": "choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.right-colectomy.v1",
        "label": "Perform right hemicolectomy with regional nodes",
        "isCorrect": true,
        "rationale": "The definitive infiltrative goblet cell adenocarcinoma diagnosis governs the plan. Current ASCRS guidance includes this tumor in the localized appendiceal adenocarcinoma recommendation for oncologic right colectomy.",
        "distractorRationale": null
      }
    ],
    "explanation": "The expert permanent diagnosis supersedes the historical carcinoid terminology. Goblet cell adenocarcinoma follows an adenocarcinoma treatment pathway despite focal neuroendocrine staining. With localized staging and fitness for surgery, oncologic right hemicolectomy addresses the regional nodes.",
    "supportingEvidenceClaimIds": [
      "claim.appendix-appendicitis.goblet-cell-identity",
      "claim.appendix-appendicitis.adenocarcinoma-colectomy",
      "claim.appendix-appendicitis.intact-abnormal-appendix",
      "claim.appendix-appendicitis.small-favorable-net-resection"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "conceptId": "concept.appendix-appendicitis.large-net-regional-resection.v1",
    "stem": "Which next management plan should be recommended for {patientName}'s appendiceal tumor after these acquired staging results?",
    "answerChoices": [
      {
        "id": "choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v2",
        "label": "Finish resection with appendectomy and follow-up",
        "isCorrect": false,
        "rationale": "The liver findings have benign cyst morphology, but the completely measured primary is larger than the guideline boundary for appendix-only treatment. A clear base does not address regional nodal risk.",
        "distractorRationale": "The liver findings have benign cyst morphology, but the completely measured primary is larger than the guideline boundary for appendix-only treatment. A clear base does not address regional nodal risk."
      },
      {
        "id": "choice.topic.appendix-appendicitis.net-regional-resection.right-colectomy.v2",
        "label": "Proceed with right hemicolectomy and regional nodes",
        "isCorrect": true,
        "rationale": "The acquired MRI observations characterize the represented liver lesions as simple cysts rather than leaving them indeterminate for staging. In this fit patient, the whole-specimen tumor size supports regional resection despite a clear appendectomy margin.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2",
        "label": "Obtain liver core biopsy before further resection",
        "isCorrect": false,
        "rationale": "These are resolved fluid-signal, nonenhancing lesions without internal solid tissue on adequate MRI, not persistent indeterminate targets. Biopsy would add an unsupported staging step. This conclusion comes from morphology, not a negative receptor scan.",
        "distractorRationale": "These are resolved fluid-signal, nonenhancing lesions without internal solid tissue on adequate MRI, not persistent indeterminate targets. Biopsy would add an unsupported staging step. This conclusion comes from morphology, not a negative receptor scan."
      }
    ],
    "explanation": "The earlier CT uncertainty must be updated using the actual MRI: simple fluid signal, a thin wall and no enhancing internal tissue characterize the represented lesions as cysts. This is different from inferring cysts from absent receptor uptake. The whole-specimen primary exceeds the directly sourced greater-than-2-cm NET boundary, so regional nodal resection remains indicated despite a clear base margin. A smaller favorable tumor or unresolved liver staging would change this decision.",
    "supportingEvidenceClaimIds": [
      "claim.appendix-appendicitis.hepatic-cyst-mri",
      "claim.appendix-appendicitis.net-resection",
      "claim.appendix-appendicitis.small-favorable-net-resection",
      "claim.appendix-appendicitis.net-functional-staging"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
    "stem": "Which care setting and assessment plan should be used for {patientName} after this CT?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed trauma record; fictional observations",
      "items": [
        {
          "label": "CT",
          "value": "IV-contrast scan: small interloop/pelvic fluid, focal mesenteric stranding; no solid-organ injury, wall defect or extraluminal air"
        },
        {
          "label": "Examination",
          "value": "Localized lower abdominal tenderness; no guarding or rebound"
        },
        {
          "label": "Circulation",
          "value": "BP 126/74 mmHg; pulse 92/min; no support requirement"
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.belt-equivocal-observation.observe",
        "label": "Inpatient observation with serial abdominal examinations",
        "isCorrect": true,
        "rationale": "Restraint-pattern trauma with unexplained fluid and mesenteric change remains concerning despite no direct perforation sign. Serial assessment is needed.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.belt-equivocal-observation.discharge",
        "label": "Discharge with outpatient abdominal reassessment",
        "isCorrect": false,
        "rationale": "No free air does not resolve these abnormalities; outpatient follow-up can miss evolving bowel injury.",
        "distractorRationale": "No free air does not resolve these abnormalities; outpatient follow-up can miss evolving bowel injury."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.belt-equivocal-observation.explore",
        "label": "Operative exploration with bowel assessment",
        "isCorrect": false,
        "rationale": "These changes are nonspecific and the examination has no peritoneal findings; they do not establish an immediate operative indication.",
        "distractorRationale": "These changes are nonspecific and the examination has no peritoneal findings; they do not establish an immediate operative indication."
      }
    ],
    "explanation": "Restraint-pattern trauma with unexplained fluid and mesenteric change remains concerning despite no direct perforation sign. Serial assessment is needed.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.equivocal-bowel-observe",
      "claim.trauma-initial-abdomen.bowel-direct-sign",
      "claim.trauma-initial-abdomen.stable-ct"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
    "stem": "At this hospital reassessment, which next management plan should be recommended for {patientName}?",
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct",
        "label": "Repeat contrast-enhanced abdominal and pelvic CT",
        "isCorrect": true,
        "rationale": "The interval course increases concern after an equivocal study while current physiology and examination still permit noninvasive characterization. Repeat CT is supported at this reassessment.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.observe",
        "label": "Continue inpatient serial abdominal examinations",
        "isCorrect": false,
        "rationale": "Serial examinations were appropriate initially, but the documented interval increase in tenderness after an equivocal scan supports adding repeat imaging rather than leaving the plan unchanged.",
        "distractorRationale": "Serial examinations were appropriate initially, but the documented interval increase in tenderness after an equivocal scan supports adding repeat imaging rather than leaving the plan unchanged."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.explore",
        "label": "Proceed to operative abdominal exploration",
        "isCorrect": false,
        "rationale": "The patient remains stable without peritoneal findings or a direct wall-injury sign in the available record. The increasing suspicion warrants reassessment, but does not yet establish the direct injury evidence that would favor immediate operative control.",
        "distractorRationale": "The patient remains stable without peritoneal findings or a direct wall-injury sign in the available record. The increasing suspicion warrants reassessment, but does not yet establish the direct injury evidence that would favor immediate operative control."
      }
    ],
    "explanation": "The interval course increases concern after an equivocal study while current physiology and examination still permit noninvasive characterization. Repeat CT is supported at this reassessment.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.evolving-bowel-repeat-ct",
      "claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment",
      "claim.trauma-initial-abdomen.stable-ct",
      "claim.trauma-initial-abdomen.equivocal-bowel-observe",
      "claim.trauma-initial-abdomen.bowel-direct-sign",
      "claim.trauma-initial-abdomen.unstable-positive-fast"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
    "stem": "Which procedure should next address {patientName}'s continuing pelvic hemorrhage?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed trauma record; fictional observations",
      "items": [
        {
          "label": "Earlier CT",
          "value": "During initial stabilization: large pelvic retroperitoneal hematoma; no intraperitoneal injury"
        },
        {
          "label": "Treatment",
          "value": "Binder and temporary stabilization maintained; internal iliac arterial focus embolized"
        },
        {
          "label": "Completion",
          "value": "Selective pelvic arterial runs show no further extravasation"
        },
        {
          "label": "Current state",
          "value": "BP 82/48 mmHg during blood administration; repeat FAST without intraperitoneal fluid; no external or thoracic source identified"
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.packing",
        "label": "Preperitoneal pelvic packing",
        "isCorrect": true,
        "rationale": "Persistent bleeding despite stabilization and completed arterial treatment can come from venous or bony sources. Packing addresses the residual compartment.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize",
        "label": "Repeat pelvic arterial embolization",
        "isCorrect": false,
        "rationale": "The completion survey shows no residual target while shock continues. Assuming another artery leaves nonarterial bleeding untreated.",
        "distractorRationale": "The completion survey shows no residual target while shock continues. Assuming another artery leaves nonarterial bleeding untreated."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy",
        "label": "Intraperitoneal abdominal exploration",
        "isCorrect": false,
        "rationale": "The known collection is retroperitoneal and the completed assessment shows no intraperitoneal operative source.",
        "distractorRationale": "The known collection is retroperitoneal and the completed assessment shows no intraperitoneal operative source."
      }
    ],
    "explanation": "Persistent bleeding despite stabilization and completed arterial treatment can come from venous or bony sources. Packing addresses the residual compartment.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
      "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
      "claim.trauma-initial-abdomen.pelvic-fast-limitation",
      "claim.trauma-initial-abdomen.unstable-positive-fast"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
    "stem": "Which procedure should address {patientName}'s current pelvic bleeding?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed trauma record; fictional observations",
      "items": [
        {
          "label": "CT",
          "value": "A focal pool communicates with a pelvic arterial branch and expands on venous images; packing remains positioned; no new intraperitoneal abnormality"
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.embolize",
        "label": "Pelvic angiography with embolization",
        "isCorrect": true,
        "rationale": "An expanding arterial-connected focus identifies recurrent or residual arterial bleeding after packing. Sustained circulation permits targeted angiographic control.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.repack",
        "label": "Repeat preperitoneal pelvic packing",
        "isCorrect": false,
        "rationale": "Repacking can treat nonarterial bleeding, but the new study localizes an arterial target not controlled by packing.",
        "distractorRationale": "Repacking can treat nonarterial bleeding, but the new study localizes an arterial target not controlled by packing."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy",
        "label": "Proceed to intraperitoneal abdominal exploration",
        "isCorrect": false,
        "rationale": "The current source is a pelvic artery with no new intraperitoneal injury. A different compartment is not the targeted response.",
        "distractorRationale": "The current source is a pelvic artery with no new intraperitoneal injury. A different compartment is not the targeted response."
      }
    ],
    "explanation": "An expanding arterial-connected focus identifies recurrent or residual arterial bleeding after packing. Sustained circulation permits targeted angiographic control.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
      "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
    "stem": "At this hospital decision point, which imaging protocol should be recommended for {patientName}'s ongoing gross hematuria?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-hospital record; fictional observations",
      "items": [
        {
          "label": "Clinical record",
          "value": "Pelvic fracture; circulation stable after hemorrhage control; gross hematuria continues through the existing catheter."
        },
        {
          "label": "Acquired imaging and administration log",
          "value": "All acquired series belong to an IV-contrast abdominal/pelvic CT protocol. Excreted contrast opacifies the upper tracts without a leak; bladder walls remain apposed around a thin layer of contrast next to the catheter."
        },
        {
          "label": "Catheter record",
          "value": "No meatal blood was seen before insertion; the catheter passed without resistance and drains urine."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram",
        "label": "Retrograde CT cystography with bladder distension",
        "isCorrect": true,
        "rationale": "Gross hematuria after pelvic trauma raises a bladder-injury concern. The acquired images show a minimally filled bladder, so excreted contrast has not provided an adequate cystographic evaluation.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory",
        "label": "Delayed excretory-phase abdominal and pelvic CT",
        "isCorrect": false,
        "rationale": "More renal excretion does not substitute for a distended cystographic assessment of the bladder; the already opacified upper tracts address a different target.",
        "distractorRationale": "More renal excretion does not substitute for a distended cystographic assessment of the bladder; the already opacified upper tracts address a different target."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.urethrogram",
        "label": "Retrograde urethrography with contrast radiography",
        "isCorrect": false,
        "rationale": "A urethrogram investigates suspected urethral injury. The current gross-hematuria/pelvic-injury question still needs bladder evaluation through established access. Easy catheter passage and absent initial meatal blood do not prove that every urethral injury is excluded.",
        "distractorRationale": "A urethrogram investigates suspected urethral injury. The current gross-hematuria/pelvic-injury question still needs bladder evaluation through established access. Easy catheter passage and absent initial meatal blood do not prove that every urethral injury is excluded."
      }
    ],
    "explanation": "Gross hematuria after pelvic trauma raises a bladder-injury concern. The acquired images show a minimally filled bladder, so excreted contrast has not provided an adequate cystographic evaluation.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.bladder-cystography",
      "claim.trauma-initial-abdomen.passive-ct-insufficient",
      "claim.trauma-initial-abdomen.renal-excretory-phase",
      "claim.trauma-initial-abdomen.urethral-assessment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
    "stem": "At this documented treatment decision, which bladder plan should be recommended for {patientName}?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-hospital record; fictional observations",
      "items": [
        {
          "label": "Cystogram",
          "value": "Leaked contrast remains in tissue between the bladder and pubic symphysis and tracks beside the bladder. It does not outline bowel loops above the pelvis."
        },
        {
          "label": "Inspection",
          "value": "A pointed fragment continuous with the fractured pubic bone projects through the anterior bladder wall into the lumen. The bladder neck and ureteral orifices are intact."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.repair",
        "label": "Primary bladder repair with urethral catheter drainage",
        "isCorrect": true,
        "rationale": "The distribution is extraperitoneal, but bone protruding through the bladder wall makes this more than an uncomplicated leak. Repair addresses the injury rather than relying on catheter drainage to heal around the persistent bony lesion.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.urethral",
        "label": "Bladder drainage by urethral catheter with cystographic reassessment",
        "isCorrect": false,
        "rationale": "This is a supported pathway for an uncomplicated extraperitoneal rupture. The projected bone fragment is the important exception; preserved catheter flow does not remove it.",
        "distractorRationale": "This is a supported pathway for an uncomplicated extraperitoneal rupture. The projected bone fragment is the important exception; preserved catheter flow does not remove it."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.suprapubic",
        "label": "Bladder drainage by suprapubic catheter with cystographic reassessment",
        "isCorrect": false,
        "rationale": "Changing the drainage route does not address the bony lesion through the bladder wall. A suprapubic catheter can provide drainage in selected nonoperative injuries, but it is not a substitute for repair of this complexity.",
        "distractorRationale": "Changing the drainage route does not address the bony lesion through the bladder wall. A suprapubic catheter can provide drainage in selected nonoperative injuries, but it is not a substitute for repair of this complexity."
      }
    ],
    "explanation": "The distribution is extraperitoneal, but bone protruding through the bladder wall makes this more than an uncomplicated leak. Repair addresses the injury rather than relying on catheter drainage to heal around the persistent bony lesion.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.complex-bladder",
      "claim.trauma-initial-abdomen.extraperitoneal-bladder"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
    "stem": "Which pancreatic procedure should be selected for {patientName} at this operation?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed trauma record; fictional observations",
      "items": [
        {
          "label": "Operative findings",
          "value": "Body completely transected left of superior mesenteric vessels; main duct visibly divided; tissue toward the splenic hilum remains perfused; head and ampulla intact"
        },
        {
          "label": "Physiology",
          "value": "After associated injury control: temperature 36.7 C; pH 7.36; no ongoing vasopressor requirement"
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.distal",
        "label": "Distal pancreatectomy",
        "isCorrect": true,
        "rationale": "Transection left of the mesenteric vessels involving the main duct is a distal duct-disrupting injury. Guidelines support distal resection rather than treating it as a duct-intact contusion.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.drain",
        "label": "External peripancreatic drainage",
        "isCorrect": false,
        "rationale": "Drainage can treat selected minor duct-intact injuries but leaves the disrupted distal duct source untreated in this complete transection.",
        "distractorRationale": "Drainage can treat selected minor duct-intact injuries but leaves the disrupted distal duct source untreated in this complete transection."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.reconstruct",
        "label": "Roux-en-Y pancreaticojejunostomy",
        "isCorrect": false,
        "rationale": "Reconstructive preservation may be considered in selected proximal injuries; it is not the routine preferred approach for this distal complete transection.",
        "distractorRationale": "Reconstructive preservation may be considered in selected proximal injuries; it is not the routine preferred approach for this distal complete transection."
      }
    ],
    "explanation": "Transection left of the mesenteric vessels involving the main duct is a distal duct-disrupting injury. Guidelines support distal resection rather than treating it as a duct-intact contusion.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.distal-pancreatic-duct",
      "claim.trauma-initial-abdomen.minor-pancreas",
      "claim.trauma-initial-abdomen.pancreatic-duct-evaluate",
      "claim.trauma-initial-abdomen.duodenal-complex",
      "claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
    "stem": "What renal surgical action should be taken for {patientName} during this exploration?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed trauma record; fictional observations",
      "items": [
        {
          "label": "Operative record",
          "value": "Emergency laparotomy for abdominal bleeding; active mesenteric bleeding identified; BP remains low during blood resuscitation"
        },
        {
          "label": "Renal compartment",
          "value": "Lateral perirenal hematoma stays the same size during exposure; no pulsation, free rupture or progressive expansion"
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.leave",
        "label": "Leave Gerota fascia and kidney undisturbed",
        "isCorrect": true,
        "rationale": "This renal hematoma remains contained and nonexpanding while a separate injury accounts for active bleeding. Instability alone does not require opening a stable zone-II hematoma.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.repair",
        "label": "Open Gerota fascia and repair the kidney",
        "isCorrect": false,
        "rationale": "An unchanged contained hematoma with a separate active source does not establish a need for renal exploration. Expansion or demonstrable renal hemorrhage would change that assessment.",
        "distractorRationale": "An unchanged contained hematoma with a separate active source does not establish a need for renal exploration. Expansion or demonstrable renal hemorrhage would change that assessment."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.nephrectomy",
        "label": "Open Gerota fascia and remove the kidney",
        "isCorrect": false,
        "rationale": "Automatic nephrectomy is not supported by an unchanged hematoma with a separate active source; even required intervention may permit preservation.",
        "distractorRationale": "Automatic nephrectomy is not supported by an unchanged hematoma with a separate active source; even required intervention may permit preservation."
      }
    ],
    "explanation": "This renal hematoma remains contained and nonexpanding while a separate injury accounts for active bleeding. Instability alone does not require opening a stable zone-II hematoma.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.contained-zone-two",
      "claim.trauma-initial-abdomen.renal-preservation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
    "stem": "At the documented laparotomy, which bowel plan should be recommended for {patientName}'s jejunal injury?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside-hospital record; fictional observations",
      "items": [
        {
          "label": "Bowel examination",
          "value": "The antimesenteric opening involves about one fifth of the circumference. Across the adjacent segment, mesentery is torn away from the bowel. That segment remains grey and noncontractile after nearby bowel becomes pink with warming; its cut margins do not bleed. Bowel beyond both ends is pink with visible mesenteric pulsation."
        },
        {
          "label": "Current physiology",
          "value": "Bleeding is controlled; BP 124/72 mmHg, temperature 36.8 C and pH 7.36. There is no further blood or vasopressor requirement, marked bowel edema or diffuse soilage."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.resect",
        "label": "Jejunal resection with immediate anastomosis",
        "isCorrect": true,
        "rationale": "The small wall opening understates the injury: the separated mesentery and nonrecovering segment require resection. Healthy adjacent bowel and restored physiology support reconstruction rather than leaving a staged discontinuity in this record.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.repair",
        "label": "Jejunal repair with direct suture closure",
        "isCorrect": false,
        "rationale": "Suture closure would address the visible opening but leave the segment whose perfusion has not recovered after mesenteric separation.",
        "distractorRationale": "Suture closure would address the visible opening but leave the segment whose perfusion has not recovered after mesenteric separation."
      },
      {
        "id": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.defer",
        "label": "Jejunal resection with deferred reconstruction",
        "isCorrect": false,
        "rationale": "Staged reconstruction can be appropriate when physiology, perfusion or ongoing control tasks remain unresolved. The current healthy margins and restored course support completing continuity rather than defaulting to discontinuity.",
        "distractorRationale": "Staged reconstruction can be appropriate when physiology, perfusion or ongoing control tasks remain unresolved. The current healthy margins and restored course support completing continuity rather than defaulting to discontinuity."
      }
    ],
    "explanation": "The small wall opening understates the injury: the separated mesentery and nonrecovering segment require resection. Healthy adjacent bowel and restored physiology support reconstruction rather than leaving a staged discontinuity in this record.",
    "supportingEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.small-bowel-repair",
      "claim.trauma-initial-abdomen.small-bowel-anastomosis-selection",
      "claim.trauma-initial-abdomen.damage-control",
      "claim.trauma-initial-abdomen.keep-open"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "conceptId": "concept.critical-respiratory-ventilation.expiratory-time.v1",
    "stem": "Which ventilator adjustment best fits Mark Price’s recorded pattern?",
    "exhibit": {
      "kind": "table",
      "caption": "Independently constructed outside-hospital record; fictional measurements",
      "columnHeaders": [
        "Rate",
        "Expiratory flow at next inspiration",
        "Set / measured total PEEP",
        "Plateau pressure"
      ],
      "rowHeaders": [
        "Current record"
      ],
      "cells": [
        [
          "28/min",
          "Still −10 L/min",
          "5 / 16 cm H2O",
          "31 cm H2O"
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.topic.critical-respiratory-ventilation.expiratory-time.rate-down",
        "label": "Reduce the set respiratory rate",
        "isCorrect": true,
        "rationale": "More expiratory time addresses incomplete exhalation and intrinsic PEEP even though PaCO2 remains elevated.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.expiratory-time.rate-up",
        "label": "Increase the set respiratory rate",
        "isCorrect": false,
        "rationale": "Trying to normalize carbon dioxide by shortening expiration can worsen trapping.",
        "distractorRationale": "Trying to normalize carbon dioxide by shortening expiration can worsen trapping."
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.expiratory-time.volume-up",
        "label": "Increase the delivered tidal volume",
        "isCorrect": false,
        "rationale": "A larger breath can add trapped volume rather than resolve incomplete exhalation.",
        "distractorRationale": "A larger breath can add trapped volume rather than resolve incomplete exhalation."
      }
    ],
    "explanation": "The negative expiratory flow at the next inspiration and total PEEP above the set value indicate incomplete emptying. Reducing rate lengthens expiration. Follow gas exchange and pressures rather than trying to normalize PaCO2 by adding more frequent or larger breaths. No universal rate or acceptable-pH threshold is prescribed.",
    "supportingEvidenceClaimIds": [
      "claim.critical-respiratory-ventilation.air-trapping",
      "claim.critical-respiratory-ventilation.plateau"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "conceptId": "concept.critical-respiratory-ventilation.postextubation-rescue.v1",
    "stem": "Which respiratory-support plan best fits Elena Marsh’s recorded post-extubation deterioration?",
    "answerChoices": [
      {
        "id": "choice.topic.critical-respiratory-ventilation.postextubation-rescue.tube",
        "label": "Reintubate and resume invasive ventilation",
        "isCorrect": true,
        "rationale": "The record now shows established worsening post-extubation respiratory failure in the population where rescue NIV may delay needed reintubation.",
        "distractorRationale": null
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.postextubation-rescue.mask",
        "label": "Begin rescue bilevel mask ventilation",
        "isCorrect": false,
        "rationale": "Preventive NIV evidence does not justify delaying reintubation for established failure in this non-COPD medical record.",
        "distractorRationale": "Preventive NIV evidence does not justify delaying reintubation for established failure in this non-COPD medical record."
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.postextubation-rescue.oxygen",
        "label": "Escalate high-flow nasal oxygen",
        "isCorrect": false,
        "rationale": "Further oxygen-focused support does not resolve the worsening ventilation and fatigue already present.",
        "distractorRationale": "Further oxygen-focused support does not resolve the worsening ventilation and fatigue already present."
      }
    ],
    "explanation": "This is rescue after deterioration, not prevention immediately after planned extubation. In general non-COPD medical patients with established post-extubation failure, ERS/ATS conditionally discourages NIV that may delay reintubation. The worsening ventilation and fatigue make continued oxygen escalation inadequate in this record. COPD and postoperative exceptions must not be erased.",
    "supportingEvidenceClaimIds": [
      "claim.critical-respiratory-ventilation.niv-rescue",
      "claim.critical-respiratory-ventilation.niv-failure"
    ]
  }
];
export const PROGRAM_BATCH1_TIMINGS:AnswerChoiceTimingRegistryEntry[]=[
  {
    "caseId": "case.topic.small-bowel-obstruction-ileus.closed-loop.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.challenge",
          "choiceLabel": "Begin an enteral contrast challenge with interval radiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.twenty_four_hour_protocol"
          }
        },
        {
          "choiceId": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.explore",
          "choiceLabel": "Proceed to urgent operative exploration of the involved bowel",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.observe",
          "choiceLabel": "Continue nasogastric decompression with inpatient serial reassessment",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.small-bowel-obstruction-ileus.transit-course.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.explore",
          "choiceLabel": "Proceed to urgent operative exploration of the abdomen",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.repeat-transit",
          "choiceLabel": "Repeat enteral contrast administration and the transit films",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.twenty_four_hour_protocol"
          }
        },
        {
          "choiceId": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.continue",
          "choiceLabel": "Continue decompression and reassess after the observation period",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.critical-renal-organ-support.circuit-anticoagulation.v1",
    "nodeId": "node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "questionVariantId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.critical-renal-organ-support.kidney-recovery.v1",
    "nodeId": "node.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "questionVariantId": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "questionVariantId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.critical-shock-resuscitation.choose-valid-fluid-test.waveform-variation.v1",
          "choiceLabel": "Track pulse-pressure variation from the arterial waveform",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "choice.critical-shock-resuscitation.choose-valid-fluid-test.plr-flow.v1",
          "choiceLabel": "Track stroke-volume change during passive leg raising",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "choice.critical-shock-resuscitation.choose-valid-fluid-test.ivc-variation.v1",
          "choiceLabel": "Track respiratory variation of inferior vena-caval diameter",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "questionVariantId": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.reassess-shock-mechanism.v2",
    "nodeId": "node.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "questionVariantId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.critical-shock-resuscitation.echo-for-persistent-shock.contrast-tte.v2",
          "choiceLabel": "Contrast-enhanced transthoracic echocardiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.echocardiography"
          }
        },
        {
          "choiceId": "choice.critical-shock-resuscitation.echo-for-persistent-shock.pa-catheter.v2",
          "choiceLabel": "Pulmonary artery catheterization",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.critical-shock-resuscitation.echo-for-persistent-shock.tee.v2",
          "choiceLabel": "Transesophageal echocardiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.echocardiography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v2",
    "nodeId": "node.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.appendix-appendicitis.goblet-cell-pathology.v1",
    "nodeId": "node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2",
    "nodeId": "node.topic.appendix-appendicitis.net-regional-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v2",
          "choiceLabel": "Finish resection with appendectomy and follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.right-colectomy.v2",
          "choiceLabel": "Proceed with right hemicolectomy and regional nodes",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2",
          "choiceLabel": "Obtain liver core biopsy before further resection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct",
          "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.observe",
          "choiceLabel": "Continue inpatient serial abdominal examinations",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.explore",
          "choiceLabel": "Proceed to operative abdominal exploration",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.packing",
          "choiceLabel": "Preperitoneal pelvic packing",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize",
          "choiceLabel": "Repeat pelvic arterial embolization",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy",
          "choiceLabel": "Intraperitoneal abdominal exploration",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.embolize",
          "choiceLabel": "Pelvic angiography with embolization",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.repack",
          "choiceLabel": "Repeat preperitoneal pelvic packing",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy",
          "choiceLabel": "Proceed to intraperitoneal abdominal exploration",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram",
          "choiceLabel": "Retrograde CT cystography with bladder distension",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory",
          "choiceLabel": "Delayed excretory-phase abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.urethrogram",
          "choiceLabel": "Retrograde urethrography with contrast radiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.critical-respiratory-ventilation.air-trapping.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.critical-respiratory-ventilation.extubation-rescue.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "classification": {
      "kind": "no_test"
    }
  }
];
export const PROGRAM_BATCH1_ORDERS=[
  {
    "caseId": "case.topic.small-bowel-obstruction-ileus.closed-loop.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "choiceId": "choice.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.challenge",
    "choiceLabel": "Begin an enteral contrast challenge with interval radiography",
    "timingProfileId": "timing.test.twenty_four_hour_protocol",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.small-bowel-obstruction-ileus.transit-course.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "choiceId": "choice.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.repeat-transit",
    "choiceLabel": "Repeat enteral contrast administration and the transit films",
    "timingProfileId": "timing.test.twenty_four_hour_protocol",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "questionVariantId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "choiceId": "choice.critical-shock-resuscitation.choose-valid-fluid-test.waveform-variation.v1",
    "choiceLabel": "Track pulse-pressure variation from the arterial waveform",
    "timingProfileId": "timing.test.physiology",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "questionVariantId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "choiceId": "choice.critical-shock-resuscitation.choose-valid-fluid-test.plr-flow.v1",
    "choiceLabel": "Track stroke-volume change during passive leg raising",
    "timingProfileId": "timing.test.physiology",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "questionVariantId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "choiceId": "choice.critical-shock-resuscitation.choose-valid-fluid-test.ivc-variation.v1",
    "choiceLabel": "Track respiratory variation of inferior vena-caval diameter",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.reassess-shock-mechanism.v2",
    "nodeId": "node.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "questionVariantId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "choiceId": "choice.critical-shock-resuscitation.echo-for-persistent-shock.contrast-tte.v2",
    "choiceLabel": "Contrast-enhanced transthoracic echocardiography",
    "timingProfileId": "timing.test.echocardiography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.reassess-shock-mechanism.v2",
    "nodeId": "node.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "questionVariantId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "choiceId": "choice.critical-shock-resuscitation.echo-for-persistent-shock.pa-catheter.v2",
    "choiceLabel": "Pulmonary artery catheterization",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.critical-shock-resuscitation.reassess-shock-mechanism.v2",
    "nodeId": "node.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "questionVariantId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "choiceId": "choice.critical-shock-resuscitation.echo-for-persistent-shock.tee.v2",
    "choiceLabel": "Transesophageal echocardiography",
    "timingProfileId": "timing.test.echocardiography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2",
    "nodeId": "node.topic.appendix-appendicitis.net-regional-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2",
    "choiceLabel": "Obtain liver core biopsy before further resection",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct",
    "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize",
    "choiceLabel": "Repeat pelvic arterial embolization",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.embolize",
    "choiceLabel": "Pelvic angiography with embolization",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram",
    "choiceLabel": "Retrograde CT cystography with bladder distension",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory",
    "choiceLabel": "Delayed excretory-phase abdominal and pelvic CT",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.urethrogram",
    "choiceLabel": "Retrograde urethrography with contrast radiography",
    "timingProfileId": "timing.test.radiography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const PROGRAM_BATCH1_CLAIMS:(EvidenceClaim&Record<string,unknown>)[]=[
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.transition-pattern",
    "statement": "A focal small-bowel caliber change with upstream dilation and downstream collapse supports a mechanical obstruction.",
    "sourceIds": [
      "source.sbo.wses-2018",
      "source.sbo.east-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Distribution alone does not establish cause or bowel viability.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.closed-loop-risk",
    "statement": "A closed-loop configuration, especially with reduced mural enhancement or associated fluid, warrants prompt operative assessment for threatened bowel.",
    "sourceIds": [
      "source.sbo.wses-2018",
      "source.sbo.east-2012"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "The questions combine anatomy with perfusion findings. A single minor fluid finding is not a universal operation threshold.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.normal-lactate-limit",
    "statement": "A lactate value in the laboratory reference interval does not exclude bowel ischemia.",
    "sourceIds": [
      "source.small-bowel-obstruction-ileus.wses-virgin-abdomen-2021",
      "source.small-bowel-obstruction-ileus.wses-ifso-oba-2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Serial clinical and imaging findings determine concern. No laboratory cutoff is authored.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.nonoperative-eligibility",
    "statement": "Presumed adhesive SBO can receive an inpatient nonoperative trial when clinical assessment and CT reveal no peritonitis, strangulation or ischemia.",
    "sourceIds": [
      "source.sbo.wses-2018",
      "source.sbo.east-2012"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Exact clinical application and competing actions require named clinician review.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.contrast-prognosis",
    "statement": "In an adequately performed enteral water-soluble contrast assessment for adhesive SBO, failure to reach the colon by the 24-hour film strongly suggests nonoperative failure.",
    "sourceIds": [
      "source.sbo.wses-2018",
      "source.sbo.east-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Technical adequacy and clinical trajectory matter. This is not an isolated automatic operation deadline.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.contrast-viability-limit",
    "statement": "Contrast transit predicts the chance of nonoperative resolution and does not override new findings concerning for ischemia or peritonitis.",
    "sourceIds": [
      "source.sbo.wses-2018",
      "source.sbo.east-2012"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Exact clinical application and competing actions require named clinician review.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.deterioration-operation",
    "statement": "New peritoneal findings or clinical deterioration during SBO care warrant timely exploration even when earlier assessment supported observation.",
    "sourceIds": [
      "source.sbo.east-2012",
      "source.sbo.wses-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Exact clinical application and competing actions require named clinician review.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.virgin-abdomen-trial",
    "statement": "Absence of prior abdominal surgery does not by itself require exploration in every SBO patient when CT and examination support a supervised nonoperative trial.",
    "sourceIds": [
      "source.small-bowel-obstruction-ileus.wses-virgin-abdomen-2021",
      "source.sbo.wses-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "WSES position paper evidence is mostly retrospective. A nonadhesive cause must still be considered.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.nonoperative-support",
    "statement": "A nonoperative SBO trial includes bowel rest, decompression when indicated, intravenous volume and electrolyte replacement, and serial surgical reassessment.",
    "sourceIds": [
      "source.sbo.wses-2018",
      "source.sbo.east-2012"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Exact clinical application and competing actions require named clinician review.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.small-bowel-obstruction-ileus.virgin-followup",
    "statement": "Resolution of SBO in a previously unoperated abdomen does not establish its cause and should be followed by evaluation for an underlying lesion when indicated.",
    "sourceIds": [
      "source.small-bowel-obstruction-ileus.wses-virgin-abdomen-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "One adequate retrieved position paper. It does not specify a universal modality, surveillance interval or cancer-screening pathway.",
    "applicablePopulation": "Adults with suspected or established small-bowel obstruction.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-renal-organ-support.citrate-bleeding",
    "statement": "Regional citrate can extend CRRT circuit life in adults at high bleeding risk when citrate use is appropriate.",
    "sourceIds": [
      "src.critical-renal-organ-support.srlf-gfrup-2025",
      "src.critical-renal-organ-support.citrate-consensus-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The preference over no anticoagulation is conditional. Systemic anticoagulation needs and metabolic risk alter the decision.",
    "applicablePopulation": "Adults with surgical or general critical illness and AKI. Pediatric and chronic maintenance-dialysis decisions are excluded.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-renal-organ-support.citrate-monitoring",
    "statement": "Citrate anticoagulation requires monitoring of systemic ionized calcium and metabolic changes.",
    "sourceIds": [
      "src.critical-renal-organ-support.citrate-consensus-2023",
      "src.critical-renal-organ-support.srlf-gfrup-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "No universal infusion recipe or monitoring interval is authored.",
    "applicablePopulation": "Adults with surgical or general critical illness and AKI. Pediatric and chronic maintenance-dialysis decisions are excluded.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-renal-organ-support.rrt-weaning",
    "statement": "A monitored trial off CRRT can be considered when spontaneous urine output and current metabolic and volume needs suggest sufficient kidney support.",
    "sourceIds": [
      "src.critical-renal-organ-support.srlf-gfrup-2025",
      "src.critical-renal-organ-support.japanese-aki-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "There is no universal successful-weaning urine cutoff. Reassess and restart if needed.",
    "applicablePopulation": "Adults with surgical or general critical illness and AKI. Pediatric and chronic maintenance-dialysis decisions are excluded.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-renal-organ-support.creatinine-on-circuit",
    "statement": "A low creatinine during CRRT can reflect treatment removal and does not establish independent kidney recovery.",
    "sourceIds": [
      "src.critical-renal-organ-support.japanese-aki-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One guideline explicitly explains production, native elimination and treatment removal. Use the observed interruption course.",
    "applicablePopulation": "Adults with surgical or general critical illness and AKI. Pediatric and chronic maintenance-dialysis decisions are excluded.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-renal-organ-support.kidney-assessment",
    "statement": "Creatinine and urine-output trajectories should be integrated with the clinical course when assessing AKI.",
    "sourceIds": [
      "src.critical-renal-organ-support.japanese-aki-2018",
      "src.critical-renal-organ-support.aki-workup-2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Creatinine lags changes in filtration and is affected by fluid distribution and treatment clearance.",
    "applicablePopulation": "Adults with surgical or general critical illness and AKI. Pediatric and chronic maintenance-dialysis decisions are excluded.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-renal-organ-support.stable-rrt-modality",
    "statement": "Hemodynamically stable adults with an ongoing replacement need may receive either continuous or intermittent kidney support.",
    "sourceIds": [
      "src.critical-renal-organ-support.srlf-gfrup-2025",
      "src.critical-renal-organ-support.japanese-aki-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Modality conversion does not establish that replacement remains necessary. Current requirements and local expertise govern.",
    "applicablePopulation": "Adults with surgical or general critical illness and AKI. Pediatric and chronic maintenance-dialysis decisions are excluded.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.ppv-validity",
    "statement": "Respiratory pulse-pressure variation becomes unreliable with spontaneous respiratory effort or an irregular rhythm.",
    "sourceIds": [
      "source.critical-shock-resuscitation.monnet-fluid-response-2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly inspected technical source. An arterial-line variation value does not rescue violated acquisition assumptions.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.plr-flow",
    "statement": "Passive leg raising can assess preload responsiveness during spontaneous breathing or arrhythmia when its effect on flow is measured directly.",
    "sourceIds": [
      "source.critical-shock-resuscitation.monnet-fluid-response-2016",
      "source.critical-shock-resuscitation.ssc-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Use technically adequate flow measurement and the reversible response. Arterial pressure change and isolated IVC diameter are insufficient substitutes.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.dynamic-over-static",
    "statement": "Dynamic flow response is more useful than static filling pressure for predicting a cardiac-output response to further volume expansion.",
    "sourceIds": [
      "source.critical-shock-resuscitation.monnet-fluid-response-2016",
      "source.critical-shock-resuscitation.esicm-shock-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Predicting a cardiac-output response does not establish clinical benefit or a mandate to give fluid.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.ivc-variation-limitations",
    "statement": "Respiratory vena-caval variation has important acquisition and physiologic limitations, especially during spontaneous breathing.",
    "sourceIds": [
      "source.critical-shock-resuscitation.monnet-fluid-response-2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly inspected technical source. No universal caval-diameter cutoff is authored and no isolated caval observation establishes fluid responsiveness.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.fluid-need-risk",
    "statement": "A positive preload-response test requires a separate assessment of hypoperfusion and fluid-related harm before a bolus is chosen.",
    "sourceIds": [
      "source.critical-shock-resuscitation.monnet-fluid-response-2016",
      "source.critical-shock-resuscitation.esicm-shock-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Risk-benefit assessment is individualized. No source establishes the numerical patient observations as a universal treatment cutoff.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.norepinephrine-first",
    "statement": "Norepinephrine is the preferred initial vasopressor for septic shock with persistent hypotension and preserved cardiac systolic function.",
    "sourceIds": [
      "source.critical-shock-resuscitation.ssc-2026",
      "source.critical-shock-resuscitation.jsscg-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "SSC 2026 allows either norepinephrine or epinephrine with concomitant cardiac dysfunction. These initial cases explicitly retain preserved systolic function.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.inotrope-low-flow",
    "statement": "Dobutamine added to norepinephrine is an option for septic cardiac dysfunction with ongoing hypoperfusion despite adequate pressure and volume assessment.",
    "sourceIds": [
      "source.critical-shock-resuscitation.ssc-2026",
      "source.critical-shock-resuscitation.jsscg-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Very-low-certainty SSC recommendation. Epinephrine is another supported strategy. This packet does not offer both as mutually exclusive keys or claim a survival benefit.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.pressure-flow-distinction",
    "statement": "An achieved arterial-pressure target does not establish adequate cardiac output or tissue perfusion.",
    "sourceIds": [
      "source.critical-shock-resuscitation.mclean-echo-2016",
      "source.critical-shock-resuscitation.esicm-shock-2025",
      "source.critical-shock-resuscitation.jsscg-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Interpret serial perfusion, flow and ventricular findings together. No isolated catheter value diagnoses the shock mechanism.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.r2-limited-tte",
    "statement": "A preserved left-ventricular contraction observation from incomplete transthoracic imaging does not assess unvisualized right-sided or pericardial structures.",
    "sourceIds": [
      "source.critical-shock-resuscitation.mclean-echo-2016",
      "source.critical-shock-resuscitation.minami-tee-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The inference is limited to the structures actually acquired. A missing exported image and a documented failed acoustic window are different problems.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.r2-tee-after-limited-tte",
    "statement": "TEE can provide structural cardiac assessment when persistent shock remains unexplained and transthoracic windows cannot provide the needed views.",
    "sourceIds": [
      "source.critical-shock-resuscitation.mclean-echo-2016",
      "source.critical-shock-resuscitation.minami-tee-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "TEE requires trained acquisition and procedure-specific safety assessment. The current cohort concerns cardiovascular ICU practice. This fictional patient's postoperative window problem is an acquisition-based application, requiring clinician review.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.r2-contrast-border",
    "statement": "Ultrasound contrast can improve endocardial-border definition during echocardiographic assessment of ventricular contraction.",
    "sourceIds": [
      "source.critical-shock-resuscitation.mclean-echo-2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly inspected review. This supports the contrast-TTE competitor under an appropriate border-definition problem. It does not establish that contrast restores a physically inaccessible transthoracic acoustic path.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-shock-resuscitation.echo-first",
    "statement": "Bedside echocardiography helps distinguish cardiac, obstructive and mixed mechanisms when shock persists despite initial treatment.",
    "sourceIds": [
      "source.critical-shock-resuscitation.esicm-shock-2025",
      "source.critical-shock-resuscitation.jsscg-2024",
      "source.critical-shock-resuscitation.mclean-echo-2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Echo findings require clinical interpretation. First-line echo is not a claim that all other testing or advanced monitoring is unnecessary.",
    "applicablePopulation": "Adults undergoing acute hospital shock assessment and resuscitation",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.lamn-versus-invasive",
    "statement": "Infiltrative malignant glands distinguish appendiceal adenocarcinoma from a noninfiltrative low-grade mucinous neoplasm.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "One directly verified current specialty guideline. A fully evaluated permanent specimen is supplied in the draft. A small biopsy or uncertain frozen section would not establish the same extent.",
    "applicablePopulation": "Permanent pathology assessment of an appendectomy specimen.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.adenocarcinoma-colectomy",
    "statement": "Nonmetastatic appendiceal adenocarcinoma generally warrants oncologic right hemicolectomy with regional nodal assessment.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly verified current specialty guideline, recommendation 13. The draft has invasion into mesoappendiceal fat, adequate staging and a fit patient. The recommendation is not generalized to isolated LAMN or disseminated peritoneal disease.",
    "applicablePopulation": "Fit adults with invasive appendiceal adenocarcinoma and no distant or peritoneal metastases.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.lamn-complete-resection",
    "statement": "Appendectomy is sufficient surgical treatment for a margin-negative LAMN with an intact wall and no peritoneal involvement.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One directly verified current specialty guideline, recommendation 12. Used for counterfactuals and the boundary against invasive carcinoma. Surveillance details remain outside the scored task.",
    "applicablePopulation": "Completely resected, nonperforated LAMN without peritoneal disease.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.peritoneal-mucin-treatment",
    "statement": "Selected patients with appendiceal mucinous neoplasia and peritoneal dissemination merit peritoneal-surface surgical assessment for cytoreduction and intraperitoneal treatment.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One directly verified current specialty guideline, recommendations 13-15. Right colectomy does not by itself address diffuse peritoneal disease. Systemic chemotherapy has limited activity in low-grade disease. Referral does not assert that every patient is operable or requires one HIPEC regimen.",
    "applicablePopulation": "A fit patient with biopsy-confirmed low-grade appendiceal mucinous peritoneal disease and no distant solid-organ metastases.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.cellular-deposit-assessment",
    "statement": "A permanent biopsy containing low-grade mucinous epithelium in a deposit outside the appendix establishes cellular extra-appendiceal disease in that sampled site; an acellular sample from another site does not negate it.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "ASCRS 2025 recommendations 2, 11 and 14 support representative biopsy, tissue-based cellularity and limitations of cytology. The conclusion is confined to represented tissue, not a claim that all deposits share that grade or that cytology should be routinely ordered.",
    "applicablePopulation": "Separately labelled mucin and solid-nodule samples obtained at appendectomy.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.goblet-cell-identity",
    "statement": "Infiltrative appendiceal goblet-cell epithelial tumors follow an adenocarcinoma treatment pathway despite possible focal neuroendocrine-marker expression.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly verified current specialty guideline. The exact diagnosis is confirmed on expert permanent review. A stain result by itself is insufficient to reclassify the tumor.",
    "applicablePopulation": "Localized appendiceal goblet cell adenocarcinoma.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.intact-abnormal-appendix",
    "statement": "An abnormal appendix encountered incidentally can be removed intact with a grossly clear base, preserving definitive specimen assessment before deciding on oncologic colectomy.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly verified current specialty guideline, recommendation 2. The base and extent govern resection. Suspected mucinous lesions require avoidance of rupture. No automatic operation is specified for extensive peritoneal disease.",
    "applicablePopulation": "An incidentally dilated, unruptured appendix with a separable uninvolved base and no peritoneal deposits.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.small-favorable-net-resection",
    "statement": "A subcentimeter appendiceal NET without unfavorable features can be treated by appendectomy that includes the mesoappendix.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly verified current specialty guideline, recommendation 7. Used as a counterfactual boundary. This packet supplies no universal rule for 1-2-cm tumors or a surveillance schedule.",
    "applicablePopulation": "A completely removed appendiceal NET smaller than 1 cm with favorable histology.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.hepatic-cyst-mri",
    "statement": "A liver lesion with homogeneous fluid signal, a thin smooth wall and no enhancing internal tissue on adequate contrast MRI has the characteristic morphology of a simple hepatic cyst.",
    "sourceIds": [
      "source.appendix-appendicitis.chenin-2022-cysts"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Publisher full text and CC BY 4.0 verified. This is a narrow morphology claim, not a claim that a negative receptor scan excludes all liver metastases. Imaging must actually resolve the represented lesions.",
    "applicablePopulation": "Adequate precontrast, fluid-sensitive and postcontrast liver MRI of previously indeterminate lesions.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.net-resection",
    "statement": "For a nonmetastatic appendiceal NET larger than 2 cm, right hemicolectomy addresses the regional nodal basin even after a margin-negative appendectomy.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly verified current specialty guideline, recommendation 7. The exact greater-than-2-cm threshold is directly stated there. Management of tumors measuring 1-2 cm is withheld as a disputed boundary.",
    "applicablePopulation": "A fit adult with a 2.6-cm well-differentiated appendiceal NET and no distant disease.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.appendix-appendicitis.net-functional-staging",
    "statement": "Somatostatin-receptor PET/CT can clarify staging of a well-differentiated appendiceal NET when cross-sectional imaging leaves possible metastases unresolved.",
    "sourceIds": [
      "source.appendix-appendicitis.ascrs-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly verified current specialty guideline, recommendation 5. Ga-DOTA PET/CT is favored over older receptor scintigraphy for sensitivity and over FDG PET/CT in well-differentiated NETs. Exact comparative performance estimates are excluded.",
    "applicablePopulation": "Patients with appendiceal NETs larger than 2 cm or indeterminate metastatic findings.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.equivocal-bowel-observe",
    "statement": "A high-risk blunt mechanism with nonspecific bowel or mesenteric CT abnormalities warrants inpatient observation with serial assessment rather than reassurance from absence of free air.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-bowel-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One guideline; limited to stable, clinically evaluable patients without a direct operative sign. This is not a blanket rule after a completely normal high-quality CT.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.bowel-direct-sign",
    "statement": "A traumatic bowel-wall defect or convincing extraluminal enteric contrast is a direct indication for prompt surgical exploration.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-bowel-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "One guideline; isolated free fluid or mesenteric stranding does not carry the same implication.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.stable-ct",
    "statement": "In a sustained stable or stabilized adult without an immediate operative indication, IV-contrast CT characterizes abdominal injury beyond what FAST can exclude.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-liver-2020",
      "source.trauma-initial-abdomen.east-liver-2012",
      "source.trauma-initial-abdomen.east-spleen-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Negative FAST is not a general exclusion of visceral or retroperitoneal injury; no sensitivity number is taught.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.evolving-bowel-repeat-ct",
    "statement": "Evolving suspicion after an equivocal initial bowel CT can justify repeat CT while the patient remains stable and has not developed an operative indication.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-bowel-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One guideline; repeat imaging must not delay operation for peritonitis or instability. The question does not teach a fixed interval.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment",
    "statement": "After an equivocal initial CT in suspected blunt bowel injury, WSES supports CT reassessment after a six-hour interval; an evolving suspicious course also supports repeat imaging.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-bowel-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This is a guideline reassessment recommendation for selected equivocal or evolving presentations, not a mandatory universal scan clock, a gameplay wait estimate, or a reason to delay operation for peritonitis. One guideline publication directly supports the six-hour value.",
    "applicablePopulation": "Adults with traumatic abdominal injury receiving hospital care, reviewed here as outside-hospital clinic records.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.unstable-positive-fast",
    "statement": "Persistent circulatory deterioration after resuscitation together with intraperitoneal fluid on FAST supports urgent trauma laparotomy rather than transport for CT.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-bowel-2022",
      "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
      "source.trauma-initial-abdomen.east-liver-2012"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "A transient pressure rise does not establish sustained stabilization; this claim does not choose among hybrid-suite interventions in a sustained responder.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
    "statement": "Persistent pelvic hemorrhage after angiography despite pelvic stabilization is an indication to consider preperitoneal packing for bleeding not controlled by an arterial procedure.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-pelvis-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One older guideline publication; does not rank initial packing against immediate angiography in every center or select orthopedic fixation.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
    "statement": "Persistent pelvic bleeding with an arterial CT focus after stabilization or packing supports angiography and possible selective embolization, including repeat angiography.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-pelvis-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One older guideline; arterial and nonarterial bleeding may coexist. An isolated fracture pattern does not identify the bleeding source.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.pelvic-fast-limitation",
    "statement": "Absence of intraperitoneal fluid on FAST does not exclude pelvic retroperitoneal hemorrhage.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-pelvis-2017",
      "source.trauma-initial-abdomen.wses-liver-2020"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "It also does not prove the pelvis is the only source; associated thoracic, abdominal and external sources must be assessed.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.contrast-phase-interpretation",
    "statement": "Multiphase trauma CT can distinguish an enlarging pool of extravasated arterial contrast from a contained vascular sac that follows blood-pool enhancement.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-liver-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One guideline supports active-versus-contained vascular interpretation. The constructed report is text, not a simulated scan or a performance claim.",
    "applicablePopulation": "Adults with the specific abdominal/pelvic injury and care phase described in the mapped draft.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.bladder-cystography",
    "statement": "Gross hematuria after blunt pelvic trauma warrants retrograde cystography, using conventional radiography or a CT cystogram.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-uro-2019",
      "source.trauma-initial-abdomen.east-bladder-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Cystography follows urgent hemorrhage control. If urethral injury is suspected, urethral assessment precedes catheter placement.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.passive-ct-insufficient",
    "statement": "Renally excreted contrast reaching a partially filled bladder on ordinary trauma CT does not substitute for retrograde bladder distension during cystography.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-uro-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "One guideline publication; distinguishes an unperformed adequate acquisition from a missing exported image series.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.renal-excretory-phase",
    "statement": "Delayed excretory imaging evaluates urinary extravasation and ureteral continuity beyond the arterial and venous trauma CT phases.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-uro-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "One guideline publication; does not require an invented acquisition delay or presume a missing series was never acquired.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.urethral-assessment",
    "statement": "When traumatic urethral injury is suspected, retrograde urethrography or appropriate urethroscopy evaluates the urethra; urethral assessment precedes bladder catheterization when feasible.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-uro-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single guideline; modality varies with sex and specific injury. The mapped patient already has documented atraumatic catheter access.",
    "applicablePopulation": "Adults with the specific abdominal/pelvic injury and care phase described in the mapped draft.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.complex-bladder",
    "statement": "Bladder-neck involvement, intravesical bone injury or associated rectal/vaginal injury can make an extraperitoneal bladder rupture a repair problem rather than simple catheter care.",
    "sourceIds": [
      "source.trauma-initial-abdomen.east-bladder-2019",
      "source.trauma-initial-abdomen.wses-uro-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Do not equate a pelvic fracture by itself with every listed complex feature; the precise boundary remains for clinician review.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.extraperitoneal-bladder",
    "statement": "Uncomplicated traumatic extraperitoneal bladder rupture can be treated with catheter drainage rather than routine repair.",
    "sourceIds": [
      "source.trauma-initial-abdomen.east-bladder-2019",
      "source.trauma-initial-abdomen.wses-uro-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Complex injuries, adjacent organ injury and planned relevant pelvic surgery may alter management. WSES wording around fracture-associated complexity is broader than EAST; no fracture-alone repair rule is taught.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.distal-pancreatic-duct",
    "statement": "A distal pancreatic transection with main-duct disruption is a resectional injury; distal pancreatectomy is supported in a stable adult requiring operative treatment.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
      "source.trauma-initial-abdomen.east-pancreas-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Both guidelines are conditional/low-quality here. Proximal injuries and endoscopically bridgeable selected injuries need a different discussion; the draft is an intraoperative distal complete transection.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.minor-pancreas",
    "statement": "A minor pancreatic injury with an intact main duct generally permits nonresectional management; intraoperative drainage may be used.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
      "source.trauma-initial-abdomen.east-pancreas-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Duct status must be adequately assessed, not inferred from a normal early enzyme value.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.pancreatic-duct-evaluate",
    "statement": "If duct integrity remains uncertain after CT, further duct assessment with MRCP or ERCP can change pancreatic injury management.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
      "source.trauma-initial-abdomen.east-pancreas-2017"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Neither option is ranked universally; the draft does not claim a normal MRCP invariably excludes duct injury or rank the two tests.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.duodenal-complex",
    "statement": "Destructive duodenopancreatic injury may need complex reconstruction; shock favors damage control with reconstruction staged by experienced teams.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One guideline; do not teach routine pancreaticoduodenectomy or pyloric exclusion for an otherwise repairable duodenal tear.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction",
    "statement": "Pancreaticojejunostomy is a described specialist reconstructive option in selected severe pancreatic injuries; limited evidence does not make it routine for isolated distal duct transection.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
      "source.trauma-initial-abdomen.east-pancreas-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "WSES describes selected reconstructions; EAST includes very limited severe-injury reports. This is an existence/selection boundary, not a rule favoring Roux-en-Y reconstruction for every proximal injury.",
    "applicablePopulation": "Adults with the specific abdominal/pelvic injury and care phase described in the mapped draft.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.contained-zone-two",
    "statement": "During exploration of an unstable adult trauma patient, a stable nonexpanding zone-II renal hematoma need not be opened; instability may come from another injury.",
    "sourceIds": [
      "source.trauma-initial-abdomen.east-renal-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Conditional EAST 2023 recommendation from limited observational data. Stable describes the hematoma, not the patient. Do not generalize to an expanding/pulsatile hematoma or central vascular injury.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.renal-preservation",
    "statement": "When an expanding renal hematoma requires intervention, kidney-preserving techniques are conditionally favored over automatic nephrectomy when feasible.",
    "sourceIds": [
      "source.trauma-initial-abdomen.east-renal-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Conditional low-quality evidence; life-saving nephrectomy remains possible when repair cannot control hemorrhage.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.small-bowel-repair",
    "statement": "A viable nondestructive small-bowel laceration can undergo primary repair; loss of more than half the circumference or mesenteric devascularization argues against that repair.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-bowel-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One guideline; the greater-than-50% boundary is directly stated in its primary-repair section. No universal suture technique or mandatory stoma rule is taught.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.small-bowel-anastomosis-selection",
    "statement": "After necessary small-bowel resection, viable bowel and restored physiology can support immediate anastomosis; unresolved perfusion, resuscitation or control tasks can favor staged reconstruction.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-bowel-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Choice remains patient- and operation-specific. No exact blood, pressor, pH or contamination threshold is asserted. WSES is the direct publication; this is not independent cohort replication.",
    "applicablePopulation": "Adults with traumatic abdominal injury receiving hospital care, reviewed here as outside-hospital clinic records.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.damage-control",
    "statement": "Continuing hypotension, worsening acidosis, hypothermia and coagulopathic bleeding favor an abbreviated operation with hemorrhage/contamination control and temporary abdominal closure.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-open-abdomen-2018",
      "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Physiology and unfinished surgical tasks govern the decision; no universal numerical trigger or exact resuscitation prescription is taught.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.trauma-initial-abdomen.keep-open",
    "statement": "An open abdomen may remain necessary while resuscitation, contamination control, deferred reconstruction or reassessment of questionable bowel viability is unfinished.",
    "sourceIds": [
      "source.trauma-initial-abdomen.wses-open-abdomen-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate guideline publication; does not imply that edema or a trauma diagnosis mandates an open abdomen.",
    "applicablePopulation": "Adults with abdominal or pelvic trauma in a trauma-capable hospital.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-respiratory-ventilation.air-trapping",
    "statement": "In severe obstructive airflow limitation, incomplete exhalation can cause intrinsic PEEP; reducing respiratory rate can lengthen expiration and lessen trapping despite persistent hypercapnia.",
    "sourceIds": [
      "source.critical-respiratory-ventilation.gayen2024",
      "source.critical-respiratory-ventilation.aarc-pva2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Review directly supports the rate action; assessment guideline independently supports checking auto-PEEP. No numeric rate, safe pH or external-PEEP prescription is generalized.",
    "applicablePopulation": "Adults in the stated outside-hospital record; clinic encounter is retrospective review.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-respiratory-ventilation.plateau",
    "statement": "During passive ventilation, an end-inspiratory hold measures plateau pressure and helps separate a flow-dependent peak-pressure increase from persistent static pressure loading.",
    "sourceIds": [
      "source.critical-respiratory-ventilation.aarc-pva2024",
      "source.critical-respiratory-ventilation.gayen2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Acquisition requires minimal patient effort and no major leak; unchanged delivered volume, flow and measured total PEEP are necessary for matched inference.",
    "applicablePopulation": "Adults in the stated outside-hospital record; clinic encounter is retrospective review.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-respiratory-ventilation.niv-rescue",
    "statement": "NIV should generally not delay reintubation for established post-extubation respiratory failure in the general non-COPD, non-postoperative population.",
    "sourceIds": [
      "source.critical-respiratory-ventilation.ers-ats-niv2017"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Conditional low-certainty guidance; COPD and postoperative populations are exceptions to generalization. Case uses medical pneumonia and worsening fatigue.",
    "applicablePopulation": "Adults in the stated outside-hospital record; clinic encounter is retrospective review.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.critical-respiratory-ventilation.niv-failure",
    "statement": "Immediate clinical deterioration during an NIV trial requires prompt reassessment for invasive ventilation rather than extending the mask trial to normalize saturation.",
    "sourceIds": [
      "source.critical-respiratory-ventilation.ers-ats-niv2017"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single joint guideline; key case has worsening consciousness, effort and acidemia together, not a universal pH-alone intubation threshold.",
    "applicablePopulation": "Adults in the stated outside-hospital record; clinic encounter is retrospective review.",
    "lastCheckedOn": "2026-11-11"
  }
];
export const PROGRAM_BATCH1_SOURCES:(ClinicalSource&Record<string,unknown>)[]=[
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.sbo.wses-2018",
    "title": "Bologna guidelines for adhesive small bowel obstruction, 2017 update",
    "completeCitation": "ten Broek RPG, Krielen P, Di Saverio S, Coccolini F, Biffl WL, Ansaloni L, et al. Bologna guidelines for diagnosis and management of adhesive small bowel obstruction (ASBO): 2017 update of the evidence-based guidelines from the world society of emergency surgery ASBO working group. World J Emerg Surg. 2018;13:24. doi:10.1186/s13017-018-0185-2.",
    "organizationOrJournal": "World Society of Emergency Surgery / World Journal of Emergency Surgery",
    "authors": [
      "Richard PG ten Broek",
      "P Krielen",
      "Salomone Di Saverio",
      "Federico Coccolini",
      "Walter L Biffl",
      "Luca Ansaloni",
      "et al."
    ],
    "publicationYear": 2018,
    "doi": "10.1186/s13017-018-0185-2",
    "pmid": "29946347",
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-018-0185-2",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article rights section explicitly grants CC BY 4.0. Independent atomic factual synthesis with attribution and original constructed patients. Source expression, algorithms and figures are excluded. Existing source identity retained. First repository access 2026-09-28. Targeted online recheck 2026-11-11.",
    "authorityAssessment": "WSES society guideline addressing adhesive SBO diagnosis, urgency, observation and contrast. The guideline is older and exact observation duration rests on limited evidence.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.small-bowel-obstruction-ileus.transition-pattern",
      "claim.small-bowel-obstruction-ileus.nonoperative-eligibility",
      "claim.small-bowel-obstruction-ileus.nonoperative-support",
      "claim.small-bowel-obstruction-ileus.closed-loop-risk",
      "claim.small-bowel-obstruction-ileus.deterioration-operation",
      "claim.small-bowel-obstruction-ileus.contrast-prognosis",
      "claim.small-bowel-obstruction-ileus.trial-duration",
      "claim.small-bowel-obstruction-ileus.contrast-viability-limit",
      "claim.small-bowel-obstruction-ileus.postoperative-reassessment",
      "claim.small-bowel-obstruction-ileus.virgin-abdomen-trial",
      "claim.small-bowel-obstruction-ileus.laparoscopic-selection",
      "claim.small-bowel-obstruction-ileus.contrast-therapeutic-disagreement",
      "claim.small-bowel-obstruction-ileus.ct-assessment",
      "claim.small-bowel-obstruction-ileus.plain-film-limit",
      "claim.small-bowel-obstruction-ileus.alternative-imaging",
      "claim.small-bowel-obstruction-ileus.adhesive-operation-target",
      "claim.small-bowel-obstruction-ileus.recurrence-not-acute-indication",
      "claim.small-bowel-obstruction-ileus.changed-course-reassessment"
    ]
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.sbo.east-2012",
    "title": "Evaluation and management of small-bowel obstruction, EAST guideline",
    "completeCitation": "Maung AA, Johnson DC, Piper GL, Barbosa RR, Rowell SE, Bokhari F, Collins JN, Gordon JR, Ra JH, Kerwin AJ. Evaluation and management of small-bowel obstruction: an Eastern Association for the Surgery of Trauma practice management guideline. J Trauma Acute Care Surg. 2012;73(5 Suppl 4):S362-S369. doi:10.1097/TA.0b013e31827019de.",
    "organizationOrJournal": "Eastern Association for the Surgery of Trauma",
    "authors": [
      "Adrian A Maung",
      "Dirk C Johnson",
      "Greta L Piper",
      "Ronald R Barbosa",
      "Susan E Rowell",
      "Faran Bokhari",
      "Jay N Collins",
      "Joseph R Gordon",
      "Jin H Ra",
      "Andrew J Kerwin"
    ],
    "publicationYear": 2012,
    "doi": "10.1097/TA.0b013e31827019de",
    "pmid": "23114494",
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/smallbowel-obstruction-evaluation-and-management-of",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Targeted factual verification of copyrighted society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyright reserved. Targeted factual checking and citation only. Terms at https://www.east.org/terms-of-use reviewed 2026-11-11, with no explicit AI-use prohibition observed in that page. No protected expression reproduced. Existing source identity retained. First repository access 2026-09-28.",
    "authorityAssessment": "Independent society cross-check for deterioration, CT assessment and initial nonoperative management. Publication predates newer contrast trials.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.small-bowel-obstruction-ileus.transition-pattern",
      "claim.small-bowel-obstruction-ileus.nonoperative-eligibility",
      "claim.small-bowel-obstruction-ileus.nonoperative-support",
      "claim.small-bowel-obstruction-ileus.closed-loop-risk",
      "claim.small-bowel-obstruction-ileus.deterioration-operation",
      "claim.small-bowel-obstruction-ileus.contrast-prognosis",
      "claim.small-bowel-obstruction-ileus.trial-duration",
      "claim.small-bowel-obstruction-ileus.contrast-viability-limit",
      "claim.small-bowel-obstruction-ileus.postoperative-reassessment",
      "claim.small-bowel-obstruction-ileus.laparoscopic-selection",
      "claim.small-bowel-obstruction-ileus.contrast-therapeutic-disagreement",
      "claim.small-bowel-obstruction-ileus.ct-assessment",
      "claim.small-bowel-obstruction-ileus.plain-film-limit",
      "claim.small-bowel-obstruction-ileus.alternative-imaging",
      "claim.small-bowel-obstruction-ileus.adhesive-operation-target",
      "claim.small-bowel-obstruction-ileus.intravenous-ct-perfusion",
      "claim.small-bowel-obstruction-ileus.changed-course-reassessment"
    ]
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.small-bowel-obstruction-ileus.wses-virgin-abdomen-2021",
    "title": "Diagnosis and management of small bowel obstruction in virgin abdomen",
    "completeCitation": "Amara Y, Leppaniemi A, Catena F, Ansaloni L, Sugrue M, Fraga GP, Coccolini F, Biffl WL, Peitzman AB, Kluger Y, Sartelli M, Moore EE, Di Saverio S, Darwish E, Endo C, van Goor H, ten Broek RP. Diagnosis and management of small bowel obstruction in virgin abdomen: a WSES position paper. World J Emerg Surg. 2021;16:36. doi:10.1186/s13017-021-00379-8.",
    "organizationOrJournal": "World Society of Emergency Surgery / World Journal of Emergency Surgery",
    "authors": [
      "Yousef Amara",
      "Ari Leppaniemi",
      "Fausto Catena",
      "Luca Ansaloni",
      "Michael Sugrue",
      "Gustavo P Fraga",
      "Federico Coccolini",
      "Walter L Biffl",
      "Andrew B Peitzman",
      "Yoram Kluger",
      "Massimo Sartelli",
      "Ernest E Moore",
      "Salomone Di Saverio",
      "Esfo Darwish",
      "Chikako Endo",
      "Harry van Goor",
      "Richard P ten Broek"
    ],
    "publicationYear": 2021,
    "doi": "10.1186/s13017-021-00379-8",
    "pmid": "34217331",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8254282/",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific license checked at copyright/license section. Attribution to Amara and colleagues. Independent factual synthesis. A contrast sentence in this publication appears internally inverted, so contrast timing claims use Bologna guidance and independent checking.",
    "authorityAssessment": "WSES position paper, supported principally by small retrospective cohorts. Supports selective nonoperative care and subsequent etiologic evaluation, with low-certainty population limits.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.small-bowel-obstruction-ileus.normal-lactate-limit",
      "claim.small-bowel-obstruction-ileus.virgin-abdomen-trial",
      "claim.small-bowel-obstruction-ileus.virgin-followup"
    ]
  },
  {
    "contentVersion": "question-topic-small-bowel-obstruction-ileus.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.small-bowel-obstruction-ileus.wses-ifso-oba-2022",
    "title": "OBA guidelines for acute abdomen after bariatric surgery",
    "completeCitation": "De Simone B, Chouillard E, Ramos AC, Donatelli G, Pintar T, Gupta R, et al. Operative management of acute abdomen after bariatric surgery in the emergency setting: the OBA guidelines. World J Emerg Surg. 2022;17:51. doi:10.1186/s13017-022-00452-w. Corrected 2022 Nov 7.",
    "organizationOrJournal": "World Society of Emergency Surgery / International Federation for the Surgery of Obesity and Metabolic Disorders",
    "authors": [
      "Belinda De Simone",
      "Elie Chouillard",
      "Almino C Ramos",
      "Gianfranco Donatelli",
      "Tadeja Pintar",
      "Rahul Gupta",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1186/s13017-022-00452-w",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-022-00452-w",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Corrected publisher version and article CC BY 4.0 section reviewed. Independent synthesis restricted to obstruction urgency. Bariatric reconstruction, fistula repair and procedure technique remain outside this lane.",
    "authorityAssessment": "Multisociety guidance for altered-anatomy emergencies. Persistent post-RYGB pain can warrant exploration despite unrevealing testing. Strong recommendations have low-quality evidence.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.small-bowel-obstruction-ileus.normal-lactate-limit",
      "claim.small-bowel-obstruction-ileus.rygb-persistent-pain",
      "claim.small-bowel-obstruction-ileus.rygb-negative-imaging-limit"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-renal-organ-support.rrt-context",
      "claim.critical-renal-organ-support.rrt-pulmonary",
      "claim.critical-renal-organ-support.uf-hypovolemia",
      "claim.critical-renal-organ-support.clearance-versus-removal",
      "claim.critical-renal-organ-support.citrate-bleeding",
      "claim.critical-renal-organ-support.citrate-monitoring",
      "claim.critical-renal-organ-support.citrate-accumulation",
      "claim.critical-renal-organ-support.rrt-weaning",
      "claim.critical-renal-organ-support.slow-clearance-neuro",
      "claim.critical-renal-organ-support.dose-outcome",
      "claim.critical-renal-organ-support.stable-rrt-modality"
    ],
    "key": "srlf-gfrup-2025",
    "title": "Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference",
    "completeCitation": "Jourdain M, Gragueb Chatti I, Housni B, et al. Renal replacement therapy in an intensive care unit: guidelines from the SRLF-GFRUP consensus conference. Ann Intensive Care. 2025;15:100. doi:10.1186/s13613-025-01517-0.",
    "organizationOrJournal": "Annals of Intensive Care / SRLF and GFRUP",
    "authors": [
      "Mercè Jourdain",
      "Ines Gragueb Chatti",
      "Brahim Housni",
      "Pierre Jaquet",
      "Mélissa Jezequel",
      "Oumar Kane",
      "Béatrice La Combe",
      "Mickael Landais",
      "Mehdi Marzouk",
      "Etienne de Montmollin",
      "Guillaume Mortamet",
      "Mai-Anh Nay",
      "Charlotte Salmon-Gandonnière",
      "Sophie Perinel-Ragey",
      "Jérôme Rambaud",
      "Joanna Schmitt",
      "Marie Simon",
      "Julie Starck",
      "Arnaud W. Thille",
      "Pierre-François Dequin"
    ],
    "publicationYear": 2025,
    "doi": "10.1186/s13613-025-01517-0",
    "pmid": "40668437",
    "officialUrl": "https://link.springer.com/article/10.1186/s13613-025-01517-0",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "authorityAssessment": "Current multisociety adult/pediatric ICU consensus using GRADE. Adult recommendations are used. Several bedside actions rely on low-certainty panel opinion.",
    "publicationIdentity": "srlf-gfrup-2025",
    "verificationLocator": "Sections 1, 2, 4 and 5. Recommendations 1.1C, 1.1E, 1.2, 3.1, 4.4, 4.5, 6.2 and 7.2.",
    "id": "src.critical-renal-organ-support.srlf-gfrup-2025",
    "reuseNotes": "Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. ",
    "termsCheckedOn": "2026-11-11",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "aiAccessAssessment": "Article-level rights and targeted society verification reviewed. No publisher AI-answering service was used. Rights assessment and medical authority are separate."
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-renal-organ-support.citrate-bleeding",
      "claim.critical-renal-organ-support.citrate-monitoring",
      "claim.critical-renal-organ-support.citrate-accumulation",
      "claim.critical-renal-organ-support.citrate-response"
    ],
    "key": "citrate-consensus-2023",
    "title": "Management of regional citrate anticoagulation for CRRT — Chinese emergency medical doctor consensus",
    "completeCitation": "Liu SY, Xu SY, Yin L, et al. Management of regional citrate anticoagulation for continuous renal replacement therapy: guideline recommendations from Chinese emergency medical doctor consensus. Mil Med Res. 2023;10:23. doi:10.1186/s40779-023-00457-9.",
    "organizationOrJournal": "Military Medical Research / Emergency Medical Doctor Branch, Chinese Medical Doctor Association",
    "authors": [
      "Shu-Yuan Liu",
      "Sheng-Yong Xu",
      "Lu Yin"
    ],
    "authorListNote": "First three authors in standard et al. citation. Complete author list is available at the DOI.",
    "publicationYear": 2023,
    "doi": "10.1186/s40779-023-00457-9",
    "pmid": "37248514",
    "officialUrl": "https://link.springer.com/article/10.1186/s40779-023-00457-9",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "authorityAssessment": "Specialist consensus on citrate monitoring and adverse effects. Some recommendations have low-certainty support and region-specific fluid formulations.",
    "publicationIdentity": "citrate-consensus-2023",
    "verificationLocator": "Recommendations 9–12 and the citrate-accumulation discussion.",
    "id": "src.critical-renal-organ-support.citrate-consensus-2023",
    "reuseNotes": "Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. ",
    "termsCheckedOn": "2026-11-11",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "aiAccessAssessment": "Article-level rights and targeted society verification reviewed. No publisher AI-answering service was used. Rights assessment and medical authority are separate."
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-renal-organ-support.volume-context",
      "claim.critical-renal-organ-support.diuretic-congestion",
      "claim.critical-renal-organ-support.fluid-excess",
      "claim.critical-renal-organ-support.urine-indices",
      "claim.critical-renal-organ-support.kidney-assessment",
      "claim.critical-renal-organ-support.rrt-context",
      "claim.critical-renal-organ-support.rrt-pulmonary",
      "claim.critical-renal-organ-support.clearance-versus-removal",
      "claim.critical-renal-organ-support.rrt-weaning",
      "claim.critical-renal-organ-support.creatinine-on-circuit",
      "claim.critical-renal-organ-support.slow-clearance-neuro",
      "claim.critical-renal-organ-support.dose-outcome",
      "claim.critical-renal-organ-support.aki-followup",
      "claim.critical-renal-organ-support.stable-rrt-modality",
      "claim.critical-renal-organ-support.urine-solute-indices-limits.r2"
    ],
    "key": "japanese-aki-2018",
    "title": "The Japanese Clinical Practice Guideline for acute kidney injury 2016",
    "completeCitation": "Doi K, Nishida O, Shigematsu T, et al., Japanese Clinical Practice Guideline for Acute Kidney Injury 2016 Committee. The Japanese Clinical Practice Guideline for acute kidney injury 2016. J Intensive Care. 2018;6:48. doi:10.1186/s40560-018-0308-6.",
    "organizationOrJournal": "Journal of Intensive Care / Japanese multidisciplinary AKI committee",
    "authors": [
      "Kent Doi",
      "Osamu Nishida",
      "Takashi Shigematsu",
      "Tomohito Sadahiro",
      "Noritomo Itami",
      "Kunitoshi Iseki",
      "Yukio Yuzawa",
      "Hirokazu Okada",
      "Daisuke Koya",
      "Hideyasu Kiyomoto",
      "Yugo Shibagaki",
      "Kenichi Matsuda",
      "Akihiko Kato",
      "Terumasa Hayashi",
      "Tomonari Ogawa",
      "Tatsuo Tsukamoto",
      "Eisei Noiri",
      "Shigeo Negi",
      "Koichi Kamei",
      "Hirotsugu Kitayama",
      "Naoki Kashihara",
      "Toshiki Moriyama",
      "Yoshio Terada",
      "Japanese Clinical Practice Guideline for Acute Kidney Injury 2016 Committee"
    ],
    "publicationYear": 2018,
    "doi": "10.1186/s40560-018-0308-6",
    "pmid": "30123509",
    "officialUrl": "https://link.springer.com/article/10.1186/s40560-018-0308-6",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "authorityAssessment": "Multisociety guideline based mainly on evidence through 2015–2016. Co-publications count once. Regional dose and anticoagulation practice is not universalized.",
    "publicationIdentity": "japanese-aki-2018",
    "verificationLocator": "CQ2, CQ4-3, CQ5-3, CQ7-1 to CQ7-4 and CQ8.",
    "id": "src.critical-renal-organ-support.japanese-aki-2018",
    "reuseNotes": "Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. ",
    "termsCheckedOn": "2026-11-11",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "aiAccessAssessment": "Article-level rights and targeted society verification reviewed. No publisher AI-answering service was used. Rights assessment and medical authority are separate."
  },
  {
    "contentVersion": "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-renal-organ-support.urine-indices",
      "claim.critical-renal-organ-support.kidney-assessment",
      "claim.critical-renal-organ-support.pressure-organ-failure",
      "claim.critical-renal-organ-support.sediment-scope",
      "claim.critical-renal-organ-support.urine-solute-indices-limits.r2"
    ],
    "key": "aki-workup-2016",
    "title": "Acute kidney injury 2016: diagnosis and diagnostic workup",
    "completeCitation": "Ostermann M, Joannidis M. Acute kidney injury 2016: diagnosis and diagnostic workup. Crit Care. 2016;20:299. doi:10.1186/s13054-016-1478-z.",
    "organizationOrJournal": "Critical Care",
    "authors": [
      "Marlies Ostermann",
      "Michael Joannidis"
    ],
    "publicationYear": 2016,
    "doi": "10.1186/s13054-016-1478-z",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13054-016-1478-z",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "authorityAssessment": "Diagnostic review addressing limitations of urinary indices and creatinine. Supplies diagnostic physiology, with separate current guidance for management.",
    "publicationIdentity": "aki-workup-2016",
    "verificationLocator": "Urine microscopy, urinary electrolytes, ultrasound, creatinine limitations and biopsy. No claim uses the review’s quotation of NICE.",
    "id": "src.critical-renal-organ-support.aki-workup-2016",
    "reuseNotes": "Targeted factual verification and independent original synthesis. Source expression, tables, algorithms, figures and excerpts are excluded. Attribution and article-specific licence links are retained. ",
    "termsCheckedOn": "2026-11-11",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "aiAccessAssessment": "Article-level rights and targeted society verification reviewed. No publisher AI-answering service was used. Rights assessment and medical authority are separate."
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-shock-resuscitation.monnet-fluid-response-2016",
    "title": "Prediction of fluid responsiveness",
    "completeCitation": "Monnet X, Marik PE, Teboul JL. Prediction of fluid responsiveness: an update. Annals of Intensive Care. 2016;6:111. doi:10.1186/s13613-016-0216-7.",
    "organizationOrJournal": "Annals of Intensive Care",
    "authors": [
      "Xavier Monnet",
      "Paul E. Marik",
      "Jean-Louis Teboul"
    ],
    "publicationYear": 2016,
    "doi": "10.1186/s13613-016-0216-7",
    "pmid": "27858374",
    "officialUrl": "https://link.springer.com/article/10.1186/s13613-016-0216-7",
    "accessedOn": "2026-11-11",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified. Credit Monnet, Marik and Teboul, Annals of Intensive Care, and https://creativecommons.org/licenses/by/4.0/. Original statements and fictional numerical examples. No figure, table, wording or source case copied.",
    "authorityAssessment": "Detailed physiology review for test validity and the distinction between fluid responsiveness, perfusion need and fluid risk. Older technical source cross-checked against current ESICM and SSC principles. No outcome benefit or universal cutoff inferred.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.critical-shock-resuscitation.dynamic-over-static",
      "claim.critical-shock-resuscitation.ivc-variation-limitations",
      "claim.critical-shock-resuscitation.ppv-validity",
      "claim.critical-shock-resuscitation.plr-flow",
      "claim.critical-shock-resuscitation.fluid-need-risk",
      "claim.critical-shock-resuscitation.lactate-context",
      "claim.critical-shock-resuscitation.rv-fluid-risk"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-shock-resuscitation.ssc-2026",
    "title": "Surviving Sepsis Campaign adult guidelines 2026",
    "completeCitation": "Prescott HC, Antonelli M, Alhazzani W, et al. Surviving Sepsis Campaign: international guidelines for management of sepsis and septic shock 2026. Intensive Care Medicine. 2026;52:863–936. doi:10.1007/s00134-026-08361-1. Parallel publication in Critical Care Medicine. doi:10.1097/CCM.0000000000007075.",
    "organizationOrJournal": "SCCM and ESICM / Intensive Care Medicine / Critical Care Medicine",
    "authors": [
      "Hallie C. Prescott",
      "Massimo Antonelli",
      "Waleed Alhazzani",
      "SSC international guideline panel"
    ],
    "publicationYear": 2026,
    "publicationDateNote": "Published 23 March 2026. Publisher metadata records a correction on 5 May 2026, doi:10.1007/s00134-026-08410-9. Targeted verification used the current society recommendations page, with current ESICM-linked companion materials as a cross-check. Full subscription article was unavailable.",
    "doi": "10.1007/s00134-026-08361-1",
    "pmid": "41870560",
    "officialUrl": "https://survivingsepsis.org/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright SCCM and ESICM, all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification of publicly displayed recommendations. No guideline expression, figure, table, algorithm, source excerpt or article text retained. SCCM terms prohibit automated regular or systematic collection and accumulation. This one-topic check creates original atomic statements and bibliographic links. No corpus or continuing collection. Rights are separately assessed from clinical authority.",
    "authorityAssessment": "Current international multidisciplinary adult sepsis guideline. Conditional recommendations and low or very-low evidence remain conditional in the claims. The two journal publications and companion materials are one guideline, with no independent-source credit.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-shock-resuscitation.plr-flow",
      "claim.critical-shock-resuscitation.norepinephrine-first",
      "claim.critical-shock-resuscitation.peripheral-start",
      "claim.critical-shock-resuscitation.vasopressin-addition",
      "claim.critical-shock-resuscitation.epinephrine-after-dual",
      "claim.critical-shock-resuscitation.epinephrine-cardiac-phenotype",
      "claim.critical-shock-resuscitation.inotrope-low-flow",
      "claim.critical-shock-resuscitation.lactate-context",
      "claim.critical-shock-resuscitation.map-target",
      "claim.critical-shock-resuscitation.higher-map-tradeoff",
      "claim.critical-shock-resuscitation.antibiotic-urgency",
      "claim.critical-shock-resuscitation.pct-initiation",
      "claim.critical-shock-resuscitation.possible-infection-reassessment",
      "claim.critical-shock-resuscitation.early-source-control"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-shock-resuscitation.esicm-shock-2025",
    "title": "ESICM circulatory shock and hemodynamic monitoring 2025",
    "completeCitation": "Monnet X, Messina A, Greco M, et al. ESICM guidelines on circulatory shock and hemodynamic monitoring 2025. Intensive Care Medicine. 2025;51:1971–2012. doi:10.1007/s00134-025-08137-z.",
    "organizationOrJournal": "ESICM / Intensive Care Medicine",
    "authors": [
      "Xavier Monnet",
      "Antonio Messina",
      "Massimiliano Greco",
      "ESICM guideline panel"
    ],
    "publicationYear": 2025,
    "doi": "10.1007/s00134-025-08137-z",
    "pmid": "41236566",
    "officialUrl": "https://link.springer.com/article/10.1007/s00134-025-08137-z",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guideline, public abstract",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Only the publicly readable guideline abstract and official society announcement support the mapped cross-checks. Publisher body is subscription content. Society SharedIt link requested browser verification, and institutional PDF exceeded retrieval limit. No inaccessible detail or search snippet supplies a key.",
    "authorityAssessment": "Current adult shock guideline with graded recommendations and ungraded good-practice statements. Abstract directly supports dynamic assessment, echocardiography and serial perfusion assessment. It cannot verify unexposed technical details.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.critical-shock-resuscitation.dynamic-over-static",
      "claim.critical-shock-resuscitation.fluid-need-risk",
      "claim.critical-shock-resuscitation.pressure-flow-distinction",
      "claim.critical-shock-resuscitation.echo-first"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-shock-resuscitation.jsscg-2024",
    "title": "Japanese sepsis and septic shock clinical practice guideline 2024",
    "completeCitation": "Shime N, Nakada T, Yatabe T, et al. The Japanese Clinical Practice Guidelines for Management of Sepsis and Septic Shock 2024. Journal of Intensive Care. 2025;13:15. doi:10.1186/s40560-025-00776-0.",
    "organizationOrJournal": "Japanese Society of Intensive Care Medicine and Japanese Association for Acute Medicine / Journal of Intensive Care",
    "authors": [
      "Nobuaki Shime",
      "Taka-aki Nakada",
      "Tomoaki Yatabe",
      "J-SSCG 2024 guideline committee"
    ],
    "publicationYear": 2025,
    "publicationDateNote": "Guideline edition 2024, published 14 March 2025. Co-publication represents the same guideline.",
    "doi": "10.1186/s40560-025-00776-0",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s40560-025-00776-0",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified. Credit Shime and colleagues, Journal of Intensive Care, and https://creativecommons.org/licenses/by/4.0/. Independent factual synthesis into fictional applications. No source text, tables, figures or algorithms reproduced.",
    "authorityAssessment": "Independent society guideline with explicit evidence grading. Its recommendations reflect a Japanese practice context. Specific disagreements with SSC are recorded separately.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-shock-resuscitation.norepinephrine-first",
      "claim.critical-shock-resuscitation.peripheral-start",
      "claim.critical-shock-resuscitation.vasopressin-addition",
      "claim.critical-shock-resuscitation.pressure-flow-distinction",
      "claim.critical-shock-resuscitation.inotrope-low-flow",
      "claim.critical-shock-resuscitation.lactate-context",
      "claim.critical-shock-resuscitation.map-target",
      "claim.critical-shock-resuscitation.higher-map-tradeoff",
      "claim.critical-shock-resuscitation.pct-initiation",
      "claim.critical-shock-resuscitation.echo-first"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-shock-resuscitation.mclean-echo-2016",
    "title": "Echocardiography in shock management",
    "completeCitation": "McLean AS. Echocardiography in shock management. Critical Care. 2016;20:275. doi:10.1186/s13054-016-1401-7.",
    "organizationOrJournal": "Critical Care",
    "authors": [
      "Anthony S. McLean"
    ],
    "publicationYear": 2016,
    "doi": "10.1186/s13054-016-1401-7",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13054-016-1401-7",
    "accessedOn": "2026-11-11",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified. Credit McLean, Critical Care, and https://creativecommons.org/licenses/by/4.0/. Independently written observations and applications. No diagnostic image, tracing, figure or prose reproduced.",
    "authorityAssessment": "Physiology-oriented critical-care echocardiography review. Current ESICM supports the general first-line echo role. Tamponade-specific management has one directly inspected adequate source in this packet and needs named clinician review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.critical-shock-resuscitation.pressure-flow-distinction",
      "claim.critical-shock-resuscitation.echo-first",
      "claim.critical-shock-resuscitation.tamponade-physiology",
      "claim.critical-shock-resuscitation.tamponade-drainage",
      "claim.critical-shock-resuscitation.rv-fluid-risk"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-critical-shock-resuscitation.2026-11-11.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-shock-resuscitation.minami-tee-2026",
    "title": "TEE after limited transthoracic imaging in the cardiovascular ICU",
    "completeCitation": "Minami K, Saga T, Kato M, Nakayama D, Morinaga M, Shimatani T, Takeuchi M. Derivation of a pragmatic three-view protocol for point-of-care transesophageal echocardiography in the cardiovascular ICU: a real-world cohort study. Critical Care. 2026;30:154. doi:10.1186/s13054-026-05925-x.",
    "organizationOrJournal": "Critical Care",
    "authors": [
      "Kimito Minami",
      "Takashi Saga",
      "Mitsuharu Kato",
      "Daisuke Nakayama",
      "Masahiro Morinaga",
      "Tatsutoshi Shimatani",
      "Muneyuki Takeuchi"
    ],
    "publicationYear": 2026,
    "publicationDateNote": "Published 1 March 2026. Publisher lists version of record 7 April 2026.",
    "doi": "10.1186/s13054-026-05925-x",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13054-026-05925-x",
    "accessedOn": "2026-11-11",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified. Credit Minami and colleagues, Critical Care, and https://creativecommons.org/licenses/by/4.0/. Independently written claims and a fictional acquisition report. No patient case, view set, image, table or article wording reproduced.",
    "authorityAssessment": "Current retrospective single-center cardiovascular-ICU cohort. Supports the observed use of TEE when TTE is nondiagnostic and describes postoperative acoustic barriers. Application to this abdominal postoperative patient is a physical-acquisition inference, with the older general shock review as a cross-check. No outcome benefit or universal TEE superiority is inferred.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-shock-resuscitation.r2-limited-tte",
      "claim.critical-shock-resuscitation.r2-tee-after-limited-tte"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.appendix-appendicitis.ascrs-2025",
    "title": "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
    "completeCitation": "Gaertner WB, Brown SR, Deutsch M, Jafari MD, Krane MK, Simianu VV, Valente MA, Lightner AL, Feingold DL, Paquette IM. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Appendiceal Neoplasms. Dis Colon Rectum. 2025;68(7):815-834. doi:10.1097/DCR.0000000000003796.",
    "organizationOrJournal": "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum",
    "authors": [
      "Wolfgang B. Gaertner",
      "Shaun R. Brown",
      "Michael Deutsch",
      "Mehraneh D. Jafari",
      "Mukta K. Krane",
      "Vlad V. Simianu",
      "Michael A. Valente",
      "Amy L. Lightner",
      "Daniel L. Feingold",
      "Ian M. Paquette"
    ],
    "publicationYear": 2025,
    "doi": "10.1097/DCR.0000000000003796",
    "pmid": "40262165",
    "officialUrl": "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982016/all/Management_of_Appendiceal_Neoplasms__2025_?q=management+practice",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASCRS 2025. Targeted factual verification only.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Read the public society guideline and publicly linked guideline PDF for targeted factual checks. The former free-resource URL now points to another location. No authentication or paywall bypass was used. ASCRS Access to and Use of Works Policy checked. No content, table, algorithm, image or source excerpt is retained. The published guideline is a factual cross-check, with independently written claims and fictional cases.",
    "authorityAssessment": "Current specialty GRADE guideline, literature search through February 2025. Several recommendations rest on observational data. Many exact tumor-management decisions have this single directly verified publication in this packet.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.appendix-appendicitis.intermediate-net-boundary",
      "claim.appendix-appendicitis.lamn-complete-resection",
      "claim.appendix-appendicitis.small-favorable-net-resection",
      "claim.appendix-appendicitis.post-abscess-neoplasm",
      "claim.appendix-appendicitis.colonoscopy-neoplasm",
      "claim.appendix-appendicitis.interval-tissue-evaluation",
      "claim.appendix-appendicitis.intact-abnormal-appendix",
      "claim.appendix-appendicitis.lamn-margin",
      "claim.appendix-appendicitis.lamn-versus-invasive",
      "claim.appendix-appendicitis.adenocarcinoma-colectomy",
      "claim.appendix-appendicitis.goblet-cell-identity",
      "claim.appendix-appendicitis.net-functional-staging",
      "claim.appendix-appendicitis.net-resection",
      "claim.appendix-appendicitis.peritoneal-mucin-treatment",
      "claim.appendix-appendicitis.complete-specimen-assessment",
      "claim.appendix-appendicitis.cellular-deposit-assessment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.appendix-appendicitis.chenin-2022-cysts",
    "title": "MRI morphology of simple hepatic cysts (Chenin et al., 2022)",
    "completeCitation": "Chenin M, Paisant A, Lebigot J, Bazeries P, Debbi K, Ronot M, Laurent V, Aub? C. Cystic liver lesions: a pictorial review. Insights Imaging. 2022;13:116. doi:10.1186/s13244-022-01242-3.",
    "organizationOrJournal": "Insights into Imaging",
    "authors": [
      "M?gane Chenin",
      "Anita Paisant",
      "J?r?me Lebigot",
      "Paul Bazeries",
      "Kawtar Debbi",
      "Maxime Ronot",
      "Val?rie Laurent",
      "Christophe Aub?"
    ],
    "publicationYear": 2022,
    "doi": "10.1186/s13244-022-01242-3",
    "pmid": "35838923",
    "officialUrl": "https://link.springer.com/article/10.1186/s13244-022-01242-3",
    "accessedOn": "2026-11-11",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level Rights and permissions verified at the publisher. Attribution to Chenin et al. Facts independently restated for a fictional staging record; no prose, table, algorithm, figure or image reproduced. The new application changes the context to an appendiceal NET case.",
    "authorityAssessment": "Peer-reviewed radiology educational review, used only for established cyst imaging morphology and the boundary of noninvasive characterization. It supplies no appendiceal NET management recommendation and is not independent corroboration of the surgical size threshold.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.appendix-appendicitis.hepatic-cyst-mri"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.wses-bowel-2022",
    "title": "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
    "completeCitation": "Smyth L, Bendinelli C, Lee N, et al. WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment. World J Emerg Surg. 2022;17:13. doi:10.1186/s13017-022-00418-y.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Luke Smyth",
      "Cino Bendinelli",
      "Nicholas Lee",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1186/s13017-022-00418-y",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-022-00418-y",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
    "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "Blunt injury recommendations 1-9",
      "Penetrating injury observation and recommendations",
      "Surgical options / primary repair",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.equivocal-bowel-observe",
      "claim.trauma-initial-abdomen.evolving-bowel-repeat-ct",
      "claim.trauma-initial-abdomen.bowel-direct-sign",
      "claim.trauma-initial-abdomen.small-bowel-repair",
      "claim.trauma-initial-abdomen.bowel-resection-risk",
      "claim.trauma-initial-abdomen.splenic-failure",
      "claim.trauma-initial-abdomen.penetrating-observation",
      "claim.trauma-initial-abdomen.penetrating-operation",
      "claim.trauma-initial-abdomen.unreliable-exam",
      "claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment",
      "claim.trauma-initial-abdomen.small-bowel-anastomosis-selection"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.wses-liver-2020",
    "title": "Liver trauma: WSES 2020 guidelines",
    "completeCitation": "Coccolini F, Coimbra R, Ordonez C, et al. Liver trauma: WSES 2020 guidelines. World J Emerg Surg. 2020;15:24. doi:10.1186/s13017-020-00302-7.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Raul Coimbra",
      "Carlos Ordonez",
      "et al."
    ],
    "publicationYear": 2020,
    "doi": "10.1186/s13017-020-00302-7",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-020-00302-7",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
    "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "Diagnosis",
      "Non-operative and operative management",
      "Complications",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.stable-ct",
      "claim.trauma-initial-abdomen.liver-nonoperative",
      "claim.trauma-initial-abdomen.liver-arterial-bleeding",
      "claim.trauma-initial-abdomen.liver-pseudoaneurysm",
      "claim.trauma-initial-abdomen.biloma-drainage",
      "claim.trauma-initial-abdomen.bile-leak-adjunct",
      "claim.trauma-initial-abdomen.pelvic-fast-limitation",
      "claim.trauma-initial-abdomen.hepatic-devascularized-complication",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation",
      "claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.east-liver-2012",
    "title": "Hepatic Injury, Blunt, Selective Nonoperative Management of",
    "completeCitation": "Stassen NA, Bhullar I, Cheng JD, et al. Nonoperative management of blunt hepatic injury: an Eastern Association for the Surgery of Trauma practice management guideline. J Trauma Acute Care Surg. 2012;73(5 Suppl 4):S288-S293.",
    "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
    "authors": [
      "Nicole A. Stassen",
      "Indermeet Bhullar",
      "Julius D. Cheng",
      "et al."
    ],
    "publicationYear": 2012,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/hepatic-injury-blunt-selective-nonoperative-management-of",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
    "licenseUrl": null,
    "termsUrl": "https://www.east.org/terms-of-use",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
    "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "Level 1-3 recommendations"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.stable-ct",
      "claim.trauma-initial-abdomen.liver-nonoperative",
      "claim.trauma-initial-abdomen.liver-arterial-bleeding",
      "claim.trauma-initial-abdomen.liver-pseudoaneurysm",
      "claim.trauma-initial-abdomen.biloma-drainage",
      "claim.trauma-initial-abdomen.bile-leak-adjunct",
      "claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.east-spleen-2012",
    "title": "Splenic Injury, Blunt, Selective Nonoperative Management of",
    "completeCitation": "Stassen NA, Bhullar I, Cheng JD, et al. Selective nonoperative management of blunt splenic injury: an Eastern Association for the Surgery of Trauma practice management guideline. J Trauma Acute Care Surg. 2012;73(5 Suppl 4):S294-S300.",
    "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
    "authors": [
      "Nicole A. Stassen",
      "Indermeet Bhullar",
      "Julius D. Cheng",
      "et al."
    ],
    "publicationYear": 2012,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/splenic-injury-blunt-selective-nonoperative-management-of",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
    "licenseUrl": null,
    "termsUrl": "https://www.east.org/terms-of-use",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
    "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "Level 1-3 recommendations; unanswered questions"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.stable-ct",
      "claim.trauma-initial-abdomen.splenic-embolization",
      "claim.trauma-initial-abdomen.splenic-observation",
      "claim.trauma-initial-abdomen.splenic-failure"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
    "title": "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
    "completeCitation": "Coccolini F, Kobayashi L, Kluger Y, et al. Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines. World J Emerg Surg. 2019;14:56. doi:10.1186/s13017-019-0278-6.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Leslie Kobayashi",
      "Yoram Kluger",
      "et al."
    ],
    "publicationYear": 2019,
    "doi": "10.1186/s13017-019-0278-6",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-019-0278-6",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
    "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "Diagnosis / duct evaluation",
      "Duodenal non-operative management",
      "Operative management: duodenum and pancreas",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.damage-control",
      "claim.trauma-initial-abdomen.distal-pancreatic-duct",
      "claim.trauma-initial-abdomen.minor-pancreas",
      "claim.trauma-initial-abdomen.pancreatic-duct-evaluate",
      "claim.trauma-initial-abdomen.duodenal-hematoma",
      "claim.trauma-initial-abdomen.duodenal-primary-repair",
      "claim.trauma-initial-abdomen.duodenal-complex",
      "claim.trauma-initial-abdomen.duodenal-hematoma-evacuation",
      "claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction",
      "claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.wses-pelvis-2017",
    "title": "Pelvic trauma: WSES classification and guidelines",
    "completeCitation": "Coccolini F, Stahel PF, Montori G, et al. Pelvic trauma: WSES classification and guidelines. World J Emerg Surg. 2017;12:5. doi:10.1186/s13017-017-0117-6.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Philip F. Stahel",
      "Giulia Montori",
      "et al."
    ],
    "publicationYear": 2017,
    "doi": "10.1186/s13017-017-0117-6",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-017-0117-6",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
    "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "Diagnostic workup",
      "Preperitoneal pelvic packing",
      "Angiography/angioembolization",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
      "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
      "claim.trauma-initial-abdomen.pelvic-fast-limitation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.wses-uro-2019",
    "title": "Kidney and uro-trauma: WSES-AAST guidelines",
    "completeCitation": "Coccolini F, Moore EE, Kluger Y, et al. Kidney and uro-trauma: WSES-AAST guidelines. World J Emerg Surg. 2019;14:54. doi:10.1186/s13017-019-0274-x.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Ernest E. Moore",
      "Yoram Kluger",
      "et al."
    ],
    "publicationYear": 2019,
    "doi": "10.1186/s13017-019-0274-x",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-019-0274-x",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
    "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "Diagnostic procedures: kidney, ureter and bladder",
      "Renal non-operative management",
      "Bladder management",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.bladder-cystography",
      "claim.trauma-initial-abdomen.passive-ct-insufficient",
      "claim.trauma-initial-abdomen.intraperitoneal-bladder",
      "claim.trauma-initial-abdomen.extraperitoneal-bladder",
      "claim.trauma-initial-abdomen.complex-bladder",
      "claim.trauma-initial-abdomen.renal-deceleration-ct",
      "claim.trauma-initial-abdomen.renal-excretory-phase",
      "claim.trauma-initial-abdomen.renal-urine-observe",
      "claim.trauma-initial-abdomen.renal-urinoma-intervention",
      "claim.trauma-initial-abdomen.urethral-assessment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.east-bladder-2019",
    "title": "Blunt Force Bladder Injuries Management of",
    "completeCitation": "Yeung LL, McDonald AA, Como JJ, et al. Management of blunt force bladder injuries: a practice management guideline from the Eastern Association for the Surgery of Trauma. J Trauma Acute Care Surg. 2019;86(2):326-336.",
    "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
    "authors": [
      "Lawrence L. Yeung",
      "Amy A. McDonald",
      "John J. Como",
      "Bryce Robinson",
      "Jennifer Knight",
      "Michael A. Person",
      "Jane K. Lee",
      "Philipp Dahm"
    ],
    "publicationYear": 2019,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/blunt-force-bladder-injuries-management-of",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
    "licenseUrl": null,
    "termsUrl": "https://www.east.org/terms-of-use",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
    "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "PICO 1-3; diagnostic evaluation and intraperitoneal versus extraperitoneal repair"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.bladder-cystography",
      "claim.trauma-initial-abdomen.intraperitoneal-bladder",
      "claim.trauma-initial-abdomen.extraperitoneal-bladder",
      "claim.trauma-initial-abdomen.complex-bladder"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.east-pancreas-2017",
    "title": "Pancreatic Injuries",
    "completeCitation": "Ho VP, Patel NJ, Bokhari F, et al. Management of adult pancreatic injuries: a practice management guideline from the Eastern Association for the Surgery of Trauma. J Trauma Acute Care Surg. 2017;82(1):185-199.",
    "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
    "authors": [
      "Vanessa P. Ho",
      "Nimitt J. Patel",
      "Faran Bokhari",
      "et al."
    ],
    "publicationYear": 2017,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/pancreatic-injuries",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
    "licenseUrl": null,
    "termsUrl": "https://www.east.org/terms-of-use",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
    "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "PICO 1-4; summary recommendations 1-4"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.distal-pancreatic-duct",
      "claim.trauma-initial-abdomen.minor-pancreas",
      "claim.trauma-initial-abdomen.pancreatic-duct-evaluate",
      "claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.east-renal-2023",
    "title": "Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma",
    "completeCitation": "Aziz HA, Bugaev N, Baltazar G, et al. Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma. BMC Surg. 2023;23:22. doi:10.1186/s12893-023-01914-x.",
    "organizationOrJournal": "BMC Surgery / Eastern Association for the Surgery of Trauma",
    "authors": [
      "Hiba Abdel Aziz",
      "Nikolay Bugaev",
      "Gerard Baltazar",
      "Zachary Brown",
      "Krista Haines",
      "Sameer Gupta",
      "Lawrence Yeung",
      "Joseph Posluszny",
      "John Como",
      "Jennifer Freeman",
      "George Kasotakis"
    ],
    "publicationYear": 2023,
    "doi": "10.1186/s12893-023-01914-x",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s12893-023-01914-x",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
    "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "PICO 1-4 recommendations and limitations",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.contained-zone-two",
      "claim.trauma-initial-abdomen.renal-preservation",
      "claim.trauma-initial-abdomen.renal-evidence-limit"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.trauma-initial-abdomen.wses-open-abdomen-2018",
    "title": "The open abdomen in trauma and non-trauma patients: WSES guidelines",
    "completeCitation": "Coccolini F, Roberts D, Ansaloni L, et al. The open abdomen in trauma and non-trauma patients: WSES guidelines. World J Emerg Surg. 2018;13:7. doi:10.1186/s13017-018-0167-4.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Derek Roberts",
      "Luca Ansaloni",
      "et al."
    ],
    "publicationYear": 2018,
    "doi": "10.1186/s13017-018-0167-4",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-018-0167-4",
    "accessedOn": "2026-11-11",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/termsandconditions",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
    "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
    "usageRole": "both",
    "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
    "verificationSections": [
      "Trauma indications",
      "Re-exploration before definitive closure",
      "Definitive closure",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.damage-control",
      "claim.trauma-initial-abdomen.keep-open",
      "claim.trauma-initial-abdomen.fascial-closure",
      "claim.trauma-initial-abdomen.planned-hernia-fallback",
      "claim.trauma-initial-abdomen.temporary-negative-pressure"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-respiratory-ventilation.gayen2024",
    "title": "Critical Care Management of Severe Asthma Exacerbations",
    "completeCitation": "Shameek Gayen; Stephen Dachert; Bilal H. Lashari; Matthew Gordon; Parag Desai; Gerard J. Criner; Juan Carlos Cardet; Kartik Shenoy. Critical Care Management of Severe Asthma Exacerbations. Journal of Clinical Medicine 13(3):859. 2024. doi:10.3390/jcm13030859. https://www.mdpi.com/2077-0383/13/3/859. Accessed 2026-11-11.",
    "organizationOrJournal": "Journal of Clinical Medicine 13(3):859",
    "authors": [
      "Shameek Gayen",
      "Stephen Dachert",
      "Bilal H. Lashari",
      "Matthew Gordon",
      "Parag Desai",
      "Gerard J. Criner",
      "Juan Carlos Cardet",
      "Kartik Shenoy"
    ],
    "publicationYear": 2024,
    "doi": "10.3390/jcm13030859",
    "pmid": null,
    "officialUrl": "https://www.mdpi.com/2077-0383/13/3/859",
    "accessedOn": "2026-11-11",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Publisher licence inspected. Credit Gayen et al.; independent statements and constructed data, no adapted figure/table. Exact rate, I:E, dose and permissive-acidemia thresholds are not adopted.",
    "authorityAssessment": "Open specialist review, lower authority than a formal guideline; physiologic mechanics and air-trapping principles.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-respiratory-ventilation.plateau",
      "claim.critical-respiratory-ventilation.air-trapping"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-respiratory-ventilation.aarc-pva2024",
    "title": "AARC Clinical Practice Guideline: Patient-Ventilator Assessment",
    "completeCitation": "Lynda T. Goodfellow; Andrew G. Miller; Sarah M. Varekojis; Carolyn J. LaVita; Joel T. Glogowski; Dean R. Hess. AARC Clinical Practice Guideline: Patient-Ventilator Assessment. Respiratory Care 69(8):1042–1054. 2024. doi:10.4187/respcare.12007. https://www.aarc.org/wp-content/uploads/2024/10/patient-ventilator-assessment-aarc-cpg.pdf. Accessed 2026-11-11.",
    "organizationOrJournal": "Respiratory Care 69(8):1042–1054",
    "authors": [
      "Lynda T. Goodfellow",
      "Andrew G. Miller",
      "Sarah M. Varekojis",
      "Carolyn J. LaVita",
      "Joel T. Glogowski",
      "Dean R. Hess"
    ],
    "publicationYear": 2024,
    "doi": "10.4187/respcare.12007",
    "pmid": null,
    "officialUrl": "https://www.aarc.org/wp-content/uploads/2024/10/patient-ventilator-assessment-aarc-cpg.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2024 Daedalus Enterprises; society-hosted public guideline",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification only; AARC privacy/site policy inspected, terms endpoint unavailable; no blanket AI/reuse licence asserted. No protected expression or figures retained.",
    "authorityAssessment": "GRADE recommendations on plateau, tidal volume, PEEP/auto-PEEP and artificial-airway assessment.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-respiratory-ventilation.pbw",
      "claim.critical-respiratory-ventilation.protective-range",
      "claim.critical-respiratory-ventilation.pressure-reduction",
      "claim.critical-respiratory-ventilation.plateau",
      "claim.critical-respiratory-ventilation.air-trapping",
      "claim.critical-respiratory-ventilation.hme-resistance-r1",
      "claim.critical-respiratory-ventilation.active-humidification-r1"
    ]
  },
  {
    "contentVersion": "clinical.question-topic.critical-respiratory-ventilation.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.critical-respiratory-ventilation.ers-ats-niv2017",
    "title": "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure",
    "completeCitation": "Bram Rochwerg; Laurent Brochard; Mark W. Elliott; Dean Hess; Nicholas S. Hill; Stefano Nava; Paolo Navalesi; ERS/ATS task force (complete group in official PDF). Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure. European Respiratory Journal 50:1602426. 2017. doi:10.1183/13993003.02426-2016. https://www.thoracic.org/statements/resources/cc/niv-guidelines.pdf. Accessed 2026-11-11.",
    "organizationOrJournal": "European Respiratory Journal 50:1602426",
    "authors": [
      "Bram Rochwerg",
      "Laurent Brochard",
      "Mark W. Elliott",
      "Dean Hess",
      "Nicholas S. Hill",
      "Stefano Nava",
      "Paolo Navalesi",
      "ERS/ATS task force (complete group in official PDF)"
    ],
    "publicationYear": 2017,
    "doi": "10.1183/13993003.02426-2016",
    "pmid": null,
    "officialUrl": "https://www.thoracic.org/statements/resources/cc/niv-guidelines.pdf",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ERS; official public society guideline",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification; no algorithm copied. Postoperative ARF and general post-extubation failure are distinct populations; rescue item deliberately uses nonoperative pneumonia without COPD. Search did not establish a newer joint replacement.",
    "authorityAssessment": "GRADE NIV guidance. Strong COPD-acidosis recommendation; conditional low-certainty prophylaxis/rescue recommendations with population limits.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.critical-respiratory-ventilation.niv-copd",
      "claim.critical-respiratory-ventilation.niv-failure",
      "claim.critical-respiratory-ventilation.niv-prevention",
      "claim.critical-respiratory-ventilation.niv-rescue",
      "claim.critical-respiratory-ventilation.niv-low-risk-r1",
      "claim.critical-respiratory-ventilation.niv-response-r1"
    ]
  }
];
export const PROGRAM_BATCH1_RETIRED_CASES:SyntheticClinicalCase[]=[
  {
    "id": "case.gs028.small-bowel-obstruction.b-peritoneal-signs",
    "displayName": "Small-bowel obstruction",
    "patientPresentationVariantId": "presentation.gs028.small-bowel-obstruction.b-peritoneal-signs",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 112,
      "systolicBloodPressureMmHg": 104,
      "diastolicBloodPressureMmHg": 66,
      "temperatureF": 99.2,
      "oxygenSaturationPercent": 97
    },
    "chiefComplaint": "Worsening abdominal pain",
    "presentation": "{patientName} is a 43-year-old woman who presents with vomiting, distention, a completed outside CT showing small-bowel obstruction, and now constant severe pain, guarding, rebound, tachycardia, and worsening tenderness.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028.small-bowel-obstruction.b-peritoneal-signs.female.43",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 112,
          "systolicBloodPressureMmHg": 104,
          "diastolicBloodPressureMmHg": 66,
          "temperatureF": 99.2,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName} is a 43-year-old woman who presents with vomiting, distention, a completed outside CT showing small-bowel obstruction, and now constant severe pain, guarding, rebound, tachycardia, and worsening tenderness."
      },
      {
        "id": "profile.gs028.small-bowel-obstruction.b-peritoneal-signs.male.43",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 112,
          "systolicBloodPressureMmHg": 104,
          "diastolicBloodPressureMmHg": 66,
          "temperatureF": 99.2,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName} is a 43-year-old man who presents with vomiting, distention, a completed outside CT showing small-bowel obstruction, and now constant severe pain, guarding, rebound, tachycardia, and worsening tenderness."
      },
      {
        "id": "profile.gs028.small-bowel-obstruction.b-peritoneal-signs.female.68",
        "prototypeDemographics": {
          "ageYears": 68,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 112,
          "systolicBloodPressureMmHg": 104,
          "diastolicBloodPressureMmHg": 66,
          "temperatureF": 99.2,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName} is a 68-year-old woman who presents with vomiting, distention, a completed outside CT showing small-bowel obstruction, and now constant severe pain, guarding, rebound, tachycardia, and worsening tenderness."
      },
      {
        "id": "profile.gs028.small-bowel-obstruction.b-peritoneal-signs.male.68",
        "prototypeDemographics": {
          "ageYears": 68,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 112,
          "systolicBloodPressureMmHg": 104,
          "diastolicBloodPressureMmHg": 66,
          "temperatureF": 99.2,
          "oxygenSaturationPercent": 97
        },
        "presentation": "{patientName} is a 68-year-old man who presents with vomiting, distention, a completed outside CT showing small-bowel obstruction, and now constant severe pain, guarding, rebound, tachycardia, and worsening tenderness."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
      "Bologna guidelines for adhesive small bowel obstruction",
      "Small-Bowel Obstruction, Evaluation and Management"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028.small-bowel-obstruction.b-peritoneal-signs.1",
        "questionVariantId": "question.small-bowel-obstruction.urgent-surgical-escalation.v1",
        "primaryConceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation",
        "stem": "What is the safest next disposition?",
        "answerChoices": [
          {
            "id": "transfer",
            "label": "Emergency surgery review",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "clinic_observe",
            "label": "Continued observation in clinic",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "oral_trial",
            "label": "Oral hydration trial in clinic",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "routine_followup",
            "label": "Routine outpatient surgery referral",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Escalate immediately for emergency surgical evaluation when SBO is accompanied by peritonitis or concern for ischemia.",
        "sourceLabels": [
          "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
          "Bologna guidelines for adhesive small bowel obstruction",
          "Small-Bowel Obstruction, Evaluation and Management"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "clinic_observe",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Continued observation in clinic.”",
            "clinicalRationale": "Escalate immediately for emergency surgical evaluation when SBO is accompanied by peritonitis or concern for ischemia.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
              "Bologna guidelines for adhesive small bowel obstruction",
              "Small-Bowel Obstruction, Evaluation and Management"
            ]
          },
          {
            "answerChoiceId": "oral_trial",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Oral hydration trial in clinic.”",
            "clinicalRationale": "Escalate immediately for emergency surgical evaluation when SBO is accompanied by peritonitis or concern for ischemia.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
              "Bologna guidelines for adhesive small bowel obstruction",
              "Small-Bowel Obstruction, Evaluation and Management"
            ]
          },
          {
            "answerChoiceId": "routine_followup",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Routine outpatient surgery referral.”",
            "clinicalRationale": "Escalate immediately for emergency surgical evaluation when SBO is accompanied by peritonitis or concern for ischemia.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
              "Bologna guidelines for adhesive small bowel obstruction",
              "Small-Bowel Obstruction, Evaluation and Management"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Escalate immediately for emergency surgical evaluation when SBO is accompanied by peritonitis or concern for ischemia."
  },
  {
    "id": "case.gs028.small-bowel-obstruction.b-stable-no-red-flags",
    "displayName": "Small-bowel obstruction",
    "patientPresentationVariantId": "presentation.gs028.small-bowel-obstruction.b-stable-no-red-flags",
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
    "chiefComplaint": "Stable obstruction review",
    "presentation": "{patientName} is a 43-year-old woman reviewing a prior small-bowel-obstruction admission. Today pain has resolved, bowel function has returned, vital signs are normal, and the abdomen is soft without tenderness or distention.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028.small-bowel-obstruction.b-stable-no-red-flags.female.43",
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
        "presentation": "{patientName} is a 43-year-old woman reviewing a prior small-bowel-obstruction admission. Today pain has resolved, bowel function has returned, vital signs are normal, and the abdomen is soft without tenderness or distention."
      },
      {
        "id": "profile.gs028.small-bowel-obstruction.b-stable-no-red-flags.male.43",
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
        "presentation": "{patientName} is a 43-year-old man reviewing a prior small-bowel-obstruction admission. Today pain has resolved, bowel function has returned, vital signs are normal, and the abdomen is soft without tenderness or distention."
      },
      {
        "id": "profile.gs028.small-bowel-obstruction.b-stable-no-red-flags.female.68",
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
        "presentation": "{patientName} is a 68-year-old woman reviewing a prior small-bowel-obstruction admission. Today pain has resolved, bowel function has returned, vital signs are normal, and the abdomen is soft without tenderness or distention."
      },
      {
        "id": "profile.gs028.small-bowel-obstruction.b-stable-no-red-flags.male.68",
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
        "presentation": "{patientName} is a 68-year-old man reviewing a prior small-bowel-obstruction admission. Today pain has resolved, bowel function has returned, vital signs are normal, and the abdomen is soft without tenderness or distention."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
      "Bologna guidelines for adhesive small bowel obstruction",
      "Small-Bowel Obstruction, Evaluation and Management"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028.small-bowel-obstruction.b-stable-no-red-flags.1",
        "questionVariantId": "question.small-bowel-obstruction.urgent-surgical-escalation.v3",
        "primaryConceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation",
        "stem": "Which feature would change this follow-up into an emergency surgical referral?",
        "answerChoices": [
          {
            "id": "peritonitis",
            "label": "New guarding with rebound",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "scar",
            "label": "A healed abdominal scar",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "resolved",
            "label": "Continued passage of stool",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "mild_question",
            "label": "Questions about recurrence",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "New peritonitis, continuous severe pain, or systemic deterioration would trigger urgent escalation; a stable resolved follow-up does not invent an emergency.",
        "sourceLabels": [
          "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
          "Bologna guidelines for adhesive small bowel obstruction",
          "Small-Bowel Obstruction, Evaluation and Management"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "scar",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “A healed abdominal scar.”",
            "clinicalRationale": "New peritonitis, continuous severe pain, or systemic deterioration would trigger urgent escalation; a stable resolved follow-up does not invent an emergency.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
              "Bologna guidelines for adhesive small bowel obstruction",
              "Small-Bowel Obstruction, Evaluation and Management"
            ]
          },
          {
            "answerChoiceId": "resolved",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Continued passage of stool.”",
            "clinicalRationale": "New peritonitis, continuous severe pain, or systemic deterioration would trigger urgent escalation; a stable resolved follow-up does not invent an emergency.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
              "Bologna guidelines for adhesive small bowel obstruction",
              "Small-Bowel Obstruction, Evaluation and Management"
            ]
          },
          {
            "answerChoiceId": "mild_question",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Questions about recurrence.”",
            "clinicalRationale": "New peritonitis, continuous severe pain, or systemic deterioration would trigger urgent escalation; a stable resolved follow-up does not invent an emergency.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Suspected Small-Bowel Obstruction",
              "Bologna guidelines for adhesive small bowel obstruction",
              "Small-Bowel Obstruction, Evaluation and Management"
            ]
          }
        ]
      }
    ],
    "learningSummary": "New peritonitis, continuous severe pain, or systemic deterioration would trigger urgent escalation; a stable resolved follow-up does not invent an emergency."
  }
];
export const PROGRAM_BATCH1_FROZEN=[
  {
    "topic": "small-bowel-obstruction-ileus",
    "caseId": "case.topic.small-bowel-obstruction-ileus.closed-loop.v1",
    "rawSourceCaseSha256": "afb620f30d590633f4cf262ba9104906ea54dab70d3d173c9f62a5b2124bbdb6",
    "retainedCaseSha256": "acb8a0ccbaec39968045d70842c95a5cce8e23c9dc3c7467ee49478a9e2cdaf4",
    "sourceModulePath": "packages/clinical-content/src/question-topic-small-bowel-obstruction-ileus-20261111.ts",
    "sourceModuleSha256": "87a832d7976dfae82e75c41af6a7fd7d38099ee54ccb4bc553539fc3104b56fa",
    "nodes": [
      {
        "nodeId": "node.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
        "questionVariantId": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
        "conceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
        "questionSha256": "bfc017999b584a228b565df8c531269c4103bee9269d4f5df2bf7b3733ab0238",
        "nodeSha256": "b4fd6ce98caf1498f6dcc0605dbce72a57272ccaf34a61f38f46f3a642aa5362",
        "reviewPath": "docs/research/question-topic-small-bowel-obstruction-ileus-review-20261111.json"
      }
    ]
  },
  {
    "topic": "small-bowel-obstruction-ileus",
    "caseId": "case.topic.small-bowel-obstruction-ileus.transit-course.v1",
    "rawSourceCaseSha256": "0de6101bb66b79dd69b32fb3e608a1581dc2f845377c75f16fb455c2a601b927",
    "retainedCaseSha256": "521c783c15689fe7b7f287e40fdd9fdc17f101f64fc6ff61196102a2ccf80c07",
    "sourceModulePath": "packages/clinical-content/src/question-topic-small-bowel-obstruction-ileus-20261111.ts",
    "sourceModuleSha256": "87a832d7976dfae82e75c41af6a7fd7d38099ee54ccb4bc553539fc3104b56fa",
    "nodes": [
      {
        "nodeId": "node.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
        "questionVariantId": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
        "conceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
        "questionSha256": "98029e2a698563415560da4b76501b0f9e43803dd8e2012049b69c784e8435b9",
        "nodeSha256": "94f9fd4e799dd65cc08b1274672a9314f19498a6507d9e05b1da59da683e392c",
        "reviewPath": "docs/research/question-topic-small-bowel-obstruction-ileus-review-20261111.json"
      }
    ]
  },
  {
    "topic": "small-bowel-obstruction-ileus",
    "caseId": "case.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1",
    "rawSourceCaseSha256": "c8d27d20d9d4d5fe0934bd4a777b191c8a458aa10c4050fda04947ed356e45e5",
    "retainedCaseSha256": "d31e8e400ce71bf1ac797525bd56b5f53f0de14f3aaa7a0c322094162d447ee7",
    "sourceModulePath": "packages/clinical-content/src/question-topic-small-bowel-obstruction-ileus-20261111.ts",
    "sourceModuleSha256": "87a832d7976dfae82e75c41af6a7fd7d38099ee54ccb4bc553539fc3104b56fa",
    "nodes": [
      {
        "nodeId": "node.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
        "questionVariantId": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
        "conceptId": "concept.small-bowel-obstruction-ileus.nonoperative-eligibility.v1",
        "questionSha256": "77cd7606981872cbd0105eeb89e6175ce6dc6301213f7e7fe23e8df37d0e6720",
        "nodeSha256": "97ade3d55c8f9f142c08659f77bbc6cfd100a238128a349131314b5b116bb797",
        "reviewPath": "docs/research/question-topic-small-bowel-obstruction-ileus-review-20261111.json"
      }
    ]
  },
  {
    "topic": "critical-renal-organ-support",
    "caseId": "case.topic.critical-renal-organ-support.circuit-anticoagulation.v1",
    "rawSourceCaseSha256": "1078cb97629ffbbf4213686f90982fa272ed88ba87e6b07e58964c120df8fb9a",
    "retainedCaseSha256": "1078cb97629ffbbf4213686f90982fa272ed88ba87e6b07e58964c120df8fb9a",
    "sourceModulePath": "packages/clinical-content/src/question-topic-critical-renal-organ-support-20261111.ts",
    "sourceModuleSha256": "4e1d2ec4c529559018ec87970e83894b0ebfff7c1e57630163c77a1c81a68718",
    "nodes": [
      {
        "nodeId": "node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
        "questionVariantId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
        "conceptId": "concept.critical-renal-organ-support.citrate-bleeding-circuit.v1",
        "questionSha256": "3fe75e34a34b4fb423959964961bdb49ac73949b15b5339a8650e9bb92dafb73",
        "nodeSha256": "a1148534432f708a2e08a601dc38a6e145cd55961734430c68960f489cdc3e6f",
        "reviewPath": "docs/research/question-topic-critical-renal-organ-support-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "critical-renal-organ-support",
    "caseId": "case.topic.critical-renal-organ-support.kidney-recovery.v1",
    "rawSourceCaseSha256": "88c21a66bfc2cdb1a62af6a6a9056c9e8d3cc027320a62c5a56a14e640ec8007",
    "retainedCaseSha256": "88c21a66bfc2cdb1a62af6a6a9056c9e8d3cc027320a62c5a56a14e640ec8007",
    "sourceModulePath": "packages/clinical-content/src/question-topic-critical-renal-organ-support-20261111.ts",
    "sourceModuleSha256": "4e1d2ec4c529559018ec87970e83894b0ebfff7c1e57630163c77a1c81a68718",
    "nodes": [
      {
        "nodeId": "node.topic.critical-renal-organ-support.trial-off-crrt.v2",
        "questionVariantId": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
        "conceptId": "concept.critical-renal-organ-support.trial-off-crrt.v1",
        "questionSha256": "965d5eace0644a61738737edbcddaf527fa1f5a8f2c991797436363152bd8052",
        "nodeSha256": "d1e437da6bca3f2e7795c72a03652ed7e9924d782bf8489a7cd09157079ae6b8",
        "reviewPath": "docs/research/question-topic-critical-renal-organ-support-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "critical-shock-resuscitation",
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "rawSourceCaseSha256": "c8c1126c1a0e3b60e703aef1425de932ef601c3b83a8ecfd1844283bb19016f1",
    "retainedCaseSha256": "111995727f618b2e014ed3cfd5f21c419376df63ac56a24261ef2a303788274f",
    "sourceModulePath": "packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.ts",
    "sourceModuleSha256": "6c872fbaba2ed1da025e0f57b42efbf7f8d284db8ce893521bbcb9a7e6d084a1",
    "nodes": [
      {
        "nodeId": "node.critical-shock-resuscitation.choose-valid-fluid-test.v1",
        "questionVariantId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
        "conceptId": "concept.critical-shock-resuscitation.choose-valid-fluid-test.v1",
        "questionSha256": "dfbdf20882071590109eaf6864f217a6282c98b6d5e819913f871107e14a18de",
        "nodeSha256": "3e74a7264a60f894d34eae0edfdbd9fc09760ebacb25f37c4d0b737aba087b03",
        "reviewPath": "docs/research/question-topic-critical-shock-resuscitation-review-20261111.json"
      },
      {
        "nodeId": "node.critical-shock-resuscitation.response-versus-fluid-risk.v1",
        "questionVariantId": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
        "conceptId": "concept.critical-shock-resuscitation.response-versus-fluid-risk.v1",
        "questionSha256": "2eab74f146462480ef6612d24af089b58bc20c703fb012eb216eff7a33acce78",
        "nodeSha256": "4f4632916c29d644edcc1c9f59160af717dc4c19f69bdc5e4e59efd1cd1e5397",
        "reviewPath": "docs/research/question-topic-critical-shock-resuscitation-review-20261111.json"
      }
    ]
  },
  {
    "topic": "critical-shock-resuscitation",
    "caseId": "case.critical-shock-resuscitation.reassess-shock-mechanism.v2",
    "rawSourceCaseSha256": "cf35e41b875ec8e216d00bbbfeebc7672c04e69a719d00b01ae7fbbcb3269ed9",
    "retainedCaseSha256": "879b94921766aa0b743a0f0538bbf2a68c8b6a1f9ef741a153bcff99052cd85a",
    "sourceModulePath": "packages/clinical-content/src/question-topic-critical-shock-resuscitation-20261111.ts",
    "sourceModuleSha256": "6c872fbaba2ed1da025e0f57b42efbf7f8d284db8ce893521bbcb9a7e6d084a1",
    "nodes": [
      {
        "nodeId": "node.critical-shock-resuscitation.echo-for-persistent-shock.v2",
        "questionVariantId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
        "conceptId": "concept.critical-shock-resuscitation.echo-for-persistent-shock.v2",
        "questionSha256": "2a5a3f5acff0fa5ca2893692721c075a665ef9edaa9f93c98d8675db352c3851",
        "nodeSha256": "a76cb01c2b3667cbb4f522245a7625df0956992852636327d5e909b71da10e0a",
        "reviewPath": "docs/research/question-topic-critical-shock-resuscitation-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "appendix-appendicitis",
    "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v2",
    "rawSourceCaseSha256": "8d4ce00fb672a62b773abb7c91116f7056188018ea085aeda47d5adbc9097102",
    "retainedCaseSha256": "8d4ce00fb672a62b773abb7c91116f7056188018ea085aeda47d5adbc9097102",
    "sourceModulePath": "packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.ts",
    "sourceModuleSha256": "9a97e1356ea2c06dbbc999ec306cf096832fd989967bc8abbd96fc1fe07aee83",
    "nodes": [
      {
        "nodeId": "node.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
        "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
        "conceptId": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
        "questionSha256": "42791d2018bade9022a725139e21639d8257ca2468c38be8bc41665a32d84916",
        "nodeSha256": "3fee98e46a4f20e1681a7460878b1869eda4c587ceee82163fc7f9c00bcc17f6",
        "reviewPath": "docs/research/question-topic-appendix-appendicitis-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "appendix-appendicitis",
    "caseId": "case.topic.appendix-appendicitis.goblet-cell-pathology.v1",
    "rawSourceCaseSha256": "c163c65478a47651c6c6a73ee0d2d0415f6b417a5412aaeb8623101fa4678205",
    "retainedCaseSha256": "c163c65478a47651c6c6a73ee0d2d0415f6b417a5412aaeb8623101fa4678205",
    "sourceModulePath": "packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.ts",
    "sourceModuleSha256": "9a97e1356ea2c06dbbc999ec306cf096832fd989967bc8abbd96fc1fe07aee83",
    "nodes": [
      {
        "nodeId": "node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
        "questionVariantId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
        "conceptId": "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
        "questionSha256": "db760a1bc3ed5c12c70b60faebddf2a96f298ada6ae31b06c122d5e9f23788e8",
        "nodeSha256": "436566e76a906201f61ff1b2da0279ae16dd36a1c226db9f7896459c5deaf798",
        "reviewPath": "docs/research/question-topic-appendix-appendicitis-review-20261111.json"
      }
    ]
  },
  {
    "topic": "appendix-appendicitis",
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2",
    "rawSourceCaseSha256": "cd3ee637294e1cd7dc8ea2f6f74564fc001192639e1a1aff45b55afe02470055",
    "retainedCaseSha256": "cd3ee637294e1cd7dc8ea2f6f74564fc001192639e1a1aff45b55afe02470055",
    "sourceModulePath": "packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.ts",
    "sourceModuleSha256": "9a97e1356ea2c06dbbc999ec306cf096832fd989967bc8abbd96fc1fe07aee83",
    "nodes": [
      {
        "nodeId": "node.topic.appendix-appendicitis.net-regional-resection.v2",
        "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
        "conceptId": "concept.appendix-appendicitis.large-net-regional-resection.v1",
        "questionSha256": "9ec215ae2e7bb068e116eed4b6d65d3bb7aee60dcda2fe8a7420ad8897bc71bc",
        "nodeSha256": "1668d90323269f99587d36202d233c9b389e5018d75350d736385eb892f04bcf",
        "reviewPath": "docs/research/question-topic-appendix-appendicitis-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-initial-abdomen",
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "rawSourceCaseSha256": "c9c8877c23653b14c95ceec08766e46a345c371aee1c9e8f213108259e10d171",
    "retainedCaseSha256": "6e3acec6b28408644623467be859563a95d70987566bad81fdf44242c4cbf7aa",
    "sourceModulePath": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
    "sourceModuleSha256": "3ea339f3df4549a59d24086c41fe9786b829f08264bb1cf06d770178eb5e5f74",
    "nodes": [
      {
        "nodeId": "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
        "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
        "conceptId": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
        "questionSha256": "e076d97a8b2d9e8c3c0f44998013d88ea48b3ff95540234ab53268f9df133db9",
        "nodeSha256": "cbf6e3804b3acb425f96bd11d9da65017ba0ab1a9aaf17c29c5bd52f8b3fa9c6",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json"
      },
      {
        "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
        "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
        "conceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
        "questionSha256": "cf9304df8b63dd339af26a1b79b9365eedf2487cfdfa76debe42a4d3d724a2f5",
        "nodeSha256": "bef06c982b73eba73a7998139b3640192aae4b3b43e776b6f0fbb5206ce8c1fc",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review3-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-initial-abdomen",
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "rawSourceCaseSha256": "eb107a98db74e31ddbc13e6154cb4890434428816b1d81e2f8ac75b2991438b3",
    "retainedCaseSha256": "2c87ef58e8f84dfc75f681e6e277bd312d4d9fb35d97fefd502a9251876ecc55",
    "sourceModulePath": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
    "sourceModuleSha256": "3ea339f3df4549a59d24086c41fe9786b829f08264bb1cf06d770178eb5e5f74",
    "nodes": [
      {
        "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
        "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
        "conceptId": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
        "questionSha256": "03ace7b6ed529098b518cd7ae0ce32f65dda541a6d7cfbed228959b9f34273fe",
        "nodeSha256": "24b9bb675e931f38dbc300cfc2d3fbd77fa4ca60dc77669afce936f696aae738",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json"
      },
      {
        "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
        "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
        "conceptId": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
        "questionSha256": "24ea2338d61e41073f14bc978e0927292be18a20a30528afa07721d0f89a7711",
        "nodeSha256": "32bdff719dfa15fee52a5258dab79da7fd86a97a5a9067dcd40386fea8e391f0",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-initial-abdomen",
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "rawSourceCaseSha256": "953cda2ac42a890e1d8d6f3d9c4cb454a9aae4a6dec00c59d4f337b0522425da",
    "retainedCaseSha256": "75f98926a21c7cb37e66ace26fed45df3bbc366ca4f3a09d42a7facbb7248359",
    "sourceModulePath": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
    "sourceModuleSha256": "3ea339f3df4549a59d24086c41fe9786b829f08264bb1cf06d770178eb5e5f74",
    "nodes": [
      {
        "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
        "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
        "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
        "questionSha256": "924e9ee6b5b28acf681d65ef50da9a396190b384e93ed45211e46c748c963ab9",
        "nodeSha256": "dd0e771096290a35797a2bf64bf2cf71e33b5cdde4b79f4a7848b10db995edc3",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review3-20261111.json"
      },
      {
        "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
        "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
        "conceptId": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
        "questionSha256": "d80a82cce63144b33d7a6210769d1a0684abac070b0d13031a4790865789a1f9",
        "nodeSha256": "e7f85aea6a8c29fb4839828b53f6d79f1818caa4160350ea17f0fd2e465f0599",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review3-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-initial-abdomen",
    "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
    "rawSourceCaseSha256": "aa679e228030eb6b6f77424c2fcb2d0feed5542e688f24f67c4020850bfc7845",
    "retainedCaseSha256": "6fa8623ff3e9c74232f33828f0fad73c334d71ff8a764ce9fb125549d0d74fac",
    "sourceModulePath": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
    "sourceModuleSha256": "3ea339f3df4549a59d24086c41fe9786b829f08264bb1cf06d770178eb5e5f74",
    "nodes": [
      {
        "nodeId": "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
        "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
        "conceptId": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
        "questionSha256": "b96493c4196e2ee7f052b05b9b1161521f0366cc52b290a00909d0cf273e2dd1",
        "nodeSha256": "143ba8ed888026b4dd436ecce48723785d0a81efc0fedbec1b2a98c574c4777a",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-initial-abdomen",
    "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
    "rawSourceCaseSha256": "37481c01ff529952506bbc99a27266f5b77dacbbbeec6bbab552decb152ee9f7",
    "retainedCaseSha256": "4c29113958eb0490f391cf24b66161652fcbcde50e0b9e8863eb6d220420f209",
    "sourceModulePath": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
    "sourceModuleSha256": "3ea339f3df4549a59d24086c41fe9786b829f08264bb1cf06d770178eb5e5f74",
    "nodes": [
      {
        "nodeId": "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
        "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
        "conceptId": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
        "questionSha256": "0b9a7b607922e670becdbb32bb70648ba5889ad288448be16b1e5aa2f4c2170e",
        "nodeSha256": "02bd928a760c74c7b12b28a25750c1e3fe99980df4acdced5781e1733fb5a03b",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json"
      }
    ]
  },
  {
    "topic": "trauma-initial-abdomen",
    "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
    "rawSourceCaseSha256": "dcded351a64e8aee434bcd6fbd893529709111426b9907740caf8ac855da7b17",
    "retainedCaseSha256": "f72e547dcf30fa879684085924521d3ec7c07c7baf6b8d80ce41fb13ee39d39a",
    "sourceModulePath": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
    "sourceModuleSha256": "3ea339f3df4549a59d24086c41fe9786b829f08264bb1cf06d770178eb5e5f74",
    "nodes": [
      {
        "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
        "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
        "conceptId": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
        "questionSha256": "d3288ac34d0522f618ec854e249f7f6e88f151e935ce364f227a0cf9033fc191",
        "nodeSha256": "05ec08a7afe8a763381649f7967488e057574a609f9453e0b4e2ed4551e196b7",
        "reviewPath": "docs/research/question-topic-trauma-initial-abdomen-review3-20261111.json"
      }
    ]
  },
  {
    "topic": "critical-respiratory-ventilation",
    "caseId": "case.topic.critical-respiratory-ventilation.air-trapping.v1",
    "rawSourceCaseSha256": "c1296e3619771e13fc9fc219d1a441748118d987872085bf83175c970c6d5e73",
    "retainedCaseSha256": "7f0d5b5e18210b57a646ec24798790328632be7cb834565ff03c77d9299e4fc4",
    "sourceModulePath": "packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.ts",
    "sourceModuleSha256": "6a1d298090d821117c123ceca5b23df57db10a3e76de9111956a017ec09be566",
    "nodes": [
      {
        "nodeId": "node.topic.critical-respiratory-ventilation.expiratory-time.v1",
        "questionVariantId": "question.topic.critical-respiratory-ventilation.expiratory-time.v1",
        "conceptId": "concept.critical-respiratory-ventilation.expiratory-time.v1",
        "questionSha256": "5b4f8e471107e27914c33786876debaaab37095ea4e2eac2a2f8a447126128ba",
        "nodeSha256": "4490be93a10fd6dbf6efcf204ffc6fd1aa17338517e484e37ec7a4675b0c4059",
        "reviewPath": "docs/research/question-topic-critical-respiratory-ventilation-review2-20261111.json"
      }
    ]
  },
  {
    "topic": "critical-respiratory-ventilation",
    "caseId": "case.topic.critical-respiratory-ventilation.extubation-rescue.v1",
    "rawSourceCaseSha256": "3c3cc815bcb6a0f95455d353245de5020df249601d9c56ccad1a047e0b0fd496",
    "retainedCaseSha256": "1901493651c823946223d554bd0e3c8191c815db2eda0e5b602c7ecad0318dfe",
    "sourceModulePath": "packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.ts",
    "sourceModuleSha256": "6a1d298090d821117c123ceca5b23df57db10a3e76de9111956a017ec09be566",
    "nodes": [
      {
        "nodeId": "node.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
        "questionVariantId": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
        "conceptId": "concept.critical-respiratory-ventilation.postextubation-rescue.v1",
        "questionSha256": "03eec9661a0cc5f0d66eb1412d0b9d8cf02bb67703344ff760d2ace5ff407348",
        "nodeSha256": "7a68de31f1a7b4d6f3029c3cadcb7402d52f44692908327c58d67a5e319f8ce6",
        "reviewPath": "docs/research/question-topic-critical-respiratory-ventilation-review2-20261111.json"
      }
    ]
  }
] as const;
export const PROGRAM_BATCH1_LENGTH_RESIDUALS=[
  {
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "correctLength": 66,
    "longestDistractor": 61,
    "caseId": "case.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1"
  },
  {
    "questionVariantId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "correctLength": 36,
    "longestDistractor": 35,
    "caseId": "case.topic.critical-renal-organ-support.circuit-anticoagulation.v1"
  },
  {
    "questionVariantId": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "correctLength": 36,
    "longestDistractor": 33,
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1"
  },
  {
    "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "correctLength": 70,
    "longestDistractor": 58,
    "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v2"
  },
  {
    "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "correctLength": 51,
    "longestDistractor": 49,
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2"
  },
  {
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "correctLength": 56,
    "longestDistractor": 48,
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2"
  },
  {
    "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "correctLength": 42,
    "longestDistractor": 40,
    "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2"
  },
  {
    "questionVariantId": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "correctLength": 42,
    "longestDistractor": 37,
    "caseId": "case.topic.critical-respiratory-ventilation.extubation-rescue.v1"
  }
] as const;
