# Procedure Room routing, cost and duration review

## Goal and authority

Status: COMPLETE locally, technically verified 2026-09-24. Owner playtesting may
continue at the unchanged canonical origin. All implementation and validation
milestones are complete; no new feature work remains in this bounded plan.
No commit, GitHub push or deployment was performed. At this valuable local
checkpoint, remind the owner to say "push to GitHub" for an audited backup.

Latest owner direction (2026-09-24) supersedes the earlier implementation hold:
"If this is all we can think of, then we can push these changes to the game".
Apply approved routing/timing to the LOCAL game. No GitHub backup or Pages
deployment is inferred. The bounded list is sufficient; no further brainstorming
is a prerequisite. Preserve existing fees; do not invent new income charges.

Approved onsite work durations (facility/game minutes):

| Room | Action | Minutes |
| --- | --- | ---: |
| Ultrasound | US-guided thyroid FNA | 60 |
| Ultrasound | Image-guided breast core biopsy | 60 |
| Ultrasound | Image-guided breast abscess aspiration | 60 |
| Minor Procedure | Breast cyst aspiration | 15 |
| Minor Procedure | Cutaneous abscess incision/drainage | 15 |
| Minor Procedure | Superficial incisional infection drainage | 15 |
| Minor Procedure | Diagnostic skin biopsy | 15 |
| Minor Procedure | Anoscopy | 15 |
| Minor Procedure | Office hemorrhoid banding | 30 |
| Minor Procedure | Excisional biopsy | 45 |
| Minor Procedure | Perianal abscess drainage | 15 |
| Minor Procedure | Thrombosed external hemorrhoid excision | 15 |
| Minor Procedure | Pilonidal abscess drainage | 15 |
| Minor Procedure | Cyst or lipoma removal | 45 |
| Minor Procedure | Seroma aspiration | 15 |

Discontinue generic automatic procedure visitors; only procedures for patients
coming through clinic. Do not remove unrelated service visitors. Work duration
excludes travel and external pathology wait. Existing correct authored actions
are mapped explicitly. Future-only procedures receive reusable definitions;
no new clinical questions, rewritten indications, or distractor promotions.
Existing frozen encounters and pending timers remain compatible.

2026-09-24 follow-up: owner approved proposed room work durations of 15 game
minutes for aspiration, abscess/drainage, diagnostic skin biopsy and anoscopy;
30 for office hemorrhoid banding; 45 for excisional biopsy. Add anoscopy/banding
to proposed room list. Discontinue generic automatic procedure visitors; only
clinic patients. Explicit instruction: do not put changes into the game yet.
Record decisions in review documents only. Costs/fees remain pending. Additional
candidate procedures are suggestions only, with no automatic runtime mapping.

2026-09-24 owner playtest follow-up in GS-023: selecting "Reflux monitoring off
PPI" appeared to send patient and founder to the Procedure Room to wait. Owner
rejects that behavior and requests review/approval of every Procedure Room
trigger, cost and duration. This milestone audits current behavior and prepares
concrete approval rows; it does not choose replacement economics or timings.

## Constraints and repository state

Read root AGENTS.md, current handoff and GS-023 plan. GS-023 M1-M4 are complete;
do not rebuild them. Shared beta has 141 modified and 223 untracked status entries
at intake. Preserve all inherited work, approved room integration, frozen saves,
clinical IDs/review state and other active workers' changes. No owner-save or
server operation, installs, deployment, commit or push. Existing timing values
are prototype configuration, not clinical duration claims. No new clinical
content or source ingestion is necessary for this software audit.

## Ownership and milestones

Implementation continuation:

1. Sol `approved_procedure_routes` owns necessary balance/domain/player and
   clinical routing metadata changes plus meaningful tests; sole runtime writer.
   Capture each touched existing file in
   `.local-dev/gs023-procedure-routing-baseline` before edits. Shared beta remains
   extensively dirty (141 modified/226 untracked status entries at resumption).
2. Astra reviews actual task-relative diff, timing/reservation/compatibility
   decisions, and independently verifies targeted acceptance and typechecks.
