# Ethics before a clinical decision: eight P2-E pairings

Date: 2026-10-17. Status: **needs_clinician_review**. Owner-approved direction; awaiting manager acceptance and named clinician review.

**KEY FIRST FOR REVIEW ONLY. Runtime randomizes all answer choices.** Review names are illustrative; runtime retains each original age/sex profile and generates a compatible identity.

Each case starts with its existing ethics question and continues to an existing authored clinical decision for the same diagnosis. Clinical concept IDs, evidence claims, source records, answer IDs and correctness are reused. New case IDs distinguish these two-step encounters from frozen legacy single-step encounters; the adapted clinical variants have new IDs. Desmoid and perianal-abscess answer labels are phrased as parallel treatment plans, with their original decisions and correctness preserved.

All three previously approved clinical objectives (desmoid, FHH and Mondor disease) remain approved only in their original versions. These new adaptations and paired cases remain unapproved drafts; no inherited approval label is displayed.

A wrong ethics answer receives feedback and then proceeds with the ethical issue corrected. The reached update is identical after every first answer. No adverse-outcome narrative is added. Each of the two distinct concepts receives one FSRS review; reloading uses the saved encounter rather than substituting the new catalog.

| Pair | Ethics step | Same-diagnosis clinical decision | Earliest level |
| --- | --- | --- | ---: |
| 1 | capacity-refusal | varicose: Refer for venous intervention | 1 |
| 2 | perioperative-dnr | perianal-abscess: Arrange incision and drainage | 0 |
| 3 | error-disclosure | ptld: Coordinate transplant-team biopsy | 1 |
| 4 | research-consent | gist: Plan neoadjuvant imatinib before reassessing resection | 1 |
| 5 | research-consent | desmoid: Specialist active surveillance with follow-up | 0 |
| 6 | research-consent | hidradenitis: Multidisciplinary HS referral | 0 |
| 7 | confidentiality | fhh: Parathyroidectomy usually does not correct FHH | 0 |
| 8 | confidentiality | mondor: Warm compresses, appropriate NSAID, and follow-up | 0 |

Supply and identity effects:

- Main batch: **28 original concepts, 120 questions (112 original + 8 clinical adaptations), 108 cases, 120 nodes and 120 timing entries**. The eight clinical concepts already exist in the admitted catalog; none is newly created. The exported catalog remains **734 claims and 452 sources**, byte-unchanged.
- Ethics: **36 cases, 48 nodes (40 ethics + 8 clinical)**; two-step cases **4 → 12**. All four Spanish interpreter → consent cases remain byte-for-byte unchanged, including Female ages 43/68 and early consent supply.
- Level 1: **36 ethics cases and all 40 original ethics decisions**, unchanged; now also 8 clinical continuation decisions. Every ethics concept still has four reachable variants.
- Level 0: ethics cases **36 → 33**, ethics decisions **40 → 37**, total decisions **40 → 42**. Three cases inherit level 1 from varicose-vein referral, PTLD biopsy coordination and GIST treatment planning. No ethics case moves beyond level 1.
- All original ethics question/choice IDs, objectives, opening presentations, demographics and profile IDs remain unchanged. The five remaining additions stay level 0. No staff discussion, capability, reward, launcher, browser origin or owner save is edited.
- All eight continuations reuse management or referral decisions with explicit no-test timing classifications. Existing testing choices elsewhere retain their runtime wait metadata and fixed durations remain outside authored prose.

## Pairing read-through

### 1. varicose: Daniel Brooks

**New case:** `case.gs028se.p2e.capacity-refusal.v4.varicose`  
**Clinical question reused:** `question.varicose-veins.intervention-referral-after-axial-reflux.v1` from `case.gs028.varicose-veins.paired-aching-standing`  
**Profiles retained:** 68 Male; 68 Female; 58 Male; 58 Female. Earliest facility level: **1**.

**Complaint:** Supported treatment decision

**Presentation:** Daniel Brooks, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.

#### Step 1: ethics

**Question variant:** `question.statistics-ethics.capacity-refusal.v4`  
**FSRS concept:** `concept.statistics-ethics.capacity-refusal`

**Question:** How should the team approach Daniel Brooks's decision about a varicose-vein intervention when mild cognitive impairment is recorded but supported understanding is demonstrated?

**Choices — key first for review only:**

A. Support and assess the patient's own decision **(key)**  
   Support understanding and assess the patient's own abilities for vein intervention. The described informed, consistent choice should not be displaced solely by the cognitive diagnosis.

B. Obtain a surrogate's decision because of the diagnosis  
   Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support.

C. Require a family countersignature for this consent  
   A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent.

D. Require formal testing before discussing the choice  
   The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities.

**Lesson:** Cognitive impairment does not remove capacity for every decision. Support understanding and assess the patient's actual abilities for this choice before seeking a substitute decision-maker. Plain language enables an informed, consistent choice. Remember that the diagnosis and the decision are separate questions; a label alone does not transfer authority to family or a surrogate.

**Short explanation:** Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded.

**Existing evidence mapped to this node:**

- `claim.gs028se.capacity-refusal.4` → `source.gs028se.ama-consent-2-1-1`, `source.gs028se.ama-capacity-2-1-2`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.gs028se.capacity-refusal.3` → `source.gs028se.ama-consent-2-1-1`, `source.gs028se.ama-capacity-2-1-2`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.varicose.intervention-referral` → `source.varicose.svs-avf-avls-2023`. Limit: The exact procedure depends on specialist anatomy and assessment.

#### Step 2: clinical decision

**Question variant:** `question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4`  
**FSRS concept:** `concept.varicose-veins.intervention-referral-after-axial-reflux`

**Reached update, after either correct or corrected-forward feedback:** The team supports Daniel Brooks's own informed choice rather than replacing it because of the cognitive diagnosis. The same symptomatic varicose veins have documented axial superficial reflux without acute DVT. Specialist screening finds the patient medically eligible, and the patient remains interested in treatment after plain-language discussion. The next decision concerns the clinical referral plan.

**Question:** Which referral plan best fits Daniel Brooks's symptomatic varicose veins with axial reflux, medical eligibility and an informed preference for intervention?

**Choices — key first for review only:**

A. Refer for venous intervention **(key)**  
   Refer for intervention assessment while leaving the exact procedure to specialist evaluation.

B. Continue compression-first management  
   Long-term compression is not a mandatory prerequisite for every eligible patient.

C. Continue current self-care alone  
   Persistent symptoms and treatment preference merit referral.

D. Start anticoagulation  
   Reflux without thrombosis is not an indication for anticoagulation.

**Lesson:** Refer for intervention assessment while leaving the exact procedure to specialist evaluation.

**Short explanation:** Refer for venous intervention assessment, with the exact procedure left to specialist evaluation. The documented reflux, persistent symptoms and supported treatment preference fit the existing referral objective.

