# Owner approval — row 60 familial hypocalciuric hypercalcemia

- Date: 2026-08-13
- Reviewer: Melissa Rowland, MD (Surgeon)
- Approval ID: `approval.melissa-rowland-md.owner-row-060.2026-08-13`
- Content version: `clinical.owner-row-060.2026-08-13.1`

## Decision

The owner approved three distinct FSRS concepts at `L0 — Clinic Evaluation`:

1. `concept.fhh.biochemical-evaluation`
2. `concept.fhh.recognition-and-confirmation`
3. `concept.fhh.avoid-parathyroid-surgery`

The approved package contains four encounter variants and five scored
single-select decisions. One encounter first scores the biochemical evaluation
and then, at an explicitly authored later endocrine follow-up, scores management
after family evaluation and a pathogenic `CASR` result confirm FHH. The
24-hour collection and genetic evaluation are not simulated with the clinic's
generic one-hour laboratory timer.

## Approved encounter variants

### 1. Two-decision evaluation-to-management encounter

Initial presentation: a 27-year-old with repeatedly mild hypercalcemia,
high-normal PTH, no nephrolithiasis, and a parent with similar calcium values.

Decision 1 correct answer:
**24-hour urine calcium and creatinine with paired serum values**

- Neck ultrasound and sestamibi before biochemical differentiation
- Parathyroid biopsy to distinguish inherited from sporadic disease
- Serum magnesium alone as the definitive discriminator

At a later endocrine follow-up, relative hypocalciuria, family evaluation, and
a pathogenic `CASR` result confirm FHH. The patient remains asymptomatic with
stable mild hypercalcemia and no complications.

Decision 2 correct answer: **Reassure and observe without surgery**

- Perform focused parathyroidectomy for the inherited disorder
- Perform routine subtotal parathyroidectomy despite confirmation
- Start lifelong cinacalcet routinely for every confirmed case

### 2. Interpret suggestive results and pursue confirmation

The patient has interpretable testing, a calcium-to-creatinine clearance ratio
of 0.007, and several relatives with mild hypercalcemia.

Correct: **Suspect FHH and arrange genetic testing**

- Diagnose primary hyperparathyroidism and schedule surgery
- Diagnose FHH from the clearance ratio alone
- Diagnose malignancy-associated hypercalcemia from this pattern

### 3. Manage confirmed asymptomatic FHH

Correct: **Reassure and observe without parathyroid surgery**

- Perform focused parathyroidectomy now despite confirmed FHH
- Plan routine subtotal parathyroidectomy for inherited disease
- Begin lifelong cinacalcet for every asymptomatic patient

### 4. Explain why surgery is avoided

Correct: **Parathyroidectomy usually does not correct FHH**

- A localized parathyroid adenoma causes FHH and should be removed
- Routine single-gland excision reliably cures the inherited disorder
- FHH instead requires prophylactic thyroidectomy

Answer order is shuffled. Names, appearances, and nondecisive details may vary,
but the biochemical, family, confirmation, complication-exclusion, and answer
boundaries remain frozen.

## Clinical boundaries

- FHH uses **relative hypocalciuria**, not hypercalciuria, as a characteristic
  clue.
- A calcium-to-creatinine clearance ratio below 0.01 supports suspicion but
  does not establish FHH by itself because it overlaps with primary
  hyperparathyroidism.
- The approved ratio vignette removes major interpretive confounders and still
  proceeds to family and genetic evaluation.
- Confirmed management variants specify a pathogenic `CASR` result,
  asymptomatic status, stable mild hypercalcemia, and no authored complication.
- Rare symptomatic or atypical FHH and coexisting primary hyperparathyroidism
  are outside these variants.
- Serum magnesium is not used as a definitive discriminator.
- The previously proposed confounded-low-ratio and reverse-recognition variants
  were removed at the owner's request.

## Provenance disposition

The exact claims, concepts, questions, explanations, encounter structures, and
release point are clinician-approved. Source metadata remains
`needs_clinician_review` under repository policy. The package uses independently
written factual synthesis supported by the ESE PARAT consensus and Fifth
International Workshop guideline and stores no source excerpts, proprietary
questions, tables, figures, or algorithms.
