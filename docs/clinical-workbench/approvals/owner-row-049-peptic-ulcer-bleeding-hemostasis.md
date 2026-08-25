# Owner Row 49: Exact Peptic-Ulcer Bleeding Hemostasis Approval

Status: Clinically approved and staged for Level 2 Endoscopy and Future
Hospital Floor

Approval date: 2026-08-10

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-049.2026-08-10`

Content version: `clinical.owner-row-049.2026-08-10.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 49
- Source record: `owner-concept.sheet1.row-049`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-03-v3`
- Scope decision:
  `decision.owner-row-049.two-concept-stigmata-and-modality-split.2026-08-10`

The owner approved two FSRS concepts, nine complete single-select Question
Variants, and two two-decision encounter blueprints. Each Question Variant is
paired with a brief patient presentation. Patient name, age within the
approved adult profile, nondecisive wording, and appearance may vary at
materialization; the ulcer stigma, treatment-pathway qualifiers, and all facts
that determine the answer remain fixed. Automated validation is structural
verification, not clinical approval.

## Approved Tested Concepts

### High-risk peptic-ulcer stigmata

`concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis`

- Concept type: `management`
- Level 2 release point: `release.l2.endoscopy`
- Future active-bleeding release point: `release.future.hospital_floor`
- Earliest facility stage: 2
- Current-game eligibility: staged outside the Level 0-1 runtime

The concept distinguishes active spurting, active oozing, and a nonbleeding
visible vessel from a clean base or flat pigmented spot when deciding whether
endoscopic hemostasis is required.

### Endoscopic hemostasis modality

`concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality`

- Concept type: `management`
- Level 2 release point: `release.l2.endoscopy`
- Future active-bleeding release point: `release.future.hospital_floor`
- Earliest facility stage: 2
- Current-game eligibility: staged outside the Level 0-1 runtime

The concept selects an accepted definitive thermal or mechanical modality,
recognizes that epinephrine is not definitive monotherapy, and applies a
conventional epinephrine-plus-definitive-modality pathway without falsely
making every noninjection monotherapy wrong.

## Approved Question Variants

Every scored decision has a brief patient or endoscopy-list presentation,
four single-select choices, one keyed answer, shuffled answer order, concise
original feedback, and one primary FSRS concept.

### Stigmata: treat a nonbleeding visible vessel

Correct: `Perform endoscopic hemostasis`

Incorrect:

- Give oral PPI without endoscopic treatment
- Biopsy the visible vessel before treatment
- Schedule repeat EGD without treating the vessel

### Stigmata: select the high-risk finding

Correct: `Ulcer with a nonbleeding visible vessel`

Incorrect:

- Clean-based ulcer without active bleeding
- Flat pigmented spot without active bleeding
- Healed ulcer scar without bleeding stigmata

### Stigmata: reverse low-risk finding

Correct: `Clean-based ulcer`

Incorrect:

- Actively spurting ulcer
- Actively oozing ulcer
- Ulcer with a nonbleeding visible vessel

### Stigmata: active oozing in a hospitalized patient

Correct: `Perform endoscopic hemostasis`

Incorrect:

- Observe because the bleeding appears venous
- Use oral PPI alone and end the procedure
- Delay treatment until a second bleeding episode

### Modality: inappropriate sole treatment for a visible vessel

Correct: `Epinephrine injection alone`

Incorrect but clinically acceptable plans for the question's visible-vessel
scenario:

- Epinephrine plus bipolar coagulation
- Bipolar coagulation alone
- Endoscopic clip alone

### Modality: visible-vessel principle

Correct: `Thermal therapy or clipping may be used without epinephrine`

Incorrect:

- Epinephrine alone provides definitive hemostasis
- Bipolar coagulation must always be combined with clipping
- An endoscopic clip must always be combined with thermal therapy

### Modality: next step after epinephrine slows active oozing

Correct: `Apply bipolar coagulation to the vessel`

Incorrect:

- End the procedure because the bleeding slowed
- Inject additional epinephrine and then stop
- Observe the vessel without definitive treatment

### Modality: conventional mechanical combination pathway

Correct: `Epinephrine injection plus endoscopic clipping`

Incorrect:

- Epinephrine injection alone
- Epinephrine plus saline injection without definitive hemostasis
- Repeated epinephrine injections without definitive therapy

### Modality: reverse definitive-second-modality question

Correct: `Epinephrine followed only by another epinephrine injection`

Incorrect because each supplies or constitutes definitive therapy:

- Epinephrine followed by bipolar coagulation of the identified vessel
- Epinephrine followed by endoscopic clipping of the identified vessel
- Bipolar coagulation without injection therapy to definitively treat the
  vessel

The complete labels deliberately include similarly long distractors so the
key cannot be inferred from answer length.

## Approved multi-decision encounters

The Level 2 pathway first asks whether a stable nonbleeding visible vessel
requires hemostasis, then tests which proposed sole treatment is inadequate.

The Future Hospital Floor pathway first identifies active oozing as requiring
hemostasis, then—after the authored conventional epinephrine step—asks for a
definitive thermal modality. Both use corrective-forward behavior: an
incorrect intermediate answer is scored as incorrect and explained, then the
clinically correct action occurs before the next decision.

The remaining five blueprints are focused single-decision variations.

## Clinical boundaries

- Epinephrine injection alone is never authored as definitive treatment for a
  high-risk ulcer stigma.
- For a nonbleeding visible vessel, accepted thermal or mechanical treatment
  may be used alone; two definitive modalities are not automatically required.
- Active-bleeding questions explicitly identify the conventional
  epinephrine-combination pathway rather than claiming epinephrine is mandatory
  in every contemporary expert approach.
- Current guidance recognizes selected advanced monotherapy options. Generic
  clip or cautery monotherapy is therefore not used as a universally wrong
  distractor.
- Unstable active bleeding is not represented as routine ambulatory Level 2
  care.
- Post-hemostasis PPI therapy, recurrent bleeding, embolization, and operative
  rescue are distinct future concepts.

No unsupported dose, procedural setting threshold, outcome probability, or
universal device hierarchy is invented in this package.

## Runtime boundary

The exact reviewed content is implemented as a typed, tested deferred package.
The five stable nonbleeding-visible-vessel variants require Level 2 Endoscopy
and `capability.endoscopy`. The four active-bleeding variants remain reserved
for Future Hospital Floor, where the numeric facility level and capability
assignment have intentionally not been invented.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact content version.
