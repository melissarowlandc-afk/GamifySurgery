# Shared-file alert integration notes

These are the alert-owned changes in shared files. The companion
`current-shared-code-slices.md` preserves their exact current implementation
with insertion context. They are recorded as manual integration payloads
because those files also contain later, unrelated
room-capacity, retail, Periop-bed, amenity, employee-discussion, founder and
other work. Copying or diffing each whole current file would silently claim
that unrelated work as part of this checkpoint.

Use the exact task files in `files/` first, then integrate these changes into a
compatible runtime and run the focused tests named in the checkpoint README.

## `packages/game-domain/src/index.ts`

Export `./alert-cadence` and `./departure-risk-alerts`. Do not copy the other
new exports from the current mixed file unless their owning features are also
being restored.

## `packages/game-domain/src/types.ts`

Add `departureRiskWarningAtTick: number | null` immediately after
`EncounterState.walkoutThreshold`, and add `"staff_departure_risk"` to the
`DomainEvent.type` union immediately after `"staff_quit"`.

## `packages/game-domain/src/persistence.ts`

- Import `employeeDepartureRiskCadenceGroup` from `./departure-risk-alerts`.
- In `normalizeAlertHumorState`, seed `conditionLastEmittedTicks` from retained
  ambient events using `ambient:<definitionId>:<alertVariantId>`, satisfaction
  events using `success.satisfaction-above-90`, and employee departure-risk
  events using `employeeDepartureRiskCadenceGroup(employeeId)`. Only accept
  integer ticks between zero and the recovered facility tick.
- In encounter normalization, validate and recover
  `departureRiskWarningAtTick`; otherwise use `null`.
- After event history is normalized, migrate an encounter's missing warning
  timestamp from its retained `alert.patient.departure-risk` event. Keep the
  earliest retained warning tick.

Use the exact persistence implementation in `current-shared-code-slices.md`.
The amenity, room-capacity, Periop, retail and employee-discussion additions
surrounding those blocks are outside this checkpoint.

## `packages/game-domain/src/reducer.ts`

- Import the predicates and cadence helpers from `./departure-risk-alerts`.
- Initialize every new encounter with `departureRiskWarningAtTick: null`.
- Remove generic check-in-overdue, generic clinical-waiting and fixed
  satisfaction-threshold notification emission. Preserve their underlying
  timing, satisfaction penalties and walkout behavior.
- During waiting updates, call `maybeEmitPatientDepartureRiskWarning`. It emits
  `alert.patient.departure-risk` once per encounter and stores the tick before
  appending the event.
- During payroll-risk evaluation, call
  `maybeEmitEmployeeDepartureRiskWarnings`. It emits
  `alert.staff.departure-risk` only when the next unaffordable payroll posting
  could cross the real quit threshold, and stamps the per-employee cadence
  group.
- Continue recording actual patient departure internally; player-feed
  suppression lives in the alert policy and view-model layers.

The exact reducer helper bodies, initialization, cadence writes and call-site
contexts are preserved in `current-shared-code-slices.md`. The focused
regressions are preserved in `departure-risk-alerts.ts`,
`departure-risk-alerts.test.ts`,
`patient-alert-delay.test.ts`, and `advertising-insolvency.test.ts`.

## `apps/player/src/session/usePrototypeSession.ts`

Add the exported `shouldStoreSystemNotice(definitionId)` predicate, delegating
to `isPrototypeEventSuppressedFromPlayerFeed("system_notice", definitionId)`.
Apply it when initializing the campaign notice, before appending to the 20-item
system-notice queue, and when returning `systemNotices`. A successful save must
still clear an earlier save-failure notice and update the live announcement
even when the success receipt itself is filtered. Preserve save failures,
local-only announcements and unknown future warning IDs.

## `apps/player/src/styles/global.css`

Apply `global-css-alerts.patch` with `git apply --ignore-space-change` (the
captured baseline uses different line endings), plus ordinary three-way/manual
review if line positions have drifted. It is the complete M5 baseline-relative
CSS delta after removing the four adjacent employee-discussion additions. It provides the
two-second new-row accent, badge space, stable 36px header, 12px/1.35 readable
copy, stacked optional action label, disabled overflow anchoring, and
reduced-motion behavior.

## Deliberate omissions

`AppShell.tsx` already merged domain feed rows and system notices before this
task and has no alert-owned delta. Raw owner saves, browser storage, `.env`
files, dependency stores, logs, build output, screenshots, generated art and
authored clinical batches are omitted. The shared handoff is omitted because it
contains many other concurrent task banners; the exact alert plan, feature
contract and follow-up brief are archived instead.

