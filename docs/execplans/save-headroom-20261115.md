# Save-size headroom for large clinics

> **Owner-approved implementation completed, 2026-11-16.** The owner resolved the
> preservation gate below: retain exact FSRS cards and aggregate review counts
> with a bounded recent-log tail; keep the newest 20 filed staff discussions;
> review IDs no longer pin frozen subjects. Preserve live work and all financial,
> scheduling, duplicate-detection and analytics semantics. Historical investigation
> and stop receipts below remain unchanged as the decision record.

## Approved implementation plan (2026-11-16)

1. Capture current shared-tree preimages and verify the completed phone-play
   manifest. Own domain compaction/types/load/reducer/evidence integration and
   minimal learning/count/financial consumers plus cloud hydration/save hooks.
   Preserve the perf worker's pure hot-path and transport/renderer changes.
2. Add deterministic compaction with three recent reviews per concept (latest
   status needs one; three preserves a small recent correction sequence), exact
   retired counts, 20 filed resolved discussions with live-reference guards,
   orphan family/actor-clock/ledger and removed-target observation cleanup.
   Aggregate old intents/settlements only with proved equivalent consumers.
3. Compact a session-owned copy after immutable source verification, before a
   fresh playable baseline/capacity check, and maintain tails on retirement/save.
   FSRS card bytes, due dates, concept identities, source proof, cloud version,
   DB/RPC, balance/progression and clinical content are unchanged.
4. Measure approved revision-19 input privately before/after and continue the
   clone using real reducer commands. Target <2,000,000 decoded bytes, continued
   play below 3 MB. Verify public long-run size, card/scheduling equality,
   replay/duplicate/financial equivalence, protected live references and saves.
5. Run native Level 5 CHECK without rebind; run pacing alone with no Vite work
   concurrently, then full CI=true/thread suites, seven types, boundaries/build.
   Record exact baseline/new failure classification, source hashes/port manifest,
   private numerical receipts and final handoff.

Implementation intake: `.local-dev/save-headroom-20261115/compact-20261116/`.
Approved original account/reconstruction files are read-only. No Git, agents,
network/live DB, installs, deploy, browser storage or release-tree writes.

## Completed owner-approved compaction (2026-11-16)

This implementation supersedes the historical preservation/stop decision below.
The owner approved compacting old learning logs and filed discussions, while
keeping exact authoritative cards, cumulative counts and every live reference.
No ceiling, envelope/cloud format, DB/RPC, FSRS parameter, clinical content,
progression or balance value changes. Main tree only; no rebind.

### Design and consumer equivalence

- `history-compaction.ts:25` retains the newest **three** full reviews per
  concept and adds the removed count to `retiredReviewCount`. Three is a small
  recent correction sequence; status only needs the newest log, scheduling
  reads the exact card (`fsrs-adapter.ts:138`), and lifetime totals use
  `history-counts.ts`. Cards/due fields and concept IDs are never replayed.
  Clinical selection and availability still distinguish learned/unseen concepts.
- First-answer/duplicate facts stay on each retained encounter/discussion step
  and its answers. `scoredQuestionUsage.ts:11` requires an unanswered before-step
  and an accepted after-step; the newly appended review remains in the recent
  tail. Old subjects cannot be answered again after retirement. The reducer's
  implicit review timestamp uses the aggregate intent count, preserving offsets.
- `history-compaction.ts:39` keeps the newest **20 answered resolved** staff
  discussions plus every open, travelling, unanswered, staff-task/founder/source
  or inspection-referenced discussion. Reviews no longer pin retired subjects.
  The approved visible delta is that the Filed list has a 20-item resolved tail;
  learning progress remains on its stable concept.
- Retain review-intent detail for every remaining chart/discussion and a newest
  **32** tail, with a lifetime retired count. Settlements retain all filed/live
  chart detail and the complete **three-operating-day** competition window;
  older unique IDs become exact count/net/gross-cent totals. Lifetime finances,
  day summaries, score offsets and rolling/competition readers include totals.
- Outside-radiology receipts retain the newest 50 individual receipts and every
  still-creditable read transaction. Older receipts inside the existing one-day
  window become exact **per-operating-minute count/cents buckets**; expired
  buckets feed the existing retired totals. These preserve exact 360-minute
  rates, day boundaries, economy totals/counts and source categories. Other
  receipt kinds retain existing policy. Duplicate-ID/transaction groups remain
  raw because different legacy readers have different deduplication semantics.
- Terminal service operations retain live references, the existing newest-ten
  tail and name anchors for the UI's newest eight receipts. This no longer pins
  every completed visitor for an entire retained receipt day. QI retains all
  pending work, receipt-backed records and ten completed records, with exact
  completed/first-review aggregate facts. Known maintenance use keys disappear
  only after their source operation retires; unknown legacy dialects stay.
- Departed pediatric families retire only when child/parent/source references
  are gone. Actor clocks/spending maps prune only missing source actors (even a
  retained offsite/terminal actor is preserved). Removed room/employee targets
  lose stale guidance observations/root locks. Current assets/actors never reset.

### Ownership, load order and source proof

`compactGameState` (`history-compaction.ts:160`) forks only owned mutable branches,
never the caller, immutable proof or shared learning cards. Ordinary local load
compacts after normal validation/migrations (`persistence.ts:4825`). Native cloud
load validates original snapshot hash/size/source first; `snapshotLearning.ts:10`
compacts the selected session-owned playable copy and creates its new checkpoint.
Legacy source comparison explicitly keeps its uncompacted projection
(`codec.ts:184`), then compacts only the returned playable copy (`:324`). Snapshot
encoding compacts its owned input before the next encoding/capacity assessment
(`snapshotCodec.ts:52`); ordinary tick retirement maintains the tails
(`reducer.ts:9033`). Existing source size/hash checks and the 3 MB ceiling remain.

