import type { ClinicalSource, EvidenceClaim, QuestionVariant } from './pilot-schema';
import { validateSyntheticClinicalRelease, type AnswerChoiceTimingRegistryEntry, type CaseExhibit, type SyntheticClinicalCase, type TestedConcept } from './schema';
import ledger from '../../../docs/research/sources-question-topic-perioperative-risk-recovery-20261111.json';

/** Explicit-import authoring sidecar. The default release and frozen histories are untouched. */
export const PERIOPERATIVE_TOPIC_SLUG = 'perioperative-risk-recovery';
export const PERIOPERATIVE_TOPIC_DRAFT = {
  contentVersion: 'question-topic-perioperative-risk-recovery.2026-11-11.v1',
  reviewStatus: 'needs_clinician_review', aiAssistedDrafting: true, lastClinicianReview: null,
} as const;
const prefix = `topic.${PERIOPERATIVE_TOPIC_SLUG}`;
const REVIEW_PASS_SLUGS = new Set(["warfarin-interruption","recovery-support","delirium-quiet-cause","art-unavoidable-interruption","extravasation-progressive-injury","penicillin-delayed-boundary","low-risk-cardiac-testing","symptomatic-aortic-valve"]);
const REVIEW_PASS_CASES = new Set(["warfarin-review","frailty-trajectory","delirium-medication-course","art-enteral-interruption","contrast-local-course","allergy-severe-history","low-risk-operation","valve-risk"]);
const nodeVersion = (s: string) => REVIEW_PASS_SLUGS.has(s) ? 'v1' : 'v2';
const caseVersion = (s: string) => REVIEW_PASS_CASES.has(s) ? 'v1' : 'v2';
const recordFor = (s: string) => ({ ...PERIOPERATIVE_TOPIC_DRAFT, contentVersion: REVIEW_PASS_SLUGS.has(s) ? PERIOPERATIVE_TOPIC_DRAFT.contentVersion : 'question-topic-perioperative-risk-recovery.2026-11-11.v2' });
export const PERIOPERATIVE_TOPIC_IDS = {
  case: (s: string) => `case.${prefix}.${s}.${caseVersion(s)}`, node: (s: string) => `node.${prefix}.${s}.${nodeVersion(s)}`,
  question: (s: string) => `question.${prefix}.${s}.${nodeVersion(s)}`, choice: (s: string, c: string) => `choice.${prefix}.${s}.${c}.${nodeVersion(s)}`,
};
const claim = (s: string) => s.startsWith('claim.') ? s : `claim.${PERIOPERATIVE_TOPIC_SLUG}.${s}`;
const concept = (s: string) => `concept.${PERIOPERATIVE_TOPIC_SLUG}.${s}.v1`;
interface Option { id: string; label: string; rationale: string; temptation: string; correctUnder: string; claims: string[]; timingProfileId?: string }
interface Gate {
  interpret: string; apply: string; closestChoice: string; decidingObservation: string; counterfactual: string;
  counterfactualChoice: string; deletionTest: string; cueAttack: string; stageAudit: string;
  predictedDifficulty: 'moderate' | 'hard'; difficultyReason: string; sequenceAudit: string; limitation: string;
}
interface DraftNode {
  parkingReason?: string;
  slug: string; conceptId: string; previousConceptId?: string; conceptVersionReason?: string;
  creationKind: 'Rewrite' | 'new'; replacesInventoryIds: string[]; identityRelation?: 'reuse_existing_meaning';
  objective: string; conceptType: TestedConcept['conceptType']; task: string; update: string;
  exhibit?: CaseExhibit; choices: Option[]; key: string; explanation: string; claims: string[]; gate: Gate;
}
interface DraftCase {
  preservedSourceLabels?: string[];
  slug: string; name: string; age: number; sex: 'Female' | 'Male'; complaint: string; presentation: string;
  encounterMode: 'outpatient_clinic' | 'outside_record_review_in_clinic'; historicalAcuity: 'stable' | 'urgent_stable' | 'obvious_emergency'; nodes: DraftNode[];
}
const PERIOPERATIVE_TOPIC_DEFINITIONS: DraftCase[] = [
  {
    "slug": "beta-exposure",
    "name": "Marcus Reed",
    "age": 66,
    "sex": "Male",
    "complaint": "Medication instructions",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 66-year-old man, attends clinic the afternoon before elective hernia repair. The medication list includes metoprolol, originally prescribed for hypertension. His current blood pressure is 126/74 mmHg and pulse is 72/min on amlodipine. The bottle dispensed three months ago still contains all 60 tablets; he says he put it aside when the amlodipine arrived. The record contains no coronary disease, heart failure or arrhythmia. Tomorrow’s copied orders include his listed metoprolol dose.",
    "nodes": [
      {
        "slug": "beta-new-exposure",
        "conceptId": "concept.perioperative-risk-recovery.beta-actual-exposure.v1",
        "previousConceptId": "concept.perioperative-medication.continue-chronic-beta-blocker",
        "conceptVersionReason": "Changes the scored decision from continuation of tolerated chronic therapy to recognizing that a stale list would create new operative-day exposure.",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.def538cac4e67069"
        ],
        "conceptType": "management",
        "objective": "Distinguish actual chronic beta-blocker exposure from a stale list before accepting an operative-day restart.",
        "task": "Which metoprolol instruction should Marcus receive for tomorrow’s operation?",
        "update": "",
        "choices": [
          {
            "id": "defer",
            "label": "Omit metoprolol tomorrow and review its longer-term indication",
            "rationale": "The untouched supply and administration history show that the copied list does not represent current beta blockade. Controlled hypertension does not create a reason to introduce it on the operative day.",
            "temptation": "Reconcile actual exposure before applying the chronic-continuation rule.",
            "correctUnder": "The represented unused medicine and controlled hypertension apply.",
            "claims": [
              "beta-new-start",
              "beta-continuation"
            ]
          },
          {
            "id": "continue",
            "label": "Give the listed metoprolol dose tomorrow",
            "rationale": "This would introduce treatment after a prolonged interval rather than continue tolerated current therapy.",
            "temptation": "Treat a copied prescription as evidence of current administration.",
            "correctUnder": "Consistent current dosing with demonstrated tolerance would support continuation.",
            "claims": [
              "beta-continuation",
              "beta-new-start"
            ]
          },
          {
            "id": "postpone",
            "label": "Postpone repair to resume metoprolol and assess tolerability",
            "rationale": "A new independent indication could warrant advance treatment, but none is represented; an old hypertension prescription does not establish a need to delay this operation for beta blockade.",
            "temptation": "Correct the stale list by delaying surgery to reinstate every listed drug.",
            "correctUnder": "A newly established independent indication needing evaluation and treatment before elective surgery would change the preparation plan.",
            "claims": [
              "beta-new-start"
            ]
          }
        ],
        "key": "defer",
        "explanation": "First reconcile what Marcus has actually taken: an unused bottle and his account contradict ongoing metoprolol exposure. Then use the indication and decision time. This is controlled hypertension without another represented beta-blocker indication, so tomorrow’s copied order would be an operative-day introduction, not continuation.",
        "claims": [
          "beta-new-start",
          "beta-continuation"
        ],
        "gate": {
          "interpret": "Infer absent current beta-blocker exposure from the untouched dispensing quantity plus actual administration history, rather than from the imported medication list.",
          "apply": "Distinguish continuation from new exposure and use the controlled-hypertension indication to avoid either a surgery-day start or an unsupported postponement.",
          "closestChoice": "continue",
          "decidingObservation": "The dispensed supply is untouched and Marcus describes setting it aside; normal treated blood pressure does not establish a new beta-blocker requirement.",
          "counterfactual": "If the dispensing and administration record instead showed uninterrupted daily metoprolol use with current tolerance, give the listed dose tomorrow becomes the appropriate continuation plan.",
          "counterfactualChoice": "continue",
          "deletionTest": "Without actual administration evidence, the imported list cannot distinguish continuation from initiation. The established indication and tomorrow timing resolve whether earlier reassessment or operative-day action is being asked. No dose or titration interval is invented.",
          "cueAttack": "Removed “first replacement dose for cardiac risk reduction.” Three concrete instructions use the same time anchor. The key lacks a unique team-coordination phrase; the postponement plan is a real reconciliation error rather than an unrelated replacement drug.",
          "stageAudit": "One instruction for the immediately upcoming operative day; all options address metoprolol administration/preparation.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The familiar continuation rule competes with neutral dispensing evidence and a separate indication assessment. The ceiling is moderate; this is not claimed hard.",
          "sequenceAudit": "Standalone revised case; no prior continuation feedback is visible.",
          "limitation": "One current guideline supports the medication rule. Fictional tablet counts and vital signs are observations, not evidence-derived treatment cutoffs."
        }
      }
    ]
  },
  {
    "slug": "warfarin-review",
    "name": "Nadia Brooks",
    "age": 72,
    "sex": "Female",
    "complaint": "Anticoagulation planning",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 72-year-old woman, attends clinic before elective colectomy. Warfarin is prescribed for atrial fibrillation. Her record shows no prior stroke, systemic embolus, venous thrombosis or valve replacement. The surgeon is comparing anticoagulation instructions for the bowel resection.",
    "nodes": [
      {
        "slug": "warfarin-interruption",
        "conceptId": "concept.perioperative-medication.warfarin-interruption-no-bridge",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.0ae8e2569fb32702"
        ],
        "conceptType": "management",
        "objective": "Apply the bleeding implications of major bowel surgery and the actual AF indication to therapeutic bridging.",
        "task": "Which anticoagulation plan fits Nadia before the colectomy?",
        "update": "",
        "choices": [
          {
            "id": "interrupt",
            "label": "Interrupt warfarin with no therapeutic heparin bridge",
            "rationale": "Temporary interruption for major surgery does not create a routine therapeutic-bridging indication for this AF history.",
            "temptation": "Separate procedural interruption from thromboembolic indication.",
            "correctUnder": "The represented AF and operation apply.",
            "claims": [
              "af-no-bridge"
            ]
          },
          {
            "id": "bridge",
            "label": "Interrupt warfarin and use a therapeutic heparin bridge",
            "rationale": "This adds treatment-level anticoagulation despite the represented AF indication, increasing bleeding exposure without the routine benefit assumed.",
            "temptation": "Treat any subtherapeutic interval as requiring a bridge.",
            "correctUnder": "A different very-high-risk thrombotic indication would require specialist assessment; this option is not endorsed as an automatic exception.",
            "claims": [
              "af-no-bridge"
            ]
          },
          {
            "id": "continue",
            "label": "Continue therapeutic warfarin at the usual dose",
            "rationale": "The bleeding implications of major resection differ from a minor low-bleeding-risk procedure.",
            "temptation": "Generalize an uninterrupted plan from minor procedures.",
            "correctUnder": "A low-bleeding-risk procedure with a supported uninterrupted-warfarin protocol would be a different decision.",
            "claims": [
              "af-no-bridge"
            ]
          }
        ],
        "key": "interrupt",
        "explanation": "Interpret both the planned resection and why warfarin is prescribed. Avoid routine therapeutic bridging for this AF interruption. Postoperative surgical VTE prevention has its own indication and must be planned separately.",
        "claims": [
          "af-no-bridge",
          "prophylaxis-purpose"
        ],
        "gate": {
          "interpret": "A major bowel resection and AF without represented prior embolic events are distinct inputs.",
          "apply": "Interrupt therapeutic warfarin without automatically adding a treatment-dose bridge.",
          "closestChoice": "bridge",
          "decidingObservation": "The anticoagulant indication is AF, with the documented thromboembolic history shown.",
          "counterfactual": "If the operation were canceled and no procedure or new bleeding problem remained, continuing the established therapeutic warfarin regimen would replace perioperative interruption.",
          "counterfactualChoice": "continue",
          "deletionTest": "The operation makes uninterrupted warfarin a meaningful competitor; the indication/history distinguishes interruption from bridging. The prior beta-blocker story is removed.",
          "cueAttack": "Deleted the legacy sentence announcing that interruption is required and the permanent-cessation caricature. Three concrete anticoagulation plans answer the same task.",
          "stageAudit": "Preoperative therapeutic anticoagulation, not a matrix of pre- and postoperative phases.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The credible error is unnecessary treatment-dose bridging during an anticipated low-INR interval.",
          "sequenceAudit": "Standalone; frozen N2 order reconciliation is not appended.",
          "limitation": "No high-risk bridging exception is keyed or resolved; CHEST and AHA scope differences are preserved. No exact interruption timing."
        }
      }
    ],
    "preservedSourceLabels": [
      "CHEST perioperative antithrombotic guideline — official recommendation summary",
      "2024 multisociety perioperative cardiovascular guideline — official AHA slides",
      "ASH surgical VTE prevention guideline"
    ]
  },
  {
    "slug": "cancer-prophylaxis-vte-active-bleeding",
    "name": "Elena Foster",
    "age": 64,
    "sex": "Female",
    "complaint": "Hospital medication review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "urgent_stable",
    "presentation": "{patientName}, a 64-year-old woman, attends clinic after colorectal cancer surgery. The founder reviews an outside hospital decision from postoperative day 2. She had a prior postoperative DVT and was still transferring from bed to chair with assistance. After hemoglobin had been unchanged on two measurements, it fell from 10.0 to 8.1 g/dL while the abdominal drain filled with fresh blood. The next prophylaxis orders were being selected during the surgical reassessment.",
    "nodes": [
      {
        "slug": "vte-active-bleeding",
        "conceptId": "concept.perioperative-risk-recovery.vte-bleeding-boundary.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Select prevention while active postoperative bleeding competes with a major-surgery thrombotic risk.",
        "task": "Which VTE-prevention order best fits Elena at that recorded decision point?",
        "update": "",
        "choices": [
          {
            "id": "ipc",
            "label": "Use intermittent pneumatic compression",
            "rationale": "The new blood loss changes the current bleeding balance despite strong postoperative VTE risk. Mechanical prevention is the best offered immediate approach during reassessment.",
            "temptation": "Integrate both thrombosis risk and the new trajectory instead of treating cancer risk as permission for heparin.",
            "correctUnder": "The represented new blood loss applies.",
            "claims": [
              "bleeding-mechanical"
            ]
          },
          {
            "id": "lmwh",
            "label": "Give prophylactic low-molecular-weight heparin",
            "rationale": "Major cancer surgery, prior DVT and limited mobility favor pharmacologic prevention when bleeding risk permits, but the new drainage and hemoglobin change oppose starting it at this point.",
            "temptation": "Apply the strong VTE indication without updating the competing bleeding risk.",
            "correctUnder": "The same VTE risk with stable hemostatic observations would favor pharmacologic prevention.",
            "claims": [
              "bleeding-mechanical",
              "prophylaxis-reassess"
            ]
          },
          {
            "id": "ufh",
            "label": "Give prophylactic subcutaneous unfractionated heparin",
            "rationale": "Changing the heparin preparation does not remove the current concern from new blood loss.",
            "temptation": "Treat selection of another prophylactic heparin as a solution to the risk-state change.",
            "correctUnder": "An appropriate major-surgery patient without the represented bleeding concern could receive prophylactic UFH under the treating team’s plan.",
            "claims": [
              "bleeding-mechanical",
              "prophylaxis-reassess"
            ]
          }
        ],
        "key": "ipc",
        "explanation": "The prior DVT, cancer operation and limited mobility establish a strong prevention need. The new hemoglobin and drainage trajectory nevertheless changes which form is appropriate now. Use mechanical prevention during this reassessment; neither offered heparin preparation removes the current bleeding concern.",
        "claims": [
          "bleeding-mechanical",
          "prophylaxis-reassess"
        ],
        "gate": {
          "interpret": "Read a new fall after stable hemoglobin together with fresh bloody drainage as a change in current bleeding risk, not a static postoperative laboratory result.",
          "apply": "Weigh that change against prior DVT, cancer surgery and immobility when selecting the prevention modality.",
          "closestChoice": "ufh",
          "decidingObservation": "Fresh drain blood accompanies a new hemoglobin fall after earlier stable values.",
          "counterfactual": "If the new drainage were nonbloody and serial hemoglobin remained stable after source control, pharmacologic prevention such as the offered LMWH would become appropriate for the continuing high VTE risk.",
          "counterfactualChoice": "lmwh",
          "deletionTest": "Removing the trajectory leaves a high-risk cancer patient for whom a heparin plan could be appropriate. Prior DVT and observed mobility are the competing-risk facts; no arbitrary blood-loss cutoff is taught.",
          "cueAttack": "Removed both “active bleeding assessment” labels and the prophylactic IVC-filter foil. All options are named prevention modalities with no explanatory qualifiers in their labels. Two heparin preparations represent a plausible agent-substitution error.",
          "stageAudit": "Immediate VTE-prevention order during a historical hospital assessment, not treatment of established VTE.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "A strong prior-VTE prevention indication competes with a newly changed risk state. This retains a fair moderate ceiling; warning signs are not hidden to manufacture difficulty.",
          "sequenceAudit": "Split into a standalone chart-review case. No explanation announces the following resumption answer; later course nodes are absent.",
          "limitation": "ASH recommendations are conditional and evidence certainty is low/very low. This is the best offered immediate modality, not a quantitative bleeding threshold or universal timing rule."
        }
      }
    ]
  },
  {
    "slug": "cancer-prophylaxis-vte-after-hemostasis",
    "name": "Elena Foster",
    "age": 64,
    "sex": "Female",
    "complaint": "Hospital medication review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "urgent_stable",
    "presentation": "{patientName}, a 64-year-old woman, attends clinic after colorectal cancer surgery. The founder reviews the outside hospital prevention decision after reoperation for bleeding. She had a previous postoperative DVT and still needed two people to help her from bed to chair. At this later decision, hemoglobin was 9.4, 9.5 and 9.4 g/dL on successive checks, the drain contained a small amount of straw-colored fluid, and no transfusion had been required since reoperation. Creatinine was 0.8 mg/dL (laboratory interval 0.6–1.1), platelets were 224 × 10^9/L (150–400), and the record contained no heparin-associated thrombocytopenia or drug allergy. Pneumatic compression remained ordered.",
    "nodes": [
      {
        "slug": "vte-after-hemostasis",
        "conceptId": "concept.perioperative-risk-recovery.vte-reassess-after-bleeding.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Reassess a temporary pharmacologic-prophylaxis contraindication using the actual hemostatic course.",
        "task": "Which inpatient VTE-prevention plan best fits Elena at this later decision?",
        "update": "",
        "choices": [
          {
            "id": "add",
            "label": "Use prophylactic LMWH with pneumatic compression",
            "rationale": "The observations support reconsidering the initial bleeding restriction. Prior DVT, major cancer surgery and marked mobility limitation favor combined prevention among these options.",
            "temptation": "Reassess both current bleeding observations and unusually strong continuing VTE risk.",
            "correctUnder": "The represented stable recovery and multiple VTE factors apply.",
            "claims": [
              "prophylaxis-reassess",
              "vte-combined-high-risk"
            ]
          },
          {
            "id": "mechanical",
            "label": "Use pneumatic compression without prophylactic LMWH",
            "rationale": "This carries the earlier restriction forward despite the later observations and leaves the strong current VTE indication incompletely addressed.",
            "temptation": "Treat a previous bleeding episode as an unchanged contraindication.",
            "correctUnder": "New bloody drainage, falling hemoglobin or another current pharmacologic contraindication could favor mechanical prevention.",
            "claims": [
              "bleeding-mechanical",
              "prophylaxis-reassess"
            ]
          },
          {
            "id": "pharmacologic",
            "label": "Use prophylactic LMWH without pneumatic compression",
            "rationale": "Pharmacologic prevention is appropriate to reconsider, but the prior DVT and severe mobility limitation favor adding the mechanical method rather than withdrawing it.",
            "temptation": "Resume the medicine but treat it as replacing the existing mechanical measure.",
            "correctUnder": "A different, lower VTE-risk context or a mechanical-method contraindication could support pharmacologic prevention without compression.",
            "claims": [
              "vte-combined-high-risk"
            ]
          }
        ],
        "key": "add",
        "explanation": "Infer the current bleeding balance from the serial course rather than an eligibility label. Then account for the prior DVT and continuing functional limitation after a major cancer operation. ASH particularly favors combined prophylaxis in patients at high VTE risk when bleeding risk permits; it does not mandate the same combination for every surgical patient.",
        "claims": [
          "prophylaxis-reassess",
          "vte-combined-high-risk"
        ],
        "gate": {
          "interpret": "Serial blood counts, drainage and transfusion course differ from the earlier blood-loss phase; the prior restriction needs reassessment.",
          "apply": "Use the continuing prior-DVT/cancer/mobility risk to choose combined prevention rather than either preserve the hold or replace the mechanical method.",
          "closestChoice": "pharmacologic",
          "decidingObservation": "A previous DVT and persisting two-person transfer requirement remain despite the later stable blood-loss observations.",
          "counterfactual": "If fresh bloody drainage and a new falling hemoglobin series returned, pneumatic compression without prophylactic LMWH would become the best offered interim plan.",
          "counterfactualChoice": "mechanical",
          "deletionTest": "Without the recovery observations the previous bleeding restriction cannot be reassessed. Without the high-VTE-risk history, the evidence would not as strongly favor combination over LMWH by itself. Normal renal/platelet observations close the named medication eligibility gaps without proposing dose cutoffs.",
          "cueAttack": "Removed “satisfactory hemostasis,” vague “prevention change,” baseline-only renal wording and therapeutic-heparin foil. All three options are complete same-stage modality combinations; the combination key is justified by the risk history, not a uniquely cautious phrase. The component-majority pattern does not assemble the key: the two LMWH rows and two compression rows would otherwise converge, so clinical interpretation remains necessary and this is a residual reviewer concern explicitly acknowledged.",
          "stageAudit": "One inpatient prophylaxis plan, comparing modality combinations at identical prophylactic intensity.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "A prior bleeding hold and the temptation to replace rather than combine modalities compete with the later recovery and VTE-risk profile. The ASH conditional preference limits claims of exclusivity.",
          "sequenceAudit": "Standalone chart review; no prior mechanical-prevention explanation supplies a resumption rule.",
          "limitation": "Conditional ASH preference, not proof that a noncombined plan is invariably wrong. If independent review finds combination versus pharmacologic-only insufficiently exclusive, park rather than force this key."
        },
        "parkingReason": "The one repair resolves clarity and medication-eligibility gaps, but the conditional combination preference does not make LMWH without compression unequivocally wrong. The three-row component matrix also converges on the combination key. Park rather than force a difficult exclusive ranking."
      }
    ]
  },
  {
    "slug": "cancer-prophylaxis-extended-cancer-course",
    "name": "Elena Foster",
    "age": 64,
    "sex": "Female",
    "complaint": "Hospital medication review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "urgent_stable",
    "presentation": "{patientName}, a 64-year-old woman, attends clinic after colorectal cancer surgery. The founder reviews her outside discharge orders from postoperative day 8. She had a previous postoperative DVT. At discharge she walked only from bed to the doorway with a walker. LMWH had been restarted after an earlier reoperation for bleeding. A small injection-site bruise had not enlarged; three successive hemoglobin results were unchanged and the abdominal wound had no new swelling. She was eating, creatinine was 0.8 mg/dL (0.6–1.1), and no VTE had been diagnosed.",
    "nodes": [
      {
        "slug": "extended-cancer-course",
        "conceptId": "concept.postoperative-prophylaxis.extended-cancer-vte-prevention",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.92d09bef1cb7b560"
        ],
        "conceptType": "management",
        "objective": "Reconcile total extended prophylaxis with discharge before mobility recovery after major cancer surgery.",
        "task": "Which discharge LMWH plan best fits Elena’s recorded course?",
        "update": "",
        "choices": [
          {
            "id": "four-weeks",
            "label": "Continue prophylactic LMWH to about four weeks after surgery",
            "rationale": "Major abdominopelvic cancer surgery, prior DVT and persistent mobility limitation support an extended total course when the present bleeding balance permits it.",
            "temptation": "Use the actual risk and recovery record instead of the discharge boundary or an isolated stable bruise.",
            "correctUnder": "The represented high-risk major cancer operation and current tolerated prophylaxis apply.",
            "claims": [
              "extended-lmwh",
              "bleeding-mechanical"
            ]
          },
          {
            "id": "discharge",
            "label": "Stop prophylactic LMWH when she leaves the hospital",
            "rationale": "Discharge does not remove this represented extended-prophylaxis indication.",
            "temptation": "Transfer an inpatient-only course to a high-risk major cancer operation.",
            "correctUnder": "Completion of an appropriate shorter course in a patient without an extended-course indication could support stopping at discharge.",
            "claims": [
              "extended-lmwh"
            ]
          },
          {
            "id": "hold",
            "label": "Withhold prophylactic LMWH pending a bleeding reassessment",
            "rationale": "A stable small injection-site bruise without a new blood-count or wound trajectory does not recreate the earlier bleeding episode.",
            "temptation": "Treat any visible bruise as equivalent to renewed surgical blood loss.",
            "correctUnder": "An expanding wound hematoma or new hemoglobin fall would require reassessment of further anticoagulant exposure.",
            "claims": [
              "bleeding-mechanical",
              "prophylaxis-reassess"
            ]
          }
        ],
        "key": "four-weeks",
        "explanation": "Interpret the current bruise and serial course separately from the earlier bleeding episode. Then apply the major cancer operation, prior DVT and persistent mobility limitation to the discharge course. The supported plan totals about four postoperative weeks; it does not mean four additional weeks starting at discharge.",
        "claims": [
          "extended-lmwh",
          "bleeding-mechanical",
          "prophylaxis-reassess"
        ],
        "gate": {
          "interpret": "A stable local bruise and unchanged serial hemoglobin differ from an expanding surgical bleeding process.",
          "apply": "Recognize the high-risk cancer-surgery extended-course indication rather than let discharge or any bruise determine the duration.",
          "closestChoice": "hold",
          "decidingObservation": "The bruise is not enlarging and serial hemoglobin and wound observations remain unchanged while mobility is still markedly limited.",
          "counterfactual": "If the bruise finding were instead an expanding abdominal wound hematoma with a new hemoglobin fall, withholding further LMWH pending bleeding reassessment would become the appropriate offered plan.",
          "counterfactualChoice": "hold",
          "deletionTest": "Deleting current bleeding observations makes further LMWH uncertain after the previous reoperation. Deleting the cancer/prior-DVT/mobility profile weakens the extended-course indication. Day 8 is a neutral constructed time point, with no four-week hint in the vignette.",
          "cueAttack": "Removed the answer-bearing “well before four weeks.” Three discharge medication plans compare continue, stop and withhold; none uses a uniquely explanatory key label. The precise duration appears only after the learner interprets eligibility.",
          "stageAudit": "One discharge prophylaxis prescription, not treatment of established VTE.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The resident must distinguish a stable bruise from renewed bleeding before applying an extended course to a still-limited patient. Moderate is the fair ceiling for this guideline application.",
          "sequenceAudit": "Standalone discharge-record review; no preceding resumption feedback is available.",
          "limitation": "Selected high-risk population and acceptable bleeding balance. No dose, exact stop date or universal four-week instruction for every operation."
        }
      }
    ]
  },
  {
    "slug": "sglt2-switch",
    "name": "David Chen",
    "age": 58,
    "sex": "Male",
    "complaint": "Surgery medication calendar",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 58-year-old man, attends clinic to finalize an elective abdominal operation requiring fasting. The imported medication list says empagliflozin. His current pharmacy dispensing record and the bottle he brings both say ertugliflozin; empagliflozin has no recent refill. His last dose from the current bottle was Monday at 08:00. He is well and eating normally. The booking list offers Thursday at 08:00, Friday at 08:00 or the following Monday at 08:00.",
    "nodes": [
      {
        "slug": "sglt2-drug-switch",
        "conceptId": "concept.perioperative-sglt2.drug-specific-interruption",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.55a08dac0c85938d"
        ],
        "conceptType": "management",
        "objective": "Reconcile the actual SGLT2 medicine before applying its U.S. label-based elective interruption minimum.",
        "task": "Which listed operation slot first meets the labeled preoperative interruption minimum for David’s current medicine?",
        "update": "",
        "choices": [
          {
            "id": "four",
            "label": "Friday at 08:00",
            "rationale": "Reconcile the current ertugliflozin exposure, then count four full days from Monday at 08:00. Friday is the first offered slot meeting that label minimum.",
            "temptation": "Use the actual dispensed medicine and last administration time rather than the imported medicine name.",
            "correctUnder": "The represented ertugliflozin exposure applies.",
            "claims": [
              "ertu-interrupt",
              "empa-interrupt"
            ]
          },
          {
            "id": "three",
            "label": "Thursday at 08:00",
            "rationale": "This is three full days after the last dose. It applies the empagliflozin interval to the current ertugliflozin exposure.",
            "temptation": "Use the old medication-list entry rather than the bottle and dispensing record.",
            "correctUnder": "If the current administered medicine were empagliflozin instead, this first offered three-day slot would meet its labeled minimum.",
            "claims": [
              "empa-interrupt",
              "ertu-interrupt"
            ]
          },
          {
            "id": "week",
            "label": "The following Monday at 08:00",
            "rationale": "This meets the minimum but is not the first offered slot that does so; the extra delay is not required by the represented label rule.",
            "temptation": "Apply a blanket one-week hold to all diabetes-related preoperative medicines.",
            "correctUnder": "A separate clinical reason to delay until that date could change booking, but no universal one-week SGLT2 minimum is established here.",
            "claims": [
              "ertu-interrupt"
            ]
          }
        ],
        "key": "four",
        "explanation": "Identify the medicine actually taken, not the carried-forward list entry. Ertugliflozin’s labeled minimum is four days when possible: Monday 08:00 to Friday 08:00. Thursday supplies only the three-day interval used for empagliflozin. This comparison tests the medication/calendar discrepancy, not overall fitness or automatic permission to operate.",
        "claims": [
          "ertu-interrupt",
          "empa-interrupt"
        ],
        "gate": {
          "interpret": "Resolve the imported empagliflozin entry against concordant current dispensing, bottle and administration evidence for ertugliflozin.",
          "apply": "Apply the correct drug-specific interval to the recorded last dose and select the earliest offered slot meeting it.",
          "closestChoice": "three",
          "decidingObservation": "Current dispensing and the administered bottle identify ertugliflozin, while Thursday and Friday differ at the relevant four-day boundary.",
          "counterfactual": "If both current dispensing and the administered bottle instead identified empagliflozin with the same Monday 08:00 last dose, Thursday at 08:00 would be the first label-concordant offered slot.",
          "counterfactualChoice": "three",
          "deletionTest": "Deleting the exposure discrepancy reduces this to interval recall. Deleting the last-dose/booking record prevents applying that interval to the actual operation. The extra unexplained instruction sheet is gone.",
          "cueAttack": "No sheet is called old or incorrect and no drug-specific number appears before the choices. All options are actual booking times. The task states the limited comparison so meeting a medication minimum cannot be mistaken for full surgical clearance.",
          "stageAudit": "One elective booking decision under a defined medication interruption constraint.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Current exposure reconciliation and a clinically consequential calendar application create a fair moderate item; arithmetic is simple and does not create an artificial hard label.",
          "sequenceAudit": "Standalone; no earlier item teaches the current drug’s interval.",
          "limitation": "U.S. labels, when possible, govern this narrow minimum. Dates/times are constructed; no interval beyond the sourced label minimum or whole-patient clearance claim."
        }
      }
    ]
  },
  {
    "slug": "sglt2-hospital-course-sglt2-acid-ketone-pattern",
    "name": "Priya Shah",
    "age": 56,
    "sex": "Female",
    "complaint": "Postoperative record review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "obvious_emergency",
    "presentation": "{patientName}, a 56-year-old woman with type 2 diabetes, attends clinic after recovery from an outside operation. The founder reviews the earlier hospital record. She had taken empagliflozin through surgery and then vomited while eating little. After initial intravenous fluid replacement she was alert, blood pressure was 118/72 mmHg and oxygen saturation was 98% on room air. The team was choosing the next infusion plan using the following results.",
    "nodes": [
      {
        "slug": "sglt2-acid-ketone-pattern",
        "conceptId": "concept.perioperative-risk-recovery.sglt2-euglycemic-infusion.v1",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.9cc4606d848c9a64"
        ],
        "conceptType": "management",
        "objective": "Interpret postoperative ketone-associated acidosis despite modest glucose and select an insulin/fluid plan that can correct it without creating hypoglycemia.",
        "task": "Which next infusion plan best fits Priya at that hospital decision point?",
        "update": "",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed teaching record; fictional patient observations",
          "items": [
            {
              "label": "Glucose",
              "value": "172 mg/dL"
            },
            {
              "label": "Venous pH",
              "value": "7.25 (laboratory interval 7.32–7.42)"
            },
            {
              "label": "Bicarbonate",
              "value": "12 mmol/L (22–29)"
            },
            {
              "label": "Blood beta-hydroxybutyrate",
              "value": "5.8 mmol/L (less than 0.6)"
            },
            {
              "label": "Potassium",
              "value": "4.4 mmol/L (3.5–5.1)"
            }
          ]
        },
        "choices": [
          {
            "id": "ketoacidosis",
            "label": "Intravenous insulin with dextrose-containing fluid",
            "rationale": "The ketone/acidosis pattern requires insulin despite the modest glucose. Dextrose supports continued insulin treatment while limiting hypoglycemia.",
            "temptation": "Treat the ketone process rather than use glucose alone to decide whether insulin is needed.",
            "correctUnder": "The represented ketone-associated acidosis and modest glucose apply.",
            "claims": [
              "sglt2-acidosis",
              "sglt2-dextrose-insulin"
            ]
          },
          {
            "id": "saline-insulin",
            "label": "Intravenous insulin with saline lacking dextrose",
            "rationale": "Insulin addresses ketone production, but the current glucose is already below the usual point for adding dextrose during DKA treatment.",
            "temptation": "Transfer the initial high-glucose DKA fluid plan to a euglycemic presentation.",
            "correctUnder": "With the same acidosis but markedly high glucose before it falls, insulin with isotonic fluid before dextrose becomes necessary could fit initial treatment.",
            "claims": [
              "sglt2-dextrose-insulin"
            ]
          },
          {
            "id": "saline",
            "label": "Saline replacement with intravenous insulin deferred",
            "rationale": "Volume replacement is necessary, but it does not resolve this represented DKA pattern by itself.",
            "temptation": "Treat a modest glucose concentration as evidence that insulin can wait.",
            "correctUnder": "Volume depletion without the represented ketone-associated metabolic acidosis could support fluids without a DKA insulin infusion.",
            "claims": [
              "sglt2-acidosis",
              "ketone-versus-hyperosmolar",
              "sglt2-dextrose-insulin"
            ]
          }
        ],
        "key": "ketoacidosis",
        "explanation": "Integrate ketones with acidemia and low bicarbonate rather than let the glucose value exclude DKA. After initial volume replacement, the insulin plan must still address ketone production. Because glucose is already modest, pair intravenous insulin with dextrose-containing fluid. No insulin dose, fluid rate or post-DKA SGLT2 restart rule is tested.",
        "claims": [
          "sglt2-acidosis",
          "sglt2-risk-context",
          "ketone-versus-hyperosmolar",
          "sglt2-dextrose-insulin"
        ],
        "gate": {
          "interpret": "Recognize ketone-associated metabolic acidosis in a patient with diabetes and perioperative SGLT2 exposure despite glucose of 172 mg/dL.",
          "apply": "Choose an insulin/fluid combination that treats ketone production while accommodating the low current glucose after initial fluid resuscitation.",
          "closestChoice": "saline-insulin",
          "decidingObservation": "Ketones and acidosis remain substantial even though glucose is modest; potassium is not low in the represented sample.",
          "counterfactual": "If glucose were instead 520 mg/dL at the same initial post-volume assessment, saline with intravenous insulin before adding dextrose as glucose falls would be the appropriate offered initial combination.",
          "counterfactualChoice": "saline-insulin",
          "deletionTest": "Deleting ketone/pH/bicarbonate information allows an ordinary volume-depletion interpretation. Deleting glucose prevents distinguishing the two insulin-fluid plans. Potassium and completed initial volume replacement are needed treatment-stage eligibility observations.",
          "cueAttack": "Changed the diagnostic-label task to three parallel infusion plans. Removed lactate and HHS labels that separately eliminated options. Neither the presentation nor the task names euglycemic ketoacidosis or the need for dextrose.",
          "stageAudit": "One next infusion decision after initial volume replacement; all options specify fluid plus whether insulin is being given.",
          "predictedDifficulty": "hard",
          "difficultyReason": "The nearest plan correctly gives insulin but fails to adapt the fluid to modest glucose. The competing error is delaying insulin because glucose is not markedly elevated.",
          "sequenceAudit": "Standalone outside-record review. The former restart companion is parked, and no later recovery data are exposed.",
          "limitation": "One multisociety consensus publication directly supports this treatment distinction, with the FDA label corroborating recognition rather than the full infusion plan. No dose/rate or complete DKA protocol is taught."
        },
        "previousConceptId": "concept.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect",
        "conceptVersionReason": "Changes the scored meaning from naming the adverse-effect pattern to selecting insulin/fluids after interpreting ketone-associated acidosis with modest glucose."
      }
    ]
  },
  {
    "slug": "sglt2-hospital-course-sglt2-recovery-restart",
    "name": "Priya Shah",
    "age": 56,
    "sex": "Female",
    "complaint": "Postoperative record review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "obvious_emergency",
    "presentation": "{patientName}, a 56-year-old woman, attends clinic to review an outside postoperative diabetes-medication decision after ketone-associated acidosis had resolved. At the decision time she was alert, blood pressure and renal function had returned to baseline, and she retained water. Both breakfast and lunch were vomited. The record was being reviewed before today’s empagliflozin administration.",
    "nodes": [
      {
        "slug": "sglt2-recovery-restart",
        "conceptId": "concept.n2.sglt2-postoperative-restart",
        "creationKind": "new",
        "identityRelation": "reuse_existing_meaning",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Use actual recovery of intake and clinical state rather than glucose or elapsed time to reassess resumption.",
        "task": "Which empagliflozin order should Priya’s hospital team enter at that current review?",
        "update": "",
        "choices": [
          {
            "id": "withhold",
            "label": "Keep empagliflozin withheld at this review",
            "rationale": "Current repeated meal intolerance does not meet the labeled stability/intake prerequisites. This does not decide eventual re-exposure after the ketoacidosis episode.",
            "temptation": "Separate the present administration decision from future restart eligibility.",
            "correctUnder": "The represented current meal intolerance applies.",
            "claims": [
              "sglt2-restart"
            ]
          },
          {
            "id": "resume",
            "label": "Resume empagliflozin at this review",
            "rationale": "This addresses the current decision but does not satisfy the represented intake boundary.",
            "temptation": "Treat resolved laboratory abnormalities as complete recovery.",
            "correctUnder": "A later sustained recovery plus completed reassessment of the episode and contributors would be prerequisites for an individualized future decision, not automatic restart.",
            "claims": [
              "sglt2-restart"
            ]
          },
          {
            "id": "permanent",
            "label": "Permanently discontinue empagliflozin at this review",
            "rationale": "The exact record does not establish a universally correct future re-exposure decision.",
            "temptation": "Convert a present withholding decision into an unqualified permanent drug rule.",
            "correctUnder": "A clinician may select permanent cessation after evaluating the episode, contributors, indications and alternatives.",
            "claims": [
              "sglt2-restart"
            ]
          }
        ],
        "key": "withhold",
        "explanation": "Current meal intolerance supports withholding today. The choice does not determine whether empagliflozin should ever be restarted after this episode.",
        "claims": [
          "sglt2-restart",
          "sglt2-risk-context"
        ],
        "gate": {
          "interpret": "Distinguish biochemical resolution from actual tolerance of intake.",
          "apply": "Address administration now without teaching an automatic future restart rule.",
          "closestChoice": "resume",
          "decidingObservation": "Two attempted meals were vomited despite retained water.",
          "counterfactual": "A later sustained intake recovery would require a separate reassessment of post-ketoacidosis re-exposure rather than automatically change this draft’s key.",
          "counterfactualChoice": "resume",
          "deletionTest": "The meal record is decisive but leaves a focused safety recognition task, not an additional difficult inference.",
          "cueAttack": "Repaired all labels to the same current decision and removed meal-intolerance rationale from the key label. The permanent-cessation alternative remains a discretionary clinical question rather than a clean wrong answer.",
          "stageAudit": "Present administration is now separated from future re-exposure.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Attempt did not substantiate moderate difficulty; it remains easy current-withholding recognition and the future decision cannot fairly supply a third alternative.",
          "sequenceAudit": "Standalone attempted repair, excluded from scored exports.",
          "limitation": "PARK: present hold is clear, but a fair harder three-option comparison and unique post-DKA re-exposure ranking were not established."
        },
        "parkingReason": "Present withholding is supported but remains easy. Permanent cessation versus eventual re-exposure after ketoacidosis needs an individualized clinical decision; no fair, independent moderate/hard comparison was established."
      }
    ]
  },
  {
    "slug": "awake-gas",
    "name": "Aaron Cole",
    "age": 49,
    "sex": "Male",
    "complaint": "Preoperative breathing review",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 49-year-old man, attends clinic before elective abdominal surgery. His BMI is 43 kg/m2. His partner reports loud snoring and breathing pauses at night, although he reports little daytime dozing. He speaks comfortably in full sentences and has no new dyspnea. On two clinic visits his resting room-air oxygen saturation was 92–93%. Serum total CO2 was 32 and 33 mmol/L (laboratory interval 22–29); creatinine was normal. He takes amlodipine and metformin, with no diuretic use or vomiting. Diagnostic sleep testing is booked.",
    "nodes": [
      {
        "slug": "awake-ventilation-assessment",
        "conceptId": "concept.preoperative-osa.awake-ventilation-assessment.v1",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.545a68196b0e78a8"
        ],
        "conceptType": "workup",
        "objective": "Recognize possible awake hypoventilation in obesity and select a test of PaCO2 rather than substituting a nocturnal screening result.",
        "task": "Which additional investigation best resolves Aaron’s persistent chemistry abnormality before anesthesia planning?",
        "update": "",
        "choices": [
          {
            "id": "gas",
            "label": "Arterial blood-gas analysis",
            "rationale": "The combined obesity, sleep-breathing history and persistent chemistry pattern warrant measuring arterial carbon dioxide rather than assuming the chemistry is diagnostic or waiting for a sleep-only assessment.",
            "temptation": "Recognize that elevated total CO2 may reflect compensated ventilatory failure and needs direct assessment.",
            "correctUnder": "The represented high-suspicion population and persistent unexplained abnormality apply.",
            "claims": [
              "ohs-gas"
            ],
            "timingProfileId": "timing.test.basic_labs"
          },
          {
            "id": "sleep",
            "label": "Attended diagnostic polysomnography",
            "rationale": "Sleep testing remains needed for the sleep-breathing question, but it does not substitute for resolving the current possible daytime ventilatory abnormality.",
            "temptation": "Treat the entire physiology question as ordinary nocturnal obstruction.",
            "correctUnder": "After a current arterial assessment established normal daytime ventilation, the pending diagnostic sleep study would address the remaining nocturnal question.",
            "claims": [
              "ohs-gas",
              "osa-screen"
            ],
            "timingProfileId": "timing.test.overnight_protocol"
          },
          {
            "id": "chemistry",
            "label": "Repeat serum total CO2 measurement",
            "rationale": "A further copy of a reproducibly abnormal screening value would not establish its acid-base mechanism or arterial carbon dioxide.",
            "temptation": "Use repeated screening as confirmation of the physiologic diagnosis.",
            "correctUnder": "An isolated result with a specific sample-quality concern could merit repeat chemistry before interpreting persistence.",
            "claims": [
              "ohs-gas"
            ],
            "timingProfileId": "timing.test.basic_labs"
          }
        ],
        "key": "gas",
        "explanation": "The chemistry is a clue, not the diagnosis. Integrate it with severe obesity and the breathing history, then directly assess daytime ventilation. ATS supports arterial PaCO2 assessment when suspicion is high; neither an awake oxygen number nor raised bicarbonate alone establishes OHS. The sleep study remains relevant to a separate part of the evaluation.",
        "claims": [
          "ohs-gas",
          "osa-screen"
        ],
        "gate": {
          "interpret": "Integrate the reproducible high total CO2 with severe obesity and sleep-breathing observations; little reported dozing does not settle the ventilatory question.",
          "apply": "Choose a measurement that resolves the acid-base/daytime ventilation uncertainty before treating sleep testing or repeat screening as a substitute.",
          "closestChoice": "sleep",
          "decidingObservation": "Persistent total CO2 of 32–33 with the represented high-suspicion clinical context remains unexplained; the patient is clinically stable rather than acutely deteriorating.",
          "counterfactual": "If a current arterial sample had already established normal PaCO2 without acidemia, repeating arterial sampling would not answer the remaining nocturnal question; the offered diagnostic polysomnography would become the relevant next investigation.",
          "counterfactualChoice": "sleep",
          "deletionTest": "The actual values and laboratory interval replace hidden degrees of abnormality. Stability limits the item to preoperative assessment. The medication/vomiting history constrains common nonrespiratory explanations; no SpO2 cutoff is proposed as a decision rule.",
          "cueAttack": "The task names the unresolved chemistry question rather than the diagnosis or PaCO2. Replaced the duplicate overnight-oximetry foil with a plausible repeated-screening plan. The key is not inferred solely from contrasting awake with two overnight labels.",
          "stageAudit": "One additional investigation for a current preoperative physiologic uncertainty; the booked sleep study is not canceled by choosing it.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "An ordinary OSA workup and a repeated chemistry check compete with interpreting a persistent compensation clue. Values make the item fair rather than claiming difficulty from hidden severity.",
          "sequenceAudit": "Standalone; no previous gas interpretation is supplied.",
          "limitation": "ATS recommendation is conditional with very low certainty. All numbers are constructed observations, not invented diagnostic thresholds. Old F13 remains held; this exact new version requires review."
        }
      }
    ]
  },
  {
    "slug": "osa-operative-plan",
    "name": "Lena Morris",
    "age": 57,
    "sex": "Female",
    "complaint": "Sleep risk planning",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 57-year-old woman, attends clinic before elective hernia repair at a referring hospital. Her partner reports loud snoring and nocturnal breathing pauses. The outside screening report names STOP-Bang and records 6 of 8; it does not claim a diagnostic sleep-study result. Her daytime sleepiness questionnaire is within its reference interval. Awake oxygenation and chemistry are in range. Diagnostic sleep testing is booked.",
    "nodes": [
      {
        "slug": "suspected-osa-plan",
        "conceptId": "concept.perioperative-risk-recovery.suspected-osa-operative-plan.v1",
        "previousConceptId": "concept.preoperative-osa.validated-risk-screening",
        "conceptVersionReason": "Changes risk-screen selection into perioperative planning while diagnostic confirmation is pending.",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.842641cd2a6305df"
        ],
        "conceptType": "management",
        "objective": "Apply a discordant sleepiness/risk report to the operative planning phase without treating it as a diagnosis or automatic cancellation.",
        "task": "Which anesthesia and recovery plan should Lena’s referral request for the planned repair?",
        "update": "",
        "choices": [
          {
            "id": "risk-plan",
            "label": "Proceed with an OSA-conscious anesthetic and monitored recovery plan",
            "rationale": "The screen and history merit planning, but the exact anesthetic, observation level and facility suitability require procedure- and setting-specific assessment.",
            "temptation": "Use a risk screen for planning without calling it a diagnosis.",
            "correctUnder": "A team-agreed procedure and observation plan could support proceeding.",
            "claims": [
              "osa-planning",
              "osa-screen"
            ]
          },
          {
            "id": "sleep-first",
            "label": "Postpone repair for diagnostic sleep testing and a revised plan",
            "rationale": "This can be defensible when the needed perioperative plan or resources have not been established; the draft does not provide an exclusive boundary against it.",
            "temptation": "Require diagnostic confirmation before acting on suspected risk.",
            "correctUnder": "Unresolved comorbidity, postoperative observation or facility-suitability concerns could make postponement appropriate.",
            "claims": [
              "osa-planning",
              "osa-screen"
            ]
          },
          {
            "id": "usual",
            "label": "Proceed with the hospital’s routine anesthetic and recovery plan",
            "rationale": "A routine pathway might itself incorporate appropriate risk management, so its label cannot establish a different or inadequate plan.",
            "temptation": "Treat a normal sleepiness questionnaire as negating the other observations.",
            "correctUnder": "A routine pathway explicitly shown to meet the patient’s risk needs could be appropriate.",
            "claims": [
              "osa-planning",
              "osa-screen"
            ]
          }
        ],
        "key": "risk-plan",
        "explanation": "The report is a risk screen, not a diagnosis. The actual anesthesia, opioid and observation plan would need to be specified before these preparation choices can be exclusively ranked.",
        "claims": [
          "osa-screen",
          "osa-planning",
          "ohs-gas"
        ],
        "gate": {
          "interpret": "Read the named risk instrument and corroborating history separately from diagnostic confirmation and daytime sleepiness.",
          "apply": "Use suspected risk in a procedure- and resource-specific plan.",
          "closestChoice": "sleep-first",
          "decidingObservation": "The draft still does not define an exclusive procedure/observation boundary between proceeding with a suitable plan and delaying to complete one.",
          "counterfactual": "If major unresolved comorbidity or an unmet monitoring requirement were present, postponement could become the appropriate offered plan.",
          "counterfactualChoice": "sleep-first",
          "deletionTest": "Removing the screening result leaves the witnessed breathing history; the exact decision still depends on an unprovided concrete pathway rather than a second inference.",
          "cueAttack": "Named STOP-Bang/result, removed “all” and made the preparation plans comparable. “Routine” could nevertheless conceal an adequate plan, creating overlap.",
          "stageAudit": "All options now address a complete anesthesia/recovery preparation plan.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Attempt failed the unique-key gate; the plan labels cannot establish fair moderate difficulty.",
          "sequenceAudit": "Standalone attempted repair, excluded from scored supply.",
          "limitation": "PARK: no local procedure/monitoring protocol is invented to force one key. The constructed screening result is not a teaching cutoff or reproduced instrument."
        },
        "parkingReason": "A named screen and balanced labels do not establish a unique anesthesia/recovery plan. Proceeding and postponement depend on procedure, monitoring and facility details not supplied by the permitted evidence; ordinary planning remains held for a concrete pathway."
      }
    ]
  },
  {
    "slug": "recovery-observation",
    "name": "Thomas Wells",
    "age": 61,
    "sex": "Male",
    "complaint": "Recovery discharge review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "urgent_stable",
    "presentation": "{patientName}, a 61-year-old man with treated OSA, attends clinic to review an outside ambulatory recovery record. After surgery he spoke comfortably when engaged. During repeated unstimulated checks he stopped breathing, oxygen readings fell and staff woke him. His usual PAP device was available. The founder reviews the disposition selected while these events continued.",
    "nodes": [
      {
        "slug": "unmonitored-discharge-risk",
        "conceptId": "concept.perioperative-risk-recovery.osa-recovery-unmonitored-discharge.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "disposition",
        "objective": "Distinguish stimulated wakeful recovery from continuing unstimulated respiratory risk before an unmonitored discharge.",
        "task": "Which disposition should Thomas’s team select at that recovery decision?",
        "update": "",
        "choices": [
          {
            "id": "monitored",
            "label": "Continue monitored recovery at the current hospital unit",
            "rationale": "Persistent events preclude an unmonitored destination, but adequacy of the unit and escalation resources must still be assessed.",
            "temptation": "Do not substitute the stimulated appearance for actual unstimulated recovery.",
            "correctUnder": "An adequately resourced current unit may continue monitoring.",
            "claims": [
              "osa-discharge"
            ]
          },
          {
            "id": "pap-home",
            "label": "Discharge home with his usual PAP plan",
            "rationale": "The represented rescue requirements have not resolved.",
            "temptation": "Treat possession of the home device as proof of readiness.",
            "correctUnder": "Satisfactory unstimulated recovery with resolved risk could support the home plan.",
            "claims": [
              "osa-discharge"
            ]
          },
          {
            "id": "transfer",
            "label": "Transfer to a higher-acuity monitored hospital unit",
            "rationale": "This may also be reasonable depending on support requirements and the current unit’s capabilities, which are not defined.",
            "temptation": "Escalate the monitoring level rather than simply extend observation.",
            "correctUnder": "Ongoing events exceeding current-unit resources would support transfer.",
            "claims": [
              "osa-discharge"
            ]
          }
        ],
        "key": "monitored",
        "explanation": "The warning signs must remain visible. They support continued monitored care, but the exact current-unit-versus-transfer decision needs a defined support and resource boundary.",
        "claims": [
          "osa-discharge"
        ],
        "gate": {
          "interpret": "Recognize the unstimulated respiratory course despite a reassuring stimulated appearance.",
          "apply": "Choose a monitored care setting, then assess whether the current unit can meet the actual needs.",
          "closestChoice": "transfer",
          "decidingObservation": "The draft supplies continuing rescue needs but does not supply the capabilities that would distinguish the two monitored destinations.",
          "counterfactual": "If the events exceeded documented current-unit resources, transfer would become the appropriate offered disposition.",
          "counterfactualChoice": "transfer",
          "deletionTest": "Deleting the warning signs would create unsafe artificial ambiguity. Retaining them makes home discharge plainly premature; resource details are needed for a harder remaining decision.",
          "cueAttack": "Removed the explicit PAP-failure clause and replaced oxygen-only home management with a real monitored-transfer alternative. That repair exposes overlap between the monitored plans.",
          "stageAudit": "All options are actual dispositions at the same historical recovery decision.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Attempt failed unique-key and resident-difficulty gates: the supported safety lesson is easy, while the two monitored plans require additional clinical context.",
          "sequenceAudit": "Standalone attempted repair; no new ICU or ED setting is requested.",
          "limitation": "PARK: no permission to hide apnea/rescue findings or invent a monitored-unit protocol. A basic-safety role would need explicit manager/independent acceptance."
        },
        "parkingReason": "Do not hide ongoing apnea/rescue needs. The supported no-unmonitored-discharge lesson remains easy; current monitored unit versus transfer cannot be uniquely ranked without real capability/support criteria."
      }
    ]
  },
  {
    "slug": "frailty-trajectory-frailty-domains",
    "name": "Rosa Bennett",
    "age": 76,
    "sex": "Female",
    "complaint": "Surgery fitness review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "urgent_stable",
    "presentation": "{patientName}, a 76-year-old woman, attends clinic after an outside admission for bowel obstruction. The founder reviews how frailty was assessed before that admission’s operation. During dehydration on the ward she needed two people for transfers and could not sustain conversation. Her daughter’s dated account from two weeks before the illness describes help with shopping and medicine organization, but independent dressing, toileting and transfers. A two-year-old annual review describes gardening and managing all household tasks independently.",
    "nodes": [
      {
        "slug": "frailty-domains",
        "conceptId": "concept.perioperative-risk-recovery.frailty-preillness-anchor.v1",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.2370c8be8615faad"
        ],
        "conceptType": "workup",
        "objective": "Interpret acute loss versus recent baseline decline and choose the functional history that should anchor Clinical Frailty Scale assessment.",
        "task": "Which baseline functional state should Rosa’s team use for the Clinical Frailty Scale assessment in that operative episode?",
        "update": "",
        "choices": [
          {
            "id": "frailty",
            "label": "Instrumental-task dependence with personal-care independence",
            "rationale": "The recent account describes support for shopping and medication organization while personal care and transfers were independent. Current ward dependence represents an additional acute loss.",
            "temptation": "Use the recent corroborated baseline rather than the worst current or best remote state.",
            "correctUnder": "The represented recent pre-illness account applies.",
            "claims": [
              "frailty-preillness-anchor",
              "frailty-assess"
            ]
          },
          {
            "id": "current",
            "label": "Dependence for basic personal care and transfers",
            "rationale": "This imports the acute ward decrement into the baseline rather than using the recent pre-illness abilities.",
            "temptation": "Treat current illness-related dependence as the usual baseline.",
            "correctUnder": "If the recent pre-illness account itself documented help for dressing, toileting and transfers, this would describe baseline.",
            "claims": [
              "frailty-preillness-anchor"
            ]
          },
          {
            "id": "remote",
            "label": "Independence in personal and instrumental daily tasks",
            "rationale": "This matches the much older record but omits recent pre-illness support for shopping and medicines.",
            "temptation": "Anchor on the best historical state instead of the recent baseline.",
            "correctUnder": "If corroborated recent function still included independent shopping and medicine management as well as personal care, this baseline description would fit.",
            "claims": [
              "frailty-preillness-anchor"
            ]
          }
        ],
        "key": "frailty",
        "explanation": "First distinguish the acute ward loss from the recent pre-illness state. Then classify what help was already needed: shopping and medicine organization required assistance, while personal care and transfers did not. That recent baseline should inform the CFS assessment; neither current dependence nor remote independence should replace it. No numerical CFS score or treatment exclusion is being taught.",
        "claims": [
          "frailty-assess",
          "frailty-preillness-anchor"
        ],
        "gate": {
          "interpret": "Separate a sudden illness-related decrement from persistent recent support needs, then interpret which daily activities actually required assistance before illness.",
          "apply": "Use that recent functional state for the baseline CFS assessment rather than substitute current ward dependence or best remote function.",
          "closestChoice": "current",
          "decidingObservation": "The daughter’s dated pre-illness account already contains some support needs but not the ward dependence.",
          "counterfactual": "If the recent pre-illness account instead documented help with dressing, toileting and transfers, dependence for basic personal care and transfers would become the correct offered baseline.",
          "counterfactualChoice": "current",
          "deletionTest": "The dated recent account is necessary to distinguish instrumental assistance from basic-care dependence and from remote independence. Current and remote records supply credible but wrong temporal anchors; no protected numerical CFS descriptor is copied.",
          "cueAttack": "Three mutually distinguishable functional states use comparable scope. Removed the earlier source-selection counterfactual that made two records equivalent when both described the same baseline. The key requires the recent activities to be interpreted rather than a date-word match.",
          "stageAudit": "One baseline functional description entered for a historical operative frailty assessment, not a numerical score plus a treatment decision.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Both current dependence and remote independence are plausible anchoring errors; the trajectory is needed to choose the recent baseline. This is a fair moderate assessment decision.",
          "sequenceAudit": "New standalone case. The exact PASS recovery-support node keeps its original header, update and wording in a separate case.",
          "limitation": "BGS professional good-practice guidance supports the pre-illness anchor. No copied scoring scale, exact individual prognosis or automatic treatment exclusion is taught."
        },
        "previousConceptId": "concept.preoperative-frailty.validated-assessment",
        "conceptVersionReason": "Changes the scored meaning from selecting a generic multidomain assessment to selecting the appropriate supported baseline from a competing functional trajectory before acute operative illness."
      }
    ]
  },
  {
    "slug": "frailty-trajectory",
    "name": "Rosa Bennett",
    "age": 76,
    "sex": "Female",
    "complaint": "Surgery fitness review",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 76-year-old woman, attends clinic before elective colectomy. Her comorbidity list is short. Over recent months she has slowed, stopped carrying groceries and needed help rising from a chair. Her daughter also now organizes medicines after missed doses. Rosa attributes the changes to a sore knee, but help is needed even on days when the knee is comfortable.",
    "nodes": [
      {
        "slug": "recovery-support",
        "conceptId": "concept.perioperative-risk-recovery.observed-function-discharge-support.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Base recovery support on observed tasks and actual caregiver coverage rather than a single walking milestone.",
        "task": "Which discharge-support request best fits Rosa's later hospital record?",
        "update": "At a later clinic visit Rosa brings her completed postoperative rehabilitation record. With a therapist beside her she walked along a level corridor. On separate assessments she still needed another person for transfers and could not negotiate her home entrance steps. Her daughter worked outside the home during the day. Before discharge, the team was selecting the next support plan.",
        "choices": [
          {
            "id": "supported",
            "label": "Arrange supervised rehabilitation and reassess home transfers and steps",
            "rationale": "A level walk with a therapist does not establish the tasks needed to manage at home without daytime assistance.",
            "temptation": "Match demonstrated ability to the real home tasks and support.",
            "correctUnder": "The observed assistance needs and coverage gap apply.",
            "claims": [
              "frailty-pathway"
            ]
          },
          {
            "id": "home",
            "label": "Arrange home discharge with the daughter's evening assistance",
            "rationale": "Evening help does not cover the represented daytime transfer and entrance needs.",
            "temptation": "Treat a completed walk as sufficient evidence for all home tasks.",
            "correctUnder": "Independent transfers/steps or reliable daytime help matched to remaining needs could support this home plan.",
            "claims": [
              "frailty-pathway"
            ]
          },
          {
            "id": "visits",
            "label": "Arrange home discharge with intermittent therapy visits",
            "rationale": "Intermittent visits do not cover the documented person-assisted transfers needed between visits.",
            "temptation": "Treat periodic therapy as equivalent to the currently needed assistance.",
            "correctUnder": "Independent transfers between visits with remaining rehabilitation needs could support a home-therapy plan.",
            "claims": [
              "frailty-pathway"
            ]
          }
        ],
        "key": "supported",
        "explanation": "Read function against what was actually attempted. Supported corridor walking does not establish independent transfers or entrance steps. Ask for a support plan that covers current needs and reassesses recovery rather than assuming a periodic visit supplies continuous assistance.",
        "claims": [
          "frailty-pathway"
        ],
        "gate": {
          "interpret": "The successful task was supported level walking, while required home tasks still needed assistance.",
          "apply": "Choose reversible supervised rehabilitation planning rather than an uncovered home plan or intermittent visits that leave assistance gaps.",
          "closestChoice": "home",
          "decidingObservation": "Observed transfer/step assistance needs coincide with absent daytime coverage.",
          "counterfactual": "If transfers and entrance steps became independent on observed assessment, home discharge with evening support could become appropriate.",
          "counterfactualChoice": "home",
          "deletionTest": "Removing the task-specific findings makes a walk falsely sufficient. Daughter availability is a necessary constraint, not generic key permission.",
          "cueAttack": "All choices describe actual arrangements; no generic individualized/shared-decision key. The referral is for reassessment, not a mandated institution.",
          "stageAudit": "Discharge-support planning at the recorded review.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The resident must resist overgeneralizing a favorable functional milestone.",
          "sequenceAudit": "The first node addresses baseline reserve. These later task attempts, not that risk label, determine this support request.",
          "limitation": "One pathway overview; exact placement, coverage and goals require clinician/social-care assessment. No facility capability added."
        }
      }
    ],
    "preservedSourceLabels": [
      "2024 multisociety perioperative cardiovascular guideline — official AHA slides",
      "CPOC/BGS perioperative frailty pathway"
    ]
  },
  {
    "slug": "delirium-medication-course-delirium-anticholinergic-order",
    "name": "Helen Grant",
    "age": 79,
    "sex": "Female",
    "complaint": "Hospital cognition review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 79-year-old woman, attends clinic to review an outside postoperative medication decision. She had mild memory impairment before surgery and was alert and conversing on postoperative day 1. Her ward plan included hearing aids, glasses, daytime activity and sleep protection. The medication and administration record below was being reviewed before the next night’s doses.",
    "nodes": [
      {
        "slug": "delirium-anticholinergic-order",
        "conceptId": "concept.perioperative-risk-recovery.delirium-medication-risk.v1",
        "previousConceptId": "concept.postoperative-delirium.multicomponent-prevention-plan",
        "conceptVersionReason": "Changes a generic prevention-bundle label into recognition of a specific deliriogenic prescription within an otherwise concrete plan.",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.20c33df6bd9368da"
        ],
        "conceptType": "management",
        "objective": "Identify an avoidable anticholinergic order while preserving useful symptom prevention.",
        "task": "Which medication discontinuation best fits Helen’s postoperative delirium-prevention plan?",
        "update": "",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed teaching record; fictional patient observations",
          "items": [
            {
              "label": "Diphenhydramine",
              "value": "A bedtime sleep order added during this admission"
            },
            {
              "label": "Clonazepam",
              "value": "The same nightly home dose for years; monthly dispensing and her daughter confirm daily use"
            },
            {
              "label": "Oxycodone",
              "value": "As-needed incisional analgesia with scheduled acetaminophen; coughing pain fell from 8/10 to 3/10 after an administered dose"
            }
          ]
        },
        "choices": [
          {
            "id": "diphenhydramine",
            "label": "Discontinue the bedtime diphenhydramine order",
            "rationale": "The newly added sleep medicine contributes anticholinergic exposure. The competing medicines have represented withdrawal-prevention or analgesic roles that cannot simply be discarded.",
            "temptation": "Review each medicine’s actual indication and exposure rather than eliminate all sedating medicines indiscriminately.",
            "correctUnder": "The represented admission-added sleep order applies.",
            "claims": [
              "delirium-anticholinergic",
              "delirium-benzo-withdrawal-prevention",
              "delirium-analgesia"
            ]
          },
          {
            "id": "clonazepam",
            "label": "Discontinue the nightly clonazepam order",
            "rationale": "Longstanding daily benzodiazepine exposure makes abrupt elimination different from avoiding a newly prescribed sedative. Prevention of withdrawal needs a deliberate plan.",
            "temptation": "Apply a benzodiazepine-avoidance rule without reconciling dependence risk.",
            "correctUnder": "If this were a newly added sleep order without chronic exposure, while diphenhydramine were required for a current severe allergic reaction, removing clonazepam would be the appropriate offered change.",
            "claims": [
              "delirium-benzo-withdrawal-prevention"
            ]
          },
          {
            "id": "oxycodone",
            "label": "Discontinue the as-needed oxycodone order",
            "rationale": "Opioid exposure deserves careful titration, but the record shows substantial movement-related pain despite acetaminophen and meaningful response. Simply removing analgesia can leave another delirium contributor untreated.",
            "temptation": "Treat opioid reduction as equivalent to an adequate pain plan.",
            "correctUnder": "If analgesia were no longer needed or adverse effects required an alternative plan, discontinuation could become appropriate after reassessment.",
            "claims": [
              "delirium-analgesia"
            ]
          }
        ],
        "key": "diphenhydramine",
        "explanation": "Interpret why each medicine is present and what Helen has actually been receiving. The admission-added anticholinergic sleep order can be removed without abruptly withdrawing a longstanding benzodiazepine or abandoning treatment of substantial pain. This does not approve indefinite clonazepam use or prescribe a taper; it identifies the best immediate order change.",
        "claims": [
          "delirium-anticholinergic",
          "delirium-benzo-withdrawal-prevention",
          "delirium-analgesia"
        ],
        "gate": {
          "interpret": "Distinguish an admission-added sleep medicine from verified chronic daily exposure and from analgesia with a demonstrated current effect.",
          "apply": "Choose the immediate delirium-prevention order change that reduces unnecessary anticholinergic exposure without introducing withdrawal or uncontrolled-pain problems.",
          "closestChoice": "clonazepam",
          "decidingObservation": "Clonazepam is verified daily long-term treatment, whereas diphenhydramine is a new sleep order; acetaminophen has not removed the movement-related analgesic need.",
          "counterfactual": "If the indications were reversed so clonazepam was an unused new sleep order and diphenhydramine was required for a current severe allergic reaction, discontinuing clonazepam would become the appropriate offered change.",
          "counterfactualChoice": "clonazepam",
          "deletionTest": "Without verified exposure, removing clonazepam could look equivalent to avoiding a new sedative. Without the actual pain/response record, the opioid alternative cannot be fairly ranked. Chronology is postoperative day 1, so incisional analgesia is coherent.",
          "cueAttack": "Removed the key-only absent-allergy qualifier and corrected the preoperative-night chronology. All options discontinue one named order with parallel scope; the closest distractor is another commonly avoided medicine with a consequential exposure exception.",
          "stageAudit": "One immediate medication-order discontinuation for prevention, not a compound taper, analgesic substitution or agitation-treatment task.",
          "predictedDifficulty": "hard",
          "difficultyReason": "The resident must balance two otherwise credible medication-avoidance choices against actual chronic exposure and pain response. Generic “avoid benzodiazepines” reasoning produces the nearest error.",
          "sequenceAudit": "Standalone revised case. The PASS hypoactive-delirium investigation retains its exact original header and update in a separate case; no new medication feedback precedes it.",
          "limitation": "AGS guideline directly supports anticholinergic review, withdrawal exceptions and pain management. No dose, taper, universal benzodiazepine continuation or causal proof of delirium is taught."
        }
      }
    ]
  },
  {
    "slug": "delirium-medication-course",
    "name": "Helen Grant",
    "age": 79,
    "sex": "Female",
    "complaint": "Hospital cognition review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 79-year-old woman, attends clinic with her daughter to review a completed hospital surgical course. Before the operation she had mild memory impairment but managed conversations and daily routines. The ward prevention plan included glasses, hearing aids, daytime activity and sleep protection. The founder reviews these medication orders for the night before surgery.",
    "nodes": [
      {
        "slug": "delirium-quiet-cause",
        "conceptId": "concept.perioperative-risk-recovery.hypoactive-delirium-targeted-assessment.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "workup",
        "objective": "Recognize an acute quiet attention change and investigate a concrete reversible contributor rather than equate it with baseline dementia.",
        "task": "Which investigation should Helen's hospital team prioritize for this new episode?",
        "update": "After surgery Helen alternated between normal conversation and staring without following questions. She passed repeated small amounts of urine but had a tender rounded lower-abdominal fullness after voiding. Oxygenation and glucose were in range, there was no focal neurologic finding, and the catheter had been removed earlier. Pain elsewhere was controlled.",
        "choices": [
          {
            "id": "bladder",
            "label": "Bedside postvoid bladder ultrasound",
            "rationale": "Acute fluctuating inattention warrants cause assessment; small voids do not exclude retention when postvoid lower-abdominal fullness persists.",
            "temptation": "Connect the voiding pattern to a reversible contributor.",
            "correctUnder": "The localized postvoid findings apply.",
            "claims": [
              "delirium-course",
              "delirium-causes",
              "urinary-retention-assess"
            ],
            "timingProfileId": "timing.test.bladder_scan"
          },
          {
            "id": "head",
            "label": "Noncontrast head CT",
            "rationale": "The local urinary observations identify a current targeted question; no focal finding or head-injury history is supplied to prioritize CT.",
            "temptation": "Image an acute attention change before assessing its focal reversible clue.",
            "correctUnder": "A new focal deficit or head injury would change the imaging priority.",
            "claims": [
              "delirium-causes"
            ],
            "timingProfileId": "timing.test.ct"
          },
          {
            "id": "eeg",
            "label": "Electroencephalography",
            "rationale": "The voiding/examination observations warrant assessment before choosing a seizure investigation for this course.",
            "temptation": "Interpret staring episodes as necessarily ictal.",
            "correctUnder": "Stereotyped spells or persistent unexplained altered consciousness after cause assessment could prompt EEG.",
            "claims": [
              "delirium-causes"
            ],
            "timingProfileId": "timing.test.physiology"
          }
        ],
        "key": "bladder",
        "explanation": "Quiet behavior can still be an acute delirium pattern. Interpret the postvoid fullness and small-volume voids, then assess residual bladder volume. This does not establish urinary retention as the only contributor.",
        "claims": [
          "delirium-course",
          "delirium-causes",
          "urinary-retention-assess"
        ],
        "gate": {
          "interpret": "Differentiate acute fluctuating attention from baseline memory impairment and small voids from proof of bladder emptying.",
          "apply": "Select a targeted residual-volume assessment for a reversible cause.",
          "closestChoice": "head",
          "decidingObservation": "Tender postvoid lower-abdominal fullness with repeated small voids and no focal deficit.",
          "counterfactual": "A new focal neurologic deficit with an unremarkable bladder examination would prioritize head imaging.",
          "counterfactualChoice": "head",
          "deletionTest": "The new examination changes the investigation. Necessary glucose/oxygen/focal checks preserve fairness; no unused laboratory panel or exact urine-time trigger.",
          "cueAttack": "No bladder-scan omission is named. All three choices are investigations with equivalent metadata treatment; the previous task did not teach retention.",
          "stageAudit": "Current cause investigation rather than sedation or definitive treatment.",
          "predictedDifficulty": "hard",
          "difficultyReason": "Two reassuring shortcuts compete: quiet behavior and apparent continued urination.",
          "sequenceAudit": "The new postoperative examination earns the later node; the earlier medication answer cannot determine the current investigation.",
          "limitation": "NIDDK supports residual assessment, delirium guidelines support cause evaluation; the clinical ranking is bounded synthesis requiring review. No CT/EEG protocol taught."
        }
      }
    ],
    "preservedSourceLabels": [
      "ESAIC postoperative delirium guideline",
      "AGS postoperative delirium guideline",
      "NIDDK diagnosis of urinary retention"
    ]
  },
  {
    "slug": "art-enteral-interruption",
    "name": "Maya Lewis",
    "age": 47,
    "sex": "Female",
    "complaint": "Hospital medicine review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 47-year-old woman, attends clinic after recovery from an outside abdominal operation. The founder reviews a period of bowel dysfunction. Nasogastric suction continued; each clamping attempt caused vomiting, and administered oral tablets returned in the drainage. Her ART was prescribed as a complete oral regimen. A completed pharmacist/HIV-clinician review documented no complete non-enteral substitute in the hospital formulary.",
    "nodes": [
      {
        "slug": "art-unavoidable-interruption",
        "conceptId": "concept.gs028g.hiv-perioperative.art-continuity",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.912ba48566fbd7dc"
        ],
        "conceptType": "management",
        "objective": "Apply the unavoidable complete-regimen interruption boundary after actual route/formulation review.",
        "task": "Which ART plan should Maya's team have used during that documented interval?",
        "update": "",
        "choices": [
          {
            "id": "complete-hold",
            "label": "Coordinate temporary interruption of the complete oral regimen",
            "rationale": "When the complete regimen cannot be delivered despite route review, expert-coordinated interruption avoids unplanned partial treatment.",
            "temptation": "Recognize that continuity efforts have reached an actual route boundary.",
            "correctUnder": "The verified unavoidable interval applies.",
            "claims": [
              "art-continuity",
              "art-all-held"
            ]
          },
          {
            "id": "partial",
            "label": "Continue the regimen components that can be obtained separately",
            "rationale": "Availability of individual agents does not establish an effective complete regimen.",
            "temptation": "Equate partial administration with preserved ART continuity.",
            "correctUnder": "A complete alternative regimen explicitly designed by the HIV clinician would be a different plan.",
            "claims": [
              "art-all-held"
            ]
          },
          {
            "id": "enteral",
            "label": "Continue the complete regimen with repeated tube dosing",
            "rationale": "The actual repeated vomiting and return of administered tablets show that repeated dosing is not reliable delivery of the regimen.",
            "temptation": "Apply a continuation rule without checking the actual route review.",
            "correctUnder": "A functioning enteral route with verified compatible formulations would support continuation.",
            "claims": [
              "art-continuity"
            ]
          }
        ],
        "key": "complete-hold",
        "explanation": "Avoid routine interruption when ART can be delivered. Here actual route and formulation review establishes an unavoidable interval, so coordinate the complete-regimen plan with the HIV clinician rather than improvise partial treatment.",
        "claims": [
          "art-continuity",
          "art-all-held"
        ],
        "gate": {
          "interpret": "Interpret failed clamping attempts and returned tablets as ineffective enteral delivery, rather than a generic fasting prohibition.",
          "apply": "Use an expert-coordinated complete-regimen interruption rather than partial substitution.",
          "closestChoice": "enteral",
          "decidingObservation": "Repeated clamping/dosing attempts failed, with tablets returned in drainage and no complete non-enteral substitute after expert review.",
          "counterfactual": "If functioning enteral access and verified compatible full-regimen formulations were available, continue the complete regimen through that route.",
          "counterfactualChoice": "enteral",
          "deletionTest": "Deleting the actual route review makes the key premature. The named roles establish that the prior review occurred, not that a convenient resource can be summoned to reveal the key.",
          "cueAttack": "The task does not announce interruption is unavoidable. Every option is a complete ART instruction of comparable scope; no booster-only cue or midazolam comparison.",
          "stageAudit": "Regimen administration during one defined historical interval.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The resident must reconcile the valid continuity rule with a documented route failure.",
          "sequenceAudit": "Standalone. The exact passed ART/midazolam case and its anesthesia companion are preserved.",
          "limitation": "One accessible primary guideline; no drug-specific conversion, washout, component restart or dose taught."
        }
      }
    ],
    "preservedSourceLabels": [
      "NYSDOH AIDS Institute perioperative HIV guideline"
    ]
  },
  {
    "slug": "breast-site-recovery-postoperative-targeted-ultrasound",
    "name": "Grace Turner",
    "age": 53,
    "sex": "Female",
    "complaint": "Incision-site fullness",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 53-year-old woman, attends clinic ten days after excision of a benign left breast lesion. The current incision and new localized fullness are at 2 o’clock. An older biopsy scar is at 6 o’clock. The outside ultrasound report says no postoperative fluid collection. Its complete acquisition index contains only images marked left 6 o’clock, and the sonographer confirms using the inferior old scar as the examination target. The current wound is intact and has no erythema.",
    "nodes": [
      {
        "slug": "postoperative-targeted-ultrasound",
        "conceptId": "concept.perioperative-risk-recovery.postoperative-ultrasound-target-adequacy.v1",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.d97c41a240f31852"
        ],
        "conceptType": "workup",
        "objective": "Assess the target adequacy of a negative postoperative ultrasound before choosing further investigation.",
        "task": "Which investigation should Grace undergo next for the current 2 o’clock incision-site fullness?",
        "update": "",
        "choices": [
          {
            "id": "ultrasound",
            "label": "Targeted ultrasound at the marked 2 o’clock incision",
            "rationale": "The completed examination covered the old inferior scar, so its negative result does not characterize the current site. Ultrasound can characterize the localized postoperative collection.",
            "temptation": "Check what tissue was actually examined before treating a report as a negative assessment of the current target.",
            "correctUnder": "The represented acquisition mismatch applies.",
            "claims": [
              "claim.postoperative-seroma.ultrasound-characterization"
            ],
            "timingProfileId": "timing.test.ultrasound"
          },
          {
            "id": "mammography",
            "label": "Diagnostic mammography of the left breast",
            "rationale": "This may be appropriate for a different new palpable-lesion workup, but it does not replace the missing targeted characterization of this early localized postoperative site.",
            "temptation": "Escalate modality after a negative report without verifying the reported target.",
            "correctUnder": "A later unexplained palpable lesion after adequate site-specific assessment could require diagnostic breast imaging rather than this narrow postoperative-collection pathway.",
            "claims": [
              "claim.postoperative-seroma.ultrasound-characterization"
            ],
            "timingProfileId": "timing.test.mammography"
          },
          {
            "id": "aspiration",
            "label": "Ultrasound-guided aspiration of the 2 o’clock fullness",
            "rationale": "A drainable collection at the current site has not been demonstrated. Targeted imaging should establish what the finding is before a therapeutic aspiration is selected.",
            "temptation": "Treat the postoperative location as proof that the palpable finding is drainable fluid.",
            "correctUnder": "A demonstrated collection producing symptoms or wound tension could support aspiration after appropriate assessment.",
            "claims": [
              "claim.postoperative-seroma.ultrasound-characterization",
              "claim.postoperative-seroma.uncomplicated-observation"
            ],
            "timingProfileId": "timing.test.ultrasound_guided_aspiration"
          }
        ],
        "key": "ultrasound",
        "explanation": "First match the actual acquisition to the current clinical target. A complete negative study of the 6 o’clock scar does not assess the 2 o’clock postoperative bed. Then choose focused characterization of that early wound-site change rather than escalate because of a supposedly adequate negative study or aspirate uncharacterized tissue.",
        "claims": [
          "claim.postoperative-seroma.ultrasound-characterization",
          "claim.postoperative-seroma.uncomplicated-observation"
        ],
        "gate": {
          "interpret": "Use operative-site and complete acquisition provenance to recognize that the negative examination did not cover the current finding.",
          "apply": "Select site-matched ultrasound characterization before treating the wrong-site negative as a completed workup or assuming the fullness is drainable.",
          "closestChoice": "mammography",
          "decidingObservation": "The current incision is at 2 o’clock while the complete acquired index and operator account identify the old 6 o’clock scar.",
          "counterfactual": "If adequate current-site ultrasound instead demonstrated a symptomatic drainable fluid pocket at 2 o’clock, ultrasound-guided aspiration would become the appropriate offered next step.",
          "counterfactualChoice": "aspiration",
          "deletionTest": "Without acquisition provenance a negative report could prompt a different palpable-lesion pathway. Ten-day chronology and incision localization distinguish an early postoperative question from an unspecified new mass. The complete index plus operator account establish a wrong acquisition, not merely missing exported images.",
          "cueAttack": "Removed “palpation cannot distinguish fluid from soft tissue,” the irrelevant old mammogram and MRI filler. Three named investigations/procedures address the same current site. The target in the task is necessary for the acquisition comparison, not a diagnosis cue.",
          "stageAudit": "One next investigation of the current postoperative site; the aspiration plan is a credible premature procedure, not an unrelated medicine.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "A reassuring negative report competes with acquisition evidence and with the reasonable impulse to escalate imaging in an older adult. Moderate difficulty comes from evidence adequacy, not hidden chronology.",
          "sequenceAudit": "Standalone revised site-review case; no future ultrasound result or seroma management answer is visible.",
          "limitation": "Existing locally verified seroma evidence supports ultrasound characterization. Wrong-target limits are a logical application to constructed acquisition records, not a new universal breast-mass algorithm. No claim that mammography is never indicated."
        },
        "previousConceptId": "concept.postoperative-seroma.ultrasound-characterization",
        "conceptVersionReason": "Changes the scored meaning from simple modality selection to recognizing a negative wrong-target acquisition and selecting a site-appropriate next study."
      }
    ]
  },
  {
    "slug": "breast-site-recovery-postoperative-seroma-observe",
    "name": "Grace Turner",
    "age": 53,
    "sex": "Female",
    "complaint": "Incision-site fullness",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 53-year-old woman, attends clinic four weeks after excision of a benign breast lesion without an implant. The record shows one earlier needle aspiration when the incision-site pocket made reaching and dressing painful. She now reaches the upper shelf and dresses without assistance; she notices the pocket only when pressing on it. Repeat ultrasound shows a thin-walled 3.0 × 0.8 × 1.5 cm fluid pocket, compared with 2.4 × 0.6 × 1.2 cm previously, with no solid component or surrounding hypervascularity. Temperature is 98.4°F and the skin moves freely over the closed incision, without erythema.",
    "nodes": [
      {
        "slug": "postoperative-seroma-observe",
        "conceptId": "concept.postoperative-seroma.uncomplicated-observation",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.eba93614106b31d1"
        ],
        "conceptType": "management",
        "objective": "Use current symptoms and wound effect, rather than persistence of fluid alone, to rank intervention versus observation.",
        "task": "Which current management plan best fits Grace’s postoperative incision-site collection?",
        "update": "",
        "choices": [
          {
            "id": "observe",
            "label": "Clinical observation with reassessment",
            "rationale": "The current functional course differs from the earlier symptomatic episode. Reappearance or a modest imaging increase does not by itself establish a need for another invasive procedure in this uncomplicated pocket.",
            "temptation": "Use present symptoms and wound findings rather than repeat a previously helpful intervention automatically.",
            "correctUnder": "The represented recovered function and uncomplicated current pocket apply.",
            "claims": [
              "claim.postoperative-seroma.uncomplicated-observation",
              "seroma-intervention-context"
            ]
          },
          {
            "id": "aspirate",
            "label": "Repeat image-guided needle aspiration",
            "rationale": "Aspiration helped the earlier painful pocket, but the present functional limitation has resolved. Repeating it solely because the image is larger adds a procedure without the former indication.",
            "temptation": "Transfer the earlier symptom-responsive decision to an imaging finding after clinical recovery.",
            "correctUnder": "Recurrent meaningful pain, restricted movement or wound tension from a demonstrated collection could support aspiration.",
            "claims": [
              "claim.postoperative-seroma.uncomplicated-observation",
              "seroma-intervention-context"
            ],
            "timingProfileId": "timing.test.ultrasound_guided_aspiration"
          },
          {
            "id": "drain",
            "label": "Image-guided catheter drainage",
            "rationale": "This is a real option for selected difficult recurrent collections, but one recurrence with recovered function is not evidence that a drain is now needed.",
            "temptation": "Escalate after any recurrence rather than assess the current clinical burden and course.",
            "correctUnder": "A persistently symptomatic collection requiring repeated drainage could prompt specialist procedural planning; no universal catheter threshold is claimed.",
            "claims": [
              "seroma-intervention-context"
            ],
            "timingProfileId": "timing.test.ultrasound_guided_aspiration"
          }
        ],
        "key": "observe",
        "explanation": "Interpret recurrence and current effect separately. The earlier aspiration addressed pain and restricted use; those effects are no longer present despite a persistent image. Observation with reassessment fits this current uncomplicated pocket. Repeat aspiration and catheter drainage remain real interventions for different clinical burdens, not automatic responses to persistence.",
        "claims": [
          "claim.postoperative-seroma.ultrasound-characterization",
          "claim.postoperative-seroma.uncomplicated-observation",
          "seroma-intervention-context"
        ],
        "gate": {
          "interpret": "A recurrent fluid image does not mean the prior functional problem has recurred; current reaching, dressing and symptom history differ from the earlier episode.",
          "apply": "Choose clinical observation rather than repeat or escalate drainage in response to recurrence alone.",
          "closestChoice": "aspirate",
          "decidingObservation": "Reaching and dressing are now unimpaired and the pocket is noticed only on pressure, despite the slight imaging increase.",
          "counterfactual": "If the current pocket again caused meaningful reaching/dressing pain or wound tension, repeat image-guided needle aspiration would become the appropriate offered intervention.",
          "counterfactualChoice": "aspirate",
          "deletionTest": "Deleting the current functional course leaves the earlier painful recurrence as a possible reason to aspirate. The repeated image is needed for the competing interpretation; the wound and temperature observations bound an uncomplicated collection without listing every nonintervention rationale.",
          "cueAttack": "Removed the vague “later review” task and antibiotic foil. All options are management of the known collection. The key is a short actual plan; repeat aspiration is a credible previously successful treatment rather than a treatment ruled out by an absent indication sentence.",
          "stageAudit": "One current collection-management plan, comparing observation and two real drainage strategies.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Prior symptomatic benefit and a larger recurrent image compete with improved actual function. The fair ceiling is moderate; the image is not being used as an invented size cutoff.",
          "sequenceAudit": "Standalone case with its own imaging and prior-treatment record. No earlier modality explanation is needed.",
          "limitation": "The observation rule reuses the exact locally verified seroma claim and original access date. Added CC BY observational evidence establishes real intervention options, not a mandatory drainage threshold. Catheter drainage temporarily borrows the existing image-guided-fluid-procedure wait profile; manager must review an exact catheter profile before admission."
        }
      }
    ]
  },
  {
    "slug": "contrast-events",
    "name": "Laura Kim",
    "age": 54,
    "sex": "Female",
    "complaint": "Contrast history review",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 54-year-old woman, attends clinic before another imaging referral. Her referral header says “iodinated contrast—hives.” She brings the original administration and symptom records below. The team is correcting the agent-specific reaction entry before the referral is sent.",
    "nodes": [
      {
        "slug": "contrast-event-provenance",
        "conceptId": "concept.perioperative-risk-recovery.contrast-agent-attribution.v1",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.423232a9d2e33684"
        ],
        "conceptType": "workup",
        "objective": "Reconcile contrast administration provenance and event phenotype before updating an agent-specific hypersensitivity record.",
        "task": "Which agent-specific hypersensitivity entry is supported by Laura’s original records?",
        "update": "",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed teaching record; fictional patient observations",
          "items": [
            {
              "label": "CT visit: administration",
              "value": "Iohexol given intravenously at 10:02"
            },
            {
              "label": "CT visit: symptom note",
              "value": "At 10:03, warmth across the body; it ended during observation. Skin examination recorded no wheals."
            },
            {
              "label": "MRI visit: administration",
              "value": "Gadobutrol given intravenously at 14:12"
            },
            {
              "label": "MRI visit: symptom note",
              "value": "At 14:20, itchy raised plaques on the chest and arms; the nurse’s map places them away from the injection site. Blood pressure and breathing remained unchanged."
            }
          ]
        },
        "choices": [
          {
            "id": "gadobutrol",
            "label": "Gadobutrol-associated immediate hypersensitivity-type reaction",
            "rationale": "The administration record links the generalized wheal-type event to gadobutrol. The iohexol event has an isolated warmth phenotype.",
            "temptation": "Separate the actual administered agent from the copied contrast-family label.",
            "correctUnder": "The represented agent/event pairing applies.",
            "claims": [
              "contrast-urticaria",
              "contrast-warmth",
              "contrast-agent-specific"
            ]
          },
          {
            "id": "iohexol",
            "label": "Iohexol-associated immediate hypersensitivity-type reaction",
            "rationale": "This preserves the referral’s agent attribution even though the original iohexol event describes warmth without the generalized skin findings.",
            "temptation": "Trust the copied iodinated-contrast label over the medication administration record.",
            "correctUnder": "If the generalized wheal event had followed iohexol administration rather than gadobutrol, this entry would be supported.",
            "claims": [
              "contrast-urticaria",
              "contrast-warmth",
              "contrast-agent-specific"
            ]
          },
          {
            "id": "both",
            "label": "Hypersensitivity-type reactions to both named agents",
            "rationale": "This merges a physiologic warmth event with a separate generalized skin event and loses the distinction needed for future planning.",
            "temptation": "Apply one contrast-reaction label to every temporally associated sensation across agents.",
            "correctUnder": "Separate original records of generalized hypersensitivity-type findings after each agent would support two distinct agent-specific entries.",
            "claims": [
              "contrast-warmth",
              "contrast-agent-specific"
            ]
          }
        ],
        "key": "gadobutrol",
        "explanation": "Interpret the event phenotype, then check which agent was actually administered for that event. The generalized wheal-type event follows gadobutrol, while the iohexol visit records isolated transient warmth. Document the actual agent and symptoms. This does not prove an IgE mechanism, permit every other agent or select a premedication protocol.",
        "claims": [
          "contrast-urticaria",
          "contrast-warmth",
          "contrast-document",
          "contrast-agent-specific"
        ],
        "gate": {
          "interpret": "Distinguish a generalized wheal-type event from isolated warmth using distribution and observed skin findings.",
          "apply": "Use the administration provenance to correct the named-agent record instead of carrying forward an iodinated-contrast label or merging both events.",
          "closestChoice": "iohexol",
          "decidingObservation": "The generalized raised skin findings follow the MRI administration record for gadobutrol; iohexol belongs to the separate warmth event.",
          "counterfactual": "If the original administration names were exchanged while the symptom records remained in their respective visits, the supported hypersensitivity entry would switch to iohexol.",
          "counterfactualChoice": "iohexol",
          "deletionTest": "Deleting administration provenance leaves the clinical phenotype recognizable but cannot identify the correct agent. Deleting symptoms leaves agent names without a supported reaction classification. Neither record alone answers the complete documentation decision.",
          "cueAttack": "Removed the explained local leakage event and the simple “which symptom is allergic” task. All choices are agent-specific record entries with parallel scope; the copied header is a credible conflict rather than the only place a diagnosis appears.",
          "stageAudit": "One documentation correction that affects the next imaging referral, not premedication, agent substitution or proof of mechanism.",
          "predictedDifficulty": "hard",
          "difficultyReason": "A familiar allergic phenotype must be reconciled with the actual contrast class and administration record; accepting the header yields a credible wrong agent.",
          "sequenceAudit": "Standalone and independent of the frozen extravasation case.",
          "limitation": "ESUR supports agent-specific documentation. The current exercise records a hypersensitivity-type pattern only; it does not establish immunologic mechanism or prescribe a future imaging protocol."
        },
        "previousConceptId": "concept.iodinated-contrast.physiologic-versus-allergic-like-reaction",
        "conceptVersionReason": "Changes the scored meaning from identifying a familiar allergic-like symptom to reconciling actual administered agent and event phenotype for a consequential agent-specific record update."
      }
    ]
  },
  {
    "slug": "contrast-local-course",
    "name": "Amelia Stone",
    "age": 55,
    "sex": "Female",
    "complaint": "Hand swelling review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "obvious_emergency",
    "presentation": "{patientName}, a 55-year-old woman, attends clinic after an outside CT-related hand injury. The founder reviews the earlier management decision. Injection stopped when contrast leaked around a dorsal-hand catheter. Despite elevation, swelling became tense, finger sensation decreased and passive finger extension caused marked pain. Breathing and blood pressure were unchanged. A different prior scan had caused generalized hives.",
    "nodes": [
      {
        "slug": "extravasation-progressive-injury",
        "conceptId": "concept.n2r2.progressive-extravasation-and-reaction-history",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.98aaf96b404b18ee"
        ],
        "conceptType": "management",
        "objective": "Use progressive local injury after initial care to select urgent surgical escalation without relabeling it as a prior systemic reaction.",
        "task": "Which next action best fits Amelia at that earlier CT decision point?",
        "update": "",
        "choices": [
          {
            "id": "surgical",
            "label": "Obtain urgent hand-surgical assessment",
            "rationale": "Progressive tense swelling, sensory change and marked pain after extravasation require urgent severity-based surgical assessment.",
            "temptation": "Use trajectory and local injury rather than a copied historical mechanism.",
            "correctUnder": "The worsening local course applies.",
            "claims": [
              "extravasation-severity"
            ]
          },
          {
            "id": "local",
            "label": "Continue elevation with serial injection-site assessment",
            "rationale": "Conservative care fits mild stable injuries, but the actual course has progressed despite that initial care.",
            "temptation": "Underweight the changing tissue/sensory findings after initial care.",
            "correctUnder": "Improving pain/swelling without sensory or skin change could support ongoing monitored conservative care.",
            "claims": [
              "extravasation-severity"
            ]
          },
          {
            "id": "reaction",
            "label": "Treat the episode with systemic antihistamine therapy",
            "rationale": "The current episode is a progressive local leakage injury; a separate prior hives event does not establish that this is a systemic reaction.",
            "temptation": "Use the prior allergy entry as the current mechanism.",
            "correctUnder": "A current generalized urticarial episode would need an appropriate reaction-treatment assessment.",
            "claims": [
              "contrast-urticaria",
              "contrast-document",
              "extravasation-severity"
            ]
          }
        ],
        "key": "surgical",
        "explanation": "Interpret the worsening local course after initial care, then escalate for threatened tissue assessment. Keep the prior hives event separately documented; this item prescribes no pressure cutoff, contrast-volume trigger or operation.",
        "claims": [
          "extravasation-severity",
          "contrast-document",
          "contrast-urticaria"
        ],
        "gate": {
          "interpret": "Worsening local pain/sensation after actual initial measures is a different problem from prior generalized hives.",
          "apply": "Escalate local injury assessment rather than repeat an inadequate earlier plan or treat a copied mechanism.",
          "closestChoice": "local",
          "decidingObservation": "Progression despite elevation with sensory loss and pain on passive extension.",
          "counterfactual": "If pain and swelling were improving and sensation remained normal, continued monitored local care would become reasonable.",
          "counterfactualChoice": "local",
          "deletionTest": "The worsening trajectory is indispensable; without it conservative care remains reasonable. The older hives record is a purposeful competing attribution.",
          "cueAttack": "Three specific actions. No named missing consultation or transfer-availability permission. The question asks action, not a compartment label matched by one option.",
          "stageAudit": "Immediate next management action at the recorded scan, with initial injection stop already completed.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "A pre-existing allergy label and the expectation of benign resolution can misdirect urgency and mechanism.",
          "sequenceAudit": "Standalone; historical N2 v3 assessment-ranking version remains source-held and unchanged.",
          "limitation": "One direct guideline; new evidence supports this different severity-based escalation task, not automatic unpark/approval of the frozen N2 v3 assessment comparison."
        }
      }
    ],
    "preservedSourceLabels": [
      "ESUR contrast hypersensitivity guideline, Part 1",
      "ESUR contrast safety guidance, version 10",
      "ESUR contrast extravasation guideline"
    ]
  },
  {
    "slug": "allergy-severe-history",
    "name": "Evelyn Scott",
    "age": 68,
    "sex": "Female",
    "complaint": "Antibiotic history review",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 68-year-old woman, attends clinic before ambulatory surgery. The penicillin-allergy entry says “rash years ago.” Retrieved hospital records instead describe widespread blistering, painful oral erosions and liver injury developing after several days of amoxicillin, with hospital treatment. She has not taken a penicillin since.",
    "nodes": [
      {
        "slug": "penicillin-delayed-boundary",
        "conceptId": "concept.perioperative-risk-recovery.penicillin-severe-delayed-boundary.v1",
        "previousConceptId": "concept.variety3.penicillin-label-structured-history",
        "conceptVersionReason": "Changes initial history gathering into the severe-delayed-reaction exclusion from routine skin-test/direct-challenge pathways after actual records are obtained.",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.c21624f2d608d648"
        ],
        "conceptType": "management",
        "objective": "Use severe delayed reaction findings to avoid an inappropriate routine allergy-testing pathway.",
        "task": "Which allergy-evaluation plan fits Evelyn's retrieved reaction history?",
        "update": "",
        "choices": [
          {
            "id": "specialist",
            "label": "Retain the reaction record and refer to a drug-allergy specialist",
            "rationale": "Blistering, mucosal injury and organ involvement are severe delayed-reaction features outside routine skin-test or direct-challenge pathways.",
            "temptation": "Let actual severity change the pathway despite an old vague header.",
            "correctUnder": "The retrieved severe delayed features apply.",
            "claims": [
              "allergy-severe-delayed"
            ]
          },
          {
            "id": "skin",
            "label": "Perform penicillin skin testing followed by an oral challenge",
            "rationale": "This is not the routine evaluation route for the represented severe delayed reaction.",
            "temptation": "Use an immediate-allergy testing pathway for a different mechanism.",
            "correctUnder": "A compatible immediate-type history without severe delayed features could justify a specialist-selected skin-test/challenge pathway.",
            "claims": [
              "allergy-history",
              "allergy-severe-delayed"
            ],
            "timingProfileId": "timing.test.general_diagnostic"
          },
          {
            "id": "direct",
            "label": "Perform a supervised direct oral amoxicillin challenge",
            "rationale": "A remote date does not make severe delayed mucosal/organ injury a low-risk history.",
            "temptation": "Use time since the event as the only risk classifier.",
            "correctUnder": "A validated low-risk history without severe delayed features could support an appropriate supervised protocol.",
            "claims": [
              "allergy-history",
              "allergy-severe-delayed"
            ],
            "timingProfileId": "timing.test.general_diagnostic"
          }
        ],
        "key": "specialist",
        "explanation": "Interpret the retrieved phenotype rather than the short allergy header. Severe delayed features change testing eligibility. Retain the history and obtain specialist assessment; no challenge protocol or perioperative antibiotic is chosen here.",
        "claims": [
          "allergy-history",
          "allergy-severe-delayed"
        ],
        "gate": {
          "interpret": "Delayed blistering with mucosal and organ injury is materially different from an isolated benign childhood rash.",
          "apply": "Avoid routine immediate-allergy testing or direct challenge and preserve specialist review.",
          "closestChoice": "skin",
          "decidingObservation": "Severe delayed mucosal/organ involvement in the actual retrieved record.",
          "counterfactual": "A verified immediate-type reaction without severe delayed features would change the evaluation to a specialist-selected immediate-allergy testing pathway.",
          "counterfactualChoice": "skin",
          "deletionTest": "The old vague label cannot determine the pathway; the retrieved timing/severity observations change it. No demographic probability or exact reaction interval invented.",
          "cueAttack": "No named severe-reaction diagnosis in the stem. All options specify evaluation plans; the key is shorter than the two testing competitors. Both testing choices have previews.",
          "stageAudit": "Select evaluation pathway, not choose prophylactic antibiotics or conduct a challenge now.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The plausible error is using a familiar penicillin skin-test sequence for a severe delayed phenotype.",
          "sequenceAudit": "Standalone. Prior history-first feedback is not treated as permission for a protocol.",
          "limitation": "The inherited allergy-protocol teaching hold remains. This is a sourced exclusion boundary, not approval of a challenge, delabeling or prophylactic antibiotic."
        }
      }
    ],
    "preservedSourceLabels": [
      "CDC clinical features of penicillin allergy"
    ]
  },
  {
    "slug": "low-risk-operation",
    "name": "Samuel Ortiz",
    "age": 67,
    "sex": "Male",
    "complaint": "Preoperative test request",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 67-year-old man, attends clinic before removal of a superficial forearm lipoma under local anaesthesia. Knee arthritis limits walking, so the intake form cannot estimate exercise capacity from stairs. He has no exertional chest pressure, new dyspnea or known cardiovascular disease. The referral requests cardiac testing because of the walking limitation.",
    "nodes": [
      {
        "slug": "low-risk-cardiac-testing",
        "conceptId": "concept.perioperative-risk-recovery.low-risk-ischemia-testing.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "workup",
        "objective": "Apply procedure risk before turning a noncardiac exercise limitation into routine ischemia testing.",
        "task": "Which preoperative cardiac-evaluation strategy best fits Samuel's planned procedure?",
        "update": "",
        "choices": [
          {
            "id": "clinical",
            "label": "Clinical assessment without additional ischemia testing",
            "rationale": "Unknown walking capacity does not establish a stress-testing indication before this low-risk procedure without symptoms.",
            "temptation": "Interpret why activity is limited and what operation is planned.",
            "correctUnder": "The low-risk procedure and absent independent cardiac indication apply.",
            "claims": [
              "cardiac-test-select"
            ]
          },
          {
            "id": "stress",
            "label": "Pharmacologic stress echocardiography before the procedure",
            "rationale": "Avoiding exercise does not make stress imaging useful when the procedure and current clinical assessment do not justify it.",
            "temptation": "Select a nonexercise modality before deciding whether testing is indicated.",
            "correctUnder": "An elevated-risk operation with elevated predicted risk and poor capacity, where testing would change management, could justify selective stress testing.",
            "claims": [
              "cardiac-test-select"
            ],
            "timingProfileId": "timing.test.echocardiography"
          },
          {
            "id": "cta",
            "label": "Coronary CT angiography before the procedure",
            "rationale": "An anatomic coronary study does not solve the lack of a testing indication in this low-risk setting.",
            "temptation": "Escalate modality to compensate for unavailable exercise data.",
            "correctUnder": "Selected elevated-risk cases with a management-changing high-risk coronary-anatomy question need a separate assessment.",
            "claims": [
              "cardiac-test-select"
            ],
            "timingProfileId": "timing.test.ct_angiography"
          }
        ],
        "key": "clinical",
        "explanation": "Decide whether testing is indicated before choosing how to test. An orthopedic limitation and a low-risk local procedure do not create an independent ischemia-testing indication.",
        "claims": [
          "cardiac-test-select"
        ],
        "gate": {
          "interpret": "The walking limit is orthopedic and the procedure has little physiologic burden.",
          "apply": "Avoid automatic stress or coronary-anatomic testing just because exercise capacity is uncertain.",
          "closestChoice": "stress",
          "decidingObservation": "A superficial local procedure with no independent cardiac symptoms.",
          "counterfactual": "With an elevated-risk operation, elevated validated risk, poor capacity and a result that would change care, selective pharmacologic stress testing could become appropriate.",
          "counterfactualChoice": "stress",
          "deletionTest": "Procedure type changes the testing decision. The knee explanation prevents inability to exercise from being silently treated as cardiac symptoms.",
          "cueAttack": "No task term such as low-risk or unnecessary matches the key. All labels describe an evaluation strategy; both testing paths receive previews.",
          "stageAudit": "Whether and how to perform preoperative ischemia evaluation.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The credible error picks a pharmacologic modality before establishing indication.",
          "sequenceAudit": "Standalone; no earlier risk-category teaching.",
          "limitation": "No numerical risk score or exam-weight assertion. One primary guideline; selective testing is conditional, not automatic."
        }
      }
    ],
    "preservedSourceLabels": [
      "2024 multisociety perioperative cardiovascular guideline — official AHA slides"
    ]
  },
  {
    "slug": "changed-cardiac-status-new-dyspnea-lv-assessment",
    "name": "Maria Collins",
    "age": 65,
    "sex": "Female",
    "complaint": "New breathing difficulty",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "urgent_stable",
    "presentation": "{patientName}, a 65-year-old woman, attends clinic before nonurgent abdominal surgery. During the last month she has reduced her usual walking because of breathlessness and developed ankle swelling. Examination finds basal crackles. She has no rest chest pain. The preoperative team is choosing the next cardiac investigation.",
    "nodes": [
      {
        "slug": "new-dyspnea-lv-assessment",
        "conceptId": "concept.perioperative-risk-recovery.changed-status-lv-assessment.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "workup",
        "objective": "Distinguish current signs of possible ventricular dysfunction from an unchanged stable patient with an old normal test.",
        "task": "Which cardiac investigation should Maria’s team prioritize for the new findings?",
        "update": "",
        "choices": [
          {
            "id": "echo",
            "label": "Transthoracic echocardiography",
            "rationale": "New dyspnea and congestion findings support assessment of ventricular function.",
            "temptation": "Use changed symptoms to investigate structure and function.",
            "correctUnder": "The represented new findings apply.",
            "claims": [
              "cardiac-dyspnea"
            ],
            "timingProfileId": "timing.test.echocardiography"
          },
          {
            "id": "stress",
            "label": "Pharmacologic stress imaging",
            "rationale": "An ischemia investigation can become relevant, but the draft does not establish a genuinely competing priority that makes this a difficult separate inference.",
            "temptation": "Treat dyspnea as an ischemic equivalent before clarifying ventricular function.",
            "correctUnder": "A different resolved structural assessment with a remaining ischemia question could support stress testing.",
            "claims": [
              "cardiac-test-select",
              "cardiac-dyspnea"
            ],
            "timingProfileId": "timing.test.nuclear_imaging"
          },
          {
            "id": "monitor",
            "label": "Ambulatory ECG monitoring",
            "rationale": "No sufficiently specific rhythm observations have been supplied to make this a strong alternative.",
            "temptation": "Investigate intermittent rhythm disturbance as an explanation for limited activity.",
            "correctUnder": "Documented intermittent palpitations or unexplained episodic syncope could support rhythm evaluation.",
            "claims": [
              "cardiac-dyspnea"
            ],
            "timingProfileId": "timing.test.physiology"
          }
        ],
        "key": "echo",
        "explanation": "The new findings justify ventricular-function assessment. This repaired wording remains a straightforward syndrome-to-test task rather than a supported difficult diagnostic-priority comparison.",
        "claims": [
          "cardiac-dyspnea",
          "hf-elective",
          "cardiac-test-select"
        ],
        "gate": {
          "interpret": "Read the new breathlessness and congestion findings rather than a named old study.",
          "apply": "Select ventricular assessment for a new preoperative change.",
          "closestChoice": "stress",
          "decidingObservation": "The represented new findings support ventricular assessment, but there is no credible competing acquired result or pathway boundary.",
          "counterfactual": "If ventricular assessment had already resolved the structural question and an independently indicated ischemia question remained, stress imaging could be appropriate.",
          "counterfactualChoice": "stress",
          "deletionTest": "Removed the named prior echo and redundant textbook congestion cluster. The remaining task still largely associates a syndrome with its familiar test.",
          "cueAttack": "Old-test priming is removed and labels are specific; the rhythm foil remains weak. Adding unrelated warning signs just to strengthen it would manufacture ambiguity.",
          "stageAudit": "Three cardiac investigations at the same evaluation stage.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Attempt did not establish a fair moderate/hard competing-priority decision; the supported task remains easy recognition.",
          "sequenceAudit": "Standalone attempted repair. The RAAS companion is separately parked; no mixed case remains.",
          "limitation": "PARK: retain the valid guideline fact in the ledger, but do not present author labels as an independently accepted basic exception."
        },
        "parkingReason": "The fair supported rule remains straightforward ventricular-assessment recognition. The one repair did not produce credible independent diagnostic-priority reasoning; no accepted basic role exists."
      }
    ]
  },
  {
    "slug": "changed-cardiac-status-raas-hf-indication",
    "name": "Maria Collins",
    "age": 65,
    "sex": "Female",
    "complaint": "New breathing difficulty",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "urgent_stable",
    "presentation": "{patientName}, a 65-year-old woman, attends clinic before rescheduled elective abdominal surgery after treatment for systolic heart failure. She now lies flat, walks her usual route and has no edema or crackles. Blood pressure, renal function and potassium are stable on lisinopril. The team is comparing the following precise perioperative instructions.",
    "nodes": [
      {
        "slug": "raas-hf-indication",
        "conceptId": "concept.perioperative-risk-recovery.raas-heart-failure-indication.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Apply current compensated HFrEF and the treatment indication to perioperative RAAS reconciliation.",
        "task": "Which lisinopril instruction should Maria’s team select for the perioperative interval?",
        "update": "",
        "choices": [
          {
            "id": "continue",
            "label": "Continue the established lisinopril schedule",
            "rationale": "Continuation is reasonable for compensated HFrEF, but that permissive recommendation does not itself exclude a brief omission under a suitable anesthetic plan.",
            "temptation": "Distinguish HFrEF therapy from hypertension-only instructions.",
            "correctUnder": "A coordinated continuation plan can be appropriate in this represented clinical state.",
            "claims": [
              "raas-indication"
            ]
          },
          {
            "id": "omit24",
            "label": "Omit lisinopril for the 24 hours before surgery",
            "rationale": "A short omission is different from prolonged withdrawal. The evidence and provided record do not make it unequivocally inferior in every stable HFrEF patient.",
            "temptation": "Apply an omission policy based on perioperative blood-pressure concerns.",
            "correctUnder": "A selected controlled-hypertension/elevated-risk-surgery context supports this guideline option; HFrEF timing still requires clinical adjudication.",
            "claims": [
              "raas-indication"
            ]
          },
          {
            "id": "omitmorning",
            "label": "Omit the operative-morning lisinopril dose",
            "rationale": "This is another short omission plan whose ranking depends on dose timing, hemodynamic history and the actual anesthetic plan.",
            "temptation": "Use a familiar morning-medication instruction without reconciling indication and hemodynamic context.",
            "correctUnder": "An exact individualized perioperative plan could select a morning omission; the current sources do not uniquely rank it here.",
            "claims": [
              "raas-indication"
            ]
          }
        ],
        "key": "continue",
        "explanation": "The guideline permits continuation for stable HFrEF. It does not support turning that permissive option into an exclusive requirement over every short omission plan in this vignette.",
        "claims": [
          "raas-indication"
        ],
        "gate": {
          "interpret": "Recognize compensation and the HFrEF indication from the recovery record.",
          "apply": "Compare explicitly timed administration plans without importing a hypertension-only instruction as a universal rule.",
          "closestChoice": "omit24",
          "decidingObservation": "The exact interval is now specified, but the source still does not uniquely rank continuation against brief omission in this represented HFrEF context.",
          "counterfactual": "An explicit current hypotension-related contraindication could change the plan toward omission, but an exact reviewed context and administration interval would be required.",
          "counterfactualChoice": "omit24",
          "deletionTest": "Removed “generic” and made team coordination shared. Defining the interval reveals rather than solves the clinical permissiveness boundary.",
          "cueAttack": "Removed key-only coordination and unjustified dose escalation. Three real medication schedules remain potentially overlapping acceptable approaches.",
          "stageAudit": "One precisely timed medication administration plan around surgery.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "No fair unique key exists from the supplied permissive recommendation, regardless of a difficulty label.",
          "sequenceAudit": "Standalone attempted repair, excluded from scored exports.",
          "limitation": "PARK: Melissa must adjudicate an exact clinical context if this exclusive ranking is to be taught. No automatic HFrEF continuation or mandatory omission rule is authored."
        },
        "parkingReason": "Continuation and short omission can remain acceptable depending on the precise hemodynamic/anesthetic context. A permissive HFrEF recommendation cannot support the exclusive key; Melissa must adjudicate a new exact case."
      }
    ]
  },
  {
    "slug": "valve-risk",
    "name": "Walter Evans",
    "age": 73,
    "sex": "Male",
    "complaint": "Surgery planning",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 73-year-old man, attends clinic before nonurgent major abdominal surgery. He recently nearly fainted while climbing stairs. Echocardiography shows an aortic valve area of 0.8 cm2, mean gradient 46 mmHg and peak velocity 4.3 m/s, with preserved left-ventricular ejection fraction. The abdominal condition has no current obstruction, infection or bleeding.",
    "nodes": [
      {
        "slug": "symptomatic-aortic-valve",
        "conceptId": "concept.perioperative-risk-recovery.aortic-valve-before-elective-surgery.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Interpret severe aortic valve measurements with exertional symptoms before accepting a nonurgent major-surgery plan.",
        "task": "Which preparation plan best fits Walter before the abdominal operation?",
        "update": "",
        "choices": [
          {
            "id": "valve",
            "label": "Defer the elective operation for valve-team assessment",
            "rationale": "Severe valve measurements plus exertional presyncope warrant evaluation for valve intervention before nonurgent surgery.",
            "temptation": "Integrate symptoms and valve physiology rather than rely on preserved EF.",
            "correctUnder": "The severe symptomatic findings apply.",
            "claims": [
              "aortic-valve-elective"
            ]
          },
          {
            "id": "proceed",
            "label": "Proceed with the operation and perioperative surveillance",
            "rationale": "Preserved EF does not cancel the severe symptomatic valve problem before a nonurgent major operation.",
            "temptation": "Generalize an asymptomatic low-risk-surgery pathway.",
            "correctUnder": "An asymptomatic patient with preserved function undergoing a low-risk procedure can represent a different supported pathway.",
            "claims": [
              "aortic-valve-elective"
            ]
          },
          {
            "id": "stress",
            "label": "Defer the operation for dobutamine stress testing",
            "rationale": "This clear high-gradient symptomatic pattern does not require a stress study to establish the represented severe valve problem.",
            "temptation": "Use another test instead of acting on adequate measured valve evidence.",
            "correctUnder": "Discordant low-flow/low-gradient findings may create a separate specialist diagnostic question; no stress protocol is prescribed here.",
            "claims": [
              "aortic-valve-elective"
            ],
            "timingProfileId": "timing.test.echocardiography"
          }
        ],
        "key": "valve",
        "explanation": "The measurements and exertional presyncope support a symptomatic severe aortic stenosis concern despite preserved systolic function. Arrange valve-team assessment before the nonurgent major operation rather than treat surveillance as a substitute.",
        "claims": [
          "aortic-valve-elective",
          "aortic-valve-severity"
        ],
        "gate": {
          "interpret": "Use the actual area/gradient/velocity pattern and exertional symptom, rather than a supplied severe-AS label.",
          "apply": "Change preparation to valve evaluation before a nonurgent major operation.",
          "closestChoice": "proceed",
          "decidingObservation": "Exertional presyncope accompanies severe high-gradient measurements.",
          "counterfactual": "With no symptoms, preserved function and a low-risk planned procedure, proceeding with an appropriate perioperative plan could become reasonable.",
          "counterfactualChoice": "proceed",
          "deletionTest": "Preserved EF sustains the competing reassurance error; urgency determines whether deferral is feasible. Every echo value is concordant, not an extra unrelated workup.",
          "cueAttack": "Three actual preparation plans. The task does not announce a safety hazard. Numeric findings are constructed patient values interpreted using directly sourced thresholds.",
          "stageAudit": "Preoperative preparation, not valve procedure selection.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Preserved EF can be mistaken for absence of perioperative valve risk.",
          "sequenceAudit": "Standalone; no preceding valve interpretation supplies the diagnosis.",
          "limitation": "One current primary guideline; no TAVR-versus-SAVR rank, exact delay or invented valve cutoff. The stress-test counterfactual remains specialist scope."
        }
      }
    ],
    "preservedSourceLabels": [
      "2024 multisociety perioperative cardiovascular guideline — official AHA slides"
    ]
  },
  {
    "slug": "recent-coronary-stent",
    "name": "Olivia James",
    "age": 62,
    "sex": "Female",
    "complaint": "Operation scheduling",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 62-year-old woman, attends clinic four months after drug-eluting coronary stent placement to plan repair of a reducible incisional hernia. The catheterization referral header says “coronary disease.” The original admission record describes new chest pressure at rest, new ST depression and troponin rising from 18 to 860 ng/L (the assay’s female upper reference limit was 14). Angiography identified a thrombus-containing culprit coronary lesion that was stented. She is now taking aspirin and clopidogrel. The elective repair requires clopidogrel interruption.",
    "nodes": [
      {
        "slug": "des-acs-elective-timing",
        "conceptId": "concept.perioperative-risk-recovery.des-acs-elective-interruption.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Integrate ACS stent indication, early interval and operation urgency before accepting antiplatelet interruption.",
        "task": "Which scheduling target best fits Olivia’s elective repair, using the original PCI indication?",
        "update": "",
        "choices": [
          {
            "id": "defer",
            "label": "Aim for at least twelve months after PCI",
            "rationale": "The original ischemic presentation and dynamic injury with a culprit coronary lesion establish an ACS-related PCI context rather than a chronic-coronary-disease elective PCI. The represented elective interruption pathway ideally waits at least twelve months.",
            "temptation": "Recover the actual PCI indication before applying a generic post-stent calendar.",
            "correctUnder": "The represented ACS-related DES and elective antiplatelet interruption apply.",
            "claims": [
              "des-acs-timing",
              "coronary-acute-context"
            ]
          },
          {
            "id": "six",
            "label": "Aim for at least six months after PCI",
            "rationale": "This uses the chronic-coronary-disease DES pathway instead of the original acute presentation.",
            "temptation": "Apply a familiar six-month DES interval without checking why PCI occurred.",
            "correctUnder": "If the original procedure were elective PCI for chronic coronary disease rather than ACS, the six-month elective interruption target would fit the cited guideline.",
            "claims": [
              "des-ccd-timing",
              "coronary-acute-context"
            ]
          },
          {
            "id": "now",
            "label": "Use the current four-month interval",
            "rationale": "A shorter interval can be considered for selected time-sensitive surgery, but the represented repair is elective and its indication does not erase the ACS-related pathway.",
            "temptation": "Transfer a time-sensitive-surgery exception to this elective scheduling question.",
            "correctUnder": "A time-sensitive condition whose harm from delay outweighed cardiovascular risk could lead the multidisciplinary team to consider surgery after three months; that is not automatic permission.",
            "claims": [
              "des-time-sensitive",
              "des-acs-timing"
            ]
          }
        ],
        "key": "defer",
        "explanation": "First reconstruct why the stent was placed from the original admission rather than the broad header. Then apply the elective operation’s need for antiplatelet interruption to that ACS-related DES pathway. The guideline ideally delays this elective interruption to at least twelve months; the six-month chronic-disease pathway and selected time-sensitive exception address different circumstances.",
        "claims": [
          "des-acs-timing",
          "des-ccd-timing",
          "des-time-sensitive",
          "coronary-acute-context"
        ],
        "gate": {
          "interpret": "Integrate new rest symptoms, dynamic troponin/ECG findings and the culprit thrombus record to identify an acute-coronary presentation rather than merely “a stent.”",
          "apply": "Choose the ACS-related elective antiplatelet-interruption timeline rather than the chronic-disease or time-sensitive pathway.",
          "closestChoice": "six",
          "decidingObservation": "The original PCI followed an acute ischemic presentation with a thrombus-containing culprit lesion, not a stable elective coronary-disease procedure.",
          "counterfactual": "If the original PCI were instead elective treatment for chronic coronary disease, with no acute ischemic presentation, the offered six-month target would be the guideline-supported elective interruption pathway.",
          "counterfactualChoice": "six",
          "deletionTest": "Removing the original indication leaves insufficient information to distinguish six from twelve months. The four-month current interval avoids an extremely early stent case in which nearly every pathway leads to the same obvious delay. Elective status and required clopidogrel interruption are necessary eligibility facts.",
          "cueAttack": "Removed redundant scheduling-permission language and therapeutic-heparin substitution. All choices are actual scheduling targets. No ACS diagnosis label or recommendation interval appears in the presentation.",
          "stageAudit": "One elective scheduling target under a represented antiplatelet-interruption requirement; all options share multidisciplinary antiplatelet planning after the scheduling decision.",
          "predictedDifficulty": "hard",
          "difficultyReason": "The six-month alternative is a credible competing guideline pathway unless the resident reconstructs the actual PCI indication. The shorter current interval reflects a real exception with different urgency criteria.",
          "sequenceAudit": "Standalone with no preceding PCI-interval teaching.",
          "limitation": "AHA-hosted 2024 guidance directly supports each timeline. Twelve months is an ideal elective pathway, not a universal prohibition under urgent or time-sensitive circumstances. No MI numeric-subtype teaching is introduced."
        }
      }
    ]
  },
  {
    "slug": "postoperative-troponin",
    "name": "George Miller",
    "age": 70,
    "sex": "Male",
    "complaint": "Discharge record review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 70-year-old man, attends clinic three weeks after an outside colectomy. He has chronic kidney disease with routine renal follow-up. Postoperative blood loss caused hypotension. Hospital records show no fever, oxygenation change, pulmonary embolus on CT or new ventricular dysfunction. He recalls no chest pain. He now walks his usual route without chest discomfort or breathlessness and has no new ECG change.",
    "nodes": [
      {
        "slug": "mins-followup-plan",
        "conceptId": "concept.perioperative-risk-recovery.ischemic-postoperative-injury-followup.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Apply a documented ischemic perioperative injury to follow-up without mistaking absent pain for no consequence or inferring plaque rupture.",
        "task": "Which referral should be added to George’s routine surgical follow-up for the recorded troponin course?",
        "update": "",
        "choices": [
          {
            "id": "followup",
            "label": "Outpatient cardiology review",
            "rationale": "The postoperative dynamic rise is distinct from his stable preoperative elevation and unchanged renal function. The ischemic supply-demand context warrants cardiovascular follow-up; current recovery supports an outpatient phase.",
            "temptation": "Use baseline and serial data to distinguish a new perioperative event from the chronic background elevation.",
            "correctUnder": "The represented resolved perioperative injury pattern and present stable phase apply.",
            "claims": [
              "postoperative-acute-troponin",
              "mins-followup"
            ]
          },
          {
            "id": "renal",
            "label": "An earlier routine nephrology review",
            "rationale": "CKD is relevant to the background troponin elevation, but stable renal function does not account for the new postoperative trajectory or replace cardiovascular assessment.",
            "temptation": "Attribute the entire biomarker record to the known chronic condition.",
            "correctUnder": "A different record dominated by worsening kidney disease without a superimposed dynamic cardiac-injury pattern would shift the referral question toward renal review.",
            "claims": [
              "postoperative-acute-troponin"
            ]
          },
          {
            "id": "urgent",
            "label": "Urgent hospital cardiac reassessment",
            "rationale": "Urgent reassessment would be appropriate for current acute ischemic findings, but the represented record is a resolved event and he has returned to usual activity without new symptoms or ECG change.",
            "temptation": "Treat any historical troponin event as proof of a current emergency.",
            "correctUnder": "New rest chest pain, acute breathlessness or new ischemic ECG findings at today’s visit would change the phase to urgent hospital reassessment.",
            "claims": [
              "mins-followup",
              "postoperative-acute-troponin"
            ]
          }
        ],
        "key": "followup",
        "explanation": "First compare the postoperative rise/fall with the stable preoperative values and renal course: CKD does not make this new trajectory merely the old background result. Then use the current clinical phase. A resolved perioperative injury in the represented supply-demand context merits cardiovascular review; it neither establishes plaque rupture nor requires emergency transfer from an otherwise stable follow-up visit.",
        "claims": [
          "mins-followup",
          "postoperative-acute-troponin"
        ],
        "gate": {
          "interpret": "Distinguish an acute postoperative biomarker change from stable chronic elevation by using both the preoperative values and unchanged renal course, while considering the blood-loss/hypotension setting and recorded alternatives.",
          "apply": "Select outpatient cardiovascular review appropriate to a resolved event instead of diverting it to renal follow-up or treating it as a current acute presentation.",
          "closestChoice": "renal",
          "decidingObservation": "Troponin rises far above the stable preoperative pattern and then falls while renal function remains in its prior range; current function and ECG are unchanged.",
          "counterfactual": "If new rest chest pressure or a new ischemic ECG change appeared at today’s clinic visit, urgent hospital cardiac reassessment would become the appropriate offered referral.",
          "counterfactualChoice": "urgent",
          "deletionTest": "Without baseline/serial biomarkers and renal course, chronic versus acute contribution cannot be separated. Without current recovery findings, outpatient versus urgent assessment cannot be fairly ranked. The record supplies observations for relevant alternative causes rather than an attributed diagnosis.",
          "cueAttack": "Removed the supplied ischemic-injury attribution, dismissive copied summary and immediate angiography foil. Three short parallel referral destinations avoid a uniquely comprehensive “review and optimize” key. Clinical interpretation is still required; no medication regimen is promised.",
          "stageAudit": "One referral/triage decision at current postoperative follow-up, based on a historical event and present status.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "Stable CKD makes the background elevation a credible alternative explanation, while the serial change and current phase must each alter the referral choice. This is a fair moderate ceiling rather than an unverified difficult-MI diagnosis task.",
          "sequenceAudit": "Standalone; no preceding interpretation or future angiographic result supplies the answer.",
          "limitation": "The 2024 AHA perioperative guidance supports acute rise/fall evaluation and MINS follow-up. No specific MI subtype, assay-independent delta threshold, routine invasive test or antithrombotic regimen is asserted. The 2026 definition update is recorded as a current nomenclature boundary for clinician review."
        },
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed teaching record; fictional patient observations",
          "items": [
            {
              "label": "Two preoperative visits",
              "value": "Troponin 34 and 35 ng/L; eGFR 38 mL/min/1.73 m2"
            },
            {
              "label": "Postoperative serial results",
              "value": "Troponin 290 then 176 ng/L; eGFR 37–39 mL/min/1.73 m2"
            },
            {
              "label": "Assay reference",
              "value": "Male upper reference limit 20 ng/L"
            }
          ]
        }
      }
    ]
  },
  {
    "slug": "glp1-current-symptoms",
    "name": "Isabel Moore",
    "age": 51,
    "sex": "Female",
    "complaint": "Surgery medication question",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 51-year-old woman, attends clinic before elective surgery under general anesthesia. Semaglutide was recently increased. She vomited her last two meals. Her preparation sheet specifies a medication hold, which she has completed. The anesthesia team is reviewing preparation before proceeding.",
    "nodes": [
      {
        "slug": "glp1-significant-symptoms",
        "conceptId": "concept.perioperative-risk-recovery.glp1-severe-symptom-boundary.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Apply actual severe GI symptoms during GLP-1 escalation rather than infer readiness from a fixed interruption calendar.",
        "task": "Which preparation plan should Isabel’s team select for this elective procedure?",
        "update": "",
        "choices": [
          {
            "id": "defer",
            "label": "Postpone for prescriber and anesthesia reassessment",
            "rationale": "Persistent significant symptoms support reassessment rather than treating a completed calendar as readiness.",
            "temptation": "Use current clinical response rather than the calendar in isolation.",
            "correctUnder": "The represented significant symptoms apply.",
            "claims": [
              "glp1-symptoms"
            ]
          },
          {
            "id": "airway",
            "label": "Proceed with rapid-sequence induction and tracheal intubation",
            "rationale": "This is a real aspiration-risk mitigation strategy, but the exact indication, risk discussion and local pathway needed to rank it against postponement are not provided.",
            "temptation": "Treat an airway technique as a complete solution to an unresolved preparation question.",
            "correctUnder": "A team-reviewed situation requiring proceeding despite elevated aspiration risk could support a modified airway plan.",
            "claims": [
              "glp1-symptoms"
            ]
          },
          {
            "id": "diet",
            "label": "Proceed after a revised liquid-diet preparation plan",
            "rationale": "Diet modifications appear in guidance for selected patients, but ongoing significant symptoms and differing policies prevent this draft from asserting that a diet change establishes readiness.",
            "temptation": "Apply a selected mitigation plan as a universal substitute for clinical reassessment.",
            "correctUnder": "A different asymptomatic or appropriately reassessed context under a current team-approved policy could support a diet modification.",
            "claims": [
              "glp1-symptoms"
            ]
          }
        ],
        "key": "defer",
        "explanation": "The severe-symptom boundary merits reassessment. A harder comparison between postponement, airway mitigation and diet modification requires exact clinical goals, urgency and an approved local pathway, rather than an invented universal GLP-1 rule.",
        "claims": [
          "glp1-symptoms"
        ],
        "gate": {
          "interpret": "Recognize continuing significant intake symptoms after medication escalation despite completion of a calendar hold.",
          "apply": "Use current symptoms and an actual preparation pathway rather than elapsed time alone.",
          "closestChoice": "airway",
          "decidingObservation": "The current symptoms are necessary safety data, but the draft lacks a supported exclusive boundary among real mitigation plans.",
          "counterfactual": "A time-sensitive operation with a completed multidisciplinary risk discussion could support proceeding with an aspiration-risk airway plan; the exact indication must be separately authored and reviewed.",
          "counterfactualChoice": "airway",
          "deletionTest": "Removed duplicate nonurgency and the editorial “old” label. Removing vomiting would enter disputed asymptomatic policies rather than make the current item difficult.",
          "cueAttack": "Replaced antiemetic-only management with real airway and diet strategies. Their actual appropriateness cannot be established by short labels, so the comparison remains unfit for a forced key.",
          "stageAudit": "All options address elective anesthesia preparation, with no invented exact hold or fasting duration.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The supported symptom-recognition lesson is easy; the attempted harder comparison exposes policy/context uncertainty rather than fair difficulty.",
          "sequenceAudit": "Standalone attempted repair, excluded from scored supply.",
          "limitation": "PARK: preserve differing GLP-1 policy boundaries. No universal washout, fasting rule, gastric threshold or mandatory airway technique is asserted."
        },
        "parkingReason": "Significant symptoms must remain visible. The supported lesson stays foundational, while real airway/diet alternatives require exact policy and clinical context. Do not force an exclusive preparation rule across differing guidance."
      }
    ]
  },
  {
    "slug": "dangerous-delirium",
    "name": "Daniel Price",
    "age": 74,
    "sex": "Male",
    "complaint": "Agitation record review",
    "encounterMode": "outside_record_review_in_clinic",
    "historicalAcuity": "urgent_stable",
    "presentation": "{patientName}, a 74-year-old man, attends clinic after recovery from an outside hospital operation. The founder reviews an episode of fluctuating inattention and visual misperceptions with repeated attempts to climb over bed rails and remove a fresh drain. Reorientation, family presence and de-escalation had failed. Pain, oxygenation, glucose and bladder distension had been addressed. He had no regular alcohol or benzodiazepine exposure, Parkinson disease, Lewy body dementia or recorded QT prolongation.",
    "nodes": [
      {
        "slug": "delirium-danger-drug",
        "conceptId": "concept.perioperative-risk-recovery.delirium-danger-treatment.v1",
        "creationKind": "new",
        "replacesInventoryIds": [],
        "conceptType": "management",
        "objective": "Distinguish dangerous nonwithdrawal agitation after nonpharmacologic measures from routine delirium or withdrawal treatment.",
        "task": "Which symptom-directed medicine best fits Daniel at that recorded decision point?",
        "update": "",
        "choices": [
          {
            "id": "haloperidol",
            "label": "Cautiously titrated haloperidol",
            "rationale": "A short symptom-directed antipsychotic can be considered for dangerous agitation after nonpharmacologic measures fail, with contraindications assessed.",
            "temptation": "Use the severe-symptom boundary without calling the drug a delirium cure.",
            "correctUnder": "The current danger and prior measures apply.",
            "claims": [
              "delirium-antipsychotic"
            ]
          },
          {
            "id": "lorazepam",
            "label": "Cautiously titrated lorazepam",
            "rationale": "No withdrawal indication is represented; benzodiazepines are not the routine first-line response to this delirium pattern.",
            "temptation": "Generalize the withdrawal exception to all postoperative agitation.",
            "correctUnder": "A documented benzodiazepine or alcohol interruption with a compatible withdrawal course would change the indication.",
            "claims": [
              "delirium-benzo"
            ]
          },
          {
            "id": "diphenhydramine",
            "label": "Cautiously titrated diphenhydramine",
            "rationale": "An anticholinergic sedating drug can worsen cognitive risk and does not address this delirium indication.",
            "temptation": "Substitute a familiar sleep/sedation medicine for a symptom-specific plan.",
            "correctUnder": "A separate histamine-mediated allergic indication would be a different therapeutic task, not treatment of delirium.",
            "claims": [
              "delirium-anticholinergic"
            ]
          }
        ],
        "key": "haloperidol",
        "explanation": "First distinguish immediate danger after failed de-escalation from routine quiet delirium, then check the withdrawal history and contraindications. Antipsychotic use here is short and symptom-directed, with low-certainty evidence; cause-directed care continues.",
        "claims": [
          "delirium-antipsychotic",
          "delirium-benzo",
          "delirium-anticholinergic",
          "delirium-causes"
        ],
        "gate": {
          "interpret": "Danger persists despite actual nonpharmacologic and cause-directed measures; no withdrawal exposure is present.",
          "apply": "Consider a cautious short antipsychotic strategy rather than a withdrawal drug or anticholinergic sedative.",
          "closestChoice": "lorazepam",
          "decidingObservation": "Absent regular alcohol/benzodiazepine exposure distinguishes the withdrawal exception.",
          "counterfactual": "A verified abrupt interruption of chronic benzodiazepine use with compatible withdrawal findings would favor benzodiazepine treatment of that driver.",
          "counterfactualChoice": "lorazepam",
          "deletionTest": "Danger and failed measures establish the medication stage; exposure history separates lorazepam. Contraindication negatives are necessary, not decorative exclusions.",
          "cueAttack": "All labels use the same cautious-titration grammar. No generic safe-plan option. No new dose or observation period.",
          "stageAudit": "One symptom-directed medicine at the same recorded stage.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "The credible error extends a real withdrawal exception to a nonwithdrawal episode.",
          "sequenceAudit": "Standalone. Does not modify or append to the frozen B2B21 withdrawal version.",
          "limitation": "Diphenhydramine is a weaker competitor; three choices retained without padding. Evidence low; exact rank needs clinician/independent review."
        }
      }
    ]
  },
  {
    "slug": "mri-system-change",
    "name": "Peter Hayes",
    "age": 69,
    "sex": "Male",
    "complaint": "MRI preparation",
    "encounterMode": "outpatient_clinic",
    "historicalAcuity": "stable",
    "presentation": "{patientName}, a 69-year-old man, attends clinic before an outside MRI. His device card describes an MR Conditional generator. Since his prior uneventful scan, a lead revision left an additional implanted lead. The current referral contains the generator card and old MRI clearance; it does not identify conditions for the entire current implanted system.",
    "nodes": [
      {
        "slug": "mri-current-system",
        "conceptId": "concept.mri.device-specific-safety-verification",
        "creationKind": "Rewrite",
        "replacesInventoryIds": [
          "inventory.1cb545e71fc488ba"
        ],
        "conceptType": "workup",
        "objective": "Recognize that a changed implanted system invalidates using generator-only or prior-scan clearance as the current system assessment.",
        "task": "Which device record should Peter's MRI team verify for the proposed examination?",
        "update": "",
        "choices": [
          {
            "id": "current",
            "label": "The complete current implanted system and current scan conditions",
            "rationale": "The generator card does not describe the additional lead; assessment must use the actual present devices and proposed examination.",
            "temptation": "Match identity and conditions to the same current system.",
            "correctUnder": "The post-scan system change applies.",
            "claims": [
              "mri-system"
            ]
          },
          {
            "id": "generator",
            "label": "The current generator model and current scan conditions",
            "rationale": "This verifies the right generator but leaves another implanted component outside the safety assessment.",
            "temptation": "Treat the conditional generator label as a whole-system label.",
            "correctUnder": "A verified single-device system without additional components would be a different identity problem.",
            "claims": [
              "mri-system"
            ]
          },
          {
            "id": "prior",
            "label": "The prior implanted system and prior scan conditions",
            "rationale": "That record belongs to an earlier system and examination; past tolerance does not establish current conditions.",
            "temptation": "Let a successful prior scan serve as reusable clearance.",
            "correctUnder": "An unchanged fully identified system under the same verified conditions could make that record useful to the current team, with current confirmation.",
            "claims": [
              "mri-system"
            ]
          }
        ],
        "key": "current",
        "explanation": "First reconcile what is implanted now, then match the current system to the proposed examination. This does not declare the added lead safe or unsafe for all MRI; qualified MR/device review determines an appropriate pathway.",
        "claims": [
          "mri-system"
        ],
        "gate": {
          "interpret": "An intervening lead revision changes the identity covered by the old clearance.",
          "apply": "Request current whole-system verification rather than extrapolate from one component or past tolerance.",
          "closestChoice": "generator",
          "decidingObservation": "An additional lead remains after the prior scan.",
          "counterfactual": "If records established that the generator was the only implanted device, generator-specific current-condition verification would cover the relevant system.",
          "counterfactualChoice": "generator",
          "deletionTest": "The intervening component change is the consequential observation; deleting it reduces the case to generic repeat clearance.",
          "cueAttack": "Balanced record-comparison options; the key is not a generic cautious plan. No invented MR field-strength or device protocol.",
          "stageAudit": "Which identification/conditions record to verify, not choosing an MRI protocol or treatment.",
          "predictedDifficulty": "moderate",
          "difficultyReason": "A valid-looking MR Conditional generator card is a credible partial-evidence trap.",
          "sequenceAudit": "Standalone; no prior MRI physics task reveals the safety answer.",
          "limitation": "No device/lead-specific permission or prohibition, no claim that the clinic can clear scanning."
        }
      }
    ]
  }
];


