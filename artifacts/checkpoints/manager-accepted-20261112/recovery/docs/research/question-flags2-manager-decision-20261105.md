# Flags2 manager decision — November 5, 2026

The manager accepts **G06 only**, following the exact PASS in
`question-flags2-review-20261105.json`. Editorial acceptance is not clinical
approval: the question and its authored concept/claims remain
`needs_clinician_review`. Melissa Rowland remains clinical sign-off.

| Binding | Exact value |
|---|---|
| Acceptance | G06 |
| Case | case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence |
| Node | node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1 |
| Question | question.statistics-ethics.predictive-value-prevalence.v2.r1 |
| Concept | concept.predictive-value.collection-population-denominator.v1 |
| Retained source | flags2-round1 |
| Decision | docs/research/question-flags2-manager-decision-20261105.md |

The manifest adds one acceptance row and the corresponding G06 header-source
pin required to project the exact reviewed presentation/profiles. No other
acceptance or header is changed. The existing projector receives that retained
source; a bounded helper registers only its accepted concept and one exact
`no_test` timing row. All original identities/cards/timing records remain.
There is no order-execution change: all four answers are numeric interpretations.

## Accepted-key hold screen

G06 has **no source hold on its key**. The audit is explicitly original
constructed teaching data, not empirical MRSA performance. The specimen was
collected in the pre-admission cohort. Its PPV is 45/(45+19), approximately 70%.
The other displayed values are derived cohort/denominator errors, not clinical
treatment rules. Recorded statistical definitions and original source access
dates are retained in `sources-question-flags2-20261105.json`; no new retrieval,
assay-performance assertion, infection diagnosis or treatment recommendation is
added. The optional shortening suggestion is not applied to this exact PASS.

## Returned drafts and replacement condition

G01, G02, G03, G05, G05-staging and G07 are not accepted. Their new round-two
versions are in a separate retained source view and packet. G03 binds directly
to the flagged live `question.palpable-breast.negative-mammogram-targeted-us.v1`;
B2B36 is not accepted coverage or the revision source.

The manager agrees to retirement/merge of original G04's elementary assay
recognition **only after** a harder pregnancy-assessment replacement passes
independent review and receives exact-version acceptance. G04-R is written in
this round with a new concept. Original G04 stays live; no retirement, selector,
FSRS membership or history transfer is applied.

Five new keyed extensions have explicit source-verification holds in the
round-two ledger. G03 applies the recorded site-specific ACR claim; G05 applies
the recorded inherited-calcium differential and genetic-evaluation claims.
Original source/clinical-review limitations remain. No held key is accepted. See
[round-two handoff](question-flags2-round2-handoff-20261105.md) for exact files,
per-note responses, validation and Level 5 inputs. No deployment, Git operation
or evidence/input rebind is performed by this worker.

## Validation receipt

Focused clinical 80/80 in five files, linter 33/33 and clinical-content typecheck
all pass, native exit 0. Vitest uses threads/maxWorkers2. Exact composed G06
case/header/source/timing and every other old live case are checked. No new
full-suite or release-tree certification is claimed. Full receipt and seven-
draft review handoff: question-flags2-round2-handoff-20261105.md.