**Existing evidence mapped to this node:**

- `claim.varicose.intervention-referral` → `source.varicose.svs-avf-avls-2023`. Limit: The exact procedure depends on specialist anatomy and assessment.
- `claim.varicose.conservative-boundary` → `source.varicose.svs-avf-avls-2023`. Limit: No universal garment or duration is prescribed.
- `claim.gs028se.capacity-refusal.4` → `source.gs028se.ama-consent-2-1-1`, `source.gs028se.ama-capacity-2-1-2`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.gs028se.capacity-refusal.3` → `source.gs028se.ama-consent-2-1-1`, `source.gs028se.ama-capacity-2-1-2`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.

### 2. perianal-abscess: Robert Harris

**New case:** `case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess`  
**Clinical question reused:** `question.perianal-abscess.prompt-drainage.v1` from `case.bread-butter.perianal-abscess.tender-perianal-lump`  
**Profiles retained:** 58 Male; 58 Female; 77 Male; 77 Female. Earliest facility level: **0**.

**Complaint:** Abscess care preferences

**Presentation:** Robert Harris, a 58-year-old man, has a superficial perianal abscess requiring drainage and an existing DNR order. A staff member proposes omitting routine treatment and comfort measures because of the order. The patient asks whether abscess treatment and other care can continue. No individualized decision to refuse those treatments has been expressed; the team is preparing care.

#### Step 1: ethics

**Question variant:** `question.statistics-ethics.perioperative-dnr.v4`  
**FSRS concept:** `concept.statistics-ethics.perioperative-dnr`

**Question:** How should the team interpret Robert Harris's DNR order when a staff member proposes omitting abscess treatment and comfort care?

**Choices — key first for review only:**

A. Resuscitation after cardiopulmonary arrest **(key)**  
   DNR alone concerns resuscitative efforts after cardiopulmonary arrest. Other care remains a separate decision guided by the patient's goals.

B. Resuscitation and anesthetic airway support  
   The order alone does not establish a blanket ban on anesthetic airway support. Perioperative interventions require their own individualized discussion.

C. Resuscitation and treatment of a new infection  
   A DNR order alone does not decline appropriate treatment of infection. Adding that restriction silently expands its scope beyond resuscitation.

D. Resuscitation and diagnostic testing  
   Diagnostic testing is not automatically prohibited by DNR status. It remains a separate care decision consistent with the patient's goals.

**Lesson:** A DNR order concerns resuscitative efforts after cardiopulmonary arrest. By itself it does not prohibit other appropriate evaluation or treatment consistent with the patient's goals. Remember to distinguish the scope of the order from separate decisions about other care. Any further limits need their own discussion rather than being silently inferred from those letters.

**Short explanation:** DNR alone limits resuscitation after cardiopulmonary arrest. It does not by itself decline symptom treatment, diagnostic testing, or other appropriate care consistent with the patient's goals.

**Existing evidence mapped to this node:**

- `claim.gs028se.perioperative-dnr.4` → `source.gs028se.asa-dnar-2023`, `source.gs028se.ama-dnar-5-4`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.bread-butter.perianal-abscess.prompt-drainage` → `source.bread-butter.ascrs-anorectal-abscess-2022`. Limit: Occult, recurrent, Crohn-associated, deep, or complex disease may require imaging or examination under anesthesia.

#### Step 2: clinical decision

**Question variant:** `question.perianal-abscess.prompt-drainage.v1.p2e.perioperative-dnr.v4`  
**FSRS concept:** `concept.perianal-abscess.prompt-drainage`

**Reached update, after either correct or corrected-forward feedback:** The team clarifies that Robert Harris's DNR order alone does not decline abscess treatment or comfort care. The patient wants the abscess addressed. Examination shows a tender, fluctuant superficial perianal collection with stable vital signs, without Crohn disease, recurrence, immune compromise or deep pelvic symptoms. The DNR order remains in place while the team discusses the separate treatment plan.

**Question:** Which treatment should the team arrange for Robert Harris's clinically evident, uncomplicated superficial perianal abscess when the patient wants treatment and the DNR order remains in place?

**Choices — key first for review only:**

A. Arrange incision and drainage **(key)**  
   Arrange prompt incision and drainage for this clinically evident superficial perianal abscess rather than delaying source control.

B. Arrange an oral antibiotic course  
   Antibiotics alone do not provide source control for a drainable abscess.

C. Arrange warm-compress treatment  
   Supportive measures alone do not replace drainage of this evident collection.

D. Arrange aspiration through a needle  
   Needle aspiration alone is not the standard source-control procedure for a routine perianal abscess.

**Lesson:** Arrange prompt incision and drainage for this clinically evident superficial perianal abscess rather than delaying source control.

**Short explanation:** Arrange prompt incision and drainage for the evident superficial perianal collection. Antibiotics, compresses or needle aspiration alone do not replace the authored drainage plan.

**Existing evidence mapped to this node:**

- `claim.bread-butter.perianal-abscess.prompt-drainage` → `source.bread-butter.ascrs-anorectal-abscess-2022`. Limit: Occult, recurrent, Crohn-associated, deep, or complex disease may require imaging or examination under anesthesia.
- `claim.gs028se.perioperative-dnr.4` → `source.gs028se.asa-dnar-2023`, `source.gs028se.ama-dnar-5-4`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.

### 3. ptld: Michael Ward

**New case:** `case.gs028se.p2e.error-disclosure.v4.ptld`  
**Clinical question reused:** `question.ptld.tissue-diagnosis-coordination.v1` from `case.gs028b.ptld.b-accessible-node`  
**Profiles retained:** 77 Male; 77 Female; 51 Male; 51 Female. Earliest facility level: **1**.

**Complaint:** Changed biopsy recommendation

**Presentation:** Michael Ward, a 77-year-old man, has suspected post-transplant lymphoproliferative disorder and returns to clarify a tissue-biopsy discussion. The clinic confirms that another person's chart materially influenced its earlier recommendation. The mistake was caught before treatment, with no demonstrated injury. A colleague proposes silently correcting the plan. The patient asks why the recommendation has changed during today's visit.

#### Step 1: ethics

**Question variant:** `question.statistics-ethics.error-disclosure.v4`  
**FSRS concept:** `concept.statistics-ethics.error-disclosure`

**Question:** What should the team tell Michael Ward about the wrong-chart error that materially affected the tissue-biopsy discussion, despite no demonstrated injury?

**Choices — key first for review only:**

A. Explain the material error and its correction **(key)**  
   The wrong-chart recommendation materially affected care information. Explain that mistake and its correction even though it was intercepted without demonstrated injury.

B. Discuss the corrected recommendation and defer the error  
   Silently giving a corrected recommendation omits the material error that changed the earlier discussion. Absence of injury is not a blanket reason to leave it unexplained.

C. Use the internal safety report as the disclosure response  
   Internal reporting and patient disclosure serve different parts of the response. Filing a report does not tell the patient about the material mistake and correction.

