# GS-029 website release complete — September 29, 2026

Live URL: https://melissarowlandc-afk.github.io/GamifySurgery/
Deployed/source backup commit: 02ab585fd7204c3f97ee1614787c8a89a2b047e9.
Remote main and codex/gs029-owner-playtest-2026-09-29 verified at this commit.
Successful workflow: https://github.com/melissarowlandc-afk/GamifySurgery/actions/runs/36567164313

Owner explicitly approved the public source snapshot and deployment. Payload
acf5fbc740c0bd37357c9a67705cb436f61d16e6 contains 1412 audited files (~56MB),
including integrated concepts, rooms, pathing, stills and 96 accepted walk
frames. Rejected Gray walking pilots are excluded; approved still fallback
remains. Clinical drafts remain needs_clinician_review with prototype notice.
Private sources, saves, tooling and raw evidence were excluded from publication.

Terra release_capture prepared the isolated snapshot and workspace tests.
Sol release_finish repaired the manifest, verified browser behavior, investigated
CI timing, and performed final live smoke. Parent reviewed actual diffs, all
1412 captured/staged file hashes, source/secret exclusions, independently built
Pages, and performed authorized commits/pushes. No runtime implementation by
parent. Shared beta/source/index and owner browser/saves were preserved.

All workspace tests and Pages build pass. CI runs one test worker and gives only
the three GS028 full onsite lifecycle cases 10 seconds, based on measured CI
execution approximately twice as slow as local. Assertions and 1500-tick loops
remain unchanged. Local domain: 52 files / 813 tests; focused GS028:189 tests.
Successful CI completed deterministic tests, build, upload and deployment.

Parent verified all 13 live file SHA256 hashes against local build: HTML, JS,
CSS, health, three room assets, three stills and three walk frames. Live JS is
index-DESO7kDv.js; CSS index-Cbc49aD3.css. Sol's fresh-browser smoke passed real
prototype entry, visible unapproved notice, scene/assets, Build Mode, Save &
Close, reload and same-campaign resume. Parent reviewed JSON and screenshot.
Only optional favicon404; no app/resource failure. Existing unchanged lockfile
has six audit findings (three high/three moderate); no dependency upgrades here.

Evidence remains local under .local-dev/gs029-release/.release-evidence/,
including capture-manifest.json, live-assets.json, live/pages-release-smoke.json
and live/pages-release-build-mode.png. This release handoff/manager notes are
local; the full deployed source checkpoint is backed up on GitHub.

Use canonical remote URL above at work. Saves are browser-local and separate
from START_GAME.cmd at http://127.0.0.1:4173 and from other devices/profiles.
No campaign transfer/cloud synchronization is implied. Temporary release
preview servers were stopped; owner port4173 was untouched. GS-029 complete;
manager task and unrelated GS-006 remain open.