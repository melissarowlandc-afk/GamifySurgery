// Exact manager acceptance; immutable author sources remain untouched. All clinical versions remain drafts.
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";
import type {QuestionShipAcceptance} from "./question-ship-manifest";
export const PROGRAM_BATCH9_ROWS:QuestionShipAcceptance[] = [
  {
    "acceptanceId": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "caseId": "case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1",
    "nodeId": "node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "conceptId": "concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "sourceView": "intraop-batch9-anesthetic-intraoperative-crises",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "sourceView": "intraop-batch9-endoscopic-perforation-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "sourceView": "intraop-batch9-ercp-access-and-adverse-events",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "sourceView": "intraop-batch9-ercp-access-and-adverse-events",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "sourceView": "intraop-batch9-ercp-access-and-adverse-events",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "caseId": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.sliding-content-dissection.v1",
    "sourceView": "intraop-batch9-groin-hernia-anatomy-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "caseId": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1",
    "sourceView": "intraop-batch9-groin-hernia-anatomy-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "caseId": "case.intraop.groin-hernia.urinary-findings.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1",
    "sourceView": "intraop-batch9-groin-hernia-anatomy-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.lap-access.major-access-injury.20261112.v1",
    "caseId": "case.intraop.lap-access.outside-access-rescue.20261112.v1",
    "nodeId": "node.intraop.lap-access.major-access-injury.20261112.v1",
    "questionVariantId": "question.intraop.lap-access.major-access-injury.20261112.v1",
    "conceptId": "concept.intraop.lap-access.major-access-injury.v1",
    "sourceView": "intraop-batch9-laparoscopic-access-and-insufflation",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "caseId": "case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1",
    "nodeId": "node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "questionVariantId": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "conceptId": "concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1",
    "sourceView": "intraop-batch9-operative-hemorrhage-and-splenic-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "caseId": "case.intraop.i25.unmapped-narrowing.20261112.v1",
    "nodeId": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
    "questionVariantId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "conceptId": "concept.intraop.i25.anatomy-before-dilation.20261112.v1",
    "sourceView": "intraop-batch9-pediatric-egd-food-impaction-eoe",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "caseId": "case.intraop.i24.battery-injury-record.20261112.v1",
    "nodeId": "node.intraop.i24.battery-injury-imaging.20261112.v1",
    "questionVariantId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "conceptId": "concept.intraop.i24.battery-injury-imaging.20261112.v1",
    "sourceView": "intraop-batch9-pediatric-endoscopy-foreign-body",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "sourceView": "intraop-batch9-thyroid-nerve-monitoring",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "sourceView": "intraop-batch9-thyroid-nerve-monitoring",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "sourceView": "intraop-batch9-thyroid-nerve-monitoring",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
    "caseId": "case.intraop.unexpected-bowel.base-margin.20261112.v1",
    "nodeId": "node.intraop.unexpected-bowel.base-margin.20261112.v1",
    "questionVariantId": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
    "conceptId": "concept.intraop.unexpected-bowel.appendiceal-base-margin.v1",
    "sourceView": "intraop-batch9-unexpected-appendix-and-bowel-findings",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "caseId": "case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "nodeId": "node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "questionVariantId": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "conceptId": "concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1",
    "sourceView": "intraop-batch9-unexpected-appendix-and-bowel-findings",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  }
];
export const PROGRAM_BATCH9_VIEWS:Record<string,SyntheticClinicalRelease> = {
  "intraop-batch9-anesthetic-intraoperative-crises": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
        "displayName": "Apply the calcium-salt versus calcium-channel-blocker distinction when cardiac toxicity develops during malignant hyperthermia treatment.",
        "learningObjective": "Apply the calcium-salt versus calcium-channel-blocker distinction when cardiac toxicity develops during malignant hyperthermia treatment.",
        "conceptType": "management",
        "earliestFacilityStage": 3
      }
    ],
    "cases": [
      {
        "id": "case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1",
        "displayName": "ASC procedure: {patientName}",
        "patientDisplayName": "Aaron Reed",
        "patientPresentationVariantId": "presentation.intraop.i11.mh-electrolyte.v1",
        "prototypeDemographics": {
          "ageYears": 47,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Hernia repair",
        "presentation": "{patientName}, a 47-year-old man, is undergoing open inguinal hernia repair in the clinic's ASC OR. Rising expired carbon dioxide and generalized rigidity developed during sevoflurane anesthesia. The operation is paused; sevoflurane has been stopped and the anesthetist is giving dantrolene with oxygenation and ventilation support.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.i11.mh-electrolyte.v1",
            "prototypeDemographics": {
              "ageYears": 47,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Hernia repair",
            "presentation": "{patientName}, a 47-year-old man, is undergoing open inguinal hernia repair in the clinic's ASC OR. Rising expired carbon dioxide and generalized rigidity developed during sevoflurane anesthesia. The operation is paused; sevoflurane has been stopped and the anesthetist is giving dantrolene with oxygenation and ventilation support."
          }
        ],
        "releasePointId": "release.l3.ambulatory",
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Recognising and managing a malignant hyperthermia crisis (v2024)",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
            "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
            "primaryConceptId": "concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
            "stem": "During {patientName}'s paused hernia repair, which medication plan best fits the current findings?",
            "currentUpdate": "Insulin with dextrose is being administered, and hospital transfer is being arranged. The anesthetist reviews the following monitoring results and medication information.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Current monitoring and medication information",
              "items": [
                {
                  "label": "Expired carbon dioxide",
                  "value": "Falling toward the earlier baseline on current ventilation"
                },
                {
                  "label": "Muscle examination",
                  "value": "Generalized rigidity has eased"
                },
                {
                  "label": "Point-of-care potassium",
                  "value": "Above the laboratory critical range"
                },
                {
                  "label": "Cardiac monitor report",
                  "value": "New peaked T waves and widening QRS complexes; pulse present"
                },
                {
                  "label": "Medication reference",
                  "value": "A serious interaction is flagged between dantrolene and calcium-channel blockers"
                }
              ]
            },
            "shuffleAnswers": true,
            "answerChoices": [
              {
                "id": "choice.intraop.i11.mh-potassium-cardiotoxicity.calcium.v1",
                "label": "Give calcium gluconate",
                "isCorrect": true,
                "rationale": "The reported potassium-associated conduction changes warrant calcium-salt cardiac protection. Calcium gluconate is not a calcium-channel blocker, so the displayed interaction warning does not require withholding it during dantrolene treatment.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.i11.mh-potassium-cardiotoxicity.dantrolene.v1",
                "label": "Defer calcium gluconate",
                "isCorrect": false,
                "rationale": "The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.i11.mh-potassium-cardiotoxicity.amiodarone.v1",
                "label": "Use sodium bicarbonate",
                "isCorrect": false,
                "rationale": "Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.",
                "serviceRequest": null
              }
            ],
            "explanation": "The potassium result and new conduction changes call for calcium-salt cardiac protection. The displayed dantrolene warning concerns calcium-channel blockers; calcium gluconate is a different drug category. Potassium shifting, malignant hyperthermia treatment and transfer preparation remain shared care. Bicarbonate may address a separate metabolic indication but does not replace the indicated calcium protection.",
            "sourceLabels": [
              "Recognising and managing a malignant hyperthermia crisis (v2024)",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.i11.mh-potassium-cardiotoxicity.dantrolene.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or rescue intervention is executed by this consult.",
                "clinicalRationale": "The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.",
                "sourceLabels": [
                  "Recognising and managing a malignant hyperthermia crisis (v2024)",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.i11.mh-potassium-cardiotoxicity.amiodarone.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or rescue intervention is executed by this consult.",
                "clinicalRationale": "Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.",
                "sourceLabels": [
                  "Recognising and managing a malignant hyperthermia crisis (v2024)",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The potassium result and new conduction changes call for calcium-salt cardiac protection. The displayed dantrolene warning concerns calcium-channel blockers; calcium gluconate is a different drug category. Potassium shifting, malignant hyperthermia treatment and transfer preparation remain shared care. Bicarbonate may address a separate metabolic indication but does not replace the indicated calcium protection.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.groin_hernia_repair",
          "kind": "operation",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation",
            "income.ambulatory_operation_extended"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery"
          ]
        }
      }
    ]
  },
  "intraop-batch9-endoscopic-perforation-and-injury": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
        "displayName": "Post-closure gas: reassess the patient",
        "learningObjective": "Distinguish residual gas after a clipped colonic defect from evidence of continuing leakage and choose monitored hospital care.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1",
        "displayName": "Colonoscopy record review",
        "patientDisplayName": "Nora Bennett",
        "patientPresentationVariantId": "presentation.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1",
        "prototypeDemographics": {
          "ageYears": 60,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Colonoscopy record review",
        "presentation": "{patientName}, a 60-year-old woman, attends clinic with the outside endoscopy and hospital records from her recent colonoscopy.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1",
            "prototypeDemographics": {
              "ageYears": 60,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Colonoscopy record review",
            "presentation": "{patientName}, a 60-year-old woman, attends clinic with the outside endoscopy and hospital records from her recent colonoscopy."
          }
        ],
        "releasePointId": "release.l0.clinic_evaluation",
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
            "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
            "primaryConceptId": "concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
            "stem": "At that hospital reassessment after sigmoid clip closure, which plan best fit {patientName}'s clinical and CT findings?",
            "currentUpdate": "At the first hospital reassessment after clip closure of a small sigmoid defect, discomfort was improving. The abdomen was soft with localized tenderness; blood pressure and temperature were normal. CT with intravenous and water-soluble rectal contrast showed pericolic gas without extravasation or free fluid. Oral intake was withheld, and intravenous fluids and antibiotics had begun.",
            "answerChoices": [
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.monitor",
                "label": "Inpatient observation with serial clinical examinations",
                "isCorrect": true,
                "rationale": "Residual gas does not by itself establish closure failure. Taken together, the improving symptoms, soft abdomen and completed contrast study support inpatient monitoring with the treatment already started.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat",
                "label": "Repeat colonoscopy to reassess the clipped defect",
                "isCorrect": false,
                "rationale": "Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy",
                "label": "Laparoscopic exploration with reinforcement of the closure",
                "isCorrect": false,
                "rationale": "Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Free gas can remain after an injury has been closed. The clinical trajectory, examination and contrast CT support inpatient monitoring with the treatment already started. They do not prove a durable seal. New peritoneal signs, worsening physiology or demonstrated leakage would require urgent surgical reassessment.",
            "sourceLabels": [
              "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.",
                "clinicalRationale": "Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.",
                "sourceLabels": [
                  "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.",
                "clinicalRationale": "Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.",
                "sourceLabels": [
                  "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Free gas can remain after an injury has been closed. The clinical trajectory, examination and contrast CT support inpatient monitoring with the treatment already started. They do not prove a durable seal. New peritoneal signs, worsening physiology or demonstrated leakage would require urgent surgical reassessment.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.hospital_operation",
          "recordKind": "endoscopy_report",
          "recordCheckpoint": "Recorded operative checkpoint"
        }
      }
    ]
  },
  "intraop-batch9-ercp-access-and-adverse-events": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
        "displayName": "Initial diversion for a recognized ERCP injury",
        "learningObjective": "Interpret periampullary contrast escape and select initial diversion with hospital care in a stable procedural patient.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
        "displayName": "Collection drainage after ERCP diversion",
        "learningObjective": "Recognize a symptomatic extraluminal collection after prior biliary diversion and select its source-control route.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
        "displayName": "Pancreatic protection after difficult access",
        "learningObjective": "Select pancreatic protection after repeated unintended pancreatic access despite rectal prophylaxis.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
        "displayName": "ERCP record review",
        "patientDisplayName": "Michael Nolan",
        "patientPresentationVariantId": "presentation.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
        "prototypeDemographics": {
          "ageYears": 64,
          "sexLabel": "Male"
        },
        "chiefComplaint": "ERCP record review",
        "presentation": "{patientName}, a 64-year-old man, attends clinic after an outside hospital admission involving ERCP for a bile-duct stone. The founder reviews the procedure, anesthesia and subsequent source-control records one checkpoint at a time; later outcomes are not used to judge an earlier decision.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
            "prototypeDemographics": {
              "ageYears": 64,
              "sexLabel": "Male"
            },
            "chiefComplaint": "ERCP record review",
            "presentation": "{patientName}, a 64-year-old man, attends clinic after an outside hospital admission involving ERCP for a bile-duct stone. The founder reviews the procedure, anesthesia and subsequent source-control records one checkpoint at a time; later outcomes are not used to judge an earlier decision."
          }
        ],
        "releasePointId": "release.l0.clinic_evaluation",
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "DGVS 2025 acute endoscopic perforation management",
          "Heo et al. 2024 type II ERCP perforation drainage cohort"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
            "questionVariantId": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
            "primaryConceptId": "concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
            "currentUpdate": "The hospital record documents biliary sphincterotomy followed by stone extraction. Before scope withdrawal, the team records the findings below. Hospital monitoring, fasting, intravenous fluids, antibiotics and surgical consultation are ongoing.",
            "stem": "At this checkpoint in {patientName}'s ERCP record, which intervention should the hospital team have selected?",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed hospital ERCP record: before scope withdrawal",
              "columnHeaders": [
                "Recorded observation"
              ],
              "rowHeaders": [
                "Cholangiography",
                "Papillary inspection",
                "Wire position",
                "Anesthesia record"
              ],
              "cells": [
                [
                  "Contrast injected through the biliary catheter outlines the distal duct above the papilla, then escapes through the upper cut edge into a small retroperitoneal pocket."
                ],
                [
                  "A small separation is visible at the upper incised papillary margin. The remaining inspected duodenal wall is intact."
                ],
                [
                  "The guidewire remains within the bile duct and an intrahepatic branch."
                ],
                [
                  "Blood pressure and oxygenation remain stable without vasopressors or increased respiratory support."
                ]
              ]
            },
            "answerChoices": [
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.endoscopic.v1",
                "label": "Endoscopic transpapillary plastic-stent placement",
                "isCorrect": true,
                "rationale": "The observed cut-margin escape, stable physiology and retained intraductal wire support a plastic biliary stent for internal diversion with inpatient care.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.operation.v1",
                "label": "Operative duodenal exploration and repair",
                "isCorrect": false,
                "rationale": "Operation can be required for uncontrolled injury or deterioration. The current findings support an initial nonsurgical strategy, with the surgical team still involved.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.percutaneous.v1",
                "label": "Percutaneous transhepatic biliary drain placement",
                "isCorrect": false,
                "rationale": "A transhepatic biliary route can help when internal drainage cannot be established. The retained intraductal wire already supplies access across the papilla, so a new transhepatic route is not the preferred offered starting plan.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint.",
            "sourceLabels": [
              "DGVS 2025 acute endoscopic perforation management",
              "Heo et al. 2024 type II ERCP perforation drainage cohort"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
            "questionVariantId": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
            "primaryConceptId": "concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
            "currentUpdate": "Earlier in this outside hospital admission, a sphincterotomy-margin leak during ERCP was managed with a transpapillary plastic stent; free bile flow was recorded then. The findings below come from a later hospital reassessment. Fasting, intravenous antibiotics and multidisciplinary care continue.",
            "stem": "At the later hospital checkpoint in {patientName}'s ERCP-injury record, which source-control procedure should the team have selected?",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed hospital reassessment after endoscopic diversion",
              "columnHeaders": [
                "Recorded observation"
              ],
              "rowHeaders": [
                "Clinical course",
                "Previously completed CT",
                "Surrounding anatomy"
              ],
              "cells": [
                [
                  "Fever and focal right-sided tenderness persist. He remains alert with stable blood pressure and no vasopressor support."
                ],
                [
                  "Fluid and gas occupy a localized right retroperitoneal cavity. No enteric contrast escape is seen on this acquisition. The biliary stent has not moved."
                ],
                [
                  "The cavity contacts the right lateral abdominal wall; bowel lies anterior to it."
                ]
              ]
            },
            "answerChoices": [
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.drain.v1",
                "label": "Image-guided catheter drainage of the cavity",
                "isCorrect": true,
                "rationale": "The demonstrated localized symptomatic collection needs source control despite prior biliary diversion. Its anatomy and the stable clinical course support image-guided catheter drainage while hospital care continues.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1",
                "label": "ERCP stent exchange for biliary drainage",
                "isCorrect": false,
                "rationale": "Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1",
                "label": "Operative exploration and drainage of the cavity",
                "isCorrect": false,
                "rationale": "A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.",
            "sourceLabels": [
              "DGVS 2025 acute endoscopic perforation management",
              "Heo et al. 2024 type II ERCP perforation drainage cohort"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.",
                "clinicalRationale": "Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.",
                "sourceLabels": [
                  "DGVS 2025 acute endoscopic perforation management",
                  "Heo et al. 2024 type II ERCP perforation drainage cohort"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.",
                "clinicalRationale": "A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.",
                "sourceLabels": [
                  "DGVS 2025 acute endoscopic perforation management",
                  "Heo et al. 2024 type II ERCP perforation drainage cohort"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint. Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.hospital_operation",
          "recordKind": "endoscopy_report",
          "recordCheckpoint": "Recorded operative checkpoint"
        }
      },
      {
        "id": "case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1",
        "displayName": "ERCP record review",
        "patientDisplayName": "Clara Morgan",
        "patientPresentationVariantId": "presentation.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1",
        "prototypeDemographics": {
          "ageYears": 58,
          "sexLabel": "Female"
        },
        "chiefComplaint": "ERCP record review",
        "presentation": "{patientName}, a 58-year-old woman, attends clinic to review her outside hospital ERCP and anesthesia record after treatment of a bile-duct stone. The question concerns the recorded end-of-procedure decision, before subsequent outcomes are considered.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1",
            "prototypeDemographics": {
              "ageYears": 58,
              "sexLabel": "Female"
            },
            "chiefComplaint": "ERCP record review",
            "presentation": "{patientName}, a 58-year-old woman, attends clinic to review her outside hospital ERCP and anesthesia record after treatment of a bile-duct stone. The question concerns the recorded end-of-procedure decision, before subsequent outcomes are considered."
          }
        ],
        "releasePointId": "release.l0.clinic_evaluation",
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "DGVS 2025 ERCP complication prophylaxis",
          "Yin et al. 2016 prophylactic pancreatic stent randomized study"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
            "questionVariantId": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
            "primaryConceptId": "concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
            "currentUpdate": "The hospital record reaches the completion checkpoint shown below.",
            "stem": "At the recorded completion of {patientName}'s ERCP, which plan should the endoscopy team have selected?",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed hospital ERCP record: completion checkpoint",
              "columnHeaders": [
                "Recorded observation"
              ],
              "rowHeaders": [
                "Medication record",
                "Access record",
                "Completion record"
              ],
              "cells": [
                [
                  "Rectal indomethacin was given before ERCP."
                ],
                [
                  "The guidewire repeatedly entered the main pancreatic duct deeply during biliary access. A double-wire technique then achieved bile-duct cannulation."
                ],
                [
                  "The duct stone has been removed. The pancreatic wire remains in position; the pancreatic duct has no therapeutic target."
                ]
              ]
            },
            "answerChoices": [
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.stent.v1",
                "label": "Add pancreatic stenting to current prophylaxis",
                "isCorrect": true,
                "rationale": "Repeated deep pancreatic instrumentation creates a prophylactic indication after successful biliary therapy. Current guidance supports adding temporary pancreatic protection to rectal prophylaxis.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.finish.v1",
                "label": "Conclude ERCP with existing pancreatic prophylaxis",
                "isCorrect": false,
                "rationale": "Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.fluid.v1",
                "label": "Intensify pancreatic prophylaxis with lactated Ringer's",
                "isCorrect": false,
                "rationale": "Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The access record changes the prophylaxis decision. Repeated deep pancreatic entry supports temporary pancreatic duct stenting despite the rectal medicine already given. Successful bile-duct therapy is not pancreatic protection. Device selection and subsequent stent follow-up require the specialist's plan; no size or removal interval is specified.",
            "sourceLabels": [
              "DGVS 2025 ERCP complication prophylaxis",
              "Yin et al. 2016 prophylactic pancreatic stent randomized study"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.finish.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.",
                "clinicalRationale": "Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.",
                "sourceLabels": [
                  "DGVS 2025 ERCP complication prophylaxis",
                  "Yin et al. 2016 prophylactic pancreatic stent randomized study"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.fluid.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.",
                "clinicalRationale": "Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.",
                "sourceLabels": [
                  "DGVS 2025 ERCP complication prophylaxis",
                  "Yin et al. 2016 prophylactic pancreatic stent randomized study"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The access record changes the prophylaxis decision. Repeated deep pancreatic entry supports temporary pancreatic duct stenting despite the rectal medicine already given. Successful bile-duct therapy is not pancreatic protection. Device selection and subsequent stent follow-up require the specialist's plan; no size or removal interval is specified.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.hospital_operation",
          "recordKind": "endoscopy_report",
          "recordCheckpoint": "Recorded operative checkpoint"
        }
      }
    ]
  },
  "intraop-batch9-groin-hernia-anatomy-and-injury": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.groin-hernia.sliding-content-dissection.v1",
        "displayName": "sliding sigmoid plane",
        "learningObjective": "Recognize bowel incorporated into a sac wall and choose a dissection plane that mobilizes the sliding component.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1",
        "displayName": "adherent distal sac",
        "learningObjective": "Choose limited distal-sac handling when further complete dissection mechanically tensions cord structures.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1",
        "displayName": "urinary leak localization",
        "learningObjective": "Localize a suspected urinary tract injury from the operative field and drainage-bag change before choosing a confirmatory maneuver.",
        "earliestFacilityStage": 3,
        "conceptType": "workup"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
        "displayName": "{patientName}: groin operation checkpoint",
        "patientPresentationVariantId": "presentation.intraop.groin-hernia.sliding-sac.20261112.v1",
        "patientDisplayName": "Mateo Alvarez",
        "releasePointId": "release.l3.ambulatory",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Hernia repair",
        "presentation": "{patientName}, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.groin-hernia.sliding-sac.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 57,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Hernia repair",
            "presentation": "{patientName}, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
          "Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195",
          "Cureus (2024); 10.7759/cureus.54975",
          "Hernia (2024); 10.1007/s10029-024-03094-w"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
            "questionVariantId": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
            "primaryConceptId": "concept.intraop.groin-hernia.sliding-content-dissection.v1",
            "currentUpdate": "The left TAPP peritoneal flap is open, exposing the deep ring and lateral preperitoneal tissue. Pink sigmoid forms part of the sac's posterior boundary: its wall and mesocolon move with the peritoneal reflection. With gentle medial traction, tissue along the lateral wall stretches taut while the neck remains broad and slack.",
            "stem": "Which next maneuver should be used for {patientName}'s sigmoid-containing sac at this left TAPP repair checkpoint?",
            "answerChoices": [
              {
                "id": "choice.intraop.groin-hernia.sliding-sigmoid-plane.preperitoneal.20261112.v1",
                "label": "Mobilize the parietal attachments and reduce sac with sigmoid",
                "isCorrect": true,
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.groin-hernia.sliding-sigmoid-plane.adhesiolysis.20261112.v1",
                "label": "Peel the sigmoid from the posterior peritoneal boundary and reduce it separately",
                "isCorrect": false,
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.groin-hernia.sliding-sigmoid-plane.circumferential.20261112.v1",
                "label": "Incise the deep ring margin and reduce the bowel-bearing sac together",
                "isCorrect": false,
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "showServicePreviews": true,
            "explanation": "In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.",
            "sourceLabels": [
              "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
              "Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195",
              "Cureus (2024); 10.7759/cureus.54975"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
            "questionVariantId": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
            "primaryConceptId": "concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1",
            "currentUpdate": "The sigmoid and bowel-bearing proximal sac are now inside the abdomen. An empty peritoneal cuff just distal to the deep ring is clear of bowel, vas and vessels. The residual sac extends into the upper scrotum. Under magnification, traction-countertraction and blunt spreading expose a fibrotic patch in which vas and spermatic veins lie within the sac wall; its surfaces do not separate when traction is reversed.",
            "stem": "How should {patientName}'s residual sac be handled at this left TAPP repair checkpoint after proximal reduction?",
            "answerChoices": [
              {
                "id": "choice.intraop.groin-hernia.adherent-distal-sac.divide.20261112.v1",
                "label": "Divide at the free cuff and leave the adherent distal sac",
                "isCorrect": true,
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1",
                "label": "Retract the cuff and sharply release the distal sac from cord",
                "isCorrect": false,
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1",
                "label": "Add an inguinal incision and release the distal sac under direct vision",
                "isCorrect": false,
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "showServicePreviews": true,
            "explanation": "The deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.",
            "sourceLabels": [
              "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
              "Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195",
              "Hernia (2024); 10.1007/s10029-024-03094-w"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The constructed checkpoint selected Retract the cuff and sharply release the distal sac from cord.",
                "clinicalRationale": "This is now a proposal to cut through the observed fibrotic cord-sac interface, not simply continue an untried gentle separation. The new finding is shared wall with vas and veins rather than ordinary transmitted traction.",
                "sourceLabels": [
                  "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
                  "Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195",
                  "Hernia (2024); 10.1007/s10029-024-03094-w"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The constructed checkpoint selected Add an inguinal incision and release the distal sac under direct vision.",
                "clinicalRationale": "Anterior exposure can help when anatomy or an injury needs clarification. Here the cuff and cord anatomy are already defined; changing access does not itself separate the shared distal wall or require its release.",
                "sourceLabels": [
                  "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
                  "Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195",
                  "Hernia (2024); 10.1007/s10029-024-03094-w"
                ]
              }
            ]
          }
        ],
        "learningSummary": "In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance. The deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.groin_hernia_repair",
          "kind": "operation",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation",
            "income.ambulatory_operation_extended"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery"
          ]
        }
      },
      {
        "id": "case.intraop.groin-hernia.urinary-findings.20261112.v1",
        "displayName": "{patientName}: groin operation checkpoint",
        "patientPresentationVariantId": "presentation.intraop.groin-hernia.urinary-findings.20261112.v1",
        "patientDisplayName": "Owen Patel",
        "releasePointId": "release.l3.ambulatory",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Hernia repair",
        "presentation": "{patientName}, a 63-year-old man, is undergoing elective laparoscopic inguinal hernia repair in the clinic's ASC operating room. The operation is underway with a urethral catheter in place during medial dissection.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.groin-hernia.urinary-findings.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Hernia repair",
            "presentation": "{patientName}, a 63-year-old man, is undergoing elective laparoscopic inguinal hernia repair in the clinic's ASC operating room. The operation is underway with a urethral catheter in place during medial dissection."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
          "World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
            "questionVariantId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
            "primaryConceptId": "concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1",
            "currentUpdate": "During medial preperitoneal dissection, air begins collecting in {patientName}'s previously gas-free catheter drainage bag. Pale fluid appears in the retropubic field. The urethral catheter remains in place; the source of the fluid is not visible.",
            "stem": "Which diagnostic maneuver should next investigate {patientName}'s new urinary findings during laparoscopic inguinal repair?",
            "answerChoices": [
              {
                "id": "choice.intraop.groin-hernia.urinary-leak-localization.retrograde-fill.20261112.v1",
                "label": "Instill dyed saline through the indwelling catheter",
                "isCorrect": true,
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1",
                "label": "Give intravenous indigo carmine and inspect the field",
                "isCorrect": false,
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1",
                "label": "Obtain retrograde pyelography through a ureteric catheter",
                "isCorrect": false,
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "showServicePreviews": true,
            "explanation": "Air newly entering a catheter drainage bag during laparoscopic dissection is a bladder-injury warning. Retrograde filling through that catheter can expose a leak in the observed field. Intravenous dye and retrograde pyelography have ureteric roles; their route and compartment are different. No result of the proposed maneuver is supplied or executed here.",
            "sourceLabels": [
              "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
              "World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The constructed checkpoint selected Give intravenous indigo carmine and inspect the field.",
                "clinicalRationale": "Intravenous excreted dye can assist ureteric injury assessment, but it does not directly distend and challenge the suspected bladder defect.",
                "sourceLabels": [
                  "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
                  "World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The constructed checkpoint selected Obtain retrograde pyelography through a ureteric catheter.",
                "clinicalRationale": "A ureteric contrast study evaluates the upper urinary tract. The new bag gas during retropubic insufflation first implicates the bladder compartment.",
                "sourceLabels": [
                  "Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6",
                  "World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Air newly entering a catheter drainage bag during laparoscopic dissection is a bladder-injury warning. Retrograde filling through that catheter can expose a leak in the observed field. Intravenous dye and retrograde pyelography have ureteric roles; their route and compartment are different. No result of the proposed maneuver is supplied or executed here.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.groin_hernia_repair",
          "kind": "operation",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation",
            "income.ambulatory_operation_extended"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery"
          ]
        }
      }
    ]
  },
  "intraop-batch9-laparoscopic-access-and-insufflation": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.lap-access.major-access-injury.v1",
        "displayName": "Preserve a suspected injury track while obtaining hospital vascular control",
        "learningObjective": "Use an expanding deep hematoma and recurrent instability to select controlled open exposure before withdrawing the access cannula that remains at the injury.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.lap-access.outside-access-rescue.20261112.v1",
        "displayName": "Operative record review",
        "patientPresentationVariantId": "presentation.intraop.lap-access.outside-access-rescue.20261112.v1",
        "patientDisplayName": "Daniel Porter",
        "prototypeDemographics": {
          "ageYears": 58,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Operative record review",
        "presentation": "{patientName}, a 58-year-old man, attends clinic after an outside laparoscopic colectomy. The founder reviews the outside operative and anesthesia records at working-port placement.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.lap-access.outside-access-rescue.v1",
            "prototypeDemographics": {
              "ageYears": 58,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Operative record review",
            "presentation": "{patientName}, a 58-year-old man, attends clinic after an outside laparoscopic colectomy. The founder reviews the outside operative and anesthesia records at working-port placement."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "source.intraop.lap-access.alkatout-entry-2017",
          "source.intraop.lap-access.sasgog-trocar-2026",
          "source.intraop.lap-access.lasser-complications-2012"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.lap-access.major-access-injury.20261112.v1",
            "questionVariantId": "question.intraop.lap-access.major-access-injury.20261112.v1",
            "primaryConceptId": "concept.intraop.lap-access.major-access-injury.v1",
            "stem": "Which exposure and cannula-removal plan should have been selected at this checkpoint in {patientName}'s outside operation?",
            "currentUpdate": "At the outside hospital's working-port placement checkpoint, the existing camera-port view shows a newly inserted working cannula passing through the posterior peritoneum into a deep hematoma. The penetrating obturator has been removed; the outer cannula remains fixed there and has not been withdrawn. The hematoma expands across successive views and its lower edge is not exposed. Arterial pressure falls again after an initial resuscitative response. The team is supporting circulation and summoning vascular assistance.",
            "answerChoices": [
              {
                "id": "choice.intraop.lap-access.major-retain",
                "label": "Open exposure with cannula retained until vascular control",
                "isCorrect": true,
                "rationale": "The fixed access cannula remains at the suspected injury while the deep hematoma expands and instability recurs. Obtain open exposure and control before withdrawing it, preserving the track and possible tamponade during that sequence.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.lap-access.major-remove",
                "label": "Open exposure with cannula removed before vascular control",
                "isCorrect": false,
                "rationale": "The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.lap-access.major-laparoscopic",
                "label": "Laparoscopic exposure with cannula retained until vascular control",
                "isCorrect": false,
                "rationale": "Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.lap-access.major-remove-laparoscopic",
                "label": "Laparoscopic exposure with cannula removed before vascular control",
                "isCorrect": false,
                "rationale": "This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "showServicePreviews": true,
            "explanation": "The outer working cannula remains at the suspected deep injury; the penetrating obturator has already been removed. Preserve the cannula until the source is exposed and controlled. Expansion, incomplete exposure and recurrent instability favor urgent open control with vascular assistance. These are outside hospital observations, not a rescue operation performed in clinic.",
            "sourceLabels": [
              "source.intraop.lap-access.alkatout-entry-2017",
              "source.intraop.lap-access.sasgog-trocar-2026",
              "source.intraop.lap-access.lasser-complications-2012"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.lap-access.major-remove",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.",
                "clinicalRationale": "The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.",
                "sourceLabels": [
                  "source.intraop.lap-access.alkatout-entry-2017",
                  "source.intraop.lap-access.sasgog-trocar-2026",
                  "source.intraop.lap-access.lasser-complications-2012"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.lap-access.major-laparoscopic",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.",
                "clinicalRationale": "Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.",
                "sourceLabels": [
                  "source.intraop.lap-access.alkatout-entry-2017",
                  "source.intraop.lap-access.sasgog-trocar-2026",
                  "source.intraop.lap-access.lasser-complications-2012"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.lap-access.major-remove-laparoscopic",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.",
                "clinicalRationale": "This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.",
                "sourceLabels": [
                  "source.intraop.lap-access.alkatout-entry-2017",
                  "source.intraop.lap-access.sasgog-trocar-2026",
                  "source.intraop.lap-access.lasser-complications-2012"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The outer working cannula remains at the suspected deep injury; the penetrating obturator has already been removed. Preserve the cannula until the source is exposed and controlled. Expansion, incomplete exposure and recurrent instability favor urgent open control with vascular assistance. These are outside hospital observations, not a rescue operation performed in clinic.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.hospital_operation",
          "recordKind": "operative_note",
          "recordCheckpoint": "Recorded operative checkpoint"
        }
      }
    ]
  },
  "intraop-batch9-operative-hemorrhage-and-splenic-injury": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1",
        "displayName": "Temporize posterior hepatic bleeding after an inflow clamp",
        "learningObjective": "Integrate regional response to a Pringle maneuver and physiological trajectory to choose the next hemorrhage-control maneuver.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1",
        "displayName": "Operative record review",
        "patientPresentationVariantId": "presentation.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1",
        "patientDisplayName": "Daniel Mercer",
        "prototypeDemographics": {
          "ageYears": 36,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Operative record review",
        "presentation": "{patientName}, a 36-year-old man, visits the clinic to review the outside operative and anesthesia records from his trauma laparotomy. The selected checkpoint concerns bleeding during the initial liver exposure.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 36,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Operative record review",
            "presentation": "{patientName}, a 36-year-old man, visits the clinic to review the outside operative and anesthesia records from his trauma laparotomy. The selected checkpoint concerns bleeding during the initial liver exposure."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Liver trauma: WSES 2020 guidelines",
          "Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
            "questionVariantId": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
            "primaryConceptId": "concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1",
            "currentUpdate": "The outside trauma-laparotomy record reaches a checkpoint after release of the initial liver packs. Blood transfusion and warming continue while the team seeks additional surgical assistance.",
            "stem": "At the recorded liver exposure, which maneuver should be recommended next for {patientName}?",
            "answerChoices": [
              {
                "id": "choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repack",
                "label": "Reapply perihepatic packing and defer direct venous repair",
                "isCorrect": true,
                "rationale": "The posterior source persists during inflow occlusion and responds to compression. Repacking provides temporary control pending physiological correction and planning of any necessary advanced repair.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repair",
                "label": "Mobilize the right lobe and attempt direct venous repair",
                "isCorrect": false,
                "rationale": "Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.operative-hemorrhage.pringle-persistent-posterior.artery",
                "label": "Ligate the right hepatic artery and inspect the liver wound",
                "isCorrect": false,
                "rationale": "The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Inflow occlusion changes the anterior component but not the posterior one. That pattern raises concern for hepatic venous or retrohepatic caval bleeding, while leaving variant arterial inflow in the differential. Compression controls the posterior source and physiology is worsening, so repacking is the next temporary measure. Direct venous repair depends on the need and available expertise.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed outside operative and anesthesia record; fictional observations",
              "items": [
                {
                  "label": "Inflow clamp",
                  "value": "A noncrushing clamp encompasses the hepatoduodenal ligament. Bleeding from the anterior liver wound markedly decreases."
                },
                {
                  "label": "Posterior field",
                  "value": "Blood continues from behind the right lobe at the same pace while the clamp is in place."
                },
                {
                  "label": "Compression response",
                  "value": "Restoring the liver to position with manual compression stops the posterior flow; releasing pressure restarts it."
                },
                {
                  "label": "Anesthesia trajectory",
                  "value": "Arterial pressure repeatedly falls after transient improvement during transfusion; temperature is falling."
                }
              ]
            },
            "sourceLabels": [
              "Liver trauma: WSES 2020 guidelines",
              "Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repair",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This answer records a recommendation. It executes no intervention and determines no patient outcome.",
                "clinicalRationale": "Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.",
                "sourceLabels": [
                  "Liver trauma: WSES 2020 guidelines",
                  "Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.operative-hemorrhage.pringle-persistent-posterior.artery",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This answer records a recommendation. It executes no intervention and determines no patient outcome.",
                "clinicalRationale": "The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.",
                "sourceLabels": [
                  "Liver trauma: WSES 2020 guidelines",
                  "Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Inflow occlusion changes the anterior component but not the posterior one. That pattern raises concern for hepatic venous or retrohepatic caval bleeding, while leaving variant arterial inflow in the differential. Compression controls the posterior source and physiology is worsening, so repacking is the next temporary measure. Direct venous repair depends on the need and available expertise.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.hospital_operation",
          "recordKind": "operative_note",
          "recordCheckpoint": "Recorded operative checkpoint"
        }
      }
    ]
  },
  "intraop-batch9-pediatric-egd-food-impaction-eoe": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.i25.anatomy-before-dilation.20261112.v1",
        "displayName": "An incomplete luminal survey before pediatric EoE dilation",
        "learningObjective": "Choose the next investigation when a newly seen narrowing prevents endoscopy from defining its distal extent.",
        "earliestFacilityStage": 4,
        "conceptType": "workup"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.i25.unmapped-narrowing.20261112.v1",
        "displayName": "EGD reassessment",
        "patientDisplayName": "Isla Chen",
        "patientPresentationVariantId": "presentation.intraop.i25.unmapped-narrowing.20261112.v1",
        "prototypeDemographics": {
          "ageYears": 11,
          "sexLabel": "Female"
        },
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "chiefComplaint": "EGD reassessment",
        "presentation": "{patientName}, an 11-year-old girl with established EoE, is undergoing EGD in the clinic's endoscopy room to reassess persistent solid-food dysphagia before selecting further treatment. At the earlier on-budesonide response endoscopy, an ultrathin gastroscope reached the stomach and proximal and distal biopsies showed rare eosinophils without active epithelial injury. Today the endoscopist is using a standard diagnostic gastroscope. Liquids and saliva pass. Her father, Daniel Chen, joined the preparation discussion and waits onsite. A pediatric endoscopist, endoscopy nurse and pediatric anesthetist are present.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.i25.unmapped-narrowing.20261112.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 11,
              "sexLabel": "Female"
            },
            "chiefComplaint": "EGD reassessment",
            "presentation": "{patientName}, an 11-year-old girl with established EoE, is undergoing EGD in the clinic's endoscopy room to reassess persistent solid-food dysphagia before selecting further treatment. At the earlier on-budesonide response endoscopy, an ultrathin gastroscope reached the stomach and proximal and distal biopsies showed rare eosinophils without active epithelial injury. Today the endoscopist is using a standard diagnostic gastroscope. Liquids and saliva pass. Her father, Daniel Chen, joined the preparation discussion and waits onsite. A pediatric endoscopist, endoscopy nurse and pediatric anesthetist are present."
          }
        ],
        "releasePointId": "release.l4.pediatrics",
        "earliestFacilityStage": 4,
        "tutorialEligible": false,
        "routineEligible": true,
        "requiredClinicalSetting": "endoscopy",
        "requiredCapabilityIds": [
          "capability.pediatric_examination",
          "capability.endoscopy",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN",
          "Eosinophilic esophagitis in children and adolescents: a clinical practice guideline"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
            "primaryConceptId": "concept.intraop.i25.anatomy-before-dilation.20261112.v1",
            "questionVariantId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
            "stem": "Which investigation should be arranged after recovery from this EGD, before selecting treatment for {patientName}'s persistent dysphagia?",
            "currentUpdate": "A fixed mid-esophageal narrowing stops the standard gastroscope at its proximal edge. The narrowed channel continues beyond the view, and its distal border is not seen. The endoscopist withdraws to the proximal lumen. Anesthesia observations remain stable.",
            "shuffleAnswers": true,
            "answerChoices": [
              {
                "id": "choice.intraop.i25.anatomy-before-dilation.esophagram.20261112.v1",
                "label": "Barium contrast esophagram",
                "isCorrect": true,
                "rationale": "The new limitation is the unseen extent of the narrowed lumen. Contrast assessment can define its course and length for subsequent planning when endoscopy cannot, even though tissue inflammation has improved.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1",
                "label": "High-resolution esophageal manometry",
                "isCorrect": false,
                "rationale": "Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1",
                "label": "Repeat esophageal mucosal biopsies",
                "isCorrect": false,
                "rationale": "Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.",
                "serviceRequest": null
              }
            ],
            "explanation": "The new endoscopic finding changes the remaining question from tissue activity to luminal anatomy. A barium esophagram can map the segment before a subsequent dilation plan. The current observation does not prove a specific fibrotic mechanism, and it does not require immediate dilation, a manometric diagnosis or a new drug regimen.",
            "sourceLabels": [
              "Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN",
              "Eosinophilic esophagitis in children and adolescents: a clinical practice guideline"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this recommendation and rationale. The authored choice does not execute an investigation or intervention or simulate a patient outcome.",
                "clinicalRationale": "Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.",
                "sourceLabels": [
                  "Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN",
                  "Eosinophilic esophagitis in children and adolescents: a clinical practice guideline"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this recommendation and rationale. The authored choice does not execute an investigation or intervention or simulate a patient outcome.",
                "clinicalRationale": "Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.",
                "sourceLabels": [
                  "Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN",
                  "Eosinophilic esophagitis in children and adolescents: a clinical practice guideline"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The new endoscopic finding changes the remaining question from tissue activity to luminal anatomy. A barium esophagram can map the segment before a subsequent dilation plan. The current observation does not prove a specific fibrotic mechanism, and it does not require immediate dilation, a manometric diagnosis or a new drug regimen.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.egd",
          "kind": "endoscopy",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.endoscopy"
          ],
          "requiredCapabilityIds": [
            "capability.pediatric_examination",
            "capability.endoscopy",
            "capability.periop_recovery"
          ],
          "pediatricFamilyContext": {
            "profileId": "profile.intraop.i25.unmapped-narrowing.20261112.v1",
            "childName": "Isla Chen",
            "childStillId": "level3-roster-v2.025",
            "parentName": "Daniel Chen",
            "parentRelationship": "father"
          }
        }
      }
    ]
  },
  "intraop-batch9-pediatric-endoscopy-foreign-body": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.i24.battery-injury-imaging.20261112.v1",
        "displayName": "Assessment beyond the lumen after battery removal",
        "learningObjective": "Select the next investigation when a removed esophageal battery has left deep injury at a vascular level.",
        "earliestFacilityStage": 4,
        "conceptType": "workup"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.i24.battery-injury-record.20261112.v1",
        "displayName": "Battery procedure review",
        "patientDisplayName": "Leah Morgan",
        "patientPresentationVariantId": "presentation.intraop.i24.battery-injury-record.20261112.v1",
        "prototypeDemographics": {
          "ageYears": 6,
          "sexLabel": "Female"
        },
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "chiefComplaint": "Battery procedure review",
        "presentation": "{patientName}, a 6-year-old girl, attends clinic with her mother, Elena Morgan, after hospital treatment of a swallowed button battery. They review the outside endoscopy report and anesthesia record at the checkpoint immediately after removal. The hospital procedure and imaging are historical records.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.i24.battery-injury-record.20261112.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 6,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Battery procedure review",
            "presentation": "{patientName}, a 6-year-old girl, attends clinic with her mother, Elena Morgan, after hospital treatment of a swallowed button battery. They review the outside endoscopy report and anesthesia record at the checkpoint immediately after removal. The hospital procedure and imaging are historical records."
          }
        ],
        "releasePointId": "release.l4.pediatrics",
        "earliestFacilityStage": 4,
        "tutorialEligible": false,
        "routineEligible": true,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [
          "capability.pediatric_examination"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee",
          "Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood",
          "Management of Foreign Body Ingestion in Children"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.i24.battery-injury-imaging.20261112.v1",
            "primaryConceptId": "concept.intraop.i24.battery-injury-imaging.20261112.v1",
            "questionVariantId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
            "stem": "Which investigation was most appropriate next after removal of {patientName}'s esophageal battery at this hospital checkpoint?",
            "currentUpdate": "The following constructed findings were recorded immediately after hospital removal of {patientName}'s esophageal button battery.",
            "shuffleAnswers": true,
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed hospital endoscopy and anesthesia record",
              "items": [
                {
                  "label": "Removal site",
                  "value": "Mid-esophagus at the level of the aortic arch"
                },
                {
                  "label": "Post-removal view",
                  "value": "Depressed ulcer base with adherent gray slough and an irregular ulcerated mucosal margin"
                },
                {
                  "label": "Bleeding",
                  "value": "No active hemorrhage in the field"
                },
                {
                  "label": "Anesthesia course",
                  "value": "Blood pressure remained stable; circulatory support was not increased"
                }
              ]
            },
            "answerChoices": [
              {
                "id": "choice.intraop.i24.battery-injury-imaging.cta.20261112.v1",
                "label": "Computed tomographic chest angiography",
                "isCorrect": true,
                "rationale": "The location and depth raise concern for injury near major vessels despite stable circulation. Cross-sectional vascular imaging assesses the relationship that an intraluminal view cannot define.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1",
                "label": "Water-soluble contrast esophagography",
                "isCorrect": false,
                "rationale": "A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.i24.battery-injury-imaging.egd.20261112.v1",
                "label": "Catheter-based thoracic aortography",
                "isCorrect": false,
                "rationale": "Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.",
                "serviceRequest": null
              }
            ],
            "explanation": "The depressed slough-covered ulcer at an arch-level battery site raises concern beyond a superficial luminal abrasion. Endoscopy cannot establish the surrounding tissue and vascular relationship. CTA is the best offered initial study for that question despite stable circulation and no active bleeding. An esophagram addresses leakage; catheter angiography may belong to a coordinated vascular rescue setting. This is not a universal CTA rule for every battery removal.",
            "sourceLabels": [
              "Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee",
              "Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood",
              "Management of Foreign Body Ingestion in Children"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the recommendation and rationale. This authored choice does not execute a test or intervention or simulate an adverse patient outcome.",
                "clinicalRationale": "A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.",
                "sourceLabels": [
                  "Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee",
                  "Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood",
                  "Management of Foreign Body Ingestion in Children"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.i24.battery-injury-imaging.egd.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the recommendation and rationale. This authored choice does not execute a test or intervention or simulate an adverse patient outcome.",
                "clinicalRationale": "Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.",
                "sourceLabels": [
                  "Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee",
                  "Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood",
                  "Management of Foreign Body Ingestion in Children"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The depressed slough-covered ulcer at an arch-level battery site raises concern beyond a superficial luminal abrasion. Endoscopy cannot establish the surrounding tissue and vascular relationship. CTA is the best offered initial study for that question despite stable circulation and no active bleeding. An esophagram addresses leakage; catheter angiography may belong to a coordinated vascular rescue setting. This is not a universal CTA rule for every battery removal.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.egd",
          "recordKind": "endoscopy_report",
          "recordCheckpoint": "Completion assessment immediately after battery removal"
        }
      }
    ]
  },
  "intraop-batch9-thyroid-nerve-monitoring": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
        "displayName": "Resolve whether the recorded first-side check verifies the operated pathway before deciding the next operative step.",
        "learningObjective": "Resolve whether the recorded first-side check verifies the operated pathway before deciding the next operative step.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.intraop.thyroid-nerve-monitoring.recording-check.v1",
        "displayName": "Localize discordant physical and recorded responses before changing the operative plan.",
        "learningObjective": "Localize discordant physical and recorded responses before changing the operative plan.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
        "displayName": "Choose operative extent after a verified first-side proximal conduction failure.",
        "learningObjective": "Choose operative extent after a verified first-side proximal conduction failure.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
        "displayName": "Clinic operative-record review: {patientName}",
        "patientPresentationVariantId": "presentation.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Daniel Brooks",
        "prototypeDemographics": {
          "ageYears": 62,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Thyroid operation review",
        "presentation": "{patientName}, a 62-year-old man, is in clinic reviewing an outside hospital thyroidectomy record for papillary cancers in both lobes. Both vocal folds moved normally before surgery. At the pause after left lobectomy, the operative summary records a positive first-side motor check. Right-lobe dissection has not begun.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
            "prototypeDemographics": {
              "ageYears": 62,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Thyroid operation review",
            "presentation": "{patientName}, a 62-year-old man, is in clinic reviewing an outside hospital thyroidectomy record for papillary cancers in both lobes. Both vocal folds moved normally before surgery. At the pause after left lobectomy, the operative summary records a positive first-side motor check. Right-lobe dissection has not begun."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Matthew D. Ringel (2025); 10.1177/10507256251363120",
          "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
          "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
          "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
            "questionVariantId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
            "primaryConceptId": "concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
            "stem": "At {patientName}'s recorded thyroidectomy pause after left lobectomy, which next plan best fits the monitoring record?",
            "answerChoices": [
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.1",
                "label": "Obtain operated-side vagal responses to determine further resection",
                "isCorrect": true,
                "rationale": "The positive postresection entry comes from the right side. A true left proximal assessment is needed before treating the operated pathway as functional or impaired.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.2",
                "label": "Complete right lobectomy using continuous recurrent-nerve monitoring",
                "isCorrect": false,
                "rationale": "The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.3",
                "label": "Stage right lobectomy pending postoperative flexible laryngoscopy",
                "isCorrect": false,
                "rationale": "Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Entry B documents the unoperated right vagus despite its left-sided heading. That response and a distal left response do not verify the whole operated pathway. Obtain a valid left proximal assessment before choosing completion or staging; the site discrepancy is not itself proof of nerve injury.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed entries from the operative record and monitor printout",
              "items": [
                {
                  "label": "Before left-lobe dissection",
                  "value": "Left vagus stimulation: EMG waveform and palpable laryngeal contraction present."
                },
                {
                  "label": "After left lobectomy, distal check",
                  "value": "Left recurrent nerve at its laryngeal entry: EMG waveform and palpable laryngeal contraction present."
                },
                {
                  "label": "Postresection entry B, monitor heading",
                  "value": "L-V2: response present."
                },
                {
                  "label": "Postresection entry B, stimulation log",
                  "value": "Probe on vagus in the right carotid sheath: EMG waveform and right laryngeal contraction present."
                }
              ]
            },
            "sourceLabels": [
              "Matthew D. Ringel (2025); 10.1177/10507256251363120",
              "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
              "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
              "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This historical checkpoint review executes no test, operation or patient outcome.",
                "clinicalRationale": "The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.",
                "sourceLabels": [
                  "Matthew D. Ringel (2025); 10.1177/10507256251363120",
                  "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
                  "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
                  "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This historical checkpoint review executes no test, operation or patient outcome.",
                "clinicalRationale": "Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.",
                "sourceLabels": [
                  "Matthew D. Ringel (2025); 10.1177/10507256251363120",
                  "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
                  "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
                  "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Entry B documents the unoperated right vagus despite its left-sided heading. That response and a distal left response do not verify the whole operated pathway. Obtain a valid left proximal assessment before choosing completion or staging; the site discrepancy is not itself proof of nerve injury.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.thyroidectomy",
          "recordKind": "operative_note",
          "recordCheckpoint": "Pause after left lobectomy: reconcile the first-side summary and the matching postresection stimulation entry before right dissection."
        }
      },
      {
        "id": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
        "displayName": "Clinic operative-record review: {patientName}",
        "patientPresentationVariantId": "presentation.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "Clara Bennett",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Thyroid surgery review",
        "presentation": "{patientName}, a 49-year-old woman, is in clinic reviewing outside hospital operative and anesthesia records from a planned total thyroidectomy for papillary cancers in both lobes. Imaging showed each lesion confined to the thyroid and no abnormal neck lymph nodes; both vocal folds moved normally before surgery. At the first recorded checkpoint, left-lobe dissection is underway.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Thyroid surgery review",
            "presentation": "{patientName}, a 49-year-old woman, is in clinic reviewing outside hospital operative and anesthesia records from a planned total thyroidectomy for papillary cancers in both lobes. Imaging showed each lesion confined to the thyroid and no abnormal neck lymph nodes; both vocal folds moved normally before surgery. At the first recorded checkpoint, left-lobe dissection is underway."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Matthew D. Ringel (2025); 10.1177/10507256251363120",
          "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
          "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
          "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
            "questionVariantId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
            "primaryConceptId": "concept.intraop.thyroid-nerve-monitoring.recording-check.v1",
            "stem": "At the first recorded thyroidectomy checkpoint, which check should have been prioritized for {patientName}'s monitoring findings?",
            "answerChoices": [
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.recording-check.1",
                "label": "Check tube position and electrode contact",
                "isCorrect": true,
                "rationale": "The motor response persists on both sides; the missing recorded response directs the first check to electrode contact.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.recording-check.2",
                "label": "Check neuromuscular recovery with quantitative twitch monitoring",
                "isCorrect": false,
                "rationale": "Residual blockade can affect EMG, but preserved bilateral laryngeal contraction makes recording contact the better first target here.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.recording-check.3",
                "label": "Check stimulus delivery with a replacement probe",
                "isCorrect": false,
                "rationale": "The palpable contraction shows the stimulus is reaching muscle; replacing the stimulating probe is less directed than checking acquisition.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed operative-record observations: checkpoint 1",
              "items": [
                {
                  "label": "Before dissection",
                  "value": "Either vagus stimulus produced a recorded EMG waveform and a palpable laryngeal contraction."
                },
                {
                  "label": "Current left vagus stimulus",
                  "value": "Laryngeal contraction remains palpable; EMG waveform is absent."
                },
                {
                  "label": "Current right vagus stimulus",
                  "value": "Laryngeal contraction remains palpable; EMG waveform is absent."
                }
              ]
            },
            "sourceLabels": [
              "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
              "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
              "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
            "questionVariantId": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
            "primaryConceptId": "concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
            "currentUpdate": "The next record entry documents correction of tube rotation and return of both waveforms. After left lobectomy, the new findings below persist after release of traction and repeat technical checks. The left recurrent nerve appears continuous. Right-lobe dissection has not begun.",
            "stem": "At the second recorded checkpoint after left lobectomy, which plan was most appropriate for {patientName}'s remaining thyroid surgery?",
            "answerChoices": [
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.1",
                "label": "Defer contralateral lobectomy pending functional reassessment",
                "isCorrect": true,
                "rationale": "The distal response can bypass a proximal conduction problem. In this noninvasive cancer setting, defer right resection and reassess left laryngeal function.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2",
                "label": "Complete right lobectomy using continuous nerve monitoring",
                "isCorrect": false,
                "rationale": "Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3",
                "label": "Exchange the electrode tube before completing right lobectomy",
                "isCorrect": false,
                "rationale": "Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed operative-record observations: checkpoint 2",
              "items": [
                {
                  "label": "Left recurrent nerve at laryngeal entry",
                  "value": "EMG waveform and palpable laryngeal contraction present."
                },
                {
                  "label": "Left recurrent nerve in lower neck",
                  "value": "EMG waveform and palpable laryngeal contraction absent."
                },
                {
                  "label": "Left vagus stimulus",
                  "value": "EMG waveform and palpable laryngeal contraction absent."
                },
                {
                  "label": "Right vagus stimulus",
                  "value": "EMG waveform and palpable laryngeal contraction present."
                }
              ]
            },
            "sourceLabels": [
              "Matthew D. Ringel (2025); 10.1177/10507256251363120",
              "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
              "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
              "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This historical checkpoint review executes no test, operation or patient outcome.",
                "clinicalRationale": "Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.",
                "sourceLabels": [
                  "Matthew D. Ringel (2025); 10.1177/10507256251363120",
                  "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
                  "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
                  "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "This historical checkpoint review executes no test, operation or patient outcome.",
                "clinicalRationale": "Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.",
                "sourceLabels": [
                  "Matthew D. Ringel (2025); 10.1177/10507256251363120",
                  "Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37",
                  "Beata Wojtczak (2017); 10.1007/s00423-016-1438-8",
                  "Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury. The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.thyroidectomy",
          "recordKind": "operative_note",
          "recordCheckpoint": "Left-lobe mobilization, followed by first-lobe completion before right-lobe dissection."
        }
      }
    ]
  },
  "intraop-batch9-unexpected-appendix-and-bowel-findings": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.unexpected-bowel.appendiceal-base-margin.v1",
        "displayName": "Initial excision at an abnormal appendiceal base",
        "learningObjective": "Interpret appendiceal-base involvement and neighboring cecal anatomy to choose the initial specimen operation before histological classification.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1",
        "displayName": "Limit intervention for unsuspected terminal ileitis",
        "learningObjective": "Use a normal appendiceal appearance and uncomplicated terminal ileal inflammation to choose operative restraint while the etiology remains unconfirmed.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.unexpected-bowel.base-margin.20261112.v1",
        "displayName": "{patientName}: operative record review",
        "patientPresentationVariantId": "presentation.intraop.unexpected-bowel.base-margin.20261112.v1",
        "releasePointId": "release.l3.ambulatory",
        "patientDisplayName": "Rachel Mercer",
        "prototypeDemographics": {
          "ageYears": 58,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Operative record review",
        "presentation": "{patientName}, a 58-year-old woman, attends clinic to review an outside elective sigmoid-colectomy note. The review is paused at an incidental appendiceal finding before its resection.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.unexpected-bowel.base-margin.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 58,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Operative record review",
            "presentation": "{patientName}, a 58-year-old woman, attends clinic to review an outside elective sigmoid-colectomy note. The review is paused at an incidental appendiceal finding before its resection."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASCRS appendiceal-neoplasm guideline (2025)"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.unexpected-bowel.base-margin.20261112.v1",
            "questionVariantId": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
            "primaryConceptId": "concept.intraop.unexpected-bowel.appendiceal-base-margin.v1",
            "currentUpdate": "The outside operative note records a smooth, fluid-filled enlargement extending along the appendix to its junction with the cecum. There is no intervening narrow neck. The surrounding cecal wall is soft, and the ileocecal valve lies away from the enlargement. The appendix is mobile. Abdominal survey shows no deposits or free gelatinous material.",
            "stem": "Which initial resection should have been chosen for the unexpected appendiceal lesion in {patientName}'s recorded hospital operation?",
            "answerChoices": [
              {
                "id": "choice.intraop.unexpected-bowel.base-margin.cecal-cuff.20261112.v1",
                "label": "Resect appendix with a cecal cuff",
                "isCorrect": true,
                "rationale": "The enlargement reaches the appendiceal junction, so transecting that junction would cross abnormal tissue. A limited cuff takes the gross edge into the surrounding soft cecum while retaining the separate ileocecal valve. Retrieve the lesion intact and classify the specimen before considering oncologic extension.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.unexpected-bowel.base-margin.junction.20261112.v1",
                "label": "Resect appendix at its cecal junction",
                "isCorrect": false,
                "rationale": "This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.unexpected-bowel.base-margin.ileocecal.20261112.v1",
                "label": "Resect ileocecal segment with primary anastomosis",
                "isCorrect": false,
                "rationale": "Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The junction is part of the abnormal appendix, while neighboring cecum offers a local gross margin away from the ileocecal valve. Appendectomy with a cecal cuff is the best initial specimen operation among these choices. Avoid rupture during handling and retrieval. This gross-anatomy decision does not determine the final tumor classification or establish an indication for oncologic colectomy.",
            "sourceLabels": [
              "ASCRS appendiceal-neoplasm guideline (2025)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.unexpected-bowel.base-margin.junction.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the recorded operative decision; no patient outcome is simulated.",
                "clinicalRationale": "This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.",
                "sourceLabels": [
                  "ASCRS appendiceal-neoplasm guideline (2025)"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.unexpected-bowel.base-margin.ileocecal.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the recorded operative decision; no patient outcome is simulated.",
                "clinicalRationale": "Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.",
                "sourceLabels": [
                  "ASCRS appendiceal-neoplasm guideline (2025)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The junction is part of the abnormal appendix, while neighboring cecum offers a local gross margin away from the ileocecal valve. Appendectomy with a cecal cuff is the best initial specimen operation among these choices. Avoid rupture during handling and retrieval. This gross-anatomy decision does not determine the final tumor classification or establish an indication for oncologic colectomy.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.hospital_operation",
          "recordKind": "operative_note",
          "recordCheckpoint": "After abdominal survey, before resection of the incidental appendix."
        }
      },
      {
        "id": "case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
        "displayName": "{patientName}: exploration record review",
        "patientPresentationVariantId": "presentation.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
        "releasePointId": "release.l3.ambulatory",
        "patientDisplayName": "Leah Foster",
        "prototypeDemographics": {
          "ageYears": 29,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Exploration record review",
        "presentation": "{patientName}, a 29-year-old woman, attends clinic to review an outside emergency-exploration note for presumed appendicitis. The review is paused after inspection of the appendix and terminal ileum, before an organ is removed.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 29,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Exploration record review",
            "presentation": "{patientName}, a 29-year-old woman, attends clinic to review an outside emergency-exploration note for presumed appendicitis. The review is paused after inspection of the appendix and terminal ileum, before an organ is removed."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ECCO-ESCP surgical Crohn consensus (2018)",
          "WSES-AAST emergency IBD guideline (2021)"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
            "questionVariantId": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
            "primaryConceptId": "concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1",
            "currentUpdate": "The outside note describes a slender, pliable appendix with a smooth surface. Several terminal ileal loops are thickened and red, with mesenteric fat extending onto their surfaces. The proximal bowel is not dilated, and the survey finds neither a wall defect nor an abscess. The preoperative history was right-sided pain with loose stools and no previous inflammatory-bowel diagnosis.",
            "stem": "Which operative completion plan should have been chosen at this checkpoint in {patientName}'s exploration for presumed appendicitis?",
            "answerChoices": [
              {
                "id": "choice.intraop.unexpected-bowel.ileitis-restraint.preserve.20261112.v1",
                "label": "Preserve appendix and ileum at closure",
                "isCorrect": true,
                "rationale": "The visible disease is ileal, and its appearance does not prove Crohn disease rather than an infectious cause. The record supplies neither a separate appendiceal lesion nor a stricturing or penetrating complication. Preserve the appendix and ileum while arranging subsequent diagnostic assessment, rather than add an unneeded stump or resection.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.unexpected-bowel.ileitis-restraint.appendectomy.20261112.v1",
                "label": "Remove appendix and preserve terminal ileum",
                "isCorrect": false,
                "rationale": "Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.unexpected-bowel.ileitis-restraint.ileocecal-resection.20261112.v1",
                "label": "Remove ileocecal segment and restore continuity",
                "isCorrect": false,
                "rationale": "The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "This is an unexpected ileal inflammatory finding, not confirmation of Crohn disease or a new appendectomy indication. The normal-looking appendix should be preserved, and uncomplicated undiagnosed ileitis does not require immediate resection. Complete diagnostic assessment afterward. A separate appendiceal lesion, obstruction, perforation or another emergency would change the operative decision.",
            "sourceLabels": [
              "ECCO-ESCP surgical Crohn consensus (2018)",
              "WSES-AAST emergency IBD guideline (2021)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.unexpected-bowel.ileitis-restraint.appendectomy.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the recorded operative decision; no patient outcome is simulated.",
                "clinicalRationale": "Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.",
                "sourceLabels": [
                  "ECCO-ESCP surgical Crohn consensus (2018)",
                  "WSES-AAST emergency IBD guideline (2021)"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.unexpected-bowel.ileitis-restraint.ileocecal-resection.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the recorded operative decision; no patient outcome is simulated.",
                "clinicalRationale": "The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.",
                "sourceLabels": [
                  "ECCO-ESCP surgical Crohn consensus (2018)",
                  "WSES-AAST emergency IBD guideline (2021)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "This is an unexpected ileal inflammatory finding, not confirmation of Crohn disease or a new appendectomy indication. The normal-looking appendix should be preserved, and uncomplicated undiagnosed ileitis does not require immediate resection. Complete diagnostic assessment afterward. A separate appendiceal lesion, obstruction, perforation or another emergency would change the operative decision.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.hospital_operation",
          "recordKind": "operative_note",
          "recordCheckpoint": "After inspection of appendix and terminal ileum, before any resection."
        }
      }
    ]
  }
};
export const PROGRAM_BATCH9_QUESTIONS:Array<QuestionVariant & Record<string,unknown>> = [
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "revisionRound": 1,
    "id": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "conceptId": "concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "stem": "During {patientName}'s paused hernia repair, which medication plan best fits the current findings?",
    "explanation": "The potassium result and new conduction changes call for calcium-salt cardiac protection. The displayed dantrolene warning concerns calcium-channel blockers; calcium gluconate is a different drug category. Potassium shifting, malignant hyperthermia treatment and transfer preparation remain shared care. Bicarbonate may address a separate metabolic indication but does not replace the indicated calcium protection.",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Current monitoring and medication information",
      "items": [
        {
          "label": "Expired carbon dioxide",
          "value": "Falling toward the earlier baseline on current ventilation"
        },
        {
          "label": "Muscle examination",
          "value": "Generalized rigidity has eased"
        },
        {
          "label": "Point-of-care potassium",
          "value": "Above the laboratory critical range"
        },
        {
          "label": "Cardiac monitor report",
          "value": "New peaked T waves and widening QRS complexes; pulse present"
        },
        {
          "label": "Medication reference",
          "value": "A serious interaction is flagged between dantrolene and calcium-channel blockers"
        }
      ]
    },
    "supportingEvidenceClaimIds": [
      "claim.intraop.i11.mh-pattern",
      "claim.intraop.i11.mh-treatment",
      "claim.intraop.i11.mh-potassium",
      "claim.intraop.i11.calcium-cardioprotection",
      "claim.intraop.i11.calcium-not-removal",
      "claim.intraop.i11.calcium-versus-ccb",
      "claim.intraop.i11.repeat-dantrolene",
      "claim.intraop.i11.mh-bicarbonate-complications"
    ],
    "answerChoices": [
      {
        "id": "choice.intraop.i11.mh-potassium-cardiotoxicity.calcium.v1",
        "label": "Give calcium gluconate",
        "isCorrect": true,
        "rationale": "The reported potassium-associated conduction changes warrant calcium-salt cardiac protection. Calcium gluconate is not a calcium-channel blocker, so the displayed interaction warning does not require withholding it during dantrolene treatment.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.i11.mh-potassium-cardiotoxicity.dantrolene.v1",
        "label": "Defer calcium gluconate",
        "isCorrect": false,
        "rationale": "The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.",
        "distractorRationale": "The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated."
      },
      {
        "id": "choice.intraop.i11.mh-potassium-cardiotoxicity.amiodarone.v1",
        "label": "Use sodium bicarbonate",
        "isCorrect": false,
        "rationale": "Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.",
        "distractorRationale": "Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium."
      }
    ]
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "stem": "At that hospital reassessment after sigmoid clip closure, which plan best fit {patientName}'s clinical and CT findings?",
    "answerChoices": [
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.monitor",
        "label": "Inpatient observation with serial clinical examinations",
        "isCorrect": true,
        "rationale": "Residual gas does not by itself establish closure failure. Taken together, the improving symptoms, soft abdomen and completed contrast study support inpatient monitoring with the treatment already started.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat",
        "label": "Repeat colonoscopy to reassess the clipped defect",
        "isCorrect": false,
        "rationale": "Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.",
        "distractorRationale": "Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment."
      },
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy",
        "label": "Laparoscopic exploration with reinforcement of the closure",
        "isCorrect": false,
        "rationale": "Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.",
        "distractorRationale": "Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications."
      }
    ],
    "explanation": "Free gas can remain after an injury has been closed. The clinical trajectory, examination and contrast CT support inpatient monitoring with the treatment already started. They do not prove a durable seal. New peritoneal signs, worsening physiology or demonstrated leakage would require urgent surgical reassessment.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.gas-after-closure",
      "claim.intraop.endoscopic-perforation-and-injury.conservative-colon-selection",
      "claim.intraop.endoscopic-perforation-and-injury.perforation-support",
      "claim.intraop.endoscopic-perforation-and-injury.deterioration-after-closure",
      "claim.intraop.endoscopic-perforation-and-injury.colonic-contrast-assessment",
      "claim.intraop.endoscopic-perforation-and-injury.early-colon-closure"
    ]
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "stem": "At this checkpoint in {patientName}'s ERCP record, which intervention should the hospital team have selected?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed hospital ERCP record: before scope withdrawal",
      "columnHeaders": [
        "Recorded observation"
      ],
      "rowHeaders": [
        "Cholangiography",
        "Papillary inspection",
        "Wire position",
        "Anesthesia record"
      ],
      "cells": [
        [
          "Contrast injected through the biliary catheter outlines the distal duct above the papilla, then escapes through the upper cut edge into a small retroperitoneal pocket."
        ],
        [
          "A small separation is visible at the upper incised papillary margin. The remaining inspected duodenal wall is intact."
        ],
        [
          "The guidewire remains within the bile duct and an intrahepatic branch."
        ],
        [
          "Blood pressure and oxygenation remain stable without vasopressors or increased respiratory support."
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.endoscopic.v1",
        "label": "Endoscopic transpapillary plastic-stent placement",
        "isCorrect": true,
        "rationale": "The observed cut-margin escape, stable physiology and retained intraductal wire support a plastic biliary stent for internal diversion with inpatient care.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.operation.v1",
        "label": "Operative duodenal exploration and repair",
        "isCorrect": false,
        "rationale": "Operation can be required for uncontrolled injury or deterioration. The current findings support an initial nonsurgical strategy, with the surgical team still involved.",
        "distractorRationale": "Operation can be required for uncontrolled injury or deterioration. The current findings support an initial nonsurgical strategy, with the surgical team still involved."
      },
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.percutaneous.v1",
        "label": "Percutaneous transhepatic biliary drain placement",
        "isCorrect": false,
        "rationale": "A transhepatic biliary route can help when internal drainage cannot be established. The retained intraductal wire already supplies access across the papilla, so a new transhepatic route is not the preferred offered starting plan.",
        "distractorRationale": "A transhepatic biliary route can help when internal drainage cannot be established. The retained intraductal wire already supplies access across the papilla, so a new transhepatic route is not the preferred offered starting plan."
      }
    ],
    "explanation": "The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.periampullary-pattern",
      "claim.intraop.ercp-access-and-adverse-events.sphincterotomy-margin-origin",
      "claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care",
      "claim.intraop.ercp-access-and-adverse-events.selected-endoscopic-diversion",
      "claim.intraop.ercp-access-and-adverse-events.failed-source-control-surgery"
    ]
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "stem": "At the later hospital checkpoint in {patientName}'s ERCP-injury record, which source-control procedure should the team have selected?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed hospital reassessment after endoscopic diversion",
      "columnHeaders": [
        "Recorded observation"
      ],
      "rowHeaders": [
        "Clinical course",
        "Previously completed CT",
        "Surrounding anatomy"
      ],
      "cells": [
        [
          "Fever and focal right-sided tenderness persist. He remains alert with stable blood pressure and no vasopressor support."
        ],
        [
          "Fluid and gas occupy a localized right retroperitoneal cavity. No enteric contrast escape is seen on this acquisition. The biliary stent has not moved."
        ],
        [
          "The cavity contacts the right lateral abdominal wall; bowel lies anterior to it."
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.drain.v1",
        "label": "Image-guided catheter drainage of the cavity",
        "isCorrect": true,
        "rationale": "The demonstrated localized symptomatic collection needs source control despite prior biliary diversion. Its anatomy and the stable clinical course support image-guided catheter drainage while hospital care continues.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1",
        "label": "ERCP stent exchange for biliary drainage",
        "isCorrect": false,
        "rationale": "Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.",
        "distractorRationale": "Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here."
      },
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1",
        "label": "Operative exploration and drainage of the cavity",
        "isCorrect": false,
        "rationale": "A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.",
        "distractorRationale": "A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed."
      }
    ],
    "explanation": "Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care",
      "claim.intraop.ercp-access-and-adverse-events.collection-after-diversion",
      "claim.intraop.ercp-access-and-adverse-events.collection-percutaneous",
      "claim.intraop.ercp-access-and-adverse-events.ct-injury-assessment",
      "claim.intraop.ercp-access-and-adverse-events.failed-source-control-surgery"
    ]
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "stem": "At the recorded completion of {patientName}'s ERCP, which plan should the endoscopy team have selected?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed hospital ERCP record: completion checkpoint",
      "columnHeaders": [
        "Recorded observation"
      ],
      "rowHeaders": [
        "Medication record",
        "Access record",
        "Completion record"
      ],
      "cells": [
        [
          "Rectal indomethacin was given before ERCP."
        ],
        [
          "The guidewire repeatedly entered the main pancreatic duct deeply during biliary access. A double-wire technique then achieved bile-duct cannulation."
        ],
        [
          "The duct stone has been removed. The pancreatic wire remains in position; the pancreatic duct has no therapeutic target."
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.stent.v1",
        "label": "Add pancreatic stenting to current prophylaxis",
        "isCorrect": true,
        "rationale": "Repeated deep pancreatic instrumentation creates a prophylactic indication after successful biliary therapy. Current guidance supports adding temporary pancreatic protection to rectal prophylaxis.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.finish.v1",
        "label": "Conclude ERCP with existing pancreatic prophylaxis",
        "isCorrect": false,
        "rationale": "Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.",
        "distractorRationale": "Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern."
      },
      {
        "id": "choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.fluid.v1",
        "label": "Intensify pancreatic prophylaxis with lactated Ringer's",
        "isCorrect": false,
        "rationale": "Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.",
        "distractorRationale": "Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here."
      }
    ],
    "explanation": "The access record changes the prophylaxis decision. Repeated deep pancreatic entry supports temporary pancreatic duct stenting despite the rectal medicine already given. Successful bile-duct therapy is not pancreatic protection. Device selection and subsequent stent follow-up require the specialist's plan; no size or removal interval is specified.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.pancreatic-access-risk",
      "claim.intraop.ercp-access-and-adverse-events.pancreatic-stent-prophylaxis",
      "claim.intraop.ercp-access-and-adverse-events.hydration-not-substitute"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.sliding-content-dissection.v1",
    "stem": "Which next maneuver should be used for {patientName}'s sigmoid-containing sac at this left TAPP repair checkpoint?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.intraop.groin-hernia.sliding-sigmoid-plane.preperitoneal.20261112.v1",
        "label": "Mobilize the parietal attachments and reduce sac with sigmoid",
        "isCorrect": true,
        "rationale": "The observed restraint lies in the lateral attachments, while the bowel-bearing boundary must remain together. Extending the preperitoneal mobilization addresses that restraint rather than dividing the visceral interface or enlarging an unconstricting neck.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.groin-hernia.sliding-sigmoid-plane.adhesiolysis.20261112.v1",
        "label": "Peel the sigmoid from the posterior peritoneal boundary and reduce it separately",
        "isCorrect": false,
        "rationale": "The posterior boundary includes the visceral wall and mesocolon; peeling here treats incorporated tissue as an ordinary removable adhesion.",
        "distractorRationale": "The posterior boundary includes the visceral wall and mesocolon; peeling here treats incorporated tissue as an ordinary removable adhesion."
      },
      {
        "id": "choice.intraop.groin-hernia.sliding-sigmoid-plane.circumferential.20261112.v1",
        "label": "Incise the deep ring margin and reduce the bowel-bearing sac together",
        "isCorrect": false,
        "rationale": "Ring release addresses a constricting aperture in selected difficult reductions. Here traction tensions the lateral attachments while the neck remains slack, so enlarging the aperture does not address the observed restraint.",
        "distractorRationale": "Ring release addresses a constricting aperture in selected difficult reductions. Here traction tensions the lateral attachments while the neck remains slack, so enlarging the aperture does not address the observed restraint."
      }
    ],
    "explanation": "In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.groin-hernia.sliding-wall",
      "claim.intraop.groin-hernia.sliding-plane",
      "claim.intraop.groin-hernia.ring-release-boundary"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1",
    "stem": "How should {patientName}'s residual sac be handled at this left TAPP repair checkpoint after proximal reduction?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.intraop.groin-hernia.adherent-distal-sac.divide.20261112.v1",
        "label": "Divide at the free cuff and leave the adherent distal sac",
        "isCorrect": true,
        "rationale": "The empty cuff provides an identified division site before the fibrotic shared wall. Leaving the adherent portion avoids making complete release the completion requirement, while accepting a possible seroma.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1",
        "label": "Retract the cuff and sharply release the distal sac from cord",
        "isCorrect": false,
        "rationale": "This is now a proposal to cut through the observed fibrotic cord-sac interface, not simply continue an untried gentle separation. The new finding is shared wall with vas and veins rather than ordinary transmitted traction.",
        "distractorRationale": "This is now a proposal to cut through the observed fibrotic cord-sac interface, not simply continue an untried gentle separation. The new finding is shared wall with vas and veins rather than ordinary transmitted traction."
      },
      {
        "id": "choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1",
        "label": "Add an inguinal incision and release the distal sac under direct vision",
        "isCorrect": false,
        "rationale": "Anterior exposure can help when anatomy or an injury needs clarification. Here the cuff and cord anatomy are already defined; changing access does not itself separate the shared distal wall or require its release.",
        "distractorRationale": "Anterior exposure can help when anatomy or an injury needs clarification. Here the cuff and cord anatomy are already defined; changing access does not itself separate the shared distal wall or require its release."
      }
    ],
    "explanation": "The deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.groin-hernia.cord-sac",
      "claim.intraop.groin-hernia.distal-seroma",
      "claim.intraop.groin-hernia.dense-sac-plane"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1",
    "stem": "Which diagnostic maneuver should next investigate {patientName}'s new urinary findings during laparoscopic inguinal repair?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.intraop.groin-hernia.urinary-leak-localization.retrograde-fill.20261112.v1",
        "label": "Instill dyed saline through the indwelling catheter",
        "isCorrect": true,
        "rationale": "The new gas in a catheter bag during insufflation points to communication with the bladder. Filling through the catheter challenges that compartment while the field is observed.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1",
        "label": "Give intravenous indigo carmine and inspect the field",
        "isCorrect": false,
        "rationale": "Intravenous excreted dye can assist ureteric injury assessment, but it does not directly distend and challenge the suspected bladder defect.",
        "distractorRationale": "Intravenous excreted dye can assist ureteric injury assessment, but it does not directly distend and challenge the suspected bladder defect."
      },
      {
        "id": "choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1",
        "label": "Obtain retrograde pyelography through a ureteric catheter",
        "isCorrect": false,
        "rationale": "A ureteric contrast study evaluates the upper urinary tract. The new bag gas during retropubic insufflation first implicates the bladder compartment.",
        "distractorRationale": "A ureteric contrast study evaluates the upper urinary tract. The new bag gas during retropubic insufflation first implicates the bladder compartment."
      }
    ],
    "explanation": "Air newly entering a catheter drainage bag during laparoscopic dissection is a bladder-injury warning. Retrograde filling through that catheter can expose a leak in the observed field. Intravenous dye and retrograde pyelography have ureteric roles; their route and compartment are different. No result of the proposed maneuver is supplied or executed here.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.groin-hernia.bladder-sign",
      "claim.intraop.groin-hernia.bladder-fill",
      "claim.intraop.groin-hernia.ureter-testing"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.lap-access.major-access-injury.20261112.v1",
    "conceptId": "concept.intraop.lap-access.major-access-injury.v1",
    "stem": "Which exposure and cannula-removal plan should have been selected at this checkpoint in {patientName}'s outside operation?",
    "answerChoices": [
      {
        "id": "choice.intraop.lap-access.major-retain",
        "label": "Open exposure with cannula retained until vascular control",
        "isCorrect": true,
        "rationale": "The fixed access cannula remains at the suspected injury while the deep hematoma expands and instability recurs. Obtain open exposure and control before withdrawing it, preserving the track and possible tamponade during that sequence.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.lap-access.major-remove",
        "label": "Open exposure with cannula removed before vascular control",
        "isCorrect": false,
        "rationale": "The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.",
        "distractorRationale": "The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here."
      },
      {
        "id": "choice.intraop.lap-access.major-laparoscopic",
        "label": "Laparoscopic exposure with cannula retained until vascular control",
        "isCorrect": false,
        "rationale": "Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.",
        "distractorRationale": "Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here."
      },
      {
        "id": "choice.intraop.lap-access.major-remove-laparoscopic",
        "label": "Laparoscopic exposure with cannula removed before vascular control",
        "isCorrect": false,
        "rationale": "This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.",
        "distractorRationale": "This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint."
      }
    ],
    "explanation": "The outer working cannula remains at the suspected deep injury; the penetrating obturator has already been removed. Preserve the cannula until the source is exposed and controlled. Expansion, incomplete exposure and recurrent instability favor urgent open control with vascular assistance. These are outside hospital observations, not a rescue operation performed in clinic.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.lap-access.major-injury",
      "claim.intraop.lap-access.major-control",
      "claim.intraop.lap-access.access-cannula-retention"
    ]
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "conceptId": "concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1",
    "stem": "At the recorded liver exposure, which maneuver should be recommended next for {patientName}?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed outside operative and anesthesia record; fictional observations",
      "items": [
        {
          "label": "Inflow clamp",
          "value": "A noncrushing clamp encompasses the hepatoduodenal ligament. Bleeding from the anterior liver wound markedly decreases."
        },
        {
          "label": "Posterior field",
          "value": "Blood continues from behind the right lobe at the same pace while the clamp is in place."
        },
        {
          "label": "Compression response",
          "value": "Restoring the liver to position with manual compression stops the posterior flow; releasing pressure restarts it."
        },
        {
          "label": "Anesthesia trajectory",
          "value": "Arterial pressure repeatedly falls after transient improvement during transfusion; temperature is falling."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repack",
        "label": "Reapply perihepatic packing and defer direct venous repair",
        "isCorrect": true,
        "rationale": "The posterior source persists during inflow occlusion and responds to compression. Repacking provides temporary control pending physiological correction and planning of any necessary advanced repair.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repair",
        "label": "Mobilize the right lobe and attempt direct venous repair",
        "isCorrect": false,
        "rationale": "Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.",
        "distractorRationale": "Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury."
      },
      {
        "id": "choice.intraop.operative-hemorrhage.pringle-persistent-posterior.artery",
        "label": "Ligate the right hepatic artery and inspect the liver wound",
        "isCorrect": false,
        "rationale": "The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.",
        "distractorRationale": "The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source."
      }
    ],
    "explanation": "Inflow occlusion changes the anterior component but not the posterior one. That pattern raises concern for hepatic venous or retrohepatic caval bleeding, while leaving variant arterial inflow in the differential. Compression controls the posterior source and physiology is worsening, so repacking is the next temporary measure. Direct venous repair depends on the need and available expertise.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.pringle-inflow",
      "claim.intraop.operative-hemorrhage.pringle-posterior",
      "claim.intraop.operative-hemorrhage.pringle-variant-artery",
      "claim.intraop.operative-hemorrhage.hepatic-packing",
      "claim.intraop.operative-hemorrhage.hepatic-repacking",
      "claim.intraop.operative-hemorrhage.hepatic-repair-boundary",
      "claim.intraop.operative-hemorrhage.hepatic-arterial-ligation"
    ]
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.revision1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "conceptId": "concept.intraop.i25.anatomy-before-dilation.20261112.v1",
    "stem": "Which investigation should be arranged after recovery from this EGD, before selecting treatment for {patientName}'s persistent dysphagia?",
    "explanation": "The new endoscopic finding changes the remaining question from tissue activity to luminal anatomy. A barium esophagram can map the segment before a subsequent dilation plan. The current observation does not prove a specific fibrotic mechanism, and it does not require immediate dilation, a manometric diagnosis or a new drug regimen.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.i25.topical-response.20261112.v1",
      "claim.intraop.i25.structural-histology.20261112.v1",
      "claim.intraop.i25.anatomy-before-dilation.20261112.v1",
      "claim.intraop.i25.motility-scope.20261112.v1",
      "claim.intraop.i25.biopsy-scope.20261112.v1"
    ],
    "answerChoices": [
      {
        "id": "choice.intraop.i25.anatomy-before-dilation.esophagram.20261112.v1",
        "label": "Barium contrast esophagram",
        "isCorrect": true,
        "rationale": "The new limitation is the unseen extent of the narrowed lumen. Contrast assessment can define its course and length for subsequent planning when endoscopy cannot, even though tissue inflammation has improved.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1",
        "label": "High-resolution esophageal manometry",
        "isCorrect": false,
        "rationale": "Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.",
        "distractorRationale": "Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning."
      },
      {
        "id": "choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1",
        "label": "Repeat esophageal mucosal biopsies",
        "isCorrect": false,
        "rationale": "Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.",
        "distractorRationale": "Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment."
      }
    ]
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "conceptId": "concept.intraop.i24.battery-injury-imaging.20261112.v1",
    "stem": "Which investigation was most appropriate next after removal of {patientName}'s esophageal battery at this hospital checkpoint?",
    "explanation": "The depressed slough-covered ulcer at an arch-level battery site raises concern beyond a superficial luminal abrasion. Endoscopy cannot establish the surrounding tissue and vascular relationship. CTA is the best offered initial study for that question despite stable circulation and no active bleeding. An esophagram addresses leakage; catheter angiography may belong to a coordinated vascular rescue setting. This is not a universal CTA rule for every battery removal.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.i24.battery-injury-assessment.20261112.v1",
      "claim.intraop.i24.battery-cross-sectional.20261112.v1",
      "claim.intraop.i24.battery-swallow-role.20261112.v1",
      "claim.intraop.i24.battery-observation.20261112.v1",
      "claim.intraop.i24.battery-catheter-angiography.20261112.v1"
    ],
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed hospital endoscopy and anesthesia record",
      "items": [
        {
          "label": "Removal site",
          "value": "Mid-esophagus at the level of the aortic arch"
        },
        {
          "label": "Post-removal view",
          "value": "Depressed ulcer base with adherent gray slough and an irregular ulcerated mucosal margin"
        },
        {
          "label": "Bleeding",
          "value": "No active hemorrhage in the field"
        },
        {
          "label": "Anesthesia course",
          "value": "Blood pressure remained stable; circulatory support was not increased"
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.i24.battery-injury-imaging.cta.20261112.v1",
        "label": "Computed tomographic chest angiography",
        "isCorrect": true,
        "rationale": "The location and depth raise concern for injury near major vessels despite stable circulation. Cross-sectional vascular imaging assesses the relationship that an intraluminal view cannot define.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1",
        "label": "Water-soluble contrast esophagography",
        "isCorrect": false,
        "rationale": "A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.",
        "distractorRationale": "A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment."
      },
      {
        "id": "choice.intraop.i24.battery-injury-imaging.egd.20261112.v1",
        "label": "Catheter-based thoracic aortography",
        "isCorrect": false,
        "rationale": "Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.",
        "distractorRationale": "Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review."
      }
    ]
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.revision1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "stem": "At {patientName}'s recorded thyroidectomy pause after left lobectomy, which next plan best fits the monitoring record?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed entries from the operative record and monitor printout",
      "items": [
        {
          "label": "Before left-lobe dissection",
          "value": "Left vagus stimulation: EMG waveform and palpable laryngeal contraction present."
        },
        {
          "label": "After left lobectomy, distal check",
          "value": "Left recurrent nerve at its laryngeal entry: EMG waveform and palpable laryngeal contraction present."
        },
        {
          "label": "Postresection entry B, monitor heading",
          "value": "L-V2: response present."
        },
        {
          "label": "Postresection entry B, stimulation log",
          "value": "Probe on vagus in the right carotid sheath: EMG waveform and right laryngeal contraction present."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.1",
        "label": "Obtain operated-side vagal responses to determine further resection",
        "isCorrect": true,
        "rationale": "The positive postresection entry comes from the right side. A true left proximal assessment is needed before treating the operated pathway as functional or impaired.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.2",
        "label": "Complete right lobectomy using continuous recurrent-nerve monitoring",
        "isCorrect": false,
        "rationale": "The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.",
        "distractorRationale": "The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information."
      },
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.3",
        "label": "Stage right lobectomy pending postoperative flexible laryngoscopy",
        "isCorrect": false,
        "rationale": "Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.",
        "distractorRationale": "Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss."
      }
    ],
    "shuffleAnswers": true,
    "explanation": "Entry B documents the unoperated right vagus despite its left-sided heading. That response and a distal left response do not verify the whole operated pathway. Obtain a valid left proximal assessment before choosing completion or staging; the site discrepancy is not itself proof of nerve injury.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.thyroid.whole-path",
      "claim.intraop.thyroid.distal-bypass",
      "claim.intraop.thyroid.verified-ipsilateral",
      "claim.intraop.thyroid.defer-contralateral",
      "claim.intraop.thyroid.reassess-recovery"
    ]
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "stem": "At the first recorded thyroidectomy checkpoint, which check should have been prioritized for {patientName}'s monitoring findings?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed operative-record observations: checkpoint 1",
      "items": [
        {
          "label": "Before dissection",
          "value": "Either vagus stimulus produced a recorded EMG waveform and a palpable laryngeal contraction."
        },
        {
          "label": "Current left vagus stimulus",
          "value": "Laryngeal contraction remains palpable; EMG waveform is absent."
        },
        {
          "label": "Current right vagus stimulus",
          "value": "Laryngeal contraction remains palpable; EMG waveform is absent."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.recording-check.1",
        "label": "Check tube position and electrode contact",
        "isCorrect": true,
        "rationale": "The motor response persists on both sides; the missing recorded response directs the first check to electrode contact.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.recording-check.2",
        "label": "Check neuromuscular recovery with quantitative twitch monitoring",
        "isCorrect": false,
        "rationale": "Residual blockade can affect EMG, but preserved bilateral laryngeal contraction makes recording contact the better first target here.",
        "distractorRationale": "Residual blockade can affect EMG, but preserved bilateral laryngeal contraction makes recording contact the better first target here."
      },
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.recording-check.3",
        "label": "Check stimulus delivery with a replacement probe",
        "isCorrect": false,
        "rationale": "The palpable contraction shows the stimulus is reaching muscle; replacing the stimulating probe is less directed than checking acquisition.",
        "distractorRationale": "The palpable contraction shows the stimulus is reaching muscle; replacing the stimulating probe is less directed than checking acquisition."
      }
    ],
    "shuffleAnswers": true,
    "explanation": "Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.thyroid.electrode-contact",
      "claim.intraop.thyroid.twitch-recording",
      "claim.intraop.thyroid.stimulus-reaches-muscle",
      "claim.intraop.thyroid.blockade"
    ]
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "stem": "At the second recorded checkpoint after left lobectomy, which plan was most appropriate for {patientName}'s remaining thyroid surgery?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed operative-record observations: checkpoint 2",
      "items": [
        {
          "label": "Left recurrent nerve at laryngeal entry",
          "value": "EMG waveform and palpable laryngeal contraction present."
        },
        {
          "label": "Left recurrent nerve in lower neck",
          "value": "EMG waveform and palpable laryngeal contraction absent."
        },
        {
          "label": "Left vagus stimulus",
          "value": "EMG waveform and palpable laryngeal contraction absent."
        },
        {
          "label": "Right vagus stimulus",
          "value": "EMG waveform and palpable laryngeal contraction present."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.1",
        "label": "Defer contralateral lobectomy pending functional reassessment",
        "isCorrect": true,
        "rationale": "The distal response can bypass a proximal conduction problem. In this noninvasive cancer setting, defer right resection and reassess left laryngeal function.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2",
        "label": "Complete right lobectomy using continuous nerve monitoring",
        "isCorrect": false,
        "rationale": "Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.",
        "distractorRationale": "Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury."
      },
      {
        "id": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3",
        "label": "Exchange the electrode tube before completing right lobectomy",
        "isCorrect": false,
        "rationale": "Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.",
        "distractorRationale": "Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern."
      }
    ],
    "shuffleAnswers": true,
    "explanation": "The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.thyroid.visual-continuity",
      "claim.intraop.thyroid.distal-bypass",
      "claim.intraop.thyroid.verified-ipsilateral",
      "claim.intraop.thyroid.defer-contralateral",
      "claim.intraop.thyroid.no-permanence",
      "claim.intraop.thyroid.reassess-recovery",
      "claim.intraop.thyroid.electrode-contact"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
    "conceptId": "concept.intraop.unexpected-bowel.appendiceal-base-margin.v1",
    "stem": "Which initial resection should have been chosen for the unexpected appendiceal lesion in {patientName}'s recorded hospital operation?",
    "answerChoices": [
      {
        "id": "choice.intraop.unexpected-bowel.base-margin.cecal-cuff.20261112.v1",
        "label": "Resect appendix with a cecal cuff",
        "isCorrect": true,
        "rationale": "The enlargement reaches the appendiceal junction, so transecting that junction would cross abnormal tissue. A limited cuff takes the gross edge into the surrounding soft cecum while retaining the separate ileocecal valve. Retrieve the lesion intact and classify the specimen before considering oncologic extension.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.unexpected-bowel.base-margin.junction.20261112.v1",
        "label": "Resect appendix at its cecal junction",
        "isCorrect": false,
        "rationale": "This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.",
        "distractorRationale": "This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge."
      },
      {
        "id": "choice.intraop.unexpected-bowel.base-margin.ileocecal.20261112.v1",
        "label": "Resect ileocecal segment with primary anastomosis",
        "isCorrect": false,
        "rationale": "Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.",
        "distractorRationale": "Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment."
      }
    ],
    "explanation": "The junction is part of the abnormal appendix, while neighboring cecum offers a local gross margin away from the ileocecal valve. Appendectomy with a cecal cuff is the best initial specimen operation among these choices. Avoid rupture during handling and retrieval. This gross-anatomy decision does not determine the final tumor classification or establish an indication for oncologic colectomy.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.unexpected-bowel.abnormal-appendix",
      "claim.intraop.unexpected-bowel.base-margin",
      "claim.intraop.unexpected-bowel.intact-specimen",
      "claim.intraop.unexpected-bowel.histology-before-colectomy"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "conceptId": "concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1",
    "stem": "Which operative completion plan should have been chosen at this checkpoint in {patientName}'s exploration for presumed appendicitis?",
    "answerChoices": [
      {
        "id": "choice.intraop.unexpected-bowel.ileitis-restraint.preserve.20261112.v1",
        "label": "Preserve appendix and ileum at closure",
        "isCorrect": true,
        "rationale": "The visible disease is ileal, and its appearance does not prove Crohn disease rather than an infectious cause. The record supplies neither a separate appendiceal lesion nor a stricturing or penetrating complication. Preserve the appendix and ileum while arranging subsequent diagnostic assessment, rather than add an unneeded stump or resection.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.unexpected-bowel.ileitis-restraint.appendectomy.20261112.v1",
        "label": "Remove appendix and preserve terminal ileum",
        "isCorrect": false,
        "rationale": "Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.",
        "distractorRationale": "Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment."
      },
      {
        "id": "choice.intraop.unexpected-bowel.ileitis-restraint.ileocecal-resection.20261112.v1",
        "label": "Remove ileocecal segment and restore continuity",
        "isCorrect": false,
        "rationale": "The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.",
        "distractorRationale": "The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease."
      }
    ],
    "explanation": "This is an unexpected ileal inflammatory finding, not confirmation of Crohn disease or a new appendectomy indication. The normal-looking appendix should be preserved, and uncomplicated undiagnosed ileitis does not require immediate resection. Complete diagnostic assessment afterward. A separate appendiceal lesion, obstruction, perforation or another emergency would change the operative decision.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.unexpected-bowel.ileitis-nonspecific",
      "claim.intraop.unexpected-bowel.ileitis-resection-boundary",
      "claim.intraop.unexpected-bowel.normal-appendix-boundary",
      "claim.intraop.unexpected-bowel.ibd-emergency-boundary"
    ]
  }
];
export const PROGRAM_BATCH9_AUTHORED_CONCEPTS = [
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "revisionRound": 1,
    "id": "concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "displayName": "Apply the calcium-salt versus calcium-channel-blocker distinction when cardiac toxicity develops during malignant hyperthermia treatment.",
    "learningObjective": "Apply the calcium-salt versus calcium-channel-blocker distinction when cardiac toxicity develops during malignant hyperthermia treatment.",
    "conceptType": "management",
    "earliestFacilityStage": 3,
    "previousConceptId": null,
    "conceptMeaning": "unchanged_meaning",
    "conceptVersionReason": "Revision round 1 repairs the existing scored construct, wording, comparator or visible chronology under the same stable concept. No FSRS migration or changed concept identity.",
    "evidenceClaimIds": [
      "claim.intraop.i11.mh-pattern",
      "claim.intraop.i11.mh-treatment",
      "claim.intraop.i11.mh-potassium",
      "claim.intraop.i11.calcium-cardioprotection",
      "claim.intraop.i11.calcium-not-removal",
      "claim.intraop.i11.calcium-versus-ccb",
      "claim.intraop.i11.repeat-dantrolene",
      "claim.intraop.i11.mh-bicarbonate-complications"
    ],
    "historyMigration": "None; preserve all historical definitions and FSRS identities."
  },
  {
    "id": "concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "displayName": "Post-closure gas: reassess the patient",
    "learningObjective": "Distinguish residual gas after a clipped colonic defect from evidence of continuing leakage and choose monitored hospital care.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "identityDecision": "new_meaning",
    "identityReason": "Adds the stated care-phase-specific decision; no legacy concept/card is renamed, superseded or migrated.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.gas-after-closure",
      "claim.intraop.endoscopic-perforation-and-injury.conservative-colon-selection",
      "claim.intraop.endoscopic-perforation-and-injury.perforation-support",
      "claim.intraop.endoscopic-perforation-and-injury.deterioration-after-closure",
      "claim.intraop.endoscopic-perforation-and-injury.colonic-contrast-assessment",
      "claim.intraop.endoscopic-perforation-and-injury.early-colon-closure"
    ],
    "historyMigration": "None; preserve existing concept definitions, cards, saves and frozen encounters."
  },
  {
    "id": "concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "displayName": "Initial diversion for a recognized ERCP injury",
    "learningObjective": "Interpret periampullary contrast escape and select initial diversion with hospital care in a stable procedural patient.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "identityDecision": "new_meaning",
    "identityReason": "New procedural protection or injury/source-control objective. Existing ERCP drainage-extent and failed-access-rescue concepts keep their identities and learning histories.",
    "evidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.periampullary-pattern",
      "claim.intraop.ercp-access-and-adverse-events.sphincterotomy-margin-origin",
      "claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care",
      "claim.intraop.ercp-access-and-adverse-events.selected-endoscopic-diversion",
      "claim.intraop.ercp-access-and-adverse-events.failed-source-control-surgery"
    ],
    "historyMigration": "None; preserve prior concepts, FSRS cards and frozen encounters."
  },
  {
    "id": "concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "displayName": "Collection drainage after ERCP diversion",
    "learningObjective": "Recognize a symptomatic extraluminal collection after prior biliary diversion and select its source-control route.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "identityDecision": "new_meaning",
    "identityReason": "New procedural protection or injury/source-control objective. Existing ERCP drainage-extent and failed-access-rescue concepts keep their identities and learning histories.",
    "evidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care",
      "claim.intraop.ercp-access-and-adverse-events.collection-after-diversion",
      "claim.intraop.ercp-access-and-adverse-events.collection-percutaneous",
      "claim.intraop.ercp-access-and-adverse-events.ct-injury-assessment",
      "claim.intraop.ercp-access-and-adverse-events.failed-source-control-surgery"
    ],
    "historyMigration": "None; preserve prior concepts, FSRS cards and frozen encounters."
  },
  {
    "id": "concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "displayName": "Pancreatic protection after difficult access",
    "learningObjective": "Select pancreatic protection after repeated unintended pancreatic access despite rectal prophylaxis.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "identityDecision": "new_meaning",
    "identityReason": "New procedural protection or injury/source-control objective. Existing ERCP drainage-extent and failed-access-rescue concepts keep their identities and learning histories.",
    "evidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.pancreatic-access-risk",
      "claim.intraop.ercp-access-and-adverse-events.pancreatic-stent-prophylaxis",
      "claim.intraop.ercp-access-and-adverse-events.hydration-not-substitute"
    ],
    "historyMigration": "None; preserve prior concepts, FSRS cards and frozen encounters."
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.groin-hernia.sliding-content-dissection.v1",
    "displayName": "sliding sigmoid plane",
    "learningObjective": "Recognize bowel incorporated into a sac wall and choose a dissection plane that mobilizes the sliding component.",
    "educationalTier": 1,
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "previousConceptId": null,
    "identityReason": "New operative construct; existing direct-anatomy, recurrence-plane and contaminated-repair identities remain frozen.",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.sliding-wall",
      "claim.intraop.groin-hernia.sliding-plane",
      "claim.intraop.groin-hernia.ring-release-boundary"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1",
    "displayName": "adherent distal sac",
    "learningObjective": "Choose limited distal-sac handling when further complete dissection mechanically tensions cord structures.",
    "educationalTier": 1,
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "previousConceptId": null,
    "identityReason": "New operative construct; existing direct-anatomy, recurrence-plane and contaminated-repair identities remain frozen.",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.cord-sac",
      "claim.intraop.groin-hernia.distal-seroma",
      "claim.intraop.groin-hernia.dense-sac-plane"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1",
    "displayName": "urinary leak localization",
    "learningObjective": "Localize a suspected urinary tract injury from the operative field and drainage-bag change before choosing a confirmatory maneuver.",
    "educationalTier": 1,
    "earliestFacilityStage": 3,
    "conceptType": "workup",
    "previousConceptId": null,
    "identityReason": "New operative construct; existing direct-anatomy, recurrence-plane and contaminated-repair identities remain frozen.",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.bladder-sign",
      "claim.intraop.groin-hernia.bladder-fill",
      "claim.intraop.groin-hernia.ureter-testing"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.lap-access.major-access-injury.v1",
    "displayName": "Preserve a suspected injury track while obtaining hospital vascular control",
    "learningObjective": "Use an expanding deep hematoma and recurrent instability to select controlled open exposure before withdrawing the access cannula that remains at the injury.",
    "earliestFacilityStage": 1,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.intraop.lap-access.major-injury",
      "claim.intraop.lap-access.major-control",
      "claim.intraop.lap-access.access-cannula-retention"
    ],
    "identityDecision": "new_scored_meaning",
    "previousConceptId": null,
    "reason": "An immediate operative action differs from the retained mechanism/history constructs; preserve every old identity and FSRS history."
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1",
    "displayName": "Temporize posterior hepatic bleeding after an inflow clamp",
    "learningObjective": "Integrate regional response to a Pringle maneuver and physiological trajectory to choose the next hemorrhage-control maneuver.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "previousConceptId": null,
    "identityDecision": "new_meaning",
    "identityReason": "No assigned definition tests regional Pringle response and organ-specific exposed-field control. Existing FSRS meanings remain intact.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.pringle-inflow",
      "claim.intraop.operative-hemorrhage.pringle-posterior",
      "claim.intraop.operative-hemorrhage.pringle-variant-artery",
      "claim.intraop.operative-hemorrhage.hepatic-packing",
      "claim.intraop.operative-hemorrhage.hepatic-repacking",
      "claim.intraop.operative-hemorrhage.hepatic-repair-boundary",
      "claim.intraop.operative-hemorrhage.hepatic-arterial-ligation"
    ],
    "historyMigration": "None; existing concepts, FSRS cards and frozen versions are preserved."
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.revision1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.i25.anatomy-before-dilation.20261112.v1",
    "displayName": "An incomplete luminal survey before pediatric EoE dilation",
    "learningObjective": "Choose the next investigation when a newly seen narrowing prevents endoscopy from defining its distal extent.",
    "earliestFacilityStage": 4,
    "conceptType": "workup",
    "educationalTier": 1,
    "identityDecision": "new_meaning",
    "previousConceptId": null,
    "identityReason": "The decision is which investigation resolves an incomplete intra-endoscopic anatomic survey before dilation. The adult dilation-plus-inflammatory-care concept decides mechanical treatment versus inflammatory escalation and remains frozen.",
    "definitionScope": "new_proposed_concept",
    "historyMigration": "None. Preserve adult meanings, approved/PASS versions, frozen encounters, saves and FSRS histories.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.i25.anatomy-before-dilation.20261112.v1",
      "claim.intraop.i25.structural-histology.20261112.v1",
      "claim.intraop.i25.motility-scope.20261112.v1",
      "claim.intraop.i25.biopsy-scope.20261112.v1",
      "claim.intraop.i25.topical-response.20261112.v1"
    ]
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.i24.battery-injury-imaging.20261112.v1",
    "displayName": "Assessment beyond the lumen after battery removal",
    "learningObjective": "Select the next investigation when a removed esophageal battery has left deep injury at a vascular level.",
    "earliestFacilityStage": 4,
    "conceptType": "workup",
    "educationalTier": 1,
    "previousConceptId": null,
    "identityDecision": "new_meaning",
    "identityReason": "New pediatric battery or magnet procedural objective, distinct from adult swallowed-bone CT and extraluminal-bone source-control meanings.",
    "historyMigration": "None. Existing accepted/retained concepts, questions, frozen cases, saves and FSRS remain unchanged.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.i24.battery-injury-assessment.20261112.v1",
      "claim.intraop.i24.battery-cross-sectional.20261112.v1",
      "claim.intraop.i24.battery-swallow-role.20261112.v1",
      "claim.intraop.i24.battery-observation.20261112.v1",
      "claim.intraop.i24.battery-catheter-angiography.20261112.v1"
    ]
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.revision1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "displayName": "Resolve whether the recorded first-side check verifies the operated pathway before deciding the next operative step.",
    "learningObjective": "Resolve whether the recorded first-side check verifies the operated pathway before deciding the next operative step.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "previousConceptId": null,
    "conceptRelation": "new_meaning",
    "educationalTier": 2,
    "evidenceClaimIds": [
      "claim.intraop.thyroid.whole-path",
      "claim.intraop.thyroid.distal-bypass",
      "claim.intraop.thyroid.verified-ipsilateral",
      "claim.intraop.thyroid.defer-contralateral",
      "claim.intraop.thyroid.reassess-recovery"
    ],
    "identityReason": "Stable concept, case, node, question, profile and choice IDs retained by manager direction. The underlying objective remains verification of the operated recurrent pathway before contralateral surgery; record-site provenance now makes the verification decision consequential. The prior unaccepted exact version, including its timing/order bindings, is archived; no live history or approved construct is migrated. No prior card migration."
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "displayName": "Localize discordant physical and recorded responses before changing the operative plan.",
    "learningObjective": "Localize discordant physical and recorded responses before changing the operative plan.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "previousConceptId": null,
    "conceptRelation": "new_meaning",
    "educationalTier": 2,
    "evidenceClaimIds": [
      "claim.intraop.thyroid.electrode-contact",
      "claim.intraop.thyroid.twitch-recording",
      "claim.intraop.thyroid.stimulus-reaches-muscle",
      "claim.intraop.thyroid.blockade"
    ],
    "identityReason": "New intraoperative scored construct; postoperative voice testing, EBSLN localization and central-node planning retain their stable IDs and FSRS history. No prior card migration."
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "displayName": "Choose operative extent after a verified first-side proximal conduction failure.",
    "learningObjective": "Choose operative extent after a verified first-side proximal conduction failure.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "previousConceptId": null,
    "conceptRelation": "new_meaning",
    "educationalTier": 2,
    "evidenceClaimIds": [
      "claim.intraop.thyroid.visual-continuity",
      "claim.intraop.thyroid.distal-bypass",
      "claim.intraop.thyroid.verified-ipsilateral",
      "claim.intraop.thyroid.defer-contralateral",
      "claim.intraop.thyroid.no-permanence",
      "claim.intraop.thyroid.reassess-recovery",
      "claim.intraop.thyroid.electrode-contact"
    ],
    "identityReason": "New intraoperative scored construct; postoperative voice testing, EBSLN localization and central-node planning retain their stable IDs and FSRS history. No prior card migration."
  },
  {
    "id": "concept.intraop.unexpected-bowel.appendiceal-base-margin.v1",
    "displayName": "Initial excision at an abnormal appendiceal base",
    "learningObjective": "Interpret appendiceal-base involvement and neighboring cecal anatomy to choose the initial specimen operation before histological classification.",
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "educationalTier": 1,
    "previousConceptId": null,
    "conceptRelation": "new_meaning",
    "relatedConceptIds": [
      "concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1"
    ],
    "evidenceClaimIds": [
      "claim.intraop.unexpected-bowel.abnormal-appendix",
      "claim.intraop.unexpected-bowel.base-margin",
      "claim.intraop.unexpected-bowel.intact-specimen",
      "claim.intraop.unexpected-bowel.histology-before-colectomy"
    ],
    "historyMigration": "None. Distinct operative checkpoint meanings; no existing FSRS identity or frozen definition is reassigned."
  },
  {
    "id": "concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1",
    "displayName": "Limit intervention for unsuspected terminal ileitis",
    "learningObjective": "Use a normal appendiceal appearance and uncomplicated terminal ileal inflammation to choose operative restraint while the etiology remains unconfirmed.",
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "educationalTier": 1,
    "previousConceptId": null,
    "conceptRelation": "new_meaning",
    "relatedConceptIds": [],
    "evidenceClaimIds": [
      "claim.intraop.unexpected-bowel.ileitis-nonspecific",
      "claim.intraop.unexpected-bowel.ileitis-resection-boundary",
      "claim.intraop.unexpected-bowel.normal-appendix-boundary",
      "claim.intraop.unexpected-bowel.ibd-emergency-boundary"
    ],
    "historyMigration": "None. Distinct operative checkpoint meanings; no existing FSRS identity or frozen definition is reassigned."
  }
];
export const PROGRAM_BATCH9_TIMINGS:AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1",
    "nodeId": "node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.monitor",
          "choiceLabel": "Inpatient observation with serial clinical examinations",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat",
          "choiceLabel": "Repeat colonoscopy to reassess the clipped defect",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy",
          "choiceLabel": "Laparoscopic exploration with reinforcement of the closure",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.groin-hernia.urinary-findings.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.groin-hernia.urinary-leak-localization.retrograde-fill.20261112.v1",
          "choiceLabel": "Instill dyed saline through the indwelling catheter",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.general_diagnostic"
          }
        },
        {
          "choiceId": "choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1",
          "choiceLabel": "Give intravenous indigo carmine and inspect the field",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.general_diagnostic"
          }
        },
        {
          "choiceId": "choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1",
          "choiceLabel": "Obtain retrograde pyelography through a ureteric catheter",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.lap-access.outside-access-rescue.20261112.v1",
    "nodeId": "node.intraop.lap-access.major-access-injury.20261112.v1",
    "questionVariantId": "question.intraop.lap-access.major-access-injury.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1",
    "nodeId": "node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "questionVariantId": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.i25.unmapped-narrowing.20261112.v1",
    "nodeId": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
    "questionVariantId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.i25.anatomy-before-dilation.esophagram.20261112.v1",
          "choiceLabel": "Barium contrast esophagram",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.contrast_swallow"
          }
        },
        {
          "choiceId": "choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.esophageal_manometry"
          }
        },
        {
          "choiceId": "choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1",
          "choiceLabel": "Repeat esophageal mucosal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.esophageal_multilevel_biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.i24.battery-injury-record.20261112.v1",
    "nodeId": "node.intraop.i24.battery-injury-imaging.20261112.v1",
    "questionVariantId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.i24.battery-injury-imaging.cta.20261112.v1",
          "choiceLabel": "Computed tomographic chest angiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct_angiography"
          }
        },
        {
          "choiceId": "choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1",
          "choiceLabel": "Water-soluble contrast esophagography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.contrast_swallow"
          }
        },
        {
          "choiceId": "choice.intraop.i24.battery-injury-imaging.egd.20261112.v1",
          "choiceLabel": "Catheter-based thoracic aortography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.1",
          "choiceLabel": "Obtain operated-side vagal responses to determine further resection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.2",
          "choiceLabel": "Complete right lobectomy using continuous recurrent-nerve monitoring",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.3",
          "choiceLabel": "Stage right lobectomy pending postoperative flexible laryngoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.recording-check.1",
          "choiceLabel": "Check tube position and electrode contact",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.recording-check.2",
          "choiceLabel": "Check neuromuscular recovery with quantitative twitch monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.recording-check.3",
          "choiceLabel": "Check stimulus delivery with a replacement probe",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.1",
          "choiceLabel": "Defer contralateral lobectomy pending functional reassessment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2",
          "choiceLabel": "Complete right lobectomy using continuous nerve monitoring",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3",
          "choiceLabel": "Exchange the electrode tube before completing right lobectomy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.unexpected-bowel.base-margin.20261112.v1",
    "nodeId": "node.intraop.unexpected-bowel.base-margin.20261112.v1",
    "questionVariantId": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "nodeId": "node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "questionVariantId": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  }
];
export const PROGRAM_BATCH9_ORDERS = [
  {
    "caseId": "case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "choiceId": "choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat",
    "choiceLabel": "Repeat colonoscopy to reassess the clipped defect",
    "timingProfileId": "timing.test.lower_endoscopy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.groin-hernia.urinary-findings.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "choiceId": "choice.intraop.groin-hernia.urinary-leak-localization.retrograde-fill.20261112.v1",
    "choiceLabel": "Instill dyed saline through the indwelling catheter",
    "timingProfileId": "timing.test.general_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.groin-hernia.urinary-findings.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "choiceId": "choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1",
    "choiceLabel": "Give intravenous indigo carmine and inspect the field",
    "timingProfileId": "timing.test.general_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.groin-hernia.urinary-findings.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "choiceId": "choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1",
    "choiceLabel": "Obtain retrograde pyelography through a ureteric catheter",
    "timingProfileId": "timing.test.radiography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.i25.unmapped-narrowing.20261112.v1",
    "nodeId": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
    "questionVariantId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "choiceId": "choice.intraop.i25.anatomy-before-dilation.esophagram.20261112.v1",
    "choiceLabel": "Barium contrast esophagram",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.i25.unmapped-narrowing.20261112.v1",
    "nodeId": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
    "questionVariantId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "choiceId": "choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1",
    "choiceLabel": "High-resolution esophageal manometry",
    "timingProfileId": "timing.test.esophageal_manometry",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.i25.unmapped-narrowing.20261112.v1",
    "nodeId": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
    "questionVariantId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "choiceId": "choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1",
    "choiceLabel": "Repeat esophageal mucosal biopsies",
    "timingProfileId": "timing.test.esophageal_multilevel_biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.i24.battery-injury-record.20261112.v1",
    "nodeId": "node.intraop.i24.battery-injury-imaging.20261112.v1",
    "questionVariantId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "choiceId": "choice.intraop.i24.battery-injury-imaging.cta.20261112.v1",
    "choiceLabel": "Computed tomographic chest angiography",
    "timingProfileId": "timing.test.ct_angiography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.i24.battery-injury-record.20261112.v1",
    "nodeId": "node.intraop.i24.battery-injury-imaging.20261112.v1",
    "questionVariantId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "choiceId": "choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1",
    "choiceLabel": "Water-soluble contrast esophagography",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.i24.battery-injury-record.20261112.v1",
    "nodeId": "node.intraop.i24.battery-injury-imaging.20261112.v1",
    "questionVariantId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "choiceId": "choice.intraop.i24.battery-injury-imaging.egd.20261112.v1",
    "choiceLabel": "Catheter-based thoracic aortography",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "choiceId": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.1",
    "choiceLabel": "Obtain operated-side vagal responses to determine further resection",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "choiceId": "choice.intraop.thyroid-nerve-monitoring.proximal-verification.3",
    "choiceLabel": "Stage right lobectomy pending postoperative flexible laryngoscopy",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "choiceId": "choice.intraop.thyroid-nerve-monitoring.recording-check.1",
    "choiceLabel": "Check tube position and electrode contact",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "choiceId": "choice.intraop.thyroid-nerve-monitoring.recording-check.2",
    "choiceLabel": "Check neuromuscular recovery with quantitative twitch monitoring",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "choiceId": "choice.intraop.thyroid-nerve-monitoring.recording-check.3",
    "choiceLabel": "Check stimulus delivery with a replacement probe",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "choiceId": "choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3",
    "choiceLabel": "Exchange the electrode tube before completing right lobectomy",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const PROGRAM_BATCH9_FAMILIES = [
  {
    "id": "family.intraop.i25.unmapped-narrowing.20261112.v1",
    "caseId": "case.intraop.i25.unmapped-narrowing.20261112.v1",
    "profileId": "profile.intraop.i25.unmapped-narrowing.20261112.v1",
    "childName": "Isla Chen",
    "childStillId": "level3-roster-v2.025",
    "parentName": "Daniel Chen",
    "parentRelationship": "father",
    "prototypeDemographics": {
      "ageYears": 11,
      "sexLabel": "Female"
    },
    "parentCount": 1,
    "parentPlacement": "same_room_throughout",
    "metadataSource": "tools/character-mapping/level3-roster-complete-v2/roster.json",
    "profileValuesBasis": "editorial_art_contract_not_disease_probability",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "family.intraop.i24.battery-injury-record.20261112.v1",
    "caseId": "case.intraop.i24.battery-injury-record.20261112.v1",
    "profileId": "profile.intraop.i24.battery-injury-record.20261112.v1",
    "childName": "Leah Morgan",
    "childStillId": "level3-roster-v2.021",
    "parentName": "Elena Morgan",
    "parentRelationship": "mother",
    "prototypeDemographics": {
      "ageYears": 6,
      "sexLabel": "Female"
    },
    "parentCount": 1,
    "parentPlacement": "same_room_throughout",
    "metadataSource": "tools/character-mapping/level3-roster-complete-v2/roster.json",
    "profileValuesBasis": "editorial_art_contract_not_disease_probability",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
] as const;
export const PROGRAM_BATCH9_FROZEN = [
  {
    "nodeId": "node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "caseId": "case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1",
    "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "sourceCaseExport": "INTRAOP_I11_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"revisionRound\":1,\"id\":\"question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1\",\"conceptId\":\"concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1\",\"stem\":\"During {patientName}'s paused hernia repair, which medication plan best fits the current findings?\",\"explanation\":\"The potassium result and new conduction changes call for calcium-salt cardiac protection. The displayed dantrolene warning concerns calcium-channel blockers; calcium gluconate is a different drug category. Potassium shifting, malignant hyperthermia treatment and transfer preparation remain shared care. Bicarbonate may address a separate metabolic indication but does not replace the indicated calcium protection.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Current monitoring and medication information\",\"items\":[{\"label\":\"Expired carbon dioxide\",\"value\":\"Falling toward the earlier baseline on current ventilation\"},{\"label\":\"Muscle examination\",\"value\":\"Generalized rigidity has eased\"},{\"label\":\"Point-of-care potassium\",\"value\":\"Above the laboratory critical range\"},{\"label\":\"Cardiac monitor report\",\"value\":\"New peaked T waves and widening QRS complexes; pulse present\"},{\"label\":\"Medication reference\",\"value\":\"A serious interaction is flagged between dantrolene and calcium-channel blockers\"}]},\"supportingEvidenceClaimIds\":[\"claim.intraop.i11.mh-pattern\",\"claim.intraop.i11.mh-treatment\",\"claim.intraop.i11.mh-potassium\",\"claim.intraop.i11.calcium-cardioprotection\",\"claim.intraop.i11.calcium-not-removal\",\"claim.intraop.i11.calcium-versus-ccb\",\"claim.intraop.i11.repeat-dantrolene\",\"claim.intraop.i11.mh-bicarbonate-complications\"],\"answerChoices\":[{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.calcium.v1\",\"label\":\"Give calcium gluconate\",\"isCorrect\":true,\"rationale\":\"The reported potassium-associated conduction changes warrant calcium-salt cardiac protection. Calcium gluconate is not a calcium-channel blocker, so the displayed interaction warning does not require withholding it during dantrolene treatment.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.dantrolene.v1\",\"label\":\"Defer calcium gluconate\",\"isCorrect\":false,\"rationale\":\"The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.\",\"distractorRationale\":\"The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.\"},{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.amiodarone.v1\",\"label\":\"Use sodium bicarbonate\",\"isCorrect\":false,\"rationale\":\"Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.\",\"distractorRationale\":\"Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1\",\"questionVariantId\":\"question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1\",\"primaryConceptId\":\"concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1\",\"stem\":\"During {patientName}'s paused hernia repair, which medication plan best fits the current findings?\",\"currentUpdate\":\"Insulin with dextrose is being administered, and hospital transfer is being arranged. The anesthetist reviews the following monitoring results and medication information.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Current monitoring and medication information\",\"items\":[{\"label\":\"Expired carbon dioxide\",\"value\":\"Falling toward the earlier baseline on current ventilation\"},{\"label\":\"Muscle examination\",\"value\":\"Generalized rigidity has eased\"},{\"label\":\"Point-of-care potassium\",\"value\":\"Above the laboratory critical range\"},{\"label\":\"Cardiac monitor report\",\"value\":\"New peaked T waves and widening QRS complexes; pulse present\"},{\"label\":\"Medication reference\",\"value\":\"A serious interaction is flagged between dantrolene and calcium-channel blockers\"}]},\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.calcium.v1\",\"label\":\"Give calcium gluconate\",\"isCorrect\":true,\"rationale\":\"The reported potassium-associated conduction changes warrant calcium-salt cardiac protection. Calcium gluconate is not a calcium-channel blocker, so the displayed interaction warning does not require withholding it during dantrolene treatment.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.dantrolene.v1\",\"label\":\"Defer calcium gluconate\",\"isCorrect\":false,\"rationale\":\"The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.amiodarone.v1\",\"label\":\"Use sodium bicarbonate\",\"isCorrect\":false,\"rationale\":\"Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.\",\"serviceRequest\":null}],\"explanation\":\"The potassium result and new conduction changes call for calcium-salt cardiac protection. The displayed dantrolene warning concerns calcium-channel blockers; calcium gluconate is a different drug category. Potassium shifting, malignant hyperthermia treatment and transfer preparation remain shared care. Bicarbonate may address a separate metabolic indication but does not replace the indicated calcium protection.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.dantrolene.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or rescue intervention is executed by this consult.\",\"clinicalRationale\":\"The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia\"]},{\"answerChoiceId\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.amiodarone.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or rescue intervention is executed by this consult.\",\"clinicalRationale\":\"Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1\",\"displayName\":\"ASC procedure: Aaron Reed\",\"patientDisplayName\":\"Aaron Reed\",\"patientPresentationVariantId\":\"presentation.intraop.i11.mh-electrolyte.v1\",\"prototypeDemographics\":{\"ageYears\":47,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"{patientName}, a 47-year-old man, is undergoing open inguinal hernia repair in the clinic's ASC OR. Rising expired carbon dioxide and generalized rigidity developed during sevoflurane anesthesia. The operation is paused; sevoflurane has been stopped and the anesthetist is giving dantrolene with oxygenation and ventilation support.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.i11.mh-electrolyte.v1\",\"prototypeDemographics\":{\"ageYears\":47,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"{patientName}, a 47-year-old man, is undergoing open inguinal hernia repair in the clinic's ASC OR. Rising expired carbon dioxide and generalized rigidity developed during sevoflurane anesthesia. The operation is paused; sevoflurane has been stopped and the anesthetist is giving dantrolene with oxygenation and ventilation support.\"}],\"releasePointId\":\"release.l3.ambulatory\",\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia\"],\"decisionNodes\":[{\"id\":\"node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1\",\"questionVariantId\":\"question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1\",\"primaryConceptId\":\"concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1\",\"stem\":\"During {patientName}'s paused hernia repair, which medication plan best fits the current findings?\",\"currentUpdate\":\"Insulin with dextrose is being administered, and hospital transfer is being arranged. The anesthetist reviews the following monitoring results and medication information.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Current monitoring and medication information\",\"items\":[{\"label\":\"Expired carbon dioxide\",\"value\":\"Falling toward the earlier baseline on current ventilation\"},{\"label\":\"Muscle examination\",\"value\":\"Generalized rigidity has eased\"},{\"label\":\"Point-of-care potassium\",\"value\":\"Above the laboratory critical range\"},{\"label\":\"Cardiac monitor report\",\"value\":\"New peaked T waves and widening QRS complexes; pulse present\"},{\"label\":\"Medication reference\",\"value\":\"A serious interaction is flagged between dantrolene and calcium-channel blockers\"}]},\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.calcium.v1\",\"label\":\"Give calcium gluconate\",\"isCorrect\":true,\"rationale\":\"The reported potassium-associated conduction changes warrant calcium-salt cardiac protection. Calcium gluconate is not a calcium-channel blocker, so the displayed interaction warning does not require withholding it during dantrolene treatment.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.dantrolene.v1\",\"label\":\"Defer calcium gluconate\",\"isCorrect\":false,\"rationale\":\"The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.amiodarone.v1\",\"label\":\"Use sodium bicarbonate\",\"isCorrect\":false,\"rationale\":\"Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.\",\"serviceRequest\":null}],\"explanation\":\"The potassium result and new conduction changes call for calcium-salt cardiac protection. The displayed dantrolene warning concerns calcium-channel blockers; calcium gluconate is a different drug category. Potassium shifting, malignant hyperthermia treatment and transfer preparation remain shared care. Bicarbonate may address a separate metabolic indication but does not replace the indicated calcium protection.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.dantrolene.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or rescue intervention is executed by this consult.\",\"clinicalRationale\":\"The warning concerns calcium-channel blockers rather than calcium salts. Deferring the salt on that basis leaves the represented electrical toxicity untreated.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia\"]},{\"answerChoiceId\":\"choice.intraop.i11.mh-potassium-cardiotoxicity.amiodarone.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or rescue intervention is executed by this consult.\",\"clinicalRationale\":\"Bicarbonate can have a role in malignant-hyperthermia complications, but it does not replace the calcium-salt cardiac protection indicated by these potassium and conduction findings. The displayed interaction is not a reason to substitute it for calcium.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia\"]}]}],\"learningSummary\":\"The potassium result and new conduction changes call for calcium-salt cardiac protection. The displayed dantrolene warning concerns calcium-channel blockers; calcium gluconate is a different drug category. Potassium shifting, malignant hyperthermia treatment and transfer preparation remain shared care. Bicarbonate may address a separate metabolic indication but does not replace the indicated calcium protection.\"}",
    "sourceQuestionSha256": "72d651012375795434e5b8e12a183812f7830dba8bfb8e5fac71a5914fcb0462",
    "sourceNodeSha256": "f27b4aa72eeacff8d092d3901e7c52efa4ba36d550dc66e33d7fa8a5d98dea8d",
    "sourceCaseSha256": "524996752e41e27f1a8c2d6b0bc1c49ffec22dcbf3e3db62541cb2e70e9d715c",
    "acceptedQuestionSha256": "72d651012375795434e5b8e12a183812f7830dba8bfb8e5fac71a5914fcb0462",
    "acceptedNodeSha256": "f27b4aa72eeacff8d092d3901e7c52efa4ba36d550dc66e33d7fa8a5d98dea8d",
    "acceptedCaseSha256": "32128bc33c1f68b0b51d52467c10b27331900531bc1dea08b5ab01f30ea667a4",
    "review": {
      "path": "docs/research/question-intraop-anesthetic-intraoperative-crises-review2-20261112.json",
      "record": {
        "id": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
        "nodeId": "node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
        "title": "Cardiac protection during malignant hyperthermia treatment",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [
          {
            "phrase": "Give calcium gluconate / Defer calcium gluconate",
            "why": "The opposed pair attracts attention to the calcium decision and can narrow a test-wise reader's search. It does not establish which member is correct: administering versus withholding this specific drug is the substantive safety decision. This is a limited structural cue, not a sufficient nonmedical route to the key."
          },
          {
            "phrase": "A serious interaction is flagged between dantrolene and calcium-channel blockers",
            "why": "The warning repeats 'calcium' in both opposed choices, so it does not uniquely match the key. Applying the warning to calcium gluconate still requires pharmacologic knowledge. The statement supplies a competing safety consideration without telling the reader whether the proposed salt belongs to the warned class."
          }
        ],
        "fairness": [
          "Calcium gluconate is the defensible best offered plan for critically flagged potassium with new peaked T waves and widening QRS complexes while insulin/dextrose is already being administered. The calcium-salt versus calcium-channel-blocker distinction now matters to the actual give-versus-defer alternatives. No confident clinical inaccuracy or equally good alternative was identified in this offline assessment.",
          "Two consequential steps are present: recognize the electrical danger that still requires cardiac protection despite treatment of the underlying crisis, then apply the interaction warning to the actual drug category before deciding whether to administer that protection. The second step is no longer confined to the explanation. The task is moderate, not hard; a resident comfortable with hyperkalemia and this drug distinction will answer quickly.",
          "Bicarbonate can be relevant to metabolic complications, but no acid-base indication is supplied and it is not an equivalent replacement for calcium's immediate cardiac effect. The explanation appropriately permits its separate use. The broad wording 'which medication plan best fits' is understandable as a priority comparison here, although a future version could make that priority more explicit without naming cardiac stabilization in the task.",
          "Open inguinal hernia repair under sevoflurane is a plausible ambulatory operation. Recognition, stopping the trigger, dantrolene/support, identification of an electrolyte complication and transfer preparation occur in a coherent order. The already available potassium and monitor report make the decision-critical findings visible. The item does not ask the learner to interpret an absent ECG image.",
          "The falling expired carbon dioxide and eased rigidity add trajectory context but are not strong discriminators among these particular choices. Removing those rows would not eliminate the immediate calcium indication; they should not be counted as extra reasoning steps.",
          "Aaron Reed's name, adult age, sex, short complaint and paused procedural stage are consistent. This standalone node needs no preceding scored answer. There are no testing choices requiring wait estimates. Clinical plausibility assumes anesthesia, crisis medicines, monitoring, point-of-care testing and transfer resources; the prose does not establish their actual availability in the game.",
          "Review scope: all four executable nodes in the current proposedCases and their candidate visible context were reviewed. The 103 kept audit records and 23 held planning records were noted and excluded from scored review; historical, parked and otherwise non-executable material was not reassessed. Verdicts are independent editorial assessments of the current wording, not acceptance of author self-checks, fresh source verification or clinical sign-off. No network was used. Every draft remains needs_clinician_review pending Melissa Rowland's exact-version approval."
        ],
        "suggestions": [
          "Preserve the potassium/conduction findings, shared insulin/dextrose treatment and explicit drug-class distinction. Do not hide those findings to increase difficulty or describe the item as independent ECG interpretation.",
          "Optional for a future version: ask which medication action should be prioritized at this reassessment, retaining a neutral task rather than announcing the desired cardiac-protection mechanism. Re-review any changed option set; the present opposed pair is a limited cue, not grounds to replace it with implausible filler.",
          "Keep actual facility-resource verification and exact-version clinician approval separate from this editorial PASS."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "sourceCaseExport": "ENDOSCOPIC_INJURY_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1\",\"conceptId\":\"concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1\",\"stem\":\"At that hospital reassessment after sigmoid clip closure, which plan best fit {patientName}'s clinical and CT findings?\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.monitor\",\"label\":\"Inpatient observation with serial clinical examinations\",\"isCorrect\":true,\"rationale\":\"Residual gas does not by itself establish closure failure. Taken together, the improving symptoms, soft abdomen and completed contrast study support inpatient monitoring with the treatment already started.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat\",\"label\":\"Repeat colonoscopy to reassess the clipped defect\",\"isCorrect\":false,\"rationale\":\"Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.\",\"distractorRationale\":\"Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.\"},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy\",\"label\":\"Laparoscopic exploration with reinforcement of the closure\",\"isCorrect\":false,\"rationale\":\"Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.\",\"distractorRationale\":\"Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.\"}],\"explanation\":\"Free gas can remain after an injury has been closed. The clinical trajectory, examination and contrast CT support inpatient monitoring with the treatment already started. They do not prove a durable seal. New peritoneal signs, worsening physiology or demonstrated leakage would require urgent surgical reassessment.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.endoscopic-perforation-and-injury.gas-after-closure\",\"claim.intraop.endoscopic-perforation-and-injury.conservative-colon-selection\",\"claim.intraop.endoscopic-perforation-and-injury.perforation-support\",\"claim.intraop.endoscopic-perforation-and-injury.deterioration-after-closure\",\"claim.intraop.endoscopic-perforation-and-injury.colonic-contrast-assessment\",\"claim.intraop.endoscopic-perforation-and-injury.early-colon-closure\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1\",\"stem\":\"At that hospital reassessment after sigmoid clip closure, which plan best fit {patientName}'s clinical and CT findings?\",\"currentUpdate\":\"At the first hospital reassessment after clip closure of a small sigmoid defect, discomfort was improving. The abdomen was soft with localized tenderness; blood pressure and temperature were normal. CT with intravenous and water-soluble rectal contrast showed pericolic gas without extravasation or free fluid. Oral intake was withheld, and intravenous fluids and antibiotics had begun.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.monitor\",\"label\":\"Inpatient observation with serial clinical examinations\",\"isCorrect\":true,\"rationale\":\"Residual gas does not by itself establish closure failure. Taken together, the improving symptoms, soft abdomen and completed contrast study support inpatient monitoring with the treatment already started.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat\",\"label\":\"Repeat colonoscopy to reassess the clipped defect\",\"isCorrect\":false,\"rationale\":\"Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy\",\"label\":\"Laparoscopic exploration with reinforcement of the closure\",\"isCorrect\":false,\"rationale\":\"Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Free gas can remain after an injury has been closed. The clinical trajectory, examination and contrast CT support inpatient monitoring with the treatment already started. They do not prove a durable seal. New peritoneal signs, worsening physiology or demonstrated leakage would require urgent surgical reassessment.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"]},{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1\",\"displayName\":\"Colonoscopy record review\",\"patientDisplayName\":\"Nora Bennett\",\"patientPresentationVariantId\":\"presentation.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1\",\"prototypeDemographics\":{\"ageYears\":60,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy record review\",\"presentation\":\"{patientName}, a 60-year-old woman, attends clinic with the outside endoscopy and hospital records from her recent colonoscopy.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1\",\"prototypeDemographics\":{\"ageYears\":60,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy record review\",\"presentation\":\"{patientName}, a 60-year-old woman, attends clinic with the outside endoscopy and hospital records from her recent colonoscopy.\"}],\"releasePointId\":\"release.l0.clinic_evaluation\",\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"],\"decisionNodes\":[{\"id\":\"node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1\",\"stem\":\"At that hospital reassessment after sigmoid clip closure, which plan best fit {patientName}'s clinical and CT findings?\",\"currentUpdate\":\"At the first hospital reassessment after clip closure of a small sigmoid defect, discomfort was improving. The abdomen was soft with localized tenderness; blood pressure and temperature were normal. CT with intravenous and water-soluble rectal contrast showed pericolic gas without extravasation or free fluid. Oral intake was withheld, and intravenous fluids and antibiotics had begun.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.monitor\",\"label\":\"Inpatient observation with serial clinical examinations\",\"isCorrect\":true,\"rationale\":\"Residual gas does not by itself establish closure failure. Taken together, the improving symptoms, soft abdomen and completed contrast study support inpatient monitoring with the treatment already started.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat\",\"label\":\"Repeat colonoscopy to reassess the clipped defect\",\"isCorrect\":false,\"rationale\":\"Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy\",\"label\":\"Laparoscopic exploration with reinforcement of the closure\",\"isCorrect\":false,\"rationale\":\"Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Free gas can remain after an injury has been closed. The clinical trajectory, examination and contrast CT support inpatient monitoring with the treatment already started. They do not prove a durable seal. New peritoneal signs, worsening physiology or demonstrated leakage would require urgent surgical reassessment.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Repeat instrumentation is not required solely for residual gas when the clinical and CT assessment supports observation. A specific residual closure problem may need specialist endoscopic reassessment.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"]},{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.laparoscopy\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Surgical reassessment is important for deterioration, peritoneal signs or an ongoing leak. Residual gas in this improving patient does not establish those indications.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"]}]}],\"learningSummary\":\"Free gas can remain after an injury has been closed. The clinical trajectory, examination and contrast CT support inpatient monitoring with the treatment already started. They do not prove a durable seal. New peritoneal signs, worsening physiology or demonstrated leakage would require urgent surgical reassessment.\"}",
    "sourceQuestionSha256": "ac2fd6eba228308c2d41cb4ea9474d8ce5667803798cbc50237ede95f6654f48",
    "sourceNodeSha256": "44f6e67479ee9e76e255de875306a6d721201bb8506bbac8b009a7da1f80228c",
    "sourceCaseSha256": "bf9e6fbcab377b0a39e2c7a4a65f8c3435ac343166d39c5fb4d7927cae6e3d4d",
    "acceptedQuestionSha256": "ac2fd6eba228308c2d41cb4ea9474d8ce5667803798cbc50237ede95f6654f48",
    "acceptedNodeSha256": "44f6e67479ee9e76e255de875306a6d721201bb8506bbac8b009a7da1f80228c",
    "acceptedCaseSha256": "52f7bb2fe3fc3f448be552c364ee5feb5c31c0bce8847dd2d715abaee2cf7b1c",
    "review": {
      "path": "docs/research/question-intraop-endoscopic-perforation-and-injury-review2-20261112.json",
      "record": {
        "id": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
        "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
        "title": "Post-closure gas: reassess the patient",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Inpatient observation with serial examinations is the best offered plan at the recorded reassessment. Improving discomfort, a soft abdomen with localized tenderness, preserved physiology and no demonstrated contrast leak or free fluid support monitored care despite pericolic gas. Repeat colonoscopy or exploration solely in response to that gas is not justified by the supplied course.",
          "Two consequential steps are present: interpret gas after closure alongside symptoms, examination and the completed contrast study, then decide whether another invasive intervention is warranted. Equating extraluminal gas with automatic surgery is a recognizable high-yield error. Difficulty is lower-moderate because the clinical and imaging observations consistently favor monitoring; this is not a hard or calibrated item.",
          "Cue attack: 'discomfort was improving' and 'without extravasation or free fluid' are needed clinical discriminators rather than pre-answer teaching. They do not literally repeat the observation option. The three plans are comparable in specificity and length, with no diagnostic label revealing the key, rhetorical absolute, explanatory distractor or convergence pattern. The noninvasive answer can be preferred only by interpreting the clinical findings.",
          "Nora Bennett is explicitly in clinic with outside endoscopy and hospital records. The task asks about the first hospital reassessment, preventing confusion between the current clinic visit and the earlier acute decision. CT, repeat endoscopy and possible laparoscopy belong to that hospital episode; no hospital rescue is enacted in the clinic. Age/sex and the short complaint are consistent.",
          "The node stands alone: it supplies the prior clipping, current trajectory, examination, CT and initiated treatment. No later discharge or recovery outcome is used to prove the earlier decision correct. The explanation appropriately states that these findings do not prove a durable seal and calls for reassessment with deterioration.",
          "No confident clinical inaccuracy was identified offline. Adequate delivery of rectal contrast to the relevant segment is implicit in the completed study description; the item does not test acquisition adequacy. The negative CT should retain its stated limitation and should not be taught as excluding all subsequent leakage."
        ],
        "suggestions": [
          "Preserve the explicit hospital checkpoint and the distinction between initially favorable assessment and durable closure. Do not remove the trajectory or examination to increase apparent difficulty.",
          "Verify that the repeat-colonoscopy choice displays its runtime testing wait after integration, with no fixed wait inserted into question prose. This visible-fields review does not certify timing metadata or rendering."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "sourceCaseExport": "I18_SCORABLE_PREVIEW_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-ercp-access-and-adverse-events.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"conceptId\":\"concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"stem\":\"At this checkpoint in {patientName}'s ERCP record, which intervention should the hospital team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital ERCP record: before scope withdrawal\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Cholangiography\",\"Papillary inspection\",\"Wire position\",\"Anesthesia record\"],\"cells\":[[\"Contrast injected through the biliary catheter outlines the distal duct above the papilla, then escapes through the upper cut edge into a small retroperitoneal pocket.\"],[\"A small separation is visible at the upper incised papillary margin. The remaining inspected duodenal wall is intact.\"],[\"The guidewire remains within the bile duct and an intrahepatic branch.\"],[\"Blood pressure and oxygenation remain stable without vasopressors or increased respiratory support.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.endoscopic.v1\",\"label\":\"Endoscopic transpapillary plastic-stent placement\",\"isCorrect\":true,\"rationale\":\"The observed cut-margin escape, stable physiology and retained intraductal wire support a plastic biliary stent for internal diversion with inpatient care.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.operation.v1\",\"label\":\"Operative duodenal exploration and repair\",\"isCorrect\":false,\"rationale\":\"Operation can be required for uncontrolled injury or deterioration. The current findings support an initial nonsurgical strategy, with the surgical team still involved.\",\"distractorRationale\":\"Operation can be required for uncontrolled injury or deterioration. The current findings support an initial nonsurgical strategy, with the surgical team still involved.\"},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.percutaneous.v1\",\"label\":\"Percutaneous transhepatic biliary drain placement\",\"isCorrect\":false,\"rationale\":\"A transhepatic biliary route can help when internal drainage cannot be established. The retained intraductal wire already supplies access across the papilla, so a new transhepatic route is not the preferred offered starting plan.\",\"distractorRationale\":\"A transhepatic biliary route can help when internal drainage cannot be established. The retained intraductal wire already supplies access across the papilla, so a new transhepatic route is not the preferred offered starting plan.\"}],\"explanation\":\"The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.ercp-access-and-adverse-events.periampullary-pattern\",\"claim.intraop.ercp-access-and-adverse-events.sphincterotomy-margin-origin\",\"claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care\",\"claim.intraop.ercp-access-and-adverse-events.selected-endoscopic-diversion\",\"claim.intraop.ercp-access-and-adverse-events.failed-source-control-surgery\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"questionVariantId\":\"question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"primaryConceptId\":\"concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"currentUpdate\":\"The hospital record documents biliary sphincterotomy followed by stone extraction. Before scope withdrawal, the team records the findings below. Hospital monitoring, fasting, intravenous fluids, antibiotics and surgical consultation are ongoing.\",\"stem\":\"At this checkpoint in {patientName}'s ERCP record, which intervention should the hospital team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital ERCP record: before scope withdrawal\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Cholangiography\",\"Papillary inspection\",\"Wire position\",\"Anesthesia record\"],\"cells\":[[\"Contrast injected through the biliary catheter outlines the distal duct above the papilla, then escapes through the upper cut edge into a small retroperitoneal pocket.\"],[\"A small separation is visible at the upper incised papillary margin. The remaining inspected duodenal wall is intact.\"],[\"The guidewire remains within the bile duct and an intrahepatic branch.\"],[\"Blood pressure and oxygenation remain stable without vasopressors or increased respiratory support.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.endoscopic.v1\",\"label\":\"Endoscopic transpapillary plastic-stent placement\",\"isCorrect\":true,\"rationale\":\"The observed cut-margin escape, stable physiology and retained intraductal wire support a plastic biliary stent for internal diversion with inpatient care.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.operation.v1\",\"label\":\"Operative duodenal exploration and repair\",\"isCorrect\":false,\"rationale\":\"Operation can be required for uncontrolled injury or deterioration. The current findings support an initial nonsurgical strategy, with the surgical team still involved.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.percutaneous.v1\",\"label\":\"Percutaneous transhepatic biliary drain placement\",\"isCorrect\":false,\"rationale\":\"A transhepatic biliary route can help when internal drainage cannot be established. The retained intraductal wire already supplies access across the papilla, so a new transhepatic route is not the preferred offered starting plan.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"],\"resultGateAfter\":null,\"terminalDispositions\":[]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1\",\"displayName\":\"ERCP record review\",\"patientDisplayName\":\"Michael Nolan\",\"patientPresentationVariantId\":\"presentation.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1\",\"prototypeDemographics\":{\"ageYears\":64,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"ERCP record review\",\"presentation\":\"{patientName}, a 64-year-old man, attends clinic after an outside hospital admission involving ERCP for a bile-duct stone. The founder reviews the procedure, anesthesia and subsequent source-control records one checkpoint at a time; later outcomes are not used to judge an earlier decision.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1\",\"prototypeDemographics\":{\"ageYears\":64,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"ERCP record review\",\"presentation\":\"{patientName}, a 64-year-old man, attends clinic after an outside hospital admission involving ERCP for a bile-duct stone. The founder reviews the procedure, anesthesia and subsequent source-control records one checkpoint at a time; later outcomes are not used to judge an earlier decision.\"}],\"releasePointId\":\"release.l0.clinic_evaluation\",\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"],\"decisionNodes\":[{\"id\":\"node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"questionVariantId\":\"question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"primaryConceptId\":\"concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"currentUpdate\":\"The hospital record documents biliary sphincterotomy followed by stone extraction. Before scope withdrawal, the team records the findings below. Hospital monitoring, fasting, intravenous fluids, antibiotics and surgical consultation are ongoing.\",\"stem\":\"At this checkpoint in {patientName}'s ERCP record, which intervention should the hospital team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital ERCP record: before scope withdrawal\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Cholangiography\",\"Papillary inspection\",\"Wire position\",\"Anesthesia record\"],\"cells\":[[\"Contrast injected through the biliary catheter outlines the distal duct above the papilla, then escapes through the upper cut edge into a small retroperitoneal pocket.\"],[\"A small separation is visible at the upper incised papillary margin. The remaining inspected duodenal wall is intact.\"],[\"The guidewire remains within the bile duct and an intrahepatic branch.\"],[\"Blood pressure and oxygenation remain stable without vasopressors or increased respiratory support.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.endoscopic.v1\",\"label\":\"Endoscopic transpapillary plastic-stent placement\",\"isCorrect\":true,\"rationale\":\"The observed cut-margin escape, stable physiology and retained intraductal wire support a plastic biliary stent for internal diversion with inpatient care.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.operation.v1\",\"label\":\"Operative duodenal exploration and repair\",\"isCorrect\":false,\"rationale\":\"Operation can be required for uncontrolled injury or deterioration. The current findings support an initial nonsurgical strategy, with the surgical team still involved.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.percutaneous.v1\",\"label\":\"Percutaneous transhepatic biliary drain placement\",\"isCorrect\":false,\"rationale\":\"A transhepatic biliary route can help when internal drainage cannot be established. The retained intraductal wire already supplies access across the papilla, so a new transhepatic route is not the preferred offered starting plan.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"questionVariantId\":\"question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"primaryConceptId\":\"concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"currentUpdate\":\"Earlier in this outside hospital admission, a sphincterotomy-margin leak during ERCP was managed with a transpapillary plastic stent; free bile flow was recorded then. The findings below come from a later hospital reassessment. Fasting, intravenous antibiotics and multidisciplinary care continue.\",\"stem\":\"At the later hospital checkpoint in {patientName}'s ERCP-injury record, which source-control procedure should the team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital reassessment after endoscopic diversion\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Clinical course\",\"Previously completed CT\",\"Surrounding anatomy\"],\"cells\":[[\"Fever and focal right-sided tenderness persist. He remains alert with stable blood pressure and no vasopressor support.\"],[\"Fluid and gas occupy a localized right retroperitoneal cavity. No enteric contrast escape is seen on this acquisition. The biliary stent has not moved.\"],[\"The cavity contacts the right lateral abdominal wall; bowel lies anterior to it.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.drain.v1\",\"label\":\"Image-guided catheter drainage of the cavity\",\"isCorrect\":true,\"rationale\":\"The demonstrated localized symptomatic collection needs source control despite prior biliary diversion. Its anatomy and the stable clinical course support image-guided catheter drainage while hospital care continues.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1\",\"label\":\"ERCP stent exchange for biliary drainage\",\"isCorrect\":false,\"rationale\":\"Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1\",\"label\":\"Operative exploration and drainage of the cavity\",\"isCorrect\":false,\"rationale\":\"A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"]},{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"]}]}],\"learningSummary\":\"The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint. Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.\"}",
    "sourceQuestionSha256": "7a0dd67015e857c576be0d28ce97065f315d333eb6e1787478672487a1df4b5a",
    "sourceNodeSha256": "1b567269458d0171c28ab050a581930cb41aa5c5f70e96c31da9955c520653bd",
    "sourceCaseSha256": "224d0441420e96a708da08fc6469706055d22e08005824b74e6fcf47e8b05a6f",
    "acceptedQuestionSha256": "7a0dd67015e857c576be0d28ce97065f315d333eb6e1787478672487a1df4b5a",
    "acceptedNodeSha256": "1b567269458d0171c28ab050a581930cb41aa5c5f70e96c31da9955c520653bd",
    "acceptedCaseSha256": "27588c92cd127131a253a748510235ca665d6549712c6388b67bd4f1dc5d56bd",
    "review": {
      "path": "docs/research/question-intraop-ercp-access-and-adverse-events-review2-20261112.json",
      "record": {
        "id": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
        "nodeId": "node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
        "title": "Initial diversion for a recognized ERCP injury",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The visible record supports one best offered intervention: endoscopic transpapillary plastic-stent placement. Contrast escape through the incised papillary margin and the corresponding visible separation establish a limited sphincterotomy-related injury; stable physiology and retained intraductal access support initial internal diversion. Operative repair and transhepatic drainage are real alternatives in different circumstances but are not equally preferred at this checkpoint. No confident clinical inaccuracy identified in the key or explanation.",
          "Two consequential steps remain: interpret the cut-margin and contrast observations to distinguish this injury pattern from a larger duodenal-wall injury, then combine physiology and established biliary access to choose the initial intervention. Treating any extraluminal contrast as an automatic indication for surgery, or choosing a new drainage route despite usable internal access, are credible resident errors. Moderate difficulty is justified; the broad procedural alternatives do not make this a hard technical ERCP item.",
          "The cue attack found no robust nonmedical shortcut. 'The guidewire remains within the bile duct and an intrahepatic branch' is necessary access information, not an explicit permission to select the key. 'The remaining inspected duodenal wall is intact' and stable anesthesia observations distinguish injury extent and urgency; they do not name the treatment. All three options name actual interventions with comparable length and specificity. None contains an explanatory warning, rhetorical absolute, uniquely comprehensive plan or component-convergence pattern.",
          "Sphincterotomy followed by extraction is explicit and procedurally coherent. The injected structure, escape site, visible papillary finding and anesthesia course are available before scope withdrawal. The constructed record table makes the decision-critical findings accessible without claiming to supply an actual fluoroscopic image. Shared antibiotics, fasting, fluids, monitoring and surgical consultation prevent the key from winning merely by including routine supportive care.",
          "Michael Nolan is a named 64-year-old man attending clinic to review an outside hospital record. The short complaint, demographic context and complete historical task are appropriate. This does not require an ambulatory center to provide ERCP rescue or inpatient management. Pediatric age and parent rules are inapplicable. The subsequent node explicitly records plastic-stent placement before reassessment, so its chronology agrees with this intervention; this explanation does not disclose the later collection-drainage answer.",
          "Recognition and initial management of ERCP perforation are useful, high-yield surgical complication concepts. This PASS ranks the offered interventions; it does not establish plastic-stent superiority over every unoffered endoscopic technique. This is an offline editorial review of the candidate presentation, update, exhibit, task, choices and explanation. No external source verification or clinical approval was performed; the exact draft remains needs_clinician_review."
        ],
        "suggestions": [
          "No required wording repair. Retain the cut-margin observation, anesthesia findings, established wire position and shared hospital care; removing those facts would weaken the single-best-answer boundary.",
          "Scope: the two revised executable nodes are reviewed here. The unchanged frozen pancreatic-protection-after-access node is noted without a new verdict, as are the held failed-nonsurgical-control node, 32 historical Keep records and six held/superseded planning records. Withheld objectives receive no verdict or approval."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "sourceCaseExport": "I18_SCORABLE_PREVIEW_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-ercp-access-and-adverse-events.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"conceptId\":\"concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"stem\":\"At the later hospital checkpoint in {patientName}'s ERCP-injury record, which source-control procedure should the team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital reassessment after endoscopic diversion\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Clinical course\",\"Previously completed CT\",\"Surrounding anatomy\"],\"cells\":[[\"Fever and focal right-sided tenderness persist. He remains alert with stable blood pressure and no vasopressor support.\"],[\"Fluid and gas occupy a localized right retroperitoneal cavity. No enteric contrast escape is seen on this acquisition. The biliary stent has not moved.\"],[\"The cavity contacts the right lateral abdominal wall; bowel lies anterior to it.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.drain.v1\",\"label\":\"Image-guided catheter drainage of the cavity\",\"isCorrect\":true,\"rationale\":\"The demonstrated localized symptomatic collection needs source control despite prior biliary diversion. Its anatomy and the stable clinical course support image-guided catheter drainage while hospital care continues.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1\",\"label\":\"ERCP stent exchange for biliary drainage\",\"isCorrect\":false,\"rationale\":\"Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.\",\"distractorRationale\":\"Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.\"},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1\",\"label\":\"Operative exploration and drainage of the cavity\",\"isCorrect\":false,\"rationale\":\"A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.\",\"distractorRationale\":\"A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.\"}],\"explanation\":\"Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care\",\"claim.intraop.ercp-access-and-adverse-events.collection-after-diversion\",\"claim.intraop.ercp-access-and-adverse-events.collection-percutaneous\",\"claim.intraop.ercp-access-and-adverse-events.ct-injury-assessment\",\"claim.intraop.ercp-access-and-adverse-events.failed-source-control-surgery\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"questionVariantId\":\"question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"primaryConceptId\":\"concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"currentUpdate\":\"Earlier in this outside hospital admission, a sphincterotomy-margin leak during ERCP was managed with a transpapillary plastic stent; free bile flow was recorded then. The findings below come from a later hospital reassessment. Fasting, intravenous antibiotics and multidisciplinary care continue.\",\"stem\":\"At the later hospital checkpoint in {patientName}'s ERCP-injury record, which source-control procedure should the team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital reassessment after endoscopic diversion\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Clinical course\",\"Previously completed CT\",\"Surrounding anatomy\"],\"cells\":[[\"Fever and focal right-sided tenderness persist. He remains alert with stable blood pressure and no vasopressor support.\"],[\"Fluid and gas occupy a localized right retroperitoneal cavity. No enteric contrast escape is seen on this acquisition. The biliary stent has not moved.\"],[\"The cavity contacts the right lateral abdominal wall; bowel lies anterior to it.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.drain.v1\",\"label\":\"Image-guided catheter drainage of the cavity\",\"isCorrect\":true,\"rationale\":\"The demonstrated localized symptomatic collection needs source control despite prior biliary diversion. Its anatomy and the stable clinical course support image-guided catheter drainage while hospital care continues.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1\",\"label\":\"ERCP stent exchange for biliary drainage\",\"isCorrect\":false,\"rationale\":\"Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1\",\"label\":\"Operative exploration and drainage of the cavity\",\"isCorrect\":false,\"rationale\":\"A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"]},{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1\",\"displayName\":\"ERCP record review\",\"patientDisplayName\":\"Michael Nolan\",\"patientPresentationVariantId\":\"presentation.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1\",\"prototypeDemographics\":{\"ageYears\":64,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"ERCP record review\",\"presentation\":\"{patientName}, a 64-year-old man, attends clinic after an outside hospital admission involving ERCP for a bile-duct stone. The founder reviews the procedure, anesthesia and subsequent source-control records one checkpoint at a time; later outcomes are not used to judge an earlier decision.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1\",\"prototypeDemographics\":{\"ageYears\":64,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"ERCP record review\",\"presentation\":\"{patientName}, a 64-year-old man, attends clinic after an outside hospital admission involving ERCP for a bile-duct stone. The founder reviews the procedure, anesthesia and subsequent source-control records one checkpoint at a time; later outcomes are not used to judge an earlier decision.\"}],\"releasePointId\":\"release.l0.clinic_evaluation\",\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"],\"decisionNodes\":[{\"id\":\"node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"questionVariantId\":\"question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"primaryConceptId\":\"concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1\",\"currentUpdate\":\"The hospital record documents biliary sphincterotomy followed by stone extraction. Before scope withdrawal, the team records the findings below. Hospital monitoring, fasting, intravenous fluids, antibiotics and surgical consultation are ongoing.\",\"stem\":\"At this checkpoint in {patientName}'s ERCP record, which intervention should the hospital team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital ERCP record: before scope withdrawal\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Cholangiography\",\"Papillary inspection\",\"Wire position\",\"Anesthesia record\"],\"cells\":[[\"Contrast injected through the biliary catheter outlines the distal duct above the papilla, then escapes through the upper cut edge into a small retroperitoneal pocket.\"],[\"A small separation is visible at the upper incised papillary margin. The remaining inspected duodenal wall is intact.\"],[\"The guidewire remains within the bile duct and an intrahepatic branch.\"],[\"Blood pressure and oxygenation remain stable without vasopressors or increased respiratory support.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.endoscopic.v1\",\"label\":\"Endoscopic transpapillary plastic-stent placement\",\"isCorrect\":true,\"rationale\":\"The observed cut-margin escape, stable physiology and retained intraductal wire support a plastic biliary stent for internal diversion with inpatient care.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.operation.v1\",\"label\":\"Operative duodenal exploration and repair\",\"isCorrect\":false,\"rationale\":\"Operation can be required for uncontrolled injury or deterioration. The current findings support an initial nonsurgical strategy, with the surgical team still involved.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.periampullary-diversion.percutaneous.v1\",\"label\":\"Percutaneous transhepatic biliary drain placement\",\"isCorrect\":false,\"rationale\":\"A transhepatic biliary route can help when internal drainage cannot be established. The retained intraductal wire already supplies access across the papilla, so a new transhepatic route is not the preferred offered starting plan.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"questionVariantId\":\"question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"primaryConceptId\":\"concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1\",\"currentUpdate\":\"Earlier in this outside hospital admission, a sphincterotomy-margin leak during ERCP was managed with a transpapillary plastic stent; free bile flow was recorded then. The findings below come from a later hospital reassessment. Fasting, intravenous antibiotics and multidisciplinary care continue.\",\"stem\":\"At the later hospital checkpoint in {patientName}'s ERCP-injury record, which source-control procedure should the team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital reassessment after endoscopic diversion\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Clinical course\",\"Previously completed CT\",\"Surrounding anatomy\"],\"cells\":[[\"Fever and focal right-sided tenderness persist. He remains alert with stable blood pressure and no vasopressor support.\"],[\"Fluid and gas occupy a localized right retroperitoneal cavity. No enteric contrast escape is seen on this acquisition. The biliary stent has not moved.\"],[\"The cavity contacts the right lateral abdominal wall; bowel lies anterior to it.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.drain.v1\",\"label\":\"Image-guided catheter drainage of the cavity\",\"isCorrect\":true,\"rationale\":\"The demonstrated localized symptomatic collection needs source control despite prior biliary diversion. Its anatomy and the stable clinical course support image-guided catheter drainage while hospital care continues.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1\",\"label\":\"ERCP stent exchange for biliary drainage\",\"isCorrect\":false,\"rationale\":\"Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1\",\"label\":\"Operative exploration and drainage of the cavity\",\"isCorrect\":false,\"rationale\":\"A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.exchange.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"Stent position does not establish current flow, and reassessing duct drainage may still be necessary. Exchanging a biliary stent does not evacuate the demonstrated extraluminal cavity, which is the source-control target asked about here.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"]},{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.collection-after-diversion.explore.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"A localized collection with a catheter route and stable physiology supports percutaneous source control at this checkpoint. Persistent fever does not establish that all nonsurgical routes have failed.\",\"sourceLabels\":[\"DGVS 2025 acute endoscopic perforation management\",\"Heo et al. 2024 type II ERCP perforation drainage cohort\"]}]}],\"learningSummary\":\"The record locates the escape at the incised papillary margin. Its small extent, stable anesthesia course and maintained biliary wire access support transpapillary plastic-stent placement for diversion, with hospital monitoring and reassessment. This is an initial source-control decision at the recorded checkpoint. Prior biliary diversion does not drain a separate retroperitoneal collection. The localized fluid target, surrounding anatomy and stable course support catheter drainage. Historical bile flow and current stent position do not establish present patency; the lack of observed contrast escape on this acquisition does not exclude continued leakage. Duct reassessment may still be needed, but stent exchange would not evacuate this cavity.\"}",
    "sourceQuestionSha256": "54ffa4ab2d87ec50f22494d5872af0218e77a5553593bf940dd87948356cfeaa",
    "sourceNodeSha256": "6566450ab9fb420b27b1ceff66e97fdaa68c7fa6d4f712b4f0b2fe2f2b6ef6db",
    "sourceCaseSha256": "224d0441420e96a708da08fc6469706055d22e08005824b74e6fcf47e8b05a6f",
    "acceptedQuestionSha256": "54ffa4ab2d87ec50f22494d5872af0218e77a5553593bf940dd87948356cfeaa",
    "acceptedNodeSha256": "6566450ab9fb420b27b1ceff66e97fdaa68c7fa6d4f712b4f0b2fe2f2b6ef6db",
    "acceptedCaseSha256": "27588c92cd127131a253a748510235ca665d6549712c6388b67bd4f1dc5d56bd",
    "review": {
      "path": "docs/research/question-intraop-ercp-access-and-adverse-events-review2-20261112.json",
      "record": {
        "id": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
        "nodeId": "node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
        "title": "Collection drainage after ERCP diversion",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Image-guided catheter drainage is the single best offered source-control procedure for the demonstrated localized retroperitoneal fluid-and-gas cavity with persistent fever and focal tenderness, stable physiology and a favorable lateral anatomical relationship. Repeat biliary stenting does not evacuate the extraluminal cavity. Operative drainage is a possible escalation, but the supplied localized anatomy and clinical course support trying the less invasive drainage route at this checkpoint. No confident clinical inaccuracy identified in this ranking.",
          "The explanation correctly limits what the record establishes: earlier free bile flow and an unmoved stent do not prove current patency, and absent contrast escape on one acquisition does not exclude continued leakage. The key therefore does not require the resident to assume that the biliary problem is permanently resolved. Drainage and further duct assessment can coexist; the task asks which source-control procedure is best for the current demonstrated problem.",
          "Two consequential steps remain: distinguish the symptomatic extraluminal source from the previously treated ductal problem, then use the localized anatomy and stable physiology to choose catheter drainage over operative exploration. Stent exchange represents fixation on the original procedural target; operation represents prematurely treating fever after diversion as failure of all nonsurgical source control. This is moderate rather than hard. The generally tested principle is source control of a postoperative or postprocedural collection, applied to ERCP injury.",
          "The cue attack found no reliable wording-only route. 'The cavity contacts the right lateral abdominal wall; bowel lies anterior to it' supplies anatomical observations rather than the conclusion that a catheter route is safe. 'Image-guided catheter drainage of the cavity' and 'Operative exploration and drainage of the cavity' share the cavity wording, so lexical matching does not distinguish them. 'Source-control procedure' describes all three offered strategies at a broad level and does not uniquely name catheter drainage. Labels are specific and parallel, without teaching clauses, absolutes or a uniquely cautious key.",
          "The sequence follows real care order: initial injury, documented stent diversion, then later symptomatic collection assessment using an already completed CT. The update restates the prior injury and intervention, so this node can be understood with its own update and the patient presentation without remembering the previous selected answer. Earlier feedback teaches initial biliary diversion but does not prescribe drainage of a future collection. Removing the new CT and anatomical findings removes the basis for selecting catheter drainage; they are consequential rather than decorative.",
          "The record makes the extraluminal target and relevant surrounding anatomy visible in text. A real access plan still requires image review; the question appropriately selects a procedure class rather than an exact puncture trajectory. Michael Nolan's adult clinic chart-review frame remains consistent, with the acute care occurring in the outside hospital. No ambulatory-center rescue capability or pediatric parent context is implied. The complete task identifies the patient, historical stage and requested decision.",
          "This is an offline editorial PASS, not a new verification of guideline currency, exact evidence mappings or clinical approval. No unsupported numeric size, timing or physiological threshold was introduced or inferred. The candidate remains needs_clinician_review."
        ],
        "suggestions": [
          "No required wording repair. Preserve the distinction between historical bile flow, current stent position and uncertain present patency, together with the new cavity anatomy and stable clinical course.",
          "Keep the held failed-nonsurgical-control checkpoint outside these verdict totals; this PASS neither accepts its educational purpose nor judges its retained wording."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "sourceCaseExport": "I18_SCORABLE_PREVIEW_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-ercp-access-and-adverse-events.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1\",\"conceptId\":\"concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1\",\"stem\":\"At the recorded completion of {patientName}'s ERCP, which plan should the endoscopy team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital ERCP record: completion checkpoint\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Medication record\",\"Access record\",\"Completion record\"],\"cells\":[[\"Rectal indomethacin was given before ERCP.\"],[\"The guidewire repeatedly entered the main pancreatic duct deeply during biliary access. A double-wire technique then achieved bile-duct cannulation.\"],[\"The duct stone has been removed. The pancreatic wire remains in position; the pancreatic duct has no therapeutic target.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.stent.v1\",\"label\":\"Add pancreatic stenting to current prophylaxis\",\"isCorrect\":true,\"rationale\":\"Repeated deep pancreatic instrumentation creates a prophylactic indication after successful biliary therapy. Current guidance supports adding temporary pancreatic protection to rectal prophylaxis.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.finish.v1\",\"label\":\"Conclude ERCP with existing pancreatic prophylaxis\",\"isCorrect\":false,\"rationale\":\"Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.\",\"distractorRationale\":\"Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.\"},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.fluid.v1\",\"label\":\"Intensify pancreatic prophylaxis with lactated Ringer's\",\"isCorrect\":false,\"rationale\":\"Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.\",\"distractorRationale\":\"Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.\"}],\"explanation\":\"The access record changes the prophylaxis decision. Repeated deep pancreatic entry supports temporary pancreatic duct stenting despite the rectal medicine already given. Successful bile-duct therapy is not pancreatic protection. Device selection and subsequent stent follow-up require the specialist's plan; no size or removal interval is specified.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.ercp-access-and-adverse-events.pancreatic-access-risk\",\"claim.intraop.ercp-access-and-adverse-events.pancreatic-stent-prophylaxis\",\"claim.intraop.ercp-access-and-adverse-events.hydration-not-substitute\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1\",\"questionVariantId\":\"question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1\",\"primaryConceptId\":\"concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1\",\"currentUpdate\":\"The hospital record reaches the completion checkpoint shown below.\",\"stem\":\"At the recorded completion of {patientName}'s ERCP, which plan should the endoscopy team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital ERCP record: completion checkpoint\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Medication record\",\"Access record\",\"Completion record\"],\"cells\":[[\"Rectal indomethacin was given before ERCP.\"],[\"The guidewire repeatedly entered the main pancreatic duct deeply during biliary access. A double-wire technique then achieved bile-duct cannulation.\"],[\"The duct stone has been removed. The pancreatic wire remains in position; the pancreatic duct has no therapeutic target.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.stent.v1\",\"label\":\"Add pancreatic stenting to current prophylaxis\",\"isCorrect\":true,\"rationale\":\"Repeated deep pancreatic instrumentation creates a prophylactic indication after successful biliary therapy. Current guidance supports adding temporary pancreatic protection to rectal prophylaxis.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.finish.v1\",\"label\":\"Conclude ERCP with existing pancreatic prophylaxis\",\"isCorrect\":false,\"rationale\":\"Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.fluid.v1\",\"label\":\"Intensify pancreatic prophylaxis with lactated Ringer's\",\"isCorrect\":false,\"rationale\":\"Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The access record changes the prophylaxis decision. Repeated deep pancreatic entry supports temporary pancreatic duct stenting despite the rectal medicine already given. Successful bile-duct therapy is not pancreatic protection. Device selection and subsequent stent follow-up require the specialist's plan; no size or removal interval is specified.\",\"sourceLabels\":[\"DGVS 2025 ERCP complication prophylaxis\",\"Yin et al. 2016 prophylactic pancreatic stent randomized study\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.finish.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.\",\"sourceLabels\":[\"DGVS 2025 ERCP complication prophylaxis\",\"Yin et al. 2016 prophylactic pancreatic stent randomized study\"]},{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.fluid.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.\",\"sourceLabels\":[\"DGVS 2025 ERCP complication prophylaxis\",\"Yin et al. 2016 prophylactic pancreatic stent randomized study\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1\",\"displayName\":\"ERCP record review\",\"patientDisplayName\":\"Clara Morgan\",\"patientPresentationVariantId\":\"presentation.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1\",\"prototypeDemographics\":{\"ageYears\":58,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"ERCP record review\",\"presentation\":\"{patientName}, a 58-year-old woman, attends clinic to review her outside hospital ERCP and anesthesia record after treatment of a bile-duct stone. The question concerns the recorded end-of-procedure decision, before subsequent outcomes are considered.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1\",\"prototypeDemographics\":{\"ageYears\":58,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"ERCP record review\",\"presentation\":\"{patientName}, a 58-year-old woman, attends clinic to review her outside hospital ERCP and anesthesia record after treatment of a bile-duct stone. The question concerns the recorded end-of-procedure decision, before subsequent outcomes are considered.\"}],\"releasePointId\":\"release.l0.clinic_evaluation\",\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"DGVS 2025 ERCP complication prophylaxis\",\"Yin et al. 2016 prophylactic pancreatic stent randomized study\"],\"decisionNodes\":[{\"id\":\"node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1\",\"questionVariantId\":\"question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1\",\"primaryConceptId\":\"concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1\",\"currentUpdate\":\"The hospital record reaches the completion checkpoint shown below.\",\"stem\":\"At the recorded completion of {patientName}'s ERCP, which plan should the endoscopy team have selected?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed hospital ERCP record: completion checkpoint\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Medication record\",\"Access record\",\"Completion record\"],\"cells\":[[\"Rectal indomethacin was given before ERCP.\"],[\"The guidewire repeatedly entered the main pancreatic duct deeply during biliary access. A double-wire technique then achieved bile-duct cannulation.\"],[\"The duct stone has been removed. The pancreatic wire remains in position; the pancreatic duct has no therapeutic target.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.stent.v1\",\"label\":\"Add pancreatic stenting to current prophylaxis\",\"isCorrect\":true,\"rationale\":\"Repeated deep pancreatic instrumentation creates a prophylactic indication after successful biliary therapy. Current guidance supports adding temporary pancreatic protection to rectal prophylaxis.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.finish.v1\",\"label\":\"Conclude ERCP with existing pancreatic prophylaxis\",\"isCorrect\":false,\"rationale\":\"Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.fluid.v1\",\"label\":\"Intensify pancreatic prophylaxis with lactated Ringer's\",\"isCorrect\":false,\"rationale\":\"Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The access record changes the prophylaxis decision. Repeated deep pancreatic entry supports temporary pancreatic duct stenting despite the rectal medicine already given. Successful bile-duct therapy is not pancreatic protection. Device selection and subsequent stent follow-up require the specialist's plan; no size or removal interval is specified.\",\"sourceLabels\":[\"DGVS 2025 ERCP complication prophylaxis\",\"Yin et al. 2016 prophylactic pancreatic stent randomized study\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.finish.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"Successful duct clearance does not undo the pancreatic instrumentation. Rectal prophylaxis does not settle the additional stent decision in this high-risk access pattern.\",\"sourceLabels\":[\"DGVS 2025 ERCP complication prophylaxis\",\"Yin et al. 2016 prophylactic pancreatic stent randomized study\"]},{\"answerChoiceId\":\"choice.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.fluid.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this historical decision and its rationale. The answer executes no procedure and determines no patient outcome.\",\"clinicalRationale\":\"Hydration can be part of prophylaxis, but increasing fluid does not address the indicated pancreatic stent decision after this access history. No fluid regimen is selected here.\",\"sourceLabels\":[\"DGVS 2025 ERCP complication prophylaxis\",\"Yin et al. 2016 prophylactic pancreatic stent randomized study\"]}]}],\"learningSummary\":\"The access record changes the prophylaxis decision. Repeated deep pancreatic entry supports temporary pancreatic duct stenting despite the rectal medicine already given. Successful bile-duct therapy is not pancreatic protection. Device selection and subsequent stent follow-up require the specialist's plan; no size or removal interval is specified.\"}",
    "sourceQuestionSha256": "500b6835bef69d667ba321f458e49c452926e2c67213c533a4398581e59c0f59",
    "sourceNodeSha256": "fe4f5c52b1c321c9e2e371c7d4c3870bb9c71db602b9ae6b06ece535e19539f9",
    "sourceCaseSha256": "70bf32eee8a6d2133bfd404324207cc999e5756db6a95dea293ef1019930367c",
    "acceptedQuestionSha256": "500b6835bef69d667ba321f458e49c452926e2c67213c533a4398581e59c0f59",
    "acceptedNodeSha256": "fe4f5c52b1c321c9e2e371c7d4c3870bb9c71db602b9ae6b06ece535e19539f9",
    "acceptedCaseSha256": "6409ab76d5ce1fc1e4ba6dda1e7cd97bcd3ccca94beaa9de458838bf25dd3aac",
    "review": {
      "path": "docs/research/question-intraop-ercp-access-and-adverse-events-review-20261112.json",
      "record": {
        "id": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
        "nodeId": "node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
        "title": "Pancreatic protection after difficult access",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Temporary pancreatic duct stenting is the single best offered completion plan for repeated deep pancreatic access and double-wire biliary cannulation despite prior rectal indomethacin. The retained pancreatic wire makes the proposed intervention plausible at this checkpoint. No confident clinical inaccuracy identified in the stated key.",
          "Two consequential steps remain: interpret the access history as pancreatic injury risk, then recognize that an NSAID already given does not settle the additional mechanical-prophylaxis decision. The credible competing error is to finish after successful stone clearance; hydration is an adjunct rather than a substitute for the indicated stent.",
          "The three labels are comparable in length and all address prophylaxis. No robust wording-only route to the key was found. The pancreatic-wire observation is legitimate procedural information, not a reason to delete required access context.",
          "The named 58-year-old adult clinic record review is plausible and clearly separates the historical completion decision from present care. The short complaint and complete task satisfy presentation requirements; pediatric/parent rules do not apply. This is a standalone node.",
          "High-yield ERCP pancreatitis prevention; predicted moderate difficulty, not hard. This is an offline editorial judgment of the supplied candidate wording, not independent source verification or clinical approval. All candidates remain needs_clinician_review."
        ],
        "suggestions": [
          "Optional precision: name a temporary pancreatic duct stent in the answer label, matching the explanation. Keep hydration as shared background care if the option set is subsequently revised; do not imply that all IV fluid use competes with stenting.",
          "Scope note for this report: all four offered nodes in the two candidate cases are reviewed. The packet lists 32 kept records and six held planning records; those are noted only and are not independently passed by this review. No scoring verdict is assigned to withheld objectives."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "caseId": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "sourceCaseExport": "GROIN_INTRAOP_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1\",\"conceptId\":\"concept.intraop.groin-hernia.sliding-content-dissection.v1\",\"stem\":\"Which next maneuver should be used for Mateo's sigmoid-containing sac at this left TAPP repair checkpoint?\",\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.preperitoneal.20261112.v1\",\"label\":\"Mobilize the parietal attachments and reduce sac with sigmoid\",\"isCorrect\":true,\"rationale\":\"The observed restraint lies in the lateral attachments, while the bowel-bearing boundary must remain together. Extending the preperitoneal mobilization addresses that restraint rather than dividing the visceral interface or enlarging an unconstricting neck.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.adhesiolysis.20261112.v1\",\"label\":\"Peel the sigmoid from the posterior peritoneal boundary and reduce it separately\",\"isCorrect\":false,\"rationale\":\"The posterior boundary includes the visceral wall and mesocolon; peeling here treats incorporated tissue as an ordinary removable adhesion.\",\"distractorRationale\":\"The posterior boundary includes the visceral wall and mesocolon; peeling here treats incorporated tissue as an ordinary removable adhesion.\"},{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.circumferential.20261112.v1\",\"label\":\"Incise the deep ring margin and reduce the bowel-bearing sac together\",\"isCorrect\":false,\"rationale\":\"Ring release addresses a constricting aperture in selected difficult reductions. Here traction tensions the lateral attachments while the neck remains slack, so enlarging the aperture does not address the observed restraint.\",\"distractorRationale\":\"Ring release addresses a constricting aperture in selected difficult reductions. Here traction tensions the lateral attachments while the neck remains slack, so enlarging the aperture does not address the observed restraint.\"}],\"explanation\":\"In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.groin-hernia.sliding-wall\",\"claim.intraop.groin-hernia.sliding-plane\",\"claim.intraop.groin-hernia.ring-release-boundary\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1\",\"questionVariantId\":\"question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1\",\"primaryConceptId\":\"concept.intraop.groin-hernia.sliding-content-dissection.v1\",\"currentUpdate\":\"The left TAPP peritoneal flap is open, exposing the deep ring and lateral preperitoneal tissue. Pink sigmoid forms part of the sac's posterior boundary: its wall and mesocolon move with the peritoneal reflection. With gentle medial traction, tissue along the lateral wall stretches taut while the neck remains broad and slack.\",\"stem\":\"Which next maneuver should be used for Mateo's sigmoid-containing sac at this left TAPP repair checkpoint?\",\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.preperitoneal.20261112.v1\",\"label\":\"Mobilize the parietal attachments and reduce sac with sigmoid\",\"isCorrect\":true,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.adhesiolysis.20261112.v1\",\"label\":\"Peel the sigmoid from the posterior peritoneal boundary and reduce it separately\",\"isCorrect\":false,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.circumferential.20261112.v1\",\"label\":\"Incise the deep ring margin and reduce the bowel-bearing sac together\",\"isCorrect\":false,\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Cureus (2024); 10.7759/cureus.54975\"],\"resultGateAfter\":null,\"terminalDispositions\":[]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.groin-hernia.sliding-sac.20261112.v1\",\"displayName\":\"Mateo Alvarez: groin operation checkpoint\",\"patientPresentationVariantId\":\"presentation.intraop.groin-hernia.sliding-sac.20261112.v1\",\"patientDisplayName\":\"Mateo Alvarez\",\"releasePointId\":\"release.l3.ambulatory\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"Mateo Alvarez, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.groin-hernia.sliding-sac.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"Mateo Alvarez, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Cureus (2024); 10.7759/cureus.54975\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"],\"decisionNodes\":[{\"id\":\"node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1\",\"questionVariantId\":\"question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1\",\"primaryConceptId\":\"concept.intraop.groin-hernia.sliding-content-dissection.v1\",\"currentUpdate\":\"The left TAPP peritoneal flap is open, exposing the deep ring and lateral preperitoneal tissue. Pink sigmoid forms part of the sac's posterior boundary: its wall and mesocolon move with the peritoneal reflection. With gentle medial traction, tissue along the lateral wall stretches taut while the neck remains broad and slack.\",\"stem\":\"Which next maneuver should be used for Mateo's sigmoid-containing sac at this left TAPP repair checkpoint?\",\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.preperitoneal.20261112.v1\",\"label\":\"Mobilize the parietal attachments and reduce sac with sigmoid\",\"isCorrect\":true,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.adhesiolysis.20261112.v1\",\"label\":\"Peel the sigmoid from the posterior peritoneal boundary and reduce it separately\",\"isCorrect\":false,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.circumferential.20261112.v1\",\"label\":\"Incise the deep ring margin and reduce the bowel-bearing sac together\",\"isCorrect\":false,\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Cureus (2024); 10.7759/cureus.54975\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.groin-hernia.adherent-distal-sac.20261112.v1\",\"questionVariantId\":\"question.intraop.groin-hernia.adherent-distal-sac.20261112.v1\",\"primaryConceptId\":\"concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1\",\"currentUpdate\":\"The sigmoid and bowel-bearing proximal sac are now inside the abdomen. An empty peritoneal cuff just distal to the deep ring is clear of bowel, vas and vessels. The residual sac extends into the upper scrotum. Under magnification, traction-countertraction and blunt spreading expose a fibrotic patch in which vas and spermatic veins lie within the sac wall; its surfaces do not separate when traction is reversed.\",\"stem\":\"How should Mateo's residual sac be handled at this left TAPP repair checkpoint after proximal reduction?\",\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.divide.20261112.v1\",\"label\":\"Divide at the free cuff and leave the adherent distal sac\",\"isCorrect\":true,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1\",\"label\":\"Retract the cuff and sharply release the distal sac from cord\",\"isCorrect\":false,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1\",\"label\":\"Add an inguinal incision and release the distal sac under direct vision\",\"isCorrect\":false,\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"The deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Retract the cuff and sharply release the distal sac from cord.\",\"clinicalRationale\":\"This is now a proposal to cut through the observed fibrotic cord-sac interface, not simply continue an untried gentle separation. The new finding is shared wall with vas and veins rather than ordinary transmitted traction.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"]},{\"answerChoiceId\":\"choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Add an inguinal incision and release the distal sac under direct vision.\",\"clinicalRationale\":\"Anterior exposure can help when anatomy or an injury needs clarification. Here the cuff and cord anatomy are already defined; changing access does not itself separate the shared distal wall or require its release.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"]}]}],\"learningSummary\":\"In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.\\nThe deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.\"}",
    "sourceQuestionSha256": "b48df4f4b16c8d0056523a6f99ce6490bbe29088f34e9ca9e3dc65c8cd0ac02d",
    "sourceNodeSha256": "e73686660a62dcb47f2b57e5b6de26e3e95bd4cf483be26841a4d68bf59e89a9",
    "sourceCaseSha256": "e634208fa16a3ca7bb52aa4ce639672593f98703035798d2bff935148a6a8c30",
    "acceptedQuestionSha256": "b0fe20eee896d43e61862b834244ff6abb97a782cc860997386d2e308f1d584d",
    "acceptedNodeSha256": "bbdb23c3385eb6b822b934dfc084e616de6ab680b43ab3604c9c605b89ad566e",
    "acceptedCaseSha256": "6070a1dc663ec1b4070daf2d1683bf00c95d2b74d726226925d1ee8d5aa8293a",
    "review": {
      "path": "docs/research/question-intraop-groin-hernia-anatomy-and-injury-review2-20261112.json",
      "record": {
        "id": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
        "nodeId": "node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
        "title": "Sliding sigmoid sac: choosing the mobilization maneuver",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Reviewed the current after/candidate v1.r1 text, not the historical round-0 wording or author gate. Scope for this report is all five offered nodes in four cases. The 23 kept records, historical holds and one parked cystotomy candidate are noted but not scored; the two offered nodes with proposed educational-role holds are still reviewed below.",
          "One defensible best maneuver among the offered choices: mobilize the parietal attachments and reduce the bowel-bearing unit. The learner must interpret the traction response as attachment restraint rather than neck constriction, then choose mobilization that preserves the incorporated visceral boundary. Peeling the sigmoid and enlarging the ring address different, unsupported mechanisms.",
          "The bowel-wall relationship is explicitly supplied, which lowers difficulty, but does not supply the remaining mechanical distinction. 'The neck remains broad and slack' is necessary evidence against ring release, not an arbitrary negative. The key is neither uniquely long nor uniquely qualified; both the key and ring-release alternative preserve the bowel-bearing unit, so that component does not uniquely reveal the answer.",
          "The open TAPP flap, visible deep ring, pink bowel and traction response provide a plausible operative checkpoint for an elective reducible upper-scrotal hernia in an appropriately equipped ASC. The text supplies the relevant observations without promising a missing image. No hospital-level rescue or bowel resection is silently assumed.",
          "The subsequent distal-sac decision occurs after proximal reduction, in the correct operative order. This explanation teaches the visceral boundary and restraint mechanism, but does not state the later free-cuff division answer.",
          "Sliding hernia anatomy and avoidance of visceral injury are high-yield general-surgery concepts. Difficulty is a qualitative prediction. This offline editorial PASS is not clinical sign-off or fresh source verification; the draft remains needs_clinician_review. The same limitation applies to every entry in this report."
        ],
        "suggestions": [
          "Optional precision: identify 'the lateral wall' as the lateral abdominal wall and describe the parietal attachments consistently, so the learner need not infer which wall is meant. Preserve the observed traction/slack-neck distinction."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "caseId": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "sourceCaseExport": "GROIN_INTRAOP_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.groin-hernia.adherent-distal-sac.20261112.v1\",\"conceptId\":\"concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1\",\"stem\":\"How should Mateo's residual sac be handled at this left TAPP repair checkpoint after proximal reduction?\",\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.divide.20261112.v1\",\"label\":\"Divide at the free cuff and leave the adherent distal sac\",\"isCorrect\":true,\"rationale\":\"The empty cuff provides an identified division site before the fibrotic shared wall. Leaving the adherent portion avoids making complete release the completion requirement, while accepting a possible seroma.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1\",\"label\":\"Retract the cuff and sharply release the distal sac from cord\",\"isCorrect\":false,\"rationale\":\"This is now a proposal to cut through the observed fibrotic cord-sac interface, not simply continue an untried gentle separation. The new finding is shared wall with vas and veins rather than ordinary transmitted traction.\",\"distractorRationale\":\"This is now a proposal to cut through the observed fibrotic cord-sac interface, not simply continue an untried gentle separation. The new finding is shared wall with vas and veins rather than ordinary transmitted traction.\"},{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1\",\"label\":\"Add an inguinal incision and release the distal sac under direct vision\",\"isCorrect\":false,\"rationale\":\"Anterior exposure can help when anatomy or an injury needs clarification. Here the cuff and cord anatomy are already defined; changing access does not itself separate the shared distal wall or require its release.\",\"distractorRationale\":\"Anterior exposure can help when anatomy or an injury needs clarification. Here the cuff and cord anatomy are already defined; changing access does not itself separate the shared distal wall or require its release.\"}],\"explanation\":\"The deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.groin-hernia.cord-sac\",\"claim.intraop.groin-hernia.distal-seroma\",\"claim.intraop.groin-hernia.dense-sac-plane\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.groin-hernia.adherent-distal-sac.20261112.v1\",\"questionVariantId\":\"question.intraop.groin-hernia.adherent-distal-sac.20261112.v1\",\"primaryConceptId\":\"concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1\",\"currentUpdate\":\"The sigmoid and bowel-bearing proximal sac are now inside the abdomen. An empty peritoneal cuff just distal to the deep ring is clear of bowel, vas and vessels. The residual sac extends into the upper scrotum. Under magnification, traction-countertraction and blunt spreading expose a fibrotic patch in which vas and spermatic veins lie within the sac wall; its surfaces do not separate when traction is reversed.\",\"stem\":\"How should Mateo's residual sac be handled at this left TAPP repair checkpoint after proximal reduction?\",\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.divide.20261112.v1\",\"label\":\"Divide at the free cuff and leave the adherent distal sac\",\"isCorrect\":true,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1\",\"label\":\"Retract the cuff and sharply release the distal sac from cord\",\"isCorrect\":false,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1\",\"label\":\"Add an inguinal incision and release the distal sac under direct vision\",\"isCorrect\":false,\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"The deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Retract the cuff and sharply release the distal sac from cord.\",\"clinicalRationale\":\"This is now a proposal to cut through the observed fibrotic cord-sac interface, not simply continue an untried gentle separation. The new finding is shared wall with vas and veins rather than ordinary transmitted traction.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"]},{\"answerChoiceId\":\"choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Add an inguinal incision and release the distal sac under direct vision.\",\"clinicalRationale\":\"Anterior exposure can help when anatomy or an injury needs clarification. Here the cuff and cord anatomy are already defined; changing access does not itself separate the shared distal wall or require its release.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.groin-hernia.sliding-sac.20261112.v1\",\"displayName\":\"Mateo Alvarez: groin operation checkpoint\",\"patientPresentationVariantId\":\"presentation.intraop.groin-hernia.sliding-sac.20261112.v1\",\"patientDisplayName\":\"Mateo Alvarez\",\"releasePointId\":\"release.l3.ambulatory\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"Mateo Alvarez, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.groin-hernia.sliding-sac.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"Mateo Alvarez, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Cureus (2024); 10.7759/cureus.54975\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"],\"decisionNodes\":[{\"id\":\"node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1\",\"questionVariantId\":\"question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1\",\"primaryConceptId\":\"concept.intraop.groin-hernia.sliding-content-dissection.v1\",\"currentUpdate\":\"The left TAPP peritoneal flap is open, exposing the deep ring and lateral preperitoneal tissue. Pink sigmoid forms part of the sac's posterior boundary: its wall and mesocolon move with the peritoneal reflection. With gentle medial traction, tissue along the lateral wall stretches taut while the neck remains broad and slack.\",\"stem\":\"Which next maneuver should be used for Mateo's sigmoid-containing sac at this left TAPP repair checkpoint?\",\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.preperitoneal.20261112.v1\",\"label\":\"Mobilize the parietal attachments and reduce sac with sigmoid\",\"isCorrect\":true,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.adhesiolysis.20261112.v1\",\"label\":\"Peel the sigmoid from the posterior peritoneal boundary and reduce it separately\",\"isCorrect\":false,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.sliding-sigmoid-plane.circumferential.20261112.v1\",\"label\":\"Incise the deep ring margin and reduce the bowel-bearing sac together\",\"isCorrect\":false,\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Cureus (2024); 10.7759/cureus.54975\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.groin-hernia.adherent-distal-sac.20261112.v1\",\"questionVariantId\":\"question.intraop.groin-hernia.adherent-distal-sac.20261112.v1\",\"primaryConceptId\":\"concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1\",\"currentUpdate\":\"The sigmoid and bowel-bearing proximal sac are now inside the abdomen. An empty peritoneal cuff just distal to the deep ring is clear of bowel, vas and vessels. The residual sac extends into the upper scrotum. Under magnification, traction-countertraction and blunt spreading expose a fibrotic patch in which vas and spermatic veins lie within the sac wall; its surfaces do not separate when traction is reversed.\",\"stem\":\"How should Mateo's residual sac be handled at this left TAPP repair checkpoint after proximal reduction?\",\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.divide.20261112.v1\",\"label\":\"Divide at the free cuff and leave the adherent distal sac\",\"isCorrect\":true,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1\",\"label\":\"Retract the cuff and sharply release the distal sac from cord\",\"isCorrect\":false,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1\",\"label\":\"Add an inguinal incision and release the distal sac under direct vision\",\"isCorrect\":false,\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"The deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.groin-hernia.adherent-distal-sac.reduce.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Retract the cuff and sharply release the distal sac from cord.\",\"clinicalRationale\":\"This is now a proposal to cut through the observed fibrotic cord-sac interface, not simply continue an untried gentle separation. The new finding is shared wall with vas and veins rather than ordinary transmitted traction.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"]},{\"answerChoiceId\":\"choice.intraop.groin-hernia.adherent-distal-sac.open.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Add an inguinal incision and release the distal sac under direct vision.\",\"clinicalRationale\":\"Anterior exposure can help when anatomy or an injury needs clarification. Here the cuff and cord anatomy are already defined; changing access does not itself separate the shared distal wall or require its release.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"Journal of Abdominal Wall Surgery / HerniaSurge Collaboration (2023); 10.3389/jaws.2023.11195\",\"Hernia (2024); 10.1007/s10029-024-03094-w\"]}]}],\"learningSummary\":\"In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.\\nThe deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.\"}",
    "sourceQuestionSha256": "a4b1089e88efd1af202d806bb4c50d59fe394ee5e5715b08e01d935861237487",
    "sourceNodeSha256": "6547649bc3085576e6eda6d0839b969405cbce01ce0d194944150adfa449ab53",
    "sourceCaseSha256": "e634208fa16a3ca7bb52aa4ce639672593f98703035798d2bff935148a6a8c30",
    "acceptedQuestionSha256": "15267de407e81f4fcdb71b22ad8b0ff4030a3f57ffe9912f4e6d696b91eeacb9",
    "acceptedNodeSha256": "c5df9b49914ffe61fe59265f63153ae1f128eb5d2031e15cbe0eea7bc7504e45",
    "acceptedCaseSha256": "6070a1dc663ec1b4070daf2d1683bf00c95d2b74d726226925d1ee8d5aa8293a",
    "review": {
      "path": "docs/research/question-intraop-groin-hernia-anatomy-and-injury-review2-20261112.json",
      "record": {
        "id": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
        "nodeId": "node.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
        "title": "Adherent distal sac: balancing completion against cord injury",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Reviewed the current v1.r1 node with the current first-node presentation and explanation. The update explicitly establishes proximal reduction, an empty cuff and persistent distal adherence after a gentle plane-seeking attempt; it does not require remembering an unstated earlier result.",
          "Division at the free cuff with retention of the adherent distal sac is the best offered action. The consequential interpretation is that further complete separation threatens cord structures despite attempted exposure; the subsequent decision is to accept a retained distal sac rather than pursue complete removal through that interface or add access solely to accomplish it.",
          "The free-cuff observation is essential to the safety of the proposed division and should not be deleted as a cue. Both the key and sharp-release option reference the cuff. The three labels are comparable operative actions without explanatory qualifiers or a uniquely comprehensive key.",
          "The alternatives are meaningfully inferior under the supplied shared fibrotic interface: sharp release is not merely an untried gentle maneuver, and an inguinal incision does not itself establish a safer separable plane. Changing the update to a readily separable distal plane would change this ranking; the upper-scrotal extension alone would not justify the key.",
          "The sequence is coherent: reduce the bowel-bearing proximal component, reassess the residual sac, then decide how much distal dissection to undertake. Prior feedback offers general tissue-preservation scaffolding but does not disclose this specific completion decision. The task names the patient, procedure and post-reduction stage.",
          "This is a plausible ASC checkpoint without an established injury requiring hospital rescue. Cord preservation and the consequences of distal-sac dissection are high-yield. The explanation appropriately acknowledges possible seroma and limited comparative evidence rather than claiming that every scrotal sac must be divided."
        ],
        "suggestions": [
          "Optional clinical wording check at sign-off: confirm that 'vas and spermatic veins lie within the sac wall' accurately expresses the intended fibrotic incorporation. If the intended observation is inseparable adherence to the outer sac surface, say that precisely; do not imply this is normal sac-wall anatomy. This is a terminology check, not a confident finding of clinical inaccuracy."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "caseId": "case.intraop.groin-hernia.urinary-findings.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "sourceCaseExport": "GROIN_INTRAOP_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.groin-hernia.urinary-leak-localization.20261112.v1\",\"conceptId\":\"concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1\",\"stem\":\"Which diagnostic maneuver should next investigate Owen's new urinary findings during laparoscopic inguinal repair?\",\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.retrograde-fill.20261112.v1\",\"label\":\"Instill dyed saline through the indwelling catheter\",\"isCorrect\":true,\"rationale\":\"The new gas in a catheter bag during insufflation points to communication with the bladder. Filling through the catheter challenges that compartment while the field is observed.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1\",\"label\":\"Give intravenous indigo carmine and inspect the field\",\"isCorrect\":false,\"rationale\":\"Intravenous excreted dye can assist ureteric injury assessment, but it does not directly distend and challenge the suspected bladder defect.\",\"distractorRationale\":\"Intravenous excreted dye can assist ureteric injury assessment, but it does not directly distend and challenge the suspected bladder defect.\"},{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1\",\"label\":\"Obtain retrograde pyelography through a ureteric catheter\",\"isCorrect\":false,\"rationale\":\"A ureteric contrast study evaluates the upper urinary tract. The new bag gas during retropubic insufflation first implicates the bladder compartment.\",\"distractorRationale\":\"A ureteric contrast study evaluates the upper urinary tract. The new bag gas during retropubic insufflation first implicates the bladder compartment.\"}],\"explanation\":\"Air newly entering a catheter drainage bag during laparoscopic dissection is a bladder-injury warning. Retrograde filling through that catheter can expose a leak in the observed field. Intravenous dye and retrograde pyelography have ureteric roles; their route and compartment are different. No result of the proposed maneuver is supplied or executed here.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.groin-hernia.bladder-sign\",\"claim.intraop.groin-hernia.bladder-fill\",\"claim.intraop.groin-hernia.ureter-testing\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.groin-hernia.urinary-leak-localization.20261112.v1\",\"questionVariantId\":\"question.intraop.groin-hernia.urinary-leak-localization.20261112.v1\",\"primaryConceptId\":\"concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1\",\"currentUpdate\":\"During medial preperitoneal dissection, air begins collecting in Owen's previously gas-free catheter drainage bag. Pale fluid appears in the retropubic field. The urethral catheter remains in place; the source of the fluid is not visible.\",\"stem\":\"Which diagnostic maneuver should next investigate Owen's new urinary findings during laparoscopic inguinal repair?\",\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.retrograde-fill.20261112.v1\",\"label\":\"Instill dyed saline through the indwelling catheter\",\"isCorrect\":true,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1\",\"label\":\"Give intravenous indigo carmine and inspect the field\",\"isCorrect\":false,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1\",\"label\":\"Obtain retrograde pyelography through a ureteric catheter\",\"isCorrect\":false,\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"Air newly entering a catheter drainage bag during laparoscopic dissection is a bladder-injury warning. Retrograde filling through that catheter can expose a leak in the observed field. Intravenous dye and retrograde pyelography have ureteric roles; their route and compartment are different. No result of the proposed maneuver is supplied or executed here.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Give intravenous indigo carmine and inspect the field.\",\"clinicalRationale\":\"Intravenous excreted dye can assist ureteric injury assessment, but it does not directly distend and challenge the suspected bladder defect.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8\"]},{\"answerChoiceId\":\"choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Obtain retrograde pyelography through a ureteric catheter.\",\"clinicalRationale\":\"A ureteric contrast study evaluates the upper urinary tract. The new bag gas during retropubic insufflation first implicates the bladder compartment.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.groin-hernia.urinary-findings.20261112.v1\",\"displayName\":\"Owen Patel: groin operation checkpoint\",\"patientPresentationVariantId\":\"presentation.intraop.groin-hernia.urinary-findings.20261112.v1\",\"patientDisplayName\":\"Owen Patel\",\"releasePointId\":\"release.l3.ambulatory\",\"prototypeDemographics\":{\"ageYears\":63,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"Owen Patel, a 63-year-old man, is undergoing elective laparoscopic inguinal hernia repair in the clinic's ASC operating room. The operation is underway with a urethral catheter in place during medial dissection.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.groin-hernia.urinary-findings.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":63,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"Owen Patel, a 63-year-old man, is undergoing elective laparoscopic inguinal hernia repair in the clinic's ASC operating room. The operation is underway with a urethral catheter in place during medial dissection.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8\"],\"decisionNodes\":[{\"id\":\"node.intraop.groin-hernia.urinary-leak-localization.20261112.v1\",\"questionVariantId\":\"question.intraop.groin-hernia.urinary-leak-localization.20261112.v1\",\"primaryConceptId\":\"concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1\",\"currentUpdate\":\"During medial preperitoneal dissection, air begins collecting in Owen's previously gas-free catheter drainage bag. Pale fluid appears in the retropubic field. The urethral catheter remains in place; the source of the fluid is not visible.\",\"stem\":\"Which diagnostic maneuver should next investigate Owen's new urinary findings during laparoscopic inguinal repair?\",\"answerChoices\":[{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.retrograde-fill.20261112.v1\",\"label\":\"Instill dyed saline through the indwelling catheter\",\"isCorrect\":true,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1\",\"label\":\"Give intravenous indigo carmine and inspect the field\",\"isCorrect\":false,\"serviceRequest\":null},{\"id\":\"choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1\",\"label\":\"Obtain retrograde pyelography through a ureteric catheter\",\"isCorrect\":false,\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"Air newly entering a catheter drainage bag during laparoscopic dissection is a bladder-injury warning. Retrograde filling through that catheter can expose a leak in the observed field. Intravenous dye and retrograde pyelography have ureteric roles; their route and compartment are different. No result of the proposed maneuver is supplied or executed here.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Give intravenous indigo carmine and inspect the field.\",\"clinicalRationale\":\"Intravenous excreted dye can assist ureteric injury assessment, but it does not directly distend and challenge the suspected bladder defect.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8\"]},{\"answerChoiceId\":\"choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The constructed checkpoint selected Obtain retrograde pyelography through a ureteric catheter.\",\"clinicalRationale\":\"A ureteric contrast study evaluates the upper urinary tract. The new bag gas during retropubic insufflation first implicates the bladder compartment.\",\"sourceLabels\":[\"Surgical Endoscopy / International Endohernia Society (2011); 10.1007/s00464-011-1799-6\",\"World Journal of Emergency Surgery / World Society of Emergency Surgery (2023); 10.1186/s13017-023-00513-8\"]}]}],\"learningSummary\":\"Air newly entering a catheter drainage bag during laparoscopic dissection is a bladder-injury warning. Retrograde filling through that catheter can expose a leak in the observed field. Intravenous dye and retrograde pyelography have ureteric roles; their route and compartment are different. No result of the proposed maneuver is supplied or executed here.\"}",
    "sourceQuestionSha256": "38a61a16a2aa9e4140e34ee981c8021d73435a8851edaae04c4143a4ccd519d2",
    "sourceNodeSha256": "a1ae90acd04cc4ee4e199ffdcc61abb261bc88975b41a9db8aeed74d7bc29510",
    "sourceCaseSha256": "1fc7dc74143a14b3a7ef6c582111dc133dead79d1f4ec8a83ba24c0408cfeb35",
    "acceptedQuestionSha256": "e3d49dd0188f70f59a9eb35ce342dbf42f53d83ed42931e069463c61f978f24f",
    "acceptedNodeSha256": "43a1608d6f2390b61761576df2cbe7fb2800f801888bad1dafce1a629207af41",
    "acceptedCaseSha256": "b30d75990626e08f9185bfba8b56ca91f1c933d6a7bb43341e45aef967aa1232",
    "review": {
      "path": "docs/research/question-intraop-groin-hernia-anatomy-and-injury-review2-20261112.json",
      "record": {
        "id": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
        "nodeId": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
        "title": "New catheter-bag gas: choosing an intraoperative leak test",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Independently reviewed the offered v1 text despite its prior PASS label. New catheter-bag gas during medial insufflated dissection, together with retropubic fluid, supports suspected bladder injury. The learner must localize the likely injured urinary compartment and then select a direct retrograde filling maneuver rather than an upper-tract investigation.",
          "Instilling dyed saline through the existing urethral catheter is the best next diagnostic maneuver among the choices. Intravenous excreted dye may reveal urinary leakage but is less direct for challenging the suspected bladder defect; retrograde pyelography evaluates a different compartment. The explanation's statement about ureteric roles should not be interpreted as saying intravenous dye can never reveal a bladder leak.",
          "Repeating the catheter's presence and naming it in the key is a mild surface overlap, but it supplies necessary route information rather than a nonmedical answer rule. Another choice also uses a catheter, and all three options are comparable diagnostic maneuvers of similar length. 'Urinary findings' does not disclose bladder versus ureter.",
          "The visible fluid with an unseen source creates a real localization problem. This is a plausible unexpected event during an elective ASC repair, and the node asks for an initial diagnostic maneuver rather than assuming onsite definitive urologic rescue. The pyelography distractor must not be interpreted as proof that the ASC has that capability.",
          "This standalone node gives a complete patient/procedure/stage task and requires no future result. Suspected bladder injury and direct leak localization are high-yield. The clinical ranking is clear without inventing a filling volume, timing threshold or definitive repair plan.",
          "Runtime wait-preview rendering is not established by the permitted candidate-text review. All three testing choices need matched previews under the presentation standard; this PASS is an editorial judgment on the supplied text, not a runtime validation receipt."
        ],
        "suggestions": []
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.lap-access.major-access-injury.20261112.v1",
    "caseId": "case.intraop.lap-access.outside-access-rescue.20261112.v1",
    "questionVariantId": "question.intraop.lap-access.major-access-injury.20261112.v1",
    "sourceCaseExport": "LAP_ACCESS_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.lap-access.major-access-injury.20261112.v1\",\"conceptId\":\"concept.intraop.lap-access.major-access-injury.v1\",\"stem\":\"Which exposure and cannula-removal plan should have been selected at this checkpoint in {patientName}'s outside operation?\",\"answerChoices\":[{\"id\":\"choice.intraop.lap-access.major-retain\",\"label\":\"Open exposure with cannula retained until vascular control\",\"isCorrect\":true,\"rationale\":\"The fixed access cannula remains at the suspected injury while the deep hematoma expands and instability recurs. Obtain open exposure and control before withdrawing it, preserving the track and possible tamponade during that sequence.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.lap-access.major-remove\",\"label\":\"Open exposure with cannula removed before vascular control\",\"isCorrect\":false,\"rationale\":\"The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.\",\"distractorRationale\":\"The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.\"},{\"id\":\"choice.intraop.lap-access.major-laparoscopic\",\"label\":\"Laparoscopic exposure with cannula retained until vascular control\",\"isCorrect\":false,\"rationale\":\"Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.\",\"distractorRationale\":\"Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.\"},{\"id\":\"choice.intraop.lap-access.major-remove-laparoscopic\",\"label\":\"Laparoscopic exposure with cannula removed before vascular control\",\"isCorrect\":false,\"rationale\":\"This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.\",\"distractorRationale\":\"This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.\"}],\"explanation\":\"The outer working cannula remains at the suspected deep injury; the penetrating obturator has already been removed. Preserve the cannula until the source is exposed and controlled. Expansion, incomplete exposure and recurrent instability favor urgent open control with vascular assistance. These are outside hospital observations, not a rescue operation performed in clinic.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.lap-access.major-injury\",\"claim.intraop.lap-access.major-control\",\"claim.intraop.lap-access.access-cannula-retention\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.lap-access.major-access-injury.20261112.v1\",\"questionVariantId\":\"question.intraop.lap-access.major-access-injury.20261112.v1\",\"primaryConceptId\":\"concept.intraop.lap-access.major-access-injury.v1\",\"stem\":\"Which exposure and cannula-removal plan should have been selected at this checkpoint in {patientName}'s outside operation?\",\"currentUpdate\":\"At the outside hospital's working-port placement checkpoint, the existing camera-port view shows a newly inserted working cannula passing through the posterior peritoneum into a deep hematoma. The penetrating obturator has been removed; the outer cannula remains fixed there and has not been withdrawn. The hematoma expands across successive views and its lower edge is not exposed. Arterial pressure falls again after an initial resuscitative response. The team is supporting circulation and summoning vascular assistance.\",\"answerChoices\":[{\"id\":\"choice.intraop.lap-access.major-retain\",\"label\":\"Open exposure with cannula retained until vascular control\",\"isCorrect\":true,\"rationale\":\"The fixed access cannula remains at the suspected injury while the deep hematoma expands and instability recurs. Obtain open exposure and control before withdrawing it, preserving the track and possible tamponade during that sequence.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.lap-access.major-remove\",\"label\":\"Open exposure with cannula removed before vascular control\",\"isCorrect\":false,\"rationale\":\"The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.lap-access.major-laparoscopic\",\"label\":\"Laparoscopic exposure with cannula retained until vascular control\",\"isCorrect\":false,\"rationale\":\"Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.lap-access.major-remove-laparoscopic\",\"label\":\"Laparoscopic exposure with cannula removed before vascular control\",\"isCorrect\":false,\"rationale\":\"This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"The outer working cannula remains at the suspected deep injury; the penetrating obturator has already been removed. Preserve the cannula until the source is exposed and controlled. Expansion, incomplete exposure and recurrent instability favor urgent open control with vascular assistance. These are outside hospital observations, not a rescue operation performed in clinic.\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.lap-access.major-remove\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.\",\"clinicalRationale\":\"The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"]},{\"answerChoiceId\":\"choice.intraop.lap-access.major-laparoscopic\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.\",\"clinicalRationale\":\"Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"]},{\"answerChoiceId\":\"choice.intraop.lap-access.major-remove-laparoscopic\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.\",\"clinicalRationale\":\"This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.lap-access.outside-access-rescue.20261112.v1\",\"displayName\":\"Operative record review\",\"patientPresentationVariantId\":\"presentation.intraop.lap-access.outside-access-rescue.20261112.v1\",\"patientDisplayName\":\"Daniel Porter\",\"prototypeDemographics\":{\"ageYears\":58,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Operative record review\",\"presentation\":\"{patientName}, a 58-year-old man, attends clinic after an outside laparoscopic colectomy. The founder reviews the outside operative and anesthesia records at working-port placement.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.lap-access.outside-access-rescue.v1\",\"prototypeDemographics\":{\"ageYears\":58,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Operative record review\",\"presentation\":\"{patientName}, a 58-year-old man, attends clinic after an outside laparoscopic colectomy. The founder reviews the outside operative and anesthesia records at working-port placement.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":1,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"],\"decisionNodes\":[{\"id\":\"node.intraop.lap-access.major-access-injury.20261112.v1\",\"questionVariantId\":\"question.intraop.lap-access.major-access-injury.20261112.v1\",\"primaryConceptId\":\"concept.intraop.lap-access.major-access-injury.v1\",\"stem\":\"Which exposure and cannula-removal plan should have been selected at this checkpoint in {patientName}'s outside operation?\",\"currentUpdate\":\"At the outside hospital's working-port placement checkpoint, the existing camera-port view shows a newly inserted working cannula passing through the posterior peritoneum into a deep hematoma. The penetrating obturator has been removed; the outer cannula remains fixed there and has not been withdrawn. The hematoma expands across successive views and its lower edge is not exposed. Arterial pressure falls again after an initial resuscitative response. The team is supporting circulation and summoning vascular assistance.\",\"answerChoices\":[{\"id\":\"choice.intraop.lap-access.major-retain\",\"label\":\"Open exposure with cannula retained until vascular control\",\"isCorrect\":true,\"rationale\":\"The fixed access cannula remains at the suspected injury while the deep hematoma expands and instability recurs. Obtain open exposure and control before withdrawing it, preserving the track and possible tamponade during that sequence.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.lap-access.major-remove\",\"label\":\"Open exposure with cannula removed before vascular control\",\"isCorrect\":false,\"rationale\":\"The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.lap-access.major-laparoscopic\",\"label\":\"Laparoscopic exposure with cannula retained until vascular control\",\"isCorrect\":false,\"rationale\":\"Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.lap-access.major-remove-laparoscopic\",\"label\":\"Laparoscopic exposure with cannula removed before vascular control\",\"isCorrect\":false,\"rationale\":\"This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"The outer working cannula remains at the suspected deep injury; the penetrating obturator has already been removed. Preserve the cannula until the source is exposed and controlled. Expansion, incomplete exposure and recurrent instability favor urgent open control with vascular assistance. These are outside hospital observations, not a rescue operation performed in clinic.\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.lap-access.major-remove\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.\",\"clinicalRationale\":\"The open approach is appropriate, but removal before control can release tamponade and lose the track. The outer cannula, not the already removed obturator, is retained here.\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"]},{\"answerChoiceId\":\"choice.intraop.lap-access.major-laparoscopic\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.\",\"clinicalRationale\":\"Retention addresses instrument sequence, but expanding incompletely exposed bleeding with recurrent instability does not support extending the laparoscopic exposure attempt here.\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"]},{\"answerChoiceId\":\"choice.intraop.lap-access.major-remove-laparoscopic\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.\",\"clinicalRationale\":\"This removes the fixed cannula before control and prolongs an incompletely exposed laparoscopic attempt during recurrent instability. Neither component fits the checkpoint.\",\"sourceLabels\":[\"source.intraop.lap-access.alkatout-entry-2017\",\"source.intraop.lap-access.sasgog-trocar-2026\",\"source.intraop.lap-access.lasser-complications-2012\"]}]}],\"learningSummary\":\"The outer working cannula remains at the suspected deep injury; the penetrating obturator has already been removed. Preserve the cannula until the source is exposed and controlled. Expansion, incomplete exposure and recurrent instability favor urgent open control with vascular assistance. These are outside hospital observations, not a rescue operation performed in clinic.\"}",
    "sourceQuestionSha256": "ae79accd3f688a2708e10d1357de57c9d48d856bb59fd522bdb027d6ffb35acb",
    "sourceNodeSha256": "136fd5645735f2c21e922133e9bf5c079109faaee38f5c9b78a8a313c29bb6e3",
    "sourceCaseSha256": "dd374167a3bfa5227a9cf605e69e0a41afdf45b74ff48bf78a66f5bc350fc6b2",
    "acceptedQuestionSha256": "ae79accd3f688a2708e10d1357de57c9d48d856bb59fd522bdb027d6ffb35acb",
    "acceptedNodeSha256": "136fd5645735f2c21e922133e9bf5c079109faaee38f5c9b78a8a313c29bb6e3",
    "acceptedCaseSha256": "44024bf626963884e399498cfe1c7f8056d84eefa6206f01fec1c68bd3e0eb43",
    "review": {
      "path": "docs/research/question-intraop-laparoscopic-access-and-insufflation-review2-20261112.json",
      "record": {
        "id": "question.intraop.lap-access.major-access-injury.20261112.v1",
        "nodeId": "node.intraop.lap-access.major-access-injury.20261112.v1",
        "title": "Expanding deep hematoma after working-port placement",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The outside operative/anesthesia record and its working-port checkpoint are explicit. The named adult attends clinic after a hospital-level operation; the question does not place colectomy or major vascular rescue in the clinic's ambulatory OR.",
          "The decisive scene is visible in prose: an existing camera view, an outer cannula still traversing the posterior peritoneum at the suspected injury, a removed obturator, an expanding hematoma with incomplete exposure and recurrent hypotension after an initial response. This is an unusual but plausible access complication, and the text distinguishes the retained cannula from a mere historical instrument track.",
          "Urgent open exposure with the implicated cannula retained until vascular control is the single defensible best offered plan. Expansion, inadequate exposure and recurrent instability make prolonged laparoscopic exposure less appropriate; removing the cannula before control risks releasing any tamponade. No confident clinical inaccuracy was identified from the candidate.",
          "The four options form a balanced exposure-by-removal-timing matrix. Each component appears twice, labels are parallel and comparably specific, and no majority-component, length, diagnostic-label or key-only wording shortcut was found. Clinical findings appropriately determine the choice.",
          "Two consequential judgments remain: use expansion, exposure and the circulatory trajectory to choose the operative approach; use the instrument's actual position to sequence removal relative to vascular control. Temporary improvement and an existing camera provide plausible temptations for continued laparoscopic management, while retained-instrument handling tests a distinct safety error.",
          "This is moderate rather than hard because both management principles are familiar and the deterioration is explicit. Major access-injury recognition and control are high-yield surgical safety concepts. The complete retrospective task stands alone and does not depend on later outcomes.",
          "PASS is editorial acceptance of this exact visible version, not clinical sign-off or independent source verification. The draft remains needs_clinician_review; the exact deep-cannula scene and control/removal wording still require Melissa Rowland's clinical approval."
        ],
        "suggestions": [
          "Preserve the balanced four-option matrix, recurrent instability, incomplete exposure and explicit outer-cannula/removed-obturator distinction. These details earn the two judgments and should not be removed as alleged cues.",
          "Retain the outside-hospital record-review frame and exact-version clinical-review status. No editorial rewrite is required for this candidate."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "caseId": "case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1",
    "questionVariantId": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "sourceCaseExport": "HEMORRHAGE_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1\",\"conceptId\":\"concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1\",\"stem\":\"At the recorded liver exposure, which maneuver should be recommended next for {patientName}?\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed outside operative and anesthesia record; fictional observations\",\"items\":[{\"label\":\"Inflow clamp\",\"value\":\"A noncrushing clamp encompasses the hepatoduodenal ligament. Bleeding from the anterior liver wound markedly decreases.\"},{\"label\":\"Posterior field\",\"value\":\"Blood continues from behind the right lobe at the same pace while the clamp is in place.\"},{\"label\":\"Compression response\",\"value\":\"Restoring the liver to position with manual compression stops the posterior flow; releasing pressure restarts it.\"},{\"label\":\"Anesthesia trajectory\",\"value\":\"Arterial pressure repeatedly falls after transient improvement during transfusion; temperature is falling.\"}]},\"answerChoices\":[{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repack\",\"label\":\"Reapply perihepatic packing and defer direct venous repair\",\"isCorrect\":true,\"rationale\":\"The posterior source persists during inflow occlusion and responds to compression. Repacking provides temporary control pending physiological correction and planning of any necessary advanced repair.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repair\",\"label\":\"Mobilize the right lobe and attempt direct venous repair\",\"isCorrect\":false,\"rationale\":\"Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.\",\"distractorRationale\":\"Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.\"},{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.artery\",\"label\":\"Ligate the right hepatic artery and inspect the liver wound\",\"isCorrect\":false,\"rationale\":\"The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.\",\"distractorRationale\":\"The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.\"}],\"explanation\":\"Inflow occlusion changes the anterior component but not the posterior one. That pattern raises concern for hepatic venous or retrohepatic caval bleeding, while leaving variant arterial inflow in the differential. Compression controls the posterior source and physiology is worsening, so repacking is the next temporary measure. Direct venous repair depends on the need and available expertise.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.operative-hemorrhage.pringle-inflow\",\"claim.intraop.operative-hemorrhage.pringle-posterior\",\"claim.intraop.operative-hemorrhage.pringle-variant-artery\",\"claim.intraop.operative-hemorrhage.hepatic-packing\",\"claim.intraop.operative-hemorrhage.hepatic-repacking\",\"claim.intraop.operative-hemorrhage.hepatic-repair-boundary\",\"claim.intraop.operative-hemorrhage.hepatic-arterial-ligation\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1\",\"questionVariantId\":\"question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1\",\"primaryConceptId\":\"concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1\",\"currentUpdate\":\"The outside trauma-laparotomy record reaches a checkpoint after release of the initial liver packs. Blood transfusion and warming continue while the team seeks additional surgical assistance.\",\"stem\":\"At the recorded liver exposure, which maneuver should be recommended next for {patientName}?\",\"answerChoices\":[{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repack\",\"label\":\"Reapply perihepatic packing and defer direct venous repair\",\"isCorrect\":true,\"rationale\":\"The posterior source persists during inflow occlusion and responds to compression. Repacking provides temporary control pending physiological correction and planning of any necessary advanced repair.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repair\",\"label\":\"Mobilize the right lobe and attempt direct venous repair\",\"isCorrect\":false,\"rationale\":\"Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.artery\",\"label\":\"Ligate the right hepatic artery and inspect the liver wound\",\"isCorrect\":false,\"rationale\":\"The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Inflow occlusion changes the anterior component but not the posterior one. That pattern raises concern for hepatic venous or retrohepatic caval bleeding, while leaving variant arterial inflow in the differential. Compression controls the posterior source and physiology is worsening, so repacking is the next temporary measure. Direct venous repair depends on the need and available expertise.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed outside operative and anesthesia record; fictional observations\",\"items\":[{\"label\":\"Inflow clamp\",\"value\":\"A noncrushing clamp encompasses the hepatoduodenal ligament. Bleeding from the anterior liver wound markedly decreases.\"},{\"label\":\"Posterior field\",\"value\":\"Blood continues from behind the right lobe at the same pace while the clamp is in place.\"},{\"label\":\"Compression response\",\"value\":\"Restoring the liver to position with manual compression stops the posterior flow; releasing pressure restarts it.\"},{\"label\":\"Anesthesia trajectory\",\"value\":\"Arterial pressure repeatedly falls after transient improvement during transfusion; temperature is falling.\"}]},\"sourceLabels\":[\"Liver trauma: WSES 2020 guidelines\",\"Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repair\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This answer records a recommendation. It executes no intervention and determines no patient outcome.\",\"clinicalRationale\":\"Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.\",\"sourceLabels\":[\"Liver trauma: WSES 2020 guidelines\",\"Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks\"]},{\"answerChoiceId\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.artery\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This answer records a recommendation. It executes no intervention and determines no patient outcome.\",\"clinicalRationale\":\"The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.\",\"sourceLabels\":[\"Liver trauma: WSES 2020 guidelines\",\"Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1\",\"displayName\":\"Operative record review\",\"patientPresentationVariantId\":\"presentation.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1\",\"patientDisplayName\":\"Daniel Mercer\",\"prototypeDemographics\":{\"ageYears\":36,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Operative record review\",\"presentation\":\"{patientName}, a 36-year-old man, visits the clinic to review the outside operative and anesthesia records from his trauma laparotomy. The selected checkpoint concerns bleeding during the initial liver exposure.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":36,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Operative record review\",\"presentation\":\"{patientName}, a 36-year-old man, visits the clinic to review the outside operative and anesthesia records from his trauma laparotomy. The selected checkpoint concerns bleeding during the initial liver exposure.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Liver trauma: WSES 2020 guidelines\",\"Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks\"],\"decisionNodes\":[{\"id\":\"node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1\",\"questionVariantId\":\"question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1\",\"primaryConceptId\":\"concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1\",\"currentUpdate\":\"The outside trauma-laparotomy record reaches a checkpoint after release of the initial liver packs. Blood transfusion and warming continue while the team seeks additional surgical assistance.\",\"stem\":\"At the recorded liver exposure, which maneuver should be recommended next for {patientName}?\",\"answerChoices\":[{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repack\",\"label\":\"Reapply perihepatic packing and defer direct venous repair\",\"isCorrect\":true,\"rationale\":\"The posterior source persists during inflow occlusion and responds to compression. Repacking provides temporary control pending physiological correction and planning of any necessary advanced repair.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repair\",\"label\":\"Mobilize the right lobe and attempt direct venous repair\",\"isCorrect\":false,\"rationale\":\"Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.artery\",\"label\":\"Ligate the right hepatic artery and inspect the liver wound\",\"isCorrect\":false,\"rationale\":\"The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Inflow occlusion changes the anterior component but not the posterior one. That pattern raises concern for hepatic venous or retrohepatic caval bleeding, while leaving variant arterial inflow in the differential. Compression controls the posterior source and physiology is worsening, so repacking is the next temporary measure. Direct venous repair depends on the need and available expertise.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed outside operative and anesthesia record; fictional observations\",\"items\":[{\"label\":\"Inflow clamp\",\"value\":\"A noncrushing clamp encompasses the hepatoduodenal ligament. Bleeding from the anterior liver wound markedly decreases.\"},{\"label\":\"Posterior field\",\"value\":\"Blood continues from behind the right lobe at the same pace while the clamp is in place.\"},{\"label\":\"Compression response\",\"value\":\"Restoring the liver to position with manual compression stops the posterior flow; releasing pressure restarts it.\"},{\"label\":\"Anesthesia trajectory\",\"value\":\"Arterial pressure repeatedly falls after transient improvement during transfusion; temperature is falling.\"}]},\"sourceLabels\":[\"Liver trauma: WSES 2020 guidelines\",\"Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.repair\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This answer records a recommendation. It executes no intervention and determines no patient outcome.\",\"clinicalRationale\":\"Repair may ultimately be necessary, but current packing-responsive bleeding and worsening physiology favor temporary control. Mobilization can release tamponade and expose a difficult venous injury.\",\"sourceLabels\":[\"Liver trauma: WSES 2020 guidelines\",\"Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks\"]},{\"answerChoiceId\":\"choice.intraop.operative-hemorrhage.pringle-persistent-posterior.artery\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This answer records a recommendation. It executes no intervention and determines no patient outcome.\",\"clinicalRationale\":\"The regional responses argue against treating all residual blood as right hepatic arterial inflow. A variant artery remains a differential consideration, but an artery has not been identified as this posterior source.\",\"sourceLabels\":[\"Liver trauma: WSES 2020 guidelines\",\"Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks\"]}]}],\"learningSummary\":\"Inflow occlusion changes the anterior component but not the posterior one. That pattern raises concern for hepatic venous or retrohepatic caval bleeding, while leaving variant arterial inflow in the differential. Compression controls the posterior source and physiology is worsening, so repacking is the next temporary measure. Direct venous repair depends on the need and available expertise.\"}",
    "sourceQuestionSha256": "b2bb52df1a329c6b3a58ac8422ee7a34650632bdcafda440dccfaf2321cfb150",
    "sourceNodeSha256": "43958412e3116740dfbb4a4158e8abb975bd45c055d6b552145f993f4feefc8d",
    "sourceCaseSha256": "fdbdb72caee1385346fdec0730720fd7caf7e30497ead352a87f21ada929cf7a",
    "acceptedQuestionSha256": "b2bb52df1a329c6b3a58ac8422ee7a34650632bdcafda440dccfaf2321cfb150",
    "acceptedNodeSha256": "43958412e3116740dfbb4a4158e8abb975bd45c055d6b552145f993f4feefc8d",
    "acceptedCaseSha256": "d76c87924fb446278ceb9486ed01303e477bb8d4684fd133dd9929d8daf315dc",
    "review": {
      "path": "docs/research/question-intraop-operative-hemorrhage-and-splenic-injury-review2-20261112.json",
      "record": {
        "id": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
        "nodeId": "node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
        "title": "Temporize posterior hepatic bleeding after an inflow clamp",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The visible record supports repacking as the best next maneuver: anterior bleeding decreases with inflow occlusion, posterior flow persists, compression stops that flow, and physiology worsens despite resuscitation. Direct venous repair is a plausible wrong-stage alternative; arterial ligation lacks an identified arterial target.",
          "Two consequential judgments are available: interpret the differential response as concerning for an outflow-region injury rather than simply persistent inflow, then use compression response and deteriorating physiology to favor temporary control over immediate exposure and repair. The explanation correctly retains uncertainty about the exact vessel and variant arterial supply.",
          "The compression-response row strongly favors packing and permits a simpler damage-control route to the answer. This limits difficulty to moderate rather than hard, but it is necessary clinical information, not an unfair nonmedical cue. No decisive wording, length, absolute or convergence shortcut identified.",
          "Daniel Mercer is a named 36-year-old man in clinic reviewing an outside trauma laparotomy. The hospital operation is not portrayed as local ASC care. Unpacking, inflow occlusion, observed differential bleeding, compression and reassessment form a coherent operative sequence. The constructed record exposes the decision-critical findings without claiming an absent image.",
          "This is a standalone, complete checkpoint with no dependence on a previous scored answer. It tests high-yield hepatic hemorrhage localization and damage-control sequencing. No confident clinical inaccuracy identified from the visible material; this offline PASS is editorial and does not confer clinician approval."
        ],
        "suggestions": [
          "Preserve the exact displayed version and its qualified explanation. Retain the observed compression response and physiological trajectory; do not remove necessary facts merely to increase difficulty.",
          "Keep reviewer difficulty at moderate. The existing frozen-PASS label was not used as evidence for the verdict."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
    "caseId": "case.intraop.i25.unmapped-narrowing.20261112.v1",
    "questionVariantId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "sourceCaseExport": "I25_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.revision1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.i25.anatomy-before-dilation.20261112.v1\",\"conceptId\":\"concept.intraop.i25.anatomy-before-dilation.20261112.v1\",\"stem\":\"Which investigation should be arranged after recovery from this EGD, before selecting treatment for {patientName}'s persistent dysphagia?\",\"explanation\":\"The new endoscopic finding changes the remaining question from tissue activity to luminal anatomy. A barium esophagram can map the segment before a subsequent dilation plan. The current observation does not prove a specific fibrotic mechanism, and it does not require immediate dilation, a manometric diagnosis or a new drug regimen.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.i25.topical-response.20261112.v1\",\"claim.intraop.i25.structural-histology.20261112.v1\",\"claim.intraop.i25.anatomy-before-dilation.20261112.v1\",\"claim.intraop.i25.motility-scope.20261112.v1\",\"claim.intraop.i25.biopsy-scope.20261112.v1\"],\"answerChoices\":[{\"id\":\"choice.intraop.i25.anatomy-before-dilation.esophagram.20261112.v1\",\"label\":\"Barium contrast esophagram\",\"isCorrect\":true,\"rationale\":\"The new limitation is the unseen extent of the narrowed lumen. Contrast assessment can define its course and length for subsequent planning when endoscopy cannot, even though tissue inflammation has improved.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1\",\"label\":\"High-resolution esophageal manometry\",\"isCorrect\":false,\"rationale\":\"Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.\",\"distractorRationale\":\"Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.\"},{\"id\":\"choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1\",\"label\":\"Repeat esophageal mucosal biopsies\",\"isCorrect\":false,\"rationale\":\"Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.\",\"distractorRationale\":\"Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.i25.anatomy-before-dilation.20261112.v1\",\"primaryConceptId\":\"concept.intraop.i25.anatomy-before-dilation.20261112.v1\",\"questionVariantId\":\"question.intraop.i25.anatomy-before-dilation.20261112.v1\",\"stem\":\"Which investigation should be arranged after recovery from this EGD, before selecting treatment for {patientName}'s persistent dysphagia?\",\"currentUpdate\":\"A fixed mid-esophageal narrowing stops the standard gastroscope at its proximal edge. The narrowed channel continues beyond the view, and its distal border is not seen. The endoscopist withdraws to the proximal lumen. Anesthesia observations remain stable.\",\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.i25.anatomy-before-dilation.esophagram.20261112.v1\",\"label\":\"Barium contrast esophagram\",\"isCorrect\":true,\"rationale\":\"The new limitation is the unseen extent of the narrowed lumen. Contrast assessment can define its course and length for subsequent planning when endoscopy cannot, even though tissue inflammation has improved.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1\",\"label\":\"High-resolution esophageal manometry\",\"isCorrect\":false,\"rationale\":\"Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1\",\"label\":\"Repeat esophageal mucosal biopsies\",\"isCorrect\":false,\"rationale\":\"Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.\",\"serviceRequest\":null}],\"explanation\":\"The new endoscopic finding changes the remaining question from tissue activity to luminal anatomy. A barium esophagram can map the segment before a subsequent dilation plan. The current observation does not prove a specific fibrotic mechanism, and it does not require immediate dilation, a manometric diagnosis or a new drug regimen.\",\"sourceLabels\":[\"Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN\",\"Eosinophilic esophagitis in children and adolescents: a clinical practice guideline\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this recommendation and rationale. The authored choice does not execute an investigation or intervention or simulate a patient outcome.\",\"clinicalRationale\":\"Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.\",\"sourceLabels\":[\"Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN\",\"Eosinophilic esophagitis in children and adolescents: a clinical practice guideline\"]},{\"answerChoiceId\":\"choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this recommendation and rationale. The authored choice does not execute an investigation or intervention or simulate a patient outcome.\",\"clinicalRationale\":\"Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.\",\"sourceLabels\":[\"Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN\",\"Eosinophilic esophagitis in children and adolescents: a clinical practice guideline\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.i25.unmapped-narrowing.20261112.v1\",\"displayName\":\"EGD reassessment\",\"patientDisplayName\":\"Isla Chen\",\"patientPresentationVariantId\":\"presentation.intraop.i25.unmapped-narrowing.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":11,\"sexLabel\":\"Female\"},\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"chiefComplaint\":\"EGD reassessment\",\"presentation\":\"{patientName}, an 11-year-old girl with established EoE, is undergoing EGD in the clinic's endoscopy room to reassess persistent solid-food dysphagia before selecting further treatment. At the earlier on-budesonide response endoscopy, an ultrathin gastroscope reached the stomach and proximal and distal biopsies showed rare eosinophils without active epithelial injury. Today the endoscopist is using a standard diagnostic gastroscope. Liquids and saliva pass. Her father, Daniel Chen, joined the preparation discussion and waits onsite. A pediatric endoscopist, endoscopy nurse and pediatric anesthetist are present.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.i25.unmapped-narrowing.20261112.v1\",\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"prototypeDemographics\":{\"ageYears\":11,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"EGD reassessment\",\"presentation\":\"{patientName}, an 11-year-old girl with established EoE, is undergoing EGD in the clinic's endoscopy room to reassess persistent solid-food dysphagia before selecting further treatment. At the earlier on-budesonide response endoscopy, an ultrathin gastroscope reached the stomach and proximal and distal biopsies showed rare eosinophils without active epithelial injury. Today the endoscopist is using a standard diagnostic gastroscope. Liquids and saliva pass. Her father, Daniel Chen, joined the preparation discussion and waits onsite. A pediatric endoscopist, endoscopy nurse and pediatric anesthetist are present.\"}],\"releasePointId\":\"release.l4.pediatrics\",\"earliestFacilityStage\":4,\"tutorialEligible\":false,\"routineEligible\":false,\"requiredClinicalSetting\":\"endoscopy\",\"requiredCapabilityIds\":[\"capability.pediatric_examination\",\"capability.endoscopy\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN\",\"Eosinophilic esophagitis in children and adolescents: a clinical practice guideline\"],\"decisionNodes\":[{\"id\":\"node.intraop.i25.anatomy-before-dilation.20261112.v1\",\"primaryConceptId\":\"concept.intraop.i25.anatomy-before-dilation.20261112.v1\",\"questionVariantId\":\"question.intraop.i25.anatomy-before-dilation.20261112.v1\",\"stem\":\"Which investigation should be arranged after recovery from this EGD, before selecting treatment for {patientName}'s persistent dysphagia?\",\"currentUpdate\":\"A fixed mid-esophageal narrowing stops the standard gastroscope at its proximal edge. The narrowed channel continues beyond the view, and its distal border is not seen. The endoscopist withdraws to the proximal lumen. Anesthesia observations remain stable.\",\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.i25.anatomy-before-dilation.esophagram.20261112.v1\",\"label\":\"Barium contrast esophagram\",\"isCorrect\":true,\"rationale\":\"The new limitation is the unseen extent of the narrowed lumen. Contrast assessment can define its course and length for subsequent planning when endoscopy cannot, even though tissue inflammation has improved.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1\",\"label\":\"High-resolution esophageal manometry\",\"isCorrect\":false,\"rationale\":\"Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1\",\"label\":\"Repeat esophageal mucosal biopsies\",\"isCorrect\":false,\"rationale\":\"Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.\",\"serviceRequest\":null}],\"explanation\":\"The new endoscopic finding changes the remaining question from tissue activity to luminal anatomy. A barium esophagram can map the segment before a subsequent dilation plan. The current observation does not prove a specific fibrotic mechanism, and it does not require immediate dilation, a manometric diagnosis or a new drug regimen.\",\"sourceLabels\":[\"Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN\",\"Eosinophilic esophagitis in children and adolescents: a clinical practice guideline\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this recommendation and rationale. The authored choice does not execute an investigation or intervention or simulate a patient outcome.\",\"clinicalRationale\":\"Persistent dysphagia after inflammatory response can justify considering motility, but this view has already demonstrated an incompletely assessed fixed narrowing. Pressure measurements do not first map the distal extent needed for its procedural planning.\",\"sourceLabels\":[\"Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN\",\"Eosinophilic esophagitis in children and adolescents: a clinical practice guideline\"]},{\"answerChoiceId\":\"choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this recommendation and rationale. The authored choice does not execute an investigation or intervention or simulate a patient outcome.\",\"clinicalRationale\":\"Repeat tissue can reassess inflammatory activity, but the available response samples already address that domain. Further mucosal tissue does not show the unseen course and distal extent of this narrowed segment.\",\"sourceLabels\":[\"Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN\",\"Eosinophilic esophagitis in children and adolescents: a clinical practice guideline\"]}]}],\"learningSummary\":\"The new endoscopic finding changes the remaining question from tissue activity to luminal anatomy. A barium esophagram can map the segment before a subsequent dilation plan. The current observation does not prove a specific fibrotic mechanism, and it does not require immediate dilation, a manometric diagnosis or a new drug regimen.\"}",
    "sourceQuestionSha256": "28624ad008f831dbd617d8d1189abbd96ded38789121403c2e597b4386d6fe3f",
    "sourceNodeSha256": "0f8ab6b0bf3f676be4f6107ff62207e9603850dccb1814f82db36457555e9f4a",
    "sourceCaseSha256": "88b891212007cef1da58b9c38d7fbb0a505b89b37d2473bd61b32ff2b3608a3f",
    "acceptedQuestionSha256": "28624ad008f831dbd617d8d1189abbd96ded38789121403c2e597b4386d6fe3f",
    "acceptedNodeSha256": "0f8ab6b0bf3f676be4f6107ff62207e9603850dccb1814f82db36457555e9f4a",
    "acceptedCaseSha256": "152570421683457289f546c0b9f1d893c42b2303c95b22f28e824f547a4ec6e3",
    "review": {
      "path": "docs/research/question-intraop-pediatric-egd-food-impaction-eoe-review2-20261112.json",
      "record": {
        "id": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
        "nodeId": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
        "title": "An incomplete luminal survey before pediatric EoE dilation",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The complete task clearly asks for a subsequent investigation after recovery, not oral contrast administration during anesthesia or immediate dilation. The current scope-stop observation and unseen distal border explain what the present examination has not established.",
          "Barium contrast esophagram is the best offered next investigation to characterize the incompletely visualized narrowing. Manometry addresses a competing functional explanation for persistent dysphagia, and repeat biopsy addresses inflammatory activity; neither first supplies the missing luminal anatomy. Additional biopsy could be useful for another question without making it the best answer to this checkpoint.",
          "The two consequential steps are to reconcile persistent solid-food symptoms and a scope-limiting segment with prior tissue improvement, then select an investigation that resolves the remaining structural uncertainty before treatment planning. This is moderate rather than hard: the visible fixed narrowing makes manometry a relatively distant competitor once interpreted.",
          "The question tests a high-yield distinction among inflammatory activity, structural narrowing and motility in persistent dysphagia. The explanation avoids overclaiming a proven fibrotic mechanism or making immediate dilation mandatory.",
          "The known EoE label is appropriate background for a management investigation, not disclosure of an answer to a diagnosis task. All three options are concise investigations with comparable specificity. No unique wording overlap, absolute, teaching sentence, length outlier or component-convergence shortcut identifies the key without knowing what the tests assess.",
          "An ultrathin scope reaching the stomach previously and a standard scope stopping now are compatible observations; they do not require an invented rate of disease progression. The prior examination, prior tissue result, current live examination and later investigation are ordered coherently. The standalone case contains the context needed to solve it.",
          "The named 11-year-old girl, father present for preparation and waiting onsite, passing liquids/saliva, pediatric team and stable anesthetic observations make the diagnostic ASC scene plausible. Withdrawal at the narrowing avoids depicting an unsupported dilation or hospital rescue. Prose supplies the critical endoscopic observations; no missing promised image is required to solve the item.",
          "The earlier response biopsies do not establish current histologic remission indefinitely. The unknown interval and current treatment adherence are minor residual uncertainty, but they do not overturn the need to map the observed nontraversable segment before choosing treatment. Exact pediatric guidance was not re-verified offline; this editorial PASS is not clinical approval."
        ],
        "suggestions": [
          "No mandatory revision identified. Preserve the distinction between the earlier ultrathin examination and the current standard-scope limitation, the post-recovery timing, and the explanation's restraint about the mechanism of narrowing.",
          "If the author later relies more strongly on continuing histologic remission to exclude repeat biopsies, supply relevant treatment continuity and chronology instead of assuming that an earlier response remains current. Do not invent a numeric interval or add a conclusion that gives away the next investigation.",
          "Keep the difficulty label moderate. Greater difficulty would require a genuinely closer supported competing investigation, not removal of the scope-stop finding or addition of obscure pediatric thresholds."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.i24.battery-injury-imaging.20261112.v1",
    "caseId": "case.intraop.i24.battery-injury-record.20261112.v1",
    "questionVariantId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "sourceCaseExport": "I24_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.i24.battery-injury-imaging.20261112.v1\",\"conceptId\":\"concept.intraop.i24.battery-injury-imaging.20261112.v1\",\"stem\":\"Which investigation was most appropriate next after removal of {patientName}'s esophageal battery at this hospital checkpoint?\",\"explanation\":\"The depressed slough-covered ulcer at an arch-level battery site raises concern beyond a superficial luminal abrasion. Endoscopy cannot establish the surrounding tissue and vascular relationship. CTA is the best offered initial study for that question despite stable circulation and no active bleeding. An esophagram addresses leakage; catheter angiography may belong to a coordinated vascular rescue setting. This is not a universal CTA rule for every battery removal.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.i24.battery-injury-assessment.20261112.v1\",\"claim.intraop.i24.battery-cross-sectional.20261112.v1\",\"claim.intraop.i24.battery-swallow-role.20261112.v1\",\"claim.intraop.i24.battery-observation.20261112.v1\",\"claim.intraop.i24.battery-catheter-angiography.20261112.v1\"],\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed hospital endoscopy and anesthesia record\",\"items\":[{\"label\":\"Removal site\",\"value\":\"Mid-esophagus at the level of the aortic arch\"},{\"label\":\"Post-removal view\",\"value\":\"Depressed ulcer base with adherent gray slough and an irregular ulcerated mucosal margin\"},{\"label\":\"Bleeding\",\"value\":\"No active hemorrhage in the field\"},{\"label\":\"Anesthesia course\",\"value\":\"Blood pressure remained stable; circulatory support was not increased\"}]},\"answerChoices\":[{\"id\":\"choice.intraop.i24.battery-injury-imaging.cta.20261112.v1\",\"label\":\"Computed tomographic chest angiography\",\"isCorrect\":true,\"rationale\":\"The location and depth raise concern for injury near major vessels despite stable circulation. Cross-sectional vascular imaging assesses the relationship that an intraluminal view cannot define.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1\",\"label\":\"Water-soluble contrast esophagography\",\"isCorrect\":false,\"rationale\":\"A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.\",\"distractorRationale\":\"A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.\"},{\"id\":\"choice.intraop.i24.battery-injury-imaging.egd.20261112.v1\",\"label\":\"Catheter-based thoracic aortography\",\"isCorrect\":false,\"rationale\":\"Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.\",\"distractorRationale\":\"Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.i24.battery-injury-imaging.20261112.v1\",\"primaryConceptId\":\"concept.intraop.i24.battery-injury-imaging.20261112.v1\",\"questionVariantId\":\"question.intraop.i24.battery-injury-imaging.20261112.v1\",\"stem\":\"Which investigation was most appropriate next after removal of {patientName}'s esophageal battery at this hospital checkpoint?\",\"currentUpdate\":\"The following constructed findings were recorded immediately after hospital removal of {patientName}'s esophageal button battery.\",\"shuffleAnswers\":true,\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed hospital endoscopy and anesthesia record\",\"items\":[{\"label\":\"Removal site\",\"value\":\"Mid-esophagus at the level of the aortic arch\"},{\"label\":\"Post-removal view\",\"value\":\"Depressed ulcer base with adherent gray slough and an irregular ulcerated mucosal margin\"},{\"label\":\"Bleeding\",\"value\":\"No active hemorrhage in the field\"},{\"label\":\"Anesthesia course\",\"value\":\"Blood pressure remained stable; circulatory support was not increased\"}]},\"answerChoices\":[{\"id\":\"choice.intraop.i24.battery-injury-imaging.cta.20261112.v1\",\"label\":\"Computed tomographic chest angiography\",\"isCorrect\":true,\"rationale\":\"The location and depth raise concern for injury near major vessels despite stable circulation. Cross-sectional vascular imaging assesses the relationship that an intraluminal view cannot define.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1\",\"label\":\"Water-soluble contrast esophagography\",\"isCorrect\":false,\"rationale\":\"A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i24.battery-injury-imaging.egd.20261112.v1\",\"label\":\"Catheter-based thoracic aortography\",\"isCorrect\":false,\"rationale\":\"Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.\",\"serviceRequest\":null}],\"explanation\":\"The depressed slough-covered ulcer at an arch-level battery site raises concern beyond a superficial luminal abrasion. Endoscopy cannot establish the surrounding tissue and vascular relationship. CTA is the best offered initial study for that question despite stable circulation and no active bleeding. An esophagram addresses leakage; catheter angiography may belong to a coordinated vascular rescue setting. This is not a universal CTA rule for every battery removal.\",\"sourceLabels\":[\"Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee\",\"Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood\",\"Management of Foreign Body Ingestion in Children\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recommendation and rationale. This authored choice does not execute a test or intervention or simulate an adverse patient outcome.\",\"clinicalRationale\":\"A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.\",\"sourceLabels\":[\"Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee\",\"Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood\",\"Management of Foreign Body Ingestion in Children\"]},{\"answerChoiceId\":\"choice.intraop.i24.battery-injury-imaging.egd.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recommendation and rationale. This authored choice does not execute a test or intervention or simulate an adverse patient outcome.\",\"clinicalRationale\":\"Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.\",\"sourceLabels\":[\"Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee\",\"Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood\",\"Management of Foreign Body Ingestion in Children\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.i24.battery-injury-record.20261112.v1\",\"displayName\":\"Battery procedure review\",\"patientDisplayName\":\"Leah Morgan\",\"patientPresentationVariantId\":\"presentation.intraop.i24.battery-injury-record.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":6,\"sexLabel\":\"Female\"},\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"chiefComplaint\":\"Battery procedure review\",\"presentation\":\"{patientName}, a 6-year-old girl, attends clinic with her mother, Elena Morgan, after hospital treatment of a swallowed button battery. They review the outside endoscopy report and anesthesia record at the checkpoint immediately after removal. The hospital procedure and imaging are historical records.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.i24.battery-injury-record.20261112.v1\",\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"prototypeDemographics\":{\"ageYears\":6,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Battery procedure review\",\"presentation\":\"{patientName}, a 6-year-old girl, attends clinic with her mother, Elena Morgan, after hospital treatment of a swallowed button battery. They review the outside endoscopy report and anesthesia record at the checkpoint immediately after removal. The hospital procedure and imaging are historical records.\"}],\"releasePointId\":\"release.l4.pediatrics\",\"earliestFacilityStage\":4,\"tutorialEligible\":false,\"routineEligible\":false,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[\"capability.pediatric_examination\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee\",\"Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood\",\"Management of Foreign Body Ingestion in Children\"],\"decisionNodes\":[{\"id\":\"node.intraop.i24.battery-injury-imaging.20261112.v1\",\"primaryConceptId\":\"concept.intraop.i24.battery-injury-imaging.20261112.v1\",\"questionVariantId\":\"question.intraop.i24.battery-injury-imaging.20261112.v1\",\"stem\":\"Which investigation was most appropriate next after removal of {patientName}'s esophageal battery at this hospital checkpoint?\",\"currentUpdate\":\"The following constructed findings were recorded immediately after hospital removal of {patientName}'s esophageal button battery.\",\"shuffleAnswers\":true,\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed hospital endoscopy and anesthesia record\",\"items\":[{\"label\":\"Removal site\",\"value\":\"Mid-esophagus at the level of the aortic arch\"},{\"label\":\"Post-removal view\",\"value\":\"Depressed ulcer base with adherent gray slough and an irregular ulcerated mucosal margin\"},{\"label\":\"Bleeding\",\"value\":\"No active hemorrhage in the field\"},{\"label\":\"Anesthesia course\",\"value\":\"Blood pressure remained stable; circulatory support was not increased\"}]},\"answerChoices\":[{\"id\":\"choice.intraop.i24.battery-injury-imaging.cta.20261112.v1\",\"label\":\"Computed tomographic chest angiography\",\"isCorrect\":true,\"rationale\":\"The location and depth raise concern for injury near major vessels despite stable circulation. Cross-sectional vascular imaging assesses the relationship that an intraluminal view cannot define.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1\",\"label\":\"Water-soluble contrast esophagography\",\"isCorrect\":false,\"rationale\":\"A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i24.battery-injury-imaging.egd.20261112.v1\",\"label\":\"Catheter-based thoracic aortography\",\"isCorrect\":false,\"rationale\":\"Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.\",\"serviceRequest\":null}],\"explanation\":\"The depressed slough-covered ulcer at an arch-level battery site raises concern beyond a superficial luminal abrasion. Endoscopy cannot establish the surrounding tissue and vascular relationship. CTA is the best offered initial study for that question despite stable circulation and no active bleeding. An esophagram addresses leakage; catheter angiography may belong to a coordinated vascular rescue setting. This is not a universal CTA rule for every battery removal.\",\"sourceLabels\":[\"Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee\",\"Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood\",\"Management of Foreign Body Ingestion in Children\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recommendation and rationale. This authored choice does not execute a test or intervention or simulate an adverse patient outcome.\",\"clinicalRationale\":\"A contrast swallow can evaluate a leak before oral intake, but does not establish the relationship between this deep injury and the adjacent vessels. It answers a different part of the assessment.\",\"sourceLabels\":[\"Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee\",\"Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood\",\"Management of Foreign Body Ingestion in Children\"]},{\"answerChoiceId\":\"choice.intraop.i24.battery-injury-imaging.egd.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recommendation and rationale. This authored choice does not execute a test or intervention or simulate an adverse patient outcome.\",\"clinicalRationale\":\"Catheter-based aortic assessment may be part of coordinated management when severe bleeding or a suspected vascular fistula requires a hybrid procedural response. Here the initial question is the relation of the injury to surrounding tissue in a stable recorded child; CTA is the best offered initial survey. Exact priority requires pediatric GI/radiology review.\",\"sourceLabels\":[\"Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee\",\"Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood\",\"Management of Foreign Body Ingestion in Children\"]}]}],\"learningSummary\":\"The depressed slough-covered ulcer at an arch-level battery site raises concern beyond a superficial luminal abrasion. Endoscopy cannot establish the surrounding tissue and vascular relationship. CTA is the best offered initial study for that question despite stable circulation and no active bleeding. An esophagram addresses leakage; catheter angiography may belong to a coordinated vascular rescue setting. This is not a universal CTA rule for every battery removal.\"}",
    "sourceQuestionSha256": "d37b87a18e46125fcca2b22014c7b428a23d87dd2424eb7b3a57a99eb01dd879",
    "sourceNodeSha256": "2a8b0b4b9037985b5b3f5a5dc799a13359a590716b9d2ab16ea08a1387be1a84",
    "sourceCaseSha256": "1a6f789b1a81c27bf7933c7b2b631c49385486bf465aac2f2751a177ffb04750",
    "acceptedQuestionSha256": "d37b87a18e46125fcca2b22014c7b428a23d87dd2424eb7b3a57a99eb01dd879",
    "acceptedNodeSha256": "2a8b0b4b9037985b5b3f5a5dc799a13359a590716b9d2ab16ea08a1387be1a84",
    "acceptedCaseSha256": "3f4e618e34bdff958cd0593200abde27b999aa0ca6f9ef5c85a6e0d3e3c9184b",
    "review": {
      "path": "docs/research/question-intraop-pediatric-endoscopy-foreign-body-review2-20261112.json",
      "record": {
        "id": "question.intraop.i24.battery-injury-imaging.20261112.v1",
        "nodeId": "node.intraop.i24.battery-injury-imaging.20261112.v1",
        "title": "Leah Morgan: Post-removal battery injury imaging",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Reviewed the current v1.r1 presentation, update, constructed exhibit, task, option labels and explanation. The displayed key position and author self-assessment were not evidence for this verdict.",
          "CTA is the single best offered next investigation on the supplied facts. The arch-level slough-covered ulcer raises concern about injury extending toward major vessels; the learner must then distinguish cross-sectional assessment from luminal leak assessment and invasive vascular assessment. Stable circulation and absence of current hemorrhage do not establish that the surrounding tissue is safe.",
          "Esophagography is a credible neighboring investigation, but it does not answer the immediate periesophageal/vascular question. Catheter aortography is a credible vascular alternative whose initial priority is weaker in this stable, nonbleeding checkpoint. The explanation appropriately limits the conclusion to this offered set rather than teaching CTA after every battery removal.",
          "The ulcer description supports concern, not a measured depth or proven vascular fistula. No confident clinical inaccuracy was identified in the visible explanation. Pediatric GI/radiology confirmation of exact investigation priority remains necessary; this offline review did not independently verify source currency or establish clinical approval.",
          "The two consequential steps are recognizing why the ulcer's location and appearance warrant assessment beyond the lumen, then choosing the initial modality using the recorded circulatory course. The absence of bleeding could tempt premature reassurance; the esophagram could tempt a leak-focused assessment. This is moderate rather than hard resident reasoning and addresses a high-yield ingestion complication.",
          "The phrase 'at the level of the aortic arch' is necessary anatomical evidence, not a unique lexical match to the key: the aortography distractor shares the vascular target. 'No active hemorrhage in the field' and 'circulatory support was not increased' provide legitimate ranking information. Labels have comparable length and specificity, with no explanatory qualifier, absolute, convergence pattern or uniquely comprehensive key. A nonmedical wording attack does not select CTA.",
          "The named six-year-old girl and mother are present in clinic. The procedure is explicitly an outside hospital record reviewed immediately after removal, so this does not place emergency battery care or vascular rescue in an ambulatory center. The short complaint, separate task and historical checkpoint are coherent. The constructed text record supplies the findings without promising an absent endoscopic image. This is a standalone node with no preceding answer scaffold.",
          "PASS is an editorial judgment of the visible candidate only. It does not validate runtime wait previews, rendered exhibits, admission rules, source provenance or clinical sign-off; the draft remains needs_clinician_review. No fixed testing duration appears in the reviewed prose."
        ],
        "suggestions": [
          "Preserve the anatomical site, observed ulcer appearance and circulatory trajectory. Do not replace them with a vascular-injury diagnosis or a lead-in that announces the imaging target; those changes would supply the inference.",
          "Scope note for this report: only the two records marked ready_for_independent_review are scored. The coin-device and smooth-object-device candidates are parked. Magnet-injury-escalation is explicitly held_for_explicit_easier_rule_purpose_acceptance, despite also appearing in offeredItems and the offered case export; it is excluded under the user's instruction to note, but not review, held records. The unchanged adult bone-film item and historical held/parked adult extraluminal-operation records are also excluded. Their prior verdicts and acceptance states are not reassessed here."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "sourceCaseExport": "INTRAOP_I06_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.intraop.thyroid-nerve-monitoring.2026-11-12.revision1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.thyroid-nerve-monitoring.proximal-verification.v1\",\"conceptId\":\"concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1\",\"stem\":\"At {patientName}'s recorded thyroidectomy pause after left lobectomy, which next plan best fits the monitoring record?\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed entries from the operative record and monitor printout\",\"items\":[{\"label\":\"Before left-lobe dissection\",\"value\":\"Left vagus stimulation: EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"After left lobectomy, distal check\",\"value\":\"Left recurrent nerve at its laryngeal entry: EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"Postresection entry B, monitor heading\",\"value\":\"L-V2: response present.\"},{\"label\":\"Postresection entry B, stimulation log\",\"value\":\"Probe on vagus in the right carotid sheath: EMG waveform and right laryngeal contraction present.\"}]},\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.1\",\"label\":\"Obtain operated-side vagal responses to determine further resection\",\"isCorrect\":true,\"rationale\":\"The positive postresection entry comes from the right side. A true left proximal assessment is needed before treating the operated pathway as functional or impaired.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.2\",\"label\":\"Complete right lobectomy using continuous recurrent-nerve monitoring\",\"isCorrect\":false,\"rationale\":\"The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.\",\"distractorRationale\":\"The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.\"},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.3\",\"label\":\"Stage right lobectomy pending postoperative flexible laryngoscopy\",\"isCorrect\":false,\"rationale\":\"Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.\",\"distractorRationale\":\"Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.\"}],\"shuffleAnswers\":true,\"explanation\":\"Entry B documents the unoperated right vagus despite its left-sided heading. That response and a distal left response do not verify the whole operated pathway. Obtain a valid left proximal assessment before choosing completion or staging; the site discrepancy is not itself proof of nerve injury.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.thyroid.whole-path\",\"claim.intraop.thyroid.distal-bypass\",\"claim.intraop.thyroid.verified-ipsilateral\",\"claim.intraop.thyroid.defer-contralateral\",\"claim.intraop.thyroid.reassess-recovery\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.thyroid-nerve-monitoring.proximal-verification.v1\",\"questionVariantId\":\"question.intraop.thyroid-nerve-monitoring.proximal-verification.v1\",\"primaryConceptId\":\"concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1\",\"stem\":\"At {patientName}'s recorded thyroidectomy pause after left lobectomy, which next plan best fits the monitoring record?\",\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.1\",\"label\":\"Obtain operated-side vagal responses to determine further resection\",\"isCorrect\":true,\"rationale\":\"The positive postresection entry comes from the right side. A true left proximal assessment is needed before treating the operated pathway as functional or impaired.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.2\",\"label\":\"Complete right lobectomy using continuous recurrent-nerve monitoring\",\"isCorrect\":false,\"rationale\":\"The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.3\",\"label\":\"Stage right lobectomy pending postoperative flexible laryngoscopy\",\"isCorrect\":false,\"rationale\":\"Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Entry B documents the unoperated right vagus despite its left-sided heading. That response and a distal left response do not verify the whole operated pathway. Obtain a valid left proximal assessment before choosing completion or staging; the site discrepancy is not itself proof of nerve injury.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed entries from the operative record and monitor printout\",\"items\":[{\"label\":\"Before left-lobe dissection\",\"value\":\"Left vagus stimulation: EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"After left lobectomy, distal check\",\"value\":\"Left recurrent nerve at its laryngeal entry: EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"Postresection entry B, monitor heading\",\"value\":\"L-V2: response present.\"},{\"label\":\"Postresection entry B, stimulation log\",\"value\":\"Probe on vagus in the right carotid sheath: EMG waveform and right laryngeal contraction present.\"}]},\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]},{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1\",\"displayName\":\"Clinic operative-record review: Daniel Brooks\",\"patientPresentationVariantId\":\"presentation.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1\",\"releasePointId\":\"release.l0.clinic_evaluation\",\"patientDisplayName\":\"Daniel Brooks\",\"prototypeDemographics\":{\"ageYears\":62,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Thyroid operation review\",\"presentation\":\"{patientName}, a 62-year-old man, is in clinic reviewing an outside hospital thyroidectomy record for papillary cancers in both lobes. Both vocal folds moved normally before surgery. At the pause after left lobectomy, the operative summary records a positive first-side motor check. Right-lobe dissection has not begun.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1\",\"prototypeDemographics\":{\"ageYears\":62,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Thyroid operation review\",\"presentation\":\"{patientName}, a 62-year-old man, is in clinic reviewing an outside hospital thyroidectomy record for papillary cancers in both lobes. Both vocal folds moved normally before surgery. At the pause after left lobectomy, the operative summary records a positive first-side motor check. Right-lobe dissection has not begun.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"decisionNodes\":[{\"id\":\"node.intraop.thyroid-nerve-monitoring.proximal-verification.v1\",\"questionVariantId\":\"question.intraop.thyroid-nerve-monitoring.proximal-verification.v1\",\"primaryConceptId\":\"concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1\",\"stem\":\"At {patientName}'s recorded thyroidectomy pause after left lobectomy, which next plan best fits the monitoring record?\",\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.1\",\"label\":\"Obtain operated-side vagal responses to determine further resection\",\"isCorrect\":true,\"rationale\":\"The positive postresection entry comes from the right side. A true left proximal assessment is needed before treating the operated pathway as functional or impaired.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.2\",\"label\":\"Complete right lobectomy using continuous recurrent-nerve monitoring\",\"isCorrect\":false,\"rationale\":\"The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.3\",\"label\":\"Stage right lobectomy pending postoperative flexible laryngoscopy\",\"isCorrect\":false,\"rationale\":\"Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Entry B documents the unoperated right vagus despite its left-sided heading. That response and a distal left response do not verify the whole operated pathway. Obtain a valid left proximal assessment before choosing completion or staging; the site discrepancy is not itself proof of nerve injury.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed entries from the operative record and monitor printout\",\"items\":[{\"label\":\"Before left-lobe dissection\",\"value\":\"Left vagus stimulation: EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"After left lobectomy, distal check\",\"value\":\"Left recurrent nerve at its laryngeal entry: EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"Postresection entry B, monitor heading\",\"value\":\"L-V2: response present.\"},{\"label\":\"Postresection entry B, stimulation log\",\"value\":\"Probe on vagus in the right carotid sheath: EMG waveform and right laryngeal contraction present.\"}]},\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"The summary and heading appear reassuring, but the documented right response does not establish left proximal conduction. The distal left check cannot supply that information.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]},{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.proximal-verification.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"Deferral is appropriate for a verified first-side deficit, but this record has not demonstrated one. Establish the left proximal response before declaring functional loss.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]}]}],\"learningSummary\":\"Entry B documents the unoperated right vagus despite its left-sided heading. That response and a distal left response do not verify the whole operated pathway. Obtain a valid left proximal assessment before choosing completion or staging; the site discrepancy is not itself proof of nerve injury.\"}",
    "sourceQuestionSha256": "0df26fd49ed88c71edc640aaea9a0c0737958ee849e96533a9534f89eb300053",
    "sourceNodeSha256": "317a75863248209c38d09b4aa6afe8b51e04d0f1ab7ffbc69d8bb9d49afcabd1",
    "sourceCaseSha256": "b3ece637897b9913a10bdde05c1dfb3b0b8fc49f287b9fe5f322f9dfab58b004",
    "acceptedQuestionSha256": "0df26fd49ed88c71edc640aaea9a0c0737958ee849e96533a9534f89eb300053",
    "acceptedNodeSha256": "317a75863248209c38d09b4aa6afe8b51e04d0f1ab7ffbc69d8bb9d49afcabd1",
    "acceptedCaseSha256": "678e12444baed1785ae036c1dea0318322ca48638ef39177e36e92de7c181a8d",
    "review": {
      "path": "docs/research/question-intraop-thyroid-nerve-monitoring-review2-20261112.json",
      "record": {
        "id": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
        "nodeId": "node.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
        "title": "Daniel Brooks: verify the operated pathway after a mislabeled monitoring entry",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [
          "Minor, nonblocking notation issue: 'L-V2' is not expanded. The first-side summary, matched entry B labels and explicit right-sided stimulation log still make the discrepancy interpretable, so familiarity with the abbreviation is not necessary to choose the key. A neutral expansion would improve accessibility."
        ],
        "cues": [
          {
            "phrase": "Obtain operated-side vagal responses to determine further resection",
            "why": "The purpose clause 'to determine further resection' makes this option sound procedurally prudent, whereas the other two commit to an extent plan. This is a minor stylistic advantage. Here an actual unresolved site discrepancy justifies comparing verification with completion/staging, and both continuing and staging are concrete alternatives; the key is not selected merely by an unsupported request for more information."
          }
        ],
        "fairness": [
          "Reviewed the current revision1 presentation and node content, not the archived earlier version. A positive heading conflicts with the actual stimulation site recorded for the same entry. The separate left response was obtained at laryngeal entry, so it cannot substitute for verification of the entire operated recurrent pathway.",
          "Obtaining a valid operated-side vagal assessment is the best next plan. Proceeding to right lobectomy treats unresolved left proximal function as established; committing to staging treats an unresolved recording discrepancy as if a functional deficit were demonstrated. Neither inference is supported by the currently visible observations.",
          "The heading and log conflict does not prove which documentation field was mistyped, nor prove nerve injury. The keyed verification step remains appropriate without assuming certainty about the error's origin. The explanation reasonably follows the explicit probe-location observation, but clinical teaching should remain that the left pathway is unverified, not that a mislabeled heading diagnoses injury.",
          "Two steps are required: reconcile what structure the positive recorded response actually assesses, including the limited reach of the separate distal-left response, then choose verification before an operative-extent commitment. Merely detecting a left/right discrepancy is insufficient to explain why the positive distal-left result cannot clear the operation.",
          "The actual discrepancy earns the investigation-versus-treatment comparison. Removing the exhibit leaves a reassuring first-side summary and no reason to select verification specifically. Replacing the disputed entry with an adequate, clearly documented postresection left vagal response would make completion plausible; a verified persistent left proximal deficit would make staging plausible.",
          "The 62-year-old man, completed left lobectomy and untouched right lobe are consistent throughout. This is a plausible clinic review of hospital monitoring documentation, not a claim of ambulatory thyroid capability. The task explicitly anchors the decision at the recorded pause; the choices are interpreted as what should happen at that historical point, not as orders to stimulate a nerve in today's clinic. No parent or pediatric rule applies.",
          "Standalone node: no earlier feedback is needed or shown. The task names the patient, procedure and completed side, and the exhibit supplies both the pre-dissection baseline and the postresection acquisitions. The explanation does not overstate a discrepancy as proof of injury or predict permanent dysfunction.",
          "Moderate rather than hard: the conspicuous side mismatch assists error detection, but the limited meaning of a distal response and the choice between verification and staging require surgical knowledge. High-yield judgment attaches to first-side functional verification before contralateral thyroid surgery; exact monitor-label trivia is not itself the high-yield objective. No confident clinical inaccuracy identified, and examination frequency was not externally verified."
        ],
        "suggestions": [
          "No mandatory repair for editorial PASS. In a separately versioned polish, expand the heading neutrally to 'L-V2 (left vagus, postresection): response present' without adding a warning that it conflicts with the log.",
          "Optional polish: shorten the key to 'Obtain operated-side vagal responses before further resection' to remove the explanatory purpose clause while retaining the same clinical action. Preserve the exact accepted version if no new version is authorized.",
          "Keep the distal-left acquisition and matched entry identity explicit; neither a generic 'monitoring discrepancy' summary nor a stated diagnosis of nerve injury would preserve the current reasoning task."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "sourceCaseExport": "INTRAOP_I06_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"conceptId\":\"concept.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"stem\":\"At the first recorded thyroidectomy checkpoint, which check should have been prioritized for {patientName}'s monitoring findings?\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative-record observations: checkpoint 1\",\"items\":[{\"label\":\"Before dissection\",\"value\":\"Either vagus stimulus produced a recorded EMG waveform and a palpable laryngeal contraction.\"},{\"label\":\"Current left vagus stimulus\",\"value\":\"Laryngeal contraction remains palpable; EMG waveform is absent.\"},{\"label\":\"Current right vagus stimulus\",\"value\":\"Laryngeal contraction remains palpable; EMG waveform is absent.\"}]},\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.1\",\"label\":\"Check tube position and electrode contact\",\"isCorrect\":true,\"rationale\":\"The motor response persists on both sides; the missing recorded response directs the first check to electrode contact.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.2\",\"label\":\"Check neuromuscular recovery with quantitative twitch monitoring\",\"isCorrect\":false,\"rationale\":\"Residual blockade can affect EMG, but preserved bilateral laryngeal contraction makes recording contact the better first target here.\",\"distractorRationale\":\"Residual blockade can affect EMG, but preserved bilateral laryngeal contraction makes recording contact the better first target here.\"},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.3\",\"label\":\"Check stimulus delivery with a replacement probe\",\"isCorrect\":false,\"rationale\":\"The palpable contraction shows the stimulus is reaching muscle; replacing the stimulating probe is less directed than checking acquisition.\",\"distractorRationale\":\"The palpable contraction shows the stimulus is reaching muscle; replacing the stimulating probe is less directed than checking acquisition.\"}],\"shuffleAnswers\":true,\"explanation\":\"Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.thyroid.electrode-contact\",\"claim.intraop.thyroid.twitch-recording\",\"claim.intraop.thyroid.stimulus-reaches-muscle\",\"claim.intraop.thyroid.blockade\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"questionVariantId\":\"question.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"primaryConceptId\":\"concept.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"stem\":\"At the first recorded thyroidectomy checkpoint, which check should have been prioritized for {patientName}'s monitoring findings?\",\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.1\",\"label\":\"Check tube position and electrode contact\",\"isCorrect\":true,\"rationale\":\"The motor response persists on both sides; the missing recorded response directs the first check to electrode contact.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.2\",\"label\":\"Check neuromuscular recovery with quantitative twitch monitoring\",\"isCorrect\":false,\"rationale\":\"Residual blockade can affect EMG, but preserved bilateral laryngeal contraction makes recording contact the better first target here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.3\",\"label\":\"Check stimulus delivery with a replacement probe\",\"isCorrect\":false,\"rationale\":\"The palpable contraction shows the stimulus is reaching muscle; replacing the stimulating probe is less directed than checking acquisition.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative-record observations: checkpoint 1\",\"items\":[{\"label\":\"Before dissection\",\"value\":\"Either vagus stimulus produced a recorded EMG waveform and a palpable laryngeal contraction.\"},{\"label\":\"Current left vagus stimulus\",\"value\":\"Laryngeal contraction remains palpable; EMG waveform is absent.\"},{\"label\":\"Current right vagus stimulus\",\"value\":\"Laryngeal contraction remains palpable; EMG waveform is absent.\"}]},\"sourceLabels\":[\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"resultGateAfter\":null,\"terminalDispositions\":[]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.thyroid-nerve-monitoring.two-signal-events.v1\",\"displayName\":\"Clinic operative-record review: Clara Bennett\",\"patientPresentationVariantId\":\"presentation.intraop.thyroid-nerve-monitoring.two-signal-events.v1\",\"releasePointId\":\"release.l0.clinic_evaluation\",\"patientDisplayName\":\"Clara Bennett\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Thyroid surgery review\",\"presentation\":\"{patientName}, a 49-year-old woman, is in clinic reviewing outside hospital operative and anesthesia records from a planned total thyroidectomy for papillary cancers in both lobes. Imaging showed each lesion confined to the thyroid and no abnormal neck lymph nodes; both vocal folds moved normally before surgery. At the first recorded checkpoint, left-lobe dissection is underway.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.thyroid-nerve-monitoring.two-signal-events.v1\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Thyroid surgery review\",\"presentation\":\"{patientName}, a 49-year-old woman, is in clinic reviewing outside hospital operative and anesthesia records from a planned total thyroidectomy for papillary cancers in both lobes. Imaging showed each lesion confined to the thyroid and no abnormal neck lymph nodes; both vocal folds moved normally before surgery. At the first recorded checkpoint, left-lobe dissection is underway.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"decisionNodes\":[{\"id\":\"node.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"questionVariantId\":\"question.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"primaryConceptId\":\"concept.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"stem\":\"At the first recorded thyroidectomy checkpoint, which check should have been prioritized for {patientName}'s monitoring findings?\",\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.1\",\"label\":\"Check tube position and electrode contact\",\"isCorrect\":true,\"rationale\":\"The motor response persists on both sides; the missing recorded response directs the first check to electrode contact.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.2\",\"label\":\"Check neuromuscular recovery with quantitative twitch monitoring\",\"isCorrect\":false,\"rationale\":\"Residual blockade can affect EMG, but preserved bilateral laryngeal contraction makes recording contact the better first target here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.3\",\"label\":\"Check stimulus delivery with a replacement probe\",\"isCorrect\":false,\"rationale\":\"The palpable contraction shows the stimulus is reaching muscle; replacing the stimulating probe is less directed than checking acquisition.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative-record observations: checkpoint 1\",\"items\":[{\"label\":\"Before dissection\",\"value\":\"Either vagus stimulus produced a recorded EMG waveform and a palpable laryngeal contraction.\"},{\"label\":\"Current left vagus stimulus\",\"value\":\"Laryngeal contraction remains palpable; EMG waveform is absent.\"},{\"label\":\"Current right vagus stimulus\",\"value\":\"Laryngeal contraction remains palpable; EMG waveform is absent.\"}]},\"sourceLabels\":[\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"questionVariantId\":\"question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"primaryConceptId\":\"concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"currentUpdate\":\"The next record entry documents correction of tube rotation and return of both waveforms. After left lobectomy, the new findings below persist after release of traction and repeat technical checks. The left recurrent nerve appears continuous. Right-lobe dissection has not begun.\",\"stem\":\"At the second recorded checkpoint after left lobectomy, which plan was most appropriate for {patientName}'s remaining thyroid surgery?\",\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.1\",\"label\":\"Defer contralateral lobectomy pending functional reassessment\",\"isCorrect\":true,\"rationale\":\"The distal response can bypass a proximal conduction problem. In this noninvasive cancer setting, defer right resection and reassess left laryngeal function.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2\",\"label\":\"Complete right lobectomy using continuous nerve monitoring\",\"isCorrect\":false,\"rationale\":\"Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3\",\"label\":\"Exchange the electrode tube before completing right lobectomy\",\"isCorrect\":false,\"rationale\":\"Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative-record observations: checkpoint 2\",\"items\":[{\"label\":\"Left recurrent nerve at laryngeal entry\",\"value\":\"EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"Left recurrent nerve in lower neck\",\"value\":\"EMG waveform and palpable laryngeal contraction absent.\"},{\"label\":\"Left vagus stimulus\",\"value\":\"EMG waveform and palpable laryngeal contraction absent.\"},{\"label\":\"Right vagus stimulus\",\"value\":\"EMG waveform and palpable laryngeal contraction present.\"}]},\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]},{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]}]}],\"learningSummary\":\"Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury. The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.\"}",
    "sourceQuestionSha256": "61919ab53acb3ae9f92818b9d2b68df86347a0f05060ad1fb8efcacfbec17c7f",
    "sourceNodeSha256": "8537bc54f8d2de20aa1c338fe4ebbd12c83ef76b29dd57c1cdf5da1061b5d6eb",
    "sourceCaseSha256": "21440bc2c08af8de36ec7080a874a51965afffdbf999a7a2f1a160eeb9c5900c",
    "acceptedQuestionSha256": "61919ab53acb3ae9f92818b9d2b68df86347a0f05060ad1fb8efcacfbec17c7f",
    "acceptedNodeSha256": "8537bc54f8d2de20aa1c338fe4ebbd12c83ef76b29dd57c1cdf5da1061b5d6eb",
    "acceptedCaseSha256": "53af779615f00161287215746e2995fef09808ede79d433f6ead30e27f7299b2",
    "review": {
      "path": "docs/research/question-intraop-thyroid-nerve-monitoring-review2-20261112.json",
      "record": {
        "id": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
        "nodeId": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
        "title": "Clara Bennett: absent recorded signals with preserved motor responses",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Scope: independently reviewed all three current proposedNodes using their candidate presentation, update, exhibit, task, options and explanation. The packet's 19 kept records and four held planning records are noted but not rescored; archived versions and author self-assessments do not establish a verdict. This row concerns the current v1 candidate.",
          "One best offered check: bilateral stimulation-associated palpable contractions with absent recorded waveforms direct attention to recording acquisition. Checking tube position/electrode contact addresses that discrepancy. The findings do not prove tube rotation specifically, and the key appropriately asks for a check rather than declaring that diagnosis.",
          "Quantitative neuromuscular assessment is a real troubleshooting consideration, but preserved contractions make recording contact the better first target among these choices. Probe replacement is less directed when stimulation demonstrably produces a physical response. The item need not claim that partial blockade is impossible to rank these checks.",
          "Two consequential steps are present: distinguish a missing recording from a missing motor response, then select which part of the monitoring system to investigate. The absent-waveform/physical-response distinction, not the number of exhibit rows, supplies the reasoning. Removing the physical-response observations makes the choice materially less determinate.",
          "The three checks have parallel grammar and comparable specificity. No diagnosis label, unique task-word overlap, absolute, explanatory distractor or component-convergence shortcut identifies the key. The contraction findings are necessary clinical discriminators, not dispensable option-eliminating prose.",
          "The specific 49-year-old woman is reviewing hospital records in clinic; left-lobe dissection is the clearly identified historical decision point. This does not imply thyroidectomy capability in the clinic ASC. The bilateral stimulation observations are plausible monitoring observations, and a constructed text exhibit is sufficient because waveform morphology is not being tested. No pediatric constraint applies.",
          "The subsequent correction and restored signals make the transition to the second event coherent. This node's explanation teaches recording troubleshooting without supplying the later operative-extent answer or the proximal/distal localization rule.",
          "Moderate resident application, not a stretch item: the anesthetic alternative is more credible than probe replacement once the contractions are interpreted. High-yield judgment refers to distinguishing false signal loss from nerve dysfunction during thyroid surgery, not to a verified frequency of specific monitoring questions on ABSITE.",
          "Offline review limitation applying to this report: no external sources were retrieved or independently reverified, no numerical threshold or recovery interval is proposed, and no confident clinical inaccuracy was identified in the offered wording. PASS is editorial only; all candidates remain needs_clinician_review pending Melissa Rowland's exact-version sign-off. Rendered answer randomization and wait previews were not tested by this text-only review."
        ],
        "suggestions": [
          "No required editorial repair. Preserve the question as a prioritization of checks rather than changing it into a definitive diagnosis of tube malposition.",
          "Retain estimates for all three testing alternatives when integrated; do not introduce fixed waits into the vignette. Runtime presentation remains a separate integration check."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "sourceCaseExport": "INTRAOP_I06_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"conceptId\":\"concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"stem\":\"At the second recorded checkpoint after left lobectomy, which plan was most appropriate for {patientName}'s remaining thyroid surgery?\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative-record observations: checkpoint 2\",\"items\":[{\"label\":\"Left recurrent nerve at laryngeal entry\",\"value\":\"EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"Left recurrent nerve in lower neck\",\"value\":\"EMG waveform and palpable laryngeal contraction absent.\"},{\"label\":\"Left vagus stimulus\",\"value\":\"EMG waveform and palpable laryngeal contraction absent.\"},{\"label\":\"Right vagus stimulus\",\"value\":\"EMG waveform and palpable laryngeal contraction present.\"}]},\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.1\",\"label\":\"Defer contralateral lobectomy pending functional reassessment\",\"isCorrect\":true,\"rationale\":\"The distal response can bypass a proximal conduction problem. In this noninvasive cancer setting, defer right resection and reassess left laryngeal function.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2\",\"label\":\"Complete right lobectomy using continuous nerve monitoring\",\"isCorrect\":false,\"rationale\":\"Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.\",\"distractorRationale\":\"Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.\"},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3\",\"label\":\"Exchange the electrode tube before completing right lobectomy\",\"isCorrect\":false,\"rationale\":\"Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.\",\"distractorRationale\":\"Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.\"}],\"shuffleAnswers\":true,\"explanation\":\"The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.thyroid.visual-continuity\",\"claim.intraop.thyroid.distal-bypass\",\"claim.intraop.thyroid.verified-ipsilateral\",\"claim.intraop.thyroid.defer-contralateral\",\"claim.intraop.thyroid.no-permanence\",\"claim.intraop.thyroid.reassess-recovery\",\"claim.intraop.thyroid.electrode-contact\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"questionVariantId\":\"question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"primaryConceptId\":\"concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"currentUpdate\":\"The next record entry documents correction of tube rotation and return of both waveforms. After left lobectomy, the new findings below persist after release of traction and repeat technical checks. The left recurrent nerve appears continuous. Right-lobe dissection has not begun.\",\"stem\":\"At the second recorded checkpoint after left lobectomy, which plan was most appropriate for {patientName}'s remaining thyroid surgery?\",\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.1\",\"label\":\"Defer contralateral lobectomy pending functional reassessment\",\"isCorrect\":true,\"rationale\":\"The distal response can bypass a proximal conduction problem. In this noninvasive cancer setting, defer right resection and reassess left laryngeal function.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2\",\"label\":\"Complete right lobectomy using continuous nerve monitoring\",\"isCorrect\":false,\"rationale\":\"Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3\",\"label\":\"Exchange the electrode tube before completing right lobectomy\",\"isCorrect\":false,\"rationale\":\"Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative-record observations: checkpoint 2\",\"items\":[{\"label\":\"Left recurrent nerve at laryngeal entry\",\"value\":\"EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"Left recurrent nerve in lower neck\",\"value\":\"EMG waveform and palpable laryngeal contraction absent.\"},{\"label\":\"Left vagus stimulus\",\"value\":\"EMG waveform and palpable laryngeal contraction absent.\"},{\"label\":\"Right vagus stimulus\",\"value\":\"EMG waveform and palpable laryngeal contraction present.\"}]},\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]},{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.thyroid-nerve-monitoring.two-signal-events.v1\",\"displayName\":\"Clinic operative-record review: Clara Bennett\",\"patientPresentationVariantId\":\"presentation.intraop.thyroid-nerve-monitoring.two-signal-events.v1\",\"releasePointId\":\"release.l0.clinic_evaluation\",\"patientDisplayName\":\"Clara Bennett\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Thyroid surgery review\",\"presentation\":\"{patientName}, a 49-year-old woman, is in clinic reviewing outside hospital operative and anesthesia records from a planned total thyroidectomy for papillary cancers in both lobes. Imaging showed each lesion confined to the thyroid and no abnormal neck lymph nodes; both vocal folds moved normally before surgery. At the first recorded checkpoint, left-lobe dissection is underway.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.thyroid-nerve-monitoring.two-signal-events.v1\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Thyroid surgery review\",\"presentation\":\"{patientName}, a 49-year-old woman, is in clinic reviewing outside hospital operative and anesthesia records from a planned total thyroidectomy for papillary cancers in both lobes. Imaging showed each lesion confined to the thyroid and no abnormal neck lymph nodes; both vocal folds moved normally before surgery. At the first recorded checkpoint, left-lobe dissection is underway.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"decisionNodes\":[{\"id\":\"node.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"questionVariantId\":\"question.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"primaryConceptId\":\"concept.intraop.thyroid-nerve-monitoring.recording-check.v1\",\"stem\":\"At the first recorded thyroidectomy checkpoint, which check should have been prioritized for {patientName}'s monitoring findings?\",\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.1\",\"label\":\"Check tube position and electrode contact\",\"isCorrect\":true,\"rationale\":\"The motor response persists on both sides; the missing recorded response directs the first check to electrode contact.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.2\",\"label\":\"Check neuromuscular recovery with quantitative twitch monitoring\",\"isCorrect\":false,\"rationale\":\"Residual blockade can affect EMG, but preserved bilateral laryngeal contraction makes recording contact the better first target here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.recording-check.3\",\"label\":\"Check stimulus delivery with a replacement probe\",\"isCorrect\":false,\"rationale\":\"The palpable contraction shows the stimulus is reaching muscle; replacing the stimulating probe is less directed than checking acquisition.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative-record observations: checkpoint 1\",\"items\":[{\"label\":\"Before dissection\",\"value\":\"Either vagus stimulus produced a recorded EMG waveform and a palpable laryngeal contraction.\"},{\"label\":\"Current left vagus stimulus\",\"value\":\"Laryngeal contraction remains palpable; EMG waveform is absent.\"},{\"label\":\"Current right vagus stimulus\",\"value\":\"Laryngeal contraction remains palpable; EMG waveform is absent.\"}]},\"sourceLabels\":[\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"questionVariantId\":\"question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"primaryConceptId\":\"concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1\",\"currentUpdate\":\"The next record entry documents correction of tube rotation and return of both waveforms. After left lobectomy, the new findings below persist after release of traction and repeat technical checks. The left recurrent nerve appears continuous. Right-lobe dissection has not begun.\",\"stem\":\"At the second recorded checkpoint after left lobectomy, which plan was most appropriate for {patientName}'s remaining thyroid surgery?\",\"answerChoices\":[{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.1\",\"label\":\"Defer contralateral lobectomy pending functional reassessment\",\"isCorrect\":true,\"rationale\":\"The distal response can bypass a proximal conduction problem. In this noninvasive cancer setting, defer right resection and reassess left laryngeal function.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2\",\"label\":\"Complete right lobectomy using continuous nerve monitoring\",\"isCorrect\":false,\"rationale\":\"Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3\",\"label\":\"Exchange the electrode tube before completing right lobectomy\",\"isCorrect\":false,\"rationale\":\"Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative-record observations: checkpoint 2\",\"items\":[{\"label\":\"Left recurrent nerve at laryngeal entry\",\"value\":\"EMG waveform and palpable laryngeal contraction present.\"},{\"label\":\"Left recurrent nerve in lower neck\",\"value\":\"EMG waveform and palpable laryngeal contraction absent.\"},{\"label\":\"Left vagus stimulus\",\"value\":\"EMG waveform and palpable laryngeal contraction absent.\"},{\"label\":\"Right vagus stimulus\",\"value\":\"EMG waveform and palpable laryngeal contraction present.\"}]},\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"Monitoring the right nerve does not restore the demonstrated left conduction deficit or remove the risk of a bilateral functional injury.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]},{\"answerChoiceId\":\"choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"This historical checkpoint review executes no test, operation or patient outcome.\",\"clinicalRationale\":\"Preserved right and distal-left responses after correction argue against repeating the earlier global recording explanation for this new pattern.\",\"sourceLabels\":[\"Matthew D. Ringel (2025); 10.1177/10507256251363120\",\"Hoon Yub Kim (2018); 10.16956/jes.2018.18.1.37\",\"Beata Wojtczak (2017); 10.1007/s00423-016-1438-8\",\"Young Jun Chai (2026); 10.54441/jnn.2026.6.1.28\"]}]}],\"learningSummary\":\"Stimulation is still producing a physical motor response. The absent waveforms therefore call for a recording-contact check, including endotracheal electrode position. These observations do not establish left recurrent-nerve injury. The new proximal-distal discrepancy supports left-sided conduction failure despite visible continuity. Preserve the undissected right side in this oncologically deferrable setting and obtain postoperative functional assessment before reconsidering completion. Signal loss does not prove a permanent deficit.\"}",
    "sourceQuestionSha256": "25636f88f93d6a7de1a949fe12a0fd4f83cebc02a4851103cdeb73523c4a194e",
    "sourceNodeSha256": "8a8ea52665d7507ee1fcea359554e594a4817b647ca7d7dac05daa13eb9c4fd9",
    "sourceCaseSha256": "21440bc2c08af8de36ec7080a874a51965afffdbf999a7a2f1a160eeb9c5900c",
    "acceptedQuestionSha256": "25636f88f93d6a7de1a949fe12a0fd4f83cebc02a4851103cdeb73523c4a194e",
    "acceptedNodeSha256": "8a8ea52665d7507ee1fcea359554e594a4817b647ca7d7dac05daa13eb9c4fd9",
    "acceptedCaseSha256": "53af779615f00161287215746e2995fef09808ede79d433f6ead30e27f7299b2",
    "review": {
      "path": "docs/research/question-intraop-thyroid-nerve-monitoring-review2-20261112.json",
      "record": {
        "id": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
        "nodeId": "node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
        "title": "Clara Bennett: persistent first-side conduction loss before contralateral surgery",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [
          {
            "phrase": "Defer contralateral lobectomy pending functional reassessment",
            "why": "Minor residual caution/outlier cue: this is the only plan that does not culminate in right lobectomy. A test-wise reader might favor it in a complication vignette. It is nevertheless a specific operative decision rather than generic individualized management, and the new observations are needed to justify it; this does not independently warrant revision."
          }
        ],
        "fairness": [
          "Reviewed the current v1 candidate independently of its prior PASS designation. The exhibit establishes preserved distal-left and right-sided responses with absent proximal-left physical and recorded responses after technical rechecks. That pattern supports a left conduction problem despite an anatomically continuous nerve.",
          "Deferring right lobectomy pending functional reassessment is the single best offered plan in the supplied thyroid-confined cancer context. Continuous monitoring of the right side does not eliminate the consequence of injuring the remaining functioning pathway. Exchanging the tube is less appropriate when the same recording setup still captures right and distal-left responses and the proximal-left physical response is also absent.",
          "The necessary cancer context is in the shared presentation, not just in feedback: lesions confined to the thyroid and no abnormal neck nodes. This is sufficient for the offered staging comparison; the explanation should not be generalized into a universal rule for invasive or urgent disease. No fixed waiting interval, permanent-paralysis diagnosis or exact predictive probability is asserted.",
          "Both reasoning steps are consequential: interpret the response topology as functional loss rather than recurrent acquisition failure, then change the planned extent of surgery to avoid bilateral functional injury. The visual continuity and retained distal response create clinically meaningful false reassurance. This is high-yield thyroid surgery safety and operative judgment.",
          "The sequence follows real operative order: an initial recording problem is corrected with documented signal recovery, left lobectomy is completed, a new persistent pattern is assessed after traction release/rechecks, and right dissection has not started. The first explanation does not rehearse staging or distal bypass. Deleting checkpoint 2 removes the justification for stopping after the first lobe.",
          "The task identifies Clara, the completed left lobectomy and the requested remaining-surgery plan. The update and exhibit restate the relevant intervening events, so the node remains answerable without recalling the first answer, provided the shared presentation remains accessible. The hospital-record review setting is explicit and does not assert local ASC thyroid capability. Adult age/sex remain consistent.",
          "The options are all specific plans at the same pause. The equipment-exchange alternative is weakened by the documented correction and current control responses, but it represents anchoring on the earlier artifact rather than an impossible action. The distinctive deferral wording makes this moderate, not hard; the item does not establish calibrated resident difficulty.",
          "No confident clinical inaccuracy identified on this offline review. The explanation appropriately distinguishes conduction failure from permanent deficit. Exact technical troubleshooting adequacy and clinical approval remain clinician responsibilities; no unsupported timing cutoff is required to repair this item."
        ],
        "suggestions": [
          "No required repair to this exact candidate. Preserve both the recovery between events and the new physical-response observations; removing either would weaken the separation of artifact from a new conduction problem.",
          "Keep the shared cancer presentation available if the second node can be selected directly. A standalone display must not show only the task while hiding the operative indication and disease context.",
          "Do not describe this as hard or remove decision-critical verification findings merely to make the deferral option less attractive. Any future harder variant needs a different supported competing operative decision."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.unexpected-bowel.base-margin.20261112.v1",
    "caseId": "case.intraop.unexpected-bowel.base-margin.20261112.v1",
    "questionVariantId": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
    "sourceCaseExport": "UNEXPECTED_BOWEL_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v2\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.unexpected-bowel.base-margin.20261112.v1\",\"conceptId\":\"concept.intraop.unexpected-bowel.appendiceal-base-margin.v1\",\"stem\":\"Which initial resection should have been chosen for the unexpected appendiceal lesion in {patientName}'s recorded hospital operation?\",\"answerChoices\":[{\"id\":\"choice.intraop.unexpected-bowel.base-margin.cecal-cuff.20261112.v1\",\"label\":\"Resect appendix with a cecal cuff\",\"isCorrect\":true,\"rationale\":\"The enlargement reaches the appendiceal junction, so transecting that junction would cross abnormal tissue. A limited cuff takes the gross edge into the surrounding soft cecum while retaining the separate ileocecal valve. Retrieve the lesion intact and classify the specimen before considering oncologic extension.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.unexpected-bowel.base-margin.junction.20261112.v1\",\"label\":\"Resect appendix at its cecal junction\",\"isCorrect\":false,\"rationale\":\"This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.\",\"distractorRationale\":\"This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.\"},{\"id\":\"choice.intraop.unexpected-bowel.base-margin.ileocecal.20261112.v1\",\"label\":\"Resect ileocecal segment with primary anastomosis\",\"isCorrect\":false,\"rationale\":\"Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.\",\"distractorRationale\":\"Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.\"}],\"explanation\":\"The junction is part of the abnormal appendix, while neighboring cecum offers a local gross margin away from the ileocecal valve. Appendectomy with a cecal cuff is the best initial specimen operation among these choices. Avoid rupture during handling and retrieval. This gross-anatomy decision does not determine the final tumor classification or establish an indication for oncologic colectomy.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.unexpected-bowel.abnormal-appendix\",\"claim.intraop.unexpected-bowel.base-margin\",\"claim.intraop.unexpected-bowel.intact-specimen\",\"claim.intraop.unexpected-bowel.histology-before-colectomy\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.unexpected-bowel.base-margin.20261112.v1\",\"questionVariantId\":\"question.intraop.unexpected-bowel.base-margin.20261112.v1\",\"primaryConceptId\":\"concept.intraop.unexpected-bowel.appendiceal-base-margin.v1\",\"currentUpdate\":\"The outside operative note records a smooth, fluid-filled enlargement extending along the appendix to its junction with the cecum. There is no intervening narrow neck. The surrounding cecal wall is soft, and the ileocecal valve lies away from the enlargement. The appendix is mobile. Abdominal survey shows no deposits or free gelatinous material.\",\"stem\":\"Which initial resection should have been chosen for the unexpected appendiceal lesion in {patientName}'s recorded hospital operation?\",\"answerChoices\":[{\"id\":\"choice.intraop.unexpected-bowel.base-margin.cecal-cuff.20261112.v1\",\"label\":\"Resect appendix with a cecal cuff\",\"isCorrect\":true,\"rationale\":\"The enlargement reaches the appendiceal junction, so transecting that junction would cross abnormal tissue. A limited cuff takes the gross edge into the surrounding soft cecum while retaining the separate ileocecal valve. Retrieve the lesion intact and classify the specimen before considering oncologic extension.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.unexpected-bowel.base-margin.junction.20261112.v1\",\"label\":\"Resect appendix at its cecal junction\",\"isCorrect\":false,\"rationale\":\"This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.unexpected-bowel.base-margin.ileocecal.20261112.v1\",\"label\":\"Resect ileocecal segment with primary anastomosis\",\"isCorrect\":false,\"rationale\":\"Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The junction is part of the abnormal appendix, while neighboring cecum offers a local gross margin away from the ileocecal valve. Appendectomy with a cecal cuff is the best initial specimen operation among these choices. Avoid rupture during handling and retrieval. This gross-anatomy decision does not determine the final tumor classification or establish an indication for oncologic colectomy.\",\"sourceLabels\":[\"ASCRS appendiceal-neoplasm guideline (2025)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.unexpected-bowel.base-margin.junction.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded operative decision; no patient outcome is simulated.\",\"clinicalRationale\":\"This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.\",\"sourceLabels\":[\"ASCRS appendiceal-neoplasm guideline (2025)\"]},{\"answerChoiceId\":\"choice.intraop.unexpected-bowel.base-margin.ileocecal.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded operative decision; no patient outcome is simulated.\",\"clinicalRationale\":\"Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.\",\"sourceLabels\":[\"ASCRS appendiceal-neoplasm guideline (2025)\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.unexpected-bowel.base-margin.20261112.v1\",\"displayName\":\"Rachel Mercer: operative record review\",\"patientPresentationVariantId\":\"presentation.intraop.unexpected-bowel.base-margin.20261112.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Rachel Mercer\",\"prototypeDemographics\":{\"ageYears\":58,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Operative record review\",\"presentation\":\"{patientName}, a 58-year-old woman, attends clinic to review an outside elective sigmoid-colectomy note. The review is paused at an incidental appendiceal finding before its resection.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.unexpected-bowel.base-margin.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":58,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Operative record review\",\"presentation\":\"{patientName}, a 58-year-old woman, attends clinic to review an outside elective sigmoid-colectomy note. The review is paused at an incidental appendiceal finding before its resection.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"ASCRS appendiceal-neoplasm guideline (2025)\"],\"decisionNodes\":[{\"id\":\"node.intraop.unexpected-bowel.base-margin.20261112.v1\",\"questionVariantId\":\"question.intraop.unexpected-bowel.base-margin.20261112.v1\",\"primaryConceptId\":\"concept.intraop.unexpected-bowel.appendiceal-base-margin.v1\",\"currentUpdate\":\"The outside operative note records a smooth, fluid-filled enlargement extending along the appendix to its junction with the cecum. There is no intervening narrow neck. The surrounding cecal wall is soft, and the ileocecal valve lies away from the enlargement. The appendix is mobile. Abdominal survey shows no deposits or free gelatinous material.\",\"stem\":\"Which initial resection should have been chosen for the unexpected appendiceal lesion in {patientName}'s recorded hospital operation?\",\"answerChoices\":[{\"id\":\"choice.intraop.unexpected-bowel.base-margin.cecal-cuff.20261112.v1\",\"label\":\"Resect appendix with a cecal cuff\",\"isCorrect\":true,\"rationale\":\"The enlargement reaches the appendiceal junction, so transecting that junction would cross abnormal tissue. A limited cuff takes the gross edge into the surrounding soft cecum while retaining the separate ileocecal valve. Retrieve the lesion intact and classify the specimen before considering oncologic extension.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.unexpected-bowel.base-margin.junction.20261112.v1\",\"label\":\"Resect appendix at its cecal junction\",\"isCorrect\":false,\"rationale\":\"This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.unexpected-bowel.base-margin.ileocecal.20261112.v1\",\"label\":\"Resect ileocecal segment with primary anastomosis\",\"isCorrect\":false,\"rationale\":\"Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The junction is part of the abnormal appendix, while neighboring cecum offers a local gross margin away from the ileocecal valve. Appendectomy with a cecal cuff is the best initial specimen operation among these choices. Avoid rupture during handling and retrieval. This gross-anatomy decision does not determine the final tumor classification or establish an indication for oncologic colectomy.\",\"sourceLabels\":[\"ASCRS appendiceal-neoplasm guideline (2025)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.unexpected-bowel.base-margin.junction.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded operative decision; no patient outcome is simulated.\",\"clinicalRationale\":\"This is a familiar appendectomy extent, but the recorded enlargement continues to the junction itself. The visible anatomy does not supply an intervening normal segment for that transection. The local cecal margin, rather than the usual appendectomy landmark, should determine the edge.\",\"sourceLabels\":[\"ASCRS appendiceal-neoplasm guideline (2025)\"]},{\"answerChoiceId\":\"choice.intraop.unexpected-bowel.base-margin.ileocecal.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded operative decision; no patient outcome is simulated.\",\"clinicalRationale\":\"Ileocecal resection can secure an edge when local cecal excision is not feasible, but the described junction is surrounded by soft cecum and lies away from the valve. The record supports obtaining the initial intact specimen with a smaller local excision; it does not establish a need to remove the ileocecal segment.\",\"sourceLabels\":[\"ASCRS appendiceal-neoplasm guideline (2025)\"]}]}],\"learningSummary\":\"The junction is part of the abnormal appendix, while neighboring cecum offers a local gross margin away from the ileocecal valve. Appendectomy with a cecal cuff is the best initial specimen operation among these choices. Avoid rupture during handling and retrieval. This gross-anatomy decision does not determine the final tumor classification or establish an indication for oncologic colectomy.\"}",
    "sourceQuestionSha256": "743a73ca363df631eef3d43145daeb6ca09aa7e7ae093142c3e62b73e02fe051",
    "sourceNodeSha256": "c2dbdfcfbfa9d53310df459dbda0477580d51dd9c44072edeec240bad22de8e7",
    "sourceCaseSha256": "536e57a58be18f384acbd309b2233b6a2bfb0e69c5f4ef8118f04b36040eb0a6",
    "acceptedQuestionSha256": "743a73ca363df631eef3d43145daeb6ca09aa7e7ae093142c3e62b73e02fe051",
    "acceptedNodeSha256": "c2dbdfcfbfa9d53310df459dbda0477580d51dd9c44072edeec240bad22de8e7",
    "acceptedCaseSha256": "80daf8f67a392cb3e1b3a39cb3b350df772a6913f2024ff872c40d031377b087",
    "review": {
      "path": "docs/research/question-intraop-unexpected-appendix-and-bowel-findings-review2-20261112.json",
      "record": {
        "id": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
        "nodeId": "node.intraop.unexpected-bowel.base-margin.20261112.v1",
        "title": "Initial resection of an appendiceal lesion involving the base",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Reviewed the current after/candidate content v2, including its canonical and identical finite-profile presentation. The task explicitly identifies the unexpected appendiceal lesion, so the preceding sigmoid colectomy does not leave the operative target ambiguous. Rachel Mercer has a consistent age and sex and a short visit-reason complaint.",
          "One defensible best offered answer: appendectomy with a cecal cuff. Extension to the junction without an intervening neck makes ordinary junction division a credible inadequate-margin error; the soft adjacent cecum and separate valve support limited extension rather than ileocecal resection. These are two consequential anatomical judgments, not merely recognition of a mucinous-looking appendix.",
          "The base/cecum/valve observations are legitimate decision-critical information, not instructions to preserve bowel. All three options describe a resection extent, have comparable length and specificity, and contain no key-only teaching qualifier. There is no convincing wording-only route to the key or component-convergence pattern.",
          "The recorded operative scene is plausible, with the relevant gross findings explicitly available before resection. Reviewing a hospital sigmoid-colectomy record in clinic fits the program; it does not imply that this operation is performed in the clinic ASC. A text operative record suffices here, and no missing image is promised. This is a standalone node with no later-part dependency or operative-order problem.",
          "The explanation appropriately limits the conclusion to the initial gross specimen operation and does not equate appearance with final tumor classification or an oncologic-colectomy indication. No confident clinical inaccuracy identified. This offline editorial review does not verify current guidance or confer clinical approval; adequacy of the stated gross anatomy remains subject to Melissa Rowland's exact-version sign-off.",
          "High-yield qualitative judgment: appendiceal lesion handling and selection of a sufficient initial resection without premature bowel sacrifice are relevant surgical examination concepts. Moderate difficulty comes from choosing between under-resection and unnecessary extension, not from an obscure numerical threshold."
        ],
        "suggestions": [
          "No required wording repair. Retain the base involvement, adjacent cecal findings and valve relationship; do not replace them with a sentence declaring that a cuff is feasible or preferred.",
          "Preserve the distinction between a gross initial margin and final histological classification, and retain needs_clinician_review. PASS is editorial, not clinical approval."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  },
  {
    "nodeId": "node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "caseId": "case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "questionVariantId": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "sourceCaseExport": "UNEXPECTED_BOWEL_CASES",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1\",\"conceptId\":\"concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1\",\"stem\":\"Which operative completion plan should have been chosen at this checkpoint in {patientName}'s exploration for presumed appendicitis?\",\"answerChoices\":[{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.preserve.20261112.v1\",\"label\":\"Preserve appendix and ileum at closure\",\"isCorrect\":true,\"rationale\":\"The visible disease is ileal, and its appearance does not prove Crohn disease rather than an infectious cause. The record supplies neither a separate appendiceal lesion nor a stricturing or penetrating complication. Preserve the appendix and ileum while arranging subsequent diagnostic assessment, rather than add an unneeded stump or resection.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.appendectomy.20261112.v1\",\"label\":\"Remove appendix and preserve terminal ileum\",\"isCorrect\":false,\"rationale\":\"Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.\",\"distractorRationale\":\"Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.\"},{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.ileocecal-resection.20261112.v1\",\"label\":\"Remove ileocecal segment and restore continuity\",\"isCorrect\":false,\"rationale\":\"The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.\",\"distractorRationale\":\"The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.\"}],\"explanation\":\"This is an unexpected ileal inflammatory finding, not confirmation of Crohn disease or a new appendectomy indication. The normal-looking appendix should be preserved, and uncomplicated undiagnosed ileitis does not require immediate resection. Complete diagnostic assessment afterward. A separate appendiceal lesion, obstruction, perforation or another emergency would change the operative decision.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.unexpected-bowel.ileitis-nonspecific\",\"claim.intraop.unexpected-bowel.ileitis-resection-boundary\",\"claim.intraop.unexpected-bowel.normal-appendix-boundary\",\"claim.intraop.unexpected-bowel.ibd-emergency-boundary\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1\",\"questionVariantId\":\"question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1\",\"primaryConceptId\":\"concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1\",\"currentUpdate\":\"The outside note describes a slender, pliable appendix with a smooth surface. Several terminal ileal loops are thickened and red, with mesenteric fat extending onto their surfaces. The proximal bowel is not dilated, and the survey finds neither a wall defect nor an abscess. The preoperative history was right-sided pain with loose stools and no previous inflammatory-bowel diagnosis.\",\"stem\":\"Which operative completion plan should have been chosen at this checkpoint in {patientName}'s exploration for presumed appendicitis?\",\"answerChoices\":[{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.preserve.20261112.v1\",\"label\":\"Preserve appendix and ileum at closure\",\"isCorrect\":true,\"rationale\":\"The visible disease is ileal, and its appearance does not prove Crohn disease rather than an infectious cause. The record supplies neither a separate appendiceal lesion nor a stricturing or penetrating complication. Preserve the appendix and ileum while arranging subsequent diagnostic assessment, rather than add an unneeded stump or resection.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.appendectomy.20261112.v1\",\"label\":\"Remove appendix and preserve terminal ileum\",\"isCorrect\":false,\"rationale\":\"Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.ileocecal-resection.20261112.v1\",\"label\":\"Remove ileocecal segment and restore continuity\",\"isCorrect\":false,\"rationale\":\"The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"This is an unexpected ileal inflammatory finding, not confirmation of Crohn disease or a new appendectomy indication. The normal-looking appendix should be preserved, and uncomplicated undiagnosed ileitis does not require immediate resection. Complete diagnostic assessment afterward. A separate appendiceal lesion, obstruction, perforation or another emergency would change the operative decision.\",\"sourceLabels\":[\"ECCO-ESCP surgical Crohn consensus (2018)\",\"WSES-AAST emergency IBD guideline (2021)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.unexpected-bowel.ileitis-restraint.appendectomy.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded operative decision; no patient outcome is simulated.\",\"clinicalRationale\":\"Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.\",\"sourceLabels\":[\"ECCO-ESCP surgical Crohn consensus (2018)\",\"WSES-AAST emergency IBD guideline (2021)\"]},{\"answerChoiceId\":\"choice.intraop.unexpected-bowel.ileitis-restraint.ileocecal-resection.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded operative decision; no patient outcome is simulated.\",\"clinicalRationale\":\"The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.\",\"sourceLabels\":[\"ECCO-ESCP surgical Crohn consensus (2018)\",\"WSES-AAST emergency IBD guideline (2021)\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1\",\"displayName\":\"Leah Foster: exploration record review\",\"patientPresentationVariantId\":\"presentation.intraop.unexpected-bowel.ileitis-restraint.20261112.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Leah Foster\",\"prototypeDemographics\":{\"ageYears\":29,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Exploration record review\",\"presentation\":\"{patientName}, a 29-year-old woman, attends clinic to review an outside emergency-exploration note for presumed appendicitis. The review is paused after inspection of the appendix and terminal ileum, before an organ is removed.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.unexpected-bowel.ileitis-restraint.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":29,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Exploration record review\",\"presentation\":\"{patientName}, a 29-year-old woman, attends clinic to review an outside emergency-exploration note for presumed appendicitis. The review is paused after inspection of the appendix and terminal ileum, before an organ is removed.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"ECCO-ESCP surgical Crohn consensus (2018)\",\"WSES-AAST emergency IBD guideline (2021)\"],\"decisionNodes\":[{\"id\":\"node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1\",\"questionVariantId\":\"question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1\",\"primaryConceptId\":\"concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1\",\"currentUpdate\":\"The outside note describes a slender, pliable appendix with a smooth surface. Several terminal ileal loops are thickened and red, with mesenteric fat extending onto their surfaces. The proximal bowel is not dilated, and the survey finds neither a wall defect nor an abscess. The preoperative history was right-sided pain with loose stools and no previous inflammatory-bowel diagnosis.\",\"stem\":\"Which operative completion plan should have been chosen at this checkpoint in {patientName}'s exploration for presumed appendicitis?\",\"answerChoices\":[{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.preserve.20261112.v1\",\"label\":\"Preserve appendix and ileum at closure\",\"isCorrect\":true,\"rationale\":\"The visible disease is ileal, and its appearance does not prove Crohn disease rather than an infectious cause. The record supplies neither a separate appendiceal lesion nor a stricturing or penetrating complication. Preserve the appendix and ileum while arranging subsequent diagnostic assessment, rather than add an unneeded stump or resection.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.appendectomy.20261112.v1\",\"label\":\"Remove appendix and preserve terminal ileum\",\"isCorrect\":false,\"rationale\":\"Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.unexpected-bowel.ileitis-restraint.ileocecal-resection.20261112.v1\",\"label\":\"Remove ileocecal segment and restore continuity\",\"isCorrect\":false,\"rationale\":\"The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"This is an unexpected ileal inflammatory finding, not confirmation of Crohn disease or a new appendectomy indication. The normal-looking appendix should be preserved, and uncomplicated undiagnosed ileitis does not require immediate resection. Complete diagnostic assessment afterward. A separate appendiceal lesion, obstruction, perforation or another emergency would change the operative decision.\",\"sourceLabels\":[\"ECCO-ESCP surgical Crohn consensus (2018)\",\"WSES-AAST emergency IBD guideline (2021)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.unexpected-bowel.ileitis-restraint.appendectomy.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded operative decision; no patient outcome is simulated.\",\"clinicalRationale\":\"Removing a normal appendix is not automatically the harmless completion of the original plan when terminal ileitis is present. The appendix offers no separate operative explanation, and appendix removal in this setting can add septic or fistula risk. The ileal finding still requires a full etiological assessment.\",\"sourceLabels\":[\"ECCO-ESCP surgical Crohn consensus (2018)\",\"WSES-AAST emergency IBD guideline (2021)\"]},{\"answerChoiceId\":\"choice.intraop.unexpected-bowel.ileitis-restraint.ileocecal-resection.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded operative decision; no patient outcome is simulated.\",\"clinicalRationale\":\"The appearance raises possible Crohn disease, but a new diagnosis and an immediate resection indication do not follow from appearance alone. There is no recorded obstruction, penetrating defect or abscess. This is different from an elective operation selected after assessment of established localized Crohn disease.\",\"sourceLabels\":[\"ECCO-ESCP surgical Crohn consensus (2018)\",\"WSES-AAST emergency IBD guideline (2021)\"]}]}],\"learningSummary\":\"This is an unexpected ileal inflammatory finding, not confirmation of Crohn disease or a new appendectomy indication. The normal-looking appendix should be preserved, and uncomplicated undiagnosed ileitis does not require immediate resection. Complete diagnostic assessment afterward. A separate appendiceal lesion, obstruction, perforation or another emergency would change the operative decision.\"}",
    "sourceQuestionSha256": "19995e528a017516eb9df772fed658fba5b4976a0a1c4002a65ebbbca04146de",
    "sourceNodeSha256": "ffb431e69b61bcf621e4d823a83571a8605683ef902263f91f289bc857110b7f",
    "sourceCaseSha256": "43c367eff6fd1cdf86562957f6c52ea01dab552ada7bda4bc5e505f91a7bacfe",
    "acceptedQuestionSha256": "19995e528a017516eb9df772fed658fba5b4976a0a1c4002a65ebbbca04146de",
    "acceptedNodeSha256": "ffb431e69b61bcf621e4d823a83571a8605683ef902263f91f289bc857110b7f",
    "acceptedCaseSha256": "e8e57cbae4ac8d387504b9441181d79d1e6d6f47247db66da78ca589eae87b1f",
    "review": {
      "path": "docs/research/question-intraop-unexpected-appendix-and-bowel-findings-review2-20261112.json",
      "record": {
        "id": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
        "nodeId": "node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
        "title": "Completion of exploration with a normal-looking appendix and unexpected ileitis",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Independently reviewed the executable after/candidate v1 despite its previous PASS label. Leah Foster's age, sex, complaint and review of an outside exploration are coherent. The task specifies the operation and decision stage. The preoperative loose-stool history is explicitly historical rather than a later result imported into the checkpoint.",
          "Preserving appendix and ileum is the defensible best offered completion plan for the described uncomplicated ileal inflammatory process and grossly normal appendix. The resident must redirect the presumed appendicitis target using the distribution of findings, then distinguish an inflammatory appearance from an indication for immediate organ removal. Removing the normal-looking appendix is a credible resident error; immediate ileocecal resection is the weaker alternative.",
          "The nondilated proximal bowel and absence of a wall defect or abscess establish important operative boundaries. They should not be deleted as mere negatives to make the item harder. Mesenteric fat extending onto the bowel suggests a recognizable process, but no diagnosis label supplies the completion plan. The options are similarly concise and specific, with no uniquely comprehensive referral bundle, rhetorical absolute or decisive nonmedical convergence cue.",
          "Gross appendix and ileal observations are available at a realistic exploration checkpoint. Hospital emergency exploration belongs in the outside-record clinic frame used here and does not require local ASC rescue capability. There are no pediatric patients or parent-context requirements in this item. It is standalone; no preceding scored answer teaches this key and no later node depends on an unperformed action.",
          "The explanation correctly avoids declaring Crohn disease established by inspection and limits restraint to this uncomplicated, undiagnosed presentation. No confident clinical inaccuracy identified. The precise normal-appendix management boundary in suspected ileitis is a clinical judgment requiring named-clinician confirmation; this offline review does not newly establish guideline currency or justify a universal rule for every normal appendix encountered at exploration.",
          "High-yield qualitative judgment: distinguishing an alternative inflammatory cause from appendicitis and avoiding reflex bowel resection are practical examination decisions. Moderate difficulty reflects the temptation to complete the originally intended appendectomy despite the changed operative findings; the case does not support a hard rating."
        ],
        "suggestions": [
          "No required wording repair. Preserve the raw appendix/ileum findings and the complication assessment rather than inserting an explicit Crohn diagnosis or an instruction to avoid surgery.",
          "Keep the explanation tied to this unexpected uncomplicated finding. Do not extrapolate it into a general prohibition of appendectomy or surgery in established Crohn disease. Retain needs_clinician_review pending Melissa Rowland's exact-version approval."
        ]
      }
    },
    "permittedDifferences": "Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes."
  }
];
export const PROGRAM_BATCH9_CORRECTIONS = [
  {
    "path": "case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1.displayName",
    "before": "ASC procedure: Aaron Reed",
    "after": "ASC procedure: {patientName}",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.sliding-sac.20261112.v1.displayName",
    "before": "Mateo Alvarez: groin operation checkpoint",
    "after": "{patientName}: groin operation checkpoint",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.sliding-sac.20261112.v1.presentation",
    "before": "Mateo Alvarez, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.",
    "after": "{patientName}, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.sliding-sac.20261112.v1.approvedInstantiationProfiles[0].presentation",
    "before": "Mateo Alvarez, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.",
    "after": "{patientName}, a 57-year-old man, is undergoing elective left TAPP inguinal hernia repair in the clinic's ASC operating room. Before this operation, the reducible bulge had extended into the upper scrotum. The operation is underway after opening the peritoneal flap.",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.sliding-sac.20261112.v1.decisionNodes[0].stem",
    "before": "Which next maneuver should be used for Mateo's sigmoid-containing sac at this left TAPP repair checkpoint?",
    "after": "Which next maneuver should be used for {patientName}'s sigmoid-containing sac at this left TAPP repair checkpoint?",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.sliding-sac.20261112.v1.decisionNodes[1].stem",
    "before": "How should Mateo's residual sac be handled at this left TAPP repair checkpoint after proximal reduction?",
    "after": "How should {patientName}'s residual sac be handled at this left TAPP repair checkpoint after proximal reduction?",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.sliding-sac.20261112.v1.learningSummary",
    "before": "In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance.\nThe deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.",
    "after": "In this TAPP view, the sigmoid and mesocolon form a bowel-bearing sac boundary. The traction response locates the remaining restraint in the lateral attachments, with a slack neck. Mobilize those attachments from the preperitoneal side and bring the unit inward. Peeling the visceral boundary mistakes it for an adhesion; ring enlargement targets a different cause of resistance. The deciding finding is vas and veins incorporated in a fibrotic distal sac wall after a gentle plane-seeking attempt, with a separate empty cuff available proximally. Divide through that cuff and leave the adherent portion. Continued release through the shared wall risks cord injury, and additional access does not make complete release obligatory. Retained distal sac may form a seroma; evidence comparing strategies is limited.",
    "kind": "native_projection_summary_whitespace"
  },
  {
    "path": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1.stem",
    "before": "Which next maneuver should be used for Mateo's sigmoid-containing sac at this left TAPP repair checkpoint?",
    "after": "Which next maneuver should be used for {patientName}'s sigmoid-containing sac at this left TAPP repair checkpoint?",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1.stem",
    "before": "How should Mateo's residual sac be handled at this left TAPP repair checkpoint after proximal reduction?",
    "after": "How should {patientName}'s residual sac be handled at this left TAPP repair checkpoint after proximal reduction?",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.urinary-findings.20261112.v1.displayName",
    "before": "Owen Patel: groin operation checkpoint",
    "after": "{patientName}: groin operation checkpoint",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.urinary-findings.20261112.v1.presentation",
    "before": "Owen Patel, a 63-year-old man, is undergoing elective laparoscopic inguinal hernia repair in the clinic's ASC operating room. The operation is underway with a urethral catheter in place during medial dissection.",
    "after": "{patientName}, a 63-year-old man, is undergoing elective laparoscopic inguinal hernia repair in the clinic's ASC operating room. The operation is underway with a urethral catheter in place during medial dissection.",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.urinary-findings.20261112.v1.approvedInstantiationProfiles[0].presentation",
    "before": "Owen Patel, a 63-year-old man, is undergoing elective laparoscopic inguinal hernia repair in the clinic's ASC operating room. The operation is underway with a urethral catheter in place during medial dissection.",
    "after": "{patientName}, a 63-year-old man, is undergoing elective laparoscopic inguinal hernia repair in the clinic's ASC operating room. The operation is underway with a urethral catheter in place during medial dissection.",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.urinary-findings.20261112.v1.decisionNodes[0].currentUpdate",
    "before": "During medial preperitoneal dissection, air begins collecting in Owen's previously gas-free catheter drainage bag. Pale fluid appears in the retropubic field. The urethral catheter remains in place; the source of the fluid is not visible.",
    "after": "During medial preperitoneal dissection, air begins collecting in {patientName}'s previously gas-free catheter drainage bag. Pale fluid appears in the retropubic field. The urethral catheter remains in place; the source of the fluid is not visible.",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.groin-hernia.urinary-findings.20261112.v1.decisionNodes[0].stem",
    "before": "Which diagnostic maneuver should next investigate Owen's new urinary findings during laparoscopic inguinal repair?",
    "after": "Which diagnostic maneuver should next investigate {patientName}'s new urinary findings during laparoscopic inguinal repair?",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1.stem",
    "before": "Which diagnostic maneuver should next investigate Owen's new urinary findings during laparoscopic inguinal repair?",
    "after": "Which diagnostic maneuver should next investigate {patientName}'s new urinary findings during laparoscopic inguinal repair?",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1.displayName",
    "before": "Clinic operative-record review: Daniel Brooks",
    "after": "Clinic operative-record review: {patientName}",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1.displayName",
    "before": "Clinic operative-record review: Clara Bennett",
    "after": "Clinic operative-record review: {patientName}",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.unexpected-bowel.base-margin.20261112.v1.displayName",
    "before": "Rachel Mercer: operative record review",
    "after": "{patientName}: operative record review",
    "kind": "presentation_only_patient_name_placeholder"
  },
  {
    "path": "case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1.displayName",
    "before": "Leah Foster: exploration record review",
    "after": "{patientName}: exploration record review",
    "kind": "presentation_only_patient_name_placeholder"
  }
];
export const PROGRAM_BATCH9_CLAIMS:Array<EvidenceClaim & Record<string,unknown>> = [
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.mh-pattern",
    "statement": "A volatile-anesthetic-associated rise in carbon dioxide with muscle rigidity can indicate an MH crisis.",
    "sourceIds": [
      "source.intraop.i11.emhg-2024",
      "source.intraop.i11.jsa-2026"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.mh-treatment",
    "statement": "Suspected MH calls for prompt trigger withdrawal and dantrolene alongside oxygenation and coordinated emergency support.",
    "sourceIds": [
      "source.intraop.i11.emhg-2024",
      "source.intraop.i11.jsa-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.mh-potassium",
    "statement": "MH-related muscle injury can release potassium and cause cardiotoxic ECG changes.",
    "sourceIds": [
      "source.intraop.i11.jsa-2026"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "One independently checked publication directly connects MH-associated potassium release to the ECG pattern.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.calcium-cardioprotection",
    "statement": "Intravenous calcium salts provide acute cardiac protection in severe hyperkalemia.",
    "sourceIds": [
      "source.intraop.i11.jsa-2026",
      "source.intraop.i11.mhra-calcium-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.calcium-not-removal",
    "statement": "Calcium does not remove potassium; potassium-lowering treatment must accompany cardiac protection.",
    "sourceIds": [
      "source.intraop.i11.mhra-calcium-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single government source for this mechanism; the MH guidelines independently support combined potassium treatment.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.calcium-versus-ccb",
    "statement": "The dantrolene precaution concerns calcium-channel-blocking drugs; the same MH guidance includes calcium gluconate for hyperkalemia.",
    "sourceIds": [
      "source.intraop.i11.jsa-2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single direct guideline for this drug-class distinction; independently cross-checked calcium use in EMHG, without importing MHAUS content.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.repeat-dantrolene",
    "statement": "Persistent or recurring hypermetabolic MH signs can require additional dantrolene.",
    "sourceIds": [
      "source.intraop.i11.emhg-2024",
      "source.intraop.i11.jsa-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.amiodarone-rhythm",
    "statement": "Amiodarone can be used for ventricular tachyarrhythmias in the appropriate resuscitation context.",
    "sourceIds": [
      "source.intraop.i11.stanford-em-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Institutional cognitive-aid support; not a claim that every broad QRS needs amiodarone.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.anaphylaxis-pattern",
    "statement": "Unexpected perioperative hypotension with bronchospasm should prompt consideration of anaphylaxis.",
    "sourceIds": [
      "source.intraop.i11.rcuk-periop-2024",
      "source.intraop.i11.sba-asbai-2020"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.antibiotic-exposure",
    "statement": "Perioperative antibiotics are potential anaphylaxis triggers; the bedside syndrome does not prove a specific culprit.",
    "sourceIds": [
      "source.intraop.i11.rcuk-periop-2024",
      "source.intraop.i11.sba-asbai-2020"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.epi-fluid",
    "statement": "In monitored perioperative anaphylaxis, trained anesthesia clinicians use titrated intravenous epinephrine with intravenous crystalloid resuscitation.",
    "sourceIds": [
      "source.intraop.i11.rcuk-periop-2024",
      "source.intraop.i11.sba-asbai-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No dose or dilution is scored; this is not a community or unmonitored IV administration recommendation.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.bronchodilator-adjunct",
    "statement": "Inhaled bronchodilators can supplement treatment of anaphylactic bronchospasm but do not substitute for epinephrine in associated shock.",
    "sourceIds": [
      "source.intraop.i11.rcuk-periop-2024",
      "source.intraop.i11.sba-asbai-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.epi-infusion",
    "statement": "Persistent cardiovascular compromise after epinephrine boluses supports an epinephrine infusion with ongoing volume resuscitation and monitoring.",
    "sourceIds": [
      "source.intraop.i11.rcuk-periop-2024",
      "source.intraop.i11.sba-asbai-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Bolus thresholds and infusion regimens vary; none is invented or scored.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.second-vasopressor",
    "statement": "A second vasopressor may be added when anaphylactic shock remains refractory to epinephrine infusion and fluid resuscitation.",
    "sourceIds": [
      "source.intraop.i11.rcuk-periop-2024",
      "source.intraop.i11.sba-asbai-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Both publications support escalation; exact agent preference is not ranked.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.steroid-boundary",
    "statement": "Corticosteroid administration is not a replacement for immediate epinephrine resuscitation of perioperative anaphylactic shock.",
    "sourceIds": [
      "source.intraop.i11.rcuk-periop-2024",
      "source.intraop.i11.sba-asbai-2020"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "The sources differ on routine later corticosteroid use; that disputed teaching point is withheld.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.airway-fire-sign",
    "statement": "Smoke or visible glowing material in an airway tube during airway electrosurgery can signal an airway fire.",
    "sourceIds": [
      "source.intraop.i11.pa-airway-fire-2007",
      "source.intraop.i11.stanford-em-2022"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.fire-tube-removal",
    "statement": "An airway fire requires rapid interruption of airway gas flow and removal of the tracheal tube.",
    "sourceIds": [
      "source.intraop.i11.pa-airway-fire-2007",
      "source.intraop.i11.stanford-em-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.fire-irrigation",
    "statement": "Water or saline is used to extinguish an airway fire before ventilation is re-established.",
    "sourceIds": [
      "source.intraop.i11.stanford-em-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Stanford directly supports intraluminal saline; Pennsylvania independently supports extinguishing fire and safe airway restoration, but its tube-extinguishing wording is narrower.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.postfire-bronchoscopy",
    "statement": "After an airway fire, bronchoscopic airway inspection assesses injury and allows residual debris removal.",
    "sourceIds": [
      "source.intraop.i11.stanford-em-2022",
      "source.intraop.i11.pa-airway-fire-2007"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Stanford explicitly recommends whole-airway bronchoscopy; Pennsylvania supports airway damage/debris assessment. No test sensitivity or mandatory flexible-versus-rigid choice is asserted.",
    "applicablePopulation": "Adults in monitored perioperative care; hospital record facts remain historical, not local clinic capability.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.mh-bicarbonate-complications",
    "statement": "Bicarbonate may be used for relevant metabolic complications during a malignant hyperthermia crisis.",
    "sourceIds": [
      "source.intraop.i11.jsa-2026",
      "source.intraop.i11.emhg-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The sources include bicarbonate among complication treatments; no exact acid-base threshold, dosing regimen or equivalence to calcium cardiac protection is asserted.",
    "applicablePopulation": "Adult perioperative care; the airway-fire scene is an outside hospital record.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.prophylaxis-before-incision",
    "statement": "When surgical antimicrobial prophylaxis is indicated, administration before skin incision is consistent with guideline practice.",
    "sourceIds": [
      "source.intraop.i11.apsic-ssi-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One independently checked society guideline for this chronology; no exact timing interval, agent regimen or repeat-dose rule is authored.",
    "applicablePopulation": "Adult perioperative care; the airway-fire scene is an outside hospital record.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.controlled-airway-access",
    "statement": "A planned controlled extubation in an at-risk adult can use an airway exchange catheter to preserve temporary reintubation access.",
    "sourceIds": [
      "source.intraop.i11.aidaa-extubation-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single contemporary society guideline for the controlled technique; not a recommendation to prepare such a catheter during an active airway fire.",
    "applicablePopulation": "Adult perioperative care; the airway-fire scene is an outside hospital record.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i11.fire-aec-sequencing",
    "statement": "The immediate airway-fire response removes the involved tube; a planned extubation access-preservation sequence is not a prerequisite to that removal.",
    "sourceIds": [
      "source.intraop.i11.pa-airway-fire-2007",
      "source.intraop.i11.stanford-em-2022",
      "source.intraop.i11.aidaa-extubation-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Comparative clinical application of separate emergency-removal and controlled-extubation guidance, not a directly studied head-to-head sequence. Exact distractor ranking needs clinician review.",
    "applicablePopulation": "Adult perioperative care; the airway-fire scene is an outside hospital record.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.observed-wall-breach",
    "statement": "Seeing tissue outside the gut through an endoscopic wall gap supports recognition of a full-thickness injury.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "presentation",
    "certainty": "low",
    "limitation": "Constructed observations are not diagnostic photographs or a validated image classifier.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.early-colon-closure",
    "statement": "A promptly recognized small colonic defect with good preparation and feasible tissue capture can be treated with endoscopic clips by an experienced operator.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Device feasibility and contamination matter. Single adequate guideline publication; no universal clip-versus-surgery superiority is asserted.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.conservative-colon-selection",
    "statement": "Stable patients with a sealed colonic injury, localized symptoms and no diffuse free fluid may receive monitored hospital nonoperative care.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Selected inpatient care, not outpatient discharge; initial stability does not ensure success.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.colonic-surgical-boundary",
    "statement": "Poor preparation, gross contamination or a large defect that cannot be reliably closed favors urgent surgical management of colonoscopy perforation.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single guideline publication supports this composite boundary; no size-only mandatory-operation threshold is taught.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.gas-after-closure",
    "statement": "Free peritoneal gas by itself does not require surgery after a colonic injury when other findings support nonoperative care.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "No demonstrated contrast leak does not prove durable sealing; serial reassessment remains necessary.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.perforation-support",
    "statement": "Hospital nonoperative care after colonic perforation includes bowel rest, intravenous hydration, broad-spectrum antibiotics and close reassessment.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No drug, dose, duration, discharge time or feeding interval is supplied.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.deterioration-after-closure",
    "statement": "Worsening physiology, peritoneal signs or an ongoing colonic leak after attempted closure requires prompt surgical reassessment.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Apparent endoscopic success must not delay escalation. The eventual operation is not prescribed.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.esophageal-primary-clips",
    "statement": "An esophageal perforation recognized during endoscopy should receive feasible endoscopic closure; clips can close a small defect.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-esophagus-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single adequate permitted guideline publication. Constructed edges approximate; no ranking of through-the-scope versus over-the-scope clips is offered.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.esophageal-stent-boundary",
    "statement": "Covered esophageal stents can address larger defects or an unsatisfactory clip closure.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-esophagus-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Patient-specific alternative, not a prohibition on stenting all small injuries. Exact clip-versus-stent ranking needs review.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.esophageal-operative-boundary",
    "statement": "Esophageal injuries that cannot be safely managed nonoperatively require operative source control.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-esophagus-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Hospital care; no hospital operation is enacted in the ASC.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.tension-physiology",
    "statement": "Pressurized intraperitoneal gas can impair ventilation and venous return, producing abdominal distension with respiratory and circulatory compromise.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.ray-exantus-2021",
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "presentation",
    "certainty": "low",
    "limitation": "Case-report physiology and society cross-check; not a diagnostic-accuracy estimate.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.tension-rescue",
    "statement": "Emergency percutaneous release of intraperitoneal gas can temporize cardiovascular and respiratory compromise from tension pneumoperitoneum.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.ray-exantus-2021",
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "Expert rescue, not a standardized device, entry-site or needle-size rule. Primary case evidence is limited.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.rescue-is-not-seal",
    "statement": "Improvement after gas decompression does not establish durable closure of the underlying gastrointestinal injury.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.ray-exantus-2021",
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "The primary report required surgery; that outcome is not generalized to every successfully clipped injury. Hospital source-control assessment remains necessary.",
    "applicablePopulation": "Adults with iatrogenic gastrointestinal wall injury; pressure physiology is applied to the constructed adult procedural case.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.gas-compartment",
    "statement": "A gastric tube decompresses the stomach lumen rather than the peritoneal space.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.ray-exantus-2021"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "low",
    "limitation": "Anatomical inference supported by the reported persistence of a tense abdomen despite gastric-tube use; not a comparative trial.",
    "applicablePopulation": "Adults with gastrointestinal perforation in the stated procedural context.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.esophageal-support",
    "statement": "Esophageal perforation care includes withheld oral intake, antimicrobial/supportive treatment and access to expert surgical assessment.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-esophagus-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "No exact drug, dose or duration; endoscopic closure does not authorize routine ASC discharge.",
    "applicablePopulation": "Adults with gastrointestinal perforation in the stated procedural context.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.colonic-contrast-assessment",
    "statement": "In a stable patient with localized findings, contrast CT can assess colonic leakage and free fluid when considering nonoperative care.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "A negative leak study does not guarantee durable closure or replace serial clinical review.",
    "applicablePopulation": "Adults with gastrointestinal perforation in the stated procedural context.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.limit-extraluminal-insufflation",
    "statement": "Prompt colonic closure and careful insufflation can reduce further gas escape outside the bowel.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "No insufflation pressure or flow target is specified.",
    "applicablePopulation": "Adults with gastrointestinal perforation in the stated procedural context.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.endoscopic-perforation-and-injury.closure-contamination-distinction",
    "statement": "Endoscopic sealing of a colonic defect does not itself remove fecal material that has already escaped outside the bowel.",
    "sourceIds": [
      "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "Independent anatomical/source-control synthesis from the already verified WSES contamination and surgical-management principles. It does not prove that a particular closure device will fail or prescribe a specific operation.",
    "applicablePopulation": "Adults with colonoscopy perforation and observed fecal contamination.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12",
    "verificationMode": "offline_mapping_to_previously_verified_WSES_claims",
    "derivedFromClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.colonic-surgical-boundary"
    ]
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.pancreatic-access-risk",
    "statement": "Repeated unintended pancreatic instrumentation during biliary ERCP increases concern for post-ERCP pancreatitis.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.dgvs-prophylaxis-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Qualitative procedural risk only; no exact probability, demographic weighting or attempt threshold authored.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.pancreatic-stent-prophylaxis",
    "statement": "Temporary pancreatic duct stenting is supported for high-risk ERCP, including repeated pancreatic access, even after rectal NSAID prophylaxis.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.dgvs-prophylaxis-2025",
      "source.intraop.ercp-access-and-adverse-events.yin-2016"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The additive-to-NSAID boundary has one direct current society source. Yin independently supports stenting in selected high-risk adults but not that incremental comparison. Technical placement and follow-up need clinician review.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.hydration-not-substitute",
    "statement": "Increasing intravenous fluid prophylaxis does not replace the indicated pancreatic stent decision after high-risk pancreatic instrumentation.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.dgvs-prophylaxis-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "Limited ranking from the current recommendation to add a stent; no universal head-to-head inferiority of hydration, fluid regimen or contraindication protocol claimed.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.rescue-access-alternatives",
    "statement": "Several advanced approaches can be used for difficult biliary cannulation; the access history by itself does not establish one universal best technique.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.dgvs-prophylaxis-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Consensus names precut, double-wire and transpancreatic approaches. No unverified morphology rule, competence cutoff or rescue hierarchy is keyed.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.periampullary-pattern",
    "statement": "Contrast escaping beside a fresh sphincterotomy can indicate a periampullary ERCP injury, distinct from a distant duodenal-wall tear.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.heo-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Primary cohort context supports injury type. The fictional contrast observation is not a fluoroscopic image or proof of precise defect dimensions.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care",
    "statement": "Suspected upper gastrointestinal procedural perforation requires hospital monitoring, fasting, intravenous supportive care and antibiotics with multidisciplinary assessment.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.dgvs-perforation-2025",
      "source.intraop.ercp-access-and-adverse-events.heo-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Shared background care only. No regimen, dose, duration, feeding study or discharge criteria prescribed.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.selected-endoscopic-diversion",
    "statement": "A stable patient with an immediately recognized periampullary injury and established biliary access can be managed initially with transpapillary bile diversion.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.dgvs-perforation-2025",
      "source.intraop.ercp-access-and-adverse-events.heo-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Injury- and physiology-dependent. DGVS gives a general selection framework; the primary cohort supplies ERCP experience. No universal advantage over surgery or percutaneous routes asserted.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.no-covered-stent-superiority",
    "statement": "Conventional diversion and covered metal stents are both used for type II ERCP injury; comparative cohort findings do not establish a universal covered-stent advantage.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.heo-2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "One small retrospective cohort; nonsignificance is not equivalence. Device superiority remains unkeyed, including in view of differing conclusions in a restricted-license cohort excluded from new evidence.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.collection-after-diversion",
    "statement": "A localized fluid collection can require separate source control despite functioning transpapillary biliary drainage.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.heo-2024"
    ],
    "evidenceCategory": "presentation",
    "certainty": "low",
    "limitation": "One primary cohort reports collection drainage. Duct drainage and extraluminal collection drainage are separate targets; no frequency or guaranteed outcome inferred.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.collection-percutaneous",
    "statement": "A symptomatic localized retroperitoneal collection after ERCP injury can be treated with image-guided catheter drainage when the patient's condition and access route permit.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.heo-2024",
      "source.intraop.ercp-access-and-adverse-events.dgvs-perforation-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "ERCP-specific evidence is observational. Current guidance treats failed or infeasible catheter drainage as an escalation boundary; no catheter dimensions or exact route prescribed.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.failed-source-control-surgery",
    "statement": "Worsening condition, generalized peritoneal findings or failed nonsurgical source control after endoscopic perforation supports prompt operative management.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.dgvs-perforation-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Exact escalation boundary uses one current society consensus. No universal incision, repair, reconstruction or numeric physiological trigger specified.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.ct-injury-assessment",
    "statement": "CT can characterize extraluminal fluid and continuing leakage after suspected endoscopic perforation to inform treatment selection.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.dgvs-perforation-2025",
      "source.intraop.ercp-access-and-adverse-events.heo-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Already acquired outside hospital observations only. No enacted test, oral-contrast dose, sensitivity estimate or delay introduced.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.ercp-access-and-adverse-events.sphincterotomy-margin-origin",
    "statement": "An injury observed at an incised papillary margin is a periampullary injury context, distinct from injury to the upstream duct wall by instrumentation.",
    "sourceIds": [
      "source.intraop.ercp-access-and-adverse-events.heo-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "The primary cohort distinguishes perivaterian injury from ductal and distant wall injury. The exact new cut-margin observations are constructed record data requiring clinical confirmation; no real fluoroscopic image, defect measurement or device-superiority inference is supplied.",
    "applicablePopulation": "Adult hospital ERCP; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.sliding-wall",
    "statement": "A sliding groin hernia may incorporate bowel or bladder in the sac boundary.",
    "sourceIds": [
      "source.intraop.groin-hernia.iehs2011",
      "source.intraop.groin-hernia.scrotal2023",
      "source.intraop.groin-hernia.sliding2024"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "The current licensed case supports visceral-wall incorporation only. The constructed sigmoid wall-continuity application and surgical plane require clinician review; no diagnostic-accuracy or frequency claim is made.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.sliding-plane",
    "statement": "Preperitoneal mobilization can reduce sliding contents without first separating their intraperitoneal attachments.",
    "sourceIds": [
      "source.intraop.groin-hernia.iehs2011"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One adequate directly targeted guideline found for this precise plane comparison; older expert technical evidence, not independently replicated management superiority.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.cord-sac",
    "statement": "An adherent distal sac may be left after division through a free segment when complete dissection threatens cord structures.",
    "sourceIds": [
      "source.intraop.groin-hernia.iehs2011",
      "source.intraop.groin-hernia.scrotal2023",
      "source.intraop.groin-hernia.lichtenstein2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Selective strategy, not routine abandonment; current scrotal guidance is very low certainty and partly builds on IEHS.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.distal-seroma",
    "statement": "Retaining a divided distal sac can increase postoperative seroma risk.",
    "sourceIds": [
      "source.intraop.groin-hernia.scrotal2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "Single current targeted guideline; a probable tradeoff with limited evidence, not an exact risk or inevitable outcome.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.cord-fat-origin",
    "statement": "Preperitoneal fat can extend through the deep ring inside cord fascia without a substantial peritoneal sac.",
    "sourceIds": [
      "source.intraop.groin-hernia.cordfat2020"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Narrative synthesis of cadaveric and clinical observations; no prevalence or automatic benign-tumor inference is used.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.cord-fat-search",
    "statement": "A protrusion larger than the operative sac warrants a search for cord-associated fat.",
    "sourceIds": [
      "source.intraop.groin-hernia.cordfat2020",
      "source.intraop.groin-hernia.iehs2011"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The target must be reconciled with observed anatomy; this does not mandate reduction rather than resection.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.cord-fat-protection",
    "statement": "Cord-associated fat lies near the vas and spermatic vessels, which require protection during dissection.",
    "sourceIds": [
      "source.intraop.groin-hernia.cordfat2020",
      "source.intraop.groin-hernia.lichtenstein2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "General adult anatomy; does not verify every microscopic fascial plane or a pediatric adaptation.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.groin-landmarks",
    "statement": "Medial inguinal defects, the deep canal and the femoral compartment occupy different operative search regions.",
    "sourceIds": [
      "source.intraop.groin-hernia.iehs2011"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Targeted technical landmarks support the competing regions; a scan finding alone does not dictate a repair technique.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.bladder-sign",
    "statement": "New gas in a catheter drainage bag during laparoscopic groin dissection can indicate bladder injury.",
    "sourceIds": [
      "source.intraop.groin-hernia.iehs2011"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "One directly targeted groin guideline; a warning sign rather than a sufficient stand-alone diagnosis.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.bladder-fill",
    "statement": "Retrograde dyed fluid through a urethral catheter can reveal a bladder leak in the operative field.",
    "sourceIds": [
      "source.intraop.groin-hernia.wses2023",
      "source.intraop.groin-hernia.iehs2011"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "WSES concerns emergency digestive surgery; applies here to the same organ-level diagnostic maneuver without dose or volume claims.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.ureter-testing",
    "statement": "Intravenous urinary dye and retrograde ureteric pyelography are methods for evaluating suspected ureteric injury.",
    "sourceIds": [
      "source.intraop.groin-hernia.wses2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single targeted current guideline; these methods are not interchangeable with direct bladder filling and require appropriate expertise/resources.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.corona-course",
    "statement": "An obturator artery arising from inferior-epigastric or external-iliac territory may traverse the retropubic ramus.",
    "sourceIds": [
      "source.intraop.groin-hernia.corona2022"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Primary cadaveric evidence supports origin/course; no prevalence, exact distance or bleeding-control rule is inferred.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.intraperitoneal-repair",
    "statement": "A recognized major intraperitoneal surgical bladder opening generally requires direct repair and catheter decompression.",
    "sourceIds": [
      "source.intraop.groin-hernia.wses2023",
      "source.intraop.groin-hernia.iehs2011"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The current guideline and separate older groin guideline agree on repair; approach, suture layers and catheter duration are not adjudicated.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "parked_only"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.extraperitoneal-boundary",
    "statement": "Selected uncomplicated contained bladder injuries can be managed conservatively, unlike a gaping intraperitoneal surgical defect.",
    "sourceIds": [
      "source.intraop.groin-hernia.wses2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current targeted source; some small uncomplicated postoperative intraperitoneal injuries also qualify, so no blanket all-intraperitoneal rule is taught.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "parked_only"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.viable-wall",
    "statement": "Viable bladder wound edges support repair rather than routine removal of the injured herniated segment.",
    "sourceIds": [
      "source.intraop.groin-hernia.wses2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Original application of direct-repair guidance to observed viable wall. A separate lesion or devitalization could change the operation; exact closure-versus-resection ranking needs clinician confirmation.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "parked_only"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.regular-obturator-origin",
    "statement": "The usual obturator artery originates from internal-iliac territory.",
    "sourceIds": [
      "source.intraop.groin-hernia.corona2022"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Standard anatomical course distinguishes the offered labels; variation prevents using a single landmark as an absolute rule.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.epigastric-course",
    "statement": "The inferior epigastric trunk ascends toward the anterior abdominal wall.",
    "sourceIds": [
      "source.intraop.groin-hernia.iehs2011",
      "source.intraop.groin-hernia.corona2022"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Standard anatomical course distinguishes the offered labels; variation prevents using a single landmark as an absolute rule.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.ring-release-boundary",
    "statement": "A hernia-ring relaxing incision targets a constricting aperture when release is needed for reduction.",
    "sourceIds": [
      "source.intraop.groin-hernia.iehs2011"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly targeted older technical guideline describes selective relaxing incisions. Ranking it below attachment mobilization in the constructed slack-neck scene is an original clinical application requiring clinician confirmation.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "revision_round1_offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.dense-sac-plane",
    "statement": "Dense adherence of a distal hernia sac to cord structures can make complete sac dissection hazardous.",
    "sourceIds": [
      "source.intraop.groin-hernia.iehs2011",
      "source.intraop.groin-hernia.scrotal2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "Sources support the general dense-adherence boundary, not a validated maneuver, visual score or traction threshold. The specific fibrotic shared-wall observation is constructed and requires clinician plausibility review.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "revision_round1_offered_draft"
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.groin-hernia.arterial-communication",
    "statement": "Arterial corona mortis describes a retropubic communication between obturator and external-iliac or inferior-epigastric arterial territories.",
    "sourceIds": [
      "source.intraop.groin-hernia.corona-clinical2024"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "The term can describe a communicating vessel without proving replacement or absence of the usual obturator artery. This identification is a focused rule pending educational-role acceptance; no bleeding-control ranking is derived.",
    "applicablePopulation": "Adults undergoing groin or pelvic surgery; hospital emergency observations are reviewed in clinic, not performed locally.",
    "lastCheckedOn": "2026-11-12",
    "authoringUse": "revision_round1_offered_draft"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.initial-entry",
    "statement": "The initial Veress pressure and free gas influx help assess intraperitoneal placement; an immediate high-pressure, minimal-inflow episode does not establish a working intraperitoneal cavity.",
    "sourceIds": [
      "source.intraop.lap-access.dutch-entry-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single directly verified multidisciplinary guideline; supporting initial-pressure study is observational. No invented numeric cutoff or case-specific flow threshold.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.entry-reassessment",
    "statement": "When initial access has not been established, reassess the access route before continuing insufflation or advancing a trocar.",
    "sourceIds": [
      "source.intraop.lap-access.dutch-entry-2012",
      "source.intraop.lap-access.alkatout-entry-2017"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Original synthesis of placement confirmation and alternative-entry recommendations. Does not mandate one open or closed technique or a number of attempts.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.pressure-context",
    "statement": "Insufflation pressure decisions depend on entry phase, exposure and patient tolerance; pressure or flow adjustment is not a substitute for verified access or control of a developing complication.",
    "sourceIds": [
      "source.intraop.lap-access.dutch-entry-2012",
      "source.intraop.lap-access.ott-tissue-gas-2014"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No universal safe-pressure number, automatic conversion trigger or exact flow prescription is asserted. Flow-control counterfactuals synthesize the reviewed pressure/flow relationship; no manufacturer-specific algorithm is asserted.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.tissue-gas",
    "statement": "A misplaced or loose port can permit extraperitoneal CO2 spread, with palpable tissue gas and additional systemic CO2 uptake.",
    "sourceIds": [
      "source.intraop.lap-access.ott-tissue-gas-2014",
      "source.intraop.lap-access.dutch-entry-2012"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Narrative evidence; these findings do not determine the exact anatomic route or exclude a concurrent thoracic complication.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.tissue-response",
    "statement": "Progressive tissue gas with a continuing CO2 rise warrants reducing the insufflation burden and evaluating the entry route while ventilation and cardiopulmonary assessment continue.",
    "sourceIds": [
      "source.intraop.lap-access.ott-tissue-gas-2014",
      "source.intraop.lap-access.dutch-entry-2012"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Pause-and-port-reassessment wording is an original practical synthesis. No directly verified trial ranks pause versus conversion in this exact fictional presentation; clinician review of the boundary is required.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.hypercarbia-boundary",
    "statement": "A gradual CO2 rise during insufflation can reflect absorbed gas; ventilatory adjustment with reassessment is appropriate for a stable isolated load, while new deterioration requires reconsidering the cause.",
    "sourceIds": [
      "source.intraop.lap-access.park-embolism-2012",
      "source.intraop.lap-access.srivastava-physiology-2010",
      "source.intraop.lap-access.ott-tissue-gas-2014"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "General physiology and narrative management evidence, not proof that any particular patient has an uncomplicated course. No tidal-volume or respiratory-rate prescription.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.embolism-presentation",
    "statement": "Gas entering injured vessels at access can cause abrupt circulatory collapse, hypoxemia and changing expired CO2.",
    "sourceIds": [
      "source.intraop.lap-access.park-embolism-2012",
      "source.intraop.lap-access.alkatout-entry-2017"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "The pattern warrants suspicion rather than a definitive diagnosis; ordinary pressure effects, hemorrhage and anesthetic causes remain part of emergency assessment.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.embolism-stop",
    "statement": "Suspected CO2 embolism requires immediate cessation of insufflation and release of pneumoperitoneum alongside oxygenation and circulatory support.",
    "sourceIds": [
      "source.intraop.lap-access.park-embolism-2012",
      "source.intraop.lap-access.bao-embolism-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No current dedicated formal guideline was retrieved. Main direct source is a 2012 narrative review with independent case-report corroboration; source-control must not await confirmatory monitoring.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.co2-monitor-limit",
    "statement": "Expired CO2 may rise or fall during CO2 embolism, so its direction alone cannot establish or exclude the event.",
    "sourceIds": [
      "source.intraop.lap-access.park-embolism-2012",
      "source.intraop.lap-access.bao-embolism-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The corroborating publication is one case; no diagnostic accuracy estimate or obligatory biphasic sequence is implied.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.wall-source",
    "statement": "Port placement can injure abdominal-wall vessels, and a visible tract-related stream supports a local source distinct from a deep expanding hematoma.",
    "sourceIds": [
      "source.intraop.lap-access.alkatout-entry-2017",
      "source.intraop.lap-access.sasgog-trocar-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The cannula release/re-seat response is constructed teaching data consistent with tamponade, not a validated diagnostic test.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.wall-control",
    "statement": "A visible abdominal-wall port bleed can be controlled locally under vision, including hemostatic suturing; escalation depends on source visibility, control and patient physiology.",
    "sourceIds": [
      "source.intraop.lap-access.alkatout-entry-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single directly verified narrative source for the named local suture technique. No technique-superiority claim; exact source localization and distractor ranking need clinician confirmation.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.trocar-release",
    "statement": "Trocar withdrawal under direct observation helps reveal bleeding temporarily hidden by the cannula or working pressure.",
    "sourceIds": [
      "source.intraop.lap-access.dutch-entry-2012",
      "source.intraop.lap-access.alkatout-entry-2017"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Technical guidance and narrative evidence; a temporarily quiet field is not an independently validated hemostasis test.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.major-injury",
    "statement": "An enlarging retroperitoneal hematoma with recurrent circulatory instability after access raises concern for uncontrolled major vascular injury.",
    "sourceIds": [
      "source.intraop.lap-access.alkatout-entry-2017",
      "source.intraop.lap-access.sasgog-trocar-2026"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Does not identify the injured vessel. Fictional recurrent response and visibility observations support the decision boundary rather than a numeric shock threshold.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.major-control",
    "statement": "Major access bleeding that is not promptly exposed and controlled laparoscopically requires urgent open control and vascular assistance rather than prolonged ineffective minimally invasive attempts.",
    "sourceIds": [
      "source.intraop.lap-access.sasgog-trocar-2026",
      "source.intraop.lap-access.alkatout-entry-2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Current society advice plus independent narrative review. Selected stable, exposed injuries may permit laparoscopic repair; the draft supplies expansion, incomplete exposure and recurrent instability.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.trocar-retain",
    "statement": "An implicated trocar should remain in position during initial evaluation and exposure of a suspected access injury until removal can occur with control.",
    "sourceIds": [
      "source.intraop.lap-access.sasgog-trocar-2026",
      "source.intraop.lap-access.alkatout-entry-2017"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Direct society instruction supports retention; the possible tamponade rationale is also consistent with guideline withdrawal cautions. Not a rule to retain an instrument indefinitely after control.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; pediatric extrapolation excluded.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.initial-opening-pressure",
    "statement": "The reviewed multidisciplinary guideline uses an initial Veress pressure below 10 mmHg followed by free CO2 inflow to support intraperitoneal placement before continued insufflation.",
    "sourceIds": [
      "source.intraop.lap-access.dutch-entry-2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The exact below-10 criterion was freshly checked in the source recommendations. Based on observational evidence; not a universal pressure target for a later operative phase. No exact flow or waiting interval is invented.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.hemostasis-check",
    "statement": "At completion, a bleeding check should release cannula tamponade under direct vision and reduce pneumoperitoneum pressure while arterial pressure is adequate.",
    "sourceIds": [
      "source.intraop.lap-access.dutch-entry-2012",
      "source.intraop.lap-access.madhok-safety-2022",
      "source.intraop.lap-access.lasser-complications-2012"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Technical guidance plus two narrative reviews support the released-tamponade assessment. The exact fictional completion decision still needs clinician confirmation; no pressure number, blood-pressure cutoff or device-superiority rule is asserted.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.access-cannula-retention",
    "statement": "When an access cannula remains at a suspected deep vascular injury, preserve its position during initial exposure until removal can occur with bleeding controlled.",
    "sourceIds": [
      "source.intraop.lap-access.sasgog-trocar-2026",
      "source.intraop.lap-access.lasser-complications-2012"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Retention depends on the cannula actually remaining at the injury, not on the site of a previous track. The fictional outer-cannula/removed-obturator scene is constructed data and needs exact clinician confirmation.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.lap-access.completion-after-dry-check",
    "statement": "A port tract remaining dry after cannula withdrawal and reduced insufflation at adequate arterial pressure supports hemostatic completion; recurrent bleeding requires further local control before closure.",
    "sourceIds": [
      "source.intraop.lap-access.dutch-entry-2012",
      "source.intraop.lap-access.madhok-safety-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Original application of guideline withdrawal checks and narrative completion guidance to constructed patient observations. These sources do not compare an extra suture with skin closure in this exact case; the conclusion is not a device-superiority rule and requires clinician confirmation.",
    "applicablePopulation": "Adults undergoing abdominal laparoscopy; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.asc-field-restoration",
    "statement": "Gauze pressure with removal of pooled blood can temporize cholecystectomy bleeding while the surgeon regains a view of its source.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.abdallah-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One directly adequate technical review; no comparative trial or universal compression duration is asserted.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.asc-unseen-instrument",
    "statement": "Clipping or applying energy to an unseen bleeding target near biliary structures can extend vascular or duct injury.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.abdallah-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Direct technical-review support; no rate or specific energy setting is inferred.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.asc-targeted-control",
    "statement": "A bleeding vessel can be selectively secured after its identity and surrounding structures are visualized.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.abdallah-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Does not establish that an unspecified major vessel can be repaired in an ASC.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.pringle-inflow",
    "statement": "Occlusion of the hepatoduodenal ligament reduces portal venous and hepatic arterial inflow to the liver.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.wses-liver-2020",
      "source.intraop.operative-hemorrhage.ball-2021"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.pringle-posterior",
    "statement": "Persistent bleeding from behind the liver during inflow occlusion raises concern for hepatic venous or retrohepatic caval injury.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.wses-liver-2020",
      "source.intraop.operative-hemorrhage.ball-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Raises suspicion rather than proving an exact vessel or excluding an inadequately controlled variant artery.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.pringle-variant-artery",
    "statement": "Ongoing bleeding despite a Pringle maneuver can also reflect an aberrant hepatic arterial supply.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.wses-liver-2020",
      "source.intraop.operative-hemorrhage.ball-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "A failed maneuver alone cannot identify a venous source; the posterior location and response to compression matter.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.hepatic-packing",
    "statement": "Perihepatic packing offers temporary control of severe hepatic venous hemorrhage.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.wses-liver-2020",
      "source.intraop.operative-hemorrhage.ball-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Temporary damage control, not a universal substitute for definitive repair of uncontrolled bleeding.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.hepatic-repacking",
    "statement": "When unpacking restarts liver bleeding that is controlled by packing, repacking can support staged care while physiological derangements are corrected.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.ball-2021",
      "source.intraop.operative-hemorrhage.wses-liver-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No fixed re-exploration interval or duration of inflow occlusion is taught.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.hepatic-repair-boundary",
    "statement": "Direct juxtahepatic venous repair is technically demanding, and complete hepatic vascular exclusion can be poorly tolerated during ongoing hemodynamic instability.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.wses-liver-2020",
      "source.intraop.operative-hemorrhage.ball-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": null,
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.hepatic-arterial-ligation",
    "statement": "Selective hepatic arterial ligation is an option for identified arterial injury when repair is not feasible.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.wses-liver-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single guideline for this exact boundary; this is not evidence to ligate an artery for undifferentiated posterior bleeding.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.splenic-traction",
    "statement": "Traction during gastric mobilization can produce an iatrogenic capsular or parenchymal splenic tear.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.latif-2026"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Procedure-specific narrative synthesis; no incidence or patient demographic weight is used.",
    "applicablePopulation": "Adults undergoing sleeve gastrectomy",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.splenic-local-repair",
    "statement": "Selected iatrogenic splenic injuries may be treated with local repair, including suturing or topical hemostatic measures, when physiology and injury extent permit.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.latif-2026",
      "source.intraop.operative-hemorrhage.koide-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One directly applicable iatrogenic review plus an independent trauma-based cross-check. No graded iatrogenic guideline, exact salvage threshold or superior material is established.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.splenic-partial-boundary",
    "statement": "Limited polar resection is a potential splenic salvage approach in selected stable patients with an injury confined to a pole.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.koide-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single narrative source, largely trauma. This is a conditional counterfactual, not an endorsed algorithm or a universal preference over repair; adult operative-salvage guideline uncertainty remains.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.splenic-hilar-boundary",
    "statement": "A deep central injury involving the splenic hilum may preclude useful local or polar salvage.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.koide-2024",
      "source.intraop.operative-hemorrhage.latif-2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Anatomy and the actual response to attempted control must be evaluated; no grade alone establishes irreparability.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.splenic-total-control",
    "statement": "Extensive splenic disruption with major continuing hemorrhage can require splenectomy.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.latif-2026",
      "source.intraop.operative-hemorrhage.koide-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Procedure-specific narrative support plus independent review; choice is conditional on observed anatomy, failed repair and ongoing physiological deterioration.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.splenic-instability",
    "statement": "Ongoing splenic hemorrhage with failure to sustain circulation requires prompt operative hemorrhage control.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.latif-2026",
      "source.intraop.operative-hemorrhage.wses-spleen-2017",
      "source.intraop.operative-hemorrhage.sbait-2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "The guidelines principally address trauma; they cross-check the physiological boundary and do not supply an elective iatrogenic salvage protocol.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.splenic-guideline-uncertainty",
    "statement": "Adult trauma guidelines do not establish a uniform recommendation for operative splenic preservation.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.wses-spleen-2017",
      "source.intraop.operative-hemorrhage.sbait-2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "conflicting",
    "limitation": "WSES describes adult operative salvage as debated; SBAIT uses differing language in sections 3.1/3.2 and excludes intraoperative-diagnosis contexts. Withhold any blanket adult-trauma salvage teaching rule.",
    "applicablePopulation": "Adults in the specified operative context; not pediatric extrapolation",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.operative-hemorrhage.splenic-packing-limitation",
    "statement": "Temporary splenic packing has limited supporting evidence and may be considered in selected damage-control trauma cases when packing controls hemorrhage amid competing bleeding sources.",
    "sourceIds": [
      "source.intraop.operative-hemorrhage.sbait-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One trauma guideline. Its methods exclude pre/intraoperative-diagnosis contexts, so this supports a conditional distractor and limitation, not a verified protocol or direct comparative ranking for iatrogenic sleeve injury.",
    "applicablePopulation": "Selected adult damage-control trauma cases; iatrogenic extension requires clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.older-child-pattern.20261112.v1",
    "statement": "Food impaction and solid-food dysphagia can be manifestations of pediatric EoE.",
    "sourceIds": [
      "source.intraop.i25.naspghan-2015",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "The symptoms raise suspicion; they do not diagnose EoE or determine a sex/race-based selection weight.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.protected-airway.20261112.v1",
    "statement": "Pediatric esophageal retrieval requires appropriate airway protection and a team equipped for the child.",
    "sourceIds": [
      "source.intraop.i25.naspghan-2015",
      "source.intraop.i25.schluckebier-2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "This packet supplies an established protected airway; it does not teach induction, intubation, dose rules or criteria for ASC credentialing.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.revision1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.fragmented-bolus.20261112.v1",
    "statement": "Controlled piece-by-piece oral retrieval is an option for pediatric esophageal food-bolus clearance.",
    "sourceIds": [
      "source.intraop.i25.naspghan-2015",
      "source.intraop.i25.schluckebier-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "The sources provide descriptive clearance guidance. In this item, actual successful retention and remaining enclosure access determine the offered strategy ranking, which requires pediatric endoscopist review.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.push-view.20261112.v1",
    "statement": "A pediatric food-bolus push maneuver requires a directly visualized distal esophageal lumen.",
    "sourceIds": [
      "source.intraop.i25.schluckebier-2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "Single accessible pediatric procedural review directly supports this ranking boundary; do not infer that all push techniques are prohibited. The inaccessible 2026 paper is not used as corroboration.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.index-sampling.20261112.v1",
    "statement": "After pediatric food-bolus clearance, esophageal tissue sampling evaluates an underlying cause such as EoE.",
    "sourceIds": [
      "source.intraop.i25.naspghan-2015",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Clinical safety can justify deferral; this constructed case has an established ongoing examination and no acquired contraindication. No universal biopsy-safety rate is asserted.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.patchy-distribution.20261112.v1",
    "statement": "Pediatric EoE can have uneven esophageal involvement, so a distal collection does not represent other levels.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Distribution recommendations differ in detail; both support upper and lower sampling. No claim that a negative single level excludes disease.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.revision1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.initial-biopsy-protocol.20261112.v1",
    "statement": "Initial suspected childhood EoE assessment uses at least six esophageal biopsies distributed across levels.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "ESPGHAN supports at least six biopsies across upper and lower levels. SIGENP specifies two at each of three levels during initial evaluation. The offered plan adds two proximal and two middle biopsies to two recorded distal acquisitions, satisfying both approaches. This application concerns the constructed acquisition log.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.appearance-limit.20261112.v1",
    "statement": "A visually smooth esophagus does not remove the need for appropriate biopsies when pediatric EoE is suspected.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No frequency of normal endoscopy is encoded. Smooth appearance is a plausible stopping error, not a histologic result.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.ppi-confounding.20261112.v1",
    "statement": "PPI treatment can reduce diagnostic findings, so treatment before an incomplete initial tissue evaluation can complicate exclusion of EoE.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No dose or washout interval is authored. The case is initially untreated; a child already receiving therapy needs a separately assessed plan.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.anatomy-before-dilation.20261112.v1",
    "statement": "Barium esophagram is recommended before pediatric EoE dilation when endoscopy cannot define the anatomy or caliber.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The 2024 recommendation is direct. The 2025 practice point supports complementary luminal assessment, rather than an identical mandatory rule. No diameter, dilator size or fluoroscopy capability is invented.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.structural-histology.20261112.v1",
    "statement": "Inflammatory tissue improvement does not establish that a persistent pediatric esophageal narrowing has resolved.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Histology and lumen answer different questions; the supplied observations do not prove a specific fibrotic mechanism.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.motility-scope.20261112.v1",
    "statement": "Esophageal manometry evaluates motility rather than defining the extent of an endoscopically incompletely seen fixed narrowing.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Patient-specific ordering is a clinical application. Manometry can be appropriate for persistent symptoms after structural assessment; it is not categorically excluded from EoE care.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.biopsy-scope.20261112.v1",
    "statement": "Repeating mucosal biopsies can reassess inflammation but does not map the full extent of an untraversed narrowing.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Existing samples remain valid within their stated territory; this is a distinction in the question answered, not a claim that repeat biopsy is never useful.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i25.topical-response.20261112.v1",
    "statement": "Swallowed topical corticosteroid treatment can improve histologic activity in pediatric EoE.",
    "sourceIds": [
      "source.intraop.i25.espghan-eoe-2024",
      "source.intraop.i25.sigenp-eoe-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Budesonide appears as established historical care with documented response, not a newly prescribed regimen, treatment interval or escalation threshold.",
    "applicablePopulation": "Children and adolescents; authored profiles limited to ages 5-17 with existing compatible child art",
    "lastCheckedOn": "2026-11-13"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.device-fit.20261112.v1",
    "statement": "Retrieval-device selection in children depends on the object, its location and the usable endoscopic working space.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.lee-devices-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Technique is operator- and patient-dependent; a fictional device-fit comparison needs clinician review.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.flat-coin-forceps.20261112.v1",
    "statement": "A flat coin can be captured at its edge with appropriately sized grasping forceps.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.lee-devices-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No exclusive superiority over every net or snare is claimed; the case supplies restricted deployment space.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.round-object-net.20261112.v1",
    "statement": "A retrieval net can enclose a smooth rounded gastric object that slips from a point grasp.",
    "sourceIds": [
      "source.intraop.i24.lee-devices-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single independent pediatric device publication for this shape-specific application; device preference and case selection confound comparative outcomes.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.long-object-snare.20261112.v1",
    "statement": "A snare may provide a secure capture for an elongated object that remains inside its loop.",
    "sourceIds": [
      "source.intraop.i24.lee-devices-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single-source technical counterfactual; not a rule that snares cannot retrieve rounded objects.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.child-procedure-support.20261112.v1",
    "statement": "Pediatric foreign-body endoscopy needs appropriately sized equipment, an experienced operator and suitable airway support.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.lee-devices-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Sources do not certify this clinic or establish that all emergencies are suitable for an ASC.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.retained-blunt-object.20261112.v1",
    "statement": "Persistent gastric retention or symptoms can justify planned removal of a blunt foreign body.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No exact size or duration threshold is used; this packet tests an already selected retrieval checkpoint, not an indication algorithm.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.battery-injury-assessment.20261112.v1",
    "statement": "After esophageal battery removal, the depth and location of visible injury affect further assessment.",
    "sourceIds": [
      "source.intraop.i24.espghan-battery-2021",
      "source.intraop.i24.naspghan-2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The endoscopic view cannot by itself establish the full depth or exclude adjacent-organ injury.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.battery-cross-sectional.20261112.v1",
    "statement": "Severe esophageal battery injury warrants cross-sectional assessment of surrounding tissues and nearby vessels.",
    "sourceIds": [
      "source.intraop.i24.espghan-battery-2021",
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "CTA is the best offered study for the constructed arch-level injury; MRI after removal is another possible modality and is not offered as a competing correct answer. Guidelines partly share evidence.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.battery-swallow-role.20261112.v1",
    "statement": "An esophagram can assess leakage before oral intake but does not replace assessment of adjacent vascular involvement.",
    "sourceIds": [
      "source.intraop.i24.espghan-battery-2021",
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No exact imaging interval, feeding rule or tissue-distance threshold is authored.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.battery-observation.20261112.v1",
    "statement": "Esophageal injury after battery removal requires hospital monitoring for evolving complications.",
    "sourceIds": [
      "source.intraop.i24.espghan-battery-2021",
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "Monitoring and follow-up are individualized; no fixed duration or unqualified discharge rule.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.magnet-number.20261112.v1",
    "statement": "Overlapping magnets can make the number on a single radiographic projection misleading.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Orthogonal views improve assessment but do not guarantee a complete count. Post-retrieval application is original clinical synthesis.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.magnet-plain-imaging.20261112.v1",
    "statement": "Plain abdominal radiographs are an initial method for assessing retained radiopaque magnets and their location.",
    "sourceIds": [
      "source.intraop.i24.mahtas-2025",
      "source.intraop.i24.naspghan-2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "A repeat count after limited retrieval is an application, not a quoted post-removal protocol. CT is appropriate when complication or localization uncertainty requires it.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.magnet-cross-wall-injury.20261112.v1",
    "statement": "Multiple magnets may attract across separate bowel walls and cause pressure injury or perforation.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.alansari-magnets-2024",
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "No exact risk, demographic weight or time-to-injury is inferred.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.magnet-operative-escalation.20261112.v1",
    "statement": "Suspected bowel perforation with retained magnets calls for pediatric surgical management rather than continued passage observation.",
    "sourceIds": [
      "source.intraop.i24.mahtas-2025",
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.alansari-magnets-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Operative approach and extent depend on findings; this draft does not prescribe a laparotomy, bowel resection or exact rescue timeline.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.magnet-complication-ct.20261112.v1",
    "statement": "CT can define a suspected foreign-body complication beyond the endoscopically examined lumen.",
    "sourceIds": [
      "source.intraop.i24.mahtas-2025",
      "source.intraop.i24.alansari-magnets-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Government guidance and an independent cohort describe CT for complicated cases; no routine CT clearance protocol or exact threshold is asserted.",
    "applicablePopulation": "Children and adolescents; new fictional cases limited to ages 5-17 with clinically reviewed art/profile eligibility pending.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.battery-luminal-followup.20261112.v1",
    "statement": "Repeat endoscopy or contrast esophagography may evaluate later luminal healing and stricture after esophageal battery injury.",
    "sourceIds": [
      "source.intraop.i24.espghan-battery-2021",
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No exact follow-up interval or automatic test for every child is specified.",
    "applicablePopulation": "Children and adolescents; new fictional cases ages 5-17.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.radiolucent-ultrasound.20261112.v1",
    "statement": "Ultrasonography can help assess selected radiolucent ingested objects or a focal abdominal question.",
    "sourceIds": [
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single government synthesis; this does not establish a whole-bowel ultrasound clearance protocol for metallic magnets.",
    "applicablePopulation": "Children and adolescents; new fictional cases ages 5-17.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.magnet-distal-endoscopy.20261112.v1",
    "statement": "Specialist enteroscopic or colonoscopic retrieval can be considered for selected distal magnets when anatomy and complication assessment permit.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single pediatric specialty guideline for this counterfactual; availability and expertise vary. Not an alternative to operative management of suspected perforation.",
    "applicablePopulation": "Children and adolescents; new fictional cases ages 5-17.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.magnet-distal-observation.20261112.v1",
    "statement": "Selected children with distal magnets and no complication findings may undergo closely supervised serial clinical and radiographic observation.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015",
      "source.intraop.i24.mahtas-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Selection and monitoring differ among guidelines. No exact observation interval, progression cutoff or discharge rule is authored.",
    "applicablePopulation": "Children and adolescents; new fictional cases ages 5-17.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.magnet-extraluminal-gas.20261112.v1",
    "statement": "Localized gas outside the bowel on CT can indicate perforation in a child with ingested magnets.",
    "sourceIds": [
      "source.intraop.i24.alansari-magnets-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single independently licensed pediatric cohort discussion for this imaging sign. Absence of free gas does not exclude magnet-related perforation; no sensitivity is inferred.",
    "applicablePopulation": "Children and adolescents; new fictional cases ages 5-17.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.battery-catheter-angiography.20261112.v1",
    "statement": "Catheter-based aortic assessment can be part of coordinated hospital management when battery-related vascular fistula or severe hemorrhage is suspected.",
    "sourceIds": [
      "source.intraop.i24.espghan-battery-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Single targeted society source describes a hybrid cardiac-catheter/surgical setting; the revised stable-child CTA-versus-catheter ranking is original clinical synthesis requiring pediatric GI/radiology review. No universal sequencing rule is asserted.",
    "applicablePopulation": "Children with potentially severe esophageal battery injury in a hospital capable of vascular rescue.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.i24.retrieval-basket.20261112.v1",
    "statement": "A compatible retrieval basket is among the accessories that may be used for pediatric endoscopic foreign-body capture.",
    "sourceIds": [
      "source.intraop.i24.naspghan-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single pediatric society technical source; it does not establish net-versus-basket superiority for the synthetic marble. That candidate is parked after one revision for exact device-fit and ranking review.",
    "applicablePopulation": "Children with equipment and anatomy suitable for endoscopic foreign-body retrieval.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.electrode-contact",
    "statement": "Surface-electrode EMG acquisition depends on contact between the endotracheal electrodes and the vocal folds.",
    "sourceIds": [
      "source.intraop.thyroid.wojtczak2017",
      "source.intraop.thyroid.chai2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Technical evidence does not establish a neural diagnosis from an absent waveform.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.twitch-recording",
    "statement": "A palpable laryngeal response to stimulation despite absent EMG directs troubleshooting toward the recording pathway.",
    "sourceIds": [
      "source.intraop.thyroid.kinmos2018",
      "source.intraop.thyroid.wojtczak2017"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "A recording-pathway problem includes electrode contact or circuitry; tube displacement is not proven until inspected.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.blockade",
    "statement": "Residual neuromuscular blockade can suppress laryngeal EMG and must be considered when interpreting signal failure.",
    "sourceIds": [
      "source.intraop.thyroid.chai2026",
      "source.intraop.thyroid.kinmos2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No drug dose or quantitative recovery threshold is inferred; visible or palpable muscle responses help rank the available explanations.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.stimulus-reaches-muscle",
    "statement": "A stimulation-associated palpable laryngeal contraction shows that a motor response has occurred despite a missing displayed waveform.",
    "sourceIds": [
      "source.intraop.thyroid.wojtczak2017",
      "source.intraop.thyroid.kinmos2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This is a technical localization clue, not proof of normal postoperative voice.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.distal-bypass",
    "statement": "A response near the laryngeal entry can persist when conduction fails farther proximally in the same recurrent nerve.",
    "sourceIds": [
      "source.intraop.thyroid.kinmos2018"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Single adequate detailed society source for this exact localization boundary; current ATA guidance independently supports using proximal or vagal assessment.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.whole-path",
    "statement": "After the first lobectomy, ipsilateral vagal or proximal recurrent-nerve stimulation assesses the path before contralateral resection.",
    "sourceIds": [
      "source.intraop.thyroid.ata2025",
      "source.intraop.thyroid.wojtczak2017"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "ATA recommendation 23D is good-practice guidance; the independent observational methods corroborate the full-path checkpoint.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.visual-continuity",
    "statement": "An anatomically continuous recurrent nerve need not have preserved electrophysiologic conduction.",
    "sourceIds": [
      "source.intraop.thyroid.kinmos2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate detailed source for the anatomy-versus-function distinction; visual inspection remains part of safe surgery.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.verified-ipsilateral",
    "statement": "Persistent ipsilateral proximal response failure with preserved contralateral response after technical checks supports a true ipsilateral conduction problem.",
    "sourceIds": [
      "source.intraop.thyroid.kinmos2018",
      "source.intraop.thyroid.chai2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Interpretation assumes adequate stimulation and assessment of recording and anesthetic confounders; it does not establish permanence.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.defer-contralateral",
    "statement": "When oncologically acceptable, verified first-side functional loss favors deferring contralateral thyroid resection to reduce bilateral injury risk.",
    "sourceIds": [
      "source.intraop.thyroid.ata2025",
      "source.intraop.thyroid.kinmos2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Distinct guidance publications overlap in expert authors and literature. Advanced invasive disease may require a different balance; it is not the scored setting.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.no-permanence",
    "statement": "An intraoperative loss-of-signal finding does not establish permanent postoperative vocal-fold paralysis.",
    "sourceIds": [
      "source.intraop.thyroid.kinmos2018",
      "source.intraop.thyroid.chai2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The packet teaches neither an exact predictive probability nor a recovery deadline.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.reassess-recovery",
    "statement": "If recurrent-nerve injury is present, the completion decision should account for ipsilateral functional recovery.",
    "sourceIds": [
      "source.intraop.thyroid.ata2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current guideline for this completion recommendation; timing is individualized and no fixed interval is authored.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.bilateral-cancer",
    "statement": "Known cancers in both thyroid lobes can justify a planned total thyroidectomy.",
    "sourceIds": [
      "source.intraop.thyroid.ata2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current society guideline, recommendation 15A; this supplies background context and does not override a new first-side nerve finding.",
    "applicablePopulation": "Adults undergoing monitored thyroid surgery; extent decisions here concern noninvasive, clinically node-negative papillary thyroid cancers with normal baseline vocal-fold movement.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.thyroid.ebsln-target",
    "statement": "The external superior laryngeal nerve supplies the cricothyroid muscle, a different motor target from the recurrent pathway being assessed here.",
    "sourceIds": [
      "source.intraop.thyroid.ata2025",
      "source.intraop.thyroid.chai2026"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "This claim supports a monitoring-site distractor; postoperative pitch localization remains outside the new scored objectives.",
    "applicablePopulation": "Adults undergoing thyroid surgery.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.abnormal-appendix",
    "statement": "An incidentally enlarged or mass-bearing appendix generally warrants diagnostic removal when the abnormality is confined and safe complete excision is feasible.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly applicable current guideline. The claim excludes gross peritoneal disease or an inseparable extra-appendiceal mass; it is not a blanket mandate for appendectomy in those circumstances.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.base-margin",
    "statement": "For a confined appendiceal lesion, involvement of the junction with the cecum may require a cecal cuff to obtain a grossly clear edge.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single directly applicable guideline, recommendation 2. The constructed geometry does not establish a universal cuff size or pathological margin. No bowel length or numerical clearance rule is inferred.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.intact-specimen",
    "statement": "Handling and retrieval of a suspected mucin-filled appendiceal lesion should avoid wall rupture and dispersal of its contents.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ascrs-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "Single guideline. This supports intact retrieval, including a retrieval bag during minimally invasive surgery, without prescribing an unsourced technical maneuver or port dimension.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.histology-before-colectomy",
    "statement": "Gross appendiceal dilation does not establish the histological indication for an oncologic colectomy.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ascrs-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Single guideline. Complete specimen review is needed for definitive classification; the new base-margin node is an initial specimen operation, not a final oncologic-treatment rule.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.mucin-uncertainty",
    "statement": "Gelatinous peritoneal deposits can accompany an appendiceal or other gastrointestinal or gynecologic mucinous neoplasm.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ascrs-2025",
      "source.intraop.unexpected-bowel.sico-2023"
    ],
    "evidenceCategory": "presentation",
    "certainty": "low",
    "limitation": "The appearance raises a diagnostic concern, not proof of tumor origin, grade or cellularity. The patient record remains synthetic and histologically unclassified.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.representative-deposit",
    "statement": "When mucinous peritoneal disease is discovered unexpectedly, representative deposit biopsies can establish tissue diagnosis before definitive treatment planning.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ascrs-2025",
      "source.intraop.unexpected-bowel.sico-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Both society publications support limited diagnostic sampling. SICO also permits technically feasible appendectomy. The revised node compares specified specimen acquisitions, rather than scoring an appendectomy policy; the redundant cecal-plaque detail is removed. Exact nodule-versus-coating acquisition ranking remains for clinician review; no comparative yield estimate or universal inadequacy of mucin specimens is asserted.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.cytology-limit",
    "statement": "Peritoneal-washing cytology has an unestablished treatment-planning role in appendiceal neoplasia and is not a routine substitute for representative deposit tissue.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ascrs-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "One guideline, recommendation 11 together with recommendation 2. No sensitivity or negative-predictive value is asserted. A negative washing must not be treated as absence of tissue disease.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.unplanned-surgery-limit",
    "statement": "Unexpected suspected mucinous peritoneal disease generally calls for diagnostic or emergency-directed surgery rather than an improvised attempt at definitive tumor clearance.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.sico-2023",
      "source.intraop.unexpected-bowel.ascrs-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Professional-society consensus; no particular cytoreductive operation or chemotherapy regimen is prescribed. The sampling case has no perforation, active bleeding or obstructed bowel requiring immediate additional treatment.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.ileitis-nonspecific",
    "statement": "Terminal ileal inflammation seen during exploration for presumed appendicitis does not distinguish Crohn disease from infectious ileitis.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ecco-escp-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "One directly applicable historical consensus. Operative appearance is insufficient for a new Crohn diagnosis; later assessment lies outside the scored checkpoint.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.ileitis-resection-boundary",
    "statement": "Unexpected nonstricturing, nonpenetrating ileitis does not by itself require an immediate ileal resection.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ecco-escp-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly applicable low-evidence historical consensus. This concerns an undiagnosed finding at emergency exploration, not all elective options for established limited Crohn disease.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.normal-appendix-boundary",
    "statement": "Removing a normal-looking appendix in the presence of terminal ileitis can add septic or fistula risk, favoring preservation when there is no separate appendiceal indication.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.ecco-escp-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "Direct support is limited to ECCO-ESCP statement 3M and its discussion. No absolute prohibition or exact risk estimate is taught. True appendicitis or a separate appendiceal lesion changes this comparison.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.ibd-emergency-boundary",
    "statement": "Perforation, uncontrolled hemorrhage or a clinically significant obstruction can require urgent operative treatment in inflammatory bowel disease.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.wses-aast-2021",
      "source.intraop.unexpected-bowel.ecco-escp-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Emergency indications require their actual clinical context. This is an independent cross-check of why the uncomplicated ileitis record does not establish an emergency resection indication, not corroboration of appendix-specific risk.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.meckel-existing-extent",
    "statement": "Meckel resection extent depends on the integrity of its base and neighboring ileum rather than an isolated length measurement.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.blouhos-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Coverage audit only. The named clinician-approved four historical versions and the returned N1 drafts already assess this construct; no additional scored item or approval is generated here.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.unexpected-bowel.meckel-incidental-disagreement",
    "statement": "Routine removal of an asymptomatic incidental adult Meckel diverticulum remains disputed in the retrospective literature.",
    "sourceIds": [
      "source.intraop.unexpected-bowel.blouhos-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "conflicting",
    "limitation": "Withheld as a scored decision. The review reports opposing observational conclusions; no demographic weight, age cutoff, size threshold or single mandatory operation is invented. A newer independent permitted evidence review and clinician decision would be needed.",
    "applicablePopulation": "Adult outside operative-record checkpoints; all applications require exact-version clinician review.",
    "lastCheckedOn": "2026-11-12"
  }
];
export const PROGRAM_BATCH9_SOURCES:Array<ClinicalSource & Record<string,unknown>> = [
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.emhg-2024",
    "title": "Recognising and managing a malignant hyperthermia crisis (v2024)",
    "completeCitation": "Glahn K, Girard T, Hellblom A, Hopkins P, Johannsen S, Rueffert H, Snoeck M, Urwyler A, and EMHG collaborators. Recognising and managing a malignant hyperthermia crisis (v2024). European Malignant Hyperthermia Group. 4 November 2024.",
    "organizationOrJournal": "European Malignant Hyperthermia Group",
    "authors": [
      "Klaus Glahn",
      "Thierry Girard",
      "Anna Hellblom",
      "Philip Hopkins",
      "Stephan Johannsen",
      "Henrik Rueffert",
      "Marc Snoeck",
      "Albert Urwyler",
      "EMHG collaborators"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.emhg.org/recommendations-1/2024/11/4/recognising-and-managing-a-malignant-hyperthermia-crisis-v2024",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guidance; no general reuse licence identified",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification of the society-hosted guidance; no algorithm, table, excerpt, figure or source prose retained. Linked privacy policy and public terms search checked; no express automated/AI-use prohibition identified. This is not a licence to reproduce.",
    "authorityAssessment": "Specialist international society consensus; secondary-feature treatment explicitly permits local protocols.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i11.mh-pattern",
      "claim.intraop.i11.mh-treatment",
      "claim.intraop.i11.repeat-dantrolene",
      "claim.intraop.i11.mh-bicarbonate-complications"
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.jsa-2026",
    "title": "JSA guideline for management of malignant hyperthermia in 2025",
    "completeCitation": "Tsutsumi YM, Nagasaka H, Mukaida K, Ichihara Y, Yasuda T, Miyoshi H; M. H. Management Guideline Working Group of Safety Committee of the Japanese Society of Anesthesiologists. JSA guideline for management of malignant hyperthermia in 2025. Journal of Anesthesia. 2026;40:4-12. Published 8 January 2026. doi:10.1007/s00540-025-03647-y.",
    "organizationOrJournal": "Journal of Anesthesia / Japanese Society of Anesthesiologists",
    "authors": [
      "Yasuo M. Tsutsumi",
      "Hiroshi Nagasaka",
      "Keiko Mukaida",
      "Yasuko Ichihara",
      "Toshimichi Yasuda",
      "Hirotsugu Miyoshi",
      "M. H. Management Guideline Working Group of Safety Committee of the Japanese Society of Anesthesiologists"
    ],
    "publicationYear": 2026,
    "doi": "10.1007/s00540-025-03647-y",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12860801/",
    "accessedOn": "2026-11-12",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific licence verified at the copyright notice; https://creativecommons.org/licenses/by/4.0/. Attribution retained here. Independent factual synthesis into original claims and fictional observations; no article expression, figures or algorithms reproduced. PMC availability was not treated as the licence.",
    "authorityAssessment": "Independent Japanese society guideline; expert-consensus/case-report limitations acknowledged; Japanese dantrolene dosing differs from EMHG and is not scored.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i11.mh-pattern",
      "claim.intraop.i11.mh-treatment",
      "claim.intraop.i11.mh-potassium",
      "claim.intraop.i11.calcium-cardioprotection",
      "claim.intraop.i11.calcium-versus-ccb",
      "claim.intraop.i11.repeat-dantrolene",
      "claim.intraop.i11.mh-bicarbonate-complications"
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.mhra-calcium-2023",
    "title": "Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia",
    "completeCitation": "Medicines and Healthcare products Regulatory Agency. Calcium chloride, calcium gluconate: potential risk of underdosing with calcium gluconate in severe hyperkalaemia. Drug Safety Update. 2023;16(11):1. 27 June 2023.",
    "organizationOrJournal": "UK Medicines and Healthcare products Regulatory Agency",
    "authors": [
      "Medicines and Healthcare products Regulatory Agency"
    ],
    "publicationYear": 2023,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.gov.uk/drug-safety-update/calcium-chloride-calcium-gluconate-potential-risk-of-underdosing-with-calcium-gluconate-in-severe-hyperkalaemia",
    "accessedOn": "2026-11-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "Open Government Licence v3.0, except stated third-party material",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Footer OGL verified: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/. Contains public sector information licensed under the Open Government Licence v3.0. Conservative existing reuse enum records factual verification only; OGL is not public domain. No text, dose table or images copied.",
    "authorityAssessment": "National medicines safety regulator; supports cardiac protection versus potassium removal, not MH-specific rescue.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i11.calcium-cardioprotection",
      "claim.intraop.i11.calcium-not-removal"
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.rcuk-periop-2024",
    "title": "Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists",
    "completeCitation": "Resuscitation Council UK. Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists. Official January 2024 algorithm file. Companion publication: Dodd A, Turner PJ, Soar J, Savic L. Emergency treatment of peri-operative anaphylaxis: Resuscitation Council UK algorithm for anaesthetists. Anaesthesia. 2024;79:535-541. doi:10.1111/anae.16206.",
    "organizationOrJournal": "Resuscitation Council UK",
    "authors": [
      "Resuscitation Council UK"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.resus.org.uk/sites/default/files/2024-01/2526%20AAP%20RCUK%20periop%20anaphylaxis-8C.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "RCUK copyright; reproduction restricted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying-fact verification of professional guidance only. Terms checked at https://www.resus.org.uk/terms-and-conditions: material reproduction/alteration restricted, no express AI-use prohibition found. No checklist, algorithm, layout, dose schedule or protected expression reproduced. The companion DOI identifies publication metadata; the official algorithm is the evidence actually read.",
    "authorityAssessment": "Specialist perioperative resuscitation guidance for monitored care by anaesthetists/intensivists; this differs from unmonitored community anaphylaxis routes.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i11.anaphylaxis-pattern",
      "claim.intraop.i11.antibiotic-exposure",
      "claim.intraop.i11.epi-fluid",
      "claim.intraop.i11.bronchodilator-adjunct",
      "claim.intraop.i11.epi-infusion",
      "claim.intraop.i11.second-vasopressor",
      "claim.intraop.i11.steroid-boundary"
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.sba-asbai-2020",
    "title": "Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I",
    "completeCitation": "Spindola MAC, Sole D, Aun MV, Azi LMTA, Bernd LAG, Garcia DB, Capelo AV, Cumino DO, Lacerda AE, Lima LC, Morato EF, Nunes RR, Rubini NPM, Silva J, Tardelli MA, Watanabe AS, Curi EF, Sano F. Update on perioperative hypersensitivity reactions: joint document of the Brazilian Society of Anesthesiology (SBA) and Brazilian Association of Allergy and Immunology (ASBAI) - Part I: post-crisis guidelines and treatment. Brazilian Journal of Anesthesiology. 2020;70(5):534-548. doi:10.1016/j.bjane.2020.09.001.",
    "organizationOrJournal": "Brazilian Journal of Anesthesiology / SBA and ASBAI",
    "authors": [
      "Maria Anita Costa Spindola",
      "Dirceu Sole",
      "Marcelo Vivolo Aun",
      "Liana Maria Torres de Araujo Azi",
      "Luiz Antonio Guerra Bernd",
      "Daniela Bianchi Garcia",
      "Albertina Varandas Capelo",
      "Debora de Oliveira Cumino",
      "Alex Eustaquio Lacerda",
      "Luciana Cavalcanti Lima",
      "Edelton Flavio Morato",
      "Rogean Rodrigues Nunes",
      "Norma de Paula Motta Rubini",
      "Jane da Silva",
      "Maria Angela Tardelli",
      "Alexandra Sayuri Watanabe",
      "Erick Freitas Curi",
      "Flavio Sano"
    ],
    "publicationYear": 2020,
    "doi": "10.1016/j.bjane.2020.09.001",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9373446/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article-specific CC BY-NC-ND 4.0 verified: https://creativecommons.org/licenses/by-nc-nd/4.0/. Attribution recorded. Targeted professional-society factual cross-check; no adaptation, redistribution or incorporation of protected text, tables or figures. Licence restrictions do not become permission for commercial adaptation.",
    "authorityAssessment": "Independent anesthesia/allergy societies joint consensus; older than RCUK. Routine steroid and colloid recommendations differ from newer guidance and are withheld.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i11.anaphylaxis-pattern",
      "claim.intraop.i11.antibiotic-exposure",
      "claim.intraop.i11.epi-fluid",
      "claim.intraop.i11.bronchodilator-adjunct",
      "claim.intraop.i11.epi-infusion",
      "claim.intraop.i11.second-vasopressor",
      "claim.intraop.i11.steroid-boundary"
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.pa-airway-fire-2007",
    "title": "Airway Fires during Surgery",
    "completeCitation": "Pennsylvania Patient Safety Authority. Airway Fires during Surgery. Pennsylvania Patient Safety Advisory. 2007 Mar;4(1):1,4-6.",
    "organizationOrJournal": "Pennsylvania Patient Safety Authority",
    "authors": [
      "Pennsylvania Patient Safety Authority"
    ],
    "publicationYear": 2007,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://patientsafety.pa.gov/ADVISORIES/Pages/200703_01b.aspx",
    "accessedOn": "2026-11-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "State safety publication; no public-domain or open licence presumed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Public government safety guidance used for targeted fact verification. No figures, case narratives, tables, prose or stepwise algorithm copied. Public availability is not treated as reusable copyright permission; no express automated/AI restriction identified on accessed page.",
    "authorityAssessment": "State patient safety authority advisory; old incident-based guidance, cross-checked against the current publicly offered Stanford manual. Does not establish ASC tracheostomy capability.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i11.airway-fire-sign",
      "claim.intraop.i11.fire-tube-removal",
      "claim.intraop.i11.postfire-bronchoscopy",
      "claim.intraop.i11.fire-aec-sequencing"
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.stanford-em-2022",
    "title": "Emergency Manual: Cognitive Aids for Perioperative Crises, v4.4",
    "completeCitation": "Stanford Anesthesia Cognitive Aid Program. Emergency Manual: Cognitive Aids for Perioperative Crises. Version 4.4. 2022. Event 10, Fire - Airway, PDF page 20; event 4, VFIB/VTACH, PDF page 8. Official interactive edition offered on 12 November 2026.",
    "organizationOrJournal": "Stanford Anesthesia Cognitive Aid Program",
    "authors": [
      "Stanford Anesthesia Cognitive Aid Program"
    ],
    "publicationYear": 2022,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://web.stanford.edu/dept/anesthesia/em/SEM_interactive.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives; version unspecified on permissions page",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Permissions verified at https://emergencymanual.stanford.edu/use-disclaimer-copyright/. Attribution recorded; factual cross-check only. No checklist, sequence layout, figure, table or source prose reproduced or adapted. This is a publicly licensed cognitive aid, not a proprietary textbook; no commercial-use licence inferred.",
    "authorityAssessment": "Academic perioperative crisis cognitive aid; independent institutional cross-check, not a current society guideline. The official download presently supplies v4.4 (2022); no claim of a 2026 edition.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i11.amiodarone-rhythm",
      "claim.intraop.i11.airway-fire-sign",
      "claim.intraop.i11.fire-tube-removal",
      "claim.intraop.i11.fire-irrigation",
      "claim.intraop.i11.postfire-bronchoscopy",
      "claim.intraop.i11.fire-aec-sequencing"
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.apsic-ssi-2019",
    "title": "APSIC guidelines for the prevention of surgical site infections",
    "completeCitation": "Ling ML, Apisarnthanarak A, Abbas A, Morikane K, Lee KY, Warrier A, Yamada K. APSIC guidelines for the prevention of surgical site infections. Antimicrobial Resistance & Infection Control. 2019;8:174. doi:10.1186/s13756-019-0638-8.",
    "organizationOrJournal": "Antimicrobial Resistance & Infection Control / Asia Pacific Society of Infection Control",
    "authors": [
      "Moi Lin Ling",
      "Anucha Apisarnthanarak",
      "Azlina Abbas",
      "Keita Morikane",
      "Kil Yeon Lee",
      "Anup Warrier",
      "Koji Yamada"
    ],
    "publicationYear": 2019,
    "doi": "10.1186/s13756-019-0638-8",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13756-019-0638-8",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY 4.0 licence verified on the publisher page: https://creativecommons.org/licenses/by/4.0/. Attribution retained here. Only underlying facts independently synthesized; no prose, algorithm, table, figure, stem or source excerpt reproduced. The case records a fictional pre-incision administration, not an exact interval recommendation.",
    "authorityAssessment": "Regional professional society guideline. Used narrowly for prophylaxis chronology when prophylaxis is indicated; no assertion of a universal cefazolin regimen or newer superiority claim.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.i11.prophylaxis-before-incision"
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i11.aidaa-extubation-2025",
    "title": "All India Difficult Airway Association 2025 guidelines for extubation of the at-risk airway",
    "completeCitation": "Kundra P, Shah AP, Ahmed SM, Garg R, Ramkumar V, Patwa A, Shetty SR, Divatia JV, Doctor JR, Mehandale SG, Pawar D, Das S, Myatra SN. All India Difficult Airway Association 2025 guidelines for extubation of the at-risk airway. Indian Journal of Anaesthesia. 2025;69(11):1187-1207. doi:10.4103/ija.ija_766_25.",
    "organizationOrJournal": "Indian Journal of Anaesthesia / All India Difficult Airway Association",
    "authors": [
      "Pankaj Kundra",
      "Amit P. Shah",
      "Syed Moied Ahmed",
      "Rakesh Garg",
      "Venkateswaran Ramkumar",
      "Apeksh Patwa",
      "Sumalatha R. Shetty",
      "Jigeeshu V. Divatia",
      "Jeson R. Doctor",
      "Sripada G. Mehandale",
      "Dilip Pawar",
      "Sabyasachi Das",
      "Sheila N. Myatra"
    ],
    "publicationYear": 2025,
    "doi": "10.4103/ija.ija_766_25",
    "pmid": "41293145",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12643154/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article-specific CC BY-NC-SA 4.0 verified at the article copyright notice: https://creativecommons.org/licenses/by-nc-sa/4.0/. Attribution retained. Targeted society-guidance factual verification only; no creative material, algorithm, table or figure reproduced/adapted or commercially reused. PMC availability was not treated as the licence.",
    "authorityAssessment": "Contemporary expert-society guideline for planned controlled at-risk extubation. Supports the reality of the catheter technique, not its use during active airway fire; that boundary is derived separately from emergency fire guidance and held for clinician review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.i11.controlled-airway-access",
      "claim.intraop.i11.fire-aec-sequencing"
    ]
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.endoscopic-perforation-and-injury.wses-colon-2018",
    "title": "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation",
    "completeCitation": "de'Angelis N, Di Saverio S, Chiara O, Sartelli M, Martinez-Perez A, Patrizi F, et al. 2017 WSES guidelines for the management of iatrogenic colonoscopy perforation. World J Emerg Surg. 2018;13:5. doi:10.1186/s13017-018-0162-9.",
    "authors": [
      "de'Angelis N",
      "Di Saverio S",
      "Chiara O",
      "Sartelli M",
      "Martinez-Perez A",
      "Patrizi F"
    ],
    "publicationYear": 2018,
    "doi": "10.1186/s13017-018-0162-9",
    "pmid": "29416554",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5784542/",
    "organizationOrJournal": "World Society of Emergency Surgery / World Journal of Emergency Surgery",
    "sourceClass": "professional_society_guideline",
    "authorityAssessment": "Primary society consensus on colonoscopy perforation. Many treatment boundaries use observational evidence. Published in 2018; not represented as newly issued 2026 guidance.",
    "accessedOn": "2026-11-12",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "reuseNotes": "Article-specific CC BY 4.0 declaration inspected. Independently written facts and fictional observations; no source prose, tables, figures, algorithms, images, individual case details or excerpts reproduced. Credit authors and DOI; all expression here is new.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.observed-wall-breach",
      "claim.intraop.endoscopic-perforation-and-injury.early-colon-closure",
      "claim.intraop.endoscopic-perforation-and-injury.conservative-colon-selection",
      "claim.intraop.endoscopic-perforation-and-injury.colonic-surgical-boundary",
      "claim.intraop.endoscopic-perforation-and-injury.gas-after-closure",
      "claim.intraop.endoscopic-perforation-and-injury.perforation-support",
      "claim.intraop.endoscopic-perforation-and-injury.deterioration-after-closure",
      "claim.intraop.endoscopic-perforation-and-injury.tension-physiology",
      "claim.intraop.endoscopic-perforation-and-injury.tension-rescue",
      "claim.intraop.endoscopic-perforation-and-injury.rescue-is-not-seal",
      "claim.intraop.endoscopic-perforation-and-injury.colonic-contrast-assessment",
      "claim.intraop.endoscopic-perforation-and-injury.limit-extraluminal-insufflation",
      "claim.intraop.endoscopic-perforation-and-injury.closure-contamination-distinction"
    ],
    "authorListNote": "First six authors in standard citation form; complete list at the DOI.",
    "verification": {
      "checkedOn": "2026-11-12",
      "method": "Targeted primary full-text factual verification and article-specific license check.",
      "locator": "Diagnosis; conservative/endoscopic treatment; statements 5.1-5.3 and 6; monitoring and antibiotics.",
      "termsCheck": "Article-specific CC BY 4.0 is the permission basis; public or PMC availability alone is not."
    }
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.endoscopic-perforation-and-injury.wses-esophagus-2019",
    "title": "Esophageal emergencies: WSES guidelines",
    "completeCitation": "Chirica M, Kelly MD, Siboni S, Aiolfi A, Riva CG, Asti E, et al. Esophageal emergencies: WSES guidelines. World J Emerg Surg. 2019;14:26. doi:10.1186/s13017-019-0245-2.",
    "authors": [
      "Chirica M",
      "Kelly MD",
      "Siboni S",
      "Aiolfi A",
      "Riva CG",
      "Asti E"
    ],
    "publicationYear": 2019,
    "doi": "10.1186/s13017-019-0245-2",
    "pmid": "31164915",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6544956/",
    "organizationOrJournal": "World Society of Emergency Surgery / World Journal of Emergency Surgery",
    "sourceClass": "professional_society_guideline",
    "authorityAssessment": "Primary emergency-surgery guidance. Endoscopic device selection is largely observational and requires individual clinical review.",
    "accessedOn": "2026-11-12",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "reuseNotes": "Article-specific CC BY 4.0 declaration inspected. Independently written facts and fictional observations; no source prose, tables, figures, algorithms, images, individual case details or excerpts reproduced. Credit authors and DOI; all expression here is new.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-primary-clips",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-stent-boundary",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-operative-boundary",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-support"
    ],
    "authorListNote": "First six authors in standard citation form; complete list at the DOI.",
    "verification": {
      "checkedOn": "2026-11-12",
      "method": "Targeted primary full-text factual verification and article-specific license check.",
      "locator": "Esophageal perforation: endoscopic closure; nonoperative and operative treatment indications.",
      "termsCheck": "Article-specific CC BY 4.0 is the permission basis; public or PMC availability alone is not."
    }
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.endoscopic-perforation-and-injury.ray-exantus-2021",
    "title": "Needle Decompression of Tension Pneumoperitoneum: A Case Report",
    "completeCitation": "Ray J, Exantus N. Needle Decompression of Tension Pneumoperitoneum: A Case Report. Clin Pract Cases Emerg Med. 2021;5(4):511-514. doi:10.5811/cpcem.2021.8.53447.",
    "authors": [
      "Ray J",
      "Exantus N"
    ],
    "publicationYear": 2021,
    "doi": "10.5811/cpcem.2021.8.53447",
    "pmid": "34813460",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8610461/",
    "organizationOrJournal": "Clinical Practice and Cases in Emergency Medicine",
    "sourceClass": "observational_study",
    "authorityAssessment": "Primary single adult case report. Supports pressure physiology and temporization, not incidence, a standardized puncture technique or mandatory surgery after every successfully clipped injury.",
    "accessedOn": "2026-11-12",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "reuseNotes": "Article-specific CC BY 4.0 declaration inspected. Independently written facts and fictional observations; no source prose, tables, figures, algorithms, images, individual case details or excerpts reproduced. Credit authors and DOI; all expression here is new.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.tension-physiology",
      "claim.intraop.endoscopic-perforation-and-injury.tension-rescue",
      "claim.intraop.endoscopic-perforation-and-injury.rescue-is-not-seal",
      "claim.intraop.endoscopic-perforation-and-injury.gas-compartment"
    ],
    "authorListNote": "Complete author list.",
    "verification": {
      "checkedOn": "2026-11-12",
      "method": "Targeted primary full-text factual verification and article-specific license check.",
      "locator": "Discussion: diaphragmatic splinting, reduced venous return, emergency decompression and definitive assessment.",
      "termsCheck": "Article-specific CC BY 4.0 is the permission basis; public or PMC availability alone is not."
    }
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.ercp-access-and-adverse-events.dgvs-prophylaxis-2025",
    "title": "DGVS 2025 ERCP complication prophylaxis",
    "completeCitation": "Deutsche Gesellschaft für Gastroenterologie, Verdauungs- und Stoffwechselkrankheiten (DGVS). Qualitätsanforderungen in der gastrointestinalen Endoskopie. ERCP: Prozeduren abhängige Komplikationsprophylaxe, recommendations 7.9-7.12; checked/new 2025. Online society guideline. Accessed 2026-11-12.",
    "organizationOrJournal": "DGVS / Qualitätsanforderungen in der gastrointestinalen Endoskopie",
    "authors": [
      "DGVS guideline working group (corporate author)"
    ],
    "publicationYear": 2025,
    "publicationDateNote": "Online recommendations marked checked or new in 2025; no individual chapter authors or DOI supplied on the page.",
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.dgvs.de/new-leitlinien/chapter_69f3b4e612d3e/chapter_69f3b4e614c92/chapter_69f3b4e70bdf8/chapter_69f3b4e7ba786/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright DGVS; no open-content license claimed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification of society recommendations, independently synthesized in English. No translation of source expression, prose, algorithm, table, figure or excerpt retained. Public chapter and linked Impressum inspected; no automated/AI prohibition found there. This is not general permission to ingest the site.",
    "authorityAssessment": "Current society consensus explicitly supports temporary pancreatic stenting in high-risk ERCP in addition to NSAID prophylaxis. Rescue access methods remain alternatives. Some background references appear mismatched; no exact effect estimate, threshold or waiting interval is taken from them.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.pancreatic-access-risk",
      "claim.intraop.ercp-access-and-adverse-events.pancreatic-stent-prophylaxis",
      "claim.intraop.ercp-access-and-adverse-events.hydration-not-substitute",
      "claim.intraop.ercp-access-and-adverse-events.rescue-access-alternatives"
    ]
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.ercp-access-and-adverse-events.dgvs-perforation-2025",
    "title": "DGVS 2025 acute endoscopic perforation management",
    "completeCitation": "Deutsche Gesellschaft für Gastroenterologie, Verdauungs- und Stoffwechselkrankheiten (DGVS). Qualitätsanforderungen in der gastrointestinalen Endoskopie. Akute Perforationen, recommendations 5.50-5.61; new 2025. Online society guideline. Accessed 2026-11-12.",
    "organizationOrJournal": "DGVS / Qualitätsanforderungen in der gastrointestinalen Endoskopie",
    "authors": [
      "DGVS guideline working group (corporate author)"
    ],
    "publicationYear": 2025,
    "publicationDateNote": "Online recommendations marked new in 2025; no individual chapter authors or DOI supplied on the page.",
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.dgvs.de/new-leitlinien/chapter_69f3b4b82aa10/chapter_69f3b4bbcf8f6/chapter_69f3b4bbe11dd/chapter_69f3b4c02431b/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright DGVS; no open-content license claimed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of independently issued DGVS recommendations. No translated guideline text or protected expression reproduced. Chapter and Impressum inspected for restrictions. Existing ESGE-hosted access holds stay in force; this is not alternate hosting to evade an ESGE restriction.",
    "authorityAssessment": "Current multidisciplinary consensus supports selection by injury, physiology and resources, hospital supportive care and surgery after failed source control or generalized peritonitis. Evidence is largely observational. This is not an ERCP device-superiority trial.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care",
      "claim.intraop.ercp-access-and-adverse-events.selected-endoscopic-diversion",
      "claim.intraop.ercp-access-and-adverse-events.collection-percutaneous",
      "claim.intraop.ercp-access-and-adverse-events.failed-source-control-surgery",
      "claim.intraop.ercp-access-and-adverse-events.ct-injury-assessment"
    ]
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.ercp-access-and-adverse-events.heo-2024",
    "title": "Heo et al. 2024 type II ERCP perforation drainage cohort",
    "completeCitation": "Heo J, Jung MK, Lee J, Lee DW, Cho CM, Cha JG. Comparative study between biliary covered self-expandable metal stent and conventional endoscopic bile drainage treatment in endoscopic retrograde cholangiopancreatography-related Stapfer type II retroperitoneal perforations. PLoS One. 2024;19(3):e0300029. doi:10.1371/journal.pone.0300029.",
    "organizationOrJournal": "PLOS One",
    "authors": [
      "Jun Heo",
      "Min Kyu Jung",
      "Jieun Lee",
      "Dong wook Lee",
      "Chang Min Cho",
      "Jung Guen Cha"
    ],
    "publicationYear": 2024,
    "doi": "10.1371/journal.pone.0300029",
    "pmid": null,
    "officialUrl": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0300029",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY declaration and linked CC BY 4.0 deed inspected on the publisher page. Authors and DOI supply attribution. Only original factual synthesis; no copied patient, prose, table, figure, algorithm or excerpt. New synthetic observations are not adaptations of source patient records.",
    "authorityAssessment": "Primary single-center retrospective cohort; not randomized or proof of equivalence. Supports conventional transpapillary diversion as well as covered stents and collection drainage when indicated. A nonsignificant difference cannot establish universal equivalence or superiority.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.periampullary-pattern",
      "claim.intraop.ercp-access-and-adverse-events.hospital-perforation-care",
      "claim.intraop.ercp-access-and-adverse-events.selected-endoscopic-diversion",
      "claim.intraop.ercp-access-and-adverse-events.no-covered-stent-superiority",
      "claim.intraop.ercp-access-and-adverse-events.collection-after-diversion",
      "claim.intraop.ercp-access-and-adverse-events.collection-percutaneous",
      "claim.intraop.ercp-access-and-adverse-events.ct-injury-assessment",
      "claim.intraop.ercp-access-and-adverse-events.sphincterotomy-margin-origin"
    ]
  },
  {
    "contentVersion": "question-intraop-ercp-access-and-adverse-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.ercp-access-and-adverse-events.yin-2016",
    "title": "Yin et al. 2016 prophylactic pancreatic stent randomized study",
    "completeCitation": "Yin HK, Wu HE, Li QX, Wang W, Ou WL, Xia HHX. Pancreatic Stenting Reduces Post-ERCP Pancreatitis and Biliary Sepsis in High-Risk Patients: A Randomized, Controlled Study. Gastroenterol Res Pract. 2016;2016:9687052. doi:10.1155/2016/9687052.",
    "organizationOrJournal": "Gastroenterology Research and Practice",
    "authors": [
      "He-Kun Yin",
      "Hai-En Wu",
      "Qi-Xiang Li",
      "Wei Wang",
      "Wei-Lin Ou",
      "Harry Hua-Xiang Xia"
    ],
    "publicationYear": 2016,
    "doi": "10.1155/2016/9687052",
    "pmid": "27057161",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4789431/",
    "accessedOn": "2026-11-12",
    "sourceClass": "randomized_trial",
    "licenseLabel": "Creative Commons Attribution License; version not stated in rendered article declaration",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article-specific CC BY declaration inspected, rather than assuming PMC supplies rights. Usage is deliberately limited to factual verification because the rendered declaration does not state its version. No licensed expression reproduced or adapted. Authors and DOI provide attribution; no specific CC BY version is asserted.",
    "authorityAssessment": "Primary assessor-blinded randomized trial in selected adult high-risk ERCP patients. Corroborates pancreatic stenting in that population, but not the incremental benefit over contemporary rectal NSAID prophylaxis, nor a universal rescue-cannulation hierarchy.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.ercp-access-and-adverse-events.pancreatic-stent-prophylaxis"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.groin-hernia.iehs2011",
    "title": "Guidelines for laparoscopic (TAPP) and endoscopic (TEP) treatment of inguinal Hernia [International Endohernia Society (IEHS)]",
    "completeCitation": "Bittner R, Arregui ME, Bisgaard T, et al. Guidelines for laparoscopic (TAPP) and endoscopic (TEP) treatment of inguinal Hernia [International Endohernia Society (IEHS)]. Surgical Endoscopy. 2011;25:2773-2843. doi:10.1007/s00464-011-1799-6.",
    "organizationOrJournal": "Surgical Endoscopy / International Endohernia Society",
    "authors": [
      "R. Bittner",
      "M. E. Arregui",
      "T. Bisgaard",
      "et al."
    ],
    "publicationYear": 2011,
    "doi": "10.1007/s00464-011-1799-6",
    "pmid": "21751060",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3160575/",
    "accessedOn": "2026-11-12",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution Noncommercial; article notice does not specify a version",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Licensed noncommercial article read for targeted factual verification. No prose, figure, table or algorithm reused; no commercial adaptation of protected expression. The legacy enum cannot faithfully label an unspecified CC version.",
    "authorityAssessment": "Older specialist technical consensus; directly relevant to groin dissection and genitourinary complications. Cross-checked where newer adequate guidance exists; many technical statements have low-level evidence.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.sliding-wall",
      "claim.intraop.groin-hernia.sliding-plane",
      "claim.intraop.groin-hernia.cord-sac",
      "claim.intraop.groin-hernia.cord-fat-search",
      "claim.intraop.groin-hernia.groin-landmarks",
      "claim.intraop.groin-hernia.bladder-sign",
      "claim.intraop.groin-hernia.bladder-fill",
      "claim.intraop.groin-hernia.intraperitoneal-repair",
      "claim.intraop.groin-hernia.epigastric-course",
      "claim.intraop.groin-hernia.ring-release-boundary",
      "claim.intraop.groin-hernia.dense-sac-plane"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.groin-hernia.scrotal2023",
    "title": "Systematic Review and Guidelines for Management of Scrotal Inguinal Hernias",
    "completeCitation": "Tran HM, MacQueen I, Chen D, Simons M; HerniaSurge Collaboration. Systematic Review and Guidelines for Management of Scrotal Inguinal Hernias. Journal of Abdominal Wall Surgery. 2023;2:11195. doi:10.3389/jaws.2023.11195.",
    "organizationOrJournal": "Journal of Abdominal Wall Surgery / HerniaSurge Collaboration",
    "authors": [
      "Hanh Minh Tran",
      "Ian MacQueen",
      "David Chen",
      "Maarten Simons"
    ],
    "publicationYear": 2023,
    "doi": "10.3389/jaws.2023.11195",
    "pmid": "38312421",
    "officialUrl": "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2023.11195/full",
    "accessedOn": "2026-11-12",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0 (article CC BY notice)",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY notice checked. Attribution is supplied in the complete citation and external link. Only underlying facts are independently synthesized; no source images, tables, prose or classification table reproduced.",
    "authorityAssessment": "Society-linked specialist guidance with very-low-certainty sac-management evidence; corroboration is not fully independent because IEHS is among its cited guidance.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.sliding-wall",
      "claim.intraop.groin-hernia.cord-sac",
      "claim.intraop.groin-hernia.distal-seroma",
      "claim.intraop.groin-hernia.dense-sac-plane"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.groin-hernia.cordfat2020",
    "title": "Spermatic Cord Lipoma-A Review of the Literature",
    "completeCitation": "Koeckerling F, Schug-Pass C. Spermatic Cord Lipoma-A Review of the Literature. Frontiers in Surgery. 2020;7:39. doi:10.3389/fsurg.2020.00039.",
    "organizationOrJournal": "Frontiers in Surgery",
    "authors": [
      "Ferdinand Koeckerling",
      "Christine Schug-Pass"
    ],
    "publicationYear": 2020,
    "doi": "10.3389/fsurg.2020.00039",
    "pmid": "32793626",
    "officialUrl": "https://www.frontiersin.org/journals/surgery/articles/10.3389/fsurg.2020.00039/full",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0 (article CC BY notice)",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Publisher article CC BY notice checked; author and publication attribution retained. Independently synthesized anatomy and search facts only. No images or wording reused.",
    "authorityAssessment": "Specialist narrative synthesis with a reported literature search. Moderate-quality literature; a missing sac does not prove a benign tumor.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.cord-fat-origin",
      "claim.intraop.groin-hernia.cord-fat-search",
      "claim.intraop.groin-hernia.cord-fat-protection"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.groin-hernia.wses2023",
    "title": "2023 WSES guidelines for the prevention, detection, and management of iatrogenic urinary tract injuries (IUTIs) during emergency digestive surgery",
    "completeCitation": "de’Angelis N, Schena CA, Marchegiani F, et al. 2023 WSES guidelines for the prevention, detection, and management of iatrogenic urinary tract injuries (IUTIs) during emergency digestive surgery. World Journal of Emergency Surgery. 2023;18:45. doi:10.1186/s13017-023-00513-8.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Nicola de’Angelis",
      "Carlo Alberto Schena",
      "Francesco Marchegiani",
      "Elisa Reitano",
      "Belinda De Simone",
      "et al."
    ],
    "publicationYear": 2023,
    "doi": "10.1186/s13017-023-00513-8",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-023-00513-8",
    "accessedOn": "2026-11-12",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Publisher Rights and permissions section explicitly checked. Full citation and license link provided. Original atomic statements only; no algorithm, figure, table or source text stored.",
    "authorityAssessment": "Multidisciplinary society guideline for emergency digestive surgery; anatomy and diagnostic principles apply to surgical injury, but elective groin application is an explicit extrapolation requiring clinician review.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.bladder-fill",
      "claim.intraop.groin-hernia.ureter-testing",
      "claim.intraop.groin-hernia.intraperitoneal-repair",
      "claim.intraop.groin-hernia.extraperitoneal-boundary",
      "claim.intraop.groin-hernia.viable-wall"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.groin-hernia.lichtenstein2024",
    "title": "Lichtenstein technique for inguinal hernia repair: ten recommendations to optimize surgical outcomes",
    "completeCitation": "Messias BA, Nicastro RG, Mocchetti ER, Waisberg J, Roll S, Ribeiro Junior MAF. Lichtenstein technique for inguinal hernia repair: ten recommendations to optimize surgical outcomes. Hernia. 2024;28:1467-1476. doi:10.1007/s10029-024-03094-w.",
    "organizationOrJournal": "Hernia",
    "authors": [
      "Bruno Amantini Messias",
      "Rafael Goncalves Nicastro",
      "Erica Rossi Mocchetti",
      "Jaques Waisberg",
      "Sergio Roll",
      "Marcelo Augusto Fontenelle Ribeiro Junior"
    ],
    "publicationYear": 2024,
    "doi": "10.1007/s10029-024-03094-w",
    "pmid": "38900355",
    "officialUrl": "https://link.springer.com/article/10.1007/s10029-024-03094-w",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Publisher Rights and permissions section explicitly checked. Independently synthesized cord/sac facts only; none of the surgical photographs or technical figures reused.",
    "authorityAssessment": "Technical review of open anterior repair. Supports cord anatomy and selective sac division; it is a cross-check, not independent laparoscopic outcome evidence. Unrelated disputed assertions in the paper are not used.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.cord-sac",
      "claim.intraop.groin-hernia.cord-fat-protection"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.groin-hernia.corona2022",
    "title": "The Corona mortis is similar in size to the regular obturator artery, but is highly variable at the level of origin: an anatomical study",
    "completeCitation": "Heichinger R, Pretterklieber ML, Hammer N, Pretterklieber B. The Corona mortis is similar in size to the regular obturator artery, but is highly variable at the level of origin: an anatomical study. Anatomical Science International. 2023;98:43-53. Published online June 2, 2022. doi:10.1007/s12565-022-00671-w.",
    "organizationOrJournal": "Anatomical Science International",
    "authors": [
      "Rene Heichinger",
      "Michael L. Pretterklieber",
      "Niels Hammer",
      "Bettina Pretterklieber"
    ],
    "publicationYear": 2022,
    "doi": "10.1007/s12565-022-00671-w",
    "pmid": "35653059",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9845159/",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY 4.0 notice read; supplied citation distinguishes online publication from 2023 issue. Anatomical facts only, no measurements, images or source prose reproduced.",
    "authorityAssessment": "Primary cadaveric anatomical study; supports arterial origins and retropubic course, not a mandatory hemostatic technique or a live-patient complication probability.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.corona-course",
      "claim.intraop.groin-hernia.regular-obturator-origin",
      "claim.intraop.groin-hernia.epigastric-course"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.groin-hernia.sliding2024",
    "title": "Case Report: Robotic-Assisted Minimally Invasive Repair of a Direct Sliding Left Inguinal Hernia Containing Bladder and Colon",
    "completeCitation": "Varghese AM, Zemaitis MR, Giannone J, Sekh MB, Barkan A. Case Report: Robotic-Assisted Minimally Invasive Repair of a Direct Sliding Left Inguinal Hernia Containing Bladder and Colon. Cureus. 2024;16(2):e54975. doi:10.7759/cureus.54975.",
    "organizationOrJournal": "Cureus",
    "authors": [
      "Anish M. Varghese",
      "Michael R. Zemaitis",
      "James Giannone",
      "Marta B. Sekh",
      "Alex Barkan"
    ],
    "publicationYear": 2024,
    "doi": "10.7759/cureus.54975",
    "pmid": "38544626",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10972638/",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY 4.0 notice read. Short original anatomical statement only; no case narrative, patient facts, figures, source prose, rates or operative measurements reused.",
    "authorityAssessment": "Single descriptive case, used only to cross-check incorporation of a viscus into the sac wall. It does not establish superiority of robotic/open access, an incidence, or ASC eligibility. Other broad mechanistic assertions in this paper are not adopted.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.sliding-wall"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-groin-hernia-anatomy-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.groin-hernia.corona-clinical2024",
    "title": "Corona mortis: clinical evaluation of prevalence, anatomy, and relevance in anterior approaches to the pelvis and acetabulum",
    "completeCitation": "Schaible SF, Hanke MS, Tinner C, Bastian JD, Albers CE, Keel MJB. Corona mortis: clinical evaluation of prevalence, anatomy, and relevance in anterior approaches to the pelvis and acetabulum. European Journal of Orthopaedic Surgery & Traumatology. 2024;34:1397-1404. doi:10.1007/s00590-023-03808-3.",
    "organizationOrJournal": "European Journal of Orthopaedic Surgery & Traumatology",
    "authors": [
      "Samuel Friedrich Schaible",
      "Markus Simon Hanke",
      "Christian Tinner",
      "Johannes Dominik Bastian",
      "Christoph Emanuel Albers",
      "Marius Johann Baptist Keel"
    ],
    "publicationYear": 2024,
    "doi": "10.1007/s00590-023-03808-3",
    "pmid": "38197970",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10980617/",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY 4.0 notice read during round 1. Full author/publication attribution retained. Only the anatomical connection terminology is independently synthesized; no text, figures, tables, measurements or clinical frequency reused.",
    "authorityAssessment": "Primary retrospective operative series in anterior pelvic/acetabular surgery. Supports the broader communication-based corona mortis terminology. It does not establish a groin-specific hemostasis hierarchy, replacement of the usual obturator origin, or ASC rescue capability.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.groin-hernia.arterial-communication"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.dutch-entry-2012",
    "title": "A multidisciplinary evidence-based guideline for minimally invasive surgery. Part 1: entry techniques and the pneumoperitoneum",
    "completeCitation": "la Chapelle CF, Bemelman WA, Rademaker BMP, van Barneveld TA, Jansen FW; Dutch Multidisciplinary Guideline Development Group Minimally Invasive Surgery. A multidisciplinary evidence-based guideline for minimally invasive surgery. Part 1: entry techniques and the pneumoperitoneum. Gynecol Surg. 2012;9(3):271-282. doi:10.1007/s10397-012-0731-y.",
    "organizationOrJournal": "Gynecological Surgery / Dutch multidisciplinary guideline group",
    "authors": [
      "Claire F la Chapelle",
      "Willem A Bemelman",
      "Bart M P Rademaker",
      "Teus A van Barneveld",
      "Frank Willem Jansen"
    ],
    "publicationYear": 2012,
    "doi": "10.1007/s10397-012-0731-y",
    "pmid": "22837735",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3401300/",
    "accessedOn": "2026-11-12",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution; displayed article notice does not specify version",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article-specific CC Attribution notice checked. Legacy source enum has no unversioned CC BY option; conservative targeted-fact code does not change the stated license. Attribute authors, journal and DOI; store original atoms only, no article text, tables or figures.",
    "authorityAssessment": "Multidisciplinary evidence-based guideline; initial-pressure evidence is observational and technical recommendations include expert consensus. Old guideline, not a claim of a current universal pressure standard.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.initial-entry",
      "claim.intraop.lap-access.entry-reassessment",
      "claim.intraop.lap-access.pressure-context",
      "claim.intraop.lap-access.tissue-gas",
      "claim.intraop.lap-access.tissue-response",
      "claim.intraop.lap-access.trocar-release",
      "claim.intraop.lap-access.initial-opening-pressure",
      "claim.intraop.lap-access.hemostasis-check",
      "claim.intraop.lap-access.completion-after-dry-check"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.alkatout-entry-2017",
    "title": "Complications of Laparoscopy in Connection with Entry Techniques",
    "completeCitation": "Alkatout I. Complications of Laparoscopy in Connection with Entry Techniques. J Gynecol Surg. 2017;33(3):81-91. doi:10.1089/gyn.2016.0111.",
    "organizationOrJournal": "Journal of Gynecologic Surgery",
    "authors": [
      "Ibrahim Alkatout"
    ],
    "publicationYear": 2017,
    "doi": "10.1089/gyn.2016.0111",
    "pmid": "28663686",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5477171/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution; displayed article notice does not specify version",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article-specific CC Attribution notice checked. Conservative existing-enum reuse classification; no protected expression or images reused. The figure depicting local suturing was used only for the underlying reported fact, never copied or redrawn.",
    "authorityAssessment": "Peer-reviewed technical narrative review, largely gynecologic experience. Supports anatomic/local-control facts, not a mandatory technique or adult ASC credentialing decision.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.entry-reassessment",
      "claim.intraop.lap-access.embolism-presentation",
      "claim.intraop.lap-access.wall-source",
      "claim.intraop.lap-access.wall-control",
      "claim.intraop.lap-access.trocar-release",
      "claim.intraop.lap-access.major-injury",
      "claim.intraop.lap-access.major-control",
      "claim.intraop.lap-access.trocar-retain"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.park-embolism-2012",
    "title": "Carbon Dioxide Embolism during Laparoscopic Surgery",
    "completeCitation": "Park EY, Kwon JY, Kim KJ. Carbon Dioxide Embolism during Laparoscopic Surgery. Yonsei Med J. 2012;53(3):459-466. doi:10.3349/ymj.2012.53.3.459.",
    "organizationOrJournal": "Yonsei Medical Journal",
    "authors": [
      "Eun Young Park",
      "Ja-Young Kwon",
      "Ki Jun Kim"
    ],
    "publicationYear": 2012,
    "doi": "10.3349/ymj.2012.53.3.459",
    "pmid": "22476987",
    "officialUrl": "https://ymj.or.kr/DOIx.php?id=10.3349/ymj.2012.53.3.459",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC 3.0",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article notice explicitly identifies BY-NC 3.0. Existing enum lacks NC 3.0; use targeted underlying facts with citation, not licensed copying or adaptation. No prose, tables, animal-derived doses or figures retained.",
    "authorityAssessment": "Peer-reviewed anesthetic review; many rescue recommendations rely on cases, physiology and animal work. Independent clinical review remains required.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.hypercarbia-boundary",
      "claim.intraop.lap-access.embolism-presentation",
      "claim.intraop.lap-access.embolism-stop",
      "claim.intraop.lap-access.co2-monitor-limit"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.ott-tissue-gas-2014",
    "title": "Subcutaneous Emphysema-Beyond the Pneumoperitoneum",
    "completeCitation": "Ott DE. Subcutaneous Emphysema-Beyond the Pneumoperitoneum. JSLS. 2014;18(1):1-7. doi:10.4293/108680813X13693422520882.",
    "organizationOrJournal": "JSLS: Journal of the Society of Laparoendoscopic Surgeons",
    "authors": [
      "Douglas E Ott"
    ],
    "publicationYear": 2014,
    "doi": "10.4293/108680813X13693422520882",
    "pmid": "24680136",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3939322/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC-ND 3.0 US",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "The article-specific NC-ND notice was checked via accessible article alias. Facts were independently synthesized; no article text, algorithm, table layout or adapted figure is distributed. ND is not treated as a grant for transformed expression.",
    "authorityAssessment": "Peer-reviewed narrative review of extraperitoneal gas mechanisms and response; no comparative proof of a unique conversion threshold.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.pressure-context",
      "claim.intraop.lap-access.tissue-gas",
      "claim.intraop.lap-access.tissue-response",
      "claim.intraop.lap-access.hypercarbia-boundary"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.sasgog-trocar-2026",
    "title": "Avoiding Trocar Injuries Associated with Laparoscopic Surgery",
    "completeCitation": "Soper DE; mentor Famuyide AO; editor Collins E. Avoiding Trocar Injuries Associated with Laparoscopic Surgery. SASGOG Pearls of Exxcellence. Published February 1, 2012; revised July 7, 2026. Accessed November 12, 2026.",
    "organizationOrJournal": "Society for Academic Specialists in General Obstetrics and Gynecology (SASGOG)",
    "authors": [
      "David E Soper",
      "Abimbola O Famuyide",
      "Elizabeth Collins"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.exxcellence.org/list-of-pearls/avoiding-trocar-injuries-associated-with-laparoscopic-surgery/?bookmarked=False&categoryName=&featured=False&searchTerms=&sortColumn=date&sortDirection=Descending",
    "accessedOn": "2026-11-12",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyright 2026 SASGOG; all rights reserved; no reprint, duplication or posting without permission",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Public notice checked; targeted factual verification only under repository society-guidance allowance. No prose or document duplicated. No automated/AI-use prohibition was stated in the observed notice. The needle-test advice is not adopted because of the disagreement with the multidisciplinary guideline.",
    "authorityAssessment": "Current society educational guidance derived from guidelines/evidence and editorial opinion, not a formal GRADE guideline. Targeted corroboration of retained-trocar and acute vascular-control response.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.wall-source",
      "claim.intraop.lap-access.major-injury",
      "claim.intraop.lap-access.major-control",
      "claim.intraop.lap-access.trocar-retain",
      "claim.intraop.lap-access.access-cannula-retention"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.bao-embolism-2021",
    "title": "Carbon dioxide embolism with severe hypotension as an initial symptom during laparoscopy: a case report",
    "completeCitation": "Bao M, Cai W, Zhu S, Kang X. Carbon dioxide embolism with severe hypotension as an initial symptom during laparoscopy: a case report. J Int Med Res. 2021;49(4):03000605211004765. doi:10.1177/03000605211004765.",
    "organizationOrJournal": "Journal of International Medical Research",
    "authors": [
      "Mingliang Bao",
      "Wei Cai",
      "Shengmei Zhu",
      "Xianhui Kang"
    ],
    "publicationYear": 2021,
    "doi": "10.1177/03000605211004765",
    "pmid": "33878913",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8072814/",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "CC BY-NC 4.0",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Article-specific BY-NC 4.0 license verified. Citation/atomic facts only; patient identity, detailed original case sequence, doses and source table are not reused. Not a second guideline.",
    "authorityAssessment": "One case report, coded observational because the existing enum has no case-report class. Corroborates possible capnographic variability; establishes neither sensitivity nor an obligatory trend.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.embolism-stop",
      "claim.intraop.lap-access.co2-monitor-limit"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.srivastava-physiology-2010",
    "title": "Secrets of safe laparoscopic surgery: Anaesthetic and surgical considerations",
    "completeCitation": "Srivastava A, Niranjan A. Secrets of safe laparoscopic surgery: Anaesthetic and surgical considerations. J Minim Access Surg. 2010;6(4):91-94. doi:10.4103/0972-9941.72593.",
    "organizationOrJournal": "Journal of Minimal Access Surgery",
    "authors": [
      "Arati Srivastava",
      "Ashutosh Niranjan"
    ],
    "publicationYear": 2010,
    "doi": "10.4103/0972-9941.72593",
    "pmid": "21120064",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2992667/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution; displayed article notice does not specify version",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article-specific Attribution notice checked. Existing schema lacks unversioned Attribution status; conservative targeted-fact classification used. No exact pressure ceiling or anesthetic dose is adopted from this review.",
    "authorityAssessment": "Older peer-reviewed physiology review. Used narrowly for pressure/position and absorbed-gas physiology, not older drug, pregnancy or ventilator prescriptions.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.hypercarbia-boundary"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.madhok-safety-2022",
    "title": "Safety considerations in laparoscopic surgery: A narrative review",
    "completeCitation": "Madhok B, Nanayakkara K, Mahawar K. Safety considerations in laparoscopic surgery: A narrative review. World J Gastrointest Endosc. 2022;14(1):1-16. doi:10.4253/wjge.v14.i1.1.",
    "organizationOrJournal": "World Journal of Gastrointestinal Endoscopy",
    "authors": [
      "Brij Madhok",
      "Kushan Nanayakkara",
      "Kamal Mahawar"
    ],
    "publicationYear": 2022,
    "doi": "10.4253/wjge.v14.i1.1",
    "pmid": "35116095",
    "officialUrl": "https://www.wjgnet.com/1948-5190/full/v14/i1/1.htm",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC 4.0",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Article-specific NC4 license verified in the publisher footnote. Terms of Use and AI Use Policy were checked: the latter concerns journal authors/reviewers/editors and confidential manuscripts; published open-access licensing applies here. Original atomic facts and bibliography only; no article text, table, figure or algorithm stored. No commercial expressive reuse is authorized.",
    "authorityAssessment": "Externally peer-reviewed narrative review; authors explicitly identify experience-based safety recommendations needing further study. Direct support for reduced-pressure and adequate-arterial-pressure hemostasis assessment, not a validated numerical cutoff or mandatory device.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.hemostasis-check",
      "claim.intraop.lap-access.completion-after-dry-check"
    ]
  },
  {
    "contentVersion": "clinical.intraop.laparoscopic-access-and-insufflation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.lap-access.lasser-complications-2012",
    "title": "Surgical complications of laparoscopic urological surgery",
    "completeCitation": "Lasser MS, Ghavamian R. Surgical complications of laparoscopic urological surgery. Arab J Urol. 2012;10(1):81-88. doi:10.1016/j.aju.2011.11.002.",
    "organizationOrJournal": "Arab Journal of Urology",
    "authors": [
      "Michael S Lasser",
      "Reza Ghavamian"
    ],
    "publicationYear": 2012,
    "doi": "10.1016/j.aju.2011.11.002",
    "pmid": "26558008",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4442892/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC-ND 3.0",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article-specific NC-ND3 notice verified. Existing enum lacks this exact license; conservative targeted-fact code is used without claiming a broader license. Independently synthesized medical facts and bibliographic attribution only; no copied/modified expression or figures stored.",
    "authorityAssessment": "Peer-reviewed technical narrative review of urologic laparoscopy. Supports pressure-related masking and preserving a present access instrument while obtaining control; transfer of these general technical principles to the fictional case still needs clinician review.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.lap-access.hemostasis-check",
      "claim.intraop.lap-access.access-cannula-retention"
    ]
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.operative-hemorrhage.abdallah-2025",
    "title": "The difficult laparoscopic cholecystectomy: a narrative review",
    "completeCitation": "Abdallah HS, Sedky MH, Sedky ZH. The difficult laparoscopic cholecystectomy: a narrative review. BMC Surgery. 2025;25:156. doi:10.1186/s12893-025-02847-3.",
    "organizationOrJournal": "BMC Surgery",
    "authors": [
      "Hamdy S Abdallah",
      "Mohamad H Sedky",
      "Zyad H Sedky"
    ],
    "publicationYear": 2025,
    "doi": "10.1186/s12893-025-02847-3",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s12893-025-02847-3",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/article/10.1186/s12893-025-02847-3",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Read openly licensed factual sections and the article-specific license. Independently synthesized facts with attribution; no source prose, excerpts, tables, images, algorithms or article files retained. This citation is not clinical approval.",
    "authorityAssessment": "Recent general-surgery narrative synthesis; direct technical guidance, not a graded recommendation or comparative trial. The immediate compression-versus-unseen-instrument boundary has one directly adequate source here.",
    "usageRole": "both",
    "accessMethod": "Public full text via web tool; article-specific license checked. Bibliographic metadata only retained with independent atomic facts.",
    "verificationSections": [
      "Prevention of bile duct injury: bleeding obscuring the field; compression, suction and targeted control",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.asc-field-restoration",
      "claim.intraop.operative-hemorrhage.asc-unseen-instrument",
      "claim.intraop.operative-hemorrhage.asc-targeted-control"
    ]
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.operative-hemorrhage.wses-liver-2020",
    "title": "Liver trauma: WSES 2020 guidelines",
    "completeCitation": "Coccolini F, Coimbra R, Ordonez C, et al.; WSES expert panel. Liver trauma: WSES 2020 guidelines. World Journal of Emergency Surgery. 2020;15:24. doi:10.1186/s13017-020-00302-7.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Raul Coimbra",
      "Carlos Ordonez",
      "Yoram Kluger",
      "Felipe Vega",
      "Ernest E Moore",
      "Walt Biffl",
      "Andrew Peitzman",
      "WSES expert panel"
    ],
    "publicationYear": 2020,
    "doi": "10.1186/s13017-020-00302-7",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-020-00302-7",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/article/10.1186/s13017-020-00302-7",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Read openly licensed factual sections and the article-specific license. Independently synthesized facts with attribution; no source prose, excerpts, tables, images, algorithms or article files retained. This citation is not clinical approval.",
    "authorityAssessment": "International consensus guideline with graded recommendations; the specific venous technical choices rely substantially on observational evidence and expertise. Verified operative section on access date; no claim of a comprehensive update search.",
    "usageRole": "both",
    "accessMethod": "Public full text via web tool; article-specific license checked. Bibliographic metadata only retained with independent atomic facts.",
    "verificationSections": [
      "Operative management: persistent bleeding with Pringle, aberrant artery, posterior venous sources, packing, direct repair and vascular exclusion",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.pringle-inflow",
      "claim.intraop.operative-hemorrhage.pringle-posterior",
      "claim.intraop.operative-hemorrhage.pringle-variant-artery",
      "claim.intraop.operative-hemorrhage.hepatic-packing",
      "claim.intraop.operative-hemorrhage.hepatic-repacking",
      "claim.intraop.operative-hemorrhage.hepatic-repair-boundary",
      "claim.intraop.operative-hemorrhage.hepatic-arterial-ligation"
    ]
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.operative-hemorrhage.ball-2021",
    "title": "Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks",
    "completeCitation": "Ball CG. Hepatobiliary and pancreatic hemorrhage: Technical tools and tricks. Surgery Open Science. 2022;7:22-25. Published online October 14, 2021. doi:10.1016/j.sopen.2021.10.001.",
    "organizationOrJournal": "Surgery Open Science",
    "authors": [
      "Chad G Ball"
    ],
    "publicationYear": 2022,
    "doi": "10.1016/j.sopen.2021.10.001",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8593647/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8593647/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Read openly licensed factual sections and the article-specific license. Independently synthesized facts with attribution; no source prose, excerpts, tables, images, algorithms or article files retained. This citation is not clinical approval.",
    "authorityAssessment": "Independent technical review by an experienced trauma/HPB surgeon. Supports interpretation and repacking after recurrent bleeding; not an outcomes trial or universal timing protocol.",
    "usageRole": "both",
    "accessMethod": "Public full text via web tool; article-specific license checked. Bibliographic metadata only retained with independent atomic facts.",
    "verificationSections": [
      "Liver injuries: inflow occlusion, posterior venous differential and repacking after unpacking",
      "Copyright and license information"
    ],
    "evidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.pringle-inflow",
      "claim.intraop.operative-hemorrhage.pringle-posterior",
      "claim.intraop.operative-hemorrhage.pringle-variant-artery",
      "claim.intraop.operative-hemorrhage.hepatic-packing",
      "claim.intraop.operative-hemorrhage.hepatic-repacking",
      "claim.intraop.operative-hemorrhage.hepatic-repair-boundary"
    ]
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.operative-hemorrhage.latif-2026",
    "title": "Splenic Injury in Sleeve Gastrectomy: Mechanisms, Risk Factors, and Management Strategies",
    "completeCitation": "Latif AH, Monshizadeh A, Najjari K, Mahmoudabadi HZ, Soroush AR, Soltani HR. Splenic Injury in Sleeve Gastrectomy: Mechanisms, Risk Factors, and Management Strategies. Middle East Journal of Digestive Diseases. 2026;18(2):66-74. doi:10.34172/mejdd.3341.",
    "organizationOrJournal": "Middle East Journal of Digestive Diseases",
    "authors": [
      "AmirHossein Latif",
      "Amir Monshizadeh",
      "Khosrow Najjari",
      "Hossein Zabihi Mahmoudabadi",
      "Ahmad Reza Soroush",
      "Hamid Reza Soltani"
    ],
    "publicationYear": 2026,
    "doi": "10.34172/mejdd.3341",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13680740/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13680740/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Read openly licensed factual sections and the article-specific license. Independently synthesized facts with attribution; no source prose, excerpts, tables, images, algorithms or article files retained. This citation is not clinical approval.",
    "authorityAssessment": "Recent procedure-specific review directly addressing iatrogenic injury during sleeve gastrectomy. Narrative synthesis and selected-patient descriptions do not establish a validated salvage cutoff or preferred material.",
    "usageRole": "both",
    "accessMethod": "Public full text via web tool; article-specific license checked. Bibliographic metadata only retained with independent atomic facts.",
    "verificationSections": [
      "Mechanisms: traction and capsular/parenchymal injury",
      "Surgical management: splenectomy, organ-preserving procedures and intraoperative decision making",
      "Copyright and license information"
    ],
    "evidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.splenic-traction",
      "claim.intraop.operative-hemorrhage.splenic-local-repair",
      "claim.intraop.operative-hemorrhage.splenic-hilar-boundary",
      "claim.intraop.operative-hemorrhage.splenic-total-control",
      "claim.intraop.operative-hemorrhage.splenic-instability"
    ]
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.operative-hemorrhage.koide-2024",
    "title": "The Management of Splenic Injuries",
    "completeCitation": "Koide Y, Okada T, Yamaguchi M, Sugimoto K, Murakami T. The Management of Splenic Injuries. Interventional Radiology. 2024;9(3):149-155. Advance online publication August 11, 2023. doi:10.22575/interventionalradiology.2022-0003.",
    "organizationOrJournal": "Interventional Radiology / Japanese Society of Interventional Radiology",
    "authors": [
      "Yutaka Koide",
      "Takuya Okada",
      "Masato Yamaguchi",
      "Koji Sugimoto",
      "Takamichi Murakami"
    ],
    "publicationYear": 2024,
    "doi": "10.22575/interventionalradiology.2022-0003",
    "pmid": null,
    "officialUrl": "https://www.jstage.jst.go.jp/article/interventionalradiology/9/3/9_2022-0003/_article",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by-nc/4.0/",
    "termsUrl": "https://www.jstage.jst.go.jp/article/interventionalradiology/9/3/9_2022-0003/_article",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "NC restriction retained explicitly. Used for targeted factual cross-check and bibliographic attribution only; no copied or adapted article expression, tables, figures or algorithms. No commercial rights to source expression are asserted; any future reuse of such expression requires permission.",
    "authorityAssessment": "Society-journal narrative review, predominantly trauma and interventional-radiology practice. Cross-check for anatomy/physiology limitations, not an iatrogenic comparative guideline. Publication year is 2024 final issue, distinct from 2023 advance.",
    "usageRole": "both",
    "accessMethod": "Public full text via web tool; article-specific license checked. Bibliographic metadata only retained with independent atomic facts.",
    "verificationSections": [
      "Operative management, printed page 151: hilar/complex injury, stability and polar partial resection",
      "Final PDF read at https://www.jstage.jst.go.jp/article/interventionalradiology/9/3/9_2022-0003/_pdf",
      "License verified against society author policy https://ir-journal.jp/wp-content/uploads/2024/06/ForAuthors_240605.pdf and the advance-publication PDF"
    ],
    "evidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.splenic-local-repair",
      "claim.intraop.operative-hemorrhage.splenic-partial-boundary",
      "claim.intraop.operative-hemorrhage.splenic-hilar-boundary",
      "claim.intraop.operative-hemorrhage.splenic-total-control"
    ]
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.operative-hemorrhage.wses-spleen-2017",
    "title": "Splenic trauma: WSES classification and guidelines for adult and pediatric patients",
    "completeCitation": "Coccolini F, Montori G, Catena F, et al. Splenic trauma: WSES classification and guidelines for adult and pediatric patients. World Journal of Emergency Surgery. 2017;12:40. doi:10.1186/s13017-017-0151-4.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Giulia Montori",
      "Fausto Catena",
      "Yoram Kluger",
      "Walter Biffl",
      "WSES expert panel"
    ],
    "publicationYear": 2017,
    "doi": "10.1186/s13017-017-0151-4",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-017-0151-4",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://link.springer.com/article/10.1186/s13017-017-0151-4",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Read openly licensed factual sections and the article-specific license. Independently synthesized facts with attribution; no source prose, excerpts, tables, images, algorithms or article files retained. This citation is not clinical approval.",
    "authorityAssessment": "Trauma guideline distinguishes adult and pediatric recommendations. Its uncertainty about adult operative salvage is preserved, and is not transformed into a mandate for elective iatrogenic injuries.",
    "usageRole": "both",
    "accessMethod": "Public full text via web tool; article-specific license checked. Bibliographic metadata only retained with independent atomic facts.",
    "verificationSections": [
      "Adult operative management: instability and uncertainty about operative splenic salvage",
      "Rights and permissions"
    ],
    "evidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.splenic-instability",
      "claim.intraop.operative-hemorrhage.splenic-guideline-uncertainty"
    ]
  },
  {
    "contentVersion": "clinical.intraop.operative-hemorrhage-and-splenic-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.operative-hemorrhage.sbait-2026",
    "title": "Brazilian Trauma Society?s (SBAIT) management guidelines of splenic injuries",
    "completeCitation": "Pivetta LGA, Antunes PDSL, Miranda JO, et al. Brazilian Trauma Society?s (SBAIT) management guidelines of splenic injuries. Revista do Col?gio Brasileiro de Cirurgi?es. 2026;53:e2026004925. doi:10.1590/0100-6991e-2026004925-en.",
    "organizationOrJournal": "Revista do Col?gio Brasileiro de Cirurgi?es / Brazilian Trauma Society",
    "authors": [
      "Luca Giovanni Antonio Pivetta",
      "Pedro de Souza Lucarelli Antunes",
      "Juliana Oliveira de Miranda",
      "Daniel Fonseca Rohrs",
      "Timoteo Vilela Ver?ssimo",
      "Luis Fernando Rosati Rocha",
      "Ana Gabriela de Queiroz Figueiredo",
      "Joao Pedro Feu Soares",
      "Filipe Moreira de Andrade",
      "M?rcio Ramisio Norberto de Moura",
      "Rodrigo Gon?alves de Oliveira",
      "Ricardo Alessandro Teixeira Gonsaga",
      "Tercio de Campos"
    ],
    "publicationYear": 2026,
    "doi": "10.1590/0100-6991e-2026004925-en",
    "pmid": null,
    "officialUrl": "https://new.scielo.br/j/rcbc/a/qzHF98SLNL5Kt3krNDBwVgL/?lang=en",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "termsUrl": "https://new.scielo.br/j/rcbc/a/qzHF98SLNL5Kt3krNDBwVgL/?lang=en",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Read openly licensed factual sections and the article-specific license. Independently synthesized facts with attribution; no source prose, excerpts, tables, images, algorithms or article files retained. This citation is not clinical approval. Revision round 1 adds an independently written packing limitation after a targeted public full-text check; the original source record is preserved in reviewedV1Sources.",
    "authorityAssessment": "Current adult blunt-trauma consensus tailored to Brazilian trauma centers. Methods exclude pre/intraoperative-diagnosis and pediatric contexts. Sections 3.1 and 3.2 contain different salvage wording; do not resolve that internal discrepancy by guessing.",
    "usageRole": "both",
    "accessMethod": "Public full text via web tool; article-specific license checked. Bibliographic metadata only retained with independent atomic facts.",
    "verificationSections": [
      "Methods: scope exclusions",
      "Surgical strategies 3.1 and 3.2: physiological limitations and differing salvage language",
      "Open-access license and publication date",
      "Revision round 1 targeted recheck: surgical strategies 3.1, temporary splenic packing and source-population limitations."
    ],
    "evidenceClaimIds": [
      "claim.intraop.operative-hemorrhage.splenic-instability",
      "claim.intraop.operative-hemorrhage.splenic-guideline-uncertainty",
      "claim.intraop.operative-hemorrhage.splenic-packing-limitation"
    ]
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i25.naspghan-2015",
    "title": "Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee",
    "completeCitation": "Kramer RE, Lerner DG, Lin T, Manfredi M, Shah M, Stephen TC, Gibbons TE, Pall H, Sahn B, McOmber M, Zacur G, Friedlander J, Quiros AJ, Fishman DS, Mamula P. Management of ingested foreign bodies in children: a clinical report of the NASPGHAN Endoscopy Committee. J Pediatr Gastroenterol Nutr. 2015;60(4):562-574. doi:10.1097/MPG.0000000000000729.",
    "organizationOrJournal": "Journal of Pediatric Gastroenterology and Nutrition; NASPGHAN Endoscopy Committee",
    "authors": [
      "Robert E. Kramer",
      "Diana G. Lerner",
      "Tom Lin",
      "Michael Manfredi",
      "Manoj Shah",
      "Thomas C. Stephen",
      "Troy E. Gibbons",
      "Harpreet Pall",
      "Ben Sahn",
      "Mark McOmber",
      "George Zacur",
      "Joel Friedlander",
      "Antonio J. Quiros",
      "Douglas S. Fishman",
      "Petar Mamula"
    ],
    "publicationYear": 2015,
    "doi": "10.1097/MPG.0000000000000729",
    "pmid": null,
    "officialUrl": "https://naspghan.org/wp-content/uploads/2023/08/Management_of_Ingested_Foreign_Bodies_in_Children_.28.pdf",
    "accessedOn": "2026-11-13",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2015 ESPGHAN and NASPGHAN; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Society-hosted guidance used only to verify underlying facts. No expression, tables, algorithms or images reused. Public access does not confer an open reuse license.",
    "authorityAssessment": "Pediatric society clinical report. Older expert guidance directly addresses incohesive food-bolus removal, airway protection and index proximal/distal sampling. It is not a comparative device trial or an independent trial behind the later review.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i25.older-child-pattern.20261112.v1",
      "claim.intraop.i25.protected-airway.20261112.v1",
      "claim.intraop.i25.fragmented-bolus.20261112.v1",
      "claim.intraop.i25.index-sampling.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "p.562 airway protection during esophageal removal",
      "p.569 Esophageal Food Impaction: Management and Controversial Aspects"
    ],
    "accessMethod": "Fresh targeted reading of society-hosted guideline; source prose, figures, tables and algorithms are not stored.",
    "accessedAtUtc": "2026-11-13T01:00:24.899Z"
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i25.schluckebier-2022",
    "title": "Therapeutic Upper Gastrointestinal Endoscopy in Pediatric Gastroenterology",
    "completeCitation": "Schluckebier D, Afzal NA, Thomson M. Therapeutic upper gastrointestinal endoscopy in pediatric gastroenterology. Front Pediatr. 2022;9:715912. doi:10.3389/fped.2021.715912.",
    "organizationOrJournal": "Frontiers in Pediatrics",
    "authors": [
      "Dominique Schluckebier",
      "Nadeem Ahmad Afzal",
      "Mike Thomson"
    ],
    "publicationYear": 2022,
    "publicationDateNote": "Published 25 February 2022 in volume 9 (2021); the DOI year is not the publication year.",
    "doi": "10.3389/fped.2021.715912",
    "pmid": "35280448",
    "officialUrl": "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2021.715912/full",
    "accessedOn": "2026-11-13",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution (CC BY); copyright 2022 Schluckebier, Afzal and Thomson",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "CC BY attribution retained through complete citation, authors, journal, DOI and license link. Only underlying facts are independently synthesized; no article expression, tables, illustrations or patient images are adapted.",
    "authorityAssessment": "Pediatric therapeutic endoscopy review (publisher labels systematic review; the procedural section is a broad evidence narrative). Supports the direct-visualization boundary for pushing and acknowledges sparse comparative pediatric data. It reuses older guidance and is not independent efficacy replication.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i25.protected-airway.20261112.v1",
      "claim.intraop.i25.fragmented-bolus.20261112.v1",
      "claim.intraop.i25.push-view.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "Other > Food Impaction",
      "Foreign Body Ingestion: retrieval devices and clinical escalation boundaries"
    ],
    "accessMethod": "Accessible publisher full article and explicit CC BY notice; targeted factual verification only."
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i25.espghan-eoe-2024",
    "title": "Diagnosis and management of eosinophilic esophagitis in children: An update from ESPGHAN",
    "completeCitation": "Amil-Dias J, Oliva S, Papadopoulou A, Thomson M, Gutierrez-Junquera C, Kalach N, Orel R, Auth MKH, Nijenhuis-Hendriks D, Strisciuglio C, Baurain O, Chong S, Dominguez Ortega G, Fernandez Fernandez S, Furman M, Garcia-Puig R, Gottrand F, Homan M, Huysentruyt K, Kostovski A, Otte S, Rea F, Roma E, Romano C, Tzivinikos C, Urbonas V, Vande Velde S, Zangen T, Zevit N. Diagnosis and management of eosinophilic esophagitis in children: an update from the European Society for Paediatric Gastroenterology, Hepatology and Nutrition (ESPGHAN). J Pediatr Gastroenterol Nutr. 2024;79(2):394-437. doi:10.1002/jpn3.12188.",
    "organizationOrJournal": "Journal of Pediatric Gastroenterology and Nutrition; ESPGHAN EGID Working Group",
    "authors": [
      "Jorge Amil-Dias",
      "Salvatore Oliva",
      "Alexandra Papadopoulou",
      "Mike Thomson",
      "Carolina Gutierrez-Junquera",
      "Nicolas Kalach",
      "Rok Orel",
      "Marcus Karl-Heinz Auth",
      "Danielle Nijenhuis-Hendriks",
      "Caterina Strisciuglio",
      "Olivia Baurain",
      "Sonny Chong",
      "Gloria Dominguez Ortega",
      "Sonia Fernandez Fernandez",
      "Mark Furman",
      "Roger Garcia-Puig",
      "Frederic Gottrand",
      "Matjaz Homan",
      "Koen Huysentruyt",
      "Aco Kostovski",
      "Sebastian Otte",
      "Francesca Rea",
      "Eleftheria Roma",
      "Claudio Romano",
      "Christos Tzivinikos",
      "Vaidotas Urbonas",
      "Saskia Vande Velde",
      "Tsili Zangen",
      "Noam Zevit"
    ],
    "publicationYear": 2024,
    "doi": "10.1002/jpn3.12188",
    "pmid": null,
    "officialUrl": "https://www.espghan.org/dam/jcr%3A9cf73630-43a3-4791-ac79-2c88f74aa1c7/J%2520pediatr%2520gastroenterol%2520nutr%2520-%25202024%2520-%2520Amil%25E2%2580%2590Dias%2520-%2520Diagnosis%2520and%2520management%2520of%2520eosinophilic%2520esophagitis%2520in%2520children%2520An.pdf",
    "accessedOn": "2026-11-13",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2024 ESPGHAN and NASPGHAN; no open reuse license assumed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Read the society-hosted guidance for targeted facts and citations. No protected prose, algorithms, tables, figures or excerpts are stored. The publisher-hosted version reserves AI/text-mining rights and is excluded from the evidence route; no continued publisher ingestion.",
    "authorityAssessment": "Pediatric specialty GRADE-informed consensus update. Directly supports multilevel sampling and anatomic mapping before dilation when the endoscopic survey cannot define the lumen. Recommendation strength does not make every supporting study high certainty.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i25.patchy-distribution.20261112.v1",
      "claim.intraop.i25.initial-biopsy-protocol.20261112.v1",
      "claim.intraop.i25.appearance-limit.20261112.v1",
      "claim.intraop.i25.ppi-confounding.20261112.v1",
      "claim.intraop.i25.anatomy-before-dilation.20261112.v1",
      "claim.intraop.i25.structural-histology.20261112.v1",
      "claim.intraop.i25.motility-scope.20261112.v1",
      "claim.intraop.i25.biopsy-scope.20261112.v1",
      "claim.intraop.i25.topical-response.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "Section 6.1, Q5, Statements 5.1 and 5.3; Recommendations 5.2-5.3",
      "Section 7.5, Q24, Statements 24.1-24.2 and Recommendation 24.1",
      "Section 7.5, Q25-Q26: selected dilation and medical care"
    ],
    "accessMethod": "Society-hosted public guideline accessed successfully using its indexed official PDF URL. Only targeted recommendations and bibliographic metadata used; extracted figure/algorithm summaries are excluded."
  },
  {
    "contentVersion": "question-intraop-pediatric-egd-food-impaction-eoe.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i25.sigenp-eoe-2025",
    "title": "Eosinophilic esophagitis in children and adolescents: a clinical practice guideline",
    "completeCitation": "Oliva S, Arrigo S, Bramuzzo M, Cisaro F, Dabizzi E, Di Nardo G, Gandullia P, Martinelli M, Mennini M, Monica F, Norsa L, Rea F, Renzo S, Romano C, Salvatore S, Savarino EV, Strisciuglio C, Tambucci R, Calabrese C, De Angelis P; SIGENP, AIGO, SIGE and SIED. Eosinophilic esophagitis in children and adolescents: a clinical practice guideline. Ital J Pediatr. 2025;51:242. doi:10.1186/s13052-025-02056-x.",
    "organizationOrJournal": "Italian Journal of Pediatrics; SIGENP with AIGO, SIGE and SIED endorsement",
    "authors": [
      "Salvatore Oliva",
      "Serena Arrigo",
      "Matteo Bramuzzo",
      "Fabio Cisaro",
      "Emanuele Dabizzi",
      "Giovanni Di Nardo",
      "Paolo Gandullia",
      "Massimo Martinelli",
      "Maurizio Mennini",
      "Fabio Monica",
      "Lorenzo Norsa",
      "Francesca Rea",
      "Sara Renzo",
      "Claudio Romano",
      "Silvia Salvatore",
      "Edoardo Vincenzo Savarino",
      "Caterina Strisciuglio",
      "Renato Tambucci",
      "Carlo Calabrese",
      "Paola De Angelis"
    ],
    "publicationYear": 2025,
    "doi": "10.1186/s13052-025-02056-x",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13052-025-02056-x",
    "accessedOn": "2026-11-13",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY 4.0 notice verified. Credit, DOI and license retained. Facts are newly expressed in synthetic applications; no source prose, tables, images or algorithms are reproduced or closely paraphrased.",
    "authorityAssessment": "Recent pediatric society guideline. Supplies initial six-biopsy distribution, normal-appearance limitation, treatment response and selected esophagram use. Shares some authors/evidence with ESPGHAN 2024, so two guideline citations are not two independent trials.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i25.older-child-pattern.20261112.v1",
      "claim.intraop.i25.index-sampling.20261112.v1",
      "claim.intraop.i25.patchy-distribution.20261112.v1",
      "claim.intraop.i25.initial-biopsy-protocol.20261112.v1",
      "claim.intraop.i25.appearance-limit.20261112.v1",
      "claim.intraop.i25.ppi-confounding.20261112.v1",
      "claim.intraop.i25.anatomy-before-dilation.20261112.v1",
      "claim.intraop.i25.structural-histology.20261112.v1",
      "claim.intraop.i25.motility-scope.20261112.v1",
      "claim.intraop.i25.biopsy-scope.20261112.v1",
      "claim.intraop.i25.topical-response.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "Q3.1 and Q3.2: older-child symptoms and diagnostic sampling",
      "Q5.2 and practice points: initial multilevel biopsies, normal mucosa and impaction",
      "Q5.3 and practice point: endoscopic caliber limits and esophagram",
      "Q4.1.1 and Q8.3.1: motility assessment and topical steroid response"
    ],
    "accessMethod": "Fresh targeted publisher article reading with explicit article-level CC BY 4.0 notice."
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i24.naspghan-2015",
    "title": "Management of Ingested Foreign Bodies in Children: A Clinical Report of the NASPGHAN Endoscopy Committee",
    "completeCitation": "Kramer RE, Lerner DG, Lin T, Manfredi M, Shah M, Stephen TC, Gibbons TE, Pall H, Sahn B, McOmber M, Zacur G, Friedlander J, Quiros AJ, Fishman DS, Mamula P. Management of ingested foreign bodies in children: a clinical report of the NASPGHAN Endoscopy Committee. J Pediatr Gastroenterol Nutr. 2015;60(4):562-574. doi:10.1097/MPG.0000000000000729.",
    "organizationOrJournal": "Journal of Pediatric Gastroenterology and Nutrition; NASPGHAN Endoscopy Committee",
    "authors": [
      "Robert E. Kramer",
      "Diana G. Lerner",
      "Tom Lin",
      "Michael Manfredi",
      "Manoj Shah",
      "Thomas C. Stephen",
      "Troy E. Gibbons",
      "Harpreet Pall",
      "Ben Sahn",
      "Mark McOmber",
      "George Zacur",
      "Joel Friedlander",
      "Antonio J. Quiros",
      "Douglas S. Fishman",
      "Petar Mamula"
    ],
    "publicationYear": 2015,
    "doi": "10.1097/MPG.0000000000000729",
    "pmid": null,
    "officialUrl": "https://naspghan.org/files/documents/pdfs/training/curriculum-resources/procedures-curriculum/Kramer_et_al_2015_Management_of_Ingested_Foreign_Bodies_in_Children_A_Clinical_Report_of_the_NASPGHAN_Endoscopy_Committee.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2015 ESPGHAN and NASPGHAN; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Society-hosted guidance used only to verify underlying facts. No expression, tables, algorithms or images reused. Public access does not confer an open reuse license.",
    "authorityAssessment": "Pediatric specialty clinical report; older consensus, cross-checked with 2021 battery guidance, 2025 government guideline and independent device/magnet studies. These publications are not five independent trials.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i24.device-fit.20261112.v1",
      "claim.intraop.i24.flat-coin-forceps.20261112.v1",
      "claim.intraop.i24.child-procedure-support.20261112.v1",
      "claim.intraop.i24.retained-blunt-object.20261112.v1",
      "claim.intraop.i24.battery-injury-assessment.20261112.v1",
      "claim.intraop.i24.battery-cross-sectional.20261112.v1",
      "claim.intraop.i24.battery-swallow-role.20261112.v1",
      "claim.intraop.i24.magnet-number.20261112.v1",
      "claim.intraop.i24.magnet-plain-imaging.20261112.v1",
      "claim.intraop.i24.magnet-cross-wall-injury.20261112.v1",
      "claim.intraop.i24.magnet-operative-escalation.20261112.v1",
      "claim.intraop.i24.magnet-distal-endoscopy.20261112.v1",
      "claim.intraop.i24.magnet-distal-observation.20261112.v1",
      "claim.intraop.i24.retrieval-basket.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "pp.562-563 airway and individualized retrieval context",
      "pp.564-566 battery injury/vascular assessment and multiple magnets",
      "pp.570-571 coin management and accessories"
    ],
    "accessMethod": "Public primary publisher/government/society page; targeted factual verification. No full text, excerpt, figure, algorithm or patient image stored."
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i24.espghan-battery-2021",
    "title": "Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood",
    "completeCitation": "Mubarak A, Benninga MA, Broekaert I, Dolinsek J, Homan M, Mas E, Miele E, Pienar C, Thapar N, Thomson M, Tzivinikos C, de Ridder L. Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood: A European Society for Paediatric Gastroenterology Hepatology and Nutrition Position Paper. J Pediatr Gastroenterol Nutr. 2021;73(1):129-136. doi:10.1097/MPG.0000000000003048.",
    "organizationOrJournal": "Journal of Pediatric Gastroenterology and Nutrition; ESPGHAN",
    "authors": [
      "Amani Mubarak",
      "Marc A. Benninga",
      "Ilse Broekaert",
      "Jernej Dolinsek",
      "Matjaz Homan",
      "Emmanuel Mas",
      "Erasmo Miele",
      "Corina Pienar",
      "Nikhil Thapar",
      "Mike Thomson",
      "Christos Tzivinikos",
      "Lissy de Ridder"
    ],
    "publicationYear": 2021,
    "doi": "10.1097/MPG.0000000000003048",
    "pmid": null,
    "officialUrl": "https://www.espghan.org/dam/jcr:d48f6517-1bd2-4dfd-8b3e-a82602faba9e/Diagnosis,_Management,_and_Prevention_of_Button..pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2021 ESPGHAN and NASPGHAN; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Official society-hosted guidance, targeted facts and citation only. No source prose, algorithms, tables or figures copied.",
    "authorityAssessment": "Pediatric battery-specific consensus paper; management evidence is often observational or experimental. Imaging role cross-checked with NASPGHAN and MaHTAS, which share some cited evidence.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i24.battery-injury-assessment.20261112.v1",
      "claim.intraop.i24.battery-cross-sectional.20261112.v1",
      "claim.intraop.i24.battery-swallow-role.20261112.v1",
      "claim.intraop.i24.battery-observation.20261112.v1",
      "claim.intraop.i24.battery-luminal-followup.20261112.v1",
      "claim.intraop.i24.battery-catheter-angiography.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "pp.131-132 imaging and endoscopic assessment after removal",
      "p.134 postremoval evaluation and follow-up",
      "p.135 conclusions, severe mucosal injury and vascular imaging"
    ],
    "accessMethod": "Public primary publisher/government/society page; targeted factual verification. No full text, excerpt, figure, algorithm or patient image stored."
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i24.mahtas-2025",
    "title": "Management of Foreign Body Ingestion in Children",
    "completeCitation": "Malaysian Health Technology Assessment Section (MaHTAS), Medical Development Division, Ministry of Health Malaysia. Management of Foreign Body Ingestion in Children. Putrajaya: Ministry of Health Malaysia; 2025. eISBN 978-629-7842-23-3.",
    "organizationOrJournal": "Ministry of Health Malaysia; MaHTAS",
    "authors": [
      "MaHTAS Clinical Practice Guideline Development Group"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.moh.gov.my/images/04-penerbitan/penerbitan-klinikal/panduan-amalan-klinikal/CPG_Foreign_Body_Ingestion_in_Children_2025_compressed.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "Copyright MaHTAS; conditional unchanged reproduction with acknowledgement; sale/promotion restricted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Government does not mean public domain. Only independently written underlying facts and bibliographic metadata retained. No reproduced content or reliance on permission for product endorsement.",
    "authorityAssessment": "Recent government evidence synthesis; many recommendations rely on observational studies/consensus. Local service pathways are not assumed to apply to this ASC.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i24.retained-blunt-object.20261112.v1",
      "claim.intraop.i24.battery-cross-sectional.20261112.v1",
      "claim.intraop.i24.battery-swallow-role.20261112.v1",
      "claim.intraop.i24.battery-observation.20261112.v1",
      "claim.intraop.i24.magnet-number.20261112.v1",
      "claim.intraop.i24.magnet-plain-imaging.20261112.v1",
      "claim.intraop.i24.magnet-cross-wall-injury.20261112.v1",
      "claim.intraop.i24.magnet-operative-escalation.20261112.v1",
      "claim.intraop.i24.magnet-complication-ct.20261112.v1",
      "claim.intraop.i24.battery-luminal-followup.20261112.v1",
      "claim.intraop.i24.radiolucent-ultrasound.20261112.v1",
      "claim.intraop.i24.magnet-distal-observation.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "printed pp.8-14 imaging of magnet number/location, battery complications and plain radiography first line",
      "printed pp.23-25 operative indications with complications or failed removal",
      "printed pp.28-31 disposition limitations"
    ],
    "accessMethod": "Public primary publisher/government/society page; targeted factual verification. No full text, excerpt, figure, algorithm or patient image stored."
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i24.lee-devices-2023",
    "title": "Clinical Experiences and Selection of Accessory Devices for Pediatric Endoscopic Foreign Body Removal: A Retrospective Multicenter Study in Korea",
    "completeCitation": "Lee YJ, Lee JH, Park KY, Park JS, Park JH, Lim TJ, Myong JP, Chung JH, Seo JH. Clinical Experiences and Selection of Accessory Devices for Pediatric Endoscopic Foreign Body Removal: A Retrospective Multicenter Study in Korea. J Korean Med Sci. 2023;38(1):e2. doi:10.3346/jkms.2023.38.e2.",
    "organizationOrJournal": "Journal of Korean Medical Science",
    "authors": [
      "Yeoun Joo Lee",
      "Ji-Hyuk Lee",
      "Kie Young Park",
      "Ji Sook Park",
      "Jae Hong Park",
      "Taek Jin Lim",
      "Jun-Pyo Myong",
      "Jae Hun Chung",
      "Ji-Hyun Seo"
    ],
    "publicationYear": 2023,
    "doi": "10.3346/jkms.2023.38.e2",
    "pmid": null,
    "officialUrl": "https://jkms.org/DOIx.php?id=10.3346/jkms.2023.38.e2",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "CC BY-NC 4.0; Korean Academy of Medical Sciences",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "License verified on primary publisher page. Attribution: Lee and colleagues, JKMS 2023, DOI above; license https://creativecommons.org/licenses/by-nc/4.0/. No source expression or figure reused; original fictional applications are not a claim of permission for commercial adaptation. Any future expressive reuse requires separate rights review.",
    "authorityAssessment": "Independent pediatric multicenter retrospective device study. Accessory comparisons were not randomized and excluded some difficult/multiple-device cases; no universal device superiority, speed promise or age/weight threshold inferred.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i24.device-fit.20261112.v1",
      "claim.intraop.i24.flat-coin-forceps.20261112.v1",
      "claim.intraop.i24.round-object-net.20261112.v1",
      "claim.intraop.i24.long-object-snare.20261112.v1",
      "claim.intraop.i24.child-procedure-support.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "Discussion: shape, narrow pediatric lumen, flat objects and forceps",
      "Discussion: round/smooth objects, retrieval nets, long objects and snares",
      "Methods/limitations: nonrandomized device choice and exclusion of multiple-device cases"
    ],
    "accessMethod": "Public primary publisher/government/society page; targeted factual verification. No full text, excerpt, figure, algorithm or patient image stored."
  },
  {
    "contentVersion": "question-intraop-pediatric-endoscopy-foreign-body.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.i24.alansari-magnets-2024",
    "title": "Magnet ingestion in growing children: a multi-center observational study on single and multiple magnet incidents",
    "completeCitation": "Alansari AN, Baykuziyev T, Soyer T, Akinci SM, Al Ali KK, Aljneibi A, Alyasi NH, Afzal M, Ksia A. Magnet ingestion in growing children: a multi-center observational study on single and multiple magnet incidents. Sci Rep. 2024;14:4575. doi:10.1038/s41598-024-55127-0.",
    "organizationOrJournal": "Scientific Reports",
    "authors": [
      "Amani N. Alansari",
      "Temur Baykuziyev",
      "Tutku Soyer",
      "Servet Melike Akinci",
      "Khalid Khalfan Al Ali",
      "Adel Aljneibi",
      "Nafea Hussain Alyasi",
      "Muhammad Afzal",
      "Amine Ksia"
    ],
    "publicationYear": 2024,
    "doi": "10.1038/s41598-024-55127-0",
    "pmid": null,
    "officialUrl": "https://www.nature.com/articles/s41598-024-55127-0",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "License verified on publisher page. Attribution: Alansari and colleagues, Scientific Reports 2024, DOI above; license https://creativecommons.org/licenses/by/4.0/. Facts independently synthesized; no article text, data table, image or figure reused.",
    "authorityAssessment": "Independent multicenter retrospective pediatric cohort. Supports existence of multiple-magnet complications and need for combined endoscopic/surgical care, not a causal estimate or a universal decision threshold. No observed demographic association becomes a selection weight.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.i24.magnet-cross-wall-injury.20261112.v1",
      "claim.intraop.i24.magnet-operative-escalation.20261112.v1",
      "claim.intraop.i24.magnet-complication-ct.20261112.v1",
      "claim.intraop.i24.magnet-extraluminal-gas.20261112.v1"
    ],
    "targetedVerificationLocators": [
      "Results: single versus multiple magnets and complication patterns",
      "Results: children proceeding from endoscopy to surgery",
      "Methods: retrospective design and care-setting limitations",
      "Discussion: AP/lateral plain imaging, selective CT and localized pneumoperitoneum"
    ],
    "accessMethod": "Public primary publisher/government/society page; targeted factual verification. No full text, excerpt, figure, algorithm or patient image stored."
  },
  {
    "id": "source.intraop.thyroid.ata2025",
    "title": "2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer",
    "completeCitation": "Ringel MD, Sosa JA, Baloch Z, Bischoff L, Bloom G, Brent GA, Brock PL, Chou R, Flavell RR, Goldner W, Grubbs EG, Haymart M, Larson SM, Leung AM, Osborne JR, Ridge JA, Robinson B, Steward DL, Tufano RP, Wirth LJ. 2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer. Thyroid. 2025;35(8):841-985. doi:10.1177/10507256251363120.",
    "organizationOrJournal": "American Thyroid Association; Thyroid",
    "authors": [
      "Matthew D. Ringel",
      "Julie Ann Sosa",
      "Zubair Baloch",
      "Lindsay Bischoff",
      "Gary Bloom",
      "Gregory A. Brent",
      "Pamela L. Brock",
      "Roger Chou",
      "Robert R. Flavell",
      "Whitney Goldner",
      "Elizabeth G. Grubbs",
      "Megan Haymart",
      "Steven M. Larson",
      "Angela M. Leung",
      "Joseph R. Osborne",
      "John A. Ridge",
      "Bruce Robinson",
      "David L. Steward",
      "Ralph P. Tufano",
      "Lori J. Wirth"
    ],
    "publicationYear": 2025,
    "doi": "10.1177/10507256251363120",
    "pmid": null,
    "officialUrl": "https://doi.org/10.1177/10507256251363120",
    "verificationUrl": "https://thyca.org/wp-content/uploads/DTCGuidelines.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright American Thyroid Association; no general reuse license claimed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Used for targeted factual verification of recommendations 15, 16 and 23 and their nerve-function discussion, using the publicly hosted society guideline. The accessed PDF carries a personal-use notice. No PDF download, repository copy, excerpt, protected table or algorithm is retained. The packet cites independently expressed underlying facts; neither public hosting nor citation grants reproduction or corpus rights.",
    "rightsCheckedUrls": [
      "https://thyca.org/wp-content/uploads/DTCGuidelines.pdf",
      "https://www.thyroid.org/professionals/ata-professional-guidelines/",
      "https://thyca.org/"
    ],
    "authorityAssessment": "Current adult differentiated-thyroid-cancer society guideline. Recommendation 23D is a good-practice statement, not a randomized comparison; its cancer population does not authorize every benign, invasive or pediatric extrapolation.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.thyroid.whole-path",
      "claim.intraop.thyroid.defer-contralateral",
      "claim.intraop.thyroid.reassess-recovery",
      "claim.intraop.thyroid.bilateral-cancer",
      "claim.intraop.thyroid.ebsln-target"
    ],
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "source.intraop.thyroid.kinmos2018",
    "title": "Standards for Intraoperative Neuromonitoring in Thyroid Operations",
    "completeCitation": "Kim HY, Liu X, Chai YJ, Tufano R, Dralle H, Dionigi G; Korean Intraoperative Neural Monitoring Society. Standards for Intraoperative Neuromonitoring in Thyroid Operations. Journal of Endocrine Surgery. 2018;18(1):37-48. doi:10.16956/jes.2018.18.1.37. Publisher: Korean Association of Thyroid and Endocrine Surgeons.",
    "organizationOrJournal": "Journal of Endocrine Surgery; Korean Intraoperative Neural Monitoring Society; Korean Association of Thyroid and Endocrine Surgeons",
    "authors": [
      "Hoon Yub Kim",
      "Xiaoli Liu",
      "Young Jun Chai",
      "Ralph Tufano",
      "Henning Dralle",
      "Gianlorenzo Dionigi",
      "Korean Intraoperative Neural Monitoring Society"
    ],
    "publicationYear": 2018,
    "doi": "10.16956/jes.2018.18.1.37",
    "pmid": null,
    "officialUrl": "https://doi.org/10.16956/jes.2018.18.1.37",
    "verificationUrl": "https://m.jes-online.org/search.php?code=1219JES&id=10.16956/jes.2018.18.1.37&vmode=FULL&where=aview",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC 4.0; copyright 2018 Korean Association of Thyroid and Endocrine Surgeons",
    "licenseUrl": "https://creativecommons.org/licenses/by-nc/4.0/",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Article-level license and journal open-access notice were inspected. The notice restricts commercial reproduction. This is targeted factual use of a society standards statement with original synthesis, full attribution and a license link; no licensed expression, flowchart, illustration or table is adapted. Copyright 2018 Korean Association of Thyroid and Endocrine Surgeons. Public availability is not treated as blanket commercial or AI-corpus permission.",
    "rightsCheckedUrls": [
      "https://www.jes-online.org/index.php?body=openaccess",
      "https://doi.org/10.16956/jes.2018.18.1.37"
    ],
    "authorityAssessment": "Specialist society standards narrative covering technical troubleshooting and segmental versus global monitoring findings. Older expert guidance is cross-checked against ATA 2025 and the recent technical review; this is not an independent randomized outcomes dataset.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.thyroid.twitch-recording",
      "claim.intraop.thyroid.blockade",
      "claim.intraop.thyroid.stimulus-reaches-muscle",
      "claim.intraop.thyroid.distal-bypass",
      "claim.intraop.thyroid.visual-continuity",
      "claim.intraop.thyroid.verified-ipsilateral",
      "claim.intraop.thyroid.defer-contralateral",
      "claim.intraop.thyroid.no-permanence"
    ],
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "source.intraop.thyroid.wojtczak2017",
    "title": "The learning curve for intraoperative neuromonitoring of the recurrent laryngeal nerve in thyroid surgery",
    "completeCitation": "Wojtczak B, Kaliszewski K, Sutkowski K, Glod M, Barczynski M. The learning curve for intraoperative neuromonitoring of the recurrent laryngeal nerve in thyroid surgery. Langenbeck's Archives of Surgery. 2017;402(4):701-708. doi:10.1007/s00423-016-1438-8. Published online May 13, 2016.",
    "organizationOrJournal": "Langenbeck's Archives of Surgery",
    "authors": [
      "Beata Wojtczak",
      "Krzysztof Kaliszewski",
      "Krzysztof Sutkowski",
      "Mateusz Glod",
      "Marcin Barczynski"
    ],
    "publicationYear": 2017,
    "publicationDateNote": "Issue year 2017; online publication May 13, 2016.",
    "doi": "10.1007/s00423-016-1438-8",
    "pmid": "27178203",
    "officialUrl": "https://link.springer.com/article/10.1007/s00423-016-1438-8",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "The publisher's article-specific Rights and permissions section explicitly states CC BY 4.0. Credit is given here to every author, the journal and DOI with the license link. This packet independently synthesizes technical facts; no source wording, patient dataset, figure or table is reproduced. PMC access initially returned a browser challenge; the openly licensed publisher page was read directly instead.",
    "rightsCheckedUrls": [
      "https://link.springer.com/article/10.1007/s00423-016-1438-8#rightslink"
    ],
    "authorityAssessment": "Prospectively analyzed single-center implementation series, useful independent corroboration for electrode malposition, palpable contraction and vagal verification. It does not establish universal complication rates, a new monitoring threshold or an optimal completion interval.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.thyroid.electrode-contact",
      "claim.intraop.thyroid.twitch-recording",
      "claim.intraop.thyroid.stimulus-reaches-muscle",
      "claim.intraop.thyroid.whole-path"
    ],
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "source.intraop.thyroid.chai2026",
    "title": "Common causes of intraoperative neuromonitoring failure during thyroid surgery and practical solutions: a narrative review",
    "completeCitation": "Chai YJ. Common causes of intraoperative neuromonitoring failure during thyroid surgery and practical solutions: a narrative review. Journal of Neuromonitoring and Neurophysiology. 2026;6(1):28-37. doi:10.54441/jnn.2026.6.1.28. Published May 30, 2026.",
    "organizationOrJournal": "Journal of Neuromonitoring and Neurophysiology; Korean Intraoperative Neural Monitoring Society",
    "authors": [
      "Young Jun Chai"
    ],
    "publicationYear": 2026,
    "doi": "10.54441/jnn.2026.6.1.28",
    "pmid": null,
    "officialUrl": "https://japts.org/journal/view.php?number=98&viewtype=pubreader",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Article links CC BY-NC 4.0; noncommercial restriction retained despite broader surrounding wording",
    "licenseUrl": "https://creativecommons.org/licenses/by-nc/4.0/",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Copyright 2026 Korean Intraoperative Neural Monitoring Society. The article-level notice describes attribution but links BY-NC; the narrower linked noncommercial condition governs this rights assessment. Public journal author instructions were also checked. Only original atomic technical facts with attribution are retained; no algorithm, table, drug dosing scheme or source expression is copied or adapted.",
    "rightsCheckedUrls": [
      "https://japts.org/journal/view.php?number=98&viewtype=pubreader",
      "https://www.japts.org/authors/authors.php"
    ],
    "authorityAssessment": "Current specialist technical narrative, helpful for causes of false signal loss and anesthetic confounding. It explicitly lacks systematic evidence grading and does not independently determine operative extent or pediatric management.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.thyroid.electrode-contact",
      "claim.intraop.thyroid.blockade",
      "claim.intraop.thyroid.verified-ipsilateral",
      "claim.intraop.thyroid.no-permanence",
      "claim.intraop.thyroid.ebsln-target"
    ],
    "contentVersion": "clinical.intraop.thyroid-nerve-monitoring.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.unexpected-bowel.ascrs-2025",
    "title": "ASCRS appendiceal-neoplasm guideline (2025)",
    "completeCitation": "Gaertner WB, Brown SR, Deutsch M, Jafari MD, Krane MK, Simianu VV, Valente MA, Lightner AL, Feingold DL, Paquette IM; Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Appendiceal Neoplasms. Dis Colon Rectum. 2025;68(7):815-834. doi:10.1097/DCR.0000000000003796.",
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
    "pmid": null,
    "officialUrl": "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982016/all/Management_of_Appendiceal_Neoplasms__2025_?q=management+practice",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASCRS 2025; targeted factual verification only.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "The current public society page with its ordinary search query was successfully opened on 2026-11-12; recommendations 2 and 11 were checked directly. The no-query page and linked PDF returned 403, and the old free-resource URL redirected to a moved-document notice; those failed routes and their snippets were not evidence. The local 2026-11-11 ledger independently records a prior permitted retrieval of the same publication. ASCRS Access to and Use of Works Policy was identified; it is not an open license. No authentication, access-control workaround, source text, table, algorithm or image is used. Only underlying facts are independently synthesized.",
    "authorityAssessment": "Current specialty GRADE guidance. Incidental abnormal-appendix management is a strong recommendation based on low-quality evidence; routine peritoneal cytology is a conditional low-quality recommendation. One publication even when represented by multiple URLs or older local source IDs.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.unexpected-bowel.abnormal-appendix",
      "claim.intraop.unexpected-bowel.base-margin",
      "claim.intraop.unexpected-bowel.intact-specimen",
      "claim.intraop.unexpected-bowel.histology-before-colectomy",
      "claim.intraop.unexpected-bowel.mucin-uncertainty",
      "claim.intraop.unexpected-bowel.representative-deposit",
      "claim.intraop.unexpected-bowel.cytology-limit",
      "claim.intraop.unexpected-bowel.unplanned-surgery-limit"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.unexpected-bowel.sico-2023",
    "title": "SICO consensus on appendiceal tumors and peritoneal disease (2023)",
    "completeCitation": "Vaira M, Robella M, Guaglio M, Berchialla P, Sommariva A, Valle M, Pasqual EM, Roviello F, Framarini M, et al., Deraco M. Diagnostic and Therapeutic Algorithm for Appendiceal Tumors and Pseudomyxoma Peritonei: A Consensus of the Peritoneal Malignancies Oncoteam of the Italian Society of Surgical Oncology (SICO). Cancers (Basel). 2023;15(3):728. doi:10.3390/cancers15030728.",
    "organizationOrJournal": "Italian Society of Surgical Oncology / Cancers",
    "authors": [
      "Marco Vaira",
      "Manuela Robella",
      "Marcello Guaglio",
      "Paola Berchialla",
      "Antonio Sommariva",
      "Mario Valle",
      "Enrico Maria Pasqual",
      "Franco Roviello",
      "Massimo Framarini",
      "additional coauthors as listed in publication",
      "Marcello Deraco"
    ],
    "publicationYear": 2023,
    "doi": "10.3390/cancers15030728",
    "pmid": null,
    "officialUrl": "https://www.mdpi.com/2072-6694/15/3/728",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International; https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 and MDPI Terms of Use checked. Attribution to Vaira et al. Facts and application are independently written; no flowchart, table, wording or other protected expression is adapted or stored. The discussion and narrow unexpected-discovery recommendations were verified in HTML; the PDF link failed and is not a separate source.",
    "authorityAssessment": "Specialty consensus based mainly on observational literature and expert judgment. Independent society corroboration of limiting unplanned surgery to diagnosis or emergency treatment. Some underlying literature overlaps ASCRS; not an independent trial.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.unexpected-bowel.mucin-uncertainty",
      "claim.intraop.unexpected-bowel.representative-deposit",
      "claim.intraop.unexpected-bowel.unplanned-surgery-limit"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.unexpected-bowel.ecco-escp-2018",
    "title": "ECCO-ESCP surgical Crohn consensus (2018)",
    "completeCitation": "Bemelman WA, Warusavitarne J, Sampietro GM, Serclova Z, Zmora O, Luglio G, de Buck van Overstraeten A, Burke JP, Buskens CJ, Colombo F, et al.; ECCO and ESCP. ECCO-ESCP Consensus on Surgery for Crohn's Disease. J Crohns Colitis. 2018;12(1):1-16. doi:10.1093/ecco-jcc/jjx061.",
    "organizationOrJournal": "European Crohn's and Colitis Organisation / European Society of Colo-Proctology / Journal of Crohn's and Colitis",
    "authors": [
      "Willem A. Bemelman",
      "Janindra Warusavitarne",
      "Gianluca M. Sampietro",
      "Zuzana Serclova",
      "Oded Zmora",
      "Gaetano Luglio",
      "Anthony de Buck van Overstraeten",
      "John P. Burke",
      "Christianne J. Buskens",
      "Francesco Colombo",
      "additional consensus authors as listed in publication"
    ],
    "publicationYear": 2018,
    "doi": "10.1093/ecco-jcc/jjx061",
    "pmid": null,
    "officialUrl": "https://academic.oup.com/ecco-jcc/article-pdf/12/1/1/23265508/jjx061.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2017 ECCO / Oxford University Press, all rights reserved. Targeted society-guidance verification only.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "The public guideline PDF was accessible without authentication. Only statements 7E and 3M and their focused supporting discussion were used for factual verification; no excerpt, figure or algorithm is retained. Oxford Standard Publication Reuse Rights was checked; no open license or commercial TDM permission is claimed. This is limited targeted factual verification of society guidance under the repository rule, not a corpus, training use or reproduction. HTML and an attempted society-hosted route failed and were not used for evidence.",
    "authorityAssessment": "Historical specialty consensus directly addressing unexpected ileitis and a normal appendix. Evidence levels for these narrow statements are low (EL5/EL4). The 2024 surgical-guideline landing page was located but could not be opened; this packet does not claim the 2018 statements were newly reaffirmed in 2024. WSES-AAST 2021 supplies an independent emergency-indication cross-check.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.unexpected-bowel.ileitis-nonspecific",
      "claim.intraop.unexpected-bowel.ileitis-resection-boundary",
      "claim.intraop.unexpected-bowel.normal-appendix-boundary",
      "claim.intraop.unexpected-bowel.ibd-emergency-boundary"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.unexpected-bowel.wses-aast-2021",
    "title": "WSES-AAST emergency IBD guideline (2021)",
    "completeCitation": "De Simone B, Davies J, Chouillard E, Di Saverio S, Hoentjen F, Tarasconi A, et al. WSES-AAST guidelines: management of inflammatory bowel disease in the emergency setting. World J Emerg Surg. 2021;16:23. doi:10.1186/s13017-021-00362-3.",
    "organizationOrJournal": "World Society of Emergency Surgery / American Association for the Surgery of Trauma / World Journal of Emergency Surgery",
    "authors": [
      "Belinda De Simone",
      "Justin Davies",
      "Elie Chouillard",
      "Salomone Di Saverio",
      "Frank Hoentjen",
      "Antonio Tarasconi",
      "additional guideline authors as listed in publication"
    ],
    "publicationYear": 2021,
    "doi": "10.1186/s13017-021-00362-3",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-021-00362-3",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International; https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 verified in Rights and permissions. Attributed original factual synthesis; no clinical table, exact recommendation prose, algorithm or figure reproduced. General IBD diagnostic context and emergency indications were checked at the publisher; the PMC route encountered a browser challenge and was not used.",
    "authorityAssessment": "Multidisciplinary emergency-surgery guidance, largely low-quality evidence for operative decisions. Supports emergency-indication boundaries, not the exact appendix-preservation rule; that rule has only the directly applicable ECCO-ESCP publication in this ledger.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.unexpected-bowel.ibd-emergency-boundary"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-unexpected-appendix-and-bowel-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.unexpected-bowel.blouhos-2018",
    "title": "Adult Meckel surgical concerns (2018)",
    "completeCitation": "Blouhos K, Boulas KA, Tsalis K, Barettas N, Paraskeva A, Kariotis I, Keskinis C, Hatzigeorgiadis A. Meckel's Diverticulum in Adults: Surgical Concerns. Front Surg. 2018;5:55. doi:10.3389/fsurg.2018.00055.",
    "organizationOrJournal": "Frontiers in Surgery",
    "authors": [
      "Konstantinos Blouhos",
      "Konstantinos A. Boulas",
      "Konstantinos Tsalis",
      "Nikolaos Barettas",
      "Aikaterini Paraskeva",
      "Ioannis Kariotis",
      "Christodoulos Keskinis",
      "Anestis Hatzigeorgiadis"
    ],
    "publicationYear": 2018,
    "doi": "10.3389/fsurg.2018.00055",
    "pmid": null,
    "officialUrl": "https://www.frontiersin.org/journals/surgery/articles/10.3389/fsurg.2018.00055/full",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International; https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article CC BY notice and linked terms route checked. The author attribution and publication citation are retained for original factual synthesis. No protected source prose, operative table, algorithm or illustration is copied. This publication also appears in the approved Meckel record and is counted once.",
    "authorityAssessment": "Narrative adult review based on retrospective series. Used to audit existing resection-extent coverage and identify uncertainty in incidental resection; it does not resolve that controversy or justify a new age/size threshold.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.unexpected-bowel.meckel-existing-extent",
      "claim.intraop.unexpected-bowel.meckel-incidental-disagreement"
    ]
  }
];