D. Wait for an injury assessment before discussing the mistake  
   The supplied error materially affected the care discussion. Waiting to demonstrate injury treats harm as a blanket disclosure requirement that the existing claim does not impose.

**Lesson:** An error can materially affect a care discussion even when it is intercepted before treatment and no injury is demonstrated. That absence of harm is not a blanket reason to conceal it. Explain the material mistake and correction honestly. Consider what changed the patient's care information, rather than using injury alone as the disclosure test.

**Short explanation:** Explain the material wrong-chart error and its correction. An internal report or silent replacement of the recommendation does not substitute for candid disclosure merely because no injury is demonstrated.

**Existing evidence mapped to this node:**

- `claim.gs028se.error-disclosure.4` → `source.gs028se.ama-safety-8-6`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy. Single-source limitation.
- `claim.ptld.pattern` → `source.ptld.ast-2019`, `source.ptld.frontiers-review-2026`. Limit: The list is nonexhaustive and no one feature establishes PTLD.
- `claim.ptld.tissue` → `source.ptld.ast-2019`, `source.ptld.frontiers-review-2026`. Limit: No biopsy technique, staging system, surveillance cutoff, or treatment regimen is taught.

#### Step 2: clinical decision

**Question variant:** `question.ptld.tissue-diagnosis-coordination.v1.p2e.error-disclosure.v4`  
**FSRS concept:** `concept.ptld.tissue-diagnosis-coordination`

**Reached update, after either correct or corrected-forward feedback:** The team explains the confirmed wrong-chart error and its effect on Michael Ward's recommendation despite no demonstrated injury. The actual transplant record is reviewed with the patient. Persistent unexplained lymphadenopathy and completed imaging show an accessible enlarged node; PTLD is suspected but not classified. The revised discussion concerns how to obtain a reliable diagnosis with the appropriate treating teams.

**Question:** After disclosure and review of the correct record, which diagnostic plan best fits Michael Ward's suspected PTLD with an accessible enlarged node and no tissue classification?

**Choices — key first for review only:**

A. Coordinate transplant-team biopsy **(key)**  
   Coordinate external transplant/hematology evaluation and tissue sampling; this clinic does not invent a biopsy service or act on imaging alone.

B. Diagnose PTLD from imaging alone  
   Imaging cannot provide the required tissue classification.

C. Diagnose PTLD from EBV DNA alone  
   EBV testing is supportive and does not replace pathology.

D. Change immunosuppression without coordination  
   Management changes require transplant-team involvement and a defined diagnostic plan.

**Lesson:** Coordinate external transplant/hematology evaluation and tissue sampling; this clinic does not invent a biopsy service or act on imaging alone.

**Short explanation:** Coordinate transplant and hematology evaluation with tissue sampling for suspected PTLD. Imaging or EBV DNA alone does not establish the required tissue classification.

**Existing evidence mapped to this node:**

- `claim.ptld.tissue` → `source.ptld.ast-2019`, `source.ptld.frontiers-review-2026`. Limit: No biopsy technique, staging system, surveillance cutoff, or treatment regimen is taught.
- `claim.gs028se.error-disclosure.4` → `source.gs028se.ama-safety-8-6`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy. Single-source limitation.
- `claim.ptld.pattern` → `source.ptld.ast-2019`, `source.ptld.frontiers-review-2026`. Limit: The list is nonexhaustive and no one feature establishes PTLD.

### 4. gist: Emily Brooks

**New case:** `case.gs028se.p2e.research-consent.v1.gist`  
**Clinical question reused:** `question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v1` from `case.gastric-gist.posterior-fundus-mass`  
**Profiles retained:** 46 Female; 46 Male; 71 Female; 71 Male. Earliest facility level: **1**.

**Complaint:** Optional GIST study

**Presentation:** Emily Brooks, a 46-year-old woman, has a gastric GIST and is discussing specialist tissue and operative planning. A recruiter offers an optional study of a new biologic and says ordinary care requires enrollment. That study is not required for clinical care. The patient asks whether declining research would prevent the clinical consultation from continuing as planned.

#### Step 1: ethics

**Question variant:** `question.statistics-ethics.research-consent.v1`  
**FSRS concept:** `concept.statistics-ethics.research-consent`

**Question:** What should the team explain when Emily Brooks is told that ordinary gastric-GIST care depends on joining an optional new-biologic study?

**Choices — key first for review only:**

A. Declining enrollment does not forfeit ordinary care **(key)**  
   This study is optional and not required for ordinary care. Clarify that declining enrollment does not forfeit that care, so the invitation can be considered voluntarily.

B. Declining enrollment requires transfer to another clinic  
   Requiring transfer would impose a loss of ordinary care for declining this optional study. The scenario gives no basis for making that care contingent on enrollment.

C. Declining enrollment postpones the surgical consultation  
   Postponing the ordinary consultation because enrollment is declined still makes care conditional on joining. That conflicts with voluntary choice in this setting.

D. Declining enrollment limits access to routine follow-up  
   Limiting routine follow-up uses ordinary care to pressure enrollment. The optional study is not required for that care.

**Lesson:** Research participation must be voluntary. When a study is optional and not required for ordinary care, declining it should not forfeit that care. Remember to separate the clinical care decision from the research invitation. Making enrollment a condition of routine care pressures the patient instead of supporting an independent choice about participation.

**Short explanation:** Clarify that declining this optional study does not forfeit ordinary clinic care. The recruiter's stated condition is inconsistent with voluntary participation in a study not required for that care.

**Existing evidence mapped to this node:**

- `claim.gs028se.research-consent.1` → `source.gs028se.ama-research-7-1-2`, `source.gs028se.ama-consent-2-1-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.gastric-gist.selected-eus-core-molecular-testing` → `source.board.gist-geis-2023`, `source.board.gist-nci-pdq-2024`. Limit: Core sampling is selected because immediate planning needs histology and genotype; a limited core does not establish definitive mitotic-risk classification.

#### Step 2: clinical decision

**Question variant:** `question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v1.p2e.research-consent.v1`  
**FSRS concept:** `concept.gastric-gist.mutation-guided-neoadjuvant-imatinib`

**Reached update, after either correct or corrected-forward feedback:** The team explains that Emily Brooks's ordinary gastric-GIST care does not depend on joining the optional study. The specialist reviews completed core pathology and molecular testing showing GIST with an imatinib-sensitive mutation and no metastatic disease. The large posterior fundus mass abuts the pancreas; the multidisciplinary team expects meaningful shrinkage could avoid combined gastric and pancreatic resection.

**Question:** Which multidisciplinary treatment plan best fits Emily Brooks's imatinib-sensitive, nonmetastatic gastric GIST when tumor shrinkage could reduce the morbidity of the planned extensive resection?

**Choices — key first for review only:**

