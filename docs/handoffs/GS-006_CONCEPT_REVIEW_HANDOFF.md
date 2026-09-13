# GS-006: owner clinical concept review

Updated: 2026-09-13. Status: early-level batch and prior clinical dependencies implemented and validated; owner-authorized scoped GitHub backup in progress. See the September 13 completion entry below for current counts; earlier entries are historical.
Task: `01a08678-2899-7410-8bf1-613839be60f7`.

## September 11: twenty additional board concept groups

Read the GS-011 concept-review notes and the live Gamify Surgery Concepts sheet
(populated through row158 at review). Recheck that live sheet for future batches;
the owner adds concepts intermittently. The sheet supplies candidates, with
clinical facts independently checked against the sources in the
[review receipt](../clinical-workbench/approvals/owner-delegated-board-expansion-2026-09-11.md).

Added20 stable scored concepts,80 question variants and40 two-node patients
across breast abscess, thyroidectomy voice change, Zenker, PAD, PHPT, Cushing,
pancreatic cysts, colon cancer, rectal response assessment and carotid stenosis.
All40 patients have an actual diagnostic result gate. The active prototype now
contains103 concepts,258 cases and383 decision nodes. All new testing options,
including distractors, have neutral game-time estimates; mixed non-test options
say "No test wait." Seven explicit external services support the new pathways.
Prior frozen cases, IDs, pending due ticks and learning history are preserved.

GS-011-003/004 chart feedback now separates submitted-answer outcomes from new
findings and names the correct answer after a mistake. GS-011-007 celiac content
remains supplemental after public SCORE review; absence from the outline does
not establish that it is never tested. GS-011-009 day-six patient shortage
remains undiagnosed; the content addition is not evidence of a scheduling fix.
Other GS-011 issues are outside this batch.

Terra handled inventory, six concepts, chart feedback, integration and browser
validation; Sol handled source/scope review, fourteen concepts and semantic
timing review. Astra reviewed actual content/diffs, source limits, answer keys,
validation logs and12 receipt hashes. All973 affected-package tests pass
(clinical318/domain217/player427/balance11), plus full build, all seven
workspace typechecks and boundary checks. The existing bundle-size advisory
remains. Three isolated browser scenarios passed individually (PAD, breast and
rectal); Astra reviewed all eight screenshots and final logs. The test-only
breast correction handles the existing Enact Corrected Plan button. There is
no remaining required work in the
[completed plan](../execplans/implement-board-concept-expansion-2026-09-11.md).

Editorially accepted under delegated owner authority; records still require
named-clinician review and are confined to the unapproved prototype. No commit,
push or deployment. Remind the owner to say **"push to GitHub"** for backup.
Keep GS-006 open. Owner launch remains START_GAME.cmd at exactly
http://127.0.0.1:4173 in the usual persistent browser profile. Browser acceptance
uses isolated test contexts at that origin; it does not modify owner saves.

## September 10: descriptive anatomy and complete test-choice timing

The owner's latest request replaces pre-answer "natal cleft" wording with a
description of the upper groove between the buttocks near the tailbone. All four
pilonidal variants are updated; known frozen pilonidal presentations receive a
display-only correction without rewriting saved cases or explanations.

An explicit registry classifies all 303 admitted decision nodes: 106 contain
testing choices, 197 do not, and 357 individual test choices receive estimates.
All testing alternatives, including distractors, display game-time estimates
with the same neutral caption. Mixed nodes label other actions "No test wait";
pure diagnosis questions have no timing labels. This supersedes the earlier
batch-wide concealment of pre-answer previews recorded below.

Future authoring must update `packages/clinical-content/src/answer-choice-timing.ts`
for every new or revised node. Review all options semantically, including repeat
testing, sampling and surveillance, and distinguish ordering from interpreting
already available results. Exact labels protect frozen cases from stale mappings.
Use balance-owned simulation profiles and the corresponding live service for an
existing test. New estimates must not claim real-world turnaround times. Never
derive a time or caption from correctness or executable result-gate presence.

Terra diagnosed the preview gaps. Sol implemented registry/profile resolution,
chart/tutorial presentation, wording compatibility and regressions. Astra
reviewed the actual scoped diffs and full classification, returned corrections,
and verified focused validation. Scheduling, pending due ticks, FSRS IDs and
clinician-review boundaries remain unchanged. All 916 affected-package tests
passed (304 clinical, 176 domain, 10 balance, 426 player). The initial concurrent
domain run hit its existing long-flow timeout; the full isolated rerun passed
without weakening assertions or limits. Three browser tests passed at the exact
canonical origin in isolated Chrome contexts, covering thyroid, mixed FHH and
current/legacy pilonidal charts. Astra reviewed the actual spec, logs and all four
screenshots. Full build, dependency/launcher boundaries and all seven workspace
typechecks passed. A final test-only TypeScript narrowing fix passed all eight
focused domain timing tests and the complete build rerun. The known Vite bundle
size warning remains. All requested work is complete; see the
[active plan](../execplans/patient-wording-and-answer-test-times.md).

## September 10: board scope governs future concept selection

The owner asked to keep the existing ureteral-stone question while grounding
future concepts in documented ABSITE and general surgery board coverage.
Use the [board-content scope guide](../clinical-workbench/BOARD_CONTENT_SCOPE.md)
before selecting another batch. It records the official public SCORE outline,
ABSITE and written Qualifying Examination blueprints, and oral Certifying
Examination guidance, with their distinct purposes and limitations.

Prioritize specific general surgery curriculum topics and documented exam
category emphasis, then facility fit. Record each future concept's exact SCORE
topic, locator and depth, target exam, and explicit/inferred/supplemental
relevance. A plausible clinic patient or useful test sequence alone does not
establish board relevance. Preserve coherent generated patient presentations
and purposeful evaluation, returned results, management and complication steps;
do not order unnecessary tests to create more steps.

The two existing nephrolithiasis concepts remain unchanged. Their CT-workup and
recurrent-stone metabolic-evaluation teaching points are not explicitly named
in the reviewed public SCORE outline, so treat them as supplemental in future
planning. This does not establish that they are never tested. Broad GU category
coverage cannot establish the frequency of an individual stone question.

Terra investigated public SCORE coverage and wrote the guide. Astra verified
the ABS exam outlines and reviewed the guide and source evidence. This is a
documentation-only refinement; it changes no gameplay, clinical approval,
concept IDs, sampling weights, or saved encounters.

## September 10: twenty additional surgery-center concepts

