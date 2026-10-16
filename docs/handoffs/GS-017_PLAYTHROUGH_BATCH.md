# GS-017 — Playthrough usability and patient flow

Status: owner-confirmed completion, reported to GS Manager on 2026-09-17: “I finished and completed GS-017.” The final alert changes and chart-close behavior are owner-accepted. The historical day-six patient shortage remains a diagnosed limitation/content follow-up, not a proven fix. Exact package approval and remote verification are complete; task is ready for archival.

## Revised alert behavior

| Notice | Eligibility | Repeat limit |
| --- | --- | --- |
| Check-in and result return | Removed from the player feed; chart state remains actionable | None shown |
| Employee hiring and praise | Removed from the player feed, including hiring aliases; raw events retained | None shown |
| Cash below $200 | Positive balance below the configured threshold; gray attention marker, ordinary chronological position | Once per operating day, including recovery and recurrence |
| Patient waiting | More than 60 facility minutes of actual idle waiting; not testing or travel | Once per continuous wait |
| Empty water cooler | Empty for more than 60 facility minutes | Once per operating day, shared across aliases and recurrences |
| Trash | Present for more than 60 facility minutes, including one remaining item after teaching | Once per operating day globally; accumulation does not add notices |
| Inner peace | More than 60 facility minutes without an actual patient arrival, after tutorial admissions unlock | Once per operating day |
| Patient amenity/staff complaints | Existing applicable condition, such as missing restroom, waiting room or receptionist | Each type once per day; different complaints at least 60 minutes apart |
| Room-upgrade complaints | Facility level 3 or later | Once per two operating days, using the shared complaint spacing |
| Ambient humor | Existing tutorial/eligibility requirements | At least 120 facility minutes between lines |

Daily limits use a rolling minimum interval based on the configured operating day (currently 600 facility minutes). They survive reload and must not reset when a different patient, room or trash item becomes the target. Current gameplay supports levels 0–2, so upgrade complaints remain silent; this revision adds no gameplay level. Employee morale, urgent walkout and system feedback retain their existing roles. Gameplay, satisfaction, clinical-review and economy timing are outside this revision.

Clinic-wide wording follow-up: amenity, comfort, reception, imaging and cleanliness complaints now speak for the clinic rather than naming a patient. Known legacy complaint rows display current clinic-wide copy while their raw history and targets remain intact. Individual patient waiting/clinical alerts and review quotations retain their specific wording. Daily cooldowns and staggering are unchanged.

The plain chronological list replaces expandable groups. Existing raw clinical records needed elsewhere remain intact. Legacy check-in/result-return and premature upgrade notices are filtered from the feed. Saved daily cooldowns survive recurrence and reload; old ambient deadlines receive a one-time migration to the new spacing without postponing them again on each reload.

## Other batch outcomes retained

- GS-011-008: one deliberate close acknowledges the displayed feedback and closes the chart, stopping on a rejected clinical transition. Terminal wrong-answer action reads “Dismiss and close chart.” Intermediate decisions, explanations, explicit correct answers and scoring are preserved. The earlier full/browser validation passed; the revised integrated build will be checked again.
- GS-011-009: Sol diagnosed current-library supply through eight game days, with 78 arrivals and completions, zero walkouts, and daily arrivals `[11,10,9,10,9,10,10,9]`. The prepared normal-tick run ended at a finite eligibility boundary. It did not reproduce the historical owner campaign; no replenishment bug was established or clinical content/review policy changed.

## Patient-supply boundary and GS-006 follow-up
The current release contains 143 concepts, 350 cases and 543 decision nodes. Counts below describe the current content filtered by stage/capabilities; the patient totals are observed across sampled deterministic seeds, not universal per-campaign limits.

| Content filter | Cases | Available concepts | Observed unseen encounters before no selection |
| --- | ---: | ---: | ---: |
| Stage 0, no optional capabilities | 164 | 49 | 40–44 |
| Stage 1, no optional capabilities | 312 | 123 | 77–80 |
| Stage 2, external services only | 328 | 131 | 81–85 |
| Stage 2, all authored capabilities | 350 | 143 | 88–92 |

Stage 0 is a theoretical selector inventory; tutorial/progression admission gates still apply. The sustained run used a prepared stage 1 clinic with a reachable examination room, fixed real review timestamp and prompt mixed answers. It did not replay the owner's opening, pacing or save. The independent GS-016 browser regression covers fresh opening/construction.