The evidence chain only permits a card-preserving oldest-prefix retirement to
exactly three logs with the exact retired-count delta. Its immutable removed
references reconstruct the original proof during untrusted import
(`game-evidence.ts:493`, `:621`); altered witnesses still fail. No original
archive/legacy oracle or protected pin was rewritten. The differential test
uses the old oracle unchanged between approved snapshot-compaction boundaries,
proves the boundary against the real reducer and full untrusted import, then
rebases both branches equally. Prior command witnesses remain in both branches,
so retry/changed-operation protection does not disappear at that test boundary.

### Measurements and retention bounds

Approved private revision-19 source proof, exact decoded/envelope/headroom and
per-root before/after values are **only** in
`.local-dev/save-headroom-20261115/compact-20261116/owner-growth-summary-private.json`
and `after-owner-measure-private.json`. It meets the **under 2,000,000 decoded
bytes after load** target. Every concept's card JSON and next Good-review result
hash are identical; all financial reader projections (including management and
competition) are exactly equal. The original account/perf reconstructions stay
read-only; no compacted owner campaign is written into a public artifact.

The paired owner clone continuation runs 1,200 real reducer ticks (two operating
days), answers patient and staff questions, and has **1,302 commands in each arm**.
All 1,200 per-tick card and gameplay projection hashes are identical. The compact
arm stays below the ceiling throughout; the control crosses it after 11 ticks.
Exact daily roots, end-to-end B/day and peaks are in the private summary. The
sample's total size declines; it is not extrapolated as a negative permanent
growth rate. Remaining growth is new concepts/recent learning tails, actual live
work, finite financial windows and counters. No wall-clock session prediction
is justified by this stress policy or fluctuating receipts.

Public native Level 5 fixture curve (UTF-8 decoded game-state bytes):

| Facility tick | Before | After |
| --- | ---: | ---: |
| 6,000 | 1,131,296 | 1,001,169 |
| 12,000 | 1,371,442 | 1,107,343 |
| 18,000 | 1,633,196 | 1,241,648 |
| 22,800 | 1,778,077 | 1,271,187 |
| 26,377 (first finish) | 2,010,513 | 1,422,428 |
| 30,034 | 2,109,630 | 1,447,792 |
| 33,091 (final) | 2,244,832 | 1,517,911 |

For the same public ten-day window (ticks 12,000-18,000), endpoint growth:

| Root | Before B/day | After B/day |
| --- | ---: | ---: |
| Total decoded state | 26,175.4 | 13,430.5 |
| Learning histories | 9,484.7 | 7,339.0 |
| Review intents | 4,221.6 | -37.9 |
| Settlements | 3,432.8 | 1.8 |
| Pediatric families | 2,000.0 | 72.8 |
| Outside/service receipts | 387.4 | 202.9 |
| Service operations | -60.0 | 261.2 |
| Retail actor ledgers | 496.6 | 70.6 |
| Retail clocks | 348.6 | -1.0 |
| Amenity clocks | 354.2 | 4.6 |
| Alert humor | 890.0 | 890.0 |

These finite-window endpoint slopes include live/retained work and newly
reviewed concepts; they are not extrapolated after each bounded tail fills.
Complete numeric curves and root breakdown are in `public-growth-summary.json`.

Synthetic long campaign: **4,258,443 -> 547,205 bytes**, then 120 real reducer
ticks each under 2 MB. Regression tests also cover exact card/due/next-review
bytes, counts, source immutability/idempotence, protected live/frozen subjects,
financial windows/duplicates, legacy load, source-proof tamper rejection and
next-answer/retry behavior.

Normal review/intents/discussions/QI/move-history tails are bounded for a fixed
concept set and finite live workload. Protected live/unanswered records, unknown
legacy idempotence keys and duplicate financial groups are deliberately retained;
this does not claim an arbitrary-sized clinic or future content bank fits forever.
FSRS cards and stable concept entries continue to scale with the learning bank.

### Level 5 CHECK and bound inputs

The actual native CHECK before/after has **35,342 commands / 6,966,492 closing
cents / 551 completions / 0 walkouts**, final tick 33,091, unchanged. All 41
sampled gameplay projection hashes and the command-stream SHA256 are identical:
`43b445231a9fb51c6847e425043d434c15ef4985931e949869320dc05362b2a3`.
Only retained-history/state bytes and source bindings change. No evidence rebind
or canonical evidence/results write. The historical canonical totals
26,362 / 6,056,335 / 410 / 0 already differed before this lane.

Exact pre/post SHA256 for these **13 domain-bound inputs** is in
`compact-20261116/bound-input-deltas.json`:

- `clinic-day-summary.ts`, `clinical-selection.ts`, `game-evidence.ts`,
  `history-compaction.ts` (new), `history-counts.ts` (new), `index.ts`,
  `level-three-support.ts`, `persistence.ts`, `reducer.ts`,
  `retired-service-history.ts`, `rolling-income.ts`,
  `routine-patient-availability.ts`, `types.ts` (all under
  `packages/game-domain/src/`).

### Files / hunk ownership

The complete exact-path/preimage/postimage-hash manifest is
`.local-dev/save-headroom-20261115/complete-port-manifest.json`; the matching
owned patch/preimages are alongside it. Port the whole consumer/load/evidence
lane together. Do not copy whole shared files over the phone-perf lane.

