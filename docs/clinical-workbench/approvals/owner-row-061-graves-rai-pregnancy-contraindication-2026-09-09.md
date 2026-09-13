# Owner approval — row 61 Graves RAI pregnancy contraindication

- Date: 2026-09-09
- Reviewer: Melissa Rowland, MD (surgeon)
- Approval ID: `approval.melissa-rowland-md.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09`
- Approval provenance: GS-006 task `01a08678-2899-7410-8bf1-613839be60f7`
- Exact review snapshot: [`review.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09.1`](../workthroughs/owner-row-061-graves-rai-pregnancy-contraindication-v1.md)
- Snapshot encoding and digest: UTF-8, LF; SHA-256 `bddc991cd919e941536c67968d1a9814c677833691ddbb479c33ac01d0915945`

## Owner authorization

Melissa Rowland, MD stated: “Approve, next”. This authorizes the exact snapshot
identified above as one approved review set, not approval of the entire row-61
package. The current batch preference is recorded in the
[GS-006 concept-review handoff](../../handoffs/GS-006_CONCEPT_REVIEW_HANDOFF.md).

## Exact approved set

The approval covers all four exact fictional current-patient presentations,
questions, complete answer sets, keys, and explanations in the frozen snapshot
for the one stable FSRS identity `concept.graves.rai-pregnancy-contraindication`.

| Patient Presentation Variant ID | Question Variant ID | Exact-version disposition |
| --- | --- | --- |
| `presentation.graves-rai-pregnancy-contraindication.v1` | `question.graves-rai-pregnancy-contraindication.v1` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-rai-pregnancy-contraindication.v2` | `question.graves-rai-pregnancy-contraindication.v2` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-rai-pregnancy-contraindication.v3` | `question.graves-rai-pregnancy-contraindication.v3` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-rai-pregnancy-contraindication.v4` | `question.graves-rai-pregnancy-contraindication.v4` | Clinically approved as frozen in the linked snapshot |

This count is one approved review set containing four variants. It preserves one
FSRS card; it does not create four FSRS identities. Any wording change, new
presentation, question, answer set, key, or explanation requires a new exact
named-clinician review.

## Review identities and future rendering

The snapshot names are illustrative review-only cosmetic renderings. They do
not require hard-coded names, ages, or genders and do not change the approved
clinical facts, answer-essential profile, key, or stable variant identity.
Future implementation may generate a name, age, gender/pronouns, and matching
character appearance only within the approved clinical constraints, while
keeping that identity consistent throughout one encounter. Pregnancy is an
explicit clinical fact, not an inference from the generated identity. This
approval establishes no new clinical facts, age bounds, or runtime behavior.

## Boundaries retained

The 2026-08-31 receipt still governs six historical seed scopes and its six
reviewed seed versions/scopes. The 2026-09-09 recognition, TRAb, and RAI-candidate
receipts remain independent exact approved sets. This receipt adds exact approval
only for the four pregnancy-contraindication variants above. It does not approve
a full four-variant set for the other two row-61 concepts, standalone source
records, atomic evidence-claim metadata or prose, runtime release, capability
readiness, publication, lactation boundaries, thyroid-eye-disease management,
or a multi-decision encounter.

The semantic `release.l0.clinic_evaluation` counseling/referral scope is
unchanged. Release-point assignment, evidence readiness, capability mapping,
runtime admission, and publication remain separate gates. Standalone source and
atomic-claim metadata review remains `needs_clinician_review`.

## Batch hold

This is the fourth newly approved set in the current ten-set batch. Per owner
direction, implementation remains on hold until ten separately reviewed approved
sets exist. Earlier approvals do not backfill this count. Nothing is implemented
or released by this receipt. The lactation set is neither approved nor authored
by this receipt.