The owner requested twenty original surgery-center concepts and delegated their
creation, editorial approval, and implementation. This is an additional batch;
the September 9 batch below is preserved. Keep this Concept review task open
until the owner explicitly finishes. No automatic archival or new task is
authorized; the separate character artwork work remains outside scope.

The admitted batch contains **20 concepts, 80 question variants, and 40 two-step
patient encounters**, with **32 actual test/procedure gates**. Each concept has
four variants. Names, coherent age/sex profiles, appearance, and shuffled answers
are generated and frozen at admission. All 40 chief complaints use natural I/My
patient voice. The eight fissure/pilonidal encounters use examination and planning
without unnecessary tests.

| Family | Two concepts |
| --- | --- |
| Thyroid nodule | Select FNA; recognize the need for histologic capsular/vascular invasion to establish follicular carcinoma |
| Primary hyperparathyroidism | Confirm the calcium/PTH pattern; assess symptomatic patients for surgery |
| Inguinal hernia | Use dynamic ultrasound after an equivocal examination; plan elective assessment for symptomatic reducible hernia |
| Anal fissure | Recognize a typical acute fissure; select initial conservative care |
| Internal hemorrhoids | Evaluate with anoscopy; select office banding after appropriate conservative care and risk review |
| Dysphagia/Barrett esophagus | Select upper endoscopy; recognize specialized intestinal metaplasia |
| Achalasia | Select high-resolution manometry after adequate structural evaluation; recognize the manometric pattern |
| Pigmented lesion/melanoma | Select complete diagnostic biopsy; discuss sentinel-node staging for the returned intermediate-thickness melanoma |
| Postoperative seroma | Characterize uncertain swelling with ultrasound; observe a small uncomplicated collection |
| Chronic pilonidal disease | Recognize chronic sinus disease; select off-midline closure when excision with primary closure is chosen |

Thirty-six cases begin at facility Stage 1. Four EGD cases require Stage 2 and
operational endoscopy capability. New external services are thyroid FNA,
anoscopy, manometry, and excisional skin biopsy. Existing lab and ultrasound
routes are reused. An existing endoscopy timing defect was corrected in balance
only: original 30/45/45 resource phases plus 60 non-resource-bound return/report
ticks, total 180. These are editorial simulation intervals. Frozen older 120-tick
encounters retain their captured timing; no reducer or save migration changed.
The new cases hide route/ETA hints before an answer, with route/status/results
visible afterward. Omitted flags preserve legacy display behavior.

The [exact review receipt](../clinical-workbench/approvals/owner-delegated-surgery-center-batch-2026-09-10.md)
binds the ordered 20 concept IDs and exactly 12 production content hashes.
Read the [execution plan](../execplans/implement-surgery-center-concepts-2026-09-10.md)
and [source/rights brief](../execplans/surgery-center-source-brief-2026-09-10.md)
for exact scope and source limitations. All new clinical records remain
`needs_clinician_review` with null named-clinician review and separate dated
owner-delegated agent review. Release ID/schema and
`synthetic_unapproved_prototype` status are unchanged.

Terra performed inventory/collision review, authored the first six concepts,
and integrated all 20 plus service/display tests. Sol investigated sources,
authored the remaining 14, recovered a transient quote-substitution error against
the exact prior hash, finished patient-voice corrections, and ran validation.
Astra verified permitted sources, reviewed actual changes, independently proved
recovery and preservation, and reran 14 focused clinical and 8 domain tests.
Full validation passed: clinical 302, domain 168, balance 10, player 412 (892 total),
all seven workspace typechecks, boundaries, and production build. A concurrent
domain test timeout passed the full isolated rerun. Only the existing Vite
large-chunk advisory remains. Final combined browser acceptance passed 2/2 in
3.0 minutes under Sol. Astra inspected the actual spec, full evidence log, and
all five final screenshots. The external skin-biopsy patient retained the full
pending record, profile, portrait, and answer order after an elapsed-time reload;
the onsite EGD patient used real nurses/rooms/endoscopist, procedure/recovery/
return phases, and returned to the original examination room. Each pathway
delivered one result and recorded two separate FSRS reviews. Only the exact
known favicon404 is excluded from browser console checks.

Test fixture/synchronization corrections stayed in the new E2E spec. No
production movement or persistence change was needed. Seven family files then
received LF/EOF-only cleanup with unchanged core text and refreshed receipt
hashes; focused clinical checks passed 14 again, and Astra independently passed
the 3-test receipt/admission suite. Final scoped tracked and 22-new-file whitespace
checks passed. Required work for this additional twenty-concept batch is complete.

Protected prior content/receipts/queue/patient-text files: 74 checked, 0 changed.
The workbook queue remains 121 records/81 pending; this batch used original
concepts and made no queue changes. Baselines and validation logs are ignored
under `.local-dev/surgery-center-batch-before-2026-09-10/` and
`.local-dev/surgery-center-repair-2026-09-10/`.

This batch remains local and unpushed on `beta` at
`40638f677b674bc59f74f6742d55c8dda027bae1`. Remind the owner to say
**"push to GitHub"** for a scoped backup. No commit, push, merge, deployment,
publication, or dependency installation was authorized. Owner opening remains
**START_GAME.cmd → http://127.0.0.1:4173** in the usual persistent browser
profile. Browser tests use isolated contexts at that origin and do not touch
the owner's campaign. No qualifying implementation was retained by Astra
instead of delegated; Astra owned planning, review, acceptance, and handoffs.

## Scope and ownership

The owner reviews clinical learning concepts in this standalone task and
determines when the session or batch is complete. The separate GS Manager
receives the owner's completion report. This task now owns selected clinical
workthroughs, exact approval receipts, precise queue updates, this scoped
handoff, and the authorized twenty-concept local game batch. Unrelated save
reliability, graphics, dependencies, shared PM records, and deployment remain
outside scope.

Resume by reading the applicable AGENTS.md, this handoff, the selected
workthrough and its receipt, and fresh scoped and whole-tree Git status.
Preserve all unrelated work and check active workers before assigning edits.
The initial branch was `beta` at `40638f6`; the shared tree already contained
substantial application, save, graphics, test, and handoff changes. None belongs
to this review task's prospective backup.

## Reconciled starting point

Terra compared the queue, intake records, and dated receipts. Astra inspected
the relevant receipt text and independently parsed the queue.

- Rows 111, 115, and 119 have approvals dated 2026-08-21. Historical next-row
  labels do not reopen them or approve new versions.
- The queue currently has 121 records, including 81 with
  `pending_concept_workthrough`; `runtimeAdmission` remains `blocked`.
