# Facility diagnostic timing

Status: completed locally on October 7, 2026. GS034 acceptance and remaining
adjacent-task validation limits are recorded in
`docs/handoffs/GS-034_DIAGNOSTIC_TIMING.md`. The owner subsequently requested
"Push to GitHub" for this checkpoint. A scoped recovery backup is authorized;
publication, deployment and acceptance of adjacent tasks remain separate.

## Goal and scope

Complete GS-011-029 and the testing-related functional facility rules from GS-011-030 using the owner's October 7, 2026 timing decisions. Testing answer-choice estimates, order execution, and result-ready states must share a runtime calculation. Preserve all approved ordinary room/character art, clinical IDs and FSRS, saves, already frozen work, fees, and concurrent work. No push, deployment, launcher/origin change, owner-save intervention, new clinical question authoring, or unrelated economy changes.

## Owner decisions

- Bladder scan: 30 game minutes offsite, 5 local; no radiologist interpretation.
- US, duplex, X-ray, contrast swallow, ABI, CT and CTA: interpretation 30 minutes external, 5 with an operational staffed reading room. One study at a time per radiologist, with queues. Existing acquisition/procedure durations are retained unless the owner changes them.
- Basic, genetic, serology, aldosterone and breath labs: wholly offsite 120 minutes; functional phlebotomy collection 15 minutes, one collection at a time per phlebotomist; external processing 60 minutes; operational onsite lab processing 15 minutes.
- Biopsy pathology: external 60 minutes; operational onsite laboratory 30 minutes. Preserve approved local biopsy/procedure work durations.
- Endoscopy: collected pathology uses those pathology times; visual findings become available during the procedure. Preserve current new-work prep 30, procedure 45 and recovery 60 and frozen older contracts.
- Answer choices proposing tests show the complete estimate from facility state, including queues and walking. Every testing option, including distractors, uses the same calculation. No fixed durations in authored question prose.
- Missing onsite room/staff criteria fall back to a valid external route. Busy installed resources queue.
- Reading room: Level 3; construction $1,800, upkeep $24/hour; each radiologist hire $300, salary $26/hour. Owner selected this setup explicitly through the clarification reply. The initial one-position office-reuse proposal was subsequently found to overlap an already approved 4x4 reading-room design with four cubicles. Preserve that approved design. Owner subsequently explicitly selected all four workstations: four radiologists per room, each with their own queue and one active study.
- The specified phase durations are fixed balance choices. The earlier suggested generic 8%/5% speed upgrades were not explicitly approved and must not silently alter them. Existing room workload/satisfaction effects remain. Further speed/capacity tier benefits require an explicit product choice.

All numerical durations/costs are editorial game settings, not real-world medical claims. New AI-assisted clinical mapping evidence, if necessary, remains needs_clinician_review.

## Repository state and constraints

- Shared beta tree contains hundreds of existing dirty/untracked paths, including timing, reducer, balance, UI, art and persistence modules. Never reset, stash, broadly stage, revert or overwrite concurrent changes.
- Read AGENTS.md, current handoff (including October 7 Claude retired-history optimization and appended reading-room approval/backup), latest GS023/25/31/33 receipts, and CLAUDE_ANIMATION_COORDINATION.md before implementation. Reading-room art checkpoint c3d6de662ff5e9c47e2af20829d1593b2f299742 is a design-only backup; this task supplies the separately approved Level 3 functional integration.
- Current playable Levels 0-3; Level 4 remains preview. Level 3 lab processing already exists as a separate manual work queue. A future image-read income row exists at Level 4 but is not a current staffed diagnostic queue.
- Source inventory covers 54 service definitions plus physical operation contracts; not every definition is an independently executable player action. Keep exact-choice operational dispositions and external/planned remainders.
- Current route timing, physical operation phases and answer-choice profiles are distinct sources; do not assume any discrepancy is a bug without checking the complete runtime path.
- Existing approved procedure minutes are 15/30/45/60; preserve fees and frozen pending routes/times. Current new Endoscopy operations use 30/45/60 even where older static route/catalog rows have 75/45.
- Canonical owner pathway remains START_GAME.cmd -> http://127.0.0.1:4173 in the same persistent profile. Private 4174/Tailscale and remote Pages have separate saves. Isolated QA uses an explicitly separate port/context and never accesses owner storage.
- Normal exec and node_repl startup failed with sandbox helper_unknown_error. Narrow read-only shell escalation has been auto-approved; report any actual approval rejection rather than implying success.

## Design decisions and unresolved details

