# New-question manager decisions — 2026-11-05

## N1

The manager accepts exactly the following twelve versions from independent review three (docs/research/question-new-n1-review3-20261104.json). This decision supersedes the N1 review-two acceptance seed.

- review.n1.controlled-enterotomy-mesh.v2
- review.n1.celiac-iga-deficiency.v2
- review.n1.hcc-portal-hypertension.v2
- review.n1.gastroparesis-obstruction.v3
- review.n1.breast-mass-morphology.v2
- review.n1.breast-calcification.v3
- review.n1.breast-thirties-imaging.v3
- review.n1.phyllodes-negative-axilla.v3
- review.n1.phyllodes-spread.v2
- review.n1.mixing-study-followup.v2
- review.n1.lymphedema-new-swelling.v3
- review.n1.vka-vitamin-k.v3

28 REVISE parked as backlog drafts, not admitted. They remain in explicit catalog/stage exports. No further N1 rewriting is authorized in this milestone. Incidental-t1b.v2, phyllodes-benign-margin.v1 and aldosterone-overt-phenotype.v1 are removed from the prior acceptance seed.

## N2

Independent review three (question-new-n2-review3-20261104.json) supersedes review two: nineteen PASS, twenty REVISE, no FAIL. The manager's source-hold rule withholds a PASS whose keyed teaching point or key-deciding fact depends on a targeted verification hold. Fourteen versions pass that screen and are accepted:

- review.n2.sglt2-postoperative-restart.v2
- review.n2.burn-feeding-perfusion-prerequisite.v3
- review.n2.dialysis-isocaloric-protein-adjustment.v3
- review.n2.af-bridging-versus-surgical-prophylaxis.v3
- review.n2.bile-leak-duct-continuity-boundary.v2
- review.n2.ercp-versus-gallbladder-source.v2
- review.n2.hpylori-antibody-after-valid-cure-test.v2
- review.n2.malignant-polyp-local-versus-regional-risk.v2
- review.n2.operative-wound-class-versus-later-ssi.v3
- review.n2.ventral-hernia-priority-change.v2
- review.n2.negative-predictive-value-denominator.v2
- review.n2.positive-likelihood-ratio.v2
- review.n2.mcnemar-paired-binary-outcomes.v3
- review.n2.equivalence-margin-versus-null-test.v2

All ten v3 PASS items were checked against the eighteen targeted holds:

| review.n2 item (v3) | Hold disposition | Decision |
| --- | --- | --- |
| sugammadex-recovery-endpoints | Key-held: claim.n2r3.depolarizing-ratio-amplitude; the required blocker pattern/reversal boundary is unverified. | Not accepted |
| refeeding-baseline-phosphate-attribution | Key-held: claim.n2r3.refeeding-combined-carbohydrate; the reduce-versus-advance ranking is unverified. | Not accepted |
| burn-feeding-perfusion-prerequisite | No targeted hold; applies recorded resuscitation/enteral-contraindication boundaries to the supplied trajectory. | Accepted |
| dialysis-isocaloric-protein-adjustment | No targeted hold; directly recorded chronic-KRT protein fact plus fictional prescription inputs and arithmetic. | Accepted |
| vte-prophylaxis-to-treatment | Key-held: claim.n2r3.vte-changing-renal-procedure; the initial-agent ranking in evolving renal injury is unverified. | Not accepted |
| af-bridging-versus-surgical-prophylaxis | No targeted hold; reconciles documented indications using recorded AF-bridging/prophylaxis facts. | Accepted |
| marginal-ulcer-obstructive-escalation | Key-held: claim.n2r3.recurrent-gj-graded-dilation; repeat dilation versus stent/operation priority is unverified. | Not accepted |
| operative-wound-class-versus-later-ssi | No targeted hold; recorded operative-class definitions and measurement-bias facts support the constructed coding audit. | Accepted |
| tacrolimus-antibody-pathway-boundary | Key-held: claim.n2r3.preimplantation-specificity-assay; assay/sample suitability for antigen exclusions is unverified. | Not accepted |
| mcnemar-paired-binary-outcomes | No targeted hold; recorded paired-binary analysis plus net-change arithmetic and an explicitly fictional next-study trigger. | Accepted |

No held detail was merely non-deciding, so no N2 item was edited. Five independently passed versions remain source-held, catalog-only, pending direct verification. Twenty REVISE are parked as backlog drafts, catalog-only, with no further N2 rewriting. Factor-assays-without-mixing-gate.v2, gastric-wall-mass-specimen-provenance.v2 and case-mix-standardized-risk.v1 are removed from the prior acceptance seed. Thus twenty-five N2 cases are outside the default projection: twenty returned drafts plus five source-held PASS.

The complete claim/key mapping and exact ID lists are in [question-new-n2-source-hold-disposition-20261105.json](question-new-n2-source-hold-disposition-20261105.json). This is an offline dependency screen, not newly performed external source verification. Original source/access/check dates and all clinical-review limitations remain unchanged.

## Rewrite lanes and N3

Preserve existing manager-directed flag/batch-2a acceptances and the batch2b-round2 candidate helper integration. Candidate integration is not acceptance. The two rewrite capture digest conflicts from gate narrowing belong to the rewrite writer. Flags2/batch2b files are outside this worker's lane. N3 has no manifest acceptance.

Editorial acceptance does not confer clinical approval. Clinical content remains needs_clinician_review pending named clinician sign-off by Melissa Rowland.
