# Pediatric batch samples - 2026-10-08

**Unapproved draft:** all authored records remain `needs_clinician_review`. 10 objectives (9 new IDs and one unchanged existing ID), 20 variants. One example per objective follows.

**Key-first ordering for this review artifact only:** option A is the correct answer in every example. Runtime nodes randomize all answer choices. Agent checks and tests are not clinical approval. This batch is not assembled into an active release.

Scope: child ages 5-17 matched to authored art metadata; one named parent in the same room throughout; outpatient examination, counseling and referral. No tests, wait-duration prose, sedation, pediatric MRI or procedure flows. Matching ages and fictional names are editorial values, not clinical probabilities. Legacy `approvedInstantiationProfiles` terminology does not imply clinician approval.

## Refer a childhood inguinal hernia

Concept: `concept.pediatric-clinic.inguinal-hernia-referral` (new_objective). Question: `question.pediatric-clinic.groin-bulge-after-play.v1`.

**Chief complaint:** Groin bulge

**Patient and parent:** Noah Bennett; age 5, Male; father Daniel Bennett stays in the same room. Art: `level3-roster-v2.022`.

**Presentation:** Noah Bennett, a 5-year-old boy, visits the clinic with his father, Daniel Bennett, who remains in the same room throughout the visit. His father has noticed a painless bulge in Noah's right groin during active play. A soft groin bulge appears when Noah coughs and disappears when he lies down. Noah is comfortable, with no vomiting or abdominal pain.

**Question:** Which outpatient plan is most appropriate for Noah Bennett's clinically suspected inguinal hernia?

**Choices - KEY FIRST FOR REVIEW:**

A. Refer for pediatric surgical assessment **(key)**

Rationale: The clinical groin-hernia finding warrants pediatric surgical referral even though Noah is comfortable today.

B. Continue observation in primary care

Rationale: Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.

C. Continue parent-led monitoring of the bulge

Rationale: Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.

D. Defer surgical referral until pain develops

Rationale: The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.

**Explanation:** Noah's history and examination support a childhood inguinal hernia. Arrange pediatric surgical assessment, including when the child is comfortable and the bulge settles with position.

**Teaching point:** A clinically suspected childhood inguinal hernia belongs in a pediatric surgical referral pathway.

**Claims:** `claim.pediatric-clinic.dynamic-groin-bulge`, `claim.pediatric-clinic.clinical-groin-hernia-referral`.

**Sources:** <a href="https://rms.cornwall.nhs.uk/rms/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/paediatric_surgery" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cornwall-surgery-2025</a>; <a href="https://www.nhs.uk/conditions/hernia/" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.nhs-hernia-2026</a>.

**Source and review limitations:**

- General NHS bulge facts are cross-checked with a child-specific referral pathway; the narrative does not prescribe a reduction maneuver.
- One eligible local NHS referral pathway, partially updated in 2025; its displayed 2026 review date is not assumed to be a completed update. No independent national pediatric management guideline was admitted. No operative deadline or technique is taught.

## Recognize primary midline hernia

Concept: `concept.umbilical-epigastric-hernia.clinical-recognition` (reuse_unchanged_objective). Question: `question.pediatric-clinic.upper-midline-lump.v1`.

**Chief complaint:** Upper belly lump

**Patient and parent:** Ella Morgan; age 6, Female; mother Rachel Morgan stays in the same room. Art: `level3-roster-v2.021`.

**Presentation:** Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline, above the navel. Examination identifies a small abdominal-wall gap with protruding fat at that site. The navel and groins have no bulge. Ella is comfortable and has no vomiting.

**Question:** Which diagnosis best explains Ella Morgan's focal upper-midline abdominal-wall defect?

**Choices - KEY FIRST FOR REVIEW:**

A. Epigastric hernia **(key)**

Rationale: The focal defect lies in the upper abdominal midline and contains protruding fat, matching an epigastric hernia.

B. Umbilical hernia

Rationale: An umbilical hernia is centered at the navel; this child's defect is above it.

C. Inguinal canal hernia

Rationale: An inguinal hernia is a groin finding, whereas this lump is in the upper abdominal midline.

D. Femoral canal hernia

Rationale: A femoral hernia is near the groin in the upper thigh, rather than above the navel.

**Explanation:** Ella's upper-midline defect with protruding fat supports an epigastric hernia. An umbilical hernia is centered at the navel, and inguinal and femoral hernias occur near the groin.

**Teaching point:** A focal fat-containing abdominal-wall defect above the navel supports epigastric hernia.