- Domain source: the 13 bound inputs above; additive summaries, counts,
  deterministic retirement/load, conservative reference guards and proof chain.
- Player source: `competition/revenue.ts`; session `learningDevelopmentView.ts`,
  `learningReviewCount.ts`, `managementViewModels.ts`, one scored-count line in
  `viewModels.ts`; cloud `codec.ts`, `codecOwnership.ts`, `snapshotCodec.ts`,
  `snapshotLearning.ts`. No renderer, cloud transport, deadlines or worker
  admission behavior changed.
- New public synthetic fixtures/tests: `tests/fixtures/history-compaction.ts`,
  domain `history-compaction.test.ts`, cloud `historyCompaction.test.ts`.
- Equivalent-intent test adaptations: domain `eng-i01-live-procedure.test.ts`,
  `game-evidence-incremental.test.ts`, `tests/fixtures/evidence-differential.ts`;
  player cloud `operationalEngineDifferential.test.ts`,
  `openingPerformanceTestSupport.ts`, `snapshotConceptCompatibility.test.ts`,
  `snapshotRpcRoundTrip.test.ts`; shared `tests/fixtures/diagnostic-workload.ts`.
  Workload-only deserializers explicitly opt out of compaction to retain the
  original 1,500-receipt/large-operation pressure. All time budgets and full
  per-step state/journal/delta/recovery assertions remain.
- This ExecPlan and appended `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

The phone-perf completed manifest matches intake exactly; only its runtime
`game-evidence.ts` overlaps this lane (the shared handoff gets an additive entry). Its shared normalizer import/hot-path
change is preserved; every unrelated perf path remains hash-identical. The
canonical checkpoint/results and frozen legacy oracle remain byte-identical.

### Validation (complete)

All suites use `CI=true`, `npm.cmd` and `--pool=threads`. The original full
all-workspace pass used `--maxWorkers=4`; final domain/player reruns use three
workers. No budget/deadline/assertion guard was increased or removed. Logs and
exit receipts: `compact-20261116/validation-receipt.json` and the named logs.

| Workspace | Exact final result | Duration / exit |
| --- | --- | --- |
| Player | `Test Files 472 passed (472)`; `Tests 5628 passed (5628)` | 1196.00 s / 0 |
| Game domain | `Test Files 2 failed / 226 passed (228)`; `Tests 27 failed / 6136 passed / 1 skipped (6164)` | 769.72 s / 1 |
| Balance config | `Test Files 26 passed (26)`; `Tests 168 passed (168)` | 1.53 s / 0 |
| Clinical authoring | `Test Files 7 passed (7)`; `Tests 81 passed (81)` | 418 ms / 0 |
| Clinical content | `Test Files 11 failed / 224 passed (235)`; `Tests 12 failed / 3513 passed (3525)` | 169.25 s / 1 |
| Clinical research | `Test Files 8 passed (8)`; `Tests 83 passed (83)` | 2.07 s / 0 |
| Clinical context workbench | `Test Files 8 passed (8)`; `Tests 43 passed (43)` | 656 ms / 0 |

Authoritative domain/player summary output:

```text
# npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=3
 Test Files  2 failed | 226 passed (228)
      Tests  27 failed | 6136 passed | 1 skipped (6164)
   Duration  769.72s (transform 29.00s, setup 0ms, import 686.11s, tests 1591.37s, environment 22ms)
exit 1

# npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=3
 Test Files  472 passed (472)
      Tests  5628 passed (5628)
   Duration  1196.00s (transform 33.45s, setup 0ms, import 981.94s, tests 2553.32s, environment 35ms)
