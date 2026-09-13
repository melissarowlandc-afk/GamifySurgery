# Implement the owner-delegated clinical batch with testing and multiple steps

## Goal

Record the owner's exact approval of the sixth Graves/RAI set, independently
author and review fourteen additional varied clinical concepts, and integrate the
complete batch into the owner/development game together. Patients should often
need testing and subsequent decisions within the same encounter.

## Latest owner authorization

On 2026-09-09 the owner approved the active moderate-to-severe TED set and said:
"You can begin approving and implementing any questions or concepts you would
like to on your own now. Only come to me with questions you have that you want
my review on. Please create and approve 15 concepts on your own then implement
all 20 at the same time into the game. Make sure there is variety, look for
patients that can have good multi step questions where they have to get testing
done first before the concept is tested since I want patients often getting
tests done and having multi steps."

This supersedes the earlier ten-set implementation hold and per-question owner
review workflow for new content. It authorizes delegated agent review and local
game implementation. It does not make the agent a clinician or establish that
the owner personally reviewed unseen exact wording. Record approval provenance
truthfully and preserve the distinction from the six explicitly clinician-reviewed
Graves sets. No production publication, deployment, merge, or push is requested.

## Confirmed count

The current sequence now has six explicitly approved concepts, not five.
The owner answered the asynchronous clarification: "Add 14; implement all 20".
The final batch is therefore fourteen new concepts plus all six existing
Graves/RAI concepts, twenty total and at least eighty exact question variants.

## Requirements

- Preserve the six stable Graves concept identities and their four exact
  approved variants each, all frozen snapshots, and dated receipts.
- Add fourteen new concepts, for twenty total including the six existing ones.
  Each concept needs at least four original patient-linked question variants.
- Provide clinical variety across several systems and encounter goals; avoid
  duplicating existing concepts under new IDs.
- Use coherent generated names, age, gender/pronouns, and matching patient
  appearance within the approved clinical constraints. Never use appearance or
  demographic generation as a substitute for answer-essential clinical facts.
- Questions must relate to a concrete current patient presentation. One scored
  node tests one primary stable concept and maintains per-concept FSRS history.
- Build meaningful encounter sequences: initial assessment or testing decision,
  test acquisition/result completion, then interpretation or subsequent action.
  Later questions must not reveal results before the required tests complete.
- Make multi-step encounters and test use common within this addition without
  changing unrelated game balance or inventing medical probabilities.
- Respect real capability and progression rules, including external testing
  fallbacks and counseling/referral for unavailable definitive treatment.
- Keep educational tier, clinical acuity, setting, facility release, and required
  capability separate. Do not admit deferred ED/inpatient/OR concepts into a
  clinic without a clinically coherent counseling/referral iteration.
- Use targeted primary clinical sources and original atomic evidence claims
  with complete metadata, licensing/reuse checks, dated review, and mappings.
  Preserve source uncertainty and do not misrepresent AI review as clinician review.
- Shuffle answer choices. Keep comparable grammar, length, specificity, and
  clinical category, with one defensible key and no obvious answer cues.
- Integrate the complete reviewed batch together, preserving existing frozen
  encounters and saves. Prefer additive data and existing routing mechanisms.

## Repository state and constraints

- Workspace: `C:/Users/Kyle Kent/Projects/GamifySurgery`.
- Branch `beta`, HEAD `40638f677b674bc59f74f6742d55c8dda027bae1`.
- Shared tree already has extensive application/save/art/facility/test/PM work.
  Preserve every unrelated change. The initial thirteen Graves snapshot/receipt
  hashes, five existing exact-set entries, and queue/guide state were captured
  before this new milestone; do not alter old exact artifacts.
- Source instructions remain applicable except where the owner's express
  delegated-review instruction supersedes the old per-version manual workflow.
  No proprietary corpus, source copying, prohibited AI ingestion, fabricated
  citations, or silent promotion to a public clinical release.
- Do not install dependencies, commit, push, publish, deploy, modify shared PM
  state, or send external messages without separate applicable authorization.
- GS-006 remains the active continuous owner task. This plan and its scoped
  handoff are parent-owned planning records.

## Decisions and ownership

Astra owns clinical/product scope, architecture decisions, the plan, delegation,
integration review, source verification, acceptance, and final response. Normally
one write worker at a time. Read-only investigation may run alongside it.

1. Fresh Terra `autonomous_batch_content`: new TED receipt and precise row-61
   queue/guide updates; no code or previously frozen artifact edits. The prior
   `lactation_review` worker read the plan and handed back without completing
   this new receipt milestone; preserve its completed earlier work.