- Introduce an explicit versioned phase plan for new diagnostic orders, separate patient presence/acquisition from result processing and care completion. Existing saved/frozen orders keep their saved contracts.
- Forecast current deterministic queues and travel without allocating resources or changing state during preview. Freeze approved service-phase inputs for new accepted orders; resource allocation and actual delays remain explicit.
- Interpretation/processing queues are remote work; patients must not be routed into a reading room or laboratory simply to wait for results.
- Preserve offsite imaging base totals where possible by identifying their 30-minute interpretation component; verify current semantics before final implementation. Do not add a second interpretation to an already inclusive external wait.
- Endoscopy visual-result timing and pathology collection should be tied to procedure completion while ongoing recovery remains protected. Verify that chart completion cannot prematurely release care resources or duplicate fees.
- New reading-room geometry/presentation must integrate the approved 4x4 proof at tools/room-design/level-4/radiology-reading/ without changing its design or other rooms. The dated approval receipt supersedes frozen provisional metadata. Do not substitute an office or regenerate art. All four functional positions are explicitly approved.
- After acceptance, loss of a processor or reading station preserves completed phases and the remaining frozen work, then requeues for compatible capacity. It does not restart collection or reread balance durations.
- Endoscopy results may be viewed at the procedure milestone; subsequent clinical decisions may retain the existing physical-care completion gate. Processing may overlap recovery. Opening or closing a chart must preserve ongoing patient movement and care reservations.
- Exact existing endoscopy choices determine specimen/result disposition. Generic colonoscopy/bidirectional service names do not imply sampling. Recovered-diverticulitis is visual; esophageal-dysphagia explicitly awaits biopsies; colorectal returns a visual/sampling update with histology still pending, so background pathology remains independent. An exact key, unchanged label and timing profile guard these software annotations. Clinical question prose and review status stay unchanged.
- Answer-choice total is completion of all forecast phases, including collected background pathology, current queues and walking without double-counting overlapping processing/recovery. Clinical result delivery remains gated by the later of result readiness and physical-care/return completion. When a result becomes available earlier, present its result time separately (especially Endoscopy visual findings) while preserving the complete test estimate. Pending result readiness, remaining care and background pathology stay separate in the chart.
- Remote diagnostic processing uses the encounter ID and an explicit nonbillable marker. It creates no receipt, cash, XP or new progression milestone. Existing manual laboratory processing remains a separate 60-minute paid service.
- The concurrent approved character integrations are complete through 225 identities and 1,830 pose assets. Radiologist activation preserves the existing identities and registry. Claude's room touch-up renderer work is also complete locally; reading-room hooks preserve its surface, cap, lighting and fixture hooks.
- Owner-confirmed treatment of an older undivided external biopsy/endoscopy total: preserve the inclusive total and split its final 60 minutes as pathology when a specimen is required. Freeze the remainder as acquisition/procedure with an explicit retained-inclusive-total source marker. A staffed lab may replace the 60-minute phase with 30 plus resource delays. Known explicit phases and approved local operation contracts remain authoritative for local work. Visual-only opaque external endoscopy retains its procedure interval without pathology. The owner explicitly chose “Keep existing offsite totals” through the clarification reply.

## Milestones and ownership

1. Central balance timing contract and Level 3 reading-room/staff definitions. Bounded Sol worker owns balance-config modules and tests only; no runtime mutations outside that scope.
2. Runtime phase planning, serial resource queues, execution/result events and frozen-save compatibility. Sequential Sol worker owns new diagnostic module plus required domain integration and meaningful domain tests.
   While 2A calendar corrections are under review, primary Sol owns the disjoint reading-staff substep: room-capacity.ts, staff.ts, new reading-stations.ts, four radiologist catalog rows, one hiring reconciliation hunk, and reading-stations.test.ts. Worker retains types/persistence/planner/index; it adds the agreed optional stable seat field. No overlapping module edits.
   After 2A acceptance, Sol testing_timing_inventory owns 2B: service-operations.ts, additive physical witnesses/types/persistence/exports, retained outside-protocol planner input and history fallback, and focused operation tests. Primary Sol owns disjoint 2C: diagnostic-order-requests.ts, diagnostic-orders.ts/controller, reducer.ts, selectors.ts, retirement guards and integration tests. Agreed factories are startDiagnosticAcquisitionOperation and startDiagnosticProcessingOperation; physical witnesses, rather than forecast clocks, trigger processing. No shared-file edits between parent and worker.
