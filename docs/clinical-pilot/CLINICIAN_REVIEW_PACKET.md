# Clinician review packet

Status: AI-assisted draft, `needs_clinician_review`

Content version: `pilot.2026-07-29.4`

This packet is generated from the versioned pilot registry. It is a review artifact, not clinical approval or medical guidance. Every explanation and distractor rationale is original draft wording. Source prose, tables, algorithms, figures, and question stems are not reproduced.

The deterministic examples use fixed review seeds chosen to expose every phenotype and demonstrate disease-independent demographic variety. They are not prevalence samples.

## Pilot inventory

- Diagnosis families: 5
- Phenotypes: 15
- Concepts: 15
- Question variants: 30
- Encounter templates: 15
- Evidence claims: 32
- Sources: 21

## Claim-to-source matrix

| Claim ID | Independently written claim | Category / certainty | Source IDs | Limitation |
|---|---|---|---|---|
| `claim.laceration.preclosure_assessment` | Before routine repair of a hand laceration, evaluate the wound's mechanism, location, depth, contamination, possible foreign material, and distal motor and sensory function. | evaluation; moderate | `src.wses.traumatic_wounds.2016` | The source is an older Delphi paper and gives the most explicit tendon and nerve guidance for hand wounds. |
| `claim.laceration.foreign_material` | Visible contamination should be removed, and concern for retained material requires deliberate evaluation rather than blind closure. | evaluation; moderate | `src.wses.traumatic_wounds.2016` | Imaging choice depends on material and anatomy and is not a pilot teaching point. |
| `claim.laceration.tetanus_basis` | Wound category and vaccination history determine tetanus prophylaxis; antibiotics are not tetanus prophylaxis. | management; high | `src.cdc.tetanus_wound.2025` | None recorded |
| `claim.laceration.tetanus_matrix` | For an immunocompetent adult with a completed primary series, a clean minor wound calls for a booster at ten or more years since the last dose, while a dirty or major wound calls for a booster at five or more years; TIG is not indicated for either finite profile. | management; high | `src.cdc.tetanus_wound.2025` | Unknown or incomplete vaccination histories and immune-deficiency exceptions require additional rules not scored here. |
| `claim.laceration.deep_injury_escalation` | A hand wound with abnormal active tendon function or a new distal sensory deficit is outside the simple-laceration phenotype and should not proceed as routine clinic closure. | safety_boundary; moderate | `src.wses.traumatic_wounds.2016` | The exact referral destination depends on local capability and requires clinician review. |
| `claim.abscess.localized_collection` | An uncomplicated cutaneous abscess is a localized purulent collection without suspected deep extension, extensive surrounding inflammation, or systemic illness. | definition; moderate | `src.wses.ssti_pathways.2022`, `src.cdc.mrsa_overview.2025` | No single surface finding establishes a collection with perfect accuracy. |
| `claim.abscess.drainage_primary` | Source control by incision and drainage is the central treatment for a drainable uncomplicated cutaneous abscess. | management; high | `src.wses.ssti_pathways.2022`, `src.cdc.mrsa_overview.2025` | This does not establish the setting, anesthesia, packing, culture, or adjunct-antibiotic plan. |
| `claim.abscess.no_collection_no_incision` | Diffuse nonpurulent inflammation without a focal collection does not provide a target for incision and drainage. | management; moderate | `src.wses.ssti_pathways.2022` | When examination is uncertain, ultrasound may be useful where available; this clinic does not substitute plain radiography. |
| `claim.abscess.escalation_features` | Rapid progression, extensive spread, hemodynamic disturbance, suspected deep involvement, necrosis, or systemic illness moves a purulent infection outside the simple-abscess pathway. | safety_boundary; moderate | `src.wses.ssti_pathways.2022` | The pilot does not teach a numerical threshold or medication regimen. |
| `claim.abscess.adjunct_uncertainty` | Some abscess presentations need treatment beyond drainage alone, so this pilot does not teach that antibiotics are always required or never useful. | management; conflicting | `src.wses.ssti_pathways.2022`, `src.bmj.abscess_rr.2018` | Drug selection, threshold, duration, and trade-offs are intentionally withheld. |
| `claim.biliary.stable_pattern` | Gallbladder stones may produce episodic upper abdominal pain with nausea or vomiting; fever is not part of the uncomplicated stable phenotype. | presentation; moderate | `src.jsge.cholelithiasis.2023` | The pilot does not impose a rigid pain-duration rule or demographic stereotype. |
| `claim.biliary.ultrasound_evaluation` | Stable symptoms suggestive of gallbladder stones are evaluated with formal abdominal ultrasound and appropriate blood testing. | evaluation; high | `src.jsge.cholelithiasis.2023` | The exact laboratory panel and test timing are not scored in this pilot. |
| `claim.biliary.no_xray_substitution` | Plain abdominal radiography should not replace formal ultrasound when gallstone disease is suspected. | safety_boundary; high | `src.jsge.cholelithiasis.2023`, `src.acr.ruq_pain.2022` | ACR material is used only for targeted factual verification and citation. |
| `claim.biliary.elective_evaluation` | A stable adult with symptomatic, image-confirmed gallstones and no urgent features warrants elective specialist evaluation rather than emergency transfer or no follow-up. | disposition; high | `src.jsge.cholelithiasis.2023`, `src.nihr.cgall.2024` | This teaches referral and shared evaluation, not that every patient must undergo surgery. |
| `claim.biliary.management_uncertainty` | Guidelines commonly recommend laparoscopic cholecystectomy, while randomized evidence supports discussing short-term conservative management for selected uncomplicated patients; longer-term comparative outcomes remain uncertain. | management; conflicting | `src.jsge.cholelithiasis.2023`, `src.nihr.cgall.2024` | The pilot therefore does not score automatic surgery for every stable patient. |
| `claim.biliary.red_flags` | Fever, jaundice, persistent or worsening pain, peritoneal findings, or physiologic disturbance make an uncomplicated biliary-colic label unsafe and require urgent evaluation for a complication. | safety_boundary; moderate | `src.jsge.cholelithiasis.2023`, `src.wses.acute_cholecystitis.2020` | This is a conservative outpatient-triage synthesis; it does not diagnose a specific complication. |
| `claim.physiology.resting_adult_ranges` | For this pilot's stable adult overlays, heart rate, paired blood pressure, and oral temperature are sampled only within openly published resting-adult reference bounds. | evaluation; moderate | `src.oer.boundless_cardiac_physiology.2017`, `src.oer.nicolet_vital_signs.2022` | The overlays use narrower editorial subsets of the source ranges and do not define patient-specific normality, acuity, or treatment thresholds. |
| `claim.physiology.oxygen_saturation_range` | The pilot's room-air oxygen-saturation values remain within the open nursing reference target range for adults without chronic respiratory disease. | evaluation; moderate | `src.oer.nicolet_vital_signs.2022` | Pulse oximetry is an estimate and individual baselines, measurement conditions, altitude, and respiratory disease can change interpretation; those exceptions are excluded here. |
| `claim.inguinal.definition` | An inguinal hernia is protrusion of intra-abdominal tissue through the inguinal canal and commonly presents as a groin bulge. | definition; high | `src.hernia.herniasurge_2018` | None recorded |
| `claim.inguinal.clinical-diagnosis` | A classic inguinal hernia can usually be identified from history and physical examination; routine imaging is not required for every clear presentation. | evaluation; moderate | `src.hernia.herniasurge_2018` | Occult, recurrent, complex, or diagnostically uncertain groin findings may require imaging or specialist evaluation. |
| `claim.inguinal.symptomatic-referral` | A reducible inguinal hernia causing meaningful symptoms warrants elective surgical evaluation rather than indefinite unreviewed observation. | management; moderate | `src.hernia.herniasurge_2018` | The decision and timing of repair are individualized; this pilot ends at referral and does not teach operative technique. |
| `claim.inguinal.watchful-waiting-men` | Watchful waiting with safety-net instructions is a guideline-supported option for selected adult men whose inguinal hernia is asymptomatic or only minimally symptomatic. | management; high | `src.hernia.herniasurge_2018`, `src.hernia.herniasurge_2023` | Many patients eventually choose repair as symptoms progress; observation is an option rather than a promise that surgery will never be needed. |
| `claim.inguinal.watchful-waiting-boundary` | The watchful-waiting evidence for minimally symptomatic men should not be generalized to all adults with groin hernias, particularly women, patients with meaningful symptoms, or patients with acute irreducibility. | safety_boundary; high | `src.hernia.herniasurge_2018`, `src.hernia.herniasurge_2023` | Individual specialist decisions may differ; the pilot teaches only the well-supported population boundary. |
| `claim.inguinal.acute-irreducibility` | A newly painful, acutely nonreducible groin hernia requires urgent surgical-capable evaluation because obstruction or strangulation may be present. | disposition; high | `src.hernia.herniasurge_2023` | This outpatient pilot does not teach manual reduction, operative management, or definitive diagnosis of strangulation. |
| `claim.inguinal.red-flag-context` | Escalating pain, vomiting, abdominal distension, inability to pass stool or flatus, skin changes over the bulge, peritoneal findings, or systemic illness increase concern for an urgent hernia complication. | safety_boundary; moderate | `src.hernia.herniasurge_2023` | No single listed feature independently proves strangulation; the combined clinical context determines urgency. |
| `claim.inguinal.terminology` | Current HerniaSurge terminology distinguishes acutely irreducible, chronically irreducible, and strangulated hernias instead of using 'incarcerated' without qualification. | definition; high | `src.hernia.herniasurge_2023` | Legacy terminology remains common in clinical communication and source literature. |
| `claim.appendicitis.definition` | Acute appendicitis is inflammation of the appendix and can progress to serious intra-abdominal complications if not evaluated and treated promptly. | definition; high | `src.appendicitis.niddk_definition` | The pilot represents suspected appendicitis in an outpatient clinic, not a confirmed postoperative diagnosis. |
| `claim.appendicitis.typical-pattern` | A typical appendicitis pattern includes worsening abdominal pain that may begin centrally and migrate to the right lower quadrant, often with focal tenderness and possible anorexia, nausea, vomiting, or fever. | presentation; high | `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms` | Not every patient has migration, fever, vomiting, or the complete classic pattern. |
| `claim.appendicitis.pattern-not-diagnostic` | History and examination can establish concern for appendicitis, but an individual symptom or examination finding does not by itself confirm or exclude the diagnosis. | evaluation; high | `src.appendicitis.swedish_2025`, `src.appendicitis.wses_2020`, `src.appendicitis.sages_2024` | Risk scores, laboratory tests, and imaging may refine probability in an appropriately equipped setting. |
| `claim.appendicitis.outpatient-urgent-evaluation` | When outpatient history and examination create meaningful concern for acute appendicitis, the patient should receive prompt emergency-department or surgical-capable evaluation rather than delayed routine clinic follow-up. | disposition; high | `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms` | The Swedish primary-care recommendation incorporates CRP when available; this pilot does not require a test the clinic lacks. |
| `claim.appendicitis.imaging-context` | Appropriate imaging can refine the diagnosis of suspected appendicitis, but modality selection depends on patient factors and available expertise and should occur in a setting capable of completing the urgent evaluation. | evaluation; high | `src.appendicitis.swedish_2025`, `src.appendicitis.wses_2020`, `src.appendicitis.acr_rlq_2022`, `src.appendicitis.sages_2024` | This pilot is restricted to nonpregnant adults and does not teach a complete modality algorithm. |
| `claim.appendicitis.no-plain-xray` | Plain abdominal radiography is not an appropriate substitute for CT, ultrasound, or MRI when evaluating suspected appendicitis. | safety_boundary; moderate | `src.appendicitis.acr_rlq_2022` | This exact modality comparison relies on one current specialty imaging guideline and requires focused clinician review. |

