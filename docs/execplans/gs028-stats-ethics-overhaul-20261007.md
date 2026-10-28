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

### Phase 2A round-2 full wording — Sol worker handoff (2026-10-15)

P2-B, P2-C, and P2-D are implemented for manager acceptance: **118 variants
across 30 concepts**, with **59 humorous / 59 straight**. The full owner
read-through is `docs/reviews/stats-ethics-round2-full-20261015.md`. Every
variant includes complaint, materialized named story or reached update,
complete task, all choices explicitly key-first for review only, every choice
rationale, visible teachingPoint, distinct fallback, and existing claim/source
bindings. The review is grouped by all 30 topics and has a humor tag per item.

The four existing interpreter-to-consent pairs remain. Main-bank counts stay
28 concepts / 112 variants / 108 cases; the complete focus stays 30 concepts /
118 variants / 114 cases. P2-E clinical pairings were **not** created. All
content remains `needs_clinician_review`; no clinician approval, new clinical
meaning, source revalidation, release admission, or promotion is claimed.

#### Files changed and ownership

Content, relative to `packages/clinical-content/src/development-batch/`:

- `2026-09-29-statistics-ethics/statistics-variants.ts`: all 72 statistics/QI
  stories, lessons, fallbacks, choice rationales, exhibit framing, and varied
  unconstrained adult profiles. Practice inputs retain their meaning.
- `2026-09-29-statistics-ethics/statistics-qi.ts`: explicit existing-claim
  contrast bindings only; all nine original McNemar boundary bindings retained.
- `2026-09-29-statistics-ethics/ethics.ts`: all 40 ethics stories/reached updates,
  lessons, fallbacks and rationales; immutable `why` evidence statements are
  separate from the new feedback. Existing claim bindings expanded explicitly.
- `2026-10-07-variety-2/patient-safety.ts`: four RCA/FMEA rewrites. The older
  builder did not forward teachingPoint or runtime rationales; a local content
  attachment copies both to questions and runtime nodes without changing any
  shared builder, schema, or player code.
- `2026-10-08-pediatric-clinic/assent.ts`: both constrained assent rewrites,
  richer visible lessons, and existing-claim mappings for the whole lesson.

Tests, relative to the same directory:

- `2026-09-29-statistics-ethics/statistics-qi.test.ts`
- `2026-09-29-statistics-ethics/ethics.test.ts`
- `2026-09-29-statistics-ethics/round2-wording.test.ts` (new)
- `2026-10-07-variety-2/remaining10-content.test.ts`
- `2026-10-07-variety-2/full-batch-content.test.ts`
- `2026-10-07-variety-2/variety-admission.test.ts`
- `2026-10-08-pediatric-clinic/pediatric-admission.test.ts`

Documentation: the new full review above and this append. Total: **14 delivered
paths (five content files, seven tests, two documents)**. No game-domain test
expectation needed an edit. No other batch, apps/player, scripts, Supabase,
setup document, shared authoring helper, schema, or runtime implementation was
edited. The manager retains `CURRENT_THREAD_HANDOFF.md`; it is unchanged.

Equality-of-feedback and one-claim assumptions were replaced by complete,
distinct fallback checks, authoring/runtime alignment, reciprocal existing
claim/source resolution, and preserved draft status. New checks close the
118-variant inventory, preserve the pairing boundary and constrained identities,
check visible lesson/story depth and profile variety, and match every item to
the full review. All existing count, shuffle, population, identity, timing,
safety and legacy-save guards remain. RCA boilerplate-key assertions now check
its actual structured feedback, with other topics' assertions unchanged.
The pediatric historical read-through remains exact for every unaffected
section; its two current assent variants are checked against the new full
review, including stories, choices, rationales, fallbacks, and lessons.

#### Counts, demographics, humor, and provenance

All **118 stories, 118 teaching points, 118 fallback explanations, and 472
choice rationales** changed. Eighteen choice labels changed; other labels were
retained after parallel-choice review, including standard method names and the
unchanged ARR/NNT keys. There are **121 added bindings to existing claims**.
No claim or source was added. The focused graph uses **69 existing atomic
claims / 33 existing sources**; the main catalog remains **63 claims / 30
sources**, with every claim/source payload, authority, rights status, and
check/access date unchanged. Wording revisions are identified as 2026-10-15
in the owned modules and review; stable concept payloads/versions and common
batch version constants are unchanged.

Materialized stories are **54–60 words**, visible lessons **45–55 words**, and
short fallbacks **20–31 words**. Exhibits retain all table cells and key/value
inputs and their original observation structures; captions now explain units,
counts, reference meaning and practice-data limits without repeating the UI's
“Teaching dataset” label. No patient-specific probability or new testing wait
was authored. All focused choices retain no-test semantics.

Humor counts: statistics/QI **46/72**, main ethics **12/40**, RCA/FMEA **0/4**,
assent **1/2**, total **59/118**. Comedy is removable bureaucracy, overconfident
project promotion, absurd advertisements/merchandise, or the patient's own wit.
Choices remain neutral. Capacity, surrogate decisions, DNR, disclosure,
clinician fitness, coercion, and completed safety events stay straight.

There are **60 staff-discussion variants** without patient demographics and
**58 patient nodes in 54 patient cases**. Representative first profiles give
**34 Female / 24 Male patient nodes**, or **30 Female / 24 Male distinct cases**;
consent nodes repeat the same four interpreter patients. Across all **202
authored case profiles**, counts are **106 Female / 96 Male**. These are
editorial instantiation counts, not prevalence, selection weights, or intended
population frequencies. Profile age range is **6–77** (unconstrained adults
25–77). Both sexes remain available in each unconstrained adult case under the
existing age-by-sex profile rule, with first-profile ordering varied.

Spanish interpreter profiles preserve the original Female ages 43 and 68 and
their existing profile identities; only display order varies. Lily Walker
remains a 6-year-old girl with mother Susan Walker and art
`level3-roster-v2.021`. Ruby Anderson remains an 11-year-old girl with father
Thomas Anderson and art `level3-roster-v2.027`. Parent placement, pediatric
capability, and standalone draft/admission metadata are unchanged.

Exact representative age/sex distribution by patient **node** (paired consent
nodes count the same patient again):

| Age | Female | Male |
| --- | ---: | ---: |
| 6 | 1 | 0 |
| 11 | 1 | 0 |
| 28 | 1 | 0 |
| 29 | 1 | 2 |
| 32 | 2 | 0 |
| 33 | 0 | 1 |
| 35 | 0 | 3 |
| 36 | 1 | 0 |
| 38 | 0 | 1 |
| 40 | 1 | 0 |
| 42 | 0 | 1 |
| 43 | 4 | 0 |
| 45 | 2 | 0 |
| 46 | 2 | 0 |
| 47 | 2 | 0 |
| 48 | 0 | 2 |
| 51 | 0 | 3 |
| 54 | 0 | 1 |
| 56 | 3 | 0 |
| 58 | 1 | 3 |
| 61 | 3 | 0 |
| 63 | 0 | 1 |
| 67 | 0 | 1 |
| 68 | 4 | 1 |
| 69 | 2 | 0 |
| 71 | 2 | 0 |
| 72 | 1 | 0 |
| 73 | 0 | 1 |
| 74 | 0 | 2 |
| 77 | 0 | 1 |

**Withheld:** no new unsupported teaching point or source was needed. Existing
adolescent confidentiality/refusal/legal-consent content remains withheld,
including `withheld.pediatric-clinic.adolescent-confidentiality`. Personal
post-test risks, named-treatment benefit/harm figures, required follow-up
tests/intervals, significance cutoffs, capacity scores, universal surrogate
hierarchies, interpreter credential rules, and jurisdiction-specific legal
rules were not added. Existing catalog limitations remain. Future P2-E pairing
and the 32 integrated clinical variants are outside this milestone.

#### Preservation and three out-of-lane clinical hash guards

The local baseline audit confirms all concept, question, choice, case, and node
IDs and correctness flags unchanged; every original claim binding retained;
all concepts, claims, sources, case reviews and timing entries unchanged; and
unchanged stages, educational tiers, hosts, release/capability requirements,
vitals, rewards, eligibility, shuffle settings, result gates, service requests,
terminal IDs/kinds and feedback-only consequence narratives. Adult profile
values/order and the intended content text are the scoped changes. Frozen saves
continue to keep their saved fields; no migration was made. Existing real
reducer/reload, old optional-field, removed-case, corrected-forward, and
single-FSRS-review regressions pass in the owned checks.

For each historical release, replacing only the scoped current cases with the
canonical prior runtime cases exactly recreates the previous whole-release
hash. Unrelated objects and ordering remain equal. This proves the allowed
content scope before any hash update; it is not a blind hash refresh.

The owned second-variety guard was updated to the verified new hash. The
following three guards are in other batches and were **left untouched under
the brief's ownership restriction**. Their counts still pass. Manager review
can use these exact old/new digests and the preservation receipt to update them:

- `2026-10-07-variety/variety-admission.test.ts:60`
  - Previous: `1b45db0ea6298306e1fd1a56ef0d3ae725a7e97faa9d09c84b53546ae550045d`
  - Current allowed revision: `c9e70075047dc680c6b5d2ca4904cca3a8806d76bcd4bba45bf36cb6ed3cc754`
  - Unrelated-record digest: `b02c2a8211b6a76f4ef3b7325c9543fb43a17d7211e9c7ff6beb5b946aa6dd23`

- `2026-10-07-level3/level3-content.test.ts:47`
  - Previous: `a5108ca54c38353b8f226075880da9b7ba97fe78b625eef2a87ade5033f8482a`
  - Current allowed revision: `b81edfec6eb8ed7a6324cb176e2e269be9db59499e0e1ef4e557db43166f09bd`
  - Unrelated-record digest: `cf76b84db4827c9863d99c42975c7e691e6fbd6bab55cb2c11a510deb3f7b8d7`

- `2026-10-10-variety-3/variety3-admission.test.ts:18`
  - Previous: `e590b21ff0dbfbbae7fba9d36659c5126a3d5dcee2abf12501eedf797a2e3866`
  - Current allowed revision: `30e7da2b9699c8d7f698c520158910cf5949f678147b55191ba9c2c6838ec8cb`
  - Unrelated-record digest: `5e456f01f237cad29e2cd783a481cf4c56e10c8f09417f60093f714e1470a2c2`

Owned `2026-10-07-variety-2/variety-admission.test.ts` current hash: `e48ec5bd0f0e3c87fc8c81757e1557963454c12a55082bb788cf95cd086c8285`. Its non-GS-028 digest remains `7e1918260ca1433b7695f6ea91144e09866b2db4fe18960acdcf7e2336a45a02`; the first-variety non-GS-028 digest remains `b02c2a8211b6a76f4ef3b7325c9543fb43a17d7211e9c7ff6beb5b946aa6dd23`.

#### Exact validation output

Complete outputs are in ignored `.local-dev/stats-ethics-p2a/` at the log paths
below. Required commands were run with the requested thread pool. The player
suite references actual GS-028 text through `chartStructuredFields.test.tsx`,
so its full suite was included. Its first invocation failed before tests in
Vite's Windows `net use` probe (`spawn EPERM`); the authorized existing preload
resolved that startup issue. The successful player run used:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS, '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs') -join ' ').Trim()
```

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1
 Test Files  3 failed | 85 passed (88)
      Tests  3 failed | 632 passed (635)
   Start at  12:57:06
   Duration  35.13s (transform 2.88s, setup 0ms, import 22.83s, tests 3.70s, environment 5ms)
Exit 1
```

Receipt: `.local-dev/stats-ethics-p2a/clinical-final.log`.

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
 Test Files  1 failed | 155 passed | 1 skipped (157)
      Tests  1 failed | 4225 passed | 2 skipped (4228)
   Start at  12:43:01
   Duration  941.19s (transform 5.07s, setup 0ms, import 75.55s, tests 852.66s, environment 8ms)
Exit 1
```

Receipt: `.local-dev/stats-ethics-p2a/domain-full.log`.

```text
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
 Test Files  245 passed (245)
      Tests  2163 passed (2163)
   Start at  12:57:06
   Duration  81.74s (transform 18.42s, setup 0ms, import 135.37s, tests 167.86s, environment 14ms)
Exit 0
```

Receipt: `.local-dev/stats-ethics-p2a/player-final.log`.

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-09-29-statistics-ethics src/development-batch/2026-10-07-variety-2 src/development-batch/2026-10-08-pediatric-clinic --pool=threads --maxWorkers=1
 Test Files  12 passed (12)
      Tests  85 passed (85)
   Start at  13:01:20
   Duration  4.48s (transform 1.41s, setup 0ms, import 3.05s, tests 554ms, environment 1ms)
Exit 0
```

Receipt: `.local-dev/stats-ethics-p2a/focused-final.log`.

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/gs028-statistics-ethics-batch.test.ts --pool=threads --maxWorkers=1
 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  13:01:20
   Duration  3.27s (transform 1.37s, setup 0ms, import 1.81s, tests 1.39s, environment 0ms)
Exit 0
```

Receipt: `.local-dev/stats-ethics-p2a/domain-focused-final.log`.

```text
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
```

All seven workspaces / eight TypeScript configurations pass. The full
clinical-content suite's only failures are the three out-of-lane historical
hash guards listed above. The final focused clinical suite and GS-028 domain
suite pass, retaining their population, safety, shuffle, count and identity
guards. All player tests pass with the existing preload.

The 941-second full domain invocation began before the final PPV complaint
cleanup and four p-value lesson clarifications. Those last edits changed only
displayed wording; all execution controls, data inputs, profiles and objectives
were already final. The final focused clinical and GS-028 gameplay commands,
full player suite and root typecheck were rerun against the final wording.
The sole aggregate domain failure's reported `ethics.ts` digest is identical
to the final file; it is the recorded-input guard described next.

The game-domain suite's Level 5 recorded-evidence check pins the pre-rewrite
bytes of these five owned content inputs: `ethics.ts`, `statistics-qi.ts`,
`statistics-variants.ts`, `patient-safety.ts`, and `assent.ts`. Each recorded
digest exactly matches this worker's starting baseline; each current digest
differs because of the authorized rewrite. Receipt:
`.local-dev/stats-ethics-p2a/level5-input-drift.json`. The worker did not edit the
Level 5 test, driver, or `tools/qa/level-five-integration-results-20261012.json`
and did not rewrite a recorded run to claim it used new inputs. Manager should
review and rerun/rebind the Level 5 evidence in its own lane (or add an explicitly
reviewed wording-only compatibility proof), preserving its original run hashes.

Additional local evidence: `baseline.json`, `hashes.json`, `preservation.json`,
`rewrite-counts.json`, `metrics.json`, `changed-paths.json`, and the final scoped
diff in `.local-dev/stats-ethics-p2a/`. They contain repository-authored synthetic
content and audit data, not source excerpts. Delivered files are UTF-8 without
BOM, LF, and contain no replacement characters. All 118 review sections and
59 humor tags resolve; restricted-topic humor checks pass. Source catalogs,
unowned batches, apps/player, scripts, Supabase and setup paths are byte-unchanged.

#### Manager next action and limits

Inspect the actual scoped diff and read all 118 variants together; accept the
wording/profile revision, then integrate the three out-of-lane clinical hashes
and the separate recorded Level 5 input proof before declaring aggregate suites
green. No new design, source, clinical-meaning or Phase 2A pairing decision is
needed. Named clinician approval remains required for exact content versions.
P2-E needs its own later worker brief. The manager owns the current-thread
handoff update and final integration/acceptance report.

**LOCAL ONLY:** no Git, installs, agents, external messages, web/source retrieval,
proprietary corpus, actual save edits, deployment or publication. No GitHub
backup was created. After acceptance the manager owns the audited checkpoint
and reminder to say **“push to GitHub”**. Launchers/origins/profiles are unchanged:
`START_GAME.cmd` → exact `http://127.0.0.1:4173` in the intended persistent profile
(`location.origin = http://127.0.0.1:4173`); the canonical remote remains
`https://melissarowlandc-afk.github.io/GamifySurgery/`
(`location.origin = https://melissarowlandc-afk.github.io`). Their saves remain
separate. No playtest pathway was substituted.

### Phase 2A — Revision 1, Sol worker handoff (2026-10-15)

Revised in place after the manager rejected the first wording pass. All **118 stories** were revised, with **112 choice-specific method rationales** replacing the shared fact-sentence pattern. The **30 concepts / 118 variants / 114 cases** and **59 situational / 59 straight** split remain. Stories are 49–60 words; visible lessons remain 45–55 words and fallbacks 20–31. The regenerated [full owner review](../reviews/stats-ethics-round2-full-20261015.md) lists every variant, humor tag, complete task, review-only key-first choices, rationales, lesson, fallback, exhibit, and existing evidence mapping.

Comedy now comes from recognizable behavior within the situation: overconfident authors and colleagues, contradictory project bureaucracy, marketing overclaims, and quoted patient wit. The prop and object-personification gags were removed; each tagged variant has a separate comic premise. Stories present the situation without narrator instructions or pre-teaching. Restricted topics remain straight. All content remains `needs_clinician_review`; manager acceptance and named clinician approval are still pending.

Revision 1 changes **11 delivered paths**: the four content files `statistics-variants.ts`, `ethics.ts`, `2026-10-07-variety-2/patient-safety.ts`, and `2026-10-08-pediatric-clinic/assent.ts`; the existing `round2-wording.test.ts`; four historical hash tests listed below; the full review; and this append. The cumulative Phase 2A delivery is **17 paths**: the prior 14 plus the three newly authorized hash tests. Main-batch content/test paths are under `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/`. The wording test now rejects story instructions, rationale sentences repeated across choices, and rationales longer than two sentences. Population, shuffle, count, safety, and identity guards remain intact. `statistics-qi.ts` and its existing contrast-claim bindings required no further revision.

Demographics are unchanged: **60 staff variants**; **58 patient decision nodes, 34 Female / 24 Male**, across 54 cases; **202 authored patient profiles, 106 Female / 96 Male**, ages **6–77** (adults **25–77**). The Spanish cases remain Female, ages 43/68. Lily Walker, 6, with Susan Walker, and Ruby Anderson, 11, with Thomas Anderson retain their exact child/parent/art identities. The four interpreter-to-consent pairs remain; P2-E pairings were not created.

The revision-only recursive comparison permits only presentation/reached-update and rationale fields: all other generated fields match the prior Phase 2A result, including profile identities/demographics, lessons, fallbacks, choices, catalogs, evidence bindings, statuses, and execution. The independent original-baseline audit also passes. For each protected release, restoring only the scoped original cases exactly reproduces its original pinned digest, and the unrelated-record digest remains identical. The three newly authorized guards and the already-owned Variety-2 guard now use these verified final digests:

| Historical guard, relative to `packages/clinical-content/src/development-batch/` | Final SHA-256 |
| --- | --- |
| `2026-10-07-variety/variety-admission.test.ts` | `6663fe0b6245984655a4bccc1bb002349233ef51f33c980aaaaeecb28f98dfd4` |
| `2026-10-07-variety-2/variety-admission.test.ts` | `e8da1a48cbd0590577be647eb3e83494dd62e3bf790028f762b450c0ce60b36d` |
| `2026-10-07-level3/level3-content.test.ts` | `45bf70ac66568f64d22b2142f23c6baf38ba7737174107eb8f98a6995e98bc25` |
| `2026-10-10-variety-3/variety3-admission.test.ts` | `94999fac638cc41647c8dd709080e0a58cbb475f69e35b0e956f8436d5e870fe` |

No new sources or claims were added, and no source-dependent teaching was newly withheld. No clinical meaning change was made. **The Level 5 recorded-input guard and its QA evidence were left untouched**, as requested. Its pinned source fingerprints predate these content rewrites; the full game-domain result below retains that one manager-owned failure. The five content-input discrepancies remain recorded separately in `.local-dev/stats-ethics-p2a/revision1/level5-input-drift.json`. The manager owns resolving that recorded-run evidence, editorial acceptance, clinician review, and the later P2-E milestone.

All final commands below ran after the last content, review, and digest updates. The player run used the existing `ignore-net-use-eperm.mjs` preload via `NODE_OPTIONS`, as on the prior sandbox-blocked run. Initial preflight caught a broad “planned analysis” wording guard and a third-party female pronoun in a mixed-sex story; both were corrected in content, with the original guards preserved. Earlier interrupted domain/player attempts are superseded by these completed final runs. Focused game-domain validation also passed **1 file / 50 tests**.

Final exact console output follows (UTF-16 log encoding and CRLF normalized for this UTF-8/LF document).

<details>
<summary>clinical: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  88 passed (88)
      Tests  635 passed (635)
   Start at  13:25:27
   Duration  34.70s (transform 2.78s, setup 0ms, import 22.64s, tests 3.61s, environment 5ms)
EXIT_CODE=0
```

</details>

<details>
<summary>domain: exit 1</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 1 failed) 261813ms
     × binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash 29ms
npm.cmd : 
At line:2 char:1
+ npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=th ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its 
current game, balance, clinical and driver inputs and reconciles cash
AssertionError: packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts: expected 
'2da4d73fe57ba9acfaec338ab3b296a0bb262…' to be '691b338edff5aa56215ee2c6a7cbd6cfd777b…' // Object.is equality

Expected: "691b338edff5aa56215ee2c6a7cbd6cfd777b713d0ad4c9fc03b41612662b420"
Received: "2da4d73fe57ba9acfaec338ab3b296a0bb262e1d0f41f750f012201c8b37ddd0"

 ❯ tests/level-five-integration.test.ts:44:71
     42|           .replace("        nextFacilityLevel: 5,\n      },\n      LEV…
     43|       }
     44|       expect(createHash("sha256").update(source).digest("hex"), file).…
       |                                                                       ^
     45|     }
     46|     expect(run.commandsReconciled).toBeGreaterThan(20_000);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 155 passed | 1 skipped (157)
      Tests  1 failed | 4225 passed | 2 skipped (4228)
   Start at  13:25:27
   Duration  918.67s (transform 5.09s, setup 0ms, import 67.28s, tests 839.95s, environment 7ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
EXIT_CODE=1
```

</details>

<details>
<summary>typecheck: exit 0</summary>

```text
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
EXIT_CODE=0
```

</details>

<details>
<summary>player: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  245 passed (245)
      Tests  2163 passed (2163)
   Start at  13:25:27
   Duration  80.61s (transform 18.46s, setup 0ms, import 133.67s, tests 165.57s, environment 14ms)
EXIT_CODE=0
```

</details>

Validation receipts, recursive revision proof, original restoration proof, source fingerprints, and the per-command raw logs are in `.local-dev/stats-ethics-p2a/revision1/`. Delivered files are UTF-8 without BOM and use LF. No Git, installs, web access, other content batches, player code, scripts, Supabase, setup documents, shared helpers, or runtime implementation were changed. The only out-of-original-lane edits are the three explicitly authorized hash guards. This remains a local shared-worktree checkpoint; the manager retains the owner reminder to say **“push to GitHub”** after acceptance.

### Level 5 evidence rebind (2026-10-15)

Completed the bounded Sol-worker validation rebind after the manager-accepted stats/ethics Revision 1 wording/profile revision. The actual reducer journey was rerun with current sources, then the established lower-checkpoint helper retained the third report from that run's progress state. Both commands exited 0. No content, reducer, persistence, balance, driver or e2e-spec edits were made. Clinical approval statuses are unchanged.

#### Files changed

- `tools/qa/level-five-integration-results-20261012.json`: fresh reducer-run summary and current input hashes; prior input hashes and compatibility provenance retained in `inputHistory[0]`.
- `tests/fixtures/level-five-integration-checkpoints-20261012.json`: all nine checkpoints regenerated by the actual journey and lower helper.
- `packages/game-domain/tests/level-five-integration.test.ts`: only the prototype-balance condition and its explanatory comment changed. The M10 strip runs only when the recorded hash is exactly `ef17332a37b98726aaee97240bb878a4b88deadfba19c4ef944f565fb9316af2`. Fresh hashes use the unmodified file. Every other assertion and guard is preserved.
- This append-only handoff section.

The unchanged runner still emits the historical literal `liveCap: 4`. After independently loading its current validated context, the result metadata was corrected to actual ordinary cap **5**. All measured run values were retained exactly. The raw post-helper output SHA-256 before this metadata/provenance addition is `bd39f96230af8bd6d8e9a704bcb13a74c6ded8f64a7a70eb965fecd876394b73`. The original result SHA-256 is `e1d628ab50c9522896564043d72facc7580570185038e64e0116c494bc4e3ff2`, also recorded in the history entry.

#### Input provenance

The current run hashes **371 inputs** directly. Compared with the previous recorded run, the five accepted content rewrites and the two already-existing M10/persistence compatibility cases account for all **7 changed fingerprints**; **364 input hashes** and the lower-helper hash are unchanged. There is no top-level `replayCompatibleInputs` exception in the fresh result. The history entry preserves all 371 original hashes, the prior artifact hash and the exact prior persistence compatibility record. The manager-supplied backups matched both starting artifacts byte for byte and were preserved. All current source/driver hashes remained stable during the replay and validation.

| Input | Previous recorded SHA-256 | Fresh-run SHA-256 |
| --- | --- | --- |
| `packages/balance-config/src/prototype-balance.ts` | `ef17332a37b98726aaee97240bb878a4b88deadfba19c4ef944f565fb9316af2` | `6d93b7092e6145ec88180c38d004cd7d5d99206d8c0fe5165b133d9e9ddde186` |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts` | `691b338edff5aa56215ee2c6a7cbd6cfd777b713d0ad4c9fc03b41612662b420` | `2da4d73fe57ba9acfaec338ab3b296a0bb262e1d0f41f750f012201c8b37ddd0` |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-qi.ts` | `7e5ff2e1a5188babf35926ff4a757ff34e22ebe158d3da0e887dd5f2a0e02958` | `e24e3454662e8728ba3bd4f896f5bcfb042625b0067431f5a56aafe4a3346476` |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-variants.ts` | `05930f006da2b398b441d4a98276ff737d2e6e92bb0928d4585a3d1ce3aae544` | `09d9650b05f2ae50891e423c49b57169cc74d99d83c0b904a84e7cdce6bdc444` |
| `packages/clinical-content/src/development-batch/2026-10-07-variety-2/patient-safety.ts` | `0e2f5808ed7446faef8a8025d5a7e7600ce633b549383c0bc3fef20867acea61` | `f28f40a4bbbe3f12374c25033863f5297f85abf8fd5be3cffa3bef26c085c32d` |
| `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/assent.ts` | `2586313a0443541d5ddf31d8c8ee20b8e3d7e90d565481fbbbfb3f8dfc9a9f5c` | `da198959d1d168dd5a1a112f9de0e08f09870f00092be0fc1859512a9129cc64` |
| `packages/game-domain/src/persistence.ts` | `516ef9549dcab7999402adc4f1d30cbe696b789cc8293c30452a6df3785aaf2f` | `4c818dc6b813864543c967754905567a8ebc6ba5b01cadec9f887bff15b134bc` |