A. Plan neoadjuvant imatinib before reassessing resection **(key)**  
   For an imatinib-sensitive GIST where the multidisciplinary team expects shrinkage to reduce operative morbidity, neoadjuvant imatinib with later resection reassessment is appropriate; size alone would not establish this plan.

B. Proceed directly to the planned extensive resection  
   Immediate extensive surgery gives up the documented opportunity for morbidity-reducing shrinkage.

C. Give neoadjuvant cytotoxic chemotherapy before resection  
   Conventional cytotoxic chemotherapy is not the selected targeted approach for imatinib-sensitive GIST.

D. Offer symptom-directed care without tumor treatment  
   Symptom-only care does not address this large, locally advanced lesion.

**Lesson:** For an imatinib-sensitive GIST where the multidisciplinary team expects shrinkage to reduce operative morbidity, neoadjuvant imatinib with later resection reassessment is appropriate; size alone would not establish this plan.

**Short explanation:** Plan neoadjuvant imatinib with later reassessment of resection for this mutation-sensitive GIST. The documented opportunity to reduce operative morbidity supports the plan; size alone does not.

**Existing evidence mapped to this node:**

- `claim.gastric-gist.mutation-guided-neoadjuvant-planning` → `source.board.gist-geis-2023`, `source.board.gist-nci-pdq-2024`. Limit: No dose, duration, response interval, postoperative therapy, or universal size rule is taught.
- `claim.gs028se.research-consent.1` → `source.gs028se.ama-research-7-1-2`, `source.gs028se.ama-consent-2-1-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.gastric-gist.selected-eus-core-molecular-testing` → `source.board.gist-geis-2023`, `source.board.gist-nci-pdq-2024`. Limit: Core sampling is selected because immediate planning needs histology and genotype; a limited core does not establish definitive mitotic-risk classification.

### 5. desmoid: Olivia Carter

**New case:** `case.gs028se.p2e.research-consent.v3.desmoid`  
**Clinical question reused:** `question.desmoid.initial-surveillance.new-diagnosis.v1` from `case.desmoid.surveillance-to-progressing-abdominal-wall`  
**Profiles retained:** 56 Female; 56 Male; 28 Female; 28 Male. Earliest facility level: **0**.

**Complaint:** Study assignment question

**Presentation:** Olivia Carter, a 56-year-old woman, has a stable, minimally symptomatic desmoid tumor under specialist assessment. A trial offers a new agent or control through random allocation. The presenter says every participant receives personalized attention, then reads the same greeting from a script. The patient expects the surgeon to select the personally best arm and asks how treatment will be assigned.

#### Step 1: ethics

**Question variant:** `question.statistics-ethics.research-consent.v3`  
**FSRS concept:** `concept.statistics-ethics.research-consent`

**Question:** What should research consent explain when Olivia Carter expects personally selected treatment in a desmoid-agent trial whose protocol uses random allocation?

**Choices — key first for review only:**

A. Assignment is random and benefit is uncertain **(key)**  
   The approved protocol assigns randomly and guarantees no better arm. Clarifying both points corrects the expectation of personally selected treatment with assured benefit.

B. Assignment is clinical and benefit is individualized  
   The protocol does not use individualized clinical selection. This wording preserves the patient's mistaken expectation instead of explaining random allocation and uncertain benefit.

C. Assignment is random and benefit is established  
   Random assignment is correct, but established benefit is not. No arm is guaranteed better in the supplied protocol.

D. Assignment is chosen and benefit is uncertain  
   Uncertainty about benefit is correct, but assignment is not chosen by the surgeon or participant. The protocol uses random allocation.

**Lesson:** Research consent needs a clear account of allocation and uncertainty. This protocol assigns arms randomly; the surgeon does not choose a personally best arm, and benefit is not guaranteed. Remember to distinguish a research protocol from individually selected treatment. Understanding assignment helps the patient choose whether to join, not a detail for after enrollment.

**Short explanation:** Explain that assignment is random and benefit uncertain. The protocol does not let the surgeon select a personally best arm or guarantee that an arm will be better.

**Existing evidence mapped to this node:**

- `claim.gs028se.research-consent.3` → `source.gs028se.ama-research-7-1-2`, `source.gs028se.ama-consent-2-1-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.desmoid.initial-active-surveillance-selected-noncritical` → `source.kasper.current-management-desmoid-tumors.2024`, `source.seom-geis.soft-tissue-sarcoma-guideline.2024`. Limit: Surveillance is an active specialist-management strategy, not absence of follow-up; this concept does not specify a universal imaging interval or apply to persistent progression, critical-site threat, obstruction, or meaningful functional decline.

#### Step 2: clinical decision

**Question variant:** `question.desmoid.initial-surveillance.new-diagnosis.v1.p2e.research-consent.v3`  
**FSRS concept:** `concept.desmoid.initial-active-surveillance`

**Reached update, after either correct or corrected-forward feedback:** The team explains random allocation and uncertain benefit to Olivia Carter; research participation remains an optional decision. Ordinary specialist care continues for the same newly diagnosed, biopsy-confirmed abdominal-wall desmoid tumor. It is stable with minimal discomfort, no functional limitation, no obstruction and no threat to a critical structure. The next discussion concerns initial clinical management outside the optional trial.

**Question:** Which initial clinical management plan best fits Olivia Carter's newly diagnosed, stable, minimally symptomatic abdominal-wall desmoid tumor without threatened function or a critical structure?

**Choices — key first for review only:**

A. Specialist active surveillance with follow-up **(key)**  
   The newly diagnosed tumor is stable and minimally symptomatic, with no threatened function or critical structure. This is the authored surveillance population.

B. Immediate wide excision with margin assessment  
   Immediate wide excision is not required for every newly diagnosed stable desmoid. The supplied findings support specialist surveillance first.

C. Cytotoxic chemotherapy with specialist follow-up  
   Routine upfront cytotoxic therapy is not required for the selected stable, noncritical disease described here.

D. Incision and drainage with wound follow-up  
   The biopsy-confirmed desmoid is a solid tumor, rather than a collection for incision and drainage.

**Lesson:** For newly diagnosed desmoid disease without persistent progression, critical-site threat, obstruction, or meaningful functional decline, specialist active surveillance is an appropriate initial strategy. Routine upfront surgery or cytotoxic therapy is not required for every confirmed desmoid.

**Short explanation:** Specialist active surveillance fits this newly diagnosed, stable desmoid without critical threat or functional decline. The existing objective does not require immediate surgery or cytotoxic therapy.

**Existing evidence mapped to this node:**

