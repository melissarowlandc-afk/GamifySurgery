/** Final-round candidates only. Not a default-release acceptance. */
export const QUESTION_FLAGS5_ROUND3_DATA = {
  "metadata": [
    {
      "id": "QF5-02",
      "title": "A specific conservative plan for symptomatic axial reflux",
      "caseId": "case.gs028.varicose-veins.b-prefers-conservative",
      "nodeId": "node.gs028.varicose-veins.b-prefers-conservative.1",
      "oldQuestionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r2",
      "replacesLiveQuestionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r3",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r3",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r3",
        "conceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux.v2",
        "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-prefers-conservative.flags5r1.flags5r2",
        "patientPresentation": "{patientName}, a 43-year-old woman, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.43.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 43-year-old woman, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
            "chiefComplaint": "Calf heaviness"
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.43.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 43-year-old man, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
            "chiefComplaint": "Calf heaviness"
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.68.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 68-year-old woman, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
            "chiefComplaint": "Calf heaviness"
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.68.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 68-year-old man, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
            "chiefComplaint": "Calf heaviness"
          }
        ],
        "stem": "Which next step should guide treatment planning for {patientName}'s symptomatic varicose veins?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Arrange a complete venous reflux duplex",
            "isCorrect": true,
            "rationale": "The supplied compression study addresses acute deep-vein thrombosis, not the superficial/deep reflux map needed before selecting an intervention.",
            "distractorRationale": null
          },
          {
            "id": "d1_3",
            "label": "Arrange great-saphenous endovenous ablation",
            "isCorrect": false,
            "rationale": "The outside study has not established the truncal reflux anatomy on which this specific procedure would depend.",
            "distractorRationale": "The outside study has not established the truncal reflux anatomy on which this specific procedure would depend."
          },
          {
            "id": "d2_3",
            "label": "Require compression treatment before further investigation",
            "isCorrect": false,
            "rationale": "Compression can relieve symptoms, but is not a mandatory prerequisite to completing the diagnostic reflux assessment.",
            "distractorRationale": "Compression can relieve symptoms, but is not a mandatory prerequisite to completing the diagnostic reflux assessment."
          }
        ],
        "explanation": "Review what the outside ultrasound measured. Compressible deep veins do not supply a reflux map. Obtain a complete reflux duplex before selecting a truncal procedure; a mandatory compression course is not a substitute for that assessment.",
        "supportingEvidenceClaimIds": [
          "claim.varicose.reflux-duplex",
          "claim.varicose.intervention-referral",
          "claim.varicose.conservative-boundary",
          "claim.flags5r3.20261116.qf5.02"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Outside ultrasound: documented acquisition",
              "value": "Femoral and popliteal veins were examined with compression during an acute-DVT study."
            },
            {
              "label": "Saved observations",
              "value": "The deep veins compress completely. The saved series consists of B-mode views during compression."
            },
            {
              "label": "Examination",
              "value": "Prominent medial calf veins are visible when standing."
            }
          ]
        }
      },
      "basisClaimIds": [
        "claim.varicose.reflux-duplex",
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary"
      ],
      "applicationClaimId": "claim.flags5r3.20261116.qf5.02",
      "conceptMeaning": "changed — separately versioned diagnostic acquisition",
      "previousConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
      "reviewResponse": [
        "Changed the complaint to Calf heaviness in the case and every finite profile, consistent with the procedural enquiry. Clinical decision, key, options and new acquisition-objective concept version are unchanged."
      ],
      "inference": "Recognize the scope of a compression-only DVT examination, then choose the reflux investigation needed before committing to a procedure.",
      "decidingObservation": "The saved acquisition examines deep-vein compressibility rather than reflux anatomy.",
      "counterfactual": "A complete concordant reflux map would remove this reason to repeat vascular imaging and allow an intervention discussion.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "flagOrdinals": [
        3
      ],
      "educationalIntent": "focused_application",
      "basicAccepted": false,
      "ownerDirection": null
    },
    {
      "id": "QF5-11",
      "title": "Scar-edge lump with a site-marked mammogram",
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "nodeId": "node.gs028c.palpable-breast.paired-scar-edge.1",
      "oldQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r2",
      "replacesLiveQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r3",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r3",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.negative-mammogram-targeted-us.v2.r3",
        "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge.flags5r1.flags5r2",
        "patientPresentation": "{patientName}, a 49-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 49-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar."
          },
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63.flags5r1.flags5r2",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar."
          }
        ],
        "stem": "Which diagnostic plan should be arranged for {patientName}'s new breast lump?",
        "answerChoices": [
          {
            "id": "correct_2",
            "label": "Repeat targeted ultrasound of the marked site",
            "isCorrect": true,
            "rationale": "The supplied benign finding does not correspond to the current clinical target. Obtain site-concordant ultrasound before choosing a further pathway.",
            "distractorRationale": null
          },
          {
            "id": "d1_2",
            "label": "Schedule clinical examination follow-up of the marked site",
            "isCorrect": false,
            "rationale": "The outside benign result cannot support observation of a different, persistent clinical target.",
            "distractorRationale": "The outside benign result cannot support observation of a different, persistent clinical target."
          },
          {
            "id": "d2_2",
            "label": "Obtain MRI of the marked site before repeat ultrasound",
            "isCorrect": false,
            "rationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record.",
            "distractorRationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record."
          }
        ],
        "explanation": "Match the clinical marker to the saved imaging location. The outside ultrasound describes the old operative site closer to the nipple, not the new scar-edge target. Request ultrasound directed to the current marker. That result cannot be replaced by reassurance from the postoperative cavity or by jumping to MRI.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.targeted-us",
          "claim.qbp2b.b2b19.application",
          "claim.qbp2b.b2b36.application",
          "claim.flags5r3.20261116.qf5.11"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Surgeon's skin marker",
              "value": "10 o'clock, 5 cm from the nipple; the new palpable lump is at the scar edge."
            },
            {
              "label": "Diagnostic mammogram",
              "value": "Marker included. Stable postoperative distortion closer to the nipple; no mass or suspicious calcifications at the new marker."
            },
            {
              "label": "Outside ultrasound images",
              "value": "Labelled 10 o'clock, 2 cm from the nipple; a superficial postoperative cavity is shown."
            }
          ]
        }
      },
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "applicationClaimId": "claim.flags5r3.20261116.qf5.11",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "reviewResponse": [
        "Named the competing observation action as clinical examination follow-up, not reimaging; removed its diagnostic-imaging service request and retained no_test timing."
      ],
      "inference": "Reconcile the nipple-distance labels, then select the next evaluation of the actual clinical target.",
      "decidingObservation": "The palpable marker and ultrasound label share a clock position but have different nipple distances.",
      "counterfactual": "If the completed study were site-concordant and the mass remained concerning, tissue evaluation would become the relevant next decision.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "flagOrdinals": [
        20
      ],
      "educationalIntent": "focused_application",
      "basicAccepted": false,
      "ownerDirection": null
    },
    {
      "id": "QF5-12",
      "title": "New palpable target and a site-marked mammogram",
      "caseId": "case.gs028c.palpable-breast.a-recent-negative",
      "nodeId": "node.gs028c.palpable-breast.a-recent-negative.1",
      "oldQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r2",
      "replacesLiveQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r3",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r3",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.negative-mammogram-targeted-us.v3.r3",
        "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-recent-negative.flags5r1.flags5r2",
        "patientPresentation": "{patientName}, a 42-year-old woman, attends clinic for a reproducible left breast lump. A benign outside biopsy report accompanied the referral.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.a-recent-negative.female.42.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 42-year-old woman, attends clinic for a reproducible left breast lump. A benign outside biopsy report accompanied the referral."
          },
          {
            "id": "profile.gs028c.palpable-breast.a-recent-negative.female.55.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 55-year-old woman, attends clinic for a reproducible left breast lump. A benign outside biopsy report accompanied the referral."
          }
        ],
        "stem": "Which diagnostic plan should be arranged for {patientName}'s palpable breast finding?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Arrange targeted ultrasound of the marked site",
            "isCorrect": true,
            "rationale": "The supplied benign finding does not correspond to the current clinical target. Obtain site-concordant ultrasound before choosing a further pathway.",
            "distractorRationale": null
          },
          {
            "id": "d1_3",
            "label": "Arrange clinical examination follow-up of the marked site",
            "isCorrect": false,
            "rationale": "The outside benign result cannot support observation of a different, persistent clinical target.",
            "distractorRationale": "The outside benign result cannot support observation of a different, persistent clinical target."
          },
          {
            "id": "d2_3",
            "label": "Arrange breast MRI of the marked site",
            "isCorrect": false,
            "rationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record.",
            "distractorRationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record."
          }
        ],
        "explanation": "The benign specimen belongs to the separate upper-breast target. It does not explain the currently marked lower-breast lump. Arrange targeted ultrasound of the clinical site rather than transferring the benign result to it or substituting MRI for that step.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.targeted-us",
          "claim.qbp2b.b2b19.application",
          "claim.qbp2b.b2b36.application",
          "claim.flags5r3.20261116.qf5.12"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Current examination marker",
              "value": "Left breast, 6 o'clock, 5 cm from the nipple."
            },
            {
              "label": "Outside biopsy and procedure images",
              "value": "Core samples labelled left breast, 11 o'clock, 1 cm from the nipple; fibroadenoma on histology."
            },
            {
              "label": "Diagnostic mammogram",
              "value": "The current skin marker is included; no corresponding mass, distortion or suspicious calcifications."
            }
          ]
        }
      },
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "applicationClaimId": "claim.flags5r3.20261116.qf5.12",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "reviewResponse": [
        "Named the competing observation action as clinical examination follow-up, not reimaging; removed its diagnostic-imaging service request and retained no_test timing.",
        "Removed repeat and outside-ultrasound assumptions. Only the recorded biopsy/procedure images are used to establish that the previous benign target differs from the current lump."
      ],
      "inference": "Check which target generated the reassuring pathology, then select the next study for the unsatisfied clinical target.",
      "decidingObservation": "The pathology/procedure site and the current examination marker differ.",
      "counterfactual": "A representative benign sample concordant with the current clinical target would not create this particular target-mismatch indication.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "flagOrdinals": [
        20
      ],
      "educationalIntent": "focused_application",
      "basicAccepted": false,
      "ownerDirection": null
    },
    {
      "id": "QF5-13",
      "title": "Reproducible focal thickening with concrete mammographic observations",
      "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
      "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
      "oldQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r4",
      "replacesLiveQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r5",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r3",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.negative-mammogram-targeted-us.v4.r5",
        "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-discordant-exam.flags5r1.flags5r2",
        "patientPresentation": "{patientName}, a 47-year-old woman, attends clinic for a persistent focal area of breast thickening beneath a small skin papule.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 47-year-old woman, attends clinic for a persistent focal area of breast thickening beneath a small skin papule.",
            "chiefComplaint": "Breast thickening"
          },
          {
            "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 61-year-old woman, attends clinic for a persistent focal area of breast thickening beneath a small skin papule.",
            "chiefComplaint": "Breast thickening"
          }
        ],
        "stem": "Which diagnostic plan should be arranged for {patientName}'s persistent breast finding?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "Repeat targeted ultrasound of the marked site",
            "isCorrect": true,
            "rationale": "The supplied benign finding does not correspond to the current clinical target. Obtain site-concordant ultrasound before choosing a further pathway.",
            "distractorRationale": null
          },
          {
            "id": "d1_4",
            "label": "Schedule clinical examination follow-up of the marked site",
            "isCorrect": false,
            "rationale": "The outside benign result cannot support observation of a different, persistent clinical target.",
            "distractorRationale": "The outside benign result cannot support observation of a different, persistent clinical target."
          },
          {
            "id": "d2_4",
            "label": "Obtain MRI of the marked site before repeat ultrasound",
            "isCorrect": false,
            "rationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record.",
            "distractorRationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record."
          }
        ],
        "explanation": "The superficial dermal finding does not account for the separately mobile deeper clinical target. Direct ultrasound to the deeper palpable area before treating the cyst result as concordant reassurance or escalating to MRI. The complaint describes the symptom, not an imaging interpretation.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.targeted-us",
          "claim.qbp2b.b2b19.application",
          "claim.qbp2b.b2b36.application",
          "claim.flags5r3.20261116.qf5.13"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Diagnostic mammogram",
              "value": "The palpable skin marker is included; no focal density, distortion or suspicious calcifications."
            },
            {
              "label": "Outside ultrasound worksheet",
              "value": "Target recorded as the skin papule. Saved images show a small intradermal cyst."
            },
            {
              "label": "Surgeon's examination",
              "value": "The deeper palpable thickening moves separately from the overlying papule and remains reproducible."
            }
          ]
        }
      },
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "applicationClaimId": "claim.flags5r3.20261116.qf5.13",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "reviewResponse": [
        "Named the competing observation action as clinical examination follow-up, not reimaging; removed its diagnostic-imaging service request and retained no_test timing."
      ],
      "inference": "Distinguish the depth of the imaged skin lesion from the palpable target, then choose the site-concordant diagnostic study.",
      "decidingObservation": "The thickening moves independently of the papule imaged in the outside study.",
      "counterfactual": "If the clinical target were the same dermal lesion, this depth-mismatch argument would not apply.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "flagOrdinals": [
        20
      ],
      "educationalIntent": "focused_application",
      "basicAccepted": false,
      "ownerDirection": null
    },
    {
      "id": "QF5-14",
      "title": "Hard scar-edge mass after site-concordant imaging",
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "nodeId": "node.gs028c.palpable-breast.paired-scar-edge.2",
      "oldQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r2",
      "replacesLiveQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r3",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r3",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r3",
        "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge.flags5r1.flags5r2",
        "patientPresentation": "{patientName}, a 49-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 49-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar."
          },
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63.flags5r1.flags5r2",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar."
          }
        ],
        "reachedCurrentUpdate": "Ultrasound of the new surgeon-marked site shows no corresponding solid or cystic lesion. The same hard, irregular mass can be localized between the surgeon's examining fingers; it is separate from the superficial operative cavity.",
        "stem": "Which diagnostic plan should be arranged for {patientName}'s breast mass?",
        "answerChoices": [
          {
            "id": "correct_2",
            "label": "Arrange palpation-directed core biopsy",
            "isCorrect": true,
            "rationale": "The clinically concerning palpable target warrants tissue evaluation despite site-concordant imaging showing no correlate. Palpation-directed core biopsy is a specific offered tissue plan; adequacy and clinical-pathologic concordance still require review.",
            "distractorRationale": null
          },
          {
            "id": "d1_2",
            "label": "Arrange contrast breast MRI",
            "isCorrect": false,
            "rationale": "MRI may be useful for selected problems, but it does not replace indicated tissue evaluation of this persistent clinically concerning palpable target.",
            "distractorRationale": "MRI may be useful for selected problems, but it does not replace indicated tissue evaluation of this persistent clinically concerning palpable target."
          },
          {
            "id": "d2_2",
            "label": "Arrange short-interval clinical examination",
            "isCorrect": false,
            "rationale": "Clinical observation can suit a concordantly reassuring finding. Here the examination remains concerning despite the imaging record; interval observation does not resolve that discordance.",
            "distractorRationale": "Clinical observation can suit a concordantly reassuring finding. Here the examination remains concerning despite the imaging record; interval observation does not resolve that discordance."
          }
        ],
        "explanation": "The hard, irregular target is separate from the superficial postoperative cavity. Site-concordant imaging has not explained that examination finding. Arrange tissue evaluation rather than MRI-first triage or interval observation. The offered palpation-directed core plan is specific; adequacy and clinical-pathologic concordance still require specialist review.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.biopsy",
          "claim.qbp2b.b2b37.application",
          "claim.flags2r3.20261105.sampling-scope",
          "claim.flags5r3.20261116.qf5.14"
        ]
      },
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.b2b37.application",
        "claim.flags2r3.20261105.sampling-scope"
      ],
      "applicationClaimId": "claim.flags5r3.20261116.qf5.14",
      "conceptMeaning": "unchanged: restores the original biopsy-versus-reassurance objective; the unshipped round-two guidance-only framing is withdrawn",
      "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "reviewResponse": [
        "Removed sampling from the task; the player must decide whether tissue evaluation is needed.",
        "Replaced imaging-guidance exclusions with specific biopsy, MRI-first and clinical-observation plans. The clinical concern now changes the action.",
        "Kept the original concept ID: the scored meaning is again biopsy despite concerning clinical/imaging discordance, not ranking biopsy guidance methods. No claim that core universally outranks excision."
      ],
      "inference": "Interpret the concerning clinical examination as discordant with the completed site-concordant imaging, then choose tissue evaluation rather than MRI-first triage or clinical observation.",
      "decidingObservation": "The hard irregular mass is palpably separate from the superficial postoperative cavity.",
      "counterfactual": "A concordantly benign and stable clinical examination would remove the stated reason to choose immediate tissue evaluation over clinical follow-up.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "flagOrdinals": [
        32
      ],
      "educationalIntent": "focused_application",
      "basicAccepted": false,
      "ownerDirection": null
    },
    {
      "id": "QF5-15",
      "title": "Enlarging palpable mass with no corresponding imaging lesion",
      "caseId": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "nodeId": "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
      "oldQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r2",
      "replacesLiveQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r3",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r3",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r3",
        "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-enlarging-negative-imaging.flags5r1.flags5r2",
        "patientPresentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.43.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
          },
          {
            "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.57.flags5r1.flags5r2",
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
            "presentation": "{patientName}, a 57-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
          }
        ],
        "stem": "Which diagnostic plan should be arranged for {patientName}'s breast mass?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Arrange palpation-directed core biopsy",
            "isCorrect": true,
            "rationale": "The clinically concerning palpable target warrants tissue evaluation despite site-concordant imaging showing no correlate. Palpation-directed core biopsy is a specific offered tissue plan; adequacy and clinical-pathologic concordance still require review.",
            "distractorRationale": null
          },
          {
            "id": "d1_3",
            "label": "Arrange contrast breast MRI",
            "isCorrect": false,
            "rationale": "MRI may be useful for selected problems, but it does not replace indicated tissue evaluation of this persistent clinically concerning palpable target.",
            "distractorRationale": "MRI may be useful for selected problems, but it does not replace indicated tissue evaluation of this persistent clinically concerning palpable target."
          },
          {
            "id": "d2_3",
            "label": "Arrange short-interval clinical examination",
            "isCorrect": false,
            "rationale": "Clinical observation can suit a concordantly reassuring finding. Here the examination remains concerning despite the imaging record; interval observation does not resolve that discordance.",
            "distractorRationale": "Clinical observation can suit a concordantly reassuring finding. Here the examination remains concerning despite the imaging record; interval observation does not resolve that discordance."
          }
        ],
        "explanation": "The palpable mass has enlarged despite imaging of the correct site showing no correlate. That progression makes reassurance from imaging insufficient. Arrange tissue evaluation rather than MRI-first triage or interval observation. Palpation-directed core sampling is the specific offered plan; adequacy and clinical-pathologic concordance still require review.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.biopsy",
          "claim.qbp2b.b2b37.application",
          "claim.flags2r3.20261105.sampling-scope",
          "claim.flags5r3.20261116.qf5.15"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Diagnostic mammogram",
              "value": "The palpable marker is included; no corresponding mass, distortion or suspicious calcifications."
            },
            {
              "label": "Targeted ultrasound",
              "value": "The surgeon's marked site was scanned; no corresponding solid or cystic lesion."
            },
            {
              "label": "Repeat examination",
              "value": "The same mass remains readily localized by touch, is larger than previously and moves separately from the skin."
            }
          ]
        }
      },
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.b2b37.application",
        "claim.flags2r3.20261105.sampling-scope"
      ],
      "applicationClaimId": "claim.flags5r3.20261116.qf5.15",
      "conceptMeaning": "unchanged: restores the original biopsy-versus-reassurance objective; the unshipped round-two guidance-only framing is withdrawn",
      "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "reviewResponse": [
        "Removed sampling from the task; the player must decide whether tissue evaluation is needed.",
        "Replaced imaging-guidance exclusions with specific biopsy, MRI-first and clinical-observation plans. The clinical concern now changes the action.",
        "Kept the original concept ID: the scored meaning is again biopsy despite concerning clinical/imaging discordance, not ranking biopsy guidance methods. No claim that core universally outranks excision."
      ],
      "inference": "Interpret the concerning clinical examination as discordant with the completed site-concordant imaging, then choose tissue evaluation rather than MRI-first triage or clinical observation.",
      "decidingObservation": "The same readily palpable mass has enlarged across examinations.",
      "counterfactual": "A concordantly benign and stable clinical examination would remove the stated reason to choose immediate tissue evaluation over clinical follow-up.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "flagOrdinals": [
        32
      ],
      "educationalIntent": "focused_application",
      "basicAccepted": false,
      "ownerDirection": null
    },
    {
      "id": "QF5-17",
      "title": "Dysphagia: a readable initial test-result record",
      "caseId": "case.achalasia.clinic-referral",
      "nodeId": "node.achalasia.clinic-referral.1",
      "oldQuestionVariantId": "question.achalasia.high-resolution-manometry.v4.r7",
      "replacesLiveQuestionVariantId": "question.achalasia.high-resolution-manometry.v4.r5",
      "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r8",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r3",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.achalasia.high-resolution-manometry.v4.r8",
        "conceptId": "concept.achalasia.high-resolution-manometry.v2",
        "stem": "How should {patientName}'s next physiologic assessment be arranged?",
        "answerChoices": [
          {
            "id": "manometry_4",
            "label": "Manometry with endoscopic catheter placement",
            "isCorrect": true,
            "rationale": "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible.",
            "distractorRationale": null
          },
          {
            "id": "choice.qq20261102c.b04-context.d1",
            "label": "Junction distensibility measurement with endoscopic FLIP",
            "isCorrect": false,
            "rationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here.",
            "distractorRationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here."
          },
          {
            "id": "choice.qq20261102c.b04-context.d2",
            "label": "Timed barium esophagram with a tablet",
            "isCorrect": false,
            "rationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements.",
            "distractorRationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements."
          }
        ],
        "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
        "supportingEvidenceClaimIds": [
          "claim.achalasia.high-resolution-manometry",
          "claim.qq20261102a.esophageal-physiology-sequence",
          "claim.qq20261102c.hrm-incomplete-placement",
          "claim.flags5r3.20261116.qf5.17"
        ],
        "teachingPoint": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
        "patientPresentationVariantId": "presentation.achalasia.clinic-referral.flags5r1",
        "patientPresentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.achalasia.clinic-referral.female.66.flags5r1",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.male.66.flags5r1",
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
            "presentation": "{patientName}, a 66-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.female.72.flags5r1",
            "prototypeDemographics": {
              "ageYears": 72,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 72-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.male.72.flags5r1",
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
            "presentation": "{patientName}, a 72-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          }
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Upper endoscopy",
              "value": "No mucosal mass or fixed luminal narrowing."
            },
            {
              "label": "Contrast swallow",
              "value": "Slow passage through the distal junction."
            }
          ]
        }
      },
      "basisClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "applicationClaimId": "claim.flags5r3.20261116.qf5.17",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "reviewResponse": [
        "Normalized all three labels to capitalized noun phrases without introductory articles; exact timing labels and candidate order records use those same strings. No clinical reasoning, key or explanation change."
      ],
      "inference": "Check technical interpretability before selecting a repeat physiologic assessment.",
      "decidingObservation": "The retained acquisition lacks a dependable gastric reference after catheter displacement.",
      "counterfactual": "A completed interpretable acquisition would remove this reason to repeat manometry with assisted placement.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "flagOrdinals": [
        26
      ],
      "educationalIntent": "focused_application",
      "basicAccepted": false,
      "ownerDirection": null
    }
  ],
  "cases": [
    {
      "id": "case.achalasia.clinic-referral",
      "displayName": "Esophageal motility evaluation",
      "patientPresentationVariantId": "presentation.achalasia.clinic-referral.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 66,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Difficulty swallowing",
      "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.achalasia.clinic-referral.female.66.flags5r1",
          "prototypeDemographics": {
            "ageYears": 66,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
        },
        {
          "id": "profile.achalasia.clinic-referral.male.66.flags5r1",
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
          "presentation": "{patientName}, a 66-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
        },
        {
          "id": "profile.achalasia.clinic-referral.female.72.flags5r1",
          "prototypeDemographics": {
            "ageYears": 72,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 72-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
        },
        {
          "id": "profile.achalasia.clinic-referral.male.72.flags5r1",
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
          "presentation": "{patientName}, a 72-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
      ],
      "decisionNodes": [
        {
          "id": "node.achalasia.clinic-referral.1",
          "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r8",
          "primaryConceptId": "concept.achalasia.high-resolution-manometry.v2",
          "currentUpdate": "The exported outside manometry plots have no gastric baseline channel. During the test the entire catheter moves upward with retching; the report nevertheless gives a junction relaxation value and recommends dilation.",
          "stem": "How should {patientName}'s next physiologic assessment be arranged?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "manometry_4",
              "label": "Manometry with endoscopic catheter placement",
              "isCorrect": true,
              "rationale": "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible.",
              "serviceRequest": {
                "serviceId": "service.esophageal_manometry"
              }
            },
            {
              "id": "choice.qq20261102c.b04-context.d1",
              "label": "Junction distensibility measurement with endoscopic FLIP",
              "isCorrect": false,
              "rationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102c.b04-context.d2",
              "label": "Timed barium esophagram with a tablet",
              "isCorrect": false,
              "rationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
          "teachingPoint": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Upper endoscopy",
                "value": "No mucosal mass or fixed luminal narrowing."
              },
              {
                "label": "Contrast swallow",
                "value": "Slow passage through the distal junction."
              }
            ]
          },
          "sourceLabels": [
            "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
            "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
            "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
            "ACG esophageal physiologic testing guideline",
            "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0"
          ],
          "resultGateAfter": {
            "id": "gate.achalasia.manometry.4",
            "resultTypeId": "service.esophageal_manometry",
            "pendingLabel": "Esophageal manometry pending",
            "resultNarrative": "The esophageal pressure-study report is available for review.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.esophageal_manometry.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.achalasia.clinic-referral.2",
          "questionVariantId": "question.achalasia.manometric-recognition.v4.r6",
          "primaryConceptId": "concept.achalasia.manometric-recognition",
          "currentUpdate": "At review, {patientName} reports continued difficulty swallowing. Recorded weights have fallen substantially during the recent progression of symptoms.",
          "stem": "Which interpretation and next plan should guide {patientName}'s care?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "achalasia_4",
              "label": "Achalasia pattern; chest and abdominal CT",
              "isCorrect": true,
              "rationale": "Impaired junction relaxation with failed peristalsis supports the motor pattern; the weight loss and junction resistance still warrant secondary-cause imaging.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d1",
              "label": "Achalasia pattern; endoscopic pneumatic dilation",
              "isCorrect": false,
              "rationale": "The motor classification is appropriate, but proceeding to junction treatment before secondary-cause investigation closes the workup prematurely.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d2",
              "label": "Ineffective motility; chest and abdominal CT",
              "isCorrect": false,
              "rationale": "IEM can include failed swallows; the discriminating problem here is impaired junction relaxation, not a requirement that IEM preserve effective contractions. CT addresses the separate secondary-cause question.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d3",
              "label": "Ineffective motility; endoscopic pneumatic dilation",
              "isCorrect": false,
              "rationale": "Failed swallows do not by themselves exclude IEM, but the raised relaxation pressure with failed peristalsis supports the achalasia pattern here. Junction treatment would also precede needed secondary-cause investigation.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The subsequent study supplies a stable junction-spanning acquisition. Raised junction relaxation pressure with failed peristalsis supports an achalasia motor pattern. IEM can contain failed swallows, but requires normal junction relaxation. Weight loss and marked endoscopic resistance require secondary-cause investigation before dilation. CT is one appropriate offered investigation; EUS may also be appropriate and is not a competing option in this set.",
          "teachingPoint": "The subsequent study supplies a stable junction-spanning acquisition. Raised junction relaxation pressure with failed peristalsis supports an achalasia motor pattern. IEM can contain failed swallows, but requires normal junction relaxation. Weight loss and marked endoscopic resistance require secondary-cause investigation before dilation. CT is one appropriate offered investigation; EUS may also be appropriate and is not a competing option in this set.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Investigation record; pressure values are constructed teaching observations",
            "items": [
              {
                "label": "Subsequent pressure acquisition",
                "value": "After assisted placement, the catheter spans the junction with a stable gastric reference throughout the separated-swallow primary-position series."
              },
              {
                "label": "Endoscopy addendum",
                "value": "Marked resistance while crossing the gastroesophageal junction."
              },
              {
                "label": "Junction measurement",
                "value": "Median relaxation pressure above the laboratory reference range"
              },
              {
                "label": "Distal contractile integral",
                "value": "Readouts of 30–80 mmHg·s·cm across the test swallows"
              },
              {
                "label": "Trace appearance",
                "value": "Small pressure deflections, without a moving distal contraction peak"
              }
            ]
          },
          "sourceLabels": [
            "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
            "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
            "ACG clinical guideline: achalasia",
            "ACG esophageal physiologic testing guideline",
            "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
            "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102b.b04.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "The motor classification is appropriate, but proceeding to junction treatment before secondary-cause investigation closes the workup prematurely.",
              "sourceLabels": [
                "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
                "ACG clinical guideline: achalasia",
                "ACG esophageal physiologic testing guideline",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b04.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "IEM can include failed swallows; the discriminating problem here is impaired junction relaxation, not a requirement that IEM preserve effective contractions. CT addresses the separate secondary-cause question.",
              "sourceLabels": [
                "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
                "ACG clinical guideline: achalasia",
                "ACG esophageal physiologic testing guideline",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b04.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Failed swallows do not by themselves exclude IEM, but the raised relaxation pressure with failed peristalsis supports the achalasia pattern here. Junction treatment would also precede needed secondary-cause investigation.",
              "sourceLabels": [
                "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
                "ACG clinical guideline: achalasia",
                "ACG esophageal physiologic testing guideline",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
                "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.\n\nThe subsequent study supplies a stable junction-spanning acquisition. Raised junction relaxation pressure with failed peristalsis supports an achalasia motor pattern. IEM can contain failed swallows, but requires normal junction relaxation. Weight loss and marked endoscopic resistance require secondary-cause investigation before dilation. CT is one appropriate offered investigation; EUS may also be appropriate and is not a competing option in this set."
    },
    {
      "id": "case.gs028.varicose-veins.paired-aching-standing",
      "displayName": "Symptomatic varicose veins",
      "patientPresentationVariantId": "presentation.gs028.varicose-veins.paired-aching-standing.flags5r1.flags5r2",
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
      "chiefComplaint": "Aching leg veins",
      "presentation": "{patientName}, a 43-year-old woman, attends clinic for calf aching and prominent veins after standing at work.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.female.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old woman, attends clinic for calf aching and prominent veins after standing at work."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.male.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old man, attends clinic for calf aching and prominent veins after standing at work."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.female.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old woman, attends clinic for calf aching and prominent veins after standing at work."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.male.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old man, attends clinic for calf aching and prominent veins after standing at work."
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
          "id": "node.gs028.varicose-veins.paired-aching-standing.1",
          "questionVariantId": "question.varicose-veins.reflux-duplex-evaluation.v1",
          "primaryConceptId": "concept.varicose-veins.reflux-duplex-evaluation",
          "stem": "Which study should map the venous problem before treatment planning?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Venous reflux duplex",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.venous_duplex"
              }
            },
            {
              "id": "d1_1",
              "label": "Resting ankle-brachial index",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Lower-extremity CT",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "D-dimer assay",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": {
            "id": "gate.gs028.aching-standing",
            "resultTypeId": "service.venous_duplex",
            "pendingLabel": "Venous reflux duplex pending",
            "resultNarrative": "Duplex documents superficial axial reflux and no acute deep venous thrombosis.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.venous_duplex.in_house",
              "route.venous_duplex.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.gs028.varicose-veins.paired-aching-standing.2",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.r2",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "currentUpdate": "After discussing conservative and procedural approaches, {patientName} asks to pursue a venous intervention.",
          "stem": "Which plan should be offered now for {patientName}'s symptomatic varicose veins?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Refer to vascular surgery with interim compression",
              "isCorrect": true,
              "rationale": "Persistent troublesome symptoms with documented truncal reflux support intervention referral. Compression can be offered for symptom relief while the specialist plan is developed.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Require a compression course before vascular referral",
              "isCorrect": false,
              "rationale": "This choice makes compression a compulsory prerequisite. The mapped guideline does not require that course for every patient seeking intervention.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Prescribe ongoing compression with scheduled follow-up",
              "isCorrect": false,
              "rationale": "Conservative care remains reasonable, but does not implement this patient's informed request for intervention review. It is less appropriate than offering that review here.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Offer vascular referral for the symptomatic truncal reflux, with compression for symptom relief during the referral process. The wrong compression-course option makes treatment a compulsory prerequisite; stockings used in the interim are not the error. The specialist still determines the appropriate intervention.",
          "teachingPoint": "Offer vascular referral for the symptomatic truncal reflux, with compression for symptom relief during the referral process. The wrong compression-course option makes treatment a compulsory prerequisite; stockings used in the interim are not the error. The specialist still determines the appropriate intervention.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "This choice makes compression a compulsory prerequisite. The mapped guideline does not require that course for every patient seeking intervention.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Conservative care remains reasonable, but does not implement this patient's informed request for intervention review. It is less appropriate than offering that review here.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Duplex",
                "value": "Reflux extends through the great-saphenous trunk from the groin into the calf. The deep veins are compressible."
              },
              {
                "label": "Examination and function",
                "value": "Skin is intact; pedal pulses are palpable. Walking is unaided. Aching and heaviness interrupt usual activities requiring standing."
              }
            ]
          }
        }
      ],
      "learningSummary": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment. Offer vascular referral for the symptomatic truncal reflux, with compression for symptom relief during the referral process. The wrong compression-course option makes treatment a compulsory prerequisite; stockings used in the interim are not the error. The specialist still determines the appropriate intervention."
    },
    {
      "id": "case.gs028.varicose-veins.b-prefers-conservative",
      "displayName": "Symptomatic varicose veins",
      "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-prefers-conservative.flags5r1.flags5r2",
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
      "chiefComplaint": "Calf heaviness",
      "presentation": "{patientName}, a 43-year-old woman, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old woman, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
          "chiefComplaint": "Calf heaviness"
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old man, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
          "chiefComplaint": "Calf heaviness"
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old woman, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
          "chiefComplaint": "Calf heaviness"
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old man, attends clinic for calf heaviness and visible varicosities that limit standing at work. {patientName} asks about a procedure.",
          "chiefComplaint": "Calf heaviness"
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
          "id": "node.gs028.varicose-veins.b-prefers-conservative.1",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r3",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux.v2",
          "stem": "Which next step should guide treatment planning for {patientName}'s symptomatic varicose veins?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Arrange a complete venous reflux duplex",
              "isCorrect": true,
              "rationale": "The supplied compression study addresses acute deep-vein thrombosis, not the superficial/deep reflux map needed before selecting an intervention.",
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Arrange great-saphenous endovenous ablation",
              "isCorrect": false,
              "rationale": "The outside study has not established the truncal reflux anatomy on which this specific procedure would depend.",
              "serviceRequest": null
            },
            {
              "id": "d2_3",
              "label": "Require compression treatment before further investigation",
              "isCorrect": false,
              "rationale": "Compression can relieve symptoms, but is not a mandatory prerequisite to completing the diagnostic reflux assessment.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Review what the outside ultrasound measured. Compressible deep veins do not supply a reflux map. Obtain a complete reflux duplex before selecting a truncal procedure; a mandatory compression course is not a substitute for that assessment.",
          "teachingPoint": "Review what the outside ultrasound measured. Compressible deep veins do not supply a reflux map. Obtain a complete reflux duplex before selecting a truncal procedure; a mandatory compression course is not a substitute for that assessment.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "The outside study has not established the truncal reflux anatomy on which this specific procedure would depend.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Compression can relieve symptoms, but is not a mandatory prerequisite to completing the diagnostic reflux assessment.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Outside ultrasound: documented acquisition",
                "value": "Femoral and popliteal veins were examined with compression during an acute-DVT study."
              },
              {
                "label": "Saved observations",
                "value": "The deep veins compress completely. The saved series consists of B-mode views during compression."
              },
              {
                "label": "Examination",
                "value": "Prominent medial calf veins are visible when standing."
              }
            ]
          }
        }
      ],
      "learningSummary": "Review what the outside ultrasound measured. Compressible deep veins do not supply a reflux map. Obtain a complete reflux duplex before selecting a truncal procedure; a mandatory compression course is not a substitute for that assessment."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.paired-single-albumin.flags5r1",
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
      "chiefComplaint": "Surgery risk review",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43.flags5r1",
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
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43.flags5r1",
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
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68.flags5r1",
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
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68.flags5r1",
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
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1.r1",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which assessment and plan best fit {patientName}'s proposed hernia operation?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Changed liver state; optimize before elective repair",
              "isCorrect": true,
              "rationale": "The new fluid requires assessment of decompensation despite the albumin result; the reducing hernia permits a nonurgent optimization plan.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Changed liver state; proceed with elective repair",
              "isCorrect": false,
              "rationale": "Recognizing the changed state should change the elective plan rather than leave clearance unchanged.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Stable liver state; optimize before elective repair",
              "isCorrect": false,
              "rationale": "Optimization is the appropriate direction, but the record does not show an unchanged liver-related state.",
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "Stable liver state; proceed with elective repair",
              "isCorrect": false,
              "rationale": "A reassuring albumin does not account for the new fluid or justify unchanged elective clearance.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery.",
          "teachingPoint": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Interval examination",
                "value": "Abdominal girth has increased; shifting dullness is present."
              },
              {
                "label": "Abdominal ultrasound",
                "value": "New free intraperitoneal fluid."
              },
              {
                "label": "Hernia examination",
                "value": "Soft, nontender bulge that reduces when supine."
              }
            ]
          },
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": []
        },
        {
          "id": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
          "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r3",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
          "currentUpdate": "Before the planned liver-team visit, {patientName} develops vomiting and increasing pain at the umbilical bulge. The bulge no longer reduces. CT shows bowel within the hernia, dilated upstream bowel and collapsed downstream bowel.",
          "stem": "Which next step should be arranged for {patientName}'s changed abdominal findings?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Urgent hospital surgical assessment",
              "isCorrect": true,
              "rationale": "New pain, irreducibility, vomiting and the bowel transition change the problem from nonurgent optimization to an acute surgical assessment.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Expedited outpatient therapeutic paracentesis",
              "isCorrect": false,
              "rationale": "Addressing ascites does not resolve the new incarcerated bowel-containing hernia and obstructive pattern.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Scheduled hepatology–anesthesia optimization",
              "isCorrect": false,
              "rationale": "That was appropriate for the earlier reducing, nonurgent hernia, but the new clinical and CT findings require a different sequence.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation.",
          "teachingPoint": "The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Addressing ascites does not resolve the new incarcerated bowel-containing hernia and obstructive pattern.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "That was appropriate for the earlier reducing, nonurgent hernia, but the new clinical and CT findings require a different sequence.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ]
        }
      ],
      "learningSummary": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery. The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-compensated",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-compensated.flags5r1.flags5r2",
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
      "chiefComplaint": "Elective surgery planning",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective repair of a reducible umbilical hernia. The planned operation and liver laboratory results are unchanged from the previous review.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective repair of a reducible umbilical hernia. The planned operation and liver laboratory results are unchanged from the previous review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective repair of a reducible umbilical hernia. The planned operation and liver laboratory results are unchanged from the previous review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective repair of a reducible umbilical hernia. The planned operation and liver laboratory results are unchanged from the previous review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective repair of a reducible umbilical hernia. The planned operation and liver laboratory results are unchanged from the previous review."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-compensated.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2.r2",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which plan should be offered for {patientName}'s scheduled hernia repair?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Defer repair for hepatology-led control of the fluid accumulation",
              "isCorrect": true,
              "rationale": "Reaccumulation indicates that draining the fluid did not establish sustained control of the liver-related state. The hernia remains nonurgent.",
              "serviceRequest": null
            },
            {
              "id": "d1_2",
              "label": "Drain the fluid again and proceed directly with the scheduled repair",
              "isCorrect": false,
              "rationale": "A single drainage procedure does not by itself establish control of the ongoing decompensation before a nonurgent operation.",
              "serviceRequest": null
            },
            {
              "id": "d2_2",
              "label": "Proceed with repair using postoperative inpatient monitoring",
              "isCorrect": false,
              "rationale": "Monitoring after surgery does not substitute for addressing the current decompensation before this elective repair.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The relevant change is the clinical course, not the laboratory trend: the fluid has reaccumulated. For this nonurgent reducing hernia, defer the booking while hepatology and the perioperative team address that state. Repeating drainage immediately before surgery or adding postoperative monitoring does not establish preoperative control.",
          "teachingPoint": "The relevant change is the clinical course, not the laboratory trend: the fluid has reaccumulated. For this nonurgent reducing hernia, defer the booking while hepatology and the perioperative team address that state. Repeating drainage immediately before surgery or adding postoperative monitoring does not establish preoperative control.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Interval treatment record",
                "value": "Abdominal fluid was drained; girth decreased after drainage."
              },
              {
                "label": "Current examination and ultrasound",
                "value": "Girth has increased again, with free abdominal fluid on ultrasound. The hernia reduces when supine and is nontender."
              },
              {
                "label": "Bowel function",
                "value": "Eating and passing stool without vomiting."
              }
            ]
          },
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "A single drainage procedure does not by itself establish control of the ongoing decompensation before a nonurgent operation.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Monitoring after surgery does not substitute for addressing the current decompensation before this elective repair.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The relevant change is the clinical course, not the laboratory trend: the fluid has reaccumulated. For this nonurgent reducing hernia, defer the booking while hepatology and the perioperative team address that state. Repeating drainage immediately before surgery or adding postoperative monitoring does not establish preoperative control."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension.flags5r1.flags5r2",
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
      "chiefComplaint": "Preoperative cirrhosis consult",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective hernia repair. Albumin, bilirubin and INR are similar to those at the previous review.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective hernia repair. Albumin, bilirubin and INR are similar to those at the previous review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective hernia repair. Albumin, bilirubin and INR are similar to those at the previous review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective hernia repair. Albumin, bilirubin and INR are similar to those at the previous review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective hernia repair. Albumin, bilirubin and INR are similar to those at the previous review."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r8",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which plan should be arranged for {patientName}'s scheduled hernia repair?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Postpone repair and arrange hospital medical evaluation",
              "isCorrect": true,
              "rationale": "The changed function and examination require assessment for decompensation or another acute cause, despite stable laboratory results.",
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Proceed with repair after repeating liver chemistry tests",
              "isCorrect": false,
              "rationale": "Repeating selected laboratory tests does not resolve the new functional and examination findings.",
              "serviceRequest": null
            },
            {
              "id": "d2_3",
              "label": "Proceed with repair using postoperative inpatient monitoring",
              "isCorrect": false,
              "rationale": "A postoperative bed does not replace evaluation of a new clinical change before an elective procedure.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The new cognitive and postural findings change elective readiness even though selected liver tests are stable. Postpone the nonurgent repair and arrange medical evaluation for decompensation or another acute cause. The case does not diagnose every cognitive change as hepatic encephalopathy or prescribe its treatment.",
          "teachingPoint": "The new cognitive and postural findings change elective readiness even though selected liver tests are stable. Postpone the nonurgent repair and arrange medical evaluation for decompensation or another acute cause. The case does not diagnose every cognitive change as hepatic encephalopathy or prescribe its treatment.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Family and staff observations",
                "value": "{patientName} is newly unable to follow the usual conversation and gives the wrong location for the clinic."
              },
              {
                "label": "Examination",
                "value": "When the arms are held out, the wrists repeatedly drop and recover."
              },
              {
                "label": "Hernia",
                "value": "Soft and reducible; eating and passing stool without vomiting."
              }
            ]
          },
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Repeating selected laboratory tests does not resolve the new functional and examination findings.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "A postoperative bed does not replace evaluation of a new clinical change before an elective procedure.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The new cognitive and postural findings change elective readiness even though selected liver tests are stable. Postpone the nonurgent repair and arrange medical evaluation for decompensation or another acute cause. The case does not diagnose every cognitive change as hepatic encephalopathy or prescribe its treatment."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-center-expertise",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-center-expertise.flags5r1",
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
      "chiefComplaint": "Where to have surgery",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.43.flags5r1",
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
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.43.flags5r1",
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
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.68.flags5r1",
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
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.68.flags5r1",
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
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-center-expertise.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4.r1",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which timing and care-setting plan best fits {patientName}'s operation?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Optimize first; arrange surgery at a cirrhosis-experienced center",
              "isCorrect": true,
              "rationale": "The changed liver-related state calls for optimization; the reconstruction also warrants an experienced multidisciplinary setting.",
              "serviceRequest": null
            },
            {
              "id": "d1_4",
              "label": "Operate now; arrange surgery at a cirrhosis-experienced center",
              "isCorrect": false,
              "rationale": "A suitable setting does not remove the need to assess and optimize the new fluid before a nonurgent operation.",
              "serviceRequest": null
            },
            {
              "id": "d2_4",
              "label": "Optimize first; arrange surgery at the referring general hospital",
              "isCorrect": false,
              "rationale": "Optimization is appropriate, but the planned reconstruction and cirrhosis still require review of center experience and rescue resources.",
              "serviceRequest": null
            },
            {
              "id": "d3_4",
              "label": "Operate now; arrange surgery at the referring general hospital",
              "isCorrect": false,
              "rationale": "Neither the interval liver-related change nor the planned setting has been adequately incorporated.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance.",
          "teachingPoint": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Interval findings",
                "value": "New abdominal free fluid on ultrasound and increasing abdominal girth."
              },
              {
                "label": "Operation",
                "value": "Nonurgent; no obstruction or active bleeding is described."
              },
              {
                "label": "Referring hospital",
                "value": "An inpatient surgical ward and intensive care are present. The team performs few operations in patients with cirrhosis; postoperative liver-related complications are transferred to the regional hepatology center."
              }
            ]
          },
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "A suitable setting does not remove the need to assess and optimize the new fluid before a nonurgent operation.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Optimization is appropriate, but the planned reconstruction and cirrhosis still require review of center experience and rescue resources.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d3_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Neither the interval liver-related change nor the planned setting has been adequately incorporated.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance."
    },
    {
      "id": "case.gs028b.ptld.b-pathology-returned",
      "displayName": "Owner review for Nora Reed",
      "patientPresentationVariantId": "presentation.owner-decisions.20261112.ptld-biopsy.v2.flags5r1.flags5r2",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Enlarging neck node",
      "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular node. An outside core showed atypical lymphoid cells but insufficient architecture for classification. The node is superficial and mobile; surgical review records acceptable operative risk.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.owner-decisions.20261112.ptld-biopsy.v2.flags5r1.flags5r2",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Enlarging neck node",
          "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular node. An outside core showed atypical lymphoid cells but insufficient architecture for classification. The node is superficial and mobile; surgical review records acceptable operative risk."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Comprehensive review of PTLD after solid organ transplantation",
        "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.ptld.b-pathology-returned.1",
          "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r6",
          "primaryConceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
          "stem": "Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?",
          "answerChoices": [
            {
              "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
              "label": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
              "isCorrect": true,
              "rationale": "Excision addresses inadequate architecture; allocated fresh and fixed tissue meets the two actual laboratory requests.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
              "label": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
              "isCorrect": false,
              "rationale": "A further core with appropriate allocation is a possible approach in selected circumstances, but the accessible node and prior architecture failure favor excision in this case.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
              "label": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
              "isCorrect": false,
              "rationale": "Whole-specimen fixation can support histological PTLD diagnosis, but would not preserve viable cells for the flow study actually requested under this protocol.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
              "label": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
              "isCorrect": false,
              "rationale": "Whole-specimen fixation can support histological PTLD diagnosis, but would not preserve viable cells for the flow study actually requested under this protocol.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Excision provides architecture after the inadequate core. Follow the agreed hematopathology allocation protocol so that viable tissue is retained for the specifically requested flow study and a portion is fixed for histology. Formalin-fixed tissue can support a PTLD diagnosis; the problem with fixing the whole specimen here is loss of viable cells for this requested assay, not an inability to diagnose PTLD from fixed histology.",
          "teachingPoint": "Excision provides architecture after the inadequate core. Follow the agreed hematopathology allocation protocol so that viable tissue is retained for the specifically requested flow study and a portion is fixed for histology. Formalin-fixed tissue can support a PTLD diagnosis; the problem with fixing the whole specimen here is loss of viable cells for this requested assay, not an inability to diagnose PTLD from fixed histology.",
          "sourceLabels": [
            "Comprehensive review of PTLD after solid organ transplantation",
            "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "A further core with appropriate allocation is a possible approach in selected circumstances, but the accessible node and prior architecture failure favor excision in this case.",
              "sourceLabels": [
                "Comprehensive review of PTLD after solid organ transplantation",
                "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
              ]
            },
            {
              "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Whole-specimen fixation can support histological PTLD diagnosis, but would not preserve viable cells for the flow study actually requested under this protocol.",
              "sourceLabels": [
                "Comprehensive review of PTLD after solid organ transplantation",
                "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
              ]
            },
            {
              "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Whole-specimen fixation can support histological PTLD diagnosis, but would not preserve viable cells for the flow study actually requested under this protocol.",
              "sourceLabels": [
                "Comprehensive review of PTLD after solid organ transplantation",
                "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Agreed hematopathology studies for this biopsy",
                "value": "Architectural histology and flow cytometry on viable cells."
              }
            ]
          }
        }
      ],
      "learningSummary": "Excision provides architecture after the inadequate core. Follow the agreed hematopathology allocation protocol so that viable tissue is retained for the specifically requested flow study and a portion is fixed for histology. Formalin-fixed tissue can support a PTLD diagnosis; the problem with fixing the whole specimen here is loss of viable cells for this requested assay, not an inability to diagnose PTLD from fixed histology."
    },
    {
      "id": "case.gs028se.p2e.capacity-refusal.v4.varicose",
      "displayName": "Ethics and communication",
      "patientPresentationVariantId": "presentation.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Supported treatment decision",
      "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.68",
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
          "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.68",
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
          "presentation": "{patientName}, a 68-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 58-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.58",
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
          "presentation": "{patientName}, a 58-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Informed Consent",
        "Decisions for Adult Patients Who Lack Capacity",
        "SVS/AVF/AVLS varicose veins guideline Part II"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.p2e.capacity-refusal.v4.varicose.1",
          "questionVariantId": "question.statistics-ethics.capacity-refusal.v4",
          "primaryConceptId": "concept.statistics-ethics.capacity-refusal",
          "stem": "How should the team approach {patientName}'s decision about a varicose-vein intervention when mild cognitive impairment is recorded but supported understanding is demonstrated?",
          "answerChoices": [
            {
              "id": "key-4",
              "label": "Support and assess the patient's own decision",
              "isCorrect": true,
              "rationale": "Support understanding and assess the patient's own abilities for vein intervention. The described informed, consistent choice should not be displaced solely by the cognitive diagnosis.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-1",
              "label": "Obtain a surrogate's decision because of the diagnosis",
              "isCorrect": false,
              "rationale": "Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-2",
              "label": "Require a family countersignature for this consent",
              "isCorrect": false,
              "rationale": "A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-3",
              "label": "Require formal testing before discussing the choice",
              "isCorrect": false,
              "rationale": "The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded.",
          "teachingPoint": "Cognitive impairment does not remove capacity for every decision. Support understanding and assess the patient's actual abilities for this choice before seeking a substitute decision-maker. Plain language enables an informed, consistent choice. Remember that the diagnosis and the decision are separate questions; a label alone does not transfer authority to family or a surrogate.",
          "sourceLabels": [
            "Informed Consent",
            "Decisions for Adult Patients Who Lack Capacity",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": []
        },
        {
          "id": "node.gs028se.p2e.capacity-refusal.v4.varicose.2",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4.r2",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "currentUpdate": "{patientName} continues to request a procedure after reviewing compression and intervention options.",
          "stem": "Which plan should be offered now for {patientName}'s symptomatic varicose veins?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Refer to vascular surgery with interim compression",
              "isCorrect": true,
              "rationale": "Persistent troublesome symptoms with documented truncal reflux support intervention referral. Compression can be offered for symptom relief while the specialist plan is developed.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Require a compression course before vascular referral",
              "isCorrect": false,
              "rationale": "This choice makes compression a compulsory prerequisite. The mapped guideline does not require that course for every patient seeking intervention.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Prescribe ongoing compression with scheduled follow-up",
              "isCorrect": false,
              "rationale": "Conservative care remains reasonable, but does not implement this patient's informed request for intervention review. It is less appropriate than offering that review here.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Capacity and clinical indication are separate. The symptomatic truncal reflux supports vascular referral for the patient's informed treatment choice. Compression may relieve symptoms while awaiting review; it need not be completed as a compulsory course before referral. The exact procedure remains a specialist anatomy decision.",
          "teachingPoint": "Capacity and clinical indication are separate. The symptomatic truncal reflux supports vascular referral for the patient's informed treatment choice. Compression may relieve symptoms while awaiting review; it need not be completed as a compulsory course before referral. The exact procedure remains a specialist anatomy decision.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II",
            "Informed Consent",
            "Decisions for Adult Patients Who Lack Capacity"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "This choice makes compression a compulsory prerequisite. The mapped guideline does not require that course for every patient seeking intervention.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II",
                "Informed Consent",
                "Decisions for Adult Patients Who Lack Capacity"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Conservative care remains reasonable, but does not implement this patient's informed request for intervention review. It is less appropriate than offering that review here.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II",
                "Informed Consent",
                "Decisions for Adult Patients Who Lack Capacity"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Duplex",
                "value": "Reflux extends through the great-saphenous trunk from the groin into the calf. The deep veins are compressible."
              },
              {
                "label": "Examination and function",
                "value": "Skin is intact; pedal pulses are palpable. Walking is unaided. Aching and heaviness interrupt usual activities requiring standing."
              }
            ]
          }
        }
      ],
      "learningSummary": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded. Capacity and clinical indication are separate. The symptomatic truncal reflux supports vascular referral for the patient's informed treatment choice. Compression may relieve symptoms while awaiting review; it need not be completed as a compulsory course before referral. The exact procedure remains a specialist anatomy decision."
    },
    {
      "id": "case.gs028c.palpable-breast.paired-scar-edge",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge.flags5r1.flags5r2",
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
      "chiefComplaint": "Lump near an old scar",
      "presentation": "{patientName}, a 49-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 49-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar."
        },
        {
          "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63.flags5r1.flags5r2",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old woman, attends clinic with a new discrete breast lump near a remote benign surgical scar."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.paired-scar-edge.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r3",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which diagnostic plan should be arranged for {patientName}'s new breast lump?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Repeat targeted ultrasound of the marked site",
              "isCorrect": true,
              "rationale": "The supplied benign finding does not correspond to the current clinical target. Obtain site-concordant ultrasound before choosing a further pathway.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_2",
              "label": "Schedule clinical examination follow-up of the marked site",
              "isCorrect": false,
              "rationale": "The outside benign result cannot support observation of a different, persistent clinical target.",
              "serviceRequest": null
            },
            {
              "id": "d2_2",
              "label": "Obtain MRI of the marked site before repeat ultrasound",
              "isCorrect": false,
              "rationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Match the clinical marker to the saved imaging location. The outside ultrasound describes the old operative site closer to the nipple, not the new scar-edge target. Request ultrasound directed to the current marker. That result cannot be replaced by reassurance from the postoperative cavity or by jumping to MRI.",
          "teachingPoint": "Match the clinical marker to the saved imaging location. The outside ultrasound describes the old operative site closer to the nipple, not the new scar-edge target. Request ultrasound directed to the current marker. That result cannot be replaced by reassurance from the postoperative cavity or by jumping to MRI.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Surgeon's skin marker",
                "value": "10 o'clock, 5 cm from the nipple; the new palpable lump is at the scar edge."
              },
              {
                "label": "Diagnostic mammogram",
                "value": "Marker included. Stable postoperative distortion closer to the nipple; no mass or suspicious calcifications at the new marker."
              },
              {
                "label": "Outside ultrasound images",
                "value": "Labelled 10 o'clock, 2 cm from the nipple; a superficial postoperative cavity is shown."
              }
            ]
          },
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": {
            "id": "gate.gs028c.scar-edge",
            "resultTypeId": "service.ultrasound",
            "pendingLabel": "Focused scar-edge ultrasound pending",
            "resultNarrative": "Ultrasound at the new surgeon-marked palpable site shows no corresponding solid or cystic lesion. The hard, irregular mass remains palpable at that site.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.ultrasound.in_house",
              "route.ultrasound.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.gs028c.palpable-breast.paired-scar-edge.2",
          "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r3",
          "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "currentUpdate": "Ultrasound of the new surgeon-marked site shows no corresponding solid or cystic lesion. The same hard, irregular mass can be localized between the surgeon's examining fingers; it is separate from the superficial operative cavity.",
          "stem": "Which diagnostic plan should be arranged for {patientName}'s breast mass?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Arrange palpation-directed core biopsy",
              "isCorrect": true,
              "rationale": "The clinically concerning palpable target warrants tissue evaluation despite site-concordant imaging showing no correlate. Palpation-directed core biopsy is a specific offered tissue plan; adequacy and clinical-pathologic concordance still require review.",
              "serviceRequest": null
            },
            {
              "id": "d1_2",
              "label": "Arrange contrast breast MRI",
              "isCorrect": false,
              "rationale": "MRI may be useful for selected problems, but it does not replace indicated tissue evaluation of this persistent clinically concerning palpable target.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d2_2",
              "label": "Arrange short-interval clinical examination",
              "isCorrect": false,
              "rationale": "Clinical observation can suit a concordantly reassuring finding. Here the examination remains concerning despite the imaging record; interval observation does not resolve that discordance.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The hard, irregular target is separate from the superficial postoperative cavity. Site-concordant imaging has not explained that examination finding. Arrange tissue evaluation rather than MRI-first triage or interval observation. The offered palpation-directed core plan is specific; adequacy and clinical-pathologic concordance still require specialist review.",
          "teachingPoint": "The hard, irregular target is separate from the superficial postoperative cavity. Site-concordant imaging has not explained that examination finding. Arrange tissue evaluation rather than MRI-first triage or interval observation. The offered palpation-directed core plan is specific; adequacy and clinical-pathologic concordance still require specialist review.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the examination and imaging concordance before continuing.",
              "clinicalRationale": "MRI may be useful for selected problems, but it does not replace indicated tissue evaluation of this persistent clinically concerning palpable target.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the examination and imaging concordance before continuing.",
              "clinicalRationale": "Clinical observation can suit a concordantly reassuring finding. Here the examination remains concerning despite the imaging record; interval observation does not resolve that discordance.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Match the clinical marker to the saved imaging location. The outside ultrasound describes the old operative site closer to the nipple, not the new scar-edge target. Request ultrasound directed to the current marker. That result cannot be replaced by reassurance from the postoperative cavity or by jumping to MRI.\n\nThe hard, irregular target is separate from the superficial postoperative cavity. Site-concordant imaging has not explained that examination finding. Arrange tissue evaluation rather than MRI-first triage or interval observation. The offered palpation-directed core plan is specific; adequacy and clinical-pathologic concordance still require specialist review."
    },
    {
      "id": "case.gs028c.palpable-breast.a-recent-negative",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-recent-negative.flags5r1.flags5r2",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Lump after normal imaging",
      "presentation": "{patientName}, a 42-year-old woman, attends clinic for a reproducible left breast lump. A benign outside biopsy report accompanied the referral.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.a-recent-negative.female.42.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 42-year-old woman, attends clinic for a reproducible left breast lump. A benign outside biopsy report accompanied the referral."
        },
        {
          "id": "profile.gs028c.palpable-breast.a-recent-negative.female.55.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 55-year-old woman, attends clinic for a reproducible left breast lump. A benign outside biopsy report accompanied the referral."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.a-recent-negative.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r3",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which diagnostic plan should be arranged for {patientName}'s palpable breast finding?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Arrange targeted ultrasound of the marked site",
              "isCorrect": true,
              "rationale": "The supplied benign finding does not correspond to the current clinical target. Obtain site-concordant ultrasound before choosing a further pathway.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_3",
              "label": "Arrange clinical examination follow-up of the marked site",
              "isCorrect": false,
              "rationale": "The outside benign result cannot support observation of a different, persistent clinical target.",
              "serviceRequest": null
            },
            {
              "id": "d2_3",
              "label": "Arrange breast MRI of the marked site",
              "isCorrect": false,
              "rationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The benign specimen belongs to the separate upper-breast target. It does not explain the currently marked lower-breast lump. Arrange targeted ultrasound of the clinical site rather than transferring the benign result to it or substituting MRI for that step.",
          "teachingPoint": "The benign specimen belongs to the separate upper-breast target. It does not explain the currently marked lower-breast lump. Arrange targeted ultrasound of the clinical site rather than transferring the benign result to it or substituting MRI for that step.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Current examination marker",
                "value": "Left breast, 6 o'clock, 5 cm from the nipple."
              },
              {
                "label": "Outside biopsy and procedure images",
                "value": "Core samples labelled left breast, 11 o'clock, 1 cm from the nipple; fibroadenoma on histology."
              },
              {
                "label": "Diagnostic mammogram",
                "value": "The current skin marker is included; no corresponding mass, distortion or suspicious calcifications."
              }
            ]
          },
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "The outside benign result cannot support observation of a different, persistent clinical target.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The benign specimen belongs to the separate upper-breast target. It does not explain the currently marked lower-breast lump. Arrange targeted ultrasound of the clinical site rather than transferring the benign result to it or substituting MRI for that step."
    },
    {
      "id": "case.gs028c.palpable-breast.a-discordant-exam",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-discordant-exam.flags5r1.flags5r2",
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
      "chiefComplaint": "Breast thickening",
      "presentation": "{patientName}, a 47-year-old woman, attends clinic for a persistent focal area of breast thickening beneath a small skin papule.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 47-year-old woman, attends clinic for a persistent focal area of breast thickening beneath a small skin papule.",
          "chiefComplaint": "Breast thickening"
        },
        {
          "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 61-year-old woman, attends clinic for a persistent focal area of breast thickening beneath a small skin papule.",
          "chiefComplaint": "Breast thickening"
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.a-discordant-exam.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r5",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which diagnostic plan should be arranged for {patientName}'s persistent breast finding?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Repeat targeted ultrasound of the marked site",
              "isCorrect": true,
              "rationale": "The supplied benign finding does not correspond to the current clinical target. Obtain site-concordant ultrasound before choosing a further pathway.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_4",
              "label": "Schedule clinical examination follow-up of the marked site",
              "isCorrect": false,
              "rationale": "The outside benign result cannot support observation of a different, persistent clinical target.",
              "serviceRequest": null
            },
            {
              "id": "d2_4",
              "label": "Obtain MRI of the marked site before repeat ultrasound",
              "isCorrect": false,
              "rationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The superficial dermal finding does not account for the separately mobile deeper clinical target. Direct ultrasound to the deeper palpable area before treating the cyst result as concordant reassurance or escalating to MRI. The complaint describes the symptom, not an imaging interpretation.",
          "teachingPoint": "The superficial dermal finding does not account for the separately mobile deeper clinical target. Direct ultrasound to the deeper palpable area before treating the cyst result as concordant reassurance or escalating to MRI. The complaint describes the symptom, not an imaging interpretation.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Diagnostic mammogram",
                "value": "The palpable skin marker is included; no focal density, distortion or suspicious calcifications."
              },
              {
                "label": "Outside ultrasound worksheet",
                "value": "Target recorded as the skin papule. Saved images show a small intradermal cyst."
              },
              {
                "label": "Surgeon's examination",
                "value": "The deeper palpable thickening moves separately from the overlying papule and remains reproducible."
              }
            ]
          },
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "The outside benign result cannot support observation of a different, persistent clinical target.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "A problem-solving MRI does not replace site-concordant initial ultrasound evaluation in this record.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The superficial dermal finding does not account for the separately mobile deeper clinical target. Direct ultrasound to the deeper palpable area before treating the cyst result as concordant reassurance or escalating to MRI. The complaint describes the symptom, not an imaging interpretation."
    },
    {
      "id": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-enlarging-negative-imaging.flags5r1.flags5r2",
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
      "chiefComplaint": "Enlarging breast mass",
      "presentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.43.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
        },
        {
          "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.57.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 57-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
          "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r3",
          "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "stem": "Which diagnostic plan should be arranged for {patientName}'s breast mass?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Arrange palpation-directed core biopsy",
              "isCorrect": true,
              "rationale": "The clinically concerning palpable target warrants tissue evaluation despite site-concordant imaging showing no correlate. Palpation-directed core biopsy is a specific offered tissue plan; adequacy and clinical-pathologic concordance still require review.",
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Arrange contrast breast MRI",
              "isCorrect": false,
              "rationale": "MRI may be useful for selected problems, but it does not replace indicated tissue evaluation of this persistent clinically concerning palpable target.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d2_3",
              "label": "Arrange short-interval clinical examination",
              "isCorrect": false,
              "rationale": "Clinical observation can suit a concordantly reassuring finding. Here the examination remains concerning despite the imaging record; interval observation does not resolve that discordance.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The palpable mass has enlarged despite imaging of the correct site showing no correlate. That progression makes reassurance from imaging insufficient. Arrange tissue evaluation rather than MRI-first triage or interval observation. Palpation-directed core sampling is the specific offered plan; adequacy and clinical-pathologic concordance still require review.",
          "teachingPoint": "The palpable mass has enlarged despite imaging of the correct site showing no correlate. That progression makes reassurance from imaging insufficient. Arrange tissue evaluation rather than MRI-first triage or interval observation. Palpation-directed core sampling is the specific offered plan; adequacy and clinical-pathologic concordance still require review.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Diagnostic mammogram",
                "value": "The palpable marker is included; no corresponding mass, distortion or suspicious calcifications."
              },
              {
                "label": "Targeted ultrasound",
                "value": "The surgeon's marked site was scanned; no corresponding solid or cystic lesion."
              },
              {
                "label": "Repeat examination",
                "value": "The same mass remains readily localized by touch, is larger than previously and moves separately from the skin."
              }
            ]
          },
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the examination and imaging concordance before continuing.",
              "clinicalRationale": "MRI may be useful for selected problems, but it does not replace indicated tissue evaluation of this persistent clinically concerning palpable target.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the examination and imaging concordance before continuing.",
              "clinicalRationale": "Clinical observation can suit a concordantly reassuring finding. Here the examination remains concerning despite the imaging record; interval observation does not resolve that discordance.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The palpable mass has enlarged despite imaging of the correct site showing no correlate. That progression makes reassurance from imaging insufficient. Arrange tissue evaluation rather than MRI-first triage or interval observation. Palpation-directed core sampling is the specific offered plan; adequacy and clinical-pathologic concordance still require review."
    },
    {
      "id": "case.gs028d.anesthesia.a-snoring-surgery",
      "displayName": "Preanesthetic planning",
      "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-snoring-surgery.flags5r1.flags5r2",
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
      "chiefComplaint": "Surgery sleep screening",
      "presentation": "{patientName}, a 44-year-old woman, attends clinic before abdominal surgery. {patientName}'s partner describes loud snoring interrupted by breathing pauses. Daytime alertness is preserved during desk work.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.44.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 44-year-old woman, attends clinic before abdominal surgery. {patientName}'s partner describes loud snoring interrupted by breathing pauses. Daytime alertness is preserved during desk work."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.44.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 44-year-old man, attends clinic before abdominal surgery. {patientName}'s partner describes loud snoring interrupted by breathing pauses. Daytime alertness is preserved during desk work."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.63.flags5r1.flags5r2",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old woman, attends clinic before abdominal surgery. {patientName}'s partner describes loud snoring interrupted by breathing pauses. Daytime alertness is preserved during desk work."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.63.flags5r1.flags5r2",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old man, attends clinic before abdominal surgery. {patientName}'s partner describes loud snoring interrupted by breathing pauses. Daytime alertness is preserved during desk work."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
        "JSA guideline for management of malignant hyperthermia in 2025",
        "Perioperative Management of MH Suspected or Susceptible Patients"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028d.anesthesia.a-snoring-surgery.1",
          "questionVariantId": "question.preoperative-osa.validated-risk-screening.v1.r2",
          "primaryConceptId": "concept.preoperative-osa.validated-risk-screening",
          "stem": "Which handoff should be sent for {patientName}'s preoperative anesthesia planning?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Report suspected OSA and request perioperative risk planning",
              "isCorrect": true,
              "rationale": "The breathing history warrants a suspected-OSA handoff even without daytime sleepiness; it is not a confirmed diagnosis.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Report low sleep-related risk and request routine planning",
              "isCorrect": false,
              "rationale": "Daytime alertness does not negate the witnessed nocturnal breathing history.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Report confirmed OSA and request CPAP initiation",
              "isCorrect": false,
              "rationale": "The clinical history warrants assessment and communication but does not establish the diagnosis or an individualized CPAP prescription.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Interpret the witnessed breathing pauses separately from daytime alertness. Communicate suspected OSA to anesthesia for perioperative planning. This is a risk handoff, not a definitive diagnosis, a CPAP prescription or automatic clearance to proceed.",
          "teachingPoint": "Interpret the witnessed breathing pauses separately from daytime alertness. Communicate suspected OSA to anesthesia for perioperative planning. This is a risk handoff, not a definitive diagnosis, a CPAP prescription or automatic clearance to proceed.",
          "sourceLabels": [
            "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Daytime alertness does not negate the witnessed nocturnal breathing history.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "The clinical history warrants assessment and communication but does not establish the diagnosis or an individualized CPAP prescription.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Interpret the witnessed breathing pauses separately from daytime alertness. Communicate suspected OSA to anesthesia for perioperative planning. This is a risk handoff, not a definitive diagnosis, a CPAP prescription or automatic clearance to proceed."
    },
    {
      "id": "case.gs028d.anesthesia.a-validated-not-impression",
      "displayName": "Preanesthetic planning",
      "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression.flags5r1.flags5r2",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Preop sleep concern",
      "presentation": "{patientName}, a 46-year-old woman, attends clinic before abdominal surgery with snoring and fatigue. The referring problem list includes obstructive sleep apnea.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 46-year-old woman, attends clinic before abdominal surgery with snoring and fatigue. The referring problem list includes obstructive sleep apnea."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 46-year-old man, attends clinic before abdominal surgery with snoring and fatigue. The referring problem list includes obstructive sleep apnea."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old woman, attends clinic before abdominal surgery with snoring and fatigue. The referring problem list includes obstructive sleep apnea."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68.flags5r1.flags5r2",
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
          "presentation": "{patientName}, a 68-year-old man, attends clinic before abdominal surgery with snoring and fatigue. The referring problem list includes obstructive sleep apnea."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
        "JSA guideline for management of malignant hyperthermia in 2025",
        "Perioperative Management of MH Suspected or Susceptible Patients"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028d.anesthesia.a-validated-not-impression.1",
          "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r7",
          "primaryConceptId": "concept.preoperative-osa.validated-risk-screening",
          "stem": "Which plan should follow reconciliation of {patientName}'s OSA entry?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Record suspected OSA; request an anesthesia consultation",
              "isCorrect": true,
              "rationale": "The attached document measures daytime sleepiness rather than confirming nocturnal apnea. A validated OSA-probability screen and handoff address perioperative risk.",
              "serviceRequest": null
            },
            {
              "id": "d1_4",
              "label": "Retain confirmed OSA; request CPAP initiation before surgery",
              "isCorrect": false,
              "rationale": "The problem-list label is not supported as a confirmed diagnosis by the attached office questionnaire.",
              "serviceRequest": null
            },
            {
              "id": "d2_4",
              "label": "Record simple snoring; request routine anesthesia planning",
              "isCorrect": false,
              "rationale": "Failure to establish a diagnosis does not establish absence of OSA risk; the symptoms still warrant a risk screen.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Check the source of the problem-list entry: the attached office questionnaire measures daytime sleepiness. It is not diagnostic confirmation of OSA. Record the diagnostic uncertainty, complete validated OSA-probability screening and communicate the findings to anesthesia. Neither a confirmed-OSA treatment label nor dismissal as simple snoring follows from that record.",
          "teachingPoint": "Check the source of the problem-list entry: the attached office questionnaire measures daytime sleepiness. It is not diagnostic confirmation of OSA. Record the diagnostic uncertainty, complete validated OSA-probability screening and communicate the findings to anesthesia. Neither a confirmed-OSA treatment label nor dismissal as simple snoring follows from that record.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Record attached to the OSA entry",
                "value": "An office questionnaire recording self-rated likelihood of dozing during daily activities."
              },
              {
                "label": "Acquisition described in that record",
                "value": "Patient-completed answers during the office visit."
              }
            ]
          },
          "sourceLabels": [
            "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "The problem-list label is not supported as a confirmed diagnosis by the attached office questionnaire.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Failure to establish a diagnosis does not establish absence of OSA risk; the symptoms still warrant a risk screen.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Check the source of the problem-list entry: the attached office questionnaire measures daytime sleepiness. It is not diagnostic confirmation of OSA. Record the diagnostic uncertainty, complete validated OSA-probability screening and communicate the findings to anesthesia. Neither a confirmed-OSA treatment label nor dismissal as simple snoring follows from that record."
    },
    {
      "id": "case.lymphangitis.toe-inguinal",
      "displayName": "Clinic Patient: Toe Streak",
      "patientPresentationVariantId": "presentation.lymphangitis.toe-inguinal",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "chiefComplaint": "Tender red track",
      "presentation": "{patientName}, a 35-year-old woman, attends clinic with a blister on a toe. A tender red track extends from the foot toward tender groin nodes.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "MSD Manual Professional: Lymphangitis, reviewed May 2026"
      ],
      "decisionNodes": [
        {
          "id": "node.lymphangitis.toe-inguinal.v1",
          "questionVariantId": "question.lymphangitis.toe-inguinal.v1.r1",
          "primaryConceptId": "concept.lymphangitis.acute-clinical-recognition",
          "stem": "Which diagnosis best explains {patientName}'s red track and regional node tenderness?",
          "answerChoices": [
            {
              "id": "acute_lymphangitis",
              "label": "Acute lymphangitis",
              "isCorrect": true,
              "rationale": "The skin entry, tender proximal track and tender regional nodes form the mapped lymphangitis recognition pattern.",
              "serviceRequest": null
            },
            {
              "id": "localized_blister",
              "label": "Superficial thrombophlebitis",
              "isCorrect": false,
              "rationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "serviceRequest": null
            },
            {
              "id": "isolated_groin_node",
              "label": "Bacterial cellulitis",
              "isCorrect": false,
              "rationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
          "sourceLabels": [
            "Lymphangitis"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "localized_blister",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            },
            {
              "answerChoiceId": "isolated_groin_node",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            }
          ],
          "teachingPoint": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease."
        }
      ],
      "learningSummary": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
      "prototypeDemographics": {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      "approvedInstantiationProfiles": [
        {
          "id": "profile.flags5r2.lymphangitis.toe-inguinal",
          "prototypeDemographics": {
            "ageYears": 35,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Tender red track",
          "presentation": "{patientName}, a 35-year-old woman, attends clinic with a blister on a toe. A tender red track extends from the foot toward tender groin nodes."
        }
      ]
    },
    {
      "id": "case.lymphangitis.palm-axillary",
      "displayName": "Clinic Patient: Palm Cut",
      "patientPresentationVariantId": "presentation.lymphangitis.palm-axillary",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "chiefComplaint": "Tender red track",
      "presentation": "{patientName}, a 41-year-old man, attends clinic with a small palm cut. A tender red track extends up the forearm; the axillary nodes are tender.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "MSD Manual Professional: Lymphangitis, reviewed May 2026"
      ],
      "decisionNodes": [
        {
          "id": "node.lymphangitis.palm-axillary.v1",
          "questionVariantId": "question.lymphangitis.palm-axillary.v1.r1",
          "primaryConceptId": "concept.lymphangitis.acute-clinical-recognition",
          "stem": "Which diagnosis best explains {patientName}'s red track and regional node tenderness?",
          "answerChoices": [
            {
              "id": "acute_lymphangitis",
              "label": "Acute lymphangitis",
              "isCorrect": true,
              "rationale": "The skin entry, tender proximal track and tender regional nodes form the mapped lymphangitis recognition pattern.",
              "serviceRequest": null
            },
            {
              "id": "localized_palm_cut",
              "label": "Superficial thrombophlebitis",
              "isCorrect": false,
              "rationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "serviceRequest": null
            },
            {
              "id": "isolated_axillary_node",
              "label": "Bacterial cellulitis",
              "isCorrect": false,
              "rationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
          "sourceLabels": [
            "Lymphangitis"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "localized_palm_cut",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            },
            {
              "answerChoiceId": "isolated_axillary_node",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            }
          ],
          "teachingPoint": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease."
        }
      ],
      "learningSummary": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
      "prototypeDemographics": {
        "ageYears": 41,
        "sexLabel": "Male"
      },
      "approvedInstantiationProfiles": [
        {
          "id": "profile.flags5r2.lymphangitis.palm-axillary",
          "prototypeDemographics": {
            "ageYears": 41,
            "sexLabel": "Male"
          },
          "chiefComplaint": "Tender red track",
          "presentation": "{patientName}, a 41-year-old man, attends clinic with a small palm cut. A tender red track extends up the forearm; the axillary nodes are tender."
        }
      ]
    },
    {
      "id": "case.lymphangitis.heel-inguinal",
      "displayName": "Clinic Patient: Cracked Heel",
      "patientPresentationVariantId": "presentation.lymphangitis.heel-inguinal",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "chiefComplaint": "Tender red track",
      "presentation": "{patientName}, a 47-year-old woman, attends clinic with a heel fissure. A tender red track extends proximally from the heel; the groin nodes are tender.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "MSD Manual Professional: Lymphangitis, reviewed May 2026"
      ],
      "decisionNodes": [
        {
          "id": "node.lymphangitis.heel-inguinal.v1",
          "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r7",
          "primaryConceptId": "concept.lymphangitis.acute-clinical-recognition",
          "stem": "Which diagnosis best explains {patientName}'s red track and regional node tenderness?",
          "answerChoices": [
            {
              "id": "acute_lymphangitis",
              "label": "Acute lymphangitis",
              "isCorrect": true,
              "rationale": "The skin entry, tender proximal track and tender regional nodes form the mapped lymphangitis recognition pattern.",
              "serviceRequest": null
            },
            {
              "id": "heel_crack_alone",
              "label": "Superficial thrombophlebitis",
              "isCorrect": false,
              "rationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "serviceRequest": null
            },
            {
              "id": "isolated_groin_node",
              "label": "Bacterial cellulitis",
              "isCorrect": false,
              "rationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
          "sourceLabels": [
            "Lymphangitis"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "heel_crack_alone",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            },
            {
              "answerChoiceId": "isolated_groin_node",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            }
          ],
          "teachingPoint": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease."
        }
      ],
      "learningSummary": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
      "prototypeDemographics": {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      "approvedInstantiationProfiles": [
        {
          "id": "profile.flags5r2.lymphangitis.heel-inguinal",
          "prototypeDemographics": {
            "ageYears": 47,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Tender red track",
          "presentation": "{patientName}, a 47-year-old woman, attends clinic with a heel fissure. A tender red track extends proximally from the heel; the groin nodes are tender."
        }
      ]
    },
    {
      "id": "case.lymphangitis.reverse-axillary",
      "displayName": "Clinic Patient: Hand Finding",
      "patientPresentationVariantId": "presentation.lymphangitis.reverse-axillary",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "chiefComplaint": "Tender red track",
      "presentation": "{patientName}, a 39-year-old man, attends clinic with a hand abrasion. A tender red track extends from the hand up the arm; the axillary nodes are tender.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "MSD Manual Professional: Lymphangitis, reviewed May 2026"
      ],
      "decisionNodes": [
        {
          "id": "node.lymphangitis.reverse-axillary.v1",
          "questionVariantId": "question.lymphangitis.reverse-axillary.v1.r1",
          "primaryConceptId": "concept.lymphangitis.acute-clinical-recognition",
          "stem": "Which diagnosis best explains {patientName}'s red track and regional node tenderness?",
          "answerChoices": [
            {
              "id": "proximal_red_streak_to_axillary_nodes",
              "label": "Acute lymphangitis",
              "isCorrect": true,
              "rationale": "The skin entry, tender proximal track and tender regional nodes form the mapped lymphangitis recognition pattern.",
              "serviceRequest": null
            },
            {
              "id": "small_hand_injury_alone",
              "label": "Superficial thrombophlebitis",
              "isCorrect": false,
              "rationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "serviceRequest": null
            },
            {
              "id": "tender_axilla_alone",
              "label": "Bacterial cellulitis",
              "isCorrect": false,
              "rationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
          "sourceLabels": [
            "Lymphangitis"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "small_hand_injury_alone",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            },
            {
              "answerChoiceId": "tender_axilla_alone",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            }
          ],
          "teachingPoint": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease."
        }
      ],
      "learningSummary": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
      "prototypeDemographics": {
        "ageYears": 39,
        "sexLabel": "Male"
      },
      "approvedInstantiationProfiles": [
        {
          "id": "profile.flags5r2.lymphangitis.reverse-axillary",
          "prototypeDemographics": {
            "ageYears": 39,
            "sexLabel": "Male"
          },
          "chiefComplaint": "Tender red track",
          "presentation": "{patientName}, a 39-year-old man, attends clinic with a hand abrasion. A tender red track extends from the hand up the arm; the axillary nodes are tender."
        }
      ]
    },
    {
      "id": "case.lymphangitis.finger-axillary",
      "displayName": "Clinic Patient: Finger Puncture",
      "patientPresentationVariantId": "presentation.lymphangitis.finger-axillary",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "chiefComplaint": "Tender red track",
      "presentation": "{patientName}, a 52-year-old woman, attends clinic with a finger puncture. A tender red track extends proximally along the arm; the axillary nodes are tender.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "MSD Manual Professional: Lymphangitis, reviewed May 2026"
      ],
      "decisionNodes": [
        {
          "id": "node.lymphangitis.finger-axillary.v1",
          "questionVariantId": "question.lymphangitis.finger-axillary.v1.r1",
          "primaryConceptId": "concept.lymphangitis.acute-clinical-recognition",
          "stem": "Which diagnosis best explains {patientName}'s red track and regional node tenderness?",
          "answerChoices": [
            {
              "id": "acute_lymphangitis",
              "label": "Acute lymphangitis",
              "isCorrect": true,
              "rationale": "The skin entry, tender proximal track and tender regional nodes form the mapped lymphangitis recognition pattern.",
              "serviceRequest": null
            },
            {
              "id": "finger_puncture_alone",
              "label": "Superficial thrombophlebitis",
              "isCorrect": false,
              "rationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "serviceRequest": null
            },
            {
              "id": "isolated_axillary_node",
              "label": "Bacterial cellulitis",
              "isCorrect": false,
              "rationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
          "sourceLabels": [
            "Lymphangitis"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "finger_puncture_alone",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "This is a real vascular mimic, but the combined entry-site, track and regional-node pattern most directly supports the mapped lymphatic process. No venous exclusion rule is taught.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            },
            {
              "answerChoiceId": "isolated_axillary_node",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Skin inflammation can coexist, but the question asks which diagnosis best explains the proximal track with regional node tenderness.",
              "sourceLabels": [
                "Lymphangitis"
              ]
            }
          ],
          "teachingPoint": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease."
        }
      ],
      "learningSummary": "A skin entry followed by a tender proximal red track and tender regional nodes supports acute lymphangitis. Superficial thrombophlebitis and cellulitis are genuine clinical alternatives, not isolated fragments of the vignette. This intentional basic item does not prescribe treatment or exclude coexisting disease.",
      "prototypeDemographics": {
        "ageYears": 52,
        "sexLabel": "Female"
      },
      "approvedInstantiationProfiles": [
        {
          "id": "profile.flags5r2.lymphangitis.finger-axillary",
          "prototypeDemographics": {
            "ageYears": 52,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Tender red track",
          "presentation": "{patientName}, a 52-year-old woman, attends clinic with a finger puncture. A tender red track extends proximally along the arm; the axillary nodes are tender."
        }
      ]
    },
    {
      "id": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
      "displayName": "Owner review for Maya Chen",
      "patientPresentationVariantId": "presentation.owner-decisions.20261112.mh-plan.v1",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Anesthetic planning",
      "presentation": "{patientName}, a 35-year-old woman, attends clinic before elective colectomy. Her brother has a positive caffeine-halothane muscle-contracture test. Her previous sevoflurane anesthetic was uneventful. Her gene panel found no pathogenic variant, and no familial causative variant has been identified. She has not undergone contracture testing.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.owner-decisions.20261112.mh-plan.v1",
          "prototypeDemographics": {
            "ageYears": 35,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Anesthetic planning",
          "presentation": "{patientName}, a 35-year-old woman, attends clinic before elective colectomy. Her brother has a positive caffeine-halothane muscle-contracture test. Her previous sevoflurane anesthetic was uneventful. Her gene panel found no pathogenic variant, and no familial causative variant has been identified. She has not undergone contracture testing."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Perioperative management of MH suspected or susceptible patients",
        "JSA guideline for management of malignant hyperthermia in 2025",
        "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
      ],
      "decisionNodes": [
        {
          "id": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
          "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2.r1",
          "primaryConceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
          "stem": "Which perioperative plan should {patientName}'s team arrange before her colectomy?",
          "answerChoices": [
            {
              "id": "choice.owner-decisions.20261112.mh-plan.ready",
              "label": "Trigger-free general anesthesia with dantrolene and MH team ready",
              "isCorrect": true,
              "rationale": "Unresolved familial susceptibility calls for nontriggering anesthesia and crisis preparedness. Specialist assessment can proceed separately from the planned operation.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.mh-plan.volatile-ready",
              "label": "Sevoflurane inhalational anesthesia with dantrolene and MH team ready",
              "isCorrect": false,
              "rationale": "Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.mh-plan.prophylaxis",
              "label": "Trigger-free general anesthesia with prophylactic dantrolene dosing",
              "isCorrect": false,
              "rationale": "Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis",
              "label": "Sevoflurane inhalational anesthesia with prophylactic dantrolene dosing",
              "isCorrect": false,
              "rationale": "Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.",
          "teachingPoint": "The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.",
          "sourceLabels": [
            "JSA guideline for management of malignant hyperthermia in 2025",
            "Perioperative management of MH suspected or susceptible patients",
            "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.owner-decisions.20261112.mh-plan.volatile-ready",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.",
              "sourceLabels": [
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative management of MH suspected or susceptible patients",
                "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
              ]
            },
            {
              "answerChoiceId": "choice.owner-decisions.20261112.mh-plan.prophylaxis",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.",
              "sourceLabels": [
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative management of MH suspected or susceptible patients",
                "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
              ]
            },
            {
              "answerChoiceId": "choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the target and clinical decision before continuing.",
              "clinicalRationale": "Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.",
              "sourceLabels": [
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative management of MH suspected or susceptible patients",
                "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged."
    }
  ],
  "concepts": [
    {
      "id": "concept.achalasia.manometric-recognition",
      "displayName": "Manometric recognition of achalasia",
      "learningObjective": "Recognize achalasia from absent peristalsis and impaired esophagogastric-junction relaxation without relying on an unsupported numeric threshold.",
      "earliestFacilityStage": 1,
      "conceptType": "diagnosis"
    },
    {
      "id": "concept.varicose-veins.reflux-duplex-evaluation",
      "displayName": "Venous reflux duplex evaluation",
      "learningObjective": "Select disease-specific reflux duplex for symptomatic varicose veins.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.varicose-veins.intervention-referral-after-axial-reflux",
      "displayName": "Referral after documented axial reflux",
      "learningObjective": "Use findings, candidacy, and preference to choose intervention referral or conservative care.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
    {
      "id": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "displayName": "Assess perioperative cirrhosis risk",
      "learningObjective": "Use multidimensional liver, patient, procedure, and facility factors in perioperative cirrhosis assessment.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.statistics-ethics.capacity-refusal",
      "displayName": "Respect capable refusal",
      "learningObjective": "Distinguish an unwelcome choice from impaired decision-making capacity.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.palpable-breast.negative-mammogram-targeted-us",
      "displayName": "Targeted ultrasound after negative mammography",
      "learningObjective": "Order targeted ultrasound for an adult at least 40 with a persistent palpable finding after negative diagnostic mammography.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "displayName": "Biopsy suspicious palpable mass despite negative imaging",
      "learningObjective": "Obtain tissue diagnosis for a persistently suspicious palpable mass despite negative mammography and targeted ultrasound.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.preoperative-osa.validated-risk-screening",
      "displayName": "Screen preoperatively for OSA risk",
      "learningObjective": "Use a validated risk screen and communicate increased OSA probability without treating the screen as a diagnosis.",
      "earliestFacilityStage": 0,
      "conceptType": "diagnosis"
    },
    {
      "id": "concept.achalasia.high-resolution-manometry.v2",
      "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
      "learningObjective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.ptld.node-specimen-and-ancillary-handling.v1",
      "displayName": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
      "learningObjective": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
      "displayName": "Recognize an acute hernia exception to elective cirrhosis optimization",
      "learningObjective": "Interpret new obstructive hernia findings and choose urgent surgical assessment despite an earlier elective cirrhosis-optimization plan.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.lymphangitis.acute-clinical-recognition",
      "displayName": "Acute lymphangitis clinical recognition",
      "learningObjective": "Recognize acute lymphangitis from a distal skin entry site, a tender erythematous streak extending proximally, and tender regional lymph nodes.",
      "earliestFacilityStage": 0,
      "conceptType": "diagnosis"
    },
    {
      "id": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
      "displayName": "Choose the surgical testing sequence under unresolved familial MH risk",
      "learningObjective": "Interpret family history and an uninformative genetic result, then distinguish nontriggering perioperative planning from prophylactic dantrolene or obligatory preoperative contracture testing.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.varicose-veins.intervention-referral-after-axial-reflux.v2",
      "displayName": "Obtain a reflux study before selecting venous intervention",
      "learningObjective": "Distinguish a deep-vein compression examination from the reflux map needed before choosing treatment for symptomatic varicose veins.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    }
  ],
  "claims": [
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r3.20261116.qf5.02",
      "statement": "Recognize the scope of a compression-only DVT examination, then choose the reflux investigation needed before committing to a procedure.",
      "basisClaimIds": [
        "claim.varicose.reflux-duplex",
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary"
      ],
      "sourceIds": [
        "source.varicose.svs-avf-avls-2022",
        "source.varicose.svs-avf-avls-2023"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r3.20261116.qf5.11",
      "statement": "Reconcile the nipple-distance labels, then select the next evaluation of the actual clinical target.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r3.20261116.qf5.12",
      "statement": "Check which target generated the reassuring pathology, then select the next study for the unsatisfied clinical target.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r3.20261116.qf5.13",
      "statement": "Distinguish the depth of the imaged skin lesion from the palpable target, then choose the site-concordant diagnostic study.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r3.20261116.qf5.14",
      "statement": "Interpret the concerning clinical examination as discordant with the completed site-concordant imaging, then choose tissue evaluation rather than MRI-first triage or clinical observation.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.b2b37.application",
        "claim.flags2r3.20261105.sampling-scope"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r3.20261116.qf5.15",
      "statement": "Interpret the concerning clinical examination as discordant with the completed site-concordant imaging, then choose tissue evaluation rather than MRI-first triage or clinical observation.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.b2b37.application",
        "claim.flags2r3.20261105.sampling-scope"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r3.20261116.qf5.17",
      "statement": "Check technical interpretability before selecting a repeat physiologic assessment.",
      "basisClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "sourceIds": [
        "source.sc.seoul-achalasia-2020",
        "source.qq20261102a.chicago",
        "source.qq20261102a.seoul",
        "source.qq20261102c.acg-physiology2020",
        "source.qq20261102c.chicago"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    }
  ],
  "basisClaims": [
    {
      "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.varicose.reflux-duplex",
      "statement": "Duplex ultrasound with reflux assessment is the diagnostic test of choice for evaluating symptomatic lower-extremity chronic venous reflux.",
      "sourceIds": [
        "source.varicose.svs-avf-avls-2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "The existing service must be labeled for reflux assessment, not only acute DVT compression.",
      "applicablePopulation": "Adults with symptomatic varicose veins being evaluated for treatment.",
      "lastCheckedOn": "2026-09-28"
    },
    {
      "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.varicose.intervention-referral",
      "statement": "For symptomatic axial superficial reflux in an intervention candidate who wants treatment, specialist superficial venous intervention assessment is preferred to mandatory long-term compression.",
      "sourceIds": [
        "source.varicose.svs-avf-avls-2023"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "limitation": "The exact procedure depends on specialist anatomy and assessment.",
      "applicablePopulation": "Adults with symptomatic axial superficial reflux who are intervention candidates.",
      "lastCheckedOn": "2026-09-28"
    },
    {
      "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.varicose.conservative-boundary",
      "statement": "Conservative care remains reasonable when preference, comorbidity, mobility, anatomy, or resources weigh against intervention.",
      "sourceIds": [
        "source.varicose.svs-avf-avls-2023"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "limitation": "No universal garment or duration is prescribed.",
      "applicablePopulation": "Adults with stable symptomatic varicose veins.",
      "lastCheckedOn": "2026-09-28"
    },
    {
      "contentVersion": "development-batch.2026-09-29.statistics-ethics.2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.gs028se.capacity-refusal.3",
      "statement": "A diagnosis alone does not establish incapacity; assessment concerns abilities for the specific decision. The described abilities support respecting refusal.",
      "sourceIds": [
        "source.gs028se.ama-consent-2-1-1",
        "source.gs028se.ama-capacity-2-1-2"
      ],
      "evidenceCategory": "safety_boundary",
      "certainty": "moderate",
      "limitation": "Ethical guidance does not replace jurisdiction-specific law or institutional policy.",
      "applicablePopulation": "People in the stated fictional clinical situation.",
      "lastCheckedOn": "2026-09-29"
    },
    {
      "contentVersion": "development-batch.2026-09-29.statistics-ethics.2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.gs028se.capacity-refusal.4",
      "statement": "Cognitive impairment does not eliminate capacity for every decision. Support understanding and assess actual abilities before seeking a substitute decision-maker.",
      "sourceIds": [
        "source.gs028se.ama-consent-2-1-1",
        "source.gs028se.ama-capacity-2-1-2"
      ],
      "evidenceCategory": "safety_boundary",
      "certainty": "moderate",
      "limitation": "Ethical guidance does not replace jurisdiction-specific law or institutional policy.",
      "applicablePopulation": "People in the stated fictional clinical situation.",
      "lastCheckedOn": "2026-09-29"
    },
    {
      "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.cirrhosis.multifactor-risk",
      "statement": "Perioperative risk in cirrhosis depends on liver severity, portal hypertension and decompensation, procedure type, comorbidity, and center experience; no one score or laboratory value captures the whole decision.",
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "Single expert-review source; no fixed mortality estimate is taught.",
      "applicablePopulation": "Adults with cirrhosis being considered for nonhepatic surgery.",
      "lastCheckedOn": "2026-09-29"
    },
    {
      "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.cirrhosis.optimize-decompensation",
      "statement": "Active decompensation supports multidisciplinary optimization before proceeding with a nonurgent elective plan; deferral is an inferred case-specific boundary rather than an automatic prohibition.",
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "safety_boundary",
      "certainty": "moderate",
      "limitation": "Urgent surgical emergencies require immediate assessment despite elevated risk.",
      "applicablePopulation": "Adults with cirrhosis and a proposed nonurgent elective operation.",
      "lastCheckedOn": "2026-09-29"
    },
    {
      "id": "claim.qbp2b.b2b16.application",
      "statement": "The interval loss of function and asterixis-like observation require assessment for active decompensation or another acute cause; stable pressure does not establish elective readiness.",
      "basisClaimIds": [
        "claim.cirrhosis.optimize-decompensation"
      ],
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
      "limitation": "This does not diagnose every cognitive change as hepatic encephalopathy or prescribe its treatment. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
      "lastCheckedOn": "2026-11-04",
      "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
    },
    {
      "contentVersion": "development-batch.2026-10-03.coverage-gaps.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.gs028d.osa.validated-screen",
      "statement": "Validated preoperative screening can identify adults at increased probability of obstructive sleep apnoea for perioperative communication, but screening does not establish the diagnosis.",
      "sourceIds": [
        "source.sasm.osa-screening.2016"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "No proprietary questionnaire, item wording, score cutoff, or guaranteed outcome benefit is reproduced.",
      "applicablePopulation": "Adults undergoing preoperative assessment.",
      "lastCheckedOn": "2026-10-03"
    },
    {
      "contentVersion": "question-flags-round2.evidence.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "lastCheckedOn": "2026-11-04",
      "id": "claim.qf2.sleep-questionnaire-domain-interpretation",
      "statement": "A STOP-Bang OSA-probability report and an Epworth daytime-sleepiness report address different targets; a reassuring sleepiness report does not establish absence of OSA or turn a probability screen into a confirmed diagnosis.",
      "sourceIds": [
        "source.sasm.osa-screening.2016"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "The explicitly controlled or reported adult retrospective profiles in the round-two question-flag drafts.",
      "limitation": "Uses names and reported outputs only, without questionnaire items, scoring implementation, numeric cutoffs or diagnostic-study thresholds. The domain application requires anaesthesia/source-alignment review; no fresh verification is claimed.",
      "basisClaimIds": [
        "claim.gs028d.osa.validated-screen"
      ],
      "verificationScope": "Offline application/physical inference from previously recorded claims. No source was newly retrieved; source access dates and reuse restrictions remain unchanged. Clinician/source-alignment review is pending."
    },
    {
      "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "lastCheckedOn": "2026-11-04",
      "id": "claim.qf3.osa-risk-communication-sequence",
      "statement": "A reassuring daytime-sleepiness report does not cancel a separate increased apnoea-probability assessment; that risk information can inform current perioperative communication before diagnostic confirmation.",
      "basisClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation"
      ],
      "sourceIds": [
        "source.sasm.osa-screening.2016"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
      "limitation": "Communication/assessment scope only. No diagnostic cutoff, CPAP prescription, required monitoring protocol or decision to delay surgery is derived.",
      "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
    },
    {
      "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.gs028c.palpable.targeted-us",
      "statement": "A persistent palpable breast finding in an adult at least 40 years old warrants targeted ultrasonography of the exact clinical area when diagnostic mammography is negative.",
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "Single current specialty guideline; this does not endorse blanket supplemental screening ultrasound for breast density alone.",
      "applicablePopulation": "Adults age 40 or older with a persistent palpable breast finding and negative diagnostic mammography.",
      "lastCheckedOn": "2026-10-02"
    },
    {
      "id": "claim.qbp2b.b2b19.application",
      "statement": "The attached benign cyst study is anatomically discordant with the actual palpable site.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
      "limitation": "No BI-RADS threshold or universal MRI prohibition; no imaging finding is assumed to exclude a clinically suspicious lesion. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
      "lastCheckedOn": "2026-11-04",
      "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
    },
    {
      "id": "claim.qbp2b.b2b36.application",
      "statement": "The attached cyst is not a correlate for the skin-marker target; site-concordant targeted ultrasound is still needed.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
      "limitation": "The gate continues to use the existing ultrasound service/routes; no new imaging execution or biopsy rule is encoded here. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
      "lastCheckedOn": "2026-11-04",
      "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
    },
    {
      "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.gs028c.palpable.biopsy",
      "statement": "A clinically suspicious persistent palpable breast mass requires tissue diagnosis even when diagnostic mammography and targeted ultrasonography are negative.",
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "limitation": "Single current specialty guideline; biopsy technique depends on whether an imaging target exists and local specialist assessment.",
      "applicablePopulation": "Adults with a persistently suspicious palpable breast mass despite negative mammography and targeted ultrasound.",
      "lastCheckedOn": "2026-10-02"
    },
    {
      "id": "claim.qbp2b.b2b37.application",
      "statement": "After completed site-concordant imaging, a persistently suspicious palpable target requires tissue evaluation; the absence of a sonographic target does not remove the clinical one.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
      "limitation": "Palpation-directed core is an illustrative breast-team request, not a mandate where surgical sampling or a different local technique is more suitable. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
      "lastCheckedOn": "2026-11-04",
      "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
    },
    {
      "id": "claim.flags2r3.20261105.sampling-scope",
      "statement": "When a concerning palpable breast target has no imaging correlate, the tissue-diagnosis requirement does not mandate one biopsy device or imaging-guided technique.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the described persistent clinical breast target after site-correct imaging; the separate fibroadenoma retains its own concordance.",
      "limitation": "Single ACR guideline for the clinical-target decision plus recorded ASBrS/SBI guidance for the separate concordant fibroadenoma. No MRI contraindication, surveillance interval, biopsy-device ranking or empirical false-negative rate is taught.",
      "verificationScope": "Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.",
      "lastCheckedOn": "2026-11-05",
      "contentVersion": "evidence.question-flags2-round3.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.owner-decisions.20261112.ptld-architecture",
      "statement": "Excisional biopsy of a surgically accessible lymph node provides architecture useful for classifying suspected PTLD.",
      "sourceIds": [
        "source.ptld.frontiers-review-2026",
        "source.owner-decisions.20261112.rcpath-lymphoma-2015"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "Excision is favored when operative risk is acceptable. A planned core biopsy remains an alternative when excision poses excess risk.",
      "applicablePopulation": "Adults in the stated surgical teaching context",
      "lastCheckedOn": "2026-11-12"
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.owner-decisions.20261112.ptld-fresh-flow",
      "statement": "A planned fresh tissue portion preserves material for flow cytometry during lymphoid tissue assessment.",
      "sourceIds": [
        "source.owner-decisions.20261112.rcpath-lymphoma-2015"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "Single adequate source for this claim. One technical guideline published in 2015 and listed as under review. Follow an agreed hematopathology protocol. Fresh allocation does not guarantee cell viability or conclusive flow results.",
      "applicablePopulation": "Adults in the stated surgical teaching context",
      "lastCheckedOn": "2026-11-12"
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.owner-decisions.20261112.ptld-fixed-histology",
      "statement": "A formalin-fixed tissue portion permits histologic assessment of lymphoid architecture.",
      "sourceIds": [
        "source.owner-decisions.20261112.rcpath-lymphoma-2015",
        "source.ptld.frontiers-review-2026"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "high",
      "limitation": "Retain adequate material for histology and ancillary testing. Fixing the entire specimen forfeits the planned fresh portion.",
      "applicablePopulation": "Adults in the stated surgical teaching context",
      "lastCheckedOn": "2026-11-12"
    },
    {
      "contentVersion": "development-batch.2026-09-10.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.achalasia.high-resolution-manometry",
      "statement": "High-resolution esophageal manometry is the confirmatory physiologic test when achalasia is suspected after structural obstruction and concerning pseudoachalasia have been appropriately excluded.",
      "sourceIds": [
        "source.sc.seoul-achalasia-2020"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "The accepted guideline rates diagnostic evidence as low despite strong consensus. This claim does not prescribe subtype thresholds or a treatment algorithm.",
      "applicablePopulation": "Stable adults with persistent solids-and-liquids dysphagia and regurgitation after an adequate EGD excludes mechanical obstruction and concerning pseudoachalasia.",
      "lastCheckedOn": "2026-09-10"
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.qq20261102a.esophageal-physiology-sequence",
      "statement": "High-resolution manometry supplies esophageal motor classification when persistent obstructive swallowing symptoms remain after structural evaluation.",
      "sourceIds": [
        "source.qq20261102a.chicago",
        "source.qq20261102a.seoul"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "FLIP can complement inconclusive studies or be used in selected circumstances; it is not declared useless. No later pressure result is used to justify the earlier task.",
      "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
      "lastCheckedOn": "2026-11-02"
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.qq20261102c.hrm-incomplete-placement",
      "statement": "An esophageal pressure study without adequate junction-crossing acquisition cannot establish reliable junction relaxation classification.",
      "sourceIds": [
        "source.qq20261102c.acg-physiology2020",
        "source.qq20261102c.chicago"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "Assisted completion is a case-specific application. Persistent failure despite assisted placement may justify complementary FLIP; the cases do not assert manometry must always be repeated.",
      "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
      "lastCheckedOn": "2026-11-02"
    },
    {
      "contentVersion": "development-batch.2026-09-10.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.achalasia.manometric-recognition",
      "statement": "Absent esophageal peristalsis together with impaired esophagogastric-junction relaxation on high-resolution manometry supports achalasia.",
      "sourceIds": [
        "source.sc.seoul-achalasia-2020"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "No exact pressure cutoff, subtype assignment, or universal requirement for raised basal lower-esophageal-sphincter pressure is asserted; the accepted precise source is a single society guideline.",
      "applicablePopulation": "Adults with an adequate structural evaluation and the authored manometric pattern.",
      "lastCheckedOn": "2026-09-10"
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.qq20261102a.failed-contraction-threshold",
      "statement": "Chicago v4.0 classifies DCI below 100 mmHg.s.cm as failed contraction.",
      "sourceIds": [
        "source.qq20261102a.chicago"
      ],
      "evidenceCategory": "definition",
      "certainty": "moderate",
      "limitation": "The exact cutoff is explicitly supported by the consensus. B04's 30-80 readings are synthetic examples inside that range, not an invented normal threshold or measured patient dataset.",
      "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
      "lastCheckedOn": "2026-11-02"
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.qq20261102b.secondary-achalasia-assessment",
      "statement": "Older patients with achalasia-pattern physiology and substantial recent weight loss can require targeted assessment for a secondary junction lesion.",
      "sourceIds": [
        "source.qq20261102b.acg-achalasia"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "limitation": "Single adequate directly retrieved primary guideline for the added alarm-based application. EUS/cross-sectional choice is individualized; no exact weight/time threshold or probability is invented.",
      "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
      "lastCheckedOn": "2026-11-02"
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.iem-normal-relaxation",
      "statement": "Ineffective esophageal motility is classified with normal esophagogastric-junction relaxation.",
      "sourceIds": [
        "source.qq20261102.chicago-v4"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Adults undergoing interpretation under Chicago v4.0, without reproducing its numeric threshold list.",
      "limitation": "Qualitative rationale correction requested by the independent reviewer. No IEM swallow-percentage threshold or treatment rule is added. The key remains supported by the recorded achalasia and secondary-cause atoms.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline correction from the supplied independent review and the existing Chicago-v4 source ledger; no new source retrieval or access-date advancement."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.iem-failed-swallows",
      "statement": "The ineffective-esophageal-motility category can include failed swallows.",
      "sourceIds": [
        "source.qq20261102.chicago-v4"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Adults undergoing interpretation under Chicago v4.0, without reproducing its numeric threshold list.",
      "limitation": "Qualitative rationale correction requested by the independent reviewer. No IEM swallow-percentage threshold or treatment rule is added. The key remains supported by the recorded achalasia and secondary-cause atoms.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline correction from the supplied independent review and the existing Chicago-v4 source ledger; no new source retrieval or access-date advancement."
    },
    {
      "contentVersion": "clinical.owner-row-104.2026-08-21.1",
      "reviewStatus": "clinically_approved",
      "aiAssistedDrafting": true,
      "lastClinicianReview": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-104.2026-08-21.1"
      },
      "id": "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
      "statement": "Acute lymphangitis can be recognized clinically when a distal skin entry site is accompanied by a tender erythematous streak extending proximally toward tender regional lymph nodes.",
      "sourceIds": [
        "source.msd-manual-professional.lymphangitis.2026"
      ],
      "evidenceCategory": "presentation",
      "certainty": "moderate",
      "limitation": "This narrow claim supports pattern recognition only; it does not establish an organism, severity, testing plan, treatment, prognosis, or disposition. MSD Manual Professional is the sole adequate targeted-verification source retained for this claim; an independent source has not yet been recorded.",
      "applicablePopulation": "Patients represented in the approved outpatient clinic vignettes with a distal skin entry site, proximal tender streak, and regional nodal tenderness.",
      "lastCheckedOn": "2026-08-21"
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.owner-decisions.20261112.mh-family-risk",
      "statement": "An uninformative negative gene panel in a person with a confirmed affected first-degree relative leaves malignant-hyperthermia susceptibility unresolved.",
      "sourceIds": [
        "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
      ],
      "evidenceCategory": "safety_boundary",
      "certainty": "moderate",
      "limitation": "Single adequate source for this claim. An earlier uneventful anesthetic also does not establish absence of susceptibility. Specialist assessment and testing remain appropriate.",
      "applicablePopulation": "Adults in the stated surgical teaching context",
      "lastCheckedOn": "2026-11-12"
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.owner-decisions.20261112.mh-trigger-free",
      "statement": "Suspected or confirmed malignant-hyperthermia susceptibility calls for a trigger-free anesthetic plan.",
      "sourceIds": [
        "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018",
        "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
      ],
      "evidenceCategory": "management",
      "certainty": "high",
      "limitation": "Volatile anesthetics and succinylcholine are triggering agents. Drug doses and universal facility admission criteria are outside this item.",
      "applicablePopulation": "Adults in the stated surgical teaching context",
      "lastCheckedOn": "2026-11-12"
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.owner-decisions.20261112.mh-readiness",
      "statement": "An anesthetizing facility caring for an MH-susceptible patient needs a prepared workstation, dantrolene access and staff equipped to recognize and treat an MH crisis.",
      "sourceIds": [
        "source.owner-decisions.20261112.mhaus-pretesting-2018",
        "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
      ],
      "evidenceCategory": "safety_boundary",
      "certainty": "moderate",
      "limitation": "Formal transfer arrangements also form part of MHAUS ambulatory preparedness. No exact stock quantity or retrieval time is taught.",
      "applicablePopulation": "Adults in the stated surgical teaching context",
      "lastCheckedOn": "2026-11-12"
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.owner-decisions.20261112.mh-testing-sequence",
      "statement": "A properly prepared team can provide nontriggering anesthesia before definitive MH susceptibility testing is completed.",
      "sourceIds": [
        "source.owner-decisions.20261112.mhaus-pretesting-2018",
        "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "limitation": "Clinical and facility suitability require anesthesia assessment.",
      "applicablePopulation": "Adults in the stated surgical teaching context",
      "lastCheckedOn": "2026-11-12"
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.owner-decisions.20261112.mh-prophylaxis",
      "statement": "Routine prophylactic dantrolene is discouraged when an MH-susceptible patient receives nontriggering anesthesia.",
      "sourceIds": [
        "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018",
        "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "limitation": "Crisis treatment and prophylactic administration are separate decisions.",
      "applicablePopulation": "Adults in the stated surgical teaching context",
      "lastCheckedOn": "2026-11-12"
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.01",
      "statement": "Interpret the documented truncal reflux and functional burden, then distinguish interim compression from a compulsory prerequisite to intervention referral.",
      "basisClaimIds": [
        "claim.varicose.reflux-duplex",
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary"
      ],
      "sourceIds": [
        "source.varicose.svs-avf-avls-2022",
        "source.varicose.svs-avf-avls-2023"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.02",
      "statement": "Recognize the scope of a compression-only DVT examination, then choose the reflux investigation needed before committing to a procedure.",
      "basisClaimIds": [
        "claim.varicose.reflux-duplex",
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary"
      ],
      "sourceIds": [
        "source.varicose.svs-avf-avls-2022",
        "source.varicose.svs-avf-avls-2023"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.03",
      "statement": "Apply the venous indication and the compression-prerequisite boundary after, rather than from, the capacity decision.",
      "basisClaimIds": [
        "claim.varicose.reflux-duplex",
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary",
        "claim.gs028se.capacity-refusal.3",
        "claim.gs028se.capacity-refusal.4"
      ],
      "sourceIds": [
        "source.varicose.svs-avf-avls-2022",
        "source.varicose.svs-avf-avls-2023",
        "source.gs028se.ama-consent-2-1-1",
        "source.gs028se.ama-capacity-2-1-2"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.05",
      "statement": "Interpret reaccumulation after drainage as an unresolved preoperative problem, then choose elective timing rather than treating one drainage event or stable laboratory values as clearance.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation"
      ],
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.06",
      "statement": "Interpret an interval clinical-function change instead of accepting laboratory reassurance, then change the timing of a nonurgent procedure.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation",
        "claim.qbp2b.b2b16.application"
      ],
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.09",
      "statement": "Reject false reassurance from daytime alertness, then communicate the suspected nocturnal disorder for an actual perioperative plan.",
      "basisClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation",
        "claim.qf3.osa-risk-communication-sequence"
      ],
      "sourceIds": [
        "source.sasm.osa-screening.2016"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.10",
      "statement": "Recognize what the attached office instrument measured, then correct a diagnostic overstatement before acting on it in perioperative planning.",
      "basisClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation",
        "claim.qf3.osa-risk-communication-sequence"
      ],
      "sourceIds": [
        "source.sasm.osa-screening.2016"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.11",
      "statement": "Reconcile the nipple-distance labels, then select the next evaluation of the actual clinical target.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.12",
      "statement": "Check which target generated the reassuring pathology, then select the next study for the unsatisfied clinical target.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.13",
      "statement": "Distinguish the depth of the imaged skin lesion from the palpable target, then choose the site-concordant diagnostic study.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application",
        "claim.qbp2b.b2b36.application"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.14",
      "statement": "Confirm that the completed studies match the new clinical target, then choose a sampling guidance method that can localize it.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.b2b37.application",
        "claim.flags2r3.20261105.sampling-scope"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.15",
      "statement": "Recognize clinical progression despite completed site-concordant imaging, then select the guidance route that can still address the target.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.b2b37.application",
        "claim.flags2r3.20261105.sampling-scope"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.16",
      "statement": "Choose excision after inadequate architecture, then meet the actual viable-cell and fixed-histology requests through the recorded allocation protocol.",
      "basisClaimIds": [
        "claim.owner-decisions.20261112.ptld-architecture",
        "claim.owner-decisions.20261112.ptld-fresh-flow",
        "claim.owner-decisions.20261112.ptld-fixed-histology"
      ],
      "sourceIds": [
        "source.ptld.frontiers-review-2026",
        "source.owner-decisions.20261112.rcpath-lymphoma-2015"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.17",
      "statement": "Check technical interpretability before selecting a repeat physiologic assessment.",
      "basisClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "sourceIds": [
        "source.sc.seoul-achalasia-2020",
        "source.qq20261102a.chicago",
        "source.qq20261102a.seoul",
        "source.qq20261102c.acg-physiology2020",
        "source.qq20261102c.chicago"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.18",
      "statement": "Use the adequate acquisition to interpret relaxation plus peristalsis, then investigate the secondary-cause warning findings before junction treatment.",
      "basisClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.failed-contraction-threshold",
        "claim.qq20261102b.secondary-achalasia-assessment",
        "claim.qq20261102c.hrm-incomplete-placement",
        "claim.flags5r2.20261116.iem-normal-relaxation",
        "claim.flags5r2.20261116.iem-failed-swallows"
      ],
      "sourceIds": [
        "source.sc.seoul-achalasia-2020",
        "source.qq20261102a.chicago",
        "source.qq20261102b.acg-achalasia",
        "source.qq20261102c.acg-physiology2020",
        "source.qq20261102c.chicago",
        "source.qq20261102.chicago-v4"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.ly.toe.inguinal",
      "statement": "Recognize the linked distal-entry, proximal-track and regional-node pattern.",
      "basisClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes"
      ],
      "sourceIds": [
        "source.msd-manual-professional.lymphangitis.2026"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Basic recognition intentionally retained by owner direction; source claim is narrow and management remains out of scope. Mimics are alternatives, not new disease-specific diagnostic criteria.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.ly.palm.axillary",
      "statement": "Recognize the linked distal-entry, proximal-track and regional-node pattern.",
      "basisClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes"
      ],
      "sourceIds": [
        "source.msd-manual-professional.lymphangitis.2026"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Basic recognition intentionally retained by owner direction; source claim is narrow and management remains out of scope. Mimics are alternatives, not new disease-specific diagnostic criteria.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.ly.heel.inguinal",
      "statement": "Recognize the linked distal-entry, proximal-track and regional-node pattern.",
      "basisClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes"
      ],
      "sourceIds": [
        "source.msd-manual-professional.lymphangitis.2026"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Basic recognition intentionally retained by owner direction; source claim is narrow and management remains out of scope. Mimics are alternatives, not new disease-specific diagnostic criteria.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.ly.reverse.axillary",
      "statement": "Recognize the linked distal-entry, proximal-track and regional-node pattern.",
      "basisClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes"
      ],
      "sourceIds": [
        "source.msd-manual-professional.lymphangitis.2026"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Basic recognition intentionally retained by owner direction; source claim is narrow and management remains out of scope. Mimics are alternatives, not new disease-specific diagnostic criteria.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.ly.finger.axillary",
      "statement": "Recognize the linked distal-entry, proximal-track and regional-node pattern.",
      "basisClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes"
      ],
      "sourceIds": [
        "source.msd-manual-professional.lymphangitis.2026"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Basic recognition intentionally retained by owner direction; source claim is narrow and management remains out of scope. Mimics are alternatives, not new disease-specific diagnostic criteria.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5r2.20261116.qf5.mh",
      "statement": "Choose trigger-free planning with response readiness rather than prophylactic dantrolene under unresolved familial MH risk.",
      "basisClaimIds": [
        "claim.owner-decisions.20261112.mh-family-risk",
        "claim.owner-decisions.20261112.mh-trigger-free",
        "claim.owner-decisions.20261112.mh-readiness",
        "claim.owner-decisions.20261112.mh-testing-sequence",
        "claim.owner-decisions.20261112.mh-prophylaxis"
      ],
      "sourceIds": [
        "source.anesthesia-analgesia-pharmacology.jsa-mh-2026",
        "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018",
        "source.owner-decisions.20261112.mhaus-pretesting-2018"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult authoring case. Case coordinates and patient observations are fictional inputs, not published clinical thresholds.",
      "limitation": "Offline application of recorded facts. No clinical probability, new exact cutoff, treatment dose or fixed waiting interval. Independent review and named clinical approval remain separate.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline field-to-claim mapping to existing source records; no external source access or refreshed access date."
    }
  ],
  "sources": [
    {
      "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.varicose.svs-avf-avls-2022",
      "title": "SVS/AVF/AVLS varicose veins guideline Part I",
      "completeCitation": "Gloviczki P, Lawrence PF, Wasan SM, et al. 2022 SVS/AVF/AVLS clinical practice guidelines for management of varicose veins, Part I: Duplex Scanning and Treatment of Superficial Truncal Reflux. J Vasc Surg Venous Lymphat Disord. 2023;11(2):231-261.e6. doi:10.1016/j.jvsv.2022.09.004.",
      "organizationOrJournal": "SVS/AVF/AVLS",
      "authors": [
        "Gloviczki P",
        "Lawrence PF",
        "Wasan SM",
        "et al."
      ],
      "publicationYear": 2023,
      "doi": "10.1016/j.jvsv.2022.09.004",
      "pmid": null,
      "officialUrl": "https://doi.org/10.1016/j.jvsv.2022.09.004",
      "accessedOn": "2026-09-28",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted guidance; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
      "authorityAssessment": "Multisociety guideline for reflux duplex and superficial truncal reflux.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.varicose.reflux-duplex",
        "claim.flags5r2.20261116.qf5.01",
        "claim.flags5r2.20261116.qf5.02",
        "claim.flags5r2.20261116.qf5.03"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.question-new-n3.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.varicose.svs-avf-avls-2023",
      "title": "SVS/AVF/AVLS varicose veins guideline Part II",
      "completeCitation": "Gloviczki P, Lawrence PF, Wasan SM, et al. 2023 SVS/AVF/AVLS clinical practice guidelines for management of varicose veins, Part II. J Vasc Surg Venous Lymphat Disord. 2024;12(1):101670. doi:10.1016/j.jvsv.2023.08.011.",
      "organizationOrJournal": "SVS/AVF/AVLS",
      "authors": [
        "Gloviczki P",
        "Lawrence PF",
        "Wasan SM",
        "et al."
      ],
      "publicationYear": 2024,
      "doi": "10.1016/j.jvsv.2023.08.011",
      "pmid": null,
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11523430/",
      "accessedOn": "2026-09-28",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted guidance; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
      "authorityAssessment": "Multisociety guidance for preference-sensitive intervention and conservative care.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.n3.7923492ee07e",
        "claim.n3.c17b4399da8a",
        "claim.flags5.20261116.application.01",
        "claim.flags5.20261116.application.02",
        "claim.flags5.20261116.application.03",
        "claim.flags5r2.20261116.qf5.01",
        "claim.flags5r2.20261116.qf5.02",
        "claim.flags5r2.20261116.qf5.03"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.question-new-n2.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.gs028se.ama-consent-2-1-1",
      "title": "Informed Consent",
      "completeCitation": "American Medical Association. Code of Medical Ethics Opinion 2.1.1: Informed Consent. Accessed 2026-09-29.",
      "organizationOrJournal": "American Medical Association",
      "authors": [
        "American Medical Association"
      ],
      "publicationYear": null,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent",
      "accessedOn": "2026-09-29",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed.",
      "authorityAssessment": "Current professional ethics guidance for clinical consent.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.gs028se.qualified-interpreter.1",
        "claim.gs028se.qualified-interpreter.2",
        "claim.gs028se.qualified-interpreter.3",
        "claim.gs028se.qualified-interpreter.4",
        "claim.gs028se.informed-consent.1",
        "claim.gs028se.informed-consent.2",
        "claim.gs028se.informed-consent.3",
        "claim.gs028se.informed-consent.4",
        "claim.gs028se.capacity-refusal.1",
        "claim.gs028se.capacity-refusal.2",
        "claim.gs028se.capacity-refusal.3",
        "claim.gs028se.capacity-refusal.4",
        "claim.gs028se.research-consent.1",
        "claim.gs028se.research-consent.2",
        "claim.gs028se.research-consent.3",
        "claim.gs028se.research-consent.4",
        "claim.n2.578cf199fb28",
        "claim.flags5.20261116.application.03",
        "claim.flags5r2.20261116.qf5.03"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.question-new-n2.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.gs028se.ama-capacity-2-1-2",
      "title": "Decisions for Adult Patients Who Lack Capacity",
      "completeCitation": "American Medical Association. Code of Medical Ethics Opinion 2.1.2: Decisions for Adult Patients Who Lack Capacity. Accessed 2026-09-29.",
      "organizationOrJournal": "American Medical Association",
      "authors": [
        "American Medical Association"
      ],
      "publicationYear": null,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity",
      "accessedOn": "2026-09-29",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed.",
      "authorityAssessment": "Current ethics guidance for capacity and surrogates.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.gs028se.capacity-refusal.1",
        "claim.gs028se.capacity-refusal.2",
        "claim.gs028se.capacity-refusal.3",
        "claim.gs028se.capacity-refusal.4",
        "claim.gs028se.surrogate-decisions.1",
        "claim.gs028se.surrogate-decisions.2",
        "claim.gs028se.surrogate-decisions.3",
        "claim.gs028se.surrogate-decisions.4",
        "claim.n2.578cf199fb28",
        "claim.flags5.20261116.application.03",
        "claim.flags5r2.20261116.qf5.03"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.cirrhosis.aga-2019",
      "title": "AGA perioperative cirrhosis clinical practice update",
      "completeCitation": "Northup PG, Friedman LS, Kamath PS. AGA Clinical Practice Update on Surgical Risk Assessment and Perioperative Management in Cirrhosis: Expert Review. Clin Gastroenterol Hepatol. 2019;17(4):595-606. doi:10.1016/j.cgh.2018.09.043.",
      "organizationOrJournal": "American Gastroenterological Association",
      "authors": [
        "Northup PG",
        "Friedman LS",
        "Kamath PS"
      ],
      "publicationYear": 2019,
      "doi": "10.1016/j.cgh.2018.09.043",
      "pmid": "30273751",
      "officialUrl": "https://gastro.org/clinical-guidance/surgical-risk-assessment-and-perioperative-management-in-cirrhosis/",
      "accessedOn": "2026-09-29",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted guidance; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
      "authorityAssessment": "Society expert review; no one score or fixed cutoff is taught.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation",
        "claim.flags5.20261116.application.04",
        "claim.flags5.20261116.application.05",
        "claim.flags5.20261116.application.06",
        "claim.flags5.20261116.application.07",
        "claim.flags5.20261116.application.08",
        "claim.flags5r2.20261116.qf5.05",
        "claim.flags5r2.20261116.qf5.06"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "development-batch.2026-10-03.coverage-gaps.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.sasm.osa-screening.2016",
      "title": "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
      "completeCitation": "Chung F, Memtsoudis SG, Ramachandran SK, Nagappa M, Opperer M, Cozowicz C, Patrawala S, Lam D, Kumar A, Joshi GP, Fleetham J, Ayas N, Collop N, Doufas AG, Eikermann M, Englesakis M, Gali B, Gay P, Hernandez AV, Kaw R, Kezirian EJ, Malhotra A, Mokhlesi B, Parthasarathy S, Stierer T, Wappler F, Hillman DR, Auckley D. Society of Anesthesia and Sleep Medicine Guidelines on Preoperative Screening and Assessment of Adult Patients With Obstructive Sleep Apnea. Anesth Analg. 2016;123:452-473. doi:10.1213/ANE.0000000000001416.",
      "organizationOrJournal": "Anesthesia & Analgesia / Society of Anesthesia and Sleep Medicine",
      "authors": [
        "F Chung",
        "SG Memtsoudis",
        "SK Ramachandran",
        "M Nagappa",
        "M Opperer",
        "C Cozowicz",
        "S Patrawala",
        "D Lam",
        "A Kumar",
        "GP Joshi",
        "J Fleetham",
        "N Ayas",
        "N Collop",
        "AG Doufas",
        "M Eikermann",
        "M Englesakis",
        "B Gali",
        "P Gay",
        "AV Hernandez",
        "R Kaw",
        "EJ Kezirian",
        "A Malhotra",
        "B Mokhlesi",
        "S Parthasarathy",
        "T Stierer",
        "F Wappler",
        "DR Hillman",
        "D Auckley"
      ],
      "publicationYear": 2016,
      "doi": "10.1213/ANE.0000000000001416",
      "pmid": null,
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4956681/",
      "accessedOn": "2026-10-03",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International; https://creativecommons.org/licenses/by-nc-nd/4.0/; attributed noncommercial sharing only, with no adapted source content",
      "reuseStatus": "cc_by_nc_4_0_restricted",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
      "authorityAssessment": "Specialist guideline; validated screening identifies risk but does not diagnose OSA. No questionnaire or scoring rubric reproduced.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.flags5.20261116.application.09",
        "claim.flags5.20261116.application.10",
        "claim.flags5r2.20261116.qf5.09",
        "claim.flags5r2.20261116.qf5.10"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.owner-row-030.2026-08-06.2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.acr.palpable-breast-masses.2022",
      "title": "ACR Appropriateness Criteria: Palpable Breast Masses",
      "completeCitation": "American College of Radiology. ACR Appropriateness Criteria: Palpable Breast Masses. Revised 2022.",
      "organizationOrJournal": "American College of Radiology",
      "authors": [
        "American College of Radiology Appropriateness Criteria Expert Panel"
      ],
      "publicationYear": 2022,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://acsearch.acr.org/docs/69495/Narrative",
      "accessedOn": "2026-08-06",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted professional-society guidance",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Use for targeted factual verification and citation only; do not reproduce appropriateness tables or protected explanatory wording.",
      "authorityAssessment": "Authoritative radiology-society guidance for initial imaging of a palpable breast mass within its stated variants.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.breast-mass.under-30.initial-ultrasound",
        "claim.flags5.20261116.application.11",
        "claim.flags5.20261116.application.12",
        "claim.flags5.20261116.application.13",
        "claim.flags5.20261116.application.14",
        "claim.flags5.20261116.application.15",
        "claim.flags5r2.20261116.qf5.11",
        "claim.flags5r2.20261116.qf5.12",
        "claim.flags5r2.20261116.qf5.13",
        "claim.flags5r2.20261116.qf5.14",
        "claim.flags5r2.20261116.qf5.15"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.ptld.frontiers-review-2026",
      "title": "Comprehensive review of PTLD after solid organ transplantation",
      "completeCitation": "Vargas-Nieto LP, Santoyo-Sarmiento ND, Ballesteros-Garcia M, Calderon-Vasquez AT, Pinto-Rodriguez AD, Robayo-Romero MG, Cormane-Alfaro V, Daza-Buitrago J. Post-transplant lymphoproliferative disorder after solid organ transplantation: a comprehensive review. Front Transplant. 2026;5:1869288. doi:10.3389/frtra.2026.1869288.",
      "organizationOrJournal": "Frontiers in Transplantation",
      "authors": [
        "Lina Patricia Vargas-Nieto",
        "Nicolas David Santoyo-Sarmiento",
        "Maria Ballesteros-Garcia",
        "Angie Tatiana Calderon-Vasquez",
        "Alvaro Daniel Pinto-Rodriguez",
        "Maria Gabriela Robayo-Romero",
        "Valeria Cormane-Alfaro",
        "Jorge Daza-Buitrago"
      ],
      "publicationYear": 2026,
      "doi": "10.3389/frtra.2026.1869288",
      "pmid": null,
      "officialUrl": "https://www.frontiersin.org/journals/transplantation/articles/10.3389/frtra.2026.1869288/full",
      "accessedOn": "2026-11-12",
      "sourceClass": "narrative_review",
      "licenseLabel": "Creative Commons Attribution 4.0",
      "reuseStatus": "cc_by_4_0",
      "reuseNotes": "Authors and original publication credited in the complete citation. https://creativecommons.org/licenses/by/4.0/. Independent factual synthesis. No protected prose, figures, tables or algorithms adapted or retained.",
      "authorityAssessment": "Licensed current narrative synthesis supporting PTLD tissue architecture and the excision preference for an accessible node. Its comparative biopsy statements are expert synthesis, with core accepted when excision is unsuitable.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.owner-decisions.20261112.ptld-architecture",
        "claim.owner-decisions.20261112.ptld-fixed-histology",
        "claim.flags5.20261116.application.16",
        "claim.flags5r2.20261116.qf5.16"
      ],
      "verification": {
        "mode": "targeted_factual_verification",
        "checkedOn": "2026-11-12",
        "inheritedMetadataReviewed": true,
        "claimLocations": "Diagnostic approach, tissue biopsy and histopathology section."
      },
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.owner-decisions.20261112.rcpath-lymphoma-2015",
      "title": "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas",
      "completeCitation": "Dojcinov S, Wilkins B, Calaminici M. Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas. Royal College of Pathologists. G142, version 2. October 2015.",
      "organizationOrJournal": "Royal College of Pathologists",
      "authors": [
        "Stefan Dojcinov",
        "Bridget Wilkins",
        "Maria Calaminici"
      ],
      "publicationYear": 2015,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://www.rcpath.org/asset/DE0B5B4A-7F77-4FE2-AB56FD618EE69098/",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyright Royal College of Pathologists 2015. Personal noncommercial reproduction conditions.",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Targeted factual verification only. Independently synthesized facts and bibliographic metadata. No source prose, tables, proformas or full text retained.",
      "authorityAssessment": "Specialist technical guidance on lymphoid histology and fresh-tissue ancillary testing. The 2015 document is listed as under review, so local hematopathology procedures need confirmation.",
      "usageRole": "evidence",
      "accessedOn": "2026-11-12",
      "evidenceClaimIds": [
        "claim.owner-decisions.20261112.ptld-architecture",
        "claim.owner-decisions.20261112.ptld-fresh-flow",
        "claim.owner-decisions.20261112.ptld-fixed-histology",
        "claim.flags5.20261116.application.16",
        "claim.flags5r2.20261116.qf5.16"
      ],
      "verification": {
        "mode": "targeted_factual_verification",
        "checkedOn": "2026-11-12",
        "inheritedMetadataReviewed": true,
        "claimLocations": "Preparation before dissection, printed page 10, and immunophenotyping discussion, printed page 13."
      },
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "development-batch.2026-09-10.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.sc.seoul-achalasia-2020",
      "title": "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
      "completeCitation": "Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.",
      "organizationOrJournal": "Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility",
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
      "accessedOn": "2026-09-10",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
      "reuseStatus": "cc_by_nc_4_0_restricted",
      "reuseNotes": "Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.",
      "authorityAssessment": "Society evidence-based guideline directly checked for HRM after structural assessment and the absent-peristalsis/impaired-relaxation pattern. Diagnostic evidence is low with strong consensus; the inaccessible corrigendum is not represented as reviewed.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.achalasia.manometric-recognition",
        "claim.flags5.20261116.application.17",
        "claim.flags5.20261116.application.18",
        "claim.flags5r2.20261116.qf5.17",
        "claim.flags5r2.20261116.qf5.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102a.chicago",
      "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
      "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.",
      "organizationOrJournal": "Neurogastroenterology and Motility / International High-Resolution Manometry Working Group",
      "authors": [
        "Rena Yadlapati",
        "Peter J Kahrilas",
        "Mark R Fox",
        "Albert J Bredenoord",
        "C Prakash Gyawali",
        "Sabine Roman",
        "et al."
      ],
      "publicationYear": 2021,
      "doi": "10.1111/nmo.14058",
      "pmid": "33373111",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/",
      "accessedOn": "2026-11-02",
      "sourceClass": "peer_reviewed_guideline",
      "licenseLabel": "Copyrighted expert consensus; public author manuscript, reusable license not established",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.",
      "authorityAssessment": "Primary classification consensus checked in the accessible complete manuscript: primary-position achalasia criterion, absent normal peristalsis, pressurization/spasm distinction and failed DCI below 100 mmHg.s.cm. Same publication as source.qq20261102.chicago-v4; this recheck is not an independent second source.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102a.pressure-not-peristalsis",
        "claim.qq20261102a.primary-position-achalasia",
        "claim.qq20261102a.spastic-achalasia",
        "claim.qq20261102a.failed-contraction-threshold",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.flags5.20261116.application.17",
        "claim.flags5.20261116.application.18",
        "claim.flags5r2.20261116.qf5.17",
        "claim.flags5r2.20261116.qf5.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102a.seoul",
      "title": "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
      "completeCitation": "Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.",
      "organizationOrJournal": "Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility",
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
      "accessedOn": "2026-11-02",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
      "reuseStatus": "cc_by_nc_4_0_restricted",
      "reuseNotes": "Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.",
      "authorityAssessment": "Independent guideline corroborates pressure-study classification following structural assessment; FLIP and reflux testing are not represented as complete substitutes for ordinary HRM classification. Same publication as source.sc.seoul-achalasia-2020; this recheck is not an independent second source.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102a.pressure-not-peristalsis",
        "claim.qq20261102a.spastic-achalasia",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.flags5.20261116.application.17",
        "claim.flags5r2.20261116.qf5.17"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102c.acg-physiology2020",
      "title": "ACG esophageal physiologic testing guideline",
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
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9468980/",
      "accessedOn": "2026-11-02",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Public author manuscript; reusable license not established",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "No algorithms, protocol tables, source text or exact maneuver quantities copied. Factual verification of society guidance only.",
      "authorityAssessment": "Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102c.hrm-incomplete-placement",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.flags5.20261116.application.17",
        "claim.flags5r2.20261116.qf5.17",
        "claim.flags5r2.20261116.qf5.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102c.chicago",
      "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
      "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.",
      "organizationOrJournal": "Neurogastroenterology and Motility / International High-Resolution Manometry Working Group",
      "authors": [
        "Rena Yadlapati",
        "Peter J Kahrilas",
        "Mark R Fox",
        "Albert J Bredenoord",
        "C Prakash Gyawali",
        "Sabine Roman",
        "et al."
      ],
      "publicationYear": 2021,
      "doi": "10.1111/nmo.14058",
      "pmid": "33373111",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/",
      "accessedOn": "2026-11-02",
      "sourceClass": "peer_reviewed_guideline",
      "licenseLabel": "Copyrighted expert consensus; public author manuscript, reusable license not established",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.",
      "authorityAssessment": "Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102c.hrm-incomplete-placement",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.flags5.20261116.application.17",
        "claim.flags5r2.20261116.qf5.17",
        "claim.flags5r2.20261116.qf5.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102b.acg-achalasia",
      "title": "ACG clinical guideline: achalasia",
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
      "accessedOn": "2026-11-02",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyright ACG; no reusable license assumed",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Targeted factual verification of complete guideline through the Portuguese gastroenterology society-hosted PDF: https://www.spg.pt/wp-content/uploads/2023/03/ACG-Clinical-Guidelines-Diagnosis-and-Management-of-Achalasia.pdf . Direct publisher route was inaccessible; no paywalled snippet used, no PDF or prose stored.",
      "authorityAssessment": "Primary professional-society guideline supports targeted cross-sectional/EUS assessment when older patients with achalasia-pattern physiology have substantial short-term weight loss. No invented risk score, cutoff or probability.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102b.secondary-achalasia-assessment",
        "claim.flags5.20261116.application.18",
        "claim.flags5r2.20261116.qf5.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102.chicago-v4",
      "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
      "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.",
      "organizationOrJournal": "Neurogastroenterology and Motility / International High-Resolution Manometry Working Group",
      "authors": [
        "Rena Yadlapati",
        "Peter J Kahrilas",
        "Mark R Fox",
        "Albert J Bredenoord",
        "C Prakash Gyawali",
        "Sabine Roman",
        "et al."
      ],
      "publicationYear": 2021,
      "doi": "10.1111/nmo.14058",
      "pmid": "33373111",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/",
      "accessedOn": "2026-11-02",
      "sourceClass": "peer_reviewed_guideline",
      "licenseLabel": "Copyrighted expert consensus; public author manuscript, reusable license not established",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.",
      "authorityAssessment": "Primary international classification consensus. Only the preserved-peristalsis and normal-relaxation distinctions are used alongside the existing Seoul achalasia claim; technical protocol adequacy remains clinician review.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.flags5.20261116.application.18",
        "claim.flags5r2.20261116.qf5.18",
        "claim.flags5r2.20261116.iem-normal-relaxation",
        "claim.flags5r2.20261116.iem-failed-swallows"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.owner-row-104.2026-08-21.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.msd-manual-professional.lymphangitis.2026",
      "title": "Lymphangitis",
      "completeCitation": "Passarelli PJ. Lymphangitis. MSD Manual Professional Edition. Reviewed May 2026 by Brenda L. Tesini, MD. Accessed 2026-08-21. https://www.msdmanuals.com/professional/infectious-diseases/bacterial-skin-infections/lymphangitis",
      "organizationOrJournal": "MSD Manual Professional Edition",
      "authors": [
        "Patrick James Passarelli, MD",
        "Brenda L. Tesini, MD"
      ],
      "publicationYear": 2026,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://www.msdmanuals.com/professional/infectious-diseases/bacterial-skin-infections/lymphangitis",
      "accessedOn": "2026-08-21",
      "sourceClass": "open_educational_resource",
      "licenseLabel": "MSD Manual copyrighted; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce source prose, illustrations, or page structure.",
      "authorityAssessment": "Clinician-authored and peer-reviewed professional reference retained as the sole adequate targeted-verification source for the approved recognition phenotype.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
        "claim.flags5r2.20261116.qf5.ly.toe.inguinal",
        "claim.flags5r2.20261116.qf5.ly.palm.axillary",
        "claim.flags5r2.20261116.qf5.ly.heel.inguinal",
        "claim.flags5r2.20261116.qf5.ly.reverse.axillary",
        "claim.flags5r2.20261116.qf5.ly.finger.axillary"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.anesthesia-analgesia-pharmacology.jsa-mh-2026",
      "title": "JSA guideline for management of malignant hyperthermia in 2025",
      "completeCitation": "Tsutsumi YM, Nagasaka H, Mukaida K, Ichihara Y, Yasuda T, Miyoshi H; JSA MH Management Guideline Working Group. JSA guideline for management of malignant hyperthermia in 2025. J Anesth. 2026;40:4-12. doi:10.1007/s00540-025-03647-y.",
      "organizationOrJournal": "Japanese Society of Anesthesiologists / Journal of Anesthesia",
      "authors": [
        "Yasuo M. Tsutsumi",
        "Hiroshi Nagasaka",
        "Keiko Mukaida",
        "Yasuko Ichihara",
        "Toshimichi Yasuda",
        "Hirotsugu Miyoshi",
        "JSA MH Management Guideline Working Group"
      ],
      "publicationYear": 2026,
      "doi": "10.1007/s00540-025-03647-y",
      "pmid": null,
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12860801/",
      "accessedOn": "2026-11-12",
      "sourceClass": "peer_reviewed_guideline",
      "licenseLabel": "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); original fact synthesis with attribution",
      "reuseStatus": "cc_by_4_0",
      "reuseNotes": "Authors and original publication credited in the complete citation. https://creativecommons.org/licenses/by/4.0/. Independent factual synthesis. No protected prose, figures, tables or algorithms adapted or retained.",
      "authorityAssessment": "Current 2026 English primary guideline. Expert opinion/case reports prominent; regional dantrolene-dose differences are not averaged or tested.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.owner-decisions.20261112.mh-family-risk",
        "claim.owner-decisions.20261112.mh-trigger-free",
        "claim.owner-decisions.20261112.mh-readiness",
        "claim.owner-decisions.20261112.mh-prophylaxis",
        "claim.owner-decisions.20261112.mh-dantrolene",
        "claim.flags5r2.20261116.qf5.mh"
      ],
      "verification": {
        "mode": "targeted_factual_verification",
        "checkedOn": "2026-11-12",
        "inheritedMetadataReviewed": true,
        "claimLocations": "Counseling and future anesthesia sections."
      },
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018",
      "title": "Perioperative management of MH suspected or susceptible patients",
      "completeCitation": "European Malignant Hyperthermia Group; Girard T. Perioperative Management of MH Suspected or Susceptible Patients. February 27, 2018.",
      "organizationOrJournal": "European Malignant Hyperthermia Group",
      "authors": [
        "European Malignant Hyperthermia Group",
        "Thierry Girard"
      ],
      "publicationYear": 2018,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://www.emhg.org/recommendations-1/2018/2/27/perioperative-management-of-mh-suspected-or-susceptible-patients",
      "accessedOn": "2026-11-12",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Targeted factual verification only; no right to copy protected expression is asserted",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Bibliographic metadata and independently written atomic facts only. No source excerpts, prose, tables, figures or algorithms retained or reproduced. ",
      "authorityAssessment": "Primary professional-group recommendations still listed in the current recommendations index; low evidence levels for several perioperative points. General readiness is not a numerical facility accreditation rule.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.owner-decisions.20261112.mh-trigger-free",
        "claim.owner-decisions.20261112.mh-testing-sequence",
        "claim.owner-decisions.20261112.mh-prophylaxis",
        "claim.flags5r2.20261116.qf5.mh"
      ],
      "verification": {
        "mode": "targeted_factual_verification",
        "checkedOn": "2026-11-12",
        "inheritedMetadataReviewed": true,
        "claimLocations": "Premedication, choice of anesthetics and outpatient surgery sections."
      },
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.owner-decisions.20261112.mhaus-pretesting-2018",
      "title": "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?",
      "completeCitation": "Malignant Hyperthermia Association of the United States. Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility? MHAUS Recommendations. 2018.",
      "organizationOrJournal": "Malignant Hyperthermia Association of the United States",
      "authors": [
        "Malignant Hyperthermia Association of the United States"
      ],
      "publicationYear": 2018,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://www.mhaus.org/healthcare-professionals/mhaus-recommendations/can-patients-with-a-suspected-personal-or-family-history-of-mh-be-safely-anesthetized-prior-to-diagnostic-testing-for-mh-susceptibility/",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "MHAUS copyrighted professional recommendations. Targeted factual verification and citation.",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Underlying facts independently synthesized. No source prose, figures, algorithms or full text retained.",
      "authorityAssessment": "Specialist organization recommendations for pretesting anesthesia, prepared staff, dantrolene access, workstation preparation and transfer arrangements. MHAUS labels these recommendations rather than standards.",
      "usageRole": "evidence",
      "accessedOn": "2026-11-12",
      "evidenceClaimIds": [
        "claim.owner-decisions.20261112.mh-readiness",
        "claim.owner-decisions.20261112.mh-testing-sequence",
        "claim.owner-decisions.20261112.mh-dantrolene",
        "claim.flags5r2.20261116.qf5.mh"
      ],
      "verification": {
        "mode": "targeted_factual_verification",
        "checkedOn": "2026-11-12",
        "inheritedMetadataReviewed": true,
        "claimLocations": "Conclusions and facility-preparedness criteria."
      },
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse for the listed qualitative recognition, method, sampling and perioperative decisions; no source text or refreshed source access. Primary-source currentness is not reverified."
    }
  ],
  "fieldMappings": [
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "caseId": "case.gs028.varicose-veins.b-prefers-conservative",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r3",
      "fields": [
        {
          "field": "presentation/currentUpdate/exhibit",
          "claimIds": [
            "claim.varicose.reflux-duplex",
            "claim.varicose.intervention-referral",
            "claim.varicose.conservative-boundary"
          ],
          "type": "Constructed observations and report-method/target locations; no new diagnostic cutoff."
        },
        {
          "field": "task/key/explanation/choice rationale",
          "claimIds": [
            "claim.flags5r3.20261116.qf5.02",
            "claim.varicose.reflux-duplex",
            "claim.varicose.intervention-referral",
            "claim.varicose.conservative-boundary"
          ],
          "type": "Case-specific application, with explicit competing hypotheses rather than asserted alternative diagnoses."
        }
      ]
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r3",
      "fields": [
        {
          "field": "presentation/currentUpdate/exhibit",
          "claimIds": [
            "claim.gs028c.palpable.targeted-us",
            "claim.qbp2b.b2b19.application",
            "claim.qbp2b.b2b36.application"
          ],
          "type": "Constructed observations and report-method/target locations; no new diagnostic cutoff."
        },
        {
          "field": "task/key/explanation/choice rationale",
          "claimIds": [
            "claim.flags5r3.20261116.qf5.11",
            "claim.gs028c.palpable.targeted-us",
            "claim.qbp2b.b2b19.application",
            "claim.qbp2b.b2b36.application"
          ],
          "type": "Case-specific application, with explicit competing hypotheses rather than asserted alternative diagnoses."
        }
      ]
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "caseId": "case.gs028c.palpable-breast.a-recent-negative",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r3",
      "fields": [
        {
          "field": "presentation/currentUpdate/exhibit",
          "claimIds": [
            "claim.gs028c.palpable.targeted-us",
            "claim.qbp2b.b2b19.application",
            "claim.qbp2b.b2b36.application"
          ],
          "type": "Constructed observations and report-method/target locations; no new diagnostic cutoff."
        },
        {
          "field": "task/key/explanation/choice rationale",
          "claimIds": [
            "claim.flags5r3.20261116.qf5.12",
            "claim.gs028c.palpable.targeted-us",
            "claim.qbp2b.b2b19.application",
            "claim.qbp2b.b2b36.application"
          ],
          "type": "Case-specific application, with explicit competing hypotheses rather than asserted alternative diagnoses."
        }
      ]
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r5",
      "fields": [
        {
          "field": "presentation/currentUpdate/exhibit",
          "claimIds": [
            "claim.gs028c.palpable.targeted-us",
            "claim.qbp2b.b2b19.application",
            "claim.qbp2b.b2b36.application"
          ],
          "type": "Constructed observations and report-method/target locations; no new diagnostic cutoff."
        },
        {
          "field": "task/key/explanation/choice rationale",
          "claimIds": [
            "claim.flags5r3.20261116.qf5.13",
            "claim.gs028c.palpable.targeted-us",
            "claim.qbp2b.b2b19.application",
            "claim.qbp2b.b2b36.application"
          ],
          "type": "Case-specific application, with explicit competing hypotheses rather than asserted alternative diagnoses."
        }
      ]
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r3",
      "fields": [
        {
          "field": "presentation/currentUpdate/exhibit",
          "claimIds": [
            "claim.gs028c.palpable.biopsy",
            "claim.qbp2b.b2b37.application",
            "claim.flags2r3.20261105.sampling-scope"
          ],
          "type": "Constructed observations and report-method/target locations; no new diagnostic cutoff."
        },
        {
          "field": "task/key/explanation/choice rationale",
          "claimIds": [
            "claim.flags5r3.20261116.qf5.14",
            "claim.gs028c.palpable.biopsy",
            "claim.qbp2b.b2b37.application",
            "claim.flags2r3.20261105.sampling-scope"
          ],
          "type": "Case-specific application, with explicit competing hypotheses rather than asserted alternative diagnoses."
        }
      ]
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "caseId": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r3",
      "fields": [
        {
          "field": "presentation/currentUpdate/exhibit",
          "claimIds": [
            "claim.gs028c.palpable.biopsy",
            "claim.qbp2b.b2b37.application",
            "claim.flags2r3.20261105.sampling-scope"
          ],
          "type": "Constructed observations and report-method/target locations; no new diagnostic cutoff."
        },
        {
          "field": "task/key/explanation/choice rationale",
          "claimIds": [
            "claim.flags5r3.20261116.qf5.15",
            "claim.gs028c.palpable.biopsy",
            "claim.qbp2b.b2b37.application",
            "claim.flags2r3.20261105.sampling-scope"
          ],
          "type": "Case-specific application, with explicit competing hypotheses rather than asserted alternative diagnoses."
        }
      ]
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "caseId": "case.achalasia.clinic-referral",
      "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r8",
      "fields": [
        {
          "field": "presentation/currentUpdate/exhibit",
          "claimIds": [
            "claim.achalasia.high-resolution-manometry",
            "claim.qq20261102a.esophageal-physiology-sequence",
            "claim.qq20261102c.hrm-incomplete-placement"
          ],
          "type": "Constructed observations and report-method/target locations; no new diagnostic cutoff."
        },
        {
          "field": "task/key/explanation/choice rationale",
          "claimIds": [
            "claim.flags5r3.20261116.qf5.17",
            "claim.achalasia.high-resolution-manometry",
            "claim.qq20261102a.esophageal-physiology-sequence",
            "claim.qq20261102c.hrm-incomplete-placement"
          ],
          "type": "Case-specific application, with explicit competing hypotheses rather than asserted alternative diagnoses."
        }
      ]
    }
  ],
  "timingEntries": [
    {
      "caseId": "case.gs028.varicose-veins.b-prefers-conservative",
      "nodeId": "node.gs028.varicose-veins.b-prefers-conservative.1",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r3",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_3",
            "choiceLabel": "Arrange a complete venous reflux duplex",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.venous_duplex"
            }
          },
          {
            "choiceId": "d1_3",
            "choiceLabel": "Arrange great-saphenous endovenous ablation",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "d2_3",
            "choiceLabel": "Require compression treatment before further investigation",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "nodeId": "node.gs028c.palpable-breast.paired-scar-edge.1",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r3",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_2",
            "choiceLabel": "Repeat targeted ultrasound of the marked site",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          },
          {
            "choiceId": "d1_2",
            "choiceLabel": "Schedule clinical examination follow-up of the marked site",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "d2_2",
            "choiceLabel": "Obtain MRI of the marked site before repeat ultrasound",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.a-recent-negative",
      "nodeId": "node.gs028c.palpable-breast.a-recent-negative.1",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r3",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_3",
            "choiceLabel": "Arrange targeted ultrasound of the marked site",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          },
          {
            "choiceId": "d1_3",
            "choiceLabel": "Arrange clinical examination follow-up of the marked site",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "d2_3",
            "choiceLabel": "Arrange breast MRI of the marked site",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
      "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r5",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_4",
            "choiceLabel": "Repeat targeted ultrasound of the marked site",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          },
          {
            "choiceId": "d1_4",
            "choiceLabel": "Schedule clinical examination follow-up of the marked site",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "d2_4",
            "choiceLabel": "Obtain MRI of the marked site before repeat ultrasound",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "nodeId": "node.gs028c.palpable-breast.paired-scar-edge.2",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r3",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_2",
            "choiceLabel": "Arrange palpation-directed core biopsy",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.biopsy"
            }
          },
          {
            "choiceId": "d1_2",
            "choiceLabel": "Arrange contrast breast MRI",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          },
          {
            "choiceId": "d2_2",
            "choiceLabel": "Arrange short-interval clinical examination",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "nodeId": "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r3",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_3",
            "choiceLabel": "Arrange palpation-directed core biopsy",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.biopsy"
            }
          },
          {
            "choiceId": "d1_3",
            "choiceLabel": "Arrange contrast breast MRI",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          },
          {
            "choiceId": "d2_3",
            "choiceLabel": "Arrange short-interval clinical examination",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.achalasia.clinic-referral",
      "nodeId": "node.achalasia.clinic-referral.1",
      "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r8",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "manometry_4",
            "choiceLabel": "Manometry with endoscopic catheter placement",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.esophageal_manometry"
            }
          },
          {
            "choiceId": "choice.qq20261102c.b04-context.d1",
            "choiceLabel": "Junction distensibility measurement with endoscopic FLIP",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.upper_endoscopy"
            }
          },
          {
            "choiceId": "choice.qq20261102c.b04-context.d2",
            "choiceLabel": "Timed barium esophagram with a tablet",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.radiography"
            }
          }
        ]
      }
    }
  ],
  "parked": [
    {
      "id": "QF5-06",
      "status": "parked",
      "reason": "Round-two review found only generic acute-confusion safety recognition. Existing mapped facts do not establish a closer competing operative decision without adding an unsupported protocol or new clinical facts. No educational exception requested; no third draft or admission. Keep the exact current live version.",
      "liveQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3",
      "ownerNoteResolution": "The original alone-option issue remains open in the live fallback; neither the earlier nor the round-two draft is accepted."
    }
  ],
  "frozenParentQuestions": [
    {
      "id": "QF5-01",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.r2",
      "questionSha256": "6c843c44ec501a128188f4149dbf770b78277fe2f171afef719a20cf25c1856d",
      "nodeSha256": "c6ba95764db3ebfa5283eac94809ebad998d3de39db6bf26ca4a78f872c9f8fe"
    },
    {
      "id": "QF5-03",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4.r2",
      "questionSha256": "a6681823eec692ddc0cc96d12c39c8b771db46d63ca0fedfdd21c28b8bc1cbd9",
      "nodeSha256": "b381bfe556ef3c060840f9ac8e7701c7f22d1a7fce4b5136d8c16468d808685e"
    },
    {
      "id": "QF5-05",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2.r2",
      "questionSha256": "16247e2d576edaa710ec6c02b7707ed5586fe98a6e01cc383f7495f8d1c09b20",
      "nodeSha256": "3c27dcb42878acaf6f84cc6040c1d08a56fbedd813b7db5f3ece4834f0773c10"
    },
    {
      "id": "QF5-06",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r8",
      "questionSha256": "b32941844123484eb6c54b9762db9365735226d20d6376feba5de95191a7dc41",
      "nodeSha256": "78c24418de28309e37a299d6179d464c133e751eee229049811b677dc6267280"
    },
    {
      "id": "QF5-09",
      "questionVariantId": "question.preoperative-osa.validated-risk-screening.v1.r2",
      "questionSha256": "93ea44ffe08f9217b3aac47d11692c68390cef476dae9886b5ca29aebb6b1f8e",
      "nodeSha256": "27a53d4095c7099be7ca331f9c42714b99ae70bccf91cd02eaa313fd098dbe81"
    },
    {
      "id": "QF5-10",
      "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r7",
      "questionSha256": "406bd931eb39092f732dd323dbd30986425f5c61ff246e8f23953730dddbe100",
      "nodeSha256": "79164c753706d052958b7b49ac4502fd866cce102766e7fccae404d869817887"
    },
    {
      "id": "QF5-16",
      "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r6",
      "questionSha256": "eec70f2217e15371a38219f2cd3139a3e279d3efa661fe36fc0e8e4ebe3c4959",
      "nodeSha256": "8cd94bb5d2141bd468c89424068caff89a3d4be05c6fe7ee56823cb3c8c53076"
    },
    {
      "id": "QF5-18",
      "questionVariantId": "question.achalasia.manometric-recognition.v4.r6",
      "questionSha256": "a3bd2d9b09e6e37d1425aa22a498648880296ce50f8e26cf8a68146e16fe5089",
      "nodeSha256": "85af12a559c1ca235845a847bf3bd9ae5154e6206bbddc976d57882fd957efbe"
    },
    {
      "id": "QF5-LY-toe-inguinal",
      "questionVariantId": "question.lymphangitis.toe-inguinal.v1.r1",
      "questionSha256": "7d155f3fa4089485880f7ffd371192cb4206425b74f0e496de547b6af6575f10",
      "nodeSha256": "3087ba582c1e4281dd9e5dca058a0c102c484f9bf65af54779693f0cba1ca600"
    },
    {
      "id": "QF5-LY-palm-axillary",
      "questionVariantId": "question.lymphangitis.palm-axillary.v1.r1",
      "questionSha256": "780b4f46b643374e1e43a3c371a639aa7e71ffa5d7d9fca4138956ff03a5f898",
      "nodeSha256": "707475ec14b873c29baf493ac306dc4ea8eec4d1626053eb39c55864d7c3a05c"
    },
    {
      "id": "QF5-LY-heel-inguinal",
      "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r7",
      "questionSha256": "679f969855e4f8fdd901564dd8f13c26fd30260a542dbf65ea33501992472baa",
      "nodeSha256": "00344b805310102ae5c4516b743f3fef6addf4b00a43180b32ffcb4bc13024ce"
    },
    {
      "id": "QF5-LY-reverse-axillary",
      "questionVariantId": "question.lymphangitis.reverse-axillary.v1.r1",
      "questionSha256": "959fc407eb04fcfae2efee87a8234ee8c5583bc8c66e3da3e11c7134611d77dc",
      "nodeSha256": "74867e39dfaa3563b158dc0005f355d0e3a4f717ae45cd7853e0dd520947ab95"
    },
    {
      "id": "QF5-LY-finger-axillary",
      "questionVariantId": "question.lymphangitis.finger-axillary.v1.r1",
      "questionSha256": "3f070f1d971a21bb4436ae24e0f139749f9bf2d716686b03adcdae5b55594690",
      "nodeSha256": "fe85f40cbaa7652352c379a67274a4b19872ab1cb596e54ec1d75a0a9bb96c19"
    },
    {
      "id": "QF5-MH",
      "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2.r1",
      "questionSha256": "79b80a19a87bed84cf29e8081e64c7d0be29626c49ed1a0aabce25a51ac09190",
      "nodeSha256": "62c7af6e30aa362163776e6dc21f32709b849d050d69e8043abd196c9c92434f"
    }
  ]
} as const;