#### Actual run summary

- Seed: `level-five-m9.integration.01`; **27,944 applied and cash-reconciled commands**, exceeding the unchanged 20,000-command guard.
- First answers: **555 total / 466 at Level 5**. Daily management rounds: **38**. Positive comfort uses: **1,031**.
- Cash, all in cents: **1,785,500 + 15,728,300 - 292,202 - 10,124,856 - 1,048,000 = 6,048,742** (opening + gross - stock - paid operating - capital = closing). Per-command and lifetime reconciliation both passed.
- XP goal tick: **15,493**. Inspection unlock: tick **16,281**, XP **2,162**, displayed satisfaction **91**, average staff morale **100**, **9** employed staff.
- Supplier savings: **2,098 stock cents / 751,140 upkeep sixtieth-cents**. Retired receipts: **5,692**; retired encounters: **423**.
- All three completed reports and every measured summary field match the previous run exactly. Higher retry is best; lower retry is latest; the first-finish report remains the first report. The script's round/comfort, supplier-savings and retirement assertions also passed.

| Report | Raw total score | Qualifying patients | Final role |
| --- | --- | --- | --- |
| First | 62.49398772204757 | 52 | Immutable first finish |
| Higher retry | 66.65755625217645 | 50 | Best completed report |
| Lower retry | 45.489710466735836 | 48 | Latest completed report |

#### Checkpoint consumers and changes

**Seven saves changed:** `integration-preparing`, `integration-running`, `integration-final`, `integration-finish`, `integration-repeat-final`, `integration-repeat`, `integration-lower-repeat`. `integration-l4` and `integration-build` are identical. All nine preserve their prior facility tick, XP, cash, facility level and inspection phase. Changes include frozen editorial wording/profiles, generated patient identity/art/name/sex/age fields, downstream labels and `retiredEncounterSummary.recentStillUses` presentation-history entries. The changed encounter/tick entries in that cache do not represent a change to the actual encounter arrival schedule. All nine saves are genuinely paused reducer snapshots.

| Scenario | Compared with backup | Tick | XP | Cash cents | Inspection phase |
| --- | --- | --- | --- | --- | --- |
| `integration-l4` | Identical | 3965 | 754 | 2656300 | No Level 5 state |
| `integration-build` | Identical | 3965 | 0 | 1608300 | locked |
| `integration-preparing` | Changed | 16282 | 2162 | 4143642 | preparing |
| `integration-running` | Changed | 16419 | 2184 | 4148611 | running |
| `integration-final` | Changed | 19338 | 2750 | 4892761 | running |
| `integration-finish` | Changed | 19339 | 2750 | 4892761 | completed |
| `integration-repeat-final` | Changed | 22995 | 3466 | 5747398 | running |
| `integration-repeat` | Changed | 22996 | 3466 | 5747398 | completed |
| `integration-lower-repeat` | Changed | 26053 | 3596 | 6048742 | completed |

`tests/e2e/level-five.spec.ts` consumes all nine scenarios, including the seven changed saves. It was not edited or run; browser acceptance belongs to the manager. The fixture factories also feed `level-five-launch.ts`, the domain integration/launch and related Level 4/5 regression tests, and player integration/launch tests. The full domain suite passed and the two focused player consumer files passed **33/33** with the refreshed saves. No previous browser pass is relabeled as fresh evidence.

#### Validation and exact output

**All requested validations passed:** game-domain **156 files passed / 1 skipped; 4,226 tests passed / 2 existing skipped; 0 failures**; clinical-content **88 files / 635 tests passed**; final root typecheck **exit 0**. Additional focused player consumers: **2 files / 33 tests passed**. All npm commands below used the existing `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload via `NODE_OPTIONS` (`--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`). The final typecheck ran after artifact regeneration. The runner/helper emitted Node's experimental TypeScript-transform warning and still exited 0.

Exact logs follow; only UTF-16 log encoding and CRLF were normalized to this UTF-8/LF document. `EXIT_CODE` lines are the command wrappers' recorded exit statuses.

<details>
<summary>Reducer journey: exit 0</summary>

```text
node tools/qa/level-five-integration-run.mjs --write

L4 10h, 114 XP
L4 20h, 210 XP
L4 30h, 334 XP
L4 40h, 450 XP
L4 50h, 566 XP
L4 60h, 692 XP
L5 70h, 52 XP
L5 80h, 146 XP
L5 90h, 250 XP
L5 100h, 366 XP
L5 110h, 472 XP
L5 120h, 566 XP
L5 130h, 682 XP
L5 140h, 786 XP
L5 150h, 880 XP
L5 160h, 996 XP
L5 170h, 1080 XP
L5 180h, 1196 XP
L5 190h, 1300 XP
L5 200h, 1416 XP
L5 210h, 1532 XP
L5 220h, 1626 XP
L5 230h, 1720 XP
L5 240h, 1816 XP
L5 250h, 1930 XP
L5 260h, 2016 XP
L5 270h, 2142 XP
Inspection 1: 62.49398772204757, 52/20
Inspection 2: 66.65755625217645, 50/20
Inspection 3: 45.489710466735836, 48/20
{
  "commands": 27944,
  "closingCashCents": 6048742,
  "xpGoalTick": 15493,
  "unlock": {
    "version": "level-five-inspection-unlock.v1",
    "earnedAtFacilityTick": 16281,
    "clinicalXp": 2162,
    "displayedSatisfaction": 91,
    "averageStaffMorale": 100,
    "employedStaffCount": 9
  },
  "snapshots": {
    "integration-l4": {
      "tick": 3965,
      "xp": 754,
      "phase": null
    },
    "integration-build": {
      "tick": 3965,
      "xp": 0,
      "phase": "locked"
    },
    "integration-preparing": {
      "tick": 16282,
      "xp": 2162,
      "phase": "preparing"
    },
    "integration-running": {
      "tick": 16419,
      "xp": 2184,
      "phase": "running"
    },
    "integration-final": {
      "tick": 19338,
      "xp": 2750,
      "phase": "running"
    },
    "integration-finish": {
      "tick": 19339,
      "xp": 2750,
      "phase": "completed"
    },
    "integration-repeat-final": {
      "tick": 22995,
      "xp": 3466,
      "phase": "running"
    },
    "integration-repeat": {
      "tick": 22996,
      "xp": 3466,
      "phase": "completed"
    }
  },
  "reports": [
    {
      "score": 62.49398772204757,
      "patients": 52
    },
    {
      "score": 66.65755625217645,
      "patients": 50
    },
    {
      "score": 45.489710466735836,
      "patients": 48
    }
  ]
}
node : (node:29280) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-run.mjs --write *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:29280) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Actual lower-retry checkpoint: exit 0</summary>

```text
node tools/qa/level-five-integration-lower.mjs

M9 lower retry checkpoint PASS: latest 45.489710466735836, best 66.65755625217645, immutable first 62.49398772204757.
node : (node:3492) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-lower.mjs *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:3492) Exp...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Full game-domain suite: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1


> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  156 passed | 1 skipped (157)
      Tests  4226 passed | 2 skipped (4228)
   Start at  14:06:30
   Duration  907.03s (transform 4.88s, setup 0ms, import 67.80s, tests 827.55s, environment 7ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Full clinical-content suite: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1


> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  88 passed (88)
      Tests  635 passed (635)
   Start at  13:45:42
   Duration  26.32s (transform 1.94s, setup 0ms, import 17.06s, tests 2.63s, environment 4ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Final root typecheck, after fixture regeneration: exit 0</summary>

```text
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

EXIT_CODE=0
```

</details>

<details>
<summary>Focused player consumers: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  14:06:30
   Duration  13.27s (transform 4.75s, setup 0ms, import 7.82s, tests 5.22s, environment 0ms)

EXIT_CODE=0
```

</details>

Validation receipts and filesystem baselines: `.local-dev/l5-evidence-rebind-20261015/` (`baseline.json`, `artifact-audit.json`, checkpoint difference receipts and raw command logs). Final artifact SHA-256: results `29702c804b77c4ddd84fcdbf4ee13318bcd0c80d4b9fd493d53be36264540b49`; checkpoints `967a91da0debd354f60a294f8007e5e7928fd6528ec8897a8d58a769317ec6b7`. Inline guard checks also verified historical switch restoration, direct fresh hashing, failure on unrelated input drift and path isolation.

**LOCAL ONLY:** no Git, agents, installs, external messages, commits, pushes, deployment or publication. The manager owns review of the actual scoped diff, browser e2e acceptance, `CURRENT_THREAD_HANDOFF.md` integration and the audited GitHub checkpoint. After acceptance, remind the owner to say **"push to GitHub"**. No browser, launcher, playtest-origin/profile or owner-save pathway changed.

### Manager acceptance - Phase 2A Revision 1 and Level 5 rebind (2026-10-15)

Revision 1 accepted editorially after manager sampling (humor now behavioral/situational, no instruction-ending or key-cueing stories, per-choice rationales distinct). Owner read-through published as a private artifact (https://claude.ai/artifact/VTmfGNEH92d4TCtdrj35Ef); owner tone feedback may still adjust wording. Level 5 evidence rebind accepted: the guard's M10 strip now applies only to the historical pre-M10 hash; history preserved in `inputHistory`. Manager reran (default configs): game-domain 156 files / 4226 passed / 2 skipped; clinical-content 88 / 635 passed; player 2163 passed earlier on the same content. Level 5 e2e: 104/104 passed with --retries=0 after restarting the stale 5184 QA dev server (it was serving a mid-edit module graph: "TesterFeedback.ts does not provide TesterFeedbackMenu"); owner 4173 and private phone origins probed in fresh contexts, no page errors. All content remains needs_clinician_review. Next: P2-E ethics-to-clinical pairings (owner decision 4 = yes).

### Level 5 evidence rebind 2 (2026-10-16)

Completed the same bounded Sol-worker evidence rebind for the manager-accepted, owner-requested colleague name pool documented in `docs/execplans/accounts-playtime-release-20261012.md`, "Colleague name pool (2026-10-16)". The actual journey was rerun from its existing funded synthetic Level 4 opening with the current sources and original seed. The established lower helper then retained the actual third-result progress state. Both commands exited 0, and all existing journey/guard assertions were kept.

#### Files changed and preserved scope

- `tools/qa/level-five-integration-results-20261012.json`: regenerated run summary and all current source/driver hashes. Appended the previous run as `inputHistory[1]`; `inputHistory[0]` is preserved exactly. There are now two history entries.
- `tests/fixtures/level-five-integration-checkpoints-20261012.json`: regenerated all nine actual reducer checkpoints, including the lower retry.
- This append-only handoff section.

**The guard test was not edited.** Its SHA-256 remains `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`. No checks were loosened or skipped. Name-pool/source implementation, clinical content, e2e specs, runner/helper scripts and clinical-review statuses were not changed. The e2e spec and lower-helper hashes were also verified against this task's filesystem baseline.

As in rebind 1, the unchanged runner emits the historical literal `liveCap: 4`, while its current independently loaded validated context uses ordinary cap **5**. Only that metadata label was corrected alongside the history append; all measured values were retained exactly. The fresh helper output SHA-256 before metadata/history addition was `f55cef596d2b526bb5e5e351884d2e2f500aa005ebc0fa1f984cc6203eb15b39`.

#### Previous and fresh input hashes

The previous run had **371** recorded inputs; the fresh run records **373**. **Six existing hashes changed**, **two inputs are newly recorded**, **365 existing hashes are unchanged**, and no input was removed. The two newly recorded inputs are `colleagueNames.ts` and `namePresentationProfiles.ts`; neither had a hash in the prior recorded input map. Every changed/new input is in the accepted name-pool source lane. All current clinical-content, balance and driver hashes are unchanged from the previous run.

`inputHistory[1]` preserves the previous run's complete 371-entry `inputs` map, helper fingerprint, seed, version, actual cap metadata and result-file SHA-256 `29702c804b77c4ddd84fcdbf4ee13318bcd0c80d4b9fd493d53be36264540b49`. The earlier history entry, including its historical compatibility provenance, remains unchanged. The new top-level `inputs` map directly hashes both new modules and every other current input; no compatibility exception was added. Source hashes remained stable during replay and validation.

| Input | Previous recorded SHA-256 | Fresh-run SHA-256 |
| --- | --- | --- |
| `packages/game-domain/src/appearance.ts` | `26af78ca27eb78a9749590d2b84d546ec7f9f5654f339493820a2ebfcfd659c9` | `bef418db571fcef7a6f8a4b082e04eade2cdb6d80f5b68b6ee4a87c22da19ebb` |
| `packages/game-domain/src/colleagueNames.ts` | Not recorded in previous run | `50103eb51f76024227355afe4a42641e1c7e5ab12bce6cb36e779f85db140c54` |
| `packages/game-domain/src/gift-retail.ts` | `bcabcce2ddfd206de8db03bb56eb4afb264e8051db4a380e9fcc77cb11db433b` | `aeb94dc7ea1e6931ce9d03d6d7c1d48a2e68cce8a9bbdffd72e4f5f4a652946c` |
| `packages/game-domain/src/index.ts` | `54d11f5d506212abce8ecaf5ba2c9519a5fe59e0b20f8aebcba5169a6c971ed5` | `3045ff30cb0cf9701d6220ac506135db811a206e112fba788fa90c58b18bfa7b` |
| `packages/game-domain/src/namePresentationProfiles.ts` | Not recorded in previous run | `43dfc3014aa765a30b605c994072ecc0e29a16bcd7df1689fb020c659757766d` |
| `packages/game-domain/src/reducer.ts` | `93d5aaed766fd61e9af616d368478669ed98973b577e11a6b28e290b07659bd5` | `daf3be68ec8134205113fc7be6136b5a0fdcf7b3d93149a9ffeab83c7599d1f6` |
| `packages/game-domain/src/retail-operations.ts` | `b6d0686be7e077f8dcae425745f8755287cac889d265bb66b15b4fd60f1d4f1c` | `34011b67347d16b374185dc081d0596685c3eebbd42be12ce89aeaf5429295f5` |
| `packages/game-domain/src/service-operations.ts` | `9b0c8232faccc272ae3d17d3457980d14594cdd2a24cd7ad5ffa090c7db8712e` | `8c264588a14c70845ca06a5cec3322a7ec7239727e3581c678f7291c4a3770c4` |

#### Actual run numbers

- Seed: `level-five-m9.integration.01`; **27,944 applied and cash-reconciled commands**, exceeding the unchanged 20,000-command guard.
- First answers: **555 total / 466 at Level 5**. Completed daily rounds: **38**. Positive comfort uses: **1,031**.
- Cash, all in cents: **1,785,500 + 15,728,300 - 292,202 - 10,124,856 - 1,048,000 = 6,048,742** (opening + gross - stock - paid operating - capital = closing). Per-command and lifetime reconciliation passed.
- XP goal tick **15,493**; inspection unlock tick **16,281**, with **2,162 XP / 91 displayed satisfaction / 100 average staff morale / 9 employed staff**.
- Supplier savings: **2,098 stock cents / 751,140 upkeep sixtieth-cents**. Retired receipts **5,692**; retired encounters **423**.
- Every measured summary field and all three completed report objects are identical to the previous run. The best completed report is the higher retry; latest is the lower retry; the first-finish report remains the original first report. All round/comfort, supplier-savings, retirement and checkpoint pause assertions passed.

| Report | Raw total score | Qualifying patients | Final role |
| --- | --- | --- | --- |
| First | 62.49398772204757 | 52 | Immutable first finish |
| Higher retry | 66.65755625217645 | 50 | Best completed report |
| Lower retry | 45.489710466735836 | 48 | Latest completed report |

#### Changed checkpoint saves and consumers

**All nine checkpoint saves changed.** The exact comparison found **64 changed string values**: `displayName` 27, `patientDisplayName` 4, `presentation` 10, `stem` 4, and `message` 19. These are names and text containing the names. No fields were added/removed, and every non-string value is unchanged. All nine saves preserve their prior tick, XP, cash, facility level, inspection phase, clinical IDs and report state.

| Changed scenario | Tick | XP | Cash cents | Inspection phase |
| --- | --- | --- | --- | --- |
| `integration-l4` | 3965 | 754 | 2656300 | No Level 5 state |
| `integration-build` | 3965 | 0 | 1608300 | locked |
| `integration-preparing` | 16282 | 2162 | 4143642 | preparing |
| `integration-running` | 16419 | 2184 | 4148611 | running |
| `integration-final` | 19338 | 2750 | 4892761 | running |
| `integration-finish` | 19339 | 2750 | 4892761 | completed |
| `integration-repeat-final` | 22995 | 3466 | 5747398 | running |
| `integration-repeat` | 22996 | 3466 | 5747398 | completed |
| `integration-lower-repeat` | 26053 | 3596 | 6048742 | completed |

`tests/e2e/level-five.spec.ts` consumes all nine changed saves. It was not edited or run. The launch fixture factory and domain/player integration/launch tests also consume these checkpoints. The full domain suite and the focused player integration/launch tests passed with the regenerated saves. Manager browser acceptance should use the refreshed fixtures; no earlier browser result is claimed as new evidence.

#### Validation and exact output

**All requested validations passed:** game-domain **157 files passed / 1 skipped; 4,245 tests passed / 2 existing skipped; 0 failures**; root typecheck **exit 0**. Additional focused player consumers: **2 files / 33 tests passed**. All npm commands below used the existing `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload through `NODE_OPTIONS` (`--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`). Typecheck and both test commands ran after artifact regeneration/history preservation. The runner and helper emitted Node's experimental TypeScript-transform warning and still exited 0.

Exact output follows. Only UTF-16 log encoding and CRLF were normalized for this UTF-8/LF document. `EXIT_CODE` lines are the wrappers' recorded exit statuses.

<details>
<summary>Actual reducer journey: exit 0</summary>

```text
node tools/qa/level-five-integration-run.mjs --write

L4 10h, 114 XP
L4 20h, 210 XP
L4 30h, 334 XP
L4 40h, 450 XP
L4 50h, 566 XP
L4 60h, 692 XP
L5 70h, 52 XP
L5 80h, 146 XP
L5 90h, 250 XP
L5 100h, 366 XP
L5 110h, 472 XP
L5 120h, 566 XP
L5 130h, 682 XP
L5 140h, 786 XP
L5 150h, 880 XP
L5 160h, 996 XP
L5 170h, 1080 XP
L5 180h, 1196 XP
L5 190h, 1300 XP
L5 200h, 1416 XP
L5 210h, 1532 XP
L5 220h, 1626 XP
L5 230h, 1720 XP
L5 240h, 1816 XP
L5 250h, 1930 XP
L5 260h, 2016 XP
L5 270h, 2142 XP
Inspection 1: 62.49398772204757, 52/20
Inspection 2: 66.65755625217645, 50/20
Inspection 3: 45.489710466735836, 48/20
{
  "commands": 27944,
  "closingCashCents": 6048742,
  "xpGoalTick": 15493,
  "unlock": {
    "version": "level-five-inspection-unlock.v1",
    "earnedAtFacilityTick": 16281,
    "clinicalXp": 2162,
    "displayedSatisfaction": 91,
    "averageStaffMorale": 100,
    "employedStaffCount": 9
  },
  "snapshots": {
    "integration-l4": {
      "tick": 3965,
      "xp": 754,
      "phase": null
    },
    "integration-build": {
      "tick": 3965,
      "xp": 0,
      "phase": "locked"
    },
    "integration-preparing": {
      "tick": 16282,
      "xp": 2162,
      "phase": "preparing"
    },
    "integration-running": {
      "tick": 16419,
      "xp": 2184,
      "phase": "running"
    },
    "integration-final": {
      "tick": 19338,
      "xp": 2750,
      "phase": "running"
    },
    "integration-finish": {
      "tick": 19339,
      "xp": 2750,
      "phase": "completed"
    },
    "integration-repeat-final": {
      "tick": 22995,
      "xp": 3466,
      "phase": "running"
    },
    "integration-repeat": {
      "tick": 22996,
      "xp": 3466,
      "phase": "completed"
    }
  },
  "reports": [
    {
      "score": 62.49398772204757,
      "patients": 52
    },
    {
      "score": 66.65755625217645,
      "patients": 50
    },
    {
      "score": 45.489710466735836,
      "patients": 48
    }
  ]
}
node : (node:24556) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-run.mjs --write *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:24556) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Actual lower-retry checkpoint: exit 0</summary>

```text
node tools/qa/level-five-integration-lower.mjs

M9 lower retry checkpoint PASS: latest 45.489710466735836, best 66.65755625217645, immutable first 62.49398772204757.
node : (node:2176) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-lower.mjs *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:2176) Exp...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Full game-domain suite: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1


> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  157 passed | 1 skipped (158)
      Tests  4245 passed | 2 skipped (4247)
   Start at  19:04:14
   Duration  893.58s (transform 4.85s, setup 0ms, import 66.48s, tests 816.28s, environment 7ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Root typecheck, after artifact regeneration: exit 0</summary>

```text
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

EXIT_CODE=0
```

</details>

<details>
<summary>Focused player consumers: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  19:04:14
   Duration  12.80s (transform 4.64s, setup 0ms, import 7.53s, tests 5.11s, environment 0ms)

EXIT_CODE=0
```

</details>

Filesystem baselines, original artifact copies, comparison receipts and raw command logs are in `.local-dev/l5-evidence-rebind-20261016/`. Original checkpoints SHA-256: `967a91da0debd354f60a294f8007e5e7928fd6528ec8897a8d58a769317ec6b7`; final checkpoints: `5e2d00d66d63e60903cab57514a5fbd6f33208fb02fa17834948f9427f5eae33`; final result: `ad1e949b2f9878421abc1504cae246f0a4388825e3644feaa85e5578a3d0881a`. Final checks verified both history entries, every current input, the unchanged guard/helper/e2e spec, and UTF-8 without BOM / LF for the delivered files. The existing plan prefix is preserved byte for byte.

**LOCAL ONLY:** no Git, agents, installs, external messages, commits, pushes, deployment or publication. The manager owns scoped diff review, browser e2e acceptance, current-thread handoff integration and the audited GitHub checkpoint/reminder to say **"push to GitHub"**. No browser, launcher, playtest-origin/profile or owner-save pathway changed.

## Round 3 full pass (2026-10-16)

**Status:** bounded worker delivery for manager integration and clinical review. The approved sample direction is applied to the complete focused bank. All rewritten question variants and case reviews remain `needs_clinician_review`; owner approval of the samples was not a clinical version sign-off.

The complete owner-readable review is regenerated at `docs/reviews/stats-ethics-round2-full-20261015.md` under the round 3 title. Each item has its diagnosis anchor, complaint, named/aged/sexed clinical story, exhibit, self-contained question, review-only key-first choices, per-choice rationales, visible lesson, distinct fallback, humor tag and existing claim/source bindings. Runtime answers remain shuffled.

| Content lane | Concepts | Variants rewritten | Situational / straight |
| --- | --- | --- | --- |
| Main statistics/QI | 18 | 72 | 46 / 26 |
| Main ethics | 10 | 40 | 12 / 28 |
| RCA/FMEA | 1 | 4 | 0 / 4 |
| Developmental assent | 1 | 2 | 1 / 1 |
| Total | 30 | 118 | 59 / 59 |

Materialized stories are 53–60 words; visible lessons 47–55; distinct fallbacks 21–31. Every choice has its own one- or two-sentence rationale; the rationale-repeat guard remains. Humor targets professional behavior, research promotion or bureaucracy, with separate premises and no jokes in choices. Capacity, surrogate decisions, DNR, disclosure, clinician fitness and coercion remain straight.