**Claims:** `claim.pediatric-clinic.epigastric-fat-defect`, `claim.pediatric-clinic.umbilical-location`, `claim.pediatric-clinic.inguinal-location`, `claim.pediatric-clinic.femoral-location`.

**Sources:** <a href="https://www.nhs.uk/conditions/hernia/" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.nhs-hernia-2026</a>; <a href="https://www.nhs.uk/conditions/umbilical-hernia/" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.nhs-umbilical-2025</a>; <a href="https://www.gosh.nhs.uk/conditions-and-treatments/conditions-we-treat/umbilical-and-epigastric-hernia/" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.gosh-midline-hernia-2016</a>.

**Source and review limitations:**

- One eligible specialist hospital anatomy source, last reviewed in 2016. Its repair timing and outcome statements are not adopted.
- Location is used to distinguish the illustrated epigastric finding; no repair-age rule is inferred.
- General anatomical cross-check only; adult management is not transferred to children.
- General anatomical cross-check only; no pediatric prevalence, risk estimate or repair rule is taught.

## Observe uncomplicated childhood neck nodes

Concept: `concept.pediatric-clinic.reactive-neck-node-observation` (new_objective). Question: `question.pediatric-clinic.neck-nodes-after-cold.v1`.

**Chief complaint:** Neck lumps

**Patient and parent:** Mia Carter; age 7, Female; mother Anne Carter stays in the same room. Art: `level3-roster-v2.023`.

**Presentation:** Mia Carter, a 7-year-old girl, visits the clinic with her mother, Anne Carter, who remains in the same room throughout the visit. Mia's mother noticed small lumps on both sides of her neck during a recent cold. Mia has recovered and is playing and eating normally. Examination finds small mobile cervical nodes without overlying inflammation or supraclavicular enlargement. There is no ongoing fever, weight loss, night sweating or node growth.

**Question:** Which plan best addresses Mia Carter's small mobile cervical nodes after her viral illness?

**Choices - KEY FIRST FOR REVIEW:**

A. Observe with follow-up and return precautions **(key)**

Rationale: A well child with this uncomplicated pattern can be observed; the family should know when changing nodes or new symptoms require reassessment.

B. Refer for urgent pediatric specialist assessment

Rationale: The described pattern lacks the concerning findings that support early specialist assessment in the cited pathway.

C. Refer for routine pediatric ENT assessment

Rationale: The cited pathway supports initial observation in this uncomplicated profile; routine specialist referral is not the most appropriate first plan.

D. Discharge without follow-up or return precautions

Rationale: Reassurance should include safety-net advice rather than ending reassessment if the pattern changes.

**Explanation:** Mia's small mobile nodes and recovery from a viral illness fit a reactive pattern. Reassure her and her mother, document the findings and provide follow-up and return advice for enlargement or new systemic symptoms.

**Teaching point:** Observation of uncomplicated childhood neck nodes includes a safety net for change.

**Claims:** `claim.pediatric-clinic.reactive-child-neck-nodes`, `claim.pediatric-clinic.well-child-node-observation`, `claim.pediatric-clinic.supraclavicular-node-red-flag`, `claim.pediatric-clinic.node-change-safety-net`, `claim.pediatric-clinic.unexplained-node-associated-fever`, `claim.pediatric-clinic.unexplained-node-associated-weight-loss`, `claim.pediatric-clinic.unexplained-node-associated-night-sweats`, `claim.pediatric-clinic.concerning-node-pediatric-review`.

**Sources:** <a href="https://rms.cornwall.nhs.uk/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/lymphadenopathy" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cornwall-nodes-2025</a>.

**Source and review limitations:**

- One current eligible local NHS guideline was fully verified; no independent national management guideline was admitted. No numeric size or duration rule is generalized.
- One current eligible local NHS guideline was fully verified; no independent national management guideline was admitted. No numeric size or duration rule is generalized. A red flag does not by itself diagnose malignancy or specify biopsy.

## Refer concerning childhood neck nodes

Concept: `concept.pediatric-clinic.concerning-neck-node-referral` (new_objective). Question: `question.pediatric-clinic.supraclavicular-neck-lump.v1`.

**Chief complaint:** Low neck lump

**Patient and parent:** Grace Turner; age 11, Female; father James Turner stays in the same room. Art: `level3-roster-v2.027`.

**Presentation:** Grace Turner, an 11-year-old girl, visits the clinic with her father, James Turner, who remains in the same room throughout the visit. Grace and her father report an enlarging lump above her left collarbone. Examination identifies a firm supraclavicular node. She has no recent respiratory illness, overlying skin infection, breathing difficulty or swallowing difficulty.

