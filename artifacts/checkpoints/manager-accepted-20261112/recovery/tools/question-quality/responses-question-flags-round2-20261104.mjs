/** Each entry corresponds, in order, to one independent-review note. These are
 * author responses, not a second independent verdict or clinical approval. */
export const responses={
 F01:{
  cues:[
   "All choices are now treatment plans after a stated completed review; there is no uniquely cautious information-gathering option.",
   "Deleted the restricted-information qualifier. The competing re-excision plan names a real operation and subsequent irradiation without confessing an error.",
  ],
  fairness:[
   "Separated treatment alternatives at one decision stage; review is completed rather than an implied missing prerequisite.",
   "Supplied oriented main and additional cavity specimens, the new external edge, remaining final margins and residual imaging observations.",
   "Changed the scored profile: the final shave edge is 2 mm, rather than an unresolved final 1-mm edge. A new construct version records this change.",
   "The new packet shows all five assembled fields and finite-profile lint. It retains the distinction between an author self-check, independent review and Melissa's clinical sign-off.",
  ],
  suggestions:[
   "Completed specimen/imaging reconciliation is explicit. The original 1-mm surface and separately inked 2-mm final surface require interpretation.",
   "Three actual treatment plans replace the sequential review/operation pair; no option is qualified by a deliberately incomplete evidentiary basis.",
   "Created a new final-cavity-margin construct because the task now chooses treatment from completed findings; the earlier close-margin construct remains intact.",
  ],
 },
 F02:{
  cues:[
   "Removed the local-shoulder exclusions and nerve-list task; later abdominal observations now change the clinical assessment.",
   "Deleted initiating-afferent scaffolding. The new task asks for a specific outside imaging decision after the changed postoperative course.",
  ],
  fairness:[
   "Replaced the anatomical-outlier task with three real biliary imaging competitors. The owner's nerve-list criticism cannot select an answer in this new construct.",
   "Added the already recorded bile-leak localization claim. The stable, post-CT outside record defines its scope; no particular nerve or definitive leak diagnosis is asserted from pain alone.",
   "The answer labels are parallel imaging requests with comparable detail. The required clinical distinction is anatomical localization versus leak detection, not option grammar.",
   "Two consequences are required: revise the interpretation of the postoperative course, then choose a study suited to duct planning. Difficulty remains an author prediction pending review.",
  ],
  suggestions:[
   "The worsening abdominal course distinguishes the new assessment from uncomplicated referral pain and leads to an actual source-supported planning decision.",
   "Did not pad another nerve list. The closer near misses are dynamic scintigraphy and conventional MRCP, which answer related but different imaging questions.",
   "Retained the concerning clinical course and explicit stability/post-CT scope. This is a new workup construct, not a claimed hard version of the old anatomy fact.",
  ],
 },
 F03:{
  cues:[
   "Removed trunk/truncal terms. No abnormal axial vein is named; the learner must identify what the completed study actually assessed.",
   "The task no longer points to demonstrated reflux. It asks which investigation is needed for treatment assessment from the actual acquisition/report context.",
   "Removed iliac-stent padding. All alternatives are specific venous investigations, including a plausible but different proximal-outflow study.",
  ],
  fairness:[
   "Kept specific alternatives and removed preference/permission wording. No generic individualized intervention is offered.",
   "No procedure is mandated from the visible veins. The key requests a reflux study rather than ranks ablation against tributary treatment without candidacy data.",
   "The new diagnostic task uses the existing claim's explicit distinction between reflux assessment and a compression-only DVT study; no technical intervention eligibility is invented.",
   "The resident must interpret protocol scope before choosing the next diagnostic request. The repeated modality is not automatically wrong: the key is also duplex ultrasound.",
  ],
  suggestions:[
   "Used a report with actual compression observations instead of a named reflux target. The protocol interpretation changes the referral request.",
   "All alternatives now investigate venous disease; no unsupported iliac intervention is a filler option.",
   "Created a new diagnostic-protocol construct and retained the earlier intervention-target construct. The key is a concrete investigation, not generic consultation.",
  ],
 },
 F04:{
  cues:[
   "Removed the community repeat-test foil. Repeating calcium is now a clinical treatment near miss whose suitability depends on the recorded ECG response, not mere novelty.",
  ],
  fairness:[
   "No availability/no-delay permission is restored. The question is a completed hospital record, after disposition has already occurred.",
   "Retained confirmed 6.7 mmol/L and added the recorded calcium-versus-insulin mechanism claim. No dose, repeat interval, elimination regimen or outcome benefit is inferred.",
   "All choices are next inpatient management plans, rather than a disposition mixed with an outpatient treatment label.",
   "Changed the scored decision to interpreting response and selecting the remaining treatment mechanism. A new concept preserves the original community-disposition card.",
   "No key-length or grammar shortcut is intended. The key changes with the biochemical/ECG response; clinical adequacy and difficulty require independent review.",
  ],
  suggestions:[
   "Confirmed severe potassium remains visible, and the record is explicitly inpatient; urgency is not hidden to make the problem harder.",
   "Moved beyond disposition to a source-supported post-calcium decision: electrical response does not establish potassium correction.",
   "The observation/medication options are parallel hospital plans. Only the original 6.7 value is reused; no new medication threshold or dosing protocol is fabricated.",
  ],
 },
 F05:{
  cues:[
   "Removed the conspicuous pair of open procedures. Surveillance and open excision now compete with representative needle reassessment after a real adequacy problem.",
   "Removed initial-sampling wording. The key repeats a class of sampling, so least-invasive novelty cannot substitute for interpreting the previous specimen.",
  ],
  fairness:[
   "Neck location and separation from thyroid/salivary structures remain explicit. Recommendation: retire this exact item from an ABSITE-labelled bank pending permitted public scope verification.",
   "The key allows specialist-selected FNA or core reassessment; it does not claim that repeat FNA is universally better than core or every open biopsy.",
   "Supplied the fluid-only slide findings and refilling lesion. No lymphoma architecture requirement or fixed failed-attempt rule is asserted.",
   "The new construct applies specimen adequacy and the adult cystic-mass boundary to a next diagnostic strategy. It is not the original initial-needle recall item.",
  ],
  suggestions:[
   "Retained explicit lateral neck anatomy and imaging separation from the thyroid and salivary glands.",
   "Added actual macrophage/proteinaceous-fluid findings without lesional cells, rather than an inconclusive label, to require adequacy interpretation.",
   "Used surveillance as the credible false-benign interpretation and open excision as an escalation near miss. Core remains included in the valid needle-assessment strategy.",
   "Made the owner recommendation explicit: retire from the ABSITE-labelled bank until scope is verified. A clinical guideline is not evidence of exam coverage.",
  ],
 },
 F06:{
  cues:[
   "Deleted the pretransplant donor-binding result entirely. That result is now something the player must predict, not paraphrase.",
   "Retained the pathology needed for a fair vascular/immune differential, but changed the task to the direction and archived timing of an unprovided interaction.",
   "Immediate chronology remains necessary evidence. It is no longer redundant with a supplied positive preimplantation serum result.",
  ],
  fairness:[
   "No pre-answer hyperacute rejection label is restored. The laboratory alternatives require applying the inferred mechanism rather than renaming its supplied components.",
   "Retained patent major vessels and microvascular immune injury so the event is not inferred from early dysfunction alone.",
   "The two reasoning operations are pathology-pattern interpretation and prediction of recipient/donor material and target direction. This is a self-check, not a new independent difficulty rating.",
   "No antibody specificity, assay performance, treatment or universal timing threshold is demanded. The old preformed-antibody clinical meaning is preserved.",
  ],
  suggestions:[
   "Applied the requested deletion test: the serum sentence is removed while the circulation/pathology information needed for the key remains.",
   "Asked for a distinct mechanistic prediction from stored materials. It is not presented as a validated clinical assay protocol or actual new test order.",
   "The three archived results compare immune direction and cellular versus serum effects at comparable specificity; no essential vascular information is withheld.",
  ],
 },
 F07:{
  cues:[
   "The task no longer directs the reader to discount biochemistry or choose an omitted domain; it asks for a concrete preoperative plan.",
   "Replaced the disease-process-versus-neutral-function labels with three preparation plans, each stated before finalizing the operation date.",
  ],
  fairness:[
   "No alone wording or hidden incomplete-score option remains. The case requires acting on a new clinical observation.",
   "Retained laboratory reassurance and prior portal-hypertension history, and added the actual new fluid findings that make optimization consequential.",
   "Separated past variceal bleeding from current shifting dullness/free fluid. The new task does not imply a current bleed from the history.",
   "Removed renal/electrolyte-domain alternatives. No missing electrolyte result or platelet cutoff is used to rank neutral laboratory categories.",
   "The new decision is recognition of active decompensation followed by timing/optimization for a still-reducible nonurgent hernia. No probability or absolute surgical prohibition is invented.",
  ],
  suggestions:[
   "Past and present events are explicit; alternatives now have parallel preparation/timing grammar rather than nonparallel risk-domain labels.",
   "Used the independently recorded active-decompensation optimization claim and created a new operative-planning construct.",
   "Retained information that bears on urgency and competing bleeding/facility considerations. The new fluid event, rather than a task instruction, drives the selected priority.",
  ],
 },
 F08:{
  cues:[
   "The lead-in no longer repeats the distinctive morphology; it neutrally asks for the next imaging request.",
   "Regional nodes remain actual case observations, not a task scaffold. The answer requires choosing the distal source/protocol rather than restating a diagnosis.",
   "Removed the localized-cellulitis foil and all diagnostic-label alternatives. The choices are three specific ultrasound requests.",
  ],
  fairness:[
   "Moved beyond syndrome recognition to a source-assessment decision, with the original distal/proximal pattern still present.",
   "Did not treat local inflammation as mutually exclusive. The uncertain distal swelling is a separate question supported by an additional soft-tissue-ultrasound claim.",
   "Tender varicosities now overlap the affected area, making the venous study a real near miss rather than a remote diagnosis.",
   "The two consequences are localization of the likely process and imaging of a source whose contents examination cannot establish. No antibiotic or severity claim is added.",
  ],
  suggestions:[
   "Replaced the recap lead-in with a complete neutral next-investigation task.",
   "All alternatives are actual ultrasound targets/protocols; no contrastive localized qualifier eliminates a diagnosis label.",
   "Used the existing collection-versus-inflammation ultrasound claim to support the management-relevant next assessment. No new organism, treatment or fabricated test result is supplied.",
  ],
 },
 F09:{
  cues:[
   "All four pairs can involve lower filling and adverse respiratory observations. A direction-only sequence no longer identifies the key.",
   "Removed the reversed-key sequence and used a complete two-by-two matrix of circulatory and respiratory mechanisms.",
   "Removed explicit increased-versus-falling mismatch wording. Each distractor is a plausible mechanism pair requiring the actual controls and pressure observations.",
  ],
  fairness:[
   "Kept explicit monitored variables and conditional, completed-record framing; no vague filling label or operative prescription is restored.",
   "The result is a best explanatory fit to controlled observations, not proof of a universal or sole haemodynamic mechanism.",
   "Replaced caval inflow with caval return restriction and explained abdominal venous return in feedback.",
   "The added respiratory observation requires an independent interpretation before the pair can be selected. The author has not granted an independent moderate/hard verdict.",
  ],
  suggestions:[
   "All options combine real circulatory and respiratory categories; fixed position and peak/plateau observations discriminate them rather than opposite signs.",
   "Retained fixed position and tidal-volume controls because they support attribution; they are not feasibility permission.",
   "Defined the venous direction and preserved pressure dependence. The new scored construct includes a separate respiratory-mechanics application and remains needs_clinician_review.",
  ],
 },
 F10:{
  cues:[
   "Removed accompany. The neutral task asks for an axillary strategy under the current operative plan.",
   "No key label mirrors accompany or with breast removal. All choices describe sentinel-node timing or omission at comparable specificity.",
   "Removed routine axillary dissection. Deferral pending invasion and omission are credible DCIS pathways that can be incorrectly carried into mastectomy planning.",
  ],
  fairness:[
   "Retained the standard mastectomy setting and did not revive the unsupported general oncoplastic exception.",
   "Kept the sampled pure-DCIS finding and normal nodal observations; they are relevant to the false-reassurance near miss.",
   "The deferral option explicitly says if final pathology reveals invasion, rather than the compressed after-invasive-pathology phrase.",
   "Added an actual change from conservation to mastectomy. The intended application is reconciling the changed operation with limited preoperative sampling, not merely repeating a task phrase.",
   "The single-source and conventional-mapping limitations remain. No novel delayed-tracer protocol or universal technology rule is claimed.",
  ],
  suggestions:[
   "Used a neutral complete strategy task and parallel sentinel-node timing/omission plans.",
   "Replaced axillary-dissection padding with the clinically plausible conservation-omission error.",
   "The current operation differs from the original plan and changes the axillary decision under the existing verified mastectomy rule. No unverified exception is introduced.",
  ],
 },
 F11:{
  cues:[
   "DNR is now necessary background for an agreed modification, not a term whose expansion supplies a definition answer.",
   "Removed order-itself wording. The task applies the agreed endpoint to an actual conditional recovery state.",
   "Removed infection-treatment and airway-definition foils. All choices are specific handover orders differing in the reinstatement endpoint.",
  ],
  fairness:[
   "The task now states exactly which recovery-order decision is being tested; it does not ask whether routine abscess care should be withheld.",
   "An agreed temporary modification is explicitly established. Nothing is inferred solely from a baseline DNR order.",
   "Supplied the agreed physiological recovery endpoint and observations of independent breathing with continuing cardiovascular support. The scenario is conditional, preserving the future procedure.",
   "The resident must interpret the recovery state and then apply the agreement instead of a location-based endpoint. A new scored construct records this change.",
   "The answer is ethical application of the stated agreement, not a claim about jurisdiction-specific law or a universal perioperative code policy.",
  ],
  suggestions:[
   "Did not seek a foundational-definition exception or relabel it as accepted basic; replaced the task with an application.",
   "Provided a concrete agreed endpoint and a procedure-specific possible recovery state. Every choice is a specific order plan.",
   "DNR is not obscured or equated with refusing treatment. The reinstatement construct is versioned separately and uses the recorded agreement/documentation claims.",
  ],
 },
 F12:{
  cues:[
   "Removed repeat ultrasound. All three alternatives are genuinely different next biliary studies.",
   "The profile now supplies a residual cholestatic question rather than a duct-negative shortcut to HIDA. The keyed study changes with an explicit new concept version.",
  ],
  fairness:[
   "No availability, no-delay or inconclusive wording is restored. Raw wall/fluid and duct observations remain.",
   "The new unresolved question is possible duct disease after a settled episode, supported by the recorded intermediate-likelihood MRCP claim.",
   "Supplied bilirubin and inflammatory results relative to their actual reference intervals, persistent ALP/GGT abnormalities and the absence of a visible duct focus. No invented exact cutoff is used.",
   "Interpret the competing gallbladder/duct patterns, then select noninvasive confirmation before a therapeutic duct pathway. This is a different decision from routine HIDA selection.",
   "The options are specific investigations with parallel noun grammar. EUS is not an incorrect distractor and is acknowledged in feedback.",
  ],
  suggestions:[
   "Retained concrete ultrasound observations without feasibility permission or an authored uncertainty label.",
   "Added the sourced duct-assessment context and explicit laboratory pattern; it changes the study rather than decorates the HIDA association.",
   "MRCP, scintigraphy and ERCP are real competing strategies. No hidden acquisition failure or equally appropriate EUS foil is invented.",
   "The first interpretation changes the clinical question and key; the second applies the diagnostic-versus-therapeutic sequence. New construct/history separation is explicit.",
  ],
 },
 F13:{
  cues:[
   "Removed the purpose-labelled questionnaire options. The task asks for a chart entry, and every option concerns OSA assessment.",
   "The reports are named inputs rather than a generic key category. No option uniquely advertises itself as the sleep-apnoea screening method.",
   "Retained the clinically meaningful sleepiness discrepancy but did not translate each instrument's domain in the pre-answer report. It must be reconciled, not used as an announced exclusion.",
  ],
  fairness:[
   "No alone wording or generic comprehensive-method option remains. All choices are comparably specific diagnostic/risk entries.",
   "Named STOP-Bang and Epworth and asked for interpretation of their reported flags; no claim that any questionnaire with a generic title is validated.",
   "The two domains and the screening-versus-diagnosis boundary both bear on the entry. A low sleepiness report does not clear the breathing-history concern.",
   "The decision is risk communication under discordant screening information, not selecting a named tool by its advertised purpose. New independent difficulty review is still required.",
  ],
  suggestions:[
   "Changed the task from choosing a generic method to interpreting named completed reports. The answer choices are chart entries, so they are parallel at that new decision stage.",
   "Used reported instrument flags and observed history, without reproducing items, implementing a score or inventing a cutoff. Confirmed diagnosis remains distinct from screening risk.",
   "Preserved the discrepancy because it changes the documentation error; removed the original task-to-key purpose match.",
  ],
 },
 F14:{
  cues:[
   "Recommended retiring the exact variant rather than submit another unsupported replacement. Its eligibility disclosure remains visible only in the explicitly held record.",
   "No already-completed-test foil is repackaged as a new draft. The exact unchanged item is not release-ready.",
   "No synthetic TSH value or unverified ultrasound/size threshold is invented to disguise the unsupported decision.",
  ],
  fairness:[
   "Accepted the FAIL/readiness finding and chose the requested retirement-proposal route. This is not counted among the sixteen revised drafts.",
   "The record lacks the actual selection profile; the available atomic claim expressly excludes those cutoffs. Retirement is the recommendation until evidence is adequate.",
   "The age/sex omission is acknowledged. Cosmetic repair would not justify retaining the unsupported scored decision, so no replacement is claimed.",
   "No new source verification or source access is implied under the continuing no-network constraint.",
   "The exact item is not marked passed, basic, clinically approved or ready to ship. A future replacement requires a new supported profile and review.",
  ],
  suggestions:[
   "Recommend retirement from new selection; implementation of retirement remains an owner/manager decision rather than an unauthorized selector edit.",
   "A future replacement requires direct permitted verification and atomic mapping of size/morphology criteria; no placeholder claim is added.",
   "A future replacement must include the named patient's age/sex and credible same-stage actions. Those requirements are not treated as solved here.",
   "No approval transfer is made. Any later replacement must undergo independent review and Melissa's exact-version sign-off.",
  ],
 },
 F15:{
  cues:[
   "All four choices now accommodate the observed volume direction. Position reversal and an independent gas pattern, not a sign-only match, select the pair.",
   "Removed the toward-versus-away answer contrast. Balanced components recur in a complete four-option matrix.",
   "Removed dependent pooling as an option contradicted by unchanged position. Head-up tilt is now an actual intervention whose reversal must be interpreted.",
  ],
  fairness:[
   "Explicit volume variables, pressure, position and gas observations preserve intelligibility; no vague filling or universal laparoscopy rule returns.",
   "The conditional record supports attribution, not proof of the sole mechanism in every patient. Persistent gas findings are treated separately from reversible volume findings.",
   "Kept the required constant-pressure and ventilation context. Their role is causal interpretation, not decorative elimination.",
   "The task now requires two independent interpretations before selecting a pair, with no new gas/pressure numeric cutoff.",
   "The new construct is position/gas integration, distinct from F09's pressure/compliance interpretation. The old early-direction version is retained historically.",
  ],
  suggestions:[
   "Replaced the duplicated early-direction objective with a separate application rather than seek an unsupported basic label. The original remains available for an owner retirement decision.",
   "All pairs fit the general sign pattern; the recorded position reversal and blood-gas pattern discriminate the causes.",
   "Kept conditional observations and source limitations. No universal preload direction or numeric pressure threshold is asserted.",
  ],
 },
 F16:{
  cues:[
   "The study name no longer chooses an assessment-domain option. The actual node morphology and specimen now determine a sampling decision.",
   "The task no longer asks which operative-assessment category ultrasound represents; it asks for a concrete preoperative sampling request.",
   "Removed histological/functional modality outliers. Every option is repeat node aspiration with cytology and an ancillary study.",
  ],
  fairness:[
   "Retained explicit clinician/radiologist roles and neck anatomy, resolving both tester wording concerns.",
   "No imaging diagnosis, microscopic nodal absence or neck dissection is declared. The new raw cyst-fluid findings are not treated as a benign clearance.",
   "The actual report now changes the request: a source-supported suspicious cystic node and unrepresentative fluid sample need further assessment before planning.",
   "The learner must interpret adequacy and select the ancillary request relevant to the known primary, rather than categorize an imaging modality.",
   "Options have comparable grammar and specificity; every option repeats sampling and includes cytology plus an ancillary study, avoiding an only-untested-option cue.",
  ],
  suggestions:[
   "Asked for the concrete next node-assessment step that can affect operative planning, without assuming imaging establishes microscopic disease.",
   "All choices occupy the same sampling stage and anatomical target; no histological/functional scope switch remains.",
   "Used the existing directly recorded ATA-linked cystic-node/FNA-washout claim, with its 12-mm profile and intact-thyroid limitations. No new criterion or result is invented.",
   "Created a new node-sampling construct instead of relabeling the old ultrasound-definition task as challenging or accepted basic.",
  ],
 },
 F17:{
  cues:[
   "Established chronology once, then removed repeated persistence language from the task. The new decisive issue is which lesion was sampled.",
   "Removed immediate repeat ultrasound. Interval surveillance is now a real benign-sample near miss rather than repeating a just-completed test as padding.",
   "Added a benign but different sampled target. Selecting further tissue assessment requires reconciling sites and histology, not just choosing the sole new kind of test.",
  ],
  fairness:[
   "Kept the actual mammographic and ultrasound findings at the clinical marker; no bare negative label is restored.",
   "The key remains representative tissue assessment without mandating an unsupported imaging-guided technique or inventing an imaging-visible target.",
   "Added a consequential lesion-identity step before the existing clinical/imaging-discordance decision. The benign sample can mislead a good but inattentive resident.",
   "Specified separate sites in the same breast and the absence of an imaging correlate at the concerning site. No acquisition failure is assumed.",
   "MRI is a credible next strategy in other contexts; it is not universally excluded. The answer is limited to the unsampled concerning finding in this record.",
  ],
  suggestions:[
   "Used one prior-visit reference to establish chronology and removed repeated persistence cues from the neutral task.",
   "The three strategies follow a specific target/histology mismatch. The key leaves the representative biopsy approach to the specialist.",
   "Built the near miss around a benign sample of another lesion, supported by existing concordance claims, while preserving clear imaging descriptions.",
   "All new wording is needs_clinician_review and awaits a new independent review; no prior approval is transferred.",
  ],
 },
};