- `claim.desmoid.initial-active-surveillance-selected-noncritical` → `source.kasper.current-management-desmoid-tumors.2024`, `source.seom-geis.soft-tissue-sarcoma-guideline.2024`. Limit: Surveillance is an active specialist-management strategy, not absence of follow-up; this concept does not specify a universal imaging interval or apply to persistent progression, critical-site threat, obstruction, or meaningful functional decline.
- `claim.gs028se.research-consent.3` → `source.gs028se.ama-research-7-1-2`, `source.gs028se.ama-consent-2-1-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.

### 6. hidradenitis: James Ellis

**New case:** `case.gs028se.p2e.research-consent.v4.hidradenitis`  
**Clinical question reused:** `question.hidradenitis-suppurativa.multimodal-specialist-planning.v1` from `case.gs028.hidradenitis-suppurativa.paired-axillary-recurrence`  
**Profiles retained:** 51 Male; 51 Female; 77 Male; 77 Female. Earliest facility level: **0**.

**Complaint:** Leaving optional research

**Presentation:** James Ellis, a 51-year-old man, has hidradenitis suppurativa and wants to leave an optional new topical-agent study. The patient wishes to continue ordinary clinical follow-up but declines further research visits. A coordinator threatens to cancel unrelated appointments unless participation continues. The patient asks whether leaving the study means losing access to the clinic's ordinary care.

#### Step 1: ethics

**Question variant:** `question.statistics-ethics.research-consent.v4`  
**FSRS concept:** `concept.statistics-ethics.research-consent`

**Question:** How should the team respond to James Ellis's request to leave an optional hidradenitis-agent study when unrelated ordinary appointments are threatened?

**Choices — key first for review only:**

A. Support withdrawal and preserve ordinary follow-up **(key)**  
   Support the voluntary withdrawal and discuss ordinary follow-up separately. Unrelated care must not be used as leverage to require continued research participation.

B. Defer withdrawal until the remaining study visits are complete  
   Requiring completion of remaining visits before withdrawal makes continued participation compulsory. That does not respect the voluntary withdrawal request.

C. Require the investigator's approval before withdrawal  
   Investigator permission is not a condition that justifies compelling continued participation. The patient wants to leave a voluntary study.

D. Arrange transfer of ordinary care before allowing withdrawal  
   Requiring transfer first still ties ordinary care to continued enrollment. Preserve the unrelated follow-up rather than using its loss to prevent withdrawal.

**Lesson:** Voluntary participation includes being able to withdraw without coercive loss of ordinary care. Discuss ongoing clinical follow-up separately from whether research continues. Remember that stopping research participation and stopping clinical care are different choices. Neither completing unwanted study visits nor obtaining investigator permission should be used as the price of preserving unrelated follow-up.

**Short explanation:** Support withdrawal and preserve ordinary clinical follow-up. The threatened cancellation of unrelated care must not be used to compel continued participation in a voluntary study.

**Existing evidence mapped to this node:**

- `claim.gs028se.research-consent.4` → `source.gs028se.ama-research-7-1-2`, `source.gs028se.ama-consent-2-1-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.gs028se.research-consent.1` → `source.gs028se.ama-research-7-1-2`, `source.gs028se.ama-consent-2-1-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.hs.pattern-recognition` → `source.hs.australasian-2025`, `source.hs.north-american-2019`. Limit: No single lesion alone establishes the longitudinal diagnosis.
- `claim.hs.multimodal-planning` → `source.hs.australasian-2025`, `source.hs.north-american-2019`. Limit: No specific drug regimen or universal operation is prescribed.

#### Step 2: clinical decision

**Question variant:** `question.hidradenitis-suppurativa.multimodal-specialist-planning.v1.p2e.research-consent.v4`  
**FSRS concept:** `concept.hidradenitis-suppurativa.multimodal-specialist-planning`

**Reached update, after either correct or corrected-forward feedback:** The team accepts James Ellis's withdrawal from optional research without threatening unrelated ordinary appointments. Clinical follow-up continues for the same hidradenitis suppurativa. The longitudinal history and examination show recurrent painful lesions, intermittent drainage, scarring and persistent tunnels rather than one isolated abscess. The patient wants ordinary care, and the next discussion concerns the long-term clinical plan rather than study enrollment.

**Question:** Which long-term clinical plan best fits James Ellis's recurrent, tunnel-forming hidradenitis suppurativa after withdrawal from the optional study?

**Choices — key first for review only:**

A. Multidisciplinary HS referral **(key)**  
   Use severity-based dermatology and surgical planning; acute drainage alone is not definitive chronic control.

B. Repeat drainage for recurrent lesions  
   Drainage may relieve an acute collection but does not control chronic tunnels.

C. Long-term antibiotic therapy alone  
   A universal indefinite antibiotic plan is not appropriate without specialist assessment.

D. Immediate wide excision  
   Procedure selection depends on severity, site, goals, and expertise.

**Lesson:** Use severity-based dermatology and surgical planning; acute drainage alone is not definitive chronic control.

**Short explanation:** Arrange multidisciplinary HS planning based on severity, site and patient goals. Repeated acute drainage alone does not provide definitive control of chronic tunnel-forming disease.

**Existing evidence mapped to this node:**

- `claim.hs.multimodal-planning` → `source.hs.australasian-2025`, `source.hs.north-american-2019`. Limit: No specific drug regimen or universal operation is prescribed.
- `claim.hs.drainage-limitation` → `source.hs.north-american-2019`. Limit: Acute abscess assessment remains necessary when present.
- `claim.gs028se.research-consent.4` → `source.gs028se.ama-research-7-1-2`, `source.gs028se.ama-consent-2-1-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.gs028se.research-consent.1` → `source.gs028se.ama-research-7-1-2`, `source.gs028se.ama-consent-2-1-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy.
- `claim.hs.pattern-recognition` → `source.hs.australasian-2025`, `source.hs.north-american-2019`. Limit: No single lesion alone establishes the longitudinal diagnosis.

### 7. fhh: Henry Parker

**New case:** `case.gs028se.p2e.confidentiality.v2.fhh`  
**Clinical question reused:** `question.fhh.parathyroid-surgery-counseling.v1` from `case.fhh.parathyroid-surgery-counseling`  
**Profiles retained:** 35 Male; 35 Female; 63 Male; 63 Female. Earliest facility level: **0**.

**Complaint:** Chart access question

**Presentation:** Henry Parker, a 35-year-old man, has confirmed uncomplicated familial hypocalciuric hypercalcemia and is attending follow-up. A clinic employee who knows the family wants to open the chart solely from curiosity. The employee says being nosy is community engagement, then asks whether it belongs on the appraisal form. No relevant work purpose requires access to this patient's records.

#### Step 1: ethics

**Question variant:** `question.statistics-ethics.confidentiality.v2`  
**FSRS concept:** `concept.statistics-ethics.confidentiality`

**Question:** What should govern a clinic employee's access to Henry Parker's calcium-disorder chart when the employee has only personal curiosity and no relevant work purpose?

**Choices — key first for review only:**

A. An authorized work-related reason for access **(key)**  
   Access needs an authorized work-related purpose. This neighbor has no care or administrative role requiring the chart, so familiarity and employment do not justify browsing.