**Question:** Which disposition is most appropriate for Grace Turner's enlarging supraclavicular node?

**Choices - KEY FIRST FOR REVIEW:**

A. Arrange prompt pediatric specialist assessment **(key)**

Rationale: Supraclavicular location and growth are concerning findings that merit early pediatric assessment.

B. Continue routine reactive neck-node observation

Rationale: The growing supraclavicular finding does not match the uncomplicated reactive-node profile used for routine observation.

C. Arrange routine pediatric ENT follow-up

Rationale: The growing supraclavicular finding requires early assessment through the concerning-node pathway; routine follow-up would not address that urgency.

D. Discharge from further neck-node review

Rationale: Ending evaluation would leave the concerning location and growth unassessed.

**Explanation:** Grace's growing supraclavicular node warrants early pediatric assessment. Explain the concerning location and change to Grace and her father. The cause remains uncertain and requires further evaluation.

**Teaching point:** A concerning node pattern calls for pediatric assessment while its cause remains uncertain.

**Claims:** `claim.pediatric-clinic.supraclavicular-node-red-flag`, `claim.pediatric-clinic.growing-firm-node-red-flag`, `claim.pediatric-clinic.concerning-node-pediatric-review`, `claim.pediatric-clinic.well-child-node-observation`.

**Sources:** <a href="https://rms.cornwall.nhs.uk/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/lymphadenopathy" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cornwall-nodes-2025</a>.

**Source and review limitations:**

- One current eligible local NHS guideline was fully verified; no independent national management guideline was admitted. No numeric size or duration rule is generalized.
- One current eligible local NHS guideline was fully verified; no independent national management guideline was admitted. No numeric size or duration rule is generalized. A red flag does not by itself diagnose malignancy or specify biopsy.

## Refer suspected acquired testicular ascent

Concept: `concept.pediatric-clinic.acquired-testis-ascent-referral` (new_objective). Question: `question.pediatric-clinic.previously-scrotal-testis.v1`.

**Chief complaint:** Testicle position

**Patient and parent:** Jack Wilson; age 10, Male; mother Rebecca Wilson stays in the same room. Art: `level3-roster-v2.026`.

**Presentation:** Jack Wilson, a 10-year-old boy, visits the clinic with his mother, Rebecca Wilson, who remains in the same room throughout the visit. Earlier examination records document both testes in Jack's scrotum. His mother now reports that the right side often looks empty. After the examination is explained to Jack and his mother, the right testis is found high and cannot be maintained in the scrotum. The left testis is scrotal. Jack has no acute pain or swelling.

**Question:** Which plan is most appropriate for Jack Wilson's newly non-scrotal right testis?

**Choices - KEY FIRST FOR REVIEW:**

A. Refer for pediatric urologic assessment **(key)**

Rationale: Prior scrotal documentation followed by a position that cannot stay scrotal suggests acquired ascent and warrants specialist assessment.

B. Continue routine retractile-testis observation

Rationale: This testis cannot maintain a normal scrotal position, so the reassuring true-retractile definition does not apply.

C. End further testicular-position follow-up

Rationale: Previous normal documentation does not exclude acquired ascent; the new abnormal position needs assessment.

D. Use parent-led monitoring of testicular position

Rationale: Parent observations are useful, but monitoring alone does not replace specialist assessment of the suspected acquired ascent.

**Explanation:** A testis can ascend after earlier normal scrotal examinations. Jack's right testis no longer maintains a normal scrotal position, so arrange pediatric urologic or surgical assessment for suspected acquired ascent.

**Teaching point:** Earlier scrotal documentation does not rule out acquired testicular ascent.

**Claims:** `claim.pediatric-clinic.acquired-testis-ascent`, `claim.pediatric-clinic.nonmaintained-scrotal-position`, `claim.pediatric-clinic.developmentally-appropriate-information`, `claim.pediatric-clinic.ascending-testis-referral`, `claim.pediatric-clinic.true-retractile-examination`.

**Sources:** <a href="https://rms.cornwall.nhs.uk/rms/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/paediatric_surgery" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cornwall-surgery-2025</a>; <a href="https://cuaj.ca/index.php/journal/article/view/4585" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cua-puc-testis-2017</a>; <a href="https://cps.ca/en/documents/position/medical-decision-making-in-paediatrics-infancy-to-adolescence" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cps-decision-making-2018</a>.

**Source and review limitations:**

