import type {N4R2Item} from "./question-new-n4-round2-types";

export const QUESTION_NEW_N4_ROUND2_ADDITIONAL:N4R2Item[] = [
  {
    "version": 1,
    "priorReviewId": null,
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "stage": 3,
    "tier": 2,
    "acuity": "stable",
    "group": "intra_op",
    "slug": "two-tubes-versus-liver-bed-separation",
    "slot": "OR07",
    "name": "Victor Ames",
    "age": 54,
    "sex": "Male",
    "complaint": "Gallbladder surgery",
    "conceptId": "concept.n4r2.cholecystectomy-dissection-readiness",
    "conceptReason": "Dissection-readiness meaning differs from the frozen bailout case; this still permits safe further dissection rather than requiring subtotal completion.",
    "objective": "Interpret the dissection field before deciding whether apparent two-structure anatomy is sufficient for division.",
    "presentation": "Victor Ames, a 54-year-old man, is undergoing laparoscopic cholecystectomy. No structure has been clipped or divided.",
    "task": "Which operative step should be selected next for Victor Ames?",
    "phase": "After hepatocystic dissection, before clipping or division",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed procedure record; fictional observations",
      "items": [
        {
          "label": "Anterior view",
          "value": "Fat between the gallbladder neck, liver and visible duct has been cleared. Two tubular structures appear to enter the gallbladder."
        },
        {
          "label": "Posterior view",
          "value": "The inferior gallbladder surface remains apposed to the liver. A shallow posterior window shows the two tubes but not the gallbladder’s attachment surface behind them."
        },
        {
          "label": "Dissection response",
          "value": "Gentle traction draws the gallbladder body along a visible plane; the adjacent broad duct remains stationary."
        }
      ]
    },
    "choices": [
      {
        "id": "separate",
        "label": "Separate the lower gallbladder to expose its cystic plate",
        "rationale": "The two-structure impression does not complete the critical-view assessment while the lower attachment remains obscured. Further separation in the demonstrated plane permits the attachment and structures to be checked before division.",
        "competentError": "Interpret the unexposed attachment rather than count tubes.",
        "correctUnder": "A separable lower gallbladder attachment that still prevents completion of the critical view."
      },
      {
        "id": "divide",
        "label": "Clip and divide the two structures entering the gallbladder",
        "rationale": "Counting two apparent tubes is insufficient while the lower gallbladder attachment remains concealed.",
        "competentError": "Treat two windows or two tubes as the complete safety assessment.",
        "correctUnder": "A genuinely completed critical view with all required anatomical observations."
      },
      {
        "id": "trace",
        "label": "Trace the visible duct down to the common bile duct",
        "rationale": "Extending toward the common duct is not required to establish the critical view and can create avoidable duct risk.",
        "competentError": "Try to prove identity by following the cystic-common duct junction.",
        "correctUnder": "A separately justified targeted dissection rather than routine proof of cystic-duct identity."
      }
    ],
    "explanation": "Two apparent entering structures are not enough. The lower gallbladder still covers its liver attachment, so the critical view is incomplete. The observed separable plane supports exposing that lower attachment before division. Tracing the duct toward the common bile duct is not a substitute for this view.",
    "basisClaimIds": [
      "claim.n4r2.critical-view-three-observations",
      "claim.n4r2.critical-view-not-common-duct-exposure"
    ],
    "keyBasisClaimIds": [
      "claim.n4r2.critical-view-three-observations"
    ],
    "reasoning": {
      "stepA": "Infer that the apparent two-tube view is incomplete because the lower gallbladder attachment remains concealed.",
      "stepB": "Continue the demonstrated safe lower-body separation before clipping rather than divide or pursue the common-duct junction.",
      "closestCompetitor": "Clip and divide: the anterior view resembles a completed two-structure view.",
      "decider": "The posterior view does not expose the lower attachment, while traction demonstrates a separate dissection plane.",
      "ablation": "Without attachment information the two-tube description cannot establish whether division is justified. Without a separable plane a bailout rather than further dissection could be necessary.",
      "counterfactual": "If the lower attachment were exposed and the cleared triangle confirmed that exactly two structures enter the gallbladder, clipping and division would become the offered next step.",
      "counterfactualChoiceId": "divide",
      "cueAttack": "The stem avoids the label incomplete critical view and never names a missing critical-view maneuver. Three concrete operative steps of similar scope.",
      "stageAudit": "Every option is an action before division in the operation already underway.",
      "difficulty": "Moderate at most, predicted; this is practical anatomy application and may be foundational.",
      "remainingRisk": "A described plane does not guarantee universal safe dissection. The exact findings require clinician review; no forced total completion after difficult anatomy."
    }
  },
  {
    "version": 1,
    "priorReviewId": null,
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "stage": 3,
    "tier": 2,
    "acuity": "stable",
    "group": "intra_op",
    "slug": "cholangiogram-lucencies-and-proximal-coverage",
    "slot": "OR08",
    "name": "Evelyn Shaw",
    "age": 61,
    "sex": "Female",
    "complaint": "Gallbladder surgery",
    "conceptId": "concept.n4r2.cholangiogram-quality-before-duct-treatment",
    "conceptReason": "New intraoperative imaging-quality meaning; no old case is repointed.",
    "objective": "Assess apparent filling defects and ductal image completeness before deciding on duct exploration or completion.",
    "presentation": "Evelyn Shaw, a 61-year-old woman, is undergoing laparoscopic cholecystectomy. The surgeon has cannulated a duct for fluoroscopic cholangiography.",
    "task": "Which operative plan should be selected from Evelyn Shaw’s current cholangiogram?",
    "phase": "After initial cholangiographic injection, before duct treatment or completion",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed procedure record; fictional observations",
      "items": [
        {
          "label": "Early frames",
          "value": "Three round lucencies enter near the catheter tip and change position and shape between frames."
        },
        {
          "label": "Later frames",
          "value": "Contrast reaches the duodenum. Proximal contrast outlines a rightward branching tree; the corresponding branching pattern on the other side is outside the opacified field. No lucency stays fixed at one site."
        }
      ]
    },
    "choices": [
      {
        "id": "repeat",
        "label": "De-air the injection system and repeat ductal imaging",
        "rationale": "Changing lucencies near injection suggest an artifact, and duodenal flow does not establish complete proximal coverage. Improve the study before deciding on duct treatment.",
        "competentError": "Assess both apparent defects and the imaged anatomy.",
        "correctUnder": "A study with possible injection artifact and incomplete proximal coverage.",
        "timingProfileId": "timing.test.radiography"
      },
      {
        "id": "explore",
        "label": "Proceed to common-bile-duct exploration for the filling defects",
        "rationale": "This acts on transient injection-associated lucencies before confirming a genuine ductal lesion on an adequate study.",
        "competentError": "Treat every dark filling defect as an established stone.",
        "correctUnder": "A confirmed ductal stone requiring clearance after adequate imaging and a selected exploration strategy."
      },
      {
        "id": "complete",
        "label": "Complete the cholecystectomy after documenting free duodenal flow",
        "rationale": "Duodenal passage does not answer the incomplete proximal anatomy or settle the apparent defects.",
        "competentError": "Use distal patency as a substitute for overall image quality.",
        "correctUnder": "A complete reassuring study, rather than a partial view with unresolved artifacts."
      }
    ],
    "explanation": "The transient moving lucencies near the injection tip can be air, while flow into the duodenum does not establish that both proximal ductal trees were shown. De-air and obtain a complete repeat study before committing to duct exploration or accepting the image as reassuring. The guideline supplies quality requirements and artifact concerns; the repeat-injection sequence is an original clinical application of those requirements.",
    "basisClaimIds": [
      "claim.n4r2.ioc-air-false-positive",
      "claim.n4r2.ioc-complete-study",
      "claim.n4r2.ioc-confirmed-stone-treatment"
    ],
    "keyBasisClaimIds": [
      "claim.n4r2.ioc-air-false-positive",
      "claim.n4r2.ioc-complete-study"
    ],
    "reasoning": {
      "stepA": "Interpret transient changing defects as possibly injected air and distinguish distal flow from complete proximal imaging.",
      "stepB": "Repeat an adequate de-aired study before either duct treatment or completion.",
      "closestCompetitor": "Complete the operation because contrast enters the duodenum.",
      "decider": "Defects change shape/location and only one proximal branching tree is opacified.",
      "ablation": "Without the proximal-coverage observation, a reader might reasonably accept a subsequently clear film; without defect behavior, the presumed-stone pathway is less distinguishable.",
      "counterfactual": "Complete visualization of both proximal trees with duodenal flow and no persistent filling defect would support completing cholecystectomy among these choices.",
      "counterfactualChoiceId": "complete",
      "cueAttack": "No stone or air diagnosis is given and the stem does not name a missing repeat study. The longest label is a competing exploration option.",
      "stageAudit": "All options are current surgeon decisions during intraoperative cholangiography.",
      "difficulty": "Moderate, predicted: artifact interpretation plus adequacy determine the next action.",
      "remainingRisk": "A moving lucency is not proof of air. Repeating after de-airing is a synthesized application, not a quoted or mandated guideline protocol; clinician confirmation remains necessary."
    }
  },
  {
    "version": 1,
    "priorReviewId": null,
    "conceptType": "management",
    "conceptRelation": "existing_meaning_variant",
    "stage": 3,
    "tier": 2,
    "acuity": "stable",
    "group": "intra_op",
    "slug": "recurrent-groin-mesh-compartment",
    "slot": "OR09",
    "name": "Alan Pierce",
    "age": 66,
    "sex": "Male",
    "complaint": "Recurrent groin hernia",
    "conceptId": "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
    "conceptReason": "Preserves the existing recurrence-after-anterior-repair meaning; this variant infers that plane from the current exposure.",
    "objective": "Interpret the prior mesh compartment to select the repair approach for a recurrent groin hernia.",
    "presentation": "Alan Pierce, a 66-year-old man, is undergoing repair of a recurrent right groin hernia. After the external oblique is opened, the surgeon pauses at the findings below.",
    "task": "Which repair should be used to continue Alan Pierce’s operation?",
    "phase": "After initial anterior exposure, before disrupting the retained mesh or cord",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed procedure record; fictional observations",
      "items": [
        {
          "label": "Current exposure",
          "value": "The old mesh lies directly under the external oblique and over the inguinal floor. The spermatic cord runs superficial to it. Dense scar joins the mesh edge to the cord."
        },
        {
          "label": "Recurrence",
          "value": "The recurrent bulge emerges at the medial mesh edge. The overlying tissues are intact."
        }
      ]
    },
    "choices": [
      {
        "id": "tapp",
        "label": "Laparoscopic transabdominal preperitoneal repair",
        "rationale": "The landmarks identify a prior anterior mesh repair. A posterior approach avoids repeating dissection through that scarred anterior compartment.",
        "competentError": "Infer the old repair plane before selecting the recurrent repair approach.",
        "correctUnder": "A recurrence after prior anterior repair with an appropriate posterior repair plan."
      },
      {
        "id": "lichtenstein",
        "label": "Open anterior Lichtenstein mesh repair",
        "rationale": "This repeats the anterior plane identified by the mesh and cord relationships.",
        "competentError": "Treat the visible medial edge as an invitation to patch the same plane.",
        "correctUnder": "A selected anterior approach after a prior posterior repair."
      },
      {
        "id": "shouldice",
        "label": "Open anterior Shouldice tissue repair",
        "rationale": "Changing from mesh to tissue repair does not avoid the previously operated anterior compartment.",
        "competentError": "Assume a different material strategy resolves the scar-plane problem.",
        "correctUnder": "A selected primary or other appropriate tissue-repair setting, not a default response to this scarred anterior recurrence."
      }
    ],
    "explanation": "Mesh beneath external oblique with the cord superficial to it identifies the previous anterior compartment. Continue with a posterior preperitoneal approach rather than repeat that scarred plane. This item selects the approach during the present operation; it does not order another operation or claim TAPP is preferred over every other posterior technique.",
    "basisClaimIds": [
      "claim.n4r2.groin-recurrence-opposite-plane"
    ],
    "keyBasisClaimIds": [
      "claim.n4r2.groin-recurrence-opposite-plane"
    ],
    "reasoning": {
      "stepA": "Infer prior anterior repair from external-oblique/mesh/cord relationships rather than a supplied repair label.",
      "stepB": "Choose posterior repair for the recurrence instead of repeating anterior mesh or tissue reconstruction.",
      "closestCompetitor": "Lichtenstein repair because the recurrent medial mesh edge is already visible.",
      "decider": "The retained mesh is beneath external oblique with the cord superficial and scarred to its edge.",
      "ablation": "Without those relationships the choice of opposite plane cannot be established from the word recurrence.",
      "counterfactual": "A recurrence after a documented posterior preperitoneal repair would support a selected anterior Lichtenstein approach.",
      "counterfactualChoiceId": "lichtenstein",
      "cueAttack": "The stem never labels anterior/posterior repair or says the posterior plane is unoperated. All labels are named operations, not generic referral plans.",
      "stageAudit": "Three techniques for continuing the current repair before disrupting retained mesh; null service requests.",
      "difficulty": "Moderate, predicted: reconstruct old compartment and apply the recurrence strategy.",
      "remainingRisk": "The clinical team must judge the feasibility of changing approach at this exposure. This is not a mandate to laparoscopically continue every unexpected recurrent repair or a preference for TAPP over TEP."
    }
  },
  {
    "version": 1,
    "priorReviewId": null,
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "stage": 3,
    "tier": 2,
    "acuity": "stable",
    "group": "intra_op",
    "slug": "lumpectomy-marker-identity-and-target",
    "slot": "OR10",
    "name": "Diane Archer",
    "age": 58,
    "sex": "Female",
    "complaint": "Lumpectomy",
    "conceptId": "concept.n4r2.lumpectomy-target-marker-reconciliation",
    "conceptReason": "New current-OR target-retrieval meaning, not the prior core-biopsy specimen-provenance or microscopic margin meaning.",
    "objective": "Reconcile specimen and preoperative marker identities before deciding whether the current breast excision contains the malignant target.",
    "presentation": "Diane Archer, a 58-year-old woman, is undergoing wire-localized lumpectomy for calcifications sampled as DCIS. The first specimen has been removed and oriented.",
    "task": "Which operative plan should be selected for Diane Archer before closure?",
    "phase": "After first lumpectomy specimen imaging, before closure",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed procedure record; fictional observations",
      "items": [
        {
          "label": "Preoperative map",
          "value": "A top-hat marker sits within the DCIS calcification cluster. An older coil marker from a benign biopsy lies lateral to that cluster."
        },
        {
          "label": "Specimen radiograph",
          "value": "The wire segment and coil marker are in the specimen. Neither the top-hat marker nor the calcification cluster is visible."
        },
        {
          "label": "Current localization view",
          "value": "The top-hat marker and calcification cluster remain together immediately medial to the excision cavity."
        }
      ]
    },
    "choices": [
      {
        "id": "medial",
        "label": "Targeted re-excision with specimen radiography",
        "rationale": "The retrieved coil is the old benign marker, not proof of malignant-target removal. The residual target is medial and needs imaging confirmation after additional excision.",
        "competentError": "Match marker identity and target position before treating clip retrieval as completion.",
        "correctUnder": "A retained malignant target medial to the current cavity.",
        "timingProfileId": "timing.test.radiography"
      },
      {
        "id": "reimage",
        "label": "Repeat orthogonal views of the oriented specimen",
        "rationale": "A different view of the removed specimen cannot remove the target demonstrably retained in the breast. The marker identity mismatch requires target-directed excision.",
        "competentError": "Attribute target absence to specimen orientation despite the independent retained-target view.",
        "correctUnder": "Uncertain specimen-image orientation when the intended target has not been demonstrated in the remaining breast.",
        "timingProfileId": "timing.test.radiography"
      },
      {
        "id": "close",
        "label": "Complete closure and await permanent histologic margins",
        "rationale": "Margin assessment of the removed tissue does not establish removal of a different target still visible in the breast.",
        "competentError": "Equate removal of a wire and a clip with removal of the lesion.",
        "correctUnder": "Concordant specimen confirmation that the intended target has been removed, with no other reason for immediate excision."
      }
    ],
    "explanation": "The coil and top-hat markers represent different biopsy sites. The first specimen contains the old benign marker; imaging places the DCIS-associated marker and calcifications medial to the cavity. Remove tissue directed at that retained target and confirm the new specimen radiographically. Target confirmation does not establish the final microscopic margin width.",
    "basisClaimIds": [
      "claim.n4r2.bcs-all-targets",
      "claim.n4r2.bcs-specimen-confirmation"
    ],
    "keyBasisClaimIds": [
      "claim.n4r2.bcs-specimen-confirmation",
      "claim.n4r2.bcs-all-targets"
    ],
    "reasoning": {
      "stepA": "Distinguish the retrieved old benign marker from the retained marker/calcification malignant target.",
      "stepB": "Remove the retained target and confirm the new specimen instead of reimaging the wrong specimen or accepting clip retrieval as completion.",
      "closestCompetitor": "Close and await pathology because the specimen includes a wire and clip.",
      "decider": "The retrieved coil differs from the DCIS top-hat marker, and current imaging places the latter with calcifications medial to the cavity.",
      "ablation": "Without marker identities the coil could falsely appear concordant; without current target location the direction of additional excision is not determined.",
      "counterfactual": "If the specimen contained the intended top-hat marker and calcification cluster with concordant localization, completing closure while awaiting permanent margins would be appropriate among the offered choices.",
      "counterfactualChoiceId": "close",
      "cueAttack": "The labels compare target-directed excision, specimen reimaging and closure at the same phase. There is no direction-word matching or uniquely broad specimen answer.",
      "stageAudit": "Three actions after the current specimen image and before closure. No new lumpectomy order or exact microscopic margin threshold.",
      "difficulty": "Moderate, predicted: the misleading surrogate is clip/wire retrieval, then the correct target changes the next excision.",
      "remainingRisk": "The ASBrS document is an expert resource guide rather than a formal graded guideline. Real localization and image orientation require clinician confirmation; the constructed directions do not teach a universal cavity-shave policy."
    }
  },
  {
    "version": 1,
    "priorReviewId": null,
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "stage": 4,
    "tier": 1,
    "acuity": "stable",
    "group": "pediatric",
    "slug": "intermittent-groin-contents-versus-fluid-scan",
    "slot": "P05",
    "name": "Noah Bennett",
    "age": 5,
    "sex": "Male",
    "complaint": "Intermittent groin swelling",
    "familyBasisCaseId": "case.pediatric-clinic.groin-bulge-after-play",
    "conceptId": "concept.n4r2.pediatric-groin-contents-and-reducibility",
    "conceptReason": "New reconciliation of a quiet fluid-only study with current dynamic findings and reducibility; retain old generic referral histories.",
    "objective": "Distinguish intermittent bowel-containing groin swelling from fluid-only findings and use reducibility to select the care plan.",
    "presentation": "Noah Bennett, a 5-year-old boy, attends pediatric surgery clinic with his father Daniel for intermittent right groin swelling. A prior ultrasound obtained while the swelling was absent described fluid in the canal.",
    "task": "Which plan should be selected for Noah Bennett’s groin swelling?",
    "phase": "After current dynamic clinic examination, before management planning",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed procedure record; fictional observations",
      "items": [
        {
          "label": "During standing and coughing",
          "value": "A groin bulge extends toward the scrotum. A parent’s video from a larger episode shows a loop-shaped structure moving within the swelling; bowel sounds are heard over the bulge today."
        },
        {
          "label": "During recumbent examination",
          "value": "The bulge returns into the abdomen with gentle pressure. The abdomen is soft, the groin is not tender, and he has continued eating and passing stool."
        }
      ]
    },
    "choices": [
      {
        "id": "repair",
        "label": "Schedule inguinal herniotomy",
        "rationale": "Dynamic contents and reducibility support a bowel-containing hernia despite the quiet fluid-only study. A reducible child’s hernia needs planned repair rather than hydrocele follow-up.",
        "competentError": "Reconcile intermittent findings before choosing timing.",
        "correctUnder": "A clinically established reducible pediatric inguinal hernia."
      },
      {
        "id": "observe",
        "label": "Continue hydrocele follow-up",
        "rationale": "The earlier quiet scan does not explain the currently reducible bulge with enteric findings.",
        "competentError": "Treat a fluid-only snapshot as excluding intermittent herniation.",
        "correctUnder": "An isolated hydrocele without evidence of herniated bowel or another repair indication."
      },
      {
        "id": "emergency",
        "label": "Arrange emergency groin exploration",
        "rationale": "The present bulge reduces, and the child has no current obstructive or ischemic findings to justify this timing.",
        "competentError": "Treat any history of bowel in the sac as current incarceration.",
        "correctUnder": "A persistently irreducible hernia or concerning obstruction/strangulation findings."
      }
    ],
    "explanation": "A quiet study showing fluid does not exclude intermittent bowel entry into the same canal. Current dynamic findings establish the hernia problem; reduction and the comfortable abdominal examination distinguish a planned repair from emergency exploration. Use a specific herniotomy plan rather than treating this as a persistent fluid collection.",
    "basisClaimIds": [
      "claim.n4r2.child-groin-dynamic-contents",
      "claim.n4r2.child-hernia-repair",
      "claim.n4r2.child-hernia-urgent-boundary"
    ],
    "keyBasisClaimIds": [
      "claim.n4r2.child-groin-dynamic-contents",
      "claim.n4r2.child-hernia-repair",
      "claim.n4r2.child-hernia-urgent-boundary"
    ],
    "reasoning": {
      "stepA": "Reconcile intermittent enteric findings with a prior fluid-only image rather than assume the image excludes hernia.",
      "stepB": "Use present reducibility and lack of obstruction to select planned herniotomy rather than observation or emergency exploration.",
      "closestCompetitor": "Hydrocele follow-up because the only formal scan was read as fluid.",
      "decider": "The dynamic bulge has enteric findings and reduces into the abdomen; the child is currently comfortable and passing stool.",
      "ablation": "Without enteric findings fluid-only follow-up may remain plausible; without current reducibility the urgency cannot be safely selected.",
      "counterfactual": "A persistently irreducible tender bulge with vomiting would change the offered plan to emergency exploration.",
      "counterfactualChoiceId": "emergency",
      "cueAttack": "No hernia/incarceration label precedes the options. Three named management plans rather than generic referral or a uniquely detailed key.",
      "stageAudit": "Three clinic management plans; no onsite pediatric operation or test is enacted.",
      "difficulty": "Fair moderate at most, predicted; two independent observations change diagnosis and timing, but both are common pediatric examination skills.",
      "remainingRisk": "Parent video is supporting history, not a substitute for the clinician’s current examination. No exact repair interval is taught; urgency must be clinically assessed."
    }
  }
];
