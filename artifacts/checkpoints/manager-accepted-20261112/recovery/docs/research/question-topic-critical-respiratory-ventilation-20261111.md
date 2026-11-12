# Critical respiratory ventilation: skipped PASS salvage

**Current bounded packet, 2026-11-11. Status: salvage. All clinical content remains needs_clinician_review. Key shown first for review only. Runtime answer order remains randomized.**

## Assignment and current scope

Topic `critical-respiratory-ventilation`: Critical care — respiratory failure and ventilation. Scope in: Oxygen delivery/ventilation, respiratory failure, ARDS, ventilator waveform/pressure interpretation, weaning and airway-support complications. Scope out: Sedative/toxicologic reversal belongs to anesthesia-analgesia-pharmacology. Primary acid-base calculations belong to fluids-electrolytes-acid-base. Thoracic procedures belong to thoracic-lung-pleura-mediastinum. Priority: high. A few mechanism and weight-basis cards leave bedside ventilator decisions thin.

Original inventory snapshot: manifest 145 rows; 1,151 cases / 1,462 nodes / 610 concepts. The complete assigned inventory/concept/case/node/variant rows, holds, identity notes and original audit remain in the prior packet below and `assignment` in the JSON. Acceptance batch 1 has since changed the shared release; original totals are historical. This turn writes only the five topic files and does not update shared manifests, registries or accepted content.

The acceptance receipt identifies four PASS nodes skipped because their whole cases contained non-PASS companions or only survived in a frozen context. Each is now a separate one-node clinic chart review. The two respiratory nodes already accepted in batch 1 remain exact. No companion was revised; no new question, concept, source or clinical claim was added. The original mixed cases and prior feedback remain frozen as evidence, outside these four wrappers.

Inputs: [acceptance table](question-topic-acceptance-batch1-20261111.md), [dispositions](question-topic-acceptance-batch1-dispositions-20261111.json), [first review](question-topic-critical-respiratory-ventilation-review-20261111.json), [second review](question-topic-critical-respiratory-ventilation-review2-20261111.json). Exact input hashes, source snapshots and accepted-definition freezes are in `salvageRound`.

## Reviewer queue: salvage only

| Status | New standalone case ID | Exact node ID | Original reviewed question |
|---|---|---|---|
| salvage | `case.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1` | `node.topic.critical-respiratory-ventilation.copd-planned-extubation.v1` | `question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1` |
| salvage | `case.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1` | `node.topic.critical-respiratory-ventilation.sbt-readiness.v2` | `question.topic.critical-respiratory-ventilation.sbt-readiness.v2` |
| salvage | `case.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1` | `node.topic.critical-respiratory-ventilation.sbt-fio2.v2` | `question.topic.critical-respiratory-ventilation.sbt-fio2.v2` |
| salvage | `case.topic.critical-respiratory-ventilation.salvage-copd-niv.v1` | `node.topic.critical-respiratory-ventilation.copd-niv.v2` | `question.topic.critical-respiratory-ventilation.copd-niv.v2` |

Recheck these four standalone contexts only. Each preserves its exact PASS stem, current update, exhibit, choices/keys/rationales, explanation and concept identity. The new case/presentation/profile IDs identify the new context; editorial PASS is not inherited as standalone acceptance. Every item has `standaloneContextReviewStatus: pending_independent_review`, `managerAccepted: false` and `publicReleaseAuthorized: false`.

The planned-extubation presentation uses the neutral COPD admission wording, removing the irrelevant earlier-mask-support phrase. The other presentations are unchanged. Three formerly nonfinal nodes now carry the existing non-execution final-node metadata, with the same exact distractor rationales; there is no new simulated clinical outcome. No other node field changes. Four testing-choice mappings reuse the existing physiology timing profile; fixed durations are not added to question prose, and no service executes.

Counts this turn: **4 skipped PASS nodes audited; 4 standalone cases / 4 nodes salvaged; 0 accepted nodes changed; 0 companion rewrites; 0 new questions/concepts/claims/sources; 0 clinical approvals.** Current sidecar projection has 8 cases / 9 scored nodes; the original 11 question/node definitions and prior contexts remain inspectable.

## Exact standalone review packets

### Planned extubation with preventive NIV — salvage

Before: `case.topic.critical-respiratory-ventilation.niv.v1`; exact question `question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1`; node `node.topic.critical-respiratory-ventilation.copd-planned-extubation.v1`; concept `concept.critical-respiratory-ventilation.copd-planned-extubation.v1`. Original review: **PASS**, moderate, two-step true. No increase in difficulty is claimed by this context split.

After: `case.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1`. Current update repeats the tolerated trial, airway function, present gas, pre-illness baseline and oxygen need. COPD, age/sex and the neutral clinic frame supply the necessary population context without the earlier returned decisions.

Question SHA-256: `f61cf9b553ff9d4d19a463709e18789ac474382394418d1e94e14f5a306682e6`. Source node SHA-256: `05cee31f0873301b3b095bdf56ebc30eb6b8623ae45e4b76eb72a4b3ca2eab13`. Exact clinical-field checksum before/after: `dac54c06e3df7f432ec8f1527d6cdd88c1a27bd4afe176dbd8f3beec4ee35b0d` / `dac54c06e3df7f432ec8f1527d6cdd88c1a27bd4afe176dbd8f3beec4ee35b0d`. Standalone case checksum: `90f7d2fb9523c727145aa937b1e86a2a0e41e1dcab5c3abf01aca70521abb485`. Visible-context checksum: `75f14ed54e1f9ac342bc1d1a231baa1e9c8338709886c79124a402bf65703511`.

<details>
<summary>Before: exact reviewed visible context and composition change</summary>

```json
{
  "originalCaseId": "case.topic.critical-respiratory-ventilation.niv.v1",
  "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
  "nodeId": "node.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
  "visibleContext": {
    "presentation": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation that initially received mask support.",
    "chiefComplaint": "Breathing follow-up",
    "demographics": {
      "ageYears": 70,
      "sexLabel": "Male"
    },
    "currentUpdate": "Later hospital entry: after invasive support, Robert tolerates an SBT with stable blood pressure. He follows commands and clears secretions. End-trial pH is 7.38 and PaCO2 is 52 mm Hg; the pre-illness values were 7.38 and 50 mm Hg. Low-flow oxygen maintains the trial’s oxygenation.",
    "exhibit": null,
    "task": "Which airway plan best fits Robert Diaz’s recorded recovery assessment?",
    "choices": [
      {
        "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.prevent",
        "label": "Extubate directly to bilevel mask support"
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.oxygen",
        "label": "Extubate directly to standard nasal oxygen"
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.delay",
        "label": "Continue intubation until PaCO2 normalizes"
      }
    ],
    "priorFeedback": [
      {
        "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-niv.v1",
        "explanation": "The baseline and current gases show a new acidotic ventilatory problem rather than elevated PaCO2 in isolation. ERS/ATS supports bilevel NIV for an acidotic COPD exacerbation in a patient not immediately deteriorating. The support choice depends on clinical state as well as the gas; this is not a pH-alone rule.",
        "choices": [
          {
            "id": "choice.topic.critical-respiratory-ventilation.copd-niv.niv",
            "rationale": "The change from compensated baseline hypercapnia to respiratory acidosis and distress supports a monitored bilevel trial."
          },
          {
            "id": "choice.topic.critical-respiratory-ventilation.copd-niv.hfnc",
            "rationale": "Oxygen delivery is not the recommended substitute for bilevel ventilatory assistance in the stated acidotic COPD exacerbation."
          },
          {
            "id": "choice.topic.critical-respiratory-ventilation.copd-niv.intubate",
            "rationale": "Immediate invasive support is not the preferred first strategy for this alert patient without immediate deterioration."
          }
        ]
      },
      {
        "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-niv-failure.v1",
        "explanation": "A higher saturation does not establish successful ventilation or airway function. The worsening gas and clinical trajectory together support invasive ventilation. The value 7.18 is a fictional observation, not an authored universal threshold for intubation.",
        "choices": [
          {
            "id": "choice.topic.critical-respiratory-ventilation.copd-niv-failure.intubate",
            "rationale": "Worsening ventilation, consciousness and clearance indicate deteriorating mask support despite the improved saturation."
          },
          {
            "id": "choice.topic.critical-respiratory-ventilation.copd-niv-failure.niv",
            "rationale": "Extending the mask trial in the presence of immediate clinical deterioration risks delaying airway and ventilatory support."
          },
          {
            "id": "choice.topic.critical-respiratory-ventilation.copd-niv-failure.hfnc",
            "rationale": "Oxygen-focused support does not address this worsening ventilatory and airway problem."
          }
        ]
      }
    ]
  },
  "changes": {
    "caseId": {
      "before": "case.topic.critical-respiratory-ventilation.niv.v1",
      "after": "case.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1"
    },
    "presentation": {
      "before": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation that initially received mask support.",
      "after": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation."
    },
    "demographics": "Exact original named age/sex retained in one constrained profile.",
    "questionAndOptions": "Exact original stem, current update, exhibit, choices/keys/rationales and explanation retained; no scored-text change.",
    "terminalDispositions": "Unchanged.",
    "priorFeedback": "No prior scored node or feedback is shown in the standalone case. The exact former full contexts remain frozen."
  }
}
```

</details>

<details open>
<summary>After: complete standalone case (key shown first for review only)</summary>

```json
{
  "id": "case.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1",
  "displayName": "Robert Diaz: outside-record review",
  "patientPresentationVariantId": "presentation.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1",
  "releasePointId": "release.l0.clinic_evaluation",
  "patientDisplayName": "Robert Diaz",
  "prototypeDemographics": {
    "ageYears": 70,
    "sexLabel": "Male"
  },
  "chiefComplaint": "Breathing follow-up",
  "presentation": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1",
      "prototypeDemographics": {
        "ageYears": 70,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Breathing follow-up",
      "presentation": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 0,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation",
    "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure",
    "Pulse Oximeter Basics"
  ],
  "decisionNodes": [
    {
      "id": "node.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
      "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
      "primaryConceptId": "concept.critical-respiratory-ventilation.copd-planned-extubation.v1",
      "currentUpdate": "Later hospital entry: after invasive support, Robert tolerates an SBT with stable blood pressure. He follows commands and clears secretions. End-trial pH is 7.38 and PaCO2 is 52 mm Hg; the pre-illness values were 7.38 and 50 mm Hg. Low-flow oxygen maintains the trial’s oxygenation.",
      "stem": "Which airway plan best fits Robert Diaz’s recorded recovery assessment?",
      "answerChoices": [
        {
          "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.prevent",
          "label": "Extubate directly to bilevel mask support",
          "isCorrect": true,
          "rationale": "A suitable high-risk patient with chronic respiratory disease and hypercapnia can receive preventive NIV immediately after planned extubation.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.oxygen",
          "label": "Extubate directly to standard nasal oxygen",
          "isCorrect": false,
          "rationale": "Standard oxygen offers less of the verified preventive ventilatory strategy for this selected high-risk hypercapnic profile.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.delay",
          "label": "Continue intubation until PaCO2 normalizes",
          "isCorrect": false,
          "rationale": "The current pH and PaCO2 approximate his compensated baseline; a normal laboratory PaCO2 is not required by these observations.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "The trial and clearance observations support planned tube removal; the gas has returned near the documented compensated baseline. For this selected high-risk chronic respiratory profile, immediate preventive NIV is supported. This does not rank NIV against every HFNC/NIV regimen or make preventive NIV the rule for all extubations.",
      "sourceLabels": [
        "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation",
        "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.oxygen",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
          "clinicalRationale": "Standard oxygen offers less of the verified preventive ventilatory strategy for this selected high-risk hypercapnic profile.",
          "sourceLabels": [
            "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation",
            "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
          ]
        },
        {
          "answerChoiceId": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.delay",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
          "clinicalRationale": "The current pH and PaCO2 approximate his compensated baseline; a normal laboratory PaCO2 is not required by these observations.",
          "sourceLabels": [
            "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation",
            "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
          ]
        }
      ]
    }
  ],
  "learningSummary": "Review the historical observations and the reasoning for each recorded support decision."
}
```

</details>

<details>
<summary>Retained author reasoning, fairness limits, evidence and timing</summary>

```json
{
  "reasoning": {
    "interpretFindings": "Interpret residual hypercapnia against the documented baseline and the tolerated trial.",
    "applyMeaning": "Choose preventive support at planned extubation rather than prolonged intubation for a reference-range target.",
    "closestCredibleError": "Continue invasive support until PaCO2 enters the laboratory interval.",
    "decidingObservation": "End-trial pH and PaCO2 match the compensated baseline, with effective clearance and a tolerated trial.",
    "consequenceOfError": "Waiting for an inapplicable gas target can prolong invasive support; omitting prevention may increase failure risk in selected high-risk patients."
  },
  "deletionTest": "Delete baseline and persistent acute acidosis becomes uncertain; delete airway-clearance data and planned extubation is not established. Chronic disease and age establish the preventive-support population.",
  "counterfactual": "Without chronic respiratory disease or other high-risk features after a valid trial, standard nasal oxygen becomes reasonable.",
  "manualAuthorGate": {
    "kind": "manual_author_self_check",
    "independent": false,
    "clinicalApproval": false,
    "checkedOn": "2026-11-11",
    "coverTheKey": "Three short airway plans. No “high risk” eligibility conclusion is supplied; data and history establish it. HFNC is not used as a falsely inferior distractor where evidence may support it.",
    "sameStageAndCategory": "All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.",
    "twoConsequentialSteps": "Interpret residual hypercapnia against the documented baseline and the tolerated trial. Then Choose preventive support at planned extubation rather than prolonged intubation for a reference-range target.",
    "residentDifficulty": "Hard: distinguish baseline physiology, breathing readiness, airway function and the timing of prevention. Conditional evidence remains explicitly limited.",
    "singleBestAnswer": "End-trial pH and PaCO2 match the compensated baseline, with effective clearance and a tolerated trial. Counterfactual: Without chronic respiratory disease or other high-risk features after a valid trial, standard nasal oxygen becomes reasonable.",
    "residualConcern": "Independent reviewer must challenge plausibility and difficulty; this is neither editorial PASS nor clinical approval."
  },
  "choiceRubric": [
    {
      "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.prevent",
      "temptation": "Separate chronic gas values from new failure and apply prevention at the correct phase.",
      "correctUnder": "The tolerated trial with effective clearance in this older COPD patient."
    },
    {
      "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.oxygen",
      "temptation": "Treat breathing-trial tolerance as eliminating the patient-specific risk.",
      "correctUnder": "A patient without the supplied high-risk chronic respiratory profile."
    },
    {
      "id": "choice.topic.critical-respiratory-ventilation.copd-planned-extubation.delay",
      "temptation": "Apply a laboratory reference target instead of the patient’s chronic baseline.",
      "correctUnder": "Persistent acute ventilatory deterioration or another unresolved extubation barrier."
    }
  ],
  "originalReview": {
    "id": "question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
    "title": "Planned extubation with preventive NIV",
    "verdict": "PASS",
    "difficulty": "moderate",
    "twoStep": true,
    "highYield": true,
    "clarityIssues": [],
    "cues": [],
    "fairness": [
      "The learner must recognize return to a compensated chronic baseline rather than demand normal PaCO2, then choose immediate post-extubation support for an older patient with chronic respiratory disease and hypercapnia during the trial. Both observations affect the plan.",
      "Standard oxygen is a credible alternative because low-flow oxygen meets the recorded oxygenation need; preventive ventilatory support requires an additional risk-based inference. Continued intubation represents a recognizable error about chronic PaCO2 rather than an arbitrary absurd option.",
      "Immediate bilevel support is a defensible best choice for this selected profile, and the explanation appropriately avoids ranking all possible HFNC/NIV combinations or extending prophylaxis to every extubation. Offline assessment does not independently verify the exact guideline population or constitute clinical sign-off.",
      "The chronology explicitly advances from invasive support to a tolerated SBT with intact clearance. Current and pre-illness gases are repeated, so the node is interpretable with its shared presentation and update. Prior NIV-failure feedback does not teach the preventive post-extubation decision.",
      "The earlier use of mask support is historical context at this stage, not a reliable answer shortcut: returning to it after a prior failure requires recognizing the changed clinical phase. Preventive versus rescue support and chronic hypercapnia are high-yield distinctions."
    ],
    "suggestions": []
  },
  "standaloneContextCheck": {
    "scope": "Standalone clinic record wrapper only; no new clinical facts, key or options.",
    "selfContained": "Current update repeats the tolerated trial, airway function, present gas, pre-illness baseline and oxygen need. COPD, age/sex and the neutral clinic frame supply the necessary population context without the earlier returned decisions.",
    "priorFeedbackDependency": "None. All observations used by the original key are repeated in the unchanged update/exhibit.",
    "cueDisposition": "Neutral named-patient outside-record presentation; no new answer-bearing clinical observation added. Original reviewed difficulty and fairness assessment retained for reviewer context.",
    "identityDecision": "Unchanged question, node and concept IDs. New case/presentation/profile IDs distinguish the standalone context. Independent context review is pending.",
    "terminalMetadata": "Unchanged."
  },
  "clinicalStatementMappings": [
    {
      "field": "currentUpdate",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-prevention",
        "claim.critical-respiratory-ventilation.niv-copd",
        "claim.critical-respiratory-ventilation.airway-clearance"
      ],
      "constructedDataBasis": "Fictional observations and chronology. Numerical patient measurements are constructed inputs, not empirical rates, new thresholds, treatment durations or demographic weights."
    },
    {
      "field": "exhibit",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-prevention",
        "claim.critical-respiratory-ventilation.niv-copd",
        "claim.critical-respiratory-ventilation.airway-clearance"
      ],
      "constructedDataBasis": "Fictional observations and chronology. Numerical patient measurements are constructed inputs, not empirical rates, new thresholds, treatment durations or demographic weights."
    },
    {
      "field": "task",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-prevention",
        "claim.critical-respiratory-ventilation.niv-copd",
        "claim.critical-respiratory-ventilation.airway-clearance"
      ],
      "constructedDataBasis": "Fictional observations and chronology. Numerical patient measurements are constructed inputs, not empirical rates, new thresholds, treatment durations or demographic weights."
    },
    {
      "field": "explanation",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-prevention",
        "claim.critical-respiratory-ventilation.niv-copd",
        "claim.critical-respiratory-ventilation.airway-clearance"
      ],
      "constructedDataBasis": "Fictional observations and chronology. Numerical patient measurements are constructed inputs, not empirical rates, new thresholds, treatment durations or demographic weights."
    },
    {
      "field": "choices[0].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-prevention",
        "claim.critical-respiratory-ventilation.niv-copd",
        "claim.critical-respiratory-ventilation.airway-clearance"
      ],
      "constructedDataBasis": "Fictional observations and chronology. Numerical patient measurements are constructed inputs, not empirical rates, new thresholds, treatment durations or demographic weights."
    },
    {
      "field": "choices[1].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-prevention",
        "claim.critical-respiratory-ventilation.niv-copd",
        "claim.critical-respiratory-ventilation.airway-clearance"
      ],
      "constructedDataBasis": "Fictional observations and chronology. Numerical patient measurements are constructed inputs, not empirical rates, new thresholds, treatment durations or demographic weights."
    },
    {
      "field": "choices[2].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-prevention",
        "claim.critical-respiratory-ventilation.niv-copd",
        "claim.critical-respiratory-ventilation.airway-clearance"
      ],
      "constructedDataBasis": "Fictional observations and chronology. Numerical patient measurements are constructed inputs, not empirical rates, new thresholds, treatment durations or demographic weights."
    }
  ],
  "evidenceClaimIds": [
    "claim.critical-respiratory-ventilation.niv-prevention",
    "claim.critical-respiratory-ventilation.niv-copd",
    "claim.critical-respiratory-ventilation.airway-clearance"
  ],
  "timingProposal": {
    "caseId": "case.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

</details>

### SBT readiness despite an elevated RSBI — salvage

Before: `case.topic.critical-respiratory-ventilation.liberation.v2`; exact question `question.topic.critical-respiratory-ventilation.sbt-readiness.v2`; node `node.topic.critical-respiratory-ventilation.sbt-readiness.v2`; concept `concept.critical-respiratory-ventilation.sbt-readiness.v1`. Original review: **PASS**, moderate, two-step true. No increase in difficulty is claimed by this context split.

After: `case.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1`. The update contains the complete readiness domains, observed effort/tolerance, reason the index measurement ended and its value. The pneumonia/intubation clinic frame is unchanged.

Question SHA-256: `7b779421ffab220f70b6e6fe4d684d5c3871ed144a60faeac37931317a2beb81`. Source node SHA-256: `9520c1f0f15b84f46f97e82f12ccfbbefdd5ae751b3f7e7a54e3558e67252d13`. Exact clinical-field checksum before/after: `f41bc68504e68aa45e9888ab422cdfc4693e4e2e803993c9901989ba1dca367b` / `f41bc68504e68aa45e9888ab422cdfc4693e4e2e803993c9901989ba1dca367b`. Standalone case checksum: `566ed5fc20712dd8446b5b68eb242940da3923aa85a5da812daab5c12d55fa1e`. Visible-context checksum: `ed6f999797046ba9dd320a0e2632b7d8a8e03ff08ca1ccf9f9ed6927f5f4c776`.

<details>
<summary>Before: exact reviewed visible context and composition change</summary>

```json
{
  "originalCaseId": "case.topic.critical-respiratory-ventilation.liberation.v2",
  "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-readiness.v2",
  "nodeId": "node.topic.critical-respiratory-ventilation.sbt-readiness.v2",
  "visibleContext": {
    "presentation": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.",
    "chiefComplaint": "Hospital follow-up",
    "demographics": {
      "ageYears": 61,
      "sexLabel": "Female"
    },
    "currentUpdate": "Hospital record: Sarah follows commands and initiates breaths after pneumonia improves. PaO2 is 86 mm Hg on FiO2 0.35 and PEEP 5 cm H2O; blood pressure is 118/70 mm Hg without vasopressors. During the scheduled rapid shallow breathing index (RSBI) measurement she remains comfortable, with no accessory-muscle use, and saturation stays 94%. The measurement ends when its scheduled recording is complete; RSBI is 118 breaths/min/L.",
    "exhibit": null,
    "task": "Which liberation plan best fits Sarah Nguyen at this recorded assessment?",
    "choices": [
      {
        "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.sbt",
        "label": "Proceed to a monitored spontaneous breathing trial"
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.assist",
        "label": "Continue assist-control ventilation and reassess breathing tolerance"
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.reduce",
        "label": "Use stepwise pressure-support reductions before a breathing trial"
      }
    ],
    "priorFeedback": []
  },
  "changes": {
    "caseId": {
      "before": "case.topic.critical-respiratory-ventilation.liberation.v2",
      "after": "case.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1"
    },
    "presentation": {
      "before": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.",
      "after": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation."
    },
    "demographics": "Exact original named age/sex retained in one constrained profile.",
    "questionAndOptions": "Exact original stem, current update, exhibit, choices/keys/rationales and explanation retained; no scored-text change.",
    "terminalDispositions": "Three formerly nonfinal nodes require final no-outcome dispositions in their new standalone wrappers. Reused exact distractor rationales plus the existing non-execution narrative; no clinical outcome added.",
    "priorFeedback": "No prior scored node or feedback is shown in the standalone case. The exact former full contexts remain frozen."
  }
}
```

</details>

<details open>
<summary>After: complete standalone case (key shown first for review only)</summary>

```json
{
  "id": "case.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1",
  "displayName": "Sarah Nguyen: outside-record review",
  "patientPresentationVariantId": "presentation.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1",
  "releasePointId": "release.l0.clinic_evaluation",
  "patientDisplayName": "Sarah Nguyen",
  "prototypeDemographics": {
    "ageYears": 61,
    "sexLabel": "Female"
  },
  "chiefComplaint": "Hospital follow-up",
  "presentation": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1",
      "prototypeDemographics": {
        "ageYears": 61,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Hospital follow-up",
      "presentation": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 0,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation",
    "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
  ],
  "decisionNodes": [
    {
      "id": "node.topic.critical-respiratory-ventilation.sbt-readiness.v2",
      "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-readiness.v2",
      "primaryConceptId": "concept.critical-respiratory-ventilation.sbt-readiness.v1",
      "currentUpdate": "Hospital record: Sarah follows commands and initiates breaths after pneumonia improves. PaO2 is 86 mm Hg on FiO2 0.35 and PEEP 5 cm H2O; blood pressure is 118/70 mm Hg without vasopressors. During the scheduled rapid shallow breathing index (RSBI) measurement she remains comfortable, with no accessory-muscle use, and saturation stays 94%. The measurement ends when its scheduled recording is complete; RSBI is 118 breaths/min/L.",
      "stem": "Which liberation plan best fits Sarah Nguyen at this recorded assessment?",
      "answerChoices": [
        {
          "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.sbt",
          "label": "Proceed to a monitored spontaneous breathing trial",
          "isCorrect": true,
          "rationale": "Multidomain readiness and the observed comfortable sample support testing sustained breathing under minimal assistance.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.assist",
          "label": "Continue assist-control ventilation and reassess breathing tolerance",
          "isCorrect": false,
          "rationale": "Deferral would be appropriate for actual instability or observed intolerance, neither of which is supplied by this completed measurement.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.reduce",
          "label": "Use stepwise pressure-support reductions before a breathing trial",
          "isCorrect": false,
          "rationale": "A gradual support-reduction pathway does not resolve a demonstrated barrier here and can defer the direct trial supported by the record.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "The readiness domains and observed tolerance support proceeding to a monitored SBT. The completed index measurement was not stopped for distress and does not itself demonstrate trial failure. AARC does not require RSBI as a gate to a trial; it also does not say to ignore actual intolerance. No new index cutoff or trial duration is prescribed.",
      "sourceLabels": [
        "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.assist",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
          "clinicalRationale": "Deferral would be appropriate for actual instability or observed intolerance, neither of which is supplied by this completed measurement.",
          "sourceLabels": [
            "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation"
          ]
        },
        {
          "answerChoiceId": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.reduce",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
          "clinicalRationale": "A gradual support-reduction pathway does not resolve a demonstrated barrier here and can defer the direct trial supported by the record.",
          "sourceLabels": [
            "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation"
          ]
        }
      ]
    }
  ],
  "learningSummary": "Review the historical observations and the reasoning for each recorded support decision."
}
```

</details>

<details>
<summary>Retained author reasoning, fairness limits, evidence and timing</summary>

```json
{
  "reasoning": {
    "interpretFindings": "Integrate the recovery domains and actual effort/tolerance observations, distinguishing a completed index measurement from a trial stopped for intolerance.",
    "applyMeaning": "Choose a monitored breathing trial rather than requiring an isolated index or gradual support reduction as a mandatory gate.",
    "closestCredibleError": "Read the index as a failed trial despite the documented reason the sample ended.",
    "decidingObservation": "The sample was comfortable and ended after scheduled recording, with stable oxygenation and circulation.",
    "consequenceOfError": "Unnecessary deferral may prolong invasive support; actual intolerance would instead warrant reassessment."
  },
  "deletionTest": "Deleting observed sample tolerance and its stopping reason reopens whether the sample represented failure. Removing the multidomain recovery observations removes trial-readiness support. The measured high index preserves a real competing interpretation.",
  "counterfactual": "If the sample ended because accessory-muscle use, desaturation or circulatory instability developed, continuing support and assessing that intolerance would become appropriate instead of proceeding immediately.",
  "manualAuthorGate": {
    "kind": "manual_author_self_check",
    "checkedOn": "2026-11-11",
    "independent": false,
    "clinicalApproval": false,
    "coverTheKey": "Expanded RSBI on first use and documented the sample’s effort, tolerance and reason for ending without calling the result acceptable. Replaced the redundant repeat-index distractor and removed SIMV. All alternatives are current liberation plans; testing plans have explicit timing metadata.",
    "sameStageAndCategory": "Three concrete liberation strategies: monitored trial, continued assist-control reassessment, or stepwise pressure-support weaning.",
    "twoConsequentialSteps": "Integrate the recovery domains and actual effort/tolerance observations, distinguishing a completed index measurement from a trial stopped for intolerance. Then Choose a monitored breathing trial rather than requiring an isolated index or gradual support reduction as a mandatory gate.",
    "residentDifficulty": "Fair moderate: interprets actual tolerance versus an isolated screening number. This is not made artificially hard by an unspecified sample or a repeated-test foil.",
    "singleBestAnswer": "The sample was comfortable and ended after scheduled recording, with stable oxygenation and circulation. Counterfactual: If the sample ended because accessory-muscle use, desaturation or circulatory instability developed, continuing support and assessing that intolerance would become appropriate instead of proceeding immediately.",
    "residualConcern": "Fairness and clinical ranking require independent review; no author PASS or measured difficulty asserted."
  },
  "choiceRubric": [
    {
      "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.sbt",
      "temptation": "Distinguish a completed screen from an intolerant trial.",
      "correctUnder": "The supplied stable oxygenation, effort and circulation with no observed measurement intolerance."
    },
    {
      "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.assist",
      "temptation": "Treat the measured index as sufficient proof that a breathing trial has failed.",
      "correctUnder": "Distress or circulatory/oxygenation deterioration during the measurement."
    },
    {
      "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.reduce",
      "temptation": "Treat gradual weaning as necessary because an isolated screening index remains high.",
      "correctUnder": "A separate individualized weaning plan after actual intolerance has been evaluated."
    }
  ],
  "originalReview": {
    "id": "question.topic.critical-respiratory-ventilation.sbt-readiness.v2",
    "nodeId": "node.topic.critical-respiratory-ventilation.sbt-readiness.v2",
    "title": "SBT readiness despite an elevated RSBI",
    "verdict": "PASS",
    "difficulty": "moderate",
    "twoStep": true,
    "highYield": true,
    "clarityIssues": [],
    "cues": [],
    "fairness": [
      "The patient has improving disease, wakefulness, spontaneous effort, satisfactory oxygenation on modest support and stable circulation. The completed comfortable index measurement is explicitly distinguished from a trial aborted for distress.",
      "Proceeding to a monitored SBT is defensible despite the isolated RSBI value. Continuing assist-control or requiring gradual pressure-support reduction represents treating the screening index as a mandatory barrier; neither is compelled by the supplied observed clinical state.",
      "The explanation appropriately separates an index from actual intolerance and does not invent a new cutoff. Exact contemporary guideline wording was not independently verified because this assignment prohibits network use; no confident clinical error is alleged.",
      "Predicted moderate: reconcile a concerning traditional screening result with actual readiness, then select a monitored assessment rather than prolonged support. This is high-yield liberation practice.",
      "No direct wording shortcut, absolute, diagnostic-label giveaway or unique comprehensive key found. Comfort and hemodynamic observations are necessary eligibility information rather than removable hints. The item stands independently and does not teach the next node?s oxygen-concentration issue."
    ],
    "suggestions": []
  },
  "standaloneContextCheck": {
    "scope": "Standalone clinic record wrapper only; no new clinical facts, key or options.",
    "selfContained": "The update contains the complete readiness domains, observed effort/tolerance, reason the index measurement ended and its value. The pneumonia/intubation clinic frame is unchanged.",
    "priorFeedbackDependency": "None. All observations used by the original key are repeated in the unchanged update/exhibit.",
    "cueDisposition": "Neutral named-patient outside-record presentation; no new answer-bearing clinical observation added. Original reviewed difficulty and fairness assessment retained for reviewer context.",
    "identityDecision": "Unchanged question, node and concept IDs. New case/presentation/profile IDs distinguish the standalone context. Independent context review is pending.",
    "terminalMetadata": "Three formerly nonfinal nodes require final no-outcome dispositions in their new standalone wrappers. Reused exact distractor rationales plus the existing non-execution narrative; no clinical outcome added."
  },
  "clinicalStatementMappings": [
    {
      "field": "currentUpdate",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-readiness"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "exhibit",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-readiness"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "task",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-readiness"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "explanation",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-readiness"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[0].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-readiness"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[1].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-readiness"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[2].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-readiness"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    }
  ],
  "evidenceClaimIds": [
    "claim.critical-respiratory-ventilation.sbt-readiness"
  ],
  "timingProposal": {
    "caseId": "case.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.sbt-readiness.v2",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-readiness.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.sbt",
          "choiceLabel": "Proceed to a monitored spontaneous breathing trial",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.assist",
          "choiceLabel": "Continue assist-control ventilation and reassess breathing tolerance",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.reduce",
          "choiceLabel": "Use stepwise pressure-support reductions before a breathing trial",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        }
      ]
    }
  }
}
```

</details>

### Interpreting an SBT performed at higher oxygen concentration — salvage

Before: `case.topic.critical-respiratory-ventilation.liberation.v2`; exact question `question.topic.critical-respiratory-ventilation.sbt-fio2.v2`; node `node.topic.critical-respiratory-ventilation.sbt-fio2.v2`; concept `concept.critical-respiratory-ventilation.sbt-fio2.v1`. Original review: **PASS**, moderate, two-step true. No increase in difficulty is claimed by this context split.

After: `case.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1`. The unchanged update and before/during table supply their own support and oxygen baseline. The original pneumonia/intubation clinic frame is sufficient without prior readiness feedback.

Question SHA-256: `7ff75673e8eb2ce6a40e441c9f040671cb934a619612905f44e56af1b5faf448`. Source node SHA-256: `2473e4834561dc6879b669b60a9418e3ef8df8bd59cf6cc6f18074ccae143c65`. Exact clinical-field checksum before/after: `fb1c203f51f6ef08b77238f0d37a064d85c8d2d6c18dbd920915c226e1558070` / `fb1c203f51f6ef08b77238f0d37a064d85c8d2d6c18dbd920915c226e1558070`. Standalone case checksum: `eb37fa9619c317ab9cc15caef6b09ffc6d049a7ad9496f52fa4f5d4c39d2c62f`. Visible-context checksum: `012ae6ef26bab95d94f144bbfbd31193dd456eec77064dc15319ed83dd831d44`.

<details>
<summary>Before: exact reviewed visible context and composition change</summary>

```json
{
  "originalCaseId": "case.topic.critical-respiratory-ventilation.liberation.v2",
  "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-fio2.v2",
  "nodeId": "node.topic.critical-respiratory-ventilation.sbt-fio2.v2",
  "visibleContext": {
    "presentation": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.",
    "chiefComplaint": "Hospital follow-up",
    "demographics": {
      "ageYears": 61,
      "sexLabel": "Female"
    },
    "currentUpdate": "Next hospital entry: Sarah completes a breathing trial without accessory-muscle use or circulatory change. The trial is recorded as tolerated. Its ventilator and oxygen conditions are shown below.",
    "exhibit": {
      "kind": "table",
      "caption": "Independently constructed outside-hospital record; fictional measurements",
      "columnHeaders": [
        "Pressure support / PEEP",
        "FiO2",
        "SpO2 / respiratory rate"
      ],
      "rowHeaders": [
        "Before trial",
        "During trial"
      ],
      "cells": [
        [
          "8 / 5 cm H2O",
          "0.35",
          "94% / 22 per min"
        ],
        [
          "0 / 0 cm H2O",
          "0.60",
          "97% / 25 per min"
        ]
      ]
    },
    "task": "Which liberation plan best fits Sarah Nguyen’s recorded trial?",
    "choices": [
      {
        "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.oxygen",
        "label": "Repeat an unassisted trial at FiO2 0.35"
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.support",
        "label": "Repeat a supported trial at FiO2 0.60"
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.extubate",
        "label": "Extubate to oxygen at FiO2 0.60"
      }
    ],
    "priorFeedback": [
      {
        "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-readiness.v2",
        "explanation": "The readiness domains and observed tolerance support proceeding to a monitored SBT. The completed index measurement was not stopped for distress and does not itself demonstrate trial failure. AARC does not require RSBI as a gate to a trial; it also does not say to ignore actual intolerance. No new index cutoff or trial duration is prescribed.",
        "choices": [
          {
            "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.sbt",
            "rationale": "Multidomain readiness and the observed comfortable sample support testing sustained breathing under minimal assistance."
          },
          {
            "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.assist",
            "rationale": "Deferral would be appropriate for actual instability or observed intolerance, neither of which is supplied by this completed measurement."
          },
          {
            "id": "choice.topic.critical-respiratory-ventilation.sbt-readiness.v2.reduce",
            "rationale": "A gradual support-reduction pathway does not resolve a demonstrated barrier here and can defer the direct trial supported by the record."
          }
        ]
      }
    ]
  },
  "changes": {
    "caseId": {
      "before": "case.topic.critical-respiratory-ventilation.liberation.v2",
      "after": "case.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1"
    },
    "presentation": {
      "before": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.",
      "after": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation."
    },
    "demographics": "Exact original named age/sex retained in one constrained profile.",
    "questionAndOptions": "Exact original stem, current update, exhibit, choices/keys/rationales and explanation retained; no scored-text change.",
    "terminalDispositions": "Three formerly nonfinal nodes require final no-outcome dispositions in their new standalone wrappers. Reused exact distractor rationales plus the existing non-execution narrative; no clinical outcome added.",
    "priorFeedback": "No prior scored node or feedback is shown in the standalone case. The exact former full contexts remain frozen."
  }
}
```

</details>

<details open>
<summary>After: complete standalone case (key shown first for review only)</summary>

```json
{
  "id": "case.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1",
  "displayName": "Sarah Nguyen: outside-record review",
  "patientPresentationVariantId": "presentation.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1",
  "releasePointId": "release.l0.clinic_evaluation",
  "patientDisplayName": "Sarah Nguyen",
  "prototypeDemographics": {
    "ageYears": 61,
    "sexLabel": "Female"
  },
  "chiefComplaint": "Hospital follow-up",
  "presentation": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1",
      "prototypeDemographics": {
        "ageYears": 61,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Hospital follow-up",
      "presentation": "Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 0,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation",
    "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
  ],
  "decisionNodes": [
    {
      "id": "node.topic.critical-respiratory-ventilation.sbt-fio2.v2",
      "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-fio2.v2",
      "primaryConceptId": "concept.critical-respiratory-ventilation.sbt-fio2.v1",
      "currentUpdate": "Next hospital entry: Sarah completes a breathing trial without accessory-muscle use or circulatory change. The trial is recorded as tolerated. Its ventilator and oxygen conditions are shown below.",
      "stem": "Which liberation plan best fits Sarah Nguyen’s recorded trial?",
      "answerChoices": [
        {
          "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.oxygen",
          "label": "Repeat an unassisted trial at FiO2 0.35",
          "isCorrect": true,
          "rationale": "This retains a valid trial method while addressing the oxygen-condition uncertainty.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.support",
          "label": "Repeat a supported trial at FiO2 0.60",
          "isCorrect": false,
          "rationale": "Adding assistance is not required just because the prior trial was unassisted; retaining the higher FiO2 leaves the oxygen comparison unresolved.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.extubate",
          "label": "Extubate to oxygen at FiO2 0.60",
          "isCorrect": false,
          "rationale": "The improved saturation occurred at higher oxygen support, so this record does not yet establish the intended oxygen-condition tolerance for that decision.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "An unassisted trial is an accepted approach; the absence of pressure support does not itself invalidate this assessment. The higher FiO2, however, means the improved displayed saturation does not establish tolerance at the preceding oxygen concentration. Repeat an unassisted trial at the preceding FiO2 before relying on this result for tube removal. The unchanged-FiO2 recommendation is conditional with very low certainty.",
      "exhibit": {
        "kind": "table",
        "caption": "Independently constructed outside-hospital record; fictional measurements",
        "columnHeaders": [
          "Pressure support / PEEP",
          "FiO2",
          "SpO2 / respiratory rate"
        ],
        "rowHeaders": [
          "Before trial",
          "During trial"
        ],
        "cells": [
          [
            "8 / 5 cm H2O",
            "0.35",
            "94% / 22 per min"
          ],
          [
            "0 / 0 cm H2O",
            "0.60",
            "97% / 25 per min"
          ]
        ]
      },
      "sourceLabels": [
        "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.support",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
          "clinicalRationale": "Adding assistance is not required just because the prior trial was unassisted; retaining the higher FiO2 leaves the oxygen comparison unresolved.",
          "sourceLabels": [
            "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation"
          ]
        },
        {
          "answerChoiceId": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.extubate",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
          "clinicalRationale": "The improved saturation occurred at higher oxygen support, so this record does not yet establish the intended oxygen-condition tolerance for that decision.",
          "sourceLabels": [
            "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation"
          ]
        }
      ]
    }
  ],
  "learningSummary": "Review the historical observations and the reasoning for each recorded support decision."
}
```

</details>

<details>
<summary>Retained author reasoning, fairness limits, evidence and timing</summary>

```json
{
  "reasoning": {
    "interpretFindings": "Recognize that an unassisted SBT can be a valid method while the oxygen concentration was increased.",
    "applyMeaning": "Repeat the oxygen-condition assessment rather than add unnecessary assistance or treat the higher saturation as proof for extubation.",
    "closestCredibleError": "Restore pressure support because the lower assistance appears to make the trial invalid.",
    "decidingObservation": "She tolerates unassisted breathing, but the saturation improvement occurs at a FiO2 increase from 0.35 to 0.60.",
    "consequenceOfError": "The wrong repeat protocol can retain the confound or unnecessary tube removal can rely on a falsely reassuring result."
  },
  "deletionTest": "Deleting actual pressure/PEEP leaves uncertainty about the support-method alternative; deleting either oxygen condition prevents evaluation of the apparent saturation improvement. Comfort preserves the distinction between reassessment and immediate rescue.",
  "counterfactual": "With the same comfortable unassisted trial at unchanged FiO2 and a satisfactory airway assessment, extubation becomes reasonable. Observed distress under unsupported breathing would instead justify support and cause reassessment.",
  "manualAuthorGate": {
    "kind": "manual_author_self_check",
    "checkedOn": "2026-11-11",
    "independent": false,
    "clinicalApproval": false,
    "coverTheKey": "Neutral next-plan task replaces “before an extubation decision”; removed the editorial “but.” Actual pressure support and PEEP are supplied. Two plausible repeat protocols compete, and both receive physiology waits; no task wording excludes extubation.",
    "sameStageAndCategory": "Three complete liberation plans comparing two specified repeat protocols with tube removal at the recorded stage.",
    "twoConsequentialSteps": "Recognize that an unassisted SBT can be a valid method while the oxygen concentration was increased. Then Repeat the oxygen-condition assessment rather than add unnecessary assistance or treat the higher saturation as proof for extubation.",
    "residentDifficulty": "Fair moderate: distinguish valid reduction of ventilatory assistance from an oxygen-condition confound, then select the repeat that addresses the unresolved observation. Conditional evidence remains explicit.",
    "singleBestAnswer": "She tolerates unassisted breathing, but the saturation improvement occurs at a FiO2 increase from 0.35 to 0.60. Counterfactual: With the same comfortable unassisted trial at unchanged FiO2 and a satisfactory airway assessment, extubation becomes reasonable. Observed distress under unsupported breathing would instead justify support and cause reassessment.",
    "residualConcern": "Fairness and clinical ranking require independent review; no author PASS or measured difficulty asserted."
  },
  "choiceRubric": [
    {
      "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.oxygen",
      "temptation": "Evaluate pressure assistance and oxygen support as different inputs.",
      "correctUnder": "The supplied comfortable unassisted trial performed at increased FiO2."
    },
    {
      "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.support",
      "temptation": "Treat removal of pressure assistance as the test defect despite observed comfort.",
      "correctUnder": "A separate deliberately supported trial protocol at an unchanged appropriate oxygen condition."
    },
    {
      "id": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.extubate",
      "temptation": "Interpret the better saturation as recovery without considering the changed support.",
      "correctUnder": "A valid unchanged-oxygen trial together with satisfactory current airway assessment."
    }
  ],
  "originalReview": {
    "id": "question.topic.critical-respiratory-ventilation.sbt-fio2.v2",
    "nodeId": "node.topic.critical-respiratory-ventilation.sbt-fio2.v2",
    "title": "Interpreting an SBT performed at higher oxygen concentration",
    "verdict": "PASS",
    "difficulty": "moderate",
    "twoStep": true,
    "highYield": true,
    "clarityIssues": [],
    "cues": [],
    "fairness": [
      "The before/during table makes both support withdrawal and oxygen escalation visible. Calling the trial ?recorded as tolerated? is a report to evaluate, not proof that all extubation criteria were satisfied.",
      "An unassisted trial is a valid method. Better saturation at higher FiO2 does not establish tolerance at the earlier concentration. Repeating at the earlier FiO2 is the best offered way to resolve that uncertainty; adding pressure support while retaining the higher FiO2 does not resolve it, and immediate extubation relies on an incompletely assessed oxygen condition.",
      "The explanation correctly identifies its recommendation as conditional and very low certainty. Treat this as the best assessment among the offered plans, not proof of actual SBT failure, a universal extubation prohibition at FiO2 0.60, or a universal requirement for zero pressure support. This offline review cannot newly verify the exact recommendation.",
      "Predicted moderate: distinguish a legitimate trial method from a confounded oxygenation comparison, then choose the assessment that resolves the confounding. The first two choices share repeating a trial and the last two share FiO2 0.60; component frequency does not uniquely assemble the key.",
      "The earlier SBT-readiness explanation does not disclose the oxygen-condition decision. The table includes its own baseline, so the node stands alone with the presentation. The historical progression from readiness to trial assessment is coherent."
    ],
    "suggestions": []
  },
  "standaloneContextCheck": {
    "scope": "Standalone clinic record wrapper only; no new clinical facts, key or options.",
    "selfContained": "The unchanged update and before/during table supply their own support and oxygen baseline. The original pneumonia/intubation clinic frame is sufficient without prior readiness feedback.",
    "priorFeedbackDependency": "None. All observations used by the original key are repeated in the unchanged update/exhibit.",
    "cueDisposition": "Neutral named-patient outside-record presentation; no new answer-bearing clinical observation added. Original reviewed difficulty and fairness assessment retained for reviewer context.",
    "identityDecision": "Unchanged question, node and concept IDs. New case/presentation/profile IDs distinguish the standalone context. Independent context review is pending.",
    "terminalMetadata": "Three formerly nonfinal nodes require final no-outcome dispositions in their new standalone wrappers. Reused exact distractor rationales plus the existing non-execution narrative; no clinical outcome added."
  },
  "clinicalStatementMappings": [
    {
      "field": "currentUpdate",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-oxygen",
        "claim.critical-respiratory-ventilation.sbt-support-method-r1"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "exhibit",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-oxygen",
        "claim.critical-respiratory-ventilation.sbt-support-method-r1"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "task",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-oxygen",
        "claim.critical-respiratory-ventilation.sbt-support-method-r1"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "explanation",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-oxygen",
        "claim.critical-respiratory-ventilation.sbt-support-method-r1"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[0].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-oxygen",
        "claim.critical-respiratory-ventilation.sbt-support-method-r1"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[1].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-oxygen",
        "claim.critical-respiratory-ventilation.sbt-support-method-r1"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[2].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.sbt-oxygen",
        "claim.critical-respiratory-ventilation.sbt-support-method-r1"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    }
  ],
  "evidenceClaimIds": [
    "claim.critical-respiratory-ventilation.sbt-oxygen",
    "claim.critical-respiratory-ventilation.sbt-support-method-r1"
  ],
  "timingProposal": {
    "caseId": "case.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.sbt-fio2.v2",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-fio2.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.oxygen",
          "choiceLabel": "Repeat an unassisted trial at FiO2 0.35",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.support",
          "choiceLabel": "Repeat a supported trial at FiO2 0.60",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "choice.topic.critical-respiratory-ventilation.sbt-fio2.v2.extubate",
          "choiceLabel": "Extubate to oxygen at FiO2 0.60",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  }
}
```

</details>

### Initial support for an acidotic COPD exacerbation — salvage

Before: `case.topic.critical-respiratory-ventilation.niv-reassessment.v2`; exact question `question.topic.critical-respiratory-ventilation.copd-niv.v2`; node `node.topic.critical-respiratory-ventilation.copd-niv.v2`; concept `concept.critical-respiratory-ventilation.copd-niv.v1`. Original review: **PASS**, moderate, two-step true. No increase in difficulty is claimed by this context split.

After: `case.topic.critical-respiratory-ventilation.salvage-copd-niv.v1`. The unchanged update and table supply treatment phase, acute-versus-baseline gases and current airway/circulatory state. The neutral COPD clinic frame remains unchanged.

Question SHA-256: `c3e7e9113e9ee277d1e30fd59fde4a5e03108d488b351183cd405bf9e481d7ab`. Source node SHA-256: `90c1e74a13f763799b0e498584c7f8d789d184547b89374b6d9133326855dd20`. Exact clinical-field checksum before/after: `f10fc71d6821e5ff5d572c97042b7d2ac18ebb0cc3d2c24737f65a720fe59c32` / `f10fc71d6821e5ff5d572c97042b7d2ac18ebb0cc3d2c24737f65a720fe59c32`. Standalone case checksum: `a82c5bc54994ce30e290cd01a9e109e9baa42121c7f8c06d69bc8bd80955b75b`. Visible-context checksum: `cc6012abdc921d28c6764ad471b38ef52a9218000f496beeced85a842e1405ab`.

<details>
<summary>Before: exact reviewed visible context and composition change</summary>

```json
{
  "originalCaseId": "case.topic.critical-respiratory-ventilation.niv-reassessment.v2",
  "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-niv.v2",
  "nodeId": "node.topic.critical-respiratory-ventilation.copd-niv.v2",
  "visibleContext": {
    "presentation": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation.",
    "chiefComplaint": "Breathing follow-up",
    "demographics": {
      "ageYears": 70,
      "sexLabel": "Male"
    },
    "currentUpdate": "Hospital record: after inhaled bronchodilator treatment, Robert has respiratory rate 30/min with accessory-muscle use. He is alert and clears oral secretions. Blood pressure is 128/72 mm Hg.",
    "exhibit": {
      "kind": "table",
      "caption": "Independently constructed outside-hospital record; fictional measurements",
      "columnHeaders": [
        "pH",
        "PaCO2",
        "PaO2",
        "Oxygen condition"
      ],
      "rowHeaders": [
        "Before illness",
        "Current arterial sample"
      ],
      "cells": [
        [
          "7.38",
          "50 mm Hg",
          "Not recorded",
          "Room air"
        ],
        [
          "7.28",
          "70 mm Hg",
          "62 mm Hg",
          "FiO2 0.28"
        ]
      ]
    },
    "task": "Which respiratory-support strategy best fits Robert Diaz’s initial hospital assessment?",
    "choices": [
      {
        "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.niv",
        "label": "Start bilevel mask ventilation"
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.hfnc",
        "label": "Start high-flow nasal oxygen"
      },
      {
        "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.intubate",
        "label": "Start invasive endotracheal ventilation"
      }
    ],
    "priorFeedback": []
  },
  "changes": {
    "caseId": {
      "before": "case.topic.critical-respiratory-ventilation.niv-reassessment.v2",
      "after": "case.topic.critical-respiratory-ventilation.salvage-copd-niv.v1"
    },
    "presentation": {
      "before": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation.",
      "after": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation."
    },
    "demographics": "Exact original named age/sex retained in one constrained profile.",
    "questionAndOptions": "Exact original stem, current update, exhibit, choices/keys/rationales and explanation retained; no scored-text change.",
    "terminalDispositions": "Three formerly nonfinal nodes require final no-outcome dispositions in their new standalone wrappers. Reused exact distractor rationales plus the existing non-execution narrative; no clinical outcome added.",
    "priorFeedback": "No prior scored node or feedback is shown in the standalone case. The exact former full contexts remain frozen."
  }
}
```

</details>

<details open>
<summary>After: complete standalone case (key shown first for review only)</summary>

```json
{
  "id": "case.topic.critical-respiratory-ventilation.salvage-copd-niv.v1",
  "displayName": "Robert Diaz: outside-record review",
  "patientPresentationVariantId": "presentation.topic.critical-respiratory-ventilation.salvage-copd-niv.v1",
  "releasePointId": "release.l0.clinic_evaluation",
  "patientDisplayName": "Robert Diaz",
  "prototypeDemographics": {
    "ageYears": 70,
    "sexLabel": "Male"
  },
  "chiefComplaint": "Breathing follow-up",
  "presentation": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.topic.critical-respiratory-ventilation.salvage-copd-niv.v1",
      "prototypeDemographics": {
        "ageYears": 70,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Breathing follow-up",
      "presentation": "Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation."
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
      "id": "node.topic.critical-respiratory-ventilation.copd-niv.v2",
      "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-niv.v2",
      "primaryConceptId": "concept.critical-respiratory-ventilation.copd-niv.v1",
      "currentUpdate": "Hospital record: after inhaled bronchodilator treatment, Robert has respiratory rate 30/min with accessory-muscle use. He is alert and clears oral secretions. Blood pressure is 128/72 mm Hg.",
      "stem": "Which respiratory-support strategy best fits Robert Diaz’s initial hospital assessment?",
      "answerChoices": [
        {
          "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.niv",
          "label": "Start bilevel mask ventilation",
          "isCorrect": true,
          "rationale": "The change from compensated baseline hypercapnia to respiratory acidosis and distress supports a monitored bilevel trial.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.hfnc",
          "label": "Start high-flow nasal oxygen",
          "isCorrect": false,
          "rationale": "Oxygen delivery is not the recommended substitute for bilevel ventilatory assistance in the stated acidotic COPD exacerbation.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.intubate",
          "label": "Start invasive endotracheal ventilation",
          "isCorrect": false,
          "rationale": "Immediate invasive support is not the preferred first strategy for this alert patient without immediate deterioration.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "The baseline and current gases show a new acidotic ventilatory problem rather than elevated PaCO2 in isolation. ERS/ATS supports bilevel NIV for an acidotic COPD exacerbation in a patient not immediately deteriorating. The support choice depends on clinical state as well as the gas; this is not a pH-alone rule.",
      "exhibit": {
        "kind": "table",
        "caption": "Independently constructed outside-hospital record; fictional measurements",
        "columnHeaders": [
          "pH",
          "PaCO2",
          "PaO2",
          "Oxygen condition"
        ],
        "rowHeaders": [
          "Before illness",
          "Current arterial sample"
        ],
        "cells": [
          [
            "7.38",
            "50 mm Hg",
            "Not recorded",
            "Room air"
          ],
          [
            "7.28",
            "70 mm Hg",
            "62 mm Hg",
            "FiO2 0.28"
          ]
        ]
      },
      "sourceLabels": [
        "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.hfnc",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
          "clinicalRationale": "Oxygen delivery is not the recommended substitute for bilevel ventilatory assistance in the stated acidotic COPD exacerbation.",
          "sourceLabels": [
            "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
          ]
        },
        {
          "answerChoiceId": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.intubate",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The founder reviews the historical decision; no clinical intervention is simulated.",
          "clinicalRationale": "Immediate invasive support is not the preferred first strategy for this alert patient without immediate deterioration.",
          "sourceLabels": [
            "Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure"
          ]
        }
      ]
    }
  ],
  "learningSummary": "Review the historical observations and the reasoning for each recorded support decision."
}
```

</details>

<details>
<summary>Retained author reasoning, fairness limits, evidence and timing</summary>

```json
{
  "reasoning": {
    "interpretFindings": "Recognize the new acidotic ventilatory change against the compensated baseline and persistent effort after treatment.",
    "applyMeaning": "Use present alertness, secretion clearance and circulatory state to choose a noninvasive trial rather than oxygen-focused support or immediate intubation.",
    "closestCredibleError": "Choose oxygen support for the low oxygen tension while missing the acute ventilatory problem.",
    "decidingObservation": "New pH decline and PaCO2 rise despite treatment, with preserved alert interaction and secretion clearance.",
    "consequenceOfError": "Oxygen-only support may miss ventilatory failure, while automatic intubation may bypass a suitable NIV trial."
  },
  "deletionTest": "Removing baseline gases loses the acute-on-chronic inference; removing current airway/interaction observations loses the boundary with immediate invasive support. The neutral presentation supplies no selected support action.",
  "counterfactual": "If this initial assessment instead showed immediate deterioration, apnea or inability to manage secretions, invasive support would take priority over a mask trial.",
  "manualAuthorGate": {
    "kind": "manual_author_self_check",
    "checkedOn": "2026-11-11",
    "independent": false,
    "clinicalApproval": false,
    "coverTheKey": "Removed the shared presentation’s disclosure of initial mask support by placing this revised item in a separate neutral case. Baseline PaO2 is explicitly unrecorded in its own column. All three support options remain short named strategies without qualifiers.",
    "sameStageAndCategory": "Three respiratory-support strategies at the initial hospital assessment, with no word-matching disclosure in the presentation.",
    "twoConsequentialSteps": "Recognize the new acidotic ventilatory change against the compensated baseline and persistent effort after treatment. Then Use present alertness, secretion clearance and circulatory state to choose a noninvasive trial rather than oxygen-focused support or immediate intubation.",
    "residentDifficulty": "Fair moderate: the original gas-plus-airway reasoning is retained after removing the answer leak and the mixed missing-value cell.",
    "singleBestAnswer": "New pH decline and PaCO2 rise despite treatment, with preserved alert interaction and secretion clearance. Counterfactual: If this initial assessment instead showed immediate deterioration, apnea or inability to manage secretions, invasive support would take priority over a mask trial.",
    "residualConcern": "Fairness and clinical ranking require independent review; no author PASS or measured difficulty asserted."
  },
  "choiceRubric": [
    {
      "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.niv",
      "temptation": "Use the baseline comparison and current clinical state.",
      "correctUnder": "The supplied acidotic COPD exacerbation without immediate deterioration."
    },
    {
      "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.hfnc",
      "temptation": "Focus on oxygen tension rather than the new ventilatory problem.",
      "correctUnder": "A selected oxygenation problem without the supplied acidotic ventilatory failure."
    },
    {
      "id": "choice.topic.critical-respiratory-ventilation.copd-niv.v2.intubate",
      "temptation": "Treat every elevated PaCO2 or acidotic value as an automatic intubation indication.",
      "correctUnder": "Immediate deterioration or failure of an appropriate monitored trial."
    }
  ],
  "originalReview": {
    "id": "question.topic.critical-respiratory-ventilation.copd-niv.v2",
    "nodeId": "node.topic.critical-respiratory-ventilation.copd-niv.v2",
    "title": "Initial support for an acidotic COPD exacerbation",
    "verdict": "PASS",
    "difficulty": "moderate",
    "twoStep": true,
    "highYield": true,
    "clarityIssues": [],
    "cues": [],
    "fairness": [
      "The baseline and current gases distinguish compensated baseline hypercapnia from an acute acidotic change. Persistent distress after bronchodilator treatment, preserved alertness/clearance and stable blood pressure support an initial monitored bilevel-mask strategy.",
      "High-flow oxygen does not provide the same ventilatory treatment for this acidotic exacerbation. Immediate invasive ventilation is not the preferred first offered strategy in the supplied alert, hemodynamically stable patient with adequate airway function. Both are plausible support-stage errors rather than grammatical foils.",
      "The explanation appropriately avoids a pH-only rule. No confident clinical inaccuracy identified; exact guideline statements were not newly verified offline.",
      "Predicted moderate, toward the easier end: integrate acute-on-chronic gas change and airway/clinical state, then choose the support route. This is a central, commonly tested respiratory-support concept.",
      "The COPD diagnosis is appropriate context for a management task. The neutral presentation no longer reveals initial mask support. All three options are parallel, specific support strategies without a conspicuous wording or length outlier. The item stands independently."
    ],
    "suggestions": []
  },
  "standaloneContextCheck": {
    "scope": "Standalone clinic record wrapper only; no new clinical facts, key or options.",
    "selfContained": "The unchanged update and table supply treatment phase, acute-versus-baseline gases and current airway/circulatory state. The neutral COPD clinic frame remains unchanged.",
    "priorFeedbackDependency": "None. All observations used by the original key are repeated in the unchanged update/exhibit.",
    "cueDisposition": "Neutral named-patient outside-record presentation; no new answer-bearing clinical observation added. Original reviewed difficulty and fairness assessment retained for reviewer context.",
    "identityDecision": "Unchanged question, node and concept IDs. New case/presentation/profile IDs distinguish the standalone context. Independent context review is pending.",
    "terminalMetadata": "Three formerly nonfinal nodes require final no-outcome dispositions in their new standalone wrappers. Reused exact distractor rationales plus the existing non-execution narrative; no clinical outcome added."
  },
  "clinicalStatementMappings": [
    {
      "field": "currentUpdate",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-copd"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "exhibit",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-copd"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "task",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-copd"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "explanation",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-copd"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[0].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-copd"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[1].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-copd"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    },
    {
      "field": "choices[2].rationale",
      "evidenceClaimIds": [
        "claim.critical-respiratory-ventilation.niv-copd"
      ],
      "constructedDataBasis": "Fictional patient observations, acquisition conditions and chronology; no empirical rate, new cutoff, fixed wait or demographic weight."
    }
  ],
  "evidenceClaimIds": [
    "claim.critical-respiratory-ventilation.niv-copd"
  ],
  "timingProposal": {
    "caseId": "case.topic.critical-respiratory-ventilation.salvage-copd-niv.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.copd-niv.v2",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-niv.v2",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

</details>

## Provenance, identities and remaining approvals

All question/node/concept IDs and existing evidence assertions are reused. Full source records, rights/access findings and 27 atomic claims remain in [the source ledger](sources-question-topic-critical-respiratory-ventilation-20261111.json); `salvageMappings` connects each new context to its unchanged claims and source IDs. The 13 source records, claim text, original check/access dates and evidence limitations are unchanged. No network retrieval or new factual verification was needed for this wrapper-only transformation.

The two accepted cases are pinned in `acceptedFreeze` and their shared source files by `inputHashes`; focused tests verify both. Earlier mixed-case compositions are retained in `originalExportedCases` and `retainedMixedCases`; the original planned-extubation context hold remains intact. New standalone contexts require independent review. There are no new design approvals requested. Existing clinical decisions and named-clinician approval remain:

```json
[
  {
    "id": "review.n3.ards-weight-change-versus-tidal-volume-basis.v2",
    "kind": "owner_decision",
    "recordFile": "docs/research/question-new-n3-round4-20261110.json",
    "reason": "The weight-basis fact does not support an exact ventilator adjustment. A pressure-limited bedside order would be a useful new practical objective if the key is confirmed.",
    "match": {
      "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1"
    },
    "ownerQuestion": "In ARDS with tidal volume already at 6 mL/kg predicted body weight and plateau pressure still 32 cm H2O, should the keyed next change be a lower tidal volume rather than waiting for diuresis to lower the scale weight?",
    "primaryTopicSlug": "critical-respiratory-ventilation",
    "inventoryRecordIds": [
      "inventory.8ad385e711985bf9"
    ],
    "affectedDraftQuestionVariantId": "question.topic.critical-respiratory-ventilation.ards-pressure-limit.v1",
    "currentDisposition": "CARRY FORWARD. New sources directly support a lower-volume proposal, but do not constitute Melissa’s resolution. Original exact version and new successor remain on hold.",
    "competingActions": [
      "Reduce 300 mL to 250 mL with repeat mechanics/gas assessment",
      "Maintain 300 mL while waiting for diuresis"
    ],
    "preciseQuestion": "For this exact 50-kg-PBW record already at 6 mL/kg, passive plateau 32 and pH 7.36, approve or reject the next order of 250 mL rather than maintaining 300 mL pending fluid loss?"
  },
  {
    "id": "owner.critical-respiratory-ventilation.delivery-flow-ranking",
    "kind": "clinical_key_review",
    "affectedDraftQuestionVariantId": "question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v2",
    "competingActions": [
      "Transthoracic Doppler echocardiography",
      "Passive leg raising with stroke-volume monitoring",
      "Calibrated arterial waveform analysis"
    ],
    "evidenceBoundary": "A fall in flow is established, but equally novel assessment methods address different unresolved questions. No unique priority is supported by the record; the attempt is unkeyed and parked.",
    "preciseQuestion": "What patient-specific unresolved clinical question would make one of these flow/function/preload assessments the necessary next step? Without that boundary, keep this attempt unkeyed and parked."
  },
  {
    "id": "owner.critical-respiratory-ventilation.conditional-support",
    "kind": "clinical_key_review",
    "affectedDraftQuestionVariantIds": [
      "question.topic.critical-respiratory-ventilation.sbt-fio2.v2",
      "question.topic.critical-respiratory-ventilation.extubation-clearance.v2",
      "question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
      "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1"
    ],
    "competingActions": [
      "Repeat unchanged-FiO2 SBT versus extubation after a higher-FiO2 trial",
      "Immediate preventive bilevel support versus standard oxygen",
      "Reintubation versus rescue NIV in the non-COPD medical record"
    ],
    "evidenceBoundary": "Conditional guidance; SBT oxygen recommendation is very low certainty, post-extubation NIV guidance is population-specific and low certainty.",
    "preciseQuestion": "Confirm the exact conditional SBT oxygen/support-method and low-risk versus high-risk post-extubation boundaries. The two passed NIV versions remain exact editorial PASS, not clinical sign-off."
  }
]
```

## Exact validation

Working directory: `packages/clinical-content`.

`npm.cmd test -- --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts` — exit 0.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  14:24:24
   Duration  578ms (transform 253ms, setup 0ms, import 401ms, tests 58ms, environment 0ms)

```

`npm.cmd run typecheck` — exit 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-ship-case-replacements.ts(63,21): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: "synthetic_unapproved_prototype"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: "anatomy" | ... 5 more ... | "workup"; }[]; cases: { ...; }[]; }; }'.
  No index signature with a parameter of type 'string' was found on type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: "synthetic_unapproved_prototype"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: "anatomy" | ... 5 more ... | "workup"; }[]; cases: { ...; }[]; }; }'.
src/question-ship-case-replacements.ts(63,60): error TS7006: Parameter 'clinicalCase' implicitly has an 'any' type.
src/question-ship-case-replacements.ts(70,63): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(70,98): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(72,32): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(74,28): error TS2345: Argument of type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; } | undefined' is not assignable to parameter of type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.
  Type 'undefined' is not assignable to type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

Only out-of-lane question-ship-case-replacements.ts diagnostics remain in the recorded latest run: (63,21) TS7053; (63,60) TS7006; (70,63), (70,98), (72,32) TS18048; (74,28) TS2345. No shared or other-topic file edited. The first check also caught the owned test union-access error; it was corrected and is absent from the rerun. Earlier exact output is retained in `salvageRound.validation.earlierRuns`. Concurrent shock/pancreas diagnostics in the earlier run cleared before this recorded rerun; their files were untouched.

Owned JSON parse, exit 0:

```text
JSON.parse PASS docs/research/question-topic-critical-respiratory-ventilation-20261111.json
JSON.parse PASS docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json
```

Structural tests are not clinical approval. Shared integration, assembled-release tests and publication remain manager-owned.

## Final bounded handoff

```text
Topic critical-respiratory-ventilation
Files changed
  packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.ts
  packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.test.ts
  docs/research/question-topic-critical-respiratory-ventilation-20261111.json
  docs/research/question-topic-critical-respiratory-ventilation-20261111.md
  docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json
Inventory original 20 exact assigned variants; historical manifest 145 / 1151 cases / 1462 nodes / 610 concepts. Acceptance batch 1 receipt supplies this salvage scope.
Counts audited 4 skipped PASS, kept exact 4 question/node/concept meanings, rewritten 0 scored items, retired 0, new 4 standalone cases and 0 questions/concepts. Original audit totals: audited 20, kept 0, rewritten 5, retired-and-replaced proposed 15, new 9 (historical).
Count basis 4 skipped exact PASS variants -> 4 standalone case/node contexts. Accepted nodes touched 0. Companion rewrites 0.
Held/unkeyed unchanged prior owner holds and parked items; no hold lifted.
Research reused 13 sources / 27 claims; new sources 0, new claims 0; existing conditional/low-certainty limits retained.
Packet docs/research/question-topic-critical-respiratory-ventilation-20261111.md; matching topic JSON; sources-question-topic-critical-respiratory-ventilation-20261111.json
Identity preservation exact question/node/concept IDs, scored clinical fields/options and two accepted cases; new case/presentation/profile IDs only. Three nodes gain non-execution final metadata.
Owner approvals needed no new design decision. Independent review of four standalone contexts; existing clinical holds and Melissa clinical approval persist.
Integration manager decides later acceptance/shared timing/manifest binding; existing clinic runtime framing; no shared edit.
Validation focused npm.cmd test -- --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts exit 0, 1 file / 15 passed / 0 failed. npm.cmd run typecheck exit 1: shared question-ship-case-replacements.ts only, no respiratory diagnostics. Two owned JSON parses exit 0. Exact output above and in JSON.
Open work reviewer rechecks only status salvage; manager resolves shared typecheck errors and decides exact acceptance/integration. No commit/push/deploy.
```

<details>
<summary>Prior independent-review response and original assignment/audit (historical, preserved)</summary>

# Critical care — respiratory failure and ventilation: independent-review response

**Current response, 2026-11-11. All clinical content remains needs_clinician_review. Key shown first for review only.**

## Assignment and scope

Wave 2, topic `critical-respiratory-ventilation` — Critical care — respiratory failure and ventilation. Oxygen delivery/ventilation, respiratory failure, ARDS, ventilator waveform/pressure interpretation, weaning and airway-support complications.

Scope out: Sedative/toxicologic reversal belongs to anesthesia-analgesia-pharmacology. Primary acid-base calculations belong to fluids-electrolytes-acid-base. Thoracic procedures belong to thoracic-lung-pleura-mediastinum. Priority high: A few mechanism and weight-basis cards leave bedside ventilator decisions thin.

Original baseline and exact assignment remain unchanged: default manifest v9, 145 rows; 1,151 cases / 1,462 nodes / 610 concepts. The original 20 assigned exact variants remain audited; original source files, histories, saves, selector and shared manifests/registries are untouched. This response writes only the five owned topic files.

<details>
<summary>Complete original assignment, ownership, holds and hashes</summary>

```json
{
  "topic": {
    "slug": "critical-respiratory-ventilation",
    "title": "Critical care — respiratory failure and ventilation",
    "priority": "high",
    "scopeIn": "Oxygen delivery/ventilation, respiratory failure, ARDS, ventilator waveform/pressure interpretation, weaning and airway-support complications.",
    "scopeOut": "Sedative/toxicologic reversal belongs to anesthesia-analgesia-pharmacology. Primary acid-base calculations belong to fluids-electrolytes-acid-base. Thoracic procedures belong to thoracic-lung-pleura-mediastinum.",
    "priorityReason": "A few mechanism and weight-basis cards leave bedside ventilator decisions thin.",
    "researchAgenda": [
      "Pressure/waveform changes and ventilator action",
      "Oxygen content versus saturation",
      "Weaning failure and respiratory rescue"
    ],
    "counts": {
      "liveConcepts": 3,
      "liveNodes": 12,
      "liveCases": 12,
      "liveVariants": 12,
      "liveAcceptedNodes": 0,
      "liveOriginalNodes": 12,
      "registeredConcepts": 6,
      "registeredWithoutLiveNodes": 3,
      "drafts": 8,
      "draftVariants": 8,
      "draftConcepts": 5,
      "explicitOwnerHeldVersions": 1,
      "unassembledDraftVariants": 0,
      "unkeyedParkedSlots": 0,
      "withheldTeachingPoints": 0,
      "liveClinicalConcepts": 3
    },
    "coverageSignal": "thin",
    "coverageReason": "At most four distinct live clinical concept identities cover this scope. Variants repeat those identities.",
    "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
    "workerLane": [
      "packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.ts",
      "packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.test.ts",
      "docs/research/question-topic-critical-respiratory-ventilation-20261111.json",
      "docs/research/question-topic-critical-respiratory-ventilation-20261111.md",
      "docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json"
    ],
    "wave": 2
  },
  "wave": 2,
  "activeManagerPlan": "docs/research/question-topic-program-20261111.md; wave 2; docs/handoffs/CURRENT_THREAD_HANDOFF.md read only",
  "programId": "question-topic-program.2026-11-11.v1",
  "generatedAt": "2026-11-11T15:41:40.423Z",
  "snapshotCapturedAt": "2026-11-11T15:28:05.732Z",
  "release": {
    "id": "clinical.synthetic.prototype.v1",
    "manifestId": "question-ship.2026-11-10.v9",
    "manifestFile": "packages/clinical-content/src/question-ship-manifest.ts",
    "assemblyFile": "packages/clinical-content/src/synthetic-content.ts",
    "assemblyExport": "SYNTHETIC_CLINICAL_RELEASE",
    "catalogRegistryMeaning": "610 registered concept identities include 156 with no live node. Active coverage uses the 454 primaryConceptId identities actually scored in default-release nodes."
  },
  "inventory": [
    {
      "recordId": "inventory.1b7f06337687230c",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "caseId": "case.gs028d.ards.a-aspiration-protein-fluid",
      "nodeIds": [
        "node.gs028d.ards.a-aspiration-protein-fluid.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v2"
      ],
      "chiefComplaint": "Breathing recovery visit",
      "taskTextShort": "Which change at the lung barrier most directly produced this patient's ARDS-associated edema?",
      "taskText": "Which change at the lung barrier most directly produced this patient's ARDS-associated edema?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.permeability-edema"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.a-aspiration-protein-fluid.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.5571d987823c6f1c",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "caseId": "case.gs028d.ards.a-pancreatitis-noncardiogenic",
      "nodeIds": [
        "node.gs028d.ards.a-pancreatitis-noncardiogenic.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v3"
      ],
      "chiefComplaint": "Hospital record review",
      "taskTextShort": "Which mechanism supports the hospital team's classification of this patient's edema as ARDS rather than isolated cardiogenic edema?",
      "taskText": "Which mechanism supports the hospital team's classification of this patient's edema as ARDS rather than isolated cardiogenic edema?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.permeability-edema"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.a-pancreatitis-noncardiogenic.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.584fc666ca77beec",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "caseId": "case.gs028d.ards.a-pneumonia-barrier",
      "nodeIds": [
        "node.gs028d.ards.a-pneumonia-barrier.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v1"
      ],
      "chiefComplaint": "ICU record question",
      "taskTextShort": "Which pathophysiologic mechanism best explains the pulmonary edema documented during this patient's ARDS admission?",
      "taskText": "Which pathophysiologic mechanism best explains the pulmonary edema documented during this patient's ARDS admission?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.permeability-edema"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.a-pneumonia-barrier.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.d6fe809ea31f1210",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "caseId": "case.gs028d.ards.a-sepsis-endothelial-injury",
      "nodeIds": [
        "node.gs028d.ards.a-sepsis-endothelial-injury.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v4"
      ],
      "chiefComplaint": "Post-ICU questions",
      "taskTextShort": "Which physiologic process best answers the family's question about this patient's ARDS-related lung edema?",
      "taskText": "Which physiologic process best answers the family's question about this patient's ARDS-related lung edema?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.permeability-edema"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.a-sepsis-endothelial-injury.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.500b000f023b4fe5",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "caseId": "case.gs028d.ards.b-after-diuresis",
      "nodeIds": [
        "node.gs028d.ards.b-after-diuresis.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v4"
      ],
      "chiefComplaint": "Discharge ventilation review",
      "taskTextShort": "Which body-weight measure provides the consistent basis for reviewing this patient's ARDS tidal-volume selection across those fluid shifts?",
      "taskText": "Which body-weight measure provides the consistent basis for reviewing this patient's ARDS tidal-volume selection across those fluid shifts?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.predicted-body-weight-ventilation"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.b-after-diuresis.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.9ee95d2c54ebf09f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "caseId": "case.gs028d.ards.b-edema-weight-gain",
      "nodeIds": [
        "node.gs028d.ards.b-edema-weight-gain.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v2"
      ],
      "chiefComplaint": "ICU chart follow-up",
      "taskTextShort": "Which body-weight measure should the reviewer use to assess the tidal-volume basis despite this patient's acute fluid gain?",
      "taskText": "Which body-weight measure should the reviewer use to assess the tidal-volume basis despite this patient's acute fluid gain?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.predicted-body-weight-ventilation"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.b-edema-weight-gain.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.959306070c2a6f2a",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "caseId": "case.gs028d.ards.b-low-actual-weight",
      "nodeIds": [
        "node.gs028d.ards.b-low-actual-weight.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v3"
      ],
      "chiefComplaint": "Recovery chart question",
      "taskTextShort": "Which body-weight measure should be used when judging whether the recorded tidal-volume strategy followed the ARDS ventilation principle?",
      "taskText": "Which body-weight measure should be used when judging whether the recorded tidal-volume strategy followed the ARDS ventilation principle?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.predicted-body-weight-ventilation"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.b-low-actual-weight.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.8fdd1a516c05a3e8",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "caseId": "case.gs028d.ards.b-obesity-ventilator-audit",
      "nodeIds": [
        "node.gs028d.ards.b-obesity-ventilator-audit.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v1"
      ],
      "chiefComplaint": "Ventilator record review",
      "taskTextShort": "Which body-weight measure should anchor the tidal-volume review for this patient's ARDS ventilation?",
      "taskText": "Which body-weight measure should anchor the tidal-volume review for this patient's ARDS ventilation?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.predicted-body-weight-ventilation"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.b-obesity-ventilator-audit.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.08016092c7d763fc",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "caseId": "case.gs028f.oxygen-content.c1-anemia-normal-clip",
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-anemia-normal-clip.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v1"
      ],
      "chiefComplaint": "Blood count clarification",
      "taskTextShort": "Why can this patient's normal SpO2 coexist with reduced oxygen-carrying content?",
      "taskText": "Why can this patient's normal SpO2 coexist with reduced oxygen-carrying content?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
        "line": 10,
        "export": "OXYGEN_CONTENT_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 17,
          "export": "GS028_20261007_VARIETY2_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 55,
          "export": "GS028_20261007_VARIETY2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028f.oxygen.saturation-fraction",
        "claim.gs028f.oxygen.hemoglobin-carriage",
        "claim.gs028f.oxygen.anemia-content-limit"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028f.oxygen-content.c1-anemia-normal-clip.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.66e27d0e1a5cafc9",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "caseId": "case.gs028f.oxygen-content.c1-display-fields",
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-display-fields.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v3"
      ],
      "chiefComplaint": "Finger clip interpretation",
      "taskTextShort": "Which blood quantity is absent from this patient's listed pulse-oximeter display?",
      "taskText": "Which blood quantity is absent from this patient's listed pulse-oximeter display?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
        "line": 10,
        "export": "OXYGEN_CONTENT_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 17,
          "export": "GS028_20261007_VARIETY2_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 55,
          "export": "GS028_20261007_VARIETY2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028f.oxygen.clip-display-limit",
        "claim.gs028f.oxygen.hemoglobin-carriage",
        "claim.gs028f.oxygen.anemia-content-limit"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028f.oxygen-content.c1-display-fields.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.2defb189847317e1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "caseId": "case.gs028f.oxygen-content.c1-reassurance-note",
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-reassurance-note.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v4"
      ],
      "chiefComplaint": "Anemia note review",
      "taskTextShort": "Which interpretation of this patient's normal SpO2 and reduced hemoglobin is incorrect?",
      "taskText": "Which interpretation of this patient's normal SpO2 and reduced hemoglobin is incorrect?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
        "line": 10,
        "export": "OXYGEN_CONTENT_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 17,
          "export": "GS028_20261007_VARIETY2_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 55,
          "export": "GS028_20261007_VARIETY2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028f.oxygen.saturation-fraction",
        "claim.gs028f.oxygen.hemoglobin-carriage",
        "claim.gs028f.oxygen.anemia-content-limit",
        "claim.gs028f.oxygen.clip-display-limit"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028f.oxygen-content.c1-reassurance-note.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.537f79c201c400c1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "caseId": "case.gs028f.oxygen-content.c1-same-fraction",
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-same-fraction.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v2"
      ],
      "chiefComplaint": "Oxygen number question",
      "taskTextShort": "Which combination matches this patient's unchanged saturation and reduced hemoglobin?",
      "taskText": "Which combination matches this patient's unchanged saturation and reduced hemoglobin?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
        "line": 10,
        "export": "OXYGEN_CONTENT_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 17,
          "export": "GS028_20261007_VARIETY2_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 55,
          "export": "GS028_20261007_VARIETY2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028f.oxygen.saturation-fraction",
        "claim.gs028f.oxygen.hemoglobin-carriage",
        "claim.gs028f.oxygen.anemia-content-limit"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028f.oxygen-content.c1-same-fraction.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.9c7c97cb675b4a16",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
      "caseId": "case.n1.hemoglobin-measurement.v1",
      "nodeIds": [
        "node.n1.hemoglobin-measurement.v1"
      ],
      "variantIds": [
        "question.n1.hemoglobin-measurement.v1"
      ],
      "chiefComplaint": "Postoperative fatigue",
      "taskTextShort": "Which investigation should be arranged next for {patientName}'s postoperative fatigue?",
      "taskText": "Which investigation should be arranged next for {patientName}'s postoperative fatigue?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
        "line": 36,
        "export": "QUESTION_NEW_N1_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 36,
          "export": "QUESTION_NEW_N1_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 46,
          "export": "QUESTION_NEW_N1_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n1.c3c167a7739f",
        "claim.n1.39e090dfc4f0",
        "claim.n1.47d310305029",
        "claim.n1.05bd95260a85"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n1.hemoglobin-measurement.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.8c3db096d36a1368",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
      "caseId": "case.n1.hemoglobin-measurement.v1",
      "nodeIds": [
        "node.n1.hemoglobin-measurement.v1"
      ],
      "variantIds": [
        "question.n1.hemoglobin-measurement.v2"
      ],
      "chiefComplaint": "Postoperative fatigue",
      "taskTextShort": "Which assessment should {patientName}'s team prioritize before attributing his fatigue to persistent pulmonary oxygenation failure?",
      "taskText": "Which assessment should {patientName}'s team prioritize before attributing his fatigue to persistent pulmonary oxygenation failure?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
        "line": 27,
        "export": "QUESTION_NEW_N1_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 27,
          "export": "QUESTION_NEW_N1_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 35,
          "export": "QUESTION_NEW_N1_ROUND2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n1.c3c167a7739f",
        "claim.n1.39e090dfc4f0",
        "claim.n1.47d310305029",
        "claim.n1.05bd95260a85"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n1.hemoglobin-measurement.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.f96fde9a7e92c352",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n1r3.oxygenation-red-cell-fatigue-workup",
      "caseId": "case.n1.hemoglobin-measurement.v1",
      "nodeIds": [
        "node.n1.hemoglobin-measurement.v1"
      ],
      "variantIds": [
        "question.n1.hemoglobin-measurement.v3"
      ],
      "chiefComplaint": "Postoperative fatigue",
      "taskTextShort": "Which assessment should {patientName}'s team prioritize for the current findings?",
      "taskText": "Which assessment should {patientName}'s team prioritize for the current findings?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
        "line": 34,
        "export": "QUESTION_NEW_N1_ROUND3_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 34,
          "export": "QUESTION_NEW_N1_ROUND3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 41,
          "export": "QUESTION_NEW_N1_ROUND3_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n1.c3c167a7739f",
        "claim.n1.39e090dfc4f0",
        "claim.n1.47d310305029",
        "claim.n1r3.acefc98ce84f"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n1.hemoglobin-measurement.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.617e60b07591c6d7",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n2.ventilator-elastic-versus-resistive-load",
      "caseId": "case.n2.ventilator-elastic-versus-resistive-load.v1",
      "nodeIds": [
        "node.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "variantIds": [
        "question.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "chiefComplaint": "Ventilation record review",
      "taskTextShort": "Which pressure-mechanics interpretation is supported by {patientName}'s controlled measurements?",
      "taskText": "Which pressure-mechanics interpretation is supported by {patientName}'s controlled measurements?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
        "line": 30,
        "export": "QUESTION_NEW_N2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 30,
          "export": "QUESTION_NEW_N2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 37,
          "export": "QUESTION_NEW_N2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n2.456c6686c997"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n2.ventilator-elastic-versus-resistive-load.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.7c365f1e947647b7",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n2.ventilator-elastic-versus-resistive-load",
      "caseId": "case.n2.ventilator-elastic-versus-resistive-load.v1",
      "nodeIds": [
        "node.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "variantIds": [
        "question.n2.ventilator-elastic-versus-resistive-load.v2"
      ],
      "chiefComplaint": "Ventilation review",
      "taskTextShort": "Which measurement should guide {patientName}'s next mechanical reassessment after the flow change?",
      "taskText": "Which measurement should guide {patientName}'s next mechanical reassessment after the flow change?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
        "line": 28,
        "export": "QUESTION_NEW_N2_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 28,
          "export": "QUESTION_NEW_N2_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 36,
          "export": "QUESTION_NEW_N2_ROUND2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n2.456c6686c997",
        "claim.n2r2.19f587fdd650"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n2.ventilator-elastic-versus-resistive-load.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.cdb263b7e25ee3d1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n2.ventilator-elastic-versus-resistive-load",
      "caseId": "case.n2.ventilator-elastic-versus-resistive-load.v1",
      "nodeIds": [
        "node.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "variantIds": [
        "question.n2.ventilator-elastic-versus-resistive-load.v3"
      ],
      "chiefComplaint": "Ventilation review",
      "taskTextShort": "What does the final recording establish for {patientName}'s proposed tidal-volume increase?",
      "taskText": "What does the final recording establish for {patientName}'s proposed tidal-volume increase?",
      "status": "draft parked",
      "retentionState": "explicit editorial park",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [
        "review.n2.ventilator-elastic-versus-resistive-load.v3"
      ],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
        "line": 43,
        "export": "QUESTION_NEW_N2_ROUND3_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 43,
          "export": "QUESTION_NEW_N2_ROUND3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 50,
          "export": "QUESTION_NEW_N2_ROUND3_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n2.456c6686c997",
        "claim.n2r2.19f587fdd650"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n2.ventilator-elastic-versus-resistive-load.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.a47b6f2fa1b68e8d",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n3.ards-weight-change-versus-tidal-volume-basis",
      "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "nodeIds": [
        "node.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      ],
      "variantIds": [
        "question.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      ],
      "chiefComplaint": "Ventilator record review",
      "taskTextShort": "Which weight basis should be used when reviewing {patientName}'s ARDS tidal-volume prescription through those fluid changes?",
      "taskText": "Which weight basis should be used when reviewing {patientName}'s ARDS tidal-volume prescription through those fluid changes?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
        "line": 28,
        "export": "QUESTION_NEW_N3_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 28,
          "export": "QUESTION_NEW_N3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 33,
          "export": "QUESTION_NEW_N3_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n3.92c3f176209c"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n3.ards-weight-change-versus-tidal-volume-basis.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.8ad385e711985bf9",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "nodeIds": [
        "node.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      ],
      "variantIds": [
        "question.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "chiefComplaint": "Ventilator record review",
      "taskTextShort": "Which interpretation and tidal-volume prescription best fit {patientName}'s current lung findings?",
      "taskText": "Which interpretation and tidal-volume prescription best fit {patientName}'s current lung findings?",
      "status": "held for owner",
      "retentionState": "explicit owner decision hold",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [
        "review.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
        "line": 33,
        "export": "QUESTION_NEW_N3_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 33,
          "export": "QUESTION_NEW_N3_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 39,
          "export": "QUESTION_NEW_N3_ROUND2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n3r2.fcdb2341f3b1",
        "claim.n3.92c3f176209c"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n3.ards-weight-change-versus-tidal-volume-basis.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    }
  ],
  "concepts": [
    {
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "displayName": "Permeability edema in ARDS",
      "learningObjective": "Identify increased alveolar-capillary permeability as the core mechanism of inflammatory pulmonary edema in ARDS.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.1b7f06337687230c",
        "inventory.5571d987823c6f1c",
        "inventory.584fc666ca77beec",
        "inventory.d6fe809ea31f1210"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 38,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 4,
          "export": "GS028_20261003_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "displayName": "Predicted body weight for ARDS ventilation",
      "learningObjective": "Use predicted body weight, not fluctuating actual weight, as the body-weight basis for ARDS tidal-volume selection.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.500b000f023b4fe5",
        "inventory.9ee95d2c54ebf09f",
        "inventory.959306070c2a6f2a",
        "inventory.8fdd1a516c05a3e8"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 138,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 4,
          "export": "GS028_20261003_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "displayName": "Distinguish saturation from oxygen content",
      "learningObjective": "Explain why a normal oxygen saturation does not establish adequate hemoglobin-dependent oxygen content or exclude supplied anemia.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.08016092c7d763fc",
        "inventory.66e27d0e1a5cafc9",
        "inventory.2defb189847317e1",
        "inventory.537f79c201c400c1"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 19,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 52,
          "export": "GS028_20261007_VARIETY2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
      "displayName": "Investigating oxygen-carrying capacity",
      "learningObjective": "Choose direct hemoglobin assessment when a normal pulse-oximeter result is being used to dismiss possible anemia.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.9c7c97cb675b4a16",
        "inventory.8c3db096d36a1368"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 23,
          "export": "QUESTION_NEW_N1_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 55,
          "export": "QUESTION_NEW_N1_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": true
    },
    {
      "conceptId": "concept.n1r3.oxygenation-red-cell-fatigue-workup",
      "displayName": "Postoperative fatigue with normal oxygenation",
      "learningObjective": "Interpret oxygenation and red-cell measurements together to prioritize evaluation of oxygen-carrying capacity.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.f96fde9a7e92c352"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 57,
          "export": "QUESTION_NEW_N1_ROUND3_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": true
    },
    {
      "conceptId": "concept.n2.ventilator-elastic-versus-resistive-load",
      "displayName": "Interpreting matched ventilator pressure changes",
      "learningObjective": "Distinguish increased elastic pressure requirements from isolated airway resistance using controlled peak and plateau pressure comparisons.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.617e60b07591c6d7",
        "inventory.7c365f1e947647b7",
        "inventory.cdb263b7e25ee3d1"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 20,
          "export": "QUESTION_NEW_N2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 57,
          "export": "QUESTION_NEW_N2_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 66,
          "export": "QUESTION_NEW_N2_ROUND3_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": true
    },
    {
      "conceptId": "concept.n3.ards-weight-change-versus-tidal-volume-basis",
      "displayName": "Ventilation after fluid-weight change",
      "learningObjective": "Distinguish rapidly changing actual weight from the body-size basis of tidal-volume selection when reassessing an ARDS prescription.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.a47b6f2fa1b68e8d"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 18,
          "export": "QUESTION_NEW_N3_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "displayName": "Ventilation after fluid-weight change",
      "learningObjective": "Recognize a permeability-edema context despite weight gain and choose the anthropometric weight basis for invasive ventilation.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.8ad385e711985bf9"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 53,
          "export": "QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    }
  ],
  "caseAssignments": [
    {
      "caseId": "case.gs028d.ards.a-aspiration-protein-fluid",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.1b7f06337687230c"
      ],
      "nodeIds": [
        "node.gs028d.ards.a-aspiration-protein-fluid.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.a-pancreatitis-noncardiogenic",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.5571d987823c6f1c"
      ],
      "nodeIds": [
        "node.gs028d.ards.a-pancreatitis-noncardiogenic.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.a-pneumonia-barrier",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.584fc666ca77beec"
      ],
      "nodeIds": [
        "node.gs028d.ards.a-pneumonia-barrier.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.a-sepsis-endothelial-injury",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.d6fe809ea31f1210"
      ],
      "nodeIds": [
        "node.gs028d.ards.a-sepsis-endothelial-injury.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.b-after-diuresis",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.500b000f023b4fe5"
      ],
      "nodeIds": [
        "node.gs028d.ards.b-after-diuresis.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.b-edema-weight-gain",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.9ee95d2c54ebf09f"
      ],
      "nodeIds": [
        "node.gs028d.ards.b-edema-weight-gain.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.b-low-actual-weight",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.959306070c2a6f2a"
      ],
      "nodeIds": [
        "node.gs028d.ards.b-low-actual-weight.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.b-obesity-ventilator-audit",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.8fdd1a516c05a3e8"
      ],
      "nodeIds": [
        "node.gs028d.ards.b-obesity-ventilator-audit.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028f.oxygen-content.c1-anemia-normal-clip",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.08016092c7d763fc"
      ],
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-anemia-normal-clip.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028f.oxygen-content.c1-display-fields",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.66e27d0e1a5cafc9"
      ],
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-display-fields.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028f.oxygen-content.c1-reassurance-note",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.2defb189847317e1"
      ],
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-reassurance-note.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028f.oxygen-content.c1-same-fraction",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.537f79c201c400c1"
      ],
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-same-fraction.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n1.hemoglobin-measurement.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.9c7c97cb675b4a16",
        "inventory.8c3db096d36a1368",
        "inventory.f96fde9a7e92c352"
      ],
      "nodeIds": [
        "node.n1.hemoglobin-measurement.v1"
      ],
      "variantIds": [
        "question.n1.hemoglobin-measurement.v1",
        "question.n1.hemoglobin-measurement.v2",
        "question.n1.hemoglobin-measurement.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n2.ventilator-elastic-versus-resistive-load.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.617e60b07591c6d7",
        "inventory.7c365f1e947647b7",
        "inventory.cdb263b7e25ee3d1"
      ],
      "nodeIds": [
        "node.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "variantIds": [
        "question.n2.ventilator-elastic-versus-resistive-load.v1",
        "question.n2.ventilator-elastic-versus-resistive-load.v2",
        "question.n2.ventilator-elastic-versus-resistive-load.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.a47b6f2fa1b68e8d",
        "inventory.8ad385e711985bf9"
      ],
      "nodeIds": [
        "node.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      ],
      "variantIds": [
        "question.n3.ards-weight-change-versus-tidal-volume-basis.v1",
        "question.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    }
  ],
  "nodeAssignments": [
    {
      "nodeId": "node.gs028d.ards.a-aspiration-protein-fluid.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.1b7f06337687230c"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.a-pancreatitis-noncardiogenic.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.5571d987823c6f1c"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.a-pneumonia-barrier.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.584fc666ca77beec"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.a-sepsis-endothelial-injury.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.d6fe809ea31f1210"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.b-after-diuresis.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.500b000f023b4fe5"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.b-edema-weight-gain.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.9ee95d2c54ebf09f"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.b-low-actual-weight.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.959306070c2a6f2a"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.b-obesity-ventilator-audit.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.8fdd1a516c05a3e8"
      ]
    },
    {
      "nodeId": "node.gs028f.oxygen-content.c1-anemia-normal-clip.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.08016092c7d763fc"
      ]
    },
    {
      "nodeId": "node.gs028f.oxygen-content.c1-display-fields.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.66e27d0e1a5cafc9"
      ]
    },
    {
      "nodeId": "node.gs028f.oxygen-content.c1-reassurance-note.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.2defb189847317e1"
      ]
    },
    {
      "nodeId": "node.gs028f.oxygen-content.c1-same-fraction.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.537f79c201c400c1"
      ]
    },
    {
      "nodeId": "node.n1.hemoglobin-measurement.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
        "concept.n1r3.oxygenation-red-cell-fatigue-workup"
      ],
      "inventoryRecordIds": [
        "inventory.9c7c97cb675b4a16",
        "inventory.8c3db096d36a1368",
        "inventory.f96fde9a7e92c352"
      ]
    },
    {
      "nodeId": "node.n2.ventilator-elastic-versus-resistive-load.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.ventilator-elastic-versus-resistive-load"
      ],
      "inventoryRecordIds": [
        "inventory.617e60b07591c6d7",
        "inventory.7c365f1e947647b7",
        "inventory.cdb263b7e25ee3d1"
      ]
    },
    {
      "nodeId": "node.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.ards-weight-change-versus-tidal-volume-basis",
        "concept.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "inventoryRecordIds": [
        "inventory.a47b6f2fa1b68e8d",
        "inventory.8ad385e711985bf9"
      ]
    }
  ],
  "variantAssignments": [
    {
      "variantId": "question.ards.permeability-edema-mechanism.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.584fc666ca77beec"
      ]
    },
    {
      "variantId": "question.ards.permeability-edema-mechanism.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.1b7f06337687230c"
      ]
    },
    {
      "variantId": "question.ards.permeability-edema-mechanism.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.5571d987823c6f1c"
      ]
    },
    {
      "variantId": "question.ards.permeability-edema-mechanism.v4",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.d6fe809ea31f1210"
      ]
    },
    {
      "variantId": "question.ards.predicted-body-weight-ventilation.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.8fdd1a516c05a3e8"
      ]
    },
    {
      "variantId": "question.ards.predicted-body-weight-ventilation.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.9ee95d2c54ebf09f"
      ]
    },
    {
      "variantId": "question.ards.predicted-body-weight-ventilation.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.959306070c2a6f2a"
      ]
    },
    {
      "variantId": "question.ards.predicted-body-weight-ventilation.v4",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.500b000f023b4fe5"
      ]
    },
    {
      "variantId": "question.gs028f.critical-care.normal-spo2-anemia-content.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.08016092c7d763fc"
      ]
    },
    {
      "variantId": "question.gs028f.critical-care.normal-spo2-anemia-content.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.537f79c201c400c1"
      ]
    },
    {
      "variantId": "question.gs028f.critical-care.normal-spo2-anemia-content.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.66e27d0e1a5cafc9"
      ]
    },
    {
      "variantId": "question.gs028f.critical-care.normal-spo2-anemia-content.v4",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.2defb189847317e1"
      ]
    },
    {
      "variantId": "question.n1.hemoglobin-measurement.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.oxygen-saturation-missing-hemoglobin-assessment"
      ],
      "inventoryRecordIds": [
        "inventory.9c7c97cb675b4a16"
      ]
    },
    {
      "variantId": "question.n1.hemoglobin-measurement.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.oxygen-saturation-missing-hemoglobin-assessment"
      ],
      "inventoryRecordIds": [
        "inventory.8c3db096d36a1368"
      ]
    },
    {
      "variantId": "question.n1.hemoglobin-measurement.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1r3.oxygenation-red-cell-fatigue-workup"
      ],
      "inventoryRecordIds": [
        "inventory.f96fde9a7e92c352"
      ]
    },
    {
      "variantId": "question.n2.ventilator-elastic-versus-resistive-load.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.ventilator-elastic-versus-resistive-load"
      ],
      "inventoryRecordIds": [
        "inventory.617e60b07591c6d7"
      ]
    },
    {
      "variantId": "question.n2.ventilator-elastic-versus-resistive-load.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.ventilator-elastic-versus-resistive-load"
      ],
      "inventoryRecordIds": [
        "inventory.7c365f1e947647b7"
      ]
    },
    {
      "variantId": "question.n2.ventilator-elastic-versus-resistive-load.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.ventilator-elastic-versus-resistive-load"
      ],
      "inventoryRecordIds": [
        "inventory.cdb263b7e25ee3d1"
      ]
    },
    {
      "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.ards-weight-change-versus-tidal-volume-basis"
      ],
      "inventoryRecordIds": [
        "inventory.a47b6f2fa1b68e8d"
      ]
    },
    {
      "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "inventoryRecordIds": [
        "inventory.8ad385e711985bf9"
      ]
    }
  ],
  "identityReuseNotes": [],
  "recordedHolds": [
    {
      "id": "review.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "kind": "owner_decision",
      "recordFile": "docs/research/question-new-n3-round4-20261110.json",
      "reason": "The weight-basis fact does not support an exact ventilator adjustment. A pressure-limited bedside order would be a useful new practical objective if the key is confirmed.",
      "match": {
        "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v2",
        "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      },
      "ownerQuestion": "In ARDS with tidal volume already at 6 mL/kg predicted body weight and plateau pressure still 32 cm H2O, should the keyed next change be a lower tidal volume rather than waiting for diuresis to lower the scale weight?",
      "inventoryRecordIds": [
        "inventory.8ad385e711985bf9"
      ]
    },
    {
      "id": "review.n2.ventilator-elastic-versus-resistive-load.v3",
      "kind": "editorial_revise_park",
      "recordFile": "docs/research/question-new-n2-source-hold-disposition-20261105.json",
      "reason": "Retained REVISE disposition in the N2 source-hold/acceptance ledger.",
      "match": {
        "variantId": "question.n2.ventilator-elastic-versus-resistive-load.v3"
      },
      "inventoryRecordIds": [
        "inventory.cdb263b7e25ee3d1"
      ]
    }
  ],
  "unkeyedDraftSlots": [],
  "withheldTeachingPoints": [],
  "ownerApprovalsNeeded": [
    {
      "id": "review.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "kind": "owner_decision",
      "recordFile": "docs/research/question-new-n3-round4-20261110.json",
      "reason": "The weight-basis fact does not support an exact ventilator adjustment. A pressure-limited bedside order would be a useful new practical objective if the key is confirmed.",
      "match": {
        "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v2",
        "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      },
      "ownerQuestion": "In ARDS with tidal volume already at 6 mL/kg predicted body weight and plateau pressure still 32 cm H2O, should the keyed next change be a lower tidal volume rather than waiting for diuresis to lower the scale weight?",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "inventoryRecordIds": [
        "inventory.8ad385e711985bf9"
      ]
    }
  ],
  "frozenPassAndClinicalApprovals": [
    {
      "disposition": "none_in_assigned_lane",
      "basis": "Program exact assigned rows have no editorial acceptance or named approval; original N1/N2/N3 independent reviews for assigned drafts all say REVISE. Adjacent PASS versions in those modules are out of lane and untouched.",
      "reviewFiles": [
        "docs/research/question-new-n1-review-20261104.json",
        "docs/research/question-new-n1-review2-20261104.json",
        "docs/research/question-new-n1-review3-20261104.json",
        "docs/research/question-new-n2-review-20261104.json",
        "docs/research/question-new-n2-review2-20261104.json",
        "docs/research/question-new-n2-review3-20261104.json",
        "docs/research/question-new-n3-review-20261105.json",
        "docs/research/question-new-n3-review2-20261105.json",
        "docs/research/question-new-n3-review3-20261105.json",
        "docs/research/question-new-n3-round4-review-20261110.json"
      ]
    }
  ],
  "sourceHashes": [
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
      "currentSha256": "d6ab496f44bf8442b40011d9433ec982b4c4895f67695da23b6b9f9b707cef9d",
      "snapshotSha256": "d6ab496f44bf8442b40011d9433ec982b4c4895f67695da23b6b9f9b707cef9d",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
      "currentSha256": "b4152db060d121aac083a2a1d47a8285e3dcbbeb42333da7616c2b2bdbad2511",
      "snapshotSha256": "b4152db060d121aac083a2a1d47a8285e3dcbbeb42333da7616c2b2bdbad2511",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
      "currentSha256": "0d917b6501740fabdad2360dc4fdc0c7e1d142ffad2c0a38769de83382c60303",
      "snapshotSha256": "0d917b6501740fabdad2360dc4fdc0c7e1d142ffad2c0a38769de83382c60303",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
      "currentSha256": "14af52c517d802fd02c10b51e7d3a93e6d4febf40272fb3d2f154d2bc21fe093",
      "snapshotSha256": "14af52c517d802fd02c10b51e7d3a93e6d4febf40272fb3d2f154d2bc21fe093",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
      "currentSha256": "f7a6cba0ecd17c1e0d437f73268a65bdd1d6d2c7e3c058e510e4e02fd37d44d5",
      "snapshotSha256": "f7a6cba0ecd17c1e0d437f73268a65bdd1d6d2c7e3c058e510e4e02fd37d44d5",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
      "currentSha256": "ef0f0ecadb8b46bbfdad31436d4f324d2221f064eb0f8c2545e5bfe33aec76bc",
      "snapshotSha256": "ef0f0ecadb8b46bbfdad31436d4f324d2221f064eb0f8c2545e5bfe33aec76bc",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
      "currentSha256": "90b905c378e0fa31a4f9bf003c62b0e7e5f820d069f417b61f4e5ca5c0a2493c",
      "snapshotSha256": "90b905c378e0fa31a4f9bf003c62b0e7e5f820d069f417b61f4e5ca5c0a2493c",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
      "currentSha256": "8c3e9b2f5d998b31d97414051911513ff4c5f1ed1581b1032210a37c5bf8bf25",
      "snapshotSha256": "8c3e9b2f5d998b31d97414051911513ff4c5f1ed1581b1032210a37c5bf8bf25",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
      "currentSha256": "b1558d6ad01cc14b99f53e498ed48e355d222aa4e04d51c9589fed03112f923a",
      "snapshotSha256": "b1558d6ad01cc14b99f53e498ed48e355d222aa4e04d51c9589fed03112f923a",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
      "currentSha256": "16c622e73d76a8b12a6c676de202ae31d166eb2c922848bc06f0514e5b7b2569",
      "snapshotSha256": "16c622e73d76a8b12a6c676de202ae31d166eb2c922848bc06f0514e5b7b2569",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-ship-manifest.ts",
      "currentSha256": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
      "snapshotSha256": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/synthetic-content.ts",
      "currentSha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
      "snapshotSha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
      "drift": false
    },
    {
      "file": "docs/clinical/question-authoring-standard.md",
      "currentSha256": "87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671",
      "snapshotSha256": "87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671",
      "drift": false
    },
    {
      "file": "docs/research/question-topic-worker-brief-template-20261111.md",
      "currentSha256": "59ca1edf7b3ff2ee443f45afd3e083a734627858d897468dd566aae47fea788e",
      "snapshotSha256": null,
      "drift": false
    },
    {
      "file": "docs/research/question-topic-program-20261111.json",
      "currentSha256": "a1c585199633d243bc8d7e2f166916e74253b6c4a1b1eeceb09efba871baf9e4",
      "snapshotSha256": null,
      "drift": false
    }
  ]
}
```

</details>

## Current progress and next action

Independent review: `docs/research/question-topic-critical-respiratory-ventilation-review-20261111.json`, SHA-256 `195c6d145dc0d3058df459967b0323709790158e9d69f85b39afc35a340b863a`. It covers **13 non-held candidates: 3 PASS and 10 REVISE**. The existing owner-held pressure-limit node was explicitly excluded and remains exact. No FAIL was returned.

Result: **3 pass-preserved, 8 revised, 2 returned attempts parked**, plus **1 pre-existing owner hold preserved**. Each returned item received one attempt. Revised questions use v2 IDs; no revised version is given an independent PASS. Three PASS authoring objects, normalized questions/nodes, timing, full case fields and complete visible contexts remain exact to their recorded hashes.

There are **11 candidate question/node definitions**. **Ten** assemble into **six existing-setting clinic cases**, three of them multi-decision. The remaining candidate is the passed COPD planned-extubation definition, available only with its exact frozen review context; it is not silently recomposed with the repaired earlier COPD questions. The returned PBW and flow attempts, and the existing owner hold, do not enter candidate exports.

Next action: manager inspects the actual diff and validation, obtains independent review of eight revised versions, resolves parked/clinical decisions, and preserves exact PASS contexts during any integration. No release acceptance or named clinical approval is inferred from this response.

## Per-item review dispositions

| Reviewed or excluded exact v1 | Review | Current status | After identity |
|---|---|---|---|
| `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1` | REVISE | **parked** | `question.topic.critical-respiratory-ventilation.ards-pbw-order.v2` |
| `question.topic.critical-respiratory-ventilation.ards-pressure-limit.v1` | excluded_owner_hold | **parked** (existing owner hold) | `question.topic.critical-respiratory-ventilation.ards-pressure-limit.v1` |
| `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1` | REVISE | **revised** | `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v2` |
| `question.topic.critical-respiratory-ventilation.pressure-assessment.v1` | REVISE | **revised** | `question.topic.critical-respiratory-ventilation.pressure-assessment.v2` |
| `question.topic.critical-respiratory-ventilation.secretion-response.v1` | REVISE | **revised** | `question.topic.critical-respiratory-ventilation.secretion-response.v2` |
| `question.topic.critical-respiratory-ventilation.expiratory-time.v1` | PASS | **pass-preserved** | `question.topic.critical-respiratory-ventilation.expiratory-time.v1` |
| `question.topic.critical-respiratory-ventilation.sbt-readiness.v1` | REVISE | **revised** | `question.topic.critical-respiratory-ventilation.sbt-readiness.v2` |
| `question.topic.critical-respiratory-ventilation.sbt-fio2.v1` | REVISE | **revised** | `question.topic.critical-respiratory-ventilation.sbt-fio2.v2` |
| `question.topic.critical-respiratory-ventilation.extubation-clearance.v1` | REVISE | **revised** | `question.topic.critical-respiratory-ventilation.extubation-clearance.v2` |
| `question.topic.critical-respiratory-ventilation.copd-niv.v1` | REVISE | **revised** | `question.topic.critical-respiratory-ventilation.copd-niv.v2` |
| `question.topic.critical-respiratory-ventilation.copd-niv-failure.v1` | REVISE | **revised** | `question.topic.critical-respiratory-ventilation.copd-niv-failure.v2` |
| `question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1` | PASS | **pass-preserved** | `question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1` |
| `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` | REVISE | **parked** | `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v2` |
| `question.topic.critical-respiratory-ventilation.postextubation-rescue.v1` | PASS | **pass-preserved** | `question.topic.critical-respiratory-ventilation.postextubation-rescue.v1` |

The original five Rewrite and fifteen Retire-and-replace proposals refer to the baseline-bank audit, not to acceptance of any returned topic draft. The JSON audit now also maps each original proposal to its current review disposition. A parked replacement never authorizes retirement of its live original.

## Exact PASS preservation

- **question.topic.critical-respiratory-ventilation.expiratory-time.v1**
  - Authoring SHA-256: `5b2cbe4323261a035b038229c55bcf2023082ce6dbc2a82327791bc0fbd0c09f`
  - Question SHA-256: `5b4f8e471107e27914c33786876debaaab37095ea4e2eac2a2f8a447126128ba`
  - Node SHA-256: `4490be93a10fd6dbf6efcf204ffc6fd1aa17338517e484e37ec7a4675b0c4059`
  - Timing SHA-256: `1da246f5f9d248d2915ae7eb76469832dcc5f6750f01767bffa061afa611eb5d`
  - Complete case SHA-256: `c1296e3619771e13fc9fc219d1a441748118d987872085bf83175c970c6d5e73`
  - Full visible-context SHA-256: `c0a78ff34915ad828566b5ef27e4b1f5fd05c85e6a24a2215a01cfbc550b1b8a`

- **question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1**
  - Authoring SHA-256: `77e004b60deaedced1c3e0fda80252019e3abacc573cabd6ce310cca7905f9f5`
  - Question SHA-256: `f61cf9b553ff9d4d19a463709e18789ac474382394418d1e94e14f5a306682e6`
  - Node SHA-256: `05cee31f0873301b3b095bdf56ebc30eb6b8623ae45e4b76eb72a4b3ca2eab13`
  - Timing SHA-256: `09b78437d1d835861e6df2a6d94ed7be3dfd706278584de536ebe87e337cf3d3`
  - Complete case SHA-256: `d1eaf8cab09fc64630bd4b8ab3f18f108492ba03dbccdbd151008c6391dd3a89`
  - Full visible-context SHA-256: `c7e7356c86f93cde5fbd6dcfff9900c383bcf83286e8880ff9e6e1738f2fdd4c`

- **question.topic.critical-respiratory-ventilation.postextubation-rescue.v1**
  - Authoring SHA-256: `4ebf39f40cb183b5c23c697306f46e9d110ae3cbc5c142f02b1446c666ac1951`
  - Question SHA-256: `03eec9661a0cc5f0d66eb1412d0b9d8cf02bb67703344ff760d2ace5ff407348`
  - Node SHA-256: `7a68de31f1a7b4d6f3029c3cadcb7402d52f44692908327c58d67a5e319f8ce6`
  - Timing SHA-256: `c879a13d4dd1893c230c4277c9a5ea829686f5237c6c11ff733f0355272906f2`
  - Complete case SHA-256: `3c3cc815bcb6a0f95455d353245de5020df249601d9c56ccad1a047e0b0fd496`
  - Full visible-context SHA-256: `8ca8f090cd182656d4d67fc9a020d6b73569358600953bb31afeaba4edd74ea6`

The full frozen definitions are in `reviewRound.passFreeze` and exported through `RESPIRATORY_TOPIC_PASS_FREEZE` / `RESPIRATORY_TOPIC_FROZEN_CASES`. The focused test compares every exact definition and hash. This is an editorial PASS for those exact versions, separate from Melissa Rowland’s clinical sign-off.

### COPD shared-context constraint

The passed planned-extubation item was reviewed with a shared presentation that disclosed initial mask support and with two earlier feedback blocks. Correcting that presentation for the returned initial question, or changing earlier feedback, would alter the passed visible context. The two repaired questions therefore form a new neutral case, `case.topic.critical-respiratory-ventilation.niv-reassessment.v2`. The original full case remains frozen as review evidence and is excluded from assembled candidate cases. Its returned companions are not readmitted through the freeze. Manager must obtain exact-context re-review before a new standalone or recomposed use of the passed later node.

## Returned-item attempts and complete after packets

Each before version is preserved in `reviewRound.originalProposedNodes`, `originalQuestionDefinitions`, `originalNodeDefinitions`, `originalCaseDefinitions`, original timing/order proposals and the historical v1 Markdown appendix below. Each response below records the actual repair or reason to park. No future finding is shown to an earlier revised decision.

### Initial ARDS tidal-volume order — parked

Before: `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1`; review says REVISE.

Review clarity issues: The task calls this an initial order although a 500-mL breath and plateau measurement have already been delivered. Distinguish selecting the first protective prescription from adjusting an established protective prescription. PBW is not expanded on first use. Residents will usually recognize it, but 'predicted body weight' is clearer than an unexplained worksheet abbreviation.

Review cue findings: Checked PBW — Only one of the three weights receives a validation adjective. Together with 'lung-protective ventilation plan', this gives the worksheet an answer-selecting label rather than requiring an independent interpretation. Set tidal volume to 300 mL / Set tidal volume to 450 mL / Set tidal volume to 540 mL — All three choices are the same multiplier applied to the three displayed weights. A reader can identify the shared multiplier from the numbers and then select the uniquely 'Checked' weight without knowing the prescription rule.

Response to fairness, clarity and suggestions: Expanded predicted body weight and removed Checked; temporal wording now selects the first protective protocol order without a prior protective prescription. Removed unused oxygen/pressure detail and the uniform three-weight multiplier pattern. The supported remaining item is still foundational, so it is parked rather than called two-step or given an invented basic acceptance.

**Park reason:** One repaired attempt resolves the timing/PBW label/cue issues, but the supported objective remains a single foundational weight-index calculation. A second meaningful decision would duplicate the separately owner-held pressure-limit objective or require a different supported construct. No basic exception is inferred.

Current exact version: `question.topic.critical-respiratory-ventilation.ards-pbw-order.v2`; node `node.topic.critical-respiratory-ventilation.ards-pbw-order.v2`; concept `concept.ards.predicted-body-weight-ventilation`. Previous topic version: `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1`.

Complaint: **Breathing recovery**. Nina Cole, 58, Female. Presentation: Nina Cole, a 58-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from an aspiration-related admission requiring invasive ventilation.

Current update: Hospital record: after intubation for ARDS, the team is selecting its first protocol-based protective tidal-volume prescription. The worksheet records the three body-mass measures below.

| Record | Predicted body weight | Pre-illness measured weight | Current measured weight |
|---|---|---|---|
| Body measurements | 50 kg | 75 kg | 90 kg |

Task: **Which first protective tidal-volume order best fits Nina Cole’s recorded ARDS ventilation plan?**

Key shown first for review only.

1. **Set tidal volume to 300 mL** — proposed key. Six mL/kg of predicted rather than measured mass gives this initial order.
   - Temptation: Apply the appropriate weight index.
   - Could be reasonable under: The supplied 50-kg predicted weight.
   - Testing preview: no testing choice.
2. **Set tidal volume to 450 mL**. This corresponds to the pre-illness measured mass rather than predicted lung-size indexing.
   - Temptation: Use an apparently more reliable dry scale value.
   - Could be reasonable under: A different supplied predicted weight of 75 kg with an appropriate response.
   - Testing preview: no testing choice.
3. **Set tidal volume to 600 mL**. This does not fit the initial protective PBW target supplied by the verified strategy.
   - Temptation: Choose a familiar larger adult breath without the prescribed index.
   - Could be reasonable under: A distinct supported context with a different calculated target.
   - Testing preview: no testing choice.

Explanation: An initial target of 6 mL/kg predicted body weight gives 300 mL for the supplied 50-kg value. This repaired form is fair foundational rule application; it does not create a second consequential inference and is therefore parked rather than represented as a moderate or hard resident item.

Objective: Select the initial ARDS tidal volume using PBW rather than fluid-dependent actual mass.

Interpret raw findings: Identify predicted rather than measured body mass for the initial ARDS prescription.

Apply their meaning: Apply the six-mL/kg initial target; this remains the same single-rule application, not an independently consequential second inference.

Closest error: Use pre-illness measured weight as the lung-size index.

Deciding observation: Predicted body weight is 50 kg, without an asymmetric validation adjective.

Consequence: Measured-weight indexing can overstate the intended volume.

Deletion test: Removed oxygenation/plateau values whose deletion did not alter the key. The remaining item is clear but foundational.

Counterfactual: A different predicted weight changes the calculated volume, but this is still one rule application rather than a care-changing response interpretation.

Manual five-part author gate (no independent PASS):

1. Expanded predicted body weight, removed Checked, clarified first protocol order versus emergency initial ventilation, and changed the three values so they are not all the same multiplier applied to the three displayed weights.
2. Three plain initial volume orders of comparable length.
3. Identify predicted rather than measured body mass for the initial ARDS prescription. Then Apply the six-mL/kg initial target; this remains the same single-rule application, not an independently consequential second inference.
4. Easy after fairness repair; no accepted basic exception exists. Parked under the manager’s fair-moderate-or-harder requirement.
5. Predicted body weight is 50 kg, without an asymmetric validation adjective. Counterfactual: A different predicted weight changes the calculated volume, but this is still one rule application rather than a care-changing response interpretation.

Sequence: Not included in the candidate ARDS rescue case; the owner-held pressure-limiting item remains unchanged.

Claim mapping: `claim.critical-respiratory-ventilation.permeability`, `claim.critical-respiratory-ventilation.pbw`, `claim.critical-respiratory-ventilation.protective-range`, `claim.critical-respiratory-ventilation.initial-six`. All measurements and chronology are independently constructed.

Current visible-context hash: `f9c91f634479b58c4203180a678f14951e2cc4f94f954abca38b18fd0bbad1ac`.

### Prone positioning after protective ventilation — revised

Before: `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1`; review says REVISE.

Review clarity issues: 'Which additional respiratory-support intervention' does not accommodate the option to continue the existing intervention. The task should ask for the next respiratory-support plan.

Review cue findings: additional respiratory-support intervention / Continue supine protective ventilation — Without medical knowledge, the task rules out the continuation option because it is not an additional intervention. This removes the intended continue-versus-escalate decision before the oxygenation data are interpreted.

Response to fairness, clarity and suggestions: Replaced additional intervention with a neutral next-support-plan task; continued supine care remains a real competitor. All clinical observations, support sequencing, safety findings and source-limited explanation are retained.

Current exact version: `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v2`; node `node.topic.critical-respiratory-ventilation.ards-prone-escalation.v2`; concept `concept.critical-respiratory-ventilation.ards-prone-escalation.v1`. Previous topic version: `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1`.

Complaint: **Breathing recovery**. Nina Cole, 58, Female. Presentation: Nina Cole, a 58-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from an aspiration-related admission requiring invasive ventilation.

Current update: Later hospital entry: after volume and PEEP adjustment, plateau pressure is 28 cm H2O. PaO2 remains 58 mm Hg on FiO2 0.80 and PEEP 12 cm H2O. Blood pressure is stable. The spine is stable and the abdomen is closed.

None.

Task: **Which respiratory-support plan should have been chosen next for Nina Cole at this recorded assessment?**

Key shown first for review only.

1. **Begin prolonged prone ventilation** — proposed key. Severe persistent oxygenation impairment after protective optimization supports proning before moving directly to extracorporeal support.
   - Temptation: Use both the oxygenation severity and completed optimization stage.
   - Could be reasonable under: The supplied persistent impairment without the stated contraindications.
   - Testing preview: no testing choice.
2. **Continue supine protective ventilation**. Protective settings should continue, but the persistent severe oxygenation impairment supports adding prone positioning rather than retaining the same position.
   - Temptation: Treat improved plateau as sufficient recovery despite the oxygen requirement.
   - Could be reasonable under: Substantially improved oxygenation above the prone-eligibility range on otherwise appropriate support, or a contraindication requiring another plan.
   - Testing preview: no testing choice.
3. **Begin venovenous ECMO cannulation**. ECMO is an important option for selected refractory cases; this record has not yet used the indicated prone strategy.
   - Temptation: Equate severe oxygenation impairment with exhaustion of conventional rescue.
   - Could be reasonable under: Persistent severe impairment after appropriate conventional rescue, assessed by an ECMO team.
   - Testing preview: no testing choice.

Explanation: Interpret oxygenation together with support: 58/0.80 is approximately 73 mm Hg. Persistent impairment on adjusted protective ventilation favors prone positioning. An improved plateau does not establish oxygenation recovery. ECMO requires assessment of refractory disease after conventional strategies.

Objective: Choose prone ventilation for persistent severe oxygenation impairment after protective optimization.

Interpret raw findings: Interpret persistent severe oxygenation impairment relative to the FiO2 after protective settings were adjusted.

Apply their meaning: Choose the next support stage between continued supine care, prone positioning and extracorporeal rescue.

Closest error: Continue supine care because plateau improved.

Deciding observation: PaO2 remains 58 on FiO2 0.80 with PEEP 12 despite adjusted protective support.

Consequence: An acceptable plateau can coexist with a missed oxygenation rescue need.

Deletion test: Deleting FiO2 loses the oxygenation-severity inference; deleting completed optimization loses the rescue stage. Positioning-safety observations remain necessary and are not removed to hide the key.

Counterfactual: If oxygenation improved above the prone-eligibility range at the same protective settings, continuing supine care would become reasonable; persistent refractory disease after conventional rescue supports ECMO assessment.

Manual five-part author gate (no independent PASS):

1. Removed “additional intervention,” which linguistically eliminated continuation. Covered the key and re-read all three concrete support plans: none is excluded by the neutral next-plan task; the oxygenation/support observations must rank continuation, proning and ECMO.
2. Three named respiratory-support plans at the same escalation point; continued supine protection remains a real choice.
3. Interpret persistent severe oxygenation impairment relative to the FiO2 after protective settings were adjusted. Then Choose the next support stage between continued supine care, prone positioning and extracorporeal rescue.
4. Moderate/hard: the existing clinically consequential chain is retained after eliminating the task shortcut.
5. PaO2 remains 58 on FiO2 0.80 with PEEP 12 despite adjusted protective support. Counterfactual: If oxygenation improved above the prone-eligibility range at the same protective settings, continuing supine care would become reasonable; persistent refractory disease after conventional rescue supports ECMO assessment.

Sequence: Detached from the parked PBW and owner-held pressure-adjustment drafts. The current update itself supplies all pressure, support and response data; no future or preceding keyed explanation is required.

Claim mapping: `claim.critical-respiratory-ventilation.prone`, `claim.critical-respiratory-ventilation.protective-range`. All measurements and chronology are independently constructed.

Current visible-context hash: `66c8159c83980231499d05224b8db1615fbfb6c3900f7ddaafd0781f6fbffddd`.

### Assessment of a peak-pressure rise — revised

Before: `question.topic.critical-respiratory-ventilation.pressure-assessment.v1`; review says REVISE.

Review clarity issues: None separately listed.

Review cue findings: peak-pressure rise / Measure an end-inspiratory occlusion pressure — The key is the only option that explicitly measures a pressure, matching the task's requested problem. The alternatives are anatomical examinations. This is a wording/category advantage even though all three are assessments.

Response to fairness, clarity and suggestions: Replaced one pressure test versus invasive anatomical examinations with three specific bedside pressure reassessments and identical timing profiles. A controlled peak/plateau trajectory followed by a changed-flow peak improvement now determines which reassessment is relevant to a pending volume decision. Measured total PEEP is supplied, so the competing expiratory measurement is evaluated rather than silently omitted.

Current exact version: `question.topic.critical-respiratory-ventilation.pressure-assessment.v2`; node `node.topic.critical-respiratory-ventilation.pressure-assessment.v2`; concept `concept.n2.ventilator-elastic-versus-resistive-load`. Previous topic version: `question.topic.critical-respiratory-ventilation.pressure-assessment.v1`.

Complaint: **Ventilation questions**. Diane Foster, 63, Female. Presentation: Diane Foster, a 63-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from the ventilated phase of her pneumonia admission.

Current update: Hospital record: a clinician proposes increasing delivered tidal volume after the peak-pressure display falls. The measurements below were obtained during passive volume control with the same delivered volume and measured total PEEP of 8 cm H2O.

| Record | Peak pressure | Plateau pressure | Inspiratory flow |
|---|---|---|---|
| Earlier | 34 cm H2O | 18 cm H2O | 90 L/min |
| After the pressure rise | 42 cm H2O | 26 cm H2O | 90 L/min |
| After the flow change | 32 cm H2O | 26 cm H2O | 30 L/min |

Task: **Which bedside reassessment best evaluates Diane Foster’s proposed tidal-volume increase after this flow change?**

Key shown first for review only.

1. **Reassess passive plateau at matched volume and total PEEP** — proposed key. The static value remains elevated relative to the earlier matched assessment despite the apparent peak improvement.
   - Temptation: Interpret the controlled comparison before selecting what to follow.
   - Could be reasonable under: The supplied flow-related fall in peak with persistent higher plateau.
   - Testing preview: `timing.test.physiology`.
2. **Reassess peak pressure at the current reduced inspiratory flow**. This repeats the flow-dependent observation whose apparent recovery does not establish recovery of the static pressure burden.
   - Temptation: Treat the lower peak as comparable to the earlier measurement despite changed flow.
   - Could be reasonable under: A matched-flow assessment directed specifically at a resistive component.
   - Testing preview: `timing.test.physiology`.
3. **Reassess total PEEP with a passive expiratory occlusion**. Total PEEP matters, but it is already measured and unchanged; repeating it does not directly reassess the persisting inspiratory static-pressure difference.
   - Temptation: Attribute the rise to unmeasured end-expiratory pressure despite its recorded control.
   - Could be reasonable under: An uncertain total-PEEP measurement or new evidence of incomplete expiration.
   - Testing preview: `timing.test.physiology`.

Explanation: The matched first comparison raises peak and plateau together. Lower flow then lowers the peak while plateau remains at its higher value. Reassess passive plateau under matched delivered-volume and total-PEEP conditions before using the peak improvement to support volume escalation. This record does not establish an absolute safe volume or diagnose the cause.

Objective: Use matched static-pressure reassessment rather than a flow-dependent peak to assess a proposed volume increase.

Interpret raw findings: Interpret the two intervals: a controlled peak/plateau rise followed by a flow-dependent peak fall with persistent plateau elevation.

Apply their meaning: Choose the matched static assessment relevant to the proposed volume escalation rather than equating a lower dynamic peak with recovery.

Closest error: Follow the peak under the new flow and infer readiness to raise volume.

Deciding observation: Plateau remains 26 rather than 18 while volume and measured total PEEP are held constant.

Consequence: A dynamic display improvement can be mistaken for recovery of static loading.

Deletion test: Without the earlier matched plateau and the final changed-flow measurement, the misleading peak improvement cannot be identified. Removing the measured total-PEEP control reopens a legitimate rival. The task specifies the pending volume decision rather than an undefined mechanical endpoint.

Counterfactual: If plateau had returned toward its earlier value under the same volume and total PEEP, the record would support a different static-load interpretation; if total PEEP were uncertain with incomplete expiration, the expiratory occlusion becomes the appropriate competing check.

Manual five-part author gate (no independent PASS):

1. All three alternatives are bedside pressure reassessments and receive the same physiology timing profile. No option uniquely supplies the word pressure or the only new test. The record supplies both plateau and total-PEEP acquisitions, so novelty does not identify the key.
2. Three specific pressure reassessments at the immediate ventilator-review stage, with comparable acquisition conditions.
3. Interpret the two intervals: a controlled peak/plateau rise followed by a flow-dependent peak fall with persistent plateau elevation. Then Choose the matched static assessment relevant to the proposed volume escalation rather than equating a lower dynamic peak with recovery.
4. Fair moderate: the resident must interpret a mixed controlled/uncontrolled trajectory and select the reassessment relevant to the pending decision. This is not claimed to be a numeric volume-prescription item.
5. Plateau remains 26 rather than 18 while volume and measured total PEEP are held constant. Counterfactual: If plateau had returned toward its earlier value under the same volume and total PEEP, the record would support a different static-load interpretation; if total PEEP were uncertain with incomplete expiration, the expiratory occlusion becomes the appropriate competing check.

Sequence: First node in a new mechanics case. Feedback is limited to measurement comparability and does not mention the later humidification-device response.

Claim mapping: `claim.critical-respiratory-ventilation.plateau`. All measurements and chronology are independently constructed.

Current visible-context hash: `5f09ad79b2491dc35e69b729bf1e31a62fd2da9df01c5630f3a61ccc3eb22a05`.

### Airway intervention after a resistive pressure change — revised

Before: `question.topic.critical-respiratory-ventilation.secretion-response.v1`; review says REVISE.

Review clarity issues: None separately listed.

Review cue findings: visible secretions in the endotracheal tube / Preoxygenate and suction the endotracheal tube — The only option repeating the named tube removes the plainly visible material. A reader can match this observation to suction without interpreting either pressure. Preoxygenate and suction the endotracheal tube — The key uniquely bundles a preparatory safety action with treatment; the competing options are single interventions. The preparation belongs in common procedural context or feedback rather than giving only the key a completeness advantage.

Response to fairness, clarity and suggestions: Changed the objective to a device-resistance decision after an actual clearance attempt. Removed the suction/tube-material wording match and key-only preoxygenation bundle. Small thin secretions do not independently select the key; reproducible device-dependent peak changes with unchanged plateau must be interpreted. The intervention preserves humidification; no superiority over every possible replacement device is asserted.

Current exact version: `question.topic.critical-respiratory-ventilation.secretion-response.v2`; node `node.topic.critical-respiratory-ventilation.secretion-response.v2`; concept `concept.critical-respiratory-ventilation.humidifier-resistance.v1`. Previous topic version: `question.topic.critical-respiratory-ventilation.secretion-response.v1`.

Complaint: **Ventilation questions**. Diane Foster, 63, Female. Presentation: Diane Foster, a 63-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from the ventilated phase of her pneumonia admission.

Current update: Next hospital entry: airway clearance removes a small amount of thin secretions; the peak-pressure rise persists. During passive ventilation, the respiratory therapist records the following controlled circuit observations at unchanged delivered volume, flow and measured total PEEP.

| Record | Peak pressure | Plateau pressure |
|---|---|---|
| Original heat-and-moisture exchanger (HME) in circuit | 39 cm H2O | 20 cm H2O |
| HME briefly removed for assessment | 25 cm H2O | 20 cm H2O |
| Original HME returned | 39 cm H2O | 20 cm H2O |

Task: **Which intervention best fits Diane Foster’s recorded response after airway clearance?**

Key shown first for review only.

1. **Switch to active heated humidification** — proposed key. The controlled device response supports replacing the problematic passive device with active humidification among the offered interventions.
   - Temptation: Use the measured response to localize the resistance before choosing the intervention.
   - Could be reasonable under: The supplied reproducible HME-dependent pressure rise.
   - Testing preview: no testing choice.
2. **Start inhaled bronchodilator treatment**. Airway bronchospasm would not be expected to disappear and recur with the same external device change under controlled ventilation.
   - Temptation: Treat every resistive pressure pattern as a bronchial smooth-muscle problem.
   - Could be reasonable under: A persistent resistive pattern with compatible bronchospastic findings independent of the device.
   - Testing preview: no testing choice.
3. **Lower the delivered tidal volume**. The unchanged static pressure and device-linked peak change do not identify excess distending volume as this intervention target.
   - Temptation: Respond to the dynamic maximum as if it were a static-pressure rise.
   - Could be reasonable under: A different record with excessive plateau at the current protective prescription.
   - Testing preview: no testing choice.

Explanation: Static pressure stays unchanged while the additional dynamic pressure follows the HME in and out of the circuit. The controlled response localizes a resistive contribution to the device. Active heated humidification is the supported offered route that preserves humidification while removing that device contribution; this does not rank it over every alternative replacement device. The brief historical assessment is not a plan to leave an artificial airway without humidification.

Objective: Localize persistent resistive loading after airway clearance and choose an appropriate humidification strategy.

Interpret raw findings: Interpret the unchanged plateau and reproducible device-dependent peak change after clearance as a resistive device contribution.

Apply their meaning: Choose continued humidification through an active system rather than a lung-volume or bronchospasm intervention.

Closest error: Administer a bronchodilator for the high peak despite the controlled device response.

Deciding observation: The peak falls when the HME is removed and rises when it returns, while plateau and acquisition inputs stay unchanged.

Consequence: An added circuit resistance can persist while an unrelated intervention is repeatedly applied.

Deletion test: Delete the controlled device observations and the small thin secretion sample does not independently select a new humidification strategy; bronchospasm remains a credible target. Delete plateau and static loading is not separated. The completed clearance attempt explains why repeating the old suction key is not the current decision.

Counterfactual: If the high peak persisted unchanged with the device removed and a bronchospastic examination were supplied, bronchodilator therapy would become reasonable; a static-pressure rise would instead reopen volume reassessment.

Manual five-part author gate (no independent PASS):

1. Removed the visible-tube-material → suction match and the uniquely bundled preoxygenation key. All three labels are short single interventions. The exhibit contains measured responses rather than calling the HME obstructed; the key names a humidification strategy rather than repeating a named defect. Tenacious/copious secretions were not added as a separate standalone HME contraindication that would make the pressure exhibit dispensable.
2. Three concrete interventions after an actual airway-clearance attempt. Routine airway care is shared background, not a key-only plan component.
3. Interpret the unchanged plateau and reproducible device-dependent peak change after clearance as a resistive device contribution. Then Choose continued humidification through an active system rather than a lung-volume or bronchospasm intervention.
4. Moderate/hard: infer the resistive component, localize it through an actual controlled response, then preserve humidification while changing its method.
5. The peak falls when the HME is removed and rises when it returns, while plateau and acquisition inputs stay unchanged. Counterfactual: If the high peak persisted unchanged with the device removed and a bronchospastic examination were supplied, bronchodilator therapy would become reasonable; a static-pressure rise would instead reopen volume reassessment.

Sequence: Distinct second decision after the pressure-monitoring node. Its new device-response data, secretion course and intervention are not supplied by earlier feedback.

Claim mapping: `claim.critical-respiratory-ventilation.plateau`, `claim.critical-respiratory-ventilation.hme-resistance-r1`, `claim.critical-respiratory-ventilation.active-humidification-r1`. All measurements and chronology are independently constructed.

Current visible-context hash: `1df1133228b403766d26d202ed0f0538be635f64fed19d896b139332c32ca23a`.

### SBT readiness despite an elevated screening index — revised

Before: `question.topic.critical-respiratory-ventilation.sbt-readiness.v1`; review says REVISE.

Review clarity issues: 'A brief unsupported sample' does not establish whether this was merely an index measurement or a breathing trial stopped for intolerance. Duration need not become a new cutoff, but the observed breathing effort, tolerance and reason for ending the sample are decision-critical. Expand 'rapid shallow breathing index (RSBI)' in the update; its definition currently appears only indirectly in an option.

Review cue findings: A brief unsupported sample reports an RSBI / Repeat the rapid shallow breathing index assessment — One distractor repeats the just-completed measurement without any stated acquisition problem. This creates a repeat-versus-new-assessment shortcut and weakens the closest alternative.

Response to fairness, clarity and suggestions: Expanded RSBI, supplied comfortable effort, stable saturation and the scheduled reason the screen ended. A completed measurement is distinguished from an intolerant trial. Removed the redundant repeat-index and SIMV foils; concrete support/trial strategies compete. The index is not declared irrelevant or normal.

Current exact version: `question.topic.critical-respiratory-ventilation.sbt-readiness.v2`; node `node.topic.critical-respiratory-ventilation.sbt-readiness.v2`; concept `concept.critical-respiratory-ventilation.sbt-readiness.v1`. Previous topic version: `question.topic.critical-respiratory-ventilation.sbt-readiness.v1`.

Complaint: **Hospital follow-up**. Sarah Nguyen, 61, Female. Presentation: Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.

Current update: Hospital record: Sarah follows commands and initiates breaths after pneumonia improves. PaO2 is 86 mm Hg on FiO2 0.35 and PEEP 5 cm H2O; blood pressure is 118/70 mm Hg without vasopressors. During the scheduled rapid shallow breathing index (RSBI) measurement she remains comfortable, with no accessory-muscle use, and saturation stays 94%. The measurement ends when its scheduled recording is complete; RSBI is 118 breaths/min/L.

None.

Task: **Which liberation plan best fits Sarah Nguyen at this recorded assessment?**

Key shown first for review only.

1. **Proceed to a monitored spontaneous breathing trial** — proposed key. Multidomain readiness and the observed comfortable sample support testing sustained breathing under minimal assistance.
   - Temptation: Distinguish a completed screen from an intolerant trial.
   - Could be reasonable under: The supplied stable oxygenation, effort and circulation with no observed measurement intolerance.
   - Testing preview: `timing.test.physiology`.
2. **Continue assist-control ventilation and reassess breathing tolerance**. Deferral would be appropriate for actual instability or observed intolerance, neither of which is supplied by this completed measurement.
   - Temptation: Treat the measured index as sufficient proof that a breathing trial has failed.
   - Could be reasonable under: Distress or circulatory/oxygenation deterioration during the measurement.
   - Testing preview: no testing choice.
3. **Use stepwise pressure-support reductions before a breathing trial**. A gradual support-reduction pathway does not resolve a demonstrated barrier here and can defer the direct trial supported by the record.
   - Temptation: Treat gradual weaning as necessary because an isolated screening index remains high.
   - Could be reasonable under: A separate individualized weaning plan after actual intolerance has been evaluated.
   - Testing preview: `timing.test.physiology`.

Explanation: The readiness domains and observed tolerance support proceeding to a monitored SBT. The completed index measurement was not stopped for distress and does not itself demonstrate trial failure. AARC does not require RSBI as a gate to a trial; it also does not say to ignore actual intolerance. No new index cutoff or trial duration is prescribed.

Objective: Start a spontaneous breathing trial using overall readiness rather than an isolated RSBI gate.

Interpret raw findings: Integrate the recovery domains and actual effort/tolerance observations, distinguishing a completed index measurement from a trial stopped for intolerance.

Apply their meaning: Choose a monitored breathing trial rather than requiring an isolated index or gradual support reduction as a mandatory gate.

Closest error: Read the index as a failed trial despite the documented reason the sample ended.

Deciding observation: The sample was comfortable and ended after scheduled recording, with stable oxygenation and circulation.

Consequence: Unnecessary deferral may prolong invasive support; actual intolerance would instead warrant reassessment.

Deletion test: Deleting observed sample tolerance and its stopping reason reopens whether the sample represented failure. Removing the multidomain recovery observations removes trial-readiness support. The measured high index preserves a real competing interpretation.

Counterfactual: If the sample ended because accessory-muscle use, desaturation or circulatory instability developed, continuing support and assessing that intolerance would become appropriate instead of proceeding immediately.

Manual five-part author gate (no independent PASS):

1. Expanded RSBI on first use and documented the sample’s effort, tolerance and reason for ending without calling the result acceptable. Replaced the redundant repeat-index distractor and removed SIMV. All alternatives are current liberation plans; testing plans have explicit timing metadata.
2. Three concrete liberation strategies: monitored trial, continued assist-control reassessment, or stepwise pressure-support weaning.
3. Integrate the recovery domains and actual effort/tolerance observations, distinguishing a completed index measurement from a trial stopped for intolerance. Then Choose a monitored breathing trial rather than requiring an isolated index or gradual support reduction as a mandatory gate.
4. Fair moderate: interprets actual tolerance versus an isolated screening number. This is not made artificially hard by an unspecified sample or a repeated-test foil.
5. The sample was comfortable and ended after scheduled recording, with stable oxygenation and circulation. Counterfactual: If the sample ended because accessory-muscle use, desaturation or circulatory instability developed, continuing support and assessing that intolerance would become appropriate instead of proceeding immediately.

Sequence: First node of a revised liberation case. No later oxygen-support change or current airway-clearance result appears here.

Claim mapping: `claim.critical-respiratory-ventilation.sbt-readiness`. All measurements and chronology are independently constructed.

Current visible-context hash: `ed6f999797046ba9dd320a0e2632b7d8a8e03ff08ca1ccf9f9ed6927f5f4c776`.

### Interpreting an SBT performed at increased FiO2 — revised

Before: `question.topic.critical-respiratory-ventilation.sbt-fio2.v1`; review says REVISE.

Review clarity issues: 'Minimal-support' does not specify the actual pressure support and PEEP used. This matters when an option proposes adding pressure support. The task asks for a plan 'before an extubation decision' while one option makes that decision.

Review cue findings: before an extubation decision / Extubate to the trial oxygen concentration — The task linguistically excludes immediate extubation before the learner evaluates whether the trial supports it. charted as tolerated. Sarah remains comfortable, but — The adversative wording announces a defect in an apparently successful test. FiO2 is the only changed support variable displayed, and only one repeat option corrects it; the item can be answered as a test-comparison puzzle.

Response to fairness, clarity and suggestions: Specified actual pressure support and PEEP. Removed but and the task phrase before an extubation decision. Two specified repeat protocols and extubation now answer the neutral liberation task. Valid unassisted testing is distinguished from increased oxygen support; the conditional very-low-certainty oxygen limitation is retained.

Current exact version: `question.topic.critical-respiratory-ventilation.sbt-fio2.v2`; node `node.topic.critical-respiratory-ventilation.sbt-fio2.v2`; concept `concept.critical-respiratory-ventilation.sbt-fio2.v1`. Previous topic version: `question.topic.critical-respiratory-ventilation.sbt-fio2.v1`.

Complaint: **Hospital follow-up**. Sarah Nguyen, 61, Female. Presentation: Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.

Current update: Next hospital entry: Sarah completes a breathing trial without accessory-muscle use or circulatory change. The trial is recorded as tolerated. Its ventilator and oxygen conditions are shown below.

| Record | Pressure support / PEEP | FiO2 | SpO2 / respiratory rate |
|---|---|---|---|
| Before trial | 8 / 5 cm H2O | 0.35 | 94% / 22 per min |
| During trial | 0 / 0 cm H2O | 0.60 | 97% / 25 per min |

Task: **Which liberation plan best fits Sarah Nguyen’s recorded trial?**

Key shown first for review only.

1. **Repeat an unassisted trial at FiO2 0.35** — proposed key. This retains a valid trial method while addressing the oxygen-condition uncertainty.
   - Temptation: Evaluate pressure assistance and oxygen support as different inputs.
   - Could be reasonable under: The supplied comfortable unassisted trial performed at increased FiO2.
   - Testing preview: `timing.test.physiology`.
2. **Repeat a supported trial at FiO2 0.60**. Adding assistance is not required just because the prior trial was unassisted; retaining the higher FiO2 leaves the oxygen comparison unresolved.
   - Temptation: Treat removal of pressure assistance as the test defect despite observed comfort.
   - Could be reasonable under: A separate deliberately supported trial protocol at an unchanged appropriate oxygen condition.
   - Testing preview: `timing.test.physiology`.
3. **Extubate to oxygen at FiO2 0.60**. The improved saturation occurred at higher oxygen support, so this record does not yet establish the intended oxygen-condition tolerance for that decision.
   - Temptation: Interpret the better saturation as recovery without considering the changed support.
   - Could be reasonable under: A valid unchanged-oxygen trial together with satisfactory current airway assessment.
   - Testing preview: no testing choice.

Explanation: An unassisted trial is an accepted approach; the absence of pressure support does not itself invalidate this assessment. The higher FiO2, however, means the improved displayed saturation does not establish tolerance at the preceding oxygen concentration. Repeat an unassisted trial at the preceding FiO2 before relying on this result for tube removal. The unchanged-FiO2 recommendation is conditional with very low certainty.

Objective: Reassess an SBT performed under increased oxygen support before using it as evidence for extubation.

Interpret raw findings: Recognize that an unassisted SBT can be a valid method while the oxygen concentration was increased.

Apply their meaning: Repeat the oxygen-condition assessment rather than add unnecessary assistance or treat the higher saturation as proof for extubation.

Closest error: Restore pressure support because the lower assistance appears to make the trial invalid.

Deciding observation: She tolerates unassisted breathing, but the saturation improvement occurs at a FiO2 increase from 0.35 to 0.60.

Consequence: The wrong repeat protocol can retain the confound or unnecessary tube removal can rely on a falsely reassuring result.

Deletion test: Deleting actual pressure/PEEP leaves uncertainty about the support-method alternative; deleting either oxygen condition prevents evaluation of the apparent saturation improvement. Comfort preserves the distinction between reassessment and immediate rescue.

Counterfactual: With the same comfortable unassisted trial at unchanged FiO2 and a satisfactory airway assessment, extubation becomes reasonable. Observed distress under unsupported breathing would instead justify support and cause reassessment.

Manual five-part author gate (no independent PASS):

1. Neutral next-plan task replaces “before an extubation decision”; removed the editorial “but.” Actual pressure support and PEEP are supplied. Two plausible repeat protocols compete, and both receive physiology waits; no task wording excludes extubation.
2. Three complete liberation plans comparing two specified repeat protocols with tube removal at the recorded stage.
3. Recognize that an unassisted SBT can be a valid method while the oxygen concentration was increased. Then Repeat the oxygen-condition assessment rather than add unnecessary assistance or treat the higher saturation as proof for extubation.
4. Fair moderate: distinguish valid reduction of ventilatory assistance from an oxygen-condition confound, then select the repeat that addresses the unresolved observation. Conditional evidence remains explicit.
5. She tolerates unassisted breathing, but the saturation improvement occurs at a FiO2 increase from 0.35 to 0.60. Counterfactual: With the same comfortable unassisted trial at unchanged FiO2 and a satisfactory airway assessment, extubation becomes reasonable. Observed distress under unsupported breathing would instead justify support and cause reassessment.

Sequence: The preceding readiness explanation does not supply the FiO2 or supported-versus-unassisted rule. Future clearance observations remain hidden.

Claim mapping: `claim.critical-respiratory-ventilation.sbt-oxygen`, `claim.critical-respiratory-ventilation.sbt-support-method-r1`. All measurements and chronology are independently constructed.

Current visible-context hash: `eb231c93d1cc73d784f5043fe8f1bf58808b0742dd5ccc6f9d55b5265e0dc366`.

### Airway clearance after a tolerated SBT — revised

Before: `question.topic.critical-respiratory-ventilation.extubation-clearance.v1`; review says REVISE.

Review clarity issues: None separately listed.

Review cue findings: Her cough does not move secretions into the endotracheal tube; pooled secretions repeatedly require suction / Continue intubation and airway clearance — The update states an immediately unresolved clearance problem, and only the key explicitly addresses clearance. The two extubation options differ in oxygen/support device but neither addresses the dominant problem.

Response to fairness, clarity and suggestions: Preserved the original unresolved-danger version in history and replaced the scored record with an observed clearance-recovery trajectory. Common airway care is background; present trial/clearance findings and the risk profile determine tube removal and support. The new meaning is versioned, with no cough-flow, secretion-count or elapsed-time cutoff.

Current exact version: `question.topic.critical-respiratory-ventilation.extubation-clearance.v2`; node `node.topic.critical-respiratory-ventilation.extubation-clearance.v2`; concept `concept.critical-respiratory-ventilation.extubation-clearance.v2`. Previous topic version: `question.topic.critical-respiratory-ventilation.extubation-clearance.v1`.

Complaint: **Hospital follow-up**. Sarah Nguyen, 61, Female. Presentation: Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.

Current update: Later hospital entry: Sarah tolerates an unassisted trial at the preceding FiO2. At an earlier assessment, cough had failed to bring up thick secretions. During the current trial, repeated coughs move secretions to the proximal tube and she does not need suction to sustain a clear airway. She follows commands. Her history has no chronic heart or lung disease.

None.

Task: **Which airway plan best fits Sarah Nguyen’s current hospital reassessment?**

Key shown first for review only.

1. **Extubate to standard supplemental oxygen** — proposed key. The current trial and clearance observations support tube removal; the profile does not supply the high-risk indication used to justify routine preventive NIV.
   - Temptation: Reassess present function rather than carry the earlier airway decision forward.
   - Could be reasonable under: The supplied tolerated trial, effective current clearance and absence of high-risk chronic disease.
   - Testing preview: no testing choice.
2. **Continue intubation for secretion management**. The earlier poor clearance does not remain the current finding; the described cough now moves material and sustains the airway during the trial.
   - Temptation: Let a historical safety concern override a documented functional recovery.
   - Could be reasonable under: Persistently ineffective cough or ongoing pooling requiring repeated suction.
   - Testing preview: no testing choice.
3. **Extubate to preventive bilevel support**. Preventive NIV is useful for selected high-risk profiles, but it is not the routine replacement for oxygen in this supplied non-high-risk profile.
   - Temptation: Use mask support as a generic hedge against the earlier secretion concern.
   - Could be reasonable under: A tolerated trial and effective clearance in a selected higher-risk chronic respiratory/cardiac profile.
   - Testing preview: no testing choice.

Explanation: The present cough/clearance observations change the earlier reason to keep the tube. After a tolerated trial, effective current clearance supports extubation rather than waiting for all secretions to disappear. In this patient without the supplied high-risk chronic respiratory/cardiac profile, routine preventive NIV is not the preferred default over standard oxygen. These observations do not create a universal cough-flow, secretion-volume or observation-time cutoff.

Objective: Use current clearance trajectory and post-extubation support needs after a tolerated trial.

Interpret raw findings: Interpret the actual change from ineffective clearance to effective cough during the current tolerated trial.

Apply their meaning: Choose an extubation/support plan that uses current airway function and the patient’s risk profile rather than prolonging the old airway plan or adding routine NIV.

Closest error: Continue the tube because the earlier clearance finding is remembered as persistent.

Deciding observation: Current repeated cough moves material proximally and the airway remains clear during the trial; no chronic high-risk respiratory/cardiac history is supplied.

Consequence: An outdated functional attribution can prolong intubation, while routine NIV is not a substitute for assessing clearance.

Deletion test: Deleting current cough/clearance evidence removes the reason to reverse the earlier intubation plan; deleting trial tolerance removes breathing readiness. Removing the age/history profile reopens preventive NIV as a supported competitor.

Counterfactual: If cough still failed to move material with recurrent pooling at the current assessment, continuing intubation would again be appropriate. If a high-risk chronic respiratory profile were present after otherwise adequate readiness, preventive NIV would become reasonable.

Manual five-part author gate (no independent PASS):

1. Shared airway care remains background; all alternatives are short airway plans with similar scope. Replaced a single unresolved unsafe-clearance trigger with an observed recovery trajectory. No “now safe to extubate” or high-risk classification is supplied.
2. Three concrete airway/support plans at the same present reassessment: standard oxygen, continued tube clearance, or preventive bilevel support.
3. Interpret the actual change from ineffective clearance to effective cough during the current tolerated trial. Then Choose an extubation/support plan that uses current airway function and the patient’s risk profile rather than prolonging the old airway plan or adding routine NIV.
4. Fair moderate: current functional recovery must override a historically reasonable safety decision, followed by a support choice at the appropriate risk boundary. No claim of hard calibrated difficulty.
5. Current repeated cough moves material proximally and the airway remains clear during the trial; no chronic high-risk respiratory/cardiac history is supplied. Counterfactual: If cough still failed to move material with recurrent pooling at the current assessment, continuing intubation would again be appropriate. If a high-risk chronic respiratory profile were present after otherwise adequate readiness, preventive NIV would become reasonable.

Sequence: New current clearance observations follow a repeat trial. Earlier feedback does not state whether clearance improved or what this current risk profile requires.

Claim mapping: `claim.critical-respiratory-ventilation.airway-clearance`, `claim.critical-respiratory-ventilation.niv-low-risk-r1`. All measurements and chronology are independently constructed.

Current visible-context hash: `1d4873e37e4a816b3a104f36b24941a74810c9c9511e9dbc711cdfa2e45c03d4`.

### Initial support for acute-on-chronic COPD ventilatory failure — revised

Before: `question.topic.critical-respiratory-ventilation.copd-niv.v1`; review says REVISE.

Review clarity issues: The baseline cell under 'PaO2 / oxygen condition' contains only 'Room air', so the table mixes an unreported baseline PaO2 with an actual current value. Mark an unavailable value explicitly or separate the columns.

Review cue findings: an acute COPD exacerbation that initially received mask support / Start bilevel mask ventilation — The shared presentation reveals the historical initial support action before the question asks the learner to select it. Only one option is mask support. The gases, work of breathing and airway assessment can all be ignored.

Response to fairness, clarity and suggestions: Deleted the mask-action disclosure in a new neutral case without touching the frozen later COPD PASS context. Split PaO2 and oxygen condition into separate columns and explicitly marked unrecorded baseline PaO2. The original gas-plus-airway selection reasoning remains.

Current exact version: `question.topic.critical-respiratory-ventilation.copd-niv.v2`; node `node.topic.critical-respiratory-ventilation.copd-niv.v2`; concept `concept.critical-respiratory-ventilation.copd-niv.v1`. Previous topic version: `question.topic.critical-respiratory-ventilation.copd-niv.v1`.

Complaint: **Breathing follow-up**. Robert Diaz, 70, Male. Presentation: Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation.

Current update: Hospital record: after inhaled bronchodilator treatment, Robert has respiratory rate 30/min with accessory-muscle use. He is alert and clears oral secretions. Blood pressure is 128/72 mm Hg.

| Record | pH | PaCO2 | PaO2 | Oxygen condition |
|---|---|---|---|---|
| Before illness | 7.38 | 50 mm Hg | Not recorded | Room air |
| Current arterial sample | 7.28 | 70 mm Hg | 62 mm Hg | FiO2 0.28 |

Task: **Which respiratory-support strategy best fits Robert Diaz’s initial hospital assessment?**

Key shown first for review only.

1. **Start bilevel mask ventilation** — proposed key. The change from compensated baseline hypercapnia to respiratory acidosis and distress supports a monitored bilevel trial.
   - Temptation: Use the baseline comparison and current clinical state.
   - Could be reasonable under: The supplied acidotic COPD exacerbation without immediate deterioration.
   - Testing preview: no testing choice.
2. **Start high-flow nasal oxygen**. Oxygen delivery is not the recommended substitute for bilevel ventilatory assistance in the stated acidotic COPD exacerbation.
   - Temptation: Focus on oxygen tension rather than the new ventilatory problem.
   - Could be reasonable under: A selected oxygenation problem without the supplied acidotic ventilatory failure.
   - Testing preview: no testing choice.
3. **Start invasive endotracheal ventilation**. Immediate invasive support is not the preferred first strategy for this alert patient without immediate deterioration.
   - Temptation: Treat every elevated PaCO2 or acidotic value as an automatic intubation indication.
   - Could be reasonable under: Immediate deterioration or failure of an appropriate monitored trial.
   - Testing preview: no testing choice.

Explanation: The baseline and current gases show a new acidotic ventilatory problem rather than elevated PaCO2 in isolation. ERS/ATS supports bilevel NIV for an acidotic COPD exacerbation in a patient not immediately deteriorating. The support choice depends on clinical state as well as the gas; this is not a pH-alone rule.

Objective: Choose bilevel NIV for acute hypercapnic COPD acidosis without immediate deterioration.

Interpret raw findings: Recognize the new acidotic ventilatory change against the compensated baseline and persistent effort after treatment.

Apply their meaning: Use present alertness, secretion clearance and circulatory state to choose a noninvasive trial rather than oxygen-focused support or immediate intubation.

Closest error: Choose oxygen support for the low oxygen tension while missing the acute ventilatory problem.

Deciding observation: New pH decline and PaCO2 rise despite treatment, with preserved alert interaction and secretion clearance.

Consequence: Oxygen-only support may miss ventilatory failure, while automatic intubation may bypass a suitable NIV trial.

Deletion test: Removing baseline gases loses the acute-on-chronic inference; removing current airway/interaction observations loses the boundary with immediate invasive support. The neutral presentation supplies no selected support action.

Counterfactual: If this initial assessment instead showed immediate deterioration, apnea or inability to manage secretions, invasive support would take priority over a mask trial.

Manual five-part author gate (no independent PASS):

1. Removed the shared presentation’s disclosure of initial mask support by placing this revised item in a separate neutral case. Baseline PaO2 is explicitly unrecorded in its own column. All three support options remain short named strategies without qualifiers.
2. Three respiratory-support strategies at the initial hospital assessment, with no word-matching disclosure in the presentation.
3. Recognize the new acidotic ventilatory change against the compensated baseline and persistent effort after treatment. Then Use present alertness, secretion clearance and circulatory state to choose a noninvasive trial rather than oxygen-focused support or immediate intubation.
4. Fair moderate: the original gas-plus-airway reasoning is retained after removing the answer leak and the mixed missing-value cell.
5. New pH decline and PaCO2 rise despite treatment, with preserved alert interaction and secretion clearance. Counterfactual: If this initial assessment instead showed immediate deterioration, apnea or inability to manage secretions, invasive support would take priority over a mask trial.

Sequence: New neutral initial/response case. The exact passed planned-extubation item stays in its original frozen case context, with its old header and prior feedback preserved separately.

Claim mapping: `claim.critical-respiratory-ventilation.niv-copd`. All measurements and chronology are independently constructed.

Current visible-context hash: `cc6012abdc921d28c6764ad471b38ef52a9218000f496beeced85a842e1405ab`.

### Escalation during deteriorating NIV — revised

Before: `question.topic.critical-respiratory-ventilation.copd-niv-failure.v1`; review says REVISE.

Review clarity issues: None separately listed.

Review cue findings: None separately listed; clinical reasoning/fairness notes still apply.

Response to fairness, clarity and suggestions: Kept the old danger-sign/intubation episode exact in history. Replaced it with a different earlier response-assessment objective and a new concept: improving pH/effort and preserved function compete with a residual abnormal PaCO2 and a misleading oxygen-only endpoint. No dangerous sign is removed while retaining the old urgent key.

Current exact version: `question.topic.critical-respiratory-ventilation.copd-niv-failure.v2`; node `node.topic.critical-respiratory-ventilation.copd-niv-failure.v2`; concept `concept.critical-respiratory-ventilation.copd-niv-response.v1`. Previous topic version: `question.topic.critical-respiratory-ventilation.copd-niv-failure.v1`.

Complaint: **Breathing follow-up**. Robert Diaz, 70, Male. Presentation: Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation.

Current update: Next hospital entry: after bilevel mask ventilation begins at unchanged oxygen concentration, Robert remains alert and clears oral secretions. His respiratory rate falls from 30 to 23/min, accessory-muscle use decreases, pH rises from 7.28 to 7.33 and PaCO2 falls from 70 to 62 mm Hg. Saturation is 92%, with stable blood pressure.

None.

Task: **Which respiratory-support plan best fits Robert Diaz’s current response?**

Key shown first for review only.

1. **Continue monitored bilevel ventilation** — proposed key. The gas and effort trajectory supports response at unchanged oxygen support with intact interaction and clearance.
   - Temptation: Judge the trend together with current clinical function.
   - Could be reasonable under: The supplied improving trajectory and preserved airway function.
   - Testing preview: no testing choice.
2. **Proceed to endotracheal ventilation**. Persistent abnormal PaCO2 does not by itself override improvement in pH, respiratory effort and clinical state.
   - Temptation: Treat a remaining abnormal gas value as equivalent to NIV failure.
   - Could be reasonable under: Worsening gas/effort together with clinical deterioration or a new immediate airway need.
   - Testing preview: no testing choice.
3. **Change to high-flow nasal oxygen**. The current oxygen display does not establish that the improving ventilatory problem no longer requires bilevel support.
   - Temptation: Treat an acceptable oxygen display as proof of independent ventilation.
   - Could be reasonable under: An oxygenation-limited problem after adequate ventilation is independently established.
   - Testing preview: no testing choice.

Explanation: The pH, respiratory effort and PaCO2 are moving in a favorable direction while airway function remains adequate. ERS/ATS identifies improvement in pH or respiratory rate as evidence of a likely NIV response. Continue the monitored bilevel strategy rather than demand immediate normalization of PaCO2 or replace ventilatory assistance with oxygen alone. This is an earlier response-assessment objective; the original later danger signs and urgent intubation decision are preserved in the historical version.

Objective: Continue a responding NIV trial using the trajectory rather than an isolated abnormal carbon-dioxide value.

Interpret raw findings: Interpret the direction of pH, PaCO2 and effort at unchanged oxygen concentration as a response rather than failure.

Apply their meaning: Continue monitored ventilatory assistance using current airway function rather than escalate for a residual lab abnormality or de-escalate on saturation alone.

Closest error: Intubate for a remaining high PaCO2 despite improvement in pH and effort.

Deciding observation: pH and respiratory effort improve together while alertness and clearance remain intact.

Consequence: An isolated target can cause unnecessary escalation, while oxygen-only de-escalation can withdraw still-needed ventilatory assistance.

Deletion test: Deleting the gas/effort trajectory makes ongoing NIV performance uncertain; deleting current interaction and clearance removes the boundary that permits continued support. The saturation observation supplies the competing de-escalation error.

Counterfactual: With falling pH, worsening effort or new loss of interaction/clearance instead of this improving trajectory, invasive ventilation would become appropriate. With independently resolved ventilatory need, oxygen-focused support could be reasonable.

Manual five-part author gate (no independent PASS):

1. The old urgent intubation key and its real danger signs remain intact in the archived original. This is explicitly a different earlier objective with new meaning and no weakened danger-sign story. Three support plans have parallel labels; no “successful NIV” conclusion is supplied.
2. Three concrete current support plans: continued bilevel monitoring, invasive support, or oxygen-focused support.
3. Interpret the direction of pH, PaCO2 and effort at unchanged oxygen concentration as a response rather than failure. Then Continue monitored ventilatory assistance using current airway function rather than escalate for a residual lab abnormality or de-escalate on saturation alone.
4. Fair moderate: residual abnormal carbon dioxide competes with meaningful improvement, and oxygenation cannot replace the response/airway assessment. No invented pH-alone threshold.
5. pH and respiratory effort improve together while alertness and clearance remain intact. Counterfactual: With falling pH, worsening effort or new loss of interaction/clearance instead of this improving trajectory, invasive ventilation would become appropriate. With independently resolved ventilatory need, oxygen-focused support could be reasonable.

Sequence: Second node in the revised neutral COPD case. The initial explanation does not disclose this actual response. It is not composed ahead of the frozen planned-extubation PASS.

Claim mapping: `claim.critical-respiratory-ventilation.niv-copd`, `claim.critical-respiratory-ventilation.niv-response-r1`. All measurements and chronology are independently constructed.

Current visible-context hash: `84d3c7359bcacda2345c034bd83dde9ecdf793002b7367469f1649e2e76abbfa`.

### Flow assessment after a falling mixed-venous saturation — parked

Before: `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`; review says REVISE.

Review clarity issues: A pulmonary-artery catheter and repeated indirect calorimetry are present, but the record does not state whether cardiac-output measurements are available from that monitoring. This does not make echo wrong, but leaves the claimed clinical priority incompletely motivated.

Review cue findings: Catheter position and sample labels are verified / Repeat the complete blood count / Repeat the arterial blood gas — The data have been collected and explicitly validated; both distractors simply repeat represented carriage measurements. Only the key introduces a new assessment. A test-wise reader can select the new investigation without interpreting the direction or magnitude of the venous change.

Response to fairness, clarity and suggestions: Specified that catheter-derived flow is available and replaced redundant CBC/ABG choices with three novel methods. The source does not uniquely rank the new methods without a more specific clinical question. This repaired attempt is unkeyed and parked, preserving the original request for Melissa rather than guessing a priority.

**Park reason:** The single repaired attempt resolves the old novel-test shortcut and states that PAC-derived flow is available. It exposes an unresolved investigation-priority question: equally novel methods address different mechanism/measurement uncertainties. No supported unique key can be supplied from this record, so it remains unkeyed and excluded rather than guessing a preferred investigation.

Current exact version: `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v2`; node `node.topic.critical-respiratory-ventilation.delivery-flow-assessment.v2`; concept `concept.critical-respiratory-ventilation.delivery-flow-assessment.v1`. Previous topic version: `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`.

Complaint: **Hospital questions**. Brian Lewis, 68, Male. Presentation: Brian Lewis, a 68-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from a postoperative admission in which oxygen-delivery measurements changed.

Current update: Hospital record: the paired arterial and pulmonary-artery samples below were obtained at unchanged oxygen consumption. The pulmonary-artery catheter also produced concordant thermodilution runs showing a fall in flow during this interval. The record does not characterize ventricular function or preload responsiveness.

| Record | Hemoglobin | Arterial saturation / PaO2 | Mixed-venous saturation |
|---|---|---|---|
| Earlier | 8.0 g/dL | 96% / 82 mm Hg | 72% |
| Later | 10.0 g/dL | 99% / 110 mm Hg | 50% |

Task: **Which flow-assessment method should have been prioritized for Brian Lewis at this recorded point?**

**Unkeyed parked attempt: no answer is asserted.**

1. **Transthoracic Doppler echocardiography**. It can characterize cardiac function and flow, but the record does not establish it as uniquely prior to every other available assessment.
   - Temptation: Evaluate a cardiac contributor.
   - Could be reasonable under: Specific ventricular/function uncertainty that would change care.
   - Testing preview: `timing.test.ultrasound`.
2. **Passive leg raising with stroke-volume monitoring**. It can examine preload response; the supplied facts do not establish whether this or imaging should come first.
   - Temptation: Evaluate a preload contributor.
   - Could be reasonable under: A clinically supported preload-response question.
   - Testing preview: `timing.test.physiology`.
3. **Calibrated arterial waveform analysis**. It can contribute flow information, but already concordant thermodilution values do not establish why repeating flow with this method would outrank mechanism assessment.
   - Temptation: Verify flow with another technique.
   - Could be reasonable under: A clinically specified measurement or trending uncertainty.
   - Testing preview: `timing.test.physiology`.

Explanation: Unkeyed and parked: the direction of the flow inference is supported, and the newly specified thermodilution availability removes the old context omission. Comparing three novel assessments removes the new-test-versus-redundant-repeat shortcut. The permitted source supports the methods, but does not uniquely rank their priority without a more specific clinical question.

Objective: Assess blood flow when venous oxygenation falls despite improved arterial carriage and unchanged oxygen consumption.

Interpret raw findings: Integrate higher hemoglobin and arterial oxygenation with lower mixed-venous saturation at unchanged consumption.

Apply their meaning: Investigate the remaining blood-flow component rather than repeat the already contemporary carriage measurements.

Closest error: Repeat arterial gas testing because the venous saturation fell.

Deciding observation: No sufficient deciding observation is supplied to choose among the equally novel methods.

Consequence: Additional oxygen or hemoglobin-focused evaluation can miss a delivery problem in blood flow.

Deletion test: Removing the numerical changes no longer leaves a novelty-based answer; no unique answer remains with them either. Uncertainty is preserved instead of assigning a key.

Counterfactual: A specific ventricular/function uncertainty could favor Doppler echo, whereas a supported preload-responsiveness question could favor passive leg raising. Neither is established here.

Manual five-part author gate (no independent PASS):

1. All three methods are novel named assessments; none is a redundant repeat of a represented carriage measurement. PAC flow availability is explicit.
2. Three immediate hemodynamic assessments, each requiring its own clinical indication.
3. A fall in flow is already measured; choosing the most useful next mechanism assessment still requires a patient-specific uncertainty that this record does not settle.
4. Indeterminate ranking, not hard difficulty. Parked with no key.
5. Not established; three novel methods are not uniquely ranked by the available observations.

Sequence: Standalone. Secondary shock/hemodynamic overlap is reported to the manager; no fluid, pressor or inotrope decision is scored.

Claim mapping: `claim.critical-respiratory-ventilation.saturation`, `claim.critical-respiratory-ventilation.content`, `claim.critical-respiratory-ventilation.delivery-flow`, `claim.critical-respiratory-ventilation.echo-flow`. All measurements and chronology are independently constructed.

Current visible-context hash: `aa44675efb2302267d229bf511bf69a144b62160aad1a560ab52c316009962d2`.

## Existing owner hold

`question.topic.critical-respiratory-ventilation.ards-pressure-limit.v1` remains unchanged under `review.n3.ards-weight-change-versus-tidal-volume-basis.v2`. It is preserved in `reviewRound.heldPreserved`, marked parked only as a supply disposition, and excluded from candidate question/node/case/timing exports. Its original clinical question and complete before context remain available. The independent reviewer did not adjudicate it, and this response does not resolve Melissa’s decision.

## Concept identity, selection and timing

- `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v2` → `concept.critical-respiratory-ventilation.ards-prone-escalation.v1`. Material change in scored meaning explicitly gets a separate concept history. Previous/replaced concept: concept.ards.permeability-edema-mechanism. No history migration.
- `question.topic.critical-respiratory-ventilation.pressure-assessment.v2` → `concept.n2.ventilator-elastic-versus-resistive-load`. Reuses the established registered matched-mechanics identity; do not migrate the prior topic acquisition card to it. Previous/replaced concept: concept.critical-respiratory-ventilation.pressure-assessment.v1. No history migration.
- `question.topic.critical-respiratory-ventilation.secretion-response.v2` → `concept.critical-respiratory-ventilation.humidifier-resistance.v1`. Material change in scored meaning explicitly gets a separate concept history. Previous/replaced concept: concept.critical-respiratory-ventilation.secretion-response.v1. No history migration.
- `question.topic.critical-respiratory-ventilation.sbt-readiness.v2` → `concept.critical-respiratory-ventilation.sbt-readiness.v1`. Wording/context repair preserves the existing concept meaning. Previous/replaced concept: none. No history migration.
- `question.topic.critical-respiratory-ventilation.sbt-fio2.v2` → `concept.critical-respiratory-ventilation.sbt-fio2.v1`. Wording/context repair preserves the existing concept meaning. Previous/replaced concept: none. No history migration.
- `question.topic.critical-respiratory-ventilation.extubation-clearance.v2` → `concept.critical-respiratory-ventilation.extubation-clearance.v2`. Material change in scored meaning explicitly gets a separate concept history. Previous/replaced concept: concept.critical-respiratory-ventilation.extubation-clearance.v1. No history migration.
- `question.topic.critical-respiratory-ventilation.copd-niv.v2` → `concept.critical-respiratory-ventilation.copd-niv.v1`. Wording/context repair preserves the existing concept meaning. Previous/replaced concept: none. No history migration.
- `question.topic.critical-respiratory-ventilation.copd-niv-failure.v2` → `concept.critical-respiratory-ventilation.copd-niv-response.v1`. Material change in scored meaning explicitly gets a separate concept history. Previous/replaced concept: concept.critical-respiratory-ventilation.copd-niv-failure.v1. No history migration.

The passed versions retain their original concepts and all original visible content. Changed humidification, current clearance/risk and NIV-response meanings use separate concepts. The mechanics interpretation reuses its already registered matched-mechanics identity. No card history is transferred from a different prior topic objective.

All **seven current testing choices**, including distractors, have exact choice-ID/label mappings to existing placeholder profiles; no fixed waits are authored. Historical tests remain record review only, with null executable service requests/result gates. Parked attempts have no current candidate timing/order records; their original versions and metadata remain historical.

| Current testing choice | Question | Placeholder |
|---|---|---|
| Reassess passive plateau at matched volume and total PEEP | `question.topic.critical-respiratory-ventilation.pressure-assessment.v2` | `timing.test.physiology` |
| Reassess peak pressure at the current reduced inspiratory flow | `question.topic.critical-respiratory-ventilation.pressure-assessment.v2` | `timing.test.physiology` |
| Reassess total PEEP with a passive expiratory occlusion | `question.topic.critical-respiratory-ventilation.pressure-assessment.v2` | `timing.test.physiology` |
| Proceed to a monitored spontaneous breathing trial | `question.topic.critical-respiratory-ventilation.sbt-readiness.v2` | `timing.test.physiology` |
| Use stepwise pressure-support reductions before a breathing trial | `question.topic.critical-respiratory-ventilation.sbt-readiness.v2` | `timing.test.physiology` |
| Repeat an unassisted trial at FiO2 0.35 | `question.topic.critical-respiratory-ventilation.sbt-fio2.v2` | `timing.test.physiology` |
| Repeat a supported trial at FiO2 0.60 | `question.topic.critical-respiratory-ventilation.sbt-fio2.v2` | `timing.test.physiology` |

All current cases use the existing clinic setting. Patient acuity is stable in clinic; historical record acuity, educational tier and facility level remain separate. Multi-decision candidate cases retain existing all-concepts-unseen-or-due selection behavior; no independent standalone coverage is claimed for their paired concepts.

## Evidence and source access

Ledger: [sources-question-topic-critical-respiratory-ventilation-20261111.json](sources-question-topic-critical-respiratory-ventilation-20261111.json). Current totals: **13 full source records and 27 atomic claims**, with current and historical question mappings. Original claim statements/access dates remain unchanged.

New targeted source: Restrepo RD, Walsh BK. Humidification During Invasive and Noninvasive Mechanical Ventilation: 2012. Respiratory Care. 2012;57(5):782–788. doi:10.4187/respcare.01766. https://www.aarc.org/wp-content/uploads/2014/08/12.05.0782.pdf. Accessed November 11, 2026. Rights: Copyright 2012 Daedalus Enterprises; public society-hosted guideline, no blanket open licence inferred. Targeted factual verification of humidification requirement, device resistance and method reassessment; no source wording, figures, algorithms or tables stored. The independently constructed device-response table is not adapted from a source. Existing AARC policy/access limits apply; no licence for general corpus ingestion is claimed. Authority: Formal older AARC guideline; direct humidification-device hazards and monitoring facts, cross-checked against the 2024 AARC patient-ventilator assessment guideline. No copied temperature, humidity or timing targets.

New atoms:

- `claim.critical-respiratory-ventilation.hme-resistance-r1`: A humidification device can add resistive loading and increase peak airway pressure; a controlled device-dependent response can identify that contribution. Sources: `source.critical-respiratory-ventilation.aarc-humidification2012`, `source.critical-respiratory-ventilation.aarc-pva2024`. Category evaluation, certainty moderate. Limitation: The second clause is an author inference from controlled fictional measurements, not a device diagnostic threshold. No waveform or comparative clinical trial is reproduced.

- `claim.critical-respiratory-ventilation.active-humidification-r1`: Invasive ventilation requires ongoing humidification; active heated humidification is an available alternative when a passive HME contributes an ongoing problem. Sources: `source.critical-respiratory-ventilation.aarc-humidification2012`, `source.critical-respiratory-ventilation.aarc-pva2024`. Category management, certainty moderate. Limitation: The exact offered strategy is a context-bound application; no universal superiority over every fresh replacement HME is asserted. No temperature, humidity or replacement-time rule is authored.

- `claim.critical-respiratory-ventilation.sbt-support-method-r1`: An adult spontaneous breathing trial may use low pressure support or no pressure support. Sources: `source.critical-respiratory-ventilation.aarc-sbt2024`. Category evaluation, certainty moderate. Limitation: Conditional guideline recommendation; a specific unsupported trial must still be assessed for actual oxygenation, effort and circulatory tolerance. This does not establish a universal best support protocol.

- `claim.critical-respiratory-ventilation.niv-low-risk-r1`: Preventive NIV after planned extubation is not routinely suggested for adults without a high-risk profile. Sources: `source.critical-respiratory-ventilation.ers-ats-niv2017`. Category management, certainty low. Limitation: Conditional recommendation with very-low-certainty evidence. Risk definitions vary; the revised item supplies its specific age/history and current readiness and does not extrapolate to COPD or postoperative exceptions.

- `claim.critical-respiratory-ventilation.niv-response-r1`: Improvement in pH and respiratory rate during an acute hypercapnic COPD NIV trial supports a favorable response when present clinical function remains suitable for continued monitoring. Sources: `source.critical-respiratory-ventilation.ers-ats-niv2017`. Category management, certainty moderate. Limitation: One joint guideline directly verified for response direction. No universal observation time, PaCO2 normalization requirement or pH-alone success/failure cutoff is asserted.

Access limitations:

- AARC 2024 patient-ventilator PDF and 2012 humidification PDF were directly read for targeted factual verification.
- ERS/ATS 2017 NIV and AARC 2024 SBT facts were rechecked at their public official PDF links; original records/dates remain historical.
- BTS 2016 full PDF exceeded the web tool size limit; native in-memory access was refused by network policy. No BTS-specific new claim or mask-leak correction key is used.
- The additional MDPI bedside-assessment page could not be retrieved and is not a source record.

- New sources and author review are not clinical approval. No body text or excerpts saved.
- Same-publication mirrors do not constitute independent corroboration.
- Exact investigation-priority uncertainty is preserved in the parked unkeyed flow item.

Source links retain target `_blank`, rel `noopener noreferrer` and referrerPolicy `no-referrer`. No clinical web retrieval or AI call is introduced during gameplay. No proprietary corpus, source body text, copied table/figure or placeholder citation is stored.

## Owner approvals needed

Every revised exact version, new meaning, explanation and claim remains **needs_clinician_review** pending Melissa Rowland. The existing three editorial PASS items remain clinically unapproved.

- `review.n3.ards-weight-change-versus-tidal-volume-basis.v2`: For this exact 50-kg-PBW record already at 6 mL/kg, passive plateau 32 and pH 7.36, approve or reject the next order of 250 mL rather than maintaining 300 mL pending fluid loss? Boundary: CARRY FORWARD. New sources directly support a lower-volume proposal, but do not constitute Melissa’s resolution. Original exact version and new successor remain on hold..

- `owner.critical-respiratory-ventilation.delivery-flow-ranking`: What patient-specific unresolved clinical question would make one of these flow/function/preload assessments the necessary next step? Without that boundary, keep this attempt unkeyed and parked. Boundary: A fall in flow is established, but equally novel assessment methods address different unresolved questions. No unique priority is supported by the record; the attempt is unkeyed and parked..

- `owner.critical-respiratory-ventilation.conditional-support`: Confirm the exact conditional SBT oxygen/support-method and low-risk versus high-risk post-extubation boundaries. The two passed NIV versions remain exact editorial PASS, not clinical sign-off. Boundary: Conditional guidance; SBT oxygen recommendation is very low certainty, post-extubation NIV guidance is population-specific and low certainty..

Manager decisions (not implementation permission requests):

- Retain the PBW attempt parked unless a specific foundational exception is explicitly accepted; no exception is inferred.
- The flow-method attempt remains unkeyed until a clinically specific priority can be supported.
- The passed COPD planned-extubation item remains frozen with its old header and earlier feedback. Do not substitute the repaired initial/response case ahead of it; obtain exact-context independent review for any new composition.
- Decide exact acceptance, concept rebinds, retirement and integration after reviewing the actual lane diff. No shared manifest/registry/runtime/selector/save change is made.

## Validation

Working directory for test and typecheck: `packages/clinical-content`. JSON parsing runs from the repository root. Focused checks only; assembled-release advisory lint and broad integration remain manager-owned.

```text
npm.cmd test -- --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts
Exit code: 0
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  13:05:45
   Duration  498ms (transform 221ms, setup 0ms, import 331ms, tests 55ms, environment 0ms)
```

```text
npm.cmd run typecheck
Exit code: 1
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts(579,62): error TS2322: Type '"open_access_review"' is not assignable to type '"bibliographic_metadata" | "correction" | "government_guidance" | "narrative_review" | "observational_study" | "open_educational_resource" | "peer_reviewed_guideline" | "professional_society_guideline" | "randomized_trial" | "systematic_review"'.
src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts(587,72): error TS2322: Type '"open_access_primary_study"' is not assignable to type '"bibliographic_metadata" | "correction" | "government_guidance" | "narrative_review" | "observational_study" | "open_educational_resource" | "peer_reviewed_guideline" | "professional_society_guideline" | "randomized_trial" | "systematic_review"'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

```text
node -e "const fs=require('fs');for(const f of ['docs/research/question-topic-critical-respiratory-ventilation-20261111.json','docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json']){JSON.parse(fs.readFileSync(f,'utf8'));console.log('JSON.parse PASS '+f)}"
Exit code: 0
JSON.parse PASS docs/research/question-topic-critical-respiratory-ventilation-20261111.json
JSON.parse PASS docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json
```

The latest package typecheck is **not green**: Latest package run reports only two out-of-lane TS2322 sourceClass errors in src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts at (579,62) and (587,72): open_access_review and open_access_primary_study are not allowed ClinicalSource.sourceClass values. No respiratory diagnostic. The earlier package run passed. Other topic left untouched. The preceding complete package run passed with eleven focused tests; both complete outputs remain in the JSON validation record. The worker did not edit the concurrent source-class errors.

Eleven focused tests verify all three PASS question/node/timing/case/visible-context hashes, review/status reconciliation, one attempt per returned item, exclusion of parked and owner-held versions, valid clinic cases/concept identities, source/claim closure and every testing-choice mapping. Automated tests do not grant clinical approval.

## Final bounded handoff

- Topic: `critical-respiratory-ventilation`, independent-review response 1.
- Files changed: the same five owned topic paths listed in `finalHandoff.filesChanged`; no shared edits.
- Counts: **3 PASS preserved / 8 revised once / 2 returned attempts parked / 1 existing owner hold unchanged**.
- Current definitions: 11 candidate questions; 10 assembled nodes across six clinic cases; one exact passed COPD node restricted to its frozen context.
- Source ledger: 13 sources / 27 atomic claims; original dates and clinical review states preserved.
- Validation: focused **1 file / 11 tests passed**, exit 0; both JSON parses exit 0. Latest clinical-content typecheck exits 1 solely for concurrent pancreas sourceClass errors at lines 579/587; an earlier complete run passed.
- Open work: independent review of eight v2 versions, supported clinical decisions for parked/held items and COPD recomposition, a manager-routed pancreas sourceClass repair and package typecheck rerun, then exact acceptance/integration.
- Local checkpoint only: no commit, push, deployment, dependency installation, agents or external messages. Manager owns the backup reminder after the owner says **push to GitHub**.

## Historical v1 packet — archived, not current acceptance

The appendix below preserves the previous packet verbatim. Its counts, validation and next actions describe the pre-review draft and are superseded by the current response above. Original Markdown SHA-256: `78960e37020d76355c97ea7961af6d69bfbf40b77e765a7d07af953f53673dce`.

<details>
<summary>Open the complete historical v1 packet</summary>

# Critical care — respiratory failure and ventilation: wave 2 packet

**Draft: needs_clinician_review. Key shown first for review only.**

## Assignment

Topic `critical-respiratory-ventilation`, wave 2. Critical care — respiratory failure and ventilation. Priority **high**: A few mechanism and weight-basis cards leave bedside ventilator decisions thin.

Included scope: Oxygen delivery/ventilation, respiratory failure, ARDS, ventilator waveform/pressure interpretation, weaning and airway-support complications.

Boundaries: Sedative/toxicologic reversal belongs to anesthesia-analgesia-pharmacology. Primary acid-base calculations belong to fluids-electrolytes-acid-base. Thoracic procedures belong to thoracic-lung-pleura-mediastinum. No cross-topic scored sequence in the assigned inventory. Secondary overlap in the proposed delivery/flow assessment is routed to the manager.

Starting topic counts: 3 live concepts / 12 live nodes / 8 retained draft rows / 0 assigned unkeyed holds; 6 registered identities, including 3 without a live node; 8 total assigned historical/registered concept identities. One owner hold and one editorial park.

Baseline: default `question-ship.2026-11-10.v9`, 145 manifest rows, 1,151 cases / 1,462 nodes / 610 registered concepts. Program capture 2026-11-11T15:28:05.732Z; generated 2026-11-11T15:41:40.423Z. Actual assigned files and release re-read: **no relevant source-hash drift**. Shared tree was already broadly dirty; all non-owned paths are read-only.

Owner setting decision, 2026-11-11: every proposed case is a named patient attending the outpatient clinic after discharge. The founder reviews historical hospital/ICU decisions using existing clinic admission. No ICU/ED/trauma-bay architecture, new setting or pending composition decision is needed. Current patient acuity and historical record acuity are distinct. Opening origin/profile and saves are unchanged.

Active manager program: `docs/research/question-topic-program-20261111.md`, wave 2. Shared handoff read: `docs/handoffs/CURRENT_THREAD_HANDOFF.md`; worker has no write ownership there. Standard read in full: `question-authoring.2026-11-08.v15`.

The exact Assignment payload follows: complete taxonomy, inventory/concept/case/node/variant rows, identity notes, recorded holds, empty assigned unkeyed/withheld ledgers, freeze/approval references and source-file hashes. These are copied from the program and current tree, not inferred from the chat.

<details>
<summary>Complete exact assignment and input hashes</summary>

```json
{
  "topic": {
    "slug": "critical-respiratory-ventilation",
    "title": "Critical care — respiratory failure and ventilation",
    "priority": "high",
    "scopeIn": "Oxygen delivery/ventilation, respiratory failure, ARDS, ventilator waveform/pressure interpretation, weaning and airway-support complications.",
    "scopeOut": "Sedative/toxicologic reversal belongs to anesthesia-analgesia-pharmacology. Primary acid-base calculations belong to fluids-electrolytes-acid-base. Thoracic procedures belong to thoracic-lung-pleura-mediastinum.",
    "priorityReason": "A few mechanism and weight-basis cards leave bedside ventilator decisions thin.",
    "researchAgenda": [
      "Pressure/waveform changes and ventilator action",
      "Oxygen content versus saturation",
      "Weaning failure and respiratory rescue"
    ],
    "counts": {
      "liveConcepts": 3,
      "liveNodes": 12,
      "liveCases": 12,
      "liveVariants": 12,
      "liveAcceptedNodes": 0,
      "liveOriginalNodes": 12,
      "registeredConcepts": 6,
      "registeredWithoutLiveNodes": 3,
      "drafts": 8,
      "draftVariants": 8,
      "draftConcepts": 5,
      "explicitOwnerHeldVersions": 1,
      "unassembledDraftVariants": 0,
      "unkeyedParkedSlots": 0,
      "withheldTeachingPoints": 0,
      "liveClinicalConcepts": 3
    },
    "coverageSignal": "thin",
    "coverageReason": "At most four distinct live clinical concept identities cover this scope. Variants repeat those identities.",
    "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
    "workerLane": [
      "packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.ts",
      "packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.test.ts",
      "docs/research/question-topic-critical-respiratory-ventilation-20261111.json",
      "docs/research/question-topic-critical-respiratory-ventilation-20261111.md",
      "docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json"
    ],
    "wave": 2
  },
  "wave": 2,
  "activeManagerPlan": "docs/research/question-topic-program-20261111.md; wave 2; docs/handoffs/CURRENT_THREAD_HANDOFF.md read only",
  "programId": "question-topic-program.2026-11-11.v1",
  "generatedAt": "2026-11-11T15:41:40.423Z",
  "snapshotCapturedAt": "2026-11-11T15:28:05.732Z",
  "release": {
    "id": "clinical.synthetic.prototype.v1",
    "manifestId": "question-ship.2026-11-10.v9",
    "manifestFile": "packages/clinical-content/src/question-ship-manifest.ts",
    "assemblyFile": "packages/clinical-content/src/synthetic-content.ts",
    "assemblyExport": "SYNTHETIC_CLINICAL_RELEASE",
    "catalogRegistryMeaning": "610 registered concept identities include 156 with no live node. Active coverage uses the 454 primaryConceptId identities actually scored in default-release nodes."
  },
  "inventory": [
    {
      "recordId": "inventory.1b7f06337687230c",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "caseId": "case.gs028d.ards.a-aspiration-protein-fluid",
      "nodeIds": [
        "node.gs028d.ards.a-aspiration-protein-fluid.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v2"
      ],
      "chiefComplaint": "Breathing recovery visit",
      "taskTextShort": "Which change at the lung barrier most directly produced this patient's ARDS-associated edema?",
      "taskText": "Which change at the lung barrier most directly produced this patient's ARDS-associated edema?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.permeability-edema"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.a-aspiration-protein-fluid.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.5571d987823c6f1c",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "caseId": "case.gs028d.ards.a-pancreatitis-noncardiogenic",
      "nodeIds": [
        "node.gs028d.ards.a-pancreatitis-noncardiogenic.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v3"
      ],
      "chiefComplaint": "Hospital record review",
      "taskTextShort": "Which mechanism supports the hospital team's classification of this patient's edema as ARDS rather than isolated cardiogenic edema?",
      "taskText": "Which mechanism supports the hospital team's classification of this patient's edema as ARDS rather than isolated cardiogenic edema?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.permeability-edema"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.a-pancreatitis-noncardiogenic.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.584fc666ca77beec",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "caseId": "case.gs028d.ards.a-pneumonia-barrier",
      "nodeIds": [
        "node.gs028d.ards.a-pneumonia-barrier.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v1"
      ],
      "chiefComplaint": "ICU record question",
      "taskTextShort": "Which pathophysiologic mechanism best explains the pulmonary edema documented during this patient's ARDS admission?",
      "taskText": "Which pathophysiologic mechanism best explains the pulmonary edema documented during this patient's ARDS admission?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.permeability-edema"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.a-pneumonia-barrier.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.d6fe809ea31f1210",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "caseId": "case.gs028d.ards.a-sepsis-endothelial-injury",
      "nodeIds": [
        "node.gs028d.ards.a-sepsis-endothelial-injury.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v4"
      ],
      "chiefComplaint": "Post-ICU questions",
      "taskTextShort": "Which physiologic process best answers the family's question about this patient's ARDS-related lung edema?",
      "taskText": "Which physiologic process best answers the family's question about this patient's ARDS-related lung edema?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.permeability-edema"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.a-sepsis-endothelial-injury.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.500b000f023b4fe5",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "caseId": "case.gs028d.ards.b-after-diuresis",
      "nodeIds": [
        "node.gs028d.ards.b-after-diuresis.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v4"
      ],
      "chiefComplaint": "Discharge ventilation review",
      "taskTextShort": "Which body-weight measure provides the consistent basis for reviewing this patient's ARDS tidal-volume selection across those fluid shifts?",
      "taskText": "Which body-weight measure provides the consistent basis for reviewing this patient's ARDS tidal-volume selection across those fluid shifts?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.predicted-body-weight-ventilation"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.b-after-diuresis.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.9ee95d2c54ebf09f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "caseId": "case.gs028d.ards.b-edema-weight-gain",
      "nodeIds": [
        "node.gs028d.ards.b-edema-weight-gain.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v2"
      ],
      "chiefComplaint": "ICU chart follow-up",
      "taskTextShort": "Which body-weight measure should the reviewer use to assess the tidal-volume basis despite this patient's acute fluid gain?",
      "taskText": "Which body-weight measure should the reviewer use to assess the tidal-volume basis despite this patient's acute fluid gain?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.predicted-body-weight-ventilation"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.b-edema-weight-gain.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.959306070c2a6f2a",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "caseId": "case.gs028d.ards.b-low-actual-weight",
      "nodeIds": [
        "node.gs028d.ards.b-low-actual-weight.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v3"
      ],
      "chiefComplaint": "Recovery chart question",
      "taskTextShort": "Which body-weight measure should be used when judging whether the recorded tidal-volume strategy followed the ARDS ventilation principle?",
      "taskText": "Which body-weight measure should be used when judging whether the recorded tidal-volume strategy followed the ARDS ventilation principle?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.predicted-body-weight-ventilation"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.b-low-actual-weight.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.8fdd1a516c05a3e8",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "caseId": "case.gs028d.ards.b-obesity-ventilator-audit",
      "nodeIds": [
        "node.gs028d.ards.b-obesity-ventilator-audit.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v1"
      ],
      "chiefComplaint": "Ventilator record review",
      "taskTextShort": "Which body-weight measure should anchor the tidal-volume review for this patient's ARDS ventilation?",
      "taskText": "Which body-weight measure should anchor the tidal-volume review for this patient's ARDS ventilation?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
        "line": 8,
        "export": "CRITICAL_CARE_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 6,
          "export": "GS028_20261003_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 8,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 7,
          "export": "GS028_20261003_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028d.ards.predicted-body-weight-ventilation"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028d.ards.b-obesity-ventilator-audit.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.08016092c7d763fc",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "caseId": "case.gs028f.oxygen-content.c1-anemia-normal-clip",
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-anemia-normal-clip.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v1"
      ],
      "chiefComplaint": "Blood count clarification",
      "taskTextShort": "Why can this patient's normal SpO2 coexist with reduced oxygen-carrying content?",
      "taskText": "Why can this patient's normal SpO2 coexist with reduced oxygen-carrying content?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
        "line": 10,
        "export": "OXYGEN_CONTENT_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 17,
          "export": "GS028_20261007_VARIETY2_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 55,
          "export": "GS028_20261007_VARIETY2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028f.oxygen.saturation-fraction",
        "claim.gs028f.oxygen.hemoglobin-carriage",
        "claim.gs028f.oxygen.anemia-content-limit"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028f.oxygen-content.c1-anemia-normal-clip.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.66e27d0e1a5cafc9",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "caseId": "case.gs028f.oxygen-content.c1-display-fields",
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-display-fields.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v3"
      ],
      "chiefComplaint": "Finger clip interpretation",
      "taskTextShort": "Which blood quantity is absent from this patient's listed pulse-oximeter display?",
      "taskText": "Which blood quantity is absent from this patient's listed pulse-oximeter display?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
        "line": 10,
        "export": "OXYGEN_CONTENT_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 17,
          "export": "GS028_20261007_VARIETY2_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 55,
          "export": "GS028_20261007_VARIETY2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028f.oxygen.clip-display-limit",
        "claim.gs028f.oxygen.hemoglobin-carriage",
        "claim.gs028f.oxygen.anemia-content-limit"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028f.oxygen-content.c1-display-fields.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.2defb189847317e1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "caseId": "case.gs028f.oxygen-content.c1-reassurance-note",
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-reassurance-note.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v4"
      ],
      "chiefComplaint": "Anemia note review",
      "taskTextShort": "Which interpretation of this patient's normal SpO2 and reduced hemoglobin is incorrect?",
      "taskText": "Which interpretation of this patient's normal SpO2 and reduced hemoglobin is incorrect?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
        "line": 10,
        "export": "OXYGEN_CONTENT_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 17,
          "export": "GS028_20261007_VARIETY2_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 55,
          "export": "GS028_20261007_VARIETY2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028f.oxygen.saturation-fraction",
        "claim.gs028f.oxygen.hemoglobin-carriage",
        "claim.gs028f.oxygen.anemia-content-limit",
        "claim.gs028f.oxygen.clip-display-limit"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028f.oxygen-content.c1-reassurance-note.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.537f79c201c400c1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "caseId": "case.gs028f.oxygen-content.c1-same-fraction",
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-same-fraction.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v2"
      ],
      "chiefComplaint": "Oxygen number question",
      "taskTextShort": "Which combination matches this patient's unchanged saturation and reduced hemoglobin?",
      "taskText": "Which combination matches this patient's unchanged saturation and reduced hemoglobin?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
        "line": 10,
        "export": "OXYGEN_CONTENT_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 17,
          "export": "GS028_20261007_VARIETY2_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 10,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 55,
          "export": "GS028_20261007_VARIETY2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028f.oxygen.saturation-fraction",
        "claim.gs028f.oxygen.hemoglobin-carriage",
        "claim.gs028f.oxygen.anemia-content-limit"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028f.oxygen-content.c1-same-fraction.1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.9c7c97cb675b4a16",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
      "caseId": "case.n1.hemoglobin-measurement.v1",
      "nodeIds": [
        "node.n1.hemoglobin-measurement.v1"
      ],
      "variantIds": [
        "question.n1.hemoglobin-measurement.v1"
      ],
      "chiefComplaint": "Postoperative fatigue",
      "taskTextShort": "Which investigation should be arranged next for {patientName}'s postoperative fatigue?",
      "taskText": "Which investigation should be arranged next for {patientName}'s postoperative fatigue?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
        "line": 36,
        "export": "QUESTION_NEW_N1_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 36,
          "export": "QUESTION_NEW_N1_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 46,
          "export": "QUESTION_NEW_N1_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n1.c3c167a7739f",
        "claim.n1.39e090dfc4f0",
        "claim.n1.47d310305029",
        "claim.n1.05bd95260a85"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n1.hemoglobin-measurement.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.8c3db096d36a1368",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
      "caseId": "case.n1.hemoglobin-measurement.v1",
      "nodeIds": [
        "node.n1.hemoglobin-measurement.v1"
      ],
      "variantIds": [
        "question.n1.hemoglobin-measurement.v2"
      ],
      "chiefComplaint": "Postoperative fatigue",
      "taskTextShort": "Which assessment should {patientName}'s team prioritize before attributing his fatigue to persistent pulmonary oxygenation failure?",
      "taskText": "Which assessment should {patientName}'s team prioritize before attributing his fatigue to persistent pulmonary oxygenation failure?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
        "line": 27,
        "export": "QUESTION_NEW_N1_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 27,
          "export": "QUESTION_NEW_N1_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 35,
          "export": "QUESTION_NEW_N1_ROUND2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n1.c3c167a7739f",
        "claim.n1.39e090dfc4f0",
        "claim.n1.47d310305029",
        "claim.n1.05bd95260a85"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n1.hemoglobin-measurement.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.f96fde9a7e92c352",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n1r3.oxygenation-red-cell-fatigue-workup",
      "caseId": "case.n1.hemoglobin-measurement.v1",
      "nodeIds": [
        "node.n1.hemoglobin-measurement.v1"
      ],
      "variantIds": [
        "question.n1.hemoglobin-measurement.v3"
      ],
      "chiefComplaint": "Postoperative fatigue",
      "taskTextShort": "Which assessment should {patientName}'s team prioritize for the current findings?",
      "taskText": "Which assessment should {patientName}'s team prioritize for the current findings?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
        "line": 34,
        "export": "QUESTION_NEW_N1_ROUND3_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 34,
          "export": "QUESTION_NEW_N1_ROUND3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 41,
          "export": "QUESTION_NEW_N1_ROUND3_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n1.c3c167a7739f",
        "claim.n1.39e090dfc4f0",
        "claim.n1.47d310305029",
        "claim.n1r3.acefc98ce84f"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n1.hemoglobin-measurement.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.617e60b07591c6d7",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n2.ventilator-elastic-versus-resistive-load",
      "caseId": "case.n2.ventilator-elastic-versus-resistive-load.v1",
      "nodeIds": [
        "node.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "variantIds": [
        "question.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "chiefComplaint": "Ventilation record review",
      "taskTextShort": "Which pressure-mechanics interpretation is supported by {patientName}'s controlled measurements?",
      "taskText": "Which pressure-mechanics interpretation is supported by {patientName}'s controlled measurements?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
        "line": 30,
        "export": "QUESTION_NEW_N2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 30,
          "export": "QUESTION_NEW_N2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 37,
          "export": "QUESTION_NEW_N2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n2.456c6686c997"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n2.ventilator-elastic-versus-resistive-load.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.7c365f1e947647b7",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n2.ventilator-elastic-versus-resistive-load",
      "caseId": "case.n2.ventilator-elastic-versus-resistive-load.v1",
      "nodeIds": [
        "node.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "variantIds": [
        "question.n2.ventilator-elastic-versus-resistive-load.v2"
      ],
      "chiefComplaint": "Ventilation review",
      "taskTextShort": "Which measurement should guide {patientName}'s next mechanical reassessment after the flow change?",
      "taskText": "Which measurement should guide {patientName}'s next mechanical reassessment after the flow change?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
        "line": 28,
        "export": "QUESTION_NEW_N2_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 28,
          "export": "QUESTION_NEW_N2_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 36,
          "export": "QUESTION_NEW_N2_ROUND2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n2.456c6686c997",
        "claim.n2r2.19f587fdd650"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n2.ventilator-elastic-versus-resistive-load.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.cdb263b7e25ee3d1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n2.ventilator-elastic-versus-resistive-load",
      "caseId": "case.n2.ventilator-elastic-versus-resistive-load.v1",
      "nodeIds": [
        "node.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "variantIds": [
        "question.n2.ventilator-elastic-versus-resistive-load.v3"
      ],
      "chiefComplaint": "Ventilation review",
      "taskTextShort": "What does the final recording establish for {patientName}'s proposed tidal-volume increase?",
      "taskText": "What does the final recording establish for {patientName}'s proposed tidal-volume increase?",
      "status": "draft parked",
      "retentionState": "explicit editorial park",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [
        "review.n2.ventilator-elastic-versus-resistive-load.v3"
      ],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
        "line": 43,
        "export": "QUESTION_NEW_N2_ROUND3_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 43,
          "export": "QUESTION_NEW_N2_ROUND3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 50,
          "export": "QUESTION_NEW_N2_ROUND3_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n2.456c6686c997",
        "claim.n2r2.19f587fdd650"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n2.ventilator-elastic-versus-resistive-load.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.a47b6f2fa1b68e8d",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n3.ards-weight-change-versus-tidal-volume-basis",
      "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "nodeIds": [
        "node.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      ],
      "variantIds": [
        "question.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      ],
      "chiefComplaint": "Ventilator record review",
      "taskTextShort": "Which weight basis should be used when reviewing {patientName}'s ARDS tidal-volume prescription through those fluid changes?",
      "taskText": "Which weight basis should be used when reviewing {patientName}'s ARDS tidal-volume prescription through those fluid changes?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
        "line": 28,
        "export": "QUESTION_NEW_N3_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 28,
          "export": "QUESTION_NEW_N3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 33,
          "export": "QUESTION_NEW_N3_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n3.92c3f176209c"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n3.ards-weight-change-versus-tidal-volume-basis.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    },
    {
      "recordId": "inventory.8ad385e711985bf9",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "nodeIds": [
        "node.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      ],
      "variantIds": [
        "question.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "chiefComplaint": "Ventilator record review",
      "taskTextShort": "Which interpretation and tidal-volume prescription best fit {patientName}'s current lung findings?",
      "taskText": "Which interpretation and tidal-volume prescription best fit {patientName}'s current lung findings?",
      "status": "held for owner",
      "retentionState": "explicit owner decision hold",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [
        "review.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
        "line": 33,
        "export": "QUESTION_NEW_N3_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 33,
          "export": "QUESTION_NEW_N3_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 39,
          "export": "QUESTION_NEW_N3_ROUND2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n3r2.fcdb2341f3b1",
        "claim.n3.92c3f176209c"
      ],
      "casePrimaryTopicSlug": "critical-respiratory-ventilation",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n3.ards-weight-change-versus-tidal-volume-basis.v1",
          "primaryTopicSlug": "critical-respiratory-ventilation"
        }
      ]
    }
  ],
  "concepts": [
    {
      "conceptId": "concept.ards.permeability-edema-mechanism",
      "displayName": "Permeability edema in ARDS",
      "learningObjective": "Identify increased alveolar-capillary permeability as the core mechanism of inflammatory pulmonary edema in ARDS.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.1b7f06337687230c",
        "inventory.5571d987823c6f1c",
        "inventory.584fc666ca77beec",
        "inventory.d6fe809ea31f1210"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 38,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 4,
          "export": "GS028_20261003_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.ards.predicted-body-weight-ventilation",
      "displayName": "Predicted body weight for ARDS ventilation",
      "learningObjective": "Use predicted body weight, not fluctuating actual weight, as the body-weight basis for ARDS tidal-volume selection.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.500b000f023b4fe5",
        "inventory.9ee95d2c54ebf09f",
        "inventory.959306070c2a6f2a",
        "inventory.8fdd1a516c05a3e8"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
          "line": 138,
          "export": "CRITICAL_CARE_FAMILY",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/families.ts",
          "line": 12,
          "export": "COVERAGE_GAP_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch.ts",
          "line": 4,
          "export": "GS028_20261003_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.gs028f.critical-care.normal-spo2-anemia-content",
      "displayName": "Distinguish saturation from oxygen content",
      "learningObjective": "Explain why a normal oxygen saturation does not establish adequate hemoglobin-dependent oxygen content or exclude supplied anemia.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.08016092c7d763fc",
        "inventory.66e27d0e1a5cafc9",
        "inventory.2defb189847317e1",
        "inventory.537f79c201c400c1"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
          "line": 19,
          "export": "OXYGEN_CONTENT_FAMILY",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch.ts",
          "line": 52,
          "export": "GS028_20261007_VARIETY2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
      "displayName": "Investigating oxygen-carrying capacity",
      "learningObjective": "Choose direct hemoglobin assessment when a normal pulse-oximeter result is being used to dismiss possible anemia.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.9c7c97cb675b4a16",
        "inventory.8c3db096d36a1368"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 23,
          "export": "QUESTION_NEW_N1_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 55,
          "export": "QUESTION_NEW_N1_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": true
    },
    {
      "conceptId": "concept.n1r3.oxygenation-red-cell-fatigue-workup",
      "displayName": "Postoperative fatigue with normal oxygenation",
      "learningObjective": "Interpret oxygenation and red-cell measurements together to prioritize evaluation of oxygen-carrying capacity.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.f96fde9a7e92c352"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 57,
          "export": "QUESTION_NEW_N1_ROUND3_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": true
    },
    {
      "conceptId": "concept.n2.ventilator-elastic-versus-resistive-load",
      "displayName": "Interpreting matched ventilator pressure changes",
      "learningObjective": "Distinguish increased elastic pressure requirements from isolated airway resistance using controlled peak and plateau pressure comparisons.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.617e60b07591c6d7",
        "inventory.7c365f1e947647b7",
        "inventory.cdb263b7e25ee3d1"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 20,
          "export": "QUESTION_NEW_N2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 57,
          "export": "QUESTION_NEW_N2_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 66,
          "export": "QUESTION_NEW_N2_ROUND3_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": true
    },
    {
      "conceptId": "concept.n3.ards-weight-change-versus-tidal-volume-basis",
      "displayName": "Ventilation after fluid-weight change",
      "learningObjective": "Distinguish rapidly changing actual weight from the body-size basis of tidal-volume selection when reassessing an ARDS prescription.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.a47b6f2fa1b68e8d"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 18,
          "export": "QUESTION_NEW_N3_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "displayName": "Ventilation after fluid-weight change",
      "learningObjective": "Recognize a permeability-edema context despite weight gain and choose the anthropometric weight basis for invasive ventilation.",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.8ad385e711985bf9"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 53,
          "export": "QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    }
  ],
  "caseAssignments": [
    {
      "caseId": "case.gs028d.ards.a-aspiration-protein-fluid",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.1b7f06337687230c"
      ],
      "nodeIds": [
        "node.gs028d.ards.a-aspiration-protein-fluid.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.a-pancreatitis-noncardiogenic",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.5571d987823c6f1c"
      ],
      "nodeIds": [
        "node.gs028d.ards.a-pancreatitis-noncardiogenic.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.a-pneumonia-barrier",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.584fc666ca77beec"
      ],
      "nodeIds": [
        "node.gs028d.ards.a-pneumonia-barrier.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.a-sepsis-endothelial-injury",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.d6fe809ea31f1210"
      ],
      "nodeIds": [
        "node.gs028d.ards.a-sepsis-endothelial-injury.1"
      ],
      "variantIds": [
        "question.ards.permeability-edema-mechanism.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.b-after-diuresis",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.500b000f023b4fe5"
      ],
      "nodeIds": [
        "node.gs028d.ards.b-after-diuresis.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.b-edema-weight-gain",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.9ee95d2c54ebf09f"
      ],
      "nodeIds": [
        "node.gs028d.ards.b-edema-weight-gain.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.b-low-actual-weight",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.959306070c2a6f2a"
      ],
      "nodeIds": [
        "node.gs028d.ards.b-low-actual-weight.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028d.ards.b-obesity-ventilator-audit",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.8fdd1a516c05a3e8"
      ],
      "nodeIds": [
        "node.gs028d.ards.b-obesity-ventilator-audit.1"
      ],
      "variantIds": [
        "question.ards.predicted-body-weight-ventilation.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028f.oxygen-content.c1-anemia-normal-clip",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.08016092c7d763fc"
      ],
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-anemia-normal-clip.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028f.oxygen-content.c1-display-fields",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.66e27d0e1a5cafc9"
      ],
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-display-fields.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028f.oxygen-content.c1-reassurance-note",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.2defb189847317e1"
      ],
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-reassurance-note.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028f.oxygen-content.c1-same-fraction",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "critical-respiratory-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.537f79c201c400c1"
      ],
      "nodeIds": [
        "node.gs028f.oxygen-content.c1-same-fraction.1"
      ],
      "variantIds": [
        "question.gs028f.critical-care.normal-spo2-anemia-content.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n1.hemoglobin-measurement.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.9c7c97cb675b4a16",
        "inventory.8c3db096d36a1368",
        "inventory.f96fde9a7e92c352"
      ],
      "nodeIds": [
        "node.n1.hemoglobin-measurement.v1"
      ],
      "variantIds": [
        "question.n1.hemoglobin-measurement.v1",
        "question.n1.hemoglobin-measurement.v2",
        "question.n1.hemoglobin-measurement.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n2.ventilator-elastic-versus-resistive-load.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.617e60b07591c6d7",
        "inventory.7c365f1e947647b7",
        "inventory.cdb263b7e25ee3d1"
      ],
      "nodeIds": [
        "node.n2.ventilator-elastic-versus-resistive-load.v1"
      ],
      "variantIds": [
        "question.n2.ventilator-elastic-versus-resistive-load.v1",
        "question.n2.ventilator-elastic-versus-resistive-load.v2",
        "question.n2.ventilator-elastic-versus-resistive-load.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.a47b6f2fa1b68e8d",
        "inventory.8ad385e711985bf9"
      ],
      "nodeIds": [
        "node.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      ],
      "variantIds": [
        "question.n3.ards-weight-change-versus-tidal-volume-basis.v1",
        "question.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    }
  ],
  "nodeAssignments": [
    {
      "nodeId": "node.gs028d.ards.a-aspiration-protein-fluid.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.1b7f06337687230c"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.a-pancreatitis-noncardiogenic.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.5571d987823c6f1c"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.a-pneumonia-barrier.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.584fc666ca77beec"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.a-sepsis-endothelial-injury.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.d6fe809ea31f1210"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.b-after-diuresis.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.500b000f023b4fe5"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.b-edema-weight-gain.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.9ee95d2c54ebf09f"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.b-low-actual-weight.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.959306070c2a6f2a"
      ]
    },
    {
      "nodeId": "node.gs028d.ards.b-obesity-ventilator-audit.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.8fdd1a516c05a3e8"
      ]
    },
    {
      "nodeId": "node.gs028f.oxygen-content.c1-anemia-normal-clip.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.08016092c7d763fc"
      ]
    },
    {
      "nodeId": "node.gs028f.oxygen-content.c1-display-fields.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.66e27d0e1a5cafc9"
      ]
    },
    {
      "nodeId": "node.gs028f.oxygen-content.c1-reassurance-note.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.2defb189847317e1"
      ]
    },
    {
      "nodeId": "node.gs028f.oxygen-content.c1-same-fraction.1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.537f79c201c400c1"
      ]
    },
    {
      "nodeId": "node.n1.hemoglobin-measurement.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
        "concept.n1r3.oxygenation-red-cell-fatigue-workup"
      ],
      "inventoryRecordIds": [
        "inventory.9c7c97cb675b4a16",
        "inventory.8c3db096d36a1368",
        "inventory.f96fde9a7e92c352"
      ]
    },
    {
      "nodeId": "node.n2.ventilator-elastic-versus-resistive-load.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.ventilator-elastic-versus-resistive-load"
      ],
      "inventoryRecordIds": [
        "inventory.617e60b07591c6d7",
        "inventory.7c365f1e947647b7",
        "inventory.cdb263b7e25ee3d1"
      ]
    },
    {
      "nodeId": "node.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.ards-weight-change-versus-tidal-volume-basis",
        "concept.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "inventoryRecordIds": [
        "inventory.a47b6f2fa1b68e8d",
        "inventory.8ad385e711985bf9"
      ]
    }
  ],
  "variantAssignments": [
    {
      "variantId": "question.ards.permeability-edema-mechanism.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.584fc666ca77beec"
      ]
    },
    {
      "variantId": "question.ards.permeability-edema-mechanism.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.1b7f06337687230c"
      ]
    },
    {
      "variantId": "question.ards.permeability-edema-mechanism.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.5571d987823c6f1c"
      ]
    },
    {
      "variantId": "question.ards.permeability-edema-mechanism.v4",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.permeability-edema-mechanism"
      ],
      "inventoryRecordIds": [
        "inventory.d6fe809ea31f1210"
      ]
    },
    {
      "variantId": "question.ards.predicted-body-weight-ventilation.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.8fdd1a516c05a3e8"
      ]
    },
    {
      "variantId": "question.ards.predicted-body-weight-ventilation.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.9ee95d2c54ebf09f"
      ]
    },
    {
      "variantId": "question.ards.predicted-body-weight-ventilation.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.959306070c2a6f2a"
      ]
    },
    {
      "variantId": "question.ards.predicted-body-weight-ventilation.v4",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.ards.predicted-body-weight-ventilation"
      ],
      "inventoryRecordIds": [
        "inventory.500b000f023b4fe5"
      ]
    },
    {
      "variantId": "question.gs028f.critical-care.normal-spo2-anemia-content.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.08016092c7d763fc"
      ]
    },
    {
      "variantId": "question.gs028f.critical-care.normal-spo2-anemia-content.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.537f79c201c400c1"
      ]
    },
    {
      "variantId": "question.gs028f.critical-care.normal-spo2-anemia-content.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.66e27d0e1a5cafc9"
      ]
    },
    {
      "variantId": "question.gs028f.critical-care.normal-spo2-anemia-content.v4",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028f.critical-care.normal-spo2-anemia-content"
      ],
      "inventoryRecordIds": [
        "inventory.2defb189847317e1"
      ]
    },
    {
      "variantId": "question.n1.hemoglobin-measurement.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.oxygen-saturation-missing-hemoglobin-assessment"
      ],
      "inventoryRecordIds": [
        "inventory.9c7c97cb675b4a16"
      ]
    },
    {
      "variantId": "question.n1.hemoglobin-measurement.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.oxygen-saturation-missing-hemoglobin-assessment"
      ],
      "inventoryRecordIds": [
        "inventory.8c3db096d36a1368"
      ]
    },
    {
      "variantId": "question.n1.hemoglobin-measurement.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1r3.oxygenation-red-cell-fatigue-workup"
      ],
      "inventoryRecordIds": [
        "inventory.f96fde9a7e92c352"
      ]
    },
    {
      "variantId": "question.n2.ventilator-elastic-versus-resistive-load.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.ventilator-elastic-versus-resistive-load"
      ],
      "inventoryRecordIds": [
        "inventory.617e60b07591c6d7"
      ]
    },
    {
      "variantId": "question.n2.ventilator-elastic-versus-resistive-load.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.ventilator-elastic-versus-resistive-load"
      ],
      "inventoryRecordIds": [
        "inventory.7c365f1e947647b7"
      ]
    },
    {
      "variantId": "question.n2.ventilator-elastic-versus-resistive-load.v3",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.ventilator-elastic-versus-resistive-load"
      ],
      "inventoryRecordIds": [
        "inventory.cdb263b7e25ee3d1"
      ]
    },
    {
      "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v1",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.ards-weight-change-versus-tidal-volume-basis"
      ],
      "inventoryRecordIds": [
        "inventory.a47b6f2fa1b68e8d"
      ]
    },
    {
      "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.ards-weight-change-versus-tidal-volume-basis.v2"
      ],
      "inventoryRecordIds": [
        "inventory.8ad385e711985bf9"
      ]
    }
  ],
  "identityReuseNotes": [],
  "recordedHolds": [
    {
      "id": "review.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "kind": "owner_decision",
      "recordFile": "docs/research/question-new-n3-round4-20261110.json",
      "reason": "The weight-basis fact does not support an exact ventilator adjustment. A pressure-limited bedside order would be a useful new practical objective if the key is confirmed.",
      "match": {
        "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v2",
        "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      },
      "ownerQuestion": "In ARDS with tidal volume already at 6 mL/kg predicted body weight and plateau pressure still 32 cm H2O, should the keyed next change be a lower tidal volume rather than waiting for diuresis to lower the scale weight?",
      "inventoryRecordIds": [
        "inventory.8ad385e711985bf9"
      ]
    },
    {
      "id": "review.n2.ventilator-elastic-versus-resistive-load.v3",
      "kind": "editorial_revise_park",
      "recordFile": "docs/research/question-new-n2-source-hold-disposition-20261105.json",
      "reason": "Retained REVISE disposition in the N2 source-hold/acceptance ledger.",
      "match": {
        "variantId": "question.n2.ventilator-elastic-versus-resistive-load.v3"
      },
      "inventoryRecordIds": [
        "inventory.cdb263b7e25ee3d1"
      ]
    }
  ],
  "unkeyedDraftSlots": [],
  "withheldTeachingPoints": [],
  "ownerApprovalsNeeded": [
    {
      "id": "review.n3.ards-weight-change-versus-tidal-volume-basis.v2",
      "kind": "owner_decision",
      "recordFile": "docs/research/question-new-n3-round4-20261110.json",
      "reason": "The weight-basis fact does not support an exact ventilator adjustment. A pressure-limited bedside order would be a useful new practical objective if the key is confirmed.",
      "match": {
        "variantId": "question.n3.ards-weight-change-versus-tidal-volume-basis.v2",
        "caseId": "case.n3.ards-weight-change-versus-tidal-volume-basis.v1"
      },
      "ownerQuestion": "In ARDS with tidal volume already at 6 mL/kg predicted body weight and plateau pressure still 32 cm H2O, should the keyed next change be a lower tidal volume rather than waiting for diuresis to lower the scale weight?",
      "primaryTopicSlug": "critical-respiratory-ventilation",
      "inventoryRecordIds": [
        "inventory.8ad385e711985bf9"
      ]
    }
  ],
  "frozenPassAndClinicalApprovals": [
    {
      "disposition": "none_in_assigned_lane",
      "basis": "Program exact assigned rows have no editorial acceptance or named approval; original N1/N2/N3 independent reviews for assigned drafts all say REVISE. Adjacent PASS versions in those modules are out of lane and untouched.",
      "reviewFiles": [
        "docs/research/question-new-n1-review-20261104.json",
        "docs/research/question-new-n1-review2-20261104.json",
        "docs/research/question-new-n1-review3-20261104.json",
        "docs/research/question-new-n2-review-20261104.json",
        "docs/research/question-new-n2-review2-20261104.json",
        "docs/research/question-new-n2-review3-20261104.json",
        "docs/research/question-new-n3-review-20261105.json",
        "docs/research/question-new-n3-review2-20261105.json",
        "docs/research/question-new-n3-review3-20261105.json",
        "docs/research/question-new-n3-round4-review-20261110.json"
      ]
    }
  ],
  "sourceHashes": [
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts",
      "currentSha256": "d6ab496f44bf8442b40011d9433ec982b4c4895f67695da23b6b9f9b707cef9d",
      "snapshotSha256": "d6ab496f44bf8442b40011d9433ec982b4c4895f67695da23b6b9f9b707cef9d",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts",
      "currentSha256": "b4152db060d121aac083a2a1d47a8285e3dcbbeb42333da7616c2b2bdbad2511",
      "snapshotSha256": "b4152db060d121aac083a2a1d47a8285e3dcbbeb42333da7616c2b2bdbad2511",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
      "currentSha256": "0d917b6501740fabdad2360dc4fdc0c7e1d142ffad2c0a38769de83382c60303",
      "snapshotSha256": "0d917b6501740fabdad2360dc4fdc0c7e1d142ffad2c0a38769de83382c60303",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
      "currentSha256": "14af52c517d802fd02c10b51e7d3a93e6d4febf40272fb3d2f154d2bc21fe093",
      "snapshotSha256": "14af52c517d802fd02c10b51e7d3a93e6d4febf40272fb3d2f154d2bc21fe093",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
      "currentSha256": "f7a6cba0ecd17c1e0d437f73268a65bdd1d6d2c7e3c058e510e4e02fd37d44d5",
      "snapshotSha256": "f7a6cba0ecd17c1e0d437f73268a65bdd1d6d2c7e3c058e510e4e02fd37d44d5",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
      "currentSha256": "ef0f0ecadb8b46bbfdad31436d4f324d2221f064eb0f8c2545e5bfe33aec76bc",
      "snapshotSha256": "ef0f0ecadb8b46bbfdad31436d4f324d2221f064eb0f8c2545e5bfe33aec76bc",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
      "currentSha256": "90b905c378e0fa31a4f9bf003c62b0e7e5f820d069f417b61f4e5ca5c0a2493c",
      "snapshotSha256": "90b905c378e0fa31a4f9bf003c62b0e7e5f820d069f417b61f4e5ca5c0a2493c",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
      "currentSha256": "8c3e9b2f5d998b31d97414051911513ff4c5f1ed1581b1032210a37c5bf8bf25",
      "snapshotSha256": "8c3e9b2f5d998b31d97414051911513ff4c5f1ed1581b1032210a37c5bf8bf25",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
      "currentSha256": "b1558d6ad01cc14b99f53e498ed48e355d222aa4e04d51c9589fed03112f923a",
      "snapshotSha256": "b1558d6ad01cc14b99f53e498ed48e355d222aa4e04d51c9589fed03112f923a",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
      "currentSha256": "16c622e73d76a8b12a6c676de202ae31d166eb2c922848bc06f0514e5b7b2569",
      "snapshotSha256": "16c622e73d76a8b12a6c676de202ae31d166eb2c922848bc06f0514e5b7b2569",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/question-ship-manifest.ts",
      "currentSha256": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
      "snapshotSha256": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
      "drift": false
    },
    {
      "file": "packages/clinical-content/src/synthetic-content.ts",
      "currentSha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
      "snapshotSha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
      "drift": false
    },
    {
      "file": "docs/clinical/question-authoring-standard.md",
      "currentSha256": "87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671",
      "snapshotSha256": "87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671",
      "drift": false
    },
    {
      "file": "docs/research/question-topic-worker-brief-template-20261111.md",
      "currentSha256": "59ca1edf7b3ff2ee443f45afd3e083a734627858d897468dd566aae47fea788e",
      "snapshotSha256": null,
      "drift": false
    },
    {
      "file": "docs/research/question-topic-program-20261111.json",
      "currentSha256": "a1c585199633d243bc8d7e2f166916e74253b6c4a1b1eeceb09efba871baf9e4",
      "snapshotSha256": null,
      "drift": false
    }
  ]
}
```

</details>

## Progress and next action

Complete research, 20/20 variant audit, 25 retained raw serializations (20 distinct visible contexts), and 14 drafted nodes in seven existing-setting cases. The five additional serializations differ only in property order; recursive value comparison found no extra visible task/profile/explanation variation. Original N2 graph was opened and inspected: its values and flow labels match the exact old description.

Counts: **0 Keep, 5 Rewrite, 15 Retire-and-replace proposals; 9 new gap questions**. Five rewritten variants plus nine new questions make 14 proposed scored nodes, compared with 12 live original nodes. Four cases are multi-decision sequences. One stable concept is reused; four successor meanings and nine new gap meanings have 13 separate new IDs. Retirement/integration are manager proposals, not applied changes.

Next: manager inspects the actual five-file diff and validation, obtains independent challenge, resolves listed clinical questions with Melissa, then accepts exact definitions for integration. Automated structure checks and author attacks do not grant clinical approval.

## Ranked testable concepts and coverage/gap matrix

Ranking is an original qualitative judgment of clinical consequence and likely testability, not an official exam weight or measured difficulty. No question bank, recalled exam, proprietary curriculum or answer analytics were used.

| Rank | Decision | Existing exact rows | Proposed node | Why this matters |
|---|---|---:|---|---|
| 1 | Initial lung-protective prescription | 5 | `ards-pbw-order` | Repeated high-consequence ICU prescription error; obesity and fluid gain can mislead the weight index. |
| 2 | Pressure-constrained volume reassessment | 1 | `ards-pressure-limit` | A correct starting weight rule can still leave injurious distending pressure; this is a different decision. |
| 3 | Peak versus static pressure acquisition | 3 | `pressure-assessment` | A peak alarm alone cannot direct airway versus lung intervention. |
| 4 | Intrinsic PEEP and minute-ventilation tradeoff | 0 | `expiratory-time` | Treating hypercapnia by shortening expiration can aggravate the problem. |
| 5 | Prone rescue after protective optimization | 4 | `ards-prone-escalation` | Requires interpreting severity under actual oxygen support and sequencing rescue. |
| 6 | Acute-on-chronic ventilatory failure and NIV | 0 | `copd-niv` | Residents must separate oxygenation from ventilation and baseline from new acidosis. |
| 7 | Response-based NIV escalation | 0 | `copd-niv-failure` | An improved oxygen display can conceal worsening ventilation and clinical function. |
| 8 | Readiness and the isolated screening index | 0 | `sbt-readiness` | An index is often used as an unnecessary gate instead of a monitored trial. |
| 9 | Support conditions during breathing trials | 0 | `sbt-fio2` | A favorable result under increased support may not establish the intended capacity. |
| 10 | Independent airway-clearance readiness | 0 | `extubation-clearance` | Breathing tolerance is distinct from clearance after tube removal. |
| 11 | Preventive post-extubation support | 0 | `copd-planned-extubation` | Risk and baseline hypercapnia change the removal/support plan. |
| 12 | Prevention versus rescue NIV | 0 | `postextubation-rescue` | The same device has different support depending on phase and patient population. |
| 13 | Oxygen carriage, extraction and blood flow | 7 | `delivery-flow-assessment` | Normal saturation is insufficient; a real delivery assessment should change the next investigation. |
| 14 | Resistive loading and directed airway clearance | 0 | `secretion-response` | Interpret mechanics and the airway observation together before changing volume or treating bronchospasm. |

The JSON ranked-concept rows give the exact source/claim/variant/case mappings, raw evidence, closest error and consequence. Every node has a narrow objective and two documented consequential inferences; difficulty is a qualitative author prediction awaiting independent review.

Remaining scope and research limits:

- **Ventilator dyssynchrony and double triggering:** No scored draft; requires a usable independently constructed tracing and a supported specific setting decision. No image promised or absent asset referenced.
- **Cuff-leak testing, post-extubation stridor and tracheostomy timing:** Airway-complication coverage remains incomplete; exact eligibility, steroid/timing choices and credible alternatives require a later targeted packet.
- **HFNC versus NIV for de novo hypoxemic failure and individualized PEEP:** No universal preference or individualized PEEP titration key authored where evidence and population boundaries remain unsettled.
- **Quantitative oxygen-content equation and exact transfusion exceptions:** No equation or new transfusion-rule question forced into the respiratory lane. AABB threshold researched but not used as a draft key. Source limitations retained.
- **Drug choices and primary acid-base calculations:** Boundary: anesthesia/analgesia/pharmacology and fluids/electrolytes/acid-base. No scored medication, reversal, dose or compensation calculation.

## Complete audit

| Inventory record | Exact variant | Status | Verdict | Proposed successor |
|---|---|---|---|---|
| `inventory.1b7f06337687230c` | `question.ards.permeability-edema-mechanism.v2` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1` |
| `inventory.5571d987823c6f1c` | `question.ards.permeability-edema-mechanism.v3` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1` |
| `inventory.584fc666ca77beec` | `question.ards.permeability-edema-mechanism.v1` | live original | Rewrite | `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1` |
| `inventory.d6fe809ea31f1210` | `question.ards.permeability-edema-mechanism.v4` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1` |
| `inventory.500b000f023b4fe5` | `question.ards.predicted-body-weight-ventilation.v4` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1` |
| `inventory.9ee95d2c54ebf09f` | `question.ards.predicted-body-weight-ventilation.v2` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1` |
| `inventory.959306070c2a6f2a` | `question.ards.predicted-body-weight-ventilation.v3` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1` |
| `inventory.8fdd1a516c05a3e8` | `question.ards.predicted-body-weight-ventilation.v1` | live original | Rewrite | `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1` |
| `inventory.08016092c7d763fc` | `question.gs028f.critical-care.normal-spo2-anemia-content.v1` | live original | Rewrite | `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` |
| `inventory.66e27d0e1a5cafc9` | `question.gs028f.critical-care.normal-spo2-anemia-content.v3` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` |
| `inventory.2defb189847317e1` | `question.gs028f.critical-care.normal-spo2-anemia-content.v4` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` |
| `inventory.537f79c201c400c1` | `question.gs028f.critical-care.normal-spo2-anemia-content.v2` | live original | Retire-and-replace | `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` |
| `inventory.9c7c97cb675b4a16` | `question.n1.hemoglobin-measurement.v1` | draft parked | Retire-and-replace | `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` |
| `inventory.8c3db096d36a1368` | `question.n1.hemoglobin-measurement.v2` | draft parked | Retire-and-replace | `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` |
| `inventory.f96fde9a7e92c352` | `question.n1.hemoglobin-measurement.v3` | draft parked | Retire-and-replace | `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` |
| `inventory.617e60b07591c6d7` | `question.n2.ventilator-elastic-versus-resistive-load.v1` | draft parked | Retire-and-replace | `question.topic.critical-respiratory-ventilation.pressure-assessment.v1` |
| `inventory.7c365f1e947647b7` | `question.n2.ventilator-elastic-versus-resistive-load.v2` | draft parked | Retire-and-replace | `question.topic.critical-respiratory-ventilation.pressure-assessment.v1` |
| `inventory.cdb263b7e25ee3d1` | `question.n2.ventilator-elastic-versus-resistive-load.v3` | draft parked | Rewrite | `question.topic.critical-respiratory-ventilation.pressure-assessment.v1` |
| `inventory.a47b6f2fa1b68e8d` | `question.n3.ards-weight-change-versus-tidal-volume-basis.v1` | draft parked | Retire-and-replace | `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1` |
| `inventory.8ad385e711985bf9` | `question.n3.ards-weight-change-versus-tidal-volume-basis.v2` | held for owner | Rewrite | `question.topic.critical-respiratory-ventilation.ards-pressure-limit.v1` |

All exact assigned variants and source exports are represented once in these verdict totals. The JSON also records verdicts for all 25 preserved raw contexts, source-file hashes, case/node hashes, finite-profile counts and historical independent REVISE decisions. There is no exact assigned independent PASS or Melissa-approved version to inherit. Adjacent passed versions in N1/N2/N3 modules are untouched.

## Before packets for every rewrite or replacement

All original material below is repository-authored question content, not source prose. Old definitions, clinical-review states, timing/order identities, frozen encounters and histories are retained. Key shown first for review only.

### question.ards.permeability-edema-mechanism.v2

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1`.

- Aspiration version: presentation explicitly says ARDS and inflammatory edema, then the task names the lung barrier; the permeability option follows without interpreting raw findings.
- The visible presentation names ARDS and inflammatory/noncardiogenic edema before asking for its associated mechanism; the resident need not infer a care-changing finding.
- Hydrostatic/oncotic/lymphatic labels provide parallel grammar, but three siblings repeat the same low-level distinction. No exact accepted basic-purpose reference is supplied.
- Replace this scored objective with a staged ARDS support decision; preserve the mechanism claim as background and retain the old concept/history.

Before record `inventory.1b7f06337687230c`; case `case.gs028d.ards.a-aspiration-protein-fluid`; node `node.gs028d.ards.a-aspiration-protein-fluid.1`; concept `concept.ards.permeability-edema-mechanism`. Source: `packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts` → `CRITICAL_CARE_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `00ac6e46ce860bbe4f621d9ef18246b82bd1f4bcc99e1ff58ec78d2c808e277e`; node SHA-256: `51acf7ac95baff3846eaff8bf892d70321ffe34197619bd2a88a878247abb7ae`.

Complaint: **Breathing recovery visit**. Canonical patient: {patientName}; {"ageYears":29,"sexLabel":"Female"}.

Presentation: {patientName}, a 29-year-old woman, follows up after an aspiration event caused ARDS requiring hospital intensive care. Cardiac evaluation did not identify acute pump failure, and the ICU note described inflammatory pulmonary edema.

Current update: None.

None.

Task: **Which change at the lung barrier most directly produced this patient's ARDS-associated edema?**

Key shown first for review only:

1. **Alveolar-capillary permeability** — key. undefined
2. **Increased pulmonary capillary pressure**. undefined
3. **Decreased circulating protein concentration**. undefined
4. **Decreased pulmonary lymphatic drainage**. undefined

Explanation: The inflammatory edema of ARDS reflects increased permeability across an injured alveolar-capillary barrier.

Finite profiles: `profile.gs028d.ards.a-aspiration-protein-fluid.female.29`: {"ageYears":29,"sexLabel":"Female"}; {patientName}, a 29-year-old woman, follows up after an aspiration event caused ARDS requiring hospital intensive care. Cardiac evaluation did not identify acute pump failure, and the ICU note described inflammatory pulmonary edema.

`profile.gs028d.ards.a-aspiration-protein-fluid.male.29`: {"ageYears":29,"sexLabel":"Male"}; {patientName}, a 29-year-old man, follows up after an aspiration event caused ARDS requiring hospital intensive care. Cardiac evaluation did not identify acute pump failure, and the ICU note described inflammatory pulmonary edema.

`profile.gs028d.ards.a-aspiration-protein-fluid.female.64`: {"ageYears":64,"sexLabel":"Female"}; {patientName}, a 64-year-old woman, follows up after an aspiration event caused ARDS requiring hospital intensive care. Cardiac evaluation did not identify acute pump failure, and the ICU note described inflammatory pulmonary edema.

`profile.gs028d.ards.a-aspiration-protein-fluid.male.64`: {"ageYears":64,"sexLabel":"Male"}; {patientName}, a 64-year-old man, follows up after an aspiration event caused ARDS requiring hospital intensive care. Cardiac evaluation did not identify acute pump failure, and the ICU note described inflammatory pulmonary edema.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.ards.permeability-edema-mechanism.v3

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1`.

- Pancreatitis version: the hospital summary already distinguishes the edema from cardiogenic edema; the key restates that supplied classification.
- The visible presentation names ARDS and inflammatory/noncardiogenic edema before asking for its associated mechanism; the resident need not infer a care-changing finding.
- Hydrostatic/oncotic/lymphatic labels provide parallel grammar, but three siblings repeat the same low-level distinction. No exact accepted basic-purpose reference is supplied.
- Replace this scored objective with a staged ARDS support decision; preserve the mechanism claim as background and retain the old concept/history.

Before record `inventory.5571d987823c6f1c`; case `case.gs028d.ards.a-pancreatitis-noncardiogenic`; node `node.gs028d.ards.a-pancreatitis-noncardiogenic.1`; concept `concept.ards.permeability-edema-mechanism`. Source: `packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts` → `CRITICAL_CARE_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `12681c7cee61142d6e7e9fc3fdbea2be3e290ca9813ca92660de9875d23e71f0`; node SHA-256: `8a6bb9f933b9d39bfbfd73627f31791b31867ccfd4365ddf7813e8b253c7daf3`.

Complaint: **Hospital record review**. Canonical patient: {patientName}; {"ageYears":44,"sexLabel":"Female"}.

Presentation: {patientName}, a 44-year-old woman, is seen after recovery from pancreatitis complicated by ARDS. The hospital summary distinguishes the bilateral lung edema from cardiogenic pulmonary edema.

Current update: None.

None.

Task: **Which mechanism supports the hospital team's classification of this patient's edema as ARDS rather than isolated cardiogenic edema?**

Key shown first for review only:

1. **Inflammatory alveolar-capillary leak** — key. undefined
2. **Hydrostatic pulmonary venous congestion**. undefined
3. **Oncotic fluid shift from hypoalbuminemia**. undefined
4. **Lymphatic outflow obstruction**. undefined

Explanation: An inflammatory leak across the alveolar-capillary barrier is the core edema mechanism in ARDS.

Finite profiles: `profile.gs028d.ards.a-pancreatitis-noncardiogenic.female.44`: {"ageYears":44,"sexLabel":"Female"}; {patientName}, a 44-year-old woman, is seen after recovery from pancreatitis complicated by ARDS. The hospital summary distinguishes the bilateral lung edema from cardiogenic pulmonary edema.

`profile.gs028d.ards.a-pancreatitis-noncardiogenic.male.44`: {"ageYears":44,"sexLabel":"Male"}; {patientName}, a 44-year-old man, is seen after recovery from pancreatitis complicated by ARDS. The hospital summary distinguishes the bilateral lung edema from cardiogenic pulmonary edema.

`profile.gs028d.ards.a-pancreatitis-noncardiogenic.female.62`: {"ageYears":62,"sexLabel":"Female"}; {patientName}, a 62-year-old woman, is seen after recovery from pancreatitis complicated by ARDS. The hospital summary distinguishes the bilateral lung edema from cardiogenic pulmonary edema.

`profile.gs028d.ards.a-pancreatitis-noncardiogenic.male.62`: {"ageYears":62,"sexLabel":"Male"}; {patientName}, a 62-year-old man, is seen after recovery from pancreatitis complicated by ARDS. The hospital summary distinguishes the bilateral lung edema from cardiogenic pulmonary edema.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.ards.permeability-edema-mechanism.v1

**Rewrite** → `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1`.

- Pneumonia version: bilateral inflammatory pulmonary edema without primary left-heart failure directly scaffolds the mechanism key; no management decision follows.
- The visible presentation names ARDS and inflammatory/noncardiogenic edema before asking for its associated mechanism; the resident need not infer a care-changing finding.
- Hydrostatic/oncotic/lymphatic labels provide parallel grammar, but three siblings repeat the same low-level distinction. No exact accepted basic-purpose reference is supplied.
- Replace this scored objective with a staged ARDS support decision; preserve the mechanism claim as background and retain the old concept/history.

Before record `inventory.584fc666ca77beec`; case `case.gs028d.ards.a-pneumonia-barrier`; node `node.gs028d.ards.a-pneumonia-barrier.1`; concept `concept.ards.permeability-edema-mechanism`. Source: `packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts` → `CRITICAL_CARE_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `29eb15157e4d2f242d59d1cf9c466a18239f335fa5aceca936e2c555b7bc45f0`; node SHA-256: `0f61312a4438b64f22248ea79888eb5f52b6ad92e5530fb69c7ee3b69c9daf5a`.

Complaint: **ICU record question**. Canonical patient: {patientName}; {"ageYears":38,"sexLabel":"Female"}.

Presentation: {patientName}, a 38-year-old woman, returns after recovering from pneumonia-associated ARDS treated in the hospital. The discharge record describes bilateral inflammatory pulmonary edema without primary left-heart failure.

Current update: None.

None.

Task: **Which pathophysiologic mechanism best explains the pulmonary edema documented during this patient's ARDS admission?**

Key shown first for review only:

1. **Alveolar-capillary permeability** — key. undefined
2. **Elevated pulmonary venous pressure**. undefined
3. **Reduced plasma oncotic pressure**. undefined
4. **Obstructed pulmonary lymphatic flow**. undefined

Explanation: ARDS is permeability edema caused by inflammatory disruption of the alveolar-capillary barrier, although another edema mechanism can coexist in an individual patient.

Finite profiles: `profile.gs028d.ards.a-pneumonia-barrier.female.38`: {"ageYears":38,"sexLabel":"Female"}; {patientName}, a 38-year-old woman, returns after recovering from pneumonia-associated ARDS treated in the hospital. The discharge record describes bilateral inflammatory pulmonary edema without primary left-heart failure.

`profile.gs028d.ards.a-pneumonia-barrier.male.38`: {"ageYears":38,"sexLabel":"Male"}; {patientName}, a 38-year-old man, returns after recovering from pneumonia-associated ARDS treated in the hospital. The discharge record describes bilateral inflammatory pulmonary edema without primary left-heart failure.

`profile.gs028d.ards.a-pneumonia-barrier.female.57`: {"ageYears":57,"sexLabel":"Female"}; {patientName}, a 57-year-old woman, returns after recovering from pneumonia-associated ARDS treated in the hospital. The discharge record describes bilateral inflammatory pulmonary edema without primary left-heart failure.

`profile.gs028d.ards.a-pneumonia-barrier.male.57`: {"ageYears":57,"sexLabel":"Male"}; {patientName}, a 57-year-old man, returns after recovering from pneumonia-associated ARDS treated in the hospital. The discharge record describes bilateral inflammatory pulmonary edema without primary left-heart failure.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.ards.permeability-edema-mechanism.v4

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1`.

- Sepsis version: absence of primary LV failure and the ARDS label support a basic mechanism association, but no observed finding changes a resident care plan.
- The visible presentation names ARDS and inflammatory/noncardiogenic edema before asking for its associated mechanism; the resident need not infer a care-changing finding.
- Hydrostatic/oncotic/lymphatic labels provide parallel grammar, but three siblings repeat the same low-level distinction. No exact accepted basic-purpose reference is supplied.
- Replace this scored objective with a staged ARDS support decision; preserve the mechanism claim as background and retain the old concept/history.

Before record `inventory.d6fe809ea31f1210`; case `case.gs028d.ards.a-sepsis-endothelial-injury`; node `node.gs028d.ards.a-sepsis-endothelial-injury.1`; concept `concept.ards.permeability-edema-mechanism`. Source: `packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts` → `CRITICAL_CARE_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `406a936359ca15f372162d987bf54cda265aba039e4d292cba700cf86fd8d7e4`; node SHA-256: `7933dac9dc00eb84f0ed248e7af18ea82d201ee8463de398b6505be95b49b108`.

Complaint: **Post-ICU questions**. Canonical patient: {patientName}; {"ageYears":51,"sexLabel":"Female"}.

Presentation: {patientName}, a 51-year-old woman, returns after septic shock and ARDS resolved during a hospital stay. The family asks why lung fluid accumulated despite no primary diagnosis of left-ventricular failure.

Current update: None.

None.

Task: **Which physiologic process best answers the family's question about this patient's ARDS-related lung edema?**

Key shown first for review only:

1. **Alveolar-capillary permeability** — key. undefined
2. **Pulmonary venous hydrostatic pressure**. undefined
3. **Plasma colloid oncotic pressure**. undefined
4. **Pulmonary lymphatic drainage capacity**. undefined

Explanation: Sepsis can injure the alveolar-capillary barrier; the resulting increased permeability produces the inflammatory pulmonary edema of ARDS.

Finite profiles: `profile.gs028d.ards.a-sepsis-endothelial-injury.female.51`: {"ageYears":51,"sexLabel":"Female"}; {patientName}, a 51-year-old woman, returns after septic shock and ARDS resolved during a hospital stay. The family asks why lung fluid accumulated despite no primary diagnosis of left-ventricular failure.

`profile.gs028d.ards.a-sepsis-endothelial-injury.male.51`: {"ageYears":51,"sexLabel":"Male"}; {patientName}, a 51-year-old man, returns after septic shock and ARDS resolved during a hospital stay. The family asks why lung fluid accumulated despite no primary diagnosis of left-ventricular failure.

`profile.gs028d.ards.a-sepsis-endothelial-injury.female.70`: {"ageYears":70,"sexLabel":"Female"}; {patientName}, a 70-year-old woman, returns after septic shock and ARDS resolved during a hospital stay. The family asks why lung fluid accumulated despite no primary diagnosis of left-ventricular failure.

`profile.gs028d.ards.a-sepsis-endothelial-injury.male.70`: {"ageYears":70,"sexLabel":"Male"}; {patientName}, a 70-year-old man, returns after septic shock and ARDS resolved during a hospital stay. The family asks why lung fluid accumulated despite no primary diagnosis of left-ventricular failure.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.ards.predicted-body-weight-ventilation.v4

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1`.

- After-diuresis version: three actual-weight timepoints all remain the same incorrect basis; no delivered volume or pressure response is supplied for an applied decision.
- The original task asks for a weight-basis label already scaffolded by fluid-dependent scale changes; dry/dosing-weight foils do not create a consequential second inference.
- Family presentations and finite demographic profiles preserve the same easy rule; adding a management companion would not independently repair this item.
- The concrete initial order now uses measured versus checked predicted mass. Persistent excessive plateau is a separate later objective and must have a separate new history.

Before record `inventory.500b000f023b4fe5`; case `case.gs028d.ards.b-after-diuresis`; node `node.gs028d.ards.b-after-diuresis.1`; concept `concept.ards.predicted-body-weight-ventilation`. Source: `packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts` → `CRITICAL_CARE_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `2c9f9ee2afa29e0611ebcf5bf9eeb68c1f507414af407dab8e61d44960954ae9`; node SHA-256: `50ea0d12fad941ea1994ad4a111788a9ff0bfc6730b8fd059f12be34f9da61f1`.

Complaint: **Discharge ventilation review**. Canonical patient: {patientName}; {"ageYears":47,"sexLabel":"Female"}.

Presentation: {patientName}, a 47-year-old woman returns after ARDS and invasive ventilation. The hospital record contains different weights before resuscitation, during fluid accumulation, and after diuresis.

Current update: None.

None.

Task: **Which body-weight measure provides the consistent basis for reviewing this patient's ARDS tidal-volume selection across those fluid shifts?**

Key shown first for review only:

1. **Predicted body weight** — key. undefined
2. **Pre-resuscitation body weight**. undefined
3. **Peak resuscitation body weight**. undefined
4. **Post-diuresis body weight**. undefined

Explanation: Predicted body weight provides the stable body-size basis used for ARDS tidal-volume selection across changing fluid states.

Finite profiles: `profile.gs028d.ards.b-after-diuresis.female.47`: {"ageYears":47,"sexLabel":"Female"}; {patientName}, a 47-year-old woman returns after ARDS and invasive ventilation. The hospital record contains different weights before resuscitation, during fluid accumulation, and after diuresis.

`profile.gs028d.ards.b-after-diuresis.male.47`: {"ageYears":47,"sexLabel":"Male"}; {patientName}, a 47-year-old man returns after ARDS and invasive ventilation. The hospital record contains different weights before resuscitation, during fluid accumulation, and after diuresis.

`profile.gs028d.ards.b-after-diuresis.female.69`: {"ageYears":69,"sexLabel":"Female"}; {patientName}, a 69-year-old woman returns after ARDS and invasive ventilation. The hospital record contains different weights before resuscitation, during fluid accumulation, and after diuresis.

`profile.gs028d.ards.b-after-diuresis.male.69`: {"ageYears":69,"sexLabel":"Male"}; {patientName}, a 69-year-old man returns after ARDS and invasive ventilation. The hospital record contains different weights before resuscitation, during fluid accumulation, and after diuresis.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.ards.predicted-body-weight-ventilation.v2

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1`.

- Edema-weight-gain version: the vignette foregrounds why the scale is fluid-dependent, so the predicted-weight label is selected before any prescription is interpreted.
- The original task asks for a weight-basis label already scaffolded by fluid-dependent scale changes; dry/dosing-weight foils do not create a consequential second inference.
- Family presentations and finite demographic profiles preserve the same easy rule; adding a management companion would not independently repair this item.
- The concrete initial order now uses measured versus checked predicted mass. Persistent excessive plateau is a separate later objective and must have a separate new history.

Before record `inventory.9ee95d2c54ebf09f`; case `case.gs028d.ards.b-edema-weight-gain`; node `node.gs028d.ards.b-edema-weight-gain.1`; concept `concept.ards.predicted-body-weight-ventilation`. Source: `packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts` → `CRITICAL_CARE_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `2caab7cc8d45f94f52fb3e7fc51e8e1a059fcb386892a16c2e8d9858b22ac519`; node SHA-256: `8ff0df260945e6ac7f1a6bae938a9b1f840f00ca1fc3bafa25a30157ed69806c`.

Complaint: **ICU chart follow-up**. Canonical patient: {patientName}; {"ageYears":36,"sexLabel":"Female"}.

Presentation: {patientName}, a 36-year-old woman returns after sepsis-associated ARDS. During intensive care, edema made the measured weight substantially higher than the pre-illness weight while invasive ventilation was underway.

Current update: None.

None.

Task: **Which body-weight measure should the reviewer use to assess the tidal-volume basis despite this patient's acute fluid gain?**

Key shown first for review only:

1. **Predicted body weight** — key. undefined
2. **Edematous measured weight**. undefined
3. **Estimated dry body weight**. undefined
4. **Adjusted dosing body weight**. undefined

Explanation: Acute edema changes scale weight but not the predicted-body-weight basis used to assess ARDS tidal volume.

Finite profiles: `profile.gs028d.ards.b-edema-weight-gain.female.36`: {"ageYears":36,"sexLabel":"Female"}; {patientName}, a 36-year-old woman returns after sepsis-associated ARDS. During intensive care, edema made the measured weight substantially higher than the pre-illness weight while invasive ventilation was underway.

`profile.gs028d.ards.b-edema-weight-gain.male.36`: {"ageYears":36,"sexLabel":"Male"}; {patientName}, a 36-year-old man returns after sepsis-associated ARDS. During intensive care, edema made the measured weight substantially higher than the pre-illness weight while invasive ventilation was underway.

`profile.gs028d.ards.b-edema-weight-gain.female.67`: {"ageYears":67,"sexLabel":"Female"}; {patientName}, a 67-year-old woman returns after sepsis-associated ARDS. During intensive care, edema made the measured weight substantially higher than the pre-illness weight while invasive ventilation was underway.

`profile.gs028d.ards.b-edema-weight-gain.male.67`: {"ageYears":67,"sexLabel":"Male"}; {patientName}, a 67-year-old man returns after sepsis-associated ARDS. During intensive care, edema made the measured weight substantially higher than the pre-illness weight while invasive ventilation was underway.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.ards.predicted-body-weight-ventilation.v3

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1`.

- Low-actual-weight version: low mass usefully reverses the obesity surface story, but the nutrition/drug-dosing foils do not compete at the ventilator-prescription stage.
- The original task asks for a weight-basis label already scaffolded by fluid-dependent scale changes; dry/dosing-weight foils do not create a consequential second inference.
- Family presentations and finite demographic profiles preserve the same easy rule; adding a management companion would not independently repair this item.
- The concrete initial order now uses measured versus checked predicted mass. Persistent excessive plateau is a separate later objective and must have a separate new history.

Before record `inventory.959306070c2a6f2a`; case `case.gs028d.ards.b-low-actual-weight`; node `node.gs028d.ards.b-low-actual-weight.1`; concept `concept.ards.predicted-body-weight-ventilation`. Source: `packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts` → `CRITICAL_CARE_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `f2ef4832279c558e3b4557ef3fb62055044de132c154705d3fb1f323db22bce0`; node SHA-256: `79e5b77ede94325397c91867f5b4b9d611abf64617e57d9b6f0fda3b436b8962`.

Complaint: **Recovery chart question**. Canonical patient: {patientName}; {"ageYears":31,"sexLabel":"Female"}.

Presentation: {patientName}, a 31-year-old woman is seen after aspiration-associated ARDS. The admission record notes a low actual body weight and documents invasive ventilation in the ICU.

Current update: None.

None.

Task: **Which body-weight measure should be used when judging whether the recorded tidal-volume strategy followed the ARDS ventilation principle?**

Key shown first for review only:

1. **Predicted body weight** — key. undefined
2. **Actual admission weight**. undefined
3. **Ideal nutrition goal weight**. undefined
4. **Adjusted medication weight**. undefined

Explanation: Predicted body weight anchors the tidal-volume assessment even when actual weight is unusually low.

Finite profiles: `profile.gs028d.ards.b-low-actual-weight.female.31`: {"ageYears":31,"sexLabel":"Female"}; {patientName}, a 31-year-old woman is seen after aspiration-associated ARDS. The admission record notes a low actual body weight and documents invasive ventilation in the ICU.

`profile.gs028d.ards.b-low-actual-weight.male.31`: {"ageYears":31,"sexLabel":"Male"}; {patientName}, a 31-year-old man is seen after aspiration-associated ARDS. The admission record notes a low actual body weight and documents invasive ventilation in the ICU.

`profile.gs028d.ards.b-low-actual-weight.female.55`: {"ageYears":55,"sexLabel":"Female"}; {patientName}, a 55-year-old woman is seen after aspiration-associated ARDS. The admission record notes a low actual body weight and documents invasive ventilation in the ICU.

`profile.gs028d.ards.b-low-actual-weight.male.55`: {"ageYears":55,"sexLabel":"Male"}; {patientName}, a 55-year-old man is seen after aspiration-associated ARDS. The admission record notes a low actual body weight and documents invasive ventilation in the ICU.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.ards.predicted-body-weight-ventilation.v1

**Rewrite** → `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1`.

- Obesity version: the generic audit asks for a weight label; the rewrite retains the same concept but turns the rule into an actual order with three credible numeric bases.
- The original task asks for a weight-basis label already scaffolded by fluid-dependent scale changes; dry/dosing-weight foils do not create a consequential second inference.
- Family presentations and finite demographic profiles preserve the same easy rule; adding a management companion would not independently repair this item.
- The concrete initial order now uses measured versus checked predicted mass. Persistent excessive plateau is a separate later objective and must have a separate new history.

Before record `inventory.8fdd1a516c05a3e8`; case `case.gs028d.ards.b-obesity-ventilator-audit`; node `node.gs028d.ards.b-obesity-ventilator-audit.1`; concept `concept.ards.predicted-body-weight-ventilation`. Source: `packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/critical-care.ts` → `CRITICAL_CARE_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `dd9c213e8dd69f915e4c972e16900ccd806a1e2e3feb42e395382a756dc8d680`; node SHA-256: `58f4f4dc6e558c19acda0772225a1a0f121ee7b6795c332a5e2cf87d4e63c5bc`.

Complaint: **Ventilator record review**. Canonical patient: {patientName}; {"ageYears":42,"sexLabel":"Female"}.

Presentation: {patientName}, a 42-year-old woman with obesity returns after pneumonia-associated ARDS requiring invasive ventilation. The quality review compares the hospital's tidal-volume setting with the appropriate weight basis.

Current update: None.

None.

Task: **Which body-weight measure should anchor the tidal-volume review for this patient's ARDS ventilation?**

Key shown first for review only:

1. **Predicted body weight** — key. undefined
2. **Actual admission weight**. undefined
3. **Post-diuresis body weight**. undefined
4. **Adjusted dosing body weight**. undefined

Explanation: Review ARDS tidal volume against predicted body weight; actual, post-diuresis, and drug-dosing weights answer different questions.

Finite profiles: `profile.gs028d.ards.b-obesity-ventilator-audit.female.42`: {"ageYears":42,"sexLabel":"Female"}; {patientName}, a 42-year-old woman with obesity returns after pneumonia-associated ARDS requiring invasive ventilation. The quality review compares the hospital's tidal-volume setting with the appropriate weight basis.

`profile.gs028d.ards.b-obesity-ventilator-audit.male.42`: {"ageYears":42,"sexLabel":"Male"}; {patientName}, a 42-year-old man with obesity returns after pneumonia-associated ARDS requiring invasive ventilation. The quality review compares the hospital's tidal-volume setting with the appropriate weight basis.

`profile.gs028d.ards.b-obesity-ventilator-audit.female.59`: {"ageYears":59,"sexLabel":"Female"}; {patientName}, a 59-year-old woman with obesity returns after pneumonia-associated ARDS requiring invasive ventilation. The quality review compares the hospital's tidal-volume setting with the appropriate weight basis.

`profile.gs028d.ards.b-obesity-ventilator-audit.male.59`: {"ageYears":59,"sexLabel":"Male"}; {patientName}, a 59-year-old man with obesity returns after pneumonia-associated ARDS requiring invasive ventilation. The quality review compares the hospital's tidal-volume setting with the appropriate weight basis.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.gs028f.critical-care.normal-spo2-anemia-content.v1

**Rewrite** → `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`.

- Anemia-normal-clip version: “how those two findings can coexist” plus fewer-carriers wording asks for a rehearsed qualitative analogy, with no next clinical assessment.
- The old saturation/carrier display distinction is usually announced in the presentation or answer wording; the display-fields and incorrect-statement variants can be answered by matching supplied labels.
- N1 versions were independently returned: missing/stale-input matching or microcytosis-to-iron-study recall does not establish two consequential oxygen-delivery inferences. Earlier reassuring gases also weaken the competing investigations.
- The new delivery record forces interpretation of arterial carriage, consumption and mixed-venous extraction before a flow assessment. It changes meaning and receives a new concept; no old card history transfers.

Before record `inventory.08016092c7d763fc`; case `case.gs028f.oxygen-content.c1-anemia-normal-clip`; node `node.gs028f.oxygen-content.c1-anemia-normal-clip.1`; concept `concept.gs028f.critical-care.normal-spo2-anemia-content`. Source: `packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts` → `OXYGEN_CONTENT_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `18a123fe3f43639747b0bfc2ac677c5435837372e0aa5ca1620d6c3f7536a2b4`; node SHA-256: `7dd21fab0356327c36c72637bc367035e22c56f069b1caef8bab018e081b2bd4`.

Complaint: **Blood count clarification**. Canonical patient: {patientName}; {"ageYears":42,"sexLabel":"Female"}.

Presentation: {patientName}, a 42-year-old woman, comes to review an outside workup documenting anemia with reduced hemoglobin. The patient feels well at rest, and an ordinary finger clip reports normal oxygen saturation. The patient asks how those two findings can coexist.

Current update: None.

None.

Task: **Why can this patient's normal SpO2 coexist with reduced oxygen-carrying content?**

Key shown first for review only:

1. **Fewer hemoglobin carriers can have normal saturation** — key. undefined
2. **Normal saturation establishes a normal hemoglobin quantity**. undefined
3. **Reduced hemoglobin requires reduced oxygen saturation**. undefined
4. **The saturation percentage directly measures hemoglobin quantity**. undefined

Explanation: The correct answer is “Fewer hemoglobin carriers can have normal saturation.” Saturation describes how fully the available hemoglobin is occupied. Anemia reduces the available carrier quantity, so a normal fraction does not establish normal oxygen content.

Finite profiles: `profile.gs028f.oxygen-content.c1-anemia-normal-clip.female.42`: {"ageYears":42,"sexLabel":"Female"}; {patientName}, a 42-year-old woman, comes to review an outside workup documenting anemia with reduced hemoglobin. The patient feels well at rest, and an ordinary finger clip reports normal oxygen saturation. The patient asks how those two findings can coexist.

`profile.gs028f.oxygen-content.c1-anemia-normal-clip.male.42`: {"ageYears":42,"sexLabel":"Male"}; {patientName}, a 42-year-old man, comes to review an outside workup documenting anemia with reduced hemoglobin. The patient feels well at rest, and an ordinary finger clip reports normal oxygen saturation. The patient asks how those two findings can coexist.

`profile.gs028f.oxygen-content.c1-anemia-normal-clip.female.70`: {"ageYears":70,"sexLabel":"Female"}; {patientName}, a 70-year-old woman, comes to review an outside workup documenting anemia with reduced hemoglobin. The patient feels well at rest, and an ordinary finger clip reports normal oxygen saturation. The patient asks how those two findings can coexist.

`profile.gs028f.oxygen-content.c1-anemia-normal-clip.male.70`: {"ageYears":70,"sexLabel":"Male"}; {patientName}, a 70-year-old man, comes to review an outside workup documenting anemia with reduced hemoglobin. The patient feels well at rest, and an ordinary finger clip reports normal oxygen saturation. The patient asks how those two findings can coexist.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.gs028f.critical-care.normal-spo2-anemia-content.v3

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`.

- Display-fields version: every wrong quantity appears in the displayed list; the sole unlisted quantity is the key. No clinical physiology inference is necessary.
- The old saturation/carrier display distinction is usually announced in the presentation or answer wording; the display-fields and incorrect-statement variants can be answered by matching supplied labels.
- N1 versions were independently returned: missing/stale-input matching or microcytosis-to-iron-study recall does not establish two consequential oxygen-delivery inferences. Earlier reassuring gases also weaken the competing investigations.
- The new delivery record forces interpretation of arterial carriage, consumption and mixed-venous extraction before a flow assessment. It changes meaning and receives a new concept; no old card history transfers.
- The display enumerates all distractor quantities; identifying the unlisted hemoglobin field is a list-completion exercise.

Before record `inventory.66e27d0e1a5cafc9`; case `case.gs028f.oxygen-content.c1-display-fields`; node `node.gs028f.oxygen-content.c1-display-fields.1`; concept `concept.gs028f.critical-care.normal-spo2-anemia-content`. Source: `packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts` → `OXYGEN_CONTENT_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `72131f5f060c5a4c0ad41ee3b4a997f48be6519a9c60d8bb71a769a3b68034d2`; node SHA-256: `8c8363844139a4c6495460f3cef85360f443ec6acc089dbe780e6a10ad1a0de1`.

Complaint: **Finger clip interpretation**. Canonical patient: {patientName}; {"ageYears":48,"sexLabel":"Female"}.

Presentation: {patientName}, a 48-year-old woman, brings an ordinary home finger-clip display while reviewing a known outside anemia diagnosis. The display lists SpO2, pulse rate and signal strength. The patient asks which blood quantity those displayed numbers have not supplied.

Current update: None.

None.

Task: **Which blood quantity is absent from this patient's listed pulse-oximeter display?**

Key shown first for review only:

1. **Blood hemoglobin concentration** — key. undefined
2. **Estimated oxygen saturation percentage**. undefined
3. **Displayed pulse frequency estimate**. undefined
4. **Displayed optical signal-strength indication**. undefined

Explanation: The correct answer is “Blood hemoglobin concentration.” Those clip fields give a saturation estimate, pulse rate and signal indication. They do not state how much hemoglobin is present, so they cannot replace the supplied blood-count information.

Finite profiles: `profile.gs028f.oxygen-content.c1-display-fields.female.48`: {"ageYears":48,"sexLabel":"Female"}; {patientName}, a 48-year-old woman, brings an ordinary home finger-clip display while reviewing a known outside anemia diagnosis. The display lists SpO2, pulse rate and signal strength. The patient asks which blood quantity those displayed numbers have not supplied.

`profile.gs028f.oxygen-content.c1-display-fields.male.48`: {"ageYears":48,"sexLabel":"Male"}; {patientName}, a 48-year-old man, brings an ordinary home finger-clip display while reviewing a known outside anemia diagnosis. The display lists SpO2, pulse rate and signal strength. The patient asks which blood quantity those displayed numbers have not supplied.

`profile.gs028f.oxygen-content.c1-display-fields.female.73`: {"ageYears":73,"sexLabel":"Female"}; {patientName}, a 73-year-old woman, brings an ordinary home finger-clip display while reviewing a known outside anemia diagnosis. The display lists SpO2, pulse rate and signal strength. The patient asks which blood quantity those displayed numbers have not supplied.

`profile.gs028f.oxygen-content.c1-display-fields.male.73`: {"ageYears":73,"sexLabel":"Male"}; {patientName}, a 73-year-old man, brings an ordinary home finger-clip display while reviewing a known outside anemia diagnosis. The display lists SpO2, pulse rate and signal strength. The patient asks which blood quantity those displayed numbers have not supplied.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.gs028f.critical-care.normal-spo2-anemia-content.v4

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`.

- Reassurance-note version: a negative lead-in asks for the statement that denies documented anemia; the three distractors are teaching statements rather than clinical competitors.
- The old saturation/carrier display distinction is usually announced in the presentation or answer wording; the display-fields and incorrect-statement variants can be answered by matching supplied labels.
- N1 versions were independently returned: missing/stale-input matching or microcytosis-to-iron-study recall does not establish two consequential oxygen-delivery inferences. Earlier reassuring gases also weaken the competing investigations.
- The new delivery record forces interpretation of arterial carriage, consumption and mixed-venous extraction before a flow assessment. It changes meaning and receives a new concept; no old card history transfers.
- The negative task asks which statement is incorrect; the key is the only statement that denies the supplied diagnosis.

Before record `inventory.2defb189847317e1`; case `case.gs028f.oxygen-content.c1-reassurance-note`; node `node.gs028f.oxygen-content.c1-reassurance-note.1`; concept `concept.gs028f.critical-care.normal-spo2-anemia-content`. Source: `packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts` → `OXYGEN_CONTENT_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `2b369b481a187b06ae0787b775a87b4e0e7e8664e5d5cab48bb388de3f5f6af6`; node SHA-256: `664c5ad447d6f1fcaf876d19f4c075f9f500e2db5dce76ce3e89fa08b4cffd7f`.

Complaint: **Anemia note review**. Canonical patient: {patientName}; {"ageYears":39,"sexLabel":"Female"}.

Presentation: {patientName}, a 39-year-old woman, asks for clarification of a draft summary of an outside anemia workup. It states that hemoglobin is reduced and that the ordinary pulse-oximeter saturation is normal. The patient asks which interpretation would incorrectly dismiss the blood-count result.

Current update: None.

None.

Task: **Which interpretation of this patient's normal SpO2 and reduced hemoglobin is incorrect?**

Key shown first for review only:

1. **Normal SpO2 excludes the documented anemia** — key. undefined
2. **Saturation and hemoglobin concentration are separate quantities**. undefined
3. **Reduced hemoglobin can lower blood oxygen-carrying content**. undefined
4. **The ordinary clip does not report hemoglobin concentration**. undefined

Explanation: The correct answer is “Normal SpO2 excludes the documented anemia.” The blood-count result and the saturation estimate describe different quantities. A normal saturation does not erase anemia or establish adequate oxygen content.

Finite profiles: `profile.gs028f.oxygen-content.c1-reassurance-note.female.39`: {"ageYears":39,"sexLabel":"Female"}; {patientName}, a 39-year-old woman, asks for clarification of a draft summary of an outside anemia workup. It states that hemoglobin is reduced and that the ordinary pulse-oximeter saturation is normal. The patient asks which interpretation would incorrectly dismiss the blood-count result.

`profile.gs028f.oxygen-content.c1-reassurance-note.male.39`: {"ageYears":39,"sexLabel":"Male"}; {patientName}, a 39-year-old man, asks for clarification of a draft summary of an outside anemia workup. It states that hemoglobin is reduced and that the ordinary pulse-oximeter saturation is normal. The patient asks which interpretation would incorrectly dismiss the blood-count result.

`profile.gs028f.oxygen-content.c1-reassurance-note.female.65`: {"ageYears":65,"sexLabel":"Female"}; {patientName}, a 65-year-old woman, asks for clarification of a draft summary of an outside anemia workup. It states that hemoglobin is reduced and that the ordinary pulse-oximeter saturation is normal. The patient asks which interpretation would incorrectly dismiss the blood-count result.

`profile.gs028f.oxygen-content.c1-reassurance-note.male.65`: {"ageYears":65,"sexLabel":"Male"}; {patientName}, a 65-year-old man, asks for clarification of a draft summary of an outside anemia workup. It states that hemoglobin is reduced and that the ordinary pulse-oximeter saturation is normal. The patient asks which interpretation would incorrectly dismiss the blood-count result.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.gs028f.critical-care.normal-spo2-anemia-content.v2

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`.

- Same-fraction version: two answers contradict the explicitly unchanged fraction; the remaining incorrect answer increases capacity despite reduced carriers. Mostly literal agreement.
- The old saturation/carrier display distinction is usually announced in the presentation or answer wording; the display-fields and incorrect-statement variants can be answered by matching supplied labels.
- N1 versions were independently returned: missing/stale-input matching or microcytosis-to-iron-study recall does not establish two consequential oxygen-delivery inferences. Earlier reassuring gases also weaken the competing investigations.
- The new delivery record forces interpretation of arterial carriage, consumption and mixed-venous extraction before a flow assessment. It changes meaning and receives a new concept; no old card history transfers.
- This exact pair-choice item changes a supplied saturation fraction in two distractors; it can be solved by literal agreement with the stem.

Before record `inventory.537f79c201c400c1`; case `case.gs028f.oxygen-content.c1-same-fraction`; node `node.gs028f.oxygen-content.c1-same-fraction.1`; concept `concept.gs028f.critical-care.normal-spo2-anemia-content`. Source: `packages/clinical-content/src/development-batch/2026-10-07-variety-2/oxygen-content.ts` → `OXYGEN_CONTENT_FAMILY`. Status: **live original**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `bd3d2837e117a6906ecee181de211899fe0c9cdba306e1c3466064dc08da8319`; node SHA-256: `8e3a1ae9ce71145af510dfbdce025bbfc669e7246751b48b99837ccc5d5c7157`.

Complaint: **Oxygen number question**. Canonical patient: {patientName}; {"ageYears":34,"sexLabel":"Female"}.

Presentation: {patientName}, a 34-year-old woman, reviews a completed anemia evaluation. The patient compares a prior normal hemoglobin result with the current reduced result and notes that both visits had the same normal oxygen saturation. The patient asks how the unchanged fraction relates to the change in carrier quantity.

Current update: None.

None.

Task: **Which combination matches this patient's unchanged saturation and reduced hemoglobin?**

Key shown first for review only:

1. **Same saturation fraction, lower carrying capacity** — key. undefined
2. **Lower saturation fraction, same carrying capacity**. undefined
3. **Same saturation fraction, higher carrying capacity**. undefined
4. **Higher saturation fraction, lower carrying capacity**. undefined

Explanation: The correct answer is “Same saturation fraction, lower carrying capacity.” The same fraction of a smaller quantity of hemoglobin can represent less carried oxygen. The percentage and carrier quantity answer different questions.

Finite profiles: `profile.gs028f.oxygen-content.c1-same-fraction.female.34`: {"ageYears":34,"sexLabel":"Female"}; {patientName}, a 34-year-old woman, reviews a completed anemia evaluation. The patient compares a prior normal hemoglobin result with the current reduced result and notes that both visits had the same normal oxygen saturation. The patient asks how the unchanged fraction relates to the change in carrier quantity.

`profile.gs028f.oxygen-content.c1-same-fraction.male.34`: {"ageYears":34,"sexLabel":"Male"}; {patientName}, a 34-year-old man, reviews a completed anemia evaluation. The patient compares a prior normal hemoglobin result with the current reduced result and notes that both visits had the same normal oxygen saturation. The patient asks how the unchanged fraction relates to the change in carrier quantity.

`profile.gs028f.oxygen-content.c1-same-fraction.female.61`: {"ageYears":61,"sexLabel":"Female"}; {patientName}, a 61-year-old woman, reviews a completed anemia evaluation. The patient compares a prior normal hemoglobin result with the current reduced result and notes that both visits had the same normal oxygen saturation. The patient asks how the unchanged fraction relates to the change in carrier quantity.

`profile.gs028f.oxygen-content.c1-same-fraction.male.61`: {"ageYears":61,"sexLabel":"Male"}; {patientName}, a 61-year-old man, reviews a completed anemia evaluation. The patient compares a prior normal hemoglobin result with the current reduced result and notes that both visits had the same normal oxygen saturation. The patient asks how the unchanged fraction relates to the change in carrier quantity.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.n1.hemoglobin-measurement.v1

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`.

- N1 v1: explicitly absent postoperative laboratory results and prior hemorrhage name the CBC action; saturation and capnography are weak competitors for this uncomplicated fatigue task.
- The old saturation/carrier display distinction is usually announced in the presentation or answer wording; the display-fields and incorrect-statement variants can be answered by matching supplied labels.
- N1 versions were independently returned: missing/stale-input matching or microcytosis-to-iron-study recall does not establish two consequential oxygen-delivery inferences. Earlier reassuring gases also weaken the competing investigations.
- The new delivery record forces interpretation of arterial carriage, consumption and mixed-venous extraction before a flow assessment. It changes meaning and receives a new concept; no old card history transfers.

Before record `inventory.9c7c97cb675b4a16`; case `case.n1.hemoglobin-measurement.v1`; node `node.n1.hemoglobin-measurement.v1`; concept `concept.n1.oxygen-saturation-missing-hemoglobin-assessment`. Source: `packages/clinical-content/src/question-new-n1-20261104.ts` → `QUESTION_NEW_N1_QUESTIONS`. Status: **draft parked**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `99f9661315f2805a041d61d17ffb2f11f0de9e1be8e0b26169986b4fc1fa8fe1`; node SHA-256: `b5bc6a7fdf3d151523c82b1ad8894542d83180dc7dd177425bfd3929593fcd0d`.

Complaint: **Postoperative fatigue**. Canonical patient: Brian Lewis; {"ageYears":68,"sexLabel":"Male"}.

Presentation: {patientName}, a 68-year-old man, reports fatigue after an operation complicated by substantial hemorrhage. His pulse oximeter shows saturation within its reference range with a good signal, and he has no respiratory distress. His discharge packet contains no postoperative laboratory results.

Current update: None.

None.

Task: **Which investigation should be arranged next for {patientName}'s postoperative fatigue?**

Key shown first for review only:

1. **Complete blood count** — key. Hemoglobin concentration measures carrier quantity, which the existing monitor does not provide.
2. **Pulse oximetry reassessment**. A second good-quality saturation measurement still does not supply a hemoglobin concentration.
3. **End-tidal capnography measurement**. Ventilation monitoring does not measure the missing hemoglobin concentration.

Explanation: Normal saturation describes the fraction of hemoglobin binding capacity occupied by oxygen, not how much hemoglobin is present. Obtain the missing blood-count measurement rather than repeat a different physiologic signal.

Finite profiles: `profile.n1.hemoglobin-measurement.v1`: {"ageYears":68,"sexLabel":"Male"}; {patientName}, a 68-year-old man, reports fatigue after an operation complicated by substantial hemorrhage. His pulse oximeter shows saturation within its reference range with a good signal, and he has no respiratory distress. His discharge packet contains no postoperative laboratory results.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.n1.hemoglobin-measurement.v2

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`.

- N1 v2: the only explicitly stale input is hemoglobin, and the task directs attention away from pulmonary attribution. The current oxygen flow is not stated, limiting the pulmonary reassurance.
- The old saturation/carrier display distinction is usually announced in the presentation or answer wording; the display-fields and incorrect-statement variants can be answered by matching supplied labels.
- N1 versions were independently returned: missing/stale-input matching or microcytosis-to-iron-study recall does not establish two consequential oxygen-delivery inferences. Earlier reassuring gases also weaken the competing investigations.
- The new delivery record forces interpretation of arterial carriage, consumption and mixed-venous extraction before a flow assessment. It changes meaning and receives a new concept; no old card history transfers.

Before record `inventory.8c3db096d36a1368`; case `case.n1.hemoglobin-measurement.v1`; node `node.n1.hemoglobin-measurement.v1`; concept `concept.n1.oxygen-saturation-missing-hemoglobin-assessment`. Source: `packages/clinical-content/src/question-new-n1-round2-20261104.ts` → `QUESTION_NEW_N1_ROUND2_QUESTIONS`. Status: **draft parked**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `abed31051749a78a3696318a9298095b349dac277b609e215d0b0aee71dfeebf`; node SHA-256: `2d259d8ddd990451614ee12026b6f0e2090cd4a90a5374ce3ece98521d820f12`.

Complaint: **Postoperative fatigue**. Canonical patient: Brian Lewis; {"ageYears":68,"sexLabel":"Male"}.

Presentation: {patientName}, a 68-year-old man, attends clinic with exertional fatigue after colectomy. His oxygen prescription was continued after discharge because of an inpatient desaturation. He now has a good pulse-oximeter signal and no respiratory distress. The hospital oxygen-content calculation lists the input dates below.

Current update: None.

| Record | Value / observation | Time or origin |
|---|---|---|
| Hemoglobin input | 13.7 g/dL | Copied from the preoperative sample into the postoperative calculation |
| Arterial oxygen tension | Within the reporting laboratory interval | Postoperative arterial sample |
| Pulse saturation | 98% | Clinic reading with a stable waveform |
| Operation record | 900-mL estimated loss with crystalloid replacement | During colectomy |

Task: **Which assessment should {patientName}'s team prioritize before attributing his fatigue to persistent pulmonary oxygenation failure?**

Key shown first for review only:

1. **Complete blood count with red-cell indices** — key. The calculation combines current saturation/tension with an older hemoglobin input. Current hemoglobin is needed to assess carrying capacity rather than assume that the saturation establishes it.
2. **Arterial blood gas and oxygen-tension review**. This reassesses oxygenation but does not repair the old hemoglobin input on which the carrying-capacity conclusion depends.
3. **Capnography and expired-carbon-dioxide review**. This reassesses ventilation, a different physiological quantity from the unresolved hemoglobin-dependent carrying-capacity question.

Explanation: Audit the date and meaning of the inputs before trusting the calculated conclusion. Saturation is a fraction of available hemoglobin capacity; arterial oxygen tension and ventilation are different quantities. A current blood count is needed to assess the changed carrying-capacity possibility. This does not prescribe a transfusion threshold or prove that anemia explains every symptom.

Finite profiles: `profile.n1.hemoglobin-measurement.v2`: {"ageYears":68,"sexLabel":"Male"}; {patientName}, a 68-year-old man, attends clinic with exertional fatigue after colectomy. His oxygen prescription was continued after discharge because of an inpatient desaturation. He now has a good pulse-oximeter signal and no respiratory distress. The hospital oxygen-content calculation lists the input dates below.

Context review: The two retained serializations differ only in object property order. Recursive value comparison found no visible clinical, task, exhibit, choice, rationale, profile or feedback difference. Both raw serializations and their source export origins are preserved; the same audit verdict applies.

### question.n1.hemoglobin-measurement.v3

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`.

- N1 v3: current microcytosis makes iron studies familiar while normal room-air oxygen results and absent cardiopulmonary symptoms weaken both alternatives. Its distinct iron-workup history must remain separate.
- The old saturation/carrier display distinction is usually announced in the presentation or answer wording; the display-fields and incorrect-statement variants can be answered by matching supplied labels.
- N1 versions were independently returned: missing/stale-input matching or microcytosis-to-iron-study recall does not establish two consequential oxygen-delivery inferences. Earlier reassuring gases also weaken the competing investigations.
- The new delivery record forces interpretation of arterial carriage, consumption and mixed-venous extraction before a flow assessment. It changes meaning and receives a new concept; no old card history transfers.
- Its iron-study meaning is distinct from the carrier-measurement identities; proposed retirement is an editorial supply decision only. Manager may retain a hematology companion in the appropriate lane.

Before record `inventory.f96fde9a7e92c352`; case `case.n1.hemoglobin-measurement.v1`; node `node.n1.hemoglobin-measurement.v1`; concept `concept.n1r3.oxygenation-red-cell-fatigue-workup`. Source: `packages/clinical-content/src/question-new-n1-round3-20261104.ts` → `QUESTION_NEW_N1_ROUND3_QUESTIONS`. Status: **draft parked**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `ef057281d23627de5fd643205b319ea357f6f05f437aab2f0b0155434a69a27c`; node SHA-256: `ed80fb1671f8cf3baf89177eb0cb1b176d36a6fcf9ef189e8399bd4b7c37269e`.

Complaint: **Postoperative fatigue**. Canonical patient: Brian Lewis; {"ageYears":68,"sexLabel":"Male"}.

Presentation: {patientName}, a 68-year-old man, attends clinic with exertional fatigue after colectomy for diverticular disease. Oxygen was used during an inpatient pulmonary complication. He has taken no supplemental oxygen since discharge and becomes tired during walking without breathlessness or chest pain.

Current update: None.

| Record | Hemoglobin / red-cell size | Oxygen measurements |
|---|---|---|
| Before surgery | 11.1 g/dL; mean cell volume below laboratory interval | No oxygen prescription |
| Current clinic assessment | 9.2 g/dL; mean cell volume remains below interval | Room-air saturation 98% at rest and 97% during the observed walk; room-air arterial oxygen tension within interval |

Task: **Which assessment should {patientName}'s team prioritize for the current findings?**

Key shown first for review only:

1. **Serum ferritin and transferrin studies** — key. Normal oxygenation does not establish normal oxygen content. The current low hemoglobin and pre-existing small-cell pattern support evaluating iron status rather than attributing everything to the inpatient lung event.
2. **Arterial blood gas and co-oximetry assays**. This can investigate a suspected oxygenation/dyshemoglobin problem, but the present room-air measurements and red-cell trajectory identify a more supported initial assessment.
3. **Transthoracic echocardiography with Doppler**. Cardiac investigation can be appropriate for relevant signs or symptoms, but it does not address the represented red-cell abnormality.

Explanation: Saturation and oxygen tension describe oxygenation, not the amount of hemoglobin available to carry oxygen. The current small-cell anemia, which partly preceded surgery, supports iron studies rather than replacing an explicitly stale input or assuming postoperative lung disease explains fatigue. Low ferritin would support depleted stores and lead to appropriate cause evaluation. No transfusion threshold, oxygen-withdrawal rule or iron dose is asserted.

Finite profiles: `profile.n1.hemoglobin-measurement.v3`: {"ageYears":68,"sexLabel":"Male"}; {patientName}, a 68-year-old man, attends clinic with exertional fatigue after colectomy for diverticular disease. Oxygen was used during an inpatient pulmonary complication. He has taken no supplemental oxygen since discharge and becomes tired during walking without breathlessness or chest pain.

Context review: The two retained serializations differ only in object property order. Recursive value comparison found no visible clinical, task, exhibit, choice, rationale, profile or feedback difference. Both raw serializations and their source export origins are preserved; the same audit verdict applies.

### question.n2.ventilator-elastic-versus-resistive-load.v1

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.pressure-assessment.v1`.

- N2 v1: unchanged flow explicitly eliminates a flow-change distractor; the remaining peak/plateau classification has no consequential later decision.
- The controlled peak/plateau relation is meaningful, but earlier versions either explicitly exclude a flow distractor or leave the target of mechanical reassessment too broad.
- Version 3 offers a resistance-targeting option beside two volume-escalation decisions and lacks the prescription context required for a universal volume ruling. The original graph remains untouched.
- Replace the action with a narrowly specified acquisition decision, followed by a new secretion-directed response; do not import a numeric plateau threshold into the old record.

Before record `inventory.617e60b07591c6d7`; case `case.n2.ventilator-elastic-versus-resistive-load.v1`; node `node.n2.ventilator-elastic-versus-resistive-load.v1`; concept `concept.n2.ventilator-elastic-versus-resistive-load`. Source: `packages/clinical-content/src/question-new-n2-20261104.ts` → `QUESTION_NEW_N2_QUESTIONS`. Status: **draft parked**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `a94513aec808753a137cbe929a84a6d7e77c7fccabafdf67bcc8e50350375ef8`; node SHA-256: `9ba9c25f98c6475a129eff0e465f5692ee7e18472901612be26124e5b7b49da7`.

Complaint: **Ventilation record review**. Canonical patient: Diane Foster; {"ageYears":63,"sexLabel":"Female"}.

Presentation: {patientName}, a 63-year-old woman, brings her hospital ventilation record to clinic after recovery. Two measurements were obtained during passive ventilation with unchanged tidal volume, inspiratory flow and PEEP.

Current update: None.

| Record | Peak pressure (cm H2O) | Plateau pressure (cm H2O) |
|---|---|---|
| Earlier | 24 | 18 |
| Later | 32 | 26 |

Task: **Which pressure-mechanics interpretation is supported by {patientName}'s controlled measurements?**

Key shown first for review only:

1. **Increased elastic load** — key. Both pressures rise by the same amount while their difference remains unchanged, supporting an elastic-load change.
2. **Increased resistive load**. An isolated resistive explanation does not fit the unchanged peak-to-plateau difference in this controlled comparison.
3. **Increased imposed inspiratory flow**. Inspiratory flow is explicitly unchanged, so it cannot explain these observations as a changed input.

Explanation: Peak minus plateau remains 6 cm H2O in both constructed observations. With tidal volume, flow and PEEP controlled, the matched increase supports increased elastic pressure requirements. It does not identify a specific disease or prescribe ventilator settings.

Finite profiles: `profile.n2.ventilator-elastic-versus-resistive-load.v1`: {"ageYears":63,"sexLabel":"Female"}; {patientName}, a 63-year-old woman, brings her hospital ventilation record to clinic after recovery. Two measurements were obtained during passive ventilation with unchanged tidal volume, inspiratory flow and PEEP.

Context review: The two retained serializations differ only in object property order. Recursive value comparison found no visible clinical, task, exhibit, choice, rationale, profile or feedback difference. Both raw serializations and their source export origins are preserved; the same audit verdict applies.

### question.n2.ventilator-elastic-versus-resistive-load.v2

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.pressure-assessment.v1`.

- N2 v2: a falling peak with persistent plateau is useful evidence, but a broad “mechanical reassessment” can legitimately use peak and gradient as well as plateau. The endpoint is underspecified.
- The controlled peak/plateau relation is meaningful, but earlier versions either explicitly exclude a flow distractor or leave the target of mechanical reassessment too broad.
- Version 3 offers a resistance-targeting option beside two volume-escalation decisions and lacks the prescription context required for a universal volume ruling. The original graph remains untouched.
- Replace the action with a narrowly specified acquisition decision, followed by a new secretion-directed response; do not import a numeric plateau threshold into the old record.

Before record `inventory.7c365f1e947647b7`; case `case.n2.ventilator-elastic-versus-resistive-load.v1`; node `node.n2.ventilator-elastic-versus-resistive-load.v1`; concept `concept.n2.ventilator-elastic-versus-resistive-load`. Source: `packages/clinical-content/src/question-new-n2-round2-20261104.ts` → `QUESTION_NEW_N2_ROUND2_QUESTIONS`. Status: **draft parked**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `7a4eed6fe64acdd55e97558781de95d83778b0561187293b694bbf29044edb84`; node SHA-256: `040ff90cc2a8d4be246d4c5e69a8162567bedb03f404bc71d6f24df4c9cf2cfc`.

Complaint: **Ventilation review**. Canonical patient: Diane Foster; {"ageYears":63,"sexLabel":"Female"}.

Presentation: {patientName}, a 63-year-old woman, attends clinic before further surgery after an ICU admission. The anesthesia team is reviewing the mechanical endpoint to follow during another ventilator assessment. The hospital measurements below were obtained with passive ventilation, the same delivered tidal volume and the same measured total PEEP.

Current update: None.

| Record | Peak pressure (cm H2O) | Plateau pressure (cm H2O) | Inspiratory flow (L/min) |
|---|---|---|---|
| Earlier | 34 | 18 | 90 |
| After the pressure alarm | 42 | 26 | 90 |
| After inspiratory flow was reduced | 32 | 26 | 30 |

Task: **Which measurement should guide {patientName}'s next mechanical reassessment after the flow change?**

Key shown first for review only:

1. **Plateau pressure at the next matched assessment** — key. The matched initial peak/plateau rise supports an elastic-pressure increase. Lowering flow reduces the flow-dependent peak component, while the elevated plateau persists.
2. **Peak pressure at the next matched assessment**. The lower peak can be mistaken for resolution even though acquisition flow changed and the static pressure did not return to its previous value.
3. **Peak minus plateau pressure at the next matched assessment**. That difference addresses the resistive component under the acquisition conditions, rather than the persisting elastic-pressure rise shown by the plateau.

Explanation: The first comparison is controlled: peak and plateau rise by the same amount. After flow is reduced, the peak falls below its earlier value but the plateau remains elevated. Follow the passive plateau at fixed delivered volume and measured PEEP when reassessing the persisting elastic component; a falling peak under different flow conditions does not settle that question.

Finite profiles: `profile.n2.ventilator-elastic-versus-resistive-load.v2`: {"ageYears":63,"sexLabel":"Female"}; {patientName}, a 63-year-old woman, attends clinic before further surgery after an ICU admission. The anesthesia team is reviewing the mechanical endpoint to follow during another ventilator assessment. The hospital measurements below were obtained with passive ventilation, the same delivered tidal volume and the same measured total PEEP.

Context review: The two retained serializations differ only in object property order. Recursive value comparison found no visible clinical, task, exhibit, choice, rationale, profile or feedback difference. Both raw serializations and their source export origins are preserved; the same audit verdict applies.

### question.n2.ventilator-elastic-versus-resistive-load.v3

**Rewrite** → `question.topic.critical-respiratory-ventilation.pressure-assessment.v1`.

- N2 v3: graph exists and displays the stated 34/18, 42/26 and 32/26 comparisons. The resistance option does not answer the same volume decision, and the record lacks a complete actual prescription for a numeric adjustment.
- The controlled peak/plateau relation is meaningful, but earlier versions either explicitly exclude a flow distractor or leave the target of mechanical reassessment too broad.
- Version 3 offers a resistance-targeting option beside two volume-escalation decisions and lacks the prescription context required for a universal volume ruling. The original graph remains untouched.
- Replace the action with a narrowly specified acquisition decision, followed by a new secretion-directed response; do not import a numeric plateau threshold into the old record.

Before record `inventory.cdb263b7e25ee3d1`; case `case.n2.ventilator-elastic-versus-resistive-load.v1`; node `node.n2.ventilator-elastic-versus-resistive-load.v1`; concept `concept.n2.ventilator-elastic-versus-resistive-load`. Source: `packages/clinical-content/src/question-new-n2-round3-20261104.ts` → `QUESTION_NEW_N2_ROUND3_QUESTIONS`. Status: **draft parked**. Approval: none transferred. Holds: review.n2.ventilator-elastic-versus-resistive-load.v3.

Exact case SHA-256: `e1e8ef39d2ff1a864e72c8e4ef1e3cb793cc15a0f4750f0e292af60aee01c3d9`; node SHA-256: `d068e8070e7b5e8435b8674334c7245fb855151069633b1c4e6c998e327513a1`.

Complaint: **Ventilation review**. Canonical patient: Diane Foster; {"ageYears":63,"sexLabel":"Female"}.

Presentation: {patientName}, a 63-year-old woman, brings her ICU ventilation record to the clinic before further surgery. A clinician proposed increasing tidal volume toward its earlier prescription after the peak-pressure display fell. The measurements below were made during passive ventilation with unchanged delivered tidal volume and measured total end-expiratory pressure.

Current update: None.

Existing exhibit `clinical-exhibits/question-new-n2-r3-pressure.png` (1200 × 720). Constructed hospital measurements; fictional observations

Accessible observations: Three passive-ventilation assessments at unchanged delivered tidal volume and measured total end-expiratory pressure. Earlier: peak 34 and plateau 18 cm H2O, inspiratory flow 90 L/min. After pressure rise: peak 42 and plateau 26 cm H2O, flow 90 L/min. After the flow change: peak 32 and plateau 26 cm H2O, flow 30 L/min. Circles show peak; squares show plateau.

Task: **What does the final recording establish for {patientName}'s proposed tidal-volume increase?**

Key shown first for review only:

1. **Defer volume escalation; the static load persists** — key. The lower dynamic maximum leaves the measured plateau at its higher value under matched settings.
2. **Proceed with volume escalation; static loading has recovered**. The lower peak was obtained at a different flow; it does not show that the static pressure rise resolved.
3. **Target airway resistance; the pressure rise was flow dependent**. The initial matched peak and plateau rise and the persistent plateau are not explained by isolated flow-dependent resistance.

Explanation: The controlled initial comparison raises peak and plateau together. Reducing inspiratory flow then lowers the peak but leaves plateau at 26 rather than the earlier 18. The apparent improvement therefore does not establish recovery of the static pressure burden before a proposed volume increase. Continue reassessment of that burden and its cause; the case supplies no universal plateau cutoff, safe tidal volume or pulmonary diagnosis.

Finite profiles: `profile.n2.ventilator-elastic-versus-resistive-load.v3`: {"ageYears":63,"sexLabel":"Female"}; {patientName}, a 63-year-old woman, brings her ICU ventilation record to the clinic before further surgery. A clinician proposed increasing tidal volume toward its earlier prescription after the peak-pressure display fell. The measurements below were made during passive ventilation with unchanged delivered tidal volume and measured total end-expiratory pressure.

Context review: The two retained serializations differ only in object property order. Recursive value comparison found no visible clinical, task, exhibit, choice, rationale, profile or feedback difference. Both raw serializations and their source export origins are preserved; the same audit verdict applies.

### question.n3.ards-weight-change-versus-tidal-volume-basis.v1

**Retire-and-replace** → `question.topic.critical-respiratory-ventilation.ards-pbw-order.v1`.

- N3 v1: “Fixed measurements” and the only technical anthropometric option classify the intended invariant input; the exhibit adds no actual values or care-changing response.
- The original task asks for a weight-basis label already scaffolded by fluid-dependent scale changes; dry/dosing-weight foils do not create a consequential second inference.
- Family presentations and finite demographic profiles preserve the same easy rule; adding a management companion would not independently repair this item.
- The concrete initial order now uses measured versus checked predicted mass. Persistent excessive plateau is a separate later objective and must have a separate new history.

Before record `inventory.a47b6f2fa1b68e8d`; case `case.n3.ards-weight-change-versus-tidal-volume-basis.v1`; node `node.n3.ards-weight-change-versus-tidal-volume-basis.v1`; concept `concept.n3.ards-weight-change-versus-tidal-volume-basis`. Source: `packages/clinical-content/src/question-new-n3-20261105.ts` → `QUESTION_NEW_N3_QUESTIONS`. Status: **draft parked**. Approval: none transferred. Holds: none assigned.

Exact case SHA-256: `528c90a4e1a083f49e4b717e01c34f65000afba296a74ebe4be6e2aa5a5daaeb`; node SHA-256: `bdda36c2e9c1f6c1cb2228c0e18efde6e93a0c72b7ac1d049a0a50ae90ca9238`.

Complaint: **Ventilator record review**. Canonical patient: Audrey Marsh; {"ageYears":59,"sexLabel":"Female"}.

Presentation: {patientName}, a 59-year-old woman, is discussed at an outside-hospital follow-up review in the clinic. During her recent ARDS admission, the ventilator record and daily weights diverged as fluid accumulated and was later removed. The review asks which recorded feature should govern the tidal-volume weight basis.

Current update: None.

- **Fixed measurements:** Adult height and recorded sex unchanged throughout the admission.
- **Daily scale weights:** Rose substantially during resuscitation and fell during later fluid removal.
- **Ventilator diagnosis:** ARDS treated with invasive mechanical ventilation.
- **Prescription query:** A note proposes recalculating the weight basis from each day's scale reading.

Task: **Which weight basis should be used when reviewing {patientName}'s ARDS tidal-volume prescription through those fluid changes?**

Key shown first for review only:

1. **Predicted body weight from the documented anthropometric calculation** — key. ARDS tidal-volume selection uses predicted body weight rather than fluid-related scale-weight changes.
2. **Current actual body weight from the daily scale**. This lets fluid accumulation or removal change the weight basis despite unchanged adult body size.
3. **Admission actual body weight from the initial scale**. A less fluid-influenced actual weight is still not the prescribed predicted-body-weight basis.

Explanation: The scale trend reflects a changing actual-weight measurement. ARDS tidal-volume selection is indexed to predicted body weight rather than actual weight, so neither the current nor the admission scale reading replaces that basis. No formula or numeric tidal volume is prescribed.

Finite profiles: `profile.n3.ards-weight-change-versus-tidal-volume-basis.v1`: {"ageYears":59,"sexLabel":"Female"}; {patientName}, a 59-year-old woman, is discussed at an outside-hospital follow-up review in the clinic. During her recent ARDS admission, the ventilator record and daily weights diverged as fluid accumulated and was later removed. The review asks which recorded feature should govern the tidal-volume weight basis.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

### question.n3.ards-weight-change-versus-tidal-volume-basis.v2

**Rewrite** → `question.topic.critical-respiratory-ventilation.ards-pressure-limit.v1`.

- N3 v2: the balanced four-option matrix avoids convergence but its edema label and weight basis are independent classifications. The task promises a prescription yet gives no delivered volume or pressure response. Exact clinical hold persists.
- The original task asks for a weight-basis label already scaffolded by fluid-dependent scale changes; dry/dosing-weight foils do not create a consequential second inference.
- Family presentations and finite demographic profiles preserve the same easy rule; adding a management companion would not independently repair this item.
- The concrete initial order now uses measured versus checked predicted mass. Persistent excessive plateau is a separate later objective and must have a separate new history.
- The old balanced matrix couples two parallel classifications rather than a dependent interpret-then-act chain; preserve the exact owner hold and its original question.

Before record `inventory.8ad385e711985bf9`; case `case.n3.ards-weight-change-versus-tidal-volume-basis.v1`; node `node.n3.ards-weight-change-versus-tidal-volume-basis.v1`; concept `concept.n3.ards-weight-change-versus-tidal-volume-basis.v2`. Source: `packages/clinical-content/src/question-new-n3-round2-20261105.ts` → `QUESTION_NEW_N3_ROUND2_QUESTIONS`. Status: **held for owner**. Approval: none transferred. Holds: review.n3.ards-weight-change-versus-tidal-volume-basis.v2.

Exact case SHA-256: `88bc492a144c0ed8350d4a3544894a49d05816b93a153d09bf0e252b2b67398e`; node SHA-256: `fb4546c20f17d2c23766eec4629db526316cd331fb9f42a8bc46cfe107c24fcb`.

Complaint: **Ventilator record review**. Canonical patient: Samuel Kent; {"ageYears":56,"sexLabel":"Male"}.

Presentation: {patientName}, a 56-year-old man, is reviewed in clinic using records from his current postoperative ICU admission after aspiration and sepsis. He required intubation for new bilateral pulmonary opacities and worsening oxygenation. The ICU team is writing the next tidal-volume prescription.

Current update: None.

- **Respiratory course:** New bilateral opacities developed over two days after aspiration. PaO2 66 mm Hg on FiO2 0.60 with PEEP 8 cm H2O.
- **Cardiac/filling assessment:** Left ventricular systolic function preserved; pulmonary-artery occlusion pressure 8 mm Hg during the current assessment.
- **Body measurements:** Height 172 cm, recorded male sex. Admission scale weight 76 kg; current scale weight 88 kg after resuscitation.
- **Fluid course:** Positive cumulative balance during resuscitation; diuresis is now being considered.

Task: **Which interpretation and tidal-volume prescription best fit {patientName}'s current lung findings?**

Key shown first for review only:

1. **Permeability edema with predicted-weight ventilation** — key. The lung-injury course and low filling-pressure observation support permeability edema despite weight gain. In this ARDS context, tidal-volume selection uses predicted body weight rather than the scale measurement.
2. **Hydrostatic edema with predicted-weight ventilation**. The weight field is appropriate, but the mechanism does not fit the low measured filling pressure and acute aspiration/sepsis lung course as well as permeability injury.
3. **Permeability edema with actual-weight ventilation**. This recognizes the injury context and avoids the new fluid weight but still substitutes actual body weight for the anthropometric basis.
4. **Hydrostatic edema with actual-weight ventilation**. This assigns the pulmonary process from the weight gain and then uses a dry scale weight in place of the supported anthropometric basis.

Explanation: Positive fluid balance does not by itself classify the pulmonary process as hydrostatic edema. The aspiration/sepsis course, bilateral oxygenation problem and low measured filling pressure support the permeability-injury context. For an adult with ARDS, tidal-volume selection is based on predicted body weight from anthropometric measurements, not dry or fluid-loaded actual weight. No new numeric tidal-volume target, diagnostic ratio cutoff or calculation formula is taught.

Finite profiles: `profile.n3.ards-weight-change-versus-tidal-volume-basis.v2`: {"ageYears":56,"sexLabel":"Male"}; {patientName}, a 56-year-old man, is reviewed in clinic using records from his current postoperative ICU admission after aspiration and sepsis. He required intubation for new bilateral pulmonary opacities and worsening oxygenation. The ICU team is writing the next tidal-volume prescription.

Context review: Every retained exported context has the same scored objective and audit verdict. Authoring versus projected wrappers may differ in timing preview/terminal/source metadata; old exact serializations and full finite profiles are retained, with no edit or historical approval transfer.

## Complete after packets

Each new-gap node has an explicit empty before field. Rewrites refer to their complete before block above. Runtime choices shuffle; the key-first order is for review only. No fictional patient measurement is presented as an empirical probability, universal cutoff or drug/timing rule.

### ards-pbw-order

`question.topic.critical-respiratory-ventilation.ards-pbw-order.v1` · `node.topic.critical-respiratory-ventilation.ards-pbw-order.v1` · `concept.ards.predicted-body-weight-ventilation`

Objective: Select the initial ARDS tidal volume using PBW rather than fluid-dependent actual mass.

Before: `inventory.8fdd1a516c05a3e8` (complete before packet above)

Concept relation: `existing_meaning_variant`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Breathing recovery**. Patient: Nina Cole, 58, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Nina Cole, a 58-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from an aspiration-related admission requiring invasive ventilation.

Current update (shown only at this decision): Hospital record, after intubation: bilateral opacities developed after aspiration. PaO2 is 60 mm Hg on FiO2 0.60 and PEEP 10 cm H2O. The first delivered tidal volume is 500 mL; passive plateau pressure is 34 cm H2O.

| Record | Checked PBW | Pre-illness scale weight | Current scale weight |
|---|---|---|---|
| Ventilation worksheet | 50 kg | 75 kg | 90 kg |

Task: **Which initial tidal-volume order best fits Nina Cole’s recorded lung-protective ventilation plan?**

Key shown first for review only:

1. **Set tidal volume to 300 mL** — key. Six times the checked 50-kg PBW gives 300 mL; the higher current prescription and plateau require protective reassessment.
   - Temptation: Use the lung-size indexing value, not the scale.
   - Reasonable under: The constructed PBW remains 50 kg.
   - Timing: no testing choice; no fixed wait authored
2. **Set tidal volume to 450 mL**. This uses 6 mL/kg of the 75-kg pre-illness actual mass, which is not the lung-size basis.
   - Temptation: Mistake a dry actual mass for predicted lung size.
   - Reasonable under: A separately checked PBW of 75 kg with a suitable pressure response.
   - Timing: no testing choice; no fixed wait authored
3. **Set tidal volume to 540 mL**. This uses fluid-loaded actual mass and moves away from the protective prescription.
   - Temptation: Treat resuscitation weight as a larger lung.
   - Reasonable under: A separately checked PBW of 90 kg with a suitable pressure response.
   - Timing: no testing choice; no fixed wait authored

Explanation: Use the checked PBW for the initial 6-mL/kg order: 6 × 50 = 300 mL. Scale-weight changes do not enlarge the ventilated lung. The delivered volume and plateau must then be reassessed; this calculation does not guarantee the final setting.

Reasoning 1: Recognize that measured mass and the checked lung-size index are different inputs.

Reasoning 2: Apply the initial protective target to the correct index and change the recorded order.

Closest credible error: Use pre-illness actual mass because it appears less distorted than the current weight.

Deciding observation: The independently checked PBW is 50 kg, while both scale measurements are higher.

Consequence: Using actual mass can deliver excess tidal volume.

Deletion test: Every weight identifies a credible competing calculation; deleting the PBW removes the supported unique numerical order. Respiratory data establish why a protective order matters.

Counterfactual and re-solve: If the checked PBW were 75 kg and plateau response permitted, 450 mL would be the initial target.

Manual author gate (not independent PASS):

1. Cue attack: Covered labels: no option names PBW or the rationale. Three equal-length numeric orders; neither complaint nor task supplies the weight rule. Removed the old “which weight measure” cue and drug-dosing foil.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Recognize that measured mass and the checked lung-size index are different inputs. Then Apply the initial protective target to the correct index and change the recorded order.
4. Difficulty: Moderate, lower end: resident must reject a plausible dry-weight calculation, then prescribe an actual volume; arithmetic alone does not establish clinical approval.
5. Single best answer: The independently checked PBW is 50 kg, while both scale measurements are higher. Counterfactual: If the checked PBW were 75 kg and plateau response permitted, 450 mL would be the initial target.

Sequence/previous feedback attack: First node; future plateau and rescue findings are withheld. Feedback explains PBW and reassessment but gives no next-node pressure action.

Exact visible-context SHA-256: `f9c91f634479b58c4203180a678f14951e2cc4f94f954abca38b18fd0bbad1ac`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.permeability`, `claim.critical-respiratory-ventilation.pbw`, `claim.critical-respiratory-ventilation.protective-range`, `claim.critical-respiratory-ventilation.initial-six`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### ards-pressure-limit

`question.topic.critical-respiratory-ventilation.ards-pressure-limit.v1` · `node.topic.critical-respiratory-ventilation.ards-pressure-limit.v1` · `concept.critical-respiratory-ventilation.ards-pressure-limit.v1`

Objective: Lower tidal volume when plateau remains excessive despite a PBW-based initial order.

Before: `inventory.8ad385e711985bf9` (complete before packet above)

Concept relation: `new_meaning`; previous concept: `concept.n3.ards-weight-change-versus-tidal-volume-basis.v2`.

Complaint: **Breathing recovery**. Patient: Nina Cole, 58, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Nina Cole, a 58-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from an aspiration-related admission requiring invasive ventilation.

Current update (shown only at this decision): Next hospital entry: tidal volume is now 300 mL with PBW 50 kg. During passive breaths, repeat plateau pressure is 32 cm H2O and measured total PEEP remains 10 cm H2O. Arterial pH is 7.36. The scale still reads 90 kg.

- **Acquisition:** No inspiratory effort or leak during the repeated hold; airway secretions have been cleared.
- **Volume history:** 300 mL is the current delivered volume, not a proposed future target.

Task: **Which tidal-volume plan should have been chosen next for Nina Cole at this recorded assessment?**

Key shown first for review only:

1. **Reduce tidal volume to 250 mL** — key. Persistent plateau above 30 at 6 mL/kg supports a further step down to 5 mL/kg with reassessment.
   - Temptation: Apply the pressure constraint after the PBW target.
   - Reasonable under: The supplied matched measurements and pH.
   - Timing: no testing choice; no fixed wait authored
2. **Maintain tidal volume at 300 mL**. A correct initial PBW calculation does not establish that persistent plateau elevation can be accepted while waiting for fluid loss.
   - Temptation: Treat six mL/kg as an endpoint that overrides pressure.
   - Reasonable under: Plateau at or below the protective goal with adequate gas exchange.
   - Timing: no testing choice; no fixed wait authored
3. **Increase tidal volume to 350 mL**. Increasing delivered volume does not address the persisting distending-pressure problem.
   - Temptation: Use a volume within the broad 4–8 range without considering its pressure effect.
   - Reasonable under: A lower-pressure record with a separate supported need for more volume.
   - Timing: no testing choice; no fixed wait authored

Explanation: At 6 mL/kg PBW, persistent plateau elevation still requires attention. The verified ARDSNet protocol steps volume down toward 5 and then 4 mL/kg while reassessing ventilation. For this record, 250 mL is the first smaller order. This new clinical meaning remains held for Melissa’s exact decision.

Reasoning 1: Recognize the current order already uses six mL/kg PBW and that plateau remains elevated under valid acquisition.

Reasoning 2: Apply the pressure constraint rather than repeat the weight-basis rule or wait for diuresis.

Closest credible error: Wait for fluid removal because the initial six-mL/kg order appears correct.

Deciding observation: Repeated passive plateau is 32 despite a current six-mL/kg prescription, with no severe acidemia supplied.

Consequence: Unchanged scale indexing can conceal persistent overdistending pressure.

Deletion test: Removing plateau loses the reason to reduce below the initial target; removing current volume loses the fact that the initial target is already reached. The pH and acquisition protect the key boundary.

Counterfactual and re-solve: If plateau were 27 at 300 mL with the same gas exchange, maintaining 300 mL would become reasonable.

Manual author gate (not independent PASS):

1. Cue attack: Covered key: three equal-scope volume orders, no explanatory suffixes. The stem asks a neutral next plan. Retained effort/leak controls for valid plateau measurement; not availability hints.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Recognize the current order already uses six mL/kg PBW and that plateau remains elevated under valid acquisition. Then Apply the pressure constraint rather than repeat the weight-basis rule or wait for diuresis.
4. Difficulty: Moderate/hard: the rival uses a familiar correct rule at the wrong stage. The answer needs current volume indexing plus the persistent pressure response.
5. Single best answer: Repeated passive plateau is 32 despite a current six-mL/kg prescription, with no severe acidemia supplied. Counterfactual: If plateau were 27 at 300 mL with the same gas exchange, maintaining 300 mL would become reasonable.

Sequence/previous feedback attack: Prior PBW feedback does not teach what to do after the six-mL/kg target fails the pressure constraint. Future improvement is not visible.

Exact visible-context SHA-256: `53b33ce4fbfe35f5883552bc0ad1260784e9ae5ddd78b1dbf7a03573565b6344`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.pbw`, `claim.critical-respiratory-ventilation.protective-range`, `claim.critical-respiratory-ventilation.pressure-reduction`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: review.n3.ards-weight-change-versus-tidal-volume-basis.v2. All content remains **needs_clinician_review**.

### ards-prone-escalation

`question.topic.critical-respiratory-ventilation.ards-prone-escalation.v1` · `node.topic.critical-respiratory-ventilation.ards-prone-escalation.v1` · `concept.critical-respiratory-ventilation.ards-prone-escalation.v1`

Objective: Choose prone ventilation for persistent severe oxygenation impairment after protective optimization.

Before: `inventory.584fc666ca77beec` (complete before packet above)

Concept relation: `new_meaning`; previous concept: `concept.ards.permeability-edema-mechanism`.

Complaint: **Breathing recovery**. Patient: Nina Cole, 58, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Nina Cole, a 58-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from an aspiration-related admission requiring invasive ventilation.

Current update (shown only at this decision): Later hospital entry: after volume and PEEP adjustment, plateau pressure is 28 cm H2O. PaO2 remains 58 mm Hg on FiO2 0.80 and PEEP 12 cm H2O. Blood pressure is stable. The spine is stable and the abdomen is closed.

None.

Task: **Which additional respiratory-support intervention best fits Nina Cole’s recorded condition?**

Key shown first for review only:

1. **Begin prolonged prone ventilation** — key. Severe persistent oxygenation impairment after protective optimization supports proning before moving directly to extracorporeal support.
   - Temptation: Use both the oxygenation severity and completed optimization stage.
   - Reasonable under: The supplied persistent impairment without the stated contraindications.
   - Timing: no testing choice; no fixed wait authored
2. **Continue supine protective ventilation**. Protective settings should continue, but the persistent severe oxygenation impairment supports adding prone positioning rather than retaining the same position.
   - Temptation: Treat improved plateau as sufficient recovery despite the oxygen requirement.
   - Reasonable under: Substantially improved oxygenation above the prone-eligibility range on otherwise appropriate support, or a contraindication requiring another plan.
   - Timing: no testing choice; no fixed wait authored
3. **Begin venovenous ECMO cannulation**. ECMO is an important option for selected refractory cases; this record has not yet used the indicated prone strategy.
   - Temptation: Equate severe oxygenation impairment with exhaustion of conventional rescue.
   - Reasonable under: Persistent severe impairment after appropriate conventional rescue, assessed by an ECMO team.
   - Timing: no testing choice; no fixed wait authored

Explanation: Interpret oxygenation together with support: 58/0.80 is approximately 73 mm Hg. Persistent impairment on adjusted protective ventilation favors prone positioning. An improved plateau does not establish oxygenation recovery. ECMO requires assessment of refractory disease after conventional strategies.

Reasoning 1: Infer persistent severe oxygenation impairment from PaO2 relative to FiO2 after optimization.

Reasoning 2: Choose the next supported rescue stage rather than equating an improved plateau with oxygenation recovery or moving prematurely to extracorporeal support.

Closest credible error: Refer directly for ECMO because the oxygen tension remains low.

Deciding observation: Severe impairment persists, but protective optimization has occurred and prone ventilation has not yet been used.

Consequence: Remaining supine can omit a supported rescue strategy; immediate ECMO can bypass appropriate conventional rescue.

Deletion test: Deleting FiO2 removes severity interpretation; deleting completed optimization removes the escalation stage. Stable spine/closed abdomen define a clinical safety boundary.

Counterfactual and re-solve: If oxygenation improved above the prone-eligibility range on the same protective settings, continued supine protection would become reasonable; persistent severe impairment after appropriate conventional rescue makes ECMO assessment more relevant.

Manual author gate (not independent PASS):

1. Cue attack: Repeated key-covered attack after repair: replaced a guideline-discouraged recruitment foil that had no credible correct-under setting with continued supine protection. Three concrete support plans now have real counterfactual indications. The normal plateau does not eliminate either rival without interpreting the oxygenation requirement.
2. Stage/category: Three concrete respiratory-support plans at the same escalation point: prone protection, continued supine protection, or VV-ECMO cannulation. Shared protective care applies throughout.
3. Supported inferences: Infer persistent severe oxygenation impairment from PaO2 relative to FiO2 after optimization. Then Choose the next supported rescue stage rather than equating an improved plateau with oxygenation recovery or moving prematurely to extracorporeal support.
4. Difficulty: Hard, predicted after repair: interpret severe hypoxemia under high oxygen support despite an acceptable plateau, then choose a rescue stage between ongoing conventional support and immediate ECMO.
5. Single best answer: Severe impairment persists, but protective optimization has occurred and prone ventilation has not yet been used. Counterfactual: If oxygenation improved above the prone-eligibility range on the same protective settings, continued supine protection would become reasonable; persistent severe impairment after appropriate conventional rescue makes ECMO assessment more relevant.

Sequence/previous feedback attack: Earlier feedback names neither proning nor ECMO. This new record adds oxygenation severity despite acceptable plateau.

Exact visible-context SHA-256: `255faec459dc155af1adec9a2af1144bde9d4defc95c1e346a7a7c35012bc156`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.prone`, `claim.critical-respiratory-ventilation.protective-range`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### pressure-assessment

`question.topic.critical-respiratory-ventilation.pressure-assessment.v1` · `node.topic.critical-respiratory-ventilation.pressure-assessment.v1` · `concept.critical-respiratory-ventilation.pressure-assessment.v1`

Objective: Obtain the static pressure measurement before choosing a response to an unexplained peak-pressure rise.

Before: `inventory.cdb263b7e25ee3d1` (complete before packet above)

Concept relation: `new_meaning`; previous concept: `concept.n2.ventilator-elastic-versus-resistive-load`.

Complaint: **Ventilation questions**. Patient: Diane Foster, 63, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Diane Foster, a 63-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from the ventilated phase of her pneumonia admission.

Current update (shown only at this decision): Hospital record: peak pressure rises from 25 to 39 cm H2O during volume-controlled passive ventilation. Delivered volume, flow and set PEEP are unchanged. Saturation is 96% and blood pressure is unchanged. The delivered volume equals the set volume.

None.

Task: **Which assessment should first clarify Diane Foster’s peak-pressure rise at this recorded point?**

Key shown first for review only:

1. **Measure an end-inspiratory occlusion pressure** — key. Plateau measurement separates a dynamic peak-pressure rise from an increased static pressure burden before selecting an airway or lung intervention.
   - Temptation: Characterize mechanics before assuming the cause.
   - Reasonable under: Passive controlled ventilation with a new peak rise.
   - Timing: `timing.test.physiology` (existing placeholder; historical review, no order executes)
2. **Perform flexible bronchoscopic airway examination**. Bronchoscopy can evaluate selected persistent airway obstruction, but the peak signal has not yet distinguished a resistive from a static pressure problem.
   - Temptation: Assume mucus obstruction from an isolated dynamic maximum.
   - Reasonable under: Persistent suspected obstruction after simpler airway and pressure assessment.
   - Timing: `timing.test.clinical_procedure` (existing placeholder; historical review, no order executes)
3. **Perform thoracic pleural ultrasound examination**. Pleural assessment is valuable for a supported pneumothorax concern; peak pressure alone does not establish that target.
   - Temptation: Treat a high peak as a pleural distending-pressure event.
   - Reasonable under: A new static-pressure rise with compatible unilateral examination or instability.
   - Timing: `timing.test.ultrasound` (existing placeholder; historical review, no order executes)

Explanation: The peak is a dynamic maximum. An end-inspiratory pause during passive ventilation provides a static comparison that can direct the subsequent response. An unchanged delivered volume and stable oxygenation make a measured mechanics assessment appropriate in this record; this is not an instruction to delay emergency treatment in an unstable patient.

Reasoning 1: Recognize that an isolated peak rise does not establish resistance versus reduced compliance.

Reasoning 2: Select the pressure acquisition that distinguishes those mechanisms before a cause-specific intervention.

Closest credible error: Proceed directly to bronchoscopy because secretions are a familiar cause of a high peak.

Deciding observation: A matched passive pressure comparison is available from the current ventilator record; no static value has yet been acquired.

Consequence: Assuming a cause can lead to unnecessary invasive airway testing or an incorrect volume change.

Deletion test: Deleting the unchanged inputs makes the rise harder to interpret; deleting stability could prioritize urgent rescue. No sentence names an omitted plateau test.

Counterfactual and re-solve: With persistent unilateral obstruction after initial suction and controlled-pressure assessment, bronchoscopy becomes more reasonable.

Manual author gate (not independent PASS):

1. Cue attack: Three named assessments; every testing choice has a wait profile. No “not measured yet” sentence, no only cautious assessment versus treatments. The task does not name plateau.
2. Stage/category: All offered choices are named assessments at the current diagnostic stage. Rationales remain after answering.
3. Supported inferences: Recognize that an isolated peak rise does not establish resistance versus reduced compliance. Then Select the pressure acquisition that distinguishes those mechanisms before a cause-specific intervention.
4. Difficulty: Moderate/hard: resistive obstruction and pleural disease are credible concerns, but the record first needs the discriminating pressure acquisition.
5. Single best answer: A matched passive pressure comparison is available from the current ventilator record; no static value has yet been acquired. Counterfactual: With persistent unilateral obstruction after initial suction and controlled-pressure assessment, bronchoscopy becomes more reasonable.

Sequence/previous feedback attack: First node. Feedback describes what a hold contributes but does not identify the next record’s cause or treatment.

Exact visible-context SHA-256: `c00da8b43086d1125100e7a40492bbd474df1363764701d272bac6ac0111517a`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.plateau`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### secretion-response

`question.topic.critical-respiratory-ventilation.secretion-response.v1` · `node.topic.critical-respiratory-ventilation.secretion-response.v1` · `concept.critical-respiratory-ventilation.secretion-response.v1`

Objective: Treat a secretion-associated resistive pressure rise after controlled static-pressure assessment.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Ventilation questions**. Patient: Diane Foster, 63, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Diane Foster, a 63-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from the ventilated phase of her pneumonia admission.

Current update (shown only at this decision): Next hospital entry: with the same volume, flow and measured total PEEP, peak pressure is 39 and passive plateau is 19 cm H2O; earlier values were 25 and 19. Coarse airway sounds accompany visible secretions in the endotracheal tube.

None.

Task: **Which intervention should have been prioritized for Diane Foster at this recorded assessment?**

Key shown first for review only:

1. **Preoxygenate and suction the endotracheal tube** — key. The widening peak-to-plateau difference plus visible secretions supports airway clearance.
   - Temptation: Interpret the pressure pattern together with the airway observation.
   - Reasonable under: This supplied secretion-associated pattern.
   - Timing: no testing choice; no fixed wait authored
2. **Administer an inhaled bronchodilator through the circuit**. Bronchospasm can increase resistance, but the supplied secretion findings favor suction as the first directed intervention.
   - Temptation: Treat every resistive rise as smooth-muscle narrowing.
   - Reasonable under: A compatible bronchospastic examination without visible retained secretions.
   - Timing: no testing choice; no fixed wait authored
3. **Reduce the delivered tidal volume**. Volume reduction addresses excessive static pressure in selected records; unchanged plateau here points toward a different immediate target.
   - Temptation: React to peak pressure as if it were plateau pressure.
   - Reasonable under: Persistent excessive plateau at the current protective prescription.
   - Timing: no testing choice; no fixed wait authored

Explanation: The static pressure is unchanged while the dynamic pressure difference widens. Visible secretions then identify a treatable airway contributor. Preoxygenated suction is appropriate; these measurements do not establish that all resistive loading is bronchospasm.

Reasoning 1: Interpret stable plateau with a larger dynamic gradient as a resistive change.

Reasoning 2: Use the airway finding to choose clearance rather than bronchodilation or reducing volume.

Closest credible error: Choose a bronchodilator because resistance is high.

Deciding observation: Visible tube secretions plus coarse sounds, with unchanged passive plateau.

Consequence: A missed airway obstruction can persist while a different setting is changed.

Deletion test: Delete the airway finding and bronchodilator becomes a credible rival; delete plateau and a static-pressure problem cannot be separated.

Counterfactual and re-solve: If secretions were absent and new diffuse bronchospastic sounds dominated with the same mechanics, a bronchodilator would become reasonable.

Manual author gate (not independent PASS):

1. Cue attack: All labels are short interventions, no explanatory distractor wording. Retained visible secretions as the genuine treatment discriminator; prior feedback does not disclose them.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Interpret stable plateau with a larger dynamic gradient as a resistive change. Then Use the airway finding to choose clearance rather than bronchodilation or reducing volume.
4. Difficulty: Moderate: inference one is supplied by neither the peak alarm nor prior feedback; inference two distinguishes two causes of the same resistive pattern.
5. Single best answer: Visible tube secretions plus coarse sounds, with unchanged passive plateau. Counterfactual: If secretions were absent and new diffuse bronchospastic sounds dominated with the same mechanics, a bronchodilator would become reasonable.

Sequence/previous feedback attack: Later node uses new pressure results and secretion observations. Prior feedback explains measurement value, not the keyed treatment.

Exact visible-context SHA-256: `791c9f7c83a0acc9144c1a97a75810e90c85d7ef6aa811be8286755167581523`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.plateau`, `claim.critical-respiratory-ventilation.suction`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### expiratory-time

`question.topic.critical-respiratory-ventilation.expiratory-time.v1` · `node.topic.critical-respiratory-ventilation.expiratory-time.v1` · `concept.critical-respiratory-ventilation.expiratory-time.v1`

Objective: Reduce breath frequency when incomplete exhalation causes intrinsic PEEP during severe obstructive ventilation.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Breathing follow-up**. Patient: Mark Price, 44, Male. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Mark Price, a 44-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an admission for a severe asthma exacerbation.

Current update (shown only at this decision): Hospital record: during passive volume control for asthma, PaCO2 rises to 68 mm Hg and pH is 7.28. Blood pressure is stable. Bronchodilator therapy continues.

| Record | Rate | Expiratory flow at next inspiration | Set / measured total PEEP | Plateau pressure |
|---|---|---|---|---|
| Current record | 28/min | Still −10 L/min | 5 / 16 cm H2O | 31 cm H2O |

Task: **Which ventilator adjustment best fits Mark Price’s recorded pattern?**

Key shown first for review only:

1. **Reduce the set respiratory rate** — key. More expiratory time addresses incomplete exhalation and intrinsic PEEP even though PaCO2 remains elevated.
   - Temptation: Prioritize the mechanics that caused trapping.
   - Reasonable under: The supplied persistent expiratory flow and total-PEEP excess.
   - Timing: no testing choice; no fixed wait authored
2. **Increase the set respiratory rate**. Trying to normalize carbon dioxide by shortening expiration can worsen trapping.
   - Temptation: Treat the gas result without interpreting the expiratory record.
   - Reasonable under: Hypercapnia with complete exhalation and no intrinsic-PEEP concern, after reassessment.
   - Timing: no testing choice; no fixed wait authored
3. **Increase the delivered tidal volume**. A larger breath can add trapped volume rather than resolve incomplete exhalation.
   - Temptation: Increase minute ventilation without accounting for expiratory limitation.
   - Reasonable under: A different low-volume record with complete expiration and acceptable distending pressure.
   - Timing: no testing choice; no fixed wait authored

Explanation: The negative expiratory flow at the next inspiration and total PEEP above the set value indicate incomplete emptying. Reducing rate lengthens expiration. Follow gas exchange and pressures rather than trying to normalize PaCO2 by adding more frequent or larger breaths. No universal rate or acceptable-pH threshold is prescribed.

Reasoning 1: Infer incomplete emptying and intrinsic PEEP from flow and occlusion measurements.

Reasoning 2: Choose more expiratory time despite the temptation to increase minute ventilation for hypercapnia.

Closest credible error: Increase rate to correct PaCO2.

Deciding observation: Expiratory flow has not returned to zero and measured total PEEP exceeds set PEEP.

Consequence: Increasing frequency can worsen trapped volume and intrathoracic pressure.

Deletion test: Removing the expiratory/PEEP observations makes increased rate a plausible hypercapnia response. The blood gas supplies the credible competing goal.

Counterfactual and re-solve: If exhalation were complete, total PEEP equaled set PEEP and distending pressure allowed, a higher rate could become reasonable for hypercapnia.

Manual author gate (not independent PASS):

1. Cue attack: No waveform diagnosis is supplied; a numeric sample table is used because the objective is interpreting recorded flow/occlusion values, not identifying an absent tracing. Three parallel adjustments; no rationale in labels.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Infer incomplete emptying and intrinsic PEEP from flow and occlusion measurements. Then Choose more expiratory time despite the temptation to increase minute ventilation for hypercapnia.
4. Difficulty: Hard: a familiar response to hypercapnia is opposed by the actual expiratory mechanics. Rate action has one direct review with independent guideline support for assessing auto-PEEP.
5. Single best answer: Expiratory flow has not returned to zero and measured total PEEP exceeds set PEEP. Counterfactual: If exhalation were complete, total PEEP equaled set PEEP and distending pressure allowed, a higher rate could become reasonable for hypercapnia.

Sequence/previous feedback attack: Standalone. No drug, sedation reversal, or acid-base calculation is scored.

Exact visible-context SHA-256: `c0a78ff34915ad828566b5ef27e4b1f5fd05c85e6a24a2215a01cfbc550b1b8a`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.air-trapping`, `claim.critical-respiratory-ventilation.plateau`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### sbt-readiness

`question.topic.critical-respiratory-ventilation.sbt-readiness.v1` · `node.topic.critical-respiratory-ventilation.sbt-readiness.v1` · `concept.critical-respiratory-ventilation.sbt-readiness.v1`

Objective: Start a spontaneous breathing trial using overall readiness rather than an isolated RSBI gate.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Hospital follow-up**. Patient: Sarah Nguyen, 61, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.

Current update (shown only at this decision): Hospital record: Sarah follows commands and initiates breaths after pneumonia improves. PaO2 is 86 mm Hg on FiO2 0.35 and PEEP 5 cm H2O. Blood pressure is 118/70 mm Hg without vasopressors. A brief unsupported sample reports an RSBI of 118 breaths/min/L.

None.

Task: **Which liberation assessment should have been chosen next for Sarah Nguyen at this recorded point?**

Key shown first for review only:

1. **Perform a minimal-support spontaneous breathing trial** — key. The global readiness observations support an SBT; a single RSBI need not be a mandatory gate.
   - Temptation: Use the complete readiness assessment rather than one index.
   - Reasonable under: The supplied recovery, effort, oxygenation and circulatory course.
   - Timing: `timing.test.physiology` (existing placeholder; historical review, no order executes)
2. **Repeat the rapid shallow breathing index assessment**. Repeating the isolated index adds a gate rather than testing whether she tolerates an SBT.
   - Temptation: Treat an index above an older threshold as a reason to defer a trial.
   - Reasonable under: A specific acquisition error or a separate need to verify that measurement.
   - Timing: `timing.test.physiology` (existing placeholder; historical review, no order executes)
3. **Perform a stepwise SIMV rate-reduction trial**. Gradually reducing mandatory rate can delay liberation when direct SBT readiness is present.
   - Temptation: Equate gradual weaning with the required first assessment for every patient.
   - Reasonable under: A distinct individualized weaning situation after failure assessment; not mandated by the isolated index.
   - Timing: `timing.test.physiology` (existing placeholder; historical review, no order executes)

Explanation: Use recovery, spontaneous effort, oxygenation and circulatory stability to assess trial readiness. AARC does not require an RSBI calculation as a gate to an SBT. This does not mean that one favorable vital sign or every patient with a high index should automatically be extubated.

Reasoning 1: Integrate recovery, oxygen support, spontaneous effort and hemodynamics as readiness evidence.

Reasoning 2: Avoid allowing a single screening index to replace a monitored breathing trial.

Closest credible error: Defer a trial until the RSBI is lower.

Deciding observation: The patient has the supplied multidomain readiness observations despite the isolated index.

Consequence: An isolated-index gate can unnecessarily prolong invasive support.

Deletion test: Deleting recovery/oxygen support and spontaneous effort removes readiness; deleting RSBI removes the clinically credible competing gate. No safety-screen conclusion is supplied.

Counterfactual and re-solve: With persistent pressor escalation or inability to initiate breaths, continued support and cause assessment would take priority over an SBT.

Manual author gate (not independent PASS):

1. Cue attack: All three assessment strategies have the same physiology wait profile, so the key is not the only timed choice. Removed numerical threshold from distractor wording; no criterion is taught before answering.
2. Stage/category: All offered choices are named assessments at the current diagnostic stage. Rationales remain after answering.
3. Supported inferences: Integrate recovery, oxygen support, spontaneous effort and hemodynamics as readiness evidence. Then Avoid allowing a single screening index to replace a monitored breathing trial.
4. Difficulty: Moderate: integrate several domains and resist an entrenched single-index rule. Independent review should challenge whether the RSBI competitor remains credible for the intended resident.
5. Single best answer: The patient has the supplied multidomain readiness observations despite the isolated index. Counterfactual: With persistent pressor escalation or inability to initiate breaths, continued support and cause assessment would take priority over an SBT.

Sequence/previous feedback attack: First node; no later oxygen-concentration change or airway-clearance result is visible. Feedback does not state either later key.

Exact visible-context SHA-256: `8cc11649d36d5e9efb23c77f226cc9132eaa2a1f62cf527f2b89a6d6fcaf59eb`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.sbt-readiness`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### sbt-fio2

`question.topic.critical-respiratory-ventilation.sbt-fio2.v1` · `node.topic.critical-respiratory-ventilation.sbt-fio2.v1` · `concept.critical-respiratory-ventilation.sbt-fio2.v1`

Objective: Reassess an SBT performed under increased oxygen support before using it as evidence for extubation.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Hospital follow-up**. Patient: Sarah Nguyen, 61, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.

Current update (shown only at this decision): Next hospital entry: a minimal-support breathing trial is charted as tolerated. Sarah remains comfortable, but its settings and measurements are recorded below.

| Record | FiO2 | SpO2 | Respiratory rate |
|---|---|---|---|
| Before trial | 0.35 | 94% | 22/min |
| During trial | 0.60 | 97% | 25/min |

Task: **Which plan best fits Sarah Nguyen’s recorded breathing trial before an extubation decision?**

Key shown first for review only:

1. **Repeat the trial at the preceding FiO2** — key. The increased oxygen support can hide the oxygenation demand that the trial was meant to test.
   - Temptation: Compare support conditions, not just improved saturation.
   - Reasonable under: The changed-FiO2 trial with no current distress.
   - Timing: `timing.test.physiology` (existing placeholder; historical review, no order executes)
2. **Extubate to the trial oxygen concentration**. The higher saturation occurred under greater oxygen support and does not by itself establish an equivalent trial.
   - Temptation: Read the better displayed saturation as independent evidence of recovery.
   - Reasonable under: A valid unchanged-support trial plus a satisfactory airway assessment.
   - Timing: no testing choice; no fixed wait authored
3. **Repeat the trial with added pressure support**. Additional assistance changes another support input without resolving the oxygen-condition comparison.
   - Temptation: Make the trial easier when its apparent success is already confounded.
   - Reasonable under: A separate evaluation of tolerance under an intentionally different assistance protocol.
   - Timing: `timing.test.physiology` (existing placeholder; historical review, no order executes)

Explanation: The saturation rose while FiO2 also rose. AARC conditionally favors retaining the preceding FiO2 during an SBT because increasing it may conceal an oxygenation limitation. For this comfortable patient, reassessing under the preceding oxygen condition addresses the uncertainty. The recommendation has very low certainty and is not a universal extubation mandate.

Reasoning 1: Identify that apparent oxygenation improvement occurred under increased oxygen support.

Reasoning 2: Obtain an interpretable trial before making the airway-removal decision.

Closest credible error: Use improved saturation as proof of readiness to extubate.

Deciding observation: FiO2 rose from 0.35 to 0.60 during the trial.

Consequence: A falsely reassuring trial can lead to premature removal of support.

Deletion test: Deleting either timepoint hides the change in support. Comfort distinguishes reassessment from immediate rescue; no later cough finding is supplied.

Counterfactual and re-solve: If the same comfortable trial had occurred at unchanged FiO2 with satisfactory airway assessment, planned extubation would become reasonable.

Manual author gate (not independent PASS):

1. Cue attack: Three concrete plans, no option states why it is correct. Both offered testing paths have physiology waits. The task asks a neutral plan; it does not name an invalid test or an oxygenation safety principle.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Identify that apparent oxygenation improvement occurred under increased oxygen support. Then Obtain an interpretable trial before making the airway-removal decision.
4. Difficulty: Moderate/hard: the displayed result improves, but the acquisition conditions determine whether that improvement is interpretable. Evidence certainty is explicitly low.
5. Single best answer: FiO2 rose from 0.35 to 0.60 during the trial. Counterfactual: If the same comfortable trial had occurred at unchanged FiO2 with satisfactory airway assessment, planned extubation would become reasonable.

Sequence/previous feedback attack: Prior feedback concerns trial readiness and RSBI. It does not reveal the oxygen-acquisition problem. This node’s feedback does not describe future secretion findings.

Exact visible-context SHA-256: `59315a1e6f196cd1018c2452f0bb5dc5d725a98073cdd0273806c4dcabe95d68`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.sbt-oxygen`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### extubation-clearance

`question.topic.critical-respiratory-ventilation.extubation-clearance.v1` · `node.topic.critical-respiratory-ventilation.extubation-clearance.v1` · `concept.critical-respiratory-ventilation.extubation-clearance.v1`

Objective: Separate breathing-trial tolerance from airway-clearance readiness.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Hospital follow-up**. Patient: Sarah Nguyen, 61, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Sarah Nguyen, a 61-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from recovery after pneumonia requiring intubation.

Current update (shown only at this decision): Later hospital entry: Sarah tolerates a repeated trial at the preceding FiO2. She follows commands and has a cuff leak. Her cough does not move secretions into the endotracheal tube; pooled secretions repeatedly require suction.

None.

Task: **Which airway plan best fits Sarah Nguyen at this recorded extubation assessment?**

Key shown first for review only:

1. **Continue intubation and airway clearance** — key. Breathing tolerance and a cuff leak do not establish secretion clearance when cough remains ineffective.
   - Temptation: Check the function needed after tube removal.
   - Reasonable under: The supplied repeated pooling and ineffective cough.
   - Timing: no testing choice; no fixed wait authored
2. **Extubate to high-flow nasal oxygen**. Oxygen support does not replace the current need for an artificial airway to clear secretions.
   - Temptation: Treat SBT tolerance as the complete extubation decision.
   - Reasonable under: A tolerated trial plus effective cough and manageable secretions.
   - Timing: no testing choice; no fixed wait authored
3. **Extubate to bilevel mask ventilation**. Mask ventilatory assistance does not remedy inability to clear the supplied secretions.
   - Temptation: Use extra ventilatory support to compensate for a different airway function.
   - Reasonable under: A high-risk planned extubation with effective airway clearance.
   - Timing: no testing choice; no fixed wait authored

Explanation: An SBT evaluates breathing under reduced support. Effective airway clearance remains a separate requirement. The actual cough and secretion observations support continuing intubation while that problem is addressed; a leak or acceptable oxygenation does not settle it.

Reasoning 1: Interpret the tolerated trial as breathing evidence rather than proof of independent airway clearance.

Reasoning 2: Use ineffective cough and secretion pooling to defer tube removal.

Closest credible error: Extubate to mask support after a tolerated trial.

Deciding observation: The cough fails to move secretions and pooling recurs despite the tolerated trial.

Consequence: Post-extubation oxygen or mask support may leave the clearance problem unresolved.

Deletion test: Delete the cough/secretions observations and extubation becomes reasonable. The cuff leak is necessary competing evidence rather than an author conclusion of readiness.

Counterfactual and re-solve: With effective cough and manageable secretions after the same tolerated trial, extubation to suitable oxygen support would be reasonable.

Manual author gate (not independent PASS):

1. Cue attack: Parallel airway plans of similar length. No “cannot protect airway” interpretation is supplied. The leak remains a realistic near-miss, not a named missing-action clue.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Interpret the tolerated trial as breathing evidence rather than proof of independent airway clearance. Then Use ineffective cough and secretion pooling to defer tube removal.
4. Difficulty: Moderate: distinguish separate airway functions and reject two commonly proposed post-extubation supports for the wrong residual problem.
5. Single best answer: The cough fails to move secretions and pooling recurs despite the tolerated trial. Counterfactual: With effective cough and manageable secretions after the same tolerated trial, extubation to suitable oxygen support would be reasonable.

Sequence/previous feedback attack: Earlier tasks do not teach cough criteria. New observed function supplies a distinct decision after the oxygen-condition problem is resolved.

Exact visible-context SHA-256: `1fd67e04ba2b80a0063312791c5f682f9924db88d175933c3af5e4bcff7684b5`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.airway-clearance`, `claim.critical-respiratory-ventilation.niv-prevention`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### copd-niv

`question.topic.critical-respiratory-ventilation.copd-niv.v1` · `node.topic.critical-respiratory-ventilation.copd-niv.v1` · `concept.critical-respiratory-ventilation.copd-niv.v1`

Objective: Choose bilevel NIV for acute hypercapnic COPD acidosis without immediate deterioration.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Breathing follow-up**. Patient: Robert Diaz, 70, Male. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation that initially received mask support.

Current update (shown only at this decision): Hospital record: after inhaled bronchodilator treatment, Robert has respiratory rate 30/min with accessory-muscle use. He is alert and clears oral secretions. Blood pressure is 128/72 mm Hg.

| Record | pH | PaCO2 | PaO2 / oxygen condition |
|---|---|---|---|
| Before illness | 7.38 | 50 mm Hg | Room air |
| Current arterial sample | 7.28 | 70 mm Hg | 62 mm Hg on FiO2 0.28 |

Task: **Which respiratory-support strategy best fits Robert Diaz’s initial hospital assessment?**

Key shown first for review only:

1. **Start bilevel mask ventilation** — key. The change from compensated baseline hypercapnia to respiratory acidosis and distress supports a monitored bilevel trial.
   - Temptation: Use the baseline comparison and current clinical state.
   - Reasonable under: The supplied acidotic COPD exacerbation without immediate deterioration.
   - Timing: no testing choice; no fixed wait authored
2. **Start high-flow nasal oxygen**. Oxygen delivery is not the recommended substitute for bilevel ventilatory assistance in the stated acidotic COPD exacerbation.
   - Temptation: Focus on oxygen tension rather than the new ventilatory problem.
   - Reasonable under: A selected oxygenation problem without the supplied acidotic ventilatory failure.
   - Timing: no testing choice; no fixed wait authored
3. **Start invasive endotracheal ventilation**. Immediate invasive support is not the preferred first strategy for this alert patient without immediate deterioration.
   - Temptation: Treat every elevated PaCO2 or acidotic value as an automatic intubation indication.
   - Reasonable under: Immediate deterioration or failure of an appropriate monitored trial.
   - Timing: no testing choice; no fixed wait authored

Explanation: The baseline and current gases show a new acidotic ventilatory problem rather than elevated PaCO2 in isolation. ERS/ATS supports bilevel NIV for an acidotic COPD exacerbation in a patient not immediately deteriorating. The support choice depends on clinical state as well as the gas; this is not a pH-alone rule.

Reasoning 1: Distinguish acute respiratory acidosis from the patient’s compensated baseline hypercapnia.

Reasoning 2: Select noninvasive ventilatory support using preserved interaction and secretion clearance.

Closest credible error: Choose oxygen-focused support because the arterial oxygen tension is low.

Deciding observation: New pH decline with rising PaCO2 despite treatment, together with alertness and effective secretion clearance.

Consequence: Oxygen-focused support can miss ventilatory failure, while immediate intubation may be avoidable.

Deletion test: Deleting baseline loses acute-on-chronic interpretation; deleting interaction/clearance removes the key boundary with invasive ventilation.

Counterfactual and re-solve: With apnea or rapid deterioration at the initial assessment, invasive endotracheal support would take priority.

Manual author gate (not independent PASS):

1. Cue attack: All choices are three-to-four-word named support strategies. No availability sentence, no “meets NIV criteria” label, and no exact cutoff in the lead-in.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Distinguish acute respiratory acidosis from the patient’s compensated baseline hypercapnia. Then Select noninvasive ventilatory support using preserved interaction and secretion clearance.
4. Difficulty: Moderate/hard: the closest errors are treating oxygenation rather than ventilation and overreading a single gas as a mandatory intubation signal.
5. Single best answer: New pH decline with rising PaCO2 despite treatment, together with alertness and effective secretion clearance. Counterfactual: With apnea or rapid deterioration at the initial assessment, invasive endotracheal support would take priority.

Sequence/previous feedback attack: First node. Feedback deliberately omits a list of later failure signs.

Exact visible-context SHA-256: `36ab0e14f94372e07a7fb3181db8c244077b7f1d573a2d977d5a7356aa303f1e`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.niv-copd`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### copd-niv-failure

`question.topic.critical-respiratory-ventilation.copd-niv-failure.v1` · `node.topic.critical-respiratory-ventilation.copd-niv-failure.v1` · `concept.critical-respiratory-ventilation.copd-niv-failure.v1`

Objective: Escalate promptly when a monitored NIV trial is followed by immediate clinical deterioration.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Breathing follow-up**. Patient: Robert Diaz, 70, Male. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation that initially received mask support.

Current update (shown only at this decision): Next hospital entry: during bilevel mask ventilation, Robert’s saturation rises to 94%. His arterial pH falls to 7.18 and PaCO2 rises to 88 mm Hg. Respiratory excursions become shallow; he opens his eyes only after repeated stimulation and oral secretions pool.

None.

Task: **Which support change should have been chosen next for Robert Diaz at this recorded reassessment?**

Key shown first for review only:

1. **Proceed to invasive endotracheal ventilation** — key. Worsening ventilation, consciousness and clearance indicate deteriorating mask support despite the improved saturation.
   - Temptation: Use the trajectory across clinical domains.
   - Reasonable under: The supplied simultaneous deterioration.
   - Timing: no testing choice; no fixed wait authored
2. **Increase bilevel mask assistance**. Extending the mask trial in the presence of immediate clinical deterioration risks delaying airway and ventilatory support.
   - Temptation: Treat lower pH as a reason to keep titrating the same interface regardless of clinical response.
   - Reasonable under: An alert patient with preserved clearance and a correctable support/leak issue.
   - Timing: no testing choice; no fixed wait authored
3. **Change to high-flow nasal oxygen**. Oxygen-focused support does not address this worsening ventilatory and airway problem.
   - Temptation: Use the improved saturation as the response endpoint.
   - Reasonable under: A different stable oxygenation-limited problem without this deterioration.
   - Timing: no testing choice; no fixed wait authored

Explanation: A higher saturation does not establish successful ventilation or airway function. The worsening gas and clinical trajectory together support invasive ventilation. The value 7.18 is a fictional observation, not an authored universal threshold for intubation.

Reasoning 1: Recognize that improved saturation coexists with worsening ventilation and clinical function.

Reasoning 2: Escalate from a deteriorating NIV trial rather than lengthen it or replace it with oxygen therapy.

Closest credible error: Continue mask titration because saturation improved.

Deciding observation: The new loss of interaction, shallow excursions, pooling and worsening gas occur together.

Consequence: Delayed escalation can leave respiratory failure and secretion pooling untreated.

Deletion test: Deleting clinical deterioration could permit further monitored NIV titration; deleting the improved saturation removes the competing but misleading response signal.

Counterfactual and re-solve: With improving pH, alert interaction and effective secretion clearance, continued bilevel titration would become reasonable.

Manual author gate (not independent PASS):

1. Cue attack: No “NIV failure” diagnosis or “cannot protect airway” sentence appears before selection. Three comparable support changes. Necessary warning signs are preserved despite their strong discriminative value.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Recognize that improved saturation coexists with worsening ventilation and clinical function. Then Escalate from a deteriorating NIV trial rather than lengthen it or replace it with oxygen therapy.
4. Difficulty: Moderate/hard: decision changes from the previous node because response trajectory changes; an isolated pH rule is insufficient.
5. Single best answer: The new loss of interaction, shallow excursions, pooling and worsening gas occur together. Counterfactual: With improving pH, alert interaction and effective secretion clearance, continued bilevel titration would become reasonable.

Sequence/previous feedback attack: The previous item makes NIV reasonable at its own stage. Its explanation does not supply these later clinical findings.

Exact visible-context SHA-256: `ee888a720209f33c345fb17658c21aa82c5b63aeb447a3f64ad7fbd1b7a23a7b`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.niv-failure`, `claim.critical-respiratory-ventilation.saturation`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### copd-planned-extubation

`question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1` · `node.topic.critical-respiratory-ventilation.copd-planned-extubation.v1` · `concept.critical-respiratory-ventilation.copd-planned-extubation.v1`

Objective: Use preventive NIV for a suitable high-risk planned extubation rather than wait for PaCO2 normalization.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Breathing follow-up**. Patient: Robert Diaz, 70, Male. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Robert Diaz, a 70-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from an acute COPD exacerbation that initially received mask support.

Current update (shown only at this decision): Later hospital entry: after invasive support, Robert tolerates an SBT with stable blood pressure. He follows commands and clears secretions. End-trial pH is 7.38 and PaCO2 is 52 mm Hg; the pre-illness values were 7.38 and 50 mm Hg. Low-flow oxygen maintains the trial’s oxygenation.

None.

Task: **Which airway plan best fits Robert Diaz’s recorded recovery assessment?**

Key shown first for review only:

1. **Extubate directly to bilevel mask support** — key. A suitable high-risk patient with chronic respiratory disease and hypercapnia can receive preventive NIV immediately after planned extubation.
   - Temptation: Separate chronic gas values from new failure and apply prevention at the correct phase.
   - Reasonable under: The tolerated trial with effective clearance in this older COPD patient.
   - Timing: no testing choice; no fixed wait authored
2. **Extubate directly to standard nasal oxygen**. Standard oxygen offers less of the verified preventive ventilatory strategy for this selected high-risk hypercapnic profile.
   - Temptation: Treat breathing-trial tolerance as eliminating the patient-specific risk.
   - Reasonable under: A patient without the supplied high-risk chronic respiratory profile.
   - Timing: no testing choice; no fixed wait authored
3. **Continue intubation until PaCO2 normalizes**. The current pH and PaCO2 approximate his compensated baseline; a normal laboratory PaCO2 is not required by these observations.
   - Temptation: Apply a laboratory reference target instead of the patient’s chronic baseline.
   - Reasonable under: Persistent acute ventilatory deterioration or another unresolved extubation barrier.
   - Timing: no testing choice; no fixed wait authored

Explanation: The trial and clearance observations support planned tube removal; the gas has returned near the documented compensated baseline. For this selected high-risk chronic respiratory profile, immediate preventive NIV is supported. This does not rank NIV against every HFNC/NIV regimen or make preventive NIV the rule for all extubations.

Reasoning 1: Interpret residual hypercapnia against the documented baseline and the tolerated trial.

Reasoning 2: Choose preventive support at planned extubation rather than prolonged intubation for a reference-range target.

Closest credible error: Continue invasive support until PaCO2 enters the laboratory interval.

Deciding observation: End-trial pH and PaCO2 match the compensated baseline, with effective clearance and a tolerated trial.

Consequence: Waiting for an inapplicable gas target can prolong invasive support; omitting prevention may increase failure risk in selected high-risk patients.

Deletion test: Delete baseline and persistent acute acidosis becomes uncertain; delete airway-clearance data and planned extubation is not established. Chronic disease and age establish the preventive-support population.

Counterfactual and re-solve: Without chronic respiratory disease or other high-risk features after a valid trial, standard nasal oxygen becomes reasonable.

Manual author gate (not independent PASS):

1. Cue attack: Three short airway plans. No “high risk” eligibility conclusion is supplied; data and history establish it. HFNC is not used as a falsely inferior distractor where evidence may support it.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Interpret residual hypercapnia against the documented baseline and the tolerated trial. Then Choose preventive support at planned extubation rather than prolonged intubation for a reference-range target.
4. Difficulty: Hard: distinguish baseline physiology, breathing readiness, airway function and the timing of prevention. Conditional evidence remains explicitly limited.
5. Single best answer: End-trial pH and PaCO2 match the compensated baseline, with effective clearance and a tolerated trial. Counterfactual: Without chronic respiratory disease or other high-risk features after a valid trial, standard nasal oxygen becomes reasonable.

Sequence/previous feedback attack: Earlier failure feedback addresses acute deterioration. This later record earns a separate planned-extubation decision through return to baseline and current airway function.

Exact visible-context SHA-256: `c7e7356c86f93cde5fbd6dcfff9900c383bcf83286e8880ff9e6e1738f2fdd4c`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.niv-prevention`, `claim.critical-respiratory-ventilation.niv-copd`, `claim.critical-respiratory-ventilation.airway-clearance`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### delivery-flow-assessment

`question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` · `node.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` · `concept.critical-respiratory-ventilation.delivery-flow-assessment.v1`

Objective: Assess blood flow when venous oxygenation falls despite improved arterial carriage and unchanged oxygen consumption.

Before: `inventory.08016092c7d763fc` (complete before packet above)

Concept relation: `new_meaning`; previous concept: `concept.gs028f.critical-care.normal-spo2-anemia-content`.

Complaint: **Hospital questions**. Patient: Brian Lewis, 68, Male. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Brian Lewis, a 68-year-old man, attends clinic after hospital discharge. The founder reviews his outside records from a postoperative admission in which oxygen-delivery measurements changed.

Current update (shown only at this decision): Hospital record: during a monitored postoperative interval, oxygen consumption is unchanged on repeated indirect calorimetry. Contemporaneous arterial and pulmonary-artery samples give the values below. Catheter position and sample labels are verified; the team is deciding what to investigate before changing support.

| Record | Hemoglobin | Arterial saturation / PaO2 | Mixed-venous saturation |
|---|---|---|---|
| Earlier | 8.0 g/dL | 96% / 82 mm Hg | 72% |
| Later | 10.0 g/dL | 99% / 110 mm Hg | 50% |

Task: **Which assessment should have been prioritized to explain Brian Lewis’s recorded mixed-venous trend?**

Key shown first for review only:

1. **Obtain transthoracic Doppler echocardiography** — key. Improved arterial carriage with unchanged consumption but lower mixed-venous saturation raises a blood-flow question; Doppler assessment can characterize cardiac output and function.
   - Temptation: Assess the remaining delivery component before attributing the trend to saturation or hemoglobin.
   - Reasonable under: This verified discordant record.
   - Timing: `timing.test.ultrasound` (existing placeholder; historical review, no order executes)
2. **Repeat the complete blood count**. The paired current blood counts show higher hemoglobin, so repeat measurement does not address the principal residual flow uncertainty.
   - Temptation: Treat low venous saturation as necessarily a hemoglobin-carriage problem.
   - Reasonable under: A new bleeding trajectory or uncertain/noncontemporaneous hemoglobin sample.
   - Timing: `timing.test.basic_labs` (existing placeholder; historical review, no order executes)
3. **Repeat the arterial blood gas**. Arterial oxygenation has improved in contemporaneous samples; repeating that measurement does not characterize the remaining flow component.
   - Temptation: Equate venous desaturation with persistent arterial oxygenation failure.
   - Reasonable under: An unreliable arterial sample or a new gas-exchange deterioration.
   - Timing: `timing.test.basic_labs` (existing placeholder; historical review, no order executes)

Explanation: The arterial measurements indicate improved oxygen carriage, while lower mixed-venous saturation at unchanged consumption indicates greater extraction. Assess flow rather than assuming normal saturation establishes adequate delivery. Doppler echocardiography can evaluate output and cardiac contributions; these observations do not diagnose a specific shock type or justify a particular fluid or inotrope order.

Reasoning 1: Integrate higher hemoglobin and arterial oxygenation with lower mixed-venous saturation at unchanged consumption.

Reasoning 2: Investigate the remaining blood-flow component rather than repeat the already contemporary carriage measurements.

Closest credible error: Repeat arterial gas testing because the venous saturation fell.

Deciding observation: Arterial carriage improves and consumption is unchanged while verified mixed-venous saturation falls.

Consequence: Additional oxygen or hemoglobin-focused evaluation can miss a delivery problem in blood flow.

Deletion test: Deleting oxygen consumption reopens increased demand as an explanation; deleting arterial/hemoglobin data reopens those delivery components; removing provenance reopens sampling error.

Counterfactual and re-solve: If the later arterial oxygenation had worsened or its sample provenance were uncertain, arterial gas reassessment would become appropriate.

Manual author gate (not independent PASS):

1. Cue attack: Three named investigations with all wait metadata supplied. No “low cardiac output” interpretation, shock diagnosis or missing-echo sentence appears. Rationale is not paraphrased in the clinic frame.
2. Stage/category: All offered choices are named assessments at the current diagnostic stage. Rationales remain after answering.
3. Supported inferences: Integrate higher hemoglobin and arterial oxygenation with lower mixed-venous saturation at unchanged consumption. Then Investigate the remaining blood-flow component rather than repeat the already contemporary carriage measurements.
4. Difficulty: Hard, author prediction: requires distinguishing arterial carriage, extraction and delivery before choosing an assessment. Single-review support for exact investigation ranking is a clinical-review limitation.
5. Single best answer: Arterial carriage improves and consumption is unchanged while verified mixed-venous saturation falls. Counterfactual: If the later arterial oxygenation had worsened or its sample provenance were uncertain, arterial gas reassessment would become appropriate.

Sequence/previous feedback attack: Standalone. Secondary shock/hemodynamic overlap is reported to the manager; no fluid, pressor or inotrope decision is scored.

Exact visible-context SHA-256: `aa44675efb2302267d229bf511bf69a144b62160aad1a560ab52c316009962d2`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.saturation`, `claim.critical-respiratory-ventilation.content`, `claim.critical-respiratory-ventilation.delivery-flow`, `claim.critical-respiratory-ventilation.echo-flow`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

### postextubation-rescue

`question.topic.critical-respiratory-ventilation.postextubation-rescue.v1` · `node.topic.critical-respiratory-ventilation.postextubation-rescue.v1` · `concept.critical-respiratory-ventilation.postextubation-rescue.v1`

Objective: Avoid delaying reintubation with rescue NIV for established post-extubation failure in a non-COPD medical patient.

Before: **Empty — new gap question.**

Concept relation: `new_meaning`; previous concept: none; stable meaning reused or genuinely new gap.

Complaint: **Breathing recovery**. Patient: Elena Marsh, 55, Female. One constrained finite profile; no demographic substitution. Current clinic acuity **stable**; historical record acuity **critical**; educational tier **2**; facility level **0**, existing **clinic** setting, no additional capability.

Presentation: Elena Marsh, a 55-year-old woman, attends clinic after hospital discharge. The founder reviews her outside records from a medical pneumonia admission requiring ventilation; she had no operation or chronic obstructive lung disease during that admission.

Current update (shown only at this decision): Hospital record: after planned extubation for pneumonia, Elena develops increasing accessory-muscle use and fatigue. On high-flow nasal oxygen at FiO2 0.60, PaO2 is 54 mm Hg. PaCO2 rises from 39 to 59 mm Hg and pH falls to 7.26. She remains tired despite repositioning and airway clearance.

None.

Task: **Which respiratory-support plan best fits Elena Marsh’s recorded post-extubation deterioration?**

Key shown first for review only:

1. **Reintubate and resume invasive ventilation** — key. The record now shows established worsening post-extubation respiratory failure in the population where rescue NIV may delay needed reintubation.
   - Temptation: Distinguish rescue after failure from prevention in a selected high-risk patient.
   - Reasonable under: The supplied fatigue and worsening gas exchange despite oxygen support.
   - Timing: no testing choice; no fixed wait authored
2. **Begin rescue bilevel mask ventilation**. Preventive NIV evidence does not justify delaying reintubation for established failure in this non-COPD medical record.
   - Temptation: Transfer a successful preventive strategy to a later failure phase.
   - Reasonable under: Selected COPD hypercapnic failure or a separate evidence-supported postoperative context; not this medical population.
   - Timing: no testing choice; no fixed wait authored
3. **Escalate high-flow nasal oxygen**. Further oxygen-focused support does not resolve the worsening ventilation and fatigue already present.
   - Temptation: Treat oxygen tension as the whole respiratory-support problem.
   - Reasonable under: An isolated oxygenation need with sustained ventilation and no progressive fatigue.
   - Timing: no testing choice; no fixed wait authored

Explanation: This is rescue after deterioration, not prevention immediately after planned extubation. In general non-COPD medical patients with established post-extubation failure, ERS/ATS conditionally discourages NIV that may delay reintubation. The worsening ventilation and fatigue make continued oxygen escalation inadequate in this record. COPD and postoperative exceptions must not be erased.

Reasoning 1: Identify established respiratory failure after tube removal, including worsening ventilation rather than oxygenation alone.

Reasoning 2: Choose timely invasive support and avoid importing preventive NIV evidence into a different phase and population.

Closest credible error: Use mask support because NIV is useful after some planned extubations.

Deciding observation: This medical non-COPD patient is already deteriorating with fatigue and both oxygenation and ventilation impairment.

Consequence: A delayed reintubation can prolong unsupported failure.

Deletion test: Delete chronology/population and the NIV evidence boundary changes; delete ventilation/fatigue and an oxygen-focused trial could be reasonable.

Counterfactual and re-solve: In a suitable older COPD patient at the moment of planned extubation before failure develops, preventive bilevel support becomes reasonable.

Manual author gate (not independent PASS):

1. Cue attack: All options are concrete support plans. Necessary no-COPD/nonoperative population details are retained for evidence scope, not as an unsupported universal contraindication.
2. Stage/category: All offered choices are specific support or care plans at the recorded decision point. Rationales remain after answering.
3. Supported inferences: Identify established respiratory failure after tube removal, including worsening ventilation rather than oxygenation alone. Then Choose timely invasive support and avoid importing preventive NIV evidence into a different phase and population.
4. Difficulty: Hard: distinguish prevention from rescue and separate population-specific exceptions while interpreting the current response. Conditional guidance is not portrayed as an absolute ban.
5. Single best answer: This medical non-COPD patient is already deteriorating with fatigue and both oxygenation and ventilation impairment. Counterfactual: In a suitable older COPD patient at the moment of planned extubation before failure develops, preventive bilevel support becomes reasonable.

Sequence/previous feedback attack: Standalone so the COPD prevention explanation cannot directly rehearse this answer in the same encounter. Cross-case retrieval remains legitimate spaced learning.

Exact visible-context SHA-256: `8ca8f090cd182656d4d67fc9a020d6b73569358600953bb31afeaba4edd74ea6`. Includes the full earlier feedback/options; no future results. Claims: `claim.critical-respiratory-ventilation.niv-rescue`, `claim.critical-respiratory-ventilation.niv-failure`. Field-level mappings are in `proposedNodes[].clinicalStatementMappings`; all measurements and chronology are constructed.

Release holds: General independent review, manager acceptance and exact named clinical sign-off; no special original hold. All content remains **needs_clinician_review**.

## Concept identity and frozen-history decisions

- `concept.ards.permeability-edema-mechanism`: Preserve old definition and histories; changed scored meaning uses explicit separate concept. No merge, deletion or FSRS migration. Successors: `concept.critical-respiratory-ventilation.ards-prone-escalation.v1`.
- `concept.ards.predicted-body-weight-ventilation`: Preserved stable identity: selecting a PBW-indexed initial volume remains the same clinical rule. Successors: `concept.ards.predicted-body-weight-ventilation`.
- `concept.gs028f.critical-care.normal-spo2-anemia-content`: Preserve old definition and histories; changed scored meaning uses explicit separate concept. No merge, deletion or FSRS migration. Successors: `concept.critical-respiratory-ventilation.delivery-flow-assessment.v1`.
- `concept.n1.oxygen-saturation-missing-hemoglobin-assessment`: Preserve old definition and histories; changed scored meaning uses explicit separate concept. No merge, deletion or FSRS migration. No automatic successor/history merge.
- `concept.n1r3.oxygenation-red-cell-fatigue-workup`: Preserve old definition and histories; changed scored meaning uses explicit separate concept. No merge, deletion or FSRS migration. No automatic successor/history merge.
- `concept.n2.ventilator-elastic-versus-resistive-load`: Preserve old definition and histories; changed scored meaning uses explicit separate concept. No merge, deletion or FSRS migration. Successors: `concept.critical-respiratory-ventilation.pressure-assessment.v1`.
- `concept.n3.ards-weight-change-versus-tidal-volume-basis`: Preserve old definition and histories; changed scored meaning uses explicit separate concept. No merge, deletion or FSRS migration. No automatic successor/history merge.
- `concept.n3.ards-weight-change-versus-tidal-volume-basis.v2`: Preserve old definition and histories; changed scored meaning uses explicit separate concept. No merge, deletion or FSRS migration. Successors: `concept.critical-respiratory-ventilation.ards-pressure-limit.v1`.

The stable PBW rule remains `concept.ards.predicted-body-weight-ventilation`. Pressure-response, rescue-stage, discriminating acquisition and delivery/flow work are different scored meanings. Their previous concept IDs are explicit; old cards do not transfer to those new meanings. The three registered but inactive identities and both unregistered historical N3 identities remain visible in the assignment/history ledger.

Original holds carried verbatim:

- `review.n3.ards-weight-change-versus-tidal-volume-basis.v2` — owner_decision; `docs/research/question-new-n3-round4-20261110.json`; The weight-basis fact does not support an exact ventilator adjustment. A pressure-limited bedside order would be a useful new practical objective if the key is confirmed. Owner question: In ARDS with tidal volume already at 6 mL/kg predicted body weight and plateau pressure still 32 cm H2O, should the keyed next change be a lower tidal volume rather than waiting for diuresis to lower the scale weight?
- `review.n2.ventilator-elastic-versus-resistive-load.v3` — editorial_revise_park; `docs/research/question-new-n2-source-hold-disposition-20261105.json`; Retained REVISE disposition in the N2 source-hold/acceptance ledger.

Assigned unkeyed slots: **0**. Assigned withheld teaching points: **0**. New research exclusions/withheld expansions are separately recorded in the source ledger and are not counted as existing question verdicts.

## Atomic claims and permitted-source findings

Exact ledger: [sources-question-topic-critical-respiratory-ventilation-20261111.json](sources-question-topic-critical-respiratory-ventilation-20261111.json). It contains 12 complete source records, 22 independently phrased atomic claims, source→claim→question and reverse mappings, dates, authority, licences, exclusions, population limits and review state.

- `source.critical-respiratory-ventilation.esicm2023` — [ESICM guidelines on acute respiratory distress syndrome: definition, phenotyping and respiratory support strategies](https://link.springer.com/article/10.1007/s00134-023-07050-7). Giacomo Grasselli; Carolyn S. Calfee; Luigi Camporota; Daniele Poole; European Society of Intensive Care Medicine Taskforce on ARDS (full consortium in linked version of record). ESICM guidelines on acute respiratory distress syndrome: definition, phenotyping and respiratory support strategies. Intensive Care Medicine 49:727–759. 2023. doi:10.1007/s00134-023-07050-7. https://link.springer.com/article/10.1007/s00134-023-07050-7. Accessed 2026-11-11. Authority: GRADE adult nonpharmacologic ARDS guideline; current domain-specific guidance found in this targeted search. Rights: CC BY-NC 4.0; https://creativecommons.org/licenses/by-nc/4.0/. Rights paragraph and linked site terms inspected. Targeted fact verification; original statements and invented records only. No copied/adapted prose, tables, algorithms or images. Credit Grasselli et al.; independently synthesized applications, no endorsement. NC licence is not a commercial-reuse clearance.

- `source.critical-respiratory-ventilation.ahrq2017` — [Low Tidal Volume Ventilation: Introduction, Evidence, and Implementation: Facilitator Guide](https://www.ahrq.gov/hai/tools/mvp/modules/technical/ltvv-intro-fac-guide.html). Agency for Healthcare Research and Quality. Low Tidal Volume Ventilation: Introduction, Evidence, and Implementation: Facilitator Guide. AHRQ Safety Program for Mechanically Ventilated Patients. 2017. https://www.ahrq.gov/hai/tools/mvp/modules/technical/ltvv-intro-fac-guide.html. Accessed 2026-11-11. Authority: Official implementation guidance, last reviewed February 2017; independently cross-checks low-volume/pressure principle, not a new guideline. Rights: US government guidance; third-party content and marks excluded. Text facts only with agency attribution. Linked policy URLs could not be retrieved; do not assume every contractor figure is public domain. No toolkit expression or artwork reused.

- `source.critical-respiratory-ventilation.alta2007` — [Prospective, Randomized, Multicenter Trial of Aerosolized Albuterol Versus Placebo in Acute Lung Injury: ARDSNet Study 06, Version II](https://biolincc.nhlbi.nih.gov/media/studies/alta/Protocol.pdf). Michael A. Matthay; Roy Brower; ARDS Clinical Network. Prospective, Randomized, Multicenter Trial of Aerosolized Albuterol Versus Placebo in Acute Lung Injury: ARDSNet Study 06, Version II. NHLBI BioLINCC ALTA protocol; October 31, 2007. 2007. https://biolincc.nhlbi.nih.gov/media/studies/alta/Protocol.pdf. Accessed 2026-11-11. Authority: Original trial-protocol instructions directly verify reducing 6 to 5 and then 4 mL/kg PBW for plateau above 30; corroborated by modern protective-range guidance. Rights: Government-hosted research protocol; no blanket licence inferred. Only lung-protective ventilation appendix targeted. Historical research protocol is not a universal bedside algorithm; no protocol text/table reproduced and no albuterol regimen adopted.

- `source.critical-respiratory-ventilation.aarc-pva2024` — [AARC Clinical Practice Guideline: Patient-Ventilator Assessment](https://www.aarc.org/wp-content/uploads/2024/10/patient-ventilator-assessment-aarc-cpg.pdf). Lynda T. Goodfellow; Andrew G. Miller; Sarah M. Varekojis; Carolyn J. LaVita; Joel T. Glogowski; Dean R. Hess. AARC Clinical Practice Guideline: Patient-Ventilator Assessment. Respiratory Care 69(8):1042–1054. 2024. doi:10.4187/respcare.12007. https://www.aarc.org/wp-content/uploads/2024/10/patient-ventilator-assessment-aarc-cpg.pdf. Accessed 2026-11-11. Authority: GRADE recommendations on plateau, tidal volume, PEEP/auto-PEEP and artificial-airway assessment. Rights: Copyright 2024 Daedalus Enterprises; society-hosted public guideline. Targeted factual verification only; AARC privacy/site policy inspected, terms endpoint unavailable; no blanket AI/reuse licence asserted. No protected expression or figures retained.

- `source.critical-respiratory-ventilation.aarc-sbt2024` — [AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation](https://www.aarc.org/wp-content/uploads/2023/11/CPG2024SpontaneousBreathingTrial.pdf). Karsten J. Roberts; Lynda T. Goodfellow; Corinne M. Battey-Muse; Cheryl A. Hoerr; Megan L. Carreon; Morgan E. Sorg; Joel Glogowski; Timothy D. Girard; Neil R. MacIntyre; Dean R. Hess. AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation. Respiratory Care 69(7):891–901. 2024. doi:10.4187/respcare.11735. https://www.aarc.org/wp-content/uploads/2023/11/CPG2024SpontaneousBreathingTrial.pdf. Accessed 2026-11-11. Authority: GRADE SBT guideline; RSBI recommendation moderate certainty, unchanged FiO2 recommendation very low certainty. Rights: Copyright 2024 Daedalus Enterprises; public society-hosted guideline. Public PDF is March 5 paper-in-press; final bibliographic record checked. Targeted facts only. Same publication at PMC is not independent corroboration. No source table/stem/example copied.

- `source.critical-respiratory-ventilation.aarc-suction2022` — [AARC Clinical Practice Guidelines: Artificial Airway Suctioning](https://www.aarc.org/wp-content/uploads/2022/10/cpg-artificial-airway-suctioning.pdf). Thomas C. Blakeman; J. Brady Scott; Mark A. Yoder; Emily Capellari; Shawna L. Strickland. AARC Clinical Practice Guidelines: Artificial Airway Suctioning. Respiratory Care 67(2):258–271. 2022. doi:10.4187/respcare.09548. https://www.aarc.org/wp-content/uploads/2022/10/cpg-artificial-airway-suctioning.pdf. Accessed 2026-11-11. Authority: Systematic evidence review with RAND/UCLA recommendation process; direct suction indications. Rights: Copyright 2022 Daedalus Enterprises; public society-hosted guideline. Targeted breath-sound/visible-secretion and preoxygenation facts only. No suction pressure, catheter-size table or duration imported.

- `source.critical-respiratory-ventilation.gayen2024` — [Critical Care Management of Severe Asthma Exacerbations](https://www.mdpi.com/2077-0383/13/3/859). Shameek Gayen; Stephen Dachert; Bilal H. Lashari; Matthew Gordon; Parag Desai; Gerard J. Criner; Juan Carlos Cardet; Kartik Shenoy. Critical Care Management of Severe Asthma Exacerbations. Journal of Clinical Medicine 13(3):859. 2024. doi:10.3390/jcm13030859. https://www.mdpi.com/2077-0383/13/3/859. Accessed 2026-11-11. Authority: Open specialist review, lower authority than a formal guideline; physiologic mechanics and air-trapping principles. Rights: CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Publisher licence inspected. Credit Gayen et al.; independent statements and constructed data, no adapted figure/table. Exact rate, I:E, dose and permissive-acidemia thresholds are not adopted.

- `source.critical-respiratory-ventilation.ers-ats-niv2017` — [Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure](https://www.thoracic.org/statements/resources/cc/niv-guidelines.pdf). Bram Rochwerg; Laurent Brochard; Mark W. Elliott; Dean Hess; Nicholas S. Hill; Stefano Nava; Paolo Navalesi; ERS/ATS task force (complete group in official PDF). Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure. European Respiratory Journal 50:1602426. 2017. doi:10.1183/13993003.02426-2016. https://www.thoracic.org/statements/resources/cc/niv-guidelines.pdf. Accessed 2026-11-11. Authority: GRADE NIV guidance. Strong COPD-acidosis recommendation; conditional low-certainty prophylaxis/rescue recommendations with population limits. Rights: Copyright ERS; official public society guideline. Targeted factual verification; no algorithm copied. Postoperative ARF and general post-extubation failure are distinct populations; rescue item deliberately uses nonoperative pneumonia without COPD. Search did not establish a newer joint replacement.

- `source.critical-respiratory-ventilation.fda2025` — [Pulse Oximeter Basics](https://www.fda.gov/consumers/consumer-updates/pulse-oximeter-basics). US Food and Drug Administration. Pulse Oximeter Basics. FDA Consumer Update; content current March 26, 2025. 2025. https://www.fda.gov/consumers/consumer-updates/pulse-oximeter-basics. Accessed 2026-11-11. Authority: Official explanation of saturation estimate and display limitations, not anemia/transfusion guidance. Rights: US FDA government text; third-party material excluded. Fresh page read. Existing local source.gs028f.fda_oximeter2025 records original access October 7, 2026; this new local record separately documents November 11 access. No device images or race-based selection rule used.

- `source.critical-respiratory-ventilation.nhlbi2025` — [Anemia: Diagnosis](https://www.nhlbi.nih.gov/health/anemia/diagnosis). National Heart, Lung, and Blood Institute. Anemia: Diagnosis. National Institutes of Health; local ledger records update December 18, 2025. 2025. https://www.nhlbi.nih.gov/health/anemia/diagnosis. Accessed 2026-11-11. Authority: Official hemoglobin-carriage and CBC facts, not transfusion thresholds. Rights: Official government information; no article-wide blanket reuse licence asserted. Fresh page verified carriage and CBC. Publication/update context retained from source.gs028f.nhlbi_anemia2025, original access October 7, 2026. No copied normal ranges, demographic adjustments or tables.

- `source.critical-respiratory-ventilation.aabb2024` — [Updates in Red Blood Cell Transfusion Thresholds](https://www.aabb.org/docs/default-source/default-document-library/resources/updates-in-red-blood-cell-transfusion-thresholds.pdf). Richard R. Gammon. Updates in Red Blood Cell Transfusion Thresholds. AABB Patient Blood Management; April 2024. 2024. https://www.aabb.org/docs/default-source/default-document-library/resources/updates-in-red-blood-cell-transfusion-thresholds.pdf. Accessed 2026-11-11. Authority: Society summary directly states 2023 guideline Recommendation 1 for stable hospitalized adults; one guideline evidence base, not independent replication. Rights: Copyright AABB; public guideline implementation summary. Targeted stable-adult threshold verification only. Primary guideline citation retained in relatedPublication below; JAMA search result not used as inaccessible evidence. No major-hemorrhage, ACS, cardiac/orthopedic exception extrapolated.

- `source.critical-respiratory-ventilation.russell2020` — [A Physiologic Approach to Hemodynamic Monitoring and Optimizing Oxygen Delivery in Shock Resuscitation](https://www.mdpi.com/2077-0383/9/7/2052). Amy Russell; Emanuel P. Rivers; Paresh C. Giri; Anja K. Jaehne; H. Bryant Nguyen. A Physiologic Approach to Hemodynamic Monitoring and Optimizing Oxygen Delivery in Shock Resuscitation. Journal of Clinical Medicine 9(7):2052. 2020. doi:10.3390/jcm9072052. https://www.mdpi.com/2077-0383/9/7/2052. Accessed 2026-11-11. Authority: Open physiologic review; supports delivery components and Doppler flow assessment, not a trial proving a universal algorithm. Rights: CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Credit Russell et al.; independent synthetic application. No train metaphor, source example, figure, dose, shock target or outdated transfusion target copied. Only delivery-component and measurement sections used.

Claims (new exact statements, all needs_clinician_review):

- `claim.critical-respiratory-ventilation.permeability`: Inflammatory injury can increase alveolar-capillary permeability and reduce aerated, compliant lung in ARDS. Sources: `source.critical-respiratory-ventilation.esicm2023`. Category definition; certainty high; last checked 2026-11-11. Limitation: Hydrostatic edema can coexist; neither a positive fluid balance nor preserved ejection fraction independently classifies all edema.

- `claim.critical-respiratory-ventilation.pbw`: Adult ARDS protective tidal volumes are indexed to predicted body weight, not fluid-dependent actual mass. Sources: `source.critical-respiratory-ventilation.esicm2023`, `source.critical-respiratory-ventilation.ahrq2017`, `source.critical-respiratory-ventilation.aarc-pva2024`. Category management; certainty high; last checked 2026-11-11. Limitation: No newly invented anthropometric formula; checked PBW is supplied as a constructed record value.

- `claim.critical-respiratory-ventilation.protective-range`: ARDS ventilation should limit tidal volume to a protective range of 4–8 mL/kg PBW and plateau pressure below 30 cm H2O. Sources: `source.critical-respiratory-ventilation.esicm2023`, `source.critical-respiratory-ventilation.aarc-pva2024`. Category management; certainty high; last checked 2026-11-11. Limitation: Range does not prove every value is equally appropriate; initial target and pressure response require their own mappings.

- `claim.critical-respiratory-ventilation.initial-six`: An initial low-tidal-volume target of 6 mL/kg PBW is used in the ARDSNet strategy. Sources: `source.critical-respiratory-ventilation.alta2007`, `source.critical-respiratory-ventilation.ahrq2017`. Category management; certainty moderate; last checked 2026-11-11. Limitation: Historical protocol implementation, corroborated by current protective-range guidance; not a universal setting for every ventilation disorder.

- `claim.critical-respiratory-ventilation.pressure-reduction`: With ARDS volume already at 6 mL/kg PBW and plateau still above 30 cm H2O, the ARDSNet strategy reduces volume toward 5 then 4 mL/kg while reassessing gas exchange. Sources: `source.critical-respiratory-ventilation.alta2007`, `source.critical-respiratory-ventilation.ahrq2017`, `source.critical-respiratory-ventilation.aarc-pva2024`. Category management; certainty moderate; last checked 2026-11-11. Limitation: Constructed item excludes severe acidemia, patient effort and increased total PEEP; original Melissa hold remains. This is not authority for waiting for scale-weight loss.

- `claim.critical-respiratory-ventilation.prone`: After protective settings and PEEP are optimized, persistent PaO2/FiO2 below 150 mm Hg on PEEP at least 5 supports prolonged prone ventilation in intubated adult ARDS. Sources: `source.critical-respiratory-ventilation.esicm2023`. Category management; certainty high; last checked 2026-11-11. Limitation: Only one adequate independent guideline publication directly verified for exact eligibility; no fixed runtime wait or session duration taught. Contraindications still require clinician assessment.

- `claim.critical-respiratory-ventilation.recruitment`: Routine prolonged high-pressure recruitment is discouraged in adult ARDS because benefit is not established and harm is possible. Sources: `source.critical-respiratory-ventilation.esicm2023`. Category safety_boundary; certainty moderate; last checked 2026-11-11. Limitation: Does not prohibit every brief recruitment maneuver for a discrete derecruitment event.

- `claim.critical-respiratory-ventilation.plateau`: During passive ventilation, an end-inspiratory hold measures plateau pressure and helps separate a flow-dependent peak-pressure increase from persistent static pressure loading. Sources: `source.critical-respiratory-ventilation.aarc-pva2024`, `source.critical-respiratory-ventilation.gayen2024`. Category evaluation; certainty moderate; last checked 2026-11-11. Limitation: Acquisition requires minimal patient effort and no major leak; unchanged delivered volume, flow and measured total PEEP are necessary for matched inference.

- `claim.critical-respiratory-ventilation.suction`: Visible artificial-airway secretions and compatible breath sounds support suctioning; adult patients should be preoxygenated for the procedure. Sources: `source.critical-respiratory-ventilation.aarc-suction2022`. Category management; certainty moderate; last checked 2026-11-11. Limitation: Single directly verified society guideline; bronchoscopy remains appropriate for unresolved selected obstruction, not routine first secretion removal.

- `claim.critical-respiratory-ventilation.air-trapping`: In severe obstructive airflow limitation, incomplete exhalation can cause intrinsic PEEP; reducing respiratory rate can lengthen expiration and lessen trapping despite persistent hypercapnia. Sources: `source.critical-respiratory-ventilation.gayen2024`, `source.critical-respiratory-ventilation.aarc-pva2024`. Category management; certainty moderate; last checked 2026-11-11. Limitation: Review directly supports the rate action; assessment guideline independently supports checking auto-PEEP. No numeric rate, safe pH or external-PEEP prescription is generalized.

- `claim.critical-respiratory-ventilation.sbt-readiness`: SBT readiness assessment considers recovery, oxygenation, hemodynamics and spontaneous effort; an RSBI calculation is not required to authorize a trial. Sources: `source.critical-respiratory-ventilation.aarc-sbt2024`. Category evaluation; certainty moderate; last checked 2026-11-11. Limitation: One direct guideline; no universal safety-screen cutoff authored. An abnormal isolated index is not a reason to bypass the rest of assessment.

- `claim.critical-respiratory-ventilation.sbt-oxygen`: Increasing FiO2 during an SBT can conceal an oxygenation limitation, so the trial should generally retain its baseline oxygen concentration. Sources: `source.critical-respiratory-ventilation.aarc-sbt2024`. Category evaluation; certainty low; last checked 2026-11-11. Limitation: Conditional very-low-certainty recommendation based on indirect evidence; repeat unchanged-support trial is a context-bound author application, not a universal extubation algorithm.

- `claim.critical-respiratory-ventilation.airway-clearance`: Tolerating an SBT does not establish readiness for extubation when weak cough and abundant secretions impair airway clearance. Sources: `source.critical-respiratory-ventilation.aarc-sbt2024`. Category safety_boundary; certainty moderate; last checked 2026-11-11. Limitation: Single guideline introduction directly states this boundary; no invented suction-frequency or cough-flow cutoff.

- `claim.critical-respiratory-ventilation.niv-copd`: Bilevel NIV is recommended for acute or acute-on-chronic respiratory acidosis from a COPD exacerbation in a patient not requiring immediate intubation. Sources: `source.critical-respiratory-ventilation.ers-ats-niv2017`. Category management; certainty high; last checked 2026-11-11. Limitation: Direct pH at or below 7.35, elevated PaCO2 and persistent tachypnea support the constructed record; not extrapolated to every hypoxemic process.

- `claim.critical-respiratory-ventilation.niv-failure`: Immediate clinical deterioration during an NIV trial requires prompt reassessment for invasive ventilation rather than extending the mask trial to normalize saturation. Sources: `source.critical-respiratory-ventilation.ers-ats-niv2017`. Category safety_boundary; certainty moderate; last checked 2026-11-11. Limitation: Single joint guideline; key case has worsening consciousness, effort and acidemia together, not a universal pH-alone intubation threshold.

- `claim.critical-respiratory-ventilation.niv-prevention`: Preventive NIV immediately after planned extubation can benefit selected high-risk adults, including patients with chronic respiratory disease and hypercapnia. Sources: `source.critical-respiratory-ventilation.ers-ats-niv2017`, `source.critical-respiratory-ventilation.aarc-sbt2024`. Category management; certainty low; last checked 2026-11-11. Limitation: Conditional evidence; not a mandate for all extubations or proof of superiority to every modern HFNC/NIV combination. Options deliberately do not rank NIV against an equally supported high-risk HFNC regimen.

- `claim.critical-respiratory-ventilation.niv-rescue`: NIV should generally not delay reintubation for established post-extubation respiratory failure in the general non-COPD, non-postoperative population. Sources: `source.critical-respiratory-ventilation.ers-ats-niv2017`. Category management; certainty low; last checked 2026-11-11. Limitation: Conditional low-certainty guidance; COPD and postoperative populations are exceptions to generalization. Case uses medical pneumonia and worsening fatigue.

- `claim.critical-respiratory-ventilation.saturation`: An ordinary pulse oximeter estimates a saturation percentage; it does not measure blood hemoglobin concentration. Sources: `source.critical-respiratory-ventilation.fda2025`. Category definition; certainty high; last checked 2026-11-11. Limitation: Device inaccuracies persist; a good signal does not independently validate adequate oxygen delivery.

- `claim.critical-respiratory-ventilation.content`: Hemoglobin concentration determines available oxygen carriage, so a substantial fall can reduce oxygen content despite preserved measured arterial oxygenation. Sources: `source.critical-respiratory-ventilation.nhlbi2025`, `source.critical-respiratory-ventilation.fda2025`. Category definition; certainty moderate; last checked 2026-11-11. Limitation: Qualitative inference from carriage and saturation facts; no numeric oxygen-content equation, tissue-delivery guarantee or demographic correction.

- `claim.critical-respiratory-ventilation.transfusion`: For most stable hospitalized adults, a restrictive strategy considers red-cell transfusion below hemoglobin 7 g/dL in the clinical context. Sources: `source.critical-respiratory-ventilation.aabb2024`. Category management; certainty moderate; last checked 2026-11-11. Limitation: AABB official summary is sole direct publication read for the exact threshold. Not a requirement to transfuse every low result, an outpatient-clinic transfusion rule, or a cardiac/orthopedic/ACS/major-hemorrhage protocol.

- `claim.critical-respiratory-ventilation.delivery-flow`: Oxygen delivery depends on blood flow and arterial oxygen content; a lower mixed-venous saturation despite improved arterial carriage and unchanged oxygen consumption warrants assessment of flow, not an assumption that normal SpO2 establishes adequate delivery. Sources: `source.critical-respiratory-ventilation.russell2020`, `source.critical-respiratory-ventilation.nhlbi2025`, `source.critical-respiratory-ventilation.fda2025`. Category evaluation; certainty moderate; last checked 2026-11-11. Limitation: Physiologic author inference, not a diagnosis of cardiogenic shock or an instruction to give fluids/inotropes. No universal venous-saturation target asserted.

- `claim.critical-respiratory-ventilation.echo-flow`: Doppler echocardiography can assess stroke volume and cardiac output and can help characterize cardiac contributions to inadequate oxygen delivery. Sources: `source.critical-respiratory-ventilation.russell2020`. Category evaluation; certainty low; last checked 2026-11-11. Limitation: One adequate open review; does not establish every low venous-saturation result requires echocardiography before urgent clinical stabilization.

Access/rights exclusions:

- **UpToDate, AccessSurgery, commercial banks, proprietary textbooks/SCORE and recalled ABSITE:** Not accessed or used; prohibited corpus.
- **PMC mirrors of ARDS, SBT and oxygen-delivery articles:** Browser challenge on attempted full-page opens; official society/publisher alternatives used. No challenge bypass. Public indexing/license metadata was not treated as a content-use licence.
- **Demoule et al. 2020 obstructive ventilation review, Springer DOI 10.1007/s00134-020-06291-0; Stather and Stewart 2005 DOI 10.1186/cc3733:** Publisher pages presented subscription previews. Excluded as supporting evidence; no paywalled snippets used. Open Gayen et al. review used instead.
- **KSCCM liberation guideline DOI 10.4266/acc.2024.00052:** Official article endpoint returned 403; not used as independent corroboration.
- **ATS 2024 ARDS update DOI 10.1164/rccm.202311-2011ST:** PMC challenge and legacy PDF redirected to journal landing page. No new drug, NMBA, steroid or individualized PEEP key drawn from inaccessible full text.
- **AABB 2023 primary guideline DOI 10.1001/jama.2023.12914:** Bibliographic metadata retained; exact stable-adult threshold read in AABB official 2024 implementation summary. No JAMA snippet used as evidence.

- **Springer ESICM guideline:** Article-specific CC BY-NC licence and linked terms inspected. Use limited to targeted factual verification and citation; no expression adapted for commercial reuse.
- **MDPI open reviews:** Article-specific CC BY 4.0 verified. Credit authors and link licence; new statements and synthetic records are independently authored, with no copied figures or examples.
- **AARC public society guidelines:** Copyright reserved. Targeted fact verification permitted by assignment. Public guideline and privacy page inspected; terms endpoint unavailable, so no blanket reuse permission asserted.
- **Government-hosted information:** Text-only factual use with agency citation. Agency logos, contractor artwork and third-party items excluded; incomplete policy retrieval recorded rather than claiming universal public domain.

- Management recommendations with one adequate directly read publication are explicitly marked in the atomic claim; multiple mirrors/IDs for the same guideline are one publication.
- The most recent easily retrieved domain guidelines were 2023 ESICM and 2024 AARC; targeted search is not a systematic review or certification of every 2026 update.
- Research relevance is an editorial judgment, not a validated examination-weight estimate.
- Exact original reviewer decisions and prior claim access dates remain historical; fresh claim records have their own current check date.
- No clinical facts are retrieved from the network during gameplay. No source text/excerpts or protected figures are stored.

## Timing, orders, links and integration

All 11 testing choices, including distractors, have exact choice-ID/label mappings to existing placeholder profiles. No fixed wait is authored in prose. Historical investigations are reviewed, not executed: serviceRequest and resultGateAfter stay null, and no new service/capability is required. The source links specify target `_blank`, rel `noopener noreferrer`, and referrerPolicy `no-referrer`.

| Question | Choice | Existing placeholder profile |
|---|---|---|
| `question.topic.critical-respiratory-ventilation.pressure-assessment.v1` | Measure an end-inspiratory occlusion pressure | `timing.test.physiology` |
| `question.topic.critical-respiratory-ventilation.pressure-assessment.v1` | Perform flexible bronchoscopic airway examination | `timing.test.clinical_procedure` |
| `question.topic.critical-respiratory-ventilation.pressure-assessment.v1` | Perform thoracic pleural ultrasound examination | `timing.test.ultrasound` |
| `question.topic.critical-respiratory-ventilation.sbt-readiness.v1` | Perform a minimal-support spontaneous breathing trial | `timing.test.physiology` |
| `question.topic.critical-respiratory-ventilation.sbt-readiness.v1` | Repeat the rapid shallow breathing index assessment | `timing.test.physiology` |
| `question.topic.critical-respiratory-ventilation.sbt-readiness.v1` | Perform a stepwise SIMV rate-reduction trial | `timing.test.physiology` |
| `question.topic.critical-respiratory-ventilation.sbt-fio2.v1` | Repeat the trial at the preceding FiO2 | `timing.test.physiology` |
| `question.topic.critical-respiratory-ventilation.sbt-fio2.v1` | Repeat the trial with added pressure support | `timing.test.physiology` |
| `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` | Obtain transthoracic Doppler echocardiography | `timing.test.ultrasound` |
| `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` | Repeat the complete blood count | `timing.test.basic_labs` |
| `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1` | Repeat the arterial blood gas | `timing.test.basic_labs` |

- Manager chooses exact replacements/retirements and updates fresh-supply manifest only after independent review and acceptance; worker changes no shared file.
- Import this sidecar explicitly. Append accepted concepts, cases and exact timing classifications; preserve old definitions, frozen cases and all histories.
- All seven cases parse as the existing clinic setting at release.l0.clinic_evaluation; no ICU, ED, trauma bay or new facility architecture is required.
- Testing metadata is a presentation-only placeholder proposal. Historical tests are reviewed in the clinic and no new service or result order executes.
- Four paired/multi-decision cases retain existing all-concepts-unseen-or-due eligibility; report paired-only availability and do not change the selector.
- The delivery-flow node overlaps shock/hemodynamic evaluation secondarily; manager checks collision with the shock lane. No fluid, pressor, inotrope or primary shock objective authored.
- N1 iron-study meaning is not silently merged into respiratory content. Manager may retain it in a hematology lane while reviewing the proposed retirement.

Each multi-decision case remains subject to existing all-concepts-unseen-or-due eligibility. Its companion can block a new node’s fresh supply. None is silently advertised as independent standalone coverage; selector/FSRS behavior is unchanged. CurrentUpdate fields reveal only that stage’s new outside-record observations. Earlier explanations do not teach the later keyed action; complete prior feedback is included in each visible-context hash.

## Owner approvals needed

Melissa Rowland remains the named sign-off for every exact new clinical version. The following are specific unresolved clinical questions, not ordinary implementation permissions.

- `review.n3.ards-weight-change-versus-tidal-volume-basis.v2` — `question.topic.critical-respiratory-ventilation.ards-pressure-limit.v1`. Competing actions: Reduce 300 mL to 250 mL with repeat mechanics/gas assessment; Maintain 300 mL while waiting for diuresis. Boundary: CARRY FORWARD. New sources directly support a lower-volume proposal, but do not constitute Melissa’s resolution. Original exact version and new successor remain on hold.. **For this exact 50-kg-PBW record already at 6 mL/kg, passive plateau 32 and pH 7.36, approve or reject the next order of 250 mL rather than maintaining 300 mL pending fluid loss?**

- `owner.critical-respiratory-ventilation.delivery-flow-ranking` — `question.topic.critical-respiratory-ventilation.delivery-flow-assessment.v1`. Competing actions: Transthoracic Doppler echocardiography; Repeat arterial gas; Repeat CBC. Boundary: The delivery inference is physiologically supported; exact priority of Doppler assessment has one open review and depends on validated sample/consumption conditions. No specific shock diagnosis or resuscitation drug is supplied.. **Does this verified paired arterial/pulmonary-artery record with unchanged consumption justify prioritizing Doppler output/function assessment over repeat carriage measurements, or should the task be revised?**

- `owner.critical-respiratory-ventilation.conditional-support` — `question.topic.critical-respiratory-ventilation.sbt-fio2.v1`, `question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1`, `question.topic.critical-respiratory-ventilation.postextubation-rescue.v1`. Competing actions: Repeat unchanged-FiO2 SBT versus extubation after a higher-FiO2 trial; Immediate preventive bilevel support versus standard oxygen; Reintubation versus rescue NIV in the non-COPD medical record. Boundary: Conditional guidance; SBT oxygen recommendation is very low certainty, post-extubation NIV guidance is population-specific and low certainty.. **Confirm the exact support-stage boundaries and key/distractor rankings in these three records; do not generalize the rescue case to postoperative or COPD failure.**

## Decision log

- Retrospective clinic chart reviews use the existing clinic setting and no new capability. Explicit owner direction 2026-11-11; no architecture approval pending.
- One stable PBW meaning; four successor meanings and nine new gap concepts. Prescription indexing is unchanged; pressure-response, rescue, pressure acquisition and flow assessment materially change their prior scored objectives.
- Fifteen low-value/redundant versions proposed for retirement, never deleted. Complete before definitions, approval/hold references and histories retained; manager decides supply changes.
- Replaced the prone draft’s routine-recruitment distractor during the manual gate. It lacked a credible correct-under counterfactual; continued supine protection supplies a real response-dependent competing plan.
- Keep the existing ARDS owner hold and add exact conditional-guidance/key-ranking questions. Research and tests do not substitute for Melissa’s clinical sign-off.

## Validation

Final focused-only outcomes (from packages/clinical-content):

```text
npm.cmd test -- --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts
Exit code: 0
> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  12:28:20
   Duration  495ms (transform 218ms, setup 0ms, import 325ms, tests 67ms, environment 0ms)
```

```text
npm.cmd run typecheck
Exit code: 1
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-trauma-thoracic-20261111.ts(137,9): error TS2339: Property 'id' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(137,28): error TS2339: Property 'displayName' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(137,62): error TS2339: Property 'learningObjective' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(138,18): error TS2339: Property 'conceptType' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(138,56): error TS2339: Property 'earliestFacilityStage' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(174,18): error TS2339: Property 'counts' does not exist on type '{ schemaVersion: number; topicSlug: string; contentVersion: string; reviewStatus: string; aiAssistedDrafting: boolean; lastClinicianReview: null; assignment: { topicSlug: string; title: string; ... 16 more ...; release: { ...; }; }; ... 14 more ...; validation: never[]; }'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

```text
node -e "const fs=require('fs');for(const f of ['docs/research/question-topic-critical-respiratory-ventilation-20261111.json','docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json']){JSON.parse(fs.readFileSync(f,'utf8'));console.log('JSON.parse PASS '+f)}"
(scoped git status also printed below)
Exit code: 0
JSON.parse PASS docs/research/question-topic-critical-respiratory-ventilation-20261111.json
JSON.parse PASS docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json
?? docs/research/question-topic-critical-respiratory-ventilation-20261111.json
?? docs/research/question-topic-critical-respiratory-ventilation-20261111.md
?? docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json
?? packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.test.ts
?? packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.ts
```

Latest package typecheck is not green. All six diagnostics name the concurrent out-of-lane trauma-thoracic file; no respiratory file diagnostic is reported. A preceding complete package run passed. The worker left concurrent files untouched; manager reruns after those writes settle.

Earlier development failures, repaired within this lane:

- `npm.cmd test -- --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts`, exit 1: Expected a semicolon / TS1434 at owned test line 30. No tests ran. Repair: Moved the TypeScript assertion onto the expression line.
- `npm.cmd test -- --pool=threads src/question-topic-critical-respiratory-ventilation-20261111.test.ts`, exit 1: ZodError: Only the final scored node may define terminal outcomes. decisionNodes[0/1].terminalDispositions. Repair: Earlier nodes now have empty terminal dispositions; only the final node in each case carries no-terminal-outcome feedback.
- `npm.cmd run typecheck`, exit 1: src/question-topic-critical-respiratory-ventilation-20261111.test.ts(30,7): TS1434. Concurrent out-of-lane src/question-topic-vascular-aorta-20261111.ts(483,1): TS1005: ] expected. Repair: Owned syntax repaired. Other topic left untouched; subsequent full package typecheck passed.

Assembled-release advisory lint, browser playtesting and broad integration were not run in this focused-only assignment. Tests validate structure and identity, not clinical correctness.

## Final bounded handoff

```text
Topic critical-respiratory-ventilation
Files changed
  packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.ts
  packages/clinical-content/src/question-topic-critical-respiratory-ventilation-20261111.test.ts
  docs/research/question-topic-critical-respiratory-ventilation-20261111.json
  docs/research/question-topic-critical-respiratory-ventilation-20261111.md
  docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json
Inventory Program captured 2026-11-11T15:28:05.732Z; default manifest v9, 145 rows; 1151 cases/1462 nodes/610 registered concepts. Assigned source hashes unchanged.
Counts audited 20, kept 0, rewritten 5, retired-and-replaced proposed 15, new 9
Count basis 20 exact assigned variants and case/node rows, covering 25 property-order serializations and 20 semantically distinct visible contexts. 5 rewrite drafts + 9 new gap drafts = 14 proposed questions; 1 reused stable concept, 4 successor meanings, 9 genuinely new gap meanings.
Held/unkeyed 0 assigned unkeyed slots; owner hold review.n3.ards-weight-change-versus-tidal-volume-basis.v2 and editorial park review.n2.ventilator-elastic-versus-resistive-load.v3 preserved.
Research 14 ranked practical decisions; 12 permitted-source records, 22 atomic claims. Exact one-publication/conditional support limits and excluded sources retained.
Packet docs/research/question-topic-critical-respiratory-ventilation-20261111.json; docs/research/question-topic-critical-respiratory-ventilation-20261111.md; docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json
Identity preservation PBW rule retains concept.ards.predicted-body-weight-ventilation. All other changed meanings have separate IDs and previous-ID mappings. No historical definitions or histories altered; no exact assigned PASS/approval inherited.
Owner approvals needed persistent-plateau 250-mL order; exact delivery-flow investigation ranking; conditional SBT/preventive-NIV/rescue-NIV boundaries; all exact clinical drafts require Melissa.
Integration existing clinic settings and explicit import; presentation-only timing, no executable services; paired eligibility and shock/hematology companion checks remain manager-owned.
Validation focused test exit 0: 1 file, 8 passed/0 failed, 495 ms. Both JSON.parse checks exit 0. Package typecheck latest exit 1, only concurrent trauma-thoracic TS2339 at lines 137/138/174; prior package run exit 0. Exact output above and in JSON.
Open work Manager: review actual diff, obtain independent challenge, resolve exact clinical questions, rerun package typecheck after concurrent work settles, and decide acceptance/retirement/integration. Local checkpoint not pushed.
```

The packet provides 14 difficult-decision drafts in seven clinic chart reviews, with all 20 assigned variants audited and their histories preserved. It remains a local unapproved authoring checkpoint; no release or GitHub backup was created. The manager owns the checkpoint reminder and may arrange backup after the owner says **push to GitHub**.

</details>

</details>