## Simple traumatic laceration

Family ID: `traumatic_laceration`

Scope: Adult traumatic skin wounds suitable for initial outpatient assessment, with deeper injury treated as an exclusion or referral warning.

Explicit exclusions: bites; puncture wounds; grossly contaminated or infected wounds; uncontrolled hemorrhage; fracture; definitive tendon, nerve, or vascular injury.

### Phenotypes and capability requirements

| Tier | Phenotype | Acuity | Required capabilities | Allowed dispositions | Editorial simulation weight |
|---|---|---|---|---|---|
| Level 0 | `phenotype.laceration.clean-superficial.l0` - Clean superficial laceration | stable | `capability.examination` | clinic_treatment | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |
| Level 1 | `phenotype.laceration.tetanus-decision.l1` - Laceration with a tetanus prophylaxis decision | stable | `capability.examination` | clinic_treatment, procedural_referral | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |
| Level 1 | `phenotype.laceration.deep-structure-concern.l1` - Hand laceration with deeper-structure concern | urgent_stable | `capability.examination` | prompt_specialty_referral | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |

### Deterministic generated examples

#### Level 0: Clean superficial laceration

- Template: `case.prototype.tutorial-laceration`
- Seed: `review-1`
- Patient: 34 years; Male; BMI 23.0; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.stable-a`
- Vitals: HR 89; BP 117/78; temperature 97.9 F; SpO2 98%
- Findings: clean superficial hand laceration; controlled bleeding; recent sharp-object mechanism
- Presentation: A stable adult presents with a recent uncomplicated cut. The wound has not yet been anesthetized or closed. Documented findings include clean superficial hand laceration, controlled bleeding, and recent sharp-object mechanism.
- Selected question variants: `question.laceration.preclosure-assessment.v1`

1. **Before deciding whether to close this clean superficial hand wound, what should be done first?**
   - Primary concept: `concept.laceration.preclosure-assessment`
   - Correct answer: Assess wound depth and distal motor-sensory function before closure

#### Level 1: Laceration with a tetanus prophylaxis decision

- Template: `case.pilot.laceration-tetanus`
- Seed: `review-0`
- Patient: 50 years; Female; BMI 33.1; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.stable-a`
- Vitals: HR 60; BP 100/69; temperature 99.0 F; SpO2 97%
- Findings: superficial wound; completed primary tetanus series documented; date of last tetanus dose available; controlled bleeding
- Presentation: A stable adult presents with a superficial wound, controlled bleeding, and an available vaccination record. Documented findings include superficial wound, completed primary tetanus series documented, date of last tetanus dose available, and controlled bleeding.
- Selected question variants: `question.laceration.tetanus.v2`

1. **This superficial wound is dirty. The patient completed the primary tetanus series and the last tetanus-containing dose was 6 years ago. What should be arranged?**
   - Primary concept: `concept.prototype.laceration.tetanus`
   - Correct answer: Give a tetanus-containing booster; TIG is not indicated

#### Level 1: Hand laceration with deeper-structure concern

- Template: `case.pilot.laceration-deep-structure`
- Seed: `review-1`
- Patient: 41 years; Female; BMI 22.9; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.urgent-but-stable-a`
- Vitals: HR 93; BP 120/65; temperature 98.7 F; SpO2 96%
- Findings: hand laceration; new difficulty actively moving one finger; controlled bleeding
- Presentation: A stable adult presents after a hand laceration with a newly abnormal distal functional examination. Documented findings include hand laceration, new difficulty actively moving one finger, and controlled bleeding.
- Selected question variants: `question.laceration.deep-structure-referral.v2`

1. **A stable patient with a hand laceration has new loss of active finger flexion. How should this be managed from the prototype clinic?**
   - Primary concept: `concept.laceration.deep-structure-referral`
   - Correct answer: Treat the active-motion deficit as possible tendon injury and arrange prompt higher-level evaluation


### Concepts and question variants

#### Pre-closure laceration assessment

- Concept ID: `concept.laceration.preclosure-assessment`
- Learning objective: Evaluate wound depth, contamination, foreign material risk, and distal structural function before routine closure.
- Educational tier: Level 0
- Correct action: Assess the wound and document distal motor and sensory function before selecting repair.
- Disposition: `clinic_treatment`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.laceration.preclosure_assessment`, `claim.laceration.foreign_material`
- Supporting sources: `src.wses.traumatic_wounds.2016`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.laceration.preclosure-assessment.v1

**Question:** Before deciding whether to close this clean superficial hand wound, what should be done first?

**Correct answer:** Assess wound depth and distal motor-sensory function before closure

**Explanation:** Routine repair begins with a deliberate wound and distal-function assessment. This case is simple only after deeper injury, contamination, and retained material concerns are excluded.

**Distractor rationales:**

- Close the skin immediately without a structural examination: Immediate closure skips the assessment needed to detect contamination, foreign material, or deeper injury.
- Give antibiotics and use that response to exclude tendon or nerve injury: Antibiotics do not evaluate wound depth or distal tendon and nerve function.
- Review vaccination history but omit wound exploration and the distal examination: Vaccination review is separate from the wound and distal-function assessment required before routine repair.

Supporting claim IDs: `claim.laceration.preclosure_assessment`, `claim.laceration.foreign_material`

Supporting source IDs: `src.wses.traumatic_wounds.2016`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.laceration.preclosure-assessment.v2

**Question:** A stable adult has a small clean hand cut. Which step belongs before anesthesia or routine closure?

**Correct answer:** Inspect and explore as appropriate, then record active motion and distal sensation

**Explanation:** The examination should establish the wound's extent and distal tendon and nerve status before routine closure proceeds.

**Distractor rationales:**

- Suture first and check hand function only if symptoms appear later: Closing first can obscure or delay recognition of a deeper structural injury.
- Use one antibiotic dose as proof that the wound is superficial: An antibiotic dose cannot establish wound depth or intact tendon and nerve function.
- Check only passive movement and omit active tendon and sensory testing: Passive movement alone does not establish intact active tendon function or a complete distal examination.

Supporting claim IDs: `claim.laceration.preclosure_assessment`, `claim.laceration.foreign_material`

Supporting source IDs: `src.wses.traumatic_wounds.2016`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Laceration tetanus prophylaxis

