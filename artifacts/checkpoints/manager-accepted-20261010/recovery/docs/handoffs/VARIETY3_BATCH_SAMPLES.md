# Variety-3 batch samples - 2026-10-10

**Unapproved draft:** 10 new concepts, 20 variants, 35 atomic claims and 19 sources. Every authored record remains `needs_clinician_review`. Tests and agent checks are not clinical approval.

**KEY FIRST FOR REVIEW ONLY:** option A is the key in every example below. Runtime-shaped nodes set `shuffleAnswers: true`; an admitted runtime must randomize all choices. This standalone batch is not registered in any release or global timing registry.

Scope: adult clinic recognition, counseling and review of outside ASC/endoscopy plans, at existing Level 1-3 release points. These can add variety at Level 4 through ordinary progression after manager admission. No Level 5 setting, executable procedure service or test-result flow is introduced. Wait hooks use existing placeholder profiles and must be admitted with the cases; no duration is authored in case prose. Art-matched ages and fictional names are editorial values, not demographic disease weights. `approvedInstantiationProfiles` is a legacy structural name, not clinician approval.

## Recognize rectus diastasis

Concept: `concept.variety3.rectus-diastasis-recognition`. Earliest level: 1. Educational tier: 0.

Objective: Distinguish a supplied broad rectus-separation pattern from a focal abdominal-wall hernia without assuming that the conditions cannot coexist.

### question.variety3.diastasis-head-lift.v1

Case: `case.variety3.diastasis-head-lift`. Art: `patient-demographics20-v4.001`. Age 32, Male.

**Chief complaint:** Midline abdominal bulge

**Presentation:** Daniel Brooks, a 32-year-old man, visits the clinic. Daniel notices a long ridge in the middle of his abdomen when sitting up. During a head lift, a broad dome appears between the rectus muscles. The examiner can feel separated muscle edges but identifies no focal fascial defect or localized protrusion. There is no abdominal operative scar.

**Question:** Which abdominal-wall diagnosis best explains Daniel Brooks's broad midline doming and separated rectus edges?

**Choices - KEY FIRST FOR REVIEW:**

A. Rectus diastasis **(key)**

Rationale: Broad midline doming with separated rectus edges and no identified focal defect best fits rectus diastasis.

Label length: 16 characters. Wait hook: no test. Claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.

B. Epigastric hernia

Rationale: The supplied examination describes broad separation rather than an identified focal epigastric protrusion through a defect.

Label length: 17 characters. Wait hook: no test. Claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.hernia-distinction`.

C. Incisional hernia

Rationale: No operative scar or focal defect is supplied; the positive finding is a broad separation pattern.

Label length: 17 characters. Wait hook: no test. Claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.hernia-distinction`.

D. Umbilical hernia

Rationale: An isolated umbilical defect is not identified. Rectus separation best explains the broad ridge in this examination.

Label length: 16 characters. Wait hook: no test. Claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.hernia-distinction`.

**Explanation:** The broad separation pattern best fits rectus diastasis. It differs from protrusion through a focal abdominal-wall defect. This supplied examination supports recognition; it does not establish that every coexisting hernia has been excluded.

**Teaching point:** Broad midline rectus separation is a different finding from a focal hernia defect.

**Field-level claim mapping:**

- Presentation: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.
- Task: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.
- Explanation: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.
- Teaching point: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.hernia-distinction`.

**Sources:** <a href="https://europeanherniasociety.eu/guidelines-for-management-of-rectus-diastasis/" target="_blank" rel="noopener noreferrer">source.variety3.ehs-diastasis-2021</a>; <a href="https://www.kentcht.nhs.uk/leaflet/diastasis-rectus-abdominus/" target="_blank" rel="noopener noreferrer">source.variety3.kent-diastasis-2026</a>; <a href="https://www.nhs.uk/conditions/hernia/" target="_blank" rel="noopener noreferrer">source.variety3.nhs-hernia-2026</a>.

### question.variety3.diastasis-ridge-review.v2

Case: `case.variety3.diastasis-ridge-review`. Art: `patient-demographics20-v4.019`. Age 48, Female.

**Chief complaint:** Abdominal contour change

**Presentation:** Laura Bennett, a 48-year-old woman, visits the clinic. Laura asks about a ridge that appears along the abdominal midline when she raises her shoulders from the examination couch. It extends across a broad area above and below the umbilicus. Examination finds separated rectus edges without a discrete umbilical or epigastric defect. She has no abdominal surgical scar.

**Question:** Which diagnosis best fits Laura Bennett's broad rectus separation without an identified focal abdominal-wall defect?

**Choices - KEY FIRST FOR REVIEW:**

A. Rectus diastasis **(key)**

Rationale: Broad midline doming with separated rectus edges and no identified focal defect best fits rectus diastasis.

Label length: 16 characters. Wait hook: no test. Claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.

B. Epigastric hernia

Rationale: The supplied examination describes broad separation rather than an identified focal epigastric protrusion through a defect.

Label length: 17 characters. Wait hook: no test. Claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.hernia-distinction`.

C. Incisional hernia

Rationale: No operative scar or focal defect is supplied; the positive finding is a broad separation pattern.

Label length: 17 characters. Wait hook: no test. Claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.hernia-distinction`.

D. Umbilical hernia

Rationale: An isolated umbilical defect is not identified. Rectus separation best explains the broad ridge in this examination.

Label length: 16 characters. Wait hook: no test. Claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.hernia-distinction`.

**Explanation:** Rectus diastasis describes the supplied widened midline between the rectus muscles. The broad dome is not the same finding as a focal hernia protrusion. A separate suspected hernia would still need its own assessment.

**Teaching point:** Identify rectus separation without treating every midline ridge as a focal hernia.

**Field-level claim mapping:**

- Presentation: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.
- Task: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.
- Explanation: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.
- Teaching point: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.hernia-distinction`.

**Sources:** <a href="https://europeanherniasociety.eu/guidelines-for-management-of-rectus-diastasis/" target="_blank" rel="noopener noreferrer">source.variety3.ehs-diastasis-2021</a>; <a href="https://www.kentcht.nhs.uk/leaflet/diastasis-rectus-abdominus/" target="_blank" rel="noopener noreferrer">source.variety3.kent-diastasis-2026</a>; <a href="https://www.nhs.uk/conditions/hernia/" target="_blank" rel="noopener noreferrer">source.variety3.nhs-hernia-2026</a>.

## Recognize an epidermoid cyst

Concept: `concept.variety3.epidermoid-cyst-recognition`. Earliest level: 1. Educational tier: 0.

Objective: Select epidermoid cyst as the best clinical fit for a slowly growing cutaneous lump with a central punctum, without claiming histologic certainty.

### question.variety3.epidermoid-upper-back.v1

Case: `case.variety3.epidermoid-upper-back`. Art: `patient-demographics20-v4.004`. Age 42, Male.

**Chief complaint:** Back lump

**Presentation:** Robert Lewis, a 42-year-old man, visits the clinic. Robert has a slowly enlarging rounded lump in the skin of his upper back. It is nontender, and a small central punctum is visible. There is no surrounding redness or active drainage. He asks what the examination most likely represents before discussing any treatment.

**Question:** Which diagnosis best fits Robert Lewis's slowly enlarging upper-back skin lump with a central punctum?

**Choices - KEY FIRST FOR REVIEW:**

A. Epidermoid cyst **(key)**

Rationale: Slow growth and a central punctum are a useful epidermoid-cyst pattern; this remains a clinical best-fit diagnosis.

Label length: 15 characters. Wait hook: no test. Claims: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`.

B. Subcutaneous lipoma

Rationale: The punctum-bearing skin lesion fits an epidermoid cyst better than the proposed lipomatous mass.

Label length: 19 characters. Wait hook: no test. Claims: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`.

C. Trichilemmal cyst

Rationale: The described central punctum favors an epidermoid cyst over this other cutaneous-cyst diagnosis.

Label length: 17 characters. Wait hook: no test. Claims: `claim.variety3.epidermoid.differential-pattern`.

D. Cutaneous abscess

Rationale: No painful inflamed collection is described. A cyst with a punctum best fits the supplied slowly growing, nontender lump.

Label length: 17 characters. Wait hook: no test. Claims: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.inflammation-context`.

**Explanation:** An epidermoid cyst is the best fit for this slow-growing punctum-bearing lesion. The task is clinical recognition, not proof of histology or a decision that every cyst requires removal.

**Teaching point:** A central punctum is a useful clue to an epidermoid cyst, interpreted with the rest of the examination.

**Field-level claim mapping:**

- Presentation: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`, `claim.variety3.epidermoid.inflammation-context`.
- Task: `claim.variety3.epidermoid.slow-punctum-pattern`.
- Explanation: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`.
- Teaching point: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`.

**Sources:** <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6732711/" target="_blank" rel="noopener noreferrer">source.variety3.hoang-epidermoid-2019</a>; <a href="https://www.nhs.uk/conditions/skin-cyst/" target="_blank" rel="noopener noreferrer">source.variety3.nhs-skin-cyst-2023</a>.

### question.variety3.epidermoid-shoulder.v2

Case: `case.variety3.epidermoid-shoulder`. Art: `patient-demographics20-v4.020`. Age 60, Female.

**Chief complaint:** Shoulder skin lump

**Presentation:** Helen Carter, a 60-year-old woman, visits the clinic. Helen brings a painless lump over the posterior shoulder for assessment. It has enlarged gradually and remains centered in the skin, with a visible central pore. The examiner finds no redness, tenderness or draining collection. Helen wants to understand the likely diagnosis.

**Question:** Which diagnosis best matches Helen Carter's gradually enlarging shoulder skin lump with a central pore?

**Choices - KEY FIRST FOR REVIEW:**

A. Epidermoid cyst **(key)**

Rationale: Slow growth and a central punctum are a useful epidermoid-cyst pattern; this remains a clinical best-fit diagnosis.

Label length: 15 characters. Wait hook: no test. Claims: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`.

B. Subcutaneous lipoma

Rationale: The punctum-bearing skin lesion fits an epidermoid cyst better than the proposed lipomatous mass.

Label length: 19 characters. Wait hook: no test. Claims: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`.

C. Trichilemmal cyst

Rationale: The described central punctum favors an epidermoid cyst over this other cutaneous-cyst diagnosis.

Label length: 17 characters. Wait hook: no test. Claims: `claim.variety3.epidermoid.differential-pattern`.

D. Cutaneous abscess

Rationale: No painful inflamed collection is described. A cyst with a punctum best fits the supplied slowly growing, nontender lump.

Label length: 17 characters. Wait hook: no test. Claims: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.inflammation-context`.

**Explanation:** The gradual growth and central punctum favor an epidermoid cyst. These are descriptive clinical clues; the answer is a best-fit diagnosis rather than histologic confirmation.

**Teaching point:** Use the punctum-bearing skin-lump pattern for recognition without presenting it as histologic confirmation.

**Field-level claim mapping:**

- Presentation: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`, `claim.variety3.epidermoid.inflammation-context`.
- Task: `claim.variety3.epidermoid.slow-punctum-pattern`.
- Explanation: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`.
- Teaching point: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`.

**Sources:** <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6732711/" target="_blank" rel="noopener noreferrer">source.variety3.hoang-epidermoid-2019</a>; <a href="https://www.nhs.uk/conditions/skin-cyst/" target="_blank" rel="noopener noreferrer">source.variety3.nhs-skin-cyst-2023</a>.

## Recognize an external hemorrhoid clot

Concept: `concept.variety3.thrombosed-external-hemorrhoid-recognition`. Earliest level: 1. Educational tier: 0.

Objective: Identify a clot-filled painful external anal-margin lump as a thrombosed external hemorrhoid rather than internal prolapse or another proposed anal lesion.

### question.variety3.external-clot-sudden-lump.v1

