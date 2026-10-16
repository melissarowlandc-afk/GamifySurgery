# GS-035 — Patient availability guidance

## Goal and owner agreement — October 7, 2026

The owner now considers the historical Level 1 slowdown (GS-011-033) and patient
shortage before Endoscopy (GS-011-009) resolved after the concept-library
expansion. Retain a manageable flow with occasional useful quiet periods. Do not
tune arrivals, add clinical content, alter FSRS eligibility, or change rewards.

The owner chose **Add contextual pause guidance**: one calm message in the empty
Waiting folder when the current reason can be established, with a useful next
step, no new alert events and no guaranteed patient-arrival time. This is the only
game implementation milestone in GS-035.

## Repository state and boundaries

- Shared checkout: `beta`; HEAD at assessment was
  `d0fc49b92a92d628f1ca025e9283589dfd887157`. Approximately 590 dirty/untracked
  entries; preserve all concurrent user/Claude/GS-028/GS-034/GS-029/art work.
- Last accepted content receipt: 291 concepts / 856 cases / 1,135 decisions;
  ordinary stage-1 pool 746 cases / 247 concepts. The October 7 GS-028 package
  adds 20 concepts / 78 cases / 80 decisions and its runtime assembly changed
  during this assessment. Treat its validation/clinical acceptance separately;
  the global release remains `synthetic_unapproved_prototype`.
- The initial source assembly did not include the new batch; later assembly did.
  Observed assembly SHA256:
  `EE8028BD320ABC72DCF7A38F4D3F4318650AC1AAC62CB6954E5F8CD3F47BD80F`.
  Do not tune from a moving inventory or promote draft clinical content.
- Existing disk bundle: `apps/player/dist/assets/index-WGfeOFQq.js`, modified
  October 5 UTC, SHA256
  `1B60B5E8E6B7514E40AF18757F80126E831335C71B76093F334C0094B064C362`.
  No claim that this identifies the owner's currently loaded page. The owner
  campaign/browser/server was not opened, reloaded or changed for diagnosis.
- GS-034 owns timing/scheduling; GS-029 owns Alerts & Events; GS-033/Claude own
  renderer/art/motion. No edits to those modules or clinical authoring files.
- Preserve saves, frozen encounters/orders, learning histories, patient IDs,
  approved art and all other dirty work. No push/merge/deploy/release/install.
- Owner pathway stays `START_GAME.cmd` -> `http://127.0.0.1:4173` in the same
  persistent browser profile. Any test server/context is isolated and temporary.

## Findings and decisions

- Current routine cadence is 60 facility minutes with +/-15 variation before
  advertising adjustments; no time-in-level decay is implemented. This code
  finding does not establish the cause of the historical owner report.
- GS-017's existing 78-arrival/eight-day diagnosis remains historical evidence,
  not a new reproduction of the owner's campaign.
- Empty patient folders currently say only `No charts`. Footer explains workload
  capacity; opened pending charts explain tests; development-only FSRS inspector
  shows individual due dates. None explains ongoing empty-folder supply.
- Use actual admission and clinical eligibility for guidance. Do not infer
  eligibility from a raw count of unseen concepts or the earliest individual
  card due date. Every scored concept in an encounter must be unseen/due; active
  encounters/discussions and capability/stage gates apply.
- If a future time is shown, calculate the earliest complete case's possible
  real-world review eligibility under current gates and label it accordingly.
  Never promise an exact arrival, completion or future unlock date.
- Retain Level 0 tutorial guidance. Render contextual guidance in the empty
  Waiting folder at Level 1 and later only. Existing Patients empty state is
  unchanged. A known next step should be short and useful to the player.

## Milestones and ownership

1. Completed read-only assessment and owner discussion. Sol
   `eligibility_diagnosis` traced selection and current UI; parent inspected the
   actual empty-state/workload code and accepted the report.