exit 0
```

Domain's **27 are exactly the known baseline**: one static
`approved-clinical-admission.test.ts` count plus 26
`level-five-integration.test.ts` source/evidence/legacy-checkpoint expectations.
No new domain runtime failure remains. The separate native before/after CHECK
proves unchanged gameplay; retained-history/state bytes legitimately differ.
No pin was rebound to make these pass.

Clinical's **11 pre-existing** failures are the same ten failing files listed in
the historical intake table below (two batch5 assertions). One **new** failure is
`question-program-batch3-acceptance-20261111.test.ts`'s immutable postimage for
`tests/fixtures/diagnostic-workload.ts`: this lane adds exactly two
`{ compactHistory: false }` workload-normalization flags. They keep the original
large-operation pressure/320-step byte guards; no clinical text or runtime
behavior is changed by the fixture. The protected guard and original captures
are deliberately unchanged. Manager/acceptance-owner reconciliation is still
required; this suite is **not** declared green.

Initial broad validation exposed five stale player expectations and seven stale
domain reload/evidence expectations (plus one stale-transform duplicate test).
Equivalent-intent adaptations preserve original workload sizes, complete
source/proof/replay/byte assertions and budgets. Fresh focused domain run:
`3 passed files; 70 passed / 1 skipped; 108.46 s; exit 0`. Player adjusted pressure/
compatibility guards: `5 passed files; 17 passed; 35.06 s; exit 0`; final engine
byte differential: `1 passed file; 3 passed; 73.64 s; exit 0`. A test-only TS7022
annotation was fixed; final seven workspace typechecks all pass. None of the
initial stale failures remains in the authoritative final domain/player runs.

```text
npm.cmd run typecheck: all seven workspaces PASS, exit 0
npm.cmd run test:boundaries: exit 0
Using verified read-only index inventory; no Git process invoked.
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
npm.cmd run build: exit 0 (includes boundaries and all seven typechecks)
700 modules transformed.
built in 14.08s
```

Boundaries use the existing checksum-verified read-only index inventory because
Git is prohibited; source/dependency and launcher assertions run unchanged. The
private Vite adapter only suppresses the optional Windows `net use` drive probe;
no product/test check is skipped. Existing build chunk-size, mixed dynamic-import
and plugin-timing advisories are non-failing. Complete logs retain stderr and
full command output, including earlier failing attempts.

The actual pacing CLI ran **alone after all Vite tests/build work completed**:

```text
node tools/qa/content-pacing-check.mjs
{
  "firstFinishTick": 26377,
  "closingCashCents": 5913995,
  "completions": 442,
  "walkouts": 0,
  "referenceTick": 26281,
  "driftPercent": 0.3652829039990868,
  "clinicalSha256": "4da0db5dd2a1a268440d5a5abc1ea81412224a249d7c089ec98a684442cf654f",
  "caseCount": 1436,
  "registeredMeanings": 1142
}
exit 0 (PASS)
```

All source, ceiling, financial, card/scheduling and before/after native receipts
are complete. No runtime/test source changed after the final paired measurements
and final suite starts; the final manifest verifies their exact source hashes.


### Remaining manager work / risks

- Reconcile the diagnostic pressure fixture's exact two opt-out hunks through
  its protected-source acceptance owner. The unchanged clinical guard reports
  this new fixture-source delta; it is not a clinical wording or runtime change.
  Exact pre/post SHA256 and rationale: `compact-20261116/protected-test-delta.json`.
  Eleven separate clinical failures were already present at intake; neither
  they nor the 27 baseline domain failures were hidden or loosened.
- Browser/physical-device load/save remains manager acceptance. This worker uses
  real codecs/reducer and private in-memory clones, never browser storage or a
  live DB. Original authoritative copies still must pass their own size/proof
  checks before session compaction; corrupt or already-invalid sources are not
  accepted by weakening validation.
- New optional state summaries must travel with all count/financial/proof/load
  readers. Old saves default absent aggregates to zero. No cloud format or
  schema/RPC migration, FSRS/card/content/balance/progression change or origin
  change was made. No Git/agents/network/install/deploy/rebind action.


## Historical investigation (2026-11-15; superseded by the approved implementation above)

## Goal and constraints

Measure all decoded-state/snapshot ceilings and growth, audit history consumers,
then implement deterministic domain retention only where gameplay, visible UI,
frozen references and learning remain intact. Existing saves compact during load
before capacity assessment. Target the approved private input below the existing
2,000,000-byte target without a cloud format, DB/RPC, FSRS or clinical change.

Main shared tree only. Preserve concurrent cloud transport work; limit any
cloud edits to a proven capacity/migration integration need. No Git, agents,
network/live DB, installs, deploys, browser storage or release-tree writes.
Private source saves remain read-only; all private inputs, detailed outputs and
identifiers remain under .local-dev/. Public tests use synthetic fixtures only.

Stop before implementation if reaching the target would require a cloud
format/DB/RPC change, FSRS/clinical change, or removing data a live mechanic or
visible UI needs. Preserve every review/stable concept ID and frozen encounter/
discussion referenced by an open case or review. Compact aggregate totals only
when consumer-equivalence can be demonstrated.

## Ownership / intake

Investigation owns domain retention/load/evidence readers and their consumers,
plus read-only codec/capacity/SQL inspection. Implementation ownership will be
listed only after the consumer/stop gate is resolved. Transport, delivery,
renderer, clinical content, balance/progression and owner source saves are not
implementation targets.

Source intake/preimages: .local-dev/save-headroom-20261115/. Approved private
input and existing perf reconstructions are consumed in memory; no private
identifiers or save data are copied into public files/tests. Root AGENTS.md,
current handoff and cloud-open-perf ExecPlan have been read. No nested AGENTS.md
was found in the candidate lane.

## Milestones / acceptance

1. Trace each ceiling's exact byte source and load order, including the server's
   uncompressed snapshot bound. Measure private stored/compatible/hydrated/
   snapshot byte counts/headroom with existing adapters, per-root counts/bytes,
   protected references, and daily growth using private and public long runs.
2. Inventory every root consumer (mechanics, financial/report/progression,
   charts/flags, FSRS/reviews and analytics). Classify bounded, conditionally
   retained, unbounded and protected growth. Resolve the stop gate.
3. If safe, implement bounded history/aggregates and additive load migration,
   preserving exact consumer outputs; add synthetic long-run, legacy migration,
   active-reference and capacity regression tests. If blocked, report concrete
   evidence and the minimum manager decision instead of changing semantics.
4. Compare public native replay commands/cash/completions/walkouts before/after;
   run pacing CLI and the required full suites (CI=true/thread pool), seven
   typechecks, boundaries and build for implemented changes. No evidence rebind
   without explicit authorization; report source pins and outcomes.
5. Write exact measurements, files, validation and risks here; append the current
   thread handoff. No claim of indefinite boundedness for protected FSRS reviews.

## Progress / discoveries

Intake complete. No implementation edit. Existing service history retirement
already keeps a recent receipt tail and terminal-operation tail, but preserves
all unreviewed ambulatory receipts and every still-creditable source. Resolved
staff discussions also feed a public discussion-list selector. Their actual
consumer/reference scope must be established before removing anything.

Preserving every FSRS review makes absolute all-state boundedness mathematically
impossible as reviews accumulate; measurements/tests must distinguish protected
learning growth from avoidable history growth. This does not authorize changing
the review contract or the size limit.

## Decision gate: stop before retention implementation

The requested indefinitely bounded steady state conflicts with the mandatory
preservation rules. `learningHistories[concept].reviews` grows with every accepted
answer; even repeated reviews of a fixed concept add distinct immutable records.
The brief also protects frozen subjects referenced by reviews. Filing a discussion
does not remove its review reference. No finite fixed-byte ceiling can contain
those sequences indefinitely. Removing only command/effect history cannot fix
that dependence: snapshot-only format 3 already contains no transition archive.

The stop instruction applies: a guaranteed steady state would require changing
the protected learning/frozen-history contract or the storage/capacity contract.
Neither is authorized. No domain, player, codec, schema, DB/RPC, balance, clinical,
evidence or test file has been changed. No retention implementation, migration,
under-target regression assertion or reduced-size save is claimed. In particular,
this investigation does not resolve the owner's immediate capacity risk.

Reaching the target for a finite period may be possible with consumer-preserving
aggregates and orphan cleanup. That is different from promising bounded total
state while retaining all reviews and their frozen subjects. The next brief must
resolve that distinction, or approve a different storage strategy, before a worker
can honestly implement and validate the requested guarantee. No approval is
inferred for a limit increase, FSRS change or archived-question representation.

## Exact byte sources and load order

All limits are UTF-8 bytes, not JavaScript string length, compressed size or
physical database pages. Exact private numeric receipts stay under
`.local-dev/save-headroom-20261115/`; no private state, identifiers, authored
answers, dates or account rows are reproduced here.

| Boundary | Bytes measured | Evidence |
| --- | --- | --- |
| Native cloud verification | `serializeGameState(loaded.state)` after snapshot validation/import, before playable learning completion | `apps/player/src/session/cloud/verifiedCopyCache.ts:81`, `codecTasks.ts:70` |
| Native opening/hydration | `completeSnapshotLearning` adds missing current/frozen concepts on a session-owned copy; this path has no second 3 MB assessment | `codecTasks.ts:134`, `snapshotLearning.ts:10` |
| Native snapshot encoder | `serializeSnapshotState` of playable state, checked before envelope compression | `snapshotCodec.ts:50`, `snapshotCodec.ts:56` |
| Native candidate | Both envelope `snapshot.uncompressedBytes` and compressed bytes; the raw envelope includes campaign/lineage as well as state | `codecTasks.ts:146` |
| Legacy normalized encoder | Reconstructed state via `importGameEvidence`, then `serializeGameState`; separate snapshot/evidence/body checks | `codecEvidence.ts:65`, `codecEvidence.ts:102` |
| Legacy normalized candidate | Uncompressed operational envelope; then reconstructed-state verification | `codecTasks.ts:156` |
| Legacy format-1 capacity | Compatible `domainLoad` serialized state, snapshot text and baseline evidence are separate quantities | `codec.ts:95`, `codec.ts:177`, `codec.ts:243` |
| Server | Decoded envelope size declared and verified for the stored compressed snapshot; not hydrated compatible state | `supabase/migrations/20261018000100_beta2_cloud_saves.sql:73` |

`measure-private.json` records the selected approved snapshot's stored state,
verified state, ordinary `deserializeGameState` compatibility result, playable
learning-completed result, next envelope and compressed sizes, plus every root's
bytes/count. It also invokes existing service/retail retirement on a clone:
neither removes any record at that instant. The receipt age histogram proves the
large receipt root is an entire still-protected operating-day window, predominantly
outside radiology reads, rather than forgotten multi-day receipts.

The stored proof is materially smaller than the playable state. Native opening
can therefore verify the old copy successfully while the next snapshot write is
already precarious. The ordinary domain deserializer is not the native snapshot
verification path: it also normalizes retail/amenity/service work and adds late
progression compatibility. Do not use its smaller result as a proxy for native
cloud headroom. A signed stored source must first pass its unchanged checksum and
size validation; a future authorized migration belongs on a session-owned copy
after proof and before a new baseline/capacity check, never inside source-proof
validation or by changing claimed byte lengths.

## Growth and retention classification

Measured current public context: **1,436 cases / 1,142 concepts**. The ten-day
window below is facility ticks 12,000 to 18,000 in the native Level 5 journey,
before inspections. Each operating day is 600 game minutes. These are observed
endpoint changes divided by ten, not claimed worst-case bounds or linear forecasts
for roots that fluctuate with arrivals/retirement.

| Root | Observed B/game day | Classification and preservation requirement |
| --- | ---: | --- |
| Learning histories | +9,484.7 | Unbounded review sequence; concept entries also grow with releases. Protected unchanged. |
| Employee discussions | 0 | Unbounded resolved frozen subjects when answered; this driver's pump does not answer staff discussions. Private continuation does. Protect review/open references. |
| Review intents | +4,221.6 | Unbounded scored-answer ledger; UI count and implicit default review timestamp depend on length. |
| Settlements | +3,432.8 | Unbounded completions/financial ledger; lifetime/day/rolling totals and filed-chart breakdown need equivalence. |
| Pediatric families | +2,000.0 | Departed families are never retired, including after child/parent removal. Live pair/reservation/procedure references must remain. |
| Service income receipts | +387.4 | Window/tail-retained, not a hard count bound: newest 50, last operating day, creditable keys, all unreviewed OR receipts. |
| Service operations | -60.0 | Terminal tail 10 plus live references/receipt actors; active queues and indefinitely pinned references are conditional growth. |
| Events | -26.7 | Count-bounded at 500. Existing UI/mechanics still read this history. |
| Alert humor | +890.0 | Tip history bounded at 40; observations/cadence keys scale with clinic assets and can retain removed target keys. Most bytes are observation signatures, not prose history. |
| Retail actor ledgers | +496.6 | Per-actor spending/budget mechanic; some stale service/companion keys survive retirement. |
| Retail opportunity clocks | +348.6 | Per-actor scheduler keys; orphan keys can accumulate. Live clocks are RNG/timing inputs. |
| Amenity opportunity clocks | +354.2 | Same live-versus-orphan distinction; never reset clocks of present actors. |
| QI reviews | 0 | Unbounded completed reviews when operations run; this fixture has no ordinary OR staffing. Private continuation exercises it. |
| Maintenance use keys | 0 | Unbounded durable use/idempotence ledger, also duplicated per maintained room; private continuation exercises it. |

Other roots: operation receipts already cap at 96 (only four tick receipts);
resolved ordinary encounters already retain a tail of ten plus live references;
retired encounter summary keeps rolling satisfaction and bounded still-use data;
retired service summary is constant-size counters. Retail operations/departed
actors/used orders have tails of ten plus receipt/live references. Current rooms,
staff, doors, work paths, active amenity trips, current outside reads, pending
diagnostics and room/staff reservations scale with actual clinic/live work, not
move history. Facility-condition history has a resolved-record cap of 60 while
active occurrences remain protected. Inspection stores current run plus
last/latest/best/first reports; run evidence is bounded by a run, not campaign
age. Scalars/sequences grow only in digit length. Service line clocks and stable
catalog/progression ledgers scale with definitions/levels. None is permission to
prune a live reference.

Public run size: 2,010,513 B at first finish and 2,244,832 B at final tick 33,091.
The current real driver is already a counterexample to an unqualified 2 MB
long-campaign assertion. Its final protected learning root alone is 858,143 B,
before review intents, live/frozen charts and all clinic state.

The private receipt `owner-growth-private.json` records a two-operating-day clone
continuation, first capacity crossing, per-root samples and any harness error.
The policy explicitly answers current patient charts and staff discussions,
answers correctly, uses the integration review calendar, and leaves physical
work to the real reducer. It is a stress/representative continuation, not a claim
to predict the owner's choices or wall-clock sessions. `profile-growth-private.json`
also records the observed account usage distribution and consecutive stored-copy
deltas without publishing any dates or identifiers. A paused pair of snapshots
has no game-time denominator; its positive byte change is not extrapolated as
bytes per game day. Near-term risk is first crossing during the next ordinary
session, not a defensible promise of several safe sessions. Expiring receipts
and finished movement can temporarily bring a state back below the ceiling.

## Consumer audit and why blind truncation is unsafe

Complete file/line direct-reference inventories are in `consumer-inventory.json`
and `extra-consumers.json` under the private receipt directory. They cover domain,
player, analytics and offline tools; test-support/types/serialization-only
references are retained in the inventory and distinguished from gameplay readers.
All root serialization/evidence paths (`persistence`, `game-evidence`, incremental
evidence ownership/retirement, tick cloning, cloud ownership and codecs) preserve
their entire assigned subtree, even when a leaf is not separately named here.

| Root | Every functional consumer group and required equivalent |
| --- | --- |
| Learning histories/reviews | `fsrs-adapter`, reducer first-answer and duplicate detection, `clinical-selection`, `routine-patient-availability`; learning count/cards/status in `learningReviewCount`, `learningDevelopmentView`, `viewModels`; `snapshotLearning`, load compatibility; `playtime/scoredQuestionUsage` accepted-transition analytics; economy/QA/content selection diagnostics. Never replay or discard reviews or substitute today's content for frozen subjects. |
| Staff discussions | `employee-discussions` lists/current question/blocking; reducer open/travel/answer/feedback/file/cancel; `founder-consults`; staff service availability/training/QI/outside radiology and diagnostic-resource blocking; inspection question/answer observers; guidance/alert actions; `viewModels` charts/current-update, `usePrototypeSession` open/close, `questionReviewContext` flags; snapshot learning; scored-question usage. Resolved items remain in the public Filed list. |
| Review intents | Reducer first-answer append and default `reviewedAtMs` offset use length; `viewModels:2970` displays scored count. Aggregate count alone would also have to preserve timestamp/default behavior and evidence ownership. |
| Settlements | Reducer settlement/cash/idempotent encounter settlement ID; `clinic-day-summary`, `rolling-income`, selectors' filed-chart outcome/index/detail, `competition/revenue`; inspection observes at posting time; lifetime finances are exposed through management views. Aggregate old totals only with current/day/rolling/chart detail preserved. |
| Receipts | Reducer/service/retail/radiologist idempotent credits, `retired-service-history`; QI enqueue/dedup; first-endoscopy/OR goals in selectors; current/day/rolling/lifetime finances; `managementViewModels` retained totals per line and count; `giftShopViewModels` retained gift totals/window; `viewModels` latest eight receipts and all facility earnings animations; `competition/revenue` last-three-day history; inspection receipt observers; economy drivers/QA counts. Per-minute/source aggregates would need exact cents/counts/window boundaries plus recent individual animation anchors and still-creditable transaction protection. |
| Service operations | Room/staff/provider/peri-op/reading reservations, queues, clocks, arrival/staff routing, test results, frozen timing, consult holds; clinical/clinic consult admission; training/support, capacity, seats, waiting, amenities, retail, parent/pediatric procedure flow, departure and sale/reload repair; appearance anti-duplicate identity; selectors, guidance/alerts and all character/procedure/family presentation helpers. Terminal records are also name/actor anchors for retained receipts and sources referenced by charts/results. Retire only after the entire reference graph is gone. |
| QI reviews | `level-three-support` queue, task progress/requeue, completed count/first-goal flag and receipt dedup; staff task/guidance/player support counts; retirement's OR receipt protection; frozen training/upgrade benefits and evidence. Preserve queued/in-progress records; any completed summary needs count/first witness and dedup equivalence. |
| Maintenance keys | `recordLevelThreeRoomUse` global and room-local dedup, room completed-use thresholds, due/out-of-service/repair lifecycle, sale/rebuild/reload fallback. Naively clearing a ledger can count a source use again. Current/future source idempotence must be proved before compacting. |
| Pediatric families | `pediatric-family` child/parent lookup, paired paths/seats/obstruction/sale handling, `pediatric-procedure-flow`, `founder-consults`, service and waiting routing, retail parent behavior, garden/amenities, Level 4/5 witnesses, retired-service reference checks; player family/pose context through those helpers; economy probes. Departed/orphan candidates need full child/parent/trip/operation/encounter reference checks. |
| Actor ledgers/opportunity clocks | `retail-operations` budget/reset/buy eligibility and scheduling, `patient-amenities` deterministic next opportunity and completion paths, reducer initialization and retirement cleanup. Delete only identities that cannot return and are absent from live families/trips/work. |
| Guidance/alert maps | `guidance-tips`, topic activity/suppression, cadence and departure-risk conditions; persistent alert/handled/tip feed and actionable links in `alertsEventsViewModel`, `alertViewModels`, `usePrototypeSession`; environment experience/progression. Observation signatures are used to detect actual repairs and clear root locks, not a disposable debug cache. |

Specific evidence: `retired-service-history.ts:108`/`:147` build live source and
operation reference sets, `:204` retains the one-day window, `:309` retains retail
tails; `retired-encounters.ts:79`/`:115` choose retirable charts and `:234` removes
their actor keys. Its existing encounter retirement does **not** retain a chart
solely because an FSRS review names it. Applying this brief's stronger frozen
review-reference protection to all future encounters would itself make that
frozen-chart history unbounded. Existing already-retired subjects cannot be
reconstructed from today's question release; no attempt was made to do so.

`employee-discussions.ts:80` includes every resolved/cancelled discussion;
`viewModels.ts:883` maps them to charts rows; `questionReviewContext.ts:4` reads
only the frozen encounter/discussion. `level-three-support.ts:75` records durable
room-use keys and `:336` enqueues QI from receipts. `rolling-income.ts:8` uses a
360-minute exact window; `clinic-day-summary.ts:8` uses cumulative and day-window
payments; `managementViewModels.ts:235`, `giftShopViewModels.ts:15`, and
`competition/revenue.ts:21` demonstrate the distinct visible financial readers.
`facility-inspection.ts:83`/`:125` observe accepted question/payment transitions
before retirement. Payroll/rent/stock posting use current contracts/scalars and
live work, rather than replaying these old rows. No tester analytics count is
backfilled from retained-history length: scored usage observes the final accepted
answer transition (`playtime/scoredQuestionUsage.ts:4`). External flags/usage
outboxes are outside this state and were not modified or used as a corpus.

## Validation and handoff (complete; implementation stopped)

Owned public files: this ExecPlan and an appended bounded-thread handoff only.
Private scripts, snapshots of public source inputs, numerical measurements and
logs are under `.local-dev/save-headroom-20261115/`. Approved owner source files
remain read-only; the continuation operates on an in-memory clone.

Source audit: 2,235 captured source/config/fixture/tool inputs, **zero changes**.
Level 5 bound inputs changed by this lane: **none**. No rebind or evidence/results
write. No "after retention" runtime is asserted, since implementation stopped at
the explicit gate. Current-context CHECK figures below are baseline measurements,
not differences caused by this lane.

Pacing CLI PASS: first finish 26,377, reference 26,281, drift +0.365282904%;
5,913,995 cents, 442 completions, 0 walkouts. Native full journey: 35,342 commands,
6,966,492 closing cents, 551 completions, 0 walkouts, final tick 33,091. The
read-only frozen-input diagnostic retains command/state hashes and checkpoints.
An extension after the completed native capture initially hit a harness-only
hash-after-digest error; its completed core receipt is valid. The actual Level 5
CHECK entry was then run separately with canonical writes forbidden and its
ordinary private progress output redirected into this task's numeric receipts.
It **exited 0**, including ordinary cash reconciliation, first/higher/lower report
assertions and retirement/award invariants; it reproduced 35,342 commands and
6,966,492 cents. The manager's latest retained handoff has the same four journey
totals and first-finish tick. Delta attributable to this lane is zero; no rebind.

For clarity, the main tree's still-bound canonical JSON is older:

| Metric | Canonical evidence | Current CHECK (both captures) | Pre-existing difference |
| --- | ---: | ---: | ---: |
| Commands | 26,362 | 35,342 | +8,980 |
| Closing cents | 6,056,335 | 6,966,492 | +910,157 |
| Completions | 410 | 551 | +141 |
| Walkouts | 0 | 0 | 0 |

Those differences predate this lane and explain why the canonical evidence
tests still fail. They are not a retention-induced economic change: there was
no runtime edit, and both current native measurements reproduce the manager's
latest recorded current-context totals. The canonical files remain byte-exact.

The private continuation completed 1,200 real reducer ticks. It confirmed the
first transient crossing and both day endpoints without a runtime error. Its
protected learning/discussion roots keep growing while terminal movement and
other variable live work shrink. Exact root/day numbers, usage-based session
estimate and all ceiling headrooms are private in `owner-growth-summary-private.json`,
`profile-growth-private.json` and `measure-private.json`. No shortened/re-encoded
owner campaign was written; existing saves remain unchanged.

Commands use `CI=true`, `npm.cmd`, `--pool=threads --maxWorkers=4`. First attempted
all-workspace test invocation hit the sandbox's optional Vite `net use` spawn
probe in three imported-config workspaces. Those workspaces were rerun with a
private offline adapter that returns no mapped drives for that exact optional
probe; assertions, timeouts, pool and product source are unchanged. All seven
workspace suites have a completed run:

| Suite | Exact result | Duration |
| --- | --- | ---: |
| Player | `Test Files 464 passed (464)`; `Tests 5603 passed (5603)` | 932.22 s |
| Game domain | `Test Files 2 failed / 224 passed (226)`; `Tests 27 failed / 6125 passed / 1 skipped (6153)` | 614.28 s |
| Balance config | `Test Files 26 passed (26)`; `Tests 168 passed (168)` | 1.56 s |
| Clinical authoring | `Test Files 7 passed (7)`; `Tests 81 passed (81)` | 442 ms |
| Clinical content | `Test Files 10 failed / 225 passed (235)`; `Tests 11 failed / 3514 passed (3525)` | 172.34 s |
| Clinical research | `Test Files 8 passed (8)`; `Tests 83 passed (83)` | 3.53 s |
| Clinical context workbench | `Test Files 8 passed (8)`; `Tests 43 passed (43)` | 1.24 s |

Exact failing-suite summary lines (the table above uses slashes for Markdown):

```text
 Test Files  2 failed | 224 passed (226)
      Tests  27 failed | 6125 passed | 1 skipped (6153)
   Duration  614.28s (transform 32.42s, setup 0ms, import 736.38s, tests 1685.13s, environment 19ms)

 Test Files  10 failed | 225 passed (235)
      Tests  11 failed | 3514 passed (3525)
   Duration  172.34s (transform 38.48s, setup 0ms, import 551.82s, tests 105.19s, environment 17ms)