Case: `case.variety3.external-clot-sudden-lump`. Art: `patient-demographics20-v4.006`. Age 46, Male.

**Chief complaint:** Painful anal lump

**Presentation:** Michael Grant, a 46-year-old man, visits the clinic. Michael reports sudden pain from a new lump at the anal opening. Examination identifies a tense, tender, clot-filled lump beneath the external anal skin. There is no protruding mucosal tissue, visible linear tear or draining collection. He is otherwise well and asks what the examined lesion is.

**Question:** Which diagnosis best fits Michael Grant's painful clot-filled lump beneath external anal skin?

**Choices - KEY FIRST FOR REVIEW:**

A. Thrombosed external hemorrhoid **(key)**

Rationale: The clot-filled tender lump lies beneath external anal skin, which identifies the external thrombosis pattern.

Label length: 30 characters. Wait hook: no test. Claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`.

B. Prolapsing internal hemorrhoid

Rationale: The supplied lesion is under external skin, without protruding mucosal tissue from the anal canal.

Label length: 30 characters. Wait hook: no test. Claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.internal-location`.

C. Acute perianal abscess

Rationale: The examination identifies a clot-filled external lump rather than a draining collection. The external thrombosis is the best fit.

Label length: 22 characters. Wait hook: no test. Claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.assessment-boundary`.

D. Acute anal fissure

Rationale: No linear tear is seen. The positive finding is the examined external clot-filled lump.

Label length: 18 characters. Wait hook: no test. Claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.assessment-boundary`.

**Explanation:** The location beneath external anal skin and the supplied clot identify a thrombosed external hemorrhoid. Pain alone would not establish the diagnosis. This question identifies the lesion and does not select a procedure or a treatment deadline.

**Teaching point:** Use the examined external clot and anatomic location to recognize hemorrhoid thrombosis.

**Field-level claim mapping:**

- Presentation: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.internal-location`, `claim.variety3.hemorrhoid.assessment-boundary`.
- Task: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`.
- Explanation: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.internal-location`, `claim.variety3.hemorrhoid.assessment-boundary`.
- Teaching point: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.internal-location`.

**Sources:** <a href="https://www.fascrs.org/Web/Patients/Diseases-and-Conditions/A-Z/Hemorrhoids.aspx" target="_blank" rel="noopener noreferrer">source.variety3.ascrs-hemorrhoids</a>; <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/hemorrhoids/symptoms-causes" target="_blank" rel="noopener noreferrer">source.variety3.niddk-hemorrhoids-2016</a>.

### question.variety3.external-clot-examination.v2

Case: `case.variety3.external-clot-examination`. Art: `patient-demographics20-v4.013`. Age 67, Female.

**Chief complaint:** Tender perianal swelling

**Presentation:** Ellen Morgan, a 67-year-old woman, visits the clinic. Ellen has localized anal-margin pain and a tender swelling. The clinician examines a firm clot-filled external lump covered by anal skin. No internal mucosal prolapse, linear tear or draining collection is seen. Ellen wants the lesion named before discussing care options.

**Question:** Which diagnosis explains Ellen Morgan's examined clot-filled external anal-margin lump?

**Choices - KEY FIRST FOR REVIEW:**

A. Thrombosed external hemorrhoid **(key)**

Rationale: The clot-filled tender lump lies beneath external anal skin, which identifies the external thrombosis pattern.

Label length: 30 characters. Wait hook: no test. Claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`.

B. Prolapsing internal hemorrhoid

Rationale: The supplied lesion is under external skin, without protruding mucosal tissue from the anal canal.

Label length: 30 characters. Wait hook: no test. Claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.internal-location`.

C. Acute perianal abscess

Rationale: The examination identifies a clot-filled external lump rather than a draining collection. The external thrombosis is the best fit.

Label length: 22 characters. Wait hook: no test. Claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.assessment-boundary`.

D. Acute anal fissure

Rationale: No linear tear is seen. The positive finding is the examined external clot-filled lump.

Label length: 18 characters. Wait hook: no test. Claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.assessment-boundary`.

**Explanation:** This supplied examination fits external hemorrhoid thrombosis. The clot is in an external lesion rather than protruding internal mucosa. Recognition does not by itself determine whether conservative or procedural treatment is appropriate.

**Teaching point:** A clot in an external hemorrhoid identifies thrombosis; treatment selection is a separate decision.

**Field-level claim mapping:**

- Presentation: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.internal-location`, `claim.variety3.hemorrhoid.assessment-boundary`.
- Task: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`.
- Explanation: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.internal-location`, `claim.variety3.hemorrhoid.assessment-boundary`.
- Teaching point: `claim.variety3.hemorrhoid.external-thrombosis`.

**Sources:** <a href="https://www.fascrs.org/Web/Patients/Diseases-and-Conditions/A-Z/Hemorrhoids.aspx" target="_blank" rel="noopener noreferrer">source.variety3.ascrs-hemorrhoids</a>; <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/hemorrhoids/symptoms-causes" target="_blank" rel="noopener noreferrer">source.variety3.niddk-hemorrhoids-2016</a>.

## Counsel gentle care for anal itching

Concept: `concept.variety3.pruritus-ani-gentle-skin-care`. Earliest level: 1. Educational tier: 0.

Objective: Choose gentle cleansing and drying for assessed uncomplicated perianal irritation while avoiding abrasive or fragranced care and retaining reassessment.

### question.variety3.pruritus-repeated-scrubbing.v1

Case: `case.variety3.pruritus-repeated-scrubbing`. Art: `patient-demographics20-v4.007`. Age 49, Male.

**Chief complaint:** Anal itching

**Presentation:** James Turner, a 49-year-old man, visits the clinic. James repeatedly scrubs the anal area with scented soap because it feels itchy after bowel movements. Examination shows superficial irritation without a focal mass, ulcer, tear or draining lesion. The clinician has assessed him and is discussing basic skin care, with reassessment if symptoms persist or change.

**Question:** Which basic skin-care approach should James Turner use for his assessed perianal irritation and itching?

**Choices - KEY FIRST FOR REVIEW:**

A. Rinse gently and dry by patting **(key)**

Rationale: Gentle water cleansing and patting dry reduce further irritation after the supplied assessment.

Label length: 31 characters. Wait hook: no test. Claims: `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`.

B. Scrub firmly and apply scented powder

Rationale: Scrubbing and scented products can aggravate the irritation being addressed.

Label length: 37 characters. Wait hook: no test. Claims: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.avoid-irritants`.

C. Rub briskly and use fragranced wipes

Rationale: Repeated rubbing and fragrance continue the irritant exposure rather than addressing it.

Label length: 36 characters. Wait hook: no test. Claims: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.avoid-irritants`.

D. Wash vigorously and use medicated soap

Rationale: Vigorous cleaning and irritating products are not the basic gentle-care approach supported for this presentation.

Label length: 38 characters. Wait hook: no test. Claims: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`.

**Explanation:** Choose gentle water cleansing and patting dry. Vigorous scrubbing and irritating products can continue the irritation. Persistent or concerning symptoms still need reassessment rather than an assumption that skin care explains every cause.

**Teaching point:** Gentle cleansing and drying can reduce further irritation; more scrubbing is not the solution.

**Field-level claim mapping:**

- Presentation: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.reassessment-boundary`.
- Task: `claim.variety3.pruritus.gentle-water-drying`.
- Explanation: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`, `claim.variety3.pruritus.reassessment-boundary`.
- Teaching point: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.gentle-water-drying`.

**Sources:** <a href="https://www.nhs.uk/symptoms/itchy-anus/" target="_blank" rel="noopener noreferrer">source.variety3.nhs-itchy-anus-2023</a>; <a href="https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Pruritus-Ani.aspx" target="_blank" rel="noopener noreferrer">source.variety3.ascrs-pruritus-ani</a>.

### question.variety3.pruritus-fragranced-wipes.v2

Case: `case.variety3.pruritus-fragranced-wipes`. Art: `patient-demographics20-v4.014`. Age 68, Female.

**Chief complaint:** Perianal skin irritation

**Presentation:** Susan Hayes, a 68-year-old woman, visits the clinic. Susan has anal itching while using fragranced wipes and rubbing the area repeatedly to feel clean. Examination finds irritated perianal skin without a focal ulcer, mass, fissure or draining lesion. After assessment, the clinician discusses an initial skin-care change and plans reassessment for ongoing or changing symptoms.

**Question:** Which basic cleansing approach best addresses Susan Hayes's assessed perianal irritation during repeated fragranced-wipe use?

**Choices - KEY FIRST FOR REVIEW:**

A. Rinse gently and dry by patting **(key)**

Rationale: Gentle water cleansing and patting dry reduce further irritation after the supplied assessment.

Label length: 31 characters. Wait hook: no test. Claims: `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`.

B. Scrub firmly and apply scented powder

Rationale: Scrubbing and scented products can aggravate the irritation being addressed.

Label length: 37 characters. Wait hook: no test. Claims: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.avoid-irritants`.

C. Rub briskly and use fragranced wipes

Rationale: Repeated rubbing and fragrance continue the irritant exposure rather than addressing it.

Label length: 36 characters. Wait hook: no test. Claims: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.avoid-irritants`.

D. Wash vigorously and use medicated soap

Rationale: Vigorous cleaning and irritating products are not the basic gentle-care approach supported for this presentation.

Label length: 38 characters. Wait hook: no test. Claims: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`.

**Explanation:** Gentle water cleansing followed by patting dry avoids adding friction and fragrance to the supplied irritation. The plan addresses basic care after examination and retains reassessment if the problem continues or changes.

**Teaching point:** Reduce friction and fragranced-product exposure when counseling assessed perianal irritation.

**Field-level claim mapping:**