- Prior documentation informs the acquired-ascent distinction; no risk percentage or age threshold is assigned.
- The examination definition is narrow. The batch does not resolve all high-scrotal, gliding or persistently retractile terminology.
- One reaffirmed Canadian society statement. Used for ethical participation only; legal decision-maker, capacity, privacy and refusal rules are jurisdiction- and context-dependent. Parent placement is an owner prototype constraint, not a universal clinical recommendation.
- A society guideline and a later local NHS pathway agree on assessment. Operation timing and technique remain outside this batch.
- A society examination definition; a persistently high or immediately reascending testis is excluded from the authored true-retractile profiles.

## Follow a true retractile testis

Concept: `concept.pediatric-clinic.true-retractile-testis-surveillance` (new_objective). Question: `question.pediatric-clinic.retractile-testis-remains-scrotal.v1`.

**Chief complaint:** Moving testicle

**Patient and parent:** Ben Foster; age 6, Male; mother Laura Foster stays in the same room. Art: `level3-roster-v2.024`.

**Presentation:** Ben Foster, a 6-year-old boy, visits the clinic with his mother, Laura Foster, who remains in the same room throughout the visit. Ben's mother sometimes notices that his right testis sits higher, especially when he is tense. The examination is explained to them. In a relaxed setting, the testis can be brought into the normal scrotal position without tension and remains there after release. Ben has no pain or swelling.

**Question:** Which management plan is most appropriate for Ben Foster's true retractile testis?

**Choices - KEY FIRST FOR REVIEW:**

A. Arrange documented testicular-position follow-up **(key)**

Rationale: The examination meets the true-retractile definition; documented surveillance can identify a later change in position.

B. Arrange immediate orchidopexy planning

Rationale: Operative planning is not recommended for the explicitly defined true-retractile examination pattern.

C. End routine testicular-position surveillance

Rationale: A true retractile testis still needs position follow-up to detect acquired ascent.

D. Continue parent-led testicular-position monitoring

Rationale: Parent observations can help, but the cited follow-up plan includes documented clinical position examinations.

**Explanation:** Ben's testis stays in the normal scrotal position after gentle placement without tension, meeting the true-retractile definition. Arrange documented follow-up examinations, with reassessment or referral if the testis later fails to remain scrotal. This narrow phenotype does not call for immediate operative planning.

**Teaching point:** A true retractile testis needs surveillance, with referral if acquired ascent develops.

**Claims:** `claim.pediatric-clinic.true-retractile-examination`, `claim.pediatric-clinic.developmentally-appropriate-information`, `claim.pediatric-clinic.true-retractile-followup`, `claim.pediatric-clinic.retractile-ascent-surveillance`, `claim.pediatric-clinic.true-retractile-no-operation`.

**Sources:** <a href="https://rms.cornwall.nhs.uk/rms/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/paediatric_surgery" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cornwall-surgery-2025</a>; <a href="https://cuaj.ca/index.php/journal/article/view/4585" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cua-puc-testis-2017</a>; <a href="https://www.cuh.nhs.uk/patient-information/undescended-testes-and-surgery-in-children/" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cuh-testis-2025</a>; <a href="https://cps.ca/en/documents/position/medical-decision-making-in-paediatrics-infancy-to-adolescence" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cps-decision-making-2018</a>.

**Source and review limitations:**

- A society examination definition; a persistently high or immediately reascending testis is excluded from the authored true-retractile profiles.
- One reaffirmed Canadian society statement. Used for ethical participation only; legal decision-maker, capacity, privacy and refusal rules are jurisdiction- and context-dependent. Parent placement is an owner prototype constraint, not a universal clinical recommendation.
- Independent society and NHS sources support surveillance. No exact surveillance interval is embedded in question prose.
- No invented ascent probability, deadline or automatic operative trigger is assigned.
- Applies only to the explicitly defined true-retractile profile, not all high or persistently retractile testes.

## Evaluate symptomatic pectus excavatum

Concept: `concept.pediatric-clinic.symptomatic-pectus-excavatum-evaluation` (new_objective). Question: `question.pediatric-clinic.sunken-chest-exercise-limits.v1`.

**Chief complaint:** Breathless with exercise

**Patient and parent:** Amelia Scott; age 14, Female; mother Clare Scott stays in the same room. Art: `level3-roster-v2.029`.

**Presentation:** Amelia Scott, a 14-year-old girl, visits the clinic with her mother, Clare Scott, who remains in the same room throughout the visit. Amelia has a longstanding inward depression of her anterior chest wall. She now becomes breathless and tires earlier during sports. She is comfortable at rest and has no acute chest pain or fainting. Amelia and her mother ask whether chest-wall treatment would improve her exercise tolerance.

