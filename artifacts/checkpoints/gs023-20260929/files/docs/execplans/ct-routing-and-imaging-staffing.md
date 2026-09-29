# Level-2 CT routing and imaging staffing

Status: complete locally, 2026-09-24. Owner playtest can continue on the existing
canonical origin. No commit, GitHub backup, or deployment performed.

## Goal and authority

2026-09-24 owner reports that newly diagnosed colon-cancer staging CT goes
offsite despite a built CT room, and a second imaging technician cannot be
hired. Continue owner playtest corrections within this task. Diagnose and fix
the concrete routing defect; clarify shared versus modality-specific staffing
before a staffing redesign. No GitHub push or deployment authorized.

## Constraints and repository state

Shared beta has extensive dirty source, tests, assets and documentation from
GS-023 and other tasks. Preserve all existing work; capture task-relative
baselines before edits. Read root AGENTS, current/GS-023 handoffs and GS-020
imaging plan/handoff. Preserve clinical content, IDs, approved procedure routes,
prices, existing frozen pending orders, saves, tutorial and room art.
Owner pathway stays START_GAME.cmd -> http://127.0.0.1:4173 in the same browser
profile. Do not inspect or manipulate owner saves or restart the owner server.

## Findings and decisions

- GS-020 deliberately uses shared mobile imaging technicians, including CT.
- Current catalog caps the imaging role at one employee; Management reflects
  this same limit. The owner has been asked whether to expand shared staffing,
  split modality roles, or retain one shared technician.
- All four authored colon-cancer gates permit only route.ct.outsourced.
  Runtime already supports explicit same-service onsite equivalents for
  ultrasound and owner-approved procedures; CT currently lacks that handling.
- No clinical teaching changes or speculative changes to timing/economy.
- Owner selected shared imaging techs with additional hires. Raise maximum
  employees from one to three; retain the $300 hire and $26 base salary.
  Existing technicians keep their homes and move to assigned imaging rooms.
- Terra confirmed the CT allowlist defect and existing shared mobile assignment.
  Add only the explicit same-service CT equivalent, retaining capability,
  availability, reachability and travel-time checks. Correct misleading runtime
  pending copy without changing authored clinical content.

## Milestones and ownership

1. Terra ct_staffing_audit: read-only diagnosis of CT gates, staffing and travel;
   identify the minimal fix and meaningful regressions. Complete, source-reviewed.
2. One delegated writer: implement the accepted bounded correction with focused
   regressions. Astra owns product decisions and reviews actual baseline diffs.
3. Astra independently validates applicable tests/types and records handoff.

## Acceptance and validation

Verify the actual colon-cancer order uses a reachable staffed CT room and the
shared technician travels there; prevent double booking; retain offsite fallback
when resources are unavailable and preserve pending orders on reload. Test the
chosen staffing policy if changed, plus current ultrasound/procedure regressions.
Use isolated synthetic fixtures rather than owner campaign manipulation.

## Progress and next action

Intake, diagnosis and runtime correction complete. Terra ct_staffing_audit is
sole implementation writer with baseline copies/status/hashes in
`.local-dev/ct-routing-baseline/`. Astra reviewed actual baseline-relative runtime
diffs and required correction of an intermediate wrong-role cap edit; final cap
changes only imaging technicians, preserving receptionist maximum one.

Runtime changes: one explicit service.ct onsite equivalence, cap three, a neutral
runtime label for new onsite CT orders, and route-aware chart pending copy.
Authored cases and existing pending routes are untouched. The equivalence also
permits onsite CT for existing pseudocyst CT gates; external EUS referral and
clinical narratives are unchanged. No broad service-equivalence rule is added.

Parent baseline ultrasound/procedure tests passed33/33. Parent full player suite
passes500/500 and affected domain/balance/player types pass. Initial concurrent
full domain run passed563 with one15-second surgery-center-batch timeout; its
unchanged isolated rerun passed4/4. Parent boundaries/launcher checks and isolated
production build passed (existing large-bundle advisory only). Final strengthened
CT regression and pending-copy assertions are being completed, then parent will
record final checks and handoff. No browser/owner-save proof is claimed.

Final acceptance: Astra independently passed full domain568/568 across48 files
with two workers (`.local-dev/ct-domain-final.log`), full player500/500 before the
final pending-copy regression (`.local-dev/ct-player-final.log`), then final
changed player suites9/9. Balance catalog16/16, affected domain/balance/player
types, scoped whitespace checks and final isolated production build all passed.
The final domain suite supersedes the earlier timeout. New tests prove both
onsite concurrent routes use distinct concrete technicians; a busy sole tech,
missing CT and disconnected CT fall back offsite; all four colon variants route
onsite; actual patient and technician reach CT; reload preserves timing and
assignment; result is delivered once; existing offsite orders retain dueTick.
Management shows1/3,2/3,3/3 with hiring disabled at three.

Runtime ownership: Terra ct_staffing_audit implemented the bounded correction;
Astra reviewed actual diffs and independently validated. No implementation was
left undelegated. No browser rerun or access to the owner's campaign was needed
or performed; domain movement proof uses isolated synthetic facility fixtures.

npm is unavailable in this sandbox PATH; direct node invocation of installed
Vitest, TypeScript and Vite works. Full-suite logs are under `.local-dev/ct-*`.
Final build is `.local-dev/ct-routing-final-build`; it did not replace owner
output or start/restart a server. Next: owner save/reload via START_GAME.cmd and
http://127.0.0.1:4173. Already-scheduled scans retain their routes. Changes remain
local; ask owner to say "push to GitHub" for the separately audited backup.