- Presentation: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.avoid-irritants`, `claim.variety3.pruritus.reassessment-boundary`.
- Task: `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`.
- Explanation: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`, `claim.variety3.pruritus.reassessment-boundary`.
- Teaching point: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.avoid-irritants`.

**Sources:** <a href="https://www.nhs.uk/symptoms/itchy-anus/" target="_blank" rel="noopener noreferrer">source.variety3.nhs-itchy-anus-2023</a>; <a href="https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Pruritus-Ani.aspx" target="_blank" rel="noopener noreferrer">source.variety3.ascrs-pruritus-ani</a>.

## Complete an inadequately prepared colonoscopy

Concept: `concept.variety3.inadequate-bowel-prep-repeat-colonoscopy`. Earliest level: 2. Educational tier: 0.

Objective: Select an adequately prepared repeat colonoscopy when the whole-colon examination cannot support the intended assessment, with review of preparation failure rather than a fixed repeat timetable.

### question.variety3.prep-incomplete-drink.v1

Case: `case.variety3.prep-incomplete-drink`. Art: `patient-demographics20-v4.009`. Age 55, Male.

**Chief complaint:** Colonoscopy follow-up

**Presentation:** David Parker, a 55-year-old man, visits the clinic. David brings an outside screening-colonoscopy report. Retained stool prevented an adequate view throughout the colon despite attempted cleaning, and the endoscopist states that the examination cannot support a standard screening assessment. David did not finish the preparation because the instructions were unclear. He remains suitable for another examination.

**Question:** Which next examination should complete David Parker's screening assessment after a colonoscopy with inadequate whole-colon visualization?

**Choices - KEY FIRST FOR REVIEW:**

A. Repeat prepared colonoscopy **(key)**

Rationale: The supplied colonoscopy did not adequately assess the colon. Repeat examination with an improved preparation plan addresses that incomplete assessment.

Label length: 27 characters. Wait hook: `timing.test.lower_endoscopy` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.

B. Order fecal immunochemical testing

Rationale: This screening proposal does not complete the inadequately visualized colonoscopy in the supplied situation; the supported next examination is a prepared repeat.

Label length: 34 characters. Wait hook: `timing.test.basic_labs` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.

C. Order stool DNA screening

Rationale: Changing to this screening proposal does not address the incomplete colonoscopic assessment described in the report.

Label length: 25 characters. Wait hook: `timing.test.basic_labs` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.

D. Order abdominal CT imaging

Rationale: This proposed imaging study is not the adequately prepared repeat examination recommended for the supplied failed colonoscopy.

Label length: 26 characters. Wait hook: `timing.test.ct` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.

**Explanation:** Arrange an adequately prepared repeat colonoscopy and review why the preparation was incomplete. The poor view does not establish a reassuring complete examination. The treating team should individualize preparation and scheduling rather than infer a universal repeat deadline from this question.

**Teaching point:** An inadequate examination needs a completion plan, with improved preparation rather than assumed screening completeness.

**Field-level claim mapping:**

- Presentation: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.
- Task: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.
- Explanation: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.
- Teaching point: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.

**Sources:** <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2019_a_0959_0505.pdf" target="_blank" rel="noopener noreferrer">source.variety3.esge-bowel-prep-2019</a>; <a href="https://gi.org/journals-publications/ebgi/anderson_hagen_apr2025/" target="_blank" rel="noopener noreferrer">source.variety3.acg-prep-summary-2025</a>.

### question.variety3.prep-poor-cleansing-report.v2

Case: `case.variety3.prep-poor-cleansing-report`. Art: `patient-demographics20-v4.015`. Age 71, Female.

**Chief complaint:** Screening report review

**Presentation:** Margaret Collins, a 71-year-old woman, visits the clinic. Margaret's outside colonoscopy report documents poor cleansing in all examined segments after washing. It does not provide an adequate colonic assessment or a standard screening interval. She reports difficulty following the preparation plan and asks how the incomplete evaluation should be completed. The clinician confirms that repeat colonoscopy remains appropriate for her.

**Question:** Which examination should complete Margaret Collins's evaluation after her entire colonoscopy was inadequately prepared?

**Choices - KEY FIRST FOR REVIEW:**

A. Repeat prepared colonoscopy **(key)**

Rationale: The supplied colonoscopy did not adequately assess the colon. Repeat examination with an improved preparation plan addresses that incomplete assessment.

Label length: 27 characters. Wait hook: `timing.test.lower_endoscopy` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.

B. Order fecal immunochemical testing

Rationale: This screening proposal does not complete the inadequately visualized colonoscopy in the supplied situation; the supported next examination is a prepared repeat.

Label length: 34 characters. Wait hook: `timing.test.basic_labs` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.

C. Order stool DNA screening

Rationale: Changing to this screening proposal does not address the incomplete colonoscopic assessment described in the report.

Label length: 25 characters. Wait hook: `timing.test.basic_labs` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.

D. Order abdominal CT imaging

Rationale: This proposed imaging study is not the adequately prepared repeat examination recommended for the supplied failed colonoscopy.

Label length: 26 characters. Wait hook: `timing.test.ct` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.

**Explanation:** The supported next examination is a repeat colonoscopy with adequate preparation. Clarify the prior difficulties and improve the repeat plan. This case does not supply an adequate distal examination or justify substituting a routine screening interval for completion.

**Teaching point:** A report that cannot support an adequate assessment should lead to a prepared repeat, not an assumed completed screen.

**Field-level claim mapping:**

- Presentation: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.
- Task: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.
- Explanation: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.
- Teaching point: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`.

**Sources:** <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2019_a_0959_0505.pdf" target="_blank" rel="noopener noreferrer">source.variety3.esge-bowel-prep-2019</a>; <a href="https://gi.org/journals-publications/ebgi/anderson_hagen_apr2025/" target="_blank" rel="noopener noreferrer">source.variety3.acg-prep-summary-2025</a>.

## Choose cold snare for a small colorectal polyp

Concept: `concept.variety3.small-polyp-cold-snare-selection`. Earliest level: 2. Educational tier: 1.

Objective: Choose cold snare for a supplied accessible 4 mm or 7 mm nonpedunculated colorectal polyp without invasive features in an outside endoscopic removal plan.

### question.variety3.snare-four-mm.v1

Case: `case.variety3.snare-four-mm`. Art: `patient-demographics20-v4.011`. Age 61, Male.

**Chief complaint:** Polyp removal planning

**Presentation:** Thomas Reed, a 61-year-old man, visits the clinic. Thomas reviews a planned outside endoscopic polyp removal. The diagnostic report documents an accessible 4 mm nonpedunculated colorectal polyp that has not yet been removed, without features suspicious for invasion. The treating endoscopist has selected it for removal. Thomas asks which technique fits this lesion.

**Question:** Which removal technique best fits Thomas Reed's accessible 4 mm nonpedunculated colorectal polyp without invasive features?

**Choices - KEY FIRST FOR REVIEW:**

A. Cold snare polypectomy **(key)**

Rationale: Cold snare is the preferred technique for this accessible nonpedunculated polyp in the supplied size range.

Label length: 22 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.polypectomy.cold-snare-diminutive`.

B. Hot snare polypectomy

Rationale: For this supplied small nonpedunculated lesion, the guideline preference is cold snare rather than this electrosurgical snare approach.

Label length: 21 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.polypectomy.cold-snare-diminutive`.

C. Cold biopsy forceps polypectomy

Rationale: Cold forceps are not the preferred excision method for this accessible lesion; complete resection is less reliable than the recommended approach.

Label length: 31 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.polypectomy.cold-snare-diminutive`, `claim.variety3.polypectomy.cold-forceps-limit`.

D. Hot biopsy forceps polypectomy

Rationale: The supported approach for this lesion is cold snare. Hot biopsy forceps introduce additional resection, specimen and thermal-injury concerns rather than improving that choice.

Label length: 30 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.polypectomy.cold-snare-diminutive`, `claim.variety3.polypectomy.hot-forceps-limit`.

**Explanation:** Cold snare is the guideline-preferred method for this supplied diminutive nonpedunculated polyp. Forceps excision is not the preferred substitute, and hot biopsy forceps carry additional resection and thermal concerns.

**Teaching point:** Choose cold snare for the supplied accessible diminutive nonpedunculated colorectal polyp.

**Field-level claim mapping:**

- Presentation: `claim.variety3.polypectomy.cold-snare-diminutive`.
- Task: `claim.variety3.polypectomy.cold-snare-diminutive`.
- Explanation: `claim.variety3.polypectomy.cold-snare-diminutive`, `claim.variety3.polypectomy.cold-forceps-limit`, `claim.variety3.polypectomy.hot-forceps-limit`.
- Teaching point: `claim.variety3.polypectomy.cold-snare-diminutive`.

**Sources:** <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2024_a-2304-3219.pdf" target="_blank" rel="noopener noreferrer">source.variety3.esge-polypectomy-2024</a>.

### question.variety3.snare-seven-mm.v2

Case: `case.variety3.snare-seven-mm`. Art: `patient-demographics20-v4.019`. Age 48, Female.

**Chief complaint:** Colorectal polyp question

**Presentation:** Patricia Adams, a 48-year-old woman, visits the clinic. Patricia brings photographs and a report for an upcoming outside polypectomy. They describe an accessible 7 mm sessile colorectal polyp, without a stalk or features suggesting invasion. The treating endoscopist has selected the lesion for removal. She asks about the planned technique.

**Question:** Which removal technique is preferred for Patricia Adams's accessible 7 mm nonpedunculated colorectal polyp without invasive features?

**Choices - KEY FIRST FOR REVIEW:**

A. Cold snare polypectomy **(key)**

Rationale: Cold snare is the preferred technique for this accessible nonpedunculated polyp in the supplied size range.

Label length: 22 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.polypectomy.cold-snare-small`.

B. Hot snare polypectomy

Rationale: For this supplied small nonpedunculated lesion, the guideline preference is cold snare rather than this electrosurgical snare approach.

Label length: 21 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.polypectomy.cold-snare-small`.

C. Cold biopsy forceps polypectomy

Rationale: Cold forceps are not the preferred excision method for this accessible lesion; complete resection is less reliable than the recommended approach.

Label length: 31 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.polypectomy.cold-snare-small`, `claim.variety3.polypectomy.cold-forceps-limit`.

D. Hot biopsy forceps polypectomy

Rationale: The supported approach for this lesion is cold snare. Hot biopsy forceps introduce additional resection, specimen and thermal-injury concerns rather than improving that choice.

Label length: 30 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.polypectomy.cold-snare-small`, `claim.variety3.polypectomy.hot-forceps-limit`.

**Explanation:** Cold snare is preferred for the supplied small nonpedunculated lesion. The technique choice follows the documented size and nonpedunculated appearance of this accessible polyp.

**Teaching point:** Use the lesion's supplied size and morphology to choose the appropriate small-polyp technique.

**Field-level claim mapping:**

- Presentation: `claim.variety3.polypectomy.cold-snare-small`.
- Task: `claim.variety3.polypectomy.cold-snare-small`.
- Explanation: `claim.variety3.polypectomy.cold-snare-small`.
- Teaching point: `claim.variety3.polypectomy.cold-snare-small`.

**Sources:** <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2024_a-2304-3219.pdf" target="_blank" rel="noopener noreferrer">source.variety3.esge-polypectomy-2024</a>.

## Plan surveillance for nondysplastic Barrett

Concept: `concept.variety3.nondysplastic-barrett-surveillance`. Earliest level: 2. Educational tier: 1.

Objective: Select endoscopic surveillance rather than prophylactic eradication for established nondysplastic Barrett in a suitable patient without a visible neoplastic lesion.

### question.variety3.barrett-nondysplastic-followup.v1

Case: `case.variety3.barrett-nondysplastic-followup`. Art: `patient-demographics20-v4.012`. Age 64, Male.

**Chief complaint:** Barrett follow-up planning

**Presentation:** Charles Miller, a 64-year-old man, visits the clinic. Charles reviews a completed outside gastroscopy and biopsy assessment. It documents an established 3 cm Barrett segment with no dysplasia and no visible neoplastic lesion. This is not an irregular Z-line alone. He is suitable for follow-up and possible treatment if future findings change, and asks about the overall follow-up strategy.

**Question:** Which follow-up strategy best fits Charles Miller's established Barrett esophagus without dysplasia or a visible neoplastic lesion?

**Choices - KEY FIRST FOR REVIEW:**

A. Plan endoscopic surveillance **(key)**

Rationale: Established Barrett without dysplasia or a visible lesion is followed with surveillance in this suitable patient.

Label length: 28 characters. Wait hook: `timing.test.endoscopy_with_sampling` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.

B. Plan radiofrequency ablation

Rationale: Prophylactic ablation is not recommended for the supplied nondysplastic Barrett segment.