- Concept ID: `concept.prototype.laceration.tetanus`
- Learning objective: Apply the CDC wound-category and vaccination-history matrix without using antibiotics as tetanus prophylaxis.
- Educational tier: Level 1
- Correct action: Provide or arrange the indicated tetanus vaccine booster without TIG for the finite completed-series profiles.
- Disposition: `clinic_treatment`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.laceration.tetanus_basis`, `claim.laceration.tetanus_matrix`
- Supporting sources: `src.cdc.tetanus_wound.2025`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.laceration.tetanus.v1

**Question:** This is a clean minor wound. The patient completed the primary tetanus series and last received a tetanus-containing vaccine 11 years ago. What prophylaxis is indicated?

**Correct answer:** Give or arrange a tetanus-containing vaccine booster; TIG is not indicated

**Explanation:** For a clean minor wound after a completed primary series, ten or more years since the last dose calls for a booster; TIG is not used for clean minor wounds.

**Distractor rationales:**

- No tetanus prophylaxis is needed because the primary series was completed: A completed series does not remove the booster indication for a clean minor wound when ten or more years have elapsed.
- Give TIG alone and withhold the vaccine: TIG is not indicated for a clean minor wound, and it does not replace an indicated booster.
- Use antibiotics instead of vaccination: Antibiotics are not tetanus prophylaxis.

Supporting claim IDs: `claim.laceration.tetanus_basis`, `claim.laceration.tetanus_matrix`

Supporting source IDs: `src.cdc.tetanus_wound.2025`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.laceration.tetanus.v2

**Question:** This superficial wound is dirty. The patient completed the primary tetanus series and the last tetanus-containing dose was 6 years ago. What should be arranged?

**Correct answer:** Give a tetanus-containing booster; TIG is not indicated

**Explanation:** For a dirty or major wound after a completed primary series, five or more years since the last dose calls for a booster. This finite profile does not call for TIG.

**Distractor rationales:**

- Wait until ten years have elapsed because every wound uses the same interval: Dirty or major wounds use the five-year booster interval after a completed primary series.
- Give TIG alone because every dirty wound requires TIG: TIG is not automatically indicated for every dirty wound and does not replace an indicated booster.
- Use systemic antibiotics as the tetanus-prevention plan: Antibiotics do not prevent tetanus.

Supporting claim IDs: `claim.laceration.tetanus_basis`, `claim.laceration.tetanus_matrix`

Supporting source IDs: `src.cdc.tetanus_wound.2025`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Laceration deeper-structure referral

- Concept ID: `concept.laceration.deep-structure-referral`
- Learning objective: Recognize a hand laceration with an abnormal active-tendon examination as outside routine clinic closure.
- Educational tier: Level 1
- Correct action: Stop routine closure and arrange prompt specialist-capable tendon evaluation.
- Disposition: `prompt_specialty_referral`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.laceration.deep_injury_escalation`
- Supporting sources: `src.wses.traumatic_wounds.2016`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.laceration.deep-structure-referral.v1

**Question:** A hand laceration has controlled bleeding, but the patient cannot actively flex the affected digit. What is the safest next step?

**Correct answer:** Do not treat it as a simple closure; arrange prompt higher-level tendon evaluation

**Explanation:** An active-motion deficit makes this a possible tendon injury, not the simple laceration phenotype. Prompt higher-level evaluation is required before routine closure.

**Distractor rationales:**

- Close the skin routinely and defer the motion deficit to a distant follow-up: Abnormal active motion raises concern for deeper structural injury that should be evaluated before routine closure.
- Close the skin and defer the abnormal active-motion finding to a routine later visit: Routine closure and delayed review can postpone evaluation of a possible tendon injury.
- Prescribe antibiotics as treatment for the motion deficit: Antibiotics do not evaluate or repair a suspected tendon injury.

Supporting claim IDs: `claim.laceration.deep_injury_escalation`

Supporting source IDs: `src.wses.traumatic_wounds.2016`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.laceration.deep-structure-referral.v2

**Question:** A stable patient with a hand laceration has new loss of active finger flexion. How should this be managed from the prototype clinic?

**Correct answer:** Treat the active-motion deficit as possible tendon injury and arrange prompt higher-level evaluation

**Explanation:** New loss of active finger flexion is a deeper-structure warning. The clinic should not proceed as though this were a simple closure.

**Distractor rationales:**

- Perform routine closure without addressing the active-motion deficit: A new active-motion deficit makes routine simple closure inappropriate until deeper injury is evaluated.
- Reassure the patient because bleeding is controlled despite the new motion deficit: Controlled bleeding does not resolve a new active-motion deficit or make routine closure appropriate.
- Use antibiotics to restore active finger flexion: Antibiotics do not address a possible tendon laceration.

Supporting claim IDs: `claim.laceration.deep_injury_escalation`

Supporting source IDs: `src.wses.traumatic_wounds.2016`

Review status: `needs clinician review`; last clinician review: none recorded.


## Uncomplicated cutaneous abscess

Family ID: `cutaneous_abscess`

Scope: A superficial, accessible, localized purulent skin collection in an otherwise stable adult.

Explicit exclusions: perirectal or other special-site disease; hidradenitis or pilonidal disease; recurrent disease; immunocompromise; suspected deep or necrotizing infection; detailed antibiotic selection.

### Phenotypes and capability requirements

| Tier | Phenotype | Acuity | Required capabilities | Allowed dispositions | Editorial simulation weight |
|---|---|---|---|---|---|
| Level 0 | `phenotype.abscess.localized-fluctuant.l0` - Localized fluctuant cutaneous abscess | stable | `capability.examination` | procedural_referral | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |
| Level 1 | `phenotype.abscess.nonpurulent-differential.l1` - Nonpurulent inflammation without a drainage target | stable | `capability.examination` | clinic_treatment | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |
| Level 1 | `phenotype.abscess.rapid-spread.l1` - Purulent infection with rapid spread | urgent_stable | `capability.examination` | emergency_department_transfer | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |

### Deterministic generated examples

#### Level 0: Localized fluctuant cutaneous abscess

- Template: `case.prototype.abscess`
- Seed: `review-0`
- Patient: 44 years; Male; BMI 21.0; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.stable-a`
- Vitals: HR 85; BP 110/69; temperature 98.5 F; SpO2 95%
- Findings: localized fluctuant superficial collection; accessible upper-back location; no systemic illness; visible purulent focus
- Presentation: A stable adult has one superficial, accessible, fluctuant skin collection without systemic illness or extensive spread. Documented findings include localized fluctuant superficial collection, accessible upper-back location, no systemic illness, and visible purulent focus.
- Selected question variants: `question.abscess.primary-treatment.v2`

1. **A stable adult has a localized fluctuant upper-back collection with a purulent focus and no systemic illness. Which plan addresses the collection itself?**
   - Primary concept: `concept.prototype.abscess.primary-treatment`
   - Correct answer: Arrange source control with incision and drainage where the procedure can be performed safely

#### Level 1: Nonpurulent inflammation without a drainage target

- Template: `case.pilot.abscess-nonpurulent-differential`
- Seed: `review-2`
- Patient: 31 years; Female; BMI 30.8; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.stable-a`
- Vitals: HR 65; BP 100/68; temperature 98.8 F; SpO2 95%
- Findings: diffuse erythema and warmth; no focal fluctuance, drainage, or palpable cavity; diffuse tenderness
- Presentation: A stable adult has diffuse nonpurulent skin inflammation without a focal collection on examination. Documented findings include diffuse erythema and warmth, no focal fluctuance, drainage, or palpable cavity, and diffuse tenderness.
- Selected question variants: `question.abscess.collection-vs-cellulitis.v1`

1. **The area is broad, flat, warm, and red, with no fluctuance, drainage, pustular focus, or palpable cavity. What should happen next?**
   - Primary concept: `concept.abscess.collection-vs-cellulitis`
   - Correct answer: Do not perform routine abscess drainage; evaluate this through the nonpurulent skin-infection pathway

#### Level 1: Purulent infection with rapid spread

- Template: `case.pilot.abscess-rapid-spread`
- Seed: `review-1`
- Patient: 33 years; Male; BMI 29.7; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.urgent-but-stable-a`
- Vitals: HR 97; BP 116/64; temperature 97.7 F; SpO2 95%
- Findings: suspected purulent collection; rapidly progressive extensive surrounding inflammation; subjective chills
- Presentation: A stable adult has a suspected purulent skin collection with rapidly expanding surrounding inflammation. Documented findings include suspected purulent collection, rapidly progressive extensive surrounding inflammation, and subjective chills.
- Selected question variants: `question.abscess.rapid-spread-escalation.v1`

1. **A suspected abscess now has rapidly expanding surrounding inflammation and pain beyond the focal collection. What is the safest disposition from this clinic?**
   - Primary concept: `concept.abscess.rapid-spread-escalation`
   - Correct answer: Arrange prompt emergency or hospital-capable evaluation


### Concepts and question variants

#### Drainable abscess source control

- Concept ID: `concept.prototype.abscess.primary-treatment`
- Learning objective: Arrange incision and drainage in an appropriately equipped setting for a classic uncomplicated drainable abscess.
- Educational tier: Level 0
- Correct action: Arrange incision and drainage in an appropriately equipped setting.
- Disposition: `procedural_referral`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.abscess.localized_collection`, `claim.abscess.drainage_primary`
- Supporting sources: `src.wses.ssti_pathways.2022`, `src.cdc.mrsa_overview.2025`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.abscess.primary-treatment.v1

**Question:** What is the central treatment for this localized, fluctuant, uncomplicated cutaneous abscess?

**Correct answer:** Arrange incision and drainage in an appropriately equipped setting

**Explanation:** This finite phenotype is superficial, accessible, fluctuant, and uncomplicated. Its central treatment is incision and drainage in a setting that can safely perform it.

**Distractor rationales:**

- Use antibiotics alone as a substitute for source control: Antibiotics alone leave the drainable collection without source control.
- Observe indefinitely without a drainage plan: Observation alone does not provide source control for this explicitly drainable collection.
- Attempt only manual expression and discharge without arranging drainage: Manual expression is not the authored source-control plan for this drainable collection.