for (const c of PERIOPERATIVE_TOPIC_DEFINITIONS) for (const n of c.nodes) n.claims = [...new Set([...n.claims, ...n.choices.flatMap(x => x.claims)])];

/** Failed repairs retain their attempted wording but never enter scored exports. */
export const PERIOPERATIVE_TOPIC_PARKED_ATTEMPTS = PERIOPERATIVE_TOPIC_DEFINITIONS.filter(c => c.nodes.every(n => !!n.parkingReason) || ['dangerous-delirium', 'mri-system-change'].includes(c.slug)).map(c => ({ ...c, nodes: c.nodes.map(n => ({ ...n, key: null, abandonedAuthorSuggestion: n.key, authorDisposition: n.parkingReason ?? (c.slug === 'dangerous-delirium' ? 'UNKEYED: unsupported credible drug ranking' : 'UNKEYED: failed deletion and counterfactual gates') })) }));
export const PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS = PERIOPERATIVE_TOPIC_DEFINITIONS.filter(c => !PERIOPERATIVE_TOPIC_PARKED_ATTEMPTS.some(p => p.slug === c.slug));
export const PERIOPERATIVE_TOPIC_REVIEW_DISPOSITIONS = [
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.beta-new-exposure.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.beta-new-exposure.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.beta-new-exposure.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.beta-new-exposure.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.beta-exposure.v2",
    "beforeQuestionSha256": "2bf34879fe696af8b436d066458be3b7cd8982d706b1897150eda92ce9754e34",
    "beforeNodeSha256": "db59eb7722958800d335b8eed5dcf7162f8f12e8d0b912ae043eae1c9f4c9adc",
    "beforeCaseHeaderSha256": "d94f28e484056dbc1b6638bf2d4a7d7a6332a927687caadebcb0298c79e6377a",
    "response": "Removed the initiation label; specified tomorrow’s decision, original hypertension indication and neutral dispensing/administration evidence. Re-solved against both literal continuation and unnecessary delay.",
    "remainingLimitation": "One current guideline supports the medication rule. Fictional tablet counts and vital signs are observations, not evidence-derived treatment cutoffs.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.warfarin-interruption.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.warfarin-interruption.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.warfarin-interruption.v1",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.warfarin-interruption.v1",
    "currentCaseId": "case.topic.perioperative-risk-recovery.warfarin-review.v1",
    "beforeQuestionSha256": "feedfd0d9740e847b8aa172b957f132ef053c430e1dadc618c592112b20c6bff",
    "beforeNodeSha256": "9b120bccf423a21b178c13afe9b64d6c15206a8b053499b0e4455b286b8f8ba5",
    "beforeCaseHeaderSha256": "03afc05bc2c57f11b2f9cedf503a23ba684b4b9fcba5e7f04b9e3ed45ec08f67",
    "response": "Preserved the exact reviewed question, options, explanation, evidence claims, patient header and finite profile. PASS suggestions are not authorization to edit this exact version.",
    "remainingLimitation": "No high-risk bridging exception is keyed or resolved; CHEST and AHA scope differences are preserved. No exact interruption timing.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": true,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.vte-active-bleeding.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.vte-active-bleeding.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.vte-active-bleeding.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.vte-active-bleeding.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.cancer-prophylaxis-vte-active-bleeding.v2",
    "beforeQuestionSha256": "d2ba31351953108996eb7bb5cf320f1daf5aff05b52baa360cb57bd21e5002e3",
    "beforeNodeSha256": "34e135ecaecf370f044539419d68f3b4b9cc32f6581eb085e3160633884d41ff",
    "beforeCaseHeaderSha256": "f54d1506eb31b594fa92fdb6f5be14f7ec37b14423ff3017ee82dc940794d4cf",
    "response": "Removed supplied bleeding interpretation and the filter foil; made the competing thrombosis history explicit and compared actual prophylactic modalities. Standalone context prevents feedback scaffolding.",
    "remainingLimitation": "ASH recommendations are conditional and evidence certainty is low/very low. This is the best offered immediate modality, not a quantitative bleeding threshold or universal timing rule.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.vte-after-hemostasis.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.vte-after-hemostasis.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.vte-after-hemostasis.v2",
    "currentCaseId": null,
    "beforeQuestionSha256": "94671c2d23de6aa66782f547b6fb2e21c7bb182e0cea7edaaa3fcbd0c7039b77",
    "beforeNodeSha256": "04d99ec4c64060a3fc996cb7ff6972eff33bf1c8c047943c139c4c3d5e31a89e",
    "beforeCaseHeaderSha256": "f54d1506eb31b594fa92fdb6f5be14f7ec37b14423ff3017ee82dc940794d4cf",
    "response": "Removed the hemostasis conclusion; supplied current renal/platelet eligibility, named VTE prevention and replaced therapeutic dosing with same-stage modality plans. Rechecked the conditional combination preference and recorded its exclusivity limit.",
    "remainingLimitation": "The one repair resolves clarity and medication-eligibility gaps, but the conditional combination preference does not make LMWH without compression unequivocally wrong. The three-row component matrix also converges on the combination key. Park rather than force a difficult exclusive ranking.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.extended-cancer-course.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.extended-cancer-course.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.extended-cancer-course.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.extended-cancer-course.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.cancer-prophylaxis-extended-cancer-course.v2",
    "beforeQuestionSha256": "8053d7bf08ad64c49faefd9f8e8892cad66d827229a619e9f4c04b19294b2948",
    "beforeNodeSha256": "33f65ef372c2edf68584ce8d0026936ffbe9224b5024c732603ac9f7cbcc5324",
    "beforeCaseHeaderSha256": "f54d1506eb31b594fa92fdb6f5be14f7ec37b14423ff3017ee82dc940794d4cf",
    "response": "Replaced numerical cue with postoperative day 8. Added a genuine current bleeding-versus-thrombosis interpretation and used three credible discharge plans with a decision-changing expanding-hematoma counterfactual.",
    "remainingLimitation": "Selected high-risk population and acceptable bleeding balance. No dose, exact stop date or universal four-week instruction for every operation.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.sglt2-drug-switch.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.sglt2-drug-switch.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.sglt2-drug-switch.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.sglt2-drug-switch.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.sglt2-switch.v2",
    "beforeQuestionSha256": "ea89d6b46ed45115df17716b13ba6a8d2189ebd6857f11208317ed642ac444c1",
    "beforeNodeSha256": "412940d1d9414698d1d62621f1b3cec5f8b8d3b83326890bfa1ade9b784ea2e1",
    "beforeCaseHeaderSha256": "7aed85301fe9ee0e0382c72f5da6425f56af1100e85345b4702efc5716eb04e3",
    "response": "Removed the unexplained second sheet and medication-to-number task. Replaced it with conflicting current exposure evidence and actual offered operative slots; counted each slot from the recorded last dose.",
    "remainingLimitation": "U.S. labels, when possible, govern this narrow minimum. Dates/times are constructed; no interval beyond the sourced label minimum or whole-patient clearance claim.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.sglt2-acid-ketone-pattern.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.sglt2-acid-ketone-pattern.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.sglt2-acid-ketone-pattern.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.sglt2-acid-ketone-pattern.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.sglt2-hospital-course-sglt2-acid-ketone-pattern.v2",
    "beforeQuestionSha256": "2b6fd91502219d7679b873e6a91752e7ac469a7a927c58d455f08fec47710549",
    "beforeNodeSha256": "506d90a35cdce228b7225172d81794b7441fbfa96261de2d8877612a916e5eb7",
    "beforeCaseHeaderSha256": "097a06b4344c5befb10bfa85d2e4ee83d78ae0e19cb693164f8d327735a4306b",
    "response": "Changed pure pattern recognition to a consequential infusion choice. Added treatment-stage potassium and resuscitation observations, removed eliminative lactate/HHS options, and explicitly versioned the changed clinical meaning.",
    "remainingLimitation": "One multisociety consensus publication directly supports this treatment distinction, with the FDA label corroborating recognition rather than the full infusion plan. No dose/rate or complete DKA protocol is taught.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.sglt2-recovery-restart.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.sglt2-recovery-restart.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.sglt2-recovery-restart.v2",
    "currentCaseId": null,
    "beforeQuestionSha256": "34347f8273170580012b1503e3bd6b40e8dcf11053cbd6c8d4705a038134cb18",
    "beforeNodeSha256": "5e3482500d6b87f38be79c5fe5723885ad493eac72beb11d0966ab6a47f0ccf0",
    "beforeCaseHeaderSha256": "097a06b4344c5befb10bfa85d2e4ee83d78ae0e19cb693164f8d327735a4306b",
    "response": "One repair: made all labels present-tense and parallel, removed key-only explanatory wording, and separated withholding today from future re-exposure. Parked after the gate because the third option remains a real discretionary decision and moderate difficulty is not supported.",
    "remainingLimitation": "Present withholding is supported but remains easy. Permanent cessation versus eventual re-exposure after ketoacidosis needs an individualized clinical decision; no fair, independent moderate/hard comparison was established.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.awake-gas.v2",
    "beforeQuestionSha256": "97d909b821504e78d73f818ea734e880b258d4b4914a870ec759e90712e57f65",
    "beforeNodeSha256": "d4b286c5aa12eec6fa73c55818be96fb367da69971252e84b11aba8e0f9c92ed",
    "beforeCaseHeaderSha256": "5074d57254797563a1b32f24f19ee61eac68268be0108ecb9be2f93760523fcb",
    "response": "Supplied concrete BMI, oxygen and chemistry observations with interval and stability. Narrowed the unresolved problem, replaced the duplicate overnight foil and distinguished a needed sleep study from the current chemistry/ventilation question.",
    "remainingLimitation": "ATS recommendation is conditional with very low certainty. All numbers are constructed observations, not invented diagnostic thresholds. Old F13 remains held; this exact new version requires review.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.suspected-osa-plan.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.suspected-osa-plan.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.suspected-osa-plan.v2",
    "currentCaseId": null,
    "beforeQuestionSha256": "dfbdb42a596b96737cbab76bdbcc0d2d66ee8d2ceae22a9fc35b10f61baa0642",
    "beforeNodeSha256": "a5253c181661808c37ea82acf8b79336cdf7dc2228055a81619607fedadbdf9b",
    "beforeCaseHeaderSha256": "e54b93cc36184650d740649d31b3539651c4cc2faa5ce2b0b9eb7c04018d5f9b",
    "response": "One repair: named the instrument/result, removed the absolute-delay foil and compared actual preparation plans. Parked because procedure/facility details are insufficient to rank proceeding versus completion of a suitable plan uniquely.",
    "remainingLimitation": "A named screen and balanced labels do not establish a unique anesthesia/recovery plan. Proceeding and postponement depend on procedure, monitoring and facility details not supplied by the permitted evidence; ordinary planning remains held for a concrete pathway.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.unmonitored-discharge-risk.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.unmonitored-discharge-risk.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.unmonitored-discharge-risk.v2",
    "currentCaseId": null,
    "beforeQuestionSha256": "40bd8975008aeffdd7468e69912432ce6db9e90cfe087a54af70366e3d8199d4",
    "beforeNodeSha256": "e36e4e1441358d060cf0be1d8ed9a69d4d2c64352a95620c180841339ef50bf9",
    "beforeCaseHeaderSha256": "16d24c29aacfd246c88f5e3de5bf456adce1299d13e89abe4a269fab289b1328",
    "response": "One repair: preserved all respiratory warning signs, removed direct PAP-option defeat and compared concrete dispositions. Parked because the supported lesson remains foundational and the harder monitored-level comparison lacks a defensible unique boundary.",
    "remainingLimitation": "Do not hide ongoing apnea/rescue needs. The supported no-unmonitored-discharge lesson remains easy; current monitored unit versus transfer cannot be uniquely ranked without real capability/support criteria.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.frailty-domains.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.frailty-domains.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.frailty-domains.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.frailty-domains.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.frailty-trajectory-frailty-domains.v2",
    "beforeQuestionSha256": "20ada5a58f842fea463a589c6d0c122a20c3cb8d8096433955b27a88d5090e7b",
    "beforeNodeSha256": "8f4f6c9f54578d3209815adc038b19874d0033b2fb4ac92da8b19a66a0d58f16",
    "beforeCaseHeaderSha256": "7e7a90f54c5b800d6acd33b5a20e58262dbeaf711df7837ef71b1ca03f35590c",
    "response": "Replaced generic multidomain classification with a concrete competing-baseline decision. Added a primary BGS baseline source and an explicit new concept meaning; preserved the passing recovery node separately.",
    "remainingLimitation": "BGS professional good-practice guidance supports the pre-illness anchor. No copied scoring scale, exact individual prognosis or automatic treatment exclusion is taught.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.recovery-support.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.recovery-support.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.recovery-support.v1",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.recovery-support.v1",
    "currentCaseId": "case.topic.perioperative-risk-recovery.frailty-trajectory.v1",
    "beforeQuestionSha256": "c301a32adda59a22413934cb69ba923534c22dbafe62a2133d0290efab33df8e",
    "beforeNodeSha256": "a9da2c3465a622304be0b035123ef5d19c3c9a15aa56ad3b337075adc49f4793",
    "beforeCaseHeaderSha256": "7e7a90f54c5b800d6acd33b5a20e58262dbeaf711df7837ef71b1ca03f35590c",
    "response": "Preserved the exact reviewed question, options, explanation, evidence claims, patient header and finite profile. PASS suggestions are not authorization to edit this exact version.",
    "remainingLimitation": "One pathway overview; exact placement, coverage and goals require clinician/social-care assessment. No facility capability added.",
    "composition": "Removed the earlier returned companion, keeping the exact PASS wording/header/profile in a self-contained singleton. No replacement feedback precedes it.",
    "independentPassPreserved": true,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.delirium-anticholinergic-order.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.delirium-anticholinergic-order.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.delirium-anticholinergic-order.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.delirium-anticholinergic-order.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.delirium-medication-course-delirium-anticholinergic-order.v2",
    "beforeQuestionSha256": "4044eb483e6e1af5d67af2b987921af9114752155f74abe99ecaaa4503f55034",
    "beforeNodeSha256": "12057dd1e4a03bcd8166fe825e1ddf1c7b57d7496bb2168134ccec31f62b5ec7",
    "beforeCaseHeaderSha256": "7a359eb76a64279c8d38565156df5d30352b55dfaf3e1872e718c250816fbe66",
    "response": "Moved to a coherent postoperative order review, named delirium prevention, balanced indication/exposure detail and replaced benign medicine foils with chronic benzodiazepine and active analgesia decisions.",
    "remainingLimitation": "AGS guideline directly supports anticholinergic review, withdrawal exceptions and pain management. No dose, taper, universal benzodiazepine continuation or causal proof of delirium is taught.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.delirium-quiet-cause.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.delirium-quiet-cause.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.delirium-quiet-cause.v1",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.delirium-quiet-cause.v1",
    "currentCaseId": "case.topic.perioperative-risk-recovery.delirium-medication-course.v1",
    "beforeQuestionSha256": "981d5ff9641dcd4bb3895cf9bbdbb58d932a865490bbc899b4f3d64f194ce3e5",
    "beforeNodeSha256": "8ca07756c1427b0fa742c935e917f803080dd7654ff6588549f1025579f04215",
    "beforeCaseHeaderSha256": "7a359eb76a64279c8d38565156df5d30352b55dfaf3e1872e718c250816fbe66",
    "response": "Preserved the exact reviewed question, options, explanation, evidence claims, patient header and finite profile. PASS suggestions are not authorization to edit this exact version.",
    "remainingLimitation": "NIDDK supports residual assessment, delirium guidelines support cause evaluation; the clinical ranking is bounded synthesis requiring review. No CT/EEG protocol taught.",
    "composition": "Removed the earlier returned companion, keeping the exact PASS wording/header/profile in a self-contained singleton. No replacement feedback precedes it.",
    "independentPassPreserved": true,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.art-unavoidable-interruption.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.art-unavoidable-interruption.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.art-unavoidable-interruption.v1",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.art-unavoidable-interruption.v1",
    "currentCaseId": "case.topic.perioperative-risk-recovery.art-enteral-interruption.v1",
    "beforeQuestionSha256": "099ec712eef5236596de7d22b2f7985e6e332a791af14c37caa9506813c37dd5",
    "beforeNodeSha256": "dfcf74759901b794ec1d85cc0518565f6b962d0051ac3b00264e1f6a5494855c",
    "beforeCaseHeaderSha256": "e8d188bcdaeb9777cbf90efc5b85aaff4ac052c39e97d0fb4227d017fb7c1f8d",
    "response": "Preserved the exact reviewed question, options, explanation, evidence claims, patient header and finite profile. PASS suggestions are not authorization to edit this exact version.",
    "remainingLimitation": "One accessible primary guideline; no drug-specific conversion, washout, component restart or dose taught.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": true,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.postoperative-targeted-ultrasound.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.postoperative-targeted-ultrasound.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.postoperative-targeted-ultrasound.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.postoperative-targeted-ultrasound.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.breast-site-recovery-postoperative-targeted-ultrasound.v2",
    "beforeQuestionSha256": "637e8276e7ef59d3a128e1a6322eebfba6c025f1bc322ca57db087c1ae982252",
    "beforeNodeSha256": "b4a3c7a417ac29aa1d43cfc795877e4456c568ec653701955dcf6fc3eacdf777",
    "beforeCaseHeaderSha256": "3cb85b0cab1e4b9afeed5d67147d93e3e5df12142399c1705de39b9753a0d5a2",
    "response": "Specified early postoperative chronology and actual wound/acquisition targets, distinguished unperformed target acquisition from missing exports, and replaced MRI filler with a credible premature aspiration. New concept meaning is explicit.",
    "remainingLimitation": "Existing locally verified seroma evidence supports ultrasound characterization. Wrong-target limits are a logical application to constructed acquisition records, not a new universal breast-mass algorithm. No claim that mammography is never indicated.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.postoperative-seroma-observe.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.postoperative-seroma-observe.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.postoperative-seroma-observe.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.postoperative-seroma-observe.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.breast-site-recovery-postoperative-seroma-observe.v2",
    "beforeQuestionSha256": "a21d0e8d10975eebd6ae0bf7b54ff3d260f2ce9781e24f83dfcfb4834015f860",
    "beforeNodeSha256": "6c36d0310f514cd4dd202ec8159e2225e996add195acabe2201864e85446f2c8",
    "beforeCaseHeaderSha256": "3cb85b0cab1e4b9afeed5d67147d93e3e5df12142399c1705de39b9753a0d5a2",
    "response": "Made the task concrete and replaced the list of nonintervention rationales with actual function versus recurrent imaging after a previously useful aspiration. Compared real drainage strategies; retained a fair moderate ceiling and explicit evidence/timing limits.",
    "remainingLimitation": "The observation rule reuses the exact locally verified seroma claim and original access date. Added CC BY observational evidence establishes real intervention options, not a mandatory drainage threshold. Catheter drainage temporarily borrows the existing image-guided-fluid-procedure wait profile; manager must review an exact catheter profile before admission.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.contrast-event-provenance.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.contrast-event-provenance.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.contrast-event-provenance.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.contrast-event-provenance.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.contrast-events.v2",
    "beforeQuestionSha256": "be6518debfea2ae2e808c1fb4dd7aa3fe169e1d505b773599650605f54d68202",
    "beforeNodeSha256": "e096e00d4c10a61ba112775546fc5b64f547daeda9b500f1e4f33aaf554d499b",
    "beforeCaseHeaderSha256": "0bcd25f297866016aaf229c2700919192f86165d074702c2bec59256eaf569a2",
    "response": "Changed foundational symptom recognition into agent-attribution reconciliation with a consequential record update. Removed the interpreted leakage mechanism, supplied raw administration provenance and explicitly versioned the new meaning.",
    "remainingLimitation": "ESUR supports agent-specific documentation. The current exercise records a hypersensitivity-type pattern only; it does not establish immunologic mechanism or prescribe a future imaging protocol.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.extravasation-progressive-injury.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.extravasation-progressive-injury.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.extravasation-progressive-injury.v1",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.extravasation-progressive-injury.v1",
    "currentCaseId": "case.topic.perioperative-risk-recovery.contrast-local-course.v1",
    "beforeQuestionSha256": "cc3ddc3ded5a634478da6c4e0c1817af9c3e9f21da8cfca873e4d6e9ab5917d0",
    "beforeNodeSha256": "3f06fc637f341c001eae3739ed8eb7a818205ddd089d55852e8bb8d2ebb065c8",
    "beforeCaseHeaderSha256": "0348d8ddfa1aca664602f7d3d98633775ae1866f0f7dbc8917de50f7545d82c5",
    "response": "Preserved the exact reviewed question, options, explanation, evidence claims, patient header and finite profile. PASS suggestions are not authorization to edit this exact version.",
    "remainingLimitation": "One direct guideline; new evidence supports this different severity-based escalation task, not automatic unpark/approval of the frozen N2 v3 assessment comparison.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": true,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.penicillin-delayed-boundary.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.penicillin-delayed-boundary.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.penicillin-delayed-boundary.v1",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.penicillin-delayed-boundary.v1",
    "currentCaseId": "case.topic.perioperative-risk-recovery.allergy-severe-history.v1",
    "beforeQuestionSha256": "c4bee28301920cddf3fc1f37f401e8668aad40c561ae4729c8d730e8c0249716",
    "beforeNodeSha256": "1e7a352821088b78207e26666e0cde439dd66106d9e2ce9105664316d7f5a6f2",
    "beforeCaseHeaderSha256": "274bbc97898d87517daba3d56e6f1f868e1b396686c35cd85da4014934a33b91",
    "response": "Preserved the exact reviewed question, options, explanation, evidence claims, patient header and finite profile. PASS suggestions are not authorization to edit this exact version.",
    "remainingLimitation": "The inherited allergy-protocol teaching hold remains. This is a sourced exclusion boundary, not approval of a challenge, delabeling or prophylactic antibiotic.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": true,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.low-risk-cardiac-testing.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.low-risk-cardiac-testing.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.low-risk-cardiac-testing.v1",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.low-risk-cardiac-testing.v1",
    "currentCaseId": "case.topic.perioperative-risk-recovery.low-risk-operation.v1",
    "beforeQuestionSha256": "ecdf35874635708141787f18bf6522048572c82ce43ea7e97c990296f794273a",
    "beforeNodeSha256": "e4c2e99e2362039cb611bef976a5becaa52821e60e9b2823fde3461eef154431",
    "beforeCaseHeaderSha256": "f1c9cc61281aa2fa51b258915d31084b564e7d9b5328a979baa84895e4cad8a4",
    "response": "Preserved the exact reviewed question, options, explanation, evidence claims, patient header and finite profile. PASS suggestions are not authorization to edit this exact version.",
    "remainingLimitation": "No numerical risk score or exam-weight assertion. One primary guideline; selective testing is conditional, not automatic.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": true,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.new-dyspnea-lv-assessment.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.new-dyspnea-lv-assessment.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.new-dyspnea-lv-assessment.v2",
    "currentCaseId": null,
    "beforeQuestionSha256": "206a1c39a3d9e45e38a0426c6b24093684ec3cc81fa2d5c47c88da6e36b3a9e3",
    "beforeNodeSha256": "aa17ddb5b25f7cc3e44da26a26827d171ae36598c5d897747815d91698d6f24e",
    "beforeCaseHeaderSha256": "232e7b42d8ffb649e62f0afd9e48f814cb80ad013cbacf5f140a0a81f1a0ae8e",
    "response": "One repair: removed old-echo priming and excess classic signs, retained active symptoms and used named investigations. Parked because a supported genuinely competing priority was not established without adding unrelated uncertainty.",
    "remainingLimitation": "The fair supported rule remains straightforward ventricular-assessment recognition. The one repair did not produce credible independent diagnostic-priority reasoning; no accepted basic role exists.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.raas-hf-indication.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.raas-hf-indication.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.raas-hf-indication.v2",
    "currentCaseId": null,
    "beforeQuestionSha256": "14b298a8bcd5c1e9a8a8bacc79ef145aebb704a6adc412c4d50c94b915f89f74",
    "beforeNodeSha256": "330bb75e55ad0efb671a0918dba52ce4c4d77df55c345f12736de178ac863fa5",
    "beforeCaseHeaderSha256": "232e7b42d8ffb649e62f0afd9e48f814cb80ad013cbacf5f140a0a81f1a0ae8e",
    "response": "One repair: specified 24-hour versus operative-morning omission, removed editorial “generic,” shared coordination and replaced unsupported escalation. Parked because continuation remains reasonable rather than uniquely required.",
    "remainingLimitation": "Continuation and short omission can remain acceptable depending on the precise hemodynamic/anesthetic context. A permissive HFrEF recommendation cannot support the exclusive key; Melissa must adjudicate a new exact case.",
    "composition": "Revised attempt isolated from all prior and future scored companions pending independent re-review.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.symptomatic-aortic-valve.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.symptomatic-aortic-valve.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.symptomatic-aortic-valve.v1",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.symptomatic-aortic-valve.v1",
    "currentCaseId": "case.topic.perioperative-risk-recovery.valve-risk.v1",
    "beforeQuestionSha256": "3d8cfcfc527e1c94c99bbb259823a13365e6558aa2e2428bfc249bc608276ca5",
    "beforeNodeSha256": "6e4258c5f24e45a05aee9cec8d4a0b8df8399e30f771950a048e0920e6603762",
    "beforeCaseHeaderSha256": "d1316cf07ffeb77dda13a53fb16a910714d25676e50c741d67eabae72d44784f",
    "response": "Preserved the exact reviewed question, options, explanation, evidence claims, patient header and finite profile. PASS suggestions are not authorization to edit this exact version.",
    "remainingLimitation": "One current primary guideline; no TAVR-versus-SAVR rank, exact delay or invented valve cutoff. The stress-test counterfactual remains specialist scope.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": true,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.des-acs-elective-timing.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.des-acs-elective-timing.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.des-acs-elective-timing.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.des-acs-elective-timing.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.recent-coronary-stent.v2",
    "beforeQuestionSha256": "80f82b6a0bb36ac9acda76e8123bd67f83e30ddd1d368134eddd901dca0a9988",
    "beforeNodeSha256": "8570ed6a7acb3e6bb1320a3d514dee82289caecad4eaa2d853089c4df33a5273",
    "beforeCaseHeaderSha256": "e7977d3d153020498a5d7272b9a4be251250bfe107b6af98221457f9f79c63ed",
    "response": "Moved away from the obvious six-week safety case. Supplied original raw PCI-indication findings and compared actual ACS, chronic-disease and time-sensitive timelines. Removed the heparin foil and redundant permission wording.",
    "remainingLimitation": "AHA-hosted 2024 guidance directly supports each timeline. Twelve months is an ideal elective pathway, not a universal prohibition under urgent or time-sensitive circumstances. No MI numeric-subtype teaching is introduced.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.mins-followup-plan.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.mins-followup-plan.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.perioperative-risk-recovery.mins-followup-plan.v2",
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.mins-followup-plan.v2",
    "currentCaseId": "case.topic.perioperative-risk-recovery.postoperative-troponin.v2",
    "beforeQuestionSha256": "f1538e591171dedaaddf2affe1e0fe62955efb712f29a4069ab4e3aeb355e2c3",
    "beforeNodeSha256": "03db3c2aec49f2d97e37427659d13cebe09e55d2c700e1e6d7e11d25bb9dc1ba",
    "beforeCaseHeaderSha256": "a5f2c05621f9e376aec8290139b97fd3340f6aff8205a3c1b57ad593886aa26b",
    "response": "Removed supplied attribution and extreme angiography. Added actual baseline/serial troponin, stable renal course and current recovery observations; compared specific referral destinations. Retains a moderate ceiling and avoids declaring a particular MI subtype.",
    "remainingLimitation": "The 2024 AHA perioperative guidance supports acute rise/fall evaluation and MINS follow-up. No specific MI subtype, assay-independent delta threshold, routine invasive test or antithrombotic regimen is asserted. The 2026 definition update is recorded as a current nomenclature boundary for clinician review.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.perioperative-risk-recovery.glp1-significant-symptoms.v1",
    "reviewedNodeId": "node.topic.perioperative-risk-recovery.glp1-significant-symptoms.v1",
    "reviewFile": "docs/research/question-topic-perioperative-risk-recovery-review-20261111.json",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.perioperative-risk-recovery.glp1-significant-symptoms.v2",
    "currentCaseId": null,
    "beforeQuestionSha256": "595c294b04c65f8d87b991aacabfcbbde31478ec17e08000bfb10e2558240be3",
    "beforeNodeSha256": "4e82f5dc34247b8e4850c73cbac93508a470e4f6fae64cd21c74a1a5cb692bf4",
    "beforeCaseHeaderSha256": "68147ec5643a19dbd33a10179bd2bba58e10fd3480f763dcbd9da58ed52e2dbd",
    "response": "One repair: removed editorial/duplicate cues and replaced antiemetic-only management with real preparation strategies. Parked because a fair harder exclusive comparison needs exact clinical/policy context not established by the permitted evidence.",
    "remainingLimitation": "Significant symptoms must remain visible. The supported lesson stays foundational, while real airway/diet alternatives require exact policy and clinical context. Do not force an exclusive preparation rule across differing guidance.",
    "composition": "Standalone case retained.",
    "independentPassPreserved": false,
    "newIndependentPassGranted": false,
    "clinicalApproval": false
  }
] as const;
const textFor = (c: DraftCase, value: string) => value.split(c.name).join('{patientName}').replace(new RegExp(`\\b${c.name.split(' ')[0]}\\b`, 'g'), '{patientName}');
const allNodes = PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes);
export const PERIOPERATIVE_TOPIC_SOURCES: ClinicalSource[] = ledger.sources as ClinicalSource[];
export const PERIOPERATIVE_TOPIC_CLAIMS: EvidenceClaim[] = ledger.claims as EvidenceClaim[];
const sourceLabelsFor = (ids: string[]) => [...new Set(PERIOPERATIVE_TOPIC_CLAIMS.filter(c => ids.map(claim).includes(c.id)).flatMap(c => c.sourceIds))]
  .map(id => PERIOPERATIVE_TOPIC_SOURCES.find(s => s.id === id)!.title);
