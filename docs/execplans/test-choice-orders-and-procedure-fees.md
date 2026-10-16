# Test-choice execution and approved procedure fees

## Goal and authorization

2026-09-28 owner approves perianal procedures $200 and breast/FNA procedures
$150. Owner reports a genetic-test choice skipped phlebotomy and requests an
audit of all laboratory/imaging/etc answer choices so ordered studies perform
the available onsite work and earn revenue before patients leave, including
terminal questions. This is a correction/extension during owner playtesting.

## Requirements and constraints

- Preserve all dirty work, prior approved procedure timing, GS-025 busy-resource
  queues, technician-only radiology, report-in/return and complete departures.
- Preserve clinical source text, meaning, concept IDs/review status and authored
  result narratives. Operational metadata must not invent clinical findings.
- Separate collection/acquisition from external processing. Do not route urine,
  stool, tissue or referral-only actions through venipuncture by name matching.
- Revenue follows actual completed eligible onsite work, exactly once. Terminal
  chart filing must not send patients out before required work finishes.
- Preserve previously frozen routes, timing, quotes and saves; no retrospective
  income, no owner-save inspection/reset or owner-server restart.
- Canonical game remains START_GAME.cmd -> http://127.0.0.1:4173 in usual profile.
- No commit, GitHub push, deployment, new clinical questions or global timing
  redesign is authorized by this request.

## Repository state

Shared beta with411 dirty/untracked status entries at intake. Root AGENTS and
current/GS-025 handoffs read. Other tasks' art, room, queue and clinical work
must be preserved. Capture task-relative source baselines before each writer.

## Decisions and open questions

Interpret price groups as anorectal/hemorrhoid/anoscopy/perianal and pilonidal
procedures $200, breast procedures and thyroid FNA $150. Other prices stay.
Owner can correct the explicitly communicated grouping. Future-only procedures
remain inert until authored, with approved prices recorded for future use.

Question sent: should incorrect selected tests execute, or only the correct test
after feedback? This affects clinical progression/result semantics; do not
silently treat a distractor as an approved procedure. Exact reported genetic
case requested optionally; whole-catalog audit proceeds independently.

## Milestones and ownership

1. Terra test_choice_inventory: exhaustive active-release answer-choice audit,
   coverage gaps and specimen distinctions; read-only runtime, artifacts only
   under .local-dev/test-choice-audit. Complete; also owns the six durable
   independent inventory/exact-matcher regression checks.
2. Sol test_order_architecture: read-only terminal/nonterminal queue/result,
   revenue and compatibility design, followed by runtime implementation and
   behavioral tests. Complete and parent-reviewed.
3. Terra ct_staffing_audit reused as sole scoped writer: approved fee changes
   and meaningful fee regressions. New worker creation hit the thread limit;
   existing fitting Terra worker reused successfully. Fees and review extractor
   refresh complete and parent-reviewed.
4. Sol completed explicit operational mappings, terminal execution, collection-only
   continuation and narrow review corrections; final integrated source checks pass.
5. Terra procedure_browser_validation prepared browser fixture/spec and passed
   focused terminal genetics, CT and gated genetics. Sol reused to finish active
   reload, collection-only continuation and final framed visual acceptance.
   Complete. Parent reviewed final spec/results/screenshots and verified4198 closed.

## Acceptance

Every test-choice entry in current release has an explicit operational handling
or documented exclusion/unavailable facility route. Regressions cover genetic
collection, terminal lab and imaging, gate-based tests, resource queue, patient
and employee arrival, founder availability, premature chart filing, no duplicate
work/revenue, reload, frozen older orders and missing facility fallback. Fees
match owner decisions without changing quoted in-progress work. Browser proof
must use isolated storage/origin and leave owner game untouched.

## Progress and next action

Current: implementation and parent source review complete. Final integrated checks
pass: domain594/50 files, player507/82, balance38/3, audit1, all affected types,
boundaries/launcher and isolated production build. Final combined browser run
passed5/5 in2.8m on the frozen runtime; log:
`.local-dev/test-choice-browser/playwright-all5-final.log`.
Parent inspected final spec and centered genetic/CT/paired-
serum screenshots. Private4198 is stopped and parent verified no listener; final
handoffs updated. Complete locally; next action is owner playtesting through the
usual START_GAME.cmd -> http://127.0.0.1:4173 pathway. No owner save was accessed.
No commit/push/deploy; remind owner to say "push to GitHub" for an audited backup.

Initial active-release audit inventories450 cases,703 nodes,2752 choices and1181
timed choices, including75 correct terminal timed choices. Initial missing-work
count was overinclusive: it missed the already-implemented exact procedure
allowlist (e.g. four breast abscess aspirations) and includes future surveillance
and specialist referrals. Terra is correcting classifications before acceptance.
Likely reported FHH terminal genetic choice has no service/gate; FAP genetic gates
are external-only. Phlebotomy work and external result handling must stay distinct.

