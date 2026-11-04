import fs from "node:fs";
export const entry=JSON.parse(fs.readFileSync("tools/question-quality/fixtures/adversarial-r4-before-20261102.json","utf8"));
export const noTest={kind:"no_test"};
export const test=id=>({kind:"test",timingProfileId:"timing.test."+id});

/** Current original synthetic authoring worksheet, without superseded override blocks. */
export const specs=new Map([
  [
    "A25-context",
    {
      "update": "During induction, the patient develops repeated generalized convulsions without regaining awareness between them. Intravenous midazolam stops the convulsions and the procedure is abandoned. Assisted ventilation is now maintaining oxygenation while the capnography trace remains infrequent and spontaneous chest movements are shallow.",
      "task": "Which reversal instruction should guide {patientName}'s care while assisted ventilation continues?",
      "options": [
        [
          "Withhold flumazenil",
          "Midazolam was used to control a potentially life-threatening seizure state; antagonizing it is contraindicated even though respiratory support is needed."
        ],
        [
          "Administer flumazenil now",
          "Respiratory depression does not remove the contraindication when the benzodiazepine was required for seizure control."
        ],
        [
          "Administer flumazenil after another antiseizure drug",
          "An additional antiseizure drug does not make the stated benzodiazepine-antagonist contraindication disappear."
        ]
      ],
      "explanation": "The reason a benzodiazepine was administered changes whether its antagonist is appropriate. Repeated convulsions without recovery of awareness required seizure control; flumazenil is contraindicated when benzodiazepines are used to control a potentially life-threatening condition such as status epilepticus. Maintain supported ventilation and specialist seizure/anesthesia care. Boosted exposure increases the temptation to reverse sedation, but does not override this boundary.",
      "claims": [
        "claim.qq20261102c.flumazenil-seizure-control-contraindication",
        "claim.qq20261102c.midazolam-route-and-monitoring"
      ],
      "steps": [
        "Recognize that the benzodiazepine was treating ongoing seizure activity, rather than merely producing procedural sedation.",
        "Apply the antagonist contraindication despite the competing need to manage prolonged respiratory depression."
      ],
      "closest": "Automatically give flumazenil for midazolam-associated respiratory depression without noticing why the benzodiazepine was required.",
      "decisive": "Midazolam stopped repeated generalized seizures without intervening recovery; airway support is already in progress.",
      "attack": "All choices retain the same airway/seizure-support plan; none repeats sedative during overt respiratory deterioration. The passed preceding ART/route explanation does not answer the new seizure-control antagonist decision. No safety qualifier in the task supplies the key.",
      "risk": "Melissa/anesthesia must confirm the seizure-course interpretation and antidote boundary. No seizure-duration threshold, antidote dose, prophylactic antiseizure regimen or monitoring duration is invented.",
      "change": "Retain overt respiratory findings and support in every choice, but replace the independent ART/rescue axes with an antagonist decision changed by the actual indication for midazolam.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply benzodiazepine-antagonist contraindication after seizure control",
        "objective": "Use the actual indication for perioperative midazolam to choose a reversal plan when supported respiratory depression competes with preservation of treatment for a potentially life-threatening seizure state.",
        "reason": "This deliberately changes the scored objective from booster/route recognition to an antagonist contraindication application; the original interaction concept and all prior variants remain available for frozen learning histories."
      },
      "actions": [
        "Keep the overt respiratory-depression signs; every option continues assisted ventilation.",
        "The original same-route prevention draft was discarded because the preceding passed item already supplies that answer.",
        "Use the reviewer's supportive-care/next-action alternative with raw seizure-course data, an explicit new concept version and the FDA contraindication claim.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B01-context",
    {
      "update": "The outside pressure-study record shows the catheter tip remaining above the diaphragm throughout. The technician stopped after repeated retching during blind advancement. No endoscopically assisted placement was attempted. The recorded channels show simultaneous pressurization during swallowing.",
      "task": "Which plan should resolve {patientName}'s pressure-study findings?",
      "options": [
        [
          "Manometry with endoscopic catheter placement",
          "Without gastric/junction recordings the tracing cannot establish relaxation or subtype; assisted completion is available before abandoning manometry."
        ],
        [
          "Obtain junction distensibility measurements with endoscopic FLIP",
          "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here."
        ],
        [
          "Obtain a timed barium esophagram with a tablet",
          "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements."
        ]
      ],
      "steps": [
        "Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification.",
        "Select assisted completion rather than treating an uninterpretable study."
      ],
      "closest": "Treat the simultaneous pressurization as a diagnostic tracing and proceed to sphincter treatment.",
      "decisive": "There are no gastric channels and only blind placement has failed.",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.upper_endoscopy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.radiography"
        }
      ],
      "services": [
        "service.esophageal_manometry",
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "explanation": "Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification. Select assisted completion rather than treating an uninterpretable study. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
        "objective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
        "reason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
      },
      "attack": "An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia.",
      "risk": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
      "change": "Replace repeated first-test recall with a protocol/technical-adequacy application. Preserve the passed later tracing and shared patient presentation.",
      "actions": [
        "There are no gastric channels and only blind placement has failed.",
        "The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration.",
        "The shared presentation is frozen because the later main item passed; new acquisition history is in Current update.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B02-context",
    {
      "update": "The outside report labels absent peristalsis. Its saved record contains three water swallows: each begins while the preceding swallow's contraction is still developing. The remaining attempts are marked retching. The catheter crosses the junction; no spaced-swallow series or alternate-position series is saved.",
      "task": "Which next plan best fits {patientName}'s outside assessment?",
      "options": [
        [
          "Repeat a complete high-resolution manometry study",
          "Overlapping swallows and an incomplete series do not establish the classification; a technically adequate protocol is required."
        ],
        [
          "Plan sphincter-directed treatment for achalasia",
          "Deglutitive inhibition during overlapping swallows cannot substitute for a valid primary-position series."
        ],
        [
          "Plan supportive treatment for absent contractility",
          "Absent propagation in this incomplete protocol does not establish absent contractility."
        ]
      ],
      "steps": [
        "Separate swallow-protocol failure from a true absence of peristalsis.",
        "Complete a valid position-specific protocol before selecting disease-specific therapy."
      ],
      "closest": "Accept the outside absent-peristalsis label and treat on that basis.",
      "decisive": "The saved swallows overlap and the protocol was not completed, despite catheter passage.",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
        }
      ],
      "services": [
        "service.esophageal_manometry",
        null,
        "service.ambulatory_reflux_monitoring"
      ],
      "claims": [
        "claim.qq20261102c.hrm-protocol-and-provocation"
      ],
      "explanation": "Separate swallow-protocol failure from a true absence of peristalsis. Complete a valid position-specific protocol before selecting disease-specific therapy. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
        "objective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
        "reason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
      },
      "attack": "An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia.",
      "risk": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
      "change": "Replace repeated first-test recall with a protocol/technical-adequacy application. Preserve the passed later tracing and shared patient presentation.",
      "actions": [
        "The saved swallows overlap and the protocol was not completed, despite catheter passage.",
        "The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration.",
        "The shared presentation is frozen because the later main item passed; new acquisition history is in Current update.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B03-context",
    {
      "update": "Water-swallow manometry shows normal junction relaxation and propagated contractions. The symptom diary records food sticking during bread and meat meals; none of the water swallows reproduces it. Endoscopy and mucosal biopsies show no structural or eosinophilic explanation. The study has no meal or provocative-swallow recording.",
      "task": "Which investigation plan should be arranged for {patientName}'s persistent dysphagia?",
      "options": [
        [
          "High-resolution manometry with a test meal",
          "Supplementary maneuvers can reveal obstructive physiology missed by routine water swallows and relate it to the actual symptom."
        ],
        [
          "High-resolution manometry with another water-swallow series",
          "Repeating the same unrevealing protocol does not address the missing symptom challenge."
        ],
        [
          "Ambulatory pH-impedance monitoring",
          "Acid monitoring cannot replace an assessment of swallowing physiology when the unresolved symptom is bolus obstruction."
        ]
      ],
      "steps": [
        "Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol.",
        "Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol."
      ],
      "closest": "Repeat routine manometry because it is the standard test, without changing the protocol.",
      "decisive": "Adequate routine water swallows did not reproduce the actual meal symptom; structural/mucosal evaluation is recorded.",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
        }
      ],
      "services": [
        "service.esophageal_manometry",
        null,
        "service.ambulatory_reflux_monitoring"
      ],
      "claims": [
        "claim.qq20261102c.hrm-protocol-and-provocation"
      ],
      "explanation": "Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol. Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
        "objective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
        "reason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
      },
      "attack": "An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia.",
      "risk": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
      "change": "Replace repeated first-test recall with a protocol/technical-adequacy application. Preserve the passed later tracing and shared patient presentation.",
      "actions": [
        "Adequate routine water swallows did not reproduce the actual meal symptom; structural/mucosal evaluation is recorded.",
        "The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration.",
        "The shared presentation is frozen because the later main item passed; new acquisition history is in Current update.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B04-context",
    {
      "update": "The exported outside manometry plots have no gastric baseline channel. During the test the entire catheter moves upward with retching; the report nevertheless gives a junction relaxation value and recommends dilation.",
      "task": "How should {patientName}'s next physiologic assessment be arranged?",
      "options": [
        [
          "Manometry with endoscopic catheter placement",
          "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible."
        ],
        [
          "Obtain junction distensibility measurements with endoscopic FLIP",
          "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here."
        ],
        [
          "Obtain a timed barium esophagram with a tablet",
          "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements."
        ]
      ],
      "steps": [
        "Check how the reported number was obtained rather than accepting the report label.",
        "Repeat an interpretable assessment before an irreversible intervention."
      ],
      "closest": "Treat a precise-looking reported relaxation value as valid despite the missing reference.",
      "decisive": "Displacement and absence of a gastric reference are documented; the exported value does not establish junction relaxation.",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.upper_endoscopy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.radiography"
        }
      ],
      "services": [
        "service.esophageal_manometry",
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
        "objective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
        "reason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
      },
      "attack": "An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia.",
      "risk": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
      "change": "Replace repeated first-test recall with a protocol/technical-adequacy application. Preserve the passed later tracing and shared patient presentation.",
      "actions": [
        "Displacement and absence of a gastric reference are documented; the exported value does not establish junction relaxation.",
        "The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration.",
        "The shared presentation is frozen because the later main item passed; new acquisition history is in Current update.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B03",
    {
      "update": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. The prescribing team can supervise a medication adjustment, and the patient can maintain oral intake during reassessment.",
      "task": "Which interpretation and next plan best fit {patientName}'s record?",
      "options": [
        [
          "Achalasia-like spastic pattern; reassess after coordinated opioid withdrawal",
          "Recognizes the pattern and the potentially reversible medication-associated contribution before committing to irreversible therapy."
        ],
        [
          "Achalasia-like spastic pattern; proceed to myotomy planning while continuing the opioid",
          "Recognizes the tracing but treats it as sufficient proof of a primary irreversible disorder despite a relevant drug exposure."
        ],
        [
          "Distal-spasm pattern; coordinate opioid withdrawal and reassessment before myotomy planning",
          "Notices the medication issue but ignores the abnormal junction relaxation when classifying the tracing."
        ],
        [
          "Distal-spasm pattern; proceed to myotomy planning while continuing the opioid",
          "Combines an incorrect relaxation-pattern classification with premature invasive treatment planning during the relevant exposure."
        ]
      ],
      "explanation": "The failed/premature body activity with impaired junction relaxation is an achalasia-like spastic pattern. Opioids can produce this phenotype; Chicago v4 advises studying off opioids when possible. Coordinate a clinically appropriate withdrawal/reassessment plan before treating this as established primary disease requiring myotomy. No abrupt cessation or fixed washout is prescribed.",
      "steps": [
        "Identify the spastic outflow pattern in the report.",
        "Notice the opioid exposure and feasible coordinated reassessment before irreversible treatment."
      ],
      "closest": "Treat the spastic achalasia-like pattern immediately without considering opioid exposure.",
      "decisive": "Oxycodone exposure is documented and supervised adjustment is feasible; there is no need for abrupt cessation.",
      "attack": "Delete the sentence announcing the unperformed off-medication study. Medication reconciliation remains an ordinary case fact; feasibility is given without a rationale sentence.",
      "risk": "The supervising prescriber and clinician must verify safe adjustment; no abrupt withdrawal, washout or reversibility guarantee.",
      "claims": [
        "claim.qq20261102b.opioid-spastic-pattern"
      ],
      "change": "Remove the preview of the keyed next action; add only feasibility of coordinated medication adjustment.",
      "actions": [
        "Delete the explicit absent-off-opioid-assessment sentence.",
        "Retain concrete oxycodone exposure; state feasible supervised adjustment and maintained intake."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B05",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache. A separate superficial swelling is seen after lifting. The office cough examination does not reproduce it.",
      "update": "The outside ultrasound was obtained supine at rest with the probe over the painful hip-flexor origin. The saved images do not include coughing or straining. The report describes no groin protrusion.",
      "task": "Which interpretation and next plan best fit {patientName}'s outside assessment?",
      "options": [
        [
          "Hernia unresolved; dynamic groin ultrasound",
          "The outside acquisition did not assess the reported intermittent groin event. It cannot exclude a hernia; a properly targeted dynamic study is an appropriate completion plan."
        ],
        [
          "Hernia excluded; hip-directed rehabilitation",
          "The hip findings can explain part of the pain, but do not make the mistargeted or resting negative study an exclusion of the photographed swelling."
        ],
        [
          "Hernia established; elective inguinal repair planning",
          "The photographed swelling and limited outside study do not establish the anatomic diagnosis needed to commit to a repair pathway."
        ]
      ],
      "services": [
        "service.ultrasound",
        null,
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "gate": {
        "service": "service.ultrasound",
        "routes": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ],
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "result": "With standing and straining, ultrasound shows an inguinal protrusion that withdraws at rest. Pressure over that protrusion reproduces the superficial pain reported during lifting. Hip rotation reproduces a separate deep ache."
      },
      "claims": [
        "claim.qq20261102c.groin-imaging-after-negative-study",
        "claim.qq20261102c.groin-inadequate-study-certainty"
      ],
      "steps": [
        "Distinguish a resting scan of a different target from an adequate occult-hernia assessment.",
        "Obtain a technically appropriate dynamic study before escalating or assigning all symptoms to the hip."
      ],
      "closest": "Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process.",
      "decisive": "The imaged site and lack of provocation did not test the reported intermittent swelling.",
      "explanation": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question.",
      "attack": "All three choices pair a diagnostic-certainty conclusion with its care consequence. The negative outside report and competing hip findings tempt false exclusion; the photograph tempts premature confirmation. Dynamic MRI is not offered as incorrectly inferior to repeat ultrasound.",
      "risk": "Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound.",
      "change": "Apply the actual outside study's limitations to diagnostic certainty and the next care plan, rather than asserting an unsupported ultrasound-versus-MRI hierarchy.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve occult-groin imaging and symptom discordance",
        "objective": "Choose an adequate targeted repeat study or dynamic cross-sectional assessment by interpreting prior scan localization, provocation, symptom reproduction and competing musculoskeletal findings.",
        "reason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
      },
      "actions": [
        "The imaged site and lack of provocation did not test the reported intermittent swelling.",
        "The task and objective are changed rather than defending an onboarding exception.",
        "The paired follow-up uses the actual result of this selected imaging pathway.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Remove dynamic MRI as a wrong alternative: the guideline permits it after nondiagnostic ultrasound. Test false exclusion versus premature confirmation with three parallel certainty-and-plan choices."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B05-context",
    {
      "update": "With standing and straining, ultrasound shows an inguinal protrusion that withdraws at rest. Pressure over that protrusion reproduces the superficial pain reported during lifting. Hip rotation reproduces a separate deep ache.",
      "task": "Which management discussion should follow {patientName}'s returned imaging and examination findings?",
      "options": [
        [
          "Discuss hernia repair and hip-pain assessment",
          "Treat the two pain patterns separately: repair consultation addresses the reproducible hernia-related component without promising to cure the deep musculoskeletal ache."
        ],
        [
          "Trial hip rehabilitation with hernia observation",
          "The reproduced superficial pain over the demonstrated protrusion is not accounted for by hip findings alone."
        ],
        [
          "Discuss elective hernia repair without hip assessment",
          "A confirmed hernia does not establish that anatomically separate hip/adductor symptoms will resolve with repair."
        ]
      ],
      "claims": [
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "steps": [
        "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image.",
        "Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment."
      ],
      "closest": "Offer repair as a cure for both anatomically separate pains.",
      "decisive": "Pressure/strain over the actual protrusion reproduces one pain, while hip/adductor maneuvers reproduce a separate ache.",
      "explanation": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem.",
      "attack": "The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan.",
      "risk": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
      "change": "Replace identical repair-consultation answers with paired concordant versus discordant symptom-attribution decisions.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply symptom attribution to a demonstrated inguinal hernia",
        "objective": "Distinguish hernia-related from coexisting musculoskeletal pain and select a repair discussion or observation without assuming every positive image explains the patient's limitation.",
        "reason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
      },
      "actions": [
        "Replace the identical activity-interruption sentence with concrete location and maneuver correlations.",
        "Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion.",
        "Remove the rejected basic flag and version the changed objective.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B06",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain after running. Resisted adduction reproduces medial thigh pain. A phone photograph also records a transient groin contour change.",
      "update": "An experienced examiner obtained groin ultrasound supine and standing during repeated coughing and straining. The photographed contour change and focal groin symptoms occurred during scanning, but no canal protrusion was seen. The adductor attachment is tender on examination.",
      "task": "Which investigation plan should be arranged for {patientName}'s groin symptoms?",
      "options": [
        [
          "Dynamic pelvic MRI with groin strain views",
          "The next investigation addresses the actual unresolved protocol/localization question rather than relying on a report label."
        ],
        [
          "Repeat dynamic groin ultrasonography",
          "The stated acquisition history makes this apparently routine step premature or repetitive."
        ],
        [
          "Sports-medicine assessment with clinical reassessment",
          "The competing finding or presumed diagnosis does not resolve the documented imaging/symptom mismatch."
        ]
      ],
      "services": [
        "service.mri",
        "service.ultrasound",
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        },
        {
          "kind": "no_test"
        }
      ],
      "gate": {
        "service": "service.mri",
        "routes": [
          "route.mri.outsourced"
        ],
        "pendingLabel": "Dynamic groin MRI pending",
        "result": "Dynamic MRI shows a small inguinal protrusion during straining and signal change at the adductor attachment. At reassessment, the protrusion is not tender and straining does not reproduce the limiting pain; resisted adduction reproduces the usual medial thigh pain."
      },
      "claims": [
        "claim.qq20261102c.groin-imaging-after-negative-study"
      ],
      "steps": [
        "Recognize a genuinely adequate negative dynamic ultrasound rather than a missing-provocation problem.",
        "Use cross-sectional dynamic assessment to evaluate an occult hernia and a competing musculoskeletal cause before closing the workup."
      ],
      "closest": "Treat the adductor findings as the whole explanation after a negative scan.",
      "decisive": "The scan actually reproduced the event with a suitable protocol; persistent separate contour symptoms remain unexplained.",
      "explanation": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question.",
      "attack": "Siblings differ in actual adequacy and localization and have different keyed investigations. Posture is balanced across relevant imaging alternatives; no generic 'inconclusive' label supplies the decision.",
      "risk": "Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study.",
      "change": "Replace four first-ultrasound rules with protocol/site-specific decisions and two MRI completion pathways.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve occult-groin imaging and symptom discordance",
        "objective": "Choose an adequate targeted repeat study or dynamic cross-sectional assessment by interpreting prior scan localization, provocation, symptom reproduction and competing musculoskeletal findings.",
        "reason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
      },
      "actions": [
        "The scan actually reproduced the event with a suitable protocol; persistent separate contour symptoms remain unexplained.",
        "The task and objective are changed rather than defending an onboarding exception.",
        "The paired follow-up uses the actual result of this selected imaging pathway.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B06-context",
    {
      "update": "Dynamic MRI shows a small inguinal protrusion during straining and signal change at the adductor attachment. At reassessment, the protrusion is not tender and straining does not reproduce the limiting pain; resisted adduction reproduces the usual medial thigh pain.",
      "task": "Which explanation and initial plan best fit {patientName}'s limiting pain?",
      "options": [
        [
          "Muscle pain: treat and observe the hernia",
          "The limiting symptoms track the musculoskeletal provocation, while the reducible protrusion has no reproduced symptoms; do not promise pain relief from repair."
        ],
        [
          "Hernia pain: repair before muscle-attachment treatment",
          "Imaging confirmation alone does not establish symptom attribution or guarantee pain relief."
        ],
        [
          "Combined pain: repair with muscle-attachment treatment",
          "This treats the image label as an explanation for a discordant pain pattern."
        ]
      ],
      "claims": [
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "steps": [
        "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image.",
        "Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia."
      ],
      "closest": "Treat the positive hernia image as the cause of all limiting pain.",
      "decisive": "The protrusion is painless during provocation, while the limiting pain follows the muscle-attachment maneuver.",
      "explanation": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem.",
      "attack": "The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan.",
      "risk": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
      "change": "Replace identical repair-consultation answers with paired concordant versus discordant symptom-attribution decisions.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply symptom attribution to a demonstrated inguinal hernia",
        "objective": "Distinguish hernia-related from coexisting musculoskeletal pain and select a repair discussion or observation without assuming every positive image explains the patient's limitation.",
        "reason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
      },
      "actions": [
        "Replace the identical activity-interruption sentence with concrete location and maneuver correlations.",
        "Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion.",
        "Remove the rejected basic flag and version the changed objective.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B07",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle.",
      "update": "The outside ultrasound saved standing strain views, but the operator examined a site lateral to the photographed lump. The report's skin marker and the patient's photograph place the two sites on opposite sides of the inguinal crease.",
      "task": "Which interpretation and next plan best fit {patientName}'s outside assessment?",
      "options": [
        [
          "Hernia unresolved; dynamic groin ultrasound",
          "The outside acquisition did not assess the reported intermittent groin event. It cannot exclude a hernia; a properly targeted dynamic study is an appropriate completion plan."
        ],
        [
          "Hernia excluded; hip-directed rehabilitation",
          "The hip findings can explain part of the pain, but do not make the mistargeted or resting negative study an exclusion of the photographed swelling."
        ],
        [
          "Hernia established; elective inguinal repair planning",
          "The photographed swelling and limited outside study do not establish the anatomic diagnosis needed to commit to a repair pathway."
        ]
      ],
      "services": [
        "service.ultrasound",
        null,
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "gate": {
        "service": "service.ultrasound",
        "routes": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ],
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "result": "Targeted ultrasound now shows a reducible inguinal protrusion at the photographed site. Straining reproduces the familiar superficial pressure there. A different tender point at the adductor origin produces discomfort only with resisted hip adduction."
      },
      "claims": [
        "claim.qq20261102c.groin-imaging-after-negative-study",
        "claim.qq20261102c.groin-inadequate-study-certainty"
      ],
      "steps": [
        "Notice that a dynamic protocol can still miss the clinical target if localization is wrong.",
        "Reconcile the observed site and repeat targeted assessment instead of treating a negative report as exclusion."
      ],
      "closest": "Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process.",
      "decisive": "The saved site and the photographed event do not correspond.",
      "explanation": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question.",
      "attack": "All three choices pair a diagnostic-certainty conclusion with its care consequence. The negative outside report and competing hip findings tempt false exclusion; the photograph tempts premature confirmation. Dynamic MRI is not offered as incorrectly inferior to repeat ultrasound.",
      "risk": "Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound.",
      "change": "Apply the actual outside study's limitations to diagnostic certainty and the next care plan, rather than asserting an unsupported ultrasound-versus-MRI hierarchy.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve occult-groin imaging and symptom discordance",
        "objective": "Choose an adequate targeted repeat study or dynamic cross-sectional assessment by interpreting prior scan localization, provocation, symptom reproduction and competing musculoskeletal findings.",
        "reason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
      },
      "actions": [
        "The saved site and the photographed event do not correspond.",
        "The task and objective are changed rather than defending an onboarding exception.",
        "The paired follow-up uses the actual result of this selected imaging pathway.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Remove dynamic MRI as a wrong alternative: the guideline permits it after nondiagnostic ultrasound. Test false exclusion versus premature confirmation with three parallel certainty-and-plan choices."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B07-context",
    {
      "update": "Targeted ultrasound now shows a reducible inguinal protrusion at the photographed site. Straining reproduces the familiar superficial pressure there. A different tender point at the adductor origin produces discomfort only with resisted hip adduction.",
      "task": "Which management discussion should follow {patientName}'s returned imaging and examination findings?",
      "options": [
        [
          "Discuss hernia repair and hip-pain assessment",
          "Treat the two pain patterns separately: repair consultation addresses the reproducible hernia-related component without promising to cure the deep musculoskeletal ache."
        ],
        [
          "Trial hip rehabilitation with hernia observation",
          "The reproduced superficial pain over the demonstrated protrusion is not accounted for by hip findings alone."
        ],
        [
          "Discuss elective hernia repair without hip assessment",
          "A confirmed hernia does not establish that anatomically separate hip/adductor symptoms will resolve with repair."
        ]
      ],
      "claims": [
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "steps": [
        "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image.",
        "Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment."
      ],
      "closest": "Offer repair as a cure for both anatomically separate pains.",
      "decisive": "Pressure/strain over the actual protrusion reproduces one pain, while hip/adductor maneuvers reproduce a separate ache.",
      "explanation": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem.",
      "attack": "The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan.",
      "risk": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
      "change": "Replace identical repair-consultation answers with paired concordant versus discordant symptom-attribution decisions.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply symptom attribution to a demonstrated inguinal hernia",
        "objective": "Distinguish hernia-related from coexisting musculoskeletal pain and select a repair discussion or observation without assuming every positive image explains the patient's limitation.",
        "reason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
      },
      "actions": [
        "Replace the identical activity-interruption sentence with concrete location and maneuver correlations.",
        "Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion.",
        "Remove the rejected basic flag and version the changed objective.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B08",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with persistent groin pain during lifting. The pain is now reproduced near the lower abdominal attachment during resisted trunk flexion. The patient also reports a separate intermittent groin swelling.",
      "update": "Two independently reviewed dynamic groin ultrasound examinations include standing and supine strain views at the marked site. Neither shows a protrusion during the reported event. Hip and abdominal muscle maneuvers reproduce overlapping symptoms.",
      "task": "Which investigation plan should be arranged for {patientName}'s groin symptoms?",
      "options": [
        [
          "Dynamic MRI of the groin and pelvis",
          "The next investigation addresses the actual unresolved protocol/localization question rather than relying on a report label."
        ],
        [
          "Repeat dynamic groin ultrasonography",
          "The stated acquisition history makes this apparently routine step premature or repetitive."
        ],
        [
          "Diagnostic laparoscopic groin exploration",
          "The competing finding or presumed diagnosis does not resolve the documented imaging/symptom mismatch."
        ]
      ],
      "services": [
        "service.mri",
        "service.ultrasound",
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        },
        {
          "kind": "no_test"
        }
      ],
      "gate": {
        "service": "service.mri",
        "routes": [
          "route.mri.outsourced"
        ],
        "pendingLabel": "Dynamic groin MRI pending",
        "result": "Dynamic MRI shows a reducible inguinal protrusion and edema at the rectus-adductor attachment. The visible protrusion causes no discomfort with strain; resisted trunk flexion reproduces the limiting suprapubic pain."
      },
      "claims": [
        "claim.qq20261102c.groin-imaging-after-negative-study"
      ],
      "steps": [
        "Recognize persistent diagnostic uncertainty after adequate concordantly negative studies.",
        "Choose an investigation that evaluates both an occult defect and a competing muscle-attachment cause before surgery."
      ],
      "closest": "Proceed toward an operation because the history sounds typical despite repeated adequate negative imaging.",
      "decisive": "Dynamic imaging at the actual marked site has already been adequate; a competing attachment-related cause is reproducible.",
      "explanation": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question.",
      "attack": "Siblings differ in actual adequacy and localization and have different keyed investigations. Posture is balanced across relevant imaging alternatives; no generic 'inconclusive' label supplies the decision.",
      "risk": "Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study.",
      "change": "Replace four first-ultrasound rules with protocol/site-specific decisions and two MRI completion pathways.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve occult-groin imaging and symptom discordance",
        "objective": "Choose an adequate targeted repeat study or dynamic cross-sectional assessment by interpreting prior scan localization, provocation, symptom reproduction and competing musculoskeletal findings.",
        "reason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
      },
      "actions": [
        "Dynamic imaging at the actual marked site has already been adequate; a competing attachment-related cause is reproducible.",
        "The task and objective are changed rather than defending an onboarding exception.",
        "The paired follow-up uses the actual result of this selected imaging pathway.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B08-context",
    {
      "update": "Dynamic MRI shows a reducible inguinal protrusion and edema at the rectus-adductor attachment. The visible protrusion causes no discomfort with strain; resisted trunk flexion reproduces the limiting suprapubic pain.",
      "task": "Which explanation and initial plan best fit {patientName}'s limiting pain?",
      "options": [
        [
          "Muscle pain: treat and observe the hernia",
          "The limiting symptoms track the musculoskeletal provocation, while the reducible protrusion has no reproduced symptoms; do not promise pain relief from repair."
        ],
        [
          "Hernia pain: repair before muscle-attachment treatment",
          "Imaging confirmation alone does not establish symptom attribution or guarantee pain relief."
        ],
        [
          "Combined pain: repair with muscle-attachment treatment",
          "This treats the image label as an explanation for a discordant pain pattern."
        ]
      ],
      "claims": [
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "steps": [
        "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image.",
        "Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia."
      ],
      "closest": "Treat the positive hernia image as the cause of all limiting pain.",
      "decisive": "The protrusion is painless during provocation, while the limiting pain follows the muscle-attachment maneuver.",
      "explanation": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem.",
      "attack": "The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan.",
      "risk": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
      "change": "Replace identical repair-consultation answers with paired concordant versus discordant symptom-attribution decisions.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply symptom attribution to a demonstrated inguinal hernia",
        "objective": "Distinguish hernia-related from coexisting musculoskeletal pain and select a repair discussion or observation without assuming every positive image explains the patient's limitation.",
        "reason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
      },
      "actions": [
        "Replace the identical activity-interruption sentence with concrete location and maneuver correlations.",
        "Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion.",
        "Remove the rejected basic flag and version the changed objective.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B09",
    {
      "update": "The outside neck ultrasound includes central and lateral compartments. A lateral node has a 12-mm short axis, a fluid-filled center, punctate bright foci in its solid rim and peripheral blood flow. Aspiration of the fluid yielded macrophages and proteinaceous material; the saved needle image shows no pass through the solid rim.",
      "task": "Which preoperative diagnostic plan should be arranged for {patientName}'s lateral neck finding?",
      "options": [
        [
          "Repeat node FNA with cytology and thyroglobulin washout",
          "The prior fluid-only sample does not resolve the suspicious rim findings. Target solid tissue and use washout as an adjunct interpreted with the intact thyroid."
        ],
        [
          "Repeat whole-neck ultrasound before further cervical-node FNA",
          "The compartments are already mapped; repeating the map alone does not resolve the discordant node sample."
        ],
        [
          "Proceed with cervical-node staging from the existing cytology",
          "Macrophages/protein in a cystic aspirate do not establish a benign result for a suspicious solid rim."
        ]
      ],
      "services": [
        "service.thyroid_fna",
        "service.ultrasound",
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        },
        {
          "kind": "no_test"
        }
      ],
      "claims": [
        "claim.qq20261102c.thyroid-cystic-node-discordance"
      ],
      "steps": [
        "Compare suspicious solid-rim ultrasound observations with what the needle actually sampled.",
        "Resolve the nodal uncertainty before assigning an operative nodal category."
      ],
      "closest": "Accept the reported negative fluid aspirate and proceed as node-negative.",
      "decisive": "The suspicious solid component was not sampled; full compartment mapping is already available.",
      "explanation": "A negative or nondiagnostic fluid aspirate does not override discordant nodal imaging. Repeat targeted cytology and consider thyroglobulin washout, especially for a cystic node, before allowing the result to determine the surgical plan. Washout is adjunctive, with limitations when the thyroid remains in place.",
      "attack": "The task is no longer the first mapping test. Coverage is already adequate, and the near miss is accepting a target-mismatched negative sample. No serum/washout cutoff is supplied as a universal rule.",
      "risk": "Clinician must verify sampling eligibility, localization and intact-thyroid washout interpretation. The 12-mm measurement is a constructed patient observation; the guideline's sampling criterion is the evidence-backed rule, not a new authored threshold.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve cystic thyroid-node imaging/cytology discordance",
        "objective": "Select targeted tissue confirmation for a suspicious cervical node when prior fluid-only aspiration does not explain its solid imaging features, before determining operative nodal management.",
        "reason": "Initial compartment mapping changes to resolving an already-mapped suspicious node's discordant sampling result."
      },
      "change": "Use a complete prior map and fluid-only sampling of a cystic node; test targeted resampling rather than initial ultrasound recall.",
      "actions": [
        "Document actual mapped compartments, solid rim features and needle target.",
        "Offer whole-map repetition and false node-negative assignment as credible errors.",
        "Use a new concept version and the existing FNA workflow; no service route or queue code is added.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B11-context",
    {
      "update": "An outside tangential specimen came from the flat edge of the pigmented area. It contains atypical melanocytes along the epidermal junction and reaches the deep specimen edge. A raised central component remains on examination. The report does not give a reliable maximum invasive thickness.",
      "task": "Which plan should be used for {patientName}'s remaining pigmented lesion?",
      "options": [
        [
          "Complete diagnostic excision before definitive excision and staging",
          "A representative completion specimen resolves the discrepancy before definitive staging/reconstruction; do not mistake a partial result or a minimum for the whole lesion."
        ],
        [
          "Wide excision with flap closure using the current specimen report",
          "The sample's site or deep edge limits what its result can establish about the residual lesion."
        ],
        [
          "Wide excision with sentinel-node biopsy using the current specimen report",
          "An unsampled appearance or a different flat focus does not provide the missing maximum invasive thickness."
        ]
      ],
      "decisive": "The sampled flat edge does not establish the depth of the raised residual component.",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.excisional_biopsy"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "services": [
        "service.skin_excisional_biopsy",
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "steps": [
        "Interpret the specimen's site and deep-edge limitations against the actual residual lesion.",
        "Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan."
      ],
      "closest": "Proceed directly to wide excision/flap using an incompletely measured lesion.",
      "explanation": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result.",
      "attack": "Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
      "risk": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve partial skin-biopsy and microstaging limitations",
        "objective": "Choose a representative diagnostic completion strategy when specimen location, deep transection or clinicopathologic discordance prevents a reliable whole-lesion diagnosis or microstage before definitive reconstruction/staging.",
        "reason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
      },
      "change": "Replace complete-versus-two-punch recall with a documented sampling/microstaging error and competing definitive-procedure plans.",
      "actions": [
        "The sampled flat edge does not establish the depth of the raised residual component.",
        "All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors.",
        "Retain passed later pathology/staging exactly; the gate supplies the completed specimen report.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B17-context",
    {
      "update": "An outside punch sampled a flat peripheral area. It shows melanoma confined to the epidermis in that fragment. The raised central focus remains; its surface was not included in the specimen diagram. There has been no definitive excision.",
      "task": "Which plan should be used for {patientName}'s remaining pigmented lesion?",
      "options": [
        [
          "Complete diagnostic excision before definitive excision and staging",
          "A representative completion specimen resolves the discrepancy before definitive staging/reconstruction; do not mistake a partial result or a minimum for the whole lesion."
        ],
        [
          "Wide excision with reconstruction using an in-situ margin plan",
          "The sample's site or deep edge limits what its result can establish about the residual lesion."
        ],
        [
          "Wide excision with sentinel-node biopsy using an invasive-disease plan",
          "An unsampled appearance or a different flat focus does not provide the missing maximum invasive thickness."
        ]
      ],
      "decisive": "The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus.",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.excisional_biopsy"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "services": [
        "service.skin_excisional_biopsy",
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "steps": [
        "Interpret the specimen's site and deep-edge limitations against the actual residual lesion.",
        "Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan."
      ],
      "closest": "Treat the peripheral in-situ sample as the stage of the whole lesion.",
      "explanation": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result.",
      "attack": "Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
      "risk": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve partial skin-biopsy and microstaging limitations",
        "objective": "Choose a representative diagnostic completion strategy when specimen location, deep transection or clinicopathologic discordance prevents a reliable whole-lesion diagnosis or microstage before definitive reconstruction/staging.",
        "reason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
      },
      "change": "Replace complete-versus-two-punch recall with a documented sampling/microstaging error and competing definitive-procedure plans.",
      "actions": [
        "The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus.",
        "All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors.",
        "Retain passed later pathology/staging exactly; the gate supplies the completed specimen report.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B12-context",
    {
      "update": "The outside biopsy diagram places a punch in the pale edge of the lesion. That fragment is reported as a nevus. The changing asymmetric center remains, with a different surface pattern from the sampled area. The clinician and pathologist have reviewed the diagram together.",
      "task": "Which next specimen plan should be arranged for {patientName}'s persisting lesion?",
      "options": [
        [
          "Complete diagnostic excision of the residual pigmented area",
          "A representative completion specimen resolves the discrepancy before definitive staging/reconstruction; do not mistake a partial result or a minimum for the whole lesion."
        ],
        [
          "Repeat punch biopsy of the residual pigmented center",
          "A central punch is a credible targeted alternative, but another partial sample can leave a heterogeneous residual lesion incompletely assessed when complete diagnostic excision is feasible."
        ],
        [
          "Wide excision with sentinel-node biopsy of the regional basin",
          "An unsampled appearance or a different flat focus does not provide the missing maximum invasive thickness."
        ]
      ],
      "decisive": "A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center.",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.excisional_biopsy"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "services": [
        "service.skin_excisional_biopsy",
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "steps": [
        "Interpret the specimen's site and deep-edge limitations against the actual residual lesion.",
        "Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan."
      ],
      "closest": "Accept the benign punch as representative of the entire asymmetric lesion.",
      "explanation": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result.",
      "attack": "Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
      "risk": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve partial skin-biopsy and microstaging limitations",
        "objective": "Choose a representative diagnostic completion strategy when specimen location, deep transection or clinicopathologic discordance prevents a reliable whole-lesion diagnosis or microstage before definitive reconstruction/staging.",
        "reason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
      },
      "change": "Replace complete-versus-two-punch recall with a documented sampling/microstaging error and competing definitive-procedure plans.",
      "actions": [
        "A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center.",
        "All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors.",
        "Retain passed later pathology/staging exactly; the gate supplies the completed specimen report.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B18-context",
    {
      "update": "The outside shave contains invasive atypical melanocytes at its deep cut surface. The pathologist reports at least 0.6 mm of invasion, with deeper tumor beyond the section's edge not measurable. A firm residual focus is present.",
      "task": "Which plan should be used for {patientName}'s remaining pigmented lesion?",
      "options": [
        [
          "Complete diagnostic excision of the residual lesion",
          "A representative completion specimen resolves the discrepancy before definitive staging/reconstruction; do not mistake a partial result or a minimum for the whole lesion."
        ],
        [
          "Wide excision and nodal planning using the minimum depth",
          "The sample's site or deep edge limits what its result can establish about the residual lesion."
        ],
        [
          "Punch biopsy of the adjacent flat pigmented area",
          "An unsampled appearance or a different flat focus does not provide the missing maximum invasive thickness."
        ]
      ],
      "decisive": "A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion.",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.excisional_biopsy"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "services": [
        "service.skin_excisional_biopsy",
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "steps": [
        "Interpret the specimen's site and deep-edge limitations against the actual residual lesion.",
        "Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan."
      ],
      "closest": "Treat a minimum thickness as the maximum depth when planning an irreversible procedure.",
      "explanation": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result.",
      "attack": "Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
      "risk": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve partial skin-biopsy and microstaging limitations",
        "objective": "Choose a representative diagnostic completion strategy when specimen location, deep transection or clinicopathologic discordance prevents a reliable whole-lesion diagnosis or microstage before definitive reconstruction/staging.",
        "reason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
      },
      "change": "Replace complete-versus-two-punch recall with a documented sampling/microstaging error and competing definitive-procedure plans.",
      "actions": [
        "A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion.",
        "All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors.",
        "Retain passed later pathology/staging exactly; the gate supplies the completed specimen report.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B12",
    {
      "update": "The completed primary specimen measures 1.5 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. Ultrasound-guided sampling of its solid cortex contains malignant melanocytes matching the skin primary. Distant staging has not yet been completed.",
      "task": "Which staging plan should be arranged next for {patientName}?",
      "options": [
        [
          "Distant staging and regional multidisciplinary review",
          "The basin is already tissue-positive; occult sentinel-node staging does not answer the remaining extent/treatment question."
        ],
        [
          "Sentinel-node biopsy followed by regional treatment planning",
          "Tissue has already demonstrated melanoma in the suspicious regional node."
        ],
        [
          "Therapeutic node dissection followed by distant staging",
          "Therapeutic nodal surgery may be part of care, but committing before distant staging and multidisciplinary planning can miss a management-changing extent finding."
        ]
      ],
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.melanoma-suspicious-node-pathway"
      ],
      "steps": [
        "Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node.",
        "Use the known-positive pathway rather than performing an occult sentinel-node test."
      ],
      "closest": "Apply the familiar thickness-based sentinel-node rule despite a proven positive node.",
      "decisive": "Malignant melanocytes in the solid regional-node sample already establish nodal involvement.",
      "explanation": "Sentinel-node biopsy evaluates occult regional disease in an appropriate clinically node-negative patient. A proven positive node or an unresolved suspicious, inadequately sampled node belongs to a different diagnostic/staging sequence. Do not apply a primary-thickness rule before establishing which basin category actually exists.",
      "attack": "The primary thickness is retained as a tempting familiar rule, but the decisive variable is the nodal specimen. The two siblings require different actions for positive versus nonrepresentative-negative sampling.",
      "risk": "Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply regional-node evidence before sentinel staging",
        "objective": "Distinguish a clinically node-negative melanoma basin from a proven-positive or suspicious nonrepresentatively sampled node, and choose the appropriate next diagnostic/staging pathway.",
        "reason": "The scored decision changes from applying a thickness rule in a negative basin to resolving observed nodal evidence before using that rule."
      },
      "change": "Replace two uncomplicated above-threshold sentinel-node rules with positive versus inadequately sampled suspicious-node decisions.",
      "actions": [
        "Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings.",
        "Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence.",
        "Remove the rejected basic flag and retain the prior concept for existing learning histories.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B18",
    {
      "update": "The completed primary specimen measures 1.8 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. The aspiration report says no malignant cells, but the submitted material contains blood without lymphoid tissue. The saved needle image does not enter the abnormal cortex.",
      "task": "Which staging plan should be arranged next for {patientName}?",
      "options": [
        [
          "Targeted core biopsy of the regional node",
          "The negative aspiration is not representative of the suspicious node; settle that discrepancy before an occult-node pathway."
        ],
        [
          "Sentinel-node biopsy of the regional basin",
          "A blood-only miss does not establish a clinically negative basin."
        ],
        [
          "Serial ultrasound surveillance of the regional basin",
          "The unresolved suspicious morphology cannot be dismissed by the nonrepresentative aspirate."
        ]
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.melanoma-suspicious-node-pathway"
      ],
      "steps": [
        "Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node.",
        "Resolve a target-mismatched negative sample before assigning a node-negative sentinel-node pathway."
      ],
      "closest": "Treat the word negative as sufficient and apply the thickness-based sentinel-node rule.",
      "decisive": "The aspirate is blood-only and the needle missed the abnormal cortex.",
      "explanation": "Sentinel-node biopsy evaluates occult regional disease in an appropriate clinically node-negative patient. A proven positive node or an unresolved suspicious, inadequately sampled node belongs to a different diagnostic/staging sequence. Do not apply a primary-thickness rule before establishing which basin category actually exists.",
      "attack": "The primary thickness is retained as a tempting familiar rule, but the decisive variable is the nodal specimen. The two siblings require different actions for positive versus nonrepresentative-negative sampling.",
      "risk": "Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply regional-node evidence before sentinel staging",
        "objective": "Distinguish a clinically node-negative melanoma basin from a proven-positive or suspicious nonrepresentatively sampled node, and choose the appropriate next diagnostic/staging pathway.",
        "reason": "The scored decision changes from applying a thickness rule in a negative basin to resolving observed nodal evidence before using that rule."
      },
      "change": "Replace two uncomplicated above-threshold sentinel-node rules with positive versus inadequately sampled suspicious-node decisions.",
      "actions": [
        "Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings.",
        "Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence.",
        "Remove the rejected basic flag and retain the prior concept for existing learning histories.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B14-context",
    {
      "update": "The outside contrast CT includes the entire chest, abdomen and pelvis. A solitary 8-mm liver focus is neither uniform water attenuation nor fat and cannot be classified from its single portal-venous acquisition. No other distant lesion is reported. Kidney function is within the laboratory range.",
      "task": "Which investigation should complete {patientName}'s pretreatment assessment?",
      "options": [
        [
          "Liver MRI with contrast",
          "Dedicated liver characterization addresses the actual unresolved staging finding without discarding adequate coverage elsewhere."
        ],
        [
          "Whole-body FDG PET-CT",
          "Routine metabolic imaging does not substitute for appropriate anatomic characterization of this indeterminate liver finding."
        ],
        [
          "Image-guided liver biopsy",
          "Tissue can be appropriate in selected indeterminate lesions, but dedicated noninvasive characterization is the preferred next problem-solving step for this small single-phase finding before committing to sampling."
        ]
      ],
      "services": [
        "service.liver_mri",
        "service.imaging.pet-ct",
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pet_ct"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        }
      ],
      "gate": {
        "service": "service.liver_mri",
        "routes": [
          "route.liver_mri.outsourced"
        ],
        "pendingLabel": "Liver characterization pending",
        "result": "Dedicated liver MRI characterizes the focus as a benign cyst. The correlated final staging review identifies no distant deposits or enlarged regional nodes."
      },
      "claims": [
        "claim.qq20261102c.colon-indeterminate-liver-mri"
      ],
      "steps": [
        "Separate complete staging coverage from an unresolved focal characterization problem.",
        "Select targeted liver characterization rather than repeat the same general examination or substitute routine PET."
      ],
      "closest": "Request PET-CT as a universal tie-breaker for an indeterminate cancer-staging focus.",
      "decisive": "Coverage is complete; only a noncystic/nonfat single-phase liver focus remains unresolved, and MRI is feasible.",
      "explanation": "A complete staging examination may leave a focal lesion unresolved. Dedicated liver MRI is an appropriate next characterization study for a subcentimeter single-phase CT finding in known extrahepatic cancer. PET sensitivity and the value/feasibility of biopsy differ from targeted anatomic characterization; neither is universally forbidden. Retain the adequate prior staging.",
      "attack": "No repeated sentence names an absent contrast series. Every option is a plausible completion strategy, and only the actual unresolved liver finding distinguishes them.",
      "risk": "Radiology/colorectal clinician must verify the exact liver protocol and benign classification; no invented attenuation cutoff, growth interval or contrast eligibility threshold.",
      "concept": {
        "suffix": "v2",
        "displayName": "Complete colon staging from actual prior imaging",
        "objective": "Retain adequate prior staging while selecting targeted characterization or missing-region imaging from the actual coverage and unresolved findings of outside examinations.",
        "reason": "Routine first staging-bundle selection changes to completing an already-performed assessment with a specific unresolved finding."
      },
      "change": "Replace the twice-stated missing-contrast cue with an adequately covered examination and an indeterminate liver focus requiring a different protocol.",
      "actions": [
        "Delete the redundant missing-enhancement statement.",
        "Supply actual coverage, a specific unresolved liver finding and the kidney-function observation; omit a generic modality-permission list.",
        "Retain the passed shared polyp presentation and later management question exactly.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence.",
        "Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B15-context",
    {
      "update": "The outside abdominal and pelvic MRI includes the liver, mesentery and pelvic nodal stations with diagnostic contrast-enhanced sequences; no distant deposit is identified there. A separate CT obtained for cardiac assessment starts below the carina and ends at the diaphragm. Its lower-lung images contain a small solid nodule near the cranial edge. No upper-lung images were acquired.",
      "task": "Which plan should complete {patientName}'s pretreatment imaging assessment?",
      "options": [
        [
          "Diagnostic whole-chest CT",
          "The prior examination did not cover the whole chest; preserve the diagnostic abdominal/pelvic work and complete the unresolved thoracic assessment."
        ],
        [
          "Chest radiography",
          "A radiograph does not replace diagnostic thoracic CT for the incompletely assessed lung finding and staging coverage."
        ],
        [
          "FDG PET with low-dose localization CT",
          "Metabolic assessment with localization CT is not the same as the required diagnostic thoracic acquisition, particularly for a small nodule."
        ]
      ],
      "services": [
        "service.ct",
        null,
        "service.imaging.pet-ct"
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.radiography"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pet_ct"
        }
      ],
      "claims": [
        "claim.qq20261102c.colon-adequate-regions-and-chest-ct"
      ],
      "steps": [
        "Read the actual anatomic start/end of the prior CT instead of treating any chest-containing CT as complete staging.",
        "Preserve adequate abdominopelvic MRI and obtain diagnostic whole-chest assessment of the partly imaged nodule."
      ],
      "closest": "Order metabolic imaging to characterize a small nodule while accepting low-dose localization images as full diagnostic chest staging.",
      "decisive": "The CT covers only below the carina, whereas the abdominal and pelvic MRI is already diagnostic.",
      "explanation": "Use the studies that actually answer each regional question. Diagnostic abdominal/pelvic MRI can be retained, but a partial lower-chest cardiac acquisition does not cover the upper lungs or fully assess the edge nodule. The later staging report is supplied only after completion of the diagnostic chest study.",
      "attack": "The choices are comparable completion plans that retain the useful MRI. Neither a normal radiograph nor a list of nonstaging tests supplies the usual bundle verbatim.",
      "risk": "Confirm protocol eligibility and radiology characterization. Small is an observed descriptor, not an invented nodule-size or surveillance cutoff; no exact follow-up interval is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Complete colon staging from actual prior imaging",
        "objective": "Retain adequate prior staging while selecting targeted characterization or missing-region imaging from the actual coverage and unresolved findings of outside examinations.",
        "reason": "Routine first staging-bundle selection changes to completing an already-performed assessment with a specific unresolved finding."
      },
      "change": "Replace normal radiography/ultrasound with usable abdominopelvic MRI and a partly imaged lung finding on a genuinely limited chest acquisition.",
      "actions": [
        "Retain the usable studies and make the unresolved region/finding explicit.",
        "Three complete imaging plans differ in whether they adequately assess the chest.",
        "The long pathology presentation remains exact because it belongs to the passed resection decision; it is not repeated as a new staging cue.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B19-context",
    {
      "update": "The outside MRI was requested as a knee examination. Its uppermost image cuts through the distal edge of the palpable thigh mass; the proximal palpable end lies above the acquired field. The included images show enhancing tissue, but no transverse section contains the entire mass with the adjacent neurovascular bundle.",
      "task": "Which imaging plan should be arranged for {patientName}'s mass?",
      "options": [
        [
          "Contrast-enhanced whole-thigh MRI",
          "The acquired knee field does not show the extent/compartment relationships needed for planning a biopsy tract."
        ],
        [
          "Contrast-enhanced MRI of the knee",
          "More enhancement data in the same cropped field cannot establish the missing proximal extent."
        ],
        [
          "FDG PET-CT of the thigh",
          "Metabolic intensity does not replace complete local anatomic planning."
        ]
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pet_ct"
        }
      ],
      "services": [
        "service.extremity_mri",
        "service.extremity_mri",
        "service.imaging.pet-ct"
      ],
      "claims": [
        "claim.qq20261102c.sarcoma-mri-coverage-and-target"
      ],
      "steps": [
        "Recognize that contrast does not repair a field that truncates the lesion.",
        "Obtain local MRI of the entire lesion and compartment relationships before a tract is chosen."
      ],
      "closest": "Repeat the impressive-looking contrast study while retaining the knee field.",
      "decisive": "The lesion and its proximal relationships lie outside the acquired field.",
      "explanation": "Local MRI needs to answer extent and compartment questions, not merely contain a piece of enhancing tumor. Correct the coverage before choosing a tract.",
      "attack": "Each sibling contains a real MRI and a different missing question. The key is not uniquely the MRI modality; a competing MRI protocol is credible but does not repair the actual limitation.",
      "risk": "MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed.",
      "concept": {
        "suffix": "v2",
        "displayName": "Assess local MRI adequacy before soft-tissue biopsy",
        "objective": "Choose completion of local MRI based on the actual field coverage, compartment mapping and viable-target information missing from an outside study before biopsy planning.",
        "reason": "The initial modality-selection rule changes to deciding which part of an existing local MRI must be completed."
      },
      "change": "Use cropped-field versus missing-enhancement problems rather than two generic MRI-first questions.",
      "actions": [
        "Show the actual field truncation instead of calling an MRI inadequate.",
        "Keep the passed later method/tract question and its returned result exactly.",
        "Remove the rejected basic label and create a separate concept version.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B20-context",
    {
      "update": "The outside upper-arm MRI covers the full palpable mass and adjacent neurovascular structures. The saved series are T1 and fluid-sensitive acquisitions; no post-injection series appears in the export. Several internal regions are bright on fluid-sensitive images.",
      "task": "Which imaging plan should be arranged for {patientName}'s mass?",
      "options": [
        [
          "Upper-arm MRI with contrast",
          "Enhancement information can distinguish viable sampling regions when fluid-sensitive brightness alone does not establish viability."
        ],
        [
          "Noncontrast MRI of the entire arm",
          "Coverage is already complete; a larger field alone does not provide the missing enhancement information."
        ],
        [
          "Upper-arm FDG PET-CT",
          "An avid target does not substitute for local enhancement and tract planning in this accessible lesion."
        ]
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pet_ct"
        }
      ],
      "services": [
        "service.extremity_mri",
        "service.extremity_mri",
        "service.imaging.pet-ct"
      ],
      "claims": [
        "claim.qq20261102c.sarcoma-mri-coverage-and-target",
        "claim.qq20261102c.sarcoma-enhancement-biopsy-target"
      ],
      "steps": [
        "Recognize that adequate coverage does not establish which bright internal region is viable.",
        "Complete enhancement assessment before choosing a viable region and tract."
      ],
      "closest": "Select the brightest fluid-sensitive region as viable tissue without enhancement assessment.",
      "decisive": "The full lesion is mapped but there is no enhancement acquisition to separate internal components.",
      "explanation": "Fluid-sensitive signal is not a viability label. Complete the enhancement assessment of the already-mapped mass before choosing a target.",
      "attack": "Each sibling contains a real MRI and a different missing question. The key is not uniquely the MRI modality; a competing MRI protocol is credible but does not repair the actual limitation.",
      "risk": "MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed.",
      "concept": {
        "suffix": "v2",
        "displayName": "Assess local MRI adequacy before soft-tissue biopsy",
        "objective": "Choose completion of local MRI based on the actual field coverage, compartment mapping and viable-target information missing from an outside study before biopsy planning.",
        "reason": "The initial modality-selection rule changes to deciding which part of an existing local MRI must be completed."
      },
      "change": "Use cropped-field versus missing-enhancement problems rather than two generic MRI-first questions.",
      "actions": [
        "Show actual acquired series instead of announcing a missing safety study.",
        "Keep the passed later method/tract question and its returned result exactly.",
        "Remove the rejected basic label and create a separate concept version.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B21-context",
    {
      "update": "A previous forceps specimen was reported as normal colonic mucosa. Its slide contains epithelium, crypts and lamina propria, ending above the submucosal plane. The current endoscopic and wall-layer observations are documented above.",
      "task": "Which tissue-assessment plan should be recorded for {patientName}'s lesion?",
      "options": [
        [
          "No additional lesion tissue sampling",
          "The normal surface biopsy is compatible with a characteristic submucosal lipoma; it does not require invasive confirmation."
        ],
        [
          "EUS-guided core biopsy of the lesion",
          "Core tissue is appropriate for selected indeterminate or higher-risk subepithelial lesions, but is not needed solely to reconfirm the characteristic lipoma pattern shown here."
        ],
        [
          "Repeat deep-forceps biopsy of the lesion",
          "A deeper forceps attempt might obtain submucosa, but another tissue procedure is unnecessary when the characteristic imaging and examination already establish an asymptomatic lipoma."
        ]
      ],
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.upper_endoscopy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.upper_endoscopy"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.classic-lipoma-normal-mucosal-sample"
      ],
      "steps": [
        "Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled.",
        "Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion."
      ],
      "closest": "Require EUS-guided core tissue for every subepithelial lesion after a normal mucosal biopsy.",
      "decisive": "The current deformable third-layer uniformly bright lesion is characteristic, and the submitted specimen contains only the overlying mucosa.",
      "explanation": "Interpret a negative specimen by the layer it contains. Normal mucosa does not erase a submucosal lesion. For a characteristic lipoma, normal mucosal biopsies do not mandate another lesion specimen.",
      "attack": "The task now applies specimen-layer interpretation against a plausible instinct to obtain tissue proof. It does not introduce a contradictory fourth-layer lesion or a second unresolved mass that would invalidate the passed no-follow-up plan.",
      "risk": "The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden.",
      "concept": {
        "suffix": "v2",
        "displayName": "Reconcile mucosal sampling with a characteristic subepithelial lesion",
        "objective": "Interpret whether a negative surface specimen samples the EUS-defined layer and decide whether a characteristic colonic lipoma needs further tissue confirmation.",
        "reason": "Simple lesion naming changes to a patient-specific specimen/imaging and further-investigation decision."
      },
      "change": "Replace repeated label recognition with normal-mucosa versus submucosal-imaging interpretation and credible over-sampling/exclusion errors.",
      "actions": [
        "Retain all exact shared clinical findings because the later management item passed.",
        "Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings.",
        "The second sibling tests the technique-label shortcut: a named bite-on-bite sample is judged by the actual tissue it reached.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B22-context",
    {
      "update": "The outside laboratory report calls a bite-on-bite specimen negative. Review of its levels shows epithelium and lamina propria only; the submucosal plane is not represented. The lesion's deformability and wall-layer study are those documented in the current examination above.",
      "task": "Which tissue-assessment plan should be recorded for {patientName}'s lesion?",
      "options": [
        [
          "No additional lesion tissue sampling",
          "The named biopsy technique did not reach the lesion, but a characteristic lipoma appearance does not require tissue confirmation merely because surface mucosa is normal."
        ],
        [
          "EUS-guided core biopsy of the lesion",
          "Core tissue is appropriate for selected indeterminate or higher-risk subepithelial lesions, but is not needed solely to reconfirm the characteristic lipoma pattern shown here."
        ],
        [
          "Repeat deep-forceps biopsy of the lesion",
          "A deeper forceps attempt might obtain submucosa, but another tissue procedure is unnecessary when the characteristic imaging and examination already establish an asymptomatic lipoma."
        ]
      ],
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.upper_endoscopy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.upper_endoscopy"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.classic-lipoma-normal-mucosal-sample"
      ],
      "steps": [
        "Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled.",
        "Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion."
      ],
      "closest": "Keep repeating an apparently deep biopsy technique until a classic lesion has histologic proof.",
      "decisive": "The current deformable third-layer uniformly bright lesion is characteristic, and the submitted specimen contains only the overlying mucosa.",
      "explanation": "Interpret a negative specimen by the layer it contains. Normal mucosa does not erase a submucosal lesion. For a characteristic lipoma, normal mucosal biopsies do not mandate another lesion specimen.",
      "attack": "The task now applies specimen-layer interpretation against a plausible instinct to obtain tissue proof. It does not introduce a contradictory fourth-layer lesion or a second unresolved mass that would invalidate the passed no-follow-up plan.",
      "risk": "The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden.",
      "concept": {
        "suffix": "v2",
        "displayName": "Reconcile mucosal sampling with a characteristic subepithelial lesion",
        "objective": "Interpret whether a negative surface specimen samples the EUS-defined layer and decide whether a characteristic colonic lipoma needs further tissue confirmation.",
        "reason": "Simple lesion naming changes to a patient-specific specimen/imaging and further-investigation decision."
      },
      "change": "Replace repeated label recognition with normal-mucosa versus submucosal-imaging interpretation and credible over-sampling/exclusion errors.",
      "actions": [
        "Retain all exact shared clinical findings because the later management item passed.",
        "Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings.",
        "The second sibling tests the technique-label shortcut: a named bite-on-bite sample is judged by the actual tissue it reached.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B24",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review gastric biopsies obtained for dyspepsia. Small CD20-positive B cells form nodules among mixed inflammatory cells. The submitted sections contain gastric glands whose epithelium is preserved. Immunoglobulin gene-rearrangement testing reports a clonal B-cell population.",
      "update": "The biopsy container identifies one antral site. The remaining block contains mucosa available for further sections. The stored endoscopy diagram has no marked biopsy sites elsewhere in the stomach.",
      "task": "Which interpretation should guide {patientName}'s next care?",
      "options": [
        [
          "Keep the classification open and obtain correlated histologic assessment",
          "Clonality and B-cell lineage do not settle a morphologically unresolved infiltrate; retain diagnostic review rather than assign a definitive lymphoma or reactive category."
        ],
        [
          "Assign gastric MALT lymphoma and enter its treatment pathway",
          "A clonal population may occur with chronic inflammation; the stated evidence does not independently establish the lymphoma classification."
        ],
        [
          "Assign reactive gastritis and end the lymphoma assessment",
          "Preserved glands in these sections do not by themselves exclude all MALT lymphoma or make this limited distribution definitive."
        ]
      ],
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.gastric-clonality-classification-boundary"
      ],
      "steps": [
        "Weigh the clonal result against the actual morphology and sampling distribution rather than translating clonality into malignancy.",
        "Choose continued integrated classification before either lymphoma treatment or diagnostic closure."
      ],
      "closest": "Treat clonal B cells as sufficient proof of lymphoma and start the lymphoma pathway.",
      "decisive": "B-cell lineage/clonality is established, but the supplied morphology and sampling do not establish a specific lymphoma or exclude it.",
      "explanation": "A clonal B-cell result is interpreted with morphology and clinical context. It neither independently establishes gastric MALT lymphoma nor makes preserved glands proof of benignity. The correct decision here is to retain diagnostic assessment. This question deliberately does not rank fusion testing, deeper sections and repeat endoscopy as interchangeable next investigations.",
      "attack": "Remove the unadjudicated repeat-endoscopy-versus-FISH competition. All choices are interpretation-and-care categories, and none gets credit from a named safety principle or a longer test bundle.",
      "risk": "Melissa/pathology must adjudicate the integrated classification and eventual sampling plan. This draft does not claim a particular next test is uniquely best or that absent gland destruction excludes MALT.",
      "change": "Reframe the failed investigation ranking as a classification/diagnostic-closure decision; supply real sample distribution and remaining-material facts.",
      "actions": [
        "Describe one recorded site and available remaining material instead of assuming adequacy or exhaustion.",
        "Do not claim a repeat endoscopy is superior to testing existing tissue on the facts given.",
        "The near misses are overcalling malignancy from clonality and excluding it from preserved glands; no new concept meaning is intended beyond the existing integrated-diagnosis boundary."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B25-context",
    {
      "update": "The gastric sections contain a dense small B-cell infiltrate expanding the lamina propria and entering gland epithelium. Larger cells with open chromatin and nucleoli occur singly between the small cells rather than in confluent groups. CD20 marks the infiltrate. H. pylori is detected, and staging shows disease confined to the stomach.",
      "task": "Which pathology-and-initial-care interpretation should be used for {patientName}?",
      "options": [
        [
          "Gastric MALT lymphoma: eradication and histologic review",
          "Scattered larger cells do not by themselves establish large-B-cell transformation; integrate the small-cell/gland architecture and localized infection-associated presentation."
        ],
        [
          "Gastric large-B-cell lymphoma: systemic lymphoma care",
          "The mere presence of individual larger cells is not the confluent large-cell component required to establish transformation."
        ],
        [
          "Reactive gastric follicles: infection care and clinical review",
          "The atypical small B-cell expansion with gland invasion is not explained by a reactive-follicle label alone."
        ]
      ],
      "claims": [
        "claim.qq20261102c.gastric-large-cell-transformation-boundary",
        "claim.qq20261102c.gastric-eradication-response-pathway"
      ],
      "steps": [
        "Interpret the architecture and distribution of the larger cells instead of grading from their mere presence.",
        "Select the corresponding initial infection-associated indolent lymphoma pathway and retain histologic review."
      ],
      "closest": "Overcall transformation from the presence of a few larger atypical cells and bypass eradication-led care.",
      "decisive": "The destructive infiltrate is predominantly small B cells; the larger cells are dispersed individually, with localized H. pylori-associated disease.",
      "explanation": "Gastric lymphoma classification is architectural, not a tally of positive lineage markers or any large cell. A confluent large-B-cell component changes the pathway; individual larger cells among an otherwise small-cell MALT pattern do not establish that change. Localized infection-associated indolent disease is treated with eradication and planned histologic response assessment.",
      "attack": "Delete the negative CD5/CD10/cyclin-D1 list and its tailored subtype distractors. The competing error now changes management, and the diagnosis is an answer choice rather than a stem label.",
      "risk": "Pathologist must verify the described architecture and absence of a confluent large-cell component; no proliferation cutoff or regimen/dose is invented.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply gastric lymphoma morphology to the treatment pathway",
        "objective": "Integrate gastric small-cell architecture, molecular-test limitations and the actual distribution of large cells before selecting an indolent MALT rather than aggressive/reactive care pathway.",
        "reason": "Signature-marker recognition changes to a morphology-driven classification and initial-care decision with a competing transformation interpretation."
      },
      "change": "Replace subtype-marker recall with a larger-cell interpretation that would otherwise redirect treatment.",
      "actions": [
        "Use actual small-cell/gland architecture and individual large-cell distribution.",
        "Remove the marker-negative elimination list.",
        "The initial classification/therapy decision is separate from the later post-eradication response question and receives a new concept version.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B25",
    {
      "update": "After treatment for localized H. pylori-positive gastric MALT lymphoma, a urea breath test is negative six weeks after therapy started and two weeks after proton-pump inhibitors stopped. The gastric ulcer has healed, the discomfort has resolved and repeat mapped biopsies show smaller residual lymphoid clusters with increasing fibrosis. There is no new deep wall extension or nodal disease on reassessment. The original BIRC3-MALT1 study was negative. PCR still detects the original B-cell clone.",
      "task": "Which care plan should be arranged for {patientName}'s returned assessment?",
      "options": [
        [
          "Active surveillance with repeat gastric biopsies",
          "The patient is asymptomatic with regressing residual disease and no adverse progression; persistent clonality alone is not an instruction for immediate additional treatment."
        ],
        [
          "Involved-site radiotherapy with repeat gastric biopsies",
          "This treats molecular persistence as sufficient progression despite regressing morphology and resolved symptoms."
        ],
        [
          "Further eradication therapy with repeat gastric biopsies",
          "Infection clearance was assessed under stated conditions; residual lymphoma is not equivalent to persistent infection."
        ]
      ],
      "claims": [
        "claim.qq20261102c.hpylori-test-conditions",
        "claim.qq20261102c.gastric-regressing-residual-monitoring",
        "claim.qq20261102c.gastric-molecular-persistence"
      ],
      "steps": [
        "Verify that the infection result is interpretable and distinguish residual histology/PCR from ongoing infection.",
        "Use the symptom and histologic trajectory to choose monitoring rather than equating any residual clone with treatment failure."
      ],
      "closest": "Escalate to radiotherapy because the original clone remains detectable.",
      "decisive": "Symptoms and ulceration have resolved and morphology is regressing, with valid infection assessment and no new adverse extension.",
      "explanation": "The direction of the clinical and histologic response matters. Asymptomatic residual gastric MALT without adverse progression can be monitored after eradication. A persistent molecular clone does not by itself establish a need for radiotherapy, and residual lymphoma does not prove that the infection persists. Planned histologic follow-up remains necessary.",
      "attack": "The diagnosis alone no longer gives an initial-treatment rule. Positive residual tests compete with concrete improvement; the choices are three complete follow-up strategies without the former shared-half convergence.",
      "risk": "Hematology/clinician must confirm response classification, the exact infection-test conditions and follow-up schedule. No new lymphoma response deadline or universal observation duration is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Choose gastric MALT care from post-eradication trajectory",
        "objective": "Distinguish regressing asymptomatic residual gastric MALT or molecular persistence from progressive symptomatic disease after interpretable infection reassessment, and choose monitoring versus escalation.",
        "reason": "Initial eradication selection changes to deciding what an actual post-treatment response warrants."
      },
      "change": "Replace initial first-line recall with a discordant molecular-positive but clinically/histologically improving response.",
      "actions": [
        "Supply source-backed infection-test timing/medication conditions rather than say eradication was successful.",
        "Supply symptom, endoscopic, histologic and extent trajectories.",
        "Make persistent clone versus persistent infection versus progressive lymphoma the competing interpretations; version the changed objective.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B30",
    {
      "update": "Mapped gastric biopsies show a small atypical B-cell expansion entering gland epithelium and replacing portions of its lining. CD20 marks the infiltrate. H. pylori is present. FISH does not detect BIRC3-MALT1. The clinical staging assessment confines the disease to the stomach.",
      "task": "Which interpretation and initial-care plan should be discussed with {patientName}?",
      "options": [
        [
          "Gastric MALT lymphoma: eradication and histologic review",
          "The fusion is not present in all MALT lymphoma. Negative FISH does not overturn compatible integrated morphology or remove the need for response assessment."
        ],
        [
          "Reactive gastritis: infection care and clinical review",
          "A negative subtype-associated molecular test is not a sensitive exclusion test for MALT lymphoma."
        ],
        [
          "Indeterminate infiltrate: repeat fusion testing before treatment",
          "Repeating the same negative molecular result does not resolve or override the already available integrated tissue findings."
        ]
      ],
      "claims": [
        "claim.qq20261102c.gastric-negative-fusion-not-exclusion",
        "claim.qq20261102c.gastric-eradication-response-pathway"
      ],
      "steps": [
        "Interpret a negative fusion test as a limited molecular result rather than exclusion of the morphologic diagnosis.",
        "Retain the localized infection-associated lymphoma treatment and response-assessment pathway."
      ],
      "closest": "Use a precise negative molecular report to overrule the integrated morphology and omit lymphoma follow-up.",
      "decisive": "The architecture is compatible despite absent fusion; the test is not universally positive in this disease.",
      "explanation": "Molecular tests have different roles from integrated diagnosis. BIRC3-MALT1 is not detected in every gastric MALT lymphoma, so its absence cannot exclude an otherwise supported classification. Use the morphology and clinical extent to plan eradication-led care and histologic response review.",
      "attack": "Remove the tailored negative lineage-marker list. The negative test is a credible contrary observation that must be interpreted, not a complete diagnosis summary before the question.",
      "risk": "Pathology must confirm the complete classification and molecular-test role; FISH negativity does not guarantee treatment response or exclude all alternative diagnoses.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply gastric lymphoma morphology to the treatment pathway",
        "objective": "Integrate gastric small-cell architecture, molecular-test limitations and the actual distribution of large cells before selecting an indolent MALT rather than aggressive/reactive care pathway.",
        "reason": "Signature-marker recognition changes to a morphology-driven classification and initial-care decision with a competing transformation interpretation."
      },
      "change": "Use a discordant negative molecular result as a consequential classification/follow-up decision rather than another signature immunophenotype.",
      "actions": [
        "Delete CD5/CD10/cyclin-D1 eliminations.",
        "Make the actual negative fusion result compete with the tissue architecture.",
        "Keep treatment response separate in the later node; the changed classification-plus-care objective has its own version.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B30-context",
    {
      "update": "After completed eradication, the urea breath test is negative six weeks after treatment started and two weeks after stopping proton-pump inhibitors. Serial endoscopy shows the gastric ulcer enlarging rather than healing, and recurrent bleeding has lowered hemoglobin. Repeat mapped biopsies show increasing low-grade MALT infiltration. Restaging still confines the disease to the stomach; there is no confluent large-cell component.",
      "task": "Which care plan should be arranged for {patientName}'s returned assessment?",
      "options": [
        [
          "Involved-site radiotherapy with histologic review",
          "Localized symptomatic, overtly progressive disease after infection clearance warrants escalation rather than monitoring a regressing residual pattern."
        ],
        [
          "Continued surveillance with histologic review",
          "Observation of asymptomatic residual disease does not apply unchanged to worsening ulceration, bleeding and increasing infiltration."
        ],
        [
          "Further eradication therapy with histologic review",
          "The infection assessment is interpretable; disease progression is not evidence that the same infection treatment needs repetition."
        ]
      ],
      "claims": [
        "claim.qq20261102c.hpylori-test-conditions",
        "claim.qq20261102c.gastric-progressive-local-escalation"
      ],
      "steps": [
        "Distinguish overt symptomatic histologic/endoscopic progression from slow or regressing residual disease.",
        "Use localized extent and confirmed infection clearance to choose a lymphoma escalation discussion."
      ],
      "closest": "Apply the familiar prolonged-response observation policy despite a worsening clinical and tissue trajectory.",
      "decisive": "Ulcer enlargement, recurrent bleeding and increasing lymphoma infiltration coexist after interpretable infection clearance.",
      "explanation": "Slow histologic clearance and overt progression are different clinical states. Localized gastric MALT with symptomatic or adverse progression after eradication should be assessed for involved-site radiotherapy. Do not infer persistent infection from residual lymphoma or apply watchful monitoring without considering the actual trajectory.",
      "attack": "The key is determined by observed progression, not an arbitrary time since eradication. The sister case supports monitoring with the same test conditions but a different clinical trajectory.",
      "risk": "Hematology/radiation clinician must verify escalation and restaging; no dose, response deadline or automatic radiotherapy instruction is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Choose gastric MALT care from post-eradication trajectory",
        "objective": "Distinguish regressing asymptomatic residual gastric MALT or molecular persistence from progressive symptomatic disease after interpretable infection reassessment, and choose monitoring versus escalation.",
        "reason": "Initial eradication selection changes to deciding what an actual post-treatment response warrants."
      },
      "change": "Replace the duplicated initial eradication question with a progressive symptomatic localized response that contrasts with B25's improving residual disease.",
      "actions": [
        "Use actual infection-test conditions and serial endoscopic/histologic findings.",
        "Offer observation as a credible near miss with a defined clinical boundary.",
        "Version the changed objective; do not introduce an exact response-failure deadline.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B26",
    {
      "presentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The outcome is unplanned reoperation; a lower risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. Its target benefit is a reduction of at least 4 percentage points. It confirms that target only when the entire reported 95% interval supports that reduction, and excludes the target only when the entire interval falls short of it.",
      "task": "Which interpretation and study-planning conclusion should {patientName}'s team report?",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed teaching estimates and protocol; not a clinical benefit threshold.",
        "items": [
          {
            "label": "Risk difference: intervention minus control",
            "value": "-5 percentage points"
          },
          {
            "label": "Approximate 95% confidence interval",
            "value": "-17 to 7 percentage points"
          },
          {
            "label": "Two-sided p-value, rounded",
            "value": "0.4"
          }
        ]
      },
      "options": [
        [
          "Target benefit is plausible but unconfirmed; a more precise study could resolve it",
          "The point estimate meets the target, but the interval admits both a larger benefit and harm. Neither significance nor target confirmation/exclusion is established."
        ],
        [
          "Target benefit is excluded by nonsignificance; another efficacy study has no role",
          "A failure to reject the zero-effect null does not exclude clinically important benefits admitted by the interval."
        ],
        [
          "Target benefit is established by the point estimate; proceed with routine adoption",
          "A favorable point estimate alone does not satisfy the supplied whole-interval decision criterion."
        ],
        [
          "Clinical equivalence is established by nonsignificance; stop comparative efficacy work",
          "Nonsignificance is not an equivalence result, especially when the interval includes large effects in both directions."
        ]
      ],
      "claims": [
        "claim.qq20261102c.uncertain-target-benefit-not-excluded"
      ],
      "mathematics": {
        "kind": "targetConflict",
        "point": -5,
        "lower": -17,
        "upper": 7,
        "target": 4,
        "p": 0.4,
        "alpha": 0.05
      },
      "steps": [
        "Notice that the point estimate meets the target but the uncertainty interval still includes harm and much larger benefit.",
        "Reject both premature adoption and false futility/equivalence, and identify precision as the unresolved question."
      ],
      "closest": "Call the target excluded because the result is not statistically significant.",
      "decisive": "The interval spans harm and target-level benefit despite a favorable target-meeting point estimate.",
      "explanation": "The p-value, estimated effect and interval answer different questions. A nonsignificant study can remain compatible with a worthwhile effect. Here the target is unconfirmed, not excluded, and equivalence has not been established. A more precise design may distinguish those possibilities; the fictional protocol does not prescribe a clinical adoption threshold.",
      "attack": "The protocol stays visible for fairness. The conflict is between the favorable point estimate and uncertainty, rather than two concordant threshold comparisons. Every option states a conclusion and consequence.",
      "risk": "Statistical/clinical review must verify estimates and the distinction between an interval model and a probability of a true effect. No real treatment benefit threshold or collection of gameplay statistics.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply uncertainty to a target-benefit decision",
        "objective": "Integrate an effect estimate, confidence interval and null test to distinguish target benefit confirmed, excluded or unresolved and avoid false adoption, futility or equivalence conclusions.",
        "reason": "Defining a p-value changes to an applied study-planning decision about a target effect under uncertainty."
      },
      "change": "Use a target-meeting point estimate with an interval admitting both harm and worthwhile benefit; distinguish unconfirmed from excluded.",
      "actions": [
        "Keep the hypothetical protocol criteria visible rather than hide necessary decision information.",
        "Introduce a real point-estimate/interval conflict and consequence-based options.",
        "Validate all constructed arithmetic separately and version the broader scored objective."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B32-context",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with fullness after pancreatitis. Meals stop after a few mouthfuls, and weight is falling despite dietetic support. The patient now reports black stools.",
      "update": "The outside portal-venous CT shows a walled fluid collection next to the posterior stomach. A rounded enhancing focus lies at its margin. No arterial acquisition was obtained. Hemoglobin has fallen from the last clinic result. After resuscitation, repeated pulse and blood-pressure observations are near the patient's preceding values.",
      "task": "Which imaging plan should be arranged next for {patientName}?",
      "options": [
        [
          "Multiphasic CT angiography",
          "Bleeding plus an enhancing marginal focus requires vascular characterization before a drainage plan."
        ],
        [
          "Portal-venous contrast-enhanced CT",
          "Repeating the same venous acquisition does not answer the suspected arterial-source question."
        ],
        [
          "Pancreatic MRI with MRCP",
          "Duct continuity matters for drainage but does not take priority over the new arterial-bleeding concern."
        ]
      ],
      "services": [
        "service.ct",
        "service.ct",
        "service.mrcp"
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct_angiography"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.mrcp"
        }
      ],
      "gate": {
        "service": "service.ct",
        "routes": [
          "route.ct.outsourced"
        ],
        "pendingLabel": "Arterial CT assessment pending",
        "result": "Arterial CT shows a round cavity at the collection edge filling to the same density as the splenic artery, with a narrow connecting channel. The collection has a complete wall and compresses the posterior stomach. Hemoglobin remains below the previous clinic value after the episode of melena; pulse and blood pressure remain near the post-resuscitation observations."
      },
      "claims": [
        "claim.qq20261102c.pancreatic-arterial-focus-before-drainage"
      ],
      "steps": [
        "Notice the new blood-loss finding within an otherwise plausible symptomatic collection story.",
        "Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping."
      ],
      "closest": "Repeat portal-venous CT with the same coverage as the outside study",
      "decisive": "Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss.",
      "explanation": "Notice the new blood-loss finding within an otherwise plausible symptomatic collection story. Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment.",
      "attack": "Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained.",
      "risk": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Complete collection imaging for a specific intervention question",
        "objective": "Select targeted vascular, internal-content or pancreatic-duct assessment from actual prior imaging and clinical findings before choosing a collection intervention.",
        "reason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
      },
      "change": "Replace four identical contrast-route questions with vascular, contents and duct-continuity applications paired to different treatment decisions.",
      "actions": [
        "Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss.",
        "Remove the oral-contrast omission assertion and all rejected basic metadata.",
        "Use an explicit new concept version and, for three siblings, the existing MRCP service/gate instead of falsely returning MRCP findings from a CT-only order.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B32",
    {
      "update": "Arterial CT shows a round cavity at the collection edge filling to the same density as the splenic artery, with a narrow connecting channel. The collection has a complete wall and compresses the posterior stomach. Hemoglobin remains below the previous clinic value after the episode of melena; pulse and blood pressure remain near the post-resuscitation observations.",
      "task": "Which treatment sequence should be arranged for {patientName}?",
      "options": [
        [
          "Arterial embolization, then collection drainage if required",
          "The arterial source takes priority; drainage can be reconsidered after vascular control rather than puncturing or decompressing it first."
        ],
        [
          "Endoscopic collection drainage, then arterial treatment if required",
          "The otherwise reasonable drainage indication does not override an untreated communicating arterial source."
        ],
        [
          "Surgical arterial control with internal collection drainage",
          "Surgery can provide vascular control in selected circumstances, but angiographic control is the usual less invasive next approach for the supplied resuscitated arterial complication when available; internal drainage alone is not the vascular treatment."
        ]
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pseudocyst_drainage"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.pancreatic-arterial-focus-before-drainage"
      ],
      "steps": [
        "Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris.",
        "Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage."
      ],
      "closest": "Proceed with the apparently ideal apposed-collection drainage before treating the vascular source.",
      "decisive": "The enhancing cavity communicates with an artery and accompanies new blood loss.",
      "explanation": "Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy.",
      "attack": "The four siblings require different treatment sequences, not a repeated apposed-fluid rule. Actual failure of meals/support and/or blood loss supplies the decision burden; no size-only intervention threshold or timing-based shortcut.",
      "risk": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply vascular, contents and duct findings to collection treatment",
        "objective": "Choose the route and sequence of intervention for a clinically consequential post-pancreatitis collection by interpreting arterial findings, necrotic contents and partial versus complete duct interruption.",
        "reason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications."
      },
      "change": "Replace four near-identical drainage referrals with arterial control, necrosis step-up, partial-leak bridging and disconnected-duct drainage decisions.",
      "actions": [
        "The enhancing cavity communicates with an artery and accompanies new blood loss.",
        "Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention.",
        "Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B33-context",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after necrotizing pancreatitis. Vomiting repeatedly stops meals, and oral intake has not recovered despite dietetic and enteral support.",
      "update": "The outside contrast CT shows an encapsulated collection against the posterior stomach. Its contents are described as mostly fluid, with internal strands that cannot be separated from nonliquid material on the available images.",
      "task": "Which investigation plan should be arranged next for {patientName}'s collection?",
      "options": [
        [
          "Pancreatic MRI with MRCP",
          "MRI can better resolve nonliquid contents and duct anatomy before choosing the procedure."
        ],
        [
          "Repeat contrast-enhanced CT",
          "A duplicate acquisition and fluid-only assumption do not resolve the actual contents question."
        ],
        [
          "Endoscopic retrograde pancreatography",
          "A duct intervention cannot replace characterization of a possible necrotic collection before treatment planning."
        ]
      ],
      "services": [
        "service.mrcp",
        "service.ct",
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.mrcp"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ercp"
        }
      ],
      "gate": {
        "service": "service.mrcp",
        "routes": [
          "route.mrcp.outsourced"
        ],
        "pendingLabel": "MRI/MRCP assessment pending",
        "result": "MRI shows a complete-walled collection apposed to the posterior stomach, containing dependent irregular nonliquid fragments among fluid. The patient continues to vomit after meals despite nutritional support. There is no current clinical sepsis or organ failure."
      },
      "claims": [
        "claim.qq20261102c.pancreatic-mri-contents",
        "claim.qq20261102c.pancreatic-necrosis-step-up"
      ],
      "steps": [
        "Recognize that the proposed procedure depends on whether CT strands are nonliquid contents.",
        "Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification."
      ],
      "closest": "Repeat the same CT acquisition and classify all low-density contents as fluid",
      "decisive": "The CT's actual unresolved question is internal nonliquid material, not simply whether IV contrast was used.",
      "explanation": "Recognize that the proposed procedure depends on whether CT strands are nonliquid contents. Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment.",
      "attack": "Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained.",
      "risk": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Complete collection imaging for a specific intervention question",
        "objective": "Select targeted vascular, internal-content or pancreatic-duct assessment from actual prior imaging and clinical findings before choosing a collection intervention.",
        "reason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
      },
      "change": "Replace four identical contrast-route questions with vascular, contents and duct-continuity applications paired to different treatment decisions.",
      "actions": [
        "The CT's actual unresolved question is internal nonliquid material, not simply whether IV contrast was used.",
        "Remove the oral-contrast omission assertion and all rejected basic metadata.",
        "Use an explicit new concept version and, for three siblings, the existing MRCP service/gate instead of falsely returning MRCP findings from a CT-only order.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence.",
        "Delete pre-answer teaching about why the internal material changes the procedure; retain the actual CT observations."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B33",
    {
      "update": "MRI shows a complete-walled collection apposed to the posterior stomach, containing dependent irregular nonliquid fragments among fluid. The patient continues to vomit after meals despite nutritional support. There is no current clinical sepsis or organ failure.",
      "task": "Which endoscopic treatment sequence should be discussed for {patientName}?",
      "options": [
        [
          "Transmural drainage with reassessment; add necrosectomy if required",
          "An apposed symptomatic necrotic collection supports an endoscopic step-up approach rather than assuming all debris must be removed in the first session."
        ],
        [
          "Transmural necrosectomy first, followed by drainage stenting",
          "Visible solid material does not automatically require immediate direct debridement before an initial drainage strategy."
        ],
        [
          "Transpapillary duct stenting alone, followed by collection reassessment",
          "A duct-only approach does not adequately address an apposed necrotic collection with nonliquid material and persistent obstructive symptoms."
        ]
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.pseudocyst_drainage"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pseudocyst_drainage"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ercp"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.pancreatic-mri-contents",
        "claim.qq20261102c.pancreatic-necrosis-step-up"
      ],
      "steps": [
        "Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst.",
        "Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut."
      ],
      "closest": "Choose immediate necrosectomy because solid material is visible, rather than beginning with drainage and reassessment.",
      "decisive": "The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance.",
      "explanation": "Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy.",
      "attack": "The four siblings require different treatment sequences, not a repeated apposed-fluid rule. Actual failure of meals/support and/or blood loss supplies the decision burden; no size-only intervention threshold or timing-based shortcut.",
      "risk": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply vascular, contents and duct findings to collection treatment",
        "objective": "Choose the route and sequence of intervention for a clinically consequential post-pancreatitis collection by interpreting arterial findings, necrotic contents and partial versus complete duct interruption.",
        "reason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications."
      },
      "change": "Replace four near-identical drainage referrals with arterial control, necrosis step-up, partial-leak bridging and disconnected-duct drainage decisions.",
      "actions": [
        "The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance.",
        "Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention.",
        "Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B34-context",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after pancreatitis with persistent meal-related upper-abdominal pain. Usual meals remain incomplete despite dietetic support.",
      "update": "The outside CT shows a walled 4-cm fluid collection separated from the stomach and duodenum by intervening bowel. The main pancreatic duct is visible on both sides of the region, but the CT does not show whether its lumen remains continuous or communicates with the collection.",
      "task": "Which investigation plan should be arranged for {patientName}'s returned CT findings?",
      "options": [
        [
          "Pancreatic MRI with MRCP",
          "Duct communication and partial versus complete interruption change the choice of drainage route; obtain noninvasive mapping first."
        ],
        [
          "Repeat contrast-enhanced CT",
          "The existing CT already provides the relevant wall and surrounding-organ information but does not resolve the duct question."
        ],
        [
          "Endoscopic retrograde pancreatography",
          "Diagnostic ERCP adds procedural risk before the duct anatomy and likelihood of a therapeutic target are established."
        ]
      ],
      "services": [
        "service.mrcp",
        "service.ct",
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.mrcp"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ercp"
        }
      ],
      "gate": {
        "service": "service.mrcp",
        "routes": [
          "route.mrcp.outsourced"
        ],
        "pendingLabel": "MRI/MRCP assessment pending",
        "result": "MRCP shows a 4-cm fluid-only collection with a complete wall. A side leak communicates with it, while the main duct remains continuous into the upstream gland. Stomach and duodenum are separated from the collection by intervening bowel. Meal-related pain and reduced intake persist despite supportive care."
      },
      "claims": [
        "claim.qq20261102c.pancreatic-duct-mapping",
        "claim.qq20261102c.pancreatic-partial-leak-bridge"
      ],
      "steps": [
        "Identify duct continuity as the unresolved variable that changes the route.",
        "Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP."
      ],
      "closest": "Repeat portal-venous CT using the same acquisition and field",
      "decisive": "CT has already mapped the collection and intervening bowel, but not duct continuity/communication.",
      "explanation": "Identify duct continuity as the unresolved variable that changes the route. Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment.",
      "attack": "Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained.",
      "risk": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Complete collection imaging for a specific intervention question",
        "objective": "Select targeted vascular, internal-content or pancreatic-duct assessment from actual prior imaging and clinical findings before choosing a collection intervention.",
        "reason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
      },
      "change": "Replace four identical contrast-route questions with vascular, contents and duct-continuity applications paired to different treatment decisions.",
      "actions": [
        "CT has already mapped the collection and intervening bowel, but not duct continuity/communication.",
        "Remove the oral-contrast omission assertion and all rejected basic metadata.",
        "Use an explicit new concept version and, for three siblings, the existing MRCP service/gate instead of falsely returning MRCP findings from a CT-only order.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B34",
    {
      "update": "MRCP shows a 4-cm fluid-only collection with a complete wall. A side leak communicates with it, while the main duct remains continuous into the upstream gland. Stomach and duodenum are separated from the collection by intervening bowel. Meal-related pain and reduced intake persist despite supportive care.",
      "task": "Which drainage plan should be discussed for {patientName}?",
      "options": [
        [
          "Transpapillary pancreatic duct stenting",
          "A small communicating collection with a continuous upstream duct and no safe apposition can be considered for a transpapillary bridging approach."
        ],
        [
          "Transmural drainage of the collection",
          "The actual path lacks safe apposition; a visible collection does not by itself provide a suitable transmural route."
        ],
        [
          "Percutaneous drainage of the collection",
          "This may leave ongoing pancreatic leakage and an external fistula; it does not use the bridgeable duct anatomy supplied."
        ]
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ercp"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pseudocyst_drainage"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.pancreatic-duct-mapping",
        "claim.qq20261102c.pancreatic-partial-leak-bridge"
      ],
      "steps": [
        "Distinguish a partial communicating leak with upstream continuity from a disconnected duct.",
        "Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule."
      ],
      "closest": "Use the familiar transmural drainage route despite interposed bowel and a bridgeable duct leak.",
      "decisive": "The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum.",
      "explanation": "Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy.",
      "attack": "The four siblings require different treatment sequences, not a repeated apposed-fluid rule. Actual failure of meals/support and/or blood loss supplies the decision burden; no size-only intervention threshold or timing-based shortcut.",
      "risk": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply vascular, contents and duct findings to collection treatment",
        "objective": "Choose the route and sequence of intervention for a clinically consequential post-pancreatitis collection by interpreting arterial findings, necrotic contents and partial versus complete duct interruption.",
        "reason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications."
      },
      "change": "Replace four near-identical drainage referrals with arterial control, necrosis step-up, partial-leak bridging and disconnected-duct drainage decisions.",
      "actions": [
        "The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum.",
        "Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention.",
        "Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B35-context",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with recurrent fullness and reduced intake after necrotizing pancreatitis. A collection that collapsed during temporary drainage has reaccumulated after drain removal.",
      "update": "CT shows a recurrent fluid collection against the posterior stomach and enhancing pancreatic tissue in the tail beyond the prior necrotic segment. The former drain fluid had pancreatic-enzyme activity far above the serum sample. The CT does not trace a duct connection from the tail to the downstream gland.",
      "task": "Which investigation should guide {patientName}'s next drainage plan?",
      "options": [
        [
          "Pancreatic MRI with MRCP",
          "Recurrence, pancreatic drainage and a viable upstream gland make duct continuity consequential; MRCP can assess it noninvasively."
        ],
        [
          "Repeat contrast-enhanced CT",
          "A larger drain does not resolve whether an ongoing disconnected upstream source exists."
        ],
        [
          "Endoscopic retrograde pancreatography",
          "Upstream tissue on CT is not proof of a bridgeable duct; assess the anatomy rather than assume continuity."
        ]
      ],
      "services": [
        "service.mrcp",
        "service.ct",
        null
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.mrcp"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ercp"
        }
      ],
      "gate": {
        "service": "service.mrcp",
        "routes": [
          "route.mrcp.outsourced"
        ],
        "pendingLabel": "MRI/MRCP assessment pending",
        "result": "MRCP shows an enhancing viable pancreatic tail with a dilated duct ending at the recurrent collection. The duct from the ampulla ends on the other side of the intervening necrotic segment; no connecting segment is demonstrated. The collection is completely walled and apposed to the posterior stomach. Fullness again prevents normal food intake."
      },
      "claims": [
        "claim.qq20261102c.pancreatic-duct-mapping",
        "claim.qq20261102c.pancreatic-disconnected-long-term-drainage"
      ],
      "steps": [
        "Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone.",
        "Map continuity noninvasively before selecting another duct/transmural strategy."
      ],
      "closest": "Repeat the same CT and choose a larger drain from collection diameter alone",
      "decisive": "CT shows viable upstream tissue and recurrence, but not continuity; pancreatic-enzyme-rich fluid supports an ongoing duct-source question.",
      "explanation": "Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone. Map continuity noninvasively before selecting another duct/transmural strategy. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment.",
      "attack": "Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained.",
      "risk": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Complete collection imaging for a specific intervention question",
        "objective": "Select targeted vascular, internal-content or pancreatic-duct assessment from actual prior imaging and clinical findings before choosing a collection intervention.",
        "reason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
      },
      "change": "Replace four identical contrast-route questions with vascular, contents and duct-continuity applications paired to different treatment decisions.",
      "actions": [
        "CT shows viable upstream tissue and recurrence, but not continuity; pancreatic-enzyme-rich fluid supports an ongoing duct-source question.",
        "Remove the oral-contrast omission assertion and all rejected basic metadata.",
        "Use an explicit new concept version and, for three siblings, the existing MRCP service/gate instead of falsely returning MRCP findings from a CT-only order.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B35",
    {
      "update": "MRCP shows an enhancing viable pancreatic tail with a dilated duct ending at the recurrent collection. The duct from the ampulla ends on the other side of the intervening necrotic segment; no connecting segment is demonstrated. The collection is completely walled and apposed to the posterior stomach. Fullness again prevents normal food intake.",
      "task": "Which endoscopic plan should be discussed for {patientName}'s recurrent collection?",
      "options": [
        [
          "Transmural drainage with planned long-term plastic-stent drainage",
          "A symptomatic recurrent collection supplied by a disconnected viable upstream gland favors continued internal drainage rather than assuming a short drainage course cures the source."
        ],
        [
          "Transpapillary stenting intended to bridge the separated duct ends",
          "Complete disconnection is different from a partial leak with upstream continuity; a presumed bridging route does not resolve the supplied anatomy."
        ],
        [
          "Temporary transmural drainage with removal once the fluid collapses",
          "This repeats the short-course assumption despite recurrence and an ongoing disconnected upstream source."
        ]
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.pseudocyst_drainage"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pseudocyst_drainage"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ercp"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.pancreatic-duct-mapping",
        "claim.qq20261102c.pancreatic-disconnected-long-term-drainage"
      ],
      "steps": [
        "Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak.",
        "Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap."
      ],
      "closest": "Choose an ERCP bridge by treating complete disconnection as the partial leak in the other sibling.",
      "decisive": "Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland.",
      "explanation": "Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy.",
      "attack": "The four siblings require different treatment sequences, not a repeated apposed-fluid rule. Actual failure of meals/support and/or blood loss supplies the decision burden; no size-only intervention threshold or timing-based shortcut.",
      "risk": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
      "concept": {
        "suffix": "v2",
        "displayName": "Apply vascular, contents and duct findings to collection treatment",
        "objective": "Choose the route and sequence of intervention for a clinically consequential post-pancreatitis collection by interpreting arterial findings, necrotic contents and partial versus complete duct interruption.",
        "reason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications."
      },
      "change": "Replace four near-identical drainage referrals with arterial control, necrosis step-up, partial-leak bridging and disconnected-duct drainage decisions.",
      "actions": [
        "Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland.",
        "Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention.",
        "Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B36",
    {
      "presentation": "{patientName} leads an employee quality meeting about a structured visit form. Staff currently copy the signed visit medication list into the form by hand. The prescriber enters dose changes in that list before form entry; the latest dispensing record still contains the previous prescriptions. Staff can manually enter or import either record. The team wants to reduce the extra form work, retaining clinician review and checking both time and agreement with the clinical record.",
      "exhibit": {
        "kind": "table",
        "caption": "Constructed totals across the same ten uses.",
        "columnHeaders": [
          "Previous process",
          "Current form"
        ],
        "rowHeaders": [
          "Medication reconciliation: total minutes",
          "Form entry after current-list sign-off: total minutes",
          "Final clinical review: total minutes",
          "Unplanned repeat contacts in the next 20 visits"
        ],
        "cells": [
          [
            "20",
            "20"
          ],
          [
            "10",
            "50"
          ],
          [
            "10",
            "10"
          ],
          [
            "8",
            "8"
          ]
        ]
      },
      "task": "Which comparison should {patientName}'s team use for its next PDSA test?",
      "options": [
        [
          "Manual entry from the visit list vs automatic entry from that list",
          "This tests an adaptation of the increased form-entry work while keeping the clinical source unchanged. Retain review and record agreement as well as time."
        ],
        [
          "Manual entry from dispensing data vs automatic entry from the visit list",
          "Both the entry method and the clinical source change. The record difference can confound interpretation of the method change and does not represent the existing manual workflow."
        ],
        [
          "Automatic entry from dispensing data vs automatic entry from the visit list",
          "This tests source differences between two automatic workflows, rather than the change from the actual manual form-entry process that has gained work."
        ]
      ],
      "claims": [
        "claim.qq20261102c.pdsa-source-specific-next-test",
        "claim.qq20261102c.qi-comparison-input-control"
      ],
      "steps": [
        "Use the stage-specific times to identify form re-entry as the adaptation target rather than reconciliation or final review.",
        "Choose a comparison of the actual manual process with automatic entry that preserves the clinical source, instead of confounding source freshness with entry method."
      ],
      "closest": "Compare stale dispensing/manual data with current-list automatic entry and attribute the whole difference to automation.",
      "decisive": "The added work is after signed-list review, the existing manual process uses that list, and the dispensing record differs in its prescriptions.",
      "explanation": "The extra work occurs during form entry after the medication list has been reviewed. Compare the current manual process with automatic entry using the same visit list; retain review and measure agreement as well as time. Simultaneously changing record sources makes the method comparison harder to interpret, while comparing two automatic sources answers a different question. A small PDSA test informs the next iteration; it does not establish a treatment effect or guarantee benefit.",
      "attack": "The task asks for the next comparison rather than preselecting a prefill source. All options use concrete sources and entry modes; multiple alternatives import the visit list, so its freshness cannot identify the key by word matching alone. No causal-effect teaching appears before the answer.",
      "risk": "QI reviewer must verify the best next local test and feasible imports. Source and workflow observations are constructed; this is not a mandate for one-factor-at-a-time testing in every PDSA cycle or proof of software benefit.",
      "change": "Replace source-choice matching with a controlled next-cycle comparison: interpret the workload stage, then separate an entry-method change from a simultaneous clinical-source change. The existing adopt/adapt/define-next-cycle objective is retained.",
      "actions": [
        "Show the actual current manual process, two available record sources, their timing and both import capabilities.",
        "Offer three natural workflow comparisons: same-source method change, simultaneous method/source change, and source-only change.",
        "Remove the preselected-prefill lead-in and implementation/privacy wording in the exhibit caption; keep the inference and causal limitation in feedback."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B37",
    {
      "update": "A subsequent ultrasound-guided core procedure sampled the breast. The stored post-biopsy image places the marker in fat below the irregular parenchymal area; the needle track remains below that area. Sections contain adipose tissue and scant fibrous stroma. The expanding skin changes remain, and the irregular area is still visible on repeat ultrasound.",
      "task": "Which next care plan best fits {patientName}'s current findings?",
      "options": [
        [
          "Repeat image-guided breast core biopsy",
          "The actual target was not represented by the core; resolve the imaging-pathology discordance rather than treat a missed-target benign result as exclusion."
        ],
        [
          "Anti-inflammatory treatment with clinical reassessment",
          "The needle/marker and tissue do not explain the persistent imaged abnormality and clinical progression."
        ],
        [
          "Skin punch biopsy with clinical reassessment",
          "Skin sampling may be complementary, but does not substitute for representative tissue from the unresolved parenchymal target."
        ]
      ],
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ibc_biopsy_and_staging"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.cutaneous_lesion_biopsy"
        }
      ],
      "services": [
        "service.ibc_biopsy_and_staging",
        null,
        "service.cutaneous_lesion_biopsy"
      ],
      "claims": [
        "claim.qq20261102c.breast-core-target-discordance"
      ],
      "steps": [
        "Check the specimen/marker against the imaged target instead of accepting benign tissue as representative.",
        "Obtain target-concordant parenchymal tissue; do not substitute inflammatory treatment or skin-only clearance."
      ],
      "closest": "Trust the negative core report and treat the persistent skin changes as inflammation.",
      "decisive": "Both the needle/marker location and tissue show that the persistent parenchymal target was missed.",
      "explanation": "Benign tissue is informative only when it accounts for the clinical and imaging target. A missed-target core requires further histologic assessment, with the technique selected jointly by breast imaging/pathology. Skin punch samples may add information but cannot independently clear the unsampled parenchymal lesion.",
      "attack": "Delete the future-staging teaching sentence. The old shared aspiration/no-block facts remain exact because the passed companion uses the same presentation; the new task is driven by a later missed-target core, not by an announced need for initial tissue.",
      "risk": "Breast clinician must verify the image/pathology discordance and appropriate repeat core/vacuum-assisted or surgical technique. The existing bundled biopsy/staging service remains; no new service execution is implied by an option label.",
      "concept": {
        "suffix": "v2",
        "displayName": "Resolve breast imaging/core-biopsy discordance",
        "objective": "Interpret target position and specimen contents after a benign breast core result and choose representative further tissue assessment rather than dismiss a persistent suspicious parenchymal lesion.",
        "reason": "Initial tissue confirmation changes to an actual benign-core/imaging-target discordance decision."
      },
      "change": "Replace aspirate-to-core recall with documented missed-target sampling and competing false-benign/skin-only pathways.",
      "actions": [
        "Use saved needle/marker position and actual sampled tissue, not an inconclusive label.",
        "Delete the future systemic-staging sentence.",
        "Retain the passed shared presentation and neoadjuvant/local-treatment item exactly; version the changed workup objective.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options.",
        "Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B40",
    {
      "presentation": "{patientName}, a {ageYears}-year-old {sexNoun}, is assessed after renewed melena following endoscopic treatment of a duodenal ulcer. At the first EGD, epinephrine injection and through-the-scope clips stopped the bleeding; proton-pump inhibitor treatment continued.",
      "update": "The patient now has fresh hematemesis and a further hemoglobin fall. After resuscitation, blood pressure is 118/72 mmHg and pulse is 94/min. The first examination recorded a directly accessible ulcer target; no repeat endoscopic hemostasis has yet been attempted. Endoscopic, angiographic and operative care are available at the receiving hospital.",
      "task": "Which hemostasis plan should be arranged next for {patientName}?",
      "options": [
        [
          "Repeat therapeutic upper endoscopy",
          "Clinical recurrent bleeding after an initially successful course supports another endoscopic attempt, with a cap-mounted clip considered for recurrence."
        ],
        [
          "Transcatheter arterial embolization",
          "This bypasses the usual second endoscopic attempt in the resuscitated patient with an accessible target and no documented repeat failure."
        ],
        [
          "Operative ulcer hemostasis",
          "Primary surgery bypasses less invasive repeat endoscopy and angiographic options available in this setting."
        ]
      ],
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy"
      ],
      "steps": [
        "Distinguish clinical rebleeding after initial success from a persistently dry visible vessel or failed second hemostasis attempt.",
        "Use resuscitation response and known access to select repeat endoscopic hemostasis before immediate radiologic/operative rescue."
      ],
      "closest": "Escalate directly to embolization because there has already been one endoscopy.",
      "decisive": "Initial hemostasis succeeded, the patient has been resuscitated, the target was accessible and a second attempt has not yet failed.",
      "explanation": "After an initially successful hemostasis course, a resuscitated patient with recurrent bleeding and an accessible target can undergo another therapeutic endoscopy. Consider a cap-mounted clip for recurrence. The fact that a procedure has already occurred does not establish that an accurately targeted repeat treatment has no role.",
      "attack": "The task no longer asks a visible-vessel rule or ranks equally accepted initial modalities. All three choices are plausible escalation pathways; the course of the prior treatment and current assessment determine their sequence.",
      "risk": "Melissa must verify escalation and the resuscitation/access facts. The vital signs are constructed patient observations, not a new stability threshold; no transfusion, ulcer-size or treatment-time cutoff is invented.",
      "concept": {
        "suffix": "v2",
        "displayName": "Sequence treatment of recurrent ulcer bleeding",
        "objective": "Distinguish recurrent bleeding after initially successful endoscopy from failure of repeat hemostasis and select repeat endoscopy, angiographic or operative rescue from actual resuscitation/access findings.",
        "reason": "A high-risk-stigmata recognition rule changes to selecting an escalation sequence after a documented treatment course."
      },
      "change": "Replace the initial visible-vessel modality rule with a resuscitated recurrent-bleeding decision after one successful course.",
      "actions": [
        "Supply actual treatment success, recurrence, hemodynamic observations and target access.",
        "Avoid generic powder comparisons and unverified lesion-specific contraindications.",
        "Give all escalation services equal availability; version the new objective.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ],
  [
    "B40-context",
    {
      "update": "During repeat EGD of the same duodenal ulcer, a cap-mounted clip cannot encompass the bleeding base and contact treatment does not stop the jet. Repeated suction and irrigation cannot maintain a view for another accurately placed device. During continued resuscitation, blood pressure is 112/70 mmHg and pulse is 100/min. Angiographic and surgical teams are available.",
      "task": "Which hemostasis pathway should be arranged next for {patientName}?",
      "options": [
        [
          "Transcatheter arterial embolization",
          "The repeat endoscopic course has failed and no accurate further endoscopic target can be maintained; angiographic rescue is available."
        ],
        [
          "Repeat therapeutic upper endoscopy",
          "This repeats a pathway after its second course has failed and the required accurate view cannot be maintained."
        ],
        [
          "Operative ulcer hemostasis",
          "Surgery remains rescue care, but available angiographic treatment is the recommended next pathway after failed repeat endoscopic hemostasis in this supplied situation."
        ]
      ],
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ],
      "services": [
        null,
        null,
        null
      ],
      "claims": [
        "claim.qq20261102c.ulcer-failed-repeat-embolization"
      ],
      "steps": [
        "Recognize actual failure of the repeat therapeutic endoscopy, not merely a difficult first clip.",
        "Select available angiographic rescue rather than repeat inaccurate endoscopic attempts or bypass it for surgery."
      ],
      "closest": "Try another endoscopic device because cap-mounted clips are recommended for recurrent bleeding, despite failure and loss of an accurate view.",
      "decisive": "A second endoscopic hemostasis course has failed and the target can no longer be treated accurately; embolization is available during continued resuscitation.",
      "explanation": "Failure of the repeat endoscopic attempt changes the escalation boundary. Current guidance supports considering transcatheter embolization, with surgery when embolization is unavailable or unsuccessful or other individual circumstances require it. Do not persist with blind/inaccurate device application merely because a modality is normally useful.",
      "attack": "The same duodenal target is preserved throughout. The former injection-plus-another-modality rule and generic powder ranking are removed. Necessary access findings now distinguish actual endoscopic failure from a treatable recurrence.",
      "risk": "Melissa/IR must verify escalation, hemodynamics and availability. No generic powder is treated as uniformly inferior and no exact procedure limit or resuscitation threshold is authored.",
      "concept": {
        "suffix": "v2",
        "displayName": "Recognize failed repeat ulcer hemostasis and select rescue",
        "objective": "Use documented repeat-endoscopy failure and target access to choose angiographic versus further endoscopic or operative rescue for recurrent peptic-ulcer bleeding.",
        "reason": "Selection among initial endoscopic modalities changes to the escalation boundary after failed repeat therapy."
      },
      "change": "Replace failed-clip/injection monotherapy recall with verified repeat-treatment failure and loss of accurate access.",
      "actions": [
        "Specify both failed repeat therapy and the actual inability to maintain a treatment view.",
        "Use the same duodenal ulcer and a coherent sequence after B40.",
        "Remove topical-technology ambiguity and version the new objective.",
        "Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
      ],
      "difficulty": "moderate"
    }
  ]
]);

function put(id,s){
 if(entry.review.find(r=>r.id===id)?.verdict==="PASS"||specs.has(id))throw Error("Frozen/duplicate "+id);
 specs.set(id,{...s,difficulty:s.difficulty??"moderate"});
}

export function addAcceptedBasicB29Repair(){
 put("B29",{
  update:"The unit-required post-reversal clinical assessment has not yet been completed. His sister can accept handover and provide support at home; she can also accompany him if staff arrange a suitable collection time.",
  task:"Which discharge arrangement should be booked for George Harris?",
  exhibit:entry.revisions.find(r=>r.auditId==="B29").question.exhibit,
  options:entry.revisions.find(r=>r.auditId==="B29").question.answerChoices.map(q=>[q.label,q.rationale??q.distractorRationale]),
  basicRecallIntentional:{justification:"Independent review three accepts this rare unit-protocol escort/handover onboarding role; this repair supplies the previously missing recovery-assessment state."},
  steps:["Apply the displayed unit protocol to the incomplete post-reversal assessment.","Book adult accompaniment and handover without treating driver-only transport as equivalent."],
  closest:"End recovery on appearance alone before the required post-reversal assessment has been completed.",decisive:"The required assessment is explicitly incomplete, and a suitable accompanying adult is feasible.",
  explanation:"This constructed unit protocol requires documented post-reversal assessment and an accompanying adult who accepts handover. Being oriented and walking does not document completion of the stated assessment. No universal observation duration or ban on a particular transport company is introduced.",
  attack:"This remains the explicitly accepted basic workflow purpose; no claim of difficult resident-level reasoning is made. The missing assessment state, rather than an unprovided interval, now determines continued recovery.",
  risk:"Clinical sign-off must verify the unit protocol and recovery state; no universal time rule.",
  change:"Retain the accepted basic role and all existing protocol/options; add that the required post-reversal assessment is incomplete.",
  actions:["Specify the previously missing recovery-assessment state.","Preserve the accepted rare onboarding role and its explicit constructed protocol."],
 });
}

export function validateSpecs(){
 for(const[id,s]of specs){
  if(!s.explanation)throw Error("Missing feedback "+id);
  if(s.presentation?.includes("{ageSex}"))throw Error("Unsupported presentation token "+id);
  if(s.basicRecallIntentional&&entry.review.find(r=>r.id===id)?.basicVerdict!=="ACCEPT_BASIC")throw Error("Rejected basic relabel "+id);
  if(s.options.some(x=>x.length!==2||!x.every(v=>typeof v==="string"&&v.length)))throw Error("Incomplete options "+id);
  if(s.steps.length<2&&!s.basicRecallIntentional)throw Error("Missing application "+id);
 }
 return {revisions:specs.size,passed:entry.review.filter(r=>r.verdict==="PASS").length};
}