- Row 61's 2026-08-31 receipt preserves six approved Graves/RAI concept and
  seed-version scopes. It does not contain complete authored seed questions.
  At reconciliation, its eighteen expansion variants and later seed-wording
  revisions required exact named-clinician review. Current exact approvals
  are recorded separately below.
- The current clinical handoff identifies row 61's expansion review as the
  next bounded work. The queue's null next-new-workbook-row recommendation
  remains unchanged; this task has not reranked the unreviewed workbook pool.

Receipt: [row 61 Graves/RAI](../clinical-workbench/approvals/owner-row-061-graves-rai.md).

## Approved first review set

Stable concept: `concept.graves.clinical-pattern-recognition`.

Preserved first workthrough shown to the owner:
[Graves pattern recognition v1](../clinical-workbench/workthroughs/owner-row-061-graves-pattern-recognition-v1.md).
Exact review version: `review.owner-row-061.graves-pattern-recognition.2026-09-09.1`.
Canonical text SHA-256 (UTF-8 without BOM, LF newlines):
`c73709ac2de2507f4cd3b78843238e471c1cac1e7696f8a4a83ff06c75a59151`.
The four newly authored exact questions, their presentation text, explanations,
and evidence records must remain `needs_clinician_review`. Preserve the older
receipt; do not label a reconstruction as its exact approved seed wording.
After presentation to the owner, preserve this v1 artifact and use a new exact
review version for requested wording changes. The stable concept identity does
not change merely because a question is revised.

On 2026-09-09 the owner said the content was good and requested that all
questions make sense in a patient presentation rather than generic "an adult
has/presents/reports" quiz wording. This is positive content feedback with an
explicit revision request, not approval of the revised exact wording.
The subsequently approved exact review artifact is
[Graves pattern recognition v2](../clinical-workbench/workthroughs/owner-row-061-graves-pattern-recognition-v2.md),
version `review.owner-row-061.graves-pattern-recognition.2026-09-09.2`.
Canonical text SHA-256 (UTF-8 without BOM, LF newlines):
`849f556a1849c3f93cfcb150d66b3f0f351c70b168d4e820567ded8103ffac5b`.
It has four separate fictional adult encounters, each with a patient
presentation, a question concerning that same patient, four choices, a key,
and an explanation. The stable concept and four variant identities, clinical
claims, sources, and release scope are preserved. Preserve v2 without editing
its original draft-status headers. The later approval receipt, rather than a
mutation of the frozen snapshot, records the current approval disposition.

Melissa Rowland, MD explicitly approved this version on 2026-09-09 and asked
to continue reviewing while holding game implementation until ten sets have
been approved. The [exact receipt](../clinical-workbench/approvals/owner-row-061-graves-pattern-recognition-2026-09-09.md)
binds all four patient presentations, questions, full choices, keys, and
explanations to v2 and its digest. Approval ID:
`approval.melissa-rowland-md.owner-row-061.graves-pattern-recognition.2026-09-09`.
Standalone source and atomic-claim metadata remain `needs_clinician_review`.
The historical receipt and v1 remain unchanged.

## September 9 twenty-concept implementation batch

The latest owner instruction supersedes the earlier ten-set implementation
hold: create and agent-review fourteen new concepts, then implement those plus
the six approved sets together. The count clarification was "Add 14; implement
all 20". New questions need truthful owner-delegated agent-review provenance,
not a claim that Melissa personally reviewed unseen wording. Clinical metadata
remains needs_clinician_review and the game remains an unapproved development
prototype. See the active [execution plan](../execplans/implement-autonomous-multistep-clinical-batch-2026-09-09.md)
for ownership, architecture, current milestones, sources, and validation.

| Batch set | Concept | Exact version | Status |
| --- | --- | --- | --- |
| 1 | Graves clinical-pattern recognition | `review.owner-row-061.graves-pattern-recognition.2026-09-09.2` | Approved by Melissa Rowland, MD; four variants |
| 2 | TRAb diagnostic support | `review.owner-row-061.graves-trab-diagnostic-support.2026-09-09.1` | Approved by Melissa Rowland, MD; four variants |
| 3 | RAI appropriate candidate | `review.owner-row-061.graves-rai-appropriate-candidate.2026-09-09.1` | Approved by Melissa Rowland, MD; four variants |
| 4 | RAI pregnancy contraindication | `review.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09.1` | Approved by Melissa Rowland, MD; four variants |
| 5 | RAI lactation contraindication | `review.owner-row-061.graves-rai-lactation-contraindication.2026-09-09.1` | Approved by Melissa Rowland, MD; four variants |
| 6 | RAI avoidance in active moderate-to-severe thyroid eye disease | `review.owner-row-061.graves-rai-active-ted-avoidance.2026-09-09.1` | Approved by Melissa Rowland, MD; four variants |
| 7 | Initial ultrasound for suspected gallstones | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 8 | Elective assessment for symptomatic gallstones | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 9 | Observation of incidental asymptomatic gallstones | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 10 | Noncontrast CT for uncertain stone disease | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 11 | Recurrent-stone metabolic evaluation | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 12 | Initial celiac serology | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 13 | Usual adult celiac biopsy confirmation | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 14 | Gluten-free treatment after celiac confirmation | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 15 | Colonoscopy after a positive FIT | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 16 | Histologic confirmation of a colorectal lesion | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 17 | Iron studies in established anemia | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 18 | GI evaluation of unexplained confirmed IDA | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 19 | MRI characterization of a concerning extremity mass | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |
| 20 | Specialist-planned biopsy of a suspicious soft-tissue mass | `development-batch.2026-09-09.1` | Agent-reviewed under owner delegation; four variants |

Exact clinician-approved progress: **6 concepts / 24 variants**. The fourteen
new concepts and 56 variants have passed Astra's delegated editorial/content
review and independent focused tests/typecheck. Clinical metadata remains
`needs_clinician_review` for those new records. All twenty are implemented
together. Original stable identities and receipts are preserved. The exact
[batch receipt](../clinical-workbench/approvals/owner-delegated-twenty-concept-batch-2026-09-09.md)
binds the accepted content files and truthful delegated-review authority.

Sol's corrected typed conversion and the complete integration are accepted:
20 concepts, 80 variants, 52 blueprints, 24 multi-step cases, and 28 real test
gates. Twenty-eight cases have one decision, twenty have two, and four have
three. Stage eligibility is 28 cases at Level 0, 20 at Level 1, and 4 at Level 2.
The six new families cover gallstones, nephrolithiasis, celiac disease,
colorectal evaluation, iron-deficiency anemia, and concerning extremity masses.
The new external services are colonoscopy, upper endoscopy with duodenal biopsy,
and extremity MRI. Name materialization happens only at new admission after
profile selection; saved encounters remain frozen. Release ID/schema and the
global unapproved prototype boundary are unchanged.

