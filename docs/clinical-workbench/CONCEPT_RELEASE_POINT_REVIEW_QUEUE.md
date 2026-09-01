# Concept Release-Point Review Queue

Status: Active owner-review queue; not a playable clinical release

Date established: 2026-08-05

This queue covers 121 owner-authored rows, 2-122, through
`Gamify Surgery Concepts (4).xlsx`. Workbook-(4) rows 1-91 are unchanged from
workbook (3); its 31 newly read rows, 92-122, are recorded in
`NEW_CONCEPT_INTAKE_2026-08-31.md`. The earlier rows-57-91 intake remains in
`NEW_CONCEPT_INTAKE_2026-08-10.md` as historical provenance.

The review receipt approves the owner-authored concept, intended answer or
action, and reviewed stem/scope constraints. It leaves evidence traceability
unchanged, requires developer schema review, and does not itself authorize
runtime question publication.

The earlier AI-proposed numeric stage mapping was withdrawn before activation.
No row keeps an AI-assigned release point. Each concept will instead be worked
through with the owner, assigned one or more of the accepted semantic release
points, and given original question-iteration examples for exact review.

## Accepted workflow

1. The owner places a new version of the concept workbook under
   `clinical-data/imports/concept proposals/`.
2. On request, inspect the newest workbook and compare it with the last
   processed version.
3. Identify new and materially changed concept rows without treating a wording
   correction as a new stable concept automatically.
4. Resolve clinical intent, scope, evidence gaps, presentation boundaries,
   release points, correct answer, distractors, and terminal consequences where
   applicable.
5. Assess every concept for a clinically coherent multi-decision pathway.
   Propose the pathway when it connects independently valid scored concepts;
   ask the owner one targeted question when an essential link is missing. Do
   not add unrelated decisions merely to lengthen an encounter. Every scored
   decision retains exactly one primary FSRS concept, and four-decision
   encounters remain rare and unavailable before Level 3.
6. Show every original single-select question iteration with its complete
   answer set: the keyed correct answer and every proposed incorrect choice.
7. Mark the exact concept, Patient Presentation Variant, Question Variant,
   explanation, learning summary, and release point approved only after
   explicit named-clinician approval of those versions.
8. Add only the approved immutable revisions to an authorized clinical release.
9. Preserve campaign-specific FSRS identity and controlled release adoption.

## Release-point rules

The accepted vocabulary and facility progression are in
`docs/features/facility-levels-and-clinical-release-points.md`.

- Each normalized Patient Presentation Variant has one release point.
- Its Question Variants inherit that release point.
- One Tested Concept may have several presentation/question iterations at
  different release points while remaining one FSRS card.
- Hospital OR, Hospital Floor, ED / Trauma, and ICU remain future semantic
  points with no numeric level.
- Release point, evidence readiness, clinical approval, current-game
  eligibility, setting, and capability requirements remain separate.

## Current queue state

All rows 2-56 are present exactly once in
`concept-release-point-review-queue.json`.

Rows 8 and 25 now share one exact approved canonical concept,
`concept.inguinal-hernia.direct-operative-anatomy`, with three alternative
Question Variants at the Level 3 Ambulatory OR / QI release point. The approved
revision remains outside the playable release until Level 3 exists. Its
immutable receipt is
`approvals/owner-rows-008-025-direct-inguinal-anatomy.md`.

Row 23 is an independently approved Level 0 concept with two Question Variants.
Its immutable receipt is
`approvals/owner-row-023-pulmonary-optimization.md`.

Row 30 is approved as three concepts and two sequential encounters spanning
Level 0 Clinic Evaluation and Level 1 Minor Procedure. The Level 0 encounter
teaches initial ultrasound followed by observation of an asymptomatic simple
cyst. The Level 1 encounter teaches initial ultrasound followed by aspiration
for a persistently painful or bothersome simple cyst and requires the Minor
Procedure Room capability. Its immutable receipt is
`approvals/owner-row-030-breast-cyst-pathway.md`.

Row 31 is approved as one Level 0 Applied Science concept with three exact
Question Variants covering Burkitt lymphoma, an EBV-associated gastric-
adenocarcinoma subtype, and nasopharyngeal carcinoma. All three share one FSRS
identity and require no facility capability. The exact receipt is
`approvals/owner-row-031-ebv-associated-malignancies.md`.

