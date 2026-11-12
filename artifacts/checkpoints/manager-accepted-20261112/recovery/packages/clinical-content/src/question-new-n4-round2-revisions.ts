import type {N4R2Item} from "./question-new-n4-round2-types";

export const QUESTION_NEW_N4_ROUND2_REVISIONS:N4R2Item[] = [
  {
    "slug": "ventral-controlled-enterotomy-mesh-material",
    "name": "Ruth Dawson",
    "age": 69,
    "sex": "Female",
    "complaint": "Incisional hernia repair",
    "presentation": "Ruth Dawson, a 69-year-old woman, is undergoing elective incisional-hernia repair. A bowel opening occurred during adhesiolysis. Reconstruction is now at mesh selection.",
    "task": "Which mesh should be used for Ruth Dawson’s selected single-stage repair?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed clinical record; fictional observations",
      "items": [
        {
          "label": "Bowel and field",
          "value": "The opening was recognized immediately and sutured. Inspection under a leak assessment shows no escape; the adjacent bowel remains pink. A localized spill has been removed. Hemodynamics and support requirements are unchanged."
        },
        {
          "label": "Reconstruction",
          "value": "The anterior fascial edges can be closed. The posterior rectus sheaths have been reapproximated over the viscera; the planned mesh pocket lies between these sheaths and the rectus muscles."
        }
      ]
    },
    "conceptId": "concept.n4r2.mesh-material-and-contact-compartment",
    "conceptType": "management",
    "objective": "Interpret source control and the implant contact compartment before selecting the mesh material.",
    "conceptRelation": "new_meaning",
    "conceptReason": "This version adds a consequential implant-contact compartment interpretation to the selected-enterotomy material rule. Use a distinct meaning; do not attach the old material-only FSRS history to the broader construct.",
    "phase": "After source control, before mesh selection",
    "choices": [
      {
        "id": "polypropylene",
        "label": "Macroporous monofilament polypropylene mesh",
        "rationale": "The controlled event falls within the selected single-stage scope, and the reconstructed posterior layer separates this extraperitoneal prosthesis from bowel. Permanent macroporous synthetic reinforcement is supported in that selected context.",
        "competentError": "Integrate contamination control with the actual mesh compartment.",
        "correctUnder": "The controlled, stable, selected single-stage repair described here."
      },
      {
        "id": "eptfe",
        "label": "Microporous expanded polytetrafluoroethylene mesh",
        "rationale": "Selecting a visceral-contact material misreads the extraperitoneal pocket and does not address the contamination-related material comparison.",
        "competentError": "Treat the pocket as intraperitoneal because bowel was opened.",
        "correctUnder": "A clean repair requiring a permanent prosthesis appropriate for intraperitoneal visceral contact."
      },
      {
        "id": "dermis",
        "label": "Non-cross-linked porcine dermal mesh",
        "rationale": "The recognized and controlled bowel event does not establish a benefit from substituting biologic mesh for the supported permanent macroporous synthetic option.",
        "competentError": "Make biologic material the default after any enterotomy.",
        "correctUnder": "A separately justified biologic reconstruction, rather than a categorical rule triggered by this controlled event."
      }
    ],
    "explanation": "The repaired opening, controlled spill and unchanged physiology define the selected single-stage scope. The closed posterior layer also places the implant outside the peritoneal cavity. Choose macroporous monofilament polypropylene rather than defaulting to biologic material or selecting a visceral-contact material for a compartment separated from bowel. This does not select repair timing after an uncontrolled enterotomy.",
    "basisClaimIds": [
      "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair",
      "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh",
      "claim.ventral-hernia.enterotomy-mesh-selection-safety-boundary",
      "claim.n4r2.mesh-compartment-contact",
      "claim.n4r2.permanent-macroporous-material"
    ],
    "keyBasisClaimIds": [
      "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh",
      "claim.n4r2.mesh-compartment-contact"
    ],
    "reasoning": {
      "stepA": "Locate the pocket outside the peritoneum and distinguish the controlled event from ongoing contamination.",
      "stepB": "Select the material for this selected single-stage setting instead of defaulting to biologic or visceral-contact material.",
      "closestCompetitor": "Microporous ePTFE if the pocket is mistaken for an intraperitoneal compartment.",
      "decider": "The closed posterior sheath separates the pocket from bowel; the repaired bowel opening has no continuing escape.",
      "ablation": "Without the compartment, bare-polypropylene versus visceral-contact material is under-specified. Without source control, the selected repair scope is lost.",
      "counterfactual": "In a clean operation with an intraperitoneal pocket directly against bowel, bare polypropylene would be inappropriate; of the offered permanent synthetics, ePTFE addresses that contact issue.",
      "counterfactualChoiceId": "eptfe",
      "cueAttack": "Three actual mesh materials with comparable structural specificity. No stem sentence repeats the keyed polymer.",
      "stageAudit": "Three implant materials at the same reconstruction decision; no new operation order.",
      "difficulty": "Moderate, predicted; material-selection knowledge remains necessary.",
      "remainingRisk": "Fresh EHS emergency guidance corroborates material selection, not elective enterotomy timing. The inherited selected-enterotomy claims supply that boundary. The biologic competitor remains less discriminating; exact ranking needs clinician review."
    },
    "group": "intra_op",
    "stage": 3,
    "tier": 1,
    "acuity": "stable",
    "version": 2,
    "priorReviewId": "review.n4.ventral-controlled-enterotomy-mesh-material.v1",
    "slot": "R1:ventral-controlled-enterotomy-mesh-material"
  },
  {
    "slug": "unexpected-deep-mass-during-lipoma-excision",
    "name": "Helen Marlow",
    "age": 64,
    "sex": "Female",
    "complaint": "Thigh lump excision",
    "presentation": "Helen Marlow, a 64-year-old woman, is undergoing excision of a slowly enlarging upper-arm lump. The incision has exposed the tissue described below; the lesion has not been cut.",
    "task": "Which plan should be selected at this point in Helen Marlow’s operation?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed clinical record; fictional observations",
      "items": [
        {
          "label": "Outside ultrasound",
          "value": "An ovoid fatty-appearing focus was measured entirely above the deep fascia."
        },
        {
          "label": "Operative view",
          "value": "The palpable lump is beneath the fascia and moves with the adjacent muscle. An exposed portion is firm and lobulated; a separate small fatty nodule lies in the superficial tissue."
        }
      ]
    },
    "conceptId": "concept.soft-tissue-mass.extremity-mri.v2",
    "conceptType": "workup",
    "objective": "Recognize that a superficial imaging label did not characterize the exposed deep target and select local mapping before planned biopsy.",
    "conceptRelation": "existing_meaning_variant",
    "conceptReason": "Retains the existing field-coverage and local-mapping meaning, applied to an intraoperative discovery; no history is moved from a different skin-lump meaning.",
    "phase": "Exposure before further deep dissection",
    "choices": [
      {
        "id": "close",
        "label": "Close the wound, then obtain regional MRI and a planned core biopsy",
        "rationale": "The operative target and imaged superficial nodule are different structures. Define the deep lesion and plan the biopsy path before further disruption.",
        "competentError": "Reconcile imaged and operative territories before accepting a benign interpretation.",
        "correctUnder": "An unexpected deep mass not adequately characterized by the prior study.",
        "timingProfileId": "timing.test.biopsy_staging"
      },
      {
        "id": "incise",
        "label": "Take an incisional biopsy, then obtain regional MRI and staging",
        "rationale": "This cuts the deep lesion and creates a tract before regional extent and a definitive resection path have been planned.",
        "competentError": "Recognize a possible sarcoma but regard immediate biopsy as equivalent to a planned core.",
        "correctUnder": "An incisional biopsy planned after adequate imaging when core sampling is unsuitable.",
        "timingProfileId": "timing.test.biopsy_staging"
      },
      {
        "id": "excise",
        "label": "Complete a marginal excision, then use the specimen for diagnosis",
        "rationale": "The superficial fatty focus does not establish the nature or boundary of the muscle-associated lesion.",
        "competentError": "Transfer ultrasound reassurance to a different operative target.",
        "correctUnder": "A concordantly characterized lesion appropriate for planned marginal excision.",
        "timingProfileId": "timing.test.biopsy"
      }
    ],
    "explanation": "The ultrasound describes tissue above fascia; the palpable operative target is below it and moves with muscle. Reconcile that mismatch before accepting the prior benign interpretation. Closing without cutting the deep mass permits regional MRI and a planned core-biopsy route. Immediate marginal excision or an unplanned incisional tract can compromise subsequent treatment planning.",
    "basisClaimIds": [
      "claim.soft-tissue-mass.mri",
      "claim.soft-tissue-mass.planned-biopsy",
      "claim.qq20261102c.sarcoma-mri-coverage-and-target",
      "claim.qq20261102b.sarcoma-initial-core-method"
    ],
    "keyBasisClaimIds": [
      "claim.soft-tissue-mass.mri",
      "claim.soft-tissue-mass.planned-biopsy"
    ],
    "reasoning": {
      "stepA": "Recognize that the superficial imaged nodule is not the deep operative target.",
      "stepB": "Stop manipulating the mass and preserve it for regional imaging and a planned core-biopsy path.",
      "closestCompetitor": "Incisional biopsy now obtains tissue promptly but commits to a tract before regional planning.",
      "decider": "The operative relationship to fascia and muscle contradicts the imaged territory.",
      "ablation": "If the surgical lesion were the same superficial fatty focus, the reason to abandon marginal excision would weaken.",
      "counterfactual": "A concordantly superficial, mobile, well-characterized fatty lesion could be excised as planned.",
      "counterfactualChoiceId": "excise",
      "cueAttack": "The stem never names a missing MRI or tells the learner to stop. All labels give a current operative action plus a diagnostic plan.",
      "stageAudit": "All options decide what to do with the exposed lesion now. Future investigations are not an order for the operation in progress.",
      "difficulty": "Moderate, predicted: reconcile different targets and protect the oncologic pathway.",
      "remainingRisk": "Planned incisional biopsy remains appropriate in some circumstances; this concerns an unplanned deep target before regional imaging."
    },
    "group": "intra_op",
    "stage": 3,
    "tier": 1,
    "acuity": "stable",
    "version": 2,
    "priorReviewId": "review.n4.unexpected-deep-mass-during-lipoma-excision.v1",
    "slot": "R1:unexpected-deep-mass-during-lipoma-excision"
  },
  {
    "slug": "ulcer-recurrent-bleeding-after-clips",
    "group": "intra_endoscopy",
    "name": "Elena Brooks",
    "age": 72,
    "sex": "Female",
    "complaint": "Recurrent melena",
    "presentation": "Elena Brooks, a 72-year-old woman, is undergoing repeat upper endoscopy after renewed melena and a fall in hemoglobin. Her circulation has stabilized with resuscitation. Initial endoscopy had stopped bleeding with through-the-scope clips.",
    "task": "Which hemostatic strategy should be selected next for Elena Brooks?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed clinical record; fictional observations",
      "items": [
        {
          "label": "Current endoscopic field",
          "value": "A discrete point between the prior clips is spurting. The ulcer lies on a broad fibrotic base facing the endoscope; the lumen permits a stable frontal view."
        },
        {
          "label": "Tissue response",
          "value": "The previous clip arms have caught thin superficial edges that are separating from the base. Gentle contact around the bleeding point indents the surrounding tissue without uncovering a deep cavity."
        }
      ]
    },
    "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
    "conceptType": "management",
    "objective": "Distinguish recurrent bleeding after initial success from failure of a repeat therapeutic attempt when choosing rescue sequence.",
    "conceptRelation": "existing_meaning_variant",
    "conceptReason": "A response/sequence variant of the existing ulcer-hemostasis meaning, supported by the separately recorded repeat-endoscopy facts.",
    "stage": 3,
    "tier": 1,
    "acuity": "stable",
    "phase": "Repeat endoscopy, before rescue hemostasis",
    "choices": [
      {
        "id": "cap",
        "label": "Place a cap-mounted clip across the focal vessel",
        "rationale": "This is recurrent focal bleeding after initial conventional hemostasis, with poor superficial purchase. Cap-mounted clipping offers a repeat endoscopic approach before declaring repeat therapy unsuccessful.",
        "competentError": "Reconsider capture after initial success followed by recurrent bleeding.",
        "correctUnder": "An accessible recurrent focal ulcer bleed after conventional hemostasis."
      },
      {
        "id": "tts",
        "label": "Place a through-the-scope hemostatic clip at the vessel",
        "rationale": "The separating superficial edges make repeating the same type of purchase less persuasive in this recurrent setting.",
        "competentError": "Treat another clip as equivalent without reconsidering why prior clips lost purchase.",
        "correctUnder": "A focal target with suitable tissue purchase for conventional clipping."
      },
      {
        "id": "embolize",
        "label": "End this attempt and proceed to arterial embolization",
        "rationale": "Repeat endoscopic treatment has not yet failed in the stabilized patient with a visible target. Embolization is the escalation when repeat therapy fails or is infeasible.",
        "competentError": "Treat recurrence after the first procedure as failure of every repeat endoscopic strategy.",
        "correctUnder": "Persistent bleeding after an unsuccessful repeat endoscopic attempt, or an endoscopically untreatable target."
      }
    ],
    "explanation": "Distinguish recurrence after initial success from failure of repeat endoscopic treatment. Use the focal target and superficial clip-edge separation to reconsider tissue capture. Cap-mounted clipping is the best offered repeat approach. Another superficial clip repeats the observed purchase problem; embolization remains the escalation if repeat endoscopic treatment fails.",
    "basisClaimIds": [
      "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy",
      "claim.qq20261102c.ulcer-failed-repeat-embolization",
      "claim.qq20261102a.ulcer-local-modality-choice"
    ],
    "keyBasisClaimIds": [
      "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy"
    ],
    "reasoning": {
      "stepA": "Interpret recurrent bleeding and separating clip bites as a need to reassess capture, not proof that repeat endoscopy has failed.",
      "stepB": "Choose cap-mounted repeat hemostasis rather than repeat superficial purchase or stop for embolization.",
      "closestCompetitor": "More through-the-scope clips if tissue purchase is assumed adequate.",
      "decider": "Thin clip-caught edges are separating from the fibrotic base despite a stable frontal view.",
      "ablation": "Without the purchase finding the two clip approaches are less distinct; without a stable treatable view escalation could take priority.",
      "counterfactual": "Persistent bleeding after an unsuccessful repeat endoscopic attempt would make arterial embolization the offered escalation.",
      "counterfactualChoiceId": "embolize",
      "cueAttack": "No device-specific suction/capture permission. Both clip labels are active treatment strategies; embolization is framed as stopping and escalating.",
      "stageAudit": "All options answer the next strategy during the current examination, including ending the attempt.",
      "difficulty": "Moderate, predicted: recurrence plus tissue behavior alter treatment.",
      "remainingRisk": "Indentation does not guarantee cap capture; conventional clips are not universally ineffective in fibrotic ulcers. Technical feasibility requires clinician review."
    },
    "version": 2,
    "priorReviewId": "review.n4.ulcer-recurrent-bleeding-after-clips.v1",
    "slot": "R1:ulcer-recurrent-bleeding-after-clips"
  },
  {
    "slug": "pedunculated-polyp-head-versus-stalk",
    "group": "intra_endoscopy",
    "name": "Owen Mercer",
    "age": 63,
    "sex": "Male",
    "complaint": "Polyp removal",
    "presentation": "Owen Mercer, a 63-year-old man, is undergoing screening colonoscopy. The endoscopist has reached a mobile sigmoid polyp and is deciding how to remove it.",
    "task": "Which resection sequence should be used for Owen Mercer’s polyp?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed clinical record; fictional observations",
      "items": [
        {
          "label": "Current view",
          "value": "A rounded 18-mm head hangs from a distinct 12-mm-wide stalk. Surface vessels run up the stalk into the head; the adjacent colonic wall is separate from the stalk."
        },
        {
          "label": "Medication record",
          "value": "He takes no antithrombotic medication and has no known bleeding disorder."
        }
      ]
    },
    "conceptId": "concept.n4r2.pedunculated-polyp-stalk-hemostasis",
    "conceptType": "management",
    "objective": "Interpret head and stalk dimensions separately to select a pedunculated-polyp resection sequence.",
    "conceptRelation": "new_meaning",
    "conceptReason": "A wide-stalk prevention decision is a new meaning, not a new wording of diminutive nonpedunculated cold-snare selection; no FSRS reassignment.",
    "stage": 3,
    "tier": 1,
    "acuity": "stable",
    "phase": "Attachment assessment immediately before resection",
    "choices": [
      {
        "id": "loop_hot",
        "label": "Detachable-loop ligation followed by hot-snare transection",
        "rationale": "The stalk meets the directly sourced wide-stalk criterion even though the head is below the separate head-size trigger.",
        "competentError": "Apply head and stalk criteria to the correct structures.",
        "correctUnder": "A pedunculated lesion meeting the wide-stalk prevention criterion."
      },
      {
        "id": "hot_rescue",
        "label": "Hot-snare transection followed by rescue clipping",
        "rationale": "This waits for bleeding despite the stalk meeting a prophylaxis criterion. A smaller head does not remove that indication.",
        "competentError": "Let head diameter override the independent stalk measurement.",
        "correctUnder": "A pedunculated polyp without a prophylaxis trigger or another indication for preventive treatment."
      },
      {
        "id": "cold_rescue",
        "label": "Cold-snare excision with intact specimen retrieval",
        "rationale": "A nonpedunculated cold-snare rule does not select treatment for this thick stalk.",
        "competentError": "Generalize head-size rules without classifying attachment.",
        "correctUnder": "An appropriately selected nonpedunculated lesion suitable for cold-snare resection."
      }
    ],
    "explanation": "Classify the lesion as pedunculated and assess its stalk separately from its head. ESGE recommends hot-snare removal and suggests preventive stalk treatment when the stalk is at least 1 cm wide or the head is at least 2 cm. This lesion meets the stalk criterion. Loop placement followed by hot-snare transection is the best offered sequence. Injection-based prevention can also be appropriate and is not offered as an incorrect option.",
    "basisClaimIds": [
      "claim.n4r2.pedunculated-hot-snare",
      "claim.n4r2.pedunculated-stalk-prophylaxis"
    ],
    "keyBasisClaimIds": [
      "claim.n4r2.pedunculated-stalk-prophylaxis",
      "claim.n4r2.pedunculated-hot-snare"
    ],
    "reasoning": {
      "stepA": "Recognize a stalk and apply its 12-mm width independently of the 18-mm head.",
      "stepB": "Secure the stalk before hot-snare transection instead of waiting for bleeding or applying nonpedunculated cold-snare practice.",
      "closestCompetitor": "Hot-snare resection with rescue clipping overlooks the independent stalk prevention criterion.",
      "decider": "A 12-mm stalk with an 18-mm head meets the stalk criterion while falling below the head criterion.",
      "ablation": "Without stalk width the head measurement does not establish a prevention indication.",
      "counterfactual": "A thin-stalk pedunculated lesion with the same head and no other bleeding-risk feature would not meet the cited trigger; hot-snare resection with rescue treatment would be defensible.",
      "counterfactualChoiceId": "hot_rescue",
      "cueAttack": "Only raw dimensions/attachment are supplied; no high-risk label or named missing preventive action. Parallel resection sequences.",
      "stageAudit": "All choices are current colonoscopic prevention/resection/rescue sequences.",
      "difficulty": "Moderate, predicted; the exact head/stalk rule is explicitly sourced.",
      "remainingRisk": "Prevention evidence is low quality and allows dilute epinephrine and/or mechanical treatment. This does not claim a universal loop preference."
    },
    "version": 2,
    "priorReviewId": "review.n4.diminutive-polyp-versus-fold-attachment.v1",
    "slot": "R1:diminutive-polyp-versus-fold-attachment"
  },
  {
    "slug": "post-impaction-biopsy-site-versus-trauma",
    "group": "intra_endoscopy",
    "name": "Priya Wells",
    "age": 36,
    "sex": "Female",
    "complaint": "Food sticking",
    "presentation": "Priya Wells, a 36-year-old woman, is undergoing upper endoscopy for a food bolus. The bolus has been removed. She describes earlier episodes in which bread stopped behind her sternum before passing.",
    "task": "Which biopsy plan should be used before completing Priya Wells’s examination?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed clinical record; fictional observations",
      "items": [
        {
          "label": "Extraction site",
          "value": "A short patch in the distal esophagus is abraded where the bolus was lodged. There is no irregular mass, deep defect or fixed focal narrowing."
        },
        {
          "label": "Remaining esophagus",
          "value": "Longitudinal grooves and fine circular ridges extend through the middle and proximal esophagus; the mucosa there has not been contacted by the extraction device."
        },
        {
          "label": "Medication record",
          "value": "She was not taking a proton-pump inhibitor before this procedure."
        }
      ]
    },
    "conceptId": "concept.n4r2.post-impaction-esophageal-biopsy-territory",
    "conceptType": "workup",
    "objective": "Separate focal mechanical injury from distributed mucosal findings when choosing post-impaction biopsy sites.",
    "conceptRelation": "new_meaning",
    "conceptReason": "New post-impaction sampling meaning; do not reuse the old negative-endoscopy/specimen-provenance history.",
    "stage": 4,
    "tier": 1,
    "acuity": "stable",
    "phase": "Inspection completed, before tissue sampling",
    "choices": [
      {
        "id": "distributed",
        "label": "Multilevel esophageal samples away from the extraction patch",
        "rationale": "Distributed sampling can identify the process underlying impaction while avoiding mechanically irritated tissue that confounds interpretation.",
        "competentError": "Use distribution outside the injury to choose representative tissue.",
        "correctUnder": "Food impaction with sampleable mucosa and no suspicious focal lesion requiring separate directed biopsy.",
        "timingProfileId": "timing.test.esophageal_multilevel_biopsy"
      },
      {
        "id": "abrasion",
        "label": "Directed esophageal biopsies of the extraction patch",
        "rationale": "This concentrates tissue at the mechanical injury and under-samples the distributed process.",
        "competentError": "Assume the most visibly abnormal site best explains recurrent impaction.",
        "correctUnder": "A separately suspicious focal lesion requiring targeted biopsy, rather than this extraction abrasion.",
        "timingProfileId": "timing.test.biopsy"
      },
      {
        "id": "ppi_then_sample",
        "label": "Esophageal biopsies after proton-pump inhibitor treatment",
        "rationale": "Treatment before sampling can mask the underlying histology. Uninjured sites can be sampled now.",
        "competentError": "Wait for every extraction injury to heal even when other esophageal mucosa is suitable.",
        "correctUnder": "An examination in which adequate safe tissue cannot be obtained, followed by a specifically planned repeat.",
        "timingProfileId": "timing.test.esophageal_multilevel_biopsy"
      }
    ],
    "explanation": "The grooves and ridges beyond the extraction site suggest a distributed esophageal process. The focal abrasion is also a mechanical sampling confounder. Obtain distributed distal and middle/proximal specimens away from that patch now. Do not treat an abrasion as the diagnostic target or start a potentially masking treatment before obtaining suitable tissue.",
    "basisClaimIds": [
      "claim.n4r2.post-impaction-esophageal-sampling",
      "claim.n4r2.impaction-trauma-sampling-confounder",
      "claim.n4r2.ppi-before-eoe-biopsy"
    ],
    "keyBasisClaimIds": [
      "claim.n4r2.post-impaction-esophageal-sampling",
      "claim.n4r2.impaction-trauma-sampling-confounder"
    ],
    "reasoning": {
      "stepA": "Distinguish extraction trauma from the distributed pattern associated with recurrent impaction.",
      "stepB": "Sample representative levels away from the injury instead of targeting trauma or treating before diagnosis.",
      "closestCompetitor": "Target the abrasion: the usual habit of sampling the most abnormal-looking area.",
      "decider": "The abrasion coincides with impaction/extraction, whereas the grooves and ridges extend through untouched segments.",
      "ablation": "Without the injury chronology and distribution, the focal patch could need directed sampling and avoiding it would be under-specified.",
      "counterfactual": "An irregular focal mass or suspicious fixed stenosis would require directed biopsy rather than dismissal as extraction trauma.",
      "counterfactualChoiceId": "abrasion",
      "cueAttack": "All options concern esophageal tissue timing/territory. The key is no longer the only esophageal choice. No missing named biopsy protocol appears in the stem.",
      "stageAudit": "Three biopsy plans in the same post-extraction phase, with deferred sampling competing on timing.",
      "difficulty": "Moderate, predicted: interpret distribution plus procedural injury before choosing tissue.",
      "remainingRisk": "Avoiding routine injury-site sampling does not justify omitting biopsy of a suspicious mass or stenosis. The actual index-biopsy plan needs clinician review."
    },
    "version": 2,
    "priorReviewId": "review.n4.esophageal-sample-territory-during-egd.v1",
    "slot": "R1:esophageal-sample-territory-during-egd"
  },
  {
    "slug": "bilateral-testis-maintenance-versus-ascent",
    "name": "Leo Mitchell",
    "age": 5,
    "sex": "Male",
    "complaint": "Testis position",
    "familyBasisCaseId": "case.pediatric-clinic.intermittent-retraction-followup",
    "presentation": "Leo Mitchell, a 5-year-old boy, attends pediatric surgery clinic with his father David for concern about both testes. He is comfortable during two examinations in a warm room.",
    "task": "Which management plan should be selected for Leo Mitchell’s testes?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed clinical record; fictional observations",
      "items": [
        {
          "label": "Prior records",
          "value": "Both testes were documented in the dependent scrotum at earlier well-child examinations."
        },
        {
          "label": "Left examination",
          "value": "The testis begins high but moves into the dependent scrotum without tension and remains there after release."
        },
        {
          "label": "Right examination",
          "value": "The testis reaches the upper scrotum under tension and returns above the scrotum immediately after release. The same response occurs on repeat examination."
        }
      ]
    },
    "conceptId": "concept.n4r2.asymmetric-testis-position-management",
    "conceptType": "management",
    "objective": "Interpret asymmetric maintained position and select side-specific operative versus surveillance plans.",
    "conceptRelation": "new_meaning",
    "conceptReason": "Asymmetric acquired ascent plus true retraction is a new meaning; preserve the old unilateral surveillance history. Reuse the exact child/parent/art tuple.",
    "phase": "After repeat positional examination",
    "choices": [
      {
        "id": "left_observe_right_fix",
        "label": "Left: positional surveillance; right: plan orchiopexy",
        "rationale": "The left finding supports true retraction; the previously scrotal right testis no longer maintains a scrotal position. The sides need different plans.",
        "competentError": "Classify each side from its after-release behavior.",
        "correctUnder": "Persistent right acquired ascent with a true retractile left testis."
      },
      {
        "id": "both_observe",
        "label": "Left: positional surveillance; right: positional surveillance",
        "rationale": "The right side lacks the maintained tension-free position supporting true retractile surveillance.",
        "competentError": "Treat temporary manipulability as sufficient on both sides.",
        "correctUnder": "Bilateral true retractile testes remaining scrotal without tension."
      },
      {
        "id": "both_fix",
        "label": "Left: plan orchiopexy; right: plan orchiopexy",
        "rationale": "The left side does not share the right operative indication.",
        "competentError": "Transfer the right acquired-ascent interpretation to both sides.",
        "correctUnder": "Bilateral established undescended/ascended testes with operative indications."
      },
      {
        "id": "left_fix_right_observe",
        "label": "Left: plan orchiopexy; right: positional surveillance",
        "rationale": "This reverses the meaning of maintained position and return under tension.",
        "competentError": "Overweight the initially high left position and the ability to force the right temporarily downward.",
        "correctUnder": "A mirror-image examination showing left ascent and right true retraction."
      }
    ],
    "explanation": "Interpret the after-release behavior on each side. The left testis remains scrotal without tension and supports surveillance for ascent. The previously scrotal right testis repeatedly returns above the scrotum under tension and supports an acquired-ascent operative plan. These are clinic counseling plans; no pediatric operation is performed or ordered onsite and no exact interval is taught.",
    "basisClaimIds": [
      "claim.n4r2.retractile-maintained-position",
      "claim.n4r2.acquired-ascent-operative-boundary",
      "claim.n4r2.retractile-surveillance"
    ],
    "keyBasisClaimIds": [
      "claim.n4r2.retractile-maintained-position",
      "claim.n4r2.acquired-ascent-operative-boundary",
      "claim.n4r2.retractile-surveillance"
    ],
    "reasoning": {
      "stepA": "Classify the left maintained tension-free position separately from right immediate return after prior documented scrotal position.",
      "stepB": "Select left surveillance/right operative planning rather than one bilateral plan.",
      "closestCompetitor": "Observe both because both can be manipulated downward.",
      "decider": "Left stays in the dependent scrotum; right repeatedly returns above it under tension.",
      "ablation": "Removing either side’s after-release behavior makes the combined plan uncertain.",
      "counterfactual": "If the right also remained scrotal without tension, bilateral positional surveillance would become the offered plan.",
      "counterfactualChoiceId": "both_observe",
      "cueAttack": "Complete balanced 2-by-2 management matrix: each side-specific component appears twice. The mirror pair has similar words but opposite clinically material laterality; retain and report the lexical near-duplicate advisory without suppression. No diagnostic labels precede the choices.",
      "stageAudit": "Four side-specific counseling plans after the same examination; no onsite pediatric procedure or testing order.",
      "difficulty": "Moderate, predicted; both sides are consequential, though the examination skill is foundational.",
      "remainingRisk": "Exact acquired-ascent operative timing is not tested. Healthy-child operative assessment and the exact ranking need clinician review; no new age cutoff is inferred."
    },
    "group": "pediatric",
    "stage": 4,
    "tier": 1,
    "acuity": "stable",
    "version": 2,
    "priorReviewId": "review.n4.retractile-examination-versus-old-position-label.v1",
    "slot": "R1:retractile-examination-versus-old-position-label;P04"
  }
];