3. Answer-choice/pending-phase presentation and reading-room/staff presentation. Sequential Sol worker owns narrowly scoped UI/presentation integration and tests; no motion edits.
4. Parent reviews actual task-relative diffs, runs focused integration checks/types/build, validates representative isolated browser scenarios, updates handoff and reports remaining decisions honestly.

Workers share files with concurrent user/Claude work, preserve unrelated edits, do not alter durable planning, install dependencies, spawn agents, commit/push/deploy/publish or message other chats.

## Acceptance and validation

- Bladder 30 external/5 local with no interpretation dependency.
- Imaging acquisition plus 30 external or 5 staffed local interpretation, with only one active read per radiologist. Two radiologists in distinct operational reading positions may work concurrently.
- Labs 120 external, 15+60 collected sendout, 15+15 onsite, plus forecast queue/travel. Each collector/processor handles one job at a time.
- Biopsy/endoscopy pathology external60/onsite30; no added pathology phase for visual-only findings. Recovery and physical clearance stay independent of result readiness.
- Missing/inaccessible/nonfunctional room or staff selects a valid external path; busy resources queue without impossible simultaneous use.
- Preview phase contract matches the accepted order/execution; every testing answer choice has an estimate, including distractors. Mixed workups retain exact local/external components.
- Already started/frozen/queued legacy work roundtrips without reinterpretation, shortened/restarted work, route changes or duplicate results/payments. New versioned plans persist and resume safely.
- Preserve approved art/geometry; demonstrate reading-room preview with existing assets and review UI copy for functional-only benefits.
- Focused balance/domain/player tests; affected workspace typechecks; dependency/launcher checks; isolated player build. Broaden only for justified integration concerns.
- Representative browser scenarios: absent-vs-built room estimates, shared imaging/radiologist queues, one-at-a-time phlebotomy/lab queues, pathology vs visual endoscopy, save/reload during each queued/active phase, frozen older order.

## Progress

