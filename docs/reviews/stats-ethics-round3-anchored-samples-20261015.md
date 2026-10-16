# Statistics and ethics round 3 — clinically anchored samples

Date: 2026-10-15. **Docs-only, sample first. All eight proposals remain `needs_clinician_review`.** This document proposes wording for existing objectives and IDs; it does not edit content, tests, claims, sources, profiles, case pairings, facility contracts, release admission or frozen saves.

**KEY FIRST FOR REVIEW ONLY:** A is the key in each list. Existing question/concept/choice IDs are retained below. Runtime answer choices remain randomized. Four samples have behavioral humor and four are straight. Humor targets professional bureaucracy or comes from the patient’s own dry wit; it does not target illness, harm, capacity, abuse, disclosure or end-of-life care.

Each vignette starts with a named patient, age, sex and an authored clinical condition. The clinical decision gives the statistics or ethics question a purpose. The methods samples are named patient cases for the existing employee-hosted review; the patient is distinct from the staff host. The hospital scenes do not authorize onsite emergency treatment or surgery in a game clinic.

**How to read the numbers:** every study below is constructed and unnamed. Numerical performance belongs to a new investigational antibody, blood screen or closure device, with the outcome, units and denominator stated. No named real drug, guideline, trial or established test receives invented performance. Sources support the methods and clinical anchors; they do not provide evidence for these fictional interventions. Invented protocol facts and individual case facts are stipulated for the exercise. No clinical management threshold, drug dose, real efficacy estimate or personal risk is invented.

## 1. ARR/NNT — colon cancer and an investigational antibody

**Stable concept:** `concept.statistics-ethics.arr-nnt`. **Existing objective:** Calculate absolute risk reduction and number needed to treat while retaining comparator, outcome, and time horizon.

**Question ID:** `question.statistics-ethics.arr-nnt.v1`. **Status:** `needs_clinician_review`. **Humor:** Situational.

**Complaint:** Trial benefit question

**Story:** Maya Reed, a 61-year-old woman, has biopsy-confirmed colon cancer. Staging shows localized, resectable disease, and resection is planned. She is considering a trial of a new monoclonal antibody. The recruiter calls the presentation patient-centered, then turns the screen away to read it. Maya asks what the reported readmission reduction means before deciding about enrollment.

**Exhibit:**

**Unnamed investigational-antibody trial — invented observations.** Participants undergoing colon-cancer resection are randomly assigned to the new antibody or the fictional control arm. Everyone completes the same 30-day postoperative follow-up; each person contributes one readmission outcome. Cells count people. These are constructed study data, not a real regimen's efficacy or a colon-cancer readmission estimate.

| Study arm | People readmitted within 30 days | People followed |
| --- | ---: | ---: |
| Fictional control arm | 20 | 100 |
| New unnamed monoclonal antibody | 10 | 100 |

**Question:** For 30-day postoperative readmission in the fictional antibody trial, what ARR and NNT describe the new antibody versus control?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. ARR 10 percentage points; NNT 10 over 30 days **(key)**

Choice ID: `correct_arr-ten`. **Rationale:** The arm risks are 20/100 and 10/100. Their absolute difference is 0.10, whose reciprocal is 10 for this outcome and follow-up period.

B. ARR 50 percentage points; NNT 2 over 30 days

Choice ID: `d1_arr-ten`. **Rationale:** The 50% figure is the relative reduction, calculated against the control risk. It is not a 50-percentage-point absolute difference to invert for NNT.

C. ARR 10 percentage points; NNT 100 over 30 days

Choice ID: `d2_arr-ten`. **Rationale:** The absolute difference is correct, but NNT uses the reciprocal of the proportion 0.10. That gives 10, not the reciprocal of 0.01.

D. ARR 5 percentage points; NNT 20 over 30 days

Choice ID: `d3_arr-ten`. **Rationale:** Dividing the ten-event difference by both groups combined gives 5%, but that pools the denominators incorrectly. First calculate each arm’s risk using its own 100 participants.

**Visible teachingPoint:** Absolute benefit starts with subtraction: control risk minus intervention risk. Here, 20% minus 10% is 10 percentage points, or 0.10. NNT is 1/0.10 = 10 for preventing one readmission over 30 days in this constructed comparison. Keep the outcome and time period attached to the number.

**Fallback explanation:** The fictional trial gives ARR = 20/100 − 10/100 = 0.10 and NNT = 1/0.10 = 10 for 30-day readmission. The 50% relative reduction is a different measure.

**Existing claim/source bindings:**

- **Colon diagnosis and resection context:** `claim.colorectal.histology-confirms` → `source.nci.colorectal-screening.2024`.
- **Localized resectable colon-cancer operative context:** `claim.colon-cancer.oncologic-regional-resection` → `source.board-batch.ascrs-colon-2022`, `source.board-batch.nci-colon-2025`.
- **ARR/NNT formula, denominator contrasts, outcome and horizon:** `claim.gs028se.statistics.arr-nnt` → `source.cochrane.chapter-15.2026`.
- **Relative-risk contrast in choice B:** `claim.gs028se.statistics.risk-ratio-odds-ratio` → `source.cdc.field-epi-study-design.2026`, `source.cdc.field-epi-analysis.2026`.

**Scope note:** The antibody, trial protocol and both arm risks are invented. No stage-specific systemic-treatment recommendation, antibody mechanism, eligibility rule, survival benefit or real readmission rate is asserted. The 30-day horizon retains the current ARR/NNT claim’s stated limitation.

## 2. PPV — a palpable breast mass and a new blood screen

**Stable concept:** `concept.statistics-ethics.predictive-value-prevalence`. **Existing objective:** Calculate positive predictive value and predict how it changes with prevalence when test characteristics stay fixed.

**Question ID:** `question.statistics-ethics.predictive-value-prevalence.v3`. **Status:** `needs_clinician_review`. **Humor:** Situational.

**Complaint:** Breast lump results

**Story:** Nora Hayes, a 36-year-old woman, has a palpable breast mass; imaging shows an accessible suspicious solid lesion. She is considering core biopsy and brings a positive result from a new investigational blood screen. 'The recruiter gave me his questions hotline. It rings him; he gives me the hotline,' she says, asking about the result.

**Exhibit:**

**Unnamed investigational blood screen — invented validation cohort.** Each cell counts people. Condition status comes from a separate reference assessment, treated as correct for this exercise. The cohort and its case mix are constructed; these are neither characteristics of an established screening test nor Nora’s personal probability.

| Reference condition status | Blood screen positive | Blood screen negative |
| --- | ---: | ---: |
| Breast cancer present | 40 | 20 |
| Breast cancer absent | 10 | 30 |

**Question:** What is the positive predictive value of the new investigational blood screen in the fictional validation cohort?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. 80% **(key)**

Choice ID: `correct_ppv-table`. **Rationale:** Among the 50 positive blood screens, 40 match cancer on the reference assessment. PPV therefore equals 40/(40 + 10) = 80% in this cohort.

B. 75%

Choice ID: `d1_ppv-table`. **Rationale:** This is 30/(10 + 30), the specificity among reference-negative people. It uses the condition-absent group rather than all positive blood screens.

C. 20%

Choice ID: `d2_ppv-table`. **Rationale:** This is 10/(40 + 10), the share of positive screens without cancer on the reference assessment. PPV counts the positive screens that do match the condition.

D. 67%

Choice ID: `d3_ppv-table`. **Rationale:** This rounds 40/(40 + 20), the sensitivity among reference-positive people. It starts with people who have cancer rather than people whose screen is positive.

