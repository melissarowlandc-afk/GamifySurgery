import fs from "node:fs";
import assert from "node:assert/strict";
export const entry=JSON.parse(fs.readFileSync("tools/question-quality/fixtures/adversarial-r5-before-20261102.json","utf8"));

/** Current original synthetic specifications; only review-four REVISE entries. */
export const specs=new Map([
  [
    "B01-context",
    {
      "update": "The catheter tip remains above the diaphragm throughout the outside recording. Blind advancement stopped after repeated retching. During swallows, pressure rises simultaneously in the recorded esophageal channels.",
      "task": "Which investigation should guide procedural planning for {patientName}?",
      "options": [
        [
          "Endoscopically assisted manometry",
          "Junction-crossing manometry can provide the relaxation and body measurements absent from this recording. Assisted placement addresses the documented technical failure."
        ],
        [
          "Timed barium esophagram with a barium tablet",
          "Emptying and tablet passage can corroborate obstruction, but the prior contrast study already shows retention and this does not provide the missing manometric phenotype."
        ],
        [
          "Ambulatory esophageal pH-impedance monitoring",
          "Regurgitation can tempt reflux testing, but it does not resolve junction relaxation and contractile classification after this technically failed pressure study."
        ]
      ],
      "explanation": "The observed pressure events cannot classify junction relaxation when the catheter has not crossed it. Assisted catheter placement can permit the manometric assessment needed for procedural planning. Contrast emptying and reflux monitoring answer other questions. This comparison makes no claim that manometry universally precedes FLIP after every failed attempt.",
      "claims": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "services": [
        "service.esophageal_manometry",
        null,
        null
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.radiography"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
        }
      ],
      "steps": [
        "Recognize why simultaneous pressure in a recording confined above the diaphragm cannot establish the junction phenotype.",
        "Select technically assisted pressure acquisition rather than substitute an emptying or reflux study."
      ],
      "decisive": "The catheter never crosses the junction, despite a prior contrast study showing retention; the missing information is relaxation and contractile pattern, not reflux burden.",
      "closest": "Choose another contrast emptying study because barium retention already suggests outflow obstruction.",
      "attack": "Remove the named unattempted maneuver and all grammar outliers. FLIP is removed from the offered set instead of asserting that it is categorically inferior when tolerance limits manometry.",
      "risk": "Motility review must confirm assisted placement feasibility after this retching-limited attempt. No universal HRM-before-FLIP hierarchy or sedation-acquisition rule is asserted.",
      "change": "Delete the explicit missing-assistance sentence; use parallel investigation labels and replace the potentially co-best FLIP path with a reflux investigation that addresses a different credible interpretation.",
      "responses": {
        "cues": [
          "Deleted the sentence naming endoscopic assistance as untried; catheter position and the stopped blind attempt remain.",
          "All three labels are noun phrases naming investigations. The key no longer echoes a named missing maneuver."
        ],
        "fairness": [
          "Retained the uninterpretable junction acquisition and assisted-completion pathway; FLIP is not offered, so no universal superiority over that real alternative is claimed.",
          "Retching remains visible. Specialist feasibility remains a limitation, while the offered alternatives do not supply a junction pressure classification."
        ],
        "suggestions": [
          "Removed the named omission while preserving catheter position and reason the attempt stopped.",
          "Used parallel labels and changed the option set to avoid declaring FLIP inferior; the clinical ranking is now pressure phenotyping versus emptying or reflux testing."
        ]
      }
    }
  ],
  [
    "B02-context",
    {
      "update": "The catheter spans the junction. The outside tracing has three water swallows in quick succession: a second swallow begins before the pressure response to the first has ended, followed by the third. Distal contraction appears after the last swallow. Other attempts were stopped during retching.",
      "task": "Which acquisition should determine {patientName}'s esophageal-body classification?",
      "options": [
        [
          "Single wet swallows after baseline recovery",
          "Separated swallows assess ordinary swallow-induced peristalsis; overlapping swallows can inhibit a developing contraction."
        ],
        [
          "Multiple rapid swallows followed by a recovery swallow",
          "This probes inhibition and contractile reserve rather than replacing the baseline series needed to classify the body pattern."
        ],
        [
          "Upright rapid drinking followed by clearance swallows",
          "This is an outflow challenge and does not replace separated baseline swallows for the disputed peristaltic classification."
        ]
      ],
      "explanation": "The acquisition sequence changes how absence of contraction is interpreted. A swallow delivered during the preceding response can inhibit that response; a rapid-swallow maneuver is not an ordinary separated-swallow series. Use baseline wet swallows separated by recovery before assigning the body classification. Provocative sequences have additional roles.",
      "claims": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose"
      ],
      "services": [
        "service.esophageal_manometry",
        "service.esophageal_manometry",
        "service.esophageal_manometry"
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        }
      ],
      "steps": [
        "Interpret the overlap and post-sequence contraction as an acquisition/inhibition issue rather than established absent peristalsis.",
        "Choose the baseline acquisition that can answer the classification question instead of another provocative maneuver."
      ],
      "decisive": "The purported absent-peristalsis recording consists of overlapping swallows with a contraction after the sequence.",
      "closest": "Repeat a rapid-swallow maneuver because it also produces apparent absence of contractions during swallowing.",
      "attack": "All three choices obtain physiological data within manometry. None is a premature treatment or the uniquely 'complete' test.",
      "risk": "Motility clinicians must verify the protocol distinction. No new swallow count, volume, spacing threshold or diagnostic cutoff is authored.",
      "change": "Replace workup-versus-treatment choices with three credible acquisition protocols; remove the named absent-series list and 'complete' qualifier.",
      "responses": {
        "cues": [
          "Removed the list of absent series; the actual overlap and post-sequence contraction establish the technical issue.",
          "Removed 'complete'. Every option now proposes an acquisition rather than only the key collecting data."
        ],
        "fairness": [
          "Kept catheter position and actual swallow sequence; the answer concerns baseline classification, not commitment to either disease treatment.",
          "The choice now requires distinguishing deglutitive inhibition/contractile reserve from baseline peristaltic acquisition; generic cautious workup no longer selects the key."
        ],
        "suggestions": [
          "All three alternatives are manometry acquisitions at the same stage: separated wet swallows, rapid swallows or rapid drinking.",
          "The observed overlap and recovery contraction determine why the baseline series is needed; acquisition data are retained for fairness."
        ]
      }
    }
  ],
  [
    "B03-context",
    {
      "update": "The water-swallow study shows junction relaxation within the laboratory range and propagated contractions. The diary records retrosternal hold-up with bread and meat meals. Endoscopy found no ring or stricture, and mucosal biopsies did not show an eosinophilic infiltrate.",
      "task": "Which manometry protocol extension should be arranged for {patientName}'s persistent symptoms?",
      "options": [
        [
          "Pressure recording during a standardized solid test meal",
          "A solid-meal challenge can assess intermittent food-related obstructive physiology not represented by routine water swallows."
        ],
        [
          "Pressure recording during a multiple rapid-swallow sequence",
          "Rapid swallows assess inhibition and contractile reserve; that is a different question from the solid-food symptom challenge."
        ],
        [
          "Pressure recording during an upright rapid-drink challenge",
          "A liquid-load challenge can assess outflow, but does not reproduce the bolus conditions documented in this patient's diary."
        ]
      ],
      "explanation": "Provocative manometry should answer the unresolved physiological question. Here the routine water-swallow findings and structural/mucosal assessment leave meal-related obstructive symptoms unexplained. A standardized solid meal can relate symptoms to pressure behavior; rapid-swallow reserve and rapid-drink outflow maneuvers address different physiological questions.",
      "claims": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose",
        "claim.qq20261102d.hrm-solid-meal-provocation"
      ],
      "services": [
        "service.esophageal_manometry",
        "service.esophageal_manometry",
        "service.esophageal_manometry"
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.esophageal_manometry"
        }
      ],
      "steps": [
        "Integrate preserved water-swallow function with persistent food-related obstruction after structural and eosinophilic assessment.",
        "Select a symptom-relevant provocative protocol rather than a reserve or liquid-load maneuver."
      ],
      "decisive": "The residual problem is meal-associated bolus hold-up with otherwise propagated routine water swallows, not loss of contractile reserve demonstrated by that series.",
      "closest": "Select multiple rapid swallows as a generic way to make manometry more sensitive without identifying which physiological question it answers.",
      "attack": "Delete both explicit absent-meal wording and 'another' water-series wording. All options are real protocol extensions, so each can reasonably be proposed for persistent dysphagia.",
      "risk": "Specialist review must confirm meal-protocol selection. No universal preference over all barium/FLIP studies, meal recipe or exact acquisition threshold is taught.",
      "change": "Compare solid-meal, rapid-swallow and rapid-drink extensions; retain structural/mucosal assessment and raw routine-study findings without naming an omitted test.",
      "responses": {
        "cues": [
          "Removed the direct 'none reproduces it' contrast; retain the diary and actual routine-study observations needed to choose a challenge.",
          "Deleted the statement that meal/provocative recording is absent.",
          "Removed the dismissive repeat-water option; all three offered protocols are substantive extensions."
        ],
        "fairness": [
          "Kept negative structural and eosinophilic observations and the functional distinction, while limiting the task to a manometry extension.",
          "The alternatives now test different physiological mechanisms, rather than food versus an expressly failed duplicate. Independent review must still judge difficulty."
        ],
        "suggestions": [
          "Deleted both named-omission and 'another' wording.",
          "Rebuilt the set around supported provocative protocols using the retained ACG/Chicago claims; no unsupported recipe, volume or timing was added."
        ]
      }
    }
  ],
  [
    "B05",
    {
      "update": "The outside ultrasound record contains supine resting views of the inguinal region. No protrusion is visible in those views. The patient's work-shift photograph shows the contour change above the inguinal crease.",
      "task": "Which investigation protocol should be arranged next for {patientName}?",
      "options": [
        [
          "Standing dynamic ultrasound of the groin",
          "A targeted dynamic study tests the intermittent groin event rather than treating a resting or differently targeted examination as exclusion."
        ],
        [
          "Routine supine MRI of the groin and hip",
          "Hip pathology is a competing explanation, but this routine joint protocol does not first characterize the intermittent groin event."
        ],
        [
          "Contrast CT of the groin and pelvis at rest",
          "Cross-sectional anatomy can be useful in selected cases, but a resting CT is not the selected initial dynamic assessment of this intermittent event."
        ]
      ],
      "explanation": "A negative resting view does not necessarily test an intermittent strain-related protrusion. A targeted dynamic groin study is a selected next assessment when the examination is equivocal, while the hip findings remain relevant to pain evaluation. This does not assert that dynamic MRI is inferior after an adequate unresolved ultrasound.",
      "claims": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study",
        "claim.qq20261102c.groin-inadequate-study-certainty"
      ],
      "services": [
        "service.ultrasound",
        "service.mri",
        "service.ct"
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        }
      ],
      "steps": [
        "Recognize the difference between a resting negative view and assessment of the intermittent groin event.",
        "Select a dynamic groin acquisition rather than redirect the workup to the competing hip finding or resting cross-sectional anatomy."
      ],
      "decisive": "The observed swelling is intermittent and strain-related; the saved acquisition is resting, while hip pain supplies a plausible competing target.",
      "closest": "Choose hip-joint MRI because hip rotation reproduces pain despite the unexplained visible groin event.",
      "attack": "No option declares hernia established or excluded. The key is not the only uncertain plan; three natural investigation protocols compete. All imaging labels name the groin, so the region word cannot uniquely match the key. The actual prior ultrasound history remains decision-critical.",
      "risk": "Ultrasound selection is case-specific, not a universal hierarchy over adequate dynamic MRI. Radiology should verify the protocol comparison.",
      "change": "Remove the wrong-site and repeated missing-strain cues; replace overconfident diagnoses with parallel imaging protocols that address different plausible causes.",
      "responses": {
        "cues": [
          "Removed the hip-flexor wrong-site description; the actual saved resting groin acquisition remains.",
          "Deleted the redundant sentence listing absent cough/strain images.",
          "Removed all diagnostic-certainty labels. Three investigation protocols replace unresolved versus definitive extremes."
        ],
        "fairness": [
          "Kept an intermittent photographed event and actual resting acquisition; the plan does not declare that the photograph proves a repair indication.",
          "Hip MRI and resting CT now compete with a dynamic groin acquisition. The interpretation must connect the provoking conditions to the target."
        ],
        "suggestions": [
          "Retained one acquisition account and removed the omission list.",
          "Offered clinically recognizable protocols. Dynamic MRI is not in the set and no unsupported ultrasound-over-dynamic-MRI ranking is asserted. Every offered protocol names the groin; a repeated region word no longer selects one option."
        ]
      }
    }
  ],
  [
    "B07",
    {
      "update": "The outside ultrasound's skin marker lies at the adductor attachment to the pubis. The phone photograph places the swelling above the inguinal ligament. Ultrasound was recorded after that swelling had subsided.",
      "task": "Which investigation protocol should be arranged next for {patientName}?",
      "options": [
        [
          "Standing dynamic ultrasound of the groin",
          "A targeted dynamic study tests the intermittent groin event rather than treating a resting or differently targeted examination as exclusion."
        ],
        [
          "Routine supine MRI of the groin and adductors",
          "Adductor pathology can account for tenderness but this routine protocol does not first characterize the reported intermittent inguinal event."
        ],
        [
          "Contrast CT of the groin and pelvis at rest",
          "Cross-sectional anatomy can be useful in selected cases, but a resting CT is not the selected initial dynamic assessment of this intermittent event."
        ]
      ],
      "explanation": "An acquisition centered on the pubic adductor attachment after the event is not an anatomic characterization of the reported inguinal swelling. A targeted dynamic groin study can evaluate that event while the attachment tenderness remains a competing source of pain. This is not a universal restriction against MRI for unresolved groin symptoms.",
      "claims": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study",
        "claim.qq20261102c.groin-inadequate-study-certainty"
      ],
      "services": [
        "service.ultrasound",
        "service.mri",
        "service.ct"
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        }
      ],
      "steps": [
        "Relate the documented marker and reported swelling to the groin anatomy rather than transfer a negative result between sites.",
        "Choose the dynamic inguinal assessment over imaging focused on the tender attachment or resting anatomy."
      ],
      "decisive": "The actual examined attachment and intermittent inguinal swelling are distinct targets, with the event absent during the saved scan.",
      "closest": "Select adductor MRI because the pubic attachment is tender and the outside report is negative.",
      "attack": "Use one anatomically interpretable comparison rather than 'lateral' plus opposite-crease statements. No option claims certainty, and no hip-joint diagnosis is imported. All imaging labels name the groin, so the region word cannot uniquely match the key. The actual prior ultrasound history remains decision-critical.",
      "risk": "Clinicians/radiology must confirm the localization account and dynamic protocol choice; no new diagnostic performance or exclusion claim.",
      "change": "Replace vague wrong-site directions with the pubic attachment versus inguinal-ligament localization; use real competing imaging protocols instead of definitive diagnoses.",
      "responses": {
        "cues": [
          "Removed 'lateral to the lump'; describe the acquisition marker at a named attachment and the reported swelling relative to the inguinal ligament.",
          "Removed the duplicate opposite-crease sentence and its vague anatomy.",
          "Replaced exclusion/hip-rehabilitation wording with a routine adductor MRI protocol supported by the actual pubic tenderness."
        ],
        "fairness": [
          "No alternative makes an established/excluded hernia claim. The three plans address plausible imaging targets.",
          "The marker account is now anatomically interpretable; final anatomy/protocol review remains explicit."
        ],
        "suggestions": [
          "Use a single marker-to-landmark comparison, rather than two generic statements that the operator was wrong.",
          "Rebuilt the set for this pubic-attachment presentation and retained clinical localization as the discriminator. Every offered protocol names the groin; a repeated region word no longer selects one option."
        ]
      }
    }
  ],
  [
    "B05-context",
    {
      "update": "Standing strain ultrasound shows an inguinal protrusion that withdraws while supine. Hip-directed exercises have reduced the ache on rotation. During a work shift, the groin lump still makes the patient stop lifting; pressing it back allows lifting to resume. Rotation discomfort is still present on examination.",
      "task": "Which next plan best addresses {patientName}'s remaining activity limitation?",
      "options": [
        [
          "Elective hernia consultation with ongoing musculoskeletal care",
          "Activity-limiting bulge-associated episodes persist despite improvement of the musculoskeletal symptoms; discuss the symptomatic hernia without promising relief of every groin symptom."
        ],
        [
          "Further musculoskeletal rehabilitation before hernia consultation",
          "This prioritizes the improving musculoskeletal component while leaving the persistent activity-limiting bulge-related episodes unaddressed."
        ],
        [
          "Pelvic MRI before hernia or rehabilitation planning",
          "Further imaging may help unresolved pain, but the dynamic anatomic finding and reproducible functional burden already support a hernia consultation."
        ]
      ],
      "explanation": "Use the response trajectory as well as the scan. The hip-related ache has improved, but the reproducible bulge-associated interruption remains. Elective hernia consultation is appropriate for that functional burden while musculoskeletal care continues. Consultation is not a compulsory operation and does not promise that repair cures rotation-related pain.",
      "claims": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "steps": [
        "Separate improvement with hip-directed care from the persisting activity interruption that follows protrusion and reduction.",
        "Prioritize elective symptomatic-hernia assessment while retaining care for the other component."
      ],
      "decisive": "Improved hip symptoms coexist with persistent, reducible bulge-associated interruption of work.",
      "closest": "Extend rehabilitation alone because hip rotation still causes discomfort.",
      "attack": "No choice announces 'without hip assessment'. The trajectory and burden, rather than an invented preference, distinguish consultation from an initial rehabilitation-only plan.",
      "risk": "Hernia/hip clinicians must verify attribution; no guaranteed pain response, mandatory surgery, rehabilitation deadline or acute hernia indication is asserted.",
      "change": "Add a response-to-care trajectory and concrete functional burden; replace convergence and explicit omission with three comparable next-stage plans.",
      "responses": {
        "cues": [
          "Removed the sentence labelling a 'separate' deep ache; observable improvement and interruption/reduction now carry the distinction.",
          "Removed the option announcing omission of hip care; every next plan concerns a real clinical sequence.",
          "The key is not a union of two deliberately incomplete distractors. Rehabilitation-first and additional-imaging-first are the competing sequences."
        ],
        "fairness": [
          "Specified persistent work limitation linked to protrusion/reduction despite improving hip symptoms; no preference is invented and observation is not universally ruled out.",
          "The task asks for a next plan addressing remaining limitation; all alternatives are care sequences rather than broad discussion versus one narrow trial."
        ],
        "suggestions": [
          "Replaced 'without' with natural rehabilitation-first and imaging-first strategies.",
          "Used response and functional burden to justify consultation without a promise of deep-pain relief or a forced operation."
        ]
      },
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        }
      ]
    }
  ],
  [
    "B07-context",
    {
      "update": "Dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. The patient has completed an exercise trial for pubic-attachment pain and can now resist adduction with less discomfort. Lifting the relative still produces the lump and makes the patient set the relative down; the episode eases after the lump is reduced.",
      "task": "Which next plan best addresses {patientName}'s remaining activity limitation?",
      "options": [
        [
          "Elective hernia consultation with ongoing musculoskeletal care",
          "Activity-limiting bulge-associated episodes persist despite improvement of the musculoskeletal symptoms; discuss the symptomatic hernia without promising relief of every groin symptom."
        ],
        [
          "Further musculoskeletal rehabilitation before hernia consultation",
          "This prioritizes the improving musculoskeletal component while leaving the persistent activity-limiting bulge-related episodes unaddressed."
        ],
        [
          "Pelvic MRI before hernia or rehabilitation planning",
          "Further imaging may help unresolved pain, but the dynamic anatomic finding and reproducible functional burden already support a hernia consultation."
        ]
      ],
      "explanation": "The response of attachment discomfort to exercise does not account for the persisting lifting episodes tied to protrusion and reduction. Discuss elective hernia assessment for that activity-limiting component while retaining musculoskeletal care. This is not proof that all pubic pain is caused by the hernia, nor a selection of a repair technique.",
      "claims": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "steps": [
        "Use improvement during the attachment-pain trial to reassess attribution of the remaining episodes.",
        "Recognize meaningful reducible-hernia symptoms and choose consultation rather than repeat the same musculoskeletal-first sequence."
      ],
      "decisive": "Attachment symptoms improve, but lifting remains interrupted by the reducible inguinal lump.",
      "closest": "Continue a musculoskeletal-only trial because the original examination showed pubic tenderness.",
      "attack": "No named 'different' pain or omission option; all plans operate at the same next-care stage. Actual activity burden resolves the watchful-waiting ambiguity.",
      "risk": "Clinician confirmation of attribution is required. No hip-joint diagnosis, artificial preference, compulsory repair or treatment-response deadline is added.",
      "change": "Replace generic dual-pain recognition with an observed treatment response and remaining functional burden; use equal-scope plans.",
      "responses": {
        "cues": [
          "Replaced the labelled second tender point with the actual response to attachment-focused exercise and residual lifting episodes.",
          "Removed the explicitly neglectful 'without hip assessment' option.",
          "Replaced the union-of-omissions set with consultation, rehabilitation-first and imaging-first sequences."
        ],
        "fairness": [
          "Added actual remaining burden after improved attachment symptoms; observation is not called categorically wrong for all men with reducible hernia.",
          "The key is a defined next referral plan, with the same scope as the other sequences."
        ],
        "suggestions": [
          "All alternatives are natural next plans; none names a care omission.",
          "Functional interruption and response to care distinguish consultation from waiting; no patient preference or hip-joint diagnosis is manufactured."
        ]
      },
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.mri"
        }
      ]
    }
  ],
  [
    "B06",
    {
      "update": "Groin ultrasound was obtained supine and standing during coughing and straining. The contour change and focal symptoms occurred during recording, with no protrusion through the inguinal canal seen. The adductor attachment is tender. The treating team has requested cross-sectional imaging before a repair decision.",
      "task": "Which imaging protocol should be requested for {patientName}?",
      "options": [
        [
          "Pelvic MRI with strain views",
          "This addresses residual occult-groin uncertainty and can assess competing musculoskeletal pathology after the documented dynamic ultrasound."
        ],
        [
          "Pelvic MRI with hip-joint acquisitions",
          "A joint-focused protocol does not answer the full residual inguinal/provocation question represented by the transient contour change."
        ],
        [
          "Pelvic CT with intravenous contrast",
          "CT is useful in selected circumstances, but the selected dynamic MRI protocol better addresses the unresolved intermittent groin and soft-tissue questions here."
        ]
      ],
      "explanation": "After the documented dynamic ultrasound, groin-strain MRI can investigate persistent occult-groin uncertainty alongside soft-tissue causes. A routine hip-joint study answers a narrower question. Individual next-care sequencing still needs clinical review.",
      "claims": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study"
      ],
      "services": [
        "service.mri",
        "service.mri",
        "service.ct"
      ],
      "difficulty": "moderate",
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
          "timingProfileId": "timing.test.ct"
        }
      ],
      "steps": [
        "Recognize what was actually assessed during dynamic ultrasound and what remains unresolved.",
        "Choose a cross-sectional protocol addressing the intermittent groin and musculoskeletal differential, rather than a joint-only examination."
      ],
      "decisive": "Cross-sectional imaging is already requested after the actual dynamic scan; the unresolved event is not solely a hip-joint complaint.",
      "closest": "Order a standard hip MRI because adductor/hip-region findings are present.",
      "attack": "Delete the operator endorsement. Compare imaging protocols under the explicitly already-made imaging decision; conservative assessment is no longer incorrectly ranked as an inappropriate care option.",
      "risk": "Radiology must confirm protocol choice. This does not require MRI before every conservative groin-pain assessment or assert a universal MRI-over-CT hierarchy.",
      "change": "Remove operator praise and the co-best sports-medicine option; narrow the actual decision to cross-sectional protocol selection.",
      "responses": {
        "cues": [
          "Removed 'experienced examiner'; actual positions, provocation and observed response remain."
        ],
        "fairness": [
          "Kept adequate dynamic acquisition and reproduced symptoms as the basis for residual uncertainty.",
          "The task now concerns an already-requested cross-sectional study, as suggested. It does not declare musculoskeletal assessment or rehabilitation inappropriate.",
          "The ranking is a defined imaging-protocol choice, not ambiguity used as difficulty."
        ],
        "suggestions": [
          "Removed the quality endorsement without removing acquisition conditions.",
          "Used the reviewer's explicit already-made imaging-decision alternative and compared three protocols; no failed treatment or patient preference was invented."
        ]
      }
    }
  ],
  [
    "B06-context",
    {
      "update": "Dynamic MRI shows a small reducible inguinal protrusion and signal change at the adductor attachment. Coughing causes a brief groin twinge, but the patient completes lifting at work. Running stops because of medial-thigh pain reproduced by resisted adduction. Passive hip rotation does not reproduce that pain.",
      "task": "Which initial care plan best fits {patientName}'s activity-limiting symptoms?",
      "options": [
        [
          "Adductor rehabilitation; hernia observation",
          "The limiting complaint follows adductor loading; minimally symptomatic reducible hernia in an informed man can initially be observed."
        ],
        [
          "Hip-joint assessment with initial hernia observation",
          "This recognizes that the image alone need not justify repair, but selects a joint-focused pathway rather than the reproduced attachment-related complaint."
        ],
        [
          "Elective hernia repair before adductor rehabilitation",
          "The protrusion is real, but its limited symptom burden does not make repair the best initial treatment for the running limitation."
        ]
      ],
      "explanation": "The positive hernia image does not by itself identify the source of the activity limitation. The hernia causes a small twinge without limiting work, whereas resisted adductor loading reproduces the running complaint. Initial rehabilitation with hernia observation is defensible in this man. Review new hernia symptoms separately; no repair outcome is guaranteed.",
      "claims": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.bread-butter.inguinal-hernia.watchful-waiting"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "steps": [
        "Distinguish a real but minimally symptomatic reducible hernia from the activity-limiting attachment pain.",
        "Select the matching rehabilitation pathway and avoid using hernia repair as treatment for a discordant limiting complaint."
      ],
      "decisive": "There is some hernia discomfort, but work is unrestricted; running limitation tracks adductor loading rather than passive hip rotation.",
      "closest": "Refer for hernia repair because dynamic imaging confirms a structural lesion near the painful region.",
      "attack": "The hernia is no longer described by a list of painless negatives. Two nonoperative choices compete, so the uniquely cautious plan cannot be selected without localizing the limiting complaint. The operative sequence also names adductor rehabilitation, preventing that body term from matching only the key.",
      "risk": "Clinicians must verify localization and watchful-waiting suitability. No female/femoral exception is crossed; no rehabilitation regimen or time threshold is taught.",
      "change": "Add a meaningful but nonlimiting hernia symptom and a competing joint pathway; replace diagnosis-to-plan labels with parallel clinical plans.",
      "responses": {
        "cues": [
          "Removed the redundant painless/strain-negative pairing and the 'Muscle/Hernia/Combined pain' labels. A positive minor hernia symptom now competes with the running limitation."
        ],
        "fairness": [
          "Use the existing explicit minimally symptomatic male watchful-waiting claim; the raw activity burden and adductor/joint examination distinguish the offered plans.",
          "Two conservative plans and an operative sequence replace the direct binary echo. Independent review must still confirm predicted difficulty."
        ],
        "suggestions": [
          "Kept necessary localization, removed reassurance and echo labels.",
          "The decision weighs a positive structural lesion against functional burden and distinguishes two musculoskeletal paths; no rejected basic label is restored."
        ]
      },
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
      ]
    }
  ],
  [
    "B08-context",
    {
      "update": "Dynamic MRI shows a small reducible inguinal protrusion and signal change where the lower abdominal attachment meets the pubis. Coughing causes a brief groin twinge, but ordinary walking and lifting remain possible. Repeated trunk flexion reproduces the pain that stops exercise. Resisted adduction does not reproduce it.",
      "task": "Which initial care plan best fits {patientName}'s activity-limiting symptoms?",
      "options": [
        [
          "Abdominal-attachment rehabilitation; hernia observation",
          "The limiting complaint follows trunk loading and the attachment finding; the minimally symptomatic reducible hernia need not be repaired to begin that care."
        ],
        [
          "Adductor-focused rehabilitation with initial hernia observation",
          "This also avoids premature repair, but targets an attachment not supported by the reproduced symptom or MRI location."
        ],
        [
          "Elective hernia repair before abdominal rehabilitation",
          "This treats the coexisting protrusion as the first intervention despite discordance with the limiting symptom pattern."
        ]
      ],
      "explanation": "Weigh functional burden and the reproduced movement pattern, not only the positive groin image. The limiting pain tracks the lower abdominal attachment during trunk loading; the reducible inguinal finding has little functional burden. Targeted rehabilitation with initial hernia observation is a defensible first plan. This does not establish a guarantee about future pain or hernia behavior.",
      "claims": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.bread-butter.inguinal-hernia.watchful-waiting"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "steps": [
        "Separate the nonlimiting inguinal finding from the exercise-limiting attachment pattern using actual loading observations.",
        "Choose the matching rehabilitation focus while avoiding premature hernia repair."
      ],
      "decisive": "Trunk loading, rather than adductor loading, reproduces the limiting symptom, while the hernia produces only a brief nonlimiting twinge.",
      "closest": "Choose adductor rehabilitation because groin pain in an active patient is often attributed to the adductors.",
      "attack": "No painless-protrusion declaration or diagnosis-to-plan echo. Two equally conservative alternatives require the anatomical/localization inference. The operative sequence also names abdominal rehabilitation; the attachment term is not a key-only word match.",
      "risk": "Clinical/MSK review is needed; the passed B08 presentation and imaging task are exact. No exercise prescription or universal conservative-care duration is introduced.",
      "change": "Replace binary pain assignment with minor competing hernia symptoms and two credible rehabilitation targets.",
      "responses": {
        "cues": [
          "Removed the explicit no-discomfort protrusion versus limiting-pain assignment. All plans use natural care labels and two are conservative."
        ],
        "fairness": [
          "Retained a reducible hernia in a man, with explicit nonlimiting burden, and used the existing watchful-waiting claim rather than promise repair would help.",
          "The matched versus mismatched attachment pathways require another interpretation; the added observations now determine the option rather than decorate it."
        ],
        "suggestions": [
          "Replaced label-and-plan options with same-scope initial plans.",
          "A real inguinal symptom competes with attachment findings, and two rehabilitation targets must be distinguished. No basic exception is asserted."
        ]
      },
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
      ]
    }
  ],
  [
    "B09",
    {
      "update": "A lateral cervical node has a 12-mm short axis, a fluid-filled center, punctate bright foci in a solid rim and peripheral blood flow. The previous needle aspirate contains macrophages and proteinaceous material. The thyroid remains in place.",
      "task": "Which sampling and thyroglobulin-testing plan should be arranged for {patientName}'s lateral node?",
      "options": [
        [
          "Solid-rim FNA for cytology; thyroglobulin in needle washout",
          "Target tissue capable of yielding representative cells and use a lesion-local adjunct; washout still requires interpretation with an intact thyroid."
        ],
        [
          "Fluid-center FNA for cytology; thyroglobulin in needle washout",
          "The marker matrix is appropriate, but repeating fluid-only cellular sampling risks another nonrepresentative specimen."
        ],
        [
          "Solid-rim FNA for cytology; thyroglobulin in serum",
          "Targeting is improved, but serum thyroglobulin with an intact thyroid does not provide the same node-local information as needle washout."
        ],
        [
          "Fluid-center FNA for cytology; thyroglobulin in serum",
          "This pairs the lower-yield cellular target with a systemic measurement rather than the node-local adjunct."
        ]
      ],
      "explanation": "The specimen and imaging must be reconciled. Macrophages and protein do not establish the nature of a suspicious solid rim in a cystic node. Target that component for cytology. Thyroglobulin in needle washout is a node-local adjunct, whereas serum thyroglobulin in a patient with an intact thyroid is not a node-localizing substitute. Neither a washout value nor a cystic appearance independently establishes the full surgical stage.",
      "claims": [
        "claim.dtc.preop-ultrasound",
        "claim.qq20261102a.papillary-cytology-regional-survey",
        "claim.qq20261102a.papillary-cytology-pattern",
        "claim.qq20261102c.thyroid-cystic-node-discordance",
        "claim.qq20261102d.node-washout-versus-serum"
      ],
      "services": [
        "service.thyroid_fna",
        "service.thyroid_fna",
        "service.thyroid_fna",
        "service.thyroid_fna"
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        }
      ],
      "steps": [
        "Infer papillary thyroid origin from the retained primary cytology and recognize the cellular limitation of the cystic aspirate.",
        "Choose both the representative nodal target and the node-local marker matrix."
      ],
      "decisive": "Suspicious solid-rim findings coexist with macrophage/protein-only cytology; an intact thyroid makes a systemic thyroglobulin result different from a node-local sample.",
      "closest": "Correct the needle target but order serum thyroglobulin as if it localized the abnormal node.",
      "attack": "All four choices repeat FNA and pair a target with a marker matrix. The key is not uniquely comprehensive; neither component alone identifies it. Removed the missed-pass interpretation and preemptive compartment-completeness sentence.",
      "risk": "Thyroid sign-off must verify targeting and selective washout use, including intact-thyroid limits. The existing FNA service display scope remains a manager issue; no new service or assay cutoff is invented.",
      "change": "Explicitly target the solid rim and cross two credible errors (fluid-only target and serum-versus-washout matrix); remove the named targeting omission and repeat-map foil.",
      "responses": {
        "cues": [
          "Removed the sentence explicitly stating that the solid rim was missed; raw aspirate contents now have to be compared with the node image.",
          "Removed the compartment-completeness statement and the repeat-mapping alternative it pre-eliminated.",
          "Every option now obtains FNA and a thyroglobulin measurement; the target/matrix pair determines the key."
        ],
        "fairness": [
          "Retained cystic-fluid cytology discordant with the rim and the intact-thyroid limitation; no washout-alone diagnosis is asserted.",
          "The key now explicitly says solid-rim FNA. The inherited 12-mm observation is unchanged and is not taught as a new cutoff.",
          "Four comparable sampling/assay plans replace acceptance of inadequate cytology or a repeat of an already-completed scan."
        ],
        "suggestions": [
          "The key names the solid component rather than an unspecified repeat.",
          "Parallel target/matrix choices require both specimen and marker interpretation without adding option-specific negatives to the case."
        ]
      }
    }
  ],
  [
    "B11-context",
    {
      "update": "The outside tangential specimen diagram marks the flat peripheral area. Sections show atypical melanocytes along the epidermal junction with only a thin strip of papillary dermis beneath them. The central raised focus remains on examination.",
      "task": "Which specimen plan should be arranged next for {patientName}'s residual lesion?",
      "options": [
        [
          "Full-thickness excisional biopsy",
          "A complete diagnostic specimen can represent the remaining heterogeneous lesion and establish its depth before the definitive primary-site and nodal plan."
        ],
        [
          "Full-thickness incisional biopsy of the raised focus",
          "This is a real targeted diagnostic alternative when complete excision would be impractical, but it leaves part of this readily removable heterogeneous lesion unassessed."
        ],
        [
          "Deeper sections and immunostains of the existing block",
          "Additional pathology can clarify tissue that was submitted; it cannot characterize a residual component absent from that block."
        ]
      ],
      "explanation": "Match the specimen's actual extent to the residual lesion before final primary-site and nodal planning. Full-thickness complete diagnostic sampling is preferred when it can encompass the lesion without a major reconstructive procedure. A targeted incisional sample is a real alternative when complete removal is impractical, but further levels of an existing block cannot create tissue that was never submitted.",
      "claims": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "services": [
        "service.skin_excisional_biopsy",
        null,
        null
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pathology_review"
        }
      ],
      "steps": [
        "Compare the site and depth actually represented in the junctional fragment with the remaining raised component.",
        "Choose complete diagnostic sampling over a still-partial target or additional work on the old block, using the retained closure feasibility."
      ],
      "decisive": "The raised component is still present, the block represents the flat periphery, and the retained examination makes complete diagnostic removal feasible.",
      "closest": "Obtain a full-thickness incisional sample from the raised focus to establish depth while leaving the remainder.",
      "attack": "Delete both the unreliable-thickness conclusion and ambiguous junctional/deep-edge wording. The key competes with genuine diagnostic alternatives rather than operations knowingly based on discredited pathology. The neutral specimen task and option wording remove the key-only 'diagnostic' echo found during the final packet audit.",
      "risk": "Dermatopathology must verify the synthetic tissue description and completion plan. The passed shared presentation, including closure feasibility, is frozen; it is not removable in this round.",
      "change": "Clarify the tangential specimen anatomy; remove supplied inadequacy and compare three diagnostic-completion strategies.",
      "responses": {
        "cues": [
          "Removed the interpretation about reliable maximum thickness; only submitted site, tissue depth and residual focus remain.",
          "Closure feasibility is in the shared passed presentation and is frozen. It now distinguishes complete from targeted partial diagnostic sampling, rather than merely reinforcing diagnosis versus treatment.",
          "Removed both 'using the current specimen report' distractors; all choices are diagnostic plans."
        ],
        "fairness": [
          "Clarified that junctional atypia lies over a thin papillary-dermal strip, without claiming that junctional atypia itself is invasive tumor at the deep cut surface.",
          "Targeted full-thickness sampling and further pathology are real alternatives. The choice turns on lesion extent and representativeness rather than an explicit unreliable-report label."
        ],
        "suggestions": [
          "Specified sampled location and depth, removed the maximum-thickness conclusion and the ambiguous deep-edge claim. The task/key-only diagnostic-word match is also removed.",
          "Added a credible targeted diagnostic alternative and a block-review alternative; dermatopathology confirmation remains required."
        ]
      }
    }
  ],
  [
    "B12-context",
    {
      "update": "The outside punch diagram marks the pale peripheral area. Sections show a nevus in that fragment. The residual pigmented area has an irregular center extending beyond the punch site.",
      "task": "Which specimen plan should be arranged next for {patientName}'s residual lesion?",
      "options": [
        [
          "Full-thickness excisional biopsy",
          "A complete diagnostic specimen can represent the remaining heterogeneous lesion and establish its depth before the definitive primary-site and nodal plan."
        ],
        [
          "Full-thickness incisional biopsy of the pigmented center",
          "A targeted incisional specimen can be useful when total diagnostic excision is impractical, but the retained anatomy permits complete sampling of this heterogeneous residual lesion."
        ],
        [
          "Deeper sections and immunostains of the existing block",
          "Additional pathology can clarify tissue that was submitted; it cannot characterize a residual component absent from that block."
        ]
      ],
      "explanation": "Match the specimen's actual extent to the residual lesion before final primary-site and nodal planning. Full-thickness complete diagnostic sampling is preferred when it can encompass the lesion without a major reconstructive procedure. A targeted incisional sample is a real alternative when complete removal is impractical, but further levels of an existing block cannot create tissue that was never submitted.",
      "claims": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "services": [
        "service.skin_excisional_biopsy",
        null,
        null
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pathology_review"
        }
      ],
      "steps": [
        "Avoid extending a peripheral nevus result to the whole irregular residual lesion.",
        "Choose a specimen that resolves the heterogeneous residual lesion rather than another partial fragment or more sections of the benign peripheral block."
      ],
      "decisive": "A benign peripheral fragment does not represent the entire residual irregular lesion, which the retained examination says is accessible to complete removal.",
      "closest": "Take another punch from the center as a less extensive diagnostic completion.",
      "attack": "Remove the meeting sentence and the authored 'different pattern' conclusion. The alternatives are actual diagnostic strategies, with feasibility and lesion extent determining the preference. The neutral specimen task and option wording remove the key-only 'diagnostic' echo found during the final packet audit.",
      "risk": "Complete versus partial sampling needs dermatopathology/surgical review. No lesion-size threshold, margin width or automatic nodal procedure is authored.",
      "change": "Remove bare clinician/pathologist agreement, describe the actual specimen map, and compare complete excision with targeted sampling or block review.",
      "responses": {
        "cues": [
          "Removed the sentence announcing a changing, differently patterned unsampled center; retain the actual peripheral biopsy map and residual extent.",
          "Retain frozen closure feasibility because the passed companion uses that presentation; the targeted central diagnostic alternative is now genuine rather than a wrong-site sample."
        ],
        "fairness": [
          "No unreported conclusion from a clinician/pathologist meeting is invoked. Actual site/extent and accessibility support complete diagnostic excision.",
          "Changed the decision from benign-versus-worry recognition to the sampling strategy, with a realistic central incisional alternative and block review."
        ],
        "suggestions": [
          "Deleted the uninformative meeting sentence. The task/key-only diagnostic-word match is also removed.",
          "Preserved anatomy and compared complete with correctly targeted partial sampling; no basic exception or new staging threshold is claimed."
        ]
      }
    }
  ],
  [
    "B17-context",
    {
      "update": "The outside punch diagram marks a flat peripheral portion. The fragment contains melanoma within the epidermis, with dermis present beneath that sampled portion. The raised focus remains in the residual pigmented lesion.",
      "task": "Which specimen plan should be arranged next for {patientName}'s residual lesion?",
      "options": [
        [
          "Full-thickness excisional biopsy",
          "A complete diagnostic specimen can represent the remaining heterogeneous lesion and establish its depth before the definitive primary-site and nodal plan."
        ],
        [
          "Full-thickness incisional biopsy of the raised focus",
          "This is a real targeted diagnostic alternative when complete excision would be impractical, but it leaves part of this readily removable heterogeneous lesion unassessed."
        ],
        [
          "Deeper sections and immunostains of the existing block",
          "Additional pathology can clarify tissue that was submitted; it cannot characterize a residual component absent from that block."
        ]
      ],
      "explanation": "Match the specimen's actual extent to the residual lesion before final primary-site and nodal planning. Full-thickness complete diagnostic sampling is preferred when it can encompass the lesion without a major reconstructive procedure. A targeted incisional sample is a real alternative when complete removal is impractical, but further levels of an existing block cannot create tissue that was never submitted.",
      "claims": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "services": [
        "service.skin_excisional_biopsy",
        null,
        null
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pathology_review"
        }
      ],
      "steps": [
        "Limit the epidermal-only finding to the component actually represented rather than assign depth to the remaining raised focus.",
        "Select complete diagnostic sampling before choosing a definitive primary-site and nodal plan."
      ],
      "decisive": "The in-situ finding is from a peripheral fragment; the accessible residual lesion still includes a raised component.",
      "closest": "Target only the raised component with an incisional biopsy because the peripheral fragment already establishes melanoma in situ there.",
      "attack": "Replace both definitive-treatment extremes with actual completion strategies. No option announces use of an in-situ or invasive plan without representative tissue. The neutral specimen task and option wording remove the key-only 'diagnostic' echo found during the final packet audit.",
      "risk": "Melanoma/dermatopathology review must confirm completion strategy; frozen presentation and downstream fields remain exact.",
      "change": "Remove the explicit unsampled-surface and no-definitive-excision reminders; compare diagnostic strategies rather than two staged operations.",
      "responses": {
        "cues": [
          "Removed the explicit 'surface not included' sentence; use the peripheral punch map and actual epidermal-only finding beside the residual raised focus.",
          "Removed the in-situ-margin operation option.",
          "Removed the invasive-plan operation option; all choices now concern diagnostic completion."
        ],
        "fairness": [
          "Keep intact accessible residual tissue and the location represented by the fragment.",
          "A targeted diagnostic specimen is now a credible near miss; neither distractor knowingly commits to an unsupported definitive stage."
        ],
        "suggestions": [
          "Compare complete excision, targeted incisional sampling and further review of the old block. The task/key-only diagnostic-word match is also removed.",
          "The distinction is whether the chosen method represents the whole heterogeneous residual lesion when complete removal is feasible, under the retained ESMO sampling claim."
        ]
      }
    }
  ],
  [
    "B18-context",
    {
      "update": "The outside shave contains invasive atypical melanocytes at the deep cut surface. The reported distance from the granular layer to that cut surface is 0.6 mm. A firm focus remains within the residual lesion.",
      "task": "Which specimen plan should be arranged next for {patientName}'s residual lesion?",
      "options": [
        [
          "Full-thickness excisional biopsy",
          "A complete diagnostic specimen can represent the remaining heterogeneous lesion and establish its depth before the definitive primary-site and nodal plan."
        ],
        [
          "Full-thickness incisional biopsy of the firm focus",
          "This targets the appropriate residual component, but a partial specimen still leaves this accessible heterogeneous lesion incompletely represented."
        ],
        [
          "Deeper sections and immunostains of the existing block",
          "Additional pathology can clarify tissue that was submitted; it cannot characterize a residual component absent from that block."
        ]
      ],
      "explanation": "Match the specimen's actual extent to the residual lesion before final primary-site and nodal planning. Full-thickness complete diagnostic sampling is preferred when it can encompass the lesion without a major reconstructive procedure. A targeted incisional sample is a real alternative when complete removal is impractical, but further levels of an existing block cannot create tissue that was never submitted.",
      "claims": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "services": [
        "service.skin_excisional_biopsy",
        null,
        null
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pathology_review"
        }
      ],
      "steps": [
        "Interpret tumor at the specimen's deep cut surface as a limit of that specimen, rather than the complete lesion depth.",
        "Choose diagnostic completion that encompasses the residual lesion instead of a further partial target or deeper levels of a truncated specimen."
      ],
      "decisive": "Tumor reaches the cut base and a residual firm focus remains; complete diagnostic removal is feasible in the frozen presentation.",
      "closest": "Repeat a correctly targeted deep incisional sample rather than complete diagnostic removal.",
      "attack": "Remove the supplied unmeasurable-depth conclusion and the self-incriminating minimum-depth or adjacent-flat-area options. The 0.6-mm observation is retained solely as a specimen measurement, not a stage cutoff. The neutral specimen task and option wording remove the key-only 'diagnostic' echo found during the final packet audit.",
      "risk": "Clinicians must confirm the microstaging and completion interpretation. No definitive margin or sentinel threshold is introduced; downstream exact passed node fields remain untouched.",
      "change": "Present the raw transected-base measurement; replace wrong-target and knowingly underestimated operations with diagnostic completion alternatives.",
      "responses": {
        "cues": [
          "Removed the interpretation that deeper tumor is unmeasurable; report only the cut-surface measurement and tumor at that surface.",
          "Removed the option admitting use of minimum depth for definitive planning.",
          "Replace adjacent-flat-area sampling with a genuinely targeted full-thickness incisional specimen."
        ],
        "fairness": [
          "Retain deep-margin tumor and residual focus; the 0.6-mm observation is unchanged and is not represented as final depth.",
          "Both distractors are diagnostic alternatives, without a clause explaining their errors before the answer."
        ],
        "suggestions": [
          "Use the firm focus as the real partial-sampling competitor; remove the self-incriminating minimum-depth wording. The task/key-only diagnostic-word match is also removed.",
          "The residual extent plus readily achievable full-thickness removal distinguishes the key under the existing sampling claim; exact technique needs clinical confirmation."
        ]
      }
    }
  ],
  [
    "B15-context",
    {
      "update": "Abdominal and pelvic MRI includes the liver, mesentery and pelvic nodal stations with contrast-enhanced sequences. A separate cardiac CT runs from below the carina to the diaphragm and shows a small solid nodule near its cranial edge. The receiving center can obtain chest CT, chest radiography or FDG PET/CT.",
      "task": "Which examination should complete {patientName}'s pretreatment imaging assessment?",
      "options": [
        [
          "Chest CT with thin-section inspiratory lung acquisitions",
          "This provides a full diagnostic lung examination beyond the cardiac field while retaining adequate abdominal/pelvic MRI rather than repeating it."
        ],
        [
          "FDG PET/CT with a low-dose free-breathing CT acquisition",
          "This is a real staging modality, but its metabolic result and low-dose free-breathing CT do not replace the indicated diagnostic chest acquisition."
        ],
        [
          "Chest radiography with posteroanterior and lateral acquisitions",
          "A normal radiograph would not supply equivalent cross-sectional assessment of the lungs or of the partly imaged solid nodule."
        ]
      ],
      "explanation": "Interpret what each prior and proposed acquisition can establish. Adequate abdominal/pelvic MRI can be retained, while the cardiac CT has not supplied a diagnostic examination of the lungs. Obtain the chest CT acquisition; routine PET with low-dose free-breathing CT or radiographs are not interchangeable substitutes. No nodule-size threshold or automatic metastatic diagnosis is inferred.",
      "claims": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging",
        "claim.qq20261102b.colon-staging-coverage",
        "claim.qq20261102b.colon-pet-not-routine-substitute",
        "claim.qq20261102c.colon-adequate-regions-and-chest-ct"
      ],
      "services": [
        "service.ct",
        null,
        null
      ],
      "difficulty": "moderate",
      "timing": [
        {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.pet_ct"
        },
        {
          "kind": "test",
          "timingProfileId": "timing.test.radiography"
        }
      ],
      "steps": [
        "Distinguish a cardiac field from a diagnostic lung examination while retaining adequate imaging of the other regions.",
        "Choose an acquisition that evaluates the partly imaged pulmonary finding rather than rely on metabolic or projection imaging."
      ],
      "decisive": "The current lung finding lies at the edge of a cardiac acquisition; PET's low-dose free-breathing CT and radiography do not provide the same lung assessment.",
      "closest": "Use PET/CT as if any CT component also completed diagnostic pulmonary staging.",
      "attack": "Remove the redundant absence sentence and vague 'whole-chest' repair. All choices specify real acquisition protocols, and the PET option no longer calls itself merely localization.",
      "risk": "Radiology/oncology must confirm protocol adequacy. No invented size cutoff, PET sensitivity figure or need to repeat already adequate abdominal/pelvic imaging.",
      "change": "Replace missing-region matching with a diagnostic lung versus low-dose PET/CT protocol comparison; delete redundant coverage and operator-quality labels.",
      "responses": {
        "cues": [
          "Deleted 'No upper-lung images were acquired'; retain only the actual acquisition bounds.",
          "All choices now specify acquisition conditions. The key is not uniquely 'whole' versus an option disparaged as 'merely localization'."
        ],
        "fairness": [
          "Retained adequate MRI of other regions and the actual cardiac-field nodule without an invented size threshold.",
          "The comparison now requires recognizing that a PET/CT CT component and a diagnostic inspiratory lung acquisition are not interchangeable; the nodule is a clinical reason to evaluate that region, not a taught stage."
        ],
        "suggestions": [
          "Deleted the named missing-region sentence and replaced shorthand labels with three real protocols.",
          "Use acquisition adequacy as the discriminator; the existing staging/PET claims bound the comparison without a new cutoff."
        ]
      }
    }
  ],
  [
    "B19-context",
    {
      "update": "The top axial slice of the outside MRI still passes through the thigh mass. The included portion has solid enhancing regions. The palpable proximal extent continues beyond that slice.",
      "task": "Which imaging plan should precede {patientName}'s biopsy?",
      "options": [
        [
          "Local MRI encompassing the lesion and compartment relationships",
          "Complete local extent and anatomical relationships are needed for biopsy planning, beyond a viable-looking piece at the acquired edge."
        ],
        [
          "Targeted ultrasound of the palpable region for core-biopsy planning",
          "A visible superficial target may be sampled under ultrasound, but this does not replace local characterization of the deep lesion and its full relationships."
        ],
        [
          "FDG PET/CT with targeting of the most avid region",
          "Metabolic activity can suggest a target, but does not replace the local anatomical assessment required before a planned biopsy."
        ]
      ],
      "explanation": "A visible enhancing target is not the same as a complete local plan for a deep mass. MRI should encompass the lesion and relevant anatomical relationships before biopsy planning. Ultrasound targeting or metabolic uptake can be useful in selected circumstances, but neither makes the cropped local examination sufficient. The required field is defined by the lesion, not a universal whole-limb rule.",
      "claims": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging",
        "claim.qq20261102c.sarcoma-mri-coverage-and-target"
      ],
      "services": [
        "service.extremity_mri",
        "service.ultrasound",
        "service.imaging.pet-ct"
      ],
      "difficulty": "moderate",
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
          "kind": "test",
          "timingProfileId": "timing.test.pet_ct"
        }
      ],
      "steps": [
        "Recognize that an apparently viable sampled region does not establish the mass's full local extent.",
        "Choose local anatomical characterization before committing to a target based only on accessibility or uptake."
      ],
      "decisive": "The deep lesion continues through the edge of the local study despite an enhancing accessible portion.",
      "closest": "Proceed with ultrasound targeting of the accessible enhancing portion because a tissue target already seems available.",
      "attack": "Delete the 'knee examination' label and repeated neurovascular omission. Replace another knee MRI with a plausible ultrasound target-planning path; no universal whole-thigh mandate.",
      "risk": "MSK review must confirm lesion-specific coverage and prebiopsy planning. No route is chosen here and no earlier feedback gives away the passed later tract choice.",
      "change": "Use one coverage observation and compare anatomical characterization with genuinely plausible target-directed imaging strategies.",
      "responses": {
        "cues": [
          "Removed the wrong-scope 'knee' order label.",
          "Use a single edge-of-field observation; the repeat-knee alternative is replaced with ultrasound target planning.",
          "Removed the additional full-mass/neurovascular omission list."
        ],
        "fairness": [
          "The MRI field is lesion-defined, not an entire-limb mandate; the deep lesion remains incompletely characterized.",
          "A viable accessible piece now competes with anatomical completion, so the choice goes beyond selecting a bigger picture over a knowingly wrong repeat."
        ],
        "suggestions": [
          "Retain one clear coverage observation and add credible ultrasound/PET target-planning alternatives.",
          "The missing full local extent affects whether an accessible target alone suffices. The later tract/compartment answer is not supplied here."
        ]
      }
    }
  ],
  [
    "B20-context",
    {
      "update": "The acquisition log records T1 and fluid-sensitive upper-arm series and no administered contrast. Several internal regions have similarly bright signal on the fluid-sensitive images.",
      "task": "Which acquisition should guide selection of {patientName}'s biopsy target?",
      "options": [
        [
          "MRI before and after contrast to map internal enhancement",
          "Enhancement can help distinguish viable tissue for targeting when fluid-sensitive brightness does not establish which regions are solid."
        ],
        [
          "Higher-resolution fluid-sensitive MRI to map internal signal",
          "More spatial detail in the same fluid-sensitive appearance does not itself establish viability of similarly bright regions."
        ],
        [
          "FDG PET/CT to map internal metabolic uptake",
          "Metabolic targeting can be useful selectively, but is not the initial local MRI acquisition used here to distinguish internal viable tissue before planned biopsy."
        ]
      ],
      "explanation": "The administration log establishes that post-contrast data were not merely omitted from an export. When fluid-sensitive signal does not distinguish internal components, contrast-enhanced local MRI can help identify viable tissue for representative targeting. Increasing resolution of the same signal contrast or substituting a metabolic study answers a different planning question. No signal threshold or contrast dose is taught.",
      "claims": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging",
        "claim.qq20261102c.sarcoma-mri-coverage-and-target",
        "claim.qq20261102c.sarcoma-enhancement-biopsy-target"
      ],
      "services": [
        "service.extremity_mri",
        "service.extremity_mri",
        "service.imaging.pet-ct"
      ],
      "difficulty": "moderate",
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
      "steps": [
        "Distinguish an acquisition that lacks contrast from a missing export, and avoid equating fluid-sensitive brightness with viable tumor.",
        "Choose an acquisition capable of mapping enhancement for representative local targeting."
      ],
      "decisive": "Contrast was not administered, and similar fluid-sensitive signal does not distinguish the candidate internal regions.",
      "closest": "Increase resolution of the fluid-sensitive study because the bright internal region appears easiest to target.",
      "attack": "No absent-export ambiguity or redundant full-arm reassurance. Alternatives are actual acquisition strategies for the same target-planning stage, rather than only the key repairing a list of missing coverage.",
      "risk": "Radiologist must confirm enhancement/target interpretation and contrast suitability; no dose, universal signal criterion or quantitative viability threshold is introduced.",
      "change": "Resolve actual acquisition status and test interpretation of internal signal rather than missing-file matching.",
      "responses": {
        "cues": [
          "Replace export wording with the actual acquisition/administration log; the absence is an acquisition fact rather than a named missing file.",
          "Remove full-coverage reassurance and the full-arm distractor; compare methods for internal target mapping."
        ],
        "fairness": [
          "Use the existing enhancement/viable-target claim and retain uncertainty from fluid-sensitive signal.",
          "The log explicitly records no administered contrast. There is no unstated existing series to retrieve, so retrieval is not silently bypassed.",
          "The alternatives are real target-mapping strategies; a high-resolution repeat is plausible but does not resolve tissue viability from signal alone."
        ],
        "suggestions": [
          "State actual administration status rather than assume absent export means absent acquisition.",
          "The raw acquisition log and internal signal observations determine the target-information gap; the pre-answer radiologist interpretation was removed."
        ]
      }
    }
  ],
  [
    "B21-context",
    {
      "update": "A previous forceps specimen is reported as normal colonic mucosa. The submitted tissue contains colonic crypts and lamina propria; no fat or submucosal tissue is identified.",
      "task": "Which paired conclusion should be recorded about {patientName}'s lesion and the outside specimen?",
      "options": [
        [
          "Submucosal fatty lesion; histologic confirmation not obtained",
          "The integrated appearance supports a fatty submucosal lesion, while surface-only tissue does not provide histological confirmation of that lesion."
        ],
        [
          "Submucosal fatty lesion; histologic confirmation obtained",
          "The clinical characterization fits, but the submitted mucosal tissue does not represent the submucosal lesion."
        ],
        [
          "Mucosal epithelial lesion; histologic confirmation not obtained",
          "The tissue is nonrepresentative, but the lesion's wall layer, echogenicity and deformability do not place it in a mucosal epithelial category."
        ],
        [
          "Mucosal epithelial lesion; histologic confirmation obtained",
          "This transfers both the specimen tissue category and its benign wording to a mass arising in a different wall layer."
        ]
      ],
      "explanation": "Separate the integrated clinical characterization from tissue proof. The wall layer, echogenicity and deformability support a fatty submucosal lesion; crypts and lamina propria without submucosal fat do not provide histologic confirmation of that lesion. A clinically clear diagnosis and a representative biopsy are different evidence claims.",
      "claims": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.qq20261102a.subepithelial-integrated-pattern",
        "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
        "claim.qq20261102d.lipoma-histology-provenance"
      ],
      "services": [
        null,
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "concept": {
        "id": "concept.colonic-lipoma.endoscopic-recognition.v3",
        "displayName": "Distinguish clinical characterization from histologic confirmation",
        "objective": "Use the EUS-defined lesion layer and the actual submitted tissue to document whether a clinically characterized fatty submucosal lesion has histologic confirmation, without equating that status with a need for another biopsy.",
        "reason": "The scored task changes from selecting further tissue intervention to adjudicating two evidence-status claims. Preserve the older recognition and tissue-planning constructs and their histories; the passed no-follow-up companion is unchanged."
      },
      "steps": [
        "Interpret the wall layer and endoscopic/EUS phenotype rather than assign the mucosal biopsy's tissue category to the lesion.",
        "Compare the actual specimen constituents with that lesion layer to adjudicate histologic confirmation."
      ],
      "decisive": "The lesion is in the third wall layer, but the submitted fragments contain only mucosal constituents.",
      "closest": "Document histologic confirmation because the pathology report says benign and the clinical phenotype also looks benign.",
      "attack": "The tissue result now determines the second scored conclusion; deleting it makes that conclusion impossible to choose. No no-intervention versus two invasive choices remain, and the exact passed companion is not taught in this feedback.",
      "risk": "Endoscopy/pathology must confirm both tissue-layer interpretations. The clinical phenotype and no-follow-up companion are frozen; no atypical lesion feature or new biopsy indication is introduced.",
      "change": "Replace the duplicate no-biopsy decision with lesion-versus-specimen evidence adjudication; remove the 'above' pointer and explicitly version the changed objective.",
      "responses": {
        "cues": [
          "Removed the directive pointing to the observations 'above'.",
          "Removed the no-intervention versus invasive-options structure. All choices are paired diagnostic/evidence-status interpretations."
        ],
        "fairness": [
          "The current phenotype may support the clinical diagnosis, but a surface-only specimen does not prove its histology; the two claims are separately scored.",
          "The update now changes the answer: without the actual specimen constituents, histologic confirmation cannot be adjudicated. The task no longer asks the same biopsy-need rule.",
          "Created an explicit v3 construct and retained the old v2 and its history. No rejected basic label or atypical shared feature was introduced."
        ],
        "suggestions": [
          "Deleted the teaching pointer and made specimen evidence necessary to the paired conclusion.",
          "Changed the scored context objective, preserved the passed companion's exact premise and fields, and avoided teaching that companion's management answer beforehand."
        ]
      },
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ]
    }
  ],
  [
    "B22-context",
    {
      "update": "The outside report labels a bite-on-bite specimen benign. Its levels contain colonic epithelium, crypts and lamina propria; no fat or submucosal tissue is identified in the submitted fragments.",
      "task": "Which paired conclusion should be recorded about {patientName}'s lesion and the outside specimen?",
      "options": [
        [
          "Submucosal fatty lesion; histologic confirmation not obtained",
          "The integrated appearance supports a fatty submucosal lesion, while surface-only tissue does not provide histological confirmation of that lesion."
        ],
        [
          "Submucosal fatty lesion; histologic confirmation obtained",
          "The clinical characterization fits, but the submitted mucosal tissue does not represent the submucosal lesion."
        ],
        [
          "Mucosal epithelial lesion; histologic confirmation not obtained",
          "The tissue is nonrepresentative, but the lesion's wall layer, echogenicity and deformability do not place it in a mucosal epithelial category."
        ],
        [
          "Mucosal epithelial lesion; histologic confirmation obtained",
          "This transfers both the specimen tissue category and its benign wording to a mass arising in a different wall layer."
        ]
      ],
      "explanation": "Separate the integrated clinical characterization from tissue proof. The wall layer, echogenicity and deformability support a fatty submucosal lesion; crypts and lamina propria without submucosal fat do not provide histologic confirmation of that lesion. A clinically clear diagnosis and a representative biopsy are different evidence claims.",
      "claims": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.qq20261102a.subepithelial-integrated-pattern",
        "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
        "claim.qq20261102d.lipoma-histology-provenance"
      ],
      "services": [
        null,
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "concept": {
        "id": "concept.colonic-lipoma.endoscopic-recognition.v3",
        "displayName": "Distinguish clinical characterization from histologic confirmation",
        "objective": "Use the EUS-defined lesion layer and the actual submitted tissue to document whether a clinically characterized fatty submucosal lesion has histologic confirmation, without equating that status with a need for another biopsy.",
        "reason": "The scored task changes from selecting further tissue intervention to adjudicating two evidence-status claims. Preserve the older recognition and tissue-planning constructs and their histories; the passed no-follow-up companion is unchanged."
      },
      "steps": [
        "Interpret the wall layer and endoscopic/EUS phenotype rather than assign the mucosal biopsy's tissue category to the lesion.",
        "Compare the actual specimen constituents with that lesion layer to adjudicate histologic confirmation."
      ],
      "decisive": "The lesion is in the third wall layer, but the submitted fragments contain only mucosal constituents.",
      "closest": "Document histologic confirmation because the pathology report says benign and the clinical phenotype also looks benign.",
      "attack": "The tissue result now determines the second scored conclusion; deleting it makes that conclusion impossible to choose. No no-intervention versus two invasive choices remain, and the exact passed companion is not taught in this feedback.",
      "risk": "Endoscopy/pathology must confirm both tissue-layer interpretations. The clinical phenotype and no-follow-up companion are frozen; no atypical lesion feature or new biopsy indication is introduced.",
      "change": "Replace the duplicate no-biopsy decision with lesion-versus-specimen evidence adjudication; remove the 'above' pointer and explicitly version the changed objective.",
      "responses": {
        "cues": [
          "Removed the directive pointing to the observations 'above'.",
          "Removed the no-intervention versus invasive-options structure. All choices are paired diagnostic/evidence-status interpretations."
        ],
        "fairness": [
          "The current phenotype may support the clinical diagnosis, but a surface-only specimen does not prove its histology; the two claims are separately scored.",
          "The update now changes the answer: without the actual specimen constituents, histologic confirmation cannot be adjudicated. The task no longer asks the same biopsy-need rule.",
          "Created an explicit v3 construct and retained the old v2 and its history. No rejected basic label or atypical shared feature was introduced."
        ],
        "suggestions": [
          "Deleted the teaching pointer and made specimen evidence necessary to the paired conclusion.",
          "Changed the scored context objective, preserved the passed companion's exact premise and fields, and avoided teaching that companion's management answer beforehand."
        ]
      },
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ]
    }
  ],
  [
    "B24",
    {
      "update": "The biopsy container identifies one antral site. Mucosa remains in the submitted block for further sections.",
      "task": "Which conclusion and histology-review goal are supported by {patientName}'s current findings?",
      "options": [
        [
          "Clonal B-cell infiltrate; assess cytology and architecture",
          "The clone is demonstrated, but lineage/clonality alone do not establish MALT lymphoma from the limited architecture shown."
        ],
        [
          "Clonal B-cell infiltrate, MALT type; assess large-cell component",
          "This assigns the specific lymphoma diagnosis before its morphological basis is established; preserved glands do not themselves prove or exclude it."
        ],
        [
          "Clonal B-cell infiltrate, reactive type; assess Helicobacter activity",
          "The limited preserved-gland sample does not establish reactive status merely because classic destructive architecture is not shown."
        ]
      ],
      "explanation": "A demonstrated B-cell clone is an evidence finding, not automatically a specific lymphoma diagnosis. Morphological review must assess the infiltrate's cytology and architecture in context. Preserved epithelium in this limited site neither excludes MALT nor establishes reactive gastritis. This does not uniquely rank repeat endoscopy, further sections and molecular studies for every such case.",
      "claims": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-lineage-not-classification",
        "claim.qq20261102b.gastric-clone-not-diagnosis",
        "claim.qq20261102b.gastric-uncertainty-repeat-biopsy",
        "claim.qq20261102c.gastric-clonality-classification-boundary"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "steps": [
        "Separate evidence for a B-cell clone from evidence establishing a particular neoplasm.",
        "Set the morphological classification goal without treating preserved glands as exclusion or clonality as a subtype diagnosis."
      ],
      "decisive": "Clonality is established, but the limited tissue has not supplied a specific lymphoma morphology or an established reactive explanation.",
      "closest": "Assign MALT lymphoma because a B-cell clone is demonstrated in a gastric biopsy.",
      "attack": "All three options assert a positive interpretation and a specific review goal. None is a generic safest-workup escape or announces that assessment will end. Every interpretation shares 'Clonal B-cell infiltrate'; the repeated stem phrase cannot identify the key. The distinction is what additional classification the current morphology supports.",
      "risk": "Hematopathology must determine the actual classification workup. Lymphoepithelial lesions are not falsely made universally necessary; no unproved procedure hierarchy.",
      "change": "Replace cautious-versus-definitive tone with parallel interpretation/review-goal pairs; delete 'end the assessment' and vague correlated-workup phrasing.",
      "responses": {
        "cues": [
          "Replaced broad 'keep open/correlated assessment' with the positive finding (clone) and concrete morphological classification goal. All three interpretations now share the observed clonal B-cell finding, removing the unique stem/key phrase.",
          "Removed 'end the lymphoma assessment'; reactive interpretation now has its own comparable histology-review goal."
        ],
        "fairness": [
          "Preserved the distinction between clonality, gland morphology and a specific lymphoma diagnosis without making either fact dispositive alone.",
          "Every choice now has an interpretation plus a review goal at comparable confidence/scope; there is no generic cautious care option.",
          "Block availability is retained for morphological review, not used to assert a unique biopsy-versus-molecular-testing order."
        ],
        "suggestions": [
          "Use parallel conclusion/review-goal pairs rather than definitive treatment versus an open-ended workup.",
          "Name the classification assessment goal while preserving limited architecture and clonality; do not require a universal destructive-gland criterion."
        ]
      },
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
      ]
    }
  ],
  [
    "B26",
    {
      "update": null,
      "task": "Which target-benefit conclusion and next study plan should {patientName}'s team report?",
      "options": [
        [
          "Target unresolved; plan a precision-focused efficacy study",
          "The interval admits target-sized benefit as well as no benefit/harm. The target is unresolved despite a nonsignificant null test."
        ],
        [
          "Target excluded; plan an alternative-intervention efficacy study",
          "This treats nonsignificance as exclusion of the target-sized effects still in the interval."
        ],
        [
          "Target confirmed; plan an implementation-feasibility study",
          "This treats a favorable point estimate as satisfying the whole-interval target criterion."
        ]
      ],
      "explanation": "At the supplied two-sided threshold the null is not rejected. The interval contains effects meeting the target and effects failing it, so neither target confirmation nor target exclusion follows. A more precise efficacy estimate may resolve that uncertainty. Nonsignificance does not establish equivalence or futility, and the point estimate does not meet a whole-interval confirmation rule by itself.",
      "claims": [
        "claim.gs028se.statistics.p-value",
        "claim.qq20261102a.null-test-versus-protocol-magnitude",
        "claim.qq20261102b.specified-interval-decision-rule",
        "claim.qq20261102c.uncertain-target-benefit-not-excluded"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "steps": [
        "Read the null-test result using the explicitly hypothetical threshold.",
        "Compare the entire uncertainty interval with the hypothetical target, then choose the matching next planning decision."
      ],
      "decisive": "The p-value is above the supplied null-test threshold, while the interval spans both the target-sized benefit and zero/harm.",
      "closest": "Read the null test correctly but call the target excluded because the result is nonsignificant.",
      "attack": "All options use the same concise conclusion/plan syntax. No 'by the point estimate', absolute futility, 'stop' or uniquely conditional key. Three natural statuses avoid padded combinations and convergence.",
      "risk": "Statistics review should verify the constructed interval/p-value approximation. No clinical benefit threshold or real treatment-effect assertion is made.",
      "change": "Use parallel target-status/study-plan pairs and move every explanation of the error into feedback.",
      "responses": {
        "cues": [
          "Removed the absolute no-further-study claim; the competing plan now follows a stated target-status judgment.",
          "Removed equivalence-plus-stop rhetoric; three natural target-status judgments replace padded combinations.",
          "The key uses the same declarative status/plan syntax and study-planning scope as both distractors.",
          "Removed 'by the point estimate' and routine-adoption rhetoric; the error must be inferred from the actual interval and protocol."
        ],
        "fairness": [
          "Retained the fictional 4-point target, entire-interval criteria and original constructed estimates; no new numbers or thresholds.",
          "The target-status judgment and corresponding next-study question replace certainty-tone shortcuts; the nonsignificant null result alone cannot establish target exclusion."
        ],
        "suggestions": [
          "Implemented the suggested concise confirmed/excluded/unresolved status and comparable study-plan pairs; explanations are post-answer.",
          "Removed futility/stop wording and unique caution while retaining the explicit hypothetical decision criteria required for fairness."
        ]
      },
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
      ]
    }
  ],
  [
    "B29",
    {
      "update": "The unit-required post-reversal clinical assessment has not yet been completed. The patient's sister can accept handover and provide support at home; she can also accompany him if staff arrange a suitable collection time.",
      "task": "Which discharge arrangement should be booked for George Harris?",
      "options": [
        [
          "Continue recovery; book an adult escort with handover to the sister",
          "Meets the represented recovery and explicit escort/handover requirements."
        ],
        [
          "End recovery now; book an adult escort with handover to the sister",
          "Provides the escort but treats immediate orientation after reversal as the completed recovery assessment."
        ],
        [
          "Continue recovery; book driver-only transport with telephone handover",
          "Addresses recovery but does not supply the accompanying care role defined by this case's protocol."
        ],
        [
          "End recovery now; book driver-only transport with telephone handover",
          "Treats both observed orientation and remote handover as sufficient under a protocol they do not satisfy."
        ]
      ],
      "explanation": "This constructed unit protocol requires documented post-reversal assessment and an accompanying adult who accepts handover. Being oriented and walking does not document completion of the stated assessment. No universal observation duration or ban on a particular transport company is introduced.",
      "claims": [
        "claim.variety3.sedation.no-self-driving",
        "claim.variety3.sedation.adult-collection-support",
        "claim.variety3.sedation.residual-effects",
        "claim.qq20261102a.sedation-supported-discharge",
        "claim.qq20261102a.sedation-after-reversal"
      ],
      "services": [
        null,
        null,
        null,
        null
      ],
      "difficulty": "easy",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed unit discharge protocol for this case; clinical review pending.",
        "items": [
          {
            "label": "Clinical release",
            "value": "Document satisfactory recovery, including assessment after a reversal agent."
          },
          {
            "label": "Travel and home handover",
            "value": "A suitable adult accepts clinical handover, accompanies the patient home and can provide early recovery support. A driver who only drives does not fulfil that care role."
          }
        ]
      },
      "basicRecallIntentional": {
        "justification": "The reviewer accepted this specific unit-protocol onboarding role; the manager now authorizes a fairness repair that supplies the missing recovery-assessment state. No resident-level difficulty is claimed."
      },
      "steps": [
        "Apply the displayed unit protocol to the explicitly incomplete post-reversal assessment.",
        "Arrange accompaniment and handover rather than treat a driver-only booking as that care role."
      ],
      "decisive": "The required assessment is incomplete, and a suitable accompanying adult is feasible.",
      "closest": "End recovery on appearance alone before the required post-reversal assessment is completed.",
      "attack": "This is the specifically accepted basic role, with its missing fairness criterion repaired as directed. It is not represented as a hard resident item or an unchanged independently passed version.",
      "risk": "Clinical sign-off must confirm the constructed protocol and recovery state. No universal interval, dose or institutional policy is asserted.",
      "change": "Apply the prepared missing-recovery-assessment repair, retaining the accepted basic protocol and original options.",
      "responses": {
        "cues": [],
        "fairness": [
          "The manager now explicitly authorizes REVISE over the earlier freeze. Add the missing incomplete post-reversal assessment state; preserve the previous version for frozen encounters.",
          "The awaiting-direction blocker is resolved by the manager's instruction. The repaired version remains a draft awaiting re-review; accepted basic purpose is not clinical approval."
        ],
        "suggestions": [
          "Superseded by the manager's express repair decision: applied the prepared fairness update, retaining the accepted basic role without calling the new version pipeline-passed."
        ]
      },
      "timing": [
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        },
        {
          "kind": "no_test"
        }
      ]
    }
  ],
  [
    "B32",
    {
      "update": "Arterial CT shows a round cavity at the collection edge filling to the same density as the splenic artery, with a narrow connecting channel. The walled collection compresses the posterior stomach. After resuscitation, blood pressure is 118/72 mmHg with pulse 94/min, then 116/70 mmHg with pulse 92/min. The patient is conversing and has not required vasopressors or increasing transfusion support. Angiographic and operative teams are available at the receiving hospital.",
      "task": "Which treatment sequence should be arranged for {patientName}?",
      "options": [
        [
          "Arterial embolization, followed by reassessment for collection drainage",
          "The arterial communication and bleeding require vascular control first; the supplied response and available angiographic care support embolization before reassessing the collection."
        ],
        [
          "Collection drainage, followed by reassessment for arterial embolization",
          "The gastric compression is a real treatment concern, but drainage before control of the communicating arterial source reverses the priority."
        ],
        [
          "Operative arterial control, followed by reassessment for collection drainage",
          "Operative control is a rescue alternative, but the actual sustained response and available angiography do not require bypassing an endovascular approach."
        ]
      ],
      "explanation": "Arterial-phase communication at a bleeding collection changes the sequence: control the arterial source before routine collection drainage. The observed response to resuscitation and available angiographic team support an endovascular-first plan in this scenario. Surgery remains a rescue option when response, access, availability or treatment failure changes the circumstances. The case observations are not universal stability cutoffs.",
      "claims": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage",
        "claim.qq20261102c.pancreatic-arterial-focus-before-drainage"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "hard",
      "steps": [
        "Recognize the arterial communication rather than treat all symptoms as collection compression.",
        "Use the actual response and availability to choose vascular control before reconsidering the collection intervention."
      ],
      "decisive": "The artery communicates with the marginal cavity, while repeated post-resuscitation observations and support requirements permit available angiographic care.",
      "closest": "Choose operative combined treatment because it appears to address both bleeding and gastric compression at once.",
      "attack": "All three labels now have the same reassessment structure. Actual physiology replaces circular reference to unspecified post-resuscitation observations.",
      "risk": "Pancreatic/IR clinicians must verify the synthetic observations, response and availability. No universal blood-pressure cutoff, transfusion dose, time-to-intervention target or ban on surgery is authored.",
      "change": "Supply actual response observations and support trend; balance the option flexibility and specify equal relevant team availability.",
      "responses": {
        "cues": [
          "All three choices now use the same 'followed by reassessment' structure; conditional flexibility is not unique to the key."
        ],
        "fairness": [
          "Retain the arterial-phase communication, bleeding and compression as competing priorities.",
          "Replace the circular comparison with two actual blood-pressure/pulse observations, mentation and non-escalating support. They are fictional observations, not taught thresholds.",
          "Specify available angiographic and operative expertise; preserve surgery as rescue if the clinical course differs."
        ],
        "suggestions": [
          "Supply concrete response and support observations without defining a universal stability cutoff.",
          "State the relevant team availability and reframe the surgical option at equal scope; clinician/IR review of the resulting ranking remains required."
        ]
      },
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
      ]
    }
  ],
  [
    "B36",
    {
      "update": null,
      "task": "Which comparison should {patientName}'s team use for its next PDSA test?",
      "options": [
        [
          "Form workflow versus prefilled fields",
          "The changed burden is concentrated in transfer into the form, so test that adaptation while retaining source agreement and clinical review."
        ],
        [
          "Form workflow versus a reconciliation checklist",
          "This is a plausible efficiency adaptation, but it changes a stage whose recorded time did not increase rather than the observed new entry burden."
        ],
        [
          "Form workflow versus reordered review items",
          "This preserves review but changes a stage whose recorded time did not increase rather than the entry process that gained burden."
        ]
      ],
      "explanation": "The table locates the added workload in transfer into the form, without a recorded improvement in clarification contacts. A limited comparison of current entry with automated entry after reconciliation tests that adaptation; measure time, agreement and contacts rather than assume success. Shortening an unchanged stage does not follow the observed burden as directly. These fictional process observations do not prove a causal effect or mandate one-factor testing in every improvement project.",
      "claims": [
        "claim.gs028se.statistics.pdsa-act",
        "claim.qq20261102a.pdsa-outcome-balancing-adaptation",
        "claim.qq20261102b.pdsa-hypothesis-not-proof",
        "claim.qq20261102c.pdsa-source-specific-next-test",
        "claim.qq20261102c.qi-comparison-input-control"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "presentation": "{patientName} leads an employee quality meeting about a structured visit form. Each workflow includes medication reconciliation, transfer of the reconciled list into the form, and final clinician review. The team is studying repeat medication-clarification contacts and staff time. It can test changes to the interview, form entry or final review while checking agreement with the reconciled list.",
      "exhibit": {
        "kind": "table",
        "caption": "Constructed data from ten visits per process. Time rows are total staff-minutes; the contact row counts contacts arising from those same ten visits.",
        "columnHeaders": [
          "Previous process",
          "Current form"
        ],
        "rowHeaders": [
          "Medication-reconciliation interview",
          "Transfer into the form",
          "Final clinician review",
          "Unplanned medication-clarification contacts"
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
      "steps": [
        "Use the table to locate the new burden and recognize the absence of improvement in the balancing/outcome count.",
        "Select a next-cycle adaptation of that component while retaining agreement and review checks."
      ],
      "decisive": "Only transfer time rises; clarification contacts and the other stage times are unchanged under a coherent ten-visit denominator.",
      "closest": "Shorten the reconciliation interview because it appears to be a substantial task, without identifying which component actually gained burden.",
      "attack": "Every choice starts from the same actual workflow and proposes a plausible efficiency adaptation while retaining review. Neither a named form-work goal, stale records nor deliberately reduced clinical assessment selects the key. Deleting the table removes the discriminator. Every option uses the form-workflow baseline and none uniquely repeats 'form entry'. The workload values must select the component.",
      "risk": "QI review must verify the constructed arithmetic and comparison scope. No efficacy, universal rollout threshold, patient analytics or gameplay correctness data are collected.",
      "change": "Let the process table determine the intervention component; remove stale-source cues and use the same baseline in every comparison with a coherent denominator.",
      "responses": {
        "cues": [
          "Remove the manual-entry baseline that appeared in only one comparison; every option starts from the current workflow.",
          "Delete the stale dispensing-record contrast. All options retain the reconciled-list reference.",
          "Remove the preselected extra-form-work goal. The table identifies the component; checklist-based alternatives do not advertise care omissions. A common form-workflow prefix removes key-only 'form' and 'form entry' matching."
        ],
        "fairness": [
          "The next adaptation is tied to the observed increased component, not a universal one-factor requirement.",
          "Without the table no component is preferred by the presentation or options. It supplies the actual differentiating evidence.",
          "All time and contact rows now refer to ten visits per process, with staff-minute totals distinguished from contact counts."
        ],
        "suggestions": [
          "The exhibit determines which component gained burden; the presentation no longer names it.",
          "Every comparison uses the same current workflow and the reconciled list; no stale source or invented baseline is a distractor.",
          "Use a single explicitly defined ten-visit denominator for the process and contact observations."
        ]
      },
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
      ]
    }
  ],
  [
    "B40",
    {
      "update": "The patient now has fresh hematemesis and a further hemoglobin fall. After resuscitation, blood pressure is 118/72 mmHg and pulse is 94/min. The first examination recorded a directly accessible ulcer target. Endoscopic, angiographic and operative care are available at the receiving hospital.",
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
      "explanation": "After an initially successful hemostasis course, a resuscitated patient with recurrent bleeding and an accessible target can undergo another therapeutic endoscopy. Consider a cap-mounted clip for recurrence. The fact that a procedure has already occurred does not establish that an accurately targeted repeat treatment has no role.",
      "claims": [
        "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
        "claim.qq20261102.ulcer-initial-treatment",
        "claim.qq20261102.ulcer-rescue-embolization",
        "claim.qq20261102a.ulcer-local-modality-choice",
        "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy"
      ],
      "services": [
        null,
        null,
        null
      ],
      "difficulty": "moderate",
      "steps": [
        "Identify recurrence after initially successful hemostasis, rather than persistent failure of a second therapeutic attempt.",
        "Use response, target access and available care to select the next hemostasis course."
      ],
      "decisive": "The documented first course succeeded before recurrence; the resuscitated patient has an accessible target and available endoscopic care.",
      "closest": "Escalate directly to embolization because bleeding recurred after one initially successful course.",
      "attack": "Delete the named untried-repeat sentence. The actual successful first procedure and subsequent recurrent bleeding establish the stage; necessary access and response data remain.",
      "risk": "GI/IR review must confirm sequencing under the retained ESGE claim. No exact pressure cutoff or universal procedural limit is asserted.",
      "change": "Delete the redundant named-repeat hint while retaining the moderate application, physiology, access and equal availability.",
      "responses": {
        "cues": [
          "Deleted the sentence naming repeat endoscopic hemostasis as untried or due 'yet'.",
          "Retain actual first-procedure access as decision-critical information, without pairing it with a named missing action."
        ],
        "fairness": [
          "Preserve the successful-first-course versus recurrent-bleeding distinction and the actual response/access observations.",
          "The 118/72 and 94/min constructed observations are unchanged and not taught as thresholds; no new clinical value or correction claim is added.",
          "Keep the existing moderate sequencing decision; only the redundant hint changes."
        ],
        "suggestions": [
          "Deleted the exact named-untried-action sentence.",
          "Retained response, target access and comparable availability without stating that repeat treatment is the appropriate answer."
        ]
      },
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
      ]
    }
  ]
]);

export function validateSpecs(){
 const returned=entry.review.filter(r=>r.verdict==="REVISE");assert.equal(specs.size,26);
 assert.deepEqual(new Set(specs.keys()),new Set(returned.map(r=>r.id)));
 for(const[id,s]of specs){
  const review=entry.review.find(r=>r.id===id);
  for(const k of ["cues","fairness","suggestions"])assert.equal(s.responses[k].length,review[k].length,id+" "+k+" response count");
  assert(s.options.length===3||s.options.length===4,id);assert(s.options.every(p=>p.length===2&&p.every(v=>typeof v==="string"&&v.length)),id);
  assert.equal(s.services.length,s.options.length,id+" service count");
  if(s.timing)assert.equal(s.timing.length,s.options.length,id+" timing count");
  if(s.basicRecallIntentional)assert.equal(id,"B29");else assert(s.steps.length>=2,id);
 }
 return {revisions:specs.size,pass:47,notes:returned.reduce((n,r)=>n+r.cues.length+r.fairness.length+r.suggestions.length,0)};
}
