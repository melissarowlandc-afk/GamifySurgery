# Accepted N4 domain runtime integration - 2026-11-10

Authority: [accepted-content handoff](question-n4-acceptance-handoff-20261110.md)
and [exact runtime tuples](question-n4-runtime-integration-20261110.json).
This is the domain follow-up to the eight accepted PASS versions. Clinical
definitions and review status are unchanged. No clinical, renderer/perf, cloud,
save-format, balance or canonical evidence file was edited.

## Changes and source boundary

- `packages/game-domain/src/clinic-consult-topics.ts:9`: retain the venous-ulcer
  meaning and add `concept.superficial-incisional-ssi.open-drain` to wound
  affinity. Both accepted wound cases now bind to actual wound-clinic visits.
- `packages/game-domain/src/test-choice-orders.ts:19,2226`: import and spread
  `QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS`. All eight exact tuples, labels and
  profiles match the manager's JSON. Every disposition remains
  `not_executed / future_planned`; no extra order or circular procedure is made.
- `packages/game-domain/src/reducer.ts:6106`: exclude cases classified by
  `procedureConsultKind` from the ordinary automatic-arrival pool. The previous
  pool checked installed capabilities but not the presence of a procedure
  source. With appointments disabled it admitted all six accepted procedural
  questions as ordinary new patients after staff arrived, with no operation
  and no consult link.
- `packages/game-domain/tests/n4-consult-integration.test.ts`: 19 regressions.
  These use the exact accepted definitions and full 610-concept registry, with
  finite selection pools to prove each source route without inventing content.

The existing classifiers need no new OR allowlist. In
`founder-consults.ts:25-29`, suitable `ambulatory_surgery` cases classify as
`operation`; the two accepted endoscopy meanings are already in
`endoscopicFindingConcepts` at lines15-21. `procedureConsultPresentations`
at line34 draws existing published patient profiles. `selectProcedureConsult`
at lines70-90 requires an actual visitor in an in-service Endoscopy/OR phase,
its reserved room, compatible authored profile, capabilities and free/due
concepts. The reducer's source conversion at line6148 reuses that actor rather
than creating an unrelated ordinary patient.

All four accepted OR cases and both accepted endoscopy cases are proved through
real routine demand, preparation and staffing, actual procedure entry, source
conversion, save/reload, phase hold beyond its deadline, answering, closing and
one completion receipt. Tests also prove the exact diagnostic lookups and no
new service order from those future-planned choices. Both wound definitions
are selected through real wound-clinic sources. The whole-release diagnostic
inventory remains intact and passes.

The source restriction applies to **fresh automatic offers**, using the same
classifier as the source route. It does not gate frozen-save reopen, alter
historical questions, or require a manifest match on load. A regression loads
and opens a legacy unsourced OR chart without converting or dropping it.
Explicit scripted `ADMIT_PATIENT` remains available for developer/test fixtures;
the player has no production dispatch of that command. No new migration or
save field is needed. Pre-procedure/result-gated content that the classifier
does not identify as intra-procedure remains eligible for its existing routes.

Current default classification: four OR cases plus eight endoscopy cases are
source-only. The four accepted OR meanings are safe-bailout, mesh compartment,
extremity MRI and cholangiogram quality; all four actual accepted versions are
covered individually. No returned pediatric, polyp-stalk, post-impaction,
ostomy or other unaccepted N4 meaning was added.

## Operational frequency

Same public `endoscopyReadyClinic`, `routineOrFixture` and
`LevelFiveIntegrationJourney` controls as the prior milestone, three consecutive
600-active-minute operating-day sessions, natural scored clock/FSRS and normal
question answering. Each Level 4/5 comparison uses the same seed and geometry.
No question cadence, fee, duration, clinical relationship or demographic weight
was tuned. Receptionist supplement hires a receptionist through `HIRE_STAFF`
to keep check-in staffed while the founder attends other rooms.

| Control, each at both Levels 4 and 5 | Intra-endoscopy/day1,2,3 | Intra-op/day1,2,3 |
| --- | --- | --- |
| Earlier pre-N4 control | 2,0,2 | 0,0,0 |
| Accepted N4 content, before these domain edits | 2,0,1 | 4,2,2 |
| Final, with receptionist supplement | 2,0,2 | 4,1,2 |

Final means: **1.33 endoscopy and2.33 OR consults per ten-hour operating day**,
with two and four respectively in the first session. All four accepted OR
questions fit the existing classifier; the earlier zero was a content gap,
not a new frequency knob. Existing meanings share their real FSRS due dates,
so these are measured session counts, not a promise of a question every day.
All consults still consume the ordinary scored-arrival budget.

