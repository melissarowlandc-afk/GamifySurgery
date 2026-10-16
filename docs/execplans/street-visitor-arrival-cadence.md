# Street visitor arrival cadence

## Goal / intake — 2026-09-28

Owner reports street traffic for labs, CT, US, coffee and other services feels
slower after full visible arrival/departure paths. Determine whether longer
journeys inadvertently reduce arrivals, fix demonstrated scheduling regression,
and preserve full visible travel. Do not blindly increase fees or rewrite the
approved economy. Canonical owner START_GAME.cmd -> http://127.0.0.1:4173 and
persistent profile unchanged; no owner-save/server access or push/deployment.

Read AGENTS/current handoff and prior clinic playtest plan. Shared beta has433
dirty entries at intake. Preserve all work, especially concurrent GS028 planning
and seating/art. Prior milestone622 domain/511 player tests passed.

## Ownership and milestones

1. Sol test_order_architecture: read-only scheduler diagnosis and ignored
   quantitative simulation evidence; compare existing pre-continuity snapshots.
2. Astra: review intended catalog rates and decide narrow correction from facts.
3. Worker implementation in service/retail scheduler and focused tests only after
   scope accepted; no question/admission/economy changes without demonstrated need.
4. Parent review task-relative diff, independent relevant tests and handoff.

## Acceptance

Separate scheduled arrival frequency, travel time, resource throughput and paid
completions. Labs/US/CT and coffee each accounted for; busy resource rules and
queue bounds remain meaningful. Full sidewalk walking preserved. Due services
must not starve or lose appointments merely due to unrelated visitors; no burst
backlog after disabled appointments, offline time or missing capacity. Reload
stable, no duplicate receipts, no same-resource double booking. Quantitative
before/after operational simulation and focused regressions required.

## Progress / next action

Sol read-only investigation assigned; parent reviewing configured cadence and
economy assumptions. No runtime edits in this milestone yet.

## Diagnosis and accepted correction

Operational fixed-seed720-minute Level2 simulation, with one and three imaging
techs, has current and modeled pre-continuity arrivals US4/XR2/CT2/labs4=12.
Walking adds218 arriving actor-minutes and increases departure90->309 minutes,
but did not reduce admission counts in this comparison. The scheduler discarded
13 of25 due opportunities by advancing ALL due timers before admitting at most
one. Coffee remains separately scheduled:5 external shoppers in both modes;
coffee receipts match within staffing comparison (4 with one tech,3 with three).
No evidence supports changing coffee demand or fees as a regression fix.

Evidence `.local-dev/street-visitor-arrival-cadence/simulation.json` and script.
The old-entrance mode is a controlled current-reducer counterfactual applying
the snapshotted old visitor travel semantics; it is not the old module executed
wholesale. Do not overclaim historical live-campaign equivalence.

Parent authorized Sol bounded service scheduler/test implementation: preserve
one pending due per eligible installed line; only admitted line resets to now
plus cadence. Existing30-minute spacing/fairness/wait caps remain. Disabled or
missing-capability lines clear their clock and reinitialize fresh. Visitors
walking out no longer consume a clinical admission slot after releasing work
resources; full visible departure remains. No retail/clinical/balance changes.
Actual implementation must replace modeled pending-due shim for final measured
counts, with cancellation/paid/in-progress totals distinguished. Expected model
21 arrivals/12h vs12 currently; resource throughput still depends on staffing.

Persistence integration accepted: previous normalization discarded all due ticks
at/before facility time. A deliberately pending single appointment must survive
reload, so retain valid nonnegative safe ticks; no offline facility time advance
or multi-appointment accumulation. Disabled/missing-capability clearing remains
in the scheduler and is regression-tested. Sol owns this minimal persistence
change in addition to scheduler/tests.

Optional owner preference requested separately: keep existing coffee/retail
demand or increase to about one street shopper/game hour. Default remains
unchanged unless owner answers; diagnostic bug correction proceeds independently.

Owner answered: **Keep retail unchanged for now.** No coffee/retail rate or fee
changes are authorized in this milestone.

## Complete locally / validation

Sol changed only service-operations.ts, persistence.ts and
service-operations.test.ts. Parent reviewed the baseline-relative diff in
`.local-dev/street-visitor-arrival-cadence/implementation.diff`. Tests cover
four simultaneous services admitted at ticks1/31/61/91, unchanged pending due
values through spacing and reload, capacity blocking and departure release,
capability loss/return, toggle resets and exact-once fees.

Parent independent full domain **624/51 files PASS**, actual-source simulation
**1 PASS**, domain typecheck, boundary/launcher checks, scoped whitespace and
isolated production build PASS (existing large-bundle advisory). Worker focused
service+retail32 PASS. No browser run needed: changes are scheduler/persistence
only and prior full-path browser acceptance remains applicable; walking itself
is exercised by the full domain suite and actual-source simulation.

Final twelve-hour results (same operational fixture/seed): **21 diagnostic
arrivals** (US6/XR4/CT3/labs8) versus12 before, **zero dropped due opportunities**.
Three techs:20 paid,1 unpaid unfinished,0 cancellations. One shared tech:17 paid,
1 unpaid unfinished,3 capacity-timeout cancellations;1 of the17 paid actors is
still walking out at the cutoff. These are measured fixture results, not a
guarantee for every clinic. Walking delays completion but no longer consumes
admission slots after work ends. External retail arrivals remain5; retail demand
and fees unchanged. Optional shopping receipts can vary with visitor timing.

Before report preserved as simulation-before.json; final simulation.json and
parent log demonstrate actual implemented source, not the proposed timing shim.
No new clinical claims, rates, fees, generic procedure visitors or UI changes.
All dirty work preserved; no owner-save access, server change, commit or push.

Next: owner playtest at START_GAME.cmd -> http://127.0.0.1:4173 in usual profile.
Say "push to GitHub" for an audited checkpoint backup; nothing deployed.