**Question:** Which referral plan best addresses Amelia Scott's pectus excavatum and new exertional symptoms?

**Choices - KEY FIRST FOR REVIEW:**

A. Refer for chest-wall and cardiopulmonary assessment **(key)**

Rationale: Exertional symptoms warrant assessment of possible cardiopulmonary effects and alternative causes before selecting treatment.

B. Refer for immediate corrective-surgery booking

Rationale: Symptoms alone do not establish a treatment indication or a predictable functional benefit; evaluation should precede a treatment decision.

C. Refer for a reassurance consultation on chest appearance

Rationale: A discussion confined to appearance would leave Amelia's exertional symptoms unevaluated.

D. Refer for a routine posture-training program

Rationale: Posture training does not replace assessment of the reported exercise limitation and possible cardiopulmonary effects.

**Explanation:** Amelia's exertional symptoms deserve specialist evaluation alongside her pectus finding. Assess possible cardiopulmonary effects and other explanations before a treatment decision. The evidence does not support promising that a repair will restore her exercise tolerance.

**Teaching point:** Evaluate symptomatic pectus before choosing treatment or promising physiologic benefit.

**Claims:** `claim.pediatric-clinic.pectus-excavatum-appearance`, `claim.pediatric-clinic.pectus-exertional-symptoms`, `claim.pediatric-clinic.symptomatic-pectus-evaluation`, `claim.pediatric-clinic.pectus-physiologic-benefit-uncertainty`.

**Sources:** <a href="https://tp.amegroups.org/article/view/108944/html" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.scalise-demehri-pectus-2023</a>.

**Source and review limitations:**

- One eligible pediatric narrative review was fully verified; no current independent society guideline was admitted. Referral does not establish symptom causation or an indication for surgery.
- The disagreement in the review is preserved; guaranteed causation or postoperative functional benefit is withheld.

## Discuss brace assessment for pectus carinatum

Concept: `concept.pediatric-clinic.pectus-carinatum-brace-assessment` (new_objective). Question: `question.pediatric-clinic.prominent-chest-brace-question.v1`.

**Chief complaint:** Prominent chest

**Patient and parent:** Daniel Green; age 14, Male; mother Emma Green stays in the same room. Art: `level3-roster-v2.030`.

**Presentation:** Daniel Green, a 14-year-old boy, visits the clinic with his mother, Emma Green, who remains in the same room throughout the visit. Daniel has an outward prominence of the anterior chest wall consistent with pectus carinatum. There are no acute chest symptoms. He is bothered by the appearance and asks about active treatment that could avoid surgery. His mother supports discussing options, and Daniel is willing to learn what a brace plan would involve.

**Question:** Which plan best addresses Daniel Green's request for nonsurgical treatment of pectus carinatum?

**Choices - KEY FIRST FOR REVIEW:**

A. Discuss specialist brace-suitability assessment **(key)**

Rationale: Bracing is a potential option for selected young people; a specialist assessment can evaluate suitability and the demands of treatment.

B. Discuss booking directly for corrective surgery

Rationale: Direct operative booking does not address Daniel's request to explore a nonsurgical option before deciding on treatment.

C. Discuss observation as the treatment plan

Rationale: Observation may be a choice, but Daniel is asking for active nonsurgical treatment; brace assessment better addresses that stated goal.

D. Discuss routine posture-training referral

Rationale: The verified nonsurgical chest-wall treatment option is bracing assessed for suitability, not substitution of a posture referral.

**Explanation:** Discuss referral for a specialist brace assessment with Daniel and his mother. Chest-wall flexibility, willingness to follow the plan and their goals inform suitability. Expected benefits and the treatment commitment should be discussed individually because the evidence is mainly observational.

**Teaching point:** Pectus carinatum bracing is an individualized option assessed by specialists.

**Claims:** `claim.pediatric-clinic.pectus-carinatum-appearance`, `claim.pediatric-clinic.carinatum-brace-option`, `claim.pediatric-clinic.carinatum-brace-suitability`, `claim.pediatric-clinic.carinatum-brace-evidence-limitation`.

**Sources:** <a href="https://shtg.scot/our-advice/chest-wall-bracing-for-children-and-young-people-with-pectus-carinatum/" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.shtg-bracing-2022</a>; <a href="https://www.alderhey.nhs.uk/conditions/patient-information-leaflets/bracing-for-pectus-deformities-piag-154/" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.alder-hey-bracing-2026</a>.

