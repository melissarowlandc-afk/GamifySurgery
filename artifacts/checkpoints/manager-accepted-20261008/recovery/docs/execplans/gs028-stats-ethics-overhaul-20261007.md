# GS-028 statistics and ethics content overhaul

## Goal and authorization
Owner request via the "Ethics/stats questions overhaul" Claude thread
(2026-10-07): rewrite the GS-028 statistics and ethics content (28 concepts /
112 variants); nearly every question reads badly. Full brief and owner
decisions: `docs/handoffs/STATS_ETHICS_OVERHAUL_BRIEF.md`. Everything stays
`needs_clinician_review`. No commit, push or release.

## Manager decisions (2026-10-07)
1. Level-1 supply. Facility level 1 unlocks only `staff.receptionist` and
   `staff.imaging_technician`; `staff.glp1_np` unlocks at level 2, so team
   discussions cannot occur at level 1. Decision: statistics and ethics still
   appear from level 1 through patient-facing statistics topics (PPV and
   prevalence, sensitivity/specificity, ARR/RRR/NNT, risk numbers in consent)
   and ethics embedded in patient cases. Methods topics (test selection, study
   design, bias/confounding, RR vs OR, p-value, CI, error/power, PDSA, QI
   measures) become team discussions from level 2. Widen their host roles from
   GLP-1 NP alone to clinical staff whose role plausibly attends journal club
   (worker proposes the exact list from existing role IDs). Host roles stay a
   content-level setting so the owner can change this without code changes.
   Owner confirmed this decision on 2026-10-07 ("Your decision is fine").