- 2026-10-07: Discussion-first source inspection completed; Sol testing_timing_inventory returned read-only inventory. Parent reviewed current source and existing assertions. No game changes during discussion.
- 2026-10-07: Owner supplied concrete timing table and onsite fallback rule, then approved Level 3 reading-room setup and inclusion of queues/walking. This plan records the agreed implementation scope.
- 2026-10-07: Sol diagnostic_timing_balance started the balance contract/definitions milestone. Sol testing_timing_inventory is performing a read-only runtime integration map. Parent independently ran the existing diagnostic/procedure/inventory baseline: 3 files / 75 tests PASS.
- 2026-10-07: Worker caught appended 4x4 reading-room approval. Parent verified the receipt and geometry, paused the planned 2x2 office clone and requested the functional station-count choice. Pure timing-table work continues independently.
- 2026-10-07: Owner selected all four reading-room workstations. Balance worker redirected to the approved 4x4 geometry. Sol diagnostic_timing_ui is preparing a read-only art/UI integration map while balance implementation proceeds.
- 2026-10-07: Milestone 1 accepted after parent inspection of the actual snapshot-relative diff. Only room.reading/staff.radiologist were added to prototype-balance.ts; existing service/profile rows were preserved. The new table classifies every current service/profile by exact ID. The original fractional reading footprints and four contacts are retained; coarse navigation connects all 16 legal door segments to the four posts. Worker and parent independently passed 4 balance test files / 35 tests and the balance typecheck.
- 2026-10-07: Read-only runtime and UI maps completed. Sol testing_timing_inventory now owns milestone 2A: pure planner, additive types/persistence and focused tests. It is the sole runtime writer. Sol diagnostic_timing_ui remains stopped after its read-only map; no runtime artwork changes yet.
- 2026-10-07: Balance worker's read-only biopsy audit identified the exact external transhepatic-biopsy service as pathology sampling. Parent made the narrow mapping/test correction to the biopsy family; its offsite-only route/480-minute inclusive input remains intact. The generic advanced-diagnostic profile remains specialist because it also covers PET-CT. Bone marrow wording does not establish sampling and remains a retained estimate. No clinical text or eligibility changed.
- 2026-10-07: Runtime worker incorrectly used the bundled fallback pnpm command for typechecking; it unexpectedly bootstrapped dependencies and created pnpm-lock.yaml. Parent stopped that path, verified the four original root dev packages in node_modules/.ignored, and restored their original directories with matching package hashes. Every replaced junction and generated lockfile is preserved under .local-dev/facility-diagnostic-timing/dependency-bootstrap-recovery; no package was installed or deleted during recovery. Original TypeScript 7.0.2 and Vitest 4.1.10 run again. All subsequent validation uses npm or explicit existing Node/compiler paths. Tracked package manifests/lockfile remain untouched.
- 2026-10-07: Bounded Astra diagnostic_planner_review independently reviewed the difficult resource-calendar and versioned-save contracts read-only. It found active-reservation ordering, retained-local/profile semantics, time-indexed staff travel, ongoing-care protection and marked-operation validation issues. Parent assigned concrete corrections and regressions to the existing sole runtime writer before accepting milestone 2A. No new owner decision is required.
- 2026-10-07: Primary Sol implemented and reviewed the disjoint reading-staff substep using the four approved existing radiologist identities, four staff slots and persistent per-employee seats. All women20 identities and pose assets remain unchanged. Four domain suites / 23 tests and domain typecheck PASS; actual baseline-relative staff/capacity/catalog/hiring diffs inspected. Initial new tests used incorrect command names; corrected to the existing HIRE_STAFF/FIRE_EMPLOYEE contracts. Execution integration remains outstanding.
- 2026-10-07: Sol diagnostic_timing_ui returned a read-only exact endoscopy contract audit. Parent added diagnostic-result-dispositions.ts and its guard/inventory tests, and changed generic colonoscopy/bidirectional defaults to by_disposition. Every annotation binds active exact keys/labels/profiles, including sampling distractors and visual mixed components. New domain 3 tests and balance 9 tests PASS. This metadata is not yet wired into runtime; no clinical content was rewritten or approved.
- 2026-10-07: Milestone 2A accepted after actual baseline-relative types/persistence/index diff review and inspection of the corrected active calendar, frozen forecast and strict marked-save parsers. Worker passed 37 focused tests; parent independently passed 43 planner/save/metadata/reading tests and domain typecheck. Sol testing_timing_inventory now owns 2B physical/processing execution. Parent is integrating the shared exact request, selectors, controller and retirement guards under the explicit factory/witness handshake. Combined terminal work without a numeric split will use a single intact supplied external profile when no local component is operational; local supported pieces retain the full documented outside protocol without guessed subtraction.
- 2026-10-07: Parent 2C integration now uses one exact-choice request for previews and acceptance, witnesses for actual processing/result milestones, independent return/recovery, and historical background-work retention. Focused tests cover all current testing-choice estimates, external/local laboratory execution, four-position serial reading, protected visual recovery and blocked processing. The read-only Sol controller review identified five integration issues; parent corrected immediate return ownership, care-aware walking, blocked ETA, same-tick result delivery and historical scalar synchronization.
- 2026-10-07: Sol testing_timing_inventory handed back 2B and stopped source writes. Parent inspected the actual service-operation, planner and persistence diffs. Existing Anoscopy/FNA/core-biopsy fee-only rows use their frozen physical contract with their real income IDs; diagnostic processing remains nonbillable. Last worker passing evidence was 51 diagnostic tests/typecheck before final fee regressions. Final rerun is currently blocked by concurrent GS-037 employee-training imports; the latest zero-test output is not acceptance evidence. Sol diagnostic_timing_ui now owns the bounded UI milestone; parent retains runtime validation and review. All concurrent training and completed Claude reading-room presentation edits are preserved.
- 2026-10-07: Milestone 2B accepted from fresh parent validation: all55 planner/save/operation cases PASS after the concurrent imports settled; domain typecheck PASS. Primary Sol's10 current-order integration cases PASS, including actual per-reader serial/concurrent work, same-tick pathology delivery, both direct compound outside visits and mid-protocol reload. Bounded Astra integration review found the missing direct outside-visit modality; parent added explicit mammography/AVS annotations and walking regressions. Existing48 procedure cases remain a separate markerless prior-wording fixture contract, with one current-release compound preview case updated to its phase/walking total; all48PASS. Historical pending pathology retention is also tested independently of service-operation references.
- 2026-10-07: Milestone 3 accepted after parent inspection of the six-file snapshot-relative UI patch and its roundtrip receipt. Sol diagnostic_timing_ui passed53 presentation/control tests and player typecheck. Shared Claude Management and reading-room renderer hunks were excluded from the worker patch and preserved. Choices show complete estimates and phase details; pending cards distinguish early visual findings, protected care and background pathology. Completed historical findings do not leak into unrelated current questions.
- 2026-10-07: Parent completed13 current-order regressions, including all current testing choices/distractors receiving a planned estimate, founder-only procedures, interrupted processing preserving remaining work through reload, actual serial/concurrent readers and same-tick pathology delivery. A local-only inferred representative now uses its supplied external profile and walking when local capacity is absent; it remains preview-only. Legacy ultrasound/endoscopy/procedure tests explicitly exercise prior frozen wording where their old markerless contracts are the subject of the test.
- 2026-10-07: Sol testing_timing_inventory updated only the Oct2/3/7 batch test files and stopped writes. Parent inspected the exact99-addition/21-deletion baseline-relative patch. All842 cases PASS, retaining clinical keys, FSRS, saves, fees and the80-node/320-choice October7 inventory. Busy ultrasound coverage uses a real competing operation and actual completion witnesses rather than clearing staff tasks.
- 2026-10-07: The concurrent owner-approved GS037 design distinguishes temporarily away staff from missing installed capacity. Such work waits locally; achieved category skill still includes staff in training. Its employee benefits modify newly frozen staff-controlled work without changing this base timing table or existing accepted work. Parent repaired lazy employeeTrainingSequence normalization so old raw saves without training retain their exact optional-field absence;29 focused player save/choice tests PASS. GS037 owns its training implementation. Astra's final read-only overlap review found no remaining issue after live resource selection was changed to prefer available compatible coverage, relaxing unknown training holds only as a structural fallback. Diagnostic factories do not apply training benefits twice.
- 2026-10-07: Isolated production build succeeded without changing the owner build/server. Private QA used127.0.0.1:4187; rendered four-desk inspection uses private development4188 because the proof hook is development-only. Fresh browser profiles never access owner storage. Desktop quotes, four active readers/fifth queued, both endoscopy result dispositions and serial laboratory completion/fees/reload PASS. Final six-scenario desktop/phone run is in progress. Synthetic fixture failures were traced to a paused offline clock, absent production proof hook, disabled historical choices and ordinary optional-field normalization; corrected assertions continue to require exact diagnostic work preservation and actual completion/fee evidence.
- 2026-10-07: Fresh balance suite66/66 PASS; balance/player/domain typechecks and dependency/launcher boundary checks PASS after a narrow concurrent fee-fixture correction. An earlier full shared-tree run passed2224/2235 domain and677/678 player cases; subsequent focused corrections passed49 planner/operation cases and6 build view cases. Full domain/player acceptance reruns are in progress; their final reports, rather than the earlier intermediate counts, determine final acceptance. Evidence remains under ignored .local-dev/facility-diagnostic-timing/ and corresponding workspace-local report paths.

