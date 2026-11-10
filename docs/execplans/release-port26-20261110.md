# Release port 26: retained camera, phone memory and catalogue projection

## Goal and constraints

In GS-release at user-stated HEAD 4ca33203, restore the accepted content of
89a52452 and its CI-stability changes; add the accepted phone-memory and
catalogue/precompute plus durable restart safeguards. GamifySurgery is read-only.
No commits, push, installs, network, agents, browser runs, SQL changes or deploy.
Preserve released port-25 conflict-loop handling and all unrelated shared work.

Authoritative reports: map-pan-zoom-phone-memory-20261109.md and
phone-heap-growth-bisect-20261109.md in docs/research; port24 disposition receipt
and local read-only commit extraction for exact renderer/CI restoration.

## Entry and ownership

- Captured 7,467 public files, .github and all 553 Level 5 inputs before edits.
  Private staging: `.local-dev/release-port26-20261110/`.
- Read-only Git archive of selected public source/test/doc paths from 89a52452
  matches every shipped path/hash in the port24 receipt. No checkout/reset.
- Both follow-up manifests match current accepted live source hashes. All
  existing follow-up preimages match the restored commit/release except
  FacilityScene, whose live baseline includes excluded character/art hunks.
- Own only restored renderer/CI source/tests/specs/config/report paths, the two
  reports' listed phone-memory/catalogue paths, strict source-guard metadata,
  and additive release coordination. Apply only the memory delta to the restored
  release Scene; preserve its released character registration/filtering.
- Exclude active non-retryable conflict/play-time cloud and migration work,
  other question/domain/art lanes, and stale main-tree Level 5 artifacts.

## Milestones and acceptance

1. Stage exact 89a52452 content; apply only accepted follow-up deltas and record
   every observed source path's disposition in port26-20261110.json.
2. Restore the exact three CI source authorizations from 89a52452 while keeping
   current port 25 cloud authorizations/history. Authorize any other accepted
   changed pinned sources; propagate linked guard digests without weakening
   capture, source, absence, or assertion checks.
3. Verify all 553 inputs, nine checkpoints, reports, evidence and launch pins
   remain exact. Run existing Level 5 integration/launch guards. Stop/report
   any pin/checkpoint/evidence failure; no rebind.
4. Run focused renderer/memory/restart/catalogue tests, all seven CI workspace
   suites with threads, all typechecks, boundaries, player build and touched
   e2e typecheck. Preserve existing failures only with exact baseline evidence.
5. Audit files/hashes, excluded cloud/migration sources and UTF-8/LF. Append
   release and current-thread handoffs with exact validation and open risks.

## Progress / next action

All five milestones completed. Published 57 immutable accepted source/test/config/
report paths and8 strict guard/fixture integrations. All prior port 25 history,
173 unrelated pin rows,74 absences and immutable captures are exact. The Scene
contains only the byte-exact accepted memory delta on top of89a52452.

Validation: seven CI suites 775 files/ 11,221 passing tests/ 0 failures/ 1 existing
skip; seven typechecks, player build (664 modules/12.67s), boundary and launcher
assertions pass. Focused memory/renderer/catalogue/restart88 and Level 5 44 pass.
Boundary subprocess adapter supplies only fresh native Git inventory bytes; no
assertion changes. Touched e2e scope reproduces exactly four existing biopsy
fixture typing errors at57/58/59/273; the remaining scope is clean.

All 553 inputs (411 clinical), canonical evidence/nine checkpoints/three reports,
launch/workload pins and inputHistory remain exact. No rebind. Release cloud
runtime,15 migrations,.github and all excluded lanes are unchanged. Final audit
and exact native validation receipts: .local-dev/release-port26-20261110/.

GS028 and current-thread handoffs appended with all68 public paths, dispositions,
hashes, exact test output and limits. No remaining implementation. Manager owns
browser/iPhone acceptance, backup and rollout. All work remains local/uncommitted.
Original owner origin/profile/path stays unchanged; no preview was opened.

## Limits

The supplied Day-20 heap results are worker measurements, not new physical-phone
evidence. These changes do not establish that jetsam caused the owner's loop.
Manager owns browser/PWA memory, context restoration and cloud acceptance.