`clinical-selection.ts` deliberately admits a multistep case only when every scored concept is unseen or its saved FSRS card is due, excluding concepts in unresolved encounters. Facility days do not advance those real-time review due dates. Exhaustion can therefore occur even while an unseen concept exists, if all of its cases require a learned sibling that is not due. The selector correctly skips such a case when another eligible case exists. All 143 concepts have routine-case representation; none is missing or duplicated in the inventory.

In the sustained stage 1 seed, the remaining unseen concepts were `concept.felty-syndrome.splenectomy-for-refractory-infections` and `concept.fhh.biochemical-evaluation`. In the sampled all-capability seed, the blocked concepts were `concept.breast-cyst.asymptomatic-simple-observation`, `concept.distal-cholangiocarcinoma.operable-tissue-evaluation`, and the Felty concept. This is seed/order dependent.

Actionable GS-006 follow-up: review independently eligible encounter coverage for these concepts and audit other multistep-only concepts for the same dependency. Any new clinical cases must follow existing authoring/review gates. This batch authors no content and does not force premature reviews, reset schedules, bypass capability requirements or duplicate patients to hide exhaustion. GS-011-009 remains an owner-reported historical issue with a documented current boundary, not an owner-accepted fix.

## Validation and ownership

Pre-push recheck (2026-09-17): concurrent clinical imports are repaired. Parent reran the three affected player files (alert view models, message-board rendering and chart feedback): 46/46 passed, five domain alert files passed 33/33, and player typecheck passed. Runtime and launcher boundary checks passed. This supersedes the clinic-wording collection blocker below, which is retained as validation history.

Clinic-wide wording validation: Terra changed catalog copy, narrow legacy-display normalization and focused regressions; parent reviewed the actual baseline-relative diff and corrected normalization to preserve frozen measured cleanliness percentages. Balance-config tests passed 13/13 and its typecheck passed. Player tests could not collect and player typecheck was blocked by concurrent clinical-content imports of missing `MAMMARY_PAGET_*` exports in `brief-early-levels-batch.ts`; parent independently confirmed the same failure. This is not a passing player-validation claim. No unrelated content was edited. Baseline: `.local-dev/gs-017-clinic-wording-baseline/`. Retry `npm run test --workspace @gamify-surgery/player -- src/session/alertViewModels.test.ts --maxWorkers=1` and player typecheck after the external content imports are repaired.

Staff-action/cash follow-up: Terra suppressed all staff-hired and employee-praised event types, added low-cash to the durable rolling daily cadence, and suppressed its synthetic fallback. The gray attention marker remains on the real occurrence, with newer messages above it. Parent reviewed the snapshot-relative diff and requested the no-history/cooldown regression. Final focused results: player alert view models 29/29 (worker), UI chronology/markers 13/13 and domain operational/cadence 7/7 (parent). Domain/player/balance typechecks passed during this bounded follow-up. No new browser run or full-suite claim for these small changes. Baseline: `.local-dev/gs-017-staff-cash-baseline/`. Owner campaign and servers were untouched; changes remain local.

Final parent alert-focused domain run: 33/33 passed across five files, including migration, 60-minute boundaries, recurrence, patient wait episodes and complaint spacing. Worker player alert/UI tests: 39/39 passed; balance tests: 13/13 passed. All workspace typechecks and runtime/launcher boundary checks passed. Earlier grouped-alert screenshots and the seven-to-three-row measurement are superseded and are not evidence for this revision.

Full player suite: 437/438 passed. The remaining `buildViewModels.test.ts` assertion expects examination-room upgrade upkeep, while a concurrent balance change sets it to zero; this revision does not own that policy or test. Full domain suite: 336/337 passed. The forty-encounter surgery-center test exceeded its hardcoded 15-second limit; Terra's temporary 60-second diagnostic completed all four file tests (12.64 seconds of test execution), with the original test unchanged and temporary copy removed. This proves assertion completion, not the cause of variable runtime. Full suites are therefore not reported as green. Logs are under `.local-dev/gs-017-alert-revision-*.log`.