2. Single Sol writer: additive availability selector/helper, narrow index export,
   player availability view model and Waiting-folder rendering/wiring, plus
   meaningful targeted tests. Own only assigned availability files and small
   integration hunks; do not edit reducer/timing/scheduling/alerts/clinical/art.
3. Parent reviews task-relative baseline diff, independently validates meaningful
   eligibility/display cases and isolated browser rendering, then updates the
   backlog, scoped handoff and current handoff. No worker edits durable plans.
   Parent owns `tests/e2e/patient-availability-guidance.spec.ts` and the ignored
   `.local-dev/gs035/browser-run.mjs` disposable-server runner. The writer also
   owns the one-prop integration in `apps/player/src/App.tsx`.

## Acceptance and validation

- Useful, non-alarming guidance for paused time, ordinary cadence, full workload,
  existing/pending visits, future reviews and capability-blocked/finite supply.
- Never claim advertising fixes learning exhaustion. Do not report a future
  review date from a case blocked by an active concept, absent capability or
  not-due sibling. Mixed-concept tests verify complete-case date calculation.
- Service-only visitors/retail do not create educational review opportunities.
- Existing nonempty folders and Level 0 tutorial behavior are preserved; no
  automatic alert/event, repeated announcement, command or save mutation.
- Targeted domain and player tests, both typechecks, isolated UI/browser fixture
  with empty/nonempty folders and narrow viewport, and relevant dependency
  contracts. Keep test discovery scoped to the active package; root substring
  matching can discover historical copies under `.local-dev`.
- Record current content baseline and concurrent-validation limitations again
  before acceptance; do not claim a full broad suite if unrelated work blocks it.

## Progress, discoveries and next action

Owner agreement obtained for the display-only milestone. Sol
`eligibility_diagnosis` is implementing the pure helper, view model, narrow prop
wiring and targeted tests. Existing-file baselines are byte-exact under ignored
`.local-dev/gs035/eligibility-guidance-baseline`; all integration files still
matched baseline at the worker's first progress report. Parent owns separate
browser fixtures: three tests collected successfully without opening a page.
Both historical reports are explicitly owner-resolved in the backlog and board.
The initial root-level eight-day diagnostic invocation accidentally discovered
archived copies as well as the active fixture: six tests passed, 21 archived
suites failed collection, and content assembly changed concurrently. This is not
a clean current-baseline validation receipt and is excluded from acceptance.
No owner campaign was accessed. Next: worker completes the scoped implementation
and validation; parent reviews its actual diff and executes isolated browser QA.

## Completion — October 7, 2026

All three milestones complete locally. Sol `eligibility_diagnosis` implemented
the pure availability helper, player projection, narrow prop wiring, focused
tests and a desktop visibility correction. Parent inspected actual task-relative
diffs, kept the concurrent diagnostic-timing index export outside this task's
ownership, and replaced a CSS-source assertion with a browser behavior check.

Final independent validation: domain22/22 and player22/22 PASS, both typechecks
PASS, dependency/launcher contracts PASS, isolated Chrome browser3/3 PASS with
desktop1280/phone390 screenshots reviewed. The desktop test originally caught
existing compact CSS suppressing the new paragraph; only the new guidance is now
exempt, while original placeholders retain their display behavior. Earlier
concurrent timing type errors were repaired externally before the final checks.

Independent source-module inventory at4:46PM America/New_York:311 concepts /
934 cases /1215 decisions; ordinary stage1 pool824 cases /267 concepts without
optional capabilities. Clinical assembly hash remains the one above and the
global release remains an unapproved prototype. Owner disk bundle/HEAD remain
the recorded baseline. No cadence tuning uses these moving content counts.

Final browser origin5173 had fresh test profiles and is closed; no test listener
remains. Owner pathway/saves/server are unchanged. No production build or broad
suite claim is made; no commit/push/deploy/release. Detailed evidence and exact
limits are in `docs/handoffs/GS-035_PATIENT_AVAILABILITY.md`. This checkpoint is
local only; remind the owner to say **push to GitHub** for an audited backup.
No implementation remains; close the bounded task.