**Source and review limitations:**

- The authored profile describes a stable chest-wall finding without an acute chest complaint.
- Government assessment plus specialist orthotics information; suitability and preferences matter. Bracing is not guaranteed effective or appropriate for every patient.
- No compression pressure, wear duration, age cutoff or clinic fitting procedure is authored.
- No exact success probability, comparative superiority or mandatory treatment is taught.

## Plan conservative adolescent pilonidal care

Concept: `concept.pediatric-clinic.limited-pilonidal-conservative-care` (new_objective). Question: `question.pediatric-clinic.pilonidal-first-clinic-visit.v1`.

**Chief complaint:** Tailbone drainage

**Patient and parent:** Ava Collins; age 16, Female; mother Julia Collins stays in the same room. Art: `level3-roster-v2.031`.

**Presentation:** Ava Collins, a 16-year-old girl, visits the clinic with her mother, Julia Collins, who remains in the same room throughout the visit. Ava has occasional drainage from small pits in the midline of the upper natal cleft. Symptoms have had little effect on her activities. Examination shows limited pilonidal disease with no tender fluctuant swelling, spreading redness or fever. Ava has not yet tried a coordinated local-care plan.

**Question:** Which initial plan best fits Ava Collins's limited pilonidal disease without an acute abscess?

**Choices - KEY FIRST FOR REVIEW:**

A. Begin conservative cleft care with reassessment **(key)**

Rationale: Limited disease without an acute abscess can start with individualized conservative care and review of the response.

B. Refer directly for elective excision and closure

Rationale: Immediate selection of excision bypasses a conservative care discussion for this mild, previously untreated presentation.

C. Refer for treatment as an acute abscess

Rationale: An acute abscess is a different management situation; Ava's examination explicitly lacks that presentation.

D. Reassure and end further local-care follow-up

Rationale: A conservative plan should include care advice and reassessment if symptoms persist or the pattern changes.

**Explanation:** Discuss a practical conservative plan with Ava and her mother: cleft cleanliness, limiting retained moisture and prolonged local pressure, and an individualized hair-management discussion. Review the response and reconsider the plan if symptoms or disease burden increase.

**Teaching point:** Limited adolescent pilonidal disease can begin with individualized conservative care and reassessment.

**Claims:** `claim.pediatric-clinic.pilonidal-cleft-pattern`, `claim.pediatric-clinic.limited-pilonidal-conservative-care`, `claim.pediatric-clinic.pilonidal-acute-infection-distinction`, `claim.pediatric-clinic.pilonidal-cleft-cleanliness`, `claim.pediatric-clinic.pilonidal-moisture-reduction`, `claim.pediatric-clinic.pilonidal-pressure-reduction`, `claim.pediatric-clinic.pilonidal-individual-hair-plan`, `claim.pediatric-clinic.pilonidal-response-reassessment`.

**Sources:** <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8040102/" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.metzger-pilonidal-2021</a>.

**Source and review limitations:**

- One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.
- One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught. This batch has no acute abscess procedure, antibiotic or pediatric sedation flow.
- One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught. A universal razor, laser or depilatory protocol is withheld.

## Include the child in a nonurgent care discussion

Concept: `concept.pediatric-clinic.developmental-assent-discussion` (new_objective). Question: `question.pediatric-clinic.child-asks-about-examination.v1`.

**Chief complaint:** Examination questions

**Patient and parent:** Lily Walker; age 6, Female; mother Susan Walker stays in the same room. Art: `level3-roster-v2.021`.

**Presentation:** Lily Walker, a 6-year-old girl, visits the clinic with her mother, Susan Walker, who remains in the same room throughout the visit. Lily is attending a planned nonurgent clinic review. Her mother agrees with the proposed examination, but Lily asks what will happen and looks worried. There is time to talk before beginning, and no urgent treatment decision is required.

**Question:** Which communication approach should the clinician use before Lily Walker's nonurgent examination?

**Choices - KEY FIRST FOR REVIEW:**

A. Explain to Lily and invite her participation **(key)**

Rationale: Use language Lily can understand, invite her questions and seek developmentally appropriate agreement while keeping her mother involved.

B. Explain to her mother and proceed with care

Rationale: Parental involvement does not replace an age-appropriate explanation and an opportunity for Lily to participate.

C. Treat Lily's silence as agreement and proceed

Rationale: Silence does not provide the meaningful participation sought through an explanation and an invitation for questions.

