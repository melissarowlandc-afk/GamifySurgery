import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant} from "./pilot-schema";
import type {QuestionShipAcceptance} from "./question-ship-manifest";
/** Exact retained N3 review-four view; static representation avoids a catalog cycle. */
export const QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE:SyntheticClinicalRelease={
  "id": "clinical.synthetic.prototype.v1",
  "schemaVersion": 1,
  "publicationStatus": "synthetic_unapproved_prototype",
  "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
  "concepts": [
    {
      "id": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
      "displayName": "Arterial assessment before venous-ulcer compression",
      "learningObjective": "Obtain arterial assessment before selecting compression for a suspected venous leg ulcer.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.diabetic-foot-ulcer.no-antibiotics-without-infection",
      "displayName": "Avoid antibiotics for uninfected diabetic foot ulcer",
      "learningObjective": "Withhold antibiotics used solely for prevention or healing when clinical infection is absent.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
    {
      "id": "concept.n3.lactation-drain-contact-boundary",
      "displayName": "Feeding after breast drainage",
      "learningObjective": "Use the infant-contact geometry of a drained breast infection to distinguish a local contact precaution from a blanket instruction to stop lactation.",
      "earliestFacilityStage": 3,
      "conceptType": "management"
    },
    {
      "id": "concept.n3.delayed-regurgitation-proximal-anatomic-study",
      "displayName": "Proximal swallowing investigation",
      "learningObjective": "Use the timing and location of retained-food regurgitation to select a dynamic anatomic investigation rather than assuming a distal reflux or motility problem.",
      "earliestFacilityStage": 4,
      "conceptType": "workup"
    },
    {
      "id": "concept.n3.chyle-leak-diet-composition-versus-calories",
      "displayName": "Nutrition composition in a proven leak",
      "learningObjective": "Separate adequate calorie delivery from an appropriate fat composition when reviewing nutrition for a confirmed postoperative chyle leak.",
      "earliestFacilityStage": 4,
      "conceptType": "management"
    }
  ],
  "cases": [
    {
      "id": "case.n3.delayed-regurgitation-proximal-anatomic-study.v1",
      "displayName": "Cough with meals",
      "patientPresentationVariantId": "presentation.n3.delayed-regurgitation-proximal-anatomic-study.v4",
      "releasePointId": "release.l3.ambulatory_or_qi",
      "patientDisplayName": "Clara Benson",
      "prototypeDemographics": {
        "ageYears": 73,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Cough with meals",
      "presentation": "{patientName}, a 73-year-old woman, attends the swallowing clinic for coughing during and after meals. A speech-language pathologist has completed a transnasal flexible endoscopic evaluation of swallowing (FEES).",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.n3.delayed-regurgitation-proximal-anatomic-study.v4",
          "prototypeDemographics": {
            "ageYears": 73,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Cough with meals",
          "presentation": "{patientName}, a 73-year-old woman, attends the swallowing clinic for coughing during and after meals. A speech-language pathologist has completed a transnasal flexible endoscopic evaluation of swallowing (FEES)."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 4,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Clinical Practice Guidelines for the Assessment of Uninvestigated Esophageal Dysphagia",
        "Zenker's Diverticulum: Can Protocolised Measurements with Barium SWALLOW Predict Severity and Treatment Outcomes? The Zen-Rad Study",
        "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
        "2019 Seoul Consensus on Esophageal Achalasia Guidelines"
      ],
      "decisionNodes": [
        {
          "id": "node.n3.delayed-regurgitation-proximal-anatomic-study.v1",
          "questionVariantId": "question.n3.delayed-regurgitation-proximal-anatomic-study.v4",
          "primaryConceptId": "concept.n3.delayed-regurgitation-proximal-anatomic-study",
          "stem": "Which investigation should be selected next for {patientName}'s swallowing symptoms?",
          "answerChoices": [
            {
              "id": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.contrast",
              "label": "Fluoroscopic barium esophagram",
              "isCorrect": true,
              "rationale": "The delayed return after visible clearance raises a proximal retention question. Fluoroscopic contrast evaluation investigates that anatomy; the observed point of return does not prove the entire source or a diverticulum.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.endoscopy",
              "label": "Esophagogastroduodenoscopy (EGD)",
              "isCorrect": false,
              "rationale": "EGD is often the initial investigation for persistent esophageal dysphagia, but the observed delayed return makes initial contrast assessment of a suspected proximal pouch the better offered sequence. FEES and EGD are distinct examinations.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.pressure",
              "label": "High-resolution esophageal manometry",
              "isCorrect": false,
              "rationale": "Manometry addresses motor physiology, but does not replace the initial structural assessment selected by this pattern.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The report records visible clearance followed by return of the same material from below, rather than continuous observation throughout the swallow. Investigate a possible proximal retention process with a fluoroscopic barium swallow. The sequence does not prove a diverticulum or exclude events during the obscured view. FEES is not the EGD offered as an alternative; a pressure study answers a different question after structural assessment.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Original constructed teaching record; fictional patient observations",
            "items": [
              {
                "label": "FEES report: first dyed-puree bolus",
                "value": "The image is obscured as she swallows. On the next clear view, the pyriform recesses are empty and no dyed material is visible in the laryngeal vestibule."
              },
              {
                "label": "FEES report: later observation",
                "value": "Forty seconds later, with no additional bolus given, dyed material rises from below the postcricoid edge and pools in the left pyriform recess. She then coughs."
              }
            ]
          },
          "sourceLabels": [
            "Clinical Practice Guidelines for the Assessment of Uninvestigated Esophageal Dysphagia",
            "Zenker's Diverticulum: Can Protocolised Measurements with Barium SWALLOW Predict Severity and Treatment Outcomes? The Zen-Rad Study",
            "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
            "2019 Seoul Consensus on Esophageal Achalasia Guidelines"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.endoscopy",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "EGD is often the initial investigation for persistent esophageal dysphagia, but the observed delayed return makes initial contrast assessment of a suspected proximal pouch the better offered sequence. FEES and EGD are distinct examinations.",
              "sourceLabels": [
                "Clinical Practice Guidelines for the Assessment of Uninvestigated Esophageal Dysphagia",
                "Zenker's Diverticulum: Can Protocolised Measurements with Barium SWALLOW Predict Severity and Treatment Outcomes? The Zen-Rad Study",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
                "2019 Seoul Consensus on Esophageal Achalasia Guidelines"
              ]
            },
            {
              "answerChoiceId": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.pressure",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "Manometry addresses motor physiology, but does not replace the initial structural assessment selected by this pattern.",
              "sourceLabels": [
                "Clinical Practice Guidelines for the Assessment of Uninvestigated Esophageal Dysphagia",
                "Zenker's Diverticulum: Can Protocolised Measurements with Barium SWALLOW Predict Severity and Treatment Outcomes? The Zen-Rad Study",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
                "2019 Seoul Consensus on Esophageal Achalasia Guidelines"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The report records visible clearance followed by return of the same material from below, rather than continuous observation throughout the swallow. Investigate a possible proximal retention process with a fluoroscopic barium swallow. The sequence does not prove a diverticulum or exclude events during the obscured view. FEES is not the EGD offered as an alternative; a pressure study answers a different question after structural assessment."
    },
    {
      "id": "case.n3.foot-culture-versus-clinical-infection.v1",
      "displayName": "Foot ulcer follow-up",
      "patientPresentationVariantId": "presentation.n3.foot-culture-versus-clinical-infection.v4",
      "releasePointId": "release.l3.ambulatory_or_qi",
      "patientDisplayName": "Andre Wells",
      "prototypeDemographics": {
        "ageYears": 59,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Foot ulcer follow-up",
      "presentation": "{patientName}, a 59-year-old man with diabetes and reduced plantar sensation, attends the foot clinic after completing cephalexin for redness around a forefoot ulcer.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.n3.foot-culture-versus-clinical-infection.v4",
          "prototypeDemographics": {
            "ageYears": 59,
            "sexLabel": "Male"
          },
          "chiefComplaint": "Foot ulcer follow-up",
          "presentation": "{patientName}, a 59-year-old man with diabetes and reduced plantar sensation, attends the foot clinic after completing cephalexin for redness around a forefoot ulcer."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 3,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "IWGDF/IDSA diabetes-related foot infection guideline"
      ],
      "decisionNodes": [
        {
          "id": "node.n3.foot-culture-versus-clinical-infection.v1",
          "questionVariantId": "question.n3.foot-culture-versus-clinical-infection.v4",
          "primaryConceptId": "concept.diabetic-foot-ulcer.no-antibiotics-without-infection",
          "stem": "Which antimicrobial plan is appropriate for {patientName} at this visit?",
          "answerChoices": [
            {
              "id": "choice.n3r4.foot-culture-versus-clinical-infection.wound_care",
              "label": "Maintain existing offloading and dressings",
              "isCorrect": true,
              "rationale": "The wound examination no longer shows the earlier inflammatory findings. Surface growth does not establish continuing infection or create an indication for another local or systemic antimicrobial course.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.foot-culture-versus-clinical-infection.systemic",
              "label": "Add oral ciprofloxacin to offloading and dressings",
              "isCorrect": false,
              "rationale": "A susceptible organism on a surface swab does not establish an infection requiring a new systemic drug.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.foot-culture-versus-clinical-infection.topical",
              "label": "Add topical gentamicin to offloading and dressings",
              "isCorrect": false,
              "rationale": "Using a local antibiotic to clear surface organisms is not an indicated way to promote healing of a clinically uninfected ulcer.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Clinical infection and a positive surface culture are different findings. The current examination and healing trajectory do not establish persistent soft-tissue infection. Continue offloading and dressings; antibiotics should not be prescribed to sterilize an uninfected ulcer or promote its healing. New inflammation or deeper findings would require reassessment.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Original constructed teaching record; fictional patient observations",
            "items": [
              {
                "label": "Earlier examination",
                "value": "A 9-by-7-mm ulcer with opaque drainage and surrounding warm, swollen skin."
              },
              {
                "label": "Current examination",
                "value": "A 6-by-4-mm shallow ulcer with red granulation tissue and thin straw-colored fluid. Surrounding skin has the same temperature and color as the opposite foot; no swelling or fluctuance is found. Temperature 36.8 C."
              },
              {
                "label": "Surface swab",
                "value": "Heavy Pseudomonas aeruginosa growth; the report lists ciprofloxacin and gentamicin as susceptible."
              }
            ]
          },
          "sourceLabels": [
            "IWGDF/IDSA diabetes-related foot infection guideline"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.n3r4.foot-culture-versus-clinical-infection.systemic",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "A susceptible organism on a surface swab does not establish an infection requiring a new systemic drug.",
              "sourceLabels": [
                "IWGDF/IDSA diabetes-related foot infection guideline"
              ]
            },
            {
              "answerChoiceId": "choice.n3r4.foot-culture-versus-clinical-infection.topical",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "Using a local antibiotic to clear surface organisms is not an indicated way to promote healing of a clinically uninfected ulcer.",
              "sourceLabels": [
                "IWGDF/IDSA diabetes-related foot infection guideline"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Clinical infection and a positive surface culture are different findings. The current examination and healing trajectory do not establish persistent soft-tissue infection. Continue offloading and dressings; antibiotics should not be prescribed to sterilize an uninfected ulcer or promote its healing. New inflammation or deeper findings would require reassessment."
    },
    {
      "id": "case.n3.venous-ulcer-with-competing-arterial-findings.v1",
      "displayName": "Persistent ankle ulcer",
      "patientPresentationVariantId": "presentation.n3.venous-ulcer-with-competing-arterial-findings.v4",
      "releasePointId": "release.l3.ambulatory_or_qi",
      "patientDisplayName": "Diane Foster",
      "prototypeDemographics": {
        "ageYears": 72,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Persistent ankle ulcer",
      "presentation": "{patientName}, a 72-year-old woman, attends the wound clinic for a persistent medial-ankle ulcer with leg swelling.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.n3.venous-ulcer-with-competing-arterial-findings.v4",
          "prototypeDemographics": {
            "ageYears": 72,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Persistent ankle ulcer",
          "presentation": "{patientName}, a 72-year-old woman, attends the wound clinic for a persistent medial-ankle ulcer with leg swelling."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 3,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Peripheral Artery Disease — Diagnosis",
        "Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease",
        "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
      ],
      "decisionNodes": [
        {
          "id": "node.n3.venous-ulcer-with-competing-arterial-findings.v1",
          "questionVariantId": "question.n3.venous-ulcer-with-competing-arterial-findings.v4",
          "primaryConceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
          "stem": "Which investigation should guide {patientName}'s ulcer treatment next?",
          "answerChoices": [
            {
              "id": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.toe",
              "label": "Toe pressure test with digital photoplethysmography",
              "isCorrect": true,
              "rationale": "Persistent signal at maximal ankle cuff inflation prevents that acquisition from establishing adequate perfusion. Selected toe/digital physiology can address the compression-safety question.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.exercise",
              "label": "Exercise ankle-brachial pressure index test",
              "isCorrect": false,
              "rationale": "Exercise ankle testing can clarify exertional symptoms when resting measurements are interpretable. It does not repair an ankle artery that could not be occluded by the cuff in this acquisition.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.cta",
              "label": "Lower-limb computed tomography angiography",
              "isCorrect": false,
              "rationale": "Anatomic arterial mapping can be useful when an intervention is being planned, but does not replace the selected distal physiologic assessment of this uninterpretable pressure result.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A pressure above the cuff's occlusion range is not a measurement proving adequate perfusion. The venous findings do not remove the need to assess coexisting arterial disease before compression. Selected toe pressure and digital waveform assessment addresses the noncompressible-ankle limitation. This case does not specify a compression pressure, perfusion cutoff or revascularization plan.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Original constructed teaching record; fictional patient observations",
            "items": [
              {
                "label": "Wound examination",
                "value": "Shallow medial-ankle ulcer, edema and brown lower-leg skin; foot warm at rest. No rest pain."
              },
              {
                "label": "Venous duplex",
                "value": "Axial superficial reflux; deep veins compress throughout the examined segments."
              },
              {
                "label": "Ankle-pressure acquisition",
                "value": "Brachial systolic pressure 146 mm Hg. At both left pedal arteries, the Doppler signal persists with the ankle cuff at its maximum inflation of 260 mm Hg; the worksheet records ankle pressure greater than 260 mm Hg."
              }
            ]
          },
          "sourceLabels": [
            "Peripheral Artery Disease — Diagnosis",
            "Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease",
            "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.exercise",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "Exercise ankle testing can clarify exertional symptoms when resting measurements are interpretable. It does not repair an ankle artery that could not be occluded by the cuff in this acquisition.",
              "sourceLabels": [
                "Peripheral Artery Disease — Diagnosis",
                "Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease",
                "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
              ]
            },
            {
              "answerChoiceId": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.cta",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "Anatomic arterial mapping can be useful when an intervention is being planned, but does not replace the selected distal physiologic assessment of this uninterpretable pressure result.",
              "sourceLabels": [
                "Peripheral Artery Disease — Diagnosis",
                "Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease",
                "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
              ]
            }
          ]
        }
      ],
      "learningSummary": "A pressure above the cuff's occlusion range is not a measurement proving adequate perfusion. The venous findings do not remove the need to assess coexisting arterial disease before compression. Selected toe pressure and digital waveform assessment addresses the noncompressible-ankle limitation. This case does not specify a compression pressure, perfusion cutoff or revascularization plan."
    },
    {
      "id": "case.n3.lactation-drain-contact-boundary.v1",
      "displayName": "Feeding after drainage",
      "patientPresentationVariantId": "presentation.n3.lactation-drain-contact-boundary.v4",
      "releasePointId": "release.l3.ambulatory_or_qi",
      "patientDisplayName": "Natalie Stone",
      "prototypeDemographics": {
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Feeding after drainage",
      "presentation": "{patientName}, a 31-year-old woman, attends the breast clinic after drainage of an MRSA abscess. Her infant is healthy and was born at term. A lactation clinician observes feeding and expression from the affected breast.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.n3.lactation-drain-contact-boundary.v4",
          "prototypeDemographics": {
            "ageYears": 31,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Feeding after drainage",
          "presentation": "{patientName}, a 31-year-old woman, attends the breast clinic after drainage of an MRSA abscess. Her infant is healthy and was born at term. A lactation clinician observes feeding and expression from the affected breast."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 3,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022",
        "Methicillin-Resistant Staphylococcus aureus (MRSA) and Breastfeeding"
      ],
      "decisionNodes": [
        {
          "id": "node.n3.lactation-drain-contact-boundary.v1",
          "questionVariantId": "question.n3.lactation-drain-contact-boundary.v4",
          "primaryConceptId": "concept.n3.lactation-drain-contact-boundary",
          "stem": "Which affected-side plan should {patientName} follow for the next feed using the observed arrangements?",
          "answerChoices": [
            {
              "id": "choice.n3r4.lactation-drain-contact-boundary.direct",
              "label": "Breastfeed directly and discard expressed milk",
              "isCorrect": true,
              "rationale": "The observed direct latch avoids the covered infected opening. The expression path contacts drainage that can enter the milk-contact route, so milk from this setup should not be used.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.lactation-drain-contact-boundary.both",
              "label": "Breastfeed directly and give expressed milk",
              "isCorrect": false,
              "rationale": "Direct feeding and expression do not share the same contact observations here. Milk passes through the connected component reached by wound drainage.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.lactation-drain-contact-boundary.expressed",
              "label": "Pause breastfeeding and give expressed milk",
              "isCorrect": false,
              "rationale": "This reverses the actual routes: the latch avoids the covered opening, while the expression path is the one exposed to drainage.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.lactation-drain-contact-boundary.neither",
              "label": "Pause breastfeeding and discard expressed milk",
              "isCorrect": false,
              "rationale": "The milk from the contacting setup should be discarded, but the observed direct latch does not expose the infant's mouth to the covered wound. MRSA does not itself require withholding every affected-side feed.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Apply the contact precaution to each route. The observed latch avoids the covered opening; the pump setup contacts drainage along a component connected to the milk tunnel. Continue the observed direct feed and discard milk from that expression setup. Reassess or change the expression arrangement before collecting milk for use; the decision does not establish that every future pump setup is unsafe.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Original constructed teaching record; fictional patient observations",
            "items": [
              {
                "label": "Wound and latch",
                "value": "The draining opening lies above the areola beneath a dressing. During the observed latch the infant's mouth remains below the dressing; the dressing stays adherent around the opening."
              },
              {
                "label": "Pump contact",
                "value": "With the flange in position, its upper rim crosses the opening and lifts the dressing edge. Drainage from the opening reaches the flange's inner breast-contact surface and runs toward the milk tunnel."
              },
              {
                "label": "Collection path",
                "value": "The tunnel and bottle remain connected to that flange throughout expression."
              }
            ]
          },
          "sourceLabels": [
            "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022",
            "Methicillin-Resistant Staphylococcus aureus (MRSA) and Breastfeeding"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.n3r4.lactation-drain-contact-boundary.both",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "Direct feeding and expression do not share the same contact observations here. Milk passes through the connected component reached by wound drainage.",
              "sourceLabels": [
                "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022",
                "Methicillin-Resistant Staphylococcus aureus (MRSA) and Breastfeeding"
              ]
            },
            {
              "answerChoiceId": "choice.n3r4.lactation-drain-contact-boundary.expressed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "This reverses the actual routes: the latch avoids the covered opening, while the expression path is the one exposed to drainage.",
              "sourceLabels": [
                "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022",
                "Methicillin-Resistant Staphylococcus aureus (MRSA) and Breastfeeding"
              ]
            },
            {
              "answerChoiceId": "choice.n3r4.lactation-drain-contact-boundary.neither",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "The milk from the contacting setup should be discarded, but the observed direct latch does not expose the infant's mouth to the covered wound. MRSA does not itself require withholding every affected-side feed.",
              "sourceLabels": [
                "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022",
                "Methicillin-Resistant Staphylococcus aureus (MRSA) and Breastfeeding"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Apply the contact precaution to each route. The observed latch avoids the covered opening; the pump setup contacts drainage along a component connected to the milk tunnel. Continue the observed direct feed and discard milk from that expression setup. Reassess or change the expression arrangement before collecting milk for use; the decision does not establish that every future pump setup is unsafe."
    },
    {
      "id": "case.n3.chyle-leak-diet-composition-versus-calories.v1",
      "displayName": "Postoperative nutrition review",
      "patientPresentationVariantId": "presentation.n3.chyle-leak-diet-composition-versus-calories.v4",
      "releasePointId": "release.l3.ambulatory_or_qi",
      "patientDisplayName": "Victor Lane",
      "prototypeDemographics": {
        "ageYears": 65,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Postoperative nutrition review",
      "presentation": "{patientName}, a 65-year-old man, attends the surgical follow-up clinic after retroperitoneal lymph-node dissection. You review the hospital team's initial nutrition decision when new abdominal drainage developed.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.n3.chyle-leak-diet-composition-versus-calories.v4",
          "prototypeDemographics": {
            "ageYears": 65,
            "sexLabel": "Male"
          },
          "chiefComplaint": "Postoperative nutrition review",
          "presentation": "{patientName}, a 65-year-old man, attends the surgical follow-up clinic after retroperitoneal lymph-node dissection. You review the hospital team's initial nutrition decision when new abdominal drainage developed."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 4,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chylous Ascites: Evaluation and Management",
        "Chylous Ascites: A Review of Pathogenesis, Diagnosis and Treatment",
        "ESPEN guideline on hospital nutrition",
        "ESPEN practical guideline on clinical nutrition in surgery"
      ],
      "decisionNodes": [
        {
          "id": "node.n3.chyle-leak-diet-composition-versus-calories.v1",
          "questionVariantId": "question.n3.chyle-leak-diet-composition-versus-calories.v4",
          "primaryConceptId": "concept.n3.chyle-leak-diet-composition-versus-calories",
          "stem": "Which initial hospital nutrition prescription best fits {patientName}'s record?",
          "answerChoices": [
            {
              "id": "choice.n3r4.chyle-leak-diet-composition-versus-calories.mct",
              "label": "Oral feeding with long-chain-fat restriction and medium-chain enrichment",
              "isCorrect": true,
              "rationale": "The postoperative appearance and triglyceride-rich fluid support lymphatic loss. Initial oral management restricts long-chain fat and uses medium-chain enrichment while maintaining nutrition and monitoring losses.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.chyle-leak-diet-composition-versus-calories.long_chain",
              "label": "Oral feeding with long-chain triglyceride enrichment",
              "isCorrect": false,
              "rationale": "The current problem is not a failure to deliver enough calories. Long-chain enrichment is the opposite of the recorded initial fat restriction for this process.",
              "serviceRequest": null
            },
            {
              "id": "choice.n3r4.chyle-leak-diet-composition-versus-calories.pn",
              "label": "Parenteral feeding with intravenous nutrients and cessation of oral feeds",
              "isCorrect": false,
              "rationale": "PN can be needed when oral/enteral support is infeasible or insufficient, or in selected refractory courses. This initial record shows usable intake and does not establish that boundary.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Interpret the fluid findings with the operative and meal history: they support postoperative chylous loss rather than a calorie-delivery problem. The selected initial nutrition plan uses long-chain-fat restriction with medium-chain enrichment while preserving energy/protein intake and monitoring fluid, electrolytes and nutrition. PN is reserved for a different feasibility or refractory-course decision. The fictional sample values are not diagnostic cutoffs or an escalation rule.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Original constructed teaching record; fictional patient observations",
            "items": [
              {
                "label": "Drainage",
                "value": "Clear before meals resumed; subsequently cloudy white."
              },
              {
                "label": "Paired samples",
                "value": "Fluid triglycerides 780 mg/dL; serum triglycerides 120 mg/dL."
              },
              {
                "label": "Intake and examination",
                "value": "Meals meet the team's energy and protein prescription. No vomiting; passing stool. Abdomen soft. The hospital is monitoring drain volume, weight and electrolytes."
              }
            ]
          },
          "sourceLabels": [
            "Chylous Ascites: Evaluation and Management",
            "Chylous Ascites: A Review of Pathogenesis, Diagnosis and Treatment",
            "ESPEN guideline on hospital nutrition",
            "ESPEN practical guideline on clinical nutrition in surgery"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.n3r4.chyle-leak-diet-composition-versus-calories.long_chain",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "The current problem is not a failure to deliver enough calories. Long-chain enrichment is the opposite of the recorded initial fat restriction for this process.",
              "sourceLabels": [
                "Chylous Ascites: Evaluation and Management",
                "Chylous Ascites: A Review of Pathogenesis, Diagnosis and Treatment",
                "ESPEN guideline on hospital nutrition",
                "ESPEN practical guideline on clinical nutrition in surgery"
              ]
            },
            {
              "answerChoiceId": "choice.n3r4.chyle-leak-diet-composition-versus-calories.pn",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the findings and decision before continuing; no patient outcome is simulated.",
              "clinicalRationale": "PN can be needed when oral/enteral support is infeasible or insufficient, or in selected refractory courses. This initial record shows usable intake and does not establish that boundary.",
              "sourceLabels": [
                "Chylous Ascites: Evaluation and Management",
                "Chylous Ascites: A Review of Pathogenesis, Diagnosis and Treatment",
                "ESPEN guideline on hospital nutrition",
                "ESPEN practical guideline on clinical nutrition in surgery"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Interpret the fluid findings with the operative and meal history: they support postoperative chylous loss rather than a calorie-delivery problem. The selected initial nutrition plan uses long-chain-fat restriction with medium-chain enrichment while preserving energy/protein intake and monitoring fluid, electrolytes and nutrition. PN is reserved for a different feasibility or refractory-course decision. The fictional sample values are not diagnostic cutoffs or an escalation rule."
    }
  ]
};
export const QUESTION_N3R4_ACCEPTED_QUESTIONS:QuestionVariant[]=[
  {
    "contentVersion": "clinical.question-new-n3.2026-11-10.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.n3.delayed-regurgitation-proximal-anatomic-study.v4",
    "conceptId": "concept.n3.delayed-regurgitation-proximal-anatomic-study",
    "stem": "Which investigation should be selected next for {patientName}'s swallowing symptoms?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed teaching record; fictional patient observations",
      "items": [
        {
          "label": "FEES report: first dyed-puree bolus",
          "value": "The image is obscured as she swallows. On the next clear view, the pyriform recesses are empty and no dyed material is visible in the laryngeal vestibule."
        },
        {
          "label": "FEES report: later observation",
          "value": "Forty seconds later, with no additional bolus given, dyed material rises from below the postcricoid edge and pools in the left pyriform recess. She then coughs."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.contrast",
        "label": "Fluoroscopic barium esophagram",
        "isCorrect": true,
        "rationale": "The delayed return after visible clearance raises a proximal retention question. Fluoroscopic contrast evaluation investigates that anatomy; the observed point of return does not prove the entire source or a diverticulum.",
        "distractorRationale": null
      },
      {
        "id": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.endoscopy",
        "label": "Esophagogastroduodenoscopy (EGD)",
        "isCorrect": false,
        "rationale": "EGD is often the initial investigation for persistent esophageal dysphagia, but the observed delayed return makes initial contrast assessment of a suspected proximal pouch the better offered sequence. FEES and EGD are distinct examinations.",
        "distractorRationale": "EGD is often the initial investigation for persistent esophageal dysphagia, but the observed delayed return makes initial contrast assessment of a suspected proximal pouch the better offered sequence. FEES and EGD are distinct examinations."
      },
      {
        "id": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.pressure",
        "label": "High-resolution esophageal manometry",
        "isCorrect": false,
        "rationale": "Manometry addresses motor physiology, but does not replace the initial structural assessment selected by this pattern.",
        "distractorRationale": "Manometry addresses motor physiology, but does not replace the initial structural assessment selected by this pattern."
      }
    ],
    "explanation": "The report records visible clearance followed by return of the same material from below, rather than continuous observation throughout the swallow. Investigate a possible proximal retention process with a fluoroscopic barium swallow. The sequence does not prove a diverticulum or exclude events during the obscured view. FEES is not the EGD offered as an alternative; a pressure study answers a different question after structural assessment.",
    "supportingEvidenceClaimIds": [
      "claim.n3r4.a3fc0f259108",
      "claim.n3r4.6a3138a1e303"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n3.2026-11-10.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.n3.venous-ulcer-with-competing-arterial-findings.v4",
    "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "stem": "Which investigation should guide {patientName}'s ulcer treatment next?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed teaching record; fictional patient observations",
      "items": [
        {
          "label": "Wound examination",
          "value": "Shallow medial-ankle ulcer, edema and brown lower-leg skin; foot warm at rest. No rest pain."
        },
        {
          "label": "Venous duplex",
          "value": "Axial superficial reflux; deep veins compress throughout the examined segments."
        },
        {
          "label": "Ankle-pressure acquisition",
          "value": "Brachial systolic pressure 146 mm Hg. At both left pedal arteries, the Doppler signal persists with the ankle cuff at its maximum inflation of 260 mm Hg; the worksheet records ankle pressure greater than 260 mm Hg."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.toe",
        "label": "Toe pressure test with digital photoplethysmography",
        "isCorrect": true,
        "rationale": "Persistent signal at maximal ankle cuff inflation prevents that acquisition from establishing adequate perfusion. Selected toe/digital physiology can address the compression-safety question.",
        "distractorRationale": null
      },
      {
        "id": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.exercise",
        "label": "Exercise ankle-brachial pressure index test",
        "isCorrect": false,
        "rationale": "Exercise ankle testing can clarify exertional symptoms when resting measurements are interpretable. It does not repair an ankle artery that could not be occluded by the cuff in this acquisition.",
        "distractorRationale": "Exercise ankle testing can clarify exertional symptoms when resting measurements are interpretable. It does not repair an ankle artery that could not be occluded by the cuff in this acquisition."
      },
      {
        "id": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.cta",
        "label": "Lower-limb computed tomography angiography",
        "isCorrect": false,
        "rationale": "Anatomic arterial mapping can be useful when an intervention is being planned, but does not replace the selected distal physiologic assessment of this uninterpretable pressure result.",
        "distractorRationale": "Anatomic arterial mapping can be useful when an intervention is being planned, but does not replace the selected distal physiologic assessment of this uninterpretable pressure result."
      }
    ],
    "explanation": "A pressure above the cuff's occlusion range is not a measurement proving adequate perfusion. The venous findings do not remove the need to assess coexisting arterial disease before compression. Selected toe pressure and digital waveform assessment addresses the noncompressible-ankle limitation. This case does not specify a compression pressure, perfusion cutoff or revascularization plan.",
    "supportingEvidenceClaimIds": [
      "claim.n3r4.0b5c4ef72e1b",
      "claim.n3r4.bf7d58a0e363"
    ]
  }
];
export const QUESTION_N3R4_ACCEPTED_REVIEWS=[
  {
    "contentVersion": "clinical.question-new-n3.2026-11-10.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "review.n3.delayed-regurgitation-proximal-anatomic-study.v4",
    "caseId": "case.n3.delayed-regurgitation-proximal-anatomic-study.v1",
    "educationalTier": 1,
    "acuity": "stable",
    "earliestFacilityStage": 4,
    "evidenceClaimIds": [
      "claim.n3r4.a3fc0f259108",
      "claim.n3r4.6a3138a1e303"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n3.2026-11-10.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "review.n3.venous-ulcer-with-competing-arterial-findings.v4",
    "caseId": "case.n3.venous-ulcer-with-competing-arterial-findings.v1",
    "educationalTier": 1,
    "acuity": "stable",
    "earliestFacilityStage": 3,
    "evidenceClaimIds": [
      "claim.n3r4.0b5c4ef72e1b",
      "claim.n3r4.bf7d58a0e363"
    ]
  }
] as const;
export const QUESTION_N3R4_ACCEPTED_TIMINGS:AnswerChoiceTimingRegistryEntry[]=[
  {
    "caseId": "case.n3.delayed-regurgitation-proximal-anatomic-study.v1",
    "nodeId": "node.n3.delayed-regurgitation-proximal-anatomic-study.v1",
    "questionVariantId": "question.n3.delayed-regurgitation-proximal-anatomic-study.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.contrast",
          "choiceLabel": "Fluoroscopic barium esophagram",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.contrast_swallow"
          }
        },
        {
          "choiceId": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.endoscopy",
          "choiceLabel": "Esophagogastroduodenoscopy (EGD)",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "choice.n3r4.delayed-regurgitation-proximal-anatomic-study.pressure",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.esophageal_manometry"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.n3.venous-ulcer-with-competing-arterial-findings.v1",
    "nodeId": "node.n3.venous-ulcer-with-competing-arterial-findings.v1",
    "questionVariantId": "question.n3.venous-ulcer-with-competing-arterial-findings.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.toe",
          "choiceLabel": "Toe pressure test with digital photoplethysmography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.exercise",
          "choiceLabel": "Exercise ankle-brachial pressure index test",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "choice.n3r4.venous-ulcer-with-competing-arterial-findings.cta",
          "choiceLabel": "Lower-limb computed tomography angiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct_angiography"
          }
        }
      ]
    }
  }
];
export const QUESTION_HARDEN1_N3R4_ACCEPTANCE_ROWS:QuestionShipAcceptance[]=[
  {
    "acceptanceId": "H1-03",
    "caseId": "case.harden1.phosphate-handling.20261110",
    "nodeId": "node.harden1.phosphate-handling.20261110",
    "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r3",
    "conceptId": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2",
    "sourceView": "harden1-round1",
    "decision": "docs/research/question-harden1-n3r4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n3.delayed-regurgitation-proximal-anatomic-study.v4",
    "caseId": "case.n3.delayed-regurgitation-proximal-anatomic-study.v1",
    "nodeId": "node.n3.delayed-regurgitation-proximal-anatomic-study.v1",
    "questionVariantId": "question.n3.delayed-regurgitation-proximal-anatomic-study.v4",
    "conceptId": "concept.n3.delayed-regurgitation-proximal-anatomic-study",
    "sourceView": "n3-round4",
    "decision": "docs/research/question-harden1-n3r4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n3.venous-ulcer-with-competing-arterial-findings.v4",
    "caseId": "case.n3.venous-ulcer-with-competing-arterial-findings.v1",
    "nodeId": "node.n3.venous-ulcer-with-competing-arterial-findings.v1",
    "questionVariantId": "question.n3.venous-ulcer-with-competing-arterial-findings.v4",
    "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "sourceView": "n3-round4",
    "decision": "docs/research/question-harden1-n3r4-manager-decision-20261110.md"
  }
];