The unchanged original no-receptionist endoscopy control finishes final with
2,0,0 consults and9,11,2 scored arrivals, versus2,0,1 and9,11,9 at entry.
Its founder is away from the desk; at tick1800 it has eight awaiting-check-in
charts and fails `canAdmitPatient`, so no new source consult can be offered.
The real-hire supplement restores9,11,9 arrivals and2,0,2 consults. This is a
control staffing limitation, not an endoscopy classifier failure. Its routine
procedures still start4,5,6 per session. The OR control starts4,5,5, with the
same7/3 consult mean at final whether the extra hire is needed or already present.
Private raw, staffed and closing-state receipts retain both results.

## Level 5 CHECK, no rebind

Two frozen current-tree snapshots have identical accepted clinical content and
all other captured runtime inputs. Exactly the three domain source files above
differ. This isolates this integration from pre-existing work in the live tree.
The earlier release comparison additionally includes accepted N4 content and
other pre-existing source differences; it is not a claim of a content-only diff.

| Run | Commands | Closing cents | Completions | Walkouts |
| --- | ---: | ---: | ---: | ---: |
| Current GS-release retained result | 34,420 | 7,310,006 | 533 | 0 |
| Current accepted-content tree at task entry | 27,080 | 6,098,464 | 420 | 0 |
| Final domain integration | **28,601** | **6,227,467** | **445** | **0** |
| Isolated task delta | +1,521 | +129,003 | +25 | 0 |

Final versus retained release: -5,819 commands, -1,082,539 cents and-88
completions, with zero walkouts. These totals measure journeys of different
length; they are not a same-duration productivity comparison.

| Checkpoint | Entry tick/XP | Final tick/XP | Tick delta |
| --- | --- | --- | ---: |
| integration-l4 | 3846/754 | 3969/754 | +123 |
| integration-build | 3846/0 | 3969/0 | +123 |
| integration-preparing | 15400/2098 | 16878/2340 | +1478 |
| integration-running | 15537/2110 | 17015/2362 | +1478 |
| integration-final | 18456/2656 | 19934/2856 | +1478 |
| integration-finish | 18457/2666 | 19935/2856 | +1478 |
| integration-repeat-final | 22113/3480 | 23591/3600 | +1478 |
| integration-repeat | 22114/3480 | 23592/3600 | +1478 |

Phases match their named checkpoints. Final report scores are
62.441674349990286 /66.6965763107746 /45.38120376175499, qualifying
patients51/51/50. First/best/latest and lower-retry read-only assertions pass.
Official CHECK suppresses31 private progress writes in memory, canonical writes0.
Source snapshots, summaries and control receipts live under
`.local-dev/founder-consult-pathing-20261110/N4-{entry,final}/`; command logs,
scoped diff and validation receipts under
`.local-dev/n4-runtime-integration-20261110/`.

Only these Level 5 bound inputs change **in this task**:

1. `packages/game-domain/src/clinic-consult-topics.ts`
2. `packages/game-domain/src/test-choice-orders.ts`
3. `packages/game-domain/src/reducer.ts`

Clinical/default-release additions were already present at entry and are owned
by the accepted-content lane. No evidence, result, checkpoint or launch pin was
rewritten. Manager owns release porting and any rebind.

### Why the isolated numbers move

The first 50 automatic arrivals agree. First difference is
`encounter.auto.4.50`, **tick3125 in both runs**. Before: APP-source
`case.thyroglossal-duct-cyst.intermittent-lump`; after: wound-source
`case.gs028.diabetic-foot.a-systemic-illness`. Wound affinity expands from14
to19 existing cases (four retained incision variants plus the accepted N4
incision), and its existing published profiles from20 to23. The new profiles
are Female 36, Female 63 and Male 36, all taken from the authored definitions.
`clinic-consults.ts:18-29` generates those profiles from topic affinity, and
`:32-54` selects a question compatible with the actual in-care person. The
changed real source pool/holds then change later cases, care and goal timing;
this is not a new RNG stream consumption or a higher fee.

