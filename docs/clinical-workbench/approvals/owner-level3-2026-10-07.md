# Owner level-3 concept batch — October 7, 2026

The owner requested twenty new groups focused on levels3+ and purposeful
multi-decision questions. Twenty objectives, eighty substantive variants and62
encounters are implemented locally in the unapproved prototype. Eighteen visits
have two decisions;44 are independent single-decision cases. All start at Level3,
the current playable maximum. This is editorial/software acceptance; all new
authoring, questions, case reviews, sources and66 atomic claims remain
`needs_clinician_review`, with no named clinician approval or public release.

## Authoring, source and coverage review

The standing GS-028 requirements and required references were retained. Live
Sheet1 metadata/A1:M200 were refreshed read-only, with an empty A201:M1000 tail:
177 candidates through178, including new171–178. No raw sheet export is stored.
All44 subject leaves and373 prior active/nonactive clinical meanings were checked
for narrow scored overlap before selection. The twenty additions span ten
subjects, including the previously empty Nervous System. Endocrine/Breast receive
none. New Large Intestine skin objectives are distinct from high-output and
prolapse content. Pediatric remains a separate unfilled gap.

The [coverage audit](../audits/gs028-subject-coverage-level3-2026-10-07.md) and
[JSON](../audits/gs028-subject-coverage-level3-2026-10-07.json) retain all393
current meanings,44 ratios,20 objective boundaries, four variants per objective,
source/claim links and exact limitations. Official ABSITE/QE named categories
were freshly verified. Objective mappings into those categories are explicit
inferences, without claimed exam frequency. The current public SCORE PDF text
route failed; a proposed local download was rejected by automatic approval review
as proprietary SCORE material. No alternate download, proprietary module or
recalled-question corpus was used. Exact fresh SCORE common/uncommon depth is
withheld; official ABS outlines support category scope.

Fourteen sources have complete citation/author/year/DOI or official URL,
access-date, license/reuse, intended use and medical-authority metadata.
Sixty-six independently written atomic claims link reciprocally to sources and
all80 question records. CC BY attribution is retained; NC/copyrighted guidance
is used conservatively for targeted verification. Single-source HIV, monitoring,
stoma, Merkel and physiology limits; older stable nerve anatomy; and low-certainty
hernia evidence are recorded. The retracted robotic review is excluded. No source
prose, source excerpts, tables, figures, dosing thresholds or prescribed exact
timelines are stored.

The primary directly reviewed the actual authored cards in a separate editorial
pass, including all80 stems,320 choices, rationales, current updates and248 adult
profiles. Final visual review led to122 option revisions and eight shortened keys:
exaggerated absolutes, explanatory qualifiers, irrelevant categories and visibly
long keys were corrected. The resulting management options are parallel plans;
recovery options are assessments, pharmacologic options are mechanisms/blockers,
and diagnosis/anatomy choices use comparable labels. Runtime shuffles choices;
the ignored review packet explicitly marks key-first editorial presentation.
Questions state their task fully when separated from presentation. Chief
complaints are short; names/ages/sex match the instantiated patient and character.
No race/ethnicity selection or new demographic probability was introduced.

## Implementation and progression

Production lane: `packages/clinical-content/src/development-batch/2026-10-07-level3/`.
Four substantive variants/objective and at least two independent cases/objective
retain FSRS access even when a paired companion is already learned. Nine families
have two paired variants each; shoulder nerve cases remain separate because they
describe different operations and muscle patterns. Reached-only current updates
keep later facts out of the initial chart. Corrected-forward progression and
one review per reached concept are verified for correct and wrong paths.

The encounter schema ceiling is extended only2→3, matching the existing game;
Level4 remains rejected. Existing concept, acuity, educational-tier, setting and
capability fields remain separate. These stable adult encounters concern outside
hospital/operative planning or completed-report review. No onsite hospital service,
arrival/reward/economy, scheduler, FSRS policy, artwork or owner-save behavior is
changed. No gameplay network/model calls were added.

Four specialist sentinel-node staging choices show neutral runtime estimates
and exact specialist/unsupported non-execution dispositions. They do not alias
to generic biopsy, order nonexistent specialist services, fabricate results or
generate procedure income. Other cases use appropriate assessment/counseling;
no unnecessary orders were added just to produce a second step. All80 timing
entries are present, with testing distractors/no-test choices classified.

Actual no-new-capability ordinary supply at stages0/1/2 is unchanged by this
batch:639/175,874/281,910/297 cases/concepts. Stage3 grows910/297→972/317.
All62 new cases are rejected at stages0/1/2. Due, future-due, unseen and unresolved
selection and frozen old-encounter reload are exercised. The canonical owner
pathway remains `START_GAME.cmd` → `http://127.0.0.1:4173` in the usual profile.