D. Defer discussion with Lily until she is older

Rationale: Children can be involved at a level suited to their understanding; the discussion need not wait for a fixed age.

**Explanation:** Explain the examination directly to Lily in terms she can understand, invite questions and seek developmentally appropriate assent with her mother involved. Ethical participation and legal consent authority are separate considerations.

**Teaching point:** A parent's agreement does not replace developmentally appropriate participation by the child.

**Claims:** `claim.pediatric-clinic.developmentally-appropriate-information`, `claim.pediatric-clinic.invite-child-participation-and-assent`, `claim.pediatric-clinic.noncoercive-child-discussion`, `claim.pediatric-clinic.assent-legal-consent-boundary`.

**Sources:** <a href="https://cps.ca/en/documents/position/medical-decision-making-in-paediatrics-infancy-to-adolescence" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cps-decision-making-2018</a>.

**Source and review limitations:**

- One reaffirmed Canadian society statement. Used for ethical participation only; legal decision-maker, capacity, privacy and refusal rules are jurisdiction- and context-dependent. Parent placement is an owner prototype constraint, not a universal clinical recommendation.

## Withheld topics

- **Adolescent varicocele intervention thresholds:** Current EAU material was excluded by its AI-use terms; an adequate current independent eligible management source was not verified in this bounded pass.
- **School-age hydrocele management:** One local referral source was found; independent age-appropriate corroboration and differentiation were not completed. Deferred rather than borrowing infant observation rules.
- **Umbilical repair age:** Eligible source disagreement is preserved in conflict.pediatric-clinic.umbilical-repair-age; the planned timing/referral concept was dropped.
- **Exact pilonidal hair-removal method or interval:** A single expert perspective does not support a universal comparative regimen. No exact protocol or prophylactic medication rule was authored.
- **Pectus operative indications or guaranteed exercise benefit:** The eligible review preserves disagreement about physiologic effects; an independent current guideline was not fully verified. Referral assessment only.
- **Adolescent privacy, refusal and legal consent:** The owner prototype keeps one parent in the room. Confidentiality, mature-minor status and refusal require context and jurisdiction review; no universal same-room clinical rule is taught.
- **Pediatric testing, MRI, sedation, procedures and infant cases:** Outside the approved outpatient examination/referral and current art scope; pediatric test routes and parent-placement contracts are not admitted here.

## Source catalog and attribution

Full claim-source mappings, source authority and rights/access notes are in the batch's `evidence-claims.ts` and `source-catalog.ts`. Bibliographic titles identify sources; no source excerpts are reproduced.

- `source.pediatric-clinic.cornwall-surgery-2025`: Faux W, Burns S. Paediatric Surgery. NHS Cornwall and Isles of Scilly Referral Management Service. Version 1.2; partial update 9 May 2025. Review date listed as 9 May 2026. Accessed 8 October 2026. <a href="https://rms.cornwall.nhs.uk/rms/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/paediatric_surgery" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Copyright NHS/Kernow CCG; all rights reserved; copyrighted_targeted_verification_only.

- `source.pediatric-clinic.nhs-hernia-2026`: NHS website. Hernia. Reviewed 19 May 2026. Accessed 8 October 2026. <a href="https://www.nhs.uk/conditions/hernia/" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Open Government Licence v3.0 where applicable; third-party material, logos and images excluded; copyrighted_targeted_verification_only. <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">License</a>.

- `source.pediatric-clinic.nhs-umbilical-2025`: NHS website. Umbilical hernia. Reviewed 24 November 2025. Accessed 8 October 2026. <a href="https://www.nhs.uk/conditions/umbilical-hernia/" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Open Government Licence v3.0 where applicable; third-party material, logos and images excluded; copyrighted_targeted_verification_only. <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">License</a>.

- `source.pediatric-clinic.gosh-midline-hernia-2016`: Great Ormond Street Hospital General Surgery Department and Child and Family Information Group. Umbilical and epigastric hernia. Reference 2016F1150; reviewed 1 July 2016. Accessed 8 October 2026. <a href="https://www.gosh.nhs.uk/conditions-and-treatments/conditions-we-treat/umbilical-and-epigastric-hernia/" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Copyright GOSH/UCL; private research and in-house noncommercial study conditions; copyrighted_targeted_verification_only.