**Clinical and numerical decisions.** The oncology exercises use recurrence after localized colon-cancer resection over two, three or five years, with the horizon stated in the vignette, question, choices and exhibit. The new antibody is unnamed and investigational. Surgical-device exercises use SSI, hernia recurrence or direct wound-healing outcomes. The continuous/ordinal methods use the registered superficial-SSI/open-wound and secondary-intention claims for wound area, depth, completed uncensored healing time or explicitly protocol-defined ratings. This replaces the samples’ hospital-stay/recovery proxies under the manager’s natural-outcome correction. The CI difference example is a two-year recurrence risk difference in percentage points; its null-value objective is unchanged. Blood-screen accuracy is explicitly for breast cancer in separate invented validation cohorts, while suspicious-mass clinical assessment and planned tissue sampling remain distinct.

Every invented numerical observation is attached to an unnamed investigational antibody, blood test or device. Accepted-practice hair-preparation projects have no fabricated efficacy numbers. All original table cells and numerical key/value inputs are retained; captions, units, outcome labels and follow-up context now fit the clinical question. No real drug, trial, guideline or established test receives invented performance. Hospital operative scenes describe the clinical decision under discussion and do not add onsite procedures or change clinic capability contracts.

**Evidence:** 88 existing atomic claims and 57 existing source records support the focused questions. Cross-batch diagnosis/care bindings resolve to the admitted catalog and their reciprocal sources; existing records are referenced without duplication. The complete catalog remains 734 claims / 452 sources with unchanged statements, source metadata, access/check dates, reuse status and review status. The sole metadata edit generalizes the existing ARR limitation from a fixed 30-day horizon to the stated follow-up horizon, as explicitly authorized; the atomic time-horizon principle is unchanged. Previously approved breast-imaging and enterotomy claims retain their original named clinical reviews. No new question is promoted by those context bindings.

**Age/sex distribution.** Across all 118 clinical decision vignettes, including the named cases in employee discussions and counting each reached consent node, there are 64 Female and 54 Male patients, ages 6–77. Counting the four Female interpreter/consent pairs once gives 114 case patients: 60 Female / 54 Male. The preserved game participant contract remains 60 employee-hosted discussions plus 54 patient cases (58 patient decision nodes). Patient case defaults are 30 Female / 24 Male; those nodes are 34 Female / 24 Male. The 202 existing patient instantiation profiles remain 106 Female / 96 Male. All profile IDs and age/sex pairs are unchanged from the start of this round. The clinical patients in the 60 staff discussions are separate from their staff hosts and contribute 30 Female / 30 Male to the vignette distribution.

Clinical vignette age/sex counts by decision node:

| Age (years) | Female | Male |
| --- | --- | --- |
| 6 | 1 | 0 |
| 11 | 1 | 0 |
| 28 | 1 | 0 |
| 29 | 1 | 2 |
| 32 | 2 | 0 |
| 33 | 0 | 1 |
| 34 | 0 | 1 |
| 35 | 0 | 3 |
| 36 | 1 | 0 |
| 38 | 0 | 1 |
| 39 | 0 | 1 |
| 40 | 1 | 0 |
| 41 | 1 | 0 |
| 42 | 0 | 2 |
| 43 | 4 | 1 |
| 44 | 0 | 1 |
| 45 | 2 | 1 |
| 46 | 3 | 1 |
| 47 | 3 | 1 |
| 48 | 0 | 3 |
| 49 | 1 | 1 |
| 50 | 1 | 0 |
| 51 | 0 | 4 |
| 52 | 0 | 2 |
| 53 | 0 | 2 |
| 54 | 1 | 1 |
| 55 | 0 | 2 |
| 56 | 4 | 1 |
| 57 | 1 | 1 |
| 58 | 2 | 5 |
| 59 | 1 | 1 |
| 60 | 1 | 1 |
| 61 | 4 | 1 |
| 62 | 1 | 1 |
| 63 | 1 | 2 |
| 64 | 2 | 0 |
| 65 | 2 | 0 |
| 66 | 2 | 0 |
| 67 | 1 | 2 |
| 68 | 6 | 2 |
| 69 | 4 | 0 |
| 70 | 1 | 1 |
| 71 | 3 | 0 |
| 72 | 2 | 1 |
| 73 | 1 | 1 |
| 74 | 1 | 2 |
| 77 | 0 | 1 |

Spanish-interpreter and reached-consent identities retain Female ages 43/68 and the same four existing sequences. Lily Walker remains age 6, Female, with mother Susan Walker present and art `level3-roster-v2.021`; Ruby Anderson remains age 11, Female, with father Thomas Anderson present and art `level3-roster-v2.027`. Their anchors are pediatric groin/epigastric hernia discussion, without new repair-age or legal-consent rules.

**Frozen-save and scope proof.** All 30 concept IDs/objectives, 118 question IDs, choice IDs/correctness, 114 case IDs, instantiation profile IDs/demographics, participant/host contracts, facility stages, capability/settings gates, service/timing classifications, reward fields and terminal behavior are preserved. Displayed terminal clinical rationales follow the rewritten fallback. All prior evidence bindings remain. The four interpreter-to-consent sequences are retained; no P2-E pairing was created. The focused game-domain consumer passed 50 tests.

The original pre-Phase-2A case restoration audit independently reproduces each original whole-release digest by restoring only the scoped cases. The unrelated-record digests are identical to the earlier proof. Only the four expressly authorized clinical-content historical guards are rebound:

| Historical guard | Final digest | Unrelated-record digest |
| --- | --- | --- |
| beforeVariety1 | a42d72dad52c28c5e65ad684644ccf19bb5c91a46bfac0bb73c95224eae97832 | b02c2a8211b6a76f4ef3b7325c9543fb43a17d7211e9c7ff6beb5b946aa6dd23 |
| beforeVariety2 | 2d6882a224724ea2cc2c243e39c06e324005640e96c606d133fe7b43b382b53f | 7e1918260ca1433b7695f6ea91144e09866b2db4fe18960acdcf7e2336a45a02 |
| level3ProtectedIntake | c7604c5cda0f1d8312e457b51140f2e66c120e6e3a0b32b3b99ca8c863f3cb4b | cf76b84db4827c9863d99c42975c7e691e6fbd6bab55cb2c11a510deb3f7b8d7 |
| beforeVariety3 | efe8f6c946aa343618c9eb3328bcf0ef45530822adf97e073511418797f7a716 | 5e456f01f237cad29e2cd783a481cf4c56e10c8f09417f60093f714e1470a2c2 |

Files changed (including this appended handoff):

- `docs/execplans/gs028-stats-ethics-overhaul-20261007.md`
- `docs/reviews/stats-ethics-round2-full-20261015.md`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/clinical-anchor-test-catalog.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/round2-wording.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-ethics-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-qi.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-qi.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-variants.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-level3/level3-content.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety-2/full-batch-content.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety-2/patient-safety.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety-2/remaining10-content.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety/variety-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/assent.ts`
- `packages/clinical-content/src/development-batch/2026-10-10-variety-3/variety3-admission.test.ts`

The new test catalog helper resolves cross-batch bindings against existing exports. Provenance tests retain their local catalog count/uniqueness/bidirectional checks and additionally resolve question context claims with reciprocal source checks. New checks cover all 118 diagnosis bindings, the separate patient/employee identities, honest investigational exhibits, recurrence endpoints and stated ARR horizons. Count, population, profile, identity, shuffle, pediatric safety and clinician-review guards are retained. No game-domain source or test change was needed.

Feedback was checked against the reached-node facts as well as the original claim: the interpreter case concerns core biopsy, the final consent case retains the companion/transport threat and private refusal used by its rationales, and Ruby explicitly says she does not understand the plan. The acute-cholecystitis consent lesson refers to the planned operation rather than calling it elective.

**Level 5 and concurrency.** No game-domain source, colleague-name file/test, Level 5 result, checkpoint fixture or recorded-input guard was edited. Against the starting filesystem snapshot, the audit observed no changed paths outside this lane. The root-level checkpoint also matches the manager’s pre-existing accepted digest. The full domain run has only the expected recorded-input check failure; the manager owns the combined rebind after both workers.

The recorded-input comparison has exactly six changed paths: the five owned content sources (`statistics-variants.ts`, `statistics-qi.ts`, `ethics.ts`, `patient-safety.ts`, `assent.ts`) and the separate worker’s `packages/game-domain/src/colleagueNames.ts`. The read-only comparison is saved as `.local-dev/stats-ethics-round3-full/pinned-input-drift.json`; it does not alter any evidence.

- `packages/game-domain/tests/level-five-integration.test.ts`: `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`.
- `tools/qa/level-five-integration-results-20261012.json`: `ad1e949b2f9878421abc1504cae246f0a4388825e3644feaa85e5578a3d0881a`.
- `tests/fixtures/level-five-integration-checkpoints-20261012.json`: `5e2d00d66d63e60903cab57514a5fbd6f33208fb02fa17834948f9427f5eae33`.

**Withheld / NEEDS SOURCE.** Retained surgical sponge remains withheld: no existing authored claim supports it. The supported verified-enterotomy event is used for the operative disclosure sample; the other disclosure variants retain medication/specimen/chart-error objectives with catalog diagnosis anchors. Metastatic colon-cancer regimens, molecular eligibility, real biologic efficacy, established-test performance, personal outcome probabilities, new exact clinical thresholds and procedure-specific benefits/harms remain withheld. Existing source limitations (including older/single-source material and institution/jurisdiction-dependent ethics) remain. `withheld.pediatric-clinic.adolescent-confidentiality` remains withheld. No new source was fetched or invented.

**Exact final validation output.** Required commands ran from the repository root after the final content, tests, guards and full review were generated. The player suite was also run because `chartStructuredFields.test.tsx` consumes GS-028 feedback and legacy saves. Its existing `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload was supplied through `NODE_OPTIONS` for the known sandbox `net use` EPERM; no preload or dependency was changed.

<details>
<summary>Clinical content — exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1


> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  88 passed (88)
      Tests  637 passed (637)
   Start at  22:33:08
   Duration  35.31s (transform 2.88s, setup 0ms, import 23.85s, tests 3.64s, environment 5ms)
EXIT_CODE=0
```

</details>

<details>
<summary>Game domain — exit 1, expected recorded-input guard only</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1


> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 1 failed) 257575ms
     × binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash 28ms
npm.cmd : 
At line:2 char:1
+ npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=th ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its 
current game, balance, clinical and driver inputs and reconciles cash
AssertionError: packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts: expected 
'2233cab83fdc81f6847edc79990bf00c51d18…' to be '2da4d73fe57ba9acfaec338ab3b296a0bb262…' // Object.is equality

Expected: "2da4d73fe57ba9acfaec338ab3b296a0bb262e1d0f41f750f012201c8b37ddd0"
Received: "2233cab83fdc81f6847edc79990bf00c51d18f74e95ee8e885cb30aa8c82dbc8"

 ❯ tests/level-five-integration.test.ts:47:71
     45|           .replace("        nextFacilityLevel: 5,\n      },\n      LEV…
     46|       }
     47|       expect(createHash("sha256").update(source).digest("hex"), file).…
       |                                                                       ^
     48|     }
     49|     expect(run.commandsReconciled).toBeGreaterThan(20_000);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 156 passed | 1 skipped (158)
      Tests  1 failed | 4244 passed | 2 skipped (4247)
   Start at  22:33:08
   Duration  908.33s (transform 5.07s, setup 0ms, import 67.54s, tests 830.22s, environment 7ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
EXIT_CODE=1
```

</details>

<details>
<summary>Workspace typecheck — exit 0</summary>

```text
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
EXIT_CODE=0
```

</details>

<details>
<summary>Player consumers — exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads


> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  245 passed (245)
      Tests  2166 passed (2166)
   Start at  22:33:08
   Duration  79.77s (transform 18.30s, setup 0ms, import 132.17s, tests 165.35s, environment 14ms)
EXIT_CODE=0
```

</details>

Filesystem baselines, original case snapshots, generated current records, numerical/identity checks, catalog comparison, restoration receipts and raw validation logs are in `.local-dev/stats-ethics-round3-full/`. Delivered files are UTF-8 without BOM with LF line endings. This append preserves the prior ExecPlan prefix byte for byte.

**LOCAL ONLY:** no Git, agents, installs, web access, external messages, commits, pushes, deployment, publication, browser/profile/origin changes or save migration. Manager responsibilities remain scoped review/acceptance, the combined Level 5 evidence rebind, clinician review, current-thread handoff integration and the audited GitHub checkpoint/reminder to say **"push to GitHub"**. No additional owner design decision is needed for this content pass.

## Round 3 revision 1 (2026-10-16)

**Status:** bounded worker revision for manager review. The anchor-repetition correction is implemented across the 118-variant bank. All rewritten questions and case reviews remain `needs_clinician_review`; no new approval or release is implied.

**Counts:** 30 concepts, 118 variants, 114 existing cases and four existing interpreter → consent sequences. This revision changes 114 question records/stories. Four already suitable vignettes retain their wording: surrogate-decisions v1, perioperative-dnr v1, error-disclosure v1 and Lily’s assent v1. The complete review still covers every variant. No P2-E pairing was created.

**Anchor distribution:** 73 diagnosis groups, maximum 4 per diagnosis (cap 10); 54 investigational premise groups, maximum 6 (cap 6). No two variants of any concept share a diagnosis. The normalization groups childhood/adult inguinal hernia together, and the enterotomy event with incisional hernia. Repeated topical agents and cancer biologics share premise keys across diseases. Closure-device scenarios: zero.

The full catalog sweep loaded 249 authored modules across approved-data, pilot-data and all development batches, with no load failures. It inventoried 411 authored concepts/clinical contexts, 766 distinct claims and 452 sources, including records outside the public index. The revised bank uses existing GI, endocrine, breast, skin, oncology, vascular, critical-care, anesthesia, gynecologic, immunologic, transplant and pediatric contexts. The full review includes the complete authored inventory, both bank-wide distribution tables, and the 30-topic register.

Investigations include unnamed drugs, diagnostic tests, devices, techniques, care pathways and a screening program. Endpoints fit the clinical question: recurrence, leak, SSI, repeat drainage, diagnostic accuracy, healing or an appropriate physiologic measurement. Invented numbers and protocol assumptions stay attached to the unnamed investigation. No established drug, test, trial or guideline receives invented performance. ARR/NNT cells and stated horizons, all other table cells and numerical key/value inputs retain their prior values.

Staff methods discussions now start with the named staff lead and a real clinical research question; they contain no second named patient introduction. Patient encounters retain their own diagnosis, age, sex and decision. Context-specific feedback was aligned with the new clinical quantities and procedures; study-design feedback and the four QI measure lessons address different structures or misconceptions.

| Lane | Concepts | Variants covered | Situational / straight |
| --- | --- | --- | --- |
| Statistics/QI | 18 | 72 | 46 / 26 |
| Ethics | 10 | 40 | 12 / 28 |
| RCA/FMEA | 1 | 4 | 0 / 4 |
| Developmental assent | 1 | 2 | 1 / 1 |
| Total | 30 | 118 | 59 / 59 |

Materialized review stories: 55–60 words; visible lessons: 47–55; distinct fallbacks: 21–31. Per-choice rationales remain one or two sentences and address their own choice. The 59/59 humor split is retained, with behavioral comedy and no jokes in answer choices. Restricted topics remain straight.

**Evidence:** 170 existing atomic claims resolve to 165 existing sources for the focused bank. All 734 exported claims and 452 source records exactly match the prior full round-3 catalog, including the already generalized ARR horizon limitation. There are no new sources, claim statements, access/check dates or review-status changes. Original method/ethics bindings are retained; superseded diagnosis-only bindings are replaced by the new anchors. Existing approved claims retain their named version reviews; rewritten content remains draft.

**Patient profiles:** 60 employee discussions remain employee discussions at the existing host/stage gate. There are 54 patient cases and 58 patient nodes: case defaults 30 Female / 24 Male, node defaults 34 Female / 24 Male, and 202 preserved patient profiles comprising 106 Female / 96 Male. Patient-node default ages span 6–77 years. Staff discussions have no patient demographics. All profile IDs and age/sex pairs are unchanged.

Patient age/sex counts by decision node, including reached consent nodes:

| Age | Female | Male |
| --- | --- | --- |
| 6 | 1 | 0 |
| 11 | 1 | 0 |
| 28 | 1 | 0 |
| 29 | 1 | 2 |
| 32 | 2 | 0 |
| 33 | 0 | 1 |
| 35 | 0 | 3 |
| 36 | 1 | 0 |
| 38 | 0 | 1 |
| 40 | 1 | 0 |
| 42 | 0 | 1 |
| 43 | 4 | 0 |
| 45 | 2 | 0 |
| 46 | 2 | 0 |
| 47 | 2 | 0 |
| 48 | 0 | 2 |
| 51 | 0 | 3 |
| 54 | 0 | 1 |
| 56 | 3 | 0 |
| 58 | 1 | 3 |
| 61 | 3 | 0 |
| 63 | 0 | 1 |
| 67 | 0 | 1 |
| 68 | 4 | 1 |
| 69 | 2 | 0 |
| 71 | 2 | 0 |
| 72 | 1 | 0 |
| 73 | 0 | 1 |
| 74 | 0 | 2 |
| 77 | 0 | 1 |

Spanish cases and their reached consent nodes retain Female ages 43/68 and the same paired identities. Lily Walker remains age 6, Female, with mother Susan Walker and art `level3-roster-v2.021`; Ruby Anderson remains age 11, Female, with father Thomas Anderson and art `level3-roster-v2.027`. Both parents remain in the same room. Lily retains the nonurgent groin-bulge assessment; Ruby’s nonurgent observation discussion now concerns uncomplicated reactive cervical nodes. No repair-age, adolescent privacy or universal legal-consent rule was added.

**Frozen-save and scope proof:** all concept IDs/objectives, question and choice IDs, correctness, case IDs, profile IDs/demographics, participant contracts, facility/capability/settings gates, services/timing, rewards and terminal behavior are preserved. Displayed terminal clinical rationales follow their revised fallbacks. Three `no_terminal_outcome` narratives automatically quote the revised allergy-record choice labels; the audit verifies that exact generated-label relationship before normalizing those display strings. No clinical behavior was excluded from comparison. The focused game-domain consumer passed 50 tests.

Restoring only the original scoped cases recreates all four original pre-Phase-2A protected release hashes. Unrelated records retain their earlier digests. The only historical hash updates are the four authorized clinical-content guards:

| Guard | Verified final SHA-256 | Unrelated-record SHA-256 |
| --- | --- | --- |
| beforeVariety1 | 7f37f52ed571295a6d463e76ee7f4de121a2862f9ddec32ce1d0801438e0460b | b02c2a8211b6a76f4ef3b7325c9543fb43a17d7211e9c7ff6beb5b946aa6dd23 |
| beforeVariety2 | ae2e3c2d2bd64d280632279f066508a12bb5905a96f4ef2c2c2812815b86f9ab | 7e1918260ca1433b7695f6ea91144e09866b2db4fe18960acdcf7e2336a45a02 |
| level3ProtectedIntake | 284dc7a272a79f441e834f81c33a3027587eec57d1d37929bca986c61661694c | cf76b84db4827c9863d99c42975c7e691e6fbd6bab55cb2c11a510deb3f7b8d7 |
| beforeVariety3 | a559b47f3470797900b15a1033acdc5374c64030025838ab945666935e8758c1 | 5e456f01f237cad29e2cd783a481cf4c56e10c8f09417f60093f714e1470a2c2 |

Tests now check the three whole-bank caps, all six investigational categories, real diagnosis language and supporting claims in both patient and staff stories, separate employee/patient contracts, honest exhibits, full review coverage and reached-node identities. Local catalog counts, population, shuffle, safety, source reciprocity, numeric calculations and pediatric identity guards remain. The catalog helper resolves context claims from the complete exported catalog instead of a selected group of batches.

**Files changed in this revision (including this append):**

- `docs/execplans/gs028-stats-ethics-overhaul-20261007.md`
- `docs/reviews/stats-ethics-round2-full-20261015.md`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/clinical-anchor-test-catalog.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/round2-wording.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-qi.test.ts`
- `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-variants.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-level3/level3-content.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety-2/patient-safety.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety/variety-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/assent.ts`
- `packages/clinical-content/src/development-batch/2026-10-10-variety-3/variety3-admission.test.ts`

**Concurrency and Level 5:** filesystem hashes show no changed path outside this lane. No game-domain source, colleague-name file/test, player source, Level 5 result, root checkpoint fixture or recorded-input guard was edited. The domain suite’s sole failure is the expected Level 5 recorded-input binding check. The manager retains the combined evidence rebind after both workers. Preserved Level 5 files:

- `packages/game-domain/tests/level-five-integration.test.ts` — `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`.
- `tools/qa/level-five-integration-results-20261012.json` — `ad1e949b2f9878421abc1504cae246f0a4388825e3644feaa85e5578a3d0881a`.
- `tests/fixtures/level-five-integration-checkpoints-20261012.json` — `5e2d00d66d63e60903cab57514a5fbd6f33208fb02fa17834948f9427f5eae33`.

**Withheld / NEEDS SOURCE:** retained surgical sponge remains withheld. The existing recognized, securely repaired enterotomy supports the operative disclosure context; no general inference of negligence from enterotomy is taught. Metastatic/molecular treatment rules, real investigational efficacy, established-test performance, individual risk estimates, new exact clinical thresholds and jurisdiction-specific consent/privacy rules remain outside this rewrite. `withheld.pediatric-clinic.adolescent-confidentiality` remains withheld. No additional new-source item is needed for the vignettes as written. Existing single-source, dated-source and institutional/jurisdiction limitations remain.

**Exact final validation output:** the required commands ran from the repository root against the final content, tests, hash guards and regenerated review. The player suite also ran because its GS028 feedback/legacy-save consumer references these texts. Player used the existing `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload through `NODE_OPTIONS` for the known sandbox `net use` EPERM, then restored the previous value; the preload was not edited.

<details>
<summary>Clinical content — exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1


> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  88 passed (88)
      Tests  638 passed (638)
   Start at  23:16:49
   Duration  35.65s (transform 2.97s, setup 0ms, import 24.04s, tests 3.71s, environment 6ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Game domain — exit 1; expected recorded-input failure only</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1


> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 1 failed) 257243ms
     × binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash 39ms
npm.cmd : 
At line:2 char:1
+ npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=th ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its 
current game, balance, clinical and driver inputs and reconciles cash
AssertionError: packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts: expected 
'1c6d65c0c9c9ac4b6e159f6b3a4365c50e823…' to be '2da4d73fe57ba9acfaec338ab3b296a0bb262…' // Object.is equality

Expected: "2da4d73fe57ba9acfaec338ab3b296a0bb262e1d0f41f750f012201c8b37ddd0"
Received: "1c6d65c0c9c9ac4b6e159f6b3a4365c50e823d9f5b63eafe354782ad7299429c"

 ❯ tests/level-five-integration.test.ts:47:71
     45|           .replace("        nextFacilityLevel: 5,\n      },\n      LEV…
     46|       }
     47|       expect(createHash("sha256").update(source).digest("hex"), file).…
       |                                                                       ^
     48|     }
     49|     expect(run.commandsReconciled).toBeGreaterThan(20_000);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 156 passed | 1 skipped (158)
      Tests  1 failed | 4244 passed | 2 skipped (4247)
   Start at  23:16:49
   Duration  910.73s (transform 5.25s, setup 0ms, import 68.10s, tests 832.07s, environment 7ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
EXIT_CODE=1
```

</details>

<details>
<summary>Workspace typecheck — exit 0</summary>

```text
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

EXIT_CODE=0
```

</details>

<details>
<summary>Player — exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads


> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  245 passed (245)
      Tests  2166 passed (2166)
   Start at  23:16:49
   Duration  80.68s (transform 18.52s, setup 0ms, import 133.26s, tests 167.81s, environment 14ms)