2. Sol: bounded read-only architecture investigation of content admission,
   approval provenance, generated identities, test gating, encounter steps,
   capability routing, FSRS, and focused validation. No writes or subagents.
3. Sol: sequential content-authoring milestones using Astra's accepted roster
   and verified source brief. Terra's first conversion and later read-only
   outline were rejected; Sol corrected the conversion. Parent reviews every
   actual artifact and key before admission.
4. Terra/Sol according to complexity: implement truthful delegated review
   provenance if needed, preserve existing runtime boundaries, add batch data
   and test-dependent encounter sequences, then admit the whole batch together.
5. Astra reviews actual diffs and meaningful tests; return substantial fixes to
   the assigned worker. Browser verification uses the canonical local origin.

Workers share the workspace, preserve unrelated edits, do not spawn agents,
and do not commit/push/publish/install/edit parent planning unless explicitly
assigned. A handback without actual diff and validation inspection is insufficient.

## Acceptance criteria

- Exact final concept count reconciled with the owner or documented assumption.
- All six original approvals recorded and preserved; new agent review records
  identify the real reviewer/authority and exact versions without forging owner
  or clinician sign-off.
- At least four distinct complete variants per concept; no undefined source,
  evidence, concept, presentation, question, case, or prerequisite references.
- Substantial variety and a majority of new encounter families using meaningful
  test-dependent later questions, with counts measured from the final batch.
- Real game routing/elapsed testing gates later steps; merely mentioning a test
  in a static question does not satisfy this requirement.
- One scored concept per node, generated patient consistency, shuffled choices,
  progress/capability gates, FSRS attribution, and existing-save stability checked.
- Complete batch active together in the intended owner/development release;
  no unintended public release or capability expansion.
- Relevant unit/integration tests, typechecks, build, and representative browser
  playthroughs pass, with any preexisting unrelated failures clearly identified.

## Validation plan

Use focused clinical-content, game-domain, and player tests for changed behavior.
Verify test-before-question gating, multiple-step continuation, patient identity
and appearance consistency, result visibility, answer shuffling, FSRS concept
attribution, capability/external fallback, final admission, and save preservation.
Then run the repository's appropriate integrated tests, typechecks, and player
build once; repeat only after relevant changes/failures. No implementation-
mirroring tests for trivial document changes.

For local browser validation use `START_GAME.cmd` and exactly
`http://127.0.0.1:4173` in the intended persistent profile. Do not clear or replace
the owner's existing campaign. Use non-destructive fixtures/test paths where
appropriate. A different origin/profile has separate storage and must be disclosed.

## Progress

- [x] Read applicable instructions, prior implementation plan, whole-tree status,
  current review history, and captured frozen approval baseline.
- [x] Owner resolved the count: add fourteen and implement all twenty.
- [x] Record sixth exact approval and validate preservation.
- [x] Read architecture investigation and settle integration/provenance design.
- [x] Select varied new concept roster and test-dependent encounter families.
- [x] Verify sources, author all variants, review exact content and mappings.
- [x] Implement approved/delegated-review data and multi-step testing routes.
- [x] Admit the complete batch together and validate gameplay/save behavior.
- [x] Reconcile scoped handoff and report final counts and local verification.

## Discoveries

- Owner resolved the initial arithmetic discrepancy to fourteen new concepts
  plus six existing concepts, twenty total.
- Sol's read-only investigation found explicit runtime admission arrays and
  existing scored workup -> real service wait -> result -> next-question gates.
  No unscored intake test or answer-dependent branching exists; use two or three
  different scored concepts per coherent pathway. Four parallel case blueprints
  carry four question variants per concept. Do not change this timing engine.
- Keep global `synthetic_unapproved_prototype` and existing ReviewStatus enum.
  New records retain `needs_clinician_review` and null clinician review, with a
  separate exact owner-delegated agent-review record for development admission.
- Accept admission-time interpolation of only `{patientName}` on the cloned,
  selected-profile case after final automatic/manual name resolution. A pure
  helper must cover all patient-facing strings before freezing. Existing saves
  are not re-interpolated. Age/sex remain coherent finite editorial profile
  alternatives and header facts; use neutral pronouns where unconstrained.
- Existing US, CT, and basic laboratory services can route externally. Add honest
  external colonoscopy, upper endoscopy with duodenal biopsy, and extremity MRI
  services where used; never alias breast-specific services. Final referral
  decisions do not pretend that a biopsy was performed onsite.
