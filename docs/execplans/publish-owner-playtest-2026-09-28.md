# Publish current owner playtest — September 28, 2026

## Goal and authorization

Owner requests updating the existing website for play at work tomorrow. This
authorizes a scoped release checkpoint, push and non-destructive Pages publishing
integration, deployment and verification. It does not authorize publishing private
sources, changing clinical approval status or replacing local saves.

The ongoing GS Manager charter requires substantive release execution in a
standalone task. Native task tools are unavailable. Manager asked whether a
release worker inside this task may perform this one release. Owner answered
"Yes" on September 29. Workflow exception is granted for this release.

## State and requirements

- Shared local root C:/Users/rowla/Projects/GamifySurgery, dirty beta. Preserve
  worktree/index, owner server4173, browser profile/saves and concurrent work.
- Publish https://melissarowlandc-afk.github.io/GamifySurgery/ through the existing
  deploy-pages.yml workflow. This is the visibly unapproved owner prototype;
  preserve needs_clinician_review labels and existing prototype notices.
- Reference previous release procedure and evidence in GS-014_WEBSITE_RELEASE.md
  and publish-latest-playable-game-2026-09-14.md, adapting current paths/tools.
- Latest handoff includes completed GS-028 pre-Endoscopy content and GS-025/015
  runtime improvements. Gait-anatomy-correction preview explicitly remains
  unintegrated; exclude preview/private art tooling and unfinished candidates.
  Inspect current runtime for actual inclusion, not historical heading alone.
- Direct git and bundled Node found. npm/gh not found on PATH; determine suitable
  installed bundled interfaces before claiming prerequisites unavailable.
- Use isolated release snapshot and explicit path/hash manifest; no shared reset,
  clean, stash, checkout switch, blanket staging or history rewrite.
- Exclude secrets, private clinical inputs, source excerpts, browser saves,
  unapproved preview-only art, unrelated review artifacts and private prompts.

## Milestones and ownership

1. Await workflow exception. If granted, Terra release worker audits/captures
   stable integrated source into an isolated workspace, verifies dependencies,
   clinical/privacy/asset scope and current remote baseline. No publish yet.
2. Worker validates complete affected suites, workspace types/boundaries and
   npm run build:pages equivalent, with isolated browser startup/save/reload.
   Parent reviews actual diff/manifests and evidence; no broad scope inference.
3. Parent makes audited checkpoint/push and safe publishing-branch integration;
   verify successful Pages workflow and exact deployed SHA.
4. Worker/parent verify live assets and disposable-profile browser startup,
   rendered clinic, build interaction and same-campaign save/reload. Do not use
   owner campaign. Update handoff, board and release evidence with exact commit,
   branch/run URL, validation, exclusions and limitations.

## Acceptance

Actual deployed commit and assets match the validated snapshot; live browser
smoke passes; shared source/index and owner saves/server preserved. Release
does not imply desktop/laptop synchronization or clinical approval. Failed
checks require repair or a precise blocker, not a claim that the site is ready.

## Progress and next action

September 29: owner granted the workflow exception. Delegate the isolated
capture/audit milestone to Terra; parent handles review and publishing.

Terra release_capture is preparing .local-dev/gs029-release from verified
remote main 680f9cdb5c42ddb414f41d4cb571252482ebccdf. Parent verified main via
git ls-remote. No publishing branch movement yet. Current integrated Gray
Overshirt/Gray Braid old gaits are explicitly rejected in latest art review;
parent chooses candidate-only exclusion of those custom walking sets, retaining
approved stills and verified existing fallback. Corrected 192px preview remains
excluded; other accepted 96 walk frames must remain unchanged. Worker to report
minimal correction and fallback behavior before edits.

Capture worker applied approved isolated-only exclusion. Official npm11.16.0
acquired in isolated tooling; locked dependencies installed. Worker reports
boundary/launcher checks and player519, workbench43, balance39, authoring81,
research83 tests pass. Clinical-content receipt-binding tests exposed three
missing updated editorial-receipt fixtures in initial runtime-only overlay.
Parent authorized adding only required public-safe provenance receipts to
candidate manifest and rerunning affected suite; remaining validation continues.
No commits/push/deployment yet.

## Validated checkpoint and actual publishing blocker — September 29

Terra release_capture prepared the isolated snapshot and candidate-only Gray
exclusion, added direct renderer fallback regression and ran workspace suites.
Sol release_finish corrected the failed initial manifest generator and supplied
reproducible actual Pages-base UI/browser proof. Parent inspected actual diff,
manifest, hashes, source exclusion, draft notices, domain JSON, browser JSON and
Build Mode screenshot; independently ran build:pages/all types/boundaries.