**Visible teachingPoint:** PPV starts with positive tests: true positives divided by all positives. Here, 40 of 50 positive screens match the reference diagnosis, giving 80%. Remember “positive first.” That cohort result does not settle Nora’s diagnosis; the existing clinical pathway supports tissue sampling of her accessible suspicious solid mass.

**Fallback explanation:** PPV is 40/(40 + 10) = 80% in this fictional cohort. Its denominator includes every positive screen, including the ten that do not match the reference diagnosis.

**Existing claim/source bindings:**

- **Suspicious solid breast mass and image-guided core-biopsy context:** `claim.bread-butter.breast-mass.image-guided-core-biopsy` → `source.bread-butter.acr-palpable-breast-mass-2023`.
- **PPV denominator and cohort dependence:** `claim.gs028se.statistics.predictive-value-prevalence` → `source.cdc.test-accuracy.2026`, `source.fda.predictive-values.2026`.
- **Sensitivity and specificity distractors:** `claim.gs028se.statistics.sensitivity-specificity` → `source.cdc.test-accuracy.2026`.

**Scope note:** The blood screen is unnamed and investigational. Its invented table does not describe mammography, another established test, or a validated substitute for the mass’s diagnostic work-up; no real screening indication or test accuracy is claimed.

## 3. Study design — wound infection after appendectomy

**Stable concept:** `concept.statistics-ethics.study-design`. **Existing objective:** Identify randomized experiments, cohort studies, case-control studies, and cross-sectional studies from how participants and measurements are organized.

**Question ID:** `question.statistics-ethics.study-design.v3`. **Status:** `needs_clinician_review`. **Humor:** Straight.

**Complaint:** Appendectomy wound drainage

**Story:** Noah Walker, a 29-year-old man, returns with purulent drainage from his appendectomy incision. His surgeon has arranged wound opening and drainage. Noah is asked to allow record review for a study of a new closure device. Investigators selected patients with and without infection and will review earlier device use. Noah asks what kind of study this is.

**Exhibit:**

**Clinical record and unnamed investigational-device study.** Noah’s index diagnosis was uncomplicated appendicitis with an appendicolith. The current infection is localized to the superficial incision, with intact fascia and no systemic toxicity. Wound care is already arranged.

The constructed study selects people who developed a superficial incisional infection after appendectomy and comparison patients who did not. It then reviews their earlier use of the new unnamed closure device. The investigators assign no device for this record-review study. No risk estimates are reported.

**Question:** Which study design selects patients by postoperative wound-infection status and then reviews their earlier use of the investigational closure device?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Case-control study **(key)**

Choice ID: `correct_case-control`. **Rationale:** Participants enter according to whether the infection occurred, and earlier device exposure is then reviewed. Selection by outcome followed by exposure assessment defines this case-control design.

B. Prospective cohort study

Choice ID: `d1_case-control`. **Rationale:** A prospective cohort begins with exposure-defined groups and follows later outcomes. This study instead begins by selecting infected and uninfected patients.

C. Randomized experiment

Choice ID: `d2_case-control`. **Rationale:** The record-review investigators assign no intervention. Studying an investigational device does not itself mean that this particular study randomized its use.

D. Cross-sectional study

Choice ID: `d3_case-control`. **Rationale:** A cross-sectional comparison assesses exposure and outcome at one time. Here, selection starts with postoperative infection status and the investigators then examine earlier device exposure.

**Visible teachingPoint:** Name a study by how people enter it. This team begins with the outcome: infection present or absent, then looks back at device exposure. That makes it case-control. “New device” does not mean randomized, and reviewing records does not by itself identify the design; the selection rule matters.

**Fallback explanation:** This is a case-control study: investigators select infected and uninfected patients first, then review earlier device exposure. They do not assign treatment or follow exposure groups forward.

**Existing claim/source bindings:**

- **Underlying appendicitis and operative context:** `claim.gs028c.appendicitis.appendicolith-operative-pathway` → `source.sages.appendicitis.2024`, `source.pcori.coda-appendicitis.2024`.
- **Localized superficial incisional infection and arranged source control:** `claim.bread-butter.superficial-incisional-ssi.open-drain` → `source.bread-butter.idsa-ssti-2014-wound`.
- **All four study-design distinctions:** `claim.gs028se.statistics.study-design` → `source.cdc.field-epi-study-design.2026`.

**Scope note:** This is a real catalog postoperative condition, with its appropriate clinical response already underway. The study protocol is constructed and supplies no infection rate or device-benefit claim. The proposed text can be read as a named patient’s case within the existing employee-hosted methods discussion.

## 4. Confidence interval — a surgical-device trial before hernia repair

**Stable concept:** `concept.statistics-ethics.confidence-interval`. **Existing objective:** Interpret confidence intervals using their null value and precision without assigning probability to a fixed parameter.

**Question ID:** `question.statistics-ethics.confidence-interval.v2`. **Status:** `needs_clinician_review`. **Humor:** Straight.

**Complaint:** Hernia trial question

**Story:** Adrian Chen, a 52-year-old man with a confirmed reducible inguinal hernia that limits activity, is planning elective repair. He is considering a trial of a new closure device. The study summary reports a mean hospital-stay difference and a confidence interval. 'Does that help me plan for getting home?' Adrian asks before deciding whether to enroll.

**Exhibit:**

**Unnamed investigational closure-device trial — invented estimate.** The fictional trial compares the new device with its control arm during inguinal-hernia repair. The outcome is postoperative hospital stay, measured in hours; the contrast is device minus control. A standard frequentist procedure was used. No clinical-importance threshold is supplied.

| Reported quantity | Invented study value |
| --- | --- |
| Mean stay difference, device minus control | −4 hours |
| 95% confidence interval | −6 to −2 hours |

**Question:** What does the fictional trial’s 95% confidence interval of −6 to −2 hours show about the no-difference value for mean hospital stay?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The interval excludes a mean difference of zero hours **(key)**

Choice ID: `correct_difference-excludes`. **Rationale:** Zero is the null value for a difference, and it lies outside −6 to −2 hours. Both limits are negative on the stated device-minus-control scale.

B. The interval includes a mean difference of zero hours

Choice ID: `d1_difference-excludes`. **Rationale:** Zero is not between −6 and −2. A negative estimate does not make an interval include zero; its actual limits determine that.

C. The interval gives 95% probability of clinical benefit

Choice ID: `d2_difference-excludes`. **Rationale:** A confidence level describes how the method performs across repeated samples. It does not give a 95% chance that the device benefits Adrian.

D. The interval establishes a clinically important reduction in stay

Choice ID: `d3_difference-excludes`. **Rationale:** Excluding zero addresses the no-difference value. The interval alone does not define how much reduction matters clinically, and this exercise supplies no such threshold.

**Visible teachingPoint:** First identify the scale: a difference has a null value of zero; a ratio has a null value of one. This interval runs from −6 to −2 hours, so it excludes zero. Keep interpretation on the reported scale, and assess clinical importance separately from whether the interval contains the null.

**Fallback explanation:** The interval excludes zero, the null value for a mean difference. It does not by itself establish clinical importance or a 95% probability of benefit for Adrian.

**Existing claim/source bindings:**

- **Symptomatic reducible inguinal hernia and elective repair discussion:** `claim.inguinal-hernia.symptomatic-elective-repair` → `source.sc.herniasurge-2018`, `source.sc.niddk-inguinal-hernia`.
- **Difference null, confidence interpretation and clinical-importance limitation:** `claim.gs028se.statistics.confidence-interval` → `source.nist.confidence-intervals.2026`, `source.nist.confidence-limits-mean.2026`.