Row 29 is approved as one Level 0 disposition concept with six
patient-to-criteria and four criteria-to-patient Question Variants applying
standard Milan criteria. All ten share one FSRS identity. Finite approved
presentation profiles vary age and narrative framing without recombining
answer-essential tumor facts. Its exact receipt is
`approvals/owner-row-029-hcc-milan-criteria.md`.

Row 34 is exactly approved as a two-concept package at Level 2 Endoscopy:
`concept.colonic-lipoma.endoscopic-recognition` and
`concept.colonic-lipoma.asymptomatic-management`. Four recognition variants
and four management variants are approved. Two direct blueprints pair one
decision from each concept; four reverse or boundary blueprints contain one
decision. The package remains outside the playable Level 0-1 release until
Level 2 Endoscopy exists. Its immutable receipt is
`approvals/owner-row-034-colonic-lipoma.md`.

Row 35 is exactly approved as two Level 3 imaging-recognition concepts with
four variants each:
`concept.breast-imaging.suspicious-mass-morphology` and
`concept.breast-imaging.suspicious-calcification-pattern`. Every question has
a brief patient presentation. Six blueprints begin with imaging results
already in hand. Two additional sequential blueprints are present as
development drafts, but their new first-step age-30-to-39 diagnostic-imaging
concept and exact answer sets remain `needs_clinician_review`. The approved
recognition package and draft sequential extension both remain outside the
Level 0-1 runtime. The exact receipt is
`approvals/owner-row-035-breast-imaging.md`.

Row 36 is exactly approved as three independent Level 0 concepts for clinical
recognition, selective imaging evaluation, and supportive management of
Mondor disease. Nine Question Variants are implemented across one three-step
encounter, one two-step encounter with persisted off-site diagnostic imaging,
and six short encounters. The selective-imaging and safety boundaries are
part of the approved revision. Its exact receipt is
`approvals/owner-row-036-mondor-disease.md`.

Row 37 is exactly approved as three separate Future - Hospital Floor concepts:
cross-sectional evaluation of postoperative abdominal swelling, diagnostic
fluid confirmation of chylous ascites, and initial hospital management of a
large symptomatic postoperative chylous leak. The one approved three-decision
pathway may begin with a clinic presentation but transitions to hospital care.
CT defines the extent of ascites without identifying its composition, and
fluid sampling supplies the confirmation. No numeric facility level is
assigned, and the package remains outside the current runtime. Its exact
receipt is
`approvals/owner-row-037-postoperative-chylous-ascites.md`.

Row 38 is exactly approved as one foundational applied-science FSRS concept,
`concept.wound-healing.vitamin-c-collagen-hydroxylation`, with four
single-decision variants at Level 2 Endoscopy in the Peri-op/Recovery setting.
The approved revision teaches vitamin C as a cofactor for proline and lysine
hydroxylation in collagen biosynthesis, not a type III-only effect, and does
not imply universal high-dose postoperative supplementation. It remains
outside the current Level 0-1 runtime. Its exact receipt is
`approvals/owner-row-038-vitamin-c-collagen-hydroxylation.md`.

Row 39 is exactly approved as two Level 2 Endoscopy concepts for integrated
pathologic recognition of gastric MALT lymphoma and H. pylori
eradication-first management of the classic localized low-grade presentation.
Six single-select Question Variants and four encounter blueprints are
approved. CD20 alone is explicitly nondiagnostic, eradication requires
confirmation and lymphoma-response reassessment, and correct-answer length is
not a usable cue. The package remains outside the Level 0-1 runtime. Its exact
receipt is `approvals/owner-row-039-gastric-malt-lymphoma.md`.

Row 40 is exactly approved as one intermediate Level 2 Endoscopy workup
concept,
`concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy`, with four
single-decision variants. The approved revision teaches four-hour solid-meal
gastric emptying scintigraphy after mechanical obstruction has already been
excluded. It remains an outpatient clinic encounter using an off-site service
and has no Endoscopy Room capability gate. Exact retention cutoffs, testing
preparation protocols, and treatment are outside this concept. The package
remains outside the Level 0-1 runtime. Its exact receipt is
`approvals/owner-row-040-gastroparesis.md`.

