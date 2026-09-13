# Owner-delegated twenty-concept development admission — 2026-09-09

## Authority and boundary

Owner authorization recorded in the active implementation plan:

> “You can begin approving and implementing any questions or concepts you would like to on your own now. Only come to me with questions you have that you want my review on. Please create and approve 15 concepts on your own then implement all 20 at the same time into the game. Make sure there is variety, look for patients that can have good multi step questions where they have to get testing done first before the concept is tested since I want patients often getting tests done and having multi steps.”

Count clarification from the owner:

> “Add 14; implement all 20”.

The 2026-09-10 presentation-only timing revision follows the owner's additional direction:

> “Every time there are answer choices that can have testing, there needs to be a time listed for how much time that test will take.”

The admitted questions and the canonical hashes below are unchanged. Exact-ID and exact-label timing classifications use balance-owned editorial simulation estimates and do not alter result gates, scheduling, evidence, or clinician-review status. See the [September 9 source brief](../../execplans/autonomous-clinical-batch-source-brief-2026-09-09.md) and [patient wording and answer test-times plan](../../execplans/patient-wording-and-answer-test-times.md).

- Reviewer: Astra (agent), acting under the owner's delegated development authority.
- Author and implementer: Sol (agent), directed and reviewed by Astra.
- Review and admission date: 2026-09-09.
- Scope: local owner/development preview in the existing `synthetic_unapproved_prototype` release.
- This receipt does not record clinician sign-off for the fourteen new concepts and does not authorize a public release, publication, deployment, merge, or push.
- The fourteen new concepts, their questions, sources, claims, and case-review records remain `needs_clinician_review` with `lastClinicianReview: null`.
- The six Graves concepts retain their six original clinician-review snapshots and receipts. Their `{patientName}` and finite-profile runtime adaptation is separately reviewed under owner delegation and does not rewrite the historical clinician approvals.
- Runtime answer choices are shuffled. Review assessed the complete keyed questions and alternatives in their authored file order; the authored order is not a learner cue.

## Exact admitted inventory

The complete batch contains 20 stable concepts, 80 question variants, and 52 case blueprints. Twenty-four cases are multistep and contain 28 real result gates.

Six originally clinician-reviewed Graves concepts:

1. `concept.graves.clinical-pattern-recognition`
2. `concept.graves.trab-diagnostic-support`
3. `concept.graves.rai-appropriate-candidate`
4. `concept.graves.rai-pregnancy-contraindication`
5. `concept.graves.rai-lactation-contraindication`
6. `concept.graves.rai-active-ted-avoidance`

Fourteen owner-delegated agent-authored concepts requiring clinician review:

1. `concept.gallstones.initial-ultrasound`
2. `concept.gallstones.symptomatic-surgical-referral`
3. `concept.gallstones.incidental-observation`
4. `concept.nephrolithiasis.noncontrast-ct-evaluation`
5. `concept.nephrolithiasis.recurrent-metabolic-evaluation`
6. `concept.celiac.initial-serology`
7. `concept.celiac.duodenal-biopsy-confirmation`
8. `concept.celiac.gluten-free-treatment`
9. `concept.colorectal.positive-fit-colonoscopy`
10. `concept.colorectal.histologic-confirmation`
11. `concept.iron-deficiency.iron-studies`
12. `concept.iron-deficiency.gi-evaluation`
13. `concept.soft-tissue-mass.extremity-mri`
14. `concept.soft-tissue-mass.specialist-planned-biopsy`

Pathways comprise Graves recognition and radioiodine counseling; symptomatic and incidental gallstones; recurrent nephrolithiasis evaluation; celiac serology, biopsy, and treatment; positive FIT and tissue confirmation; iron-deficiency anemia laboratory and gastrointestinal evaluation; and extremity-mass MRI with specialist-planned biopsy.

## Frozen authored-content manifest

Hashes use SHA-256 over the finalized file decoded as text and encoded as UTF-8 without a byte-order mark, with CRLF normalized to LF. The family files contain the exact source records and atomic claim mappings; source publications are cited and summarized, not copied in full.

| Canonical SHA-256 | Repository path |
|---|---|
| `ef14f62dd3abb09aae246bb5e098f7b6cb5b4c5eca1d9349b0514ee07d20469c` | `packages/clinical-content/src/development-batch/2026-09-09/graves.ts` |
| `96cb0b405225cffe79511c83b7ced0222192eeb0caf4db23ca38739ac527910f` | `packages/clinical-content/src/development-batch/2026-09-09/batch-helpers.ts` |
| `735ebe7bdfbda2f14874df43a111564e70fa1a0a840a43a7289ed08e13341877` | `packages/clinical-content/src/development-batch/2026-09-09/gallstones.ts` |
| `422ecd5c076084b469d34b19b6fb6df525ce5491bc5a72a08285f4aa11b85e56` | `packages/clinical-content/src/development-batch/2026-09-09/nephrolithiasis.ts` |
| `ecadb325d01805cf43de80920bca4269e23b4fdff28b8e9eef8673ecb4fd9f82` | `packages/clinical-content/src/development-batch/2026-09-09/celiac.ts` |
| `fc8712d598cd0d85b4883a87f96cf81ede169bd229e550d41466ae526fca98e0` | `packages/clinical-content/src/development-batch/2026-09-09/colorectal.ts` |
| `ac4933ae3c62439272cdf4047c8e7030cf0856b40c9d9e711c2dfe40f8a2ddcb` | `packages/clinical-content/src/development-batch/2026-09-09/iron-deficiency.ts` |
| `b8c1a3be663ef89f3ebf19c8ed9b4072bc604a27dae0ca1287338fe059ce4a78` | `packages/clinical-content/src/development-batch/2026-09-09/soft-tissue-mass.ts` |
| `cbeabf6bf45ab1addf7be613b1fe0fc6cd8a74378001c7914243930040f68162` | `packages/clinical-content/src/development-batch/2026-09-09/new-clinical-batch.ts` |
| `c3118b26f48b73963a9abc69bc69a4d72ad858ca9a558d9906b44e14728189f8` | `packages/clinical-content/src/development-batch/2026-09-09/twenty-concept-batch.ts` |

Any later change to a bound file invalidates this manifest until it is reviewed and rehashed.

## Admission decision

Astra's agent review accepts this exact hash-bound batch for local owner/development admission with the provenance boundary above. It remains inside the existing unapproved prototype release and carries no claim that the fourteen newly authored concepts were reviewed by Melissa Rowland, MD or any other clinician.