```

Domain's 27 are exactly the known baseline: one static approved-admission count
and 26 Level 5 evidence-input/legacy checkpoint assertions (one binding plus 25
Level 0-4/schema comparisons). None is a new retention failure. No expectations,
guards, clinical rows or evidence were changed. Clinical's separate 11 are
pre-existing acceptance/protected-source mismatches, not failures introduced by
this lane; zero captured-source drift proves their inputs were unchanged:

| Clinical failing test | Mismatch / count |
| --- | --- |
| `question-flags3-20261107.test.ts:124` | schema protected-source hash, 1 |
| `question-harden1-n3r4-acceptance-20261110.test.ts:64` | diagnostic binding file authorized-postimage hash, 1 |
| `question-program-batch5-acceptance-20261111.test.ts:144`/`:201` | reviewed topic source hash and authorized ethics test postimage, 2 |
| `question-stats1-20261108.test.ts:182` | schema protected-source hash, 1 |
| `question-stats1-acceptance-20261108.test.ts:98` | cloud automatic-resolution test postimage, 1 |
| `question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts:305` | salvage serialization hash, 1 |
| `question-topic-esophagus-motility-achalasia-20261111.test.ts:731` | salvage serialization hash, 1 |
| `question-topic-pediatric-gi-abdominal-wall-20261111.test.ts:416` | retained-context hash, 1 |
| `question-topic-surgical-infection-antibiotics-20261111.test.ts:396` | salvage identity/queue deep equality, 1 |
| `question-topic-trauma-initial-abdomen-20261111.test.ts:83` | schema protected-source hash, 1 |

These require their acceptance owners to reconcile; this report does not declare
every mismatch an authorized delta or weaken a guard. Full logs and exact
expected/actual failure evidence remain in the private receipts.

`npm.cmd run typecheck`: **all seven workspaces passed, exit 0**.
`npm.cmd run build`: **exit 0**, including all seven typechecks and
`npm.cmd run test:boundaries`. Exact boundary output:

```text
Using verified read-only index inventory; no Git process invoked.
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
```

The existing read-only boundary adapter verifies the current index digest before
supplying its captured inventory; current dependency/source/launcher checks run
unchanged. No Git process was invoked. Actual production build:
`692 modules transformed`; `built in 16.78s`. Existing chunk-size, mixed dynamic
import and plugin-timing advisories are non-failing. No source/pin/evidence drift
was found after validation. `validation-summary.json`, exit receipts and complete
logs preserve the exact outputs (the expected-failing all-workspace invocation
exits 1; targeted workspace retries above are separate passing runs).

No new under-target regression test can be supplied honestly without resolving
the stop gate; the actual public journey exceeds the target and protected review
growth remains unbounded. Manager decision needed: authorize finite headroom
with protected-growth explicitly excluded from a boundedness guarantee, or choose
a different durable-storage/preservation strategy. Neither decision has been
made here. Any such follow-up must retain exact current/day/rolling financial
outputs, frozen UI/flag context, idempotent awards and active work references.

Open risks: immediate private-capacity spikes remain possible; future content
adds empty learning entries during hydration; finite non-learning cleanup alone
cannot provide indefinite capacity. No clinical/FSRS, transport, save format,
DB/RPC, origin/browser storage, release tree, deployment or network change.