Row 41 is exactly approved as one Future Hospital Floor management concept,
`concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible`,
with four single-decision variants. The approved patient has severe ileus
beyond seven postoperative days, no mechanical obstruction, addressed
reversible contributors, and no feasible adequate oral or enteral route.
Parenteral nutrition is taught as nutritional support rather than treatment
for the ileus. No numeric facility level or capability is assigned. The exact
receipt is `approvals/owner-row-041-postoperative-ileus.md`.

Row 42 is exactly approved as one staged gastric-cancer management concept,
`concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance`, with four
single-decision variants. Two post-endoscopy counseling variants begin at
Level 2 Endoscopy, while two operative-planning variants remain deferred to
Future Hospital OR. The scope is limited to resectable proximal gastric
adenocarcinoma without greater-curvature invasion, direct splenic invasion, or
suspected splenic-hilar disease. Routine prophylactic splenectomy is avoided
because it adds morbidity without improving survival; the package does not
teach that splenectomy is never appropriate. Its exact receipt is
`approvals/owner-row-042-gastric-splenectomy.md`.

Row 43 is exactly approved as one Future ICU management concept,
`concept.severe-burn.early-enteral-nutrition`, with four single-decision
variants. The package teaches enteral nutrition as soon as feasible within 24
hours for an extensively burned, adequately resuscitated patient with a usable
gastrointestinal tract and no enteral contraindication. The retained
eight-hour presentation is patient context rather than a universal cutoff.
Ongoing shock, incomplete resuscitation, suspected intestinal ischemia, and
mechanical obstruction remain outside the approved scenario. No numeric
facility level or capability is assigned, and the package remains outside the
current runtime. Its exact receipt is
`approvals/owner-row-043-severe-burn-early-enteral-nutrition.md`.

Row 44 is exactly approved as one Future Hospital OR management concept,
`concept.ventral-hernia.controlled-enterotomy-macroporous-synthetic-mesh-selection`,
with four single-decision variants. It applies only after a recognized
small-bowel enterotomy during ventral or incisional hernia repair is securely
repaired, source control is adequate, contamination is minimal and controlled,
gross spillage is absent, and the operative team has already selected a
single-stage repair. The package teaches permanent macroporous monofilament
synthetic mesh without making mesh repair automatic after every enterotomy.
No numeric facility level or capability is assigned, and the package remains
outside the current runtime. Its exact receipt is
`approvals/owner-row-044-controlled-enterotomy-mesh-selection.md`.

Row 45 is exactly approved as one Future ED / Trauma operative-anatomy
concept, `concept.thoracic-trauma.right-thoracotomy-exposure`, with four
single-decision variants. Two variants select exposure for compatible
multiple-injury patterns, one reverses the mapping from incision to exposed
structures, and one preserves the boundary between a planned posterolateral
exposure and immediate resuscitative thoracotomy. `Right thoracotomy` is the
canonical identity; `right posterolateral thoracotomy` is context-specific to
a stable or stabilized patient undergoing planned repair. The encounter
requires a future Hospital OR setting but enters circulation through the
Future ED / Trauma release point. No numeric level or capability is assigned,
and the package remains outside the current runtime. Its exact receipt is
`approvals/owner-row-045-right-thoracotomy-trauma-exposure.md`.

Row 46 is exactly approved as one Future Hospital OR management concept,
`concept.meckel-diverticulum.resection-extent`, with four single-decision
variants. Two variants select segmental ileal resection when inflammation
involves a measured broad base and adjacent ileum; two test the reciprocal
simple-diverticulectomy rule for a long, narrow diverticulum with tip-only
inflammation and a healthy base and adjacent ileum. A base width of 2 cm or
greater is preserved only as an operational definition from a small adult
perforation series, not a universal cutoff or stand-alone indication. The
package excludes incidental management, bleeding, tumor, obstruction, a
patent omphalomesenteric duct, and the separate wedge-versus-segmental
boundary. No numeric level or capability is assigned, and the package remains
outside the current runtime. Its exact receipt is
`approvals/owner-row-046-meckel-resection-extent.md`.