EXIT_CODE=0
```

</details>

The complete owner review is `docs/reviews/stats-ethics-round2-full-20261015.md`. Baselines, the full-catalog inventory, assignment register, numerical/identity checks, restoration receipts, scope audit and raw validation logs are under `.local-dev/stats-ethics-round3-revision1/`. Delivered files are UTF-8 without BOM and use LF. This append preserves the previous plan prefix byte for byte.

**LOCAL ONLY:** no Git, agents, installs, web access, external messages, commit, push, deployment, publication, browser/origin change or save migration. Remaining decisions are manager acceptance and named clinician review; the manager owns the combined Level 5 rebind, current-thread handoff integration and GitHub checkpoint reminder. No additional owner design decision is needed.

### Level 5 evidence rebind 3 (2026-10-17)

Completed the bounded Sol-worker rebind after the manager-accepted colleague editorial weight reduction from **0.05 to 0.01** and the stats/ethics **round 3 / revision 1** content pass. The actual reducer journey was rerun from its existing funded synthetic Level 4 opening with the original seed and current sources. The established lower helper then retained the actual third-result progress state. Both commands exited 0. All original journey and integration assertions were kept.

#### Files changed and scope

- `tools/qa/level-five-integration-results-20261012.json`: regenerated run summary/current hashes; appended the previous run as `inputHistory[2]`, preserving entries `[0]` and `[1]` exactly. There are now three history entries.
- `tests/fixtures/level-five-integration-checkpoints-20261012.json`: regenerated all nine actual reducer saves, including the lower retry.
- This append-only handoff section.

**The guard was not edited.** Its SHA-256 remains `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`. No checks were loosened, bypassed or newly skipped. This worker did not edit the name-pool code, clinical content, e2e specs, runner/helper scripts or any other source. Clinical review statuses were not modified by this rebind.

As in the previous rebinds, the unchanged runner emits the historical literal `liveCap: 4`, while its current independently loaded validated context uses ordinary cap **5**. The result metadata was corrected to 5 when preserving history; every measured value was retained exactly. The actual helper output SHA-256 before metadata/history addition is `fd9248842b3994d297060aaacd42df093fed5021d91ca43a54ee0d0d56340a1a`.

#### Input provenance and preflight discovery

The previous run recorded **373 inputs**; the fresh run records **374**. **Six recorded hashes changed** (the five content inputs and `colleagueNames.ts`), **one helper is newly recorded**, **367 existing hashes are unchanged**, and none was removed. Restoring only the colleague-weight literal from `0.01` to `0.05` in memory exactly reproduces its previous recorded file digest.

Preflight also found `clinical-anchor-test-catalog.ts`. The round 3 revision 1 handoff explicitly lists this helper, and its only local consumers are clinical-content tests. The established runner scans all eligible source `.ts` files, so it collects this new helper as well. Its current hash is now bound directly; neither the collector nor guard was changed to exclude it. This accounts for the extra input beyond the six described runtime/content changes.

`inputHistory[2]` retains the previous run's complete 373-entry input map, helper fingerprint, seed/version/cap metadata and result-file SHA-256 `ad1e949b2f9878421abc1504cae246f0a4388825e3644feaa85e5578a3d0881a`. Both earlier entries retain all their original hashes and historical compatibility provenance. The current top-level input map hashes all 374 files directly, with no new compatibility exception. Source, helper, guard and e2e-spec fingerprints remained stable through the replay and validations.

| Input | Previous recorded SHA-256 | Fresh-run SHA-256 |
| --- | --- | --- |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/clinical-anchor-test-catalog.ts` | Not recorded in previous run | `73ef68e2e12939536d7f1697b116c5946dcf5b205fff071fdeb654ae5e4fdc84` |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts` | `2da4d73fe57ba9acfaec338ab3b296a0bb262e1d0f41f750f012201c8b37ddd0` | `1c6d65c0c9c9ac4b6e159f6b3a4365c50e823d9f5b63eafe354782ad7299429c` |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-qi.ts` | `e24e3454662e8728ba3bd4f896f5bcfb042625b0067431f5a56aafe4a3346476` | `633d689ae0d607077b13b738872c4ef5d94db0ef1fa0f2c0b8a9198ee3e18058` |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-variants.ts` | `09d9650b05f2ae50891e423c49b57169cc74d99d83c0b904a84e7cdce6bdc444` | `8c4800f35615f4c16e889799048973b83e3ca823de0822467ae5908b10befaca` |
| `packages/clinical-content/src/development-batch/2026-10-07-variety-2/patient-safety.ts` | `f28f40a4bbbe3f12374c25033863f5297f85abf8fd5be3cffa3bef26c085c32d` | `03ac56c0905c78d0ae44699eac69a09ee076952193de77065f9a40d7e8c0c304` |
| `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/assent.ts` | `da198959d1d168dd5a1a112f9de0e08f09870f00092be0fc1859512a9129cc64` | `abac4e8559876ff47443ebe595f15330fb0a5b7fffa908fac3557629eca21a94` |
| `packages/game-domain/src/colleagueNames.ts` | `50103eb51f76024227355afe4a42641e1c7e5ab12bce6cb36e779f85db140c54` | `b03d78693e47e4580d7cca051ab4b19b28bc699ddbf4d8c42f0998e45d24621c` |

#### Actual run numbers

- Seed `level-five-m9.integration.01`; **27,944 applied and cash-reconciled commands**, exceeding the unchanged 20,000-command guard.
- First answers **555 total / 466 at Level 5**; completed daily rounds **38**; positive comfort uses **1,031**.
- Cash, all in cents: **1,785,500 + 15,728,300 - 292,202 - 10,124,856 - 1,048,000 = 6,048,742** (opening + gross - stock - paid operating - capital = closing). Per-command and lifetime reconciliation passed.
- XP goal tick **15,493**. Inspection unlock tick **16,281** at **2,162 XP / 91 displayed satisfaction / 100 average staff morale / 9 employed staff**.
- Supplier savings **2,098 stock cents / 751,140 upkeep sixtieth-cents**; retired receipts **5,692**; retired encounters **423**.
- Every measured summary field and all three report objects are identical to the previous run. Higher retry remains best, lower retry is latest, and the immutable first-finish report remains the first report. Round/comfort, supplier-savings, retirement, report and pause assertions passed.

| Report | Raw total score | Qualifying patients | Final role |
| --- | --- | --- | --- |
| First | 62.49398772204757 | 52 | Immutable first finish |
| Higher retry | 66.65755625217645 | 50 | Best completed report |
| Lower retry | 45.489710466735836 | 48 | Latest completed report |

#### Changed saves and consumers

**All nine checkpoint saves changed.** Exact comparison found **195 replaced strings and 36 added `sourceLabels` strings**. Differences include generated names and their text, frozen round-3 clinical wording/feedback and source labels. No numeric checkpoint value changed. All nine retain their previous tick, XP, cash, facility level, inspection phase and report state.

| Changed scenario | Tick | XP | Cash cents | Inspection phase |
| --- | --- | --- | --- | --- |
| `integration-l4` | 3965 | 754 | 2656300 | No Level 5 state |
| `integration-build` | 3965 | 0 | 1608300 | locked |
| `integration-preparing` | 16282 | 2162 | 4143642 | preparing |
| `integration-running` | 16419 | 2184 | 4148611 | running |
| `integration-final` | 19338 | 2750 | 4892761 | running |
| `integration-finish` | 19339 | 2750 | 4892761 | completed |
| `integration-repeat-final` | 22995 | 3466 | 5747398 | running |
| `integration-repeat` | 22996 | 3466 | 5747398 | completed |
| `integration-lower-repeat` | 26053 | 3596 | 6048742 | completed |

`tests/e2e/level-five.spec.ts` consumes all nine changed saves. It was not edited or run. The launch fixture factory and domain/player integration/launch tests also consume these saves; the full domain suite and both focused player consumer files passed with the refreshed artifacts. Manager browser acceptance should use the new saves. No previous browser pass is claimed as fresh evidence.

#### Validation and exact output

**All requested validations passed:** game-domain **157 files passed / 1 skipped; 4,245 tests passed / 2 existing skipped; 0 failures**; root typecheck **exit 0**. Additional focused player consumers: **2 files / 33 tests passed**. All npm commands below used the existing `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload through `NODE_OPTIONS` (`--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`). Typecheck and both test commands ran after regeneration and history preservation. The runner/helper emitted Node's experimental TypeScript-transform warning and still exited 0.

Exact output follows; only UTF-16 log encoding and CRLF were normalized for this UTF-8/LF document. `EXIT_CODE` lines are the wrappers' recorded statuses.

<details>
<summary>Actual reducer journey: exit 0</summary>

```text
node tools/qa/level-five-integration-run.mjs --write

L4 10h, 114 XP
L4 20h, 210 XP
L4 30h, 334 XP
L4 40h, 450 XP
L4 50h, 566 XP
L4 60h, 692 XP
L5 70h, 52 XP
L5 80h, 146 XP
L5 90h, 250 XP
L5 100h, 366 XP
L5 110h, 472 XP
L5 120h, 566 XP
L5 130h, 682 XP
L5 140h, 786 XP
L5 150h, 880 XP
L5 160h, 996 XP
L5 170h, 1080 XP
L5 180h, 1196 XP
L5 190h, 1300 XP
L5 200h, 1416 XP
L5 210h, 1532 XP
L5 220h, 1626 XP
L5 230h, 1720 XP
L5 240h, 1816 XP
L5 250h, 1930 XP
L5 260h, 2016 XP
L5 270h, 2142 XP
Inspection 1: 62.49398772204757, 52/20
Inspection 2: 66.65755625217645, 50/20
Inspection 3: 45.489710466735836, 48/20
{
  "commands": 27944,
  "closingCashCents": 6048742,
  "xpGoalTick": 15493,
  "unlock": {
    "version": "level-five-inspection-unlock.v1",
    "earnedAtFacilityTick": 16281,
    "clinicalXp": 2162,
    "displayedSatisfaction": 91,
    "averageStaffMorale": 100,
    "employedStaffCount": 9
  },
  "snapshots": {
    "integration-l4": {
      "tick": 3965,
      "xp": 754,
      "phase": null
    },
    "integration-build": {
      "tick": 3965,
      "xp": 0,
      "phase": "locked"
    },
    "integration-preparing": {
      "tick": 16282,
      "xp": 2162,
      "phase": "preparing"
    },
    "integration-running": {
      "tick": 16419,
      "xp": 2184,
      "phase": "running"
    },
    "integration-final": {
      "tick": 19338,
      "xp": 2750,
      "phase": "running"
    },
    "integration-finish": {
      "tick": 19339,
      "xp": 2750,
      "phase": "completed"
    },
    "integration-repeat-final": {
      "tick": 22995,
      "xp": 3466,
      "phase": "running"
    },
    "integration-repeat": {
      "tick": 22996,
      "xp": 3466,
      "phase": "completed"
    }
  },
  "reports": [
    {
      "score": 62.49398772204757,
      "patients": 52
    },
    {
      "score": 66.65755625217645,
      "patients": 50
    },
    {
      "score": 45.489710466735836,
      "patients": 48
    }
  ]
}
node : (node:29416) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-run.mjs --write *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:29416) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Actual lower-retry checkpoint: exit 0</summary>

```text
node tools/qa/level-five-integration-lower.mjs

M9 lower retry checkpoint PASS: latest 45.489710466735836, best 66.65755625217645, immutable first 62.49398772204757.
node : (node:1616) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-lower.mjs *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:1616) Exp...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Full game-domain suite: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1


> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  157 passed | 1 skipped (158)
      Tests  4245 passed | 2 skipped (4247)
   Start at  23:55:45
   Duration  889.58s (transform 4.68s, setup 0ms, import 67.55s, tests 811.03s, environment 7ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Root typecheck, after artifact regeneration: exit 0</summary>

```text
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

EXIT_CODE=0
```

</details>

<details>
<summary>Focused player consumers: exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  23:55:45
   Duration  12.57s (transform 4.56s, setup 0ms, import 7.30s, tests 5.10s, environment 0ms)

EXIT_CODE=0
```

</details>

Filesystem baselines, original artifacts, source/weight proof, comparison receipts and raw logs: `.local-dev/l5-evidence-rebind-20261017/` (`baseline.json`, `artifact-audit.json`, `integrity-review.json`, original artifact copies and command logs). Original checkpoint SHA-256: `5e2d00d66d63e60903cab57514a5fbd6f33208fb02fa17834948f9427f5eae33`; final checkpoints: `3baf8e3d564893d432ca8a2e86c0093648b8ae804c94af922deab0047a2f28dd`; final result: `1ec62f7a022ec88ee5dbbe58016d83dee88c4efb838f740eb644d9c1aab4fd14`. Final checks verified all current inputs, the full three-entry history, unchanged guard/helper/e2e fingerprints and UTF-8 without BOM / LF. The existing plan prefix is preserved byte for byte.

**LOCAL ONLY:** no Git, agents, installs, external messages, commits, pushes, deployment or publication. The manager owns scoped diff review, browser acceptance, current-thread handoff integration and the audited GitHub checkpoint/reminder to say **"push to GitHub"**. No browser, launcher, playtest-origin/profile or owner-save pathway changed.

## P2-E pairings (2026-10-17)

**Status:** eight same-diagnosis ethics → clinical cases implemented for manager acceptance. Final validation is recorded below. Owner direction: decision 4 = yes, followed by proceed. Every new clinical adaptation and case review remains **needs_clinician_review**; no named clinician approval is inferred.

**Owner read-through:** [Eight P2-E pairings](../reviews/stats-ethics-p2e-pairings-20261017.md), including both steps, key-first review-only choices, each rationale, lessons and per-node existing claim/source mappings. Runtime shuffles all choices.

### Implementation, constraints and counts

- The content adapter replaces eight single-node ethics cases with new `case.gs028se.p2e.*` IDs and eight contextual clinical question IDs. It reuses existing clinical concepts/objectives, question decisions, answer IDs/correctness and evidence bindings from direct authored-module imports. No cross-batch export or authored clinical source file was edited.
- All 40 original ethics questions, concept IDs/objectives, choices, profiles, opening presentations and profile IDs are unchanged. The four existing Spanish interpreter → consent cases are byte-for-byte unchanged, including Female ages 43/68 and source labels. All other unselected ethics cases are unchanged.
- Each node gets sources resolved from its own bound claims; case labels are their union. Clinical mappings also include the original ethics claims supporting the explicit corrected-forward transition. All **734 exported claim records and 452 source records** match the original catalog exactly, including statements, dates, license/reuse/authority metadata, reciprocal mappings and original clinical approvals.
- The adapted desmoid, FHH and Mondor questions remain new drafts even though the original versions were clinically approved. No approval label is inherited. New technical-review metadata is dated 2026-10-17 and explicitly says no clinician sign-off; source/claim check and access dates are unchanged.
- The first wrong answer has no terminal disposition and proceeds after feedback acknowledgement to the same reached update as a correct answer. Final wrong answers use neutral `no_terminal_outcome` feedback. No adverse-outcome narrative is added. Each of the two distinct intended concepts gets one FSRS review, using the existing stable concept IDs.
- The final eight continuations are management or referral decisions, with their source no-test timing classifications preserved. Diagnostic candidates were excluded because new case/node identities would also require exact order registrations in the prohibited game-domain source lane. The cutaneous-abscess candidate was also excluded because its donor required a minor-procedure capability. No new capability, service, fixed waiting duration, onsite procedure or diagnostic-order contract is introduced. Existing testing choices elsewhere retain their wait declarations.
- Desmoid and perianal-abscess labels use parallel treatment plans while preserving original answer IDs, decisions and correctness. All clinical stems state the patient-specific task completely. Lessons reuse the authored donor feedback; distinct short fallbacks and two legacy rationale completions use only existing claims.
- Main batch: **28 original concepts, 120 question variants (112 original + 8 clinical adaptations), 108 cases, 120 nodes and 120 timing entries**; local claims/sources remain **63 / 30**. The eight clinical concepts already exist in the admitted catalog; no FSRS concept was added or renamed.
- The original focused Round-3 bank retains its 30 concepts and 118 original question texts across 114 cases. The P2-E supplement makes **126 questions/decisions across those same 114 cases**. The earlier Round-3 review is preserved; the P2-E review gives the new continuations and case identities.
- Ethics cases **36 → 36**, ethics decisions **40 → 40**, total ethics-case nodes **40 → 48**, two-step cases **4 → 12**. The complete release remains **370 concepts / 1,110 cases**; nodes change **1,415 → 1,423**.

| Ethics supply | Before cases / ethics decisions / total nodes | After cases / ethics decisions / total nodes |
| --- | --- | --- |
| Level 0 | 36 / 40 / 40 | 33 / 37 / 42 |
| Level 1 | 36 / 40 / 40 | 36 / 40 / 48 |
| Level 2 | 36 / 40 / 40 | 36 / 40 / 48 |

All 40 original ethics decisions, including four variants of every ethics concept and all four interpreted-consent sequences, remain available by level 1. Three cases inherit level 1 from varicose referral, PTLD tissue coordination and GIST treatment planning; five additions stay level 0. Main-batch patient case supply is **48 → 45 at level 0**, and **48 → 48 by level 1**, without a new capability. The 60 employee-discussion cases/nodes remain at their original level-2 host gate. Educational tier, acuity, capability and facility progression remain separate.

### Delivered pairing register

| Existing ethics question | Same diagnosis | Existing clinical question reused |
| --- | --- | --- |
| `question.statistics-ethics.capacity-refusal.v4` | varicose | `question.varicose-veins.intervention-referral-after-axial-reflux.v1` |
| `question.statistics-ethics.perioperative-dnr.v4` | perianal-abscess | `question.perianal-abscess.prompt-drainage.v1` |
| `question.statistics-ethics.error-disclosure.v4` | ptld | `question.ptld.tissue-diagnosis-coordination.v1` |
| `question.statistics-ethics.research-consent.v1` | gist | `question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v1` |
| `question.statistics-ethics.research-consent.v3` | desmoid | `question.desmoid.initial-surveillance.new-diagnosis.v1` |
| `question.statistics-ethics.research-consent.v4` | hidradenitis | `question.hidradenitis-suppurativa.multimodal-specialist-planning.v1` |
| `question.statistics-ethics.confidentiality.v2` | fhh | `question.fhh.parathyroid-surgery-counseling.v1` |
| `question.statistics-ethics.confidentiality.v4` | mondor | `question.mondor-disease.management.supportive-care.v1` |

### Scope, restoration and supply proof

A complete runtime comparison restores only the eight replaced cases and exactly recreates the original full release. All unrelated runtime records and all original ethics question records are unchanged. Nine related clinical-content admission tests were updated only for proven +8-node totals, three verified hashes and explanatory comments. Their authored objectives/content were not edited. Initial scope questions were resolved by inspecting that these are tests of this batch's runtime admission, covered by the brief's “and its tests” lane. No additional owner design or test-policy approval is claimed.

| Historical intake | Original hash exactly reproduced by eight-case restoration | Current paired-release hash | Current concepts / cases / nodes |
| --- | --- | --- | --- |
| beforeVariety1 | `7f37f52ed571295a6d463e76ee7f4de121a2862f9ddec32ce1d0801438e0460b` | `6109a009e2c09d21018fe5e6da83641ca15fcf2a8e9b482fbbb4be3afc0052e1` | 291 / 852 / 1143 |
| beforeVariety2 | `ae2e3c2d2bd64d280632279f066508a12bb5905a96f4ef2c2c2812815b86f9ab` | `ce6977677134c338673fb14b1051076fceda9bdf7d59ef542244139e2d96f76c` | 311 / 930 / 1223 |
| beforeVariety3 | `a559b47f3470797900b15a1033acdc5374c64030025838ab945666935e8758c1` | `94898aae463e483b0a414e14beebbf51b00478ed109db73da43df7d72948f14a` | 360 / 1090 / 1403 |

The Level-3 protected-intake hash remains `284dc7a272a79f441e834f81c33a3027587eec57d1d37929bca986c61661694c`; only its separate overall node total changes. The three historical hashes above are consequences of the verified eight-case diff. No check was relaxed, excluded or skipped. The scoped expectation diff is preserved at `.local-dev/stats-ethics-p2e-20261017/historical-expectations.patch`.

The game-domain supply/case-mix updates were made only after a controlled counterfactual: use the same current domain source and seeds, first with original clinical modules restored in memory, then with the eight paired cases. The original modules exactly reproduce the existing inventory and day-eight snapshots. This isolates P2-E from concurrent M9 source changes. All live diagnostic receipt/operation assertions remain unchanged. Current versions of shared test files were copied before the small expectation edits so concurrent work is preserved.

| Measured patient supply | Original | P2-E |
| --- | --- | --- |
| L0 ordinary cases / available concepts / introduced concepts | 639 / 175 / 174 | 636 / 175 / 174 |
| L0 seeded patients; 16-seed range | 162; 157–163 | 159; 157–163 |
| L1 ordinary cases / available concepts / introduced concepts | 882 / 285 / 285 | 882 / 285 / 285 |
| L1 seeded patients; 16-seed range | 222; 218–228 | 225; 219–227 |
| L2 external seeded patients; 16-seed range | 237; 233–241 | 238; 232–241 |
| L2 all-capability seeded patients; 16-seed range | 251; 241–253 | 247; 241–252 |
| Eight-day arrivals; completed; answers/scored concepts | 79; 78; 110 | 79; 79; 116 |
| Eight-day pending/unresolved; walkouts; due reviews | 1 / 1; 0; 0 | 0 / 0; 0; 0 |

The existing small stranded-concept counts in the inventory characterization are unchanged; the all-capability seed strands the other breast-cyst objective. Their exact identities remain explicit in the refreshed snapshot. This task does not claim to repair those pre-existing selection boundaries. The sustained run retains tick 4,800, arrivals `[11,10,9,10,10,9,10,10]`, last arrival 4,753 and next arrival 4,814. Only the measured supply/case-mix snapshots were refreshed; all positive arrival/completion checks and operation limits remain.

### Files changed

- Stats/ethics lane: new `ethics-clinical-pairings.ts` and `.test.ts`; `ethics.ts`, `statistics-ethics-batch.ts`, `ethics.test.ts`, `round2-wording.test.ts`, `runtime-flow.test.ts`, `statistics-ethics-admission.test.ts`.
- Clinical-content aggregate admission tests only: September 11 and 12 board-expansion admission; September 13 early-level admission; September 17 brief admission and bread/butter admission; October 7 variety, variety-2 and Level-3 admission; October 10 variety-3 admission. Exact path/diffs are in the preserved expectation patch. No authored objectives in those batches were edited.
- Game-domain tests only: `gs028-statistics-ethics-batch.test.ts`, `gs028-20261003-batch.test.ts`, `gs028-20261007-batch.test.ts`, `gs028-20261007-variety2-batch.test.ts`, `patient-supply.test.ts`, `diagnostics/patient-supply.test.ts`. Changes are supply totals, inherited-stage fixture setup and the two proven case-mix snapshots. Concurrent preceding edits in the two October-7 files are preserved.
- Owner review `docs/reviews/stats-ethics-p2e-pairings-20261017.md` and this P2-E append. The pre-existing ExecPlan prefix is byte-preserved.

### Validation

**Clinical-content full: 89 files / 698 tests passed, exit 0. Root typecheck: all seven workspaces passed, exit 0.** Focused content: 7 files / 103 tests passed. Focused runtime coverage includes all four first-answer choices across all twelve paired cases (48 paths), duplicate-submit idempotence, one review per intended concept, reload before answering, during first-step feedback, between nodes and after completion. All eight removed single-step cases remain frozen and playable when absent from the current catalog. Existing optional-field legacy-save checks remain passing.

**Full game-domain: 157 files passed / 1 failed; 4,262 tests passed / 1 failed, exit 1. The sole failure is the unchanged Level-5 recorded-input hash guard, as permitted by the brief. Its other 35 checks pass.** The manager must rebind the combined evidence after all workers finish. Exact requested-command output follows.

<details>
<summary>Full clinical-content — exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  89 passed (89)
      Tests  698 passed (698)
   Start at  09:31:00
   Duration  28.89s (transform 2.31s, setup 0ms, import 18.80s, tests 3.77s, environment 4ms)
EXIT_CODE=0
```

</details>

<details>
<summary>Full game-domain — exit 1</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 1 failed) 249192ms
     × binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash 31ms
npm.cmd : 
At line:4 char:1
+ npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=th ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its 
current game, balance, clinical and driver inputs and reconciles cash
AssertionError: packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts: expected 
'68e3d38198b0c4b0a718e1746d1c9a42e48b7…' to be '1c6d65c0c9c9ac4b6e159f6b3a4365c50e823…' // Object.is equality