3. Delegate isolated browser proof after runtime freeze; preserve owner4173 and
   saves, build to explicit isolated output if needed. Verify displayed room
   destinations, phase durations and departure after local work.
4. Update owner review, audit evidence and handoffs; report local completion and
   invite explicit "push to GitHub" for audited backup. No automatic publication.

Validation covers positive mapped actions and negative distractors/referrals,
reflux offsite, no generic procedure arrivals, provider/room/US resource
contention, saved in-progress work and old frozen timing preservation. No broad
clinical meaning changes or unrelated art/room changes.

1. Terra `procedure_routing_audit`: bounded routing investigation and reproducible
   inventory; owns only new `tools/procedure-room-audit/` and
   `docs/reviews/procedure-room-routing/` artifacts. No runtime edits or agents.
2. Astra: independently inspect relevant routing/cost/time code and audit output,
   review extraction coverage and validation, present concise owner decisions.
3. Owner review: record explicit routing, money and duration approvals. Implement
   specific approved corrections as a separately delegated milestone if needed.

## Acceptance and validation

- Explain the reflux observation, distinguishing reproduced facts from hypotheses.
- Cover case care-room selection, result-gate/service routes, final-answer
  procedures and automatic service visitors; include capability/level conditions.
- Enumerate active cases/choices with stable IDs and grouped approval rows.
- Describe fees versus expense, room reservation duration versus travel/off-site
  time, simulation units and founder/provider requirements.
- Retain exhaustive machine-readable details and source references; mark owner
  decisions pending and distinguish saved legacy encounters.
- Run inventory consistency/probe checks; no broad unchanged-feature test rerun.

## Progress and next action

### Browser-discovered terminal departure correction implemented

Terra's real-actor check found a runtime defect after using the normal terminal
"Resolve Completed Chart" action: a banding operation remained in service for
30 minutes, but the resolved encounter had already started leaving the clinic.
Initial browser diagnostic: at tick 15 the operation held the minor room (work
ticks 6–36), while the patient
was following `leaving_after_resolution`. Sol now owns the bounded correction
and regression: filing the completed chart must preserve the active procedure,
then allow departure after completion. Retain settled learning/rewards and
normal nonprocedure chart resolution. Terra owns only browser spec/evidence;
no weakening of real-actor room assertions.

Sol fixed chart filing while the procedure remains active, recovery of saved
resolved-plus-leaving conflicts, and departure after completion/cancellation.
Astra reviewed the actual reducer/service-operation diff. Natural terminal-flow
regressions cover 15/30/60-minute procedures and legacy conflict reload. Final
independent full domain 552/552 and player 496/496 passed after this correction;
domain/player types, boundaries, launcher contract and final isolated build also
passed. Terra's focused banding browser rerun passed 1/1; final combined browser
proof passed 4/4 (1.1m), with correct camera targets and stable short-phase capture.
The refreshed `.local-dev/gs023-procedure-browser/banding-render-diagnostic.json`
now records the fixed state: resolved chart, active procedure, no leaving movement.

### Earlier accepted runtime checks

Sol `approved_procedure_routes` completed the runtime milestone; Astra reviewed
all task-relative runtime diffs against captured baselines. No clinical wording
or IDs changed. New work opts into timing version 1; markerless same-route skin
biopsy saves retain 60+120 timing, and legacy operation IDs retain 45/60 work.
Travel cannot consume approved procedure work or incorrectly make a long-walk
anoscopy/remote-but-reachable ultrasound technician unavailable. Only approved
routes opt into these changes. Preview estimates remain service/result time.

Independent accepted checks:
- Full domain 548/548, player 496/496 and balance 34/34 passed before the final
  bounded travel corrections. Final affected domain five-file run 58/58 passed;
  final procedure/ultrasound pair 30/30 passed after technician-travel correction.
  After test review replaced stored-location assertions with the renderer's
  derived-location selector, final procedure suite passed 20/20 independently.
- All eight workspace TypeScript configurations passed; affected domain,
  balance and player were repeated after source changes. Boundaries and launcher
  contract passed. Isolated final production build passed at
  `.local-dev/gs023-procedure-build-final` (existing large-bundle warning).