Astra independently passed the full final clinical-content suite (43 files /
288 tests), the domain suite (28 files / 164 tests), all workspace typechecks,
the build, and scoped whitespace checks. The first repository-wide run found
clinical integration failures that Sol corrected and Astra reviewed. Its
unrelated graphics timeout and research worker exit passed isolated retries
(17 and 83 tests). Other workspaces passed 43 workbench, 8 balance, and 81
authoring tests. Original fourteen frozen artifacts, all six exact-review
entries, other queue records, and top-level queue fields are preserved; counts
remain 121 records / 81 pending. Row 61 separately records current local admission.

Approved second review artifact:
[TRAb diagnostic support v1](../clinical-workbench/workthroughs/owner-row-061-graves-trab-diagnostic-support-v1.md).
Canonical text SHA-256 (UTF-8 without BOM, LF newlines):
`5003e0445fbf753d560b40ab16d2bbc8c6b754ea0bdf668a9c600950bc89e609`.
Melissa Rowland, MD approved the exact TRAb set with "Approved, next question
set" on 2026-09-09. The [TRAb receipt](../clinical-workbench/approvals/owner-row-061-graves-trab-diagnostic-support-2026-09-09.md)
binds all four presentations, questions, full choices, keys, and explanations
to this snapshot and digest. Approval ID:
`approval.melissa-rowland-md.owner-row-061.graves-trab-diagnostic-support.2026-09-09`.
Preserve its original draft-status headers; the receipt records the current
approval. Its five standalone claims and four source records remain
`needs_clinician_review`. Illustrative names are governed by the generated
identity preference below. Clinical wording revisions require a new exact
review version while retaining the stable concept identity.

Approved third review artifact:
[RAI appropriate candidate v1](../clinical-workbench/workthroughs/owner-row-061-graves-rai-appropriate-candidate-v1.md).
Exact version: `review.owner-row-061.graves-rai-appropriate-candidate.2026-09-09.1`.
Canonical text SHA-256 (UTF-8 without BOM, LF newlines):
`2f14cea6b47d72825f8ca48ede601026469e1a149d2e04b87a1c4c069f478702`.
The four complete encounters cover a definitive nonsurgical treatment goal,
the record feature supporting RAI consideration, the follow-up course supporting
that consideration, and shared treatment choice. Melissa Rowland, MD approved
this exact set with "Approve. ready for next set" on 2026-09-09. The
[RAI candidate receipt](../clinical-workbench/approvals/owner-row-061-graves-rai-appropriate-candidate-2026-09-09.md)
binds all four presentations, questions, complete choices, keys, and explanations
to this snapshot and digest. Approval ID:
`approval.melissa-rowland-md.owner-row-061.graves-rai-appropriate-candidate.2026-09-09`.
Its six standalone claims and three source records remain
`needs_clinician_review`. Preserve the frozen snapshot and original draft
headers; the receipt records the current approval disposition. Subsequent
wording changes require a new exact review version.

Approved fourth review artifact:
[RAI pregnancy contraindication v1](../clinical-workbench/workthroughs/owner-row-061-graves-rai-pregnancy-contraindication-v1.md).
Exact version: `review.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09.1`.
Canonical text SHA-256 (UTF-8 without BOM, LF newlines):
`bddc991cd919e941536c67968d1a9814c677833691ddbb479c33ac01d0915945`.
Its four encounters cover the treatment boundary throughout pregnancy, a new
pregnancy finding in the current patient's records, fetal thyroid injury, and
continued care without RAI. Melissa Rowland, MD approved this exact set with
"Approve, next" on 2026-09-09. The
[pregnancy receipt](../clinical-workbench/approvals/owner-row-061-graves-rai-pregnancy-contraindication-2026-09-09.md)
binds all four presentations, questions, complete choices, keys, and explanations
to the frozen snapshot and digest. Approval ID:
`approval.melissa-rowland-md.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09`.
The four standalone claims and four source records remain
`needs_clinician_review`. Preserve the snapshot's original draft headers; its
later receipt records the current approval. Wording changes require a new exact
review version. This is set four in the current ten-set batch.

Approved fifth review artifact:
[RAI lactation contraindication v1](../clinical-workbench/workthroughs/owner-row-061-graves-rai-lactation-contraindication-v1.md).
Exact version: `review.owner-row-061.graves-rai-lactation-contraindication.2026-09-09.1`.
Canonical text SHA-256 (UTF-8 without BOM, LF newlines):
`b41274c14fdf3b1b3b5fc222a532da4ba3b3b5f5218c7dfd574d37e560bc23cf`.
The four encounters cover current breastfeeding as a treatment contraindication,
identifying that contraindication in the same patient's records, milk transfer
and infant thyroid exposure, and counseling about not resuming breastfeeding
the current child after therapeutic iodine-131. On 2026-09-09 the owner asked
a content-only clarification about future breastfeeding. The response confirmed
the current-child cessation recommendation and that future breastfeeding is
possible; no snapshot wording was changed. Melissa Rowland, MD then stated
"Sounds good. Approve, next", approving the exact four-question snapshot above
as the fifth set. The
[lactation receipt](../clinical-workbench/approvals/owner-row-061-graves-rai-lactation-contraindication-2026-09-09.md)
binds all four presentations, questions, complete choices, keys, and explanations
to the frozen snapshot and digest. Approval ID:
`approval.melissa-rowland-md.owner-row-061.graves-rai-lactation-contraindication.2026-09-09`.
The five standalone atomic claims and four source records remain
`needs_clinician_review`. Preserve this snapshot and its original draft headers;
use a new exact version for requested wording changes while retaining the stable
concept identity. The clarification did not approve a new future-pregnancy
question or a timing protocol.

Approved sixth review artifact:
[RAI avoidance in active moderate-to-severe TED v1](../clinical-workbench/workthroughs/owner-row-061-graves-rai-active-ted-avoidance-v1.md).
Exact version: `review.owner-row-061.graves-rai-active-ted-avoidance.2026-09-09.1`.
Canonical text SHA-256 (UTF-8 without BOM, LF newlines):
`dbc25a353744766aa912aa5369c3816c023baf1640446317aaab8f8479a01435`.
The four encounters cover the treatment conclusion and reason, the relevant
finding in the current patient's records, the possible effect on existing eye
disease, and persistence of the avoidance boundary when thyroid symptoms improve
but active moderate-to-severe TED remains documented. General avoidance is
qualified by the specialist-exception limitation; this is not an absolute
lifetime prohibition. Melissa Rowland, MD approved the exact set with "These
are also great. Approved." The [sixth exact receipt](../clinical-workbench/approvals/owner-row-061-graves-rai-active-ted-avoidance-2026-09-09.md)
binds all four variants and the snapshot digest. The clinician-approved count
is six concepts and 24 exact variants; the four standalone claims and three
source metadata records still need clinician review. Preserve the frozen
snapshot; revised versions need a new exact review record under the applicable
reviewer authority and cannot inherit clinician sign-off for unseen changes.