Expected: "1c6d65c0c9c9ac4b6e159f6b3a4365c50e823d9f5b63eafe354782ad7299429c"
Received: "68e3d38198b0c4b0a718e1746d1c9a42e48b7333f015948049d2124df2bb5317"

 ❯ tests/level-five-integration.test.ts:47:71
     45|           .replace("        nextFacilityLevel: 5,\n      },\n      LEV…
     46|       }
     47|       expect(createHash("sha256").update(source).digest("hex"), file).…
       |                                                                       ^
     48|     }
     49|     expect(run.commandsReconciled).toBeGreaterThan(20_000);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 157 passed (158)
      Tests  1 failed | 4262 passed (4263)
   Start at  09:23:12
   Duration  937.79s (transform 4.56s, setup 0ms, import 67.32s, tests 859.73s, environment 7ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
EXIT_CODE=1
```

</details>

<details>
<summary>Root typecheck — exit 0</summary>

```text
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
EXIT_CODE=0
```

</details>

All npm validations used the existing `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload. Complete original/current scoped files, the 600-file baseline, actual diffs, full catalog and runtime snapshots, hash-restoration receipts, controlled before/after supply captures and raw command logs are in `.local-dev/stats-ethics-p2e-20261017/`. Source and delivered docs/tests are UTF-8 without BOM and LF.

**LOCAL ONLY:** no Git, installs, network, agents, external messages, commit, push, deployment, publication, browser/profile/origin change or save migration. This worker made no game-domain source edit and did not touch Level-5 results, checkpoint fixture or guard. The Beta-2 planning lane is untouched. Manager owns actual diff/clinical acceptance, the combined Level-5 evidence rebind after workers finish, current-thread handoff integration and the audited GitHub checkpoint/reminder to say **"push to GitHub"**.

**Next action:** manager review and Level-5 evidence rebind, followed by named clinician review of the unapproved versions.

<!-- END STATS_ETHICS_P2E_WORKER_HANDOFF -->

### Level 5 evidence rebind 4 (2026-10-17)

**Evidence regenerated honestly; zero-failure full-domain acceptance remains unmet.** The unchanged actual journey and lower-checkpoint helper both exit 0. The input-hash guard is rebound to the accepted DEFECT-M9-1/M9-2 fixes and P2-E pairings; its source and every assertion remain unchanged. Root typecheck passes. Full game-domain finishes with 4,261 passing / two failing tests: the fresh `integration-running` checkpoint exposes a garden-rest reader error during the unchanged reload continuation, and `packages/game-domain/tests/level-five-launch.test.ts:63` expects 52 patients while the actual new report has 53. Its next line also pins the old exact score. An independent cold-context focused run of that same continuation test stops earlier at an inspector-route cache asymmetry; both failure modes are documented below. The additional player consumer run has 31 passing / two failing tests, both from the old `62.49` display expectation at `apps/player/src/session/levelFiveLaunch.test.tsx:54`. No assertion was edited or weakened. This is an explicit manager handback, not an all-green acceptance claim.

**Delivered files and provenance.** Changed `tools/qa/level-five-integration-results-20261012.json`, `tests/fixtures/level-five-integration-checkpoints-20261012.json`, and this append-only handoff. The full prior 374-input map is appended as `inputHistory[3]`, with prior result SHA-256 `1ec62f7a022ec88ee5dbbe58016d83dee88c4efb838f740eb644d9c1aab4fd14`. The earlier three history entries are retained verbatim. The new run records 375 inputs: four existing hashes changed, one pairing module was added, 370 hashes stayed equal and none were removed. No replay-compatible hash exception or allow-list was added.

| Input | Previous SHA-256 | Current SHA-256 |
| --- | --- | --- |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics-clinical-pairings.ts` | Not previously recorded (new file) | `319ece049eedb27bd10fd8a67dfab444a48b9b64f317bbab3070458df8f55bb9` |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics.ts` | `1c6d65c0c9c9ac4b6e159f6b3a4365c50e823d9f5b63eafe354782ad7299429c` | `68e3d38198b0c4b0a718e1746d1c9a42e48b7333f015948049d2124df2bb5317` |
| `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-ethics-batch.ts` | `097b988ad066520ae70c2e35b05ffa28fe7678bc1f7d2fcb1ae4cd53fb761f32` | `ccbc2a61360c4afed75090460f867bda9ba382354c2617cc49be9e10a8f0d50c` |
| `packages/game-domain/src/clinical-selection.ts` | `9fb64941a4c1931ee00052fafd4e05ab7aaf8a8200a258ef2f3050b4563a1d9e` | `e4ad07cb009be75c1f2da4731a3137b83ea1bbdacf1c2034e0fdf7e50fa0dc57` |
| `packages/game-domain/src/persistence.ts` | `4c818dc6b813864543c967754905567a8ebc6ba5b01cadec9f887bff15b134bc` | `13aae9e095aa2220781c43f9ca0d97f2b2fb73bcb827979cfa5681e1069ffcd2` |

The established generator order was `node tools/qa/level-five-integration-run.mjs --write`, then `node tools/qa/level-five-integration-lower.mjs`. Both execute the current TypeScript sources through the existing Node source loader, without browser play or seeded reports. After both finish, only the established summary-metadata correction (`liveCap: 4` emitted by the unchanged runner → the actual validated context cap `5`) and the provenance history append are applied to the results. Raw post-helper results SHA-256 before this metadata/history step: `530db1c767dbb0d22f3f9cdc129f559c4949853424908f356420d20824654abd`. No run metric, report, checkpoint state, input hash, cash value, goal, or assertion was rewritten during that step.

**Actual run numbers (cash values are cents).** Seed `level-five-m9.integration.01`, version `level-five-m9-integration.v1`, 26717 reconciled commands, three genuinely completed 3,000-minute reports, all at least 20 qualifying patients. The higher second report remains best, the lower third report is latest, and the first completed report remains the immutable first finish. Daily awards, positive comfort use, supplier savings and retirement assertions remain active.

| Metric | Previous | Current | Delta |
| --- | ---: | ---: | ---: |
| `commandsReconciled` | 27944 | 26717 | -1227 |
| `openingCashCents` | 1785500 | 1785500 | 0 |
| `grossCents` | 15728300 | 15051500 | -676800 |
| `stockCents` | 292202 | 272826 | -19376 |
| `paidOperatingCents` | 10124856 | 9641655 | -483201 |
| `capitalCents` | 1048000 | 1048000 | 0 |
| `closingCashCents` | 6048742 | 5874519 | -174223 |
| `levelFourAdvanceTick` | 3965 | 3965 | 0 |
| `xpGoalTick` | 15493 | 15025 | -468 |
| `firstAnswers` | 555 | 545 | -10 |
| `levelFiveFirstAnswers` | 466 | 456 | -10 |
| `completedDailyRounds` | 38 | 36 | -2 |
| `positiveComfortUses` | 1031 | 977 | -54 |
| `retiredReceipts` | 5692 | 5369 | -323 |
| `retiredEncounters` | 423 | 402 | -21 |
| `finishNotices` | 0 | 0 | 0 |

Cash reconciles exactly: 1785500 + 15051500 − 272826 − 9641655 − 1048000 = **5874519**. The closing decrease is exactly −676800 gross + 19376 lower stock cost + 483201 lower paid operating cost = **−174223 cents**; opening cash and capital are unchanged. There is no finish payout or injected adjustment. Supplier savings are stock 2098 → 1974 cents and upkeep 751140 → 710700 sixtieth-cents. The final retained finish-notice count is zero in both runs because ordinary events retire; the durable first-completed record remains checked.

| Report | Previous raw score | Current raw score | Patients, previous → current | Tick window, previous → current |
| --- | ---: | ---: | ---: | --- |
| 1 | 62.49398772204757 | 62.56333530490279 | 52 → 53 | 16339–19339 → 15151–18151 |
| 2 | 66.65755625217645 | 66.78529669066674 | 50 → 51 | 19996–22996 → 18808–21808 |
| 3 | 45.489710466735836 | 45.33910414489676 | 48 → 50 | 23053–26053 → 21865–24865 |

All three report objects differ. Changes are in cleanliness, patient satisfaction, wait flow, financial raw amounts, answer counts/accuracy, patient membership and the observation windows; room construction, upgrades, staffing, training and morale categories remain equal. Financial scores stay 100 in all three windows, while gross/stock/net amounts change. The second and third answer-accuracy scores remain 100 and 0 respectively, but their answer counts become 66/66 and 0/66 rather than 60/60 and 0/64. Exact changed category scores and raw numerators/denominators are included below.

**Why these are legitimate changed results.** This continuous journey does not resume from its checkpoint reader: `tests/fixtures/level-five-integration.ts:38` constructs a fresh opening; `tools/economy-audit/level-four-simulation.ts:10` reaches `tests/fixtures/level-four-rooms.ts:30`, which uses `createInitialGameState`. At `tests/fixtures/level-five-integration.ts:114`, a paused checkpoint is serialized and deserialized only to check its Level 5 contract; that loaded branch is discarded, never assigned back to `journey.state`. `packages/game-domain/src/persistence.ts:113` serializes with plain `JSON.stringify`; the lower helper also reads the actual raw progress state. Thus the accepted persistence-reader correction is bound and exercised by reload validation, but it does not explain this continuous run's changed cash/report trajectory.

P2-E changes actual eligible case/concept membership and decision paths. A separate controlled prefix probe used the identical raw `integration-build` opening (tick 3965, zero Level 5 XP, 1608300 cash cents), the same current domain sources including both accepted M9 fixes, and only old versus new `ethics.ts` / `statistics-ethics-batch.ts` loaded in memory. Both old-module hashes exactly match the prior recorded inputs. No source or canonical evidence was edited by the probe. First variant divergence is at tick 4682, `encounter.auto.5.76`: `case.mondor-disease.select-supportive-patient` → `case.mondor-disease.safety-boundary`, for the same Mondor-management concept. A fixed seed does not keep the chosen variant identical after its eligible variant pool changes.

At tick 6504, encounter 107 selects the new research-consent/hidradenitis pairing instead of the old two-node hidradenitis case; its first concept therefore changes while the second remains the same. The resulting review/pool path then selects the two-node research-consent/desmoid pairing at encounter 111 instead of a one-node hidradenitis case. Its additional correct second answer at tick 6819 earns the ordinary 10 XP. By tick 7200, the controlled old/new branches have 566/576 XP and 2255322/2263322 cash cents. New-content gross is 8000 cents higher, with exactly equal stock and paid operating costs; every probe cash and first-answer-XP assertion passes. Neither prefix observed a committed walkout. This demonstrates a content-caused divergence independently of any reload effect; it does not manufacture or replace the actual journey.

In the full actual run, the XP goal moves 15493 → 15025, inspection unlock 16281 → 15094 (2162 → 2014 XP at unlock, still satisfaction 91, morale 100 and nine employees), and every inspection window/final endpoint moves 1188 ticks earlier. Different cases, question paths, reviews and operating duration change completions, rewards, service traffic, cleanliness, satisfaction and queues. The report raw values and lifetime cash decomposition above account for the measured result rather than forcing the old numbers. Both final retirement ledgers have retiredCount = completedCount (423/423 previously, 402/402 now), retained resolved encounters are all completed (11 previously, 13 now), and all six old/new report wait-flow samples show zero walkouts. M9-2 only changes reservations for a committed walkout; these ledgers and the controlled trace provide no walkout-trigger evidence for attributing this result to that special case.

**Changed saves and consumers.** Seven real saves change: `integration-preparing`, `integration-running`, `integration-final`, `integration-finish`, `integration-repeat-final`, `integration-repeat`, `integration-lower-repeat`. `integration-l4` and `integration-build` are byte-identical when individually serialized. Every changed checkpoint occurs 1188 ticks earlier and contains the actual new timeline, including altered frozen cases/history/operations where applicable. All nine saves remain paused; phase names and the scenario list are unchanged.

| Save | Changed? | Previous tick / XP / cash cents | Current tick / XP / cash cents |
| --- | --- | ---: | ---: |
| `integration-l4` | Identical | 3965 / 754 / 2656300 | 3965 / 754 / 2656300 |
| `integration-build` | Identical | 3965 / 0 / 1608300 | 3965 / 0 / 1608300 |
| `integration-preparing` | Changed | 16282 / 2162 / 4143642 | 15094 / 2014 / 3926777 |
| `integration-running` | Changed | 16419 / 2184 / 4148611 | 15231 / 2026 / 3925358 |
| `integration-final` | Changed | 19338 / 2750 / 4892761 | 18150 / 2572 / 4566010 |
| `integration-finish` | Changed | 19339 / 2750 / 4892761 | 18151 / 2572 / 4566010 |
| `integration-repeat-final` | Changed | 22995 / 3466 / 5747398 | 21807 / 3378 / 5449748 |
| `integration-repeat` | Changed | 22996 / 3466 / 5747398 | 21808 / 3378 / 5449748 |
| `integration-lower-repeat` | Changed | 26053 / 3596 / 6048742 | 24865 / 3512 / 5874519 |

`tests/e2e/level-five.spec.ts` consumes these nine scenarios and is unchanged (SHA-256 `8697e951007e63caa70325c8ef18f19334c1ed8e31543acd4295cb941bb4e459`); browser checks were not run in this Node-only task. The ordinary launch aliases `launch-running`, `launch-final`, and `launch-finish` inherit changed saves; `launch-ready`, `launch-unmet`, and `launch-build` use the identical raw openings. The accepted reader correction can still change normalization of an identical raw save: a separate old/new-reader probe with the same current context finds 123 expected field differences across the two openings. Level 4 now preserves 13 overdue idle clocks; both openings preserve 44 overdue retail deadlines, three absent service resource-wait fields and eight explicit-null retail actor movement-wait fields each. Those are the accepted M9-1 semantics, not changes made by this worker. The Level 5 integration player consumer file passes; the ordinary launch player file has the two stale score-label expectations described above. No browser profile, origin, owner's campaign, saved owner encounter, e2e spec or content source was changed.

**Newly exposed reload-continuation failures (runtime fixes are outside the evidence lane).** The full suite reports `The saved garden rest contract is invalid.` at `packages/game-domain/tests/level-five-integration.test.ts:138`, through `validateSavedGardenRest` and `persistence.ts:3380`. A native replay of the unchanged continuation operations, with separate value-identical contexts to isolate the independent presentation cache issue, reproduces it on minute 112, tick 15344, in the control branch. Encounter `encounter.auto.5.255` (`case.rectal-cancer.caregiver-followup`) simultaneously owns returning garden trip `patient-amenity-trip.49` and `departing_for_offsite_testing` movement. Its actual location and garden cursor agree at (37,26), while its offsite movement cursor is (35,28). Raw `validateSavedGardenRest` returns true. The reader prioritizes `patientMovement.path[pathIndex]` for the restored location at `persistence.ts:2966–2968`, then the garden validator rejects that location/cursor mismatch at `level-five-support.ts:150`. This is a concrete movement-ownership/read-agreement conflict; no validator bypass or runtime correction was attempted. Both raw continuation states and the trip/actor data are retained in scratch. Cash at the captured failure is 3957463 cents. The full original validation output below is authoritative; this reader error is distinct from the independent focused mismatch.

With only the `integration-running` test selected, a cold-context run instead stops at `level-five-integration.test.ts:139` on minute zero with an inspector route mismatch, not a timeout. Before play, the loaded Level 5 state matches the raw checkpoint exactly. After one minute, a native-source reproduction finds 394 canonical differing fields, all under inspector `path` / `pathIndex`; all other canonical state, inspector locations and targets, reports and cash agree at that minute. For inspector `inspector.15151.12586039.1`, both branches end at (27.7, 25.8), target `room.economy.mri`, cash 3925358. The control branch has path length/index 15/4 while the resumed branch has 40/29.

Read-only four-way probing isolates the cause: `packages/game-domain/src/inspection-presentation.ts:19` holds `validatedRoutes` in a context-keyed WeakMap whose inner key is actor ID and whose value is only the graph signature. At lines 288–296, the first cloned branch revalidates and compacts its current route, then marks the shared actor ID validated; the other branch with the same context/ID skips that compaction. Reversing branch order swaps the 15/4 and 40/29 representations. Using separate context objects with identical settings yields exact canonical equality after the same minute in either order. This source was unchanged across the prior and new recorded inputs. The changed timeline merely exposes a walking-inspector state at the 80-minute checkpoint. The diagnostic exclusion of presentation was used only to isolate the difference; the actual guard still compares the entire canonical state and fails honestly. No path was normalized in the delivered fixture, no cache/source fix was attempted, and no guard assertion was excluded. Full repro state pairs, differing paths and four-way results are retained in scratch.

**Validation and unresolved acceptance.** The two required commands were run exactly as requested, using the existing `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload. Root typecheck exits 0 across all seven workspaces. Full game-domain exits 1 with 156 files passed / two failed, 4261 tests passed / two failed. The Level 5 recorded-input guard passes; its file has 35 passing checks and the one continuation failure (garden reader error in the full suite, route-cache mismatch in isolation). The other failing test is the unowned old launch golden. The additional two-file player run exits 1 (31 passed, two failed) solely at the old rounded score golden. Exact output follows, including expected Node experimental-loader warnings where emitted.

<details>
<summary>Actual unchanged journey generator — exit 0</summary>

```text
node tools/qa/level-five-integration-run.mjs --write
L4 10h, 114 XP
L4 20h, 210 XP
L4 30h, 334 XP
L4 40h, 450 XP
L4 50h, 566 XP
L4 60h, 692 XP
L5 70h, 52 XP
L5 80h, 146 XP
L5 90h, 250 XP
L5 100h, 366 XP
L5 110h, 472 XP
L5 120h, 576 XP
L5 130h, 702 XP
L5 140h, 796 XP
L5 150h, 902 XP
L5 160h, 1028 XP
L5 170h, 1122 XP
L5 180h, 1218 XP
L5 190h, 1354 XP
L5 200h, 1458 XP
L5 210h, 1564 XP
L5 220h, 1668 XP
L5 230h, 1764 XP
L5 240h, 1878 XP
L5 250h, 1994 XP
Inspection 1: 62.56333530490279, 53/20
Inspection 2: 66.78529669066674, 51/20
Inspection 3: 45.33910414489676, 50/20
{
  "commands": 26717,
  "closingCashCents": 5874519,
  "xpGoalTick": 15025,
  "unlock": {
    "version": "level-five-inspection-unlock.v1",
    "earnedAtFacilityTick": 15094,
    "clinicalXp": 2014,
    "displayedSatisfaction": 91,
    "averageStaffMorale": 100,
    "employedStaffCount": 9
  },
  "snapshots": {
    "integration-l4": {
      "tick": 3965,
      "xp": 754,
      "phase": null
    },
    "integration-build": {
      "tick": 3965,
      "xp": 0,
      "phase": "locked"
    },
    "integration-preparing": {
      "tick": 15094,
      "xp": 2014,
      "phase": "preparing"
    },
    "integration-running": {
      "tick": 15231,
      "xp": 2026,
      "phase": "running"
    },
    "integration-final": {
      "tick": 18150,
      "xp": 2572,
      "phase": "running"
    },
    "integration-finish": {
      "tick": 18151,
      "xp": 2572,
      "phase": "completed"
    },
    "integration-repeat-final": {
      "tick": 21807,
      "xp": 3378,
      "phase": "running"
    },
    "integration-repeat": {
      "tick": 21808,
      "xp": 3378,
      "phase": "completed"
    }
  },
  "reports": [
    {
      "score": 62.56333530490279,
      "patients": 53
    },
    {
      "score": 66.78529669066674,
      "patients": 51
    },
    {
      "score": 45.33910414489676,
      "patients": 50
    }
  ]
}
node : (node:29892) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-run.mjs --write *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:29892) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Actual unchanged lower-checkpoint helper — exit 0</summary>

```text
node tools/qa/level-five-integration-lower.mjs
M9 lower retry checkpoint PASS: latest 45.33910414489676, best 66.78529669066674, immutable first 62.56333530490279.
node : (node:14812) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-lower.mjs *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:14812) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Required full game-domain — exit 1; garden-rest reader error and stale launch golden, input-hash guard passes</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 1 failed) 253602ms
     × matches continued play after save/reload at integration-running 21548ms
 ❯ tests/level-five-launch.test.ts (8 tests | 1 failed) 453ms
     × finishes the first ordinary low-score report and durably keeps playing without a reward 149ms
npm.cmd : 
At line:4 char:1
+ npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=th ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after 
save/reload at integration-running
Error: The saved garden rest contract is invalid.
 ❯ invalid src/level-five-support.ts:167:38
    165| const tick = (value: unknown): value is number => typeof value === "nu…
    166| const point = (value: unknown): value is GridPoint => record(value) &&…
    167| const invalid = (): never => { throw new Error("The saved garden rest …
       |                                      ^
    168|
    169| export function normalizeGardenVisitBenefit(value: unknown, facilityTi…
 ❯ validateSavedGardenRest src/level-five-support.ts:150:116
 ❯ src/persistence.ts:3380:47
 ❯ migrateVersionTwo src/persistence.ts:3379:55
 ❯ validateVersionNine src/persistence.ts:4714:17
 ❯ deserializeGameState src/persistence.ts:4794:48
 ❯ tests/level-five-integration.test.ts:138:14

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  tests/level-five-launch.test.ts > M10 ordinary Level 5 launch > finishes the first ordinary low-score report 
and durably keeps playing without a reward
AssertionError: expected 53 to be 52 // Object.is equality

- Expected
+ Received

- 52
+ 53

 ❯ tests/level-five-launch.test.ts:63:49
     61|     expect(report.outcome).toBe("completed");
     62|     expect(report.observedActiveMinutes).toBe(3000);
     63|     expect(report.qualifyingScoredPatientCount).toBe(52);
       |                                                 ^
     64|     expect(report.rawTotalScore).toBe(62.49398772204757);
     65|     expect(report.categories).toHaveLength(10);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed | 156 passed (158)
      Tests  2 failed | 4261 passed (4263)
   Start at  10:11:10
   Duration  941.40s (transform 4.85s, setup 0ms, import 67.10s, tests 863.47s, environment 7ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
EXIT_CODE=1
```

</details>

<details>
<summary>Required root typecheck — exit 0</summary>

```text
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

EXIT_CODE=0
```

</details>

<details>
<summary>Additional player checkpoint consumers — exit 1; two stale launch score labels</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1

> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/levelFiveLaunch.test.tsx (16 tests | 2 failed) 570ms
     × renders the ordinary finish report with ten categories and both actions, compact=false 100ms
     × renders the ordinary finish report with ten categories and both actions, compact=true 92ms
npm.cmd : 
At line:4 char:1
+ npm.cmd run test --workspace @gamify-surgery/player -- src/session/le ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/levelFiveLaunch.test.tsx > M10 ordinary launch in desktop and phone presentations > renders the 
ordinary finish report with ten categories and both actions, compact=false
 FAIL  src/session/levelFiveLaunch.test.tsx > M10 ordinary launch in desktop and phone presentations > renders the 
ordinary finish report with ten categories and both actions, compact=true
AssertionError: expected '62.56' to be '62.49' // Object.is equality