Label length: 28 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.barrett.no-prophylactic-ablation`.

C. Plan endoscopic mucosal resection

Rationale: No visible lesion or dysplasia is supplied to change this surveillance decision to a resection plan.

Label length: 33 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.

D. Plan surgical esophageal resection

Rationale: Major resection does not match the surveillance objective for the supplied nondysplastic findings in a suitable follow-up patient.

Label length: 34 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.

**Explanation:** Choose endoscopic surveillance for this suitable patient with established nondysplastic Barrett. Prophylactic ablation is not recommended for the supplied findings. A surveillance decision does not imply zero cancer risk or set a universal examination interval.

**Teaching point:** Nondysplastic Barrett generally calls for surveillance in a suitable patient rather than prophylactic eradication.

**Field-level claim mapping:**

- Presentation: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.
- Task: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.
- Explanation: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.no-prophylactic-ablation`, `claim.variety3.barrett.surveillance-suitability`.
- Teaching point: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.no-prophylactic-ablation`.

**Sources:** <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2023_a-2176-2440.pdf" target="_blank" rel="noopener noreferrer">source.variety3.esge-barrett-2023</a>; <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/barretts-esophagus/diagnosis" target="_blank" rel="noopener noreferrer">source.variety3.niddk-barrett-diagnosis-2024</a>.

### question.variety3.barrett-patient-asks-ablation.v2

Case: `case.variety3.barrett-patient-asks-ablation`. Art: `patient-demographics20-v4.020`. Age 60, Female.

**Chief complaint:** Barrett treatment question

**Presentation:** Nancy Wilson, a 60-year-old woman, visits the clinic. Nancy asks whether an established 4 cm Barrett segment should be removed preemptively. Her completed outside assessment found no dysplasia and no visible lesion requiring resection. She remains suitable for surveillance and for treatment if a future assessment warrants it. The discussion concerns the overall plan, not a specific interval.

**Question:** Which overall follow-up plan best fits Nancy Wilson's established nondysplastic Barrett segment without a visible lesion?

**Choices - KEY FIRST FOR REVIEW:**

A. Plan endoscopic surveillance **(key)**

Rationale: Established Barrett without dysplasia or a visible lesion is followed with surveillance in this suitable patient.

Label length: 28 characters. Wait hook: `timing.test.endoscopy_with_sampling` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.

B. Plan radiofrequency ablation

Rationale: Prophylactic ablation is not recommended for the supplied nondysplastic Barrett segment.

Label length: 28 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.barrett.no-prophylactic-ablation`.

C. Plan endoscopic mucosal resection

Rationale: No visible lesion or dysplasia is supplied to change this surveillance decision to a resection plan.

Label length: 33 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.

D. Plan surgical esophageal resection

Rationale: Major resection does not match the surveillance objective for the supplied nondysplastic findings in a suitable follow-up patient.

Label length: 34 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.

**Explanation:** Endoscopic surveillance is appropriate for the supplied nondysplastic segment and follow-up suitability. The absence of dysplasia does not support prophylactic ablation. Surveillance details require an individualized plan rather than a fixed schedule supplied by this question.

**Teaching point:** Separate nondysplastic Barrett surveillance from treatment pathways for dysplasia or visible neoplasia.

**Field-level claim mapping:**

- Presentation: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.
- Task: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.
- Explanation: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.no-prophylactic-ablation`, `claim.variety3.barrett.surveillance-suitability`.
- Teaching point: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.no-prophylactic-ablation`, `claim.variety3.barrett.surveillance-suitability`.

**Sources:** <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2023_a-2176-2440.pdf" target="_blank" rel="noopener noreferrer">source.variety3.esge-barrett-2023</a>; <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/barretts-esophagus/diagnosis" target="_blank" rel="noopener noreferrer">source.variety3.niddk-barrett-diagnosis-2024</a>.

## Arrange adult support after endoscopic sedation

Concept: `concept.variety3.endoscopic-sedation-escort-planning`. Earliest level: 2. Educational tier: 0.

Objective: Plan responsible adult collection and support after sedated gastroscopy rather than self-driving or unaccompanied travel and recovery.

### question.variety3.sedation-discharge-ride.v1

Case: `case.variety3.sedation-discharge-ride`. Art: `patient-demographics20-v4.016`. Age 67, Male.

**Chief complaint:** Gastroscopy transport planning

**Presentation:** George Harris, a 67-year-old man, visits the clinic. George is preparing for an outside gastroscopy with sedation. He planned to drive himself home because he expects to feel awake after the procedure. A responsible adult is available to collect him and stay with him for the recovery period required by the endoscopy team. He asks which arrangement to book.

**Question:** Which transport and home-support arrangement should George Harris plan after gastroscopy with sedation?

**Choices - KEY FIRST FOR REVIEW:**

A. Responsible adult collection and support **(key)**

Rationale: Arrange a responsible adult to collect and support the patient. This addresses the transport and support needs after sedation.

Label length: 40 characters. Wait hook: no test. Claims: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`.

B. Independent taxi travel and home recovery

Rationale: An unaccompanied taxi and unsupported recovery do not provide the responsible adult collection and support specified for this sedated gastroscopy.

Label length: 41 characters. Wait hook: no test. Claims: `claim.variety3.sedation.adult-collection-support`.

C. Independent bus travel and home recovery

Rationale: Independent travel and recovery do not meet the adult collection and support arrangement needed here.

Label length: 40 characters. Wait hook: no test. Claims: `claim.variety3.sedation.adult-collection-support`.

D. Independent self-driving and home recovery

Rationale: Feeling awake does not remove the sedation transport boundary. Plan a ride and responsible adult support instead of self-driving.

Label length: 42 characters. Wait hook: no test. Claims: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`, `claim.variety3.sedation.residual-effects`.

**Explanation:** Arrange collection and support by a responsible adult. Sedation can affect reactions and judgment despite subjective wakefulness, so self-driving is not the immediate postprocedure plan.

**Teaching point:** Plan adult collection and support after sedation; feeling awake does not establish driving readiness.

**Field-level claim mapping:**

- Presentation: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`.
- Task: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`.
- Explanation: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`, `claim.variety3.sedation.residual-effects`.
- Teaching point: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`, `claim.variety3.sedation.residual-effects`.

**Sources:** <a href="https://www.niddk.nih.gov/health-information/diagnostic-tests/colonoscopy" target="_blank" rel="noopener noreferrer">source.variety3.niddk-colonoscopy-2023</a>; <a href="https://www.gloshospitals.nhs.uk/your-visit/patient-information-leaflets/discharge-advice-following-a-gastroscopy-with-sedation/" target="_blank" rel="noopener noreferrer">source.variety3.glos-sedation-2026</a>.

### question.variety3.sedation-unaccompanied-taxi.v2

Case: `case.variety3.sedation-unaccompanied-taxi`. Art: `patient-demographics20-v4.013`. Age 67, Female.

**Chief complaint:** Sedation discharge questions

**Presentation:** Carol Foster, a 67-year-old woman, visits the clinic. Carol is attending a preprocedure review for outside gastroscopy with sedation. She proposes taking a taxi alone and recovering at home without help. Her sister can instead collect her and provide the support requested by the endoscopy team. Carol expects to feel alert and asks which travel plan fits the sedation arrangements.

**Question:** Which discharge travel and home-support plan should Carol Foster choose for her sedated gastroscopy?

**Choices - KEY FIRST FOR REVIEW:**

A. Responsible adult collection and support **(key)**

Rationale: Arrange a responsible adult to collect and support the patient. This addresses the transport and support needs after sedation.

Label length: 40 characters. Wait hook: no test. Claims: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`.

B. Independent taxi travel and home recovery

Rationale: An unaccompanied taxi and unsupported recovery do not provide the responsible adult collection and support specified for this sedated gastroscopy.

Label length: 41 characters. Wait hook: no test. Claims: `claim.variety3.sedation.adult-collection-support`.

C. Independent bus travel and home recovery

Rationale: Independent travel and recovery do not meet the adult collection and support arrangement needed here.

Label length: 40 characters. Wait hook: no test. Claims: `claim.variety3.sedation.adult-collection-support`.

D. Independent self-driving and home recovery

Rationale: Feeling awake does not remove the sedation transport boundary. Plan a ride and responsible adult support instead of self-driving.

Label length: 42 characters. Wait hook: no test. Claims: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`, `claim.variety3.sedation.residual-effects`.

**Explanation:** Her sister's collection and support meet the responsible-adult arrangement for this planned sedated gastroscopy. A taxi alone does not supply that support. Subjective alertness does not remove residual sedation effects on judgment and reactions.

**Teaching point:** An available ride alone is different from the adult collection and support needed after sedated gastroscopy.

**Field-level claim mapping:**

- Presentation: `claim.variety3.sedation.adult-collection-support`, `claim.variety3.sedation.residual-effects`.
- Task: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`.
- Explanation: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`, `claim.variety3.sedation.residual-effects`.
- Teaching point: `claim.variety3.sedation.adult-collection-support`.

**Sources:** <a href="https://www.niddk.nih.gov/health-information/diagnostic-tests/colonoscopy" target="_blank" rel="noopener noreferrer">source.variety3.niddk-colonoscopy-2023</a>; <a href="https://www.gloshospitals.nhs.uk/your-visit/patient-information-leaflets/discharge-advice-following-a-gastroscopy-with-sedation/" target="_blank" rel="noopener noreferrer">source.variety3.glos-sedation-2026</a>.

## Clarify a preoperative penicillin label

Concept: `concept.variety3.penicillin-label-structured-history`. Earliest level: 3. Educational tier: 0.

Objective: Obtain a structured reaction history before selecting testing, referral or a record change for an incompletely characterized penicillin-allergy label before ASC care.

### question.variety3.allergy-childhood-label.v1

Case: `case.variety3.allergy-childhood-label`. Art: `patient-demographics20-v4.017`. Age 68, Male.

**Chief complaint:** Antibiotic allergy review

**Presentation:** William Scott, a 68-year-old man, visits the clinic. William is reviewing plans for an outside ambulatory operation. His chart lists penicillin allergy from childhood, but neither he nor the record identifies the symptoms, timing or severity. The team has not chosen an allergy-evaluation pathway or changed the entry. He asks what should happen first.

**Question:** Which initial evaluation step should clarify William Scott's undocumented penicillin-allergy label before ambulatory surgery?

**Choices - KEY FIRST FOR REVIEW:**

A. Obtain a detailed drug-reaction history **(key)**

Rationale: Clarify the original drug, symptoms, timing, severity and later exposures before choosing an evaluation pathway or changing the record.

Label length: 39 characters. Wait hook: no test. Claims: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

B. Schedule penicillin skin prick testing

Rationale: Testing should follow history and risk assessment; an incompletely characterized label does not by itself select this pathway.

Label length: 38 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

C. Schedule a supervised oral drug challenge

Rationale: A supervised challenge can be appropriate for selected patients, but this incomplete history has not yet established suitability.

Label length: 41 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

D. Remove penicillin from the allergy record

Rationale: The record should not be changed solely because the reaction is unclear. First characterize the history and assess the appropriate evaluation.

Label length: 41 characters. Wait hook: no test. Claims: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

**Explanation:** Begin by characterizing the original reaction and subsequent drug exposures. The label alone neither confirms immune-mediated allergy nor selects a testing or delabeling pathway. Risk assessment follows the history; this case does not choose a prophylactic medicine.

**Teaching point:** An uncertain allergy label calls for reaction history before a testing or record-change decision.

**Field-level claim mapping:**

- Presentation: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`.
- Task: `claim.variety3.allergy.characterize-reaction`.
- Explanation: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.
- Teaching point: `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

**Sources:** <a href="https://www.cdc.gov/antibiotic-use/hcp/clinical-signs/index.html" target="_blank" rel="noopener noreferrer">source.variety3.cdc-penicillin-allergy-2025</a>; <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10886174/" target="_blank" rel="noopener noreferrer">source.variety3.sexton-kuruvilla-allergy-2024</a>.

### question.variety3.allergy-vague-reaction.v2

Case: `case.variety3.allergy-vague-reaction`. Art: `patient-demographics20-v4.015`. Age 71, Female.

**Chief complaint:** Pre-op allergy questions

**Presentation:** Dorothy Allen, a 71-year-old woman, visits the clinic. Dorothy brings an outside ASC referral with a penicillin-allergy entry reading only 'felt unwell.' She cannot yet recall whether there was a rash, breathing difficulty, gastrointestinal upset or another reaction. No detailed prior note or subsequent-exposure history is available. She asks how to begin clarifying the entry before her operation.

**Question:** Which first step should the clinician take to evaluate Dorothy Allen's incompletely described penicillin reaction before ASC care?

**Choices - KEY FIRST FOR REVIEW:**

A. Obtain a detailed drug-reaction history **(key)**

Rationale: Clarify the original drug, symptoms, timing, severity and later exposures before choosing an evaluation pathway or changing the record.