Supporting claim IDs: `claim.abscess.localized_collection`, `claim.abscess.drainage_primary`

Supporting source IDs: `src.wses.ssti_pathways.2022`, `src.cdc.mrsa_overview.2025`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.abscess.primary-treatment.v2

**Question:** A stable adult has a localized fluctuant upper-back collection with a purulent focus and no systemic illness. Which plan addresses the collection itself?

**Correct answer:** Arrange source control with incision and drainage where the procedure can be performed safely

**Explanation:** The classic focal collection requires drainage. Adjunct-antibiotic details are deliberately not scored in this pilot.

**Distractor rationales:**

- Choose medication alone and leave the collection undrained: Medication alone does not provide source control for the authored drainable collection.
- Provide no treatment because the patient is currently stable: Stable physiology does not eliminate the need to address a drainable abscess.
- Use dressing changes alone and omit a source-control plan: Dressing changes do not provide source control for the documented drainable collection.

Supporting claim IDs: `claim.abscess.localized_collection`, `claim.abscess.drainage_primary`

Supporting source IDs: `src.wses.ssti_pathways.2022`, `src.cdc.mrsa_overview.2025`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Abscess versus nonpurulent inflammation

- Concept ID: `concept.abscess.collection-vs-cellulitis`
- Learning objective: Avoid routine abscess incision when examination shows diffuse nonpurulent inflammation without a focal collection.
- Educational tier: Level 1
- Correct action: Do not incise; continue evaluation through a nonpurulent skin-infection pathway.
- Disposition: `clinic_treatment`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.abscess.localized_collection`, `claim.abscess.no_collection_no_incision`
- Supporting sources: `src.wses.ssti_pathways.2022`, `src.cdc.mrsa_overview.2025`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.abscess.collection-vs-cellulitis.v1

**Question:** The area is broad, flat, warm, and red, with no fluctuance, drainage, pustular focus, or palpable cavity. What should happen next?

**Correct answer:** Do not perform routine abscess drainage; evaluate this through the nonpurulent skin-infection pathway

**Explanation:** No focal purulent collection is present in this authored phenotype, so routine incision and drainage has no target. Cellulitis remains a differential rather than a full pilot entry.

**Distractor rationales:**

- Incise the center even though no focal collection is identified: Diffuse redness without a focal collection does not provide a drainage target.
- Wait for spontaneous drainage before evaluating the diffuse inflammation: The absence of a drainage target redirects the current evaluation; it does not justify waiting without a nonpurulent-infection assessment.
- Call it an abscess but provide no evaluation or safety net: The presentation needs a nonpurulent skin-infection assessment rather than an unsupported label.

Supporting claim IDs: `claim.abscess.localized_collection`, `claim.abscess.no_collection_no_incision`

Supporting source IDs: `src.wses.ssti_pathways.2022`, `src.cdc.mrsa_overview.2025`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.abscess.collection-vs-cellulitis.v2

**Question:** A stable patient has diffuse tender erythema without a focal center, purulence, or palpable fluid cavity. Which statement best fits the drainage decision?

**Correct answer:** No drainage target; use the nonpurulent evaluation pathway

**Explanation:** The primary concept is whether there is a focal collection to drain. This case intentionally lacks one.

**Distractor rationales:**

- Every red tender area should be incised as an abscess: Redness and tenderness alone do not establish a localized pus collection.
- Treat tenderness alone as proof of a hidden abscess: Tenderness without a focal purulent finding does not establish a drainage target.
- No further assessment is needed because fluctuation is absent: Absence of a drainage target redirects the evaluation; it does not make diffuse inflammation irrelevant.

Supporting claim IDs: `claim.abscess.localized_collection`, `claim.abscess.no_collection_no_incision`

Supporting source IDs: `src.wses.ssti_pathways.2022`, `src.cdc.mrsa_overview.2025`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Abscess risk-feature escalation

- Concept ID: `concept.abscess.rapid-spread-escalation`
- Learning objective: Recognize rapid or extensive spread as exceeding the uncomplicated clinic abscess pathway.
- Educational tier: Level 1
- Correct action: Arrange prompt emergency or hospital-capable evaluation instead of isolated routine clinic drainage.
- Disposition: `emergency_department_transfer`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.abscess.escalation_features`, `claim.abscess.adjunct_uncertainty`
- Supporting sources: `src.wses.ssti_pathways.2022`, `src.bmj.abscess_rr.2018`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.abscess.rapid-spread-escalation.v1

**Question:** A suspected abscess now has rapidly expanding surrounding inflammation and pain beyond the focal collection. What is the safest disposition from this clinic?

**Correct answer:** Arrange prompt emergency or hospital-capable evaluation

**Explanation:** Rapid progression and extensive spread are incompatible with the uncomplicated phenotype. The pilot ends at prompt higher-capability evaluation and does not score a medication regimen.

**Distractor rationales:**

- Treat it as an isolated uncomplicated abscess with routine drainage alone: Rapid extensive spread moves the case outside the simple-abscess pathway and may require more than isolated drainage.
- Schedule a routine visit in several weeks: Routine delayed follow-up under-triages a rapidly progressive infection.
- Wait for a routine culture result before deciding whether to escalate: A pending routine result should not delay higher-level evaluation of rapid extensive spread.

Supporting claim IDs: `claim.abscess.escalation_features`, `claim.abscess.adjunct_uncertainty`

Supporting source IDs: `src.wses.ssti_pathways.2022`, `src.bmj.abscess_rr.2018`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.abscess.rapid-spread-escalation.v2

**Question:** The area around a purulent focus has expanded quickly since yesterday and the pain now extends well beyond it. The patient is not in shock. What should the outpatient clinic do?

**Correct answer:** Escalate now for hospital-capable assessment and source-control planning

**Explanation:** This is urgent because of rapid spread, even though the physiology overlay remains stable. Higher-level evaluation should not be delayed.

**Distractor rationales:**

- Assume stability makes routine office drainage alone sufficient: Preserved physiology does not erase the authored rapid-progression warning.
- Wait for spontaneous drainage before reassessing: Waiting can delay evaluation of an infection that is already progressing rapidly.
- Complete routine office treatment and reassess the rapid spread at a later visit: Delayed reassessment under-triages an infection that is already progressing rapidly.

Supporting claim IDs: `claim.abscess.escalation_features`, `claim.abscess.adjunct_uncertainty`

Supporting source IDs: `src.wses.ssti_pathways.2022`, `src.bmj.abscess_rr.2018`

Review status: `needs clinician review`; last clinician review: none recorded.


## Symptomatic cholelithiasis presenting as biliary colic

Family ID: `symptomatic_cholelithiasis`

Scope: Stable episodic symptoms attributed to gallbladder stones, separated from suspected acute biliary complications.

Explicit exclusions: acute cholecystitis; choledocholithiasis; cholangitis; pancreatitis; peritonitis; definitive inpatient treatment.

### Phenotypes and capability requirements

| Tier | Phenotype | Acuity | Required capabilities | Allowed dispositions | Editorial simulation weight |
|---|---|---|---|---|---|
| Level 0 | `phenotype.biliary.known-stones-stable.l0` - Stable biliary symptoms with known gallstones | stable | `capability.examination` | elective_surgical_referral | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |
| Level 1 | `phenotype.biliary.needs-ultrasound.l1` - Stable biliary symptoms needing formal ultrasound | stable | `capability.examination` | outpatient_testing | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |
| Level 1 | `phenotype.biliary.complication-red-flags.l1` - Biliary symptoms with complication red flags | urgent_stable | `capability.examination` | emergency_department_transfer | 1 (Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.) |

### Deterministic generated examples

#### Level 0: Stable biliary symptoms with known gallstones

- Template: `case.prototype.symptomatic-cholelithiasis`
- Seed: `review-0`
- Patient: 43 years; Female; BMI 26.4; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.stable-a`
- Vitals: HR 66; BP 118/74; temperature 98.3 F; SpO2 98%
- Findings: credible prior ultrasound showing gallstones; recurrent episodic compatible upper abdominal pain; currently stable and comfortable; nausea during prior attacks
- Presentation: A stable adult with gallstones demonstrated on a credible prior ultrasound reports recurrent compatible pain that has now resolved. Documented findings include credible prior ultrasound showing gallstones, recurrent episodic compatible upper abdominal pain, currently stable and comfortable, and nausea during prior attacks.
- Selected question variants: `question.cholelithiasis.stable-referral.v2`

1. **A patient with known gallstones has recurring compatible attacks but is currently comfortable, nonjaundiced, afebrile, and physiologically stable. Which disposition fits?**
   - Primary concept: `concept.prototype.cholelithiasis.management`
   - Correct answer: Plan elective specialist assessment with a shared management discussion

#### Level 1: Stable biliary symptoms needing formal ultrasound

- Template: `case.pilot.cholelithiasis-ultrasound`
- Seed: `review-1`
- Patient: 54 years; Male; BMI 23.2; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.stable-a`
- Vitals: HR 81; BP 119/74; temperature 98.2 F; SpO2 96%
- Findings: episodic upper abdominal pain that is currently resolved; no definitive prior gallbladder imaging; no fever, jaundice, or peritoneal tenderness; normal prior plain abdominal radiograph
- Presentation: A stable adult reports episodic biliary-type upper abdominal symptoms but has not had definitive gallbladder imaging. Documented findings include episodic upper abdominal pain that is currently resolved, no definitive prior gallbladder imaging, no fever, jaundice, or peritoneal tenderness, and normal prior plain abdominal radiograph.
- Selected question variants: `question.cholelithiasis.ultrasound-evaluation.v1`