Expected: "62.49"
Received: "62.56"

 ❯ src/session/levelFiveLaunch.test.tsx:54:50
     52|   it.each([false, true])("renders the ordinary finish report with ten …
     53|     const inspection = viewOf(createLevelFiveLaunchQaState("launch-fin…
     54|     expect(inspection.finish!.report.scoreLabel).toBe("62.49");
       |                                                  ^
     55|     expect(inspection.finish!.report.categories).toHaveLength(10);
     56|     const markup = renderToStaticMarkup(<FinishedGamePage view={inspec…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 31 passed (33)
   Start at  10:11:10
   Duration  13.04s (transform 4.81s, setup 0ms, import 7.65s, tests 5.21s, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run src/session/levelFiveIntegration.test.tsx 
src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1
EXIT_CODE=1
```

</details>

<details>
<summary>Controlled P2-E prefix comparison — both exit 0; diagnostic only</summary>

```text
node .local-dev/l5-evidence-rebind4-20261017/pairing-prefix-probe.mjs before
{"tick":4200,"xp":52,"cashCents":1664737}
{"tick":4800,"xp":146,"cashCents":1779445}
{"tick":5400,"xp":250,"cashCents":1895629}
{"tick":6000,"xp":366,"cashCents":2044230}
{"tick":6600,"xp":472,"cashCents":2153828}
{"tick":7200,"xp":566,"cashCents":2255322}
Controlled before P2-E prefix PASS: 3454 commands, all journey cash/XP assertions retained.
node : (node:14352) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node .local-dev/l5-evidence-rebind4-20261017/pairing-prefix-probe.mjs ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:14352) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0

node .local-dev/l5-evidence-rebind4-20261017/pairing-prefix-probe.mjs after
{"tick":4200,"xp":52,"cashCents":1664737}
{"tick":4800,"xp":146,"cashCents":1779445}
{"tick":5400,"xp":250,"cashCents":1895629}
{"tick":6000,"xp":366,"cashCents":2044230}
{"tick":6600,"xp":472,"cashCents":2153828}
{"tick":7200,"xp":576,"cashCents":2263322}
Controlled after P2-E prefix PASS: 3455 commands, all journey cash/XP assertions retained.
node : (node:12936) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node .local-dev/l5-evidence-rebind4-20261017/pairing-prefix-probe.mjs ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:12936) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Focused unchanged integration-running reload assertion — exit 1, reproduced on minute zero</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-five-integration.test.ts --pool=threads --maxWorkers=1 -t 'matches continued play after save/reload at integration-running'

> @gamify-surgery/game-domain@0.0.1 test
> vitest run tests/level-five-integration.test.ts --pool=threads --maxWorkers=1 -t matches continued play after save/reload at integration-running


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 1 failed | 35 skipped) 553ms
     × matches continued play after save/reload at integration-running 552ms
npm.cmd : 
At line:4 char:1
+ npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/lev ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after 
save/reload at integration-running
AssertionError: minute 0: expected { schemaVersion: 9, …(76) } to deeply equal { schemaVersion: 9, …(76) }

- Expected
+ Received

@@ -28367,5 +28367,5 @@
    "serviceOperations": [Array],
    "settlements": [Array],
    "simulationSpeed": 1,
    "totalOperatingExpenses": 57148.850000001235,
  }

 ❯ tests/level-five-integration.test.ts:139:10
    137|       // canonical serialized forms still detects changed clocks or ga…
    138|       expect(deserializeGameState(serializeGameState(resumed.state), c…
    139|         .toEqual(deserializeGameState(serializeGameState(control.state…
       |          ^
    140|     }
    141|   }, hostedTime(30_000));

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 35 skipped (36)
   Start at  10:16:52
   Duration  4.19s (transform 2.43s, setup 0ms, import 3.56s, tests 553ms, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run tests/level-five-integration.test.ts --pool=threads 
--maxWorkers=1 -t ^^^"matches^^^ continued^^^ play^^^ after^^^ save/reload^^^ at^^^ integration-running^^^"
EXIT_CODE=1
```

</details>

<details>
<summary>Focused unchanged input/cash binding guard — exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/level-five-integration.test.ts --pool=threads --maxWorkers=1 -t 'binds the actual run'

> @gamify-surgery/game-domain@0.0.1 test
> vitest run tests/level-five-integration.test.ts --pool=threads --maxWorkers=1 -t binds the actual run


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  1 passed (1)
      Tests  1 passed | 35 skipped (36)
   Start at  10:22:34
   Duration  3.59s (transform 2.42s, setup 0ms, import 3.48s, tests 36ms, environment 0ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Inspector cache diagnosis — four-way read-only experiment, all diagnostic assertions pass</summary>

```json
[
  {
    "name": "shared-context-control-first",
    "separateContexts": false,
    "reverseOrder": false,
    "canonicalEqual": false,
    "canonicalEqualExcludingPresentation": true,
    "firstActor": [
      {
        "id": "inspector.15151.12586039.1",
        "location": {
          "x": 27.7,
          "y": 25.8
        },
        "target": "room.economy.mri",
        "pathLength": 15,
        "pathIndex": 4,
        "pathStart": {
          "x": 29.7,
          "y": 25.8
        }
      },
      {
        "id": "inspector.15151.12586039.1",
        "location": {
          "x": 27.7,
          "y": 25.8
        },
        "target": "room.economy.mri",
        "pathLength": 40,
        "pathIndex": 29,
        "pathStart": {
          "x": 34.25,
          "y": 19.8
        }
      }
    ],
    "reportEqual": true,
    "cash": [
      3925358,
      3925358
    ]
  },
  {
    "name": "shared-context-resumed-first",
    "separateContexts": false,
    "reverseOrder": true,
    "canonicalEqual": false,
    "canonicalEqualExcludingPresentation": true,
    "firstActor": [
      {
        "id": "inspector.15151.12586039.1",
        "location": {
          "x": 27.7,
          "y": 25.8
        },
        "target": "room.economy.mri",
        "pathLength": 40,
        "pathIndex": 29,
        "pathStart": {
          "x": 34.25,
          "y": 19.8
        }
      },
      {
        "id": "inspector.15151.12586039.1",
        "location": {
          "x": 27.7,
          "y": 25.8
        },
        "target": "room.economy.mri",
        "pathLength": 15,
        "pathIndex": 4,
        "pathStart": {
          "x": 29.7,
          "y": 25.8
        }
      }
    ],
    "reportEqual": true,
    "cash": [
      3925358,
      3925358
    ]
  },
  {
    "name": "separate-identical-contexts-control-first",
    "separateContexts": true,
    "reverseOrder": false,
    "canonicalEqual": true,
    "canonicalEqualExcludingPresentation": true,
    "firstActor": [
      {
        "id": "inspector.15151.12586039.1",
        "location": {
          "x": 27.7,
          "y": 25.8
        },
        "target": "room.economy.mri",
        "pathLength": 15,
        "pathIndex": 4,
        "pathStart": {
          "x": 29.7,
          "y": 25.8
        }
      },
      {
        "id": "inspector.15151.12586039.1",
        "location": {
          "x": 27.7,
          "y": 25.8
        },
        "target": "room.economy.mri",
        "pathLength": 15,
        "pathIndex": 4,
        "pathStart": {
          "x": 29.7,
          "y": 25.8
        }
      }
    ],
    "reportEqual": true,
    "cash": [
      3925358,
      3925358
    ]
  },
  {
    "name": "separate-identical-contexts-resumed-first",
    "separateContexts": true,
    "reverseOrder": true,
    "canonicalEqual": true,
    "canonicalEqualExcludingPresentation": true,
    "firstActor": [
      {
        "id": "inspector.15151.12586039.1",
        "location": {
          "x": 27.7,
          "y": 25.8
        },
        "target": "room.economy.mri",
        "pathLength": 15,
        "pathIndex": 4,
        "pathStart": {
          "x": 29.7,
          "y": 25.8
        }
      },
      {
        "id": "inspector.15151.12586039.1",
        "location": {
          "x": 27.7,
          "y": 25.8
        },
        "target": "room.economy.mri",
        "pathLength": 15,
        "pathIndex": 4,
        "pathStart": {
          "x": 29.7,
          "y": 25.8
        }
      }
    ],
    "reportEqual": true,
    "cash": [
      3925358,
      3925358
    ]
  }
]
```

</details>

<details>
<summary>Garden continuation diagnosis — expected reader error reproduced; canonical guard not bypassed</summary>

```json
{
  "minute": 112,
  "branch": "control",
  "facilityTick": 15344,
  "error": "The saved garden rest contract is invalid.",
  "cashCents": 3957463,
  "gardens": [
    {
      "tripId": "patient-amenity-trip.49",
      "actorId": "encounter.auto.5.255",
      "status": "returning",
      "pathIndex": 10,
      "tripPathPoint": {
        "x": 37,
        "y": 26
      },
      "lastMovedAtFacilityTick": 15344,
      "actorLocation": {
        "x": 37,
        "y": 26
      },
      "rawValidation": true,
      "actorMovement": {
        "kind": "departing_for_offsite_testing",
        "pathIndex": 6,
        "point": {
          "x": 35,
          "y": 28
        },
        "lastMovedAtFacilityTick": 15344
      }
    }
  ]
}
```

</details>

<details>
<summary>Changed report categories — exact previous/current scores and raw values</summary>

```json
[
  {
    "number": 1,
    "changed": true,
    "oldScore": 62.49398772204757,
    "newScore": 62.56333530490279,
    "oldPatients": 52,
    "newPatients": 53,
    "oldWindow": [
      16339,
      19339
    ],
    "newWindow": [
      15151,
      18151
    ],
    "categories": [
      {
        "id": "cleanliness",
        "changed": true,
        "oldScore": 78.44137931034483,
        "newScore": 79.04712643678161,
        "oldRawValues": {
          "cleanRoomMinutes": 204732,
          "observedRoomMinutes": 261000,
          "meanCleanliness": 81.88359003831418,
          "minimumCleanliness": 0
        },
        "newRawValues": {
          "cleanRoomMinutes": 206313,
          "observedRoomMinutes": 261000,
          "meanCleanliness": 82.06967816091954,
          "minimumCleanliness": 0
        }
      },
      {
        "id": "patient_satisfaction",
        "changed": true,
        "oldScore": 95,
        "newScore": 94.33962264150944,
        "oldRawValues": {
          "satisfactionSum": 4940,
          "patientCount": 52
        },
        "newRawValues": {
          "satisfactionSum": 5000,
          "patientCount": 53
        }
      },
      {
        "id": "wait_flow",
        "changed": true,
        "oldScore": 99.71590909090908,
        "newScore": 100,
        "oldRawValues": {
          "queueMinutes": 352,
          "overdueQueueMinutes": 2,
          "completed": 52,
          "walkouts": 0
        },
        "newRawValues": {
          "queueMinutes": 269,
          "overdueQueueMinutes": 0,
          "completed": 53,
          "walkouts": 0
        }
      },
      {
        "id": "finances",
        "changed": true,
        "oldScore": 100,
        "newScore": 100,
        "oldRawValues": {
          "paidPostings": 200,
          "expensePostings": 200,
          "operatingGrossCents": 2026900,
          "stockCostCents": 36425,
          "chargedOperatingExpenseCents": 1223293,
          "paidOperatingExpenseCents": 1223293,
          "operatingNetCents": 767182,
          "profitTerm": 1
        },
        "newRawValues": {
          "paidPostings": 200,
          "expensePostings": 200,
          "operatingGrossCents": 1910000,
          "stockCostCents": 37618,
          "chargedOperatingExpenseCents": 1223293,
          "paidOperatingExpenseCents": 1223293,
          "operatingNetCents": 649089,
          "profitTerm": 1
        }
      },
      {
        "id": "clinical_answer_accuracy",
        "changed": true,
        "oldScore": 80,
        "newScore": 80.3030303030303,
        "oldRawValues": {
          "correctFirstSubmissions": 56,
          "allFirstSubmissions": 70,
          "presentedButUnanswered": 0
        },
        "newRawValues": {
          "correctFirstSubmissions": 53,
          "allFirstSubmissions": 66,
          "presentedButUnanswered": 0
        }
      }
    ]
  },
  {
    "number": 2,
    "changed": true,
    "oldScore": 66.65755625217645,
    "newScore": 66.78529669066674,
    "oldPatients": 50,
    "newPatients": 51,
    "oldWindow": [
      19996,
      22996
    ],
    "newWindow": [
      18808,
      21808
    ],
    "categories": [
      {
        "id": "cleanliness",
        "changed": true,
        "oldScore": 78.29501915708812,
        "newScore": 79.9080459770115,
        "oldRawValues": {
          "cleanRoomMinutes": 204350,
          "observedRoomMinutes": 261000,
          "meanCleanliness": 81.58261302681993,
          "minimumCleanliness": 0
        },
        "newRawValues": {
          "cleanRoomMinutes": 208560,
          "observedRoomMinutes": 261000,
          "meanCleanliness": 82.08220689655172,
          "minimumCleanliness": 0
        }
      },
      {
        "id": "patient_satisfaction",
        "changed": true,
        "oldScore": 96.64,
        "newScore": 97.17647058823529,
        "oldRawValues": {
          "satisfactionSum": 4832,
          "patientCount": 50
        },
        "newRawValues": {
          "satisfactionSum": 4956,
          "patientCount": 51
        }
      },
      {
        "id": "wait_flow",
        "changed": true,
        "oldScore": 100,
        "newScore": 98.25581395348837,
        "oldRawValues": {
          "queueMinutes": 298,
          "overdueQueueMinutes": 0,
          "completed": 50,
          "walkouts": 0
        },
        "newRawValues": {
          "queueMinutes": 344,
          "overdueQueueMinutes": 12,
          "completed": 51,
          "walkouts": 0
        }
      },
      {
        "id": "finances",
        "changed": true,
        "oldScore": 100,
        "newScore": 100,
        "oldRawValues": {
          "paidPostings": 200,
          "expensePostings": 200,
          "operatingGrossCents": 1981300,
          "stockCostCents": 37711,
          "chargedOperatingExpenseCents": 1223293,
          "paidOperatingExpenseCents": 1223293,
          "operatingNetCents": 720296,
          "profitTerm": 1
        },
        "newRawValues": {
          "paidPostings": 200,
          "expensePostings": 200,
          "operatingGrossCents": 1966600,
          "stockCostCents": 36027,
          "chargedOperatingExpenseCents": 1223293,
          "paidOperatingExpenseCents": 1223293,
          "operatingNetCents": 707280,
          "profitTerm": 1
        }
      },
      {
        "id": "clinical_answer_accuracy",
        "changed": true,
        "oldScore": 100,
        "newScore": 100,
        "oldRawValues": {
          "correctFirstSubmissions": 60,
          "allFirstSubmissions": 60,
          "presentedButUnanswered": 0
        },
        "newRawValues": {
          "correctFirstSubmissions": 66,
          "allFirstSubmissions": 66,
          "presentedButUnanswered": 0
        }
      }
    ]
  },
  {
    "number": 3,
    "changed": true,
    "oldScore": 45.489710466735836,
    "newScore": 45.33910414489676,
    "oldPatients": 48,
    "newPatients": 50,
    "oldWindow": [
      23053,
      26053
    ],
    "newWindow": [
      21865,
      24865
    ],
    "categories": [
      {
        "id": "cleanliness",
        "changed": true,
        "oldScore": 78.94406130268199,
        "newScore": 78.27049808429119,
        "oldRawValues": {
          "cleanRoomMinutes": 206044,
          "observedRoomMinutes": 261000,
          "meanCleanliness": 81.83425287356322,
          "minimumCleanliness": 0
        },
        "newRawValues": {
          "cleanRoomMinutes": 204286,
          "observedRoomMinutes": 261000,
          "meanCleanliness": 81.963969348659,
          "minimumCleanliness": 0
        }
      },
      {
        "id": "patient_satisfaction",
        "changed": true,
        "oldScore": 84.3125,
        "newScore": 83.48,
        "oldRawValues": {
          "satisfactionSum": 4047,
          "patientCount": 48
        },
        "newRawValues": {
          "satisfactionSum": 4174,
          "patientCount": 50
        }
      },
      {
        "id": "wait_flow",
        "changed": true,
        "oldScore": 100,
        "newScore": 100,
        "oldRawValues": {
          "queueMinutes": 315,
          "overdueQueueMinutes": 0,
          "completed": 48,
          "walkouts": 0
        },
        "newRawValues": {
          "queueMinutes": 261,
          "overdueQueueMinutes": 0,
          "completed": 50,
          "walkouts": 0
        }
      },
      {
        "id": "finances",
        "changed": true,
        "oldScore": 100,
        "newScore": 100,
        "oldRawValues": {
          "paidPostings": 200,
          "expensePostings": 200,
          "operatingGrossCents": 1547100,
          "stockCostCents": 37922,
          "chargedOperatingExpenseCents": 1223293,
          "paidOperatingExpenseCents": 1223293,
          "operatingNetCents": 285885,
          "profitTerm": 1
        },
        "newRawValues": {
          "paidPostings": 200,
          "expensePostings": 200,
          "operatingGrossCents": 1690900,
          "stockCostCents": 38975,
          "chargedOperatingExpenseCents": 1223293,
          "paidOperatingExpenseCents": 1223293,
          "operatingNetCents": 428632,
          "profitTerm": 1
        }
      },
      {
        "id": "clinical_answer_accuracy",
        "changed": true,
        "oldScore": 0,
        "newScore": 0,
        "oldRawValues": {
          "correctFirstSubmissions": 0,
          "allFirstSubmissions": 64,
          "presentedButUnanswered": 0
        },
        "newRawValues": {
          "correctFirstSubmissions": 0,
          "allFirstSubmissions": 66,
          "presentedButUnanswered": 0
        }
      }
    ]
  }
]
```

</details>

Final results SHA-256: `2dee43e9597db1634e41f52faf88f8548177ba129494f124a7b40a2d3b26a291`. Final checkpoint fixture SHA-256: `4d9901795638014195afe5c71eea7996195b29eb64bd023d42335f16780d113e`. Unchanged guard SHA-256: `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`. The runner, lower helper, 375 input files, e2e spec, launch/integration consumer specs and launch mapping were hash-checked again before this append. Results and checkpoint JSON are UTF-8 without BOM and LF; this handoff preserves the prior plan bytes and appends UTF-8/LF only.

Backups, complete old/new input maps, the untouched prior guard, actual command logs, helper/guard/source fingerprints, checkpoint hashes and changed top-level fields, full category comparison, controlled prefix source/outputs and integrity receipts are under `.local-dev/l5-evidence-rebind4-20261017/`. Earlier history is also retained inside the delivered results JSON.

**Manager next action:** inspect the actual artifacts and controlled divergence evidence, then assign runtime fixes for the returning-garden/offsite-movement reader conflict and the independent inspector-route cache asymmetry, preserving the complete reload guard and garden validation. Also assign the stale launch golden updates. For this recorded run, `packages/game-domain/tests/level-five-launch.test.ts:63–64` would need 52 → 53 patients and 62.49398772204757 → 62.56333530490279; `apps/player/src/session/levelFiveLaunch.test.tsx:54` would need 62.49 → 62.56. Derive final expected values from the subsequent actual run after runtime fixes, since those may legitimately change the journey again. This worker intentionally leaves all such assertions and all e2e specs intact. Runtime fixes change pinned inputs and will require another honest evidence rebind before full-domain acceptance; retain this run in history. Rerun full domain and the player consumers, plus browser QA if required. Zero-failure acceptance is still open; no clinical approval is implied by software validation.

**LOCAL ONLY:** no Git, installs, agents, external messages, commit, push, deployment, publication, browser automation, owner storage access or save migration. Manager owns current-thread handoff integration, acceptance and any audited GitHub checkpoint/reminder to say **"push to GitHub"**.


<!-- BEGIN LEVEL_FIVE_LATENT_BUG_FIXES_20261017 -->
### Level 5 latent bug fixes (2026-10-17)

**Implemented and validated: all four required commands exit 0, with zero failures.** Sol worker, one bounded manager-assigned milestone, no sub-agents. Full game-domain: **4,271 passed, zero failures**. Full player: **2,166 passed**. Clinical content: **698 passed**. Root typecheck passes across all seven workspaces. The actual journey and lower-checkpoint helper both exit 0; the existing recorded-input guard and complete canonical-state continuation assertions pass in the full suite.

**Root causes and runtime changes.**

- `packages/game-domain/src/diagnostic-orders.ts`: diagnostic patient departure/return phases previously checked only ordinary patient movement. An active garden return still owned the actor, so the new offsite movement and the amenity each advanced it. The amenity ran later and wrote the actual location. Diagnostic walking now requests the amenity return and waits until that owner finishes, then rebases from the actual return endpoint. The same ownership check covers encounter and service-visitor amenity trips.
- `packages/game-domain/src/persistence.ts`: the reader previously restored the offsite movement cursor before validating the returning garden trip. For the captured legacy shape only (returning encounter garden trip, departing-for-offsite-testing movement, active diagnostic departure), it restores the raw saved location and runs the complete garden validator first. After successful validation it clears the conflicting movement and requeues the active departure, synchronizing every carrier through `replaceDiagnosticOrderPlan`. The garden trip, cursor, clocks, benefit, clinical case, rewards, cash, and completed phases remain intact. The next live advance waits for the return and recalculates the departure route. Invalid garden location, quote and clock data still throw. Other shapes retain the ordinary reader and validation behavior. This is an idempotent save-compatibility correction, with no schema-version change or blanket validator bypass.
- `packages/game-domain/src/inspection-presentation.ts`: the old context/actor-ID cache treated route validation as a shared flag even though validation also replaced and compacted each state's route. One clone changed and the next skipped that mutation. Every walking state now applies the same canonical route and cursor update. Only pure graph path queries are memoized, keyed by their source/destination within the geometry-specific graph, with a bounded cache. A retained valid route keeps its current location/cursor; changed geometry falls back to a route from the current position. Cache warmth, clone order, and reload identity cannot suppress a state update.

**Regressions and changed files.** Added `packages/game-domain/tests/level-five-latent-bugs.test.ts` (six checks) and `packages/game-domain/tests/fixtures/level-five-garden-offsite-overlap-20261017.json`. The fixture preserves the actual synthetic rebind-4 raw control save, minute 112 / tick 15344, from `.local-dev/l5-evidence-rebind4-20261017/garden-failing-control.json`; parsed-state fidelity is exact. It is independent of future regenerated checkpoints and contains no owner save data. Tests load that captured overlap, verify synchronized/idempotent migration, advance both a clean live transition and the migrated save until real offscreen departure, and retain rejection of malformed location/quote/clock data. Extended `packages/game-domain/tests/inspection-presentation.test.ts` with both clone execution orders and a warm-route versus reloaded-route continuation, comparing the entire canonical state.

The only golden changes are `packages/game-domain/tests/level-five-launch.test.ts` (52 -> 53 patients; exact score `62.49398772204757` -> **`62.56467630107139`**) and `apps/player/src/session/levelFiveLaunch.test.tsx` (`62.49` -> **`62.56`**). Values came from the actual completed first report, retained in scratch at `inspection-1-progress-state.json`; the UI's existing `inspectionScoreLabel` supplies the displayed precision. The accepted P2-E journey had 53 patients and score `62.56333530490279`; the movement fix changes that score slightly again. No other golden/assertion was changed. Final delivered paths are these tests/fixture/goldens, the three runtime files, the two authorized evidence JSON files, and this append-only plan section.

An isolated native-source probe loaded the intake versions only in memory: the raw save threw `The saved garden rest contract is invalid.`, the live transition produced overlapping owners, and canonical clones differed in both orders. The identical probe with current sources loads successfully, has no live overlap, and produces identical canonical state in both orders. Evidence: `regression-before.json`, `regression-after.json`, their logs and `regression-probe.mjs` in the scratch directory. Original source files on disk were never swapped. A focused run of the four original continuation scenarios also passed all four 120-minute comparisons before the evidence refresh; the final full suite then repeated the unchanged assertions against the new checkpoints.

**Honest evidence regeneration and provenance.** Ran exactly in this order:

```text
node tools/qa/level-five-integration-run.mjs --write
node tools/qa/level-five-integration-lower.mjs
```

Both commands exit **0**. The generator, lower helper and `packages/game-domain/tests/level-five-integration.test.ts` are byte-unchanged from intake. All runner/guard assertions remain enabled. Appended the full previous 375-input map as `inputHistory[4]`; the prior four entries are retained verbatim. Previous results SHA-256: `2dee43e9597db1634e41f52faf88f8548177ba129494f124a7b40a2d3b26a291`. The fresh run still has 375 inputs: exactly three changed, 372 unchanged, none added or removed. No replay-compatible hash exception was added.

| Input | Previous SHA-256 | Current SHA-256 |
| --- | --- | --- |
| `packages/game-domain/src/diagnostic-orders.ts` | `47f5e470ab5777fafa0f119ca74ecbd4c12adbefa8a1d05bf3380b0e6eafd4aa` | `8719c7aa390425630d77465fe67861f9d895d375c83b057a546c68f2725f8644` |
| `packages/game-domain/src/inspection-presentation.ts` | `d153e1ba5f09b54653660f332e974745effa5afd864a3250ca669a707e6649ec` | `94f0fb0fa980e841ff8c89b08cf126134bb957c61c69c392745ac5d6861f05e6` |
| `packages/game-domain/src/persistence.ts` | `13aae9e095aa2220781c43f9ca0d97f2b2fb73bcb827979cfa5681e1069ffcd2` | `2489168f74e18a94f1acf86eedb9b4fd2480333527528dcd8e27d0f86dba0b50` |

After the lower helper, only the established summary `liveCap: 4` -> validated actual context cap `5` correction and history append were applied. Raw post-helper results SHA-256: `6d0ef0b7cecc8ae8939f05933daf5cc7558cdc989363fba560ed90b921175391`. Reconstructing the raw object from final results reproduces that exact hash, proving no report, metric, input hash, goal, cash value or checkpoint was rewritten during metadata finalization. Final results SHA-256: `a30f66fe4fba13a255f15f3d351cb60e845e4ec52ba9fb749ade63a454dcbf5c`. Final checkpoint SHA-256: `0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501`.

**Actual run differences from rebind 4 (cash in cents).**

| Metric | Previous | Current | Delta |
| --- | ---: | ---: | ---: |
| `commandsReconciled` | 26717 | 26710 | -7 |
| `openingCashCents` | 1785500 | 1785500 | 0 |
| `grossCents` | 15051500 | 14994000 | -57500 |
| `stockCents` | 272826 | 271344 | -1482 |
| `paidOperatingCents` | 9641655 | 9641655 | 0 |
| `capitalCents` | 1048000 | 1048000 | 0 |
| `closingCashCents` | 5874519 | 5818501 | -56018 |
| `firstAnswers` | 545 | 543 | -2 |
| `levelFiveFirstAnswers` | 456 | 454 | -2 |
| `completedDailyRounds` | 36 | 36 | 0 |
| `positiveComfortUses` | 977 | 974 | -3 |
| `retiredReceipts` | 5369 | 5372 | 3 |
| `retiredEncounters` | 402 | 402 | 0 |

Cash reconciles exactly: 1785500 + 14994000 - 271344 - 9641655 - 1048000 = **5818501**. The closing difference is exactly -57500 gross + 1482 lower stock cost = **-56018 cents**, with identical opening cash, paid operating cost and capital. Ordinary completion/movement timing changes the actual run; no finish payout or injected adjustment was used. Level 4 advance remains tick 3965, XP goal tick 15025, unlock tick 15094 with 2014 XP / satisfaction 91 / morale 100 / nine employees. All report windows remain unchanged; the real lower retry has one fewer qualifying patient and two fewer first answers overall. Positive comfort use, daily awards, supplier savings, retirement, higher best, lower latest, and immutable first-finish assertions remain active.

| Report | Previous raw score | Current raw score | Patients | Tick window |
| --- | ---: | ---: | --- | --- |
| 1 | 62.56333530490279 | 62.56467630107139 | 53 -> 53 | 15151-18151 |
| 2 | 66.78529669066674 | 66.81366326970975 | 51 -> 51 | 18808-21808 |
| 3 | 45.33910414489676 | 45.2608970823534 | 50 -> 49 | 21865-24865 |

All nine saves remain paused with the same names, phases and ticks. `integration-l4` and `integration-build` remain individually byte-identical; the seven later raw states change. Final Level 5 XP is 3508 (previously 3512). First/second final checkpoint cash becomes 4566714 / 5450363; final lower checkpoint cash is 5818501. All nine fresh raw saves load with unchanged `levelFive` objects and no garden/offsite overlap. Exact metric/source/checkpoint audits and changed category raw values are in `evidence-audit.json` and `report-deltas.json` in scratch.

**Exact final validation output.** All npm commands used the existing preload:

```text
NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs
```

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1` - exit **0**:

```text
 Test Files  159 passed (159)
      Tests  4271 passed (4271)
   Start at  11:00:32
   Duration  988.32s (transform 5.27s, setup 0ms, import 69.28s, tests 908.05s, environment 7ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` - exit **0**:

```text
 Test Files  245 passed (245)
      Tests  2166 passed (2166)
   Start at  11:00:32
   Duration  80.29s (transform 15.43s, setup 0ms, import 133.68s, tests 164.99s, environment 15ms)
```

`npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1` - exit **0**:

```text
 Test Files  89 passed (89)
      Tests  698 passed (698)
   Start at  10:40:26
   Duration  31.07s (transform 2.94s, setup 0ms, import 20.32s, tests 4.23s, environment 5ms)
```

`npm.cmd run typecheck` - exit **0**:

```text
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
```

Focused regressions plus existing inspector geometry, garden support and diagnostic-order tests - exit **0**:

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/level-five-latent-bugs.test.ts tests/inspection-presentation.test.ts tests/level-five-support.test.ts tests/diagnostic-orders.test.ts
 Test Files  4 passed (4)
      Tests  76 passed (76)
   Start at  10:39:14
   Duration  44.74s (transform 2.53s, setup 0ms, import 5.22s, tests 39.24s, environment 0ms)
```

Complete baseline originals, the actual source/test diff, synthetic captured states, source/provenance audits and raw command logs are in **`.local-dev/level-five-latent-fixes-20261017/`**. Final source/test/evidence files are UTF-8 without BOM and LF. Protected content/player/driver source hashes are unchanged except the explicitly assigned player golden; clinical source remains byte-identical, with its existing review status preserved. The expected Node experimental TypeScript-transform warning appears in native-source command logs; those commands still exit 0.

**Manager handoff / next action:** inspect the actual scoped diff and raw evidence, accept this bounded milestone, integrate the current-thread handoff, and perform manager-side validation as required. No unresolved decision or known failing test remains in this lane. No assertion was disabled and no test was skipped for this task. **LOCAL ONLY:** this worker used no Git, installs, network, sub-agents, external messages, owner browser/storage, commit, push, deployment or publication. Manager owns the audited GitHub checkpoint/reminder to say **"push to GitHub"**. Opening pathways remain `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the intended persistent profile and canonical remote `https://melissarowlandc-afk.github.io/GamifySurgery/`, with separate saves. No launcher, server, profile, origin or served build was changed.

<!-- END LEVEL_FIVE_LATENT_BUG_FIXES_20261017 -->

### Level 5 evidence rebind 6 (2026-10-17)

**Actual evidence rebind completed; required validation passes with zero failures.** The unchanged reducer journey and lower-checkpoint helper were rerun against the manager-accepted B2.1b observer hooks and nutrition tester-flag wording fix. All original assertions remain active, including the three completed reports, higher best/lower latest, immutable first finish, earned XP, retirement, supplier savings, positive comfort use, daily-round accounting and per-command/lifetime integer-cent cash reconciliation. The run reconciles 26710 commands (>20,000). No browser, seeded report, alternate balance or installed observer scope was used.

**Owned artifacts.** The results JSON is regenerated with current input hashes and the previous complete input map appended as `inputHistory[5]`; all 5 earlier entries remain unchanged. The checkpoint fixture was regenerated by the actual tools and has changed bytes as detailed below. This is an append-only handoff. The guard `packages/game-domain/tests/level-five-integration.test.ts` is byte-identical (SHA-256 `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`); no assertion, allow-list or replay-compatible exception was added or changed. Source, content, player tests, e2e specs and the shared current-thread handoff remain outside this worker's edits.

**Input provenance.** Previous results SHA-256 `a30f66fe4fba13a255f15f3d351cb60e845e4ec52ba9fb749ade63a454dcbf5c`. The previous 375-input map is retained in full, along with its helper artifact hash and version/seed/cap metadata. This run records 378 inputs: three changed existing files, three new modules, 372 equal existing hashes and no removed inputs. History now has 6 entries.

| Input | Previous SHA-256 | Current SHA-256 |
| --- | --- | --- |
| `packages/clinical-content/src/development-batch/2026-10-07-variety-2/nutrition.ts` | `e517d0dec2664b83be124dae2bc9c616e5cd3cf8269d3e9f527bd868c8175111` | `97ed9c5c8422c7928b45738d645883bac43689f7576219a0c3dd6e86d871cb6c` |
| `packages/game-domain/src/game-evidence-capture.ts` | New file; not previously recorded | `b0397262f4a5009397fb366baf08ecfa83744caf3bc80e9dfd88714949c0975f` |
| `packages/game-domain/src/game-evidence-json.ts` | New file; not previously recorded | `c123e617124936a4b846369dc68592c810503b0779ae33a3ef5c4bd82a8a1650` |
| `packages/game-domain/src/game-evidence.ts` | New file; not previously recorded | `fe67f56bba365dc6f3a459fd6c06f907784f92ee483cbe6a1041347af045a714` |
| `packages/game-domain/src/index.ts` | `3045ff30cb0cf9701d6220ac506135db811a206e112fba788fa90c58b18bfa7b` | `1389c04a3c49479ce6d0bdea427a290d791f437b62f9d271856517e0e0d4e879` |
| `packages/game-domain/src/reducer.ts` | `daf3be68ec8134205113fc7be6136b5a0fdcf7b3d93149a9ffeab83c7599d1f6` | `d4424125c52ba7f9a494f221b7c2933bcdace971ff3d34f22380f77bc3f6f19e` |

The generator order is `node tools/qa/level-five-integration-run.mjs --write`, then `node tools/qa/level-five-integration-lower.mjs`. After both finish, the only non-history postprocessing is the established `liveCap: 4` summary literal → actual validated context cap `5`. Raw post-helper results SHA-256 before metadata/history postprocessing: `21b620e3de08e87b523d9251be8cb14497cca553addb2c47b8bb61a2c84dc9ca`. No run counter, score, input hash, cash amount or checkpoint payload was adjusted after generation.

**Run numbers (cash is cents).** Seed `level-five-m9.integration.01`, version `level-five-m9-integration.v1`. Every non-provenance results field is deeply equal to the previous actual run, including all three complete report objects and all cash terms.

| Metric | Previous | Current | Delta |
| --- | ---: | ---: | ---: |
| `commandsReconciled` | 26710 | 26710 | 0 |
| `openingCashCents` | 1785500 | 1785500 | 0 |
| `grossCents` | 14994000 | 14994000 | 0 |
| `stockCents` | 271344 | 271344 | 0 |
| `paidOperatingCents` | 9641655 | 9641655 | 0 |
| `capitalCents` | 1048000 | 1048000 | 0 |
| `closingCashCents` | 5818501 | 5818501 | 0 |
| `levelFourAdvanceTick` | 3965 | 3965 | 0 |
| `xpGoalTick` | 15025 | 15025 | 0 |
| `firstAnswers` | 543 | 543 | 0 |
| `levelFiveFirstAnswers` | 454 | 454 | 0 |
| `completedDailyRounds` | 36 | 36 | 0 |
| `positiveComfortUses` | 974 | 974 | 0 |
| `retiredReceipts` | 5372 | 5372 | 0 |
| `retiredEncounters` | 402 | 402 | 0 |
| `finishNotices` | 0 | 0 | 0 |

Exact cash equation: 1785500 + 14994000 − 271344 − 9641655 − 1048000 = **5818501**. Closing delta: **0 cents**. Supplier savings: stock 1956 → 1956 cents; upkeep 710700 → 710700 sixtieth-cents. Inspection unlock is `{"version":"level-five-inspection-unlock.v1","earnedAtFacilityTick":15094,"clinicalXp":2014,"displayedSatisfaction":91,"averageStaffMorale":100,"employedStaffCount":9}`. The three 3,000-minute completed reports still each exceed the 20-patient minimum; report 2 is best, report 3 latest and report 1 the durable first finish.

| Report | Previous raw score | Current raw score | Patients, previous → current | Tick window, previous → current |
| --- | ---: | ---: | ---: | --- |
| 1 | 62.56467630107139 | 62.56467630107139 | 53 → 53 | 15151–18151 → 15151–18151 |
| 2 | 66.81366326970975 | 66.81366326970975 | 51 → 51 | 18808–21808 → 18808–21808 |
| 3 | 45.2608970823534 | 45.2608970823534 | 49 → 49 | 21865–24865 → 21865–24865 |

Complete report equality: **true**. The observer implementation is opt-in: `game-evidence-capture.ts` holds an undefined observer outside `withGameEvidenceObserver`; its three capture functions use optional calls. The ordinary journey never enters that capture scope. An independent read-only scope audit removed only the observer import plus three calls from an in-memory source string and reproduced the prior recorded reducer hash exactly; removing the one new public export likewise reproduced the prior index hash. This was a text/hash check, not a modified-source gameplay run; all hooks remained present in the actual journey. Receipt: `.local-dev/l5-evidence-rebind6-20261017/observer-scope-proof.json`. The accepted nutrition change concerns `question.gs028f.nutrition.high-risk-refeeding-thiamine-planning.v4` wording. The new source bytes are pinned honestly; the save and run comparisons below show the measured effect rather than assuming equivalence from those descriptions.

**Saves and consumers.** Changed saves: `integration-lower-repeat`. Scenario names, pause state and phase contracts remain unchanged. Exact changed leaf paths and their previous/current value hashes are retained in the comparison receipt.

For the actual changed save, all 18 differing leaves are strings beneath `encounters.encounter.auto.5.416.frozenCase` (`case.gs028f.nutrition.c2-plan-entry-audit`). They comprise the case presentation, four instantiation-profile presentations, question stem, four answer labels, explanation, six terminal-disposition narratives/rationales and learning summary. No ID, answer, review, profile constraint, clinical-review status, clock, actor path, score, cash or other state field differs. The other eight saves are byte-identical when individually serialized. Proof: `.local-dev/l5-evidence-rebind6-20261017/wording-only-proof.json`.

| Save | Changed? | Previous tick / XP / cash cents | Current tick / XP / cash cents |
| --- | --- | ---: | ---: |
| `integration-l4` | Identical | 3965 / 754 / 2656300 | 3965 / 754 / 2656300 |
| `integration-build` | Identical | 3965 / 0 / 1608300 | 3965 / 0 / 1608300 |
| `integration-preparing` | Identical | 15094 / 2014 / 3926777 | 15094 / 2014 / 3926777 |
| `integration-running` | Identical | 15231 / 2026 / 3925358 | 15231 / 2026 / 3925358 |
| `integration-final` | Identical | 18150 / 2572 / 4566714 | 18150 / 2572 / 4566714 |
| `integration-finish` | Identical | 18151 / 2572 / 4566714 | 18151 / 2572 / 4566714 |
| `integration-repeat-final` | Identical | 21807 / 3378 / 5450363 | 21807 / 3378 / 5450363 |
| `integration-repeat` | Identical | 21808 / 3378 / 5450363 | 21808 / 3378 / 5450363 |
| `integration-lower-repeat` | Changed | 24865 / 3508 / 5818501 | 24865 / 3508 / 5818501 |

`tests/e2e/level-five.spec.ts` still consumes these nine scenarios and is unchanged (SHA-256 `8697e951007e63caa70325c8ef18f19334c1ed8e31543acd4295cb941bb4e459`). The additional Level 5 integration/launch player consumer check passes. Browser QA was not run in this Node-only task. No owner campaign, browser profile, opening origin, launcher or persisted owner save was accessed or migrated.

**Validation.** Required full game-domain exits 0: Test Files  160 passed (160); Tests  4292 passed (4292); Start at  16:37:42; Duration  977.30s (transform 4.85s, setup 0ms, import 68.32s, tests 898.10s, environment 7ms). Required root typecheck exits 0 across all seven workspaces. Additional two-file player consumer check exits 0: Test Files  2 passed (2); Tests  33 passed (33); Start at  16:37:42; Duration  12.97s (transform 4.78s, setup 0ms, import 7.66s, tests 5.15s, environment 0ms). All npm validation uses the existing `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload. Exact command output follows; native-source logs retain the expected experimental TypeScript-transform warnings.

<details>
<summary>Actual unchanged journey — exit 0</summary>

```text
node tools/qa/level-five-integration-run.mjs --write
L4 10h, 114 XP
L4 20h, 210 XP
L4 30h, 334 XP
L4 40h, 450 XP
L4 50h, 566 XP
L4 60h, 692 XP
L5 70h, 52 XP
L5 80h, 146 XP
L5 90h, 250 XP
L5 100h, 366 XP
L5 110h, 472 XP
L5 120h, 576 XP
L5 130h, 702 XP
L5 140h, 796 XP
L5 150h, 902 XP
L5 160h, 1028 XP
L5 170h, 1122 XP
L5 180h, 1218 XP
L5 190h, 1354 XP
L5 200h, 1458 XP
L5 210h, 1564 XP
L5 220h, 1668 XP
L5 230h, 1764 XP
L5 240h, 1878 XP
L5 250h, 1994 XP
Inspection 1: 62.56467630107139, 53/20
Inspection 2: 66.81366326970975, 51/20
Inspection 3: 45.2608970823534, 49/20
{
  "commands": 26710,
  "closingCashCents": 5818501,
  "xpGoalTick": 15025,
  "unlock": {
    "version": "level-five-inspection-unlock.v1",
    "earnedAtFacilityTick": 15094,
    "clinicalXp": 2014,
    "displayedSatisfaction": 91,
    "averageStaffMorale": 100,
    "employedStaffCount": 9
  },
  "snapshots": {
    "integration-l4": {
      "tick": 3965,
      "xp": 754,
      "phase": null
    },
    "integration-build": {
      "tick": 3965,
      "xp": 0,
      "phase": "locked"
    },
    "integration-preparing": {
      "tick": 15094,
      "xp": 2014,
      "phase": "preparing"
    },
    "integration-running": {
      "tick": 15231,
      "xp": 2026,
      "phase": "running"
    },
    "integration-final": {
      "tick": 18150,
      "xp": 2572,
      "phase": "running"
    },
    "integration-finish": {
      "tick": 18151,
      "xp": 2572,
      "phase": "completed"
    },
    "integration-repeat-final": {
      "tick": 21807,
      "xp": 3378,
      "phase": "running"
    },
    "integration-repeat": {
      "tick": 21808,
      "xp": 3378,
      "phase": "completed"
    }
  },
  "reports": [
    {
      "score": 62.56467630107139,
      "patients": 53
    },
    {
      "score": 66.81366326970975,
      "patients": 51
    },
    {
      "score": 45.2608970823534,
      "patients": 49
    }
  ]
}
node : (node:13180) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-run.mjs --write *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:13180) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Actual unchanged lower-checkpoint helper — exit 0</summary>

```text
node tools/qa/level-five-integration-lower.mjs
M9 lower retry checkpoint PASS: latest 45.2608970823534, best 66.81366326970975, immutable first 62.56467630107139.
node : (node:13996) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-lower.mjs *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:13996) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Required full game-domain — exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  160 passed (160)
      Tests  4292 passed (4292)
   Start at  16:37:42
   Duration  977.30s (transform 4.85s, setup 0ms, import 68.32s, tests 898.10s, environment 7ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Required root typecheck — exit 0</summary>

```text
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

EXIT_CODE=0
```

</details>

<details>
<summary>Additional Level 5 player consumers — exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1

> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  16:37:42
   Duration  12.97s (transform 4.78s, setup 0ms, import 7.66s, tests 5.15s, environment 0ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Actual changed checkpoint leaf paths and value fingerprints</summary>

```json
[
  {
    "name": "integration-lower-repeat",
    "changed": true,
    "leafChangeCount": 18,
    "oldSha256": "c8cac7105ec5d9ddcc28948e7789776ac5fb4febfb0101efb4454fb12d5e5f7d",
    "newSha256": "d0bd2d1903dd4ba471ff2dc24e5acf0113b3dcc64acedd786abd7eec73c01f52",
    "changes": [
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.presentation",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "272746a917cef626c4348bf1e230103e99833ac851709a68e03bd35b4cdc3177",
        "newSha256": "8c6b3610c14edbb65cd58b2295a0101f2a3909d83fffd3ea0e177fe563176a03"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.approvedInstantiationProfiles.0.presentation",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "005f5943245009abd21c880612be2a3a670831cdc7a79cbe0db81198da6fda08",
        "newSha256": "657c5b805a2c082dc5d920ac82e834cb8bd1ae7c619b8b64b31448f7cdde5782"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.approvedInstantiationProfiles.1.presentation",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "4af9bc5307acd51e57b72d7dfc03f90de0c35b07bd4481b084f1bb905ddd36f7",
        "newSha256": "f52297f38debdfd08b724aeeda482eff70a872087948954c9e12a1649f462ea2"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.approvedInstantiationProfiles.2.presentation",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "272746a917cef626c4348bf1e230103e99833ac851709a68e03bd35b4cdc3177",
        "newSha256": "8c6b3610c14edbb65cd58b2295a0101f2a3909d83fffd3ea0e177fe563176a03"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.approvedInstantiationProfiles.3.presentation",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "18cd47d69b3b3980f3004f295453ca8fc1b743bcf18682cba8125e82126074f9",
        "newSha256": "d26e72f6d452a59cf7110f1f9841e37e03f8692d283dcc34a540125dda30cdba"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.stem",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "1aba44bb0fff4bac6183a2e5d5ee2f1acaeb5174b1cedcc67944c3e8f35b53a6",
        "newSha256": "bc20197f2c0813aab0e5ab874efb8b08cece19c64b67b416757ed5325ff47377"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.answerChoices.0.label",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "a08be81b511575497a917ab422afc82d995fafc7685f036ff58a258f707030cb",
        "newSha256": "e07a00a4c5e1e348332e386525678ef53849a18c87eb602b15df2e358cbc2922"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.answerChoices.1.label",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "cb233231be088fd1cc02633b012111dd03afe6fbfa1f78a0e7c516ce351e5aaa",
        "newSha256": "0baab6949d4654fddcdc01c2da6c63255a0922c1a96e9da707f491308b6c0596"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.answerChoices.2.label",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "5d8326e881c7fee7f8a5f791e36cdbca958e505057c9c5acf4b9e631dab7ca25",
        "newSha256": "24b5a97e7c70ec6665785d76e0cd51a1d0b00dc7f26b3481e789cd4782f439db"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.answerChoices.3.label",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "3ef78546bc093488daba7f4cbc5a678432e086bdf00d28bbb893d67e03c26b58",
        "newSha256": "e847ce47321a303dc80ba8234a06549d295eb3176fd7f9f7af4b2e764721f230"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.explanation",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "d42e59da0113907d5f45980da4eea0662b1d8666911fa7db4e4ff2068e145aba",
        "newSha256": "e438eb0437467dc61ba891874abfe04f4fa001c48888b06d73976fbc998bf9f0"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.terminalDispositions.0.consequenceNarrative",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "30ddc615a6ea51e62621d55314dba4302caa84f3d55185d4c7215680f90e7acc",
        "newSha256": "35ea6716fdfb8e9aa0d21b8f66a2f0507bc5577d3862951cc62f4cb13cf087a8"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.terminalDispositions.0.clinicalRationale",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "d42e59da0113907d5f45980da4eea0662b1d8666911fa7db4e4ff2068e145aba",
        "newSha256": "e438eb0437467dc61ba891874abfe04f4fa001c48888b06d73976fbc998bf9f0"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.terminalDispositions.1.consequenceNarrative",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "c79c62bac1cd7ae72fd83c576b86f0083bfb6e0979c9a92b245d591936faafa7",
        "newSha256": "9a23d42c36a9ff81f6ba57b54761ab43dc442d33a5f9cdfa0bed64209030aeb6"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.terminalDispositions.1.clinicalRationale",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "d42e59da0113907d5f45980da4eea0662b1d8666911fa7db4e4ff2068e145aba",
        "newSha256": "e438eb0437467dc61ba891874abfe04f4fa001c48888b06d73976fbc998bf9f0"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.terminalDispositions.2.consequenceNarrative",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "745b0db69f768c06be5efba162a92ed224ff5c1c3b903ce3dc5dd38c74d37c84",
        "newSha256": "04161ca1847643f56aab8eec0ecef62309aa3647284423810bf36d76dfe8e532"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.decisionNodes.0.terminalDispositions.2.clinicalRationale",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "d42e59da0113907d5f45980da4eea0662b1d8666911fa7db4e4ff2068e145aba",
        "newSha256": "e438eb0437467dc61ba891874abfe04f4fa001c48888b06d73976fbc998bf9f0"
      },
      {
        "path": "integration-lower-repeat.encounters.encounter.auto.5.416.frozenCase.learningSummary",
        "oldType": "string",
        "newType": "string",
        "oldSha256": "d42e59da0113907d5f45980da4eea0662b1d8666911fa7db4e4ff2068e145aba",
        "newSha256": "e438eb0437467dc61ba891874abfe04f4fa001c48888b06d73976fbc998bf9f0"
      }
    ]
  }
]
```

</details>

Final results SHA-256: `3e99680f99727674c2858414d8580acd2c765f21da441f998818791e2c4b6e7c`. Regenerated checkpoint fixture SHA-256: `8a5df5958d85d1a9271ceaf35215793aa4e31318f0afe744a4e7c9f1f9384e73`. Protected source/input/helper/guard/player/e2e hashes were rechecked. The delivered JSON and appended handoff use UTF-8 without BOM, LF and a trailing newline; all prior plan bytes are preserved.

Backups, the complete prior run/input maps, current input fingerprints, actual tool output, result/cash/report comparisons, per-save hashes and changed leaf paths are retained under `.local-dev/l5-evidence-rebind6-20261017/`. No required validation failure or unresolved runtime issue was found in this bounded rebind. Manager owns review, acceptance, current-thread handoff integration and any GitHub checkpoint/reminder to say **"push to GitHub"**. **LOCAL ONLY:** no Git, installs, sub-agents, external messages, content edits, runtime edits, guard/test edits, browser automation, deployment or publication.

### Level 5 evidence rebind 7 (2026-10-18, manager note)

The rebind-7 worker regenerated the evidence for the B2.4 game-evidence.ts change, but its process ended before appending its handoff. Manager verification: packages/game-domain/tests/level-five-integration.test.ts passes 36/36 against the current sources (the input-hash guard matches), so the delivered evidence is bound to current inputs. The worker's local receipts are under .local-dev (running-status.json). Full game-domain acceptance reruns at the next release.

### Level 5 evidence rebind 7 (2026-10-17)

**Actual evidence rebind completed; required validation passes with zero failures.** The unchanged reducer journey and lower-checkpoint helper were rerun against the manager-accepted B2.4 additive append-only cloud Undo evidence support. All original assertions remain active, including three completed reports, higher best/lower latest, immutable first finish, earned XP, retirement, supplier savings, positive comfort use, daily-round accounting and per-command/lifetime integer-cent cash reconciliation. The actual run reconciles 26710 commands (>20,000).

**Files and ownership.** `tools/qa/level-five-integration-results-20261012.json` is regenerated with current input hashes and the previous complete input map appended as `inputHistory[6]`; all 6 earlier entries remain unchanged. `tests/fixtures/level-five-integration-checkpoints-20261012.json` was regenerated by the actual tools and is byte-identical to its previous version. This plan receives only the present appended handoff. The guard `packages/game-domain/tests/level-five-integration.test.ts` is byte-identical (SHA-256 `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`); all assertions and strict input checks remain unchanged. Runtime/content sources, tests and e2e specs were not edited. The concurrent B2.5 cloud-capacity e2e/docs lane and the manager-owned current-thread handoff were left alone.

**Input provenance.** The before/current SHA-256 pair below matches the accepted B2.4 handoff in `docs/execplans/beta2-cloud-saves-20261017.md`. Previous results SHA-256: `3e99680f99727674c2858414d8580acd2c765f21da441f998818791e2c4b6e7c`. The previous 378-input map is retained in full, together with its helper artifact hash and version/seed/cap metadata. The current run binds 378 inputs: one changed existing file, 377 equal existing hashes, no new or removed inputs. History now has 7 entries.

| Input | Previous SHA-256 | Current SHA-256 |
| --- | --- | --- |
| `packages/game-domain/src/game-evidence.ts` | `fe67f56bba365dc6f3a459fd6c06f907784f92ee483cbe6a1041347af045a714` | `82b9af0c1e70bf6d6bfd7b10dd2075093ebce2294b76a3a211839912ec8568e0` |

The generator order is `node tools/qa/level-five-integration-run.mjs --write`, then `node tools/qa/level-five-integration-lower.mjs`. After both finish, the only non-history postprocessing is the established `liveCap: 4` summary literal -> actual validated context cap `5`. Raw post-helper results SHA-256 before metadata/history postprocessing: `c91a5ede3d546be15a42ec3b05db8bc4a8c318cca1b74463a3bb3cd0351beb67`. No run counter, score, input hash, cash amount or checkpoint payload was adjusted after generation. No replay-compatible input exception was introduced.

**Run numbers (cash is cents).** Seed `level-five-m9.integration.01`, version `level-five-m9-integration.v1`. Every non-provenance results field is deeply equal to the previous actual run, including all three complete report objects and every cash term.

| Metric | Previous | Current | Delta |
| --- | ---: | ---: | ---: |
| `commandsReconciled` | 26710 | 26710 | 0 |
| `openingCashCents` | 1785500 | 1785500 | 0 |
| `grossCents` | 14994000 | 14994000 | 0 |
| `stockCents` | 271344 | 271344 | 0 |
| `paidOperatingCents` | 9641655 | 9641655 | 0 |
| `capitalCents` | 1048000 | 1048000 | 0 |
| `closingCashCents` | 5818501 | 5818501 | 0 |
| `levelFourAdvanceTick` | 3965 | 3965 | 0 |
| `xpGoalTick` | 15025 | 15025 | 0 |
| `firstAnswers` | 543 | 543 | 0 |
| `levelFiveFirstAnswers` | 454 | 454 | 0 |
| `completedDailyRounds` | 36 | 36 | 0 |
| `positiveComfortUses` | 974 | 974 | 0 |
| `retiredReceipts` | 5372 | 5372 | 0 |
| `retiredEncounters` | 402 | 402 | 0 |
| `finishNotices` | 0 | 0 | 0 |

Exact cash equation: 1785500 + 14994000 - 271344 - 9641655 - 1048000 = **5818501**. Closing delta: **0 cents**. Supplier savings: stock 1956 -> 1956 cents; upkeep 710700 -> 710700 sixtieth-cents. Inspection unlock: `{"version":"level-five-inspection-unlock.v1","earnedAtFacilityTick":15094,"clinicalXp":2014,"displayedSatisfaction":91,"averageStaffMorale":100,"employedStaffCount":9}`. Each completed report observes 3,000 active minutes and exceeds the 20-patient minimum. Report 2 remains best, report 3 latest and report 1 the immutable first finish.

| Report | Previous raw score | Current raw score | Patients, previous -> current | Tick window, previous -> current |
| --- | ---: | ---: | ---: | --- |
| 1 | 62.56467630107139 | 62.56467630107139 | 53 -> 53 | 15151-18151 -> 15151-18151 |
| 2 | 66.81366326970975 | 66.81366326970975 | 51 -> 51 | 18808-21808 -> 18808-21808 |
| 3 | 45.2608970823534 | 45.2608970823534 | 49 -> 49 | 21865-24865 -> 21865-24865 |

Complete report equality: **true**. The B2.4 handoff describes an additive cloud Undo evidence API in the only changed input. This run retains those accepted source bytes, uses the actual ordinary reducer journey, and compares its complete outputs against the previous run. The comparison finds no changed run numbers, report objects or save payloads; no behavioral adjustment or normalization was needed.

**Saves and consumers.** All nine checkpoint saves are byte-identical when individually serialized; no save has changed. Scenario names, paused-state and phase contracts remain unchanged. The whole regenerated fixture is also byte-identical, including formatting and its trailing newline.

| Save | Changed? | Previous tick / XP / cash cents | Current tick / XP / cash cents |
| --- | --- | ---: | ---: |
| `integration-l4` | Identical | 3965 / 754 / 2656300 | 3965 / 754 / 2656300 |
| `integration-build` | Identical | 3965 / 0 / 1608300 | 3965 / 0 / 1608300 |
| `integration-preparing` | Identical | 15094 / 2014 / 3926777 | 15094 / 2014 / 3926777 |
| `integration-running` | Identical | 15231 / 2026 / 3925358 | 15231 / 2026 / 3925358 |
| `integration-final` | Identical | 18150 / 2572 / 4566714 | 18150 / 2572 / 4566714 |
| `integration-finish` | Identical | 18151 / 2572 / 4566714 | 18151 / 2572 / 4566714 |
| `integration-repeat-final` | Identical | 21807 / 3378 / 5450363 | 21807 / 3378 / 5450363 |
| `integration-repeat` | Identical | 21808 / 3378 / 5450363 | 21808 / 3378 / 5450363 |
| `integration-lower-repeat` | Identical | 24865 / 3508 / 5818501 | 24865 / 3508 / 5818501 |

`tests/e2e/level-five.spec.ts` remains unchanged (SHA-256 `8697e951007e63caa70325c8ef18f19334c1ed8e31543acd4295cb941bb4e459`). The additional Level 5 integration/launch player consumer check passes. Browser QA was not run in this Node-only task. No owner campaign, browser profile, opening origin, launcher or persisted owner save was accessed or migrated.

**Validation.** Required full game-domain exits 0: Test Files  161 passed (161); Tests  4296 passed (4296); Start at  20:22:55; Duration  1414.46s (transform 5.82s, setup 0ms, import 85.61s, tests 1316.77s, environment 8ms). Required root typecheck exits 0 across all seven workspaces. Additional two-file player consumer check exits 0: Test Files  2 passed (2); Tests  33 passed (33); Start at  20:46:39; Duration  10.99s (transform 3.64s, setup 0ms, import 6.02s, tests 4.83s, environment 0ms). All npm validation uses the existing `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload. Complete exact command output follows, with Windows line endings normalized to LF; native-source logs retain their expected experimental TypeScript-transform warnings.

The initial required full-domain attempt, launched alongside typecheck/player validation, exited 1: Test Files  1 failed | 160 passed (161); Tests  5 failed | 4291 passed (4296); Start at  19:59:02; Duration  1390.91s (transform 17.23s, setup 0ms, import 89.05s, tests 1290.41s, environment 7ms). The original recorded-input hash check passed. All five failures were existing time limits: four `Test timed out in 30000ms` continuation cases and one `Test timed out in 300000ms` lower-retry case. There was no reported value/assertion-difference failure. The full failed output is retained below. The exact required domain command was then repeated with no other validation running in this worker and passed, with unchanged source, fixture, guard, assertions and timeout settings. No CI timeout mode, additional timeout flag or skipped test was used.

The first additional player consumer run, concurrent with domain/typecheck, exited 1: Test Files  1 failed | 1 passed (2); Tests  2 failed | 31 passed (33); Start at  19:59:03; Duration  62.45s (transform 22.57s, setup 0ms, import 37.36s, tests 24.49s, environment 1ms). Both failures were the existing 5,000ms timeout in `opens the actual first report once on phone=false/true and keeps playing across reload/shell changes`. The complete failed output is preserved below. After the full domain run ended, the exact same player command was repeated alone and passed. The identical regenerated fixture and unchanged test files, together with the isolated pass, are consistent with execution contention; this is an inference, not a claimed change in fixture behavior. No timeout, test, runtime or assertion was edited to obtain that pass.

<details>
<summary>Actual unchanged journey - exit 0</summary>

```text
node tools/qa/level-five-integration-run.mjs --write
L4 10h, 114 XP
L4 20h, 210 XP
L4 30h, 334 XP
L4 40h, 450 XP
L4 50h, 566 XP
L4 60h, 692 XP
L5 70h, 52 XP
L5 80h, 146 XP
L5 90h, 250 XP
L5 100h, 366 XP
L5 110h, 472 XP
L5 120h, 576 XP
L5 130h, 702 XP
L5 140h, 796 XP
L5 150h, 902 XP
L5 160h, 1028 XP
L5 170h, 1122 XP
L5 180h, 1218 XP
L5 190h, 1354 XP
L5 200h, 1458 XP
L5 210h, 1564 XP
L5 220h, 1668 XP
L5 230h, 1764 XP
L5 240h, 1878 XP
L5 250h, 1994 XP
Inspection 1: 62.56467630107139, 53/20
Inspection 2: 66.81366326970975, 51/20
Inspection 3: 45.2608970823534, 49/20
{
  "commands": 26710,
  "closingCashCents": 5818501,
  "xpGoalTick": 15025,
  "unlock": {
    "version": "level-five-inspection-unlock.v1",
    "earnedAtFacilityTick": 15094,
    "clinicalXp": 2014,
    "displayedSatisfaction": 91,
    "averageStaffMorale": 100,
    "employedStaffCount": 9
  },
  "snapshots": {
    "integration-l4": {
      "tick": 3965,
      "xp": 754,
      "phase": null
    },
    "integration-build": {
      "tick": 3965,
      "xp": 0,
      "phase": "locked"
    },
    "integration-preparing": {
      "tick": 15094,
      "xp": 2014,
      "phase": "preparing"
    },
    "integration-running": {
      "tick": 15231,
      "xp": 2026,
      "phase": "running"
    },
    "integration-final": {
      "tick": 18150,
      "xp": 2572,
      "phase": "running"
    },
    "integration-finish": {
      "tick": 18151,
      "xp": 2572,
      "phase": "completed"
    },
    "integration-repeat-final": {
      "tick": 21807,
      "xp": 3378,
      "phase": "running"
    },
    "integration-repeat": {
      "tick": 21808,
      "xp": 3378,
      "phase": "completed"
    }
  },
  "reports": [
    {
      "score": 62.56467630107139,
      "patients": 53
    },
    {
      "score": 66.81366326970975,
      "patients": 51
    },
    {
      "score": 45.2608970823534,
      "patients": 49
    }
  ]
}
node : (node:28820) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-run.mjs --write *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:28820) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Actual unchanged lower-checkpoint helper - exit 0</summary>

```text
node tools/qa/level-five-integration-lower.mjs
M9 lower retry checkpoint PASS: latest 45.2608970823534, best 66.81366326970975, immutable first 62.56467630107139.
node : (node:29632) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-lower.mjs *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:29632) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Initial required full game-domain, concurrent start - exit 1, five existing timeouts</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 5 failed) 610146ms
     × matches continued play after save/reload at integration-preparing 59651ms
     × matches continued play after save/reload at integration-running 67522ms
     × matches continued play after save/reload at integration-final 46975ms
     × matches continued play after save/reload at integration-finish 51127ms
     × continues normal operations, completes a genuinely lower retry and retains the higher best and first finish 379736ms
npm.cmd : 
At line:4 char:1
+ npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=th ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after 
save/reload at integration-preparing
 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after 
save/reload at integration-running
 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after 
save/reload at integration-final
 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > matches continued play after 
save/reload at integration-finish
Error: Test timed out in 30000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ tests/level-five-integration.test.ts:119:112
    117|   });
    118|
    119|   it.each(["integration-preparing", "integration-running", "integratio…
       |                                                                                                               
 ^
    120|     // Use the unnormalized continuous-play checkpoint, not a QA facto…
    121|     // has already passed through the reader and could conceal a clock…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > continues normal operations, 
completes a genuinely lower retry and retains the higher best and first finish
Error: Test timed out in 300000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ tests/level-five-integration.test.ts:143:3
    141|   }, hostedTime(30_000));
    142|
    143|   it("continues normal operations, completes a genuinely lower retry a…
       |   ^
    144|     const opening = stateOf("integration-repeat"), first = structuredC…
    145|     const journey = new LevelFiveIntegrationJourney(context, opening);…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯


 Test Files  1 failed | 160 passed (161)
      Tests  5 failed | 4291 passed (4296)
   Start at  19:59:02
   Duration  1390.91s (transform 17.23s, setup 0ms, import 89.05s, tests 1290.41s, environment 7ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
EXIT_CODE=1
```

</details>

<details>
<summary>Required full game-domain - exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  161 passed (161)
      Tests  4296 passed (4296)
   Start at  20:22:55
   Duration  1414.46s (transform 5.82s, setup 0ms, import 85.61s, tests 1316.77s, environment 8ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Required root typecheck - exit 0</summary>

```text
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

EXIT_CODE=0
```

</details>

<details>
<summary>Initial additional player consumers, concurrent run - exit 1, two 5000ms timeouts</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1

> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

 ❯ src/session/levelFiveIntegration.test.tsx (17 tests | 2 failed) 21681ms
     × opens the actual first report once on phone=false and keeps playing across reload/shell changes 5675ms
     × opens the actual first report once on phone=true and keeps playing across reload/shell changes 5036ms
npm.cmd : 
At line:4 char:1
+ npm.cmd run test --workspace @gamify-surgery/player -- src/session/le ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/session/levelFiveIntegration.test.tsx > M9 actual integration in desktop and mobile shells > opens the 
actual first report once on phone=false and keeps playing across reload/shell changes
 FAIL  src/session/levelFiveIntegration.test.tsx > M9 actual integration in desktop and mobile shells > opens the 
actual first report once on phone=true and keeps playing across reload/shell changes
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/session/levelFiveIntegration.test.tsx:101:25
     99|   });
    100|
    101|   it.each([false, true])("opens the actual first report once on phone=…
       |                         ^
    102|     const state = createLevelFiveIntegrationQaState("integration-final…
    103|     const env = await mount(state, phone);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 31 passed (33)
   Start at  19:59:03
   Duration  62.45s (transform 22.57s, setup 0ms, import 37.36s, tests 24.49s, environment 1ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error workspace @gamify-surgery/player@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\apps\player
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run src/session/levelFiveIntegration.test.tsx 
src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1
EXIT_CODE=1
```

</details>

<details>
<summary>Additional Level 5 player consumers - exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1

> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  20:46:39
   Duration  10.99s (transform 3.64s, setup 0ms, import 6.02s, tests 4.83s, environment 0ms)

EXIT_CODE=0
```

</details>

Final results SHA-256: `f0712982dc56ab64bbdbc220e8b1034d382c252df10df824aa05667bceeb1e61`. Regenerated checkpoint fixture SHA-256: `8a5df5958d85d1a9271ceaf35215793aa4e31318f0afe744a4e7c9f1f9384e73`. Protected source/input/helper/guard/player/e2e hashes were rechecked. Both delivered JSON artifacts and this handoff use UTF-8 without BOM, LF and a trailing newline. Every prior plan byte is preserved.

Backups, the complete prior run/input maps, current input fingerprints, actual tool output, result/cash/report comparisons and per-save hashes are retained under `.local-dev/l5-evidence-rebind7-20261017/`. Both initial timeout-only attempts and successful exact repeats are preserved above. No source, test or timeout adjustment was made, and no unresolved runtime difference was found in this bounded rebind. The manager owns review, acceptance, current-thread handoff integration and the GitHub checkpoint/reminder to say **"push to GitHub"**. **LOCAL ONLY:** no Git, installs, sub-agents, external messages, content edits, runtime edits, guard/test edits, browser automation, deployment or publication.

### Level 5 evidence rebind 8 (2026-10-28)

**Actual evidence rebind completed; required validation passes with zero failures.** The unchanged reducer journey and lower-checkpoint helper were rerun against the owner-requested Melissa Rowland addition (female resident) to the 82-name colleague pool. All original assertions remain active, including three completed reports, higher best/lower latest, immutable first finish, earned XP, retirement, supplier savings, positive comfort use, daily-round accounting and per-command/lifetime integer-cent cash reconciliation. The actual run reconciles 26710 commands (>20,000).

**Files and ownership.** `tools/qa/level-five-integration-results-20261012.json` is regenerated with current input hashes and the previous complete input map appended as `inputHistory[8]`; all 8 earlier entries remain unchanged. `tests/fixtures/level-five-integration-checkpoints-20261012.json` was regenerated by the actual tools and is byte-identical to its previous version. This plan receives only the present appended handoff. The guard `packages/game-domain/tests/level-five-integration.test.ts` is byte-identical (SHA-256 `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`); all assertions and strict input checks remain unchanged. Runtime/content sources, tests and e2e specs were not edited. Other workers' files and the manager-owned current-thread handoff were left alone.

**Input provenance.** The only source delta is the owner-requested Melissa Rowland row (female resident), increasing the pool from 81 to 82 names. Removing exactly that row from an in-memory source copy reproduces the prior recorded hash; the actual run kept the complete current source. Proof: `.local-dev/l5-evidence-rebind8-20261028/accepted-change-proof.json`. No source file was edited for this proof or for the journey. Previous results SHA-256: `0c775eb3c4cf71c382147296cd901eca5545b1916939c52e6c14ea7f2e4a0699`. The previous 378-input map is retained in full, together with its helper artifact hash and version/seed/cap metadata. The current run binds 378 inputs: one changed existing file, 377 equal existing hashes, no new or removed inputs. History now has 9 entries. The baseline already contained 8 entries, including the intervening owner-approved Level 1 arrival-cadence rebind; all are preserved.

| Input | Previous SHA-256 | Current SHA-256 |
| --- | --- | --- |
| `packages/game-domain/src/colleagueNames.ts` | `b03d78693e47e4580d7cca051ab4b19b28bc699ddbf4d8c42f0998e45d24621c` | `e06f4e3e4f7db94afc0ea29fccd4143201c5137bec3e1f9ea4c2d0c6bf5d6bd9` |

The generator order is `node tools/qa/level-five-integration-run.mjs --write`, then `node tools/qa/level-five-integration-lower.mjs`. After both finish, the only non-history postprocessing is the established `liveCap: 4` summary literal -> actual validated context cap `5`. Raw post-helper results SHA-256 before metadata/history postprocessing: `f3e9cf606d9f7951813f846b3356c75d98beb6d17e982f80bddb5246f2ebab1d`. No run counter, score, input hash, cash amount or checkpoint payload was adjusted after generation. No replay-compatible input exception was introduced.

**Run numbers (cash is cents).** Seed `level-five-m9.integration.01`, version `level-five-m9-integration.v1`. Every non-provenance results field is deeply equal to the previous actual run, including all three complete report objects and every cash term.

| Metric | Previous | Current | Delta |
| --- | ---: | ---: | ---: |
| `commandsReconciled` | 26710 | 26710 | 0 |
| `openingCashCents` | 1785500 | 1785500 | 0 |
| `grossCents` | 14994000 | 14994000 | 0 |
| `stockCents` | 271344 | 271344 | 0 |
| `paidOperatingCents` | 9641655 | 9641655 | 0 |
| `capitalCents` | 1048000 | 1048000 | 0 |
| `closingCashCents` | 5818501 | 5818501 | 0 |
| `levelFourAdvanceTick` | 3965 | 3965 | 0 |
| `xpGoalTick` | 15025 | 15025 | 0 |
| `firstAnswers` | 543 | 543 | 0 |
| `levelFiveFirstAnswers` | 454 | 454 | 0 |
| `completedDailyRounds` | 36 | 36 | 0 |
| `positiveComfortUses` | 974 | 974 | 0 |
| `retiredReceipts` | 5372 | 5372 | 0 |
| `retiredEncounters` | 402 | 402 | 0 |
| `finishNotices` | 0 | 0 | 0 |

Exact cash equation: 1785500 + 14994000 - 271344 - 9641655 - 1048000 = **5818501**. Closing delta: **0 cents**. Supplier savings: stock 1956 -> 1956 cents; upkeep 710700 -> 710700 sixtieth-cents. Inspection unlock: `{"version":"level-five-inspection-unlock.v1","earnedAtFacilityTick":15094,"clinicalXp":2014,"displayedSatisfaction":91,"averageStaffMorale":100,"employedStaffCount":9}`. Each completed report observes 3,000 active minutes and exceeds the 20-patient minimum. Report 2 remains best, report 3 latest and report 1 the immutable first finish.

| Report | Previous raw score | Current raw score | Patients, previous -> current | Tick window, previous -> current |
| --- | ---: | ---: | ---: | --- |
| 1 | 62.56467630107139 | 62.56467630107139 | 53 -> 53 | 15151-18151 -> 15151-18151 |
| 2 | 66.81366326970975 | 66.81366326970975 | 51 -> 51 | 18808-21808 -> 18808-21808 |
| 3 | 45.2608970823534 | 45.2608970823534 | 49 -> 49 | 21865-24865 -> 21865-24865 |

Complete report equality: **true**. The actual fixed-seed journey retained the accepted 82-name input. Every complete report object, run number and checkpoint payload compares equal to the previous recorded run. Equality was verified directly on the regenerated payloads.

**Saves and consumers.** All nine checkpoint saves are byte-identical when individually serialized; no save has changed. Scenario names, paused-state and phase contracts remain unchanged. The whole regenerated fixture is also byte-identical, including formatting and its trailing newline.

| Save | Changed? | Previous tick / XP / cash cents | Current tick / XP / cash cents |
| --- | --- | ---: | ---: |
| `integration-l4` | Identical | 3965 / 754 / 2656300 | 3965 / 754 / 2656300 |
| `integration-build` | Identical | 3965 / 0 / 1608300 | 3965 / 0 / 1608300 |
| `integration-preparing` | Identical | 15094 / 2014 / 3926777 | 15094 / 2014 / 3926777 |
| `integration-running` | Identical | 15231 / 2026 / 3925358 | 15231 / 2026 / 3925358 |
| `integration-final` | Identical | 18150 / 2572 / 4566714 | 18150 / 2572 / 4566714 |
| `integration-finish` | Identical | 18151 / 2572 / 4566714 | 18151 / 2572 / 4566714 |
| `integration-repeat-final` | Identical | 21807 / 3378 / 5450363 | 21807 / 3378 / 5450363 |
| `integration-repeat` | Identical | 21808 / 3378 / 5450363 | 21808 / 3378 / 5450363 |
| `integration-lower-repeat` | Identical | 24865 / 3508 / 5818501 | 24865 / 3508 / 5818501 |

`tests/e2e/level-five.spec.ts` remains unchanged (SHA-256 `8697e951007e63caa70325c8ef18f19334c1ed8e31543acd4295cb941bb4e459`). The additional Level 5 integration/launch player consumer check passes. Browser QA was not run in this Node-only task. No owner campaign, browser profile, opening origin, launcher or persisted owner save was accessed or migrated.

**Validation.** Required full game-domain exits 0: Test Files  162 passed (162); Tests  4306 passed (4306); Start at  19:43:15; Duration  1058.89s (transform 4.60s, setup 0ms, import 76.69s, tests 969.59s, environment 8ms). Required root typecheck exits 0 across all seven workspaces. Additional two-file player consumer check exits 0: Test Files  2 passed (2); Tests  33 passed (33); Start at  20:01:37; Duration  12.01s (transform 3.79s, setup 0ms, import 6.25s, tests 5.60s, environment 0ms). All npm validation uses the existing `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload. Complete exact command output follows, with Windows line endings normalized to LF; native-source logs retain their expected experimental TypeScript-transform warnings.



<details>
<summary>Actual unchanged journey - exit 0</summary>

```text
node tools/qa/level-five-integration-run.mjs --write
L4 10h, 114 XP
L4 20h, 210 XP
L4 30h, 334 XP
L4 40h, 450 XP
L4 50h, 566 XP
L4 60h, 692 XP
L5 70h, 52 XP
L5 80h, 146 XP
L5 90h, 250 XP
L5 100h, 366 XP
L5 110h, 472 XP
L5 120h, 576 XP
L5 130h, 702 XP
L5 140h, 796 XP
L5 150h, 902 XP
L5 160h, 1028 XP
L5 170h, 1122 XP
L5 180h, 1218 XP
L5 190h, 1354 XP
L5 200h, 1458 XP
L5 210h, 1564 XP
L5 220h, 1668 XP
L5 230h, 1764 XP
L5 240h, 1878 XP
L5 250h, 1994 XP
Inspection 1: 62.56467630107139, 53/20
Inspection 2: 66.81366326970975, 51/20
Inspection 3: 45.2608970823534, 49/20
{
  "commands": 26710,
  "closingCashCents": 5818501,
  "xpGoalTick": 15025,
  "unlock": {
    "version": "level-five-inspection-unlock.v1",
    "earnedAtFacilityTick": 15094,
    "clinicalXp": 2014,
    "displayedSatisfaction": 91,
    "averageStaffMorale": 100,
    "employedStaffCount": 9
  },
  "snapshots": {
    "integration-l4": {
      "tick": 3965,
      "xp": 754,
      "phase": null
    },
    "integration-build": {
      "tick": 3965,
      "xp": 0,
      "phase": "locked"
    },
    "integration-preparing": {
      "tick": 15094,
      "xp": 2014,
      "phase": "preparing"
    },
    "integration-running": {
      "tick": 15231,
      "xp": 2026,
      "phase": "running"
    },
    "integration-final": {
      "tick": 18150,
      "xp": 2572,
      "phase": "running"
    },
    "integration-finish": {
      "tick": 18151,
      "xp": 2572,
      "phase": "completed"
    },
    "integration-repeat-final": {
      "tick": 21807,
      "xp": 3378,
      "phase": "running"
    },
    "integration-repeat": {
      "tick": 21808,
      "xp": 3378,
      "phase": "completed"
    }
  },
  "reports": [
    {
      "score": 62.56467630107139,
      "patients": 53
    },
    {
      "score": 66.81366326970975,
      "patients": 51
    },
    {
      "score": 45.2608970823534,
      "patients": 49
    }
  ]
}
node : (node:33796) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-run.mjs --write *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:33796) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Actual unchanged lower-checkpoint helper - exit 0</summary>

```text
node tools/qa/level-five-integration-lower.mjs
M9 lower retry checkpoint PASS: latest 45.2608970823534, best 66.81366326970975, immutable first 62.56467630107139.
node : (node:31536) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
At line:3 char:1
+ node tools/qa/level-five-integration-lower.mjs *> $taskLog
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:31536) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)
EXIT_CODE=0
```

</details>

<details>
<summary>Required full game-domain - exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  162 passed (162)
      Tests  4306 passed (4306)
   Start at  19:43:15
   Duration  1058.89s (transform 4.60s, setup 0ms, import 76.69s, tests 969.59s, environment 8ms)

EXIT_CODE=0
```