- Proposed new roster: gallstone US, symptomatic gallstone surgical referral,
  incidental asymptomatic gallstone observation (3); noncontrast CT for stone
  evaluation and recurrent-stone metabolic evaluation (2); celiac serology,
  duodenal biopsy confirmation, and confirmed-celiac gluten-free treatment (3);
  positive FIT follow-up and colon lesion histologic confirmation (2); iron
  studies for iron deficiency and unexplained IDA GI evaluation (2); extremity
  mass MRI and specialist-planned biopsy (2). Source verification and exact
  authoring review are complete.
- Parent accepted the sixth receipt after inspecting its exact content and
  corrected authority/batch wording. Independent checks preserve all thirteen
  preexisting frozen files, first five exact-set entries, non-row-61 records,
  and queue top-level values. Counts are 121/81, row61 six sets/24 variants.
- Parent ran the pre-integration game-domain package suite successfully:
  `npm test --workspace @gamify-surgery/game-domain`, 26 files / 154 tests.
  This records the dirty shared-tree baseline before this batch's domain edits.
- Canonical port 4173 was not running at the preflight. The launcher installs
  dependencies unconditionally if starting a server, so browser verification
  will use the existing Playwright canonical-port web-server configuration and
  installed dependencies. This is temporary test setup, not a changed owner
  launcher. The owner opening path remains START_GAME.cmd at 127.0.0.1:4173.
  Playwright uses isolated fresh browser contexts with separate storage; it
  must never overwrite the owner's persistent browser campaign.
- Sol authored six new family modules covering all fourteen proposed concepts.
  Astra read the actual complete family files, source records, claims, patient
  scenarios, choices, explanations, and gate narratives. Core clinical scopes
  are accepted in substance. Returned corrections address multiple patient
  profiles, comparable answer categories and labels, premature answer teaching
  in result reports, CT versus clinical infection assessment, the final kidney
  prevention plan, patient-facing versus authoring-policy wording, and accurate
  ACG patient-education classification. Final corrected review and tests remain
  pending; the new batch is still unadmitted.
- Routine admission reads the active release's routineEligible cases directly,
  filtered by stage and capabilities. The legacy LEVEL_ONE/LEVEL_TWO case-ID
  exports are not the admission mechanism. Existing selection chooses among
  due or unseen concept identities, preserving FSRS timing; thirteen of the
  fourteen new concepts belong to test-gated cases. No weighting changes are
  necessary. Preserve the existing release ID/schema because persistence checks
  them; exact new content has its separate dated batch version and review record.
- Terra completed a bounded read-only browser-fixture investigation. Prototype
  campaigns use localStorage; the newer IndexedDB repository is separate.
  Unconditional profile-writing init scripts reset progress on every reload.
  Parent inspected pagehide and the write gate and corrected Terra's suggested
  alternative: writing a fixture into localStorage while the app is live can
  also be overwritten by the old document's synchronous pagehide save. Use a
  one-time init script guarded by a unique sessionStorage marker, which runs
  after that save on the new document; subsequent reloads retain real progress.
  Access-only init scripts are harmless. Use production reducer admission and
  keep all test state in fresh Playwright contexts. The public ADMIT_PATIENT
  command requires a manual name, so the generated-name scenario must use an
  actual routine ADVANCE_TICK admission with deterministic test selection;
  do not widen production command types just to create a browser fixture.

## Implementation and validation history

Sol `batch_architecture` completed the unadmitted six-Graves typed conversion
and exact-content tests under `development-batch/2026-09-09/`. Astra inspected
the actual full metadata, factory, and tests, returned citation corrections,
and accepted the corrected files. Parent independently ran the six focused
tests and clinical-content typecheck successfully. The tests compare all 24
questions against six frozen SHA-256-bound snapshots, allowing only the known
illustrative-name replacement. Sol also reported the full clinical-content
package passing: 41 files and 275 tests.

Parent actual review rejected Terra's first conversion: unresolved example names
in explanations, gender/profile mismatches, truncated objectives, incomplete
source/claim metadata, and tests that did not perform the claimed exact checks.
Preserve valid extraction while correcting the whole bounded milestone. Terra
`autonomous_batch_content` also returned a read-only gallstone/celiac outline.
Astra rejected it for irrelevant distractors and incomplete variant wording;
no content was admitted or accepted. Terra is idle, and Sol remains the sole
implementation writer. Sol's next bounded milestone is all fourteen new
concepts (56 variants and 28 blueprints), still unadmitted, using the complete
source/case brief and parent quality review. This authoring milestone is now
accepted: Astra read every family and correction pass and independently ran
the combined Graves/new-batch suites (2 files / 16 tests) and clinical-content
typecheck successfully. Actual new inventory is 14 concepts, 56 questions,
28 cases, 24 multistep cases, 28 gates, 15 claims, and 14 sources. A temporary
extra CRLF written to graves.ts was removed; accepted length and exact frozen
content tests are restored. See the
parent-owned [source and case brief](autonomous-clinical-batch-source-brief-2026-09-09.md)
for the accepted fourteen-concept roster, primary sources, and exclusions.
Next, Sol owns a bounded integration milestone: supplement atomic mappings for
already-verified supporting facts, add the three honest external service routes,
materialize names at encounter admission, record exact owner-delegated review,
admit the complete 20-concept / 80-question / 52-case batch together, and add
focused domain/content/balance validation. Root will inspect actual diffs against
the saved dirty-file baselines, run integrated validation, then delegate browser
playthrough coverage. The full batch is now connected to runtime together;
integration validation and the exact current admission record remain in progress.

