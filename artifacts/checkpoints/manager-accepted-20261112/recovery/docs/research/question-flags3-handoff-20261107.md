# Flags3 owner-question handoff — 2026-11-07

Three owner flags are addressed in **draft candidates**, with no source-held key
parked. There are four new scored variants: the three flagged objectives and an
added hernia-type question. All remain `needs_clinician_review`, awaiting
independent review and manager acceptance; Melissa Rowland is clinical sign-off.
The exact live questions and ship manifest are unchanged. Nothing was shipped.

[Review packet](question-flags3-20261107.json) follows the flags2 before/after
format, explicitly **key shown first for review only**. It contains owner notes,
rationale pairs, inference/decider, per-item manual five-part self-check,
counterfactuals, raw lint findings/dispositions, prior visible history, concept
decisions, composition warnings and exact live fallbacks. Runtime choices have
`shuffleAnswers: true`. The added type record shows the original management
question as provenance and explicitly states there was no separately scored
type question before; it does not invent a historical question.

## Per-flag result

| Flag | Candidate / status | Owner note → change |
| --- | --- | --- |
| F3-01 | `question.statistics-ethics.predictive-value-prevalence.v4.r1`; supported draft | Replaces the conflicting aldosteronism presentation / breast-test task and eliminative fixed-characteristic wording with one concrete positive-screen audit. A complete 2×2 table states each observed count once. One task asks for the reference-positive fraction among positive screens; all four options are approximate percentages. |
| F3-02 | `question.achalasia.manometric-recognition.v2.r7`; supported draft | Presentation gives symptoms only; the update gives weight loss. Six short labelled result rows separate endoscopy, sampled mucosa, CT and pressure acquisitions. No repeated findings or diagnosis conclusion before answering. The task asks for the next procedure. |
| F3-03 | `question.groin-hernia.ultrasound-type.v1` plus `question.inguinal-hernia.symptomatic-elective-repair.v3.r11`; supported draft pair | Raw neck/ligament/vein findings precede a three-choice hernia-type decision. A separate next decision combines the established type with reduction/acuity observations to choose a repair plan. No prior interpreted hernia label is carried into the proposed results visit. |

**F3-01:** the captured v4 names primary aldosteronism/urinary assay in its case
but breast-cancer blood test in its task. It also explicitly fixes all three
distractor properties. Earlier G06's owner note was “Dont have this be so
hypothetical”; its accepted v2.r1 teaches a particular specimen-population /
denominator decision. That accepted sibling is a different case and concept,
not coverage of this v4 flag. G06 and its decision remain exact. The new v4.r1
keeps `concept.statistics-ethics.predictive-value-prevalence`, whose existing
objective includes PPV calculation. The fictional audit gives 40 reference-
positive and 95 reference-negative positive screens: 40/135 ≈ 30%. Its 70%, 80%
and 90% alternatives represent the opposite reference outcome, sensitivity and
specificity. These are constructed teaching counts, not empirical MRSA assay
performance, an infection diagnosis or a prophylaxis recommendation.

**F3-02:** keeps
`concept.achalasia.secondary-junction-lesion-assessment.v1`. Existing ACG/Chicago
claims directly support the primary-position motor-pattern / secondary wall-
target distinction. No new IRP cutoff, weight/time threshold, malignancy
probability or sampling-device protocol was added. The currently live preceding
acquisition question `question.achalasia.high-resolution-manometry.v2.r6`, its
feedback and result gate are byte-exact in the candidate case. This checkout's
first task differs from the supplied screenshot's catheter-placement task;
that difference is recorded, without attributing the screenshot to a particular
build/save. No absent contrast-swallow result was invented. The named draft
uses Gavin Keller, 66 M, as in the supplied clinical context. The six findings
are reported once, with the pressure data supplying the credible functional-
testing alternative and the focal wall/mucosal discrepancy determining the
next target. Exact foregut target/ranking remains for clinician review.

