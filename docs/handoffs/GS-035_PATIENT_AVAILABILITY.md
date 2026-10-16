# GS-035 — Patient flow and availability

Completed locally: October 7, 2026. This bounded task is technically complete.
The owner campaign, browser profile and server were not used for diagnosis or QA.

## Owner decisions

- GS-011-033 (early Level 1 rush/slowdown) is owner-resolved: with expanded
  concepts, the owner no longer notices the slowdown. The original symptom was
  silence. Desired workload is a manageable flow with useful quiet periods.
- GS-011-009 (running out of patients, including before Endoscopy) is also
  explicitly owner-resolved. No supply/content/reward/FSRS changes were requested.
- The owner selected **Add contextual pause guidance** for the remaining
  usability follow-through. It is one quiet message in the empty Waiting folder,
  with a useful next step and no new Alerts & Events notifications.

The original backlog reports and GS-017's 78-arrival/eight-day diagnosis remain
historical evidence. They do not establish the historical day-six cause. The
owner resolutions now supersede the old open statuses in the backlog and board.

## Resulting behavior

At Level 1 and later, an empty Waiting folder explains paused time, full
workload, ordinary arrival gaps, eligible visits already in progress, pending
tests/team discussions, future review eligibility, or unavailable clinic
capabilities/content. It suggests a short next step appropriate to that state.
Level 0 tutorial guidance, nonempty folders and Existing Patients' empty text
retain their behavior. The desktop style exempts only the new guidance from
the existing empty-placeholder suppression; phone placeholders remain visible.

The pure projection applies current stage/capability/workload rules and reserves
every scored concept in unresolved encounters and active team discussions. A
future date is the earliest complete currently gate-compatible case's possible
review eligibility: maximum due date within each case, then minimum across
unblocked cases. It is explicitly labelled **Next review eligibility ...
(real-world time)**. Arrival timing can vary; game days do not move FSRS dates.
Outside service and retail visitors remain separate from educational supply.

No arrival interval, content meaning/ID/status, review rule, payout, test duration,
scheduling, persistent state, alert, renderer, artwork or launcher was changed.

## Ownership and reviewed changes

Sol `eligibility_diagnosis` completed read-only eligibility/UI diagnosis, then the
single approved implementation milestone: availability helper and view model,
focused tests, narrow prop wiring and the required desktop visibility correction.
Parent reviewed the actual helper, all integration/CSS hunks and test fixtures,
implemented isolated browser tests, and independently repeated validation.
Parent replaced one CSS-source assertion with a meaningful browser visibility
check after handback. No production source changed after the worker's correction.

New source/test files: domain `routine-patient-availability.ts` and its test;
player `patientAvailabilityViewModel.ts` and its test; browser
`tests/e2e/patient-availability-guidance.spec.ts`. Small existing-file hunks are in
domain `index.ts` and player `App.tsx`, `AppShell.tsx`, `viewModels.ts`,
`PatientLists.tsx`, `global.css`.

Ignored review evidence: `.local-dev/gs035/eligibility-guidance-baseline/`,
`eligibility-guidance-review/actual-task-relative.patch`, worker review manifest,
final parent reviewed-file hashes, runtime inventory and browser screenshots.
The actual index diff also contains a concurrent `diagnostic-timing` export;
that line is explicitly excluded from GS-035 ownership and was preserved.

## Exact assessment baseline and limits

- Shared `beta` HEAD remained `d0fc49b92a92d628f1ca025e9283589dfd887157`.
  Dirty/untracked entries rose from approximately 590 to 614 during concurrent
  work; this is not a clean or fully backed-up runnable checkpoint.
- Last accepted GS-028 receipt at intake: 291 concepts / 856 cases / 1,135
  decisions; Level 1 ordinary supply 746 cases / 247 concepts.
- GS-028's October 7 assembly changed during assessment. Independent in-memory
  source-module enumeration at 4:46 PM America/New_York found **311 concepts /
  934 cases / 1,215 decisions**, including **824 ordinary Level 1 cases / 267
  concepts** without optional capabilities. Assembly SHA256 stayed
  `EE8028BD320ABC72DCF7A38F4D3F4318650AC1AAC62CB6954E5F8CD3F47BD80F` through
  final checks. Its content-production acceptance remains with GS-028.
- The assembled release is `clinical.synthetic.prototype.v1`, globally
  `synthetic_unapproved_prototype`; new AI-assisted content remains
  `needs_clinician_review`. GS-035 gives no clinical or public-release approval.
- The verified October 3 GS-028 GitHub receipt is authoring/provenance backup
  `c5cd6251caf2910bd183b39c571792a00abb50fe`; it does not back up the current
  interleaved runtime integration. No GS-035 commit/push was created.
- Disk bundle remained `index-WGfeOFQq.js`, modified October 5 UTC, SHA256
  `1B60B5E8E6B7514E40AF18757F80126E831335C71B76093F334C0094B064C362`.
  Browser QA used current Vite source, not that disk bundle or the owner's loaded
  page. No new production build or full broad-suite claim is made.
- No new reproduction of the historical owner campaign is claimed. The initial
  root-level diagnostic accidentally included archived fixtures and was excluded
  from acceptance. Current owner playtesting supplied resolution of issues 1/2.

## Final independent validation

- Domain **22/22 PASS**: active-package availability and clinical-selection tests.
- Player **22/22 PASS**: availability view model/rendering, visual components and
  learning-card formatting, after the parent test refinement.
- Domain and player typechecks **PASS**. Initial concurrent diagnostic-timing
  errors were repaired externally before final independent checks; GS-035 did
  not change those files.
- Runtime dependency boundaries (3,849 tracked paths) and canonical launcher
  health contract/protocol 1 **PASS**.
- The CSS change is one clean baseline-relative selector hunk. A whole
  HEAD-relative whitespace scan reports pre-existing trailing whitespace in
  `.employee-discussion-tab .patient-tab-copy small` outside this task; it was
  preserved rather than folding unrelated cleanup into GS-035.
- Final isolated Chrome browser **3/3 PASS**: desktop 1280px and phone 390px
  visibility/placeholder behavior, ordinary gaps and explicitly labelled future
  reviews. Parent visually reviewed the desktop and phone screenshots.
- Disposable `http://127.0.0.1:5173` test server used fresh isolated profiles and
  was closed; no listener remained. Existing saves and owner 4173/private 4174
  pathways were not touched or substituted for owner playtesting.

## Next boundary

Use `START_GAME.cmd` -> exactly `http://127.0.0.1:4173` in the same persistent
browser profile for owner playtesting. Test-origin storage is separate. This
validated display checkpoint is **LOCAL ONLY**; say **push to GitHub** for the
required scoped audit and verified backup. No merge/deployment/release/Pages
publication was authorized. Close GS-035; any distinct next task must inspect
the dirty tree and current handoff before editing.