B. A personal invitation to look up the patient's diagnosis  
   A personal invitation does not establish a role in authorized care or administrative work. It does not supply the missing work-related purpose for this access.

C. A verified relationship with the patient's family  
   Knowing the family is a personal relationship, not an authorized clinical or administrative reason to read the chart.

D. An active clinic login with chart-reading permission  
   An active login supplies a technical ability to open records. It does not authorize browsing this chart without a relevant work purpose.

**Lesson:** A clinic login supplies technical access, not a work-related reason to open every chart. Access should have an authorized purpose connected to the employee's work. Here familiarity and curiosity do not provide one. Remember to distinguish what the system permits someone to click from what their role authorizes them to read for this patient.

**Short explanation:** An authorized work-related reason must govern access. Employment, knowing the family, or having a chart-reading login does not establish a role requiring this patient's information.

**Existing evidence mapped to this node:**

- `claim.gs028se.confidentiality.2` → `source.gs028se.ama-confidentiality-3-2-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy. Single-source limitation.
- `claim.fhh.reassurance-observation-avoid-parathyroid-surgery` → `source.bollerslev.parat-parathyroid-consensus.2022`, `source.bilezikian.fifth-workshop-phpt-guideline.2022`. Limit: Rare symptomatic or atypical FHH and coexisting primary hyperparathyroidism require specialist individualized management and are excluded from these variants.

#### Step 2: clinical decision

**Question variant:** `question.fhh.parathyroid-surgery-counseling.v1.p2e.confidentiality.v2`  
**FSRS concept:** `concept.fhh.avoid-parathyroid-surgery`

**Reached update, after either correct or corrected-forward feedback:** The curiosity-only chart access is not permitted. During Henry Parker's private clinical follow-up, the team reviews confirmed uncomplicated familial hypocalciuric hypercalcemia with stable mild hypercalcemia. No separate surgical disorder is identified. The patient asks why parathyroid surgery is not being offered for this inherited calcium-sensing condition. The clinical discussion can continue without giving the curious employee access to the record.

**Question:** Which explanation should the team give Henry Parker about parathyroid surgery for confirmed uncomplicated familial hypocalciuric hypercalcemia with stable mild hypercalcemia?

**Choices — key first for review only:**

A. Parathyroidectomy usually does not correct FHH **(key)**  
   FHH reflects inherited altered calcium sensing rather than a routine single-gland surgical problem. Parathyroidectomy usually does not normalize the biochemical phenotype and is avoided in uncomplicated confirmed FHH.

B. A localized parathyroid adenoma causes FHH and should be removed  
   FHH is an inherited calcium-sensing disorder, not a diagnosis established by a localized adenoma.

C. Routine single-gland excision reliably cures the inherited disorder  
   Removing one gland does not reliably correct the systemic inherited calcium-sensing abnormality.

D. FHH instead requires prophylactic thyroidectomy  
   Prophylactic thyroidectomy is not treatment for uncomplicated FHH.

**Lesson:** FHH reflects inherited altered calcium sensing rather than a routine single-gland surgical problem. Parathyroidectomy usually does not normalize the biochemical phenotype and is avoided in uncomplicated confirmed FHH.

**Short explanation:** Explain that parathyroidectomy usually does not correct uncomplicated FHH. The inherited calcium-sensing abnormality is not a routine single-gland surgical problem in this confirmed case.

**Existing evidence mapped to this node:**

- `claim.fhh.reassurance-observation-avoid-parathyroid-surgery` → `source.bollerslev.parat-parathyroid-consensus.2022`, `source.bilezikian.fifth-workshop-phpt-guideline.2022`. Limit: Rare symptomatic or atypical FHH and coexisting primary hyperparathyroidism require specialist individualized management and are excluded from these variants.
- `claim.gs028se.confidentiality.2` → `source.gs028se.ama-confidentiality-3-2-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy. Single-source limitation.

### 8. mondor: William Hayes

**New case:** `case.gs028se.p2e.confidentiality.v4.mondor`  
**Clinical question reused:** `question.mondor-disease.management.supportive-care.v1` from `case.mondor-disease.full-pathway`  
**Profiles retained:** 51 Male; 51 Female; 77 Male; 77 Female. Earliest facility level: **0**.

**Complaint:** Authorized specialist coordination

**Presentation:** William Hayes, a 51-year-old man, has uncomplicated Mondor disease and authorizes relevant information sharing for a treating specialist's consultation. The referral coordinator offers to send everything because selecting relevant records would involve reading them. The specialist requests the history and findings needed for this visit. The team has the authorization and is preparing the information to share.

#### Step 1: ethics

**Question variant:** `question.statistics-ethics.confidentiality.v4`  
**FSRS concept:** `concept.statistics-ethics.confidentiality`

**Question:** How should the clinic handle the treating specialist's relevant information request after William Hayes authorizes Mondor-disease care coordination?

**Choices — key first for review only:**

A. Share relevant information for authorized care **(key)**  
   The patient has authorized coordination, and the specialist requests relevant information. Share for that purpose while avoiding unnecessary disclosure.

B. Send the complete chart for the specialist to filter  
   The whole chart may include information beyond the consultation's purpose. Authorization to coordinate does not justify unnecessary disclosure for the specialist to filter later.

C. Request a new authorization for each relevant chart item  
   The supplied authorization already supports relevant coordination. Treating every relevant item as newly prohibited obstructs that authorized care purpose.

D. Send a de-identified summary for the treating consultation  
   The specialist needs relevant patient-specific consultation information. A de-identified substitute does not provide the authorized coordination requested in this scenario.

**Lesson:** Confidentiality permits appropriate exchange for authorized care; it does not prohibit all coordination. Share information relevant to the consultation while avoiding unnecessary disclosure. Remember to match the information to its purpose. Sending the whole chart for someone else to filter, or treating every relevant item as newly forbidden, misses that balance in this supplied setting.

**Short explanation:** Share relevant patient-specific information for the authorized consultation, avoiding unnecessary disclosure. The stated authorization supports that coordination; confidentiality does not require blocking every exchange or sending the entire chart.

**Existing evidence mapped to this node:**