</details>

<details>
<summary>Required root typecheck - exit 0</summary>

```text
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

EXIT_CODE=0
```

</details>

<details>
<summary>Additional Level 5 player consumers - exit 0</summary>

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1

> @gamify-surgery/player@0.0.1 test
> vitest run src/session/levelFiveIntegration.test.tsx src/session/levelFiveLaunch.test.tsx --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  20:01:37
   Duration  12.01s (transform 3.79s, setup 0ms, import 6.25s, tests 5.60s, environment 0ms)

EXIT_CODE=0
```

</details>

Final results SHA-256: `1c7b001255e26a3f4963628b6eff94f1446309df70f0286cdd808a61de298eae`. Regenerated checkpoint fixture SHA-256: `8a5df5958d85d1a9271ceaf35215793aa4e31318f0afe744a4e7c9f1f9384e73`. Protected source/input/helper/guard/player/e2e hashes were rechecked. Both delivered JSON artifacts and this handoff use UTF-8 without BOM, LF and a trailing newline. Every prior plan byte is preserved.

Backups, the complete prior run/input maps, current input fingerprints, actual tool output, result/cash/report comparisons and per-save hashes are retained under `.local-dev/l5-evidence-rebind8-20261028/`. Actual generator and validation outputs are retained above. No source, test, assertion or timeout adjustment was made, and no runtime difference was found in these recorded artifacts. The manager owns review, acceptance, current-thread handoff integration and the GitHub checkpoint/reminder to say **"push to GitHub"**. **LOCAL ONLY:** no Git, installs, sub-agents, external messages, content edits, runtime edits, guard/test edits, browser automation, deployment or publication.