### Integration review checkpoint

Astra inspected the actual admission helper and reducer diff against the saved
dirty baseline. Name materialization deep-clones the selected patient case,
sets the final display name, uses literal replacement only in patient-facing
fields, and never runs during save loading. The three new services are external
colonoscopy, upper endoscopy with duodenal biopsy, and extremity MRI with
centralized editorial game timing. Runtime release ID, schema, and unapproved
publication status remain unchanged. All preexisting allowlist changes and the
balance test changes are additive and scoped.

Four supplemental atomic mappings now cover already-verified celiac IgG/HLA,
common-bile-duct ERCP, and kidney infection assessment facts. There are nineteen
new claims, forty-eight combined, and twenty-five combined sources. The exact
receipt distinguishes the six historical clinician approvals from fourteen new
agent-reviewed concepts; runtime adaptations retain their separate provenance.
Sol completed meaningful production tests for shuffling, progression,
per-concept FSRS, additional routes, and frozen-save preservation. Focused
integration validation passed: clinical content 26 tests, domain 20 tests,
balance 8 tests, and all three package typechecks. Astra independently verified
all fourteen frozen artifacts, all six exact-review entries, non-row-61 records,
top-level queue data, and 121/81 queue counts are unchanged.

Astra's first full `npm test` found seven additional clinical-content failures:
historical presentation-revision tests incorrectly consumed the expanded source
list; old narrative checks did not understand generated-name slots or profile
demographics; new chief complaints needed patient voice; and several new keys
were uniquely longest. Sol owns these bounded integration corrections. Preserve
the strict historical revision mappings, expose their source list explicitly,
update narrative checks for every materializable profile, and improve new
complaints/choices. Only the three exact Graves wording violations may join
the narrow immutable-approval exception list. Astra will review changed new
wording before rehashing the receipt. Browser validation follows acceptance.

The full run otherwise passed workbench 43, balance 8, clinical-authoring 81,
and domain 164 tests. Player passed 406 with one existing all-900-combinations
graphics timeout; clinical-research passed 81 before an unexpected worker exit.
Astra owns isolated retries of those infrastructure/timing failures without
unrelated implementation changes.

The isolated retries passed with one Vitest worker: all 17 character-art tests
(including the 900-combination case) and all 83 clinical-research tests. No
graphics/research implementation or timeout configuration changed. Astra
reviewed the actual revision-scoped source export, strict historical tests,
generated-name narrative support, exact three Graves length exceptions, and
full frozen-save equality. The new complaints and shortened parallel answer
sets are accepted, with final explicit corrections delegated for the concise
bidirectional-endoscopy choice set and per-profile narrative-demographic check.
Sol may rehash the exact new receipt after those corrections and full clinical
validation; all original Graves artifacts remain immutable.

### Accepted integration and current browser milestone

Sol completed those exact corrections and rehashed the receipt. Astra inspected
the final source export, all changed choice groups, patient-voice complaints,
explicit explanation of bidirectional endoscopy, per-profile sex assertions,
and complete frozen-save equality. Parent independent final clinical-content
validation passed 43 files / 288 tests, including the ten-file receipt hashes
and all six original exact snapshots. Parent `npm run build` passed the runtime
and launcher boundaries, every workspace typecheck, and the player build. The
existing bundle-size advisory and a plugin-timing advisory are informational.
Scoped `git diff --check` passed. The full domain suite passed 28 files / 164
tests; all other workspace failures from the initial root run were resolved by
the recorded isolated retries or the clinical corrections above.