Label length: 39 characters. Wait hook: no test. Claims: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

B. Schedule penicillin skin prick testing

Rationale: Testing should follow history and risk assessment; an incompletely characterized label does not by itself select this pathway.

Label length: 38 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

C. Schedule a supervised oral drug challenge

Rationale: A supervised challenge can be appropriate for selected patients, but this incomplete history has not yet established suitability.

Label length: 41 characters. Wait hook: `timing.test.clinical_procedure` (runtime placeholder estimate; no fixed prose duration). Claims: `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

D. Remove penicillin from the allergy record

Rationale: The record should not be changed solely because the reaction is unclear. First characterize the history and assess the appropriate evaluation.

Label length: 41 characters. Wait hook: no test. Claims: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

**Explanation:** Obtain a detailed history of the drug and reaction, including timing, severity and later exposures. 'Felt unwell' is insufficient to confirm allergy or determine suitability for a challenge or skin testing. Do not infer automatic label removal or a particular antibiotic from the incomplete entry.

**Teaching point:** Clarify symptoms and context before turning a vague penicillin label into a testing or delabeling plan.

**Field-level claim mapping:**

- Presentation: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`.
- Task: `claim.variety3.allergy.characterize-reaction`.
- Explanation: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.
- Teaching point: `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

**Sources:** <a href="https://www.cdc.gov/antibiotic-use/hcp/clinical-signs/index.html" target="_blank" rel="noopener noreferrer">source.variety3.cdc-penicillin-allergy-2025</a>; <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10886174/" target="_blank" rel="noopener noreferrer">source.variety3.sexton-kuruvilla-allergy-2024</a>.

## Plan appropriate surgical hair preparation

Concept: `concept.variety3.surgical-hair-preparation`. Earliest level: 3. Educational tier: 0.

Objective: Leave noninterfering surgical-site hair alone and select clippers when removal is needed for a supplied non-genital ambulatory operative field.

### question.variety3.hair-no-interference.v1

Case: `case.variety3.hair-no-interference`. Art: `patient-demographics20-v4.018`. Age 71, Male.

**Chief complaint:** Surgical preparation questions

**Presentation:** Frank Mitchell, a 71-year-old man, visits the clinic. Frank is discussing preparation for an outside ambulatory forearm procedure. The operative team confirms that the hair at this non-genital site will not interfere with the incision, preparation or dressing. He asks whether the area should be cleared simply because an operation is planned.

**Question:** Which hair-preparation plan best fits Frank Mitchell's non-genital operative site when hair does not interfere with the procedure?

**Choices - KEY FIRST FOR REVIEW:**

A. Leave the operative-field hair intact **(key)**

Rationale: Hair that does not interfere with the operation does not require routine removal.

Label length: 37 characters. Wait hook: no test. Claims: `claim.variety3.hair.no-routine-removal`.

B. Clip the operative-field hair short

Rationale: Clippers are an option when removal is needed, but the team has identified no interference requiring removal here.

Label length: 35 characters. Wait hook: no test. Claims: `claim.variety3.hair.no-routine-removal`, `claim.variety3.hair.clippers-if-needed`.

C. Shave the operative-field hair smooth

Rationale: Routine razor shaving is not the supported approach for this non-genital field, and removal is unnecessary in the supplied plan.

Label length: 37 characters. Wait hook: no test. Claims: `claim.variety3.hair.no-routine-removal`, `claim.variety3.hair.avoid-razor-nongenital`.

D. Remove the operative-field hair chemically

Rationale: Although a depilatory can be a removal option when needed, no hair removal is required in this noninterfering field.

Label length: 42 characters. Wait hook: no test. Claims: `claim.variety3.hair.no-routine-removal`, `claim.variety3.hair.depilatory-alternative`.

**Explanation:** Leave the noninterfering hair intact. The operation itself is not a reason for routine hair removal. This supplied non-genital preparation question does not apply a universal rule to genital or scrotal procedures.

**Teaching point:** Remove surgical-site hair only when the operative plan requires it.

**Field-level claim mapping:**

- Presentation: `claim.variety3.hair.no-routine-removal`.
- Task: `claim.variety3.hair.no-routine-removal`.
- Explanation: `claim.variety3.hair.no-routine-removal`, `claim.variety3.hair.avoid-razor-nongenital`.
- Teaching point: `claim.variety3.hair.no-routine-removal`.

**Sources:** <a href="https://stacks.cdc.gov/view/cdc/155079/cdc_155079_DS1.pdf" target="_blank" rel="noopener noreferrer">source.variety3.shea-ssi-update-2023</a>.

### question.variety3.hair-clippers-needed.v2

Case: `case.variety3.hair-clippers-needed`. Art: `patient-demographics20-v4.014`. Age 68, Female.

**Chief complaint:** Incision preparation planning

**Presentation:** Barbara Hughes, a 68-year-old woman, visits the clinic. Barbara is reviewing preparation for an outside ambulatory abdominal procedure. Hair at the non-genital operative site interferes with the team's planned skin preparation and dressing. The team has determined that local hair removal is needed and has clippers available. She asks which method fits that plan.

**Question:** Which available hair-preparation method should Barbara Hughes's team choose when removal is needed at a non-genital operative site?

**Choices - KEY FIRST FOR REVIEW:**

A. Clip the interfering hair short **(key)**

Rationale: Clippers are an appropriate method when the supplied non-genital operative field requires hair removal.

Label length: 31 characters. Wait hook: no test. Claims: `claim.variety3.hair.clippers-if-needed`.

B. Shave the interfering hair smooth

Rationale: Razor shaving is avoided for routine preparation of this non-genital field when clipping is available.

Label length: 33 characters. Wait hook: no test. Claims: `claim.variety3.hair.clippers-if-needed`, `claim.variety3.hair.avoid-razor-nongenital`.

C. Leave the interfering hair intact

Rationale: The operative team has already identified interference requiring removal; leaving it intact does not meet the supplied preparation plan.

Label length: 33 characters. Wait hook: no test. Claims: `claim.variety3.hair.no-routine-removal`, `claim.variety3.hair.clippers-if-needed`.

D. Pluck the interfering hair completely

Rationale: Plucking is not the guideline-supported method selected for this supplied field; clippers provide the appropriate offered option.

Label length: 37 characters. Wait hook: no test. Claims: `claim.variety3.hair.clippers-if-needed`.

**Explanation:** Choose clippers for the supplied non-genital field when removal is required. A depilatory agent is another guideline-supported option. Routine razor shaving is avoided for this non-genital field.

**Teaching point:** When local hair removal is needed, choose an appropriate method rather than routine razor shaving.

**Field-level claim mapping:**

- Presentation: `claim.variety3.hair.clippers-if-needed`.
- Task: `claim.variety3.hair.clippers-if-needed`.
- Explanation: `claim.variety3.hair.no-routine-removal`, `claim.variety3.hair.clippers-if-needed`, `claim.variety3.hair.depilatory-alternative`, `claim.variety3.hair.avoid-razor-nongenital`.
- Teaching point: `claim.variety3.hair.clippers-if-needed`, `claim.variety3.hair.avoid-razor-nongenital`.

**Sources:** <a href="https://stacks.cdc.gov/view/cdc/155079/cdc_155079_DS1.pdf" target="_blank" rel="noopener noreferrer">source.variety3.shea-ssi-update-2023</a>.

## Withheld extensions and source exclusions

- **Universal soap recommendation for pruritus ani:** NHS permits an unscented soap alternative, whereas ASCRS advises avoiding soap. Both support gentle water cleansing and drying. A universal soap rule is withheld; the cases select their shared water-care approach and reject vigorous irritating-product use.
- **Mandatory same-day or next-day repeat after inadequate preparation:** ESGE reports limited/conflicting same-day/next-day evidence. Both sources support an adequately prepared repeat; the disputed scheduling extension is withheld, not averaged into a fixed rule.
- **Universal cefazolin selection from a penicillin label:** The perioperative review describes differences between older guidance and newer allergy recommendations. This batch stops at history/risk assessment; drug selection and challenging serious reaction histories require separate clinician review.
- **Thrombosed-hemorrhoid procedural timing:** Recognition sources do not justify a universal treatment-window or automatic excision rule; no hemorrhoid procedure decision is authored.
- **Numerical follow-up and recovery schedules:** Fixed Barrett intervals, sedation-driving clearance times and laxative regimens are outside the selected one-decision objectives and are not authored.
- **Genital/scrotal hair preparation:** The hair guideline has a procedure-specific exception; the cases explicitly use non-genital fields and do not teach a universal razor rule.
- **Allergy delabeling and challenge protocols:** History-first assessment does not authorize automatic record removal, unselected testing, a challenge protocol or a specific prophylactic medicine.
- **Routine preoperative testing and PONV extensions:** NICE AI-use restriction and ASA permission restriction exclude their material. These topics were not selected; no restricted clinical content was retrieved for this batch.
- **Independent polypectomy guideline cross-check:** The attempted ASGE guideline PDF and AGA recommendations page were not accessible as directly readable eligible content. Search snippets are not evidence; ESGE 2024 remains the sole adequate direct source.
- **Independent hair-preparation cross-check:** CDC's general SSI page did not expose readable clinical text and the attempted NHS leaflet was inaccessible. Neither is used as evidence. The licensed SHEA/IDSA/APIC guideline remains the sole adequate direct source.

## Atomic evidence claims

Each statement is independently worded. Certainty is editorial evidence assessment, not clinician sign-off. Limitations and population boundaries remain attached to the exact claim version.

### claim.variety3.diastasis.midline-separation

Rectus diastasis is widening of the midline connective tissue between the rectus muscles.

Category: definition; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with supplied abdominal-wall examination findings.

Limitation: EHS KQ1 and current NHS leaflet. No numerical separation cutoff, demographic probability or treatment rule is used; EHS describes limited evidence.

Sources: `source.variety3.ehs-diastasis-2021`, `source.variety3.kent-diastasis-2026`.

### claim.variety3.diastasis.broad-doming

Rectus separation can produce a broad midline dome when the abdominal wall is engaged.

Category: presentation; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with broad midline doming during a supplied examination.

Limitation: Current NHS leaflet is the sole direct source for the dome description. A clinical pattern, not a pathognomonic sign or proof from appearance alone.

Sources: `source.variety3.kent-diastasis-2026`.

### claim.variety3.diastasis.clinical-assessment

Clinical examination is generally sufficient to identify rectus diastasis.

Category: evaluation; certainty: low; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults undergoing clinical assessment of rectus separation.

Limitation: EHS KQ2, low-quality evidence. Imaging may be useful when another question, including a coexisting hernia, needs assessment. These recognition cases do not establish a universal no-imaging rule.

Sources: `source.variety3.ehs-diastasis-2021`.

### claim.variety3.diastasis.hernia-distinction

A focal abdominal-wall hernia involves protrusion through a gap or weak area rather than rectus separation alone.

Category: definition; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults distinguishing a supplied separation pattern from a focal hernia.

Limitation: Independent synthesis of NHS hernia definition and EHS diastasis definition/coexisting-hernia discussion. The two can coexist; the supplied examination identifies no focal defect. No assertion that examination excludes all hernias.

Sources: `source.variety3.nhs-hernia-2026`, `source.variety3.ehs-diastasis-2021`.

### claim.variety3.epidermoid.slow-punctum-pattern

An epidermoid cyst often presents as a slowly growing cutaneous lump with a central punctum.

Category: presentation; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with an uncomplicated slowly enlarging skin lump.

Limitation: Hoang clinical/pathophysiology sections plus broad NHS skin-cyst corroboration. Presumptive recognition, not histologic confirmation. The NHS displayed review date is 2023 with an overdue 2026 review marker.

Sources: `source.variety3.hoang-epidermoid-2019`, `source.variety3.nhs-skin-cyst-2023`.

### claim.variety3.epidermoid.differential-pattern

A central punctum supports epidermoid cyst over the described lipoma and trichilemmal-cyst differentials.

Category: evaluation; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults comparing proposed diagnoses for a supplied cutaneous lump.

Limitation: Sole direct descriptive source, section 4. Not an absolute diagnostic exclusion rule: the case supplies a punctum-bearing lesion, and the learner selects the best fit rather than confirming pathology.

Sources: `source.variety3.hoang-epidermoid-2019`.

### claim.variety3.epidermoid.inflammation-context

A skin cyst can become inflamed and painful, so tenderness alone does not define every cyst as an abscess.

Category: safety_boundary; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with a supplied noninflamed punctum-bearing lump.

Limitation: Sources support possible inflammation; the cases supply no redness, tenderness or draining collection. No infection probability, antibiotic indication or drainage/excision protocol is inferred.

Sources: `source.variety3.hoang-epidermoid-2019`, `source.variety3.nhs-skin-cyst-2023`.

### claim.variety3.hemorrhoid.external-thrombosis

A blood clot within an external hemorrhoid produces a thrombosed external hemorrhoid.

Category: definition; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with an examined clot-filled external anal-margin lump.

Limitation: Sole direct clot-definition source is undated public ASCRS education, not a formal management guideline. No fixed symptom window or automatic excision recommendation.

Sources: `source.variety3.ascrs-hemorrhoids`.

### claim.variety3.hemorrhoid.tender-margin-lump

External hemorrhoids can present as a tender, painful lump at the anal margin.

Category: presentation; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with an acutely painful external anal-margin lump.

Limitation: Independent specialist/government recognition sources. NIDDK review date is 2016. Pain is nonspecific; supplied examination shows the external clot and excludes a visible tear or draining collection.

Sources: `source.variety3.ascrs-hemorrhoids`, `source.variety3.niddk-hemorrhoids-2016`.

### claim.variety3.hemorrhoid.internal-location

Internal hemorrhoids arise within the anal canal and may protrude through the anus.

Category: anatomy; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults distinguishing a supplied external lesion from internal prolapse.

Limitation: Anatomic distinction only. Internal prolapse can also hurt; pain alone does not distinguish internal and external disease. The cases explicitly locate the clot under external anal skin, without protruding mucosal tissue.

Sources: `source.variety3.ascrs-hemorrhoids`, `source.variety3.niddk-hemorrhoids-2016`.

### claim.variety3.hemorrhoid.assessment-boundary

Anal symptoms require assessment rather than automatic attribution to hemorrhoids.

Category: safety_boundary; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with anal pain or a perianal lump.

Limitation: Sources emphasize other possible causes. The draft supplies an examination, not a rule to diagnose from a patient's complaint or to ignore bleeding. No treatment decision is tested.

Sources: `source.variety3.niddk-hemorrhoids-2016`, `source.variety3.ascrs-hemorrhoids`.

### claim.variety3.pruritus.irritant-cleaning

Repeated vigorous cleansing can irritate perianal skin and worsen anal itching.

Category: presentation; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with assessed perianal irritation and excessive cleansing.

Limitation: Society/government patient guidance; not a diagnostic accuracy claim or proof of the cause in every person. Cases supply examination and irritant exposure, without a focal lesion requiring different care.

Sources: `source.variety3.ascrs-pruritus-ani`, `source.variety3.nhs-itchy-anus-2023`.

### claim.variety3.pruritus.gentle-water-drying

Gentle water cleansing followed by patting the area dry is an appropriate basic skin-care measure for pruritus ani.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with assessed uncomplicated anal itching.

Limitation: Two independent guidance sources, but neither a current formal management guideline. Limited to assessed uncomplicated irritation; no medication, prescribed device or guaranteed response is claimed.

Sources: `source.variety3.ascrs-pruritus-ani`, `source.variety3.nhs-itchy-anus-2023`.

### claim.variety3.pruritus.avoid-irritants

Avoiding fragranced products and abrasive cleaning helps reduce perianal irritation.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with perianal itching while using irritating products.

Limitation: Sources agree on avoiding irritation. ASCRS mentions some gentle wiping options; this is not interpreted as endorsing fragranced wipes. No blanket claim that every wipe or every cleanser is harmful.

Sources: `source.variety3.nhs-itchy-anus-2023`, `source.variety3.ascrs-pruritus-ani`.

### claim.variety3.pruritus.reassessment-boundary

Persistent or otherwise concerning anal itching warrants reassessment for an underlying cause.

Category: safety_boundary; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults receiving basic skin-care counseling for anal itching.

Limitation: No fixed follow-up interval or red-flag algorithm is authored. The initial skin-care choice is not a substitute for examining a lesion or reassessing ongoing symptoms.

Sources: `source.variety3.nhs-itchy-anus-2023`, `source.variety3.ascrs-pruritus-ani`.

### claim.variety3.preparation.inadequate-assessment

Colonoscopy with inadequate cleansing may fail to assess the colonic lining adequately.

Category: evaluation; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults reviewing a colonoscopy that cannot support a standard screening assessment.

Limitation: Official ESGE guideline plus directly read 2025 society summary; the latter is not the full USMSTF guideline. Cases specify inadequate assessment throughout the colon after attempted cleaning, excluding the partial-distal-examination exception.

Sources: `source.variety3.esge-bowel-prep-2019`, `source.variety3.acg-prep-summary-2025`.

### claim.variety3.preparation.repeat-examination

An inadequately prepared colonoscopy that cannot support the intended assessment should be repeated with adequate preparation.

Category: management; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults suitable for repeat colonoscopy after an entirely inadequate screening examination.

Limitation: Current society summary corroborates guideline direction. No universal numerical interval or mandatory same/next-day schedule; timing, contraindications and urgency require the treating team's assessment. Alternative screening proposals do not complete the inadequate examination in these cases.

Sources: `source.variety3.esge-bowel-prep-2019`, `source.variety3.acg-prep-summary-2025`.

### claim.variety3.preparation.review-failure

Reviewing why preparation failed can guide improved instructions and an individualized repeat-preparation plan.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults planning repeat colonoscopy after inadequate bowel cleansing.

Limitation: Source-supported planning only. No specific laxative formulation, dose, diet duration, split-dose timetable or contraindication protocol is authored.

Sources: `source.variety3.esge-bowel-prep-2019`, `source.variety3.acg-prep-summary-2025`.

### claim.variety3.polypectomy.cold-snare-diminutive

Cold snare is the preferred removal technique for an accessible diminutive nonpedunculated colorectal polyp without invasive features.

Category: management; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with a supplied accessible 4 mm nonpedunculated colorectal polyp selected for removal.

Limitation: Sole adequate directly read guideline, ESGE 2024 section 7.1, strong recommendation/high-quality evidence for polyps at most 5 mm; the synthetic example is 4 mm. No technique algorithm, margin width, risk estimate or difficult-access exception is authored.

Sources: `source.variety3.esge-polypectomy-2024`.

### claim.variety3.polypectomy.cold-snare-small

Cold snare is the preferred removal technique for a small nonpedunculated colorectal polyp without invasive features.

Category: management; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with a supplied accessible 7 mm nonpedunculated colorectal polyp selected for removal.

Limitation: Sole adequate directly read guideline, ESGE 2024 section 7.2, strong recommendation/high-quality evidence for 6-9 mm polyps; the example is 7 mm. Excludes pedunculated, invasive-appearing and complex lesions and medication-specific planning.

Sources: `source.variety3.esge-polypectomy-2024`.

### claim.variety3.polypectomy.cold-forceps-limit

Cold forceps are not the preferred excision method for the supplied 4 mm or 7 mm polyps because complete resection is less reliable.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults comparing techniques for the supplied accessible 4 mm or 7 mm lesions.

Limitation: Sole adequate guideline, sections 7.1/7.2 and recommendation against routine cold-forceps excision. Very tiny or difficult-access exceptions are outside these cases; no numerical recurrence estimate.

Sources: `source.variety3.esge-polypectomy-2024`.

### claim.variety3.polypectomy.hot-forceps-limit

Hot biopsy forceps are discouraged for diminutive colorectal-polyp excision because of resection, specimen and thermal-injury concerns.

Category: safety_boundary; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults comparing forceps and snare plans for the supplied small lesions.

Limitation: Sole adequate direct guideline, section 7.1, strong/high-quality recommendation. No exact risk estimate or categorical prohibition on all electrosurgical techniques. For the 7 mm case, the cold-snare preference supplies the direct rejection basis.

Sources: `source.variety3.esge-polypectomy-2024`.

### claim.variety3.barrett.surveillance-plan

Endoscopic surveillance is an appropriate follow-up strategy for established nondysplastic Barrett esophagus in a suitable patient.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with established nondysplastic Barrett who are suitable for surveillance.

Limitation: Official ESGE guideline plus independent current government surveillance explanation. Cases supply established segments, no dysplasia/visible lesion and suitability for follow-up/treatment. No interval, zero-risk claim or prophylactic surgery indication.

Sources: `source.variety3.esge-barrett-2023`, `source.variety3.niddk-barrett-diagnosis-2024`.

### claim.variety3.barrett.no-prophylactic-ablation

Prophylactic endoscopic ablation is not recommended for Barrett esophagus without dysplasia.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with confirmed nondysplastic Barrett and no visible neoplastic lesion.

Limitation: Sole direct guideline for this negative recommendation; NIDDK only corroborates surveillance. This is not applied to confirmed dysplasia or cancer. No promise that Barrett has no cancer risk.

Sources: `source.variety3.esge-barrett-2023`.

### claim.variety3.barrett.surveillance-suitability

Barrett surveillance planning depends on the established segment and the patient's suitability for surveillance and possible treatment.

Category: safety_boundary; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults planning follow-up for established nondysplastic Barrett.

Limitation: Do not extrapolate to an irregular Z-line, limited life expectancy, confirmed dysplasia or visible neoplasia. All numerical surveillance/cessation schedules are withheld in this batch.

Sources: `source.variety3.esge-barrett-2023`, `source.variety3.niddk-barrett-diagnosis-2024`.

### claim.variety3.sedation.no-self-driving

A patient receiving endoscopic sedation should arrange transport home rather than plan to drive immediately afterward.

Category: disposition; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults arranging discharge after planned sedated gastroscopy.

Limitation: Current gastroscopy-specific NHS advice and independent NIDDK colonoscopy transport boundary. Cases use planned gastroscopy with sedation. No universal elapsed-time clearance or substitution for formal discharge criteria.

Sources: `source.variety3.glos-sedation-2026`, `source.variety3.niddk-colonoscopy-2023`.

### claim.variety3.sedation.adult-collection-support

A responsible adult should collect and support the patient after gastroscopy with sedation.

Category: disposition; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults preparing for gastroscopy with sedation and an available responsible adult.

Limitation: Sole direct source for collection plus ongoing adult support is the current trust leaflet. Government colonoscopy advice corroborates the ride, not this entire support arrangement. Local discharge policy and clinical readiness remain separate.

Sources: `source.variety3.glos-sedation-2026`.

### claim.variety3.sedation.residual-effects

Sedation can affect judgment and reactions despite the patient feeling awake after the procedure.

Category: safety_boundary; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults discussing travel after gastroscopy with sedation.

Limitation: Sole direct current gastroscopy discharge source. Subjective wakefulness is not driving clearance; no duration, test score or claim that adult accompaniment alone establishes discharge fitness.

Sources: `source.variety3.glos-sedation-2026`.

### claim.variety3.allergy.label-not-confirmation

A penicillin-allergy label does not by itself confirm an immune-mediated penicillin reaction.

Category: evaluation; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with an incompletely characterized penicillin-allergy entry before ASC care.

Limitation: Current CDC guidance and eligible perioperative review. Labels can reflect incomplete or nonallergic histories; this does not mean every label is false or authorize automatic removal. No prevalence or cross-reactivity percentage.

Sources: `source.variety3.cdc-penicillin-allergy-2025`, `source.variety3.sexton-kuruvilla-allergy-2024`.

### claim.variety3.allergy.characterize-reaction

Characterizing the original drug, reaction symptoms, timing, severity and subsequent exposures is an initial step in evaluating a penicillin-allergy label.

Category: evaluation; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults whose preoperative allergy record lacks a detailed reaction history.

Limitation: Current CDC clinical questions plus perioperative history/risk-assessment discussion. The draft asks for history first, without choosing a prophylactic drug, skin-test protocol or oral-challenge procedure.

Sources: `source.variety3.cdc-penicillin-allergy-2025`, `source.variety3.sexton-kuruvilla-allergy-2024`.

### claim.variety3.allergy.assessment-before-testing

Reaction history and risk assessment should guide whether further penicillin-allergy testing or referral is appropriate.

Category: safety_boundary; certainty: high; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults undergoing assessment of an uncertain preoperative penicillin label.

Limitation: Not everyone is eligible for the same testing pathway, and severe delayed reactions require a different approach. No unsupervised challenge, universal skin testing, automatic delabeling or cefazolin-selection rule is taught.

Sources: `source.variety3.cdc-penicillin-allergy-2025`, `source.variety3.sexton-kuruvilla-allergy-2024`.

### claim.variety3.hair.no-routine-removal

Surgical-site hair need not be removed when it does not interfere with the operation.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults preparing for a non-genital ambulatory procedure with noninterfering hair.

Limitation: Sole adequate direct guideline, essential-practices section 4.5. Acute-care hospital recommendation applied to a supplied non-genital ambulatory preparation plan; clinician review of that application is required. No routine-removal benefit or exact SSI probability is claimed.

Sources: `source.variety3.shea-ssi-update-2023`.

### claim.variety3.hair.clippers-if-needed

When surgical-site hair must be removed, clippers are an appropriate method for the supplied non-genital operative field.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults with hair interfering with preparation of a non-genital ambulatory operative field.

Limitation: Sole adequate guideline, section 4.5. Depilatory agents are another guideline option and are not presented as incorrect when removal is needed. Clippers are available in the case; no precise preparation timetable, device protocol or genital-field extrapolation.

Sources: `source.variety3.shea-ssi-update-2023`.

### claim.variety3.hair.depilatory-alternative

A depilatory agent is another guideline-supported option when surgical-site hair removal is needed.

Category: management; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults discussing necessary non-genital surgical-site hair removal.

Limitation: Sole adequate guideline, section 4.5. This acknowledges an alternative rather than prescribing a formulation or declaring every product appropriate. No depilatory is required when hair does not interfere; non-genital fields only.

Sources: `source.variety3.shea-ssi-update-2023`.

### claim.variety3.hair.avoid-razor-nongenital

Razor shaving is avoided for routine hair preparation of the supplied non-genital surgical field.

Category: safety_boundary; certainty: moderate; last checked: 2026-10-10; review: needs_clinician_review.

Population: Adults comparing preparation plans for a non-genital operative field.

Limitation: Sole adequate guideline. The guideline includes a genital/scrotal exception; those operations are explicitly outside this objective. No universal statement about every procedure or exact infection-risk multiplier.

Sources: `source.variety3.shea-ssi-update-2023`.

## Complete sources and attribution

Bibliographic titles identify sources; no source excerpts, full text, tables or algorithms are reproduced. Authority and reuse permission are assessed separately.

### source.variety3.ehs-diastasis-2021

Hernández-Granados P, Henriksen NA, Berrevoet F, Cuccurullo D, López-Cano M, Nienhuijs S, Ross D, Montgomery A. European Hernia Society guidelines on management of rectus diastasis. Br J Surg. 2021;108(10):1189-1191. doi:10.1093/bjs/znab128. Accessed 10 October 2026.

<a href="https://europeanherniasociety.eu/guidelines-for-management-of-rectus-diastasis/" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://doi.org/10.1093/bjs/znab128" target="_blank" rel="noopener noreferrer">DOI</a>; <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">License</a>.

Authority: EHS guideline, still linked in its guideline catalog at access. KQ1/KQ2 define separation and clinical examination; evidence is limited and many recommendations reflect expert consensus. No size cutoff, surgery selection or exercise regimen is authored.

Class/use: professional_society_guideline / evidence. Accessed 2026-10-10 via licensed_europe_pmc_xml_targeted_read.

License: CC BY-NC 4.0 (article license verified in Europe PMC XML). Reuse status: cc_by_nc_4_0_restricted. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Noncommercial license restrictions are retained; no article adaptation is distributed. Credit all authors and link the original article and license.

Supported claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.clinical-assessment`, `claim.variety3.diastasis.hernia-distinction`.