**Scope note:** The estimate belongs exclusively to the fictional unnamed-device trial. No established hernia technique, mesh, discharge timetable or real length-of-stay benefit is assigned these numbers. This remains a patient-case script for the existing employee-hosted discussion, not a runtime participant change.

## 5. Informed refusal — acute appendicitis

**Stable concept:** `concept.statistics-ethics.capacity-refusal`. **Existing objective:** Distinguish an unwelcome choice from impaired decision-making capacity.

**Question ID:** `question.statistics-ethics.capacity-refusal.v1`. **Status:** `needs_clinician_review`. **Humor:** Straight.

**Complaint:** Declining appendectomy

**Story:** Amelia Chen, a 32-year-old woman, is in hospital with confirmed uncomplicated appendicitis and an appendicolith. The surgeon recommends appendectomy. Amelia explains the options and their consequences, gives coherent personal reasons, and consistently declines surgery. 'I understand why you recommend it, but I do not want an operation,' she says. Her family asks the surgeon to overrule her.

**Exhibit:**

**Decision discussion record.** Amelia is otherwise fit. The proposed operation, relevant benefits and risks, alternatives, and implications of declining have been explained. She understands the information, applies it to her own situation, reasons about the options, and communicates a stable choice.

**Question:** How should the surgeon respond to Amelia’s refusal of the recommended appendectomy for acute appendicitis?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Respect her refusal and discuss the continuing care plan **(key)**

Choice ID: `key-1`. **Rationale:** The documented abilities support Amelia’s decision-making capacity, despite disagreement with the recommendation. Respect her informed refusal while continuing discussion of care and its implications.

B. Request psychiatric clearance before accepting her refusal of surgery

Choice ID: `wrong-1-1`. **Rationale:** Refusal of a recommended operation is not itself evidence of incapacity. The supplied abilities do not establish a need for blanket psychiatric clearance.

C. Ask her family to approve the proposed appendectomy first

Choice ID: `wrong-1-2`. **Rationale:** The family’s concern does not replace the decision of an adult who demonstrates the relevant abilities. Their agreement cannot authorize overriding her informed refusal.

D. Repeat the consent discussion until she accepts the appendectomy

Choice ID: `wrong-1-3`. **Rationale:** Further questions and support can help an informed choice, but agreement is not the required endpoint. Repetition aimed at obtaining acceptance does not justify setting her refusal aside.

**Visible teachingPoint:** Capacity concerns the person’s ability to make this decision, not whether the clinician agrees with the answer. Amelia demonstrates understanding, appreciation, reasoning, and a consistent choice. Her appendicolith supports the surgical recommendation, but it does not cancel informed refusal. Continue honest discussion of the risks, alternatives, and care plan.

**Fallback explanation:** Respect Amelia’s informed refusal: the described decision-making abilities are intact. A strong surgical recommendation and family disagreement do not independently establish incapacity or permission to override her.

**Existing claim/source bindings:**

- **Appendicitis with appendicolith and the conditional operative recommendation:** `claim.gs028c.appendicitis.appendicolith-operative-pathway` → `source.sages.appendicitis.2024`, `source.pcori.coda-appendicitis.2024`.
- **Capable adult’s refusal and disagreement versus incapacity:** `claim.gs028se.capacity-refusal.1` → `source.gs028se.ama-consent-2-1-1`, `source.gs028se.ama-capacity-2-1-2`.
- **Decision-specific ability assessment:** `claim.gs028se.capacity-refusal.3` → `source.gs028se.ama-consent-2-1-1`, `source.gs028se.ama-capacity-2-1-2`.

**Scope note:** The existing appendicitis recommendation is conditional and permits shared decision-making. This sample supplies no antibiotics-only protocol, promise of safety, discharge rule, risk percentage, emergency-consent exception or jurisdiction-specific legal test.

## 6. Informed consent — laparoscopic cholecystectomy

**Stable concept:** `concept.statistics-ethics.informed-consent`. **Existing objective:** Correct missing understanding, alternatives or voluntariness before elective procedural consent.

**Question ID:** `question.statistics-ethics.informed-consent.v1`. **Status:** `needs_clinician_review`. **Humor:** Situational.

**Complaint:** Gallbladder surgery discussion

**Story:** Marta López, a 43-year-old woman with confirmed acute calculous cholecystitis, is preparing for laparoscopic cholecystectomy at hospital. A qualified Spanish interpreter is present. The 'paperless' department has asked the clerk to print its paperless-compliance report. Marta signed a form at admission but has not discussed the operation’s risks, benefits, or alternatives.

**Exhibit:**

**Preoperative discussion record.** Marta is fit for the proposed hospital operation during this admission. The operation has not started. A signed consent document is present; the material information discussion has not taken place. Qualified Spanish interpretation is available for the conversation.

**Question:** Which next step best establishes informed consent for Marta’s planned laparoscopic cholecystectomy?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Discuss the operation’s benefits, risks, and alternatives with Marta **(key)**

Choice ID: `key-1`. **Rationale:** The signed form does not supply the discussion that has not occurred. Explain the proposed operation and relevant choices through the qualified interpreter before relying on consent.

B. Confirm Marta signed the consent form voluntarily at admission

Choice ID: `wrong-1-1`. **Rationale:** Voluntariness matters, but confirming it alone leaves the material information undisclosed. Marta still needs the relevant operation, benefit, risk, and alternatives discussion.

C. Ask Marta to reread the consent form before surgery

Choice ID: `wrong-1-2`. **Rationale:** A document can support communication, but rereading it does not establish that the relevant discussion occurred or that Marta’s questions were addressed.

D. Ask Marta to describe the operation in her own words

Choice ID: `wrong-1-3`. **Rationale:** Asking her to explain the plan can assess understanding after information is communicated. It does not replace the missing information discussion that must come first.

**Visible teachingPoint:** Consent is a conversation that supports a choice. Explain the proposed operation, relevant benefits and risks, and reasonable alternatives, including foregoing treatment, in language Marta can understand. Invite questions and check understanding. A signed form records part of the process; it cannot supply a discussion that never happened.

**Fallback explanation:** Use the qualified interpreter to discuss laparoscopic cholecystectomy, its relevant benefits, risks, and alternatives before relying on consent. A signature alone does not establish that information was understood.

**Existing claim/source bindings:**

- **Fit adult with acute calculous cholecystitis and index-admission laparoscopic surgery:** `claim.gs028c.cholecystitis.index-admission-cholecystectomy` → `source.wses.cholecystitis.2020`.
- **Material consent information and signature boundary:** `claim.gs028se.informed-consent.1` → `source.gs028se.ama-consent-2-1-1`.
- **Checking understanding and teach-back contrast:** `claim.gs028se.informed-consent.3` → `source.gs028se.ama-consent-2-1-1`, `source.gs028se.ahrq-lep-2020`.
- **Qualified Spanish interpretation supporting meaningful consent:** `claim.gs028se.qualified-interpreter.1` → `source.gs028se.ahrq-lep-2020`, `source.gs028se.hhs-ocr-interpreter-2015`, `source.gs028se.ama-consent-2-1-1`.
- **Voluntariness contrast:** `claim.gs028se.informed-consent.4` → `source.gs028se.ama-consent-2-1-1`.

**Scope note:** Marta’s Spanish-language identity and age/sex follow the existing v1 interpreter-to-consent profile. This samples the reached consent discussion after interpretation is arranged. A later full pass must anchor both existing nodes to the same surgical problem; the first Spanish node is not rewritten here. The hospital scene does not authorize surgery at a game clinic or change the existing pair.

## 7. Error disclosure — unintended bowel injury during hernia repair

