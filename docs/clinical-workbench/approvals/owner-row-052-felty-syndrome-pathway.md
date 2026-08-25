# Owner approval — row 52 Felty syndrome pathway

- Date: 2026-08-10
- Reviewer: Melissa Rowland, MD (Surgeon)
- Approval ID: `approval.melissa-rowland-md.owner-row-052.2026-08-10`
- Content version: `clinical.owner-row-052.2026-08-10.1`

## Decision

The owner approved three distinct FSRS concepts at `L0 — Clinic Evaluation`:

1. `concept.felty-syndrome.recognition`
2. `concept.felty-syndrome.methotrexate-first-line`
3. `concept.felty-syndrome.splenectomy-for-refractory-infections`

One encounter may test all three concepts sequentially: recognize the syndrome,
choose initial specialist-monitored methotrexate, and then consider splenectomy
at an explicitly authored later follow-up after recurrent infections persist
despite adequate methotrexate, subsequent rituximab, and appropriate G-CSF
support. The later follow-up is narrative context; the prototype does not
simulate months of disease-directed treatment with facility time.

## Approved variants

### 1. Classic recognition

Correct: **Felty syndrome**

- T-cell large granular lymphocytic leukemia
- Medication-induced isolated neutropenia
- Hypersplenism from chronic liver disease

The vignette explicitly excludes medication, infectious, and clonal-LGL causes.

### 2. No-splenomegaly boundary

Correct: **Felty syndrome remains possible without splenomegaly**

- Splenomegaly is mandatory for Felty syndrome
- A normal spleen establishes T-LGL leukemia
- A normal spleen proves medication-induced neutropenia

### 3. Reverse recognition

Correct: **Persistent neutropenia with splenomegaly**

- Persistent neutrophilia with a small spleen
- Thrombocytosis with isolated hepatomegaly
- Eosinophilia with normal rheumatoid studies

### 4. Initial disease-modifying treatment

Correct: **Start methotrexate with specialist monitoring**

- Perform immediate splenectomy before medical therapy
- Begin prolonged high-dose prednisone monotherapy
- Use G-CSF as the sole long-term disease-modifying treatment

### 5. Treatment principle

Correct: **Methotrexate is first-line; steroids may serve as a bridge**

- Splenectomy is routine initial treatment
- Steroids are contraindicated in every Felty syndrome case
- Treatment begins only after transfusion dependence develops

### 6. Refractory recurrent infections

Correct: **Consider splenectomy after multidisciplinary review**

- Continue the ineffective regimen without reassessment
- Use splenectomy only after neutrophil transfusion dependence
- Replace all treatment with chronic glucocorticoid monotherapy

Answer order is shuffled. Variant 7, which would ask the player to select a
surgical candidate, was explicitly rejected and is not part of the package.

## Clinical boundaries

- Persistent neutropenia in established rheumatoid arthritis is essential;
  splenomegaly is common but not mandatory.
- T-LGL leukemia and other alternative causes require evaluation rather than
  diagnosis by spleen size alone.
- Methotrexate is presented as usual first-line disease-modifying treatment;
  glucocorticoids and G-CSF are framed as selected bridging/supportive tools.
- Splenectomy is not routine initial therapy. It may be considered for recurrent
  infections that persist despite adequate specialist-directed medical care.
- No exact splenectomy-response percentage is taught from heterogeneous
  historical cohorts.
- Antibodies against neutrophil nuclei are not presented as a defining fact;
  pathogenesis remains multifactorial and incompletely understood.

## Provenance disposition

The exact concepts, claims, variants, explanations, and release point are
clinician-approved. Source metadata remains `needs_clinician_review` under
repository policy. The package uses independently written claims supported by
two open-access reviews and stores no copied source prose or proprietary
question material.
