// Review and source disposition ledger; no acceptance or default registration.
export const QUESTION_NEW_N4_ROUND2_REVIEW_DISPOSITIONS = [
  {
    "slot": "R1:cholecystectomy-neck-plane-bailout",
    "priorReviewId": "review.n4.cholecystectomy-neck-plane-bailout.v1",
    "priorVerdict": "PASS",
    "status": "FROZEN_EXACT",
    "candidateQuestionId": "question.n4.cholecystectomy-neck-plane-bailout.v1",
    "reason": "Exact independently passed case, question and prior review presentation preserved.",
    "reviewSuggestions": [
      "Preserve the contrast between separable body and unresolved neck, and retain the distinction between total completion and a bailout. Do not turn a possible change of approach followed by reassessment into a claim that all fundus-first dissection is forbidden.",
      "Have the named clinician confirm the exact ranking and subtotal feasibility before clinical approval; any subsequently changed wording requires review of that version."
    ],
    "fairnessNotes": [
      "Scope of this report: 21 candidate items, each with one node; judgments use only after Presentation, Exhibit, Task and Options. No separate Current update is supplied. Review-only keys and post-answer explanations were excluded from the reasoning assessment. The three parked drafts and ten pending/unkeyed slots were noted but not graded. Packet SHA-256: 884d476865e298884e0cf6da246cb30087f4bc68506f777e1514eb78a9a47b2c. No network or source re-verification was performed. All difficulty judgments are qualitative; PASS is editorial, not Melissa Rowland's clinical approval, and drafts remain needs_clinician_review.",
      "Node node.n4.cholecystectomy-neck-plane-bailout.v1: interpret the coupled traction movement as unresolved duct identity, then distinguish changing dissection direction from avoiding the unresolved junction. The separable body makes fundus-first completion a credible temptation; neck-first completion remains poorly supported.",
      "Subtotal cholecystectomy is the defensible best of the three offered completion plans. This does not establish it as the only acceptable bailout in clinical practice, nor prove the broad duct's exact identity. No confident clinical inaccuracy identified from the supplied fields.",
      "Phase fits: the actual observations arise during neck dissection before division, and the choice changes the current operation. Findings of failed separation and traction distortion are necessary safety information, not diagnosis labels to delete for difficulty."
    ]
  },
  {
    "slot": "R1:ventral-posterior-layer-versus-fascial-closure",
    "priorReviewId": "review.n4.ventral-posterior-layer-versus-fascial-closure.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "The supported observations establish straightforward closure feasibility; removing them creates an unfair tension/release decision. No verified joint layer/feasibility finding that changes the competing plan was established. Retain as catalog-only basic draft, not relabel as moderate.",
    "reviewSuggestions": [
      "Create a real interpretation problem in which layer identity and the response to attempted approximation jointly alter the reconstruction plan, using clinician-verified observations.",
      "Compare credible strategies at that exact operative point. Do not remove the feasibility information while retaining alternatives that would then become equally defensible.",
      "If retaining this straightforward version, seek explicit acceptance as basic anatomy/closure practice rather than describing it as a two-step resident item."
    ],
    "fairnessNotes": [
      "Node node.n4.ventral-posterior-layer-versus-fascial-closure.v1: primary fascial closure with reinforcement is a reasonable single best offered plan. Bridging and component separation are weak competitors when gentle approximation is explicitly achievable.",
      "The posterior/anterior distinction is educationally valid, but removing the completed-layer and mesh-pocket rows leaves the same answer from the anterior row. The learner need not resolve two consequential issues.",
      "Phase fits: closure strategy is being selected during reconstruction. No confident clinical inaccuracy is identified; the problem is insufficient discrimination, not missing invented tension or pressure thresholds."
    ]
  },
  {
    "slot": "R1:ventral-controlled-enterotomy-mesh-material",
    "priorReviewId": "review.n4.ventral-controlled-enterotomy-mesh-material.v1",
    "priorVerdict": "REVISE",
    "status": "REVISED_CANDIDATE",
    "candidateQuestionId": "question.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "reason": "See the prospective reasoning, concrete competitor and observation/counterfactual audit for the versioned candidate.",
    "reviewSuggestions": [
      "State the actual planned reconstruction plane and closure arrangement, using verified facts that support this exact material comparison.",
      "Give each material comparable clinically necessary specifications; avoid making only the key sound technically optimized.",
      "Delete the repeated current-point row. Have the clinician confirm that the controlled-spill scenario and reconstruction details support one best material among these choices."
    ],
    "fairnessNotes": [
      "Node node.n4.ventral-controlled-enterotomy-mesh-material.v1: the potential two-step task is to interpret the repaired injury and residual field condition, then choose a durable material rather than reflexively excluding permanent synthetic mesh. This can be moderately difficult without being a second decision about whether to stage the repair.",
      "Single-stage repair alone does not specify the intended mesh plane, fascial closure versus bridging, or relationship to bowel. Those details can matter to whether the exact permanent synthetic option is the best supported reconstruction choice. Do not import retromuscular placement or primary closure from another candidate.",
      "The key is plausible, but its general applicability to every single-stage repair after an enterotomy is not established by these visible fields. This is an unresolved context/ranking concern, not a confident assertion that permanent synthetic mesh is clinically wrong.",
      "Phase fits: the injury has been controlled and material selection is still pending during the operation. Biologic and absorbable alternatives are genuine material choices, but all must be described at comparable specificity."
    ]
  },
  {
    "slot": "R1:melanoma-depth-before-flap-and-sentinel-node",
    "priorReviewId": "review.n4.melanoma-depth-before-flap-and-sentinel-node.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "The staging decision is resolved before incision in this scenario. Creating a current operative change would require a new directly verified finding and sequence; a preoperative rule disguised as an intra-op consult is not emitted.",
    "reviewSuggestions": [
      "Choose the actual objective: if intraoperative sequencing, compare credible same-phase sequences and make current findings consequential; if resolving staging eligibility from pathology, place that decision before preoperative mapping.",
      "Do not simply remove mapping if the sequence requires it. Remove redundant eligibility testing or redesign the current operative dilemma instead.",
      "Replace author-adjudicated specimen adequacy with supported specimen observations only if adequacy is genuinely part of the scored decision."
    ],
    "fairnessNotes": [
      "Node node.n4.melanoma-depth-before-flap-and-sentinel-node.v1: sentinel-node biopsy before tissue rearrangement is the plausible best offered sequence. A normal nodal examination/ultrasound does not by itself settle microscopic staging, so those observations need not be deleted.",
      "The specimen-depth comparison fails ablation: even without those numbers, the completed mapping and pending flap strongly select the same procedural sequence. The scored task is mostly a sequencing rule, not two consequential interpretations.",
      "Phase fits for ordering sentinel biopsy versus flap elevation, since the flap is not yet elevated. The decision about whether to undertake sentinel staging appears already anticipated preoperatively; do not count that as a new intraoperative inference.",
      "No confident clinical inaccuracy is asserted. Consent and procedural planning are not proved by a mapped target, but the principal defect here is answer scaffolding rather than a demonstrated unsafe key."
    ]
  },
  {
    "slot": "R1:unexpected-deep-mass-during-lipoma-excision",
    "priorReviewId": "review.n4.unexpected-deep-mass-during-lipoma-excision.v1",
    "priorVerdict": "REVISE",
    "status": "REVISED_CANDIDATE",
    "candidateQuestionId": "question.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "reason": "See the prospective reasoning, concrete competitor and observation/counterfactual audit for the versioned candidate.",
    "reviewSuggestions": [
      "For an intraoperative item, compare actual immediate handling of the unexpected deep lesion, with concrete subsequent investigation plans and enough verified context to rank them.",
      "Alternatively, move the scored MRI-versus-biopsy decision into a postoperative diagnostic-planning encounter and stop claiming that the discriminating action is intraoperative.",
      "Use a closer local diagnostic competitor than chest staging, and make clear whether the competing biopsy is now or after appropriate local planning."
    ],
    "fairnessNotes": [
      "Node node.n4.unexpected-deep-mass-during-lipoma-excision.v1: interpreting the mismatch between the superficial ultrasound target and the actual deep lesion, then sequencing local characterization before a planned biopsy, offers genuine reasoning. Local MRI is the likely best next diagnostic step of the three.",
      "Phase only partially fits. Unexpected anatomy is truly discovered intraoperatively, and a surgeon can decide a subsequent workup then. However, every option already says Pause excision, so the operative response is supplied rather than tested; the distinguishing actions are later diagnostic investigations.",
      "The task calls for an operative and diagnostic plan, but the options do not establish whether any tissue will be taken now or how the operative episode will end. Do not assume intraoperative MRI, an on-table biopsy, or a specialist-planned biopsy route from these labels.",
      "No confident clinical inaccuracy is identified. The ordering of local imaging and planned core biopsy is plausible, but the exact workup and operative handling require clinician review rather than an unsupported rule that core biopsy is always wrong."
    ]
  },
  {
    "slot": "R1:dcis-gland-removal-and-sentinel-sequence",
    "priorReviewId": "review.n4.dcis-gland-removal-and-sentinel-sequence.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "The actual operation choice is determined preoperatively. No verified new intraoperative finding changes the axillary decision; an intra-op version would be misleading.",
    "reviewSuggestions": [
      "Either place the indication decision in preoperative planning, or supply a genuine verified intraoperative development that changes an otherwise reasonable axillary plan.",
      "For a same-operation sentinel decision, establish the necessary procedural preparation neutrally without using it to advertise the answer.",
      "Do not manufacture difficulty by hiding the name of the breast operation. Make the actual consequence of the finding discriminate between credible same-phase alternatives."
    ],
    "fairnessNotes": [
      "Node node.n4.dcis-gland-removal-and-sentinel-sequence.v1: no strong nonmedical wording, length, absolute or convergence shortcut is apparent. DCIS is a legitimate known diagnosis in a management task, not an illicit diagnosis giveaway.",
      "The described whole-gland removal amounts to naming mastectomy indirectly. Translating that prose and recalling its sentinel-node implication is a familiar association, not two consequential clinical decisions. Axillary dissection is a particularly weak competitor with no identified invasion or suspicious node.",
      "Sentinel-node biopsy is the plausible best offered axillary plan, but the scenario supplies no new intraoperative finding that explains why this predictable planning decision is being made only during breast dissection.",
      "Phase is possible but under-motivated: sentinel biopsy can be performed during the operation, yet its indication, consent and localization planning normally precede that point. The visible fields do not establish those prerequisites or an intraoperative change requiring reconsideration. This is a chronology/feasibility concern, not proof that sentinel biopsy at this moment is impossible."
    ]
  },
  {
    "slot": "R1:ulcer-temporary-injection-response",
    "priorReviewId": "review.n4.ulcer-temporary-injection-response.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "The post-injection observation does not change the key and powder ranking remains insufficiently specified. This stays basic adjunctive-hemostasis practice, not an invented two-step geometry rule.",
    "reviewSuggestions": [
      "Retain the real before/after findings, but compare credible definitive approaches whose ranking changes with a verified current observation such as target geometry, access or treatment response.",
      "Recheck that removing the post-injection observation changes the answer. If it does not, classify this as basic adjunctive-hemostasis practice rather than a two-step case.",
      "Have the clinician confirm the powder comparison in the exact treatment setting without making a broad unsupported prohibition."
    ],
    "fairnessNotes": [
      "Node node.n4.ulcer-temporary-injection-response.v1: mechanical clipping is the plausible best offered treatment for the focal previously bleeding site. Repeating epinephrine as the offered next treatment is weak, while topical powder has context-dependent uses and should not be taught as universally ineffective.",
      "For a PGY-2/3, prior focal bleeding treated with epinephrine already prompts definitive additional hemostasis. Deleting the raised-red-point description leaves substantially the same next-treatment answer; the residual finding does not earn a second consequential step.",
      "Phase fits precisely: the endoscopist is at the ulcer after injection and before completing hemostasis. No confident clinical inaccuracy is identified, and there is no need to invent a vessel-size threshold.",
      "The fields do not identify an access obstacle that would overturn clipping. Conversely, do not use this case to claim clipping is universally superior to every other definitive endoscopic modality, which is not what the offered comparison establishes."
    ]
  },
  {
    "slot": "R1:ulcer-recurrent-bleeding-after-clips",
    "priorReviewId": "review.n4.ulcer-recurrent-bleeding-after-clips.v1",
    "priorVerdict": "REVISE",
    "status": "REVISED_CANDIDATE",
    "candidateQuestionId": "question.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "reason": "See the prospective reasoning, concrete competitor and observation/counterfactual audit for the versioned candidate.",
    "reviewSuggestions": [
      "Describe target position and tissue behavior as observations rather than asserting that it can be drawn into the keyed device.",
      "Ask for the next hemostatic strategy and phrase any escalation as ending this attempt and proceeding to the named service, so every option answers the same decision.",
      "Remove the powder-only completion qualifier and compare credible plans at equivalent scope. Recheck whether the current findings, rather than a device permission sentence, determine the choice."
    ],
    "fairnessNotes": [
      "Node node.n4.ulcer-recurrent-bleeding-after-clips.v1: cap-mounted clipping is a plausible best strategy for recurrent focal bleeding after through-the-scope treatment. The recurrence and fibrotic base are clinically useful, but the last sentence already announces that the keyed maneuver is achievable.",
      "Phase fits for attempting additional endoscopic hemostasis versus ending the endoscopic attempt and escalating. Embolization now cannot literally be performed by the endoscopist in the current examination; its label should describe the decision to stop and refer if that is the intended competitor.",
      "The clinical choice can involve meaningful reasoning, but this version largely gives the feasibility inference and presents poorly balanced escalation alternatives. No confident clinical inaccuracy is asserted; the appropriate escalation pathway remains dependent on the actual treatment setting."
    ]
  },
  {
    "slot": "R1:colonic-wall-pattern-after-mucosal-biopsy",
    "priorReviewId": "review.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "priorVerdict": "PASS",
    "status": "FROZEN_EXACT",
    "candidateQuestionId": "question.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "reason": "Exact independently passed case, question and prior review presentation preserved.",
    "reviewSuggestions": [
      "Retain the distinction between sampled surface and imaged deep layer, the concordant current findings and the absence of attributable symptoms.",
      "Obtain clinician confirmation that the complete phenotype supports observation in this exact version; do not generalize it to all unsampled subepithelial lesions or add a diagnosis label before the choice."
    ],
    "fairnessNotes": [
      "Node node.n4.colonic-wall-pattern-after-mucosal-biopsy.v1: no decisive nonmedical wording overlap, option outlier, convergence, absolute or diagnosis label is apparent. The yellow, compressible mound and layer-specific findings require clinical interpretation rather than matching an option's words.",
      "The learner must reconcile a superficial specimen that did not sample the lesion with the independent wall-layer and current endoscopic phenotype, then decide whether more tissue or resection is warranted. Deeper sampling is a credible temptation after an inadequate specimen; resection is a distinct overtreatment error.",
      "Leaving the mound is the defensible best offered action for the asymptomatic, concordantly benign-appearing submucosal lesion. This does not treat the prior mucosal specimen as proof of a benign deep lesion or assert histologic certainty from it. No confident clinical inaccuracy identified from the supplied fields.",
      "Phase fits: although the miniprobe study is recorded from earlier, the current scope confirms the surface behavior and the choice is whether to sample, resect or leave the lesion during this examination. The negative sampling option is clinically substantive rather than a grammatical giveaway."
    ]
  },
  {
    "slot": "R1:small-polyp-residual-after-forceps",
    "priorReviewId": "review.n4.small-polyp-residual-after-forceps.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "The same cold-snare answer applies before and after the residual observation; forceps/hot-forceps competitors remain weak. New wide-stalk construct addresses a different reviewed slot instead.",
    "reviewSuggestions": [
      "Preserve the balanced option matrix, but make prior treatment or a current technical observation genuinely alter the appropriate completion technique.",
      "Replace the explicit snare-feasibility sentence with the observations necessary to assess feasibility, without concealing essential safety information.",
      "If the goal remains routine small-polyp technique recognition, seek explicit basic-item acceptance instead of calling the forceps history a second step."
    ],
    "fairnessNotes": [
      "Node node.n4.small-polyp-residual-after-forceps.v1: the four-option instrument/energy matrix is balanced; there is no component-frequency convergence that uniquely assembles the key.",
      "Cold snare is the plausible best offered technique for the described small nonpedunculated lesion. The forceps history does not create a second consequential decision because every choice already proposes removal of the visible remainder.",
      "The same answer follows for a previously untouched lesion of the stated size and morphology. For PGY-2/3 residents this is chiefly technique selection by a familiar rule; the two independent words instrument and energy do not automatically establish two reasoning steps.",
      "Phase fits: a visible residual lesion is being reassessed before withdrawal. No confident clinical inaccuracy is identified. The question need not imply that diagnostic sampling was intended to be complete excision."
    ]
  },
  {
    "slot": "R1:diminutive-polyp-versus-fold-attachment",
    "priorReviewId": "review.n4.diminutive-polyp-versus-fold-attachment.v1",
    "priorVerdict": "REVISE",
    "status": "REVISED_CANDIDATE",
    "candidateQuestionId": "question.n4.pedunculated-polyp-head-versus-stalk.v2",
    "reason": "See the prospective reasoning, concrete competitor and observation/counterfactual audit for the versioned candidate.",
    "reviewSuggestions": [
      "Use actual changing-view observations without announcing the final stalk classification, and verify that the competing interpretations would lead to different credible choices.",
      "Replace weak distractors with genuine same-stage errors supported for the exact lesion context.",
      "If morphology does not change the technique here, remove the decorative false-stalk story or redesign the objective; do not count it as a consequential step."
    ],
    "fairnessNotes": [
      "Node node.n4.diminutive-polyp-versus-fold-attachment.v1: cold snare is a plausible best offered technique for the final described lesion. Hot biopsy forceps is a weak contemporary competitor for routine diminutive-polyp management.",
      "The final observation supplies the nonstalked interpretation. The false initial stalk does not demonstrably create a different justified management branch for this particular tiny lesion; do not assume that any perceived stalk automatically mandates the hot alternative.",
      "Phase fits: the lesion is being inspected before resection. No confident clinical inaccuracy is asserted. The proposed morphology-to-energy counterfactual needs clinical confirmation rather than an invented size rule."
    ]
  },
  {
    "slot": "R1:esophageal-sample-territory-during-egd",
    "priorReviewId": "review.n4.esophageal-sample-territory-during-egd.v1",
    "priorVerdict": "REVISE",
    "status": "REVISED_CANDIDATE",
    "candidateQuestionId": "question.n4.post-impaction-biopsy-site-versus-trauma.v2",
    "reason": "See the prospective reasoning, concrete competitor and observation/counterfactual audit for the versioned candidate.",
    "reviewSuggestions": [
      "Compare credible esophageal sampling strategies or clinically plausible decisions to sample versus pursue a different next evaluation, with verified findings that distinguish them.",
      "Make prior sample location or adequacy change the current plan rather than simply naming the unsampled organ.",
      "Keep actual tissue provenance visible and do not manufacture difficulty by withholding it or changing a verified biopsy count arbitrarily."
    ],
    "fairnessNotes": [
      "Node node.n4.esophageal-sample-territory-during-egd.v1: esophageal biopsies are the defensible best of the listed sampling plans. The symptom pattern, current rings and prior specimen territory support sampling the esophagus; no confident clinical inaccuracy identified.",
      "The same choice follows if the previous-biopsy record is deleted. Neither distractor is a close sampling error within the clinically relevant territory, so the prior adequacy issue does not create a second consequential step.",
      "Phase fits: biopsy territory is selected during the ongoing endoscopy. Stating that there is no impacted bolus appropriately distinguishes an elective sampling situation, but cannot make gastric sampling a credible alternative."
    ]
  },
  {
    "slot": "R1:duodenal-sampling-despite-normal-view",
    "priorReviewId": "review.n4.duodenal-sampling-despite-normal-view.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "Source verification supports distributed duodenal sampling, but a broader sampling key remains a coverage/protocol cue. No unsupported precise bulb/distal split or hidden missing-target cue is introduced.",
    "reviewSuggestions": [
      "Create a genuine adequacy problem in a previously relevant specimen set, or compare credible sampling plans whose distinction matters despite a normal view.",
      "Keep gluten exposure and relevant laboratory context when needed, but remove redundant gap announcements and avoid using repeat gastric biopsy as disposable filler.",
      "Any added sampling sites, counts or diagnostic thresholds must be verified and clinician reviewed rather than supplied from assumption."
    ],
    "fairnessNotes": [
      "Node node.n4.duodenal-sampling-despite-normal-view.v1: duodenal sampling is the plausible best offered next step given the symptoms, serology, continued gluten intake and absence of prior small-intestinal histology. A normal visual surface does not by itself settle the histologic question.",
      "The prior gastric specimen and normal-view row do not create two independent consequential steps with this option set. A resident can choose duodenal biopsy from the presenting syndrome and serology; the repeat-gastric alternative is particularly weak.",
      "Phase fits: sampling can be done before withdrawing the current scope. The broad action label need not specify a complete biopsy protocol to answer this broad territory question, but it also does not teach one.",
      "No confident clinical inaccuracy is asserted. The case does not supply a serologic magnitude sufficient to adjudicate any particular biopsy-sparing protocol, and this review does not invent one."
    ]
  },
  {
    "slot": "R1:peristomal-leak-track-versus-adhesive",
    "priorReviewId": "review.n4.peristomal-leak-track-versus-adhesive.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "The measured leak path directly rehearses refitting. More detailed appliance comparisons can have several appropriate answers; a unique harder convexity/product hierarchy is not supported by the inherited claims.",
    "reviewSuggestions": [
      "Redesign around a real remaining appliance decision in which competing mechanisms or corrective changes remain plausible until the observed pattern is interpreted.",
      "If the gap has not been established, test the appropriate assessment instead of assuming a specific fit defect. If it has been established, choose credible competing corrections rather than another failed brand and a larger gap.",
      "Retain this exact straightforward resize scenario only with explicit acceptance as basic appliance troubleshooting."
    ],
    "fairnessNotes": [
      "Node node.n4.peristomal-leak-track-versus-adhesive.v1: closer fit is the reasonable single best offered correction of the explicitly observed gap. No confident clinical inaccuracy is identified.",
      "This version does establish an actual gap rather than inventing it, so the repair must not simply delete the observation and keep an unsupported resize key. The problem is that the entire inference and mechanical solution are already supplied.",
      "For PGY-2/3 residents this is one obvious corrective action, with a failed intervention and a geometrically opposite intervention as distractors. It does not require two consequential steps. Clinic phase is appropriate."
    ]
  },
  {
    "slot": "R1:stoma-junction-gap-versus-whole-retraction",
    "priorReviewId": "review.n4.stoma-junction-gap-versus-whole-retraction.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "Reassuring depth/viability information is necessary for fairness and leaves surgery weak. A unique competing dressing hierarchy is not established; do not remove safety data to manufacture difficulty.",
    "reviewSuggestions": [
      "Compare concrete plausible local-care strategies or construct a verified evolution that changes whether local care remains adequate.",
      "Retain the observations needed to distinguish superficial separation, deeper extension and whole-stoma retraction; do not create ambiguity by hiding depth or viability.",
      "If retaining the conservative-versus-operative recognition objective, label it as basic practice subject to explicit acceptance."
    ],
    "fairnessNotes": [
      "Node node.n4.stoma-junction-gap-versus-whole-retraction.v1: local protective care is the plausible best offered plan for the described limited superficial separation. The observations distinguish it from whole-stoma retraction and do not require inventing a depth cutoff.",
      "The referral's pulled-away wording adds a misleading label, but the current examination resolves it completely. Recognition of uncomplicated superficial separation followed by routine local care is a familiar single management association here.",
      "Resuturing and operative refashioning are not close remaining decisions for this favorable description. No confident clinical inaccuracy identified. Clinic phase is appropriate; the exact local dressing method is not specified."
    ]
  },
  {
    "slot": "R1:ileostomy-losses-versus-primary-muscle-complaint",
    "priorReviewId": "review.n4.ileostomy-losses-versus-primary-muscle-complaint.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "NIH facts verify the magnesium/potassium interaction, but the proposed added potassium trend did not change the selected magnesium test and endocrine/muscle alternatives remained weak. No new candidate emitted.",
    "reviewSuggestions": [
      "Use a real competing explanation or prior result that changes which additional laboratory assessment is needed, with credible same-stage alternatives.",
      "Remove decorative exercise history and redundant muscle exclusions unless they genuinely discriminate the revised options.",
      "Do not introduce numerical ostomy-output cutoffs, medication causes or replacement rules without supporting evidence."
    ],
    "fairnessNotes": [
      "Node node.n4.ileostomy-losses-versus-primary-muscle-complaint.v1: renal function, electrolytes and magnesium is a reasonable best initial panel among those offered. Multiple concordant losses/dehydration observations support it without requiring an exact output threshold.",
      "The options are similarly structured three-part laboratory lists, with no meaningful length or component-convergence cue. Their clinical relevance is poorly balanced: the muscle panel and inflammatory/lactate panel are not close competitors for the supplied presentation.",
      "The task is principally recognizing fluid/electrolyte loss and ordering its routine panel, not two consequential decisions. The walking history can be removed without changing the answer.",
      "Clinic phase fits. No confident clinical inaccuracy identified. This narrow laboratory question should not be represented as a complete disposition or fluid-treatment plan; the visible data are insufficient to grade those separate decisions."
    ]
  },
  {
    "slot": "R1:venous-ulcer-contralateral-pressure-trap",
    "priorReviewId": "review.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "priorVerdict": "PASS",
    "status": "FROZEN_EXACT",
    "candidateQuestionId": "question.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "reason": "Exact independently passed case, question and prior review presentation preserved.",
    "reviewSuggestions": [
      "Preserve the acquisition behavior and the distinction between contralateral reassurance and ipsilateral measurement validity.",
      "Keep the task at selection of the next investigation unless verified results and criteria are later supplied for a treatment decision. Obtain clinical sign-off on the exact version."
    ],
    "fairnessNotes": [
      "Node node.n4.venous-ulcer-contralateral-pressure-trap.v1: no decisive nonmedical shortcut is apparent. Every option evaluates the left leg; laterality matching alone cannot choose the key. The exhibit reports raw acquisition behavior rather than naming noncompressibility or ordering a toe test.",
      "Two consequential steps are present: recognize that the left ankle acquisition cannot establish a usable occlusion pressure despite reassuring right-sided data, then select another physiologic assessment rather than exercise with the same measurement limitation or immediate anatomical imaging.",
      "Toe pressure with digital waveforms is the defensible best offered next investigation. A warm foot at rest and venous reflux do not establish the left limb's arterial suitability for the intended ulcer treatment. The exercise and CT alternatives represent distinct credible misunderstandings of the remaining question.",
      "Clinic phase fits. No confident clinical inaccuracy is identified. The item establishes the need for further physiologic assessment, not an exact compression prescription or threshold; this review supplies neither."
    ]
  },
  {
    "slot": "R1:parastomal-bulge-after-pink-prolapse-reduction",
    "priorReviewId": "review.n4.parastomal-bulge-after-pink-prolapse-reduction.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "Persistent obstruction after apparent surface reduction requires escalation, but replacing generic transfer with a clinic-level definitive procedural key would exceed supported scope. Keep the safety draft catalog-only.",
    "reviewSuggestions": [
      "Seek explicit acceptance as a basic safety-recognition exception, retaining the warning signs and making urgency clear.",
      "If a two-step resident item is required, redesign around a genuine remaining decision after urgent surgical assessment is already established, with evidence and clinician review for that new phase.",
      "Do not retain repeat reduction of an already reduced visible segment as the principal competing action."
    ],
    "fairnessNotes": [
      "Node node.n4.parastomal-bulge-after-pink-prolapse-reduction.v1: urgent hospital surgical assessment is the clear best offered disposition for the persistent obstructive course and separate irreducible tender bulge. Pink visible mucosa is not sufficient reassurance. No confident clinical inaccuracy identified.",
      "The safety decision remains the same if the entire earlier prolapse/reduction story is removed. Thus recognizing the distinction between the visible bowel and the adjacent bulge is not necessary to choose hospital care from these options.",
      "This is important easy safety recognition, not a moderate/hard two-step item. Clinic phase fits because the actionable decision is escalation out of clinic.",
      "Do not make this harder by removing vomiting, absent output, tenderness or irreducibility. That would weaken safety and possibly fairness rather than improve the reasoning task."
    ]
  },
  {
    "slot": "R1:incisional-pocket-above-retained-mesh",
    "priorReviewId": "review.n4.incisional-pocket-above-retained-mesh.v1",
    "priorVerdict": "PASS",
    "status": "FROZEN_EXACT",
    "candidateQuestionId": "question.n4.incisional-pocket-above-retained-mesh.v1",
    "reason": "Exact independently passed case, question and prior review presentation preserved.",
    "reviewSuggestions": [
      "Preserve the distinction between the current subcutaneous pocket and the separate retromuscular plane, along with the sutures spanning the involved incision.",
      "Do not expand this into a no-antibiotics or outpatient-safety key without appropriate clinical observations. Have the clinician confirm the exact initial drainage ranking and retain clinical-review status."
    ],
    "fairnessNotes": [
      "Node node.n4.incisional-pocket-above-retained-mesh.v1: no decisive blind wording shortcut is apparent. All choices provide drainage, and the longest, most comprehensive option is a distractor rather than the key. The fascial and mesh-plane observations are decision-critical localization information.",
      "The learner must localize the current infection relative to the retained implant, then choose adequate source control of an incisional pocket still constrained by sutures. Needle drainage is a plausible less-invasive temptation; mesh explantation is a distinct over-attribution of superficial infection to a prosthesis.",
      "Open incisional drainage is the defensible best initial source-control plan among these options. No demonstrated tract is not absolute proof that the mesh can never be involved, but the described current evidence does not justify immediate explantation.",
      "Clinic phase fits. No confident clinical inaccuracy identified. Conversing comfortably does not establish absence of systemic illness; this PASS is limited to the requested source-control choice and does not validate an unstated antibiotic or disposition decision."
    ]
  },
  {
    "slot": "R1:retractile-examination-versus-old-position-label",
    "priorReviewId": "review.n4.retractile-examination-versus-old-position-label.v1",
    "priorVerdict": "REVISE",
    "status": "REVISED_CANDIDATE",
    "candidateQuestionId": "question.n4.bilateral-testis-maintenance-versus-ascent.v2",
    "reason": "See the prospective reasoning, concrete competitor and observation/counterfactual audit for the versioned candidate.",
    "reviewSuggestions": [
      "Build a verified longitudinal or examination discrepancy that actually changes management, while preserving the observations needed to distinguish ascent from retractility.",
      "Use credible follow-up versus intervention decisions at the same stage rather than relying on the observe/operate/discharge middle-option pattern.",
      "Alternatively retain this as explicitly accepted basic examination-to-management practice, without claiming two consequential steps."
    ],
    "fairnessNotes": [
      "Node node.n4.retractile-examination-versus-old-position-label.v1: the ability to place the testis dependently without tension and have it remain after release supports surveillance over orchiopexy in the offered comparison. No confident clinical inaccuracy identified.",
      "The raw examination should be retained: it is essential to distinguish retractility from a testis that cannot remain in the scrotum. It does not itself name the diagnosis, but it supplies the classic recognition pattern.",
      "The prior scrotal records and erroneous referral label do not add a second consequential decision: the current examination alone selects routine follow-up. Surgery is a familiar contrasting rule, and ending surveillance is an overly reassuring alternative.",
      "Clinic phase and caregiver context fit. The continued-surveillance option is broad but adequately answers the broad management question; this review does not invent a follow-up interval."
    ]
  },
  {
    "slot": "R1:pilonidal-drainage-after-abscess-resolution",
    "priorReviewId": "review.n4.pilonidal-drainage-after-abscess-resolution.v1",
    "priorVerdict": "REVISE",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "No abscess makes drainage a weak distractor; several nonacute or later operative options can be valid. No source-supported exact treatment ranking for a harder pediatric phase was established.",
    "reviewSuggestions": [
      "Keep the abscess-versus-no-abscess observations, but compare credible current plans based on a verified treatment history and symptom burden.",
      "Remove asymmetric immediate/wide modifiers and the sentence that simply supplies the hygiene/pressure rationale; retain any activity detail that genuinely changes the revised decision.",
      "If this remains an initial conservative-care recognition task, request explicit acceptance as basic practice rather than manufacturing difficulty with unsupported procedures or timelines."
    ],
    "fairnessNotes": [
      "Node node.n4.pilonidal-drainage-after-abscess-resolution.v1: conservative cleft care is a plausible best initial plan for the current mild nonabscess findings. Persistent small-volume drainage need not imply a recurrent drainable collection. No confident clinical inaccuracy identified.",
      "The current absence of an abscess and preserved function make both offered procedures weak. Distinguishing the resolved abscess from current mild sinus drainage is useful recognition, but the remaining management choice is routine and heavily cued.",
      "Clinic phase and family context fit. The record does not establish the duration or failure of a prior conservative program, so it should not be used to rule out all future elective procedures or to rank specific minimally invasive treatments.",
      "The verdict concerns the two-step resident standard and option balance, not an instruction to remove the reassuring examination or escalate the patient's care."
    ]
  }
];