- Terra `procedure_candidates` refreshed the exhaustive audit and preserved
  `pre-change-routing-inventory.json`. Astra reviewed discovery coverage and
  required checks for all minor-room routes/operations, outsourced equivalents,
  legacy labels and exact terminal tuples. Independent extractor passed 1/1.

Terra `procedure_browser_validation` completed all four browser scenarios.
Astra inspected the final spec, persisted successful CLI log, diagnostic state
and unpaused FNA/skin/banding screenshots. Exact log:
`.local-dev/gs023-procedure-browser/playwright-final.log`; spec:
`tests/e2e/approved-procedure-routing.spec.ts`. Private Vite PID35436 was stopped;
Terra and Astra verified no listener on 4198. These are synthetic equipped-clinic
fixtures, not proof of a natural tutorial walkthrough. Initial failures were fixture assumptions
(check-in/room geometry, feedback acknowledgment, stored versus derived travel
location and opt-in scene hook); do not treat those runs as accepted evidence.
Owner server/profile/save at 127.0.0.1:4173 remains untouched. No browser proof is
claimed for the no-ultrasound fallback; that routing is covered at domain level.

- Implementation continuation (2026-09-24): Sol implemented exact clinic-action
  mappings, approved onsite routes/work durations, versioned compatibility,
  encounter-only procedure operations, physical staff routing and early return
  to a reserved waiting destination during external pathology. Astra reviewed
  task-relative baselines and returned compatibility/preview issues to Sol.
- Interim independent validation: all eight workspace TypeScript configurations,
  player 496/496, app boundaries/launcher checks and isolated production build
  pass. Initial full domain run: 542/544; two provider-selection compatibility
  failures returned for correction. Balance 33/34 with an obsolete route-count
  expectation returned for update. These are interim, not final acceptance.
- Terra procedure_candidates owns current audit extractor/inventory refresh and
  historical snapshot preservation. Terra procedure_browser_validation owns
  only its new E2E spec and isolated test artifacts/server. Explicit separate-file
  parallel ownership permits browser preparation while Sol finishes runtime;
  final acceptance requires a run after runtime freeze. No owner save/server use.
- Next action: resolve focused regressions, verify frozen legacy timing, freeze
  runtime, complete browser proof and final affected checks, then update handoffs.

Historical audit progress before implementation authorization:

- Owner confirms incident origin `http://127.0.0.1:4173`. Read-only HTTP probe
  finds the game health contract and Vite development entry; no campaign state
  was read or changed. Live incident is not reproduced.
- Current source restricts ordinary care selection to Examination Rooms.
  Reflux monitoring uses the offsite-only route with no local room/provider
  reservation. Separate scheduled minor-procedure visitors can use the founder;
  this is a possible concurrent activity, not an established incident cause.
- Reviewed two biopsy routes, three service-operation rows, nine exact terminal
  answer triggers, and eight biopsy case gates. Terra is finalizing the complete
  human-readable and JSON inventory with source-linked validation.
- Independent review identified a biopsy presentation mismatch: resource phase
  is 60 minutes but patient travel returns near the end of the 180-minute total.
  Separate upkeep review corrected legacy field naming: $15 per facility HOUR,
  accrued per minute and posted every 15 minutes. Duration-upgrade helper has no
  current route/operation caller. These are software facts, not medical claims.
- Final inventory reviewed at `docs/reviews/procedure-room-routing/README.md`
  and `current-routing-inventory.json`. Parent independently ran
  `node_modules/.bin/vitest.cmd run tools/procedure-room-audit/extract-procedure-room-routing.test.ts --maxWorkers=1`:
  PASS 1/1. Validation checks catalog counts, resolved correct terminal choices,
  final-node positions, equality with private reducer allowlist and the pure
  travel helper's post-resource-phase location. This is not a live incident
  reproduction or clinical approval. Existing handoff whitespace warnings were
  left untouched; no broad cleanup of inherited changes.
- Audit complete; next action is owner routing/fee/duration review. Runtime
  corrections have not started. No current incident root cause is claimed.
