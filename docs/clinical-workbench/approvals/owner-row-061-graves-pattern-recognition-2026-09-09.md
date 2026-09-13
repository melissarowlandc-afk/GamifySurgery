# Owner approval — row 61 Graves clinical-pattern recognition

- Date: 2026-09-09
- Reviewer: Melissa Rowland, MD (surgeon)
- Approval ID: `approval.melissa-rowland-md.owner-row-061.graves-pattern-recognition.2026-09-09`
- Approval provenance: GS-006 task `01a08678-2899-7410-8bf1-613839be60f7`
- Exact review snapshot: [`review.owner-row-061.graves-pattern-recognition.2026-09-09.2`](../workthroughs/owner-row-061-graves-pattern-recognition-v2.md)
- Snapshot encoding and digest: UTF-8, LF; SHA-256 `849f556a1849c3f93cfcb150d66b3f0f351c70b168d4e820567ded8103ffac5b`

## Owner authorization

Melissa Rowland, MD stated: “Sounds good, approve and let's move on to another
set of concepts. (wait to implement until we have approved 10 sets of concepts
so we can implement into the game in batches)”. This authorizes the exact
snapshot identified above. It is one approved review set, not approval of the
entire row-61 package.

## Exact approved set

The approval covers all four exact fictional current-patient presentations,
questions, complete answer sets, keys, and explanations in the frozen snapshot
for the one stable FSRS identity
`concept.graves.clinical-pattern-recognition`.

| Patient Presentation Variant ID | Question Variant ID | Exact-version disposition |
| --- | --- | --- |
| `presentation.graves-pattern-recognition.v1` | `question.graves-pattern-recognition.v1` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-pattern-recognition.v2` | `question.graves-pattern-recognition.v2` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-pattern-recognition.v3` | `question.graves-pattern-recognition.v3` | Clinically approved as frozen in the linked snapshot |
| `presentation.graves-pattern-recognition.v4` | `question.graves-pattern-recognition.v4` | Clinically approved as frozen in the linked snapshot |

This count is one approved review set containing four variants. It preserves one
FSRS card; it does not create four FSRS identities. Any wording change, new
presentation, question, answer set, key, or explanation requires a new exact
named-clinician review.

## Boundaries retained

The 2026-08-31 row-61 receipt still governs six historical seed scopes and its
six reviewed seed versions/scopes. This receipt adds exact approval only for
the four recognition variants above. It does not approve a full four-variant
set for the other five row-61 concepts, source records, atomic evidence-claim
metadata or prose, runtime release, capability readiness, publication, TRAb
selection, RAI selection, pregnancy/lactation boundaries, thyroid-eye-disease
management, or a multi-decision encounter.

The semantic `release.l0.clinic_evaluation` counseling/referral scope is
unchanged. Release-point assignment, evidence readiness, capability mapping,
runtime admission, and publication remain separate gates. Standalone source and
atomic-claim metadata review remains `needs_clinician_review`.

## Batch hold

This is the first newly approved set in the current ten-set batch. Per the
owner authorization, implementation remains on hold until ten separately
reviewed approved sets exist. Earlier approvals do not backfill this count.
Nothing is implemented or released by this receipt.
