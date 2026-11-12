# Harden1 hernia round2: draft for independent review

One executable candidate, shown twice in the
[packet](question-harden1-round2-20261110.json) to trace H1-01 and H1-02.
**Not accepted.** The live flags3 type v1 / management r12 pair is unchanged.
All new metadata is `needs_clinician_review` with no clinician review recorded.

Direct-import preview:
`packages/clinical-content/src/question-harden1-round2-20261110.ts`, source view
`harden1-round2`. No barrel, catalog, global timing or manifest insertion.

## Review response

| H1-01 review concern | Round2 response |
| --- | --- |
| A named vessel can shorten classification by word matching | Two real competing neck findings are reported, and the task specifies the skin-marked swelling. Both vascular landmarks remain explicit. The named femoral landmark can still help classify; it does not choose between the two femoral observation judgments. This residual is for independent review, not concealed. |
| Emergency exploration follows independently of classification | This is a new stable case and new objective, not an acute case with a danger finding hidden. The player must locate the marked sac, then judge whether selected male inguinal watchful-waiting evidence applies to that compartment. The painless reducing course makes observation a credible wrong generalization. |
| Compression sounds like a failed treatment | No compression or therapeutic reduction is described. Positional emptying is a spontaneous observation. |
| Partial-wall material adds explanation without changing the action | No bowel-viability or partial-wall teaching is retained. The separate cranial direct defect supplies an actual competing interpretation of the ultrasound. |
| Balanced matrix is not itself a convergence advantage | Both diagnoses and both judgments occur twice in a complete 2×2. Raw convergence advisory retained; no suppression or linter change. |

The complete task asks both **which hernia accounts for the marked lump** and
**whether watchful waiting is appropriate**. It asks eligibility rather than
forcing a choice between observation and elective repair for an inguinal hernia,
where both may be reasonable. All four options share the same two components.

Counterfactual: move the marker to the separate cranial defect, keeping the
painless reducing course, and direct inguinal hernia with reasonable watchful
waiting becomes the answer. Without both anatomical rows the diagnosis is not
established; without the spontaneous reduction context this stable observation
question is incomplete. The author predicts moderate difficulty; it remains
unmeasured and may still be easy for residents fluent in canonical anatomy.
No independent PASS or successful hardening is claimed.

## Evidence and version discipline

The new question is
`question.groin-hernia.ultrasound-type-and-intervention.v3`, with separately
scored `concept.groin-hernia.femoral-defect-repair-priority.v3`. Meaning changes
from the unaccepted acute bowel-viability v2 to stable symptom-site attribution
and observation eligibility. Old v1/v2 meanings and all old histories remain
exact; no FSRS migration is performed.

The [source ledger](sources-question-harden1-round2-20261110.json) maps five new
atomic application claims to five recorded basis claims and four permitted
source records. Existing access dates and license limitations are retained.
No network, new threshold, probability or treatment deadline is introduced.
Femoral repair direction has one adequate recorded guideline; the 2023 update
cross-checks inguinal observation, and the direct anatomy comparator has one
recorded review. These limitations remain explicit. No keyed source hold;
clinical review is still required.

The ultrasound table is original constructed qualitative data, not a copied
image, article table or case report. Named patient /59 M, short complaint,
complete task and runtime shuffle remain. No wait is authored into prose; the
candidate has no testing choices and its local timing classification is
`no_test`.

## Verification and review gate

Six clinical tests cover isolation from default/catalog/manifest/global timing,
old-source preservation, concept versioning, complete presentation, option
balance, provenance and packet duplication. The full validation and exact file
list are in the acceptance handoff. The raw linter has **one convergence
advisory**, zero suppressed findings. It is the complete-matrix advisory also
recognized in the independent first-round review. The packet records it with
exact phrases and the author's cue attack.

Regenerate/check without editing old files:

```powershell
node tools/question-quality/author-question-harden1-round2-20261110.mjs --check
```

Stop at independent review. No acceptance, retirement, rewrite of the live
hernia pair, or clinical sign-off is authorized by this draft handoff.