Level 4 eligibility takes123 extra minutes. The Level 5 XP gate moves only28
minutes (14931 to14959), while simultaneous-goal inspection unlock moves1478
(15399 to16877). End-of-journey tick likewise moves25171 to26649. The driver
therefore operates longer before its fixed inspection sequence ends. Exact
cash attribution: gross+729400, consumables+16275, paid operating+584122,
capital unchanged; net+129003 cents. APP receipt count273->295, pediatric
248->268, wound110->117, ostomy101->113. Both instrumented diagnostic runs
reproduce their official CHECK commands/cash exactly. Detailed first arrivals
and line ledgers are in `N4-{entry,final}/journey-attribution.json`.

The ordinary-pool exclusion separately prevents unsupported fresh procedural
offers wherever those candidates are eligible. Diagnostic bindings explicitly
do not execute extra testing. No service cadence, question budget, price,
duration or balance value changed. Totals versus the earlier release include
the already-accepted clinical pool and pre-existing live-tree work too; only
the frozen entry/final delta above is this domain integration in isolation.

## Registry consistency and validation

Default release is **1151 cases /1462 nodes /610 registered concepts**, manifest
145 rows. Serialized default SHA-256 is
`b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48`, matching
the accepted-content handoff. The two N4r2 meanings account for608->610; all608
previous definitions remain exact under the author's acceptance proof. The
prior round3 parent608/worker610 mismatch crossed the acceptance edit. With a
stable current tree the unchanged real Vite operational-worker state/view/hash
comparison passes (1/1,5.25s), including all 610 learning cards on both sides.
No worker/projection/guard code or assertion was relaxed to achieve this.

All commands use PowerShell `npm.cmd`, `CI=1`, `--pool=threads --maxWorkers=2`.
Player uses the existing Windows enumeration preload
`.local-dev/restroom-reception-refill-20261104/validation-preload.cjs`; it does
not change game logic or assertions. Logs and JSON reports are in
`.local-dev/n4-runtime-integration-20261110/`.

| Validation | Exact final output | Duration / exit |
| --- | --- | --- |
| New 19 regressions against captured pre-edit domain | 1 file failed;12 failed,7 passed (19) | 10.37s /1, expected reproduction |
| Focused new/source/specialty/order-inventory domain files | 4 files passed;36 tests passed | 16.62s /0 |
| Full domain | 2 files failed,212 passed (214);27 failed,5280 passed,1 skipped (5308) | 562.39s /1 |
| Full balance-config | 25 files passed;165 tests passed | 3.36s /0 |
| Full player | 4 files failed,420 passed (424);4 failed,4104 passed (4108) | 863.76s /1 |
| Root `npm.cmd run typecheck` closing | All seven workspace scripts pass | exit0 |
| Official Level 5 CHECK | 28601 commands /6227467 cents /445 completions /0 walkouts | exit0, no writes |

Full domain is back to the known 27 baseline failures: 26 in
`level-five-integration.test.ts` (one input binding, 25 retained load/120-minute
hashes) and the unchanged `approved-clinical-admission.test.ts:166` expectation
of587 concepts versus610. The binding first reports the pre-existing
`employee-training.ts` hash delta. New N4 inventory and all19 new regressions
pass; `level-four-integration.test.ts` passes all 5 tests. The author's previous
historical N2 patient-supply timeout passes in this full run. No pin/assertion
was edited to hide the baseline failures.

The four player failures match the established baselines:

- `breadButterPresentation.test.ts:78`: old four-choice expectation receives 3.
- `chartStructuredFields.test.tsx:129`: old legacy feedback copy expectation.
- `levelFiveRoomsViewModels.test.tsx:57`: old description regex misses the
  already-accepted fifteen-minute break guidance.
- `cloud/separateCampaign.test.ts`: existing codec JSON string-size limit for
  the large retained-encounter fixture.

All nine `questionN4SaveCompatibility.test.ts` real-source/frozen format3/journal
tests pass (5.96s). There is no fifth worker-learning-card failure this time.
All 23 protected Level 5/launch JSON artifacts remain byte-identical to the lane
intake. Current clinical and balance bytes remain unchanged since this task's
entry. The exact three frozen runtime deltas and scoped patch are retained in
the private receipts. Other pre-existing source differences versus GS-release
are classified separately; do not copy whole shared files when porting.

No presentation implementation is required for these bindings: existing generic
consult hooks expose the source chart with action-required status, covered by
the domain and player source tests. No perf-owned file was touched. Remaining
risks are the documented baseline tests and release evidence rebind, plus the
measured dependency of question counts on staffing, current patient context
and FSRS readiness. Manager should port the three small source hunks and new
test with the accepted-content lane, then CHECK/rebind in GS-release. Work is
local only; no Git, agents, installs, network, release-tree write or deploy.