Sol now owns only new browser acceptance tests and batch-prefixed screenshots.
Required browser coverage is a real three-decision celiac case with two service
waits, no premature later questions/results, generated identity, stable frozen
content and answer order across a pending-service reload, plus another new
external route. Use fresh isolated Playwright contexts at canonical 127.0.0.1:4173,
the existing direct Playwright configuration, and a one-time sessionStorage-
guarded fixture. No owner save, launcher, dependency, or production change is
authorized by this browser milestone. Astra will inspect the actual test and
screenshots, then finish the scoped and current handoff records.

### Browser review finding and remaining action

Astra visually inspected the initial and pending celiac charts. Generated names,
age/sex, and matching portraits render coherently; choices are shuffled and only
the first decision is visible. The pending result and off-site status are clear.
The screenshot also exposed an existing view-model fallback that incorrectly
labels already-answered choices "Service route unavailable" while their service
is running. After the current timed run finishes, delegate a minimal display
correction and meaningful regression check: show unavailable only for a current
unanswered choice whose route actually cannot be offered. Do not edit production
while a browser run is active. Both fallback sites in session/viewModels.ts need
review. Dirty baselines for viewModels.ts and buildViewModels.test.ts are saved
alongside the prior nine baselines; prefer a new focused test file if suitable.
No clinical data, sources, receipt hashes, or routing behavior should change.

Early browser failures were test assumptions: duplicate patient-name locators,
Enact Plan closing the chart, the campaign picker appearing after reload, and
final charts offering Resolve Completed Chart directly. Sol corrected the test
to use actual UI actions without changing production. The MRI route already
completed its real wait and final question; the complete corrected two-scenario
run is still pending. Then review the minimal label correction, rerun relevant
checks/browser assertions, inspect final screenshots, and close the handoff.

The subsequent run completed and resolved both full encounters, including the
celiac pending-service reload and both testing gates. Its final console check
failed only on the existing exact canonical-origin favicon.ico 404. Sol may
exclude only that known asset miss; all other console and page errors remain
fatal. Sol now also owns the minimal two-site service-label correction, a new
focused view-model regression test, and a pending-chart browser assertion,
followed by the canonical browser rerun. Astra inspected the completed celiac
screenshot and reconfirmed the unchanged branch/HEAD, frozen artifacts,
non-row-61 records, queue top-level values, and 121/81 counts.

### Final acceptance and next action

The complete twenty-concept batch is implemented and accepted in the local
development game: 80 question variants, 52 case blueprints, 24 multistep cases,
and 28 real testing gates. Of the 28 new cases, 24 have multiple decisions.
The six original exact approvals and fourteen new owner-delegated agent
reviews remain distinct. No new clinician sign-off or public release is implied.

Sol corrected only the two service-label fallback expressions against the
saved dirty baseline and added focused regression coverage plus browser
assertions. Astra inspected the actual diff and all five final 1440x1000
screenshots. Canonical desktop Chrome acceptance passed 2/2 in 4.8 minutes:
celiac completed real laboratory and endoscopy/biopsy waits, a paused pending
reload, stable generated identity/profile/appearance and shuffled answer order,
hidden future questions/results, three distinct FSRS reviews, and resolution;
the soft-tissue-mass case completed its MRI wait, returned result, biopsy-plan
decision, and resolution. Only the verified canonical favicon.ico 404 is
excluded from console checks; every other console/page error remains fatal.

Parent independent final UI checks passed 2 files / 3 tests using
`npm test --workspace @gamify-surgery/player -- clinicalServiceLabels.test.ts buildViewModels.test.ts --maxWorkers=1`.
Parent `npm run build` passed again after the display correction: runtime and
launcher boundaries, all workspace typechecks, and player Vite build. The
existing large-chunk advisory remains informational. Build evidence is in the
ignored `.local-dev/autonomous-batch-final-ui-build-2026-09-09.log`; the earlier
clinical/domain/full-run and isolated-retry evidence is recorded above.

Terra completed the exact sixth receipt and bounded investigation. Sol owned
the accepted content correction/authoring, runtime integration, validation
corrections, browser acceptance, and final display fix. Astra owned source and
product decisions, reviewed the actual artifacts and diffs, performed independent
checks, and updated the scoped and shared handoffs. No substantial implementation
was retained outside delegation. Required batch work is complete.

The changes remain local and unpushed on beta at
`40638f677b674bc59f74f6742d55c8dda027bae1`. The owner plays through START_GAME.cmd
at http://127.0.0.1:4173 in their usual persistent profile. Automated browser
checks used isolated contexts and separate storage at that same origin. No
owner save or durable opening pathway changed. Next action is owner-directed
playtesting, further concepts, or an explicitly requested scoped GitHub backup;
remind the owner to say "push to GitHub". Do not automatically push, publish,
merge, archive, or create another task.