### source.variety3.kent-diastasis-2026

Kent Community Health NHS Foundation Trust. Diastasis rectus abdominus. Patient leaflet 01414; last edited 18 September 2026. Accessed 10 October 2026.

<a href="https://www.kentcht.nhs.uk/leaflet/diastasis-rectus-abdominus/" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Current official NHS physiotherapy leaflet corroborating widened midline tissue, doming and occurrence in adults of either sex. Not an independent operative guideline or a diagnostic accuracy study.

Class/use: government_guidance / cross_check. Accessed 2026-10-10 via primary_html_targeted_read.

License: Copyright NHS trust; leaflet explicitly requires permission for reproduction. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.

Supported claims: `claim.variety3.diastasis.midline-separation`, `claim.variety3.diastasis.broad-doming`.

### source.variety3.nhs-hernia-2026

NHS website editorial team. Hernia. Reviewed 19 May 2026. Accessed 10 October 2026.

<a href="https://www.nhs.uk/conditions/hernia/" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">License</a>.

Authority: Current national patient information directly supporting the protrusion-through-a-gap/weak-area definition. No copied hernia table or urgency algorithm; no inference that examination excludes every coexisting hernia.

Class/use: government_guidance / cross_check. Accessed 2026-10-10 via primary_html_targeted_read.