- `source.pediatric-clinic.cornwall-nodes-2025`: Vines L, Schick M; contributors Goyal S, Reddy V, Lambert A, McGraw-Allen K, Keaney C. Cervical Lymphadenopathy in Children. NHS Cornwall and Isles of Scilly Referral Management Service. Reviewed 10 October 2025. Accessed 8 October 2026. <a href="https://rms.cornwall.nhs.uk/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/lymphadenopathy" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Copyright NHS/Kernow CCG; all rights reserved; copyrighted_targeted_verification_only.

- `source.pediatric-clinic.cua-puc-testis-2017`: Braga LH, Lorenzo AJ, Romao RLP. Canadian Urological Association-Pediatric Urologists of Canada (CUA-PUC) guideline for the diagnosis, management, and followup of cryptorchidism. Can Urol Assoc J. 2017;11(7):E251-E260. doi:10.5489/cuaj.4585. <a href="https://cuaj.ca/index.php/journal/article/view/4585" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Copyright Canadian Urological Association; reproduction rights reserved; copyrighted_targeted_verification_only.

- `source.pediatric-clinic.cuh-testis-2025`: Cambridge University Hospitals NHS Foundation Trust, Paediatric Surgery and Urology. Undescended testes and orchidopexy surgery - in children. Document 1716, version 9; approved 7 November 2025. Accessed 8 October 2026. <a href="https://www.cuh.nhs.uk/patient-information/undescended-testes-and-surgery-in-children/" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Copyright Cambridge University Hospitals NHS Foundation Trust; copyrighted_targeted_verification_only.

- `source.pediatric-clinic.scalise-demehri-pectus-2023`: Scalise PN, Demehri FR. The management of pectus excavatum in pediatric patients: a narrative review. Transl Pediatr. 2023;12(2):208-220. doi:10.21037/tp-22-361. <a href="https://tp.amegroups.org/article/view/108944/html" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0); copyrighted_targeted_verification_only. <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">License</a>.

- `source.pediatric-clinic.shtg-bracing-2022`: Scottish Health Technologies Group, Healthcare Improvement Scotland. Chest wall bracing for children and young people with pectus carinatum. Published 11 February 2022. Accessed 8 October 2026. <a href="https://shtg.scot/our-advice/chest-wall-bracing-for-children-and-young-people-with-pectus-carinatum/" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Copyright Healthcare Improvement Scotland / SHTG; copyrighted_targeted_verification_only.

- `source.pediatric-clinic.alder-hey-bracing-2026`: Alder Hey Children's NHS Foundation Trust, Orthotics Department. Bracing for Pectus Deformities (PIAG 154). Reviewed 28 July 2026. Accessed 8 October 2026. <a href="https://www.alderhey.nhs.uk/conditions/patient-information-leaflets/bracing-for-pectus-deformities-piag-154/" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Copyright Alder Hey Children's NHS Foundation Trust; copyrighted_targeted_verification_only.

- `source.pediatric-clinic.metzger-pilonidal-2021`: Metzger GA, Apfeld JC, Nishimura L, Lutz C, Deans KJ, Minneci PC. Principles in treating pediatric patients with pilonidal disease - An expert perspective. Ann Med Surg (Lond). 2021;64:102233. doi:10.1016/j.amsu.2021.102233. PMID:33868675; PMCID:PMC8040102. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8040102/" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Creative Commons Attribution 4.0 International (CC BY 4.0); cc_by_4_0. <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">License</a>.

- `source.pediatric-clinic.cps-decision-making-2018`: Coughlin KW; Canadian Paediatric Society Bioethics Committee. Medical decision-making in paediatrics: Infancy to adolescence. Paediatr Child Health. 2018;23(2):138-146. doi:10.1093/pch/pxx127. Posted 12 April 2018; reaffirmed 11 January 2024. <a href="https://cps.ca/en/documents/position/medical-decision-making-in-paediatrics-infancy-to-adolescence" target="_blank" rel="noopener noreferrer">Official source</a>. License/reuse: Copyright Canadian Paediatric Society; reproduction requires permission; copyrighted_targeted_verification_only.

Contains public sector information licensed under the Open Government Licence v3.0, where applicable to NHS website material. Logos, third-party images and source illustrations are excluded. Metzger et al. (2021) are attributed with DOI and CC BY 4.0 license above; all question wording and evidence claims were independently authored. Scalise and Demehri (2023) carry CC BY-NC-ND 4.0; only underlying facts were checked and no article adaptation is distributed.

Manager review must select the exact unapproved prototype manifest, preserve constrained child/art/family identities, admit the L4 runtime foundation and deduplicate the existing midline-recognition concept. Named clinician approval of exact versions remains required before clinical promotion. This is a local draft with no Git backup performed by the worker.