1. **A stable adult has compatible episodic biliary symptoms, no prior definitive imaging, and no urgent features. What evaluation should be arranged?**
   - Primary concept: `concept.cholelithiasis.ultrasound-evaluation`
   - Correct answer: Arrange formal abdominal ultrasound with appropriate blood testing

#### Level 1: Biliary symptoms with complication red flags

- Template: `case.pilot.cholelithiasis-red-flags`
- Seed: `review-0`
- Patient: 43 years; Male; BMI 22.9; meaningful comorbidities 0
- Physiology overlay: `physiology.pilot.urgent-but-stable-a`
- Vitals: HR 87; BP 118/80; temperature 99.1 F; SpO2 96%
- Findings: credible prior ultrasound showing gallstones; persistent worsening right upper abdominal pain; new jaundice
- Presentation: A stable adult with gallstones documented on prior ultrasound now has persistent worsening pain and a new complication warning sign. Documented findings include credible prior ultrasound showing gallstones, persistent worsening right upper abdominal pain, and new jaundice.
- Selected question variants: `question.cholelithiasis.red-flag-transfer.v2`

1. **A patient with documented gallstones has pain that is now continuous and has developed new jaundice. Which disposition is appropriate?**
   - Primary concept: `concept.cholelithiasis.red-flag-transfer`
   - Correct answer: Transfer for immediate emergency and hospital-capable evaluation


### Concepts and question variants

#### Stable symptomatic gallstone referral

- Concept ID: `concept.prototype.cholelithiasis.management`
- Learning objective: Route a stable adult with image-confirmed symptomatic gallstones and no urgent features to elective specialist evaluation.
- Educational tier: Level 0
- Correct action: Arrange elective surgical or specialist evaluation and a management discussion.
- Disposition: `elective_surgical_referral`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.biliary.stable_pattern`, `claim.biliary.elective_evaluation`, `claim.biliary.management_uncertainty`
- Supporting sources: `src.jsge.cholelithiasis.2023`, `src.nihr.cgall.2024`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.cholelithiasis.stable-referral.v1

**Question:** Prior ultrasound confirmed gallstones. Recurrent compatible pain has resolved, and the patient is stable without fever, jaundice, persistent pain, or peritoneal findings. What is the next step?

**Correct answer:** Arrange elective specialist evaluation and discuss management

**Explanation:** This is stable symptomatic, image-confirmed gallstone disease without urgent features. Elective specialist evaluation is appropriate; the pilot does not claim that every patient must undergo surgery.

**Distractor rationales:**

- Send every stable pain-free patient to the emergency department: The authored case lacks acute complication features requiring emergency evaluation.
- Provide no follow-up because the pain has resolved: Recurrent symptomatic, image-confirmed gallstones warrant an elective management evaluation.
- Repeat plain abdominal radiographs before making a referral: Plain radiography is not an appropriate substitute for gallstone evaluation and the stones are already documented.

Supporting claim IDs: `claim.biliary.stable_pattern`, `claim.biliary.elective_evaluation`, `claim.biliary.management_uncertainty`

Supporting source IDs: `src.jsge.cholelithiasis.2023`, `src.nihr.cgall.2024`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.cholelithiasis.stable-referral.v2

**Question:** A patient with known gallstones has recurring compatible attacks but is currently comfortable, nonjaundiced, afebrile, and physiologically stable. Which disposition fits?

**Correct answer:** Plan elective specialist assessment with a shared management discussion

**Explanation:** Stable recurrent symptoms with previously demonstrated gallstones support elective evaluation rather than no follow-up or emergency transfer.

**Distractor rationales:**

- Treat the absence of current pain as an emergency by itself: Emergency transfer is not supported by the stable authored presentation without red flags.
- Close the chart with no planned follow-up: Recurring symptomatic disease should not be ignored even when the current attack has resolved.
- Use plain X-ray to decide whether the documented gallstones are real: Plain radiography does not replace the prior credible ultrasound.

Supporting claim IDs: `claim.biliary.stable_pattern`, `claim.biliary.elective_evaluation`, `claim.biliary.management_uncertainty`

Supporting source IDs: `src.jsge.cholelithiasis.2023`, `src.nihr.cgall.2024`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Appropriate gallstone evaluation

- Concept ID: `concept.cholelithiasis.ultrasound-evaluation`
- Learning objective: Arrange formal ultrasound-based evaluation for stable suspected gallstone disease without substituting plain radiography.
- Educational tier: Level 1
- Correct action: Arrange formal outpatient abdominal ultrasound and appropriate blood testing.
- Disposition: `outpatient_testing`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.biliary.ultrasound_evaluation`, `claim.biliary.no_xray_substitution`
- Supporting sources: `src.jsge.cholelithiasis.2023`, `src.acr.ruq_pain.2022`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.cholelithiasis.ultrasound-evaluation.v1

**Question:** A stable adult has compatible episodic biliary symptoms, no prior definitive imaging, and no urgent features. What evaluation should be arranged?

**Correct answer:** Arrange formal abdominal ultrasound with appropriate blood testing

**Explanation:** Formal abdominal ultrasound is the appropriate imaging basis for stable suspected gallstone disease. The clinic may arrange it externally but must not substitute plain X-ray.

**Distractor rationales:**

- Use the clinic's plain X-ray as the gallstone study: Plain radiography is not a substitute for formal ultrasound in suspected gallstone disease.
- Use CT as the routine first gallstone study instead of arranging ultrasound: Formal ultrasound, not routine first-line CT, is the evidence-supported imaging basis for this stable suspected presentation.
- Diagnose gallstones without arranging appropriate evaluation: Symptoms alone do not replace the appropriate imaging and laboratory evaluation.

Supporting claim IDs: `claim.biliary.ultrasound_evaluation`, `claim.biliary.no_xray_substitution`

Supporting source IDs: `src.jsge.cholelithiasis.2023`, `src.acr.ruq_pain.2022`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.cholelithiasis.ultrasound-evaluation.v2

**Question:** The clinic lacks ultrasound. A prior plain abdominal radiograph was normal, but the stable patient's episodic upper abdominal symptoms remain compatible with gallstones. What is the correct plan?

**Correct answer:** Arrange external formal ultrasound and appropriate clinical evaluation

**Explanation:** A stable patient can be routed for formal outpatient ultrasound. The available X-ray does not become appropriate merely because ultrasound is offsite.

**Distractor rationales:**

- Repeat plain radiography until gallstones appear: A normal or repeated plain radiograph does not replace formal ultrasound.
- Refer for gallstone surgery without first establishing gallstones by appropriate imaging: Compatible symptoms alone do not establish gallstones; appropriate ultrasound-based evaluation should come first.
- Stop evaluation because the clinic lacks the preferred test: The appropriate response to a missing clinic capability is an external evaluation pathway, not abandonment or substitution.

Supporting claim IDs: `claim.biliary.ultrasound_evaluation`, `claim.biliary.no_xray_substitution`

Supporting source IDs: `src.jsge.cholelithiasis.2023`, `src.acr.ruq_pain.2022`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Biliary complication red-flag transfer