License: Open Government Licence v3.0 where applicable; images, logos and third-party material excluded. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Contains public sector information licensed under the Open Government Licence v3.0. The reuse enum is conservative because it has no OGL category.

Supported claims: `claim.variety3.diastasis.hernia-distinction`.

### source.variety3.hoang-epidermoid-2019

Hoang VT, Trinh CT, Nguyen CH, Chansomphou V, Chansomphou V, Tran TTT. Overview of epidermoid cyst. Eur J Radiol Open. 2019;6:291-301. Published 5 September 2019. doi:10.1016/j.ejro.2019.08.003. PMID:31516916. Accessed 10 October 2026.

<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6732711/" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://doi.org/10.1016/j.ejro.2019.08.003" target="_blank" rel="noopener noreferrer">DOI</a>; <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">License</a>.

Authority: Open narrative review: clinical and pathophysiology sections support punctum, slow growth and differential features. Older descriptive evidence, not proof of histology in an individual or an excision policy. License verified on the actual article, not inferred from PMC availability.

Class/use: narrative_review / evidence. Accessed 2026-10-10 via primary_html_targeted_read.

License: CC BY-NC-ND 4.0. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. This source permits neither commercial reuse nor distribution of adaptations under its license. Only facts were checked, with no article adaptation, illustration or prose distributed.

Supported claims: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.differential-pattern`, `claim.variety3.epidermoid.inflammation-context`.

### source.variety3.nhs-skin-cyst-2023

NHS website editorial team. Skin cyst. Reviewed 9 May 2023; displayed next review due 9 May 2026. Accessed 10 October 2026.

<a href="https://www.nhs.uk/conditions/skin-cyst/" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">License</a>.

Authority: National patient information corroborating slow growth, a central dark spot and possible inflammation. Broad skin-cyst page, not a definitive epidermoid-versus-pilar diagnostic guideline.

Class/use: government_guidance / cross_check. Accessed 2026-10-10 via primary_html_targeted_read.

License: Open Government Licence v3.0 where applicable; images, logos and third-party material excluded. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Contains public sector information licensed under the Open Government Licence v3.0. The reuse enum is conservative because it has no OGL category.

Supported claims: `claim.variety3.epidermoid.slow-punctum-pattern`, `claim.variety3.epidermoid.inflammation-context`.

### source.variety3.ascrs-hemorrhoids

American Society of Colon and Rectal Surgeons. Hemorrhoids. Public patient-education page; undated. Accessed 10 October 2026.

<a href="https://www.fascrs.org/Web/Patients/Diseases-and-Conditions/A-Z/Hemorrhoids.aspx" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Specialist society patient education directly supporting an external clot and painful external lump; not represented as the 2024 formal hemorrhoid guideline. Recognition only, with no treatment window or excision rule.

Class/use: open_educational_resource / evidence. Accessed 2026-10-10 via primary_html_targeted_read.

License: Copyright ASCRS; public patient education, no open license. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.

Supported claims: `claim.variety3.hemorrhoid.external-thrombosis`, `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.internal-location`, `claim.variety3.hemorrhoid.assessment-boundary`.

### source.variety3.niddk-hemorrhoids-2016

National Institute of Diabetes and Digestive and Kidney Diseases. Symptoms & Causes of Hemorrhoids. Last reviewed October 2016. Accessed 10 October 2026.

<a href="https://www.niddk.nih.gov/health-information/digestive-diseases/hemorrhoids/symptoms-causes" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Government recognition information: tender anal-margin lumps and the distinction from internal hemorrhoid symptoms. Older review date is explicit. Does not establish that every anal symptom is a hemorrhoid or support a procedural treatment choice.

Class/use: government_guidance / cross_check. Accessed 2026-10-10 via primary_html_targeted_read.

License: Original federal text generally public domain; NIDDK exceptions and attribution conditions apply. Reuse status: public_domain_conditions_apply. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Original agency text is generally public domain subject to agency conditions; third-party material and logos are excluded. Agency attribution and links do not imply endorsement.

Supported claims: `claim.variety3.hemorrhoid.tender-margin-lump`, `claim.variety3.hemorrhoid.internal-location`, `claim.variety3.hemorrhoid.assessment-boundary`.

### source.variety3.nhs-itchy-anus-2023

NHS website editorial team. Itchy bottom. Reviewed 3 October 2023; displayed next review due 3 October 2026. Accessed 10 October 2026.

<a href="https://www.nhs.uk/symptoms/itchy-anus/" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">License</a>.

Authority: National patient-care guidance supports gentle cleansing/drying, avoiding irritants and reassessment. Not a specialist diagnostic algorithm or source for a medication regimen.

Class/use: government_guidance / both. Accessed 2026-10-10 via primary_html_targeted_read.

License: Open Government Licence v3.0 where applicable; images, logos and third-party material excluded. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Contains public sector information licensed under the Open Government Licence v3.0. The reuse enum is conservative because it has no OGL category.

Supported claims: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`, `claim.variety3.pruritus.reassessment-boundary`.

### source.variety3.ascrs-pruritus-ani

American Society of Colon and Rectal Surgeons. Pruritus Ani. Public patient-education page; undated. Accessed 10 October 2026.

<a href="https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Pruritus-Ani.aspx" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Society education corroborates examination, irritant avoidance and gentle water cleansing/drying. Its permissive mention of baby wipes is not generalized to fragranced wipes. No numerical follow-up timetable or steroid regimen is adopted.

Class/use: open_educational_resource / both. Accessed 2026-10-10 via primary_html_targeted_read.

License: Copyright ASCRS; no open license. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.

Supported claims: `claim.variety3.pruritus.irritant-cleaning`, `claim.variety3.pruritus.gentle-water-drying`, `claim.variety3.pruritus.avoid-irritants`, `claim.variety3.pruritus.reassessment-boundary`.

