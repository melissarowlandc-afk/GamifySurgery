# Harden1 / N3 round4: manager acceptance, 2026-11-10

Authority: the manager's explicit instruction in the rewrite lane, following
[harden1 review](question-harden1-review-20261110.json) and
[N3 round4 review](question-new-n3-round4-review-20261110.json).
This is editorial acceptance into the unapproved draft projection. All three
exact versions remain `needs_clinician_review`; Melissa Rowland has not clinically
approved these versions.

| Accepted review ID | Exact question | Concept | Mechanism |
| --- | --- | --- | --- |
| H1-03 | `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r3` | `concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2` | Whole-case replacement of `case.gs028f.nutrition.c1-metabolic-transition`, whose current question was v3.r2 |
| review.n3.delayed-regurgitation-proximal-anatomic-study.v4 | `question.n3.delayed-regurgitation-proximal-anatomic-study.v4` | `concept.n3.delayed-regurgitation-proximal-anatomic-study` | New default case `case.n3.delayed-regurgitation-proximal-anatomic-study.v1` |
| review.n3.venous-ulcer-with-competing-arterial-findings.v4 | `question.n3.venous-ulcer-with-competing-arterial-findings.v4` | `concept.venous-leg-ulcer.arterial-assessment-before-compression` | New default case `case.n3.venous-ulcer-with-competing-arterial-findings.v1` |

These are the only new authority rows. The previous 134 accepted rows, 1,423
legacy bindings and three earlier whole-case relations remain exact. The old
F4-01 row remains archived authority; its case is withheld from fresh selection
by the new explicit whole-case relation. The replacement is
`case.harden1.phosphate-handling.20261110`.

The phosphate application already introduced a separately versioned renal
handling objective in the reviewed candidate. Its previous mechanism concept
remains registered; no card/history is moved or reset. Delayed regurgitation
retains its reviewed concept identity. The venous item reuses the existing
arterial-assessment-before-compression concept exactly as reviewed.

## Exact source bindings

| Source view | Bound source SHA-256 |
| --- | --- |
| `harden1-round1` / `QUESTION_HARDEN1_ACCEPTANCE_SOURCE` | `d7b5a4751ac104d5ed6fa26307295bd86faf0a0a37d6cf2de2758d28a3a6c36b` |
| `n3-round4` / `QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE` | `2ded730f8d582d472301b479018a6bd7711e102f690fdb2e6d05dbddb1f9d994` |

The N3 binding is a static retained representation of the entire exact reviewed
five-case view, with admission limited to the two rows above. This avoids the
authoring view's catalog import cycle; it neither edits the writer's files nor
admits the three returned N3 candidates. Tests compare all retained cases,
reviewed questions and full source hashes with the immutable intake. See the
[accepted packet](question-harden1-n3r4-accepted-20261110.json) for case and
question hashes, source claims and exact displayed fields.

## Explicitly withheld

H1-01/H1-02 share one unaccepted hernia candidate. Neither its acute v2 nor its
new round2 v3 is accepted. The default keeps
`question.groin-hernia.ultrasound-type.v1` followed by
`question.inguinal-hernia.symptomatic-elective-repair.v3.r12`, byte for byte.
The [new round2 packet](question-harden1-round2-20261110.json) is draft only.

No other N3 revision, parked proposal or manifest row is accepted here. No
clinical approval, deployment, evidence refresh or rebind is implied.

## Frozen compatibility and residuals

Fresh selection uses only the projection. Existing saves and journals keep
their frozen old question, choice identities and original concept. New tests
exercise actual default admission of all three accepted cases, format3 reopen
and completion, a frozen v3.r2 encounter and committed pre-replacement journal,
and the prior frozen versions of both new N3 cases. No domain acceptance gate
or save-format change is introduced.

The exact N3 venous PASS key is 51 characters versus a 43-character longest
distractor. The existing strict character-count test now pins this one exact
accepted case and measured disparity, matching its prior exact-version
exceptions. No general allowance, threshold or linter rule changes; the cue
linter reports zero findings for all three accepted items.