- Concept ID: `concept.cholelithiasis.red-flag-transfer`
- Learning objective: Distinguish stable biliary symptoms from warning features requiring emergency evaluation.
- Educational tier: Level 1
- Correct action: Arrange immediate emergency-department or hospital-capable evaluation.
- Disposition: `emergency_department_transfer`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.biliary.red_flags`
- Supporting sources: `src.jsge.cholelithiasis.2023`, `src.wses.acute_cholecystitis.2020`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### question.cholelithiasis.red-flag-transfer.v1

**Question:** A patient with known gallstones now has persistent worsening right upper abdominal pain and new jaundice. What should this clinic do?

**Correct answer:** Arrange immediate hospital-capable evaluation

**Explanation:** Persistent worsening pain plus jaundice makes uncomplicated biliary colic an unsafe label. The outpatient case ends at emergency evaluation without assigning a definitive complication diagnosis.

**Distractor rationales:**

- Schedule only a routine elective visit several weeks away: New jaundice and persistent worsening pain are incompatible with an uncomplicated elective-only presentation.
- Obtain a plain X-ray and delay transfer until it is interpreted: Plain radiography is not the required acute biliary evaluation and should not delay escalation.
- Wait for the pain and jaundice to resolve before deciding: Waiting under-triages warning features of a possible biliary complication.

Supporting claim IDs: `claim.biliary.red_flags`

Supporting source IDs: `src.jsge.cholelithiasis.2023`, `src.wses.acute_cholecystitis.2020`

Review status: `needs clinician review`; last clinician review: none recorded.

##### question.cholelithiasis.red-flag-transfer.v2

**Question:** A patient with documented gallstones has pain that is now continuous and has developed new jaundice. Which disposition is appropriate?

**Correct answer:** Transfer for immediate emergency and hospital-capable evaluation

**Explanation:** Persistent pain with new jaundice is outside the uncomplicated phenotype and requires prompt emergency evaluation.

**Distractor rationales:**

- Keep the case on a routine elective pathway only: Persistent pain and new jaundice require urgent evaluation rather than an elective-only plan.
- Use plain abdominal radiography as definitive acute evaluation: Plain radiography cannot substitute for appropriate hospital-capable biliary evaluation.
- Send the patient home to see whether the jaundice disappears: A new jaundice warning sign should not be managed by delayed observation from this clinic.

Supporting claim IDs: `claim.biliary.red_flags`

Supporting source IDs: `src.jsge.cholelithiasis.2023`, `src.wses.acute_cholecystitis.2020`

Review status: `needs clinician review`; last clinician review: none recorded.


## Adult inguinal hernia

Family ID: `inguinal_hernia`

Scope: Adult, nonpregnant primary inguinal-hernia presentations for clinic recognition, elective referral, bounded watchful-waiting teaching, or emergency transfer.

Explicit exclusions: Femoral hernia as a completed diagnosis entry; Pediatric hernia; Pregnancy-influenced presentation; Recurrent or postoperative hernia; Complex scrotal hernia; Definitive operative treatment; Chronic post-repair pain.

### Phenotypes and capability requirements

| Tier | Phenotype | Acuity | Required capabilities | Allowed dispositions | Editorial simulation weight |
|---|---|---|---|---|---|
| Level 0 | `phenotype.inguinal-hernia.l0-reducible-symptomatic` - Reducible symptomatic inguinal hernia | stable | `capability.examination` | elective_surgical_referral | 1 (Editorial review weight for the uncomplicated phenotype; not a prevalence estimate.) |
| Level 1 | `phenotype.inguinal-hernia.l1-minimally-symptomatic-man` - Selected minimally symptomatic man considering observation | stable | `capability.examination` | watchful_waiting_with_safety_net, elective_surgical_referral | 0.55 (Editorial review weight for the bounded watchful-waiting concept; not claimed prevalence.) |
| Level 1 | `phenotype.inguinal-hernia.l1-acutely-irreducible` - Painful acutely irreducible groin hernia | urgent_stable | `capability.examination` | emergency_department_transfer | 0.45 (Editorial review weight for an urgent recognition case; not claimed prevalence.) |

### Deterministic generated examples

#### Level 0: Reducible symptomatic inguinal hernia

- Template: `case.pilot.inguinal-hernia-reducible-referral`
- Seed: `review-1`
- Patient: 34 years; Female; BMI 21.6; meaningful comorbidities 0
- Physiology overlay: `physiology.inguinal-hernia.stable-editorial`
- Vitals: HR 95; BP 106/73; temperature 98.1 F; SpO2 97%
- Findings: Prior clinical documentation identifies an inguinal hernia; Groin bulge that increases with standing or exertion; Bulge is readily reducible on examination; Recurring discomfort now limits lifting or exercise; Stable general appearance; Cough impulse
- Presentation: A 34-year-old woman with BMI 21.6 reports a documented inguinal hernia whose recurring discomfort now limits usual lifting or exercise. Findings: Prior clinical documentation identifies an inguinal hernia, Groin bulge that increases with standing or exertion, Bulge is readily reducible on examination, Recurring discomfort now limits lifting or exercise, Stable general appearance, and Cough impulse.
- Selected question variants: `variant.inguinal-hernia.reducible-referral.b`

1. **A known inguinal hernia remains soft and reducible, but increasing aching now limits routine activity. There is no vomiting, distension, skin change, or systemic illness. Choose the clinic disposition.**
   - Primary concept: `concept.inguinal-hernia.reducible-symptomatic-referral`
   - Correct answer: Refer for a nonemergency surgical consultation

#### Level 1: Selected minimally symptomatic man considering observation

- Template: `case.pilot.inguinal-hernia-watchful-waiting`
- Seed: `review-2`
- Patient: 45 years; Male; BMI 24.2; meaningful comorbidities 0
- Physiology overlay: `physiology.inguinal-hernia.stable-editorial`
- Vitals: HR 86; BP 113/79; temperature 98.6 F; SpO2 95%
- Findings: Adult man; Prior clinical documentation identifies an inguinal hernia; Groin bulge is reducible; No pain limiting usual activities; Patient asks whether observation is reasonable; Stable general appearance; Minimal intermittent awareness of the bulge
- Presentation: A 45-year-old man with BMI 24.2 asks whether his reducible, minimally symptomatic groin bulge can be observed. Findings: Adult man, Prior clinical documentation identifies an inguinal hernia, Groin bulge is reducible, No pain limiting usual activities, Patient asks whether observation is reasonable, Stable general appearance, and Minimal intermittent awareness of the bulge.
- Selected question variants: `variant.inguinal-hernia.watchful-population.a`

1. **Which patient fits the guideline-supported population in whom watchful waiting with return precautions may be offered?**
   - Primary concept: `concept.inguinal-hernia.watchful-waiting-population`
   - Correct answer: A man with a reducible, minimally symptomatic inguinal hernia

#### Level 1: Painful acutely irreducible groin hernia

- Template: `case.pilot.inguinal-hernia-acute-transfer`
- Seed: `review-7`
- Patient: 74 years; Female; BMI 27.5; meaningful comorbidities 0
- Physiology overlay: `physiology.inguinal-hernia.urgent-pain-editorial`
- Vitals: HR 77; BP 103/72; temperature 98.6 F; SpO2 97%
- Findings: Prior clinical documentation identifies an inguinal hernia; New inability to reduce a previously reducible groin bulge; Increasing groin pain; Alert mental status; Localized tenderness
- Presentation: A 74-year-old woman with BMI 27.5 has a newly painful groin bulge that no longer reduces. Findings: Prior clinical documentation identifies an inguinal hernia, New inability to reduce a previously reducible groin bulge, Increasing groin pain, Alert mental status, and Localized tenderness.
- Selected question variants: `variant.inguinal-hernia.acute-transfer.b`

1. **An adult arrives with a tender groin hernia that no longer reduces, progressive pain, and inability to pass flatus. The patient is alert and not in shock. Select the disposition.**
   - Primary concept: `concept.inguinal-hernia.acute-irreducibility-transfer`
   - Correct answer: Transfer now to an emergency surgical-capable setting


### Concepts and question variants

#### Elective referral for symptomatic reducible inguinal hernia

- Concept ID: `concept.inguinal-hernia.reducible-symptomatic-referral`
- Learning objective: Select elective surgical referral for a stable adult with a symptomatic, readily reducible inguinal hernia and no urgent features.
- Educational tier: Level 0
- Correct action: Arrange elective surgical referral.
- Disposition: `elective_surgical_referral`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.inguinal.clinical-diagnosis`, `claim.inguinal.symptomatic-referral`
- Supporting sources: `src.hernia.herniasurge_2018`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### variant.inguinal-hernia.reducible-referral.a

**Question:** An otherwise healthy adult has a documented inguinal hernia that remains easily reducible, but recurring discomfort now limits lifting and exercise. There are no obstructive or systemic findings. What is the best next step?

**Correct answer:** Arrange elective surgical evaluation

**Explanation:** This is a stable, symptomatic, reducible inguinal hernia without obstruction or strangulation features. Elective surgical evaluation is appropriate; the pilot does not simulate repair.

**Distractor rationales:**

- Transfer immediately to the emergency department: The hernia is reducible and lacks acute-complication findings, so emergency transfer is not the supported disposition.
- Observe indefinitely without specialist discussion: The patient has recurring symptoms; the bounded watchful-waiting teaching point is not unrestricted observation of symptomatic patients.

Supporting claim IDs: `claim.inguinal.clinical-diagnosis`, `claim.inguinal.symptomatic-referral`

Supporting source IDs: `src.hernia.herniasurge_2018`

Review status: `needs clinician review`; last clinician review: none recorded.

##### variant.inguinal-hernia.reducible-referral.b

**Question:** A known inguinal hernia remains soft and reducible, but increasing aching now limits routine activity. There is no vomiting, distension, skin change, or systemic illness. Choose the clinic disposition.

**Correct answer:** Refer for a nonemergency surgical consultation

**Explanation:** A reducible hernia with activity-related symptoms is appropriate for elective surgical evaluation. The absence of acute red flags makes emergency transfer unnecessary.

**Distractor rationales:**

- Send for emergency transfer now: No acute irreducibility, obstruction, or other urgent feature is present.
- Provide observation alone with no referral option: Meaningful symptoms place this case outside the narrow minimally symptomatic watchful-waiting scenario.

Supporting claim IDs: `claim.inguinal.clinical-diagnosis`, `claim.inguinal.symptomatic-referral`

Supporting source IDs: `src.hernia.herniasurge_2018`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Evidence boundary for inguinal-hernia watchful waiting