**F3-03:** the original repair-priority concept stays
`concept.groin-hernia.femoral-defect-repair-priority.v1`. The newly scored diagnostic
sub-objective has the separate identity
`concept.groin-hernia.ultrasound-compartment-classification.v1`, with explicit
previous-concept/version reasoning and **no history migration**. Three parallel
types are femoral, direct inguinal and indirect inguinal hernia. Type feedback
contains no repair/observation rule. Reduction and nonacute findings appear
once at the management decision, so its context is complete after separation
for display. The classification is likely easier for a well-prepared resident;
the packet states this residual difficulty concern and does not call it an
accepted basic item or an independently calibrated moderate/hard item.

## Source and claim record

[Source ledger](sources-question-flags3-20261107.json): **14 existing source
records**, **15 retained basis claims**, **10 new atomic applications** and
field mappings. Full citation, organization/journal, authors, year (explicitly
undated where the existing record supplies none), DOI/official URL, original
access date, source class, license/reuse status, medical authority and intended
claim use are retained. Source links have `_blank` / `noopener noreferrer` /
`no-referrer`. No source text, figure, table or algorithm was retrieved/copied.
The audit table is original constructed data.

This milestone used **offline recorded facts**, with no network access or claim
of refreshed source currentness. Application/arithmetic checks are dated
November 7; basis verification and source access dates remain their actual
earlier dates. The statistics definitions are CDC/FDA records; the wall-target
reasoning uses recorded ACG/Chicago guidance; anatomy uses the recorded groin
imaging/technical references; repair/observation uses HerniaSurge. The femoral
repair direction has one adequate recorded guideline; that limitation remains.
No clinical approval of an older basis claim approves a new application.

## Advisory lint and manual review

Linter `question-cue-lint.2026-11-04.v8` examines all three candidate cases and
canonical/finite profiles, including preceding results and feedback: **5 nodes,
10 contexts**, of which **4 new variants / 8 contexts**. The before/after raw
report is `tools/question-quality/question-flags3-lint-20261107.json`.

**Four findings on new variants, one on preserved context; zero suppressed.**

- F3-03 type: two raw-landmark phrases match its keyed rationale, and “femoral”
  in the necessary vessel name matches the key. The report also names the
  inguinal ligament; a diagnosis is not supplied. Retain the anatomical findings
  and expose the residual lexical shortcut risk for independent review.
- F3-02: only ultrasound matches the linter's small test-name dictionary, which
  does not recognize the offered functional lumen imaging / timed barium test
  names. All options are concrete investigations at the same stage. No keyed
  test name appears in the data; the warning is still retained.
- Preserved first dysphagia question: the existing “after” overlap remains
  reported. That unrelated current version was not rewritten.

The manual rubric is applied per exact candidate, rather than five automatic
success booleans. It identifies the closest resident error, deciding observation,
counterfactual, same-stage/category check, deletion test and likely difficulty.
Raw warnings and residual ease do not become author PASS or clinical sign-off.
Independent review must assess actual difficulty and ranking.

## Candidate integration and frozen compatibility

Direct-import view: `QUESTION_FLAGS3_SOURCE_RELEASE` / `flags3-round1` from
`packages/clinical-content/src/question-flags3-20261107.ts`. It is **not imported
by the runtime barrel/default assembly**. No build, gameplay or external request
occurs to fetch sources or run AI. No existing file was edited except the final
additive shared handoff; the four runtime modules are preview-only new files.

- F3-01 keeps its one-node case. Accept its exact new tuple and header/profile
  only after review.
- F3-02 keeps the current two-node shape. Its first decision/gate is exact;
  accept the second tuple and symptom-only header/profile after composition
  review. Its three new procedure estimates reuse the original profiles;
  exported exact proposal records are `future_planned`, not service executions.
