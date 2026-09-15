# GS-014 website release evidence

## Verified release — owner accepted 2026-09-15

Owner acceptance: “We can complete and close 014.” GS-014 is complete.
On September 15, a focused GitHub check confirmed deployed source
`680f9cdb5c42ddb414f41d4cb571252482ebccdf` on main and accepted evidence
`b0f9626414f3c54e3a1a538e8357ed174252bd37` on
`release/gs-014-2026-09-14`; the evidence includes the source in its ancestry.
This documentation-only closeout is backed up on the release branch before
native task archival. No redeployment, main update, or other-task messages.

- Live game: https://melissarowlandc-afk.github.io/GamifySurgery/
- Exact deployed source commit: `680f9cdb5c42ddb414f41d4cb571252482ebccdf`.
  Main was fast-forwarded from `7d8dab437838250b7315a71870ec6ea2d720f3ca`
  without force or history rewrite. The same source checkpoint was pushed and
  verified on `release/gs-014-2026-09-14` before publishing.
- GitHub Pages workflow: https://github.com/melissarowlandc-afk/GamifySurgery/actions/runs/34913059963
  Job `104204626941` passed in 1m42s. Parent reviewed actual logs: locked
  `npm ci`, unchanged `npm test` (all 1,325 tests), `npm run build:pages`, artifact
  upload and deployment all passed. Deployment ID `6449097192` reports success
  at September 14, 2026, 20:26:24 EDT (`2026-09-15T00:26:24Z`). Its
  `pages_build_version` is the deployed source SHA above.
- Parent fetched the plain canonical URL and compared exact bytes for HTML,
  JS, CSS, launcher health and 11 critical PNGs. All 15 SHA-256 hashes and byte
  lengths match the captured production build. Live HTML references
  `/GamifySurgery/assets/index-BE9bf_VE.js` and
  `/GamifySurgery/assets/index-BipKEZts.css`. Founder repairs, patient/exam
  artwork, environment textures and clinic fixtures were included in this check.
- Final public-site Chrome smoke passed at 1280x720: real prototype entry,
  new disposable campaign/founder, visible rendered clinic and loaded images,
  Build Mode enter/exit, Save & Close, reload/resume, and identical campaign ID,
  founder and paused state. One scenario passed in 10.5s (11.9s including setup).
  Parent reviewed the actual test, passed-result artifact and live screenshot.
  No page errors or non-favicon request/console failures occurred.

Machine-readable workflow, deployment and live asset receipts are in the
isolated release checkout under `docs/releases/GS-014/`. Retained screenshots
and raw logs stay local in `artifacts/logs/GS014/`; they are excluded from the
public checkpoint. The opt-in regression is
`tests/e2e/pages-release-smoke.spec.ts` on the release backup branch.

## Scope and practical limitations

This publishes the integrated clinic routing, save-error reporting, visual
repairs, production artwork, and clinical concept library through September 13.
The unfinished GS-013 character surface/attachment demonstrations were excluded;
they are not integrated game features. Clinical draft labels, review metadata,
and the visible unapproved-prototype notice remain intact.

Open the live link on the laptop, choose **Enter Local Prototype**, then open or
create a campaign. **Save & Close** was verified in a disposable profile. Saves
are local to that browser/origin/profile: the desktop local game, this website,
and the laptop do not synchronize. Save export/import and the newer GS-001
durable repository are not wired into the live game yet. No owner saves were
read, uploaded, reset or modified. A missing browser favicon is a cosmetic
existing issue; the smoke exception is restricted to the favicon URL.

Shared checkout preservation was verified after deployment: branch `beta`, HEAD
`c26c96a111103d8665e33c9258ef54071d729f14`, and all 76 captured runtime paths
still match their original capture hashes. No reset, clean, stash, shared
checkout switch or shared dependency replacement occurred. Worker-owned preview
ports 58117, 58503 and 60137 are stopped; owner port 4173 was untouched.

Accountability: Terra `release_snapshot` audited/captured the source, installed
isolated locked dependencies, validated all workspaces/build, and authored and
ran the production/local/public browser smoke plus its narrow favicon correction.
Astra reviewed actual diffs, hashes, screenshots and workflow logs; performed
scoped commits/push/main integration, native live-asset/deployment verification,
and final evidence recording. Astra made only tiny evidence formatting and test
comment corrections. No qualifying implementation work was left undelegated.

Owner acceptance is recorded above. Archive only this dedicated GS-014 task
after verifying the closeout backup. Preserve all unrelated tasks and shared work.

## Source capture (2026-09-14)

- Candidate: `C:/Users/Kyle Kent/Projects/GamifySurgery-GS014-release`, an
  isolated detached worktree from beta commit
  `c26c96a111103d8665e33c9258ef54071d729f14`.
- Exact 76-path dirty-source capture, byte hashes, inclusion rationale, and
  exclusions are in `docs/releases/GS-014/source-capture.sha256` in the
  candidate. Source hashes matched before and after copying, and were rehashed
  at capture. The candidate uses its own locked `npm ci` dependencies.
- Included: integrated player/runtime/domain/session improvements, required
  production founder atlas repairs, and associated regression coverage.
  Excluded: screenshots and review artifacts; GS-013 mapping experiments;
  private/ignored clinical and photo inputs; generated source art; ComfyUI
  inputs; and unrelated documents/tools. The checked-in production atlas PNGs
  and manifest make the Pages build reproducible without publishing the
  excluded source-generation material. Existing beta clinical review labels and
  provenance were preserved; this release does not promote draft content.
- Validation: `npm test -- -- --maxWorkers=2` passed (boundaries plus 1,325
  workspace tests). The unbounded suite timed out in unrelated long tests under
  concurrent local load; no timeout/source change was made, and the same full
  suite passed with bounded Vitest concurrency. `npm run build:pages` passed:
  366 modules, two Pages asset references and 100 public build files verified
  under `/GamifySurgery/`. Build retains only Vite's existing large-chunk
  advisory.
- Publication and public-browser verification are complete above. Local and Pages
  browser storage are separate; no campaign synchronization or save
  export/import was established by this release capture.

## Isolated Pages-path smoke (2026-09-14)

- Harness: candidate-only `tests/e2e/pages-release-smoke.spec.ts`, served from
  the production `apps/player/dist` through `vite preview --base
  /GamifySurgery/` on disposable loopback port 58503. It used Playwright's
  isolated browser context at the laptop 1280 by 720 viewport; no owner browser
  profile or canonical local server was used.
- Result: PASS, one scenario in 8.2 seconds. It loaded `/GamifySurgery/`,
  entered the local prototype, created the disposable Pages Smoke Clinic,
  confirmed a nonzero visible facility canvas and successful image responses,
  entered and left Build Mode, saved and reloaded. Campaign ID, founder name,
  and paused save state matched across reload. It also captured
  `pages-production-laptop.png` under Playwright's disposable test output;
  parent visually reviewed that rendered screenshot.
- No page errors or unexpected request failures occurred. The preview emitted
  the browser's generic missing-favicon console message; the harness excludes
  only that known preview-server message while requiring all non-favicon
  request failures to be absent.