Row 47 is exactly approved as one Level 0 Clinic Evaluation applied-science
concept,
`concept.aaa.female-sex-associated-perioperative-mortality`, with four
single-decision variants. It teaches the group-level association between
female sex and higher observed perioperative mortality after elective intact
AAA repair, including both EVAR and open repair, without treating the
association as deterministic for an individual patient. Ruptured AAA,
thoracoabdominal aneurysm, screening eligibility, individual repair fitness,
and procedural selection remain outside scope. Its multi-decision assessment
prefers a focused single decision because a longer sequence would require
separately approved screening, surveillance, threshold, or repair-selection
concepts. The package is admitted to the active Level 0 development release.
Its exact receipt is
`approvals/owner-row-047-aaa-female-perioperative-mortality.md`.

Row 48 is exactly approved as two Level 0 Clinic Evaluation management
concepts: `concept.desmoid.initial-active-surveillance` and
`concept.desmoid.progressing-abdominal-wall-surgical-option`. Eight
single-select variants are exposed through seven encounter blueprints. One
two-decision encounter begins with specialist active surveillance for
newly diagnosed noncritical disease, then uses an explicitly authored later
follow-up with persistent progression, pain, and impaired mobility to test
the location-specific option of function-preserving abdominal-wall resection
after multidisciplinary review. The package does not generalize surgery to
other locations, pursue a wide margin at any functional cost, or simulate
months of surveillance with facility time. It is admitted to the active Level
0 development release. Its exact receipt is
`approvals/owner-row-048-desmoid-management-pathway.md`.

Row 49 is exactly approved as two management concepts: high-risk peptic-ulcer
stigmata requiring endoscopic hemostasis and endoscopic hemostasis modality
selection. Nine single-select variants are exposed through seven encounter
blueprints, including a Level 2 two-decision nonbleeding-visible-vessel
pathway and a Future Hospital Floor two-decision active-oozing pathway. Every
variant has a brief patient presentation. Stable visible-vessel variants are
staged for `release.l2.endoscopy`; active-bleeding variants are staged for
`release.future.hospital_floor`. The package teaches that epinephrine alone is
not definitive, without falsely making accepted thermal or mechanical
monotherapy universally wrong. It remains outside the current Level 0-1
runtime. Its exact receipt is
`approvals/owner-row-049-peptic-ulcer-bleeding-hemostasis.md`.

Row 50 is exactly approved as one Level 3 Ambulatory OR / QI applied-science
concept, `concept.quality-improvement.pdsa-act-and-iterate`, with five
single-decision variants. Each uses a short, dry ASC project involving the
"ask Dana" supply system, color-coded bins, voicemail and optimism, a visually
encouraging supply-cart failure, or the clinic's theoretical clipboard
inventory. After Study, the player uses results to adopt, adapt, or abandon the
change and prepare the next linked PDSA cycle. The humor never changes the
measured result or key. A multistep QI project awaits a separately reviewed
measure-selection or interpretation concept so the same FSRS card is not
scored twice. The package remains outside the current runtime. Its exact
receipt is
`approvals/owner-row-050-quality-improvement-pdsa-iteration.md`.

Row 51 is exactly approved as one management concept,
`concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy`,
with five single-select variants sharing one FSRS identity. Four counseling,
candidate-selection, and referral variants are admitted to Level 0 Clinic
Evaluation. One procedure-by-location variant is approved but deferred to
Future Hospital OR. Every scenario fixes biopsy-confirmed tail
adenocarcinoma, multidisciplinary-defined resectability, operative fitness,
and absence of distant metastases; absence of metastases alone is not treated
as proof of resectability, and systemic-treatment sequencing remains outside
scope. Its exact receipt is
`approvals/owner-row-051-pancreatic-tail-adenocarcinoma-resection.md`.

Row 52 is exactly approved as three Level 0 concepts: recognition of Felty
syndrome, methotrexate as usual first-line disease-modifying treatment, and
consideration of splenectomy for recurrent infections despite adequate medical
therapy. Six single-select variants are active. One three-decision encounter
uses an explicitly authored later specialist follow-up; three other encounters
remain single-decision. Splenomegaly is not required, important mimics remain
excluded, exact historical response percentages are not taught, and the
proposed seventh surgical-candidate variant is explicitly excluded. Its exact
receipt is `approvals/owner-row-052-felty-syndrome-pathway.md`.

