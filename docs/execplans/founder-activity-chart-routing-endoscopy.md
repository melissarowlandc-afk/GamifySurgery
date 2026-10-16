# Founder activity, chart routing and scheduled endoscopy follow-up

## Goal and authority

Owner requests (2026-09-29): boxed founder activity labels above their head for all
meaningful actions, hide while simply idle; opening a waiting/action-ready patient's
chart immediately redirects them from clinic wandering to an examination room;
more frequent street endoscopies scaled per functional room, $600 each.

## Constraints and decisions

Preserve all dirty work, prior room-sale/capacity functionality, saved campaigns,
clinical content and other task work. No commit, push, deployment or owner-save edits.
Canonical local game remains START_GAME.cmd -> http://127.0.0.1:4173 usual profile.
Scheduled-visitor fee is $600; question-linked procedure fees remain as configured.
Default increased routine endoscopy demand: one opportunity per120game minutes per
functional Endoscopy room (previous cadence300minutes globally). Functional means
reachable built suite with supporting staffing/provider and periop capability, not
merely an empty room; busy resources should not erase demand or produce bursts.
Retain explicit waiting/testing lifecycle safeguards: do not interrupt active tests,
offsite travel or resolved departures merely because a chart is opened.

## Milestones and ownership

1. Sol domain/balance: chart selection reroutes eligible wandering/waiting patients
   immediately from current position; scheduled endoscopy demand and visitor fee.
   Own packages/game-domain and balance-config source/tests; parent reviews design.
2. Terra player: complete founder activity projection and visible boxed label anchored
   above sprite, including procedures, endoscopy, retail, bathroom, plant, conversation,
   walking, seating and trash. Hide truly idle labels. Own apps/player source/tests.
   Initially read-only preparation, then explicitly released in parallel once the
   existing state contract was confirmed stable. Disjoint player/domain ownership;
   no shared file edits. Parent integrates and reviews both milestones.
3. Isolated browser acceptance, regression/type/build checks; parent review and handoff.

## Acceptance

Natural chart-click test from wandering/return-to-waiting: chart opens once, room
reserved and patient route begins at actual position; safe unavailability handling.
Scheduled endoscopy tests for0/1/2functionalrooms, busy queues, staffing loss/sales,
$600exactly once, save compatibility and unchanged question-linked fees.
Activity label tests across meaningful founder actions and idle transitions; browser
proof of readable box over head, chart opening/reroute and scheduled visit income.

## Repository state and progress

Read AGENTS/current handoff and inspected dirty state. Prior room-capacity milestone
complete locally; latest separate GS025 backup note preserved. New task authorized
in same ongoing owner playtest conversation. Root planning/review only; implementation
delegated before edits. Next: Sol domain milestone while parent inventories player UI.

Design accepted: functional capacity=min(reachable endoscopy rooms, operational
endoscopy nurses, operational endoscopists+one founder), provided operational periop
room/nurse support exists. Busy staff still count installed capacity. Routine cadence
ceil(120/capacity), advancedceil(600/capacity); endoscopy has separate pacing from
diagnostic30minute throttle, combined2*capacity active cap/capacity waiting cap.
Visitor quotes freeze600; previous quotes and question-linked fees stay intact.
Chart detours redirect from actual retail/amenity location with stale movement cleared.
Terra read-only preparation complete and parent-approved; release player milestone
in disjoint files while Sol finishes domain. Plant-checking has no modeled action;
labels describe real activities without inventing a new simulation action.

## Implementation checkpoint

Terra M2 source complete: founderActivityPresentation helper, boxed Phaser overlay
anchored above visible bitmap bounds, idle hiding and scheduledVisitorFee catalog
label. Parent reviewed actual diffs;21focused checks and player types passed.
Parent fullplayer550/550 PASS; two added retail-priority/legacy-provider tests then
passed4/4 helper checks. Final fullplayer rerun remains after source freeze.
Sol M1 source implemented; preparing natural chartdetour and0/1/2/5capacity demand,
busy resources, support loss, fee/reload regressions. Parent reviewed scheduler,
requested legacy first-timer clamp, preserve nonendo explicit-start behavior and
pending-test chart inspection, and returning bathroom-trip coverage. Fix prior
nullable ETA test fixture before final domain typecheck.
Sol visitor_browser_acceptance owns ONLY new e2e file/localproof, preparing live
founder box/chartredirect/$600 checks. Owner4173/profile untouched. Boundary and
launcher checks PASS. Not complete until M1/final integrated/browser checks pass.

## Integrated validation checkpoint

Domain/balance implementation frozen after final existing-room detour correction.
Parent inspected task-relative reducer/service/catalog diffs against the preserved
before snapshot and reviewed worker regression tests. Full domain 1075/1075 passed;
a final post-correction rerun of four affected suites passed 66/66. Final player
552/552 and balance 41/41 passed. All three package TypeScript checks and isolated
production build passed (existing large-bundle advisory only). Sol's final focused
validation was 87/87. Browser one-click return-to-exam checks pass on desktop and
compact screens; final visible label framing and natural $600 completion proof
remain. No owner-origin/profile, launcher, clinical content, Git or deployment change.

Final review found an additional scheduler integration edge: the new installed
capacity helper followed an older position-sensitive eligibility gate. Sol was
reassigned a bounded fix and regression to keep staffed endoscopy demand stable
while nurses are away from their home rooms. Other service eligibility is unchanged.
Final acceptance waits for that fix and the browser completion proof.

## Final acceptance

Final scheduler correction reviewed: endoscopy uses staffed installed capacity
before position-sensitive service checks; other services retain existing gates.
The regression exercises the actual scheduler with both nurse roles busy away
from home. A natural completion test verifies $600 once after reload/extra ticks.
Parent final full-domain run: 1075/1075 across 60 files PASS on frozen source.
Player 552/552; balance 41/41; all three TypeScript checks; isolated Vite build;
app-boundary and launcher checks PASS. Browser final run: 4/4 PASS on desktop and
compact, including real one-click chart routing and natural endoscopy completion,
$600 cash/receipt and reload. Parent inspected readable Talking to patient box
screenshot. Final endoscopy artifact framing/server cleanup remains before handoff.
Sol implemented domain/balance and browser proof; Terra implemented player UI.
No qualifying implementation was left undelegated. Existing dirty work preserved.

Final visible-browser rerun: 4/4 PASS (1.4 minutes). Parent visually accepted the
live compact Performing endoscopy screenshot with founder/head and bordered label
fully visible, plus the desktop Talking to patient view. Earlier pause-banner
occluded screenshots are superseded by live-zoom artifacts. All implementation,
regression and visual acceptance is complete; current handoff updated. Local-only
checkpoint, no Git backup/push/deployment performed by this task.
Private browser proof server on4198 is stopped (parent verified no listener).
Owner4173 remains untouched. Task complete.
