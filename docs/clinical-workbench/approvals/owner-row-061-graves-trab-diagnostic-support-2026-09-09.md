# Owner approval — row 61 Graves TRAb diagnostic support

- Date: 2026-09-09
- Reviewer: Melissa Rowland, MD (surgeon)
- Approval ID: `approval.melissa-rowland-md.owner-row-061.graves-trab-diagnostic-support.2026-09-09`
- Approval provenance: GS-006 task `01a08678-2899-7410-8bf1-613839be60f7`
- Exact review snapshot: [`review.owner-row-061.graves-trab-diagnostic-support.2026-09-09.1`](../workthroughs/owner-row-061-graves-trab-diagnostic-support-v1.md)
- Snapshot encoding and digest: UTF-8, LF; SHA-256 `5003e0445fbf753d560b40ab16d2bbc8c6b754ea0bdf668a9c600950bc89e609`

## Owner authorization

Melissa Rowland, MD stated: “Approved, next question set”. This authorizes the
exact snapshot identified above as one approved review set, not approval of the
entire row-61 package. The scoped batch preference is recorded in the
[GS-006 concept-review handoff](../../handoffs/GS-006_CONCEPT_REVIEW_HANDOFF.md).

## Exact approved set

The approval covers all four exact fictional current-patient presentations,
questions, complete answer sets, keys, and explanations in the frozen snapshot
for the one stable FSRS identity `concept.graves.trab-diagnostic-support`.

| Patient Presentation Variant ID | Question Variant ID | Exact-version disposition |
| --- | --- | --- |
| `presentation.graves-trab-diagnostic-support.v1` | `question.graves-trab-diagnostic-support.v1` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-trab-diagnostic-support.v2` | `question.graves-trab-diagnostic-support.v2` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-trab-diagnostic-support.v3` | `question.graves-trab-diagnostic-support.v3` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-trab-diagnostic-support.v4` | `question.graves-trab-diagnostic-support.v4` | Clinically approved as frozen in the linked snapshot |

This count is one approved review set containing four variants. It preserves one
FSRS card; it does not create four FSRS identities. Any wording change, new
presentation, question, answer set, key, or explanation requires a new exact
named-clinician review.

## Review identities and future rendering

The snapshot names are illustrative review-only cosmetic renderings. They do
not require hard-coded names, ages, or genders and do not change the approved
clinical facts, answer-essential profile, key, or stable variant identity.
Future implementation may generate a name, age, gender/pronouns, and matching
character appearance within the approved presentation's clinical constraints,
while keeping that identity consistent throughout one encounter. This approval
does not establish new clinical facts, age bounds, or runtime behavior.

## Boundaries retained

The 2026-08-31 row-61 receipt still governs six historical seed scopes and its
six reviewed seed versions/scopes. The 2026-09-09 recognition receipt remains
an independent exact approved set. This receipt adds exact approval only for
the four TRAb variants above. It does not approve a full four-variant set for
the other four row-61 concepts, standalone source records, atomic evidence-claim
metadata or prose, runtime release, capability readiness, publication, RAI
selection, pregnancy/lactation boundaries, thyroid-eye-disease management, or a
multi-decision encounter.

The semantic `release.l0.clinic_evaluation` counseling/referral scope is
unchanged. Release-point assignment, evidence readiness, capability mapping,
runtime admission, and publication remain separate gates. Standalone source and
atomic-claim metadata review remains `needs_clinician_review`.

## Batch hold

This is the second newly approved set in the current ten-set batch. Per the
owner direction, implementation remains on hold until ten separately reviewed
approved sets exist. Earlier approvals do not backfill this count. Nothing is
implemented or released by this receipt.