## Actual diff and concurrent preservation

Intake HEAD was `f4a45745a4650423608e735688a61e1d2ae28ef1` on shared `beta` with
extensive concurrent Claude/owner edits. No broad staging, reset, stash, restore,
cleanup, commit, push or deployment was used. Nineteen shared-file preimages were
captured before edits: five integration files, eight historical clinical tests
and six domain inventory tests. The current
[diff manifest](../audits/gs028-level3-diff-manifest-2026-10-07.json) records
captured hashes/current normalized hashes and new authored-file hashes. Actual
scoped unified diffs are retained in ignored local QA evidence; the primary
inspected their individual hunks. Shared line endings match captured files.

The immutable intake331/1012/1295 release has SHA256
`20ec10aa3cc60d3afff7b68b701bd93f8643ceb3481453088197550e339c9fd8`.
Concurrent statistics/ethics authorship changes the28 preexisting concept lane
and pairs four interpreter cases, yielding a current old bank331/1008/1295.
Excluding exactly `case.gs028se.*`, `concept.statistics-ethics.*` and
`concept.quality-improvement.pdsa-act-and-iterate`, the entire303/900/1183 protected
bank is deep-equal/hash-equal to immutable intake (SHA256
`a5108ca54c38353b8f226075880da9b7ba97fe78b625eef2a87ade5033f8482a`).
The complete integrated release is351/1070/1375. The old331 release is not claimed
unchanged. Concurrent updates to historical statistics inventories after capture
were preserved; they are not attributed to this batch. Historical tests exclude
only newgs028g records from their prior-bank proofs; current admission/withdrawal
lists explicitly include all new IDs, and timing inventory adds exactly four
specialist choices. Supply snapshots were not rewritten to conceal failures.

## Validation and acceptance limits

- New clinical structure, source/claim traceability, draft status, stage admission,
  profiles and presentation:69/69 PASS.
- Actual new gameplay:258/258 PASS; all62 cases through248 correct/wrong paths,
  all320 distinct choice submissions, all248 profiles,18 paired transitions,
  corrected-forward behavior, review history, FSRS eligibility and save/reload.
- Exact test-choice order inventory:6/6 PASS (264 focused domain tests combined).
- Full clinical-content suite:583/583 PASS after final option revisions and concurrent inventory repairs.
- Full domain snapshot:3103/3106 pass,3 fail; a subsequent targeted statistics
  rerun50/50 resolves its stale inventory assertion. Two prior CT busy-reading
  queue expectations remain failing.
- Eight workspace TypeScript configurations, runtime boundaries and launcher
  contract PASS; balance66/66 PASS; isolated production build PASS. Routine
  bundle-size notice is nongating; no dependencies installed.
- Desktop and phone Playwright:6/6 PASS after final option revisions. Gallbladder
  wrong-first/corrected-forward/reload, Merkel specialist estimate/no fabricated
  biopsy, and stoma coherent care/no fabricated wait all reach departure. Final
  desktop/phone rendered charts were visually inspected.
- Chart/service-focused player suite18/19 passes; one existing dynamic
  pending-label expectation remains outside content ownership.

Domain failures in the last shared-tree snapshot:

- `packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts`
- `packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts` — subsequently
  resolved by the targeted50/50 rerun; only its three prior-bank inventory lines
  were scoped to exclude newgs028g, preserving all statistics gameplay assertions.

The remaining two earlier CT-pair tests expect a positive busy interpretation
queue but observe0. This batch does not change CT or resource scheduling. All
new258 gameplay checks and the full clinical suite pass; a full shared-tree green claim is withheld. Detailed
failure names/messages and the actual test counts are retained in the audit JSON.

Owned isolated QA server52276 on `http://127.0.0.1:4329` was identity-checked and
stopped; the port is free. Fresh Playwright profiles have separate storage and
did not touch the owner profile/origin/campaign. Your usual4173 pathway was not
substituted. Save & Close/reopen `START_GAME.cmd` to load the current local source.

No workers were spawned: current AGENTS.md reserves Codex dispatch for the sole
Claude manager; this directly owner-requested batch was authored, reviewed,
integrated and validated by primary Sol. This supersedes historical GS-028
delegation language. The owner keeps this GS-028 chat open for future batches.

This valuable checkpoint remains **LOCAL ONLY**, uncommitted and unpushed. Say
**“push to GitHub”** for a scoped audited backup. No release/deployment is authorized.