Architecture review confirms encounter service operations already provide the
necessary resource queue, physical patient/employee attendance, frozen quotes,
chart-close hold, payment and eventual departure. Reuse those for terminal
acquisition/collection; do not invent terminal PendingResult narratives. Prefer
explicit domain operational mapping and frozen new order metadata, preserving
authored clinical content. Existing unanswered frozen cases can receive a new
operational order if exact IDs/text match; previously ordered/completed work
must not be repriced, rerouted or replayed.

Fee milestone complete: Terra ct_staffing_audit modified catalog and two test
files only. Astra reviewed actual baseline diffs and independently passed
balance 15/domain procedure 26 tests. Future-only prices remain inert; no routine
ultrasound double billing. Baseline `.local-dev/test-choice-fees-baseline`.

Parent stated conservative default while optional wrong-answer clarification is
pending: preserve existing wrong-answer behavior, add no extra distractor work;
correct selected terminal studies execute. Existing gate correction behavior
remains. Sol test_order_architecture now sole core runtime writer, preserving
fee changes and snapshotting postfee/precore files. Terra independently prepares
exact recommendations for the 67 remaining contract gaps. Refined audit separates
222 gate choices, 5 existing timed procedure choices, 5 future plans and 67 contract
gaps; six correct no_test text candidates require inspection, not automatic work.

Mixed-workup decision: execute explicitly supported local components for terminal
orders, with external remainder recorded and no claim the entire bundle finished.
Do not model patient-requiring external mammography as mere external interpretation
after local ultrasound. Existing nonterminal combined external routes remain
external unless their actual staged patient journey is implemented.

Single FHH nonterminal paired serum/24-hour urine exception: approve a persisted
test-only continuation descriptor. After feedback, hold progression through the
existing 15-minute blood collection and physical Front Desk return. Then release
the existing authored later-followup node with its time-skip framing intact.
Record collection completion and the external/take-home remainder; no synthetic
clinical finding, false confirmation, or invented genetic interval. Preserve the
existing narrative's distinction between collection and later confirmed followup.

Standard gate audit also covers existing facility templates for CT angiography,
venous duplex, blood serologies and standard endoscopy; specialized probes,
pathology review, advanced interventions and multi-modality workups cannot be
silently collapsed into one generic room visit.

Parent interim integrated validation: domain590/50 files, player506/82 files,
balance38/3 files, player types, boundaries/launcher and isolated production
build passed. Three historical balance assertions that required external-only
routes were updated to preserve explicit external fallback checks and assert the
new supported onsite equivalents. These are interim results before final review
corrections, not final acceptance.

Independent inventory now pins1181 timed choices and75 correct terminal choices,
checks all exact records against active labels/IDs/timing, verifies required
supported gate/terminal families and mixed remainders, and rejects altered labels,
case/question IDs and unrelated same-profile choices. Six checks pass. Procedure
fee extractor/current JSON refreshed; parent reviewed actual tooling diff and
independently passed its test. Fee-only specialized rows remain encounter-only
and hidden from the generic visitor catalog.

Browser preparation exposed obsolete non-operational geometry in the older Level2
visual fixture and its unconditional reload seeding. Terra must use an operational
fixture with one-time seeding and inspect gated orders via PendingResult, not
ServiceOperation. No owner-save defect inferred from those fixture failures.
Parent runtime review additionally requested actual scope clinician arrival,
new-route work-after-arrival timing, and onsite labels for the collection-only
continuation (previous UI inferred away when PendingResult was absent). Sol owns
these narrow corrections and regressions before final browser rebuild/acceptance.

Final review corrections implemented and accepted: exact new onsite gate routes
adopt arrival-based timing/provider travel without rewriting saved old orders;
collection-only status/chart text correctly shows onsite work/Front Desk return.
Terminal bidirectional scope regression covers full75-minute Endoscopy and45-minute
Recovery phases, one$400 receipt and full departure. Gated scope regression checks
provider arrival, full resource work and external pathology separation. Existing
gated-scope visualization still uses one patient destination across its sequential
Endoscopy/Recovery timing; physical two-room movement is proved for terminal scope
ServiceOperations. This existing visualization limitation is not rebuilt here.

Browser acceptance covers terminal FHH collection15/$50 with early filing hold,
terminal CT acquisition/payment, FAP collection/Front Desk/next authored node,
active-order reload preserving operation ID/quote/phase and one payment, and FHH
paired-serum continuation with onsite UI, full collection and authored follow-up.
Fixtures are synthetic with one-time seeds; owner profile/save was not used.
Screenshots are in `.local-dev/test-choice-browser/screenshots/`. Production build
is checked separately; rendered inspection uses private Vite DEV4198 because the
existing opt-in scene hook intentionally is absent from production previews.