Validated tests: workbench43, player519, balance39, authoring81, clinical370,
research83, domain813; Sol focused fallback22 pass. Parent verified all1412 raw
file SHA256 hashes and staged Git blob bytes, with zero mismatches; secret-pattern
scan of changed text found none. Manifest covers55,934,968 bytes,96 accepted
walk frames and1054 stills. Three intentional differences from shared capture:
walk registry and two exclusion/fallback tests. Two rejected walk directories
absent. Shared beta/source/index preserved. No source changes by parent.

Pages build verifies1280 files; JS index-DESO7kDv.js, CSS index-Cbc49aD3.css.
Browser smoke proves real prototype entry, scene/assets, Build Mode, Save&Close,
same campaign identity after reload/resume. Only exact optional favicon404.
Evidence remains isolated under .local-dev/gs029-release/.release-evidence/.
Existing lockfile has six npm audit findings (3high/3moderate), unchanged by this
release; upgrades deferred, no claim of a clean dependency security audit.
Inherited clinical batch EOF blank-line whitespace preserved for fingerprints.

Parent committed exact1412 paths in isolated branch
codex/gs029-owner-playtest-2026-09-29:
acf5fbc740c0bd37357c9a67705cb436f61d16e6.
Automatic approval review rejected the push to origin, stating website
authorization did not explicitly authorize the separate source snapshot export
to that destination. No push succeeded; no workaround or direct-main retry.
Owner asked to explicitly approve this exact public repository, payload, branch
and subsequent non-force main publishing update. Answer pending.

Recovery after direct consent: confirm candidate/source SHA and remote main,
push/verify checkpoint, fast-forward main without force, verify successful
Pages run/deployed SHA, compare live asset hashes and run the reusable smoke
harness with GS_RELEASE_BASE_URL and isolated GS_RELEASE_OUTPUT_DIR.
Keep task open; release is NOT published. Sol stopped4321/4322; Terra was asked
to stop its remaining owned4319/4320 previews, leaving4173 untouched.

Cleanup confirmed: Terra stopped only verified Vite PID25436(port4319) and
PID40664(port4320); both ports closed. All four release preview ports are closed.

Owner directly replied "I approve pushing" to the exact payload/destination
request. September29 parent pushed and verified release branch at acf5fbc, then
non-force fast-forwarded remote main from680f9cd to the same exact commit.
Prior approval blocker is resolved. Active Pages run36565244826 is in progress;
no claim of completed deployment yet. Sol release_finish is ready for live smoke
after workflow success; parent verifies remote assets/deployment.

Pages run36565244826 failed before build/deploy: four domain simulation tests
timed out (three GS028 terminal-service flows at5000ms; forty-case surgery-center
flow at15000ms). All other domain assertions passed809/813; other workspaces
passed. Parent inspected GitHub annotations and job log; no deployment occurred.
Sol owns narrow candidate-only CI worker-concurrency correction and validation,
preserving all assertions/time limits. No runtime repair or test skipping.

Sol validated domain with --maxWorkers=1: 52 files / 813 tests passed, exit0,
101.13 seconds. Parent reviewed workflow-only change preserving all tests and
timeouts, committed ddfcce85d6aa25f6cc37bf8e8a0c6200fbe22039 and pushed both
release branch and main; ls-remote verified both exact SHAs. Run36566105292
is validating this commit. Live verification remains pending.


Run36566105292 failed with only three GS028 onsite lifecycle5s timeouts;
810/813 domain tests passed. Serial domain took203.19s on CI versus101.13s
local. Forty-case integration test passed12422ms (limit15000ms). Sol is
investigating narrow test-only correction while preserving lifecycle coverage.
No deployment yet; source checkpoint on remote remains valid.


Measured CI timing correction: Sol profiled three terminal-service cases at
2.544/2.629/2.652 seconds locally; CI is roughly twice as slow. Only this
three-case it.each now has a 10000ms timeout; full 1500-tick lifecycle, assertions,
clinical data and runtime remain unchanged. Focused189 tests passed in13.24s;
full domain52 files/813 tests passed in104.14s. Parent inspected exact one-line
diff and diff-check. Commit02ab585fd7204c3f97ee1614787c8a89a2b047e9 pushed and
verified on release branch and main. Sol owns final deployment monitoring/live
smoke; parent independently verifies published assets and records final outcome.

COMPLETE: run36567164313 passed exact02ab585 tests/build/upload/deploy.
Parent verified13 live file hashes against local build; Sol live fresh-browser
smoke passed entry/assets/BuildMode/save/reload/same-campaign resume. Parent
reviewed JSON and screenshot. Scoped GS-029 handoff records result and limits.
Deployed source is backed up on GitHub; manager notes/evidence remain local.