**Stable concept:** `concept.statistics-ethics.error-disclosure`. **Existing objective:** Communicate material errors honestly while arranging appropriate care and avoiding unsupported blame.

**Question ID:** `question.statistics-ethics.error-disclosure.v1`. **Status:** `needs_clinician_review`. **Humor:** Straight.

**Complaint:** Operation questions

**Story:** Daniel Brooks, a 46-year-old man, returns after incisional-hernia repair. The surgeon confirms an operative error caused an unintended small-bowel opening that was recognized and repaired. Daniel asks why the operation differed from the plan. A colleague suggests describing it as uncomplicated surgery while the internal review continues. The surgeon is preparing to speak with him.

**Exhibit:**

**Verified operative record.** Daniel was stable during incisional-hernia repair. The small-bowel opening was recognized and securely repaired, with adequate source control, minimal controlled contamination and no ongoing gross spillage. The team has verified the unintended injury; further details remain under review. Ongoing clinical care and follow-up are arranged.

**Question:** How should the surgeon explain Daniel’s verified unintended small-bowel injury and repair during incisional-hernia surgery?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Explain the bowel injury, known implications, and current care plan **(key)**

Choice ID: `key-1`. **Rationale:** Daniel should receive the verified explanation and what is known about the injury’s implications and repair. State remaining uncertainty clearly while describing the current care plan.

B. Discuss the recovery plan and defer explanation of the bowel injury

Choice ID: `wrong-1-1`. **Rationale:** A recovery plan does not explain why the operation changed. Deferring the recognized injury leaves important information about what happened undisclosed.

C. Wait for the internal investigation before discussing the recognized bowel injury

Choice ID: `wrong-1-2`. **Rationale:** An ongoing review may clarify additional details, but the injury and repair are already known. Distinguish established facts from uncertainty and explain the investigation and care plan now.

D. Summarize the completed bowel repair as part of the surgical procedure

Choice ID: `wrong-1-3`. **Rationale:** Describing the repair alone can obscure that an unintended injury occurred. The account should explain the event and its known implications, with uncertainty clearly identified.

**Visible teachingPoint:** Explain what happened, its known implications, and what is being done. Keep verified facts separate from questions still under review. The bowel injury and repair are already known, so the surgeon can explain them now while updating Daniel about care and investigation. Repairing the injury does not replace that conversation.

**Fallback explanation:** Tell Daniel about the unintended bowel injury, its repair and the current care plan. Distinguish known implications from uncertainty while the remaining review continues.

**Existing claim/source bindings:**

- **Recognized, securely repaired small-bowel enterotomy during stable incisional-hernia repair with controlled contamination:** `claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair` → `source.ehs.emergency-ventral-incisional-hernia.2026`, `source.wses.complicated-abdominal-wall-hernia.2017`, `source.sages.laparoscopic-ventral-hernia.2016`.
- **Honest explanation of errors affecting care:** `claim.gs028se.error-disclosure.1` → `source.gs028se.ama-safety-8-6`.
- **Verified facts, uncertainty, investigation and care plan:** `claim.gs028se.error-disclosure.3` → `source.gs028se.ama-safety-8-6`.

**Scope note:** The recognized-enterotomy clinical scenario is already authored. The case stipulates a verified unintended operative error; it does not assert that every enterotomy establishes negligence. The claim’s mesh-selection decision is not taught here, and no instrument mechanism, repair technique, outcome guarantee or attribution of personal blame is added. A retained-sponge vignette is withheld because no matching authored condition/atomic clinical claim was found.

## 8. Confidentiality — a planned diagnostic skin excision

**Stable concept:** `concept.statistics-ethics.confidentiality`. **Existing objective:** Distinguish authorized care-related disclosure from curiosity or avoidable public exposure.

**Question ID:** `question.statistics-ethics.confidentiality.v1`. **Status:** `needs_clinician_review`. **Humor:** Situational.

**Complaint:** Biopsy privacy

**Story:** Owen Brooks, a 71-year-old man, is arranging diagnostic excision of a small accessible pigmented lesion concerning for melanoma. He wants the visit kept private. A friend calls asking why he needs surgery. 'He calls it a quick catch-up; last time I missed my birthday dinner,' Owen says. No authorization or relevant exception applies.

**Exhibit:**

**Information-sharing record.** Owen has not authorized disclosure to this friend. The caller asks for the reason for the procedure. No applicable legal or safety exception is supplied. Diagnostic excision is planned, and pathology is not yet available.

**Question:** How should clinic staff respond when Owen’s friend asks the reason for his planned diagnostic excision without authorization or an applicable exception?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Decline the request for clinical details without Owen’s authorization **(key)**

Choice ID: `key-1`. **Rationale:** The friend’s interest does not authorize disclosure, and no exception applies. Respect Owen’s privacy and allow him to decide whether to authorize sharing.

B. Give the details once the friend verifies Owen’s date of birth

Choice ID: `wrong-1-1`. **Rationale:** Knowing identifying information can help identify a person, but it does not give this caller permission to receive Owen’s confidential clinical information.

C. Confirm the visit reason if the friend already suggests it

Choice ID: `wrong-1-2`. **Rationale:** Confirming a suggested reason still discloses Owen’s health information. A caller’s prior knowledge or guess does not supply the missing authorization.

D. Provide a procedure summary while leaving the lesion concern out

Choice ID: `wrong-1-3`. **Rationale:** The procedure summary still concerns Owen’s private care. Omitting the suspected diagnosis does not turn an unauthorized clinical disclosure into an authorized one.

**Visible teachingPoint:** Permission governs disclosure, not how familiar or well informed a caller sounds. Identifying details, an accurate guess, or a general procedure question do not replace Owen’s authorization. Keep his information private when no exception applies, and let him choose whether to involve the friend in a later discussion.

**Fallback explanation:** Owen has not authorized disclosure, and no applicable exception exists. Decline the request for clinical details, including confirmation of the visit reason or a summary of his procedure.

**Existing claim/source bindings:**

- **Small accessible concerning pigmented lesion and diagnostic excision:** `claim.pigmented-skin-lesion.complete-diagnostic-biopsy` → `source.sc.nci-melanoma-pdq-2025`, `source.sc.aad-melanoma-highlights`.
- **Authorization and confidential-information boundary:** `claim.gs028se.confidentiality.1` → `source.gs028se.ama-confidentiality-3-2-1`.

**Scope note:** The patient’s own wit concerns his friend’s conversational habits. The lesion, possible cancer, age and body are not the joke. The sample preserves diagnostic uncertainty and does not introduce a confirmed melanoma diagnosis or operative-margin rule.

## Existing source records used

Links below are copied from the existing source catalog and were not fetched. Original prose is used throughout; no source passage or published table is reproduced. Existing access dates, authority/reuse assessments, single-source limitations and review gates remain in force. The archived CDC accuracy reference is dated 2012; the FDA item is used only as the existing predictive-value cross-check. No new medical or legal source verification is claimed.

