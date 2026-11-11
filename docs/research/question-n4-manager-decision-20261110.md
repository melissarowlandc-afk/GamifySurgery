# N4 manager acceptance — 2026-11-10

The manager explicitly accepts the following eight independently PASSed exact
versions as **new default-release draft cases**. Authority is the rewrite-lane
manager instruction and the two linked independent reviews. This is editorial
acceptance, not Melissa Rowland's clinical sign-off. Every question and case
review remains `needs_clinician_review` with no new clinician review recorded.

| Exact accepted review ID | Stable /versioned concept ID | Bound view |
| --- | --- | --- |
| `review.n4.cholecystectomy-neck-plane-bailout.v1` | `concept.gs028g.subtotal-cholecystectomy.safe-bailout` | `n4-round1` |
| `review.n4.colonic-wall-pattern-after-mucosal-biopsy.v1` | `concept.colonic-lipoma.endoscopic-recognition.v3` | `n4-round1` |
| `review.n4.venous-ulcer-contralateral-pressure-trap.v1` | `concept.venous-leg-ulcer.arterial-assessment-before-compression` | `n4-round1` |
| `review.n4.incisional-pocket-above-retained-mesh.v1` | `concept.superficial-incisional-ssi.open-drain` | `n4-round1` |
| `review.n4.ventral-controlled-enterotomy-mesh-material.v2` | `concept.n4r2.mesh-material-and-contact-compartment` | `n4-round2` |
| `review.n4.unexpected-deep-mass-during-lipoma-excision.v2` | `concept.soft-tissue-mass.extremity-mri.v2` | `n4-round2` |
| `review.n4.ulcer-recurrent-bleeding-after-clips.v2` | `concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2` | `n4-round2` |
| `review.n4.cholangiogram-lucencies-and-proximal-coverage.v1` | `concept.n4r2.cholangiogram-quality-before-duct-treatment` | `n4-round2` |

Exact question IDs replace the `review.` prefix with `question.`. Exact case,
node, question, concept and source-view tuples are in the
[accepted packet](question-n4-accepted-20261110.json) and manifest. Header sources
are explicit for every new case. No replacement relation is added and no old
case or authority row is removed or changed.

Independent authority:

- [Round1 review](question-new-n4-review-20261110.json): four PASS versions above.
- [Round2 review](question-new-n4-review2-20261110.json): four PASS versions above.

The seven round2 REVISE versions are not accepted. The prior returned/manual
parks, other executable catalog drafts, unwritten topics, and held anal-fistula
decision are not accepted. No pediatric family/art binding is installed.

## Bound source and frozen fields

| View | Exact source release | SHA-256 |
| --- | --- | --- |
| `n4-round1` | `QUESTION_NEW_N4_SOURCE_RELEASE`, 21 cases | `6e52115019ab011b59722b68c6cb2ddca7c8f43943a56652327cc87bb2f69782` |
| `n4-round2` | `QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE`, 15 cases | `5ee26ba76c9deaa161e423f1419a9030e2886dd4a7c678626b9156a22b5f0c51` |

Both source modules are self-contained; no catalog import cycle requires a
static duplicate view. Original N4 authoring files and review records remain
byte-exact. `QUESTION_N4_FROZEN_PRESERVATION` binds all eight accepted questions
and source-normalized cases; the raw authoring case hashes are also retained.
Raw and schema-normalized cases have equal field values with different JSON
property ordering. Both identities are checked without refreshing the intake.

Six existing concept definitions remain exact. Only the two independently
versioned N4r2 meanings are added to the registry. No FSRS card is migrated,
merged, reset or relabeled. Existing frozen encounters and choice orders remain
available under their original question and concept IDs.

## Integration boundaries

Manifest v9 has145 acceptance rows. The default has1,151 cases /1,462 nodes /
610 registered identities (454 distinct scored meanings). All 1,143 prior cases
and 608 prior registered identities remain exact. The existing catalog is
unchanged; the 35-case N4 authoring catalog is retained as an explicit source,
with only eight versions admitted.

Clinical-content installs eight exact timing classifications. Eight accepted-only
`future_planned` diagnostic order records are exported for the domain owner;
this milestone does **not** install domain runtime bindings. The
[runtime integration handoff](question-n4-runtime-integration-20261110.json)
lists every accepted concept's current affinity, required setting/capabilities,
and exact diagnostic-choice tuple.

Current required topic addition: `concept.superficial-incisional-ssi.open-drain`
to `packages/game-domain/src/clinic-consult-topics.ts:woundConcepts`. Both
accepted endoscopy meanings are already present in
`founder-consults.ts:endoscopicFindingConcepts`. All four accepted OR cases are
already recognized through `requiredClinicalSetting: ambulatory_surgery`; there
is no OR concept-ID allowlist to extend. Domain runtime, source-only selection,
save/charts-list fixes and session view models remain with the active domain
worker. No manifest or reopen gate is introduced.

The source-only ordinary-fallback issue described by the N4 authoring handoff
is not declared fixed here. Real-source admission and frozen-save tests prove
supported routes, not a global guarantee that ordinary selection never offers
a procedural case without its source.