export const QUESTION_NEW_N4_ROUND2_PRIOR_PARKS = [
  {
    "slot": "R1_MANUAL:barrett-pathology-reclassification-before-treatment",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "retainedCatalogCaseId": "case.n4.barrett-pathology-reclassification-before-treatment.v1",
    "reason": "Expert dysplasia confirmation and subsequent treatment are separate decision stages; constructing a same-stage intra-endoscopy key would require an additional verified current target, not a duplicated referral rule."
  },
  {
    "slot": "R1_MANUAL:ileostomy-water-replacement-after-repletion",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "retainedCatalogCaseId": "case.n4.ileostomy-water-replacement-after-repletion.v1",
    "reason": "ORS is supported, but added repletion history does not alter the answer. A three-fluid recipe remains recall with weak plain-water competition."
  },
  {
    "slot": "R1_MANUAL:hernia-contour-leak-versus-new-skin-product",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "retainedCatalogCaseId": "case.n4.hernia-contour-leak-versus-new-skin-product.v1",
    "reason": "Duplicates the peristomal seal/contour meaning and lacks a uniquely ranked specific appliance intervention."
  }
];

export const QUESTION_NEW_N4_ROUND2_REMAINING_SLOTS = [
  {
    "slot": "OR07",
    "status": "NEW_CANDIDATE",
    "candidateQuestionId": "question.n4.two-tubes-versus-liver-bed-separation.v1",
    "reason": "Critical-view anatomy verified; current separable lower-body phase retained."
  },
  {
    "slot": "OR08",
    "status": "NEW_CANDIDATE",
    "candidateQuestionId": "question.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "reason": "2025 SAGES artifact and complete-study requirements verified; repeat sequence is labeled as clinical application."
  },
  {
    "slot": "OR09",
    "status": "NEW_CANDIDATE",
    "candidateQuestionId": "question.n4.recurrent-groin-mesh-compartment.v1",
    "reason": "Official HerniaSurge summary opposite-plane recommendation verified; existing concept identity retained."
  },
  {
    "slot": "OR10",
    "status": "NEW_CANDIDATE",
    "candidateQuestionId": "question.n4.lumpectomy-marker-identity-and-target.v1",
    "reason": "Current ASBrS target/specimen guidance verified; no exact microscopic margin threshold authored."
  },
  {
    "slot": "OR11",
    "status": "OWNER_HELD",
    "candidateQuestionId": null,
    "reason": "The manager explicitly retains the anal-fistula clinical decision hold.",
    "ownerQuestion": "For a woman with an anterior fistula crossing the lowest external sphincter, prior obstetric sphincter damage, leakage and no undrained abscess, should the initial key be a loose seton followed by a sphincter-preserving repair, or another named operation?"
  },
  {
    "slot": "OR12",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "No directly verified current anorectal extent-of-excision comparison with three credible same-phase alternatives was established. Do not invent a tissue-bridge dimension or unsupported completion rule."
  },
  {
    "slot": "P03",
    "status": "PARKED_QUALITY",
    "candidateQuestionId": null,
    "reason": "NHS verification supports Sistrunk extent, but a recurrent cyst-only excision did not change that recall answer. A functional-thyroid imaging key would require more specific evidence; no such key emitted."
  },
  {
    "slot": "P04",
    "status": "COVERED_BY_REVISION",
    "candidateQuestionId": "question.n4.bilateral-testis-maintenance-versus-ascent.v2",
    "reason": "Consolidated with the R1 testis revision; do not count the same case twice as fresh supply."
  },
  {
    "slot": "P05",
    "status": "NEW_CANDIDATE",
    "candidateQuestionId": "question.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "reason": "Two pediatric public-health sources directly support current contents, reducibility and repair/urgency distinctions; exact existing family tuple retained."
  },
  {
    "slot": "P06",
    "status": "PARKED_CURRENT_SOURCE_BOUNDARY",
    "candidateQuestionId": null,
    "reason": "The newer 2025 WSES edition was published in 2026. Its exact pediatric appendicolith/NOM boundary was not verified in accessible permitted full guidance. Do not silently substitute the 2020 rule or use paywalled snippets."
  }
];