- Concept ID: `concept.inguinal-hernia.watchful-waiting-population`
- Learning objective: Identify the selected adult population for whom watchful waiting with safety-net instructions is guideline-supported.
- Educational tier: Level 1
- Correct action: Offer watchful waiting with safety-net instructions as an option to a selected minimally symptomatic adult man.
- Disposition: `watchful_waiting_with_safety_net`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.inguinal.watchful-waiting-men`, `claim.inguinal.watchful-waiting-boundary`
- Supporting sources: `src.hernia.herniasurge_2018`, `src.hernia.herniasurge_2023`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### variant.inguinal-hernia.watchful-population.a

**Question:** Which patient fits the guideline-supported population in whom watchful waiting with return precautions may be offered?

**Correct answer:** A man with a reducible, minimally symptomatic inguinal hernia

**Explanation:** Watchful waiting is a supported option for selected adult men with a reducible asymptomatic or minimally symptomatic inguinal hernia. It requires safety-netting and should not be generalized beyond that evidence base.

**Distractor rationales:**

- A woman with a newly diagnosed, reducible, minimally symptomatic groin hernia: The evidence taught here should not be generalized from minimally symptomatic men to women with groin hernias.
- A patient with a newly painful nonreducible bulge: Acute irreducibility is an urgent presentation, not a watchful-waiting scenario.
- Any adult whose groin bulge is currently tolerable: The recommendation has population and symptom boundaries and does not apply automatically to all adults.

Supporting claim IDs: `claim.inguinal.watchful-waiting-men`, `claim.inguinal.watchful-waiting-boundary`

Supporting source IDs: `src.hernia.herniasurge_2018`, `src.hernia.herniasurge_2023`

Review status: `needs clinician review`; last clinician review: none recorded.

##### variant.inguinal-hernia.watchful-population.b

**Question:** The clinic is deciding whether observation is an evidence-supported option. Which chart most closely matches the bounded watchful-waiting recommendation?

**Correct answer:** A man with a reducible hernia, negligible symptoms, and reliable urgent-return instructions

**Explanation:** The evidence-supported observation option is deliberately narrow: selected minimally symptomatic men with a reducible hernia and clear safety-net instructions.

**Distractor rationales:**

- A woman with a groin mass not yet differentiated from a femoral hernia: This does not match the selected-male evidence population and has additional diagnostic concerns.
- An adult with escalating pain and a bulge that stopped reducing today: The acute change requires urgent surgical-capable evaluation.
- Every adult with an inguinal hernia, regardless of symptom burden: Meaningful symptoms and population differences prevent this broad generalization.

Supporting claim IDs: `claim.inguinal.watchful-waiting-men`, `claim.inguinal.watchful-waiting-boundary`

Supporting source IDs: `src.hernia.herniasurge_2018`, `src.hernia.herniasurge_2023`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Emergency transfer for acute irreducibility

- Concept ID: `concept.inguinal-hernia.acute-irreducibility-transfer`
- Learning objective: Recognize acute painful irreducibility with obstructive features as requiring emergency surgical-capable evaluation.
- Educational tier: Level 1
- Correct action: Arrange immediate emergency-department transfer.
- Disposition: `emergency_department_transfer`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.inguinal.acute-irreducibility`, `claim.inguinal.red-flag-context`
- Supporting sources: `src.hernia.herniasurge_2023`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### variant.inguinal-hernia.acute-transfer.a

**Question:** A previously reducible groin bulge became painful and nonreducible this morning. The patient is vomiting and increasingly distended. What should the clinic do?

**Correct answer:** Arrange immediate emergency-department transfer

**Explanation:** The acute loss of reducibility with pain, vomiting, and distension raises concern for obstruction or strangulation. Transfer promptly for emergency surgical-capable evaluation.

**Distractor rationales:**

- Book a routine elective hernia appointment: Acute irreducibility plus obstructive symptoms cannot safely wait for routine referral.
- Continue repeated forceful reduction attempts in clinic: This could delay urgent surgical-capable assessment and is outside the pilot clinic scope.
- Start outpatient antibiotics and reassess tomorrow: Antibiotics do not address possible mechanical obstruction or strangulation.

Supporting claim IDs: `claim.inguinal.acute-irreducibility`, `claim.inguinal.red-flag-context`

Supporting source IDs: `src.hernia.herniasurge_2023`

Review status: `needs clinician review`; last clinician review: none recorded.

##### variant.inguinal-hernia.acute-transfer.b

**Question:** An adult arrives with a tender groin hernia that no longer reduces, progressive pain, and inability to pass flatus. The patient is alert and not in shock. Select the disposition.

**Correct answer:** Transfer now to an emergency surgical-capable setting

**Explanation:** A painful acutely irreducible hernia with obstructive symptoms requires prompt emergency evaluation. The early-game encounter ends at transfer.

**Distractor rationales:**

- Use the standard elective referral pathway: Acutely changed reducibility and obstructive symptoms are urgent warning findings.
- Keep the patient in clinic for prolonged reduction attempts: The clinic should not delay emergency evaluation of this high-risk presentation.
- Treat as a superficial infection with oral antibiotics: The presentation is mechanical and potentially ischemic, not an uncomplicated skin infection.

Supporting claim IDs: `claim.inguinal.acute-irreducibility`, `claim.inguinal.red-flag-context`

Supporting source IDs: `src.hernia.herniasurge_2023`

Review status: `needs clinician review`; last clinician review: none recorded.


## Suspected acute appendicitis

Family ID: `acute_appendicitis`

Scope: Adult, nonpregnant outpatient presentations in which the clinic must recognize possible acute appendicitis and arrange prompt emergency-department evaluation.

Explicit exclusions: Pediatric appendicitis; Pregnancy-influenced presentation; Perforated appendicitis as a completed diagnosis entry; Appendiceal abscess or phlegmon as completed entries; Definitive inpatient antibiotics; Appendectomy or other definitive treatment.

### Phenotypes and capability requirements

| Tier | Phenotype | Acuity | Required capabilities | Allowed dispositions | Editorial simulation weight |
|---|---|---|---|---|---|
| Level 0 | `phenotype.acute-appendicitis.l0-classic` - Classic concerning appendicitis presentation | urgent_stable | `capability.examination` | emergency_department_transfer | 1 (Editorial review weight for a clear Level 0 disposition case; not claimed prevalence.) |
| Level 1 | `phenotype.acute-appendicitis.l1-early-incomplete` - Early or incomplete concerning appendicitis pattern | urgent_stable | `capability.examination` | emergency_department_transfer | 0.65 (Editorial review weight for a multistep Level 1 case; not claimed prevalence.) |
| Level 1 | `phenotype.acute-appendicitis.l1-no-onsite-imaging` - Concerning appendicitis without appropriate onsite imaging | urgent_stable | `capability.examination` | emergency_department_transfer | 0.35 (Editorial review weight for the unavailable-test safety boundary; not claimed prevalence.) |

### Deterministic generated examples

#### Level 0: Classic concerning appendicitis presentation

- Template: `case.pilot.appendicitis-classic-transfer`
- Seed: `review-0`
- Patient: 49 years; Male; BMI 18.9; meaningful comorbidities 0
- Physiology overlay: `physiology.appendicitis.urgent-stable-editorial`
- Vitals: HR 70; BP 120/70; temperature 97.7 F; SpO2 96%
- Findings: Pain began near the umbilicus and migrated to the right lower quadrant; Progressive right-lower-quadrant tenderness; Symptoms worsened over several hours; Alert mental status; Nausea
- Presentation: A 49-year-old man with BMI 18.9 has worsening abdominal pain that migrated to the right lower quadrant. Findings: Pain began near the umbilicus and migrated to the right lower quadrant, Progressive right-lower-quadrant tenderness, Symptoms worsened over several hours, Alert mental status, and Nausea.
- Selected question variants: `variant.appendicitis.classic-disposition.b`

1. **An otherwise healthy adult develops central abdominal discomfort followed by steadily worsening right-lower-quadrant pain, anorexia, and localized tenderness. Choose the next step from this outpatient clinic.**
   - Primary concept: `concept.appendicitis.classic-pattern-urgent-disposition`
   - Correct answer: Send for urgent emergency-department assessment

#### Level 1: Early or incomplete concerning appendicitis pattern

- Template: `case.pilot.appendicitis-incomplete-multistep`
- Seed: `review-12`
- Patient: 28 years; Female; BMI 23.7; meaningful comorbidities 0
- Physiology overlay: `physiology.appendicitis.urgent-stable-editorial`
- Vitals: HR 98; BP 100/75; temperature 98.2 F; SpO2 97%
- Findings: Progressively worsening abdominal pain; Focal right-lower-quadrant tenderness; Focal tenderness persists on repeat examination; Alert mental status; Mild urinary symptoms without a definitive urinary diagnosis
- Presentation: A 28-year-old woman with BMI 23.7 has progressively worsening focal right-lower-quadrant pain. Findings: Progressively worsening abdominal pain, Focal right-lower-quadrant tenderness, Focal tenderness persists on repeat examination, Alert mental status, and Mild urinary symptoms without a definitive urinary diagnosis.
- Selected question variants: `variant.appendicitis.incomplete-recognition.a`, `variant.appendicitis.no-delay.b`

1. **An adult has steadily worsening focal right-lower-quadrant pain and tenderness but no clear migration and no measured fever. Which diagnosis must remain an important urgent concern?**
   - Primary concept: `concept.appendicitis.incomplete-pattern-recognition`
   - Correct answer: Suspected acute appendicitis
2. **After recognizing a concerning but incomplete appendicitis pattern, you learn that appropriate imaging cannot be performed in this clinic today. Select the disposition.**
   - Primary concept: `concept.appendicitis.no-delay-for-unavailable-test`
   - Correct answer: Transfer now for urgent emergency evaluation

#### Level 1: Concerning appendicitis without appropriate onsite imaging

- Template: `case.pilot.appendicitis-no-onsite-imaging`
- Seed: `review-3`
- Patient: 44 years; Male; BMI 22.5; meaningful comorbidities 0
- Physiology overlay: `physiology.appendicitis.urgent-stable-editorial`
- Vitals: HR 84; BP 117/79; temperature 97.7 F; SpO2 95%
- Findings: Progressively worsening right-lower-quadrant pain; Focal right-lower-quadrant tenderness; Appropriate appendicitis imaging is unavailable in the clinic; Alert mental status; Incomplete classic symptom migration
- Presentation: A 44-year-old man with BMI 22.5 has progressively worsening right-lower-quadrant pain, and appropriate appendicitis imaging is unavailable onsite. Findings: Progressively worsening right-lower-quadrant pain, Focal right-lower-quadrant tenderness, Appropriate appendicitis imaging is unavailable in the clinic, Alert mental status, and Incomplete classic symptom migration.
- Selected question variants: `variant.appendicitis.no-delay.a`