export const PERIOPERATIVE_TOPIC_QUESTIONS: QuestionVariant[] = PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...recordFor(n.slug), id: PERIOPERATIVE_TOPIC_IDS.question(n.slug), conceptId: n.conceptId,
  stem: textFor(c, n.task), answerChoices: n.choices.map(x => ({ id: PERIOPERATIVE_TOPIC_IDS.choice(n.slug, x.id), label: x.label,
    isCorrect: x.id === n.key, rationale: x.rationale, distractorRationale: x.id === n.key ? null : x.rationale })),
  explanation: n.explanation, supportingEvidenceClaimIds: n.claims.map(claim), ...(n.exhibit ? { exhibit: n.exhibit } : {}),
})));
export const PERIOPERATIVE_TOPIC_CASES: SyntheticClinicalCase[] = PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS.map(c => {
  const demographics = { ageYears: c.age, sexLabel: c.sex };
  const presentation = textFor(c, c.presentation);
  const sourceLabels = c.preservedSourceLabels ?? sourceLabelsFor(c.nodes.flatMap(n => n.claims));
  return {
    id: PERIOPERATIVE_TOPIC_IDS.case(c.slug), displayName: c.complaint, patientDisplayName: c.name,
    patientPresentationVariantId: `presentation.${prefix}.${c.slug}.${caseVersion(c.slug)}`, prototypeDemographics: demographics,
    chiefComplaint: c.complaint, presentation,
    approvedInstantiationProfiles: [{ id: `profile.${prefix}.${c.slug}.${caseVersion(c.slug)}`, prototypeDemographics: demographics, chiefComplaint: c.complaint, presentation }],
    releasePointId: 'release.l0.clinic_evaluation', tutorialEligible: false, routineEligible: true,
    earliestFacilityStage: 1, requiredClinicalSetting: 'clinic', requiredCapabilityIds: [], rewardTierId: 'reward.clinic_basic', sourceLabels,
    decisionNodes: c.nodes.map((n, nodeIndex) => {
      const q = PERIOPERATIVE_TOPIC_QUESTIONS.find(q => q.id === PERIOPERATIVE_TOPIC_IDS.question(n.slug))!;
      const labels = sourceLabelsFor(n.claims);
      return { id: PERIOPERATIVE_TOPIC_IDS.node(n.slug), questionVariantId: q.id, primaryConceptId: n.conceptId,
        stem: q.stem, ...(n.update ? { currentUpdate: textFor(c, n.update) } : {}), ...(n.exhibit ? { exhibit: n.exhibit } : {}),
        answerChoices: q.answerChoices.map(x => ({ id: x.id, label: x.label, isCorrect: x.isCorrect, rationale: x.rationale!, serviceRequest: null })),
        shuffleAnswers: true, explanation: q.explanation, sourceLabels: labels, resultGateAfter: null,
        terminalDispositions: nodeIndex === c.nodes.length - 1 ? q.answerChoices.filter(x => !x.isCorrect).map(x => ({ answerChoiceId: x.id, kind: 'no_terminal_outcome' as const,
          consequenceNarrative: 'Review the recorded decision; no patient outcome is simulated.', clinicalRationale: x.rationale!, sourceLabels: labels })) : [],
      };
    }), learningSummary: c.nodes.map(n => n.explanation).join(' '),
  };
});
export const PERIOPERATIVE_TOPIC_CONCEPTS: TestedConcept[] = allNodes.map(n => ({
  id: n.conceptId, displayName: n.slug.replaceAll('-', ' '), learningObjective: n.objective, conceptType: n.conceptType, earliestFacilityStage: 1,
}));
export const PERIOPERATIVE_TOPIC_CONCEPT_PROPOSALS = allNodes.map(n => ({
  ...recordFor(n.slug), conceptId: n.conceptId, previousConceptId: n.previousConceptId ?? null,
  relation: n.previousConceptId ? 'new_version' : n.creationKind === 'Rewrite' || n.identityRelation ? 'reuse_existing_meaning' : 'new_meaning',
  reason: n.conceptVersionReason ?? (n.creationKind === 'Rewrite' || n.identityRelation ? 'Clinical meaning retained; only the exact question/context changes.' : 'An unrepresented decision receives a separate new concept identity.'),
  historyMigration: 'None. Keep all old definitions, cards, frozen encounters, timing/order records and saved histories.',
  educationalTier: 1, acuity: 'stable', earliestFacilityStage: 1, requiredCapabilityIds: [], evidenceClaimIds: n.claims.map(claim),
}));
export const PERIOPERATIVE_TOPIC_CASE_REVIEWS = PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS.map(c => ({
  ...PERIOPERATIVE_TOPIC_DRAFT, contentVersion: caseVersion(c.slug) === 'v1' ? PERIOPERATIVE_TOPIC_DRAFT.contentVersion : 'question-topic-perioperative-risk-recovery.2026-11-11.v2', caseId: PERIOPERATIVE_TOPIC_IDS.case(c.slug), educationalTier: 1, acuity: 'stable', historicalAcuity: c.historicalAcuity,
  encounterMode: c.encounterMode, earliestFacilityStage: 1, requiredClinicalSetting: 'clinic', requiredCapabilityIds: [], finiteProfileCount: 1,
  profileApproval: 'needs_clinician_review; approvedInstantiationProfiles is the existing structural field, not named clinical approval',
}));
export const PERIOPERATIVE_TOPIC_AUTHOR_CHECKS = PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...recordFor(n.slug), checkedOn: '2026-11-11', rubric: 'question-authoring.2026-11-08.v15',
  questionVariantId: PERIOPERATIVE_TOPIC_IDS.question(n.slug), caseId: PERIOPERATIVE_TOPIC_IDS.case(c.slug), nodeId: PERIOPERATIVE_TOPIC_IDS.node(n.slug),
  authorDisposition: 'Ready for independent scrutiny; author checks confer no PASS', independent: false, clinicalApproval: false, finiteProfileCount: 1,
  ...n.gate, optionAudit: n.choices.map(x => ({ choiceId: PERIOPERATIVE_TOPIC_IDS.choice(n.slug, x.id), isKey: x.id === n.key,
    temptation: x.temptation, whyRankedHere: x.rationale, correctUnder: x.correctUnder, evidenceClaimIds: x.claims.map(claim) })),
})));
export const PERIOPERATIVE_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  caseId: PERIOPERATIVE_TOPIC_IDS.case(c.slug), nodeId: PERIOPERATIVE_TOPIC_IDS.node(n.slug), questionVariantId: PERIOPERATIVE_TOPIC_IDS.question(n.slug),
  classification: n.choices.some(x => x.timingProfileId) ? { kind: 'test_choices' as const,
    choices: n.choices.map(x => ({ choiceId: PERIOPERATIVE_TOPIC_IDS.choice(n.slug, x.id), choiceLabel: x.label,
      timing: x.timingProfileId ? { kind: 'test' as const, timingProfileId: x.timingProfileId } : { kind: 'no_test' as const } })) } : { kind: 'no_test' as const },
})));
export const PERIOPERATIVE_TOPIC_ORDER_PROPOSALS = PERIOPERATIVE_TOPIC_TIMING_ENTRIES.flatMap(e => e.classification.kind === 'test_choices'
  ? e.classification.choices.flatMap(c => c.timing.kind === 'test' ? [{ ...PERIOPERATIVE_TOPIC_DRAFT, caseId: e.caseId, nodeId: e.nodeId,
    questionVariantId: e.questionVariantId, choiceId: c.choiceId, choiceLabel: c.choiceLabel, timing: c.timing,
    disposition: { kind: 'not_executed', reason: 'future_planned' }, serviceRequest: null, resultGateAfter: null,
    integration: 'Presentation-only wait proposal; no order is executed. Historical results are authored chart observations.' }] : []) : []);