## Standing patient-presentation rule

Apply the owner's reminder to every subsequent review. The existing
[Patient Presentation Variant rule](../../CONTENT_MODEL.md#patient-presentation-variant)
already requires a brief story about exactly one fictional patient, a reason
for the visit, and relevant symptoms, findings, concerns, or goals. Show the
patient presentation and then a separate question about that same patient;
do not duplicate the whole presentation in the question. Names or ages alone
do not fix a detached quiz. Reverse-direction questions compare possible
findings, reports, or courses for the current patient, not unrelated patients.
Keep the available and pending information coherent, and avoid revealing the
diagnosis in the presentation when that diagnosis is being tested.
The queue guide's accepted-workflow step 6 now links this existing rule. This
is a presentation requirement, not a queue status or approval change.

The inherited semantic release point is `release.l0.clinic_evaluation`, within
the existing counseling/referral boundary. Proposed capability mapping is
subject to review. Concept scope, exact questions, evidence/source review,
release eligibility, and publication authorization remain separate decisions.
One stable concept continues to mean one FSRS identity.

## Generated patient identity and review examples

On 2026-09-09 the owner said the TRAb examples looked great and clarified that
the game should randomly generate the patient's name, age, and gender, then
choose a character matching the generated patient's appearance. Named review
examples remain useful for showing how the presentation will sound.

Carry this preference into the eventual implementation batch. Review names
are illustrative renderings, not fixed identities or required demographics.
Generate a coherent identity within the presentation's approved clinical
constraints, and keep its name, age, gender/pronouns, written presentation,
and character appearance consistent throughout that patient's encounter.
Age and any answer-essential demographic details must stay within the
approved profile; cosmetic variation must preserve the clinical facts, key,
and stable concept/variant identity. Gender presentation and pronouns do not
substitute for explicit anatomy or pregnancy-related clinical facts. This
follows the existing [Template Slot and clinical profile rules](../../CONTENT_MODEL.md#template-slot).

This clarification is recorded for authoring and implementation. It does not
change the frozen review snapshots or existing approval receipts. The latest
twenty-concept instruction governs admission of the complete batch together.

## Progress and next action

The twenty-concept implementation milestone is complete. Sol `batch_architecture`
completed browser acceptance at http://127.0.0.1:4173 with the existing direct
Playwright configuration: 2/2 passed in 4.8 minutes. Celiac completed laboratory
and endoscopy/biopsy waits, a paused pending reload, stable generated identity,
profile/appearance and shuffled order, hidden future questions/results, three
FSRS reviews, and resolution. The soft-tissue-mass case completed its actual MRI
wait, returned result, biopsy-plan decision, and resolution. Only the verified
canonical favicon.ico 404 is filtered; other console/page errors remain fatal.
Astra inspected the actual test and all five final screenshots.

Browser review also found and fixed the existing false "Service route unavailable"
label on answered or pending testing choices. Sol changed only two fallback
expressions in viewModels.ts against the saved dirty baseline and added a focused
dual-output regression plus browser assertions. Astra independently passed the
focused player checks (2 files / 3 tests) and full build after this correction,
including all workspace typechecks and runtime/launcher boundaries. The existing
large-chunk advisory is informational. No clinical content, route timing, save
behavior, or receipt digest changed in this correction.

The owner opens the game through START_GAME.cmd at that same origin in their
usual persistent profile; automated tests used isolated contexts with separate
storage and did not replace the owner's save. No required implementation work
remains. Further concepts, session closure, and a scoped backup are owner-directed.

Terra `autonomous_batch_content` recorded the accepted sixth receipt and did a
read-only browser-fixture investigation. Its initial typed conversion and later
read-only clinical outline were rejected. Sol corrected the conversion,
authored all fourteen new concepts, integrated the full batch, resolved
repository-wide clinical checks, completed browser acceptance, and corrected
the misleading service label. Astra verified sources, reviewed every family
and correction, inspected actual diffs, and performed independent validation.
No substantial implementation milestone was retained outside delegation.

The following entries preserve the earlier review history; older five-set and
ten-set milestone statements are superseded by the current authorization above.

- Completed: read-only reconciliation; dated approvals and queue counts checked.
- Completed: Terra authored and revised four questions. Astra inspected all
  stems, choices, keys, explanations, metadata, and source/claim mappings,
  checked the permitted authoritative sources, and accepted the artifact as
  ready for owner review. This is editorial acceptance, not clinical approval.
- Completed: Terra rewrote the four presentations and linked questions as v2
  and added the narrow queue-workflow reminder. Astra inspected the actual
  v1/v2 and queue diffs against the existing content-model requirements and
  accepted v2 as ready for owner review.
- Completed: Terra recorded the explicit v2 approval in a new immutable
  receipt and updated only row 61 in the structured queue. Astra inspected the
  actual diff, receipt, and preserved hashes, then independently confirmed
  that no other queue record or top-level value changed.
- Completed concepts in the new batch: five, recognition v2, TRAb v1,
  RAI appropriate candidate v1, RAI pregnancy contraindication v1, and
  RAI lactation contraindication v1.
- Completed: Terra authored and revised four patient-based TRAb questions.
  Astra reviewed the full content and returned vague presentations, an answer
  length cue, and ambiguous imaging/prognosis distractors for correction.
  The corrected set covers test selection, positive-result interpretation,
  negative-result limits, and function-versus-cause result recognition.
- Completed: Astra made a small integration correction to symptom-context
  coverage and missing claim/source links, then validated the final packet.
  This is editorial acceptance for review, not clinical approval.
- Completed: Terra recorded the exact TRAb approval and updated row 61 and
  the queue guide. Astra inspected the receipt and actual diff and confirmed
  the queue counts, unchanged non-row-61 data, preserved recognition entry,
  frozen snapshot hashes, and continued runtime hold.
- Completed: Terra drafted four RAI appropriate-candidate questions. Astra
  found symptoms used as a substitute for confirmed relapse, incomplete
  clinical-context claim mappings, and a game-specific care-setting rule
  attributed to clinical guidance. Sol revised the sole-owned draft before
  owner presentation. Astra verified targeted management facts and rights in the
  official 2023 EANM full-text guideline, with ATA/NIDDK cross-checks for
  treatment choices and relevant clinical context.
- Completed: Astra inspected Sol's actual revised content and returned narrow
  corrections for answer positions, the definitive treatment distinction, and
  the third question's clinical-course focus. Sol completed those corrections;
  Astra reviewed the final four encounters and independently checked structure,
  keys, bidirectional source/claim references, encoding, whitespace, and digest.
  The set is ready for owner review, without clinical approval.
- Completed: Terra recorded the explicit RAI candidate approval and updated
  row 61 and its queue-guide prose. Astra reviewed the actual receipt and diff,
  independently confirmed the three exact-set bindings and counts, and checked
  that all seven previously frozen snapshots/receipts, prior two exact-set
  entries, non-row-61 records, and top-level queue values remained unchanged.
  Astra made one tiny punctuation correction in the guide's receipt list.
- Completed: Terra authored four RAI pregnancy-contraindication questions in
  one new workthrough. Astra directly verified the bounded facts in EANM,
  NIDDK, and ATA public guidance and supplied the source boundaries.
- Completed: Astra inspected the actual pregnancy draft and returned narrow
  corrections for missing background claim mapping, an overlapping antibody
  distractor, answer-length balance, and current-patient choices. Terra
  completed them; Astra reviewed the final text and independently checked all
  four blocks, keys, claim/source mappings, encoding, whitespace, and digest.
- Completed: Terra `lactation_review` recorded the explicit pregnancy approval
  in a new receipt and updated row 61 and scoped queue-guide prose. Astra
  inspected the actual receipt, guide diff, and full row-61 record, then
  independently verified all nine preexisting frozen files, prior three exact
  entries, non-row-61 records, top-level values, four receipt/snapshot bindings,
  queue counts, and whitespace. No prior reviewed text changed.
- Completed: Terra `lactation_review` authored four lactation questions
  in one new workthrough from sources directly checked by Astra. Astra reviewed
  the actual draft and returned corrections for an answer-revealing stem,
  incoherent physiology distractors, current-child breastfeeding wording, and
  a combined claim whose sources supported different parts. Terra completed
  those corrections. Astra reviewed the final file and independently verified
  structure, exact key text, five claims, four sources, bidirectional mappings,
  encoding, whitespace, and digest. The set is specific to therapeutic
  iodine-131 for Graves disease and is ready for exact owner review.
- Completed: Terra `lactation_review` recorded the explicit lactation approval
  and scoped row-61 queue/guide changes. Astra inspected the actual receipt,
  guide diff, and row-61 record, then independently verified all eleven
  preexisting frozen files, prior four exact-set entries, non-row-61 records,
  top-level queue values, five receipt/snapshot bindings, counts, and whitespace.
- Completed: Terra `lactation_review` authored the sole new active
  moderate-to-severe thyroid-eye-disease workthrough from sources directly
  checked by Astra. Astra inspected the actual draft and returned corrections
  for administrative distractors, a risk question whose other choices were
  benefits, the missing severity qualifier in a key, and atomic claim mappings.
  A worker time limit interrupted the correction; Terra resumed the preserved
  partial file and finished the same bounded milestone. Astra inspected the
  final text and independently validated all four blocks, exact keys, claim and
  source mappings, encoding, whitespace, and digest. No required work remains
  incomplete from the interruption.
- Historical next action at the five-set checkpoint (superseded): obtain the owner's review of the exact TED set.
  Continue to distinguish question approval
  from independent evidence metadata and capability acceptance. Keep the
  batch count at five until another set receives explicit approval; continue
  holding game implementation until ten.

No private workbook was needed for the reconciliation. Source metadata and
atomic claims belong in the selected workthrough. NIH and ATA public pages
were accessible for targeted recognition facts on 2026-09-09. The historical
2018 ETA anchor was not fully reverified: PMC returned a CAPTCHA, the DOI
route returned 403, and the official publisher exposed only its abstract and
references with the full text behind an access gate. Do not substitute an
abstract or search snippets for full guideline review. NICE NG145 is excluded
as clinical evidence because the current NICE terms require permission for AI
use and the UK Open Content Licence excludes it. Use the permitted ATA and
NIH sources for the bounded diagnostic facts; do not retrieve NICE content
through mirrors or retain its search snippets as evidence.
Evidence adequacy and new source/claim wording still need clinician acceptance.
For TRAb, the negative-result boundary has only one directly verified source
in this packet (ATA). NIDDK independently cross-checks Graves symptoms and
TSI mechanism/diagnostic context; it is not direct evidence for every TRAb assay.

For the new RAI set, the official 2023 EANM guideline was directly accessible
and its article-level CC BY 4.0 license was verified. It directly supports
recurrent Graves hyperthyroidism after antithyroid-drug withdrawal as an RAI
indication; ATA and NIDDK support individualized treatment choices and relevant
context. The 2025 KTA guideline could not be fully reverified: publisher HTML
and PDF retrieval failed, and PMC presented a browser challenge. Do not treat
its search snippets as verified evidence. No source article or source excerpts
are stored in the repository. The game's no-onsite-RAI policy belongs in
release/capability metadata, not in a source-backed medical claim.

For the pregnancy set, EANM 2023, NIDDK's "Thyroid Disease & Pregnancy"
(last reviewed December 2017), and ATA's undated "Hyperthyroidism in Pregnancy"
page directly support the pregnancy treatment boundary. NIDDK provides an
independent government cross-check; its age is recorded rather than represented
as a current guideline. ATA directly supports placental transfer, fetal thyroid
uptake, and possible fetal thyroid injury. Continued individualized thyroid
care is distinct from RAI administration. No exact gestational week, preparation
timing, conception interval, medication regimen, or surgery algorithm is taught.

The 2026 ATA pregnancy guideline is listed in the official ATA catalog
(DOI 10.1177/10507256261445624). Its Sage full-text page was accessible during
the access/rights check, but its free-access label is not a Creative Commons
license. [Sage's TDM/AI policy](https://www.sagepub.com/tdm-ai-policy) requires
a license for AI use. It is excluded from this draft's clinical evidence;
do not retrieve additional clinical passages, snippets, or mirrors or imply
that its management recommendations were verified. No Sage article content is
stored in the repository. The permitted sources above support the bounded
pregnancy fact without requiring additional owner permission.

For the lactation set, Astra directly verified EANM 2023, ATA's undated
"Radioactive Iodine" page, and the current LactMed "Sodium Iodide I 131"
entry at <https://www.ncbi.nlm.nih.gov/books/NBK501563/>. The chapter states
Last Revision August 15, 2026; older indexed PDFs and the PubMed display do not
override this directly checked chapter date. Its government reference summary
supports the current lactation contraindication, milk transfer and infant
thyroid uptake, and the recommendation not to resume breastfeeding this child
after therapeutic iodine-131. EANM and ATA independently support the treatment
boundary and the need to stop breastfeeding before treatment.

This set teaches no exact cessation interval, dose, contact restriction, milk
testing threshold, or diagnostic-radionuclide rule. LactMed also discusses an
individual case with modeled resumption times; that report is not adopted as
a routine resumption protocol or substituted for the record's recommendation.
The same-child feeding recommendation is not lifelong inability to breastfeed.
LactMed's government-publication rights were checked using the page-specific
notice and Bookshelf copyright policy; agency attribution is required. No
source prose or full articles are stored. Its citation of the 2026 ATA guideline
does not make that Sage article directly verified or reusable in this task.

For the thyroid-eye-disease set, Astra directly checked EANM 2023, ATA's undated
"Thyroid Eye Disease" page, and NIDDK's "Graves' Disease" page (last reviewed
November 2021) on 2026-09-09. The proposed teaching point is generally to avoid
therapeutic iodine-131 in active moderate-to-severe thyroid eye disease because
it can worsen eye disease. EANM discusses a relative contraindication and
specialist exceptions when other treatments are not feasible; ATA likewise
describes usual avoidance with exceptions. This packet must not turn that into
an absolute prohibition for all eye symptoms or a permanent prohibition based
on any historical eye disease. No steroid regimen or exception protocol is
taught. NIDDK independently supports worsening risk and the distinction between
thyroid function and the eye-disease course; it is not a severity-specific
management guideline. Specialist classification is given in the cases, without
teaching activity-score thresholds or emergency ophthalmic management.

The EANM article-level CC BY 4.0 license was rechecked. ATA terms permit the
targeted educational fact check; its copyrighted expression is not reproduced.
NIDDK's government-content copyright policy was rechecked, with agency credit
and no copied source expression or graphics. Clinical authority and rights
remain separately recorded. The historical 2022 ATA/ETA consensus is not
represented as directly verified in this new packet solely because it appears
in the older seed receipt.

## Worker accountability and validation

Terra `reconcile_clinical_review_queue` ran the bounded reconciliation and
authored/revised the recognition workthrough, recorded the exact approval,
and authored/revised the TRAb workthrough, recorded its exact approval, and
drafted the RAI workthrough, recorded its exact approval, and authored/revised
the pregnancy workthrough. Sol `review_graves_rai_candidate` revised the
RAI draft following the lead's clinical/editorial escalation. Astra inspected
the actual content after each handback and returned substantive corrections to
the assigned worker. Workers did not spawn agents or modify runtime/PM files.
Astra owns integration, this handoff, and final acceptance.

Terra `lactation_review` recorded the exact pregnancy approval and authored and
revised the lactation workthrough. It was the sole write worker for this
milestone; its ownership excluded previously approved snapshots and the
parent-owned handoff. Astra reviewed the actual receipt, scoped queue changes,
and final draft, and independently validated the preserved approval bindings
and new artifact. No qualifying implementation work was left undelegated.

For the next milestone, the same Terra worker recorded the exact lactation
approval and authored and revised the active moderate-to-severe TED workthrough.
Astra reviewed and independently validated the receipt milestone before
delegating the next one-file draft, then inspected the final content and
validation after the resumed revision. Astra retains clinical scope decisions,
source checks, editorial acceptance, and this handoff. No additional worker ran
for this milestone, and no qualifying implementation work was left undelegated.

Recognition scoped validation: the untracked-file whitespace check passed; all four
question blocks have four choices, one key, and an explicit draft status;
five defined claim IDs and three source IDs have no undefined references;
there are no conflict markers. V2 additionally has exactly one current-patient
presentation and one linked question per variant. Astra independently verified
that v1's hash, source records, and atomic claims were preserved and reviewed
the queue-workflow and row-61 hunks. No application test was necessary for
these review artifacts. The queue parses with 121 records and 81 pending
workthroughs; only row 61 differs from HEAD, all top-level values are unchanged,
and runtime admission remains blocked. Row 61 records five exact sets, twenty
approved exact variants, and four remaining minimum authored variants in
one complete TED set. Historical seed approvals are retained separately.

The final TRAb packet passed an independent structure check: four variants,
each with one presentation, one question, four choices, one key, one
explanation, and an explicit draft status. Five claim IDs and four source IDs
resolve, source-to-claim mappings agree with claim-to-source mappings, and
encoding/whitespace/conflict checks pass. Its final hash is recorded above.
The guide's batch-progress link points to this scoped handoff. No application
tests were required because the milestone changes review artifacts only.

The final RAI packet also passed Astra's independent checks: four variants,
each with one current patient presentation, one question, four choices, one
key, one explanation, and an explicit draft status. Keys are 2, 3, 2, and 4 in
review order; future runtime choices must be shuffled. All six claim IDs and
three source IDs resolve with matching bidirectional mappings. Encoding,
whitespace, conflict-marker, and SHA-256 checks pass. The finalized text restores
the third question to the patient's follow-up course and removes the unused
laboratory-pattern claim/source. The EANM guideline remains the only directly
verified source for recurrence after antithyroid-drug withdrawal as the RAI
indication. No application files or tests were needed for this review milestone.

The final pregnancy packet passed Astra's independent checks: four variants,
each with exactly one current-patient presentation, question, four choices,
key, explanation, and draft status. Review keys are 3, 1, 2, and 3; every key's
text matches its selected choice. All four claim IDs and four source IDs are
defined and used with matching bidirectional mappings. UTF-8 LF without BOM,
conflict-marker, whitespace, and SHA-256 checks pass. This is editorial
acceptance for exact owner review, not clinical approval. No application tests
were required for this Markdown-only drafting milestone.

The final lactation packet passed Astra's independent checks: four variants,
each with exactly one current-patient presentation, question, four choices,
key, explanation, and draft status. Review keys are 4, 1, 2, and 2; every key's
text matches its selected choice. All five claim IDs and four source IDs are
defined and used with matching bidirectional mappings. Pre-treatment cessation
and the recommendation not to resume breastfeeding the current child are
separate claims; EANM is not mapped to the latter. UTF-8 LF without BOM,
conflict-marker, whitespace, and SHA-256 checks pass. This is editorial
acceptance for exact owner review, not clinical approval. No application tests
were required because this milestone changes review artifacts only.

The final TED packet passed Astra's independent checks: four variants, each
with exactly one current-patient presentation, question, four choices, key,
explanation, and draft status. Review keys are 2, 3, 4, and 3; every key's text
matches its selected choice. Four claim IDs and three source IDs are defined
and used with matching bidirectional mappings. The unused referral claim was
removed, and Graves background findings are mapped to the applicable variants.
The thyroid-symptom/eye-activity distinction is explicitly recorded as an
application of the source facts to a separately documented specialist finding.
UTF-8 LF without BOM, conflict-marker, whitespace, and SHA-256 checks pass.
No application tests were required for these review artifacts. This is
editorial acceptance for exact owner review, not clinical approval.

Prospective backup scope now includes the preserved seven Graves workthroughs,
six dated exact receipts, the new twenty-concept receipt, the dated development
batch module/tests, admission-time patientText helper/tests, the three external
services and scoped balance tests, exact runtime allowlist/source-assembly and
historical narrative-test changes, the two scoped view-model expressions and
new clinicalServiceLabels.test.ts, new browser tests and batch screenshots,
the two batch execution/source plans, row 61 and the scoped queue-guide hunks,
this handoff, and the narrow batch entry in CURRENT_THREAD_HANDOFF.md. Inspect
shared-file hunks against the ignored `.local-dev/autonomous-batch-before-2026-09-09/`
baseline before staging. No unrelated shared-tree work belongs in that backup.

## September 12 additional twenty-group batch

Completed another20 independently scored concepts,80 variants and40 two-node
patients with40 real result gates. The active unapproved prototype contains123
concepts,298 cases and463 nodes. New families cover FAP, recurrent complex anal
fistula, recovered complicated diverticulitis, anal SCC, postoperative DVT,
persistent ITP, gastric GIST, hepatic adenoma, chronic mesenteric ischemia and
primary aldosteronism. All clinical records remain needs_clinician_review.

The [September12 receipt](../clinical-workbench/approvals/owner-delegated-board-expansion-2026-09-12.md)
binds the20 ordered IDs and12 exact LF-normalized source hashes. Source review
used the live concept sheet and permitted guidelines. CMI is mapped explicitly
as an inferred detail under an Uncommon mesenteric procedure; no claim of exam
frequency is made. Current ASH2026 ITP guidance and Endocrine Society2025 PA
guidance governed narrow teaching boundaries. All test-bearing alternatives,
including marrow testing and surveillance, have neutral game-time estimates.

Terra and Sol ran the delegated authoring/integration/fixture milestones;
Astra reviewed actual files/diffs and ran full acceptance. All1,029 affected
tests and the build/typechecks/boundaries pass. Two isolated Chrome scenarios
passed together at the canonical origin; Astra inspected six screenshots.
Earlier editorial test failures were repaired without expanding legacy
exceptions; the full domain suite passed serially after a parallel timeout in
an older monolithic test. No day-six arrival-supply claim is made.

Prospective backup scope adds the dated September12 source/test folder, domain
flow test, browser spec, six dated screenshots, receipt, three source briefs,
execution plan and these handoff entries, plus scoped changes in the nine
shared integration files copied under
`.local-dev/board-expansion-2026-09-12/pre-integration/`. Review those diffs
before staging. The temporary test server was stopped; owner saves and the
START_GAME.cmd canonical opening pathway are preserved. Local and unpushed;
remind the owner to say **"push to GitHub"**. Keep this continuing task open.

## Closeout boundary

September 13 patient-library repair is complete following the ten-patient audit.
Sol authored the full-library wording layer; Terra implemented demographics and
exact saved-chart display compatibility. Root reviewed source/diffs and all
changed base narratives, returned corrections and independently verified the
pre-task clinical invariants. All 298 cases have 1–5-word complaints, all 962
base/profile presentations are named, and the missing HSIL virus question is
restored. Names, age/sex and character selection are coherent; unknown/custom
saved wording is preserved. IDs, clinical findings, keys, gates and progress
remain intact. New wording retains pending clinician-review metadata.

Validation: 1,034 package tests (339 content / 264 domain / 431 player), full
build/typechecks/boundaries, and seven final focused repair tests pass. No owner
save access, launcher change, commit, push or deployment. See
[repair report](../clinical-workbench/audits/2026-09-13-library-repair-coverage.md),
[execution plan](../execplans/repair-patient-presentations-2026-09-13.md), and
[future diagnostic timing task](../features/diagnostic-timing-future-design.md).
The original ten-patient audit remains historical. Keep this task open. The
checkpoint is local/unpushed; owner can say "push to GitHub" for a scoped backup.

Lifecycle update, 2026-09-10: the owner explicitly wants this Concept review
task to remain open for continued concept additions and reviews. Do not archive
it when an individual concept or batch is accepted or backed up. Keep it open
until the owner explicitly says they are finished with this task. This overrides
the default archival lifecycle while preserving exact-version clinical approval
and scoped-backup rules. The update alone does not start another concept or
substantial work. The owner is opening a separate task for additional patients
and employees.

The owner has not agreed this review session is complete. No commit, push,
publication, merge, deployment, or archival has occurred in this task. The
implemented batch remains local and unpushed. Remind the owner to say
"push to GitHub" for a scoped audited backup, then verify and record the remote
commit if authorized. Session closeout and the next distinct task remain
owner-directed. Never stage private inputs or unrelated shared-tree changes.

## September 13 early-level batch completed

Twenty additional concept groups are editorially accepted and implemented for
runtime stages 0–2: 80 questions, 52 encounters, 28 diagnostic result gates and
24 single-step visits. Ten curriculum families cover biliary/foregut, colorectal,
skin, venous disease and splenectomy prevention. All 123 historical concepts and
298 cases remain unchanged; active totals are 143 concepts, 350 cases, 543 nodes.
Sol authored foregut and integrated the batch; Terra authored clinic content and
investigated levels. Root reviewed the actual diffs, final content and validation.
Clinical 354, player 432, balance 13 and domain 319 distinct tests pass after a
stale domain admission allowlist correction (318 passed initially; the corrected
file passed 4/4). Build, boundaries and seven workspace typechecks pass.

See [final receipt](../clinical-workbench/approvals/owner-delegated-early-levels-2026-09-13.md)
for exact IDs, hashes, board mapping and review limits, and
[execution plan](../execplans/early-levels-twenty-concepts-2026-09-13.md).
All new clinical records still need named clinician review. No campaign reset,
commit, push, deployment, or archival. Keep GS-006 open. This checkpoint remains
local; say "push to GitHub" for its scoped backup.