- F3-03 proposes a two-node **result-review encounter** replacing the old
  investigation/plan pair. The old interpreted inguinal result gate is absent.
  Manager must review/accept the complete pair through whole-case replacement;
  an isolated new-node row cannot safely replace the old node list. The original
  workup question/case stays in the archive and current live selection until
  acceptance. No retirement is performed by this worker.

The new classification concept has paired-only coverage. Existing selector/FSRS
rules can defer the case if its management companion is future-due; those rules
are unchanged. Do not transfer management history to the classification card.
All original case/question/choice/concept/order identities remain untouched for
frozen encounters and saves. Acceptance and any later composition/rebind belong
to the manager, under the stated PASS-or-owner-resolving-REVISE/no-FAIL rule.

## Validation

All native exit codes are **0**:

| Working directory / exact command | Output |
| --- | --- |
| `packages/clinical-content`: `npm.cmd test -- --pool=threads` | **122 files passed; 1,352 tests passed; 30.60 s** |
| Repository root: `npm.cmd run typecheck` | **All seven workspace typechecks passed** |
| Repository root: `npm.cmd run clinical:lint:test` | **33 tests passed, 0 failed; 2,557.9205 ms** |

Author/source generation and packet regeneration `--check` also pass. The new
clinical test file has **15 tests**, including exact live/source retention,
mathematical denominators, report/chronology separation, no pre-answer type or
premature repair rule, timing metadata, full source mappings and drift rejection.
Logs and exit records are in `.local-dev/question-flags3-20261107/`. Exact log
hashes are in `question-flags3-validation-20261107.json` alongside this handoff.
No game-domain/player full-suite run is claimed or required for this milestone.

## Scope, hashes and files

All **840 captured existing source/decision files** remain byte-exact, as do the
entire live release, catalog, ship manifest and global timing registry. Live
default remains **1,141 cases / 1,452 nodes / 605 registered meanings**.

- Unchanged live SHA-256: `77261db946b72dbf0f001e6ce11aab75928b561a19a8a17a874274f08b185a30`.
- Candidate-view SHA-256: `3be43217d9e9077b2ce47945e28e0d55b88c20e97a494e8bae4d1d91c53f2033`.
- **Existing Level 5 bound inputs changed: none.** No existing index, assembly,
  timing/order, domain/balance, cloud/Supabase, Level 5 evidence/pin or release
  file changed. The four new direct-import candidate modules need explicit
  integration/hash handling only if later accepted; no rebind was performed.

New clinical-content files:

- `packages/clinical-content/src/question-flags3-20261107.ts`
- `packages/clinical-content/src/question-flags3-20261107-data.ts`
- `packages/clinical-content/src/question-flags3-evidence-20261107.ts`
- `packages/clinical-content/src/question-flags3-retained-input-20261107.ts`
- `packages/clinical-content/src/question-flags3-20261107.test.ts`

New tools/artifacts:

- `tools/question-quality/capture-question-flags3-20261107.mjs`
- `tools/question-quality/question-flags3-specs-20261107.mjs`
- `tools/question-quality/author-question-flags3-20261107.mjs`
- `tools/question-quality/review-question-flags3-20261107.mjs`
- `tools/question-quality/fixtures/question-flags3-before-20261107.json`
- `tools/question-quality/question-flags3-lint-20261107.json`
- `tools/question-quality/question-flags3-scope-20261107.json`
- `tools/question-quality/question-flags3-files-20261107.json`

New documents: this handoff, the packet/source ledger/validation record beside
it, and `docs/execplans/question-flags3-20261107.md`. The shared current-thread
handoff has an additive entry. No private flag digest/email was accessed or
copied; the three owner notes came from the manager brief.

Open risks: raw anatomy lexical overlap and classification ease; case-specific
foregut/sampling ranking; the new hernia pair's composition and selection
coverage. No commit, push, deploy, install, agent, external message or network
operation occurred. Work is local only; manager owns independent review,
acceptance, release and any separately authorized GitHub backup. Stop here.