- `claim.gs028se.confidentiality.4` → `source.gs028se.ama-confidentiality-3-2-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy. Single-source limitation.
- `claim.mondor-disease.classic-clinical-phenotype` → `source.statpearls.mondor-disease.2023`, `source.amano-shimizu.mondor-review.2018`. Limit: Atypical, progressive, recurrent, systemic, or mass-associated findings require evaluation for alternative or secondary causes rather than pattern recognition alone.
- `claim.mondor-disease.supportive-management-and-boundaries` → `source.statpearls.mondor-disease.2023`, `source.amano-shimizu.mondor-review.2018`. Limit: Progressive diffuse breast change, adenopathy, a suspicious mass, infection, recurrent or migratory thrombophlebitis, or a known hypercoagulable condition falls outside this uncomplicated supportive-care pathway.

#### Step 2: clinical decision

**Question variant:** `question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4`  
**FSRS concept:** `concept.mondor-disease.supportive-management`

**Reached update, after either correct or corrected-forward feedback:** The team shares relevant information for William Hayes's authorized consultation while avoiding unnecessary disclosure. The specialist confirms concordant uncomplicated Mondor disease after appropriate clinical evaluation. There is no suspicious mass, infection, progressive diffuse breast change, adenopathy, recurrent or migratory thrombophlebitis, or known hypercoagulable condition. The same patient wants to discuss initial care now that relevant findings are available to the treating team.

**Question:** Which initial care plan best fits William Hayes's confirmed uncomplicated Mondor disease after appropriate evaluation, without infection, suspicious findings or a separate indication for anticoagulation?

**Choices — key first for review only:**

A. Warm compresses, appropriate NSAID, and follow-up **(key)**  
   Supportive measures and follow-up fit the confirmed uncomplicated superficial thrombophlebitis after appropriate evaluation.

B. Incision and drainage with empiric antibiotics  
   The evaluated finding is uncomplicated Mondor disease, without an abscess or infection requiring drainage and antibiotics.

C. Surgical excision of the involved superficial vein  
   Excision of the superficial vein is not routine initial treatment for concordant uncomplicated Mondor disease.

D. Routine therapeutic anticoagulation  
   Routine therapeutic anticoagulation is not standard for uncomplicated Mondor disease without a separate indication.

**Lesson:** Concordant uncomplicated Mondor disease is generally self-limited. Initial care is supportive with warm compresses, an NSAID when appropriate, avoidance of irritating activity or clothing, and follow-up. Antibiotics, venous excision, and therapeutic anticoagulation are not routine without a separate indication.

**Short explanation:** Offer supportive care for concordant uncomplicated Mondor disease, including warm compresses, an NSAID when appropriate and follow-up. Other treatments require a separate indication.

**Existing evidence mapped to this node:**

- `claim.mondor-disease.supportive-management-and-boundaries` → `source.statpearls.mondor-disease.2023`, `source.amano-shimizu.mondor-review.2018`. Limit: Progressive diffuse breast change, adenopathy, a suspicious mass, infection, recurrent or migratory thrombophlebitis, or a known hypercoagulable condition falls outside this uncomplicated supportive-care pathway.
- `claim.gs028se.confidentiality.4` → `source.gs028se.ama-confidentiality-3-2-1`. Limit: Ethical guidance does not replace jurisdiction-specific law or institutional policy. Single-source limitation.
- `claim.mondor-disease.classic-clinical-phenotype` → `source.statpearls.mondor-disease.2023`, `source.amano-shimizu.mondor-review.2018`. Limit: Atypical, progressive, recurrent, systemic, or mass-associated findings require evaluation for alternative or secondary causes rather than pattern recognition alone.

## Existing source register

These are links to existing catalog records, with their original citation, access date, authority and reuse metadata retained. No source was retrieved or added for P2-E.

- `source.amano-shimizu.mondor-review.2018`: Amano M, Shimizu T. Mondor's Disease: A Review of the Literature. Intern Med. 2018;57(18):2607-2612. doi:10.2169/internalmedicine.0495-17. PMID: 29780120. [Official record](https://pmc.ncbi.nlm.nih.gov/articles/PMC6191595/). Accessed 2026-08-06. narrative_review; Open-access article; publisher and article-specific reuse terms apply; copyrighted_targeted_verification_only.
- `source.bilezikian.fifth-workshop-phpt-guideline.2022`: Bilezikian JP, Khan AA, Silverberg SJ, et al.; International Workshop on Primary Hyperparathyroidism. Evaluation and Management of Primary Hyperparathyroidism: Summary Statement and Guidelines from the Fifth International Workshop. J Bone Miner Res. 2022;37(11):2293-2314. doi:10.1002/jbmr.4677. [Official record](https://pubmed.ncbi.nlm.nih.gov/36245251/). Accessed 2026-08-13. peer_reviewed_guideline; Copyrighted guideline; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.board.gist-geis-2023`: Serrano C, Martín-Broto J, Asencio-Pascual JM, López-Guerrero JA, Rubió-Casadevall J, Bagué S, García-del-Muro X, Fernández-Hernández JA, Herrero L, López-Pousa A, Poveda A, Martínez-Marín V; GEIS. 2023 GEIS Guidelines for gastrointestinal stromal tumors. Therapeutic Advances in Medical Oncology. 2023;15:17588359231192388. doi:10.1177/17588359231192388. Accessed 2026-09-12. [Official record](https://grupogeis.org/documentos/guias-geis/2023-GEIS-guidelines-for-GIST.pdf). Accessed 2026-09-12. professional_society_guideline; Creative Commons Attribution-NonCommercial 4.0; cc_by_nc_4_0_restricted.
- `source.board.gist-nci-pdq-2024`: PDQ Adult Treatment Editorial Board. Gastrointestinal Stromal Tumors Treatment (PDQ®), Health Professional Version. National Cancer Institute. Latest displayed update December 13, 2024. Accessed 2026-09-12. [Official record](https://www.cancer.gov/types/soft-tissue-sarcoma/hp/gist-treatment-pdq). Accessed 2026-09-12. government_guidance; NCI text reuse permitted with credit; PDQ trademark restrictions apply; public_domain_conditions_apply.
- `source.bollerslev.parat-parathyroid-consensus.2022`: Bollerslev J, Rejnmark L, Zahn A, et al.; 2021 PARAT Working Group. European expert consensus on practical management of specific aspects of parathyroid disorders in adults and in pregnancy: recommendations of the ESE Educational Program of Parathyroid Disorders (PARAT 2021). Eur J Endocrinol. 2022;186(2):R33-R63. doi:10.1530/EJE-21-1044. [Official record](https://pmc.ncbi.nlm.nih.gov/articles/PMC8789028/). Accessed 2026-08-13. professional_society_guideline; Creative Commons Attribution 4.0 International; cc_by_4_0.
- `source.bread-butter.ascrs-anorectal-abscess-2022`: Gaertner WB, Burgess PL, Davids JS, Lightner AL, Shogan BD, Sun MY, Steele SR, Paquette IM, Feingold DL; Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Anorectal Abscess, Fistula-in-Ano, and Rectovaginal Fistula. Dis Colon Rectum. 2022;65(8):964-985. doi:10.1097/DCR.0000000000002473. PMID:35732009. [Official record](https://www.ascrsu.com/ascrs/view/ASCRS-Toolkit/2851069/all/Management_of_Anorectal_Abscess_Fistula_in_Ano_and_Rectovaginal_Fistula__2022_). Accessed 2026-09-17. professional_society_guideline; Copyrighted professional-society guideline; copyrighted_targeted_verification_only.
- `source.gs028se.ama-capacity-2-1-2`: American Medical Association. Code of Medical Ethics Opinion 2.1.2: Decisions for Adult Patients Who Lack Capacity. Accessed 2026-09-29. [Official record](https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity). Accessed 2026-09-29. professional_society_guideline; Copyrighted; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.gs028se.ama-confidentiality-3-2-1`: American Medical Association. Code of Medical Ethics Opinion 3.2.1: Confidentiality. Accessed 2026-09-29. [Official record](https://code-medical-ethics.ama-assn.org/ethics-opinions/confidentiality). Accessed 2026-09-29. professional_society_guideline; Copyrighted; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.gs028se.ama-consent-2-1-1`: American Medical Association. Code of Medical Ethics Opinion 2.1.1: Informed Consent. Accessed 2026-09-29. [Official record](https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent). Accessed 2026-09-29. professional_society_guideline; Copyrighted; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.gs028se.ama-dnar-5-4`: American Medical Association. Code of Medical Ethics Opinion 5.4: Orders Not to Attempt Resuscitation (DNAR). Accessed 2026-09-29. [Official record](https://code-medical-ethics.ama-assn.org/ethics-opinions/orders-not-attempt-resuscitation-dnar). Accessed 2026-09-29. professional_society_guideline; Copyrighted; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.gs028se.ama-research-7-1-2`: American Medical Association. Code of Medical Ethics Opinion 7.1.2: Informed Consent in Research. Accessed 2026-09-29. [Official record](https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent-research). Accessed 2026-09-29. professional_society_guideline; Copyrighted; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.gs028se.ama-safety-8-6`: American Medical Association. Code of Medical Ethics Opinion 8.6: Promoting Patient Safety. Accessed 2026-09-29. [Official record](https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety). Accessed 2026-09-29. professional_society_guideline; Copyrighted; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.gs028se.asa-dnar-2023`: American Society of Anesthesiologists Committee on Ethics. Statement on Ethical Guidelines for the Anesthesia Care of Patients with Do-Not-Resuscitate Orders. Originally approved 2001; reaffirmed 2023. Accessed 2026-09-29. [Official record](https://www.asahq.org/standards-and-practice-parameters/statement-on-ethical-guidelines-for-the-anesthesia-care-of-patients-with-do-not-resuscitate-orders). Accessed 2026-09-29. professional_society_guideline; Copyrighted; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.hs.australasian-2025`: Frew J, Smith A, Fernandez Penas P, et al. Australasian hidradenitis suppurativa management guidelines. Australas J Dermatol. 2025;66(2):75-89. doi:10.1111/ajd.14388. [Official record](https://doi.org/10.1111/ajd.14388). Accessed 2026-09-28. peer_reviewed_guideline; Copyrighted guidance; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.hs.north-american-2019`: Alikhan A, Sayed C, Alavi A, et al. North American clinical management guidelines for hidradenitis suppurativa, Part I. J Am Acad Dermatol. 2019;81(1):76-90. doi:10.1016/j.jaad.2019.02.067. [Official record](https://pmc.ncbi.nlm.nih.gov/articles/PMC9131894/). Accessed 2026-09-28. professional_society_guideline; Copyrighted guidance; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.kasper.current-management-desmoid-tumors.2024`: Kasper B, Baldini EH, Bonvalot S, et al; Desmoid Tumor Working Group. Current Management of Desmoid Tumors: A Review. JAMA Oncology. 2024;10(8):1121-1128. doi:10.1001/jamaoncol.2024.1805. [Official record](https://pubmed.ncbi.nlm.nih.gov/38900421/). Accessed 2026-08-10. peer_reviewed_guideline; Copyrighted peer-reviewed consensus review; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.ptld.ast-2019`: Allen UD, Preiksaitis JK; AST Infectious Diseases Community of Practice. Post-transplant lymphoproliferative disorders, Epstein-Barr virus infection, and disease in solid organ transplantation: Guidelines from the American Society of Transplantation Infectious Diseases Community of Practice. Clin Transplant. 2019;33(9):e13652. doi:10.1111/ctr.13652. [Official record](https://pubmed.ncbi.nlm.nih.gov/31230381/). Accessed 2026-09-29. professional_society_guideline; Copyrighted guidance; targeted factual verification only; copyrighted_targeted_verification_only.
- `source.ptld.frontiers-review-2026`: Vargas-Nieto LP, Santoyo-Sarmiento D, Ballesteros-García MF, Calderón-Vásquez AM, Pinto-Rodriguez M, Robayo-Romero J, Cormane-Alfaro S, Daza-Buitrago JA. Post-transplant lymphoproliferative disorder after solid organ transplantation: a comprehensive review. Front Transplant. 2026;5:1869288. doi:10.3389/frtra.2026.1869288. [Official record](https://www.frontiersin.org/journals/transplantation/articles/10.3389/frtra.2026.1869288/full). Accessed 2026-09-29. narrative_review; Creative Commons Attribution 4.0; cc_by_4_0.
- `source.seom-geis.soft-tissue-sarcoma-guideline.2024`: Serrano C, Arregui M, Carrasco I, et al. SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024). Clinical and Translational Oncology. 2025;27(4):1460-1471. doi:10.1007/s12094-024-03842-5. [Official record](https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/). Accessed 2026-08-10. professional_society_guideline; Creative Commons Attribution 4.0 International; cc_by_4_0.
- `source.statpearls.mondor-disease.2023`: Rountree KM, Barazi H, Aulick NFA. Mondor Disease. Updated May 22, 2023. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2026 Jan-. PMID: 30855866. [Official record](https://www.ncbi.nlm.nih.gov/books/NBK538282/). Accessed 2026-08-06. open_educational_resource; Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International; copyrighted_targeted_verification_only.
- `source.varicose.svs-avf-avls-2023`: Gloviczki P, Lawrence PF, Wasan SM, et al. 2023 SVS/AVF/AVLS clinical practice guidelines for management of varicose veins, Part II. J Vasc Surg Venous Lymphat Disord. 2024;12(1):101670. doi:10.1016/j.jvsv.2023.08.011. [Official record](https://pmc.ncbi.nlm.nih.gov/articles/PMC11523430/). Accessed 2026-09-28. professional_society_guideline; Copyrighted guidance; targeted factual verification only; copyrighted_targeted_verification_only.

## Validation and handoff

Exact commands, results, scope proof and historical intake restoration receipts are appended to `docs/execplans/gs028-stats-ethics-overhaul-20261007.md`, **P2-E pairings (2026-10-17)**. The Level 5 recorded-input evidence must be rebound by the manager after concurrent work finishes. Its guard, results and checkpoint fixture are outside this worker lane.

**Local only:** no Git, installs, network, external messages, deployment or publication. Manager owns acceptance, the current-thread handoff and the audited GitHub checkpoint reminder to say **"push to GitHub"**.