## Discoveries

- 2026-10-07 backup preparation: after concurrent Build Mode checkpoints advanced
  beta, parent independently reran the seven diagnostic/reading/legacy-procedure
  suites:126/126 PASS; three diagnostic/chart presentation suites:19/19 PASS;
  balance/domain/player typechecks PASS. These fresh checks use the latest shared
  source; they do not accept the separate upgrade, training or artwork tasks.
  Raw reports remain ignored and only sanitized results belong in the archive.

- Basic labs previously had 60 external versus 15+60 local sendout; owner replaces external with120 and onsite processing with15.
- Configured generic room speed reductions are displayed in UI but have no current runtime consumer. Do not apply them automatically to the owner's fixed new phase times.
- The L3 independent lab work queue and L4 future image-read income row must not be duplicated or silently turned into extra payouts for diagnostic work.
- Legacy queued pending results read current route timing at dispatch; preserve old route rows and opt new orders into a versioned planner rather than globally changing those rows.
- October 7 retired-history pruning must preserve encounters with active diagnostic processing or safely persist their result work; terminal collection can finish before remote processing completes.

## Next action

GS034 is complete: all 126 focused timing/reading/legacy-procedure cases PASS;
66 balance, 55 focused player/save and 19 final caption/chart cases PASS; all 12
desktop/phone browser scenarios and 4 post-caption Endoscopy reruns PASS. Affected
types, isolated production build, boundaries and scoped whitespace checks PASS.
Parent inspected actual worker diffs and browser images. The full shared-tree
runs retain adjacent active-task failures documented in the scoped handoff;
these are not a clean release acceptance. Preserve GS037/GS038/Claude ownership.
The owner requested "Push to GitHub" after acceptance. Sol
testing_timing_inventory is assembling only the GS034 recovery archive; parent
owns the source/privacy/secret audit, exact staging, commit, push and remote
verification. Recorded task baselines and inferred narrow preimages separate
this feature from the large shared dirty tree. The archive is recovery-only,
with earlier and concurrent dependencies recorded explicitly; it is not a clean
runnable checkout. Next: review the actual package and verify origin/beta.
Owner pathway and saves are unchanged.