1. **The clinic is concerned about appendicitis after history and examination, but has no CT or ultrasound. Plain X-ray is available. What is the best next step?**
   - Primary concept: `concept.appendicitis.no-delay-for-unavailable-test`
   - Correct answer: Prompt emergency-department transfer


### Concepts and question variants

#### Urgent disposition for a classic appendicitis pattern

- Concept ID: `concept.appendicitis.classic-pattern-urgent-disposition`
- Learning objective: Select prompt emergency-department evaluation for a stable outpatient with a classic concerning appendicitis presentation.
- Educational tier: Level 0
- Correct action: Arrange prompt emergency-department transfer.
- Disposition: `emergency_department_transfer`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.appendicitis.typical-pattern`, `claim.appendicitis.outpatient-urgent-evaluation`
- Supporting sources: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### variant.appendicitis.classic-disposition.a

**Question:** A stable adult has pain that began near the umbilicus, migrated to the right lower quadrant, and worsened over several hours with focal tenderness. What is the appropriate clinic disposition?

**Correct answer:** Arrange prompt emergency-department evaluation

**Explanation:** The evolving migratory pain and focal right-lower-quadrant tenderness create meaningful concern for appendicitis. A stable patient still needs prompt emergency-department evaluation.

**Distractor rationales:**

- Schedule routine reassessment tomorrow: The concerning evolving pattern warrants prompt evaluation rather than delayed routine review.
- Begin definitive outpatient antibiotics in the clinic: This clinic does not confirm or definitively treat appendicitis; the supported endpoint is emergency evaluation.

Supporting claim IDs: `claim.appendicitis.typical-pattern`, `claim.appendicitis.outpatient-urgent-evaluation`

Supporting source IDs: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`

Review status: `needs clinician review`; last clinician review: none recorded.

##### variant.appendicitis.classic-disposition.b

**Question:** An otherwise healthy adult develops central abdominal discomfort followed by steadily worsening right-lower-quadrant pain, anorexia, and localized tenderness. Choose the next step from this outpatient clinic.

**Correct answer:** Send for urgent emergency-department assessment

**Explanation:** A classic concerning presentation should be transferred promptly even when physiology is stable. Level 0 tests the disposition rather than definitive treatment.

**Distractor rationales:**

- Discharge for a planned next-day clinic visit: Routine delay is inappropriate when the current history and examination are concerning.
- Treat empirically and complete care as an outpatient: Definitive treatment selection requires emergency or surgical-capable evaluation outside this pilot clinic.

Supporting claim IDs: `claim.appendicitis.typical-pattern`, `claim.appendicitis.outpatient-urgent-evaluation`

Supporting source IDs: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Recognition of an incomplete appendicitis pattern

- Concept ID: `concept.appendicitis.incomplete-pattern-recognition`
- Learning objective: Maintain suspicion for appendicitis when progressive focal right-lower-quadrant findings are present despite an incomplete classic pattern.
- Educational tier: Level 1
- Correct action: Identify suspected appendicitis as an important urgent concern that requires capable evaluation.
- Disposition: `emergency_department_transfer`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.appendicitis.typical-pattern`, `claim.appendicitis.pattern-not-diagnostic`
- Supporting sources: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`, `src.appendicitis.wses_2020`, `src.appendicitis.sages_2024`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### variant.appendicitis.incomplete-recognition.a

**Question:** An adult has steadily worsening focal right-lower-quadrant pain and tenderness but no clear migration and no measured fever. Which diagnosis must remain an important urgent concern?

**Correct answer:** Suspected acute appendicitis

**Explanation:** Appendicitis need not include every classic feature. Progressive focal pain and tenderness keep appendicitis as an important urgent concern even while other acute causes remain in the differential.

**Distractor rationales:**

- Uncomplicated gastroenteritis: Gastroenteritis remains a differential, but progressive focal tenderness without a reassuring alternative keeps appendicitis concerning.
- Simple cystitis: Mild urinary findings or symptoms do not exclude appendicitis and do not explain the full focal abdominal pattern.
- Routine constipation: Constipation alone should not be used to dismiss progressive focal right-lower-quadrant tenderness.

Supporting claim IDs: `claim.appendicitis.typical-pattern`, `claim.appendicitis.pattern-not-diagnostic`

Supporting source IDs: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`, `src.appendicitis.wses_2020`, `src.appendicitis.sages_2024`

Review status: `needs clinician review`; last clinician review: none recorded.

##### variant.appendicitis.incomplete-recognition.b

**Question:** A stable adult reports increasing lower abdominal pain now localized on the right, reduced appetite, and pain with movement. They have not vomited and are afebrile. Which diagnosis must still be prioritized for urgent evaluation?

**Correct answer:** Possible acute appendicitis

**Explanation:** An incomplete presentation can still be concerning for appendicitis. Individual absent features do not exclude it; the overall evolving pattern matters.

**Distractor rationales:**

- Viral gastroenteritis: The focal progressive examination pattern is not adequately explained by assuming a diffuse self-limited illness.
- Lower urinary infection: A urinary diagnosis is not established and would not safely account for the progressive focal tenderness.
- Constipation without complication: The absence of vomiting or fever does not make progressive focal pain safe to attribute to constipation.

Supporting claim IDs: `claim.appendicitis.typical-pattern`, `claim.appendicitis.pattern-not-diagnostic`

Supporting source IDs: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`, `src.appendicitis.wses_2020`, `src.appendicitis.sages_2024`

Review status: `needs clinician review`; last clinician review: none recorded.

#### Do not delay suspected appendicitis for unavailable testing

- Concept ID: `concept.appendicitis.no-delay-for-unavailable-test`
- Learning objective: Choose emergency-department transfer rather than delaying a concerning appendicitis presentation for unavailable CT or substituting plain X-ray.
- Educational tier: Level 1
- Correct action: Transfer promptly for emergency-capable evaluation without substituting plain X-ray or waiting for delayed outpatient CT.
- Disposition: `emergency_department_transfer`
- Required capabilities: `capability.examination`
- Supporting claims: `claim.appendicitis.outpatient-urgent-evaluation`, `claim.appendicitis.imaging-context`, `claim.appendicitis.no-plain-xray`
- Supporting sources: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`, `src.appendicitis.wses_2020`, `src.appendicitis.acr_rlq_2022`, `src.appendicitis.sages_2024`
- Review status: `needs_clinician_review` (AI-assisted: yes)

##### variant.appendicitis.no-delay.a

**Question:** The clinic is concerned about appendicitis after history and examination, but has no CT or ultrasound. Plain X-ray is available. What is the best next step?

**Correct answer:** Prompt emergency-department transfer

**Explanation:** The clinic should not replace appropriate appendicitis evaluation with plain X-ray or delay care for unavailable CT. Transfer to an emergency-capable setting.

**Distractor rationales:**

- Substitute a plain abdominal X-ray: Plain radiography is not an appropriate substitute for appendicitis imaging.
- Wait for a nonurgent outpatient CT appointment: A concerning acute presentation should not be delayed for future outpatient imaging.
- Discharge because CT is unavailable: Lack of onsite imaging does not remove the clinical concern or the need for a capable evaluation setting.

Supporting claim IDs: `claim.appendicitis.outpatient-urgent-evaluation`, `claim.appendicitis.imaging-context`, `claim.appendicitis.no-plain-xray`

Supporting source IDs: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`, `src.appendicitis.wses_2020`, `src.appendicitis.acr_rlq_2022`, `src.appendicitis.sages_2024`

Review status: `needs clinician review`; last clinician review: none recorded.

##### variant.appendicitis.no-delay.b

**Question:** After recognizing a concerning but incomplete appendicitis pattern, you learn that appropriate imaging cannot be performed in this clinic today. Select the disposition.

**Correct answer:** Transfer now for urgent emergency evaluation

**Explanation:** Facility limits change where evaluation occurs, not whether the concern matters. Prompt emergency-department transfer is the appropriate endpoint.

**Distractor rationales:**

- Use the clinic X-ray machine instead: Availability does not make plain radiography an appropriate appendicitis substitute.
- Arrange CT later in the week and observe at home: Delayed outpatient imaging is inconsistent with the current level of concern.
- End the evaluation with routine return precautions only: Routine discharge does not provide the prompt surgical-capable assessment required by this presentation.

Supporting claim IDs: `claim.appendicitis.outpatient-urgent-evaluation`, `claim.appendicitis.imaging-context`, `claim.appendicitis.no-plain-xray`

Supporting source IDs: `src.appendicitis.swedish_2025`, `src.appendicitis.niddk_symptoms`, `src.appendicitis.wses_2020`, `src.appendicitis.acr_rlq_2022`, `src.appendicitis.sages_2024`

Review status: `needs clinician review`; last clinician review: none recorded.

## Source lookup

The complete citation, organization or journal, publication year, DOI or official URL, access date, authority assessment, license, reuse status, and use role for every source are maintained in [SOURCE_MANIFEST.md](SOURCE_MANIFEST.md) and in the pilot registry.

Clinical approval remains pending. Automated tests and this generated packet do not record clinician review.