### source.variety3.esge-bowel-prep-2019

Hassan C, East J, Radaelli F, et al. Bowel preparation for colonoscopy: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2019. Endoscopy. 2019;51(8):775-794. doi:10.1055/a-0959-0505. Full author list retained in authors. Accessed 10 October 2026.

<a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2019_a_0959_0505.pdf" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://doi.org/10.1055/a-0959-0505" target="_blank" rel="noopener noreferrer">DOI</a>.

Authority: Official guideline's inadequate-preparation section supports repeating an inadequate examination and reviewing reasons for failure. Current society catalog source, corroborated by a 2025 US summary. Same/next-day scheduling evidence is limited/conflicting and is withheld.

Class/use: professional_society_guideline / evidence. Accessed 2026-10-10 via primary_guideline_pdf_targeted_read.

License: Copyright ESGE / Thieme; all rights reserved. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.

Supported claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.

### source.variety3.acg-prep-summary-2025

Hagen R, Anderson JC. Optimizing Bowel Preparation for Colonoscopy: Insights from the USMSTF Recommendations. American College of Gastroenterology, Evidence-Based GI. 16 April 2025. Accessed 10 October 2026.

<a href="https://gi.org/journals-publications/ebgi/anderson_hagen_apr2025/" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Directly read 2025 society summary of USMSTF consensus; not the underlying full primary guideline. Corroborates repeat examination when preparation cannot support standard screening/surveillance and tailored instructions. Cases exclude an adequate distal examination treated as flexible sigmoidoscopy.

Class/use: open_educational_resource / cross_check. Accessed 2026-10-10 via primary_html_targeted_read.

License: Copyright ACG; public society summary, no open license. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.

Supported claims: `claim.variety3.preparation.inadequate-assessment`, `claim.variety3.preparation.repeat-examination`, `claim.variety3.preparation.review-failure`.

### source.variety3.esge-polypectomy-2024

Ferlitsch M, Hassan C, Bisschops R, et al. Colorectal polypectomy and endoscopic mucosal resection: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2024. Endoscopy. 2024;56(7):516-545. Published online 26 April 2024. doi:10.1055/a-2304-3219. PMID:38670139. Full author list retained in authors. Accessed 10 October 2026.

<a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2024_a-2304-3219.pdf" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://doi.org/10.1055/a-2304-3219" target="_blank" rel="noopener noreferrer">DOI</a>.

Authority: Current official guideline, sections 7.1/7.2: preferred cold-snare technique for diminutive/small nonpedunculated polyps and forceps limitations. Sole adequate directly read technique source in this batch; inaccessible independent sources are not counted. No copied resection algorithm, exact margin, complication frequency or antithrombotic rule.

Class/use: professional_society_guideline / evidence. Accessed 2026-10-10 via primary_guideline_pdf_targeted_read.

License: Copyright ESGE / Thieme; all rights reserved. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.

Supported claims: `claim.variety3.polypectomy.cold-snare-diminutive`, `claim.variety3.polypectomy.cold-snare-small`, `claim.variety3.polypectomy.cold-forceps-limit`, `claim.variety3.polypectomy.hot-forceps-limit`.

### source.variety3.esge-barrett-2023

Weusten BLAM, Bisschops R, Dinis-Ribeiro M, et al. Diagnosis and management of Barrett esophagus: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2023;55(12):1124-1146. Published online 9 October 2023. doi:10.1055/a-2176-2440. PMID:37813356. Full author list retained in authors. Accessed 10 October 2026.

<a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2023_a-2176-2440.pdf" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://doi.org/10.1055/a-2176-2440" target="_blank" rel="noopener noreferrer">DOI</a>.

Authority: Official guideline supports surveillance of established Barrett and avoiding prophylactic ablation without dysplasia. Cases exclude an irregular Z-line, visible neoplasia and a patient unsuitable for surveillance/treatment. Independent NIDDK corroborates surveillance; the no-prophylactic-ablation recommendation has this guideline as sole direct source.

Class/use: professional_society_guideline / evidence. Accessed 2026-10-10 via primary_guideline_pdf_targeted_read.

License: Copyright ESGE / Thieme; all rights reserved. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.

Supported claims: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.no-prophylactic-ablation`, `claim.variety3.barrett.surveillance-suitability`.

### source.variety3.niddk-barrett-diagnosis-2024

National Institute of Diabetes and Digestive and Kidney Diseases. Diagnosis of Barrett's Esophagus. Last reviewed August 2024. Accessed 10 October 2026.

<a href="https://www.niddk.nih.gov/health-information/digestive-diseases/barretts-esophagus/diagnosis" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Current national education independently corroborates repeat endoscopy with biopsy as surveillance, with frequency individualized. Does not independently establish an ablation recommendation or a universal interval.

Class/use: government_guidance / cross_check. Accessed 2026-10-10 via primary_html_targeted_read.

License: Original federal text generally public domain; NIDDK exceptions apply. Reuse status: public_domain_conditions_apply. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Original agency text is generally public domain subject to agency conditions; third-party material and logos are excluded. Agency attribution and links do not imply endorsement.

Supported claims: `claim.variety3.barrett.surveillance-plan`, `claim.variety3.barrett.surveillance-suitability`.

### source.variety3.niddk-colonoscopy-2023

National Institute of Diabetes and Digestive and Kidney Diseases. Colonoscopy. Last reviewed August 2023. Accessed 10 October 2026.

<a href="https://www.niddk.nih.gov/health-information/diagnostic-tests/colonoscopy" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Government procedure information supports arranging a ride because sedation/anesthesia impairs immediate driving. Used for the shared transport safety principle, not a fixed duration or a discharge fitness score.

Class/use: government_guidance / cross_check. Accessed 2026-10-10 via primary_html_targeted_read.

License: Original federal text generally public domain; NIDDK exceptions apply. Reuse status: public_domain_conditions_apply. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Original agency text is generally public domain subject to agency conditions; third-party material and logos are excluded. Agency attribution and links do not imply endorsement.

Supported claims: `claim.variety3.sedation.no-self-driving`.

### source.variety3.glos-sedation-2026

Gloucestershire Hospitals NHS Foundation Trust. Discharge advice following a gastroscopy with sedation. Patient leaflet GHPI1518_03_26, March 2026; review due March 2029. Accessed 10 October 2026.

<a href="https://www.gloshospitals.nhs.uk/your-visit/patient-information-leaflets/discharge-advice-following-a-gastroscopy-with-sedation/" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Current trust gastroscopy discharge advice: responsible adult collection/support and residual sedation effects. Applies directly to the gastroscopy variants; colonoscopy government material independently supports the transport boundary. No fixed number of hours is authored.

Class/use: government_guidance / evidence. Accessed 2026-10-10 via primary_html_targeted_read.

License: Copyright Gloucestershire Hospitals NHS Foundation Trust; no open license identified. Reuse status: copyrighted_targeted_verification_only. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.

Supported claims: `claim.variety3.sedation.no-self-driving`, `claim.variety3.sedation.adult-collection-support`, `claim.variety3.sedation.residual-effects`.

### source.variety3.cdc-penicillin-allergy-2025

Centers for Disease Control and Prevention. Clinical Features of Penicillin Allergy. Antibiotic Prescribing and Use. 25 August 2025. Accessed 10 October 2026.

<a href="https://www.cdc.gov/antibiotic-use/hcp/clinical-signs/index.html" target="_blank" rel="noopener noreferrer">Official source</a>.

Authority: Current government clinician guidance directly supports reaction history and risk assessment before selecting evaluation. No prevalence numbers, oral-challenge protocol, medication choice or universal delabeling rule is authored.

Class/use: government_guidance / evidence. Accessed 2026-10-10 via primary_html_targeted_read.

License: Original federal agency text generally public domain; CDC attribution, exceptions and nonendorsement conditions apply. Reuse status: public_domain_conditions_apply. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Original agency text is generally public domain subject to agency conditions; third-party material and logos are excluded. Agency attribution and links do not imply endorsement.

Supported claims: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

### source.variety3.sexton-kuruvilla-allergy-2024

Sexton ME, Kuruvilla ME. Management of Penicillin Allergy in the Perioperative Setting. Antibiotics (Basel). 2024;13(2):157. Published 5 February 2024. doi:10.3390/antibiotics13020157. PMID:38391543. Accessed 10 October 2026.

<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10886174/" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://doi.org/10.3390/antibiotics13020157" target="_blank" rel="noopener noreferrer">DOI</a>; <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">License</a>.

Authority: Eligible perioperative review corroborating structured preoperative history/risk assessment. Drug-selection guidance has changed across older and newer sources; that contested extension is withheld. This review is not a new standalone practice guideline.

Class/use: narrative_review / cross_check. Accessed 2026-10-10 via primary_html_targeted_read.

License: CC BY 4.0; separately licensed reproduced third-party figures excluded. Reuse status: cc_by_4_0. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Credit authors, DOI and CC BY 4.0. No reproduced third-party figure or algorithm is used; all wording is original.

Supported claims: `claim.variety3.allergy.label-not-confirmation`, `claim.variety3.allergy.characterize-reaction`, `claim.variety3.allergy.assessment-before-testing`.

### source.variety3.shea-ssi-update-2023

Calderwood MS, Anderson DJ, Bratzler DW, Dellinger EP, Garcia-Houchins S, Maragakis LL, Nyquist A-C, Perkins KM, Preas MA, Saiman L, Schaffzin JK, Schweizer M, Yokoe DS, Kaye KS. Strategies to prevent surgical site infections in acute-care hospitals: 2022 Update. Infect Control Hosp Epidemiol. 2023;44(5):695-720. Published 4 May 2023. doi:10.1017/ice.2023.67. PMID:37137483. Accessed 10 October 2026.

<a href="https://stacks.cdc.gov/view/cdc/155079/cdc_155079_DS1.pdf" target="_blank" rel="noopener noreferrer">Official source</a>; <a href="https://doi.org/10.1017/ice.2023.67" target="_blank" rel="noopener noreferrer">DOI</a>; <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">License</a>.

Authority: Specialist prevention guideline, hair-preparation recommendation in essential practices section 4.5, moderate evidence. Sole adequate directly read hair-preparation source. Acute-care scope and ambulatory application require clinician review. Genital/scrotal exception is explicitly excluded from the cases.

Class/use: professional_society_guideline / evidence. Accessed 2026-10-10 via primary_guideline_pdf_targeted_read.

License: CC BY 4.0 (article license verified in Europe PMC XML; not public domain merely because CDC hosts a copy). Reuse status: cc_by_4_0. Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Credit all authors, DOI and CC BY 4.0. Original wording only; no guideline table, bundle or algorithm reproduced.

Supported claims: `claim.variety3.hair.no-routine-removal`, `claim.variety3.hair.clippers-if-needed`, `claim.variety3.hair.depilatory-alternative`, `claim.variety3.hair.avoid-razor-nongenital`.

Contains public sector information licensed under the Open Government Licence v3.0, where applicable to the NHS website sources. Third-party material, logos, source figures and algorithms are excluded. Hernández-Granados et al. (2021), Sexton and Kuruvilla (2024), and Calderwood et al. (2023) are attributed above with DOI and their respective Creative Commons licenses. Hoang et al. (2019) is credited with CC BY-NC-ND 4.0; only underlying facts were checked, with no article adaptation distributed.

Source: CDC, NIDDK/NIH and the named NHS organizations for their respective underlying factual guidance. Links and attribution do not imply endorsement by CDC, HHS, NIH, the United States Government, the NHS or any society. All question wording is original software content awaiting named clinician review.

Manager handoff: select an exact unapproved prototype manifest only after review, preserve constrained adult/art profiles, and admit companion timing entries if cases are selected. No runtime integration, Git checkpoint or publication was performed by this worker.