Isolated browser acceptance: four production scenarios passed (plain feed/legacy suppression, intermediate close/re-entry, terminal wrong and correct close), plus the DEV fresh-campaign scenario passed (tutorial completion, real examination room/door purchase and save/reload). Parent inspected all six batch screenshots, including `artifacts/screenshots/gs-017-plain-alert-cadence.png`. Logs: `.local-dev/gs-017-alert-production-e2e.log` and `.local-dev/gs-017-alert-dev-e2e.log`. The alert browser fixture validates rendering and actions; domain tests establish the actual timing rules. Original GS-016 screenshots still match their backup hashes. Post-migration domain/player typechecks and isolated production build passed.

Production validation used `http://127.0.0.1:4189`, since 4187 already had a pre-existing listener; DEV used 4188. Both owned listeners were stopped and parent verified no listening sockets on 4188/4189. Pre-existing 4187 and owner 4173 were untouched. Browser receipt: `.local-dev/gs-017-alert-browser-validation.log`.

Artifact precision: the four production scenarios exercised post-migration bundle `index-09nJZ3Or.js`. Concurrent imaging guidance edits landed afterward; parent inspected those hunks and preserved them. The final build `index-XCAhNp0X.js` passed a separate plain-alert browser smoke (1/1), latest player alert/UI tests passed again (39/39), and its temporary 4189 listener was stopped. The entire five-scenario set was not repeated for that later bundle. Final smoke log: `.local-dev/gs-017-alert-current-bundle-smoke.log`.

Terra `alerts_milestone` restored plain rendering, began configuration/state changes and performed the timeout diagnostic. Sol `patient_supply` completed the scheduler, migration, feed cleanup and focused tests and owns browser validation. Astra owns product decisions, baseline-relative review, integrated validation, this handoff and the GS-011-006 feedback entry. All substantial implementation is delegated; parent edits are planning and review artifacts.

Active plan: [playthrough usability and patient flow](../execplans/playthrough-usability-patient-flow.md). Revision baseline: `.local-dev/gs-017-alert-revision-baseline/`; original batch baseline: `.local-dev/gs-017-baseline/`. Starting branch was `beta`, HEAD `c26c96a111103d8665e33c9258ef54071d729f14`, with extensive inherited changes. Audit only owned hunks. Concurrent imaging, staff-routing, room-policy and balance changes share several touched files and are excluded from GS-017 ownership. Concurrent GS-011 intake additions in the shared feedback log are also excluded; a whole-path diff is not a staging manifest.

## Owner pathway and closeout

Use `START_GAME.cmd` → `http://127.0.0.1:4173` in the same persistent browser profile. Isolated test origins/profiles have separate storage. The owner server and campaign are not accessed, restarted or reloaded for this work, and normal build output is not replaced.

The scoped reconstruction backup is committed locally as `a226ce8fb9cf4f600381f1ea91ffded1405a127f` on `backup/gs-017-alerts-2026-09-17`. It preserves prerequisite source snapshots, owned final deltas and six synthetic screenshots; it is not a standalone runnable or merge-ready release. Automatic approval review rejected pushing this exact package to the public GamifySurgery repository without specific package/destination consent. Owner completion does not resolve that rejection. GS Manager is asking the owner the precise approval question. Do not retry the push or archive without that consent and verified remote backup. Integrated source remains in shared beta; no merge or deployment occurred.

Backup update: GS Manager relayed specific owner consent, but automatic approval review rejected that delegated consent as insufficient. Direct user approval in this task is required. Prepared tip is abb2279b3a18f808d10f29eff5ae192fc8c50bb7; audited package unchanged. No push completed or archival performed.
## Verified backup and closeout (2026-09-17)
The owner directly approved the exact package and public destination in this task. Pushed `backup/gs-017-alerts-2026-09-17`; `git ls-remote` verified [abb2279b3a18f808d10f29eff5ae192fc8c50bb7](https://github.com/melissarowlandc-afk/GamifySurgery/commit/abb2279b3a18f808d10f29eff5ae192fc8c50bb7). This supersedes the historical push-blocked notes. The 34-file scoped reconstruction package and six synthetic screenshots are backed up; no merge or deployment occurred. Shared beta/index and owner campaign/server were preserved. Owner acceptance is complete; historical patient shortage remains a diagnosed limitation, not a proven fix. Proceed to native task archival.