Row 53 is packaged and tested as deferred data: nine separate future Level 3 pathology-follow-up/planning
concepts for benign, borderline, and malignant phyllodes management plus
spread-pattern and axillary boundaries. Exactly 33 patient-based question
versions are approved: four variants for each concept except three each for
borderline close-margin management, malignant close-margin management, and no
routine axillary staging. The approved content distinguishes benign complete
excision from a fixed-width margin requirement, retains the specified
borderline and malignant consensus margin-management boundaries, and does not
authorize onsite surgery or runtime admission. Every wording revision or new
variant requires exact named-clinician re-review. The exported package is
`packages/clinical-content/src/approved-data/phyllodes-pathology-follow-up.ts`
(content version `clinical.owner-row-053.2026-08-31.1`) with its focused test
at `packages/clinical-content/src/approved-data/phyllodes-pathology-follow-up.test.ts`;
it contains two source records and nine evidence claims, all source/claim prose
remaining `needs_clinician_review`. It remains deferred (`deferredRuntimeAdmission:
true`) with no active-game selection or onsite operation. Its immutable receipt is
`approvals/owner-row-053-phyllodes.md`.

Row 60 is exactly approved as three Level 0 concepts for biochemical evaluation
of suspected FHH, recognition and confirmation of FHH, and avoidance of
unnecessary parathyroid surgery. Four encounter variants contain five scored
single-select decisions. One two-decision encounter uses an explicitly authored
later endocrine follow-up after family and genetic confirmation. Relative
hypocalciuria is a clue rather than an independent diagnosis, serum magnesium
is not used as a definitive discriminator, and two proposed variants were
removed. Its exact receipt is
`approvals/owner-row-060-familial-hypocalciuric-hypercalcemia.md`.

Row 61 is approved as six distinct future FSRS identities covering Graves
pattern recognition, TRAb diagnostic support, appropriate RAI evaluation, and
the separately scored pregnancy, current-lactation, and active moderate-to-
severe thyroid-eye-disease avoidance boundaries. Exactly six reviewed seed
question versions/scopes are clinically approved. The eventual release point is Level 0 Clinic
Evaluation for counseling/referral only; radioactive iodine is never given
onsite. No runtime package, encounter, source record, or implementation is
approved by this receipt. Each identity ultimately needs at least four authored
variants with distinct presentations and retrieval directions; the remaining
eighteen variants and every later wording revision stay
`needs_clinician_review` until exact named-clinician approval. The immutable
receipt is `approvals/owner-row-061-graves-rai.md`.

Rows 62, 66, 87, and 109 are actively implemented in the development-preview
Level 0 release at `release.l0.clinic_evaluation`. Row 66 is limited to
UC/IPAA inflammatory-pouch frequency; row 87 is limited to Type IVA
congenital-bile-duct-cyst anatomy in reviewed MRCP; row 109 is limited to the
anal-HSIL/high-risk-HPV association after pathology is available. Their
receipts are `approvals/owner-row-062-men2a.md`,
`approvals/owner-row-066-pouchitis-after-ipaa.md`,
`approvals/owner-row-087-type-iva-bile-duct-cyst.md`, and
`approvals/owner-row-109-anal-hsil-hpv.md`. Wording revisions and new variants
require exact named-clinician re-review.

Rows 57 and 58 were unchanged between workbooks but had stale queue state;
their existing approved/implemented records are now reconciled. Workbook-(4)
rows 92, 104, 111, 115, and 119 retain existing approvals rather than being
added as unreviewed proposals.

There are 81 `pending_concept_workthrough` records: 56 from rows 2-91 and 25
from new rows 92-122. Their approved release-point IDs remain empty until the
owner and developer complete each concept's review. The next source row is
intentionally unset pending Sol's rerank after this early-game batch. The queue
as a whole remains blocked from automatic runtime admission: exact approvals,
approved scope splits, and partial pathway decisions do not authorize the
remaining records.

The current evidence dispositions are:

| Evidence disposition | Count |
| --- | ---: |
| `supportable_with_scope` | 24 |
| `partially_supported_needs_narrowing` | 18 |
| `withhold_as_written` | 10 |
| `rights_cleared_source_gap` | 4 |
| `not_yet_triaged` / evidence review in progress | 34 |

An evidence disposition does not decide the release point. It determines what
must be resolved before original runtime content can be authored and approved.