2. Structured field names (UI contract for Claude's ChartPanel pass), all
   optional so older frozen saves load unchanged:
   - runtime answer choice: `rationale?: string`
   - decision node: `teachingPoint?: string`
   - decision node: `exhibit?: CaseExhibit`, where `CaseExhibit` is
     `{ kind: "table"; caption: string; columnHeaders: string[];
     rowHeaders: string[]; cells: string[][] }`
     | `{ kind: "keyValue"; caption?: string; items: { label: string;
     value: string }[] }`
     | `{ kind: "abstract"; title: string; body: string }`.
   `explanation` stays populated as a short fallback; stop generating the
   concatenated explanation/learningSummary for new versions.

## Constraints
AGENTS.md clinical-content, source and question-authoring rules. Keep stable
concept IDs when only wording/patient details change; new concept version when
clinical meaning changes. Preserve frozen saves. Exhibit numbers are explicit
teaching datasets; no invented clinical numbers; keep atomic claim and source
mappings. No new sources from the web; if a rewrite needs an unsupported
claim, withhold it and report.

## Milestones and ownership
Worker lane: `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/`
(all files and tests), the clinical-content case/answer-choice type
definitions needed for the three optional fields, and the game-domain code
that copies authored choices into frozen cases (only to carry `rationale`,
`teachingPoint`, `exhibit` through). Not `apps/player`.
1. M1 schema: optional fields through authoring -> runtime -> frozen case;
   back-compat tests for old saves.
2. M2 statistics rewrite and patient-facing/colleague classification.
3. M3 ethics rewrite into multi-step patient cases or patient-as-subject.
4. Manager review: diff, validation reruns, sample read-through.

Concurrent: a Sol worker is integrating GS-033 character stills
(character catalog/registry/public art). Lanes are disjoint.

## Progress
- 2026-10-07: decisions recorded; Sol worker launched via `codex exec`
  (thread `01a11901-bf36-77b1-96c3-12ddae8e4365`, gpt-6.1-sol, max,
  workspace-write, unelevated sandbox).

## Worker handoff
(Worker appends.)

### Sol worker result - 2026-10-07

Owned implementation milestones M1-M3 are complete. Manager acceptance of the
aggregate suites is pending the excluded test updates below. No files outside
the assigned lane, this worker-handoff append, and the explicitly requested
samples file were edited. No agents, Git operations, installs, web retrieval,
player edits, publishing, launchers, browser storage, or owner saves were used.

#### Files changed

- `packages/clinical-content/src/schema.ts`: optional runtime choice
  `rationale`, optional node `teachingPoint` and `exhibit`, exported
  `CaseExhibit` and its strict schema; table dimensions are checked.
- `packages/clinical-content/src/pilot-schema.ts`: the same optional authored
  question/choice fields.
- `packages/game-domain/src/patientText.ts`: materializes patient/employee names
  in the three new fields. Existing reducer deep copies, shuffling, and
  persistence spread/schema paths already preserve them; those files needed
  no edits.
- Batch `batch-helpers.ts`, `family-builder.ts`,
  `statistics-ethics-batch.ts`: structured authoring/runtime propagation,
  wording-revision version, short summary, and feedback-only final
  dispositions.
- Batch `statistics-qi.ts` and new `statistics-variants.ts`: all 72 statistics
  variants, topic settings, and content-owned host roles.
- Batch `ethics.ts`: all 40 ethics variants, patient-centered contexts and
  four interpreter/consent pairings. Existing Spanish presentations and their
  female profile constraints are retained.
- Batch `statistics-qi.test.ts`, `statistics-ethics-admission.test.ts`, and new
  `schema-runtime.test.ts`, `ethics.test.ts`, `runtime-flow.test.ts`.
- `docs/handoffs/GS028_OVERHAUL_SAMPLES.md`: 28 materialized examples, one per
  topic; complaint, age/sex-bearing patient presentation or named employee
  discussion, exhibit, complete question, all choice rationales, teaching
  point, and claim IDs. It explicitly labels key-first review ordering.
- This append to the active ExecPlan. Source catalog files were not edited.
  The manager retains ownership of `CURRENT_THREAD_HANDOFF.md`.

#### Content, identities, and availability

The batch remains **28 concepts / 112 variants / 112 nodes**, now in
**108 cases**. All **28 concept IDs**, **112 question variant IDs**, and
question-scoped choice IDs remain stable. No clinical meaning changed and no
new concept identity/version was needed; the authored wording revision uses
`development-batch.2026-09-29.statistics-ethics.2`. The four paired cases replace
eight single-step authoring case IDs; the other 104 case IDs remain. A
regression loads a removed single-step interpreter case from its frozen save,
without the new optional fields, and answers it successfully.

Patient-facing statistics at facility level **0, including level 1**, are
`sensitivity-specificity`, `predictive-value-prevalence`, and `arr-nnt`
(including relative/absolute benefit and consent-number contexts): **12 cases**.
All ten ethics topics remain patient-facing from level **0**, including level
1: `qualified-interpreter`, `informed-consent`, `capacity-refusal`,
`surrogate-decisions`, `perioperative-dnr`, `error-disclosure`,
`impaired-colleague`, `research-consent`, `qi-versus-research`, and
`confidentiality`: **40 nodes in 36 cases**. Four cases first arrange qualified
interpretation and then continue the same patient's consent discussion.
The other 32 ethics cases make that patient's care, preferences, information,
or participation the subject. No unsupported disease-management step was
introduced. Ethics/statistics wrong answers have explicit
`no_terminal_outcome` dispositions with only a feedback-review instruction,
not a consequence story.

Employee discussions begin at facility level **2**, with an eligible hired
clinical host: `independent-t`, `paired-t`, `one-way-anova`, `rank-sum`,
`signed-rank`, `chi-square`, `fisher-exact`, `study-design`,
`bias-confounding`, `risk-ratio-odds-ratio`, `p-value`,
`confidence-interval`, `errors-power`, `pdsa-act` (stable
`concept.quality-improvement.pdsa-act-and-iterate`), and `qi-measures`:
**60 discussions**.

The final host list is an editable content constant in `statistics-qi.ts`:
`staff.glp1_np`, `staff.endoscopy_nurse`, `staff.endoscopist`,
`staff.periop_nurse`, `staff.surgeon`, `staff.or_nurse`,
`staff.pharmacist`, `staff.radiologist`. All eight exist in the balance
catalog and unlock at level 2 or later; four unlock at level 2.
Receptionist and imaging-technician roles are not included.

Level-1 category supply is preserved, not its old count: the GS028 batch now
supplies **48 ordinary cases / 13 concepts** early, versus 76 / 19 before the
rewrite. The difference is 24 methods cases moved to colleagues, plus four
fewer encounters due to pairing. There is no level-1 statistics/ethics category
gap; early methods are deliberately deferred under the manager decision.
Per-topic classification and samples are in the read-through file.

Every new node has a one- or two-sentence teaching point and every new choice
has a runtime rationale. All 72 statistics nodes have a small typed exhibit
(18 tables, 17 key/value exhibits, 37 abstracts). The statistical selection
stems neither name the key's test nor announce paired/independent/rank-based
analysis; observation structure and assumptions appear in the exhibits.
Each selection topic has at least three distinct distractor sets.

The clinical source/claim records retain **63 atomic claims and 30 sources**,
including source IDs, statements, claim/source links, bibliography, reuse
status, limitations, and original check/access dates. An exact-object audit
after the statistics rewrite and before/after the ethics rewrite also confirms
all those records and all concept objectives/claim links unchanged.
All authored records remain `needs_clinician_review`; agent review is
editorial/technical, dated October 7, and is not clinician approval.
**Withheld claims: none added or needed.** Disease-specific treatment decisions
and patient-specific numerical risk predictions were not introduced; all
exhibit figures are teaching datasets. No new sources were fetched.

#### Validation evidence

Vitest's default forks pool failed with `spawn EPERM` before executing tests.
The installed Vitest thread pool works without new permissions or dependencies.
All subsequent commands used `--pool=threads --maxWorkers=1`.

M1, before content rewriting:
```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-09-29-statistics-ethics --pool=threads --maxWorkers=1
 Test Files  3 passed (3)
      Tests  14 passed (14)
   Start at  20:58:36
   Duration  1.89s (transform 1.10s, setup 0ms, import 1.57s, tests 104ms, environment 0ms)
npm.cmd run typecheck --workspace @gamify-surgery/clinical-content
> tsc --noEmit -p tsconfig.json
Exit 0
```

M2:
```text
 Test Files  3 passed (3)
      Tests  15 passed (15)
   Start at  21:08:13
   Duration  2.11s (transform 1.20s, setup 0ms, import 1.71s, tests 130ms, environment 0ms)
npm.cmd run typecheck --workspace @gamify-surgery/clinical-content
> tsc --noEmit -p tsconfig.json
Exit 0
```

Final owned batch, including admission and real reducer/save tests:
```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-09-29-statistics-ethics --pool=threads --maxWorkers=1
 Test Files  5 passed (5)
      Tests  31 passed (31)
   Start at  21:24:46
   Duration  3.81s (transform 1.84s, setup 0ms, import 2.97s, tests 347ms, environment 0ms)
Exit 0
```

Those tests cover all three exhibit shapes from authoring through shuffled
frozen cases/reload, legacy saves omitting all three fields, a removed
single-step frozen case, both correct and incorrect paths through all four
two-step cases, current-update name substitution, one FSRS review per concept,
and real staff discussions with each exhibit kind through answer/reload/file.

Full clinical-content suite:
```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1
 Test Files  8 failed | 72 passed (80)
      Tests  10 failed | 504 passed (514)
   Start at  21:18:36
   Duration  22.52s (transform 2.07s, setup 0ms, import 14.75s, tests 2.06s, environment 4ms)
Exit 1
```

The ten failures are outside this lane and reflect the approved changes:
- `approved-data/quality-improvement-pdsa-iteration.test.ts:176`: active stable
  PDSA ID expected stage 0, now stage 2.
- Global case-count assertions in the September 11, September 12, September 13,
  September 17 brief, and September 17 bread-and-butter admission tests:
  `expected ... a length of 1012 but got 1008`.
- Both October 7 variety admission files: current or pre-variety release counts
  are four lower (`934 -> 930`, `856 -> 852`, `1012 -> 1008`). Their
  historical byte-preservation baselines also require a scoped review of this
  intentional content revision, rather than a blind hash refresh.

Full game-domain suite:
```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
  Snapshots  2 failed
 Test Files  7 failed | 87 passed (94)
      Tests  14 failed | 2802 passed (2816)
   Start at  21:18:36
   Duration  177.52s (transform 2.57s, setup 0ms, import 33.37s, tests 136.64s, environment 5ms)
Exit 1
```

Excluded failures:
- `tests/gs028-statistics-ethics-batch.test.ts`: six stale tests (112 versus
  108 cases, 36 versus 60 discussions, and four helpers that acknowledge the
  first paired node as terminal). Its NP fixture must use level 2. A narrowly
  scoped permission question was submitted; no response authorized editing
  this excluded file, so it remains untouched.
- `tests/gs028-20261003-batch.test.ts`: old total case count.
- `tests/gs028-20261007-batch.test.ts` and
  `tests/gs028-20261007-variety2-batch.test.ts`: early ordinary supply is 28
  cases / six concepts lower after the methods reclassification and pairing.
- `tests/patient-supply.test.ts`: old inventory count and one deterministic
  patient-supply snapshot.
- `tests/diagnostics/patient-supply.test.ts`: another deterministic
  patient-supply snapshot; requires manager inspection of the new case mix.
- Two `tests/reading-stations.test.ts` assertions fail against concurrent
  radiologist-catalog integration: expected the four `level3-roster-v2`
  identities, received `future-roster20-v5` identities; expected catalog length
  four, received 16. This is unrelated to the clinical fields/content changes
  and was not edited.

The focused existing game-domain GS028 test reported:
```text
 Test Files  1 failed (1)
      Tests  6 failed | 44 passed (50)
   Start at  21:15:20
   Duration  2.59s (transform 1.10s, setup 0ms, import 1.46s, tests 1.05s, environment 0ms)
```

Final package typechecks and final complete `npm.cmd run typecheck`: **exit 0**.
All eight workspaces typecheck. Earlier aggregate runs encountered concurrent
player room-upgrade/workload test mismatches, a temporarily missing StaffPanel
duration import, and a new level3 test using `prompt` instead of `stem`.
These were outside this lane and resolved through concurrent work; this worker
did not fix them.

Captured complete outputs, temporary local files (not repository artifacts):
- `C:/Users/rowla/AppData/Local/Temp/gs028-overhaul-clinical-20261007.log`
- `C:/Users/rowla/AppData/Local/Temp/gs028-overhaul-domain-20261007.log`
- `C:/Users/rowla/AppData/Local/Temp/gs028-overhaul-typecheck-20261007.log`

#### Manager next action and limits

Inspect the owned changes and read-through, then update the excluded admission,
multi-step-flow and supply expectations within an explicitly assigned lane.
Review deterministic snapshot deltas before accepting them. Coordinate the two
radiologist assertions with GS-033. Rerun the full clinical-content and
game-domain suites after those fixes; aggregate tests are **not green** yet.
The optional feedback/exhibit UI is Claude's lane and was not browser-tested by
this worker.

No unsupported clinical claims or new concept-version decisions remain.
Named clinician review remains required for public approval. Everything is
local only, with no Git backup from this worker. After review, the manager owns
the checkpoint reminder: say **"push to GitHub"** for an audited backup; this
worker has no push authority. Owner opening pathway is unchanged:
`START_GAME.cmd -> http://127.0.0.1:4173` in the usual persistent profile.

### Manager review of M1-M3 — 2026-10-07
Read-through sampled (rank-sum, PPV, impaired colleague): framing, exhibits,
teaching points and rationales are a clear improvement. Found giveaway
straw-man distractors and one patient-facing PPV item drifting into an
abstract population comparison. Resumed the same worker for M4 (stale test
expectations in the listed clinical-content and game-domain test files;
snapshot case-mix summary for manager review) and M5 (distractor quality pass
across all 112 variants plus a key-length outlier check). Manager already
fixed the two reading-stations radiologist assertions.

### Sol worker follow-up M4 - 2026-10-07

Updated only the assigned stale GS-028 expectations: PDSA discussion stage 2,
108 cases / 112 nodes, 60 level-2 discussions, and four two-step
interpreter/consent cases. Ordinary-case tests now answer and acknowledge every
node, retaining one FSRS review per concept, corrected-forward checks on
nonfinal wrong answers, terminal acknowledgement and chart closure. No edits
were made to `reading-stations.test.ts`.

Historical preservation was verified against the two original local protected
release JSON files (neither was overwritten). Original SHA256 values:
`bed6d41e73d29a8fb54eb107dd224e2087fbb412ea53c197566afc15a15e8abf` and
`d9f1b176ee05ed551494583c78cfd385d50a59007d737d5b3391305be7da9970`.
After removing only GS-028's 28 concept IDs and `case.gs028se.*` cases, the
complete byte-normalized releases match their originals, including ordering and
all other fields. Their unchanged non-GS-028 SHA256 values are respectively
`b02c2a8211b6a76f4ef3b7325c9543fb43a17d7211e9c7ff6beb5b946aa6dd23` and
`7e1918260ca1433b7695f6ea91144e09866b2db4fe18960acdcf7e2336a45a02`.

Refreshed GS-028 records: all 104 retained `case.gs028se.*` cases plus four
new `case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-{1..4}`
cases; removed the eight `a-qualified-interpreter-{1..4}` and
`b-informed-consent-{1..4}` single cases. The 15 methods concept records
listed in the topic-classification table above change stage 0 -> 2.
Reasons are the accepted presentation/feedback/exhibit rewrite, patient
profiles, widened discussion roles, and interpreter/consent pairing. No other
batch record is refreshed. The two strict whole-release hash assertions remain
in place; M5 wording will require another GS-028-only hash refresh.

Three snapshot bodies were updated across the two assigned patient-supply
files, with their completion and availability assertions retained:

| Observed inventory / seed | Before | After |
|---|---:|---:|
| Stage 0 ordinary cases / concepts | 667 / 181 | 639 / 175 |
| Stage 1 ordinary cases / concepts | 902 / 287 | 874 / 281 |
| Stage 2 external ordinary cases / concepts | 938 / 303 | 910 / 297 |
| Stage 2 all-capability cases / concepts | 976 / 322 | 948 / 316 |
| Stage 0 seeded patients until not due | 168 | 162 |
| Stage 1 seeded patients until not due | 223 | 220 |
| Stage 2 external seeded patients | 232 | 230 |
| Stage 2 all-capability seeded patients | 245 | 239 |
| Stage 0 16-seed patient range | 162-172 | 157-163 |
| Stage 1 16-seed patient range | 222-230 | 214-223 |
| Stage 2 external 16-seed patient range | 231-239 | 226-233 |
| Stage 2 all-capability 16-seed range | 242-250 | 238-242 |

The ordinary inventory reduction is exactly 24 methods variants moved to team
discussions plus four fewer cases from pairing; six concepts leave the ordinary
pool. The three patient-facing statistics concepts and all ten ethics concepts
remain early. Seed-dependent ordering also changes which legacy multistep
siblings remain unseen; their independent-eligibility assertions still pass.

Day-six/seven/eight targeted arrivals stay at ticks 3000/3600/4200 and all
complete. Their step counts change 1/2/2 -> 2/1/2. In the sustained eight-day
diagnostic, arrivals stay 79 with the same per-day distribution
11/10/9/10/10/9/10/10, zero walkouts and continued new-concept selection.
Completed patients change 77 -> 76; answers and scored concepts 106 -> 108;
pending/unresolved patients 2 -> 3; unseen available concepts 190 -> 173.
This is a deterministic case-mix change, not a timing or scheduler edit. The
post-rewrite seed reviews ARR, confidentiality and error disclosure, while PPV,
informed consent and impaired-colleague remain unseen at the cutoff, reversing
their prior seed positions. Methods discussions no longer appear in the
diagnostic's stage-1 eligible-ID enumeration. The concurrent level-3 addition
contributes 20 IDs to the inventory's concepts-without-stage-2-routine-cases
list; that addition is separate from this rewrite.

Exact M4 validation:

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1
Test Files  81 passed (81)
     Tests  583 passed (583)
  Start at  21:44:34
  Duration  29.74s
Exit 0

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
Test Files  1 failed | 94 passed (95)
     Tests  1 failed | 3105 passed (3106)
  Start at  21:44:34
  Duration  213.72s
Exit 1
Sole failure: tests/gs028-statistics-ethics-batch.test.ts:195
expected length 331, received 351

npm.cmd run typecheck
All eight workspace typeconfigs passed.
Exit 0
```

Both suites also wrote JSON reports in TEMP:
`gs028-m4-clinical-full.json`, `gs028-m4-domain-full.json`; snapshot-update
receipt `gs028-m4-supply-update.json` records 2 files / 5 tests passed and
3 snapshots updated (26.31s). Historical GS-028-only comparison receipt:
`gs028-m4-baseline-audit.json`; detailed snapshot delta:
`gs028-m4-snapshot-summary.json`.

The remaining global-count failure is caused by the concurrently admitted
level-3 batch (20 concepts, 62 cases, 80 nodes), not GS-028. Other assigned
historical tests were concurrently scoped by the manager; those edits were
preserved. This worker has not changed the GS-028 inventory assertion to
accept unrelated level-3 additions, under the GS-028-only expectation rule.
Manager integration must scope that assertion or refresh its level-3 totals.
M5 proceeds in the original batch lane.

### Sol worker follow-up M5 and final M4-M5 handback - 2026-10-07

M4's assigned expectation updates and M5's content pass are implemented.
All 112 variants were read; 184 distractor labels and 240 distractor rationales
changed across 84 variants. Choice IDs and correct/incorrect identity remain
stable. The other 28 variants retain their choices after review. Thirteen key
labels were shortened or rephrased without changing their meaning. The manager's
concurrent level-3 scoping edit to the GS-028 global inventory test is preserved;
M4's remaining 331-versus-351 failure now passes.

#### Files changed during M4-M5

Clinical-content M4 tests (relative to `packages/clinical-content/src/`):

- `approved-data/quality-improvement-pdsa-iteration.test.ts`
- `development-batch/2026-09-11/board-expansion-admission.test.ts`
- `development-batch/2026-09-12/board-expansion-admission.test.ts`
- `development-batch/2026-09-13/early-levels-admission.test.ts`
- `development-batch/2026-09-17/brief-early-levels-admission.test.ts`
- `development-batch/2026-09-17-bread-and-butter/bread-butter-admission.test.ts`
- `development-batch/2026-10-07-variety/variety-admission.test.ts`
- `development-batch/2026-10-07-variety-2/variety-admission.test.ts`

Game-domain M4 tests (relative to `packages/game-domain/`):

- `tests/gs028-statistics-ethics-batch.test.ts`
- `tests/gs028-20261003-batch.test.ts`
- `tests/gs028-20261007-batch.test.ts`
- `tests/gs028-20261007-variety2-batch.test.ts`
- `tests/patient-supply.test.ts`
- `tests/diagnostics/patient-supply.test.ts`

M5 batch files (relative to
`packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/`):

- `statistics-variants.ts`: plausible methods/interpretation distractors,
  denominator-error options, complete diagnostic teaching tables, and all
  12 patient-facing statistics presentations/tasks about the patient's result
  or care decision. The PPV complaint is now `Screen follow-up`, avoiding
  repetition of its presentation.
- `ethics.ts`: reasonable competing actions and corresponding rationales
  throughout the 40 ethics variants, preserving patient subjects and pairing.
- `statistics-qi.ts`: preserve the original nine McNemar-boundary question
  mappings explicitly instead of inferring provenance from a method name
  appearing in editable prose.
- `statistics-qi.test.ts`: guard those nine original claim mappings and
  complaint/presentation separation, retaining existing assertions.
- `statistics-ethics-admission.test.ts`: check all 112 keys against 1.5 times
  the mean distractor length in both characters and words. Existing guards
  against a uniquely longest key remain.

Documentation: `docs/handoffs/GS028_OVERHAUL_SAMPLES.md` now renders the final
28 topic examples (including both interpreted-consent steps), and this
ExecPlan's Worker handoff was appended. Total: 21 files during M4-M5.
No additional schema or runtime code changed during these follow-ups.
`reading-stations.test.ts` was not touched. Temporary audit tests were removed.

#### Distractor changes and examples

Counts below cover wrong-choice labels and rationales; all four variants of
each topic were reviewed, including topics with zero changes.

| Topic | Labels changed | Rationales changed |
| --- | ---: | ---: |
| Independent t test | 8 | 12 |
| Paired t test | 3 | 12 |
| One-way ANOVA | 2 | 12 |
| Rank-sum | 2 | 12 |
| Signed-rank | 2 | 12 |
| Chi-square | 6 | 12 |
| Fisher exact | 0 | 0 |
| Study design | 0 | 0 |
| Bias/confounding | 3 | 3 |
| Sensitivity/specificity | 8 | 12 |
| PPV/prevalence | 3 | 5 |
| Risk ratio/odds ratio | 4 | 4 |
| ARR/NNT | 0 | 0 |
| P-value | 3 | 3 |
| Confidence interval | 5 | 5 |
| Errors/power | 4 | 4 |
| PDSA | 12 | 12 |
| QI measures | 0 | 0 |
| Qualified interpreter | 11 | 12 |
| Informed consent | 12 | 12 |
| Capacity/refusal | 12 | 12 |
| Surrogate decisions | 12 | 12 |
| Perioperative DNR | 12 | 12 |
| Error disclosure | 12 | 12 |
| Impaired colleague | 12 | 12 |
| Research consent | 12 | 12 |
| QI versus research | 12 | 12 |
| Confidentiality | 12 | 12 |
| **Total** | **184** | **240** |

Examples of the final alternatives:

- Impaired colleague v1: `Proceed with a second clinician observing the
  procedure`, `Pause the procedure and ask the clinician to self-assess`, and
  `Recheck performance after a brief rest before arranging help`. Their
  rationales explain the limitations of observation, self-assessment and
  temporary rest when immediate fitness is in question. Waiting for an injury
  or declaring intoxication to the patient is no longer an option.
- PPV v1/v2: `Positive predictive value is indeterminate` replaces a claim
  that PPV becomes sensitivity/specificity. Its rationale distinguishes the
  direction of change, which follows under the exhibit's fixed test
  characteristics, from an exact numerical value.
- Sensitivity v1: `10%`, `75%`, `70%` represent false-negative fraction,
  positive-result denominator, and specificity errors in a complete 2-by-2
  teaching table. The key is `90%`; each numeric option has an explicit
  denominator rationale.
- PDSA v1: spreading to other clinics, repeating the unchanged pilot, and
  adapting before another test compete with local adoption and a next linked
  test. Each alternative is an improvement action whose fit depends on the
  stated aim and balancing results.
- Interpreter v1: a bilingual clerk and a translated consent handout are
  plausible shortcuts; their rationales explain why neither establishes
  qualified interpretation for the patient's questions.
- Research consent v3: all four labels use the same assignment-and-benefit
  construction, avoiding a visibly longer or more qualified key.

The final maximum key-to-mean-distractor ratio is **1.25 by characters** and
**1.2857142857142856 by words**. No duplicate choice labels were found. Length
checks support the editorial review; they are not clinical approval.
The full changed-choice receipt, including stable choice IDs and before/after
labels, is `C:/Users/rowla/AppData/Local/Temp/gs028-m5-final-audit.json`.

#### Preservation, sources, and case mix

All 28 tested-concept payloads, 63 atomic claim payloads and 30 source payloads
match the pre-M5 records. All 112 question-level claim-ID lists, choice IDs and
correctness flags match; all 108 case IDs are unchanged during M5. In
particular, the nine existing McNemar-boundary mappings are retained even when
that method is no longer a distractor. Stages, participant settings,
capabilities, rewards, demographic/vital profiles, node identities, shuffle
settings, result gates, service requests and terminal kinds were unchanged
during M5. No new concept version, clinical claim, source or withheld teaching
point was needed. Everything remains `needs_clinician_review`.

The final historical hash refresh changes only GS-028 records described in M4:
104 retained cases, eight removed single interpreter/consent cases replaced
by four paired cases, and the 15 methods concepts' stage metadata. After
excluding GS-028, both complete releases still match their original protected
baseline files, including record order and all other fields. Original files
were not overwritten. Final strict whole-release hashes used by the two
October 7 admission tests are:

- First variety pre-batch release:
  `1b45db0ea6298306e1fd1a56ef0d3ae725a7e97faa9d09c84b53546ae550045d`.
- Second variety pre-batch release:
  `0927da2cdd69742e6ab884d1df1268729372ba50640c48e8763632b73c28d218`.

The non-GS-028 hashes and original baseline hashes recorded in M4 are unchanged.
A final temporary audit independently verified both comparisons and provenance
before the temporary test was removed (1 file / 1 test passed, 2.13s, exit 0).

Snapshot case-mix summary for manager acceptance: ordinary supply loses
**28 cases / 6 concepts** at each recorded stage (24 methods cases reclassified
as discussions plus four cases consolidated by pairing); the other nine
methods concepts were already discussions. Stage-0/1/2-external/2-all ordinary
inventory cases change **667/902/938/976 -> 639/874/910/948**, and concepts change
**181/287/303/322 -> 175/281/297/316**. Patient-facing statistics and all ethics
remain available from level 0, including level 1; the 60 methods discussion
cases begin at level 2 with the unchanged eight-role host list above. Sustained
eight-day arrivals stay **79**, with the same daily distribution and zero
walkouts; completed cases **77 -> 76**, answers/scored concepts **106 -> 108**,
pending/unresolved **2 -> 3**, unseen concepts **190 -> 173**. The more detailed
seed and stranded-concept comparisons are in the M4 handoff. M5's prose pass
does not change these supply snapshots.

#### Exact final validation and remaining integration failures

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1 --reporter=default --reporter=json --outputFile=$env:TEMP/gs028-m5-clinical-final-v2.json
 Test Files  81 passed (81)
      Tests  585 passed (585)
   Start at  22:24:41
   Duration  41.00s (transform 3.60s, setup 0ms, import 26.59s, tests 4.40s, environment 8ms)
Exit 0

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --reporter=default --reporter=json --outputFile=$env:TEMP/gs028-m5-domain-full.json
 Test Files  3 failed | 93 passed (96)
      Tests  6 failed | 3129 passed (3135)
   Start at  22:03:35
   Duration  452.93s
Exit 1

npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/gs028-statistics-ethics-batch.test.ts tests/patient-supply.test.ts tests/diagnostics/patient-supply.test.ts --reporter=default --reporter=json --outputFile=$env:TEMP/gs028-m5-domain-owned-final-v2.json
 Test Files  3 passed (3)
      Tests  55 passed (55)
   Start at  22:24:41
   Duration  80.27s (transform 2.67s, setup 0ms, import 4.51s, tests 75.39s, environment 0ms)
Exit 0

npm.cmd run typecheck
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present

> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json

> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
Exit 0
```

The final full clinical suite includes all five owned batch files / 33 tests.
The full domain run preceded the last PPV chief-complaint display cleanup;
the final focused gameplay/supply run above verifies the final text and both
supply files after that cleanup. The six full-domain failures are preserved
for manager integration, without weakening their assertions:

1. `src/characterStillCatalog.test.ts:90`: GS-033 reachability expected
   `patient-demographics20-v4.003`, received `gs022-new-person-015`.
2. The same file at line 120: demographic-gap reachability expected
   `patient.adult.033`, received `level3-roster-v2.017`.
3. The same file at line 151: women-catalog reachability expected
   `patient.adult.009`, received `patient.adult.016`.
4. `tests/gs028-20261007-variety2-batch.test.ts:426`: CT pair
   `case.gs028f.neck-mass.paired-persistent-solid`, `busy_reading` fixture:
   `expected 0 to be greater than 0` for `forecast.queueTicks`.
5. The same assertion for CT pair
   `case.gs028f.neck-mass.paired-cystic-is-not-benign`.
6. `tests/level-two-persistence.test.ts:133`: `Cannot read properties of
   undefined (reading 'arrivedAtTick')` at `src/appearance.ts:395`, through
   appearance-selection context, retail companion creation and the reducer.
   This legacy fixture supplies an encounter without `waiting`.

The character-selection and appearance code belongs to the concurrent GS-033
lane. The two CT queue assertions passed during M4 and now need manager
diagnosis; the CT case records and their queue assertions are unchanged by
this rewrite, and M5 changed no execution controls. Although their test file
is in the expanded M4 lane, changing these queue expectations is outside the
GS-028-only count/stage/pairing/host-fixture authorization. No assertion was
weakened and no out-of-lane implementation was edited.

JSON receipts are in `C:/Users/rowla/AppData/Local/Temp/` under the exact names
in the commands above; `gs028-m5-final-audit.json` records the final baseline
hashes, provenance counts, per-choice changes and length ratios. These are
local investigation artifacts, not checked-in clinical source material.

Manager next action: inspect the 21-file follow-up, read the final samples,
accept the deterministic case-mix delta, and coordinate the six integration
failures before declaring the aggregate domain suite green. UI/browser
acceptance and clinician approval remain outside this worker's assignment.
No Git, installs, web retrieval, agents, external messages or owner-save changes
were performed. Work remains local; the manager owns the reviewed checkpoint
reminder to say **"push to GitHub"**. The opening pathway is unchanged.

### Manager review of M4-M5 — 2026-10-07
Sampled final PPV, impaired-colleague and capable-refusal items: distractors are now plausible single-best-answer alternatives with parallel grammar; PPV item stays about the patient's own result. Content accepted pending a clean full game-domain run after the concurrent character-variety revision lands (remaining 6 failures: 3 character-selection, 2 CT busy-reader queue, 1 persistence fixture missing `waiting`).