- `source.board-batch.ascrs-colon-2022` — Vogel JD, Felder SI, Bhama AR, et al. ASCRS Clinical Practice Guidelines for the Management of Colon Cancer. Diseases of the Colon & Rectum. 2022;65:148-177. doi:10.1097/DCR.0000000000002323. Accessed 2026-09-11. <a href="https://www.ascrsu.com/ascrs/view/ASCRS-Toolkit/2851068/all/Management_" target="_blank" rel="noopener noreferrer">American Society of Colon and Rectal Surgeons / Diseases of the Colon &amp; Rectum</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.board-batch.nci-colon-2025` — PDQ Adult Treatment Editorial Board. Colon Cancer Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated February 12, 2025. Accessed 2026-09-11. <a href="https://www.cancer.gov/types/colorectal/hp/colon-treatment-pdq" target="_blank" rel="noopener noreferrer">National Cancer Institute</a>. Existing reuse status: `public_domain_conditions_apply`.
- `source.bread-butter.acr-palpable-breast-mass-2023` — Expert Panel on Breast Imaging; Klein KA, Kocher M, Lourenco AP, et al. ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update. J Am Coll Radiol. 2023;20:S146-S163. doi:10.1016/j.jacr.2023.02.013. PMID:37236740. <a href="https://pubmed.ncbi.nlm.nih.gov/37236740/" target="_blank" rel="noopener noreferrer">American College of Radiology / Journal of the American College of Radiology</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.bread-butter.idsa-ssti-2014-wound` — Stevens DL, Bisno AL, Chambers HF, Dellinger EP, Goldstein EJC, Gorbach SL, Hirschmann JV, Kaplan SL, Montoya JG, Wade JC. Practice guidelines for the diagnosis and management of skin and soft tissue infections: 2014 update by the Infectious Diseases Society of America. Clin Infect Dis. 2014;59(2):e10-e52. doi:10.1093/cid/ciu296. PMID:24973422. <a href="https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/" target="_blank" rel="noopener noreferrer">Clinical Infectious Diseases / Infectious Diseases Society of America</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.cdc.field-epi-analysis.2026` — Centers for Disease Control and Prevention. Field Epidemiology Manual: Analyzing and Interpreting Data. Accessed 2026-09-29. <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">Centers for Disease Control and Prevention</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.cdc.field-epi-study-design.2026` — Centers for Disease Control and Prevention. Field Epidemiology Manual: Design, Conduct, and Analyze Field Studies. Accessed 2026-09-29. <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">Centers for Disease Control and Prevention</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.cdc.test-accuracy.2026` — Centers for Disease Control and Prevention. Principles of Epidemiology: Lesson 5, Appendix A. Last reviewed 2012-05-18. Accessed 2026-09-29. <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">Centers for Disease Control and Prevention</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.cochrane.chapter-15.2026` — Schünemann HJ, Vist GE, Higgins JPT, Santesso N, Deeks JJ, Glasziou P, Akl EA, Guyatt GH. Chapter 15: Interpreting results and drawing conclusions [last updated August 2023]. In: Cochrane Handbook for Systematic Reviews of Interventions, version 6.5. Cochrane; 2024. Accessed 2026-09-29. <a href="https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-15" target="_blank" rel="noopener noreferrer">Cochrane</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.ehs.emergency-ventral-incisional-hernia.2026` — Stabilini C, Theodorou A, Pawlak M, et al. EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions. J Abdom Wall Surg. 2026;5:16228. doi:10.3389/jaws.2026.16228. <a href="https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2026.16228/full" target="_blank" rel="noopener noreferrer">European Hernia Society; Journal of Abdominal Wall Surgery</a>. Existing reuse status: `cc_by_4_0`.
- `source.fda.predictive-values.2026` — U.S. Food and Drug Administration. Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers. Section: What does predictive value mean? Accessed 2026-09-29. <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">U.S. Food and Drug Administration</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.gs028se.ahrq-lep-2020` — Agency for Healthcare Research and Quality. Five Key Recommendations To Improve Patient Safety for LEP Patients. 2012; last reviewed 2020. Accessed 2026-09-29. <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">Agency for Healthcare Research and Quality</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.gs028se.ama-capacity-2-1-2` — American Medical Association. Code of Medical Ethics Opinion 2.1.2: Decisions for Adult Patients Who Lack Capacity. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">American Medical Association</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.gs028se.ama-confidentiality-3-2-1` — American Medical Association. Code of Medical Ethics Opinion 3.2.1: Confidentiality. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/confidentiality" target="_blank" rel="noopener noreferrer">American Medical Association</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.gs028se.ama-consent-2-1-1` — American Medical Association. Code of Medical Ethics Opinion 2.1.1: Informed Consent. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">American Medical Association</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.gs028se.ama-safety-8-6` — American Medical Association. Code of Medical Ethics Opinion 8.6: Promoting Patient Safety. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety" target="_blank" rel="noopener noreferrer">American Medical Association</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.gs028se.hhs-ocr-interpreter-2015` — U.S. Department of Health and Human Services Office for Civil Rights. May an LEP person use a family member or friend as interpreter? Last reviewed 2015. Accessed 2026-09-29. <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">HHS Office for Civil Rights</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.hernia.ehs-ahs-2020` — Henriksen NA, Montgomery A, Kaufmann R, et al. Guidelines for treatment of umbilical and epigastric hernias from the European Hernia Society and Americas Hernia Society. Br J Surg. 2020;107(3):171-190. doi:10.1002/bjs.11489. <a href="https://europeanherniasociety.eu/guidelines/guidelines-for-treatment-of-umbilical-and-epigastric-hernias-from-the-european-hernia-society-and-americas-hernia-society/" target="_blank" rel="noopener noreferrer">European and Americas Hernia Societies</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.jsge.cholelithiasis-guideline.2023` — Fujita N, Yasuda I, Endo I, et al. Evidence-based clinical practice guidelines for cholelithiasis 2021. Journal of Gastroenterology. 2023;58:801-833. doi:10.1007/s00535-023-02014-6. <a href="https://link.springer.com/article/10.1007/s00535-023-02014-6" target="_blank" rel="noopener noreferrer">Journal of Gastroenterology</a>. Existing reuse status: `cc_by_4_0`.
- `source.nci.colorectal-screening.2024` — National Cancer Institute. Screening Tests to Detect Colorectal Cancer and Polyps. Reviewed October 29, 2024. <a href="https://www.cancer.gov/types/colorectal/screening-fact-sheet" target="_blank" rel="noopener noreferrer">National Cancer Institute</a>. Existing reuse status: `public_domain_conditions_apply`.
- `source.niddk.gallstones-treatment.2017` — National Institute of Diabetes and Digestive and Kidney Diseases. Treatment for Gallstones. Reviewed November 2017. <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones/treatment" target="_blank" rel="noopener noreferrer">NIDDK</a>. Existing reuse status: `public_domain_conditions_apply`.
- `source.nist.confidence-intervals.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: What are confidence intervals? Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noopener noreferrer">National Institute of Standards and Technology</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.nist.confidence-limits-mean.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: Confidence Limits for the Mean. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm" target="_blank" rel="noopener noreferrer">National Institute of Standards and Technology</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.pcori.coda-appendicitis.2024` — Patient-Centered Outcomes Research Institute. Comparing Surgery versus Antibiotics for Treating Adults with Uncomplicated Appendicitis. Evidence Update. Accessed October 2, 2026. <a href="https://www.pcori.org/evidence-updates/comparing-surgery-versus-antibiotics-treating-adults-uncomplicated-appendicitis" target="_blank" rel="noopener noreferrer">Patient-Centered Outcomes Research Institute</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.pediatric-clinic.cornwall-surgery-2025` — Faux W, Burns S. Paediatric Surgery. NHS Cornwall and Isles of Scilly Referral Management Service. Version 1.2; partial update 9 May 2025. Review date listed as 9 May 2026. Accessed 8 October 2026. <a href="https://rms.cornwall.nhs.uk/rms/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/paediatric_surgery" target="_blank" rel="noopener noreferrer">NHS Cornwall and Isles of Scilly Referral Management Service</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.pediatric-clinic.cps-decision-making-2018` — Coughlin KW; Canadian Paediatric Society Bioethics Committee. Medical decision-making in paediatrics: Infancy to adolescence. Paediatr Child Health. 2018;23(2):138-146. doi:10.1093/pch/pxx127. Posted 12 April 2018; reaffirmed 11 January 2024. <a href="https://cps.ca/en/documents/position/medical-decision-making-in-paediatrics-infancy-to-adolescence" target="_blank" rel="noopener noreferrer">Canadian Paediatric Society / Paediatrics &amp; Child Health</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.pediatric-clinic.gosh-midline-hernia-2016` — Great Ormond Street Hospital General Surgery Department and Child and Family Information Group. Umbilical and epigastric hernia. Reference 2016F1150; reviewed 1 July 2016. Accessed 8 October 2026. <a href="https://www.gosh.nhs.uk/conditions-and-treatments/conditions-we-treat/umbilical-and-epigastric-hernia/" target="_blank" rel="noopener noreferrer">Great Ormond Street Hospital for Children NHS Foundation Trust</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.pediatric-clinic.nhs-hernia-2026` — NHS website. Hernia. Reviewed 19 May 2026. Accessed 8 October 2026. <a href="https://www.nhs.uk/conditions/hernia/" target="_blank" rel="noopener noreferrer">NHS website</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.sages.appendicitis.2024` — Society of American Gastrointestinal and Endoscopic Surgeons. Guideline for the Diagnosis and Treatment of Appendicitis. 2024. <a href="https://www.sages.org/publications/guidelines/guideline-for-the-diagnosis-and-treatment-of-appendicitis/" target="_blank" rel="noopener noreferrer">Society of American Gastrointestinal and Endoscopic Surgeons</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.sages.laparoscopic-ventral-hernia.2016` — Earle D, Roth JS, Saber A, et al.; SAGES Guidelines Committee. SAGES guidelines for laparoscopic ventral hernia repair. Surg Endosc. 2016;30(8):3163-3183. doi:10.1007/s00464-016-5072-x. <a href="https://www.sages.org/publications/guidelines/guidelines-for-laparoscopic-ventral-hernia-repair/" target="_blank" rel="noopener noreferrer">Society of American Gastrointestinal and Endoscopic Surgeons; Surgical Endoscopy</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.sc.aad-melanoma-highlights` — American Academy of Dermatology. Melanoma clinical guideline: Guideline highlights. Undated professional education page. Accessed 2026-09-10. <a href="https://www.aad.org/member/clinical-quality/guidelines/melanoma" target="_blank" rel="noopener noreferrer">American Academy of Dermatology</a>. Existing reuse status: `copyrighted_targeted_verification_only`.
- `source.sc.herniasurge-2018` — The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. Published 2018-01-12. doi:10.1007/s10029-017-1668-x. PMID:29330835. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/" target="_blank" rel="noopener noreferrer">Hernia / HerniaSurge Group</a>. Existing reuse status: `cc_by_nc_4_0_restricted`.
- `source.sc.nci-melanoma-pdq-2025` — PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10. <a href="https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq" target="_blank" rel="noopener noreferrer">National Cancer Institute PDQ</a>. Existing reuse status: `public_domain_conditions_apply`.
- `source.sc.niddk-inguinal-hernia` — National Institute of Diabetes and Digestive and Kidney Diseases. Inguinal Hernia. Last reviewed September 2019. Accessed 2026-09-10. <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/inguinal-hernia" target="_blank" rel="noopener noreferrer">National Institute of Diabetes and Digestive and Kidney Diseases</a>. Existing reuse status: `public_domain_conditions_apply`.
- `source.variety3.shea-ssi-update-2023` — Calderwood MS, Anderson DJ, Bratzler DW, Dellinger EP, Garcia-Houchins S, Maragakis LL, Nyquist A-C, Perkins KM, Preas MA, Saiman L, Schaffzin JK, Schweizer M, Yokoe DS, Kaye KS. Strategies to prevent surgical site infections in acute-care hospitals: 2022 Update. Infect Control Hosp Epidemiol. 2023;44(5):695-720. Published 4 May 2023. doi:10.1017/ice.2023.67. PMID:37137483. Accessed 10 October 2026. <a href="https://stacks.cdc.gov/view/cdc/155079/cdc_155079_DS1.pdf" target="_blank" rel="noopener noreferrer">SHEA / IDSA / APIC / Infection Control &amp; Hospital Epidemiology</a>. Existing reuse status: `cc_by_4_0`.
- `source.wses.cholecystitis.2020` — Pisano M, Allievi N, Gurusamy K, et al. 2020 World Society of Emergency Surgery updated guidelines for acute calculous cholecystitis. World J Emerg Surg. 2020;15:61. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/" target="_blank" rel="noopener noreferrer">World Journal of Emergency Surgery</a>. Existing reuse status: `cc_by_4_0`.
- `source.wses.complicated-abdominal-wall-hernia.2017` — Birindelli A, Sartelli M, Di Saverio S, et al. 2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias. World J Emerg Surg. 2017;12:37. doi:10.1186/s13017-017-0149-y. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5545868/" target="_blank" rel="noopener noreferrer">World Society of Emergency Surgery; World Journal of Emergency Surgery</a>. Existing reuse status: `cc_by_4_0`.

## Docs-only handoff and checks

Only `docs/reviews/stats-ethics-round3-anchored-samples-20261015.md` is delivered this turn. No content or test file was edited. The active ExecPlan and `CURRENT_THREAD_HANDOFF.md` remain with the manager. No content suites were run for this document-only proposal.

The local validation receipt checks eight existing question IDs, their concept IDs and all 32 choice IDs/correctness; 45–60-word stories; 40–55-word lessons; 20–40-word distinct fallbacks; four choices with distinct one- or two-sentence rationales; four humorous/four straight samples; exactly 30 existing focused topics; and every claim/source mapping against loaded repository records. Arithmetic and interval bounds were checked directly. Sources retain their original verification dates. These checks do not establish tone acceptance or clinical approval.

UTF-8 without BOM and LF are used. Before/after byte comparisons verify the existing content and test files remain unchanged. One unrelated shared ExecPlan changed concurrently; it was preserved and its before/current hashes are recorded separately in the local receipt. Validation receipts are at `.local-dev/stats-ethics-round3/`. No Git, installs, web access, agents, external messages, browser/save access, deployment or publication. **Local review artifact only.** Manager/owner review of these eight samples comes before a full bank rewrite; no full rewrite is authorized by this document. The manager retains checkpoint and handoff ownership.

## Catalog anchors for the complete 30-topic bank

Read-only inventory of the exported authored catalog in `packages/clinical-content/src/index.ts`: **385 concept IDs, 1,110 case IDs, 734 claim IDs and 452 source IDs** after deduplication. This includes exported authoring material and is not a statement of clinical approval or public availability. The following is a bounded set of suitable anchors, not a list of every diagnosis. Each C-key resolves to existing clinical concepts, claims and sources below.

| Focused topic / stable concept ID | Catalog anchor and a concrete decision or outcome |
| --- | --- |
| `concept.statistics-ethics.independent-t` | C5 inguinal hernia: compare mean postoperative stay between independent groups in an unnamed investigational-device trial. |
| `concept.statistics-ethics.paired-t` | C9 primary midline hernia: analyze the same trial participants’ protocol-defined recovery scores before and after an intervention. |
| `concept.statistics-ethics.one-way-anova` | C10 symptomatic gallstones: compare mean recovery time across several investigational-device groups after cholecystectomy. |
| `concept.statistics-ethics.rank-sum` | C5 inguinal hernia: compare ordinal recovery ratings between independent groups in an unnamed new-device study. |
| `concept.statistics-ethics.signed-rank` | C9 primary midline hernia: compare linked recovery-score changes in an unnamed device study with the stated difference-distribution assumptions. |
| `concept.statistics-ethics.chi-square` | C3/C4 appendectomy and superficial SSI: assess categorical device-use/infection association with adequate expected counts in a constructed unnamed-device study. |
| `concept.statistics-ethics.fisher-exact` | C3/C4 appendectomy and superficial SSI: assess a sparse two-by-two table from an unnamed investigational-device study. |
| `concept.statistics-ethics.study-design` | C3/C4 appendicitis and postoperative SSI: distinguish outcome-selected record review from exposure-first follow-up (sample 3). |
| `concept.statistics-ethics.bias-confounding` | C3/C4 appendectomy and SSI: evaluate differential record selection or unequal wound-assessment methods in an unnamed device study; no unsourced clinical risk-factor claim. |
| `concept.statistics-ethics.sensitivity-specificity` | C2 suspicious breast mass: explain denominators from the separate invented validation cohort of a new investigational blood screen. |
| `concept.statistics-ethics.predictive-value-prevalence` | C2 suspicious breast mass: interpret a new investigational blood screen’s PPV and its cohort dependence before the biopsy discussion (sample 2). |
| `concept.statistics-ethics.risk-ratio-odds-ratio` | C3/C4 appendectomy and SSI: interpret risks versus odds on the reported scale in an unnamed device study. |
| `concept.statistics-ethics.arr-nnt` | C1 localized colon cancer: calculate absolute readmission difference and NNT from an unnamed investigational-antibody trial (sample 1). |
| `concept.statistics-ethics.p-value` | C10 symptomatic gallstones: interpret a prespecified p-value in an unnamed investigational-device trial after cholecystectomy. |
| `concept.statistics-ethics.confidence-interval` | C5 inguinal hernia: interpret a mean hospital-stay difference in an unnamed new-device trial (sample 4). |
| `concept.statistics-ethics.errors-power` | C6 acute cholecystitis: consider prospective power or a supplied testing-error exercise for an unnamed device trial during laparoscopic surgery. |
| `concept.quality-improvement.pdsa-act-and-iterate` | C1/C4/C12 colon surgery and SSI prevention: use qualitative local cycle findings to choose the next action; any invented numeric effect must belong to an explicitly unnamed investigational study. |
| `concept.statistics-ethics.qi-measures` | C1/C4/C12 colon surgery and SSI prevention: distinguish preparation-process, infection-outcome and extra-preparation-time measures; no fabricated guideline efficacy. |
| `concept.statistics-ethics.qualified-interpreter` | C9 symptomatic umbilical/epigastric hernia: explain a real elective repair decision to the existing Spanish-speaking women, ages 43/68. |
| `concept.statistics-ethics.informed-consent` | C6 acute calculous cholecystitis: discuss laparoscopic cholecystectomy before relying on consent; preserve the interpreter sequence (sample 6). |
| `concept.statistics-ethics.capacity-refusal` | C3 acute appendicitis with appendicolith: respond to a recommended appendectomy being refused by an adult with the documented abilities (sample 5). |
| `concept.statistics-ethics.surrogate-decisions` | C6 acute cholecystitis: address the operative decision when the patient lacks capacity for that choice; do not invent the cause of incapacity or a legal hierarchy. |
| `concept.statistics-ethics.perioperative-dnr` | C5 elective inguinal-hernia repair or C1 colon resection: review an existing DNR in the actual perioperative plan. |
| `concept.statistics-ethics.error-disclosure` | C7 recognized enterotomy during incisional-hernia repair: explain the verified unintended injury, its repair and the care plan (sample 7). |
| `concept.statistics-ethics.impaired-colleague` | C8 concerning pigmented lesion: protect care when the assigned biopsy clinician cannot perform safely, with no assumed impairment diagnosis. |
| `concept.statistics-ethics.research-consent` | C1 colon cancer or C2 breast mass: distinguish participation in an investigational antibody/test study from ordinary clinical consent. |
| `concept.statistics-ethics.qi-versus-research` | C1/C4/C12 SSI prevention: distinguish implementing accepted preparation practice from an experimental-device comparison requiring institutional assessment. |
| `concept.statistics-ethics.confidentiality` | C8 diagnostic skin excision or C2 breast biopsy: handle a request for the patient’s private procedure information (sample 8). |
| `concept.gs028f.outcomes.rca-versus-fmea-purpose` | C7 operative-injury review or C2 biopsy workflow: reconstruct a completed event versus assess failures before a new process starts. |
| `concept.pediatric-clinic.developmental-assent-discussion` | C11 pediatric hernia evaluation: explain the nonurgent plan to Lily/Ruby, invite their questions and preserve each child/parent identity and parent-present setting. |

### Clinical-anchor register

**C1 — Localized colon cancer.** Existing clinical concepts: `concept.colorectal.histologic-confirmation`, `concept.colon-cancer.oncologic-regional-resection`.

- **Tissue confirmation:** `claim.colorectal.histology-confirms` → `source.nci.colorectal-screening.2024`.
- **Localized resectable disease and regional oncologic resection:** `claim.colon-cancer.oncologic-regional-resection` → `source.board-batch.ascrs-colon-2022`, `source.board-batch.nci-colon-2025`.

Boundary: Localized disease and operative context are covered. This does not supply metastatic-treatment, molecular-selection or stage-specific adjuvant-therapy teaching.

**C2 — Accessible suspicious solid breast mass.** Existing clinical concept: `concept.breast-mass.image-guided-core-biopsy`.

- **Completed diagnostic imaging and image-guided tissue sampling:** `claim.bread-butter.breast-mass.image-guided-core-biopsy` → `source.bread-butter.acr-palpable-breast-mass-2023`.

Boundary: One ACR source; urgent infection is outside this pathway. No particular imaging modality, biopsy device or investigational screening-test performance is established by this claim.

**C3 — Uncomplicated adult appendicitis with appendicolith.** Existing clinical concept: `concept.appendicitis.appendicolith-operative-pathway`.

- **Hospital surgical assessment and appendectomy discussion:** `claim.gs028c.appendicitis.appendicolith-operative-pathway` → `source.sages.appendicitis.2024`, `source.pcori.coda-appendicitis.2024`.

Boundary: Otherwise fit adults; operative guidance is conditional and patient preference still matters. No antibiotics-only regimen, safe-discharge rule or precise complication rate is supplied.

**C4 — Localized superficial incisional surgical-site infection.** Existing clinical concept: `concept.superficial-incisional-ssi.open-drain`.

- **Purulent superficial infection and incision opening/drainage:** `claim.bread-butter.superficial-incisional-ssi.open-drain` → `source.bread-butter.idsa-ssti-2014-wound`.

Boundary: One IDSA guideline from 2014. Do not extend this to deep/organ-space infection, evisceration, necrotizing infection or a universal systemic-antibiotic rule.

**C5 — Symptomatic reducible inguinal hernia.** Existing clinical concept: `concept.inguinal-hernia.symptomatic-elective-repair`.

- **Meaningful activity-limiting symptoms and elective repair planning:** `claim.inguinal-hernia.symptomatic-elective-repair` → `source.sc.herniasurge-2018`, `source.sc.niddk-inguinal-hernia`.

Boundary: No universal repair technique, mesh choice, discharge interval or effect estimate. NIDDK cites HerniaSurge, so the two source records are not independent underlying evidence.

**C6 — Acute calculous cholecystitis in a fit adult.** Existing clinical concept: `concept.cholecystitis.fit-patient-index-admission-cholecystectomy`.

- **Hospital care and index-admission laparoscopic cholecystectomy:** `claim.gs028c.cholecystitis.index-admission-cholecystectomy` → `source.wses.cholecystitis.2020`.

Boundary: One WSES source; critical illness, shock, anesthetic contraindication or unavailable expertise require individualization. This supports a hospital scene, not onsite clinic surgery.

**C7 — Recognized small-bowel enterotomy during incisional-hernia repair.** Existing clinical concept: `concept.ventral-hernia.controlled-enterotomy-macroporous-synthetic-mesh-selection`.

- **Stable adult, recognized securely repaired enterotomy, adequate source control and controlled contamination:** `claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair` → `source.ehs.emergency-ventral-incisional-hernia.2026`, `source.wses.complicated-abdominal-wall-hernia.2017`, `source.sages.laparoscopic-ventral-hernia.2016`.

Boundary: Use only the supported clinical event and its supplied source-control conditions for disclosure. The separate mesh-selection objective is not taught here. Do not infer negligence from every enterotomy, invent a mechanism or promise an uncomplicated outcome.

**C8 — Small accessible pigmented lesion concerning for melanoma.** Existing clinical concept: `concept.pigmented-skin-lesion.complete-diagnostic-biopsy`.

- **Diagnostic excision and tissue microstaging context:** `claim.pigmented-skin-lesion.complete-diagnostic-biopsy` → `source.sc.nci-melanoma-pdq-2025`, `source.sc.aad-melanoma-highlights`.

Boundary: Suspicion is not a confirmed melanoma diagnosis. No exact diagnostic margin, advanced-stage treatment or universal biopsy technique is added.

**C9 — Stable symptomatic umbilical or epigastric hernia.** Existing clinical concepts: `concept.umbilical-epigastric-hernia.clinical-recognition`, `concept.umbilical-epigastric-hernia.symptomatic-elective-referral`.

- **Clinical recognition:** `claim.primary-midline-hernia.clinical-recognition` → `source.hernia.ehs-ahs-2020`.
- **Individualized elective repair discussion:** `claim.primary-midline-hernia.symptomatic-referral` → `source.hernia.ehs-ahs-2020`.

Boundary: One EHS/AHS guideline with limited technique evidence. This is suitable for the Female Spanish-interpreter profiles; do not borrow the separate male-only inguinal watchful-waiting phenotype.

**C10 — Recurrent symptomatic gallstones.** Existing clinical concept: `concept.gallstones.symptomatic-surgical-referral`.

- **Compatible recurrent symptoms, ultrasound-confirmed stones and elective surgical counseling:** `claim.gallstones.symptomatic-referral` → `source.niddk.gallstones-treatment.2017`, `source.jsge.cholelithiasis-guideline.2023`.

Boundary: Individual operative suitability and competing diagnoses still matter. No new test performance, universal operative timing or actual trial outcome is supplied.

**C11 — Childhood inguinal or epigastric hernia.** Existing clinical concepts: `concept.pediatric-clinic.inguinal-hernia-referral`, `concept.umbilical-epigastric-hernia.clinical-recognition`.

- **Intermittent groin bulge:** `claim.pediatric-clinic.dynamic-groin-bulge` → `source.pediatric-clinic.nhs-hernia-2026`, `source.pediatric-clinic.cornwall-surgery-2025`.
- **Pediatric surgical referral:** `claim.pediatric-clinic.clinical-groin-hernia-referral` → `source.pediatric-clinic.cornwall-surgery-2025`.
- **Upper-midline epigastric fat-defect anatomy in the reused canonical recognition concept:** `claim.pediatric-clinic.epigastric-fat-defect` → `source.pediatric-clinic.gosh-midline-hernia-2016`.
- **Child-appropriate information:** `claim.pediatric-clinic.developmentally-appropriate-information` → `source.pediatric-clinic.cps-decision-making-2018`.
- **Inviting the child’s participation and assent:** `claim.pediatric-clinic.invite-child-participation-and-assent` → `source.pediatric-clinic.cps-decision-making-2018`.
- **Assent/legal-consent boundary:** `claim.pediatric-clinic.assent-legal-consent-boundary` → `source.pediatric-clinic.cps-decision-making-2018`.

Boundary: The pediatric referral has a single local NHS pathway, and the epigastric anatomy source dates to 2016. Preserve Lily Walker (6, Female), Susan Walker (mother), Ruby Anderson (11, Female), Thomas Anderson (father), parent presence and the existing art identities. No universal repair-age or legal-consent rule is introduced.

**C12 — Perioperative hair-preparation context for C1/C5/C10 surgery.** Existing clinical concept: `concept.variety3.surgical-hair-preparation`.

- **Avoiding unnecessary hair removal:** `claim.variety3.hair.no-routine-removal` → `source.variety3.shea-ssi-update-2023`.
- **Clippers when removal is needed:** `claim.variety3.hair.clippers-if-needed` → `source.variety3.shea-ssi-update-2023`.

Boundary: One SHEA/IDSA/APIC guideline, acute-care scope; existing ambulatory application needs clinician review. No genital-field extrapolation, exact preparation timetable or numerical SSI reduction. C12 is a care context attached to a catalog diagnosis, not an additional diagnosis.

## NEEDS SOURCE gaps and withheld additions

- **NEEDS SOURCE — metastatic colon-cancer treatment and real biologic effects.** The admitted colon claims used here cover confirmation and localized resection, not a metastatic regimen, molecular eligibility, antibody mechanism, recurrence/survival benefit or patient-specific prognosis. Those additions are left out; sample 1’s antibody protocol and numerical results are explicitly invented.
- **NEEDS SOURCE — retained surgical sponge.** No matching authored clinical condition or atomic clinical claim was found in the exported catalog or the clinical source-file text search. Swallowed esophageal foreign bodies and retained-antrum syndrome are different conditions. Sample 7 therefore uses the existing recognized-enterotomy scenario during incisional-hernia repair.
- **NEEDS SOURCE — real performance of a named drug, test, device or trial.** Do not transfer these synthetic cells to FIT, mammography, PSA, CEA, a marketed biologic, CODA or another real named trial. A source record’s existence is not an atomic claim supporting a new exact value. No new breast blood-screening indication, validated mass-workup substitute, personal PPV or real prevalence is taught.
- **NEEDS SOURCE — additional management detail beyond the listed anchors.** This document omits a selected antibiotics-only appendicitis regimen, a safe-discharge rule, precise delay-to-operation limit, transfusion threshold, blood-conservation protocol or real complication percentage. General informed-refusal claims already exist; an individual’s explicit transfusion preference could use those without assuming the beliefs of every member of a religion.
- **NEEDS SOURCE — pediatric/legal extensions.** Universal child consent/refusal rules, adolescent confidentiality and a universal hernia repair age are not added. Existing pediatric disagreement/withheld boundaries and dated-source limitations remain. Adult surrogate, consent, confidentiality and DNR guidance still require the applicable institutional and jurisdictional context.
- **Catalog-scope check, retained:** the ARR/NNT claim’s current limitation names a 30-day horizon. Sample 1 keeps that horizon and uses a concrete readmission endpoint. A longer-horizon synthetic example would require claim-metadata alignment in the later content lane; it must not quietly become an asserted cancer-recurrence or survival estimate.
- **No new source request for the eight samples as written.** Every asserted clinical teaching point resolves to the existing bindings above. Fictional patient findings, study protocols and constructed intervention results are identified as case/study stipulations, with no inference of an established treatment effect. All eight samples remain pending owner/manager tone review and named clinician review.
