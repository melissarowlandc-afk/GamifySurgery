// Indexed one-to-one responses to review 2. These are author dispositions,
// never a grant of clinical approval or an independent PASS.
export const responses={
 F02:{cues:[
  'Removed the component-overlap imaging set. The three options are distinct drainage, endoscopic and reconstructive procedures.',
  'Removed the anatomy-purpose lead-in. The neutral task follows actual continuity, leak and postdrainage observations.',
  'Removed both with/without MR options; incremental contrast superiority is no longer the scored distinction.',
 ],fairness:[
  'The obsolete nerve task remains replaced. The new question has no nerve/anatomical-outlier option set.',
  'The decisive interpretation now separates controlled collection plus intact ducts from major transection before choosing treatment.',
  'The supplied images establish continuity and localize the stump stream. No unresolved MR-protocol equivalence is needed to choose.',
  'Both imaging and minor-leak ERCP claims are mapped. The new construct is treatment, not a claim of contrast superiority; no excretory eligibility is assumed.',
 ],suggestions:[
  'Show contrast traversing the major ducts into duodenum, the stump stream, the collapsed drained cavity and the current stable examination.',
  'Conventional MRCP is no longer a competitor. The selected treatment follows the already recorded minor-leak pathway.',
  'Three procedures address different plausible failure modes, with parallel labels and no combined-test key.',
  'Deleted all shoulder-pain history because it no longer affects the decision.',
 ]},
 F03:{cues:[
  'Removed the outside compression examination; none of the choices is eliminated as an already completed test.',
  'Removed the reassuring deep-vein compression findings. The record instead supplies recurrent distributions and an incomplete reflux sheet.',
  'Removed pelvic CT. All choices are duplex mapping requests in a balanced purpose-by-scope set.',
 ],fairness:[
  'All choices remain specific named investigation requests; no generic individualized plan returns.',
  'The question asks for the map needed before choosing an intervention, without prescribing an exact vein procedure.',
  'The old-treatment extent, posterior and medial recurrence and incomplete connections now determine the required scope. The key is not the only broad option or only reflux option.',
 ],suggestions:[
  'Built a recurrent-distribution/connection uncertainty rather than using a completed DVT protocol as a foil.',
  'The same-modality options vary purpose and anatomical scope; both factors must fit the supplied record.',
  'Removed pelvic CT and retained concrete requests. A new qualitative mapping-scope claim records the offline alignment limitation.',
 ]},
 F04:{cues:[
  'Retained the calcium/ECG response as required safety evidence, but removed repeat calcium as a distractor.',
  'Retained the actual persistent potassium value, but removed observation. All alternatives now propose active potassium treatment.',
 ],fairness:[
  'No transfer availability, permission or feasibility sentence is present.',
  'Potassium removal is explicitly being arranged; the scored choice is an immediate shifting drug, not the whole renal management plan.',
  'Active beta-agonist and bicarbonate near misses replace the elementary calcium/observation sequence. pH context now changes the bicarbonate ranking. Residual ease is for final independent review, not labelled basic.',
  'No claim that calcium should lower potassium and no invented sampling interval; the ECG and potassium responses are kept distinct.',
 ],suggestions:[
  'Preserved both responses; did not hide diagnostic/safety information to raise difficulty.',
  'Used three actual active treatments and mapped the comparative ranking to a new draft UKKA-linked claim with a direct-section-alignment hold. No basic acceptance is self-granted.',
  'Removed observation and repeat calcium, supplied pH context, and added no dose, repeat interval, contraindication or dialysis threshold.',
 ]},
 F05:{cues:[],fairness:[
  'Explicit lateral neck anatomy is retained. The later owner/manager KEEP decision closes the editorial scope hold; no exam-source verification is claimed.',
  'Preserved the cyst-fluid adequacy inference; the request now directs the needle into the observed mural tissue.',
  'The corrective target is explicit. The key cannot be read as another blind aspiration of the centre.',
  'Open excision is a plausible diagnostic escalation, but the supported next needle opportunity remains. No repeat attempt is said to settle the whole cancer pathway.',
  'Labels are specific diagnostic requests of comparable length; there is no unique abbreviation, rationale clause or generic cautious key.',
 ],suggestions:[
  'Specified ultrasound-guided core biopsy of the solid component after the inadequate fluid aspirate, with a separate application claim. Feedback acknowledges representative targeted FNA; neither is an incorrect competitor to the other.',
  'All three options name a concrete sampling or follow-up plan. The original open-excision/surveillance alternatives remain; no competing CT-staging sequence is introduced.',
  'Recorded the explicit superseding owner/manager KEEP decision. This is general-surgery initial neck-mass evaluation, without claims of SCORE/ABSITE access.',
 ]},
 F06:{cues:[
  'A complete two-by-two collection-time/cell-target set balances every component. Donor-origin serum and component-majority construction are gone.',
  'Removed explicit immunoglobulin/complement stains and endothelial-target wording from the task; the record supplies patent large vessels and a microvascular injury pattern.',
 ],fairness:[
  'No named rejection diagnosis or pretransplant donor-binding answer sentence is present.',
  'The record motivates testing a preformed immune hypothesis without declaring it proven; technical-flow information remains.',
  'The new decision selects which archived evidence can address pre-event presence, rather than predicting a restated mechanism. The new scored investigation construct is versioned.',
  'All options are coherent crossmatches. The close postfailure-serum alternative can show reactivity but cannot establish its preimplantation presence.',
 ],suggestions:[
  'Balanced the four time-by-target combinations, with recipient serum in every option.',
  'Collection times and donor/self targets now determine which archived test can support the proposed temporal explanation; no assay sensitivity or antigen is invented.',
  'Retained immediate graft course, patent major vessels and microvascular findings. No loss of safety context or diagnostic certainty claim.',
 ]},
 F07:{cues:[
  'Changed the decision to a new urgent hernia presentation. The former cautious ascites-optimization plan is now the tempting near miss, not a finding-to-key match.',
  'Removed the longstanding platelet contrast and platelet-count foil. The present INR is reported relative to its range rather than an invented correction cutoff.',
 ],fairness:[
  'No alone option or nonparallel domain labels. All choices specify a hospital management sequence.',
  'The earlier elective plan stays historically appropriate; the new irreducible obstructive presentation changes urgency.',
  'A neutral complete task asks what to arrange now. The choices rank a changed urgent assessment against two optimization-first sequences; no platelet ambiguity remains.',
  'The new decision requires applying the urgency exception to the earlier cirrhosis plan rather than recognizing the word ascites. A new concept version records the change.',
 ],suggestions:[
  'Replaced the conference question with the immediate hospital-plan decision.',
  'Used concrete irreducibility, vomiting and proximal/distal bowel findings. INR context remains relevant, but neither a laboratory target nor prophylactic correction mandate is invented.',
  'The earlier fluid-management deferral no longer governs the new obstructive presentation; this changes the plan rather than adding a synonym for ascites.',
 ]},
 F08:{cues:[
  'Removed the palpation-uncertainty sentence. Raw heel, calf and venous ultrasound observations replace the authored reason for imaging.',
 ],fairness:[
  'The direct syndrome-label task remains absent; the focal calf treatment now depends on interpreting its separate ultrasound target.',
  'The completed image observations establish the relevant focal problem; no broad imaging-priority assertion remains.',
  'No need to defer or rank heel and venous imaging: the same supplied assessment shows a separate cavity and a compressible flowing adjacent vein.',
  'Removed the groin imaging option. All options propose treatment of an actually competing explanation for the calf symptoms.',
  'The key now follows the existing uncomplicated-abscess source-control claim, not an unsupported claim that one source image must precede venous assessment.',
 ],suggestions:[
  'Supplied actual calf and heel findings and the adjacent vein appearance; the target plane is separate from fascia/vessels.',
  'Replaced the uncertainty label with observable skin and ultrasound findings, without calling the image an abscess before the answer.',
  'Bounded the task to treatment of the focal calf problem; removed groin imaging and the ambiguous next-test sequence.',
  'The earlier source-imaging key is not retained. Melissa must adjudicate the new image/source-control application; the draft makes no claim of clinical sign-off.',
 ]},
 F09:{cues:[
  'Kept the flat-table control but removed positional pooling. Primary contractile failure now competes with reduced filling.',
  'Removed both the calculated pressure-difference row and the equal-rise summary. Peak and plateau are reported separately.',
 ],fairness:[
  'The chronology and controlled observations remain explicit and intelligible.',
  'The key describes reduced filling/elastic load, not a proven anatomical caval lesion. Similar ejection fraction and higher plateau are decision-critical.',
  'Both axes now have a plausible competing physiological interpretation under the controls; there is no position-change alternative contradicted by the setup.',
  'Described honestly as integrated physiological application with two classifications, not a hard sequential treatment decision. Final difficulty remains independent.',
  'Retained position, delivered-volume and inspiratory-flow controls. Total PEEP is explicitly measured and plateau readings use passive holds; neither acquisition condition is left for the learner to assume. No exclusive cause is claimed.',
 ],suggestions:[
  'Replaced pooling with reduced contractility while keeping actual filling/ejection observations to rank it.',
  'Removed the redundant arithmetic row and supplied separate measured-variable directions.',
  'Did not add an unsupported ventilator adjustment. The scored scope is explicitly integrated record interpretation, not two sequential management steps.',
  'All necessary controls remain; no ambiguity is introduced to manufacture difficulty.',
 ]},
 F10:{cues:[
  'Removed the current-operative-plan wording and the narrated change to a named mastectomy. The learner interprets two operative/specimen descriptions.',
 ],fairness:[
  'No threatened-mapping or availability hint is introduced. The anatomy and clinical scope are concrete.',
  'The left gland removal/right conserving excision distinction determines laterality of the conventional sentinel-node plan.',
  'The bilateral diagnosis and skin-preserving left operation create the meaningful near misses of bilateral staging or no staging. No irrelevant prior plan is counted as a step.',
  'Four short procedure choices have parallel grammar, and the broadest bilateral option is a distractor. Raw nodal observations remain balanced.',
  'No special deferred-mapping protocol is assumed or taught; existing standard-operation source limitation remains.',
 ],suggestions:[
  'Retained explicit laterality/omission choices and the actual nodal appearance.',
  'Used gland removal with a retained skin envelope versus localized excision. The specimen interpretation precedes applying the staging distinction.',
  'Reframed as a bilateral application rather than seeking unsupported basic acceptance; no author-granted difficulty PASS.',
 ]},
 F11:{cues:[
  'Preserved a patient-specific agreement, but the relevant endpoint is return to the pre-anaesthetic state. No preceding clinician conclusion announces that it has been met.',
  'Removed the attributed anaesthetic hypotension sentence. The observed oxygen use is chronic and unchanged; interpreting baseline versus new support changes the order.',
  'Removed the key that terminated on cessation of cardiovascular support and the administrative/location alternatives. Competing endpoints now include oxygen and functional recovery.',
 ],fairness:[
  'Task and hypothetical chronology remain complete; the real later abscess procedure has not occurred.',
  'The order follows the stipulated agreement and the actual baseline/current observations, without an institutional default or an authoritative conclusion supplying the answer.',
  'The key applies the complete agreed endpoint, not cessation of a single infusion. No future narrow stopping rule is asserted.',
  'Baseline oxygen makes an active-support heuristic lead to a different answer. Residual ethics-item ease remains for independent review; no basic label is self-granted.',
 ],suggestions:[
  'Eliminated the narrower cardiovascular-only stopping rule. The resident must interpret the complete supplied cardiopulmonary observations against the agreed baseline endpoint.',
  'Compared three directive orders at the same recovery stage, with baseline oxygen providing a real interpretation issue.',
  'Preserved an explicit patient agreement and future-procedure chronology; preferences are necessary evidence for this ethics decision.',
  'Did not request or label foundational acceptance. The baseline-support application is submitted for final independent rating.',
 ]},
 F13:{cues:[
  'No confirmed-diagnosis option competes with the absence of a study. All choices are assessment/communication requests.',
  'Removed the reporting-service flag wording and named certainty labels. The two reported domains remain because their different purposes matter.',
  'Removed the sole middle-certainty chart entry. The new choices compare current risk use against two plausible but misplaced prerequisites.',
 ],fairness:[
  'No alone wording or generic individualized option returns.',
  'Preserved probability versus diagnosis and the fact that low sleepiness does not cancel apnoea-risk information.',
  'The sleepiness report now motivates an actual repeat-assessment near miss; the diagnostic-study competitor makes the communication sequence consequential. No operative-delay rule is inferred.',
  'No questionnaire items, scores or cutoffs are reproduced. The decision concerns the domain/purpose of the two existing reports.',
 ],suggestions:[
  'All choices name concrete assessment plans and preserve diagnostic uncertainty; none declares OSA confirmed or excluded.',
  'Made the reports affect which information drives current anaesthetic planning and whether confirmation is treated as a prerequisite.',
  'Mapped a bounded communication inference to existing SASM claims; added no questionnaire cutoff or mandatory monitoring/delay policy. No basic label is self-granted.',
 ]},
 F15:{cues:[
  'Kept pressure/ventilation controls for valid attribution. The gas half now requires absolute reference-interval interpretation rather than higher/lower word matching.',
  'Both positional conclusions and both gas conclusions recur equally. The key cannot be selected merely from CO2 rising: its later interval status must be read.',
 ],fairness:[
  'The chronology remains explicit, with separate position and gas observations.',
  'Agreed: relative directions were insufficient. The record now states initial and later relationships to the laboratory intervals.',
  'Corrected every option consistently: two assert demonstrated acidemia and two do not. The keyed later pH is within range, so no acidemia is claimed.',
  'The balanced set is retained. Accurately described as integrated classifications with a record-communication consequence, not two treatment decisions.',
  'The definition distinction is now the scored gas objective; no invented numeric gas or cutoff is supplied.',
  'Deleted the unnecessary early central-filling chronology. The chart begins with the actual pre-tilt reference.',
 ],suggestions:[
  'Supplied pH and CO2 interval relationships sufficient for the claimed later state, with a new bounded interpretation claim and no numerical cutoffs.',
  'Used the permitted alternative of consistently removing unsupported acidemia from the key and its matched alternative; relative acidification is distinguished from state.',
  'The conclusion is carried into an anaesthetic record review, not used to prescribe unsourced ventilation. Two parallel interpretations are honestly disclosed.',
  'Kept pressure, delivered-ventilation and PEEP controls. The principal gas competitor is the common lower-pH-equals-acidemia error rather than an implausible fixed-acid process.',
 ]},
 F16:{cues:[
  'Kept the known primary but removed the assay-choice task. Detectable washout is now an observed, potentially misleading result rather than the unique organ-marker answer.',
  'The task asks for a plan before lateral-neck surgery; repeat sampling is not preselected.',
  'Replaced culture/flow-cytometry foils with dissection and thyroid-surgery/surveillance plans from the same actual workup.',
 ],fairness:[
  'Retained explicit report authorship and neck-node anatomy.',
  'The new question interprets actual discordance and a trans-thyroid sampling path; no universal detectable-equals-positive rule is asserted.',
  'The completed cytology/washout/path record now motivates the choice between treating nodal disease as established, treating it as cleared or resolving discordance.',
  'Retained the previously mapped 12-mm observation and morphology; no new criterion is invented. A separate application claim makes the intact-thyroid limitation explicit.',
 ],suggestions:[
  'Used a neutral next-plan task with concrete thyroid-node workup alternatives.',
  'Added actual cytology, washout detectability and needle-path provenance so their disagreement changes whether a definitive neck operation can be booked.',
  'Removed unrelated assay domains while retaining authorship/site clarity.',
  'Kept papillary carcinoma in the record; its name cannot choose among the three next plans. Endocrine/source alignment remains pending.',
 ]},
 F17:{cues:[
  'Removed the 2-versus-4-o-clock mismatch. The site label now agrees; depth, specimen and needle-notch provenance must be reconciled.',
  'Removed the classic firm-irregular phrase; the key depends on a persistent clinical target not represented by the specimen/visible clip.',
 ],fairness:[
  'Kept actual absent density/distortion/calcification and absent sonographic correlate for the clinical lump. The clip visibility is stated separately.',
  'The new near miss is repeat ultrasound-guided sampling of the visible clip; the key instead addresses the examination target without requiring MRI first.',
  'The same-site depth discrepancy requires interpretation before selecting the guidance method, rather than trivial different-site exclusion.',
  'Removing the prior biopsy record would remove the tempting clip target and the evidence that this apparent same-site benign sample is unrepresentative. The history now affects the guidance choice.',
  'Technique remains specialist-assessed; the question does not assert a universal device or use an image target that does not exist.',
 ],suggestions:[
  'Preserved site-specific raw descriptions, including the separate superficial clip and lack of a correlate for the actual lump.',
  'Replaced the clock-position mismatch with a same-site/depth relationship, needle-notch record and tissue composition.',
  'Compared palpation-guided core, ultrasound-guided clip core and MRI-before-biopsy strategies. No surveillance foil or weaker concerning finding is used to create ambiguity.',
  'No foundational label or claim of guaranteed resident struggle. The depth/guidance application is submitted for final independent review.',
 ]},
};