export const PERIOPERATIVE_TOPIC_STATEMENT_MAPPINGS = PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS.flatMap(c => c.nodes.map(n => ({
  ...recordFor(n.slug), questionVariantId: PERIOPERATIVE_TOPIC_IDS.question(n.slug), caseId: PERIOPERATIVE_TOPIC_IDS.case(c.slug),
  constructedObservations: 'Names, age/sex, timing, measurements, medicine-list discrepancies, examinations and treatment-response records are fictional observations, not empirical outcome rates or new treatment thresholds.',
  fieldMappings: [{ field: 'presentation/currentUpdate/exhibit interpretation', claimIds: n.claims.map(claim) }, { field: 'task/explanation/learningSummary', claimIds: n.claims.map(claim) },
    ...n.choices.map(x => ({ field: `answerChoices.${PERIOPERATIVE_TOPIC_IDS.choice(n.slug, x.id)}.label/rationale/counterfactual`, claimIds: x.claims.map(claim) }))],
})));
export const PERIOPERATIVE_TOPIC_SOURCE_LINKS = PERIOPERATIVE_TOPIC_SOURCES.filter(s => s.officialUrl).map(s => ({
  ...PERIOPERATIVE_TOPIC_DRAFT, sourceId: s.id, label: s.title, href: s.officialUrl!, target: '_blank', rel: 'noopener noreferrer', referrerPolicy: 'no-referrer',
}));
export const PERIOPERATIVE_TOPIC_UNKEYED_HOLDS = [
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.dangerous-delirium",
    "attemptedCaseSlug": "dangerous-delirium",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.perioperative-risk-recovery.delirium-danger-treatment.v1",
    "reason": "The anticholinergic distractor is weak, while replacing it with dexmedetomidine raises an unsupported noncardiac-drug priority comparison. Do not score this attempted key.",
    "competingActions": [
      "Short symptom-directed haloperidol",
      "Monitored dexmedetomidine",
      "Further supported nonpharmacologic management"
    ],
    "decisionOwner": "Melissa Rowland and manager",
    "nextAction": "Define the clinical setting and treatment boundary that yields one defensible moderate/hard choice, verify that ranking, then author a new exact version for independent review."
  },
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.mri-system-change",
    "attemptedCaseSlug": "mri-system-change",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.mri.device-specific-safety-verification",
    "reason": "The generic whole-current-system verification key survives deletion of the revision observation, and generator-only becomes overlapping rather than uniquely correct in the counterfactual. The draft does not earn a moderate/hard consequential inference.",
    "competingActions": [
      "Current complete-system verification",
      "Generator-specific verification",
      "Prior clearance review"
    ],
    "decisionOwner": "manager: authoring and evidence task",
    "nextAction": "Obtain permitted exact device-condition evidence and construct a real decision between otherwise usable plans; repeat the five author checks. Preserve the old concept and all old versions."
  },
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.review1.vte-after-hemostasis",
    "attemptedCaseSlug": "cancer-prophylaxis-vte-after-hemostasis",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.perioperative-risk-recovery.vte-reassess-after-bleeding.v1",
    "reason": "The one repair resolves clarity and medication-eligibility gaps, but the conditional combination preference does not make LMWH without compression unequivocally wrong. The three-row component matrix also converges on the combination key. Park rather than force a difficult exclusive ranking.",
    "competingActions": [
      "Use prophylactic LMWH with pneumatic compression",
      "Use pneumatic compression without prophylactic LMWH",
      "Use prophylactic LMWH without pneumatic compression"
    ],
    "decisionOwner": "manager: authoring/evidence task; Melissa reviews clinical ranking",
    "nextAction": "Retain the unkeyed attempt and original history. Define a supported fair remaining decision or obtain explicit independent acceptance of a focused foundational role, then commission a new exact version."
  },
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.review1.sglt2-recovery-restart",
    "attemptedCaseSlug": "sglt2-hospital-course-sglt2-recovery-restart",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.n2.sglt2-postoperative-restart",
    "reason": "Present withholding is supported but remains easy. Permanent cessation versus eventual re-exposure after ketoacidosis needs an individualized clinical decision; no fair, independent moderate/hard comparison was established.",
    "competingActions": [
      "Keep empagliflozin withheld at this review",
      "Resume empagliflozin at this review",
      "Permanently discontinue empagliflozin at this review"
    ],
    "decisionOwner": "manager: authoring/evidence task; Melissa reviews clinical ranking",
    "nextAction": "Retain the unkeyed attempt and original history. Define a supported fair remaining decision or obtain explicit independent acceptance of a focused foundational role, then commission a new exact version."
  },
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.review1.suspected-osa-plan",
    "attemptedCaseSlug": "osa-operative-plan",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.perioperative-risk-recovery.suspected-osa-operative-plan.v1",
    "reason": "A named screen and balanced labels do not establish a unique anesthesia/recovery plan. Proceeding and postponement depend on procedure, monitoring and facility details not supplied by the permitted evidence; ordinary planning remains held for a concrete pathway.",
    "competingActions": [
      "Proceed with an OSA-conscious anesthetic and monitored recovery plan",
      "Postpone repair for diagnostic sleep testing and a revised plan",
      "Proceed with the hospital’s routine anesthetic and recovery plan"
    ],
    "decisionOwner": "manager: authoring/evidence task; Melissa reviews clinical ranking",
    "nextAction": "Retain the unkeyed attempt and original history. Define a supported fair remaining decision or obtain explicit independent acceptance of a focused foundational role, then commission a new exact version."
  },
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.review1.unmonitored-discharge-risk",
    "attemptedCaseSlug": "recovery-observation",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.perioperative-risk-recovery.osa-recovery-unmonitored-discharge.v1",
    "reason": "Do not hide ongoing apnea/rescue needs. The supported no-unmonitored-discharge lesson remains easy; current monitored unit versus transfer cannot be uniquely ranked without real capability/support criteria.",
    "competingActions": [
      "Continue monitored recovery at the current hospital unit",
      "Discharge home with his usual PAP plan",
      "Transfer to a higher-acuity monitored hospital unit"
    ],
    "decisionOwner": "manager: authoring/evidence task; Melissa reviews clinical ranking",
    "nextAction": "Retain the unkeyed attempt and original history. Define a supported fair remaining decision or obtain explicit independent acceptance of a focused foundational role, then commission a new exact version."
  },
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.review1.new-dyspnea-lv-assessment",
    "attemptedCaseSlug": "changed-cardiac-status-new-dyspnea-lv-assessment",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.perioperative-risk-recovery.changed-status-lv-assessment.v1",
    "reason": "The fair supported rule remains straightforward ventricular-assessment recognition. The one repair did not produce credible independent diagnostic-priority reasoning; no accepted basic role exists.",
    "competingActions": [
      "Transthoracic echocardiography",
      "Pharmacologic stress imaging",
      "Ambulatory ECG monitoring"
    ],
    "decisionOwner": "manager: authoring/evidence task; Melissa reviews clinical ranking",
    "nextAction": "Retain the unkeyed attempt and original history. Define a supported fair remaining decision or obtain explicit independent acceptance of a focused foundational role, then commission a new exact version."
  },
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.review1.raas-hf-indication",
    "attemptedCaseSlug": "changed-cardiac-status-raas-hf-indication",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.perioperative-risk-recovery.raas-heart-failure-indication.v1",
    "reason": "Continuation and short omission can remain acceptable depending on the precise hemodynamic/anesthetic context. A permissive HFrEF recommendation cannot support the exclusive key; Melissa must adjudicate a new exact case.",
    "competingActions": [
      "Continue the established lisinopril schedule",
      "Omit lisinopril for the 24 hours before surgery",
      "Omit the operative-morning lisinopril dose"
    ],
    "decisionOwner": "Melissa Rowland and manager",
    "nextAction": "Retain the unkeyed attempt and original history. Define a supported fair remaining decision or obtain explicit independent acceptance of a focused foundational role, then commission a new exact version."
  },
  {
    "contentVersion": "question-topic-perioperative-risk-recovery.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "hold.topic.perioperative-risk-recovery.review1.glp1-significant-symptoms",
    "attemptedCaseSlug": "glp1-current-symptoms",
    "activeQuestionVariantId": null,
    "activeKeyChoiceId": null,
    "proposedConceptId": "concept.perioperative-risk-recovery.glp1-severe-symptom-boundary.v1",
    "reason": "Significant symptoms must remain visible. The supported lesson stays foundational, while real airway/diet alternatives require exact policy and clinical context. Do not force an exclusive preparation rule across differing guidance.",
    "competingActions": [
      "Postpone for prescriber and anesthesia reassessment",
      "Proceed with rapid-sequence induction and tracheal intubation",
      "Proceed after a revised liquid-diet preparation plan"
    ],
    "decisionOwner": "manager: authoring/evidence task; Melissa reviews clinical ranking",
    "nextAction": "Retain the unkeyed attempt and original history. Define a supported fair remaining decision or obtain explicit independent acceptance of a focused foundational role, then commission a new exact version."
  }
];

