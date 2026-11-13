// Frozen manager acceptance for the reviewed source versions.
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";
import type {QuestionShipAcceptance} from "./question-ship-manifest";
export const PROGRAM_BATCH10_ROWS:QuestionShipAcceptance[] = [
  {
    "acceptanceId": "question.intraop.asc-access.anterior-port-course.20261112.v1",
    "caseId": "case.intraop.asc-access.port-course.20261112.v1",
    "nodeId": "node.intraop.asc-access.anterior-port-course.20261112.v1",
    "questionVariantId": "question.intraop.asc-access.anterior-port-course.20261112.v1",
    "conceptId": "concept.intraop.asc-access.orthogonal-port-course-correction.v1",
    "sourceView": "intraop-batch10-asc-access-and-soft-tissue-surprises",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "conceptId": "concept.intraop-biliary.unexplained-bile-imaging.v1",
    "sourceView": "intraop-batch10-biliary-safety-and-duct-decisions",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "conceptId": "concept.n2.bile-leak-duct-continuity-boundary",
    "sourceView": "intraop-batch10-biliary-safety-and-duct-decisions",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "caseId": "case.intraop.biliary-safety.stone-clearance.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "conceptId": "concept.intraop-biliary.stone-clearance-route.v1",
    "sourceView": "intraop-batch10-biliary-safety-and-duct-decisions",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "sourceView": "intraop-batch10-endoscopic-perforation-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "sourceView": "intraop-batch10-endoscopic-perforation-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "sourceView": "intraop-batch10-endoscopic-perforation-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "caseId": "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
    "nodeId": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "questionVariantId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "conceptId": "concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "sourceView": "intraop-batch10-suspicious-polyps-retrieval-and-tattoo",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "caseId": "case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1",
    "nodeId": "node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "conceptId": "concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1",
    "sourceView": "intraop-batch10-anesthetic-intraoperative-crises",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "caseId": "case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1",
    "nodeId": "node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "questionVariantId": "question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "conceptId": "concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "sourceView": "intraop-batch10-endoscopic-upper-gi-hemostasis",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "caseId": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1",
    "nodeId": "node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "questionVariantId": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "conceptId": "concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "sourceView": "intraop-batch10-pediatric-anesthesia-events",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "caseId": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1",
    "nodeId": "node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "questionVariantId": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "conceptId": "concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "sourceView": "intraop-batch10-pediatric-anesthesia-events",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "caseId": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
    "nodeId": "node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "questionVariantId": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "conceptId": "concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1",
    "sourceView": "intraop-batch10-pediatric-orchiopexy-findings",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  }
];
export const PROGRAM_BATCH10_VIEWS:Record<string,SyntheticClinicalRelease> = {
  "intraop-batch10-asc-access-and-soft-tissue-surprises": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.asc-access.orthogonal-port-course-correction.v1",
        "displayName": "anterior port course",
        "learningObjective": "Use orthogonal completion views to recognize tributary malposition and preserve a usable central access route during correction.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.asc-access.port-course.20261112.v1",
        "displayName": "{patientName}: operative checkpoint",
        "patientPresentationVariantId": "presentation.intraop.asc-access.port-course.20261112.v1",
        "patientDisplayName": "Priya Shah",
        "releasePointId": "release.l3.ambulatory",
        "prototypeDemographics": {
          "ageYears": 47,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Port placement",
        "presentation": "{patientName}, a 47-year-old woman, is undergoing venous port implantation in the clinic's ASC operating room. The procedure is underway at completion imaging before the implant is accepted for use.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.asc-access.port-course.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 47,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Port placement",
            "presentation": "{patientName}, a 47-year-old woman, is undergoing venous port implantation in the clinic's ASC operating room. The procedure is underway at completion imaging before the implant is accepted for use."
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
          "Insights into Imaging (2019); 10.1186/s13244-019-0770-2",
          "Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727",
          "Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.asc-access.anterior-port-course.20261112.v1",
            "questionVariantId": "question.intraop.asc-access.anterior-port-course.20261112.v1",
            "primaryConceptId": "concept.intraop.asc-access.orthogonal-port-course-correction.v1",
            "currentUpdate": "After right jugular access, the catheter descends along the right mediastinal border on the frontal view. The lateral view places its lower segment immediately behind the sternum. A gentle hand-injected completion study outlines a narrow descending parasternal vein around that segment; the brachiocephalic vein and SVC fill without a narrowing, and contrast remains intravascular. Blood can be aspirated from the catheter.",
            "stem": "Which catheter maneuver should be selected before completing {patientName}'s port implantation on these views?",
            "answerChoices": [
              {
                "id": "choice.intraop.asc-access.anterior-port-course.redirect.20261112.v1",
                "label": "Withdraw the catheter to its branch point and redirect centrally",
                "isCorrect": true,
                "rationale": "The anterior parasternal course identifies a tributary rather than a catheter descending within the SVC. Patent central veins and an intravascular route support withdrawing from the tributary and redirecting under the ongoing imaging.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.asc-access.anterior-port-course.advance.20261112.v1",
                "label": "Advance the catheter along its current course to the intended depth",
                "isCorrect": false,
                "rationale": "Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.asc-access.anterior-port-course.replace-access.20261112.v1",
                "label": "Remove the current catheter and establish contralateral jugular access",
                "isCorrect": false,
                "rationale": "A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "showServicePreviews": true,
            "explanation": "The frontal projection is misleading: the anterior parasternal course fits the internal thoracic venous route rather than the SVC. Intravascular contrast and blood return do not establish a suitable long-term central position. With a patent central confluence, withdraw from the tributary and redirect under imaging before completing the port. This does not prescribe an exact tip-to-carina distance or routine high-right-atrial placement.",
            "sourceLabels": [
              "Insights into Imaging (2019); 10.1186/s13244-019-0770-2",
              "Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727",
              "Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.asc-access.anterior-port-course.advance.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The teaching record contains the selected response; no subsequent patient outcome is simulated.",
                "clinicalRationale": "Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.",
                "sourceLabels": [
                  "Insights into Imaging (2019); 10.1186/s13244-019-0770-2",
                  "Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727",
                  "Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.asc-access.anterior-port-course.replace-access.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The teaching record contains the selected response; no subsequent patient outcome is simulated.",
                "clinicalRationale": "A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.",
                "sourceLabels": [
                  "Insights into Imaging (2019); 10.1186/s13244-019-0770-2",
                  "Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727",
                  "Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The frontal projection is misleading: the anterior parasternal course fits the internal thoracic venous route rather than the SVC. Intravascular contrast and blood return do not establish a suitable long-term central position. With a patent central confluence, withdraw from the tributary and redirect under imaging before completing the port. This does not prescribe an exact tip-to-carina distance or routine high-right-atrial placement.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.central_venous_port_insertion",
          "kind": "operation",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery",
            "capability.fluoroscopy"
          ]
        }
      }
    ]
  },
  "intraop-batch10-biliary-safety-and-duct-decisions": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop-biliary.unexplained-bile-imaging.v1",
        "displayName": "Recognize an unexplained intraoperative bile source and select ductal mapping before choosing a repair or bailout.",
        "learningObjective": "Recognize an unexplained intraoperative bile source and select ductal mapping before choosing a repair or bailout.",
        "earliestFacilityStage": 3,
        "conceptType": "workup"
      },
      {
        "id": "concept.n2.bile-leak-duct-continuity-boundary",
        "displayName": "Duct continuity before a minor-leak stent pathway",
        "learningObjective": "Recognize when demonstrated bile-duct discontinuity prevents applying the preserved-continuity minor-leak ERCP pathway without HPB reassessment.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop-biliary.stone-clearance-route.v1",
        "displayName": "Use cystic-duct condition and common-duct caliber to choose a CBD-stone clearance route after attempted transcystic clearance.",
        "learningObjective": "Use cystic-duct condition and common-duct caliber to choose a CBD-stone clearance route after attempted transcystic clearance.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.biliary-safety.new-bile.20261112.v1",
        "displayName": "Bile during gallbladder dissection",
        "patientPresentationVariantId": "presentation.intraop.biliary-safety.new-bile.20261112.v1",
        "releasePointId": "release.l3.ambulatory",
        "patientDisplayName": "Priya Shah",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Gallbladder surgery",
        "presentation": "{patientName}, a 49-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The arterial branch entering the gallbladder has been clipped and divided. A clip is across the gallbladder end of the presumed cystic duct; a small opening has been made just below that clip for a catheter. This duct has not been divided across or clipped on its common-duct side. Fluoroscopy and near-infrared imaging are available; ICG was given at induction.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.biliary-safety.new-bile.female.49.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Gallbladder surgery",
            "presentation": "{patientName}, a 49-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The arterial branch entering the gallbladder has been clipped and divided. A clip is across the gallbladder end of the presumed cystic duct; a small opening has been made just below that clip for a catheter. This duct has not been divided across or clipped on its common-duct side. Fluoroscopy and near-infrared imaging are available; ICG was given at induction."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
          "Safe cholecystectomy multi-society practice guideline",
          "SAGES guidelines for intraoperative imaging of the common bile duct",
          "Clinical spotlight review: management of choledocholithiasis",
          "SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
            "questionVariantId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
            "primaryConceptId": "concept.intraop-biliary.unexplained-bile-imaging.v1",
            "currentUpdate": "Irrigation clears the field, but green fluid collects again medial to the gallbladder neck, away from the small duct opening. The gallbladder wall is unbroken. The duct opening is visible, accepts a fine catheter without traction and remains accessible below the gallbladder-side clip.",
            "stem": "Which mapping approach should be used for {patientName}'s recurrent bile at this laparoscopic cholecystectomy checkpoint?",
            "answerChoices": [
              {
                "id": "cholangiography",
                "label": "Acquire a transcystic contrast cholangiogram using fluoroscopy",
                "isCorrect": true,
                "rationale": "The accessible opening is below the clip and permits contrast to enter the ductal tree. Recurrent bile outside the unbroken gallbladder calls for assessment of the lumen and any escape of contrast.",
                "serviceRequest": null
              },
              {
                "id": "open-exploration",
                "label": "Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy",
                "isCorrect": false,
                "rationale": "Gallbladder injection is an operative cholangiography route when it communicates with the ducts. At this checkpoint the clip closes that outlet; filling the gallbladder would not provide the intended ductal study.",
                "serviceRequest": null
              },
              {
                "id": "complete-removal",
                "label": "Acquire a fluorescence cholangiogram using near-infrared imaging",
                "isCorrect": false,
                "rationale": "Fluorescence is useful for anatomical orientation, and ICG is already available in the bile. It does not replace the selected contrast study of the ductal lumen and extravasation in this new-bile assessment. The guideline preference is conditional, not a universal prohibition on fluorescence.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment.",
            "sourceLabels": [
              "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
              "Safe cholecystectomy multi-society practice guideline",
              "SAGES guidelines for intraoperative imaging of the common bile duct",
              "Clinical spotlight review: management of choledocholithiasis"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.intraop.biliary-safety.major-injury-transfer.20261112.v1",
            "questionVariantId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
            "primaryConceptId": "concept.n2.bile-leak-duct-continuity-boundary",
            "currentUpdate": "At the next checkpoint, the catheter has been removed. Suction and gentle retraction bring two open duct ends into view within the existing dissection field. Circulation remains stable and laparoscopic exposure permits drainage. The operating surgeon does not perform biliary reconstruction. The acquisition record is shown below.",
            "stem": "Which immediate plan should be selected for {patientName} after these findings during laparoscopic cholecystectomy?",
            "answerChoices": [
              {
                "id": "drain-transfer",
                "label": "Drain the subhepatic space and arrange hepatobiliary-center transfer",
                "isCorrect": true,
                "rationale": "These acquisitions connect the intrahepatic system and papilla to different open ends in the field. With bile control achievable and no local reconstructive expertise, drainage and hepatobiliary-center transfer provide the appropriate immediate bridge to specialist treatment.",
                "serviceRequest": null
              },
              {
                "id": "drain-ercp",
                "label": "Drain the subhepatic space and request transpapillary stenting",
                "isCorrect": false,
                "rationale": "A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.",
                "serviceRequest": null
              },
              {
                "id": "duct-anastomosis",
                "label": "Drain the subhepatic space and dissect proximally to expose the hepatic confluence",
                "isCorrect": false,
                "rationale": "The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed operative injection record",
              "items": [
                {
                  "label": "Injection through the cystic-duct opening below the gallbladder-side clip",
                  "value": "The duct enters a distal common-duct segment that fills to the duodenum. Contrast leaves the upper end of that segment into the operative field; the hepatic ducts do not fill."
                },
                {
                  "label": "Injection through the already exposed upper duct end",
                  "value": "Both right and left hepatic ducts fill. The lower duct and duodenum do not fill; contrast returns into the operative field around this opening."
                }
              ]
            },
            "sourceLabels": [
              "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
              "Safe cholecystectomy multi-society practice guideline",
              "SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "drain-ercp",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.",
                "clinicalRationale": "A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.",
                "sourceLabels": [
                  "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
                  "Safe cholecystectomy multi-society practice guideline",
                  "SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy"
                ]
              },
              {
                "answerChoiceId": "duct-anastomosis",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.",
                "clinicalRationale": "The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.",
                "sourceLabels": [
                  "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
                  "Safe cholecystectomy multi-society practice guideline",
                  "SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment. The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.laparoscopic_cholecystectomy",
          "kind": "operation",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery",
            "capability.fluoroscopy",
            "capability.intraoperative_cholangiography"
          ]
        }
      },
      {
        "id": "case.intraop.biliary-safety.stone-clearance.20261112.v1",
        "displayName": "Duct clearance at gallbladder surgery",
        "patientPresentationVariantId": "presentation.intraop.biliary-safety.stone-clearance.20261112.v1",
        "releasePointId": "release.l3.ambulatory",
        "patientDisplayName": "Naomi Brooks",
        "prototypeDemographics": {
          "ageYears": 62,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Gallbladder surgery",
        "presentation": "{patientName}, a 62-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The source team performs transcystic exploration, with referral access for endoscopic or surgical duct clearance. She has no prior gastric or duodenal surgery.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.biliary-safety.stone-clearance.female.62.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 62,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Gallbladder surgery",
            "presentation": "{patientName}, a 62-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The source team performs transcystic exploration, with referral access for endoscopic or surgical duct clearance. She has no prior gastric or duodenal surgery."
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
          "Clinical spotlight review: management of choledocholithiasis"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
            "questionVariantId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
            "primaryConceptId": "concept.intraop-biliary.stone-clearance-route.v1",
            "currentUpdate": "Cholangiography fills both hepatic ducts and the duodenum and shows a persistent distal common-duct stone on repeat views after flushing. The common duct measures 5 mm. A guidewire passes through the short angulated cystic duct, but the smallest available extraction basket cannot follow it; the cystic-duct wall begins to split at the opening with gentle instrument passage. Circulation remains stable.",
            "stem": "Which completion and duct-clearance plan best fits {patientName}'s findings during laparoscopic cholecystectomy?",
            "answerChoices": [
              {
                "id": "postoperative-ercp",
                "label": "Complete cholecystectomy and arrange retrograde transpapillary stone extraction",
                "isCorrect": true,
                "rationale": "Further transcystic passage is limited by the splitting narrow route. Direct common-duct incision carries an unfavorable caliber here. Complete the gallbladder operation with secure cystic closure and arrange endoscopic stone clearance rather than persisting with either operative route.",
                "serviceRequest": null
              },
              {
                "id": "transcystic-dilation",
                "label": "Complete cholecystectomy after further transcystic dilation and stone extraction",
                "isCorrect": false,
                "rationale": "Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.",
                "serviceRequest": null
              },
              {
                "id": "transductal-exploration",
                "label": "Complete cholecystectomy and arrange stone extraction through a common-duct incision",
                "isCorrect": false,
                "rationale": "A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The confirmed stone needs clearance. A splitting cystic duct weighs against further transcystic instrumentation, while the 5-mm common duct weighs against choledochotomy. The SAGES review describes transductal exploration in ducts at least 7 mm wide to limit stricture risk, a selection consideration rather than a biological cliff. With ordinary endoscopic access available, secure the cystic duct, complete cholecystectomy and arrange hospital ERCP. Different duct anatomy or failed endoscopic access could change that ranking.",
            "sourceLabels": [
              "Clinical spotlight review: management of choledocholithiasis"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "transcystic-dilation",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.",
                "clinicalRationale": "Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.",
                "sourceLabels": [
                  "Clinical spotlight review: management of choledocholithiasis"
                ]
              },
              {
                "answerChoiceId": "transductal-exploration",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.",
                "clinicalRationale": "A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.",
                "sourceLabels": [
                  "Clinical spotlight review: management of choledocholithiasis"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The confirmed stone needs clearance. A splitting cystic duct weighs against further transcystic instrumentation, while the 5-mm common duct weighs against choledochotomy. The SAGES review describes transductal exploration in ducts at least 7 mm wide to limit stricture risk, a selection consideration rather than a biological cliff. With ordinary endoscopic access available, secure the cystic duct, complete cholecystectomy and arrange hospital ERCP. Different duct anatomy or failed endoscopic access could change that ranking.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.laparoscopic_cholecystectomy",
          "kind": "operation",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery",
            "capability.fluoroscopy",
            "capability.intraoperative_cholangiography",
            "capability.transcystic_exploration"
          ]
        }
      }
    ]
  },
  "intraop-batch10-endoscopic-perforation-and-injury": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
        "displayName": "Fresh sigmoid defect: immediate local strategy",
        "learningObjective": "Interpret a freshly observed small clean colonic wall defect and choose immediate closure rather than unsealed observation or routine operative repair.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
        "displayName": "New cardiopulmonary compromise during closure",
        "learningObjective": "Recognize acute abdominal pressure physiology after bowel injury and prioritize percutaneous rescue before transport.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
        "displayName": "Dilation injury: closure strategy",
        "learningObjective": "Use observed apposable tissue in a small acute dilation-related esophageal defect to choose primary closure rather than coverage or an operation.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
        "displayName": "Colonoscopy",
        "patientDisplayName": "Elena Brooks",
        "patientPresentationVariantId": "presentation.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Colonoscopy",
        "presentation": "{patientName}, a 57-year-old woman, is undergoing screening colonoscopy in the clinic's endoscopy room.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
            "prototypeDemographics": {
              "ageYears": 57,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Colonoscopy",
            "presentation": "{patientName}, a 57-year-old woman, is undergoing screening colonoscopy in the clinic's endoscopy room."
          }
        ],
        "releasePointId": "release.l2.endoscopy",
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "endoscopy",
        "requiredCapabilityIds": [
          "capability.endoscopy",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation",
          "Needle Decompression of Tension Pneumoperitoneum: A Case Report"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
            "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
            "primaryConceptId": "concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
            "stem": "Which initial strategy is most appropriate for {patientName}'s newly observed sigmoid wall defect during colonoscopy?",
            "currentUpdate": "During sigmoid insertion, a 7-mm wall opening exposes yellow peritoneal fat. The adjacent edges are pink and mobile; the prepared lumen contains clear fluid. Blood pressure remains at baseline and the abdomen is soft. Insufflation is stopped, luminal fluid is suctioned and intravenous fluids and antibiotics are started while hospital transfer is coordinated.",
            "answerChoices": [
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.clips",
                "label": "Endoscopic clip closure of the sigmoid defect",
                "isCorrect": true,
                "rationale": "The newly seen small gap, mobile edges, clean lumen and preserved physiology support a prompt endoscopic closure attempt. Hospital monitoring and surgical consultation still follow.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.observe",
                "label": "Inpatient observation of the sigmoid defect",
                "isCorrect": false,
                "rationale": "Monitored nonoperative care fits selected sealed injuries. This accessible gap remains open during the procedure, so leaving it unclosed gives up a feasible opportunity to limit leakage.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.suture",
                "label": "Laparoscopic suture closure of the sigmoid defect",
                "isCorrect": false,
                "rationale": "Operative closure is important when endoscopic treatment is unsuitable or fails. The small clean defect and mobile margins support an endoscopic attempt before committing to an operation.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary.",
            "sourceLabels": [
              "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
            "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
            "primaryConceptId": "concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
            "stem": "Which immediate plan is most appropriate for {patientName}'s new abdominal and cardiopulmonary changes at the end of colonoscopy?",
            "currentUpdate": "During placement of the final clips, the abdomen becomes progressively distended. At the immediate reassessment, the clip line holds the defect edges together, but the abdomen is taut and tympanitic, blood pressure falls and assisted ventilation is difficult. The airway is patent and breath sounds remain bilateral. Insufflation remains stopped; airway and circulatory support continue and the receiving hospital has been contacted.",
            "answerChoices": [
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.catheter",
                "label": "Percutaneous release of intraperitoneal gas followed by hospital transfer",
                "isCorrect": true,
                "rationale": "The rapidly expanding tympanitic abdomen with simultaneous circulatory and ventilatory decline points to pressurized gas outside the bowel. Percutaneous decompression addresses that compartment before departure, while shared resuscitation and hospital escalation continue.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric",
                "label": "Orogastric tube decompression followed by supported hospital transfer",
                "isCorrect": false,
                "rationale": "Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport",
                "label": "Direct hospital transfer with ongoing airway and circulatory support",
                "isCorrect": false,
                "rationale": "The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Gas that escaped before insufflation stopped can remain outside the bowel after clip apposition. Here, abdominal expansion is evolving during the final closure steps and produces a new combined ventilatory and circulatory problem at reassessment. Emergency percutaneous decompression precedes transfer while airway and circulatory support continue. Improvement is temporization and does not establish a durable seal or remove the need for hospital assessment.",
            "sourceLabels": [
              "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation",
              "Needle Decompression of Tension Pneumoperitoneum: A Case Report"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.",
                "clinicalRationale": "Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.",
                "sourceLabels": [
                  "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation",
                  "Needle Decompression of Tension Pneumoperitoneum: A Case Report"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.",
                "clinicalRationale": "The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.",
                "sourceLabels": [
                  "2017 WSES guidelines for the management of iatrogenic colonoscopy perforation",
                  "Needle Decompression of Tension Pneumoperitoneum: A Case Report"
                ]
              }
            ]
          }
        ],
        "learningSummary": "A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary. Gas that escaped before insufflation stopped can remain outside the bowel after clip apposition. Here, abdominal expansion is evolving during the final closure steps and produces a new combined ventilatory and circulatory problem at reassessment. Emergency percutaneous decompression precedes transfer while airway and circulatory support continue. Improvement is temporization and does not establish a durable seal or remove the need for hospital assessment.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.colonoscopy_polypectomy",
          "kind": "endoscopy",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.endoscopy"
          ],
          "requiredCapabilityIds": [
            "capability.endoscopy",
            "capability.periop_recovery",
            "capability.endoscopic_closure",
            "capability.endoscopic_rescue"
          ]
        }
      },
      {
        "id": "case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1",
        "displayName": "Esophageal dilation",
        "patientDisplayName": "Mason Reed",
        "patientPresentationVariantId": "presentation.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1",
        "prototypeDemographics": {
          "ageYears": 55,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Esophageal dilation",
        "presentation": "{patientName}, a 55-year-old man, is undergoing balloon dilation of a short benign distal esophageal ring in the clinic's endoscopy room.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1",
            "prototypeDemographics": {
              "ageYears": 55,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Esophageal dilation",
            "presentation": "{patientName}, a 55-year-old man, is undergoing balloon dilation of a short benign distal esophageal ring in the clinic's endoscopy room."
          }
        ],
        "releasePointId": "release.l2.endoscopy",
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "endoscopy",
        "requiredCapabilityIds": [
          "capability.endoscopy",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Esophageal emergencies: WSES guidelines"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
            "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
            "primaryConceptId": "concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
            "stem": "Which initial closure strategy is most appropriate for {patientName}'s newly observed esophageal defect during dilation?",
            "currentUpdate": "After balloon deflation, an 8-mm opening in the distal esophageal wall exposes tissue beyond the lumen. The endoscopist has a face-on view, and the fresh margins move together with gentle suction. Blood pressure and ventilation remain at baseline. Luminal fluid is suctioned; intravenous support and hospital surgical consultation are being arranged.",
            "answerChoices": [
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.clips",
                "label": "Endoscopic clip approximation of the esophageal defect",
                "isCorrect": true,
                "rationale": "The small acute defect has accessible margins that approximate. Primary endoscopic clipping is supported for this anatomy; hospital assessment still addresses leakage and contamination.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.stent",
                "label": "Endoscopic covered stent across the esophageal defect",
                "isCorrect": false,
                "rationale": "Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.operative",
                "label": "Operative suture closure of the esophageal defect",
                "isCorrect": false,
                "rationale": "An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The wall opening was recognized during dilation and its small fresh margins approximate. These findings support primary endoscopic clip closure. Covered stenting remains an option for larger or incompletely closed defects; surgical source control addresses injuries unsuitable for endoscopic/nonoperative care. This decision does not authorize ASC discharge.",
            "sourceLabels": [
              "Esophageal emergencies: WSES guidelines"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.stent",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.",
                "clinicalRationale": "Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.",
                "sourceLabels": [
                  "Esophageal emergencies: WSES guidelines"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.operative",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.",
                "clinicalRationale": "An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.",
                "sourceLabels": [
                  "Esophageal emergencies: WSES guidelines"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The wall opening was recognized during dilation and its small fresh margins approximate. These findings support primary endoscopic clip closure. Covered stenting remains an option for larger or incompletely closed defects; surgical source control addresses injuries unsuitable for endoscopic/nonoperative care. This decision does not authorize ASC discharge.",
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
            "capability.endoscopy",
            "capability.periop_recovery",
            "capability.endoscopic_closure",
            "capability.endoscopic_rescue"
          ]
        }
      }
    ]
  },
  "intraop-batch10-suspicious-polyps-retrieval-and-tattoo": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
        "displayName": "Changed surface findings before resection",
        "learningObjective": "Interpret a focal nonstructural pit pattern despite a peripheral superficial adenoma biopsy and select the next tissue-management route.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
        "displayName": "Colonoscopy",
        "patientDisplayName": "Nora Bennett",
        "patientPresentationVariantId": "presentation.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Colonoscopy",
        "presentation": "{patientName}, a 63-year-old woman, is undergoing colonoscopy in the clinic's endoscopy room to reassess a 24-mm nonpedunculated descending-colon lesion sampled at an outside examination.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Colonoscopy",
            "presentation": "{patientName}, a 63-year-old woman, is undergoing colonoscopy in the clinic's endoscopy room to reassess a 24-mm nonpedunculated descending-colon lesion sampled at an outside examination."
          }
        ],
        "releasePointId": "release.l2.endoscopy",
        "earliestFacilityStage": 2,
        "tutorialEligible": false,
        "routineEligible": true,
        "requiredClinicalSetting": "endoscopy",
        "requiredCapabilityIds": [
          "capability.endoscopy",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "AMS colonic-polyp guidance (2022)",
          "BSG/ACPGBI large nonpedunculated polyp guideline (2015)",
          "ACPGBI malignant-polyp position statement (2013)"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
            "questionVariantId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
            "primaryConceptId": "concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
            "currentUpdate": "After washing, the endoscopist uses magnifying dye chromoendoscopy to inspect the lesion.",
            "stem": "During {patientName}'s descending-colon colonoscopy, which plan best fits the combined surface and biopsy findings?",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed procedure and pathology observations; written findings, not an endoscopic image",
              "columnHeaders": [
                "Recorded observation"
              ],
              "rowHeaders": [
                "Central depression",
                "Peripheral biopsy"
              ],
              "cells": [
                [
                  "A sharply outlined central patch has no recognizable gland openings; its surface remains amorphous after washing and dye application."
                ],
                [
                  "The outside forceps sample came from the raised outer edge. It contains adenomatous mucosa; submucosa is not represented."
                ]
              ]
            },
            "shuffleAnswers": true,
            "answerChoices": [
              {
                "id": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.sample-surgical.20261112.v1",
                "label": "Targeted sampling and colorectal-surgery evaluation",
                "isCorrect": true,
                "rationale": "The central nonstructural pattern raises deep-invasion concern, which the peripheral mucosal biopsy cannot settle. Sample that focus and seek surgical assessment rather than attempt endoscopic clearance.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1",
                "label": "En-bloc endoscopic resection and specimen assessment",
                "isCorrect": false,
                "rationale": "An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1",
                "label": "Piecemeal endoscopic resection and fragment assessment",
                "isCorrect": false,
                "rationale": "The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.",
                "serviceRequest": null
              }
            ],
            "explanation": "The central pit pattern is concerning for deep invasion; the outside biopsy examined a different, superficial region. Obtain tissue from the concerning focus and arrange surgical evaluation. En-bloc endoscopic treatment addresses selected superficial disease; piecemeal removal would further impair assessment. No histology result or colectomy occurs in this consult.",
            "sourceLabels": [
              "AMS colonic-polyp guidance (2022)",
              "BSG/ACPGBI large nonpedunculated polyp guideline (2015)",
              "ACPGBI malignant-polyp position statement (2013)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the recorded decision and feedback; this consult does not execute a procedure or simulate a clinical outcome.",
                "clinicalRationale": "An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.",
                "sourceLabels": [
                  "AMS colonic-polyp guidance (2022)",
                  "BSG/ACPGBI large nonpedunculated polyp guideline (2015)",
                  "ACPGBI malignant-polyp position statement (2013)"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the recorded decision and feedback; this consult does not execute a procedure or simulate a clinical outcome.",
                "clinicalRationale": "The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.",
                "sourceLabels": [
                  "AMS colonic-polyp guidance (2022)",
                  "BSG/ACPGBI large nonpedunculated polyp guideline (2015)",
                  "ACPGBI malignant-polyp position statement (2013)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The central pit pattern is concerning for deep invasion; the outside biopsy examined a different, superficial region. Obtain tissue from the concerning focus and arrange surgical evaluation. En-bloc endoscopic treatment addresses selected superficial disease; piecemeal removal would further impair assessment. No histology result or colectomy occurs in this consult.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.colonoscopy_polypectomy",
          "kind": "endoscopy",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.endoscopy"
          ],
          "requiredCapabilityIds": [
            "capability.endoscopy",
            "capability.periop_recovery",
            "capability.chromoendoscopy"
          ]
        }
      }
    ]
  },
  "intraop-batch10-anesthetic-intraoperative-crises": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1",
        "displayName": "Use repeated short-lived rescue responses to select sustained titratable circulatory support before second-vasopressor escalation.",
        "learningObjective": "Use repeated short-lived rescue responses to select sustained titratable circulatory support before second-vasopressor escalation.",
        "conceptType": "management",
        "earliestFacilityStage": 3
      }
    ],
    "cases": [
      {
        "id": "case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1",
        "displayName": "ASC procedure: {patientName}",
        "patientPresentationVariantId": "presentation.intraop.i11.anaphylaxis-response-salvage.v1",
        "releasePointId": "release.l3.ambulatory",
        "patientDisplayName": "Monica Hale",
        "prototypeDemographics": {
          "ageYears": 39,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Hernia repair",
        "presentation": "{patientName}, a 39-year-old woman, is in the clinic's ASC OR during paused open inguinal hernia repair after airway and circulatory deterioration following cefazolin at induction. Airway support, crystalloid resuscitation and emergency transfer arrangements continue.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.i11.anaphylaxis-response-salvage.v1",
            "prototypeDemographics": {
              "ageYears": 39,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Hernia repair",
            "presentation": "{patientName}, a 39-year-old woman, is in the clinic's ASC OR during paused open inguinal hernia repair after airway and circulatory deterioration following cefazolin at induction. Airway support, crystalloid resuscitation and emergency transfer arrangements continue."
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
          "Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists",
          "Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
            "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
            "primaryConceptId": "concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1",
            "currentUpdate": "The anesthetist has given titrated IV epinephrine boluses and crystalloid. Each bolus briefly restores blood pressure and pulse volume; both fall again between boluses. Wheezing eases. A pulse remains present, and monitored airway support continues.",
            "stem": "During {patientName}'s paused hernia repair, which ongoing IV vasoactive plan best fits the response at this reassessment while fluid resuscitation and emergency transfer arrangements continue?",
            "answerChoices": [
              {
                "id": "choice.intraop.i11.anaphylaxis-infusion.epinephrine-infusion.v1",
                "label": "Use continuous epinephrine",
                "isCorrect": true,
                "rationale": "Repeated transient responses with recurrent poor perfusion support a titrated epinephrine infusion while fluid resuscitation and monitoring continue.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.i11.anaphylaxis-infusion.boluses.v1",
                "label": "Use intermittent epinephrine",
                "isCorrect": false,
                "rationale": "Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.i11.anaphylaxis-infusion.norepinephrine.v1",
                "label": "Use norepinephrine infusion",
                "isCorrect": false,
                "rationale": "A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The response recurs but does not last. Establish a monitored, titrated epinephrine infusion while continuing volume resuscitation. Boluses can bridge preparation; a second vasopressor becomes relevant if shock persists despite the infusion and fluids.",
            "sourceLabels": [
              "Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists",
              "Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.i11.anaphylaxis-infusion.boluses.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or rescue intervention is executed by this consult.",
                "clinicalRationale": "Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.",
                "sourceLabels": [
                  "Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists",
                  "Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.i11.anaphylaxis-infusion.norepinephrine.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or rescue intervention is executed by this consult.",
                "clinicalRationale": "A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.",
                "sourceLabels": [
                  "Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists",
                  "Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The response recurs but does not last. Establish a monitored, titrated epinephrine infusion while continuing volume resuscitation. Boluses can bridge preparation; a second vasopressor becomes relevant if shock persists despite the infusion and fluids.",
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
  "intraop-batch10-endoscopic-upper-gi-hemostasis": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
        "displayName": "A projecting plug",
        "learningObjective": "Interpret recent-bleeding stigmata on an esophageal varix and choose the source-appropriate initial endoscopic modality.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1",
        "displayName": "Bleeding record review",
        "patientPresentationVariantId": "presentation.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1",
        "releasePointId": "release.l2.endoscopy",
        "patientDisplayName": "Marcus Bell",
        "prototypeDemographics": {
          "ageYears": 59,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Bleeding record review",
        "presentation": "{patientName}, a 59-year-old man with cirrhosis, attends clinic to review an outside hospital EGD record from an admission for hematemesis. The displayed checkpoint is from that hospital procedure; his current clinic visit is stable.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1",
            "prototypeDemographics": {
              "ageYears": 59,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Bleeding record review",
            "presentation": "{patientName}, a 59-year-old man with cirrhosis, attends clinic to review an outside hospital EGD record from an admission for hematemesis. The displayed checkpoint is from that hospital procedure; his current clinic visit is stable."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ESGE esophagogastric variceal hemorrhage guideline (2022)",
          "KASL varices guideline (2020)",
          "BSG portal hypertension position statement (2026)"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
            "questionVariantId": "question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
            "primaryConceptId": "concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
            "currentUpdate": "The hospital record shows lavage and source inspection after initial stabilization. Vasoactive and antibacterial treatment are underway.",
            "stem": "At the initial treatment checkpoint in {patientName}'s hospital EGD, which endoscopic modality should be selected for the implicated source?",
            "answerChoices": [
              {
                "id": "choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.band.20261112.v1",
                "label": "Endoscopic band ligation",
                "isCorrect": true,
                "rationale": "The projecting plug on an esophageal column identifies recent variceal hemorrhage. Band ligation is the preferred initial endoscopic treatment for that source.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.sclerosant.20261112.v1",
                "label": "Endoscopic injection sclerotherapy",
                "isCorrect": false,
                "rationale": "Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.glue.20261112.v1",
                "label": "Endoscopic cyanoacrylate injection",
                "isCorrect": false,
                "rationale": "Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The white projection with blood at its base is a recent-hemorrhage plug on an esophageal varix. The dry mucosal split and intact fundal veins are competing findings. Select band ligation for the implicated esophageal source; injection sclerotherapy is a fallback when ligation is not feasible.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed outside endoscopy record; findings available before treatment",
              "columnHeaders": [
                "Recorded appearance"
              ],
              "rowHeaders": [
                "Distal esophagus",
                "Gastroesophageal junction",
                "Fundus"
              ],
              "cells": [
                [
                  "Longitudinal blue submucosal columns. A small white peg projects from one column, with red blood coating its base."
                ],
                [
                  "A short linear mucosal split is dry, with a flat brown mark at its edge."
                ],
                [
                  "Rounded blue submucosal veins have intact surfaces. Old blood pools below them."
                ]
              ]
            },
            "sourceLabels": [
              "ESGE esophagogastric variceal hemorrhage guideline (2022)",
              "KASL varices guideline (2020)",
              "BSG portal hypertension position statement (2026)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.sclerosant.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.",
                "sourceLabels": [
                  "ESGE esophagogastric variceal hemorrhage guideline (2022)",
                  "KASL varices guideline (2020)",
                  "BSG portal hypertension position statement (2026)"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.glue.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.",
                "sourceLabels": [
                  "ESGE esophagogastric variceal hemorrhage guideline (2022)",
                  "KASL varices guideline (2020)",
                  "BSG portal hypertension position statement (2026)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The white projection with blood at its base is a recent-hemorrhage plug on an esophageal varix. The dry mucosal split and intact fundal veins are competing findings. Select band ligation for the implicated esophageal source; injection sclerotherapy is a fallback when ligation is not feasible.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "chart_review",
          "familyId": "procedure.egd",
          "recordKind": "endoscopy_report",
          "recordCheckpoint": "Initial source-directed endoscopic treatment"
        }
      }
    ]
  },
  "intraop-batch10-pediatric-anesthesia-events": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
        "displayName": "Escalate treatment for persistent pediatric functional upper-airway closure after initial oxygenation measures and deeper anesthesia.",
        "learningObjective": "Escalate treatment for persistent pediatric functional upper-airway closure after initial oxygenation measures and deeper anesthesia.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      },
      {
        "id": "concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
        "displayName": "Select initial bronchodilator treatment for a ventilated older child after assessing mechanical airway causes.",
        "learningObjective": "Select initial bronchodilator treatment for a ventilated older child after assessing mechanical airway causes.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Pediatric live EGD: airway closure and lung reassessment",
        "patientPresentationVariantId": "presentation.intraop.pediatric-anesthesia-events.ava7.v1",
        "releasePointId": "release.l4.pediatrics",
        "patientDisplayName": "Ava Bennett",
        "prototypeDemographics": {
          "ageYears": 7,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Upper endoscopy",
        "presentation": "{patientName}, a 7-year-old girl, is in the clinic's ASC endoscopy room, where diagnostic EGD is underway using IV anesthesia and spontaneous breathing through a natural airway. Her mother, Maya Bennett, joined preparation for consent and an explanation {patientName} could understand and is waiting onsite for updates.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.pediatric-anesthesia-events.ava7.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 7,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Upper endoscopy",
            "presentation": "{patientName}, a 7-year-old girl, is in the clinic's ASC endoscopy room, where diagnostic EGD is underway using IV anesthesia and spontaneous breathing through a natural airway. Her mother, Maya Bennett, joined preparation for consent and an explanation {patientName} could understand and is waiting onsite for updates."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "endoscopy",
        "requiredCapabilityIds": [
          "capability.pediatric_examination",
          "capability.endoscopy",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Pedi Crisis: Critical Events Checklists (January 2025)",
          "RCH CICO airway emergency guideline: laryngospasm appendix",
          "Extubation and removal of supraglottic airway devices in pediatric anesthesia",
          "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
            "questionVariantId": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
            "primaryConceptId": "concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
            "currentUpdate": "During scope withdrawal, {patientName} develops noisy inspiratory effort that becomes silent, with opposite chest and abdominal movement and loss of the carbon-dioxide trace. The endoscope is removed and stimulation stops. Repositioning, two-person facemask oxygenation with positive pressure, and IV propofol have not restored air movement. Inspiratory effort persists as oxygen saturation falls; the team continues oxygenation maneuvers.",
            "stem": "Which rescue drug should the anesthesia team administer now for {patientName} during the EGD?",
            "answerChoices": [
              {
                "id": "choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.relax-airway.v1",
                "label": "Administer intravenous succinylcholine",
                "isCorrect": true,
                "rationale": "Persistent functional closure after initial measures calls for neuromuscular relaxation while airway rescue continues.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.deepen-mask.v1",
                "label": "Administer intravenous epinephrine",
                "isCorrect": false,
                "rationale": "Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.bronchodilate-mask.v1",
                "label": "Administer inhaled albuterol",
                "isCorrect": false,
                "rationale": "Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The persistent inspiratory effort without airflow after initial measures supports severe laryngospasm. IV succinylcholine provides neuromuscular relaxation for this emergency; the team must restore ventilation and secure the airway as needed.",
            "sourceLabels": [
              "Pedi Crisis: Critical Events Checklists (January 2025)",
              "RCH CICO airway emergency guideline: laryngospasm appendix",
              "Extubation and removal of supraglottic airway devices in pediatric anesthesia",
              "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.deepen-mask.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.",
                "sourceLabels": [
                  "Pedi Crisis: Critical Events Checklists (January 2025)",
                  "RCH CICO airway emergency guideline: laryngospasm appendix",
                  "Extubation and removal of supraglottic airway devices in pediatric anesthesia",
                  "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.bronchodilate-mask.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.",
                "sourceLabels": [
                  "Pedi Crisis: Critical Events Checklists (January 2025)",
                  "RCH CICO airway emergency guideline: laryngospasm appendix",
                  "Extubation and removal of supraglottic airway devices in pediatric anesthesia",
                  "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The persistent inspiratory effort without airflow after initial measures supports severe laryngospasm. IV succinylcholine provides neuromuscular relaxation for this emergency; the team must restore ventilation and secure the airway as needed.",
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
            "profileId": "profile.intraop.pediatric-anesthesia-events.ava7.v1",
            "childName": "Ava Bennett",
            "childStillId": "level3-roster-v2.023",
            "parentName": "Maya Bennett",
            "parentRelationship": "mother"
          }
        }
      },
      {
        "id": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "Pediatric live hernia repair: expiratory obstruction",
        "patientPresentationVariantId": "presentation.intraop.pediatric-anesthesia-events.noah12.v1",
        "releasePointId": "release.l4.pediatrics",
        "patientDisplayName": "Noah Reed",
        "prototypeDemographics": {
          "ageYears": 12,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Groin hernia repair",
        "presentation": "{patientName}, a 12-year-old boy, is in the clinic's ASC operating room, where open inguinal hernia repair is underway under general anesthesia with a tracheal tube in place. His father, Daniel Reed, joined preparation for consent and an age-appropriate discussion with {patientName} and is waiting onsite for updates.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.pediatric-anesthesia-events.noah12.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 12,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Groin hernia repair",
            "presentation": "{patientName}, a 12-year-old boy, is in the clinic's ASC operating room, where open inguinal hernia repair is underway under general anesthesia with a tracheal tube in place. His father, Daniel Reed, joined preparation for consent and an age-appropriate discussion with {patientName} and is waiting onsite for updates."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.pediatric_examination",
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Pedi Crisis: Critical Events Checklists (January 2025)",
          "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges",
          "Managing an acute asthma exacerbation in children"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
            "questionVariantId": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
            "primaryConceptId": "concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
            "currentUpdate": "{patientName} develops increased airway pressure, prolonged expiration and bilateral expiratory wheezing. The tracheal-tube marking is unchanged, a suction catheter passes freely without retrieving secretions, and chest movement is symmetric. Surgery pauses, oxygen and manual ventilation continue, and anesthesia is deepened. Manual ventilation produces bilateral chest rise; oxygenation and arterial pressure remain near their pre-event levels.",
            "stem": "Which medication is the first priority to relieve {patientName}'s current airflow limitation during inguinal hernia repair?",
            "answerChoices": [
              {
                "id": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.inhaled-albuterol.v1",
                "label": "Administer inhaled albuterol",
                "isCorrect": true,
                "rationale": "Effective airflow through a checked airway permits initial inhaled beta-agonist rescue for the current bronchoconstriction.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-epinephrine.v1",
                "label": "Administer intravenous epinephrine",
                "isCorrect": false,
                "rationale": "Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-magnesium.v1",
                "label": "Administer intravenous magnesium",
                "isCorrect": false,
                "rationale": "Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-dexamethasone.v1",
                "label": "Administer inhaled ipratropium",
                "isCorrect": false,
                "rationale": "Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Prioritize inhaled albuterol for the current bronchoconstriction after the mechanical airway check. Ipratropium is an adjunct rather than a replacement first bronchodilator. Systemic escalation depends on severity, response and effective delivery; it does not invariably require circulatory collapse.",
            "sourceLabels": [
              "Pedi Crisis: Critical Events Checklists (January 2025)",
              "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges",
              "Managing an acute asthma exacerbation in children"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-epinephrine.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.",
                "sourceLabels": [
                  "Pedi Crisis: Critical Events Checklists (January 2025)",
                  "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges",
                  "Managing an acute asthma exacerbation in children"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-magnesium.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.",
                "sourceLabels": [
                  "Pedi Crisis: Critical Events Checklists (January 2025)",
                  "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges",
                  "Managing an acute asthma exacerbation in children"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-dexamethasone.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.",
                "sourceLabels": [
                  "Pedi Crisis: Critical Events Checklists (January 2025)",
                  "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges",
                  "Managing an acute asthma exacerbation in children"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Prioritize inhaled albuterol for the current bronchoconstriction after the mechanical airway check. Ipratropium is an adjunct rather than a replacement first bronchodilator. Systemic escalation depends on severity, response and effective delivery; it does not invariably require circulatory collapse.",
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
            "capability.pediatric_examination",
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery"
          ],
          "pediatricFamilyContext": {
            "profileId": "profile.intraop.pediatric-anesthesia-events.noah12.v1",
            "childName": "Noah Reed",
            "childStillId": "level3-roster-v2.028",
            "parentName": "Daniel Reed",
            "parentRelationship": "father"
          }
        }
      }
    ]
  },
  "intraop-batch10-pediatric-orchiopexy-findings": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1",
        "displayName": "residual cord bands",
        "learningObjective": "Localize residual length restriction in the exposed vascular attachments and choose a specific vessel-preserving mobilization maneuver.",
        "earliestFacilityStage": 4,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "displayName": "{patientName}: testis operation checkpoints",
        "patientPresentationVariantId": "presentation.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
        "releasePointId": "release.l4.pediatrics",
        "patientDisplayName": "Evan Brooks",
        "prototypeDemographics": {
          "ageYears": 8,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Testis surgery",
        "presentation": "{patientName}, an 8-year-old boy, is undergoing right orchiopexy in the clinic's ambulatory OR after inguinal exploration located the testis. His mother, Maya Brooks, participated in preparation and consent with {patientName} and is waiting onsite for updates.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
            "pediatricProfile": {
              "version": "pediatric-patient-profile.v1",
              "requiresParent": true,
              "clinicalScope": "outpatient"
            },
            "prototypeDemographics": {
              "ageYears": 8,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Testis surgery",
            "presentation": "{patientName}, an 8-year-old boy, is undergoing right orchiopexy in the clinic's ambulatory OR after inguinal exploration located the testis. His mother, Maya Brooks, participated in preparation and consent with {patientName} and is waiting onsite for updates."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 4,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.pediatric_examination",
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585",
          "Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045",
          "Frontiers in Pediatrics 10:906739 (2022); doi:10.3389/fped.2022.906739"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
            "questionVariantId": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
            "primaryConceptId": "concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1",
            "currentUpdate": "The right testis is exposed through an inguinal incision, with the laparoscope still viewing its proximal pedicle. The sac is separated and ligated. Under gentle traction the testis enters the upper scrotal pouch, then returns to the canal when released. Laparoscopically, the vessels pull the posterior peritoneum into a tent; the vas moves freely, and the cord follows a straight course through the deep ring.",
            "stem": "Which specific maneuver should next address {patientName}'s limited descent during right orchiopexy?",
            "showServicePreviews": true,
            "answerChoices": [
              {
                "id": "choice.intraop.pediatric-orchiopexy.residual-cord-bands.mobilize.20261112.v1",
                "label": "Perform blunt retroperitoneal mobilization of the spermatic vessels",
                "isCorrect": true,
                "rationale": "The vessels tent posterior peritoneum while the vas remains mobile. Controlled proximal vascular mobilization addresses that observed attachment with the cord structures identified, rather than dividing an unidentified band or sacrificing the vessels.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.pediatric-orchiopexy.residual-cord-bands.fs.20261112.v1",
                "label": "Divide the spermatic vessels for Fowler-Stephens descent",
                "isCorrect": false,
                "rationale": "The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.pediatric-orchiopexy.residual-cord-bands.fix-high.20261112.v1",
                "label": "Pass the cord medial to the inferior epigastric vessels",
                "isCorrect": false,
                "rationale": "Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The laparoscopic traction response locates the remaining restriction in the peritoneal attachments of the proximal vascular pedicle. With the vas identified and protected, bluntly free the spermatic vessels from those attachments before deciding that the pedicle is intrinsically too short. A medial rerouting procedure addresses an angled descent path; gonadal vessel division addresses a persistent length deficit after suitable vessel-preserving measures.",
            "sourceLabels": [
              "Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585",
              "Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045",
              "Frontiers in Pediatrics 10:906739 (2022); doi:10.3389/fped.2022.906739"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.pediatric-orchiopexy.residual-cord-bands.fs.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this operative checkpoint; no patient outcome or new service is simulated.",
                "clinicalRationale": "The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.",
                "sourceLabels": [
                  "Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585",
                  "Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.pediatric-orchiopexy.residual-cord-bands.fix-high.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this operative checkpoint; no patient outcome or new service is simulated.",
                "clinicalRationale": "Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.",
                "sourceLabels": [
                  "Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585",
                  "Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045",
                  "Frontiers in Pediatrics 10:906739 (2022); doi:10.3389/fped.2022.906739"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The laparoscopic traction response locates the remaining restriction in the peritoneal attachments of the proximal vascular pedicle. With the vas identified and protected, bluntly free the spermatic vessels from those attachments before deciding that the pedicle is intrinsically too short. A medial rerouting procedure addresses an angled descent path; gonadal vessel division addresses a persistent length deficit after suitable vessel-preserving measures.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "familyId": "procedure.orchiopexy",
          "kind": "operation",
          "phase": "procedure",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation",
            "income.ambulatory_operation_extended"
          ],
          "requiredCapabilityIds": [
            "capability.pediatric_examination",
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery"
          ],
          "pediatricFamilyContext": {
            "profileId": "profile.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
            "childName": "Evan Brooks",
            "childStillId": "level3-roster-v2.024",
            "parentName": "Maya Brooks",
            "parentRelationship": "mother"
          }
        }
      }
    ]
  }
};
export const PROGRAM_BATCH10_QUESTIONS:Array<QuestionVariant & Record<string,unknown>> = [
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.asc-access.anterior-port-course.20261112.v1",
    "conceptId": "concept.intraop.asc-access.orthogonal-port-course-correction.v1",
    "stem": "Which catheter maneuver should be selected before completing {patientName}'s port implantation on these views?",
    "shuffleAnswers": true,
    "answerChoices": [
      {
        "id": "choice.intraop.asc-access.anterior-port-course.redirect.20261112.v1",
        "label": "Withdraw the catheter to its branch point and redirect centrally",
        "isCorrect": true,
        "rationale": "The anterior parasternal course identifies a tributary rather than a catheter descending within the SVC. Patent central veins and an intravascular route support withdrawing from the tributary and redirecting under the ongoing imaging.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.asc-access.anterior-port-course.advance.20261112.v1",
        "label": "Advance the catheter along its current course to the intended depth",
        "isCorrect": false,
        "rationale": "Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.",
        "distractorRationale": "Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course."
      },
      {
        "id": "choice.intraop.asc-access.anterior-port-course.replace-access.20261112.v1",
        "label": "Remove the current catheter and establish contralateral jugular access",
        "isCorrect": false,
        "rationale": "A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.",
        "distractorRationale": "A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected."
      }
    ],
    "explanation": "The frontal projection is misleading: the anterior parasternal course fits the internal thoracic venous route rather than the SVC. Intravascular contrast and blood return do not establish a suitable long-term central position. With a patent central confluence, withdraw from the tributary and redirect under imaging before completing the port. This does not prescribe an exact tip-to-carina distance or routine high-right-atrial placement.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.asc-access.port-orthogonal-course",
      "claim.intraop.asc-access.port-tributary",
      "claim.intraop.asc-access.port-reposition",
      "claim.intraop.asc-access.port-aspiration-limit",
      "claim.intraop.asc-access.port-route-constraint"
    ]
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "conceptId": "concept.intraop-biliary.unexplained-bile-imaging.v1",
    "stem": "Which mapping approach should be used for {patientName}'s recurrent bile at this laparoscopic cholecystectomy checkpoint?",
    "answerChoices": [
      {
        "id": "cholangiography",
        "label": "Acquire a transcystic contrast cholangiogram using fluoroscopy",
        "isCorrect": true,
        "rationale": "The accessible opening is below the clip and permits contrast to enter the ductal tree. Recurrent bile outside the unbroken gallbladder calls for assessment of the lumen and any escape of contrast.",
        "distractorRationale": null
      },
      {
        "id": "open-exploration",
        "label": "Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy",
        "isCorrect": false,
        "rationale": "Gallbladder injection is an operative cholangiography route when it communicates with the ducts. At this checkpoint the clip closes that outlet; filling the gallbladder would not provide the intended ductal study.",
        "distractorRationale": "Gallbladder injection is an operative cholangiography route when it communicates with the ducts. At this checkpoint the clip closes that outlet; filling the gallbladder would not provide the intended ductal study."
      },
      {
        "id": "complete-removal",
        "label": "Acquire a fluorescence cholangiogram using near-infrared imaging",
        "isCorrect": false,
        "rationale": "Fluorescence is useful for anatomical orientation, and ICG is already available in the bile. It does not replace the selected contrast study of the ductal lumen and extravasation in this new-bile assessment. The guideline preference is conditional, not a universal prohibition on fluorescence.",
        "distractorRationale": "Fluorescence is useful for anatomical orientation, and ICG is already available in the bile. It does not replace the selected contrast study of the ductal lumen and extravasation in this new-bile assessment. The guideline preference is conditional, not a universal prohibition on fluorescence."
      }
    ],
    "explanation": "Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment.",
    "supportingEvidenceClaimIds": [
      "claim.intraop-biliary.unexplained-bile.v1",
      "claim.intraop-biliary.injury-imaging.v1",
      "claim.intraop-biliary.ioc-access-route.v1",
      "claim.intraop-biliary.ioc-versus-fluorescence.v1"
    ]
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "conceptId": "concept.n2.bile-leak-duct-continuity-boundary",
    "stem": "Which immediate plan should be selected for {patientName} after these findings during laparoscopic cholecystectomy?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed operative injection record",
      "items": [
        {
          "label": "Injection through the cystic-duct opening below the gallbladder-side clip",
          "value": "The duct enters a distal common-duct segment that fills to the duodenum. Contrast leaves the upper end of that segment into the operative field; the hepatic ducts do not fill."
        },
        {
          "label": "Injection through the already exposed upper duct end",
          "value": "Both right and left hepatic ducts fill. The lower duct and duodenum do not fill; contrast returns into the operative field around this opening."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "drain-transfer",
        "label": "Drain the subhepatic space and arrange hepatobiliary-center transfer",
        "isCorrect": true,
        "rationale": "These acquisitions connect the intrahepatic system and papilla to different open ends in the field. With bile control achievable and no local reconstructive expertise, drainage and hepatobiliary-center transfer provide the appropriate immediate bridge to specialist treatment.",
        "distractorRationale": null
      },
      {
        "id": "drain-ercp",
        "label": "Drain the subhepatic space and request transpapillary stenting",
        "isCorrect": false,
        "rationale": "A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.",
        "distractorRationale": "A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question."
      },
      {
        "id": "duct-anastomosis",
        "label": "Drain the subhepatic space and dissect proximally to expose the hepatic confluence",
        "isCorrect": false,
        "rationale": "The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.",
        "distractorRationale": "The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate."
      }
    ],
    "explanation": "The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.",
    "supportingEvidenceClaimIds": [
      "claim.intraop-biliary.major-discontinuity.v1",
      "claim.intraop-biliary.expert-transfer.v1",
      "claim.intraop-biliary.limited-repair.v1",
      "claim.intraop-biliary.staging-conversion.v1",
      "claim.intraop-biliary.papillary-continuity.v1"
    ]
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "conceptId": "concept.intraop-biliary.stone-clearance-route.v1",
    "stem": "Which completion and duct-clearance plan best fits {patientName}'s findings during laparoscopic cholecystectomy?",
    "answerChoices": [
      {
        "id": "postoperative-ercp",
        "label": "Complete cholecystectomy and arrange retrograde transpapillary stone extraction",
        "isCorrect": true,
        "rationale": "Further transcystic passage is limited by the splitting narrow route. Direct common-duct incision carries an unfavorable caliber here. Complete the gallbladder operation with secure cystic closure and arrange endoscopic stone clearance rather than persisting with either operative route.",
        "distractorRationale": null
      },
      {
        "id": "transcystic-dilation",
        "label": "Complete cholecystectomy after further transcystic dilation and stone extraction",
        "isCorrect": false,
        "rationale": "Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.",
        "distractorRationale": "Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct."
      },
      {
        "id": "transductal-exploration",
        "label": "Complete cholecystectomy and arrange stone extraction through a common-duct incision",
        "isCorrect": false,
        "rationale": "A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.",
        "distractorRationale": "A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint."
      }
    ],
    "explanation": "The confirmed stone needs clearance. A splitting cystic duct weighs against further transcystic instrumentation, while the 5-mm common duct weighs against choledochotomy. The SAGES review describes transductal exploration in ducts at least 7 mm wide to limit stricture risk, a selection consideration rather than a biological cliff. With ordinary endoscopic access available, secure the cystic duct, complete cholecystectomy and arrange hospital ERCP. Different duct anatomy or failed endoscopic access could change that ranking.",
    "supportingEvidenceClaimIds": [
      "claim.intraop-biliary.stone-route-options.v1",
      "claim.intraop-biliary.friable-cystic-route.v1",
      "claim.intraop-biliary.narrow-common-duct.v1"
    ]
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "stem": "Which initial strategy is most appropriate for {patientName}'s newly observed sigmoid wall defect during colonoscopy?",
    "answerChoices": [
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.clips",
        "label": "Endoscopic clip closure of the sigmoid defect",
        "isCorrect": true,
        "rationale": "The newly seen small gap, mobile edges, clean lumen and preserved physiology support a prompt endoscopic closure attempt. Hospital monitoring and surgical consultation still follow.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.observe",
        "label": "Inpatient observation of the sigmoid defect",
        "isCorrect": false,
        "rationale": "Monitored nonoperative care fits selected sealed injuries. This accessible gap remains open during the procedure, so leaving it unclosed gives up a feasible opportunity to limit leakage.",
        "distractorRationale": "Monitored nonoperative care fits selected sealed injuries. This accessible gap remains open during the procedure, so leaving it unclosed gives up a feasible opportunity to limit leakage."
      },
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.suture",
        "label": "Laparoscopic suture closure of the sigmoid defect",
        "isCorrect": false,
        "rationale": "Operative closure is important when endoscopic treatment is unsuitable or fails. The small clean defect and mobile margins support an endoscopic attempt before committing to an operation.",
        "distractorRationale": "Operative closure is important when endoscopic treatment is unsuitable or fails. The small clean defect and mobile margins support an endoscopic attempt before committing to an operation."
      }
    ],
    "explanation": "A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.observed-wall-breach",
      "claim.intraop.endoscopic-perforation-and-injury.early-colon-closure",
      "claim.intraop.endoscopic-perforation-and-injury.conservative-colon-selection",
      "claim.intraop.endoscopic-perforation-and-injury.perforation-support",
      "claim.intraop.endoscopic-perforation-and-injury.limit-extraluminal-insufflation",
      "claim.intraop.endoscopic-perforation-and-injury.colonic-surgical-boundary"
    ]
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "stem": "Which immediate plan is most appropriate for {patientName}'s new abdominal and cardiopulmonary changes at the end of colonoscopy?",
    "answerChoices": [
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.catheter",
        "label": "Percutaneous release of intraperitoneal gas followed by hospital transfer",
        "isCorrect": true,
        "rationale": "The rapidly expanding tympanitic abdomen with simultaneous circulatory and ventilatory decline points to pressurized gas outside the bowel. Percutaneous decompression addresses that compartment before departure, while shared resuscitation and hospital escalation continue.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric",
        "label": "Orogastric tube decompression followed by supported hospital transfer",
        "isCorrect": false,
        "rationale": "Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.",
        "distractorRationale": "Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer."
      },
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport",
        "label": "Direct hospital transfer with ongoing airway and circulatory support",
        "isCorrect": false,
        "rationale": "The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.",
        "distractorRationale": "The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern."
      }
    ],
    "explanation": "Gas that escaped before insufflation stopped can remain outside the bowel after clip apposition. Here, abdominal expansion is evolving during the final closure steps and produces a new combined ventilatory and circulatory problem at reassessment. Emergency percutaneous decompression precedes transfer while airway and circulatory support continue. Improvement is temporization and does not establish a durable seal or remove the need for hospital assessment.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.tension-physiology",
      "claim.intraop.endoscopic-perforation-and-injury.tension-rescue",
      "claim.intraop.endoscopic-perforation-and-injury.rescue-is-not-seal",
      "claim.intraop.endoscopic-perforation-and-injury.gas-compartment",
      "claim.intraop.endoscopic-perforation-and-injury.limit-extraluminal-insufflation"
    ]
  },
  {
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "stem": "Which initial closure strategy is most appropriate for {patientName}'s newly observed esophageal defect during dilation?",
    "answerChoices": [
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.clips",
        "label": "Endoscopic clip approximation of the esophageal defect",
        "isCorrect": true,
        "rationale": "The small acute defect has accessible margins that approximate. Primary endoscopic clipping is supported for this anatomy; hospital assessment still addresses leakage and contamination.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.stent",
        "label": "Endoscopic covered stent across the esophageal defect",
        "isCorrect": false,
        "rationale": "Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.",
        "distractorRationale": "Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here."
      },
      {
        "id": "choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.operative",
        "label": "Operative suture closure of the esophageal defect",
        "isCorrect": false,
        "rationale": "An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.",
        "distractorRationale": "An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first."
      }
    ],
    "explanation": "The wall opening was recognized during dilation and its small fresh margins approximate. These findings support primary endoscopic clip closure. Covered stenting remains an option for larger or incompletely closed defects; surgical source control addresses injuries unsuitable for endoscopic/nonoperative care. This decision does not authorize ASC discharge.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-primary-clips",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-stent-boundary",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-operative-boundary",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-support"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "conceptId": "concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "stem": "During {patientName}'s descending-colon colonoscopy, which plan best fits the combined surface and biopsy findings?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed procedure and pathology observations; written findings, not an endoscopic image",
      "columnHeaders": [
        "Recorded observation"
      ],
      "rowHeaders": [
        "Central depression",
        "Peripheral biopsy"
      ],
      "cells": [
        [
          "A sharply outlined central patch has no recognizable gland openings; its surface remains amorphous after washing and dye application."
        ],
        [
          "The outside forceps sample came from the raised outer edge. It contains adenomatous mucosa; submucosa is not represented."
        ]
      ]
    },
    "explanation": "The central pit pattern is concerning for deep invasion; the outside biopsy examined a different, superficial region. Obtain tissue from the concerning focus and arrange surgical evaluation. En-bloc endoscopic treatment addresses selected superficial disease; piecemeal removal would further impair assessment. No histology result or colectomy occurs in this consult.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.suspicious-polyps.amorphous-pit-pattern",
      "claim.intraop.suspicious-polyps.limited-biopsy-scope",
      "claim.intraop.suspicious-polyps.targeted-sampling",
      "claim.intraop.suspicious-polyps.nonpedunculated-surgical-route",
      "claim.intraop.suspicious-polyps.superficial-enbloc-boundary",
      "claim.intraop.suspicious-polyps.benign-piecemeal-boundary"
    ],
    "answerChoices": [
      {
        "id": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.sample-surgical.20261112.v1",
        "label": "Targeted sampling and colorectal-surgery evaluation",
        "isCorrect": true,
        "rationale": "The central nonstructural pattern raises deep-invasion concern, which the peripheral mucosal biopsy cannot settle. Sample that focus and seek surgical assessment rather than attempt endoscopic clearance.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1",
        "label": "En-bloc endoscopic resection and specimen assessment",
        "isCorrect": false,
        "rationale": "An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.",
        "distractorRationale": "An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary."
      },
      {
        "id": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1",
        "label": "Piecemeal endoscopic resection and fragment assessment",
        "isCorrect": false,
        "rationale": "The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.",
        "distractorRationale": "The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care."
      }
    ]
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "conceptId": "concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1",
    "stem": "During {patientName}'s paused hernia repair, which ongoing IV vasoactive plan best fits the response at this reassessment while fluid resuscitation and emergency transfer arrangements continue?",
    "explanation": "The response recurs but does not last. Establish a monitored, titrated epinephrine infusion while continuing volume resuscitation. Boluses can bridge preparation; a second vasopressor becomes relevant if shock persists despite the infusion and fluids.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.i11.epi-fluid",
      "claim.intraop.i11.epi-infusion",
      "claim.intraop.i11.second-vasopressor"
    ],
    "answerChoices": [
      {
        "id": "choice.intraop.i11.anaphylaxis-infusion.epinephrine-infusion.v1",
        "label": "Use continuous epinephrine",
        "isCorrect": true,
        "rationale": "Repeated transient responses with recurrent poor perfusion support a titrated epinephrine infusion while fluid resuscitation and monitoring continue.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.i11.anaphylaxis-infusion.boluses.v1",
        "label": "Use intermittent epinephrine",
        "isCorrect": false,
        "rationale": "Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.",
        "distractorRationale": "Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy."
      },
      {
        "id": "choice.intraop.i11.anaphylaxis-infusion.norepinephrine.v1",
        "label": "Use norepinephrine infusion",
        "isCorrect": false,
        "rationale": "A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.",
        "distractorRationale": "A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "conceptId": "concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "stem": "At the initial treatment checkpoint in {patientName}'s hospital EGD, which endoscopic modality should be selected for the implicated source?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed outside endoscopy record; findings available before treatment",
      "columnHeaders": [
        "Recorded appearance"
      ],
      "rowHeaders": [
        "Distal esophagus",
        "Gastroesophageal junction",
        "Fundus"
      ],
      "cells": [
        [
          "Longitudinal blue submucosal columns. A small white peg projects from one column, with red blood coating its base."
        ],
        [
          "A short linear mucosal split is dry, with a flat brown mark at its edge."
        ],
        [
          "Rounded blue submucosal veins have intact surfaces. Old blood pools below them."
        ]
      ]
    },
    "explanation": "The white projection with blood at its base is a recent-hemorrhage plug on an esophageal varix. The dry mucosal split and intact fundal veins are competing findings. Select band ligation for the implicated esophageal source; injection sclerotherapy is a fallback when ligation is not feasible.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.variceal-plug-source",
      "claim.intraop.upper-gi-hemostasis.esophageal-band-treatment",
      "claim.intraop.upper-gi-hemostasis.fundal-treatment-boundary",
      "claim.intraop.upper-gi-hemostasis.hospital-background"
    ],
    "answerChoices": [
      {
        "id": "choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.band.20261112.v1",
        "label": "Endoscopic band ligation",
        "isCorrect": true,
        "rationale": "The projecting plug on an esophageal column identifies recent variceal hemorrhage. Band ligation is the preferred initial endoscopic treatment for that source.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.sclerosant.20261112.v1",
        "label": "Endoscopic injection sclerotherapy",
        "isCorrect": false,
        "rationale": "Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.",
        "distractorRationale": "Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported."
      },
      {
        "id": "choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.glue.20261112.v1",
        "label": "Endoscopic cyanoacrylate injection",
        "isCorrect": false,
        "rationale": "Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.",
        "distractorRationale": "Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "conceptId": "concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "stem": "Which rescue drug should the anesthesia team administer now for {patientName} during the EGD?",
    "shuffleAnswers": true,
    "explanation": "The persistent inspiratory effort without airflow after initial measures supports severe laryngospasm. IV succinylcholine provides neuromuscular relaxation for this emergency; the team must restore ventilation and secure the airway as needed.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.laryngeal-pattern.v1",
      "claim.intraop.pediatric-anesthesia-events.airway-stimulation.v1",
      "claim.intraop.pediatric-anesthesia-events.initial-laryngospasm.v1",
      "claim.intraop.pediatric-anesthesia-events.laryngospasm-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1"
    ],
    "answerChoices": [
      {
        "id": "choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.relax-airway.v1",
        "label": "Administer intravenous succinylcholine",
        "isCorrect": true,
        "rationale": "Persistent functional closure after initial measures calls for neuromuscular relaxation while airway rescue continues.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.deepen-mask.v1",
        "label": "Administer intravenous epinephrine",
        "isCorrect": false,
        "rationale": "Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.",
        "distractorRationale": "Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here."
      },
      {
        "id": "choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.bronchodilate-mask.v1",
        "label": "Administer inhaled albuterol",
        "isCorrect": false,
        "rationale": "Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.",
        "distractorRationale": "Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "conceptId": "concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "stem": "Which medication is the first priority to relieve {patientName}'s current airflow limitation during inguinal hernia repair?",
    "shuffleAnswers": true,
    "explanation": "Prioritize inhaled albuterol for the current bronchoconstriction after the mechanical airway check. Ipratropium is an adjunct rather than a replacement first bronchodilator. Systemic escalation depends on severity, response and effective delivery; it does not invariably require circulatory collapse.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.bronchospasm-pattern.v1",
      "claim.intraop.pediatric-anesthesia-events.mechanical-check.v1",
      "claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1",
      "claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.magnesium-role.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.ipratropium-adjunct.v1"
    ],
    "answerChoices": [
      {
        "id": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.inhaled-albuterol.v1",
        "label": "Administer inhaled albuterol",
        "isCorrect": true,
        "rationale": "Effective airflow through a checked airway permits initial inhaled beta-agonist rescue for the current bronchoconstriction.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-epinephrine.v1",
        "label": "Administer intravenous epinephrine",
        "isCorrect": false,
        "rationale": "Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.",
        "distractorRationale": "Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion."
      },
      {
        "id": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-magnesium.v1",
        "label": "Administer intravenous magnesium",
        "isCorrect": false,
        "rationale": "Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.",
        "distractorRationale": "Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here."
      },
      {
        "id": "choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-dexamethasone.v1",
        "label": "Administer inhaled ipratropium",
        "isCorrect": false,
        "rationale": "Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.",
        "distractorRationale": "Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint."
      }
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "conceptId": "concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1",
    "stem": "Which specific maneuver should next address {patientName}'s limited descent during right orchiopexy?",
    "answerChoices": [
      {
        "id": "choice.intraop.pediatric-orchiopexy.residual-cord-bands.mobilize.20261112.v1",
        "label": "Perform blunt retroperitoneal mobilization of the spermatic vessels",
        "isCorrect": true,
        "rationale": "The vessels tent posterior peritoneum while the vas remains mobile. Controlled proximal vascular mobilization addresses that observed attachment with the cord structures identified, rather than dividing an unidentified band or sacrificing the vessels.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.pediatric-orchiopexy.residual-cord-bands.fs.20261112.v1",
        "label": "Divide the spermatic vessels for Fowler-Stephens descent",
        "isCorrect": false,
        "rationale": "The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.",
        "distractorRationale": "The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division."
      },
      {
        "id": "choice.intraop.pediatric-orchiopexy.residual-cord-bands.fix-high.20261112.v1",
        "label": "Pass the cord medial to the inferior epigastric vessels",
        "isCorrect": false,
        "rationale": "Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.",
        "distractorRationale": "Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction."
      }
    ],
    "explanation": "The laparoscopic traction response locates the remaining restriction in the peritoneal attachments of the proximal vascular pedicle. With the vas identified and protected, bluntly free the spermatic vessels from those attachments before deciding that the pedicle is intrinsically too short. A medial rerouting procedure addresses an angled descent path; gonadal vessel division addresses a persistent length deficit after suitable vessel-preserving measures.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.pediatric-orchiopexy.length-mobilization",
      "claim.intraop.pediatric-orchiopexy.fs-length-boundary",
      "claim.intraop.pediatric-orchiopexy.vascular-protection",
      "claim.intraop.pediatric-orchiopexy.r1.medial-descent-route"
    ]
  }
];
export const PROGRAM_BATCH10_AUTHORED_CONCEPTS = [
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.asc-access.orthogonal-port-course-correction.v1",
    "displayName": "anterior port course",
    "learningObjective": "Use orthogonal completion views to recognize tributary malposition and preserve a usable central access route during correction.",
    "educationalTier": 1,
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "previousConceptId": null,
    "identityReason": "New live access or specimen-provenance construct. None changes the existing MRI, planned sarcoma biopsy, melanoma staging/margin or accepted deep-mass stopping meaning; all historical definitions and FSRS identities remain intact.",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.port-orthogonal-course",
      "claim.intraop.asc-access.port-tributary",
      "claim.intraop.asc-access.port-reposition",
      "claim.intraop.asc-access.port-aspiration-limit",
      "claim.intraop.asc-access.port-route-constraint"
    ]
  },
  {
    "id": "concept.intraop-biliary.unexplained-bile-imaging.v1",
    "displayName": "Recognize an unexplained intraoperative bile source and select ductal mapping before choosing a repair or bailout.",
    "learningObjective": "Recognize an unexplained intraoperative bile source and select ductal mapping before choosing a repair or bailout.",
    "earliestFacilityStage": 3,
    "conceptType": "workup",
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.n4r2.cholangiogram-quality-before-duct-treatment",
    "conceptRelation": "new_meaning",
    "educationalTier": 2,
    "evidenceClaimIds": [
      "claim.intraop-biliary.unexplained-bile.v1",
      "claim.intraop-biliary.injury-imaging.v1",
      "claim.intraop-biliary.ioc-access-route.v1",
      "claim.intraop-biliary.ioc-versus-fluorescence.v1"
    ]
  },
  {
    "id": "concept.n2.bile-leak-duct-continuity-boundary",
    "displayName": "Duct continuity before a minor-leak stent pathway",
    "learningObjective": "Recognize when demonstrated bile-duct discontinuity prevents applying the preserved-continuity minor-leak ERCP pathway without HPB reassessment.",
    "earliestFacilityStage": 4,
    "conceptType": "management",
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "conceptRelation": "existing_meaning_variant",
    "educationalTier": 2,
    "evidenceClaimIds": [
      "claim.intraop-biliary.major-discontinuity.v1",
      "claim.intraop-biliary.expert-transfer.v1",
      "claim.intraop-biliary.limited-repair.v1",
      "claim.intraop-biliary.staging-conversion.v1",
      "claim.intraop-biliary.papillary-continuity.v1"
    ]
  },
  {
    "id": "concept.intraop-biliary.stone-clearance-route.v1",
    "displayName": "Use cystic-duct condition and common-duct caliber to choose a CBD-stone clearance route after attempted transcystic clearance.",
    "learningObjective": "Use cystic-duct condition and common-duct caliber to choose a CBD-stone clearance route after attempted transcystic clearance.",
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.choledocholithiasis.confirmed-stone-therapy",
    "conceptRelation": "new_meaning",
    "educationalTier": 2,
    "evidenceClaimIds": [
      "claim.intraop-biliary.stone-route-options.v1",
      "claim.intraop-biliary.friable-cystic-route.v1",
      "claim.intraop-biliary.narrow-common-duct.v1"
    ]
  },
  {
    "id": "concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "displayName": "Fresh sigmoid defect: immediate local strategy",
    "learningObjective": "Interpret a freshly observed small clean colonic wall defect and choose immediate closure rather than unsealed observation or routine operative repair.",
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
      "claim.intraop.endoscopic-perforation-and-injury.observed-wall-breach",
      "claim.intraop.endoscopic-perforation-and-injury.early-colon-closure",
      "claim.intraop.endoscopic-perforation-and-injury.conservative-colon-selection",
      "claim.intraop.endoscopic-perforation-and-injury.perforation-support",
      "claim.intraop.endoscopic-perforation-and-injury.limit-extraluminal-insufflation",
      "claim.intraop.endoscopic-perforation-and-injury.colonic-surgical-boundary"
    ],
    "historyMigration": "None; preserve existing concept definitions, cards, saves and frozen encounters."
  },
  {
    "id": "concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "displayName": "New cardiopulmonary compromise during closure",
    "learningObjective": "Recognize acute abdominal pressure physiology after bowel injury and prioritize percutaneous rescue before transport.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "identityDecision": "reuse_same_meaning",
    "identityReason": "All clinical and choice IDs remain stable. This is a wording/chronology and option-sequencing repair of the same pressure-rescue decision; no FSRS meaning changes.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.endoscopic-perforation-and-injury.tension-physiology",
      "claim.intraop.endoscopic-perforation-and-injury.tension-rescue",
      "claim.intraop.endoscopic-perforation-and-injury.rescue-is-not-seal",
      "claim.intraop.endoscopic-perforation-and-injury.gas-compartment",
      "claim.intraop.endoscopic-perforation-and-injury.limit-extraluminal-insufflation"
    ],
    "historyMigration": "None; preserve existing concept definitions, cards, saves and frozen encounters."
  },
  {
    "id": "concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "displayName": "Dilation injury: closure strategy",
    "learningObjective": "Use observed apposable tissue in a small acute dilation-related esophageal defect to choose primary closure rather than coverage or an operation.",
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
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-primary-clips",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-stent-boundary",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-operative-boundary",
      "claim.intraop.endoscopic-perforation-and-injury.esophageal-support"
    ],
    "historyMigration": "None; preserve existing concept definitions, cards, saves and frozen encounters."
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "displayName": "Changed surface findings before resection",
    "learningObjective": "Interpret a focal nonstructural pit pattern despite a peripheral superficial adenoma biopsy and select the next tissue-management route.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "conceptRelation": "new_identity",
    "previousConceptId": null,
    "identityReason": "New procedure-time optical/sampling, retrieval or marking construct. Stalk preparation is unscored context. Existing final-pathology risk and scarred-lesion referral concepts retain their identities and FSRS history.",
    "evidenceClaimIds": [
      "claim.intraop.suspicious-polyps.amorphous-pit-pattern",
      "claim.intraop.suspicious-polyps.limited-biopsy-scope",
      "claim.intraop.suspicious-polyps.targeted-sampling",
      "claim.intraop.suspicious-polyps.nonpedunculated-surgical-route",
      "claim.intraop.suspicious-polyps.superficial-enbloc-boundary",
      "claim.intraop.suspicious-polyps.benign-piecemeal-boundary"
    ],
    "historyMigration": "None; additive authoring only."
  },
  {
    "contentVersion": "question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1",
    "displayName": "Use repeated short-lived rescue responses to select sustained titratable circulatory support before second-vasopressor escalation.",
    "learningObjective": "Use repeated short-lived rescue responses to select sustained titratable circulatory support before second-vasopressor escalation.",
    "conceptType": "management",
    "earliestFacilityStage": 3,
    "previousConceptId": null,
    "conceptMeaning": "new_meaning",
    "conceptVersionReason": "New consequential decision absent from assigned live/retained coverage. Distinct FSRS identity; no transfer from recognition or preoperative planning.",
    "evidenceClaimIds": [
      "claim.intraop.i11.epi-fluid",
      "claim.intraop.i11.epi-infusion",
      "claim.intraop.i11.second-vasopressor"
    ],
    "historyMigration": "None; preserve all historical definitions and FSRS identities."
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "displayName": "A projecting plug",
    "learningObjective": "Interpret recent-bleeding stigmata on an esophageal varix and choose the source-appropriate initial endoscopic modality.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "educationalTier": 1,
    "previousConceptId": null,
    "conceptRelation": "new_identity",
    "identityReason": "New lesion-specific tear boundary or esophageal source/rescue decision; no accepted ulcer-modality or inpatient-medication construct is relabeled.",
    "evidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.variceal-plug-source",
      "claim.intraop.upper-gi-hemostasis.esophageal-band-treatment",
      "claim.intraop.upper-gi-hemostasis.fundal-treatment-boundary",
      "claim.intraop.upper-gi-hemostasis.hospital-background"
    ],
    "historyMigration": "None; all existing concepts, frozen encounters and FSRS histories remain attached to their original meanings."
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "displayName": "Escalate treatment for persistent pediatric functional upper-airway closure after initial oxygenation measures and deeper anesthesia.",
    "learningObjective": "Escalate treatment for persistent pediatric functional upper-airway closure after initial oxygenation measures and deeper anesthesia.",
    "conceptType": "management",
    "educationalTier": 1,
    "earliestFacilityStage": 4,
    "evidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.laryngeal-pattern.v1",
      "claim.intraop.pediatric-anesthesia-events.airway-stimulation.v1",
      "claim.intraop.pediatric-anesthesia-events.initial-laryngospasm.v1",
      "claim.intraop.pediatric-anesthesia-events.laryngospasm-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1"
    ],
    "previousConceptId": null,
    "identityDisposition": "reuse_unchanged_objective",
    "historyMigration": "None. Same clinical construct and stable ID. Preserve all historical question, choice, timing and frozen-encounter definitions."
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "displayName": "Select initial bronchodilator treatment for a ventilated older child after assessing mechanical airway causes.",
    "learningObjective": "Select initial bronchodilator treatment for a ventilated older child after assessing mechanical airway causes.",
    "conceptType": "management",
    "educationalTier": 1,
    "earliestFacilityStage": 4,
    "evidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.bronchospasm-pattern.v1",
      "claim.intraop.pediatric-anesthesia-events.mechanical-check.v1",
      "claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1",
      "claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.magnesium-role.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.ipratropium-adjunct.v1"
    ],
    "previousConceptId": null,
    "identityDisposition": "reuse_unchanged_objective",
    "historyMigration": "None. Same clinical construct and stable ID. Preserve all historical question, choice, timing and frozen-encounter definitions."
  },
  {
    "id": "concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1",
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "identityDisposition": "same_stable_id_additive_definition_version_per_manager_request",
    "reason": "The operative purpose and stable identity are retained; the .r1 definition makes the previously weak or underspecified boundary consequential. Original objective, definitions and exact tuples remain in revisionRound1.snapshot; manager integration must not silently overwrite frozen encounters or approvals.",
    "learningObjective": "Localize residual length restriction in the exposed vascular attachments and choose a specific vessel-preserving mobilization maneuver.",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-orchiopexy.length-mobilization",
      "claim.intraop.pediatric-orchiopexy.fs-length-boundary",
      "claim.intraop.pediatric-orchiopexy.vascular-protection",
      "claim.intraop.pediatric-orchiopexy.r1.medial-descent-route"
    ],
    "educationalTier": 1,
    "earliestFacilityStage": 4,
    "patientAcuity": "stable",
    "previousContentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1"
  }
];
export const PROGRAM_BATCH10_TIMINGS:AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.intraop.asc-access.port-course.20261112.v1",
    "nodeId": "node.intraop.asc-access.anterior-port-course.20261112.v1",
    "questionVariantId": "question.intraop.asc-access.anterior-port-course.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "cholangiography",
          "choiceLabel": "Acquire a transcystic contrast cholangiogram using fluoroscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "open-exploration",
          "choiceLabel": "Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "complete-removal",
          "choiceLabel": "Acquire a fluorescence cholangiogram using near-infrared imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "drain-transfer",
          "choiceLabel": "Drain the subhepatic space and arrange hepatobiliary-center transfer",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "drain-ercp",
          "choiceLabel": "Drain the subhepatic space and request transpapillary stenting",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.bile_leak_ercp"
          }
        },
        {
          "choiceId": "duct-anastomosis",
          "choiceLabel": "Drain the subhepatic space and dissect proximally to expose the hepatic confluence",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.stone-clearance.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "postoperative-ercp",
          "choiceLabel": "Complete cholecystectomy and arrange retrograde transpapillary stone extraction",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.therapeutic_ercp"
          }
        },
        {
          "choiceId": "transcystic-dilation",
          "choiceLabel": "Complete cholecystectomy after further transcystic dilation and stone extraction",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "transductal-exploration",
          "choiceLabel": "Complete cholecystectomy and arrange stone extraction through a common-duct incision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
    "nodeId": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "questionVariantId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.sample-surgical.20261112.v1",
          "choiceLabel": "Targeted sampling and colorectal-surgery evaluation",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        },
        {
          "choiceId": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1",
          "choiceLabel": "En-bloc endoscopic resection and specimen assessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        },
        {
          "choiceId": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1",
          "choiceLabel": "Piecemeal endoscopic resection and fragment assessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1",
    "nodeId": "node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1",
    "nodeId": "node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "questionVariantId": "question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1",
    "nodeId": "node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "questionVariantId": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1",
    "nodeId": "node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "questionVariantId": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
    "nodeId": "node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "questionVariantId": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  }
];
export const PROGRAM_BATCH10_ORDERS = [
  {
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "choiceId": "cholangiography",
    "choiceLabel": "Acquire a transcystic contrast cholangiogram using fluoroscopy",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "choiceId": "open-exploration",
    "choiceLabel": "Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "choiceId": "complete-removal",
    "choiceLabel": "Acquire a fluorescence cholangiogram using near-infrared imaging",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "choiceId": "drain-ercp",
    "choiceLabel": "Drain the subhepatic space and request transpapillary stenting",
    "timingProfileId": "timing.test.bile_leak_ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "choiceId": "duct-anastomosis",
    "choiceLabel": "Drain the subhepatic space and dissect proximally to expose the hepatic confluence",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.stone-clearance.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "choiceId": "postoperative-ercp",
    "choiceLabel": "Complete cholecystectomy and arrange retrograde transpapillary stone extraction",
    "timingProfileId": "timing.test.therapeutic_ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.stone-clearance.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "choiceId": "transcystic-dilation",
    "choiceLabel": "Complete cholecystectomy after further transcystic dilation and stone extraction",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.biliary-safety.stone-clearance.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "choiceId": "transductal-exploration",
    "choiceLabel": "Complete cholecystectomy and arrange stone extraction through a common-duct incision",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
    "nodeId": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "questionVariantId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "choiceId": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.sample-surgical.20261112.v1",
    "choiceLabel": "Targeted sampling and colorectal-surgery evaluation",
    "timingProfileId": "timing.test.pathology_review",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
    "nodeId": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "questionVariantId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "choiceId": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1",
    "choiceLabel": "En-bloc endoscopic resection and specimen assessment",
    "timingProfileId": "timing.test.pathology_review",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
    "nodeId": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "questionVariantId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "choiceId": "choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1",
    "choiceLabel": "Piecemeal endoscopic resection and fragment assessment",
    "timingProfileId": "timing.test.pathology_review",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const PROGRAM_BATCH10_FAMILIES = [
  {
    "id": "family.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1",
    "caseId": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1",
    "profileId": "profile.intraop.pediatric-anesthesia-events.ava7.v1",
    "childName": "Ava Bennett",
    "childStillId": "level3-roster-v2.023",
    "parentName": "Maya Bennett",
    "parentRelationship": "mother",
    "prototypeDemographics": {
      "ageYears": 7,
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
    "id": "family.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1",
    "caseId": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1",
    "profileId": "profile.intraop.pediatric-anesthesia-events.noah12.v1",
    "childName": "Noah Reed",
    "childStillId": "level3-roster-v2.028",
    "parentName": "Daniel Reed",
    "parentRelationship": "father",
    "prototypeDemographics": {
      "ageYears": 12,
      "sexLabel": "Male"
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
    "id": "family.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
    "caseId": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
    "profileId": "profile.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
    "childName": "Evan Brooks",
    "childStillId": "level3-roster-v2.024",
    "parentName": "Maya Brooks",
    "parentRelationship": "mother",
    "prototypeDemographics": {
      "ageYears": 8,
      "sexLabel": "Male"
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
export const PROGRAM_BATCH10_FROZEN = [
  {
    "group": "ENG-I01b",
    "slug": "asc-access-and-soft-tissue-surprises",
    "caseId": "case.intraop.asc-access.port-course.20261112.v1",
    "nodeId": "node.intraop.asc-access.anterior-port-course.20261112.v1",
    "questionVariantId": "question.intraop.asc-access.anterior-port-course.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.asc-access.anterior-port-course.20261112.v1\",\"conceptId\":\"concept.intraop.asc-access.orthogonal-port-course-correction.v1\",\"stem\":\"Which catheter maneuver should be selected before completing Priya's port implantation on these views?\",\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.asc-access.anterior-port-course.redirect.20261112.v1\",\"label\":\"Withdraw the catheter to its branch point and redirect centrally\",\"isCorrect\":true,\"rationale\":\"The anterior parasternal course identifies a tributary rather than a catheter descending within the SVC. Patent central veins and an intravascular route support withdrawing from the tributary and redirecting under the ongoing imaging.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.asc-access.anterior-port-course.advance.20261112.v1\",\"label\":\"Advance the catheter along its current course to the intended depth\",\"isCorrect\":false,\"rationale\":\"Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.\",\"distractorRationale\":\"Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.\"},{\"id\":\"choice.intraop.asc-access.anterior-port-course.replace-access.20261112.v1\",\"label\":\"Remove the current catheter and establish contralateral jugular access\",\"isCorrect\":false,\"rationale\":\"A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.\",\"distractorRationale\":\"A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.\"}],\"explanation\":\"The frontal projection is misleading: the anterior parasternal course fits the internal thoracic venous route rather than the SVC. Intravascular contrast and blood return do not establish a suitable long-term central position. With a patent central confluence, withdraw from the tributary and redirect under imaging before completing the port. This does not prescribe an exact tip-to-carina distance or routine high-right-atrial placement.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.asc-access.port-orthogonal-course\",\"claim.intraop.asc-access.port-tributary\",\"claim.intraop.asc-access.port-reposition\",\"claim.intraop.asc-access.port-aspiration-limit\",\"claim.intraop.asc-access.port-route-constraint\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.asc-access.anterior-port-course.20261112.v1\",\"questionVariantId\":\"question.intraop.asc-access.anterior-port-course.20261112.v1\",\"primaryConceptId\":\"concept.intraop.asc-access.orthogonal-port-course-correction.v1\",\"currentUpdate\":\"After right jugular access, the catheter descends along the right mediastinal border on the frontal view. The lateral view places its lower segment immediately behind the sternum. A gentle hand-injected completion study outlines a narrow descending parasternal vein around that segment; the brachiocephalic vein and SVC fill without a narrowing, and contrast remains intravascular. Blood can be aspirated from the catheter.\",\"stem\":\"Which catheter maneuver should be selected before completing Priya's port implantation on these views?\",\"answerChoices\":[{\"id\":\"choice.intraop.asc-access.anterior-port-course.redirect.20261112.v1\",\"label\":\"Withdraw the catheter to its branch point and redirect centrally\",\"isCorrect\":true,\"rationale\":\"The anterior parasternal course identifies a tributary rather than a catheter descending within the SVC. Patent central veins and an intravascular route support withdrawing from the tributary and redirecting under the ongoing imaging.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.asc-access.anterior-port-course.advance.20261112.v1\",\"label\":\"Advance the catheter along its current course to the intended depth\",\"isCorrect\":false,\"rationale\":\"Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.asc-access.anterior-port-course.replace-access.20261112.v1\",\"label\":\"Remove the current catheter and establish contralateral jugular access\",\"isCorrect\":false,\"rationale\":\"A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"The frontal projection is misleading: the anterior parasternal course fits the internal thoracic venous route rather than the SVC. Intravascular contrast and blood return do not establish a suitable long-term central position. With a patent central confluence, withdraw from the tributary and redirect under imaging before completing the port. This does not prescribe an exact tip-to-carina distance or routine high-right-atrial placement.\",\"sourceLabels\":[\"Insights into Imaging (2019); 10.1186/s13244-019-0770-2\",\"Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727\",\"Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.asc-access.anterior-port-course.advance.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The teaching record contains the selected response; no subsequent patient outcome is simulated.\",\"clinicalRationale\":\"Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.\",\"sourceLabels\":[\"Insights into Imaging (2019); 10.1186/s13244-019-0770-2\",\"Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727\",\"Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015\"]},{\"answerChoiceId\":\"choice.intraop.asc-access.anterior-port-course.replace-access.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The teaching record contains the selected response; no subsequent patient outcome is simulated.\",\"clinicalRationale\":\"A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.\",\"sourceLabels\":[\"Insights into Imaging (2019); 10.1186/s13244-019-0770-2\",\"Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727\",\"Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.asc-access.port-course.20261112.v1\",\"displayName\":\"Priya Shah: operative checkpoint\",\"patientPresentationVariantId\":\"presentation.intraop.asc-access.port-course.20261112.v1\",\"patientDisplayName\":\"Priya Shah\",\"releasePointId\":\"release.l3.ambulatory\",\"prototypeDemographics\":{\"ageYears\":47,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Port placement\",\"presentation\":\"Priya Shah, a 47-year-old woman, is undergoing venous port implantation in the clinic's ASC operating room. The procedure is underway at completion imaging before the implant is accepted for use.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.asc-access.port-course.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":47,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Port placement\",\"presentation\":\"Priya Shah, a 47-year-old woman, is undergoing venous port implantation in the clinic's ASC operating room. The procedure is underway at completion imaging before the implant is accepted for use.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Insights into Imaging (2019); 10.1186/s13244-019-0770-2\",\"Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727\",\"Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015\"],\"decisionNodes\":[{\"id\":\"node.intraop.asc-access.anterior-port-course.20261112.v1\",\"questionVariantId\":\"question.intraop.asc-access.anterior-port-course.20261112.v1\",\"primaryConceptId\":\"concept.intraop.asc-access.orthogonal-port-course-correction.v1\",\"currentUpdate\":\"After right jugular access, the catheter descends along the right mediastinal border on the frontal view. The lateral view places its lower segment immediately behind the sternum. A gentle hand-injected completion study outlines a narrow descending parasternal vein around that segment; the brachiocephalic vein and SVC fill without a narrowing, and contrast remains intravascular. Blood can be aspirated from the catheter.\",\"stem\":\"Which catheter maneuver should be selected before completing Priya's port implantation on these views?\",\"answerChoices\":[{\"id\":\"choice.intraop.asc-access.anterior-port-course.redirect.20261112.v1\",\"label\":\"Withdraw the catheter to its branch point and redirect centrally\",\"isCorrect\":true,\"rationale\":\"The anterior parasternal course identifies a tributary rather than a catheter descending within the SVC. Patent central veins and an intravascular route support withdrawing from the tributary and redirecting under the ongoing imaging.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.asc-access.anterior-port-course.advance.20261112.v1\",\"label\":\"Advance the catheter along its current course to the intended depth\",\"isCorrect\":false,\"rationale\":\"Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.asc-access.anterior-port-course.replace-access.20261112.v1\",\"label\":\"Remove the current catheter and establish contralateral jugular access\",\"isCorrect\":false,\"rationale\":\"A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"showServicePreviews\":true,\"explanation\":\"The frontal projection is misleading: the anterior parasternal course fits the internal thoracic venous route rather than the SVC. Intravascular contrast and blood return do not establish a suitable long-term central position. With a patent central confluence, withdraw from the tributary and redirect under imaging before completing the port. This does not prescribe an exact tip-to-carina distance or routine high-right-atrial placement.\",\"sourceLabels\":[\"Insights into Imaging (2019); 10.1186/s13244-019-0770-2\",\"Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727\",\"Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.asc-access.anterior-port-course.advance.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The teaching record contains the selected response; no subsequent patient outcome is simulated.\",\"clinicalRationale\":\"Advancing changes length within the same anterior tributary; it does not turn that route into the patent SVC. Successful aspiration confirms access to blood, not the intended central course.\",\"sourceLabels\":[\"Insights into Imaging (2019); 10.1186/s13244-019-0770-2\",\"Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727\",\"Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015\"]},{\"answerChoiceId\":\"choice.intraop.asc-access.anterior-port-course.replace-access.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The teaching record contains the selected response; no subsequent patient outcome is simulated.\",\"clinicalRationale\":\"A new puncture may be needed when the central route is obstructed or cannot be corrected. The present study demonstrates a patent central confluence, so the available route can first be redirected.\",\"sourceLabels\":[\"Insights into Imaging (2019); 10.1186/s13244-019-0770-2\",\"Anaesthesia / Association of Anaesthetists (2025); 10.1111/anae.16727\",\"Interventional Radiology / Japanese Society of Interventional Radiology (2023); 10.22575/interventionalradiology.2022-0015\"]}]}],\"learningSummary\":\"The frontal projection is misleading: the anterior parasternal course fits the internal thoracic venous route rather than the SVC. Intravascular contrast and blood return do not establish a suitable long-term central position. With a patent central confluence, withdraw from the tributary and redirect under imaging before completing the port. This does not prescribe an exact tip-to-carina distance or routine high-right-atrial placement.\"}",
    "sourceQuestionSha256": "373e914f547f32b19db680fcf848598152b103cf62f3c8eb7e0f9c2f99871d76",
    "sourceNodeSha256": "7218e8a37ee7558a2cde705362e74de20ade292bef8e304d01fb8e02672547e9",
    "sourceCaseSha256": "37035bd3387cbc06c11a90a9c2776b993353f3e55246e394da0161db2c3f3333",
    "acceptedQuestionSha256": "dc1f8884898b75d7a23edd600f6d4de4343a0e8689f0ca035335424942cad8ae",
    "acceptedNodeSha256": "0cfbb14fcbaac7105a046e62c703fb4c597e76531109aade07e4d2301a81420b",
    "acceptedCaseSha256": "b1e0618d1e83f15359d55caf4b3295b96ee8acfdd69669ebd9fff06a0bb75053",
    "review": {
      "path": "docs/research/question-intraop-asc-access-and-soft-tissue-surprises-review-20261112.json",
      "record": {
        "id": "question.intraop.asc-access.anterior-port-course.20261112.v1",
        "nodeId": "node.intraop.asc-access.anterior-port-course.20261112.v1",
        "title": "Correct an anterior parasternal port-catheter course",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The described frontal, lateral and contrast findings permit recognition of a tributary course rather than satisfactory central placement. Preserved aspiration and intravascular contrast do not settle suitability for use. The patent central route then supports redirection through the existing access rather than choosing new contralateral access.",
          "The alternatives answer the same immediate catheter-management task. Advancement along the described tributary is not a suitable correction; starting over contralaterally is a possible fallback but is not the best first maneuver when the current central route is patent and no failed redirection is described. Exactly one best answer is defensible among these options.",
          "The two reasoning steps are consequential: interpret the discordant projections, then select a correction that uses the demonstrated patent route. The right-sided frontal course and blood return provide credible reasons to underestimate the malposition. Difficulty is moderate, not hard.",
          "No strong nonmedical wording overlap, length outlier, convergence, absolute or pre-answer diagnosis label identifies the key. The patency finding is necessary decision information rather than gratuitous permission to choose the key.",
          "Port placement with completion fluoroscopy/contrast and appropriate access expertise is plausible in an equipped ASC. The scene shows those imaging resources being used; it does not require live hospital reconstruction. Imaging before acceptance for use is coherent, and this standalone task supplies the named adult and procedural stage.",
          "The high-yield construct is recognizing and correcting central-catheter malposition despite blood return. Memorizing this particular internal thoracic tributary route is more specialized and should not be represented as independently established common exam content.",
          "No definite anatomical or management inaccuracy identified offline. This is an editorial PASS of the displayed decision, not verification of source currency, runtime capability admission or named clinician approval."
        ],
        "suggestions": [
          "Optional presentation improvement: say 'the described views' or supply a labeled, independently constructed two-view schematic. The existing written observations are sufficient to solve the item, but an image would let residents inspect the spatial relationship directly.",
          "Optional precision improvement: make imaging-guided redirection explicit in the choice, consistent with the existing explanation. Do not imply blind advancement or add an unsupported exact tip-depth target.",
          "Any clinical-content revision should retain the patent-route and intravascular findings that distinguish correction from starting a new access, and should receive exact-version review."
        ]
      }
    }
  },
  {
    "group": "ENG-I01b",
    "slug": "biliary-safety-and-duct-decisions",
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.biliary-safety.unexplained-bile.20261112.v1\",\"conceptId\":\"concept.intraop-biliary.unexplained-bile-imaging.v1\",\"stem\":\"Which mapping approach should be used for {patientName}'s recurrent bile at this laparoscopic cholecystectomy checkpoint?\",\"answerChoices\":[{\"id\":\"cholangiography\",\"label\":\"Acquire a transcystic contrast cholangiogram using fluoroscopy\",\"isCorrect\":true,\"rationale\":\"The accessible opening is below the clip and permits contrast to enter the ductal tree. Recurrent bile outside the unbroken gallbladder calls for assessment of the lumen and any escape of contrast.\",\"distractorRationale\":null},{\"id\":\"open-exploration\",\"label\":\"Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy\",\"isCorrect\":false,\"rationale\":\"Gallbladder injection is an operative cholangiography route when it communicates with the ducts. At this checkpoint the clip closes that outlet; filling the gallbladder would not provide the intended ductal study.\",\"distractorRationale\":\"Gallbladder injection is an operative cholangiography route when it communicates with the ducts. At this checkpoint the clip closes that outlet; filling the gallbladder would not provide the intended ductal study.\"},{\"id\":\"complete-removal\",\"label\":\"Acquire a fluorescence cholangiogram using near-infrared imaging\",\"isCorrect\":false,\"rationale\":\"Fluorescence is useful for anatomical orientation, and ICG is already available in the bile. It does not replace the selected contrast study of the ductal lumen and extravasation in this new-bile assessment. The guideline preference is conditional, not a universal prohibition on fluorescence.\",\"distractorRationale\":\"Fluorescence is useful for anatomical orientation, and ICG is already available in the bile. It does not replace the selected contrast study of the ductal lumen and extravasation in this new-bile assessment. The guideline preference is conditional, not a universal prohibition on fluorescence.\"}],\"explanation\":\"Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment.\",\"supportingEvidenceClaimIds\":[\"claim.intraop-biliary.unexplained-bile.v1\",\"claim.intraop-biliary.injury-imaging.v1\",\"claim.intraop-biliary.ioc-access-route.v1\",\"claim.intraop-biliary.ioc-versus-fluorescence.v1\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.biliary-safety.unexplained-bile.20261112.v1\",\"questionVariantId\":\"question.intraop.biliary-safety.unexplained-bile.20261112.v1\",\"primaryConceptId\":\"concept.intraop-biliary.unexplained-bile-imaging.v1\",\"currentUpdate\":\"Irrigation clears the field, but green fluid collects again medial to the gallbladder neck, away from the small duct opening. The gallbladder wall is unbroken. The duct opening is visible, accepts a fine catheter without traction and remains accessible below the gallbladder-side clip.\",\"stem\":\"Which mapping approach should be used for {patientName}'s recurrent bile at this laparoscopic cholecystectomy checkpoint?\",\"answerChoices\":[{\"id\":\"cholangiography\",\"label\":\"Acquire a transcystic contrast cholangiogram using fluoroscopy\",\"isCorrect\":true,\"rationale\":\"The accessible opening is below the clip and permits contrast to enter the ductal tree. Recurrent bile outside the unbroken gallbladder calls for assessment of the lumen and any escape of contrast.\",\"serviceRequest\":null},{\"id\":\"open-exploration\",\"label\":\"Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy\",\"isCorrect\":false,\"rationale\":\"Gallbladder injection is an operative cholangiography route when it communicates with the ducts. At this checkpoint the clip closes that outlet; filling the gallbladder would not provide the intended ductal study.\",\"serviceRequest\":null},{\"id\":\"complete-removal\",\"label\":\"Acquire a fluorescence cholangiogram using near-infrared imaging\",\"isCorrect\":false,\"rationale\":\"Fluorescence is useful for anatomical orientation, and ICG is already available in the bile. It does not replace the selected contrast study of the ductal lumen and extravasation in this new-bile assessment. The guideline preference is conditional, not a universal prohibition on fluorescence.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES guidelines for intraoperative imaging of the common bile duct\",\"Clinical spotlight review: management of choledocholithiasis\"],\"resultGateAfter\":null,\"terminalDispositions\":[]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.biliary-safety.new-bile.20261112.v1\",\"displayName\":\"Bile during gallbladder dissection\",\"patientPresentationVariantId\":\"presentation.intraop.biliary-safety.new-bile.20261112.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Priya Shah\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Gallbladder surgery\",\"presentation\":\"{patientName}, a 49-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The arterial branch entering the gallbladder has been clipped and divided. A clip is across the gallbladder end of the presumed cystic duct; a small opening has been made just below that clip for a catheter. This duct has not been divided across or clipped on its common-duct side. Fluoroscopy and near-infrared imaging are available; ICG was given at induction.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.biliary-safety.new-bile.female.49.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Gallbladder surgery\",\"presentation\":\"{patientName}, a 49-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The arterial branch entering the gallbladder has been clipped and divided. A clip is across the gallbladder end of the presumed cystic duct; a small opening has been made just below that clip for a catheter. This duct has not been divided across or clipped on its common-duct side. Fluoroscopy and near-infrared imaging are available; ICG was given at induction.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":4,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES guidelines for intraoperative imaging of the common bile duct\",\"Clinical spotlight review: management of choledocholithiasis\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"],\"decisionNodes\":[{\"id\":\"node.intraop.biliary-safety.unexplained-bile.20261112.v1\",\"questionVariantId\":\"question.intraop.biliary-safety.unexplained-bile.20261112.v1\",\"primaryConceptId\":\"concept.intraop-biliary.unexplained-bile-imaging.v1\",\"currentUpdate\":\"Irrigation clears the field, but green fluid collects again medial to the gallbladder neck, away from the small duct opening. The gallbladder wall is unbroken. The duct opening is visible, accepts a fine catheter without traction and remains accessible below the gallbladder-side clip.\",\"stem\":\"Which mapping approach should be used for {patientName}'s recurrent bile at this laparoscopic cholecystectomy checkpoint?\",\"answerChoices\":[{\"id\":\"cholangiography\",\"label\":\"Acquire a transcystic contrast cholangiogram using fluoroscopy\",\"isCorrect\":true,\"rationale\":\"The accessible opening is below the clip and permits contrast to enter the ductal tree. Recurrent bile outside the unbroken gallbladder calls for assessment of the lumen and any escape of contrast.\",\"serviceRequest\":null},{\"id\":\"open-exploration\",\"label\":\"Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy\",\"isCorrect\":false,\"rationale\":\"Gallbladder injection is an operative cholangiography route when it communicates with the ducts. At this checkpoint the clip closes that outlet; filling the gallbladder would not provide the intended ductal study.\",\"serviceRequest\":null},{\"id\":\"complete-removal\",\"label\":\"Acquire a fluorescence cholangiogram using near-infrared imaging\",\"isCorrect\":false,\"rationale\":\"Fluorescence is useful for anatomical orientation, and ICG is already available in the bile. It does not replace the selected contrast study of the ductal lumen and extravasation in this new-bile assessment. The guideline preference is conditional, not a universal prohibition on fluorescence.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES guidelines for intraoperative imaging of the common bile duct\",\"Clinical spotlight review: management of choledocholithiasis\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.biliary-safety.major-injury-transfer.20261112.v1\",\"questionVariantId\":\"question.intraop.biliary-safety.major-injury-transfer.20261112.v1\",\"primaryConceptId\":\"concept.n2.bile-leak-duct-continuity-boundary\",\"currentUpdate\":\"At the next checkpoint, the catheter has been removed. Suction and gentle retraction bring two open duct ends into view within the existing dissection field. Circulation remains stable and laparoscopic exposure permits drainage. The operating surgeon does not perform biliary reconstruction. The acquisition record is shown below.\",\"stem\":\"Which immediate plan should be selected for {patientName} after these findings during laparoscopic cholecystectomy?\",\"answerChoices\":[{\"id\":\"drain-transfer\",\"label\":\"Drain the subhepatic space and arrange hepatobiliary-center transfer\",\"isCorrect\":true,\"rationale\":\"These acquisitions connect the intrahepatic system and papilla to different open ends in the field. With bile control achievable and no local reconstructive expertise, drainage and hepatobiliary-center transfer provide the appropriate immediate bridge to specialist treatment.\",\"serviceRequest\":null},{\"id\":\"drain-ercp\",\"label\":\"Drain the subhepatic space and request transpapillary stenting\",\"isCorrect\":false,\"rationale\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"serviceRequest\":null},{\"id\":\"duct-anastomosis\",\"label\":\"Drain the subhepatic space and dissect proximally to expose the hepatic confluence\",\"isCorrect\":false,\"rationale\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative injection record\",\"items\":[{\"label\":\"Injection through the cystic-duct opening below the gallbladder-side clip\",\"value\":\"The duct enters a distal common-duct segment that fills to the duodenum. Contrast leaves the upper end of that segment into the operative field; the hepatic ducts do not fill.\"},{\"label\":\"Injection through the already exposed upper duct end\",\"value\":\"Both right and left hepatic ducts fill. The lower duct and duodenum do not fill; contrast returns into the operative field around this opening.\"}]},\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"drain-ercp\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"clinicalRationale\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"]},{\"answerChoiceId\":\"duct-anastomosis\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"clinicalRationale\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"]}]}],\"learningSummary\":\"Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment. The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.\"}",
    "sourceQuestionSha256": "4177e954d03a4a10d98e4e680117e4aa40eaf6bcfa29ce9e064ec6bc06bcb1ed",
    "sourceNodeSha256": "6f79afd415e085b0658e38955dbbdfdbde8730dbdc96690bb7e4544c60fe23b2",
    "sourceCaseSha256": "88ac2a65a7680cff8159f3ee7d41f6f2a716c811404471633a4a02fb376439b5",
    "acceptedQuestionSha256": "4177e954d03a4a10d98e4e680117e4aa40eaf6bcfa29ce9e064ec6bc06bcb1ed",
    "acceptedNodeSha256": "6f79afd415e085b0658e38955dbbdfdbde8730dbdc96690bb7e4544c60fe23b2",
    "acceptedCaseSha256": "bfefcd7048be4437a0a39726baebe95e2bd128a44b6c48896e5896aa3f2e6ae3",
    "review": {
      "path": "docs/research/question-intraop-biliary-safety-and-duct-decisions-review3-20261112.json",
      "record": {
        "id": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
        "nodeId": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
        "title": "Mapping recurrent bile at the duct-opening checkpoint",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Reviewed the current salvage candidate's presentation, update, task, options and explanation, including the matching finite presentation. The four active nodes are the review population. The 103 kept audit occurrences, archived earlier versions and parked/held records are noted but not scored. Author self-checks, earlier review verdicts and the review-only key position are not evidence for this verdict.",
          "One defensible best answer among the stated approaches: transcystic contrast cholangiography. Recurrent fluid away from the deliberate ductotomy and an unbroken gallbladder create concern for another bile source; the learner must choose an investigation of continuity/extravasation and then account for the clip-relative route. This is moderately demanding procedural application, not a hard item.",
          "The gallbladder-side clip is a real anatomical discriminator, not merely an option-eliminating negative: injection into the gallbladder as currently configured would encounter that closed outlet. Removing the clip would be a different, unstated plan. The accessible duct opening supports the offered route without requiring blind additional dissection.",
          "The fluorescence choice is credible because ICG has already been administered and the equipment is present. The explanation appropriately retains fluorescence as an adjunct rather than claiming that it is universally useless. No confident clinical inaccuracy identified; the exact comparative imaging recommendation was not independently source-verified in this offline review.",
          "Cue attack: the labels have parallel acquisition grammar and comparable specificity. The two contrast options share their modality wording, so component convergence does not uniquely assemble the key. The clip and catheter findings make a route usable, but do not by themselves resolve contrast versus fluorescence. Listing both imaging systems avoids a key-only equipment permission. No unacceptable nonmedical wording shortcut found.",
          "The live ambulatory cholecystectomy checkpoint is plausible with the explicitly supplied imaging resources. The green fluid, intact wall, clip and accessible opening are observable intraoperative findings. No image is promised but missing: the task selects an acquisition, not an interpretation of an unseen cholangiogram. Priya's age/sex and procedural frame are consistent.",
          "Sequence check: choosing the study can naturally precede the next node's acquired injection findings. This explanation discusses the imaging purpose without revealing the later duct pattern, transfer decision or repair. It does not require the later result to solve this node. Bile-duct injury recognition and intraoperative mapping are high-yield general-surgery concepts.",
          "PASS is an editorial judgment on the supplied text, not clinical approval, source verification or certification of live procedure sequencing. The candidate remains needs_clinician_review. No network, Git or runtime testing was used."
        ],
        "suggestions": [
          "Retain the clip position, accessible opening and both imaging alternatives; deleting those facts to reduce apparent cueing would remove legitimate procedural reasoning.",
          "Optional concision: state the opening's position relative to the clip once, preserving that it is accessible without traction. The repeated position is not a blocking cue.",
          "Preserve the transition as an actual acquisition followed by a new decision; do not display the second node's injection findings before this answer."
        ]
      }
    }
  },
  {
    "group": "ENG-I01b",
    "slug": "biliary-safety-and-duct-decisions",
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.biliary-safety.major-injury-transfer.20261112.v1\",\"conceptId\":\"concept.n2.bile-leak-duct-continuity-boundary\",\"stem\":\"Which immediate plan should be selected for {patientName} after these findings during laparoscopic cholecystectomy?\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative injection record\",\"items\":[{\"label\":\"Injection through the cystic-duct opening below the gallbladder-side clip\",\"value\":\"The duct enters a distal common-duct segment that fills to the duodenum. Contrast leaves the upper end of that segment into the operative field; the hepatic ducts do not fill.\"},{\"label\":\"Injection through the already exposed upper duct end\",\"value\":\"Both right and left hepatic ducts fill. The lower duct and duodenum do not fill; contrast returns into the operative field around this opening.\"}]},\"answerChoices\":[{\"id\":\"drain-transfer\",\"label\":\"Drain the subhepatic space and arrange hepatobiliary-center transfer\",\"isCorrect\":true,\"rationale\":\"These acquisitions connect the intrahepatic system and papilla to different open ends in the field. With bile control achievable and no local reconstructive expertise, drainage and hepatobiliary-center transfer provide the appropriate immediate bridge to specialist treatment.\",\"distractorRationale\":null},{\"id\":\"drain-ercp\",\"label\":\"Drain the subhepatic space and request transpapillary stenting\",\"isCorrect\":false,\"rationale\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"distractorRationale\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\"},{\"id\":\"duct-anastomosis\",\"label\":\"Drain the subhepatic space and dissect proximally to expose the hepatic confluence\",\"isCorrect\":false,\"rationale\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"distractorRationale\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\"}],\"explanation\":\"The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.\",\"supportingEvidenceClaimIds\":[\"claim.intraop-biliary.major-discontinuity.v1\",\"claim.intraop-biliary.expert-transfer.v1\",\"claim.intraop-biliary.limited-repair.v1\",\"claim.intraop-biliary.staging-conversion.v1\",\"claim.intraop-biliary.papillary-continuity.v1\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.biliary-safety.major-injury-transfer.20261112.v1\",\"questionVariantId\":\"question.intraop.biliary-safety.major-injury-transfer.20261112.v1\",\"primaryConceptId\":\"concept.n2.bile-leak-duct-continuity-boundary\",\"currentUpdate\":\"At the next checkpoint, the catheter has been removed. Suction and gentle retraction bring two open duct ends into view within the existing dissection field. Circulation remains stable and laparoscopic exposure permits drainage. The operating surgeon does not perform biliary reconstruction. The acquisition record is shown below.\",\"stem\":\"Which immediate plan should be selected for {patientName} after these findings during laparoscopic cholecystectomy?\",\"answerChoices\":[{\"id\":\"drain-transfer\",\"label\":\"Drain the subhepatic space and arrange hepatobiliary-center transfer\",\"isCorrect\":true,\"rationale\":\"These acquisitions connect the intrahepatic system and papilla to different open ends in the field. With bile control achievable and no local reconstructive expertise, drainage and hepatobiliary-center transfer provide the appropriate immediate bridge to specialist treatment.\",\"serviceRequest\":null},{\"id\":\"drain-ercp\",\"label\":\"Drain the subhepatic space and request transpapillary stenting\",\"isCorrect\":false,\"rationale\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"serviceRequest\":null},{\"id\":\"duct-anastomosis\",\"label\":\"Drain the subhepatic space and dissect proximally to expose the hepatic confluence\",\"isCorrect\":false,\"rationale\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative injection record\",\"items\":[{\"label\":\"Injection through the cystic-duct opening below the gallbladder-side clip\",\"value\":\"The duct enters a distal common-duct segment that fills to the duodenum. Contrast leaves the upper end of that segment into the operative field; the hepatic ducts do not fill.\"},{\"label\":\"Injection through the already exposed upper duct end\",\"value\":\"Both right and left hepatic ducts fill. The lower duct and duodenum do not fill; contrast returns into the operative field around this opening.\"}]},\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"drain-ercp\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"clinicalRationale\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"]},{\"answerChoiceId\":\"duct-anastomosis\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"clinicalRationale\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.biliary-safety.new-bile.20261112.v1\",\"displayName\":\"Bile during gallbladder dissection\",\"patientPresentationVariantId\":\"presentation.intraop.biliary-safety.new-bile.20261112.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Priya Shah\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Gallbladder surgery\",\"presentation\":\"{patientName}, a 49-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The arterial branch entering the gallbladder has been clipped and divided. A clip is across the gallbladder end of the presumed cystic duct; a small opening has been made just below that clip for a catheter. This duct has not been divided across or clipped on its common-duct side. Fluoroscopy and near-infrared imaging are available; ICG was given at induction.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.biliary-safety.new-bile.female.49.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Gallbladder surgery\",\"presentation\":\"{patientName}, a 49-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The arterial branch entering the gallbladder has been clipped and divided. A clip is across the gallbladder end of the presumed cystic duct; a small opening has been made just below that clip for a catheter. This duct has not been divided across or clipped on its common-duct side. Fluoroscopy and near-infrared imaging are available; ICG was given at induction.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":4,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES guidelines for intraoperative imaging of the common bile duct\",\"Clinical spotlight review: management of choledocholithiasis\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"],\"decisionNodes\":[{\"id\":\"node.intraop.biliary-safety.unexplained-bile.20261112.v1\",\"questionVariantId\":\"question.intraop.biliary-safety.unexplained-bile.20261112.v1\",\"primaryConceptId\":\"concept.intraop-biliary.unexplained-bile-imaging.v1\",\"currentUpdate\":\"Irrigation clears the field, but green fluid collects again medial to the gallbladder neck, away from the small duct opening. The gallbladder wall is unbroken. The duct opening is visible, accepts a fine catheter without traction and remains accessible below the gallbladder-side clip.\",\"stem\":\"Which mapping approach should be used for {patientName}'s recurrent bile at this laparoscopic cholecystectomy checkpoint?\",\"answerChoices\":[{\"id\":\"cholangiography\",\"label\":\"Acquire a transcystic contrast cholangiogram using fluoroscopy\",\"isCorrect\":true,\"rationale\":\"The accessible opening is below the clip and permits contrast to enter the ductal tree. Recurrent bile outside the unbroken gallbladder calls for assessment of the lumen and any escape of contrast.\",\"serviceRequest\":null},{\"id\":\"open-exploration\",\"label\":\"Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy\",\"isCorrect\":false,\"rationale\":\"Gallbladder injection is an operative cholangiography route when it communicates with the ducts. At this checkpoint the clip closes that outlet; filling the gallbladder would not provide the intended ductal study.\",\"serviceRequest\":null},{\"id\":\"complete-removal\",\"label\":\"Acquire a fluorescence cholangiogram using near-infrared imaging\",\"isCorrect\":false,\"rationale\":\"Fluorescence is useful for anatomical orientation, and ICG is already available in the bile. It does not replace the selected contrast study of the ductal lumen and extravasation in this new-bile assessment. The guideline preference is conditional, not a universal prohibition on fluorescence.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES guidelines for intraoperative imaging of the common bile duct\",\"Clinical spotlight review: management of choledocholithiasis\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.biliary-safety.major-injury-transfer.20261112.v1\",\"questionVariantId\":\"question.intraop.biliary-safety.major-injury-transfer.20261112.v1\",\"primaryConceptId\":\"concept.n2.bile-leak-duct-continuity-boundary\",\"currentUpdate\":\"At the next checkpoint, the catheter has been removed. Suction and gentle retraction bring two open duct ends into view within the existing dissection field. Circulation remains stable and laparoscopic exposure permits drainage. The operating surgeon does not perform biliary reconstruction. The acquisition record is shown below.\",\"stem\":\"Which immediate plan should be selected for {patientName} after these findings during laparoscopic cholecystectomy?\",\"answerChoices\":[{\"id\":\"drain-transfer\",\"label\":\"Drain the subhepatic space and arrange hepatobiliary-center transfer\",\"isCorrect\":true,\"rationale\":\"These acquisitions connect the intrahepatic system and papilla to different open ends in the field. With bile control achievable and no local reconstructive expertise, drainage and hepatobiliary-center transfer provide the appropriate immediate bridge to specialist treatment.\",\"serviceRequest\":null},{\"id\":\"drain-ercp\",\"label\":\"Drain the subhepatic space and request transpapillary stenting\",\"isCorrect\":false,\"rationale\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"serviceRequest\":null},{\"id\":\"duct-anastomosis\",\"label\":\"Drain the subhepatic space and dissect proximally to expose the hepatic confluence\",\"isCorrect\":false,\"rationale\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed operative injection record\",\"items\":[{\"label\":\"Injection through the cystic-duct opening below the gallbladder-side clip\",\"value\":\"The duct enters a distal common-duct segment that fills to the duodenum. Contrast leaves the upper end of that segment into the operative field; the hepatic ducts do not fill.\"},{\"label\":\"Injection through the already exposed upper duct end\",\"value\":\"Both right and left hepatic ducts fill. The lower duct and duodenum do not fill; contrast returns into the operative field around this opening.\"}]},\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"drain-ercp\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"clinicalRationale\":\"A routine transpapillary stent diverts a communicating leak through the distal outlet. Here the upper study fills both hepatic ducts without reaching that outlet, while the lower study reaches the duodenum without filling the hepatic system. Ordinary stenting alone does not reconnect them; specialist combined techniques are a separate question.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"]},{\"answerChoiceId\":\"duct-anastomosis\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"clinicalRationale\":\"The complementary studies already show the hepatic system and distal outlet opening separately. Further proximal dissection for a more complete injury description can compromise tissue needed by the receiving specialist. This differs from gaining exposure or control when either is inadequate.\",\"sourceLabels\":[\"2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy\",\"Safe cholecystectomy multi-society practice guideline\",\"SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy\"]}]}],\"learningSummary\":\"Recurrent bile outside an unbroken gallbladder changes the imaging objective from orientation to assessment of a possible duct leak. Contrast can enter the ducts through the accessible opening below the clip; injection into the gallbladder would encounter the closed outlet. Fluorescence remains a useful adjunct, but the proposed contrast study defines luminal continuity and contrast escape. This checkpoint does not establish an injury class or its treatment. The decisive finding is the combination of the two injection origins and their separate hepatic versus duodenal connections, together with the visible open ends. Escape around an injected opening alone could be reflux and would not establish this pattern. Routine papillary diversion would address the distal system but not restore the absent connection to the hepatic ducts. Drain and arrange specialist transfer within the stated expertise limit. Further proximal dissection solely to complete a local injury description is unnecessary here; conversion remains appropriate when required for exposure or control. Repair timing and method belong to the HPB team.\"}",
    "sourceQuestionSha256": "c87abb3b13b0c1cd8202c7b9b97b0291808942dd561659266a47232f6fd8d605",
    "sourceNodeSha256": "25d991dc06e6564924ed91c74643b1c497ea3f6d96169202c2e836333a91969b",
    "sourceCaseSha256": "88ac2a65a7680cff8159f3ee7d41f6f2a716c811404471633a4a02fb376439b5",
    "acceptedQuestionSha256": "c87abb3b13b0c1cd8202c7b9b97b0291808942dd561659266a47232f6fd8d605",
    "acceptedNodeSha256": "25d991dc06e6564924ed91c74643b1c497ea3f6d96169202c2e836333a91969b",
    "acceptedCaseSha256": "bfefcd7048be4437a0a39726baebe95e2bd128a44b6c48896e5896aa3f2e6ae3",
    "review": {
      "path": "docs/research/question-intraop-biliary-safety-and-duct-decisions-review3-20261112.json",
      "record": {
        "id": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
        "nodeId": "node.intraop.biliary-safety.major-injury-transfer.20261112.v1",
        "title": "Response to two differently connected duct openings",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "One defensible immediate plan among the offered choices is subhepatic drainage and hepatobiliary-center transfer. The reader must combine the distal injection reaching the duodenum with the separate upper injection filling both hepatic ducts, then apply the continuity finding and the local expertise limit. Routine transpapillary diversion does not solve the described separation.",
          "The record supplies more than contrast escaping around a catheter: it describes a distal segment emptying from its upper end, two visible open ends and complementary proximal/distal filling. The explanation correctly cautions that reflux around an injection site alone would not establish this injury. No exact injury grade, repair timing or reconstruction method is demanded without adequate information.",
          "The third option represents extending local dissection to define the proximal injury before handoff. It is less appropriate with drainage already feasible and reconstruction outside the surgeon's practice. This is a recognizable staging-versus-preservation error, although it is weaker than the communicating-leak/stent distractor; difficulty is moderate rather than hard.",
          "Cue attack: 'The operating surgeon does not perform biliary reconstruction' is a legitimate decision-critical constraint, not a direct lexical match to a unique option. Both transfer and requested stenting involve outside expertise, so the learner still has to interpret continuity. All choices share drainage; the key is not uniquely comprehensive, longest or qualified by a rationale. No diagnosis label explicitly names complete transection before the choice.",
          "The sequence is interpretable without inventing an intervening duct division: the first presentation says the presumed cystic duct has not been divided; the second record describes additional main-duct ends connected to different systems. Discovery of an unrecognized injury is plausible. The second injection is through an already exposed end, so the text does not require the very proximal dissection offered as a distractor.",
          "The second node stands with its shared patient presentation, current update and constructed injection record. It does not depend on remembering the first key. The first explanation primes attention to continuity but does not supply this finding or management answer. The exhibit adds discriminating evidence for rejecting ordinary stenting rather than merely repeating the prior unexplained-bile observation.",
          "The live ASC setting remains plausible for recognition and immediate control of an unexpected injury, with definitive specialist care elsewhere. The item does not portray major biliary reconstruction as an ambulatory-center operation. Stability, available exposure and the expertise boundary are present. This is high-yield bile-duct injury management.",
          "No confident clinical inaccuracy identified in the visible text. Exact injection interpretation and management claims remain subject to named clinical review; this offline editorial PASS does not verify sources or confer clinical approval."
        ],
        "suggestions": [
          "Optional chronology polish: introduce the table as the completed two-injection sequence, explicitly placing exposure of the upper end before its injection and final catheter removal after acquisition. The current record is understandable, but a brief temporal bridge would reduce rereading.",
          "Retain the separate injection origins, visible open ends and both filling distributions. Do not simplify them to 'contrast extravasates' or replace them with an injury diagnosis.",
          "Keep both the expertise limit and adequate drainage exposure. Do not manufacture difficulty by withholding facts that establish why transfer rather than local reconstruction or exposure for immediate control is appropriate."
        ]
      }
    }
  },
  {
    "group": "ENG-I01b",
    "slug": "biliary-safety-and-duct-decisions",
    "caseId": "case.intraop.biliary-safety.stone-clearance.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.biliary-safety.stone-clearance-route.20261112.v1\",\"conceptId\":\"concept.intraop-biliary.stone-clearance-route.v1\",\"stem\":\"Which completion and duct-clearance plan best fits {patientName}'s findings during laparoscopic cholecystectomy?\",\"answerChoices\":[{\"id\":\"postoperative-ercp\",\"label\":\"Complete cholecystectomy and arrange retrograde transpapillary stone extraction\",\"isCorrect\":true,\"rationale\":\"Further transcystic passage is limited by the splitting narrow route. Direct common-duct incision carries an unfavorable caliber here. Complete the gallbladder operation with secure cystic closure and arrange endoscopic stone clearance rather than persisting with either operative route.\",\"distractorRationale\":null},{\"id\":\"transcystic-dilation\",\"label\":\"Complete cholecystectomy after further transcystic dilation and stone extraction\",\"isCorrect\":false,\"rationale\":\"Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.\",\"distractorRationale\":\"Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.\"},{\"id\":\"transductal-exploration\",\"label\":\"Complete cholecystectomy and arrange stone extraction through a common-duct incision\",\"isCorrect\":false,\"rationale\":\"A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.\",\"distractorRationale\":\"A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.\"}],\"explanation\":\"The confirmed stone needs clearance. A splitting cystic duct weighs against further transcystic instrumentation, while the 5-mm common duct weighs against choledochotomy. The SAGES review describes transductal exploration in ducts at least 7 mm wide to limit stricture risk, a selection consideration rather than a biological cliff. With ordinary endoscopic access available, secure the cystic duct, complete cholecystectomy and arrange hospital ERCP. Different duct anatomy or failed endoscopic access could change that ranking.\",\"supportingEvidenceClaimIds\":[\"claim.intraop-biliary.stone-route-options.v1\",\"claim.intraop-biliary.friable-cystic-route.v1\",\"claim.intraop-biliary.narrow-common-duct.v1\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.biliary-safety.stone-clearance-route.20261112.v1\",\"questionVariantId\":\"question.intraop.biliary-safety.stone-clearance-route.20261112.v1\",\"primaryConceptId\":\"concept.intraop-biliary.stone-clearance-route.v1\",\"currentUpdate\":\"Cholangiography fills both hepatic ducts and the duodenum and shows a persistent distal common-duct stone on repeat views after flushing. The common duct measures 5 mm. A guidewire passes through the short angulated cystic duct, but the smallest available extraction basket cannot follow it; the cystic-duct wall begins to split at the opening with gentle instrument passage. Circulation remains stable.\",\"stem\":\"Which completion and duct-clearance plan best fits {patientName}'s findings during laparoscopic cholecystectomy?\",\"answerChoices\":[{\"id\":\"postoperative-ercp\",\"label\":\"Complete cholecystectomy and arrange retrograde transpapillary stone extraction\",\"isCorrect\":true,\"rationale\":\"Further transcystic passage is limited by the splitting narrow route. Direct common-duct incision carries an unfavorable caliber here. Complete the gallbladder operation with secure cystic closure and arrange endoscopic stone clearance rather than persisting with either operative route.\",\"serviceRequest\":null},{\"id\":\"transcystic-dilation\",\"label\":\"Complete cholecystectomy after further transcystic dilation and stone extraction\",\"isCorrect\":false,\"rationale\":\"Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.\",\"serviceRequest\":null},{\"id\":\"transductal-exploration\",\"label\":\"Complete cholecystectomy and arrange stone extraction through a common-duct incision\",\"isCorrect\":false,\"rationale\":\"A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The confirmed stone needs clearance. A splitting cystic duct weighs against further transcystic instrumentation, while the 5-mm common duct weighs against choledochotomy. The SAGES review describes transductal exploration in ducts at least 7 mm wide to limit stricture risk, a selection consideration rather than a biological cliff. With ordinary endoscopic access available, secure the cystic duct, complete cholecystectomy and arrange hospital ERCP. Different duct anatomy or failed endoscopic access could change that ranking.\",\"sourceLabels\":[\"Clinical spotlight review: management of choledocholithiasis\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"transcystic-dilation\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.\",\"clinicalRationale\":\"Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.\",\"sourceLabels\":[\"Clinical spotlight review: management of choledocholithiasis\"]},{\"answerChoiceId\":\"transductal-exploration\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.\",\"clinicalRationale\":\"A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.\",\"sourceLabels\":[\"Clinical spotlight review: management of choledocholithiasis\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.biliary-safety.stone-clearance.20261112.v1\",\"displayName\":\"Duct clearance at gallbladder surgery\",\"patientPresentationVariantId\":\"presentation.intraop.biliary-safety.stone-clearance.20261112.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Naomi Brooks\",\"prototypeDemographics\":{\"ageYears\":62,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Gallbladder surgery\",\"presentation\":\"{patientName}, a 62-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The source team performs transcystic exploration, with referral access for endoscopic or surgical duct clearance. She has no prior gastric or duodenal surgery.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.biliary-safety.stone-clearance.female.62.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":62,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Gallbladder surgery\",\"presentation\":\"{patientName}, a 62-year-old woman, is undergoing laparoscopic cholecystectomy in the clinic's ambulatory OR. The source team performs transcystic exploration, with referral access for endoscopic or surgical duct clearance. She has no prior gastric or duodenal surgery.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Clinical spotlight review: management of choledocholithiasis\"],\"decisionNodes\":[{\"id\":\"node.intraop.biliary-safety.stone-clearance-route.20261112.v1\",\"questionVariantId\":\"question.intraop.biliary-safety.stone-clearance-route.20261112.v1\",\"primaryConceptId\":\"concept.intraop-biliary.stone-clearance-route.v1\",\"currentUpdate\":\"Cholangiography fills both hepatic ducts and the duodenum and shows a persistent distal common-duct stone on repeat views after flushing. The common duct measures 5 mm. A guidewire passes through the short angulated cystic duct, but the smallest available extraction basket cannot follow it; the cystic-duct wall begins to split at the opening with gentle instrument passage. Circulation remains stable.\",\"stem\":\"Which completion and duct-clearance plan best fits {patientName}'s findings during laparoscopic cholecystectomy?\",\"answerChoices\":[{\"id\":\"postoperative-ercp\",\"label\":\"Complete cholecystectomy and arrange retrograde transpapillary stone extraction\",\"isCorrect\":true,\"rationale\":\"Further transcystic passage is limited by the splitting narrow route. Direct common-duct incision carries an unfavorable caliber here. Complete the gallbladder operation with secure cystic closure and arrange endoscopic stone clearance rather than persisting with either operative route.\",\"serviceRequest\":null},{\"id\":\"transcystic-dilation\",\"label\":\"Complete cholecystectomy after further transcystic dilation and stone extraction\",\"isCorrect\":false,\"rationale\":\"Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.\",\"serviceRequest\":null},{\"id\":\"transductal-exploration\",\"label\":\"Complete cholecystectomy and arrange stone extraction through a common-duct incision\",\"isCorrect\":false,\"rationale\":\"A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The confirmed stone needs clearance. A splitting cystic duct weighs against further transcystic instrumentation, while the 5-mm common duct weighs against choledochotomy. The SAGES review describes transductal exploration in ducts at least 7 mm wide to limit stricture risk, a selection consideration rather than a biological cliff. With ordinary endoscopic access available, secure the cystic duct, complete cholecystectomy and arrange hospital ERCP. Different duct anatomy or failed endoscopic access could change that ranking.\",\"sourceLabels\":[\"Clinical spotlight review: management of choledocholithiasis\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"transcystic-dilation\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.\",\"clinicalRationale\":\"Extending a small ductotomy or dilating the cystic route can enable clearance in suitable tissue. The current limiting finding is a wall that is already splitting during gentle passage, rather than a small opening in a sound duct.\",\"sourceLabels\":[\"Clinical spotlight review: management of choledocholithiasis\"]},{\"answerChoiceId\":\"transductal-exploration\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.\",\"clinicalRationale\":\"A transductal approach can clear stones when transcystic access fails. The narrow common duct makes incision and closure less attractive because of postoperative stricture risk; available expertise does not remove this anatomical constraint.\",\"sourceLabels\":[\"Clinical spotlight review: management of choledocholithiasis\"]}]}],\"learningSummary\":\"The confirmed stone needs clearance. A splitting cystic duct weighs against further transcystic instrumentation, while the 5-mm common duct weighs against choledochotomy. The SAGES review describes transductal exploration in ducts at least 7 mm wide to limit stricture risk, a selection consideration rather than a biological cliff. With ordinary endoscopic access available, secure the cystic duct, complete cholecystectomy and arrange hospital ERCP. Different duct anatomy or failed endoscopic access could change that ranking.\"}",
    "sourceQuestionSha256": "4da89de7354eb3e64d468298aeddc60f90d6367b8a06ad76dfc1c22bb9d5f48b",
    "sourceNodeSha256": "06af50db7b7fdf7ff0b5f410a2f19e986c3345ab511e28b9d1edbf15738b2f04",
    "sourceCaseSha256": "6746b3e80dd1caf832d9d19a568809f979546232d00d662d1f951b7d57191b19",
    "acceptedQuestionSha256": "4da89de7354eb3e64d468298aeddc60f90d6367b8a06ad76dfc1c22bb9d5f48b",
    "acceptedNodeSha256": "06af50db7b7fdf7ff0b5f410a2f19e986c3345ab511e28b9d1edbf15738b2f04",
    "acceptedCaseSha256": "7e54c99a842ea0e0e2f954fdc555dbf6bf3d6bef2ab8d17123ee5b45223f11f2",
    "review": {
      "path": "docs/research/question-intraop-biliary-safety-and-duct-decisions-review3-20261112.json",
      "record": {
        "id": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
        "nodeId": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
        "title": "Clearance route after a difficult transcystic attempt",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The best offered plan is completion with subsequent endoscopic transpapillary stone extraction. The learner must recognize that successful guidewire passage does not make continued basket passage/dilation appropriate when the cystic-duct wall is splitting, then use common-duct caliber to compare transductal exploration with endoscopic clearance. These are two consequential route-selection judgments.",
          "The closest competitors are credible: further transcystic enlargement can be appropriate in suitable tissue, and transductal exploration can follow failed transcystic access in suitable anatomy. The supplied wall behavior and 5-mm common duct distinguish this case. Removing the tissue finding makes further transcystic work more competitive; removing the caliber leaves the surgical-clearance comparison less well resolved. The findings earn their place.",
          "Calling the persistent finding a stone is acceptable here because the objective is clearance-route selection, not diagnosis from a cholangiogram. Repeated views after flushing, proximal filling and duodenal filling establish the stated procedural checkpoint without requiring an unavailable image to solve an image-recognition task.",
          "Cue attack: all three labels specify completion and a clearance route with comparable length and specificity. None contains an explanatory error, absolute or generic individualized plan. Referral access is stated for both endoscopic and surgical clearance; it does not uniquely authorize the key. Lack of prior gastric/duodenal surgery supplies a relevant conventional-access boundary rather than a diagnosis giveaway.",
          "Live cholecystectomy with an attempted transcystic maneuver is plausible in an appropriately equipped ASC; the presentation explicitly establishes that the team performs this procedure. The keyed ERCP is arranged subsequently, and the explanation locates it at a hospital. The item does not require an ASC to perform choledochotomy or major duct reconstruction. It also does not state that the patient should be discharged home before duct clearance.",
          "The observed splitting needs safe cystic-duct control before completion; the explanation includes securing the duct. No extension into the common duct, uncontrolled bile leak or instability is supplied, so these should not be invented to defeat the offered key. If the intended case includes inability to secure the stump, the completion plan would require reassessment and that finding must be stated.",
          "The 7-mm recommendation appears only in post-answer teaching and is described as a selection consideration, not an absolute biological cutoff. I cannot independently verify its exact SAGES attribution or currency within this offline visible-text review. No replacement threshold is proposed and no confident clinical inaccuracy is asserted. Editorial PASS does not verify that source claim or confer clinical approval.",
          "The adult patient, procedural stage and standalone task are coherent. Choledocholithiasis clearance after failed transcystic access is high yield. Difficulty is moderate because the two anatomical constraints clearly favor one route; this is not a hard item merely because several procedures are named."
        ],
        "suggestions": [
          "Optional wording polish: use 'operating team' rather than 'source team' and name 'postoperative hospital ERCP with stone extraction' directly rather than relying on the longer route description. Preserve parallel specificity across options.",
          "Keep the splitting wall and measured common-duct caliber; do not substitute a preinterpreted statement that operative clearance is unsuitable.",
          "Before clinical approval, confirm the exact source support and limitations for the numerical transductal-selection teaching point. Preserve the explanation's qualification and do not turn the cited value into an absolute contraindication."
        ]
      }
    }
  },
  {
    "group": "ENG-I01b",
    "slug": "endoscopic-perforation-and-injury",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"conceptId\":\"concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"stem\":\"Which initial strategy is most appropriate for {patientName}'s newly observed sigmoid wall defect during colonoscopy?\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.clips\",\"label\":\"Endoscopic clip closure of the sigmoid defect\",\"isCorrect\":true,\"rationale\":\"The newly seen small gap, mobile edges, clean lumen and preserved physiology support a prompt endoscopic closure attempt. Hospital monitoring and surgical consultation still follow.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.observe\",\"label\":\"Inpatient observation of the sigmoid defect\",\"isCorrect\":false,\"rationale\":\"Monitored nonoperative care fits selected sealed injuries. This accessible gap remains open during the procedure, so leaving it unclosed gives up a feasible opportunity to limit leakage.\",\"distractorRationale\":\"Monitored nonoperative care fits selected sealed injuries. This accessible gap remains open during the procedure, so leaving it unclosed gives up a feasible opportunity to limit leakage.\"},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.suture\",\"label\":\"Laparoscopic suture closure of the sigmoid defect\",\"isCorrect\":false,\"rationale\":\"Operative closure is important when endoscopic treatment is unsuitable or fails. The small clean defect and mobile margins support an endoscopic attempt before committing to an operation.\",\"distractorRationale\":\"Operative closure is important when endoscopic treatment is unsuitable or fails. The small clean defect and mobile margins support an endoscopic attempt before committing to an operation.\"}],\"explanation\":\"A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.endoscopic-perforation-and-injury.observed-wall-breach\",\"claim.intraop.endoscopic-perforation-and-injury.early-colon-closure\",\"claim.intraop.endoscopic-perforation-and-injury.conservative-colon-selection\",\"claim.intraop.endoscopic-perforation-and-injury.perforation-support\",\"claim.intraop.endoscopic-perforation-and-injury.limit-extraluminal-insufflation\",\"claim.intraop.endoscopic-perforation-and-injury.colonic-surgical-boundary\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"stem\":\"Which initial strategy is most appropriate for {patientName}'s newly observed sigmoid wall defect during colonoscopy?\",\"currentUpdate\":\"During sigmoid insertion, a 7-mm wall opening exposes yellow peritoneal fat. The adjacent edges are pink and mobile; the prepared lumen contains clear fluid. Blood pressure remains at baseline and the abdomen is soft. Insufflation is stopped, luminal fluid is suctioned and intravenous fluids and antibiotics are started while hospital transfer is coordinated.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.clips\",\"label\":\"Endoscopic clip closure of the sigmoid defect\",\"isCorrect\":true,\"rationale\":\"The newly seen small gap, mobile edges, clean lumen and preserved physiology support a prompt endoscopic closure attempt. Hospital monitoring and surgical consultation still follow.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.observe\",\"label\":\"Inpatient observation of the sigmoid defect\",\"isCorrect\":false,\"rationale\":\"Monitored nonoperative care fits selected sealed injuries. This accessible gap remains open during the procedure, so leaving it unclosed gives up a feasible opportunity to limit leakage.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.suture\",\"label\":\"Laparoscopic suture closure of the sigmoid defect\",\"isCorrect\":false,\"rationale\":\"Operative closure is important when endoscopic treatment is unsuitable or fails. The small clean defect and mobile margins support an endoscopic attempt before committing to an operation.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"],\"resultGateAfter\":null,\"terminalDispositions\":[]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1\",\"displayName\":\"Colonoscopy\",\"patientDisplayName\":\"Elena Brooks\",\"patientPresentationVariantId\":\"presentation.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy\",\"presentation\":\"{patientName}, a 57-year-old woman, is undergoing screening colonoscopy in the clinic's endoscopy room.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy\",\"presentation\":\"{patientName}, a 57-year-old woman, is undergoing screening colonoscopy in the clinic's endoscopy room.\"}],\"releasePointId\":\"release.l2.endoscopy\",\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"endoscopy\",\"requiredCapabilityIds\":[\"capability.endoscopy\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"],\"decisionNodes\":[{\"id\":\"node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"stem\":\"Which initial strategy is most appropriate for {patientName}'s newly observed sigmoid wall defect during colonoscopy?\",\"currentUpdate\":\"During sigmoid insertion, a 7-mm wall opening exposes yellow peritoneal fat. The adjacent edges are pink and mobile; the prepared lumen contains clear fluid. Blood pressure remains at baseline and the abdomen is soft. Insufflation is stopped, luminal fluid is suctioned and intravenous fluids and antibiotics are started while hospital transfer is coordinated.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.clips\",\"label\":\"Endoscopic clip closure of the sigmoid defect\",\"isCorrect\":true,\"rationale\":\"The newly seen small gap, mobile edges, clean lumen and preserved physiology support a prompt endoscopic closure attempt. Hospital monitoring and surgical consultation still follow.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.observe\",\"label\":\"Inpatient observation of the sigmoid defect\",\"isCorrect\":false,\"rationale\":\"Monitored nonoperative care fits selected sealed injuries. This accessible gap remains open during the procedure, so leaving it unclosed gives up a feasible opportunity to limit leakage.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.suture\",\"label\":\"Laparoscopic suture closure of the sigmoid defect\",\"isCorrect\":false,\"rationale\":\"Operative closure is important when endoscopic treatment is unsuitable or fails. The small clean defect and mobile margins support an endoscopic attempt before committing to an operation.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"stem\":\"Which immediate plan is most appropriate for {patientName}'s new abdominal and cardiopulmonary changes at the end of colonoscopy?\",\"currentUpdate\":\"During placement of the final clips, the abdomen becomes progressively distended. At the immediate reassessment, the clip line holds the defect edges together, but the abdomen is taut and tympanitic, blood pressure falls and assisted ventilation is difficult. The airway is patent and breath sounds remain bilateral. Insufflation remains stopped; airway and circulatory support continue and the receiving hospital has been contacted.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.catheter\",\"label\":\"Percutaneous release of intraperitoneal gas followed by hospital transfer\",\"isCorrect\":true,\"rationale\":\"The rapidly expanding tympanitic abdomen with simultaneous circulatory and ventilatory decline points to pressurized gas outside the bowel. Percutaneous decompression addresses that compartment before departure, while shared resuscitation and hospital escalation continue.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric\",\"label\":\"Orogastric tube decompression followed by supported hospital transfer\",\"isCorrect\":false,\"rationale\":\"Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport\",\"label\":\"Direct hospital transfer with ongoing airway and circulatory support\",\"isCorrect\":false,\"rationale\":\"The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Gas that escaped before insufflation stopped can remain outside the bowel after clip apposition. Here, abdominal expansion is evolving during the final closure steps and produces a new combined ventilatory and circulatory problem at reassessment. Emergency percutaneous decompression precedes transfer while airway and circulatory support continue. Improvement is temporization and does not establish a durable seal or remove the need for hospital assessment.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"]},{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"]}]}],\"learningSummary\":\"A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary. An apposed clip line does not prevent gas already outside the bowel from creating pressure. The new abdominal, ventilatory and circulatory changes require emergency percutaneous decompression while resuscitation and hospital escalation continue. This is temporization; improvement does not prove that the injury is sealed.\"}",
    "sourceQuestionSha256": "f99179cd12f692b1cdd6c4556fbba506543032c14ac4b2122b7cd1e85eb25901",
    "sourceNodeSha256": "b91d09cf3394862fa4305d29a19a1c23d71d8da2e7f69318b6a8bbffaae68177",
    "sourceCaseSha256": "36af98b255bdf9f81e7451efd4b158d45098a1464d67fa263c1b7b4356608241",
    "acceptedQuestionSha256": "f99179cd12f692b1cdd6c4556fbba506543032c14ac4b2122b7cd1e85eb25901",
    "acceptedNodeSha256": "b91d09cf3394862fa4305d29a19a1c23d71d8da2e7f69318b6a8bbffaae68177",
    "acceptedCaseSha256": "4485ff0d19ad6ae775fe7e9b3db9b4649ab32a55adce85c4e9d7801e3ea55983",
    "review": {
      "path": "docs/research/question-intraop-endoscopic-perforation-and-injury-review2-20261112.json",
      "record": {
        "id": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
        "nodeId": "node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
        "title": "Fresh sigmoid defect: immediate local strategy",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Endoscopic clip closure is the best offered initial strategy: the directly observed open breach, small size, mobile viable-looking margins, clean preparation and preserved physiology support an immediate closure attempt. Observation does not address the visible open gap; automatic operative repair overlooks a favorable endoscopic opportunity. The findings support an attempt, not guaranteed technical success.",
          "The two consequential steps are assessing the breach and its suitability for local closure, then choosing closure rather than observation or operative escalation. This is lower-moderate difficulty, not hard: all local findings favor clipping. Recognizing and responding to iatrogenic perforation is a high-yield general-surgery/endoscopy concept; this is a qualitative scope judgment, not a verified examination-frequency claim.",
          "Cue attack: 'pink and mobile' and 'the prepared lumen contains clear fluid' supply clinically necessary feasibility and contamination observations. Neither repeats a unique option label or teaches an explicit management rule. All three options use the same anatomical target and comparable specificity; no length outlier, absolute, explanatory distractor or component-convergence shortcut identifies the key without clinical knowledge.",
          "Elena Brooks has a consistent adult age/sex, a short complaint and an already-underway colonoscopy in the clinic endoscopy room. Detection and initial endoscopic closure are plausible ASC events. Hospital transfer is already coordinated; inpatient observation and laparoscopic repair must be understood as hospital pathways rather than operations performed in this endoscopy room.",
          "The first node is independently understandable. Its explanation discusses closure and hospital follow-up without teaching the later gas-compartment diagnosis or percutaneous rescue. The second node supplies a new deterioration rather than merely asking the learner to repeat this decision.",
          "Review scope: all five candidate nodes in four cases were assessed from their candidate visible fields, with patient-name substitution and preceding visible feedback where applicable. The nine Keep inventory records (live.133, live.134, retained.222-225, authoring.253, authoring.254 and authoring.322) were noted but not rescored. Candidate engineering-admission holds were not mistaken for exclusion of the five nodes offered for editorial review. No network, source-currency verification, runtime validation or clinical approval is represented by this report. All five remain needs_clinician_review pending Melissa Rowland's exact-version sign-off. No confident clinical inaccuracy was identified here."
        ],
        "suggestions": [
          "Preserve the raw defect, tissue, preparation and physiological observations; deleting these to increase difficulty would weaken the single-best-answer boundary.",
          "At integration, make the hospital destination of operative alternatives clear and verify the relevant closure expertise/equipment and escalation pathway. Do not insert key-announcing equipment permissions into the vignette."
        ]
      }
    }
  },
  {
    "group": "ENG-I01b",
    "slug": "endoscopic-perforation-and-injury",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"conceptId\":\"concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"stem\":\"Which immediate plan is most appropriate for {patientName}'s new abdominal and cardiopulmonary changes at the end of colonoscopy?\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.catheter\",\"label\":\"Percutaneous release of intraperitoneal gas followed by hospital transfer\",\"isCorrect\":true,\"rationale\":\"The rapidly expanding tympanitic abdomen with simultaneous circulatory and ventilatory decline points to pressurized gas outside the bowel. Percutaneous decompression addresses that compartment before departure, while shared resuscitation and hospital escalation continue.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric\",\"label\":\"Orogastric tube decompression followed by supported hospital transfer\",\"isCorrect\":false,\"rationale\":\"Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.\",\"distractorRationale\":\"Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.\"},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport\",\"label\":\"Direct hospital transfer with ongoing airway and circulatory support\",\"isCorrect\":false,\"rationale\":\"The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.\",\"distractorRationale\":\"The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.\"}],\"explanation\":\"Gas that escaped before insufflation stopped can remain outside the bowel after clip apposition. Here, abdominal expansion is evolving during the final closure steps and produces a new combined ventilatory and circulatory problem at reassessment. Emergency percutaneous decompression precedes transfer while airway and circulatory support continue. Improvement is temporization and does not establish a durable seal or remove the need for hospital assessment.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.endoscopic-perforation-and-injury.tension-physiology\",\"claim.intraop.endoscopic-perforation-and-injury.tension-rescue\",\"claim.intraop.endoscopic-perforation-and-injury.rescue-is-not-seal\",\"claim.intraop.endoscopic-perforation-and-injury.gas-compartment\",\"claim.intraop.endoscopic-perforation-and-injury.limit-extraluminal-insufflation\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"stem\":\"Which immediate plan is most appropriate for {patientName}'s new abdominal and cardiopulmonary changes at the end of colonoscopy?\",\"currentUpdate\":\"During placement of the final clips, the abdomen becomes progressively distended. At the immediate reassessment, the clip line holds the defect edges together, but the abdomen is taut and tympanitic, blood pressure falls and assisted ventilation is difficult. The airway is patent and breath sounds remain bilateral. Insufflation remains stopped; airway and circulatory support continue and the receiving hospital has been contacted.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.catheter\",\"label\":\"Percutaneous release of intraperitoneal gas followed by hospital transfer\",\"isCorrect\":true,\"rationale\":\"The rapidly expanding tympanitic abdomen with simultaneous circulatory and ventilatory decline points to pressurized gas outside the bowel. Percutaneous decompression addresses that compartment before departure, while shared resuscitation and hospital escalation continue.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric\",\"label\":\"Orogastric tube decompression followed by supported hospital transfer\",\"isCorrect\":false,\"rationale\":\"Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport\",\"label\":\"Direct hospital transfer with ongoing airway and circulatory support\",\"isCorrect\":false,\"rationale\":\"The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Gas that escaped before insufflation stopped can remain outside the bowel after clip apposition. Here, abdominal expansion is evolving during the final closure steps and produces a new combined ventilatory and circulatory problem at reassessment. Emergency percutaneous decompression precedes transfer while airway and circulatory support continue. Improvement is temporization and does not establish a durable seal or remove the need for hospital assessment.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"]},{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1\",\"displayName\":\"Colonoscopy\",\"patientDisplayName\":\"Elena Brooks\",\"patientPresentationVariantId\":\"presentation.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy\",\"presentation\":\"{patientName}, a 57-year-old woman, is undergoing screening colonoscopy in the clinic's endoscopy room.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy\",\"presentation\":\"{patientName}, a 57-year-old woman, is undergoing screening colonoscopy in the clinic's endoscopy room.\"}],\"releasePointId\":\"release.l2.endoscopy\",\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"endoscopy\",\"requiredCapabilityIds\":[\"capability.endoscopy\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"],\"decisionNodes\":[{\"id\":\"node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1\",\"stem\":\"Which initial strategy is most appropriate for {patientName}'s newly observed sigmoid wall defect during colonoscopy?\",\"currentUpdate\":\"During sigmoid insertion, a 7-mm wall opening exposes yellow peritoneal fat. The adjacent edges are pink and mobile; the prepared lumen contains clear fluid. Blood pressure remains at baseline and the abdomen is soft. Insufflation is stopped, luminal fluid is suctioned and intravenous fluids and antibiotics are started while hospital transfer is coordinated.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.clips\",\"label\":\"Endoscopic clip closure of the sigmoid defect\",\"isCorrect\":true,\"rationale\":\"The newly seen small gap, mobile edges, clean lumen and preserved physiology support a prompt endoscopic closure attempt. Hospital monitoring and surgical consultation still follow.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.observe\",\"label\":\"Inpatient observation of the sigmoid defect\",\"isCorrect\":false,\"rationale\":\"Monitored nonoperative care fits selected sealed injuries. This accessible gap remains open during the procedure, so leaving it unclosed gives up a feasible opportunity to limit leakage.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1.suture\",\"label\":\"Laparoscopic suture closure of the sigmoid defect\",\"isCorrect\":false,\"rationale\":\"Operative closure is important when endoscopic treatment is unsuitable or fails. The small clean defect and mobile margins support an endoscopic attempt before committing to an operation.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\"],\"resultGateAfter\":null,\"terminalDispositions\":[]},{\"id\":\"node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1\",\"stem\":\"Which immediate plan is most appropriate for {patientName}'s new abdominal and cardiopulmonary changes at the end of colonoscopy?\",\"currentUpdate\":\"During placement of the final clips, the abdomen becomes progressively distended. At the immediate reassessment, the clip line holds the defect edges together, but the abdomen is taut and tympanitic, blood pressure falls and assisted ventilation is difficult. The airway is patent and breath sounds remain bilateral. Insufflation remains stopped; airway and circulatory support continue and the receiving hospital has been contacted.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.catheter\",\"label\":\"Percutaneous release of intraperitoneal gas followed by hospital transfer\",\"isCorrect\":true,\"rationale\":\"The rapidly expanding tympanitic abdomen with simultaneous circulatory and ventilatory decline points to pressurized gas outside the bowel. Percutaneous decompression addresses that compartment before departure, while shared resuscitation and hospital escalation continue.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric\",\"label\":\"Orogastric tube decompression followed by supported hospital transfer\",\"isCorrect\":false,\"rationale\":\"Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport\",\"label\":\"Direct hospital transfer with ongoing airway and circulatory support\",\"isCorrect\":false,\"rationale\":\"The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Gas that escaped before insufflation stopped can remain outside the bowel after clip apposition. Here, abdominal expansion is evolving during the final closure steps and produces a new combined ventilatory and circulatory problem at reassessment. Emergency percutaneous decompression precedes transfer while airway and circulatory support continue. Improvement is temporization and does not establish a durable seal or remove the need for hospital assessment.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.gastric\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Gastric tube decompression targets gas within the stomach. It does not release pressurized intraperitoneal gas after a colonic breach, so it does not address the new combined findings before transfer.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"]},{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1.transport\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"The patient still needs hospital source-control assessment. Direct departure with supportive treatment leaves the immediate pressure problem unrelieved; decompression should precede departure in this constructed clinical pattern.\",\"sourceLabels\":[\"2017 WSES guidelines for the management of iatrogenic colonoscopy perforation\",\"Needle Decompression of Tension Pneumoperitoneum: A Case Report\"]}]}],\"learningSummary\":\"A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary. An apposed clip line does not prevent gas already outside the bowel from creating pressure. The new abdominal, ventilatory and circulatory changes require emergency percutaneous decompression while resuscitation and hospital escalation continue. This is temporization; improvement does not prove that the injury is sealed.\"}",
    "sourceQuestionSha256": "875f84409388a27835b0cff59b58ae40d8dad3bea91074fec11db3e4b047cf83",
    "sourceNodeSha256": "359c9213eee02dcea01a6ce0f00ff8fe0df17a655118498d4a9fe449a0bc6565",
    "sourceCaseSha256": "36af98b255bdf9f81e7451efd4b158d45098a1464d67fa263c1b7b4356608241",
    "acceptedQuestionSha256": "875f84409388a27835b0cff59b58ae40d8dad3bea91074fec11db3e4b047cf83",
    "acceptedNodeSha256": "359c9213eee02dcea01a6ce0f00ff8fe0df17a655118498d4a9fe449a0bc6565",
    "acceptedCaseSha256": "4485ff0d19ad6ae775fe7e9b3db9b4649ab32a55adce85c4e9d7801e3ea55983",
    "review": {
      "path": "docs/research/question-intraop-endoscopic-perforation-and-injury-review2-20261112.json",
      "record": {
        "id": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
        "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
        "title": "New cardiopulmonary compromise during closure",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Percutaneous release of intraperitoneal gas before supported transfer is the best offered plan for the combined taut tympanitic abdomen, falling blood pressure and difficult ventilation after a colonic breach. Orogastric decompression treats a different compartment; departure with resuscitation but no pressure relief leaves the immediate reversible problem untreated.",
          "Two consequential steps remain: identify the pressure-producing compartment from the simultaneous abdominal and cardiopulmonary findings despite apparent clip apposition, then prioritize decompression before transport. The competing errors are treating all distension with a gastric tube and treating necessary hospital transfer as a substitute for immediate stabilization. This is moderate recognition-and-sequencing difficulty, not a hard differential-diagnosis item. Emergency response to endoscopic perforation and pressure compromise is high yield.",
          "Cue attack: 'taut and tympanitic' is a clinical discriminator, not a nonmedical synonym for the uniquely keyed action. 'The airway is patent and breath sounds remain bilateral' supports localization without naming the diagnosis; it does not exclude every other cardiopulmonary cause. All three choices include hospital transfer and have comparable length. The key is not uniquely comprehensive because airway and circulatory support are explicitly shared. No rhetorical absolute, diagnosis label, teaching sentence or majority-component shortcut selects it.",
          "The sequence is coherent: a recognized defect is clipped, abdominal distension evolves during the final steps, and new instability is assessed before departure. The update does not describe a long stable interval followed by unexplained new insufflation. The explanation locates escaped gas before insufflation stopped and does not equate successful edge apposition with elimination of extraluminal gas. This is clinically plausible; the visible text alone cannot establish the exact timing or volume of gas escape.",
          "The preceding explanation does not teach percutaneous decompression. Removing the new update removes the indication for this rescue, so the follow-up earns a distinct decision. Even when encountered separately with the case presentation, the update identifies colonoscopy, recent clip closure, present findings and ongoing support sufficiently to choose an immediate plan.",
          "The adult patient identity is preserved. Emergency temporization in the ASC followed by hospital assessment fits the program; major surgical source control is not portrayed as a local procedure. The explanation correctly treats improvement as temporization rather than proof of a durable seal. No confident clinical inaccuracy was identified in this offline review."
        ],
        "suggestions": [
          "Preserve the explicit during-closure chronology, shared resuscitation and predeparture decision; do not recast this as delayed distension after an established stable recovery.",
          "Verify rescue competence, equipment and transfer support in the actual procedure-family integration. This editorial PASS does not establish that the runtime provides them."
        ]
      }
    }
  },
  {
    "group": "ENG-I01b",
    "slug": "endoscopic-perforation-and-injury",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-endoscopic-perforation-and-injury.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1\",\"conceptId\":\"concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1\",\"stem\":\"Which initial closure strategy is most appropriate for {patientName}'s newly observed esophageal defect during dilation?\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.clips\",\"label\":\"Endoscopic clip approximation of the esophageal defect\",\"isCorrect\":true,\"rationale\":\"The small acute defect has accessible margins that approximate. Primary endoscopic clipping is supported for this anatomy; hospital assessment still addresses leakage and contamination.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.stent\",\"label\":\"Endoscopic covered stent across the esophageal defect\",\"isCorrect\":false,\"rationale\":\"Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.\",\"distractorRationale\":\"Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.\"},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.operative\",\"label\":\"Operative suture closure of the esophageal defect\",\"isCorrect\":false,\"rationale\":\"An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.\",\"distractorRationale\":\"An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.\"}],\"explanation\":\"The wall opening was recognized during dilation and its small fresh margins approximate. These findings support primary endoscopic clip closure. Covered stenting remains an option for larger or incompletely closed defects; surgical source control addresses injuries unsuitable for endoscopic/nonoperative care. This decision does not authorize ASC discharge.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.endoscopic-perforation-and-injury.esophageal-primary-clips\",\"claim.intraop.endoscopic-perforation-and-injury.esophageal-stent-boundary\",\"claim.intraop.endoscopic-perforation-and-injury.esophageal-operative-boundary\",\"claim.intraop.endoscopic-perforation-and-injury.esophageal-support\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1\",\"stem\":\"Which initial closure strategy is most appropriate for {patientName}'s newly observed esophageal defect during dilation?\",\"currentUpdate\":\"After balloon deflation, an 8-mm opening in the distal esophageal wall exposes tissue beyond the lumen. The endoscopist has a face-on view, and the fresh margins move together with gentle suction. Blood pressure and ventilation remain at baseline. Luminal fluid is suctioned; intravenous support and hospital surgical consultation are being arranged.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.clips\",\"label\":\"Endoscopic clip approximation of the esophageal defect\",\"isCorrect\":true,\"rationale\":\"The small acute defect has accessible margins that approximate. Primary endoscopic clipping is supported for this anatomy; hospital assessment still addresses leakage and contamination.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.stent\",\"label\":\"Endoscopic covered stent across the esophageal defect\",\"isCorrect\":false,\"rationale\":\"Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.operative\",\"label\":\"Operative suture closure of the esophageal defect\",\"isCorrect\":false,\"rationale\":\"An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The wall opening was recognized during dilation and its small fresh margins approximate. These findings support primary endoscopic clip closure. Covered stenting remains an option for larger or incompletely closed defects; surgical source control addresses injuries unsuitable for endoscopic/nonoperative care. This decision does not authorize ASC discharge.\",\"sourceLabels\":[\"Esophageal emergencies: WSES guidelines\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.stent\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.\",\"sourceLabels\":[\"Esophageal emergencies: WSES guidelines\"]},{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.operative\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.\",\"sourceLabels\":[\"Esophageal emergencies: WSES guidelines\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1\",\"displayName\":\"Esophageal dilation\",\"patientDisplayName\":\"Mason Reed\",\"patientPresentationVariantId\":\"presentation.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1\",\"prototypeDemographics\":{\"ageYears\":55,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Esophageal dilation\",\"presentation\":\"{patientName}, a 55-year-old man, is undergoing balloon dilation of a short benign distal esophageal ring in the clinic's endoscopy room.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1\",\"prototypeDemographics\":{\"ageYears\":55,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Esophageal dilation\",\"presentation\":\"{patientName}, a 55-year-old man, is undergoing balloon dilation of a short benign distal esophageal ring in the clinic's endoscopy room.\"}],\"releasePointId\":\"release.l2.endoscopy\",\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"endoscopy\",\"requiredCapabilityIds\":[\"capability.endoscopy\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Esophageal emergencies: WSES guidelines\"],\"decisionNodes\":[{\"id\":\"node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1\",\"questionVariantId\":\"question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1\",\"primaryConceptId\":\"concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1\",\"stem\":\"Which initial closure strategy is most appropriate for {patientName}'s newly observed esophageal defect during dilation?\",\"currentUpdate\":\"After balloon deflation, an 8-mm opening in the distal esophageal wall exposes tissue beyond the lumen. The endoscopist has a face-on view, and the fresh margins move together with gentle suction. Blood pressure and ventilation remain at baseline. Luminal fluid is suctioned; intravenous support and hospital surgical consultation are being arranged.\",\"answerChoices\":[{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.clips\",\"label\":\"Endoscopic clip approximation of the esophageal defect\",\"isCorrect\":true,\"rationale\":\"The small acute defect has accessible margins that approximate. Primary endoscopic clipping is supported for this anatomy; hospital assessment still addresses leakage and contamination.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.stent\",\"label\":\"Endoscopic covered stent across the esophageal defect\",\"isCorrect\":false,\"rationale\":\"Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.operative\",\"label\":\"Operative suture closure of the esophageal defect\",\"isCorrect\":false,\"rationale\":\"An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The wall opening was recognized during dilation and its small fresh margins approximate. These findings support primary endoscopic clip closure. Covered stenting remains an option for larger or incompletely closed defects; surgical source control addresses injuries unsuitable for endoscopic/nonoperative care. This decision does not authorize ASC discharge.\",\"sourceLabels\":[\"Esophageal emergencies: WSES guidelines\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.stent\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"Covered stents can treat larger gaps or unsatisfactory primary closure. The supplied small defect and apposable fresh margins favor a primary clip attempt here.\",\"sourceLabels\":[\"Esophageal emergencies: WSES guidelines\"]},{\"answerChoiceId\":\"choice.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1.operative\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its rationale. This answer records a recommendation; it does not execute a procedure or determine a patient outcome.\",\"clinicalRationale\":\"An operation provides source control when endoscopic/nonoperative management is unsuitable or fails. Prompt recognition and the accessible small gap support endoscopic closure first.\",\"sourceLabels\":[\"Esophageal emergencies: WSES guidelines\"]}]}],\"learningSummary\":\"The wall opening was recognized during dilation and its small fresh margins approximate. These findings support primary endoscopic clip closure. Covered stenting remains an option for larger or incompletely closed defects; surgical source control addresses injuries unsuitable for endoscopic/nonoperative care. This decision does not authorize ASC discharge.\"}",
    "sourceQuestionSha256": "48fcc4655585663ab3aadce89b765e4c2afca1277ab79c39effe36b447431349",
    "sourceNodeSha256": "76346d8bbc5764aa9bb3e5deeca717cc92bad7b68c30cb24c0f1b535111d3692",
    "sourceCaseSha256": "97bde99697fa7142da0090d397354a50169fcdaad5a1e888d83ca57a9b9861fc",
    "acceptedQuestionSha256": "48fcc4655585663ab3aadce89b765e4c2afca1277ab79c39effe36b447431349",
    "acceptedNodeSha256": "76346d8bbc5764aa9bb3e5deeca717cc92bad7b68c30cb24c0f1b535111d3692",
    "acceptedCaseSha256": "25048561106c68e9331fa7bb34c538d4d1a06d6e6ca25290eb62b286d5d4fc3d",
    "review": {
      "path": "docs/research/question-intraop-endoscopic-perforation-and-injury-review2-20261112.json",
      "record": {
        "id": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
        "nodeId": "node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
        "title": "Dilation injury: closure strategy",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Clip approximation is the best offered initial closure strategy for this freshly observed small opening with a face-on view and margins that come together. Covered stenting and operative repair are real neighboring treatments, but the supplied geometry and immediate recognition favor a local primary closure attempt. The wording does not establish that either alternative is universally contraindicated.",
          "The learner must distinguish a wall breach from a routine post-dilation mucosal injury using visible tissue beyond the lumen, assess immediate approximation feasibility, and select the closure approach. This is lower-moderate two-step application rather than a hard item. Iatrogenic esophageal perforation and early management are high-yield concepts; detailed device superiority is not the tested claim.",
          "Cue attack: 'fresh margins move together with gentle suction' conveys a relevant observed mechanical relationship. Its semantic relationship to 'clip approximation' is clinically meaningful rather than arbitrary wording overlap: stenting and suturing also remain concrete closure strategies. All options name the esophageal defect, have comparable length and answer the same complete closure task. No unique qualification, explanatory distractor, absolute or convergence shortcut was found.",
          "Mason Reed's adult age/sex, short complaint and ongoing dilation of a benign distal ring are consistent. This is a plausible ambulatory endoscopy complication with initial endoscopic treatment and hospital surgical involvement. The operative alternative belongs to a hospital pathway; the explanation explicitly does not authorize ASC discharge.",
          "This standalone node supplies its own procedural checkpoint and decision-critical field observations. There is no later outcome or preceding explanation that supplies the answer. The scene is conveyed by observations rather than a promised but missing image.",
          "No confident clinical inaccuracy was identified. 'Intravenous support' is nonspecific and the feedback is not a complete perforation-care protocol; because the task is narrowly about closure technique, that omission does not produce a second best closure answer. Exact device feasibility, supportive-care completeness and clinical sign-off remain clinician matters."
        ],
        "suggestions": [
          "Retain the direct-view, fresh-margin and approximation observations; do not replace them with an eligibility conclusion such as suitable for clipping.",
          "For integration, distinguish hospital operative repair from live ASC intervention and verify closure resources. Any expansion into a full immediate-care task would need explicit shared supportive care and separate exact-version review."
        ]
      }
    }
  },
  {
    "group": "ENG-I01b",
    "slug": "suspicious-polyps-retrieval-and-tattoo",
    "caseId": "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
    "nodeId": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "questionVariantId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1\",\"conceptId\":\"concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1\",\"stem\":\"During {patientName}'s descending-colon colonoscopy, which plan best fits the combined surface and biopsy findings?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed procedure and pathology observations; written findings, not an endoscopic image\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Central depression\",\"Peripheral biopsy\"],\"cells\":[[\"A sharply outlined central patch has no recognizable gland openings; its surface remains amorphous after washing and dye application.\"],[\"The outside forceps sample came from the raised outer edge. It contains adenomatous mucosa; submucosa is not represented.\"]]},\"explanation\":\"The central pit pattern is concerning for deep invasion; the outside biopsy examined a different, superficial region. Obtain tissue from the concerning focus and arrange surgical evaluation. En-bloc endoscopic treatment addresses selected superficial disease; piecemeal removal would further impair assessment. No histology result or colectomy occurs in this consult.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.suspicious-polyps.amorphous-pit-pattern\",\"claim.intraop.suspicious-polyps.limited-biopsy-scope\",\"claim.intraop.suspicious-polyps.targeted-sampling\",\"claim.intraop.suspicious-polyps.nonpedunculated-surgical-route\",\"claim.intraop.suspicious-polyps.superficial-enbloc-boundary\",\"claim.intraop.suspicious-polyps.benign-piecemeal-boundary\"],\"answerChoices\":[{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.sample-surgical.20261112.v1\",\"label\":\"Targeted sampling and colorectal-surgery evaluation\",\"isCorrect\":true,\"rationale\":\"The central nonstructural pattern raises deep-invasion concern, which the peripheral mucosal biopsy cannot settle. Sample that focus and seek surgical assessment rather than attempt endoscopic clearance.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1\",\"label\":\"En-bloc endoscopic resection and specimen assessment\",\"isCorrect\":false,\"rationale\":\"An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.\",\"distractorRationale\":\"An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.\"},{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1\",\"label\":\"Piecemeal endoscopic resection and fragment assessment\",\"isCorrect\":false,\"rationale\":\"The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.\",\"distractorRationale\":\"The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1\",\"questionVariantId\":\"question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1\",\"primaryConceptId\":\"concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1\",\"currentUpdate\":\"After washing, the endoscopist uses magnifying dye chromoendoscopy to inspect the lesion.\",\"stem\":\"During {patientName}'s descending-colon colonoscopy, which plan best fits the combined surface and biopsy findings?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed procedure and pathology observations; written findings, not an endoscopic image\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Central depression\",\"Peripheral biopsy\"],\"cells\":[[\"A sharply outlined central patch has no recognizable gland openings; its surface remains amorphous after washing and dye application.\"],[\"The outside forceps sample came from the raised outer edge. It contains adenomatous mucosa; submucosa is not represented.\"]]},\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.sample-surgical.20261112.v1\",\"label\":\"Targeted sampling and colorectal-surgery evaluation\",\"isCorrect\":true,\"rationale\":\"The central nonstructural pattern raises deep-invasion concern, which the peripheral mucosal biopsy cannot settle. Sample that focus and seek surgical assessment rather than attempt endoscopic clearance.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1\",\"label\":\"En-bloc endoscopic resection and specimen assessment\",\"isCorrect\":false,\"rationale\":\"An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1\",\"label\":\"Piecemeal endoscopic resection and fragment assessment\",\"isCorrect\":false,\"rationale\":\"The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.\",\"serviceRequest\":null}],\"explanation\":\"The central pit pattern is concerning for deep invasion; the outside biopsy examined a different, superficial region. Obtain tissue from the concerning focus and arrange surgical evaluation. En-bloc endoscopic treatment addresses selected superficial disease; piecemeal removal would further impair assessment. No histology result or colectomy occurs in this consult.\",\"sourceLabels\":[\"AMS colonic-polyp guidance (2022)\",\"BSG/ACPGBI large nonpedunculated polyp guideline (2015)\",\"ACPGBI malignant-polyp position statement (2013)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded decision and feedback; this consult does not execute a procedure or simulate a clinical outcome.\",\"clinicalRationale\":\"An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.\",\"sourceLabels\":[\"AMS colonic-polyp guidance (2022)\",\"BSG/ACPGBI large nonpedunculated polyp guideline (2015)\",\"ACPGBI malignant-polyp position statement (2013)\"]},{\"answerChoiceId\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded decision and feedback; this consult does not execute a procedure or simulate a clinical outcome.\",\"clinicalRationale\":\"The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.\",\"sourceLabels\":[\"AMS colonic-polyp guidance (2022)\",\"BSG/ACPGBI large nonpedunculated polyp guideline (2015)\",\"ACPGBI malignant-polyp position statement (2013)\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1\",\"displayName\":\"Colonoscopy\",\"patientDisplayName\":\"Nora Bennett\",\"patientPresentationVariantId\":\"presentation.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":63,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy\",\"presentation\":\"{patientName}, a 63-year-old woman, is undergoing colonoscopy in the clinic's endoscopy room to reassess a 24-mm nonpedunculated descending-colon lesion sampled at an outside examination.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":63,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy\",\"presentation\":\"{patientName}, a 63-year-old woman, is undergoing colonoscopy in the clinic's endoscopy room to reassess a 24-mm nonpedunculated descending-colon lesion sampled at an outside examination.\"}],\"releasePointId\":\"release.l2.endoscopy\",\"earliestFacilityStage\":2,\"tutorialEligible\":false,\"routineEligible\":false,\"requiredClinicalSetting\":\"endoscopy\",\"requiredCapabilityIds\":[\"capability.endoscopy\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"AMS colonic-polyp guidance (2022)\",\"BSG/ACPGBI large nonpedunculated polyp guideline (2015)\",\"ACPGBI malignant-polyp position statement (2013)\"],\"decisionNodes\":[{\"id\":\"node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1\",\"questionVariantId\":\"question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1\",\"primaryConceptId\":\"concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1\",\"currentUpdate\":\"After washing, the endoscopist uses magnifying dye chromoendoscopy to inspect the lesion.\",\"stem\":\"During {patientName}'s descending-colon colonoscopy, which plan best fits the combined surface and biopsy findings?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed procedure and pathology observations; written findings, not an endoscopic image\",\"columnHeaders\":[\"Recorded observation\"],\"rowHeaders\":[\"Central depression\",\"Peripheral biopsy\"],\"cells\":[[\"A sharply outlined central patch has no recognizable gland openings; its surface remains amorphous after washing and dye application.\"],[\"The outside forceps sample came from the raised outer edge. It contains adenomatous mucosa; submucosa is not represented.\"]]},\"shuffleAnswers\":true,\"answerChoices\":[{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.sample-surgical.20261112.v1\",\"label\":\"Targeted sampling and colorectal-surgery evaluation\",\"isCorrect\":true,\"rationale\":\"The central nonstructural pattern raises deep-invasion concern, which the peripheral mucosal biopsy cannot settle. Sample that focus and seek surgical assessment rather than attempt endoscopic clearance.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1\",\"label\":\"En-bloc endoscopic resection and specimen assessment\",\"isCorrect\":false,\"rationale\":\"An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1\",\"label\":\"Piecemeal endoscopic resection and fragment assessment\",\"isCorrect\":false,\"rationale\":\"The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.\",\"serviceRequest\":null}],\"explanation\":\"The central pit pattern is concerning for deep invasion; the outside biopsy examined a different, superficial region. Obtain tissue from the concerning focus and arrange surgical evaluation. En-bloc endoscopic treatment addresses selected superficial disease; piecemeal removal would further impair assessment. No histology result or colectomy occurs in this consult.\",\"sourceLabels\":[\"AMS colonic-polyp guidance (2022)\",\"BSG/ACPGBI large nonpedunculated polyp guideline (2015)\",\"ACPGBI malignant-polyp position statement (2013)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded decision and feedback; this consult does not execute a procedure or simulate a clinical outcome.\",\"clinicalRationale\":\"An intact endoscopic resection is useful when suspected invasion is superficial. The amorphous central focus raises a different depth concern; an adenomatous peripheral sample does not justify crossing that boundary.\",\"sourceLabels\":[\"AMS colonic-polyp guidance (2022)\",\"BSG/ACPGBI large nonpedunculated polyp guideline (2015)\",\"ACPGBI malignant-polyp position statement (2013)\"]},{\"answerChoiceId\":\"choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the recorded decision and feedback; this consult does not execute a procedure or simulate a clinical outcome.\",\"clinicalRationale\":\"The superficial sample does not characterize the central focus. Fragmenting a lesion with this optical concern also compromises the pathological assessment needed to guide further care.\",\"sourceLabels\":[\"AMS colonic-polyp guidance (2022)\",\"BSG/ACPGBI large nonpedunculated polyp guideline (2015)\",\"ACPGBI malignant-polyp position statement (2013)\"]}]}],\"learningSummary\":\"The central pit pattern is concerning for deep invasion; the outside biopsy examined a different, superficial region. Obtain tissue from the concerning focus and arrange surgical evaluation. En-bloc endoscopic treatment addresses selected superficial disease; piecemeal removal would further impair assessment. No histology result or colectomy occurs in this consult.\"}",
    "sourceQuestionSha256": "98791236dba3a855ce85c7c484444147c257cff0f9e39a9d6d6c050b98641e47",
    "sourceNodeSha256": "7c27a159f2b5cbdebf0795c90cc4dc698d39697fbb51ce5f2563cd874fe763ac",
    "sourceCaseSha256": "3dc06571a28f8c6381d97fe96aaad9443f16421f4e08dc8cb317fc25857fae35",
    "acceptedQuestionSha256": "98791236dba3a855ce85c7c484444147c257cff0f9e39a9d6d6c050b98641e47",
    "acceptedNodeSha256": "7c27a159f2b5cbdebf0795c90cc4dc698d39697fbb51ce5f2563cd874fe763ac",
    "acceptedCaseSha256": "8e4eb22e0426b31ceed70f028360dbb3d4c5c033d49a327af591d82914c067fd",
    "review": {
      "path": "docs/research/question-intraop-suspicious-polyps-retrieval-and-tattoo-review2-20261112.json",
      "record": {
        "id": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
        "nodeId": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
        "title": "Suspicious central surface despite a peripheral adenoma biopsy",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "highYield": true,
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Reviewed the current candidate presentation, update, written exhibit, task, options and explanation independently of the author verdict and review-only key. Targeted sampling and colorectal-surgery evaluation is the single best offered plan: the persistent central nonstructural surface is concerning for deep invasion, and a peripheral mucosal biopsy does not settle the central or deeper pathology.",
          "Two consequential steps are present: interpret the optical observation while recognizing the anatomical limits of the outside sample, then choose referral and targeted sampling rather than attempted endoscopic clearance. En-bloc resection is a credible alternative for a different depth assessment; piecemeal resection represents overreliance on the sampled adenoma. The item is moderate, not hard, because the optical description is relatively characteristic.",
          "No material nonmedical cue was identified. The absence of recognizable gland openings and the statement that submucosa is not represented are necessary observations, not diagnosis labels or gratuitous option-eliminating negatives. The referral option differs from the two resection options because management route is the actual decision; that distinction does not establish the answer without interpreting the findings.",
          "The adult live ASC endoscopy scene and chronology are plausible: outside sampling precedes current magnifying dye inspection; surgical evaluation is a later referral, not an implied local colectomy. The decisive findings are explicitly visible as written observations. This assesses interpretation of a reported appearance, not direct endoscopic image recognition. Availability of magnification equipment is an integration requirement rather than a demonstrated runtime fact.",
          "Nora Bennett's age, sex and procedure context are consistent. The task specifies patient, site, procedure and requested plan. This is a standalone node with no later scored part or prior feedback supplying its answer. High yield refers qualitatively to suspicious colorectal lesion management and biopsy limitations, not verified examination frequency.",
          "No confident clinical inaccuracy identified. Optical concern is appropriately distinguished from final histological staging. This offline editorial review does not establish current guideline verification, validate runtime wait displays, or grant clinical approval; the content remains needs_clinician_review.",
          "Scope note: the candidate packet contains three executable standalone nodes, including this preserved candidate. The 42 legacy keep records, three held planning records and withdrawn unscored orientation attempt were noted and excluded from scored review; their author dispositions were not used as evidence for these verdicts."
        ],
        "suggestions": [
          "Preserve the clinical distinction between central optical findings and the site/layers sampled by the outside biopsy; do not remove these observations to reduce apparent cueing.",
          "For future authorized presentation polish, shorten 'descending-colon colonoscopy' to 'colonoscopy' while retaining the lesion site elsewhere in the complete task. This is not a blocking clarity defect and does not warrant altering a frozen version.",
          "Keep 'No histology result or colectomy occurs in this consult' in authoring/runtime documentation rather than clinical teaching feedback when a future version is authorized. Preserve the clinical explanation itself."
        ]
      }
    }
  },
  {
    "group": "salvage",
    "slug": "anesthetic-intraoperative-crises",
    "caseId": "case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1",
    "nodeId": "node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop-anesthetic-intraoperative-crises.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1\",\"conceptId\":\"concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1\",\"stem\":\"During {patientName}'s paused hernia repair, which ongoing IV vasoactive plan best fits the response at this reassessment while fluid resuscitation and emergency transfer arrangements continue?\",\"explanation\":\"The response recurs but does not last. Establish a monitored, titrated epinephrine infusion while continuing volume resuscitation. Boluses can bridge preparation; a second vasopressor becomes relevant if shock persists despite the infusion and fluids.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.i11.epi-fluid\",\"claim.intraop.i11.epi-infusion\",\"claim.intraop.i11.second-vasopressor\"],\"answerChoices\":[{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.epinephrine-infusion.v1\",\"label\":\"Use continuous epinephrine\",\"isCorrect\":true,\"rationale\":\"Repeated transient responses with recurrent poor perfusion support a titrated epinephrine infusion while fluid resuscitation and monitoring continue.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.boluses.v1\",\"label\":\"Use intermittent epinephrine\",\"isCorrect\":false,\"rationale\":\"Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.\",\"distractorRationale\":\"Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.\"},{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.norepinephrine.v1\",\"label\":\"Use norepinephrine infusion\",\"isCorrect\":false,\"rationale\":\"A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.\",\"distractorRationale\":\"A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1\",\"questionVariantId\":\"question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1\",\"primaryConceptId\":\"concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1\",\"currentUpdate\":\"The anesthetist has given titrated IV epinephrine boluses and crystalloid. Each bolus briefly restores blood pressure and pulse volume; both fall again between boluses. Wheezing eases. A pulse remains present, and monitored airway support continues.\",\"stem\":\"During {patientName}'s paused hernia repair, which ongoing IV vasoactive plan best fits the response at this reassessment while fluid resuscitation and emergency transfer arrangements continue?\",\"answerChoices\":[{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.epinephrine-infusion.v1\",\"label\":\"Use continuous epinephrine\",\"isCorrect\":true,\"rationale\":\"Repeated transient responses with recurrent poor perfusion support a titrated epinephrine infusion while fluid resuscitation and monitoring continue.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.boluses.v1\",\"label\":\"Use intermittent epinephrine\",\"isCorrect\":false,\"rationale\":\"Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.norepinephrine.v1\",\"label\":\"Use norepinephrine infusion\",\"isCorrect\":false,\"rationale\":\"A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The response recurs but does not last. Establish a monitored, titrated epinephrine infusion while continuing volume resuscitation. Boluses can bridge preparation; a second vasopressor becomes relevant if shock persists despite the infusion and fluids.\",\"sourceLabels\":[\"Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists\",\"Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.i11.anaphylaxis-infusion.boluses.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or rescue intervention is executed by this consult.\",\"clinicalRationale\":\"Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.\",\"sourceLabels\":[\"Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists\",\"Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I\"]},{\"answerChoiceId\":\"choice.intraop.i11.anaphylaxis-infusion.norepinephrine.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or rescue intervention is executed by this consult.\",\"clinicalRationale\":\"A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.\",\"sourceLabels\":[\"Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists\",\"Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1\",\"displayName\":\"ASC procedure: Monica Hale\",\"patientPresentationVariantId\":\"presentation.intraop.i11.anaphylaxis-response-salvage.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Monica Hale\",\"prototypeDemographics\":{\"ageYears\":39,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"{patientName}, a 39-year-old woman, is in the clinic's ASC OR during paused open inguinal hernia repair after airway and circulatory deterioration following cefazolin at induction. Airway support, crystalloid resuscitation and emergency transfer arrangements continue.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.i11.anaphylaxis-response-salvage.v1\",\"prototypeDemographics\":{\"ageYears\":39,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Hernia repair\",\"presentation\":\"{patientName}, a 39-year-old woman, is in the clinic's ASC OR during paused open inguinal hernia repair after airway and circulatory deterioration following cefazolin at induction. Airway support, crystalloid resuscitation and emergency transfer arrangements continue.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists\",\"Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I\"],\"decisionNodes\":[{\"id\":\"node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1\",\"questionVariantId\":\"question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1\",\"primaryConceptId\":\"concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1\",\"currentUpdate\":\"The anesthetist has given titrated IV epinephrine boluses and crystalloid. Each bolus briefly restores blood pressure and pulse volume; both fall again between boluses. Wheezing eases. A pulse remains present, and monitored airway support continues.\",\"stem\":\"During {patientName}'s paused hernia repair, which ongoing IV vasoactive plan best fits the response at this reassessment while fluid resuscitation and emergency transfer arrangements continue?\",\"answerChoices\":[{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.epinephrine-infusion.v1\",\"label\":\"Use continuous epinephrine\",\"isCorrect\":true,\"rationale\":\"Repeated transient responses with recurrent poor perfusion support a titrated epinephrine infusion while fluid resuscitation and monitoring continue.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.boluses.v1\",\"label\":\"Use intermittent epinephrine\",\"isCorrect\":false,\"rationale\":\"Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.i11.anaphylaxis-infusion.norepinephrine.v1\",\"label\":\"Use norepinephrine infusion\",\"isCorrect\":false,\"rationale\":\"A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The response recurs but does not last. Establish a monitored, titrated epinephrine infusion while continuing volume resuscitation. Boluses can bridge preparation; a second vasopressor becomes relevant if shock persists despite the infusion and fluids.\",\"sourceLabels\":[\"Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists\",\"Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.i11.anaphylaxis-infusion.boluses.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or rescue intervention is executed by this consult.\",\"clinicalRationale\":\"Boluses remain useful while an infusion is prepared, but repeatedly recurring compromise makes bolus-only delivery a less suitable ongoing strategy.\",\"sourceLabels\":[\"Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists\",\"Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I\"]},{\"answerChoiceId\":\"choice.intraop.i11.anaphylaxis-infusion.norepinephrine.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or rescue intervention is executed by this consult.\",\"clinicalRationale\":\"A second vasopressor is an escalation for shock persisting despite epinephrine infusion and fluids. The transient epinephrine responses here support establishing its sustained delivery first.\",\"sourceLabels\":[\"Peri-operative anaphylaxis: algorithm for anaesthetists/intensivists\",\"Update on perioperative hypersensitivity reactions: joint SBA/ASBAI document, Part I\"]}]}],\"learningSummary\":\"The response recurs but does not last. Establish a monitored, titrated epinephrine infusion while continuing volume resuscitation. Boluses can bridge preparation; a second vasopressor becomes relevant if shock persists despite the infusion and fluids.\"}",
    "sourceQuestionSha256": "bef39d4e83a386067b7356eba870d3c23dad5ff1e113dc7041e80a8e9855ef84",
    "sourceNodeSha256": "3016b47c1bf77ad6df154c23a1144e2d93f156d34388c24bc5d02d7919b6ffd6",
    "sourceCaseSha256": "a54228c0b7418147a762d62a12fb1a96be9a501552bd5ac2a4a971f1ea0dc98a",
    "acceptedQuestionSha256": "bef39d4e83a386067b7356eba870d3c23dad5ff1e113dc7041e80a8e9855ef84",
    "acceptedNodeSha256": "3016b47c1bf77ad6df154c23a1144e2d93f156d34388c24bc5d02d7919b6ffd6",
    "acceptedCaseSha256": "5c142d2d71182a395a076566fc4cca794305f7eb12ace9adc0c19c797dd683c4",
    "review": {
      "path": "docs/research/question-intraop-salvage-review-20261113.json",
      "record": {
        "caseId": "case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1",
        "nodeId": "node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The standalone presentation supplies the cefazolin exposure, airway/circulatory deterioration, paused hernia repair and ongoing support. The update supplies completed epinephrine boluses, transient improvement, recurrent poor perfusion and a persisting pulse. Selecting the ongoing delivery strategy requires no earlier question or feedback.",
          "The added context does not name an infusion or explain why sustained delivery is preferred. The response-and-relapse observations are necessary decision evidence, not an added answer cue.",
          "A 39-year-old woman undergoing open hernia repair in an ASC OR, with stabilization and emergency transfer arrangements underway, is a coherent scene for this checkpoint.",
          "The retained node matches the recorded source-node hash and has no field changes. The review2 PASS is present and its file hash matches the receipt. The key remains Use continuous epinephrine.",
          "This review assesses standalone context and preservation against local artifacts only. It does not revalidate medical sources, grant clinical approval or change needs_clinician_review status; that scope applies to all nine verdicts."
        ],
        "suggestions": []
      }
    }
  },
  {
    "group": "salvage",
    "slug": "endoscopic-upper-gi-hemostasis",
    "caseId": "case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1",
    "nodeId": "node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "questionVariantId": "question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1\",\"conceptId\":\"concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1\",\"stem\":\"At the initial treatment checkpoint in {patientName}'s hospital EGD, which endoscopic modality should be selected for the implicated source?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed outside endoscopy record; findings available before treatment\",\"columnHeaders\":[\"Recorded appearance\"],\"rowHeaders\":[\"Distal esophagus\",\"Gastroesophageal junction\",\"Fundus\"],\"cells\":[[\"Longitudinal blue submucosal columns. A small white peg projects from one column, with red blood coating its base.\"],[\"A short linear mucosal split is dry, with a flat brown mark at its edge.\"],[\"Rounded blue submucosal veins have intact surfaces. Old blood pools below them.\"]]},\"explanation\":\"The white projection with blood at its base is a recent-hemorrhage plug on an esophageal varix. The dry mucosal split and intact fundal veins are competing findings. Select band ligation for the implicated esophageal source; injection sclerotherapy is a fallback when ligation is not feasible.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.upper-gi-hemostasis.variceal-plug-source\",\"claim.intraop.upper-gi-hemostasis.esophageal-band-treatment\",\"claim.intraop.upper-gi-hemostasis.fundal-treatment-boundary\",\"claim.intraop.upper-gi-hemostasis.hospital-background\"],\"answerChoices\":[{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.band.20261112.v1\",\"label\":\"Endoscopic band ligation\",\"isCorrect\":true,\"rationale\":\"The projecting plug on an esophageal column identifies recent variceal hemorrhage. Band ligation is the preferred initial endoscopic treatment for that source.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.sclerosant.20261112.v1\",\"label\":\"Endoscopic injection sclerotherapy\",\"isCorrect\":false,\"rationale\":\"Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.\",\"distractorRationale\":\"Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.\"},{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.glue.20261112.v1\",\"label\":\"Endoscopic cyanoacrylate injection\",\"isCorrect\":false,\"rationale\":\"Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.\",\"distractorRationale\":\"Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1\",\"questionVariantId\":\"question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1\",\"primaryConceptId\":\"concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1\",\"currentUpdate\":\"The hospital record shows lavage and source inspection after initial stabilization. Vasoactive and antibacterial treatment are underway.\",\"stem\":\"At the initial treatment checkpoint in {patientName}'s hospital EGD, which endoscopic modality should be selected for the implicated source?\",\"answerChoices\":[{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.band.20261112.v1\",\"label\":\"Endoscopic band ligation\",\"isCorrect\":true,\"rationale\":\"The projecting plug on an esophageal column identifies recent variceal hemorrhage. Band ligation is the preferred initial endoscopic treatment for that source.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.sclerosant.20261112.v1\",\"label\":\"Endoscopic injection sclerotherapy\",\"isCorrect\":false,\"rationale\":\"Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.glue.20261112.v1\",\"label\":\"Endoscopic cyanoacrylate injection\",\"isCorrect\":false,\"rationale\":\"Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The white projection with blood at its base is a recent-hemorrhage plug on an esophageal varix. The dry mucosal split and intact fundal veins are competing findings. Select band ligation for the implicated esophageal source; injection sclerotherapy is a fallback when ligation is not feasible.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed outside endoscopy record; findings available before treatment\",\"columnHeaders\":[\"Recorded appearance\"],\"rowHeaders\":[\"Distal esophagus\",\"Gastroesophageal junction\",\"Fundus\"],\"cells\":[[\"Longitudinal blue submucosal columns. A small white peg projects from one column, with red blood coating its base.\"],[\"A short linear mucosal split is dry, with a flat brown mark at its edge.\"],[\"Rounded blue submucosal veins have intact surfaces. Old blood pools below them.\"]]},\"sourceLabels\":[\"ESGE esophagogastric variceal hemorrhage guideline (2022)\",\"KASL varices guideline (2020)\",\"BSG portal hypertension position statement (2026)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.sclerosant.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.\",\"sourceLabels\":[\"ESGE esophagogastric variceal hemorrhage guideline (2022)\",\"KASL varices guideline (2020)\",\"BSG portal hypertension position statement (2026)\"]},{\"answerChoiceId\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.glue.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.\",\"sourceLabels\":[\"ESGE esophagogastric variceal hemorrhage guideline (2022)\",\"KASL varices guideline (2020)\",\"BSG portal hypertension position statement (2026)\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1\",\"displayName\":\"Bleeding record review\",\"patientPresentationVariantId\":\"presentation.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1\",\"releasePointId\":\"release.l2.endoscopy\",\"patientDisplayName\":\"Marcus Bell\",\"prototypeDemographics\":{\"ageYears\":59,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Bleeding record review\",\"presentation\":\"{patientName}, a 59-year-old man with cirrhosis, attends clinic to review an outside hospital EGD record from an admission for hematemesis. The displayed checkpoint is from that hospital procedure; his current clinic visit is stable.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1\",\"prototypeDemographics\":{\"ageYears\":59,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Bleeding record review\",\"presentation\":\"{patientName}, a 59-year-old man with cirrhosis, attends clinic to review an outside hospital EGD record from an admission for hematemesis. The displayed checkpoint is from that hospital procedure; his current clinic visit is stable.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"ESGE esophagogastric variceal hemorrhage guideline (2022)\",\"KASL varices guideline (2020)\",\"BSG portal hypertension position statement (2026)\"],\"decisionNodes\":[{\"id\":\"node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1\",\"questionVariantId\":\"question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1\",\"primaryConceptId\":\"concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1\",\"currentUpdate\":\"The hospital record shows lavage and source inspection after initial stabilization. Vasoactive and antibacterial treatment are underway.\",\"stem\":\"At the initial treatment checkpoint in {patientName}'s hospital EGD, which endoscopic modality should be selected for the implicated source?\",\"answerChoices\":[{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.band.20261112.v1\",\"label\":\"Endoscopic band ligation\",\"isCorrect\":true,\"rationale\":\"The projecting plug on an esophageal column identifies recent variceal hemorrhage. Band ligation is the preferred initial endoscopic treatment for that source.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.sclerosant.20261112.v1\",\"label\":\"Endoscopic injection sclerotherapy\",\"isCorrect\":false,\"rationale\":\"Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.glue.20261112.v1\",\"label\":\"Endoscopic cyanoacrylate injection\",\"isCorrect\":false,\"rationale\":\"Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The white projection with blood at its base is a recent-hemorrhage plug on an esophageal varix. The dry mucosal split and intact fundal veins are competing findings. Select band ligation for the implicated esophageal source; injection sclerotherapy is a fallback when ligation is not feasible.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed outside endoscopy record; findings available before treatment\",\"columnHeaders\":[\"Recorded appearance\"],\"rowHeaders\":[\"Distal esophagus\",\"Gastroesophageal junction\",\"Fundus\"],\"cells\":[[\"Longitudinal blue submucosal columns. A small white peg projects from one column, with red blood coating its base.\"],[\"A short linear mucosal split is dry, with a flat brown mark at its edge.\"],[\"Rounded blue submucosal veins have intact surfaces. Old blood pools below them.\"]]},\"sourceLabels\":[\"ESGE esophagogastric variceal hemorrhage guideline (2022)\",\"KASL varices guideline (2020)\",\"BSG portal hypertension position statement (2026)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.sclerosant.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Sclerotherapy can treat esophageal varices, but ligation is favored initially when feasible because its overall outcomes and adverse-event profile are better supported.\",\"sourceLabels\":[\"ESGE esophagogastric variceal hemorrhage guideline (2022)\",\"KASL varices guideline (2020)\",\"BSG portal hypertension position statement (2026)\"]},{\"answerChoiceId\":\"choice.intraop.upper-gi-hemostasis.esophageal-plug-treatment.glue.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Cyanoacrylate is an established therapy for cardiofundal variceal bleeding. Blood pooled below intact fundal veins does not outweigh a recent-hemorrhage plug on the esophageal column.\",\"sourceLabels\":[\"ESGE esophagogastric variceal hemorrhage guideline (2022)\",\"KASL varices guideline (2020)\",\"BSG portal hypertension position statement (2026)\"]}]}],\"learningSummary\":\"The white projection with blood at its base is a recent-hemorrhage plug on an esophageal varix. The dry mucosal split and intact fundal veins are competing findings. Select band ligation for the implicated esophageal source; injection sclerotherapy is a fallback when ligation is not feasible.\"}",
    "sourceQuestionSha256": "15e16654648a147a46e9b5780c5dfc77ea61f4db235bb4e01ed4d09381784ca9",
    "sourceNodeSha256": "f2f50c9309b9352183cebc7fd158db8e047fe8d0209955e162c7f1c178f9b301",
    "sourceCaseSha256": "91bc224ed5a8de330abdba395d289732e1a6a167cfc88080324a8ad7884ecaec",
    "acceptedQuestionSha256": "15e16654648a147a46e9b5780c5dfc77ea61f4db235bb4e01ed4d09381784ca9",
    "acceptedNodeSha256": "f2f50c9309b9352183cebc7fd158db8e047fe8d0209955e162c7f1c178f9b301",
    "acceptedCaseSha256": "964c3ef7d17ec34b34a74653242524952e652d9b1c37e4b990c1e2863666c9bb",
    "review": {
      "path": "docs/research/question-intraop-salvage-review-20261113.json",
      "record": {
        "caseId": "case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1",
        "nodeId": "node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The presentation explicitly separates today's stable clinic visit from the historical hospital EGD for hematemesis. The update establishes stabilization and concurrent treatment; the exhibit supplies the esophageal projection, dry junctional split and intact fundal veins before treatment. No later rescue history is needed.",
          "Cirrhosis and hematemesis supply appropriate background without identifying the implicated source or naming band ligation. The competing observed lesions remain available for interpretation.",
          "The acute bleeding checkpoint remains in a hospital procedure record, rather than being relocated to a routine clinic endoscopy. Age, sex and temporal setting are explicit.",
          "Only terminal no-outcome metadata differs from the hash-matched source node. The review2 PASS is verified and the initial-modality decision and key, Endoscopic band ligation, are unchanged."
        ],
        "suggestions": []
      }
    }
  },
  {
    "group": "salvage",
    "slug": "pediatric-anesthesia-events",
    "caseId": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1",
    "nodeId": "node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "questionVariantId": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1\",\"conceptId\":\"concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1\",\"stem\":\"Which rescue drug should the anesthesia team administer now for Ava Bennett during the EGD?\",\"shuffleAnswers\":true,\"explanation\":\"The persistent inspiratory effort without airflow after initial measures supports severe laryngospasm. IV succinylcholine provides neuromuscular relaxation for this emergency; the team must restore ventilation and secure the airway as needed.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.pediatric-anesthesia-events.laryngeal-pattern.v1\",\"claim.intraop.pediatric-anesthesia-events.airway-stimulation.v1\",\"claim.intraop.pediatric-anesthesia-events.initial-laryngospasm.v1\",\"claim.intraop.pediatric-anesthesia-events.laryngospasm-escalation.v1\",\"claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1\",\"claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1\"],\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.relax-airway.v1\",\"label\":\"Administer intravenous succinylcholine\",\"isCorrect\":true,\"rationale\":\"Persistent functional closure after initial measures calls for neuromuscular relaxation while airway rescue continues.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.deepen-mask.v1\",\"label\":\"Administer intravenous epinephrine\",\"isCorrect\":false,\"rationale\":\"Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.\",\"distractorRationale\":\"Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.\"},{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.bronchodilate-mask.v1\",\"label\":\"Administer inhaled albuterol\",\"isCorrect\":false,\"rationale\":\"Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.\",\"distractorRationale\":\"Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1\",\"questionVariantId\":\"question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1\",\"primaryConceptId\":\"concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1\",\"currentUpdate\":\"During scope withdrawal, Ava develops noisy inspiratory effort that becomes silent, with opposite chest and abdominal movement and loss of the carbon-dioxide trace. The endoscope is removed and stimulation stops. Repositioning, two-person facemask oxygenation with positive pressure, and IV propofol have not restored air movement. Inspiratory effort persists as oxygen saturation falls; the team continues oxygenation maneuvers.\",\"stem\":\"Which rescue drug should the anesthesia team administer now for Ava Bennett during the EGD?\",\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.relax-airway.v1\",\"label\":\"Administer intravenous succinylcholine\",\"isCorrect\":true,\"rationale\":\"Persistent functional closure after initial measures calls for neuromuscular relaxation while airway rescue continues.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.deepen-mask.v1\",\"label\":\"Administer intravenous epinephrine\",\"isCorrect\":false,\"rationale\":\"Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.bronchodilate-mask.v1\",\"label\":\"Administer inhaled albuterol\",\"isCorrect\":false,\"rationale\":\"Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The persistent inspiratory effort without airflow after initial measures supports severe laryngospasm. IV succinylcholine provides neuromuscular relaxation for this emergency; the team must restore ventilation and secure the airway as needed.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"RCH CICO airway emergency guideline: laryngospasm appendix\",\"Extubation and removal of supraglottic airway devices in pediatric anesthesia\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.deepen-mask.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"RCH CICO airway emergency guideline: laryngospasm appendix\",\"Extubation and removal of supraglottic airway devices in pediatric anesthesia\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\"]},{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.bronchodilate-mask.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"RCH CICO airway emergency guideline: laryngospasm appendix\",\"Extubation and removal of supraglottic airway devices in pediatric anesthesia\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1\",\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"displayName\":\"Pediatric live EGD: airway closure and lung reassessment\",\"patientPresentationVariantId\":\"presentation.intraop.pediatric-anesthesia-events.ava7.v1\",\"releasePointId\":\"release.l4.pediatrics\",\"patientDisplayName\":\"Ava Bennett\",\"prototypeDemographics\":{\"ageYears\":7,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Upper endoscopy\",\"presentation\":\"Ava Bennett, a 7-year-old girl, is in the clinic's ASC endoscopy room, where diagnostic EGD is underway using IV anesthesia and spontaneous breathing through a natural airway. Her mother, Maya Bennett, joined preparation for consent and an explanation Ava could understand and is waiting onsite for updates.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.pediatric-anesthesia-events.ava7.v1\",\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"prototypeDemographics\":{\"ageYears\":7,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Upper endoscopy\",\"presentation\":\"Ava Bennett, a 7-year-old girl, is in the clinic's ASC endoscopy room, where diagnostic EGD is underway using IV anesthesia and spontaneous breathing through a natural airway. Her mother, Maya Bennett, joined preparation for consent and an explanation Ava could understand and is waiting onsite for updates.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":4,\"requiredClinicalSetting\":\"endoscopy\",\"requiredCapabilityIds\":[\"capability.pediatric_examination\",\"capability.endoscopy\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"RCH CICO airway emergency guideline: laryngospasm appendix\",\"Extubation and removal of supraglottic airway devices in pediatric anesthesia\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\"],\"decisionNodes\":[{\"id\":\"node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1\",\"questionVariantId\":\"question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1\",\"primaryConceptId\":\"concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1\",\"currentUpdate\":\"During scope withdrawal, Ava develops noisy inspiratory effort that becomes silent, with opposite chest and abdominal movement and loss of the carbon-dioxide trace. The endoscope is removed and stimulation stops. Repositioning, two-person facemask oxygenation with positive pressure, and IV propofol have not restored air movement. Inspiratory effort persists as oxygen saturation falls; the team continues oxygenation maneuvers.\",\"stem\":\"Which rescue drug should the anesthesia team administer now for Ava Bennett during the EGD?\",\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.relax-airway.v1\",\"label\":\"Administer intravenous succinylcholine\",\"isCorrect\":true,\"rationale\":\"Persistent functional closure after initial measures calls for neuromuscular relaxation while airway rescue continues.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.deepen-mask.v1\",\"label\":\"Administer intravenous epinephrine\",\"isCorrect\":false,\"rationale\":\"Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.bronchodilate-mask.v1\",\"label\":\"Administer inhaled albuterol\",\"isCorrect\":false,\"rationale\":\"Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The persistent inspiratory effort without airflow after initial measures supports severe laryngospasm. IV succinylcholine provides neuromuscular relaxation for this emergency; the team must restore ventilation and secure the airway as needed.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"RCH CICO airway emergency guideline: laryngospasm appendix\",\"Extubation and removal of supraglottic airway devices in pediatric anesthesia\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.deepen-mask.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Systemic epinephrine can be appropriate for severe lower-airway bronchoconstriction or systemic hypersensitivity. It does not directly relax the sustained glottic closure described here.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"RCH CICO airway emergency guideline: laryngospasm appendix\",\"Extubation and removal of supraglottic airway devices in pediatric anesthesia\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\"]},{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.bronchodilate-mask.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Albuterol targets lower-airway bronchoconstriction; the ongoing inspiratory effort without airflow after airway maneuvers instead supports sustained upper-airway closure.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"RCH CICO airway emergency guideline: laryngospasm appendix\",\"Extubation and removal of supraglottic airway devices in pediatric anesthesia\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\"]}]}],\"learningSummary\":\"The persistent inspiratory effort without airflow after initial measures supports severe laryngospasm. IV succinylcholine provides neuromuscular relaxation for this emergency; the team must restore ventilation and secure the airway as needed.\"}",
    "sourceQuestionSha256": "4476b91a3f193895b0e00f4831c69a1cf983b7cc7e9bb469ee6c591e615621dd",
    "sourceNodeSha256": "8973b88c47eff0166c14945739f919967b8212a455132d69219501e30018b04d",
    "sourceCaseSha256": "bb28d1535fed059a98d21bc400eb4f85c3df3931f16e49ec3a83efa178f8ad72",
    "acceptedQuestionSha256": "e5fb9041cf1b91065e2abe4dcda301b8830a745ee2f02e64cd01ff7cccc3e81d",
    "acceptedNodeSha256": "972aee52a00ae933a162189798725e9093afcece6c82a263b8298b8a57e52c57",
    "acceptedCaseSha256": "d6c21bf2863128c21c897cac7d7bb6c837eec2917df820cce6e6bec4515da22b",
    "review": {
      "path": "docs/research/question-intraop-salvage-review-20261113.json",
      "record": {
        "caseId": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1",
        "nodeId": "node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The starting natural airway and IV anesthetic are explicit. Scope withdrawal, scope removal, stopped stimulation, failed positioning/positive-pressure oxygenation/propofol, persistent inspiratory effort and falling saturation establish the rescue checkpoint without the removed later pulmonary-support question.",
          "The wrapper does not name laryngospasm, neuromuscular relaxation or the keyed drug. The completed failed measures are necessary escalation context.",
          "Ava is explicitly a 7-year-old girl in an ASC endoscopy room. Maya Bennett participated in preparation and consent and remains onsite for updates. This satisfies the pediatric age and parent-presence requirements without placing the parent in the rescue field.",
          "The current original r1 node's task, update, explanation and every choice ID, label, correctness flag and rationale match the salvage node. The review2 PASS and file hash are verified. The key remains Administer intravenous succinylcholine."
        ],
        "suggestions": []
      }
    }
  },
  {
    "group": "salvage",
    "slug": "pediatric-anesthesia-events",
    "caseId": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1",
    "nodeId": "node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "questionVariantId": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1\",\"conceptId\":\"concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1\",\"stem\":\"Which medication is the first priority to relieve Noah Reed's current airflow limitation during inguinal hernia repair?\",\"shuffleAnswers\":true,\"explanation\":\"Prioritize inhaled albuterol for the current bronchoconstriction after the mechanical airway check. Ipratropium is an adjunct rather than a replacement first bronchodilator. Systemic escalation depends on severity, response and effective delivery; it does not invariably require circulatory collapse.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.pediatric-anesthesia-events.bronchospasm-pattern.v1\",\"claim.intraop.pediatric-anesthesia-events.mechanical-check.v1\",\"claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1\",\"claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1\",\"claim.intraop.pediatric-anesthesia-events.magnesium-role.v1\",\"claim.intraop.pediatric-anesthesia-events.r1.ipratropium-adjunct.v1\"],\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.inhaled-albuterol.v1\",\"label\":\"Administer inhaled albuterol\",\"isCorrect\":true,\"rationale\":\"Effective airflow through a checked airway permits initial inhaled beta-agonist rescue for the current bronchoconstriction.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-epinephrine.v1\",\"label\":\"Administer intravenous epinephrine\",\"isCorrect\":false,\"rationale\":\"Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.\",\"distractorRationale\":\"Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.\"},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-magnesium.v1\",\"label\":\"Administer intravenous magnesium\",\"isCorrect\":false,\"rationale\":\"Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.\",\"distractorRationale\":\"Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.\"},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-dexamethasone.v1\",\"label\":\"Administer inhaled ipratropium\",\"isCorrect\":false,\"rationale\":\"Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.\",\"distractorRationale\":\"Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1\",\"questionVariantId\":\"question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1\",\"primaryConceptId\":\"concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1\",\"currentUpdate\":\"Noah develops increased airway pressure, prolonged expiration and bilateral expiratory wheezing. The tracheal-tube marking is unchanged, a suction catheter passes freely without retrieving secretions, and chest movement is symmetric. Surgery pauses, oxygen and manual ventilation continue, and anesthesia is deepened. Manual ventilation produces bilateral chest rise; oxygenation and arterial pressure remain near their pre-event levels.\",\"stem\":\"Which medication is the first priority to relieve Noah Reed's current airflow limitation during inguinal hernia repair?\",\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.inhaled-albuterol.v1\",\"label\":\"Administer inhaled albuterol\",\"isCorrect\":true,\"rationale\":\"Effective airflow through a checked airway permits initial inhaled beta-agonist rescue for the current bronchoconstriction.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-epinephrine.v1\",\"label\":\"Administer intravenous epinephrine\",\"isCorrect\":false,\"rationale\":\"Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-magnesium.v1\",\"label\":\"Administer intravenous magnesium\",\"isCorrect\":false,\"rationale\":\"Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-dexamethasone.v1\",\"label\":\"Administer inhaled ipratropium\",\"isCorrect\":false,\"rationale\":\"Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Prioritize inhaled albuterol for the current bronchoconstriction after the mechanical airway check. Ipratropium is an adjunct rather than a replacement first bronchodilator. Systemic escalation depends on severity, response and effective delivery; it does not invariably require circulatory collapse.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-epinephrine.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"]},{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-magnesium.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"]},{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-dexamethasone.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1\",\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"displayName\":\"Pediatric live hernia repair: expiratory obstruction\",\"patientPresentationVariantId\":\"presentation.intraop.pediatric-anesthesia-events.noah12.v1\",\"releasePointId\":\"release.l4.pediatrics\",\"patientDisplayName\":\"Noah Reed\",\"prototypeDemographics\":{\"ageYears\":12,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Groin hernia repair\",\"presentation\":\"Noah Reed, a 12-year-old boy, is in the clinic's ASC operating room, where open inguinal hernia repair is underway under general anesthesia with a tracheal tube in place. His father, Daniel Reed, joined preparation for consent and an age-appropriate discussion with Noah and is waiting onsite for updates.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.pediatric-anesthesia-events.noah12.v1\",\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"prototypeDemographics\":{\"ageYears\":12,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Groin hernia repair\",\"presentation\":\"Noah Reed, a 12-year-old boy, is in the clinic's ASC operating room, where open inguinal hernia repair is underway under general anesthesia with a tracheal tube in place. His father, Daniel Reed, joined preparation for consent and an age-appropriate discussion with Noah and is waiting onsite for updates.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":4,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.pediatric_examination\",\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"],\"decisionNodes\":[{\"id\":\"node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1\",\"questionVariantId\":\"question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1\",\"primaryConceptId\":\"concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1\",\"currentUpdate\":\"Noah develops increased airway pressure, prolonged expiration and bilateral expiratory wheezing. The tracheal-tube marking is unchanged, a suction catheter passes freely without retrieving secretions, and chest movement is symmetric. Surgery pauses, oxygen and manual ventilation continue, and anesthesia is deepened. Manual ventilation produces bilateral chest rise; oxygenation and arterial pressure remain near their pre-event levels.\",\"stem\":\"Which medication is the first priority to relieve Noah Reed's current airflow limitation during inguinal hernia repair?\",\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.inhaled-albuterol.v1\",\"label\":\"Administer inhaled albuterol\",\"isCorrect\":true,\"rationale\":\"Effective airflow through a checked airway permits initial inhaled beta-agonist rescue for the current bronchoconstriction.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-epinephrine.v1\",\"label\":\"Administer intravenous epinephrine\",\"isCorrect\":false,\"rationale\":\"Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-magnesium.v1\",\"label\":\"Administer intravenous magnesium\",\"isCorrect\":false,\"rationale\":\"Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-dexamethasone.v1\",\"label\":\"Administer inhaled ipratropium\",\"isCorrect\":false,\"rationale\":\"Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Prioritize inhaled albuterol for the current bronchoconstriction after the mechanical airway check. Ipratropium is an adjunct rather than a replacement first bronchodilator. Systemic escalation depends on severity, response and effective delivery; it does not invariably require circulatory collapse.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-epinephrine.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Epinephrine remains a rescue option for severe or refractory obstruction, ineffective inhaled delivery or systemic hypersensitivity, with or without circulatory collapse. This initial checkpoint still has effective ventilation and preserved oxygenation/perfusion.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"]},{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-magnesium.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Magnesium is an escalation adjunct when conventional bronchodilation is insufficient, rather than a substitute for the first beta-agonist treatment here.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"]},{\"answerChoiceId\":\"choice.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.iv-dexamethasone.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Ipratropium can accompany a beta agonist in more severe pediatric bronchoconstriction; it is not the replacement first bronchodilator for this checkpoint.\",\"sourceLabels\":[\"Pedi Crisis: Critical Events Checklists (January 2025)\",\"Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges\",\"Managing an acute asthma exacerbation in children\"]}]}],\"learningSummary\":\"Prioritize inhaled albuterol for the current bronchoconstriction after the mechanical airway check. Ipratropium is an adjunct rather than a replacement first bronchodilator. Systemic escalation depends on severity, response and effective delivery; it does not invariably require circulatory collapse.\"}",
    "sourceQuestionSha256": "d1aa5c3305a2a4c03f56e7447a4d44cc42f2f5de3433bdae62396fa5147c4850",
    "sourceNodeSha256": "801332cee41dc03b10c0b83c4ac8dab05f10027e9974165b95366b47a4020f2b",
    "sourceCaseSha256": "d24ab3e08e66679405e54e49ac89e381582f7478421416b75c2a82493ecde760",
    "acceptedQuestionSha256": "2f360b4fb7ed0081e61ab773c3fef7950160137924f75064ded69bf74f205da0",
    "acceptedNodeSha256": "c908c3814e9aae61c02a7b53018c0479315fe8bea792020498c04484f9e8fa8c",
    "acceptedCaseSha256": "9d3c88a6803b32a90791ccd6a621c3dbbb6e702dc8bdc237531b9fd1a359e744",
    "review": {
      "path": "docs/research/question-intraop-salvage-review-20261113.json",
      "record": {
        "caseId": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1",
        "nodeId": "node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The tracheal tube, expiratory wheeze, prolonged expiration, completed mechanical checks, deeper anesthesia and effective manual ventilation with preserved oxygenation/pressure are all stated. This first-medication decision is independent of the removed later ventilator-adjustment checkpoint.",
          "The wrapper names neither bronchospasm nor albuterol. Tube and ventilation findings are decision evidence, not added instructions selecting the key.",
          "Noah is a 12-year-old boy undergoing open inguinal hernia repair in the ASC OR. His father Daniel Reed participated in preparation and consent and waits onsite. The procedure, airway and parent arrangement are consistent.",
          "The current original r1 node's task, update, explanation and every choice ID, label, correctness flag and rationale match the salvage node. The review2 PASS and file hash are verified. The key remains Administer inhaled albuterol."
        ],
        "suggestions": []
      }
    }
  },
  {
    "group": "salvage",
    "slug": "pediatric-orchiopexy-findings",
    "caseId": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
    "nodeId": "node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "questionVariantId": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1.r1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1\",\"conceptId\":\"concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1\",\"stem\":\"Which specific maneuver should next address Evan's limited descent during right orchiopexy?\",\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.mobilize.20261112.v1\",\"label\":\"Perform blunt retroperitoneal mobilization of the spermatic vessels\",\"isCorrect\":true,\"rationale\":\"The vessels tent posterior peritoneum while the vas remains mobile. Controlled proximal vascular mobilization addresses that observed attachment with the cord structures identified, rather than dividing an unidentified band or sacrificing the vessels.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fs.20261112.v1\",\"label\":\"Divide the spermatic vessels for Fowler-Stephens descent\",\"isCorrect\":false,\"rationale\":\"The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.\",\"distractorRationale\":\"The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.\"},{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fix-high.20261112.v1\",\"label\":\"Pass the cord medial to the inferior epigastric vessels\",\"isCorrect\":false,\"rationale\":\"Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.\",\"distractorRationale\":\"Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.\"}],\"explanation\":\"The laparoscopic traction response locates the remaining restriction in the peritoneal attachments of the proximal vascular pedicle. With the vas identified and protected, bluntly free the spermatic vessels from those attachments before deciding that the pedicle is intrinsically too short. A medial rerouting procedure addresses an angled descent path; gonadal vessel division addresses a persistent length deficit after suitable vessel-preserving measures.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.pediatric-orchiopexy.length-mobilization\",\"claim.intraop.pediatric-orchiopexy.fs-length-boundary\",\"claim.intraop.pediatric-orchiopexy.vascular-protection\",\"claim.intraop.pediatric-orchiopexy.r1.medial-descent-route\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1\",\"questionVariantId\":\"question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1\",\"primaryConceptId\":\"concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1\",\"currentUpdate\":\"The right testis is exposed through an inguinal incision, with the laparoscope still viewing its proximal pedicle. The sac is separated and ligated. Under gentle traction the testis enters the upper scrotal pouch, then returns to the canal when released. Laparoscopically, the vessels pull the posterior peritoneum into a tent; the vas moves freely, and the cord follows a straight course through the deep ring.\",\"stem\":\"Which specific maneuver should next address Evan's limited descent during right orchiopexy?\",\"showServicePreviews\":true,\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.mobilize.20261112.v1\",\"label\":\"Perform blunt retroperitoneal mobilization of the spermatic vessels\",\"isCorrect\":true,\"rationale\":\"The vessels tent posterior peritoneum while the vas remains mobile. Controlled proximal vascular mobilization addresses that observed attachment with the cord structures identified, rather than dividing an unidentified band or sacrificing the vessels.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fs.20261112.v1\",\"label\":\"Divide the spermatic vessels for Fowler-Stephens descent\",\"isCorrect\":false,\"rationale\":\"The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fix-high.20261112.v1\",\"label\":\"Pass the cord medial to the inferior epigastric vessels\",\"isCorrect\":false,\"rationale\":\"Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The laparoscopic traction response locates the remaining restriction in the peritoneal attachments of the proximal vascular pedicle. With the vas identified and protected, bluntly free the spermatic vessels from those attachments before deciding that the pedicle is intrinsically too short. A medial rerouting procedure addresses an angled descent path; gonadal vessel division addresses a persistent length deficit after suitable vessel-preserving measures.\",\"sourceLabels\":[\"Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585\",\"Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045\",\"Frontiers in Pediatrics 10:906739 (2022); doi:10.3389/fped.2022.906739\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fs.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this operative checkpoint; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.\",\"sourceLabels\":[\"Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585\",\"Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045\"]},{\"answerChoiceId\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fix-high.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this operative checkpoint; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.\",\"sourceLabels\":[\"Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585\",\"Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045\",\"Frontiers in Pediatrics 10:906739 (2022); doi:10.3389/fped.2022.906739\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1\",\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"displayName\":\"Evan Brooks: testis operation checkpoints\",\"patientPresentationVariantId\":\"presentation.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1\",\"releasePointId\":\"release.l4.pediatrics\",\"patientDisplayName\":\"Evan Brooks\",\"prototypeDemographics\":{\"ageYears\":8,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Testis surgery\",\"presentation\":\"Evan Brooks, an 8-year-old boy, is undergoing right orchiopexy in the clinic's ambulatory OR after inguinal exploration located the testis. His mother, Maya Brooks, participated in preparation and consent with Evan and is waiting onsite for updates.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1\",\"pediatricProfile\":{\"version\":\"pediatric-patient-profile.v1\",\"requiresParent\":true,\"clinicalScope\":\"outpatient\"},\"prototypeDemographics\":{\"ageYears\":8,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Testis surgery\",\"presentation\":\"Evan Brooks, an 8-year-old boy, is undergoing right orchiopexy in the clinic's ambulatory OR after inguinal exploration located the testis. His mother, Maya Brooks, participated in preparation and consent with Evan and is waiting onsite for updates.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":4,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.pediatric_examination\",\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585\",\"Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045\",\"Frontiers in Pediatrics 10:906739 (2022); doi:10.3389/fped.2022.906739\"],\"decisionNodes\":[{\"id\":\"node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1\",\"questionVariantId\":\"question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1\",\"primaryConceptId\":\"concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1\",\"currentUpdate\":\"The right testis is exposed through an inguinal incision, with the laparoscope still viewing its proximal pedicle. The sac is separated and ligated. Under gentle traction the testis enters the upper scrotal pouch, then returns to the canal when released. Laparoscopically, the vessels pull the posterior peritoneum into a tent; the vas moves freely, and the cord follows a straight course through the deep ring.\",\"stem\":\"Which specific maneuver should next address Evan's limited descent during right orchiopexy?\",\"showServicePreviews\":true,\"answerChoices\":[{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.mobilize.20261112.v1\",\"label\":\"Perform blunt retroperitoneal mobilization of the spermatic vessels\",\"isCorrect\":true,\"rationale\":\"The vessels tent posterior peritoneum while the vas remains mobile. Controlled proximal vascular mobilization addresses that observed attachment with the cord structures identified, rather than dividing an unidentified band or sacrificing the vessels.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fs.20261112.v1\",\"label\":\"Divide the spermatic vessels for Fowler-Stephens descent\",\"isCorrect\":false,\"rationale\":\"The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fix-high.20261112.v1\",\"label\":\"Pass the cord medial to the inferior epigastric vessels\",\"isCorrect\":false,\"rationale\":\"Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The laparoscopic traction response locates the remaining restriction in the peritoneal attachments of the proximal vascular pedicle. With the vas identified and protected, bluntly free the spermatic vessels from those attachments before deciding that the pedicle is intrinsically too short. A medial rerouting procedure addresses an angled descent path; gonadal vessel division addresses a persistent length deficit after suitable vessel-preserving measures.\",\"sourceLabels\":[\"Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585\",\"Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045\",\"Frontiers in Pediatrics 10:906739 (2022); doi:10.3389/fped.2022.906739\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fs.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this operative checkpoint; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"The visible peritoneal attachment has not yet been released. It is premature to treat this attachment-related restriction as a vascular length deficit requiring division.\",\"sourceLabels\":[\"Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585\",\"Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045\"]},{\"answerChoiceId\":\"choice.intraop.pediatric-orchiopexy.residual-cord-bands.fix-high.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this operative checkpoint; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Medial rerouting can shorten an angled descent path. Here the cord travels straight through the ring while the proximal vascular-peritoneal attachment moves under traction, so that attachment is the demonstrated remaining restriction.\",\"sourceLabels\":[\"Canadian Urological Association Journal 11(7):E251-E260 (2017); doi:10.5489/cuaj.4585\",\"Journal of Clinical Medicine 13(7):2045 (2024); doi:10.3390/jcm13072045\",\"Frontiers in Pediatrics 10:906739 (2022); doi:10.3389/fped.2022.906739\"]}]}],\"learningSummary\":\"The laparoscopic traction response locates the remaining restriction in the peritoneal attachments of the proximal vascular pedicle. With the vas identified and protected, bluntly free the spermatic vessels from those attachments before deciding that the pedicle is intrinsically too short. A medial rerouting procedure addresses an angled descent path; gonadal vessel division addresses a persistent length deficit after suitable vessel-preserving measures.\"}",
    "sourceQuestionSha256": "f7e6b2ab83adaa91588898c18c5e18376d640bbf223fb13728a40ba2ae34f6d6",
    "sourceNodeSha256": "31ca55c6fe8e4af433aa5d5a7679d82b6be0cf39068afb411bc7fe15d20c95ca",
    "sourceCaseSha256": "509a16c3960b0d3a3f03dbeaa974b160e3df15aa0a6969e1b517e7516807a795",
    "acceptedQuestionSha256": "78d380b545dd41e28db2b2b8d06996c8a7b00ed18cbee3312d978ca88f1847e4",
    "acceptedNodeSha256": "c343e18df5e8941db00be5bc1d3983430a80dbee444f2f0f27bef55adc6b3530",
    "acceptedCaseSha256": "fd288acfd3f919806c05f7427dcf49083c2e7bedf758f2a36d217f57e5d4f86d",
    "review": {
      "path": "docs/research/question-intraop-salvage-review-20261113.json",
      "record": {
        "caseId": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
        "nodeId": "node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The new presentation supplies the completed localization and ongoing right orchiopexy. The update independently supplies inguinal exposure, retained laparoscopic visualization, completed sac ligation, recoil, posterior peritoneal tenting, freely moving vas and straight cord course. No missing localization answer is needed to select the next maneuver.",
          "Stating that exploration located the testis establishes the operative stage without explaining the current restriction or naming vessel mobilization. The retained traction observations still require interpretation.",
          "Evan is an 8-year-old boy, and Maya Brooks participated in preparation and consent and waits onsite. Combined inguinal exposure and laparoscopic pedicle assessment are explicitly described, so the observation viewpoint is coherent in the pediatric ambulatory OR.",
          "The entire retained node matches the hash-matched source node. The review2 PASS and receipt hash are verified. The key remains Perform blunt retroperitoneal mobilization of the spermatic vessels."
        ],
        "suggestions": []
      }
    }
  }
];
export const PROGRAM_BATCH10_CORRECTIONS = [
  {
    "path": "case.intraop.asc-access.port-course.20261112.v1.displayName",
    "before": "Priya Shah: operative checkpoint",
    "after": "{patientName}: operative checkpoint",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.asc-access.port-course.20261112.v1.presentation",
    "before": "Priya Shah, a 47-year-old woman, is undergoing venous port implantation in the clinic's ASC operating room. The procedure is underway at completion imaging before the implant is accepted for use.",
    "after": "{patientName}, a 47-year-old woman, is undergoing venous port implantation in the clinic's ASC operating room. The procedure is underway at completion imaging before the implant is accepted for use.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.asc-access.port-course.20261112.v1.approvedInstantiationProfiles[0].presentation",
    "before": "Priya Shah, a 47-year-old woman, is undergoing venous port implantation in the clinic's ASC operating room. The procedure is underway at completion imaging before the implant is accepted for use.",
    "after": "{patientName}, a 47-year-old woman, is undergoing venous port implantation in the clinic's ASC operating room. The procedure is underway at completion imaging before the implant is accepted for use.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.asc-access.port-course.20261112.v1.decisionNodes[0].stem",
    "before": "Which catheter maneuver should be selected before completing Priya's port implantation on these views?",
    "after": "Which catheter maneuver should be selected before completing {patientName}'s port implantation on these views?",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "question.intraop.asc-access.anterior-port-course.20261112.v1.stem",
    "before": "Which catheter maneuver should be selected before completing Priya's port implantation on these views?",
    "after": "Which catheter maneuver should be selected before completing {patientName}'s port implantation on these views?",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1.learningSummary",
    "before": "A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary. An apposed clip line does not prevent gas already outside the bowel from creating pressure. The new abdominal, ventilatory and circulatory changes require emergency percutaneous decompression while resuscitation and hospital escalation continue. This is temporization; improvement does not prove that the injury is sealed.",
    "after": "A visible opening into the peritoneal space is a wall breach. Its small size, clean field, mobile margins and prompt recognition support endoscopic clipping. Stable vital signs do not establish that an open defect is sealed. Supportive treatment, hospital monitoring and surgical involvement remain necessary. Gas that escaped before insufflation stopped can remain outside the bowel after clip apposition. Here, abdominal expansion is evolving during the final closure steps and produces a new combined ventilatory and circulatory problem at reassessment. Emergency percutaneous decompression precedes transfer while airway and circulatory support continue. Improvement is temporization and does not establish a durable seal or remove the need for hospital assessment.",
    "kind": "native_summary_from_exact_reviewed_node_explanations"
  },
  {
    "path": "case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1.displayName",
    "before": "ASC procedure: Monica Hale",
    "after": "ASC procedure: {patientName}",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1.presentation",
    "before": "Ava Bennett, a 7-year-old girl, is in the clinic's ASC endoscopy room, where diagnostic EGD is underway using IV anesthesia and spontaneous breathing through a natural airway. Her mother, Maya Bennett, joined preparation for consent and an explanation Ava could understand and is waiting onsite for updates.",
    "after": "{patientName}, a 7-year-old girl, is in the clinic's ASC endoscopy room, where diagnostic EGD is underway using IV anesthesia and spontaneous breathing through a natural airway. Her mother, Maya Bennett, joined preparation for consent and an explanation {patientName} could understand and is waiting onsite for updates.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1.approvedInstantiationProfiles[0].presentation",
    "before": "Ava Bennett, a 7-year-old girl, is in the clinic's ASC endoscopy room, where diagnostic EGD is underway using IV anesthesia and spontaneous breathing through a natural airway. Her mother, Maya Bennett, joined preparation for consent and an explanation Ava could understand and is waiting onsite for updates.",
    "after": "{patientName}, a 7-year-old girl, is in the clinic's ASC endoscopy room, where diagnostic EGD is underway using IV anesthesia and spontaneous breathing through a natural airway. Her mother, Maya Bennett, joined preparation for consent and an explanation {patientName} could understand and is waiting onsite for updates.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1.decisionNodes[0].currentUpdate",
    "before": "During scope withdrawal, Ava develops noisy inspiratory effort that becomes silent, with opposite chest and abdominal movement and loss of the carbon-dioxide trace. The endoscope is removed and stimulation stops. Repositioning, two-person facemask oxygenation with positive pressure, and IV propofol have not restored air movement. Inspiratory effort persists as oxygen saturation falls; the team continues oxygenation maneuvers.",
    "after": "During scope withdrawal, {patientName} develops noisy inspiratory effort that becomes silent, with opposite chest and abdominal movement and loss of the carbon-dioxide trace. The endoscope is removed and stimulation stops. Repositioning, two-person facemask oxygenation with positive pressure, and IV propofol have not restored air movement. Inspiratory effort persists as oxygen saturation falls; the team continues oxygenation maneuvers.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1.decisionNodes[0].stem",
    "before": "Which rescue drug should the anesthesia team administer now for Ava Bennett during the EGD?",
    "after": "Which rescue drug should the anesthesia team administer now for {patientName} during the EGD?",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1.stem",
    "before": "Which rescue drug should the anesthesia team administer now for Ava Bennett during the EGD?",
    "after": "Which rescue drug should the anesthesia team administer now for {patientName} during the EGD?",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1.presentation",
    "before": "Noah Reed, a 12-year-old boy, is in the clinic's ASC operating room, where open inguinal hernia repair is underway under general anesthesia with a tracheal tube in place. His father, Daniel Reed, joined preparation for consent and an age-appropriate discussion with Noah and is waiting onsite for updates.",
    "after": "{patientName}, a 12-year-old boy, is in the clinic's ASC operating room, where open inguinal hernia repair is underway under general anesthesia with a tracheal tube in place. His father, Daniel Reed, joined preparation for consent and an age-appropriate discussion with {patientName} and is waiting onsite for updates.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1.approvedInstantiationProfiles[0].presentation",
    "before": "Noah Reed, a 12-year-old boy, is in the clinic's ASC operating room, where open inguinal hernia repair is underway under general anesthesia with a tracheal tube in place. His father, Daniel Reed, joined preparation for consent and an age-appropriate discussion with Noah and is waiting onsite for updates.",
    "after": "{patientName}, a 12-year-old boy, is in the clinic's ASC operating room, where open inguinal hernia repair is underway under general anesthesia with a tracheal tube in place. His father, Daniel Reed, joined preparation for consent and an age-appropriate discussion with {patientName} and is waiting onsite for updates.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1.decisionNodes[0].currentUpdate",
    "before": "Noah develops increased airway pressure, prolonged expiration and bilateral expiratory wheezing. The tracheal-tube marking is unchanged, a suction catheter passes freely without retrieving secretions, and chest movement is symmetric. Surgery pauses, oxygen and manual ventilation continue, and anesthesia is deepened. Manual ventilation produces bilateral chest rise; oxygenation and arterial pressure remain near their pre-event levels.",
    "after": "{patientName} develops increased airway pressure, prolonged expiration and bilateral expiratory wheezing. The tracheal-tube marking is unchanged, a suction catheter passes freely without retrieving secretions, and chest movement is symmetric. Surgery pauses, oxygen and manual ventilation continue, and anesthesia is deepened. Manual ventilation produces bilateral chest rise; oxygenation and arterial pressure remain near their pre-event levels.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1.decisionNodes[0].stem",
    "before": "Which medication is the first priority to relieve Noah Reed's current airflow limitation during inguinal hernia repair?",
    "after": "Which medication is the first priority to relieve {patientName}'s current airflow limitation during inguinal hernia repair?",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1.stem",
    "before": "Which medication is the first priority to relieve Noah Reed's current airflow limitation during inguinal hernia repair?",
    "after": "Which medication is the first priority to relieve {patientName}'s current airflow limitation during inguinal hernia repair?",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1.displayName",
    "before": "Evan Brooks: testis operation checkpoints",
    "after": "{patientName}: testis operation checkpoints",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1.presentation",
    "before": "Evan Brooks, an 8-year-old boy, is undergoing right orchiopexy in the clinic's ambulatory OR after inguinal exploration located the testis. His mother, Maya Brooks, participated in preparation and consent with Evan and is waiting onsite for updates.",
    "after": "{patientName}, an 8-year-old boy, is undergoing right orchiopexy in the clinic's ambulatory OR after inguinal exploration located the testis. His mother, Maya Brooks, participated in preparation and consent with {patientName} and is waiting onsite for updates.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1.approvedInstantiationProfiles[0].presentation",
    "before": "Evan Brooks, an 8-year-old boy, is undergoing right orchiopexy in the clinic's ambulatory OR after inguinal exploration located the testis. His mother, Maya Brooks, participated in preparation and consent with Evan and is waiting onsite for updates.",
    "after": "{patientName}, an 8-year-old boy, is undergoing right orchiopexy in the clinic's ambulatory OR after inguinal exploration located the testis. His mother, Maya Brooks, participated in preparation and consent with {patientName} and is waiting onsite for updates.",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1.decisionNodes[0].stem",
    "before": "Which specific maneuver should next address Evan's limited descent during right orchiopexy?",
    "after": "Which specific maneuver should next address {patientName}'s limited descent during right orchiopexy?",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1.stem",
    "before": "Which specific maneuver should next address Evan's limited descent during right orchiopexy?",
    "after": "Which specific maneuver should next address {patientName}'s limited descent during right orchiopexy?",
    "kind": "patient_name_placeholder"
  }
];
export const PROGRAM_BATCH10_CLAIMS:Array<EvidenceClaim & Record<string,unknown>> = [
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.wire-confirmation",
    "statement": "Before dilation over a guidewire, establish that the wire is in the intended venous path.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2025",
      "source.intraop.asc-access.asa2012"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Current consensus and an older concordant cross-check; not comparative evidence of one confirmation test over every possible alternative.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.needle-wire-distinction",
    "statement": "Evidence obtained from an earlier needle position does not by itself establish the location of a subsequently threaded wire.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2025",
      "source.intraop.asc-access.asa2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Temporal/device inference from staged confirmation guidance; no claim that the supplied ambiguous echo proves arterial entry.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.wire-ultrasound",
    "statement": "Ultrasound can follow a wire within the accessible target vein before tract dilation; complementary views help establish its relationship to vessel walls.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2025",
      "source.intraop.asc-access.asa2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Accessible-neck confirmation is not proof of an entire intrathoracic trajectory; persistent uncertainty still requires resolution before dilation.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.needle-blood-assessment",
    "statement": "Pressure waveform or blood-gas evidence can contribute to identifying the compartment sampled by an access needle; blood color alone is insufficient.",
    "sourceIds": [
      "source.intraop.asc-access.asa2012",
      "source.intraop.asc-access.aoa2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "ASA2012 is a superseded technical cross-check for the blood-gas method; the question tests the limited time/device represented, not a gas cutoff.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.arterial-retain",
    "statement": "An inadvertently placed large-bore arterial dilator or sheath should remain in position pending urgent vascular or interventional removal planning.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2025",
      "source.intraop.asc-access.asa2012"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Consensus supported by complication reports, not randomized evidence; device and vessel-specific controlled removal require specialist judgment.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.arterial-size-boundary",
    "statement": "The 2025 Association guidance specifically retains inadvertently arterial devices of at least 6 Fr; an 8-Fr sheath is on that side of the boundary.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single current source for this exact size boundary. Eight Fr is the constructed device characteristic, not an invented practice cutoff. Small-needle compression is not generalized to a dilated tract.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.arterial-extraction-risk",
    "statement": "Immediate extraction of a large arterial device can produce serious vascular complications before a controlled removal strategy is established.",
    "sourceIds": [
      "source.intraop.asc-access.asa2012",
      "source.intraop.asc-access.ports2019",
      "source.intraop.asc-access.aoa2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Case-based complication evidence; no numerical risk or inevitable harm is asserted.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.arterial-controlled-removal",
    "statement": "Changing to a smaller device does not substitute for an individualized specialist plan to control an enlarged arterial tract.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2025",
      "source.intraop.asc-access.asa2012"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Application of the retention/removal rule; no source establishes a universal prohibition on wire use within a specialist repair strategy.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.port-orthogonal-course",
    "statement": "A catheter in an internal thoracic venous route may project near the SVC frontally while an orthogonal view shows an anterior parasternal course.",
    "sourceIds": [
      "source.intraop.asc-access.ports2019"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Single directly verified publication for this precise imaging boundary. Constructed text findings are original; no image or figure is reproduced.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.port-tributary",
    "statement": "Intravascular position in a small tributary does not establish the intended long-term central port position.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2025",
      "source.intraop.asc-access.ports2019",
      "source.intraop.asc-access.jsir2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "No exact SVC/cavoatrial distance or high-right-atrial recommendation is taught; acceptable tip targets vary among sources.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.port-reposition",
    "statement": "A recognized malpositioned port catheter needs correction or replacement rather than acceptance solely because blood can be aspirated.",
    "sourceIds": [
      "source.intraop.asc-access.jsir2023",
      "source.intraop.asc-access.aoa2025",
      "source.intraop.asc-access.ports2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Technical guidance supports correction; the exact maneuver depends on actual anatomy, device and operator capability. No blind withdrawal is proposed.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.port-aspiration-limit",
    "statement": "Blood aspiration establishes access to blood but cannot distinguish a central course from an intravascular tributary course.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2025",
      "source.intraop.asc-access.ports2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Anatomical application of imaging/flow confirmation guidance. This does not negate limited emergency use exceptions for temporary catheters.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.port-route-constraint",
    "statement": "Demonstrated central patency favors attempting image-guided correction through usable access before obtaining a new puncture solely for branch malposition.",
    "sourceIds": [
      "source.intraop.asc-access.jsir2023",
      "source.intraop.asc-access.ports2019"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Clinical application, not a head-to-head trial proving one salvage technique. A failed correction, device damage, occlusion or injury changes the route decision.",
    "applicablePopulation": "Adults undergoing planned central venous access/port placement; no pediatric dosing, neonatal or hospital reconstruction objective.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.specimen-orientation",
    "statement": "Documented anatomical markers attached to a skin excision permit localization of the corresponding margins for pathology.",
    "sourceIds": [
      "source.intraop.asc-access.ahs2013",
      "source.intraop.asc-access.skin2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Marker meaning must be documented and preserved; the claims do not prescribe a single universal suture code.",
    "applicablePopulation": "Adults undergoing an already planned superficial skin/soft-tissue excision; no sarcoma resection or infant extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.fragment-limits",
    "statement": "Fragmentation and loss of reconstructable orientation limit anatomical margin assignment without automatically invalidating separately preserved specimen information.",
    "sourceIds": [
      "source.intraop.asc-access.skin2026",
      "source.intraop.asc-access.ahs2013",
      "source.intraop.asc-access.rcpath2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "The exact detached-fat scenario is a constructed provenance inference; needs surgeon/pathologist confirmation. Fragmentation does not mean the tissue is diagnostically useless.",
    "applicablePopulation": "Adults undergoing an already planned superficial skin/soft-tissue excision; no sarcoma resection or infant extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.site-versus-face",
    "statement": "Knowing where a detached specimen originated is different from knowing which of its indistinguishable faces was the final boundary.",
    "sourceIds": [
      "source.intraop.asc-access.rcpath2024",
      "source.intraop.asc-access.skin2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "General specimen-orientation principle; the source does not verify the fictional patient geometry. No histological positive/negative result is inferred.",
    "applicablePopulation": "Adults undergoing an already planned superficial skin/soft-tissue excision; no sarcoma resection or infant extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.additional-margin-boundary",
    "statement": "For a separately removed bed sample, the new final margin is the surface cut from tissue that remains in the patient, distinct from the old cavity-facing surface.",
    "sourceIds": [
      "source.intraop.asc-access.rcpath2024"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Single directly verified guideline for the cavity/new-face distinction; guideline is breast-specific. Geometrical application to an already planned skin bed sample is an explicit extrapolation, not a resection-extent recommendation.",
    "applicablePopulation": "Adults undergoing an already planned superficial skin/soft-tissue excision; no sarcoma resection or infant extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.marker-specificity",
    "statement": "A specimen suture may identify the cavity-facing surface or the new margin; its actual documented designation governs interpretation.",
    "sourceIds": [
      "source.intraop.asc-access.rcpath2024",
      "source.intraop.asc-access.ahs2013",
      "source.intraop.asc-access.skin2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Both conventions are directly allowed by RCPath. Skin sources corroborate documented orientation, not the exact separate-bed workflow.",
    "applicablePopulation": "Adults undergoing an already planned superficial skin/soft-tissue excision; no sarcoma resection or infant extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.needle-only-compression",
    "statement": "A recognized needle-only arterial puncture can be managed by needle withdrawal and digital compression, with further assessment if complications develop.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2016"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single directly verified older society source for the counterfactual; this is not permission to remove an arterial sheath or any neck/chest arterial catheter without specialist planning.",
    "applicablePopulation": "Adults with an immediately recognized, compressible needle-only puncture before tract dilation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.arterial-waveform",
    "statement": "A systemic arterial waveform from an access device supports arterial positioning even when the return looks dark.",
    "sourceIds": [
      "source.intraop.asc-access.aoa2016",
      "source.intraop.asc-access.asa2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Technical interpretation; transducer setup and simultaneous imaging matter. No unverified pressure cutoff or claim based on color alone.",
    "applicablePopulation": "Adults at a central-access confirmation checkpoint.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.r1.doppler-purpose",
    "statement": "Doppler characterization of blood flow around a local wire echo does not by itself demonstrate the wire staying within the target vein along an obscured segment.",
    "sourceIds": [
      "source.intraop.asc-access.saugel2017.r1"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly checked independent review separates flow/vessel characterization from wire-position confirmation. The ranking is a technical application to the stated local observation, not a claim that Doppler is never useful during wire assessment. Current wire-course guidance is separately supported by the retained AoA2025 claim.",
    "applicablePopulation": "Adults undergoing jugular guidewire assessment before tract dilation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.asc-access.r1.compressibility-purpose",
    "statement": "Compressibility helps assess a venous segment and its patency; testing a neighboring segment does not establish the retained guidewire trajectory through a different obscured region.",
    "sourceIds": [
      "source.intraop.asc-access.saugel2017.r1"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly checked independent technical review supports the function distinction. No compression threshold, force, pressure or universal exclusion criterion is added; the current task concerns the instrument course, not a thrombosis rule.",
    "applicablePopulation": "Adults undergoing jugular guidewire assessment before tract dilation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.unexplained-bile.v1",
    "statement": "Unexplained bile encountered during cholecystectomy should prompt assessment for a bile-duct injury.",
    "sourceIds": [
      "source.intraop-biliary.wses-bdi-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single guideline explicitly supports this operative trigger; the synthetic stream location is not a diagnostic classification.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.injury-imaging.v1",
    "statement": "When duct injury is suspected during cholecystectomy, intraoperative duct imaging can clarify the anatomy before further operative decisions.",
    "sourceIds": [
      "source.intraop-biliary.wses-bdi-2021",
      "source.intraop-biliary.sages-safe-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "IOC is the offered method, not a claim that it universally outperforms intraoperative ultrasound or that equipment is installed.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.major-discontinuity.v1",
    "statement": "A separated main duct with tissue loss is a different repair problem from a small lateral defect with preserved duct continuity.",
    "sourceIds": [
      "source.intraop-biliary.wses-bdi-2021",
      "source.intraop-biliary.sages-ahpba-bdi-2025"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "No injury grade, exact gap-size threshold or universal reconstruction is inferred from the constructed observations.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.expert-transfer.v1",
    "statement": "For an intraoperatively recognized bile-duct injury beyond local HPB expertise, control of bile contamination and transfer for specialist management are appropriate.",
    "sourceIds": [
      "source.intraop-biliary.wses-bdi-2021",
      "source.intraop-biliary.sages-safe-2020",
      "source.intraop-biliary.sages-ahpba-bdi-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Current specialist guidance supports temporization; it does not make delayed repair mandatory for every injury or forbid expert index-operation repair.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.limited-repair.v1",
    "statement": "Primary local repair can be appropriate for selected minor injuries; major tissue-loss injuries require a different plan and appropriate reconstructive expertise.",
    "sourceIds": [
      "source.intraop-biliary.wses-bdi-2021",
      "source.intraop-biliary.sages-ahpba-bdi-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Exact reconstruction, timing and advanced endoscopic/radiologic options belong to the specialist team. A conventional papillary stent must not be assumed to bridge an unconnected proximal system.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.intact-retrieval.v1",
    "statement": "When a gallbladder lesion is suspicious, retrieval should limit specimen disruption and bile contamination, using a bag rather than relying on an unprotected extraction.",
    "sourceIds": [
      "source.intraop-biliary.brazil-gbc-2020"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "One consensus publication is used. Enlarging the extraction incision instead of puncturing or crushing this particular specimen is an authored application requiring surgeon sign-off, not a directly tested comparative rule.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.histology-required.v1",
    "statement": "Final gallbladder-cancer decisions depend on pathological invasion depth and margins, rather than the operative appearance of a wall lesion by itself.",
    "sourceIds": [
      "source.intraop-biliary.brazil-gbc-2020",
      "source.intraop-biliary.nci-gbc-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Coverage boundary only; no live ASC cancer-staging or radical-resection simulation is proposed.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.t1a-followup.v1",
    "statement": "Expert-confirmed completely removed margin-negative T1a gallbladder cancer does not automatically require completion radical resection.",
    "sourceIds": [
      "source.intraop-biliary.brazil-gbc-2020",
      "source.intraop-biliary.nci-gbc-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Cross-check of preserved bank coverage, not a new question or an assertion about inadequate histology or deeper invasion.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.t2-completion.v1",
    "statement": "For suitable patients with incidental gallbladder cancer extending into perimuscular tissue, completion oncologic surgery may include liver-bed resection and regional lymphadenectomy.",
    "sourceIds": [
      "source.intraop-biliary.brazil-gbc-2020",
      "source.intraop-biliary.nci-gbc-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Preserved T2 coverage only. Exact extent, timing and duct resection depend on staging and margin findings; no numeric rule added.",
    "applicablePopulation": "Adults undergoing cholecystectomy or subsequent specialist pathology review; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.identification-before-division.v1",
    "statement": "During cholecystectomy, reliable identification of the cystic structures should precede their clipping or division.",
    "sourceIds": [
      "source.intraop-biliary.sages-safe-2020",
      "source.intraop-biliary.wses-bdi-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "This supports the baseline operative plan, not a claim that prior identification rules out a subsequently suspected injury. No new CVS-only question is authored.",
    "applicablePopulation": "Adults undergoing cholecystectomy.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.staging-conversion.v1",
    "statement": "An otherwise controlled laparoscopic injury assessment does not itself require open conversion for fuller diagnostic staging.",
    "sourceIds": [
      "source.intraop-biliary.wses-bdi-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "One guideline directly addresses this boundary. Conversion remains appropriate when exposure or control cannot be maintained laparoscopically; no universal prohibition is taught.",
    "applicablePopulation": "Adults with suspected or recognized duct injury during cholecystectomy.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.papillary-continuity.v1",
    "statement": "A routine transpapillary stent does not by itself establish drainage from a proximal duct system that lacks a continuous luminal connection to the distal duct.",
    "sourceIds": [
      "source.intraop-biliary.wses-bdi-2021",
      "source.intraop-biliary.sages-ahpba-bdi-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This distinguishes ordinary communicating-leak diversion from a disconnected system. It does not exclude specialist rendezvous, endoscopic/radiological combinations or other selected nonoperative injury management.",
    "applicablePopulation": "Adults with main-duct discontinuity documented during or after cholecystectomy.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.ioc-access-route.v1",
    "statement": "Contrast duct imaging requires an injection route that communicates with the target ducts; an opening below a closed gallbladder-side clip provides a different route from injection into the isolated gallbladder.",
    "sourceIds": [
      "source.intraop-biliary.sages-stones-2021",
      "source.intraop-biliary.sages-imaging-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Sources describe cystic-duct and gallbladder injection. The closed-clip comparison is a direct anatomical application to constructed observations, not a tested superiority estimate; actual site safety requires clinician review.",
    "applicablePopulation": "Adults undergoing cholecystectomy with the represented operative anatomy and local resources; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.ioc-versus-fluorescence.v1",
    "statement": "When assessing a suspected operative duct leak through usable duct access, contrast cholangiography can delineate luminal continuity and contrast escape, while ICG fluorescence principally supplies anatomical orientation.",
    "sourceIds": [
      "source.intraop-biliary.wses-bdi-2021",
      "source.intraop-biliary.sages-imaging-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "IOC over fluorescence is a conditional low-certainty preference; fluorescence is not prohibited, and this does not rank IOC over expert laparoscopic ultrasound. Clinical confirmation of the specific option ranking is needed.",
    "applicablePopulation": "Adults undergoing cholecystectomy with the represented operative anatomy and local resources; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.stone-route-options.v1",
    "statement": "Confirmed CBD stones found during cholecystectomy may be cleared operatively or by postoperative ERCP, with anatomy, available expertise and resources informing the route.",
    "sourceIds": [
      "source.intraop-biliary.sages-stones-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One adequate society review is used for the exact route-selection teaching point; an independently licensed second management source was not established. The review does not mandate a single technique for every patient.",
    "applicablePopulation": "Adults undergoing cholecystectomy with the represented operative anatomy and local resources; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.friable-cystic-route.v1",
    "statement": "A small or friable cystic duct weighs against transcystic stone extraction even when a guidewire can enter the common duct.",
    "sourceIds": [
      "source.intraop-biliary.sages-stones-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single-review support; direct observation of splitting tissue is constructed and requires surgeon confirmation. Wire-versus-basket traversal is an anatomical application rather than an exact quantified failure rule.",
    "applicablePopulation": "Adults undergoing cholecystectomy with the represented operative anatomy and local resources; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop-biliary.narrow-common-duct.v1",
    "statement": "The cited SAGES review favors a common duct at least 7 mm wide for transductal exploration to reduce postoperative stricture risk.",
    "sourceIds": [
      "source.intraop-biliary.sages-stones-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single-review selection criterion, not a biological cliff or universal ban on narrower-duct surgery. The synthetic 5-mm value is an observed case measurement, not a new guideline threshold.",
    "applicablePopulation": "Adults undergoing cholecystectomy with the represented operative anatomy and local resources; no pediatric extrapolation.",
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
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.amorphous-pit-pattern",
    "statement": "A nonstructural pit pattern in a colorectal lesion raises concern for deep submucosal invasion.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015",
      "source.intraop.suspicious-polyps.acpgbi-2013"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Optical prediction is not histologic staging; the written constructed record tests interpretation of documented findings rather than actual image-reading skill.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.nonpedunculated-surgical-route",
    "statement": "A nonpedunculated colorectal lesion with convincing optical features of deep invasion warrants tissue sampling and surgical evaluation rather than attempted endoscopic clearance.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.singapore-2022",
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Applies to convincing deep-invasion findings, not size or nonlifting after prior tattoo alone. Surgical evaluation is not an executed colectomy or a final cancer diagnosis.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.targeted-sampling",
    "statement": "When sampling a suspicious colorectal lesion, the area with the concerning surface change is a more informative target than an ordinary-appearing peripheral area.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "One directly accessed guideline for this precise sampling-target boundary. Sampling still cannot fully stage an unresected lesion.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.limited-biopsy-scope",
    "statement": "A superficial adenomatous biopsy does not exclude invasive disease elsewhere or deeper within a larger colorectal lesion.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.acpgbi-2013"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly accessed primary statement for this sampling limitation. The scenario specifies the actual region and layers represented; no new sensitivity value is inferred.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.superficial-enbloc-boundary",
    "statement": "When endoscopic treatment of a lesion with suspected superficial invasion is appropriate, an intact resection supports pathological assessment better than fragmentation.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.singapore-2022",
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This explains the closest endoscopic alternative, not an endorsement of ESD for the offered deep-invasion pattern or of advanced resection in an unconfirmed ASC capability.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.benign-piecemeal-boundary",
    "statement": "Expert piecemeal resection remains an option for selected large nonpedunculated lesions with benign optical features.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.singapore-2022",
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Counterfactual for the fragment-resection alternative; not permission to fragment a lesion with convincing invasive features. Local expertise and resources remain necessary.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.intact-microanatomy",
    "statement": "Keeping a resected polyp intact helps preserve the relationship between invasive tissue, stalk and excision margin for pathology.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.acpgbi-2013"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly accessed source for the pedunculated specimen relationship. This is a specimen-quality principle, not a favorable-pathology or surveillance decision.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.retrieval-fragmentation",
    "statement": "Dividing a resected polyp during retrieval can undermine the anatomical assessment that an en-bloc excision was intended to preserve.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.acpgbi-2013",
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Application of documented intact-specimen and fragment-adequacy principles to retrieval. The net is the offered intact retrieval method, not a claim of superiority over every other intact device.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.stalk-before-fixation",
    "statement": "A pedunculated polyp specimen can be prepared with its stalk extended and pinned before fixation to support subsequent oriented assessment.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.acpgbi-2013"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single older technical source; the society-hosted proof directly describes this step. No pin force, stretching distance, fixation concentration or duration is taught. Endoscopy-pathology local handling arrangements require confirmation.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.longitudinal-stalk-section",
    "statement": "Pathology sections following the polyp head and stalk axis permit assessment of invasion relative to the stalk and resection end.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.acpgbi-2013"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly accessed source. Endoscopy staff orient and communicate; they do not replace the pathologist's sectioning protocol.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.tattoo-fibrosis",
    "statement": "Carbon marking at the site of a colorectal lesion can cause fibrosis that complicates later submucosal resection.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015",
      "source.intraop.suspicious-polyps.singapore-2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "A potential technical complication, not an inevitable outcome and not proof that a nonlifting lesion is cancer.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.remote-tattoo",
    "statement": "BSG/ACPGBI guidance recommends separating a colorectal tattoo from a lesion by at least 30 mm to reduce interference with later endoscopic resection.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One guideline and very-low-quality evidence for the exact distance. The proposed 4-cm anal-side site satisfies it; this item does not rank every remote oral-side site or establish a universal surgical tattoo convention.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.suspicious-polyps.marking-communication",
    "statement": "The location of a colorectal marker must be communicated in relation to the lesion so a later procedural team can localize the intended site.",
    "sourceIds": [
      "source.intraop.suspicious-polyps.acpgbi-2013",
      "source.intraop.suspicious-polyps.bsg-acpgbi-2015"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Local policies differ in marking number and surgical position. No universal number of injections, volume or surgical tattoo position is scored.",
    "applicablePopulation": "Adults at the explicitly constructed colonoscopy checkpoints; not a clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
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
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.tear-morphology",
    "statement": "Retching-associated Mallory-Weiss injury produces a longitudinal mucosal split around the gastroesophageal junction.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.kim-tears-2015"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "One directly read technical review supports this morphology. It supports the fictional lesion description, not image interpretation or proof that every junctional split has this cause.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.dry-tear-vessel",
    "statement": "CAG 2025 suggests observation rather than routine endoscopic hemostasis for a Mallory-Weiss tear bearing a nonbleeding visible vessel.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.cag-nonpeptic-2025",
      "source.intraop.upper-gi-hemostasis.kim-tears-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "CAG recommendation 7A is conditional with very low certainty. Kim's older technical review corroborates the dry-vessel boundary with coagulopathy/rebleeding exceptions. Restrict application to the supplied stable, dry, noncoagulopathic story; no universal ban on treatment.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.active-tear-mechanical",
    "statement": "For an actively bleeding Mallory-Weiss tear, CAG supports clipping or band ligation rather than epinephrine as the sole hemostatic treatment.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.cag-nonpeptic-2025",
      "source.intraop.upper-gi-hemostasis.kim-tears-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "CAG 5/6A/6B: conditional, very low certainty. Kim cross-checks mechanical treatment and injection limitations. Neither source establishes a unique clip-versus-band ranking; both remain counterfactual alternatives.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.ulcer-vessel-boundary",
    "statement": "A peptic ulcer with a nonbleeding visible vessel warrants endoscopic hemostasis, unlike routine treatment of a dry Mallory-Weiss tear.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.esge-ulcer-2026",
      "source.intraop.upper-gi-hemostasis.cag-nonpeptic-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The ulcer part is directly supported by the 2026 guideline. The tear part retains CAG's very-low-certainty limitation. Distinct lesions explain the boundary; no new ulcer item or fixed regimen is authored.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.variceal-plug-source",
    "statement": "A projecting platelet-fibrin plug on an esophageal varix is evidence of recent variceal hemorrhage even when the viewed surface is temporarily dry.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.esge-variceal-2022",
      "source.intraop.upper-gi-hemostasis.kasl-varices-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Both primary society guidelines directly describe plug/nipple stigmata. A fictional written endoscopy record supplies the observation; it is not a validated image-reading examination.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.esophageal-band-treatment",
    "statement": "Band ligation is the preferred initial endoscopic treatment for acute esophageal variceal hemorrhage when ligation can be performed.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.esge-variceal-2022",
      "source.intraop.upper-gi-hemostasis.kasl-varices-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Society recommendations favor ligation over injection sclerotherapy. Sclerotherapy remains an alternative when banding is not feasible; no absolute ineffectiveness claim is made.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.fundal-treatment-boundary",
    "statement": "Cardiofundal variceal hemorrhage has a different endoscopic treatment pathway from esophageal variceal hemorrhage.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.esge-variceal-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single directly checked source for the feedback comparison: cyanoacrylate is an established gastric option. This does not rank direct glue against EUS-guided therapy or radiologic treatment in 2026. That prospective target is withheld pending a current rights-permitted comparison.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.rescue-tips",
    "statement": "Persistent esophageal variceal bleeding despite vasoactive treatment and endoscopic hemostasis calls for urgent rescue TIPS assessment.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.esge-variceal-2022",
      "source.intraop.upper-gi-hemostasis.bsg-varices-2026",
      "source.intraop.upper-gi-hemostasis.kasl-varices-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Rescue TIPS is supplied as the hospital team's plan, not simulated at the ASC or ranked against other definitive options. No severity score, futility threshold or preemptive timing rule is taught.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.esophageal-stent-bridge",
    "statement": "A dedicated removable covered esophageal metal stent can temporarily tamponade refractory esophageal variceal bleeding while definitive therapy is arranged.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.esge-variceal-2022",
      "source.intraop.upper-gi-hemostasis.bsg-varices-2026",
      "source.intraop.upper-gi-hemostasis.kasl-varices-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Bridge use is supported but comparative evidence is limited. A dedicated hemostasis device, trained team and protected airway are part of the outside record. Not any generic esophageal stent and not definitive portal decompression.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.balloon-valid-bridge",
    "statement": "Balloon tamponade is another accepted temporary bridge for uncontrolled esophageal variceal bleeding.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.esge-variceal-2022",
      "source.intraop.upper-gi-hemostasis.bsg-varices-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "ESGE weakly favors a covered stent where available; BSG retains either bridge. Balloon is intentionally not a scored distractor. No inflation, traction, volume or dwell-time protocol is provided.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.stent-scope-and-risk",
    "statement": "Covered esophageal hemostasis stents treat esophageal rather than gastric variceal bleeding and require surveillance for migration.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.bsg-varices-2026",
      "source.intraop.upper-gi-hemostasis.esge-variceal-2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "This is a location and follow-up boundary, not a promise of durable control or a scored bedside-recovery encounter.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.hospital-background",
    "statement": "Acute variceal hemorrhage requires hospital support, with vasoactive and antibacterial treatment and airway protection when clinically indicated.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.bsg-varices-2026",
      "source.intraop.upper-gi-hemostasis.esge-variceal-2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Background context only. No doses, regimens, transfusion thresholds or inpatient medication algorithm is scored. The clinic only reviews the outside record.",
    "applicablePopulation": "Adults in the explicitly described fictional endoscopy checkpoints; no pediatric extrapolation.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.upper-gi-hemostasis.sclerotherapy-varix-target",
    "statement": "Esophageal injection sclerotherapy delivers sclerosant into variceal tissue and can be used when ligation is unsuitable.",
    "sourceIds": [
      "source.intraop.upper-gi-hemostasis.chinese-societies-varices-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly checked multisociety EIS subsection supports the varix-level target and fallback role. It does not impose a pinpoint-vessel requirement, quantify adequate visibility or directly compare every rescue technique in this constructed blood-obscured scene. That application requires named clinical review.",
    "applicablePopulation": "Adults with esophageal varices; technical cross-check only, without a new regimen, dose or timing rule.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.laryngeal-pattern.v1",
    "statement": "Pediatric laryngospasm can produce inspiratory effort, paradoxical chest movement and absent airflow; complete closure may be silent.",
    "evidenceCategory": "presentation",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.rch-2021"
    ],
    "certainty": "moderate",
    "limitation": "Interpret with equipment and airway assessment; this pattern is not exclusive to one diagnosis.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.airway-stimulation.v1",
    "statement": "Airway instrumentation in a child with an incompletely suppressed laryngeal reflex can provoke sustained glottic closure.",
    "evidenceCategory": "presentation",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.igarashi-2024",
      "source.intraop.pediatric-anesthesia-events.rch-2021"
    ],
    "certainty": "moderate",
    "limitation": "Mechanistic context, not an exact incidence or anesthesia-depth threshold.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.initial-laryngospasm.v1",
    "statement": "Initial pediatric laryngospasm care includes stopping stimulation and oxygenation/airway maneuvers; IV propofol can deepen anesthesia when closure persists.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.rch-2021"
    ],
    "certainty": "moderate",
    "limitation": "Suction or instrumentation can stimulate the larynx; this does not endorse repeated instrumentation of a closed airway.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.laryngospasm-escalation.v1",
    "statement": "IV succinylcholine is a pediatric rescue option for persistent laryngospasm after initial measures and deeper anesthesia, with tracheal airway control as needed to restore ventilation.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.rch-2021"
    ],
    "certainty": "moderate",
    "limitation": "The emergency item names IV succinylcholine without dose or timing. Contraindications and the complete rescue protocol require clinician review; no adult regimen is transferred.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.postobstructive-edema.v1",
    "statement": "Strong inspiratory effort against upper-airway obstruction can be followed by pulmonary edema after airway patency returns.",
    "evidenceCategory": "presentation",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.igarashi-2024"
    ],
    "certainty": "moderate",
    "limitation": "Recognized complication rather than an inevitable result or a probability; other pulmonary causes still require assessment.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.edema-support.v1",
    "statement": "Pink frothy tracheal secretions and persistent oxygenation difficulty after laryngospasm may require tracheal ventilation, PEEP and intensive-care escalation for pulmonary edema.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.igarashi-2024"
    ],
    "certainty": "moderate",
    "limitation": "SPA directly supports the treatment/disposition components; the independent review corroborates the mechanism. No PEEP level or universal intubation cutoff is claimed.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.bronchospasm-pattern.v1",
    "statement": "Pediatric peri-anesthetic bronchospasm can cause expiratory wheezing, higher airway pressure and an altered expiratory carbon-dioxide pattern.",
    "evidenceCategory": "presentation",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "Mechanical causes can resemble this pattern. No diagnostic sensitivity or numeric threshold is asserted.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.mechanical-check.v1",
    "statement": "Tube obstruction, including secretions, can resemble pediatric bronchospasm; assess tracheal-tube position and patency before attributing raised airway pressure to bronchoconstriction.",
    "evidenceCategory": "evaluation",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025"
    ],
    "certainty": "moderate",
    "limitation": "One direct pediatric perioperative source independently verifies this specific diagnostic check in this ledger.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1",
    "statement": "Inhaled albuterol is a pediatric acute bronchodilator option when bronchoconstriction is present and the airway permits drug delivery.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "No dose, puff count or redosing interval is authored. The case documents ongoing airflow and preserved circulation.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1",
    "statement": "Severe or refractory pediatric bronchospasm may require systemic rescue; an exposure-related respiratory event with circulatory compromise changes the rescue priority.",
    "evidenceCategory": "safety_boundary",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "An absent rash does not exclude anaphylaxis. Ranking uses the full exposure/perfusion/ventilation course, not a single skin finding.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.steroid-role.v1",
    "statement": "Dexamethasone is an anti-inflammatory corticosteroid adjunct in pediatric acute asthma; it does not replace prompt bronchodilation for current bronchoconstriction.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "Single-source support for this ranking boundary. Steroids may be appropriate adjuncts while rescue bronchodilation continues.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.magnesium-role.v1",
    "statement": "Intravenous magnesium is an escalation option for pediatric bronchospasm persisting despite initial bronchodilator treatment.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "No dose/rate is authored. The case has not yet received an inhaled beta agonist at the initial checkpoint.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.incomplete-expiration.v1",
    "statement": "Insufficient expiratory time during ventilation of a child with obstructed airways can cause air trapping, overexpansion and cardiovascular compromise.",
    "evidenceCategory": "safety_boundary",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "Single-source pediatric ICU-asthma support. Persistent flow at the next inspiration is an independently synthesized application of incomplete exhalation; intraoperative applicability needs clinician confirmation.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.expiratory-adjustment.v1",
    "statement": "With pediatric expiratory obstruction and air trapping, decrease respiratory frequency and allow longer exhalation instead of normalizing carbon dioxide with faster breaths.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "Single-source comparative support. Accept some hypercapnia with clinical monitoring; no exact rate, pressure, ratio, gas target or preferred ventilator mode is specified.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.peep-disagreement.v1",
    "statement": "External PEEP can improve airway patency or worsen hyperinflation in pediatric obstructive disease depending on physiology; it is not a universal correction for air trapping.",
    "evidenceCategory": "safety_boundary",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "conflicting",
    "limitation": "The source preserves competing approaches. No fixed asthma PEEP key or setting is scored; pulmonary-edema support is a separate context.",
    "applicablePopulation": "Children aged 5-17 receiving anesthesia for supported procedures; exact synthetic profiles are ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.r1.ipratropium-adjunct.v1",
    "statement": "In pediatric acute bronchoconstriction, inhaled ipratropium is an adjunct to a short-acting beta agonist rather than a replacement for initial albuterol.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.cps-acute-asthma-2021",
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "This selects the first bronchodilator in the stated stable-delivery checkpoint; it does not prohibit combining agents for more severe disease.",
    "applicablePopulation": "Pediatric procedural anesthesia; the authored exact profiles remain ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.r1.pressure-time-volume.v1",
    "statement": "During time-cycled pressure-controlled ventilation, delivered tidal volume depends on the pressure target, inspiratory time and respiratory mechanics.",
    "evidenceCategory": "definition",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.pavone-ventilation-2020",
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "The item specifies mandatory time-triggered breaths and independently set inspiratory time. No mode superiority or exact pressure/time threshold is claimed.",
    "applicablePopulation": "Pediatric procedural anesthesia; the authored exact profiles remain ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.r1.inspiratory-time-tradeoff.v1",
    "statement": "When inspiratory flow continues at time cycling in pressure control, shortening inspiration can further reduce the volume delivered during that breath.",
    "evidenceCategory": "safety_boundary",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.pavone-ventilation-2020"
    ],
    "certainty": "moderate",
    "limitation": "Explicit physiologic application of the source-described pressure/time/volume relationship, not an empirical cutoff or universal prohibition. The constructed child already has reduced delivered volumes; ranking needs clinician review.",
    "applicablePopulation": "Pediatric procedural anesthesia; the authored exact profiles remain ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.r1.mandatory-rate-expiration.v1",
    "statement": "With fixed inspiratory time, reducing mandatory breath frequency increases the time available for exhalation without shortening inspiration.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.pavone-ventilation-2020",
      "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024"
    ],
    "certainty": "moderate",
    "limitation": "Mechanistic inference for the stated control mode, linked to directly pediatric obstructive-ventilation guidance. Ongoing gas exchange and circulation still need reassessment.",
    "applicablePopulation": "Pediatric procedural anesthesia; the authored exact profiles remain ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-anesthesia-events.r1.clear-airway-lung-priority.v1",
    "statement": "After effective clearance of a currently patent tracheal airway, persistent pulmonary oxygenation difficulty with postobstructive edema findings calls for lung support rather than repeated airway clearance as the immediate priority.",
    "evidenceCategory": "management",
    "sourceIds": [
      "source.intraop.pediatric-anesthesia-events.spa-2025",
      "source.intraop.pediatric-anesthesia-events.igarashi-2024"
    ],
    "certainty": "moderate",
    "limitation": "Case-specific prioritization inferred from the pediatric airway-check and edema-support facts. Secretions that again obstruct the tube would change the immediate priority; clinician confirmation remains required.",
    "applicablePopulation": "Pediatric procedural anesthesia; the authored exact profiles remain ages 7 and 12.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.ring-entry",
    "statement": "When the vas and gonadal vessels continue through the deep ring, the operative search proceeds into the inguinal canal.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.he-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The guideline supplies the management rule; the independent regression series corroborates the anatomical category, not a randomized comparison of approaches.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.vas-vessel-separation",
    "statement": "The vas and gonadal vessels can have different operative courses; the endpoint of the vas does not by itself establish the endpoint of the vessels.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.he-2022"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Anatomical boundary, not a frequency estimate. Complete testicular-epididymal dissociation is uncommon and is not diagnosed solely from this fictional initial view.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.incomplete-exploration",
    "statement": "An apparent distal remnant without a demonstrated gonadal vascular endpoint is insufficient to conclude that the nonpalpable testis has been fully accounted for.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.he-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The guideline requires confident accounting for gonadal tissue, vas and vessels. Independent support concerns anatomical dissociation; exact next-step ranking still needs pediatric surgical review.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.length-mobilization",
    "statement": "Persistent fibrous attachments and retroperitoneal vascular attachments can limit descent and may be mobilized before concluding that vessel-preserving orchiopexy is impossible.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.pogorelic-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Technique depends on safely identified anatomy and surgeon expertise. The independent cohort is younger than this art-supported population; no fixed dissection extent is prescribed.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.fs-length-boundary",
    "statement": "Fowler-Stephens orchiopexy is an option when adequate scrotal reach cannot be achieved while retaining the gonadal vessels despite appropriate mobilization.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.pogorelic-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Does not rank one-stage versus two-stage Fowler-Stephens or traction techniques. Those competing strategies for persistent short vessels remain outside the scored packet.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.primary-completion",
    "statement": "A testis that reaches a scrotal pouch without cord tension can undergo primary orchiopexy with its gonadal vessels retained.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.pogorelic-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No distance threshold, fixation method, guarantee of viability or success percentage is asserted. The independent series supports technique in a younger cohort.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.smaller-testis",
    "statement": "Smaller testicular size is not equivalent to a fibrous remnant; a smaller but formed testis can be retained during orchiopexy.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.pogorelic-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This is not an instruction to preserve a necrotic testis or a suspicious mass. The primary cohort retained hypotrophic testes, mostly in younger children; extrapolation to an older prepubertal child requires clinician confirmation.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.postpubertal-boundary",
    "statement": "Recommendations favoring removal of a small unilateral undescended testis in a postpubertal male should not be applied automatically to a prepubertal child.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single eligible society guideline for this exact population boundary; no numerical puberty cutoff or mandatory operation for every adolescent is taught.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.vascular-protection",
    "statement": "Damage to the gonadal vessels during orchiopexy can lead to testicular atrophy.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.pogorelic-2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "General operative hazard; no exact probability, inevitable outcome or fertility prediction is asserted.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.blind-end-conflict",
    "statement": "Older society guidance allows stopping after confirmed blind-ended vas and vessels, while a later retrospective series found distal remnants despite that laparoscopic appearance.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.mao-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "conflicting",
    "limitation": "Withheld from scored teaching. A clinician must resolve whether additional distal exploration is appropriate; no inference about malignant transformation or viable whole testes is made from remnant histology.",
    "applicablePopulation": "Boys with an undescended/nonpalpable testis undergoing specialist exploration or orchiopexy; clinical age and anatomy require exact-version review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.r1.remnant-verification",
    "statement": "A specimen labelled as a testicular remnant must be assessed against its actual tissue and associated cord structures before it is used to conclude that gonadal tissue has been accounted for.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.he-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The society guideline supplies the incomplete-exploration management boundary; the regression series is a histology/anatomy cross-check. Absence of germ cells alone does not invalidate a genuine regressed testis, and no such rule is taught.",
    "applicablePopulation": "Children undergoing specialist nonpalpable-testis exploration or orchiopexy; exact older-child anatomy and operative ranking require review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.r1.medial-descent-route",
    "statement": "A channel medial to the inferior epigastric vessels can shorten an angled route to the scrotum while retaining the gonadal vessels.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.cua-puc-2017",
      "source.intraop.pediatric-orchiopexy.he-prentiss-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The primary study describes a modified Prentiss channel that also preserves the epigastric vessels. No universal superiority, exact length gain, maximum age or obligatory step order is claimed; the fictional traction geometry determines the proposed ranking.",
    "applicablePopulation": "Children undergoing specialist nonpalpable-testis exploration or orchiopexy; exact older-child anatomy and operative ranking require review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.pediatric-orchiopexy.r1.channel-patency",
    "statement": "The descent passage must permit smooth testicular and cord passage; a restrictive passage is a different operative problem from a long or angled proximal route.",
    "sourceIds": [
      "source.intraop.pediatric-orchiopexy.he-prentiss-2022",
      "source.intraop.pediatric-orchiopexy.pogorelic-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Technique reports support channel expansion and direct-view inspection. No numerical caliber threshold, automatic benefit from widening a loose passage or claim of long-term function is asserted.",
    "applicablePopulation": "Children undergoing specialist nonpalpable-testis exploration or orchiopexy; exact older-child anatomy and operative ranking require review.",
    "lastCheckedOn": "2026-11-12",
    "localMappingCheckedOn": "2026-11-12"
  }
];
export const PROGRAM_BATCH10_SOURCES:Array<ClinicalSource & Record<string,unknown>> = [
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.aoa2025",
    "title": "Association of Anaesthetists guidelines: safe vascular access 2025",
    "completeCitation": "Johnston AJ, Simpson MJ, McCormack V, Barton A, Bennett J, Chalisey A, Crane J, Curry S, Laycock H, Patel D, See T, Shubhaker J, Singh K, Thornton S. Association of Anaesthetists guidelines: safe vascular access 2025. Anaesthesia. 2025;80(11):1381-1396. doi:10.1111/anae.16727.",
    "organizationOrJournal": "Anaesthesia / Association of Anaesthetists",
    "authors": [
      "Andrew J Johnston",
      "Matthew J Simpson",
      "Victoria McCormack",
      "Andrew Barton",
      "James Bennett",
      "Anil Chalisey",
      "Jeremy Crane",
      "Stefanie Curry",
      "Helen Laycock",
      "Dhupal Patel",
      "Teikchoon See",
      "John Shubhaker",
      "Kathryn Singh",
      "Sarah Thornton"
    ],
    "publicationYear": 2025,
    "doi": "10.1111/anae.16727",
    "pmid": "40958714",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12519924/",
    "accessedOn": "2026-11-12",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY-NC-ND 4.0; https://creativecommons.org/licenses/by-nc-nd/4.0/",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article-specific license checked. Targeted factual verification of society guidance only; no protected expression is adapted, redistributed or stored. NC/ND is not represented as permission to produce commercial adaptations. No article-specific automated/AI access prohibition was found in the accessed notice.",
    "authorityAssessment": "Current multidisciplinary consensus; technical insertion and arterial-device recommendations are expert guidance, not trial-derived exact event probabilities. References overlap with earlier ASA guidance; not independent clinical outcome evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.wire-confirmation",
      "claim.intraop.asc-access.needle-wire-distinction",
      "claim.intraop.asc-access.wire-ultrasound",
      "claim.intraop.asc-access.needle-blood-assessment",
      "claim.intraop.asc-access.arterial-retain",
      "claim.intraop.asc-access.arterial-size-boundary",
      "claim.intraop.asc-access.arterial-extraction-risk",
      "claim.intraop.asc-access.arterial-controlled-removal",
      "claim.intraop.asc-access.port-tributary",
      "claim.intraop.asc-access.port-reposition",
      "claim.intraop.asc-access.port-aspiration-limit"
    ],
    "verificationLocator": "Insertion section: wire confirmation, catheter alignment/tip position and arterial-device retention. Recommendation 5 directly specifies the >=6-Fr boundary."
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.asa2012",
    "title": "Practice guidelines for central venous access: a report by the American Society of Anesthesiologists Task Force on Central Venous Access",
    "completeCitation": "American Society of Anesthesiologists Task Force on Central Venous Access; Rupp SM, Apfelbaum JL, Blitt C, Caplan RA, Connis RT, Domino KB, Fleisher LA, Grant S, Mark JB, Morray JP, Nickinovich DG, Tung A. Practice guidelines for central venous access. Anesthesiology. 2012;116(3):539-573. doi:10.1097/ALN.0b013e31823c9569.",
    "organizationOrJournal": "Anesthesiology / American Society of Anesthesiologists",
    "authors": [
      "ASA Task Force on Central Venous Access",
      "Stephen M Rupp",
      "Jeffrey L Apfelbaum",
      "Casey Blitt",
      "Robert A Caplan",
      "Richard T Connis",
      "Karen B Domino",
      "Lee A Fleisher",
      "Stuart Grant",
      "Jonathan B Mark",
      "Jeffrey P Morray",
      "David G Nickinovich",
      "Avery Tung"
    ],
    "publicationYear": 2012,
    "doi": "10.1097/ALN.0b013e31823c9569",
    "pmid": "22307320",
    "officialUrl": "https://www.asahq.org/~/media/sites/asahq/files/public/resources/standards-guidelines/practice-guidelines-for-central-venous-access.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASA / Lippincott Williams & Wilkins; publicly hosted society guideline",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Official public society PDF read only for selected confirmation and arterial-injury facts. No prose, tables, algorithms or figures retained. The title page identifies 2012; it is not mislabeled as the 2020 update.",
    "authorityAssessment": "Superseded technical cross-check, not the current primary guideline. The directly accessed 2025 guideline corroborates the authored wire and large-device principles. 2020 DOI access returned a payment error and its snippets were not used as evidence.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.wire-confirmation",
      "claim.intraop.asc-access.needle-wire-distinction",
      "claim.intraop.asc-access.wire-ultrasound",
      "claim.intraop.asc-access.needle-blood-assessment",
      "claim.intraop.asc-access.arterial-retain",
      "claim.intraop.asc-access.arterial-extraction-risk",
      "claim.intraop.asc-access.arterial-controlled-removal",
      "claim.intraop.asc-access.arterial-waveform"
    ],
    "verificationLocator": "Printed pp.546-548, needle/wire verification and management of arterial trauma; blood gas is an initial blood-origin check, not a location test of a later wire."
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.jsir2023",
    "title": "Guidelines for Central Venous Port Placement and Management (Abridged Translation of the Japanese Version)",
    "completeCitation": "Sugawara S, Sone M, Sakamoto N, Sofue K, Hashimoto K, Arai Y, Tokue H, Takigawa M, Mimura H, Yamanishi T, Yamagami T. Guidelines for Central Venous Port Placement and Management (Abridged Translation of the Japanese Version). Interventional Radiology. 2023;8(2):105-117. doi:10.22575/interventionalradiology.2022-0015.",
    "organizationOrJournal": "Interventional Radiology / Japanese Society of Interventional Radiology",
    "authors": [
      "Shunsuke Sugawara",
      "Miyuki Sone",
      "Noriaki Sakamoto",
      "Keitaro Sofue",
      "Kazuki Hashimoto",
      "Yasuaki Arai",
      "Hiroyuki Tokue",
      "Masakazu Takigawa",
      "Hidefumi Mimura",
      "Tomoaki Yamanishi",
      "Takuji Yamagami"
    ],
    "publicationYear": 2023,
    "doi": "10.22575/interventionalradiology.2022-0015",
    "pmid": null,
    "officialUrl": "https://www.jstage.jst.go.jp/article/interventionalradiology/8/2/8_2022-0015/_article",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2023 Japanese Society of Interventional Radiology; public open-access guideline; no particular reusable license established from accessed PDF",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "J-STAGE full society PDF accessed through the article download link. Targeted factual verification only. No copied procedural list, illustrations, tables or recommendations; no claim that the open-access label grants adaptation rights.",
    "authorityAssessment": "Port-specific guideline combining systematic clinical-question work and technical consensus. Suitable for imaging and malposition correction; does not prove that this simulated ASC has the equipment or rescue resources.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.port-tributary",
      "claim.intraop.asc-access.port-reposition",
      "claim.intraop.asc-access.port-route-constraint"
    ],
    "verificationLocator": "Printed pp.107-108, placement/fluoroscopic confirmation and catheter deviation/repositioning. PDF: https://www.jstage.jst.go.jp/article/interventionalradiology/8/2/8_2022-0015/_pdf/-char/en"
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.ports2019",
    "title": "Complications of central venous port systems: a pictorial review",
    "completeCitation": "Machat S, Eisenhuber E, Pfarl G, Stuebler J, Koelblinger C, Zacherl J, Schima W. Complications of central venous port systems: a pictorial review. Insights into Imaging. 2019;10:86. doi:10.1186/s13244-019-0770-2.",
    "organizationOrJournal": "Insights into Imaging",
    "authors": [
      "Sibylle Machat",
      "Edith Eisenhuber",
      "Georg Pfarl",
      "Josef Stuebler",
      "Claus Koelblinger",
      "Johannes Zacherl",
      "Wolfgang Schima"
    ],
    "publicationYear": 2019,
    "doi": "10.1186/s13244-019-0770-2",
    "pmid": "31463643",
    "officialUrl": "https://link.springer.com/article/10.1186/s13244-019-0770-2",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Publisher Rights and permissions section checked. Full author/title/DOI attribution and license URL retained. Only underlying facts independently synthesized; no source images, tables, cases or expressions reproduced.",
    "authorityAssessment": "Peer-reviewed educational review with explicit orthogonal internal-mammary/venous malposition example. Used for anatomy and the limitation of a frontal projection, not its incidence estimates or exact tip targets.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.arterial-extraction-risk",
      "claim.intraop.asc-access.port-orthogonal-course",
      "claim.intraop.asc-access.port-tributary",
      "claim.intraop.asc-access.port-reposition",
      "claim.intraop.asc-access.port-aspiration-limit",
      "claim.intraop.asc-access.port-route-constraint"
    ],
    "verificationLocator": "Common malpositioning, normal flow confirmation, arterial malposition and serious complications sections; AP versus lateral internal mammary course is verified without copying the figure."
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.ahs2013",
    "title": "Skin Excision - Orientation Guidelines",
    "completeCitation": "Alberta Health Services Laboratory Services. Skin Excision - Orientation Guidelines. Laboratory Bulletin, South Zone West. July 9, 2013. Reviewed and approved by Valerie Boras, Acting Zone Clinical Department Head, Laboratory Medicine, South Zone.",
    "organizationOrJournal": "Alberta Health Services Laboratory Services",
    "authors": [
      "Alberta Health Services Laboratory Services"
    ],
    "publicationYear": 2013,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.albertahealthservices.ca/assets/wf/lab/wf-lab-bulletin-szw-skin-excision-orientation-final.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "AHS copyright; public provincial-health laboratory bulletin; personal/noncommercial site-use conditions",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Bulletin and https://www.albertahealthservices.ca/about/Page635.aspx checked. Government-health factual verification only; no bulletin diagram or prose reproduced, no commercial redistribution license assumed. No explicit automated/AI-use prohibition appeared in the accessed terms.",
    "authorityAssessment": "Older local government-health laboratory guidance directly about skin orientation; current 2026 skin-biopsy review independently corroborates use of meaningful specimen orientation. Not evidence for tumor-management extent or clearance.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.specimen-orientation",
      "claim.intraop.asc-access.fragment-limits",
      "claim.intraop.asc-access.marker-specificity"
    ],
    "verificationLocator": "Single-page orientation bulletin: distinct markers, anatomic designations and a request-form diagram."
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.skin2026",
    "title": "Basic Principles of Skin Biopsy Optimization in Dermatopathology",
    "completeCitation": "Llamas-Velasco M, Rozas-Munoz E, Fernandez-Flores A, Fernandez-Figueras MT. Basic Principles of Skin Biopsy Optimization in Dermatopathology. Dermatopathology. 2026;13(3):42. doi:10.3390/dermatopathology13030042.",
    "organizationOrJournal": "Dermatopathology / European Society of Dermatopathology",
    "authors": [
      "Mar Llamas-Velasco",
      "Eduardo Rozas-Munoz",
      "Angel Fernandez-Flores",
      "Maria-Teresa Fernandez-Figueras"
    ],
    "publicationYear": 2026,
    "doi": "10.3390/dermatopathology13030042",
    "pmid": null,
    "officialUrl": "https://www.mdpi.com/2296-3529/13/3/42",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article publication date (8 September 2026), author list and article-specific CC BY notice verified on publisher page. Full citation/license supplied; no source cases, figures, tables or wording adapted.",
    "authorityAssessment": "Recent specialist review; supports meaningful orientation, specimen integrity and communication. It is not a guideline requiring a routine additional bed margin for any skin diagnosis.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.specimen-orientation",
      "claim.intraop.asc-access.fragment-limits",
      "claim.intraop.asc-access.site-versus-face",
      "claim.intraop.asc-access.marker-specificity"
    ],
    "verificationLocator": "Sections 3.6.3 and 3.7.1: compartment representation, clinically relevant orientation, handling and fragmentation limitations."
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.rcpath2024",
    "title": "Dataset for histopathological reporting of breast disease in surgical excision specimens of breast cancer",
    "completeCitation": "Deb R, Pinder SE, Boyd C, Callagy G, Carder PJ, Lee AHS, Mir Y, Provenzano E, Quinn C, Rakha E, Shaaban A, Tanchel B. Dataset for histopathological reporting of breast disease in surgical excision specimens of breast cancer. Royal College of Pathologists. November 2024; G148, version 3.",
    "organizationOrJournal": "Royal College of Pathologists / UK National Coordinating Committee for Breast Pathology",
    "authors": [
      "Rahul Deb",
      "Sarah E Pinder",
      "C Boyd",
      "G Callagy",
      "PJ Carder",
      "AHS Lee",
      "Y Mir",
      "E Provenzano",
      "C Quinn",
      "E Rakha",
      "A Shaaban",
      "B Tanchel"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://associationofbreastsurgery.org.uk/media/1pyhugk4/g148-dataset-for-histopathological-reporting-of-breast-disease.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2024 Royal College of Pathologists; personal/noncommercial document-use permission",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Public professional-society copy on Association of Breast Surgery read only for the small orientation passage and front-matter rights/citation. No complete text, proforma, diagram or protected expression stored or adapted.",
    "authorityAssessment": "Current professional dataset, with review due November 2026. Used only for a general specimen face-marking principle and the fact that a suture can denote cavity side or new margin. Applying this geometry to a skin excision is an explicit limited extrapolation, not adoption of breast cancer surgery.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.fragment-limits",
      "claim.intraop.asc-access.site-versus-face",
      "claim.intraop.asc-access.additional-margin-boundary",
      "claim.intraop.asc-access.marker-specificity"
    ],
    "verificationLocator": "Printed pp.34-36: cavity-side versus new-margin marker convention, explicit site identification and separately submitted specimens."
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.aoa2016",
    "title": "Association of Anaesthetists of Great Britain and Ireland: Safe vascular access 2016",
    "completeCitation": "Bodenham A, Babu S, Bennett J, Binks R, Fee P, Fox B, Johnston AJ, Klein AA, Langton JA, McLure H, Tighe SQM. Association of Anaesthetists of Great Britain and Ireland: Safe vascular access 2016. Anaesthesia. 2016;71(5):573-585. doi:10.1111/anae.13360.",
    "organizationOrJournal": "Anaesthesia / Association of Anaesthetists of Great Britain and Ireland",
    "authors": [
      "A Bodenham",
      "S Babu",
      "J Bennett",
      "R Binks",
      "P Fee",
      "B Fox",
      "AJ Johnston",
      "AA Klein",
      "JA Langton",
      "H McLure",
      "SQM Tighe"
    ],
    "publicationYear": 2016,
    "doi": "10.1111/anae.13360",
    "pmid": null,
    "officialUrl": "https://associationofanaesthetists-publications.onlinelibrary.wiley.com/doi/10.1111/anae.13360",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2016 authors / Association; public open-access society guideline, no reusable license version asserted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted reading of arterial puncture and cannulation paragraphs only; no protected expression or algorithm reused. Public availability is not treated as adaptation permission.",
    "authorityAssessment": "Superseded consensus used only for the explicitly stated small-needle distinction and waveform recognition; current 2025 guidance controls the large-device decision. Not independent evidence from the same society lineage.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.needle-only-compression",
      "claim.intraop.asc-access.arterial-waveform"
    ],
    "verificationLocator": "Arterial puncture and accidental arterial cannulation sections. Needle removal/compression and arterial waveform interpretation are directly described; no durations or small-catheter thresholds are imported."
  },
  {
    "contentVersion": "clinical.question-intraop-asc-access-and-soft-tissue-surprises.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.asc-access.saugel2017.r1",
    "title": "Ultrasound-guided central venous catheter placement: a structured review and recommendations for clinical practice",
    "completeCitation": "Saugel B, Scheeren TWL, Teboul JL. Ultrasound-guided central venous catheter placement: a structured review and recommendations for clinical practice. Critical Care. 2017;21:225. doi:10.1186/s13054-017-1814-y.",
    "organizationOrJournal": "Critical Care",
    "authors": [
      "Bernd Saugel",
      "Thomas W L Scheeren",
      "Jean-Louis Teboul"
    ],
    "publicationYear": 2017,
    "doi": "10.1186/s13054-017-1814-y",
    "pmid": "28844205",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5572160/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-specific CC BY 4.0 notice checked during round1. Full author/title/DOI and license attribution retained. Only targeted underlying technical facts synthesized; no figures, six-step list, tables, source examples or protected wording reproduced.",
    "authorityAssessment": "Peer-reviewed structured technical review with clinical recommendations, independently authored from the current Association guideline. Used for the separate functions of Doppler, compression and wire localization; it is older evidence, not a comparative trial ranking every confirmation method.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.asc-access.r1.doppler-purpose",
      "claim.intraop.asc-access.r1.compressibility-purpose"
    ],
    "verificationLocator": "Identify anatomy / confirm patency / confirm wire-position sections: Doppler characterizes vessel flow, compression assesses venous patency, and actual wire location is confirmed in complementary views."
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop-biliary.wses-bdi-2021",
    "title": "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
    "completeCitation": "de'Angelis N, Catena F, Memeo R, et al. 2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy. World Journal of Emergency Surgery. 2021;16:30. doi:10.1186/s13017-021-00369-w.",
    "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    "authors": [
      "Nicola de'Angelis",
      "Fausto Catena",
      "Riccardo Memeo"
    ],
    "publicationYear": 2021,
    "doi": "10.1186/s13017-021-00369-w",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-021-00369-w",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Targeted reading of the publisher-hosted open-access guideline; article-specific CC BY 4.0 grant verified. Independently synthesized facts only; no copied source prose, table, figure or algorithm. Attribution: de'Angelis and colleagues, WJES 2021; original synthesis is a change, not an endorsed adaptation.",
    "authorityAssessment": "International clinical guideline using graded recommendations. The specific operative-management recommendations rely substantially on low-quality evidence and expert practice.",
    "evidenceClaimIds": [
      "claim.intraop-biliary.unexplained-bile.v1",
      "claim.intraop-biliary.injury-imaging.v1",
      "claim.intraop-biliary.major-discontinuity.v1",
      "claim.intraop-biliary.expert-transfer.v1",
      "claim.intraop-biliary.limited-repair.v1",
      "claim.intraop-biliary.identification-before-division.v1",
      "claim.intraop-biliary.staging-conversion.v1",
      "claim.intraop-biliary.papillary-continuity.v1",
      "claim.intraop-biliary.ioc-versus-fluorescence.v1"
    ],
    "accessedOn": "2026-11-12",
    "usageRole": "both",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop-biliary.sages-safe-2020",
    "title": "Safe cholecystectomy multi-society practice guideline",
    "completeCitation": "Brunt LM, Deziel DJ, Telem DA, et al. Safe cholecystectomy multi-society practice guideline and state-of-the-art consensus conference on prevention of bile duct injury during cholecystectomy. Surgical Endoscopy. 2020;34:2827-2855. doi:10.1007/s00464-020-07568-7. Official SAGES guideline webpage.",
    "organizationOrJournal": "SAGES and collaborating surgical societies / Surgical Endoscopy",
    "authors": [
      "L. Michael Brunt",
      "Daniel J. Deziel",
      "Dana A. Telem"
    ],
    "publicationYear": 2020,
    "doi": "10.1007/s00464-020-07568-7",
    "pmid": "32399938",
    "officialUrl": "https://www.sages.org/publications/guidelines/safe-cholecystectomy-multi-society-practice-guideline/",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Official public guideline checked only for suspected-injury imaging and specialist referral. Copyright reserved; no permission for bulk extraction or text reuse is inferred. The accessed guideline/footer shows no AI-specific prohibition. A guessed terms-of-use endpoint was inaccessible and an official-domain terms search did not establish additional terms; this is not a general automation license.",
    "authorityAssessment": "Multi-society surgical guideline. Suspected-injury imaging and specialist referral recommendations are strong, while evidence certainty is very low/low.",
    "evidenceClaimIds": [
      "claim.intraop-biliary.injury-imaging.v1",
      "claim.intraop-biliary.expert-transfer.v1",
      "claim.intraop-biliary.identification-before-division.v1"
    ],
    "accessedOn": "2026-11-12",
    "usageRole": "both"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop-biliary.sages-ahpba-bdi-2025",
    "title": "SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy",
    "completeCitation": "Calabrese EC, Slater BJ, Awad Z, et al. SAGES-AHPBA 2025 guideline for the surgical management of bile duct injury following cholecystectomy. SAGES and Americas Hepato-Pancreato-Biliary Association. 2025. Official guideline webpage.",
    "organizationOrJournal": "SAGES / Americas Hepato-Pancreato-Biliary Association",
    "authors": [
      "Elisa C. Calabrese",
      "Bethany J. Slater",
      "Ziad Awad"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.sages.org/publications/guidelines/guideline-for-the-management-of-bdi-following-cholecystectomy/",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Current official recommendations checked for temporization when HPB expertise is absent and limitations on definitive-repair recommendations. Same targeted-access assessment as the SAGES 2020 source; no copied expression, repair algorithm or numeric timing rule is stored.",
    "authorityAssessment": "Current jointly developed GRADE guideline, with literature search through December 2024. Definitive-repair recommendations are conditional with very low certainty; injury anatomy and expert availability matter.",
    "evidenceClaimIds": [
      "claim.intraop-biliary.major-discontinuity.v1",
      "claim.intraop-biliary.expert-transfer.v1",
      "claim.intraop-biliary.limited-repair.v1",
      "claim.intraop-biliary.papillary-continuity.v1"
    ],
    "accessedOn": "2026-11-12",
    "usageRole": "both"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop-biliary.brazil-gbc-2020",
    "title": "Brazilian consensus on incidental gallbladder carcinoma",
    "completeCitation": "Grupo Internacional de Estudos de Câncer Hepatopancreatobiliar - ISG-HPB-Cancer; Coimbra FJF, Torres OJM, Alikhanov R, et al. Brazilian consensus on incidental gallbladder carcinoma. ABCD Arquivos Brasileiros de Cirurgia Digestiva. 2020;33(1):e1496. doi:10.1590/0102-672020190001e1496.",
    "organizationOrJournal": "ABCD Arquivos Brasileiros de Cirurgia Digestiva / ISG-HPB-Cancer",
    "authors": [
      "Grupo Internacional de Estudos de Câncer Hepatopancreatobiliar - ISG-HPB-Cancer",
      "Felipe Jose F. Coimbra",
      "Orlando Jorge M. Torres",
      "Ruslan Alikhanov"
    ],
    "publicationYear": 2020,
    "doi": "10.1590/0102-672020190001e1496",
    "pmid": "32667526",
    "officialUrl": "https://www.scielo.br/j/abcd/a/njRZhFVvsLj3XSBzqSCpBxy/?lang=en",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International (article license link)",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "SciELO-hosted article-specific Creative Commons Attribution link checked, rather than assuming PMC availability is a license. Credit Coimbra, Torres, Alikhanov and the ISG-HPB-Cancer group. No source prose, tables, illustrations or algorithms copied; observations and questions are independently constructed. Only underlying retrieval/pathology facts are used.",
    "authorityAssessment": "Multinational expert Delphi consensus, not a randomized comparison of extraction techniques. The exact operative option ranking needs surgeon review; this source supplies the intact/bagged retrieval principle.",
    "evidenceClaimIds": [
      "claim.intraop-biliary.intact-retrieval.v1",
      "claim.intraop-biliary.histology-required.v1",
      "claim.intraop-biliary.t1a-followup.v1",
      "claim.intraop-biliary.t2-completion.v1"
    ],
    "accessedOn": "2026-11-12",
    "usageRole": "both",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop-biliary.nci-gbc-2025",
    "title": "Gallbladder Cancer Treatment (PDQ), Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Gallbladder Cancer Treatment (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Updated February 12, 2025. Accessed November 12, 2026. PMID:26389371.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": "26389371",
    "officialUrl": "https://www.cancer.gov/types/gallbladder/hp/gallbladder-treatment-pdq",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government text with PDQ conditions and third-party exclusions",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "The page permits use of its summary text with conditions; this packet uses independently written underlying facts and cites the source. No PDQ branding claim, image or copyrighted AJCC staging table is reproduced. Used to cross-check existing final-pathology coverage; no new pathology question authored.",
    "authorityAssessment": "Regularly reviewed US government professional cancer evidence summary. Corroborates superficial-disease and deeper-disease treatment boundaries; it does not grant clinical approval to game content.",
    "evidenceClaimIds": [
      "claim.intraop-biliary.histology-required.v1",
      "claim.intraop-biliary.t1a-followup.v1",
      "claim.intraop-biliary.t2-completion.v1"
    ],
    "accessedOn": "2026-11-12",
    "usageRole": "both"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop-biliary.sages-imaging-2025",
    "title": "SAGES guidelines for intraoperative imaging of the common bile duct",
    "completeCitation": "Kumar SK, Shehata DG, Cetrulo LN, et al. SAGES guidelines for the use of intraoperative imaging of the common bile duct. Surgical Endoscopy. 2025;39:7091-7102. doi:10.1007/s00464-025-12142-0. Official SAGES guideline webpage; KQ2 and executive recommendations.",
    "organizationOrJournal": "Society of American Gastrointestinal and Endoscopic Surgeons (SAGES)",
    "authors": [
      "Sunjay K. Kumar",
      "Dena G. Shehata",
      "Lawrence N. Cetrulo",
      "Romeo Ignacio",
      "Jeffrey Chiu",
      "Brian R. Davis",
      "Marian McDonald",
      "Matthew B. Bloom",
      "Subhashini Ayloo",
      "Ali Kchaou",
      "Georgios Orthopoulos",
      "Philip H. Pucher",
      "Uretz Oliphant",
      "Peter T. Hallowell",
      "Federico Serrot",
      "David Overby",
      "Eduardo Moreno-Paquentin",
      "Bethany J. Slater",
      "Emily Miraflor"
    ],
    "publicationYear": 2025,
    "doi": "10.1007/s00464-025-12142-0",
    "pmid": "40935939",
    "officialUrl": "https://www.sages.org/publications/guidelines/guidelines-for-the-use-of-intraoperative-imaging-of-the-cbd/",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Official public society page used for targeted factual verification and citation only. The visible page/footer shows reserved copyright without an AI-specific prohibition; no general reuse license, bulk ingestion permission, figures or algorithms are inferred or copied. The earlier inaccessible general terms endpoint remains a limitation.",
    "authorityAssessment": "Current society guideline, conditional low-certainty preference for IOC over fluorescence; does not establish universal superiority or a mandatory routine policy.",
    "evidenceClaimIds": [
      "claim.intraop-biliary.ioc-access-route.v1",
      "claim.intraop-biliary.ioc-versus-fluorescence.v1"
    ],
    "accessedOn": "2026-11-12",
    "usageRole": "both"
  },
  {
    "contentVersion": "clinical.intraop.biliary-safety-and-duct-decisions.2026-11-12.salvage",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop-biliary.sages-stones-2021",
    "title": "Clinical spotlight review: management of choledocholithiasis",
    "completeCitation": "Narula VK, Fung EC, Overby DW, Richardson W, Stefanidis D; SAGES Guidelines Committee. Clinical Spotlight Review: Management of Choledocholithiasis. Official SAGES publication; update November 11, 2021. Sections on intraoperative management, transcystic access and transductal exploration.",
    "organizationOrJournal": "Society of American Gastrointestinal and Endoscopic Surgeons (SAGES)",
    "authors": [
      "Vimal K. Narula",
      "Eleanor C. Fung",
      "D. Wayne Overby",
      "William Richardson",
      "Dimitrios Stefanidis",
      "SAGES Guidelines Committee"
    ],
    "publicationYear": 2021,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.sages.org/publications/guidelines/clinical-spotlight-review-management-of-choledocholithiasis-/",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Official public society page used for targeted factual verification and citation only. The visible page/footer shows reserved copyright without an AI-specific prohibition; no general reuse license, bulk ingestion permission, figures or algorithms are inferred or copied. The earlier inaccessible general terms endpoint remains a limitation.",
    "authorityAssessment": "Evidence-informed society clinical review with an explicit 2021 update. Technique and route selection remain dependent on anatomy, skill and resources; exact comparative patient-specific rankings are not trial-proven.",
    "evidenceClaimIds": [
      "claim.intraop-biliary.ioc-access-route.v1",
      "claim.intraop-biliary.stone-route-options.v1",
      "claim.intraop-biliary.friable-cystic-route.v1",
      "claim.intraop-biliary.narrow-common-duct.v1"
    ],
    "accessedOn": "2026-11-12",
    "usageRole": "both"
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
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.suspicious-polyps.singapore-2022",
    "title": "AMS colonic-polyp guidance (2022)",
    "completeCitation": "Ang TL, Lim JF, Chua TS, Tan KY, Li JW, Chong CH, Gwee KA, Namasivayam V, Vu CKF, Khor CJL, Wang LM, Yeoh KG. Clinical guidance on endoscopic management of colonic polyps in Singapore. Singapore Med J. 2022;63(4):173-186. doi:10.11622/smedj.2020108.",
    "organizationOrJournal": "Academy of Medicine, Singapore / Singapore Medical Journal",
    "authors": [
      "Tiing Leong Ang",
      "Jit Fong Lim",
      "Tju Siang Chua",
      "Kok Yang Tan",
      "James Weiquan Li",
      "Chern Hao Chong",
      "Kok Ann Gwee",
      "Vikneswaran Namasivayam",
      "Charles Kien Fong Vu",
      "Christopher Jen Lock Khor",
      "Lai Mun Wang",
      "Khay Guan Yeoh"
    ],
    "publicationYear": 2022,
    "publicationDateNote": "April 2022 issue; evidence search through April 2020.",
    "doi": "10.11622/smedj.2020108",
    "pmid": "32668839",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9251267/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Singapore Medical Association; no Creative Commons grant identified in the accessed article",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Read the accessible professional-society guidance at PMC for targeted factual verification under the repository society-guidance rule. PMC hosting is not a reuse licence. No prose, table, figure, algorithm, excerpt or source file stored. No automated/AI prohibition was identified on the accessed PMC record; no publisher-host access or blanket rights clearance is asserted.",
    "authorityAssessment": "Multidisciplinary society consensus. Recommendations 1-4 and 18 and their discussions support optical assessment, invasive-feature surgical referral and the distinction between en-bloc and piecemeal resection. The fibrosis discussion cross-checks the marking hazard. Not a 2026 update, and not independent replication of the evidence cited by other guidelines.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.suspicious-polyps.nonpedunculated-surgical-route",
      "claim.intraop.suspicious-polyps.superficial-enbloc-boundary",
      "claim.intraop.suspicious-polyps.benign-piecemeal-boundary",
      "claim.intraop.suspicious-polyps.tattoo-fibrosis"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.suspicious-polyps.bsg-acpgbi-2015",
    "title": "BSG/ACPGBI large nonpedunculated polyp guideline (2015)",
    "completeCitation": "Rutter MD, Chattree A, Barbour JA, Thomas-Gibson S, Bhandari P, Saunders BP, Veitch AM, Anderson J, Rembacken BJ, Loughrey MB, Pullan R, Garrett WV, Lewis G, Dolwani S. British Society of Gastroenterology/Association of Coloproctologists of Great Britain and Ireland guidelines for the management of large non-pedunculated colorectal polyps. Gut. 2015;64(12):1847-1873. doi:10.1136/gutjnl-2015-309576.",
    "organizationOrJournal": "British Society of Gastroenterology / Association of Coloproctologists of Great Britain and Ireland / Gut",
    "authors": [
      "Matthew D. Rutter",
      "Amit Chattree",
      "Jamie A. Barbour",
      "Siwan Thomas-Gibson",
      "Pradeep Bhandari",
      "Brian P. Saunders",
      "Andrew M. Veitch",
      "John Anderson",
      "Bjorn J. Rembacken",
      "Maurice B. Loughrey",
      "Rupert Pullan",
      "William V. Garrett",
      "Gethin Lewis",
      "Sunil Dolwani"
    ],
    "publicationYear": 2015,
    "doi": "10.1136/gutjnl-2015-309576",
    "pmid": "26104751",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4680188/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution Non Commercial 4.0 (CC BY-NC 4.0), BMJ Publishing Group",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Authors and publication credited here; licence https://creativecommons.org/licenses/by-nc/4.0/. Only underlying facts independently synthesized; no licensed expression, tables, figures or algorithms adapted. The licence's noncommercial condition is retained; commercial reuse of protected expression is not cleared. PMC access does not independently grant rights. No automated/AI restriction identified on the accessed article.",
    "authorityAssessment": "Primary graded society guidance with literature through May 2014. Targeted optical-pattern, specimen-adequacy and remote-tattoo recommendations checked. The at-least-30-mm marking recommendation has very-low-quality evidence. Its exact distance is a single-guideline technical recommendation, not a physiological threshold. Newer Singapore guidance cross-checks invasive-pattern management and tattoo fibrosis, not the exact distance.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.suspicious-polyps.amorphous-pit-pattern",
      "claim.intraop.suspicious-polyps.nonpedunculated-surgical-route",
      "claim.intraop.suspicious-polyps.targeted-sampling",
      "claim.intraop.suspicious-polyps.superficial-enbloc-boundary",
      "claim.intraop.suspicious-polyps.benign-piecemeal-boundary",
      "claim.intraop.suspicious-polyps.retrieval-fragmentation",
      "claim.intraop.suspicious-polyps.tattoo-fibrosis",
      "claim.intraop.suspicious-polyps.remote-tattoo",
      "claim.intraop.suspicious-polyps.marking-communication"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-suspicious-polyps-retrieval-and-tattoo.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.suspicious-polyps.acpgbi-2013",
    "title": "ACPGBI malignant-polyp position statement (2013)",
    "completeCitation": "Williams JG, Pullan RD, Hill J, Horgan PG, Salmo E, Buchanan GN, Rasheed S, McGee SG, Haboubi N. Management of the malignant colorectal polyp: ACPGBI position statement. Colorectal Dis. 2013;15(Suppl 2):1-38. doi:10.1111/codi.12262.",
    "organizationOrJournal": "Association of Coloproctology of Great Britain and Ireland / Colorectal Disease",
    "authors": [
      "J. Graham Williams",
      "R. D. Pullan",
      "J. Hill",
      "P. G. Horgan",
      "E. Salmo",
      "G. N. Buchanan",
      "S. Rasheed",
      "S. G. McGee",
      "N. Haboubi"
    ],
    "publicationYear": 2013,
    "doi": "10.1111/codi.12262",
    "pmid": null,
    "officialUrl": "https://www.acpgbi.org.uk/_userfiles/import/2017/02/Management-of-the-malignant-colorectal-polyp-ACPGBI-position-statement-2013.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2013 authors and ACPGBI; society-hosted PDF bears PROOFS",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification of openly readable society-hosted guidance, not a textbook or question corpus. No source PDF, excerpt, table, figure or algorithm saved. No automation prohibition identified on the accessed society PDF; this limited assessment is not an unrestricted reuse grant. Source is visibly a proof and requires clinician assessment of its age and final-version correspondence.",
    "authorityAssessment": "Older primary multidisciplinary position statement. The Polyp preparation section directly describes preserving microanatomy, orienting the attached stalk, pinning before fixation and subsequent longitudinal pathology sectioning. Exact stalk preparation here has one directly accessed technical source; newer USMSTF full-text retrieval failed and is not claimed as a verified corroboration. No old surveillance, margin, fixation-time or treatment-rate rule is imported.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.suspicious-polyps.amorphous-pit-pattern",
      "claim.intraop.suspicious-polyps.limited-biopsy-scope",
      "claim.intraop.suspicious-polyps.intact-microanatomy",
      "claim.intraop.suspicious-polyps.retrieval-fragmentation",
      "claim.intraop.suspicious-polyps.stalk-before-fixation",
      "claim.intraop.suspicious-polyps.longitudinal-stalk-section",
      "claim.intraop.suspicious-polyps.marking-communication"
    ]
  },
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
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.upper-gi-hemostasis.cag-nonpeptic-2025",
    "title": "CAG nonpeptic upper-GI bleeding guideline (2025)",
    "completeCitation": "Barkun AN, Laine L, Leontiadis GI, Gralnek IM, Carman N, Ibrahim M, Sey M, Alali AA, Carroll MW, Hookey L, Borgaonkar M, Armstrong D, Lau JYW, Forbes N, Pittayanon R, Tse F. Canadian Association of Gastroenterology Clinical Practice Guideline for the Endoscopic Management of Nonvariceal Nonpeptic Ulcer Upper Gastrointestinal Bleeding. Gastroenterology. 2025;169(5):863-891. doi:10.1053/j.gastro.2025.04.041.",
    "organizationOrJournal": "Canadian Association of Gastroenterology / Gastroenterology",
    "authors": [
      "Alan N. Barkun",
      "Loren Laine",
      "Grigorios I. Leontiadis",
      "Ian M. Gralnek",
      "Nicholas Carman",
      "Mostafa Ibrahim",
      "Michael Sey",
      "Ali A. Alali",
      "Matthew W. Carroll",
      "Lawrence Hookey",
      "Mark Borgaonkar",
      "David Armstrong",
      "James Y. W. Lau",
      "Nauzer Forbes",
      "Rapat Pittayanon",
      "Frances Tse"
    ],
    "publicationYear": 2025,
    "doi": "10.1053/j.gastro.2025.04.041",
    "pmid": "40778886",
    "officialUrl": "https://www.cag-acg.org/_Library/clinical_cpgs_position_papers/CPG-Nonvariceal-Nonpeptic-Ulcer-Upper-GI-Bleeding-Aug-2025.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0; copyright 2025 the authors",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Society-hosted article directly read, including the explicit CC BY 4.0 notice. Attribution: Barkun and colleagues, CAG, 2025, DOI above, https://creativecommons.org/licenses/by/4.0/. Original factual synthesis only; no copied prose, figures, tables, questions or source file retained. No affirmative automation restriction was identified on the accessed society-hosted source.",
    "authorityAssessment": "Primary GRADE guideline, internationally endorsed. Recommendations 5, 6A/6B and 7A directly separate active from nonbleeding Mallory-Weiss lesions. The dry-vessel recommendation is conditional with very low certainty; this source does not prove clipping is harmful or prohibit individualized exceptions.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.dry-tear-vessel",
      "claim.intraop.upper-gi-hemostasis.active-tear-mechanical",
      "claim.intraop.upper-gi-hemostasis.ulcer-vessel-boundary"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.upper-gi-hemostasis.kim-tears-2015",
    "title": "Kim: Mallory-Weiss tearing (2015)",
    "completeCitation": "Kim HS. Endoscopic Management of Mallory-Weiss Tearing. Clin Endosc. 2015;48(2):102-105. doi:10.5946/ce.2015.48.2.102.",
    "organizationOrJournal": "Clinical Endoscopy / Korean Society of Gastrointestinal Endoscopy",
    "authors": [
      "Hyun-Soo Kim"
    ],
    "publicationYear": 2015,
    "doi": "10.5946/ce.2015.48.2.102",
    "pmid": "25844336",
    "officialUrl": "https://doi.org/10.5946/ce.2015.48.2.102",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC 3.0; copyright 2015 Korean Society of Gastrointestinal Endoscopy",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "The primary author's openly licensed article was directly read through its public Semantic Scholar PDF mirror after the journal returned 403 and PMC presented a browser challenge. Accessed URL: https://pdfs.semanticscholar.org/6e9e/a3b0c754cb5487133a25535e2ee5caa11221.pdf. The PDF explicitly states CC BY-NC 3.0, https://creativecommons.org/licenses/by-nc/3.0/. Attribution: Kim, Clinical Endoscopy, 2015, DOI above. Only facts independently synthesized; no copied text, figures or source file retained. The schema lacks a 3.0 enum, so this is the narrower targeted-verification status. No commercial expressive reuse is claimed.",
    "authorityAssessment": "Peer-reviewed technical review, not a new trial or guideline. Directly supports longitudinal junctional morphology and the nonbleeding-vessel boundary with rebleeding/coagulopathy exceptions. It independently cross-checks CAG's interpretation but may share underlying studies. Current CAG recommendations govern the drafted treatment comparison.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.tear-morphology",
      "claim.intraop.upper-gi-hemostasis.dry-tear-vessel",
      "claim.intraop.upper-gi-hemostasis.active-tear-mechanical"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.upper-gi-hemostasis.esge-variceal-2022",
    "title": "ESGE esophagogastric variceal hemorrhage guideline (2022)",
    "completeCitation": "Gralnek IM, Camus Duboc M, Garcia-Pagan JC, Fuccio L, Karstensen JG, Hucl T, Jovanovic I, Awadie H, Hernandez-Gea V, Tantau M, Ebigbo A, Ibrahim M, Vlachogiannakos J, Burgmans MC, Rosasco R, Triantafyllou K. Endoscopic diagnosis and management of esophagogastric variceal hemorrhage: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(11):1094-1120. doi:10.1055/a-1939-4887.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Ian M. Gralnek",
      "Marine Camus Duboc",
      "Juan Carlos Garcia-Pagan",
      "Lorenzo Fuccio",
      "John Gásdal Karstensen",
      "Tomas Hucl",
      "Ivan Jovanovic",
      "Halim Awadie",
      "Virginia Hernandez-Gea",
      "Marcel Tantau",
      "Alanna Ebigbo",
      "Mostafa Ibrahim",
      "Jiannis Vlachogiannakos",
      "Marc C. Burgmans",
      "Robyn Rosasco",
      "Konstantinos Triantafyllou"
    ],
    "publicationYear": 2022,
    "doi": "10.1055/a-1939-4887",
    "pmid": null,
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1939-4887.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "ESGE copyright; no open reuse licence asserted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of sections 5.2.1-5.2.3 and 5.3.1 on the society host; only independently worded facts and bibliographic metadata retained. ESGE terms/privacy endpoint requests failed; no affirmative AI prohibition was identified on the accessed society PDF. This is not blanket reuse permission. No algorithms, figures or evidence tables reproduced.",
    "authorityAssessment": "Primary guideline. Direct support for platelet-fibrin plug localization, band ligation, rescue TIPS and temporary covered esophageal stenting. Preference over balloon tamponade is weak/low-certainty, not an established universal superiority claim. The scored item does not rank those two accepted bridges.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.variceal-plug-source",
      "claim.intraop.upper-gi-hemostasis.esophageal-band-treatment",
      "claim.intraop.upper-gi-hemostasis.fundal-treatment-boundary",
      "claim.intraop.upper-gi-hemostasis.rescue-tips",
      "claim.intraop.upper-gi-hemostasis.esophageal-stent-bridge",
      "claim.intraop.upper-gi-hemostasis.balloon-valid-bridge",
      "claim.intraop.upper-gi-hemostasis.stent-scope-and-risk",
      "claim.intraop.upper-gi-hemostasis.hospital-background"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.upper-gi-hemostasis.kasl-varices-2020",
    "title": "KASL varices guideline (2020)",
    "completeCitation": "Korean Association for the Study of the Liver (KASL). KASL clinical practice guidelines for liver cirrhosis: Varices, hepatic encephalopathy, and related complications. Clin Mol Hepatol. 2020;26(2):83-127. doi:10.3350/cmh.2019.0010n.",
    "organizationOrJournal": "Korean Association for the Study of the Liver / Clinical and Molecular Hepatology",
    "authors": [
      "Korean Association for the Study of the Liver (KASL)"
    ],
    "publicationYear": 2020,
    "doi": "10.3350/cmh.2019.0010n",
    "pmid": "31918536",
    "officialUrl": "https://www.kasl.org/eng/guidelines/file/CMH_2019-0010n-e.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC 3.0; copyright 2020 KASL",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Society-hosted open article explicitly grants CC BY-NC 3.0: https://creativecommons.org/licenses/by-nc/3.0/. Attribution supplied above. Only factual verification and original synthesis are used; the schema lacks a 3.0 licence enum, so the narrower targeted-verification status is retained. No commercial expressive reuse, source prose or assets are claimed. No affirmative automated-use prohibition was identified in the accessed PDF.",
    "authorityAssessment": "Independent professional-society guideline corroborates plug/nipple source evidence, ligation over sclerotherapy and stenting after failed treatment. It shares underlying studies with ESGE, including a small stent trial; it is not independent trial replication.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.variceal-plug-source",
      "claim.intraop.upper-gi-hemostasis.esophageal-band-treatment",
      "claim.intraop.upper-gi-hemostasis.rescue-tips",
      "claim.intraop.upper-gi-hemostasis.esophageal-stent-bridge"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.upper-gi-hemostasis.bsg-varices-2026",
    "title": "BSG portal hypertension position statement (2026)",
    "completeCitation": "Dunne PDJ, Tripathi D, Patch D, Patel VC, Maurice JB, McPhail M, Corless L, Backhouse D, Rowe IA, Forrest E, Stanley A, Tranah TH, Greenwell L, Mansour D. British Society of Gastroenterology position statement on the American Association for the Study of Liver Disease practice guidance on risk stratification and management of portal hypertension and varices in cirrhosis. Frontline Gastroenterol. Published online June 2026:1-11. doi:10.1136/flgastro-2026-103698.",
    "organizationOrJournal": "British Society of Gastroenterology / Frontline Gastroenterology",
    "authors": [
      "Philip D. J. Dunne",
      "Dhiraj Tripathi",
      "David Patch",
      "Vishal C. Patel",
      "James B. Maurice",
      "Mark McPhail",
      "Lynsey Corless",
      "Dianne Backhouse",
      "Ian A. Rowe",
      "Ewan Forrest",
      "Adrian Stanley",
      "Thomas H. Tranah",
      "Louise Greenwell",
      "Dina Mansour"
    ],
    "publicationYear": 2026,
    "doi": "10.1136/flgastro-2026-103698",
    "pmid": null,
    "officialUrl": "https://www.bsg.org.uk/getmedia/a45c14c0-6060-4b58-a729-6a388193a068/flgastro-2026-103698.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC; copyright 2026 authors or employers; BMJ publication",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Read the society-hosted PDF and its CC BY-NC notice; original factual synthesis with attribution, no commercial expressive reuse. The linked article identifies CC BY-NC 4.0. No publisher-host fulltext was ingested. No affirmative automated-use restriction was identified on the accessed society source.",
    "authorityAssessment": "Current 2026 society position statement cross-checks hospital care, airway protection, rescue TIPS and both accepted temporary bridges. It specifically limits covered esophageal stents to esophageal rather than gastric varices and notes migration. It does not make balloon tamponade universally incorrect.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.rescue-tips",
      "claim.intraop.upper-gi-hemostasis.esophageal-stent-bridge",
      "claim.intraop.upper-gi-hemostasis.balloon-valid-bridge",
      "claim.intraop.upper-gi-hemostasis.stent-scope-and-risk",
      "claim.intraop.upper-gi-hemostasis.hospital-background"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.upper-gi-hemostasis.esge-ulcer-2026",
    "title": "ESGE peptic ulcer bleeding guideline update (2026; counterfactual)",
    "completeCitation": "Gralnek IM, Morris J, Laursen SB, Camus M, Tziatzios G, Debels LK, Nigam GB, Erőss B, Goetz M, Forbes N, Gonçalves TC, Kurek K, Bretthauer M, Tham TC. Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026. Endoscopy. 2026;58:899-924. doi:10.1055/a-2863-8314.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Ian M. Gralnek",
      "John Morris",
      "Stig Borbjerg Laursen",
      "Marine Camus",
      "Georgios Tziatzios",
      "Lynn K. Debels",
      "Gaurav B. Nigam",
      "Bálint Erőss",
      "Martin Goetz",
      "Nauzer Forbes",
      "Tiago Cúrdia Gonçalves",
      "Krzysztof Kurek",
      "Michael Bretthauer",
      "Tony C. Tham"
    ],
    "publicationYear": 2026,
    "doi": "10.1055/a-2863-8314",
    "pmid": null,
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2863-8314.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "ESGE copyright; no open reuse licence asserted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted reading on the society host of the current nonbleeding-ulcer-vessel treatment boundary. Original atomic counterfactual only; no source file or protected expression retained. The 2021 guideline is not represented as the latest ulcer guidance. Terms-endpoint limitation as above.",
    "authorityAssessment": "Current primary society ulcer guideline supports the different treatment boundary for an ulcer visible vessel. It does not establish the tear decision; no existing accepted ulcer definition is revised by this sidecar.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.ulcer-vessel-boundary"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-endoscopic-upper-gi-hemostasis.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.upper-gi-hemostasis.chinese-societies-varices-2023",
    "title": "Chinese societies variceal guideline (2023; injection target cross-check)",
    "completeCitation": "Xu X, Tang C, Linghu E, Ding H; Chinese Society of Hepatology, Chinese Medical Association; Chinese Society of Gastroenterology, Chinese Medical Association; Chinese Society of Digestive Endoscopy, Chinese Medical Association. Guidelines for the Management of Esophagogastric Variceal Bleeding in Cirrhotic Portal Hypertension. J Clin Transl Hepatol. 2023;11(7):1565-1579. doi:10.14218/JCTH.2023.00061.",
    "organizationOrJournal": "Chinese Medical Association hepatology, gastroenterology and digestive-endoscopy societies / Journal of Clinical and Translational Hepatology",
    "authors": [
      "Xiaoyuan Xu",
      "Chengwei Tang",
      "Enqiang Linghu",
      "Huiguo Ding",
      "Chinese Society of Hepatology, Chinese Medical Association",
      "Chinese Society of Gastroenterology, Chinese Medical Association",
      "Chinese Society of Digestive Endoscopy, Chinese Medical Association"
    ],
    "publicationYear": 2023,
    "doi": "10.14218/JCTH.2023.00061",
    "pmid": null,
    "officialUrl": "https://www.xiahepublishing.com/2310-8819/JCTH-2023-00061",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC 4.0; copyright 2023 authors",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Direct targeted reading of the openly accessible publisher page, EIS subsection and explicit CC BY-NC 4.0 notice, https://creativecommons.org/licenses/by-nc/4.0/. Original factual synthesis with attribution to Xu and the three societies; no source prose, figure, table or dosing protocol copied. No affirmative automated/AI restriction was identified on the accessed page. No commercial expressive reuse is claimed.",
    "authorityAssessment": "Primary multisociety guideline provides a direct technical cross-check that EIS injects the varix and can be a fallback when ligation is unsuitable. It does not establish a numeric visibility criterion, require a pinpoint bleeding vessel or provide a comparative trial of stenting versus sclerotherapy in the constructed obscured-field scenario. The exact case application remains for clinician review.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.upper-gi-hemostasis.sclerotherapy-varix-target"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-anesthesia-events.spa-2025",
    "title": "Pedi Crisis: Critical Events Checklists (January 2025)",
    "completeCitation": "Society for Pediatric Anesthesia. Pedi Crisis: Critical Events Checklists. January 2025 compilation; bronchospasm card revised October 2018; laryngospasm card revised June 2018. Richmond, VA: Society for Pediatric Anesthesia. https://pedsanesthesia.org/wp-content/uploads/2025/01/SPAPediCrisisChecklistJan2025.pdf. Accessed November 12, 2026.",
    "organizationOrJournal": "Society for Pediatric Anesthesia",
    "authors": [
      "Society for Pediatric Anesthesia"
    ],
    "publicationYear": 2025,
    "publicationDateNote": "Compilation January 2025; relevant cards individually dated 2018.",
    "doi": null,
    "pmid": null,
    "officialUrl": "https://pedsanesthesia.org/wp-content/uploads/2025/01/SPAPediCrisisChecklistJan2025.pdf",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society cognitive aid; no open-content license established",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying-fact verification only. No checklist wording, figures, layout, drug table or algorithm copied. Linked disclaimer inspected; no automated/AI prohibition found there. No reproduction permission asserted.",
    "authorityAssessment": "Specialty-society pediatric peri-anesthesia emergency aid; direct population/phase but not a graded guideline or approval of ASC capabilities.",
    "usageRole": "evidence",
    "accessTermsChecked": {
      "url": "https://pedsanesthesia.org/wp-content/uploads/2024/11/Disclaimers-for-PediCrisis-Resource.pdf",
      "result": "Educational/reference disclaimer inspected; no reuse license claimed."
    },
    "verifiedLocations": [
      "Card 5: Bronchospasm",
      "Card 16: Laryngospasm"
    ],
    "accessedOn": "2026-11-12",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.laryngeal-pattern.v1",
      "claim.intraop.pediatric-anesthesia-events.initial-laryngospasm.v1",
      "claim.intraop.pediatric-anesthesia-events.laryngospasm-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.postobstructive-edema.v1",
      "claim.intraop.pediatric-anesthesia-events.edema-support.v1",
      "claim.intraop.pediatric-anesthesia-events.bronchospasm-pattern.v1",
      "claim.intraop.pediatric-anesthesia-events.mechanical-check.v1",
      "claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1",
      "claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.magnesium-role.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.clear-airway-lung-priority.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-anesthesia-events.rch-2021",
    "title": "RCH CICO airway emergency guideline: laryngospasm appendix",
    "completeCitation": "The Royal Children's Hospital Melbourne. Clinical Practice Guidelines: Can't intubate can't oxygenate (CICO) airway emergency management. Appendix 1: Management of laryngospasm. Updated March 2021. https://www.rch.org.au/clinicalguide/guideline_index/Can_t_intubate_can_t_oxygenate_(CICO)_airway_emergency_management/. Accessed November 12, 2026.",
    "organizationOrJournal": "The Royal Children's Hospital Melbourne / Paediatric Improvement Collaborative",
    "authors": [
      "The Royal Children's Hospital Melbourne"
    ],
    "publicationYear": 2021,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.rch.org.au/clinicalguide/guideline_index/Can_t_intubate_can_t_oxygenate_(CICO)_airway_emergency_management/",
    "sourceClass": "government_guidance",
    "licenseLabel": "Public-hospital guideline; copyright retained; factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Official public pediatric-hospital guideline read for a narrow escalation boundary. No prose, algorithm, image or dosing rule reproduced. Government/public-hospital publication does not imply public-domain status.",
    "authorityAssessment": "PIC-endorsed pediatric emergency guideline. Appendix supports treating reversible functional obstruction. Displayed update March 2021; independently cross-checked against SPA.",
    "usageRole": "cross_check",
    "verifiedLocations": [
      "Appendix 1: partial/complete laryngospasm and escalation"
    ],
    "accessedOn": "2026-11-12",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.laryngeal-pattern.v1",
      "claim.intraop.pediatric-anesthesia-events.airway-stimulation.v1",
      "claim.intraop.pediatric-anesthesia-events.initial-laryngospasm.v1",
      "claim.intraop.pediatric-anesthesia-events.laryngospasm-escalation.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-anesthesia-events.igarashi-2024",
    "title": "Extubation and removal of supraglottic airway devices in pediatric anesthesia",
    "completeCitation": "Igarashi A. Extubation and removal of supraglottic airway devices in pediatric anesthesia. Anesth Pain Med (Seoul). 2024;19(Suppl 1):S49-S60. doi:10.17085/apm.24006. https://pmc.ncbi.nlm.nih.gov/articles/PMC11566557/. Accessed November 12, 2026.",
    "organizationOrJournal": "Anesthesia and Pain Medicine (Seoul) / Korean Society of Anesthesiologists",
    "authors": [
      "Ayuko Igarashi"
    ],
    "publicationYear": 2024,
    "doi": "10.17085/apm.24006",
    "pmid": "39045745",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11566557/",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Article-level license checked explicitly, not inferred from PMC. Targeted noncommercial research and independent factual synthesis; attribution to Igarashi (2024). No source expression or figure adapted. Commercial reuse of protected content would need separate rights review; no such content ships here.",
    "authorityAssessment": "Pediatric-anesthesia narrative review; corroborates airway stimulation and postobstructive edema mechanism. Does not establish a universal extubation threshold.",
    "usageRole": "both",
    "licenseUrl": "https://creativecommons.org/licenses/by-nc/4.0/",
    "verifiedLocations": [
      "Laryngospasm",
      "Postextubation NPPE"
    ],
    "accessedOn": "2026-11-12",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.airway-stimulation.v1",
      "claim.intraop.pediatric-anesthesia-events.postobstructive-edema.v1",
      "claim.intraop.pediatric-anesthesia-events.edema-support.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.clear-airway-lung-priority.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-anesthesia-events.joseph-ganatra-2024",
    "title": "Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges",
    "completeCitation": "Joseph A, Ganatra H. Status Asthmaticus in the Pediatric ICU: A Comprehensive Review of Management and Challenges. Pediatr Rep. 2024;16(3):644-656. doi:10.3390/pediatric16030054. https://www.mdpi.com/2036-7503/16/3/54. Accessed November 12, 2026.",
    "organizationOrJournal": "Pediatric Reports",
    "authors": [
      "Amy Joseph",
      "Hammad Ganatra"
    ],
    "publicationYear": 2024,
    "doi": "10.3390/pediatric16030054",
    "pmid": null,
    "officialUrl": "https://www.mdpi.com/2036-7503/16/3/54",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Publisher footer explicitly displays CC BY 4.0. Attribution to Joseph and Ganatra (2024), source link and license link. Independently written factual synthesis; no source table, scoring tool, algorithm, figure or prose copied or stored.",
    "authorityAssessment": "Direct pediatric critical-care review for bronchodilator and ventilation physiology. ICU-asthma physiology is an identified intraoperative application, not an ASC-specific protocol.",
    "usageRole": "both",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "verifiedLocations": [
      "Medical management: bronchodilators and corticosteroids",
      "Mechanical ventilation: expiration, hyperinflation and PEEP uncertainty"
    ],
    "accessedOn": "2026-11-12",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.bronchospasm-pattern.v1",
      "claim.intraop.pediatric-anesthesia-events.inhaled-albuterol.v1",
      "claim.intraop.pediatric-anesthesia-events.systemic-escalation.v1",
      "claim.intraop.pediatric-anesthesia-events.steroid-role.v1",
      "claim.intraop.pediatric-anesthesia-events.magnesium-role.v1",
      "claim.intraop.pediatric-anesthesia-events.incomplete-expiration.v1",
      "claim.intraop.pediatric-anesthesia-events.expiratory-adjustment.v1",
      "claim.intraop.pediatric-anesthesia-events.peep-disagreement.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.ipratropium-adjunct.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.pressure-time-volume.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.mandatory-rate-expiration.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-anesthesia-events.cps-acute-asthma-2021",
    "title": "Managing an acute asthma exacerbation in children",
    "completeCitation": "Trottier ED, Chan K, Allain D, Chauvin-Kimoff L; Canadian Paediatric Society. Managing an acute asthma exacerbation in children. Position statement. November 5, 2021. https://cps.ca/en/documents/position/managing-an-acute-asthma-exacerbation. Accessed November 12, 2026.",
    "organizationOrJournal": "Canadian Paediatric Society",
    "authors": [
      "Evelyne D. Trottier",
      "Kevin Chan",
      "Dominic Allain",
      "Laurel Chauvin-Kimoff",
      "Canadian Paediatric Society"
    ],
    "publicationYear": 2021,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://cps.ca/en/documents/position/managing-an-acute-asthma-exacerbation",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society statement; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of albuterol versus adjunctive ipratropium roles. No statement prose, dosage table, figure or treatment pathway copied; no general reproduction permission asserted.",
    "authorityAssessment": "Pediatric professional-society acute-asthma statement. Direct pediatric comparison of initial beta-agonist and adjunctive anticholinergic roles; perioperative application is cross-checked against SPA, not an assertion that this ED statement certifies an ASC.",
    "usageRole": "both",
    "verifiedLocations": [
      "Medical management: short-acting beta2-agonists",
      "Inhaled anticholinergics as adjuncts",
      "Systemic escalation boundaries"
    ],
    "evidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.r1.ipratropium-adjunct.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-anesthesia-events.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-anesthesia-events.pavone-ventilation-2020",
    "title": "Ventilators and Ventilatory Modalities",
    "completeCitation": "Pavone M, Verrillo E, Onofri A, Caggiano S, Cutrera R. Ventilators and Ventilatory Modalities. Front Pediatr. 2020;8:500. doi:10.3389/fped.2020.00500. https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2020.00500/full. Accessed November 12, 2026.",
    "organizationOrJournal": "Frontiers in Pediatrics",
    "authors": [
      "M. Pavone",
      "E. Verrillo",
      "A. Onofri",
      "S. Caggiano",
      "R. Cutrera"
    ],
    "publicationYear": 2020,
    "doi": "10.3389/fped.2020.00500",
    "pmid": null,
    "officialUrl": "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2020.00500/full",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY license checked on the official article. Attribution to Pavone and colleagues (2020), original source and license supplied. Independently written facts and constructed observations only; no source diagrams, figures, tables, expressions or algorithms copied.",
    "authorityAssessment": "Pediatric pulmonology technical review. Direct explanation of time-cycled pressure control and dependence of volume on pressure, inspiratory time and respiratory mechanics; not an ASC-specific rescue guideline or proof of one universally optimal mode.",
    "usageRole": "both",
    "verifiedLocations": [
      "Pressure-Targeted (Controlled) Ventilation",
      "PCV Mode",
      "Article copyright/license"
    ],
    "evidenceClaimIds": [
      "claim.intraop.pediatric-anesthesia-events.r1.pressure-time-volume.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.inspiratory-time-tradeoff.v1",
      "claim.intraop.pediatric-anesthesia-events.r1.mandatory-rate-expiration.v1"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-orchiopexy.cua-puc-2017",
    "title": "Canadian Urological Association-Pediatric Urologists of Canada (CUA-PUC) guideline for the diagnosis, management, and followup of cryptorchidism",
    "completeCitation": "Luis H. Braga; Armando J. Lorenzo; Rodrigo L. P. Romao. Canadian Urological Association-Pediatric Urologists of Canada (CUA-PUC) guideline for the diagnosis, management, and followup of cryptorchidism. Canadian Urological Association Journal 11(7):E251-E260. 2017. doi:10.5489/cuaj.4585.",
    "organizationOrJournal": "Canadian Urological Association Journal 11(7):E251-E260",
    "authors": [
      "Luis H. Braga",
      "Armando J. Lorenzo",
      "Rodrigo L. P. Romao"
    ],
    "publicationYear": 2017,
    "doi": "10.5489/cuaj.4585",
    "pmid": null,
    "officialUrl": "https://doi.org/10.5489/cuaj.4585",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright 2017 Canadian Urological Association; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Society guideline read on the official CUAJ site for narrow factual checks. No source prose, figure, table, algorithm or article file is stored. Publisher rights statement checked; this is not a reusable corpus license.",
    "authorityAssessment": "Society guidance for cryptorchidism; many operative details rest on limited studies. This 2017 document is older and is not represented as a newly updated 2026 guideline. Newer independent operative cohorts are cross-checks, not a replacement society guideline.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-orchiopexy.ring-entry",
      "claim.intraop.pediatric-orchiopexy.vas-vessel-separation",
      "claim.intraop.pediatric-orchiopexy.incomplete-exploration",
      "claim.intraop.pediatric-orchiopexy.length-mobilization",
      "claim.intraop.pediatric-orchiopexy.fs-length-boundary",
      "claim.intraop.pediatric-orchiopexy.primary-completion",
      "claim.intraop.pediatric-orchiopexy.smaller-testis",
      "claim.intraop.pediatric-orchiopexy.postpubertal-boundary",
      "claim.intraop.pediatric-orchiopexy.vascular-protection",
      "claim.intraop.pediatric-orchiopexy.blind-end-conflict",
      "claim.intraop.pediatric-orchiopexy.r1.remnant-verification",
      "claim.intraop.pediatric-orchiopexy.r1.medial-descent-route"
    ],
    "retrievalUrl": "https://cuaj.ca/index.php/journal/article/download/4585/3197",
    "rightsCheckedUrl": "https://cuaj.ca/index.php/journal/article/view/4585"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-orchiopexy.pogorelic-2024",
    "title": "The Safety and Effectiveness of Single-Stage, Vessel-Preserving, Laparoscopic Orchiopexy for Intra-Abdominal Testes in Pediatric Patients: A 10-Year Single-Center Experience",
    "completeCitation": "Zenon Pogorelić; Josipa Šitum; Tomislav Barić; Marijan Šitum. The Safety and Effectiveness of Single-Stage, Vessel-Preserving, Laparoscopic Orchiopexy for Intra-Abdominal Testes in Pediatric Patients: A 10-Year Single-Center Experience. Journal of Clinical Medicine 13(7):2045. 2024. doi:10.3390/jcm13072045.",
    "organizationOrJournal": "Journal of Clinical Medicine 13(7):2045",
    "authors": [
      "Zenon Pogorelić",
      "Josipa Šitum",
      "Tomislav Barić",
      "Marijan Šitum"
    ],
    "publicationYear": 2024,
    "doi": "10.3390/jcm13072045",
    "pmid": null,
    "officialUrl": "https://doi.org/10.3390/jcm13072045",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Authors and original publication are attributed in this source record; license https://creativecommons.org/licenses/by/4.0/. Only underlying facts and independently synthesized atomic statements are retained; no article text, figure or table is copied.",
    "authorityAssessment": "Primary retrospective, selected single-center operative series. Patients were younger than the program art ages; use supports anatomical technique and inclusion of hypotrophic testes, not age-specific outcomes, an ASC credentialing rule, imaging policy or comparative superiority.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-orchiopexy.length-mobilization",
      "claim.intraop.pediatric-orchiopexy.fs-length-boundary",
      "claim.intraop.pediatric-orchiopexy.primary-completion",
      "claim.intraop.pediatric-orchiopexy.smaller-testis",
      "claim.intraop.pediatric-orchiopexy.vascular-protection",
      "claim.intraop.pediatric-orchiopexy.r1.channel-patency"
    ],
    "retrievalUrl": "https://www.mdpi.com/2077-0383/13/7/2045"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-orchiopexy.he-2022",
    "title": "Testicular regression syndrome: A retrospective analysis of clinical and histopathological features in 570 cases",
    "completeCitation": "Tian-Qu He; Rong Wen; Yao-Wang Zhao; Li Liu; Jian-Jun Hu; Yu Liu; Qian-Long Peng. Testicular regression syndrome: A retrospective analysis of clinical and histopathological features in 570 cases. Frontiers in Pediatrics 10:1006880. 2022. doi:10.3389/fped.2022.1006880.",
    "organizationOrJournal": "Frontiers in Pediatrics 10:1006880",
    "authors": [
      "Tian-Qu He",
      "Rong Wen",
      "Yao-Wang Zhao",
      "Li Liu",
      "Jian-Jun Hu",
      "Yu Liu",
      "Qian-Long Peng"
    ],
    "publicationYear": 2022,
    "doi": "10.3389/fped.2022.1006880",
    "pmid": null,
    "officialUrl": "https://doi.org/10.3389/fped.2022.1006880",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Authors and original publication are attributed in this source record; license https://creativecommons.org/licenses/by/4.0/. Only underlying facts and independently synthesized atomic statements are retained; no article text, figure or table is copied.",
    "authorityAssessment": "Primary retrospective TRS series; vessels and vas were recorded separately. Its selected regression population and surgical preferences do not validate universal stopping or remnant-excision rules. The discussion of dissociation is an anatomical cross-check, not prospective evidence of a best operation.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-orchiopexy.ring-entry",
      "claim.intraop.pediatric-orchiopexy.vas-vessel-separation",
      "claim.intraop.pediatric-orchiopexy.incomplete-exploration",
      "claim.intraop.pediatric-orchiopexy.r1.remnant-verification"
    ],
    "retrievalUrl": "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2022.1006880/full"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-orchiopexy.mao-2024",
    "title": "Does the presence of blind-ended vas deferens and spermatic vessels in laparoscopic exploration of non-palpable testes conclusively indicate testicular absence?",
    "completeCitation": "Chang-Kun Mao; Qi-Fei Deng; Xiang Liu; Yong-Sheng Cao; Guang-Yuan Li. Does the presence of blind-ended vas deferens and spermatic vessels in laparoscopic exploration of non-palpable testes conclusively indicate testicular absence? Frontiers in Pediatrics 12:1413099. 2024. doi:10.3389/fped.2024.1413099.",
    "organizationOrJournal": "Frontiers in Pediatrics 12:1413099",
    "authors": [
      "Chang-Kun Mao",
      "Qi-Fei Deng",
      "Xiang Liu",
      "Yong-Sheng Cao",
      "Guang-Yuan Li"
    ],
    "publicationYear": 2024,
    "doi": "10.3389/fped.2024.1413099",
    "pmid": null,
    "officialUrl": "https://doi.org/10.3389/fped.2024.1413099",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Authors and original publication are attributed in this source record; license https://creativecommons.org/licenses/by/4.0/. Only underlying facts and independently synthesized atomic statements are retained; no article text, figure or table is copied.",
    "authorityAssessment": "Primary retrospective series reporting remnants after apparently blind-ended vas and vessels. Raises a management disagreement with older guidance; it does not establish a quantified malignancy risk or a universal additional-exploration mandate.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-orchiopexy.blind-end-conflict"
    ],
    "retrievalUrl": "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2024.1413099/full"
  },
  {
    "contentVersion": "clinical.question-intraop-pediatric-orchiopexy-findings.2026-11-12.v1.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.pediatric-orchiopexy.he-prentiss-2022",
    "title": "Clinical Efficacy of Laparoscopic Orchiopexy With the Modified Prentiss Maneuver for Non-palpable Testis Near the Internal Ring",
    "authors": [
      "Tian-Qu He",
      "Fang-Yun Tong",
      "Zhi Wang",
      "Yu Liu",
      "Jian-Jun Hu",
      "Yi-Fu Chen",
      "Lei Tu",
      "Jun He",
      "Yao-Wang Zhao"
    ],
    "publicationYear": 2022,
    "organizationOrJournal": "Frontiers in Pediatrics 10:906739",
    "doi": "10.3389/fped.2022.906739",
    "pmid": null,
    "officialUrl": "https://doi.org/10.3389/fped.2022.906739",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Authors and original publication attributed in this record; https://creativecommons.org/licenses/by/4.0/. Underlying technique facts synthesized independently. No source prose, table, figure, algorithm or image is retained.",
    "authorityAssessment": "Retrospective single-center comparison with largely younger children. Supports the anatomical rationale and implementation of a medial vessel-preserving descent channel, controlled proximal dissection and adequate passage. It does not establish an exact hierarchy for every older child, guaranteed outcomes or local ASC eligibility.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.pediatric-orchiopexy.r1.medial-descent-route",
      "claim.intraop.pediatric-orchiopexy.r1.channel-patency"
    ],
    "retrievalUrl": "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2022.906739/full",
    "completeCitation": "Tian-Qu He; Fang-Yun Tong; Zhi Wang; Yu Liu; Jian-Jun Hu; Yi-Fu Chen; Lei Tu; Jun He; Yao-Wang Zhao. Clinical Efficacy of Laparoscopic Orchiopexy With the Modified Prentiss Maneuver for Non-palpable Testis Near the Internal Ring. Frontiers in Pediatrics 10:906739. 2022. doi:10.3389/fped.2022.906739."
  }
];