export const PERIOPERATIVE_TOPIC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: 'clinical.synthetic.prototype.v1', schemaVersion: 1, publicationStatus: 'synthetic_unapproved_prototype',
  disclaimer: 'Original synthetic perioperative teaching drafts; not clinically approved. Melissa Rowland is clinical sign-off. Not medical advice.',
  concepts: PERIOPERATIVE_TOPIC_CONCEPTS, cases: PERIOPERATIVE_TOPIC_CASES,
});
export const PERIOPERATIVE_TOPIC_MANIFEST = {
  ...PERIOPERATIVE_TOPIC_DRAFT, contentVersion: 'question-topic-perioperative-risk-recovery.2026-11-11.v2', topicSlug: PERIOPERATIVE_TOPIC_SLUG, caseCount: PERIOPERATIVE_TOPIC_CASES.length, variantCount: PERIOPERATIVE_TOPIC_QUESTIONS.length,
  proposedRewriteVariants: allNodes.filter(n => n.creationKind === 'Rewrite').length,
  newVariants: allNodes.filter(n => n.creationKind === 'new').length,
  reusedConceptCount: allNodes.filter(n => !n.previousConceptId && (n.creationKind === 'Rewrite' || n.identityRelation)).length,
  changedMeaningCount: allNodes.filter(n => n.previousConceptId).length,
  additiveNewMeaningCount: allNodes.filter(n => n.creationKind === 'new' && !n.identityRelation).length,
  preservedIndependentPassCount: PERIOPERATIVE_TOPIC_REVIEW_DISPOSITIONS.filter(r => r.status === 'pass-preserved').length,
  revisedPendingReviewCount: PERIOPERATIVE_TOPIC_REVIEW_DISPOSITIONS.filter(r => r.status === 'revised').length,
  parkedAfterReviewCount: PERIOPERATIVE_TOPIC_REVIEW_DISPOSITIONS.filter(r => r.status === 'parked').length,
  unkeyedAttemptCount: PERIOPERATIVE_TOPIC_UNKEYED_HOLDS.length, reviewDisplay: 'key shown first for review only.',
  managerAccepted: false, independentPass: false, clinicalApproval: false, publicReleaseAuthorized: false,
  executableOrdersAdded: false, sharedFilesEdited: false,
  integrationDependencies: [
    'Explicit-import review sidecar only. Manager controls acceptance, ship manifest, shared concepts/claims/source/timing/order registries and case composition.',
    'This sidecar preserves original definitions, exact PASS references and frozen histories. New evidence does not automatically clear F13 or N2 extravasation holds.',
    'Every active case uses an existing clinic setting. Hospital/recovery decisions are reviews of outside records; no ICU, ED or trauma capability is requested.',
    'All active cases are standalone during this repair. Two PASS follow-up nodes were split from returned companions with exact clinical wording/header/profile preserved. Pending revised nodes cannot form a mixed multipart case; recompose natural sequences only after every scored node independently passes.',
    'A multipart case remains subject to the existing all-concepts-unseen-or-due selector rule. No FSRS transfer, eligibility change or independent supply claim.',
    'Seven returned-item attempts plus the two previous attempts are parked and excluded from scored supply. The inherited allergy protocol and original source-held versions remain held.',
    'The catheter-drainage distractor currently uses the nearest existing image-guided-fluid placeholder wait profile. Manager must review an exact catheter timing identity before admission; no procedure is executed.',
    'Concurrent v12 batch3 infection consolidation removed four assigned VTE-bearing original cases. Reconcile restored VTE coverage and the current closure-prophylaxis sequence before accepting the new cancer-prophylaxis case. The audit remains keyed to the dispatched snapshot.',
  ],
};
